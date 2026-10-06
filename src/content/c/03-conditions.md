---
title: If, else and switch
summary: Make decisions in your program.
level: beginner
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          int score = 72;
          int day = 3;

          // 1. With an if chain (if, more tests, then a final else), print the grade for score:
          //    90 or more -> Grade: A
          //    75 or more -> Grade: B
          //    60 or more -> Grade: C
          //    anything lower -> Grade: F
          //    (for 72 it should print  Grade: C)

          // 2. With a switch on day, print the day name:
          //    1 -> Monday, 2 -> Tuesday, 3 -> Wednesday, anything else -> Unknown day
          //    (remember break after each case)

          return 0;
      }
check:
  output: |
    Grade: C
    Wednesday
  code:
    - { pattern: 'else\s+if', message: "Use else if to check the next condition." }
    - { pattern: 'switch\s*\(', message: "Use a switch statement for the day." }
    - { pattern: 'break\s*;', message: "End each case with break;" }
hints:
  - "Start with  if (score >= 90) { ... }  and chain the other tests with else if, ending with a plain else. Order matters: test the highest score first."
  - "For the switch write  switch (day) { case 1: ... break; case 2: ... break; ... default: ... }  and put a printf inside each case."
  - "if (score >= 90) { printf(\"Grade: A\\n\"); } else if (score >= 75) { printf(\"Grade: B\\n\"); } else if (score >= 60) { printf(\"Grade: C\\n\"); } else { printf(\"Grade: F\\n\"); }   then   switch (day) { case 1: printf(\"Monday\\n\"); break; case 2: printf(\"Tuesday\\n\"); break; case 3: printf(\"Wednesday\\n\"); break; default: printf(\"Unknown day\\n\"); }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          int score = 72;
          int day = 3;

          if (score >= 90) {
              printf("Grade: A\n");
          } else if (score >= 75) {
              printf("Grade: B\n");
          } else if (score >= 60) {
              printf("Grade: C\n");
          } else {
              printf("Grade: F\n");
          }

          switch (day) {
              case 1:
                  printf("Monday\n");
                  break;
              case 2:
                  printf("Tuesday\n");
                  break;
              case 3:
                  printf("Wednesday\n");
                  break;
              default:
                  printf("Unknown day\n");
                  break;
          }

          return 0;
      }
quiz:
  - q: What is the difference between = and == in C?
    options: ["= compares, == assigns", "They mean the same thing", "= assigns a value, == compares two values"]
    answer: 2
  - q: What happens in a switch if you forget break at the end of a case?
    options: ["The program stops", "Execution falls through into the next case", "The compiler refuses to run"]
    answer: 1
    explain: "C keeps running the following case bodies until it meets a break (or the end of the switch)."
  - q: In C, what does the condition  if (0)  do?
    options: ["Treats it as false, so the block is skipped", "Treats it as true", "Gives a compile error"]
    answer: 0
  - q: Which operator means "and" in C?
    options: ["&&", "and", "&&&"]
    answer: 0
---

Programs become useful when they can choose between actions. In this lesson you will learn `if`, `else if`, `else` and `switch`, plus the comparison and logic operators that feed them.

## Conditions

A condition is something that is either true or false. C has no separate boolean in classic code: **zero means false and any other number means true**. Comparisons give you `1` (true) or `0` (false):

| Operator | Meaning |
| --- | --- |
| `==` | equal to |
| `!=` | not equal to |
| `<` `<=` | less than, less or equal |
| `>` `>=` | greater than, greater or equal |
| `&&` | and (both must be true) |
| `\|\|` | or (at least one true) |
| `!` | not (flips true and false) |

## if, else if and else

```c
int temp = 25;

if (temp > 30) {
    printf("Hot\n");
} else if (temp > 20) {
    printf("Warm\n");
} else {
    printf("Cool\n");
}
// prints: Warm
```

C checks the conditions from top to bottom and runs only the **first** block whose condition is true, then skips the rest. That is why the order matters: if you tested `temp > 20` first, a temperature of 35 would print "Warm". The final `else` is optional and catches everything left over.

You can combine tests: `if (age >= 13 && age <= 19) { ... }` means "between 13 and 19".

## switch

When you compare one variable against several exact values, `switch` is tidier than a long `else if` chain:

```c
int n = 2;

switch (n) {
    case 1:
        printf("one\n");
        break;
    case 2:
        printf("two\n");
        break;
    default:
        printf("something else\n");
        break;
}
// prints: two
```

C jumps to the matching `case`. The `break;` leaves the switch. `default` runs if nothing matched. Switch works with whole numbers and single characters (such as `case 'a':`), but not with decimals or text.

> **Watch out:**
> - Writing `if (x = 5)` assigns 5 to `x` and is always true. The compiler warns: `suggest parentheses around assignment used as truth value`. Use `==` to compare.
> - Without `break`, a switch **falls through**: `case 1` would also run the code of `case 2`. This is sometimes useful, but usually a bug.
> - A semicolon straight after the condition, `if (x > 3);`, makes the `if` do nothing and the block below always runs.
> - Declaring a variable directly under a `case:` label can give `error: a label can only be part of a statement`. Wrap the case body in `{ }` if you need local variables.

## Going further

Change `score` to `95`, `60` and `10`, and `day` to `7`, and check that each branch works.

> **Your turn:** use an `if` / `else if` / `else` chain to print the grade for `score`, then use a `switch` on `day` to print the day name. With the given numbers the program prints `Grade: C` and `Wednesday`.
