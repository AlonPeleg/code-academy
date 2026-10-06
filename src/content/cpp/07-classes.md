---
title: Classes
summary: Bundle data and behaviour together.
level: intermediate
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      using namespace std;

      class Rectangle {
      public:
          int width;
          int height;
          // 1. Add a method  int area()  that returns width * height
          // 2. Add a method  int perimeter()  that returns 2 * (width + height)
      };

      int main() {
          Rectangle r;
          r.width = 3;
          r.height = 4;
          cout << "Area: " << r.area() << endl;
          cout << "Perimeter: " << r.perimeter() << endl;
          return 0;
      }
check:
  output: |
    Area: 12
    Perimeter: 14
  code:
    - { pattern: 'int\s+area\s*\(\s*\)\s*(const\s*)?\{', message: "Define the method int area() inside the class." }
    - { pattern: 'int\s+perimeter\s*\(\s*\)\s*(const\s*)?\{', message: "Define the method int perimeter() inside the class." }
hints:
  - "A method is a function written inside the class braces. It can use the members (width and height) directly by name."
  - "Inside class Rectangle, after the two members, add two methods: int area() { ... } and int perimeter() { ... }. Each one needs a return statement."
  - "int area() { return width * height; }   int perimeter() { return 2 * (width + height); }"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      using namespace std;

      class Rectangle {
      public:
          int width;
          int height;

          int area() {
              return width * height;
          }

          int perimeter() {
              return 2 * (width + height);
          }
      };

      int main() {
          Rectangle r;
          r.width = 3;
          r.height = 4;
          cout << "Area: " << r.area() << endl;
          cout << "Perimeter: " << r.perimeter() << endl;
          return 0;
      }
quiz:
  - q: What is a class?
    options: ["A kind of loop", "A header file", "A blueprint for objects with data and methods"]
    answer: 2
  - q: How do you call the area method on an object r?
    options: ["r.area()", "area(r)", "r->area only"]
    answer: 0
  - q: 'What does public: mean?'
    options: ["The members are deleted", "Members can be used from outside the class", "The class is shared on the internet"]
    answer: 1
  - q: What is the difference between a class and an object?
    options: ["They are the same thing", "A class is a blueprint, an object is one thing built from it", "An object is a type of class member"]
    answer: 1
---

Up to now your data (a name, a width, a score) lived in separate variables and your functions lived somewhere else. A **class** lets you bundle the data together with the functions that work on it. This is the core idea of **object-oriented programming**, and it is what makes big C++ programs manageable.

## Class, members, methods, objects

```cpp
class Dog {
public:
    string name;          // a member: data that belongs to the dog

    void bark() {         // a method: a function that belongs to the dog
        cout << name << " says woof!" << endl;
    }
};

int main() {
    Dog d;                // d is an object (one dog built from the blueprint)
    d.name = "Rex";
    d.bark();             // prints: Rex says woof!

    Dog e;                // a second, independent dog
    e.name = "Mia";
    e.bark();             // prints: Mia says woof!
}
```

Piece by piece:

- `class Dog { ... };` defines a new type. **The semicolon after the closing brace is required.**
- The variables inside (`name`) are **members**, and the functions inside (`bark`) are **methods**.
- A variable of the class type (`d`) is an **object** (also called an *instance*). Each object has its own copy of the members.
- You use the **dot** to reach a member or call a method: `d.name`, `d.bark()`.
- Inside a method you can use the other members directly (`name`) without a dot. It automatically means "the member of the object this method was called on".
- `public:` means code outside the class may use what follows. (The next lesson shows `private:`.)

## Methods that return values

A method can take parameters and return a value like any function:

```cpp
class Circle {
public:
    double radius;
    double diameter() { return 2 * radius; }
};

Circle c;
c.radius = 2.5;
cout << c.diameter() << endl;    // prints: 5
```

## const methods

A method that only reads the object can be marked `const` after the parentheses: `int area() const { return width * height; }`. This is a promise not to change the object, and it lets you call the method on `const` objects. It is optional here but a good habit.

## Why bother?

Compare `area(width, height)` (loose numbers you must keep together yourself) with `r.area()` (the rectangle knows how to answer). Classes keep related things in one place, so code is easier to read and to change later.

> **Watch out:**
> - Forgetting the semicolon after the class: `error: expected ';' after class definition`.
> - Using a member outside the class without an object: `error: 'width' was not declared in this scope`. You need `r.width`.
> - Without `public:`, members are **private** by default in a `class`, so `r.width = 3;` fails with `error: 'int Rectangle::width' is private within this context`.
> - Uninitialized members (`Rectangle r;` without setting them) hold random junk. Constructors, in the next lesson, solve this.
> - Calling a method without parentheses (`r.area`) gives `error: invalid use of non-static member function`.

## Going further

Add a method `void print()` that prints `3 x 4`, and create two different rectangles to see that each has its own size.

> **Your turn:** add the methods `int area()` and `int perimeter()` to `Rectangle`. For the 3 by 4 rectangle in `main` the program should print `Area: 12` and `Perimeter: 14`.
