---
title: Traits and generics
summary: Share behaviour between types with traits, write code that works for many types with generics, and use trait objects.
level: advanced
runner: remote
files:
  - name: main.rs
    code: |
      trait Shape {
          fn area(&self) -> f64;
          fn name(&self) -> String;
      }

      struct Rect {
          w: f64,
          h: f64,
      }

      struct Circle {
          r: f64,
      }

      // 1. Implement Shape for Rect (area = w * h, name = "rect").
      // 2. Implement Shape for Circle (area = 3.14159 * r * r, name = "circle").

      // 3. Make this generic: it should return the largest item of a slice of any
      //    type that can be compared and copied. Replace i32 with a type parameter T.
      fn largest(items: &[i32]) -> i32 {
          let mut best = items[0];
          for &item in items {
              if item > best {
                  best = item;
              }
          }
          best
      }

      // 4. Print "<name> area <area>" with two decimals for any Shape.
      fn print_area(s: &dyn Shape) {
          println!("shape");
      }

      fn main() {
          let shapes: Vec<Box<dyn Shape>> = vec![
              Box::new(Rect { w: 3.0, h: 4.0 }),
              Box::new(Circle { r: 3.0 }),
          ];
          let mut total = 0.0;
          for s in &shapes {
              print_area(s.as_ref());
              total += s.area();
          }
          println!("total area {:.2}", total);

          println!("largest int: {}", largest(&[3, 9, 4]));
          println!("largest char: {}", largest(&['a', 'z', 'm']));
      }
check:
  output: |
    rect area 12.00
    circle area 28.27
    total area 40.27
    largest int: 9
    largest char: z
  code:
    - { pattern: 'impl\s+Shape\s+for\s+Rect', message: "Write impl Shape for Rect { ... }." }
    - { pattern: 'impl\s+Shape\s+for\s+Circle', message: "Write impl Shape for Circle { ... }." }
    - { pattern: 'fn\s+largest\s*<\s*T', message: "Make largest generic: fn largest<T: ...>(items: &[T]) -> T." }
hints:
  - "A trait is a list of method signatures. A type promises to follow it with impl TraitName for TypeName { ... } and defines every method. A generic function names its type parameter in angle brackets after the function name."
  - "Generic largest needs bounds so that > and copying work: fn largest<T: PartialOrd + Copy>(items: &[T]) -> T, with T replacing every i32 inside. print_area can call s.name() and s.area() and format with {:.2}."
  - "impl Shape for Rect { fn area(&self) -> f64 { self.w * self.h } fn name(&self) -> String { String::from(\"rect\") } }   fn print_area(s: &dyn Shape) { println!(\"{} area {:.2}\", s.name(), s.area()); }"
solution:
  - name: main.rs
    code: |
      trait Shape {
          fn area(&self) -> f64;
          fn name(&self) -> String;
      }

      struct Rect {
          w: f64,
          h: f64,
      }

      struct Circle {
          r: f64,
      }

      impl Shape for Rect {
          fn area(&self) -> f64 {
              self.w * self.h
          }
          fn name(&self) -> String {
              String::from("rect")
          }
      }

      impl Shape for Circle {
          fn area(&self) -> f64 {
              3.14159 * self.r * self.r
          }
          fn name(&self) -> String {
              String::from("circle")
          }
      }

      fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {
          let mut best = items[0];
          for &item in items {
              if item > best {
                  best = item;
              }
          }
          best
      }

      fn print_area(s: &dyn Shape) {
          println!("{} area {:.2}", s.name(), s.area());
      }

      fn main() {
          let shapes: Vec<Box<dyn Shape>> = vec![
              Box::new(Rect { w: 3.0, h: 4.0 }),
              Box::new(Circle { r: 3.0 }),
          ];
          let mut total = 0.0;
          for s in &shapes {
              print_area(s.as_ref());
              total += s.area();
          }
          println!("total area {:.2}", total);

          println!("largest int: {}", largest(&[3, 9, 4]));
          println!("largest char: {}", largest(&['a', 'z', 'm']));
      }
quiz:
  - q: "What is a trait?"
    options: ["A kind of struct", "A set of methods that a type can promise to implement", "A way to allocate memory"]
    answer: 1
  - q: "What does  T: PartialOrd + Copy  mean in a generic function?"
    options: ["T must be a number", "T must support comparison with > and < and be copyable", "T is a reference"]
    answer: 1
  - q: "Why do we need Box<dyn Shape> to keep Rect and Circle in one Vec?"
    options: ["They have different sizes and types, so we store pointers to trait objects", "Box makes the shapes faster", "A Vec can only hold boxes"]
    answer: 0
  - q: "How does Rust make generic code fast?"
    options: ["It checks types at run time", "Monomorphization: it generates a specialised copy of the function for each concrete type used", "It uses a garbage collector"]
    answer: 1
    explain: "Generic code has no run-time cost: largest::<i32> and largest::<char> are compiled as separate, optimised functions."
