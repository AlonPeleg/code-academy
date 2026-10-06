---
title: "Step 1: A request helper"
summary: "Write request(method, path, body): one function that sends JSON to the server and returns JSON."
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // API client library, step 1: one helper that talks to the server.
      const BASE_URL = "https://api.academy.test";

      // TODO 1: finish this function. It must return the parsed JSON answer of the server.
      async function request(method, path, body) {
        // TODO 2: make an options object with the method and an Accept header that asks for JSON.

        // TODO 3: when a body was given, add the Content-Type header (application/json)
        //         and put the body into the options as JSON text.

        // TODO 4: call the server with the full address (BASE_URL + path) and the options.

        // TODO 5: read the answer as text. Return the parsed object, or null when the text is empty.
      }

      // ---- demo (already written, do not change) ----
      const ada = await request("GET", "/users/1");
      console.log(ada.name + " lives in " + ada.city);

      const users = await request("GET", "/users");
      console.log("users on the server: " + users.length);

      const echoed = await request("POST", "/echo", { hello: "world" });
      console.log("server received " + echoed.method + " " + JSON.stringify(echoed.body));

      const missing = await request("GET", "/users/99");
      console.log("missing user gives: " + JSON.stringify(missing));
check:
  output: |
    Ada Lovelace lives in London
    users on the server: 5
    server received POST {"hello":"world"}
    missing user gives: {"error":"No user with id 99"}
  code:
    - { pattern: "fetch\\s*\\(", message: "Call the server with fetch(...)." }
    - { pattern: "JSON\\.stringify\\s*\\(", message: "Send the body as text with JSON.stringify." }
    - { pattern: "JSON\\.parse\\s*\\(", message: "Turn the answer text into an object with JSON.parse." }
    - { pattern: "Content-Type", message: "Tell the server you are sending JSON with the Content-Type header." }
hints:
  - "Build an options object first (method plus headers), then call fetch with the full address, then read the answer with response.text(). Every fetch and text call needs await."
  - "Only when body is not undefined: add headers[\"Content-Type\"] = \"application/json\" and options.body = JSON.stringify(body). At the end return text ? JSON.parse(text) : null."
  - "const options = { method: method, headers: { Accept: \"application/json\" } };  if (body !== undefined) { options.headers[\"Content-Type\"] = \"application/json\"; options.body = JSON.stringify(body); }  const response = await fetch(BASE_URL + path, options);  const text = await response.text();  return text ? JSON.parse(text) : null;"
solution:
  - name: main.js
    code: |
      // API client library, step 1: one helper that talks to the server.
      const BASE_URL = "https://api.academy.test";

      async function request(method, path, body) {
        const options = { method: method, headers: { Accept: "application/json" } };
        if (body !== undefined) {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
        const response = await fetch(BASE_URL + path, options);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      }

      // ---- demo ----
      const ada = await request("GET", "/users/1");
      console.log(ada.name + " lives in " + ada.city);

      const users = await request("GET", "/users");
      console.log("users on the server: " + users.length);

      const echoed = await request("POST", "/echo", { hello: "world" });
      console.log("server received " + echoed.method + " " + JSON.stringify(echoed.body));

      const missing = await request("GET", "/users/99");
      console.log("missing user gives: " + JSON.stringify(missing));
quiz:
  - q: "Why does the helper read response.text() and then JSON.parse instead of calling response.json()?"
    options: ["Some answers (like 204 No Content) have no body, and parsing an empty string would crash", "response.json() does not exist", "Text is always faster"]
    answer: 0
    explain: "We check for empty text first and return null in that case."
  - q: "What must you do to an object before sending it as the body of a fetch call?"
    options: ["Nothing, fetch converts it", "Sort its keys", "Turn it into text with JSON.stringify"]
    answer: 2
  - q: "Which header tells the server that the request body is JSON?"
    options: ["Accept", "Content-Type", "Authorization"]
    answer: 1
    explain: "Accept says what you want back; Content-Type says what you are sending."
---
Almost every real app talks to a server: it asks for users, saves a todo, signs someone in. In this project you will build a small **API client library**, a reusable toolbox that hides all the boring parts of those conversations. By the last step it will handle sign-in, errors, retries, paging and even SOAP.

## Where we are

Nowhere yet, and that is fine. We start with a tiny skeleton: one function, `request`, that sends a call to the practice server at `https://api.academy.test` and gives back the answer as a JavaScript object. The practice server is built into the page, so everything works offline and gives the same answers every run.

## What we will add, and why

If every part of your app calls `fetch` by hand, you repeat the same lines everywhere: the base address, the JSON headers, the `JSON.parse`. When the server changes, you fix twenty places. One `request(method, path, body)` helper means there is **one place** to fix, and later steps can add error handling, tokens and retries in that same place and every feature gets them for free.

## Guided walk-through

**1. The options object.** `fetch(url, options)` takes a second argument describing the call. The method (`"GET"`, `"POST"`...) goes in there, plus headers, which are small labels sent with the request:

```js
const options = { method: method, headers: { Accept: "application/json" } };
```

`Accept` politely tells the server "I would like JSON back".

**2. Sending a body.** `GET` has no body, but `POST`, `PUT` and `PATCH` carry data. Only when the caller passed a `body` should we add it. A body must be **text**, so objects go through `JSON.stringify`, and a second header tells the server the text is JSON:

```js
if (body !== undefined) {
  options.headers["Content-Type"] = "application/json";
  options.body = JSON.stringify(body);
}
```

**3. Calling the server.** The address is the base plus the path. `fetch` returns a promise, so we `await` it:

```js
const response = await fetch(BASE_URL + path, options);
```

**4. Reading the answer.** `response.text()` is also a promise. We read text first (instead of `response.json()`) because some answers have no body at all, for example a successful `DELETE` answers `204 No Content`, and `JSON.parse("")` would crash:

```js
const text = await response.text();
return text ? JSON.parse(text) : null;
```

`text ? a : b` reads: "if there is any text, parse it, otherwise give back `null`".

## The demo

The demo at the bottom is already written. It reads user 1, counts all users, asks the `/echo` endpoint (which repeats back what it received) and asks for a user that does not exist. Notice what the last call returns: **an object describing the error, not an error**. Right now `request` cannot tell success from failure. That is exactly what Step 2 fixes.

> **Watch out:**
> - Forgetting `await` before `fetch(...)`: you get a `Promise` object and the next line fails with `TypeError: response.text is not a function`.
> - Forgetting `JSON.stringify` on the body: the server receives `[object Object]` and answers `400 The body is not valid JSON`.
> - Forgetting the `Content-Type` header: the server answers `415 Send JSON with the header Content-Type: application/json`.
> - Writing `headers.Content-Type = ...`: the minus sign is subtraction, so use `headers["Content-Type"]`.
> - Using `async` on the function is required: `await` inside a normal function is a `SyntaxError`.

> **Your turn:** complete `request(method, path, body)` so it sends the call to `BASE_URL + path`, sends `body` as JSON only when given, and returns the parsed JSON (or `null` for an empty answer). Run the file: the demo must print the four lines shown in the expected output.
