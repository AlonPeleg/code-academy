---
title: 'Step 7: Pagination with _page, _limit and X-Total-Count'
summary: Load the people in small pages, read the total count from a response header and add Previous and Next buttons.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';
      import './styles.css';

      // Step 7: pagination with _page, _limit and X-Total-Count.
      //
      // TODO 1: import useRef too. Add the constants  PAGE_SIZE = 2  and  DEMO_PAGE = 2  and change
      //         DEMO_SELECTED to 3 (Alan lives on page 2).
      // TODO 2: add state: page (starts at DEMO_PAGE) and total (starts at 0).
      // TODO 3: change the users URL to  API + '/users?_page=' + page + '&_limit=' + PAGE_SIZE
      //         and add page to the dependency array: [attempt, page].
      // TODO 4: the total is in a RESPONSE HEADER: in the first .then read
      //         Number(res.headers.get('X-Total-Count')), then the JSON, and return both. Store the
      //         total with setTotal(...) next to setPeople(...).
      // TODO 5: const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      //         write goToPage(number): setPage(number), setSelectedId(null) and setNotice('').
      // TODO 6: under the list add <nav className="pager" aria-label="Pagination"> with a Previous button
      //         (className "prev", disabled on page 1), the text  Page <page> of <totalPages>  and a Next
      //         button (className "next", disabled on the last page). Change the count line to
      //         "<total> people in total. Showing <visible> of <on this page> on this page."
      // TODO 7: the demo effect now runs again whenever a new page finishes loading. Guard it with a ref:
      //         const demoDone = useRef(false); only run when !demoDone.current and then set it to true.
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
check:
  dom:
    text:
      - Alan Turing
      - Katherine Johnson
      - Page 2 of 3
      - 5 people in total
      - Cambridge
      - Saved city for Alan Turing
      - Crack the cipher
      - 1 of 2 done
    selectors:
      - nav.pager button.prev
      - nav.pager button.next
      - ul.people > li.person:nth-child(2):last-child
      - li.person.selected
  code:
    - pattern: _page=
      message: Ask for one page with the _page parameter.
    - pattern: _limit=
      message: Limit the page size with the _limit parameter.
    - pattern: headers\.get\(\s*['"]X-Total-Count['"]
      message: Read the total with res.headers.get('X-Total-Count').
    - pattern: \}\s*,\s*\[\s*attempt\s*,\s*page\s*\]
      message: 'The users effect must also depend on page: [attempt, page].'
    - pattern: Math\.ceil\(
      message: Compute the number of pages with Math.ceil(total / PAGE_SIZE).
    - pattern: disabled=\{\s*page
      message: Disable Previous on the first page and Next on the last page.
hints:
  - 'The server does the cutting: ask for one slice with ?_page=2&_limit=2. The total number of people is not in the JSON, it comes in a response header called X-Total-Count; with it you can calculate how many pages exist.'
  - const count = Number(res.headers.get('X-Total-Count')); const data = await res.json(); return { data, count };  then totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE)). The users effect needs [attempt, page] so it reloads when page changes.
  - const url = API + '/users?_page=' + page + '&_limit=' + PAGE_SIZE;   <button type="button" className="prev" disabled={page <= 1} onClick={() => goToPage(page - 1)}>Previous</button>   <span>Page {page} of {totalPages}</span>   <button type="button" className="next" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>Next</button>
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef } from 'react';
      import './styles.css';

      // Step 7: pagination with _page, _limit and X-Total-Count.
      const API = 'https://api.academy.test';

      // Testing switch: when true, the FIRST request goes to /error/500 on purpose.
      // Now off, because we want to see people. Set it to true to test the error screen again.
      const FAIL_FIRST_TRY = false;

      // Demo: the search box starts with this text so the checker can see the filter at work.
      // Now empty: after Ada moves to Cambridge a 'london' search would hide her.
      const DEMO_QUERY = '';

      // Paging: how many people per page, and which page the app opens on (page 2 for the demo).
      const PAGE_SIZE = 2;
      const DEMO_PAGE = 2;

      // Demo: this person is selected when the page opens (their id). Use null for "nobody".
      // Alan (3) lives on page 2.
      const DEMO_SELECTED = 3;

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
        const [page, setPage] = useState(DEMO_PAGE);
        const [total, setTotal] = useState(0);
        const [query, setQuery] = useState(DEMO_QUERY);
        const [selectedId, setSelectedId] = useState(DEMO_SELECTED);
        const [todos, setTodos] = useState([]);
        const [todosStatus, setTodosStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'ready'
        const [token, setToken] = useState(null);
        const [notice, setNotice] = useState('');

        useEffect(() => {
          let cancelled = false;
          setStatus('loading');

          const url =
            FAIL_FIRST_TRY && attempt === 0
              ? API + '/error/500'
              : API + '/users?_page=' + page + '&_limit=' + PAGE_SIZE;

          fetch(url)
            .then(async (res) => {
              if (!res.ok) {
                throw new Error('HTTP ' + res.status);
              }
              // The total number of people is NOT in the body, it is in a response header.
              const count = Number(res.headers.get('X-Total-Count'));
              const data = await res.json();
              return { data: data, count: count };
            })
            .then((result) => {
              if (!cancelled) {
                setPeople(result.data);
                setTotal(result.count);
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
        }, [attempt, page]);

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

        // Demo: runs when the token or the status changes. A ref remembers that it already ran,
        // otherwise it would run again every time you open another page (status becomes 'ready' again).
        const demoDone = useRef(false);
        useEffect(() => {
          if (DEMO_CITY && DEMO_SELECTED !== null && token && status === 'ready' && !demoDone.current) {
            demoDone.current = true;
            saveCity(DEMO_SELECTED, DEMO_CITY);
          }
        }, [token, status]);

        // Open another page. The selected person may not be on the new page, so clear the selection.
        function goToPage(number) {
          setPage(number);
          setSelectedId(null);
          setNotice('');
        }

        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
                  {total} people in total. Showing {visible.length} of {people.length} on this page.
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

                <nav className="pager" aria-label="Pagination">
                  <button type="button" className="prev" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button type="button" className="next" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                    Next
                  </button>
                </nav>
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
  - q: Why do real APIs return lists in pages?
    options:
      - It is required by HTTP
      - 'Sending thousands of records at once is slow and wasteful: the client only needs the part it shows'
      - JSON cannot hold more than ten items
    answer: 1
  - q: Where does this API put the total number of records?
    options:
      - In the X-Total-Count response header
      - In the first item of the list
      - In the URL
    answer: 0
  - q: Why must the users effect have [attempt, page] as dependencies?
    options:
      - Because arrays need two items
      - So that it never runs
      - So that changing the page runs the effect again and loads the new slice
    answer: 2
---
Five people fit on one screen. Fifty thousand do not. Every serious list in every app, from your email to an online shop, is **paginated**: the server sends one slice at a time. In this step you will add Previous and Next buttons, and you will learn to read information that lives in HTTP **headers**, not in the body.

## Where we are

The app loads all people at once, supports search, a selection with todos, and editing the city with a signed-in PATCH.

## What we will add, and why it matters

The practice API supports two query parameters for slicing: `_page` (which page, starting at 1) and `_limit` (how many per page). With `_limit=2` the five people make three pages: `2 + 2 + 1`. The response also carries a header `X-Total-Count: 5`. Without it we could not know whether a next page exists. Servers put this kind of **metadata** in headers so that the body can stay a plain list.

## Guided walk-through

**1. Ask for a page.** Build the address from state:

```jsx
API + '/users?_page=' + page + '&_limit=' + PAGE_SIZE
```

A `?` starts the query string, and `&` separates parameters. The page number is **state**, so changing it must trigger a new request. That is what the dependency array is for: `[attempt, page]`.

**2. Read the header.** The response object has `headers`. `get` finds a header by name, ignoring upper and lower case, and always gives you text (or `null`):

```jsx
const count = Number(res.headers.get('X-Total-Count'));
const data = await res.json();
return { data: data, count: count };
```

We return both values from the first `.then`, and the next `.then` receives them in `result.data` and `result.count`. (The callback is `async` so we can use `await` inside it.)

**3. Calculate the pages.** With 5 people and a page size of 2:

```jsx
const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE)); // Math.ceil(2.5) is 3
```

`Math.ceil` rounds up, because a partial last page is still a page. `Math.max(1, ...)` keeps it at least 1 while the total is still 0.

**4. The buttons.** Previous goes back, Next goes forward. Disable them at the edges instead of hiding them, so the layout does not jump:

```jsx
<button disabled={page <= 1} onClick={() => goToPage(page - 1)}>Previous</button>
<button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>Next</button>
```

`goToPage` also clears the selection, because the selected person may not be on the new page. (A bigger app would fetch that person by id with `GET /users/:id`.)

**5. A bug you will meet.** Our demo effect runs when `status` becomes `'ready'`. Opening page 3 makes the status `'ready'` again, so the demo would save a city again! A **ref** fixes this. `useRef(false)` gives you a box, `demoDone.current`, that survives renders but does not cause a re-render when you change it. Perfect for "has this already happened?" flags.

**6. Search and pages.** Our search box still filters only the people on the current page, because the data in memory is the current page. For a real directory you would send the search to the server (for example `?q=lov`) so it searches everybody. That is a good extension for later.

## What you should see

The app opens on page 2: Alan Turing and Katherine Johnson. Alan is selected, his city was saved as Cambridge, and his todos show `1 of 2 done`. The pager reads `Page 2 of 3`. Click Previous or Next to move around.

> **Watch out:**
> - `_page` starts at 1, not 0. Page 0 gives you nothing useful.
> - `res.headers.get(...)` returns text. Without `Number(...)` the maths `total / PAGE_SIZE` still works, but comparisons like `page >= total` would compare a number with text.
> - Forgetting `page` in the dependency array: the buttons change the number, but nothing is requested.
> - Showing page numbers that do not exist: always check against `totalPages`.
> - Browsers only expose some headers to scripts on other websites (CORS). A real server must list `X-Total-Count` in `Access-Control-Expose-Headers`; the practice server does it for you.

> **Your turn:** follow the `TODO` list: add the paging constants, `page` and `total` state, the paged URL, read `X-Total-Count`, compute `totalPages`, write `goToPage`, add the pager, and guard the demo with a ref. The page must open on `Page 2 of 3` showing `5 people in total`, with Alan Turing selected and saved as Cambridge.
