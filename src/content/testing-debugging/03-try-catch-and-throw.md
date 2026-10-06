---
title: try, catch, finally and throw
summary: Handle failures gracefully, throw your own errors and create custom error types.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // A custom error type (already written for you).
      class ValidationError extends Error {
        constructor(message, field) {
          super(message);
          this.name = "ValidationError";
          this.field = field;
        }
      }

      // 1. Write parseAge(text). It returns the age as a number, but:
      //    - if text is empty (after trim()) or Number(text) is NaN
      //      throw a ValidationError with the message "Age must be a number" and the field "age"
      //    - if the number is below 0 or above 120
      //      throw a ValidationError with the message "Age must be between 0 and 120" and the field "age"
      function parseAge(text) {

      }

      // 2. Write tryParse(text). It calls parseAge(text) and:
      //    - on success prints  OK: <age>
      //    - if a ValidationError is thrown prints  Invalid (<field>): <message>
      //    - any OTHER kind of error must be thrown again (throw the same error again)
      //    - whatever happens, finally prints  checked: <text>
      function tryParse(text) {

      }

      tryParse("42");
      tryParse("abc");
      tryParse("200");
check:
  output: |
    OK: 42
    checked: 42
    Invalid (age): Age must be a number
    checked: abc
    Invalid (age): Age must be between 0 and 120
    checked: 200
  code:
    - pattern: 'throw\s+new\s+ValidationError\s*\('
      message: "Use throw new ValidationError(message, \"age\") inside parseAge."
    - pattern: 'catch\s*\(\s*\w+\s*\)'
      message: "tryParse needs a catch block."
    - pattern: 'finally\s*\{'
      message: "Use a finally block for the checked line."
    - pattern: 'instanceof\s+ValidationError'
      message: "Use error instanceof ValidationError to recognise your own errors."
hints:
  - "parseAge should throw (not print) when the input is bad. tryParse wraps the call in try, handles ValidationError in catch and always prints the checked line in finally."
  - "In catch (error): if (error instanceof ValidationError) { console.log(...) } else { throw error; }.  In parseAge: const age = Number(text); then two if statements that throw."
  - "function parseAge(text) { const age = Number(text); if (text.trim() === \"\" || Number.isNaN(age)) throw new ValidationError(\"Age must be a number\", \"age\"); if (age < 0 || age > 120) throw new ValidationError(\"Age must be between 0 and 120\", \"age\"); return age; }   function tryParse(text) { try { console.log(\"OK: \" + parseAge(text)); } catch (error) { if (error instanceof ValidationError) { console.log(\"Invalid (\" + error.field + \"): \" + error.message); } else { throw error; } } finally { console.log(\"checked: \" + text); } }"
solution:
  - name: main.js
    code: |
      class ValidationError extends Error {
        constructor(message, field) {
          super(message);
          this.name = "ValidationError";
          this.field = field;
        }
      }

      function parseAge(text) {
        const age = Number(text);
        if (text.trim() === "" || Number.isNaN(age)) {
          throw new ValidationError("Age must be a number", "age");
        }
        if (age < 0 || age > 120) {
          throw new ValidationError("Age must be between 0 and 120", "age");
        }
        return age;
      }

      function tryParse(text) {
        try {
          const age = parseAge(text);
          console.log("OK: " + age);
        } catch (error) {
          if (error instanceof ValidationError) {
            console.log("Invalid (" + error.field + "): " + error.message);
          } else {
            throw error;
          }
        } finally {
          console.log("checked: " + text);
        }
      }

      tryParse("42");
      tryParse("abc");
      tryParse("200");
