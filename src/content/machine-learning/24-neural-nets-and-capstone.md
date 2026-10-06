---
title: Neural nets with scikit-learn and a capstone
summary: Use MLPClassifier, compare models honestly with cross-validation, tune one hyperparameter, test once, and finish with responsible machine learning.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.datasets import make_moons
      from sklearn.dummy import DummyClassifier
      from sklearn.ensemble import RandomForestClassifier
      from sklearn.linear_model import LogisticRegression
      from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
      from sklearn.neighbors import KNeighborsClassifier
      from sklearn.neural_network import MLPClassifier
      from sklearn.pipeline import make_pipeline
      from sklearn.preprocessing import StandardScaler

      # Two interleaved half-moons: a straight line cannot separate them.
      X, y = make_moons(n_samples=300, noise=0.2, random_state=1)
      X_train, X_test, y_train, y_test = train_test_split(
          X, y, test_size=0.25, random_state=0, stratify=y)


      def make_mlp(size):
          # scaler + MLPClassifier(hidden_layer_sizes=size, solver="lbfgs", max_iter=2000, random_state=0)
          # in one pipeline (lbfgs is a fast, reliable solver for small data)
          pass


      # 1. Fit make_mlp((16,)) on the training data. The network is the last pipeline step
      #    (pipe.named_steps["mlpclassifier"]). Print [c.shape for c in net.coefs_]
      #    and f"parameters {...}" = total size of all coefs_ plus all intercepts_.

      # 2. Compare models with the SAME folds: cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
      #    and X_train only. Models: DummyClassifier(strategy="most_frequent") "baseline",
      #    make_pipeline(StandardScaler(), LogisticRegression()) "logistic",
      #    make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=7)) "knn",
      #    RandomForestClassifier(n_estimators=30, random_state=0) "forest", make_mlp((16,)) "mlp".
      #    Store the mean score of each in a dict `scores`. Print f"{name} {mean:.2f}" for the first
      #    four, then f"mlp beats linear by 0.05: {scores['mlp'] > scores['logistic'] + 0.05}".

      # 3. Tune ONE hyperparameter, the hidden layer size, over [(1,), (4,), (32,)] with the same
      #    folds. Keep the mean score of each in a dict, pick best = the size with the highest mean
      #    (max(d, key=d.get)) and print f"best size is not 1 neuron: {best != (1,)}".

      # 4. Refit make_mlp(best) on the whole training part and evaluate it ONCE on the test set.
      #    Print f"test accuracy above 0.9: {accuracy > 0.9}".

      # 5. Fairness style check: mask = X_test[:, 0] > 0.5 splits the test set into two groups.
      #    Print the group sizes as a list [int(mask.sum()), int((~mask).sum())] and
      #    f"every group above 0.85: {...}" which is True when the accuracy inside each group is above 0.85.
check:
  output: |
    [(2, 16), (16, 1)]
    parameters 65
    baseline 0.49
    logistic 0.85
    knn 0.96
    forest 0.94
    mlp beats linear by 0.05: True
    best size is not 1 neuron: True
    test accuracy above 0.9: True
    [42, 33]
    every group above 0.85: True
  code:
    - { pattern: 'MLPClassifier\s*\(', message: "Use MLPClassifier(...) inside the pipeline." }
    - { pattern: 'hidden_layer_sizes', message: "Set the network shape with hidden_layer_sizes." }
    - { pattern: 'cross_val_score\s*\(', message: "Compare the models with cross_val_score on the training data." }
    - { pattern: 'coefs_', message: "Look at net.coefs_ to see the weight matrices." }
    - { pattern: 'max\s*\(', message: "Pick the best size with max(scores_by_size, key=...get)." }
hints:
  - "MLPClassifier is the scikit-learn version of the network you built by hand: hidden_layer_sizes=(16,) means one hidden layer of 16 neurons. Put it behind a StandardScaler in a pipeline. After fitting, coefs_ is a list with one weight matrix per layer and intercepts_ the biases."
  - "def make_mlp(size): return make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=size, solver='lbfgs', max_iter=2000, random_state=0)). For the comparison, loop over a dict of models and store cross_val_score(model, X_train, y_train, cv=cv).mean()."
  - "net = pipe.named_steps['mlpclassifier']   parameters = sum(c.size for c in net.coefs_) + sum(b.size for b in net.intercepts_)   best = max(by_size, key=by_size.get)   final = make_mlp(best).fit(X_train, y_train)   pred = final.predict(X_test)   accuracy inside a group g: (pred[g] == y_test[g]).mean()"
