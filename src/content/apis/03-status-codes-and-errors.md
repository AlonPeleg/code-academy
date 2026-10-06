---
title: Status codes, res.ok and handling errors
summary: Read status codes, understand that a 404 does not make fetch throw, and handle both HTTP errors and network failures.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // PART A: print the status of three requests, one line each, like:
      //   /users/1 -> 200 OK ok=true
      // using res.status, res.statusText and res.ok
      for (const path of ['/users/1', '/users/99', '/error/500']) {
        // fetch BASE + path and print the line
      }

      // PART B: write getJson(path).
      //   It fetches BASE + path. If the response is NOT ok, read the JSON body
      //   and throw new Error(res.status + ': ' + body.error).
      //   Otherwise return the parsed JSON.
      // Then call it inside try/catch for '/users/99' and print "failed: " + error.message

      // PART C: a request that cannot even leave the building.
      // Inside try/catch, fetch('http://api.academy.test/users') (note: http, not https).
      // In the catch block print "network: " + error.name
check:
  output: |
    /users/1 -> 200 OK ok=true
    /users/99 -> 404 Not Found ok=false
    /error/500 -> 500 Internal Server Error ok=false
    failed: 404: No user with id 99
    network: TypeError
  code:
    - { pattern: 'res\.ok|response\.ok', message: "Check the ok property of the response." }
    - { pattern: 'throw\s+new\s+Error', message: "Throw an Error inside getJson when the response is not ok." }
    - { pattern: 'catch\s*\(', message: "Use try/catch to handle the failures." }
hints:
  - "A 404 or 500 is still a successful conversation: fetch gives you a normal response and you must look at res.ok (true for 200 to 299) yourself. fetch only throws when no response arrives at all."
  - "Part A: const res = await fetch(BASE + path); console.log(path + ' -> ' + res.status + ' ' + res.statusText + ' ok=' + res.ok);   Part B: if (!res.ok) { const body = await res.json(); throw new Error(...); }"
  - "async function getJson(path) { const res = await fetch(BASE + path); if (!res.ok) { const body = await res.json(); throw new Error(res.status + ': ' + body.error); } return res.json(); }   try { await getJson('/users/99'); } catch (error) { console.log('failed: ' + error.message); }"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      for (const path of ['/users/1', '/users/99', '/error/500']) {
        const res = await fetch(BASE + path);
        console.log(path + ' -> ' + res.status + ' ' + res.statusText + ' ok=' + res.ok);
      }

      async function getJson(path) {
        const res = await fetch(BASE + path);
        if (!res.ok) {
          const body = await res.json();
          throw new Error(res.status + ': ' + body.error);
        }
        return res.json();
      }

      try {
        await getJson('/users/99');
      } catch (error) {
        console.log('failed: ' + error.message);
      }

      try {
        await fetch('http://api.academy.test/users');
      } catch (error) {
        console.log('network: ' + error.name);
      }
quiz:
  - q: "You fetch /users/99 and the server answers 404. What does await fetch(...) do?"
    options: ["It throws an error", "It resolves normally with a response whose ok is false", "It returns null"]
    answer: 1
    explain: "fetch only rejects when the request cannot be completed (no network, bad URL). HTTP error codes are normal responses."
  - q: "Which status codes make res.ok true?"
    options: ["Only 200", "200 to 299", "Anything below 400 including 304 and 301"]
    answer: 1
  - q: "Which status family means the server itself had a problem?"
    options: ["4xx", "3xx", "5xx"]
    answer: 2
  - q: "A user types a wrong password and the server replies 401. Whose fault is that?"
    options: ["The request (client side)", "The server crashed", "The network"]
    answer: 0
    explain: "4xx codes mean the client sent something the server cannot accept; fix the request and retry."
---

Real networks fail, and real servers say no. A program that only works when everything goes right is not finished. This lesson teaches you to read status codes and to separate the two very different kinds of failure.

## Status codes you will meet

Every response starts with a status line, like `HTTP/1.1 404 Not Found`. The number is for programs, the text for humans.

| Code | Name | When you see it |
| --- | --- | --- |
| 200 | OK | The request worked and here is the data |
| 201 | Created | A new item was made (after `POST`) |
| 204 | No Content | It worked and there is nothing to send back |
| 304 | Not Modified | Your cached copy is still good |
| 400 | Bad Request | The request is malformed (for example broken JSON) |
| 401 | Unauthorized | You are not signed in, or the token is bad |
| 403 | Forbidden | You are signed in but not allowed |
| 404 | Not Found | There is nothing at that address |
| 422 | Unprocessable Entity | The data is understood but invalid |
| 429 | Too Many Requests | Slow down |
| 500 | Internal Server Error | The server crashed |
| 503 | Service Unavailable | The server is overloaded or restarting |

The practice server has a handy address, `/error/NNN`, that answers with any status you ask for. `/error/500` gives a `500`, which lets you practise error handling on demand.

## Two kinds of failure

This is the most important idea of the lesson.

1. **The server answered, but with an error.** Example: `404 Not Found`. The conversation worked; you got a response. `await fetch(...)` does **not** throw. You must check it yourself.
2. **No answer arrived.** Example: no internet, a wrong host, or a blocked URL. Now `fetch` itself **throws** (rejects with a `TypeError`), and only `try/catch` can catch it.

```js
const res = await fetch(BASE + '/users/99');
console.log(res.status); // prints: 404   (no exception!)
console.log(res.ok);     // prints: false
```

`res.ok` is a convenient boolean: `true` when the status is `200` to `299`, `false` otherwise. The text version is `res.statusText` (`"Not Found"`).

## The standard pattern

Most programs want one place to turn "bad status" into a thrown error, so that the rest of the code can use plain `try/catch`:

```js
async function getJson(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) {
    const body = await res.json();               // the server explains what went wrong
    throw new Error(res.status + ': ' + body.error);
  }
  return res.json();
}

try {
  const user = await getJson('/users/99');
} catch (error) {
  console.log('failed: ' + error.message);      // prints: failed: 404: No user with id 99
}
```

Error responses from this server are JSON too, shaped like `{ "error": "No user with id 99" }`. Reading that message makes your errors useful instead of a mystery.

## Network errors

Try fetching the practice server over plain `http://`. No answer can arrive, so `fetch` throws:

```js
try {
  await fetch('http://api.academy.test/users');
} catch (error) {
  console.log(error.name); // prints: TypeError
}
```

A real browser raises the same `TypeError` (often with the message `Failed to fetch`) when the network is down. Both failure kinds deserve a friendly message, but they need different code: `res.ok` for the first, `catch` for the second.

> **Watch out:**
> - **Assuming `try/catch` catches a 404.** It does not. Without an `if (!res.ok)` check, the code carries on and treats the error body (`{ error: ... }`) as if it were real data.
> - **Reading the body twice.** `await res.json()` then `await res.text()` fails with `TypeError: body stream already read`. Read it once and keep the result.
> - **Checking only `res.status === 200`.** That rejects `201` and `204`, which are successes too. Prefer `res.ok`.
> - **Forgetting `await` before `getJson(...)` inside `try`.** The promise is rejected later, after the `catch` is gone, and you see `Uncaught (in promise)`.

## Going further

Change the loop to also request `/error/404` and `/error/503`. Which of them would be worth retrying, and which would not? (Lesson 11 answers that.)

> **Your turn:** complete three parts. A: print `path -> status statusText ok=...` for three paths. B: write `getJson` that throws `status: message` when the response is not ok, and catch it. C: catch the network error of an `http://` request and print its `name`.
