---
title: Overfitting and underfitting
summary: See how too simple and too flexible models fail, by comparing train and test scores as complexity grows.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.metrics import r2_score

      # 30 noisy points around a sine wave.
      rng = np.random.default_rng(3)
      x = np.linspace(0, 1, 30)
      y = np.sin(2 * np.pi * x) + rng.normal(0, 0.3, size=30)

      # Every second point trains the model, the other points test it.
      x_train, y_train = x[::2], y[::2]
      x_test, y_test = x[1::2], y[1::2]

      # For each degree in [1, 3, 9] (a loop):
      # 1. Fit a polynomial of that degree on the TRAIN points
      #    (the polyfit function of NumPy returns its coefficients).
      # 2. Predict the train and the test points with the polyval function of NumPy (coefficients first, points second).
      # 3. Calculate the R squared of both with the r2_score function (true values first) and print:
      #      "degree 1: train 0.61 test 0.24"  (2 decimals each)
      #    Remember each test score in a dictionary.
      # Afterwards print "best degree:" and the degree with the highest TEST score,
      # then "overfit at 9:" and True or False: is the degree-9 train score higher
      # than its test score by more than 1?
check:
  output: |
    degree 1: train 0.61 test 0.24
    degree 3: train 0.83 test 0.62
    degree 9: train 0.96 test -1.38
    best degree: 3
    overfit at 9: True
  code:
    - { pattern: 'for\s+\w+\s+in\s+', message: "Use a for loop over the degrees [1, 3, 9]." }
    - { pattern: 'np\.polyfit\s*\(', message: "Fit each polynomial with np.polyfit(x_train, y_train, degree)." }
    - { pattern: 'np\.polyval\s*\(', message: "Predict with np.polyval(coefficients, points)." }
    - { pattern: 'r2_score\s*\(', message: "Score with r2_score(true_values, predictions)." }
hints:
  - "Higher polynomial degree means a more flexible curve. Loop over the degrees, train on the train points only, and score on both the train and the test points."
  - "coefficients = np.polyfit(x_train, y_train, degree)   train_pred = np.polyval(coefficients, x_train)   test_pred = np.polyval(coefficients, x_test)   then r2_score(y_train, train_pred) and r2_score(y_test, test_pred)."
  - "test_scores[degree] = r2_test   (a dictionary filled inside the loop)   best = max(test_scores, key=test_scores.get)   print(\"overfit at 9:\", train_scores[9] - test_scores[9] > 1)"
solution:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.metrics import r2_score

      rng = np.random.default_rng(3)
      x = np.linspace(0, 1, 30)
      y = np.sin(2 * np.pi * x) + rng.normal(0, 0.3, size=30)

      x_train, y_train = x[::2], y[::2]
      x_test, y_test = x[1::2], y[1::2]

      train_scores = {}
      test_scores = {}
      for degree in [1, 3, 9]:
          coefficients = np.polyfit(x_train, y_train, degree)
          train_pred = np.polyval(coefficients, x_train)
          test_pred = np.polyval(coefficients, x_test)
          train_scores[degree] = r2_score(y_train, train_pred)
          test_scores[degree] = r2_score(y_test, test_pred)
          print(f"degree {degree}: train {train_scores[degree]:.2f} test {test_scores[degree]:.2f}")

      best = max(test_scores, key=test_scores.get)
      print("best degree:", best)
      print("overfit at 9:", bool(train_scores[9] - test_scores[9] > 1))
quiz:
  - q: "A model scores 0.99 on the training data and 0.40 on the test data. What is the likely problem?"
    options: ["Underfitting", "Overfitting", "The test set is too easy"]
    answer: 1
  - q: "A model scores poorly on BOTH the training and the test data. What is the likely problem?"
    options: ["Underfitting: the model is too simple", "Data leakage", "Overfitting"]
    answer: 0
  - q: "Which change usually helps against overfitting?"
    options: ["Making the model more complex", "Testing on the training data", "More training data or a simpler model"]
    answer: 2
  - q: "Why do we choose the degree that scores best on the test data and not on the training data?"
    options: ["Training scores are always lower", "A flexible model can look perfect on the data it has memorised, but only the test score shows how it handles new data", "The test data is larger"]
    answer: 1
