---
title: STL containers deeper
summary: Use set and deque, understand iterators, and combine algorithms with lambdas.
level: advanced
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <vector>
      #include <set>
      #include <deque>
      #include <algorithm>
      #include <numeric>
      using namespace std;

      int main() {
          vector<int> nums = {5, 3, 8, 3, 1, 8, 9, 2};

          // 1. Build a set<int> called unique from nums (use the two-iterator
          //    constructor: set<int> unique(nums.begin(), nums.end());).
          //    Print its items with a range-for on one line:  unique: 1 2 3 5 8 9
          //    Print  has 5: yes  or  has 5: no  using unique.count(5).

          // 2. Make a deque<int> dq. push_back(1), push_back(2), push_front(0).
          //    Print its items:  deque: 0 1 2
          //    Then pop_front() and print the new front():  front: 1

          // 3. With count_if and a lambda, count the even numbers in nums.
          //    Print:  evens: 3

          // 4. With transform and a lambda, write the squares of nums into a new
          //    vector<int> squares (create it with the same size first).
          //    Then use accumulate on squares. Print:  sum of squares: 257

          // 5. With find_if and a lambda, find the first number in nums bigger
          //    than 7. Print the value found through the iterator:  first above 7: 8

          return 0;
      }
check:
  output: |
    unique: 1 2 3 5 8 9
    has 5: yes
    deque: 0 1 2
    front: 1
    evens: 3
    sum of squares: 257
    first above 7: 8
  code:
    - { pattern: 'set\s*<\s*int\s*>\s+unique', message: "Create the set<int> unique." }
    - { pattern: 'push_front\s*\(', message: "Use push_front on the deque." }
    - { pattern: 'count_if\s*\(', message: "Use count_if with a lambda." }
    - { pattern: 'transform\s*\(', message: "Use transform with a lambda." }
    - { pattern: 'find_if\s*\(', message: "Use find_if with a lambda." }
hints:
  - "A set keeps unique items in sorted order, a deque is a vector-like container with fast insertion at both ends. Algorithms such as count_if, transform and find_if take a range (two iterators) and a lambda."
  - "set<int> unique(nums.begin(), nums.end()); deque<int> dq; dq.push_back(1); dq.push_front(0); count_if(nums.begin(), nums.end(), [](int n) { return n % 2 == 0; }); vector<int> squares(nums.size()); transform(nums.begin(), nums.end(), squares.begin(), [](int n) { return n * n; });"
  - "auto it = find_if(nums.begin(), nums.end(), [](int n) { return n > 7; });   cout << \"first above 7: \" << *it << endl;   cout << \"sum of squares: \" << accumulate(squares.begin(), squares.end(), 0) << endl;   cout << \"has 5: \" << (unique.count(5) ? \"yes\" : \"no\") << endl;"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <vector>
      #include <set>
      #include <deque>
      #include <algorithm>
      #include <numeric>
      using namespace std;

      int main() {
          vector<int> nums = {5, 3, 8, 3, 1, 8, 9, 2};

          set<int> unique(nums.begin(), nums.end());
          cout << "unique:";
          for (int n : unique) {
              cout << " " << n;
          }
          cout << endl;
          cout << "has 5: " << (unique.count(5) ? "yes" : "no") << endl;

          deque<int> dq;
          dq.push_back(1);
          dq.push_back(2);
          dq.push_front(0);
          cout << "deque:";
          for (int n : dq) {
              cout << " " << n;
          }
          cout << endl;
          dq.pop_front();
          cout << "front: " << dq.front() << endl;

          int evens = count_if(nums.begin(), nums.end(), [](int n) { return n % 2 == 0; });
          cout << "evens: " << evens << endl;

          vector<int> squares(nums.size());
          transform(nums.begin(), nums.end(), squares.begin(), [](int n) { return n * n; });
          cout << "sum of squares: " << accumulate(squares.begin(), squares.end(), 0) << endl;

          auto it = find_if(nums.begin(), nums.end(), [](int n) { return n > 7; });
          if (it != nums.end()) {
              cout << "first above 7: " << *it << endl;
          }

          return 0;
      }