quiz:
  - q: "When does the finally block run?"
    options: ["Only if there was an error", "Only if there was no error", "Always, whether or not an error happened"]
    answer: 2
  - q: "What is the difference between console.log(error) and throw error inside a catch block?"
    options: ["There is no difference", "log just prints it, while throw passes the error on so something else (or the program) can still react to it", "throw prints it in red"]
    answer: 1
  - q: "Why do we write throw new Error(\"message\") instead of throw \"message\"?"
    options: ["An Error object carries a name, a message and a stack trace that help you debug", "Strings cannot be thrown at all", "It makes the program faster"]
    answer: 0
    explain: "You can throw any value, but only Error objects (and classes that extend Error) give you the stack trace."
  - q: "What does error instanceof ValidationError check?"
    options: ["Whether the error message contains the word ValidationError", "Whether the error was created from the ValidationError class (or one that extends it)", "Whether the program is valid"]
    answer: 1
---
Things go wrong in real programs: a user types letters where a number is expected, a file is missing, a network call fails. In this lesson you will learn how to **handle** failures with `try`, `catch` and `finally`, and how to **raise** your own errors with `throw` so that mistakes are noticed early and clearly.

## try / catch / finally

```js
function risky(shouldFail) {
  try {
    console.log("start");
    if (shouldFail) throw new Error("boom");
    console.log("no problem");
  } catch (error) {
    console.log("caught: " + error.message);
  } finally {
    console.log("always runs");
  }
}
risky(false);   // prints: start, no problem, always runs
risky(true);    // prints: start, caught: boom, always runs
```

* `try { }` is the code that might fail.
* `catch (error) { }` runs **only if** something inside `try` threw. The error object arrives in `error`.
* `finally { }` runs **always**: after success, after a caught error, even if `try` has a `return`. It is the place for cleanup: closing a connection, hiding a loading spinner, printing a "done" line.

You can have `try/finally` without a `catch`; then the error continues upwards after the cleanup has run.

## Throwing your own errors

`throw` stops the current function immediately and sends an error upwards until someone catches it:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
```

Why throw instead of returning something like `-1` or `null`? Because a special return value can be ignored by mistake, while an error cannot be ignored: the program stops, or the caller deals with it. A function that checks its input and fails loudly is much easier to debug than one that quietly produces nonsense. (This is called **failing fast**.)

Always throw an `Error` object, not a string. An `Error` carries `name`, `message` and a `stack`:

```js
throw new Error("Out of stock");          // good
throw "Out of stock";                     // legal, but no stack trace
```

The built-in subtypes `TypeError` and `RangeError` are good choices: `throw new RangeError("age must be 0 or more")`.

## Custom error types

If you want callers to react differently to different problems, make your own class that extends `Error`:

```js
class NotFoundError extends Error {
  constructor(what) {
    super(what + " was not found");   // sets the message
    this.name = "NotFoundError";       // sets the name shown in logs
  }
}

try {
  throw new NotFoundError("user 7");
} catch (error) {
  console.log(error.name);                          // prints: NotFoundError
  console.log(error instanceof NotFoundError);      // prints: true
  console.log(error instanceof Error);              // prints: true
}
```

`instanceof` asks "was this made from that class?". This lets you handle the errors you expect and **re-throw** all the others:

```js
catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Please check the id.");
  } else {
    throw error;   // not ours: let it continue
  }
}
```

Swallowing every error silently is dangerous, because it also hides real bugs such as typos.

> **Watch out:**
> * **Catching too much.** A big `try` around the entire program hides where the failure was. Keep `try` blocks small, around the lines that can really fail.
> * **Forgetting `new`.** `throw Error("x")` works, but `throw ValidationError("x")` on a class fails with `TypeError: Class constructor ValidationError cannot be invoked without 'new'`.
> * **Forgetting `super(...)`.** In a class that extends `Error`, the constructor must call `super(message)` first, or you get `ReferenceError: Must call super constructor in derived class before accessing 'this'`.
> * **Empty strings.** `Number("")` is `0`, not `NaN`! Check for an empty input yourself, as in this lesson's exercise.

> **Your turn:** Write `parseAge(text)` so that it throws a `ValidationError` for non-numbers and for ages outside 0 to 120, and `tryParse(text)` so that it prints `OK: <age>` or `Invalid (<field>): <message>`, re-throws any other kind of error, and always prints `checked: <text>` in a `finally` block.
