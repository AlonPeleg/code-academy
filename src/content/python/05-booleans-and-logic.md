---
title: Booleans and logic
summary: Compare values and combine questions with and, or, not and in.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      age = 17
      has_ticket = True
      is_vip = False

      # Print the answer (a boolean) to each question, one per line:
      # 1. Does the visitor have a ticket, together with being at least 18 years old?
      # 2. Is the visitor outside the VIP group? (flip the value of is_vip)
      # 3. Is at least one of these true: the visitor is a VIP, the visitor is younger than 18?
      # 4. Is the age from 13 up to 19, ends included? Use one chained comparison.
      # 5. Is the text "Python" equal to the text "python"?
      # 6. Does the text "python" contain the text "py"?
check:
  output: |
    False
    True
    True
    True
    False
    True
  code:
    - { pattern: '\band\b', message: "Use and for question 1." }
    - { pattern: '\bnot\b', message: "Use not for question 2." }
    - { pattern: '\bor\b', message: "Use or for question 3." }
    - { pattern: '\bin\b', message: "Use in for question 6." }
hints:
  - "Every question is a True/False value. Comparisons like age >= 18 produce one, and and / or / not combine them."
  - "Question 1 combines two things with and, question 2 uses not, question 3 uses or. A chained comparison looks like 13 <= age <= 19. Text contains is checked with the word in."
  - 'print(has_ticket and age >= 18)   print(not is_vip)   print(is_vip or age < 18)   print(13 <= age <= 19)   print("Python" == "python")   print("py" in "python")'
solution:
  - name: main.py
    code: |
      age = 17
      has_ticket = True
      is_vip = False

      print(has_ticket and age >= 18)
      print(not is_vip)
      print(is_vip or age < 18)
      print(13 <= age <= 19)
      print("Python" == "python")
      print("py" in "python")
quiz:
  - q: What does  True and False  evaluate to?
    options: ["True", "False", "An error"]
    answer: 1
  - q: Which operator checks whether two values are equal?
    options: ["=", "==", "=>"]
    answer: 1
    explain: A single = assigns a value to a variable. A double == compares.
  - q: What does  not (5 > 3)  give?
    options: ["True", "5", "False"]
    answer: 2
  - q: What does  "a" in "cat"  give?
    options: ["True", "False", "1"]
    answer: 0
---

Every decision a program makes comes down to a question with a yes-or-no answer. Python has a special type for such answers, called a **boolean**, which has exactly two values: `True` and `False`. Both start with a capital letter.

## Comparison operators

A comparison asks a question and gives back a boolean:

| Operator | Question | Example | Result |
| --- | --- | --- | --- |
| `==` | equal? | `3 == 3` | `True` |
| `!=` | not equal? | `3 != 3` | `False` |
| `<` | smaller? | `2 < 5` | `True` |
| `>` | bigger? | `2 > 5` | `False` |
| `<=` | smaller or equal? | `5 <= 5` | `True` |
| `>=` | bigger or equal? | `4 >= 5` | `False` |

```python
age = 17
print(age >= 18)   # prints: False
print(age == 17)   # prints: True
```

Memorise this one: a single `=` **stores** a value, a double `==` **asks** whether two values are equal.

## Combining questions: and, or, not

- `a and b` is `True` only when **both** are true.
- `a or b` is `True` when **at least one** is true.
- `not a` flips the answer.

```python
has_ticket = True
age = 17
print(has_ticket and age >= 18)   # prints: False (the second part fails)
print(has_ticket or age >= 18)    # prints: True  (the first part is enough)
print(not has_ticket)             # prints: False
```

You can use round brackets to group, just like in math: `(a or b) and c`.

## Chained comparisons and the in operator

Python lets you write a range test the way you would in math class:

```python
age = 17
print(13 <= age <= 19)   # prints: True
```

The word `in` checks whether something is inside something else:

```python
print("py" in "python")        # prints: True
print("z" in "python")         # prints: False
print(3 in [1, 2, 3])          # prints: True
```

## Comparing text

Text is compared letter by letter, and capitals are different from lowercase letters: `"Python" == "python"` is `False`. A common trick is to lowercase both sides first: `a.lower() == b.lower()`.

> **Watch out:**
> - Writing `if age = 18:` is a `SyntaxError`. Use `==` when you want to compare.
> - `true` and `false` in lowercase give `NameError: name 'true' is not defined`. Write `True` and `False`.
> - `13 <= age <= 19` works, but `age == 13 or 14` does not mean what it looks like. Write `age == 13 or age == 14`, or `age in (13, 14)`.
> - Comparing a number with text, like `5 < "7"`, gives `TypeError`.

> **Your turn:** print the answers to the six questions in the comments, one per line, using `and`, `not`, `or`, a chained comparison, `==` and `in`.
