---
title: "Caching and conditional requests (ETag)"
summary: Avoid downloading the same data twice with ETag, If-None-Match and the 304 Not Modified response.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // PART 1: a plain GET /config.
      //   Print "status: " + res.status
      //   Print "etag: " + the ETag response header
      //   Print "cache-control: " + the Cache-Control response header
      // (keep the ETag in a variable called etag: you need it in part 2)

      // PART 2: a CONDITIONAL request. GET /config again, but send the header
      //   If-None-Match with the etag you saved. Print "conditional: " + res.status
      //   Print "body length: " + the length of await res.text()

      // PART 3: send If-None-Match with the WRONG value '"v0"'.
      //   Print "stale etag: " + res.status

      // PART 4: a tiny cache. The object below remembers the last etag and data.
      const cache = { etag: null, data: null };
      // Write async function getConfig() that returns { status, data }:
      //   - if cache.etag is set, send If-None-Match with it
      //   - on a 304 answer, return { status: 304, data: cache.data }
      //   - otherwise save the ETag header and the parsed JSON in the cache
      //     and return { status: res.status, data: <the JSON> }
      // Then call getConfig three times and print each time
      //   "call 1: 200 {"theme":"dark","pageSize":10}"   (status, then JSON.stringify(data))
check:
  output: |
    status: 200
    etag: "v1"
    cache-control: max-age=60
    conditional: 304
    body length: 0
    stale etag: 200
    call 1: 200 {"theme":"dark","pageSize":10}
    call 2: 304 {"theme":"dark","pageSize":10}
    call 3: 304 {"theme":"dark","pageSize":10}
  code:
    - { pattern: 'If-None-Match', message: "Send the If-None-Match request header." }
    - { pattern: 'ETag', message: "Read the ETag response header." }
    - { pattern: '304', message: "Handle the 304 Not Modified status." }
    - { pattern: 'async\s+function\s+getConfig', message: "Write async function getConfig()." }
hints:
  - "An ETag is a fingerprint of the data. The server sends it in the ETag response header; next time you send it back in If-None-Match. If the data has not changed, the server answers 304 with no body, and you reuse your saved copy."
  - "const first = await fetch(BASE + '/config'); const etag = first.headers.get('ETag');   const second = await fetch(BASE + '/config', { headers: { 'If-None-Match': etag } });   The ETag value includes its double quotes: \"v1\" (keep them as they are)."
  - "async function getConfig() { const headers = {}; if (cache.etag) headers['If-None-Match'] = cache.etag; const res = await fetch(BASE + '/config', { headers }); if (res.status === 304) return { status: 304, data: cache.data }; cache.etag = res.headers.get('ETag'); cache.data = await res.json(); return { status: res.status, data: cache.data }; }"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      const first = await fetch(BASE + '/config');
      const etag = first.headers.get('ETag');
      console.log('status: ' + first.status);
      console.log('etag: ' + etag);
      console.log('cache-control: ' + first.headers.get('Cache-Control'));

      const second = await fetch(BASE + '/config', { headers: { 'If-None-Match': etag } });
      console.log('conditional: ' + second.status);
      console.log('body length: ' + (await second.text()).length);

      const third = await fetch(BASE + '/config', { headers: { 'If-None-Match': '"v0"' } });
      console.log('stale etag: ' + third.status);

      const cache = { etag: null, data: null };
      async function getConfig() {
        const headers = {};
        if (cache.etag) headers['If-None-Match'] = cache.etag;
        const res = await fetch(BASE + '/config', { headers });
        if (res.status === 304) {
          return { status: 304, data: cache.data };
        }
        cache.etag = res.headers.get('ETag');
        cache.data = await res.json();
        return { status: res.status, data: cache.data };
      }

      for (let i = 1; i <= 3; i++) {
        const result = await getConfig();
        console.log('call ' + i + ': ' + result.status + ' ' + JSON.stringify(result.data));
      }
quiz:
  - q: "What does the server answer when your If-None-Match matches the current ETag?"
    options: ["200 with the full data again", "304 Not Modified with no body", "404 Not Found"]
    answer: 1
  - q: "What is an ETag?"
    options: ["A password for the API", "A label (fingerprint) that changes whenever the data changes", "The time the request took"]
    answer: 1
  - q: "What is the benefit of conditional requests?"
    options: ["They save bandwidth: unchanged data is not sent again, but you still get a fresh answer", "They make writes safer", "They hide the URL"]
    answer: 0
  - q: "Cache-Control: max-age=60 on a response tells clients:"
    options: ["The data may be reused without asking the server for 60 seconds", "The request will time out after 60 seconds", "Only 60 requests are allowed"]
    answer: 0
