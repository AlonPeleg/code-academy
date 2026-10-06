---
title: Control flow
summary: Make decisions with if and repeat work with for, while and loop, all using Rust's expression style.
level: beginner
runner: remote
files:
  - name: main.rs
    code: |
      fn main() {
          // 1. Count from 1 to 15 (inclusive). For each number print:
          //    FizzBuzz if divisible by both 3 and 5, Fizz if divisible by 3,
          //    Buzz if divisible by 5, otherwise the number itself.
          for i in 1..=15 {
              println!("{}", i);
          }

          // 2. Use a while loop to add up the numbers 1 to 10 into total.
          let mut total = 0;
          println!("sum: {}", total);

          // 3. Use an if expression to choose the label: "big" if total is
          //    greater than 50, otherwise "small".
          let label = "?";
          println!("label: {}", label);
      }
check:
  output: |
    1
    2
    Fizz
    4
    Buzz
    Fizz
    7
    8
    Fizz
    Buzz
    11
    Fizz
    13
    14
    FizzBuzz
    sum: 55
    label: big
  code:
    - { pattern: '%\s*3', message: "Use the remainder operator % to test divisibility." }
    - { pattern: 'while\s', message: "Use a while loop for the sum." }
    - { pattern: 'let\s+label\s*=\s*if\s', message: "Assign the if expression directly: let label = if ... { } else { };" }
hints:
  - "i % 3 == 0 means i is divisible by 3. Test the FizzBuzz case (both) first, otherwise the Fizz branch would catch it. Use if / else if / else."
  - "A while loop needs a counter: let mut n = 1; while n <= 10 { total += n; n += 1; }. And if is an expression, so you can write let label = if total > 50 { \"big\" } else { \"small\" };"
  - "if i % 15 == 0 { println!(\"FizzBuzz\"); } else if i % 3 == 0 { println!(\"Fizz\"); } else if i % 5 == 0 { println!(\"Buzz\"); } else { println!(\"{}\", i); }"
solution:
  - name: main.rs
    code: |
      fn main() {
          for i in 1..=15 {
              if i % 3 == 0 && i % 5 == 0 {
                  println!("FizzBuzz");
              } else if i % 3 == 0 {
                  println!("Fizz");
              } else if i % 5 == 0 {
                  println!("Buzz");
              } else {
                  println!("{}", i);
              }
          }

          let mut total = 0;
          let mut n = 1;
          while n <= 10 {
              total += n;
              n += 1;
          }
          println!("sum: {}", total);

          let label = if total > 50 { "big" } else { "small" };
          println!("label: {}", label);
      }
quiz:
  - q: "Which range includes both 1 and 5?"
    options: ["1..5", "1..=5", "1...5"]
    answer: 1
    explain: "1..5 stops before 5. The = makes the end inclusive."
  - q: "Do you put parentheses around the condition, as in  if (x > 3) ?"
    options: ["Yes, they are required", "No, and the compiler warns that they are unnecessary", "Only for numbers"]
    answer: 1
  - q: "What is special about  let x = if a { 1 } else { 2 };  ?"
    options: ["It is a syntax error", "if is an expression, so both branches give a value of the same type", "x becomes a boolean"]
    answer: 1
  - q: "Which loop keeps running until you write break?"
    options: ["for", "loop", "if"]
    answer: 1
---

Programs become useful when they can decide things and repeat things. Rust gives you `if` for decisions and three kinds of loops: `for`, `while` and `loop`. Their shapes are simple, with one twist: in Rust `if` is an **expression**, which means it can produce a value.

## if, else if, else

```rust
let temperature = 25;
if temperature > 30 {
    println!("hot");
} else if temperature > 15 {
    println!("nice");   // prints: nice
} else {
    println!("cold");
}
```

There are no parentheses around the condition, but the curly braces are **required**, even for one line. The condition must be a real `bool`: `if 1 { }` is an error, unlike in C. Combine conditions with `&&` (and), `||` (or) and `!` (not).

### if as an expression

Because `if` gives a value, you can assign its result:

```rust
let label = if temperature > 20 { "warm" } else { "cool" };
```

Both branches must have the **same type**, and there is no semicolon after the value inside each branch. The semicolon after the closing brace belongs to the `let`.

## for loops and ranges

```rust
for i in 1..=3 {
    println!("{}", i);   // prints 1, 2, 3
}
```

`1..=3` is an **inclusive range** (1, 2 and 3). `1..3` is exclusive and gives 1 and 2. A `for` loop takes each value out of the range in turn, and `i` exists only inside the loop. You can also loop over a list, which you will see in a later lesson.

## while loops

A `while` loop repeats as long as a condition is true:

```rust
let mut n = 3;
while n > 0 {
    println!("{}", n);
    n -= 1;
}
println!("liftoff");
```

Remember `mut`: the counter changes, so it must be mutable. Forgetting `n -= 1` makes an endless loop.

## loop, break and continue

`loop` repeats forever until you `break` out. `continue` skips to the next round.

```rust
let mut count = 0;
loop {
    count += 1;
    if count == 2 { continue; }
    if count > 4 { break; }
    println!("{}", count);   // prints 1, 3, 4
}
```

## The remainder operator

`a % b` is the remainder of a division. `10 % 3` is `1`. A number is divisible by `b` when `a % b == 0`. That is the heart of FizzBuzz, a classic exercise: print the numbers 1 to 15, but say "Fizz" for multiples of 3, "Buzz" for multiples of 5 and "FizzBuzz" for both.

> **Watch out:** `error[E0308]: mismatched types ... expected `bool`, found integer` means your condition is not a true/false value. Write `x != 0` instead of `x`.
>
> **Watch out:** in FizzBuzz test the "both" case **first**. A number like 15 is divisible by 3, so an earlier `i % 3 == 0` check would catch it.
>
> **Watch out:** `if` branches with different types (`if a { 1 } else { "no" }`) give `error[E0308]: `if` and `else` have incompatible types`.
>
> **Watch out:** a `while` loop whose variable is never changed runs forever, and the run is stopped by a time limit.

> **Your turn:** finish FizzBuzz for 1 to 15 with `if` / `else if` / `else`, add up 1 to 10 with a `while` loop into `total`, and pick `label` with an `if` expression ("big" when `total` is greater than 50).
