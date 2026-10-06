---
title: 'Step 3: Handle errors and add a Retry button'
summary: Check res.ok, show an error screen and let the user try again, using a switch that breaks the first request on purpose.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 3: an error state with a Retry button.
      const API = 'https://api.academy.test';

      // Testing switch: when true, the FIRST request goes to /error/500 on purpose,
      // so you can see how the app behaves when the server is broken.
      const FAIL_FIRST_TRY = true;

      // TODO 1: replace  loading  by a status state: 'loading' | 'error' | 'ready'.
      //         Add state for the error message (error) and a counter attempt that starts at 0.
      // TODO 2: in the effect choose the URL:
      //         FAIL_FIRST_TRY && attempt === 0  ->  API + '/error/500',  otherwise  API + '/users'.
      //         A server error is NOT a failed promise: check  if (!res.ok)  and throw
      //         new Error('HTTP ' + res.status). Add .catch(...) that stores err.message and sets status 'error'.
      // TODO 3: the effect must run again when attempt changes: use [attempt] as the dependency array.
      // TODO 4: render three cases (loading, error, ready). For the error show
      //         <div className="error" role="alert"> with the text  Could not load people: <message>
      //         and a button with className="retry" and the text Retry that does setAttempt(attempt + 1).

      function App() {
        const [people, setPeople] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
          let cancelled = false;

          fetch(API + '/users')
            .then((res) => res.json())
            .then((data) => {
              if (!cancelled) {
                setPeople(data);
                setLoading(false);
              }
            });

          // cleanup: ignore the answer if the component disappeared meanwhile
          return () => {
            cancelled = true;
          };
        }, []);

        return (
          <main className="app">
            <h1>People Directory</h1>

            {loading ? (
              <p className="loading">Loading people...</p>
            ) : (
              <>
                <p className="count">{people.length} people</p>
                <ul className="people">
                  {people.map((person) => (
                    <li key={person.id} className="person">
                      <div className="person-row">
                        <div className="who">
                          <strong>{person.name}</strong>
                          <span className="email">{person.email}</span>
                        </div>
                        <div className="meta">
                          <span className="badge">{person.role}</span>
                          <span className="city">{person.city}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </main>
        );
      }

      export default App;
  - name: styles.css
    code: |
      /* People Directory: all the styles for the whole project.
         You do not need to write any CSS in this project, the focus is React. */

      :root {
        --bg: #f4f5f7;
        --card: #ffffff;
        --text: #1f2937;
        --muted: #6b7280;
        --primary: #0891b2;
        --border: #d9dde3;
        --danger: #b91c1c;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        line-height: 1.45;
      }

      .app {
        max-width: 920px;
        margin: 0 auto;
        padding: 20px 16px 40px;
      }

      h1 {
        margin: 0 0 4px;
        font-size: 1.7rem;
      }

      h2 {
        margin: 0 0 8px;
        font-size: 1.2rem;
      }

      .count,
      .hint,
      .loading {
        color: var(--muted);
        font-size: 0.95rem;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }

      /* search */
      .search {
        width: 100%;
        margin: 8px 0 4px;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font: inherit;
      }

      /* layout: list on the left, details on the right */
      .layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        margin-top: 8px;
      }

      @media (min-width: 700px) {
        .layout {
          grid-template-columns: 1.2fr 1fr;
          align-items: start;
        }
      }

      /* people list */
      .people {
        margin: 8px 0 0;
        padding: 0;
        list-style: none;
      }

      .person {
        margin-bottom: 8px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--card);
      }

      .person.selected {
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.25);
      }

      .person-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        padding: 12px 14px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
      }

      button.person-row {
        cursor: pointer;
      }

      .who {
        display: flex;
        flex-direction: column;
      }

      .email {
        color: var(--muted);
        font-size: 0.85rem;
      }

      .meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
        font-size: 0.85rem;
      }

      .badge {
        padding: 1px 8px;
        border-radius: 999px;
        background: #e0f2fe;
        color: #075985;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
      }

      .city {
        color: var(--muted);
      }

      /* states */
      .error {
        padding: 12px 14px;
        border: 1px solid #fecaca;
        border-radius: 10px;
        background: #fef2f2;
        color: var(--danger);
      }

      .error p {
        margin: 0 0 8px;
      }

      .retry,
      .pager button,
      .city-form button {
        padding: 8px 14px;
        border: 0;
        border-radius: 8px;
        background: var(--primary);
        color: #ffffff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      .retry:disabled,
      .pager button:disabled,
      .city-form button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      /* detail panel */
      .detail {
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--card);
      }

      .detail dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px 12px;
        margin: 0 0 12px;
      }

      .detail dt {
        color: var(--muted);
      }

      .detail dd {
        margin: 0;
      }

      .todos {
        margin: 8px 0 0;
        padding-left: 20px;
      }

      .todos li.done {
        color: var(--muted);
        text-decoration: line-through;
      }

      .city-form {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 12px 0;
      }

      .city-form label {
        font-weight: 600;
      }

      .city-form input {
        flex: 1;
        min-width: 120px;
        padding: 8px 10px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font: inherit;
      }

      .notice {
        margin: 8px 0 0;
        color: #166534;
        font-size: 0.9rem;
      }

      /* pagination */
      .pager {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 8px;
      }
