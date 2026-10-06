---
title: Hash tables and dictionaries
summary: Instant lookups with dict, and how they turn slow loops into fast ones (two-sum, counting, anagrams).
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # 1. two_sum(nums, target): return a tuple (i, j) of two DIFFERENT positions, i < j,
      #    whose numbers add up to target. Return None if there is no such pair.
      #    It must be FAST: go through the list once, and remember in a dictionary
      #    which numbers you have already seen and at which position.
      #    For each number, ask: has its partner (target minus the number) been seen?
      def two_sum(nums, target):
          pass


      # 2. char_frequency(text): return a dictionary that maps each character
      #    to how many times it appears.
      def char_frequency(text):
          pass


      # 3. group_anagrams(words): return a dictionary-based grouping as a list of lists.
      #    Words that are anagrams of each other (same letters, any order) end up in one group.
      #    Hint: two anagrams have the same letters when both are sorted.
      #    Each group keeps the words in their original order.
      def group_anagrams(words):
          pass


      print(two_sum([2, 7, 11, 15], 9))
      print(two_sum([3, 2, 4], 6))
      print(two_sum([1, 2, 3], 10))
      print(two_sum(list(range(100000)), 199997))     # must be quick!

      print(sorted(char_frequency("banana").items()))

      words = ["listen", "silent", "enlist", "google", "gogole", "cat", "act", "tac", "dog"]
      for group in sorted(group_anagrams(words)):
          print(group)
check:
  output: |
    (0, 1)
    (1, 2)
    None
    (99998, 99999)
    [('a', 3), ('b', 1), ('n', 2)]
    ['cat', 'act', 'tac']
    ['dog']
    ['google', 'gogole']
    ['listen', 'silent', 'enlist']
  code:
    - { pattern: '\{\s*\}|dict\s*\(|defaultdict|Counter', message: "Use a dictionary to remember what you have seen." }
hints:
  - "A dictionary answers 'have I seen this value?' in one step. In two_sum, store seen[number] = position, and before storing, look up target - number."
  - "two_sum: seen = {}; for j, x in enumerate(nums): need = target - x; if need in seen: return seen[need], j; then seen[x] = j. After the loop return None. char_frequency: counts[ch] = counts.get(ch, 0) + 1. group_anagrams: key = ''.join(sorted(word)) and groups.setdefault(key, []).append(word)."
  - "groups = {}   for word in words:       key = ''.join(sorted(word))       groups.setdefault(key, []).append(word)   return list(groups.values())"
solution:
  - name: main.py
    code: |
      def two_sum(nums, target):
          seen = {}
          for j, x in enumerate(nums):
              need = target - x
              if need in seen:
                  return seen[need], j
              seen[x] = j
          return None


      def char_frequency(text):
          counts = {}
          for ch in text:
              counts[ch] = counts.get(ch, 0) + 1
          return counts


      def group_anagrams(words):
          groups = {}
          for word in words:
              key = "".join(sorted(word))
              groups.setdefault(key, []).append(word)
          return list(groups.values())


      print(two_sum([2, 7, 11, 15], 9))
      print(two_sum([3, 2, 4], 6))
      print(two_sum([1, 2, 3], 10))
      print(two_sum(list(range(100000)), 199997))     # must be quick!

      print(sorted(char_frequency("banana").items()))

      words = ["listen", "silent", "enlist", "google", "gogole", "cat", "act", "tac", "dog"]
      for group in sorted(group_anagrams(words)):
          print(group)
quiz:
  - q: "What is the average time to look up a key in a Python dict?"
    options: ["O(n)", "O(log n)", "O(1)"]
    answer: 2
    explain: "A hash function jumps straight to the right slot, so the lookup time does not grow with the size of the dict."
  - q: "Which of these can be used as a dictionary key?"
    options: ["A list", "A tuple of numbers", "Another dictionary"]
    answer: 1
    explain: "Keys must be hashable, which means immutable values like numbers, strings and tuples."
  - q: "Why does the dictionary version of two-sum beat two nested loops?"
    options: ["It makes one pass with O(1) lookups, so O(n) instead of O(n squared)", "It uses less code", "It sorts the list first"]
    answer: 0
  - q: "What does counts.get(ch, 0) return when ch is not in counts yet?"
    options: ["A KeyError", "0", "None"]
    answer: 1
