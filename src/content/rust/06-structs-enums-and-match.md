---
title: Structs, enums and match
summary: Group data in structs with methods, model choices with enums that carry data, and handle them with match.
level: intermediate
runner: remote
files:
  - name: main.rs
    code: |
      #[derive(Debug)]
      struct Rect {
          width: u32,
          height: u32,
      }

      impl Rect {
          // 1. Return width * height.
          fn area(&self) -> u32 {
              0
          }

          // 2. Return true when this rectangle is at least as wide AND as high
          //    as the other one.
          fn can_hold(&self, other: &Rect) -> bool {
              false
          }
      }

      enum Message {
          Quit,
          Move { x: i32, y: i32 },
          Write(String),
      }

      // 3. Use match to describe each message:
      //    Quit -> "quit", Move -> "move to 3, 4" (with its x and y),
      //    Write -> "say hi" (with its text).
      fn describe(m: &Message) -> String {
          String::new()
      }

      fn main() {
          let r = Rect { width: 20, height: 10 };
          println!("area = {}", r.area());
          let small = Rect { width: 5, height: 5 };
          println!("can hold: {}", r.can_hold(&small));
          println!("{:?}", r);

          println!("{}", describe(&Message::Quit));
          println!("{}", describe(&Message::Move { x: 3, y: 4 }));
          println!("{}", describe(&Message::Write(String::from("hi"))));
      }
check:
  output: |
    area = 200
    can hold: true
    Rect { width: 20, height: 10 }
    quit
    move to 3, 4
    say hi
  code:
    - { pattern: 'match\s+m\s*\{', message: "Use match m { ... } to handle each kind of message." }
    - { pattern: 'Message::Move\s*\{', message: "Handle the Move variant and use its x and y." }
hints:
  - "A method is a function inside an impl block whose first parameter is &self. Fields are read with self.width. A match must cover every variant of the enum."
  - "area: self.width * self.height. can_hold: self.width >= other.width && self.height >= other.height. In match, a variant with data is unpacked in the pattern: Message::Write(text) => ..."
  - "match m { Message::Quit => String::from(\"quit\"), Message::Move { x, y } => format!(\"move to {}, {}\", x, y), Message::Write(text) => format!(\"say {}\", text), }"
solution:
  - name: main.rs
    code: |
      #[derive(Debug)]
      struct Rect {
          width: u32,
          height: u32,
      }

      impl Rect {
          fn area(&self) -> u32 {
              self.width * self.height
          }

          fn can_hold(&self, other: &Rect) -> bool {
              self.width >= other.width && self.height >= other.height
          }
      }

      enum Message {
          Quit,
          Move { x: i32, y: i32 },
          Write(String),
      }

      fn describe(m: &Message) -> String {
          match m {
              Message::Quit => String::from("quit"),
              Message::Move { x, y } => format!("move to {}, {}", x, y),
              Message::Write(text) => format!("say {}", text),
          }
      }

      fn main() {
          let r = Rect { width: 20, height: 10 };
          println!("area = {}", r.area());
          let small = Rect { width: 5, height: 5 };
          println!("can hold: {}", r.can_hold(&small));
          println!("{:?}", r);

          println!("{}", describe(&Message::Quit));
          println!("{}", describe(&Message::Move { x: 3, y: 4 }));
          println!("{}", describe(&Message::Write(String::from("hi"))));
      }
quiz:
  - q: "What does &self mean as the first parameter of a method?"
    options: ["The method changes the struct", "The method borrows the struct it is called on", "The method creates a new struct"]
    answer: 1
  - q: "What happens if a match does not cover every variant of an enum?"
    options: ["The missing cases do nothing", "It panics at run time", "The program does not compile"]
    answer: 2
    explain: "Exhaustive matching is a safety feature: when you add a new variant, the compiler shows every match you must update."
  - q: "What is special about Rust enums compared with enums in C?"
    options: ["Each variant can carry its own data", "They can only hold numbers", "They cannot be matched"]
    answer: 0
  - q: "What does #[derive(Debug)] allow?"
    options: ["Printing the struct with {:?}", "Running the debugger", "Making the fields public"]
    answer: 0
---

Real programs work with real things: a point on a screen, a rectangle, a command typed by a user. In this lesson you learn how to describe such things with **structs** (several values grouped under one name) and **enums** (a value that is exactly one of several choices), and how to deal with each choice using **match**.

## Structs

```rust
struct Point {
    x: i32,
    y: i32,
}

let p = Point { x: 3, y: 4 };
println!("{}", p.x);       // prints: 3
```

A struct lists named **fields** with their types. Create one by giving every field a value, and read a field with a dot. To change a field the variable must be `mut`.

### Methods with impl

Functions that belong to a struct go into an `impl` (implementation) block:

```rust
impl Point {
    fn new(x: i32, y: i32) -> Point {      // an "associated function": no self
        Point { x, y }                     // shorthand: x: x, y: y
    }

    fn distance_from_origin(&self) -> f64 {   // a method: has self
        ((self.x * self.x + self.y * self.y) as f64).sqrt()
    }
}

let p = Point::new(3, 4);                  // :: for associated functions
println!("{}", p.distance_from_origin()); // prints: 5   (dot for methods)
```

The first parameter `&self` means "borrow the struct this method is called on" (use `&mut self` to change it, `self` to consume it). Functions without `self`, like `new`, are called with `::`.

### Printing a struct

Structs do not know how to print themselves. Add `#[derive(Debug)]` above the struct and print with `{:?}`:

```rust
#[derive(Debug)]
struct Point { x: i32, y: i32 }
println!("{:?}", Point { x: 1, y: 2 });   // prints: Point { x: 1, y: 2 }
```

## Enums

An enum is a type with a fixed list of **variants**:

```rust
enum Direction {
    North,
    South,
}
let d = Direction::North;
```

Rust enums are more powerful than those in many languages, because each variant can **carry data**:

```rust
enum Message {
    Quit,                       // no data
    Move { x: i32, y: i32 },    // named fields
    Write(String),              // one unnamed value
}
```

A `Message` is always exactly one of these three, and knows which. This models "one of several shapes of thing" very naturally.

## match

`match` compares a value against **patterns** and runs the first arm that fits:

```rust
fn describe(m: &Message) -> String {
    match m {
        Message::Quit => String::from("quit"),
        Message::Move { x, y } => format!("move to {}, {}", x, y),
        Message::Write(text) => format!("say {}", text),
    }
}
```

Each arm is `pattern => result,`. Patterns can **unpack** the data inside a variant, which creates variables (`x`, `y`, `text`) usable on the right side. Two big rules: a match is an **expression** (its value is returned here), and it must be **exhaustive**: every possible variant must be covered, or the program will not compile. Use `_ => ...` as a catch-all arm. `format!` works like `println!` but returns a `String` instead of printing.

> **Watch out:** `error[E0004]: non-exhaustive patterns: `Message::Quit` not covered` means you forgot a variant in `match`.
>
> **Watch out:** `error[E0277]: `Rect` doesn't implement `Debug`` appears when you print with `{:?}` without `#[derive(Debug)]`.
>
> **Watch out:** forgetting `&self` (writing `fn area() -> u32`) makes it an associated function, and `r.area()` gives `no method named `area` found`.
>
> **Watch out:** the arms of a `match` must all produce the same type, and each arm ends with a comma, not a semicolon.

> **Your turn:** write the two `Rect` methods (`area` and `can_hold`) and the `describe` function with a `match` over the three `Message` variants.
