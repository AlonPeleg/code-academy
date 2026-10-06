---
title: "Your first model: linear regression"
summary: Train a LinearRegression model with scikit-learn, read its coefficient and make predictions.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import pandas as pd
      from sklearn.linear_model import LinearRegression

      df = pd.DataFrame({
          "ad_spend": [1, 2, 3, 4, 5, 6, 7, 8],                          # thousands spent on ads
          "sales": [12.1, 14.8, 18.2, 20.9, 24.1, 27.2, 29.8, 33.1],     # units sold (hundreds)
      })

      # 1. Features X must be a 2D table: use a DataFrame with ONE column (double brackets).
      #    The label y is the sales column (single brackets).
      # 2. Create a LinearRegression model and train it on X and y.
      # 3. Print the coefficient, the intercept and the training score (R squared):
      #      "coefficient: ..." and "intercept: ..." with 2 decimals, "r2: ..." with 3 decimals.
      # 4. Predict the sales for an ad spend of 10 (pass a table with a single row:
      #    pd.DataFrame({"ad_spend": [10]})) and print "prediction for 10: ..." with 2 decimals.
check:
  output: |
    coefficient: 3.00
    intercept: 9.01
    r2: 0.999
    prediction for 10: 39.04
  code:
    - { pattern: 'LinearRegression\s*\(', message: "Create the model with LinearRegression()." }
    - { pattern: '\.fit\s*\(', message: "Train the model with model.fit(X, y)." }
    - { pattern: '\.predict\s*\(', message: "Make the prediction with model.predict(...)." }
hints:
  - "scikit-learn models follow one pattern: create the model, call fit(X, y) to train it, call predict(new_X) to use it. X must be 2D (a table), y is 1D."
  - "X = df[[\"ad_spend\"]] (double brackets keep it a table) and y = df[\"sales\"]. After model = LinearRegression(), train with model.fit(X, y). The learned numbers are model.coef_[0] and model.intercept_."
  - "model = LinearRegression()   model.fit(X, y)   print(f\"coefficient: {model.coef_[0]:.2f}\")   model.score(X, y) is R squared   model.predict(pd.DataFrame({\"ad_spend\": [10]}))[0] is the prediction."
solution:
  - name: main.py
    code: |
      import pandas as pd
      from sklearn.linear_model import LinearRegression

      df = pd.DataFrame({
          "ad_spend": [1, 2, 3, 4, 5, 6, 7, 8],
          "sales": [12.1, 14.8, 18.2, 20.9, 24.1, 27.2, 29.8, 33.1],
      })

      X = df[["ad_spend"]]
      y = df["sales"]

      model = LinearRegression()
      model.fit(X, y)

      print(f"coefficient: {model.coef_[0]:.2f}")
      print(f"intercept: {model.intercept_:.2f}")
      print(f"r2: {model.score(X, y):.3f}")

      new_house = pd.DataFrame({"ad_spend": [10]})
      prediction = model.predict(new_house)[0]
      print(f"prediction for 10: {prediction:.2f}")
quiz:
  - q: "In scikit-learn, what does model.fit(X, y) do?"
    options: ["Predicts y from X", "Draws a chart of X and y", "Trains the model on the examples"]
    answer: 2
  - q: "Why do we write X = df[[\"ad_spend\"]] with double brackets?"
    options: ["scikit-learn needs the features as a 2D table, even with one column", "Double brackets are faster", "It selects two columns"]
    answer: 0
  - q: "The coefficient is 3.00. What does that mean?"
    options: ["The model is 3 percent accurate", "Each extra unit of ad spend adds about 3 to the predicted sales", "There are 3 features"]
    answer: 1
  - q: "What does model.predict(...) return for one new row?"
    options: ["The coefficient", "An array with one predicted value", "The R squared score"]
    answer: 1
---

Now you meet the tool that most real-world machine learning in Python uses: **scikit-learn** (imported as `sklearn`). Its great strength is that every model works the same way, so once you know one, you nearly know them all. We start with the simplest, **linear regression**.

## Regression and the straight line

**Regression** means predicting a number (a price, a temperature, a number of sales). **Linear** means the model is a straight line. With one feature it is

```
prediction = coefficient * feature + intercept
```

The **coefficient** says how much the prediction changes when the feature grows by 1. The **intercept** is the prediction when the feature is 0. With several features there is one coefficient per feature, and the prediction is the sum of all `coefficient * feature` parts plus the intercept. This is the same line you drew with `np.polyfit` in lesson 1, but now in a form that works for many features.

## The scikit-learn pattern: create, fit, predict

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()      # 1. create an untrained model
model.fit(X, y)                 # 2. train: learn from the examples
model.predict(new_X)            # 3. predict for new data
```

Everything that ends with an underscore, such as `coef_` and `intercept_`, is something the model **learned**. It exists only after `fit`.

## The shape rules

- `X`, the features, must be **2D**: rows by columns. Even with one feature it is a table with one column. With pandas, use double brackets: `df[["ad_spend"]]`.
- `y`, the label, is **1D**: a single column or list: `df["sales"]`.
- `predict` also wants a 2D table with the same column names, so one new row is `pd.DataFrame({"ad_spend": [10]})` (one row containing one feature). With plain NumPy data `[[10]]` works too.

Capital `X` and small `y` is a universal convention: a table is a matrix (capital), a column is a vector (small).

## Reading the output

```python
print(model.coef_)        # an array, one number per feature
print(model.intercept_)   # one number
print(model.score(X, y))  # R squared
```

In the exercise the coefficient comes out as about 3.00: every extra thousand spent on ads goes with about 300 more units sold. The intercept 9.01 is what the line predicts for zero spend.

**R squared** (`score`) tells you how much of the up-and-down of the label the line explains. 1.0 is a perfect fit, 0.0 is no better than always guessing the average. Here it is 0.999, an almost perfect line, because the data is almost on a line. Careful: this score was calculated on the same data the model learned from, which flatters it. The next lessons show how to measure honestly.

## The math, briefly

Training finds the coefficient and intercept that minimise the sum of squared errors, the same least-squares idea as in lesson 1. For a straight line there is even a direct formula, so `fit` is instant. Later in the track you will find the same numbers step by step with gradient descent.

> **Watch out:**
> - Passing a 1D list as `X` gives `ValueError: Expected 2D array, got 1D array instead`. Use `df[["col"]]` or `.reshape(-1, 1)`.
> - Writing `model.predict(10)` gives the same kind of error. Wrap it in a table with one row.
> - Training on a DataFrame but predicting with a bare list such as `[[10]]` works but prints `UserWarning: X does not have valid feature names`. Predict with a DataFrame that has the same column names.
> - Reading `coef_` before `fit` raises `AttributeError: 'LinearRegression' object has no attribute 'coef_'`.
> - Trusting a prediction far outside the data, such as asking for an ad spend of 1000. The straight line keeps going even when the real world does not.
> - Treating the training R squared as proof that the model is good. You will fix that in the next lesson.

> **Your turn:** train a `LinearRegression` on `ad_spend` and `sales`, print the coefficient, intercept and R squared, then predict the sales for an ad spend of 10.
