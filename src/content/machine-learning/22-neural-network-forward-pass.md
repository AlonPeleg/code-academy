---
title: A neural network from scratch I - the forward pass
summary: Build neurons, layers and activation functions in NumPy and push data through a small network whose weights solve XOR.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import numpy as np


      def sigmoid(z):
          # 1. 1 / (1 + e^(-z))
          pass


      def relu(z):
          # 2. the bigger of z and 0, element by element (np.maximum)
          pass


      def forward(X, W1, b1, W2, b2):
          # 3. hidden = sigmoid(X @ W1 + b1)      (the hidden layer)
          #    output = sigmoid(hidden @ W2 + b2) (the output layer)
          #    return both, as the tuple (hidden, output)
          pass


      # --- One single neuron: two inputs, two weights, one bias ---
      x = np.array([1.0, 2.0])
      w = np.array([0.5, -1.0])
      b = 0.5
      z = np.dot(w, x) + b
      print(f"z {z:.1f}")
      print(f"relu {relu(z):.1f}")
      print(f"sigmoid {sigmoid(z):.2f}")

      # --- A 2-2-1 network with hand-chosen weights ---
      # hidden neuron 1 behaves like OR, hidden neuron 2 like NAND, the output like AND.
      W1 = np.array([[20.0, -20.0],
                     [20.0, -20.0]])
      b1 = np.array([-10.0, 30.0])
      W2 = np.array([[20.0],
                     [20.0]])
      b2 = np.array([-30.0])

      X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)

      # 4. Call forward on X. Print the hidden shape (hidden.shape), the hidden activations
      #    rounded to 2 decimals, the outputs flattened (output.ravel()) rounded to 2 decimals,
      #    the predicted classes as integers (output > 0.5, .astype(int), flattened),
      #    and the number of parameters: f"parameters {W1.size + b1.size + W2.size + b2.size}".

      # 5. Why do we need an activation at all? Make rng = np.random.default_rng(0),
      #    A = rng.normal(size=(2, 3)), B = rng.normal(size=(3, 1)).
      #    Print np.allclose(X @ A @ B, X @ (A @ B)): two layers WITHOUT activation
      #    are just one layer in disguise.
check:
  output: |
    z -1.0
    relu 0.0
    sigmoid 0.27
    (4, 2)
    [[0. 1.]
     [1. 1.]
     [1. 1.]
     [1. 0.]]
    [0. 1. 1. 0.]
    [0 1 1 0]
    parameters 9
    True
  code:
    - { pattern: 'np\.exp\s*\(', message: "Build the sigmoid with np.exp." }
    - { pattern: 'np\.maximum\s*\(', message: "Build relu with np.maximum(0, z)." }
    - { pattern: '@\s*W2|np\.dot\s*\(\s*hidden', message: "The output layer is a matrix product: hidden @ W2 + b2." }
    - { pattern: 'allclose', message: "Use np.allclose for the last check." }
hints:
  - "A layer does three things: multiply the inputs by a weight matrix (@), add a bias vector, apply an activation function. A network is layers stacked, each feeding the next."
  - "sigmoid is 1 / (1 + np.exp(-z)); relu is np.maximum(0, z). forward: hidden = sigmoid(X @ W1 + b1) and output = sigmoid(hidden @ W2 + b2); return hidden, output."
  - "hidden, output = forward(X, W1, b1, W2, b2)   print(hidden.shape)   print(hidden.round(2))   print(output.ravel().round(2))   print((output > 0.5).astype(int).ravel())"
solution:
  - name: main.py
    code: |
      import numpy as np


      def sigmoid(z):
          return 1 / (1 + np.exp(-z))


      def relu(z):
          return np.maximum(0, z)


      def forward(X, W1, b1, W2, b2):
          hidden = sigmoid(X @ W1 + b1)
          output = sigmoid(hidden @ W2 + b2)
          return hidden, output


      x = np.array([1.0, 2.0])
      w = np.array([0.5, -1.0])
      b = 0.5
      z = np.dot(w, x) + b
      print(f"z {z:.1f}")
      print(f"relu {relu(z):.1f}")
      print(f"sigmoid {sigmoid(z):.2f}")

      W1 = np.array([[20.0, -20.0],
                     [20.0, -20.0]])
      b1 = np.array([-10.0, 30.0])
      W2 = np.array([[20.0],
                     [20.0]])
      b2 = np.array([-30.0])

      X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)

      hidden, output = forward(X, W1, b1, W2, b2)
      print(hidden.shape)
      print(hidden.round(2))
      print(output.ravel().round(2))
      print((output > 0.5).astype(int).ravel())
      print(f"parameters {W1.size + b1.size + W2.size + b2.size}")

      rng = np.random.default_rng(0)
      A = rng.normal(size=(2, 3))
      B = rng.normal(size=(3, 1))
      print(np.allclose(X @ A @ B, X @ (A @ B)))
