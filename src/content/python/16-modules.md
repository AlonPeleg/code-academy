---
title: Modules and the standard library
summary: Import ready-made tools such as math, random and datetime.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # Use import to bring in tools, then print:
      # 1. the square root of 144                          -> 12.0
      # 2. pi rounded to 3 decimals                        -> 3.142
      # 3. the date 2024-03-15 plus 30 days (use datetime) -> 2024-04-14
      # 4. a random whole number from 1 to 100, after seeding the
      #    random generator with 42, so everyone gets the same one -> 82
      # 5. the weekday name of 2024-03-15                  -> Friday
check:
  output: |
    12.0
    3.142
    2024-04-14
    82
    Friday
  code:
    - { pattern: '\bimport\b', message: "Use import to load the modules." }
    - { pattern: 'math\.sqrt\s*\(|from\s+math\s+import[^\n]*\bsqrt', message: "Use math.sqrt for the square root." }
    - { pattern: 'random\.seed\s*\(\s*42\s*\)|seed\s*\(\s*42\s*\)', message: "Seed the generator with 42 before using it." }
    - { pattern: 'timedelta', message: "Use timedelta to add days." }
hints:
  - "A module is a file of ready-made tools. Bring one in with import, then use its tools with a dot: math.sqrt(...)."
  - "You need three modules: math (sqrt, pi), random (seed, randint) and datetime (date, timedelta). Seeding with the same number first makes the random result repeatable. Format a date with .strftime(\"%A\") for the weekday name."
  - "import math, random   from datetime import date, timedelta   print(math.sqrt(144))   print(round(math.pi, 3))   d = date(2024, 3, 15)   print(d + timedelta(days=30))   random.seed(42)   print(random.randint(1, 100))   print(d.strftime(\"%A\"))"
solution:
  - name: main.py
    code: |
      import math
      import random
      from datetime import date, timedelta

      print(math.sqrt(144))
      print(round(math.pi, 3))

      d = date(2024, 3, 15)
      print(d + timedelta(days=30))

      random.seed(42)
      print(random.randint(1, 100))

      print(d.strftime("%A"))
quiz:
  - q: What does  import math  do?
    options: ["Makes Python faster", "Does the math homework", "Lets you use the tools of the math module, like math.sqrt"]
    answer: 2
  - q: Why call  random.seed(42)  before generating random numbers?
    options: ["It makes the results repeatable every run", "It makes numbers bigger", "It is required by Python"]
    answer: 0
  - q: What is the difference between  import math  and  from math import sqrt ?
    options: ["There is none", "The second lets you write sqrt(...) without the math. prefix", "The first only works for numbers"]
    answer: 1
  - q: What does  random.randint(1, 6)  return?
    options: ["A whole number from 1 to 6, both included", "A whole number from 1 to 5", "A decimal between 1 and 6"]
    answer: 0
---

Python comes with a huge toolbox called the **standard library**: hundreds of ready-made modules for math, dates, random numbers, files, the internet and more. You do not have to write everything from scratch. You only need to know how to import what you need.

## What is a module?

A **module** is simply a Python file full of functions and values that you can reuse. The `import` statement loads one:

```python
import math

print(math.sqrt(16))    # prints: 4.0
print(math.pi)          # prints: 3.141592653589793
print(math.floor(2.7))  # prints: 2
print(math.ceil(2.1))   # prints: 3
```

After `import math` the tools are reached with a dot: `math.sqrt`. The module name acts as a prefix, which keeps things tidy and prevents name clashes.

You can also import specific names directly:

```python
from math import sqrt, pi
print(sqrt(25))         # prints: 5.0
```

Now no prefix is needed. Use whichever is clearer in your code.

## random

The `random` module produces pseudo-random numbers:

```python
import random

print(random.randint(1, 6))          # a whole number 1 to 6 (both included)
print(random.choice(["a", "b", "c"]))  # one item from a list
items = [1, 2, 3]
random.shuffle(items)                # shuffles the list in place
```

Computers cannot truly be random; they follow a formula that starts from a **seed**. If you set the seed yourself, the "random" numbers come out in the same order every time, which is perfect for tests and for exercises like this one:

```python
random.seed(42)
print(random.randint(1, 100))   # always the same number for seed 42
```

Without a seed, Python picks a different starting point on every run.

## datetime

Dates are surprisingly tricky, so use the module built for them:

```python
from datetime import date, timedelta

d = date(2024, 3, 15)
print(d)                                  # prints: 2024-03-15
print(d.year)                             # prints: 2024
print(d + timedelta(days=30))             # prints: 2024-04-14
print(d.strftime("%A"))                   # prints: Friday
print(d.strftime("%d/%m/%Y"))             # prints: 15/03/2024
```

`timedelta` is a length of time you can add or subtract. `strftime` ("string format time") turns a date into text using codes such as `%A` (weekday name), `%d` (day), `%m` (month) and `%Y` (year). `date.today()` gives the current date, but its result changes every day, so avoid it in exercises with a fixed answer.

## Finding more

Other handy modules: `statistics` (mean, median), `string` (letters and digits), `collections` (Counter), `json` (read and write JSON) and `time`. Type `import this` for a small surprise. Python also has a huge library of third-party packages, but the standard library is already enough for a lot.

> **Watch out:**
> - Using a module without importing it gives `NameError: name 'math' is not defined`.
> - Misspelling a tool, like `math.squareroot(9)`, gives `AttributeError: module 'math' has no attribute 'squareroot'`.
> - Never name your own file `random.py` or `math.py`: it would shadow the real module.
> - `math.sqrt(-1)` raises `ValueError: math domain error`.
> - `randint(1, 6)` includes both ends, but `range(1, 6)` does not include 6.

> **Your turn:** print the five results listed in the comments using `math`, `random` (seeded with 42) and `datetime`.
