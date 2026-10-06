---
title: Dimensionality reduction with PCA
summary: Squash many columns into a few new ones that keep most of the information, and use that to draw high-dimensional data on a 2D plot.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt
      from sklearn.datasets import load_wine
      from sklearn.decomposition import PCA
      from sklearn.linear_model import LogisticRegression
      from sklearn.model_selection import KFold, cross_val_score
      from sklearn.pipeline import make_pipeline
      from sklearn.preprocessing import StandardScaler

      wine = load_wine()
      X, y = wine.data, wine.target          # 178 wines, 13 chemistry measurements

      # 1. Standardise X with StandardScaler().fit_transform and call it Xs. Print Xs.shape.

      # 2. Fit PCA(n_components=2) on Xs. Print explained_variance_ratio_ rounded to 2 decimals,
      #    then the sum of those two numbers rounded to 2 decimals.

      # 3. Fit a PCA with ALL components (PCA() with no argument) on Xs, take the cumulative sum of
      #    its explained_variance_ratio_ (np.cumsum) and print
      #    f"components for 90%: {n}" where n is how many components are needed to reach 0.9
      #    (np.argmax(cumulative >= 0.9) + 1).

      # 4. Z = pca.transform(Xs) (the 2-component version). Print Z.shape, then draw a scatter plot
      #    of Z[:, 0] against Z[:, 1] coloured by y (c=y), with axis labels "PC1" and "PC2",
      #    a title, and call plt.show().

      # 5. cv = KFold(n_splits=5, shuffle=True, random_state=0). For n in [1, 2, 5, 13] build
      #    make_pipeline(StandardScaler(), PCA(n_components=n), LogisticRegression(max_iter=1000)),
      #    cross-validate it and print f"{n} components {mean:.2f}".
check:
  output: |
    (178, 13)
    [0.36 0.19]
    0.55
    components for 90%: 8
    (178, 2)
    1 components 0.84
    2 components 0.97
    5 components 0.98
    13 components 0.99
  code:
    - { pattern: 'PCA\s*\(', message: "Create a PCA(...)." }
    - { pattern: 'explained_variance_ratio_', message: "Use explained_variance_ratio_ to see how much each component keeps." }
    - { pattern: 'np\.cumsum\s*\(', message: "Use np.cumsum on the ratios." }
    - { pattern: 'plt\.scatter\s*\(', message: "Draw the 2D points with plt.scatter." }
    - { pattern: 'plt\.show\s*\(', message: "Call plt.show() to display the chart." }
hints:
  - "PCA is fitted like any scikit-learn transformer: PCA(n_components=2).fit(Xs). explained_variance_ratio_ lists how much of the total spread each new axis keeps, and .transform(Xs) gives the new coordinates."
  - "For the 90% question fit PCA() with no argument, then cumulative = np.cumsum(full.explained_variance_ratio_) and n = int(np.argmax(cumulative >= 0.9)) + 1."
  - "pca = PCA(n_components=2).fit(Xs)   print(pca.explained_variance_ratio_.round(2))   Z = pca.transform(Xs)   plt.scatter(Z[:, 0], Z[:, 1], c=y)   make_pipeline(StandardScaler(), PCA(n_components=n), LogisticRegression(max_iter=1000))"
solution:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt
      from sklearn.datasets import load_wine
      from sklearn.decomposition import PCA
      from sklearn.linear_model import LogisticRegression
      from sklearn.model_selection import KFold, cross_val_score
      from sklearn.pipeline import make_pipeline
      from sklearn.preprocessing import StandardScaler

      wine = load_wine()
      X, y = wine.data, wine.target

      Xs = StandardScaler().fit_transform(X)
      print(Xs.shape)

      pca = PCA(n_components=2).fit(Xs)
      ratios = pca.explained_variance_ratio_
      print(ratios.round(2))
      print(round(ratios.sum(), 2))

      full = PCA().fit(Xs)
      cumulative = np.cumsum(full.explained_variance_ratio_)
      n = int(np.argmax(cumulative >= 0.9)) + 1
      print(f"components for 90%: {n}")

      Z = pca.transform(Xs)
      print(Z.shape)
      plt.scatter(Z[:, 0], Z[:, 1], c=y)
      plt.xlabel("PC1")
      plt.ylabel("PC2")
      plt.title("178 wines squashed from 13 columns to 2")
      plt.show()

      cv = KFold(n_splits=5, shuffle=True, random_state=0)
      for n_comp in [1, 2, 5, 13]:
          model = make_pipeline(StandardScaler(), PCA(n_components=n_comp),
                                LogisticRegression(max_iter=1000))
          scores = cross_val_score(model, X, y, cv=cv)
          print(f"{n_comp} components {scores.mean():.2f}")
