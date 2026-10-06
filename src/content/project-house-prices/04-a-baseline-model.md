---
title: "Step 4: A baseline model"
summary: "Split the data into train and test, measure a know-nothing baseline, then beat it with a first linear regression on area."
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt
      from sklearn.linear_model import LinearRegression
      from sklearn.metrics import mean_absolute_error
      from sklearn.model_selection import train_test_split

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

      # 1. Split. y is the price_k column, X is the table WITHOUT price_k (drop that column).
      #    Use train_test_split with test_size 0.2 and a random_state of 42, which returns four things in this order:
      #    X_train, X_test, y_train, y_test. Print "train rows:" and "test rows:" (the number of rows in
      #    each part, on ONE line).

      # 2. Baseline. Keep only the area_m2 column of the train and test tables (still as a TABLE,
      #    so use double brackets): train_rows and test_rows.
      #    Predict the MEAN of y_train for every test house (np.full(len(y_test), value) builds
      #    that list), measure it with mean_absolute_error and print "baseline MAE:" rounded to 1.

      # 3. Linear model. Create LinearRegression, fit it on train_rows and y_train, predict test_rows,
      #    store the error in model_mae and print:
      #      "linear MAE:" (1 decimal), "beats baseline:" (True/False), and
      #      "price per extra m2:" the learned coefficient (model.coef_[0]) rounded to 1 decimal.

      # 4. Plot the real test prices as dots and the model's line in red, then show the figure.
check:
  output: |
    train rows: 239 test rows: 60
    baseline MAE: 66.0
    linear MAE: 33.7
    beats baseline: True
    price per extra m2: 3.3
  code:
    - { pattern: "train_test_split\\s*\\(", message: "Split the data with train_test_split(...)." }
    - { pattern: "random_state\\s*=\\s*42", message: "Pass random_state=42 so the split is repeatable." }
    - { pattern: "mean_absolute_error\\s*\\(", message: "Measure errors with mean_absolute_error(y_true, y_pred)." }
    - { pattern: "LinearRegression\\s*\\(", message: "Create the model with LinearRegression()." }
    - { pattern: "\\.fit\\s*\\(", message: "Train it with model.fit(train_rows, y_train)." }
    - { pattern: "plt\\.show\\s*\\(", message: "Show the figure with plt.show()." }
hints:
  - "Two models to compare: one that always answers with the average training price (the baseline), and a straight line on the area. Both are scored on the SAME hidden test houses with the mean absolute error, the average size of the miss in thousands."
  - "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42). Features must stay a table: train_rows = X_train[[\"area_m2\"]]. The baseline prediction is np.full(len(y_test), y_train.mean())."
  - "baseline_mae = mean_absolute_error(y_test, np.full(len(y_test), y_train.mean()))   model = LinearRegression()   model.fit(train_rows, y_train)   pred = model.predict(test_rows)   model_mae = mean_absolute_error(y_test, pred)   print(\"beats baseline:\", model_mae < baseline_mae)   round(model.coef_[0], 1) is the price per extra m2."
solution:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt
      from sklearn.linear_model import LinearRegression
      from sklearn.metrics import mean_absolute_error
      from sklearn.model_selection import train_test_split

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

      # 1. Split the houses: 80 percent to learn from, 20 percent kept hidden for testing
      y = df["price_k"]
      X = df.drop(columns="price_k")
      X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
      print("train rows:", len(X_train), "test rows:", len(X_test))

      # 2. How far off is the laziest model? Always guess the average training price.
      train_rows = X_train[["area_m2"]]
      test_rows = X_test[["area_m2"]]
      baseline_pred = np.full(len(y_test), y_train.mean())
      baseline_mae = mean_absolute_error(y_test, baseline_pred)
      print("baseline MAE:", round(baseline_mae, 1))

      # 3. A straight line through price against area
      model = LinearRegression()
      model.fit(train_rows, y_train)
      pred = model.predict(test_rows)
      model_mae = mean_absolute_error(y_test, pred)
      print("linear MAE:", round(model_mae, 1))
      print("beats baseline:", model_mae < baseline_mae)
      print("price per extra m2:", round(model.coef_[0], 1))

      # 4. Visualise the model
      plt.scatter(X_test["area_m2"], y_test, alpha=0.6, label="real prices")
      line_x = pd.DataFrame({"area_m2": np.arange(35, 200)})
      plt.plot(line_x["area_m2"], model.predict(line_x), color="red", label="model")
      plt.xlabel("area (m2)")
      plt.ylabel("price (thousands)")
      plt.legend()
      plt.show()
