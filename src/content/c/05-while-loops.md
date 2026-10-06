---
title: While and do-while loops
summary: Repeat until a condition is no longer true.
level: beginner
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          // 1. Collatz sequence. Start with n = 6.
          //    Repeat until n is 1:
          //      print n followed by a space, then
          //      if n is even, divide it by 2, otherwise set n = 3 * n + 1
          //    After the loop print the final 1 and a new line.
          //    Expected line:  6 3 10 5 16 8 4 2 1
          int n = 6;

          // 2. Count the digits of x. Use a loop that always runs at least once:
          //    add 1 to digits, then divide x by 10, and repeat while x is above 0.
          //    Then print: Digits: 5
          int x = 12345;
          int digits = 0;

          return 0;
      }
check:
  output: |
    6 3 10 5 16 8 4 2 1
    Digits: 5
  code:
    - { pattern: 'while\s*\(', message: "Use a while loop." }
    - { pattern: 'do\s*\{', message: "Use a do { ... } while (...); loop for the digits." }
hints:
  - "The first loop does not know in advance how many rounds it needs, so use while (n != 1). The second one is a do { } while loop because it must run at least once."
  - "Inside the first loop: print with printf(\"%d \", n); then use n % 2 == 0 to test for even. For the digits: digits++; x = x / 10; inside do { }, and the condition after the closing brace is while (x > 0);"
  - "while (n != 1) { printf(\"%d \", n); if (n % 2 == 0) { n = n / 2; } else { n = 3 * n + 1; } } printf(\"1\\n\");   do { digits++; x = x / 10; } while (x > 0);   printf(\"Digits: %d\\n\", digits);"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          int n = 6;
          while (n != 1) {
              printf("%d ", n);
              if (n % 2 == 0) {
                  n = n / 2;
              } else {
                  n = 3 * n + 1;
              }
          }
          printf("1\n");

          int x = 12345;
          int digits = 0;
          do {
              digits++;
              x = x / 10;
          } while (x > 0);
          printf("Digits: %d\n", digits);

          return 0;
      }
quiz:
  - q: When is the condition of a while loop checked?
    options: ["Before every round, including the first", "Only after the first round", "Never, it runs forever"]
    answer: 0
  - q: What is the difference between while and do-while?
    options: ["do-while is faster", "do-while always runs its body at least once", "while cannot use conditions"]
    answer: 1
  - q: What is  17 % 5  in C?
    options: ["3", "2", "0"]
    answer: 1
    explain: "% gives the remainder of a division. 17 divided by 5 is 3 with 2 left over."
  - q: What happens if the condition of a while loop never becomes false?
    options: ["C stops it after 100 rounds", "The compiler reports an error", "The loop runs forever (an infinite loop)"]
    answer: 2
---

A `for` loop is perfect when you know how many times to repeat. Often you do not: you want to keep going **until something happens**, such as a number reaching 1, the user typing "quit", or a file ending. For that, C has `while` and `do-while`.

## The while loop

```c
int count = 3;
while (count > 0) {
    printf("%d\n", count);
    count--;
}
printf("Liftoff!\n");
// prints: 3, 2, 1, Liftoff! (each on its own line)
```

How it works:

1. C checks the condition `count > 0`.
2. If it is true, the body runs, and C goes back to step 1.
3. If it is false, the loop ends and the program continues after it.

If the condition is false from the start, the body never runs at all. A `while` loop is really a `for` loop with only the middle part. The start and the step are written by you, before and inside the loop. `count--` means `count = count - 1`.

## The do-while loop

`do-while` checks its condition **after** the body, so the body always runs at least once:

```c
int n = 10;
do {
    printf("n is %d\n", n);
    n++;
} while (n < 5);
// prints: n is 10   (once, even though 10 < 5 is false)
```

Notice the semicolon after `while (...)`. It is required here and only here.

## Handy operators

- `%` is the **remainder** (modulo): `17 % 5` is `2`. A number is even when `n % 2 == 0`.
- `x = x / 10` removes the last digit of a whole number (integer division drops the rest): `12345 / 10` is `1234`.
- Shortcuts: `x += 3` means `x = x + 3`, and `x /= 10` means `x = x / 10`. Likewise `-=`, `*=`, and `++`/`--`.

## break and continue

`break;` leaves the nearest loop immediately. `continue;` skips the rest of this round and moves on to the next:

```c
int i = 0;
while (1) {              // 1 is always true: loop "forever"
    if (i == 3) break;   // ...until we decide to stop
    i++;
}
```

> **Watch out:**
> - **Infinite loops.** If nothing in the body changes the condition (you forgot `count--`), the program never ends. The run server will stop it after a few seconds with a time-limit error.
> - A semicolon after `while (x > 0);` (in a normal while loop) makes an empty loop that spins forever.
> - Using `=` instead of `==` in the condition, for example `while (n = 1)`, assigns instead of comparing. The compiler warns: `suggest parentheses around assignment used as truth value`.
> - In `do-while`, forgetting the final semicolon gives `error: expected ';' before 'return'`.

## Going further

The Collatz sequence is a famous puzzle: nobody has proved that every starting number reaches 1. Try other starting values like 7 or 27 and see how long the sequence is.

> **Your turn:** use a `while` loop to print the Collatz sequence of 6 (`6 3 10 5 16 8 4 2 1` on one line), then use a `do-while` loop to count the digits of `x` and print `Digits: 5`.
