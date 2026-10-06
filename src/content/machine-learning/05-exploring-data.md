---
title: Exploring data
summary: Summarise a table with describe, groupby, value_counts and correlation.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      import io
      import pandas as pd

      csv_text = """class,hours,sleep,score
      A,2,6,55
      A,4,7,65
      A,6,7,78
      A,8,6,88
      B,1,5,48
      B,3,8,60
      B,5,7,72
      B,7,8,85
      C,2,7,58
      C,4,6,64
      C,6,8,80
      C,9,7,95
      """
      df = pd.read_csv(io.StringIO(csv_text))

      # 1. Print "average score:" and the mean of the score column, rounded to 2 decimals.
      # 2. Print the average score of each class (a summary per group), rounded to 2 decimals.
      # 3. Print how many students slept each number of hours, in order of hours
      #    (count the values of the sleep column and sort by the index).
      # 4. Print "hours vs score:" and the correlation between the hours and
      #    score columns, rounded to 2 decimals. Do the same for "sleep vs score:".
check:
  output: |
    average score: 70.67
    class
    A    71.50
    B    66.25
    C    74.25
    Name: score, dtype: float64
    sleep
    5    1
    6    3
    7    5
    8    3
    Name: count, dtype: int64
    hours vs score: 0.99
    sleep vs score: 0.42
  code:
    - { pattern: 'groupby\s*\(', message: "Summarise per class with df.groupby(\"class\")." }
    - { pattern: 'value_counts\s*\(', message: "Count the values with .value_counts()." }
    - { pattern: '\.corr\s*\(', message: "Use .corr() to get the correlation." }
hints:
  - "Three new tools: groupby splits the table into groups and summarises each, value_counts counts how often each value appears, and corr measures how two columns move together."
  - "df.groupby(\"class\")[\"score\"].mean() gives one average per class. df[\"sleep\"].value_counts().sort_index() counts the sleep values. df[\"hours\"].corr(df[\"score\"]) is the correlation."
  - "print(df.groupby(\"class\")[\"score\"].mean().round(2))   print(df[\"sleep\"].value_counts().sort_index())   print(\"hours vs score:\", round(df[\"hours\"].corr(df[\"score\"]), 2))"
solution:
  - name: main.py
    code: |
      import io
      import pandas as pd

      csv_text = """class,hours,sleep,score
      A,2,6,55
      A,4,7,65
      A,6,7,78
      A,8,6,88
      B,1,5,48
      B,3,8,60
      B,5,7,72
      B,7,8,85
      C,2,7,58
      C,4,6,64
      C,6,8,80
      C,9,7,95
      """
      df = pd.read_csv(io.StringIO(csv_text))

      print("average score:", round(df["score"].mean(), 2))
      print(df.groupby("class")["score"].mean().round(2))
      print(df["sleep"].value_counts().sort_index())
      print("hours vs score:", round(df["hours"].corr(df["score"]), 2))
      print("sleep vs score:", round(df["sleep"].corr(df["score"]), 2))
quiz:
  - q: "What does df.groupby(\"class\")[\"score\"].mean() return?"
    options: ["One overall average", "The number of rows per class", "The average score for each class"]
    answer: 2
  - q: "A correlation of 0.99 between hours and score means"
    options: ["More study hours go with higher scores, very consistently", "Studying causes 99 percent of the score", "Hours and score are unrelated"]
    answer: 0
    explain: "Correlation only describes how two columns move together. It does not prove that one causes the other."
  - q: "A correlation close to 0 means"
    options: ["The columns are identical", "The data has missing values", "There is no straight-line relationship"]
    answer: 2
  - q: "What does value_counts() do?"
    options: ["Adds up all values", "Counts how many times each distinct value appears", "Removes duplicate rows"]
    answer: 1
---

Before you train any model you should **look at your data**. Which values are typical? Do groups differ? Which columns seem related to the label? A few one-line summaries answer these questions and often save you from building the wrong model.

## describe: the quick overview

```python
print(df["score"].describe().round(1))
```

For a numeric column `describe()` returns the count, the mean, the standard deviation (`std`, how spread out the values are), the minimum and maximum, and the quartiles (25%, 50% = the median, 75%). Called on a whole DataFrame it summarises every numeric column at once. Use it to spot impossible values, such as an age of 400 or a negative price.

## groupby: one summary per group

`groupby` splits the table by the values of a column, summarises each part and puts the results together:

```python
print(df.groupby("class")["score"].mean())
```

Read it from left to right: "group the rows by class, take the score column, average it". The result is a Series whose index is the class names. You can swap `.mean()` for `.sum()`, `.max()`, `.count()` or several at once with `.agg(["mean", "max"])`. This is the same idea as a pivot table in a spreadsheet.

## value_counts: how often does each value appear?

```python
print(df["sleep"].value_counts().sort_index())
```

`value_counts()` counts each distinct value, biggest count first. `sort_index()` then orders the result by the value itself (5, 6, 7, 8) instead of by the count. It is perfect for categories ("how many customers per city?") and for checking that a label column is balanced.

## Correlation: do two columns move together?

```python
print(df["hours"].corr(df["score"]))
```

The **correlation** is a number between -1 and +1:

- close to +1: when one column goes up, the other tends to go up as well;
- close to -1: when one goes up, the other tends to go down;
- close to 0: there is no straight-line relationship.

In the exercise, `hours vs score` is about 0.99, so study hours line up very tightly with scores. `sleep vs score` is only about 0.42, a much weaker link. A column with a strong correlation to the label is usually a useful feature.

For a whole table, `df.corr(numeric_only=True)` gives a grid of every pair, which is called a correlation matrix.

## The math, briefly

The correlation (Pearson's r) multiplies how far each value is from its column mean, averages that, and divides by the two standard deviations so the result always lands between -1 and +1. Because of that division it does not depend on the units: hours in minutes would give the same r.

## How to read the output

`groupby` printed `Name: score, dtype: float64` below the numbers: that is just the Series telling you its name and type. In `value_counts`, the left column is the value and the right column is how many times it occurred.

> **Watch out:**
> - Correlation is not causation. Ice cream sales and sunburn are correlated; ice cream does not cause sunburn, the sunny weather causes both.
> - Correlation only sees straight-line relationships. A clear curve can still give a value near 0, which is why you should also draw a chart (next lesson).
> - `df.groupby("class").mean()` on a table with text columns raises `TypeError` in recent pandas. Select the column you want first: `df.groupby("class")["score"].mean()`.
> - Never conclude from a handful of rows. 12 students is fine for learning, but real conclusions need much more data.

> **Your turn:** print the average score, the average score per class, the counts of each sleep value in order, and the two correlations, exactly as in the expected output.
