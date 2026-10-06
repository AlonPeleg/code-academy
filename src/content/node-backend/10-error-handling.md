---
title: "Error handling: 404s, error middleware and async errors"
summary: Turn thrown errors into clean JSON answers with a custom error class, a 404 handler and one error middleware.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const express = require('express');
      const app = express();
      app.use(express.json());

      // 1. class HttpError extends Error: the constructor takes (status, message),
      //    calls super(message) and stores this.status.
      class HttpError {
        // TODO
      }

      // 2. asyncHandler(fn): returns a middleware (req, res, next) that runs fn(req, res, next)
      //    and sends any rejection to next. Hint: Promise.resolve(...).catch(next)
      function asyncHandler(fn) {
        return fn; // TODO: wrap it so failures go to next
      }

      const users = { 1: { id: 1, name: 'Ada' } };

      app.get('/users/:id', asyncHandler(async (req, res) => {
        const user = users[req.params.id];
        if (!user) throw new HttpError(404, 'User not found');
        res.json(user);
      }));
      app.post('/users', (req, res) => {
        if (!req.body.name) throw new HttpError(400, 'name is required');
        res.status(201).json({ id: 2, name: req.body.name });
      });
      app.get('/boom', () => {
        throw new Error('database exploded');
      });

      // 3. After all routes: a catch-all middleware (req, res) that answers
      //    404 with { error: 'Route GET /nope not found' } (use the real method and url).

      // 4. Last of all: the error middleware with FOUR parameters.
      //    - bad JSON from express.json() has err.type === 'entity.parse.failed':
      //      answer 400 { error: 'Invalid JSON' }
      //    - status = err.status or 500
      //    - for a 500: console.log('server error: ' + err.message) and answer
      //      { error: 'Internal server error' } (never show internals to clients)
      //    - otherwise answer with err.status and { error: err.message }

      // ---- test client (already written) ----
      const server = app.listen(3000);
      async function call(method, path, body) {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (body !== undefined) options.body = body;
        const res = await fetch('http://localhost:3000' + path, options);
        console.log(method + ' ' + path + ' -> ' + res.status + ' ' + (await res.text()));
      }
      await call('GET', '/users/1');
      await call('GET', '/users/9');
      await call('POST', '/users', '{}');
      await call('POST', '/users', '{ this is not json');
      await call('GET', '/boom');
      await call('GET', '/nope');
      server.close();
check:
  output: |
    GET /users/1 -> 200 {"id":1,"name":"Ada"}
    GET /users/9 -> 404 {"error":"User not found"}
    POST /users -> 400 {"error":"name is required"}
    POST /users -> 400 {"error":"Invalid JSON"}
    server error: database exploded
    GET /boom -> 500 {"error":"Internal server error"}
    GET /nope -> 404 {"error":"Route GET /nope not found"}
  code:
    - { pattern: 'extends\s+Error', message: "Make HttpError extend Error." }
    - { pattern: '\(\s*\w+\s*,\s*req\s*,\s*res\s*,\s*next\s*\)', message: "An error middleware must declare four parameters: (err, req, res, next)." }
hints:
  - "Express recognises an error handler by its four parameters (err, req, res, next). Anything thrown in a route, or passed to next(error), skips the normal middleware and lands in it. Register it LAST, after the 404 catch-all."
  - "class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }   function asyncHandler(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }   The 404 handler is app.use((req, res) => { res.status(404).json({ error: 'Route ' + req.method + ' ' + req.url + ' not found' }); });"
  - "app.use((err, req, res, next) => { if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' }); const status = err.status || 500; if (status === 500) { console.log('server error: ' + err.message); return res.status(500).json({ error: 'Internal server error' }); } res.status(status).json({ error: err.message }); });"
