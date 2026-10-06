---
title: Hello, Python
summary: Print text and do some arithmetic.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # 1. Print: Hello, Python!
      # 2. Print the result of adding two and three
check:
  output: |
    Hello, Python!
    5
  code:
    - { pattern: 'print\s*\(', message: "Use the print() function." }
hints:
  - "You need the print() function twice: once for the text and once for the sum."
  - 'Text goes inside quotes, like print("Hello"). A calculation does not need quotes, like print(7 * 6).'
  - 'Write print("Hello, Python!") on one line and print(2 + 3) on the next.'
solution:
  - name: main.py
    code: |
      print("Hello, Python!")
      print(2 + 3)
quiz:
  - q: Which function shows text on the screen?
    options: ["show()", "print()", "echo()"]
    answer: 1
  - q: What starts a comment in Python?
    options: ["//", "--", "#"]
    answer: 2
    explain: Python ignores everything after a # on the same line.
  - q: What does  print(2 + 3)  output?
    options: ["2 + 3", "23", "5"]
    answer: 2
  - q: What happens if you write  print("Hello)  with a missing closing quote?
    options: ["It prints Hello", "Python shows a SyntaxError", "It prints nothing and no error"]
    answer: 1
---

Python is one of the most popular languages in the world. It is famous for code that reads almost like English, and it is used for websites, data science, automation and AI. In this first lesson you will write your very first program and make the computer talk back.

## Your first line of code

The tool for showing something on the screen is `print`:

```python
print("Hello!")
```

Let's take it apart piece by piece:

- `print` is the name of a **function**, a ready-made action. This one means "show this on the screen".
- The round brackets `( )` hold what you hand to the function. Whatever is inside is called the **argument**.
- `"Hello!"` is **text** (programmers say **string**). Strings must be wrapped in quotes, either `"double"` or `'single'`.

Run it and you will see `Hello!` appear in the output panel. The very first run can take a few seconds, because Python itself is being loaded into your browser.

## Programs run top to bottom

Python reads your file one line at a time, starting from the top. Every `print` writes its own line:

```python
print("First")
print("Second")
```

```text
First
Second
```

## Doing math

Numbers do not need quotes, and Python can calculate them for you:

```python
print(2 + 3)      # prints: 5
print(10 - 4)     # prints: 6
print(6 * 7)      # prints: 42
print(9 / 2)      # prints: 4.5
```

The text after a `#` is a **comment**. Python ignores it completely, so you can use comments to leave notes for yourself and for other people.

Compare these two lines carefully:

```python
print(2 + 3)      # prints: 5
print("2 + 3")    # prints: 2 + 3
```

With quotes it is just text, so Python shows it exactly as written. Without quotes it is a calculation, so Python works out the answer first.

> **Watch out:**
> - Forgetting the closing quote, as in `print("Hello)`, gives `SyntaxError: unterminated string literal`.
> - Python is case-sensitive. `Print("Hi")` fails with `NameError: name 'Print' is not defined`. It must be a lowercase `print`.
> - Forgetting a bracket, as in `print("Hi"`, gives `SyntaxError: '(' was never closed`.
> - Curly "smart" quotes copied from a document are not real quotes. Type straight quotes `"`.

## Going further

Try printing your own name, or a calculation like `print(365 * 24)` to see how many hours are in a year. You can also print several things in one go by separating them with commas: `print("Total:", 2 + 3)` prints `Total: 5`.

> **Your turn:** print the text `Hello, Python!` on the first line, and then print the result of `2 + 3` on the second line.
