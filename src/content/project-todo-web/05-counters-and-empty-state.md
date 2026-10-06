---
title: 'Step 5: Counters and an empty-state message'
summary: Show how many tasks are left, with correct singular and plural, and a friendly message when the list is empty.
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

          <!-- TODO 1: below the list add two paragraphs:
               id "empty-message" with class "empty" and the text: Nothing to do. Enjoy your day!
               id "counter" with class "counter" and no text (JavaScript fills it) -->
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

      /* TODO 2 (CSS): .empty and .counter get margin var(--space) 0 0 and color var(--muted).
         .empty is centred (text-align center) with padding 24px 0; .counter has font-size 0.9rem.
         Then add a rule that makes the hidden attribute really hide things:
         [hidden] { display: none !important; } */
  - name: script.js
    code: |
      // Step 5: counters and an empty-state message
      //
      // TODO 1: find #counter and #empty-message and store them in constants.
      //
      // TODO 2: write a function updateStatus() that
      //         - counts all tasks (li) and the tasks that are not done (li:not(.done))
      //         - writes "1 task left" or "N tasks left" (singular and plural!) into the counter
      //         - hides the empty message when there is at least one task (use its hidden property)
      //
      // TODO 3: call updateStatus() at the end of addTask, at the end of the click
      //         listener, and once before the demo lines.

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
check:
  dom:
    text:
      - 1 task left
      - Buy milk
      - Read a chapter
    selectors:
      - '#counter'
      - '#empty-message[hidden]'
      - '#task-list li.done'
    styles:
      - selector: '#empty-message'
        property: display
        value: none
      - selector: .counter
        property: color
        value: rgb(107, 114, 128)
  code:
    - pattern: li:not\(\s*\.done\s*\)|\.filter\(|classList\.contains
      message: Count the tasks that are not done, for example with querySelectorAll('li:not(.done)').
    - pattern: \.hidden\s*=
      message: 'Show or hide the empty message with its hidden property: emptyMessage.hidden = ...'
    - pattern: ===\s*1\s*\?|==\s*1\s*\?|\?\s*['"]\s*task left
      message: 'Handle the singular: 1 task left, but 2 tasks left.'
hints:
  - Make one function, updateStatus(), that looks at the list and updates both the counter text and the empty message. Then call it every time the list could have changed.
  - 'Count with list.querySelectorAll(''li'').length and list.querySelectorAll(''li:not(.done)'').length. Write the text with a conditional: left === 1 ? '' task left'' : '' tasks left''. The empty message hides with emptyMessage.hidden = total > 0.'
  - 'function updateStatus() { const total = list.querySelectorAll(''li'').length; const left = list.querySelectorAll(''li:not(.done)'').length; counter.textContent = left + (left === 1 ? '' task left'' : '' tasks left''); emptyMessage.hidden = total > 0; }   Call updateStatus(); at the end of addTask, at the end of the click listener and once at startup.'
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
      // Step 5: counters and an empty-state message

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
      list.querySelector('li:last-child .delete').click(); // delete the last task
quiz:
  - q: Why do we put the status code in ONE function that everything calls?
    options:
      - JavaScript only allows one function per file
      - It runs faster than inline code
      - Every place that changes the list refreshes the numbers the same way, so they never disagree
    answer: 2
  - q: 'Why does the stylesheet need [hidden] { display: none !important; }?'
    options:
      - 'Because a rule like .empty { display: block } would otherwise override the hidden attribute'
      - Because hidden does not exist in HTML
      - Because JavaScript cannot set hidden
    answer: 0
  - q: 'What does a ternary such as left === 1 ? '' task left'' : '' tasks left'' do?'
    options:
      - Repeats the text three times
      - Picks one of two values depending on a condition
      - Throws an error when left is 1
    answer: 1
---
Good interfaces answer questions before you ask them: "How much is left?" and "Why is the screen blank?". In this step you add two small features that make the app feel finished: a live counter and an empty-state message.

## Where we are

You can add, tick and delete tasks. The page never tells you how many tasks are open, and if you delete everything you are left with an empty white space.

## What we will add, and why it matters

- A counter that says `2 tasks left`, with `1 task left` in the singular. Wrong grammar like "1 tasks left" looks sloppy, and users notice.
- An **empty state**: a friendly message such as "Nothing to do. Enjoy your day!" when the list has no tasks. Designers call this out as one of the most forgotten parts of an app. A blank area looks like a bug.

The important idea here is to keep the status in **one function**. Many places change the list (add, tick, delete). If each of them updated the numbers its own way, sooner or later they would disagree. A single `updateStatus()` that reads the list and refreshes everything cannot disagree with itself.

## Guided walk-through

**1. Add the two paragraphs in HTML.** The empty message and the counter both exist from the start, JavaScript just changes them:

```html
<p id="empty-message" class="empty">Nothing to do. Enjoy your day!</p>
<p id="counter" class="counter"></p>
```

**2. Count with CSS selectors.** `querySelectorAll` returns all matches, so its `length` is a count. The selector `li:not(.done)` means "li elements that do not have the class done":

```js
const total = list.querySelectorAll('li').length;
const left = list.querySelectorAll('li:not(.done)').length;
```

**3. Write the text, singular and plural.** The ternary operator `condition ? valueIfTrue : valueIfFalse` is a compact `if`:

```js
counter.textContent = left + (left === 1 ? ' task left' : ' tasks left');
// 0 -> "0 tasks left", 1 -> "1 task left", 5 -> "5 tasks left"
```

**4. Show or hide the empty message.** Every element has a `hidden` property. Setting it to `true` hides the element, `false` shows it. Because `total > 0` is itself true or false, one line does the job:

```js
emptyMessage.hidden = total > 0;
```

**5. Call it everywhere the list changes.** At the end of `addTask`, at the end of the click listener (after the toggle or the remove) and once at startup, so the page is right before anything happens:

```js
updateStatus();
```

**6. Do not let CSS fight the attribute.** The `hidden` attribute is only a weak hint. If you write `.empty { display: block; }` (or flex, or grid) it wins and the message shows anyway. The fix is one rule that makes `hidden` always win: `[hidden] { display: none !important; }`.

## What the demo does now

The demo adds three tasks, ticks the first and deletes the last. Two tasks are left in the list, one of them is done, so the counter reads **1 task left** and the empty message is hidden. Try deleting all the tasks by hand: the message appears and the counter says `0 tasks left`.

> **Watch out:**
> - Updating the counter only inside `addTask`. After ticking or deleting, it shows a stale number. Call `updateStatus()` in the click listener too.
> - The ternary needs the parentheses: `left + left === 1 ? ...` is read as `(left + left) === 1`, and the output is nonsense. Write `left + (left === 1 ? ... : ...)`.
> - Calling `updateStatus()` before the constants exist gives `ReferenceError: Cannot access 'counter' before initialization`. Declare the constants first.
> - `emptyMessage.hidden = 'false'` hides it, because the string `'false'` is truthy. Use real booleans.

> **Your turn:** add the two paragraphs to `index.html`, write `updateStatus()` (counter text with singular and plural, empty message hidden when there are tasks), call it in the three places, and add the CSS from the TODO list including the `[hidden]` rule. After the demo the page must show "1 task left" and the empty message must be hidden.
