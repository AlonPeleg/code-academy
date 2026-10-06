---
title: Gradient descent from scratch
summary: Fit a straight line with nothing but NumPy by repeatedly nudging the slope and intercept downhill on the loss, and see what the learning rate does.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import numpy as np

      x = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=float)
      y = np.array([3.1, 4.8, 7.4, 8.7, 11.4, 12.9, 15.1, 17.2])


      def train(lr, epochs):
          """Fit y = w * x + b by gradient descent. Returns w, b and the final loss."""
          w, b = 0.0, 0.0
          for _ in range(epochs):
              # 1. predictions:  pred = w * x + b
              # 2. error:        error = pred - y
              # 3. gradients:    grad_w = 2 * mean(error * x)    grad_b = 2 * mean(error)
              # 4. update:       w = w - lr * grad_w            b = b - lr * grad_b
              pass
          loss = np.mean((w * x + b - y) ** 2)
          return w, b, loss


      # Loss of the starting guess w = 0, b = 0
      _, _, loss_before = train(0.02, 0)
      print(f"loss before {loss_before:.0f}")

      # 5. Train with learning rate 0.02 for 3000 epochs and print
      #    f"loss after {loss:.2f}" and f"w {w:.2f} b {b:.2f}".

      # 6. Compare with the exact least-squares answer: np.polyfit(x, y, 1) returns [slope, intercept].
      #    Print np.allclose([w, b], np.polyfit(x, y, 1), atol=0.01).

      # 7. Try a tiny learning rate 0.001 for only 100 epochs and print f"slow: w={w:.1f}".
      #    Then a too large rate 0.06 for 50 epochs and print f"diverged: {loss > loss_before}".
check:
  output: |
    loss before 123
    loss after 0.06
    w 2.02 b 1.00
    True
    slow: w=2.1
    diverged: True
  code:
    - { pattern: 'grad\w*\s*=.*np\.mean|np\.mean\s*\(.*\)\s*\*\s*2|2\s*\*\s*np\.mean', message: "Compute the gradients with np.mean (2 * np.mean(error * x) and 2 * np.mean(error))." }
    - { pattern: '(w|b)\s*(-=|=\s*\w+\s*-)', message: "Update w and b by subtracting lr times the gradient." }
    - { pattern: 'polyfit\s*\(', message: "Compare with np.polyfit(x, y, 1)." }
hints:
  - "Gradient descent repeats four steps: predict, measure the error, compute how the loss changes when w and b change (the gradients), and step both numbers a little in the opposite direction."
  - "error = w * x + b - y   grad_w = 2 * np.mean(error * x)   grad_b = 2 * np.mean(error). Because the gradient points uphill, you subtract it: w -= lr * grad_w."
  - "for _ in range(epochs):   error = w * x + b - y   w -= lr * 2 * np.mean(error * x)   b -= lr * 2 * np.mean(error)  (compute both gradients BEFORE changing w, or use temporary variables.)"
solution:
  - name: main.py
    code: |
      import numpy as np

      x = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=float)
      y = np.array([3.1, 4.8, 7.4, 8.7, 11.4, 12.9, 15.1, 17.2])


      def train(lr, epochs):
          """Fit y = w * x + b by gradient descent. Returns w, b and the final loss."""
          w, b = 0.0, 0.0
          for _ in range(epochs):
              pred = w * x + b
              error = pred - y
              grad_w = 2 * np.mean(error * x)
              grad_b = 2 * np.mean(error)
              w = w - lr * grad_w
              b = b - lr * grad_b
          loss = np.mean((w * x + b - y) ** 2)
          return w, b, loss


      # Loss of the starting guess w = 0, b = 0
      _, _, loss_before = train(0.02, 0)
      print(f"loss before {loss_before:.0f}")

      w, b, loss = train(0.02, 3000)
      print(f"loss after {loss:.2f}")
      print(f"w {w:.2f} b {b:.2f}")

      print(np.allclose([w, b], np.polyfit(x, y, 1), atol=0.01))

      w, b, loss = train(0.001, 100)
      print(f"slow: w={w:.1f}")
      w, b, loss = train(0.06, 50)
      print(f"diverged: {loss > loss_before}")
quiz:
  - q: "In gradient descent, why do we SUBTRACT the gradient from the parameter?"
    options: ["The gradient points uphill (where the loss grows), so we walk the opposite way", "Because the gradient is always negative", "To make the numbers smaller"]
    answer: 0
  - q: "The learning rate is far too big (like 0.06 in the lesson). What typically happens?"
    options: ["Training is just a bit faster", "The steps overshoot the valley, the loss grows and the numbers explode", "The model memorises the data"]
    answer: 1
  - q: "The learning rate is far too small. What happens?"
    options: ["The loss goes up", "The model overfits", "It moves in the right direction but needs a huge number of steps"]
    answer: 2
  - q: "What does one epoch mean in this lesson?"
    options: ["One update using all the training points", "One data point", "One hour of training"]
    answer: 0
    explain: "Using the whole dataset for each step is called batch gradient descent. Variants use small random chunks (mini-batches)."
