---
title: References and borrowing
summary: Let functions use values without taking ownership by borrowing with & and &mut, and meet slices.
level: intermediate
runner: remote
files:
  - name: main.rs
    code: |
      // 2. Return the length of the String. The function only borrows it.
      fn calc_len(s: &String) -> usize {
          0
      }

      // 3. Add an exclamation mark to the end of the String (a char: '!').
      //    This one borrows the String mutably.
      fn add_excl(s: &mut String) {
      }

      // 4. Return the part of the text before the first space, as a slice.
      //    If there is no space, return the whole text.
      fn first_word(s: &str) -> &str {
          s
      }

      fn main() {
          let mut text = String::from("hello world");

          // 1. Pass text to calc_len by shared reference (a borrow), so that
          //    text is still ours afterwards.
          let len = calc_len(text);
          println!("len = {}", len);

          add_excl(text);
          println!("{}", text);

          println!("first word: {}", first_word(&text));
      }
check:
  output: |
    len = 11
    hello world!
    first word: hello
  code:
    - { pattern: 'calc_len\(\s*&\s*text\s*\)', message: "Borrow text with calc_len(&text)." }
    - { pattern: 'add_excl\(\s*&\s*mut\s+text\s*\)', message: "Borrow text mutably with add_excl(&mut text)." }
    - { pattern: 's\.len\(\)', message: "calc_len should return s.len()." }
hints:
  - "A reference (&) lets a function look at a value without owning it. & borrows read-only, &mut borrows so you can change it. The call site needs the matching symbol too."
  - "In main write calc_len(&text) and add_excl(&mut text). Inside add_excl use s.push('!'). For first_word loop over s.char_indices() and return &s[..i] when you see a space."
  - "fn calc_len(s: &String) -> usize { s.len() }   fn add_excl(s: &mut String) { s.push('!'); }   for (i, c) in s.char_indices() { if c == ' ' { return &s[..i]; } }   s"
solution:
  - name: main.rs
    code: |
      fn calc_len(s: &String) -> usize {
          s.len()
      }

      fn add_excl(s: &mut String) {
          s.push('!');
      }

      fn first_word(s: &str) -> &str {
          for (i, c) in s.char_indices() {
              if c == ' ' {
                  return &s[..i];
              }
          }
          s
      }

      fn main() {
          let mut text = String::from("hello world");

          let len = calc_len(&text);
          println!("len = {}", len);

          add_excl(&mut text);
          println!("{}", text);

          println!("first word: {}", first_word(&text));
      }
quiz:
  - q: "What is a reference?"
    options: ["A copy of a value", "A way to use a value without owning it", "A kind of loop"]
    answer: 1
  - q: "How many mutable references to the same value can exist at one time?"
    options: ["As many as you like", "Exactly one (and no shared ones at the same time)", "None, they are forbidden"]
    answer: 1
    explain: "This rule prevents data races and surprising changes while someone else is reading."
  - q: "What does the slice  &s[0..5]  give you?"
    options: ["A new String with a copy of the first five bytes", "A view of the first five bytes of s, without copying", "The first five words"]
    answer: 1
  - q: "Why is it good to take  &str  instead of  &String  as a parameter?"
    options: ["It accepts both Strings and string literals", "It is faster to type", "It lets the function change the text"]
    answer: 0
---

Last lesson, passing a `String` to a function moved it away. That is clumsy when a function only wants to *look* at the data. Rust's answer is **borrowing**: you hand out a **reference**, a pointer that lets someone use a value without owning it. When the borrower is done, the owner still has everything.

## Shared references: &

```rust
fn calc_len(s: &String) -> usize {
    s.len()
}

fn main() {
    let text = String::from("hello");
    let n = calc_len(&text);        // lend text out
    println!("{} has {}", text, n); // text is still ours: prints: hello has 5
}
```

`&text` creates a reference, and the parameter type `&String` says "I borrow a String". The function can read through it, but cannot change it or free it. You can have **any number** of shared references to a value at the same time, since nobody is changing it.

## Mutable references: &mut

To let a function change what it borrows, use `&mut` on both sides, and make the original variable `mut`:

```rust
fn add_excl(s: &mut String) {
    s.push('!');
}

let mut text = String::from("hi");
add_excl(&mut text);
println!("{}", text);    // prints: hi!
```

## The borrowing rules

The compiler enforces two rules, for any value, at any moment:

1. You may have **either** one mutable reference **or** any number of shared references, never both.
2. A reference must never outlive the value it points to.

```rust
let mut s = String::from("a");
let r1 = &s;
let r2 = &s;           // fine: two readers
let r3 = &mut s;       // error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
println!("{} {}", r1, r2);
```

Why so strict? Imagine one part of your program reading a list while another part adds to it and the list moves in memory: the reader would look at garbage. Rust rules this out at compile time, so entire classes of bugs (data races, dangling pointers) cannot exist in safe Rust.

A reference only lives until its **last use**, not to the end of the block, so this works:

```rust
let mut s = String::from("a");
let r1 = &s;
println!("{}", r1);    // last use of r1
let r2 = &mut s;      // fine now
r2.push('b');
```

## Slices

A **slice** is a reference to a *part* of a collection. For text it is written `&str`:

```rust
let s = String::from("hello world");
let hello = &s[0..5];    // "hello"
let world = &s[6..];     // "world"
let all   = &s[..];      // everything
```

Ranges work like in `for` loops, and may leave out the start or end. String literals such as `"hi"` are already `&str`. This is why functions that only read text should take `&str`: it accepts both literals and (borrowed) Strings. Slices are views, so nothing is copied.

`first_word` shows the idea. It walks through `char_indices()`, which gives the position `i` and the character `c` for every character, and returns a slice up to the first space:

```rust
fn first_word(s: &str) -> &str {
    for (i, c) in s.char_indices() {
        if c == ' ' { return &s[..i]; }
    }
    s
}
```

> **Watch out:** `error[E0308]: mismatched types ... expected `&String`, found `String`` means you forgot the `&` at the call.
>
> **Watch out:** `error[E0596]: cannot borrow `text` as mutable, as it is not declared as mutable` means the variable needs `let mut`.
>
> **Watch out:** `error[E0499]: cannot borrow `s` as mutable more than once at a time` means two `&mut` references overlap. Finish with the first one before creating the second.
>
> **Watch out:** slice positions are measured in **bytes**, so slicing in the middle of a character like `é` panics. Stick to `char_indices` and `find` for text.

> **Your turn:** fill in `calc_len` (return `s.len()`), `add_excl` (`push('!')`), and `first_word`, then fix `main` so it borrows: `calc_len(&text)` and `add_excl(&mut text)`.
