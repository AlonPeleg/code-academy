---
title: Confusion matrix, precision and recall
summary: "Look beyond accuracy: count the kinds of mistakes a classifier makes and trade precision against recall."
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      from sklearn.datasets import load_breast_cancer
      from sklearn.model_selection import train_test_split
      from sklearn.preprocessing import StandardScaler
      from sklearn.linear_model import LogisticRegression
      from sklearn.metrics import confusion_matrix, precision_score, recall_score

      data = load_breast_cancer()
      y = (data.target == 0).astype(int)        # 1 means malignant (the case we must not miss)
      X_train, X_test, y_train, y_test = train_test_split(
          data.data, y, test_size=0.3, random_state=0, stratify=y
      )

      scaler = StandardScaler()
      X_train_s = scaler.fit_transform(X_train)
      X_test_s = scaler.transform(X_test)

      model = LogisticRegression(max_iter=1000)
      model.fit(X_train_s, y_train)
      pred = model.predict(X_test_s)                      # class 0 or 1 (threshold 0.5)
      proba = model.predict_proba(X_test_s)[:, 1]         # probability of malignant

      # 1. Print the confusion matrix of the test labels and the predictions.
      # 2. Print "precision:" and "recall:" for the predictions (2 decimals each).
      # 3. Be more careful: make new predictions called careful, 1 whenever the
      #    probability is at least 0.2 (a comparison on proba, turned into integers
      #    with .astype(int)). Print "recall at 0.2:" and "precision at 0.2:" (2 decimals).
check:
  output: |
    [[103   4]
     [  4  60]]
    precision: 0.94
    recall: 0.94
    recall at 0.2: 0.95
    precision at 0.2: 0.82
  code:
    - { pattern: 'confusion_matrix\s*\(', message: "Call confusion_matrix(y_test, pred)." }
    - { pattern: 'precision_score\s*\(', message: "Call precision_score(y_test, pred)." }
    - { pattern: 'recall_score\s*\(', message: "Call recall_score(y_test, pred)." }
    - { pattern: 'proba\s*>=?\s*0\.2', message: "Build the careful predictions with proba >= 0.2." }
hints:
  - "All three metrics compare the true labels with the predictions, true labels first: confusion_matrix(y_test, pred), precision_score(y_test, pred), recall_score(y_test, pred)."
  - "Lowering the threshold means calling more cases positive: careful = (proba >= 0.2).astype(int). Score careful with the same two functions to see recall rise and precision fall."
  - "print(confusion_matrix(y_test, pred))   careful = (proba >= 0.2).astype(int)   print(f\"recall at 0.2: {recall_score(y_test, careful):.2f}\")   print(f\"precision at 0.2: {precision_score(y_test, careful):.2f}\")"
solution:
  - name: main.py
    code: |
      from sklearn.datasets import load_breast_cancer
      from sklearn.model_selection import train_test_split
      from sklearn.preprocessing import StandardScaler
      from sklearn.linear_model import LogisticRegression
      from sklearn.metrics import confusion_matrix, precision_score, recall_score

      data = load_breast_cancer()
      y = (data.target == 0).astype(int)
      X_train, X_test, y_train, y_test = train_test_split(
          data.data, y, test_size=0.3, random_state=0, stratify=y
      )

      scaler = StandardScaler()
      X_train_s = scaler.fit_transform(X_train)
      X_test_s = scaler.transform(X_test)

      model = LogisticRegression(max_iter=1000)
      model.fit(X_train_s, y_train)
      pred = model.predict(X_test_s)
      proba = model.predict_proba(X_test_s)[:, 1]

      print(confusion_matrix(y_test, pred))
      print(f"precision: {precision_score(y_test, pred):.2f}")
      print(f"recall: {recall_score(y_test, pred):.2f}")

      careful = (proba >= 0.2).astype(int)
      print(f"recall at 0.2: {recall_score(y_test, careful):.2f}")
      print(f"precision at 0.2: {precision_score(y_test, careful):.2f}")
quiz:
  - q: "What is a false negative in a disease test?"
    options: ["A healthy person flagged as ill", "An ill person the test says is healthy", "A healthy person correctly cleared"]
    answer: 1
  - q: "Precision answers which question?"
    options: ["Of all the real positives, how many did we find?", "How many predictions were correct overall?", "Of everything we flagged as positive, how much really was positive?"]
    answer: 2
  - q: "Recall answers which question?"
    options: ["Of everything we flagged, how much was right?", "How fast is the model?", "Of all the real positives, how many did we find?"]
    answer: 2
  - q: "A model that always predicts \"not spam\" on data that is 99 percent not spam has"
    options: ["High accuracy but zero recall for spam", "Low accuracy and high recall", "High precision and high recall"]
    answer: 0
    explain: "This is why accuracy alone is not enough when the classes are unbalanced."
