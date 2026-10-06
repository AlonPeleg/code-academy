---
title: CSS variables and theming
summary: Store colours and sizes once with custom properties, then switch whole themes by changing a few values.
level: intermediate
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="card">
            <h2>Light card</h2>
            <p>Themes are just variables.</p>
            <button class="btn">Subscribe</button>
          </div>
          <div class="card dark">
            <h2>Dark card</h2>
            <p>Same CSS, different variables.</p>
            <button class="btn">Subscribe</button>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      /* 1. Declare three custom properties on the root element (the html tag):
            --bg: #ffffff;  --text: #1f2937;  --brand: #6d5efc;
         2. Replace the hard-coded colours below with var(...) calls.
         3. Add a rule for the dark card that gives the variables new values:
            --bg: #111827;  --text: #f9fafb;   (the brand colour stays the same) */

      .card {
        background: #ffffff;
        color: #1f2937;
        padding: 16px;
        margin: 12px;
        border-radius: 8px;
      }

      .btn {
        background: #6d5efc;
        color: white;
        border: 0;
        padding: 8px 16px;
        border-radius: 6px;
      }
check:
  dom:
    selectors:
      - ".card.dark .btn"
    styles:
      - { selector: ".card", property: "background-color", value: "rgb(255, 255, 255)" }
      - { selector: ".card", property: "color", value: "rgb(31, 41, 55)" }
      - { selector: ".card.dark", property: "background-color", value: "rgb(17, 24, 39)" }
      - { selector: ".card.dark", property: "color", value: "rgb(249, 250, 251)" }
      - { selector: ".card.dark .btn", property: "background-color", value: "rgb(109, 94, 252)" }
  code:
    - pattern: ':root\s*\{[^}]*--bg\s*:[^}]*--text\s*:[^}]*--brand\s*:'
      message: "Declare --bg, --text and --brand inside a :root { ... } rule."
    - pattern: 'background\s*:\s*var\(\s*--bg'
      message: "Use var(--bg) for the card background."
    - pattern: 'color\s*:\s*var\(\s*--text'
      message: "Use var(--text) for the card text colour."
    - pattern: 'var\(\s*--brand'
      message: "Use var(--brand) for the button background."
    - pattern: '\.dark\s*\{[^}]*--bg\s*:'
      message: "Add a .dark rule that overrides --bg (and --text)."
hints:
  - "A custom property is a name that starts with two dashes, declared like any other property. Declare them once on :root, read them everywhere with var(). The dark card simply redeclares the same names."
  - ":root { --bg: #ffffff; --text: #1f2937; --brand: #6d5efc; }   then   background: var(--bg);   and a .dark { ... } rule that sets --bg and --text again."
  - ":root { --bg: #ffffff; --text: #1f2937; --brand: #6d5efc; }   .card { background: var(--bg); color: var(--text); ... }   .btn { background: var(--brand); ... }   .dark { --bg: #111827; --text: #f9fafb; }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="card">
            <h2>Light card</h2>
            <p>Themes are just variables.</p>
            <button class="btn">Subscribe</button>
          </div>
          <div class="card dark">
            <h2>Dark card</h2>
            <p>Same CSS, different variables.</p>
            <button class="btn">Subscribe</button>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      :root {
        --bg: #ffffff;
        --text: #1f2937;
        --brand: #6d5efc;
      }

      .card {
        background: var(--bg);
        color: var(--text);
        padding: 16px;
        margin: 12px;
        border-radius: 8px;
      }

      .btn {
        background: var(--brand);
        color: white;
        border: 0;
        padding: 8px 16px;
        border-radius: 6px;
      }

      .dark {
        --bg: #111827;
        --text: #f9fafb;
      }
