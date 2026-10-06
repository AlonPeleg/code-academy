---
title: Variables and input
summary: Store values and ask the user for input.
level: beginner
runner: python
stdin: |
  Ava
  20
files:
  - name: main.py
    code: |
      # 1. Read the user's name with the input function and store it in a variable
      # 2. Read their age the same way and convert it to a whole number (int)
      # 3. Print: Hello, <name>! Next year you will be <age + 1>.
      # (use an f-string for the message)
check:
  output: "Hello, Ava! Next year you will be 21."
  code:
    - { pattern: 'input\s*\(', message: "Use input() to read the values." }
    - { pattern: 'int\s*\(', message: "Convert the age to a number with int()." }
hints:
  - "Store each answer in a variable, e.g. name = input(). The age must be turned into a number before you can add 1."
  - 'Use age = int(input()) for the age. For the message, start the string with an f like f"..." and put variables inside curly braces.'
  - 'name = input()   age = int(input())   print(f"Hello, {name}! Next year you will be {age + 1}.")'
solution:
  - name: main.py
    code: |
      name = input()
      age = int(input())
      print(f"Hello, {name}! Next year you will be {age + 1}.")
quiz:
  - q: What type does input() always return?
    options: ["A number", "A boolean", "A string"]
    answer: 2
    explain: Even if the user types 20, you get the text "20". Use int() to convert it.
  - q: What does an f-string let you do?
    options: ["Make text run faster", "Put variables and expressions inside text with {braces}", "Format a file"]
    answer: 1
  - q: After  x = 5  and then  x = x + 1  what is x?
    options: ["6", "5", "51"]
    answer: 0
  - q: What does  int("7") + 1  give?
    options: ["71", "An error", "8"]
    answer: 2
---

Programs become useful when they can remember things and react to what a person types. In this lesson you will learn about variables, which store values, and `input()`, which asks the user a question.

## Variables

A **variable** is a name that points to a value, a little like a labelled box. You create one by assigning with a single `=`:

```python
city = "Haifa"
score = 10
print(city)     # prints: Haifa
print(score)    # prints: 10
```

The `=` here does not mean "equals" like in math. It means "store the value on the right under the name on the left". That is why this is perfectly fine:

```python
score = score + 5
```

Python first works out `score + 5` using the old value, then stores the result back in `score`.

Naming rules: use letters, digits and underscores, never start with a digit, and prefer descriptive lowercase names such as `total_price`. Spaces are not allowed.

## Reading input

`input()` pauses the program, waits for the person to type a line, and gives you what they typed:

```python
name = input()
print(name)
```

Important: `input()` **always returns text**, even when the person types digits. The text `"20"` is not the number `20`, so you cannot do math with it yet. Convert it with `int()` for whole numbers or `float()` for decimals:

```python
age = int(input())
print(age + 1)
```

On the **Input** tab below the editor you can type what the program should read, one line per `input()` call. This lesson already has `Ava` and `20` filled in. In these exercises call `input()` with nothing inside the brackets.

## f-strings

An **f-string** is a string that starts with the letter `f` before the opening quote. Anything inside `{curly braces}` is replaced by its value, and you can even do math in there:

```python
city = "Haifa"
score = 10
print(f"{city} has score {score}")          # prints: Haifa has score 10
print(f"Double the score is {score * 2}")   # prints: Double the score is 20
```

> **Watch out:**
> - Doing math on text fails: `"20" + 1` gives `TypeError: can only concatenate str (not "int") to str`. Convert with `int()` first.
> - Typing a non-number into `int()` gives `ValueError: invalid literal for int() with base 10`.
> - Forgetting the `f` in front of the quote prints the braces literally: `"Hi {name}"` shows `Hi {name}`.
> - Using a name before you created it gives `NameError: name 'x' is not defined`.

> **Your turn:** read a name and an age, then print `Hello, Ava! Next year you will be 21.` using an f-string.
