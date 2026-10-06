---
title: "Middleware: the request pipeline"
summary: Chain small functions with app.use and next() to log requests, parse JSON, add headers and guard routes.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const express = require('express');
      const app = express();

      // 1. logger(req, res, next): print the method and url, e.g. "GET /hello", then call next.
      function logger(req, res, next) {
        // TODO
      }

      // 2. requireKey(req, res, next): if the request header "x-api-key" is not "secret",
      //    answer with status 401 and the JSON { error: 'API key required' } (and do NOT call next).
      //    Otherwise call next.
      function requireKey(req, res, next) {
        // TODO
      }

      // 3. Register middleware HERE, before the routes (order matters!):
      //    - your logger for every request
      //    - the built-in JSON body parser, so req.body works
      //    - a small inline middleware that sets the response header X-Served-By to "academy"
      //    - requireKey, but only for paths that start with /admin

      app.get('/hello', (req, res) => res.send('Hello'));
      app.post('/echo', (req, res) => res.status(201).json({ got: req.body }));
      app.get('/admin/stats', (req, res) => res.json({ users: 3 }));

      // ---- test client (already written) ----
      const server = app.listen(3000);
      async function call(method, path, options = {}) {
        const res = await fetch('http://localhost:3000' + path, { method, ...options });
        console.log('-> ' + res.status + ' [' + res.headers.get('x-served-by') + '] ' + (await res.text()));
      }
      await call('GET', '/hello');
      await call('POST', '/echo', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ada' }),
      });
      await call('GET', '/admin/stats');
      await call('GET', '/admin/stats', { headers: { 'x-api-key': 'secret' } });
      server.close();
check:
  output: |
    GET /hello
    -> 200 [academy] Hello
    POST /echo
    -> 201 [academy] {"got":{"name":"Ada"}}
    GET /admin/stats
    -> 401 [academy] {"error":"API key required"}
    GET /admin/stats
    -> 200 [academy] {"users":3}
  code:
    - { pattern: 'next\(\)', message: "Call next() to hand the request to the next middleware." }
    - { pattern: 'express\.json\(\)', message: "Register express.json() so req.body is filled." }
    - { pattern: 'app\.use\(', message: "Register your middleware with app.use(...)." }
hints:
  - "A middleware is a function (req, res, next). It either finishes the request (res.json, res.send, res.status(...).json) or calls next() to pass the request on. app.use(...) registers it, and the order of the app.use lines is the order they run."
  - "logger: console.log(req.method + ' ' + req.url); next();   requireKey: if (req.headers['x-api-key'] !== 'secret') { return res.status(401).json({ error: 'API key required' }); } next();   The header middleware is app.use((req, res, next) => { res.set('X-Served-By', 'academy'); next(); });"
  - "app.use(logger); app.use(express.json()); app.use((req, res, next) => { res.set('X-Served-By', 'academy'); next(); }); app.use('/admin', requireKey);   (all four lines go ABOVE app.get('/hello', ...))"
solution:
  - name: main.js
    code: |
      const express = require('express');
      const app = express();

      function logger(req, res, next) {
        console.log(req.method + ' ' + req.url);
        next();
      }

      function requireKey(req, res, next) {
        if (req.headers['x-api-key'] !== 'secret') {
          return res.status(401).json({ error: 'API key required' });
        }
        next();
      }

      app.use(logger);
      app.use(express.json());
      app.use((req, res, next) => {
        res.set('X-Served-By', 'academy');
        next();
      });
      app.use('/admin', requireKey);

      app.get('/hello', (req, res) => res.send('Hello'));
      app.post('/echo', (req, res) => res.status(201).json({ got: req.body }));
      app.get('/admin/stats', (req, res) => res.json({ users: 3 }));

      // ---- test client (already written) ----
      const server = app.listen(3000);
      async function call(method, path, options = {}) {
        const res = await fetch('http://localhost:3000' + path, { method, ...options });
        console.log('-> ' + res.status + ' [' + res.headers.get('x-served-by') + '] ' + (await res.text()));
      }
      await call('GET', '/hello');
      await call('POST', '/echo', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ada' }),
      });
      await call('GET', '/admin/stats');
      await call('GET', '/admin/stats', { headers: { 'x-api-key': 'secret' } });
      server.close();
