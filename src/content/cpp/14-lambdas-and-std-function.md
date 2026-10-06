---
title: Lambdas and std::function
summary: Write small unnamed functions inline, capture variables, and store functions in variables and maps.
level: advanced
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <vector>
      #include <string>
      #include <map>
      #include <functional>
      #include <algorithm>
      using namespace std;

      int main() {
          // 1. Make a lambda square that takes an int and returns x * x.
          //    Print:  square: 49   (call it with 7)

          // 2. Make int factor = 3; and a lambda times that CAPTURES factor by value
          //    and returns x * factor. Print:  times: 15   (call it with 5)

          // 3. vector<int> v = {5, 3, 9, 1};  Sort it biggest first with sort and a
          //    lambda as the third argument. Print:  sorted: 9 5 3 1

          // 4. Make a map<string, function<int(int, int)>> called ops with two
          //    entries "add" and "mul", each a lambda taking two ints. Print:
          //      add: 12      (ops["add"](5, 7))
          //      mul: 35      (ops["mul"](5, 7))

          // 5. int calls = 0; and a lambda counted that captures calls BY REFERENCE,
          //    increments it and returns x + 1. Call counted(1) and counted(2),
          //    then print:  calls: 2

          return 0;
      }
check:
  output: |
    square: 49
    times: 15
    sorted: 9 5 3 1
    add: 12
    mul: 35
    calls: 2
  code:
    - { pattern: '\[\s*\]\s*\(', message: "Write a lambda such as [](int x) { return x * x; }." }
    - { pattern: '\[\s*factor\s*\]', message: "Capture factor by value with [factor]." }
    - { pattern: '\[\s*&\s*calls\s*\]', message: "Capture calls by reference with [&calls]." }
    - { pattern: 'function\s*<\s*int\s*\(\s*int\s*,\s*int\s*\)\s*>', message: "Use function<int(int, int)> as the map's value type." }
    - { pattern: 'sort\s*\(', message: "Use sort with a lambda comparison." }
hints:
  - "A lambda has the shape [captures](parameters) { body }. The square brackets list the outside variables the lambda may use: [factor] copies factor in, [&calls] refers to the original so changes are visible outside."
  - "auto square = [](int x) { return x * x; }; auto times = [factor](int x) { return x * factor; }; sort(v.begin(), v.end(), [](int a, int b) { return a > b; }); the map value type is function<int(int, int)>, and ops[\"add\"] = [](int a, int b) { return a + b; };"
  - "auto counted = [&calls](int x) { calls++; return x + 1; };   counted(1); counted(2);   cout << \"calls: \" << calls << endl;   map<string, function<int(int, int)>> ops;   ops[\"add\"] = [](int a, int b) { return a + b; };   ops[\"mul\"] = [](int a, int b) { return a * b; };"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <vector>
      #include <string>
      #include <map>
      #include <functional>
      #include <algorithm>
      using namespace std;

      int main() {
          auto square = [](int x) { return x * x; };
          cout << "square: " << square(7) << endl;

          int factor = 3;
          auto times = [factor](int x) { return x * factor; };
          cout << "times: " << times(5) << endl;

          vector<int> v = {5, 3, 9, 1};
          sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
          cout << "sorted:";
          for (int n : v) {
              cout << " " << n;
          }
          cout << endl;

          map<string, function<int(int, int)>> ops;
          ops["add"] = [](int a, int b) { return a + b; };
          ops["mul"] = [](int a, int b) { return a * b; };
          cout << "add: " << ops["add"](5, 7) << endl;
          cout << "mul: " << ops["mul"](5, 7) << endl;

          int calls = 0;
          auto counted = [&calls](int x) {
              calls++;
              return x + 1;
          };
          counted(1);
          counted(2);
          cout << "calls: " << calls << endl;

          return 0;
      }
quiz:
  - q: What do the square brackets at the start of a lambda, as in [factor](int x) { ... }, contain?
    options: ["The return type", "The parameter list", "The outside variables the lambda captures"]
    answer: 2
  - q: "What is the difference between [x] and [&x]?"
    options: ["[x] copies x into the lambda, [&x] refers to the original variable", "[x] is for numbers only", "There is no difference"]
    answer: 0
  - q: What is std::function<int(int, int)>?
    options: ["A type that can hold any callable taking two ints and returning an int, such as a lambda or a function", "A function that must be named", "A macro"]
    answer: 0
  - q: Why is a lambda convenient with sort?
    options: ["It makes sort faster than any other way", "It lets you write the comparison right where it is used, without a separate named function", "sort cannot work without one"]
    answer: 1
