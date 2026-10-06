---
title: 'Step 6: Filters with a state array and render()'
summary: Keep the tasks in an array, draw the page from it with render(), and add All, Active and Done filters.
level: intermediate
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

          <!-- TODO 1: above the list add a div with id "filters", class "filters",
               role "group" and aria-label "Filter tasks". Inside put three buttons
               (type "button") with the texts All, Active and Done and the attributes
               data-filter="all", data-filter="active" and data-filter="done".
               The All button also has class "active". -->
          <ul id="task-list"></ul>

          <p id="empty-message" class="empty">Nothing to do. Enjoy your day!</p>
          <p id="counter" class="counter"></p>
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

      /* TODO 2 (CSS): .filters is a flex row with gap 8px and margin-top var(--space).
         Its buttons are pills: padding 6px 14px, 1px border var(--border), border-radius 999px,
         transparent background. The selected one, .filters button.active, has background
         var(--primary), border-color var(--primary) and white text. */

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
  - name: script.js
    code: |
      // Step 6: filters, a state array and a render() function
      //
      // TODO 1: find #filters and store it in a constant named filters.
      //
      // TODO 2: create the STATE at the top of the file:
      //         let tasks = [];      objects like { id: 1, text: 'Buy milk', done: false }
      //         let filter = 'all';  'all', 'active' or 'done'
      //         let nextId = 1;
      //
      // TODO 3: write visibleTasks() that returns the tasks matching the current filter
      //         (use the array method filter).
      //
      // TODO 4: write render(). It empties the list (replaceChildren), creates an li for each
      //         visible task (data-id = the task id, class done when task.done), updates the
      //         counter from the tasks array, shows or hides the empty message and gives the
      //         class "active" to the button of the current filter.
      //
      // TODO 5: rewrite addTask, and add toggleTask(id), deleteTask(id) and setFilter(name).
      //         They only change the state and then call render().
      //
      // TODO 6: the list click listener reads Number(li.dataset.id) and calls
      //         deleteTask or toggleTask. Add a second listener on the filters bar that calls
      //         setFilter(button.dataset.filter). Call render() once before the demo.
      //
      // TODO 7: add this demo line at the very end:
      //         filters.querySelector('[data-filter="active"]').click();

      // 1. Find the elements we need once, at the top.
      const form = document.querySelector('#task-form');
      const input = document.querySelector('#task-input');
      const list = document.querySelector('#task-list');
      const counter = document.querySelector('#counter');
      const emptyMessage = document.querySelector('#empty-message');

      // Refresh the "N tasks left" text and show or hide the empty message.
      function updateStatus() {
        const total = list.querySelectorAll('li').length;
        const left = list.querySelectorAll('li:not(.done)').length;
        counter.textContent = left + (left === 1 ? ' task left' : ' tasks left');
        emptyMessage.hidden = total > 0;
      }

      // 2. Create one list item: a text span and a Delete button.
      function addTask(text) {
        const li = document.createElement('li');

        const label = document.createElement('span');
        label.className = 'task-text';
        label.textContent = text;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'delete';
        remove.textContent = 'Delete';

        li.append(label, remove);
        list.append(li);
        updateStatus();
      }

      // 3. Run addTask when the form is submitted (Add button or Enter key).
      form.addEventListener('submit', function (event) {
        event.preventDefault();          // stop the page from reloading
        const text = input.value.trim(); // remove spaces at both ends
        if (text === '') {
          return;                        // ignore empty tasks
        }
        addTask(text);
        input.value = '';                // empty the box
        input.focus();                   // ready for the next task
      });

      // 4. Event delegation: ONE listener on the list handles every task,
      //    including tasks that do not exist yet.
      list.addEventListener('click', function (event) {
        const li = event.target.closest('li');   // which task was clicked?
        if (!li) {
          return;
        }
        if (event.target.closest('.delete')) {
          li.remove();                           // Delete button: remove the task
        } else {
          li.classList.toggle('done');           // anywhere else: tick or untick
        }
        updateStatus();                          // the numbers changed
      });

      updateStatus(); // run once so the page starts correct

      // --- Demo ---
      // The checker cannot click, so the script clicks for us.
      addTask('Buy milk');
      addTask('Read a chapter');
      addTask('Call mum');
      list.querySelector('li').click();                    // tick the first task
      // (the old line that deleted the last task is gone: the demo keeps all three tasks now)
