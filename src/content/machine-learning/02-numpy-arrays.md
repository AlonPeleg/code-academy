---
title: NumPy arrays and vectorised maths
summary: Do maths on a whole list of numbers at once, without writing a loop.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      import numpy as np

      temps_c = np.array([12.5, 18.0, 21.5, 9.0, 25.0, 30.5])
      scores = np.array([[70, 80, 90],
                         [60, 75, 85],
                         [88, 92, 96]])

      # 1. Convert every temperature to Fahrenheit (multiply by 9/5, add 32)
      #    and print it rounded to 1 decimal, with the label "fahrenheit:".
      # 2. Print the mean temperature rounded to 2 decimals, label "mean:".
      # 3. Count the days warmer than 20 degrees with a boolean mask and
      #    print it with the label "warm days:".
      # 4. Print the mean of each column of scores (one number per subject),
      #    rounded to 2 decimals, with the label "column means:".
check:
  output: |
    fahrenheit: [54.5 64.4 70.7 48.2 77.  86.9]
    mean: 19.42
    warm days: 3
    column means: [72.67 82.33 90.33]
  code:
    - { pattern: 'axis\s*=\s*0', message: "Use axis=0 to average down the columns." }
    - { pattern: '\.mean\s*\(', message: "Use the .mean() method." }
hints:
  - "NumPy applies maths to every element at once: temps_c * 9 / 5 + 32 gives a whole new array. A comparison like temps_c > 20 gives an array of True and False."
  - "True counts as 1, so (temps_c > 20).sum() counts the warm days. For the columns use scores.mean(axis=0), and round arrays with np.round(arr, 2) or arr.round(2)."
  - "fahrenheit = temps_c * 9 / 5 + 32;  warm = (temps_c > 20).sum();  print('fahrenheit:', fahrenheit.round(1));  print('column means:', scores.mean(axis=0).round(2))"
solution:
  - name: main.py
    code: |
      import numpy as np

      temps_c = np.array([12.5, 18.0, 21.5, 9.0, 25.0, 30.5])
      scores = np.array([[70, 80, 90],
                         [60, 75, 85],
                         [88, 92, 96]])

      fahrenheit = temps_c * 9 / 5 + 32
      print("fahrenheit:", fahrenheit.round(1))
      print("mean:", round(temps_c.mean(), 2))
      warm = (temps_c > 20).sum()
      print("warm days:", warm)
      print("column means:", scores.mean(axis=0).round(2))
quiz:
  - q: "What does np.array([1, 2, 3]) * 2 give?"
    options: ["[1, 2, 3, 1, 2, 3]", "array([2, 4, 6])", "An error"]
    answer: 1
    explain: "NumPy multiplies every element (vectorised maths). A plain Python list would repeat itself instead."
  - q: "An array has shape (3, 4). How many rows does it have?"
    options: ["4", "12", "3"]
    answer: 2
  - q: "What does scores.mean(axis=0) do on a 2D array?"
    options: ["Averages down each column, giving one number per column", "Averages across each row, giving one number per row", "Averages everything into one number"]
    answer: 0
  - q: "What does arr[arr > 10] return?"
    options: ["True or False", "Only the elements of arr that are bigger than 10", "The positions of the elements bigger than 10"]
    answer: 1
---

Machine learning is mostly maths on lots of numbers. Python lists are slow and clumsy for that, so almost every ML library is built on **NumPy** and its **array**. In this lesson you will learn to create arrays, calculate with them without writing loops, and pick out the values you want.

## Arrays and vectorised maths

A NumPy array holds numbers of the same kind in one block of memory:

```python
import numpy as np

heights = np.array([150, 160, 170, 180])
print(heights * 2)        # prints: [300 320 340 360]
print(heights + 10)       # prints: [160 170 180 190]
print(heights.mean())     # prints: 165.0
```

With a normal list, `[150, 160] * 2` would repeat the list. With an array, the maths is applied to **every element at once**. This is called **vectorised** maths: no `for` loop, shorter code, and much faster because the work happens in compiled code.

You can also combine two arrays of the same length element by element:

```python
a = np.array([1, 2, 3])
b = np.array([10, 20, 30])
print(a + b)              # prints: [11 22 33]
print(a * b)              # prints: [10 40 90]
```

## Shape: rows and columns

An array can have several dimensions. A list of lists becomes a 2D array, which is like a table of numbers:

```python
grid = np.array([[1, 2, 3],
                 [4, 5, 6]])
print(grid.shape)         # prints: (2, 3)   (2 rows, 3 columns)
```

`shape` is the most useful attribute in ML. Almost every error message you will meet is about shapes that do not match. In scikit-learn the features are always a 2D array with the shape `(number of rows, number of features)`.

## Summaries and axis

Arrays know how to summarise themselves: `.sum()`, `.mean()`, `.min()`, `.max()`, `.std()`. On a 2D array, `axis` chooses the direction:

```python
print(grid.sum())         # prints: 21   (everything)
print(grid.sum(axis=0))   # prints: [5 7 9]   (down the columns)
print(grid.sum(axis=1))   # prints: [ 6 15]   (across the rows)
```

An easy way to remember: `axis=0` collapses the rows, so you get one result per column.

## Picking values with a boolean mask

A comparison on an array gives an array of `True` and `False`. Used inside square brackets it keeps only the matching values:

```python
nums = np.array([4, 12, 7, 20, 15])
big = nums > 10
print(big)                # prints: [False  True False  True  True]
print(nums[big])          # prints: [12 20 15]
print((nums > 10).sum())  # prints: 3   (True counts as 1)
```

The same idea is how you will later filter the rows of a table. Combine conditions with `&` (and) and `|` (or), and put each condition in its own parentheses: `nums[(nums > 5) & (nums < 15)]`.

## Reading printed arrays

NumPy prints arrays without commas: `[300 320 340 360]`. Floats are aligned in columns, so `[54.5 64.4 77. ]` may show `77.` with a trailing dot and extra spaces. That is only formatting. To avoid long ugly decimals, use `arr.round(2)` or `np.round(arr, 2)`.

## The math, briefly

An array of numbers is a **vector**; a table of numbers is a **matrix**. The mean is the sum divided by the count, and for a column of a matrix it is computed down that column. Everything here is just that, applied to many numbers at once.

> **Watch out:**
> - Using `and` / `or` on arrays: `nums[(nums > 5) and (nums < 15)]` raises `ValueError: The truth value of an array with more than one element is ambiguous`. Use `&` and `|` with parentheses.
> - Adding arrays of different lengths: `[1, 2, 3] + [1, 2]` as arrays gives `ValueError: operands could not be broadcast together with shapes (3,) (2,)`.
> - Forgetting that a list is not an array: `[1, 2, 3] * 2` repeats the list. Wrap it in `np.array(...)` first.
> - Mixing up `axis=0` and `axis=1`. When in doubt, print the result and look at its shape.

> **Your turn:** convert the temperatures to Fahrenheit, compute their mean, count the days warmer than 20 degrees with a boolean mask, and compute the mean of each column of `scores`. Print the four lines as shown in the expected output.
