---
title: 'Step 8: Polish with keyboard, accessibility and dark mode'
summary: Make the app usable without a mouse and by screen readers, and add a dark theme with CSS custom properties.
level: advanced
export:
  kind: static
  name: todo-app
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
          <!-- TODO 1: put the h1 and a new button into a header element (class "top").
               The button: id "theme-toggle", class "theme-toggle", type "button",
               aria-pressed="false", text "Dark mode".
               TODO 2: add aria-live="polite" to the empty message and to the counter so screen
               readers announce changes. -->
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

      /* TODO 3 (CSS): dark theme. Add a rule  :root[data-theme="dark"] { ... }  that gives the
         variables new values: --bg #111827, --card #1f2937, --text #f9fafb, --muted #9ca3af,
         --border #374151 (and color-scheme: dark).
         TODO 4 (CSS): a visible keyboard focus:  :focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
         TODO 5 (CSS): style .top (flex, space-between, align-items center, margin-bottom var(--space)),
         .top h1 (margin 0) and .theme-toggle (a small pill button like the filter buttons).
         Also remove cursor: pointer from the li rule: now the label is the click target. */

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
      // Step 8: polish with keyboard support, accessibility and a dark mode
      //
      // TODO 1: find #theme-toggle (constant themeToggle).
      //
      // TODO 2: in render(), each task becomes: a checkbox (input type checkbox, id "task-" + id,
      //         checked = task.done), a label (class "task-text", htmlFor = the checkbox id, text)
      //         and the Delete button with aria-label "Delete task: <text>".
      //         li.append(checkbox, label, remove). Also set aria-pressed on the filter buttons.
      //
      // TODO 3: a checkbox fires "change". Replace the click-to-toggle code by a "change" listener on
      //         the list that calls toggleTask(Number(li.dataset.id)) for checkboxes. The "click"
      //         listener now only handles .delete. After toggleTask, focus the same checkbox again.
      //
      // TODO 4: keyboard: pressing Escape in the input clears it (keydown listener, event.key),
      //         and pressing "/" anywhere focuses the input.
      //
      // TODO 5: write setTheme(name): set document.documentElement.dataset.theme, update the toggle
      //         (aria-pressed and the text: "Light mode" in dark, "Dark mode" in light) and save it with
      //         storage.setItem('theme', name). The toggle button click switches between dark and light.
      //         Call setTheme(storage.getItem('theme') || 'light') before restore().
      //
      // TODO 6: the demo (bottom) ticks the first CHECKBOX now and clicks the theme toggle.

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
      list.querySelector('input[type="checkbox"]')?.click();  // tick "Buy milk" (needs TODO 2)

      tasks = [];       // the page "forgets" everything...
      nextId = 1;
      render();
      restore();        // ...and the next visit loads it back from storage

      themeToggle?.click();   // switch to dark mode (needs TODO 1 and 5)
