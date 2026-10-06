---
title: "Step 5: Feature engineering and pipelines"
summary: "Add a ratio feature, one-hot encode the neighbourhood, scale the numbers and wrap everything in a scikit-learn Pipeline."
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt
      from sklearn.compose import ColumnTransformer
      from sklearn.linear_model import LinearRegression
      from sklearn.metrics import mean_absolute_error
      from sklearn.model_selection import cross_val_score
      from sklearn.model_selection import train_test_split
      from sklearn.pipeline import Pipeline
      from sklearn.preprocessing import OneHotEncoder, StandardScaler

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

      # 1. Write a function add_features(frame) that makes a copy of the table, adds a column
      #    "area_per_bedroom" (area_m2 divided by bedrooms) and returns the copy.
      #    Apply it to X_train and X_test, then print "area per bedroom, mean:" for X_train (1 decimal).

      # 2. Build a ColumnTransformer called prep with two parts:
      #      "num": a StandardScaler on numeric_cols (the 4 original numbers plus the new ratio)
      #      "hood": a OneHotEncoder with handle_unknown set to "ignore", on the column ["neighbourhood"]
      numeric_cols = ["area_m2", "bedrooms", "age_years", "distance_to_center_km", "area_per_bedroom"]

      # 3. Make pipe = Pipeline with the steps "prep" (your ColumnTransformer) and "model" (LinearRegression),
      #    fit it on X_train, y_train. Ask the fitted prep step for its feature names
      #    (pipe.named_steps["prep"].get_feature_names_out().tolist()), print
      #    "columns after preprocessing:" with how many there are, then print the last 3 names.

      # 4. Use cross_val_score with cv=5 and scoring="neg_mean_absolute_error" on the TRAINING data to get
      #    the MAE of (a) a plain LinearRegression on X_train[["area_m2"]] -> cv_area
      #    and (b) the whole pipe on X_train -> cv_full. The scores are negative, so put a minus sign
      #    in front of the .mean(). Print "area only, CV MAE:", "all features, CV MAE:" (1 decimal),
      #    and "more features helped:" (True/False).
check:
  output: |
    area per bedroom, mean: 34.7
    columns after preprocessing: 8
    ['hood__neighbourhood_Hilltop', 'hood__neighbourhood_Old Town', 'hood__neighbourhood_Riverside']
    area only, CV MAE: 30.1
    all features, CV MAE: 18.6
    more features helped: True
  code:
    - { pattern: "def\\s+add_features\\s*\\(", message: "Write a function def add_features(frame)." }
    - { pattern: "ColumnTransformer\\s*\\(", message: "Combine the preprocessing with ColumnTransformer([...])." }
    - { pattern: "OneHotEncoder\\s*\\(", message: "Encode the neighbourhood with OneHotEncoder(...)." }
    - { pattern: "StandardScaler\\s*\\(", message: "Scale the numbers with StandardScaler()." }
    - { pattern: "Pipeline\\s*\\(", message: "Chain preprocessing and model with Pipeline([...])." }
    - { pattern: "cross_val_score\\s*\\(", message: "Score with cross_val_score(...)." }
hints:
  - "Models need numbers only, and they work best on comparable scales. A ColumnTransformer applies one transformer to the number columns and another to the text column. A Pipeline glues preprocessing and model into a single object with fit and predict."
  - "prep = ColumnTransformer([(\"num\", StandardScaler(), numeric_cols), (\"hood\", OneHotEncoder(handle_unknown=\"ignore\"), [\"neighbourhood\"])]). Then pipe = Pipeline([(\"prep\", prep), (\"model\", LinearRegression())]). cross_val_score returns negative errors with scoring=\"neg_mean_absolute_error\"."
  - "frame = frame.copy(); frame[\"area_per_bedroom\"] = frame[\"area_m2\"] / frame[\"bedrooms\"]; return frame   cv_full = -cross_val_score(pipe, X_train, y_train, cv=5, scoring=\"neg_mean_absolute_error\").mean()   names = pipe.named_steps[\"prep\"].get_feature_names_out().tolist()"
solution:
  - name: main.py
    code: |
      import numpy as np
      import pandas as pd
      import matplotlib.pyplot as plt
      from sklearn.compose import ColumnTransformer
      from sklearn.linear_model import LinearRegression
      from sklearn.metrics import mean_absolute_error
      from sklearn.model_selection import cross_val_score
      from sklearn.model_selection import train_test_split
      from sklearn.pipeline import Pipeline
      from sklearn.preprocessing import OneHotEncoder, StandardScaler

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

      # 1. A ratio feature, built by a function we can reuse on new houses later
      def add_features(frame):
          frame = frame.copy()
          frame["area_per_bedroom"] = frame["area_m2"] / frame["bedrooms"]
          return frame

      X_train = add_features(X_train)
      X_test = add_features(X_test)
      print("area per bedroom, mean:", round(X_train["area_per_bedroom"].mean(), 1))

      # 2. Preprocessing: scale the numbers, one-hot encode the neighbourhood
      numeric_cols = ["area_m2", "bedrooms", "age_years", "distance_to_center_km", "area_per_bedroom"]
      prep = ColumnTransformer([
          ("num", StandardScaler(), numeric_cols),
          ("hood", OneHotEncoder(handle_unknown="ignore"), ["neighbourhood"]),
      ])

      # 3. Preprocessing + model in ONE object
      pipe = Pipeline([("prep", prep), ("model", LinearRegression())])
      pipe.fit(X_train, y_train)
      names = pipe.named_steps["prep"].get_feature_names_out().tolist()
      print("columns after preprocessing:", len(names))
      print(names[-3:])

      # 4. Did it help? Compare cross-validated errors on the TRAINING part only
      cv_area = -cross_val_score(LinearRegression(), X_train[["area_m2"]], y_train,
                                 cv=5, scoring="neg_mean_absolute_error").mean()
      cv_full = -cross_val_score(pipe, X_train, y_train,
                                 cv=5, scoring="neg_mean_absolute_error").mean()
      print("area only, CV MAE:", round(cv_area, 1))
      print("all features, CV MAE:", round(cv_full, 1))
      print("more features helped:", cv_full < cv_area)
