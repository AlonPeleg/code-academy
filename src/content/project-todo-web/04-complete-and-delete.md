---
title: 'Step 4: Complete and delete tasks'
summary: Use one click listener on the list (event delegation) to tick tasks off and remove them.
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

          <ul id="task-list"></ul>
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

      #task-list {
        margin: var(--space) 0 0;
        padding: 0;
        list-style: none;
      }

      #task-list li {
        padding: 12px 0;
        border-bottom: 1px solid var(--border);
      }

      /* TODO 1 (CSS): make each li a flex row: display flex, align-items center,
         justify-content space-between, gap 12px, cursor pointer.
         TODO 2 (CSS): .task-text grows (flex: 1). A ticked task, #task-list li.done .task-text,
         gets color var(--muted) and text-decoration line-through.
         TODO 3 (CSS): .delete is a flat red button: no border, transparent background,
         color #dc2626, font inherit, cursor pointer. */
  - name: script.js
    code: |
      // Step 4: complete and delete tasks
      //
      // TODO 1: change addTask so each list item holds TWO things:
      //         a span with class "task-text" (the text) and a button with
      //         type "button", class "delete" and the text "Delete".
      //
      // TODO 2: at the end (before the demo) add ONE click listener on the list.
      //         Use event.target.closest('li') to find the task that was clicked.
      //         If the click came from inside an element with class "delete",
      //         remove the task. Otherwise toggle the class "done" on the task.

      // 1. Find the elements we need once, at the top.
      const form = document.querySelector('#task-form');
      const input = document.querySelector('#task-input');
      const list = document.querySelector('#task-list');

      // 2. Create one list item and put it in the list.
      function addTask(text) {
        const li = document.createElement('li');
        li.textContent = text;
        list.append(li);
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

      // --- Demo ---
      // The checker cannot type, so the script adds two tasks by itself.
      // You can still type your own tasks in the preview.
      addTask('Buy milk');
      addTask('Read a chapter');
      addTask('Call mum');
      // The checker cannot click, so these lines click for us (leave them).
      list.querySelector('li')?.click();                    // tick the first task
      list.querySelector('li:last-child .delete')?.click(); // delete the last task
check:
  dom:
    text:
      - Buy milk
      - Read a chapter
    selectors:
      - '#task-list li.done'
      - '#task-list li .task-text'
      - '#task-list li .delete'
      - '#task-list li:nth-child(2):last-child'
    styles:
      - selector: '#task-list li'
        property: display
        value: flex
      - selector: '#task-list li.done .task-text'
        property: text-decoration-line
        value: line-through
      - selector: '#task-list li.done .task-text'
        property: color
        value: rgb(107, 114, 128)
      - selector: .delete
        property: color
        value: rgb(220, 38, 38)
  code:
    - pattern: classList\.toggle\(
      message: Use li.classList.toggle('done') to tick and untick a task.
    - pattern: \.closest\(
      message: Use event.target.closest('li') to find which task was clicked.
    - pattern: \.remove\(\)
      message: Remove a task with li.remove().
    - pattern: list\.addEventListener\(\s*['"]click['"]
      message: Add ONE click listener on the list (event delegation), not one per task.
hints:
  - Do not add a listener to every li. Put one click listener on the ul. Every click on a task bubbles up to the list, and event.target tells you what was actually clicked.
  - 'Inside the listener: const li = event.target.closest(''li''); (and return if there is none). Then if event.target.closest(''.delete'') is truthy call li.remove(), otherwise li.classList.toggle(''done''). In addTask, build the li from a span.task-text and a button.delete.'
  - 'list.addEventListener(''click'', function (event) { const li = event.target.closest(''li''); if (!li) return; if (event.target.closest(''.delete'')) { li.remove(); } else { li.classList.toggle(''done''); } });   CSS: #task-list li.done .task-text { color: var(--muted); text-decoration: line-through; }'
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

          <ul id="task-list"></ul>
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
  - name: script.js
    code: |
      // Step 4: complete and delete tasks

      // 1. Find the elements we need once, at the top.
      const form = document.querySelector('#task-form');
      const input = document.querySelector('#task-input');
      const list = document.querySelector('#task-list');

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
      });

      // --- Demo ---
      // The checker cannot click, so the script clicks for us.
      addTask('Buy milk');
      addTask('Read a chapter');
      addTask('Call mum');
      list.querySelector('li').click();                    // tick the first task
      list.querySelector('li:last-child .delete').click(); // delete the last task
quiz:
  - q: What is event delegation?
    options:
      - Giving every element its own listener
      - Putting one listener on a parent and using event.target to see which child was clicked
      - Sending events to the server
    answer: 1
  - q: Why is delegation a good fit for a to-do list?
    options:
      - It works for tasks added later, because the listener lives on the list that always exists
      - It is the only way to use classList
      - It stops the page from reloading
    answer: 0
  - q: What does li.classList.toggle('done') do?
    options:
      - Always adds the class done
      - Deletes the li
      - Adds the class if it is missing and removes it if it is there
    answer: 2
    explain: toggle is why clicking a task twice ticks it and then unticks it.
---
A to-do list you can only add to is not much use. In this step you will tick tasks off and delete them, and you will learn **event delegation**, the technique that keeps real-world interfaces simple and fast.

## Where we are

The form adds tasks as plain list items. Nothing happens when you click a task, and there is no way to remove one.

## What we will add, and why it matters

Each task gets a **Delete** button, and clicking the task itself marks it done with a line through the text. The tempting way is to attach a listener to every new item inside `addTask`. That works at first, but it creates hundreds of listeners in a long list and is easy to forget when items are created somewhere else. Professionals use **delegation**: events *bubble* upwards, so a click on a button inside a task also reaches the task, then the list, then the page. One listener on the list can catch them all.

## Guided walk-through

**1. Give each task more structure.** A task is now a row with a text and a button, so `addTask` builds three elements and nests them:

```js
const li = document.createElement('li');

const label = document.createElement('span');
label.className = 'task-text';
label.textContent = text;

const remove = document.createElement('button');
remove.type = 'button';       // a plain button, not a submit button
remove.className = 'delete';
remove.textContent = 'Delete';

li.append(label, remove);     // append accepts several children
list.append(li);
```

**2. Delegate the click.** The event object has `target`, the exact element that was clicked (for example the span or the button). `closest(selector)` walks up from that element and returns the first ancestor that matches, or the element itself:

```js
list.addEventListener('click', function (event) {
  const li = event.target.closest('li');
  if (!li) return;                          // clicked the list's padding, not a task
  if (event.target.closest('.delete')) {
    li.remove();                            // Delete was clicked
  } else {
    li.classList.toggle('done');            // anything else toggles
  }
});
```

`classList` is a helper for an element's classes: `add`, `remove`, `contains` and `toggle`. `toggle('done')` adds the class when it is missing and removes it when present.

**3. Let CSS show the state.** JavaScript only flips a class. The look is decided in CSS, which keeps the two jobs apart:

```css
#task-list li.done .task-text {
  text-decoration: line-through;
  color: var(--muted);
}
```

Also turn each `li` into a flex row (`display: flex; justify-content: space-between`) so the Delete button sits on the right.

**4. Simulate clicks for the checker.** Elements have a `.click()` method that fires a real click event. The demo lines tick the first task and delete the last one:

```js
list.querySelector('li').click();
list.querySelector('li:last-child .delete').click();
```

After that the page shows two tasks, and the first has the class `done`. You can still click around by hand.

> **Watch out:**
> - Using `event.target` directly: if the user clicks the span, `target` is the span, not the `li`. That is why we call `closest('li')`.
> - A click on Delete also bubbles up to the `li`. That is why the code uses `if ... else`: if you toggle first and test for Delete afterwards, the task flickers before it disappears.
> - `li.remove` without the brackets does nothing. Call it: `li.remove()`.
> - `Cannot read properties of null (reading 'click')` means the demo selector found no element. Check that `addTask` really adds a `.delete` button.

> **Your turn:** update `addTask` to build a `span.task-text` and a `button.delete`, add one click listener on the list that removes the task when Delete is clicked and toggles `done` otherwise, and write the three CSS rules from the TODO list. With the demo lines, the page must end with two tasks (the first one done and crossed out).