check:
  dom:
    text:
      - Read a chapter
      - Call mum
      - 2 tasks left
    selectors:
      - '#filters button[data-filter="all"]'
      - '#filters button[data-filter="done"]'
      - '#filters button.active[data-filter="active"]'
      - '#task-list li:nth-child(2):last-child'
    styles:
      - selector: '#filters button.active'
        property: background-color
        value: rgb(109, 94, 252)
      - selector: '#filters'
        property: display
        value: flex
  code:
    - pattern: let\s+tasks\s*=\s*\[
      message: 'Keep the tasks in an array in a variable: let tasks = [];'
    - pattern: function\s+render\s*\(
      message: Write a render() function that draws the page from the state.
    - pattern: \.filter\(
      message: Use the array method .filter(...) to pick the tasks that match.
    - pattern: dataset\.filter|data-filter
      message: Read the chosen filter from the button's data-filter attribute.
hints:
  - 'Change how you think about it: the array tasks is the truth, the page is only a picture of it. Every action (add, toggle, delete, setFilter) changes the array or the filter and then calls render().'
  - render() empties the list with list.replaceChildren(), loops over visibleTasks(), builds an li for each and sets li.dataset.id = task.id. visibleTasks() uses tasks.filter(...) depending on the variable filter. For the buttons, button.classList.toggle('active', button.dataset.filter === filter).
  - function visibleTasks() { if (filter === 'active') return tasks.filter(t => !t.done); if (filter === 'done') return tasks.filter(t => t.done); return tasks; }   function toggleTask(id) { const task = tasks.find(t => t.id === id); if (task) { task.done = !task.done; render(); } }   function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); render(); }
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
  - name: script.js
    code: |
      // Step 6: filters, a state array and a render() function

      const form = document.querySelector('#task-form');
      const input = document.querySelector('#task-input');
      const list = document.querySelector('#task-list');
      const counter = document.querySelector('#counter');
      const emptyMessage = document.querySelector('#empty-message');
      const filters = document.querySelector('#filters');

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
      list.querySelector('li').click();                          // tick "Buy milk"
      filters.querySelector('[data-filter="active"]').click();   // show only open tasks
quiz:
  - q: What is the main idea of keeping a state array and a render() function?
    options:
      - 'The page is a picture of the data: change the data, call render(), and the page cannot get out of sync'
      - It makes the browser store the data forever
      - It avoids using the DOM completely
    answer: 0
  - q: What does tasks.filter(task => !task.done) return?
    options:
      - The first task that is not done
      - A new array with only the tasks that are not done
      - The number of tasks that are not done
    answer: 1
  - q: Why do we store the task id in li.dataset.id?
    options:
      - So the browser can sort the list
      - Because ids are needed for CSS
      - So a click on an li tells us which task in the array to change
    answer: 2
    explain: data-* attributes are the standard way to attach small pieces of information to an element.
---
Up to now the page itself was the only place that knew about the tasks. That works for a toy, but it falls apart as soon as you want a filter: if the done tasks are hidden, where does the information about them live? In this step you will move the data out of the page into a plain JavaScript array. This is the single most important idea in modern front-end development, and it is the idea behind React, Vue and Svelte.

## Where we are

The app can add, tick and delete tasks, and it shows a counter and an empty message. The data exists only as list items on the page.

## What we will add, and why it matters

We will add three filter buttons: **All**, **Active** and **Done**. To make them work cleanly we introduce:

- **State**: the variables that describe the app right now: the `tasks` array and the current `filter`.
- **`render()`**: one function that draws the entire page from that state.

The loop is always the same: *an event happens, change the state, call render()*. Because the page is rebuilt from the state each time, it cannot disagree with it. You will never again write "if I hide this, remember to also update that".

## Guided walk-through

**1. Create the state.** Tasks become objects in an array:

```js
let tasks = [];      // [{ id: 1, text: 'Buy milk', done: false }, ...]
let filter = 'all';  // 'all' | 'active' | 'done'
let nextId = 1;      // the id the next new task will get
```

We use `let` because these variables will be replaced over time. The id lets us find a task again later, even after the list was filtered or reordered.

**2. Write `visibleTasks()`.** The array method `filter` keeps the items for which your function returns true and gives you a **new** array:

```js
function visibleTasks() {
  if (filter === 'active') return tasks.filter(function (t) { return !t.done; });
  if (filter === 'done') return tasks.filter(function (t) { return t.done; });
  return tasks;
}
```

**3. Write `render()`.** It follows the shape *clear, rebuild, update the rest*:

```js
function render() {
  list.replaceChildren();                    // remove all old li elements
  for (const task of visibleTasks()) {
    const li = document.createElement('li');
    li.dataset.id = task.id;                 // becomes data-id="3" in the HTML
    li.classList.toggle('done', task.done);  // second argument: force on or off
    // ... build the span and the Delete button as before ...
    list.append(li);
  }
  // counter, empty message and the active filter button come here
}
```

`classList.toggle('done', task.done)` with a second argument is not a flip any more: it forces the class **on** when the value is true and **off** when it is false. The same trick marks the selected filter button: `button.classList.toggle('active', button.dataset.filter === filter)`.

**4. Actions only touch the state.** Compare how short they get:

```js
function addTask(text) { tasks.push({ id: nextId++, text: text, done: false }); render(); }
function deleteTask(id) { tasks = tasks.filter(function (t) { return t.id !== id; }); render(); }
function setFilter(name) { filter = name; render(); }
```

`nextId++` gives the current number and then adds one. For toggling, `tasks.find(...)` returns the matching object, and you flip its `done` flag.

**5. Read the id from the click.** `li.dataset.id` is always text, so convert it: `Number(li.dataset.id)`. The filter bar uses delegation too, with `event.target.closest('button[data-filter]')`.

**6. The demo.** The script adds three tasks, clicks the first one (done) and then clicks the Active filter, so the page ends with two visible tasks and "2 tasks left".

> **Watch out:**
> - `li.dataset.id` is a string and `task.id` is a number, so `t.id === li.dataset.id` is never true. Convert with `Number(...)`.
> - Changing the array but forgetting `render()`: the data changes and the page does not.
> - `tasks.filter(...)` does not change `tasks`, it returns a new array. Assign it back (`tasks = tasks.filter(...)`) when deleting.
> - Counting the left-over tasks from `visibleTasks()` instead of `tasks`: with the Done filter the counter would say "0 tasks left". Count from the full array.

> **Your turn:** follow the TODO list in `script.js` (and the HTML and CSS TODOs): create `tasks`, `filter` and `nextId`, write `visibleTasks()` and `render()`, rewrite the actions and the listeners, and add the filter bar. When the demo finishes the "Active" button is highlighted, two tasks are visible and the counter reads "2 tasks left".
