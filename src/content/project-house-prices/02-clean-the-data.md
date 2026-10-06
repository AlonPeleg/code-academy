---
title: "Step 2: Clean the data"
summary: "Find and fix missing values, an absurd outlier and duplicate rows so the model learns from trustworthy data."
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

      df = make_data()

      # 1. Spot the problems. Print:
      #      "missing cells:" the TOTAL number of missing values in the whole table (as a whole number)
      #      the number of missing values in each column (isna, then sum)
      #      "duplicate rows:" how many rows are exact copies of an earlier row
      #      "areas above 400:" how many houses have an area_m2 larger than 400 (an obvious typo)

      # 2. Fix them, in this order:
      #      a) drop the duplicate rows
      #      b) keep only the rows with area_m2 <= 400
      #      c) fill the missing values of age_years and distance_to_center_km with that column's median
      #      d) reset the index so rows are numbered 0, 1, 2, ... again (drop=True)

      # 3. Check the result. Print:
      #      "shape after:", "missing after:" (total, whole number), "area max after:", "age median:"
check:
  output: |
    missing cells: 10
    area_m2                  0
    bedrooms                 0
    age_years                6
    distance_to_center_km    4
    neighbourhood            0
    price_k                  0
    dtype: int64
    duplicate rows: 3
    areas above 400: 1
    shape after: (299, 6)
    missing after: 0
    area max after: 177.0
    age median: 27.0
  code:
    - { pattern: "\\.isna\\s*\\(\\s*\\)|\\.isnull\\s*\\(\\s*\\)", message: "Count missing values with df.isna().sum()." }
    - { pattern: "\\.duplicated\\s*\\(", message: "Count duplicates with df.duplicated().sum()." }
    - { pattern: "\\.drop_duplicates\\s*\\(", message: "Remove duplicates with df.drop_duplicates()." }
    - { pattern: "\\.fillna\\s*\\(", message: "Fill the gaps with fillna()." }
    - { pattern: "\\.median\\s*\\(", message: "Use the median as the replacement value." }
    - { pattern: "\\.reset_index\\s*\\(", message: "Number the rows again with reset_index(drop=True)." }
hints:
  - "Four small jobs in order: count the problems, drop exact copies, drop the impossible house, fill the gaps. A column's median is the middle value, which a single extreme value cannot drag around."
  - "df.isna().sum() counts the missing values per column, and one more .sum() gives the total. df.duplicated().sum() counts copies. Filter with df = df[df[\"area_m2\"] <= 400]. Fill with df[col] = df[col].fillna(df[col].median()) inside a for loop over the two column names."
  - "df = df.drop_duplicates()   df = df[df[\"area_m2\"] <= 400]   for col in [\"age_years\", \"distance_to_center_km\"]:   df[col] = df[col].fillna(df[col].median())   df = df.reset_index(drop=True)   (print int(df.isna().sum().sum()) for the totals)."
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

      df = make_data()

      # 1. Spot the problems
      print("missing cells:", int(df.isna().sum().sum()))
      print(df.isna().sum())
      print("duplicate rows:", df.duplicated().sum())
      print("areas above 400:", (df["area_m2"] > 400).sum())

      # 2. Fix them: duplicates first, then the outlier, then fill the gaps
      df = df.drop_duplicates()
      df = df[df["area_m2"] <= 400]
      for col in ["age_years", "distance_to_center_km"]:
          df[col] = df[col].fillna(df[col].median())
      df = df.reset_index(drop=True)

      # 3. Check the result
      print("shape after:", df.shape)
      print("missing after:", int(df.isna().sum().sum()))
      print("area max after:", df["area_m2"].max())
      print("age median:", df["age_years"].median())
