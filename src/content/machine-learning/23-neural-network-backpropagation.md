---
title: A neural network from scratch II - backpropagation
summary: Teach the network from the last lesson to solve XOR by itself with backpropagation, and check your gradients numerically.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt

      X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
      y = np.array([[0], [1], [1], [0]], dtype=float)


      def sigmoid(z):
          return 1 / (1 + np.exp(-z))


      def forward(X, W1, b1, W2, b2):
          hidden = sigmoid(X @ W1 + b1)
          p = sigmoid(hidden @ W2 + b2)
          return hidden, p


      def loss_fn(p, y):
          return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))


      def gradients(X, y, W1, b1, W2, b2):
          hidden, p = forward(X, W1, b1, W2, b2)
          n = len(X)
          # 1. Backpropagation, from the output back to the input:
          #    dz2     = (p - y) / n                  how the loss changes with the output score
          #    dW2     = hidden.T @ dz2               db2 = dz2.sum(axis=0)
          #    dhidden = dz2 @ W2.T                   send the blame back to the hidden layer
          #    dz1     = dhidden * hidden * (1 - hidden)    (derivative of the sigmoid)
          #    dW1     = X.T @ dz1                    db1 = dz1.sum(axis=0)
          dW1, db1 = np.zeros_like(W1), np.zeros_like(b1)
          dW2, db2 = np.zeros_like(W2), np.zeros_like(b2)
          return dW1, db1, dW2, db2


      # Random start: 2 inputs -> 4 hidden neurons -> 1 output
      rng = np.random.default_rng(0)
      W1 = rng.normal(size=(2, 4))
      b1 = np.zeros(4)
      W2 = rng.normal(size=(4, 1))
      b2 = np.zeros(1)

      loss_start = loss_fn(forward(X, W1, b1, W2, b2)[1], y)
      print(f"loss before {loss_start:.1f}")

      # 2. Gradient check. Take the analytic gradient dW2[0, 0] from gradients(...) at the start.
      #    Compute a numerical one: change W2[0, 0] by +1e-5 and by -1e-5 (use copies of W2),
      #    compute the loss for both, and divide the difference by 2e-5.
      #    Print f"gradient check: {np.isclose(analytic, numeric, rtol=1e-4)}".

      # 3. Train for 5000 epochs with learning rate 1.0: compute the gradients, then update
      #    every parameter with  param -= lr * gradient. Store the loss of each epoch in the list `losses`.
      losses = []

      # 4. Print f"loss after < 0.01: {losses[-1] < 0.01}", then the final predicted probabilities
      #    flattened and rounded to 2 decimals, then the classes (p > 0.5) as integers, flattened.
      #    Finally draw the loss curve with plt.plot(losses), a title, and plt.show().
check:
  output: |
    loss before 0.9
    gradient check: True
    loss after < 0.01: True
    [0. 1. 1. 0.]
    [0 1 1 0]
  code:
    - { pattern: 'hidden\s*\*\s*\(\s*1\s*-\s*hidden\s*\)|\(\s*1\s*-\s*hidden\s*\)\s*\*\s*hidden', message: "The sigmoid derivative is hidden * (1 - hidden)." }
    - { pattern: 'X\.T\s*@|np\.dot\s*\(\s*X\.T', message: "dW1 = X.T @ dz1." }
    - { pattern: '-=\s*lr|-\s*lr\s*\*', message: "Update every parameter with param -= lr * gradient." }
    - { pattern: 'plt\.plot\s*\(', message: "Draw the loss curve with plt.plot(losses)." }
    - { pattern: 'plt\.show\s*\(', message: "Call plt.show()." }
hints:
  - "Backpropagation is the chain rule applied layer by layer from the output backwards. For a sigmoid output with log loss the first step is simply dz2 = (p - y) / n. The weight gradient of a layer is (the layer's input).T @ (the error of that layer)."
  - "dW2 = hidden.T @ dz2; db2 = dz2.sum(axis=0); dhidden = dz2 @ W2.T; dz1 = dhidden * hidden * (1 - hidden); dW1 = X.T @ dz1; db1 = dz1.sum(axis=0). Return them in the order dW1, db1, dW2, db2."
  - "for _ in range(5000):   dW1, db1, dW2, db2 = gradients(X, y, W1, b1, W2, b2)   W1 -= lr * dW1   b1 -= lr * db1   W2 -= lr * dW2   b2 -= lr * db2   losses.append(loss_fn(forward(X, W1, b1, W2, b2)[1], y))"
