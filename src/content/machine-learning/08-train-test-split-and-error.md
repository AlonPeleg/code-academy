---
title: Train/test split and measuring error
summary: Hold back test data and measure a regression model honestly with MAE, RMSE and R squared.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.linear_model import LinearRegression
      from sklearn.model_selection import train_test_split
      from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

      # Made-up data: 60 houses, size in 10s of square metres, price in thousands.
      rng = np.random.default_rng(0)
      X = rng.uniform(0, 10, size=(60, 1))
      y = 3 * X[:, 0] + 5 + rng.normal(0, 2, size=60)

      # 1. Split into training and test data: 25 percent test, random_state=42.
      #    Print "train rows:" and "test rows:" with the sizes.
      # 2. Train a LinearRegression ONLY on the training part.
      # 3. Predict the test part, then print with 2 decimals:
      #      "MAE:", "RMSE:" (the square root of the mean squared error), "R2:"
      # 4. Print "beats guessing the mean:" True or False. Guessing the mean means
      #    predicting the average of y_train for every test row; compare its MAE
      #    with the model's MAE.
check:
  output: |
    train rows: 45
    test rows: 15
    MAE: 1.69
    RMSE: 2.06
    R2: 0.96
    beats guessing the mean: True
  code:
    - { pattern: 'train_test_split\s*\(', message: "Split the data with train_test_split(...)." }
    - { pattern: 'mean_absolute_error\s*\(', message: "Use mean_absolute_error(y_test, predictions)." }
    - { pattern: 'r2_score\s*\(', message: "Use r2_score(y_test, predictions)." }
    - { pattern: '\.fit\s*\(\s*X_train', message: "Train on the training part only: model.fit(X_train, y_train)." }
hints:
  - "train_test_split returns four things in this order: X_train, X_test, y_train, y_test. The model must only ever see the training part when learning."
  - "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42). Then model.fit(X_train, y_train) and predictions = model.predict(X_test). The metrics take (true values, predictions)."
  - "rmse = np.sqrt(mean_squared_error(y_test, predictions))   baseline = np.full(len(y_test), y_train.mean())   print(\"beats guessing the mean:\", mean_absolute_error(y_test, predictions) < mean_absolute_error(y_test, baseline))"
solution:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.linear_model import LinearRegression
      from sklearn.model_selection import train_test_split
      from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

      rng = np.random.default_rng(0)
      X = rng.uniform(0, 10, size=(60, 1))
      y = 3 * X[:, 0] + 5 + rng.normal(0, 2, size=60)

      X_train, X_test, y_train, y_test = train_test_split(
          X, y, test_size=0.25, random_state=42
      )
      print("train rows:", len(X_train))
      print("test rows:", len(X_test))

      model = LinearRegression()
      model.fit(X_train, y_train)
      predictions = model.predict(X_test)

      mae = mean_absolute_error(y_test, predictions)
      rmse = np.sqrt(mean_squared_error(y_test, predictions))
      r2 = r2_score(y_test, predictions)
      print(f"MAE: {mae:.2f}")
      print(f"RMSE: {rmse:.2f}")
      print(f"R2: {r2:.2f}")

      baseline = np.full(len(y_test), y_train.mean())
      baseline_mae = mean_absolute_error(y_test, baseline)
      print("beats guessing the mean:", bool(mae < baseline_mae))
quiz:
  - q: "Why do we keep some data away from the model during training?"
    options: ["To make training faster", "To test the model on examples it has never seen", "Because the model can only learn from half the data"]
    answer: 1
  - q: "MAE is 1.69. How do you read that?"
    options: ["On average the predictions are off by about 1.69 units", "The model is 1.69 percent accurate", "The model made 1.69 mistakes"]
    answer: 0
  - q: "How does RMSE differ from MAE?"
    options: ["It is never larger than MAE", "It measures accuracy as a percentage", "It squares the errors first, so big mistakes count more"]
    answer: 2
  - q: "Which line is data leakage?"
    options: ["model.fit(X_train, y_train)", "model.predict(X_test)", "model.fit(X_test, y_test) and then scoring on X_test"]
    answer: 2
    explain: "If the model learns from the test rows, the test score is no longer an honest estimate."
---

A model that memorises its examples is useless: what you want is a model that predicts well for data it has **never seen**. The honest way to find out is simple and is used in nearly every ML project: **hold some data back**, train on the rest, and measure the model only on the held-back part.

## Train and test sets

You split your examples into two groups:

- the **training set** (usually 70 to 80 percent): the model learns from these rows;
- the **test set** (the rest): locked away until the model is trained, then used once to measure how good it is.

It is like a student who studies from a book (training) and then takes an exam with new questions (test). If the exam had the same questions as the book, a high mark would prove nothing.

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)
```

The function shuffles the rows, then cuts them. `test_size=0.25` puts a quarter in the test set. `random_state=42` fixes the shuffle: any number works, but with the same number you get the same split every time, which makes your results repeatable. Remember the order of the four results: X train, X test, y train, y test.

## Fit on train, score on test

```python
model = LinearRegression()
model.fit(X_train, y_train)          # learn from the training rows only
predictions = model.predict(X_test)  # predict rows it has never seen
```

## Measuring error

How far off are the predictions? Three common numbers, all compare the true test labels with the predictions (always in the order `y_true, y_pred`):

| Metric | What it is | How to read it |
|---|---|---|
| **MAE**, mean absolute error | The average size of the errors, ignoring direction | "On average we are off by this many units." Same unit as the label. |
| **RMSE**, root mean squared error | Square each error, average, then take the square root | Like MAE but big mistakes count extra. Also in the label's unit. |
| **R squared** (`r2_score`) | The share of the variation in y that the model explains | 1.0 is perfect, 0.0 is no better than always guessing the mean, below 0 is worse than that. |

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)
```

In the exercise, an MAE of 1.69 means that for a typical test house the predicted price is off by about 1.69 thousand. The RMSE (2.06) is a bit higher because a few larger misses count extra. An R squared of 0.96 says the model explains 96 percent of the ups and downs of the prices.

## A baseline for comparison

Is 1.69 good? It depends. A **baseline** gives you something to compare with: the simplest possible predictor, such as "always guess the average training price". If a clever model cannot beat the baseline, it has learned nothing useful. Always compute one.

## The math, briefly

If `e` is the error for each of `n` test rows: MAE = average of `|e|`, MSE = average of `e squared`, RMSE = the square root of the MSE. R squared = 1 minus (the model's total squared error divided by the total squared error of the "always predict the mean" baseline). That is why 0 means "same as the baseline".

> **Watch out:**
> - **Data leakage**: anything the model or your preparation steps learned from the test rows. Fitting on `X_test`, or filling gaps with a mean computed from all rows before splitting, makes your test score look better than the real world will be.
> - Forgetting to split at all and reporting the training score. Training scores are almost always rosier than reality.
> - Swapping the arguments: `mean_absolute_error(predictions, y_test)` still runs and gives the same MAE, but `r2_score(predictions, y_test)` gives a different, wrong number. Keep `y_true` first.
> - Using the test set again and again to tune the model. Each peek leaks a little. Later lessons introduce cross-validation for tuning.
> - Test sets that are tiny: with 15 rows a single odd house moves the numbers a lot.

> **Your turn:** split the data, train on the training part, then print the sizes, MAE, RMSE and R squared of the test predictions and whether the model beats the guess-the-mean baseline.