---

You now know how to train a model and how to measure it on held-back data. This lesson explains why that measuring is so important, using the two classic ways a model can go wrong: **underfitting** and **overfitting**.

## Too simple, too flexible

Imagine the true pattern in your data is a gentle wave, but every measurement also contains a bit of random **noise** (measurement error, bad luck). A model can fail in two opposite ways:

- **Underfitting**: the model is too simple to capture the pattern. A straight line through a wave misses the bends. It scores badly on the training data **and** on the test data.
- **Overfitting**: the model is so flexible that it bends to fit every random wiggle of the noise, effectively memorising the training examples. It scores great on the training data, but badly on new data, because the noise it memorised does not repeat.

The goal is the middle, a model complex enough for the real pattern and too simple for the noise. Think of studying for an exam: understanding the topic (good) versus memorising last year's exact answers (overfit).

## Complexity as a dial

For polynomials, the **degree** is the complexity dial: degree 1 is a straight line, degree 3 can bend twice, degree 9 can wiggle up and down many times. `np.polyfit(x, y, degree)` finds the best polynomial and `np.polyval(coefficients, x)` uses it to predict:

```python
coefficients = np.polyfit(x_train, y_train, 3)
predictions = np.polyval(coefficients, x_test)
```

In other models the dial has other names: the number of neighbours `k` in kNN (small `k` is flexible), the depth of a decision tree, the number of layers in a neural network. The same story repeats for every one of them.

## The tell-tale sign: compare train and test scores

The test score is what you care about. The **gap** between the two scores is your diagnosis:

| Train score | Test score | Diagnosis |
|---|---|---|
| low | low | **Underfitting.** Add flexibility: more features, a more complex model. |
| high | clearly lower | **Overfitting.** Simplify, add training data, or use regularisation (a penalty for complexity). |
| high | high, close together | A good fit. |

## How to read the output

In the exercise the pattern is the textbook one:

- degree 1: both scores are low (0.61 and 0.24). A straight line cannot follow a wave: **underfit**.
- degree 3: the training score rises to 0.83 and the test score to 0.62. The curve has captured the wave: **a good balance**.
- degree 9: the training score climbs to 0.96, but the test score collapses to -1.38. The curve threads through the training points and swings wildly in between: **overfit**.

Training scores go up with complexity almost every time. Test scores go up and then fall. That is why the best model is picked by the **test** score, never the training score. A negative R squared simply means "worse than always predicting the average".

## The math, briefly

Total error splits into two parts: **bias**, the error from a model being too simple to match reality (underfitting), and **variance**, the error from a model reacting too strongly to the particular training sample (overfitting). Making a model more complex lowers bias but raises variance. The sweet spot is where the sum is smallest. This is the **bias-variance trade-off**.

## Why this matters

Almost every real project is a fight against overfitting, especially with many features and few rows. Without a held-out test set you would not notice it at all: a model with a training score of 0.99 looks wonderful until it meets real data.

> **Watch out:**
> - Judging a model by its training score. An overfit model has an excellent one.
> - Tuning the complexity on the test set again and again. You slowly overfit to the test set itself; later you will use cross-validation, which tunes on several different training/validation splits.
> - Believing more complex always means better. The degree-9 curve is the most flexible and the worst predictor here.
> - Tiny test sets: with 15 points the test score is a noisy estimate. Do not read too much into small differences.

> **Your turn:** loop over the degrees 1, 3 and 9, train on the training points, print both R squared scores for each degree, then print the best degree (by test score) and whether degree 9 is overfit.
