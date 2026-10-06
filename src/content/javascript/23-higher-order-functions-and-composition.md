---
title: Higher-order functions, currying and composition
summary: Treat functions as values you can pass, return and combine, then build small reusable tools like curry, compose, pipe and once.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      // 1. Write curry(fn): it returns a function that collects arguments
      //    (one or many at a time) until it has as many as fn declares, then calls fn.
      //    Tip: every function has a length property: the number of parameters it declares.

      const add3 = (a, b, c) => a + b + c;
      const curriedAdd = curry(add3);
      console.log(curriedAdd(1)(2)(3));
      console.log(curriedAdd(1, 2)(3));
      console.log(curriedAdd(1)(2, 3));

      // 2. Write compose(...fns): it returns a function that runs the functions
      //    from RIGHT to LEFT, feeding each result into the next one.
      // 3. Write pipe(...fns): the same idea, but from LEFT to RIGHT.
      const inc = (x) => x + 1;
      const dbl = (x) => x * 2;
      console.log(compose(dbl, inc)(5));
      console.log(pipe(dbl, inc)(5));

      // These two are already curried helpers (they use your curry).
      const map = curry((fn, list) => list.map(fn));
      const filter = curry((test, list) => list.filter(test));
      const words = ["apple", "kiwi", "banana", "fig"];
      const shout = pipe(
        filter((w) => w.length > 4),
        map((w) => w.toUpperCase()),
        (list) => list.join(", ")
      );
      console.log(shout(words));

      // 4. Write once(fn): it returns a function that calls fn only the first time.
      //    Every later call just returns the result of that first call.
      const init = once((name) => {
        console.log("init " + name);
        return name.length;
      });
      console.log(init("abc"));
      console.log(init("zzzz"));
check:
  output: |
    6
    6
    6
    12
    11
    APPLE, BANANA
    init abc
    3
    3
  code:
    - pattern: 'fn\.length'
      message: "Compare the number of collected arguments with fn.length."
    - pattern: 'reduce(Right)?\s*\('
      message: "compose and pipe can be written with reduce / reduceRight."
    - pattern: '\.\.\.\s*args'
      message: "Collect the arguments with a rest parameter: (...args)."
hints:
  - "A higher-order function takes functions or returns functions. curry returns a function that remembers (closes over) the arguments collected so far, and calls fn once it has enough of them."
  - "curry: return a function (...args) that checks args.length >= fn.length. If yes, return fn(...args). If not, return a new function (...more) that calls itself again with [...args, ...more]. compose uses fns.reduceRight, pipe uses fns.reduce, both starting from the input value."
  - "function curry(fn) { return function curried(...args) { if (args.length >= fn.length) return fn(...args); return (...more) => curried(...args, ...more); }; }   const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);   const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);   function once(fn) { let done = false, result; return (...args) => { if (!done) { done = true; result = fn(...args); } return result; }; }"
solution:
  - name: main.js
    code: |
      function curry(fn) {
        return function curried(...args) {
          if (args.length >= fn.length) return fn(...args);
          return (...more) => curried(...args, ...more);
        };
      }

      const add3 = (a, b, c) => a + b + c;
      const curriedAdd = curry(add3);
      console.log(curriedAdd(1)(2)(3));
      console.log(curriedAdd(1, 2)(3));
      console.log(curriedAdd(1)(2, 3));

      const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);
      const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);
      const inc = (x) => x + 1;
      const dbl = (x) => x * 2;
      console.log(compose(dbl, inc)(5));
      console.log(pipe(dbl, inc)(5));

      const map = curry((fn, list) => list.map(fn));
      const filter = curry((test, list) => list.filter(test));
      const words = ["apple", "kiwi", "banana", "fig"];
      const shout = pipe(
        filter((w) => w.length > 4),
        map((w) => w.toUpperCase()),
        (list) => list.join(", ")
      );
      console.log(shout(words));

      function once(fn) {
        let done = false;
        let result;
        return (...args) => {
          if (!done) {
            done = true;
            result = fn(...args);
          }
          return result;
        };
      }
      const init = once((name) => {
        console.log("init " + name);
        return name.length;
      });
      console.log(init("abc"));
      console.log(init("zzzz"));
