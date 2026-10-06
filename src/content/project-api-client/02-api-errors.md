---
title: "Step 2: ApiError and error handling"
summary: "Throw one custom ApiError, with the status and the server message, whenever a call fails."
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // API client library, step 2: one kind of error for every failed call.
      const BASE_URL = "https://api.academy.test";

      // TODO 1: write a class ApiError that extends Error. Its constructor takes (status, message, details),
      //         passes the message to super, sets this.name to "ApiError" and stores status and details.

      async function request(method, path, body) {
        const options = { method: method, headers: { Accept: "application/json" } };
        if (body !== undefined) {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
        const response = await fetch(BASE_URL + path, options);
        const text = await response.text();
        // TODO 2: parse the text safely: empty text means null; text that is not valid JSON
        //         becomes { error: text } (use try/catch around JSON.parse).

        // TODO 3: when response.ok is false, build a message (the "error" field of the body, else the
        //         statusText, else "HTTP <status>") and throw a new ApiError(status, message, data).

        return text ? JSON.parse(text) : null;
      }

      // ---- demo (already written, do not change) ----
      const ada = await request("GET", "/users/1");
      console.log("ok: " + ada.name);

      async function attempt(label, method, path, body) {
        try {
          await request(method, path, body);
          console.log(label + ": worked");
        } catch (error) {
          console.log(label + ": " + (error instanceof ApiError) + " " + error.status + " " + error.message);
        }
      }

      await attempt("missing user", "GET", "/users/99");
      await attempt("not signed in", "POST", "/users", { name: "Test" });
      await attempt("server crash", "GET", "/error/500");
      await attempt("bad id", "GET", "/users/abc");
check:
  output: |
    ok: Ada Lovelace
    missing user: true 404 No user with id 99
    not signed in: true 401 Sign in first: send the header Authorization: Bearer <token> (get one from POST /login)
    server crash: true 500 Internal Server Error
    bad id: true 400 "abc" is not a valid id
  code:
    - { pattern: "class\\s+ApiError\\s+extends\\s+Error", message: "Write class ApiError extends Error." }
    - { pattern: "response\\.ok", message: "Check response.ok to see whether the call succeeded." }
    - { pattern: "throw\\s+new\\s+ApiError\\s*\\(", message: "Throw new ApiError(status, message, data) for failed calls." }
hints:
  - "fetch does not reject for 404 or 500; you must look at response.ok yourself and throw an error when it is false. A custom error is a class that extends Error."
  - "class ApiError extends Error { constructor(status, message, details) { super(message); this.name = \"ApiError\"; ... } }. In request, wrap JSON.parse in try/catch, then if (!response.ok) throw new ApiError(...)."
  - "class ApiError extends Error { constructor(status, message, details) { super(message); this.name = \"ApiError\"; this.status = status; this.details = details; } }  let data = null; if (text) { try { data = JSON.parse(text); } catch (e) { data = { error: text }; } }  if (!response.ok) { const message = (data && data.error) || response.statusText || \"HTTP \" + response.status; throw new ApiError(response.status, message, data); }  return data;"
solution:
  - name: main.js
    code: |
      // API client library, step 2: one kind of error for every failed call.
      const BASE_URL = "https://api.academy.test";

      class ApiError extends Error {
        constructor(status, message, details) {
          super(message);
          this.name = "ApiError";
          this.status = status;
          this.details = details;
        }
      }

      async function request(method, path, body) {
        const options = { method: method, headers: { Accept: "application/json" } };
        if (body !== undefined) {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
        const response = await fetch(BASE_URL + path, options);
        const text = await response.text();

        let data = null;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = { error: text };
          }
        }

        if (!response.ok) {
          const message = (data && data.error) || response.statusText || "HTTP " + response.status;
          throw new ApiError(response.status, message, data);
        }
        return data;
      }

      // ---- demo ----
      const ada = await request("GET", "/users/1");
      console.log("ok: " + ada.name);

      async function attempt(label, method, path, body) {
        try {
          await request(method, path, body);
          console.log(label + ": worked");
        } catch (error) {
          console.log(label + ": " + (error instanceof ApiError) + " " + error.status + " " + error.message);
        }
      }

      await attempt("missing user", "GET", "/users/99");
      await attempt("not signed in", "POST", "/users", { name: "Test" });
      await attempt("server crash", "GET", "/error/500");
      await attempt("bad id", "GET", "/users/abc");
