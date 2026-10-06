---
title: Bit manipulation
summary: Use the bitwise operators to set, clear, toggle and test individual bits, and pack flags into one integer.
level: advanced
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>

      #define READ  1u   /* binary 001 */
      #define WRITE 2u   /* binary 010 */
      #define EXEC  4u   /* binary 100 */

      // Prints the lowest 4 bits of value, for example 5 prints 0101 (provided for you).
      void print_bits(unsigned int value) {
          for (int i = 3; i >= 0; i--) {
              printf("%u", (value >> i) & 1u);
          }
          printf("\n");
      }

      // 1. Return how many bits are 1 in value (count them in a loop: check the lowest bit with
      //    AND 1, then shift the value one place to the right).
      int count_ones(unsigned int value) {
          return 0;
      }

      int main(void) {
          unsigned int perms = 0;

          // 2. Turn on READ and WRITE using the OR operator, then print_bits(perms)  -> 0011
          // 3. Turn off WRITE using AND with the inverted flag (~), then print_bits(perms)  -> 0001
          // 4. Flip EXEC using XOR, then print_bits(perms)  -> 0101
          // 5. Print "Can exec: 1" by testing the EXEC bit with AND (use !!(...) or != 0 to get 0 or 1)
          // 6. Print "Ones: " followed by count_ones(perms), then a new line  -> Ones: 2
          // 7. Print "Shifted: " and 3 shifted left by 4 places (3 << 4)  -> Shifted: 48

          return 0;
      }
check:
  output: |
    0011
    0001
    0101
    Can exec: 1
    Ones: 2
    Shifted: 48
  code:
    - { pattern: '\|=', message: "Turn bits on with |=  (for example perms |= READ | WRITE;)." }
    - { pattern: '&=\s*~', message: "Turn a bit off with  &= ~FLAG." }
    - { pattern: '\^=', message: "Flip a bit with  ^=  (XOR)." }
    - { pattern: '>>=', message: "In count_ones shift the value right with  >>=  or >> ." }
hints:
  - "Each flag is one bit. OR (|) turns bits on, AND with the inverted flag (& ~flag) turns them off, XOR (^) flips them, and AND (&) tests them. The compound versions |=, &=, ^= change the variable itself."
  - "perms |= READ | WRITE;   perms &= ~WRITE;   perms ^= EXEC;   printf(\"Can exec: %d\\n\", (perms & EXEC) != 0);   For count_ones loop while (value != 0) { count += value & 1u; value >>= 1; }"
  - "int count = 0; while (value != 0) { count += value & 1u; value >>= 1; } return count;   ...   printf(\"Ones: %d\\n\", count_ones(perms));   printf(\"Shifted: %d\\n\", 3 << 4);"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      #define READ  1u
      #define WRITE 2u
      #define EXEC  4u

      void print_bits(unsigned int value) {
          for (int i = 3; i >= 0; i--) {
              printf("%u", (value >> i) & 1u);
          }
          printf("\n");
      }

      int count_ones(unsigned int value) {
          int count = 0;
          while (value != 0) {
              count += value & 1u;
              value >>= 1;
          }
          return count;
      }

      int main(void) {
          unsigned int perms = 0;

          perms |= READ | WRITE;
          print_bits(perms);

          perms &= ~WRITE;
          print_bits(perms);

          perms ^= EXEC;
          print_bits(perms);

          printf("Can exec: %d\n", (perms & EXEC) != 0);
          printf("Ones: %d\n", count_ones(perms));
          printf("Shifted: %d\n", 3 << 4);

          return 0;
      }
quiz:
  - q: Which operator turns a bit ON without touching the others?
    options: ["x &= FLAG", "x ^= ~FLAG", "x |= FLAG"]
    answer: 2
  - q: What does  x &= ~FLAG  do?
    options: ["Clears (turns off) the FLAG bit and leaves the other bits alone", "Sets the FLAG bit", "Flips every bit of x"]
    answer: 0
  - q: What is 1 << 3?
    options: ["3", "8", "13"]
    answer: 1
    explain: "Shifting left by n multiplies by 2 to the power n. 1 << 3 is 1 * 8 = 8, binary 1000."
  - q: Why are unsigned integers preferred for bit manipulation?
    options: ["They are faster", "Signed integers have no bits", "Shifting and masking signed negative values has surprising or undefined results"]
    answer: 2
