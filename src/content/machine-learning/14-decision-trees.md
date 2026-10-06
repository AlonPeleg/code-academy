---
title: Decision trees
summary: Train a tree of yes/no questions, read it back as plain rules with export_text, and see how depth controls overfitting.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      from sklearn.datasets import load_iris
      from sklearn.model_selection import train_test_split
      from sklearn.tree import DecisionTreeClassifier, export_text

      iris = load_iris()
      X, y = iris.data, iris.target

      # 1. Fit a DecisionTreeClassifier with max_depth=2 and random_state=0 on ALL of X, y.
      #    Print its rules with export_text(tree, feature_names=iris.feature_names).

      # 2. Print the depth and the number of leaves of that tree (get_depth, get_n_leaves)
      #    on one line, separated by a space.

      # 3. Predict the species of two flowers and print the NAMES (iris.target_names[...]):
      #    [5.0, 3.5, 1.4, 0.2] and [6.5, 3.0, 5.5, 2.0]

      # 4. Split the data 70/30 (test_size=0.3, random_state=1, stratify=y).
      #    For depth in 1..6 fit a new tree (random_state=0) on the training part and print
      #    f"{depth} {train_accuracy:.2f} {test_accuracy:.2f}"   (use tree.score)
check:
  output: |
    |--- petal width (cm) <= 0.80
    |   |--- class: 0
    |--- petal width (cm) >  0.80
    |   |--- petal width (cm) <= 1.75
    |   |   |--- class: 1
    |   |--- petal width (cm) >  1.75
    |   |   |--- class: 2
    
    2 3
    ['setosa' 'virginica']
    1 0.67 0.67
    2 0.95 0.96
    3 0.95 0.98
    4 0.97 0.98
    5 0.99 0.98
    6 1.00 0.98
  code:
    - { pattern: 'DecisionTreeClassifier\s*\(', message: "Create a DecisionTreeClassifier." }
    - { pattern: 'export_text\s*\(', message: "Print the rules with export_text." }
    - { pattern: 'max_depth', message: "Limit the tree with max_depth." }
    - { pattern: 'for\s+\w+\s+in\s+range', message: "Loop over the depths 1 to 6." }
hints:
  - "A tree is learned with .fit(X, y) like every scikit-learn model. export_text turns the fitted tree into indented if/else rules you can read."
  - "tree = DecisionTreeClassifier(max_depth=2, random_state=0).fit(X, y). For the loop use for depth in range(1, 7): and build a new tree with max_depth=depth each time."
  - "print(export_text(tree, feature_names=iris.feature_names))   print(tree.get_depth(), tree.get_n_leaves())   print(iris.target_names[tree.predict([[5.0,3.5,1.4,0.2],[6.5,3.0,5.5,2.0]])])   print(f'{depth} {t.score(X_train, y_train):.2f} {t.score(X_test, y_test):.2f}')"
solution:
  - name: main.py
    code: |
      from sklearn.datasets import load_iris
      from sklearn.model_selection import train_test_split
      from sklearn.tree import DecisionTreeClassifier, export_text

      iris = load_iris()
      X, y = iris.data, iris.target

      tree = DecisionTreeClassifier(max_depth=2, random_state=0)
      tree.fit(X, y)
      print(export_text(tree, feature_names=iris.feature_names))
      print(tree.get_depth(), tree.get_n_leaves())

      flowers = [[5.0, 3.5, 1.4, 0.2], [6.5, 3.0, 5.5, 2.0]]
      print(iris.target_names[tree.predict(flowers)])

      X_train, X_test, y_train, y_test = train_test_split(
          X, y, test_size=0.3, random_state=1, stratify=y)
      for depth in range(1, 7):
          t = DecisionTreeClassifier(max_depth=depth, random_state=0)
          t.fit(X_train, y_train)
          print(f"{depth} {t.score(X_train, y_train):.2f} {t.score(X_test, y_test):.2f}")
quiz:
  - q: "What does a decision tree actually learn?"
    options: ["A straight line through the data", "A sequence of yes/no questions about the features that ends in a prediction", "The average of all labels"]
    answer: 1
  - q: "A leaf with 50 samples that are all setosa has a Gini impurity of"
    options: ["1", "0.67", "0"]
    answer: 2
    explain: "Gini = 1 minus the sum of squared class shares. With one class the share is 1, so 1 - 1 = 0 and the leaf is perfectly pure."
  - q: "You raise max_depth from 3 to 20 and the training accuracy goes to 1.00 while test accuracy drops. This is"
    options: ["Underfitting", "Overfitting: the tree memorised the training rows", "Normal and good"]
    answer: 1
  - q: "Do decision trees need the features to be scaled?"
    options: ["Yes, always", "No, each question compares one feature with a threshold, so the scale does not matter", "Only if there are more than 3 features"]
    answer: 1
