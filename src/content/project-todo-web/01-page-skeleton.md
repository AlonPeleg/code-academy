---
title: 'Step 1: The page skeleton and the form'
summary: Build the HTML structure of the to-do app, with a heading, a form and an empty list.
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
        <!-- TODO 1: wrap everything in a main element with class "app".
             TODO 2: inside it, add a level-1 heading that says: My Tasks
             TODO 3: add a form with id "task-form". Inside the form put:
                     a label (for="task-input", text "New task"),
                     a text input (id="task-input", placeholder "What needs doing?"),
                     and a button of type submit with the text: Add
             TODO 4: after the form add a list with id "task-list" and ONE list item
                     with the text: Placeholder task -->

        <script src="script.js"></script>
      </body>
      </html>
  - name: style.css
    code: |
      /* Styles arrive in step 2. */
  - name: script.js
    code: |
      // JavaScript arrives in step 3.
check:
  dom:
    text:
      - My Tasks
      - New task
      - Add
    selectors:
      - main.app h1
      - form#task-form
      - label[for="task-input"]
      - input#task-input[type="text"]
      - form#task-form button[type="submit"]
      - ul#task-list li
  code:
    - pattern: <label[^>]*for="task-input"
      message: The label needs for="task-input" so it is connected to the input.
hints:
  - 'Everything visible goes inside <body>. Start from the outside: main, then the heading, the form and the list as siblings, one below the other.'
  - 'The label and the input are linked by matching names: the label has for="task-input" and the input has id="task-input". The button needs type="submit". The list is a ul with id="task-list" and one li inside.'
  - <main class="app"><h1>My Tasks</h1><form id="task-form"><label for="task-input">New task</label><input id="task-input" type="text" placeholder="What needs doing?" autocomplete="off"><button type="submit">Add</button></form><ul id="task-list"><li>Placeholder task</li></ul></main>
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

          <ul id="task-list">
            <li>Placeholder task</li>
          </ul>
        </main>

        <script src="script.js"></script>
      </body>
      </html>
  - name: style.css
    code: |
      /* Styles arrive in step 2. */
  - name: script.js
    code: |
      // JavaScript arrives in step 3.
quiz:
  - q: What connects a label to its input so that clicking the label focuses the input?
    options:
      - The label's for attribute matches the input's id
      - They sit next to each other in the HTML
      - The label's class matches the input's name
    answer: 0
    explain: Matching for and id is also what lets screen readers announce the label when the input is focused.
  - q: Why do we use main, h1, form and ul instead of div for everything?
    options:
      - Divs are not allowed in forms
      - They are faster to load
      - They tell browsers and screen readers what each part means (semantic HTML)
    answer: 2
  - q: What does a button with type="submit" inside a form do?
    options:
      - Deletes the form
      - Sends the form, which fires a submit event we can listen for in JavaScript
      - Nothing, buttons only work with JavaScript
    answer: 1
---
Welcome to your first real project. Over eight steps you will build a to-do app that you could put on a real website: add tasks, tick them off, delete them, filter them, save them and even switch to dark mode. Every step gives you the finished code of the previous step, plus a few `TODO` comments that tell you what to add. Nothing is hidden: by step 8 you will have written, or at least read and understood, every line.

## Where we are

We are at the very start. You have an almost empty page. By the end of this step the browser will show a heading, a small form, and a list with one placeholder item. It will not do anything yet, because that is the job of JavaScript, which arrives in step 3. Good apps start with good structure, and that is HTML.

## What we will add, and why it matters

A to-do app is really three things: a place to **type** (the form), a place to **see** the result (the list), and a title. Getting the HTML right first pays off later. JavaScript will need to find the form, the input and the list, so we give each of them an `id`, a unique name that code can use to find an element. Real apps are built exactly this way: structure first, then looks, then behaviour.

## Guided walk-through

**1. Wrap the page in `main`.** The `main` element marks the primary content of the page. Give it a class so we can style it in step 2:

```html
<main class="app">
  ...
</main>
```

**2. Add the heading.** Every page needs one `h1` that says what the page is about:

```html
<h1>My Tasks</h1>
```

**3. Build the form.** A form groups the controls the user fills in. Ours has three parts:

```html
<form id="task-form">
  <label for="task-input">New task</label>
  <input id="task-input" type="text" placeholder="What needs doing?">
  <button type="submit">Add</button>
</form>
```

Piece by piece:

- `<label for="task-input">` is the visible caption. Its `for` must be exactly the `id` of the input it describes. Clicking the label then focuses the input, and screen readers read it out. A `placeholder` is not a replacement for a label, because it disappears when you type.
- `<input type="text">` is a one-line text box. `autocomplete="off"` stops the browser suggesting old entries (you can add it, the lesson accepts it either way).
- `<button type="submit">` sends the form. When the user presses it, or presses Enter inside the input, the browser fires a `submit` event. In step 3 we will listen for it.

**4. Add the list.** A to-do list is a list, so we use `ul` (unordered list) with `li` (list item) children:

```html
<ul id="task-list">
  <li>Placeholder task</li>
</ul>
```

The placeholder is only there so you can see the list. In step 3 JavaScript will create the real items and we will delete this one.

## Try it in the preview

Run the code. You should see the heading, the label, a text box, an Add button and one bullet. Press **Add**: the page reloads, because forms send data to a server by default. That is normal for now, and we will stop it in step 3.

> **Watch out:**
> - A label whose `for` does not match any `id` does nothing. Typos like `for="task-imput"` fail silently.
> - Ids must be unique on a page. Two elements with `id="task-list"` confuse JavaScript later.
> - Forgetting to close a tag (`</form>`, `</ul>`) makes the browser guess, and the layout gets strange. Indent your code so you can see the nesting.
> - Put a `li` only inside a `ul` or `ol`, never directly in the body.

> **Your turn:** follow the four `TODO` comments in `index.html`. The page must contain a `main.app` with an `h1` that says "My Tasks", a `form#task-form` with a label connected to `input#task-input` and a submit button that says "Add", and a `ul#task-list` with one `li`.
