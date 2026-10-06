---
title: "Step 7: A SOAP helper and the final demo"
summary: "Build the SOAP envelope, send it with a SOAPAction header, parse the XML and turn faults into ApiErrors."
level: advanced
export:
  kind: node
  name: api-client
runner: js
files:
  - name: main.js
    code: |
      // API client library, step 7: SOAP calls and the finished library.
      const BASE_URL = "https://api.academy.test";

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const RETRYABLE_STATUS = [429, 502, 503, 504];
      const SAFE_METHODS = ["GET", "PUT", "DELETE"];

      // TODO 1: add escapeXml(value) (replace & < > and ") and xmlParams(params), which turns { a: 2, b: 3 }
      //         into "<a>2</a><b>3</b>" with escaped values.

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

        // TODO 2: add the method soapCall(service, action, bodyXml):
        //   - build the envelope: soap:Envelope (xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/") > soap:Body >
        //     <action xmlns="http://academy.test/<service>"> bodyXml </action>
        //   - POST it to "/soap/" + service with Content-Type "text/xml; charset=utf-8" and a SOAPAction header
        //     (namespace + "/" + action); count it in requestCount
        //   - parse the answer with parseXML; when a Fault element exists throw
        //     new ApiError(response.status, faultstring, { code: faultcode })
        //   - otherwise return the first child of the Body element

        async login(email, password) {
          const data = await this.request("POST", "/login", { email: email, password: password });
          this.token = data.token;
          return data;
        }

        logout() {
          this.token = null;
        }
      }

      // ---- final demo (already written, do not change) ----
      const client = new ApiClient(BASE_URL, { baseDelay: 5 });

      await client.login("ada@example.com", "engine123");
      const me = await client.request("GET", "/me");
      console.log("1. signed in as " + me.name);

      const created = await client.users.create({ name: "Demo User", email: "demo@example.com", role: "viewer" });
      await client.users.update(created.id, { city: "Paris" });
      const reread = await client.users.get(created.id);
      console.log("2. CRUD: #" + reread.id + " " + reread.name + " in " + reread.city);
      await client.users.remove(created.id);

      const everyone = await client.users.all({}, 2);
      console.log("3. pages: " + everyone.length + " users fetched in pages of 2");

      const flaky = await client.request("GET", "/flaky");
      console.log("4. retries: " + flaky.message);

      const sum = await client.soapCall("calculator", "Add", xmlParams({ a: 2, b: 3 }));
      console.log("5. SOAP Add: 2 + 3 = " + sum.get("result"));

      const product = await client.soapCall("calculator", "Multiply", xmlParams({ a: 6, b: 7 }));
      console.log("6. SOAP Multiply: 6 x 7 = " + product.get("result"));

      try {
        await client.soapCall("calculator", "Divide", xmlParams({ a: 1, b: 0 }));
      } catch (error) {
        console.log("7. SOAP fault: " + error.name + " " + error.status + " " + error.message + " [" + error.details.code + "]");
      }

      const student = await client.soapCall("students", "GetStudent", xmlParams({ id: 2 }));
      console.log("8. student: " + student.get("name") + " from " + student.get("city") + ", grade " + student.get("grade"));

      const list = await client.soapCall("students", "ListStudents", "");
      const names = list.findAll("student").map((s) => s.attrs.id + "=" + s.get("name"));
      console.log("9. all students: " + names.join(", "));

      try {
        await client.soapCall("students", "GetStudent", xmlParams({ id: 9 }));
      } catch (error) {
        console.log("10. " + error.message);
      }

      console.log("requests sent in total: " + client.requestCount);
check:
  output: |
    1. signed in as Ada Lovelace
    2. CRUD: #6 Demo User in Paris
    3. pages: 5 users fetched in pages of 2
    4. retries: Success on attempt 3
    5. SOAP Add: 2 + 3 = 5
    6. SOAP Multiply: 6 x 7 = 42
    7. SOAP fault: ApiError 500 Cannot divide by zero [soap:Server]
    8. student: Ben from Boston, grade 78
    9. all students: 1=Maya, 2=Ben, 3=Chen
    10. No student with id 9
    requests sent in total: 18
  code:
    - { pattern: "soapCall\\s*\\(\\s*service", message: "Add the method soapCall(service, action, bodyXml)." }
    - { pattern: "SOAPAction", message: "Send the SOAPAction header." }
    - { pattern: "parseXML\\s*\\(", message: "Parse the answer with parseXML(text)." }
    - { pattern: "Fault", message: "Look for the soap:Fault element and throw an ApiError." }
    - { pattern: "Envelope", message: "Wrap the request in a soap:Envelope." }
