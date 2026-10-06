---
title: "DELETE, idempotency and safe methods"
summary: Delete resources, handle the empty 204 response, and learn which HTTP methods are safe to repeat.
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
      const auth = { Authorization: 'Bearer ' + token };

      // 1. DELETE /todos/1 WITHOUT the auth header. Print "no token: " + status (401).

      // 2. DELETE /todos/1 WITH the auth header ({ headers: auth }).
      //    Print "delete: " + status (204) and "body length: " + the length of await res.text()
      //    (a 204 has no body, so do NOT call res.json()).

      // 3. DELETE /todos/1 AGAIN. Print "delete again: " + status (404: it is already gone).

      // 4. GET /todos and print "todos left: " + the X-Total-Count header (9).

      // 5. POST the same todo twice: { title: 'Same', userId: 1 } (JSON headers + auth).
      //    Print "POST ids: " + the two new ids joined with ","
      //    Then print "todos now: " + the X-Total-Count of GET /todos again.

      // 6. PUT the same replacement twice to /todos/2:
      //    { title: 'Rewrite', userId: 1, done: false }
      //    Print "PUT twice equal: " + whether JSON.stringify of the two replies is identical.
check:
  output: |
    no token: 401
    delete: 204
    body length: 0
    delete again: 404
    todos left: 9
    POST ids: 11,12
    todos now: 11
    PUT twice equal: true
  code:
    - { pattern: 'method\s*:\s*[''"]DELETE[''"]', message: "Send the request with method: 'DELETE'." }
    - { pattern: 'method\s*:\s*[''"]PUT[''"]', message: "Use method: 'PUT' for the last step." }
    - { pattern: '\.text\(\)', message: "A 204 has no body: read it with res.text(), not res.json()." }
    - { pattern: 'Authorization', message: "Send the Authorization header." }
