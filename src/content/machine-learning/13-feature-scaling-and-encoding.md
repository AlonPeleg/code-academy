---
title: Preparing features - scaling and encoding
summary: Put numbers on a common scale with StandardScaler and turn text categories into 0/1 columns with get_dummies.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import io
      import numpy as np
      import pandas as pd
      from sklearn.preprocessing import StandardScaler

      csv = """size,age,city,price
      50,30,Leeds,150
      65,10,Leeds,210
      80,5,Bath,330
      120,20,Bath,420
      45,40,York,120
      90,15,York,240
      70,25,Bath,300
      100,8,Leeds,310
      """
      df = pd.read_csv(io.StringIO(csv))

      # 1. Create a scaler, fit it on the two number columns ["size", "age"]
      #    and transform them in one go. Call the result `scaled`.
      #    Print the learned means rounded to 1 decimal  (scaler.mean_)
      #    and the standard deviation of each scaled column rounded to 2 decimals.

      # 2. Turn the "city" column into 0/1 columns (use dtype=int).
      #    Call the result `dummies` and print the list of its column names.

      # 3. Glue them side by side with np.hstack([scaled, dummies.to_numpy()]).
      #    Call it `features`, print features.shape and the first row rounded to 2 decimals.

      # 4. Scale ONE new house (size 100, age 10) with the SAME scaler (do not refit!)
      #    and print the result rounded to 2 decimals.
check:
  output: |
    [77.5 19.1]
    [1. 1.]
    ['Bath', 'Leeds', 'York']
    (8, 5)
    [-1.16  0.97  0.    1.    0.  ]
    [[ 0.95 -0.81]]
  code:
    - { pattern: 'StandardScaler\s*\(', message: "Create a StandardScaler()." }
    - { pattern: 'fit_transform', message: "Use scaler.fit_transform(...) on the training numbers." }
    - { pattern: 'get_dummies', message: "Use pd.get_dummies on the city column." }
    - { pattern: '\.transform\s*\(', message: "Scale the new house with scaler.transform(...), not fit_transform." }
hints:
  - "A scaler learns from data with fit, then changes data with transform. fit_transform does both. For the new house you only want transform, so it reuses the old means."
  - "scaler = StandardScaler(); scaled = scaler.fit_transform(df[['size', 'age']]). Then dummies = pd.get_dummies(df['city'], dtype=int). The new house needs a 2D input: [[100, 10]]."
  - "scaled = scaler.fit_transform(df[['size','age']])   dummies = pd.get_dummies(df['city'], dtype=int)   features = np.hstack([scaled, dummies.to_numpy()])   new = scaler.transform(pd.DataFrame([[100, 10]], columns=['size','age']))"
solution:
  - name: main.py
    code: |
      import io
      import numpy as np
      import pandas as pd
      from sklearn.preprocessing import StandardScaler

      csv = """size,age,city,price
      50,30,Leeds,150
      65,10,Leeds,210
      80,5,Bath,330
      120,20,Bath,420
      45,40,York,120
      90,15,York,240
      70,25,Bath,300
      100,8,Leeds,310
      """
      df = pd.read_csv(io.StringIO(csv))

      scaler = StandardScaler()
      scaled = scaler.fit_transform(df[["size", "age"]])
      print(scaler.mean_.round(1))
      print(scaled.std(axis=0).round(2))

      dummies = pd.get_dummies(df["city"], dtype=int)
      print(list(dummies.columns))

      features = np.hstack([scaled, dummies.to_numpy()])
      print(features.shape)
      print(features[0].round(2))

      new = scaler.transform(pd.DataFrame([[100, 10]], columns=["size", "age"]))
      print(new.round(2))
quiz:
  - q: "After StandardScaler, what are the mean and standard deviation of each column?"
    options: ["Mean 0 and standard deviation 1", "Mean 1 and standard deviation 0", "Minimum 0 and maximum 1"]
    answer: 0
    explain: "Each value becomes (value - mean) / std, so the column is centred on 0 and has spread 1. Squashing into 0 to 1 is a different tool, MinMaxScaler."
  - q: "Why is a column like city (Leeds, Bath, York) not simply replaced by 1, 2, 3?"
    options: ["Python cannot store numbers that small", "Models would think York is 'bigger' than Bath, an order that does not exist", "Because 3 is an unlucky number"]
    answer: 1
    explain: "One-hot columns (one 0/1 column per city) avoid inventing a fake ranking between categories."
  - q: "You have fitted a scaler on your training data. For new data you should call"
    options: ["scaler.fit_transform(new) so it learns the new means", "scaler.transform(new) so it reuses the training means", "Neither, new data never needs scaling"]
    answer: 1
    explain: "New data must be changed with exactly the same rule the model was trained with."
  - q: "What does a one-hot encoder do with a category it has never seen, when handle_unknown='ignore'?"
    options: ["It crashes", "It deletes the row", "It gives a row of all zeros"]
    answer: 2
