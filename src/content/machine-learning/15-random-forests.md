---
title: Random forests and feature importance
summary: Average many different trees into a forest that is more accurate than one tree, and ask it which features mattered.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt
      from sklearn.datasets import load_wine
      from sklearn.ensemble import RandomForestClassifier
      from sklearn.model_selection import train_test_split
      from sklearn.tree import DecisionTreeClassifier

      wine = load_wine()
      X, y = wine.data, wine.target
      X_train, X_test, y_train, y_test = train_test_split(
          X, y, test_size=0.3, random_state=0, stratify=y)

      # 1. Fit ONE DecisionTreeClassifier(random_state=0) on the training data and print its
      #    test accuracy as  f"tree {accuracy:.2f}".

      # 2. For n in [1, 5, 25] fit RandomForestClassifier(n_estimators=n, random_state=0)
      #    and print f"{n} {train_accuracy:.2f} {test_accuracy:.2f}".

      # 3. Fit a forest with 40 trees (random_state=0).
      #    Print the sum of its feature_importances_ rounded to 2 decimals,
      #    then print the SORTED list of the names of the 3 most important features
      #    (np.argsort(importances)[::-1][:3] gives their positions, wine.feature_names the names).

      # 4. Draw a horizontal bar chart (plt.barh) of the 5 most important features
      #    with a title, then call plt.show().
check:
  output: |
    tree 0.94
    1 0.93 0.91
    5 1.00 0.96
    25 1.00 1.00
    1.0
    ['color_intensity', 'flavanoids', 'proline']
  code:
    - { pattern: 'RandomForestClassifier\s*\(', message: "Create a RandomForestClassifier." }
    - { pattern: 'n_estimators', message: "Set how many trees with n_estimators." }
    - { pattern: 'feature_importances_', message: "Read feature_importances_ from the fitted forest." }
    - { pattern: 'plt\.barh?\s*\(', message: "Draw the importances with plt.barh (or plt.bar)." }
    - { pattern: 'plt\.show\s*\(', message: "Call plt.show() to display the chart." }
hints:
  - "A random forest is fitted and scored exactly like a single tree. The setting n_estimators is the number of trees. After fit, the attribute feature_importances_ holds one number per feature that adds up to 1."
  - "forest = RandomForestClassifier(n_estimators=40, random_state=0).fit(X_train, y_train); imp = forest.feature_importances_; top = np.argsort(imp)[::-1][:3] gives the positions of the 3 biggest values."
  - "print(sorted(wine.feature_names[i] for i in top))   top5 = np.argsort(imp)[::-1][:5]   plt.barh([wine.feature_names[i] for i in top5], imp[top5])   plt.title('...')   plt.show()"
solution:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt
      from sklearn.datasets import load_wine
      from sklearn.ensemble import RandomForestClassifier
      from sklearn.model_selection import train_test_split
      from sklearn.tree import DecisionTreeClassifier

      wine = load_wine()
      X, y = wine.data, wine.target
      X_train, X_test, y_train, y_test = train_test_split(
          X, y, test_size=0.3, random_state=0, stratify=y)

      tree = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
      print(f"tree {tree.score(X_test, y_test):.2f}")

      for n in [1, 5, 25]:
          forest = RandomForestClassifier(n_estimators=n, random_state=0)
          forest.fit(X_train, y_train)
          print(f"{n} {forest.score(X_train, y_train):.2f} {forest.score(X_test, y_test):.2f}")

      forest = RandomForestClassifier(n_estimators=40, random_state=0)
      forest.fit(X_train, y_train)
      importances = forest.feature_importances_
      print(round(importances.sum(), 2))
      top = np.argsort(importances)[::-1][:3]
      print(sorted(wine.feature_names[i] for i in top))

      top5 = np.argsort(importances)[::-1][:5]
      plt.barh([wine.feature_names[i] for i in top5], importances[top5])
      plt.title("Most important features")
      plt.tight_layout()
      plt.show()
