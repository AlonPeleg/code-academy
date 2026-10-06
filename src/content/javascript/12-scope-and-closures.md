---
title: Scope and closures
summary: Learn where variables live, and how a function can remember its surroundings.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      // Part 1: block scope. Run this: why is secret not visible outside the braces?
      {
        const secret = 42;
      }
      console.log(typeof secret);

      // Part 2: write makeCounter().
      // It creates a variable count that starts at 0 and returns a function.
      // Each time that returned function is called, it adds 1 to count and returns it.


      const a = makeCounter();
      const b = makeCounter();
      console.log(a());
      console.log(a());
      console.log(a());
      console.log(b());

check:
  output: |
    undefined
    1
    2
    3
    1
  code:
    - pattern: "function\\s+makeCounter|makeCounter\\s*=\\s*(function|\\()"
      message: "Define makeCounter as a function."
    - pattern: "return\\s+(function\\s*\\(|\\([^)]*\\)\\s*=>|\\w+\\s*=>)"
      message: "makeCounter should return a function."
hints:
  - "The inner function can use variables from the function around it, even after that outer function has finished. Each call to makeCounter creates its own private variable."
  - "Inside makeCounter, declare let count = 0; and return a function (a normal function or an arrow function) that increases count and returns it."
  - "function makeCounter() { let count = 0; return () => { count = count + 1; return count; }; }"
solution:
  - code: |
      // Part 1: block scope. Run this: why is secret not visible outside the braces?
      {
        const secret = 42;
      }
      console.log(typeof secret);

      // Part 2: write makeCounter().
      function makeCounter() {
        let count = 0;
        return () => {
          count = count + 1;
          return count;
        };
      }

      const a = makeCounter();
      const b = makeCounter();
      console.log(a());
      console.log(a());
      console.log(a());
      console.log(b());
quiz:
  - q: Where can a variable declared with let inside curly braces { } be used?
    options: ["Anywhere in the file", "Only inside those braces", "Only in other functions"]
    answer: 1
  - q: What is a closure?
    options: ["A function that remembers the variables from where it was created", "A way to close the browser", "A loop that never ends"]
    answer: 0
  - q: In the lesson, why do counters a and b not affect each other?
    options: ["Because they are const", "Because JavaScript copies the numbers", "Because every call of makeCounter creates a fresh count variable"]
    answer: 2
  - q: 'What does  typeof someUndeclaredName  give?'
    options: ["\"undefined\"", "An error", "\"null\""]
    answer: 0
    explain: typeof is the one operator that is safe on names that do not exist. It answers "undefined" instead of throwing.
---

Where can you use a variable? The answer is its **scope**. Understanding scope explains many confusing errors, and it leads to one of JavaScript's most powerful ideas: the **closure**.

## Scope: where a variable lives

A variable created with `let` or `const` belongs to the nearest pair of curly braces `{ }` around it. That region is its **scope**.

```js
const city = "Haifa";        // global scope: visible everywhere

function greet() {
  const message = "Hi!";     // function scope: visible inside greet only
  console.log(message, city);
}

greet();                     // prints: Hi! Haifa
console.log(message);        // ReferenceError: message is not defined
```

The rule: **inner code can see outer variables, but outer code can not see inner ones.**

Blocks follow the same rule. A variable declared in an `if` or a loop body does not exist after it ends:

```js
if (true) {
  const temp = 5;
}
console.log(typeof temp); // prints: undefined
```

(We use `typeof` here because it does not crash for unknown names, while `console.log(temp)` would throw a `ReferenceError`.)

## Shadowing

If an inner scope declares a variable with the same name as an outer one, the inner one hides the outer one inside its braces:

```js
const x = "outer";
function show() {
  const x = "inner";
  console.log(x); // prints: inner
}
show();
console.log(x);   // prints: outer
```

## Functions can read outer variables

```js
let visits = 0;
function visit() {
  visits = visits + 1;
}
visit();
visit();
console.log(visits); // prints: 2
```

That works, but now anyone can change `visits`. A closure lets us keep it private.

## Closures

A function can **remember** the variables that were around it when it was created, even after the outer function has finished running. That combination (the function plus its remembered variables) is a **closure**.

```js
function makeGreeter(greeting) {
  return (name) => `${greeting}, ${name}!`;
}

const hello = makeGreeter("Hello");
const hola = makeGreeter("Hola");
console.log(hello("Ava")); // prints: Hello, Ava!
console.log(hola("Ben"));  // prints: Hola, Ben!
```

`makeGreeter` returns an arrow function. That function still has access to `greeting` even though `makeGreeter` has long finished. Each call to `makeGreeter` creates its **own** `greeting`, which is why `hello` and `hola` do not interfere.

Closures give you **private state**: variables that only your functions can touch, with no risk of other code messing them up.

## let and const instead of var

You may see older code using `var`. It ignores block scope (only function scope applies), which causes surprising bugs. Always use `let` and `const`.

> **Watch out:**
> - A `ReferenceError: x is not defined` often means you are using a variable outside the scope where it was declared. Move the declaration up or return the value.
> - Declaring a variable inside a loop or `if` and then using it after.
> - Creating the counter variable *outside* `makeCounter`. Then both counters share one number, instead of having their own.
> - Forgetting to `return` the inner function. Then `makeCounter()` gives back `undefined`, and `a()` fails with `TypeError: a is not a function`.
> - Writing `return count` instead of returning a function that returns `count`: you get a plain number, not a counter.
> - Shadowing by accident: a `let count` inside the inner function creates a new variable, so the outer one never changes.

## Going further

Write `makeAdder(n)` that returns a function adding `n` to its argument. Then `const add5 = makeAdder(5); add5(10)` gives `15`. Add a `reset` ability to your counter by returning an object with two methods.

> **Your turn:** read part 1, then write `makeCounter` so the four calls print `1`, `2`, `3` and `1`.
