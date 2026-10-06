---
title: What is machine learning?
summary: Teach a computer to predict from examples, using a first tiny model built with NumPy.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      import numpy as np

      # Features: the size of a house in square metres.
      size = np.array([50, 60, 70, 80, 90])
      # Labels: the price each house sold for, in thousands.
      price = np.array([155, 178, 212, 238, 272])

      # 1. Train: fit a straight line to the examples. polyfit with degree 1
      #    returns two numbers: the slope and the intercept.
      # 2. Predict: use the line to guess the price of a 100 square metre house.
      # 3. Print the three lines shown in the expected output (2 decimals each).
check:
  output: |
    slope: 2.94
    intercept: 5.20
    prediction for 100 m2: 299.20
  code:
    - { pattern: 'np\.polyfit\s*\(', message: "Train the model with np.polyfit(size, price, 1)." }
hints:
  - "Training means finding the best straight line through the examples. NumPy has a function for exactly that: polyfit."
  - "np.polyfit(size, price, 1) returns the slope first and the intercept second, so write slope, intercept = np.polyfit(...). The prediction is slope * 100 + intercept."
  - "slope, intercept = np.polyfit(size, price, 1)   then   prediction = slope * 100 + intercept   and print f\"slope: {slope:.2f}\" (and so on for the other two lines)."
solution:
  - name: main.py
    code: |
      import numpy as np

      size = np.array([50, 60, 70, 80, 90])
      price = np.array([155, 178, 212, 238, 272])

      slope, intercept = np.polyfit(size, price, 1)
      prediction = slope * 100 + intercept

      print(f"slope: {slope:.2f}")
      print(f"intercept: {intercept:.2f}")
      print(f"prediction for 100 m2: {prediction:.2f}")
quiz:
  - q: "In machine learning, what is a label?"
    options: ["The answer we want the model to predict, such as a price", "A column name in a table", "The name of the model"]
    answer: 0
    explain: "Features are the inputs the model looks at; the label is the answer it should learn to predict."
  - q: "What does training a model mean?"
    options: ["Typing the rules in by hand", "Letting the computer find patterns in example data", "Deleting the old data"]
    answer: 1
  - q: "A house has 100 square metres and the model predicts its price. Which part is the feature?"
    options: ["The predicted price", "The slope", "The 100 square metres"]
    answer: 2
  - q: "Why do we keep the same random seeds and inline data in these lessons?"
    options: ["So the results are the same every time you run them", "Because random numbers are not allowed in Python", "To make the programs run slower"]
    answer: 0
---

Machine learning (ML) sounds mysterious, but the core idea is simple: instead of writing the rules yourself, you show the computer many **examples** and let it work out the rules. In this lesson you will build the smallest possible "learning" program and learn the words that the rest of the track uses.

## Rules versus examples

Suppose you want to guess the price of a house. You could write rules by hand: "start with 5, add 3 for every square metre". But where do 5 and 3 come from? You would have to guess, and every city has different numbers.

The machine learning way is to collect houses that already sold, with their sizes and prices, and let the computer **find** the numbers. Then it can predict the price of a house it has never seen.

## The vocabulary

| Word | Meaning | In our example |
|---|---|---|
| **Feature** | An input the model looks at | The size of the house |
| **Label** (or target) | The answer we want to predict | The price |
| **Example** (or row, sample) | One feature and label pair | One sold house |
| **Training** | Finding the best numbers from the examples | Fitting a line |
| **Model** | The thing that was learned and can predict | The line itself |
| **Prediction** | The model's answer for new data | The price of a 100 m2 house |

When the examples come with labels, it is called **supervised learning**. This track mostly covers supervised learning (predicting numbers, and predicting categories) plus a little learning without labels, such as grouping similar items.

## A first model with NumPy

NumPy is Python's library for numbers. The first time a program imports a library such as NumPy, pandas, matplotlib or scikit-learn, your browser downloads it. That can take a few seconds and needs an internet connection; afterwards it is cached and starts quickly. All the data in these lessons is built in, so you get the same results every time.

```python
import numpy as np

size = np.array([50, 60, 70, 80, 90])
price = np.array([155, 178, 212, 238, 272])

slope, intercept = np.polyfit(size, price, 1)
print(round(slope, 2), round(intercept, 2))   # prints: 2.94 5.2
```

Piece by piece:

- `np.array([...])` turns a Python list into a NumPy array, which is a fast list of numbers (more about it in the next lesson).
- `np.polyfit(x, y, 1)` finds the best straight line through the points. The `1` means "a degree-1 polynomial", which is just a straight line.
- It returns the **slope** (how much the price rises per extra square metre) and the **intercept** (the price where the line crosses zero).

Now the model is the line `price = slope * size + intercept`, and making a prediction is just arithmetic:

```python
prediction = slope * 100 + intercept
print(round(prediction, 1))                   # prints: 299.2
```

## Reading the result

A slope of 2.94 says: "each extra square metre adds about 2.94 thousand to the price". The prediction of 299.2 for 100 m2 is higher than any house we trained on (90 m2 was the biggest). Predicting outside the range of the training data is called **extrapolating**, and it is riskier than predicting between known points.

## The math, briefly

"Best line" has a precise meaning. For every example, the line makes an error (real price minus predicted price). `polyfit` picks the slope and intercept that make the **sum of the squared errors** as small as possible. This is called **least squares**. Squaring makes every error positive and punishes big mistakes more than small ones.

> **Watch out:**
> - Forgetting the library download: the very first run of a lesson with `import numpy` can take several seconds. Wait for it, it is a one-time cost.
> - Mixing up order: `np.polyfit(price, size, 1)` is a legal call, but it fits size from price, which is the opposite of what you want. The feature comes first, the label second.
> - Trusting a prediction far outside your data. A model only knows what its examples showed it.
> - Expecting perfect predictions. The real prices are not exactly on the line; the model gives the best compromise.

> **Your turn:** train a line with `np.polyfit(size, price, 1)`, predict the price of a 100 m2 house, and print the slope, the intercept and the prediction with 2 decimals each, as shown in the expected output.
