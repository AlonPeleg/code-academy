---
title: "Step 3: Explore the data"
summary: "Use correlations, a groupby and a scatter plot to see which features drive the price, before choosing a model."
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt


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

      # --- cleaning (step 2) ---
      df = df.drop_duplicates()
      df = df[df["area_m2"] <= 400]
      for col in ["age_years", "distance_to_center_km"]:
          df[col] = df[col].fillna(df[col].median())
      df = df.reset_index(drop=True)

      # 1. Correlations. Build a table called numeric with every column except neighbourhood
      #    (text columns have no correlation). Then take the correlation of every column with price_k,
      #    drop price_k's correlation with itself, round to 2 decimals, call it corr.
      #    Print corr sorted from the highest to the lowest value, then print "strongest:"
      #    followed by the NAME of the feature with the largest absolute correlation.

      # 2. Group the houses by neighbourhood and compute, for price_k, the count and the mean.
      #    Round to 1 decimal, call it by_hood, and print it.
      #    Then print "most expensive:" and the name of the neighbourhood with the highest mean.

      # 3. Draw a scatter plot of area_m2 (x) against price_k (y), one colour per neighbourhood
      #    (one scatter call per group, with a label), add axis labels and a legend, then show it.
check:
  output: |
    area_m2                  0.91
    bedrooms                 0.69
    age_years               -0.11
    distance_to_center_km   -0.22
    Name: price_k, dtype: float64
    strongest: area_m2
                   count   mean
    neighbourhood
    Hilltop           87  274.7
    Old Town          95  301.7
    Riverside        117  314.4
    most expensive: Riverside
  code:
    - { pattern: "\\.corr\\s*\\(", message: "Compute correlations with .corr()." }
    - { pattern: "\\.groupby\\s*\\(", message: "Group the houses with groupby(\"neighbourhood\")." }
    - { pattern: "plt\\.scatter\\s*\\(", message: "Draw the dots with plt.scatter(...)." }
    - { pattern: "plt\\.legend\\s*\\(", message: "Add a legend with plt.legend()." }
    - { pattern: "plt\\.show\\s*\\(", message: "Display the figure with plt.show()." }
hints:
  - "Exploration has three tools here: a correlation number per feature, a groupby comparison per category, and a picture. First leave the text column out, because correlation only works on numbers."
  - "numeric = df.drop(columns=\"neighbourhood\"); corr = numeric.corr()[\"price_k\"].drop(\"price_k\").round(2). Then df.groupby(\"neighbourhood\")[\"price_k\"].agg([\"count\", \"mean\"]). For the plot, loop: for name, group in df.groupby(\"neighbourhood\"): plt.scatter(...)."
  - "print(corr.sort_values(ascending=False))   print(\"strongest:\", corr.abs().idxmax())   by_hood = df.groupby(\"neighbourhood\")[\"price_k\"].agg([\"count\", \"mean\"]).round(1)   print(\"most expensive:\", by_hood[\"mean\"].idxmax())   plt.scatter(group[\"area_m2\"], group[\"price_k\"], label=name)   then plt.legend() and plt.show()."
solution:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt


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

      # --- cleaning (step 2) ---
      df = df.drop_duplicates()
      df = df[df["area_m2"] <= 400]
      for col in ["age_years", "distance_to_center_km"]:
          df[col] = df[col].fillna(df[col].median())
      df = df.reset_index(drop=True)

      # 1. Which numbers move together with the price?
      numeric = df.drop(columns="neighbourhood")
      corr = numeric.corr()["price_k"].drop("price_k").round(2)
      print(corr.sort_values(ascending=False))
      print("strongest:", corr.abs().idxmax())

      # 2. Compare the neighbourhoods
      by_hood = df.groupby("neighbourhood")["price_k"].agg(["count", "mean"]).round(1)
      print(by_hood)
      print("most expensive:", by_hood["mean"].idxmax())

      # 3. One colour per neighbourhood in a scatter plot
      for name, group in df.groupby("neighbourhood"):
          plt.scatter(group["area_m2"], group["price_k"], label=name, alpha=0.7)
      plt.xlabel("area (m2)")
      plt.ylabel("price (thousands)")
      plt.title("Price against area")
      plt.legend()
      plt.show()
