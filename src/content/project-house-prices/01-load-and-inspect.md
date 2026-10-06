---
title: "Step 1: Load and inspect the data"
summary: "Start the house price project: load the table, then look at its size, column types, first rows and summary numbers."
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd


      # ---- PROVIDED: builds the made-up housing table (prices in thousands). ----
      # ---- This part is provided, no need to change it. ----
      def make_data():
          rng = np.random.default_rng(42)
          n = 300
          area = rng.normal(95, 28, n).clip(35, 220).round(0)
          bedrooms = np.clip(np.round(area / 32 + rng.normal(0, 0.7, n)), 1, 6).astype(int)
          age = rng.integers(0, 61, n).astype(float)
          dist = rng.gamma(2.0, 3.0, n).clip(0.5, 25).round(1)
          hood = rng.choice(["Riverside", "Old Town", "Hilltop"], n, p=[0.4, 0.35, 0.25])
          bonus = pd.Series(hood).map({"Riverside": 45.0, "Old Town": 20.0, "Hilltop": 0.0}).to_numpy()
          price = (40 + 3.0 * area + 0.004 * (area - 95) ** 2 + 9 * bedrooms - 1.1 * age
                   - 18 * np.sqrt(dist) + bonus + rng.normal(0, 22, n)).round(1)
          df = pd.DataFrame({"area_m2": area, "bedrooms": bedrooms, "age_years": age,
                             "distance_to_center_km": dist, "neighbourhood": hood, "price_k": price})
          df.loc[[7, 33, 90, 150, 201, 260], "age_years"] = np.nan       # a few missing values
          df.loc[[12, 58, 175, 240], "distance_to_center_km"] = np.nan
          df.loc[17, "area_m2"] = 1450.0                                  # an absurd typo
          return pd.concat([df, df.iloc[[5, 40, 120]]], ignore_index=True)  # 3 duplicate rows
      # ---- END OF PROVIDED PART ----

      # 1. Load the data: call make_data() and store the table in a variable called df.

      # 2. Print "shape:" followed by the (rows, columns) of df, then print the dtypes of all columns.
      #    Example line: shape: (303, 6)

      # 3. Print the first 3 rows of the table.

      # 4. Make a summary table of the numbers and keep it in a variable called stats. Then print:
      #      "price mean:" the mean of price_k, rounded to 1 decimal
      #      "area max:"   the largest area_m2
      #      "age count:"  how many age_years values are present (as a whole number)
      #    Look at stats.loc["mean", "price_k"]: row label first, column label second.
check:
  output: |
    shape: (303, 6)
    area_m2                  float64
    bedrooms                   int64
    age_years                float64
    distance_to_center_km    float64
    neighbourhood                str
    price_k                  float64
    dtype: object
       area_m2  bedrooms  age_years  distance_to_center_km neighbourhood  price_k
    0    104.0         4       14.0                    9.5       Hilltop    343.2
    1     66.0         1       25.0                    7.3     Riverside    215.3
    2    116.0         4        4.0                    2.3       Hilltop    378.8
    price mean: 298.5
    area max: 1450.0
    age count: 297
  code:
    - { pattern: "=\\s*make_data\\s*\\(", message: "Load the table with df = make_data()." }
    - { pattern: "\\.shape", message: "Use df.shape to get the number of rows and columns." }
    - { pattern: "\\.dtypes", message: "Print df.dtypes to see the type of each column." }
    - { pattern: "\\.head\\s*\\(", message: "Use df.head(3) to look at the first rows." }
    - { pattern: "\\.describe\\s*\\(", message: "Use df.describe() to get summary statistics." }
hints:
  - "A DataFrame carries its own facts: how big it is (shape), what type each column is (dtypes), a peek at the top (head) and a statistics table (describe). The first three are written without parentheses except head."
  - "df = make_data() loads the table. print(\"shape:\", df.shape) prints a pair like (303, 6). stats = df.describe() gives a table whose row labels are count, mean, std, min, 25%, 50%, 75%, max."
  - "df = make_data()   print(\"shape:\", df.shape)   print(df.dtypes)   print(df.head(3))   stats = df.describe()   print(\"price mean:\", round(stats.loc[\"mean\", \"price_k\"], 1))   then stats.loc[\"max\", \"area_m2\"] and int(stats.loc[\"count\", \"age_years\"])."
solution:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd


      # ---- PROVIDED: builds the made-up housing table (prices in thousands). ----
      # ---- This part is provided, no need to change it. ----
      def make_data():
          rng = np.random.default_rng(42)
          n = 300
          area = rng.normal(95, 28, n).clip(35, 220).round(0)
          bedrooms = np.clip(np.round(area / 32 + rng.normal(0, 0.7, n)), 1, 6).astype(int)
          age = rng.integers(0, 61, n).astype(float)
          dist = rng.gamma(2.0, 3.0, n).clip(0.5, 25).round(1)
          hood = rng.choice(["Riverside", "Old Town", "Hilltop"], n, p=[0.4, 0.35, 0.25])
          bonus = pd.Series(hood).map({"Riverside": 45.0, "Old Town": 20.0, "Hilltop": 0.0}).to_numpy()
          price = (40 + 3.0 * area + 0.004 * (area - 95) ** 2 + 9 * bedrooms - 1.1 * age
                   - 18 * np.sqrt(dist) + bonus + rng.normal(0, 22, n)).round(1)
          df = pd.DataFrame({"area_m2": area, "bedrooms": bedrooms, "age_years": age,
                             "distance_to_center_km": dist, "neighbourhood": hood, "price_k": price})
          df.loc[[7, 33, 90, 150, 201, 260], "age_years"] = np.nan       # a few missing values
          df.loc[[12, 58, 175, 240], "distance_to_center_km"] = np.nan
          df.loc[17, "area_m2"] = 1450.0                                  # an absurd typo
          return pd.concat([df, df.iloc[[5, 40, 120]]], ignore_index=True)  # 3 duplicate rows
      # ---- END OF PROVIDED PART ----

      # 1. Load the data
      df = make_data()

      # 2. Size and column types
      print("shape:", df.shape)
      print(df.dtypes)

      # 3. First rows
      print(df.head(3))

      # 4. Summary statistics
      stats = df.describe()
      print("price mean:", round(stats.loc["mean", "price_k"], 1))
      print("area max:", stats.loc["max", "area_m2"])
      print("age count:", int(stats.loc["count", "age_years"]))
