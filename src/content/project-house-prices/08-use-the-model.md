---
title: "Step 8: Use the model and write a model card"
summary: "Refit on all data, predict prices for new houses with safety warnings, see why extrapolation fails and print a short model card."
level: advanced
export:
  kind: python
  name: house-price-predictor
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

      # --- honest evaluation (step 7) ---
      final = Pipeline([("prep", prep), ("model", models[best_name])])
      final.fit(X_train, y_train)
      pred = final.predict(X_test)
      test_mae = mean_absolute_error(y_test, pred)
      residuals = y_test - pred

      # 1. Refit on ALL cleaned data. X_all = X_train and X_test stacked with pd.concat, y_all likewise.
      #    Build final, a Pipeline with prep and a LinearRegression (the winner of step 6), and fit it on X_all, y_all.
      #    Also store area_low and area_high: the smallest and largest area_m2 in X_all.

      # 2. Write predict_price(area_m2, bedrooms, age_years, distance_to_center_km, neighbourhood).
      #    Inside: make a one-row DataFrame (each value in a list), run it through add_features, predict with
      #    final, and return TWO things: the price rounded to a whole number, and a warning text
      #    "area outside the training range" if area_m2 is below area_low or above area_high (otherwise None).
      #    Then call it for these houses and print f-line "Riverside 80 m2: <price> k, ok" style output:
      #      (80, 2, 10, 3.5, "Riverside"), (120, 4, 35, 8.0, "Hilltop"), (400, 5, 3, 2.0, "Riverside")
      #    Print: neighbourhood, area, "m2:", price, "k,", and the warning or "ok".

      # 3. Extrapolation. Fit a second pipeline, forest (prep + the same kind of RandomForestRegressor as in step 6),
      #    on X_all, y_all. Make a one-row table "giant" (400 m2, 5 bedrooms, 3 years,
      #    2.0 km, Riverside) with the extra feature added, and print:
      #      "linear for 400 m2:" and "forest for 400 m2:" (rounded whole numbers) and
      #      "forest stays below the most expensive house seen:" (forest prediction <= y_all.max()).

      # 4. Print a model card: the lines
      #      MODEL CARD / model: ... / trained on: N cleaned houses / features: comma separated list /
      #      typical error: about <test MAE, no decimals>k / valid area range: <min> to <max> m2 / known limits: ...
check:
  output: |
    Riverside 80 m2: 299 k, ok
    Hilltop 120 m2: 347 k, ok
    Riverside 400 m2: 1295 k, area outside the training range
    linear for 400 m2: 1295
    forest for 400 m2: 562
    forest stays below the most expensive house seen: True
    MODEL CARD
    model: linear regression in a pipeline
    trained on: 299 cleaned houses
    features: area_m2, bedrooms, age_years, distance_to_center_km, area_per_bedroom, neighbourhood
    typical error: about 20k (test MAE)
    valid area range: 35 to 177 m2
    known limits: made-up data, 3 neighbourhoods, no extrapolation, prices not adjusted for time
  code:
    - { pattern: "def\\s+predict_price\\s*\\(", message: "Write def predict_price(...)." }
    - { pattern: "X_all\\s*=\\s*pd\\.concat\\s*\\(", message: "Stack train and test with X_all = pd.concat([...])." }
    - { pattern: "forest\\.fit\\s*\\(", message: "Fit the forest pipeline with forest.fit(X_all, y_all)." }
    - { pattern: "print\\s*\\(\\s*[\"\\']MODEL CARD", message: "Print a line that starts with MODEL CARD." }