solution:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt

      X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
      y = np.array([[0], [1], [1], [0]], dtype=float)


      def sigmoid(z):
          return 1 / (1 + np.exp(-z))


      def forward(X, W1, b1, W2, b2):
          hidden = sigmoid(X @ W1 + b1)
          p = sigmoid(hidden @ W2 + b2)
          return hidden, p


      def loss_fn(p, y):
          return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))


      def gradients(X, y, W1, b1, W2, b2):
          hidden, p = forward(X, W1, b1, W2, b2)
          n = len(X)
          dz2 = (p - y) / n
          dW2 = hidden.T @ dz2
          db2 = dz2.sum(axis=0)
          dhidden = dz2 @ W2.T
          dz1 = dhidden * hidden * (1 - hidden)
          dW1 = X.T @ dz1
          db1 = dz1.sum(axis=0)
          return dW1, db1, dW2, db2


      rng = np.random.default_rng(0)
      W1 = rng.normal(size=(2, 4))
      b1 = np.zeros(4)
      W2 = rng.normal(size=(4, 1))
      b2 = np.zeros(1)

      loss_start = loss_fn(forward(X, W1, b1, W2, b2)[1], y)
      print(f"loss before {loss_start:.1f}")

      analytic = gradients(X, y, W1, b1, W2, b2)[2][0, 0]
      eps = 1e-5
      W2_up = W2.copy()
      W2_up[0, 0] += eps
      W2_down = W2.copy()
      W2_down[0, 0] -= eps
      loss_up = loss_fn(forward(X, W1, b1, W2_up, b2)[1], y)
      loss_down = loss_fn(forward(X, W1, b1, W2_down, b2)[1], y)
      numeric = (loss_up - loss_down) / (2 * eps)
      print(f"gradient check: {np.isclose(analytic, numeric, rtol=1e-4)}")

      lr = 1.0
      losses = []
      for _ in range(5000):
          dW1, db1, dW2, db2 = gradients(X, y, W1, b1, W2, b2)
          W1 -= lr * dW1
          b1 -= lr * db1
          W2 -= lr * dW2
          b2 -= lr * db2
          losses.append(loss_fn(forward(X, W1, b1, W2, b2)[1], y))

      p = forward(X, W1, b1, W2, b2)[1]
      print(f"loss after < 0.01: {losses[-1] < 0.01}")
      print(p.ravel().round(2))
      print((p > 0.5).astype(int).ravel())

      plt.plot(losses)
      plt.title("Training loss on XOR")
      plt.xlabel("epoch")
      plt.ylabel("log loss")
      plt.show()
quiz:
  - q: "What is backpropagation?"
    options: ["Using the chain rule to compute, layer by layer from the output backwards, how the loss changes with every weight", "Running the network on the test set", "Deleting the weights that are too small"]
    answer: 0
  - q: "Why is the derivative of the sigmoid written hidden * (1 - hidden)?"
    options: ["It is a random choice", "It scales the data", "The sigmoid's slope can be computed from its own output s as s * (1 - s)"]
    answer: 2
    explain: "For s = sigmoid(z), ds/dz = s * (1 - s). It is at most 0.25 and tiny when s is near 0 or 1, which is why very deep sigmoid networks learn slowly."
  - q: "A gradient check compares your analytic gradient with"
    options: ["The sklearn result", "A numerical estimate (loss(w + eps) - loss(w - eps)) / (2 * eps)", "The accuracy"]
    answer: 1
  - q: "If all initial weights were exactly the same number, what goes wrong?"
    options: ["Nothing", "The loss becomes negative", "All hidden neurons get identical gradients and stay identical, so they never specialise"]
    answer: 2
---

Last lesson you pushed data forward through a network with hand-picked weights. Real networks have to find the weights themselves. The method is **backpropagation**: work out how much each weight is to blame for the error, and nudge it. It is gradient descent (lesson 20) for a network, so you already know the loop. The new part is calculating the gradients layer by layer.

