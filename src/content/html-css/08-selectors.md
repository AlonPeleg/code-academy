---
title: Selectors, classes and ids
summary: Aim your CSS exactly where you want it with class, id and descendant selectors.
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
          <h1 id="title">Garden notes</h1>
          <p class="note">Water the roses.</p>
          <p>This paragraph is plain.</p>
          <p class="note urgent">Buy soil today!</p>
          <ul class="tools">
            <li>Spade</li>
            <li>Rake</li>
          </ul>
        </body>
      </html>
  - name: style.css
    code: |
      /* 1. Select the element with id "title": colour darkgreen */

      /* 2. Select everything with class "note": background-color #fff3bf */

      /* 3. Select the class "urgent": colour red */

      /* 4. Select li elements inside .tools: bold text */

check:
  dom:
    styles:
      - { selector: "#title", property: "color", value: "rgb(0, 100, 0)" }
      - { selector: ".note", property: "background-color", value: "rgb(255, 243, 191)" }
      - { selector: "p:not(.note)", property: "background-color", value: "rgba(0, 0, 0, 0)" }
      - { selector: ".urgent", property: "color", value: "rgb(255, 0, 0)" }
      - { selector: ".tools li", property: "font-weight", value: "700" }
hints:
  - "There are three different symbols to learn: one for ids, one for classes, and a space for 'inside of'. Check the lesson text for each."
  - "An id is selected with a hash (#title), a class with a dot (.note), and 'li inside .tools' is written with a space between the two selectors."
  - "#title { color: darkgreen; }  .note { background-color: #fff3bf; }  .urgent { color: red; }  .tools li { font-weight: bold; }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <h1 id="title">Garden notes</h1>
          <p class="note">Water the roses.</p>
          <p>This paragraph is plain.</p>
          <p class="note urgent">Buy soil today!</p>
          <ul class="tools">
            <li>Spade</li>
            <li>Rake</li>
          </ul>
        </body>
      </html>
  - name: style.css
    code: |
      #title {
        color: darkgreen;
      }

      .note {
        background-color: #fff3bf;
      }

      .urgent {
        color: red;
      }

      .tools li {
        font-weight: bold;
      }
quiz:
  - q: How do you select all elements with class="note"?
    options: ["#note", ".note", "note"]
    answer: 1
  - q: Which is true about an id?
    options: ["Many elements can share the same id", "An id must be unique on the page", "Ids can not be used in CSS"]
    answer: 1
  - q: What does  .tools li  select?
    options: ["Every li on the page and every .tools element", "Only li elements that are inside an element with class tools", "Only the .tools element that has a li class"]
    answer: 1
    explain: A space between two selectors means "inside of" (a descendant).
  - q: An element has class="note urgent". How many classes does it have?
    options: ["Two", "One, named 'note urgent'", "None, this is invalid"]
    answer: 0
---

So far you have styled every `<h1>` or every `<p>`. Real pages need more control: "only this paragraph", "all the warnings", "links but only in the menu". **Selectors** are how you aim your styles.

## Type selectors

The simplest selector is a tag name. `p { ... }` styles every paragraph.

## Classes

A **class** is a label you add to elements in HTML:

```html
<p class="note">Water the roses.</p>
<p class="note urgent">Buy soil today!</p>
```

In CSS you select a class with a **dot**:

```css
.note {
  background-color: #fff3bf;
}
```

- Many elements can share one class, and the class can go on any tag.
- An element can have **several** classes, separated by spaces. The second paragraph above has two: `note` and `urgent`. It gets the styles from both.

## Ids

An **id** is a unique name for one element:

```html
<h1 id="title">Garden notes</h1>
```

In CSS, select it with a **hash**:

```css
#title {
  color: darkgreen;
}
```

An id must be used only once per page. Classes are normally the better choice for styling, and ids are good for links like `href="#title"` and for JavaScript.

## Descendant selectors

A space between two selectors means "the second one, somewhere inside the first":

```css
.tools li {
  font-weight: bold;
}
```

This styles `<li>` elements inside `.tools` but not list items anywhere else. A selector with `>` such as `ul > li` means only *direct children*.

## Several selectors, one rule

Separate with commas to share a rule:

```css
h1, h2, h3 {
  font-family: Georgia, serif;
}
```

## Which rule wins?

When two rules disagree, the more specific one wins: an **id** beats a **class**, a class beats a **tag**. If they are equally specific, the one written *later* wins. This is the "cascading" in CSS.

```css
p { color: black; }
.urgent { color: red; }  /* this wins on <p class="urgent"> */
```

> **Watch out:**
> - Writing `note { ... }` instead of `.note { ... }`. Without the dot the browser looks for a `<note>` tag.
> - Writing `.#title` or `#.title`. A class uses `.`, an id uses `#`, and you pick one.
> - Missing the space in `.toolsli`. It reads as one class name that does not exist.
> - Putting a space after the dot, like `. note`. It breaks the selector.
> - Styling every `p` when you only wanted some of them. Add a class instead.

## Going further

Add `p.note { font-style: italic; }` (a paragraph that also has the class) and `.note.urgent { ... }` (both classes at once). Watch which elements change.

> **Your turn:** write four rules in `style.css`: `#title` dark green, `.note` with a pale yellow `#fff3bf` background, `.urgent` red text, and bold `li` elements inside `.tools`.
