---
title: 'Step 7: Saving and restoring with JSON'
summary: Turn the task array into JSON text, store it, and bring it back on the next visit.
level: advanced
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>My Tasks</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <main class="app">
          <h1>My Tasks</h1>

          <form id="task-form">
            <label for="task-input">New task</label>
            <input id="task-input" type="text" placeholder="What needs doing?" autocomplete="off">
            <button type="submit">Add</button>
          </form>

          <div id="filters" class="filters" role="group" aria-label="Filter tasks">
            <button type="button" data-filter="all" class="active">All</button>
            <button type="button" data-filter="active">Active</button>
            <button type="button" data-filter="done">Done</button>
          </div>

          <ul id="task-list"></ul>

          <p id="empty-message" class="empty">Nothing to do. Enjoy your day!</p>
          <p id="counter" class="counter"></p>

          <!-- TODO 1: below the counter add a details element (class "saved") with a summary
               "Saved data (JSON text)" and a pre with id "saved-json". It will show the saved text. -->
        </main>

        <script src="script.js"></script>
      </body>
      </html>
  - name: style.css
    code: |
      /* Step 2: the look of the app */

      :root {
        --bg: #f3f4f6;
        --card: #ffffff;
        --text: #1f2937;
        --muted: #6b7280;
        --primary: #6d5efc;
        --border: #d1d5db;
        --radius: 12px;
        --space: 16px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 32px var(--space);
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        line-height: 1.5;
      }

      .app {
        max-width: 480px;
        margin: 0 auto;
        padding: 24px;
        background: var(--card);
        border-radius: var(--radius);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      h1 {
        margin: 0 0 var(--space);
        font-size: 1.75rem;
      }

      #task-form {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      #task-form label {
        flex-basis: 100%;
        font-size: 0.9rem;
        font-weight: 600;
      }

      #task-form input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font: inherit;
      }

      #task-form input:focus {
        outline: 2px solid var(--primary);
        outline-offset: 1px;
      }

      button[type="submit"] {
        padding: 10px 18px;
        border: 0;
        border-radius: 8px;
        background: var(--primary);
        color: #ffffff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      button[type="submit"]:hover {
        filter: brightness(1.1);
      }

      .filters {
        display: flex;
        gap: 8px;
        margin-top: var(--space);
      }

      .filters button {
        padding: 6px 14px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: transparent;
        color: var(--text);
        font: inherit;
        font-size: 0.9rem;
        cursor: pointer;
      }

      .filters button.active {
        border-color: var(--primary);
        background: var(--primary);
        color: #ffffff;
      }

      #task-list {
        margin: var(--space) 0 0;
        padding: 0;
        list-style: none;
      }

      #task-list li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
      }

      .task-text {
        flex: 1;
      }

      #task-list li.done .task-text {
        color: var(--muted);
        text-decoration: line-through;
      }

      .delete {
        padding: 4px 10px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: #dc2626;
        font: inherit;
        cursor: pointer;
      }

      .delete:hover {
        background: #fee2e2;
      }

      .empty {
        margin: var(--space) 0 0;
        padding: 24px 0;
        color: var(--muted);
        text-align: center;
      }

      .counter {
        margin: var(--space) 0 0;
        color: var(--muted);
        font-size: 0.9rem;
      }

      /* TODO 2 (CSS, optional): style .saved (margin-top var(--space), color var(--muted)) and
         #saved-json (padding 10px, border-radius 8px, background var(--bg), white-space pre-wrap). */

      /* The hidden attribute must win over any display rule above. */
      [hidden] {
        display: none !important;
      }
  - name: script.js
    code: |
      // Step 7: saving and restoring the tasks as JSON text
      //
      // A stand-in for localStorage is given below (see the lesson text for why).
      //
      // TODO 1: find #saved-json and store it in a constant named savedJson.
      //
      // TODO 2: write saveTasks(): turn the tasks array into JSON text, store it with
      //         storage.setItem(STORAGE_KEY, text) and show the text in savedJson.
      //
      // TODO 3: write loadTasks(): read the text with storage.getItem(STORAGE_KEY).
      //         If it is null return an empty array. Otherwise turn the text back into
      //         an array (inside try / catch, return an empty array when it fails).
      //
      // TODO 4: write restore(): tasks = loadTasks(), set nextId to (highest id + 1),
      //         then render().
      //
      // TODO 5: write commit() { saveTasks(); render(); } and call commit() (not render())
      //         in addTask, toggleTask and deleteTask. setFilter keeps calling render().
      //
      // TODO 6: at the end of the file replace the lonely render() by restore().
      //         The demo below is already written: it fills the list, "forgets" it and
      //         then calls restore() to bring the tasks back from storage.

      const form = document.querySelector('#task-form');
      const input = document.querySelector('#task-input');
      const list = document.querySelector('#task-list');
      const counter = document.querySelector('#counter');
      const emptyMessage = document.querySelector('#empty-message');
      const filters = document.querySelector('#filters');

      // STORAGE: on a real website you would write   const storage = window.localStorage;
      // The practice sandbox blocks localStorage, so we use a stand-in with the same two methods.
      const storage = {
        data: {},
        setItem(key, value) { this.data[key] = String(value); },
        getItem(key) { return key in this.data ? this.data[key] : null; },
      };
      const STORAGE_KEY = 'tasks';

      // 1. STATE: the data is the single source of truth, the page just shows it.
      let tasks = [];      // each task: { id: 1, text: 'Buy milk', done: false }
      let filter = 'all';  // 'all', 'active' or 'done'
      let nextId = 1;

      // Which tasks match the current filter?
      function visibleTasks() {
        if (filter === 'active') {
          return tasks.filter(function (task) { return !task.done; });
        }
        if (filter === 'done') {
          return tasks.filter(function (task) { return task.done; });
        }
        return tasks;
      }

      // 2. RENDER: rebuild the whole list from the state.
      function render() {
        const shown = visibleTasks();
        list.replaceChildren();

        for (const task of shown) {
          const li = document.createElement('li');
          li.dataset.id = task.id;
          li.classList.toggle('done', task.done);

          const label = document.createElement('span');
          label.className = 'task-text';
          label.textContent = task.text;

          const remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'delete';
          remove.textContent = 'Delete';

          li.append(label, remove);
          list.append(li);
        }

        const left = tasks.filter(function (task) { return !task.done; }).length;
        counter.textContent = left + (left === 1 ? ' task left' : ' tasks left');

        emptyMessage.textContent = tasks.length === 0 ? 'Nothing to do. Enjoy your day!' : 'No tasks in this view.';
        emptyMessage.hidden = shown.length > 0;

        for (const button of filters.querySelectorAll('button')) {
          button.classList.toggle('active', button.dataset.filter === filter);
        }
      }

      // 3. ACTIONS: change the state, then render.
      function addTask(text) {
        tasks.push({ id: nextId++, text: text, done: false });
        render();
      }

      function toggleTask(id) {
        const task = tasks.find(function (t) { return t.id === id; });
        if (task) {
          task.done = !task.done;
          render();
        }
      }

      function deleteTask(id) {
        tasks = tasks.filter(function (t) { return t.id !== id; });
        render();
      }

      function setFilter(name) {
        filter = name;
        render();
      }

      // 4. EVENTS: read the click, call an action.
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const text = input.value.trim();
        if (text === '') {
          return;
        }
        addTask(text);
        input.value = '';
        input.focus();
      });

      list.addEventListener('click', function (event) {
        const li = event.target.closest('li');
        if (!li) {
          return;
        }
        const id = Number(li.dataset.id);
        if (event.target.closest('.delete')) {
          deleteTask(id);
        } else {
          toggleTask(id);
        }
      });

      filters.addEventListener('click', function (event) {
        const button = event.target.closest('button[data-filter]');
        if (button) {
          setFilter(button.dataset.filter);
        }
      });

      render(); // draw the empty page once

      // --- Demo ---
      // The checker cannot click, so the script clicks for us.
      addTask('Buy milk');
      addTask('Read a chapter');
      addTask('Call mum');
      list.querySelector('li').click();                  // tick "Buy milk"
      console.log('Saved text: ' + storage.getItem(STORAGE_KEY));

      tasks = [];       // the page "forgets" everything...
      nextId = 1;
      render();
      restore();        // ...and the next visit loads it back from storage
