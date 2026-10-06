---
title: Promises and async patterns
summary: Run tasks in parallel with Promise.all and race, handle failures, retry flaky work and add timeouts.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      // Two helpers (already written): a promise that resolves after ms, and one that rejects.
      const delay = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
      const fail = (ms, message) =>
        new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

      // 1. Start delay(60, "A"), delay(20, "B") and delay(40, "C") TOGETHER with
      //    Promise.all and wait for them. Print "all: " followed by the results joined with no separator.

      // 2. Do the same three with Promise.race and print "race: " plus the winner.

      // 3. Run [delay(10, "ok"), fail(20, "boom")] with Promise.allSettled.
      //    For each result print "fulfilled <value>" or "rejected <error message>".

      // 4. A flaky function that fails twice, then works (already written):
      let tries = 0;
      async function flaky() {
        tries++;
        await delay(5);
        if (tries < 3) throw new Error("try " + tries + " failed");
        return "success after " + tries;
      }
      // Write async function retry(fn, attempts): call fn() up to attempts times.
      // When a call throws, print "caught: " plus the error message and try again.
      // If the LAST attempt fails too, throw the error. Return the first success.
      console.log(await retry(flaky, 5));

      // 5. Write withTimeout(promise, ms): a promise that behaves like the original,
      //    but rejects with the message "timeout" if it takes longer than ms.
      //    Hint: race the promise against fail(ms, "timeout").
      try {
        await withTimeout(delay(100, "slow"), 30);
      } catch (error) {
        console.log("error: " + error.message);
      } finally {
        console.log("done");
      }
      console.log(await withTimeout(delay(10, "fast"), 50));
check:
  output: |
    all: ABC
    race: B
    fulfilled ok
    rejected boom
    caught: try 1 failed
    caught: try 2 failed
    success after 3
    error: timeout
    done
    fast
  code:
    - pattern: 'Promise\.all\s*\('
      message: "Use Promise.all([...])."
    - pattern: 'Promise\.race\s*\('
      message: "Use Promise.race([...])."
    - pattern: 'Promise\.allSettled\s*\('
      message: "Use Promise.allSettled([...])."
    - pattern: 'throw\s+error'
      message: "On the last failed attempt, re-throw the error with throw error."
hints:
  - "Promise.all, race and allSettled each take an ARRAY of promises, and each returns one promise you can await. Create the promises first (so they start together), do not await them one by one."
  - "const all = await Promise.all([delay(60, \"A\"), delay(20, \"B\"), delay(40, \"C\")]);   retry uses a for loop with try { return await fn(); } catch (error) { ...print... ; if (last attempt) throw error; }   withTimeout returns Promise.race([promise, fail(ms, \"timeout\")])"
  - "async function retry(fn, attempts) { for (let i = 1; i <= attempts; i++) { try { return await fn(); } catch (error) { console.log(\"caught: \" + error.message); if (i === attempts) throw error; } } }   function withTimeout(promise, ms) { return Promise.race([promise, fail(ms, \"timeout\")]); }"
solution:
  - name: main.js
    code: |
      const delay = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
      const fail = (ms, message) =>
        new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

      const all = await Promise.all([delay(60, "A"), delay(20, "B"), delay(40, "C")]);
      console.log("all: " + all.join(""));

      const first = await Promise.race([delay(60, "A"), delay(20, "B"), delay(40, "C")]);
      console.log("race: " + first);

      const results = await Promise.allSettled([delay(10, "ok"), fail(20, "boom")]);
      for (const r of results) {
        console.log(r.status === "fulfilled" ? "fulfilled " + r.value : "rejected " + r.reason.message);
      }

      let tries = 0;
      async function flaky() {
        tries++;
        await delay(5);
        if (tries < 3) throw new Error("try " + tries + " failed");
        return "success after " + tries;
      }

      async function retry(fn, attempts) {
        for (let i = 1; i <= attempts; i++) {
          try {
            return await fn();
          } catch (error) {
            console.log("caught: " + error.message);
            if (i === attempts) throw error;
          }
        }
      }
      console.log(await retry(flaky, 5));

      function withTimeout(promise, ms) {
        return Promise.race([promise, fail(ms, "timeout")]);
      }
      try {
        await withTimeout(delay(100, "slow"), 30);
      } catch (error) {
        console.log("error: " + error.message);
      } finally {
        console.log("done");
      }
      console.log(await withTimeout(delay(10, "fast"), 50));
