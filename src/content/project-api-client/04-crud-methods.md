---
title: "Step 4: CRUD methods for users, todos and posts"
summary: "Add a reusable Resource class so you can write client.users.get(1) and client.todos.list({ done: true })."
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      // API client library, step 4: friendly CRUD methods such as client.users.get(1).
      const BASE_URL = "https://api.academy.test";

      class ApiError extends Error {
        constructor(status, message, details) {
          super(message);
          this.name = "ApiError";
          this.status = status;
          this.details = details;
        }
      }

      // TODO 1: write a class Resource. Its constructor(client, name) stores the client and this.path = "/" + name.
      //         Methods: list(params) with an optional query string (URLSearchParams), get(id), create(data),
      //         update(id, changes) with PATCH, and remove(id). They all call this.client.request(...).

      class ApiClient {
        constructor(baseUrl) {
          this.baseUrl = baseUrl;
          this.token = null;
          // TODO 2: create this.users, this.todos and this.posts as new Resource objects.
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

      // ---- demo (already written, do not change) ----
      const client = new ApiClient(BASE_URL);

      const editors = await client.users.list({ role: "editor" });
      console.log("editors: " + editors.map((u) => u.name).join(", "));

      const ada = await client.users.get(1);
      console.log("user 1: " + ada.name + " from " + ada.city);

      const adaTodos = await client.todos.list({ userId: 1, done: true });
      console.log("Ada's finished todos: " + adaTodos.length);

      await client.login("ada@example.com", "engine123");

      const created = await client.users.create({ name: "Test User", email: "test@example.com" });
      console.log("created #" + created.id + " " + created.name);

      const updated = await client.users.update(created.id, { city: "Paris" });
      console.log("updated city: " + updated.city);

      const removed = await client.users.remove(created.id);
      console.log("removed, server answered: " + removed);

      try {
        await client.users.get(created.id);
      } catch (error) {
        console.log("get after remove: " + error.status + " " + error.message);
      }

      try {
        await client.users.create({ name: "No Mail", email: "nope" });
      } catch (error) {
        console.log("invalid: " + error.status + " " + JSON.stringify(error.details.fields));
      }
check:
  output: |
    editors: Grace Hopper, Katherine Johnson
    user 1: Ada Lovelace from London
    Ada's finished todos: 1
    created #6 Test User
    updated city: Paris
    removed, server answered: null
    get after remove: 404 No user with id 6
    invalid: 422 {"email":"must be an email address"}
  code:
    - { pattern: "class\\s+Resource", message: "Write class Resource." }
    - { pattern: "URLSearchParams", message: "Build the query string with URLSearchParams." }
    - { pattern: "['\"]PATCH['\"]", message: "update() should use the PATCH method." }
    - { pattern: "['\"]DELETE['\"]", message: "remove() should use the DELETE method." }
hints:
  - "Users, todos and posts all behave the same way, so write the five methods once in a class Resource that knows its client and its path (for example \"/users\"). Each method is one call to this.client.request(...)."
  - "get(id): GET path + \"/\" + id. create(data): POST path. update(id, changes): PATCH path + \"/\" + id. remove(id): DELETE path + \"/\" + id. In the ApiClient constructor write this.users = new Resource(this, \"users\"), and the same for todos and posts."
  - "class Resource { constructor(client, name) { this.client = client; this.path = \"/\" + name; }  list(params) { const query = new URLSearchParams(params || {}).toString(); return this.client.request(\"GET\", this.path + (query ? \"?\" + query : \"\")); }  get(id) { return this.client.request(\"GET\", this.path + \"/\" + id); }  create(data) { return this.client.request(\"POST\", this.path, data); }  update(id, changes) { return this.client.request(\"PATCH\", this.path + \"/\" + id, changes); }  remove(id) { return this.client.request(\"DELETE\", this.path + \"/\" + id); } }"
solution:
  - name: main.js
    code: |
      // API client library, step 4: friendly CRUD methods such as client.users.get(1).
      const BASE_URL = "https://api.academy.test";

      class ApiError extends Error {
        constructor(status, message, details) {
          super(message);
          this.name = "ApiError";
          this.status = status;
          this.details = details;
        }
      }

      class Resource {
        constructor(client, name) {
          this.client = client;
          this.path = "/" + name;
        }

        list(params) {
          const query = new URLSearchParams(params || {}).toString();
          return this.client.request("GET", this.path + (query ? "?" + query : ""));
        }

        get(id) {
          return this.client.request("GET", this.path + "/" + id);
        }

        create(data) {
          return this.client.request("POST", this.path, data);
        }

        update(id, changes) {
          return this.client.request("PATCH", this.path + "/" + id, changes);
        }

        remove(id) {
          return this.client.request("DELETE", this.path + "/" + id);
        }
      }

      class ApiClient {
        constructor(baseUrl) {
          this.baseUrl = baseUrl;
          this.token = null;
          this.users = new Resource(this, "users");
          this.todos = new Resource(this, "todos");
          this.posts = new Resource(this, "posts");
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

      const editors = await client.users.list({ role: "editor" });
      console.log("editors: " + editors.map((u) => u.name).join(", "));

      const ada = await client.users.get(1);
      console.log("user 1: " + ada.name + " from " + ada.city);

      const adaTodos = await client.todos.list({ userId: 1, done: true });
      console.log("Ada's finished todos: " + adaTodos.length);

      await client.login("ada@example.com", "engine123");

      const created = await client.users.create({ name: "Test User", email: "test@example.com" });
      console.log("created #" + created.id + " " + created.name);

      const updated = await client.users.update(created.id, { city: "Paris" });
      console.log("updated city: " + updated.city);

      const removed = await client.users.remove(created.id);
      console.log("removed, server answered: " + removed);

      try {
        await client.users.get(created.id);
      } catch (error) {
        console.log("get after remove: " + error.status + " " + error.message);
      }

      try {
        await client.users.create({ name: "No Mail", email: "nope" });
      } catch (error) {
        console.log("invalid: " + error.status + " " + JSON.stringify(error.details.fields));
      }
quiz:
  - q: "Which HTTP method fits \"change only some fields of user 6\"?"
    options: ["PATCH", "POST", "GET"]
    answer: 0
    explain: "PUT replaces the whole record, PATCH changes only what you send."
  - q: "What does CRUD stand for?"
    options: ["Connect, Request, Use, Disconnect", "Copy, Retry, Upload, Download", "Create, Read, Update, Delete"]
    answer: 2
  - q: "What does client.users.remove(6) resolve with when the server answers 204 No Content?"
    options: ["The deleted user", "null, because the answer has no body", "An ApiError"]
    answer: 1
---
Your client can already send any request. But nobody wants to write `client.request("PATCH", "/users/6", {...})` all day. In this step you add a friendly, readable layer: `client.users.get(1)`, `client.todos.list({ done: true })`.

## Where we are

`ApiClient` signs in, sends the token automatically and throws `ApiError`s. Every call needs the method and the path spelled out by hand, and one typo in a path is a silent bug.

## What we will add, and why

The practice server follows the common **REST** pattern: each kind of thing (users, todos, posts) lives at a path, and the HTTP method says what to do with it. This is called **CRUD** (Create, Read, Update, Delete):

| Action | Method and path | Method name we add |
| --- | --- | --- |
| list all | `GET /users` | `list(params)` |
| read one | `GET /users/3` | `get(id)` |
| create | `POST /users` | `create(data)` |
| change | `PATCH /users/3` | `update(id, changes)` |
| delete | `DELETE /users/3` | `remove(id)` |

Because users, todos and posts all work the same way, we write the CRUD methods **once** in a small class `Resource` and create one per collection. That is the DRY idea: Do not Repeat Yourself.

## Guided walk-through

**1. A resource knows its client and its path.**

```js
class Resource {
  constructor(client, name) {
    this.client = client;
    this.path = "/" + name;     // "/users"
  }
}
```

**2. Methods delegate to `request`.** Each one is a single line:

```js
get(id) {
  return this.client.request("GET", this.path + "/" + id);
}
create(data) {
  return this.client.request("POST", this.path, data);
}
```

They return the promise from `request`, so callers still `await` them. Do the same for `update` (use `PATCH`: it changes only the fields you send) and `remove` (`DELETE`; the server answers `204 No Content`, so you get `null` back).

**3. List with filters.** The server filters with query strings: `/users?role=editor`. `URLSearchParams` builds one from an object and takes care of special characters:

```js
list(params) {
  const query = new URLSearchParams(params || {}).toString();
  return this.client.request("GET", this.path + (query ? "?" + query : ""));
}
```

`new URLSearchParams({ userId: 1, done: true }).toString()` gives `"userId=1&done=true"`.

**4. Hang the resources on the client.** In the `ApiClient` constructor:

```js
this.users = new Resource(this, "users");
```

`this` here is the client itself, so each resource can call back into it. Do the same for `todos` and `posts`. Both classes must be written above the demo code: a class can only be used after the line that defines it has run.

## The demo

It lists the editors, reads one user, filters todos by user and state, signs in, then creates, updates, removes a user and shows the two failures a caller can expect afterwards: `404` for a removed user and `422 Validation failed` for bad data, where `error.details.fields` says which field is wrong.

> **Watch out:**
> - Writing writes without signing in: `ApiError 401 Sign in first`.
> - `this.client.request` is wrong inside a callback function (a plain `function` loses `this`). Use arrow functions or call straight from the method.
> - `PUT` replaces the whole record and requires every field; `PATCH` changes only what you send. Using `PUT` with partial data gives `422 name is required`.
> - Forgetting `return`: `await client.users.get(1)` then gives `undefined`.
> - `ReferenceError: Cannot access 'Resource' before initialization` when the class is written below the code that already uses it.

> **Your turn:** add the `Resource` class with `list`, `get`, `create`, `update` (PATCH) and `remove`, and create `users`, `todos` and `posts` resources in the `ApiClient` constructor. The finished demo must print the eight lines shown.