---

Real tables are messy: one column is a size in square metres (50 to 120), another is an age in years (5 to 40), and a third is a word such as "Leeds". Most models can only do arithmetic on numbers, and many of them are thrown off when numbers live on very different scales. In this lesson you prepare features so models can use them properly. A **feature** is one input column the model looks at.

## Why scale numbers?

Imagine a model that measures "how far apart" two houses are, like k-nearest neighbours does. A difference of 40 square metres and a difference of 20 years are completely different things, but to the arithmetic they are just 40 and 20. The column with the bigger numbers wins the argument. Scaling gives every column a fair voice.

The most common fix is **standardisation**:

```text
z = (value - mean) / standard deviation
```

The **mean** is the average and the **standard deviation** (std) says how spread out the values are. Worked example with our sizes, whose mean is 77.5 and std is 23.72: a 50 m2 house gets `(50 - 77.5) / 23.72 = -1.16`. Read it as "1.16 standard deviations below average". After the change every column has mean 0 and std 1, so a value of 2 always means "unusually large" no matter what the original unit was.

```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
scaled = scaler.fit_transform(df[["size", "age"]])
```

* `fit` is the learning step: the scaler measures the mean and std of each column and remembers them (`scaler.mean_`, `scaler.scale_`).
* `transform` is the applying step: it uses the remembered numbers to rewrite the data.
* `fit_transform` does both in one call.

Notice the double brackets: `df[["size", "age"]]` is a small table (2D), which is what scikit-learn expects.

## The golden rule: fit on training data only

When you later predict for new houses, you must change them with the **same** means and stds the model saw during training. So you call `scaler.transform(new_data)` and never `fit` again on test or new data. If the scaler peeks at the test rows while learning its means, information from the test set leaks into your preparation and your final score becomes too optimistic. Lesson 17 shows how pipelines enforce this rule for you.

## Encoding categories

A column of words has to become numbers, but not by numbering them. If Leeds = 1, Bath = 2 and York = 3, a model could conclude that York is "three times Leeds" or that Bath sits between the others. **One-hot encoding** gives each category its own column of 0 and 1:

```python
dummies = pd.get_dummies(df["city"], dtype=int)
print(dummies.head(3))
#    Bath  Leeds  York
# 0     0      1     0
# 1     0      1     0
# 2     1      0     0
```

Each row has exactly one 1: the city it belongs to. Columns appear in alphabetical order. Always pass `dtype=int`, because recent pandas versions otherwise return `True`/`False` columns.

`get_dummies` is quick for exploration. For real projects scikit-learn offers `OneHotEncoder(handle_unknown="ignore")`. It remembers the categories it saw while fitting, so a new city such as "Paris" becomes a row of zeros instead of crashing or producing mismatched columns. It follows the same `fit` / `transform` pattern as the scaler.

## How to read the output

* `scaler.mean_` shows the averages it learned: about 77.5 for size and 19.1 for age.
* The std of the scaled columns is `1.0` (by construction), which is your quick sanity check that scaling worked.
* The `features.shape` of `(8, 5)` means 8 houses and 5 columns: 2 scaled numbers plus 3 city columns.
* A scaled value close to 0 is an average house, a negative value is below average.

> **Watch out:**
> - Passing a single bracket `df["size"]` to `fit_transform` raises `ValueError: Expected 2D array, got 1D array instead`. Use `df[["size"]]`.
> - Calling `fit_transform` on the test data. It runs without error, but it leaks information and gives different scaling than training.
> - Scaling the target column (the price you want to predict) by accident. Scale features, not labels.
> - Forgetting that one-hot encoding on train and test separately can produce different columns. Use one fitted encoder for both.
> - Tree-based models (lesson 14 and 15) do not need scaling, while distance and gradient based models do.

> **Your turn:** scale the size and age columns with a `StandardScaler`, one-hot encode the city column, glue them into a feature table, and scale one new house with the already fitted scaler. Follow the numbered comments and print what they ask for.