---

Imagine a drawing program with rectangles, circles and triangles. Each has an area, a name, a way to draw itself. You want one list of shapes and one function that works with any of them. And you want a `largest` function that works for numbers, letters and anything else that can be ordered, without writing it ten times. Rust's tools for this are **traits** and **generics**, and together they are the heart of abstraction in the language.

## Traits: shared behaviour

A trait is a named list of methods that a type can promise to provide. It is similar to an *interface* in Java or C#.

```rust
trait Shape {
    fn area(&self) -> f64;           // required: just the signature
    fn name(&self) -> String;
}

struct Rect { w: f64, h: f64 }

impl Shape for Rect {
    fn area(&self) -> f64 { self.w * self.h }
    fn name(&self) -> String { String::from("rect") }
}
```

`impl Shape for Rect` reads "Rect implements Shape". The compiler checks that you defined every required method, with the right signature. A trait can also have **default methods** with a body, which implementors may keep or override.

You have already used traits: `Debug` (for `{:?}`), `Clone` (for `.clone()`) and `Copy`. `#[derive(Debug)]` just writes the implementation for you.

## Generics: one function, many types

```rust
fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {
    let mut best = items[0];
    for &item in items {
        if item > best { best = item; }
    }
    best
}

largest(&[3, 9, 4]);        // 9
largest(&['a', 'z', 'm']);  // 'z'
```

- `<T>` after the name declares a **type parameter**, a placeholder replaced by a real type at each call.
- `T: PartialOrd + Copy` is a **trait bound**: it says "T can be any type that supports comparison (`>`) and can be copied". Without the bounds, the compiler would refuse `item > best` with `error[E0369]: binary operation `>` cannot be applied to type `T``. Bounds are how generic code tells the compiler what it is allowed to do.

Structs can be generic too, as `Vec<T>` and `Option<T>` are. When you compile, Rust creates a specialised version for every type you actually use (called **monomorphization**), so generics run as fast as hand-written code.

## Traits as parameters

```rust
fn print_area<S: Shape>(s: &S) { ... }     // generic with a bound
fn print_area(s: &impl Shape) { ... }      // same, shorter
fn print_area(s: &dyn Shape) { ... }       // a trait object: decided at run time
```

The first two are resolved at compile time: each call gets its own copy of the function (**static dispatch**). `dyn Shape` is a **trait object**: one compiled function that looks up the right method at run time (**dynamic dispatch**). You pay a tiny lookup cost, and gain the ability to mix types in one collection:

```rust
let shapes: Vec<Box<dyn Shape>> = vec![
    Box::new(Rect { w: 3.0, h: 4.0 }),
    Box::new(Circle { r: 3.0 }),
];
```

`Box<T>` is a smart pointer that puts a value on the heap. It is needed here because a `Rect` and a `Circle` have different sizes, while a `Vec` needs items of equal size. Pointers all have the same size. `s.as_ref()` turns a `&Box<dyn Shape>` into a `&dyn Shape`.

When to use which? Generics for speed and when the type is known at compile time; trait objects when you need a mixed collection or want to keep the compiled code small.

## Formatting decimals

`{:.2}` inside a placeholder prints a float with two digits after the point: `println!("{:.2}", 3.14159)` prints `3.14`.

> **Watch out:** `error[E0046]: not all trait items implemented, missing: `name`` means an `impl` is missing a required method.
>
> **Watch out:** `error[E0277]: the trait bound `T: PartialOrd` is not satisfied` (or E0369) means a generic function uses an operation without declaring it in the bounds.
>
> **Watch out:** `error[E0038]: the trait cannot be made into an object` appears if a trait used with `dyn` has methods that return `Self` or are generic.
>
> **Watch out:** a `Vec<Shape>` without `Box<dyn ...>` gives `the size for values of type `dyn Shape` cannot be known at compilation time`.

## Going further

Add a `Triangle`, give `Shape` a default method such as `describe(&self) -> String`, or write a generic `fn sum<T: std::ops::Add<Output = T> + Copy>(a: T, b: T) -> T`.

> **Your turn:** implement `Shape` for `Rect` (`w * h`, name `rect`) and `Circle` (`3.14159 * r * r`, name `circle`), make `largest` generic over `T: PartialOrd + Copy`, and make `print_area` print `<name> area <area with two decimals>`.
