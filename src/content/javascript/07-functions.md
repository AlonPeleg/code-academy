---
title: Functions
summary: Wrap reusable code in a function.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // 1. Write a function double(n) that returns n * 2
      // 2. Write an arrow function square that returns n * n
      // 3. Write greet(name) that returns "Hello, <name>!"


      console.log(double(7));
      console.log(square(7));
      console.log(greet("Ava"));
check:
  output: |
    14
    49
    Hello, Ava!
hints:
  - "A function takes inputs (parameters) and gives a value back with return. You need three of them, with the exact names used at the bottom."
  - "double is a normal function, square is an arrow function stored in a const, and greet builds its answer with a template literal using backticks."
  - "function double(n) { return n * 2; }   const square = (n) => n * n;   function greet(name) { return `Hello, ${name}!`; }"
solution:
  - code: |
      function double(n) {
        return n * 2;
      }

      const square = (n) => n * n;

      function greet(name) {
        return `Hello, ${name}!`;
      }

      console.log(double(7));
      console.log(square(7));
      console.log(greet("Ava"));
quiz:
  - q: What does  return  do in a function?
    options: ["Prints a value", "Stops the whole program forever", "Sends a value back to the caller"]
    answer: 2
  - q: Which is an arrow function?
    options: ["const f = (x) => x + 1;", "function => f(x) {}", "def f(x): x + 1"]
    answer: 0
  - q: Inside a template string, how do you insert a variable?
    options: ["{name}", "${name}", "%name%"]
    answer: 1
    explain: Template strings use backticks and ${...} placeholders.
  - q: What does a function give back if it has no return statement?
    options: ["0", "An empty string", "undefined"]
    answer: 2
---

A **function** is a named block of code that you can run whenever you want, as many times as you want. Functions are how programmers avoid repeating themselves, and how big programs are broken into small understandable pieces.

## Defining and calling

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // prints: 5
console.log(add(10, 5)); // prints: 15
```

- `function` is the keyword that starts a definition.
- `add` is the function's **name**.
- `a` and `b` are **parameters**: names for the inputs the function receives.
- The code in `{ }` is the **body**.
- `return` sends a result back and stops the function.
- To run the function you **call** it: write its name followed by parentheses with the **arguments** (the actual values): `add(2, 3)`.

Defining a function does nothing by itself. It is like writing a recipe. The code runs only when you call it.

## return vs console.log

A common confusion:

```js
function showDouble(n) {
  console.log(n * 2);    // prints, but gives back nothing
}

function double(n) {
  return n * 2;          // gives the value back
}

const x = double(4) + 1; // 9: we can keep working with the result
```

`console.log` is for people reading the output. `return` is for the rest of your program. Prefer functions that return values, and print outside.

## Arrow functions

JavaScript has a shorter way to write functions, using `=>`:

```js
const add = (a, b) => a + b;
```

When the body is a single expression, the result is returned automatically. For more lines, use braces and an explicit `return`:

```js
const area = (w, h) => {
  const result = w * h;
  return result;
};
```

With exactly one parameter you may drop the parentheses: `n => n * n`.

## Default values

A parameter can have a fallback in case the caller does not pass anything:

```js
function greet(name = "friend") {
  return `Hello, ${name}!`;
}
console.log(greet());      // prints: Hello, friend!
console.log(greet("Ava")); // prints: Hello, Ava!
```

## Template strings

Backticks and `${...}` let you mix text with values: `` `Hello, ${name}!` ``. You met this in the strings lesson. It is the easiest way to build a sentence inside a function.

## Why bother?

Write the logic once, then reuse it: `double(7)`, `double(100)`, `double(0.5)`. If you find a bug, you fix it in one place.

> **Watch out:**
> - Forgetting `return`: a function without it gives back `undefined`, so `console.log(double(7))` prints `undefined`.
> - Forgetting to call the function. Writing just `greet` does not run it. You need `greet("Ava")`.
> - Calling a function before it is defined as an arrow function: `square(3); const square = ...` gives `ReferenceError: Cannot access 'square' before initialization`. Regular `function` declarations can be called earlier, but arrow functions stored in a `const` can not.
> - Code after `return` never runs.
> - A mismatch of names: if the parameter is `n` but the body uses `x`, you get `ReferenceError: x is not defined`.
> - Calling a function with the wrong number of arguments: missing ones become `undefined`, giving `NaN` in maths.

## Going further

Write `isEven(n)` that returns `true` or `false`, and `max(a, b)` that returns the larger number using `if`. Rewrite `double` as an arrow function.

> **Your turn:** write `double`, `square` and `greet` so the three `console.log` lines at the bottom print correctly.
