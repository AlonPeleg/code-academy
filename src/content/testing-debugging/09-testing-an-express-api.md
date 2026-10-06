---
title: Testing an Express API
summary: Write integration tests that start a real server, send HTTP requests with fetch and check status codes and JSON bodies.
level: advanced
runner: js
files:
  - name: todos.test.js
    code: |
      const { createApp } = require("./app");

      describe("todo API", () => {
        let server;
        let baseUrl;

        // A brand new app and server for every test, so tests never share data.
        beforeEach(async () => {
          const app = createApp();
          await new Promise((resolve) => {
            server = app.listen(0, resolve);   // port 0 = pick any free port
          });
          baseUrl = `http://localhost:${server.address().port}`;
        });

        afterEach(async () => {
          await new Promise((resolve) => server.close(resolve));
        });

        // Small helper: send a request and return the status and the JSON body.
        async function request(path, options) {
          const response = await fetch(baseUrl + path, options);
          return { status: response.status, body: await response.json() };
        }

        it("lists the todos", async () => {
          const { status, body } = await request("/todos");
          expect(status).toBe(200);
          expect(body).toHaveLength(2);
        });

        it("returns one todo by id", async () => {
          const { status, body } = await request("/todos/1");
          expect(status).toBe(200);
          expect(body).toEqual({ id: 1, title: "Write tests", done: true });
        });

        it("answers 404 for a todo that does not exist", async () => {
          const { status, body } = await request("/todos/99");
          expect(status).toBe(404);
          expect(body).toEqual({ error: "Todo not found" });
        });

        it("creates a todo and answers 201", async () => {
          const { status, body } = await request("/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Learn Express" }),
          });
          expect(status).toBe(201);
          expect(body).toEqual({ id: 3, title: "Learn Express", done: false });

          const list = await request("/todos");
          expect(list.body).toHaveLength(3);
        });

        it("answers 400 when the title is missing", async () => {
          const { status, body } = await request("/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          expect(status).toBe(400);
          expect(body).toEqual({ error: "title is required" });
        });
      });
  - name: app.js
    code: |
      const express = require("express");

      // createApp() builds a fresh app with its own data. Tests call it for every test.
      function createApp() {
        const app = express();
        app.use(express.json());

        const todos = [
          { id: 1, title: "Write tests", done: true },
          { id: 2, title: "Fix bugs", done: false },
        ];
        let nextId = 3;

        app.get("/todos", (req, res) => {
          res.json(todos);
        });

        // 1. GET /todos/:id
        //    Find the todo whose id equals Number(req.params.id) (use todos.find).
        //    If there is none, answer status 404 with the JSON  { error: "Todo not found" }.
        //    Otherwise answer with the todo as JSON.
        app.get("/todos/:id", (req, res) => {
          res.sendStatus(501);
        });

        // 2. POST /todos
        //    The body looks like { title: "..." } (already parsed by express.json()).
        //    If title is missing or only spaces, answer status 400 with  { error: "title is required" }.
        //    Otherwise create { id: nextId, title: <title>, done: false }, add it to todos,
        //    increase nextId and answer status 201 with the new todo as JSON.
        app.post("/todos", (req, res) => {
          res.sendStatus(501);
        });

        return app;
      }

      module.exports = { createApp };
check:
  output: |
    todo API
      ✓ lists the todos
      ✓ returns one todo by id
      ✓ answers 404 for a todo that does not exist
      ✓ creates a todo and answers 201
      ✓ answers 400 when the title is missing

    Tests: 5 passed, 5 total
  code:
    - file: app.js
      pattern: 'status\(\s*404\s*\)'
      message: "Answer 404 with res.status(404).json(...) when the todo is missing."
    - file: app.js
      pattern: 'status\(\s*201\s*\)'
      message: "Answer 201 for a created todo."
    - file: app.js
      pattern: 'status\(\s*400\s*\)'
      message: "Answer 400 when the title is missing."