check:
  dom:
    text:
      - Buy milk
      - Read a chapter
      - Call mum
      - 2 tasks left
      - Light mode
    selectors:
      - html[data-theme="dark"]
      - '#theme-toggle[aria-pressed="true"]'
      - '#counter[aria-live="polite"]'
      - '#task-list li input[type="checkbox"]'
      - '#task-list li input:checked'
      - '#task-list li label.task-text'
      - '#task-list li button.delete[aria-label]'
      - '#filters button[aria-pressed="true"]'
    styles:
      - selector: body
        property: background-color
        value: rgb(17, 24, 39)
      - selector: body
        property: color
        value: rgb(249, 250, 251)
      - selector: .app
        property: background-color
        value: rgb(31, 41, 55)
  code:
    - pattern: addEventListener\(\s*['"]keydown['"]
      message: Listen for the keydown event to add keyboard shortcuts.
    - pattern: '[''"]Escape[''"]'
      message: Clear the input when event.key is 'Escape'.
    - pattern: addEventListener\(\s*['"]change['"]
      message: 'A checkbox fires a change event: listen for it on the list.'
    - pattern: dataset\.theme|data-theme
      message: Switch the theme with document.documentElement.dataset.theme.
    - pattern: aria-label
      message: Give the Delete buttons an aria-label that says which task they delete.
hints:
  - 'Three themes of work: (1) real controls instead of clickable text (a checkbox and a label), because they work with keyboard and screen readers for free, (2) aria-live and aria-pressed so changes are announced, (3) a data-theme attribute on the html element that your CSS reacts to.'
  - 'Dark mode is just new values for the same variables: :root[data-theme="dark"] { --bg: #111827; --card: #1f2937; --text: #f9fafb; ... }. In JavaScript: document.documentElement.dataset.theme = name, then update aria-pressed and the button text. Each task: checkbox + label (htmlFor) + Delete button with aria-label.'
  - 'function setTheme(name) { document.documentElement.dataset.theme = name; themeToggle.setAttribute(''aria-pressed'', String(name === ''dark'')); themeToggle.textContent = name === ''dark'' ? ''Light mode'' : ''Dark mode''; storage.setItem(''theme'', name); }   themeToggle.addEventListener(''click'', function () { setTheme(document.documentElement.dataset.theme === ''dark'' ? ''light'' : ''dark''); });   input.addEventListener(''keydown'', function (event) { if (event.key === ''Escape'') input.value = ''''; });'
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
          <header class="top">
            <h1>My Tasks</h1>
            <button id="theme-toggle" class="theme-toggle" type="button" aria-pressed="false">Dark mode</button>
          </header>

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

          <p id="empty-message" class="empty" aria-live="polite">Nothing to do. Enjoy your day!</p>
          <p id="counter" class="counter" aria-live="polite"></p>

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

      :root[data-theme="dark"] {
        --bg: #111827;
        --card: #1f2937;
        --text: #f9fafb;
        --muted: #9ca3af;
        --border: #374151;
        color-scheme: dark;
      }

      * {
        box-sizing: border-box;
      }

      :focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
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
      }

      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space);
        margin-bottom: var(--space);
      }

      .top h1 {
        margin: 0;
      }

      .theme-toggle {
        padding: 6px 12px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: transparent;
        color: var(--text);
        font: inherit;
        font-size: 0.85rem;
        cursor: pointer;
      }

      #task-list input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary);
      }

      .task-text {
        flex: 1;
        cursor: pointer;
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
      // Step 8: polish with keyboard support, accessibility and a dark mode

      const form = document.querySelector('#task-form');
      const input = document.querySelector('#task-input');
      const list = document.querySelector('#task-list');
      const counter = document.querySelector('#counter');
      const emptyMessage = document.querySelector('#empty-message');
      const filters = document.querySelector('#filters');
      const savedJson = document.querySelector('#saved-json');
      const themeToggle = document.querySelector('#theme-toggle');

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

          // A real checkbox: focusable, and Space toggles it. No extra code needed.
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = 'task-' + task.id;
          checkbox.checked = task.done;

          // The label is linked to the checkbox, so clicking the text also toggles it.
          const label = document.createElement('label');
          label.className = 'task-text';
          label.htmlFor = checkbox.id;
          label.textContent = task.text;

          const remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'delete';
          remove.textContent = 'Delete';
          remove.setAttribute('aria-label', 'Delete task: ' + task.text);

          li.append(checkbox, label, remove);
          list.append(li);
        }

        const left = tasks.filter(function (task) { return !task.done; }).length;
        counter.textContent = left + (left === 1 ? ' task left' : ' tasks left');

        emptyMessage.textContent = tasks.length === 0 ? 'Nothing to do. Enjoy your day!' : 'No tasks in this view.';
        emptyMessage.hidden = shown.length > 0;

        for (const button of filters.querySelectorAll('button')) {
          const selected = button.dataset.filter === filter;
          button.classList.toggle('active', selected);
          button.setAttribute('aria-pressed', String(selected));
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
          // render() rebuilt the list, so put the keyboard focus back on the same checkbox.
          const box = list.querySelector('[data-id="' + id + '"] input');
          if (box) {
            box.focus();
          }
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

      // A checkbox fires "change" (mouse, touch and keyboard alike), so we listen for that.
      list.addEventListener('change', function (event) {
        const li = event.target.closest('li');
        if (li && event.target.matches('input[type="checkbox"]')) {
          toggleTask(Number(li.dataset.id));
        }
      });

      list.addEventListener('click', function (event) {
        const li = event.target.closest('li');
        if (li && event.target.closest('.delete')) {
          deleteTask(Number(li.dataset.id));
          input.focus();   // the deleted button is gone: send focus somewhere useful
        }
      });

      filters.addEventListener('click', function (event) {
        const button = event.target.closest('button[data-filter]');
        if (button) {
          setFilter(button.dataset.filter);
        }
      });

      // Keyboard: Escape clears the box, and "/" jumps to it from anywhere.
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          input.value = '';
        }
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === '/' && document.activeElement !== input) {
          event.preventDefault();
          input.focus();
        }
      });

      // Dark mode: the CSS reacts to data-theme on the html element.
      function setTheme(name) {
        document.documentElement.dataset.theme = name;
        themeToggle.setAttribute('aria-pressed', String(name === 'dark'));
        themeToggle.textContent = name === 'dark' ? 'Light mode' : 'Dark mode';
        storage.setItem('theme', name);
      }

      themeToggle.addEventListener('click', function () {
        setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
      });

      setTheme(storage.getItem('theme') || 'light');
      restore(); // a new visit: load whatever was saved before

      // --- Demo ---
      // The script ticks a task, simulates a new visit and switches to dark mode.
      // Delete the last line if you want the page to start in light mode.
      addTask('Buy milk');
      addTask('Read a chapter');
      addTask('Call mum');
      list.querySelector('input[type="checkbox"]').click();  // tick "Buy milk"

      tasks = [];       // the page "forgets" everything...
      nextId = 1;
      render();
      restore();        // ...and the next visit loads it back from storage

      themeToggle.click();   // switch to dark mode (click it again for light)
quiz:
  - q: Why is a real checkbox better than a clickable span for a task?
    options:
      - It looks nicer by default
      - It is focusable, toggles with the Space key and is announced correctly by screen readers, all for free
      - It needs less CSS
    answer: 1
  - q: What does aria-live="polite" on the counter do?
    options:
      - Makes the text polite and shorter
      - Hides the text from sighted users
      - Tells screen readers to announce changes to that text when they have a free moment
    answer: 2
  - q: How does the dark mode work without rewriting any other CSS rule?
    options:
      - All rules use var(--...) variables, so redefining the variables under [data-theme="dark"] recolours everything
      - JavaScript changes the colour of every element
      - The browser inverts the colours automatically
    answer: 0
---
Your app works. Now we make it work for **everybody**: people who use only a keyboard, people who use a screen reader, and people who prefer a dark screen. This polish step is what separates a demo from something you would be proud to publish. It also teaches you that accessibility is mostly about using the right HTML elements.

## Where we are

The app adds, ticks, deletes, filters and saves tasks, and it has its own look. But a keyboard user cannot tick a task (a `li` cannot receive focus), a screen reader will not announce that the counter changed, and the page is bright white at midnight.

## What we will add, and why it matters

About one in four adults has some kind of disability, and many more simply prefer the keyboard or dark mode. Accessibility is also tested in job interviews and often required by law for public websites. The good news: you get most of it by choosing proper elements, not by writing extra code.

## Guided walk-through

**1. Use real controls.** Replace the clickable text with a checkbox plus a label:

```js
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.id = 'task-' + task.id;
checkbox.checked = task.done;

const label = document.createElement('label');
label.htmlFor = checkbox.id;      // the JavaScript name of the "for" attribute
label.textContent = task.text;
```

A checkbox can be focused with Tab, toggled with Space and is announced as "checkbox, checked". It fires a `change` event, so listen for `change` on the list instead of `click`. The label links to the checkbox, so clicking the text still toggles it. Give the Delete button a precise name: `remove.setAttribute('aria-label', 'Delete task: ' + task.text)`, because a screen reader user hearing "Delete, Delete, Delete" cannot tell the buttons apart.

**2. Keep the focus.** `render()` throws away the old elements, and the checkbox the user just pressed disappears with them. The keyboard focus would fall back to the top of the page. After toggling, find the new checkbox and call `.focus()` on it. After deleting, move focus to the input.

**3. Announce changes.** `aria-live="polite"` on the counter and the empty message makes screen readers speak the new text when it changes. `aria-pressed="true"` on a toggle button (the filter buttons and the theme button) says which one is selected, and not only by colour.

**4. Keyboard shortcuts.** The event object tells you which key was pressed:

```js
input.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') input.value = '';
});
```

A listener on `document` can catch `/` to jump to the input. Only prevent the default action (typing a slash) when you do not already stand in the input.

**5. Dark mode with variables.** In step 2 every colour became a variable. A dark theme only needs new values, scoped to a data attribute on the `html` element:

```css
:root[data-theme="dark"] {
  --bg: #111827;
  --card: #1f2937;
  --text: #f9fafb;
  --muted: #9ca3af;
  --border: #374151;
}
```

```js
document.documentElement.dataset.theme = 'dark';   // sets data-theme="dark" on <html>
```

`document.documentElement` is the `html` element. Writing to `dataset.theme` sets the attribute and the CSS takes over. The toggle button also updates its `aria-pressed` value and its text. We save the choice with the same `storage` as the tasks, so a real site would remember it.

**6. The demo.** The script ticks the first checkbox and clicks the theme button, so the preview opens in dark mode. Delete the last line to start in light mode.

> **Watch out:**
> - `label.for = ...` does nothing: in JavaScript the property is `htmlFor`.
> - `aria-live` regions must exist in the page **before** their text changes. Do not create them at the same time as the message.
> - Do not remove the focus outline (`outline: none`) without a replacement. Keyboard users then cannot see where they are. Our `:focus-visible` rule shows it only for keyboard use.
> - Hard-coded colours (`#fff`) in other rules will not follow the theme. Always use `var(--...)`.

> **Your turn:** follow the TODO list in all three files. Tasks must use a checkbox, a label and a Delete button with an `aria-label`. Add the `change` listener, the Escape and `/` shortcuts, the theme button with `setTheme`, `aria-live` on the counter and `aria-pressed` on the toggle and the filters, and the dark theme CSS. When the demo finishes the page is in dark mode, the toggle says "Light mode" and the body background is `#111827`.

## What to build next

You now have a complete app. Ideas to practise: a due-date field for each task and sorting by date; editing a task by double-clicking it; a "Clear completed" button; drag and drop reordering; use `prefers-color-scheme` to pick the starting theme; or split `script.js` into several files and load them as modules. When you are ready for server-side data, the next project, the People Directory, connects a React app to a web API.
