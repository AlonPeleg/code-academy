---
title: Functions
summary: Package code you can reuse.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # Write area(width, height) that returns width * height
      # Write is_adult(age) that returns True when age is 18 or more
      # (put the two definitions above the print lines)


      print(area(3, 4))
      print(is_adult(20))
      print(is_adult(15))
check:
  output: |
    12
    True
    False
  code:
    - { pattern: 'def\s+area\s*\(', message: "Define a function called area with def." }
    - { pattern: 'def\s+is_adult\s*\(', message: "Define a function called is_adult with def." }
    - { pattern: 'return\b', message: "Use return to send the answer back." }
hints:
  - "Each function starts with the keyword def, then its name, brackets with the parameter names, and a colon. The body is indented."
  - "def area(width, height): and on the next line, indented, return width * height. A comparison such as age >= 18 is already True or False."
  - "def area(width, height):   return width * height     def is_adult(age):   return age >= 18   (each return line is indented by 4 spaces)"
solution:
  - name: main.py
    code: |
      def area(width, height):
          return width * height


      def is_adult(age):
          return age >= 18


      print(area(3, 4))
      print(is_adult(20))
      print(is_adult(15))
quiz:
  - q: Which keyword defines a function?
    options: ["function", "func", "def"]
    answer: 2
  - q: What does  return  do?
    options: ["Prints a value", "Sends a value back to the caller", "Starts a loop"]
    answer: 1
  - q: What does  age >= 18  produce?
    options: ["A string", "The number 18", "True or False"]
    answer: 2
  - q: What does a function without a return statement give back?
    options: ["None", "0", "An error"]
    answer: 0
---

As programs grow, you will find yourself writing the same few lines again and again. A **function** is a named, reusable block of code: write it once, use it as often as you like. You have already been calling functions such as `print()` and `len()`. Now you will write your own.

## Defining a function

```python
def add(a, b):
    return a + b

result = add(2, 3)
print(result)   # prints: 5
```

Piece by piece:

- `def` tells Python you are defining a function.
- `add` is the name you choose. Use lowercase words joined by underscores, like `is_adult`.
- `(a, b)` lists the **parameters**: the inputs the function expects. They behave like variables that only exist inside the function.
- The colon `:` and the **indented** lines make up the function **body**.
- `return` hands a value back to whoever called the function.

Defining a function does not run it. The body only runs when you **call** it with values, called **arguments**: `add(2, 3)`. Those are matched to the parameters in order, so `a` is 2 and `b` is 3.

## return versus print

This is the most common confusion for beginners:

```python
def add_print(a, b):
    print(a + b)         # shows the result, then the function gives back None

def add_return(a, b):
    return a + b         # gives the result back so you can use it

total = add_return(2, 3) * 10
print(total)             # prints: 50
```

`print` is for humans reading the screen. `return` is for the rest of your program. A function that computes something should almost always `return` it. The moment Python reaches `return`, the function ends, and any lines after it are skipped. A function without `return` gives back `None`.

## Functions can return anything

A comparison like `age >= 18` is itself a value (`True` or `False`), so you can return it directly without an `if`:

```python
def is_adult(age):
    return age >= 18
```

Functions can also call other functions, take no parameters at all, and return text, lists or dictionaries.

## Order matters

Python reads top to bottom, so a function must be defined **before** the line that calls it:

```python
print(double(4))      # NameError: name 'double' is not defined
def double(n):
    return n * 2
```

> **Watch out:**
> - Forgetting the colon after the brackets gives `SyntaxError: expected ':'`.
> - Forgetting to indent the body gives `IndentationError: expected an indented block after function definition`.
> - Wrong number of arguments: calling `add(1)` gives `TypeError: add() missing 1 required positional argument: 'b'`.
> - Writing the function name without brackets, like `print(area)`, does not call it. It prints something like `<function area at 0x...>`.
> - Using `print` instead of `return` shows the value but gives `None` to the caller, so `area(3, 4) + 1` fails.

> **Your turn:** write `area` and `is_adult` above the print lines so that the three `print` calls show `12`, `True` and `False`.
