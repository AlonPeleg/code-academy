---
title: Pipelines
summary: Chain preprocessing and a model into one object so the steps always run in the right order and nothing leaks from the test data.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      from sklearn.datasets import load_wine
      from sklearn.model_selection import KFold, cross_val_score, train_test_split
      from sklearn.neighbors import KNeighborsClassifier
      from sklearn.pipeline import make_pipeline
      from sklearn.preprocessing import StandardScaler

      wine = load_wine()
      X, y = wine.data, wine.target
      cv = KFold(n_splits=5, shuffle=True, random_state=0)

      # 1. Cross-validate a plain KNeighborsClassifier(n_neighbors=5) (no scaling) with cv
      #    and print f"unscaled {mean:.2f}".

      # 2. Build pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)).
      #    Print list(pipe.named_steps), then cross-validate the whole pipe with cv
      #    and print f"pipeline {mean:.2f}".

      # 3. Split 70/30 (test_size=0.3, random_state=0, stratify=y), fit the pipeline on the
      #    training part and print f"test {accuracy:.2f}".
      #    Also print the first mean learned by the scaler: pipe.named_steps["standardscaler"].mean_[0],
      #    rounded to 2 decimals.

      # 4. For k in [1, 5, 9, 15] change the neighbours inside the pipeline with
      #    pipe.set_params(kneighborsclassifier__n_neighbors=k), cross-validate it
      #    and print f"k={k} {mean:.2f}".
check:
  output: |
    unscaled 0.71
    ['standardscaler', 'kneighborsclassifier']
    pipeline 0.97
    test 0.96
    13.03
    k=1 0.95
    k=5 0.97
    k=9 0.97
    k=15 0.96
  code:
    - { pattern: 'make_pipeline\s*\(|Pipeline\s*\(', message: "Build a pipeline with make_pipeline(StandardScaler(), KNeighborsClassifier(...))." }
    - { pattern: 'StandardScaler\s*\(', message: "Put a StandardScaler() inside the pipeline." }
    - { pattern: 'named_steps', message: "Use pipe.named_steps to look inside the pipeline." }
    - { pattern: 'set_params\s*\(', message: "Use pipe.set_params(kneighborsclassifier__n_neighbors=k)." }
hints:
  - "A pipeline is used exactly like a model: fit, predict, score and cross_val_score all work on it. Inside, the scaler is fitted on the training part only, then the model is trained on the scaled numbers."
  - "pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)); cross_val_score(pipe, X, y, cv=cv).mean(). Step names are lowercase class names: 'standardscaler' and 'kneighborsclassifier'."
  - "pipe.named_steps['standardscaler'].mean_[0]   pipe.set_params(kneighborsclassifier__n_neighbors=k)   scores = cross_val_score(pipe, X, y, cv=cv)   print(f'k={k} {scores.mean():.2f}')"
solution:
  - name: main.py
    code: |
      from sklearn.datasets import load_wine
      from sklearn.model_selection import KFold, cross_val_score, train_test_split
      from sklearn.neighbors import KNeighborsClassifier
      from sklearn.pipeline import make_pipeline
      from sklearn.preprocessing import StandardScaler

      wine = load_wine()
      X, y = wine.data, wine.target
      cv = KFold(n_splits=5, shuffle=True, random_state=0)

      raw = KNeighborsClassifier(n_neighbors=5)
      print(f"unscaled {cross_val_score(raw, X, y, cv=cv).mean():.2f}")

      pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))
      print(list(pipe.named_steps))
      print(f"pipeline {cross_val_score(pipe, X, y, cv=cv).mean():.2f}")

      X_train, X_test, y_train, y_test = train_test_split(
          X, y, test_size=0.3, random_state=0, stratify=y)
      pipe.fit(X_train, y_train)
      print(f"test {pipe.score(X_test, y_test):.2f}")
      print(pipe.named_steps["standardscaler"].mean_[0].round(2))

      for k in [1, 5, 9, 15]:
          pipe.set_params(kneighborsclassifier__n_neighbors=k)
          scores = cross_val_score(pipe, X, y, cv=cv)
          print(f"k={k} {scores.mean():.2f}")
