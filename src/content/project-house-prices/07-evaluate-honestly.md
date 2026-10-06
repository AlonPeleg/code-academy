---
title: "Step 7: Evaluate honestly and analyse the errors"
summary: "Open the test set once, report the real error, then study the biggest mistakes and a residual plot."
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt
      from sklearn.compose import ColumnTransformer
      from sklearn.ensemble import RandomForestRegressor
      from sklearn.linear_model import LinearRegression
      from sklearn.metrics import mean_absolute_error
      from sklearn.metrics import r2_score
      from sklearn.model_selection import KFold
      from sklearn.model_selection import cross_val_score
      from sklearn.model_selection import train_test_split
      from sklearn.pipeline import Pipeline
      from sklearn.preprocessing import OneHotEncoder, StandardScaler
      from sklearn.tree import DecisionTreeRegressor

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

      # --- train/test split (step 4) ---
      y = df["price_k"]
      X = df.drop(columns="price_k")
      X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

      # --- features and preprocessing (step 5) ---
      def add_features(frame):
          frame = frame.copy()
          frame["area_per_bedroom"] = frame["area_m2"] / frame["bedrooms"]
          return frame

      X_train = add_features(X_train)
      X_test = add_features(X_test)

      numeric_cols = ["area_m2", "bedrooms", "age_years", "distance_to_center_km", "area_per_bedroom"]
      prep = ColumnTransformer([
          ("num", StandardScaler(), numeric_cols),
          ("hood", OneHotEncoder(handle_unknown="ignore"), ["neighbourhood"]),
      ])

      # --- model comparison (step 6) ---
      models = {
          "linear": LinearRegression(),
          "tree": DecisionTreeRegressor(max_depth=5, random_state=42),
          "forest": RandomForestRegressor(n_estimators=50, max_depth=8, random_state=42),
      }
      cv = KFold(n_splits=5, shuffle=True, random_state=42)
      results = {}
      for name, estimator in models.items():
          pipe = Pipeline([("prep", prep), ("model", estimator)])
          scores = -cross_val_score(pipe, X_train, y_train, cv=cv, scoring="neg_mean_absolute_error")
          results[name] = scores.mean()
      best_name = min(results, key=results.get)

      # 1. Build final, a Pipeline with prep and models[best_name], fit it on the TRAINING
      #    part only, predict X_test, and compute test_mae (and baseline_mae: always guess the mean of y_train).
      #    Print:
      #      "test MAE:" (1 decimal), "CV MAE was:" (results[best_name], 1 decimal),
      #      "test close to CV:" (True if the two differ by less than 6),
      #      "test R2:" (r2_score, 2 decimals), "beats baseline:" (True/False)

      # 2. Error analysis. residuals = y_test - pred (actual minus predicted). Build a DataFrame called report
      #    with the columns area_m2, neighbourhood, actual, predicted, error (round the last three to 0
      #    decimals). Sort it so the LARGEST absolute errors come first and print its first 5 rows.
      #    Then print "mean error:" (1 decimal) and the mean ABSOLUTE error per neighbourhood
      #    (take residuals.abs(), group it by the neighbourhood column of X_test, 1 decimal).
      #    Finally print "within 20k of the truth:" the share of test houses whose absolute error is at most 20
      #    (the mean of a True/False Series is a share), rounded to 2 decimals.

      # 3. Residual plot: predicted values on x, residuals on y, a red horizontal line at 0, labels, show it.
check:
  output: |
    test MAE: 20.3
    CV MAE was: 18.9
    test close to CV: True
    test R2: 0.91
    beats baseline: True
         area_m2 neighbourhood  actual  predicted  error
    265     99.0       Hilltop   255.0      308.0  -53.0
    75      83.0      Old Town   306.0      253.0   53.0
    108     47.0      Old Town   193.0      141.0   52.0
    93      48.0      Old Town   206.0      155.0   51.0
    109    107.0     Riverside   432.0      383.0   50.0
    mean error: 2.0
    neighbourhood
    Hilltop      24.5
    Old Town     20.6
    Riverside    16.9
    Name: price_k, dtype: float64
    within 20k of the truth: 0.58
  code:
    - { pattern: "r2_score\\s*\\(", message: "Compute R squared with r2_score(y_test, pred)." }
    - { pattern: "\\.predict\\s*\\(", message: "Predict the test houses with final.predict(X_test)." }
    - { pattern: "\\.groupby\\s*\\(", message: "Group the absolute residuals by neighbourhood with groupby." }
    - { pattern: "plt\\.axhline\\s*\\(", message: "Draw the zero line with plt.axhline(0, ...)." }
    - { pattern: "plt\\.scatter\\s*\\(", message: "Plot residuals with plt.scatter(pred, residuals)." }
    - { pattern: "plt\\.show\\s*\\(", message: "Show the figure with plt.show()." }
