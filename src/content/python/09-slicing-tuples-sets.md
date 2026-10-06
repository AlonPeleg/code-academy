---
title: Slicing, tuples and sets
summary: Cut out parts of lists and text, and meet two more collection types.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      word = "stressed"
      point = (3, 4)
      scores = [3, 1, 3, 2, 1]

      # 1. Print the first three numbers of nums             -> [0, 1, 2]
      # 2. Print the last two numbers of nums                -> [8, 9]
      # 3. Print every second number of nums                 -> [0, 2, 4, 6, 8]
      # 4. Print word written backwards                      -> desserts
      # 5. Unpack the tuple point into x and y, print x + y  -> 7
      # 6. Print the unique scores in sorted order           -> [1, 2, 3]
check:
  output: |
    [0, 1, 2]
    [8, 9]
    [0, 2, 4, 6, 8]
    desserts
    7
    [1, 2, 3]
  code:
    - { pattern: '\[\s*:\s*3\s*\]', message: "Use a slice with an empty start for question 1." }
    - { pattern: '\[\s*:\s*:\s*-1\s*\]', message: "Use a step of -1 to reverse the word." }
    - { pattern: '\bset\s*\(', message: "Use set() to remove duplicates." }
hints:
  - "Slices use square brackets with colons: [start:stop:step]. Leaving a part empty means 'from the beginning' or 'to the end'. A set automatically throws away duplicates."
  - "First three: nums[:3]. Last two: nums[-2:]. Every second: nums[::2]. A step of -1 walks backwards. Unpacking looks like x, y = point. sorted(set(scores)) gives a sorted list of unique values."
  - "print(nums[:3])   print(nums[-2:])   print(nums[::2])   print(word[::-1])   x, y = point   print(x + y)   print(sorted(set(scores)))"
solution:
  - name: main.py
    code: |
      nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      word = "stressed"
      point = (3, 4)
      scores = [3, 1, 3, 2, 1]

      print(nums[:3])
      print(nums[-2:])
      print(nums[::2])
      print(word[::-1])
      x, y = point
      print(x + y)
      print(sorted(set(scores)))
quiz:
  - q: What does  [10, 20, 30, 40][1:3]  give?
    options: ["[10, 20, 30]", "[20, 30]", "[20, 30, 40]"]
    answer: 1
    explain: A slice starts at the first index and stops BEFORE the second one.
  - q: What does  "hello"[::-1]  give?
    options: ["olleh", "hello", "h"]
    answer: 0
  - q: What is special about a tuple?
    options: ["It can hold only numbers", "It cannot be changed after it is created", "It keeps items sorted"]
    answer: 1
  - q: What does  set([1, 1, 2, 2])  contain?
    options: ["1, 1, 2, 2", "Only 1", "1 and 2"]
    answer: 2
---

You already know how to grab one item with an index. Slicing lets you grab a whole range in one go. In this lesson you will also meet two more kinds of collection: tuples and sets.

## Slicing

A slice has the form `[start:stop:step]`. It begins at `start`, goes up to but **not including** `stop`, and moves by `step`. Every part is optional.

```python
nums = [10, 20, 30, 40, 50]
print(nums[1:3])     # prints: [20, 30]
print(nums[:2])      # prints: [10, 20]      (from the beginning)
print(nums[3:])      # prints: [40, 50]      (to the end)
print(nums[-2:])     # prints: [40, 50]      (the last two)
print(nums[::2])     # prints: [10, 30, 50]  (every second item)
print(nums[::-1])    # prints: [50, 40, 30, 20, 10]  (backwards)
```

The same works for text, because a string is a sequence of characters:

```python
word = "python"
print(word[:2])      # prints: py
print(word[2:])      # prints: thon
print(word[::-1])    # prints: nohtyp
```

A slice always gives you a **new** list or string and never raises an error for being too long. `nums[3:100]` simply stops at the end.

## Tuples

A **tuple** is like a list that cannot be changed. It is written with round brackets:

```python
point = (3, 4)
print(point[0])      # prints: 3
# point[0] = 9       # TypeError: 'tuple' object does not support item assignment
```

Tuples are ideal for small fixed groups, such as coordinates or a (name, age) pair. You can **unpack** them into separate variables in one line:

```python
x, y = point
print(x)             # prints: 3
print(y)             # prints: 4
```

The same trick swaps two variables: `a, b = b, a`.

## Sets

A **set** is a collection with no duplicates and no particular order. It uses curly braces or `set(...)`:

```python
scores = [3, 1, 3, 2, 1]
unique = set(scores)
print(sorted(unique))      # prints: [1, 2, 3]
print(2 in unique)         # prints: True   (very fast lookup)
unique.add(7)
```

`sorted()` turns any collection into a sorted list. Sets also support math-like operations: `a & b` (in both), `a | b` (in either), `a - b` (in a but not b).

| Type | Brackets | Ordered | Changeable | Duplicates |
| --- | --- | --- | --- | --- |
| list | `[ ]` | yes | yes | yes |
| tuple | `( )` | yes | no | yes |
| set | `{ }` | no | yes | no |
| dict | `{k: v}` | yes | yes | keys unique |

> **Watch out:**
> - `{}` on its own creates an empty **dict**, not a set. Use `set()` for an empty set.
> - A one-item tuple needs a trailing comma: `(5,)`. Without it, `(5)` is just the number 5.
> - Unpacking needs matching counts: `a, b = (1, 2, 3)` gives `ValueError: too many values to unpack`.
> - Sets have no index, so `my_set[0]` gives `TypeError: 'set' object is not subscriptable`.

> **Your turn:** use slices, tuple unpacking and a set to print the six results listed in the comments.
