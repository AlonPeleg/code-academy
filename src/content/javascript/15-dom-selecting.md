---
title: The DOM - finding and changing elements
summary: Select elements on the page and change their text, style and classes with JavaScript.
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
          <h1 id="title">Loading...</h1>
          <p class="info">First info paragraph.</p>
          <p class="info">Second info paragraph.</p>
          <ul id="list">
            <li>Apples</li>
            <li>Bananas</li>
            <li>Cherries</li>
          </ul>
          <script src="script.js"></script>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: system-ui, sans-serif;
      }

      .highlight {
        background: gold;
        font-weight: bold;
      }
  - name: script.js
    code: |
      // 1. Select the heading (its id is title) and change its text to "Hello, DOM!"

      // 2. Select ALL the elements with the class info (there are two).
      //    Print how many you found with console.log, then loop over them
      //    and set each one's text colour to green.

      // 3. Select the second list item and give it the class highlight.

check:
  output: "2"
  dom:
    text: ["Hello, DOM!"]
    selectors: ["li:nth-child(2).highlight"]
    styles:
      - { selector: ".info", property: "color", value: "rgb(0, 128, 0)" }
  code:
    - pattern: "querySelectorAll\\("
      message: "Use querySelectorAll to select every element with the class info."
    - pattern: "classList\\.add\\("
      message: "Use classList.add to add the highlight class."
hints:
  - "The browser turns your HTML into objects you can reach from JavaScript. First you select an element, then you change one of its properties."
  - "document.querySelector(\"#title\") finds one element, document.querySelectorAll(\".info\") finds all of them. Change the text with .textContent, the colour with .style.color, and add a class with .classList.add(...)."
  - "document.querySelector(\"#title\").textContent = \"Hello, DOM!\";  const infos = document.querySelectorAll(\".info\");  console.log(infos.length);  for (const p of infos) { p.style.color = \"green\"; }  document.querySelector(\"#list li:nth-child(2)\").classList.add(\"highlight\");"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <h1 id="title">Loading...</h1>
          <p class="info">First info paragraph.</p>
          <p class="info">Second info paragraph.</p>
          <ul id="list">
            <li>Apples</li>
            <li>Bananas</li>
            <li>Cherries</li>
          </ul>
          <script src="script.js"></script>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: system-ui, sans-serif;
      }

      .highlight {
        background: gold;
        font-weight: bold;
      }
  - name: script.js
    code: |
      const title = document.querySelector("#title");
      title.textContent = "Hello, DOM!";

      const infos = document.querySelectorAll(".info");
      console.log(infos.length);
      for (const p of infos) {
        p.style.color = "green";
      }

      const second = document.querySelector("#list li:nth-child(2)");
      second.classList.add("highlight");
quiz:
  - q: What does document.querySelector(".info") return?
    options: ["Every element with the class info", "The first element with the class info", "The text inside .info"]
    answer: 1
  - q: Which property changes the text inside an element?
    options: ["textContent", "text", "innerName"]
    answer: 0
  - q: Why do we usually change styles by adding a class (classList.add) instead of writing many style.x lines?
    options: ["It is required by JavaScript", "It runs faster", "The look stays in the CSS file and JavaScript only switches it on or off"]
    answer: 2
  - q: Why is the script tag placed at the end of the body?
    options: ["So the elements already exist when the script looks for them", "So the page loads in a different language", "Because scripts are not allowed in the head"]
    answer: 0
---

JavaScript becomes really exciting when it can change a web page. In this lesson you will learn how to **find** elements on the page and **change** them: their text, their colour and their CSS classes.

## The DOM

When a browser loads your HTML, it builds a tree of objects in memory called the **DOM** (Document Object Model). Every tag becomes an object that JavaScript can read and modify. When you change one of those objects, the page updates instantly. The object that represents the whole page is called `document`.

## Step 1: select an element

`document.querySelector` takes a **CSS selector** (the same ones you used in CSS) and returns the **first** matching element:

```js
const title = document.querySelector("#title");        // by id
const firstInfo = document.querySelector(".info");      // by class
const firstItem = document.querySelector("#list li");   // descendant
```

To get **all** matches use `querySelectorAll`. It returns a list that you can loop over:

```js
const infos = document.querySelectorAll(".info");
console.log(infos.length); // prints: 2
for (const p of infos) {
  console.log(p.textContent);
}
```

There is also the older `document.getElementById("title")`, which does the same as `querySelector("#title")` for ids.

## Step 2: change it

Once you hold an element, you change its properties:

```js
title.textContent = "Hello, DOM!";   // replace the text
title.style.color = "tomato";        // set an inline CSS style
```

- `textContent` is the text inside the element.
- `style` lets you set CSS properties directly. CSS names with dashes become camelCase in JavaScript: `background-color` becomes `style.backgroundColor`.

## Classes are better than styles

Instead of many `style` lines, prepare a class in CSS and let JavaScript switch it:

```js
item.classList.add("highlight");     // add the class
item.classList.remove("highlight");  // take it off
item.classList.toggle("highlight");  // add if missing, remove if present
```

The CSS file keeps all the looks, and JavaScript decides when to use them.

## Where does the script go?

The script tag is at the **end of the body** so that all the elements above it already exist when the code runs. If the script ran earlier, `querySelector` would return `null`, because the page was not built yet.

## Useful selectors

| Selector | Meaning |
| --- | --- |
| `"#title"` | the element with id title |
| `".info"` | elements with class info |
| `"p"` | all paragraphs |
| `"#list li"` | li elements inside #list |
| `"li:nth-child(2)"` | an li that is the second child of its parent |

> **Watch out:**
> - Forgetting the `#` or `.` in the selector: `querySelector("title")` looks for a `<title>` tag and finds nothing.
> - Using the result when nothing matched: `querySelector` gives `null`, and then `null.textContent = "x"` fails with `TypeError: Cannot set properties of null (setting 'textContent')`. Check the selector spelling.
> - Using `style` on a list from `querySelectorAll`: `infos.style.color = "green"` does nothing useful. Loop over the items and set the style on each.
> - Writing `style.background-color`. JavaScript reads that as a subtraction. Use `style.backgroundColor`.
> - Putting the dot in the class name for `classList`: `classList.add(".highlight")` is wrong, write `classList.add("highlight")`.
> - Running the script in the `<head>` before the page exists.

## Going further

Change the colour of every list item using a loop. Try `document.querySelector("#list").innerHTML = "<li>New</li>"` and see how `innerHTML` reads HTML tags (use it carefully, it can be unsafe with user text).

> **Your turn:** follow the three comments in `script.js`: change the heading, print the count of `.info` paragraphs and turn them green, and add the `highlight` class to the second list item.
