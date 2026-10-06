---
title: "POST: creating resources with a JSON body"
summary: Send JSON with POST, read the 201 Created response and its Location header, and handle 422 validation errors.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // Logging in is done for you (lesson 6).
      const login = await fetch(BASE + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ada@example.com', password: 'engine123' }),
      });
      const { token } = await login.json();

      // 1. Create a todo: POST /todos with the JSON body { title: 'Learn fetch', userId: 1 }
      //    and the headers Authorization (Bearer token) and Content-Type.
      //    Print "status: " + res.status
      //    Print "location: " + the Location response header
      //    Print "created: " + JSON.stringify(of the reply body)

      // 2. Send an INVALID todo: the body { title: 123 } (a number, and no userId).
      //    The server answers 422 with { error, fields }.
      //    Print one line for each entry of body.fields, like "title: must be a string"
      //    (use Object.entries(body.fields) and a for...of loop).

      // 3. Send { title: 'No header', userId: 1 } again, but this time leave out the
      //    Content-Type header on purpose. Print "no content-type: " + the status.

      // 4. GET the new todo by fetching the Location address from step 1.
      //    Print "fetched: " + its title. Then GET /todos and print
      //    "total todos: " + the X-Total-Count header.
check:
  output: |
    status: 201
    location: https://api.academy.test/todos/11
    created: {"id":11,"title":"Learn fetch","userId":1}
    title: must be a string
    userId: is required
    no content-type: 415
    fetched: Learn fetch
    total todos: 11
  code:
    - { pattern: 'method\s*:\s*[''"]POST[''"]', message: "Use method: 'POST'." }
    - { pattern: 'JSON\.stringify\(', message: "Convert the body to JSON with JSON.stringify." }
    - { pattern: 'Authorization', message: "Send the Authorization header." }
    - { pattern: 'Object\.entries\(', message: "Loop over body.fields with Object.entries." }
    - { pattern: 'headers\.get\(', message: "Read the Location header with res.headers.get('Location')." }
hints:
  - "A POST needs three things: method: 'POST', a Content-Type: application/json header, and body: JSON.stringify(object). Protected endpoints also need the Authorization header with the Bearer token."
  - "const res = await fetch(BASE + '/todos', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Learn fetch', userId: 1 }) });   Location: res.headers.get('Location')"
  - "const bad = await fetch(BASE + '/todos', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 123 }) }); const body = await bad.json(); for (const [field, message] of Object.entries(body.fields)) { console.log(field + ': ' + message); }"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      const login = await fetch(BASE + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ada@example.com', password: 'engine123' }),
      });
      const { token } = await login.json();

      const res = await fetch(BASE + '/todos', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Learn fetch', userId: 1 }),
      });
      console.log('status: ' + res.status);
      const location = res.headers.get('Location');
      console.log('location: ' + location);
      console.log('created: ' + JSON.stringify(await res.json()));

      const bad = await fetch(BASE + '/todos', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 123 }),
      });
      const badBody = await bad.json();
      for (const [field, message] of Object.entries(badBody.fields)) {
        console.log(field + ': ' + message);
      }

      const noType = await fetch(BASE + '/todos', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: JSON.stringify({ title: 'No header', userId: 1 }),
      });
      console.log('no content-type: ' + noType.status);

      const fetched = await (await fetch(location)).json();
      console.log('fetched: ' + fetched.title);
      const all = await fetch(BASE + '/todos');
      console.log('total todos: ' + all.headers.get('X-Total-Count'));
quiz:
  - q: "A POST that creates something succeeds. Which status is the most fitting?"
    options: ["200 OK", "204 No Content", "201 Created"]
    answer: 2
  - q: "What is the Location header of a 201 response for?"
    options: ["The URL of the newly created item", "The server's physical location", "Where to send the next POST"]
    answer: 0
  - q: "The server replies 422 with { fields: { title: 'must be a string' } }. What does that mean?"
    options: ["The server is down", "The JSON was understood, but one or more values are not valid", "You are not logged in"]
    answer: 1
    explain: "400 means the request could not even be understood (for example broken JSON); 422 means it was understood but failed validation."
  - q: "Why must the body be JSON.stringify(data) and not the plain object?"
    options: ["A request body has to be text (or bytes), and objects turn into '[object Object]'", "Because stringify makes it smaller", "Because fetch cannot send numbers"]
    answer: 0