quiz:
  - q: "A correlation of 0.91 between area_m2 and price_k means:"
    options: ["Area causes 91 percent of the price", "Bigger houses tend to be more expensive, and the link is strong", "The data is 91 percent clean"]
    answer: 1
    explain: "Correlation measures how closely two columns move together, from -1 to 1. It does not prove a cause."
  - q: "Why do we drop the neighbourhood column before calling .corr()?"
    options: ["Correlation needs numbers, and the column is text", "It has no effect on prices", "It is the target"]
    answer: 0
  - q: "What does df.groupby(\"neighbourhood\")[\"price_k\"].mean() give you?"
    options: ["The overall average price", "The price column sorted by neighbourhood", "The average price inside each neighbourhood"]
    answer: 2
---
Before training anything, a good data scientist asks: what is in this data, and which columns will likely help? This step is **exploratory data analysis** (EDA). It costs minutes and saves you from training models on a wrong idea.

## Where we are

After step 2 the table is clean: no gaps, no duplicates, no absurd area. The starter keeps the cleaning code and drops its printing. Nothing has been learned from the data yet; we only fixed it.

## What we will add

Three views of the data:

1. **Correlations**: one number per feature saying how strongly it moves with the price.
2. **A group comparison**: the average price per neighbourhood.
3. **A scatter plot**: area against price, coloured by neighbourhood.

In a real project this tells you which features to keep, what shape the relationships have (straight line or curve), and whether a feature like the neighbourhood really matters.

## Guided walk-through

**1. Correlations.** The correlation coefficient runs from -1 to +1. Close to +1 means "when one grows, the other grows"; close to -1 means "when one grows, the other shrinks"; near 0 means no straight-line link. It works only on numbers, so leave the text column out first:

```python
numeric = df.drop(columns="neighbourhood")
corr = numeric.corr()["price_k"]          # the price_k column of the correlation table
corr = corr.drop("price_k").round(2)      # price against itself is always 1.0, remove it
print(corr.sort_values(ascending=False))
```

Read the result: `area_m2` has about 0.91 (strong), `bedrooms` about 0.69, and `distance_to_center_km` about -0.22 (further away is slightly cheaper). To print the name of the feature with the strongest link in either direction use the absolute values: `corr.abs().idxmax()` returns the **label** (`idxmax` = index of the maximum).

**2. Compare groups.** `groupby` splits the rows into groups, then `agg` computes several summaries per group:

```python
by_hood = df.groupby("neighbourhood")["price_k"].agg(["count", "mean"]).round(1)
print(by_hood)
```

The result has one row per neighbourhood. Notice that the average differs by tens of thousands. But careful: is Riverside expensive because of the location, or because its houses are bigger? A model that sees both columns can separate the two effects, and that is the reason to keep more than one feature.

**3. A picture.** Numbers hide shapes. A scatter plot draws one dot per house. To get one colour per neighbourhood, loop over the groups and give every `scatter` call a `label`:

```python
for name, group in df.groupby("neighbourhood"):
    plt.scatter(group["area_m2"], group["price_k"], label=name, alpha=0.7)
plt.xlabel("area (m2)")
plt.legend()
plt.show()
```

When you iterate over a `groupby`, each turn gives you a pair: the group name and the small table for that group. In the picture you should see a rising band of dots (price grows with area) and the three colours sitting slightly above one another (the neighbourhood effect). The band looks like a straight line, which is good news for the next step.

> **Watch out:**
> - `df.corr()` on a table that still has text columns raises `ValueError: could not convert string to float: 'Hilltop'`. Select the numeric columns first.
> - A correlation measures only straight-line links. A value near 0 does not prove "no relationship", a curve can hide there. This is why we also draw the picture.
> - Correlation is not causation: bigger houses cost more, but a high correlation between two columns alone never proves one causes the other.
> - Forgetting `plt.show()` means no picture appears. Call it once, after all `scatter` calls.

> **Your turn:** (1) build `numeric` without the neighbourhood column, compute `corr` for `price_k` (without itself, rounded to 2), print it sorted from high to low and then `strongest:` and the feature name; (2) group by neighbourhood, build `by_hood` (count and mean of the price, 1 decimal), print it and `most expensive:` with the neighbourhood name; (3) draw the coloured scatter plot with axis labels and a legend and show it.
