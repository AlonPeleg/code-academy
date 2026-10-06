---
title: Logistic regression from scratch
summary: Build the sigmoid, the log loss and the gradient step with NumPy and train a classifier that outputs probabilities.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.linear_model import LogisticRegression

      # Hours studied and whether the student passed (1) or not (0)
      x = np.array([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6])
      y = np.array([0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1])


      def sigmoid(z):
          # 1. return 1 / (1 + e^(-z))   (np.exp)
          pass


      def log_loss(p, y):
          # 2. clip p into [1e-12, 1 - 1e-12] (np.clip) so log never sees 0,
          #    then return  -mean( y * log(p) + (1 - y) * log(1 - p) )
          pass


      print(sigmoid(0.0))
      print(round(float(sigmoid(2.0)), 2))

      w, b = 0.0, 0.0
      p = sigmoid(w * x + b)
      loss_start = log_loss(p, y)
      print(f"start loss {loss_start:.2f}")

      # 3. One gradient step. With probabilities p the gradients are
      #       grad_w = mean((p - y) * x)      grad_b = mean(p - y)
      #    Compute them for the starting w, b and print f"grad_w {grad_w:.3f} grad_b {grad_b:.3f}".

      # 4. Train: repeat 2000 times (learning rate 0.5): p = sigmoid(w*x + b),
      #    compute grad_w and grad_b as above, then w -= lr * grad_w and b -= lr * grad_b.
      #    Afterwards print:
      #      f"loss went down: {loss_end < loss_start}"
      #      f"w {w:.2f} b {b:.2f}"
      #      f"boundary {-b / w:.2f} hours"      (where the probability is exactly 0.5)
      #      f"accuracy {accuracy:.2f}"           (share of (p > 0.5) equal to y)
      #      f"P(pass | 4h) {sigmoid(w * 4 + b):.2f}"

      # 5. Fit sklearn's LogisticRegression(C=1e9, max_iter=10000) on x.reshape(-1, 1), y and print
      #    f"matches sklearn: {...}" using np.allclose([w, b], [model.coef_[0, 0], model.intercept_[0]], atol=0.05).
check:
  output: |
    0.5
    0.88
    start loss 0.69
    grad_w -0.625 grad_b 0.000
    loss went down: True
    w 1.42 b -4.63
    boundary 3.25 hours
    accuracy 0.83
    P(pass | 4h) 0.74
    matches sklearn: True
  code:
    - { pattern: 'np\.exp\s*\(', message: "Build the sigmoid with np.exp." }
    - { pattern: 'np\.log\s*\(', message: "Use np.log in the log loss." }
    - { pattern: 'grad_w\s*=.*np\.mean|grad_w\s*=.*\.mean\s*\(', message: "Compute grad_w = np.mean((p - y) * x)." }
    - { pattern: 'for\s+\w+\s+in\s+range', message: "Train with a for loop over the epochs." }
hints:
  - "The sigmoid squashes any number into (0, 1), so it can be read as a probability. The log loss punishes confident wrong answers very hard. The gradient of the log loss has the same simple shape as in linear regression: (prediction - truth) times the input."
  - "sigmoid: 1 / (1 + np.exp(-z)).  log loss: -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)).  Gradients: grad_w = np.mean((p - y) * x), grad_b = np.mean(p - y)."
  - "for _ in range(2000):   p = sigmoid(w * x + b)   w -= 0.5 * np.mean((p - y) * x)   b -= 0.5 * np.mean(p - y)   (then loss_end = log_loss(sigmoid(w * x + b), y) and accuracy = np.mean((p > 0.5) == y))"
solution:
  - name: main.py
    code: |
      import numpy as np
      from sklearn.linear_model import LogisticRegression

      x = np.array([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6])
      y = np.array([0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1])


      def sigmoid(z):
          return 1 / (1 + np.exp(-z))


      def log_loss(p, y):
          p = np.clip(p, 1e-12, 1 - 1e-12)
          return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))


      print(sigmoid(0.0))
      print(round(float(sigmoid(2.0)), 2))

      w, b = 0.0, 0.0
      p = sigmoid(w * x + b)
      loss_start = log_loss(p, y)
      print(f"start loss {loss_start:.2f}")

      grad_w = np.mean((p - y) * x)
      grad_b = np.mean(p - y)
      print(f"grad_w {grad_w:.3f} grad_b {grad_b:.3f}")

      lr = 0.5
      for _ in range(2000):
          p = sigmoid(w * x + b)
          grad_w = np.mean((p - y) * x)
          grad_b = np.mean(p - y)
          w -= lr * grad_w
          b -= lr * grad_b

      p = sigmoid(w * x + b)
      loss_end = log_loss(p, y)
      accuracy = np.mean((p > 0.5) == y)
      print(f"loss went down: {loss_end < loss_start}")
      print(f"w {w:.2f} b {b:.2f}")
      print(f"boundary {-b / w:.2f} hours")
      print(f"accuracy {accuracy:.2f}")
      print(f"P(pass | 4h) {sigmoid(w * 4 + b):.2f}")

      model = LogisticRegression(C=1e9, max_iter=10000).fit(x.reshape(-1, 1), y)
      print(f"matches sklearn: {np.allclose([w, b], [model.coef_[0, 0], model.intercept_[0]], atol=0.05)}")
