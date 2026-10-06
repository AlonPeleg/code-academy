---
title: Tailwind - utility-first CSS
summary: Style a page by stacking tiny single-purpose classes straight in your HTML.
level: beginner
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Pocket Planner</title>
          <!-- 1. Add the Tailwind script tag here (it goes in the head) -->
        </head>
        <body>
          <!-- 2. Give the body a light grey-blue background -->
          <!-- 3. Turn the article into a card: centred, narrow, padded, rounded, white, with a shadow -->
          <article>
            <!-- 4. Make the heading big and bold, in a dark colour -->
            <h2>Pocket Planner</h2>
            <!-- 5. Give the paragraph a little space above it and a softer text colour -->
            <p>Plan your week in one tidy place. Add tasks, tick them off and see how much you got done.</p>
            <!-- 6. Turn the button into a rounded, coloured, bold button with white text -->
            <button>Get started</button>
          </article>
        </body>
      </html>
check:
  dom:
    text:
      - "Pocket Planner"
      - "Get started"
    styles:
      - { selector: "article", property: "padding-top", value: "24px" }
      - { selector: "article", property: "border-radius", value: "12px" }
      - { selector: "article", property: "max-width", value: "384px" }
      - { selector: "h2", property: "font-size", value: "24px" }
      - { selector: "h2", property: "font-weight", value: "700" }
      - { selector: "button", property: "border-radius", value: "8px" }
      - { selector: "button", property: "padding-left", value: "16px" }
      - { selector: "button", property: "font-weight", value: "600" }
  code:
    - { pattern: '<script[^>]+src="https://cdn\.jsdelivr\.net/npm/@tailwindcss/browser@4"', message: "Add the Tailwind script tag to the head: <script src=\"https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4\"></script>" }
hints:
  - "Two things are needed: the Tailwind script tag in the head (otherwise no class does anything), and a class attribute on the body, article, h2, p and button."
  - "Padding, width, rounding and font weight are all single classes. Think p-6 (padding), max-w-sm (maximum width), rounded-xl (corners), text-2xl and font-bold (heading), px-4 and font-semibold (button)."
  - "article: class=\"mx-auto mt-12 max-w-sm rounded-xl bg-white p-6 shadow-lg\"   h2: class=\"text-2xl font-bold text-slate-900\"   p: class=\"mt-2 text-slate-600\"   button: class=\"mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white\""
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Pocket Planner</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-slate-100">
          <article class="mx-auto mt-12 max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 class="text-2xl font-bold text-slate-900">Pocket Planner</h2>
            <p class="mt-2 text-slate-600">Plan your week in one tidy place. Add tasks, tick them off and see how much you got done.</p>
            <button class="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Get started</button>
          </article>
        </body>
      </html>
quiz:
  - q: What does "utility-first" mean in Tailwind?
    options: ["You style elements by combining many tiny classes, each doing one job", "You write one big class per component and keep all styles in it", "You must write all your CSS in a separate file first"]
    answer: 0
  - q: In Tailwind, which class gives an element 1rem (16px) of padding on all sides?
    options: ["pad-16", "p-4", "padding-1"]
    answer: 1
    explain: The spacing scale counts in quarters of a rem, so 4 means 4 x 0.25rem = 1rem.
  - q: What happens if you misspell a class, for example "rouned-lg"?
    options: ["The page shows a red error", "Tailwind fixes the spelling for you", "Nothing - the class is silently ignored"]
    answer: 2
  - q: Why should real production sites not use the browser script from a CDN?
    options: ["It is a build tool you should run once so only the CSS you use is shipped", "It does not support colours", "It only works on phones"]
    answer: 0
---

Tailwind CSS takes a different road from what you did in the CSS lessons. Instead of inventing class names such as `.card` and writing rules for them in a stylesheet, you style an element by putting many tiny, ready-made classes straight on it. This lesson shows the idea, the setup and how to read a class string. We teach **Tailwind v4**, the current version, so class names here match the current docs (older tutorials for v3 sometimes differ).

## The utility-first idea

A **utility class** does exactly one small job. `font-bold` only sets the font weight, `p-6` only sets padding, `rounded-xl` only rounds the corners. You build a design by stacking them:

```html
<button class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Get started</button>
```

Compare the three approaches:

| Approach | You write | Feels like |
| --- | --- | --- |
| Plain CSS | a class name, then a rule with properties | inventing names, jumping between two files |
| Bootstrap | ready-made component classes like `btn btn-primary` | choosing from a catalogue of finished parts |
| Tailwind | small utilities like `px-4 py-2 rounded-lg` | assembling the part yourself from tiny pieces |

The big win is that you never leave your HTML, you never have to name things, and a class on one element cannot accidentally change another element somewhere else.

## Setup with the browser script

One script tag in the `<head>` switches Tailwind on:

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

It reads the class names on your page and writes the matching CSS for them on the fly. That is perfect for learning and small pages. **Honest note:** real websites do not ship this script. In a production project you use the Tailwind CLI or a build step (Vite, Next.js and others plug it in), which scans your files once and produces one small CSS file containing only the classes you used. You will learn the same class names either way.

## How to read a class string

Take `mx-auto mt-12 max-w-sm rounded-xl bg-white p-6 shadow-lg`. Read it one piece at a time:

- `mx-auto` - horizontal margin (`m` + `x`) set to auto, which centres a block.
- `mt-12` - margin on top, size 12 on the scale (3rem).
- `max-w-sm` - maximum width, size "small" (24rem, or 384px).
- `rounded-xl` - extra-large rounded corners (12px).
- `bg-white` - background colour white.
- `p-6` - padding of 6 units (1.5rem, or 24px) on all four sides.
- `shadow-lg` - a large soft drop shadow.

The pattern is `property-value`, with the property shortened (`p` padding, `m` margin, `bg` background, `text` text colour or size) and the value coming from a fixed scale, so your sizes stay consistent without effort. The order of classes does not matter to the browser, but putting layout first and colours last makes strings easier to scan.

## Where do the numbers come from?

Tailwind has a **spacing scale**: each step is a quarter of a rem, so `p-1` is 0.25rem (4px), `p-4` is 1rem (16px) and `p-6` is 1.5rem (24px). Colours come in a scale too, like `slate-100` (very light) to `slate-900` (very dark). The next lesson covers both in depth.

> **Watch out:**
> - A typo in a class name does **not** raise an error. `rouned-lg` is just ignored and the corners stay square. When something does not change, check the spelling first.
> - Forgetting the `<script>` tag (or putting a typo in its address) leaves the page completely unstyled, because the classes are only words until Tailwind turns them into CSS.
> - Do not build class names by joining strings in JavaScript, such as `"bg-" + colour`. Tailwind looks for complete class names, so `bg-indigo-600` written in full works, but a half-built one may never be generated. You will meet this again in the last lesson.
> - Class names you may know from v3 (such as `bg-gradient-to-r`) were renamed in v4 (`bg-linear-to-r`). If a class from an old tutorial does nothing, look it up in the v4 docs.

## Going further

Try `rounded-3xl`, `shadow-2xl`, `bg-amber-50` on the body and `text-slate-500` on the paragraph. Change `p-6` to `p-10` and watch the card breathe.

> **Your turn:** add the Tailwind script tag to the head, then style the page: a `bg-slate-100` body, and an `article` card with `mx-auto mt-12 max-w-sm rounded-xl bg-white p-6 shadow-lg`. Make the `h2` `text-2xl font-bold`, and the button `rounded-lg px-4 py-2 font-semibold` with a coloured background and white text.
