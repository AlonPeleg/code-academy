---
title: HashMap, collections and generics
summary: Count things with HashMap, remove duplicates with HashSet, and write your own generic class.
level: intermediate
runner: remote
files:
  - name: Main.java
    code: |
      import java.util.HashMap;
      import java.util.HashSet;
      import java.util.Map;
      import java.util.TreeMap;

      // 1. Write a generic class Pair<A, B> with two private fields first (type A) and
      //    second (type B), a constructor Pair(A first, B second) and getters getFirst()
      //    and getSecond().

      public class Main {
          public static void main(String[] args) {
              String text = "the cat and the dog and the bird";
              String[] words = text.split(" ");

              // 2. Create a HashMap<String, Integer> called counts.
              //    Loop over words and count how often each word appears.
              //    (Hint: counts.getOrDefault(word, 0) + 1)

              // 3. Print the counts in alphabetical order, one per line, like  and=2
              //    Sorting trick: loop over  new TreeMap<>(counts).entrySet()
              //    and print entry.getKey() + "=" + entry.getValue().

              // 4. Create a HashSet<String> from the words and print  Unique words: 5
              //    (a set keeps each value only once; use its size()).

              // 5. Find the most frequent word and store it in a Pair<String, Integer>.
              //    Print:  Pair: the -> 3   using getFirst() and getSecond().

          }
      }
check:
  output: |
    and=2
    bird=1
    cat=1
    dog=1
    the=3
    Unique words: 5
    Pair: the -> 3
  code:
    - { pattern: 'class\s+Pair\s*<\s*A\s*,\s*B\s*>', message: "Declare the generic class: class Pair<A, B>." }
    - { pattern: 'HashMap\s*<\s*String\s*,\s*Integer\s*>', message: "Create a HashMap<String, Integer>." }
    - { pattern: 'HashSet\s*<\s*String\s*>', message: "Create a HashSet<String>." }
    - { pattern: 'Pair\s*<\s*String\s*,\s*Integer\s*>', message: "Use Pair<String, Integer> for the most frequent word." }
hints:
  - "A generic class names its type placeholders in angle brackets: class Pair<A, B> { private A first; private B second; ... }. A HashMap stores key-to-value pairs: put(key, value) and get(key)."
  - "Counting: for (String w : words) { counts.put(w, counts.getOrDefault(w, 0) + 1); }. A set from an array: new HashSet<>(Arrays.asList(words)) needs java.util.Arrays, or just loop and call add. To find the max, loop over counts.entrySet() and remember the biggest value."
  - "Map<String, Integer> counts = new HashMap<>(); for (String w : words) { counts.put(w, counts.getOrDefault(w, 0) + 1); } for (Map.Entry<String, Integer> e : new TreeMap<>(counts).entrySet()) { System.out.println(e.getKey() + \"=\" + e.getValue()); } HashSet<String> unique = new HashSet<>(); for (String w : words) { unique.add(w); } System.out.println(\"Unique words: \" + unique.size());  then loop over counts.entrySet() keeping the best entry and build  new Pair<String, Integer>(bestWord, bestCount)."
solution:
  - name: Main.java
    code: |
      import java.util.HashMap;
      import java.util.HashSet;
      import java.util.Map;
      import java.util.TreeMap;

      class Pair<A, B> {
          private A first;
          private B second;

          Pair(A first, B second) {
              this.first = first;
              this.second = second;
          }

          A getFirst() {
              return first;
          }

          B getSecond() {
              return second;
          }
      }

      public class Main {
          public static void main(String[] args) {
              String text = "the cat and the dog and the bird";
              String[] words = text.split(" ");

              HashMap<String, Integer> counts = new HashMap<>();
              for (String w : words) {
                  counts.put(w, counts.getOrDefault(w, 0) + 1);
              }

              for (Map.Entry<String, Integer> entry : new TreeMap<>(counts).entrySet()) {
                  System.out.println(entry.getKey() + "=" + entry.getValue());
              }

              HashSet<String> unique = new HashSet<>();
              for (String w : words) {
                  unique.add(w);
              }
              System.out.println("Unique words: " + unique.size());

              String bestWord = "";
              int bestCount = 0;
              for (Map.Entry<String, Integer> entry : counts.entrySet()) {
                  if (entry.getValue() > bestCount) {
                      bestCount = entry.getValue();
                      bestWord = entry.getKey();
                  }
              }
              Pair<String, Integer> best = new Pair<String, Integer>(bestWord, bestCount);
              System.out.println("Pair: " + best.getFirst() + " -> " + best.getSecond());
          }
      }