---

The fastest request is the one you never send, and the second fastest is one where the server only says "nothing new". Caching is how browsers, apps and CDNs avoid downloading the same bytes over and over. It saves time, battery and money, and it is a favourite topic in interviews.

## Two kinds of caching

1. **Freshness (no request at all).** The response says how long its data stays valid, using `Cache-Control: max-age=60`: "for 60 seconds you may reuse this without asking me".
2. **Validation (a cheap request).** When the data may be outdated, you **ask the server if it changed**. If not, it answers with a tiny `304 Not Modified` and no body. This is what a **conditional request** does.

## ETag and If-None-Match

The practice endpoint `/config` demonstrates it. The first answer carries a fingerprint of the data, the **ETag**:

```
GET /config HTTP/1.1
Host: api.academy.test
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
ETag: "v1"
Cache-Control: max-age=60

{"theme":"dark","pageSize":10}
```

You store the body and the ETag. The next time, you send the ETag back in an `If-None-Match` header, meaning "give me the data only if it is **not** the version I already have":

```
GET /config HTTP/1.1
Host: api.academy.test
If-None-Match: "v1"
```

```
HTTP/1.1 304 Not Modified
ETag: "v1"

```

There is **no body**: you keep using your saved copy. If the data had changed, the server would answer `200` with the new body and a new ETag, and you would replace the cache.

The flow in one picture:

```
client                                  server
  | GET /config                            |
  |--------------------------------------->|
  |   200 + ETag "v1" + body               |   (client stores etag and body)
  |<---------------------------------------|
  | GET /config  If-None-Match: "v1"       |
  |--------------------------------------->|
  |   304 Not Modified (no body)           |   (client reuses its copy)
  |<---------------------------------------|
```

## In code

```js
const first = await fetch(BASE + '/config');
const etag = first.headers.get('ETag');            // "v1" (with the quotes!)
const second = await fetch(BASE + '/config', {
  headers: { 'If-None-Match': etag },
});
console.log(second.status);                        // prints: 304
```

Notice two details:

- `304` is **not** an error and `res.ok` is `false` for it (`ok` means 200 to 299). Check `res.status === 304` explicitly, before the generic error handling.
- A `304` has no body, so `res.json()` would throw `SyntaxError: Unexpected end of JSON input`. Use your stored copy instead.

A small cache object makes the pattern reusable:

```js
const cache = { etag: null, data: null };
async function getConfig() {
  const headers = {};
  if (cache.etag) headers['If-None-Match'] = cache.etag;
  const res = await fetch(BASE + '/config', { headers });
  if (res.status === 304) return cache.data;
  cache.etag = res.headers.get('ETag');
  cache.data = await res.json();
  return cache.data;
}
```

## Real browsers do this for you

When you call `fetch` in a real browser, the HTTP cache already stores `Cache-Control` responses and sends `If-None-Match` automatically. Writing it by hand is still valuable: server-side scripts, mobile apps and small clients have no such cache, and understanding the headers helps you debug what the browser does.

## Cache pitfalls and design

- **What to cache:** data that rarely changes (settings, countries, product lists). Not user-specific secrets on shared caches, and not data that must always be live.
- **Cache invalidation** is famously hard: if a `PUT` changes the data, your cached copy is stale. A new ETag solves it, because the next conditional request returns `200`.
- **Weak vs strong ETags.** A value like `W/"v1"` is a *weak* validator: "equivalent enough". Treat the ETag as an opaque string and send it back unchanged.

> **Watch out:**
> - **Dropping the quotes.** The ETag value is `"v1"` including the double quotes. Sending `v1` does not match, and you get a full `200` every time.
> - **Calling `res.json()` on a 304.** There is no body: `SyntaxError: Unexpected end of JSON input`. Return the cached data.
> - **Treating 304 as a failure** because `res.ok` is false. Test for `304` before the error check.
> - **Forgetting to update the cache** when you get a `200`: the next conditional request would still use the old ETag and keep receiving full responses.
> - **Caching responses to POST, PUT or DELETE.** Only safe, repeatable reads (usually `GET`) are cached.

## Going further

Add a `Date.now()` timestamp to the cache and honour `max-age=60`: skip the request entirely while the copy is fresh, and send a conditional request only after it expires.

> **Your turn:** fetch `/config` and print the status, `ETag` and `Cache-Control`. Repeat it with `If-None-Match` to see the `304` and its empty body, then with a wrong ETag. Finally write `getConfig()` with a small cache and call it three times.