hints:
  - "A SOAP call is a POST whose body is XML: Envelope > Body > <action>parameters</action>. Add headers Content-Type text/xml and SOAPAction, then parse the answer text with parseXML."
  - "After parseXML, look for doc.find(\"Fault\") first: if it exists throw new ApiError(response.status, fault.get(\"faultstring\"), { code: fault.get(\"faultcode\") }). Otherwise return doc.find(\"Body\").children[0]. xmlParams({ a: 2, b: 3 }) builds \"<a>2</a><b>3</b>\" with escapeXml on each value."
  - "const envelope = '<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><' + action + ' xmlns=\"' + namespace + '\">' + bodyXml + \"</\" + action + \"></soap:Body></soap:Envelope>\";  fetch(this.baseUrl + \"/soap/\" + service, { method: \"POST\", headers: { \"Content-Type\": \"text/xml; charset=utf-8\", SOAPAction: namespace + \"/\" + action }, body: envelope });"
solution:
  - name: main.js
    code: |
      // API client library, step 7: SOAP calls and the finished library.
      const BASE_URL = "https://api.academy.test";

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const RETRYABLE_STATUS = [429, 502, 503, 504];
      const SAFE_METHODS = ["GET", "PUT", "DELETE"];

      // Turns { a: 2, b: 3 } into "<a>2</a><b>3</b>" (special characters are escaped).
      function escapeXml(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      }
      function xmlParams(params) {
        return Object.keys(params)
          .map((key) => "<" + key + ">" + escapeXml(params[key]) + "</" + key + ">")
          .join("");
      }

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

        // Calls a SOAP 1.1 service. Returns the response element; a soap:Fault becomes an ApiError.
        async soapCall(service, action, bodyXml) {
          const namespace = "http://academy.test/" + service;
          const envelope =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
            "<soap:Body>" +
            "<" + action + ' xmlns="' + namespace + '">' + bodyXml + "</" + action + ">" +
            "</soap:Body>" +
            "</soap:Envelope>";

          this.requestCount++;
          let response;
          let text;
          try {
            response = await fetch(this.baseUrl + "/soap/" + service, {
              method: "POST",
              headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: namespace + "/" + action },
              body: envelope,
            });
            text = await response.text();
          } catch (error) {
            throw new ApiError(0, "Network error: " + error.message);
          }

          let doc;
          try {
            doc = parseXML(text);
          } catch (error) {
            throw new ApiError(response.status, "The server did not send valid XML: " + error.message);
          }

          const fault = doc.find("Fault");
          if (fault) {
            throw new ApiError(response.status, fault.get("faultstring"), { code: fault.get("faultcode") });
          }
          return doc.find("Body").children[0];
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

      // ---- final demo: the whole library at work ----
      const client = new ApiClient(BASE_URL, { baseDelay: 5 });

      await client.login("ada@example.com", "engine123");
      const me = await client.request("GET", "/me");
      console.log("1. signed in as " + me.name);

      const created = await client.users.create({ name: "Demo User", email: "demo@example.com", role: "viewer" });
      await client.users.update(created.id, { city: "Paris" });
      const reread = await client.users.get(created.id);
      console.log("2. CRUD: #" + reread.id + " " + reread.name + " in " + reread.city);
      await client.users.remove(created.id);

      const everyone = await client.users.all({}, 2);
      console.log("3. pages: " + everyone.length + " users fetched in pages of 2");

      const flaky = await client.request("GET", "/flaky");
      console.log("4. retries: " + flaky.message);

      const sum = await client.soapCall("calculator", "Add", xmlParams({ a: 2, b: 3 }));
      console.log("5. SOAP Add: 2 + 3 = " + sum.get("result"));

      const product = await client.soapCall("calculator", "Multiply", xmlParams({ a: 6, b: 7 }));
      console.log("6. SOAP Multiply: 6 x 7 = " + product.get("result"));

      try {
        await client.soapCall("calculator", "Divide", xmlParams({ a: 1, b: 0 }));
      } catch (error) {
        console.log("7. SOAP fault: " + error.name + " " + error.status + " " + error.message + " [" + error.details.code + "]");
      }

      const student = await client.soapCall("students", "GetStudent", xmlParams({ id: 2 }));
      console.log("8. student: " + student.get("name") + " from " + student.get("city") + ", grade " + student.get("grade"));

      const list = await client.soapCall("students", "ListStudents", "");
      const names = list.findAll("student").map((s) => s.attrs.id + "=" + s.get("name"));
      console.log("9. all students: " + names.join(", "));

      try {
        await client.soapCall("students", "GetStudent", xmlParams({ id: 9 }));
      } catch (error) {
        console.log("10. " + error.message);
      }

      console.log("requests sent in total: " + client.requestCount);
