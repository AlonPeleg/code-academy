---
title: k-nearest neighbours and feature scaling
summary: Classify by looking at the closest examples, and see why features must be put on the same scale.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      from sklearn.datasets import load_wine
      from sklearn.model_selection import train_test_split
      from sklearn.neighbors import KNeighborsClassifier
      from sklearn.preprocessing import StandardScaler

      data = load_wine()      # 178 wines, 13 chemical measurements, 3 grape varieties
      X_train, X_test, y_train, y_test = train_test_split(
          data.data, data.target, test_size=0.3, random_state=1, stratify=data.target
      )

      # 1. Train a KNeighborsClassifier with 5 neighbours on the RAW training data and print
      #    "raw accuracy:" (the test accuracy, 2 decimals).
      # 2. Create a StandardScaler. Learn it from the training data only and transform
      #    the training data (one call), then transform the test data with the SAME scaler.
      # 3. Train a fresh KNeighborsClassifier with 5 neighbours on the scaled training data
      #    and print "scaled accuracy:" (test accuracy on the scaled test data, 2 decimals).
      # 4. Print "scaling helps:" and True or False.
check:
  output: |
    raw accuracy: 0.65
    scaled accuracy: 0.93
    scaling helps: True
  code:
    - { pattern: 'KNeighborsClassifier\s*\(', message: "Use KNeighborsClassifier(n_neighbors=5)." }
    - { pattern: 'StandardScaler\s*\(', message: "Create a StandardScaler()." }
    - { pattern: 'fit_transform\s*\(\s*X_train', message: "Learn the scaling from the training data: scaler.fit_transform(X_train)." }
    - { pattern: '\.transform\s*\(\s*X_test', message: "Apply the same scaler to the test data: scaler.transform(X_test) (do not fit again)." }
hints:
  - "k-nearest neighbours measures distances between rows. If one feature has huge numbers (proline is in the hundreds) it dominates the distance, so first put all features on a similar scale with StandardScaler."
  - "scaler = StandardScaler(); X_train_s = scaler.fit_transform(X_train) learns the mean and spread from the training data and applies them. X_test_s = scaler.transform(X_test) applies the same numbers to the test data (never fit on the test data)."
  - "knn = KNeighborsClassifier(n_neighbors=5)   knn.fit(X_train_s, y_train)   scaled = knn.score(X_test_s, y_test)   and print(\"scaling helps:\", scaled > raw)"
solution:
  - name: main.py
    code: |
      from sklearn.datasets import load_wine
      from sklearn.model_selection import train_test_split
      from sklearn.neighbors import KNeighborsClassifier
      from sklearn.preprocessing import StandardScaler

      data = load_wine()
      X_train, X_test, y_train, y_test = train_test_split(
          data.data, data.target, test_size=0.3, random_state=1, stratify=data.target
      )

      knn = KNeighborsClassifier(n_neighbors=5)
      knn.fit(X_train, y_train)
      raw = knn.score(X_test, y_test)
      print(f"raw accuracy: {raw:.2f}")

      scaler = StandardScaler()
      X_train_s = scaler.fit_transform(X_train)
      X_test_s = scaler.transform(X_test)

      knn_scaled = KNeighborsClassifier(n_neighbors=5)
      knn_scaled.fit(X_train_s, y_train)
      scaled = knn_scaled.score(X_test_s, y_test)
      print(f"scaled accuracy: {scaled:.2f}")
      print("scaling helps:", bool(scaled > raw))
quiz:
  - q: "How does k-nearest neighbours classify a new example?"
    options: ["It fits a straight line through the data", "It looks at the k closest training examples and takes a vote", "It picks a class at random"]
    answer: 1
  - q: "Why does feature scaling matter for k-nearest neighbours?"
    options: ["Features with large numbers dominate the distance otherwise", "It makes the data smaller on disk", "It removes missing values"]
    answer: 0
  - q: "Where should the scaler learn its mean and spread from?"
    options: ["From all the data, before splitting", "From the test data", "From the training data only"]
    answer: 2
    explain: "Learning anything from the test rows, even a mean, leaks information from the test set."
  - q: "What happens with a very large k, such as k equal to the whole training set?"
    options: ["The model becomes perfect", "It always predicts the most common class, which is too simple", "It crashes"]
    answer: 1
