---
title: Testing async code
summary: Test promises and async/await functions with await, .resolves and .rejects, and avoid tests that pass by accident.
level: intermediate
runner: js
files:
  - name: profile.test.js
    code: |
      const { getUserName } = require("./profile");

      describe("getUserName", () => {
        it("returns the name from a fake response", async () => {
          // A fake fetch function that answers with a ready-made response.
          const fakeFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ name: "Test User" }),
          });
          const name = await getUserName(1, fakeFetch);
          expect(name).toBe("Test User");
          expect(fakeFetch).toHaveBeenCalledWith("https://api.academy.test/users/1");
        });

        it("resolves with the real name from the practice API", async () => {
          await expect(getUserName(1)).resolves.toBe("Ada Lovelace");
        });

        it("rejects with the original error when the network fails", async () => {
          const brokenFetch = jest.fn().mockRejectedValue(new Error("network down"));
          await expect(getUserName(1, brokenFetch)).rejects.toThrow("network down");
        });

        // Your turn: replace this todo with a real test (use the real API, no fake).
        // User 99 does not exist, so the promise must reject with the message  User 99 not found
        it.todo("rejects with a clear message for an unknown user");
      });
  - name: profile.js
    code: |
      // Loads one user from the practice API and returns the name.
      // fetchFn can be replaced in tests, by default it is the real fetch.
      // The tests fail because two awaits are missing. Find them.
      const BASE = "https://api.academy.test";

      async function getUserName(id, fetchFn = fetch) {
        const response = fetchFn(`${BASE}/users/${id}`);
        if (!response.ok) {
          throw new Error(`User ${id} not found`);
        }
        const user = response.json();
        return user.name;
      }

      module.exports = { getUserName };
check:
  output: |
    getUserName
      ✓ returns the name from a fake response
      ✓ resolves with the real name from the practice API
      ✓ rejects with the original error when the network fails
      ✓ rejects with a clear message for an unknown user

    Tests: 4 passed, 4 total
  code:
    - file: profile.js
      pattern: 'await\s+fetchFn\s*\('
      message: "fetchFn(...) returns a promise: put await in front of it."
    - file: profile.js
      pattern: 'await\s+response\.json\s*\('
      message: "response.json() also returns a promise: await it."
    - file: profile.test.js
      pattern: 'it\(\s*"rejects with a clear message for an unknown user"'
      message: "Replace it.todo with it(...) for the unknown user test."
    - file: profile.test.js
      pattern: '\.rejects\.toThrow\('
      message: "Use await expect(...).rejects.toThrow(\"User 99 not found\")."
hints:
  - "An async function always returns a promise, and so do fetch and response.json(). If you forget await, you get the promise itself instead of the value, and response.ok is undefined. Add await in two places in profile.js."
  - "const response = await fetchFn(...);   const user = await response.json();   For the new test: make the arrow function async and put await in front of expect(...)."
  - "it(\"rejects with a clear message for an unknown user\", async () => { await expect(getUserName(99)).rejects.toThrow(\"User 99 not found\"); });"
solution:
  - name: profile.test.js
    code: |
      const { getUserName } = require("./profile");

      describe("getUserName", () => {
        it("returns the name from a fake response", async () => {
          const fakeFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ name: "Test User" }),
          });
          const name = await getUserName(1, fakeFetch);
          expect(name).toBe("Test User");
          expect(fakeFetch).toHaveBeenCalledWith("https://api.academy.test/users/1");
        });

        it("resolves with the real name from the practice API", async () => {
          await expect(getUserName(1)).resolves.toBe("Ada Lovelace");
        });

        it("rejects with the original error when the network fails", async () => {
          const brokenFetch = jest.fn().mockRejectedValue(new Error("network down"));
          await expect(getUserName(1, brokenFetch)).rejects.toThrow("network down");
        });

        it("rejects with a clear message for an unknown user", async () => {
          await expect(getUserName(99)).rejects.toThrow("User 99 not found");
        });
      });
  - name: profile.js
    code: |
      const BASE = "https://api.academy.test";

      async function getUserName(id, fetchFn = fetch) {
        const response = await fetchFn(`${BASE}/users/${id}`);
        if (!response.ok) {
          throw new Error(`User ${id} not found`);
        }
        const user = await response.json();
        return user.name;
      }

      module.exports = { getUserName };
