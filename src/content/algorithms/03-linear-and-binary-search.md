---
title: Linear and binary search
summary: Find an item by checking one by one, or by halving a sorted list again and again.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # linear_search is finished for you. It returns (index, steps).
      def linear_search(items, target):
          steps = 0
          for i in range(len(items)):
              steps += 1
              if items[i] == target:
                  return i, steps
          return -1, steps


      # Write binary_search(items, target). The list is SORTED.
      # Return (index, steps), or (-1, steps) when the target is missing.
      #
      # 1. Keep two positions: low (start at 0) and high (start at the last index).
      # 2. Loop while low <= high.
      # 3. Count one step, then look at the middle position: mid = (low + high) // 2
      # 4. Found it: return mid and the steps.
      #    Middle value too small: search the right half (low = mid + 1).
      #    Middle value too big: search the left half (high = mid - 1).
      # 5. If the loop ends, the target is missing: return -1 and the steps.
      def binary_search(items, target):
          pass


      evens = list(range(0, 200, 2))      # 0, 2, 4 ... 198
      big = list(range(1000000))          # one million numbers

      print("linear:", linear_search(evens, 150))
      print("binary:", binary_search(evens, 150))
      print("missing:", binary_search(evens, 151))
      print("empty:", binary_search([], 5))
      print("million:", binary_search(big, 999999))
check:
  output: |
    linear: (75, 76)
    binary: (75, 6)
    missing: (-1, 7)
    empty: (-1, 0)
    million: (999999, 20)
  code:
    - { pattern: '\bwhile\b', message: "Use a while loop that narrows low and high." }
    - { pattern: '//', message: "Use // to find the middle position." }
    - { pattern: '^(?![\s\S]*(bisect|\.index\s*\())', message: "Do not use bisect or .index(). Write the search yourself." }
hints:
  - "Binary search keeps a window [low, high]. Each round you look at the middle of the window and throw away the half that cannot contain the target."
  - "low = 0 and high = len(items) - 1. while low <= high: steps += 1, mid = (low + high) // 2, then compare items[mid] with target using if / elif / else."
  - "while low <= high:   steps += 1   mid = (low + high) // 2   if items[mid] == target: return mid, steps   elif items[mid] < target: low = mid + 1   else: high = mid - 1      and after the loop: return -1, steps"
solution:
  - name: main.py
    code: |
      def linear_search(items, target):
          steps = 0
          for i in range(len(items)):
              steps += 1
              if items[i] == target:
                  return i, steps
          return -1, steps


      def binary_search(items, target):
          low = 0
          high = len(items) - 1
          steps = 0
          while low <= high:
              steps += 1
              mid = (low + high) // 2
              if items[mid] == target:
                  return mid, steps
              elif items[mid] < target:
                  low = mid + 1
              else:
                  high = mid - 1
          return -1, steps


      evens = list(range(0, 200, 2))      # 0, 2, 4 ... 198
      big = list(range(1000000))          # one million numbers

      print("linear:", linear_search(evens, 150))
      print("binary:", binary_search(evens, 150))
      print("missing:", binary_search(evens, 151))
      print("empty:", binary_search([], 5))
      print("million:", binary_search(big, 999999))
quiz:
  - q: "What must be true about a list before binary search works on it?"
    options: ["It must contain only numbers", "It must be sorted", "It must have an even length"]
    answer: 1
  - q: "Roughly how many steps does binary search need for 1,000,000 sorted items?"
    options: ["About 500,000", "About 1,000", "About 20"]
    answer: 2
    explain: "Each step halves the window, and a million halves down to 1 in about 20 steps."
  - q: "In binary search the middle item is smaller than the target. What do you do?"
    options: ["Search the right half by setting low = mid + 1", "Search the left half by setting high = mid - 1", "Stop and return -1"]
    answer: 0
  - q: "What is the worst-case number of steps of linear search on n items?"
    options: ["log n", "n", "1"]
    answer: 1
    explain: "If the item is last or missing, linear search looks at all n items."