hints:
  - "Train the winner on the training part only, then use X_test exactly once. Error analysis means looking at individual mistakes: residual = actual minus predicted, then sort by absolute size."
  - "final = Pipeline([(\"prep\", prep), (\"model\", models[best_name])]); final.fit(X_train, y_train); pred = final.predict(X_test). Build report = pd.DataFrame({...}) and sort with report.reindex(report[\"error\"].abs().sort_values(ascending=False).index)."
  - "test_mae = mean_absolute_error(y_test, pred)   residuals = y_test - pred   print(\"within 20k of the truth:\", round((residuals.abs() <= 20).mean(), 2))   print(residuals.abs().groupby(X_test[\"neighbourhood\"]).mean().round(1))   plt.scatter(pred, residuals)   plt.axhline(0, color=\"red\")"
solution:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt
      from sklearn.compose import ColumnTransformer
      from sklearn.ensemble import RandomForestRegressor
      from sklearn.linear_model import LinearRegression
      from sklearn.metrics import mean_absolute_error
      from sklearn.metrics import r2_score
      from sklearn.model_selection import KFold
      from sklearn.model_selection import cross_val_score
      from sklearn.model_selection import train_test_split
      from sklearn.pipeline import Pipeline
      from sklearn.preprocessing import OneHotEncoder, StandardScaler
      from sklearn.tree import DecisionTreeRegressor

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

      # --- train/test split (step 4) ---
      y = df["price_k"]
      X = df.drop(columns="price_k")
      X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

      # --- features and preprocessing (step 5) ---
      def add_features(frame):
          frame = frame.copy()
          frame["area_per_bedroom"] = frame["area_m2"] / frame["bedrooms"]
          return frame

      X_train = add_features(X_train)
      X_test = add_features(X_test)

      numeric_cols = ["area_m2", "bedrooms", "age_years", "distance_to_center_km", "area_per_bedroom"]
      prep = ColumnTransformer([
          ("num", StandardScaler(), numeric_cols),
          ("hood", OneHotEncoder(handle_unknown="ignore"), ["neighbourhood"]),
      ])

      # --- model comparison (step 6) ---
      models = {
          "linear": LinearRegression(),
          "tree": DecisionTreeRegressor(max_depth=5, random_state=42),
          "forest": RandomForestRegressor(n_estimators=50, max_depth=8, random_state=42),
      }
      cv = KFold(n_splits=5, shuffle=True, random_state=42)
      results = {}
      for name, estimator in models.items():
          pipe = Pipeline([("prep", prep), ("model", estimator)])
          scores = -cross_val_score(pipe, X_train, y_train, cv=cv, scoring="neg_mean_absolute_error")
          results[name] = scores.mean()
      best_name = min(results, key=results.get)

      # 1. Train the chosen model on the training part ONLY, then use the test set exactly once
      final = Pipeline([("prep", prep), ("model", models[best_name])])
      final.fit(X_train, y_train)
      pred = final.predict(X_test)
      test_mae = mean_absolute_error(y_test, pred)
      baseline_mae = mean_absolute_error(y_test, np.full(len(y_test), y_train.mean()))
      print("test MAE:", round(test_mae, 1))
      print("CV MAE was:", round(results[best_name], 1))
      print("test close to CV:", abs(test_mae - results[best_name]) < 6)
      print("test R2:", round(r2_score(y_test, pred), 2))
      print("beats baseline:", test_mae < baseline_mae)

      # 2. Error analysis: look at the mistakes, not only the average
      residuals = y_test - pred
      report = pd.DataFrame({
          "area_m2": X_test["area_m2"],
          "neighbourhood": X_test["neighbourhood"],
          "actual": y_test.round(0),
          "predicted": pred.round(0),
          "error": residuals.round(0),
      })
      report = report.reindex(report["error"].abs().sort_values(ascending=False).index)
      print(report.head(5))
      print("mean error:", round(residuals.mean(), 1))
      print(residuals.abs().groupby(X_test["neighbourhood"]).mean().round(1))
      print("within 20k of the truth:", round((residuals.abs() <= 20).mean(), 2))

      # 3. Residual plot
      plt.scatter(pred, residuals, alpha=0.7)
      plt.axhline(0, color="red")
      plt.xlabel("predicted price (thousands)")
      plt.ylabel("error = actual - predicted")
      plt.title("Residuals on the test set")
      plt.show()