hints:
  - "The tests are already written: read the failing ones to see which status code and JSON body each route must send. res.status(404).json({ ... }) sets the status and sends JSON in one go."
  - "GET /todos/:id: const todo = todos.find((t) => t.id === Number(req.params.id)); if (!todo) return res.status(404).json({ error: \"Todo not found\" }); res.json(todo);   POST: read req.body.title and check it with typeof and trim()."
  - "const title = req.body && req.body.title; if (typeof title !== \"string\" || title.trim() === \"\") return res.status(400).json({ error: \"title is required\" }); const todo = { id: nextId++, title: title.trim(), done: false }; todos.push(todo); res.status(201).json(todo);"
solution:
  - name: todos.test.js
    code: |
      const { createApp } = require("./app");

      describe("todo API", () => {
        let server;
        let baseUrl;

        beforeEach(async () => {
          const app = createApp();
          await new Promise((resolve) => {
            server = app.listen(0, resolve);
          });
          baseUrl = `http://localhost:${server.address().port}`;
        });

        afterEach(async () => {
          await new Promise((resolve) => server.close(resolve));
        });

        async function request(path, options) {
          const response = await fetch(baseUrl + path, options);
          return { status: response.status, body: await response.json() };
        }

        it("lists the todos", async () => {
          const { status, body } = await request("/todos");
          expect(status).toBe(200);
          expect(body).toHaveLength(2);
        });

        it("returns one todo by id", async () => {
          const { status, body } = await request("/todos/1");
          expect(status).toBe(200);
          expect(body).toEqual({ id: 1, title: "Write tests", done: true });
        });

        it("answers 404 for a todo that does not exist", async () => {
          const { status, body } = await request("/todos/99");
          expect(status).toBe(404);
          expect(body).toEqual({ error: "Todo not found" });
        });

        it("creates a todo and answers 201", async () => {
          const { status, body } = await request("/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Learn Express" }),
          });
          expect(status).toBe(201);
          expect(body).toEqual({ id: 3, title: "Learn Express", done: false });

          const list = await request("/todos");
          expect(list.body).toHaveLength(3);
        });

        it("answers 400 when the title is missing", async () => {
          const { status, body } = await request("/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          expect(status).toBe(400);
          expect(body).toEqual({ error: "title is required" });
        });
      });
  - name: app.js
    code: |
      const express = require("express");

      function createApp() {
        const app = express();
        app.use(express.json());

        const todos = [
          { id: 1, title: "Write tests", done: true },
          { id: 2, title: "Fix bugs", done: false },
        ];
        let nextId = 3;

        app.get("/todos", (req, res) => {
          res.json(todos);
        });

        app.get("/todos/:id", (req, res) => {
          const todo = todos.find((t) => t.id === Number(req.params.id));
          if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
          }
          res.json(todo);
        });

        app.post("/todos", (req, res) => {
          const title = req.body && req.body.title;
          if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "title is required" });
          }
          const todo = { id: nextId++, title: title.trim(), done: false };
          todos.push(todo);
          res.status(201).json(todo);
        });

        return app;
      }

      module.exports = { createApp };
quiz:
  - q: "What is the difference between a unit test and an integration test?"
    options: ["A unit test checks one small piece in isolation, an integration test checks several parts working together (here: routes, JSON parsing and HTTP)", "Unit tests are slower", "There is no difference"]
    answer: 0
  - q: "Why does createApp() build a NEW app for each test instead of exporting one shared app?"
    options: ["To make Express faster", "So that data created by one test (like a new todo) cannot leak into the next test", "Because Express forbids sharing an app"]
    answer: 1
  - q: "What does app.listen(0) do?"
    options: ["Stops the server", "Starts the server on any free port, which you can read from server.address().port", "Starts the server on port 0 only if it is free, otherwise it fails"]
    answer: 1
    explain: "Port 0 means 'pick a free one'. Fixed ports like 3000 make tests fail when something else is already using that port."
  - q: "Why must the test close the server in afterEach?"
    options: ["It makes the tests print more", "It resets the todos", "Otherwise the server keeps running, the program never ends and ports pile up"]
    answer: 2
