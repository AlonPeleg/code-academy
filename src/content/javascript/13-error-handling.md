---
title: Handling errors with try and catch
summary: Throw your own errors and keep the program running when something goes wrong.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      // parseAge is done for you. It THROWS an error for bad input.
      function parseAge(text) {
        const n = Number(text);
        if (Number.isNaN(n)) {
          throw new Error("Not a number: " + text);
        }
        if (n < 0) {
          throw new Error("Age cannot be negative");
        }
        return n;
      }

      // Write safeAge(text). It must:
      //  - try block: call parseAge(text) and print "Age: <number>"
      //  - catch block: print "Error: <the error's message>"
      //  - a final block that ALWAYS prints "checked", whatever happened
      function safeAge(text) {

      }

      safeAge("21");
      safeAge("abc");
      safeAge("-5");

check:
  output: |
    Age: 21
    checked
    Error: Not a number: abc
    checked
    Error: Age cannot be negative
    checked
  code:
    - pattern: "try\\s*\\{"
      message: "Use a try { ... } block."
    - pattern: "catch\\s*\\(\\s*\\w+\\s*\\)"
      message: "Add a catch (error) { ... } block."
    - pattern: "finally\\s*\\{"
      message: "Add a finally { ... } block."
hints:
  - "Put the risky call in a try block, handle the problem in a catch block that receives the error, and put the always-run code in a third block."
  - "try { ... } catch (error) { ... } finally { ... }. The error object has a .message property with the text given to new Error(...)."
  - "try { const age = parseAge(text); console.log(\"Age: \" + age); } catch (error) { console.log(\"Error: \" + error.message); } finally { console.log(\"checked\"); }"
solution:
  - code: |
      function parseAge(text) {
        const n = Number(text);
        if (Number.isNaN(n)) {
          throw new Error("Not a number: " + text);
        }
        if (n < 0) {
          throw new Error("Age cannot be negative");
        }
        return n;
      }

      function safeAge(text) {
        try {
          const age = parseAge(text);
          console.log("Age: " + age);
        } catch (error) {
          console.log("Error: " + error.message);
        } finally {
          console.log("checked");
        }
      }

      safeAge("21");
      safeAge("abc");
      safeAge("-5");
quiz:
  - q: What happens to the rest of a try block after a line throws an error?
    options: ["It keeps running", "It is skipped and the catch block runs", "The program restarts"]
    answer: 1
  - q: How do you create your own error?
    options: ["error('message')", "return Error('message')", "throw new Error('message')"]
    answer: 2
  - q: When does a finally block run?
    options: ["Only if there was an error", "Always, with or without an error", "Only if there was no error"]
    answer: 1
  - q: What does  error.message  contain?
    options: ["The text that was passed to new Error()", "The line number", "The name of the file"]
    answer: 0
---

Things go wrong in real programs: a user types letters where a number should be, a file is missing, the network is down. Without handling, one error stops the whole program. With **try and catch** you can react to problems calmly and carry on.

## What is an error?

When JavaScript can not do what you ask, it **throws** an error and stops running the current code:

```js
const user = undefined;
console.log(user.name); // TypeError: Cannot read properties of undefined (reading 'name')
console.log("never reached");
```

You have seen messages like this in red in the output panel. Common error types:

| Type | Typical cause |
| --- | --- |
| `ReferenceError` | using a name that does not exist |
| `TypeError` | using a value the wrong way, such as calling something that is not a function |
| `SyntaxError` | the code is written incorrectly |
| `Error` | a general error, often thrown by your own code |

## try and catch

Wrap risky code in `try`. If anything inside throws, JavaScript jumps straight to `catch`, and the program **continues** afterwards:

```js
try {
  const data = JSON.parse("not json");
  console.log("parsed!");          // skipped
} catch (error) {
  console.log("Could not parse: " + error.name);
}
console.log("still running");
// prints:
// Could not parse: SyntaxError
// still running
```

- `catch (error)` gives the thrown error a name (any name you like) inside the catch block.
- `error.message` is the text describing the problem, and `error.name` is the type.
- Lines inside `try` after the failing one are skipped.

## Throwing your own errors

You can raise an error yourself when a value is not acceptable, using `throw new Error("message")`:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  divide(1, 0);
} catch (e) {
  console.log(e.message); // prints: Cannot divide by zero
}
```

This is better than quietly returning a wrong answer. The function says "I can not do this", and the caller decides what to do.

## finally

A `finally` block runs **always**: after the try if all went well, after the catch if there was an error. It is the right place for cleanup, such as hiding a loading message:

```js
try {
  console.log("working");
} finally {
  console.log("done");
}
```

## When should you use it?

Use `try/catch` around things that can fail for reasons outside your control: parsing user input, reading data, network requests. Do not wrap everything just to hide bugs. If your own code has a typo, fix the typo.

> **Watch out:**
> - Writing `catch` without a name when you need the error, and then using `error`: `ReferenceError: error is not defined`.
> - Swallowing errors with an empty `catch {}` block. The problem disappears silently and you will not know what went wrong. At least print it.
> - Throwing plain text: `throw "oops"` works but gives no `.message` or stack. Throw `new Error("oops")`.
> - Expecting `try/catch` to catch syntax errors or typos in the code that is not run. A `SyntaxError` stops the whole file before it starts.
> - Forgetting that variables declared with `const` inside `try { }` do not exist in `catch` or after, because of block scope. Declare them before the `try`.
> - Putting `return` in a `try` and being surprised that `finally` still runs. It does, before the function returns.

## Going further

Make `parseAge` also reject ages above 150 with its own message. Try `JSON.parse` inside a `safeParse` function that returns `null` when the text is invalid.

> **Your turn:** write `safeAge(text)` with `try`, `catch` and `finally` as the comments describe.
