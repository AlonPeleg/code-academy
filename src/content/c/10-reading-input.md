---
title: Reading input with scanf
summary: Ask the user for values while the program runs.
level: intermediate
runner: remote
stdin: |
  Ava 20
  4
  10 20 30 40
  5 6 7
files:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          char name[20];
          int age = 0;
          int n = 0;
          int sum = 0;
          int extra = 0;
          int value = 0;

          // The input (see the Input tab) looks like this:
          //   Ava 20
          //   4
          //   10 20 30 40
          //   5 6 7

          // 1. Read the name (a string, so no & and a width limit of 19) and the age.
          //    Print:  Hello, Ava! Next year you will be 21.

          // 2. Read n (the count, here 4), then read n numbers in a for loop,
          //    adding each to sum. Print:  Sum: 100

          // 3. Keep reading numbers until reading fails (it returns something other
          //    than 1 at the end of the input) and add them to extra.
          //    Print:  Extra: 18

          return 0;
      }
check:
  output: |
    Hello, Ava! Next year you will be 21.
    Sum: 100
    Extra: 18
  code:
    - { pattern: 'scanf\s*\(', message: "Use scanf to read the input." }
    - { pattern: '&\s*age', message: "scanf needs the address of age: &age." }
    - { pattern: 'for\s*\(', message: "Use a for loop to read the n numbers." }
    - { pattern: 'while\s*\(', message: "Use a while loop that keeps reading until scanf fails." }
hints:
  - "scanf reads values from the input according to a format string, like printf in reverse. Each value goes into a variable, and for numbers you pass the address of the variable."
  - "scanf(\"%19s %d\", name, &age); reads a word and a number (name is an array so it needs no &). To read n numbers, loop n times with scanf(\"%d\", &value). The last loop is while (scanf(\"%d\", &value) == 1)."
  - "scanf(\"%19s %d\", name, &age); printf(\"Hello, %s! Next year you will be %d.\\n\", name, age + 1);   scanf(\"%d\", &n); for (int i = 0; i < n; i++) { scanf(\"%d\", &value); sum += value; }   while (scanf(\"%d\", &value) == 1) { extra += value; }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          char name[20];
          int age = 0;
          int n = 0;
          int sum = 0;
          int extra = 0;
          int value = 0;

          scanf("%19s %d", name, &age);
          printf("Hello, %s! Next year you will be %d.\n", name, age + 1);

          scanf("%d", &n);
          for (int i = 0; i < n; i++) {
              scanf("%d", &value);
              sum += value;
          }
          printf("Sum: %d\n", sum);

          while (scanf("%d", &value) == 1) {
              extra += value;
          }
          printf("Extra: %d\n", extra);

          return 0;
      }
quiz:
  - q: Why do we write  scanf("%d", &n)  with an &?
    options: ["It makes the number positive", "scanf needs the address of n so it can store the value there", '& means "and" between two values']
    answer: 1
  - q: What does scanf return?
    options: ["The text it read", "Always 0", "How many values it successfully read"]
    answer: 2
    explain: "So scanf(\"%d\", &x) == 1 tells you that a number was really read. At the end of the input it returns EOF (-1)."
  - q: Which format reads a decimal number into a double?
    options: ["%lf", "%d", "%c"]
    answer: 0
  - q: Why do we use %19s for a char name[20]?
    options: ["19 is the number of words", "It stops scanf from writing more than 19 letters plus the terminator", "The 19 is the age"]
    answer: 1
---

Programs get much more interesting when they react to data from the outside. In C the classic way to read what the user types (the **standard input**) is `scanf`. It is the mirror image of `printf`: you give it a format and it fills your variables. In this lesson you will use it for words, whole numbers and for reading until the input ends.

## How scanf works

```c
int age;
scanf("%d", &age);
```

- The text in quotes is the **format**. `%d` means "read a whole number".
- After the format come the **addresses** of the variables to fill in. `&age` means "the address of `age`" (you met `&` in the pointers lesson). `scanf` writes the number into that address.
- Whitespace (spaces and new lines) in the input is skipped for `%d`, `%s` and `%lf`, so numbers can be on one line or several.

| Format | Reads into | Variable |
| --- | --- | --- |
| `%d` | whole number | `int` |
| `%lf` | decimal number | `double` |
| `%c` | one character | `char` |
| `%s` | one word (stops at whitespace) | `char` array |

You can read several values in one call: `scanf("%s %d", name, &age);` reads a word and then a number.

## Strings are special

A string variable is already an array, which acts like an address, so you write `name` and **not** `&name`. Also give a width so that a long word cannot overflow the array: for `char name[20]` use `%19s` (19 letters plus the `\0`).

```c
char name[20];
scanf("%19s", name);
printf("Hi %s\n", name);
```

`%s` stops at the first space, so it reads a single word only. To read a whole line you would use `fgets`.

## Checking that reading worked

`scanf` returns how many values it managed to read. If the input has ended or contains text where a number was expected, it returns fewer than you asked for (at end of input it returns the special value `EOF`, which is `-1`). That makes a very handy loop:

```c
int v, total = 0;
while (scanf("%d", &v) == 1) {
    total += v;
}
```

The loop keeps going as long as a number could be read. Given the input `1 2 3` it adds up to 6.

## Where does the input come from?

This site feeds the text from the **Input** tab of the editor into your program, as if someone had typed it. Change the text there and press Run again to test other values. Your program should handle whatever is in the input without a prompt like "Enter a number:" (a prompt is fine, but remember it is part of the output).

> **Watch out:**
> - Forgetting the `&`: `scanf("%d", age);` compiles with `warning: format '%d' expects argument of type 'int *'` and then usually crashes.
> - Using `%d` for a `double`: it stores the wrong bytes. Use `%lf` in `scanf` (while `printf` uses `%f` for double).
> - Using `%s` without a width can overflow the array and crash. Always write `%19s` style limits.
> - A variable you never read stays at its old value. Initialize variables (`int age = 0;`) so a failed `scanf` leaves something predictable.

## Going further

Try different text in the Input tab: more numbers, or a word where a number should be. Print the value returned by `scanf` to see what it returns.

> **Your turn:** read the name and age and print the greeting, read `n` and then `n` numbers to print their `Sum`, and finally keep reading numbers until `scanf` stops returning `1` and print their total as `Extra`.