quiz:
  - q: "Why does a random forest make each tree a bit different?"
    options: ["Each tree sees a random sample of the rows and considers random subsets of features at each split", "Each tree gets a different target", "The trees are trained on different computers"]
    answer: 0
    explain: "Different data and feature choices make the trees disagree in different places, and averaging their votes cancels many individual mistakes."
  - q: "How does a forest of classification trees reach its final prediction?"
    options: ["It uses the deepest tree", "It lets the trees vote, and the most popular class wins", "It picks a random tree"]
    answer: 1
  - q: "The feature importances of a forest add up to"
    options: ["The number of trees", "The number of features", "1"]
    answer: 2
  - q: "A feature has a low importance. What can you safely conclude?"
    options: ["It is useless for every possible model", "The forest did not rely on it much, but it might matter on its own or be duplicated by a correlated feature", "It contains errors"]
    answer: 1
    explain: "Importance is relative to this model and this data. Correlated features share the credit between them."
---

One decision tree is easy to read but jumpy: change a few training rows and it can grow a very different tree, and a deep one overfits. A **random forest** fixes this with a simple idea, the wisdom of crowds. You will train a forest, see that it beats a single tree, and ask it which features it relied on.

## Many different trees, one vote

A forest is a collection of decision trees, each trained on a slightly different version of the problem:

1. **Bootstrap sample.** Each tree gets a random sample of the training rows, drawn with replacement, so some rows appear twice and some not at all.
2. **Random features.** At every split a tree only looks at a random subset of the features, so the trees cannot all choose the same favourite question.
3. **Vote.** To predict, every tree gives its answer and the class with the most votes wins (for numbers, the answers are averaged).

Each single tree is a bit overfitted and makes its own mistakes, but the mistakes point in different directions, so they cancel out in the vote. A tiny numeric picture: if every tree is right 70% of the time and they were completely independent, a vote of 25 trees would be right about 98% of the time. Real trees are not fully independent, so the gain is smaller, but the effect is real.

```python
from sklearn.ensemble import RandomForestClassifier
forest = RandomForestClassifier(n_estimators=40, random_state=0)
forest.fit(X_train, y_train)
print(forest.score(X_test, y_test))
```

* `n_estimators` is the number of trees. More trees means a steadier answer, with diminishing returns (and slower runs, which matters in the browser, so keep it under 50 here).
* `random_state` fixes the random choices so you get identical results every run.
* Everything else (`fit`, `predict`, `score`) works like every other scikit-learn model.

## Feature importance

After training, `forest.feature_importances_` gives one number per feature saying how much that feature helped reduce impurity (the Gini mixing from the last lesson) across all trees, averaged and scaled so that all numbers sum to 1. A feature at 0.20 did about a fifth of the splitting work.

```python
importances = forest.feature_importances_
top = np.argsort(importances)[::-1][:3]
```

`np.argsort` returns the *positions* that would sort the array from smallest to largest. `[::-1]` reverses it (largest first) and `[:3]` keeps three. Use those positions to look up the names in `wine.feature_names`.

For the wine data the winners are chemistry measurements such as flavanoids, colour intensity and proline, which makes sense: they are the properties that differ most between the three grape varieties. Importances are a great way to explain a model to others and to spot features you could drop.

## How to read the output

* `tree 0.94` is the single tree's test accuracy. Treat it as the baseline.
* The lines `1 0.93 0.91`, `5 1.00 0.96` and so on show train and test accuracy for forests of growing size. The forest with 5 or more trees is already perfect on the training data, and the test score improves as trees are added.
* The sum `1.0` is a sanity check.
* The bar chart shows the five biggest contributors; a longer bar means a more important feature.

> **Watch out:**
> - Importances belong to *this* model. Two correlated features split the credit, so each looks less important than it truly is.
> - A forest with a perfect training score is normal, not a bug. Only the test score tells you about quality.
> - `feature_importances_` only exists after `fit`; before that you get `NotFittedError`.
> - A forest is much harder to read than one tree. If you must explain every single decision, a shallow single tree is better.
> - Forgetting `random_state` makes the numbers change between runs, which makes debugging painful.

> **Your turn:** compare one decision tree with forests of 1, 5 and 25 trees, then fit a forest with 40 trees, print the importance sum and the three most important wine features (sorted by name), and draw a bar chart of the top five.