quiz:
  - q: "What does the sigmoid function do?"
    options: ["Squashes any number into the range 0 to 1 so it can be read as a probability", "Sorts the data", "Computes the average"]
    answer: 0
  - q: "sigmoid(0) equals"
    options: ["0", "0.5", "1"]
    answer: 1
    explain: "1 / (1 + e^0) = 1 / 2. A score of exactly 0 means the model is completely undecided."
  - q: "A student who really passed (y = 1) gets predicted probability 0.01. How does the log loss for that point compare with a prediction of 0.9?"
    options: ["About the same", "Much smaller", "Much larger: -ln(0.01) = 4.6 versus -ln(0.9) = 0.1"]
    answer: 2
  - q: "The gradient steps use (p - y) * x. If the model predicts p = 0.9 for a student who failed (y = 0), this point pushes w"
    options: ["Down, making that prediction smaller", "Up, making it even bigger", "Nowhere"]
    answer: 0
---

Despite its name, **logistic regression** is a classifier: it answers "yes or no" questions such as "will this student pass?" It does so by predicting a probability. In the last lesson you minimised a loss for a line. Here you will do the same trick with two new ingredients, the **sigmoid** and the **log loss**, and match scikit-learn's answer.

## From a score to a probability

Start the same as linear regression: a score `z = w * x + b`. A score can be any number, from minus infinity to plus infinity, but a probability must stay between 0 and 1. The **sigmoid** (or logistic) function squashes it:

```python
def sigmoid(z):
    return 1 / (1 + np.exp(-z))
```

Worked values: `sigmoid(0) = 0.5`, `sigmoid(2) = 0.88`, `sigmoid(-2) = 0.12`, and `sigmoid(10)` is almost exactly 1. Big positive scores mean "very likely yes", big negative scores "very likely no", and a score of 0 means 50/50. We predict "pass" when the probability is above 0.5, which happens exactly when `z > 0`. The line `w * x + b = 0` is the **decision boundary**, here at `x = -b / w` hours.

## Measuring wrongness: the log loss

Squared error is a poor judge of probabilities. **Log loss** (also called cross-entropy) is the standard. For one student with true label `y` and predicted pass probability `p`:

* if `y = 1`, the loss is `-ln(p)`;
* if `y = 0`, the loss is `-ln(1 - p)`.

Both can be written as one formula: `-(y * ln(p) + (1 - y) * ln(1 - p))`. What it feels like: a student who passed and got `p = 0.9` costs `-ln(0.9) = 0.11`, small. One who passed but got `p = 0.5` costs `0.69`. And one who passed but got `p = 0.01` costs `4.6`, a huge penalty for being confidently wrong. The loss of the whole dataset is the mean. An untrained model that says 0.5 everywhere scores `ln 2 = 0.69`, which is a good "starting loss" to remember.

Because `ln(0)` is minus infinity, the code clips `p` to a hair away from 0 and 1 first.

## The gradient step

Calculus gives a beautifully simple gradient for the log loss combined with the sigmoid:

```text
grad_w = mean((p - y) * x)        grad_b = mean(p - y)
```

This is the same shape as in linear regression: (prediction minus truth) times the input. A worked first step with `w = b = 0` (so every `p = 0.5`): half of the 12 students passed, so `mean(p - y)` is 0, and `grad_w = -0.625`. The negative gradient means "increase `w`" (more study hours should mean a higher pass probability), exactly what common sense says. Then the usual update, `w -= lr * grad_w`, repeated 2000 times.

## How to read the output

* `start loss 0.69` is the "know nothing" level. The line `loss went down: True` is the quick check that training worked.
* `w 1.42 b -4.63`: each extra hour adds 1.42 to the score. The boundary `-b / w = 3.25` hours is where the model switches from "fail" to "pass".
* `accuracy 0.83` means 10 of 12 students are classified correctly. It is not 1.0 because the data overlaps: a student with 2.5 hours passed while another with 3 hours failed. No straight boundary separates them, and that is realistic.
* `P(pass | 4h) 0.74` is the point of logistic regression: not only a verdict but also how sure the model is.
* `matches sklearn: True` confirms you rebuilt the real thing. We used `C=1e9` to switch off scikit-learn's default regularisation, which shrinks the weights a little.

> **Watch out:**
> - `RuntimeWarning: divide by zero encountered in log` means a probability hit exactly 0 or 1. Clip it.
> - Using the squared-error gradient `2 * (p - y) ...` is not wrong enough to crash, but it is not the right gradient for log loss.
> - `np.exp(-z)` overflows for very negative `z` (`z < -700`). Real libraries use a stable version; for scaled features you will not meet this.
> - If your two classes can be separated perfectly, the weights keep growing forever and the loss approaches 0. Regularisation prevents this.
> - Mixing up probability and class: `p > 0.5` gives the class, `p` itself is the probability.

> **Your turn:** implement `sigmoid` and `log_loss`, compute the first gradient step by hand-coded NumPy, train for 2000 epochs with a learning rate of 0.5, print the requested numbers and check that scikit-learn agrees.
