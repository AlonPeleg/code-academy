---
title: Tailwind - spacing, sizing and typography
summary: Learn the spacing scale, width and height utilities, text styling and the colour scale.
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
          <title>Trail Journal</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-stone-100 p-4">
          <!-- 1. main: centre it, limit its width to 28rem, add 2rem of padding on all sides -->
          <main class="mx-auto rounded-2xl bg-white shadow-md">
            <!-- 2. avatar: make it a 4rem x 4rem square (one class sets both) -->
            <div id="avatar" class="rounded-full bg-amber-400"></div>

            <!-- 3. h1: 1rem of space above, extra large size, bold, tight letter spacing, dark stone text -->
            <h1>Morning on Mount Hallow</h1>

            <p class="mt-1 text-sm font-medium uppercase text-amber-700">Trail journal</p>

            <!-- 4. intro: 1rem of space above, a bigger size, relaxed line height, a mid-grey text colour -->
            <p id="intro">
              We left the car park at six, when the valley was still full of mist. By eight the
              sun had burned it off and the whole ridge lay in front of us, green and gold.
            </p>
          </main>
        </body>
      </html>
check:
  dom:
    text:
      - "Morning on Mount Hallow"
    styles:
      - { selector: "main", property: "max-width", value: "448px" }
      - { selector: "main", property: "padding-top", value: "32px" }
      - { selector: "main", property: "padding-left", value: "32px" }
      - { selector: "#avatar", property: "width", value: "64px" }
      - { selector: "#avatar", property: "height", value: "64px" }
      - { selector: "h1", property: "margin-top", value: "16px" }
      - { selector: "h1", property: "font-size", value: "30px" }
      - { selector: "h1", property: "font-weight", value: "700" }
      - { selector: "#intro", property: "font-size", value: "18px" }
      - { selector: "#intro", property: "margin-top", value: "16px" }
  code:
    - { pattern: 'class="[^"]*\btracking-(tighter|tight|wide|wider|widest|normal)\b', message: "Add a tracking-* class (letter spacing), such as tracking-tight, to the heading." }
    - { pattern: 'class="[^"]*\bleading-(none|tight|snug|normal|relaxed|loose|\d+)\b', message: "Add a leading-* class (line height), such as leading-relaxed, to the intro paragraph." }
    - { pattern: '<h1[^>]*\btext-(slate|gray|zinc|neutral|stone|amber|red|emerald|indigo|sky)-(50|[1-9]00|950)\b', message: "Give the h1 a text colour from the scale, for example text-stone-900." }
    - { pattern: '<p[^>]*\btext-(slate|gray|zinc|neutral|stone)-(50|[1-9]00|950)\b[^>]*id="intro"|id="intro"[^>]*\btext-(slate|gray|zinc|neutral|stone)-(50|[1-9]00|950)\b', message: "Give the intro paragraph a text colour from the scale, for example text-stone-600." }
hints:
  - "Every number on the spacing scale is a multiple of 0.25rem. 28rem, 2rem, 4rem and 1rem are all single classes. The avatar needs only ONE class for both width and height."
  - "Maximum width uses max-w-md, padding on all sides is p-8, the square is size-16, a top margin of 1rem is mt-4, then text-3xl / font-bold / tracking-tight on the heading and text-lg / leading-relaxed on the intro."
  - "main: add max-w-md p-8   #avatar: add size-16   h1: class=\"mt-4 text-3xl font-bold tracking-tight text-stone-900\"   #intro: class=\"mt-4 text-lg leading-relaxed text-stone-600\""
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Trail Journal</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-stone-100 p-4">
          <main class="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-md">
            <div id="avatar" class="size-16 rounded-full bg-amber-400"></div>

            <h1 class="mt-4 text-3xl font-bold tracking-tight text-stone-900">Morning on Mount Hallow</h1>

            <p class="mt-1 text-sm font-medium uppercase text-amber-700">Trail journal</p>

            <p id="intro" class="mt-4 text-lg leading-relaxed text-stone-600">
              We left the car park at six, when the valley was still full of mist. By eight the
              sun had burned it off and the whole ridge lay in front of us, green and gold.
            </p>
          </main>
        </body>
      </html>