quiz:
  - q: "What does Promise.all([p1, p2]) do if p2 rejects?"
    options: ["It waits for p1 and returns both results anyway", "It rejects as soon as one of the promises rejects", "It ignores the rejection"]
    answer: 1
  - q: Which tool tells you the outcome of EVERY promise, even when some fail?
    options: ["Promise.race", "Promise.all", "Promise.allSettled"]
    answer: 2
  - q: "Three tasks of 100 ms each. About how long do they take with await task() three times in a row, compared with Promise.all?"
    options: ["300 ms in a row, about 100 ms with Promise.all", "100 ms in both cases", "300 ms in both cases"]
    answer: 0
  - q: What does Promise.race([work, timer]) resolve or reject with?
    options: ["The result of whichever settles last", "The result of whichever promise settles first", "Always the work result"]
    answer: 1
---

Basic async/await lets you wait for one thing. Real programs juggle many: load a user, their posts and their settings at once, give up if a server is too slow, try again when a network call fails. JavaScript's Promise tools make these patterns short and readable.

## Sequential or parallel?

Awaiting in a row makes each task start only after the previous finished:

```js
const a = await delay(100, "A");
const b = await delay(100, "B"); // starts after A: 200 ms total
```

If the tasks do not depend on each other, start them all first and wait for the group. `Promise.all` takes an array of promises and returns one promise that resolves with an array of results **in the same order**:

```js
const [a, b] = await Promise.all([delay(100, "A"), delay(100, "B")]); // about 100 ms
```

Notice the results come in the order you listed them, not the order they finished. If **any** promise rejects, `Promise.all` rejects immediately with that error.

## The other combinators

| Function | Resolves when | Result |
| --- | --- | --- |
| `Promise.all(list)` | all fulfil (rejects if one rejects) | array of values |
| `Promise.allSettled(list)` | all have finished, success or not | array of `{ status, value / reason }` |
| `Promise.race(list)` | the first one settles | that one's value or error |
| `Promise.any(list)` | the first one fulfils | that value (rejects only if all fail) |

`allSettled` never rejects. Each entry looks like `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`, so you can report partial success:

```js
const results = await Promise.allSettled([loadA(), loadB()]);
for (const r of results) {
  console.log(r.status === "fulfilled" ? r.value : r.reason.message);
}
```

## Error handling with try, catch, finally

With `await`, a rejected promise becomes a normal thrown error, so you use the `try/catch` you already know. `finally` runs in both cases, which is ideal for clean-up like hiding a loading spinner:

```js
try {
  const data = await load();
} catch (error) {
  console.log("failed: " + error.message);
} finally {
  console.log("done");
}
```

## Retrying

Networks are flaky. A retry helper loops, catching failures until one call succeeds or the attempts run out:

```js
async function retry(fn, attempts) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts) throw error; // out of attempts: give up
    }
  }
}
```

The `await` inside `return await fn()` matters: without it a rejection would escape the `try` block before the `catch` could see it. Real code often waits a little longer after each failure (a "backoff").

## Timeouts with race

A promise has no built-in time limit. Add one by racing it against a timer that rejects:

```js
function withTimeout(promise, ms) {
  return Promise.race([promise, fail(ms, "timeout")]);
}
```

Whichever settles first wins. Note that the losing work is not cancelled, it just no longer matters to you.

## Deterministic timers

Timing code is tricky to test, so in this lesson the delays are chosen with large gaps (20, 40, 60 ms). The *order* then never depends on how busy the computer is, and the output is always the same. In your own tests, prefer fake delays like these over the real network.

> **Watch out:**
> - `await` inside a `forEach` or `map` callback does not wait for the whole loop. Use `for...of` for sequential work, or `await Promise.all(items.map(async (x) => ...))` for parallel work.
> - Passing already-awaited values instead of promises: `Promise.all([await a(), await b()])` runs them in sequence, which defeats the purpose.
> - An unhandled rejection: a failing promise that nobody awaits or catches shows `Unhandled promise rejection`. Always `await` it or add `.catch(...)`.
> - Forgetting `await` before a promise-returning function inside `try`. The error escapes the `catch` because the failure happens later.
> - `Promise.all` with an object instead of an array: `TypeError: object is not iterable`.

## Going further

Make `retry` wait `delay(10 * i)` between attempts. Try `Promise.any` with a list where the first two promises fail and the third succeeds.

> **Your turn:** use `Promise.all`, `Promise.race` and `Promise.allSettled` on the delay helpers, write `retry(fn, attempts)` with try/catch, and write `withTimeout(promise, ms)` using `Promise.race`.
