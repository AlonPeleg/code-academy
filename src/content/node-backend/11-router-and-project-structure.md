---
title: "Router and project structure"
summary: Split a growing API into files with express.Router, a services layer and an app module you can start or test separately.
level: intermediate
runner: js
files:
  - name: server.js
    code: |
      // The entry point: it only STARTS the app. (The app itself lives in app.js.)
      const app = require('./app');

      const server = app.listen(3000);
      async function call(method, path, body) {
        const options = { method };
        if (body !== undefined) {
          options.headers = { 'Content-Type': 'application/json' };
          options.body = JSON.stringify(body);
        }
        const res = await fetch('http://localhost:3000' + path, options);
        console.log(method + ' ' + path + ' -> ' + res.status + ' ' + (await res.text()));
      }
      await call('GET', '/health');
      await call('GET', '/api/todos');
      await call('GET', '/api/todos/2');
      await call('GET', '/api/todos/99');
      await call('POST', '/api/todos', { title: 'Ship it' });
      await call('POST', '/api/todos', {});
      await call('GET', '/todos');
      server.close();
  - name: app.js
    code: |
      const express = require('express');
      const healthRouter = require('./routes/health');
      const todosRouter = require('./routes/todos');

      const app = express();
      app.use(express.json());

      app.use('/health', healthRouter);
      // 2. Mount todosRouter under the prefix /api/todos

      app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
      });

      module.exports = app;
  - name: routes/todos.js
    code: |
      const todoService = require('../services/todoService');

      // 1. Require express, create a router with its Router function, and add:
      //    GET  /     -> res.json(todoService.list())
      //    GET  /:id  -> the todo, or 404 { error: 'Todo not found' }
      //    POST /     -> 400 { error: 'title is required' } when req.body.title is missing or blank,
      //                  otherwise 201 with todoService.create(title)
      //    The paths here do NOT include /api/todos: the prefix is added where the router is mounted.
      //    Finally export the router with module.exports.
  - name: routes/health.js
    code: |
      const express = require('express');
      const router = express.Router();

      router.get('/', (req, res) => {
        res.json({ status: 'ok' });
      });

      module.exports = router;
  - name: services/todoService.js
    code: |
      // The "business" layer: plain functions, no req or res in here.
      const todos = [
        { id: 1, title: 'Learn Router', done: false },
        { id: 2, title: 'Split the app into files', done: true },
      ];
      let nextId = 3;

      function list() {
        return todos;
      }

      function get(id) {
        return todos.find((t) => t.id === Number(id));
      }

      function create(title) {
        const todo = { id: nextId++, title: title.trim(), done: false };
        todos.push(todo);
        return todo;
      }

      module.exports = { list, get, create };
check:
  output: |
    GET /health -> 200 {"status":"ok"}
    GET /api/todos -> 200 [{"id":1,"title":"Learn Router","done":false},{"id":2,"title":"Split the app into files","done":true}]
    GET /api/todos/2 -> 200 {"id":2,"title":"Split the app into files","done":true}
    GET /api/todos/99 -> 404 {"error":"Todo not found"}
    POST /api/todos -> 201 {"id":3,"title":"Ship it","done":false}
    POST /api/todos -> 400 {"error":"title is required"}
    GET /todos -> 404 {"error":"Not found"}
  code:
    - { file: 'routes/todos.js', pattern: 'express\.Router\(', message: "Create the router in routes/todos.js with express.Router()." }
    - { file: 'routes/todos.js', pattern: 'module\.exports\s*=\s*router|module\.exports\s*=\s*\w+', message: "Export the router with module.exports." }
    - { file: 'app.js', pattern: 'app\.use\(\s*[''"]/api/todos[''"]', message: "In app.js mount the router with app.use('/api/todos', todosRouter)." }
hints:
  - "A Router is a mini app: it has get/post/use and is exported with module.exports. The main app mounts it with app.use('/prefix', router). Inside the router, paths are relative to the prefix, so the list route is simply '/'."
  - "routes/todos.js: const express = require('express'); const router = express.Router(); router.get('/', (req, res) => res.json(todoService.list())); ... module.exports = router;   app.js: app.use('/api/todos', todosRouter);"
  - "router.get('/:id', (req, res) => { const todo = todoService.get(req.params.id); if (!todo) return res.status(404).json({ error: 'Todo not found' }); res.json(todo); });   router.post('/', (req, res) => { const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''; if (!title) return res.status(400).json({ error: 'title is required' }); res.status(201).json(todoService.create(title)); });"