hints:
  - "DELETE needs no body, only the method and the Authorization header. A successful delete answers 204 No Content: there is nothing to parse, so use res.text() (or just ignore the body) instead of res.json()."
  - "const res = await fetch(BASE + '/todos/1', { method: 'DELETE', headers: auth }); console.log('delete: ' + res.status); console.log('body length: ' + (await res.text()).length);   Repeat the same request for step 3."
  - "async function create() { const r = await fetch(BASE + '/todos', { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Same', userId: 1 }) }); return (await r.json()).id; }   const a = await create(); const b = await create();   PUT: same options with method: 'PUT' and path '/todos/2'."
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
      const auth = { Authorization: 'Bearer ' + token };

      const anon = await fetch(BASE + '/todos/1', { method: 'DELETE' });
      console.log('no token: ' + anon.status);

      const del = await fetch(BASE + '/todos/1', { method: 'DELETE', headers: auth });
      console.log('delete: ' + del.status);
      console.log('body length: ' + (await del.text()).length);

      const again = await fetch(BASE + '/todos/1', { method: 'DELETE', headers: auth });
      console.log('delete again: ' + again.status);

      const list = await fetch(BASE + '/todos');
      console.log('todos left: ' + list.headers.get('X-Total-Count'));

      async function create() {
        const r = await fetch(BASE + '/todos', {
          method: 'POST',
          headers: { ...auth, 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Same', userId: 1 }),
        });
        return (await r.json()).id;
      }
      const a = await create();
      const b = await create();
      console.log('POST ids: ' + a + ',' + b);
      const list2 = await fetch(BASE + '/todos');
      console.log('todos now: ' + list2.headers.get('X-Total-Count'));

      async function replace() {
        const r = await fetch(BASE + '/todos/2', {
          method: 'PUT',
          headers: { ...auth, 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Rewrite', userId: 1, done: false }),
        });
        return JSON.stringify(await r.json());
      }
      const first = await replace();
      const second = await replace();
      console.log('PUT twice equal: ' + (first === second));
quiz:
  - q: "A successful DELETE normally answers 204 No Content. What should you NOT do with that response?"
    options: ["Check res.status", "Call res.json() on it", "Check res.ok"]
    answer: 1
    explain: "There is no body, so res.json() throws SyntaxError: Unexpected end of JSON input."
  - q: "What does it mean that DELETE is idempotent?"
    options: ["It always succeeds", "It cannot be undone", "Doing it once or ten times leaves the server in the same final state"]
    answer: 2
  - q: "Which of these methods is NOT idempotent?"
    options: ["POST", "PUT", "GET"]
    answer: 0
    explain: "Two identical POSTs normally create two items."
  - q: "Why is it important that GET is a safe method?"
    options: ["Because GET always returns 200", "Because browsers, caches and crawlers may call it freely, so it must never change data", "Because GET needs no URL"]
    answer: 1
---

Deleting is the simplest write: you point at something and say "remove it". It is also the perfect place to learn two important ideas about HTTP methods: **safe** and **idempotent**. They tell you which requests you may repeat without fear.

## DELETE in practice

```
DELETE /todos/1 HTTP/1.1
Host: api.academy.test
Authorization: Bearer token-ada
```

```
HTTP/1.1 204 No Content

```

There is no request body and, after success, no response body: `204 No Content` means "done, and there is nothing to show you". In code:

```js
const res = await fetch(BASE + '/todos/1', {
  method: 'DELETE',
  headers: { Authorization: 'Bearer ' + token },
});
console.log(res.status); // prints: 204
console.log(res.ok);     // prints: true
```

Do **not** call `res.json()` on a `204`: there is no JSON and you get `SyntaxError: Unexpected end of JSON input`. If you want to confirm it is empty, `await res.text()` returns `""`.

Without a token you get `401`, and for an id that does not exist you get `404`. So deleting the same item **twice** gives `204` then `404`.

## Safe methods

A method is **safe** if it only *reads*; calling it changes nothing on the server. That is a promise between you and the whole web: browsers pre-load links, search engines crawl them, caches store the answers, and none of them ask permission.

| Method | Safe? | Idempotent? | Creates / changes data? |
| --- | --- | --- | --- |
| `GET` | yes | yes | no (read only) |
| `HEAD`, `OPTIONS` | yes | yes | no |
| `PUT` | no | yes | replaces |
| `DELETE` | no | yes | removes |
| `PATCH` | no | not guaranteed | partially changes |
| `POST` | no | **no** | creates |

If you ever put a deletion behind a `GET` link, a crawler will happily delete everything. Never do that.

## Idempotent: repeating it is harmless

A method is **idempotent** if doing it many times has the same effect on the server as doing it once.

- `PUT /todos/2` with the same body twice leaves todo 2 in the same state. Fine to repeat.
- `DELETE /todos/1` twice: after the first call the todo is gone, after the second it is still gone. The *final state* is the same, even though the second **response** is `404` rather than `204`.
- `POST /todos` twice creates **two** todos with two different ids.

```
POST /todos {"title":"Same","userId":1}  ->  201  id 11
POST /todos {"title":"Same","userId":1}  ->  201  id 12   (a duplicate!)
```

Why does it matter? Networks are unreliable. If a request times out, you do not know whether the server received it. For a `PUT` or `DELETE` you can simply **retry**. For a `POST` a blind retry may create duplicates, which is why serious payment APIs add an idempotency key header. You will use this thinking again in lesson 11.

## Reading the final state

After a delete, prove it worked: `GET /todos/1` now gives `404`, and `GET /todos` reports `X-Total-Count: 9`. Checking the real state is a good habit in tests and scripts.

> **Watch out:**
> - **Calling `res.json()` on a `204`.** It throws `SyntaxError: Unexpected end of JSON input`. Check `res.status === 204` or use `res.text()`.
> - **Forgetting the id.** `DELETE /todos` (the collection) answers `405 Method DELETE is not allowed here`; you cannot delete the whole list.
> - **Forgetting the `Authorization` header.** Every write answers `401` without it.
> - **Treating the second `404` as a failure of your program.** For a delete, "already gone" is usually what you wanted. Decide deliberately whether `404` is an error for you.
> - **Retrying POST blindly** after a timeout. You may now have a duplicate.
> - **Deleting with `GET`.** Never change data with a safe method.

## Going further

Delete todo 2 and then fetch `/users/1/todos`. Which todos does Ada have left? Then try `DELETE /users/99` and read the error message.

> **Your turn:** delete a todo without a token, with a token, and again, then check the count. After that create the same todo twice with `POST` to see two ids, and `PUT` the same replacement twice to prove the results are identical.
