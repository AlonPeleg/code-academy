---
title: Bootstrap layout and the 12-column grid
summary: Build page layouts with container, row and col, and make columns stack on small screens.
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
          <title>Layout with the grid</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-4">
            <h1 class="mb-4">Why people love our app</h1>

            <!-- 1. Turn this plain div into a row with the gutter class g-4. -->
            <div>
              <!-- 2. Wrap each box in its own column div:
                      col-12 (full width on phones) and col-md-4 (one third of the row from the md breakpoint up). -->
              <div class="p-3 border bg-light rounded">Fast: pages open in a blink.</div>
              <div class="p-3 border bg-light rounded">Simple: no manual needed.</div>
              <div class="p-3 border bg-light rounded">Friendly: help is one click away.</div>
            </div>

            <!-- 3. Make this a second row (also g-4, plus mt-2) with an 8-wide and a 4-wide column from md up. -->
            <div class="mt-2">
              <div class="p-3 border">Main article: the wider area for the story.</div>
              <div class="p-3 border">Sidebar: links and extras.</div>
            </div>
          </div>
        </body>
      </html>
check:
  dom:
    selectors:
      - ".container > .row > .col-md-4:nth-child(3)"
      - ".container > .row > .col-md-8"
      - ".container > .row > .col-md-4:nth-child(2)"
    styles:
      - { selector: ".row", property: "display", value: "flex" }
      - { selector: ".row", property: "flex-wrap", value: "wrap" }
  code:
    - { pattern: '(class="[^"]*\bcol-md-4\b[^"]*"[\s\S]*){4}', message: "You need four col-md-4 columns: three feature boxes and the sidebar." }
    - { pattern: 'class="[^"]*\bcol-12\b', message: "Give the feature columns col-12 so they are full width on phones." }
    - { pattern: 'class="[^"]*\bcol-md-8\b', message: "The main article column should be col-md-8." }
    - { pattern: 'class="[^"]*\bg-[1-5]\b', message: "Add a gutter class such as g-4 to the row." }
hints:
  - "The grid has three layers: a container, then a row, then columns that sit directly inside the row. Your boxes are missing the row and the columns."
  - "Change the first plain div into class row g-4. Put each box inside a new div with the classes col-12 col-md-4. Do the same for the second pair, with col-md-8 and col-md-4."
  - 'Row one: <div class="row g-4"> with three <div class="col-12 col-md-4"> children, each holding one box. Row two: <div class="row g-4 mt-2"> holding <div class="col-md-8"> and <div class="col-md-4">.'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Layout with the grid</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-4">
            <h1 class="mb-4">Why people love our app</h1>

            <div class="row g-4">
              <div class="col-12 col-md-4">
                <div class="p-3 border bg-light rounded">Fast: pages open in a blink.</div>
              </div>
              <div class="col-12 col-md-4">
                <div class="p-3 border bg-light rounded">Simple: no manual needed.</div>
              </div>
              <div class="col-12 col-md-4">
                <div class="p-3 border bg-light rounded">Friendly: help is one click away.</div>
              </div>
            </div>

            <div class="row g-4 mt-2">
              <div class="col-md-8">
                <div class="p-3 border">Main article: the wider area for the story.</div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border">Sidebar: links and extras.</div>
              </div>
            </div>
          </div>
        </body>
      </html>
quiz:
  - q: How many columns does the Bootstrap grid divide a row into?
    options: ["10", "12", "16"]
    answer: 1
    explain: "12 divides evenly by 2, 3, 4 and 6, which makes halves, thirds, quarters and sixths easy."
  - q: 'What does  class="col-12 col-md-4"  do?'
    options: ["Four columns on phones and twelve on desktops", "A third of the width on every screen", "Full width on phones, one third of the row from 768px upwards"]
    answer: 2
  - q: Where must a column live?
    options: ["Directly inside a row", "Directly inside the body", "Inside a button"]
    answer: 0
    explain: "Columns outside a row lose the negative margins and widths the row provides."
  - q: What does g-4 on a row control?
    options: ["The row is 4 columns wide", "The gutter: the space between columns and rows", "A grey background"]
    answer: 1
---

Almost every web page is a set of boxes arranged in rows and columns. Bootstrap solves this with a **12-column grid**: you say how many of the 12 slots each box should take, and Bootstrap does the maths. You will learn the three building blocks and how to make columns stack on phones.

## The three layers

1. **`container`** centres the page and limits its width. (`container-fluid` stretches edge to edge instead.)
2. **`row`** is a horizontal band. It is a flexbox container that wraps its children onto new lines when they do not fit.
3. **`col`** classes are the columns. They must be **direct children of a row**.

```html
<div class="container">
  <div class="row">
    <div class="col">One</div>
    <div class="col">Two</div>
    <div class="col">Three</div>
  </div>
</div>
```

A plain `col` shares the row equally, so three of them are a third each. To choose a size, add a number from 1 to 12: `col-4` takes 4 of the 12 slots. Numbers in one row should add up to 12 (or less). If they add up to more, the extra column drops to a new line.

## Breakpoints: columns that react to screen width

Phones and desktops need different layouts, so Bootstrap lets you put a **breakpoint** in the class name:

| Class prefix | Applies from a screen this wide | Typical device |
| --- | --- | --- |
| `col-` | 0px and up | phones |
| `col-sm-` | 576px | large phones |
| `col-md-` | 768px | tablets |
| `col-lg-` | 992px | laptops |
| `col-xl-` | 1200px | desktops |

The rule is **mobile first**: a class applies from its breakpoint upwards. So `col-12 col-md-4` reads "take all 12 slots on small screens, but only 4 (a third) from 768px up". On a phone the three boxes stack; on a tablet they sit side by side. You can combine several: `col-12 col-md-6 col-lg-4` gives one, two, then three per row.

Useful variants:

- `col-md-auto` sizes the column to its content.
- `row-cols-3` on the row says "three columns per line", with no per-column classes.
- `offset-md-2` pushes a column to the right by two slots.

## Gutters: the gaps

Columns have padding on each side to make a gap. Control it on the row with `g-*` classes: `g-0` removes it, `g-3` or `g-4` make it roomier. `gx-` is horizontal only and `gy-` is vertical only. The vertical gutter matters when columns stack, because it spaces the stacked boxes.

## Putting content inside

Keep the column as the layout piece and put your styled content *inside* it, as in the exercise. If you style the column itself with a border and background, the gutter padding will sit inside the border, which looks odd. A nested `div` with `p-3 border` avoids that.

## Testing it

Drag the preview panel narrower and wider to watch the columns stack and unstack. The lesson check cannot resize the window, so it checks your structure and class names instead of the pixel layout.

> **Watch out:**
> - Forgetting the `row`. Columns placed straight in a container stack as plain blocks and the gutters look wrong.
> - Putting columns inside another column without a new `row`. Nested grids need their own row.
> - Writing `col-md-4` on every column and expecting a layout on phones. Below 768px there is no width rule, so each column takes the full width and stacks (which is often what you want, but add `col-12` to make it explicit).
> - Adding up to more than 12. Eight plus eight wraps the second column to a new line.
> - Missing the viewport meta tag, so a phone reports a desktop width and never shows the small layout.

> **Your turn:** turn the first plain div into `row g-4` and wrap the three feature boxes in `col-12 col-md-4` columns. Then turn the second div into `row g-4 mt-2` with a `col-md-8` main column and a `col-md-4` sidebar column.