quiz:
  - q: "What does a HashMap store?"
    options: ["A sorted list of numbers", "Key-value pairs with fast lookup by key", "Only Strings", "Duplicate values in order"]
    answer: 1
  - q: "What does a HashSet do when you add a value that is already in it?"
    options: ["Throws an exception", "Stores a second copy", "Ignores it, the set keeps each value once", "Replaces the whole set"]
    answer: 2
  - q: "Why should you NOT rely on the iteration order of a HashMap?"
    options: ["It is random every run, which is a bug", "The order is not guaranteed, so use TreeMap or LinkedHashMap if order matters", "It always sorts by value", "HashMap cannot be iterated"]
    answer: 1
  - q: "What does the <T> in  class Box<T>  mean?"
    options: ["T is a placeholder for any type chosen when you use Box", "T is the name of a method", "Box can only hold Strings", "It is a comment"]
    answer: 0
---

Arrays and `ArrayList` keep things in order, but sometimes you want to **look something up by name**, or keep only **unique** values. Java's **collections framework** has ready-made tools for this, and **generics** are the feature that makes them type-safe.

## Map: look things up by key

A `Map` stores **key to value** pairs, like a dictionary or a phone book. The usual implementation is `HashMap`:

```java
import java.util.HashMap;

HashMap<String, Integer> ages = new HashMap<>();
ages.put("Ada", 36);
ages.put("Linus", 28);
System.out.println(ages.get("Ada"));          // 36
System.out.println(ages.get("Zoe"));          // null  (no such key)
System.out.println(ages.getOrDefault("Zoe", 0)); // 0
System.out.println(ages.containsKey("Linus")); // true
ages.remove("Linus");
System.out.println(ages.size());              // 1
```

Putting a key that already exists **replaces** its value. In `HashMap<String, Integer>` the first type is the key and the second the value. Keys must be unique; values can repeat.

### The counting pattern

One of the most useful tricks in programming is counting how often things occur:

```java
for (String w : words) {
    counts.put(w, counts.getOrDefault(w, 0) + 1);
}
```

Read it as: take the current count of `w` (or 0 if never seen), add one, store it back. Java also offers `counts.merge(w, 1, Integer::sum)` for the same job.

### Looping over a map

```java
for (Map.Entry<String, Integer> e : counts.entrySet()) {
    System.out.println(e.getKey() + "=" + e.getValue());
}
```

Each **entry** is one key-value pair. You can also loop over `counts.keySet()` or `counts.values()`.

## Which order?

A `HashMap` makes **no promise** about the order of its entries. It may look sorted today and different after a small change. If order matters:

* `TreeMap` keeps keys **sorted** (alphabetically or numerically).
* `LinkedHashMap` keeps **insertion order**.

A handy trick is wrapping a HashMap: `new TreeMap<>(counts)` gives a sorted copy.

## Set: keep each value once

A `Set` has no duplicates. `HashSet` is fast; `TreeSet` is sorted:

```java
HashSet<String> seen = new HashSet<>();
seen.add("cat");
seen.add("dog");
seen.add("cat");           // ignored
System.out.println(seen.size());       // 2
System.out.println(seen.contains("dog")); // true
```

Sets are perfect for "have I seen this before?" and for removing duplicates from a list: `new HashSet<>(list)`.

## Generics: types as parameters

You have already seen `ArrayList<String>`. The `<String>` is a **type argument**, and it is what stops you adding an `Integer` to a list of Strings (the compiler rejects it) and removes the need to cast when reading. You can write your own generic classes, using a placeholder name, by convention a single capital letter:

```java
class Box<T> {
    private T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

Box<String> b = new Box<>("hello");
String s = b.get();          // no cast needed
Box<Integer> n = new Box<>(7);
```

`T` stands for "some type to be decided by the user of the class". `Pair<A, B>` uses two placeholders. Methods can be generic too: `static <T> T first(List<T> list)`.

Generics only work with object types, so you write `Integer`, `Double`, `Boolean` instead of `int`, `double`, `boolean`. Java converts between them automatically (**autoboxing**).

> **Watch out:**
> - Using `int` as a type argument, `HashMap<String, int>`, gives `error: unexpected type; required: reference, found: int`. Write `Integer`.
> - `int n = map.get("missing");` crashes with `NullPointerException`, because `get` returns `null` and Java tries to unbox it. Use `getOrDefault` or check `containsKey`.
> - Comparing two `Integer` objects with `==` can be false even for equal numbers over 127. Use `.equals(...)`.
> - Changing a map while looping over it throws `ConcurrentModificationException`.
> - Forgetting the `import java.util.HashMap;` gives `error: cannot find symbol`.
> - Mutable keys are dangerous: if you change an object after using it as a key, the map may no longer find it.

## Going further

Print the words with the highest counts first by putting the entries into an `ArrayList` and sorting with a comparator. Use `TreeMap` instead of `HashMap` and see what changes. Write a generic method `static <T> void printAll(List<T> items)`.

> **Your turn:** write `class Pair<A, B>` with a constructor and the getters `getFirst` and `getSecond`. Count the words of `text` in a `HashMap<String, Integer>`, print the counts alphabetically with a `TreeMap`, print the number of unique words using a `HashSet<String>`, and store the most frequent word in a `Pair<String, Integer>` to print `Pair: the -> 3`.