solution:
  - name: main.js
    code: |
      const express = require('express');
      const app = express();
      app.use(express.json());

      class HttpError extends Error {
        constructor(status, message) {
          super(message);
          this.status = status;
        }
      }

      function asyncHandler(fn) {
        return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
      }

      const users = { 1: { id: 1, name: 'Ada' } };

      app.get('/users/:id', asyncHandler(async (req, res) => {
        const user = users[req.params.id];
        if (!user) throw new HttpError(404, 'User not found');
        res.json(user);
      }));
      app.post('/users', (req, res) => {
        if (!req.body.name) throw new HttpError(400, 'name is required');
        res.status(201).json({ id: 2, name: req.body.name });
      });
      app.get('/boom', () => {
        throw new Error('database exploded');
      });

      app.use((req, res) => {
        res.status(404).json({ error: 'Route ' + req.method + ' ' + req.url + ' not found' });
      });

      app.use((err, req, res, next) => {
        if (err.type === 'entity.parse.failed') {
          return res.status(400).json({ error: 'Invalid JSON' });
        }
        const status = err.status || 500;
        if (status === 500) {
          console.log('server error: ' + err.message);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(status).json({ error: err.message });
      });

      // ---- test client (already written) ----
      const server = app.listen(3000);
      async function call(method, path, body) {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (body !== undefined) options.body = body;
        const res = await fetch('http://localhost:3000' + path, options);
        console.log(method + ' ' + path + ' -> ' + res.status + ' ' + (await res.text()));
      }
      await call('GET', '/users/1');
      await call('GET', '/users/9');
      await call('POST', '/users', '{}');
      await call('POST', '/users', '{ this is not json');
      await call('GET', '/boom');
      await call('GET', '/nope');
      server.close();
quiz:
  - q: "How does Express know a function is an error-handling middleware?"
    options: ["Its name ends with Handler", "It has exactly four parameters: (err, req, res, next)", "It is registered with app.error()"]
    answer: 1
    explain: "Express looks at function.length. Even if you do not use next, you must still declare it."
  - q: "Where must the 404 catch-all and the error middleware be registered?"
    options: ["At the very top, before everything", "Right after express.json() and before the routes", "After all the routes, the error handler last of all"]
    answer: 2
  - q: "Why does the 500 handler answer 'Internal server error' instead of err.message?"
    options: ["Error messages can reveal file paths, SQL or secrets to attackers, so log them on the server only", "Because err.message is always empty", "Because browsers cannot show error messages"]
    answer: 0
  - q: "A route handler is async and throws. What is the safe way that works in every Express version?"
    options: ["Do nothing, async code never fails", "Wrap it so rejections reach next(error), for example with try/catch or an asyncHandler helper", "Add a second app.listen"]
    answer: 1
    explain: "Express 5 forwards rejected promises by itself, but Express 4 does not and the request would hang."
---

Things go wrong in every real application: a user asks for something that does not exist, sends broken JSON, or your own code has a bug. This lesson shows how to turn all of these into clear, consistent answers instead of crashes and hanging requests.

## What Express does with errors

If a route handler throws, Express catches it and sends the error to a special place instead of your normal routes. The default answer is an HTML page, which is useless for a JSON API (and in development it shows the message and stack). You can take over by writing your own **error-handling middleware**:

```js
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
});
```

The only difference to normal middleware is the **fourth parameter** `err` at the front. Express counts the parameters: four means "I handle errors". You must keep all four even if you do not use `next`.

You can also send an error on purpose with `next(error)`: any argument to `next` (other than the word `'route'`) means "skip everything normal and go to the error handler".

## A custom error class

Errors need a status code. Instead of repeating `res.status(404).json(...)` everywhere you can throw an error that carries its status, and let one place turn it into a response:

```js
class HttpError extends Error {
  constructor(status, message) {
    super(message);   // sets err.message
    this.status = status;
  }
}
throw new HttpError(404, 'User not found');
```

`extends Error` gives you a stack trace for free. Now route handlers stay short: they throw when something is wrong, and otherwise only handle the happy path.

## The 404 handler

Express answers an unknown URL with its own HTML page. To control it, add a normal middleware **after all routes**. If a request reaches it, no route matched:

```js
app.use((req, res) => {
  res.status(404).json({ error: 'Route ' + req.method + ' ' + req.url + ' not found' });
});
```

## Async errors

A handler written with `async` returns a promise, and a `throw` inside becomes a rejected promise. **Express 5** (the current version) forwards rejections to the error handler on its own. **Express 4** does not: the request simply hangs. The portable fix is a tiny wrapper that works in both:

```js
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
app.get('/users/:id', asyncHandler(async (req, res) => { /* may throw */ }));
```

`Promise.resolve(...)` makes sure we have a promise, `.catch(next)` passes any failure to `next`, which means the error handler. Plain `try { ... } catch (e) { next(e); }` inside the handler does the same.

## One handler to rule them all

Put the decisions in the error middleware, registered **last**:

```js
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.log('server error: ' + err.message);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
});
```

Errors you expected (`404`, `400`) are safe to explain to the client. Unexpected errors (`500`) are bugs: log the details for yourself and show the client only a generic message, because real messages can leak file paths, database names or other secrets. Bad JSON is also covered: `express.json()` passes an error with `err.type === 'entity.parse.failed'`, which is a client mistake and deserves a `400`.

> **Watch out:**
> - **Registering the error handler before the routes.** Express only sends errors to handlers that come later in the list, so yours never runs.
> - **Writing only three parameters.** `(err, req, res)` is treated as a normal middleware and is skipped for errors. You then see the default HTML error page.
> - **Throwing inside a callback or a timer.** `setTimeout(() => { throw ... })` is outside Express, so it cannot be caught; it crashes the process. Use `next(err)` there.
> - **Sending two responses.** After `res.json(...)` in a handler, a later error leads to `Cannot set headers after they are sent to the client`. Always `return` after responding.

> **Your turn:** write `HttpError` and `asyncHandler`, then add the 404 catch-all and the four-parameter error middleware after the routes. The client at the bottom triggers a missing user, a validation error, broken JSON, a crash and an unknown URL.