---

A decision tree is the model closest to how people actually decide: "Is the flower's petal narrow? If yes, it is a setosa. If not, is the petal wider than 1.75?" You will train one, read it back as rules, and learn how its depth controls overfitting (a model that memorises its training data and fails on new data).

## How a tree learns

Training starts with all rows in one group. The algorithm tries every feature and every possible cut-off value and picks the single question, such as `petal width <= 0.8`, that separates the classes best. Then it repeats the same process separately inside each side, and so on, until it hits a stopping rule such as `max_depth`. The end boxes are called **leaves**, and each leaf predicts the most common class among the training rows that landed there.

"Separates best" is measured with **Gini impurity**: `1 - sum(p^2)` where `p` is the share of each class in a group. Worked example with iris, which has 50 flowers of each of 3 species:

* Whole group: `1 - 3 * (1/3)^2 = 0.67` (very mixed).
* After asking `petal width <= 0.8`: the left group has 50 setosa only, impurity `1 - 1 = 0`. The right group has 50 versicolor and 50 virginica, impurity `1 - (0.5^2 + 0.5^2) = 0.5`.
* Weighted average: `50/150 * 0 + 100/150 * 0.5 = 0.33`, much lower than 0.67, so this question is a great first step.

## Fitting and reading a tree

```python
tree = DecisionTreeClassifier(max_depth=2, random_state=0)
tree.fit(X, y)
print(export_text(tree, feature_names=iris.feature_names))
```

`export_text` prints the fitted tree as indented rules:

```text
|--- petal width (cm) <= 0.80
|   |--- class: 0
|--- petal width (cm) >  0.80
|   |--- petal width (cm) <= 1.75
|   |   |--- class: 1
|   |--- petal width (cm) >  1.75
|   |   |--- class: 2
```

Read it top to bottom as `if / else`. Each `|---` line is a question, deeper indentation means "and then", and a `class:` line is a leaf with the answer (0, 1 and 2 stand for setosa, versicolor and virginica). Written as ordinary rules: petal width up to 0.8 means setosa, up to 1.75 means versicolor, otherwise virginica. Anyone can check this model by hand, and that is why trees are praised for being **interpretable**.

`tree.get_depth()` is the number of questions on the longest path, and `tree.get_n_leaves()` the number of end boxes.

## Depth is the dial for overfitting

Without a limit a tree keeps asking questions until every training row sits alone in a pure leaf: training accuracy 100%, but the tree has learned quirks and noise. With a limit that is too small it is too crude (**underfitting**). The experiment in the exercise compares train and test accuracy for depths 1 to 6:

* Depth 1 (one question) can separate setosa from the rest but not the other two species, so both scores are low.
* Depth 2 and 3 give a big jump on both.
* Beyond that the **training** score creeps up towards 1.00 while the **test** score stays flat. The extra questions only memorise training rows.

When train accuracy keeps rising but test accuracy has stopped improving, you have found the point where extra depth stops helping. Choosing a modest `max_depth` (or `min_samples_leaf`) is the simplest way to regularise a tree.

## How to read the output

* Lines of the rule print: follow one path from the top to a `class:` line to explain one prediction.
* The predictions are class numbers; `iris.target_names[...]` turns them into names. A 2D list `[[...], [...]]` predicts several flowers at once.
* Each loop line shows `depth train test`. Look for the depth where test stops improving.

> **Watch out:**
> - Forgetting `random_state`: trees break ties randomly, so results may change between runs.
> - Scoring on the training data only. A tree can reach 1.00 there and still be poor on new data.
> - `export_text(tree)` without `feature_names` prints `feature_2 <= 0.80`; pass the names to get readable rules.
> - Calling `export_text` before `fit` gives `NotFittedError`.
> - Trees predict stepwise constants, so they cannot extrapolate beyond the range seen in training.

> **Your turn:** fit a depth-2 tree on iris, print its rules, depth and leaf count, predict two flowers by name, then run the depth 1 to 6 experiment on a 70/30 split and print the train and test accuracy for each depth.
