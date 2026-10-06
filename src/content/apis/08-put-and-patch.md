---
title: "PUT and PATCH: updating"
summary: Replace a whole resource with PUT, change only some fields with PATCH, and see why the difference matters.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      const login = await fetch(BASE + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ada@example.com', password: 'engine123' }),
      });
      const { token } = await login.json();

      // A small helper, already written: send(method, path, body) -> the response
      function send(method, path, body) {
        return fetch(BASE + path, {
          method,
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      // 1. REPLACE user 3 with PUT /users/3 and the body
      //      { name: 'Alan M. Turing', email: 'alan@example.com' }
      //    Print "PUT: " + JSON.stringify(reply). Then print
      //    "fields after PUT: " + the keys of the reply joined with "," (Object.keys)
      //    Notice that role and city are gone: PUT replaced everything.

      // 2. CHANGE ONE FIELD of user 5 with PATCH /users/5 and the body { city: 'Helsinki' }
      //    Print "PATCH: " + reply.city + " / " + reply.name + " / " + reply.role

      // 3. Send an incomplete PUT to /users/2 with the body { name: 'Only a name' }.
      //    Print "incomplete PUT: " + status + " email " + the message of fields.email

      // 4. PATCH /todos/2 with { done: true }. Print "todo 2 done: " + reply.done
      //    and "title still: " + reply.title
check:
  output: |
    PUT: {"id":3,"name":"Alan M. Turing","email":"alan@example.com"}
    fields after PUT: id,name,email
    PATCH: Helsinki / Linus Torvalds / viewer
    incomplete PUT: 422 email is required
    todo 2 done: true
    title still: Design the analytical engine
  code:
    - { pattern: 'send\(\s*[''"]PUT[''"]', message: "Use send('PUT', ...) to replace." }
    - { pattern: 'send\(\s*[''"]PATCH[''"]', message: "Use send('PATCH', ...) for partial updates." }
    - { pattern: 'Object\.keys\(', message: "List the keys of the reply with Object.keys." }
hints:
  - "PUT sends a complete replacement: whatever you leave out is gone. PATCH sends only the fields you want to change; everything else stays. The helper send(method, path, body) already does the fetch for you."
  - "const res = await send('PUT', '/users/3', { name: 'Alan M. Turing', email: 'alan@example.com' }); const user = await res.json(); console.log('PUT: ' + JSON.stringify(user));   For the partial update use send('PATCH', '/users/5', { city: 'Helsinki' })."
  - "const bad = await send('PUT', '/users/2', { name: 'Only a name' }); const badBody = await bad.json(); console.log('incomplete PUT: ' + bad.status + ' email ' + badBody.fields.email);   const t = await (await send('PATCH', '/todos/2', { done: true })).json();"
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

      function send(method, path, body) {
        return fetch(BASE + path, {
          method,
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      const putRes = await send('PUT', '/users/3', { name: 'Alan M. Turing', email: 'alan@example.com' });
      const replaced = await putRes.json();
      console.log('PUT: ' + JSON.stringify(replaced));
      console.log('fields after PUT: ' + Object.keys(replaced).join(','));

      const patchRes = await send('PATCH', '/users/5', { city: 'Helsinki' });
      const patched = await patchRes.json();
      console.log('PATCH: ' + patched.city + ' / ' + patched.name + ' / ' + patched.role);

      const bad = await send('PUT', '/users/2', { name: 'Only a name' });
      const badBody = await bad.json();
      console.log('incomplete PUT: ' + bad.status + ' email ' + badBody.fields.email);

      const todo = await (await send('PATCH', '/todos/2', { done: true })).json();
      console.log('todo 2 done: ' + todo.done);
      console.log('title still: ' + todo.title);
quiz:
  - q: "You PUT a user with only name and email. What happens to the role and city that were stored before?"
    options: ["They stay unchanged", "They are removed, because PUT replaces the whole resource", "The server asks you for them"]
    answer: 1
  - q: "You want to tick a todo as done and change nothing else. Which method fits best?"
    options: ["PATCH with { done: true }", "POST with the whole todo", "PUT with { done: true }"]
    answer: 0
  - q: "PUT /users/2 with { name: 'X' } and no email returns 422. Why?"
    options: ["PUT is not allowed on users", "A full replacement must contain all required fields, and email is required", "The id was wrong"]
    answer: 1
  - q: "Which statement about PUT is true?"
    options: ["Repeating the same PUT gives the same final state", "Each PUT creates a new item", "PUT never needs a body"]
    answer: 0
    explain: "Replacing something with the same data twice leaves it in the same state, which is why PUT is called idempotent."
---

Once something exists, you will want to change it: fix a typo, tick a todo, rename a user. HTTP gives you two verbs for that, `PUT` and `PATCH`, and mixing them up is a classic way to lose data.

## PUT: replace the whole thing

`PUT /users/3` means "**this** is what user 3 should look like now". You send a complete description, and the server swaps the old item for it:

```
PUT /users/3 HTTP/1.1
Authorization: Bearer token-ada
Content-Type: application/json

{"name":"Alan M. Turing","email":"alan@example.com"}
```

Before the call, user 3 was `{ id: 3, name: "Alan Turing", email: "alan@example.com", role: "viewer", city: "London" }`. After it:

```
HTTP/1.1 200 OK

{"id":3,"name":"Alan M. Turing","email":"alan@example.com"}
```

`role` and `city` are **gone**, because you did not send them. That is not a bug; it is exactly what "replace" means. The `id` stays, because it comes from the URL.

## PATCH: change only what you send

`PATCH /users/5` means "**apply these changes** to user 5":

```
PATCH /users/5 HTTP/1.1
Authorization: Bearer token-ada
Content-Type: application/json

{"city":"Helsinki"}
```

The server merges your fields into the existing item, so everything else survives:

```
{"id":5,"name":"Linus Torvalds","email":"linus@example.com","role":"viewer","city":"Helsinki"}
```

| | PUT | PATCH |
| --- | --- | --- |
| Meaning | replace the whole item | change some fields |
| Body | all required fields | just the fields to change |
| Omitted fields | removed | kept |
| Typical use | save a full edit form | tick a checkbox, rename |
| Missing required field | `422` | fine |

## In code

With the same options as `POST`, only the method changes:

```js
const res = await fetch(BASE + '/users/5', {
  method: 'PATCH',
  headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({ city: 'Helsinki' }),
});
const user = await res.json();
console.log(user.city); // prints: Helsinki
```

Since all your write requests will look alike, the starter defines a tiny helper `send(method, path, body)` that builds the options. Writing a helper like that is the first step to the reusable client you will make in lesson 10.

## Validation still applies

Both methods validate the values they receive:

- A `PUT` must provide every required field. `PUT /users/2` with just a name returns `422` and `{ "fields": { "email": "is required" } }`.
- A `PATCH` may leave fields out, but any field you **do** send must be valid. `PATCH /users/2` with `{ "role": "boss" }` returns `422` and `must be admin, editor or viewer`.
- Updating something that does not exist gives `404` (for example `PUT /users/99`).

## Which one should I use?

If the user edited a whole form, `PUT` the whole item. If they toggled one switch, `PATCH` that one field: it sends less data and cannot accidentally wipe fields you did not know existed. Sending a full object with `PATCH` also works; it just merges every field.

Note that a successful update here returns `200` with the **new** state of the item, so you often do not need a second `GET`.

> **Watch out:**
> - **Using `PUT` for a one-field change.** Anything you leave out disappears: the classic "my user lost their city" bug. Use `PATCH` instead.
> - **Forgetting `Content-Type: application/json`.** Then the server answers `415 Send JSON with the header Content-Type: application/json`.
> - **Forgetting the id in the URL.** `PUT /users` (no id) is rejected with `405 Method PUT is not allowed here`, because you cannot replace a whole collection.
> - **Assuming `PATCH` of a list field merges it.** A field such as `tags` is replaced as a value; "append" semantics need a dedicated design.
> - **Not checking `res.ok`.** A `422` or `404` reply looks like normal JSON, but it describes the error, not the updated item.

## Going further

Try `PATCH /todos/2` with `{ "done": "yes" }` and read the `422` message. Then `PUT /todos/2` with `{ "title": "Rewritten", "userId": 1 }` and check that `done` is missing from the answer.

> **Your turn:** use the `send` helper to replace user 3 with `PUT` and list the remaining keys, change only the city of user 5 with `PATCH`, trigger the `422` of an incomplete `PUT`, and tick todo 2 as done with a `PATCH` while keeping its title.