quiz:
  - q: "What is the SOAP Envelope?"
    options: ["The outer XML wrapper that contains the Body with the operation", "A password header", "The response status"]
    answer: 0
  - q: "Why escape values like Tom & Jerry with escapeXml before putting them into the XML?"
    options: ["To make the request smaller", "SOAP forbids names", "An unescaped & or < breaks the XML structure and the server says it is not well-formed"]
    answer: 2
  - q: "How does a SOAP service report an error?"
    options: ["With an empty answer", "With a soap:Fault element in the XML answer (and HTTP status 500)", "With a JSON object { error }"]
    answer: 1
---
Not every service speaks JSON. Banks, governments and many older company systems still use **SOAP**, an XML-based protocol. In this last step your client learns to call SOAP services and turns their errors into the same `ApiError` as everything else. Then you run the whole library in a final demo.

## Where we are

`ApiClient` handles sign-in, CRUD, retries, timeouts and pagination for REST/JSON services. SOAP is different in four ways: the body is XML, it must be wrapped in an **envelope**, every call needs a `SOAPAction` header, and errors come back as XML too.

## What we will add, and why

A helper `client.soapCall(service, action, bodyXml)` that hides all of this. Callers just write:

```js
const result = await client.soapCall("calculator", "Add", xmlParams({ a: 2, b: 3 }));
console.log(result.get("result"));   // 5
```

One place knows the envelope format, so a change in the protocol is a change in one function.

## Guided walk-through

**1. The envelope.** A SOAP 1.1 request is XML shaped like this:

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Add xmlns="http://academy.test/calculator"><a>2</a><b>3</b></Add>
  </soap:Body>
</soap:Envelope>
```

The `Envelope` is the outer wrapper, `Body` holds the operation, and the operation element (`Add`) contains its parameters. In code you build this with string concatenation. A tiny helper `xmlParams({ a: 2, b: 3 })` produces `<a>2</a><b>3</b>`; it **escapes** characters like `<` and `&` (`&lt;`, `&amp;`) so user data can never break the XML structure, the same idea as SQL injection protection.

**2. The request.** SOAP always uses `POST`, with two special headers:

```js
fetch(this.baseUrl + "/soap/" + service, {
  method: "POST",
  headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: namespace + "/" + action },
  body: envelope,
});
```

`SOAPAction` names the operation being called. Without it the server answers with a fault: `Missing the SOAPAction header`.

**3. Parsing the answer.** Browsers have `DOMParser`, but background workers do not, so this runner gives you the global `parseXML(text)`. It returns a tree of nodes: `node.get("result")` is the text of the first descendant called `result`, `node.find("Fault")` is the first matching node or `null`, `node.findAll("student")` is a list, `node.attrs` holds attributes and `node.children` the child nodes. Namespace prefixes like `soap:` are ignored when searching.

**4. Faults become errors.** SOAP reports failures as an XML `Fault` element (the server also uses HTTP status 500). Look for it **before** looking for results:

```js
const fault = doc.find("Fault");
if (fault) {
  throw new ApiError(response.status, fault.get("faultstring"), { code: fault.get("faultcode") });
}
return doc.find("Body").children[0];
```

The first child of the Body is the response element, such as `AddResponse`. If the text is not valid XML at all, `parseXML` throws and you wrap that in an `ApiError` too, so callers only ever have to catch one kind of error.

## The final demo

The demo at the bottom exercises everything: sign-in, CRUD, paging, retries and SOAP, including a divide-by-zero fault and a student lookup. Read it as a usage guide for your own library.

> **Watch out:**
> - Sending JSON headers to a SOAP service: the server answers `Content-Type must be text/xml for SOAP 1.1`.
> - Forgetting that a SOAP fault arrives with a failure status AND a body: parse the XML before deciding it is "just an HTTP error".
> - Not escaping values: a name like `Tom & Jerry` makes the XML invalid (`The request is not well-formed XML`).
> - `ListStudents` has no parameters: pass an empty string as `bodyXml`.

## What to build next

* Make `soapCall` use the same timeout and retry code as `send`.
* Add `client.soap.calculator.add(2, 3)` wrapper methods built on `soapCall`.
* Cache GET results using the ETag and `If-None-Match` headers (`/config` supports it: `304 Not Modified`).
* Add a `Retry-After` header check so the backoff respects what the server asks for.
* Write the library as a real module and publish it to your own projects.

> **Your turn:** add `escapeXml`, `xmlParams` and `soapCall(service, action, bodyXml)` to `ApiClient`: build the envelope, POST it with `Content-Type: text/xml` and a `SOAPAction`, parse the answer with `parseXML`, throw an `ApiError` for a `Fault`, and otherwise return the first child of the Body. Then run the final demo.
