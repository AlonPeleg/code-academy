---
title: Styling with CSS
summary: Colours, font sizes and how a CSS rule is built.
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
          <h1>Styled with CSS</h1>
          <p>CSS controls how things look.</p>
        </body>
      </html>
  - name: style.css
    code: |
      /* Change the h1 colour to anything but black,
         and make paragraphs 20px tall text. */
      h1 {

      }

      p {

      }
check:
  dom:
    styles:
      - { selector: "h1", property: "color", not: "rgb(0, 0, 0)" }
      - { selector: "p", property: "font-size", value: "20px" }
hints:
  - "Each rule in style.css has braces. The things you want to change go between the braces, one per line."
  - "Use the property color for the heading and the property font-size for the paragraph. Every line is property, colon, value, semicolon."
  - "h1 { color: tomato; }   and   p { font-size: 20px; }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <h1>Styled with CSS</h1>
          <p>CSS controls how things look.</p>
        </body>
      </html>
  - name: style.css
    code: |
      h1 {
        color: tomato;
      }

      p {
        font-size: 20px;
      }
quiz:
  - q: What does CSS do?
    options: ["Adds behaviour like clicks", "Stores data in a database", "Controls how the page looks"]
    answer: 2
  - q: 'In  h1 { color: red; }  what is "h1"?'
    options: ["The property", "The selector", "The value"]
    answer: 1
    explain: The selector chooses which elements to style. "color" is the property and "red" is the value.
  - q: What ends every CSS declaration?
    options: ["A comma", "A full stop", "A semicolon"]
    answer: 2
  - q: How does the HTML file connect to style.css?
    options: ["With a <link rel=\"stylesheet\" href=\"style.css\"> tag in the head", "Automatically, because the names match", "With an <a> tag in the body"]
    answer: 0
---

HTML gives a page its structure; **CSS** (Cascading Style Sheets) gives it its looks. In this lesson you will learn how a CSS rule is built and change the colour and size of text.

## Anatomy of a rule

```css
h1 {
  color: tomato;
}
```

- **Selector** (`h1`): which elements the rule applies to. Here, every `<h1>` on the page.
- **Declaration block** (the `{ ... }`): holds one or more declarations.
- **Property** (`color`): what you want to change.
- **Value** (`tomato`): what you want to change it to.
- A **colon** separates property and value, and a **semicolon** ends each declaration.

A rule can have many declarations:

```css
p {
  color: darkslategray;
  font-size: 18px;
  font-family: Georgia, serif;
}
```

## Connecting CSS to HTML

The easiest way is a separate file, linked in the `<head>` of your HTML:

```html
<link rel="stylesheet" href="style.css" />
```

`rel="stylesheet"` says "this is a stylesheet", and `href` says where the file is. In this editor you switch between `index.html` and `style.css` using the tabs above the code.

You can also write CSS directly inside a `<style>` tag in the head, but separate files keep things tidy and let many pages share one set of styles.

## Writing colours

CSS understands colours in a few ways:

- **Names:** `red`, `tomato`, `skyblue`, `darkgreen`, and about 140 more.
- **Hex codes:** `#ff6347` (red, green and blue in base 16). Short form: `#f00`.
- **rgb():** `rgb(255, 99, 71)`, each number from 0 to 255.

`color` changes the text colour. `background-color` changes the background.

## Writing sizes

`font-size: 20px;` means 20 pixels. Pixels (`px`) are a fixed size. You will also meet `em` and `rem`, which are relative to other font sizes; `1rem` is usually 16px.

## Comments

```css
/* This is a CSS comment. The browser ignores it. */
```

Note that CSS comments use `/* ... */` and not the `<!-- -->` from HTML.

> **Watch out:**
> - A missing semicolon. If you write `color: red` then a new line `font-size: 20px;` the browser cannot tell where the first one ends and ignores both. There is no error message, the style just does not appear.
> - A missing closing brace `}`. Everything after it can stop working.
> - Writing `colour` with the British spelling. CSS only knows `color`.
> - Forgetting the unit, as in `font-size: 20;`. Always write `20px`.
> - A typo in the file name inside `href`. If the stylesheet is not found, nothing is styled at all.

## Going further

Try `background-color: lightyellow;` on `p`, `text-align: center;` on `h1`, and see how the page reacts every time you type.

> **Your turn:** in `style.css`, give the `h1` a colour that is not black, and set the `p` font size to `20px`.
