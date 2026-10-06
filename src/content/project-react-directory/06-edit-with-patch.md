---
title: 'Step 6: Edit a city with PATCH and a sign-in token'
summary: Sign in to get a token, then send an authorised PATCH request from a form and update the screen with the server's answer.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 6: sign in and edit a person's city with PATCH.
      //
      // TODO 1: set DEMO_QUERY to '' (after Ada moves to Cambridge a 'london' search would hide her).
      // TODO 2: add  const DEMO_CITY = 'Cambridge';  and two more pieces of state: token (null) and notice ('').
      // TODO 3: sign in once with a useEffect and [] : POST API + '/login' with the header
      //         'Content-Type': 'application/json' and the body JSON.stringify({ email: 'ada@example.com', password: 'engine123' }).
      //         Read res.json() and call setToken(data.token). Tip: define an async function inside the effect.
      // TODO 4: write  async function saveCity(id, city)  that sends a PATCH to API + '/users/' + id
      //         with the headers Content-Type and  Authorization: 'Bearer ' + token  and the body
      //         JSON.stringify({ city: city }). If !res.ok throw an Error. Otherwise read the updated person
      //         and replace it in the list: setPeople((list) => list.map(...)), then setNotice('Saved city for ' + updated.name).
      //         Wrap it in try / catch and put 'Could not save: ...' into the notice on failure.
      // TODO 5: write a CityForm component (props: person, canSave, onSave) with its own state for the draft
      //         city, a form (className "city-form") with a label "City", an input and a submit
      //         button "Save" (disabled when !canSave). Render it in the detail panel with key={selected.id}
      //         and show the notice below it:  <p className="notice" role="status">{notice}</p>
      // TODO 6: demo: add an effect with [token, status] that calls saveCity(DEMO_SELECTED, DEMO_CITY)
      //         when DEMO_CITY is set, token exists and status === 'ready'.
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
check:
  dom:
    text:
      - Ada Lovelace
      - Cambridge
      - Saved city for Ada Lovelace
      - 5 of 5 people
      - City
    selectors:
      - form.city-form input
      - form.city-form button[type="submit"]
      - p.notice[role="status"]
      - li.person.selected
  code:
    - pattern: method:\s*['"]PATCH['"]
      message: 'Send the change with method: ''PATCH''.'
    - pattern: Authorization
      message: Send the token in an Authorization header.
    - pattern: Bearer\s*['"]?\s*\+|Bearer \$\{
      message: The header value is 'Bearer ' followed by the token.
    - pattern: /login
      message: Sign in with POST /login to get a token.
    - pattern: JSON\.stringify\(
      message: 'The body of a POST or PATCH must be JSON text: JSON.stringify(...).'
    - pattern: Content-Type
      message: 'Tell the server you send JSON: ''Content-Type'': ''application/json''.'
    - pattern: setPeople\(\s*\(\s*\w+\s*\)\s*=>
      message: Update the list with the functional form setPeople((list) => list.map(...)).
hints:
  - 'Writing data needs two things the GET requests did not: a token (get it once from POST /login and keep it in state) and a request with a method, headers and a JSON body. After a successful PATCH the server returns the updated person: put that into the list.'
  - 'fetch(API + ''/users/'' + id, { method: ''PATCH'', headers: { ''Content-Type'': ''application/json'', Authorization: ''Bearer '' + token }, body: JSON.stringify({ city: city }) }). Then const updated = await res.json(); setPeople((list) => list.map((p) => (p.id === updated.id ? updated : p)));'
  - 'useEffect(() => { async function signIn() { const res = await fetch(API + ''/login'', { method: ''POST'', headers: { ''Content-Type'': ''application/json'' }, body: JSON.stringify({ email: ''ada@example.com'', password: ''engine123'' }) }); if (res.ok) { const data = await res.json(); setToken(data.token); } } signIn(); }, []);   and the demo: useEffect(() => { if (DEMO_CITY && token && status === ''ready'') saveCity(DEMO_SELECTED, DEMO_CITY); }, [token, status]);'
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 6: sign in and edit a person's city with PATCH.
      const API = 'https://api.academy.test';

      // Testing switch: when true, the FIRST request goes to /error/500 on purpose.
      // Now off, because we want to see people. Set it to true to test the error screen again.
      const FAIL_FIRST_TRY = false;

      // Demo: the search box starts with this text so the checker can see the filter at work.
      // Now empty: after Ada moves to Cambridge a 'london' search would hide her.
      const DEMO_QUERY = '';

      // Demo: this person is selected when the page opens (their id). Use null for "nobody".
      const DEMO_SELECTED = 1;

      // Demo: once we are signed in and the people are loaded, the app saves this city for the
      // selected person by itself (the checker cannot type). Use '' to switch the demo off.
      const DEMO_CITY = 'Cambridge';

      // A small form with its own draft text. The parent decides what "save" means.
      function CityForm({ person, canSave, onSave }) {
        const [city, setCity] = useState(person.city);

        function handleSubmit(event) {
          event.preventDefault();
          if (city.trim() === '') {
            return;
          }
          onSave(person.id, city.trim());
        }

        return (
          <form className="city-form" onSubmit={handleSubmit}>
            <label htmlFor="city-input">City</label>
            <input id="city-input" value={city} onChange={(e) => setCity(e.target.value)} />
            <button type="submit" disabled={!canSave}>
              Save
            </button>
          </form>
        );
      }

      function App() {
        const [people, setPeople] = useState([]);
        const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
        const [error, setError] = useState('');
        const [attempt, setAttempt] = useState(0);
        const [query, setQuery] = useState(DEMO_QUERY);
        const [selectedId, setSelectedId] = useState(DEMO_SELECTED);
        const [todos, setTodos] = useState([]);
        const [todosStatus, setTodosStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'ready'
        const [token, setToken] = useState(null);
        const [notice, setNotice] = useState('');

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

        // Sign in once. (A real app shows a login form; the practice server has a demo account.)
        useEffect(() => {
          async function signIn() {
            const res = await fetch(API + '/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'ada@example.com', password: 'engine123' }),
            });
            if (res.ok) {
              const data = await res.json();
              setToken(data.token);
            }
          }
          signIn();
        }, []);

        // Change one person's city on the server, then update our copy with the server's answer.
        async function saveCity(id, city) {
          setNotice('');
          try {
            const res = await fetch(API + '/users/' + id, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
              body: JSON.stringify({ city: city }),
            });
            if (!res.ok) {
              throw new Error('HTTP ' + res.status);
            }
            const updated = await res.json();
            setPeople((list) => list.map((person) => (person.id === updated.id ? updated : person)));
            setNotice('Saved city for ' + updated.name);
          } catch (err) {
            setNotice('Could not save: ' + err.message);
          }
        }

        // Demo: runs when the token or the status changes; acts once both are ready.
        useEffect(() => {
          if (DEMO_CITY && DEMO_SELECTED !== null && token && status === 'ready') {
            saveCity(DEMO_SELECTED, DEMO_CITY);
          }
        }, [token, status]);

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

                    <CityForm key={selected.id} person={selected} canSave={Boolean(token)} onSave={saveCity} />
                    {notice && (
                      <p className="notice" role="status">
                        {notice}
                      </p>
                    )}

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
  - q: What is the difference between PATCH and PUT?
    options:
      - PATCH only works with tokens
      - PATCH is the same as GET
      - PATCH changes only the fields you send, PUT replaces the whole record
    answer: 2
  - q: Where does the token go in the request?
    options:
      - In the Authorization header as 'Bearer <token>'
      - In the URL after a question mark, always
      - In the page title
    answer: 0
  - q: Why do we replace the person with the server's answer (updated) instead of just trusting our own draft?
    options:
      - Because setPeople needs a new object
      - 'The server is the source of truth: it may have cleaned or changed the value, and now the screen shows what is really saved'
      - To make the request faster
    answer: 1
---
Until now the directory could only read data. Real apps also **write**: they create, change and delete things. This step is the biggest jump of the project. You will sign in, send an authorised `PATCH` request with a JSON body, handle success and failure, and update the screen, all things you will repeat in every serious web application.

## Where we are

The directory loads people, searches, lets you pick one and shows their todos. Everything is read-only.

## What we will add, and why it matters

A small form in the detail panel changes the person's **city**. Writing is different from reading in three ways:

1. **Authentication.** Servers refuse changes from strangers (`401 Unauthorized`). You sign in with `POST /login` and receive a **token**, a long secret text. For the practice server we sign in as Ada with the demo account; a real app shows a login form and never puts a password in the code.
2. **A method and a body.** `fetch` defaults to `GET`. For a change you pass an options object: `method`, `headers` and `body`.
3. **Trust the server's answer.** The server replies with the saved record. Put that in your state, so the screen shows what is really stored.

## Guided walk-through

**1. Sign in once.** Inside an effect, define an `async` function and call it. (An effect function itself must not be `async`.)

```jsx
useEffect(() => {
  async function signIn() {
    const res = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ada@example.com', password: 'engine123' }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
    }
  }
  signIn();
}, []);
```

`await` pauses the function until the promise has a value, which reads like normal top-to-bottom code. `JSON.stringify` turns the object into the text the server expects, and the `Content-Type` header tells it that the text is JSON.

**2. The PATCH request.**

```jsx
const res = await fetch(API + '/users/' + id, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
  body: JSON.stringify({ city: city }),
});
```

`PATCH` sends only the changed fields; `PUT` would replace the whole record. The `Authorization: Bearer <token>` header is how the server knows who you are. Then check `res.ok`, read the updated person and swap it into the list with the **functional update** form:

```jsx
setPeople((list) => list.map((p) => (p.id === updated.id ? updated : p)));
```

Passing a function gives you the latest list, which is safer than using the `people` variable from an older render. `map` returns a new array; we never change state in place.

**3. A form with its own draft.** `CityForm` keeps what you are typing in its own state, `useState(person.city)`, so every keystroke does not re-render the whole app. The parent gives it `key={selected.id}`: when the key changes React throws the old form away and builds a new one, so the draft resets when you select someone else.

**4. Report the result.** Use a `notice` state for messages: `Saved city for Ada Lovelace` on success and `Could not save: HTTP 403` on failure. `role="status"` makes screen readers read it out.

**5. The demo.** An effect with `[token, status]` calls `saveCity(DEMO_SELECTED, DEMO_CITY)` when the token and the people are both ready. Ada's city changes to `Cambridge` by itself, so the checker (and you) can see a real PATCH round trip. Type another city and press Save to do it by hand. Change `DEMO_QUERY` to `''` first, otherwise a `london` search would hide Ada after she moves.

> **Watch out:**
> - Forgetting `JSON.stringify`: you send `[object Object]` and the server answers `400` or `415`.
> - Forgetting the `Content-Type` header: the server answers `415 Unsupported Media Type`.
> - `401` means no or invalid token, `403` means a valid token that is not allowed to do this. They are different problems.
> - Mutating state: `people[0].city = 'x'` does not trigger a re-render. Always create new arrays and objects.
> - Never commit real passwords or tokens to code. The one here exists only for the practice server.

> **Your turn:** follow the `TODO` list: add `token` and `notice` state, sign in with `POST /login`, write `saveCity` with the `PATCH`, add the `CityForm` component and the notice to the detail panel, and the demo effect. After the page settles it must show Ada's city as `Cambridge` and the message `Saved city for Ada Lovelace`.
