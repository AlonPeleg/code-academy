---
title: Error handling with try and except
summary: Keep your program running when something goes wrong.
level: intermediate
runner: python
stdin: |
  10
  abc
  0
  5
files:
  - name: main.py
    code: |
      def safe_divide(text, divisor):
          # Convert text to a whole number and divide it by divisor.
          # Return the result, but:
          #  - if text is not a valid number, return "not a number"
          #  - if divisor is 0, return "cannot divide by zero"
          return int(text) / divisor


      # Read four lines. Each is divided by 2, except the third one is divided by 0.
      # (No changes needed below this line.)
      for divisor in [2, 2, 0, 2]:
          value = input()
          print(safe_divide(value, divisor))
check:
  output: |
    5.0
    not a number
    cannot divide by zero
    2.5
  code:
    - { pattern: '\btry\s*:', message: "Use a try block." }
    - { pattern: '\bexcept\s+ValueError', message: "Catch ValueError for bad numbers." }
    - { pattern: '\bexcept\s+ZeroDivisionError', message: "Catch ZeroDivisionError for dividing by zero." }
hints:
  - "Put the risky line inside a try: block. Python jumps to a matching except block as soon as an error happens inside the try."
  - "Two different things can go wrong: int(text) can raise ValueError, and the division can raise ZeroDivisionError. Write one except clause for each, naming the error."
  - "try:   return int(text) / divisor   except ValueError:   return \"not a number\"   except ZeroDivisionError:   return \"cannot divide by zero\"   (each on its own indented line)"
solution:
  - name: main.py
    code: |
      def safe_divide(text, divisor):
          try:
              return int(text) / divisor
          except ValueError:
              return "not a number"
          except ZeroDivisionError:
              return "cannot divide by zero"


      for divisor in [2, 2, 0, 2]:
          value = input()
          print(safe_divide(value, divisor))
quiz:
  - q: What happens when an error occurs inside a try block?
    options: ["The program always crashes", "Python skips to the matching except block", "The error is ignored and the try block continues"]
    answer: 1
  - q: Which error does  int("abc")  raise?
    options: ["TypeError", "NameError", "ValueError"]
    answer: 2
  - q: Which block runs only when NO error happened?
    options: ["else", "finally", "except"]
    answer: 0
  - q: "Why is a bare  except:  (with no error type) a bad habit?"
    options: ["It is slower", "It hides every kind of error, including bugs", "It is not allowed in Python"]
    answer: 1
---

Sooner or later your program will meet something unexpected: a user types letters where you wanted a number, a file is missing, a division by zero sneaks in. Without protection Python stops with a red error message (a **traceback**). With `try` and `except` you can catch the problem and decide what to do.

## try and except

```python
try:
    n = int(input())
    print(100 / n)
except ValueError:
    print("That was not a number")
except ZeroDivisionError:
    print("Cannot divide by zero")
```

How it works:

1. Python runs the lines inside `try`.
2. If everything works, the `except` blocks are skipped.
3. If an error happens, Python **immediately** stops the `try` block (the remaining lines in it do not run) and looks for an `except` that names that kind of error.
4. If none matches, the error is not caught and the program crashes as usual.

## Common error types

| Error | When it happens |
| --- | --- |
| `ValueError` | right type, wrong value: `int("abc")` |
| `TypeError` | wrong type: `"5" + 2` |
| `ZeroDivisionError` | dividing by 0 |
| `IndexError` | list index too large: `[1, 2][5]` |
| `KeyError` | missing dictionary key: `{}["x"]` |
| `NameError` | using a name that does not exist |
| `FileNotFoundError` | opening a file that is not there |

The error message tells you exactly which type you got, for instance `ValueError: invalid literal for int() with base 10: 'abc'`. Read the last line of a traceback first.

## else and finally

```python
try:
    n = int("42")
except ValueError:
    print("bad")
else:
    print("worked:", n)       # runs only when there was NO error
finally:
    print("always runs")      # runs in every case
```

## Getting the error object

```python
try:
    int("abc")
except ValueError as err:
    print("Problem:", err)
```

## Raising your own errors

You can trigger an error yourself with `raise` when your function receives something it cannot work with:

```python
def set_age(age):
    if age < 0:
        raise ValueError("age cannot be negative")
    return age
```

## Be specific

Catch the **specific** errors you expect. A bare `except:` hides everything, including genuine typos in your own code, which makes bugs very hard to find. Also keep the `try` block small: only the lines that might fail.

> **Watch out:**
> - Forgetting the error type (`except:`) catches things you never meant to catch.
> - Putting too much inside `try` makes it unclear which line failed.
> - `except` must line up with `try`, otherwise `SyntaxError: invalid syntax`.
> - Order matters: put a specific error before a more general one such as `Exception`, because the first matching `except` wins.

> **Your turn:** make `safe_divide` return `"not a number"` for text such as `abc` and `"cannot divide by zero"` when the divisor is `0`, using `try` with two `except` blocks.