---

Almost every program has to find things: a contact in a phone book, a product in a catalogue, a word in a dictionary. In this lesson you will meet the two classic ways to search a list and see, with real numbers, why one of them is astonishingly fast.

## Linear search: look at everything

**Linear search** is what you do with a messy pile of papers: check them one by one until you find the one you want.

```python
def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i          # found: return the position
    return -1                 # not found

print(linear_search([7, 3, 9, 4], 9))   # prints: 2
print(linear_search([7, 3, 9, 4], 5))   # prints: -1
```

Returning `-1` for "not found" is a common convention, because `-1` can never be a real index. Linear search works on any list, sorted or not. Its cost is **O(n)**: in the worst case (item last, or missing) it looks at all `n` items.

## Binary search: halve the problem

Think of the number guessing game. I pick a number between 1 and 100. You guess 50. I say "higher". You now know the answer is in 51 to 100, and you just threw away half of the possibilities with one question. Guess 75, "lower", and half again. You need at most 7 guesses for 100 numbers.

That is **binary search**. It has one big requirement: **the list must be sorted**. Then you can always look in the middle and discard the half that cannot contain the target.

```text
find 150 in [0, 2, 4, ... 198]   (100 items, positions 0 to 99)

round 1: low=0  high=99  mid=49  items[49]=98   too small -> low = 50
round 2: low=50 high=99  mid=74  items[74]=148  too small -> low = 75
round 3: low=75 high=99  mid=87  items[87]=174  too big   -> high = 86
round 4: low=75 high=86  mid=80  items[80]=160  too big   -> high = 79
round 5: low=75 high=79  mid=77  items[77]=154  too big   -> high = 76
round 6: low=75 high=76  mid=75  items[75]=150  found!
```

Six rounds instead of 76. The window `[low, high]` shrinks by half each time.

## The code, piece by piece

```python
def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1       # target can only be to the right
        else:
            high = mid - 1      # target can only be to the left
    return -1
```

- `low` and `high` mark the part of the list that could still contain the target.
- `(low + high) // 2` is the middle position. `//` is whole-number division, because a list position must be an integer.
- We set `low = mid + 1` (not `mid`) because we already checked `mid`. Skipping it is what guarantees the window gets smaller every round.
- When `low` passes `high`, the window is empty: the target is not there.

## Why it is so much faster

Because the window halves each round, binary search is **O(log n)**. Compare worst cases:

| Items | Linear search | Binary search |
| --- | --- | --- |
| 100 | 100 | 7 |
| 10,000 | 10,000 | 14 |
| 1,000,000 | 1,000,000 | 20 |
| 1,000,000,000 | 1,000,000,000 | 30 |

A billion sorted items can be searched in 30 steps. The catch: sorting costs time too. If you search a list only once, sorting first is not worth it. If you search it thousands of times, sort once and then use binary search every time. (The next lessons are about sorting.)

> **Watch out:**
> - Using binary search on an unsorted list gives wrong answers without any error message. It silently returns `-1` for items that are really there.
> - `while low < high` instead of `low <= high` skips the case where one item is left, and misses the last candidate.
> - Writing `low = mid` or `high = mid` instead of `mid + 1` / `mid - 1` can loop forever.
> - `mid = (low + high) / 2` gives a float and Python raises `TypeError: list indices must be integers or slices, not float`. Use `//`.

## Going further

Python already ships a tested binary search in the `bisect` module. Learning to write it yourself matters because the same halving idea appears everywhere: finding a bug in a long history of changes, guessing a value in a game, even looking up a word in a paper dictionary.

> **Your turn:** write `binary_search(items, target)` that returns `(index, steps)`, counting one step per trip around the loop, and `(-1, steps)` when the target is missing. The helper `linear_search` is already written so you can compare the step counts.