check:
  output: |
    Saved text: [{"id":1,"text":"Buy milk","done":true},{"id":2,"text":"Read a chapter","done":false},{"id":3,"text":"Call mum","done":false}]
  dom:
    text:
      - Buy milk
      - Read a chapter
      - Call mum
      - 2 tasks left
    selectors:
      - '#task-list li.done'
      - '#task-list li:nth-child(3):last-child'
      - 'details.saved #saved-json'
  code:
    - pattern: JSON\.stringify\(
      message: Turn the array into text with JSON.stringify(tasks).
    - pattern: JSON\.parse\(
      message: Turn the saved text back into data with JSON.parse(text).
    - pattern: storage\.setItem\(
      message: Save with storage.setItem(STORAGE_KEY, text).
    - pattern: storage\.getItem\(
      message: Load with storage.getItem(STORAGE_KEY).
    - pattern: try\s*\{[\s\S]*JSON\.parse
      message: 'Wrap JSON.parse in try / catch: saved text can be damaged.'
hints:
  - 'Storage can only keep text, so you need two translators: JSON.stringify turns your array into text, JSON.parse turns text back into an array. Save every time the tasks change (add, toggle, delete).'
  - 'saveTasks: const text = JSON.stringify(tasks); storage.setItem(STORAGE_KEY, text); savedJson.textContent = text;  loadTasks: const text = storage.getItem(STORAGE_KEY); if (text === null) return []; then try { return JSON.parse(text); } catch (error) { return []; }. restore() also recomputes nextId.'
  - function restore() { tasks = loadTasks(); nextId = tasks.reduce(function (max, t) { return Math.max(max, t.id); }, 0) + 1; render(); }   function commit() { saveTasks(); render(); }   Use commit() in addTask, toggleTask and deleteTask, and call restore() at startup instead of render().
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>My Tasks</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <main class="app">
          <h1>My Tasks</h1>

          <form id="task-form">
            <label for="task-input">New task</label>
            <input id="task-input" type="text" placeholder="What needs doing?" autocomplete="off">
            <button type="submit">Add</button>
          </form>

          <div id="filters" class="filters" role="group" aria-label="Filter tasks">
            <button type="button" data-filter="all" class="active">All</button>
            <button type="button" data-filter="active">Active</button>
            <button type="button" data-filter="done">Done</button>
          </div>

          <ul id="task-list"></ul>

          <p id="empty-message" class="empty">Nothing to do. Enjoy your day!</p>
          <p id="counter" class="counter"></p>

          <details class="saved">
            <summary>Saved data (JSON text)</summary>
            <pre id="saved-json"></pre>
          </details>
        </main>

        <script src="script.js"></script>
      </body>
      </html>
  - name: style.css
    code: |
      /* Step 2: the look of the app */

      :root {
        --bg: #f3f4f6;
        --card: #ffffff;
        --text: #1f2937;
        --muted: #6b7280;
        --primary: #6d5efc;
        --border: #d1d5db;
        --radius: 12px;
        --space: 16px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 32px var(--space);
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        line-height: 1.5;
      }

      .app {
        max-width: 480px;
        margin: 0 auto;
        padding: 24px;
        background: var(--card);
        border-radius: var(--radius);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      h1 {
        margin: 0 0 var(--space);
        font-size: 1.75rem;
      }

      #task-form {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      #task-form label {
        flex-basis: 100%;
        font-size: 0.9rem;
        font-weight: 600;
      }

      #task-form input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font: inherit;
      }

      #task-form input:focus {
        outline: 2px solid var(--primary);
        outline-offset: 1px;
      }

      button[type="submit"] {
        padding: 10px 18px;
        border: 0;
        border-radius: 8px;
        background: var(--primary);
        color: #ffffff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      button[type="submit"]:hover {
        filter: brightness(1.1);
      }

      .filters {
        display: flex;
        gap: 8px;
        margin-top: var(--space);
      }

      .filters button {
        padding: 6px 14px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: transparent;
        color: var(--text);
        font: inherit;
        font-size: 0.9rem;
        cursor: pointer;
      }

      .filters button.active {
        border-color: var(--primary);
        background: var(--primary);
        color: #ffffff;
      }

      #task-list {
        margin: var(--space) 0 0;
        padding: 0;
        list-style: none;
      }

      #task-list li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
      }

      .task-text {
        flex: 1;
      }

      #task-list li.done .task-text {
        color: var(--muted);
        text-decoration: line-through;
      }

      .delete {
        padding: 4px 10px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: #dc2626;
        font: inherit;
        cursor: pointer;
      }

      .delete:hover {
        background: #fee2e2;
      }

      .empty {
        margin: var(--space) 0 0;
        padding: 24px 0;
        color: var(--muted);
        text-align: center;
      }

      .counter {
        margin: var(--space) 0 0;
        color: var(--muted);
        font-size: 0.9rem;
      }

      /* The hidden attribute must win over any display rule above. */
      [hidden] {
        display: none !important;
      }

      .saved {
        margin-top: var(--space);
        color: var(--muted);
        font-size: 0.85rem;
      }

      .saved summary {
        cursor: pointer;
      }

      #saved-json {
        margin: 8px 0 0;
        padding: 10px;
        border-radius: 8px;
        background: var(--bg);
        white-space: pre-wrap;
        word-break: break-all;
      }
  - name: script.js
    code: |
      // Step 7: saving and restoring the tasks as JSON text

      const form = document.querySelector('#task-form');
      const input = document.querySelector('#task-input');
      const list = document.querySelector('#task-list');
      const counter = document.querySelector('#counter');
      const emptyMessage = document.querySelector('#empty-message');
      const filters = document.querySelector('#filters');
      const savedJson = document.querySelector('#saved-json');

      // 0. STORAGE
      // On a real website you would use the browser's built-in storage and write:
      //     const storage = window.localStorage;
      // The practice sandbox blocks localStorage (it throws an error), so we use a tiny
      // stand-in object with the same two methods. Everything else stays identical.
      const storage = {
        data: {},
        setItem(key, value) { this.data[key] = String(value); },
        getItem(key) { return key in this.data ? this.data[key] : null; },
      };
      const STORAGE_KEY = 'tasks';

      // 1. STATE: the data is the single source of truth, the page just shows it.
      let tasks = [];      // each task: { id: 1, text: 'Buy milk', done: false }
      let filter = 'all';  // 'all', 'active' or 'done'
      let nextId = 1;

      // Which tasks match the current filter?
      function visibleTasks() {
        if (filter === 'active') {
          return tasks.filter(function (task) { return !task.done; });
        }
        if (filter === 'done') {
          return tasks.filter(function (task) { return task.done; });
        }
        return tasks;
      }

      // 2. RENDER: rebuild the whole list from the state.
      function render() {
        const shown = visibleTasks();
        list.replaceChildren();

        for (const task of shown) {
          const li = document.createElement('li');
          li.dataset.id = task.id;
          li.classList.toggle('done', task.done);

          const label = document.createElement('span');
          label.className = 'task-text';
          label.textContent = task.text;

          const remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'delete';
          remove.textContent = 'Delete';

          li.append(label, remove);
          list.append(li);
        }

        const left = tasks.filter(function (task) { return !task.done; }).length;
        counter.textContent = left + (left === 1 ? ' task left' : ' tasks left');

        emptyMessage.textContent = tasks.length === 0 ? 'Nothing to do. Enjoy your day!' : 'No tasks in this view.';
        emptyMessage.hidden = shown.length > 0;

        for (const button of filters.querySelectorAll('button')) {
          button.classList.toggle('active', button.dataset.filter === filter);
        }
      }

      // 3. SAVE AND RESTORE
      // Turn the array into JSON text and keep it.
      function saveTasks() {
        const text = JSON.stringify(tasks);
        storage.setItem(STORAGE_KEY, text);
        savedJson.textContent = text;
      }

      // Read the text back and turn it into an array. Never trust stored text blindly.
      function loadTasks() {
        const text = storage.getItem(STORAGE_KEY);
        if (text === null) {
          return [];
        }
        try {
          const data = JSON.parse(text);
          return Array.isArray(data) ? data : [];
        } catch (error) {
          return [];   // the text was damaged: start fresh
        }
      }

      // Load the saved tasks, pick a new id that is not used yet, draw the page.
      function restore() {
        tasks = loadTasks();
        nextId = tasks.reduce(function (max, t) { return Math.max(max, t.id); }, 0) + 1;
        render();
      }

      // 4. ACTIONS: change the state, save it, then render.
      function commit() {
        saveTasks();
        render();
      }

      function addTask(text) {
        tasks.push({ id: nextId++, text: text, done: false });
        commit();
      }

      function toggleTask(id) {
        const task = tasks.find(function (t) { return t.id === id; });
        if (task) {
          task.done = !task.done;
          commit();
        }
      }

      function deleteTask(id) {
        tasks = tasks.filter(function (t) { return t.id !== id; });
        commit();
      }

      function setFilter(name) {
        filter = name;
        render();
      }

      // 5. EVENTS: read the click, call an action.
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const text = input.value.trim();
        if (text === '') {
          return;
        }
        addTask(text);
        input.value = '';
        input.focus();
      });

      list.addEventListener('click', function (event) {
        const li = event.target.closest('li');
        if (!li) {
          return;
        }
        const id = Number(li.dataset.id);
        if (event.target.closest('.delete')) {
          deleteTask(id);
        } else {
          toggleTask(id);
        }
      });

      filters.addEventListener('click', function (event) {
        const button = event.target.closest('button[data-filter]');
        if (button) {
          setFilter(button.dataset.filter);
        }
      });

      restore(); // a new visit: load whatever was saved before

      // --- Demo: pretend the visitor leaves the page and comes back later ---
      addTask('Buy milk');
      addTask('Read a chapter');
      addTask('Call mum');
      list.querySelector('li').click();                  // tick "Buy milk"
      console.log('Saved text: ' + storage.getItem(STORAGE_KEY));

      tasks = [];       // the page "forgets" everything...
      nextId = 1;
      render();
      restore();        // ...and the next visit loads it back from storage
