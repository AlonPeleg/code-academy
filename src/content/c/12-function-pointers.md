---
title: Function pointers and callbacks
summary: Store a function in a variable, pass it to other functions, and sort with qsort.
level: advanced
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <stdlib.h>

      int add(int a, int b) { return a + b; }
      int multiply(int a, int b) { return a * b; }

      // 1. Finish apply: it receives a function pointer called op, which takes two ints
      //    and returns an int, and returns the result of calling op with x and y.
      int apply(int x, int y /* add the function pointer parameter here */) {
          return 0;
      }

      // 2. Comparison functions for qsort. They receive two void pointers to elements of the array.
      //    Return a negative number if the first int is smaller, 0 if equal, a positive number if bigger.
      int compare_ascending(const void *a, const void *b) {
          return 0;
      }

      // Same, but for sorting from the biggest to the smallest.
      int compare_descending(const void *a, const void *b) {
          return 0;
      }

      void print_array(const int *arr, int n) {
          for (int i = 0; i < n; i++) {
              printf("%d ", arr[i]);
          }
          printf("\n");
      }

      int main(void) {
          // 3. Print the result of apply(6, 7, add) as  Sum: 13  and apply(6, 7, multiply) as  Product: 42
          //    (pass the function names without brackets).

          int numbers[] = {42, 7, 19, 3, 25, 11};
          int n = sizeof(numbers) / sizeof(numbers[0]);

          // 4. Sort numbers with qsort using compare_ascending and print with print_array.
          //    Then sort again with compare_descending and print again.
          //    qsort(array, number_of_elements, size_of_one_element, comparison_function);

          return 0;
      }
check:
  output: |
    Sum: 13
    Product: 42
    3 7 11 19 25 42 
    42 25 19 11 7 3 
  code:
    - { pattern: 'int\s*\(\s*\*\s*\w+\s*\)\s*\(\s*int\s*,\s*int\s*\)', message: "The parameter type is  int (*op)(int, int)." }
    - { pattern: 'qsort\s*\(\s*numbers\s*,[^;]*compare_ascending', message: "Sort with qsort(numbers, n, sizeof(int), compare_ascending)." }
    - { pattern: 'qsort\s*\(\s*numbers\s*,[^;]*compare_descending', message: "Sort again with compare_descending." }
    - { pattern: 'apply\s*\(\s*6\s*,\s*7\s*,\s*multiply\s*\)', message: "Call apply(6, 7, multiply)." }
hints:
  - "A function pointer holds the address of a function, so you can pass 'what to do' as an argument. The type of such a parameter is written like the function's signature with the name in brackets after a star."
  - "Parameter: int (*op)(int, int). Inside apply: return op(x, y). A qsort comparison reads the ints with *(const int *)a and *(const int *)b, and returns a negative, zero or positive number (for example the difference, or (x > y) - (x < y))."
  - "int apply(int x, int y, int (*op)(int, int)) { return op(x, y); }   int compare_ascending(const void *a, const void *b) { int x = *(const int *)a; int y = *(const int *)b; return (x > y) - (x < y); }   (descending: swap x and y)   qsort(numbers, n, sizeof(int), compare_ascending);"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <stdlib.h>

      int add(int a, int b) { return a + b; }
      int multiply(int a, int b) { return a * b; }

      int apply(int x, int y, int (*op)(int, int)) {
          return op(x, y);
      }

      int compare_ascending(const void *a, const void *b) {
          int x = *(const int *)a;
          int y = *(const int *)b;
          return (x > y) - (x < y);
      }

      int compare_descending(const void *a, const void *b) {
          int x = *(const int *)a;
          int y = *(const int *)b;
          return (y > x) - (y < x);
      }

      void print_array(const int *arr, int n) {
          for (int i = 0; i < n; i++) {
              printf("%d ", arr[i]);
          }
          printf("\n");
      }

      int main(void) {
          printf("Sum: %d\n", apply(6, 7, add));
          printf("Product: %d\n", apply(6, 7, multiply));

          int numbers[] = {42, 7, 19, 3, 25, 11};
          int n = sizeof(numbers) / sizeof(numbers[0]);

          qsort(numbers, n, sizeof(int), compare_ascending);
          print_array(numbers, n);

          qsort(numbers, n, sizeof(int), compare_descending);
          print_array(numbers, n);

          return 0;
      }
