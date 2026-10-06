---
title: Strings
summary: Text in C is an array of characters ending in a null terminator.
level: beginner
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char word[20] = "code";
          char copy[40];

          // 1. Print the length of word using strlen:   Length: 4
          //    (strlen returns an unsigned type, so print it with %zu)

          // 2. Copy word into copy with strcpy, then append "-academy" with strcat.
          //    Print:   Copy: code-academy

          // 3. Walk through word one character at a time until you reach the
          //    null character, and print the letters separated by dashes:
          //    Letters: c-o-d-e

          // 4. If strcmp says word and "code" are equal (it returns 0), print: Same word

          return 0;
      }
check:
  output: |
    Length: 4
    Copy: code-academy
    Letters: c-o-d-e
    Same word
  code:
    - { pattern: 'strlen\s*\(', message: "Use strlen to get the length." }
    - { pattern: 'strcpy\s*\(', message: "Use strcpy to copy the string." }
    - { pattern: 'strcat\s*\(', message: "Use strcat to append text." }
    - { pattern: 'strcmp\s*\(', message: "Use strcmp to compare the strings." }
    - { pattern: '\\0', message: "Loop until you reach the null character, written '\\0'." }
hints:
  - "A string is an array of chars. The functions strlen, strcpy, strcat and strcmp from string.h do the common jobs. For the walk, use a loop with an index i."
  - "The loop can be  for (int i = 0; word[i] != '\\0'; i++)  and inside it print word[i] with %c. Print a dash before every letter except the first one (when i > 0). strcmp(a, b) == 0 means the strings are equal."
  - "printf(\"Length: %zu\\n\", strlen(word));   strcpy(copy, word); strcat(copy, \"-academy\"); printf(\"Copy: %s\\n\", copy);   printf(\"Letters: \"); for (int i = 0; word[i] != '\\0'; i++) { if (i > 0) printf(\"-\"); printf(\"%c\", word[i]); } printf(\"\\n\");   if (strcmp(word, \"code\") == 0) { printf(\"Same word\\n\"); }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char word[20] = "code";
          char copy[40];

          printf("Length: %zu\n", strlen(word));

          strcpy(copy, word);
          strcat(copy, "-academy");
          printf("Copy: %s\n", copy);

          printf("Letters: ");
          for (int i = 0; word[i] != '\0'; i++) {
              if (i > 0) {
                  printf("-");
              }
              printf("%c", word[i]);
          }
          printf("\n");

          if (strcmp(word, "code") == 0) {
              printf("Same word\n");
          }

          return 0;
      }
quiz:
  - q: How does C mark the end of a string?
    options: ['With a special null character, \0', "With a semicolon", "A string stores its length in front"]
    answer: 0
  - q: How many bytes does  char s[] = "hi";  occupy?
    options: ["2", "4", "3"]
    answer: 2
    explain: 'The letters h and i plus the invisible \0 at the end make 3.'

  - q: What does strcmp(a, b) return when the two strings are equal?
    options: ["1", "0", "-1"]
    answer: 1
  - q: Which printf placeholder prints a whole string?
    options: ["%c", "%d", "%s"]
    answer: 2
---

C has no built-in text type. A **string** is simply an array of `char`s that ends with a special invisible character, the **null terminator** written `'\0'` (the character with number 0). In this lesson you will create strings, measure them, copy them and compare them.

## Creating strings

```c
char greeting[] = "Hello";   // the compiler makes room for 6 chars
char name[20] = "Ava";       // room for 19 letters + the terminator
```

`"Hello"` takes **6** bytes in memory: `H e l l o \0`. The terminator is how functions like `printf` know where the text stops. Print a string with the `%s` placeholder:

```c
printf("%s\n", greeting);   // prints: Hello
printf("%c\n", greeting[1]); // prints: e   (one character)
```

You can change single characters, for example `greeting[0] = 'J';` makes it `Jello`.

## The string.h helpers

Add `#include <string.h>` to use these functions:

| Function | What it does |
| --- | --- |
| `strlen(s)` | number of characters before the `\0` |
| `strcpy(dest, src)` | copies `src` into `dest` |
| `strcat(dest, src)` | appends `src` to the end of `dest` |
| `strcmp(a, b)` | returns `0` if equal, a negative or positive number otherwise |

```c
char a[20] = "Hi";
strcat(a, " there");
printf("%s has %zu letters\n", a, strlen(a));
// prints: Hi there has 8 letters
```

`strlen` returns an unsigned type called `size_t`; print it with `%zu` (or cast it to `int` and use `%d`).

## Why strcmp and not ==

If you write `a == b` for two strings you compare **where they live in memory**, not what they say. Use `strcmp(a, b) == 0` to ask "are the letters the same?".

## Walking a string

Because the string ends with `'\0'`, you can loop until you find it:

```c
for (int i = 0; greeting[i] != '\0'; i++) {
    printf("%c ", greeting[i]);
}
// prints: H e l l o
```

> **Watch out:**
> - **Buffer too small.** `char small[3] = "Hello";` or copying a long string into a short array writes past the end of the array, which may crash or corrupt other variables (`warning: initializer-string for array of chars is too long`). Always make the destination big enough for the text **plus one** for the terminator.
> - Single versus double quotes: `'a'` is one character (a number really), `"a"` is a string of two bytes (`a` and `\0`). `char c = "a";` gives `warning: initialization of 'char' from 'char *' makes integer from pointer`.
> - You cannot assign a string with `=` after declaring it: `name = "Bob";` gives `error: assignment to expression with array type`. Use `strcpy(name, "Bob");`.
> - `char s[5]; printf("%s", s);` prints junk, because nothing put a `\0` in the array. Initialize your strings.

## Going further

Write a loop that counts how many times the letter `'o'` appears in a string without using `strlen`.

> **Your turn:** follow the numbered comments: print the length of `word`, build `code-academy` with `strcpy` and `strcat`, print the letters separated by dashes by looping until `'\0'`, and use `strcmp` to print `Same word`.
