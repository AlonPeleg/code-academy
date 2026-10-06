---
title: The box model
summary: Padding, border and margin - the spacing around every element.
level: beginner
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
          <div class="card">I am a card</div>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: system-ui, sans-serif;
        background: #f3f4f6;
      }

      .card {
        background: white;
        /* Add: padding 20px, a 2px solid border, and 16px margin */
      }
check:
  dom:
    styles:
      - { selector: ".card", property: "padding-top", value: "20px" }
      - { selector: ".card", property: "border-top-width", value: "2px" }
      - { selector: ".card", property: "margin-top", value: "16px" }
hints:
  - "Three different kinds of space are needed here: inside the border, the border itself, and outside the border."
  - "The properties are padding, border and margin. The border needs three parts: a width, a style and a colour."
  - "padding: 20px;   border: 2px solid black;   margin: 16px;"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="card">I am a card</div>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: system-ui, sans-serif;
        background: #f3f4f6;
      }

      .card {
        background: white;
        padding: 20px;
        border: 2px solid black;
        margin: 16px;
      }
quiz:
  - q: Which space is INSIDE the border?
    options: ["margin", "outline", "padding"]
    answer: 2
    explain: Padding is the space between the content and the border. Margin is the space outside the border.
  - q: Which is the right order, from the content outwards?
    options: ["content, margin, border, padding", "content, padding, border, margin", "margin, content, padding, border"]
    answer: 1
  - q: 'What does  border: 2px solid black;  set?'
    options: ["Width, style and colour", "Only the colour", "Padding and margin"]
    answer: 0
  - q: 'What does  padding: 10px 20px;  mean?'
    options: ["10px left and right, 20px top and bottom", "10px top and bottom, 20px left and right", "10px all around, then another 20px"]
    answer: 1
    explain: With two values the first is for top and bottom, and the second for left and right.
---

Here is the secret behind every layout on the web: **every element is a rectangular box**. Once you understand the box, spacing problems become easy to fix.

## The four layers

From the inside out, each box has:

1. **Content** - the text or image itself.
2. **Padding** - breathing room between the content and the border.
3. **Border** - a line around the padding.
4. **Margin** - space outside the border, pushing other boxes away.

```css
.card {
  padding: 20px;
  border: 2px solid black;
  margin: 16px;
}
```

A picture helps: imagine a framed photograph hanging on a wall. The photo is the content, the white card around it is the padding, the frame is the border, and the gap between the frame and the next frame is the margin.

## Padding

Padding is *inside* the box, so the background colour of the box fills it. Use it to stop text from touching the edge.

- `padding: 20px;` sets all four sides.
- `padding: 10px 20px;` is 10px top and bottom, 20px left and right.
- `padding: 5px 10px 15px 20px;` goes clockwise: top, right, bottom, left.
- `padding-left: 8px;` sets one side only. The same works for `margin-top`, `margin-bottom` and so on.

## Border

The `border` shorthand takes three parts in any order: **width, style, colour**.

```css
border: 2px solid black;
border: 1px dashed gray;
border-radius: 8px; /* rounded corners */
```

Without a style such as `solid`, no border is drawn, even if you set a width and a colour.

## Margin

Margin is *outside* the border and is always transparent. It keeps boxes apart. A neat trick: a box with a fixed `width` and `margin: 0 auto;` is centred horizontally.

Vertical margins of neighbouring blocks **collapse**: if one box has `margin-bottom: 20px` and the box below it has `margin-top: 30px`, the gap is 30px, not 50px.

## How wide is a box?

By default, `width` only sets the width of the content, and padding and border are added on top. A `width: 200px` box with `padding: 20px` ends up 240px wide. Many developers add this line to make sizing less surprising:

```css
* {
  box-sizing: border-box;
}
```

With `border-box`, the width includes padding and border.

> **Watch out:**
> - `border: 2px black;` shows no border because the style (`solid`) is missing.
> - Using `margin` when you want `padding` (and vice versa). If you want the background to grow, use padding. If you want to push boxes apart, use margin.
> - Spaces in the wrong place: `padding: 20 px;` is invalid. Write `20px`.
> - Forgetting that inline elements such as `<span>` ignore vertical margins. Use a `<div>` or `display: inline-block`.

## Going further

Use your browser's developer tools (right-click, Inspect) on any website to see the box model diagram for any element. Try `border-radius: 50%` on a square box.

> **Your turn:** give `.card` `padding: 20px`, a `2px solid` border and `margin: 16px`.
