---
title: Sorting, itertools and collections
summary: Sort with key functions and use Counter, defaultdict, deque and itertools for everyday data jobs.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      from collections import Counter, defaultdict, deque
      import itertools

      words = "the cat and the dog and the bird".split()

      # 1. Count the words with Counter and print the two most common as a list:
      #      [('the', 3), ('and', 2)]

      # 2. Group the words by length in a defaultdict(list) (length -> words,
      #    no duplicates handling needed). Print the words of length 4:
      #      ['bird']

      # 3. Print the unique words sorted by length, then alphabetically,
      #    using sorted() with a key function that returns a tuple:
      #      ['and', 'cat', 'dog', 'the', 'bird']

      # 4. Put 1..5 in a deque, rotate it right by 2 and print list(d):
      #      [4, 5, 1, 2, 3]

      # 5. Print every pair of the letters A, B, C with itertools.combinations,
      #    each pair joined into text, separated by spaces:
      #      AB AC BC
check:
  output: |
    [('the', 3), ('and', 2)]
    ['bird']
    ['and', 'cat', 'dog', 'the', 'bird']
    [4, 5, 1, 2, 3]
    AB AC BC
  code:
    - { pattern: 'Counter\s*\(', message: "Use Counter(words)." }
    - { pattern: 'defaultdict\s*\(\s*list', message: "Use defaultdict(list)." }
    - { pattern: 'key\s*=', message: "Use sorted(..., key=...)." }
    - { pattern: 'deque\s*\(', message: "Create a deque." }
    - { pattern: 'combinations\s*\(', message: "Use itertools.combinations." }
hints:
  - "These are five small tools. Counter counts items, defaultdict creates missing entries automatically, sorted(key=...) sorts by a computed value, deque is a list that is fast at both ends, itertools builds combinations."
  - "Counter(words).most_common(2). groups = defaultdict(list); for w in words: groups[len(w)].append(w). sorted(set(words), key=lambda w: (len(w), w)). d = deque([1,2,3,4,5]); d.rotate(2). ' '.join(''.join(p) for p in itertools.combinations('ABC', 2))."
  - "print(Counter(words).most_common(2))   groups = defaultdict(list)   for w in words: groups[len(w)].append(w)   print(groups[4])   print(sorted(set(words), key=lambda w: (len(w), w)))   d = deque([1, 2, 3, 4, 5]); d.rotate(2); print(list(d))   print(' '.join(''.join(p) for p in itertools.combinations('ABC', 2)))"
solution:
  - name: main.py
    code: |
      from collections import Counter, defaultdict, deque
      import itertools

      words = "the cat and the dog and the bird".split()

      print(Counter(words).most_common(2))

      groups = defaultdict(list)
      for w in words:
          groups[len(w)].append(w)
      print(groups[4])

      print(sorted(set(words), key=lambda w: (len(w), w)))

      d = deque([1, 2, 3, 4, 5])
      d.rotate(2)
      print(list(d))

      print(" ".join("".join(p) for p in itertools.combinations("ABC", 2)))
quiz:
  - q: What does the key argument of sorted() do?
    options: ["Chooses the sorting algorithm", "Gives a function whose result is used to compare each item", "Locks the list so it cannot change"]
    answer: 1
  - q: What is the advantage of defaultdict(list) over a normal dict?
    options: ["It is always sorted", "Reading a missing key creates an empty list for it instead of raising KeyError", "It can only hold lists"]
    answer: 1
  - q: Why use a deque instead of a list for a queue?
    options: ["It uses less memory for numbers", "It keeps its items sorted", "Adding and removing at the left end is fast, while list.pop(0) is slow for big lists"]
    answer: 2
  - q: "What does sorted(words, key=len) do with ties (same length)?"
    options: ["Keeps their original relative order, because Python's sort is stable", "Sorts them randomly", "Raises an error"]
    answer: 0
---

Most everyday programming is moving data around: sort it, count it, group it, queue it. Python ships with small, well-tested tools for these jobs. Learning them means you write short code and avoid reinventing slow or buggy versions.

## Sorting with a key function

`sorted(items)` returns a new sorted list. `list.sort()` sorts in place and returns `None`. Both accept `key=` and `reverse=`:

```python
words = ["pear", "fig", "banana"]
print(sorted(words))                 # ['banana', 'fig', 'pear']
print(sorted(words, key=len))        # ['fig', 'pear', 'banana']
print(sorted(words, key=len, reverse=True))   # ['banana', 'pear', 'fig']
```

The **key function** is called once per item and Python sorts by the results. It can be a built-in like `len`, or a small `lambda`:

```python
people = [("Ava", 30), ("Noam", 25), ("Maya", 30)]
print(sorted(people, key=lambda p: p[1]))
# [('Noam', 25), ('Ava', 30), ('Maya', 30)]
```

Python's sort is **stable**: items with equal keys stay in their original order (Ava stays before Maya). To sort by several criteria return a tuple, and use a minus sign to reverse a number: `key=lambda p: (-p[1], p[0])` means "oldest first, ties alphabetical".

## collections.Counter

`Counter` counts how often each item appears:

```python
from collections import Counter
c = Counter("banana")
print(c)                  # Counter({'a': 3, 'n': 2, 'b': 1})
print(c["a"])             # 3
print(c.most_common(1))   # [('a', 3)]
```

Missing items count as 0 instead of raising an error.

## collections.defaultdict

A normal dict raises `KeyError` for a missing key. `defaultdict` takes a function that makes the default value:

```python
from collections import defaultdict
groups = defaultdict(list)
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)
print(dict(groups))   # {'a': ['apple', 'avocado'], 'b': ['banana']}
```

No `if key not in groups` check needed. `defaultdict(int)` is great for counters.

## collections.deque

A **deque** ("deck", double-ended queue) is fast at adding and removing on both ends. It is the right choice for queues and sliding windows:

```python
from collections import deque
d = deque([1, 2, 3])
d.append(4)        # right end:  1 2 3 4
d.appendleft(0)    # left end:   0 1 2 3 4
d.popleft()        # removes 0 quickly
d.rotate(1)        # shifts everything right: 4 1 2 3
```

`list.pop(0)` has to shift every other item, so it gets slow for big lists. `deque(maxlen=3)` automatically drops old items, perfect for "the last three values".

## itertools

`itertools` builds and combines iterators lazily:

```python
import itertools
print(list(itertools.combinations("ABC", 2)))   # [('A', 'B'), ('A', 'C'), ('B', 'C')]
print(list(itertools.permutations("AB")))       # [('A', 'B'), ('B', 'A')]
print(list(itertools.chain([1, 2], [3])))       # [1, 2, 3]
print(list(itertools.islice(itertools.count(10), 3)))  # [10, 11, 12]
```

`combinations` ignores order, `permutations` cares about it, `chain` glues sequences, `count` is an endless counter and `islice` takes a slice from any iterator. `itertools.groupby` groups **neighbouring** equal items, so sort first.

> **Watch out:**
> - `sorted(...)` returns a new list; `my_list.sort()` returns `None`. Writing `x = my_list.sort()` leaves `x` as `None`.
> - Sorting mixed types: `sorted([3, "a"])` raises `TypeError: '<' not supported between instances of 'str' and 'int'`.
> - `key=` needs a function, not a call: `key=len`, not `key=len()`.
> - `combinations` gives tuples, so join them to make text: `"".join(pair)`.
> - Iterators from itertools are used up after one pass, like generators.

> **Your turn:** follow the five numbered comments: count words with `Counter`, group them with `defaultdict(list)`, sort with a tuple key, rotate a `deque` and print combinations. Match the expected output exactly.