quiz:
  - q: What does JSON.stringify(tasks) return?
    options:
      - A copy of the array
      - The number of tasks
      - A text (string) describing the array that can be stored or sent
    answer: 2
  - q: Why do we wrap JSON.parse in try / catch?
    options:
      - Because stored text could be empty or damaged, and JSON.parse throws an error for invalid JSON
      - Because JSON.parse is very slow
      - Because try / catch makes the result a number
    answer: 0
  - q: On a real website, what would the two lines that save and load the tasks look like?
    options:
      - window.save(tasks) and window.load()
      - localStorage.setItem('tasks', JSON.stringify(tasks)) and JSON.parse(localStorage.getItem('tasks'))
      - document.cookie = tasks and document.cookie.tasks
    answer: 1
---
Close the browser tab and your tasks vanish. In this step you will make them survive. Saving data is a skill you will use in every app you build, and it comes down to one idea: **turn your data into text, keep the text, and turn it back later**.

## Where we are

All the logic lives in the `tasks` array and `render()`. The filters work. But the array is only in memory, so a page reload starts empty.

## What we will add, and why it matters

Browsers can store small pieces of text for a website. The most common place is `localStorage`: key and value pairs that stay after the tab is closed. It only stores **strings**, so an array of objects has to be converted. The standard format for that is **JSON** (JavaScript Object Notation), a text version of arrays and objects, such as `[{"id":1,"text":"Buy milk","done":true}]`. It is also the format almost every web API speaks, including the practice server you will meet in the React project.

