---
title: Tailwind - dark mode and your own theme
summary: Add a dark mode with the dark variant, make it switchable with a button, and define your own brand colour.
level: intermediate
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Night Shift</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <style type="text/tailwindcss">
            /* 1. Make the dark variant follow a "dark" class on the page instead of the system setting */

            /* 2. Define your own brand colours: brand-500 is #7c3aed and brand-600 is #6d28d9 */
          </style>
        </head>
        <!-- 3. Add dark versions: a dark slate page background and light text -->
        <body class="min-h-screen bg-slate-100 p-6 text-slate-900">
          <!-- 4. The card needs a dark background too, and its paragraph a lighter grey text -->
          <main class="mx-auto mt-10 max-w-md rounded-2xl bg-white p-8 shadow-md">
            <h1 class="text-2xl font-bold">Night shift</h1>
            <p class="mt-2 text-slate-600">
              Working late? Switch to the dark theme and rest your eyes. Your brand colour stays the same in both modes.
            </p>
            <div class="mt-6 flex gap-3">
              <!-- 5. Use your brand colour for this button's background, and a darker brand shade on hover -->
              <button id="cta" class="rounded-lg px-4 py-2 font-semibold text-white">Start a session</button>
              <button id="toggle" class="rounded-lg border border-slate-300 px-4 py-2 font-semibold">Toggle dark mode</button>
            </div>
          </main>

          <script>
            const toggle = document.getElementById("toggle");
            toggle.addEventListener("click", () => {
              // 6. Switch the "dark" class on and off on the root <html> element
            });
          </script>
        </body>
      </html>
check:
  dom:
    text:
      - "Night shift"
      - "Toggle dark mode"
    styles:
      - { selector: "#cta", property: "background-color", value: "rgb(124, 58, 237)" }
      - { selector: "#cta", property: "border-radius", value: "8px" }
      - { selector: "main", property: "padding-top", value: "32px" }
  code:
    - { pattern: '@custom-variant\s+dark\s*\(\s*&:where\(\s*\.dark\s*,\s*\.dark \*\s*\)\s*\)\s*;', message: "Add: @custom-variant dark (&:where(.dark, .dark *)); inside the style tag." }
    - { pattern: '@theme\s*\{[^}]*--color-brand-500\s*:\s*#7c3aed', message: "Add an @theme block that defines --color-brand-500: #7c3aed;" }
    - { pattern: '\bbg-brand-500\b', message: "Use bg-brand-500 on the Start a session button." }
    - { pattern: '\bhover:bg-brand-600\b', message: "Add hover:bg-brand-600 to the button." }
    - { pattern: '\bdark:bg-slate-\d+', message: "Add a dark:bg-slate-... class (for example dark:bg-slate-900)." }
    - { pattern: '\bdark:text-\S+', message: "Add a dark:text-... class so the text stays readable on the dark background." }
    - { pattern: 'classList\.toggle\(\s*["'']dark["'']\s*\)', message: "In the click handler use document.documentElement.classList.toggle(\"dark\");" }
hints:
  - "There are four small jobs: a @custom-variant line and an @theme block inside the style tag, dark: classes on the body/card/paragraph, bg-brand-500 on the button, and one line of JavaScript for the toggle."
  - "Inside the style tag write: @custom-variant dark (&:where(.dark, .dark *));   and   @theme { --color-brand-500: #7c3aed; --color-brand-600: #6d28d9; }. In JavaScript the root element is document.documentElement, and classList.toggle(\"dark\") adds or removes the class."
  - "<body class=\"min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-slate-900 dark:text-slate-100\">   <main class=\"... bg-white ... dark:bg-slate-800\">   <p class=\"mt-2 text-slate-600 dark:text-slate-300\">   <button id=\"cta\" class=\"rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600\">   document.documentElement.classList.toggle(\"dark\");"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Night Shift</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <style type="text/tailwindcss">
            @custom-variant dark (&:where(.dark, .dark *));

            @theme {
              --color-brand-500: #7c3aed;
              --color-brand-600: #6d28d9;
            }
          </style>
        </head>
        <body class="min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
          <main class="mx-auto mt-10 max-w-md rounded-2xl bg-white p-8 shadow-md dark:bg-slate-800">
            <h1 class="text-2xl font-bold">Night shift</h1>
            <p class="mt-2 text-slate-600 dark:text-slate-300">
              Working late? Switch to the dark theme and rest your eyes. Your brand colour stays the same in both modes.
            </p>
            <div class="mt-6 flex gap-3">
              <button id="cta" class="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600">Start a session</button>
              <button id="toggle" class="rounded-lg border border-slate-300 px-4 py-2 font-semibold dark:border-slate-600">Toggle dark mode</button>
            </div>
          </main>

          <script>
            const toggle = document.getElementById("toggle");
            toggle.addEventListener("click", () => {
              document.documentElement.classList.toggle("dark");
            });
          </script>
        </body>
      </html>