check:
  dom:
    text:
      - People Directory
      - 'Could not load people: HTTP 500'
      - Retry
    selectors:
      - div.error[role="alert"]
      - div.error button.retry
  code:
    - pattern: res\.ok|response\.ok
      message: 'Check res.ok: fetch does not fail on a 500 response.'
    - pattern: throw\s+new\s+Error\(
      message: Throw an Error when the response is not ok so that .catch runs.
    - pattern: \.catch\(|catch\s*\(
      message: Handle failures with .catch(...).
    - pattern: \}\s*,\s*\[\s*attempt\s*\]
      message: Use [attempt] as the dependency array so Retry re-runs the effect.
    - pattern: setAttempt\(
      message: The Retry button should call setAttempt(attempt + 1).
hints:
  - fetch only rejects when the network fails. A 500 or 404 is a perfectly good answer for fetch, so you must look at res.ok yourself and throw an Error to reach .catch.
  - 'Keep one status string (''loading'', ''error'' or ''ready'') instead of the loading boolean, plus an error message. Retry works by changing a number in state (attempt) that is in the effect''s dependency array: when it changes, the effect runs again.'
  - 'const url = FAIL_FIRST_TRY && attempt === 0 ? API + ''/error/500'' : API + ''/users'';  fetch(url).then((res) => { if (!res.ok) throw new Error(''HTTP '' + res.status); return res.json(); }).then(...).catch((err) => { setError(err.message); setStatus(''error''); });  ... }, [attempt]);   <button className="retry" onClick={() => setAttempt(attempt + 1)}>Retry</button>'
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 3: an error state with a Retry button.
      const API = 'https://api.academy.test';

      // Testing switch: when true, the FIRST request goes to /error/500 on purpose,
      // so you can see how the app behaves when the server is broken.
      const FAIL_FIRST_TRY = true;

      function App() {
        const [people, setPeople] = useState([]);
        const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
        const [error, setError] = useState('');
        const [attempt, setAttempt] = useState(0);

        useEffect(() => {
          let cancelled = false;
          setStatus('loading');

          const url = FAIL_FIRST_TRY && attempt === 0 ? API + '/error/500' : API + '/users';

          fetch(url)
            .then((res) => {
              if (!res.ok) {
                throw new Error('HTTP ' + res.status);
              }
              return res.json();
            })
            .then((data) => {
              if (!cancelled) {
                setPeople(data);
                setStatus('ready');
              }
            })
            .catch((err) => {
              if (!cancelled) {
                setError(err.message);
                setStatus('error');
              }
            });

          return () => {
            cancelled = true;
          };
        }, [attempt]);

        let content;
        if (status === 'loading') {
          content = <p className="loading">Loading people...</p>;
        } else if (status === 'error') {
          content = (
            <div className="error" role="alert">
              <p>Could not load people: {error}</p>
              <button type="button" className="retry" onClick={() => setAttempt(attempt + 1)}>
                Retry
              </button>
            </div>
          );
        } else {
          content = (
            <>
              <p className="count">{people.length} people</p>
              <ul className="people">
                {people.map((person) => (
                  <li key={person.id} className="person">
                    <div className="person-row">
                      <div className="who">
                        <strong>{person.name}</strong>
                        <span className="email">{person.email}</span>
                      </div>
                      <div className="meta">
                        <span className="badge">{person.role}</span>
                        <span className="city">{person.city}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          );
        }

        return (
          <main className="app">
            <h1>People Directory</h1>
            {content}
          </main>
        );
      }

      export default App;
  - name: styles.css
    code: |
      /* People Directory: all the styles for the whole project.
         You do not need to write any CSS in this project, the focus is React. */

      :root {
        --bg: #f4f5f7;
        --card: #ffffff;
        --text: #1f2937;
        --muted: #6b7280;
        --primary: #0891b2;
        --border: #d9dde3;
        --danger: #b91c1c;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        line-height: 1.45;
      }

      .app {
        max-width: 920px;
        margin: 0 auto;
        padding: 20px 16px 40px;
      }

      h1 {
        margin: 0 0 4px;
        font-size: 1.7rem;
      }

      h2 {
        margin: 0 0 8px;
        font-size: 1.2rem;
      }

      .count,
      .hint,
      .loading {
        color: var(--muted);
        font-size: 0.95rem;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }

      /* search */
      .search {
        width: 100%;
        margin: 8px 0 4px;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font: inherit;
      }

      /* layout: list on the left, details on the right */
      .layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        margin-top: 8px;
      }

      @media (min-width: 700px) {
        .layout {
          grid-template-columns: 1.2fr 1fr;
          align-items: start;
        }
      }

      /* people list */
      .people {
        margin: 8px 0 0;
        padding: 0;
        list-style: none;
      }

      .person {
        margin-bottom: 8px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--card);
      }

      .person.selected {
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.25);
      }

      .person-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        padding: 12px 14px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
      }

      button.person-row {
        cursor: pointer;
      }

      .who {
        display: flex;
        flex-direction: column;
      }

      .email {
        color: var(--muted);
        font-size: 0.85rem;
      }

      .meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
        font-size: 0.85rem;
      }

      .badge {
        padding: 1px 8px;
        border-radius: 999px;
        background: #e0f2fe;
        color: #075985;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
      }

      .city {
        color: var(--muted);
      }

      /* states */
      .error {
        padding: 12px 14px;
        border: 1px solid #fecaca;
        border-radius: 10px;
        background: #fef2f2;
        color: var(--danger);
      }

      .error p {
        margin: 0 0 8px;
      }

      .retry,
      .pager button,
      .city-form button {
        padding: 8px 14px;
        border: 0;
        border-radius: 8px;
        background: var(--primary);
        color: #ffffff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      .retry:disabled,
      .pager button:disabled,
      .city-form button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      /* detail panel */
      .detail {
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--card);
      }

      .detail dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px 12px;
        margin: 0 0 12px;
      }

      .detail dt {
        color: var(--muted);
      }

      .detail dd {
        margin: 0;
      }

      .todos {
        margin: 8px 0 0;
        padding-left: 20px;
      }

      .todos li.done {
        color: var(--muted);
        text-decoration: line-through;
      }

      .city-form {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 12px 0;
      }

      .city-form label {
        font-weight: 600;
      }

      .city-form input {
        flex: 1;
        min-width: 120px;
        padding: 8px 10px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font: inherit;
      }

      .notice {
        margin: 8px 0 0;
        color: #166534;
        font-size: 0.9rem;
      }

      /* pagination */
      .pager {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 8px;
      }
