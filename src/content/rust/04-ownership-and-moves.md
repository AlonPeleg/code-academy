---
title: Ownership and moves
summary: Understand Rust's central idea, that every value has exactly one owner, and what moving, cloning and copying mean.
level: intermediate
runner: remote
files:
  - name: main.rs
    code: |
      // 3. shout takes ownership of a String. Make the parameter mutable,
      //    add an exclamation mark to the end of the text and return it.
      fn shout(text: String) -> String {
          text
      }

      fn main() {
          let a = String::from("hi");
          // 1. This line MOVES a into b, so a can not be used afterwards and
          //    the println below does not compile. Make b a copy of a instead
          //    (a String has a method to make an independent copy).
          let b = a;
          println!("a = {}, b = {}", a, b);

          // 2. Whole numbers are Copy types, so this already works. Just read it.
          let x = 5;
          let y = x;
          println!("x = {}, y = {}", x, y);

          let c = String::from("rust");
          // 3. Give c to shout and keep the returned String in d, then print d.
          let d = String::new();
          println!("{}", d);
      }
check:
  output: |
    a = hi, b = hi
    x = 5, y = 5
    rust!
  code:
    - { pattern: '\.clone\(\)', message: "Make an independent copy with .clone()." }
    - { pattern: 'push_str|format!|\+\s*"!"', message: "Add the exclamation mark to the text inside shout." }
    - { pattern: 'shout\(\s*c\s*\)', message: "Call shout(c) and keep the result." }
hints:
  - "When you write let b = a; with a String, ownership moves to b and a is no longer valid. If you want two separate Strings, you have to copy the data explicitly."
  - "Use a.clone() to make the copy. For shout, write fn shout(mut text: String) -> String and use text.push_str(\"!\"); before returning text. In main: let d = shout(c);"
  - "let b = a.clone();   fn shout(mut text: String) -> String { text.push_str(\"!\"); text }   let d = shout(c);"
solution:
  - name: main.rs
    code: |
      fn shout(mut text: String) -> String {
          text.push_str("!");
          text
      }

      fn main() {
          let a = String::from("hi");
          let b = a.clone();
          println!("a = {}, b = {}", a, b);

          let x = 5;
          let y = x;
          println!("x = {}, y = {}", x, y);

          let c = String::from("rust");
          let d = shout(c);
          println!("{}", d);
      }
quiz:
  - q: "Who frees the memory of a String in Rust?"
    options: ["A garbage collector at some later time", "The programmer, by calling free", "The owner, automatically, when it goes out of scope"]
    answer: 2
    explain: "When the owner's scope ends, Rust calls drop and the memory is released. No garbage collector is needed."
  - q: "What happens after  let b = a;  when a is a String?"
    options: ["a and b both own the text", "Ownership moves to b and a can no longer be used", "The text is copied automatically"]
    answer: 1
  - q: "Why can  let y = x;  keep using x when x is an i32?"
    options: ["Integers implement Copy, so they are duplicated cheaply", "Integers have no owner", "Because x is mutable"]
    answer: 0
  - q: "What does passing a String to a function by value do?"
    options: ["Nothing, the function gets a view", "It moves ownership into the function", "It always copies the string"]
    answer: 1
---

Ownership is the idea that makes Rust different. Other languages either make you free memory by hand (C, which is error-prone) or run a garbage collector that cleans up while your program runs (Java, Python, Go, which costs speed). Rust uses a third way: a small set of rules, checked by the compiler, that decide when memory is released. The rules cost nothing at run time. Learning them is the biggest step in Rust, so we take two lessons for it.

## The three rules

1. Every value has exactly one **owner** (a variable).
2. There can only be one owner at a time.
3. When the owner goes out of scope (reaches the closing `}`), the value is **dropped**: its memory is freed.

```rust
{
    let s = String::from("hello");   // s owns the text
    println!("{}", s);
}                                    // s goes out of scope, the text is freed here
```

`String::from` creates a growable piece of text stored on the **heap**, the part of memory used for data whose size is not known in advance. A plain `"hello"` literal is different: it is fixed text stored inside the program.

## Moving

```rust
let a = String::from("hi");
let b = a;                 // ownership MOVES from a to b
println!("{}", a);         // error[E0382]: borrow of moved value: `a`
```

Why? If both `a` and `b` owned the same text, both would free it at the end of the scope, which is a bug called a *double free*. Rust prevents it by letting only `b` own the text after the move. `a` becomes unusable, and the compiler tells you so.

## Clone: an explicit copy

When you really want two independent Strings, ask for a copy:

```rust
let a = String::from("hi");
let b = a.clone();         // a deep copy: new memory, same text
println!("{} {}", a, b);   // prints: hi hi
```

`clone` can be slow for big data, so Rust makes you write it. When you see `.clone()` you know something is being copied.

## Copy types

Simple values that live entirely on the stack, such as integers, floats, `bool` and `char`, are **Copy**: assigning them just duplicates the bits, and the original stays valid.

```rust
let x = 5;
let y = x;       // x is copied, not moved
println!("{} {}", x, y);   // prints: 5 5
```

## Ownership and functions

Passing a value to a function moves it, just like `let`:

```rust
fn consume(s: String) {
    println!("{}", s);
}   // s is dropped here

let text = String::from("hello");
consume(text);
// println!("{}", text);   // error: value moved into consume
```

A function can give ownership back by **returning** the value:

```rust
fn shout(mut text: String) -> String {
    text.push_str("!");    // add to the end of the String
    text                   // the last expression, without semicolon, is returned
}

let loud = shout(String::from("hey"));   // loud is "hey!"
```

Notice `mut text` in the parameter list: the function owns the String and wants to change it, so the parameter must be mutable. The last line has no semicolon: in Rust the last expression of a function body is its return value.

This give-and-take is awkward when a function only wants to *look* at something. The next lesson shows the nicer way: borrowing.

> **Watch out:** `error[E0382]: borrow of moved value` or `use of moved value` means you used a variable after giving it away. Clone it, or reorder your code.
>
> **Watch out:** `String` is not `Copy`. `let b = a;` on a `String` moves, but on an `i32` copies.
>
> **Watch out:** a semicolon after the last expression (`text;`) turns it into a statement that returns nothing, giving `error[E0308]: mismatched types`.
>
> **Watch out:** calling `push_str` on a variable not declared with `mut` gives `cannot borrow ... as mutable`.

> **Your turn:** fix `main` so `b` is a `.clone()` of `a`, then complete `shout` (mutable parameter, `push_str("!")`, return the text) and use it with `c`, keeping the result in `d`.
