---
title: 'Step 3: Add tasks with JavaScript'
summary: Listen for the form submit and create new list items in the page with the DOM.
level: beginner
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

          <!-- TODO 1: make the list empty. Delete the static list item below,
               JavaScript will create the real ones. -->
          <ul id="task-list">
            <li>Placeholder task</li>
          </ul>
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
  - name: script.js
    code: |
      // Step 3: add tasks with JavaScript
      //
      // TODO 2: use document.querySelector to find the form (#task-form),
      //         the input (#task-input) and the list (#task-list).
      //         Store them in three constants: form, input, list.
      //
      // TODO 3: write a function addTask(text) that builds a new list item with
      //         the text and puts it at the end of the list.
      //
      // TODO 4: listen for the "submit" event of the form. In the handler:
      //         - stop the page reload,
      //         - read the input value and trim the spaces,
      //         - if it is empty, stop,
      //         - otherwise add the task, empty the input and focus it again.
      //
      // TODO 5: the demo lines below call addTask by themselves, so the checker
      //         can see tasks on the page. Leave them as they are.

      // --- Demo ---
      addTask('Buy milk');
      addTask('Read a chapter');
check:
  dom:
    text:
      - Buy milk
      - Read a chapter
    selectors:
      - '#task-list > li:nth-child(2)'
  code:
    - pattern: document\.createElement\(\s*['"]li['"]
      message: Create the list item with document.createElement('li').
    - pattern: addEventListener\(\s*['"]submit['"]
      message: Listen for the form's submit event with addEventListener('submit', ...).
    - pattern: preventDefault\(\)
      message: Call event.preventDefault() so the page does not reload.
    - pattern: \.trim\(\)
      message: Use .trim() so a task made of spaces is ignored.
    - pattern: value\s*=\s*['"]{2}
      message: 'Empty the input after adding: input.value = '''';'
    - pattern: ^(?![\s\S]*Placeholder task)
      message: Delete the static Placeholder task item from index.html.
hints:
  - 'Two jobs: (1) a function addTask(text) that builds a list item and appends it to the list, (2) a submit listener on the form that reads the input and calls addTask.'
  - Build the item with document.createElement('li'), set li.textContent = text, then list.append(li). In the listener, start with event.preventDefault(), then read input.value.trim() and return early if it is an empty string.
  - function addTask(text) { const li = document.createElement('li'); li.textContent = text; list.append(li); }   form.addEventListener('submit', function (event) { event.preventDefault(); const text = input.value.trim(); if (text === '') return; addTask(text); input.value = ''; input.focus(); });
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
        padding: 12px 0;
        border-bottom: 1px solid var(--border);
      }
  - name: script.js
    code: |
      // Step 3: add tasks with JavaScript

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
quiz:
  - q: Why do we call event.preventDefault() in the submit handler?
    options:
      - To make the button blue
      - To delete the input
      - To stop the browser from sending the form and reloading the page
    answer: 2
  - q: Why is li.textContent = text safer than li.innerHTML = text for user input?
    options:
      - textContent treats the text as plain text, so typed HTML or scripts cannot run
      - innerHTML does not exist in browsers
      - textContent is always faster to type
    answer: 0
    explain: Putting user input into innerHTML is a classic security hole called cross-site scripting (XSS).
  - q: What does document.querySelector('#task-list') return?
    options:
      - Every element in the page
      - The first element that matches the selector, or null if there is none
      - A copy of the HTML text
    answer: 1
---
Until now the page was only a drawing. In this step it comes alive: you type a task, press **Add** and a new line appears. This is the core skill of front-end programming, changing the page from JavaScript, and everything after this step builds on it.

## Where we are

The page is structured (step 1) and looks good (step 2). The Add button reloads the page and the list holds a static placeholder.

## What we will add, and why it matters

The browser keeps a live tree of everything on the page called the **DOM** (Document Object Model). JavaScript can read that tree and change it, and the page updates instantly. Real apps do exactly this: they react to **events** (a click, a key press, a form being submitted) and update the DOM.

## Guided walk-through

**1. Find the elements once.** `document.querySelector` takes a CSS selector and returns the first matching element. Store the results in constants at the top so the rest of the code can use them:

```js
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
```

`#` means "the element with this id", the same as in CSS. If the id is misspelled you get `null`, and the first line that uses it throws an error.

**2. Write a function that creates one task.** Making a new element takes three moves: create it, fill it, attach it.

```js
function addTask(text) {
  const li = document.createElement('li'); // 1. create, not yet on the page
  li.textContent = text;                   // 2. fill with plain text
  list.append(li);                         // 3. attach at the end of the list
}
```

We use `textContent` and not `innerHTML` on purpose. `textContent` shows exactly what the user typed. With `innerHTML` a visitor could type `<img src=x onerror=...>` and run code on your page.

**3. React to the form.** `addEventListener` takes the name of an event and a function that runs each time it happens:

```js
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = input.value.trim();
  if (text === '') return;
  addTask(text);
  input.value = '';
  input.focus();
});
```

Line by line:

- `event.preventDefault()` cancels the browser's default action, which for a form is sending data and reloading. Without it your new task flashes and vanishes.
- `input.value` is what is typed in the box. `.trim()` cuts spaces from both ends, so `"   "` becomes `""`.
- `if (text === '') return;` is an **early return**: stop right here for empty input. It keeps the rest of the function simple.
- After adding, we empty the box and put the cursor back in it with `input.focus()`, so you can type many tasks quickly.

**4. Demo lines.** The checker cannot type or click, so the last lines call `addTask('Buy milk')` and `addTask('Read a chapter')` by themselves when the page loads. You can still type your own tasks. This trick, calling your own function with sample data, is also how developers test things quickly.

## Try it yourself

Type a task, press Enter instead of clicking Add. It works too, because pressing Enter in a form submits it. Try typing only spaces: nothing happens.

> **Watch out:**
> - `Cannot read properties of null (reading 'addEventListener')`: `querySelector` found nothing. Check the id in your HTML and remember the `#`.
> - The page script loads before the HTML exists: keep `<script src="script.js">` at the end of the body, as in our file.
> - Forgetting `preventDefault()` makes the page reload and your tasks disappear.
> - Appending the plain string to the list (`list.append(text)`) adds loose text, not a list item. Always create the `li` element first.

> **Your turn:** in `index.html` remove the placeholder list item. In `script.js` find the three elements, write `addTask(text)`, and add the submit listener that prevents the reload, trims the text, ignores empty input, adds the task and empties the input. Keep the two demo lines: the page should show "Buy milk" and "Read a chapter" as two list items.