---

Imagine a library where every book has a label that tells you its exact shelf. You never wander along the shelves: you read the label and walk straight there. A **hash table** works the same way, and in Python it is called a **dictionary** (`dict`). It is probably the most useful data structure you will ever learn, because it turns many slow loops into one-step lookups.

## How a hash table works

A dictionary stores **key: value** pairs. To decide where to put a key, Python runs it through a **hash function**, which turns the key into a number. That number picks a **slot** (a "bucket") in an internal array. To look the key up later, Python hashes it again and jumps to the same slot. No searching.

```text
key "cat"  -> hash -> 7  -> slot 7:  "cat": 3
key "dog"  -> hash -> 2  -> slot 2:  "dog": 5
```

Two different keys can land in the same slot (a **collision**); Python handles this internally, which is why lookups are **O(1) on average**: the time does not grow when the dictionary grows. Compare that to `x in some_list`, which is O(n), because Python must scan the list.

```python
ages = {"Ana": 30, "Ben": 25}
ages["Cy"] = 41                 # add
print(ages["Ben"])              # prints: 25
print("Ana" in ages)            # prints: True   (fast!)
print(ages.get("Zed", 0))       # prints: 0      (default instead of an error)
```

Keys must be **hashable**: immutable things such as numbers, strings and tuples. A list as key raises `TypeError: unhashable type: 'list'`, because the list could change after being hashed.

## Pattern 1: frequency counting

How often does each character appear? Without a dictionary you would need a loop inside a loop. With one, a single pass is enough:

```python
counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1
print(counts)   # prints: {'b': 1, 'a': 3, 'n': 2}
```

`counts.get(ch, 0)` returns the current count, or `0` when the character is new. The standard library even has `collections.Counter` to do this in one line, but now you know what it does inside.

## Pattern 2: two-sum

Given numbers and a target, find two positions whose values add up to the target. The slow way tries every pair: two nested loops, O(n squared). The fast way remembers what it has seen:

```python
nums = [2, 7, 11, 15]
target = 9
seen = {}                        # value -> position
for j, x in enumerate(nums):
    need = target - x            # the partner we are looking for
    if need in seen:
        print(seen[need], j)     # prints: 0 1
    seen[x] = j
```

At `x = 2` the partner is 7: not seen yet, so we store `2`. At `x = 7` the partner is 2: it is in `seen`, at position 0. Done in one pass: **O(n)**. We look up `need` **before** storing `x`, so a number can never pair with itself.

## Pattern 3: grouping with a key

Anagrams (`listen` and `silent`) have the same letters in a different order. If you sort the letters of each word, anagrams produce the **same key**: `"eilnst"`. A dictionary from key to list of words then groups them:

```python
groups = {}
for word in ["listen", "silent", "cat", "act"]:
    key = "".join(sorted(word))
    groups.setdefault(key, []).append(word)
print(list(groups.values()))   # prints: [['listen', 'silent'], ['cat', 'act']]
```

`setdefault(key, [])` returns the existing list for the key, or inserts and returns a new empty one. The idea "compute a key, then bucket by it" is the base of many real tasks: grouping logs by user, rows by date, files by size.

> **Watch out:**
> - `counts[ch] += 1` for a new key raises `KeyError: 'b'`. Use `.get(ch, 0)` or `setdefault` first.
> - Mutable keys fail: `{[1, 2]: "x"}` gives `TypeError: unhashable type: 'list'`. Use a tuple instead.
> - Dictionaries do not promise sorted keys. They remember insertion order, but to print in alphabetical order use `sorted(d.items())`.
> - Do the lookup **before** `seen[x] = j` in two-sum, otherwise `two_sum([3], 6)` would wrongly pair 3 with itself.
> - Hashing is average O(1). A bad hash function that sends everything to one slot would make it O(n), but Python's built-in ones are good.

## Going further

Try finding the first character in a string that appears only once, or check whether a list contains any duplicate. Each is a one-pass dictionary (or set) problem. Sets are hash tables that store only keys.

> **Your turn:** implement `two_sum` (one pass with a dictionary), `char_frequency` and `group_anagrams`. The test includes a list of 100,000 numbers, so a version with two nested loops will not finish in time.
