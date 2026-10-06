---
title: "Step 6: Pagination helper"
summary: "Follow _page and X-Total-Pages with an async generator, and collect everything with all()."
level: advanced
runner: js
files:
  - name: main.js
    code: |
      // API client library, step 6: walk through every page of a long list.
      const BASE_URL = "https://api.academy.test";

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const RETRYABLE_STATUS = [429, 502, 503, 504];
      const SAFE_METHODS = ["GET", "PUT", "DELETE"];

      // Rejects with an AbortError as soon as the signal fires (even if fetch itself ignores the signal).
      function abortable(promise, signal) {
        return new Promise((resolve, reject) => {
          signal.addEventListener("abort", () => {
            const error = new Error("aborted");
            error.name = "AbortError";
            reject(error);
          });
          promise.then(resolve, reject);
        });
      }

      // TODO 1: add a helper toQuery(params) that returns "?a=1&b=2" (or "" when there are no params),
      //         and use it in Resource.list.

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

        // TODO 2: add an async generator method  async *pages(params, pageSize)  that asks for _page and _limit,
        //         reads the X-Total-Pages header from requestFull(...).headers, yields each page's array and
        //         stops after the last page.
        // TODO 3: add  async all(params, pageSize)  that collects every page into one array with for await.

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
        constructor(baseUrl, options) {
          const settings = options || {};
          this.baseUrl = baseUrl;
          this.token = null;
          this.retries = settings.retries !== undefined ? settings.retries : 3;
          this.baseDelay = settings.baseDelay !== undefined ? settings.baseDelay : 5;
          this.timeout = settings.timeout || 5000;
          this.onRetry = null;
          this.requestCount = 0;
          this.users = new Resource(this, "users");
          this.todos = new Resource(this, "todos");
          this.posts = new Resource(this, "posts");
        }

        get isSignedIn() {
          return this.token !== null;
        }

        // One single attempt. Returns { status, headers, data } or throws an ApiError.
        async send(method, path, body, timeout) {
          this.requestCount++;
          const headers = { Accept: "application/json" };
          const options = { method: method, headers: headers };
          if (this.token) {
            headers.Authorization = "Bearer " + this.token;
          }
          if (body !== undefined) {
            headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(body);
          }

          const controller = new AbortController();
          options.signal = controller.signal;
          const timer = setTimeout(() => controller.abort(), timeout);

          let response;
          let text;
          try {
            const exchange = (async () => {
              const res = await fetch(this.baseUrl + path, options);
              return { res: res, text: await res.text() };
            })();
            const done = await abortable(exchange, controller.signal);
            response = done.res;
            text = done.text;
          } catch (error) {
            if (error.name === "AbortError") {
              throw new ApiError(0, "Request timed out after " + timeout + " ms");
            }
            throw new ApiError(0, "Network error: " + error.message);
          } finally {
            clearTimeout(timer);
          }

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
          return { status: response.status, headers: response.headers, data: data };
        }

        // Send, and try again (with growing pauses) when the failure looks temporary.
        async requestFull(method, path, body, options) {
          const settings = options || {};
          const retries = settings.retries !== undefined ? settings.retries : this.retries;
          const timeout = settings.timeout || this.timeout;
          const canRetry = SAFE_METHODS.includes(method);

          for (let attempt = 0; ; attempt++) {
            try {
              return await this.send(method, path, body, timeout);
            } catch (error) {
              const temporary = error.status === 0 || RETRYABLE_STATUS.includes(error.status);
              if (!canRetry || !temporary || attempt >= retries) {
                throw error;
              }
              const wait = this.baseDelay * 2 ** attempt;
              if (this.onRetry) {
                this.onRetry({ attempt: attempt + 1, wait: wait, error: error });
              }
              await sleep(wait);
            }
          }
        }

        async request(method, path, body, options) {
          const result = await this.requestFull(method, path, body, options);
          return result.data;
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

      let pageNumber = 0;
      for await (const page of client.todos.pages({}, 4)) {
        pageNumber++;
        console.log("page " + pageNumber + ": " + page.length + " todos (ids " + page.map((t) => t.id).join(",") + ")");
      }

      const everything = await client.todos.all({}, 4);
      console.log("all todos: " + everything.length);

      const unfinished = await client.todos.all({ done: false }, 2);
      console.log("unfinished: " + unfinished.map((t) => t.title).join(" | "));

      const none = await client.users.all({ role: "ghost" });
      console.log("ghosts: " + none.length);

      const before = client.requestCount;
      for await (const page of client.todos.pages({}, 2)) {
        console.log("first page only: " + page.length + " todos");
        break;
      }
      console.log("requests used by the early break: " + (client.requestCount - before));
check:
  output: |
    page 1: 4 todos (ids 1,2,3,4)
    page 2: 4 todos (ids 5,6,7,8)
    page 3: 2 todos (ids 9,10)
    all todos: 10
    unfinished: Design the analytical engine | Define computable numbers | Release version 0.01 | Review a patch | Publish the notes
    ghosts: 0
    first page only: 2 todos
    requests used by the early break: 1
  code:
    - { pattern: "async\\s*\\*\\s*pages|async\\s+function\\s*\\*", message: "Write pages() as an async generator (async *pages)." }
    - { pattern: "yield\\s", message: "yield each page as you fetch it." }
    - { pattern: "X-Total-Pages", message: "Read the X-Total-Pages header to know when to stop." }
    - { pattern: "for\\s+await\\s*\\(", message: "Use for await to walk the pages inside all()." }
hints:
  - "The paging facts are in the response headers, so use requestFull (it returns { status, headers, data }). Ask for page 1, 2, 3... with _page and _limit until you have seen X-Total-Pages pages."
  - "An async generator method is written  async *pages(params, pageSize) { ... yield result.data; ... }  and is consumed with for await (const page of ...). Headers are text, so Number(result.headers.get(\"X-Total-Pages\"))."
  - "async *pages(params, pageSize) { const size = pageSize || 3; let page = 1; let totalPages = 1; while (page <= totalPages) { const query = Object.assign({}, params, { _page: page, _limit: size }); const result = await this.client.requestFull(\"GET\", this.path + toQuery(query)); totalPages = Number(result.headers.get(\"X-Total-Pages\") || 1); yield result.data; page++; } }  async all(params, pageSize) { const items = []; for await (const page of this.pages(params, pageSize)) { items.push(...page); } return items; }"
solution:
  - name: main.js
    code: |
      // API client library, step 6: walk through every page of a long list.
      const BASE_URL = "https://api.academy.test";

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const RETRYABLE_STATUS = [429, 502, 503, 504];
      const SAFE_METHODS = ["GET", "PUT", "DELETE"];

      // { _page: 2, role: "editor" } becomes "?_page=2&role=editor" (or "" when empty).
      function toQuery(params) {
        const text = new URLSearchParams(params || {}).toString();
        return text ? "?" + text : "";
      }

      // Rejects with an AbortError as soon as the signal fires (even if fetch itself ignores the signal).
      function abortable(promise, signal) {
        return new Promise((resolve, reject) => {
          signal.addEventListener("abort", () => {
            const error = new Error("aborted");
            error.name = "AbortError";
            reject(error);
          });
          promise.then(resolve, reject);
        });
      }

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
          return this.client.request("GET", this.path + toQuery(params));
        }

        // An async generator: yields one page (an array) at a time, fetching the next page only when asked.
        async *pages(params, pageSize) {
          const size = pageSize || 3;
          let page = 1;
          let totalPages = 1;
          while (page <= totalPages) {
            const query = Object.assign({}, params, { _page: page, _limit: size });
            const result = await this.client.requestFull("GET", this.path + toQuery(query));
            totalPages = Number(result.headers.get("X-Total-Pages") || 1);
            yield result.data;
            page++;
          }
        }

        // Collects every item of every page into one array.
        async all(params, pageSize) {
          const items = [];
          for await (const page of this.pages(params, pageSize)) {
            items.push(...page);
          }
          return items;
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
        constructor(baseUrl, options) {
          const settings = options || {};
          this.baseUrl = baseUrl;
          this.token = null;
          this.retries = settings.retries !== undefined ? settings.retries : 3;
          this.baseDelay = settings.baseDelay !== undefined ? settings.baseDelay : 5;
          this.timeout = settings.timeout || 5000;
          this.onRetry = null;
          this.requestCount = 0;
          this.users = new Resource(this, "users");
          this.todos = new Resource(this, "todos");
          this.posts = new Resource(this, "posts");
        }

        get isSignedIn() {
          return this.token !== null;
        }

        // One single attempt. Returns { status, headers, data } or throws an ApiError.
        async send(method, path, body, timeout) {
          this.requestCount++;
          const headers = { Accept: "application/json" };
          const options = { method: method, headers: headers };
          if (this.token) {
            headers.Authorization = "Bearer " + this.token;
          }
          if (body !== undefined) {
            headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(body);
          }

          const controller = new AbortController();
          options.signal = controller.signal;
          const timer = setTimeout(() => controller.abort(), timeout);

          let response;
          let text;
          try {
            const exchange = (async () => {
              const res = await fetch(this.baseUrl + path, options);
              return { res: res, text: await res.text() };
            })();
            const done = await abortable(exchange, controller.signal);
            response = done.res;
            text = done.text;
          } catch (error) {
            if (error.name === "AbortError") {
              throw new ApiError(0, "Request timed out after " + timeout + " ms");
            }
            throw new ApiError(0, "Network error: " + error.message);
          } finally {
            clearTimeout(timer);
          }

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
          return { status: response.status, headers: response.headers, data: data };
        }

        // Send, and try again (with growing pauses) when the failure looks temporary.
        async requestFull(method, path, body, options) {
          const settings = options || {};
          const retries = settings.retries !== undefined ? settings.retries : this.retries;
          const timeout = settings.timeout || this.timeout;
          const canRetry = SAFE_METHODS.includes(method);

          for (let attempt = 0; ; attempt++) {
            try {
              return await this.send(method, path, body, timeout);
            } catch (error) {
              const temporary = error.status === 0 || RETRYABLE_STATUS.includes(error.status);
              if (!canRetry || !temporary || attempt >= retries) {
                throw error;
              }
              const wait = this.baseDelay * 2 ** attempt;
              if (this.onRetry) {
                this.onRetry({ attempt: attempt + 1, wait: wait, error: error });
              }
              await sleep(wait);
            }
          }
        }

        async request(method, path, body, options) {
          const result = await this.requestFull(method, path, body, options);
          return result.data;
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

      let pageNumber = 0;
      for await (const page of client.todos.pages({}, 4)) {
        pageNumber++;
        console.log("page " + pageNumber + ": " + page.length + " todos (ids " + page.map((t) => t.id).join(",") + ")");
      }

      const everything = await client.todos.all({}, 4);
      console.log("all todos: " + everything.length);

      const unfinished = await client.todos.all({ done: false }, 2);
      console.log("unfinished: " + unfinished.map((t) => t.title).join(" | "));

      const none = await client.users.all({ role: "ghost" });
      console.log("ghosts: " + none.length);

      const before = client.requestCount;
      for await (const page of client.todos.pages({}, 2)) {
        console.log("first page only: " + page.length + " todos");
        break;
      }
      console.log("requests used by the early break: " + (client.requestCount - before));
quiz:
  - q: "Where does this server tell you how many pages exist?"
    options: ["In the URL", "It never does", "In the X-Total-Pages response header"]
    answer: 2
  - q: "What happens when the caller breaks out of a for await loop over pages()?"
    options: ["All remaining pages are still fetched", "The generator stops, so no more pages are fetched", "The program crashes"]
    answer: 1
    explain: "The generator only continues when the caller asks for the next value."
  - q: "Why is Object.assign({}, params, { _page: page }) used instead of changing params directly?"
    options: ["It copies the filters so the caller's object is not modified", "It is required by fetch", "It sorts the keys"]
    answer: 0
---
When a server holds thousands of records it never sends them all at once. It sends them **page by page**. In this step you teach the client to walk through all the pages for you, using a modern tool called an **async generator**.

## Where we are

The client is resilient: retries, timeouts, auth, CRUD. `requestFull` already returns `{ status, headers, data }`, which is exactly what we need now, because the paging information is in the **response headers**.

## What we will add, and why

Look at `GET /todos?_page=1&_limit=4`. The server answers with 4 todos plus headers `X-Page: 1`, `X-Total-Count: 10` and `X-Total-Pages: 3`. A client that only ever calls `list()` silently misses every record after the first page, a classic bug in real integrations. We will add:

* `pages(params, pageSize)`: an **async generator** that yields one page at a time, fetching the next page only when the caller asks for it.
* `all(params, pageSize)`: a convenience that collects everything into one array.

## Guided walk-through

**1. A tiny helper first.** We now build query strings in two places, so move the `URLSearchParams` code into one function `toQuery(params)` that returns `"?a=1&b=2"` or `""`, and use it in `list`.

**2. Async generators.** A normal function returns once. A **generator** (`function*`) can `yield` a value, pause, and continue later. An **async generator** (`async function*`, or `async *name()` for a method) can also `await`. You consume it with `for await`:

```js
async function* countdown() {
  yield 3;
  await somePromise;
  yield 2;
}
for await (const n of countdown()) console.log(n);   // 3 then 2
```

Because the generator pauses at each `yield`, a caller that does `break` stops the generator, and no further requests are sent.

**3. The `pages` method.** The shape of the answer:

```js
async *pages(params, pageSize) {
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const query = Object.assign({}, params, { _page: page, _limit: size });
    const result = await this.client.requestFull("GET", this.path + toQuery(query));
    totalPages = Number(result.headers.get("X-Total-Pages") || 1);
    yield result.data;
    page++;
  }
}
```

`Object.assign({}, params, {...})` copies the caller's filters and adds the paging keys without changing the caller's object. Headers are always text, so `Number(...)` converts. We learn the total number of pages from the **first** answer, and `|| 1` covers servers that do not send the header. An empty collection has `X-Total-Pages: 0`: the first page is yielded (an empty array) and the loop ends.

**4. The `all` method.** Spread each page into one array:

```js
async all(params, pageSize) {
  const items = [];
  for await (const page of this.pages(params, pageSize)) {
    items.push(...page);
  }
  return items;
}
```

`items.push(...page)` pushes every element of `page` (the `...` spreads an array into separate arguments).

> **Watch out:**
> - `for (const page of client.todos.pages())` without `await` gives `TypeError: client.todos.pages(...) is not iterable`. Async generators need `for await`.
> - `for await` only works inside an `async` function or at the top level of a module or of this runner.
> - Counting pages from 0: this server starts at `_page=1`; asking for page 0 behaves like page 1.
> - Changing the filter while you page (inserting records) can skip or repeat items. For big live data real APIs use cursors.
> - Forgetting `page++` creates an infinite loop that hammers the server.

> **Your turn:** add `toQuery`, then `pages(params, pageSize)` as an async generator reading `X-Total-Pages`, and `all(params, pageSize)` collecting every page. The demo shows pages of 4, collects everything, filters, handles an empty result and proves that `break` stops fetching.
