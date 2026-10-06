---
title: "Step 6: Compare models with cross-validation"
summary: "Put linear regression, a decision tree and a random forest through the same cross-validation and pick the winner fairly."
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt
      from sklearn.compose import ColumnTransformer
      from sklearn.ensemble import RandomForestRegressor
      from sklearn.linear_model import LinearRegression
      from sklearn.metrics import mean_absolute_error
      from sklearn.model_selection import KFold
      from sklearn.model_selection import cross_val_score
      from sklearn.model_selection import train_test_split
      from sklearn.pipeline import Pipeline
      from sklearn.preprocessing import OneHotEncoder, StandardScaler
      from sklearn.tree import DecisionTreeRegressor

      # ---- PROVIDED: builds the made-up housing table (prices in thousands). ----
      # ---- This part is provided, no need to change it. ----
      def make_data():
          rng = np.random.default_rng(42)
          n = 300
          area = rng.normal(95, 28, n).clip(35, 220).round(0)
          bedrooms = np.clip(np.round(area / 32 + rng.normal(0, 0.7, n)), 1, 6).astype(int)
          age = rng.integers(0, 61, n).astype(float)
          dist = rng.gamma(2.0, 3.0, n).clip(0.5, 25).round(1)
          hood = rng.choice(["Riverside", "Old Town", "Hilltop"], n, p=[0.4, 0.35, 0.25])
          bonus = pd.Series(hood).map({"Riverside": 45.0, "Old Town": 20.0, "Hilltop": 0.0}).to_numpy()
          price = (40 + 3.0 * area + 0.004 * (area - 95) ** 2 + 9 * bedrooms - 1.1 * age
                   - 18 * np.sqrt(dist) + bonus + rng.normal(0, 22, n)).round(1)
          df = pd.DataFrame({"area_m2": area, "bedrooms": bedrooms, "age_years": age,
                             "distance_to_center_km": dist, "neighbourhood": hood, "price_k": price})
          df.loc[[7, 33, 90, 150, 201, 260], "age_years"] = np.nan       # a few missing values
          df.loc[[12, 58, 175, 240], "distance_to_center_km"] = np.nan
          df.loc[17, "area_m2"] = 1450.0                                  # an absurd typo
          return pd.concat([df, df.iloc[[5, 40, 120]]], ignore_index=True)  # 3 duplicate rows
      # ---- END OF PROVIDED PART ----

      df = make_data()

      # --- cleaning (step 2) ---
      df = df.drop_duplicates()
      df = df[df["area_m2"] <= 400]
      for col in ["age_years", "distance_to_center_km"]:
          df[col] = df[col].fillna(df[col].median())
      df = df.reset_index(drop=True)

      # --- train/test split (step 4) ---
      y = df["price_k"]
      X = df.drop(columns="price_k")
      X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

      # --- features and preprocessing (step 5) ---
      def add_features(frame):
          frame = frame.copy()
          frame["area_per_bedroom"] = frame["area_m2"] / frame["bedrooms"]
          return frame

      X_train = add_features(X_train)
      X_test = add_features(X_test)

      numeric_cols = ["area_m2", "bedrooms", "age_years", "distance_to_center_km", "area_per_bedroom"]
      prep = ColumnTransformer([
          ("num", StandardScaler(), numeric_cols),
          ("hood", OneHotEncoder(handle_unknown="ignore"), ["neighbourhood"]),
      ])

      # 1. Make a dictionary models with three entries:
      #      "linear": a LinearRegression
      #      "tree":   a DecisionTreeRegressor with max_depth 5 and random_state 42
      #      "forest": a RandomForestRegressor with n_estimators 50, max_depth 8 and random_state 42

      # 2. Make cv, a KFold splitter with 5 splits, shuffle on and random_state 42, and an empty dict results.
      #    Loop over models.items(). For each one, build Pipeline([("prep", prep), ("model", estimator)]),
      #    score it with cross_val_score(pipe, X_train, y_train, cv=cv, scoring="neg_mean_absolute_error"),
      #    flip the sign, store the MEAN in results[name] and print f"{name}: CV MAE {mean:.1f}".

      # 3. best_name is the key of results with the smallest value (min with key=results.get).
      #    Print "best model:" and then three comparisons as True/False:
      #      "forest beats tree:"        forest MAE < tree MAE
      #      "simple beats flexible:"    linear MAE < forest MAE

      # 4. Re-score the winner (models[best_name] inside a pipeline) with the same cv, keep the 5 fold
      #    errors in winner_scores and print "winner worst fold is below 30:" (largest fold error < 30).
check:
  output: |
    linear: CV MAE 18.9
    tree: CV MAE 31.0
    forest: CV MAE 25.0
    best model: linear
    forest beats tree: True
    simple beats flexible: True
    winner worst fold is below 30: True
  code:
    - { pattern: "KFold\\s*\\(", message: "Create the splitter with KFold(...)." }
    - { pattern: "DecisionTreeRegressor\\s*\\(", message: "Add a DecisionTreeRegressor(...) to the models." }
    - { pattern: "RandomForestRegressor\\s*\\(", message: "Add a RandomForestRegressor(...) to the models." }
    - { pattern: "for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\s*\\(", message: "Loop with for name, estimator in models.items()." }
    - { pattern: "min\\s*\\(", message: "Pick the best with min(results, key=results.get)." }
