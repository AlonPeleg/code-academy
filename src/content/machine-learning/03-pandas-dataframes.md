---
title: "pandas: tables of data"
summary: Load a table into a DataFrame, pick columns, filter rows and add new columns.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      import io
      import pandas as pd

      csv_text = """city,size,rooms,price
      Leeds,50,2,155
      Leeds,60,2,178
      York,70,3,212
      York,80,3,238
      Leeds,90,4,272
      Hull,65,2,170
      Hull,100,4,301
      York,55,1,160
      """

      # 1. Read csv_text into a DataFrame called df (wrap it in io.StringIO).
      # 2. Print "shape:" followed by df.shape.
      # 3. Print "mean price:" followed by the mean of the price column, rounded to 2 decimals.
      # 4. Keep only the houses with 3 or more rooms in a variable called big,
      #    then print "big houses:" followed by how many there are (len).
      # 5. Add a new column to df called price_per_m2 (price divided by size)
      #    and print "max price per m2:" followed by its maximum, rounded to 2 decimals.
check:
  output: |
    shape: (8, 4)
    mean price: 210.75
    big houses: 4
    max price per m2: 3.1
  code:
    - { pattern: 'read_csv\s*\(', message: "Read the text with pd.read_csv(io.StringIO(csv_text))." }
    - { pattern: '\[\s*["'']price_per_m2["'']\s*\]\s*=', message: "Create the new column with df[\"price_per_m2\"] = ..." }
hints:
  - "pd.read_csv reads CSV from a file, and io.StringIO makes text behave like a file. A column is picked with df[\"price\"], and a comparison on a column gives True/False for each row."
  - "Filter with df[df[\"rooms\"] >= 3] (the inner part is a True/False mask). A new column is created by assigning to it: df[\"price_per_m2\"] = df[\"price\"] / df[\"size\"]."
  - "df = pd.read_csv(io.StringIO(csv_text))   big = df[df[\"rooms\"] >= 3]   df[\"price_per_m2\"] = df[\"price\"] / df[\"size\"]   then print(\"max price per m2:\", round(df[\"price_per_m2\"].max(), 2))"
solution:
  - name: main.py
    code: |
      import io
      import pandas as pd

      csv_text = """city,size,rooms,price
      Leeds,50,2,155
      Leeds,60,2,178
      York,70,3,212
      York,80,3,238
      Leeds,90,4,272
      Hull,65,2,170
      Hull,100,4,301
      York,55,1,160
      """

      df = pd.read_csv(io.StringIO(csv_text))
      print("shape:", df.shape)
      print("mean price:", round(df["price"].mean(), 2))

      big = df[df["rooms"] >= 3]
      print("big houses:", len(big))

      df["price_per_m2"] = df["price"] / df["size"]
      print("max price per m2:", round(df["price_per_m2"].max(), 2))
quiz:
  - q: "What is a DataFrame?"
    options: ["A picture of data", "A table of rows and columns with named columns", "A single list of numbers"]
    answer: 1
  - q: "What does df[\"price\"] return?"
    options: ["The price column (a Series)", "The first row", "The number of rows"]
    answer: 0
  - q: "What does df[df[\"rooms\"] >= 3] do?"
    options: ["Deletes the rooms column", "Adds 3 to every room count", "Keeps only the rows where rooms is 3 or more"]
    answer: 2
  - q: "How do you add a new column called total to df?"
    options: ["df.add(\"total\")", "df[\"total\"] = df[\"a\"] + df[\"b\"]", "df.total()"]
    answer: 1
---

Real data almost never comes as a neat list of numbers. It comes as a **table**: rows of records and columns of facts, like a spreadsheet. The library **pandas** gives Python a table type called the **DataFrame**, and it is the tool you will use to look at and prepare data before any model sees it.

## Making a DataFrame from CSV text

CSV (comma separated values) is the most common plain-text table format: the first line holds the column names, each following line is one row. In these lessons the data lives inside the code as text, so there is nothing to download:

```python
import io
import pandas as pd

csv_text = """name,age,city
Ada,36,Leeds
Bo,29,York
Cy,41,Leeds
"""
df = pd.read_csv(io.StringIO(csv_text))
print(df)
```

`io.StringIO(text)` makes a string behave like an open file, which is what `pd.read_csv` expects. By convention the DataFrame is named `df`. The printout looks like this:

```
  name  age   city
0  Ada   36  Leeds
1   Bo   29   York
2   Cy   41  Leeds
```

The numbers on the left (0, 1, 2) are the **index**, the label of each row.

## Looking at the table

```python
print(df.shape)       # prints: (3, 3)   3 rows, 3 columns
print(df.columns)     # the column names
print(df.head(2))     # the first 2 rows (tail shows the last ones)
```

`shape` is `(rows, columns)`, just like a NumPy array. A DataFrame is built on NumPy, so many ideas carry over.

## Selecting columns

One column in square brackets gives a **Series**, a labelled list of values. A list of names gives a smaller DataFrame:

```python
ages = df["age"]              # a Series
print(ages.mean())            # prints: 35.333333333333336
print(df[["name", "age"]])    # a DataFrame with two columns
```

Note the double brackets for several columns: the inner brackets are a normal Python list.

## Filtering rows

A comparison on a column gives a True/False value for every row. Put it in brackets after `df` to keep only the matching rows:

```python
adults_over_30 = df[df["age"] > 30]
print(len(adults_over_30))    # prints: 2
print(df[df["city"] == "Leeds"])
```

Read `df[df["age"] > 30]` as "the rows of df where the age is greater than 30". To combine conditions use `&` and `|`, each condition in its own parentheses: `df[(df["age"] > 30) & (df["city"] == "Leeds")]`.

## Making new columns

Assigning to a column name that does not exist yet creates it. The maths works on the whole column at once, exactly like NumPy:

```python
df["age_in_months"] = df["age"] * 12
```

Creating new columns from old ones is called **feature engineering**, and it is one of the most powerful things you can do for a model. For example, "price per square metre" can say more than price and size separately.

## Why this matters for machine learning

Every scikit-learn model wants a table of **features** (the columns it learns from) and one **label** column. pandas is how you build that table, select the right columns and keep only the rows you need.

> **Watch out:**
> - Using `and` / `or` in a filter: `df[df["age"] > 30 and df["city"] == "Leeds"]` raises `ValueError: The truth value of a Series is ambiguous`. Use `&` / `|` with parentheses.
> - Writing `df["price"]` with a wrong name raises `KeyError: 'price'`. Print `df.columns` to see the real names (watch out for extra spaces and capital letters).
> - Forgetting that filtering does not change `df`. `df[df["age"] > 30]` returns a new table; keep it with `adults = df[...]`.
> - Single brackets for several columns: `df["name", "age"]` is a `KeyError`. Use `df[["name", "age"]]`.

> **Your turn:** read the house data into `df`, print its shape and the mean price, keep the houses with 3 or more rooms in `big` and print how many there are, then add a `price_per_m2` column and print its maximum. Round the decimals as shown in the expected output.