---

Not every model draws a line. **k-nearest neighbours** (kNN) is the most intuitive classifier there is: to classify something new, look for the `k` most similar examples you already know, and let them vote. In this lesson you will use it, and you will meet the single most common beginner trap in distance-based models: features on different scales.

## The idea: you are like your neighbours

Imagine every wine as a dot in space, with one axis per measurement. To classify a new wine, find the `k` dots closest to it (the "nearest neighbours") and give it the class that most of them have. With `k = 5` and neighbours classes `[1, 1, 0, 1, 2]`, the answer is class 1.

```python
from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)          # for kNN, "training" just stores the examples
print(knn.score(X_test, y_test))   # accuracy
```

kNN does no real learning in `fit`: it simply remembers the data. All the work happens when you predict, which makes it slow on huge datasets.

## Choosing k

`k` is a **hyperparameter**: a setting you choose before training, not something the model learns. A small `k` (like 1) follows every quirk and noisy point in the data. A large `k` smooths too much and ignores local detail. Values from 3 to 15 are a common starting range. The next lesson shows how to choose settings like this.

## Distance and the scale problem

"Closest" means smallest **distance**, usually the straight-line (Euclidean) distance: subtract the features, square, add up, take the square root. Now look at the wine data: one measurement (`proline`) is in the hundreds or thousands, while another (`hue`) is around 1. When the distance is calculated, a difference of 300 in proline completely swamps a difference of 0.5 in hue. The model effectively listens to proline only and ignores the others.

The fix is **feature scaling**. The most popular version is **standardisation**: for each column, subtract its mean and divide by its standard deviation, so every feature ends up with mean 0 and spread about 1:

```python
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)   # learn mean and spread, then apply
X_test_s = scaler.transform(X_test)         # apply the SAME numbers
```

- `fit` computes the column means and spreads from the data you give it.
- `transform` applies them.
- `fit_transform` does both in one call.

## The golden rule: fit on training data only

Look closely: the scaler learns from `X_train` and only **transforms** `X_test`. If you fitted the scaler on all the data (or on the test data), numbers from the test set would leak into your preparation, and the test score would be a little too optimistic. In real use, new data arrives one row at a time and you can only use what you learned earlier. Treat the test set as if it did not exist until the final score.

## How to read the output

Without scaling, the accuracy is only 0.65: not much better than a lopsided guess. After scaling, the same algorithm with the same `k` reaches 0.93. Nothing about kNN changed, only the numbers it was given. That is why preparing data often matters more than choosing a fancier model.

## The math, briefly

For a value `x` in a column, the standardised value is `(x - mean) / std`, which is often called a **z-score**: how many standard deviations the value lies from the average. Euclidean distance between two rows is the square root of the sum of the squared differences of every feature.

> **Watch out:**
> - Forgetting to scale: kNN (and later k-means, SVMs and neural networks) are all sensitive to feature scale. Decision trees are not.
> - Fitting the scaler on the test set, or on everything: this is data leakage. Call `fit_transform` on the training set and plain `transform` on the test set.
> - Training on scaled data but predicting on raw data: `ValueError` is not raised, you just get nonsense. Every row going into the model must be scaled the same way.
> - Using an even `k` for two classes can produce ties. Odd values like 3, 5 and 7 avoid them.
> - Calling `scaler.fit_transform(X_test)` separately: the test data would be scaled with its own numbers, not the training numbers.

> **Your turn:** train kNN on the raw wine data and print its accuracy, then standardise the features (fitting on the training data only), train again, print the new accuracy, and say whether scaling helped.
