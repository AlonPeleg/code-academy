---
title: Option, Result and error handling
summary: Replace null and exceptions with Option and Result, and use match, unwrap_or and the ? operator to handle failure.
level: advanced
runner: remote
files:
  - name: main.rs
    code: |
      // 1. Parse the text into a number. Return Err with the message
      //    "not a number: <text>" when parsing fails, and Err("too old: <n>")
      //    when the number is more than 150. Otherwise return Ok(number).
      fn parse_age(s: &str) -> Result<u32, String> {
          Err(String::from("todo"))
      }

      // 2. Return Some(first even number) or None when there is no even number.
      fn first_even(v: &[i32]) -> Option<i32> {
          None
      }

      // 3. Add up two ages. Use the ? operator so that an error from either
      //    parse_age is returned immediately.
      fn total_age(a: &str, b: &str) -> Result<u32, String> {
          Err(String::from("todo"))
      }

      fn main() {
          println!("{:?}", parse_age("30"));
          println!("{:?}", parse_age("abc"));
          println!("{:?}", parse_age("200"));

          println!("{:?}", first_even(&[1, 3, 4, 6]));
          println!("{:?}", first_even(&[1, 3]));

          println!("total: {:?}", total_age("20", "35"));
          println!("total: {:?}", total_age("20", "x"));

          let n = first_even(&[7, 9]).unwrap_or(0);
          println!("fallback: {}", n);
      }
check:
  output: |
    Ok(30)
    Err("not a number: abc")
    Err("too old: 200")
    Some(4)
    None
    total: Ok(55)
    total: Err("not a number: x")
    fallback: 0
  code:
    - { pattern: 'parse::<u32>\(\)|parse\(\)', message: "Use s.parse::<u32>() to turn text into a number." }
    - { pattern: '\)\s*\?', message: "Use the ? operator in total_age." }
hints:
  - "s.parse::<u32>() returns a Result that is Ok(number) or Err(...). Convert its error into your own message with map_err, or use a match on the result."
  - "let n = s.parse::<u32>().map_err(|_| format!(\"not a number: {}\", s))?;  then check n > 150 and return Err(format!(\"too old: {}\", n)); finish with Ok(n). For first_even loop and return Some(x) when x % 2 == 0."
  - "fn total_age(a: &str, b: &str) -> Result<u32, String> { let x = parse_age(a)?; let y = parse_age(b)?; Ok(x + y) }"
solution:
  - name: main.rs
    code: |
      fn parse_age(s: &str) -> Result<u32, String> {
          let n = s
              .parse::<u32>()
              .map_err(|_| format!("not a number: {}", s))?;
          if n > 150 {
              return Err(format!("too old: {}", n));
          }
          Ok(n)
      }

      fn first_even(v: &[i32]) -> Option<i32> {
          for &x in v {
              if x % 2 == 0 {
                  return Some(x);
              }
          }
          None
      }

      fn total_age(a: &str, b: &str) -> Result<u32, String> {
          let x = parse_age(a)?;
          let y = parse_age(b)?;
          Ok(x + y)
      }

      fn main() {
          println!("{:?}", parse_age("30"));
          println!("{:?}", parse_age("abc"));
          println!("{:?}", parse_age("200"));

          println!("{:?}", first_even(&[1, 3, 4, 6]));
          println!("{:?}", first_even(&[1, 3]));

          println!("total: {:?}", total_age("20", "35"));
          println!("total: {:?}", total_age("20", "x"));

          let n = first_even(&[7, 9]).unwrap_or(0);
          println!("fallback: {}", n);
      }
quiz:
  - q: "Rust has no null. What does it use instead to say 'maybe there is no value'?"
    options: ["Option<T> with Some and None", "The number 0", "Exceptions"]
    answer: 0
  - q: "What does the ? operator do on a Result?"
    options: ["Ignores the error", "Returns the Ok value, or returns the Err from the current function early", "Prints the error"]
    answer: 1
  - q: "What happens when you call unwrap() on a None or an Err?"
    options: ["It returns a default value", "The program panics", "It returns 0"]
    answer: 1
    explain: "unwrap is fine in quick experiments, but production code should handle the failure with match, unwrap_or or ?."
  - q: "In which function can you use the ? operator?"
    options: ["Any function", "Only functions that return Result or Option (matching the error type)", "Only main"]
    answer: 1
