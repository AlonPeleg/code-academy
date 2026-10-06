---
title: Sort, find and count
summary: Let the standard library do the work with sort, find, count and friends.
level: intermediate
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <vector>
      #include <algorithm>
      #include <numeric>
      #include <functional>
      using namespace std;

      // Prints  label: a b c  on one line (this helper is done for you)
      void show(const string& label, const vector<int>& v) {
          cout << label << ":";
          for (int n : v) {
              cout << " " << n;
          }
          cout << endl;
      }

      int main() {
          vector<int> v = {5, 3, 8, 1, 9, 3, 7};

          // 1. Sort v from smallest to biggest (sort takes v.begin() and v.end()).
          //    Call show("Sorted", v)    -> Sorted: 1 3 3 5 7 8 9
          // 2. Find the number 8 with find. The result is an iterator; subtract
          //    v.begin() from it to get the index, and print:  8 is at index 5
          // 3. Count how many 3s there are with count and print:  Threes: 2
          // 4. Add all numbers with accumulate, starting from 0, and print:  Sum: 36
          // 5. Find the biggest with max_element, dereferencing the result with *,
          //    and print:  Largest: 9
          // 6. Sort again, biggest first, by giving sort a third argument:
          //    greater<int>().  Call show("Descending", v)
          //    -> Descending: 9 8 7 5 3 3 1

          return 0;
      }
check:
  output: |
    Sorted: 1 3 3 5 7 8 9
    8 is at index 5
    Threes: 2
    Sum: 36
    Largest: 9
    Descending: 9 8 7 5 3 3 1
  code:
    - { pattern: '\bsort\s*\(', message: "Use sort(v.begin(), v.end())." }
    - { pattern: '\bfind\s*\(', message: "Use find to locate the 8." }
    - { pattern: '\bcount\s*\(', message: "Use count to count the 3s." }
    - { pattern: 'accumulate\s*\(', message: "Use accumulate for the sum." }
    - { pattern: 'max_element\s*\(', message: "Use max_element for the largest." }
hints:
  - "The headers are already included. All of these functions work on a range given by two iterators: v.begin() (the start) and v.end() (just past the last item)."
  - "sort(v.begin(), v.end()); find(v.begin(), v.end(), 8) gives an iterator, subtract v.begin() for the index; count(v.begin(), v.end(), 3); accumulate(v.begin(), v.end(), 0); *max_element(v.begin(), v.end()); the descending sort adds greater<int>() as a third argument."
  - "sort(v.begin(), v.end()); show(\"Sorted\", v);   auto it = find(v.begin(), v.end(), 8); cout << \"8 is at index \" << (it - v.begin()) << endl;   cout << \"Threes: \" << count(v.begin(), v.end(), 3) << endl;   cout << \"Sum: \" << accumulate(v.begin(), v.end(), 0) << endl;   cout << \"Largest: \" << *max_element(v.begin(), v.end()) << endl;   sort(v.begin(), v.end(), greater<int>()); show(\"Descending\", v);"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <vector>
      #include <algorithm>
      #include <numeric>
      #include <functional>
      using namespace std;

      void show(const string& label, const vector<int>& v) {
          cout << label << ":";
          for (int n : v) {
              cout << " " << n;
          }
          cout << endl;
      }

      int main() {
          vector<int> v = {5, 3, 8, 1, 9, 3, 7};

          sort(v.begin(), v.end());
          show("Sorted", v);

          auto it = find(v.begin(), v.end(), 8);
          cout << "8 is at index " << (it - v.begin()) << endl;

          cout << "Threes: " << count(v.begin(), v.end(), 3) << endl;
          cout << "Sum: " << accumulate(v.begin(), v.end(), 0) << endl;
          cout << "Largest: " << *max_element(v.begin(), v.end()) << endl;

          sort(v.begin(), v.end(), greater<int>());
          show("Descending", v);

          return 0;
      }
quiz:
  - q: What do v.begin() and v.end() describe?
    options: ["The first and the last value", "The start of the range and the position just past its last item", "The minimum and maximum"]
    answer: 1
  - q: How do you sort a vector v from biggest to smallest?
    options: ["sort(v.begin(), v.end(), greater<int>());", "sort(v, desc);", "v.sort(reverse);"]
    answer: 0
  - q: What does find return when the value is not in the range?
    options: ["-1", "The end iterator (the same as v.end())", "0"]
    answer: 1
  - q: Which header contains sort, find and count?
    options: ["<vector>", "<sort>", "<algorithm>"]
    answer: 2
---

You could write a loop to sort a list, to look for a value, or to count how often something appears. But C++ already comes with fast, well-tested versions of dozens of these jobs in the header `<algorithm>`. Using them makes your code shorter and less error-prone.

## Ranges and iterators

Every algorithm works on a **range** described by two **iterators**, which are like bookmarks pointing into the container:

- `v.begin()` points to the **first** item.
- `v.end()` points **just past** the last item (it is a marker for "the end", not an item).

```cpp
vector<int> v = {5, 3, 8};
sort(v.begin(), v.end());       // v is now 3 5 8
```

You can get at the value an iterator points to with `*`: `*v.begin()` is the first item. Subtracting two iterators gives a distance, so `it - v.begin()` is the **index** of `it`.

## The essentials

```cpp
#include <algorithm>
#include <numeric>      // for accumulate

sort(v.begin(), v.end());                       // ascending
sort(v.begin(), v.end(), greater<int>());       // descending (needs <functional>)
reverse(v.begin(), v.end());                    // flip the order

auto it = find(v.begin(), v.end(), 8);          // first 8, or v.end() if missing
if (it != v.end()) {
    cout << "found at " << (it - v.begin()) << endl;
}

int threes = count(v.begin(), v.end(), 3);      // how many equal 3
int total  = accumulate(v.begin(), v.end(), 0); // sum, starting from 0
int biggest  = *max_element(v.begin(), v.end());
int smallest = *min_element(v.begin(), v.end());
```

`accumulate` lives in `<numeric>`. The third argument is the start value, and its type decides the type of the result: use `0.0` to add up a `vector<double>`.

## Counting with a condition

`count_if` and other `_if` versions take a small function (a **lambda**) as the last argument:

```cpp
int big = count_if(v.begin(), v.end(), [](int n) { return n > 4; });
```

The part `[](int n) { return n > 4; }` is a function without a name: it takes an `int` and returns whether it is bigger than 4. You can also sort by your own rule with a lambda, for example `sort(words.begin(), words.end(), [](const string& a, const string& b) { return a.size() < b.size(); });` sorts strings by length.

## Sorting works on text too

`sort` also orders a `vector<string>` alphabetically, because strings know how to compare themselves.

> **Watch out:**
> - Writing `sort(v)` fails: `error: no matching function for call to 'sort(std::vector<int>&)'`. Pass the two iterators.
> - Dereferencing `find`'s result without checking it: if the value is missing the result equals `v.end()` and `*it` is undefined behaviour.
> - Mixing up the end iterator with the last item: `v.end()` is one past the last item, so never read `*v.end()`.
> - `sort` needs a random-access container like `vector`. It does not work on `list` or `map`.
> - Forgetting an include: `error: 'accumulate' was not declared in this scope` means you need `<numeric>`.

## Going further

Use `reverse` to flip the sorted vector, or use `count_if` to count the even numbers. Try `sort` on a `vector<string>` and print the result.

> **Your turn:** follow the numbered comments: sort ascending and show, find the 8 and print its index, count the 3s, add everything with `accumulate`, print the largest with `max_element`, and finally sort in descending order with `greater<int>()`.
