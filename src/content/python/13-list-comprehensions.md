---
title: List comprehensions
summary: Build new lists from old ones in a single readable line.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      words = ["apple", "kiwi", "banana", "fig"]

      # Use list comprehensions (one line each) to build these lists, then print them:
      # 1. squares:    every number of nums squared                  -> [1, 4, 9, ..., 100]
      # 2. evens:      only the even numbers of nums                 -> [2, 4, 6, 8, 10]
      # 3. lengths:    the length of every word                      -> [5, 4, 6, 3]
      # 4. shouting:   uppercase versions of the words that have
      #                more than 4 letters                           -> ['APPLE', 'BANANA']
check:
  output: |
    [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
    [2, 4, 6, 8, 10]
    [5, 4, 6, 3]
    ['APPLE', 'BANANA']
  code:
    - { pattern: '\[[^\]\n]+\bfor\s+\w+\s+in\s+nums\s*\]', message: "Build squares with [... for n in nums]." }
    - { pattern: '\[[^\]\n]+\bfor\s+\w+\s+in\s+nums\s+if\s+[^\]\n]+\]', message: "Build evens with a comprehension that has an if filter." }
    - { pattern: '\[[^\]\n]+\bfor\s+\w+\s+in\s+words\s+if\s+[^\]\n]+\]', message: "Build shouting with a comprehension that has an if filter." }
hints:
  - "A comprehension is a loop written inside square brackets: [what_to_store for item in collection]. An optional if at the end filters items."
  - "Squares: [n * n for n in nums]. Evens add a filter at the end: [n for n in nums if n % 2 == 0]. For the words, store len(w) or w.upper()."
  - "squares = [n * n for n in nums]   evens = [n for n in nums if n % 2 == 0]   lengths = [len(w) for w in words]   shouting = [w.upper() for w in words if len(w) > 4]"
solution:
  - name: main.py
    code: |
      nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      words = ["apple", "kiwi", "banana", "fig"]

      squares = [n * n for n in nums]
      evens = [n for n in nums if n % 2 == 0]
      lengths = [len(w) for w in words]
      shouting = [w.upper() for w in words if len(w) > 4]

      print(squares)
      print(evens)
      print(lengths)
      print(shouting)
quiz:
  - q: What does  [n * 2 for n in [1, 2, 3]]  produce?
    options: ["[1, 2, 3]", "[2, 4, 6]", "6"]
    answer: 1
  - q: Where does the filter go in  [n for n in nums ___ ] ?
    options: ["At the very start", "Before the word for", "At the end, as  if condition"]
    answer: 2
  - q: What does  [c for c in "hey"]  give?
    options: ["['h', 'e', 'y']", "'hey'", "3"]
    answer: 0
  - q: Which is a normal loop equivalent of  [x + 1 for x in nums] ?
    options: ["Start with an empty list, loop over nums, and append x + 1 each time", "Loop over nums and print x + 1 only", "Sort nums and add 1"]
    answer: 0
---

A very common job is "take this list and make a new list from it": square every number, keep only the long words, pull a field out of every record. You could do it with a `for` loop and `append`, but Python has a shorter, very popular shape for it: the **list comprehension**.

## From loop to comprehension

The loop way:

```python
nums = [1, 2, 3, 4]
squares = []
for n in nums:
    squares.append(n * n)
print(squares)       # prints: [1, 4, 9, 16]
```

The same thing in one line:

```python
squares = [n * n for n in nums]
print(squares)       # prints: [1, 4, 9, 16]
```

Read it from left to right as an English sentence: "make a list of `n * n` for each `n` in `nums`". The parts are:

1. `[` `]` the new list.
2. `n * n` the **expression**: what to store for each item.
3. `for n in nums` the loop that supplies the items.

## Filtering with if

Add `if condition` at the end to keep only some items:

```python
nums = [1, 2, 3, 4, 5, 6]
evens = [n for n in nums if n % 2 == 0]
print(evens)         # prints: [2, 4, 6]
```

Here the expression is just `n` (store the item itself), and the `if` decides which ones survive.

You can combine transformation and filter:

```python
words = ["apple", "kiwi", "banana"]
print([w.upper() for w in words if len(w) > 4])   # prints: ['APPLE', 'BANANA']
```

## Other sources

Anything you can loop over works, such as text or `range`:

```python
print([c for c in "hey"])            # prints: ['h', 'e', 'y']
print([i * 10 for i in range(1, 4)]) # prints: [10, 20, 30]
```

Dictionaries have a sibling syntax too: `{w: len(w) for w in words}` builds a dict.

## When not to use one

Comprehensions shine for short, simple transformations. If you need several steps, nested ifs or print statements, a normal `for` loop is clearer. Readability beats cleverness.

> **Watch out:**
> - Putting the filter in the wrong place: `[n if n > 2 for n in nums]` is a `SyntaxError`. The filter goes at the end.
> - A comprehension builds a **new** list and leaves the original alone.
> - Forgetting that `print` returns `None`: `[print(n) for n in nums]` works but builds a useless list of `None`. Use a normal loop to print.
> - A variable inside the comprehension (`n`) does not leak out and is not available afterwards: you would see `NameError`.

> **Your turn:** build `squares`, `evens`, `lengths` and `shouting` with one-line list comprehensions and print each list.