quiz:
  - q: "What does fetch do when the server answers 404 Not Found?"
    options: ["It rejects with an error", "It resolves normally; you must check response.ok", "It retries automatically"]
    answer: 1
    explain: "fetch only rejects when the network itself fails."
  - q: "Why call super(message) in the constructor of ApiError?"
    options: ["So the parent Error class stores the message and sets up this", "To make the error asynchronous", "To copy the status code"]
    answer: 0
  - q: "What is the advantage of throwing an error over returning an error object?"
    options: ["It is faster", "It prints in colour", "The caller cannot ignore it by accident, it stops until caught"]
    answer: 2
---
Servers fail in many ways: the user does not exist, you are not signed in, the data is invalid, the server itself crashes. In this step you give every failure the **same shape**, so the rest of your app can handle problems in one consistent way.

## Where we are

`request(method, path, body)` can call the server and return parsed JSON. But when the server answers `404 Not Found`, our helper happily returns `{ error: "No user with id 99" }` as if it were a normal result. The caller would have to inspect the data to find out something went wrong, and it is very easy to forget.

## What we will add, and why

We will **throw an error** whenever the HTTP status says the call failed (anything outside 200 to 299). A thrown error cannot be ignored by accident: it stops the program until someone catches it with `try/catch`. We will also make a custom error class, `ApiError`, that carries the details a caller needs: the numeric `status`, a readable `message` taken from the server's own body, and the full `details`. Real client libraries (Stripe, GitHub, AWS) all do this.

## Guided walk-through

**1. A custom error class.** `class ... extends Error` makes your own kind of error that still behaves like a normal one (it has a `message` and a stack trace):

```js
class ApiError extends Error {
  constructor(status, message, details) {
    super(message);        // lets Error store the message
    this.name = "ApiError"; // shown in logs
    this.status = status;
    this.details = details;
  }
}
```

`super(message)` calls the parent class's constructor. Without it you get `ReferenceError: Must call super constructor in derived class before accessing 'this'`.

**2. Parse the body safely.** An error page may not be JSON at all (a proxy might answer with plain text). Wrap `JSON.parse` in `try/catch` and fall back to the raw text:

```js
let data = null;
if (text) {
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { error: text };
  }
}
```

**3. Check `response.ok`.** It is `true` for statuses 200 to 299. When it is `false`, pick the best message available. The `||` operator returns the first value that is not empty:

```js
const message = (data && data.error) || response.statusText || "HTTP " + response.status;
throw new ApiError(response.status, message, data);
```

`data && data.error` protects against `data` being `null`.

**4. Catching the error.** Callers can now tell exactly what happened, and `instanceof` separates your own errors from bugs:

```js
try {
  await request("GET", "/users/99");
} catch (error) {
  if (error instanceof ApiError && error.status === 404) {
    console.log("no such user");
  } else {
    throw error; // a different problem: do not hide it
  }
}
```

The demo uses a helper `attempt(...)` that prints whether the error is an `ApiError`, its status and its message for a 404, a 401, a 500 and a 400.

> **Watch out:**
> - `fetch` only rejects on network failure (no connection). A `404` or `500` is still a **resolved** promise, so you must check `response.ok` yourself.
> - Reading the body twice: `response.json()` after `response.text()` fails with an error saying the body stream was already read. Read once, keep the text.
> - Throwing a plain string (`throw "failed"`) loses the stack trace and the status. Always throw an Error object.
> - Forgetting `await` on `request(...)` inside `try`: the rejection happens later and escapes your `catch`.

> **Your turn:** add the `ApiError` class and make `request` throw `new ApiError(status, message, data)` whenever `response.ok` is false, taking the message from the body's `error` field when there is one. Successful calls must still return the data. The demo prints one line per kind of failure.
