---
title: "Designing good requests: a reusable request() helper"
summary: Stop repeating fetch boilerplate by writing one request() function with query support, JSON bodies, auth and a custom ApiError.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // A custom error that carries the HTTP status and the server's details.
      class ApiError extends Error {
        constructor(status, message, fields) {
          super(message);
          this.name = 'ApiError';
          this.status = status;
          this.fields = fields;
        }
      }

      // Write request(method, path, options) where options is { body, token, query }.
      // It must:
      //   - build the URL: BASE + path, and if options.query exists add
      //     '?' + new URLSearchParams(options.query)
      //   - send the header Accept: application/json
      //   - if there is a body: send JSON text and the matching Content-Type header
      //   - if there is a token: send Authorization: Bearer <token>
      //   - on status 204 return null
      //   - if the response is not ok, read the JSON error body (use .catch(() => ({}))
      //     in case there is none) and throw new ApiError(res.status, body.error, body.fields)
      //   - otherwise return the parsed JSON
      async function request(method, path, options = {}) {
        // your code here
      }

      // ---- The code below uses your helper; do not change it ----
      const login = await request('POST', '/login', {
        body: { email: 'ada@example.com', password: 'engine123' },
      });
      const token = login.token;
      console.log('token: ' + token);

      const created = await request('POST', '/todos', { token, body: { title: 'Helper', userId: 1 } });
      console.log('created: ' + created.id);

      const deleted = await request('DELETE', '/todos/' + created.id, { token });
      console.log('deleted: ' + deleted);

      try {
        await request('GET', '/users/99');
      } catch (error) {
        console.log(error.name + ' ' + error.status + ' ' + error.message);
      }

      try {
        await request('POST', '/todos', { token, body: {} });
      } catch (error) {
        console.log(error.name + ' ' + error.status + ' ' + JSON.stringify(error.fields));
      }

      const editors = await request('GET', '/users', { query: { role: 'editor' } });
      console.log('editors: ' + editors.length);
check:
  output: |
    token: token-ada
    created: 11
    deleted: null
    ApiError 404 No user with id 99
    ApiError 422 {"title":"is required","userId":"is required"}
    editors: 2
  code:
    - { pattern: 'URLSearchParams', message: "Build the query string with URLSearchParams." }
    - { pattern: 'JSON\.stringify\(', message: "Convert the body with JSON.stringify." }
    - { pattern: 'Authorization', message: "Add the Authorization header when a token is given." }
    - { pattern: '\.ok\b', message: "Check res.ok to detect error responses." }
    - { pattern: 'throw\s+new\s+ApiError', message: "Throw a new ApiError for bad responses." }
hints:
  - "Collect the pieces step by step: a url string, a headers object (start with Accept) and a fetch options object. Add Content-Type and body only if options.body is set, and Authorization only if options.token is set."
  - "let url = BASE + path; if (options.query) url += '?' + new URLSearchParams(options.query); const headers = { Accept: 'application/json' }; if (options.token) headers.Authorization = 'Bearer ' + options.token; const init = { method, headers }; if (options.body !== undefined) { headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(options.body); }"
  - "const res = await fetch(url, init); if (res.status === 204) return null; if (!res.ok) { const err = await res.json().catch(() => ({})); throw new ApiError(res.status, err.error, err.fields); } return res.json();"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      class ApiError extends Error {
        constructor(status, message, fields) {
          super(message);
          this.name = 'ApiError';
          this.status = status;
          this.fields = fields;
        }
      }

      async function request(method, path, options = {}) {
        let url = BASE + path;
        if (options.query) url += '?' + new URLSearchParams(options.query);

        const headers = { Accept: 'application/json' };
        if (options.token) headers.Authorization = 'Bearer ' + options.token;

        const init = { method, headers };
        if (options.body !== undefined) {
          headers['Content-Type'] = 'application/json';
          init.body = JSON.stringify(options.body);
        }

        const res = await fetch(url, init);
        if (res.status === 204) return null;
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new ApiError(res.status, err.error, err.fields);
        }
        return res.json();
      }

      const login = await request('POST', '/login', {
        body: { email: 'ada@example.com', password: 'engine123' },
      });
      const token = login.token;
      console.log('token: ' + token);

      const created = await request('POST', '/todos', { token, body: { title: 'Helper', userId: 1 } });
      console.log('created: ' + created.id);

      const deleted = await request('DELETE', '/todos/' + created.id, { token });
      console.log('deleted: ' + deleted);

      try {
        await request('GET', '/users/99');
      } catch (error) {
        console.log(error.name + ' ' + error.status + ' ' + error.message);
      }

      try {
        await request('POST', '/todos', { token, body: {} });
      } catch (error) {
        console.log(error.name + ' ' + error.status + ' ' + JSON.stringify(error.fields));
      }

      const editors = await request('GET', '/users', { query: { role: 'editor' } });
      console.log('editors: ' + editors.length);
