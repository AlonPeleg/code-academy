---
title: "A REST API: create, read, update, delete"
summary: Build a complete in-memory notes API with the right methods, status codes (200, 201, 204, 400, 404) and input validation.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const express = require('express');
      const app = express();
      app.use(express.json());

      let notes = [
        { id: 1, title: 'Buy milk', done: false },
        { id: 2, title: 'Learn Express', done: false },
      ];
      let nextId = 3;

      // already written: list and read one
      app.get('/notes', (req, res) => res.json(notes));
      app.get('/notes/:id', (req, res) => {
        const note = notes.find((n) => n.id === Number(req.params.id));
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
      });

      // 1. POST /notes: the body must have a non-empty string "title" (after trim),
      //    otherwise answer 400 { error: 'title is required' }.
      //    Create { id: nextId++, title (trimmed), done: false }, add it to notes,
      //    set the header Location to '/notes/<id>' and answer 201 with the new note.

      // 2. PATCH /notes/:id: find the note (404 { error: 'Note not found' } when missing).
      //    If the body has a "done" value, copy it onto the note; if it has a "title", copy it too.
      //    Answer 200 with the updated note.

      // 3. DELETE /notes/:id: 404 when missing, otherwise remove it from the array
      //    and answer 204 with no body.

      // ---- test client (already written) ----
      const server = app.listen(3000);
      async function call(method, path, body) {
        const options = { method };
        if (body !== undefined) {
          options.headers = { 'Content-Type': 'application/json' };
          options.body = JSON.stringify(body);
        }
        const res = await fetch('http://localhost:3000' + path, options);
        const text = await res.text();
        const location = res.headers.get('location');
        console.log(method + ' ' + path + ' -> ' + res.status + (location ? ' ' + location : '') + (text ? ' ' + text : ''));
      }
      await call('POST', '/notes', { title: '   ' });
      await call('POST', '/notes', { title: '  Write tests ' });
      await call('PATCH', '/notes/3', { done: true });
      await call('PATCH', '/notes/99', { done: true });
      await call('DELETE', '/notes/1');
      await call('DELETE', '/notes/1');
      await call('GET', '/notes');
      server.close();
check:
  output: |
    POST /notes -> 400 {"error":"title is required"}
    POST /notes -> 201 /notes/3 {"id":3,"title":"Write tests","done":false}
    PATCH /notes/3 -> 200 {"id":3,"title":"Write tests","done":true}
    PATCH /notes/99 -> 404 {"error":"Note not found"}
    DELETE /notes/1 -> 204
    DELETE /notes/1 -> 404 {"error":"Note not found"}
    GET /notes -> 200 [{"id":2,"title":"Learn Express","done":false},{"id":3,"title":"Write tests","done":true}]
  code:
    - { pattern: 'app\.post\(', message: "Add a POST /notes route with app.post." }
    - { pattern: 'app\.patch\(', message: "Add a PATCH /notes/:id route with app.patch." }
    - { pattern: 'app\.delete\(', message: "Add a DELETE /notes/:id route with app.delete." }
    - { pattern: 'status\(\s*201\s*\)', message: "A successful POST answers 201 Created." }
    - { pattern: 'status\(\s*204\s*\)|sendStatus\(\s*204\s*\)', message: "A successful DELETE answers 204 No Content." }
hints:
  - "Each route follows the same recipe: read the input (req.body, req.params.id), check it (400 if invalid, 404 if the note does not exist), change the notes array, and answer with the right status. Remember req.params.id is a string, so convert it with Number()."
  - "POST: const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''; if (!title) return res.status(400).json({ error: 'title is required' });   DELETE: const index = notes.findIndex((n) => n.id === Number(req.params.id)); if (index === -1) return res.status(404)...; notes.splice(index, 1); res.status(204).end();"
  - "app.post('/notes', (req, res) => { const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''; if (!title) return res.status(400).json({ error: 'title is required' }); const note = { id: nextId++, title, done: false }; notes.push(note); res.status(201).set('Location', '/notes/' + note.id).json(note); });"