---

Everything in a computer is stored as **bits**, ones and zeros. Usually you do not care, but in C you can reach in and work on single bits. That is how drivers talk to hardware, how network protocols pack data, how file permissions work, and how one `int` can hold a dozen yes/no settings.

## Binary in one minute

A number like 5 is stored as `0101`: from the right, the places are worth 1, 2, 4, 8. So `0101` is 4 + 1. Each place is a **bit**; the right-most one is bit 0.

## The bitwise operators

| Operator | Name | Rule for each bit pair | Example |
| --- | --- | --- | --- |
| `a & b` | AND | 1 only if both are 1 | `0110 & 0011` = `0010` |
| `a \| b` | OR | 1 if at least one is 1 | `0110 \| 0011` = `0111` |
| `a ^ b` | XOR | 1 if exactly one is 1 | `0110 ^ 0011` = `0101` |
| `~a` | NOT | flips every bit | `~0110` = `1001` (in 4 bits) |
| `a << n` | shift left | moves bits left by n, fills with 0 | `0011 << 2` = `1100` |
| `a >> n` | shift right | moves bits right by n | `1100 >> 2` = `0011` |

Do not confuse them with the logical operators: `&&`, `||` and `!` work on whole truth values, `&`, `|` and `~` work on individual bits.

Shifting left by n multiplies by 2^n, so `3 << 4` is 3 * 16 = 48. Shifting right divides by 2^n (rounding down).

## Flags: several yes/no values in one number

Give each setting its own bit:

```c
#define READ  1u   // 001
#define WRITE 2u   // 010
#define EXEC  4u   // 100

unsigned int perms = 0;
```

Then the four classic moves:

```c
perms |= READ | WRITE;      // SET bits:    000 -> 011
perms &= ~WRITE;            // CLEAR a bit: 011 -> 001
perms ^= EXEC;              // TOGGLE:      001 -> 101
if (perms & EXEC) { ... }   // TEST: non-zero when the bit is on
```

- **Set** with OR: OR with a 1 always gives 1, and OR with 0 changes nothing.
- **Clear** with AND and the inverted flag: `~WRITE` is `...101`, so everything but bit 1 survives.
- **Toggle** with XOR: XOR with 1 flips, XOR with 0 keeps.
- **Test** with AND: only the flag's bit can survive, so the result is non-zero exactly when it is on. `(perms & EXEC) != 0` turns that into 0 or 1.

The same trick with `1u << n` builds a mask for bit number n: `perms |= 1u << 5;` sets bit 5.

## Counting bits

To count the ones, look at the lowest bit with `value & 1u`, add it to a counter, then shift everything right so the next bit arrives at the bottom. Stop when no bits are left. (There is a faster loop with `value &= value - 1`, which removes the lowest set bit each time, and compilers even offer built-in functions like `__builtin_popcount`.)

> **Watch out:**
> - `&` versus `&&`: `if (flags & READ && flags & WRITE)` has precedence surprises. Use brackets: `if ((flags & READ) && (flags & WRITE))`. Also `x & 1 == 0` is read as `x & (1 == 0)`, so write `(x & 1) == 0`.
> - Shifting a **signed** value into the sign bit, or by a number of places equal to or larger than the width (such as `1 << 32` on a 32-bit int), is undefined behaviour. Use `unsigned` types and `1u`.
> - `>>` on negative signed numbers is implementation-defined (usually it copies the sign bit). Use unsigned for bit puzzles.
> - Forgetting that `~` flips **all** bits of the type: `~1u` is a huge number, not 0. Combine it with `&`.
> - Printing with the wrong format, for example `%d` for an `unsigned int`: `warning: format '%d' expects argument of type 'int'`.

## Going further

Write `print_bits` with 8 bits, and try swapping two variables with three XORs (`a ^= b; b ^= a; a ^= b;`). Check whether a number is a power of two with `(n & (n - 1)) == 0`.

> **Your turn:** finish `count_ones`, then in `main` turn on READ and WRITE, turn off WRITE, flip EXEC, and print the bits after each step. Finally print `Can exec: 1`, `Ones: 2` and `Shifted: 48`.
