---
title: Loops and functions
summary: Repeat work with for, and package it in a function.
level: beginner
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>

      // 1. Write a function called square that takes an int n and returns n * n

      int main(void) {
          // 2. Use a for loop to print the squares of 1 to 5, one per line
          //    (call your function for each number)

          return 0;
      }
check:
  output: |
    1
    4
    9
    16
    25
  code:
    - { pattern: 'for\s*\(', message: "Use a for loop." }
    - { pattern: 'int\s+square\s*\(\s*int\s+\w+\s*\)', message: "Define int square(int n)." }
hints:
  - "You need two things: a function named square above main, and a for loop inside main that goes from 1 to 5."
  - "The function looks like  int square(int n) { return ...; }  and the loop header is  for (int i = 1; i <= 5; i++)."
  - "int square(int n) { return n * n; }   and in main:  for (int i = 1; i <= 5; i++) { printf(\"%d\\n\", square(i)); }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      int square(int n) {
          return n * n;
      }

      int main(void) {
          for (int i = 1; i <= 5; i++) {
              printf("%d\n", square(i));
          }
          return 0;
      }
quiz:
  - q: In  for (int i = 1; i <= 5; i++)  what does i++ do?
    options: ["Doubles i", "Prints i", "Adds 1 to i after each time round the loop"]
    answer: 2
  - q: What does the int before square mean in  int square(int n) ?
    options: ["The function returns an int", "The function is named int", "n is optional"]
    answer: 0
  - q: Why must a function be written before main (or declared above it)?
    options: ["It runs faster", "The compiler reads top to bottom and needs to know it first", "It is only a style rule"]
    answer: 1
  - q: How many times does  for (int i = 0; i < 4; i++)  run its body?
    options: ["3", "5", "4"]
    answer: 2
    explain: "i takes the values 0, 1, 2 and 3, so the body runs 4 times."
---

Two of the most important ideas in all of programming: **loops** repeat work, and **functions** give a piece of code a name so you can reuse it. In this lesson you will use both together.

## The for loop

A `for` loop has three parts inside the parentheses, separated by semicolons:

```c
for (int i = 0; i < 3; i++) {
    printf("%d\n", i);
}
// prints: 0 then 1 then 2
```

1. **Start**: `int i = 0` creates a counter and gives it a starting value. This runs once.
2. **Condition**: `i < 3` is checked before every round. When it becomes false the loop ends.
3. **Step**: `i++` runs after every round. It is short for `i = i + 1`.

Then the body in `{ }` runs once for each round. To count from 1 to 5 you start at 1 and use `i <= 5`.

## Functions

A **function** gives a block of code a name. Write the type it returns, its name, and the parameters (with types) in parentheses:

```c
int add(int a, int b) {
    return a + b;
}

int main(void) {
    int result = add(2, 3);
    printf("%d\n", result);    // prints: 5
    return 0;
}
```

- `int` before `add` means "this function gives back an int".
- `a` and `b` are **parameters**: inputs the function receives. The values you pass when calling (`2` and `3`) are called **arguments**.
- `return` sends the answer back to the caller and ends the function.
- A function that returns nothing uses the type `void`, for example `void greet(void) { printf("Hi\n"); }`.

## Order matters

C reads the file from top to bottom. If `main` calls a function the compiler has not seen yet, you get a warning or error. Either write the function **above** `main`, or put a **prototype** (just the first line plus a semicolon) at the top:

```c
int add(int a, int b);     // prototype

int main(void) { ... }

int add(int a, int b) { return a + b; }
```

> **Watch out:**
> - Off-by-one mistakes: `i < 5` runs for 0 to 4, while `i <= 5` runs for 0 to 5. Think about which one you want.
> - Calling a function with the wrong number of arguments gives `error: too few arguments to function 'add'`.
> - Forgetting `return` in an `int` function makes the result undefined (`warning: control reaches end of non-void function`).
> - Never put a semicolon right after the `for (...)`: it creates an empty loop and your block runs only once.

## Going further

Write a function `int cube(int n)` and print the cubes from 1 to 5, or make the loop count down with `i--`.

> **Your turn:** write `int square(int n)` above `main`, then use a `for` loop that calls it for the numbers 1 to 5 and prints each result on its own line.
