---
title: Express basics
summary: Build the same kind of server with far less code using Express - routes, res.send, res.json, status codes and express.json.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const express = require('express');

      // 1. Create the app: call express() and keep the result in a constant called app.

      // 2. Teach the app to read JSON request bodies (one line, see the lesson).

      // 3. Add four routes:
      //    GET  /           -> send the text: Welcome to Express
      //    GET  /api/hello  -> send the JSON object { message: 'Hello from Express' }
      //    GET  /about      -> send the HTML text: <h1>About us</h1>
      //    POST /api/echo   -> status 201 and the JSON object { received: <the request body> }

      // ---- The code below starts the server and calls it like a browser would. Do not change it. ----
      async function show(path) {
        const response = await fetch('http://localhost:3000' + path);
        console.log(response.status + ' ' + response.headers.get('content-type') + ' ' + (await response.text()));
      }

      const server = app.listen(3000, async () => {
        await show('/');
        await show('/api/hello');
        await show('/about');

        const echo = await fetch('http://localhost:3000/api/echo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Ada' }),
        });
        console.log(echo.status + ' ' + (await echo.text()));

        // No route matches this path, so Express answers 404 by itself.
        const missing = await fetch('http://localhost:3000/nothing');
        console.log('missing: ' + missing.status);

        server.close();
      });
check:
  output: |
    200 text/html; charset=utf-8 Welcome to Express
    200 application/json; charset=utf-8 {"message":"Hello from Express"}
    200 text/html; charset=utf-8 <h1>About us</h1>
    201 {"received":{"name":"Ada"}}
    missing: 404
  code:
    - { pattern: 'express\(\s*\)', message: "Create the app with const app = express();" }
    - { pattern: 'app\.use\(\s*express\.json\(\s*\)\s*\)', message: "Add app.use(express.json()) so req.body works." }
    - { pattern: 'app\.get\(\s*[''"]/api/hello', message: "Add a GET route for /api/hello with app.get." }
    - { pattern: 'res\.json\(', message: "Send JSON with res.json(...)." }
    - { pattern: 'res\.status\(\s*201\s*\)', message: "Use res.status(201) for the created answer." }
    - { pattern: 'app\.post\(', message: "Add the echo route with app.post(...)." }
hints:
  - "An Express route has the shape app.METHOD(path, handler) where handler is (req, res) => { ... }. Inside it, res.send(text) sends text or HTML and res.json(object) sends JSON. Chain res.status(code) in front to change the status code."
  - "const app = express(); app.use(express.json()); app.get('/', (req, res) => { res.send('Welcome to Express'); }); For the POST route the parsed body is in req.body."
  - "app.get('/api/hello', (req, res) => { res.json({ message: 'Hello from Express' }); }); app.get('/about', (req, res) => { res.send('<h1>About us</h1>'); }); app.post('/api/echo', (req, res) => { res.status(201).json({ received: req.body }); });"
solution:
  - name: main.js
    code: |
      const express = require('express');

      const app = express();
      app.use(express.json());

      app.get('/', (req, res) => {
        res.send('Welcome to Express');
      });

      app.get('/api/hello', (req, res) => {
        res.json({ message: 'Hello from Express' });
      });

      app.get('/about', (req, res) => {
        res.send('<h1>About us</h1>');
      });

      app.post('/api/echo', (req, res) => {
        res.status(201).json({ received: req.body });
      });

      async function show(path) {
        const response = await fetch('http://localhost:3000' + path);
        console.log(response.status + ' ' + response.headers.get('content-type') + ' ' + (await response.text()));
      }

      const server = app.listen(3000, async () => {
        await show('/');
        await show('/api/hello');
        await show('/about');

        const echo = await fetch('http://localhost:3000/api/echo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Ada' }),
        });
        console.log(echo.status + ' ' + (await echo.text()));

        const missing = await fetch('http://localhost:3000/nothing');
        console.log('missing: ' + missing.status);

        server.close();
      });
