---
title: Functions, references and const
summary: Pass values by copy, by reference and by const reference.
level: intermediate
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <vector>
      using namespace std;

      // 1. Make swap_values exchange the two ints it is given.
      //    Change the parameters so they are references (add & after int).
      void swap_values(int a, int b) {
          // your code here
      }

      // 2. Make shout print the text followed by "!" and a new line.
      //    Take the string as a const reference so it is not copied.
      void shout(string s) {
          // your code here
      }

      // 3. Make sum return the total of all numbers in v.
      //    Take the vector as a const reference too.
      int sum(vector<int> v) {
          return 0;
      }

      // 4. Give the second parameter a default value of 2, so that power(5)
      //    means 5 squared and power(5, 3) means 5 cubed. Then return the result
      //    (loop and multiply).
      int power(int base, int times) {
          return 0;
      }

      int main() {
          int a = 3, b = 7;
          swap_values(a, b);
          cout << "After swap: a=" << a << " b=" << b << endl;

          shout("Hello");

          vector<int> nums = {1, 2, 3, 4, 5};
          cout << "Sum: " << sum(nums) << endl;

          cout << "Power: " << power(5) << " " << power(5, 3) << endl;
          return 0;
      }
check:
  output: |
    After swap: a=7 b=3
    Hello!
    Sum: 15
    Power: 25 125
  code:
    - { pattern: 'swap_values\s*\(\s*int\s*&\s*\w+\s*,\s*int\s*&', message: "Take both ints by reference: int& a, int& b." }
    - { pattern: 'const\s+string\s*&', message: "Take the string as const string&." }
    - { pattern: 'const\s+vector<int>\s*&', message: "Take the vector as const vector<int>&." }
    - { pattern: 'times\s*=\s*2', message: "Give the parameter a default value: int times = 2." }
hints:
  - "A reference parameter is declared with & after the type. It is another name for the caller's variable, so changes are seen outside. const stops the function from changing it."
  - "Signatures: void swap_values(int& a, int& b), void shout(const string& s), int sum(const vector<int>& v), int power(int base, int times = 2). Swap needs a temporary variable."
  - "void swap_values(int& a, int& b) { int temp = a; a = b; b = temp; }   void shout(const string& s) { cout << s << \"!\" << endl; }   int sum(const vector<int>& v) { int total = 0; for (int n : v) { total += n; } return total; }   int power(int base, int times = 2) { int result = 1; for (int i = 0; i < times; i++) { result *= base; } return result; }"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <vector>
      using namespace std;

      void swap_values(int& a, int& b) {
          int temp = a;
          a = b;
          b = temp;
      }

      void shout(const string& s) {
          cout << s << "!" << endl;
      }

      int sum(const vector<int>& v) {
          int total = 0;
          for (int n : v) {
              total += n;
          }
          return total;
      }

      int power(int base, int times = 2) {
          int result = 1;
          for (int i = 0; i < times; i++) {
              result *= base;
          }
          return result;
      }

      int main() {
          int a = 3, b = 7;
          swap_values(a, b);
          cout << "After swap: a=" << a << " b=" << b << endl;

          shout("Hello");

          vector<int> nums = {1, 2, 3, 4, 5};
          cout << "Sum: " << sum(nums) << endl;

          cout << "Power: " << power(5) << " " << power(5, 3) << endl;
          return 0;
      }
quiz:
  - q: What does a reference parameter like  int& x  allow?
    options: ["The function can change the caller's variable", "The function receives a copy", "The function cannot use x"]
    answer: 0
  - q: Why write  const vector<int>& v  for a function that only reads the vector?
    options: ["It makes the vector bigger", "It avoids copying the whole vector and promises not to change it", "It is required for every vector"]
    answer: 1
  - q: Given  void f(int n) { n = 99; }  and  int x = 1; f(x);  what is x afterwards?
    options: ["99", "0", "1"]
    answer: 2
    explain: "Without & the function works on a copy, so the caller's x is untouched."
  - q: What does a default argument like  int times = 2  do?
    options: ["Forces the caller to pass 2", "Is used when the caller leaves that argument out", "Makes the parameter const"]
    answer: 1
---

Functions let you give a block of code a name and reuse it. Most of the interesting questions are about **how arguments travel into a function**: as a copy, or as the real thing? This lesson shows the three ways C++ offers, plus default arguments.

## A quick refresher on functions

```cpp
int add(int a, int b) {       // return type, name, parameters
    return a + b;
}

int main() {
    cout << add(2, 3) << endl;   // prints: 5
}
```

C++ reads the file from top to bottom, so define a function **above** `main`, or write a **prototype** (the first line plus `;`) at the top. A function that returns nothing has the return type `void`.

## Pass by value (a copy)

By default the function receives a **copy**:

```cpp
void tryToChange(int n) {
    n = 99;               // changes only the copy
}

int x = 1;
tryToChange(x);
cout << x << endl;        // still 1
```

## Pass by reference (the real variable)

Add `&` after the type and the parameter becomes a **reference**, which is just another name for the caller's variable:

```cpp
void setTo99(int& n) {
    n = 99;               // changes the caller's variable
}

int x = 1;
setTo99(x);
cout << x << endl;        // prints: 99
```

You call it exactly as before: `setTo99(x)`, with no extra symbol. This is how you write `swap`, or any function that needs to give results back through its arguments.

## const references (read-only, no copying)

Copying a big `string` or `vector` every time you call a function is wasteful. Passing by reference avoids the copy, and adding `const` promises the function will not modify it:

```cpp
int count_items(const vector<int>& v) {
    return v.size();      // reading is fine; v.push_back(1) would not compile
}
```

Rule of thumb: small things (`int`, `double`, `char`, `bool`) by value; big things (`string`, `vector`, your own classes) by `const&` when you only read them, and by plain `&` when the function must change them.

## Default arguments

A parameter can have a default value, used when the caller leaves it out. Defaults go at the end of the parameter list:

```cpp
int power(int base, int times = 2) { ... }
power(5);       // times is 2
power(5, 3);    // times is 3
```

## Overloading

Several functions may share a name if their parameters differ, and C++ picks the right one: `int area(int side)` and `int area(int w, int h)`.

> **Watch out:**
> - Passing a literal to a non-const reference: `swap_values(3, 7)` gives `error: cannot bind non-const lvalue reference of type 'int&' to an rvalue of type 'int'`. A reference needs a real variable.
> - Forgetting the `&` when you wanted to change the caller's variable. Nothing fails, the change just disappears.
> - Changing a `const` parameter: `error: assignment of read-only reference 's'`.
> - A default argument in the middle (`int f(int a = 1, int b)`) gives `error: default argument missing for parameter 2`.
> - Calling a function before it is declared: `error: 'power' was not declared in this scope`.

## Going further

Write `void double_all(vector<int>& v)` that doubles every item in place using `for (int& n : v)` (a reference in the loop variable lets the loop change the items).

> **Your turn:** replace the four stubs: make `swap_values` take references and swap, `shout` take a `const string&` and print it with `!`, `sum` take a `const vector<int>&` and return the total, and `power` take a default second argument of 2.