quiz:
  - q: "Why start with a baseline that just predicts the average price?"
    options: ["It is the most accurate model", "scikit-learn requires it", "It sets the bar: a real model must beat it to be worth anything"]
    answer: 2
    explain: "An error of 34 sounds fine until you learn that guessing the average gives 66."
  - q: "Why do we keep 20 percent of the houses hidden in a test set?"
    options: ["To make training faster", "To check the model on houses it has never seen, which is what real use looks like", "To have more features"]
    answer: 1
  - q: "The linear model's coefficient on area_m2 is 3.3 and prices are in thousands. What does it mean?"
    options: ["Each extra square metre adds about 3.3 thousand to the predicted price", "The model is 3.3 percent wrong", "Houses have 3.3 bedrooms on average"]
    answer: 0
---
Now we get to machine learning. But the first model you build should be a very humble one: a **baseline**. A baseline answers the question "how good is it to know nothing?" and gives every later number a meaning.

## Where we are

The data is clean and explored: area is by far the strongest feature (correlation 0.91) and the neighbourhood shifts the price. The starter keeps the cleaning code from step 2 and has the imports for this step.

## What we will add

1. A **train/test split**: the model learns from one part of the houses and is scored on another part it has never seen. This mimics real life, where the model must price houses that are not in its history.
2. A **baseline**: always predict the average training price.
3. A first real model: **simple linear regression** using only the area.

We compare them with the **mean absolute error (MAE)**: the average size of the miss, ignoring direction. Our prices are in thousands, so an MAE of 34 means "typically about 34 thousand off". It is easy to explain to anyone, which is why it is a good first metric.

## Guided walk-through

**1. Split.** The **features** `X` are every column except the price, the **label** `y` is the price. `train_test_split` shuffles and cuts, returning four pieces **in this order**:

```python
y = df["price_k"]
X = df.drop(columns="price_k")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

`test_size=0.2` keeps 20 percent (60 houses) for testing, the other 239 are for training. `random_state=42` makes the shuffle repeatable, so you and the checker get the same houses.

**2. Baseline.** The best single number to guess, if you can only guess one, is the average of the training prices. Build a list with that number repeated once per test house and measure how wrong it is:

```python
baseline_pred = np.full(len(y_test), y_train.mean())
baseline_mae = mean_absolute_error(y_test, baseline_pred)
```

Note that the average comes from `y_train`, never from `y_test`: the test houses play "the future" and must not influence anything.

**3. A straight line on area.** scikit-learn needs the features as a **table**, even with one column, so use double brackets: `X_train[["area_m2"]]`. Then the standard rhythm: create, `fit` (learn from examples), `predict` (answer for new houses):

```python
model = LinearRegression()
model.fit(train_rows, y_train)
pred = model.predict(test_rows)
```

`model.coef_[0]` is the learned slope: the extra price per extra square metre. Check it makes sense (about 3.3 thousand per m2, matching the plot from step 3).

**4. Draw it.** Plot the real test prices as dots, and the model's line over them. For the line, predict for a grid of areas:

```python
line_x = pd.DataFrame({"area_m2": np.arange(35, 200)})
plt.plot(line_x["area_m2"], model.predict(line_x), color="red")
```

The `DataFrame` keeps the same column name the model was trained with. The line should run through the middle of the dots.

> **Watch out:**
> - The order of the four outputs of `train_test_split` is `X_train, X_test, y_train, y_test`. Mixing it up gives odd errors such as `Found input variables with inconsistent numbers of samples`.
> - `model.fit(X_train["area_m2"], y_train)` (single brackets) fails with `ValueError: Expected 2D array, got 1D array instead`.
> - Fitting on test data defeats the purpose: a model scored on houses it has already seen looks better than it is. This is called **data leakage**.
> - Here we peek at the test MAE once to see if the idea works. From step 5 on we choose between options using cross-validation on the training part, and the test set is opened only once in step 7.

> **Your turn:** split the data (80/20, `random_state=42`) and print `train rows:` and `test rows:`; compute the baseline MAE (guess the mean of `y_train`) and print it rounded to 1 decimal; fit a `LinearRegression` on the area only and print `linear MAE:`, `beats baseline:` and `price per extra m2:` (coefficient, 1 decimal); finish with a plot of the test dots and the red model line.