hints:
  - "After the exam, the model is refitted on all the data (train plus test): more houses, better model. A prediction function must prepare a new house exactly like the training rows: same columns, same add_features."
  - "X_all = pd.concat([X_train, X_test]) and y_all likewise; final.fit(X_all, y_all). In predict_price build pd.DataFrame({\"area_m2\": [area_m2], ...}), run add_features on it, and return round(float(final.predict(house)[0])) together with a warning or None."
  - "area_low, area_high = X_all[\"area_m2\"].min(), X_all[\"area_m2\"].max()   if not area_low <= area_m2 <= area_high: warning = \"area outside the training range\"   forest.predict(giant)[0] <= y_all.max()   print(\"MODEL CARD\")   print(f\"typical error: about {test_mae:.0f}k (test MAE)\")"
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

      # --- honest evaluation (step 7) ---
      final = Pipeline([("prep", prep), ("model", models[best_name])])
      final.fit(X_train, y_train)
      pred = final.predict(X_test)
      test_mae = mean_absolute_error(y_test, pred)
      residuals = y_test - pred

      # 1. Refit the winning model on ALL cleaned data (train + test), now that the evaluation is done
      X_all = pd.concat([X_train, X_test])
      y_all = pd.concat([y_train, y_test])
      final = Pipeline([("prep", prep), ("model", LinearRegression())])
      final.fit(X_all, y_all)
      area_low, area_high = X_all["area_m2"].min(), X_all["area_m2"].max()

      # 2. A function that answers "what is this house worth?" and warns when it is out of its depth
      def predict_price(area_m2, bedrooms, age_years, distance_to_center_km, neighbourhood):
          house = pd.DataFrame({
              "area_m2": [area_m2], "bedrooms": [bedrooms], "age_years": [age_years],
              "distance_to_center_km": [distance_to_center_km], "neighbourhood": [neighbourhood],
          })
          price = float(final.predict(add_features(house))[0])
          warning = None
          if not area_low <= area_m2 <= area_high:
              warning = "area outside the training range"
          return round(price), warning

      for house in [(80, 2, 10, 3.5, "Riverside"), (120, 4, 35, 8.0, "Hilltop"), (400, 5, 3, 2.0, "Riverside")]:
          price, warning = predict_price(*house)
          print(house[4], house[0], "m2:", price, "k,", warning or "ok")

      # 3. Extrapolation: a flexible model cannot go beyond what it has seen
      forest = Pipeline([("prep", prep),
                         ("model", RandomForestRegressor(n_estimators=50, max_depth=8, random_state=42))])
      forest.fit(X_all, y_all)
      giant = add_features(pd.DataFrame({"area_m2": [400], "bedrooms": [5], "age_years": [3],
                                         "distance_to_center_km": [2.0], "neighbourhood": ["Riverside"]}))
      print("linear for 400 m2:", round(float(final.predict(giant)[0])))
      print("forest for 400 m2:", round(float(forest.predict(giant)[0])))
      print("forest stays below the most expensive house seen:", forest.predict(giant)[0] <= y_all.max())

      # 4. A short model card
      print("MODEL CARD")
      print("model: linear regression in a pipeline")
      print("trained on:", len(X_all), "cleaned houses")
      print("features:", ", ".join(numeric_cols + ["neighbourhood"]))
      print(f"typical error: about {test_mae:.0f}k (test MAE)")
      print(f"valid area range: {area_low:.0f} to {area_high:.0f} m2")
      print("known limits: made-up data, 3 neighbourhoods, no extrapolation, prices not adjusted for time")
quiz:
  - q: "Why can a random forest never predict a price above the most expensive house it was trained on?"
    options: ["Each leaf predicts an average of training prices, so predictions stay inside that range", "scikit-learn clips the output", "Forests ignore the area"]
    answer: 0
    explain: "Trees do not extend trends, they only average what they have seen. A linear model extends its line, which can be wrong in a different way."
  - q: "The model was trained on three neighbourhoods and houses of 35 to 177 m2. A user asks about a 400 m2 villa. The best response is:"
    options: ["Return the number with full confidence", "Return the number but warn that the house is outside the range the model knows", "Refuse to run Python"]
    answer: 1
  - q: "What belongs in a model card?"
    options: ["Only the accuracy score", "The full source code of scikit-learn", "What the model does, the data it came from, its typical error, and its known limits and risks"]
    answer: 2
---
A model nobody can use is only an experiment. In this last step we turn the evaluated model into something you could put behind a web form, we test its boundaries and we write down what it can and cannot do.

## Where we are

All the pieces exist: clean data, a preprocessing recipe, three candidates compared fairly, a winner (linear regression) and an honest test error of about 20 thousand. The starter keeps the whole project code up to step 7 and has the cumulative imports.

## What we will add