quiz:
  - q: "Why one-hot encode the neighbourhood instead of numbering it 0, 1, 2?"
    options: ["Numbering would wrongly say Hilltop is half of Riverside, one-hot gives each place its own yes/no column", "One-hot encoding is faster", "Text cannot be stored in a DataFrame"]
    answer: 0
    explain: "Numbers imply an order and distances that the categories do not have."
  - q: "What is the main benefit of putting preprocessing and model inside one Pipeline?"
    options: ["It makes the model more accurate by itself", "The same steps are applied identically in training, cross-validation and prediction, with no leakage", "It removes the need for features"]
    answer: 1
  - q: "cross_val_score(..., scoring=\"neg_mean_absolute_error\") returns -18.6. What is the MAE?"
    options: ["-18.6", "0.186", "18.6"]
    answer: 2
    explain: "scikit-learn maximises scores, so errors are reported as negatives. Put a minus in front."
---
Models rarely get better because you pick a fancier algorithm; they get better because you give them better inputs. This step shows the standard way to prepare inputs for a model, and how to keep the whole recipe in one object.

## Where we are

The project now has a clean table, a train/test split and a baseline: always guessing the average costs about 66 thousand, and a line on area alone about 34. The starter keeps the code to this point and has the imports for this step.

## What we will add

* A **new feature** made from old ones (**feature engineering**): the area per bedroom, which tells a cramped flat from a spacious home.
* **One-hot encoding** for `neighbourhood`, because models can only do arithmetic on numbers.
* **Scaling** for the numeric columns.
* A **Pipeline** that holds the preprocessing and the model together.

## Guided walk-through

**1. A reusable feature function.** Put the recipe in a function, because later you must build exactly the same feature for brand-new houses (step 8):

```python
def add_features(frame):
    frame = frame.copy()          # never change the caller's table by accident
    frame["area_per_bedroom"] = frame["area_m2"] / frame["bedrooms"]
    return frame
```

Apply it to `X_train` and `X_test` separately. A row-by-row calculation cannot leak information between them. Be honest about results though: this ratio itself helps only a little here. Engineering a feature is a hypothesis, and the score tells you whether it was right.

**2. One-hot encoding.** The neighbourhood becomes three yes/no columns:

| neighbourhood | is_Hilltop | is_Old Town | is_Riverside |
|---|---|---|---|
| Hilltop | 1 | 0 | 0 |
| Riverside | 0 | 0 | 1 |

Numbering them 0, 1, 2 would wrongly tell the model that Riverside is "twice" Old Town. `OneHotEncoder(handle_unknown="ignore")` also keeps working when a new neighbourhood shows up later, by writing zeros for it.

**3. Scaling.** `StandardScaler` shifts each number column to average 0 and spread 1, so areas (35 to 177) and bedrooms (1 to 6) are on comparable scales. For plain linear regression the predictions do not change, but many models (distance-based ones, regularised ones) need it, so it is a good habit.

**4. Tell each transformer which columns to use.** A `ColumnTransformer` takes a list of `(name, transformer, columns)`:

```python
prep = ColumnTransformer([
    ("num", StandardScaler(), numeric_cols),
    ("hood", OneHotEncoder(handle_unknown="ignore"), ["neighbourhood"]),
])
pipe = Pipeline([("prep", prep), ("model", LinearRegression())])
```

`pipe.fit(X_train, y_train)` first fits the preprocessing on the training rows, then trains the model on the transformed rows; `pipe.predict(new_rows)` repeats the same transformation automatically. After fitting, `pipe.named_steps["prep"].get_feature_names_out()` lists the 8 resulting columns (5 numbers plus 3 neighbourhood columns).

**5. Did it help?** Judge on training data only, with **cross-validation**: `cross_val_score(model, X, y, cv=5, scoring="neg_mean_absolute_error")` trains five times, each time scoring on a different fifth of the training rows, and returns five scores. They are negative (scikit-learn always maximises), so write `-cross_val_score(...).mean()`. Because the model sits inside the pipeline, scaling is re-learned inside every fold, so nothing leaks. Expect the error to fall from about 30 (area only) to about 19.

> **Watch out:**
> - Fitting a scaler on all the data before splitting leaks information from the test set. Putting it inside the pipeline avoids this.
> - Naming a column that does not exist raises `ValueError: A given column is not a column of the dataframe`. The ratio column exists only after `add_features`.
> - Without `handle_unknown="ignore"`, an unseen category in new data raises `ValueError: Found unknown categories`.
> - Never build ratios with the target (price per m2): that column contains the answer, and is **target leakage**.

> **Your turn:** write `add_features`, apply it to both parts, print `area per bedroom, mean:`; build `prep` and `pipe`, fit the pipe and print `columns after preprocessing:` plus the last 3 feature names; compute `cv_area` (plain `LinearRegression` on area only) and `cv_full` (the whole pipe) with `cv=5` on the training data and print both rounded to 1 decimal followed by `more features helped:`.
