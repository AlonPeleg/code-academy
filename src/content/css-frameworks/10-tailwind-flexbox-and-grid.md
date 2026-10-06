---
title: Tailwind - flexbox and grid
summary: Lay out rows, columns and grids with utilities, and build a three-plan pricing section.
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
          <title>Pricing</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-slate-50 p-6 text-slate-800">
          <section class="mx-auto max-w-5xl">
            <!-- 1. header: a flex row, items centred vertically, title on the left and link pushed to the right -->
            <header>
              <h1 class="text-3xl font-bold">Pricing</h1>
              <a href="#" class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Contact sales</a>
            </header>

            <!-- 2. #plans: a grid with 3 equal columns and a 1.5rem gap -->
            <div id="plans" class="mt-8">
              <!-- 3. each article: a flex column that pushes the button to the bottom -->
              <article class="rounded-2xl bg-white p-6 shadow-md">
                <div>
                  <h2 class="text-lg font-semibold">Starter</h2>
                  <p class="mt-2 text-4xl font-bold">$0</p>
                  <ul class="mt-4 text-slate-600">
                    <li>1 project</li>
                    <li>Community support</li>
                  </ul>
                </div>
                <a href="#" class="mt-6 rounded-lg bg-slate-100 px-4 py-2 text-center font-semibold">Choose Starter</a>
              </article>

              <article class="rounded-2xl bg-white p-6 shadow-md">
                <div>
                  <h2 class="text-lg font-semibold">Pro</h2>
                  <p class="mt-2 text-4xl font-bold">$12</p>
                  <ul class="mt-4 text-slate-600">
                    <li>Unlimited projects</li>
                    <li>Email support</li>
                    <li>Custom domain</li>
                  </ul>
                </div>
                <a href="#" class="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-center font-semibold text-white">Choose Pro</a>
              </article>

              <article class="rounded-2xl bg-white p-6 shadow-md">
                <div>
                  <h2 class="text-lg font-semibold">Team</h2>
                  <p class="mt-2 text-4xl font-bold">$29</p>
                  <ul class="mt-4 text-slate-600">
                    <li>Everything in Pro</li>
                    <li>10 seats</li>
                  </ul>
                </div>
                <a href="#" class="mt-6 rounded-lg bg-slate-100 px-4 py-2 text-center font-semibold">Choose Team</a>
              </article>

              <!-- 4. #banner: spans all 3 columns, and is a flex row with the text on the left and the link on the right -->
              <div id="banner" class="rounded-2xl bg-indigo-600 p-6 text-white">
                <p class="text-lg font-semibold">Need more than 10 seats?</p>
                <a href="#" class="rounded-lg bg-white px-4 py-2 font-semibold text-indigo-700">Talk to us</a>
              </div>
            </div>
          </section>
        </body>
      </html>
check:
  dom:
    text:
      - "Starter"
      - "Talk to us"
    selectors:
      - "#plans > article"
    styles:
      - { selector: "header", property: "display", value: "flex" }
      - { selector: "header", property: "align-items", value: "center" }
      - { selector: "header", property: "justify-content", value: "space-between" }
      - { selector: "#plans", property: "display", value: "grid" }
      - { selector: "#plans", property: "column-gap", value: "24px" }
      - { selector: "#plans > article", property: "display", value: "flex" }
      - { selector: "#plans > article", property: "flex-direction", value: "column" }
      - { selector: "#plans > article", property: "justify-content", value: "space-between" }
      - { selector: "#banner", property: "display", value: "flex" }
      - { selector: "#banner", property: "align-items", value: "center" }
      - { selector: "#banner", property: "justify-content", value: "space-between" }
      - { selector: "#banner", property: "grid-column-start", value: "span 3" }
  code:
    - { pattern: '\bgrid-cols-3\b', message: "Use grid-cols-3 on #plans for three equal columns." }
    - { pattern: '\bcol-span-3\b', message: "Use col-span-3 on #banner so it stretches across all three columns." }
hints:
  - "Flex and grid are switched on with one class on the PARENT: flex or grid. Alignment classes go on the same parent. The children only need classes when they are special (like the banner spanning columns)."
  - "header: flex items-center justify-between. #plans: grid grid-cols-3 gap-6. Each article: flex flex-col justify-between. #banner: col-span-3 flex items-center justify-between."
  - "<header class=\"flex items-center justify-between\">   <div id=\"plans\" class=\"mt-8 grid grid-cols-3 gap-6\">   <article class=\"flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md\">   <div id=\"banner\" class=\"col-span-3 flex items-center justify-between rounded-2xl bg-indigo-600 p-6 text-white\">"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Pricing</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-slate-50 p-6 text-slate-800">
          <section class="mx-auto max-w-5xl">
            <header class="flex items-center justify-between">
              <h1 class="text-3xl font-bold">Pricing</h1>
              <a href="#" class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Contact sales</a>
            </header>

            <div id="plans" class="mt-8 grid grid-cols-3 gap-6">
              <article class="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md">
                <div>
                  <h2 class="text-lg font-semibold">Starter</h2>
                  <p class="mt-2 text-4xl font-bold">$0</p>
                  <ul class="mt-4 text-slate-600">
                    <li>1 project</li>
                    <li>Community support</li>
                  </ul>
                </div>
                <a href="#" class="mt-6 rounded-lg bg-slate-100 px-4 py-2 text-center font-semibold">Choose Starter</a>
              </article>

              <article class="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md">
                <div>
                  <h2 class="text-lg font-semibold">Pro</h2>
                  <p class="mt-2 text-4xl font-bold">$12</p>
                  <ul class="mt-4 text-slate-600">
                    <li>Unlimited projects</li>
                    <li>Email support</li>
                    <li>Custom domain</li>
                  </ul>
                </div>
                <a href="#" class="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-center font-semibold text-white">Choose Pro</a>
              </article>

              <article class="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md">
                <div>
                  <h2 class="text-lg font-semibold">Team</h2>
                  <p class="mt-2 text-4xl font-bold">$29</p>
                  <ul class="mt-4 text-slate-600">
                    <li>Everything in Pro</li>
                    <li>10 seats</li>
                  </ul>
                </div>
                <a href="#" class="mt-6 rounded-lg bg-slate-100 px-4 py-2 text-center font-semibold">Choose Team</a>
              </article>

              <div id="banner" class="col-span-3 flex items-center justify-between rounded-2xl bg-indigo-600 p-6 text-white">
                <p class="text-lg font-semibold">Need more than 10 seats?</p>
                <a href="#" class="rounded-lg bg-white px-4 py-2 font-semibold text-indigo-700">Talk to us</a>
              </div>
            </div>
          </section>
        </body>
      </html>
