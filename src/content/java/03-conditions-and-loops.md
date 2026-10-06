---
title: Conditions and loops
summary: Make decisions with if/else and repeat work with for and while loops.
level: beginner
runner: remote
files:
  - name: Main.java
    code: |
      public class Main {
          public static void main(String[] args) {
              // Print the numbers 1 to 15, one per line, with these rules (FizzBuzz):
              //   - if the number is divisible by 3 and by 5, print FizzBuzz
              //   - else if it is divisible by 3, print Fizz
              //   - else if it is divisible by 5, print Buzz
              //   - otherwise print the number itself
              //
              // 1. Write a for loop that counts i from 1 to 15.
              // 2. Inside it, use if / else if / else with the remainder operator %.
              //    (Check the "both" case FIRST.)

              // 3. After the loop, add up the numbers 1 to 15 with a while loop
              //    and print:  Sum: 120

          }
      }
check:
  output: |
    1
    2
    Fizz
    4
    Buzz
    Fizz
    7
    8
    Fizz
    Buzz
    11
    Fizz
    13
    14
    FizzBuzz
    Sum: 120
  code:
    - { pattern: 'for\s*\(', message: "Use a for loop to count from 1 to 15." }
    - { pattern: 'while\s*\(', message: "Use a while loop to add up the numbers." }
    - { pattern: '%', message: "Use the remainder operator % to test divisibility." }
hints:
  - "A for loop has three parts in its parentheses: where to start, when to keep going, and how to step. For example: for (int i = 1; i <= 15; i++)."
  - "Inside the loop test the hardest case first: if (i % 15 == 0) ... else if (i % 3 == 0) ... else if (i % 5 == 0) ... else ... . The sum needs an int total = 0 and a counter that grows inside while (n <= 15)."
  - "for (int i = 1; i <= 15; i++) { if (i % 15 == 0) { System.out.println(\"FizzBuzz\"); } else if (i % 3 == 0) { System.out.println(\"Fizz\"); } else if (i % 5 == 0) { System.out.println(\"Buzz\"); } else { System.out.println(i); } }  then: int sum = 0; int n = 1; while (n <= 15) { sum += n; n++; } System.out.println(\"Sum: \" + sum);"
solution:
  - name: Main.java
    code: |
      public class Main {
          public static void main(String[] args) {
              for (int i = 1; i <= 15; i++) {
                  if (i % 15 == 0) {
                      System.out.println("FizzBuzz");
                  } else if (i % 3 == 0) {
                      System.out.println("Fizz");
                  } else if (i % 5 == 0) {
                      System.out.println("Buzz");
                  } else {
                      System.out.println(i);
                  }
              }

              int sum = 0;
              int n = 1;
              while (n <= 15) {
                  sum += n;
                  n++;
              }
              System.out.println("Sum: " + sum);
          }
      }
quiz:
  - q: "What does 10 % 3 evaluate to?"
    options: ["3", "1", "0", "3.33"]
    answer: 1
    explain: "% is the remainder after division. 10 divided by 3 is 3 with 1 left over."
  - q: "Which operator checks that two conditions are BOTH true?"
    options: ["||", "&", "&&", "!"]
    answer: 2
  - q: "How many times does this loop run?  for (int i = 0; i < 4; i++)"
    options: ["3", "4", "5", "Forever"]
    answer: 1
    explain: "i takes the values 0, 1, 2 and 3, which is four times."
  - q: "What is the main difference between while and do-while?"
    options: ["do-while cannot stop", "do-while always runs the body at least once", "while is faster", "There is no difference"]
    answer: 1
---

Programs become interesting when they can **decide** and **repeat**. This lesson covers `if`/`else`, comparison operators, and Java's loops.

## Making decisions with if

An `if` runs a block only when its condition is `true`. The condition goes in parentheses and the block in curly braces:

```java
int temperature = 28;
if (temperature > 25) {
    System.out.println("It is hot");
} else if (temperature > 15) {
    System.out.println("It is nice");
} else {
    System.out.println("It is cold");
}
// prints: It is hot
```

Java checks the conditions from top to bottom and runs only the **first** block that matches. The `else` at the end is the fallback.

## Comparing and combining

Comparison operators give a `boolean`:

| Operator | Meaning |
|---|---|
| `==` | equal to |
| `!=` | not equal to |
| `<` `<=` | less than, less than or equal |
| `>` `>=` | greater than, greater than or equal |

Combine conditions with `&&` (and), `||` (or) and `!` (not):

```java
if (age >= 13 && age <= 19) {
    System.out.println("teenager");
}
```

Remember that `=` stores a value while `==` compares. For Strings compare with `.equals(...)`, not `==`.

## switch

When you compare one value against many fixed choices, `switch` is tidier:

```java
int day = 3;
switch (day) {
    case 1:
        System.out.println("Mon");
        break;
    case 2:
        System.out.println("Tue");
        break;
    default:
        System.out.println("Some other day");
}
```

The `break` stops Java from running into the next case. Forgetting it is a famous bug called "fall-through".

## The for loop

Use `for` when you know how many times to repeat:

```java
for (int i = 1; i <= 3; i++) {
    System.out.println("Round " + i);
}
```

The parentheses hold three parts separated by semicolons: **initialize** (`int i = 1`, runs once), **condition** (`i <= 3`, checked before each round), and **update** (`i++`, runs after each round). `i++` means "add one to i".

## The while loop

Use `while` when you repeat until something changes:

```java
int n = 1;
while (n < 100) {
    n = n * 2;
}
System.out.println(n);   // prints: 128
```

A `do { ... } while (condition);` loop is the same, except it runs the body first and checks afterwards, so the body always runs at least once.

You can leave a loop early with `break`, or skip to the next round with `continue`.

## The remainder trick

`i % 3 == 0` is true exactly when `i` divides evenly by 3. This is the standard way to test "every third item" or "is this number even" (`i % 2 == 0`). Programmers use it constantly.

> **Watch out:**
> - Writing `if (x = 5)` gives `error: incompatible types: int cannot be converted to boolean`. You meant `==`.
> - A semicolon right after the parentheses, `if (x > 3);` or `for (...);`, ends the statement immediately, so the block that follows is not controlled by it. The compiler stays silent, so look for it when a loop does something strange.
> - If the loop condition never becomes false, the program runs forever (an **infinite loop**). Make sure something inside changes, like `n++`.
> - Off-by-one errors: `i < 15` stops at 14, `i <= 15` stops at 15. Check your first and last values.
> - Putting the general case first in an if/else chain, for example testing `i % 3` before `i % 15`, means the specific case is never reached.

## Going further

Print a multiplication table with a loop inside a loop. Try counting down with `i--`. Change the FizzBuzz rules to use 2 and 7.

> **Your turn:** write FizzBuzz for the numbers 1 to 15 using a `for` loop and `if / else if / else` with `%`, printing one result per line. Then use a `while` loop to add up 1 to 15 and print `Sum: 120`.