## Guided walk-through

**1. The two translators.**

```js
const text = JSON.stringify(tasks);   // array of objects -> string
const back = JSON.parse(text);        // string -> array of objects
```

`stringify` and `parse` are exact opposites. Functions and some special values cannot be stored, but our tasks (numbers, text, booleans) are all fine.

**2. localStorage on a real site.** On your own website, saving and loading takes exactly two lines:

```js
localStorage.setItem('tasks', JSON.stringify(tasks));
tasks = JSON.parse(localStorage.getItem('tasks')) || [];
```

`setItem(key, text)` stores the text under a name. `getItem(key)` returns the text, or `null` when nothing was saved yet. `JSON.parse(null)` gives `null`, and `null || []` falls back to an empty array.

**3. Why this lesson uses a stand-in.** The preview you are using runs inside a **sandboxed iframe**, a locked box that stops lesson code from touching the real browser storage. In it, `localStorage` throws a `SecurityError`. So we create a small object with the same two methods, `setItem` and `getItem`, that keeps the text in a variable:

```js
const storage = { data: {}, setItem(k, v) { this.data[k] = String(v); }, getItem(k) { return k in this.data ? this.data[k] : null; } };
```

All the rest of the code calls `storage.setItem(...)` and `storage.getItem(...)`. When you copy the project to a real website, replace that one object with `const storage = window.localStorage;` and everything keeps working. Good code isolates this kind of dependency in one place.

