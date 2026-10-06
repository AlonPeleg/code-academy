---
title: Hello, Rust
summary: Write your first Rust program, print text with println!, and learn what fn main and placeholders do.
level: beginner
runner: remote
files:
  - name: main.rs
    code: |
      fn main() {
          // 1. Print the line: Hello, Rust!

          // 2. Store the text "Ferris" in a variable called name, then print
          //    the line: Ferris is a crab.
          //    Put a placeholder in the text and give the variable after a comma.

          // 3. Print the line: 2 + 3 = 5
          //    Use three placeholders and pass 2, 3 and 2 + 3 in that order.
      }
check:
  output: |
    Hello, Rust!
    Ferris is a crab.
    2 + 3 = 5
  code:
    - { pattern: 'let\s+name', message: "Create a variable with let name = ...;" }
    - { pattern: 'println!\s*\(\s*"[^"]*\{\}[^"]*"\s*,', message: "Use println! with a {} placeholder and pass the value after a comma." }
hints:
  - "Printing in Rust is done with a macro called println! (note the exclamation mark). Variables are created with the keyword let."
  - "A pair of curly braces inside the text is a placeholder. println!(\"Hi {}\", name); replaces the braces with the value of name. Every statement ends with a semicolon."
  - "println!(\"Hello, Rust!\");   let name = \"Ferris\";   println!(\"{} is a crab.\", name);   println!(\"{} + {} = {}\", 2, 3, 2 + 3);"
solution:
  - name: main.rs
    code: |
      fn main() {
          println!("Hello, Rust!");

          let name = "Ferris";
          println!("{} is a crab.", name);

          println!("{} + {} = {}", 2, 3, 2 + 3);
      }
quiz:
  - q: "Why does println! have an exclamation mark?"
    options: ["It is a macro, not a normal function", "It makes the text louder", "It marks the end of the program"]
    answer: 0
    explain: "Macros are expanded by the compiler before the program is built. The ! is how you recognise them."
  - q: "What does this print?  println!(\"{} and {}\", 1, 2);"
    options: ["{} and {}", "1 and 2", "2 and 1"]
    answer: 1
  - q: "Which line starts every Rust program?"
    options: ["main()", "fn main()", "start program"]
    answer: 1
  - q: "What must you put at the end of most statements?"
    options: ["A colon", "A period", "A semicolon"]
    answer: 2
---

Rust is a language for writing programs that are **fast** and **safe**. It is used for browsers, game engines, command line tools and parts of operating systems. It has a reputation for being strict, but that strictness is a gift: the compiler (the tool that turns your text into a runnable program) catches whole families of bugs before your program ever runs. In this lesson you write your first program and learn how to print.

## The smallest program

```rust
fn main() {
    println!("Hello, world!");
}
```

Piece by piece:

- `fn` is short for *function*. A function is a named block of code.
- `main` is the special name of the function where every Rust program **starts**. Without it, the compiler complains.
- `()` is the (empty) list of inputs. `main` takes none.
- `{ ... }` curly braces wrap the body of the function.
- `println!("Hello, world!");` prints text followed by a new line.

Rust code is normally built with a tool called **cargo**, but in this course we use a single file `main.rs` and the compiler `rustc` runs it for you. Nothing else is needed.

## println! and the exclamation mark

`println!` ends with `!` because it is a **macro**, a bit of code that the compiler expands into more code. For now just remember: `println!` and `print!` have an exclamation mark, ordinary functions do not. `print!` is the same but does not add a new line at the end.

Text between double quotes is a **string**. Single quotes are for single characters (`'a'`), so `println!('hi')` is an error.

## Placeholders

To print values, put `{}` into the text and pass the values after the string, separated by commas:

```rust
let name = "Ferris";
let age = 7;
println!("{} is {} years old.", name, age);   // prints: Ferris is 7 years old.
println!("1 + 1 = {}", 1 + 1);               // prints: 1 + 1 = 2
```

Each `{}` takes the next value in order. You can even put a calculation like `1 + 1` in the list. Newer Rust also lets you write the variable name inside the braces, `println!("{name} is {age}")`, which is handy for simple names.

If you want to print a curly brace itself, double it: `println!("{{ and }}")` prints `{ and }`.

## Variables with let

`let name = "Ferris";` creates a variable called `name` holding the text. Rust works out the type itself (here a string slice, written `&str`). You will learn much more about variables in the next lesson.

## Comments

A line that starts with `//` is a comment: the compiler ignores it. Use comments to explain *why* the code does something.

```rust
// this is a note for humans
println!("this runs");
```

> **Watch out:** forgetting the `!` gives `error[E0423]: expected function, found macro` (or "cannot find function `println`").
>
> **Watch out:** a missing semicolon gives `error: expected `;``. Rust reads the next line as part of the same statement.
>
> **Watch out:** the number of `{}` must equal the number of values: `println!("{} {}", 1);` fails with `error: 2 positional arguments in format string, but there is 1 argument`.
>
> **Watch out:** Rust strings use double quotes. `'Hello'` in single quotes is an error because single quotes are for one character only.

## Going further

Try `print!` twice in a row and see that the text ends up on one line. Try printing your own name and your age, or print a small calculation like `7 * 6`.

> **Your turn:** in `fn main`, print `Hello, Rust!`, then create `let name = "Ferris";` and print `Ferris is a crab.` using a `{}` placeholder, and finally print `2 + 3 = 5` using three placeholders (the values `2`, `3` and `2 + 3`).
