---
title: Variables and types
summary: Every variable has a type, and printf formats it.
level: beginner
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          int apples = 3;
          int price = 4;
          double tax = 0.5;

          // 1. Make an int called total that is apples * price
          // 2. Print the line  Total: 12  using total and %d
          // 3. Print price + tax with one decimal place, like  With tax: 4.5  (use %.1f)

          return 0;
      }
check:
  output: |
    Total: 12
    With tax: 4.5
hints:
  - "Declare the variable with its type first, then give it a value:  int total = ...;  Then use printf with a placeholder for each value."
  - "total is apples * price. For the prints you need %d for the int total and %.1f for the double price + tax. Do not forget \\n."
  - "int total = apples * price;  printf(\"Total: %d\\n\", total);  printf(\"With tax: %.1f\\n\", price + tax);"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          int apples = 3;
          int price = 4;
          double tax = 0.5;

          int total = apples * price;
          printf("Total: %d\n", total);
          printf("With tax: %.1f\n", price + tax);

          return 0;
      }
quiz:
  - q: Which type stores whole numbers?
    options: ["double", "char", "int"]
    answer: 2
  - q: Which printf placeholder prints an int?
    options: ["%s", "%d", "%f"]
    answer: 1
  - q: What does %.1f do?
    options: ["Prints a decimal number with 1 digit after the point", "Prints the number 1", "Prints a float exactly 1 time"]
    answer: 0
  - q: What does  int x = 7 / 2;  store in x?
    options: ["3.5", "4", "3"]
    answer: 2
    explain: "Dividing two ints gives an int, so the .5 is thrown away."
---

In this lesson you will learn how C stores numbers and letters in **variables**, and how to print them with `printf`. Unlike Python or JavaScript, C needs you to say what **type** each variable is, because the type decides how much memory it uses and what you can do with it.

## Declaring variables

A variable is a named box in memory. You create one by writing its type, its name and (usually) a starting value:

```c
int age = 20;
double price = 9.99;
char grade = 'A';
```

| Type | Holds | Example | printf placeholder |
| --- | --- | --- | --- |
| `int` | whole numbers | `42`, `-7` | `%d` |
| `double` | decimal numbers | `3.14`, `0.5` | `%f` |
| `char` | one character | `'A'`, `'z'` | `%c` |

Note that a `char` uses **single** quotes and text uses double quotes.

## Printing values with printf

Inside the text you give to `printf`, each `%` placeholder is replaced by the next value you pass after the text, in order:

```c
printf("Age: %d\n", age);          // prints: Age: 20
printf("Price: %.2f\n", price);    // prints: Price: 9.99
printf("Grade: %c\n", grade);      // prints: Grade: A
printf("%d is %c\n", age, grade);  // prints: 20 is A
```

`%.2f` means "a decimal number with exactly 2 digits after the point". `%.1f` gives one digit and rounds for you.

## Doing maths

You can calculate with `+ - * /` and use parentheses, then store the result in a new variable:

```c
int a = 7;
int b = 2;
int sum = a + b;           // 9
int half = a / b;          // 3  (not 3.5!)
double exact = 7 / 2.0;    // 3.5
printf("%d %d %.1f\n", sum, half, exact);
```

When both sides of `/` are `int`, C does **integer division** and throws the remainder away. Make one side a `double` (like `2.0`) to get a decimal answer. When you mix an `int` and a `double`, C turns the `int` into a `double` first, which is why `price + tax` below works.

> **Watch out:**
> - Printing a `double` with `%d` prints garbage. The compiler warns: `format '%d' expects argument of type 'int', but argument 2 has type 'double'`. Match the placeholder to the type.
> - Passing fewer values than placeholders (for example `printf("%d %d\n", a);`) prints a random number for the missing one.
> - A variable must be declared before use: `error: 'total' undeclared (first use in this function)`.
> - Using `=` is assignment (store a value), not a comparison. Comparison comes in the next lesson.

## Going further

Try changing `tax` to `0.25` and printing it with `%.2f`. What happens if you print `apples / 2`?

> **Your turn:** make an `int` called `total` equal to `apples * price`, print `Total: 12`, then print `With tax: 4.5` using `price + tax` and `%.1f`.
