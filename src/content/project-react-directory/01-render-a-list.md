---
title: 'Step 1: Render a list of people'
summary: Show a hard-coded array of people on the page with a React component, map and keys.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      import './styles.css';

      // Step 1: a hard-coded list of people.
      //
      // TODO 1: create a constant PEOPLE: an array of three objects with the fields
      //         id, name, email, role and city:
      //           1  Ada Lovelace   ada@example.com    admin   London
      //           2  Grace Hopper   grace@example.com  editor  New York
      //           3  Alan Turing    alan@example.com   viewer  London
      //
      // TODO 2: below the h1 add a paragraph (class "count") that shows how many people
      //         there are, like:  3 people   (use PEOPLE.length inside curly braces)
      //
      // TODO 3: add a ul with class "people". Use PEOPLE.map(...) to make one li per person.
      //         Every li needs  key={person.id}  and the class "person".
      //         Inside the li put this structure (the CSS for it is already written):
      //           <div className="person-row">
      //             <div className="who">
      //               <strong>name</strong>
      //               <span className="email">email</span>
      //             </div>
      //             <div className="meta">
      //               <span className="badge">role</span>
      //               <span className="city">city</span>
      //             </div>
      //           </div>

      function App() {
        return (
          <main className="app">
            <h1>People Directory</h1>
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
      - 3 people
      - Ada Lovelace
      - Grace Hopper
      - Alan Turing
      - ada@example.com
      - London
    selectors:
      - main.app h1
      - ul.people > li.person:nth-child(3)
      - li.person .badge
  code:
    - pattern: PEOPLE\.map\(
      message: Turn the array into list items with PEOPLE.map(...).
    - pattern: key=\{\s*person\.id\s*\}
      message: 'Every list item needs a key: key={person.id}.'
    - pattern: PEOPLE\.length
      message: Show the number of people with {PEOPLE.length}.
hints:
  - A React component returns JSX. To show many items, put the data in an array of objects and use array.map(...) inside curly braces to turn each object into an li.
  - Inside the ul write {PEOPLE.map((person) => ( <li key={person.id} className="person"> ... </li> ))}. Curly braces in JSX let you use JavaScript, such as {person.name}.
  - <ul className="people">{PEOPLE.map((person) => (<li key={person.id} className="person"><div className="person-row"><div className="who"><strong>{person.name}</strong><span className="email">{person.email}</span></div><div className="meta"><span className="badge">{person.role}</span><span className="city">{person.city}</span></div></div></li>))}</ul>
solution:
  - name: App.jsx
    code: |
      import './styles.css';

      // Step 1: a hard-coded list of people.
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
quiz:
  - q: What does the key prop on each li help React with?
    options:
      - It makes the item clickable
      - It tells React which item is which when the list changes
      - It sets the CSS class
    answer: 1
  - q: How do you put a JavaScript value, such as person.name, into JSX?
    options:
      - 'With double quotes: "person.name"'
      - 'With dollar and brackets: $(person.name)'
      - 'With curly braces: {person.name}'
    answer: 2
  - q: What does PEOPLE.map((person) => <li>...</li>) return?
    options:
      - A new array with one li element per person, which React can render
      - The first person
      - A number
    answer: 0
---
Welcome to the second project of the academy. Over eight steps you will build a **People Directory**: a React app that loads people from a web API, handles loading and errors, searches, shows details, edits data and pages through results. It is the same shape as thousands of real dashboards and admin tools.

Every step starts with the finished code of the previous step and a list of `TODO` comments. The file `styles.css` is complete from the first minute, so you can focus on React.

## Where we are

We are at the start. The preview shows an empty page with a heading. By the end of this step it will show a list of three people.

## What we will add, and why it matters

Every data-driven screen has the same core: **a list of things, one row for each**. Before connecting to a server we use a simple array inside the code. This lets us practise the real skill: describing the screen as a function of the data. If the array has five items, the screen shows five rows. React calls this *declarative* UI: you say *what* the screen looks like for the data, and React works out how to update it.

## Guided walk-through

**1. The data.** A person is an object, and a directory is an array of them. Put it above the component:

```jsx
const PEOPLE = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', role: 'admin', city: 'London' },
  // ... two more
];
```

Every object has an `id`. Real data from a database always does, and we will need it in a moment.

**2. Show a number in JSX.** Curly braces switch from JSX back to JavaScript:

```jsx
<p className="count">{PEOPLE.length} people</p>
```

Remember that JSX uses `className` instead of `class`, because `class` is a reserved word in JavaScript.

**3. Turn the array into rows with `map`.** `array.map(fn)` calls your function for each item and returns a new array with the results. React can render an array of elements:

```jsx
<ul className="people">
  {PEOPLE.map((person) => (
    <li key={person.id} className="person">
      ...
    </li>
  ))}
</ul>
```

Walk through it. `PEOPLE.map(...)` is JavaScript, so it sits in braces. For each `person` we return an `li`. The arrow function uses parentheses `( ... )` around the JSX so it returns it without needing the word `return`.

**4. The `key`.** React asks every item in a list for a `key`: a unique and stable identity, such as the id. When the list changes later (a search removes two rows, a new person appears) React uses keys to decide which rows to keep, move or delete. Never use the array index as a key when the list can change order.

**5. Fill the row.** Inside the `li` use the structure from the `TODO` comment. `{person.name}`, `{person.email}`, `{person.role}` and `{person.city}` fill in the values. The class names match the finished CSS.

## What you should see

A counter, `3 people`, and three cards, each with the name, the email, a small role badge and the city.

> **Watch out:**
> - `Warning: Each child in a list should have a unique "key" prop.` appears in the console if you forget the key.
> - Writing `PEOPLE.map(...)` without curly braces prints the text `PEOPLE.map(...)` on the page instead of the list.
> - `class="person"` should be `className="person"`.
> - Using `{ }` around an object, such as `{person}`, gives `Objects are not valid as a React child`. Show the fields, not the whole object.
> - Parentheses versus braces: `(person) => ( <li>..</li> )` returns the li, but `(person) => { <li>..</li> }` returns nothing.

> **Your turn:** follow the three `TODO` comments in `App.jsx`: add the `PEOPLE` array with three people, a counter paragraph, and a `ul.people` with one `li.person` per person with a key and the structure from the comment. The page must show "3 people" and the names Ada Lovelace, Grace Hopper and Alan Turing.