---

Every program must deal with things going wrong: a file is missing, a user types letters where a number is expected, a list is empty. Many languages answer with `null` (the "billion dollar mistake") or with exceptions that can fly out of any line. Rust makes failure **part of the type**. A function that might not give a value returns an `Option`; one that might fail returns a `Result`. The compiler then **forces** you to deal with the failure case before you can use the value, which removes a huge class of crashes.

## Option: something or nothing

```rust
enum Option<T> {
    Some(T),
    None,
}
```

`Option` is an ordinary enum (like those in the previous lessons) built into Rust. The `T` is a **generic** type placeholder: `Option<i32>` is either `Some(5)` or `None`.

```rust
fn first_even(v: &[i32]) -> Option<i32> {
    for &x in v {
        if x % 2 == 0 { return Some(x); }
    }
    None
}

match first_even(&[1, 4]) {
    Some(n) => println!("found {}", n),   // prints: found 4
    None => println!("no even number"),
}
```

(`&[i32]` is a slice of integers: a borrowed view of a Vec or array. The `&x` in the `for` pattern copies each number out of the reference.)

You cannot use an `Option<i32>` as if it were an `i32`: you must first check which one it is. That is the cure for null-pointer crashes. Handy shortcuts:

| Method | Meaning |
| --- | --- |
| `opt.unwrap_or(0)` | the value, or 0 when `None` |
| `opt.is_some()` / `is_none()` | test without unpacking |
| `opt.unwrap()` | the value, or **panic** when `None` |
| `if let Some(n) = opt { ... }` | run code only when it is `Some` |

## Result: success or error

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

A `Result` carries either the success value `T` or an error value `E`. Parsing text into a number can fail, so it returns a `Result`:

```rust
let a = "42".parse::<u32>();   // Ok(42)
let b = "abc".parse::<u32>();  // Err(ParseIntError { kind: InvalidDigit })
```

The `::<u32>` ("turbofish") tells `parse` which type to produce. You can handle a Result with `match` as above. When you want your own error message instead of the library one, convert it with `map_err`:

```rust
let n = s.parse::<u32>().map_err(|_| format!("not a number: {}", s))?;
```

The `|_| ...` is a **closure**, a tiny anonymous function; `_` means "I ignore the input". `format!` builds the message.

## The ? operator

Writing `match` after every call gets noisy. The `?` operator says: "if this is `Ok`, give me the value inside; if it is `Err`, **return that error from my function right now**."

```rust
fn total_age(a: &str, b: &str) -> Result<u32, String> {
    let x = parse_age(a)?;    // on Err, total_age returns the Err immediately
    let y = parse_age(b)?;
    Ok(x + y)
}
```

For this to work the function must itself return a `Result` (or `Option`) with a compatible error type. The happy path stays easy to read, and errors flow upwards to the code that knows what to do with them.

## panic, unwrap and expect

`unwrap()` and `expect("message")` pull the value out and **panic** (crash the thread with a message) on failure. They are fine in quick experiments and in cases that truly cannot fail, but a library or real program should return a `Result` instead, so the caller decides.

> **Watch out:** `error[E0277]: the `?` operator can only be used in a function that returns `Result` or `Option`` happens when you use `?` in `main` without a return type (or in a function returning `()`).
>
> **Watch out:** `error[E0308]: mismatched types ... expected `u32`, found `Result<u32, ...>`` means you forgot to unpack: add `?`, `unwrap_or` or a `match`.
>
> **Watch out:** `?` needs the error types to be convertible. A `ParseIntError` cannot become a `String` automatically, which is why we use `map_err`.
>
> **Watch out:** `called `Option::unwrap()` on a `None` value` is a panic from careless `unwrap`.

> **Your turn:** implement `parse_age` (parse, report `not a number: ...` and `too old: ...`), `first_even` (return `Some` or `None`), and `total_age` with the `?` operator.