---
Unit tests check one function at a time. But a web API is more than functions: it is routes, JSON parsing, status codes and headers working together. To test that, you write **integration tests**: start the real app, send it real HTTP requests and check the answers, exactly like a client would. This is the highest-value test for a backend, and it is surprisingly easy.

## The idea

1. Build the app (`createApp()`).
2. Start it with `app.listen(...)`. This returns the server object.
3. Send requests with `fetch("http://localhost:PORT/path")`.
4. Check the **status code** and the **JSON body** with `expect`.
5. Close the server.

In this practice area the server and the `fetch` run inside the same program, so no real network is needed. On your own computer it works the same way with real sockets (and a library called `supertest` is often used to make it shorter). Open the "Setup" guide to run Node on your own machine.

## Make the app testable

Put the app **creation** in a function and do not start listening inside it:

```js
function createApp() {
  const app = express();
  app.use(express.json());
  // routes ...
  return app;
}
module.exports = { createApp };
```

A production file (say `server.js`) calls `createApp().listen(3000)`. The tests call `createApp()` for every test and start the server on a **free port** with `listen(0)`. Because the data lives *inside* `createApp`, each test gets a fresh, predictable app. This is the same idea as injecting a mock, applied to a whole server.

## Start and stop the server in hooks

```js
let server, baseUrl;

beforeEach(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);   // resolve is called when the server is ready
  });
  baseUrl = `http://localhost:${server.address().port}`;
});

afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
});
```

`listen` and `close` use **callbacks**, so we wrap them in a promise to be able to `await` them (you saw this wrapping pattern in the async lessons). `server.address().port` tells us which free port the system chose.

## A request helper

```js
async function request(path, options) {
  const response = await fetch(baseUrl + path, options);
  return { status: response.status, body: await response.json() };
}
```

Then each test becomes short and readable:

```js
it("answers 404 for a todo that does not exist", async () => {
  const { status, body } = await request("/todos/99");
  expect(status).toBe(404);
  expect(body).toEqual({ error: "Todo not found" });
});
```

For a POST you send JSON like this:

```js
await request("/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Learn Express" }),
});
```

## What to test in an API

* **Happy path:** right input gives status `200` or `201` and the correct JSON.
* **Not found:** an unknown id gives `404`.
* **Bad input:** a missing or invalid field gives `400` (or `422`), with a helpful message.
* **Side effects:** after a POST, a GET shows the new item.
* Also later: authentication (`401`/`403`), and headers.

Check the status code **and** the body. A route that answers `200` with an error message in the body is a bug, and a test that only reads the body would miss it.

> **Watch out:**
> * **A handler that never answers.** If a route forgets `res.json(...)` the request hangs and the test waits until the time limit. Always end every code path with a response.
> * **Forgetting `express.json()`.** Without that line `req.body` is `undefined`, and `req.body.title` throws a `TypeError`. The client gets a `500` instead of your `400`.
> * **`SyntaxError: Unexpected token ... is not valid JSON`.** Your test called `response.json()`, but the server answered with plain text or HTML (for example the text `Not Implemented` or a `Cannot GET /x` page). Check the route path and that it sends JSON.
> * **Shared state between tests.** If the data lives at the top of the file, the "creates a todo" test changes what the "lists the todos" test sees. Build fresh data per test.
> * **Not closing the server.** Open servers keep the program (or the next test run) busy. Always close in `afterEach` or `afterAll`.
> * **`return` after sending.** Writing `res.status(404).json(...)` without `return` lets the code continue and try to send a second response. Use `return res.status(404).json(...)`.

> **Your turn:** The tests in `todos.test.js` are finished. In `app.js` the two routes `GET /todos/:id` and `POST /todos` answer `501 Not Implemented`. Implement them as the comments say (404 with `{ error: "Todo not found" }`, 400 with `{ error: "title is required" }`, 201 with the new todo) until all 5 tests pass.
