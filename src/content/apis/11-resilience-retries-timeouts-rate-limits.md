---
title: "Resilience: retries, timeouts and rate limits"
summary: Survive flaky and slow servers with exponential backoff, AbortController timeouts, and respect for 429 Too Many Requests.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // PART 1: retries with exponential backoff.
      // /flaky answers 503 twice and then 200.
      // Write fetchWithRetry(url, { retries = 3, baseDelay = 20 } = {}):
      //   - loop with attempt = 1, 2, 3, ...
      //   - fetch the url and print "attempt N: STATUS"
      //   - if the status is below 500, or no retries are left, return the response
      //   - otherwise wait baseDelay * 2 ** (attempt - 1) milliseconds (20, 40, 80 ...) and loop
      // Then call it for BASE + '/flaky' and print "result: " + the message in the JSON body.


      // PART 2: a timeout with AbortController.
      // /slow needs about 300 ms. Write fetchWithTimeout(url, ms):
      //   - create a new AbortController and call controller.abort() after ms
      //     milliseconds (setTimeout)
      //   - give controller.signal to fetch: fetch(url, { signal: controller.signal })
      //   - also make a "timedOut" promise that REJECTS with
      //     new Error('Timed out after ' + ms + ' ms') when the signal fires
      //     (controller.signal.addEventListener('abort', ...))
      //   - return Promise.race([the fetch, timedOut]) and clear the timer when it settles
      // Call it for /slow with 100 ms inside try/catch and print "timeout: " + error.message
      // Then call it for /slow with 1000 ms and print "fast enough: " + the JSON message.


      // PART 3: rate limits. /limited allows 3 calls, then answers 429 with a Retry-After header.
      // Call BASE + '/limited' four times in a loop (i = 1 to 4). Print one line each:
      //   when ok:      "1: 200 remaining=2"   (header X-RateLimit-Remaining)
      //   when limited: "4: 429 retry-after=30" (header Retry-After)
check:
  output: |
    attempt 1: 503
    attempt 2: 503
    attempt 3: 200
    result: Success on attempt 3
    timeout: Timed out after 100 ms
    fast enough: That took a while
    1: 200 remaining=2
    2: 200 remaining=1
    3: 200 remaining=0
    4: 429 retry-after=30
  code:
    - { pattern: 'AbortController', message: "Use an AbortController for the timeout." }
    - { pattern: '\.abort\(\)', message: "Call controller.abort() when the time is up." }
    - { pattern: 'signal', message: "Pass controller.signal to fetch." }
    - { pattern: '\*\*|Math\.pow', message: "Double the delay each attempt (exponential backoff), for example baseDelay * 2 ** (attempt - 1)." }
    - { pattern: 'Retry-After', message: "Read the Retry-After header on a 429." }
hints:
  - "Retry only when it can help: 5xx answers and network errors are temporary, 4xx answers are not. Backoff means each wait is twice as long as the previous (20, 40, 80 ...). For the timeout, an AbortController gives you a signal and an abort() method; a setTimeout calls abort() after ms."
  - "async function fetchWithRetry(url, { retries = 3, baseDelay = 20 } = {}) { for (let attempt = 1; ; attempt++) { const res = await fetch(url); console.log('attempt ' + attempt + ': ' + res.status); if (res.status < 500 || attempt > retries) return res; await sleep(baseDelay * 2 ** (attempt - 1)); } }"
  - "function fetchWithTimeout(url, ms) { const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), ms); const timedOut = new Promise((_, reject) => { controller.signal.addEventListener('abort', () => reject(new Error('Timed out after ' + ms + ' ms'))); }); return Promise.race([fetch(url, { signal: controller.signal }), timedOut]).finally(() => clearTimeout(timer)); }"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      async function fetchWithRetry(url, { retries = 3, baseDelay = 20 } = {}) {
        for (let attempt = 1; ; attempt++) {
          const res = await fetch(url);
          console.log('attempt ' + attempt + ': ' + res.status);
          if (res.status < 500 || attempt > retries) return res;
          await sleep(baseDelay * 2 ** (attempt - 1));
        }
      }
      const flaky = await fetchWithRetry(BASE + '/flaky');
      console.log('result: ' + (await flaky.json()).message);

      function fetchWithTimeout(url, ms) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        const timedOut = new Promise((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error('Timed out after ' + ms + ' ms'));
          });
        });
        return Promise.race([fetch(url, { signal: controller.signal }), timedOut]).finally(() =>
          clearTimeout(timer)
        );
      }
      try {
        await fetchWithTimeout(BASE + '/slow', 100);
      } catch (error) {
        console.log('timeout: ' + error.message);
      }
      const quick = await fetchWithTimeout(BASE + '/slow', 1000);
      console.log('fast enough: ' + (await quick.json()).message);

      for (let i = 1; i <= 4; i++) {
        const res = await fetch(BASE + '/limited');
        if (res.ok) {
          console.log(i + ': ' + res.status + ' remaining=' + res.headers.get('X-RateLimit-Remaining'));
        } else {
          console.log(i + ': ' + res.status + ' retry-after=' + res.headers.get('Retry-After'));
        }
      }