quiz:
  - q: "The test MAE (20.3) is close to the cross-validated MAE (18.9). What does that suggest?"
    options: ["The test set was used for training", "Our error estimate is believable: we can expect similar errors on new houses", "The model is perfect"]
    answer: 1
    explain: "A large gap between CV and test would be a red flag for leakage or luck."
  - q: "In a residual plot, which picture is the healthy one?"
    options: ["A curve or a funnel shape", "All dots far above zero", "A formless cloud scattered around the zero line"]
    answer: 2
    explain: "Patterns in the residuals mean the model misses something systematic. Random scatter means what is left is noise."
  - q: "You see the test score, dislike it, and tweak the model until the test score improves. What went wrong?"
    options: ["The test set now influenced the model, so its score is optimistic and no longer honest", "Nothing, that is normal practice", "You should have used more trees"]
    answer: 0
---
Up to now every decision was made on the training data. Now comes the exam: how good is the chosen model on houses it has never seen? And just as important, **where** does it go wrong?

## Where we are

Step 6 picked a winner, `best_name`, by cross-validation on the training part. The starter keeps all earlier code. The test set is still untouched: this step uses it, and only once.

## What we will add

1. The **final score** on the test set, compared with the cross-validation estimate and the baseline.
2. **Error analysis**: the largest mistakes, the average error per neighbourhood, and the share of "good enough" predictions.
3. A **residual plot**.

The rule is simple: the test set is a sealed envelope, opened once. If you tweak the model after seeing the test score, the envelope was opened twice and the next score is flattering.

## Guided walk-through

**1. Fit on training only and test once.**

```python
final = Pipeline([("prep", prep), ("model", models[best_name])])
final.fit(X_train, y_train)
pred = final.predict(X_test)
test_mae = mean_absolute_error(y_test, pred)
```

Print the test MAE next to the cross-validated one (`results[best_name]`). They should be close (about 20.3 against 18.9). A big gap would mean something is off. Also print **R squared**, `r2_score(y_test, pred)`: the share of the price variation that the model explains. 1.0 is perfect and 0.0 is no better than guessing the average. About 0.91 is strong.

**2. Residuals.** A **residual** is the miss on one house:

```python
residuals = y_test - pred     # positive: the real price was higher than we predicted
```

Collect the interesting columns into a small table (`report`) and sort it by the size of the error, ignoring the sign. `abs()` removes the sign, and `reindex` reorders a table by a list of row labels:

```python
order = report["error"].abs().sort_values(ascending=False).index
report = report.reindex(order)
print(report.head(5))
```

Look at the five worst houses like a detective: are they all in one neighbourhood? All tiny or all huge? Here the worst errors are about 50 thousand in both directions, with no obvious pattern. That is what noise looks like.

**3. Slice the error.** An average can hide an unfair model. Group the absolute residuals by neighbourhood (`groupby` on a Series works with another column as the key):

```python
residuals.abs().groupby(X_test["neighbourhood"]).mean()
```

Riverside is predicted more precisely (about 17) than Hilltop (about 24). With only 60 test houses we should not over-interpret that, but in a real project a gap like this is a prompt to collect more data for the weaker group. Also print the **mean error**, `residuals.mean()`: near 0 means the model is not systematically too high or too low.

A statement non-experts understand is the share within a tolerance: `(residuals.abs() <= 20).mean()` is the fraction of houses predicted within 20 thousand (about 0.58). Comparing a True/False Series with `.mean()` gives a share.

**4. Residual plot.** Put the predicted price on the x axis, the residual on the y axis, add a red line at 0. A healthy plot is a shapeless cloud around the line. A curve means a missing non-linear effect; a funnel (errors growing with price) means the model is less reliable for expensive houses.

> **Watch out:**
> - `y_test - pred` and `pred - y_test` have opposite signs. Write down which one you use, and explain it to readers.
> - Sorting by `residuals` instead of the absolute value puts the biggest overestimates at the bottom and hides them.
> - Do not call `final.fit(X_test, ...)` or refit anything on the test data to "improve" the score.
> - The `report` columns must come from the same test rows, in the same order. Series align by row label, which is why the index matters.

> **Your turn:** fit `final` on the training part, predict the test houses, print `test MAE:`, `CV MAE was:`, `test close to CV:` (difference below 6), `test R2:` and `beats baseline:`. Build the sorted `report` and print its first 5 rows, then `mean error:`, the mean absolute error per neighbourhood and `within 20k of the truth:`. Finish with the residual plot.
