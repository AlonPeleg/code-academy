---
title: Organising your CSS
summary: Keep a growing stylesheet maintainable with design tokens, BEM naming, reusable components and low-specificity selectors.
level: advanced
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Pricing</title>
          <link rel="stylesheet" href="css/tokens.css" />
          <link rel="stylesheet" href="css/components.css" />
        </head>
        <body>
          <main class="page">
            <article class="card">
              <h2 class="card__title">Starter plan</h2>
              <p class="card__text">For hobby projects.</p>
              <a class="btn" href="#">Choose</a>
            </article>
            <article class="card card--featured">
              <h2 class="card__title">Pro plan</h2>
              <p class="card__text">For teams who ship.</p>
              <a class="btn btn--primary" href="#">Choose</a>
            </article>
          </main>
        </body>
      </html>
  - name: css/tokens.css
    code: |
      /* Design tokens: the few values the whole site shares.
         1. Declare these three custom properties on the root element:
            --color-brand: #6d5efc;
            --color-text:  #1f2937;
            --radius:      8px;                                         */
  - name: css/components.css
    code: |
      body {
        font-family: system-ui, sans-serif;
        margin: 0;
      }

      .page {
        display: grid;
        gap: 16px;
        padding: 16px;
        max-width: 480px;
      }

      /* 2. This selector is far too specific, and it hard-codes the colour.
            Replace it with a plain .card__title rule that uses your text token,
            and make the title weight 600. */
      main.page article.card h2.card__title {
        color: #1f2937;
        font-size: 20px;
      }

      /* 3. Use the tokens instead of the copied values below.
            Then add the modifier .card--featured (brand-coloured border). */
      .card {
        background: #ffffff;
        border: 2px solid #e5e7eb;
        padding: 16px;
        border-radius: 8px;
      }

      /* 4. Remove the hack that forces the colour, use the tokens, and add the
            modifier .btn--primary (brand background, white text) AFTER .btn. */
      .btn {
        display: inline-block;
        padding: 8px 16px;
        border: 2px solid #6d5efc;
        border-radius: 8px;
        color: #6d5efc !important;
        text-decoration: none;
      }
check:
  dom:
    styles:
      - { selector: ".card__title", property: "font-weight", value: "600" }
      - { selector: ".card__title", property: "color", value: "rgb(31, 41, 55)" }
      - { selector: ".card--featured", property: "border-top-color", value: "rgb(109, 94, 252)" }
      - { selector: ".btn--primary", property: "background-color", value: "rgb(109, 94, 252)" }
      - { selector: ".btn--primary", property: "color", value: "rgb(255, 255, 255)" }
  code:
    - file: css/tokens.css
      pattern: ':root\s*\{(?=[^}]*--color-brand\s*:)(?=[^}]*--color-text\s*:)(?=[^}]*--radius\s*:)'
      message: "In css/tokens.css declare --color-brand, --color-text and --radius inside one :root rule."
    - file: css/components.css
      pattern: 'var\(\s*--color-brand'
      message: "Use var(--color-brand) in components.css instead of the copied colour."
    - file: css/components.css
      pattern: 'var\(\s*--radius'
      message: "Use var(--radius) for the rounded corners."
    - file: css/components.css
      pattern: '(^|[}\n])\s*\.card__title\s*\{'
      message: "Write a plain .card__title rule (no main, article or h2 in front of it)."
    - file: css/components.css
      pattern: '\.card--featured\s*\{'
      message: "Add a .card--featured modifier rule."
    - file: css/components.css
      pattern: '\.btn--primary\s*\{'
      message: "Add a .btn--primary modifier rule."
    - file: css/components.css
      pattern: '^(?![\s\S]*!important)'
      message: "Remove the important hack. Fix the problem with a simpler selector and the right order instead."
hints:
  - "Work from the bottom of the cascade up: first create the tokens in tokens.css, then use them in components.css. A modifier is a second class (like card--featured) that only changes what is different."
  - "Declare the three variables inside :root in tokens.css and read them with var(). Replace the long main.page article.card h2.card__title selector with .card__title. Delete the important flag, then add .card--featured and .btn--primary rules (the modifier comes after the base rule)."
  - "tokens.css: :root { --color-brand: #6d5efc; --color-text: #1f2937; --radius: 8px; }   components.css: .card__title { color: var(--color-text); font-weight: 600; }   .card--featured { border-color: var(--color-brand); }   .btn--primary { background: var(--color-brand); color: #fff; }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Pricing</title>
          <link rel="stylesheet" href="css/tokens.css" />
          <link rel="stylesheet" href="css/components.css" />
        </head>
        <body>
          <main class="page">
            <article class="card">
              <h2 class="card__title">Starter plan</h2>
              <p class="card__text">For hobby projects.</p>
              <a class="btn" href="#">Choose</a>
            </article>
            <article class="card card--featured">
              <h2 class="card__title">Pro plan</h2>
              <p class="card__text">For teams who ship.</p>
              <a class="btn btn--primary" href="#">Choose</a>
            </article>
          </main>
        </body>
      </html>
  - name: css/tokens.css
    code: |
      /* Design tokens: the few values the whole site shares. */
      :root {
        --color-brand: #6d5efc;
        --color-text: #1f2937;
        --radius: 8px;
      }
  - name: css/components.css
    code: |
      body {
        font-family: system-ui, sans-serif;
        margin: 0;
      }

      .page {
        display: grid;
        gap: 16px;
        padding: 16px;
        max-width: 480px;
      }

      /* Card component */
      .card {
        background: #ffffff;
        border: 2px solid #e5e7eb;
        padding: 16px;
        border-radius: var(--radius);
      }

      .card__title {
        color: var(--color-text);
        font-size: 20px;
        font-weight: 600;
      }

      .card--featured {
        border-color: var(--color-brand);
      }

      /* Button component */
      .btn {
        display: inline-block;
        padding: 8px 16px;
        border: 2px solid var(--color-brand);
        border-radius: var(--radius);
        color: var(--color-brand);
        text-decoration: none;
      }

      .btn--primary {
        background: var(--color-brand);
        color: #ffffff;
      }
