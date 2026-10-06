---
title: Classification with logistic regression
summary: Predict categories instead of numbers, using the iris flower dataset and accuracy.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      from sklearn.datasets import load_iris
      from sklearn.model_selection import train_test_split
      from sklearn.linear_model import LogisticRegression

      data = load_iris()
      X, y = data.data, data.target            # 150 flowers, 4 measurements each
      names = data.target_names                # ['setosa' 'versicolor' 'virginica']

      # 1. Split: test_size=0.25, random_state=0, stratify=y (keeps the three species
      #    in the same proportions in both parts). Print "train rows:" and "test rows:".
      # 2. Train a LogisticRegression (max_iter=200) on the training part.
      # 3. Print "accuracy:" (test accuracy, 2 decimals) and "train accuracy:" (2 decimals).
      #    Accuracy = the share of flowers classified correctly (model.score does it).
      # 4. Classify a new flower [5.1, 3.5, 1.4, 0.2] and print "new flower:" and its
      #    species NAME (use names[...] with the predicted class number).
      # 5. For the flower [5.9, 3.0, 4.2, 1.5] print "versicolor probability:" with
      #    2 decimals (predict_proba gives one probability per class).
check:
  output: |
    train rows: 112
    test rows: 38
    accuracy: 1.00
    train accuracy: 0.96
    new flower: setosa
    versicolor probability: 0.86
  code:
    - { pattern: 'LogisticRegression\s*\(', message: "Use LogisticRegression(max_iter=200)." }
    - { pattern: 'train_test_split\s*\(', message: "Split the data with train_test_split(...)." }
    - { pattern: 'predict_proba\s*\(', message: "Use model.predict_proba(...) to get probabilities." }
hints:
  - "Classification predicts a class (a category). The pattern is the same as regression: split, create the model, fit on the training part, then score or predict. The label y holds class numbers 0, 1, 2."
  - "model.score(X_test, y_test) returns the accuracy. model.predict([[5.1, 3.5, 1.4, 0.2]]) returns an array with the predicted class number, so names[prediction[0]] gives the species. predict_proba returns one row of three probabilities, ordered by class number."
  - "model = LogisticRegression(max_iter=200)   model.fit(X_train, y_train)   proba = model.predict_proba([[5.9, 3.0, 4.2, 1.5]])[0]   print(f\"versicolor probability: {proba[1]:.2f}\")"
solution:
  - name: main.py
    code: |
      from sklearn.datasets import load_iris
      from sklearn.model_selection import train_test_split
      from sklearn.linear_model import LogisticRegression

      data = load_iris()
      X, y = data.data, data.target
      names = data.target_names

      X_train, X_test, y_train, y_test = train_test_split(
          X, y, test_size=0.25, random_state=0, stratify=y
      )
      print("train rows:", len(X_train))
      print("test rows:", len(X_test))

      model = LogisticRegression(max_iter=200)
      model.fit(X_train, y_train)

      print(f"accuracy: {model.score(X_test, y_test):.2f}")
      print(f"train accuracy: {model.score(X_train, y_train):.2f}")

      prediction = model.predict([[5.1, 3.5, 1.4, 0.2]])
      print("new flower:", names[prediction[0]])

      proba = model.predict_proba([[5.9, 3.0, 4.2, 1.5]])[0]
      print(f"versicolor probability: {proba[1]:.2f}")
quiz:
  - q: "What is the difference between regression and classification?"
    options: ["Regression predicts a category, classification predicts a number", "Regression predicts a number, classification predicts a category", "They are the same thing"]
    answer: 1
  - q: "Despite its name, logistic regression is used to"
    options: ["Classify things into categories", "Predict house prices", "Clean data"]
    answer: 0
  - q: "A model gets 19 of 20 test flowers right. What is its accuracy?"
    options: ["0.90", "0.95", "19"]
    answer: 1
  - q: "What does predict_proba return?"
    options: ["The accuracy of the model", "The most likely class only", "A probability for each class"]
    answer: 2
---

So far the label was a number (a price). Very often the label is a **category**: spam or not spam, which species a flower is, whether a patient is ill. Predicting a category is called **classification**, and each possible category is a **class**.

## Regression versus classification

- **Regression**: predict a number (price, temperature).
- **Classification**: predict one of a fixed set of classes (setosa, versicolor, virginica).

The scikit-learn workflow does not change at all: split, create, `fit`, `predict`. Only the model and the way we measure it differ.

## The iris dataset

scikit-learn ships with a few small practice datasets, so nothing has to be downloaded. The famous **iris** dataset has 150 flowers of three species, and four features measured in centimetres: sepal length, sepal width, petal length and petal width. The label is the species as a number: 0, 1 or 2.

```python
from sklearn.datasets import load_iris

data = load_iris()
print(data.data.shape)        # prints: (150, 4)
print(data.target_names)      # prints: ['setosa' 'versicolor' 'virginica']
```

`data.data` are the features (X), `data.target` the labels (y), and `data.target_names` translates a class number back into a name.

## Logistic regression

The name is confusing: logistic regression is a **classifier**. The idea in plain words: like linear regression it computes a weighted sum of the features, but then it squashes that sum into a number between 0 and 1 and reads it as a **probability**. For several classes it computes one probability per class, and the model predicts the class with the highest probability.

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)
model.predict(new_flowers)        # class numbers
model.predict_proba(new_flowers)  # a row of probabilities per flower
```

`max_iter=200` lets the training algorithm take up to 200 steps; the default of 100 can be a little short and prints a warning.

## Stratified splitting

With 150 flowers in three groups, a random split might accidentally put too few of one species in the test set. `stratify=y` makes the split keep the same proportions of each class in both parts. It is a good habit for any classification problem.

## Accuracy

The simplest score is **accuracy**: the share of examples classified correctly. For classifiers `model.score(X_test, y_test)` returns exactly that. In the exercise the test accuracy is 1.00 (all 38 test flowers right) and the training accuracy is 0.96. Do not be surprised that the test score is higher than the training score: with only 38 test flowers luck plays a big part. A test set this small gives a rough estimate, not a guarantee.

For the second flower, `predict_proba` gives about `[0.02, 0.86, 0.12]`: the model is 86 percent sure it is a versicolor. The probabilities of one flower always add up to 1.

## The math, briefly

The squashing function is the **sigmoid**, `1 / (1 + e^(-z))`, where `z` is the weighted sum of the features. A big positive `z` gives a probability near 1, a big negative `z` near 0, and `z = 0` gives exactly 0.5. Later in the track you will build logistic regression from scratch.

> **Watch out:**
> - Accuracy can mislead when classes are lopsided. If 95 percent of emails are not spam, a model that always says "not spam" is 95 percent accurate and useless. The lesson on confusion matrices fixes this.
> - A `ConvergenceWarning: lbfgs failed to converge` means training needed more steps: raise `max_iter` or scale your features (next lesson).
> - Mixing up class numbers and names: `model.predict` returns numbers. Use `names[number]` to get the species.
> - Passing a single flower as a flat list. It must be a table: `[[5.1, 3.5, 1.4, 0.2]]` has one row.

> **Your turn:** split the iris data (stratified), train a logistic regression, print the test and training accuracy, classify the new flower and print the probability that the second flower is a versicolor.