hints:
  - "Fair comparison means: same data, same folds, same metric for every candidate. Put the candidates in a dictionary and score them in a loop, each inside its own Pipeline with the same preprocessing."
  - "Pipeline([(\"prep\", prep), (\"model\", estimator)]) inside the loop, then scores = -cross_val_score(pipe, X_train, y_train, cv=cv, scoring=\"neg_mean_absolute_error\"). Save scores.mean() in results[name]. The best name is min(results, key=results.get)."
  - "for name, estimator in models.items():   pipe = Pipeline([(\"prep\", prep), (\"model\", estimator)])   results[name] = scores.mean()   print(f\"{name}: CV MAE {scores.mean():.1f}\")   best_name = min(results, key=results.get)   print(\"winner worst fold is below 30:\", winner_scores.max() < 30)"
solution:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt
      from sklearn.compose import ColumnTransformer
      from sklearn.ensemble import RandomForestRegressor
      from sklearn.linear_model import LinearRegression
      from sklearn.metrics import mean_absolute_error
      from sklearn.model_selection import KFold
      from sklearn.model_selection import cross_val_score
      from sklearn.model_selection import train_test_split
      from sklearn.pipeline import Pipeline
      from sklearn.preprocessing import OneHotEncoder, StandardScaler
      from sklearn.tree import DecisionTreeRegressor

      # ---- PROVIDED: builds the made-up housing table (prices in thousands). ----
      # ---- This part is provided, no need to change it. ----
      def make_data():
          rng = np.random.default_rng(42)
          n = 300
          area = rng.normal(95, 28, n).clip(35, 220).round(0)
          bedrooms = np.clip(np.round(area / 32 + rng.normal(0, 0.7, n)), 1, 6).astype(int)
          age = rng.integers(0, 61, n).astype(float)
          dist = rng.gamma(2.0, 3.0, n).clip(0.5, 25).round(1)
          hood = rng.choice(["Riverside", "Old Town", "Hilltop"], n, p=[0.4, 0.35, 0.25])
          bonus = pd.Series(hood).map({"Riverside": 45.0, "Old Town": 20.0, "Hilltop": 0.0}).to_numpy()
          price = (40 + 3.0 * area + 0.004 * (area - 95) ** 2 + 9 * bedrooms - 1.1 * age
                   - 18 * np.sqrt(dist) + bonus + rng.normal(0, 22, n)).round(1)
          df = pd.DataFrame({"area_m2": area, "bedrooms": bedrooms, "age_years": age,
                             "distance_to_center_km": dist, "neighbourhood": hood, "price_k": price})
          df.loc[[7, 33, 90, 150, 201, 260], "age_years"] = np.nan       # a few missing values
          df.loc[[12, 58, 175, 240], "distance_to_center_km"] = np.nan
          df.loc[17, "area_m2"] = 1450.0                                  # an absurd typo
          return pd.concat([df, df.iloc[[5, 40, 120]]], ignore_index=True)  # 3 duplicate rows
      # ---- END OF PROVIDED PART ----

      df = make_data()

      # --- cleaning (step 2) ---
      df = df.drop_duplicates()
      df = df[df["area_m2"] <= 400]
      for col in ["age_years", "distance_to_center_km"]:
          df[col] = df[col].fillna(df[col].median())
      df = df.reset_index(drop=True)

      # --- train/test split (step 4) ---
      y = df["price_k"]
      X = df.drop(columns="price_k")
      X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

      # --- features and preprocessing (step 5) ---
      def add_features(frame):
          frame = frame.copy()
          frame["area_per_bedroom"] = frame["area_m2"] / frame["bedrooms"]
          return frame

      X_train = add_features(X_train)
      X_test = add_features(X_test)

      numeric_cols = ["area_m2", "bedrooms", "age_years", "distance_to_center_km", "area_per_bedroom"]
      prep = ColumnTransformer([
          ("num", StandardScaler(), numeric_cols),
          ("hood", OneHotEncoder(handle_unknown="ignore"), ["neighbourhood"]),
      ])

      # 1. The candidates. The tree and forest are limited in depth so they cannot just memorise.
      models = {
          "linear": LinearRegression(),
          "tree": DecisionTreeRegressor(max_depth=5, random_state=42),
          "forest": RandomForestRegressor(n_estimators=50, max_depth=8, random_state=42),
      }

      # 2. The same fair test for everyone: 5-fold cross-validation with shuffling
      cv = KFold(n_splits=5, shuffle=True, random_state=42)
      results = {}
      for name, estimator in models.items():
          pipe = Pipeline([("prep", prep), ("model", estimator)])
          scores = -cross_val_score(pipe, X_train, y_train, cv=cv, scoring="neg_mean_absolute_error")
          results[name] = scores.mean()
          print(f"{name}: CV MAE {scores.mean():.1f}")

      # 3. Pick the winner
      best_name = min(results, key=results.get)
      print("best model:", best_name)
      print("forest beats tree:", results["forest"] < results["tree"])
      print("simple beats flexible:", results["linear"] < results["forest"])

      # 4. Is the winner stable across folds?
      winner_scores = -cross_val_score(Pipeline([("prep", prep), ("model", models[best_name])]),
                                       X_train, y_train, cv=cv, scoring="neg_mean_absolute_error")
      print("winner worst fold is below 30:", winner_scores.max() < 30)
