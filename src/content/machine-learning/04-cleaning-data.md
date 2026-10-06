---
title: Cleaning data
summary: Fix messy text, wrong types, duplicates and missing values before a model sees the data.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      import io
      import pandas as pd

      csv_text = """name,age,city,salary
       alice ,34,leeds,52000
      BOB,,York,48000
      carol,29,LEEDS,
       alice ,34,leeds,52000
      dave,unknown,Hull,51000
      erin,41,york,60000
      """
      df = pd.read_csv(io.StringIO(csv_text))

      # 1. Fix the text: strip spaces and use Title Case in the name and city columns.
      # 2. Turn age into numbers; the word "unknown" must become a missing value.
      # 3. Drop duplicate rows (they only match after step 1) and print "rows:" and the count.
      # 4. Print "missing ages:" and "missing salaries:" (how many NaN values each column has).
      # 5. Fill the missing ages and salaries with the median of their column.
      # 6. Print "cities:" and the sorted unique city names as a list,
      #    then "age sum:" and "salary sum:" (the sums of the filled columns).
check:
  output: |
    rows: 5
    missing ages: 2
    missing salaries: 1
    cities: ['Hull', 'Leeds', 'York']
    age sum: 172.0
    salary sum: 262500.0
  code:
    - { pattern: 'str\.strip\s*\(', message: "Clean the text with .str.strip()." }
    - { pattern: 'to_numeric\s*\(', message: "Convert age with pd.to_numeric(..., errors=\"coerce\")." }
    - { pattern: 'drop_duplicates\s*\(', message: "Remove duplicates with df.drop_duplicates()." }
    - { pattern: 'fillna\s*\(', message: "Fill the gaps with .fillna(...)." }
hints:
  - "Cleaning order matters: fix the text first (so \" alice \" and \"alice \" look identical), then drop duplicates, then deal with missing values."
  - "df[\"name\"] = df[\"name\"].str.strip().str.title() fixes text. pd.to_numeric(df[\"age\"], errors=\"coerce\") turns bad values into NaN. df[\"age\"].isna().sum() counts the gaps."
  - "df = df.drop_duplicates()   then   df[\"age\"] = df[\"age\"].fillna(df[\"age\"].median())   and the same for salary. Sorted cities: sorted(df[\"city\"].unique())"
solution:
  - name: main.py
    code: |
      import io
      import pandas as pd

      csv_text = """name,age,city,salary
       alice ,34,leeds,52000
      BOB,,York,48000
      carol,29,LEEDS,
       alice ,34,leeds,52000
      dave,unknown,Hull,51000
      erin,41,york,60000
      """
      df = pd.read_csv(io.StringIO(csv_text))

      df["name"] = df["name"].str.strip().str.title()
      df["city"] = df["city"].str.strip().str.title()
      df["age"] = pd.to_numeric(df["age"], errors="coerce")

      df = df.drop_duplicates()
      print("rows:", len(df))
      print("missing ages:", df["age"].isna().sum())
      print("missing salaries:", df["salary"].isna().sum())

      df["age"] = df["age"].fillna(df["age"].median())
      df["salary"] = df["salary"].fillna(df["salary"].median())

      print("cities:", sorted(df["city"].unique()))
      print("age sum:", df["age"].sum())
      print("salary sum:", df["salary"].sum())
quiz:
  - q: "How does pandas show a missing value in a numeric column?"
    options: ["NaN (not a number)", "0", "An empty string"]
    answer: 0
  - q: "What does pd.to_numeric(col, errors=\"coerce\") do with text that is not a number?"
    options: ["Raises an error", "Turns it into NaN", "Turns it into 0"]
    answer: 1
  - q: "Why is the median often a safer fill value than the mean?"
    options: ["It is always smaller", "It needs no calculation", "A few extreme values do not pull it far"]
    answer: 2
    explain: "One huge outlier can drag the mean a long way, but the median is just the middle value."
  - q: "Why should you fix the text (strip spaces, same capitalisation) before dropping duplicates?"
    options: ["It makes the table smaller", "Rows that look different but mean the same only match after the text is consistent", "drop_duplicates only works on text"]
    answer: 1
---

Real data is messy: typos, stray spaces, numbers stored as text, the same row twice, gaps where nobody filled in a value. A model fed with messy data learns the mess. Cleaning is not glamorous, but data scientists spend a large part of their time on it, and it decides how good your model can be.

## Inspect before you fix

Look first. These calls tell you what is wrong:

```python
print(df.dtypes)          # the type of each column
print(df.isna().sum())    # missing values per column
print(df.duplicated().sum())   # how many rows repeat an earlier row
```

A **dtype** is the type of a column: `int64`, `float64` (decimals), or text. If a column of numbers has even one bad entry such as `"unknown"`, pandas stores the whole column as text, and you cannot calculate with it.

## Fixing text

Text columns have a `.str` toolbox that works on every value at once:

```python
df["city"] = df["city"].str.strip().str.title()
```

`.strip()` removes spaces at both ends, `.title()` makes `leeds` and `LEEDS` both `Leeds`, and `.lower()` / `.upper()` do what they say. Chaining them is fine. Note that we assign the result back: `.str` methods return a new column and do not change the old one.

## Fixing types

`pd.to_numeric` converts text to numbers. The setting `errors="coerce"` says "if you cannot convert a value, make it missing instead of crashing":

```python
df["age"] = pd.to_numeric(df["age"], errors="coerce")   # "unknown" becomes NaN
```

`NaN` means "not a number" and is how pandas marks a missing value. Afterwards the column has the type `float64`, even if all remaining values look like whole numbers (NaN is a float).

## Duplicates

```python
df = df.drop_duplicates()
```

keeps the first copy of every identical row. Two rows only count as identical when every value matches, which is why you should clean the text first: `" alice "` and `"alice "` look different to the computer until you strip them.

## Missing values: drop or fill?

You have two simple choices:

- **Drop** rows with gaps: `df.dropna()`. Easy, but you lose data, and with a small table you may lose a lot.
- **Fill** the gaps with a sensible value: `df["age"].fillna(34)`. The usual fill values are the **median** (the middle value, not bothered by extremes) or the **mean** (the average). For text columns, the most common value works.

```python
median_age = df["age"].median()
df["age"] = df["age"].fillna(median_age)
```

Always calculate the fill value from the data you have, and write the result back into the column. (`fillna` returns a new column; it does not change the original unless you assign it.)

## How to read the output of the exercise

After cleaning text there are five distinct people left, so `rows: 5`. Two of them have no age (one empty, one "unknown") and one has no salary. After filling with medians, the sums have no gaps: you can calculate with the columns again.

## Why this matters for machine learning

Most scikit-learn models refuse NaN values outright: you get `ValueError: Input X contains NaN`. Cleaning also prevents quiet damage: duplicates make the model count the same example twice, and mixed capitalisation makes the same city look like three different cities. Later you will learn to put the fill step inside a pipeline so that it is learned from training data only.

> **Watch out:**
> - Forgetting to assign back: `df["city"].str.title()` on its own changes nothing. Write `df["city"] = ...`.
> - Using `.str` on a numeric column raises `AttributeError: Can only use .str accessor with string values`.
> - Filling with the mean of the whole table before splitting into train and test sets leaks information from the test data. You will see how to avoid this in later lessons.
> - Silently dropping all rows with gaps: check `len(df)` before and after so you know what you lost.

> **Your turn:** clean the table as described in the comments, then print the six lines shown in the expected output.