quiz:
  - q: What makes a function "higher-order"?
    options: ["It takes other functions as arguments or returns a function", "It is declared at the top of the file", "It has more than three parameters"]
    answer: 0
  - q: What does currying turn  f(a, b, c)  into?
    options: ["A function that runs three times", "A function that can be called as f(a)(b)(c), one argument at a time", "A function that returns an array"]
    answer: 1
  - q: "What is the result of  compose(dbl, inc)(5)  where inc adds 1 and dbl doubles?"
    options: ["11, because dbl runs first", "10, because the functions are added", "12, because inc runs first and then dbl"]
    answer: 2
    explain: compose runs from right to left, like the maths f(g(x)). pipe runs from left to right, so pipe(dbl, inc)(5) is 11.
  - q: Why can once() remember whether fn was already called?
    options: ["The returned function is a closure that keeps done and result alive between calls", "JavaScript stores every function result automatically", "Because arrow functions are always cached"]
    answer: 0
---

You already know that a function is a value, like a number or a string. In this lesson you will use that fact on purpose: functions that receive other functions, functions that return new functions, and small building blocks that you snap together like Lego. This style is the heart of tools like `map`, `filter`, React hooks and middleware.

## What "higher-order" means

A **higher-order function** is a function that does at least one of these two things:

1. takes a function as an argument, or
2. returns a function.

You have used the first kind many times: `[1, 2, 3].map(x => x * 2)` passes a function to `map`. Now look at the second kind:

```js
function multiplyBy(factor) {
  return (x) => x * factor;      // a new function, remembering factor
}
const triple = multiplyBy(3);
console.log(triple(7));          // prints: 21
```

`multiplyBy` is a **function factory**. The function it returns is a closure: it still sees `factor` after `multiplyBy` has finished. If closures feel fuzzy, revisit the "Scope and closures" lesson first.

## Currying

**Currying** means turning a function that takes several arguments into a chain of functions that take them one (or a few) at a time.

```js
const add = (a) => (b) => a + b;
console.log(add(2)(3));   // prints: 5
const add10 = add(10);    // a reusable "add 10" function
console.log(add10(1));    // prints: 11
```

Writing curried functions by hand gets tedious, so we write a helper `curry(fn)` once. It works because every function knows how many parameters it declares, in `fn.length`:

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);   // enough: run it
    return (...more) => curried(...args, ...more);      // not yet: wait for more
  };
}
```

Piece by piece: `...args` (a **rest parameter**) gathers all arguments into an array; `args.length >= fn.length` asks "did we receive everything fn needs?"; `curried(...args, ...more)` calls itself again with the old and new arguments joined by **spread**. The result: `curry(add3)(1)(2)(3)`, `curry(add3)(1, 2)(3)` and `curry(add3)(1, 2, 3)` all give the same answer.

Currying shines when the data comes **last**: `const filter = curry((test, list) => list.filter(test))` lets you write `filter(isEven)` first and give the list later.

## Composition

**Composition** means building a bigger function out of smaller ones, where the output of one is the input of the next. In maths, `f(g(x))`. In code:

```js
const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);
const pipe    = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);
```

`reduce` walks the list of functions from left to right, carrying the value along; `reduceRight` walks from right to left. `pipe` reads like a recipe ("first this, then that") so many people prefer it; `compose` mirrors the maths notation.

Combine currying and pipe and you get readable data flows:

```js
const shout = pipe(
  filter((w) => w.length > 4),
  map((w) => w.toUpperCase())
);
```

Each step is tiny, easy to test alone, and reusable somewhere else.

## Wrapping functions: once

A higher-order function can also **wrap** another function and add behaviour around it. `once(fn)` keeps two private variables (`done` and `result`) in a closure and makes sure `fn` runs a single time. The same trick builds `debounce`, `memoize` and logging wrappers.

> **Watch out:**
> - `curry` relies on `fn.length`. A function with default values or a rest parameter (`(a, b = 2) => ...`, `(...xs) => ...`) reports a smaller length, so it may run too early.
> - Forgetting to `return` the inner function gives `TypeError: curriedAdd(...) is not a function`.
> - Mixing up the direction: `compose(a, b)` runs `b` first, `pipe(a, b)` runs `a` first.
> - Calling the function instead of passing it: `map(double())` passes the result of calling `double`, not the function itself. Pass `double` without parentheses.
> - In `once`, storing the result in a variable declared inside the returned function. It would be recreated on every call, so nothing is remembered.

## Going further

Write `partial(fn, ...preset)` that fixes the first arguments of any function, and `tap(fn)` that runs `fn(x)` for its side effect (like logging) but passes `x` on, so you can drop it into the middle of a `pipe`.

> **Your turn:** write `curry`, `compose`, `pipe` and `once` so that all nine lines print as shown.
