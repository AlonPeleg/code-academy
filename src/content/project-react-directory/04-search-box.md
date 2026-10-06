---
title: 'Step 4: A search box with a controlled input'
summary: Filter the loaded people while the user types, using state, a controlled input and a derived list.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 4: a search box that filters the list.
      //
      // TODO 1: set FAIL_FIRST_TRY to false (the error screen works, now we want people).
      // TODO 2: add the constant  const DEMO_QUERY = 'london';  and a state
      //         query  that starts with DEMO_QUERY. (The checker cannot type, so the box starts filled in.)
      // TODO 3: compute  visible  from people: keep a person when their name OR city,
      //         both in lower case, includes the lower-case query (use trim() and toLowerCase()).
      // TODO 4: in the ready screen, above the count add a label (htmlFor="search", className="sr-only",
      //         text "Search people") and a CONTROLLED input: id="search" className="search"
      //         type="search" placeholder="Search by name or city" value={query}
      //         onChange={(e) => setQuery(e.target.value)}
      // TODO 5: show  <visible count> of <all count> people  and map over visible (not people).
      //         When visible is empty show <p className="hint">No people match "{query}".</p>
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
check:
  dom:
    text:
      - Ada Lovelace
      - Alan Turing
      - 2 of 5 people
      - Search people
    selectors:
      - input.search[type="search"][value="london"]
      - ul.people > li.person:nth-child(2):last-child
  code:
    - pattern: value=\{\s*query\s*\}
      message: 'Make the input controlled: value={query}.'
    - pattern: onChange=\{
      message: Add onChange to update the query state.
    - pattern: e\.target\.value|event\.target\.value
      message: Read the typed text with e.target.value.
    - pattern: toLowerCase\(\)
      message: Compare in lower case so that 'LONDON' finds 'London'.
    - pattern: visible\.map\(
      message: Map over the filtered list (visible), not over all people.
    - pattern: FAIL_FIRST_TRY\s*=\s*false
      message: Set FAIL_FIRST_TRY to false.
hints:
  - 'Two ideas: (1) the text in the search box lives in state (a controlled input), (2) the filtered list is not new state, it is calculated from people and query on every render.'
  - const visible = people.filter((p) => p.name.toLowerCase().includes(needle) || p.city.toLowerCase().includes(needle)); where needle = query.trim().toLowerCase(). The input needs value={query} and onChange={(e) => setQuery(e.target.value)}.
  - <input id="search" className="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} />   <p className="count">{visible.length} of {people.length} people</p>   {visible.map((person) => ( ... ))}
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 4: a search box that filters the list.
      const API = 'https://api.academy.test';

      // Testing switch: when true, the FIRST request goes to /error/500 on purpose.
      // Now off, because we want to see people. Set it to true to test the error screen again.
      const FAIL_FIRST_TRY = false;

      // Demo: the search box starts with this text so the checker can see the filter at work.
      // Use an empty string '' for a normal start.
      const DEMO_QUERY = 'london';

      function App() {
        const [people, setPeople] = useState([]);
        const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
        const [error, setError] = useState('');
        const [attempt, setAttempt] = useState(0);
        const [query, setQuery] = useState(DEMO_QUERY);

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

        // The people that match the search text (name or city), ignoring upper/lower case.
        const needle = query.trim().toLowerCase();
        const visible = people.filter(
          (person) => person.name.toLowerCase().includes(needle) || person.city.toLowerCase().includes(needle)
        );

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
              <label htmlFor="search" className="sr-only">
                Search people
              </label>
              <input
                id="search"
                className="search"
                type="search"
                placeholder="Search by name or city"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <p className="count">
                {visible.length} of {people.length} people
              </p>

              {visible.length === 0 ? (
                <p className="hint">No people match "{query}".</p>
              ) : (
                <ul className="people">
                  {visible.map((person) => (
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
              )}
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
  - q: What makes an input 'controlled' in React?
    options:
      - It has a CSS class
      - It cannot be edited
      - Its value comes from state and onChange updates that state
    answer: 2
  - q: Why is visible calculated during rendering and not stored with useState?
    options:
      - Because it can always be worked out from people and query, and a second copy could get out of sync
      - Because useState cannot store arrays
      - Because filter is only allowed inside effects
    answer: 0
  - q: What does people.filter(fn) do?
    options:
      - Changes the people array in place
      - Returns a new array containing only the items for which fn returns true
      - Sorts the array
    answer: 1
---
A directory with hundreds of people is useless without search. This step adds a search box that filters the list as you type, and it teaches two of the most important ideas in React: **controlled inputs** and **derived data**.

## Where we are

The app loads five people from the API, shows loading and error screens, and lists everybody. The `FAIL_FIRST_TRY` switch is still on, so it opens with the error screen.

## What we will add, and why it matters

Typing in a box is *state*: the text changes over time and the screen must follow it. In plain JavaScript the browser keeps the text inside the input, and you have to read it. In React the usual style is a **controlled input**: React state is the single source of truth, and the input just displays it. This makes it easy to use the text anywhere: filtering, validating, clearing it, showing "No results for ...".

## Guided walk-through

**1. Turn off the error test.** Set `FAIL_FIRST_TRY` to `false`. The error screen is tested; now we want people.

**2. State for the text.**

```jsx
const [query, setQuery] = useState(DEMO_QUERY);
```

`DEMO_QUERY` is `'london'`. The checker cannot type, so the box starts filled in. Change it to `''` for a normal start, and you will see all five people.

**3. The controlled input.** Two props make it controlled:

```jsx
<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

Each keystroke fires `onChange`. The event object `e` describes it, and `e.target.value` is the text now in the box. We store it, React renders again, and the input shows `query`. If you give an input a `value` but no `onChange` it becomes read-only and React warns you.

**4. Derive the visible list.** Do not create a second state for "filtered people". Whenever something can be computed from existing state, compute it while rendering:

```jsx
const needle = query.trim().toLowerCase();
const visible = people.filter(
  (person) => person.name.toLowerCase().includes(needle) || person.city.toLowerCase().includes(needle)
);
```

`toLowerCase()` makes the match ignore capital letters. `includes` tests whether one text contains another. The empty string is contained in everything, so an empty search shows everybody. `||` means "or": a match on the name or the city is enough.

**5. Show the result honestly.** Map over `visible`, and show `2 of 5 people` so the user knows a filter is active. When nothing matches, say so: `No people match "xyz".` An empty list without explanation looks like a bug.

**6. An accessible label.** Add a `label` linked with `htmlFor="search"` and the class `sr-only` (visually hidden, still read by screen readers). Placeholders alone are not labels.

## What you should see

With the demo text `london` the page shows `2 of 5 people`: Ada Lovelace and Alan Turing both live in London. Type something else in the box and the list follows every key you press.

> **Watch out:**
> - `value={query}` without `onChange`: you cannot type, and the console warns `You provided a value prop to a form field without an onChange handler`.
> - `setQuery(e.target)` stores the whole input element. You want `e.target.value`.
> - Filtering `people` and saving the result with `setPeople(...)` throws the other people away forever. Never overwrite your source data to filter.
> - Mapping over `people` instead of `visible` shows the unfiltered list.
> - Case: `'Ada'.includes('ada')` is false. Lower-case both sides.

> **Your turn:** follow the `TODO` comments: switch the failure test off, add the `query` state starting with `DEMO_QUERY`, compute `visible` with `filter`, add the label and the controlled input, show `N of M people` and map over `visible`. With the demo text the page must show "2 of 5 people" with Ada Lovelace and Alan Turing.