1. **Refit on all the data.** The exam is over, so the 60 test houses can now help training. No further evaluation is possible after this, so we rely on the numbers from step 7.
2. A function `predict_price(...)` that prices a new house and **warns** when it is outside what the model knows.
3. A demonstration of **extrapolation** problems.
4. A short **model card**.

## Guided walk-through

**1. Refit.** Stack the training and test parts and rebuild the pipeline with the winning model:

```python
X_all = pd.concat([X_train, X_test])
y_all = pd.concat([y_train, y_test])
final = Pipeline([("prep", prep), ("model", LinearRegression())])
final.fit(X_all, y_all)
```

Also keep `area_low` and `area_high`, the smallest and largest area seen in training: they define the range where the model has evidence.

**2. A prediction function.** A new house arrives as plain values. The model expects a table with the **same columns** as in training, including the engineered feature, so wrap the values in a one-row `DataFrame` (each value in a list) and reuse `add_features` from step 5. This is the payoff of writing it as a function:

```python
def predict_price(area_m2, bedrooms, age_years, distance_to_center_km, neighbourhood):
    house = pd.DataFrame({"area_m2": [area_m2], ...})   # one row, one list per column
    house = add_features(house)
    price = float(final.predict(house)[0])               # predict returns an array, take element 0
    ...
    return round(price), warning
```

Return two things, the price and a warning (a message, or `None` when everything is fine). The calling code can show the warning to the user. Python lets you unpack both at once: `price, warning = predict_price(...)`, and `warning or "ok"` prints "ok" when the warning is `None`.

**3. Extrapolation.** Fit a random forest on the same data and ask both models about a 400 m2 villa, far beyond anything in the data. The linear model continues its straight line (about 1295 thousand); the forest can only repeat what it has seen, so it answers about 562 thousand. Neither is trustworthy! Real prices of mansions follow different rules. The lesson: **predictions outside the training range are guesses**, and a good system says so.

**4. Bias and limits.** A model learns whatever pattern is in its data, including unfair ones. If, in real life, historical prices in some neighbourhood were depressed by discrimination, a model trained on them would copy that and call it "objective". That is why step 7 sliced the errors by group. Our data is also made up, covers three neighbourhoods and has no notion of time, so inflation, new roads or a market crash are invisible to it.

**5. A model card** is a short, honest summary placed next to a model: what it is, what it was trained on, how well it works, where it fails. Printing it from the same variables you computed (`len(X_all)`, `test_mae`, `area_low`) keeps it in sync with the code.

> **Watch out:**
> - Passing a house without the `area_per_bedroom` column raises `ValueError: columns are missing`. Always run new data through `add_features`.
> - A DataFrame built with plain numbers instead of lists fails with `ValueError: If using all scalar values, you must pass an index`. Write `[area_m2]`.
> - Refitting on all data is only fine because you evaluated first. Never report a score of a model that was trained on the rows you scored it on.
> - `round(price)` rounds to the nearest whole thousand: do not present such a precise number as certain, since the typical error is about 20.

> **Your turn:** refit `final` on all rows and compute `area_low`/`area_high`; write `predict_price` and print one line per house (`neighbourhood area m2: price k, warning-or-ok`) for `(80, 2, 10, 3.5, "Riverside")`, `(120, 4, 35, 8.0, "Hilltop")` and `(400, 5, 3, 2.0, "Riverside")`; fit the forest and print `linear for 400 m2:`, `forest for 400 m2:` and `forest stays below the most expensive house seen:`; finally print the model card (`MODEL CARD`, `model:`, `trained on:`, `features:`, `typical error:`, `valid area range:`, `known limits:`).

## What to build next

* Replace the made-up table with a real dataset, for example a CSV of sales, and repeat the same eight steps.
* Add an `area_m2 ** 2` feature (or try `GradientBoostingRegressor`) and see if the cross-validated error drops, then verify once more on a test set you have not touched.
* Predict a range, not just a number, for example with the typical error or with quantile models.
* Save the pipeline with `joblib.dump(final, "model.joblib")` and load it inside a small web app.
* Monitor the model after launch: compare predictions with real sale prices every month, and retrain when the error grows.
