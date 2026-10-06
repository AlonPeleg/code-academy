---
title: Accessibility - forms, focus and reduced motion
summary: Build a form that works with keyboards and screen readers, with visible focus and respect for motion settings.
level: advanced
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <h1>Newsletter</h1>
          <form>
            <!-- 1. Replace the placeholders-only inputs with proper labels:
                 a <label for="..."> for each input, and matching ids on the inputs. -->
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Email address" />

            <!-- 2. Add a hint paragraph with id "email-hint" ("We never share your email.")
                 and link it to the email input with aria-describedby. -->

            <!-- 3. Mark the email input as required. -->

            <!-- 4. Add an error message paragraph with role="alert" and id "email-error".
                 Keep it empty for now. -->

            <!-- 5. This is a div pretending to be a button. Make it a real submit button. -->
            <div class="btn">Sign up</div>

            <!-- 6. This icon-only button has no accessible name. Give it an aria-label. -->
            <button type="button" class="icon-btn">&times;</button>
          </form>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: sans-serif;
        max-width: 420px;
        margin: 24px auto;
        padding: 0 16px;
      }

      input {
        display: block;
        width: 100%;
        padding: 10px;
        margin: 6px 0 14px;
        box-sizing: border-box;
        outline: none; /* bad idea: keyboard users can no longer see where they are */
      }

      .btn, .icon-btn {
        background: #6d5efc;
        color: white;
        border: 0;
        padding: 10px 18px;
        border-radius: 6px;
      }

      .spinner {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* 7. Remove the outline: none above and add a clear focus style instead:
            a rule for the focus-visible state of inputs and buttons with a 3px solid
            #f59e0b outline and a 2px outline offset. */

      /* 8. Add a media query for users who ask for less motion:
            inside it, turn the .spinner animation off. */
check:
  dom:
    selectors:
      - 'label[for="name"]'
      - 'input#name[type="text"]'
      - 'label[for="email"]'
      - 'input#email[type="email"][required]'
      - 'input#email[aria-describedby="email-hint"]'
      - "#email-hint"
      - '[role="alert"]#email-error'
      - 'button[type="submit"]'
      - 'button[aria-label]'
  code:
    - pattern: '(focus-visible|:focus)[^{]*\{[^}]*outline\s*:\s*3px\s+solid\s+#f59e0b'
      message: "Add a :focus-visible rule with outline: 3px solid #f59e0b;"
    - pattern: 'outline-offset\s*:\s*2px'
      message: "Add outline-offset: 2px to the focus style."
    - pattern: '@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{[\s\S]*animation\s*:\s*none'
      message: "Wrap an animation: none rule for .spinner in @media (prefers-reduced-motion: reduce)."
hints:
  - "Screen readers announce a label when an input gets focus, but only if the label is connected to it: the label's for attribute must equal the input's id. A real button is focusable and works with Enter and Space, a div does not."
  - "<label for=\"name\">Name</label> <input id=\"name\" type=\"text\">   aria-describedby takes the id of the hint element.   In CSS: input:focus-visible { outline: 3px solid #f59e0b; }   @media (prefers-reduced-motion: reduce) { ... }"
  - "<button type=\"submit\" class=\"btn\">Sign up</button>   <button type=\"button\" class=\"icon-btn\" aria-label=\"Close\">   input:focus-visible, button:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }   @media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <h1>Newsletter</h1>
          <form>
            <label for="name">Name</label>
            <input id="name" type="text" placeholder="Ada Lovelace" />

            <label for="email">Email address</label>
            <input id="email" type="email" required aria-describedby="email-hint" />
            <p id="email-hint">We never share your email.</p>

            <p id="email-error" role="alert"></p>

            <button type="submit" class="btn">Sign up</button>

            <button type="button" class="icon-btn" aria-label="Close">&times;</button>
          </form>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: sans-serif;
        max-width: 420px;
        margin: 24px auto;
        padding: 0 16px;
      }

      input {
        display: block;
        width: 100%;
        padding: 10px;
        margin: 6px 0 14px;
        box-sizing: border-box;
      }

      .btn, .icon-btn {
        background: #6d5efc;
        color: white;
        border: 0;
        padding: 10px 18px;
        border-radius: 6px;
      }

      .spinner {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      input:focus-visible,
      button:focus-visible {
        outline: 3px solid #f59e0b;
        outline-offset: 2px;
      }

      @media (prefers-reduced-motion: reduce) {
        .spinner {
          animation: none;
        }
      }
quiz:
  - q: How do you connect a label to an input?
    options: ["Put them next to each other", "Give them the same class", "The label's for attribute equals the input's id"]
    answer: 2
    explain: You can also wrap the input inside the label, but for and id is the most flexible way.
  - q: Why is a placeholder not a replacement for a label?
    options: ["Placeholders cannot contain text", "It disappears when typing and is often low contrast and not reliably announced", "Placeholders are only for passwords"]
    answer: 1
  - q: What is the first rule of ARIA?
    options: ["Add aria-label to everything", "Use ARIA instead of HTML whenever possible", "If a native HTML element already does the job, use it instead of adding ARIA"]
    answer: 2
    explain: A real button already has the right role, focus behaviour and keyboard support. ARIA only describes, it adds no behaviour.
  - q: 'What does @media (prefers-reduced-motion: reduce) detect?'
    options: ["That the visitor asked their system to minimise animation", "That the screen is small", "That the connection is slow"]
    answer: 0
---

Accessibility (often written a11y) means that people can use your page whatever their abilities and tools: keyboards instead of a mouse, screen readers that speak the page aloud, zoomed text, or a system setting that turns off animation. Most of it is just writing HTML properly. This lesson turns a sloppy form into one that everybody can use.

## Labels: every input needs one

A screen reader tells the user what a field is by reading its **label**. A placeholder is not enough: it vanishes as soon as you type, it is often pale grey, and not every tool announces it. Connect a `<label>` to its input by matching `for` and `id`:

```html
<label for="email">Email address</label>
<input id="email" type="email" />
```

As a bonus, clicking the label focuses the input, which makes tiny targets easier to hit on a phone.

## Hints, errors and ARIA

Native HTML covers most needs. **ARIA** attributes fill the gaps by adding extra descriptions for assistive technology. Three you will use constantly:

- `aria-describedby="email-hint"` points to the `id` of an element whose text describes the control. The screen reader reads it after the label.
- `aria-label="Close"` gives an accessible name to an element with no visible text, such as an icon button showing only an "x".
- `role="alert"` marks a message that should be announced immediately when its text changes, perfect for form errors that your script fills in.

```html
<input id="email" type="email" required aria-describedby="email-hint" />
<p id="email-hint">We never share your email.</p>
<p id="email-error" role="alert"></p>
```

The `required` attribute is understood by the browser and by screen readers, and blocks submission when the field is empty. The `type="email"` field also checks the format.

The first rule of ARIA is: **do not use it if a real HTML element already does the job**. ARIA changes what a screen reader says, it never adds behaviour.

## Use real buttons

A `<div class="btn">` looks like a button but cannot be reached with the Tab key, ignores Enter and Space, and a screen reader does not know it is clickable. A real `<button type="submit">` gets all of this for free. The same goes for links (`<a href>`) when you navigate and `<button>` when you act.

## Visible focus

Keyboard users move with Tab and need to see where they are. Some designers remove the outline with `outline: none` because they find it ugly, which locks those users out. Style it instead, using `:focus-visible`, which shows the ring for keyboard focus but usually not for mouse clicks:

```css
input:focus-visible,
button:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 2px;
}
```

Pick a colour that stands out against the background, and test by pressing Tab through your page.

## Respecting reduced motion

Large or constant movement can cause dizziness or nausea for some people, so operating systems offer a "reduce motion" setting. CSS can read it:

```css
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
```

A common global version shortens every animation and transition to nearly nothing. Keep essential feedback (a progress state) but drop decorative movement.

## Other quick wins

- Put `lang="en"` on `<html>` so screen readers choose the right pronunciation.
- Give every image an `alt` text (empty `alt=""` for purely decorative images).
- Do not rely on colour alone: an error needs text as well as red.
- Aim for a contrast ratio of at least 4.5:1 for body text.

> **Watch out:**
> - A label whose `for` does not match any `id`: clicking it does nothing, and the browser shows no error.
> - Duplicate ids. An `id` must be unique on the page, otherwise `aria-describedby` and `for` point to the wrong element.
> - `aria-label` on a button that already has visible text. The label replaces the visible text for screen readers, which can confuse voice-control users.
> - Using `role="alert"` on a message that is always visible with text already inside. It is announced when its content changes, so keep it empty and fill it when an error occurs.
> - Removing outlines with `outline: none` and not replacing them.

## Going further

Install a free tool such as the Lighthouse accessibility audit in your browser DevTools and run it on your page. Try operating the form with the keyboard alone.

> **Your turn:** follow the numbered comments: add labels connected to the inputs by `for` and `id` (use ids `name` and `email`), a hint `#email-hint` linked with `aria-describedby`, `required` on the email input, an empty `#email-error` with `role="alert"`, a real submit button, an `aria-label` on the icon button, a `:focus-visible` outline of `3px solid #f59e0b` with a `2px` offset, and a `prefers-reduced-motion` rule that turns `.spinner` animation off.
