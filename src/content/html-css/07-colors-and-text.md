---
title: Colours, fonts and text
summary: Make text look good with fonts, alignment, spacing and emphasis.
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
          <h1>Cafe Menu</h1>
          <p class="lead">Fresh coffee and warm pastries.</p>
          <p>Open every day from seven until five.</p>
        </body>
      </html>
  - name: style.css
    code: |
      /* 1. body: use the font Georgia, with serif as a backup */
      body {

      }

      /* 2. h1: colour #1e90ff, centred, in capital letters */
      h1 {

      }

      /* 3. .lead: italic and bold */
      .lead {

      }

      /* 4. every paragraph: a line height of 28px */
      p {

      }
check:
  dom:
    styles:
      - { selector: "body", property: "font-family", value: "Georgia, serif" }
      - { selector: "h1", property: "color", value: "rgb(30, 144, 255)" }
      - { selector: "h1", property: "text-align", value: "center" }
      - { selector: "h1", property: "text-transform", value: "uppercase" }
      - { selector: ".lead", property: "font-style", value: "italic" }
      - { selector: ".lead", property: "font-weight", value: "700" }
      - { selector: "p", property: "line-height", value: "28px" }
hints:
  - "Each comment in style.css names the rule to fill in. All of these are properties you can look up by their plain-English names: font, alignment, case, style, weight and line height."
  - "The properties are font-family, color, text-align, text-transform, font-style, font-weight and line-height. Write each as property: value;"
  - "body { font-family: Georgia, serif; }  h1 { color: #1e90ff; text-align: center; text-transform: uppercase; }  .lead { font-style: italic; font-weight: bold; }  p { line-height: 28px; }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <h1>Cafe Menu</h1>
          <p class="lead">Fresh coffee and warm pastries.</p>
          <p>Open every day from seven until five.</p>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: Georgia, serif;
      }

      h1 {
        color: #1e90ff;
        text-align: center;
        text-transform: uppercase;
      }

      .lead {
        font-style: italic;
        font-weight: bold;
      }

      p {
        line-height: 28px;
      }
quiz:
  - q: 'Why do we write  font-family: Georgia, serif;  with two names?'
    options: ["The browser mixes the two fonts", "If Georgia is not installed, the browser uses a generic serif font instead", "serif is the font size"]
    answer: 1
  - q: Which property changes the colour of text?
    options: ["text-color", "font-color", "color"]
    answer: 2
    explain: The property is simply color, and background-color sets the background.
  - q: 'What does  text-align: center;  do?'
    options: ["Centres the text horizontally inside its box", "Moves the box to the middle of the screen vertically", "Makes the text bigger"]
    answer: 0
  - q: Which value makes text bold?
    options: ["font-weight: bold;", "font-style: bold;", "text-decoration: bold;"]
    answer: 0
---

Most of the web is text, so a few CSS properties go a very long way. In this lesson you will meet the ones you will use all the time: fonts, colours, alignment, emphasis and spacing.

## Fonts

`font-family` chooses the typeface. Because you can not be sure every visitor has the font you pick, you give a **list**, from favourite to backup:

```css
body {
  font-family: Georgia, serif;
}
```

The last name is a **generic family** that always exists: `serif` (letters with little feet), `sans-serif` (clean letters), or `monospace` (code). If a font name has spaces, put it in quotes, like `"Times New Roman"`.

Properties you set on `body` are **inherited**: headings and paragraphs inside it use the same font unless you override it. That is why we set the font once on `body`.

## Colour

`color` is the text colour. You saw names such as `tomato`. Hex codes give you millions of exact shades:

```css
h1 {
  color: #1e90ff; /* a bright blue */
}
```

A hex code is `#` followed by three pairs: red, green, blue. `#1e90ff` is red 30, green 144, blue 255. The browser's tools report this same colour as `rgb(30, 144, 255)`.

## Alignment and capitals

- `text-align` accepts `left`, `center`, `right` and `justify`.
- `text-transform` changes capital letters without retyping: `uppercase`, `lowercase` or `capitalize`.

## Emphasis

- `font-weight: bold;` (or a number such as `700`) makes text heavier.
- `font-style: italic;` slants it.
- `text-decoration` adds `underline` or removes it (`none`), which is how you remove the underline from links.

## Spacing text

- `line-height` is the distance from one line to the next. A comfortable value is 1.5 to 1.8 times the font size. You can write a plain number like `1.6` or a length like `28px`.
- `letter-spacing: 2px;` adds space between letters, nice for small uppercase headings.

```css
p {
  line-height: 28px;
  letter-spacing: 0.5px;
}
```

## Using a class

In the starter, one paragraph has `class="lead"`. A **class** lets you style some elements and not others. In CSS you select a class with a dot: `.lead { ... }`. You will learn more about this in the selectors lesson.

> **Watch out:**
> - `font-color` and `text-color` do not exist. The property is `color`.
> - `font-weight: bolder;` is not what you want; use `bold` or a number.
> - Forgetting the dot before a class name. `lead { ... }` looks for a `<lead>` tag. Write `.lead { ... }`.
> - Mixing up `text-align` with the position of the box. `text-align: center` centres the text *inside* its box.
> - Picking a very light colour for text on a white background. Make sure people can read it.

## Going further

Try `text-decoration: underline;` on the `h1`, `letter-spacing: 3px;` on the heading, and a different backup list such as `"Trebuchet MS", sans-serif`.

> **Your turn:** fill in the four empty rules in `style.css` following the numbered comments.