solution:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.datasets import make_moons
      from sklearn.dummy import DummyClassifier
      from sklearn.ensemble import RandomForestClassifier
      from sklearn.linear_model import LogisticRegression
      from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
      from sklearn.neighbors import KNeighborsClassifier
      from sklearn.neural_network import MLPClassifier
      from sklearn.pipeline import make_pipeline
      from sklearn.preprocessing import StandardScaler

      X, y = make_moons(n_samples=300, noise=0.2, random_state=1)
      X_train, X_test, y_train, y_test = train_test_split(
          X, y, test_size=0.25, random_state=0, stratify=y)


      def make_mlp(size):
          return make_pipeline(
              StandardScaler(),
              MLPClassifier(hidden_layer_sizes=size, solver="lbfgs", max_iter=2000, random_state=0))


      pipe = make_mlp((16,)).fit(X_train, y_train)
      net = pipe.named_steps["mlpclassifier"]
      print([c.shape for c in net.coefs_])
      print(f"parameters {sum(c.size for c in net.coefs_) + sum(b.size for b in net.intercepts_)}")

      cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
      models = {
          "baseline": DummyClassifier(strategy="most_frequent"),
          "logistic": make_pipeline(StandardScaler(), LogisticRegression()),
          "knn": make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=7)),
          "forest": RandomForestClassifier(n_estimators=30, random_state=0),
          "mlp": make_mlp((16,)),
      }
      scores = {}
      for name, model in models.items():
          scores[name] = cross_val_score(model, X_train, y_train, cv=cv).mean()
      for name in ["baseline", "logistic", "knn", "forest"]:
          print(f"{name} {scores[name]:.2f}")
      print(f"mlp beats linear by 0.05: {scores['mlp'] > scores['logistic'] + 0.05}")

      by_size = {}
      for size in [(1,), (4,), (32,)]:
          by_size[size] = cross_val_score(make_mlp(size), X_train, y_train, cv=cv).mean()
      best = max(by_size, key=by_size.get)
      print(f"best size is not 1 neuron: {best != (1,)}")

      final = make_mlp(best).fit(X_train, y_train)
      pred = final.predict(X_test)
      accuracy = (pred == y_test).mean()
      print(f"test accuracy above 0.9: {accuracy > 0.9}")

      mask = X_test[:, 0] > 0.5
      print([int(mask.sum()), int((~mask).sum())])
      group_accuracies = [(pred[g] == y_test[g]).mean() for g in (mask, ~mask)]
      print(f"every group above 0.85: {all(a > 0.85 for a in group_accuracies)}")
quiz:
  - q: "What does hidden_layer_sizes=(16, 8) mean in MLPClassifier?"
    options: ["16 samples and 8 features", "Two hidden layers, with 16 and then 8 neurons", "A network with 24 layers"]
    answer: 1
  - q: "Why does the capstone compare models with cross-validation on the TRAINING part and touch the test set only once at the end?"
    options: ["So that choosing the model and its settings does not quietly fit them to the test data, leaving one honest final score", "To save time", "Because the test set is too small to score"]
    answer: 0
  - q: "A model gets 95% accuracy overall but the accuracy inside one group of people is 70%. What should you conclude?"
    options: ["The model is fair because the overall number is high", "The group is too small to matter", "The overall number hides a problem. Investigate that group's data and errors before using the model"]
    answer: 2
    explain: "Averages can hide groups that are served badly. Always break results down by the groups that matter."
  - q: "Which of these is data leakage?"
    options: ["Using a fixed random_state", "Including a feature that is only known after the outcome you predict, such as 'was treated' when predicting 'will be sick'", "Using cross-validation"]
    answer: 1
---

You have built a network from scratch; now you will use scikit-learn's ready-made one, `MLPClassifier` (MLP stands for **multi-layer perceptron**, the plain "layers of neurons" network from lessons 22 and 23). Then comes the capstone: compare models fairly, tune one setting, test once, and ask whether the result is good for everyone it touches.

## MLPClassifier