---

Accuracy, the share of correct predictions, sounds like the perfect score. But it hides what kind of mistakes a model makes, and some mistakes are far more costly than others. A cancer test that misses a tumour is much worse than one that raises a false alarm. This lesson gives you the tools to look at mistakes properly.

## Two kinds of right, two kinds of wrong

Pick one class to be the **positive** class, usually the rare or important one (here: malignant tumour). Every prediction then falls into one of four boxes:

| | Predicted positive | Predicted negative |
|---|---|---|
| **Actually positive** | **True positive (TP)**: correctly caught | **False negative (FN)**: a miss |
| **Actually negative** | **False positive (FP)**: a false alarm | **True negative (TN)**: correctly cleared |

The **confusion matrix** is this table of counts:

```python
from sklearn.metrics import confusion_matrix

print(confusion_matrix(y_test, pred))
# [[103   4]      row 0 = actually negative: 103 TN, 4 FP
#  [  4  60]]     row 1 = actually positive:   4 FN, 60 TP
```

In scikit-learn the rows are the **true** classes and the columns the **predicted** classes, ordered 0 then 1. So the top-left is true negatives and the bottom-right is true positives. A good model has big numbers on the diagonal and small ones off it. Here: 4 malignant tumours were missed (FN) and 4 healthy cases were flagged (FP).

## Precision and recall

Two numbers summarise the positive class:

- **Precision** = TP / (TP + FP). "Of everything the model flagged as positive, how much really was?" High precision means few false alarms.
- **Recall** (also called sensitivity) = TP / (TP + FN). "Of all the real positives, how many did the model find?" High recall means few misses.

```python
from sklearn.metrics import precision_score, recall_score

precision_score(y_test, pred)    # 60 / (60 + 4) = 0.9375 -> 0.94
recall_score(y_test, pred)       # 60 / (60 + 4) = 0.9375 -> 0.94
```

Both functions take the true labels first. The related **F1 score** (`f1_score`) is a single number that blends precision and recall; it is high only when both are.

## The trade-off and the threshold

A classifier like logistic regression really outputs a probability, and `predict` turns it into a class using a **threshold** of 0.5: "positive if the probability is at least 0.5". You can choose a different threshold yourself:

```python
careful = (proba >= 0.2).astype(int)
```

Lowering the threshold to 0.2 means "flag a tumour even when the model is only 20 percent sure". You will catch more real cases (recall rises to 0.95, only 3 misses) but also raise more false alarms (precision falls to 0.82). Raising the threshold does the opposite. Precision and recall pull against each other, and where to set the balance depends on the cost of each mistake: for screening for a serious illness favour recall; for something like auto-deleting emails favour precision.

## Why accuracy lies

Imagine 1 transaction in 100 is fraud. A model that says "never fraud" is 99 percent accurate and catches nothing: its recall for fraud is 0. The confusion matrix and recall show it at once. Always look at them when one class is rare or when mistakes have different costs.

## The math, briefly

With the four counts: accuracy = (TP + TN) / total, precision = TP / (TP + FP), recall = TP / (TP + FN), and F1 = 2 * precision * recall / (precision + recall), the harmonic mean, which is dragged down by whichever of the two is lower.

> **Watch out:**
> - Reading the matrix the wrong way round: rows are the **true** classes, columns the **predictions**. Check which class is 1 before you interpret it.
> - Flipping the labels. Here `1` means malignant because we built `y` that way. In the raw scikit-learn dataset, malignant is 0, and `precision_score` would then measure the benign class unless you pass `pos_label=0`.
> - Passing predictions first: `recall_score(pred, y_test)` runs but swaps the meaning of precision and recall.
> - Tuning the threshold on the test set and then reporting the test score. Pick thresholds on separate validation data to avoid data leakage.
> - Forgetting scaling for logistic regression: it still works, but needs many more steps and may print a `ConvergenceWarning`.

> **Your turn:** print the confusion matrix, the precision and the recall of the model, then lower the threshold to 0.2 and print the new recall and precision.