quiz:
  - q: What happens with fetch when the server answers with status 500?
    options:
      - The promise rejects and .catch runs automatically
      - The page reloads
      - The promise still resolves, so you must check res.ok yourself
    answer: 2
    explain: fetch only rejects for network problems such as being offline. HTTP error codes are normal answers.
  - q: How does the Retry button make the effect run again?
    options:
      - It calls the effect function directly
      - It changes the attempt state, which is in the dependency array
      - It reloads the page
    answer: 1
  - q: Why use one status value ('loading', 'error', 'ready') instead of separate booleans?
    options:
      - The screen can only be in one phase at a time, and a single value makes impossible combinations impossible
      - Booleans do not work in React
      - It is shorter to type
    answer: 0
---
Servers fail: a deploy goes wrong, the Wi-Fi drops, a bug returns a 500. A professional app does not leave users staring at "Loading..." forever. In this step you will add the error screen and a **Retry** button, and learn how to test the unhappy path without breaking a real server.

## Where we are

The directory loads five people from the API and shows a loading message. If the server answered with an error, the code would crash trying to treat the error body as a list.

## What we will add, and why it matters

Beginners test only the happy path. Professionals ask "what if this fails?" for every request, because it will fail sooner or later. We will make three things:

1. A **status** with three phases: `loading`, `error`, `ready`.
2. An **error screen** that explains what happened and offers Retry.
3. A **testing switch**, `FAIL_FIRST_TRY`, that makes the first request go to `/error/500` (the practice server answers every status code on demand). That is a trick real developers use constantly: deliberately break a request to see how the screen reacts.