solution:
  - name: server.js
    code: |
      // The entry point: it only STARTS the app. (The app itself lives in app.js.)
      const app = require('./app');

      const server = app.listen(3000);
      async function call(method, path, body) {
        const options = { method };
        if (body !== undefined) {
          options.headers = { 'Content-Type': 'application/json' };
          options.body = JSON.stringify(body);
        }
        const res = await fetch('http://localhost:3000' + path, options);
        console.log(method + ' ' + path + ' -> ' + res.status + ' ' + (await res.text()));
      }
      await call('GET', '/health');
      await call('GET', '/api/todos');
      await call('GET', '/api/todos/2');
      await call('GET', '/api/todos/99');
      await call('POST', '/api/todos', { title: 'Ship it' });
      await call('POST', '/api/todos', {});
      await call('GET', '/todos');
      server.close();
  - name: app.js
    code: |
      const express = require('express');
      const healthRouter = require('./routes/health');
      const todosRouter = require('./routes/todos');

      const app = express();
      app.use(express.json());

      app.use('/health', healthRouter);
      app.use('/api/todos', todosRouter);

      app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
      });

      module.exports = app;
  - name: routes/todos.js
    code: |
      const express = require('express');
      const todoService = require('../services/todoService');

      const router = express.Router();

      router.get('/', (req, res) => {
        res.json(todoService.list());
      });

      router.get('/:id', (req, res) => {
        const todo = todoService.get(req.params.id);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        res.json(todo);
      });

      router.post('/', (req, res) => {
        const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
        if (!title) return res.status(400).json({ error: 'title is required' });
        res.status(201).json(todoService.create(title));
      });

      module.exports = router;
  - name: routes/health.js
    code: |
      const express = require('express');
      const router = express.Router();

      router.get('/', (req, res) => {
        res.json({ status: 'ok' });
      });

      module.exports = router;
  - name: services/todoService.js
    code: |
      // The "business" layer: plain functions, no req or res in here.
      const todos = [
        { id: 1, title: 'Learn Router', done: false },
        { id: 2, title: 'Split the app into files', done: true },
      ];
      let nextId = 3;

      function list() {
        return todos;
      }

      function get(id) {
        return todos.find((t) => t.id === Number(id));
      }

      function create(title) {
        const todo = { id: nextId++, title: title.trim(), done: false };
        todos.push(todo);
        return todo;
      }

      module.exports = { list, get, create };
quiz:
  - q: "A router has router.get('/:id', ...) and is mounted with app.use('/api/todos', router). Which URL reaches that route?"
    options: ["GET /api/todos/:id/5", "GET /:id", "GET /api/todos/5"]
    answer: 2
    explain: "The mount prefix and the route path are joined: /api/todos plus /5."
  - q: "Why does app.js export the app instead of calling app.listen itself?"
    options: ["Because listen only works in a separate file", "So the app can be started by server.js, or imported by tests, without opening a port right away", "To make the code run faster"]
    answer: 1
  - q: "What belongs in a service file like todoService.js?"
    options: ["Plain functions with the data and business rules, which know nothing about HTTP", "Reading req.body and sending res.json", "The app.listen call"]
    answer: 0
    explain: "Keeping HTTP details (status codes, req, res) in the routes and rules in services makes both easy to change and to test."
  - q: "What do you see if you forget module.exports = router in routes/todos.js and mount it?"
    options: ["It works anyway", "An error like: app.use() requires a middleware function", "The routes answer 200 with an empty body"]
    answer: 1
---

A single `main.js` with forty routes becomes painful quickly. Real projects split the code into small files, each with one job. In this lesson you learn Express's tool for that, the **Router**, and a simple folder layout that scales from a toy to a real application.

## The Router: a mini app

`express.Router()` creates an object that behaves like `app` (it has `get`, `post`, `use`...) but is not a server by itself. You fill it with routes and then plug it into the real app under a **prefix**:

```js
// routes/todos.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json([]));        // answers GET /api/todos
router.get('/:id', (req, res) => res.json({}));     // answers GET /api/todos/5

module.exports = router;
```

```js
// app.js
const todosRouter = require('./routes/todos');
app.use('/api/todos', todosRouter);
```

Inside the router the paths are **relative**: you write `'/'` and `'/:id'`, and the prefix `/api/todos` comes from `app.use`. Change the prefix in one place and every route moves with it. Express removes the prefix before the router sees the URL, so the router never needs to know where it is mounted.

Routers can also have their own middleware (`router.use(requireLogin)` protects only that router) and can be nested. If a nested router needs a parameter of its parent, such as `/users/:userId/todos`, create it with `express.Router({ mergeParams: true })`.

## A folder layout that works

```
project/
  server.js            starts the server (listen)
  app.js               builds the app: middleware, routers, error handlers
  routes/              one router per resource: todos.js, users.js...
  services/            business logic and data access: todoService.js
  middleware/          your own middleware: auth.js, logger.js
```

The idea is **separation of concerns**:

- A **route** speaks HTTP: it reads `req`, picks the status code, calls `res.json`.
- A **service** speaks your domain: "create a todo", "find a user". It is made of plain functions that do not know `req` or `res`.
- **app.js** wires everything together; **server.js** only opens the port.

Many teams add a **controllers** folder between routes and services (the route file only lists URLs, the controller functions handle them). With a small API the route file can do both; you can introduce controllers when it gets crowded.

## Why app.js and server.js are separate

`app.js` ends with `module.exports = app` and never calls `listen`. That means a test can `require('./app')` and start it on any port it likes, while `server.js` starts it for real. You will appreciate this the first time you write tests for an API.

## require paths

`require('./routes/todos')` starts with `./` (relative to the current file). From inside `routes/todos.js`, the service is one folder up: `require('../services/todoService')`. Built-in and npm modules (`express`, `fs`) have no leading dot.

> **Watch out:**
> - **Repeating the prefix inside the router.** If you write `router.get('/api/todos/:id')` and also mount at `/api/todos`, the real URL becomes `/api/todos/api/todos/5`. Keep router paths relative.
> - **Forgetting `module.exports = router`.** The file exports an empty object and `app.use` fails with `TypeError: app.use() requires a middleware function`.
> - **Wrong relative path.** `require('./services/todoService')` from inside `routes/` gives `Cannot find module`. Count the folders: you need `../`.
> - **Mounting after the 404 handler.** Order still rules: mount routers before the catch-all and error handlers.

## Going further

Add a `routes/users.js` router with its own `userService.js` and mount it at `/api/users`. Then move the 404 handler into `middleware/notFound.js` and `require` it in `app.js`.

> **Your turn:** write `routes/todos.js` (a router with `GET /`, `GET /:id` and `POST /`, using the service) and mount it in `app.js` at `/api/todos`. Everything else is already written; `server.js` calls your API and prints the answers.
