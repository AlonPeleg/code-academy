---
title: Reading error messages
summary: Learn what an error name, message and stack trace tell you, catch errors with try/catch and fix a real bug.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // Part 1: a tiny "error detector".
      function tryIt(label, fn) {
        // 1. Run fn() inside a try block.
        //    - If it works, print the label, a colon and the word ok   (example: "fine: ok")
        //    - If it throws, catch the error and print the label, a colon and the error's name
        //      (example: "missing variable: ReferenceError")
      }

      tryIt("missing variable", () => totalPrice + 1);
      tryIt("undefined property", () => {
        const user = undefined;
        return user.name;
      });
      tryIt("not a function", () => {
        const count = 5;
        return count();
      });
      tryIt("bad array length", () => new Array(-1));
      tryIt("fine", () => 1 + 1);

      // Part 2: this function crashes. Read the error, then fix the bug.
      // 2. The user object below has the properties "first" and "last".
      const person = { first: "Grace", last: "Hopper" };

      function initials(user) {
        return user.firstName[0] + user.lastName[0];
      }

      console.log(initials(person));
check:
  output: |
    missing variable: ReferenceError
    undefined property: TypeError
    not a function: TypeError
    bad array length: RangeError
    fine: ok
    GH
  code:
    - pattern: 'try\s*\{'
      message: "Wrap fn() in a try { ... } block."
    - pattern: 'catch\s*\(\s*\w+\s*\)'
      message: "Add a catch (error) { ... } block to receive the error."
    - pattern: '\.name\b'
      message: "Use error.name to print the kind of error."
hints:
  - "A try block holds the risky code. If anything inside it throws, JavaScript jumps straight to the catch block and hands you the error object. Every error object has a .name and a .message."
  - "Write try { fn(); console.log(label + \": ok\"); } catch (error) { console.log(label + \": \" + error.name); }   For part 2, the TypeError message says it could not read property 0 of undefined: user.firstName does not exist, because the property is called first."
  - "function tryIt(label, fn) { try { fn(); console.log(label + \": ok\"); } catch (error) { console.log(label + \": \" + error.name); } }   and in initials: return user.first[0] + user.last[0];"
solution:
  - name: main.js
    code: |
      function tryIt(label, fn) {
        try {
          fn();
          console.log(label + ": ok");
        } catch (error) {
          console.log(label + ": " + error.name);
        }
      }

      tryIt("missing variable", () => totalPrice + 1);
      tryIt("undefined property", () => {
        const user = undefined;
        return user.name;
      });
      tryIt("not a function", () => {
        const count = 5;
        return count();
      });
      tryIt("bad array length", () => new Array(-1));
      tryIt("fine", () => 1 + 1);

      const person = { first: "Grace", last: "Hopper" };

      function initials(user) {
        return user.first[0] + user.last[0];
      }

      console.log(initials(person));
quiz:
  - q: "A message says: Cannot read properties of undefined (reading 'name'). What is the most likely problem?"
    options: ["The word name is spelled wrong in the message", "Something before .name is undefined, so there is nothing to read name from", "The computer ran out of memory"]
    answer: 1
    explain: "The message names the property you tried to read (name). The value you tried to read it from is undefined, so look at what comes right before the dot."
  - q: "Which error name do you get when you use a variable that was never declared?"
    options: ["TypeError", "RangeError", "ReferenceError"]
    answer: 2
  - q: "Where in a stack trace should you usually look first?"
    options: ["The very last line", "The first line that points to your own file and line number", "The line with the most words"]
    answer: 1
    explain: "The first line says what went wrong. Then scan down for the first line that mentions YOUR code: that is where to start looking."
  - q: "What does a catch (error) block receive?"
    options: ["The error object, with a name and a message", "Only the text of the message", "Nothing, you have to look in the console"]
    answer: 0
---
Every programmer sees errors all day long. The difference between a beginner and an expert is mostly that the expert **reads the message**. In this lesson you will learn to read an error like a short report: what went wrong, where, and how to catch it so your program does not crash.

## Anatomy of an error

When JavaScript cannot continue, it **throws an error**. If nothing catches it, the program stops and you see something like this (in Chrome or Node):

```text
TypeError: Cannot read properties of undefined (reading '0')
    at initials (main.js:3:28)
    at main.js:6:13
```

That small text has three parts:

| Part | Example | What it tells you |
| --- | --- | --- |
| **Name** | `TypeError` | The kind of problem |
| **Message** | `Cannot read properties of undefined (reading '0')` | The details |
| **Stack trace** | `at initials (main.js:3:28)` | Where it happened, newest call first |

The stack trace is a list of the functions that were running when the error happened. The top line is the place that failed. The lines below show who called it, then who called that, and so on. Read it like a trail of breadcrumbs back to your code. The two numbers at the end of each line are the line and the column.

## The error names you will meet most

* `ReferenceError`: you used a name that does not exist (a typo, or a variable declared somewhere else). Message: `totalPrice is not defined`.
* `TypeError`: you used a value in a way its type does not allow, like reading a property of `undefined` or calling a number as a function. Messages: `Cannot read properties of undefined (reading 'name')`, `count is not a function`.
* `RangeError`: a number is outside what is allowed, like `new Array(-1)` (`Invalid array length`) or infinite recursion (`Maximum call stack size exceeded`).
* `SyntaxError`: the code is not valid JavaScript (a missing bracket or quote). It is found before anything runs, so it cannot be caught with `try/catch` in the same file.

The exact wording of messages differs a little between browsers, so rely on the **name** and the **idea** of the message.

## Catching an error

`try/catch` lets you run risky code and decide what happens if it fails:

```js
try {
  console.log("before");
  undefinedFunction();      // throws a ReferenceError
  console.log("never printed");
} catch (error) {
  console.log(error.name);     // prints: ReferenceError
  console.log(error.message);  // prints: undefinedFunction is not defined
}
console.log("the program keeps going");
```

* The code in `try { }` runs line by line until something throws.
* JavaScript jumps to `catch (error) { }` and puts the error object in the variable `error` (you can call it `e` or `err`).
* The lines after the failing one inside `try` are skipped.

## How to read an error calmly

1. Read the **name** first: it narrows the problem down a lot.
2. Read the **message** word by word. Names of variables and properties appear in it.
3. Find the first stack line that points into **your** file, and go to that line.
4. Ask: what value is `undefined` or wrong here, and where did it come from?

> **Watch out:**
> * **Fixing the wrong line.** The error line is where the program *noticed* the problem, not always where it *started*. If `user.name` fails, the real mistake may be that `user` was never set earlier.
> * **Ignoring `reading '0'`.** In `Cannot read properties of undefined (reading '0')` the thing in quotes is the property you tried to read. It tells you which expression failed: `something[0]` where `something` is undefined.
> * **Empty catch blocks.** `catch (e) {}` hides the error and makes bugs invisible. At least print `error.message`.
> * **Case matters.** `firstName` and `firstname` are different properties. A wrong name gives `undefined`, not an error, until you use that `undefined`.

> **Your turn:** Two parts. (1) Finish `tryIt(label, fn)`: call `fn()` inside `try`; print `label: ok` when it works, or `label: ` followed by `error.name` when it throws. (2) The `initials` function crashes: read the error it causes, find out which property names are wrong, and fix them so it prints `GH`.
