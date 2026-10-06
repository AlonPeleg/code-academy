---
title: Layout with Flexbox
summary: Line things up in a row and space them out.
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
          <div class="row">
            <div class="box">One</div>
            <div class="box">Two</div>
            <div class="box">Three</div>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      .box {
        background: #6d5efc;
        color: white;
        padding: 20px;
        border-radius: 8px;
      }

      .row {
        /* Make the boxes sit side by side with space between them */
      }
check:
  dom:
    styles:
      - { selector: ".row", property: "display", value: "flex" }
      - { selector: ".row", property: "justify-content", value: "space-between" }
hints:
  - "Only the parent (.row) needs changing. Its display value decides how its children are arranged."
  - "First turn .row into a flex container using the display property. Then use a second property that spreads the items along the row."
  - "display: flex;   and   justify-content: space-between;"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="row">
            <div class="box">One</div>
            <div class="box">Two</div>
            <div class="box">Three</div>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      .box {
        background: #6d5efc;
        color: white;
        padding: 20px;
        border-radius: 8px;
      }

      .row {
        display: flex;
        justify-content: space-between;
      }
quiz:
  - q: Which declaration turns an element into a flex container?
    options: ["position: flex;", "flex: container;", "display: flex;"]
    answer: 2
  - q: Which property spreads flex items along the main axis (e.g. space-between)?
    options: ["align-items", "justify-content", "flex-wrap"]
    answer: 1
    explain: justify-content works along the main axis (a row by default). align-items works across it.
  - q: By default, flex items are laid out in a...
    options: ["Row", "Column", "Circle"]
    answer: 0
  - q: Which element do you put display flex on?
    options: ["On each child (the items)", "On the parent (the container)", "On the body only"]
    answer: 1
---

Normally, `<div>` elements stack on top of each other, one per line. **Flexbox** is a layout tool that lets you arrange children in a row (or a column) and control their spacing and alignment. It is how most navigation bars, card rows and toolbars on the web are built.

## Container and items

Flexbox always involves two levels. The **parent** is the *flex container*, and its **direct children** are the *flex items*. You switch it on with one line on the parent:

```css
.row {
  display: flex;
}
```

Instantly, the boxes jump onto one line, side by side. You did not touch the boxes themselves.

## The two axes

Flexbox thinks in two directions:

- The **main axis** is the direction items flow. By default that is left to right (a row).
- The **cross axis** is the other direction (top to bottom).

Two properties control them:

- `justify-content` positions items along the **main** axis.
- `align-items` positions items along the **cross** axis.

```css
.row {
  display: flex;
  justify-content: space-between; /* spread out, first and last touch the edges */
  align-items: center;            /* centre vertically */
  gap: 12px;                      /* space between items */
}
```

Values you can use for `justify-content`:

| Value | Result |
| --- | --- |
| `flex-start` | Items packed at the start (default) |
| `center` | Items in the middle |
| `flex-end` | Items packed at the end |
| `space-between` | Equal space between items, none at the ends |
| `space-around` | Equal space around each item |

## Direction and wrapping

- `flex-direction: column;` stacks items vertically. Now the main axis points downward, so `justify-content` works vertically.
- `flex-wrap: wrap;` lets items move onto a new line when there is not enough room.

## Growing items

Add `flex: 1;` to an item and it grows to take the free space. If all three boxes have `flex: 1;` they share the width equally.

## A classic: perfect centring

```css
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
```

> **Watch out:**
> - Putting `display: flex` on the children instead of the parent. Nothing happens, because the container must be the parent.
> - `justify-content: space-between` seems to do nothing: the container may not be wider than its content (for example, if it is inline), or there is only one item.
> - `justify-content: middle` is not valid. The word is `center`.
> - Confusing the two axes after switching to `flex-direction: column`: the roles of `justify-content` and `align-items` swap their directions.
> - Using margins with `space-between` and getting unexpected spacing. Prefer `gap`.

## Going further

Add `gap: 12px` and `align-items: center` to `.row`. Change `justify-content` to `center`, then `flex-end`. Add `flex-direction: column` and watch what happens.

> **Your turn:** make `.row` a flex container with `justify-content: space-between`.