quiz:
  - q: "What is the main benefit of wrapping fetch in a request() helper?"
    options: ["Requests become faster", "Headers, JSON conversion, auth and error handling are written once instead of in every call", "It hides the network from the browser"]
    answer: 1
  - q: "Why throw a custom ApiError (with status and fields) instead of a plain Error?"
    options: ["Callers can inspect error.status and error.fields to decide what to do", "Plain errors cannot be caught", "It stops the request from being sent"]
    answer: 0
  - q: "Why do we use .catch(() => ({})) when reading an error body?"
    options: ["To retry the request", "Because some error responses have no JSON body, and parsing would otherwise throw a confusing SyntaxError", "To hide the status code"]
    answer: 1
  - q: "Where should the Content-Type: application/json header be added?"
    options: ["On every request, including GET", "Only on responses", "Only when the request has a body that is JSON"]
    answer: 2
---

You have now written the same `fetch` options five times: the method, the `Authorization` header, the `Content-Type` header, `JSON.stringify`, and a check for `res.ok`. Code that repeats is code that breaks: forget one line in one place and you get a mysterious `415` or `401`. Professional projects solve this with a small wrapper function. In this lesson you write it.

## The shape of a good helper

A well-designed `request()` has one job: turn "I want to POST this object to that path" into a correct HTTP request, and turn the answer into either **data** or a clear **error**.

```js
const todo = await request('POST', '/todos', { token, body: { title: 'Helper', userId: 1 } });
const users = await request('GET', '/users', { query: { role: 'editor' } });
await request('DELETE', '/todos/11', { token });
```

Calls read like a sentence, and nothing about headers appears at the call site. Here is the translation the helper performs:

```
request('POST', '/todos', { token, body })
        |
        v
POST /todos HTTP/1.1
Accept: application/json
Authorization: Bearer <token>
Content-Type: application/json

{"title":"Helper","userId":1}
```

## Step by step

1. **Build the URL.** Start from `BASE + path`. If `options.query` exists, append `'?' + new URLSearchParams(options.query)`, which also escapes special characters.
2. **Build the headers.** Always send `Accept: application/json`. Add `Authorization` only if a token was given.
3. **Add the body only when needed.** If `options.body !== undefined`, set `Content-Type` and `JSON.stringify` it. A `GET` must not have a body.
4. **Send the request** with `await fetch(url, init)`.
5. **Handle the outcome.**
   - `204`: there is no body, return `null`.
   - not `res.ok`: read the error body and **throw**.
   - otherwise: return the parsed JSON.

## A custom error class

When `request` throws, the caller needs more than a message. A tiny subclass of `Error` can carry the details:

```js
class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.name = 'ApiError';
    this.status = status;   // 404, 422, ...
    this.fields = fields;   // validation details, if any
  }
}
```

Now callers can react to different situations:

```js
try {
  await request('POST', '/todos', { token, body: {} });
} catch (error) {
  if (error instanceof ApiError && error.status === 422) {
    console.log(error.fields); // { title: "is required", userId: "is required" }
  } else {
    throw error;               // not ours (for example a network failure): pass it on
  }
}
```

This is a general design rule: **catch only what you can handle**, and re-throw the rest.

## Error handling patterns

| Situation | What to do |
| --- | --- |
| `4xx` from your mistake (`400`, `422`) | show the message; fix the input |
| `401` | sign in again and retry once |
| `403`, `404` | tell the user; retrying will not help |
| `5xx` or network failure | may be temporary: retry with backoff (lesson 11) |
| No body in the error response | fall back to a generic message |

The line `await res.json().catch(() => ({}))` protects you from servers that answer an error without JSON (a crashing proxy might send an HTML page). Without it, the *parsing* error would hide the *real* problem.

> **Watch out:**
> - **Forgetting `return` or `await`.** `request` must `return res.json()`; if you forget `return`, callers receive `undefined`.
> - **Setting `Content-Type` on a `GET`.** It is unnecessary and some servers dislike it. Only set it when you send a body.
> - **Testing `if (options.body)`.** That skips legitimate bodies like `0` or `false`. Compare with `!== undefined`.
> - **Swallowing errors.** `catch (e) { }` with nothing inside hides bugs. Log, handle, or re-throw.
> - **Mutating the caller's options.** Build a new `headers` object each time; do not reuse a shared one.

## Going further

Add an option `{ signal }` for cancellation, or make the helper log every call as `GET /users -> 200`. A good next step: make `request` automatically add the token from a module-level variable after login.

> **Your turn:** complete `request(method, path, options)` as described in the starter comments. Everything below it is already written and uses your helper, so when it is correct the six lines of output appear.