---

Often you need a tiny piece of behaviour: "sort these by length", "keep only the even ones". Writing a separate named function for each is clumsy. A **lambda** is a small unnamed function you write right where you need it. Combined with `std::function` you can also store functions in variables, vectors and maps, which opens the door to callbacks and command tables.

## Anatomy of a lambda

```cpp
auto square = [](int x) { return x * x; };
cout << square(7);     // prints: 49
```

Read it from left to right:

- `[]` is the **capture list** (more below). Empty means "uses nothing from outside".
- `(int x)` is the parameter list, just like a normal function.
- `{ return x * x; }` is the body. The return type is deduced from the `return`.
- `auto square = ...` stores the lambda in a variable. Its real type has no name that you can write, so we use `auto`.

You can also use a lambda immediately, without a variable. Passing one to an algorithm is the most common use:

```cpp
vector<int> v = {5, 3, 9, 1};
sort(v.begin(), v.end(), [](int a, int b) { return a > b; });   // biggest first
// v is now 9 5 3 1
```

The third argument tells `sort` how to compare two items: return `true` when `a` should come before `b`.

## Captures

A lambda cannot see local variables of the surrounding function unless you capture them.

```cpp
int factor = 3;
auto times = [factor](int x) { return x * factor; };   // copy of factor
cout << times(5);        // prints: 15
```

| Capture | Meaning |
|---|---|
| `[]` | nothing |
| `[x]` | a **copy** of x, made when the lambda is created |
| `[&x]` | a **reference** to the original x |
| `[=]` | copies of everything the lambda uses |
| `[&]` | references to everything the lambda uses |

A copy is frozen: changing `factor` afterwards does not change `times`. A copy is also read-only inside the lambda unless you write `mutable`. With a reference, the lambda can change the original:

```cpp
int calls = 0;
auto counted = [&calls](int x) { calls++; return x + 1; };
counted(1);
counted(2);
cout << calls;           // prints: 2
```

Be careful with `[&]`: if the lambda outlives the variable (for example when you return it from a function), the reference dangles and using it is undefined behaviour.

## std::function

Each lambda has its own unique, unnamed type, so you cannot put two different lambdas in one vector or map. `std::function<ReturnType(ParameterTypes)>` from `<functional>` is a universal container for anything callable:

```cpp
map<string, function<int(int, int)>> ops;
ops["add"] = [](int a, int b) { return a + b; };
ops["mul"] = [](int a, int b) { return a * b; };

cout << ops["add"](5, 7);    // prints: 12
```

`function<int(int, int)>` means "something you can call with two ints that returns an int". It also accepts normal functions and function objects. This is how you build menus, event handlers and command tables: look up the action by name, then call it.

`std::function` has a small run-time cost compared with a raw lambda or `auto`. For parameters that take a callback you can also use a template, but `function` is simplest to read.

> **Watch out:**
> - Forgetting to capture: `error: 'factor' is not captured`. Add it to the brackets.
> - Modifying a captured copy: `error: assignment of read-only variable 'x'`. Capture by reference `[&x]` or mark the lambda `mutable`.
> - A dangling reference: returning a lambda that captured a local by reference gives garbage or crashes later. Capture by value instead.
> - Wrong signature for `function`: assigning a lambda taking one int to `function<int(int, int)>` gives `error: no match for call` or a conversion error.
> - Forgetting the semicolon after the closing brace of a lambda stored in a variable: `error: expected ';'`.

## Going further

Use `count_if(v.begin(), v.end(), [](int n) { return n % 2 == 0; })` to count even numbers, or make a `vector<function<void()>>` of actions and run them in a loop.

> **Your turn:** write the five lambdas described in the comments: `square`, `times` (capture by value), a descending `sort` comparison, a map of operations using `function<int(int, int)>`, and `counted` (capture by reference).