solution:
  - name: main.js
    code: |
      const express = require('express');
      const app = express();
      app.use(express.json());

      let notes = [
        { id: 1, title: 'Buy milk', done: false },
        { id: 2, title: 'Learn Express', done: false },
      ];
      let nextId = 3;

      // already written: list and read one
      app.get('/notes', (req, res) => res.json(notes));
      app.get('/notes/:id', (req, res) => {
        const note = notes.find((n) => n.id === Number(req.params.id));
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
      });

      app.post('/notes', (req, res) => {
        const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
        if (!title) return res.status(400).json({ error: 'title is required' });
        const note = { id: nextId++, title, done: false };
        notes.push(note);
        res.status(201).set('Location', '/notes/' + note.id).json(note);
      });

      app.patch('/notes/:id', (req, res) => {
        const note = notes.find((n) => n.id === Number(req.params.id));
        if (!note) return res.status(404).json({ error: 'Note not found' });
        if (req.body.done !== undefined) note.done = req.body.done;
        if (req.body.title !== undefined) note.title = req.body.title;
        res.json(note);
      });

      app.delete('/notes/:id', (req, res) => {
        const index = notes.findIndex((n) => n.id === Number(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Note not found' });
        notes.splice(index, 1);
        res.status(204).end();
      });

      // ---- test client (already written) ----
      const server = app.listen(3000);
      async function call(method, path, body) {
        const options = { method };
        if (body !== undefined) {
          options.headers = { 'Content-Type': 'application/json' };
          options.body = JSON.stringify(body);
        }
        const res = await fetch('http://localhost:3000' + path, options);
        const text = await res.text();
        const location = res.headers.get('location');
        console.log(method + ' ' + path + ' -> ' + res.status + (location ? ' ' + location : '') + (text ? ' ' + text : ''));
      }
      await call('POST', '/notes', { title: '   ' });
      await call('POST', '/notes', { title: '  Write tests ' });
      await call('PATCH', '/notes/3', { done: true });
      await call('PATCH', '/notes/99', { done: true });
      await call('DELETE', '/notes/1');
      await call('DELETE', '/notes/1');
      await call('GET', '/notes');
      server.close();
quiz:
  - q: "Which status code should a successful POST that creates something return?"
    options: ["200 OK", "201 Created", "204 No Content"]
    answer: 1
    explain: "201 says a new resource now exists; the Location header tells the client where."
  - q: "Why is note.id === req.params.id almost always false?"
    options: ["req.params values are always strings, so you must convert with Number()", "Express hides the id", "Ids must be compared with =="]
    answer: 0
  - q: "A client sends a body with no title. Which answer is the best?"
    options: ["500 Internal Server Error", "404 Not Found", "400 Bad Request with a clear error message"]
    answer: 2
    explain: "400 means the client made a mistake and can fix it. 500 means the server broke, which would be a lie."
  - q: "What is the difference between PUT and PATCH?"
    options: ["PUT deletes, PATCH creates", "PUT replaces the whole resource, PATCH changes only the fields you send", "There is none"]
    answer: 1
---

In this lesson you build what most backend jobs consist of: an API that can **C**reate, **R**ead, **U**pdate and **D**elete things. These four verbs are called CRUD. If you finished the APIs track you already know the client side (you called someone else's API); now you are the one writing the server.

## Resources, methods and status codes

REST is a convention for naming things. A **resource** is a noun (`notes`), a **URL** points to it, and the HTTP **method** says what to do:

| Method and URL | Meaning | Success status |
| --- | --- | --- |
| `GET /notes` | list all notes | `200 OK` |
| `GET /notes/3` | read one note | `200 OK` |
| `POST /notes` | create a note | `201 Created` |
| `PATCH /notes/3` | change some fields | `200 OK` |
| `PUT /notes/3` | replace the whole note | `200 OK` |
| `DELETE /notes/3` | remove the note | `204 No Content` |

The URL names the thing, the method is the verb. So `POST /createNote` and `GET /deleteNote?id=3` are not RESTful. Mistakes use the `4xx` family: `400` bad input, `404` no such thing. A bug in your own code is `500`.

## Reading input in Express

Three places carry data into a handler:

```js
app.patch('/notes/:id', (req, res) => {
  req.params.id;   // "3"  (from the URL, always a string)
  req.query.sort;  // from ?sort=title
  req.body;        // the parsed JSON (needs app.use(express.json()))
});
```

Convert the id yourself: `Number(req.params.id)`. Then look the note up in your data. The data here is a plain array that lives in memory, so it resets whenever the program restarts; lesson 13 fixes that by saving to a file.

## Never trust the client

Everything in `req.body` comes from the outside world and can be missing, empty or the wrong type. Validate it before you use it, and answer `400` with a message the client can act on:

```js
const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
if (!title) return res.status(400).json({ error: 'title is required' });
```

`typeof` is needed because `req.body.title.trim()` would crash for a number. Trimming removes the spaces so `"   "` counts as empty.

## Creating, updating, deleting

Create: build the object on the server (the server picks the `id`, never the client), store it, and answer `201` with the new object. A `Location` header with its URL is polite:

```js
res.status(201).set('Location', '/notes/' + note.id).json(note);
```

Update: find the object (`404` if it does not exist), copy over the fields that were sent, answer with the updated object.

Delete: remove it and answer `204`. `204` means "done, and there is nothing to send back", so use `res.status(204).end()` with no body. Deleting something that is already gone is a `404` in this API (some APIs answer `204` again, which is also valid; just be consistent).

> **Watch out:**
> - **Comparing a number with a string.** `notes.find(n => n.id === req.params.id)` finds nothing because `3 !== "3"`. You will wrongly return `404` for everything.
> - **Forgetting `express.json()`.** Then `req.body` is `undefined` and you see `TypeError: Cannot read properties of undefined (reading 'title')`.
> - **Sending a body with `204`.** Clients ignore it. Use `.end()`.
> - **Forgetting `return` after an error response.** Without `return res.status(404)...` the handler continues and crashes with `Cannot set headers after they are sent to the client`.

## Going further

Add `PUT /notes/:id` that replaces the note and requires both `title` and `done`. Add a `?done=true` filter to `GET /notes` using `req.query`. Notice how few lines each route needs once the pattern is clear.

> **Your turn:** implement `POST /notes` (validate the title, `201` with a `Location` header), `PATCH /notes/:id` and `DELETE /notes/:id` (`404` when missing, `204` on success). The test client prints one line per request.
