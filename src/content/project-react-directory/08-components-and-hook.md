---
title: 'Step 8: Refactor into components and a useUsers hook'
summary: Split the finished app into small components and a custom hook, without changing what it does.
level: advanced
export:
  kind: vite-react
  name: people-directory
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef } from 'react';
      import './styles.css';

      // Step 8: refactor into components and a custom hook. The page must look and work exactly the same.
      //
      // TODO 4 (this file): import { useUsers, API } from './useUsers';  import UserList from './UserList';
      //         import UserDetail from './UserDetail';  (and drop the imports that are no longer needed).
      // TODO 5: delete the API constant, the users state (people, total, status, error, attempt), the users
      //         effect, the todos state and effect, CityForm, and the inline list/detail JSX.
      //         Keep: page, query, selectedId, token, notice, the sign-in effect, saveCity, the demo effect, goToPage.
      // TODO 6: call  const { people, total, status, error, retry, replaceUser } = useUsers(page, PAGE_SIZE);
      //         In saveCity use replaceUser(updated) instead of setPeople. The Retry button uses onClick={retry}.
      //         Render <UserList ... /> and <UserDetail person={selected} canSave={Boolean(token)} notice={notice} onSave={saveCity} />.
      //         Hint: the search query stays in App, so UserList receives query and onQueryChange as props.
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
  - name: UserList.jsx
    code: |
      // TODO 2: create the list component here.
      //
      // function UserList({ people, total, query, onQueryChange, selectedId, onSelect }) { ... }
      // It computes `visible` from people and query, and returns the label, the controlled search input,
      // the count line ("N people in total. Showing X of Y on this page.") and the ul.people list.
      // Typing calls onQueryChange(e.target.value); clicking a person calls onSelect(person.id).
      // Finish the file with:  export default UserList;
  - name: UserDetail.jsx
    code: |
      // TODO 3: create the detail panel here.
      //
      // - import { useState, useEffect } from 'react'; and import { API } from './useUsers';
      // - move the CityForm component into this file
      // - function UserDetail({ person, canSave, notice, onSave }) { ... } owns the todos state and the
      //   todos effect (dependency: the person's id). It returns the <aside className="detail"> with the
      //   details, the CityForm (key={person.id}), the notice and the todos.
      //   When person is undefined it shows the hint "Select a person to see their todos."
      // - finish the file with:  export default UserDetail;
  - name: useUsers.js
    code: |
      // TODO 1: create the custom hook here.
      //
      // - import { useState, useEffect } from 'react';
      // - export const API = 'https://api.academy.test';
      // - move FAIL_FIRST_TRY (false) here
      // - export function useUsers(page, pageSize) { ... } that owns the state people, total, status,
      //   error and attempt, and the whole fetch effect (with [attempt, page, pageSize]).
      //   It also defines retry() { setAttempt(attempt + 1) } and
      //   replaceUser(user) { setPeople((list) => list.map(...)) }
      //   and returns { people, total, status, error, retry, replaceUser }.
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
      - Alan Turing
      - Katherine Johnson
      - Page 2 of 3
      - 5 people in total
      - Cambridge
      - Saved city for Alan Turing
      - Crack the cipher
      - 1 of 2 done
    selectors:
      - nav.pager button.next
      - li.person.selected
      - aside.detail form.city-form
      - ul.todos > li.done
  code:
    - file: useUsers.js
      pattern: export\s+function\s+useUsers\s*\(
      message: 'In useUsers.js write: export function useUsers(page, pageSize) { ... }'
    - file: useUsers.js
      pattern: useEffect\(
      message: The fetch effect now lives inside the hook.
    - file: useUsers.js
      pattern: _page=
      message: Build the paged URL inside the hook.
    - file: useUsers.js
      pattern: return\s*\{[^}]*people[^}]*status
      message: Return an object with people, status and the other values from the hook.
    - file: UserList.jsx
      pattern: export\s+default
      message: 'End UserList.jsx with: export default UserList;'
    - file: UserDetail.jsx
      pattern: export\s+default
      message: 'End UserDetail.jsx with: export default UserDetail;'
    - file: UserDetail.jsx
      pattern: /todos
      message: The todos request belongs to UserDetail.
    - file: App.jsx
      pattern: from\s+['"]\./useUsers['"]
      message: 'Import the hook in App.jsx: import { useUsers, API } from ''./useUsers'';'
    - file: App.jsx
      pattern: from\s+['"]\./UserList['"]
      message: Import UserList in App.jsx.
    - file: App.jsx
      pattern: from\s+['"]\./UserDetail['"]
      message: Import UserDetail in App.jsx.
    - file: App.jsx
      pattern: ^(?![\s\S]*_page=)
      message: 'App.jsx should no longer build the paged URL: that is the hook''s job.'
hints:
  - Move code, do not rewrite it. useUsers.js gets the users state and the big fetch effect and returns what App needs; UserList.jsx gets the search box and the ul; UserDetail.jsx gets the aside, CityForm and the todos effect. Each file ends with an export, and App imports them.
  - 'A custom hook is a normal function whose name starts with use and that calls other hooks. export function useUsers(page, pageSize) { const [people, setPeople] = useState([]); ... useEffect(...); return { people, total, status, error, retry, replaceUser }; }  In App: const { people, total, status, error, retry, replaceUser } = useUsers(page, PAGE_SIZE);'
  - 'App.jsx: import { useUsers, API } from ''./useUsers''; import UserList from ''./UserList''; import UserDetail from ''./UserDetail'';   <UserList people={people} total={total} query={query} onQueryChange={setQuery} selectedId={selectedId} onSelect={setSelectedId} />   <UserDetail person={selected} canSave={Boolean(token)} notice={notice} onSave={saveCity} />'
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef } from 'react';
      import { useUsers, API } from './useUsers';
      import UserList from './UserList';
      import UserDetail from './UserDetail';
      import './styles.css';

      // Step 8: the finished app, split into a hook and components.
      const PAGE_SIZE = 2;
      const DEMO_PAGE = 2; // the app opens on this page
      const DEMO_SELECTED = 3; // this person (id) is selected at the start; null means nobody
      const DEMO_CITY = 'Cambridge'; // saved for the selected person after sign-in; '' switches the demo off

      function App() {
        const [page, setPage] = useState(DEMO_PAGE);
        const [query, setQuery] = useState('');
        const [selectedId, setSelectedId] = useState(DEMO_SELECTED);
        const [token, setToken] = useState(null);
        const [notice, setNotice] = useState('');

        // All the loading logic lives in the hook.
        const { people, total, status, error, retry, replaceUser } = useUsers(page, PAGE_SIZE);

        // Sign in once. (A real app shows a login form.)
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
            replaceUser(updated);
            setNotice('Saved city for ' + updated.name);
          } catch (err) {
            setNotice('Could not save: ' + err.message);
          }
        }

        // Demo: save DEMO_CITY once, when we are signed in and the people are loaded.
        const demoDone = useRef(false);
        useEffect(() => {
          if (DEMO_CITY && DEMO_SELECTED !== null && token && status === 'ready' && !demoDone.current) {
            demoDone.current = true;
            saveCity(DEMO_SELECTED, DEMO_CITY);
          }
        }, [token, status]);

        function goToPage(number) {
          setPage(number);
          setSelectedId(null);
          setNotice('');
        }

        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        const selected = people.find((person) => person.id === selectedId);

        let content;
        if (status === 'loading') {
          content = <p className="loading">Loading people...</p>;
        } else if (status === 'error') {
          content = (
            <div className="error" role="alert">
              <p>Could not load people: {error}</p>
              <button type="button" className="retry" onClick={retry}>
                Retry
              </button>
            </div>
          );
        } else {
          content = (
            <div className="layout">
              <section>
                <UserList
                  people={people}
                  total={total}
                  query={query}
                  onQueryChange={setQuery}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
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

              <UserDetail person={selected} canSave={Boolean(token)} notice={notice} onSave={saveCity} />
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
  - name: UserList.jsx
    code: |
      // The search box and the list of people. It only shows what it is given (props)
      // and tells its parent what the user did (onQueryChange, onSelect).
      function UserList({ people, total, query, onQueryChange, selectedId, onSelect }) {
        const needle = query.trim().toLowerCase();
        const visible = people.filter(
          (person) => person.name.toLowerCase().includes(needle) || person.city.toLowerCase().includes(needle)
        );

        return (
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
              onChange={(e) => onQueryChange(e.target.value)}
            />
            <p className="count">
              {total} people in total. Showing {visible.length} of {people.length} on this page.
            </p>

            {visible.length === 0 ? (
              <p className="hint">No people match "{query}".</p>
            ) : (
              <ul className="people">
                {visible.map((person) => (
                  <li key={person.id} className={person.id === selectedId ? 'person selected' : 'person'}>
                    <button
                      type="button"
                      className="person-row"
                      aria-pressed={person.id === selectedId}
                      onClick={() => onSelect(person.id)}
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
          </>
        );
      }

      export default UserList;
  - name: UserDetail.jsx
    code: |
      import { useState, useEffect } from 'react';
      import { API } from './useUsers';

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

      // The detail panel. It loads the todos of whoever it is given.
      function UserDetail({ person, canSave, notice, onSave }) {
        const [todos, setTodos] = useState([]);
        const [todosStatus, setTodosStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'ready'
        const personId = person ? person.id : null;

        useEffect(() => {
          if (personId === null) {
            setTodos([]);
            setTodosStatus('idle');
            return;
          }
          let cancelled = false;
          setTodosStatus('loading');

          fetch(API + '/users/' + personId + '/todos')
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
        }, [personId]);

        if (!person) {
          return (
            <aside className="detail">
              <p className="hint">Select a person to see their todos.</p>
            </aside>
          );
        }

        const doneCount = todos.filter((todo) => todo.done).length;

        return (
          <aside className="detail">
            <h2>{person.name}</h2>
            <dl>
              <dt>Email</dt>
              <dd>{person.email}</dd>
              <dt>Role</dt>
              <dd>{person.role}</dd>
              <dt>City</dt>
              <dd>{person.city}</dd>
            </dl>

            <CityForm key={person.id} person={person} canSave={canSave} onSave={onSave} />
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
          </aside>
        );
      }

      export default UserDetail;
  - name: useUsers.js
    code: |
      import { useState, useEffect } from 'react';

      export const API = 'https://api.academy.test';

      // Testing switch: when true, the FIRST request goes to /error/500 on purpose.
      const FAIL_FIRST_TRY = false;

      // A custom hook: loads one page of users and hides all the details of fetching.
      // It returns everything a component needs and nothing it does not.
      export function useUsers(page, pageSize) {
        const [people, setPeople] = useState([]);
        const [total, setTotal] = useState(0);
        const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
        const [error, setError] = useState('');
        const [attempt, setAttempt] = useState(0);

        useEffect(() => {
          let cancelled = false;
          setStatus('loading');

          const url =
            FAIL_FIRST_TRY && attempt === 0
              ? API + '/error/500'
              : API + '/users?_page=' + page + '&_limit=' + pageSize;

          fetch(url)
            .then(async (res) => {
              if (!res.ok) {
                throw new Error('HTTP ' + res.status);
              }
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
        }, [attempt, page, pageSize]);

        function retry() {
          setAttempt(attempt + 1);
        }

        // Put an updated person (from the server) into the list.
        function replaceUser(user) {
          setPeople((list) => list.map((person) => (person.id === user.id ? user : person)));
        }

        return { people, total, status, error, retry, replaceUser };
      }
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
  - q: What is a custom hook?
    options:
      - A function whose name starts with use and that calls other hooks, so stateful logic can be reused and kept out of components
      - A special kind of component
      - A built-in React function for fetching data
    answer: 0
  - q: What is the goal of a refactoring like this one?
    options:
      - Change what the app does
      - Make the code easier to read, test and change while the behaviour stays exactly the same
      - Make the bundle larger
    answer: 1
  - q: Why does UserList receive query and onQueryChange as props instead of keeping its own query state?
    options:
      - Props are always faster
      - React forbids state in child components
      - The state stays in App, so it survives while the page is loading and UserList is replaced by the loading message
    answer: 2
    explain: State belongs in the nearest parent that needs to keep it. The list disappears while a new page loads, and its own state would disappear with it.
---
Your directory works. Now comes the step that separates a student project from professional code: **making it easy to live with**. A single file with 250 lines mixing network calls, forms and layout is hard to read and scary to change. In this final step you will split it into a custom hook and three components. Nothing visible changes, and that is the point.

## Where we are

`App.jsx` does everything: loads users with paging and errors, signs in, saves cities, loads todos, searches, and draws all of it. It works, but when you want to change anything you have to read everything.

## What we will add, and why it matters

*Refactoring* means changing the structure of code without changing its behaviour. Two tools do most of the work in React:

- **Components** split the *screen*: each one gets some data through props and returns JSX. Small components have a clear name, one job and are easy to reuse.
- **Custom hooks** split the *logic*: a function named `useSomething` that uses `useState` and `useEffect` inside and returns the results. A component that calls `useUsers(page, 2)` does not need to know that fetch, headers and cancelling exist.

When your teammates need the user list on another page, they call the same hook instead of copying 40 lines.

## Guided walk-through

**1. Extract the hook, `useUsers.js`.** Cut the users state (`people`, `total`, `status`, `error`, `attempt`), the big effect and the `FAIL_FIRST_TRY` switch from `App.jsx` and paste them into a function:

```jsx
export function useUsers(page, pageSize) {
  const [people, setPeople] = useState([]);
  // ... the other state and the fetch effect, now using pageSize ...
  function retry() { setAttempt(attempt + 1); }
  function replaceUser(user) { setPeople((list) => list.map((p) => (p.id === user.id ? user : p))); }
  return { people, total, status, error, retry, replaceUser };
}
```

The rules of hooks still apply: call hooks at the top level of the function and never inside conditions or loops. The hook receives `page` and `pageSize` as arguments, and its effect depends on them. Also `export const API` from this file so other files can reuse the address.

**2. Use it in `App`.** One line replaces about fifty:

```jsx
const { people, total, status, error, retry, replaceUser } = useUsers(page, PAGE_SIZE);
```

This is *destructuring*: it pulls the properties out of the returned object into variables. `saveCity` now calls `replaceUser(updated)` instead of `setPeople`.

**3. Extract `UserList.jsx`.** It receives everything as props and reports events upward:

```jsx
function UserList({ people, total, query, onQueryChange, selectedId, onSelect }) { ... }
export default UserList;
```

It calculates `visible` itself, because only the list cares. The query text stays in `App` (lifting state up): while a new page loads, `App` shows the loading message and the list is removed from the screen, and any state inside it would be thrown away.

**4. Extract `UserDetail.jsx`.** The panel owns the todos state and the todos effect (its dependency is the person's id, so it reloads when the selection changes). The small `CityForm` moves with it, since nobody else uses it. It imports `API` from the hook file.

**5. Wire it together.** `App` keeps what must be shared: page, query, selection, token, notice, sign-in, saving and the demo. Its JSX becomes short and readable:

```jsx
<UserList people={people} total={total} query={query} onQueryChange={setQuery} selectedId={selectedId} onSelect={setSelectedId} />
<UserDetail person={selected} canSave={Boolean(token)} notice={notice} onSave={saveCity} />
```

**6. Check that nothing changed.** The page must show exactly what it showed in step 7. The check also reads your files: the hook must contain the fetch logic and the paged URL, and `App.jsx` must import the three new modules.

> **Watch out:**
> - Forgetting `export default UserList;` gives `Cannot read properties of undefined` or an `undefined` component error, depending on the import.
> - A hook name must start with `use`. Without it the rules-of-hooks tools cannot protect you.
> - Moving state into a child that gets unmounted resets it (like the search text). Decide who owns each piece of state.
> - Import paths: `'./useUsers'` and `'./UserList'` need the `./`. Without it React thinks you mean a package.
> - Refactor in small steps and run after each: move one piece, check the page, move the next.

> **Your turn:** follow the TODO comments in the four files: write `useUsers.js`, `UserList.jsx` and `UserDetail.jsx` with the code moved out of `App.jsx`, then simplify `App.jsx` so that it imports and uses them. The page must still open on page 2 with Alan Turing selected, saved as Cambridge, and `Page 2 of 3`.

## What to build next

You have built a complete, realistic front end. Ideas to go further: send the search text to the server with `?q=` and add a short delay (debounce) while typing; add a "New person" form with `POST /users` and a Delete button with `DELETE /users/:id`; mark todos done with `PATCH /todos/:id`; keep the selected person and page in the URL; write a `useTodos(personId)` hook; and replace the demo sign-in by a real login form that stores the token. The next project in the academy, the API Client Library, shows how to build a proper request helper with retries and typed errors that this app could share.