quiz:
  - q: "What is the main benefit of putting the scaler and the model in one pipeline?"
    options: ["The code runs ten times faster", "The scaler is re-fitted on the training part only, inside every fold, so test data cannot leak in", "Pipelines make the model more accurate by themselves"]
    answer: 1
  - q: "You call pipe.fit(X_train, y_train). What happens to the scaler step?"
    options: ["It learns means and standard deviations from X_train, transforms X_train, and hands it to the model", "It is skipped", "It learns from X_test too"]
    answer: 0
  - q: "What is the name of the parameter that sets n_neighbors of the KNN step in a make_pipeline pipeline?"
    options: ["n_neighbors", "kneighborsclassifier__n_neighbors", "pipe.n_neighbors"]
    answer: 1
    explain: "The name is the step name, two underscores, then the parameter name."
  - q: "When you call pipe.predict(X_new), the scaler"
    options: ["Re-fits itself on X_new", "Is ignored", "Only transforms X_new, using the numbers it learned during fit"]
    answer: 2
---

So far you scaled the data, then trained a model, then remembered to scale the test data the same way. Every extra step is another chance to forget one. A **pipeline** packs the steps into a single object so you cannot get the order wrong, and cross-validation stays honest.

## What is a pipeline?

A pipeline is a list of steps where every step except the last is a *transformer* (something with `fit` and `transform`, like `StandardScaler`) and the last step is the *model* (something with `fit` and `predict`). `make_pipeline` builds one and gives each step a name automatically, which is the lowercase class name:

```python
from sklearn.pipeline import make_pipeline
pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))
print(list(pipe.named_steps))   # prints: ['standardscaler', 'kneighborsclassifier']
```

The pipeline then behaves like one model:

* `pipe.fit(X_train, y_train)` fits the scaler on `X_train`, transforms `X_train`, then trains the KNN on the transformed numbers.
* `pipe.predict(X_new)` and `pipe.score(X_test, y_test)` transform the new rows with the scaler's *already learned* numbers and then ask the model. The scaler never re-learns from them.
* You can pass `pipe` to `cross_val_score` and later to grid searches, just like any model.

## Why this prevents leakage

**Data leakage** means information from the test data sneaks into training. The classic form: you scale the *whole* dataset first (`StandardScaler().fit_transform(X)`) and only then cross-validate. The scaler has seen the test rows when computing the means, so every test fold is slightly "pre-learned". With scaling the effect is usually small, but with feature selection, imputation or target-based encoding it can inflate scores badly, and the model then disappoints in real use. Inside a pipeline, `cross_val_score` re-fits *every* step on the training folds only, so the test fold stays untouched. That is the whole point.

## Seeing the difference

On the wine data, KNN decides by distances between wines. The `proline` column is in the hundreds, while others like `hue` are around 1, so without scaling proline dominates every distance. Cross-validated accuracy is about 0.71 unscaled and about 0.97 with the pipeline: the same model and the same data, a huge gain just from preprocessing.

## Reaching inside

* `pipe.named_steps["standardscaler"]` returns the scaler object, so `.mean_[0]` shows the learned mean of the first feature (13.03 for alcohol).
* `pipe.set_params(kneighborsclassifier__n_neighbors=9)` changes a setting of a step. The format is **step name, two underscores, parameter name**. This is also how grid searches reach into pipelines.

For tables with both number and text columns, a `ColumnTransformer` applies different preprocessing to different columns and is then used as the first step of a `Pipeline`:

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
prep = ColumnTransformer([
    ("num", StandardScaler(), ["size", "age"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
])
model = Pipeline([("prep", prep), ("clf", LogisticRegression())])
model.fit(df[["size", "age", "city"]], df["expensive"])   # raw table in, predictions out
```

Now the model accepts the raw table, even a city it has never seen, and does the encoding and scaling itself.

## How to read the output

* `unscaled` versus `pipeline` is the effect of preprocessing alone. If both were equal, scaling would not matter for this model.
* `test` is a final check on rows that never touched the scaler during fitting.
* The `k=...` lines compare neighbour counts fairly because each fold re-scales independently. Choose a middle value, not the single best number.

> **Watch out:**
> - `ValueError: Invalid parameter 'n_neighbors' for estimator Pipeline` means you forgot the step name prefix and double underscore.
> - Steps are passed as a list of objects in `make_pipeline` but as `("name", object)` tuples in `Pipeline`. Mixing them up gives a `TypeError`.
> - Do not call `fit_transform` on the scaler by hand and then also put it in the pipeline. That scales twice.
> - Do not preprocess on the full dataset "just to look at it" and then cross-validate on the result.
> - With `make_pipeline`, two steps of the same class get numbered names like `standardscaler-1` and `standardscaler-2`; check `pipe.named_steps` if you are unsure.

> **Your turn:** compare KNN on the raw wine features with a scaler-plus-KNN pipeline using the same 5 folds, fit the pipeline on a 70/30 split and peek at the scaler's learned mean, then tune the number of neighbours through the pipeline with `set_params`.
