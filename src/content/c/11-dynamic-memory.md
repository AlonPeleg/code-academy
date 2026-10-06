---
title: Dynamic memory with malloc
summary: Ask for memory while the program runs, and give it back with free.
level: intermediate
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      int main(void) {
          int n = 5;
          int *arr = NULL;

          // 1. Ask for room for n ints with malloc, asking for n * sizeof(int) bytes.
          //    If it gave you NULL, print "Out of memory" and return 1.
          // 2. Fill arr so that arr[i] is i * i, then print:  Squares: 0 1 4 9 16
          //    (print the numbers in a loop, each followed by a space, then a new line)

          // 3. Grow the block to hold 8 ints with realloc, set the new slots the same way
          //    (i * i), and print:  Grown: 0 1 4 9 16 25 36 49
          // 4. Release the block with free.

          char *text = "hello";
          char *copy = NULL;
          // 5. Make copy a heap copy of text: allocate strlen(text) + 1 bytes
          //    (the extra byte is for the null terminator), copy the text in with
          //    strcpy, print:  Copy: hello   and free it.

          return 0;
      }
check:
  output: |
    Squares: 0 1 4 9 16
    Grown: 0 1 4 9 16 25 36 49
    Copy: hello
  code:
    - { pattern: 'malloc\s*\(', message: "Use malloc to get memory." }
    - { pattern: 'realloc\s*\(', message: "Use realloc to grow the block." }
    - { pattern: 'free\s*\(', message: "Give the memory back with free." }
hints:
  - "malloc(bytes) gives you a block of memory and returns a pointer to it (or NULL). You treat the pointer like an array: arr[i]. Remember to free what you allocated."
  - "arr = malloc(n * sizeof(int));   later arr = realloc(arr, 8 * sizeof(int));   then free(arr);   For the string, allocate strlen(text) + 1 bytes, then strcpy(copy, text)."
  - "arr = malloc(n * sizeof(int)); if (arr == NULL) { printf(\"Out of memory\\n\"); return 1; }   for (int i = 0; i < n; i++) { arr[i] = i * i; }   arr = realloc(arr, 8 * sizeof(int));  for (int i = 5; i < 8; i++) { arr[i] = i * i; }   free(arr);   copy = malloc(strlen(text) + 1); strcpy(copy, text); printf(\"Copy: %s\\n\", copy); free(copy);"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      int main(void) {
          int n = 5;
          int *arr = NULL;

          arr = malloc(n * sizeof(int));
          if (arr == NULL) {
              printf("Out of memory\n");
              return 1;
          }
          for (int i = 0; i < n; i++) {
              arr[i] = i * i;
          }
          printf("Squares:");
          for (int i = 0; i < n; i++) {
              printf(" %d", arr[i]);
          }
          printf("\n");

          int *bigger = realloc(arr, 8 * sizeof(int));
          if (bigger == NULL) {
              free(arr);
              printf("Out of memory\n");
              return 1;
          }
          arr = bigger;
          for (int i = n; i < 8; i++) {
              arr[i] = i * i;
          }
          printf("Grown:");
          for (int i = 0; i < 8; i++) {
              printf(" %d", arr[i]);
          }
          printf("\n");
          free(arr);

          char *text = "hello";
          char *copy = NULL;
          copy = malloc(strlen(text) + 1);
          if (copy == NULL) {
              return 1;
          }
          strcpy(copy, text);
          printf("Copy: %s\n", copy);
          free(copy);

          return 0;
      }
quiz:
  - q: What does malloc(20) return?
    options: ["A pointer to 20 bytes of fresh memory, or NULL on failure", "The number 20", "An array of 20 ints that is freed automatically"]
    answer: 0
  - q: What must you do with memory you got from malloc once you are done?
    options: ["Nothing, C cleans it up", "Call free on it", "Set the pointer to 0 only"]
    answer: 1
  - q: Why does a copy of a string need strlen(s) + 1 bytes?
    options: ["The extra byte is a spare", "C always wastes one byte", 'Room for the null terminator \0']
    answer: 2
  - q: What is a memory leak?
    options: ["Memory that was allocated but never freed", "Running out of disk space", "Using a variable before declaring it"]
    answer: 0
---

All the variables so far had a size fixed when you wrote the program. What if you do not know how many items you will need until the program runs, for example the number of lines in a file? C lets you ask the operating system for memory **at run time** with `malloc`, and hand it back with `free`. This region of memory is called the **heap**.

## malloc and free

```c
#include <stdlib.h>

int *numbers = malloc(3 * sizeof(int));   // room for 3 ints
numbers[0] = 10;
numbers[1] = 20;
numbers[2] = 30;
printf("%d\n", numbers[1]);   // prints: 20
free(numbers);               // give it back
```

- `malloc(bytes)` reserves that many bytes and returns a **pointer** to the first one. It lives in `<stdlib.h>`.
- `sizeof(int)` is the size of one int, so `3 * sizeof(int)` is enough for three. Always multiply by `sizeof` of the type instead of guessing sizes.
- You use the pointer exactly like an array: `numbers[i]`.
- `free(pointer)` releases the memory so it can be reused. Every `malloc` should have exactly one `free`.

## Check for failure

If the system cannot give you the memory, `malloc` returns `NULL`. For serious programs always check:

```c
if (numbers == NULL) {
    printf("Out of memory\n");
    return 1;
}
```

## Growing with realloc

`realloc(pointer, newBytes)` resizes a block, keeping the old contents. It may move the data to a new place, so always store its return value:

```c
int *bigger = realloc(numbers, 6 * sizeof(int));
if (bigger != NULL) {
    numbers = bigger;
}
```

The old elements are kept; the new ones are **not** initialized, so set them yourself. (`calloc(count, size)` is like `malloc` but fills the memory with zeros.)

## Strings on the heap

A string needs one extra byte for the `\0`:

```c
char *copy = malloc(strlen(text) + 1);
strcpy(copy, text);
...
free(copy);
```

> **Watch out:**
> - **Memory leak**: forgetting `free` means the memory is lost until the program ends. In a long-running program it eats all memory.
> - **Use after free**: reading or writing through a pointer after `free(p)` is undefined behaviour and may crash or print junk. Many programmers set `p = NULL;` right after freeing.
> - **Double free**: calling `free` twice on the same pointer crashes with `free(): double free detected`.
> - **Writing out of bounds**: allocating `n` ints and writing `arr[n]` corrupts the heap. Remember the valid indexes are 0 to n-1.
> - Never read heap memory you have not written to: `malloc` does not clear it, so its content is unpredictable.

## Going further

Allocate an array of 1000 ints, fill it, sum it, and free it. Check what happens if you remove the `+ 1` in the string copy (it is a bug: the terminator is written outside the block).

> **Your turn:** allocate room for 5 ints with `malloc`, fill them with squares and print them, grow the block to 8 with `realloc`, print again and `free` it. Then make a heap copy of `"hello"` and print it.
