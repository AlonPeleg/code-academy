---
title: Lists and dictionaries
summary: Collect values in lists and look them up in dictionaries.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      fruits = ["apple", "banana"]
      prices = {"apple": 3, "banana": 2}

      # 1. Add "cherry" to the end of the fruits list
      # 2. Add "cherry" with the price 5 to the prices dictionary
      # 3. Print how many fruits there are
      # 4. Print the total of all the prices
check:
  output: |
    3
    10
  code:
    - { pattern: '\.append\s*\(', message: "Use .append() to add to the list." }
    - { pattern: '\bsum\s*\(', message: "Use sum() on the prices." }
    - { pattern: '\blen\s*\(', message: "Use len() to count the fruits." }
hints:
  - "A list grows with a method, and a dictionary grows by assigning to a new key. Then len() counts items and sum() adds numbers."
  - 'List: fruits.append(...). Dictionary: prices["cherry"] = 5. The prices are the dictionary VALUES, so sum(prices.values()).'
  - 'fruits.append("cherry")   prices["cherry"] = 5   print(len(fruits))   print(sum(prices.values()))'
solution:
  - name: main.py
    code: |
      fruits = ["apple", "banana"]
      prices = {"apple": 3, "banana": 2}

      fruits.append("cherry")
      prices["cherry"] = 5

      print(len(fruits))
      print(sum(prices.values()))
quiz:
  - q: How do you add an item to the end of a list?
    options: ["list.add(item)", "list.push(item)", "list.append(item)"]
    answer: 2
  - q: How do you read the price of "apple" from a dict called prices?
    options: ['prices.apple()', 'prices["apple"]', 'prices("apple")']
    answer: 1
  - q: What is the first index of a list?
    options: ["1", "-1", "0"]
    answer: 2
  - q: What does a dict store?
    options: ["Key and value pairs", "Only numbers", "Items sorted by size"]
    answer: 0
---

Real programs work with collections of things: a list of names, a table of prices, a set of scores. Python gives you two workhorses for this, lists and dictionaries.

## Lists

A **list** keeps items in order, inside square brackets:

```python
colors = ["red", "green"]
colors.append("blue")        # add to the end
print(colors)                # prints: ['red', 'green', 'blue']
print(colors[0])             # prints: red   (index 0 = first item)
print(colors[-1])            # prints: blue  (negative = from the end)
print(len(colors))           # prints: 3
```

Useful list tools:

| Tool | What it does |
| --- | --- |
| `items.append(x)` | add x at the end |
| `items.insert(0, x)` | add x at position 0 |
| `items.remove(x)` | remove the first x |
| `items.pop()` | remove and return the last item |
| `items.sort()` | sort in place |
| `x in items` | is x in the list? |
| `len(items)` | how many items |

You can change an item by index: `colors[0] = "pink"`. And you can loop through a list:

```python
for color in colors:
    print(color)
```

## Dictionaries

A **dictionary** (dict) maps **keys** to **values**, inside curly braces. It is like a phone book: look up a name (the key) and get the number (the value).

```python
ages = {"Ava": 21, "Noam": 19}
ages["Maya"] = 23            # add a new pair
ages["Ava"] = 22             # change an existing value
print(ages["Ava"])           # prints: 22
print("Noam" in ages)        # prints: True (checks the keys)
```

To loop through a dictionary:

```python
for name, age in ages.items():
    print(name, age)
```

`ages.keys()` gives just the keys, `ages.values()` just the values, and `ages.get("Zed", 0)` looks up a key safely, giving `0` when it is missing.

## Combining with functions

These built-in functions work on collections of numbers:

```python
scores = [70, 85, 90]
print(sum(scores))   # prints: 245
print(max(scores))   # prints: 90
print(min(scores))   # prints: 70
```

For a dictionary use `sum(prices.values())` because you want to add the values, not the keys.

> **Watch out:**
> - Index out of range: with 3 items, `items[3]` gives `IndexError: list index out of range`. The last valid index is 2.
> - Reading a key that does not exist gives `KeyError: 'cherry'`. Use `.get()` or check with `in` first.
> - `append` takes exactly one argument. `items.append(1, 2)` gives `TypeError`.
> - `items.sort()` returns `None` (it sorts in place). Writing `items = items.sort()` wipes out your list.

> **Your turn:** follow the numbered comments in the editor: add `"cherry"` to the list and to the dictionary, then print the number of fruits and the total price.
