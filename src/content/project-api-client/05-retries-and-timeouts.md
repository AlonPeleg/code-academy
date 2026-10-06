---
title: "Step 5: Retries with backoff and a timeout"
summary: "Retry temporary failures with growing pauses and abort slow calls with an AbortController."
level: advanced
runner: js
files:
  - name: main.js
    code: |
      // API client library, step 5: retries with backoff and a timeout.
      const BASE_URL = "https://api.academy.test";

      // TODO 1: add a sleep(ms) helper that returns a promise resolved by setTimeout, and two constants:
      //         the retryable status codes [429, 502, 503, 504] and the safe methods ["GET", "PUT", "DELETE"].
      // TODO 2: add the helper abortable(promise, signal): a promise that rejects with an error named
      //         "AbortError" when the signal fires, and otherwise settles like the original promise.

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
        // TODO 3: accept an options object: retries (default 3), baseDelay (default 5), timeout (default 5000).
        //         Also keep this.onRetry = null and a counter this.requestCount = 0.
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

        // TODO 4: split request in three methods:
        //   send(method, path, body, timeout): ONE attempt, counts requestCount, uses an AbortController
        //     and abortable() for the timeout, turns an abort into ApiError(0, "Request timed out after N ms"),
        //     any other network failure into ApiError(0, "Network error: ..."), returns { status, headers, data }.
        //   requestFull(method, path, body, options): loops over send; retries (waiting baseDelay * 2 ** attempt,
        //     calling this.onRetry) only for safe methods and for status 0 or a retryable status.
        //   request(method, path, body, options): returns requestFull(...).data
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
      const client = new ApiClient(BASE_URL, { baseDelay: 5 });
      client.onRetry = (info) => {
        console.log("  retry " + info.attempt + " in " + info.wait + " ms (" + info.error.message + ")");
      };

      try {
        await client.request("GET", "/flaky", undefined, { retries: 0 });
      } catch (error) {
        console.log("without retries: " + error.status + " " + error.message);
      }

      const ok = await client.request("GET", "/flaky");
      console.log("with retries: " + ok.message + " (" + client.requestCount + " requests so far)");

      for (let i = 0; i < 3; i++) {
        await client.request("GET", "/limited");
      }
      try {
        await client.request("GET", "/limited");
      } catch (error) {
        console.log("gave up: " + error.status + " " + error.message);
      }

      const before = client.requestCount;
      try {
        await client.request("POST", "/error/503", {});
      } catch (error) {
        console.log("POST is not retried: " + error.status + ", requests used: " + (client.requestCount - before));
      }

      try {
        await client.request("GET", "/slow", undefined, { timeout: 100, retries: 0 });
      } catch (error) {
        console.log("timeout: " + error.status + " " + error.message);
      }
      const slow = await client.request("GET", "/slow", undefined, { timeout: 1000 });
      console.log("patient call: " + slow.message);
check:
  output: |
    without retries: 503 Temporarily unavailable, try again
      retry 1 in 5 ms (Temporarily unavailable, try again)
    with retries: Success on attempt 3 (3 requests so far)
      retry 1 in 5 ms (Too many requests)
      retry 2 in 10 ms (Too many requests)
      retry 3 in 20 ms (Too many requests)
    gave up: 429 Too many requests
    POST is not retried: 503, requests used: 1
    timeout: 0 Request timed out after 100 ms
    patient call: That took a while
  code:
    - { pattern: "new\\s+AbortController\\s*\\(", message: "Create an AbortController for the timeout." }
    - { pattern: "\\.abort\\s*\\(", message: "Call controller.abort() when the time is up." }
    - { pattern: "\\*\\*\\s*attempt|Math\\.pow\\s*\\(\\s*2", message: "Double the wait each time: this.baseDelay * 2 ** attempt." }
    - { pattern: "clearTimeout\\s*\\(", message: "Stop the timer with clearTimeout in a finally block." }
hints:
  - "Split request into three: send (one attempt, with the AbortController timeout), requestFull (a loop around send that retries) and request (returns requestFull(...).data). Retry only temporary failures: status 0, 429, 502, 503, 504."
  - "In requestFull: for (let attempt = 0; ; attempt++) { try { return await this.send(...); } catch (error) { if (cannot retry or attempt >= retries) throw error; await sleep(this.baseDelay * 2 ** attempt); } }"
  - "const controller = new AbortController(); options.signal = controller.signal; const timer = setTimeout(() => controller.abort(), timeout); try { const done = await abortable(exchange, controller.signal); ... } catch (error) { if (error.name === \"AbortError\") throw new ApiError(0, \"Request timed out after \" + timeout + \" ms\"); throw new ApiError(0, \"Network error: \" + error.message); } finally { clearTimeout(timer); }"
