---
title: Your first component
summary: A React component is a function that returns what to show.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      function App() {
        // Return a heading (h1) that says: Hello, React!
        return null;
      }

      export default App;
check:
  dom:
    selectors: ["h1"]
    text: ["Hello, React!"]
hints:
  - "A component is a function, and what it returns is what appears on the page. Right now it returns null, which means nothing."
  - "Replace null with an h1 element written like HTML: an opening tag, the text, and a closing tag."
  - "return <h1>Hello, React!</h1>;"
solution:
  - name: App.jsx
    code: |
      function App() {
        return <h1>Hello, React!</h1>;
      }

      export default App;
quiz:
  - q: What is a React component?
    options: ["A CSS file", "A function that returns UI", "A database table"]
    answer: 1
  - q: What is the HTML-like syntax inside JavaScript called?
    options: ["JSX", "JSON", "JVM"]
    answer: 0
  - q: Component names must start with...
    options: ["A number", "An underscore", "A capital letter"]
    answer: 2
    explain: "React uses the capital letter to tell components like <App /> apart from normal HTML tags like <div>."
  - q: How many parent elements can a component return?
    options: ["Exactly one (wrap several in a div or a fragment)", "As many as you like", "None, it must return text"]
    answer: 0
---

**React** is a library for building user interfaces out of small, reusable pieces called **components**. Once you understand a single component, every React app is just many of them fitted together.

## A component is a function

```jsx
function App() {
  return <h1>Hello!</h1>;
}

export default App;
```

Take it apart:

1. `function App() { ... }` is an ordinary JavaScript function.
2. Whatever the function **returns** is what React puts on the screen.
3. `<h1>Hello!</h1>` looks like HTML, but it is **JSX**, a syntax that lets you write markup inside JavaScript. The sandbox turns it into plain JavaScript calls before running it.
4. `export default App;` tells the preview "this is the component to show". Every lesson in this track needs that line at the bottom.

The name `App` starts with a capital letter on purpose. React treats `<App />` as a component and `<div>` as a normal HTML tag, and it decides which is which by that first letter.

## The rules of JSX

JSX is stricter than HTML:

- A component must return **one** parent element. To return several, wrap them in a `<div>`, or in an empty wrapper `<>...</>` (called a fragment).
- Every tag must be closed. Self-closing tags need the slash: `<br />`, `<img src="a.png" />`.
- Some attributes are renamed because they clash with JavaScript words: `className` instead of `class`.
- When the JSX spans several lines, wrap it in parentheses after `return` so JavaScript does not stop early.

```jsx
function App() {
  return (
    <div>
      <h1>My page</h1>
      <p>Welcome to React.</p>
    </div>
  );
}
```

## Components inside components

Once a component exists, you use it like your own HTML tag:

```jsx
function Title() {
  return <h1>My page</h1>;
}

function App() {
  return (
    <div>
      <Title />
      <Title />
    </div>
  );
}
```

That shows the heading twice. Writing it once and using it many times is the big idea behind React.

> **Watch out:**
> - `Adjacent JSX elements must be wrapped in an enclosing tag`: you returned two elements side by side. Wrap them in a `<div>` or `<>...</>`.
> - A component that shows nothing: you forgot the `return`, or the function has `return null`.
> - `<title />` in lowercase is the HTML tag, not your component. Components must start with a capital letter.
> - `Unterminated JSX contents`: a tag is missing its closing `</h1>` or a self-closing slash.

> **Your turn:** make `App` return an `<h1>` that says `Hello, React!`.
