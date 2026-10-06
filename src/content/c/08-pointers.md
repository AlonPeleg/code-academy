---
title: Pointers
summary: Variables that hold the address of another variable, and functions that change their arguments.
level: intermediate
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>

      // 2. Make swap exchange the two values that a and b point to
      void swap(int *a, int *b) {
          // your code here
      }

      // 3. Make double_all multiply each of the n ints that arr points to by 2
      void double_all(int *arr, int n) {
          // your code here
      }

      int main(void) {
          int x = 10;
          int *p = NULL;

          // 1. Make p point at x (use the address-of operator), then use p
          //    to set x to 25. Do not assign to x directly.
          printf("x is %d\n", x);

          int a = 3;
          int b = 7;
          swap(&a, &b);
          printf("After swap: a=%d b=%d\n", a, b);

          int nums[3] = {1, 2, 3};
          double_all(nums, 3);
          printf("Doubled: %d %d %d\n", nums[0], nums[1], nums[2]);

          return 0;
      }
check:
  output: |
    x is 25
    After swap: a=7 b=3
    Doubled: 2 4 6
  code:
    - { pattern: 'p\s*=\s*&\s*x', message: "Point p at x with p = &x;" }
    - { pattern: '\*\s*p\s*=\s*25', message: "Change x through the pointer with *p = 25;" }
hints:
  - "A pointer stores an address. The & operator gives the address of a variable, and the * operator in front of a pointer reaches the value it points to."
  - "In main: p = &x; then *p = 25;.  In swap, save *a in a temporary int, then *a = *b; and *b = temp;.  In double_all, loop i from 0 to n-1 and double arr[i] (or *(arr + i))."
  - "p = &x; *p = 25;   void swap(int *a, int *b) { int temp = *a; *a = *b; *b = temp; }   void double_all(int *arr, int n) { for (int i = 0; i < n; i++) { arr[i] = arr[i] * 2; } }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      void swap(int *a, int *b) {
          int temp = *a;
          *a = *b;
          *b = temp;
      }

      void double_all(int *arr, int n) {
          for (int i = 0; i < n; i++) {
              arr[i] = arr[i] * 2;
          }
      }

      int main(void) {
          int x = 10;
          int *p = NULL;

          p = &x;
          *p = 25;
          printf("x is %d\n", x);

          int a = 3;
          int b = 7;
          swap(&a, &b);
          printf("After swap: a=%d b=%d\n", a, b);

          int nums[3] = {1, 2, 3};
          double_all(nums, 3);
          printf("Doubled: %d %d %d\n", nums[0], nums[1], nums[2]);

          return 0;
      }
quiz:
  - q: What does the & operator give you in  &x ?
    options: ["The value of x doubled", "The address of x in memory", "A copy of x"]
    answer: 1
  - q: Given  int *p = &x;  what does *p mean?
    options: ["The address of p", "p multiplied by something", "The value stored at the place p points to"]
    answer: 2
  - q: Why does swap need pointers as parameters?
    options: ["C passes arguments by copy, so only pointers can change the caller's variables", "Pointers make the function faster", "Functions cannot have two parameters otherwise"]
    answer: 0
  - q: What happens if you use *p while p is NULL?
    options: ["It prints 0", "The program crashes (segmentation fault)", "p is set to a new variable"]
    answer: 1
---

Pointers have a scary reputation, but the idea is simple. Every variable lives somewhere in the computer's memory, and every place in memory has an **address** (a number). A **pointer** is a variable that stores such an address. They let functions change the caller's variables, work with arrays efficiently and build dynamic data. Understanding them is the key step in learning C.

## Addresses and pointers

```c
int x = 10;
int *p = &x;      // p holds the address of x

printf("%d\n", x);    // prints: 10
printf("%d\n", *p);   // prints: 10   (follow the pointer)

*p = 25;              // change the value p points to
printf("%d\n", x);    // prints: 25
```

The symbols, piece by piece:

- `int *p` declares `p` as a **pointer to int**. The `*` in a declaration means "pointer".
- `&x` is the **address-of** operator: "where does x live?".
- `*p` in an expression is the **dereference** operator: "go to the address in p and give me what is there". You can read it or assign to it.

Think of `x` as a house, `&x` as its street address written on a card, and `p` as the person holding the card. `*p` is walking to the house.

## Why functions need pointers

C passes arguments **by value**, meaning the function gets a copy. This function cannot work:

```c
void broken(int n) {
    n = 99;          // changes only the local copy
}
```

If you pass the address instead, the function can reach the original:

```c
void set99(int *n) {
    *n = 99;
}

int v = 1;
set99(&v);
printf("%d\n", v);   // prints: 99
```

That is how `scanf` fills your variables too (a later lesson).

## Pointers and arrays

An array's name turns into a pointer to its first element when you pass it to a function. That is why the function receives only the address and you must pass the length separately (and why `sizeof` does not work on it there):

```c
void print_all(int *arr, int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);   // arr[i] is the same as *(arr + i)
    }
}
```

Adding 1 to a pointer moves it to the **next element** of its type, so `*(arr + 1)` is `arr[1]`. Changes made through `arr[i]` inside the function change the caller's array, because no copy of the array was made.

> **Watch out:**
> - An uninitialized pointer (`int *p;`) points to a random place. Dereferencing it usually crashes with `Segmentation fault`. Start pointers as `NULL` or point them at something real, and never use `*p` while `p` is `NULL`.
> - Mixing up `*` meaning: `int *p = &x;` declares and sets the pointer, but `*p = 5;` later writes to what it points to. `p = 5;` instead tries to move the pointer itself and gives `warning: assignment to 'int *' from 'int' makes pointer from integer without a cast`.
> - Forgetting `&` when calling `swap(a, b)` gives `warning: passing argument 1 of 'swap' makes pointer from integer without a cast`.
> - Never print or rely on the numeric value of an address in a program whose output must be predictable. It differs from run to run.

## Going further

Write `void minmax(int *arr, int n, int *min, int *max)` that fills in two results through pointers. This is the C way for a function to return more than one value.

> **Your turn:** in `main`, point `p` at `x` and set `x` to 25 through `p`. Then fill in `swap` (exchange the values `a` and `b` point to) and `double_all` (double every element). The program should print `x is 25`, `After swap: a=7 b=3` and `Doubled: 2 4 6`.
