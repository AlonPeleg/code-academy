---
title: Conditions and loops
summary: Make decisions with if/else and repeat work with for and while.
level: beginner
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      using namespace std;

      int main() {
          // 1. FizzBuzz. Use a counting loop for the numbers 1 to 15. For each number:
          //      multiple of 15 -> print FizzBuzz
          //      multiple of 3  -> print Fizz
          //      multiple of 5  -> print Buzz
          //      otherwise      -> print the number itself
          //    Each answer goes on its own line. Hint: a number i is a multiple
          //    of k when the remainder of i divided by k is 0.

          // 2. Start with n = 100. Use a loop that repeats as long as n is above 1:
          //    halve n (integer division) and count the steps.
          //    Then print:  Steps: 6
          int n = 100;
          int steps = 0;

          return 0;
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
    Steps: 6
  code:
    - { pattern: 'for\s*\(', message: "Use a for loop for the numbers 1 to 15." }
    - { pattern: 'while\s*\(', message: "Use a while loop for the halving." }
    - { pattern: '%', message: "Use the remainder operator % to test for multiples." }
hints:
  - "Use a for loop that counts from 1 to 15, and inside it an if / else if / else chain. The order matters: test for 15 first."
  - "i % 3 == 0 is true when i is a multiple of 3. The loop header is  for (int i = 1; i <= 15; i++).  For the halving use  while (n > 1)  with n = n / 2; and steps++; inside."
  - "for (int i = 1; i <= 15; i++) { if (i % 15 == 0) { cout << \"FizzBuzz\" << endl; } else if (i % 3 == 0) { cout << \"Fizz\" << endl; } else if (i % 5 == 0) { cout << \"Buzz\" << endl; } else { cout << i << endl; } }   while (n > 1) { n = n / 2; steps++; }   cout << \"Steps: \" << steps << endl;"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      using namespace std;

      int main() {
          for (int i = 1; i <= 15; i++) {
              if (i % 15 == 0) {
                  cout << "FizzBuzz" << endl;
              } else if (i % 3 == 0) {
                  cout << "Fizz" << endl;
              } else if (i % 5 == 0) {
                  cout << "Buzz" << endl;
              } else {
                  cout << i << endl;
              }
          }

          int n = 100;
          int steps = 0;
          while (n > 1) {
              n = n / 2;
              steps++;
          }
          cout << "Steps: " << steps << endl;

          return 0;
      }
quiz:
  - q: What is  10 % 3  ?
    options: ["3", "0", "1"]
    answer: 2
    explain: "% is the remainder: 10 divided by 3 is 3 with 1 left over."
  - q: Why does a FizzBuzz program test for 15 BEFORE 3 and 5?
    options: ["15 is a bigger number", "An if / else if chain runs only the first true branch, so 15 would match 3 first", "The compiler needs it that way"]
    answer: 1
  - q: How many times does  for (int i = 0; i < 4; i++)  run its body?
    options: ["4", "3", "5"]
    answer: 0
  - q: What is the difference between = and == ?
    options: ["They are the same", "== stores a value, = compares", "= stores a value, == compares two values"]
    answer: 2
---

Programs get their power from two things: **making choices** and **repeating work**. In this lesson you will use `if`/`else` for decisions and `for` and `while` for loops. If you have seen another language this will feel familiar, but the C++ syntax has its own details.

## Conditions with if

```cpp
int temp = 25;

if (temp > 30) {
    cout << "Hot" << endl;
} else if (temp > 20) {
    cout << "Warm" << endl;
} else {
    cout << "Cool" << endl;
}
// prints: Warm
```

C++ checks the conditions from top to bottom and runs the **first** block whose condition is true, then skips all the others. The final `else` is optional and catches everything left over.

| Operator | Meaning |
| --- | --- |
| `==` `!=` | equal, not equal |
| `<` `<=` `>` `>=` | comparisons |
| `&&` | and (both true) |
| `\|\|` | or (at least one true) |
| `!` | not |

Conditions are of type `bool` (`true` or `false`). Numbers also work: `0` counts as false, everything else as true.

## The for loop

```cpp
for (int i = 0; i < 3; i++) {
    cout << i << endl;
}
// prints: 0 then 1 then 2
```

The three parts are: **start** (`int i = 0`, runs once), **condition** (`i < 3`, checked before every round) and **step** (`i++`, run after every round; it means add 1).

## The while loop

Use `while` when you do not know in advance how many rounds are needed:

```cpp
int count = 3;
while (count > 0) {
    cout << count << endl;
    count--;
}
// prints: 3 then 2 then 1
```

The condition is checked before every round. If nothing in the body ever makes it false, the loop runs forever (an *infinite loop*).

## The remainder operator

`%` gives the remainder of a whole-number division: `7 % 3` is `1`. A number is even when `n % 2 == 0`, and a multiple of 5 when `n % 5 == 0`. Remember also that dividing two `int`s drops the decimals: `7 / 2` is `3`.

> **Watch out:**
> - Writing `if (x = 5)` assigns instead of comparing and is always true. Use `==`. The compiler warns: `suggest parentheses around assignment used as truth value`.
> - A semicolon straight after `if (...)`, `for (...)` or `while (...)` ends the statement and the block below is not part of it.
> - Off-by-one: `i < 15` stops at 14, `i <= 15` includes 15.
> - Forgetting to change the variable in a `while` loop causes an infinite loop. The run server stops it after a few seconds with a time-limit error.
> - The order of an `else if` chain matters: put the most specific test first.

## Going further

Change FizzBuzz to run to 30, or use `break;` to leave a loop early and `continue;` to skip to the next round.

> **Your turn:** print FizzBuzz for 1 to 15 using a `for` loop with an `if` / `else if` / `else` chain, then use a `while` loop to halve `n` until it reaches 1 and print `Steps: 6`.