quiz:
  - q: "Which responses are reasonable to retry automatically?"
    options: ["400 and 404, because the request is wrong", "503 and network failures, because they are often temporary", "Every response, as often as possible"]
    answer: 1
  - q: "What is exponential backoff?"
    options: ["Waiting longer after each failed attempt (for example 1 s, 2 s, 4 s) so the server can recover", "Retrying as fast as possible", "Sending the same request to several servers"]
    answer: 0
  - q: "A server answers 429 with Retry-After: 30. What should a polite client do?"
    options: ["Retry immediately, three times", "Wait about 30 seconds before calling again", "Switch to a POST request"]
    answer: 1
  - q: "Why is retrying a POST that created something risky?"
    options: ["POST cannot be retried by the browser", "The first attempt may have worked, so a retry can create a duplicate", "POST is not allowed to fail"]
    answer: 1
    explain: "Safe to retry: GET, PUT, DELETE (idempotent). For POST you need an idempotency key or a check first."
---

Servers get overloaded, networks drop packets, and some requests simply take too long. A program that gives up on the first hiccup is brittle; one that retries forever is a nuisance. In this lesson you build the three tools that sit between those extremes: **retries with backoff**, **timeouts**, and **respect for rate limits**.

## Retries with exponential backoff

The practice endpoint `/flaky` is a tiny disaster simulator: its first two answers are `503 Service Unavailable`, and the third works.

```
GET /flaky  ->  503 {"error":"Temporarily unavailable, try again","attempt":1}   Retry-After: 1
GET /flaky  ->  503 {"error":"Temporarily unavailable, try again","attempt":2}
GET /flaky  ->  200 {"message":"Success on attempt 3"}
```

A `503` is a *temporary* problem, so trying again is sensible. But not blindly:

- **Retry only what can improve.** `5xx` and network failures: yes. `400`, `401`, `403`, `404`, `422`: no, the same request will fail the same way.
- **Limit the attempts.** Three or four retries, then report the failure.
- **Wait between attempts, and wait longer each time.** This is **exponential backoff**: 20 ms, 40 ms, 80 ms... (in real life 1 s, 2 s, 4 s...). If a thousand clients retry at the same instant, they would knock the recovering server over again; spreading the retries out gives it room.

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let attempt = 1; ; attempt++) {
  const res = await fetch(url);
  if (res.status < 500 || attempt > retries) return res;
  await sleep(baseDelay * 2 ** (attempt - 1)); // 2 ** n means 2 to the power n
}
```

The `Retry-After` response header (here `1`, meaning one second) is the server telling you how long to wait. A careful client prefers it over its own guess. Real systems also add a little random "jitter" to the delay so clients do not retry in lockstep.

## Timeouts with AbortController

`fetch` has no built-in time limit: a hung server could make your program wait for minutes. An `AbortController` lets you pull the plug:

```js
const controller = new AbortController();
setTimeout(() => controller.abort(), 100);          // after 100 ms: cancel
const res = await fetch(url, { signal: controller.signal });
```

`controller.signal` is handed to `fetch`; calling `controller.abort()` tells it to stop. In a real browser the pending `fetch` then rejects with an error named `AbortError`, and you catch it with `try/catch`.

> **A note about the practice server.** It is a simulation that lives inside this page and does not watch the signal, so in this course `fetch` alone would keep waiting for the full 300 ms. To make the timeout work everywhere, the exercise also listens for the `abort` event and rejects a promise of its own, then uses `Promise.race` (whichever settles first wins). The pattern is correct for real servers too.

Remember to `clearTimeout` when the request finishes in time, otherwise the timer fires later for nothing.

## Rate limits

APIs protect themselves by limiting how often you may call them. `/limited` allows three calls and then refuses:

```
HTTP/1.1 200 OK
X-RateLimit-Remaining: 0          <- the fourth call is not allowed

HTTP/1.1 429 Too Many Requests
Retry-After: 30                   <- try again in 30 seconds
```

`429` is the standard status for "slow down". Good clients read `X-RateLimit-Remaining` to slow down *before* the limit, and obey `Retry-After` after hitting it. Hammering a rate-limited API in a loop usually leads to longer bans.

## Putting it together

A robust client combines the three ideas: a timeout per attempt, retries with backoff for `5xx` and timeouts, and a stop (or a long wait) on `429`. In lesson 10 you wrote `request()`; adding `retries` and `timeout` options to it is the natural next step.

> **Watch out:**
> - **Retrying forever.** Always set a maximum number of attempts; `while (true)` without an exit hangs your program.
> - **Retrying non-idempotent calls.** A `POST` that timed out may have succeeded. Retrying can create duplicates (lesson 9).
> - **Retrying client errors.** A `404` or `422` will never succeed on its own, so retrying only wastes time.
> - **Forgetting `clearTimeout`.** The abort timer then fires after a successful request and can cancel nothing, or keep your script alive.
> - **Creating a promise that rejects unhandled.** If `timedOut` rejects after the race is over you may see `Uncaught (in promise)`; in this lesson the race settles first, so the rejection is handled.
> - **Ignoring `Retry-After`.** The server's hint is more reliable than a fixed delay.

## Going further

Make `fetchWithRetry` stop immediately on a `429`, and add random jitter: `delay + Math.random() * 10`. Think about how you would make a `POST` safe to retry.

> **Your turn:** write `fetchWithRetry` (exponential backoff for `5xx`), write `fetchWithTimeout` with an `AbortController`, and print the status and rate-limit headers of four calls to `/limited`.