## The plan

1. **Forward pass:** compute the hidden layer and the output `p`.
2. **Loss:** compare with the truth using the log loss (lesson 21).
3. **Backward pass:** compute the gradient of the loss with respect to every weight and bias.
4. **Update:** `param -= lr * gradient`.
5. Repeat many times.

## The chain rule in plain words

If the loss depends on `p`, `p` depends on a score `z2`, and `z2` depends on a weight `W2`, then "how the loss reacts to `W2`" is the product of the three small reactions along the chain. That product rule is the **chain rule**. Backpropagation does it from the output backwards, reusing earlier results, which is cheap.

A tiny worked example with one neuron: input `x = 1`, weight `w = 0.5`, bias 0, true label `y = 1`. The score is `0.5`, so `p = sigmoid(0.5) = 0.62`. For a sigmoid with log loss the first link of the chain collapses to `p - y = -0.38`. The input is 1, so `dw = (p - y) * x = -0.38`. Negative gradient means "make `w` bigger", which indeed pushes `p` towards 1.

## The four lines that matter

For our 2-4-1 network with `n` samples:

```python
dz2 = (p - y) / n                          # error at the output
dW2 = hidden.T @ dz2                       # weights output <- hidden
db2 = dz2.sum(axis=0)
dhidden = dz2 @ W2.T                       # push the error back through W2
dz1 = dhidden * hidden * (1 - hidden)      # through the sigmoid
dW1 = X.T @ dz1                            # weights hidden <- input
db1 = dz1.sum(axis=0)
```

Read them as a pattern. For every layer: the weight gradient is **the input of that layer, transposed, times the error at that layer's score** (`hidden.T @ dz2`, `X.T @ dz1`). The error moves backwards by multiplying with the transposed weights (`dz2 @ W2.T`) and passing through the derivative of the activation. The sigmoid's derivative is `s * (1 - s)` where `s` is the sigmoid's output: at `s = 0.5` it is `0.25`, the steepest point, and near 0 or 1 it is almost zero (the neuron is "saturated" and learns slowly). Dividing by `n` makes it the gradient of the **mean** loss.

## Always check your gradients

A backprop bug usually does not crash. The network just learns badly. The standard safety net is a **gradient check**: nudge one weight up and down by a tiny `eps`, see how the loss changes, and compare:

```text
numeric = (loss(w + eps) - loss(w - eps)) / (2 * eps)
```

If your analytic gradient agrees (`np.isclose`), your formulas are almost certainly right. Numeric gradients are far too slow to train with, but perfect for testing.

## Why random initial weights?

We start with `rng.normal(...)`: small random numbers. If every weight started equal, all hidden neurons would compute the same thing and receive identical gradients, so they would stay clones forever. Randomness breaks the symmetry so neurons can specialise. Biases may start at 0. We use a fixed seed so the run repeats exactly.

## How to read the output

* `loss before 0.9`: a random network is wrong, and the log loss is about as high as the "always say 0.5" value of 0.69 or worse.
* `gradient check: True`: your backward pass matches calculus.
* `loss after < 0.01: True` and the probabilities `[0. 1. 1. 0.]`: the network learned XOR from scratch. The one-neuron model of lesson 21 can never do this.
* The loss curve usually falls slowly at first (the network is searching for a useful hidden representation), then drops quickly, then flattens.

> **Watch out:**
> - Forgetting `hidden * (1 - hidden)` in `dz1` is the classic bug. The loss still goes down a little, but the network learns very poorly.
> - `ValueError: operands could not be broadcast together`: print the shapes of `dW1`, `W1` and so on. A gradient must have exactly the shape of its parameter.
> - Updating the weights *in place* while still computing other gradients. Compute all gradients first, then update.
> - Too big a learning rate makes the loss jump around or become `nan`. If the loss rises, lower it.
> - XOR training can occasionally get stuck with a bad random start. A fixed `rng` seed makes your run repeatable, and trying another seed is a normal first fix.

> **Your turn:** fill in the backward pass in `gradients`, run the numerical gradient check on `dW2[0, 0]`, train for 5000 epochs while recording the loss, print the results and draw the loss curve.