quiz:
  - q: "What is a principal component?"
    options: ["One of the original columns", "A new axis, built from a mix of the original columns, along which the data varies the most", "A row that is removed"]
    answer: 1
  - q: "PCA reports explained_variance_ratio_ = [0.36, 0.19, ...]. What does 0.36 mean?"
    options: ["The first component keeps 36% of the total spread (variance) of the data", "The model is 36% accurate", "36 rows were deleted"]
    answer: 0
  - q: "Why standardise the columns before PCA?"
    options: ["PCA only works on integers", "To make the plot colourful", "Otherwise columns with big numbers (like proline) dominate the variance and the components"]
    answer: 2
  - q: "The new PC1 and PC2 axes are"
    options: ["Always the same as the first two original columns", "Uncorrelated with each other", "Class labels"]
    answer: 1
    explain: "PCA picks each new axis at right angles to the earlier ones, so the new columns carry no overlapping information."
---

The wine data has 13 columns per wine. You cannot draw 13 dimensions, and many of those columns say overlapping things (wines high in flavanoids also tend to be high in phenols). **Principal Component Analysis (PCA)** builds a few new columns that keep as much of the information as possible. You will use it to draw 13-dimensional data on a flat plot and to ask how many dimensions are really needed.

## The idea in plain words

Picture a cloud of points shaped like a long cigar. Most of the variation lies along the cigar's length, and very little across it. If you describe each point by its position along the length, you lose little. PCA finds that direction (the **first principal component**, PC1), then the next direction at a right angle to it with the most remaining variation (PC2), and so on. Each component is a weighted mix of the original columns. The new coordinates of a row are called its **scores**.

"Amount of information" means **variance**, the spread of the data. If the total variance is 13 (as it is after standardising 13 columns, each with variance 1), and PC1 captures 4.7 of it, then PC1 keeps `4.7 / 13 = 0.36`, or 36%. That share is `explained_variance_ratio_`.

## Always standardise first

PCA chases variance, and variance depends on units. Proline is in the hundreds, so its variance is enormous compared with `hue`, and an unscaled PCA would produce a first component that is basically "proline". Scale with `StandardScaler` first (lesson 13) so that every column starts with the same variance.

```python
pca = PCA(n_components=2).fit(Xs)
print(pca.explained_variance_ratio_.round(2))   # prints: [0.36 0.19]
Z = pca.transform(Xs)                           # shape (178, 2)
```

## How to read the output

* `[0.36 0.19]` means PC1 keeps 36% and PC2 19% of the information, so the 2D plot shows about 55% of the structure of the data. The ratios are always sorted from biggest to smallest.
* `components for 90%: 8` says you can describe 90% of the variation with 8 columns instead of 13. The line comes from the **cumulative** sum (`np.cumsum`): running totals 0.36, 0.55, 0.67 and so on. Where the total crosses your target, you stop.
* In the scatter plot the colours are the three grape varieties, which PCA never saw. Yet they form three separate clouds, which shows that the 2 new axes kept the information that matters.
* PC1 and PC2 are uncorrelated with each other by construction.

## Does less information hurt the model?

The last experiment feeds 1, 2, 5 and all 13 components into a logistic regression, inside a pipeline so PCA is fitted on the training folds only. Accuracy is about 0.84 with one component, 0.97 with two and 0.99 with all thirteen. So two components already give nearly the same accuracy as the full table. That is the reason PCA is used to speed up models, remove noise, and visualise clusters. The cost is **interpretability**: PC1 is a blend of many columns, no longer "alcohol" or "colour".

## Choosing the number of components

Common rules are "enough components to reach 90 or 95% of the variance", "look for the elbow in a plot of the ratios" or "pick whichever number gives the best cross-validated score". Use 2 or 3 for plotting.

> **Watch out:**
> - Skipping the scaling is the number one mistake. Your result looks fine but the first component simply is the biggest-numbered column.
> - Fitting PCA on all data before a train/test split leaks information. Put it in a pipeline.
> - The sign of a component is arbitrary (a component and its mirror are the same axis), so do not compare signs between runs or libraries.
> - `ValueError: n_components=20 must be between 0 and min(n_samples, n_features)=13`: you cannot ask for more components than columns.
> - PCA only finds straight-line structure. Curved shapes such as two moons stay tangled.
> - A cluster-free scatter does not prove that no structure exists; PCA keeps only the most-varying directions.

> **Your turn:** standardise the wine data, fit a 2-component PCA and print how much information it keeps, find how many components reach 90%, plot the 2D scores coloured by variety, and compare classification accuracy with 1, 2, 5 and 13 components in a pipeline.
