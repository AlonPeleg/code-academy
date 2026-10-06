---
title: Strings and text methods
summary: Combine, measure and transform text with f-strings and string methods.
level: beginner
runner: python
stdin: |
  ada lovelace
files:
  - name: main.py
    code: |
      full_name = input()

      # 1. Save the name in Title Case in a new variable and print it:  Ada Lovelace
      # 2. Print that name in UPPER CASE:                                ADA LOVELACE
      # 3. Print how many characters it has:                             12
      # 4. Print it with "Ada" swapped for "Augusta":                    Augusta Lovelace
      # 5. Print its first letter:                                       A
      # 6. Print a greeting using an f-string:                           Hello, Ada Lovelace!
check:
  output: |
    Ada Lovelace
    ADA LOVELACE
    12
    Augusta Lovelace
    A
    Hello, Ada Lovelace!
  code:
    - { pattern: '\.title\s*\(', message: "Use the .title() method." }
    - { pattern: '\.upper\s*\(', message: "Use the .upper() method." }
    - { pattern: 'len\s*\(', message: "Use len() to count characters." }
    - { pattern: '\.replace\s*\(', message: "Use the .replace() method." }
    - { pattern: 'f["'']', message: "Use an f-string for the last line." }
hints:
  - "Strings have built-in actions called methods, written with a dot after the string: text.method(). First save the Title Case version in a variable so you can reuse it."
  - "The methods you need are title, upper, replace and the len function. A single letter is picked with square brackets and an index, and index 0 is the first character."
  - "nice = full_name.title()   print(nice)   print(nice.upper())   print(len(nice))   print(nice.replace(\"Ada\", \"Augusta\"))   print(nice[0])   print(f\"Hello, {nice}!\")"
solution:
  - name: main.py
    code: |
      full_name = input()

      nice = full_name.title()
      print(nice)
      print(nice.upper())
      print(len(nice))
      print(nice.replace("Ada", "Augusta"))
      print(nice[0])
      print(f"Hello, {nice}!")
quiz:
  - q: What does  "abc".upper()  return?
    options: ["abc", "Abc", "ABC"]
    answer: 2
  - q: What does  len("hello")  return?
    options: ["5", "4", "6"]
    answer: 0
  - q: What is  "python"[0] ?
    options: ["y", "p", "n"]
    answer: 1
    explain: Counting starts at 0, so index 0 is the first character.
  - q: Can you change a character inside a string, like  word[0] = "X" ?
    options: ["Yes, always", "Only for short strings", "No, strings are immutable"]
    answer: 2
    explain: Strings cannot be changed in place. Methods like replace() give you a new string instead.
---

Text is everywhere: names, messages, passwords, web pages. Python calls a piece of text a **string**, and it comes with a toolbox of ready-made actions for working with it.

## Creating strings

Use single or double quotes, whichever you like, as long as you close with the same kind:

```python
word = "python"
other = 'it\'s fine'      # \' puts a quote inside the text
print(word)               # prints: python
```

You can **join** strings with `+` and **repeat** them with `*`:

```python
print("Hello, " + "world")   # prints: Hello, world
print("ha" * 3)              # prints: hahaha
```

## Length and indexes

`len()` tells you how many characters a string has (spaces count too). Each character has a position called an **index**, and the first index is **0**, not 1:

```python
word = "python"
print(len(word))     # prints: 6
print(word[0])       # prints: p
print(word[1])       # prints: y
print(word[-1])      # prints: n   (negative numbers count from the end)
```

## String methods

A **method** is a function that belongs to a value. You call it with a dot: `value.method()`.

| Method | What it does | Example | Result |
| --- | --- | --- | --- |
| `.upper()` | all capitals | `"hi".upper()` | `HI` |
| `.lower()` | all lowercase | `"HI".lower()` | `hi` |
| `.title()` | Capital Each Word | `"ada lovelace".title()` | `Ada Lovelace` |
| `.strip()` | remove spaces at both ends | `"  hi  ".strip()` | `hi` |
| `.replace(a, b)` | swap text | `"cat".replace("c", "b")` | `bat` |
| `.startswith(x)` | begins with? | `"python".startswith("py")` | `True` |
| `.find(x)` | position of x, or -1 | `"python".find("t")` | `2` |

Strings are **immutable**: a method never changes the original, it returns a new string. So you must keep the result:

```python
name = "ada"
name.upper()          # does nothing useful, the result is thrown away
name = name.upper()   # now name is "ADA"
```

## f-strings

You met f-strings already. They are the cleanest way to mix text and values, and they can format numbers too:

```python
price = 3.5
print(f"Price: {price:.2f} dollars")   # prints: Price: 3.50 dollars
```

`:.2f` means "show two digits after the decimal point".

> **Watch out:**
> - Forgetting the brackets: `name.upper` (without `()`) does not shout, it just prints something like `<built-in method upper of str object>`.
> - Asking for an index that is too big gives `IndexError: string index out of range`.
> - `word[0] = "X"` gives `TypeError: 'str' object does not support item assignment`.
> - Joining text and a number with `+`, like `"Age: " + 5`, gives `TypeError`. Use an f-string instead.

> **Your turn:** the program reads a lowercase name. Use `.title()`, `.upper()`, `len()`, `.replace()`, an index and an f-string to print the six lines shown in the comments.
