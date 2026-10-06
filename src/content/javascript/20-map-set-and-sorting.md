---
title: Map, Set, WeakMap and sorting
summary: Use the right collection for the job and sort anything with a comparator function.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const text = "the cat and the hat and the bat";
      const words = text.split(" ");

      // 1. Make an array of the UNIQUE words with a Set, sorted alphabetically,
      //    and print them joined by spaces.

      // 2. Count how often each word appears using a Map (word -> count).
      //    Then rank the entries: highest count first, ties in alphabetical order.
      //    Print each as "word: count", one per line.

      const students = [
        { name: "Mia", grade: 90 },
        { name: "Leo", grade: 85 },
        { name: "Ana", grade: 90 },
        { name: "Zed", grade: 70 },
      ];
      // 3. Sort a COPY of students by grade (highest first), ties by name A to Z.
      //    Print "Name grade" for each, joined by ", ".

      // 4. Use a WeakMap called visits (object -> number of visits) and a function
      //    visit(obj) that adds 1 to the count of that object.
      const a = {};
      const b = {};
      visit(a);
      visit(a);
      visit(b);
      console.log(visits.get(a) + " " + visits.get(b) + " " + visits.has({}));
check:
  output: |
    and bat cat hat the
    the: 3
    and: 2
    bat: 1
    cat: 1
    hat: 1
    Ana 90, Mia 90, Leo 85, Zed 70
    2 1 false
  code:
    - pattern: 'new\s+Set\s*\('
      message: "Use new Set(words) to remove duplicates."
    - pattern: 'new\s+Map\s*\('
      message: "Count the words with a Map."
    - pattern: 'new\s+WeakMap\s*\('
      message: "Create visits with new WeakMap()."
    - pattern: '\.sort\s*\(\s*\(?\s*\w+\s*,\s*\w+\s*\)?\s*=>|\.sort\s*\(\s*function'
      message: "Pass a comparator function (a, b) => ... to sort."
    - pattern: 'localeCompare'
      message: "Compare strings with a.localeCompare(b)."
hints:
  - "A Set keeps each value once, a Map stores key-value pairs and remembers insertion order, a WeakMap only accepts objects as keys. sort() takes a comparator: a function (a, b) that returns a negative number, zero or a positive number. Use || to fall back to a second rule when the first one gives 0."
  - "Unique: [...new Set(words)].sort(). Counting: counts.set(w, (counts.get(w) ?? 0) + 1). Ranking: [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])). Students: [...students].sort(...) with grades subtracted the other way round."
  - "const sorted = [...students].sort((a, b) => b.grade - a.grade || a.name.localeCompare(b.name));   const visits = new WeakMap();   function visit(obj) { visits.set(obj, (visits.get(obj) ?? 0) + 1); }"
solution:
  - name: main.js
    code: |
      const text = "the cat and the hat and the bat";
      const words = text.split(" ");

      const unique = [...new Set(words)].sort();
      console.log(unique.join(" "));

      const counts = new Map();
      for (const w of words) {
        counts.set(w, (counts.get(w) ?? 0) + 1);
      }
      const ranked = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      for (const [word, n] of ranked) {
        console.log(word + ": " + n);
      }

      const students = [
        { name: "Mia", grade: 90 },
        { name: "Leo", grade: 85 },
        { name: "Ana", grade: 90 },
        { name: "Zed", grade: 70 },
      ];
      const sorted = [...students].sort((a, b) => b.grade - a.grade || a.name.localeCompare(b.name));
      console.log(sorted.map((s) => s.name + " " + s.grade).join(", "));

      const visits = new WeakMap();
      function visit(obj) {
        visits.set(obj, (visits.get(obj) ?? 0) + 1);
      }
      const a = {};
      const b = {};
      visit(a);
      visit(a);
      visit(b);
      console.log(visits.get(a) + " " + visits.get(b) + " " + visits.has({}));
quiz:
  - q: What does new Set([1, 2, 2, 3]) contain?
    options: ["1, 2, 2, 3", "1, 2, 3", "Only 2"]
    answer: 1
  - q: "What does  [10, 9, 1, 100].sort()  return when you give no comparator?"
    options: ["[1, 9, 10, 100]", "[100, 10, 9, 1]", "[1, 10, 100, 9]"]
    answer: 2
    explain: By default sort() compares the values as text, so "100" comes before "9". Pass (a, b) => a - b for numbers.
  - q: What is a good reason to choose a Map over a plain object as a dictionary?
    options: ["Map keys can be any value, it keeps insertion order and it has a size property", "Maps are always faster to write", "Objects cannot have string keys"]
    answer: 0
  - q: Why use a WeakMap to attach extra data to objects?
    options: ["It can store strings as keys", "It sorts its keys", "When the object is no longer used elsewhere, its entry can be garbage collected"]
    answer: 2