quiz:
  - q: What does the declaration  int (*op)(int, int)  mean?
    options: ["op is a function that returns a pointer to int", "op is a pointer to a function that takes two ints and returns an int", "op is an array of two ints"]
    answer: 1
  - q: How do you pass the function add to another function?
    options: ["add(1, 2)", "&add()", "add"]
    answer: 2
    explain: "A function name without brackets is its address. With brackets you would call it and pass its result."
  - q: What must a qsort comparison function return when the first element should come BEFORE the second?
    options: ["A negative number", "A positive number", "Always 0"]
    answer: 0
  - q: Why does the qsort comparison receive const void * parameters?
    options: ["Because C does not have int pointers", "To make the sort faster", "So that qsort can sort any type of element: you cast them back to the real type inside"]
    answer: 2
---

So far you passed **data** to functions. In C you can also pass **a function** to a function, which lets one piece of code say "do the sorting, and use *this* rule to decide the order". A variable that holds the address of a function is a **function pointer**. They power callbacks, plug-in systems, and the standard library's `qsort`.

## Functions have addresses

Every function lives somewhere in memory, and its name, written without brackets, is its address:

```c
int add(int a, int b) { return a + b; }

int (*op)(int, int) = add;     // op points to add
printf("%d\n", op(2, 3));      // prints: 5
```

How to read `int (*op)(int, int)`: start in the middle. `op` is a pointer (`*op`) to a function that takes `(int, int)` and returns `int`. The brackets around `*op` are essential. Without them, `int *op(int, int)` declares a function that returns an `int *`.

You call through the pointer as `op(2, 3)` (or the older spelling `(*op)(2, 3)`).

## Passing a function as an argument

A function parameter can be a function pointer. This is called a **callback**: you hand over a function that the other code will call back later.

```c
int apply(int x, int y, int (*op)(int, int)) {
    return op(x, y);
}

printf("%d\n", apply(6, 7, add));        // prints: 13
printf("%d\n", apply(6, 7, multiply));   // prints: 42
```

`apply` does not know what `op` does. It only knows the shape: two ints in, one int out. Swap the function and you change the behaviour without touching `apply`.

For readability many programmers give the type a name with `typedef`:

```c
typedef int (*BinaryOp)(int, int);
int apply(int x, int y, BinaryOp op);
```

## Sorting with qsort

`<stdlib.h>` provides `qsort`, a fast sort that works on **any** array, because you tell it how to compare two elements:

```c
qsort(array, count, size_of_one_element, compare);
```

| Argument | Meaning |
| --- | --- |
| `array` | the array to sort |
| `count` | how many elements |
| `size_of_one_element` | `sizeof(int)` for an int array |
| `compare` | your callback |

The callback has a fixed signature. It gets two **`const void *`** pointers (a pointer to "something"), because `qsort` does not know the element type. Inside, you cast them back and compare:

```c
int compare_ascending(const void *a, const void *b) {
    int x = *(const int *)a;     // cast to int pointer, then read the value
    int y = *(const int *)b;
    return (x > y) - (x < y);    // -1, 0 or 1
}
```

The return value tells `qsort` the order: **negative** means `a` goes first, **zero** means equal, **positive** means `b` goes first. The expression `(x > y) - (x < y)` produces exactly -1, 0 or 1. To sort **descending**, just swap `x` and `y`.

Writing `return x - y;` is common but dangerous: for large values (like `INT_MAX` minus a negative number) the subtraction overflows and gives the wrong sign.

## Going further

The same idea sorts strings or structs: only the cast changes. For an array of structs you would write `const struct Person *p = a;` and compare `p->age`.

> **Watch out:**
> - `int *op(int, int)` instead of `int (*op)(int, int)`: it compiles, but declares a function, not a pointer, and you get `warning: initialization of 'int *' from incompatible pointer type`.
> - Passing `add()` instead of `add`: you call the function and pass an `int`. Error: `passing argument 3 of 'apply' makes pointer from integer without a cast`.
> - Wrong comparison signature (for example `int cmp(int *a, int *b)`): `warning: passing argument 4 of 'qsort' from incompatible pointer type`, and the program may behave strangely.
> - Passing the wrong `count` or `sizeof` to `qsort`: it sorts garbage or crashes. Use `sizeof(array) / sizeof(array[0])` for the count, and `sizeof(array[0])` for the element size.
> - Calling through a `NULL` function pointer crashes with `Segmentation fault`.

> **Your turn:** finish `apply` using an `int (*op)(int, int)` parameter, write the two comparison functions, print `Sum: 13` and `Product: 42`, then sort `numbers` ascending and descending with `qsort` and print both results.
