---
title: Templates
summary: Write one function or class that works for many types.
level: advanced
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      using namespace std;

      // 1. Write a function template maxOf that takes two values of the SAME type T
      //    and returns the bigger one (use the > operator).
      //    Start with:  template <typename T>

      // 2. Write a class template Pair<T> that stores two values of type T.
      //    - a constructor Pair(T a, T b)
      //    - a method larger() const that returns the bigger value
      //    - a method swapValues() that swaps the two stored values
      //    - a method first() const and second() const that return the values

      int main() {
          cout << "ints: " << maxOf(3, 7) << endl;
          cout << "doubles: " << maxOf(3.5, 2.25) << endl;
          cout << "strings: " << maxOf(string("apple"), string("pear")) << endl;

          Pair<int> p(4, 9);
          cout << "larger: " << p.larger() << endl;
          p.swapValues();
          cout << "after swap: " << p.first() << " " << p.second() << endl;

          Pair<string> s("apple", "banana");
          cout << "larger: " << s.larger() << endl;
          return 0;
      }
check:
  output: |
    ints: 7
    doubles: 3.5
    strings: pear
    larger: 9
    after swap: 9 4
    larger: banana
  code:
    - { pattern: 'template\s*<\s*(typename|class)\s+T\s*>\s*T\s+maxOf', message: "Write a function template: template <typename T> T maxOf(T a, T b)." }
    - { pattern: 'class\s+Pair', message: "Write the class template Pair." }
    - { pattern: 'swap\s*\(', message: "Use std::swap (or a temporary variable) in swapValues." }
hints:
  - "A template is a recipe: the compiler writes a real function or class for each type you use. The line template <typename T> introduces the placeholder type T that you then use like any other type."
  - "template <typename T> T maxOf(T a, T b) { return a > b ? a : b; }   For the class put template <typename T> before class Pair, store T a_, b_; and let the constructor fill them. Inside swapValues you can call swap(a_, b_)."
  - "template <typename T> class Pair { T a_, b_; public: Pair(T a, T b) : a_(a), b_(b) {}  T larger() const { return a_ > b_ ? a_ : b_; }  void swapValues() { swap(a_, b_); }  T first() const { return a_; }  T second() const { return b_; } };"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <utility>
      using namespace std;

      template <typename T>
      T maxOf(T a, T b) {
          return a > b ? a : b;
      }

      template <typename T>
      class Pair {
          T a_, b_;

      public:
          Pair(T a, T b) : a_(a), b_(b) {}

          T larger() const {
              return a_ > b_ ? a_ : b_;
          }

          void swapValues() {
              swap(a_, b_);
          }

          T first() const { return a_; }
          T second() const { return b_; }
      };

      int main() {
          cout << "ints: " << maxOf(3, 7) << endl;
          cout << "doubles: " << maxOf(3.5, 2.25) << endl;
          cout << "strings: " << maxOf(string("apple"), string("pear")) << endl;

          Pair<int> p(4, 9);
          cout << "larger: " << p.larger() << endl;
          p.swapValues();
          cout << "after swap: " << p.first() << " " << p.second() << endl;

          Pair<string> s("apple", "banana");
          cout << "larger: " << s.larger() << endl;
          return 0;
      }
quiz:
  - q: What is a template?
    options: ["A recipe that lets the compiler generate a function or class for each type you use", "A runtime check that converts types", "A special kind of comment"]
    answer: 0
  - q: When does the compiler generate the code for maxOf<int>?
    options: ["While the program is running", "At compile time, when it sees maxOf used with ints", "Never, templates are interpreted"]
    answer: 1
  - q: "What is wrong with  maxOf(3, 2.5)  (an int and a double) when maxOf takes (T a, T b)?"
    options: ["Nothing, it just works", "It is too slow", "T cannot be deduced as one type, so it does not compile"]
    answer: 2
  - q: Which operation must a type support to be used with maxOf as written?
    options: ["The + operator", "The > operator", "A constructor with no arguments"]
    answer: 1
---

Imagine you need a function that returns the bigger of two numbers. You write it for `int`. Then you need it for `double`, and then for `string`. The three versions are identical except for the type. Copy-pasting is a bad idea, so C++ gives you **templates**: you write the code once with a placeholder for the type, and the compiler produces a real version for each type you use.

## A function template

```cpp
template <typename T>
T maxOf(T a, T b) {
    return a > b ? a : b;
}

cout << maxOf(3, 7);        // T becomes int, prints: 7
cout << maxOf(2.5, 1.5);    // T becomes double, prints: 2.5
```

Piece by piece:

- `template <typename T>` says "what follows uses a placeholder type named `T`". (`class T` means exactly the same; `T` is just a name, `Type` or `Item` would work too.)
- `T maxOf(T a, T b)` is an ordinary function whose parameters and return type use `T`.
- `a > b ? a : b` is the conditional operator: "if a is bigger take a, otherwise b".
- When you call `maxOf(3, 7)` the compiler **deduces** `T = int` from the arguments and generates `int maxOf(int a, int b)`. You can also state it yourself: `maxOf<double>(3, 7)`.

This generation happens at **compile time**, so templates cost nothing at run time, and the generated code is as fast as if you had written it by hand.

## What a type must support

The template body is only checked when it is used with a concrete type. `maxOf` needs `>` to work on `T`. Numbers and `std::string` have it, so they work. A type without `operator>` makes the compiler complain inside the template, and those messages can be long. Read the first error line: it usually names the missing operator.

## A class template

Classes can be templates too. The standard library is full of them: `vector<int>`, `map<string, int>`, `optional<T>`.

```cpp
template <typename T>
class Box {
    T value_;

public:
    Box(T v) : value_(v) {}
    T get() const { return value_; }
};

Box<int> a(5);
Box<string> b("hi");
cout << a.get() << " " << b.get();   // prints: 5 hi
```

For classes you must write the type in angle brackets: `Box<int>`. (Since C++17 the compiler can sometimes deduce it from constructor arguments, so `Box c(5);` works, but writing it out is clearer for beginners.)

## Two or more type parameters

```cpp
template <typename K, typename V>
struct Entry {
    K key;
    V value;
};

Entry<string, int> e{"age", 30};
```

## Where to put templates

The compiler needs to see the full template body wherever it is used. That is why templates normally live completely in header files and are not split into a declaration and a separate .cpp definition. In this single-file lesson, define the template above `main`.

> **Watch out:**
> - Mixed argument types: `maxOf(3, 2.5)` gives `error: no matching function for call to 'maxOf(int, double)'` because `T` cannot be both. Write `maxOf<double>(3, 2.5)` or convert one argument.
> - Passing string literals: `maxOf("apple", "pear")` compares **pointers**, not text, and may also fail because the arrays have different sizes. Wrap them in `string(...)`.
> - Forgetting the type for a class: `Pair p(4, 9);` may work in C++17, but `Pair p;` gives `error: missing template arguments before 'p'`.
> - Forgetting `template <typename T>` on each separate function that uses `T`: `error: 'T' was not declared in this scope`.
> - Long error messages come from the compiler instantiating the template. Look for the line mentioning your own code.

## Going further

Add a template function `printAll` that takes a `vector<T>` and prints every element, or add a second class template `Stack<T>` built on `vector<T>` with `push`, `pop` and `empty`.

> **Your turn:** write the function template `maxOf` and the class template `Pair<T>` (constructor, `larger`, `swapValues`, `first`, `second`) so that the `main` function prints the expected six lines.
