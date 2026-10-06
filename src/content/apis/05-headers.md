---
title: "Headers: reading and sending"
summary: Read response headers, send your own request headers, and see exactly what the server received with /headers and /echo.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // 1. GET /users. Print "type: " + the Content-Type response header.
      //    Then print "missing: " + the value of a header called X-Nope
      //    (a header that does not exist).

      // 2. GET /headers, which reflects back the headers it received as JSON.
      //    Send two request headers: 'X-Student': 'Maya' and 'Accept': 'application/json'
      //    (pass them as { headers: { ... } } in the second argument of fetch).
      //    Print "x-student: " + the value, and "accept: " + the value.
      //    (The reflected keys are all lowercase.)

      // 3. POST to /echo with the JSON body { hello: 'world' }.
      //    Remember: method, Content-Type header, and JSON.stringify for the body.
      //    The server replies with what it saw: { method, query, contentType, body }.
      //    Print "method: " + data.method, "contentType: " + data.contentType and
      //    "body: " + JSON.stringify(data.body)
check:
  output: |
    type: application/json; charset=utf-8
    missing: null
    x-student: Maya
    accept: application/json
    method: POST
    contentType: application/json
    body: {"hello":"world"}
  code:
    - { pattern: 'headers\s*:', message: "Pass a headers object to fetch." }
    - { pattern: 'method\s*:\s*[''"]POST[''"]', message: "Send the echo request with method: 'POST'." }
    - { pattern: 'JSON\.stringify\(\s*\{', message: "Turn the body object into JSON text with JSON.stringify." }
    - { pattern: 'headers\.get\(', message: "Read response headers with res.headers.get(...)." }
hints:
  - "Response headers are read with res.headers.get('name'); it ignores upper/lower case and returns null for a missing header. Request headers go into the second argument of fetch: fetch(url, { headers: { Name: 'value' } })."
  - "fetch(BASE + '/headers', { headers: { 'X-Student': 'Maya', Accept: 'application/json' } })  and for the POST: fetch(BASE + '/echo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hello: 'world' }) })"
  - "const echo = await (await fetch(BASE + '/echo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hello: 'world' }) })).json(); console.log('method: ' + echo.method); console.log('contentType: ' + echo.contentType); console.log('body: ' + JSON.stringify(echo.body));"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      const res1 = await fetch(BASE + '/users');
      console.log('type: ' + res1.headers.get('Content-Type'));
      console.log('missing: ' + res1.headers.get('X-Nope'));

      const res2 = await fetch(BASE + '/headers', {
        headers: { 'X-Student': 'Maya', Accept: 'application/json' },
      });
      const seen = await res2.json();
      console.log('x-student: ' + seen['x-student']);
      console.log('accept: ' + seen.accept);

      const res3 = await fetch(BASE + '/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hello: 'world' }),
      });
      const data = await res3.json();
      console.log('method: ' + data.method);
      console.log('contentType: ' + data.contentType);
      console.log('body: ' + JSON.stringify(data.body));
quiz:
  - q: "What is the difference between Content-Type and Accept?"
    options: ["They are the same header", "Content-Type describes the body being sent; Accept says what formats you want back", "Accept describes the body being sent; Content-Type says what you want back"]
    answer: 1
  - q: "What does res.headers.get('x-missing') return for a header that is not there?"
    options: ["An empty string", "undefined", "null"]
    answer: 2
  - q: "You send a body with JSON.stringify(...) but no Content-Type header. What is the likely result?"
    options: ["The server may not understand it and replies with an error such as 415", "Everything works as normal", "fetch throws before sending"]
    answer: 0
    explain: "Without the header, fetch labels a string body as text/plain, so a JSON API does not know to parse it."
  - q: "Are header names case-sensitive in HTTP?"
    options: ["Yes, always lowercase", "No, Content-Type and content-type are the same header", "Only on the server"]
    answer: 1
---

Headers are the small print of HTTP: tiny `Name: value` notes that travel with every request and response. They carry the format of the data, who you are, how long you may cache something, and more. This lesson shows how to read the server's headers and how to send your own.

## Where headers live

Here is a request and response with their headers:

```
POST /echo HTTP/1.1
Host: api.academy.test
Content-Type: application/json
Accept: application/json

{"hello":"world"}
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"method":"POST","contentType":"application/json", ...}
```

Headers come after the first line and before the empty line that starts the body. Some you will meet constantly:

| Header | Direction | Meaning |
| --- | --- | --- |
| `Content-Type` | both | the format of **this message's body** (`application/json`) |
| `Accept` | request | the formats **you** can understand in the answer |
| `Authorization` | request | credentials (next lesson) |
| `Location` | response | where a newly created item lives |
| `ETag`, `Cache-Control` | response | caching information (lesson 12) |
| `Retry-After` | response | how many seconds to wait (lesson 11) |
| `X-...` | either | custom headers such as `X-Total-Count` |

## Reading response headers

`res.headers` is a small object with a `get` method:

```js
const res = await fetch(BASE + '/users');
console.log(res.headers.get('content-type')); // prints: application/json; charset=utf-8
console.log(res.headers.get('X-Total-Count')); // prints: 5
console.log(res.headers.get('X-Nope'));        // prints: null
```

Header names are **case-insensitive**: `Content-Type`, `content-type` and `CONTENT-TYPE` are the same. A missing header gives `null`, and every value is a string. You can also loop over all of them:

```js
for (const [name, value] of res.headers) console.log(name + ': ' + value);
```

## Sending request headers

The second argument of `fetch` is an **options object**. Its `headers` property is a plain object:

```js
const res = await fetch(BASE + '/headers', {
  headers: { 'X-Student': 'Maya', Accept: 'application/json' },
});
```

Quote names that contain a dash (`'X-Student'`); a simple word like `Accept` needs no quotes.

How can you be sure what the server really received? The practice server has two mirrors:

- `GET /headers` replies with the request headers as JSON (names in lowercase).
- `/echo` replies with the method, query string, content type and body of whatever you send.

Mirrors like these (real-world cousins: httpbin) are the best debugging tool for beginners: if the answer is not what you expect, check what actually left your code.

## Content-Type matters when you send data

When you send a body, the server must know how to read it. A JSON API expects:

```js
await fetch(BASE + '/echo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ hello: 'world' }),
});
```

Three pieces work together: the **method** (`POST`), the **header** (`Content-Type: application/json`) that labels the body, and the **body** itself, which must be a string, so you convert the object with `JSON.stringify`.

> **Watch out:**
> - **Forgetting `Content-Type`.** `fetch` then labels the string body as `text/plain`. Write endpoints answer `415` with the message `Send JSON with the header Content-Type: application/json`.
> - **Passing an object as the body.** `body: { hello: 'world' }` sends the text `[object Object]`. Always `JSON.stringify` it.
> - **Putting the headers in the wrong place.** `fetch(url, { 'Content-Type': 'application/json' })` is silently ignored. They belong inside `headers: { ... }`.
> - **Expecting `res.headers.get('x')` to be a number.** Header values are strings, and a missing header is `null`, not `undefined`.
> - **Wrong casing on the reflected object.** `/headers` returns lowercase keys, so `seen['X-Student']` is `undefined` but `seen['x-student']` works.

## Going further

Send the request to `/echo?lang=en&page=2` and look at the `query` field of the reply: the server parsed the query string for you. Then try posting without the `Content-Type` header and see what `contentType` the server reports.

> **Your turn:** read `Content-Type` and a missing header from `/users`, send `X-Student` and `Accept` to `/headers` and print what the server saw, then post JSON to `/echo` and print the method, content type and body it received.
