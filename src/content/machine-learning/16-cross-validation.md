---
title: Cross-validation
summary: Why a single train/test split can mislead you, and how cross_val_score gives a steadier estimate by testing on every part of the data.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.datasets import load_wine
      from sklearn.model_selection import KFold, cross_val_score, train_test_split
      from sklearn.tree import DecisionTreeClassifier

      wine = load_wine()
      X, y = wine.data, wine.target
      model = DecisionTreeClassifier(max_depth=3, random_state=0)

      # 1. Run 8 single train/test splits (test_size=0.25, random_state = 0, 1, ..., 7).
      #    For each one fit `model` on the training part and store the test accuracy in a list.
      #    Print f"single splits: {lowest:.2f} to {highest:.2f}".

      # 2. Make cv = KFold(n_splits=5, shuffle=True, random_state=0).
      #    scores = cross_val_score(model, X, y, cv=cv)
      #    Print the 5 scores rounded to 2 decimals, then f"mean {mean:.2f} std {std:.2f}".

      # 3. For depth in [1, 2, 3, 5] build DecisionTreeClassifier(max_depth=depth, random_state=0),
      #    score it with the same cv and print f"depth {depth} {mean:.2f}".
check:
  output: |
    single splits: 0.87 to 0.96
    [0.97 0.83 0.94 0.97 0.91]
    mean 0.93 std 0.05
    depth 1 0.63
    depth 2 0.86
    depth 3 0.93
    depth 5 0.93
  code:
    - { pattern: 'cross_val_score\s*\(', message: "Use cross_val_score(model, X, y, cv=cv)." }
    - { pattern: 'KFold\s*\(', message: "Create a KFold splitter." }
    - { pattern: 'for\s+\w+\s+in\s+(range|\[)', message: "Use loops for the seeds and the depths." }
    - { pattern: 'train_test_split\s*\(', message: "Use train_test_split for the single splits." }
hints:
  - "Part 1 is a loop over seeds with train_test_split(X, y, test_size=0.25, random_state=seed). Part 2 replaces the manual loop by cross_val_score, which splits, fits and scores for you."
  - "cv = KFold(n_splits=5, shuffle=True, random_state=0); scores = cross_val_score(model, X, y, cv=cv) returns an array of 5 accuracies. Use scores.mean() and scores.std()."
  - "accs.append(model.fit(X_tr, y_tr).score(X_te, y_te))   print(f'single splits: {min(accs):.2f} to {max(accs):.2f}')   print(scores.round(2))   print(f'mean {scores.mean():.2f} std {scores.std():.2f}')"
solution:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.datasets import load_wine
      from sklearn.model_selection import KFold, cross_val_score, train_test_split
      from sklearn.tree import DecisionTreeClassifier

      wine = load_wine()
      X, y = wine.data, wine.target
      model = DecisionTreeClassifier(max_depth=3, random_state=0)

      accs = []
      for seed in range(8):
          X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=seed)
          accs.append(model.fit(X_tr, y_tr).score(X_te, y_te))
      print(f"single splits: {min(accs):.2f} to {max(accs):.2f}")

      cv = KFold(n_splits=5, shuffle=True, random_state=0)
      scores = cross_val_score(model, X, y, cv=cv)
      print(scores.round(2))
      print(f"mean {scores.mean():.2f} std {scores.std():.2f}")

      for depth in [1, 2, 3, 5]:
          m = DecisionTreeClassifier(max_depth=depth, random_state=0)
          s = cross_val_score(m, X, y, cv=cv)
          print(f"depth {depth} {s.mean():.2f}")
quiz:
  - q: "In 5-fold cross-validation, how often is each row used for testing?"
    options: ["Never", "Exactly once", "Five times"]
    answer: 1
    explain: "The data is cut into 5 parts. Each part is the test set once while the other 4 parts train the model."
  - q: "How many times is the model trained by cross_val_score with cv=5?"
    options: ["Five times, a fresh model each time", "Once", "Once per row"]
    answer: 0
  - q: "Eight different train/test splits give accuracies from 0.87 to 0.96. What does this tell you?"
    options: ["The model is broken", "Accuracy cannot be measured", "A single split is a noisy measurement, so one number can be lucky or unlucky"]
    answer: 2
  - q: "You use cross-validation scores to compare max_depth values. What is a fair way to report the winner?"
    options: ["The highest single fold score", "The mean score across folds, ideally together with its spread", "The training accuracy"]
    answer: 1