quiz:
  - q: "What does df.shape return for a table with 303 rows and 6 columns?"
    options: ["(303, 6)", "(6, 303)", "1818"]
    answer: 0
    explain: "Rows come first, then columns."
  - q: "In describe(), the count of age_years is 297 but the table has 303 rows. What does that tell you?"
    options: ["The column has the wrong type", "Six age values are missing", "Six houses are duplicated"]
    answer: 1
    explain: "describe() counts only values that are present, so a smaller count reveals missing values."
  - q: "Why do we inspect a dataset before building any model?"
    options: ["Models refuse to train without it", "To make the data bigger", "To find problems and understand what each column means before they spoil the results"]
    answer: 2
    explain: "A model trusts whatever you give it, including typos and gaps."
---
Welcome to a real machine learning project. Over eight steps you will build a **house price predictor**: load data, clean it, explore it, train models, compare them, test them honestly and finally use the best one. Every step continues the code of the previous one, and every step also runs on its own. This first step is about the most underrated skill in data science: **looking at your data before you touch it**.

> The first run in a session downloads numpy, pandas, matplotlib and scikit-learn, which can take a few seconds. Later runs are fast.

## Where we are

We have nothing yet except the data. To keep the project self-contained, the code at the top of the starter (`make_data()`) builds a made-up housing table of about 300 houses, the same table every time, because it uses `np.random.default_rng(42)`. That part is provided, so you do not need to change it. It also hides a few real-life problems on purpose (missing values, a typo, copies) that you will find in this step and fix in the next.

## What we will add

A program that loads the table and prints its **shape**, the **type of every column**, the **first rows** and the **summary statistics**. In a real job this is the first thing you do with any new file, because every later mistake (a wrong average, a broken model) usually starts with data you did not understand.

The columns are:

| column | meaning |
|---|---|
| `area_m2` | living area in square metres |
| `bedrooms` | number of bedrooms |
| `age_years` | age of the building |
| `distance_to_center_km` | distance to the city centre |
| `neighbourhood` | `Riverside`, `Old Town` or `Hilltop` |
| `price_k` | the sale price in thousands, the thing we want to predict (the **target** or **label**) |

The other five columns are **features**: the facts a model may use to guess the target.

## Guided walk-through

**1. Load.** `make_data()` returns a pandas `DataFrame`, a table with named columns. Store it in `df`.

```python
df = make_data()
```

**2. Size and types.** Two attributes (no parentheses!) answer "how big" and "what kind":

```python
print("shape:", df.shape)    # prints: shape: (303, 6)  -> rows first, then columns
print(df.dtypes)             # one line per column: float64, int64 or str (text)
```

Numbers show as `float64` (decimals) or `int64` (whole numbers). Text columns show as `str` (older pandas versions say `object`). A column that should be a number but shows as text is a classic warning sign.

**3. A peek.** `df.head(3)` shows the first three rows. Read them like a human: does `104.0` square metres with `4` bedrooms and a price of `343.2` (thousand) look believable?

**4. Summary statistics.** `df.describe()` returns another table: for each numeric column the `count`, `mean`, `std` (spread), `min`, the quartiles and the `max`. You can pick single cells with `.loc[row_label, column_label]`:

```python
stats = df.describe()
stats.loc["mean", "price_k"]    # the average price: row label first, column label second
```

Now read the table like a detective. Two numbers should make you suspicious: the `count` of `age_years` is smaller than the number of rows, and the `max` of `area_m2` is far above anything a normal house has. Those are exactly the problems step 2 will fix.

## How to read the output

Your program should print 15 lines: the shape, the six dtypes (plus a final `dtype: object` line), three table rows with a header, and three lines with statistics. If `age count` is smaller than the first number of the shape, values are missing.

> **Watch out:**
> - `df.shape()` fails with `TypeError: 'tuple' object is not callable`: `shape` is a value, not a method. But `df.head(3)` and `df.describe()` are methods and need the parentheses; without them Python prints something like `<bound method NDFrame.describe ...>`.
> - `stats.loc["price_k", "mean"]` (labels swapped) raises `KeyError: 'price_k'`. Rows are named by statistic, columns by feature.
> - `stats.loc["count", "age_years"]` is a float (`297.0`). Wrap it in `int(...)` to print `297`.

> **Your turn:** under the provided code, (1) load the table into `df`; (2) print `shape:` and the shape, then the dtypes; (3) print the first 3 rows; (4) create `stats = df.describe()` and print `price mean:` (rounded to 1 decimal), `area max:` and `age count:` (as a whole number).