quiz:
  - q: "In app.get('/hello', (req, res) => { ... }), what does the first argument '/hello' do?"
    options: ["It is the name of the function", "It is the path this route answers to", "It is the port number"]
    answer: 1
  - q: "What is the difference between res.send('text') and res.json(object)?"
    options: ["res.json converts the object to JSON and sets Content-Type: application/json; res.send with a string sends text/HTML", "There is none", "res.json can only send arrays"]
    answer: 0
  - q: "Why do you need app.use(express.json()) for a POST route?"
    options: ["Without it the server cannot start", "It makes GET requests faster", "Without it req.body is undefined, because nobody read and parsed the JSON text"]
    answer: 2
    explain: "Express does not read request bodies unless you add the body-parsing middleware."
  - q: "A request arrives for a URL that has no route. What does Express do?"
    options: ["It answers 404 with 'Cannot GET /path' automatically", "It crashes the server", "It answers 200 with an empty page"]
    answer: 0
---

In the last lesson you built a server with the `http` module. It worked, but you wrote the routing with `if` statements, collected request bodies chunk by chunk and set every header by hand. **Express** is a small library that does all of that for you, and it is by far the most used way to build web servers in Node. By the end of this lesson you can create routes that send text, HTML and JSON.

## Installing and loading Express

Express is not built into Node; it is a **package**. On your own computer you add it to a project once with the package manager:

```
npm init -y
npm install express
```

After that `require('express')` works. In the practice environment Express is already available, so you just require it.

## An app and its routes

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(3000, () => console.log('Listening on port 3000'));
```

- `express()` creates an **app**: your server, ready for routes.
- `app.get(path, handler)` adds a **route**: "when a GET request arrives for this path, run this function". The same exists for the other methods: `app.post`, `app.put`, `app.patch`, `app.delete`.
- The handler gets `req` (the request) and `res` (the response), like before, but with many extras.
- `app.listen(port, callback)` starts the server, and the callback runs once it is ready. It returns the `server` object, whose `close()` method stops it.

Compare with lesson 5: no `req.method === 'GET' && req.url === '/'`, no `res.writeHead`. Express matches the route for you.

## Sending a response

| Method | What it does |
| --- | --- |
| `res.send('text')` | sends text or HTML (`Content-Type: text/html`) |
| `res.json(object)` | converts to JSON and sets `Content-Type: application/json` |
| `res.status(code)` | sets the status code; chain it: `res.status(201).json(...)` |
| `res.sendStatus(204)` | sends just a status code with its standard text |
| `res.redirect('/other')` | tells the client to go to another URL |

```js
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express' });
});

app.post('/api/things', (req, res) => {
  res.status(201).json({ created: true });
});
```

Every route must send exactly **one** response. `res.send`, `res.json` and friends finish the response for you, so there is no `res.end()` to forget.

## Reading JSON bodies

For a POST, the client sends data in the body. Express can parse JSON bodies, but you have to switch that on with one line, **before** your routes:

```js
app.use(express.json());
```

`app.use` registers a **middleware**: a function that runs for every request before your routes. `express.json()` looks at requests that carry JSON, parses the text, and puts the object in `req.body`. Middleware gets its own lesson soon.

## Unknown paths

If no route matches, Express sends a `404` answer by itself (`Cannot GET /nothing`). You do not have to write it, although later you will replace it with your own JSON error.

> **Watch out:**
> - **`req.body` is `undefined`.** You forgot `app.use(express.json())`, or placed it **after** the routes that need it. Express runs things in the order you wrote them.
> - **`Cannot GET /path` in the browser.** There is no route for that method and path. Check the spelling, the leading `/`, and that the method matches (`app.post` only answers POST).
> - **Sending two responses.** Calling `res.send()` twice (for example in an `if` and then again below it) fails with `Error: Cannot set headers after they are sent to the client`. Put `return` before a `res.send` that should stop the handler.
> - **`res.send(404)`.** A number is not a body. Use `res.sendStatus(404)` or `res.status(404).send('Not found')`.
> - **Port already in use.** Two servers on the same port give `EADDRINUSE`. In the practice environment, close each server at the end with `server.close()`.

## Going further

Add `app.get('/status', ...)` that answers with `res.status(200).json({ ok: true })` and then call it with `fetch`. Try `res.sendStatus(204)` and look at `response.status`.

> **Your turn:** in `main.js` create the app, switch on `express.json()`, and add the four routes (`/`, `/api/hello`, `/about` and `POST /api/echo`). The code below the routes starts the server and calls it, so five lines of output should appear when everything is right.
