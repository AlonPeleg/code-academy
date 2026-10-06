---
title: Methods
summary: Package code into reusable methods with parameters and return values, including overloading and recursion.
level: beginner
runner: remote
files:
  - name: Main.java
    code: |
      public class Main {
          // 1. Write  static int square(int n)  that returns n times n.

          // 2. Write  static int max(int a, int b)  that returns the bigger number.

          // 3. Write  static boolean isEven(int n)  that returns true for even numbers.

          // 4. Write  static String greet(String name)  that returns "Hello, " + name + "!"

          // 5. Write  static int factorial(int n)  using recursion:
          //    factorial(0) is 1, and factorial(n) is n * factorial(n - 1).

          public static void main(String[] args) {
              System.out.println("square(5) = " + square(5));
              System.out.println("max(3, 9) = " + max(3, 9));
              System.out.println("7 is even: " + isEven(7));
              System.out.println(greet("Ada"));
              System.out.println("5! = " + factorial(5));
          }
      }
check:
  output: |
    square(5) = 25
    max(3, 9) = 9
    7 is even: false
    Hello, Ada!
    5! = 120
  code:
    - { pattern: 'static\s+int\s+square\s*\(\s*int\s+\w+\s*\)', message: "Write static int square(int n)." }
    - { pattern: 'static\s+boolean\s+isEven\s*\(\s*int\s+\w+\s*\)', message: "Write static boolean isEven(int n)." }
    - { pattern: 'static\s+int\s+factorial\s*\(\s*int\s+\w+\s*\)[\s\S]*factorial\s*\(\s*\w+\s*-\s*1', message: "factorial must call itself with n - 1 (recursion)." }
hints:
  - "A method header lists: static, the return type, the name, and the parameters with their types. Example: static int square(int n) { ... }. The result is sent back with the return keyword."
  - "square returns n * n. max can use an if: if (a > b) { return a; } else { return b; }. isEven returns n % 2 == 0. greet returns \"Hello, \" + name + \"!\". For factorial, the base case is if (n == 0) { return 1; }."
  - "static int square(int n) { return n * n; }  static int max(int a, int b) { if (a > b) { return a; } return b; }  static boolean isEven(int n) { return n % 2 == 0; }  static String greet(String name) { return \"Hello, \" + name + \"!\"; }  static int factorial(int n) { if (n == 0) { return 1; } return n * factorial(n - 1); }"
solution:
  - name: Main.java
    code: |
      public class Main {
          static int square(int n) {
              return n * n;
          }

          static int max(int a, int b) {
              if (a > b) {
                  return a;
              }
              return b;
          }

          static boolean isEven(int n) {
              return n % 2 == 0;
          }

          static String greet(String name) {
              return "Hello, " + name + "!";
          }

          static int factorial(int n) {
              if (n == 0) {
                  return 1;
              }
              return n * factorial(n - 1);
          }

          public static void main(String[] args) {
              System.out.println("square(5) = " + square(5));
              System.out.println("max(3, 9) = " + max(3, 9));
              System.out.println("7 is even: " + isEven(7));
              System.out.println(greet("Ada"));
              System.out.println("5! = " + factorial(5));
          }
      }
quiz:
  - q: "What does the keyword void mean in a method header?"
    options: ["The method returns nothing", "The method cannot be called", "The method returns text", "The method has no name"]
    answer: 0
  - q: "What is the difference between a parameter and an argument?"
    options: ["None, they are the same word", "A parameter is the variable in the method header, an argument is the value you pass when calling", "An argument is in the header, a parameter is the value you pass", "Parameters are only for strings"]
    answer: 1
  - q: "What is method overloading?"
    options: ["Calling a method too many times", "A method that is too long", "Several methods with the same name but different parameter lists", "A method that calls itself"]
    answer: 2
  - q: "What must every recursive method have to avoid running forever?"
    options: ["A static keyword", "A base case that stops the recursion", "A void return type", "A String parameter"]
    answer: 1
---

A **method** is a named block of code that you can run whenever you like. Methods let you write something once and reuse it, and they let you split a big problem into small, understandable pieces.

## Defining and calling a method

```java
static int square(int n) {
    return n * n;
}
```

Taking the header apart:

* `static` means the method belongs to the class and can be called from `main` directly (until you learn about objects, all your methods will be `static`).
* `int` is the **return type**: the type of value the method hands back. Use `void` if it returns nothing.
* `square` is the name. By convention Java names start with a lowercase letter and use camelCase: `isEven`, `printReport`.
* `(int n)` is the **parameter list**: the inputs, each with a type. `n` is a **parameter**, a variable that exists only inside the method.
* `return n * n;` sends the answer back to whoever called the method and ends the method.

You call a method by writing its name and passing values (**arguments**):

```java
int result = square(5);
System.out.println(result);   // prints: 25
```

You can use a call anywhere a value of that type fits: `System.out.println(square(4) + 1);` prints `17`.

## void methods

A `void` method does something but gives nothing back. There is no `return value;`:

```java
static void sayHi(String name) {
    System.out.println("Hi, " + name);
}
```

## Several parameters and early returns

```java
static int max(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
```

When Java runs a `return`, the method ends right there. So after the `if` returns `a`, the line `return b;` is only reached when `a` was not bigger. Every path through a method that has a return type must end in a `return`, or the compiler complains.

## Overloading

Java lets you give several methods the same name as long as their parameter lists differ. This is called **overloading**:

```java
static int add(int a, int b)       { return a + b; }
static double add(double a, double b) { return a + b; }
static int add(int a, int b, int c)  { return a + b + c; }
```

Java picks the version that fits the arguments: `add(2, 3)` uses the first, `add(1.5, 2.5)` the second. `System.out.println` itself is overloaded: there is a version for ints, one for Strings, and so on.

## Recursion

A method may call itself. This is called **recursion**. It needs a **base case** (when to stop) and a step that moves toward it:

```java
static int factorial(int n) {
    if (n == 0) {
        return 1;                 // base case
    }
    return n * factorial(n - 1);  // smaller problem
}
```

`factorial(3)` becomes `3 * factorial(2)`, then `3 * 2 * factorial(1)`, then `3 * 2 * 1 * factorial(0)`, which is `3 * 2 * 1 * 1 = 6`. Each call waits for the one below it. If you forget the base case, the calls never stop and Java throws a `StackOverflowError`.

## Pass by value

When you call a method, Java gives it a **copy** of each primitive argument. Changing the parameter inside the method does not change the caller's variable:

```java
static void tryToChange(int x) { x = 99; }
int a = 1;
tryToChange(a);
System.out.println(a);   // still 1
```

> **Watch out:**
> - Forgetting `return` in a method with a return type gives `error: missing return statement`.
> - Returning the wrong type, such as `return "5";` from an `int` method, gives `error: incompatible types: String cannot be converted to int`.
> - Calling a method with the wrong number of arguments gives `error: method square in class Main cannot be applied to given types`.
> - Calling a non-static method from `static void main` gives `error: non-static method foo() cannot be referenced from a static context`. For now, put `static` on your methods.
> - Code after a `return` can never run, and the compiler reports `error: unreachable statement`.

## Going further

Write `static boolean isPrime(int n)`, or a `static void printStars(int count)` that prints a row of stars. Try writing `fibonacci` recursively, then notice how slow it gets for large inputs.

> **Your turn:** write the five static methods `square`, `max`, `isEven`, `greet` and `factorial` so that the `main` method prints the expected five lines. `factorial` must be recursive.
