---
title: Maps
summary: Look up values by key with std::map and unordered_map.
level: intermediate
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <vector>
      #include <map>
      #include <unordered_map>
      using namespace std;

      int main() {
          vector<string> words = {"apple", "banana", "apple", "cherry", "banana", "apple"};

          // 1. Make a map from string to int called counts, and use a loop over words
          //    to count how many times each word appears.
          // 2. Loop over the map and print each entry (the map keeps keys sorted):
          //      apple: 3
          //      banana: 2
          //      cherry: 1
          // 3. Print how many different words there are:   Different words: 3
          // 4. If "durian" is not a key of counts (use the count method), print: No durian

          unordered_map<string, int> stock = {{"pen", 10}, {"book", 3}};
          // 5. Take 4 pens out of stock (subtract 4 from the entry for "pen")
          //    and print:  Pens left: 6

          return 0;
      }
check:
  output: |
    apple: 3
    banana: 2
    cherry: 1
    Different words: 3
    No durian
    Pens left: 6
  code:
    - { pattern: 'map<\s*string\s*,\s*int\s*>\s+counts', message: "Declare map<string, int> counts;" }
    - { pattern: 'for\s*\(', message: "Use loops to fill and to print the map." }
    - { pattern: '\.\s*first', message: "In the printing loop use pair.first for the key." }
hints:
  - "A map stores key-value pairs. counts[word] finds (or creates) the entry for that word, and ++ adds one. Iterating a map visits entries in sorted key order."
  - "Fill: for (const string& w : words) { counts[w]++; }  Print: for (auto& entry : counts) { ... entry.first is the key, entry.second the value }. Size: counts.size(). Test for a missing key with counts.count(\"durian\") == 0."
  - "map<string, int> counts; for (const string& w : words) { counts[w]++; }   for (auto& entry : counts) { cout << entry.first << \": \" << entry.second << endl; }   cout << \"Different words: \" << counts.size() << endl;   if (counts.count(\"durian\") == 0) { cout << \"No durian\" << endl; }   stock[\"pen\"] -= 4; cout << \"Pens left: \" << stock[\"pen\"] << endl;"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <vector>
      #include <map>
      #include <unordered_map>
      using namespace std;

      int main() {
          vector<string> words = {"apple", "banana", "apple", "cherry", "banana", "apple"};

          map<string, int> counts;
          for (const string& w : words) {
              counts[w]++;
          }

          for (auto& entry : counts) {
              cout << entry.first << ": " << entry.second << endl;
          }

          cout << "Different words: " << counts.size() << endl;

          if (counts.count("durian") == 0) {
              cout << "No durian" << endl;
          }

          unordered_map<string, int> stock = {{"pen", 10}, {"book", 3}};
          stock["pen"] -= 4;
          cout << "Pens left: " << stock["pen"] << endl;

          return 0;
      }
quiz:
  - q: What does a map store?
    options: ["Key and value pairs", "Only numbers in order", "A single value"]
    answer: 0
  - q: In which order does a std::map hand out its entries when you loop over it?
    options: ["Random order every run", "The order you inserted them", "Sorted by key"]
    answer: 2
  - q: What does counts["kiwi"] do when "kiwi" is not yet a key?
    options: ["Crashes", "Creates the entry with a default value (0 for int)", "Returns -1 and changes nothing"]
    answer: 1
    explain: "The square-bracket operator inserts missing keys. To only test for a key use count or find."
  - q: When is unordered_map a good choice?
    options: ["When you need the keys sorted", "When you want the fastest lookups and do not care about order", "When the keys are always numbers"]
    answer: 1
---

A `vector` finds things by position (0, 1, 2...). Often you want to find things by **name** instead: the age of a person, the price of a product, how often a word appears. A **map** (also called a dictionary) stores **key-value pairs** and looks up a value from its key. C++ has two main ones.

## std::map

```cpp
#include <map>

map<string, int> ages;          // keys are strings, values are ints
ages["Ava"] = 20;               // add or change an entry
ages["Ben"] = 31;
cout << ages["Ava"] << endl;    // prints: 20
cout << ages.size() << endl;    // prints: 2
```

You can also start it with values: `map<string, int> ages = {{"Ava", 20}, {"Ben", 31}};`.

Important facts:

- `m[key]` looks up the value, and if the key does not exist yet it **creates** it with a default value (`0` for numbers, empty for strings). That is why `counts[word]++` works for counting: a new word starts at 0 and becomes 1.
- `m.count(key)` returns `1` if the key exists and `0` if it does not, without creating anything.
- `m.find(key)` returns an iterator, which equals `m.end()` when the key is missing.
- `m.erase(key)` removes an entry.
- A `std::map` keeps its keys **sorted**, so looping over it always gives the same, alphabetical (or numeric) order.

## Looping over a map

Each item of a map is a pair with two parts, `.first` (the key) and `.second` (the value):

```cpp
for (auto& entry : ages) {
    cout << entry.first << " is " << entry.second << endl;
}
// prints: Ava is 20
//         Ben is 31
```

`auto` tells the compiler to work out the type for you (here `pair<const string, int>`), so you do not have to write it.

## unordered_map

`unordered_map` (from `<unordered_map>`) has the same methods but is built on a hash table: lookups are usually faster, but the entries come out in **no particular order**, and that order can change between compilers. Use it when you only look things up by key. If you print a whole unordered_map the lines may come in any order, so when you want predictable output use a `map` or copy the keys into a sorted `vector` first.

```cpp
unordered_map<string, int> stock = {{"pen", 10}, {"book", 3}};
stock["pen"] -= 4;
cout << stock["pen"] << endl;   // prints: 6
```

> **Watch out:**
> - Reading with `m[key]` just to check whether a key exists silently **adds** it. Use `m.count(key)` or `m.find(key)` instead.
> - Forgetting `#include <map>` gives `error: 'map' was not declared in this scope`.
> - Do not rely on the print order of an `unordered_map`; the lesson checker would see different output.
> - Modifying the keys is not possible: they are `const`, so `entry.first = "x";` gives `error: assignment of read-only member`.
> - `m.at(key)` throws `std::out_of_range` for a missing key, which is useful when a missing key is a real bug.

## Going further

Count the letters in a string with a `map<char, int>`, or print the word with the highest count.

> **Your turn:** count the words in `words` with a `map<string, int>` called `counts`, print each entry as `word: count`, print the number of different words, test for `"durian"` with `count`, and then remove 4 pens from the `unordered_map`. The expected output is in the comments.
