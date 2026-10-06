---
title: Layout with Grid
summary: Build rows and columns at the same time with CSS Grid.
level: intermediate
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="gallery">
            <div class="cell wide">1 (wide)</div>
            <div class="cell">2</div>
            <div class="cell">3</div>
            <div class="cell">4</div>
            <div class="cell">5</div>
            <div class="cell">6</div>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      .cell {
        background: #6d5efc;
        color: white;
        padding: 24px;
        border-radius: 8px;
        text-align: center;
      }

      .gallery {
        /* 1. Turn this into a grid with three equal columns
           2. Put a 16px gap between the cells */
      }

      .wide {
        /* 3. Make this cell span two columns */
      }
check:
  dom:
    styles:
      - { selector: ".gallery", property: "display", value: "grid" }
      - { selector: ".gallery", property: "column-gap", value: "16px" }
      - { selector: ".gallery", property: "row-gap", value: "16px" }
      - { selector: ".wide", property: "grid-column-start", value: "span 2" }
  code:
    - pattern: "grid-template-columns\\s*:\\s*(repeat\\(\\s*3\\s*,\\s*1fr\\s*\\)|1fr\\s+1fr\\s+1fr)"
      message: "Use grid-template-columns with three equal 1fr columns."
hints:
  - "Grid works like flexbox: you switch it on for the parent container. Then you describe the columns, and the gap between cells."
  - "Use display: grid, then grid-template-columns to define three columns of the same size (the fr unit), and gap for the spacing. For the wide cell use grid-column."
  - ".gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }   and   .wide { grid-column: span 2; }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="gallery">
            <div class="cell wide">1 (wide)</div>
            <div class="cell">2</div>
            <div class="cell">3</div>
            <div class="cell">4</div>
            <div class="cell">5</div>
            <div class="cell">6</div>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      .cell {
        background: #6d5efc;
        color: white;
        padding: 24px;
        border-radius: 8px;
        text-align: center;
      }

      .gallery {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .wide {
        grid-column: span 2;
      }
quiz:
  - q: When should you prefer Grid over Flexbox?
    options: ["When you need to lay things out in rows AND columns at once", "When you want to change the text colour", "Never, Flexbox does everything"]
    answer: 0
  - q: 'What does  grid-template-columns: repeat(3, 1fr);  create?'
    options: ["Three rows of equal height", "A grid with 3 pixels of gap", "Three columns of equal width"]
    answer: 2
  - q: What does the fr unit mean?
    options: ["A fraction of the available space", "Fixed ratio in pixels", "Font rounding"]
    answer: 0
  - q: 'What does  grid-column: span 2;  do to an item?'
    options: ["Repeats the item twice", "Makes the item cover two columns", "Moves the item to column 2"]
    answer: 1
---

Flexbox arranges items in one direction. **CSS Grid** arranges them in **rows and columns at the same time**, like a table or a spreadsheet. It is perfect for photo galleries, dashboards and whole page layouts.

## Turning it on

Like flexbox, grid starts with the parent. Put `display: grid` on the container and its direct children become *grid items*:

```css
.gallery {
  display: grid;
}
```

On its own this just stacks the items. You also need to tell it how many columns you want.

## Defining columns

```css
.gallery {
  display: grid;
  grid-template-columns: 200px 200px 200px; /* three fixed columns */
}
```

Grid has a special unit, `fr`, which stands for a *fraction of the free space*. Three columns of `1fr` each take one third:

```css
grid-template-columns: 1fr 1fr 1fr;
```

There is a shortcut for repeating: `repeat(3, 1fr)` means "three columns, each `1fr`". You can mix units too, like `200px 1fr` for a fixed sidebar and a flexible main area.

Rows are created automatically as you add items: with three columns, six items form two rows.

## Gaps

`gap` puts space between rows and columns (not around the edge):

```css
gap: 16px;           /* both */
row-gap: 8px;        /* just between rows */
column-gap: 24px;    /* just between columns */
```

## Spanning

An item can cover more than one cell. Put this on the **item**, not the container:

```css
.wide {
  grid-column: span 2; /* take up two columns */
}
```

You can also pick exact lines: `grid-column: 1 / 3;` goes from line 1 to line 3, which covers two columns.

## Flexbox or Grid?

- **Flexbox:** one direction, content decides the size. Good for menus, button groups, centring.
- **Grid:** two directions, you decide the layout first. Good for galleries and page layouts.

Plenty of pages use both: grid for the page, flexbox inside the cards.

## A responsive trick

```css
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
```

This makes as many columns of at least 150px as fit. When the window shrinks, columns drop onto new rows automatically.

> **Watch out:**
> - Putting `grid-column` on the container instead of on the item. It must be on the child.
> - Spelling it `grid-template-column` (missing the s). The property is `grid-template-columns`.
> - Adding `px` after `fr`, as in `1fr px`, or `1 fr` with a space. Write `1fr`.
> - Expecting `gap` to work without `display: grid` (or flex) on the parent.
> - Spanning more columns than exist. The browser then adds extra implicit columns and the layout looks broken.

## Going further

Change the columns to `repeat(2, 1fr)` and watch six items form three rows. Try `grid-template-columns: 1fr 2fr 1fr;` so the middle column is twice as wide.

> **Your turn:** make `.gallery` a grid with three equal columns (`repeat(3, 1fr)`) and a `16px` gap, and make `.wide` span two columns.
