---
title: Iterators and generators
summary: Make your own sequences that work with for...of and spread, including infinite ones that produce values lazily.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      // 1. Write a generator called range(start, end, step = 1) that hands out
      //    start, start + step, ... while the value is below end.

      // 2. Write an infinite generator called fibonacci()
      //    that hands out 0, 1, 1, 2, 3, 5, 8 ... forever.

      // 3. Write a generator called take(n, iterable)
      //    that hands out only the first n items of any iterable, then stops.

      // 4. Finish the Playlist class: make it iterable by adding a generator method
      //    named with the well-known symbol Symbol.iterator that hands out each song.
      class Playlist {
        constructor(songs) {
          this.songs = songs;
        }
      }

      console.log([...range(0, 10, 3)].join(","));
      console.log([...take(8, fibonacci())].join(", "));

      const steps = range(1, 3);
      console.log(steps.next().value);
      console.log(steps.next().value);
      console.log(steps.next().done);

      for (const song of new Playlist(["Intro", "Verse", "Outro"])) {
        console.log("Now playing: " + song);
      }
check:
  output: |
    0,3,6,9
    0, 1, 1, 2, 3, 5, 8, 13
    1
    2
    true
    Now playing: Intro
    Now playing: Verse
    Now playing: Outro
  code:
    - pattern: 'function\s*\*\s*range'
      message: "Declare range with function* range(...)."
    - pattern: 'function\s*\*\s*fibonacci'
      message: "Declare function* fibonacci()."
    - pattern: 'function\s*\*\s*take'
      message: "Declare function* take(n, iterable)."
    - pattern: '\*\s*\[\s*Symbol\.iterator\s*\]\s*\('
      message: "Add *[Symbol.iterator]() { ... } to the Playlist class."
    - pattern: 'yield'
      message: "Use the yield keyword."
hints:
  - "A generator is a function declared with function* that can pause at each yield and continue later. Spread ([...x]) and for...of repeatedly ask an iterable for its next value. A generator that never returns is fine as long as the consumer stops asking."
  - "range: for (let i = start; i < end; i += step) { yield i; }   fibonacci: let a = 0, b = 1; while (true) { yield a; [a, b] = [b, a + b]; }   take: count with a number and return when you reach n. In Playlist: *[Symbol.iterator]() { ... }"
  - "function* range(start, end, step = 1) { for (let i = start; i < end; i += step) yield i; }   function* fibonacci() { let [a, b] = [0, 1]; while (true) { yield a; [a, b] = [b, a + b]; } }   function* take(n, iterable) { let i = 0; for (const x of iterable) { if (i++ >= n) return; yield x; } }   *[Symbol.iterator]() { yield* this.songs; }"
solution:
  - name: main.js
    code: |
      function* range(start, end, step = 1) {
        for (let i = start; i < end; i += step) {
          yield i;
        }
      }

      function* fibonacci() {
        let [a, b] = [0, 1];
        while (true) {
          yield a;
          [a, b] = [b, a + b];
        }
      }

      function* take(n, iterable) {
        let count = 0;
        for (const item of iterable) {
          if (count >= n) return;
          yield item;
          count++;
        }
      }

      class Playlist {
        constructor(songs) {
          this.songs = songs;
        }

        *[Symbol.iterator]() {
          for (const song of this.songs) {
            yield song;
          }
        }
      }

      console.log([...range(0, 10, 3)].join(","));
      console.log([...take(8, fibonacci())].join(", "));

      const steps = range(1, 3);
      console.log(steps.next().value);
      console.log(steps.next().value);
      console.log(steps.next().done);

      for (const song of new Playlist(["Intro", "Verse", "Outro"])) {
        console.log("Now playing: " + song);
      }
quiz:
  - q: What does the yield keyword do inside a generator?
    options: ["Ends the program", "Hands one value to the caller and pauses until the next value is requested", "Creates a new array"]
    answer: 1
  - q: Why can  fibonacci()  be an infinite loop without freezing the program?
    options: ["Generators run in a separate thread", "JavaScript detects and stops infinite loops", "It only runs when asked for the next value, so the consumer decides when to stop"]
    answer: 2
    explain: This is called lazy evaluation. Code between two yields runs only when the next value is requested.
  - q: "What does  steps.next()  return?"
    options: ["An object like { value, done }", "Always the next number", "A promise"]
    answer: 0
  - q: What must an object have to work with for...of?
    options: ["A length property", "A method named Symbol.iterator that returns an iterator", "To be an array"]
    answer: 1
