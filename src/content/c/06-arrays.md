---
title: Arrays
summary: Store a list of values of the same type.
level: beginner
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          int scores[5] = {72, 85, 90, 60, 95};

          // 1. Work out how many elements the array has with sizeof and store it in count
          int count = 0;

          // 2. Use a for loop over the array to find the sum and the biggest score
          int sum = 0;
          int max = scores[0];

          // 3. Print these three lines:
          //    Count: 5
          //    Sum: 402
          //    Max: 95
          // 4. Print the average with one decimal place:  Average: 80.4
          //    (careful: make sure it is not an integer division)

          return 0;
      }
check:
  output: |
    Count: 5
    Sum: 402
    Max: 95
    Average: 80.4
  code:
    - { pattern: 'for\s*\(', message: "Use a for loop to go through the array." }
    - { pattern: 'scores\s*\[\s*\w+\s*\]', message: "Read the elements with scores[i]." }
hints:
  - "The number of elements is the total size of the array divided by the size of one element. Then a for loop with an index i from 0 to count-1 lets you look at scores[i]."
  - "count = sizeof(scores) / sizeof(scores[0]);   inside the loop add scores[i] to sum, and if scores[i] > max then set max = scores[i]. For the average divide by (double) count so the division keeps decimals."
  - "int count = sizeof(scores) / sizeof(scores[0]);   for (int i = 0; i < count; i++) { sum += scores[i]; if (scores[i] > max) { max = scores[i]; } }   printf(\"Average: %.1f\\n\", (double) sum / count);"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          int scores[5] = {72, 85, 90, 60, 95};

          int count = sizeof(scores) / sizeof(scores[0]);
          int sum = 0;
          int max = scores[0];

          for (int i = 0; i < count; i++) {
              sum += scores[i];
              if (scores[i] > max) {
                  max = scores[i];
              }
          }

          printf("Count: %d\n", count);
          printf("Sum: %d\n", sum);
          printf("Max: %d\n", max);
          printf("Average: %.1f\n", (double) sum / count);

          return 0;
      }
quiz:
  - q: What is the index of the FIRST element of an array in C?
    options: ["1", "0", "-1"]
    answer: 1
  - q: For  int a[4];  which indexes are valid?
    options: ["1 to 4", "0 to 4", "0 to 3"]
    answer: 2
  - q: What happens if you read a[10] from an array of 4 elements?
    options: ["C automatically grows the array", "You get undefined behaviour: garbage or a crash", "You always get 0"]
    answer: 1
    explain: "C does not check bounds for you. Going outside the array reads or overwrites unrelated memory."
  - q: What does  sizeof(a) / sizeof(a[0])  give you for an array a?
    options: ["The number of elements", "The size of the first element", "The last index"]
    answer: 0
---

An **array** is a row of boxes of the same type, stored one after another in memory. It lets you keep 5, 50 or 5000 values under a single name instead of inventing `score1`, `score2`, `score3`... In this lesson you will create arrays, read their elements and loop over them.

## Creating an array

Write the element type, a name, and the number of elements in square brackets:

```c
int numbers[3] = {10, 20, 30};   // three ints
double temps[2] = {21.5, 19.0};  // two doubles
int zeros[4] = {0};              // all four elements are 0
int auto_size[] = {1, 2, 3, 4};  // the compiler counts: 4 elements
```

If you create an array **without** giving it values (`int a[4];`), its contents are whatever junk was in memory. Always initialize it before you read it.

## Indexes start at 0

Each element has an **index**, its position. The first element has index **0**:

```c
int numbers[3] = {10, 20, 30};
printf("%d\n", numbers[0]);   // prints: 10
printf("%d\n", numbers[2]);   // prints: 30
numbers[1] = 99;              // change the middle element
```

An array of size 3 has the valid indexes 0, 1 and 2. The last valid index is always `size - 1`.

## Looping over an array

Arrays and `for` loops go together naturally:

```c
int total = 0;
for (int i = 0; i < 3; i++) {
    total += numbers[i];
}
```

## How big is the array?

C arrays do not remember their length. But the `sizeof` operator tells you how many **bytes** something uses, so dividing the whole array by one element gives the element count:

```c
int count = sizeof(numbers) / sizeof(numbers[0]);   // 3
```

This only works in the function where the array was declared (see the pointers lesson for why).

## A note on averages

If `sum` and `count` are both `int`, then `sum / count` is an integer division and drops the decimals. A **cast** such as `(double) sum` converts the value to a `double` first, so the division keeps its decimals:

```c
printf("%.1f\n", (double) 402 / 5);   // prints: 80.4
```

> **Watch out:**
> - **Out-of-bounds access.** `numbers[3]` in an array of size 3 compiles fine but reads memory that is not yours. It may print garbage or crash with `Segmentation fault`. A classic bug is `i <= 3` instead of `i < 3` in the loop.
> - Arrays cannot be assigned or compared with `=` or `==`. `int b[3] = a;` gives `error: invalid initializer`. Copy element by element in a loop.
> - Too many initial values, as in `int a[2] = {1, 2, 3};`, gives `warning: excess elements in array initializer`.
> - Using `int a[n]` with a changing size is possible in modern C but risky. Prefer a fixed size or the dynamic memory lesson.

## Going further

Also find the smallest score. Then try printing the scores backwards using a loop that counts down from `count - 1` to `0`.

> **Your turn:** compute `count` with `sizeof`, loop over `scores` to find the sum and the maximum, then print the four lines shown in the comments, including `Average: 80.4`.
