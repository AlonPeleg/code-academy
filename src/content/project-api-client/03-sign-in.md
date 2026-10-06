---
title: "Step 3: Sign in and automatic auth headers"
summary: "Turn the helper into an ApiClient class that stores the token and sends it on every call."
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      // API client library, step 3: a client object that remembers who is signed in.
      const BASE_URL = "https://api.academy.test";

      class ApiError extends Error {
        constructor(status, message, details) {
          super(message);
          this.name = "ApiError";
          this.status = status;
          this.details = details;
        }
      }

      // TODO 1: turn the request function into a class ApiClient. Its constructor(baseUrl) stores
      //         this.baseUrl and this.token = null; request becomes a method that uses this.baseUrl.
      // TODO 2: add the header Authorization: "Bearer " + this.token whenever a token is stored.
      // TODO 3: add a getter isSignedIn, a login(email, password) method (POST /login, store the
      //         token from the answer and return the answer) and a logout() method.
      async function request(method, path, body) {
        const options = { method: method, headers: { Accept: "application/json" } };
        if (body !== undefined) {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
        const response = await fetch(BASE_URL + path, options);
        const text = await response.text();

        let data = null;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = { error: text };
          }
        }

        if (!response.ok) {
          const message = (data && data.error) || response.statusText || "HTTP " + response.status;
          throw new ApiError(response.status, message, data);
        }
        return data;
      }

      // ---- demo (already written, do not change) ----
      const client = new ApiClient(BASE_URL);
      console.log("signed in at start: " + client.isSignedIn);

      try {
        await client.request("GET", "/me");
      } catch (error) {
        console.log("/me without a token: " + error.status);
      }

      try {
        await client.login("ada@example.com", "wrong");
      } catch (error) {
        console.log("bad login: " + error.message);
      }

      await client.login("ada@example.com", "engine123");
      console.log("signed in now: " + client.isSignedIn + " (token " + client.token + ")");

      const me = await client.request("GET", "/me");
      console.log("I am " + me.name + " (" + me.role + ")");

      const created = await client.request("POST", "/users", { name: "Test User", email: "test@example.com" });
      console.log("created user #" + created.id + ": " + created.name);

      client.logout();
      try {
        await client.request("DELETE", "/users/" + created.id);
      } catch (error) {
        console.log("after logout: " + error.status);
      }
check:
  output: |
    signed in at start: false
    /me without a token: 401
    bad login: Wrong email or password
    signed in now: true (token token-ada)
    I am Ada Lovelace (admin)
    created user #6: Test User
    after logout: 401
  code:
    - { pattern: "class\\s+ApiClient", message: "Write class ApiClient." }
    - { pattern: "Bearer", message: "Send the header Authorization: \"Bearer \" + this.token." }
    - { pattern: "this\\.token", message: "Store the token on the object as this.token." }
    - { pattern: "new\\s+ApiClient\\s*\\(", message: "Create the client with new ApiClient(BASE_URL)." }
hints:
  - "Wrap the old function in a class: the constructor stores baseUrl and token = null, request becomes a method, and BASE_URL turns into this.baseUrl. Inside methods use this. to reach properties."
  - "Build const headers = { Accept: \"application/json\" } first; when this.token exists set headers.Authorization = \"Bearer \" + this.token. login() calls this.request(\"POST\", \"/login\", { email, password }) and stores data.token."
  - "class ApiClient { constructor(baseUrl) { this.baseUrl = baseUrl; this.token = null; }  get isSignedIn() { return this.token !== null; }  async request(method, path, body) { const headers = { Accept: \"application/json\" }; const options = { method: method, headers: headers }; if (this.token) { headers.Authorization = \"Bearer \" + this.token; } ... }  async login(email, password) { const data = await this.request(\"POST\", \"/login\", { email: email, password: password }); this.token = data.token; return data; }  logout() { this.token = null; } }"
solution:
  - name: main.js
    code: |
      // API client library, step 3: a client object that remembers who is signed in.
      const BASE_URL = "https://api.academy.test";

      class ApiError extends Error {
        constructor(status, message, details) {
          super(message);
          this.name = "ApiError";
          this.status = status;
          this.details = details;
        }
      }

      class ApiClient {
        constructor(baseUrl) {
          this.baseUrl = baseUrl;
          this.token = null;
        }

        get isSignedIn() {
          return this.token !== null;
        }

        async request(method, path, body) {
          const headers = { Accept: "application/json" };
          const options = { method: method, headers: headers };
          if (this.token) {
            headers.Authorization = "Bearer " + this.token;
          }
          if (body !== undefined) {
            headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(body);
          }
          const response = await fetch(this.baseUrl + path, options);
          const text = await response.text();

          let data = null;
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (e) {
              data = { error: text };
            }
          }

          if (!response.ok) {
            const message = (data && data.error) || response.statusText || "HTTP " + response.status;
            throw new ApiError(response.status, message, data);
          }
          return data;
        }

        async login(email, password) {
          const data = await this.request("POST", "/login", { email: email, password: password });
          this.token = data.token;
          return data;
        }

        logout() {
          this.token = null;
        }
      }

      // ---- demo ----
      const client = new ApiClient(BASE_URL);
      console.log("signed in at start: " + client.isSignedIn);

      try {
        await client.request("GET", "/me");
      } catch (error) {
        console.log("/me without a token: " + error.status);
      }

      try {
        await client.login("ada@example.com", "wrong");
      } catch (error) {
        console.log("bad login: " + error.message);
      }

      await client.login("ada@example.com", "engine123");
      console.log("signed in now: " + client.isSignedIn + " (token " + client.token + ")");

      const me = await client.request("GET", "/me");
      console.log("I am " + me.name + " (" + me.role + ")");

      const created = await client.request("POST", "/users", { name: "Test User", email: "test@example.com" });
      console.log("created user #" + created.id + ": " + created.name);

      client.logout();
      try {
        await client.request("DELETE", "/users/" + created.id);
      } catch (error) {
        console.log("after logout: " + error.status);
      }