solution:
  - name: main.js
    code: |
      // API client library, step 5: retries with backoff and a timeout.
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
      const client = new ApiClient(BASE_URL, { baseDelay: 5 });
      client.onRetry = (info) => {
        console.log("  retry " + info.attempt + " in " + info.wait + " ms (" + info.error.message + ")");
      };

      try {
        await client.request("GET", "/flaky", undefined, { retries: 0 });
      } catch (error) {
        console.log("without retries: " + error.status + " " + error.message);
      }

      const ok = await client.request("GET", "/flaky");
      console.log("with retries: " + ok.message + " (" + client.requestCount + " requests so far)");

      for (let i = 0; i < 3; i++) {
        await client.request("GET", "/limited");
      }
      try {
        await client.request("GET", "/limited");
      } catch (error) {
        console.log("gave up: " + error.status + " " + error.message);
      }

      const before = client.requestCount;
      try {
        await client.request("POST", "/error/503", {});
      } catch (error) {
        console.log("POST is not retried: " + error.status + ", requests used: " + (client.requestCount - before));
      }

      try {
        await client.request("GET", "/slow", undefined, { timeout: 100, retries: 0 });
      } catch (error) {
        console.log("timeout: " + error.status + " " + error.message);
      }
      const slow = await client.request("GET", "/slow", undefined, { timeout: 1000 });
      console.log("patient call: " + slow.message);
quiz:
  - q: "Why wait longer after each failed attempt (5, 10, 20 ms...)?"
    options: ["It makes the code shorter", "It gives a struggling server room to recover and spreads out the clients", "fetch requires it"]
    answer: 1
    explain: "This is called exponential backoff."
  - q: "Why does the client not retry POST requests automatically?"
    options: ["Running a POST twice might create two records", "POST cannot fail", "POST is always faster"]
    answer: 0
  - q: "What does an AbortController do?"
    options: ["It checks the Authorization header", "It retries a request", "It lets you cancel a request by firing its signal"]
    answer: 2
---
Networks fail all the time: a server restarts, a Wi-Fi signal drops, an overloaded service says "try again later". In this step your client becomes **resilient**: it retries temporary failures with growing pauses and gives up on calls that take too long.

## Where we are

`ApiClient` has sign-in, CRUD resources and consistent errors. But one hiccup (a `503 Service Unavailable`) fails the whole call, and a server that never answers would make the program wait forever.

## What we will add, and why

Two classic techniques:

* **Retry with exponential backoff.** After a temporary failure, wait a little and try again. Wait *longer* each time (5 ms, 10 ms, 20 ms...). The doubling gives the server room to recover and stops thousands of clients from hammering it in lockstep. Our practice delays are tiny; real apps use something like 200 ms, 400 ms, 800 ms.
* **Timeout.** Decide how long you are willing to wait and abort after that, using an `AbortController`.

Retries are only safe for calls that can run twice without harm: `GET`, `PUT` and `DELETE` are **idempotent** (doing them twice equals doing them once). A `POST` might create two records, so we never retry it automatically.

## Guided walk-through

**1. Split the work.** Make three layers, each small:

* `send(method, path, body, timeout)`: one single attempt. Returns `{ status, headers, data }` or throws an `ApiError`. (Move the old fetch code here.)
* `requestFull(method, path, body, options)`: the retry loop around `send`.
* `request(...)`: calls `requestFull` and returns only `.data`, so all your old callers keep working.

**2. The timeout.** An `AbortController` has a `signal` you pass to `fetch`; calling `controller.abort()` cancels the request:

```js
const controller = new AbortController();
options.signal = controller.signal;
const timer = setTimeout(() => controller.abort(), timeout);
try {
  // ... await the fetch ...
} finally {
  clearTimeout(timer);   // always stop the timer, success or not
}
```

A real browser rejects `fetch` with an `AbortError` when the signal fires. The practice server is simulated and ignores the signal, so the file includes a helper `abortable(promise, signal)` that rejects when the signal fires, no matter what. Catch the error and convert it: `error.name === "AbortError"` becomes `new ApiError(0, "Request timed out after 100 ms")`. Status `0` means "no HTTP answer at all", and a network error gets status `0` too.

**3. The retry loop.** A `for` loop with no end condition and a `return` on success:

```js
for (let attempt = 0; ; attempt++) {
  try {
    return await this.send(method, path, body, timeout);
  } catch (error) {
    const temporary = error.status === 0 || RETRYABLE_STATUS.includes(error.status);
    if (!canRetry || !temporary || attempt >= retries) throw error;
    await sleep(this.baseDelay * 2 ** attempt);
  }
}
```

`2 ** attempt` is "2 to the power of attempt": 1, 2, 4... so the waits are 5, 10, 20 ms. `throw error` inside `catch` re-throws the same error when we give up. A `404` is not temporary, so it fails immediately: retrying will never make a missing user appear.

**4. Observe it.** Add an optional `this.onRetry` callback that `requestFull` calls before each pause with `{ attempt, wait, error }`, and `this.requestCount` that `send` increments. The demo uses both to print what happened. `/flaky` fails twice with 503 then succeeds, `/limited` always answers `429 Too many requests` after three calls, `/slow` takes 300 ms.

> **Watch out:**
> - Retrying forever: always cap the attempts, otherwise a dead server hangs your app.
> - Retrying `POST`: double charges and duplicate records. That is why `SAFE_METHODS` exists.
> - Forgetting `clearTimeout`: the timer keeps the program alive and later aborts a request that already finished.
> - Retrying errors like `401` or `422`: they will never succeed, only retry `429`, `502`, `503`, `504` and network errors.
> - `await` missing before `sleep(...)`: the loop spins without pausing.

> **Your turn:** split `request` into `send`, `requestFull` and `request`, add the timeout with `AbortController`, and add exponential backoff for safe methods. Constructor options are `retries` (3), `baseDelay` (5) and `timeout` (5000); a per-call `options` argument can override `retries` and `timeout`.