quiz:
  - q: "What happens if an async test forgets to await (or return) the promise?"
    options: ["Jest waits automatically anyway", "The test always fails", "The test can finish before the assertion runs, so it may pass even when the code is wrong"]
    answer: 2
    explain: "The test function ends right away. A rejected expectation that comes later is lost, which makes the test a false positive."
  - q: "Which line correctly tests that a promise rejects with the message \"nope\"?"
    options: ["expect(load()).toThrow(\"nope\")", "await expect(load()).rejects.toThrow(\"nope\")", "expect(await load()).toBe(\"nope\")"]
    answer: 1
  - q: "What does jest.fn().mockResolvedValue(5) create?"
    options: ["A fake function that returns a promise which resolves to 5", "A fake function that returns 5 directly", "A fake function that rejects with 5"]
    answer: 0
  - q: "Why do tests often avoid the real network and use a fake fetch instead?"
    options: ["Fakes make the tests fast, deterministic and independent of a server being up", "The real fetch does not exist", "Fake responses are always more correct"]
    answer: 0
---
Most real programs wait for things: a network answer, a file, a timer. That makes their functions **asynchronous**, and asynchronous code needs a little extra care in tests. If you do it wrong, you get the worst kind of test: one that **passes even when the code is broken**. In this lesson you will learn the safe patterns.

## An async test is an async function

A test can be an `async` function. Jest waits until the promise returned by the test function is settled before it moves on, so inside you can simply use `await`:

```js
async function addLater(a, b) {
  return a + b;           // an async function always returns a promise
}

it("adds later", async () => {
  const result = await addLater(2, 3);
  expect(result).toBe(5);
});
```

Without the `await`, `result` would be a promise object and `toBe(5)` would fail. That failing test is annoying but honest.

## .resolves and .rejects

`expect` can look inside a promise for you:

```js
it("resolves with 5", async () => {
  await expect(addLater(2, 3)).resolves.toBe(5);
});

it("rejects with an error", async () => {
  await expect(failLater()).rejects.toThrow("boom");
});
```

* `.resolves` waits for the promise to **fulfil** and then applies the matcher to the value.
* `.rejects` waits for it to **fail** and applies the matcher to the error. `toThrow("boom")` checks the message contains `boom`.

The `await` in front of `expect` is **required**. The matcher itself returns a promise. If you do not wait for it, the test ends first.

## The false positive trap

Look at this broken test:

```js
it("rejects for a missing user", () => {
  expect(getUserName(99)).rejects.toThrow("anything");   // no await, no return
});
```

The test function returns immediately, so the runner marks the test as passed. The assertion may run later, fail silently, and nobody notices. **Rule:** in an async test, every `expect(...).resolves/rejects` line starts with `await` (or is returned with `return`).

You can protect yourself further with `expect.assertions(n)` in real Jest, which fails the test if fewer than `n` assertions ran.

## Fake the network

Real network calls are slow and can fail for reasons that have nothing to do with your code. In unit tests you usually replace them. Two helpers on a mock function do that:

```js
const ok = jest.fn().mockResolvedValue({ name: "Ada" });          // returns Promise.resolve(...)
const bad = jest.fn().mockRejectedValue(new Error("offline"));    // returns Promise.reject(...)
```

Because `getUserName` takes the fetch function as a parameter (with the real `fetch` as default), a test can hand in a fake. A good test suite covers three cases for every async function: **success**, **the server says no** (for example a 404) and **the network itself fails**.

In this practice area the address `https://api.academy.test` is a built-in practice server, so the real-fetch tests are fast and always give the same answer. A real project would test against a local test server or use only fakes.

## Timers

Timers make tests slow if you really wait for them. Tiny waits (`setTimeout(r, 10)`) are fine in a lesson. In real Jest you would use `jest.useFakeTimers()` to move the clock forward instantly; that part is not available in this practice area.

> **Watch out:**
> * **Missing `await` in the code under test.** `const response = fetch(url)` gives you a promise, and `response.ok` is `undefined` (it does not throw). The bug is in `profile.js` of this lesson: the tests catch it.
> * **Missing `async` on the test.** `await` inside a normal function is a `SyntaxError: await is only valid in async functions and the top level bodies of modules`.
> * **Mixing `.rejects` and `try/catch`.** Pick one style per test. If you use `try/catch` and the code does not throw, the `catch` never runs and the test passes unnoticed.
> * **Tests that depend on the real clock or a live server.** They fail at random. Fake or control those parts.

> **Your turn:** Find the two missing `await` keywords in `profile.js`. Then replace `it.todo(...)` in `profile.test.js` with a real async test, with the same name, that checks `getUserName(99)` rejects with the message `User 99 not found`. All 4 tests must pass.