quiz:
  - q: "What does the header Authorization: Bearer token-ada mean to the server?"
    options: ["The server should retry", "The body is JSON", "Whoever carries this token is allowed in as that user"]
    answer: 2
  - q: "Why is the token stored in the client object and not in a global variable?"
    options: ["Objects are faster", "Each client keeps its own sign-in, so two clients can be two different people", "Globals cannot hold strings"]
    answer: 1
  - q: "What error do you get when you call a class without new, like ApiClient(\"x\")?"
    options: ["TypeError: Class constructor ApiClient cannot be invoked without new", "It returns undefined", "Nothing, it works"]
    answer: 0
---
Most useful API calls need to know **who you are**. In this step your library learns to sign in once and then attach the proof of identity to every later call automatically, so the rest of your code never has to think about it.

## Where we are

We have a `request` function with a base address, JSON handling and `ApiError`. It has no memory though: a plain function cannot remember a sign-in between calls, and the base URL lives in a global constant.

## What we will add, and why

A real client is an **object that holds state**: where the server is, and the token you got when you signed in. We will turn the function into a class `ApiClient`. A **token** is a secret string the server hands out after a correct password (here `token-ada`). You send it back on every request in the header `Authorization: Bearer <token>`, and the server knows who is calling. Without the token the server answers `401 Unauthorized`.

## Guided walk-through

**1. From function to class.** A class bundles data (properties) with the functions that use it (methods). The constructor runs on `new ApiClient(...)`:

```js
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = null;      // null means "not signed in"
  }
  async request(method, path, body) { /* same body as before */ }
}
```

Inside methods, `this` is the client object. So `BASE_URL` becomes `this.baseUrl`, and you call it as `client.request(...)`.

**2. Add the header automatically.** Build the `headers` object first, put the token in when there is one, and then attach it to the options:

```js
const headers = { Accept: "application/json" };
if (this.token) {
  headers.Authorization = "Bearer " + this.token;
}
```

The word `Bearer` is part of the standard: it means "whoever bears (carries) this token is allowed in".

**3. Sign in.** The server's `POST /login` takes `{ email, password }` and answers `{ token, expiresIn }`. Store the token on the object:

```js
async login(email, password) {
  const data = await this.request("POST", "/login", { email: email, password: password });
  this.token = data.token;
  return data;
}
```

Notice `login` uses the same `request` method, so a wrong password throws an `ApiError` with status 401 for free. Because the call throws before the assignment, `this.token` is not changed on failure.

**4. Small helpers.** A getter lets callers write `client.isSignedIn` without parentheses, and `logout` just forgets the token:

```js
get isSignedIn() { return this.token !== null; }
logout() { this.token = null; }
```

The practice server accepts two accounts: `ada@example.com` with password `engine123` (an admin) and `grace@example.com` with `cobol456`.

## The demo

It checks the client is not signed in, shows that `/me` fails with 401 without a token and that a wrong password gives a readable message, then signs in, asks `/me`, creates a user (this needs a token) and finally logs out to prove writing is forbidden again.

> **Watch out:**
> - Forgetting `this.` inside the class: `ReferenceError: baseUrl is not defined`.
> - Calling `ApiClient(...)` without `new`: `TypeError: Class constructor ApiClient cannot be invoked without 'new'`.
> - Putting the token in the URL or in a global variable: tokens belong in a header, and in an object so two clients can be signed in as two different people.
> - Logging the token in real apps. It is a password in disguise; here it is a practice token.
> - A missing space in `"Bearer" + this.token` makes the header `Bearertoken-ada` and the server answers `401`.

> **Your turn:** turn the function into `class ApiClient` with a constructor `(baseUrl)`, `token = null`, a `request` method that adds `Authorization: Bearer <token>` when a token exists, `login(email, password)`, `logout()` and the `isSignedIn` getter. The demo then runs against `new ApiClient(BASE_URL)`.
