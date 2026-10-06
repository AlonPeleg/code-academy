---
title: Strings and vectors
summary: Work with text and growable lists.
level: beginner
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <vector>
      using namespace std;

      int main() {
          string name = "Ava";
          vector<int> scores = {80, 90, 100};

          // 1. Print: Hello, Ava!   (use the name variable, not the plain text Ava)
          // 2. Add 70 to scores with push_back
          // 3. Print: Scores: 4     (use scores.size())
          // 4. Add up all scores with a loop and print: Total: 340

          return 0;
      }
check:
  output: |
    Hello, Ava!
    Scores: 4
    Total: 340
  code:
    - { pattern: 'push_back\s*\(', message: "Add the new score with scores.push_back(...)." }
    - { pattern: 'for\s*\(', message: "Use a loop to add up the scores." }
    - { pattern: 'size\s*\(\s*\)', message: "Use scores.size() for the number of scores." }
hints:
  - "Strings are joined to output with << just like text. A vector has methods: push_back adds an item and size tells you how many there are."
  - "scores.push_back(70); adds 70 at the end. Then loop over the vector (for (int s : scores) { ... }) and keep a running total in an int that starts at 0."
  - "cout << \"Hello, \" << name << \"!\" << endl;   scores.push_back(70);   cout << \"Scores: \" << scores.size() << endl;   int total = 0; for (int s : scores) { total += s; }   cout << \"Total: \" << total << endl;"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <vector>
      using namespace std;

      int main() {
          string name = "Ava";
          vector<int> scores = {80, 90, 100};

          cout << "Hello, " << name << "!" << endl;

          scores.push_back(70);
          cout << "Scores: " << scores.size() << endl;

          int total = 0;
          for (int s : scores) {
              total += s;
          }
          cout << "Total: " << total << endl;

          return 0;
      }
quiz:
  - q: Which type holds text in C++?
    options: ["text", "char[] only", "string"]
    answer: 2
  - q: How do you add an item to the end of a vector?
    options: ["push_back", "append", "add"]
    answer: 0
  - q: 'What does  for (int s : scores)  do?'
    options: ["Declares a function", "Loops over every item in scores", "Sorts scores"]
    answer: 1
  - q: What is  scores[0]  for  vector<int> scores = {80, 90, 100};  ?
    options: ["90", "100", "80"]
    answer: 2
    explain: "Counting starts at 0, so index 0 is the first item."
---

Two types you will use in almost every C++ program: `string` for text and `vector` for a growable list. Both come with built-in methods, so you do not have to manage memory yourself like in C.

## Strings

Include the header and declare a string variable. You can join strings with `+` and ask for the length:

```cpp
#include <string>

string name = "Ava";
string greeting = "Hello, " + name + "!";
cout << greeting << endl;            // prints: Hello, Ava!
cout << name.length() << endl;       // prints: 3
cout << name[0] << endl;             // prints: A   (first letter, index 0)
```

A **method** is a function that belongs to an object and is called with a dot: `name.length()`. Indexes start at **0**. (The next lesson has many more string methods.)

## Vectors

A `vector<int>` is a list of ints that can grow and shrink. The type of the items goes between the angle brackets, and you may start it with values:

```cpp
#include <vector>

vector<int> numbers = {1, 2, 3};
numbers.push_back(4);                 // add to the end: 1 2 3 4
cout << numbers.size() << endl;       // prints: 4
cout << numbers[0] << endl;           // prints: 1
numbers[1] = 20;                      // change an item: 1 20 3 4
```

| Code | Meaning |
| --- | --- |
| `v.push_back(x)` | add `x` at the end |
| `v.size()` | how many items |
| `v[i]` | the item at index `i` (first is 0) |
| `v.empty()` | true if there are no items |
| `v.pop_back()` | remove the last item |

Unlike a C array, a vector knows its own size and can grow.

## Looping over a vector

The **range-based for loop** visits each item in turn:

```cpp
int total = 0;
for (int n : numbers) {     // read: "for each int n in numbers"
    total += n;
}
```

`n` is a copy of the current item. The classic loop with an index works too:

```cpp
for (int i = 0; i < numbers.size(); i++) {
    cout << numbers[i] << endl;
}
```

> **Watch out:**
> - `numbers[10]` on a vector with 4 items does not check the index. It compiles and then reads garbage or crashes. Use `numbers.at(10)` to get a proper error (`terminate called after throwing an instance of 'std::out_of_range'`).
> - Forgetting the header: `error: 'vector' was not declared in this scope`. You need `#include <vector>` (and `<string>` for strings).
> - Forgetting `<int>`: `vector scores;` gives `error: missing template arguments before 'scores'`.
> - Writing `"Hello, " + "Ava"` (two plain quoted texts) does not compile: `error: invalid operands of types 'const char [8]' and 'const char [4]' to binary 'operator+'`. At least one side must be a `string` variable.
> - `size()` is an unsigned number, so comparing it with a negative `int` gives a signed/unsigned warning.

## Going further

Use `pop_back()` to remove the last score and print the size again. Then try `for (int i = scores.size() - 1; i >= 0; i--)` to print the list backwards.

> **Your turn:** follow the numbered comments in the editor: greet `name`, add 70 with `push_back`, print how many scores there are and print their total.
