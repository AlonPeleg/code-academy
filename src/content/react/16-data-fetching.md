---
title: Data fetching with loading and error states
summary: Load data from an API with fetch inside useEffect and show loading, error and success screens.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';

      const API = "https://api.academy.test";

      // Loader fetches a URL and decides what to show: loading, error or the data.
      function Loader({ url, render }) {
        const [status, setStatus] = useState("loading");   // "loading" | "success" | "error"
        const [data, setData] = useState(null);
        const [error, setError] = useState("");

        // 1. Add an effect that runs when url changes.
        //    - request the url with fetch
        //    - if the response is not ok, throw new Error("HTTP " + response.status)
        //    - otherwise read the JSON, store it with setData and set the status to "success"
        //    - on any failure store error.message with setError and set the status to "error"
        //    - return a cleanup function that makes a flag "cancelled" true, and ignore
        //      the result of a request when cancelled is true.

        if (status === "loading") return <p>Loading...</p>;
        // 2. When the status is "error", show a paragraph: Error: <the message>
        // 3. Otherwise show render(data).
        return <p>Nothing yet</p>;
      }

      function App() {
        return (
          <div>
            <h2>Editors</h2>
            <Loader
              url={API + "/users?role=editor"}
              render={(users) => (
                <ul>
                  {users.map((u) => (
                    <li key={u.id}>{u.name}</li>
                  ))}
                </ul>
              )}
            />
            <h2>Missing user</h2>
            <Loader url={API + "/users/99"} render={(user) => <p>{user.name}</p>} />
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["ul > li"]
    text: ["Grace Hopper", "Katherine Johnson", "Error: HTTP 404"]
  code:
    - pattern: "fetch\\s*\\(\\s*url"
      message: "Call fetch(url) inside the effect."
    - pattern: "useEffect\\s*\\("
      message: "Load the data inside useEffect(...)."
    - pattern: "response\\.ok|res\\.ok"
      message: "Check response.ok, because fetch does not fail on a 404."
    - pattern: "\\.catch\\s*\\(|catch\\s*\\("
      message: "Handle failures with .catch(...) or try / catch."
    - pattern: "\\}\\s*,\\s*\\[\\s*url\\s*\\]"
      message: "Add the dependency list:  }, [url]);"
hints:
  - "A request has three phases, so keep a status in state: loading first, then success or error. Start the request in useEffect with [url] as dependencies, and check response.ok yourself, because fetch only rejects on network failures."
  - "fetch(url).then(response => { if (!response.ok) throw new Error('HTTP ' + response.status); return response.json(); }).then(json => { setData(json); setStatus('success'); }).catch(err => { setError(err.message); setStatus('error'); }). Return () => { cancelled = true } and test the flag before each setState."
  - "useEffect(() => { let cancelled = false; fetch(url).then((response) => { if (!response.ok) throw new Error(\"HTTP \" + response.status); return response.json(); }).then((json) => { if (!cancelled) { setData(json); setStatus(\"success\"); } }).catch((err) => { if (!cancelled) { setError(err.message); setStatus(\"error\"); } }); return () => { cancelled = true; }; }, [url]);   if (status === \"error\") return <p>Error: {error}</p>;   return render(data);"
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';

      const API = "https://api.academy.test";

      function Loader({ url, render }) {
        const [status, setStatus] = useState("loading");
        const [data, setData] = useState(null);
        const [error, setError] = useState("");

        useEffect(() => {
          let cancelled = false;
          setStatus("loading");
          fetch(url)
            .then((response) => {
              if (!response.ok) throw new Error("HTTP " + response.status);
              return response.json();
            })
            .then((json) => {
              if (!cancelled) {
                setData(json);
                setStatus("success");
              }
            })
            .catch((err) => {
              if (!cancelled) {
                setError(err.message);
                setStatus("error");
              }
            });
          return () => {
            cancelled = true;
          };
        }, [url]);

        if (status === "loading") return <p>Loading...</p>;
        if (status === "error") return <p>Error: {error}</p>;
        return render(data);
      }

      function App() {
        return (
          <div>
            <h2>Editors</h2>
            <Loader
              url={API + "/users?role=editor"}
              render={(users) => (
                <ul>
                  {users.map((u) => (
                    <li key={u.id}>{u.name}</li>
                  ))}
                </ul>
              )}
            />
            <h2>Missing user</h2>
            <Loader url={API + "/users/99"} render={(user) => <p>{user.name}</p>} />
          </div>
        );
      }

      export default App;
quiz:
  - q: Why do we keep a status ("loading", "success", "error") in state?
    options: ["Because fetch requires it", "So the component can show the right screen for each phase of the request", "To make the request faster"]
    answer: 1
  - q: Does fetch reject its promise when the server answers 404?
    options: ["Yes, always", "Only for 500 errors", "No, it only rejects on network failures, so you must check response.ok"]
    answer: 2
    explain: "A 404 is still a complete HTTP answer. That is why we throw our own Error when response.ok is false."
  - q: What is the cleanup function (the cancelled flag) protecting you from?
    options: ["Updating state with the result of an old request after the component changed or disappeared", "Slow typing", "Memory leaks in the server"]
    answer: 0
  - q: Why is the dependency array [url] and not []?
    options: ["An empty array is a syntax error with fetch", "So that it runs on every render", "The effect should load again when url changes"]
    answer: 2
---

Almost every real app shows data that lives on a server: users, products, messages. Loading data takes time and can fail, so a good component handles **three situations**: still loading, failed, and done. This lesson shows the standard recipe with `fetch` and `useEffect`.

## The practice API

Our lessons include a pretend server at `https://api.academy.test`. It answers `fetch` calls inside the preview, with no internet needed:

- `/users` returns a list of five people, `/users?role=editor` filters it.
- `/users/2` returns one user, and `/users/99` answers with status **404** (not found).

## The shape of a request in React

```jsx
const [status, setStatus] = useState("loading");
const [data, setData] = useState(null);
const [error, setError] = useState("");

useEffect(() => {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then((json) => { setData(json); setStatus("success"); })
    .catch((err) => { setError(err.message); setStatus("error"); });
}, [url]);
```

Taking it apart:

1. **Three pieces of state** describe the request: where it is (`status`), what came back (`data`), what went wrong (`error`).
2. It lives in **`useEffect`**, because a request is a side effect: it talks to the world outside React. The effect runs after the first render, so the page first shows `Loading...`.
3. **`fetch(url)`** returns a promise for the response. The first `.then` checks `response.ok` (true for status 200 to 299). This check is essential: `fetch` only rejects for network failures such as being offline. A 404 or 500 is still a complete answer, so we **throw our own error** to jump to `.catch`.
4. **`response.json()`** reads the body and parses it, returning another promise, which the second `.then` receives.
5. **`.catch`** handles anything that went wrong, in either step.
6. **`[url]`** makes the effect run again if the address changes.

## Rendering each phase

```jsx
if (status === "loading") return <p>Loading...</p>;
if (status === "error") return <p>Error: {error}</p>;
return <ul>{data.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
```

Early `return` statements keep the happy path simple. By the time the last line runs, `data` is certain to be there.

## async / await version

You may prefer `async` and `await`. The effect function itself cannot be `async` (it must return nothing or a cleanup function), so define a function inside and call it:

```jsx
useEffect(() => {
  async function load() {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("HTTP " + response.status);
      setData(await response.json());
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }
  load();
}, [url]);
```

## Race conditions and cleanup

If `url` changes quickly (the user clicks through many items), the answer of an old, slow request could arrive after a newer one and overwrite it. The standard fix is a flag that the **cleanup function** flips:

```jsx
useEffect(() => {
  let cancelled = false;
  fetch(url).then(...).then((json) => { if (!cancelled) setData(json); });
  return () => { cancelled = true; };   // runs before the next effect, or on unmount
}, [url]);
```

Once this logic exists in one place, move it into a custom hook, `useFetch(url)`, that returns `{ status, data, error }`, and every component can load data in a single line.

> **Watch out:**
> - Forgetting the `response.ok` check, so a 404 body is shown as if it were good data, or `Cannot read properties of undefined` appears.
> - Missing `[url]` (no dependency array): the effect runs after every render, sets state, renders again, and loops forever.
> - Making the effect callback `async`: React warns `An effect function must not return anything besides a function`.
> - Reading `data.name` before the data has arrived. Always handle the loading state first.
> - Real servers on other domains may block your request (CORS). The practice API does not.

> **Your turn:** in `Loader`, add the effect with `fetch(url)`, check `response.ok`, set `data` and the status, handle failures and return the cleanup. Show `Error: ...` for the error status and `render(data)` on success. The page should list the two editors and show `Error: HTTP 404` for the missing user.