---

Arrays and plain objects can do almost everything, but JavaScript also offers collections designed for specific jobs. Picking the right one makes code shorter and faster, and knowing how `sort()` really works avoids some famous bugs.

## Set: a collection without duplicates

A `Set` stores each value once, in insertion order:

```js
const tags = new Set(["js", "css", "js"]);
tags.add("html");
console.log(tags.has("css")); // prints: true
console.log(tags.size);       // prints: 3
```

The classic use is removing duplicates: `[...new Set(array)]`. Spread turns the Set back into an array. `has` is fast even for huge sets, much faster than `array.includes` on a long array. Use `delete(value)` to remove one item.

## Map: a dictionary with any keys

A `Map` stores key/value pairs. Unlike a plain object, any value can be a key (numbers, objects), it remembers insertion order, and it has `size`:

```js
const counts = new Map();
counts.set("a", 1);
counts.set("a", (counts.get("a") ?? 0) + 1);
console.log(counts.get("a")); // prints: 2
```

`get` returns `undefined` for a missing key, so `?? 0` gives a starting value for counters. Iterate with `for (const [key, value] of map)`, or spread into an array of `[key, value]` pairs: `[...map]`. Also available: `map.keys()`, `map.values()`, `map.has(key)`, `map.delete(key)`.

Plain objects are fine for fixed records like `{ name: "Ada" }`. For a dictionary with changing, user-supplied keys, a `Map` avoids surprises (such as the key `"constructor"` or `"__proto__"`).

## WeakMap and WeakSet

A `WeakMap` is a Map whose keys must be **objects**, and which does not stop those objects from being garbage collected. When nothing else refers to the key object, its entry silently disappears. That makes it perfect for hanging extra data on objects you do not own, such as caches or counters, without causing memory leaks. The price: you cannot loop over a WeakMap or ask for its size.

```js
const visits = new WeakMap();
const page = {};
visits.set(page, 1);
```

## Sorting with a comparator

`array.sort()` changes the array **in place** and, by default, sorts values as **text**. That is why numbers go wrong:

```js
[10, 9, 1, 100].sort();               // [1, 10, 100, 9]
[10, 9, 1, 100].sort((a, b) => a - b); // [1, 9, 10, 100]
```

A **comparator** is a function `(a, b) => number`. It is called with two items and must return:

- a negative number if `a` should come first,
- a positive number if `b` should come first,
- zero if they are equal.

For numbers, `a - b` sorts ascending and `b - a` descending. For strings, use `a.localeCompare(b)`, which also handles accents and capitals sensibly.

To sort by several rules, chain them with `||`. The second rule is used only when the first returns 0, which is falsy:

```js
people.sort((a, b) => b.age - a.age || a.name.localeCompare(b.name));
```

Since `sort` modifies the original, copy first when you need to keep it: `[...students].sort(...)`. Modern JavaScript also has `toSorted(...)`, which returns a sorted copy. Sorting is **stable**: items that compare equal keep their original order.

> **Watch out:**
> - Sorting numbers without a comparator, and getting `[1, 10, 100, 9]`.
> - Writing a comparator that returns a boolean, like `(a, b) => a > b`. `true` and `false` become 1 and 0, and the result is unpredictable. Return a number.
> - Sorting something you meant to keep. `const sorted = list.sort()` changes `list` too, because both names point to the same array.
> - Using an object as a Map key and then creating a "same looking" new object to look it up: `map.get({id: 1})` finds nothing, because objects are compared by identity, not by content.
> - `TypeError: Invalid value used as weak map key` when you use a string or number as a WeakMap key. Only objects are allowed.
> - Expecting `JSON.stringify(new Map(...))` to work. It gives `{}`. Convert with `[...map]` or `Object.fromEntries(map)` first.

## Going further

Count the letters of a sentence with a Map, then print the top three. Try `Object.fromEntries(counts)` to turn a Map into a plain object, and `new Map(Object.entries(obj))` for the reverse.

> **Your turn:** print the unique words using a `Set`, count and rank the words with a `Map` and a two-rule comparator, sort a copy of `students` by grade then name, and create the `visits` WeakMap with the `visit` function.