**4. Save on every change.** Add `commit()`, which saves and then renders, and call it from `addTask`, `toggleTask` and `deleteTask`. `setFilter` only changes how things look, so it keeps calling `render()`.

**5. Load carefully.** Text that comes from outside your program can be missing, empty or damaged, so `loadTasks()` must not crash:

```js
function loadTasks() {
  const text = storage.getItem(STORAGE_KEY);
  if (text === null) return [];
  try { return JSON.parse(text); } catch (error) { return []; }
}
```

**6. Restore the id counter.** After loading, `nextId` is 1 again, and a new task would get an id that already exists. In `restore()` compute the highest id and add one with `reduce`.

**7. The demo.** The script adds three tasks, ticks one and prints the saved text in the console. Then it sets `tasks = []` and calls `render()` to simulate a fresh page, and calls `restore()` as a new visit would. If saving and loading work, the page shows all three tasks again, and one is still ticked.

> **Watch out:**
> - Storing the array directly: `setItem('tasks', tasks)` saves the useless text `[object Object]`. Always `JSON.stringify` first.
> - `JSON.parse` on empty or broken text throws `SyntaxError: Unexpected end of JSON input`. Use `try / catch`.
> - Forgetting to update `nextId` after loading: two tasks with the same id, and clicking one toggles the other.
> - Never store passwords or secrets in `localStorage`: any script on the page can read it.

> **Your turn:** follow the TODO list in `script.js`: write `saveTasks`, `loadTasks`, `restore` and `commit`, use `commit()` in the three actions and call `restore()` at startup. The demo should print `Saved text: [...]` in the console with the three tasks as JSON and finish with all three tasks on the page, "2 tasks left" in the counter and one task ticked.