quiz:
  - q: "By default (with no extra setup), what makes the dark: variant switch on in Tailwind v4?"
    options: ["A dark class on the html element", "The visitor's system setting (prefers-color-scheme: dark)", "A button you must always add"]
    answer: 1
  - q: 'What does @custom-variant dark (&:where(.dark, .dark *)); do?'
    options: ["It makes dark: apply inside any element with the class dark (or on it)", "It darkens every colour on the page", "It deletes the dark variant"]
    answer: 0
  - q: After defining --color-brand-500 in @theme, which class uses it?
    options: ["color-brand-500", "bg-brand-500", "brand-500-bg"]
    answer: 1
    explain: The name after --color- becomes the colour name, so bg-, text-, border- and the others all work with it.
  - q: How does the toggle button switch dark mode with the custom variant?
    options: ["It reloads the page with a different stylesheet", "It changes the Tailwind script URL", "It adds or removes the dark class on the html element with JavaScript"]
    answer: 2
---

Many people use dark themes at night, and many sites support them. Tailwind makes this almost free: you write the light design first and add `dark:` classes only where the dark version differs. In this lesson you also teach Tailwind your own brand colour, so `bg-brand-500` works like any built-in class.

## The dark: variant

Put `dark:` in front of any class to apply it only in dark mode:

```html
<body class="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
```

In light mode the page is pale with dark text. In dark mode the two swap. You only write the classes that change; everything else carries over.

## It follows the system setting

Out of the box, `dark:` listens to the visitor's operating system through the CSS feature `prefers-color-scheme: dark`. If their phone or laptop is in dark mode, your page is too, with no JavaScript. That is a good default, but there is no way for the visitor to override it on your page. (If your preview already looks dark before you change anything, that is why.)

## A switchable dark mode

To give users a button, you tell Tailwind v4 to follow a **class** instead of the system. Inside a style tag with the special type `text/tailwindcss` you write a **custom variant**:

```html
<style type="text/tailwindcss">
  @custom-variant dark (&:where(.dark, .dark *));
</style>
```

Read it as: "the `dark:` variant applies to an element that has the class `dark`, or is inside one". Now put `class="dark"` on the `<html>` element and every `dark:` class switches on. A tiny script flips it:

```js
document.documentElement.classList.toggle("dark");
```

`document.documentElement` is the `<html>` element, and `toggle` adds the class if it is missing and removes it if it is there. Real sites also save the choice (for example in `localStorage`) so it survives a reload; the lesson preview cannot store things, so we skip that.

## Your own theme with @theme

Tailwind's design values live in CSS variables called **theme variables**. Add your own in an `@theme` block:

```html
<style type="text/tailwindcss">
  @theme {
    --color-brand-500: #7c3aed;
    --color-brand-600: #6d28d9;
  }
</style>
```

The name after `--color-` becomes a colour name. Immediately `bg-brand-500`, `text-brand-500`, `border-brand-600`, `hover:bg-brand-600` and `ring-brand-500` all exist. You can also change fonts (`--font-display`), breakpoints (`--breakpoint-3xl`) and more, using the same idea. In Tailwind v4 this CSS-first setup replaces the old `tailwind.config` file.

## Designing for both modes

- Do not just invert colours. Pair a light surface with a dark one: `bg-white dark:bg-slate-800`.
- Keep text readable: `text-slate-600` on white becomes `dark:text-slate-300` on dark slate.
- Brand colours often work in both modes. Check buttons and borders in each one.
- Test the contrast of both themes, not only the light one.

> **Watch out:**
> - Writing `dark:` classes but never adding the custom variant (or the `dark` class on `html`) and then wondering why the button does nothing. With the default setup only the system setting counts.
> - Putting the `@custom-variant` or `@theme` code in a normal `<style>` tag. It must be `<style type="text/tailwindcss">`, otherwise the browser treats it as ordinary CSS and ignores it.
> - Forgetting the dark counterpart of a background. You get dark text on a dark card, which is unreadable. Whenever you add `dark:bg-...`, think about text and borders too.
> - A mistake in the colour name: `--colour-brand-500` (British spelling) or `--color-brand500` defines something Tailwind does not recognise, so `bg-brand-500` quietly does nothing.

## Going further

Add `--color-brand-100: #ede9fe;` and use `bg-brand-100` as the page background in light mode. Add a `dark:hover:bg-brand-500` rule, or define a font with `--font-display: Georgia, serif;` and use `font-display` on the heading.

> **Your turn:** in the style tag add the custom `dark` variant and an `@theme` block with `--color-brand-500: #7c3aed;` and `--color-brand-600: #6d28d9;`. Add `dark:` classes to the body, card and paragraph. Give the Start button `bg-brand-500 hover:bg-brand-600`, and make the toggle handler call `classList.toggle("dark")` on the `html` element.
