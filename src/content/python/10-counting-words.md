---
title: Parsing text and counting words
summary: Split text into pieces, count with a dictionary and join results back together.
level: intermediate
runner: python
stdin: |
  the cat saw the dog and the cat ran
files:
  - name: main.py
    code: |
      line = input()

      # 1. Split the line into a list of words
      # 2. Build a dictionary `counts` that maps each word to how many times it appears
      #    (the get method of a dictionary accepts a default value, which avoids a KeyError)
      # 3. Go through the words in alphabetical order (sorted keys) and print
      #    one line each in the form  word: count   e.g.  cat: 2
      # 4. Finally print the unique words joined with commas, in alphabetical order:
      #    and,cat,dog,ran,saw,the
check:
  output: |
    and: 1
    cat: 2
    dog: 1
    ran: 1
    saw: 1
    the: 3
    and,cat,dog,ran,saw,the
  code:
    - { pattern: '\.split\s*\(', message: "Use .split() to cut the line into words." }
    - { pattern: '\.join\s*\(', message: "Use .join() for the final line." }
    - { pattern: '\.get\s*\(|\bin\s+counts|counts\s*\[', message: "Use a dictionary to count." }
hints:
  - "Three tools do the work: split to cut text into a list, a dictionary to count, and join to glue a list back into text."
  - "words = line.split(). Then loop: for word in words: counts[word] = counts.get(word, 0) + 1. For alphabetical order loop over sorted(counts). Joining looks like \",\".join(a_list)."
  - "words = line.split()   counts = {}   for word in words: counts[word] = counts.get(word, 0) + 1   for word in sorted(counts): print(f\"{word}: {counts[word]}\")   print(\",\".join(sorted(counts)))"
solution:
  - name: main.py
    code: |
      line = input()

      words = line.split()
      counts = {}
      for word in words:
          counts[word] = counts.get(word, 0) + 1

      for word in sorted(counts):
          print(f"{word}: {counts[word]}")

      print(",".join(sorted(counts)))
quiz:
  - q: What does  "a b c".split()  return?
    options: ["The text 'a b c'", "A list: ['a', 'b', 'c']", "The number 3"]
    answer: 1
  - q: What does  ",".join(["x", "y"])  return?
    options: ["['x', 'y']", "x y", "x,y"]
    answer: 2
  - q: What does  counts.get("zebra", 0)  return when "zebra" is not a key?
    options: ["0", "An error", "None"]
    answer: 0
  - q: What does  "10,20".split(",")  return?
    options: ["['10,20']", "['10', '20']", "[10, 20]"]
    answer: 1
    explain: split gives text pieces. Convert them with int() if you need numbers.
---

A huge share of real programming is taking messy text, such as a sentence, a CSV row or a log line, and turning it into structured data you can work with. In this lesson you will learn to cut text apart, count things with a dictionary, and put text back together.

## split: from text to list

`.split()` cuts a string into a list of pieces. With no argument it splits on any whitespace; with an argument it splits on that exact text:

```python
print("red green blue".split())      # prints: ['red', 'green', 'blue']
print("10,20,30".split(","))         # prints: ['10', '20', '30']
```

Notice that the pieces are still **text**. To do math you must convert them:

```python
parts = "10,20,30".split(",")
total = 0
for p in parts:
    total = total + int(p)           # convert each piece before adding
print(total)                         # prints: 60
```

## join: from list to text

`.join()` is the reverse. You write the glue text first, then call `.join` with the list:

```python
words = ["a", "b", "c"]
print("-".join(words))     # prints: a-b-c
print(" ".join(words))     # prints: a b c
print("".join(words))      # prints: abc
```

The items must all be strings. For numbers use `",".join(str(n) for n in nums)` or convert first.

## Counting with a dictionary

A dictionary is the natural tool for "how many of each". The idea: for every item, add 1 to its entry.

```python
counts = {}
for letter in "banana":
    counts[letter] = counts.get(letter, 0) + 1
print(counts)    # prints: {'b': 1, 'a': 3, 'n': 2}
```

Here is what happens on each round:

- `counts.get(letter, 0)` looks up the current count, or gives `0` if the letter is new.
- `+ 1` adds this occurrence.
- `counts[letter] = ...` stores the new total.

Dictionaries remember the order in which keys were added, but when you print a report it is nicer to sort. `sorted(counts)` gives the keys in alphabetical order, and you can use each key to look up its count. To sort by count instead you can use `sorted(counts.items(), key=...)`, which you can explore later.

## Cleaning input

Real text has mess. Chain these helpers:

```python
text = "  Hello World  "
print(text.strip().lower().split())   # prints: ['hello', 'world']
```

> **Watch out:**
> - `counts[word] += 1` for a new word gives `KeyError: 'dog'`. Use `.get(word, 0)` or check `if word in counts`.
> - `.join` is called on the glue, not the list: `",".join(items)`, not `items.join(",")` (which gives `AttributeError`).
> - Joining non-strings fails: `",".join([1, 2])` gives `TypeError: sequence item 0: expected str instance, int found`.
> - Words with different capitals count separately: `The` and `the` are two keys. Use `.lower()` first when that is not what you want.

> **Your turn:** split the sentence into words, count them in a dictionary, print `word: count` for each word alphabetically, and finish with the words joined by commas.