quiz:
  - q: "Why fill missing ages with the median instead of the mean?"
    options: ["The median is always more accurate", "pandas cannot compute a mean", "The median is not pulled around by extreme values"]
    answer: 2
    explain: "One strange value can drag a mean far away, while the median stays in the middle."
  - q: "A house has area_m2 = 1450 while every other house is under 200. What is the most sensible move here?"
    options: ["Keep it, the model will sort it out", "Check whether it is a typo, and drop it if it cannot be repaired", "Replace every area with 1450"]
    answer: 1
    explain: "Extreme values pull a straight-line model strongly towards them, so they need a decision, not silence."
  - q: "What does df = df.reset_index(drop=True) do after we removed rows?"
    options: ["Renumbers the rows 0, 1, 2, ... and throws away the old numbers", "Deletes the first row", "Sorts the rows by price"]
    answer: 0
---
Real data is messy: values are missing, someone typed an extra zero, a row was pasted twice. If you feed that straight into a model, the model faithfully learns the mess. This step turns the raw table into a clean one.

## Where we are

Step 1 loads the table with `df = make_data()`. Its summary showed two warning signs: `age_years` has fewer values than there are rows, and the largest `area_m2` is 1450. Note that from now on we drop the printing of the previous step: the starter keeps only the code that changes the data, so the output stays short.

## What we will add

A cleaning block that finds three kinds of problems and fixes each one:

* **Missing values** (`NaN`, "not a number"): the cell is simply empty. Most models crash on them.
* **An outlier**: a value so extreme it is almost certainly an error. A model that tries hard to fit it gets distorted.
* **Duplicates**: the same row twice. They count that house double and, later, can leak between training and test data.

Every cleaning decision is a judgement call, so we always **print before and after** to see what we did.

## Guided walk-through

**1. Count the missing values.** `isna()` makes a table of True/False ("is this cell missing?"). `sum()` adds the Trues up, per column:

```python
print(df.isna().sum())               # one count per column
print(int(df.isna().sum().sum()))    # the grand total: second sum() adds the column totals
```

**2. Duplicates and outliers.** `df.duplicated()` marks every row that repeats an earlier row. For the outlier, use a comparison to make True/False and count the Trues:

```python
print(df.duplicated().sum())
print((df["area_m2"] > 400).sum())
```

Why 400? The describe table showed typical areas of 35 to 200, so 400 is generous and 1450 is clearly a typo (probably 145). We cannot know the real value, so we drop that row rather than guess.

**3. Fix them.** The order matters a little: copies first, then the outlier, then the gaps (the median should be computed from the rows we keep).

```python
df = df.drop_duplicates()
df = df[df["area_m2"] <= 400]      # a filter: keep only the rows where the test is True
```

Missing values can be dropped (`dropna()`) or **filled** (imputed). Dropping would waste whole rows for one missing age, so we fill with the **median**, the middle value. A loop avoids repeating yourself:

```python
for col in ["age_years", "distance_to_center_km"]:
    df[col] = df[col].fillna(df[col].median())
```

Finally `df = df.reset_index(drop=True)` renumbers the rows 0, 1, 2, ... because the dropped rows left holes in the row labels.

**4. Check.** Print the new shape (it should be 4 rows fewer than before), the missing total (0) and the new largest area.

> **Watch out:**
> - `df["age_years"].fillna(...)` on its own changes nothing: pandas returns a new column. Always assign it back with `df[col] = ...`.
> - Do not write `df[col].fillna(x, inplace=True)`. In current pandas this chained form does not change `df` and warns (`ChainedAssignmentError`).
> - `df.isna().sum()` ends with a `dtype: int64` footer line when printed; that is normal.
> - Filling with the median of the whole table slightly "peeks" at rows that will later be in the test set. That is a small, common shortcut in a first project. In production you would put a `SimpleImputer` inside the pipeline (step 5 shows the idea of pipelines).

> **Your turn:** print `missing cells:` (the total as a whole number), the missing count per column, `duplicate rows:` and `areas above 400:`. Then drop the duplicates, drop the rows with area above 400, fill the two gaps with medians and reset the index. Finally print `shape after:`, `missing after:`, `area max after:` and `age median:`.