quiz:
  - q: Where do you put the flex class to line up three items in a row?
    options: ["On each of the three items", "On the parent element that contains them", "On the body only"]
    answer: 1
  - q: Which class makes a grid with three equal columns?
    options: ["columns-3", "grid-3", "grid-cols-3"]
    answer: 2
  - q: In a flex row, which class centres the items vertically?
    options: ["items-center", "justify-center", "text-center"]
    answer: 0
    explain: items-* aligns across the row (the cross axis); justify-* spreads items along the row (the main axis).
  - q: What does col-span-2 do on a grid child?
    options: ["Adds two columns to the grid", "Makes the child as wide as two columns", "Gives the child a gap of 2"]
    answer: 1
---

Layout is where Tailwind really starts to feel fast. Flexbox and grid, the two layout systems you may already know from the CSS lessons, become one-word classes. In this lesson you build a pricing section: a header row, three plan cards in a grid and a banner stretching underneath.

## Flexbox in classes

Put `flex` on a **parent** and its children line up in a row. Then add alignment classes to the same parent:

```html
<div class="flex items-center justify-between gap-4">
  <span>Logo</span>
  <a href="#">Log in</a>
</div>
```

- `flex` - switches the flex layout on (`display: flex`).
- `items-center` - centres the children across the row, which means vertically (`align-items: center`).
- `justify-between` - spreads them along the row with free space between (`justify-content: space-between`). Others: `justify-start`, `justify-center`, `justify-end`.
- `gap-4` - 1rem between the children. Use gap instead of margins on each child.
- `flex-col` - stacks children in a column instead (`flex-direction: column`). Now `justify-*` works vertically.
- `flex-wrap` - lets items drop to a new line; `flex-1` lets one child grow to fill the free space.

## Grid in classes

Put `grid` on the parent and say how many columns:

```html
<div class="grid grid-cols-3 gap-6">
  <div>1</div><div>2</div><div>3</div>
  <div class="col-span-3">A wide one under them</div>
</div>
```

- `grid-cols-3` - three columns of equal width (`repeat(3, minmax(0, 1fr))`). Any number from 1 to 12 works.
- `gap-6` - 1.5rem between rows and columns. `gap-x-6` and `gap-y-2` set them separately.
- `col-span-3` - this child takes up three columns. `row-span-2` does the same downwards.

## Flex or grid?

Use **flex** for one-dimensional things: a navbar, a row of buttons, the inside of a card. Use **grid** when you think in rows and columns together: a gallery, a dashboard, a pricing table. You can and should nest them: the plans below are grid items, and each plan is itself a flex column.

## The pricing layout, piece by piece

1. The `header` is a flex row. `justify-between` pushes the title left and the link right, `items-center` aligns them.
2. `#plans` is a grid with `grid-cols-3 gap-6`. Its three `article` children land in the three columns, and the banner (spanning all three) gets its own row.
3. Each `article` is `flex flex-col justify-between`. The top part (title, price, list) and the button become two children of a column, so `justify-between` sends the button to the bottom. All three buttons then line up even when the lists are different lengths.
4. The banner uses `col-span-3 flex items-center justify-between`: it is a grid child that spans the row, and it is a flex row inside.

> **Watch out:**
> - Putting `flex` on the children instead of the parent does nothing useful. The parent is always the container.
> - `justify-center` seems not to work in a column? In a `flex-col`, the main axis is vertical, and the container needs spare height for the effect to be visible.
> - `grid-cols-3` on a narrow phone squeezes the columns very small. Next lesson fixes that with `grid-cols-1 md:grid-cols-3`.
> - A `col-span-3` child inside a grid that only has two columns creates extra, hidden columns and breaks the layout. The span should not be larger than `grid-cols-*`.

## Going further

Try `grid-cols-2`, then `grid-cols-4`. Add `items-start` to the `#plans` grid and see the cards shrink to their content. Swap `justify-between` for `justify-center` in the header.

> **Your turn:** make `header` `flex items-center justify-between`; make `#plans` `grid grid-cols-3 gap-6`; make every `article` `flex flex-col justify-between`; and make `#banner` `col-span-3 flex items-center justify-between`.
