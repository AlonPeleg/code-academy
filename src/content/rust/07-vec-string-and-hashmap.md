---
title: Vec, String and HashMap
summary: Store many values with Vec, build and read text with String, and look things up by key with HashMap.
level: intermediate
runner: remote
files:
  - name: main.rs
    code: |
      use std::collections::HashMap;

      fn main() {
          let text = "the cat and the dog and the bird";

          let mut counts: HashMap<String, u32> = HashMap::new();
          let mut words: Vec<&str> = Vec::new();

          // 1. Go through the words of the text (split_whitespace gives them one
          //    by one). Push each word into the vector, and add 1 to its count
          //    in the map (a new word starts at 0).
          for w in text.split_whitespace() {
          }

          // 2. Collect the keys of the map into a vector and sort them, because
          //    a HashMap has no fixed order. Then print "word: count" lines.
          let keys: Vec<&String> = Vec::new();
          for k in keys {
              println!("{}: {}", k, counts[k]);
          }

          println!("total: {}", words.len());
      }
check:
  output: |
    and: 2
    bird: 1
    cat: 1
    dog: 1
    the: 3
    total: 8
  code:
    - { pattern: '\.entry\(', message: "Use counts.entry(...) to find or create the counter." }
    - { pattern: 'or_insert\(\s*0\s*\)', message: "A new word should start with or_insert(0)." }
    - { pattern: '\.sort\(\)', message: "Sort the keys before printing." }
hints:
  - "A HashMap lookup-or-create is the entry API: map.entry(key).or_insert(0) gives you a mutable reference to the counter, creating it with 0 if the key is missing."
  - "Inside the loop: words.push(w); *counts.entry(w.to_string()).or_insert(0) += 1; (the * follows the reference to the number). For the keys: let mut keys: Vec<&String> = counts.keys().collect(); keys.sort();"
  - "for w in text.split_whitespace() { words.push(w); *counts.entry(w.to_string()).or_insert(0) += 1; }   let mut keys: Vec<&String> = counts.keys().collect();   keys.sort();"
solution:
  - name: main.rs
    code: |
      use std::collections::HashMap;

      fn main() {
          let text = "the cat and the dog and the bird";

          let mut counts: HashMap<String, u32> = HashMap::new();
          let mut words: Vec<&str> = Vec::new();

          for w in text.split_whitespace() {
              words.push(w);
              *counts.entry(w.to_string()).or_insert(0) += 1;
          }

          let mut keys: Vec<&String> = counts.keys().collect();
          keys.sort();
          for k in keys {
              println!("{}: {}", k, counts[k]);
          }

          println!("total: {}", words.len());
      }
quiz:
  - q: "What is the difference between an array and a Vec?"
    options: ["A Vec can grow and shrink, an array has a fixed size", "A Vec can only hold numbers", "There is none"]
    answer: 0
  - q: "What does  v.get(10)  return when v has three items?"
    options: ["It panics", "None (an Option), no crash", "0"]
    answer: 1
    explain: "Indexing with v[10] panics, but get returns an Option so you can handle the missing case."
  - q: "Why do we sort the keys of a HashMap before printing?"
    options: ["HashMap would not print otherwise", "Its iteration order is unspecified and can differ between runs", "Sorting makes lookups faster"]
    answer: 1
  - q: "What does  *map.entry(key).or_insert(0) += 1  do?"
    options: ["Always sets the value to 1", "Creates the key with 0 if missing, then adds 1 to its value", "Deletes the key"]
    answer: 1
---

So far you have stored single values. Real programs hold **collections**: a list of scores, a piece of text, a table of names and phone numbers. Rust's standard library has three you will use all the time: `Vec` for lists, `String` for text and `HashMap` for lookups by key.

## Vec: a growable list

```rust
let mut v: Vec<i32> = Vec::new();
v.push(10);
v.push(20);
let w = vec![1, 2, 3];          // the vec! macro builds one with values

println!("{}", v.len());        // prints: 2
println!("{}", w[0]);           // prints: 1
for n in &w {                   // borrow the vector to loop over it
    println!("{}", n);
}
```

`Vec<i32>` reads as "a Vec of i32"; the part in angle brackets is the **type of the items**. All items have the same type. `push` adds to the end (the variable must be `mut`), `len` counts, and `v[i]` reads by position, starting at 0.

Reading outside the list with `v[10]` makes the program **panic** (stop with an error). If the position might not exist, use `get`, which returns an `Option` (a value that is either `Some(item)` or `None`, covered in a later lesson):

```rust
println!("{:?}", w.get(1));    // prints: Some(2)
println!("{:?}", w.get(9));    // prints: None
```

Looping with `for n in &w` borrows the vector, so you can still use `w` afterwards. Looping with `for n in w` would **move** it, as you learned in the ownership lessons.

## String: owned text

There are two kinds of text: `&str`, a borrowed slice (such as a literal `"hi"`), and `String`, an owned, growable piece of text.

```rust
let mut s = String::from("Hello");
s.push_str(", world");         // append text
s.push('!');                   // append one char
println!("{}", s);             // prints: Hello, world!
let t = "abc".to_string();     // &str -> String
let u = format!("{}-{}", s, t);   // build a new String
println!("{}", s.len());       // prints: 13 (bytes)
for word in "a b c".split_whitespace() {
    println!("{}", word);      // prints a, b, c on separate lines
}
```

Text is stored as UTF-8, so `len()` counts **bytes**, and an accented character may take more than one. You cannot index a string with `s[0]`. Use `s.chars()` to walk through characters.

## HashMap: look things up by key

A `HashMap` stores pairs of `key -> value`. It lives in the standard library, so you import it first:

```rust
use std::collections::HashMap;

let mut ages: HashMap<String, u32> = HashMap::new();
ages.insert(String::from("Ada"), 36);
ages.insert(String::from("Alan"), 41);
println!("{:?}", ages.get("Ada"));    // prints: Some(36)
println!("{}", ages["Alan"]);         // prints: 41 (panics if the key is missing)
```

### Counting with the entry API

A very common job is "count how often each thing appears". The `entry` method looks up a key and lets you create it when it is missing:

```rust
let mut counts: HashMap<String, u32> = HashMap::new();
for w in ["a", "b", "a"] {
    *counts.entry(w.to_string()).or_insert(0) += 1;
}
```

`or_insert(0)` returns a **mutable reference** to the value (adding the key with 0 first when needed). The `*` in front follows the reference so that `+= 1` changes the number itself.

### Order is not guaranteed

A `HashMap` does not remember insertion order, and the order of iteration may even differ between runs. When you need a stable output, collect the keys and sort them:

```rust
let mut keys: Vec<&String> = counts.keys().collect();
keys.sort();
```

`collect()` gathers the keys into a `Vec`; the type annotation tells Rust which collection you want.

> **Watch out:** `error[E0599]: no method named `push` found` often means your variable is not a `Vec`, or `mut` is missing: `cannot borrow `v` as mutable`.
>
> **Watch out:** `thread 'main' panicked at 'index out of bounds: the len is 3 but the index is 10'` is the panic from `v[10]`. Use `get` when unsure.
>
> **Watch out:** `error[E0277]: the type `str` cannot be indexed by `{integer}`` means you tried `s[0]` on text.
>
> **Watch out:** never rely on printing a `HashMap` directly in a test; sort the keys first.

> **Your turn:** loop over `text.split_whitespace()`, push each word into `words`, count it with `*counts.entry(...).or_insert(0) += 1`, then collect and `sort()` the keys and print each as `word: count`.