---

An array holds all of its values at once. But some sequences are huge, or endless, or expensive to compute: every prime number, lines of a giant file, every page of search results. **Generators** let you describe a sequence that produces values **one at a time, on demand**. Along the way you will learn the protocol behind `for...of`, spread and destructuring.

## The iterator protocol

When you write `for (const x of something)`, JavaScript asks `something` for an **iterator**. An iterator is any object with a `next()` method that returns `{ value, done }`: the next value, and whether the sequence is finished. Written by hand it is a bit clumsy:

```js
function countTo(max) {
  let n = 0;
  return {
    next() {
      n++;
      return n <= max ? { value: n, done: false } : { value: undefined, done: true };
    },
  };
}
```

An **iterable** is an object that can hand out an iterator, by having a method named `Symbol.iterator`. Arrays, strings, Maps and Sets are all iterable, which is why they work with `for...of`, spread (`[...x]`) and destructuring.

## Generators: iterators made easy

A **generator function** is declared with `function*`. Inside it, the `yield` keyword hands out a value and **pauses** the function. The next request resumes it right after the `yield`:

```js
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

console.log([...range(0, 10, 3)]); // prints: [0, 3, 6, 9]
```

Calling a generator function does not run its body. It returns a **generator object**, which is both an iterator and an iterable:

```js
const g = range(1, 3);
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.next(); // { value: undefined, done: true }
```

Notice the local variables (`i`) are remembered between calls. That is the superpower: the function keeps its place.

## Infinite sequences

Because values are produced only on request, a generator can loop forever:

```js
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
```

This is safe as long as the consumer stops. Write a helper that takes the first `n` items and quits (with `return`), and you can combine it with any sequence:

```js
function* take(n, iterable) {
  let count = 0;
  for (const item of iterable) {
    if (count >= n) return;
    yield item;
    count++;
  }
}
```

Never write `[...fibonacci()]`. Spread tries to collect an endless sequence and the program hangs. When the loop in `take` returns, JavaScript closes the underlying generator for you.

## Making your own class iterable

Give a class a generator method named with the special key `Symbol.iterator`, written `*[Symbol.iterator]()`:

```js
class Playlist {
  constructor(songs) { this.songs = songs; }
  *[Symbol.iterator]() {
    yield* this.songs;   // delegate: yield every item of another iterable
  }
}
```

`yield*` hands over to another iterable and yields each of its items in turn. Now `for (const song of new Playlist([...]))` just works, and so does `[...playlist]`.

## Why bother?

- **Memory**: process a million items one at a time without building a million-item array.
- **Early exit**: stop after the first match without computing the rest.
- **Clean code**: turn a complicated loop into a reusable pipeline (`take(5, filter(isEven, naturals()))`).

> **Watch out:**
> - Spreading or looping over an infinite generator without a stopping condition. The tab freezes and the run is stopped after a few seconds.
> - Forgetting the star: `function range()` with `yield` inside is `SyntaxError: Unexpected identifier` (or yield is treated as a variable).
> - Re-using a finished generator. Once `done` is `true` it stays empty. `const g = range(0, 3); [...g]; [...g]` gives an empty array the second time. Call `range(...)` again for a fresh one.
> - Writing `yield` inside a normal callback, such as `items.forEach(x => { yield x; })`. `yield` only works directly in the generator function body, so use a `for...of` loop instead.
> - Writing `[Symbol.iterator]() {` without the star and with `yield` inside. Both the star and the computed name are needed.

## Going further

Write `function* filter(predicate, iterable)` and `function* map(fn, iterable)`, then print `[...take(5, map(x => x * x, filter(x => x % 2 === 1, range(0, Infinity))))]`.

> **Your turn:** write the generators `range`, `fibonacci` and `take`, then give `Playlist` a `*[Symbol.iterator]()` method so the final loop prints the three songs.