---

Almost every model that "learns", from linear regression to neural networks with billions of numbers, learns by the same loop: measure how wrong you are, work out which way to nudge each number to be less wrong, nudge, repeat. This is **gradient descent**. In this lesson you will write it yourself with NumPy only, and fit a straight line to some points.

## The setting

We want a line `y = w * x + b`. The slope `w` and the intercept `b` are the **parameters** the model learns. To say how bad a line is, we need a **loss**: the mean squared error (MSE), the average of `(prediction - truth)^2`. A perfect line has loss 0, and a bad one has a big loss. Learning means finding the `w` and `b` with the smallest loss.

Picture the loss as a landscape: every pair `(w, b)` is a location and the loss is the height. We want the lowest valley. Standing somewhere in the fog, you can feel which direction slopes downhill. Gradient descent takes a small step that way and repeats.

## A worked example by hand

Take just three points: `x = 1, 2, 3` and `y = 3, 5, 7` (the true line is `w = 2, b = 1`). Start at `w = 0, b = 0`.

* Predictions are all 0, so the **error** `pred - y` is `-3, -5, -7`.
* The **gradient** says how the loss changes when you change a parameter. For MSE it is
  `grad_w = 2 * mean(error * x) = 2 * (-3 - 10 - 21) / 3 = -22.67` and
  `grad_b = 2 * mean(error) = 2 * (-15 / 3) = -10`.
* Both gradients are negative: increasing `w` or `b` would reduce the loss. The update rule is `new = old - lr * gradient`. With a learning rate `lr = 0.01`: `w = 0 - 0.01 * (-22.67) = 0.23` and `b = 0 - 0.01 * (-10) = 0.10`.

One step moved both numbers towards the truth (2 and 1). The code below repeats this thousands of times.

## The training loop

```python
for _ in range(epochs):
    pred = w * x + b
    error = pred - y
    grad_w = 2 * np.mean(error * x)
    grad_b = 2 * np.mean(error)
    w = w - lr * grad_w
    b = b - lr * grad_b
```

An **epoch** is one pass in which every data point has contributed to one update. Note that `x`, `y`, `pred` and `error` are NumPy arrays, so every line works on all points at once (vectorised). The gradient is the derivative of the loss: for one point the loss is `(w*x + b - y)^2`, whose derivative with respect to `w` is `2 * (w*x + b - y) * x`, and we average that over the points.

## The learning rate

`lr` is a **hyperparameter**, a setting you choose, not something learned. It controls the step size:

| Learning rate | What happens |
|---|---|
| Too small (0.001) | Moves the right way, but after 100 epochs `w` is only 2.1 and `b` is far from 1. You would need thousands of steps. |
| Just right (0.02) | Settles on `w = 2.02`, `b = 1.00` after about 3000 epochs. |
| Too big (0.06) | Every step overshoots the valley and lands higher on the other side. The loss grows, and the numbers explode. This is called **divergence**. |

## How to read the output

* `loss before 123` and `loss after 0.06`: the loss collapsed. Printing the loss is the most important debugging habit in machine learning. If it does not go down, something is wrong.
* `w 2.02 b 1.00` matches the data, which was made from the line `y = 2x + 1` plus a little noise. A model cannot get a loss of 0 because of the noise, so 0.06 is about as good as it gets.
* `True` from `np.allclose(..., atol=0.01)` says gradient descent found the same line as the exact least-squares formula in `np.polyfit`. For a line there is a closed formula; gradient descent matters because it also works where no formula exists.
* `diverged: True` shows what a bad learning rate does.

> **Watch out:**
> - Updating `w` before computing `grad_b` with the new `w`. Compute both gradients first, then update both.
> - A sign error (`w = w + lr * grad_w`) sends you uphill. The loss increases every epoch.
> - Forgetting that `x` must be a float NumPy array. A plain Python list gives `TypeError: can't multiply sequence by non-int of type 'float'`.
> - If features have very different sizes (like 1 to 8 beside 1000 to 9000), one learning rate cannot suit both. This is another reason to scale features.
> - `RuntimeWarning: overflow encountered` or `nan` values mean the learning rate is far too high.

> **Your turn:** complete the `train` function with the four steps (predict, error, gradients, update), train with `lr = 0.02` for 3000 epochs, compare with `np.polyfit`, then see how a tiny and a huge learning rate behave. Follow the numbered comments.