quiz:
  - q: How do you read the value of a custom property called --brand?
    options: ["$brand", "var(--brand)", "get(--brand)", "--brand()"]
    answer: 1
  - q: Why declare shared variables on :root?
    options: ["It makes the page load faster", "Custom properties only work on :root", "Every element inherits them, so they are available everywhere on the page"]
    answer: 2
  - q: "A .dark element redeclares --bg. What happens to the elements inside it?"
    options: ["Nothing, variables can only be set once", "They use the new value, because custom properties are inherited", "The whole page turns dark"]
    answer: 1
    explain: Custom properties cascade and inherit like color does, so the nearest ancestor that sets one wins.
  - q: "What does var(--gap, 8px) do when --gap is not defined?"
    options: ["It uses the fallback value 8px", "It throws an error", "It sets the property to 0"]
    answer: 0
---

Open any big stylesheet and you will find the same purple written fifty times. Change your mind about the purple and you must hunt down all fifty. **CSS custom properties** (often called CSS variables) fix that: you write a value once, give it a name, and reuse it everywhere. As a bonus they make theming, such as dark mode, almost free.

## Declaring and using a variable

A custom property is any property whose name starts with **two dashes**. You declare it inside a rule, and you read it with the `var()` function:

```css
:root {
  --brand: #6d5efc;
  --radius: 8px;
}

.btn {
  background: var(--brand);
  border-radius: var(--radius);
}
```

Piece by piece:

- `:root` is a selector that matches the top element of the page (the `html` tag). Putting variables here makes them available to the whole document.
- `--brand: #6d5efc;` stores a value. The name is up to you, but it is case-sensitive: `--Brand` and `--brand` are different variables.
- `var(--brand)` is replaced by the stored value at the place where you use it.

Unlike variables in Sass or other tools, these live in the browser, so they can change while the page is running.

## Variables are inherited

Custom properties **inherit** and **cascade** just like `color` does. If an element sets `--bg`, then it and all its children see that value. That is the trick behind theming:

```css
:root { --bg: #ffffff; --text: #1f2937; }
.dark { --bg: #111827; --text: #f9fafb; }

.card { background: var(--bg); color: var(--text); }
```

The `.card` rule never changes. When a card sits inside (or is itself) a `.dark` element, the variables resolve to different values, so the same rule produces a different look. Real sites flip a `data-theme="dark"` attribute on the `html` element, or use the system setting:

```css
@media (prefers-color-scheme: dark) {
  :root { --bg: #111827; --text: #f9fafb; }
}
```

## Fallback values

`var()` accepts a second argument, used when the variable is missing:

```css
.tag { padding: var(--tag-padding, 4px 8px); }
```

This lets a component work out of the box and still be customised by whoever uses it: set `--tag-padding` on a parent and it changes.

## Changing variables with JavaScript

Because variables are live, a script can update them and the whole page responds:

```js
document.documentElement.style.setProperty("--brand", "tomato");
```

## Variables and calc()

Variables hold any value, including numbers with units, and combine nicely with `calc()`:

```css
:root { --space: 8px; }
.box { padding: calc(var(--space) * 2); }
```

> **Watch out:**
> - Writing `var(brand)` or `var(-brand)`. The name must include both dashes: `var(--brand)`.
> - Using a variable name in a property position without `var()`, like `background: --brand;`. That is invalid and ignored.
> - Expecting `--space: 8` to work in `padding: var(--space)px`. You cannot glue units on afterwards. Store the unit (`8px`) or use `calc(var(--space) * 1px)`.
> - Declaring a variable on `.card` and using it outside `.card`. Variables only flow downwards to descendants, so declare shared ones on `:root`.
> - A typo in the name gives no error. The property just becomes invalid and the browser falls back to its default, so inspect the element in DevTools if a colour is missing.

## Going further

Add a third card with a class `.ocean` that sets `--brand: #0ea5e9`, and watch the button change colour without touching `.btn`.

> **Your turn:** in `style.css`, declare `--bg`, `--text` and `--brand` on `:root`, use them with `var()` in `.card` and `.btn`, then add a `.dark` rule that redeclares `--bg` as `#111827` and `--text` as `#f9fafb`.
