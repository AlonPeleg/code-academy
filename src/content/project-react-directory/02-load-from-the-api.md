---
title: 'Step 2: Load people from the API'
summary: Fetch the users from the web API inside useEffect and show a loading state until they arrive.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      import './styles.css';

      // Step 2: load the people from the API instead of a hard-coded array.
      //
      // TODO 1: import useState and useEffect from 'react' (first line of the file).
      //
      // TODO 2: delete the PEOPLE array. Add  const API = 'https://api.academy.test';
      //
      // TODO 3: inside App create two pieces of state:
      //         people (starts as an empty array) and loading (starts as true).
      //
      // TODO 4: add a useEffect with an EMPTY dependency array [] so it runs once, after the first
      //         render. Inside: fetch(API + '/users'), turn the answer into data with res.json(),
      //         then call setPeople(data) and setLoading(false).
      //         Use a "cancelled" flag and return a cleanup function that sets it to true.
      //
      // TODO 5: while loading is true show <p className="loading">Loading people...</p>
      //         instead of the count and the list. Use people instead of PEOPLE everywhere.

      // Step 1 code (replace it step by step):
      const PEOPLE = [
        { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', role: 'admin', city: 'London' },
        { id: 2, name: 'Grace Hopper', email: 'grace@example.com', role: 'editor', city: 'New York' },
        { id: 3, name: 'Alan Turing', email: 'alan@example.com', role: 'viewer', city: 'London' },
      ];

      function App() {
        return (
          <main className="app">
            <h1>People Directory</h1>
            <p className="count">{PEOPLE.length} people</p>

            <ul className="people">
              {PEOPLE.map((person) => (
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
      - 5 people
      - Katherine Johnson
      - Linus Torvalds
      - alan@example.com
    selectors:
      - ul.people > li.person:nth-child(5)
  code:
    - pattern: useEffect\(
      message: Load the data inside useEffect(...).
    - pattern: fetch\(\s*API\s*\+\s*['"]/users['"]|fetch\(\s*['"]https://api\.academy\.test/users
      message: Fetch the address https://api.academy.test/users.
    - pattern: \}\s*,\s*\[\s*\]\s*\)
      message: Pass an empty dependency array [] so the effect runs only once.
    - pattern: useState\(\s*true\s*\)
      message: Start with const [loading, setLoading] = useState(true).
    - pattern: Loading people
      message: Show the text 'Loading people...' while loading.
    - pattern: ^(?![\s\S]*ada@example\.com)
      message: 'Delete the hard-coded PEOPLE array: the data now comes from the API.'
hints:
  - 'Fetching data is a side effect (it talks to the outside world), so it belongs in useEffect, not directly in the component body. State holds the result: people (the data) and loading (are we still waiting?).'
  - 'useEffect(() => { fetch(API + ''/users'').then((res) => res.json()).then((data) => { setPeople(data); setLoading(false); }); }, []); The empty array [] means: run once after the first render. Render {loading ? <p>Loading...</p> : <list/>}.'
  - const [people, setPeople] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { let cancelled = false; fetch(API + '/users').then((res) => res.json()).then((data) => { if (!cancelled) { setPeople(data); setLoading(false); } }); return () => { cancelled = true; }; }, []);
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 2: load the people from the API.
      const API = 'https://api.academy.test';

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
quiz:
  - q: Why do we fetch inside useEffect and not directly in the component function?
    options:
      - fetch only works inside effects
      - The component function runs on every render, so fetching there would repeat the request again and again
      - useEffect makes the request faster
    answer: 1
  - q: What does the empty dependency array [] at the end of useEffect mean?
    options:
      - Run the effect only once, after the first render
      - Never run the effect
      - Run the effect on every render
    answer: 0
  - q: Why do we need a loading state?
    options:
      - Because React forbids empty lists
      - To make fetch asynchronous
      - Data takes time to arrive, and the screen needs something sensible to show meanwhile
    answer: 2
---
A directory with three people typed into the code is a demo. In this step the people come from a server, which is how nearly every real application works. You will learn the three-part pattern you will use for the rest of your career: **state, effect, render**.

## Where we are

The app shows a hard-coded array `PEOPLE` with three people. There is no network request yet.

## What we will add, and why it matters

We will load the list from `https://api.academy.test/users`. This is a practice server built into the page, so it works offline and always answers the same way. It returns **five** people as JSON, so you will know the request worked when the counter says `5 people` instead of `3`.

Network requests take time. For a moment the screen has nothing to show, and a good app says so ("Loading...") instead of a blank page. That is why we keep a second piece of state, `loading`.

## Guided walk-through

**1. Two pieces of state.** `useState` remembers a value between renders and re-renders the component when you change it:

```jsx
const [people, setPeople] = useState([]);   // starts empty
const [loading, setLoading] = useState(true); // we are waiting at the start
```

**2. The effect.** `useEffect(fn, deps)` runs `fn` **after** React has put the component on the screen. The second argument says when to run it again: `[]` means "only the first time".

```jsx
useEffect(() => {
  fetch(API + '/users')
    .then((res) => res.json())
    .then((data) => {
      setPeople(data);
      setLoading(false);
    });
}, []);
```

Read it from the top. `fetch(url)` starts a request and returns a **promise**, a value that arrives later. `.then(...)` says what to do when it arrives. The first `then` turns the response into JavaScript data with `res.json()` (which is again a promise), the second one receives the data. Calling `setPeople` makes React render again with the new list.

**3. The cleanup.** An effect may return a function that React calls when the effect is replaced or the component goes away. We use it to set a flag, `cancelled`, and ignore a late answer. It prevents the classic bug "state update on an unmounted component":

```jsx
let cancelled = false;
...
return () => { cancelled = true; };
```

**4. Render for each phase.** Use the conditional operator inside JSX:

```jsx
{loading ? <p className="loading">Loading people...</p> : <ul>...</ul>}
```

When a branch holds more than one element, wrap it in a fragment `<> ... </>`, an invisible wrapper.

**5. Remove the old array.** Replace `PEOPLE` with `people` everywhere and delete the constant, otherwise you would still be showing fake data.

## What you should see

For a split second `Loading people...`, then `5 people` and five cards, including Katherine Johnson and Linus Torvalds who were not in our old array.

> **Watch out:**
> - Forgetting `[]`: the effect runs after every render, each run sets state, which renders again, which runs the effect... an infinite loop of requests.
> - `people.map is not a function`: `people` started as `undefined` or an object. Start with `[]`.
> - Making the effect function `async` directly (`useEffect(async () => ...)`). React expects it to return nothing or a cleanup function, not a promise. Use `.then`, or define an async function inside.
> - Forgetting `res.json()`: you would put a Response object into state.
> - `fetch` only knows full addresses: `'/users'` alone will not reach the practice server.

> **Your turn:** follow the five `TODO` comments: import the hooks, add `API`, create the `people` and `loading` state, fetch `/users` inside `useEffect(..., [])` with a cleanup flag, show `Loading people...` while loading, and delete the hard-coded array. The page must show `5 people`, including Katherine Johnson and Linus Torvalds.