quiz:
  - q: "What does one artificial neuron compute?"
    options: ["A weighted sum of its inputs plus a bias, passed through an activation function", "The average of its inputs", "A random number"]
    answer: 0
  - q: "What would happen if every layer of a network used NO activation function?"
    options: ["The network would be more powerful", "The whole network would collapse into a single linear layer and could not solve XOR", "Nothing, activations are only decoration"]
    answer: 1
    explain: "Matrix products compose into one matrix, so stacked linear layers can only draw a straight boundary."
  - q: "relu(-3) and relu(2.5) are"
    options: ["-3 and 2.5", "0 and 2.5", "3 and 2.5"]
    answer: 1
  - q: "X has shape (4, 2) and W1 has shape (2, 2). What is the shape of X @ W1?"
    options: ["(2, 2)", "(4, 4)", "(4, 2)"]
    answer: 2
    explain: "For matrices (a, b) @ (b, c) gives (a, c). The inner sizes must match."
---

A neural network looks mysterious, but its forward pass is just multiplication and addition, repeated. In this lesson (and the next two) you build one from scratch with NumPy. Part I covers what the pieces are and how data flows through them. Part II teaches the network to learn.

## One neuron

A **neuron** takes some numbers in, mixes them, and produces one number out:

1. Multiply each input by its own **weight** (how much that input matters).
2. Add them up, plus a **bias** (a constant shift).
3. Pass the total through an **activation function** that bends it.

Worked example: inputs `x = [1, 2]`, weights `w = [0.5, -1]`, bias `0.5`. The sum is `z = 0.5*1 + (-1)*2 + 0.5 = -1.0`. You have actually met this already: with a sigmoid as the activation, a single neuron is exactly logistic regression from the last lesson.

## Activation functions

Two popular ones:

* **sigmoid**: `1 / (1 + e^(-z))` squashes to (0, 1). `sigmoid(-1) = 0.27`.
* **ReLU** ("rectified linear unit"): `max(0, z)`. It passes positive numbers and silences negative ones. `relu(-1) = 0`, `relu(2.5) = 2.5`. In NumPy: `np.maximum(0, z)`.

The activation is not decoration. Without it, a neuron computes a weighted sum, and a weighted sum of weighted sums is just another weighted sum. A hundred layers would be no more powerful than one, and the network could only draw straight lines. The bend in the activation is what lets a network draw curves. The last check in the exercise proves it: `X @ A @ B` equals `X @ (A @ B)`, so two activation-free layers are really a single layer.

## Layers: many neurons at once

A **layer** is several neurons looking at the same inputs. Instead of a loop, we use a matrix. If a batch of inputs `X` has shape `(samples, inputs)` and the layer has `n` neurons, the weights form a matrix `W` of shape `(inputs, n)` and the bias is a vector of length `n`:

```python
hidden = sigmoid(X @ W1 + b1)
```

`@` is matrix multiplication. Shapes follow the rule `(a, b) @ (b, c) -> (a, c)`: with 4 samples, 2 inputs and 2 neurons, `(4, 2) @ (2, 2)` gives `(4, 2)`. The bias vector is added to every row automatically (this is called broadcasting). The result `hidden` has one column per neuron, one row per sample.

A **network** is layers chained together: the output of the first (the **hidden layer**) is the input of the next. The last layer produces the answer.

```python
hidden = sigmoid(X @ W1 + b1)
output = sigmoid(hidden @ W2 + b2)
```

Computing the output from the input like this is called the **forward pass**.

## The XOR puzzle

XOR ("exclusive or") is 1 when exactly one of two inputs is 1: `(0,0) -> 0`, `(0,1) -> 1`, `(1,0) -> 1`, `(1,1) -> 0`. Plot those four points: no single straight line separates the 1s from the 0s, so logistic regression or one neuron fails. A hidden layer solves it. In the exercise the weights are set by hand with big numbers (so the sigmoid acts almost like a switch):

* hidden neuron 1 acts like OR (on if at least one input is on),
* hidden neuron 2 acts like NAND (off only if both are on),
* the output neuron is an AND of the two. "At least one on" AND "not both on" is exactly XOR.

Check input `(1, 1)` by hand: neuron 1 gives `sigmoid(20 + 20 - 10) = 1`, neuron 2 gives `sigmoid(-20 - 20 + 30) = sigmoid(-10) = 0`, the output `sigmoid(20*1 + 20*0 - 30) = sigmoid(-10) = 0`. Correct.

## How to read the output

* `hidden.shape` of `(4, 2)`: 4 samples, 2 hidden neurons.
* The hidden activations show each neuron acting like a switch: columns of mostly 0 and 1.
* The rounded outputs `[0. 1. 1. 0.]` are the probabilities, and the class list `[0 1 1 0]` is XOR.
* `parameters 9` counts every weight and bias: `2*2 + 2 + 2*1 + 1`. Real networks have millions, but the idea is identical.

> **Watch out:**
> - `ValueError: matmul: Input operand 1 has a mismatch in its core dimension` means the inner sizes of your shapes do not match. Print `.shape` of both sides.
> - `*` multiplies element by element, `@` multiplies matrices. Using `*` instead of `@` silently gives a wrong result or a broadcasting error.
> - Weights stored as `(neurons, inputs)` instead of `(inputs, neurons)`. Pick one convention and check the shape.
> - The bias has one number per neuron, not per input.
> - Do not start real training with all weights equal. Part II uses small random numbers so that neurons can specialise.

> **Your turn:** write `sigmoid`, `relu` and `forward`, evaluate the single neuron, then push the four XOR inputs through the 2-2-1 network with the given weights and print the requested values.