## Guided walk-through

**1. Replace `loading` by a status.** Two booleans like `loading` and `failed` can disagree ("loading and failed at once?"). One string cannot:

```jsx
const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
const [error, setError] = useState('');
const [attempt, setAttempt] = useState(0);
```

**2. Check `res.ok`.** `res.ok` is `true` for status 200 to 299. For anything else you throw, which skips straight to `.catch`:

```jsx
fetch(url)
  .then((res) => {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  })
  .then((data) => { setPeople(data); setStatus('ready'); })
  .catch((err) => { setError(err.message); setStatus('error'); });
```

`.catch` also handles real network failures, so one place covers both kinds of problem. The message `HTTP 500` is what the user (and you, in a bug report) will read.

**3. Choose the address.** The switch picks the broken URL only on the first attempt:

```jsx
const url = FAIL_FIRST_TRY && attempt === 0 ? API + '/error/500' : API + '/users';
```

**4. Make Retry re-run the effect.** An effect re-runs when something in its dependency array changes. We put `attempt` there. Clicking Retry increases it:

```jsx
}, [attempt]);
...
<button onClick={() => setAttempt(attempt + 1)}>Retry</button>
```

Also call `setStatus('loading')` at the start of the effect so the user sees progress when retrying.

**5. Render the three phases.** Choose with `if / else if / else` before the `return`, and put the result in a variable (`let content;`). It reads better than nested ternaries.

## What you should see

The page shows a red box `Could not load people: HTTP 500` with a **Retry** button. Click Retry: the second attempt uses the real address and the five people appear. The checker sees the error screen, because it looks at the page before anybody clicks. To turn the test off, set `FAIL_FIRST_TRY` to `false`.

> **Watch out:**
> - Without `if (!res.ok)`, a 500 response with an error body is treated as data and `people.map is not a function` crashes the page.
> - Retry that only calls the old function again but does not change state may not re-render anything. Changing `attempt` is what triggers the effect.
> - Forgetting `[attempt]` in the dependency array makes Retry do nothing.
> - Do not show raw technical errors to ordinary users in a real product. Here we do it because you are the developer.

> **Your turn:** follow the four `TODO` comments: use a `status` state, add `error` and `attempt`, build the URL with the switch, check `res.ok`, add `.catch`, use `[attempt]` as dependencies, and render loading, error and ready. The page must show `Could not load people: HTTP 500` and a Retry button inside `div.error`.