---

How good is your model? So far you answered with one train/test split and one accuracy number. But that number depends on which rows happened to land in the test set. In this lesson you learn to measure how big that luck factor is, and how **cross-validation** reduces it.

## One split is a noisy measurement

With a small dataset (the wine data has 178 rows) a test set is only 45 rows. If the test set happens to contain a few hard wines, your accuracy looks bad, and if it contains easy ones it looks great. The model has not changed at all! Run the same model on 8 different random splits and the scores range from about 0.87 to 0.96. If you reported only the first one, you could be off by several percentage points and might even pick the worse of two models by pure chance.

## The idea of k-fold cross-validation

Instead of one split, make several and average:

1. Cut the data into **k folds** (parts) of about equal size. We use k = 5.
2. Train on folds 2 to 5 and test on fold 1. Then train on folds 1, 3, 4, 5 and test on fold 2. And so on, so that every fold is the test set exactly once.
3. You now have k scores. Their **mean** is your estimate of how well the model works on new data, and their **standard deviation** says how much it varies.

Every row is used for training in k-1 of the rounds and for testing in exactly one, so no data is wasted, which is especially nice for small datasets.

```python
from sklearn.model_selection import KFold, cross_val_score
cv = KFold(n_splits=5, shuffle=True, random_state=0)
scores = cross_val_score(model, X, y, cv=cv)
```

* `KFold(n_splits=5, shuffle=True, random_state=0)` describes how to cut the data. `shuffle=True` mixes the rows first; `random_state` makes the cut repeatable.
* `cross_val_score(model, X, y, cv=cv)` does the whole loop: it clones the model, fits it on each training part, scores it on the matching test part, and returns an array with one score per fold.
* It does not change `model` itself; you still need to call `model.fit(X, y)` yourself at the end if you want a final model trained on all data.

Worked example: the five fold scores are about `0.97 0.83 0.94 0.97 0.91`. Add them up and divide by 5 and you get about 0.93 (the rounded numbers give `4.62 / 5 = 0.924`, the unrounded ones 0.927), and the spread (std) is about 0.05. So an honest summary is "about 93% accuracy, give or take 5 points", which is much more truthful than one lucky "0.96".

## Using it to choose settings

Cross-validation shines when you compare options, for example tree depths. Score each depth with the **same** `cv` object so they are tested on identical folds, then compare the means. Depth 1 is far too simple (about 0.63), depth 2 is better (0.86) and depth 3 reaches 0.93 with no gain after that, so a depth of 3 is a good choice: the simplest model that is about as good as the best.

## How to read the output

* `single splits: 0.87 to 0.96` is the spread of single-split scores, the "luck range".
* The array of 5 numbers is one accuracy per fold. A fold that is much lower than the rest points to a hard slice of the data.
* `mean ... std ...`: compare models by their mean, but if two means differ by less than one std, treat them as a tie.

> **Watch out:**
> - Wine rows are stored sorted by class. Plain `KFold(5)` without `shuffle=True` would put one class almost alone in some test folds and give terrible scores. For classifiers, `cross_val_score(model, X, y, cv=5)` uses stratified folds (each fold keeps the class mix) automatically.
> - Do not report the best fold. Report the mean.
> - Cross-validation costs k times as much compute as one fit. Keep k at 5 in the browser.
> - Preprocessing such as scaling must happen *inside* each fold, otherwise it leaks. The next lesson shows how.
> - Keep a final test set that you never touched during these comparisons if you want a last honest check.

> **Your turn:** measure the luck factor with 8 single splits, then compute 5-fold cross-validation scores for a depth-3 tree, and compare depths 1, 2, 3 and 5 using the same folds.