```python
from sklearn.neural_network import MLPClassifier
net = MLPClassifier(hidden_layer_sizes=(16,), solver="lbfgs", max_iter=2000, random_state=0)
```

* `hidden_layer_sizes=(16,)` is a tuple with one number per hidden layer. `(16,)` is one layer of 16 neurons and `(32, 16)` two layers.
* The input and output layers are chosen automatically from your data: 2 inputs for the moons, 1 output (a probability) for two classes.
* It uses the same ingredients you coded: weights and biases, an activation (`relu` by default), log loss, and gradient-based updates with backpropagation. `solver="lbfgs"` is a smarter optimiser that works very well and fast on small datasets, while the default `adam` suits larger ones.
* `max_iter` caps the number of training rounds. If you see `ConvergenceWarning`, raise it. `random_state` fixes the random starting weights.
* Neural networks are sensitive to scale, so always put a `StandardScaler` in front, in a pipeline (lesson 17).

After fitting, `net.coefs_` holds one weight matrix per layer, with shapes `(2, 16)` and `(16, 1)` here, and `net.intercepts_` the biases. Count them: `2*16 + 16 + 16*1 + 1 = 65` parameters, just like the 9 you counted by hand in lesson 22.

## Comparing models honestly

A leaderboard is only trustworthy if the contest is fair:

1. **A baseline first.** `DummyClassifier(strategy="most_frequent")` always guesses the commonest class (here about 0.49 on a balanced dataset). Any real model must beat it clearly.
2. **Same data, same folds.** Give every model the same `StratifiedKFold` object on the training part only.
3. **Preprocess inside pipelines**, so scaling is fitted per fold.
4. **Look at the numbers with the right eyes.** On this dataset the straight-line logistic regression scores about 0.85, because half-moons are curved. KNN (0.96), the forest (0.94) and the network are far better. But if two models differ by less than the fold-to-fold spread, call it a tie and prefer the simpler one.
5. **Tune on training data only.** Trying hidden sizes `(1,)`, `(4,)` and `(32,)` with cross-validation shows the point of a hidden layer: one neuron can only draw a straight boundary (about 0.85, the same as logistic regression), while 32 can bend around the moons. When we pick the size that scores best, the test set has not been involved.
6. **Test once.** Only now refit the winner on the whole training part and score it on the untouched test set. That number is your honest estimate. If you test five models on the test set and report the best, the test set has become a training set.

Note how the exercise prints truths such as `best size is not 1 neuron: True` rather than raw network scores. Training a network from a random start is slightly sensitive to tiny numerical differences (computers and libraries add numbers in different orders), so scores can wobble by a point or two between machines. That wobble is also a reminder that small differences between models are not evidence.

## Responsible machine learning

Good scores are not enough. Before a model touches real people, think about:

* **Bias in the data.** A model copies the patterns it is shown, including unfair ones. If past decisions (loans, hiring) were biased, a model trained to imitate them will be too. A model also fails on people who are rare in the data.
* **Leakage.** A feature that secretly contains the answer, such as "treatment given" when predicting illness, or test rows used in scaling, gives dazzling scores and useless models. Ask of every feature: "would I really know this at prediction time?"
* **Evaluate by group.** The final step splits the test set into two groups and checks the accuracy in each. An overall 95% can hide 70% for a smaller group. Compare error rates, not just accuracy, and look at which kind of mistake (false alarm or missed case) falls on whom.
* **Fit the metric to the cost.** Missing a disease is worse than a false alarm (recall, lesson 12); a spam filter is the opposite.
* **Be honest about limits.** Report uncertainty, the data period and population, and keep a human in the loop for high-stakes decisions.

> **Watch out:**
> - Forgetting the scaler: an unscaled MLP trains slowly or badly and may raise `ConvergenceWarning`.
> - Choosing the model by test score. Choose with cross-validation and test once.
> - `hidden_layer_sizes=16` (a plain int) works but means one layer; `(16)` is also just an int. Write `(16,)` with the comma to be clear.
> - Believing that deeper is always better. On small tables, logistic regression, forests and KNN are often as good, faster and easier to explain.
> - Reporting only an overall number when groups matter.

> **Your turn:** build the scaled `MLPClassifier` pipeline, count its parameters, compare five models with identical folds, tune the hidden layer size, evaluate the winner once on the test set, and finish with the per-group check. Follow the numbered comments.
