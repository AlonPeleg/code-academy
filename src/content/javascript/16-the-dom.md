---
title: Reacting to clicks (DOM events)
summary: Make a button change text on the page.
level: intermediate
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <body>
          <h1 id="message">Press the button</h1>
          <button id="btn">Say hello</button>
          <script src="script.js"></script>
        </body>
      </html>
  - name: script.js
    code: |
      const button = document.getElementById("btn");
      const message = document.getElementById("message");

      // When the button is clicked, change the message text to "Hello, DOM!"

check:
  dom:
    selectors: ["#btn", "#message"]
  code:
    - pattern: "addEventListener\\(\\s*[\"']click[\"']"
      message: "Use button.addEventListener(\"click\", ...) to react to a click."
    - pattern: "(textContent|innerText|innerHTML)\\s*=\\s*[\"'`]Hello, DOM!"
      message: "Inside the click function, set the heading's textContent to \"Hello, DOM!\"."
hints:
  - "You want something to happen later, when the user clicks. That means giving the button a function to run on its click event."
  - "Call button.addEventListener with two arguments: the event name as a string, and a function. Inside the function, assign to message.textContent."
  - "button.addEventListener(\"click\", () => { message.textContent = \"Hello, DOM!\"; });"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <body>
          <h1 id="message">Press the button</h1>
          <button id="btn">Say hello</button>
          <script src="script.js"></script>
        </body>
      </html>
  - name: script.js
    code: |
      const button = document.getElementById("btn");
      const message = document.getElementById("message");

      button.addEventListener("click", () => {
        message.textContent = "Hello, DOM!";
      });
quiz:
  - q: What does DOM stand for?
    options: ["Data Output Method", "Digital Online Menu", "Document Object Model"]
    answer: 2
  - q: Which method finds an element by its id?
    options: ["document.getElementById()", "document.find()", "window.id()"]
    answer: 0
  - q: What does addEventListener do?
    options: ["Adds an element to the page", "Runs a function when something happens, like a click", "Loads a CSS file"]
    answer: 1
  - q: 'In  button.addEventListener("click", handle);  why is there no () after handle?'
    options: ["It is a typo", "Because handle has no parameters", "We pass the function itself, so the browser can call it later"]
    answer: 2
    explain: Writing handle() would call it immediately. Without parentheses we hand over the function to be called on each click.
---

A page that only displays things is a poster. A page that **reacts** is an app. In this lesson you will learn how to run JavaScript when the visitor clicks, types or moves the mouse. These moments are called **events**.

## The recipe

Making a page interactive nearly always follows three steps:

1. **Find** the element: `document.getElementById("btn")` (or `document.querySelector("#btn")`).
2. **Listen** for an event: `button.addEventListener("click", function)`.
3. **Change** something inside the function: `element.textContent = "New text"`.

```js
const button = document.querySelector("#btn");

button.addEventListener("click", () => {
  console.log("clicked!");
});
```

## addEventListener, piece by piece

- `button` is the element to watch.
- `.addEventListener(...)` says "when this event happens, run this function".
- `"click"` is the **event name**, as text. Others: `"input"` (typing), `"mouseover"`, `"keydown"`, `"submit"`.
- The second argument is the **function** to run, called the *event handler*. It is usually an arrow function written right there.
- Note that the handler does **not run immediately**. It is stored, and the browser calls it every time the event happens.

You can also pass the name of a function you already wrote, without parentheses:

```js
function sayHello() {
  message.textContent = "Hello, DOM!";
}
button.addEventListener("click", sayHello); // no () !
```

## Keeping state

A handler can remember things between clicks by using a variable outside the function:

```js
let count = 0;
button.addEventListener("click", () => {
  count++;
  message.textContent = `Clicked ${count} times`;
});
```

## The event object

The browser passes the handler an **event object** with details about what happened:

```js
input.addEventListener("input", (event) => {
  message.textContent = event.target.value; // whatever the user typed
});
```

`event.target` is the element where it happened; for a text input, `event.target.value` is its current text.

## Toggling a class

A very popular trick is to switch a CSS class on and off:

```js
button.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
```

with `.dark { background: #111; color: white; }` in your CSS.

## Trying it

Click the button in the preview to test it. Anything you `console.log` shows up in the **Console** tab. Note that "Check answer" cannot click for you, so it reads your code and looks for the click listener and the new text.

> **Watch out:**
> - Writing `button.addEventListener("click", sayHello())`. The parentheses call the function straight away, once, instead of on every click.
> - Misspelling the event: `"onclick"` or `"Click"` do not work, the name is `"click"`, all lowercase, without "on".
> - `TypeError: Cannot read properties of null (reading 'addEventListener')`: the id in `getElementById` does not match the HTML, or the script runs before the elements exist.
> - Setting the text outside the handler: it then changes immediately on page load, not when clicked.
> - Forgetting `.textContent` and writing `message = "Hello"`, which only changes the variable, not the page.
> - Using `innerHTML` to show text typed by a visitor. It can inject HTML. Prefer `textContent`.

## Going further

Add a counter that shows how many times the button was clicked. Add a second button that resets the message to "Press the button". Try an `<input>` and an `"input"` event to copy what the visitor types into the heading.

> **Your turn:** in `script.js`, make clicking the button change the heading to `Hello, DOM!`.