---

`GET` only reads. To add something new to the server, such as a todo, a user or a post, you use `POST`. It is a little more work than a `GET`: you send a **body**, you must label it, and you should be ready for the server to refuse it.

## What a POST looks like

```
POST /todos HTTP/1.1
Host: api.academy.test
Authorization: Bearer token-ada
Content-Type: application/json

{"title":"Learn fetch","userId":1}
```

```
HTTP/1.1 201 Created
Location: https://api.academy.test/todos/11
Content-Type: application/json

{"id":11,"title":"Learn fetch","userId":1}
```

Read the request top to bottom: the method and path say "create in the todos collection", `Authorization` proves you may write, `Content-Type` labels the body as JSON, and the body holds the new item's data. You never send the `id`: the **server** picks it.

The response uses `201 Created` (not plain `200`), returns the item **including its new id**, and tells you where it lives in the `Location` header.

## The three ingredients in code

```js
const res = await fetch(BASE + '/todos', {
  method: 'POST',                                          // 1. the method
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',                    // 2. label the body
  },
  body: JSON.stringify({ title: 'Learn fetch', userId: 1 }), // 3. the body, as text
});
const todo = await res.json();
console.log(todo.id); // prints: 11
```

`fetch` defaults to `GET`, so forgetting `method: 'POST'` sends a `GET` and quietly ignores the body (in browsers it even throws `TypeError: Request with GET/HEAD method cannot have body`).

## Validation errors: 422

Servers check what you send. If something is missing or the wrong type, they reply `422 Unprocessable Entity` with an explanation of every problem:

```
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{"error":"Validation failed","fields":{"title":"must be a string","userId":"is required"}}
```

The `fields` object maps each bad field to a message, so a form can show the message next to the right input. Loop over it with `Object.entries`:

```js
for (const [field, message] of Object.entries(body.fields)) {
  console.log(field + ': ' + message);
}
```

Compare with the other client errors you can provoke:

| Mistake | Status |
| --- | --- |
| No `Authorization` header | `401` |
| Missing / wrong `Content-Type` | `415 Unsupported Media Type` |
| Body is not valid JSON (`{title:`) | `400 Bad Request` |
| Valid JSON but missing or invalid fields | `422` |

## Check, then trust the Location

A good client does not assume success. After a `POST`:

1. Check `res.ok` (or for exactly `201`).
2. Read the created item from the body (it now has an `id`).
3. Use the `Location` header or the new `id` to fetch it again if you need to prove it is stored: `await fetch(res.headers.get('Location'))`.

> **Watch out:**
> - **Forgetting `Content-Type: application/json`.** The server cannot read your body and answers `415` with `Send JSON with the header Content-Type: application/json`.
> - **Passing an object as `body`.** `body: { title: 'x' }` sends the text `[object Object]`, which the server rejects as invalid JSON (`400`). Always wrap it in `JSON.stringify`.
> - **Re-sending a POST by accident.** `POST` is not idempotent: sending it twice creates two items (lesson 9 explains why it matters).
> - **Treating `422` like a crash.** It is an expected answer. Read `body.fields` and show the user what to fix.
> - **Sending the `id` yourself.** The server chooses it; any `id` you send is ignored here.

## Going further

Create a user with `POST /users` and the body `{ name: 'Test', email: 'not-an-email' }`. Which `fields` come back? Then fix the email and read the `Location` header.

> **Your turn:** the login is written for you. Create a todo and print the status, the `Location` and the body. Then send an invalid todo and print each field error, send a valid one without `Content-Type` to see the `415`, and finally fetch the new todo through its `Location` address and print the total number of todos.