quiz:
  - q: How much space does the class p-4 add on every side?
    options: ["4 pixels", "1rem (16px)", "4rem (64px)"]
    answer: 1
    explain: Each step on the spacing scale is 0.25rem, so 4 steps is 1rem.
  - q: What is the difference between w-full and max-w-md?
    options: ["max-w-md sets a width of exactly 28rem", "They are the same thing", "w-full fills the parent, max-w-md stops the element growing past 28rem"]
    answer: 2
  - q: Which class sets width AND height to the same value in one go?
    options: ["size-12", "square-12", "wh-12"]
    answer: 0
  - q: In text-stone-600, what does the 600 mean?
    options: ["A pixel size", "A position on the lightness scale: 50 is lightest, 950 is darkest", "The opacity, 60 percent"]
    answer: 1
---

Almost every design is made of three things: space, size and text. Tailwind gives each of them a consistent scale, so you pick a step instead of inventing a number. By the end of this lesson you will be able to read and write the classes that control all three.

## The spacing scale

One unit of the scale equals `0.25rem` (4px when the font size is the usual 16px). Padding, margin, gap, width and height all use the same scale:

| Class | Value | Pixels |
| --- | --- | --- |
| `p-1` | 0.25rem | 4px |
| `p-2` | 0.5rem | 8px |
| `p-4` | 1rem | 16px |
| `p-8` | 2rem | 32px |
| `p-16` | 4rem | 64px |

Because everything shares the scale, `p-4` next to `gap-4` and `mt-4` always looks harmonious.

## Padding and margin, side by side

The letter tells you the property, the next letter tells you the side:

- `p-4` all sides, `px-4` left and right, `py-4` top and bottom, `pt-4` top only (`pr`, `pb`, `pl` for the others).
- `m-4`, `mx-4`, `my-4`, `mt-4`... the same pattern for margin. `mx-auto` centres a block with a set width. Negative margins put a minus in front: `-mt-2`.

## Width and height

- `w-full` is 100% of the parent, `w-1/2` is half, `w-64` is 16rem. `h-` works the same way.
- `max-w-md` stops an element from growing past 28rem (448px). The other sizes are `max-w-sm`, `max-w-lg`, `max-w-xl` and so on. This is the classic recipe for a readable centred column: `mx-auto max-w-md`.
- `size-16` sets width and height to 4rem together. It is ideal for avatars and icon boxes.
- `min-h-screen` makes an element at least as tall as the window.

## Typography

- Size: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`... (`text-xl` is 20px, `text-3xl` is 30px). Each size also sets a matching line height.
- Weight: `font-normal`, `font-medium`, `font-semibold`, `font-bold`.
- Line height: `leading-tight`, `leading-normal`, `leading-relaxed`. Loose lines are friendlier for paragraphs.
- Letter spacing: `tracking-tight` for big headings, `tracking-wide` for small capital labels.
- Other handy ones: `uppercase`, `italic`, `text-center`, `truncate`.

## The colour scale

Colours are named by hue and a number from light to dark: `stone-50` is almost white, `stone-500` is the middle, `stone-950` is nearly black. The same numbers exist for `slate`, `gray`, `red`, `amber`, `emerald`, `indigo` and many more. The colour utilities all follow `property-hue-number`:

- `text-stone-600` for text, `bg-amber-400` for backgrounds, `border-stone-200` for borders.

A reliable rule: use 900 or 800 for headings, 600 or 500 for body text, 100 or 50 for soft backgrounds. Keep body text at 600 or darker on white so it stays readable.

> **Watch out:**
> - `p-4` and `p-[4px]` are not the same. Plain numbers use the scale (`p-4` is 1rem, or 16px); square brackets are for exact values and always include a unit, so `p-[4px]` really is 4 pixels.
> - Class names that do not exist (`text-xxl`, `p-5px`, `font-heavy`) are silently ignored. If a value does nothing, look it up: sizes go `xs sm base lg xl 2xl`.
> - Margins on neighbouring elements can seem to "disappear" if the parent has `flex` or `grid`; there, prefer `gap-4` on the parent.
> - `text-center` aligns text. `text-lg` sets size and `text-red-500` sets colour. All three start with `text-`, so check which kind you mean.

## Going further

Make the page feel airy: change `p-8` to `p-10`, `leading-relaxed` to `leading-loose`, and the avatar to `size-20`. Then try the same page with `bg-slate-100` and `text-slate-700` to see how a different hue changes the mood.

> **Your turn:** in `main` add `max-w-md p-8`; make the avatar `size-16`; style the `h1` with `mt-4 text-3xl font-bold tracking-tight` and a stone text colour; style the intro with `mt-4 text-lg leading-relaxed` and a stone text colour.