quiz:
  - q: "In the BEM name  card__title--large , which part is the block?"
    options: ["card", "title", "large"]
    answer: 0
    explain: "Block = the component (card). Element = a part of it (__title). Modifier = a variation (--large)."
  - q: "Why is  main.page article.card h2.card__title  a problem?"
    options: ["It is invalid CSS", "It is hard to override later because its specificity is high, and it ties the style to the HTML structure", "Browsers ignore selectors with more than two parts", "It makes the page load slower than any other selector"]
    answer: 1
  - q: "Where should a modifier like .btn--primary go relative to .btn?"
    options: ["Before .btn, so the base wins", "In a different file loaded first", "After .btn, so it wins when both rules have equal specificity"]
    answer: 2
    explain: "With equal specificity the later rule wins, so keep base rules first and modifiers after."
  - q: "What is a design token in CSS?"
    options: ["A secret key for the stylesheet", "A named value, usually a custom property like --color-brand, shared across the site", "A file that holds all media queries", "A reserved keyword like auto"]
    answer: 1
---

A stylesheet is easy to read when it has twenty rules. When it has two thousand, and three people are editing it, small changes start breaking unrelated pages. This lesson gives you the habits professionals use to keep CSS calm: shared values, clear names, reusable components and simple selectors.

## Split by purpose

Put things in files by what they do, then link them in a sensible order. A small project might look like this:

```
css/
  tokens.css       variables only
  base.css         body, headings, links
  components.css   .card, .btn, .nav ...
  pages.css        rules for one specific page
```

Each file in the HTML comes after the one it depends on, so tokens come first. Real projects often glue files together with a build tool, but linking several `<link>` tags works fine for learning.

## Design tokens: one source of truth

A **design token** is a named value that the whole site shares. In CSS they are custom properties (you met them in the theming lesson):

```css
:root {
  --color-brand: #6d5efc;
  --color-text: #1f2937;
  --radius: 8px;
}
```

Components then say `border-radius: var(--radius)` instead of copying `8px` around. Rebranding becomes a one-line change.

## Naming with BEM

When many people name things freely you get `.box2`, `.blue-thing` and `.title`. **BEM** (Block, Element, Modifier) is a naming convention that makes every class tell you what it is:

| Part | Pattern | Example |
| --- | --- | --- |
| Block | the component | `.card` |
| Element | a part of the block, with two underscores | `.card__title` |
| Modifier | a variation, with two dashes | `.card--featured` |

Why bother? The name says where the class belongs, so a plain `.title` cannot clash with the `.title` of another component. And because every class is a single flat name, nothing depends on the HTML nesting.

## Components with modifiers

A **component** is a reusable piece of UI. The base class holds what is always true; modifiers hold only the difference. In the HTML you use both classes together:

```html
<a class="btn btn--primary" href="#">Choose</a>
```

```css
.btn {
  border: 2px solid var(--color-brand);
  color: var(--color-brand);
}

.btn--primary {          /* after .btn: same specificity, later wins */
  background: var(--color-brand);
  color: #ffffff;
}
```

## Keep specificity low

**Specificity** decides which rule wins when several match the same element. IDs beat classes, classes beat tags, and `!important` beats nearly everything. A selector like `main.page article.card h2.card__title` scores high, so to change it later you need something even higher. The usual outcome is an arms race that ends in `!important` everywhere.

The cure is simple: style with **one class per rule**, and let the order of the rules do the rest. If you must raise priority, add the modifier class rather than a longer selector.

## Cascade layers, briefly

When the order of files is not enough, `@layer` lets you declare the order of whole groups of rules:

```css
@layer base, components, utilities;

@layer components {
  .btn { padding: 8px 16px; }
}
```

Rules in a later layer beat rules in an earlier one *regardless of specificity*. That is powerful, and it is also something to learn once you are comfortable with the basics above.

> **Watch out:**
> - Using `!important` to win a fight. It works once, then you need another `!important` to beat it. Lower the specificity of the rules instead.
> - Nesting BEM names like `.card__body__title`. Elements belong to the block, not to other elements: use `.card__title`.
> - Putting the modifier before the base rule in the file. The base then overrides it and the modifier "does nothing".
> - Using the modifier without the base class (`class="btn--primary"`). The button loses the shared styles. Always write both.
> - Forgetting a bracket, as in `var(--color-brand;`. The whole declaration becomes invalid and the browser silently ignores it, so check the Styles panel in DevTools when a colour goes missing.

## Going further

Add a `.card--compact` modifier that reduces the padding, then a `.btn--small`. Notice that you only touched CSS, never the structure of the components.

> **Your turn:** in `css/tokens.css` declare `--color-brand` (`#6d5efc`), `--color-text` (`#1f2937`) and `--radius` (`8px`) on `:root`. In `css/components.css` use them with `var()`, replace the long title selector with a plain `.card__title` rule (font-weight `600`), delete the `!important`, and add the modifiers `.card--featured` (brand border colour) and `.btn--primary` (brand background, white text) after their base rules.
