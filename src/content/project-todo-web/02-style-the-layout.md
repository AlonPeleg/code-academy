---
title: 'Step 2: Style the layout with CSS'
summary: Turn the plain page into a card with CSS variables, spacing and a flexbox form.
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

      /* TODO 1: on :root declare custom properties (CSS variables):
           --bg: #f3f4f6;   --card: #ffffff;   --text: #1f2937;   --muted: #6b7280;
           --primary: #6d5efc;   --border: #d1d5db;   --radius: 12px;   --space: 16px;
         TODO 2: make every element include padding and border in its size: * { box-sizing: border-box; }
         TODO 3: body: no margin, padding 32px var(--space), background var(--bg), color var(--text),
                 a system font (font-family: system-ui, sans-serif) and line-height 1.5
         TODO 4: .app is the card: max-width 480px, centred (margin: 0 auto), padding 24px,
                 background var(--card), border-radius var(--radius) and a soft box-shadow
         TODO 5: #task-form is a flex row: display flex, flex-wrap wrap, gap 8px.
                 The label takes a full line (flex-basis: 100%); the input grows (flex: 1).
         TODO 6: button[type="submit"]: background var(--primary), white text, no border, rounded
         TODO 7: #task-list: no bullets (list-style: none), no padding; each li gets
                 padding 12px 0 and a bottom border using var(--border) */
  - name: script.js
    code: |
      // JavaScript arrives in step 3.
check:
  dom:
    styles:
      - selector: :root
        property: --primary
        value: '#6d5efc'
      - selector: body
        property: background-color
        value: rgb(243, 244, 246)
      - selector: .app
        property: max-width
        value: 480px
      - selector: .app
        property: background-color
        value: rgb(255, 255, 255)
      - selector: .app
        property: border-radius
        value: 12px
      - selector: .app
        property: padding
        value: 24px
      - selector: '#task-form'
        property: display
        value: flex
      - selector: '#task-form'
        property: gap
        value: 8px
      - selector: button[type="submit"]
        property: background-color
        value: rgb(109, 94, 252)
      - selector: button[type="submit"]
        property: color
        value: rgb(255, 255, 255)
      - selector: '#task-list'
        property: list-style-type
        value: none
  code:
    - pattern: var\(\s*--primary\s*\)
      message: Use var(--primary) for the button colour instead of repeating the hex value.
    - pattern: var\(\s*--bg\s*\)
      message: Use var(--bg) for the page background.
hints:
  - 'Start with the variables: one :root { ... } block at the top. After that, every colour and size you reuse can be written as var(--name).'
  - 'The card is .app (max-width, margin: 0 auto to centre it, padding, background, border-radius). The form row needs display: flex and gap: 8px. The button background should be var(--primary) with color: #ffffff.'
  - ':root { --bg: #f3f4f6; --card: #ffffff; --primary: #6d5efc; --radius: 12px; --space: 16px; ... }   body { background: var(--bg); }   .app { max-width: 480px; margin: 0 auto; padding: 24px; background: var(--card); border-radius: var(--radius); }   #task-form { display: flex; flex-wrap: wrap; gap: 8px; }   button[type="submit"] { background: var(--primary); color: #ffffff; border: 0; }   #task-list { list-style: none; padding: 0; }'
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
      // JavaScript arrives in step 3.
quiz:
  - q: What is the main benefit of CSS custom properties such as --primary?
    options:
      - They make the page load faster
      - You change a colour in one place and the whole app follows
      - They are required for flexbox
    answer: 1
    explain: In step 8 we will use exactly this to build a dark mode by redefining the variables.
  - q: 'What does box-sizing: border-box change?'
    options:
      - Width and height include the padding and border, so boxes do not grow unexpectedly
      - It adds a visible border to every element
      - It makes the element a flex container
    answer: 0
  - q: Which declarations put the form's children in a row with space between them?
    options:
      - 'position: row; margin: 8px'
      - 'float: left; padding: 8px'
      - 'display: flex; gap: 8px'
    answer: 2
---
You have a working page structure. Now we make it look like something people would want to use. CSS is the language of looks, and in this step you will learn the three tools that carry most real layouts: variables, the box model and flexbox.

## Where we are

The page has a heading, a form and a list, but everything is squashed against the left edge in the default browser style. There is still no behaviour.

## What we will add, and why it matters

A professional stylesheet is not a pile of random colours. It starts by naming its decisions: this is our brand colour, this is our spacing. If a designer later says "make the purple a bit darker", you change one line instead of hunting through fifty. We also want a **card**: a centred box with a maximum width, so the app looks good on a phone and on a huge monitor.

## Guided walk-through

**1. Declare variables on `:root`.** `:root` is the top element of the page (the same as `html`). A custom property starts with two dashes, and `var()` reads it back:

```css
:root {
  --primary: #6d5efc;
  --radius: 12px;
}

button { background: var(--primary); }
```

Variables are inherited by every element below `:root`, so they work everywhere. Put all eight from the `TODO` list there: background, card, text, muted, primary, border, radius, space.

**2. Make boxes predictable.** Every element is a box with content, padding and border. By default, `width: 200px` plus `padding: 20px` gives a 240px box, which is confusing. One universal rule fixes it:

```css
* { box-sizing: border-box; }
```

**3. Style the body and the card.** The body gets the page background and a readable font. The card centres itself with `margin: 0 auto` (zero top and bottom, automatic left and right) and refuses to grow beyond `max-width: 480px`:

```css
.app {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px;
  background: var(--card);
  border-radius: var(--radius);
}
```

On a narrow phone the card simply shrinks to fit. That is a tiny piece of **responsive design**.

**4. Lay out the form with flexbox.** A flex container places its children in a row. `gap` adds space between them, and `flex-wrap: wrap` lets the label, which we force to `flex-basis: 100%`, sit on its own line above the input and button. `flex: 1` on the input means "take all the remaining width":

```css
#task-form { display: flex; flex-wrap: wrap; gap: 8px; }
#task-form label { flex-basis: 100%; }
#task-form input { flex: 1; }
```

**5. Polish the button and the list.** Give the button `var(--primary)` as background and white text, remove the default border, and add `cursor: pointer`. For the list, `list-style: none` removes the bullets and `padding: 0` removes the indent. A bottom border on each `li` makes thin dividers.

> **Watch out:**
> - A missing semicolon silently breaks that line and the one after it. If a style does not apply, look at the line above it.
> - `var(--primary)` needs the exact name. `var(--primay)` produces no error, the property is just ignored.
> - Custom properties must be declared where children can inherit them. If you put them on `.app` the `body` rule cannot use them.
> - Colours in the hex form need the `#`. `6d5efc` alone is invalid.

> **Your turn:** write the CSS in `style.css` following the seven `TODO` items. The check looks at real computed values: the `:root` variable `--primary`, the page background, a 480px wide card with 24px padding and 12px rounded corners, a flex form with 8px gap, a purple button with white text, and a list without bullets. Use `var(--primary)` and `var(--bg)` rather than repeating the colours.