quiz:
  - q: "Why do we choose between models with cross-validation on the training data and not with the test set?"
    options: ["The test set is too big", "Cross-validation is always more accurate", "Choosing on the test set uses it up, so its score no longer tells the truth about new data"]
    answer: 2
    explain: "Every time you let the test set influence a decision, it stops being a fair judge."
  - q: "Linear regression beat the random forest here. Which explanation fits best?"
    options: ["The relationships are close to straight lines and there are only 239 noisy training rows, so the simple model generalises best", "Forests are always worse", "Linear regression is newer"]
    answer: 0
    explain: "The best model depends on the data. Always measure rather than assume."
  - q: "What is the point of limiting max_depth of the tree and the forest?"
    options: ["To make them predict higher prices", "To stop them from memorising the training rows (overfitting)", "scikit-learn refuses deeper trees"]
    answer: 1
---
Which algorithm is best? Nobody can tell you in advance, because it depends on your data. The professional answer is: run a fair tournament and let the numbers decide. This step builds that tournament.

## Where we are

We have a train/test split, a preprocessing step (`prep`) and a pipeline with linear regression that reaches an error of about 19 in cross-validation. The starter keeps the code to this point and adds the imports for the two new models.

## What we will add

Three candidates scored on **identical** terms:

| model | idea |
|---|---|
| `LinearRegression` | one straight-line formula, a weight per feature |
| `DecisionTreeRegressor` | a flowchart of yes/no questions (area above 90? neighbourhood Riverside? ...); each leaf predicts an average price |
| `RandomForestRegressor` | many different trees voting; their average is steadier than one tree |

Trees and forests can capture curves and "if this then that" patterns, but they can also **overfit**: memorise training houses, noise included. We restrict `max_depth` (how many questions in a row) to keep them honest, and we use only 50 trees to keep the run fast.

## Guided walk-through

**1. A dictionary of candidates.** A dictionary maps a name to a model, so the loop below does not need copy-pasted code:

```python
models = {
    "linear": LinearRegression(),
    "tree": DecisionTreeRegressor(max_depth=5, random_state=42),
    # ... and the forest, with n_estimators=50, max_depth=8, random_state=42
}
```

**2. A shared splitter.** Plain `cv=5` is fine, but if you want every model to see exactly the same folds, create the splitter once and reuse it:

```python
cv = KFold(n_splits=5, shuffle=True, random_state=42)
```

**Cross-validation** cuts the 239 training rows into 5 parts. Round one trains on parts 2 to 5 and scores on part 1, round two scores on part 2, and so on. Five scores instead of one means you also see how much the result wobbles. `shuffle=True` mixes the rows first, in case the table has an order.

**3. The loop.** Each model gets the same preprocessing by being wrapped in its own pipeline:

```python
results = {}
for name, estimator in models.items():
    pipe = Pipeline([("prep", prep), ("model", estimator)])
    scores = -cross_val_score(pipe, X_train, y_train, cv=cv, scoring="neg_mean_absolute_error")
    results[name] = scores.mean()
```

`models.items()` gives pairs of (name, model). Remember the minus sign: scikit-learn returns negative errors.

**4. The winner.** `min(results, key=results.get)` returns the dictionary key with the smallest value. Printed results should be about `linear 18.9`, `forest 25.0`, `tree 31.0`.

**5. Interpret.** Surprise: the simple linear model wins clearly. Why? The relationships are mostly straight lines plus noise, and with only 239 rows a tree has too little data to carve out reliable boxes. The forest, as expected, beats the single tree because averaging cancels part of the noise. On a bigger dataset with curves and interactions the ranking could flip. Also check stability: a winner whose worst fold is still better than the others is more trustworthy than one that won by luck on one fold.

> **Watch out:**
> - Forgetting the minus sign makes "best" the largest error and `min` would pick the wrong model.
> - Using `X_test` to compare models is the classic leak. We stay on the training part until step 7.
> - A tree without `max_depth` grows until every training house sits in its own leaf: training error 0, but poor on new houses.
> - `n_estimators=500` in WebAssembly takes minutes. 50 trees is enough for this lesson.

> **Your turn:** build the `models` dictionary (linear, tree with depth 5, forest with 50 trees and depth 8), create `cv = KFold(n_splits=5, shuffle=True, random_state=42)`, loop over the models inside pipelines using `prep`, store and print each mean MAE as `name: CV MAE x.x`. Then print `best model:`, `forest beats tree:` and `simple beats flexible:`, re-score the winner to print `winner worst fold is below 30:`.
