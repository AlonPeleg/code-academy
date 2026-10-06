---
title: Variables, mutability and types
summary: Learn that Rust variables are immutable by default, how mut and shadowing work, and the basic number types.
level: beginner
runner: remote
files:
  - name: main.rs
    code: |
      const MAX_LIVES: u32 = 3;

      fn main() {
          // 1. counter starts at 10. Make it mutable and add 5 to it.
          let counter = 10;
          println!("counter: {}", counter);

          // 2. Shadow the variable spaces: create a new spaces that holds the
          //    length of the old one (a string has a len method).
          let spaces = "   ";
          println!("spaces: {}", spaces);

          // 3. total and count are whole numbers. Compute the average as a
          //    decimal number by converting both to f64 first.
          let total: i32 = 7;
          let count: i32 = 2;
          let average = 0.0;
          println!("average: {}", average);

          println!("lives: {}", MAX_LIVES);
      }
check:
  output: |
    counter: 15
    spaces: 3
    average: 3.5
    lives: 3
  code:
    - { pattern: 'let\s+mut\s+counter', message: "Declare counter with let mut so it can change." }
    - { pattern: 'let\s+spaces\s*=\s*spaces\.len\(\)', message: "Shadow spaces with let spaces = spaces.len();" }
    - { pattern: 'as\s+f64', message: "Convert with 'as f64' before dividing." }
hints:
  - "Variables in Rust cannot change unless you say so with mut. A second let with the same name creates a brand new variable that hides the old one (shadowing)."
  - "let mut counter = 10; then counter += 5; before the println. For the average, write total as f64 / count as f64 so the division keeps its decimals."
  - "let mut counter = 10; counter += 5;   let spaces = spaces.len();   let average = total as f64 / count as f64;"
solution:
  - name: main.rs
    code: |
      const MAX_LIVES: u32 = 3;

      fn main() {
          let mut counter = 10;
          counter += 5;
          println!("counter: {}", counter);

          let spaces = "   ";
          let spaces = spaces.len();
          println!("spaces: {}", spaces);

          let total: i32 = 7;
          let count: i32 = 2;
          let average = total as f64 / count as f64;
          println!("average: {}", average);

          println!("lives: {}", MAX_LIVES);
      }
quiz:
  - q: "What happens if you write  let x = 5;  x = 6;  ?"
    options: ["x becomes 6", "Compile error: cannot assign twice to immutable variable", "x stays 5 and nothing is reported"]
    answer: 1
  - q: "What is shadowing?"
    options: ["Changing a mut variable", "Declaring a new variable with the same name using let, which hides the old one", "Deleting a variable"]
    answer: 1
    explain: "Shadowing even lets you change the type, for example from text to a number."
  - q: "What does 7 / 2 give when both are integers?"
    options: ["3.5", "3", "4"]
    answer: 1
    explain: "Integer division throws away the remainder. Convert to f64 for 3.5."
  - q: "How is a constant different from a let variable?"
    options: ["A constant needs an explicit type and can never change", "A constant is always a string", "There is no difference"]
    answer: 0
---

In many languages a variable is a box whose content you can change at any time. In Rust, variables are **immutable by default**: once you give them a value, it stays that way unless you ask otherwise. This sounds limiting, but it makes programs easier to understand: if you see `let x = 5;` you know x is 5 for as long as it lives.

## let and mut

```rust
let x = 5;
// x = 6;          // error[E0384]: cannot assign twice to immutable variable `x`

let mut y = 5;
y = 6;             // fine, y is mutable
y += 1;            // y is now 7
```

`mut` is short for *mutable* (changeable). The shortcuts `+=`, `-=`, `*=` and `/=` change a variable in place: `y += 1` means `y = y + 1`. There is no `++` in Rust.

## Types

Every value has a type, and the compiler usually guesses it. You can also write it after a colon:

```rust
let age: u8 = 30;
let temperature: f64 = 21.5;
let is_open: bool = true;
let initial: char = 'R';
let greeting: &str = "hello";
```

The most common types:

| Type | Meaning | Example |
| --- | --- | --- |
| `i32` | whole number, can be negative (the default) | `-42` |
| `u32`, `u8`, `u64` | whole number, never negative (`u` = unsigned) | `7` |
| `f64` | decimal number (the default for decimals) | `3.14` |
| `bool` | `true` or `false` | `true` |
| `char` | one character, in single quotes | `'x'` |
| `&str` | text, in double quotes | `"hi"` |

The number after the letter is the number of bits. A `u8` holds 0 to 255, an `i32` about plus or minus two billion. Rust will refuse to compile if you write `let x: u8 = 300;`.

## Converting between types

Rust never converts numbers behind your back. To mix an integer with a decimal, convert with `as`:

```rust
let total: i32 = 7;
let count: i32 = 2;
println!("{}", total / count);                 // prints: 3   (integer division)
println!("{}", total as f64 / count as f64);   // prints: 3.5
```

## Shadowing

You may declare a new variable with the same name using `let` again. The new one **shadows** (hides) the old one:

```rust
let spaces = "   ";
let spaces = spaces.len();   // now spaces is the number 3
```

This is different from `mut`: it creates a new variable, so it may even have a different type. Use shadowing when you transform a value, and `mut` when the value changes over time (a counter, a score).

## Constants

```rust
const MAX_LIVES: u32 = 3;
```

A `const` can never change, must have a type written out, and by convention is `SHOUTING_CASE`. Constants can live outside functions.

> **Watch out:** `error[E0384]: cannot assign twice to immutable variable` means you forgot `mut`.
>
> **Watch out:** `error[E0308]: mismatched types` appears when you mix types, for example `let x: f64 = 5;` (write `5.0`) or `3.5 + 2` (write `2.0`).
>
> **Watch out:** `let mut` only makes the variable changeable, not its type: you cannot put text into a number variable.
>
> **Watch out:** a warning like `unused variable` is not an error. Prefix a name with an underscore (`_x`) to silence it.

> **Your turn:** make `counter` mutable and add 5 to it, shadow `spaces` with its own length (`spaces.len()`), and compute `average` as `total as f64 / count as f64`.