quiz:
  - q: "What happens if a middleware neither sends a response nor calls next()?"
    options: ["Express skips it and carries on", "The request hangs: the client keeps waiting for an answer", "Express sends a 404 automatically"]
    answer: 1
    explain: "Express cannot guess what you meant. Always either respond or call next()."
  - q: "You write app.get('/hello', ...) first and app.use(logger) after it. Does the logger run for GET /hello?"
    options: ["Yes, app.use always runs first", "Yes, but only after the response", "No, the route already answered, so the later middleware is never reached"]
    answer: 2
    explain: "Express walks the list from top to bottom and stops as soon as something sends a response."
  - q: "What does app.use('/admin', requireKey) do?"
    options: ["Runs requireKey only for request paths that start with /admin", "Creates a route called /admin", "Runs requireKey for every path except /admin"]
    answer: 0
  - q: "Why do we put express.json() before the routes?"
    options: ["So that res.json works", "So that req.body is already filled with the parsed JSON when the route handler runs", "Because Express only allows one middleware per route"]
    answer: 1
---

So far every request went straight to a route handler. Real apps need work that happens for many routes: logging, reading JSON bodies, checking a login, adding headers. Express solves this with **middleware**, and once you understand it, most of Express stops being magic.

## What is middleware?

A middleware is a normal function with three parameters:

```js
function logger(req, res, next) {
  console.log(req.method + ' ' + req.url);
  next();
}
```

- `req` is the request, `res` is the response (you already know them from route handlers).
- `next` is a function. Calling `next()` means "I am done, give the request to the next function in the line".

Think of an airport: you pass the ticket check, then security, then the gate. Each step either lets you through (`next()`) or stops you with an answer (`res.status(401)...`). A route handler is simply the last step in that line.

You register middleware with `app.use`:

```js
app.use(logger);          // runs for EVERY request
app.use('/admin', check); // runs only when the path starts with /admin
```

## Order matters

Express keeps one list and walks it from top to bottom for every request. It stops the moment someone sends a response.

```js
app.get('/hello', (req, res) => res.send('Hello')); // answers here...
app.use(logger);                                    // ...so this never runs for /hello
```

The rule: register your middleware **before** the routes that need it. Logging, body parsing and security go first, the routes after them, and error handling last (next lesson series).

## Stopping the line early

A middleware does not have to call `next()`. A guard answers itself when something is wrong:

```js
function requireKey(req, res, next) {
  if (req.headers['x-api-key'] !== 'secret') {
    return res.status(401).json({ error: 'API key required' });
  }
  next();
}
```

Notice the `return`: it stops the function after sending the error, so `next()` is not called too. Node lowercases header names, so always read `req.headers['x-api-key']` in lowercase.

## Passing data along

Because every function in the line gets the same `req` object, a middleware can attach information for the later ones:

```js
app.use((req, res, next) => {
  req.requestId = 'r1';   // any later handler can read req.requestId
  next();
});
```

You will use exactly this trick in the authentication lesson to store the logged in user in `req.user`.

## Built-in and third-party middleware

`express.json()` is middleware too. It reads the raw body, parses the JSON and puts the result in `req.body`. Without it `req.body` is `undefined`. Other popular ones from npm: `cors` (allow browsers from other sites), `morgan` (a ready-made request logger) and `helmet` (safer HTTP headers). A middleware can also be used for a single route only: `app.get('/x', requireKey, handler)`.

> **Watch out:**
> - **Forgetting `next()`.** The request never ends; `fetch` waits forever. If a route "hangs", check every middleware before it.
> - **Calling `next()` after responding.** Without `return` you may send a response and then also continue, which can end in `Cannot set headers after they are sent to the client`.
> - **Registering `app.use(express.json())` after the routes.** Then `req.body` is `undefined` inside them and you get `TypeError: Cannot read properties of undefined`.
> - **Reading `req.headers['X-Api-Key']`.** Node stores header names in lowercase, so that lookup is always `undefined`.

## Going further

Make `requireKey` a function that returns a middleware, `requireKey('secret')`, so different parts of the app can use different keys. A function that builds middleware is called a factory, and you will meet it again for roles.

> **Your turn:** fill in `logger` and `requireKey`, then register four things above the routes: your logger, `express.json()`, an inline middleware that sets the `X-Served-By` header to `academy`, and `requireKey` for the `/admin` path. The test client at the bottom prints the result.
