---
title: 'Step 5: Select a person and show their todos'
summary: Keep the selected id in state and load that person's todos with a second effect.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 5: select a person and show their todos.
      //
      // TODO 1: add  const DEMO_SELECTED = 1;  (the checker cannot click, so Ada starts selected).
      // TODO 2: add state: selectedId (starts as DEMO_SELECTED), todos (starts []) and
      //         todosStatus (starts 'idle'; later 'loading', 'ready' or 'error').
      // TODO 3: add a SECOND useEffect that loads  API + '/users/' + selectedId + '/todos'
      //         whenever selectedId changes (dependency array [selectedId]). Skip when selectedId is null.
      //         Check res.ok, keep the cancelled flag and set todosStatus.
      // TODO 4: const selected = people.find(...) with the matching id (store only the id!),
      //         and doneCount = the number of todos with done === true.
      // TODO 5: change the ready screen into <div className="layout"> with a <section> (search + list)
      //         and an <aside className="detail"> on the right.
      //         Make each person a <button type="button" className="person-row"> inside the li, with
      //         onClick={() => setSelectedId(person.id)}. The li gets the class "person selected"
      //         when person.id === selectedId, otherwise "person".
      // TODO 6: the aside shows (when selected exists) <h2> with the name, a <dl> with Email, Role and City,
      //         a <h3>Todos</h3> and, when todosStatus is 'ready', the text  "<done> of <total> done"
      //         and <ul className="todos"> with one li per todo (className "done" when finished).
      //         Without a selection show <p className="hint">Select a person to see their todos.</p>
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
check:
  dom:
    text:
      - Ada Lovelace
      - Todos
      - Write the first program
      - Design the analytical engine
      - Publish the notes
      - 1 of 3 done
    selectors:
      - li.person.selected
      - button.person-row
      - aside.detail h2
      - ul.todos > li.done
      - ul.todos > li:nth-child(3)
  code:
    - pattern: \[\s*selectedId\s*\]
      message: The todos effect depends on [selectedId].
    - pattern: /todos
      message: 'Fetch the todos of the selected person: API + ''/users/'' + selectedId + ''/todos''.'
    - pattern: setSelectedId\(\s*person\.id\s*\)
      message: A click on a person should call setSelectedId(person.id).
    - pattern: \.find\(
      message: Look the selected person up with people.find(...).
    - pattern: useEffect\([\s\S]*useEffect\(
      message: 'You need two effects now: one for users, one for the todos.'
hints:
  - Store only WHICH person is selected (selectedId), not a copy of the person. The detail panel looks the person up with people.find(...) and a second effect loads the todos whenever selectedId changes.
  - 'The effect: useEffect(() => { ... fetch(API + ''/users/'' + selectedId + ''/todos'') ... }, [selectedId]);  Each list item holds a button: <button type="button" className="person-row" onClick={() => setSelectedId(person.id)}>. The panel is <aside className="detail">.'
  - 'const selected = people.find((person) => person.id === selectedId);  const doneCount = todos.filter((todo) => todo.done).length;  <li key={person.id} className={person.id === selectedId ? ''person selected'' : ''person''}><button type="button" className="person-row" onClick={() => setSelectedId(person.id)}>...</button></li>   <ul className="todos">{todos.map((todo) => (<li key={todo.id} className={todo.done ? ''done'' : ''''}>{todo.title}</li>))}</ul>'
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 5: select a person and show their todos.
      const API = 'https://api.academy.test';

      // Testing switch: when true, the FIRST request goes to /error/500 on purpose.
      // Now off, because we want to see people. Set it to true to test the error screen again.
      const FAIL_FIRST_TRY = false;

      // Demo: the search box starts with this text so the checker can see the filter at work.
      // Use an empty string '' for a normal start.
      const DEMO_QUERY = 'london';

      // Demo: this person is selected when the page opens (their id). Use null for "nobody".
      const DEMO_SELECTED = 1;

      function App() {
        const [people, setPeople] = useState([]);
        const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
        const [error, setError] = useState('');
        const [attempt, setAttempt] = useState(0);
        const [query, setQuery] = useState(DEMO_QUERY);
        const [selectedId, setSelectedId] = useState(DEMO_SELECTED);
        const [todos, setTodos] = useState([]);
        const [todosStatus, setTodosStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'ready'

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

        // Second effect: whenever the selected person changes, load THEIR todos.
        useEffect(() => {
          if (selectedId === null) {
            setTodos([]);
            setTodosStatus('idle');
            return;
          }
          let cancelled = false;
          setTodosStatus('loading');

          fetch(API + '/users/' + selectedId + '/todos')
            .then((res) => {
              if (!res.ok) {
                throw new Error('HTTP ' + res.status);
              }
              return res.json();
            })
            .then((data) => {
              if (!cancelled) {
                setTodos(data);
                setTodosStatus('ready');
              }
            })
            .catch(() => {
              if (!cancelled) {
                setTodosStatus('error');
              }
            });

          return () => {
            cancelled = true;
          };
        }, [selectedId]);

        // Store only the id, and look the person up: no second copy of the data to keep in sync.
        const selected = people.find((person) => person.id === selectedId);
        const doneCount = todos.filter((todo) => todo.done).length;

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
            <div className="layout">
              <section>
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
                      <li
                        key={person.id}
                        className={person.id === selectedId ? 'person selected' : 'person'}
                      >
                        <button
                          type="button"
                          className="person-row"
                          aria-pressed={person.id === selectedId}
                          onClick={() => setSelectedId(person.id)}
                        >
                          <span className="who">
                            <strong>{person.name}</strong>
                            <span className="email">{person.email}</span>
                          </span>
                          <span className="meta">
                            <span className="badge">{person.role}</span>
                            <span className="city">{person.city}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <aside className="detail">
                {!selected ? (
                  <p className="hint">Select a person to see their todos.</p>
                ) : (
                  <>
                    <h2>{selected.name}</h2>
                    <dl>
                      <dt>Email</dt>
                      <dd>{selected.email}</dd>
                      <dt>Role</dt>
                      <dd>{selected.role}</dd>
                      <dt>City</dt>
                      <dd>{selected.city}</dd>
                    </dl>

                    <h3>Todos</h3>
                    {todosStatus === 'loading' && <p className="loading">Loading todos...</p>}
                    {todosStatus === 'error' && <p className="hint">Could not load the todos.</p>}
                    {todosStatus === 'ready' && (
                      <>
                        <p className="count">
                          {doneCount} of {todos.length} done
                        </p>
                        <ul className="todos">
                          {todos.map((todo) => (
                            <li key={todo.id} className={todo.done ? 'done' : ''}>
                              {todo.title}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </aside>
            </div>
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
  - q: Why do we store selectedId instead of a copy of the selected person object?
    options:
      - Objects cannot be stored in state
      - Ids are shorter to type
      - So there is only one copy of the data, and the panel always shows the current version of that person
    answer: 2
  - q: When does an effect with the dependency array [selectedId] run?
    options:
      - After the first render and again every time selectedId changes
      - Only once
      - Only when the component is removed
    answer: 0
  - q: Why is the person row a button and not just a clickable li?
    options:
      - Buttons load faster
      - A button can be focused and pressed with the keyboard and is announced by screen readers
      - li elements cannot have onClick
    answer: 1
---
So far the directory is a flat list. Real apps have a **master-detail** layout: a list on one side, the details of the chosen item on the other. In this step you will build that, and load extra data for the selected person with a second request.

## Where we are

The app loads the people, shows loading and error screens and lets you search. Rows are not clickable and there is no detail view.

## What we will add, and why it matters

- A **selection**: click a person and they are highlighted.
- A **detail panel** that shows the person's email, role, city and their todos.
- A second API call, `GET /users/:id/todos`, triggered by the selection.

The pattern, *"when this value changes, fetch related data"*, shows up everywhere: product pages, chat rooms, user profiles. In React it is simply an effect whose dependency array contains the value.

## Guided walk-through

**1. Remember which person.** Store the id, not the whole person:

```jsx
const [selectedId, setSelectedId] = useState(DEMO_SELECTED); // 1 means Ada, null means nobody
const selected = people.find((person) => person.id === selectedId);
```

`find` returns the first item for which the function says true, or `undefined`. Because the person object is looked up on every render, the panel can never show outdated data. In the next steps you will edit people, and this design means the panel updates automatically.

**2. A second effect for the todos.** The first effect loads users once. This one runs again for every new selection:

```jsx
useEffect(() => {
  if (selectedId === null) return;
  let cancelled = false;
  setTodosStatus('loading');
  fetch(API + '/users/' + selectedId + '/todos')
    .then((res) => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then((data) => { if (!cancelled) { setTodos(data); setTodosStatus('ready'); } })
    .catch(() => { if (!cancelled) setTodosStatus('error'); });
  return () => { cancelled = true; };
}, [selectedId]);
```

The `cancelled` flag matters more now. If you click Ada and then quickly Grace, Ada's slower answer must not overwrite Grace's todos. Each effect run has its own flag, and the cleanup of the old run flips it.

**3. Make rows clickable the right way.** Put a `button` inside the `li` and give it the click handler:

```jsx
<li className={person.id === selectedId ? 'person selected' : 'person'}>
  <button type="button" className="person-row" onClick={() => setSelectedId(person.id)}>
    ...
  </button>
</li>
```

`onClick={() => setSelectedId(person.id)}` wraps the call in a function. Writing `onClick={setSelectedId(person.id)}` would call it immediately during rendering.

**4. The layout.** Wrap the list and the new `aside.detail` in `div.layout` (two columns on wide screens). The panel has three states: nobody selected (a hint), todos loading, todos ready.

**5. Count the done todos.** `todos.filter((todo) => todo.done).length` gives the number, and we print `1 of 3 done`. This is again derived data, not state.

## What you should see

Ada's row is highlighted with a border, and the panel shows her details and three todos: "Write the first program" is crossed out, the other two are not. Click another person and watch the panel change.

> **Watch out:**
> - `onClick={setSelectedId(person.id)}` runs immediately and causes `Too many re-renders`. Use an arrow function.
> - Missing `[selectedId]`: the todos would never reload when you click somebody else.
> - Using `selected.name` before the people have loaded: `selected` is `undefined`. We guard with `!selected ? ... : ...`.
> - Todos from the previous person flash while the new ones load. Setting the status to `'loading'` at the start of the effect avoids that.

> **Your turn:** follow the six `TODO` comments: add `selectedId` (starting at `DEMO_SELECTED`), the `todos` state and the second effect, derive `selected` and `doneCount`, turn the ready screen into a two-column layout with clickable rows, and build the detail panel. The page must show Ada Lovelace selected with her three todos and `1 of 3 done`.