quiz:
  - q: What happens when you insert a value into a set that is already in it?
    options: ["The set stores it twice", "An error is thrown", "Nothing, a set keeps each value only once"]
    answer: 2
  - q: In what order does a std::set iterate its items?
    options: ["Sorted from smallest to biggest (by default)", "The order they were inserted", "Random order"]
    answer: 0
  - q: What does an iterator returned by find_if equal when nothing matches?
    options: ["nullptr", "The end iterator (v.end()), which you must not dereference", "The first element"]
    answer: 1
  - q: What is the advantage of deque over vector?
    options: ["It uses less memory", "Inserting and removing at the front is fast, not only at the back", "It sorts itself"]
    answer: 1
---

You already know `vector`, `map` and a few algorithms. This lesson widens the toolbox with two more containers (`set` and `deque`) and shows how iterators and lambdas let the same algorithms work on any container.

## Iterators: the glue

An **iterator** is an object that points at one element of a container and can move to the next. Every container offers `begin()` (the first element) and `end()` (**one past** the last). Use `*it` to read the element the iterator points at, and `++it` to advance.

```cpp
vector<int> v = {10, 20, 30};
for (auto it = v.begin(); it != v.end(); ++it) {
    cout << *it << " ";       // prints: 10 20 30
}
```

The range-for loop `for (int n : v)` is a shortcut for exactly this. Algorithms such as `sort`, `count_if` and `find_if` all take a **range** `[begin, end)` and therefore work with any container that offers iterators.

## std::set

A `set<T>` stores **unique** values and keeps them **sorted**. Include `<set>`.

```cpp
set<int> s = {5, 3, 5, 1};
s.insert(4);
s.insert(3);                 // already there: ignored
for (int n : s) cout << n << " ";    // prints: 1 3 4 5
cout << s.count(4);          // prints: 1   (0 would mean missing)
s.erase(5);
```

Sets are perfect for "remove duplicates" and "have I seen this before?". You can build one straight from another container: `set<int> u(v.begin(), v.end());`. Insert, find and erase take time proportional to log n, because the set is kept as a balanced tree. (`unordered_set` is the hash-based cousin: usually faster, but unsorted.)

## std::deque

A `deque` (say "deck", double-ended queue) works like a vector but is also fast at the **front**:

```cpp
deque<int> d;
d.push_back(1);
d.push_back(2);
d.push_front(0);            // 0 1 2
d.pop_front();              // 1 2
cout << d.front() << d.back();   // prints: 12
```

A `vector` must shift every element when you insert at the front, which is slow for big data. Use `deque` for queues, sliding windows and "undo" lists. It also supports `d[i]` indexing.

## Algorithms with lambdas

The previous lesson showed that a lambda can be given to `sort`. Many other algorithms accept a lambda as a test or as a calculation:

```cpp
vector<int> v = {1, 2, 3, 4, 5, 6};

int evens = count_if(v.begin(), v.end(), [](int n) { return n % 2 == 0; });   // 3

vector<int> sq(v.size());
transform(v.begin(), v.end(), sq.begin(), [](int n) { return n * n; });       // 1 4 9 16 25 36

auto it = find_if(v.begin(), v.end(), [](int n) { return n > 4; });
if (it != v.end()) cout << *it;      // prints: 5
```

- `count_if` counts items for which the lambda returns true.
- `transform` applies a function to each item and writes the results starting at a destination iterator. The destination must already have room, which is why we create `sq` with `v.size()` elements.
- `find_if` returns an iterator to the first match, or `v.end()` if there is none. Always compare with `end()` before dereferencing.
- `accumulate(begin, end, 0)` from `<numeric>` adds everything up.

> **Watch out:**
> - Dereferencing `end()`: `*v.end()` is undefined behaviour (garbage or a crash). Check `it != v.end()` after `find_if` or `find`.
> - `transform` into an empty vector: writing past its size is undefined behaviour. Create the vector with the right size first (`vector<int> out(v.size());`), or use `back_inserter(out)`.
> - Changing a set element through an iterator: `error: assignment of read-only location`. Erase the old value and insert the new one.
> - Modifying a vector (push_back, erase) while looping over it with iterators can invalidate them. Finish the loop first.
> - A set only stores one copy, so `s.size()` can be smaller than the number of inserts.

## Going further

Try `s.lower_bound(4)` to get an iterator to the first element not smaller than 4, or `remove_if` together with `erase` to delete all matching items from a vector.

> **Your turn:** follow the numbered comments: build a `set` from the numbers, use a `deque` from both ends, then use `count_if`, `transform` and `find_if` with lambdas. Print the seven lines shown in the expected output.
