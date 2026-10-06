---
title: JSX expressions and styling
summary: Put JavaScript values inside JSX with curly braces, and style elements.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      function App() {
        const name = "Ava";
        const items = 3;

        // Fill in the gaps with curly braces:
        // 1. The heading must say Hello, Ava! using the name variable, and be teal (inline style).
        // 2. The paragraph must say: 3 items cost 6 dollars (calculate the 6 with items times 2).
        // 3. The wrapper div must have the CSS class card.
        return (
          <div>
            <h2>Hello, !</h2>
            <p> items cost  dollars</p>
          </div>
        );
      }

      export default App;
  - name: styles.css
    code: |
      .card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 12px;
        max-width: 280px;
      }
check:
  dom:
    selectors: [".card h2", ".card p"]
    text: ["Hello, Ava!", "3 items cost 6 dollars"]
    styles:
      - { selector: ".card h2", property: "color", value: "rgb(0, 128, 128)" }
  code:
    - pattern: "\\{\\s*name\\s*\\}"
      message: "Print the variable with curly braces around its name."
    - pattern: "\\{\\s*items\\s*\\*\\s*2\\s*\\}"
      message: "Calculate the price inside curly braces:  {items * 2}"
    - pattern: "style\\s*=\\s*\\{\\{"
      message: "Style the heading with double curly braces:  style={{ color: \"teal\" }}"
hints:
  - "Curly braces open a window from JSX back into JavaScript. Anything inside them is evaluated and shown. The class attribute is spelled differently in JSX, and style takes an object."
  - "Use the variable and the calculation inside braces in the text, className=\"card\" on the div, and style={{ color: \"teal\" }} on the h2 (the outer braces are JSX, the inner ones are the object)."
  - "<div className=\"card\">  <h2 style={{ color: \"teal\" }}>Hello, {name}!</h2>  <p>{items} items cost {items * 2} dollars</p>  </div>"
solution:
  - name: App.jsx
    code: |
      function App() {
        const name = "Ava";
        const items = 3;

        return (
          <div className="card">
            <h2 style={{ color: "teal" }}>Hello, {name}!</h2>
            <p>{items} items cost {items * 2} dollars</p>
          </div>
        );
      }

      export default App;
  - name: styles.css
    code: |
      .card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 12px;
        max-width: 280px;
      }
quiz:
  - q: How do you show the value of a variable called price inside JSX?
    options: ["${price}", "{price}", "[price]"]
    answer: 1
  - q: Which attribute adds a CSS class to a JSX element?
    options: ["class", "css", "className"]
    answer: 2
  - q: 'Why does an inline style look like  style={{ color: "red" }} ?'
    options: ["The outer braces enter JavaScript, the inner braces are a JavaScript object", "Double braces are a special React keyword", "It is a typo, one pair is enough"]
    answer: 0
  - q: What can you put inside curly braces in JSX?
    options: ["Only variable names", "Any JavaScript expression, such as items * 2", "Only text in quotes"]
    answer: 1
    explain: "An expression is anything that produces a value: a variable, a calculation, a function call."
---

JSX would be a boring way to write static HTML if that were all it did. Its real power is that you can mix **JavaScript values** into the markup using curly braces, and that you can style what you show. This lesson covers both.

## Curly braces: a window into JavaScript

Anything between `{` and `}` in JSX is treated as a JavaScript **expression** (a piece of code that produces a value) and the result is displayed:

```jsx
function App() {
  const name = "Ava";
  const items = 3;

  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>Total: {items * 2}</p>
      <p>Loud: {name.toUpperCase()}</p>
    </div>
  );
}
```

This shows `Hello, Ava!`, `Total: 6` and `Loud: AVA`. You can use variables, maths, function calls and ternaries, but not statements such as `if` or `for` (more on that in the conditional rendering lesson).

You can also use braces for **attribute values**: `<img src={photoUrl} />` sets the attribute from a variable instead of a fixed string.

## className and other renamed attributes

Because `class` is a reserved word in JavaScript, JSX uses **`className`**. Similarly `for` on labels becomes `htmlFor`. Most others (like `id`, `href`, `src`) stay the same:

```jsx
<div className="card">...</div>
```

## Inline styles

The `style` attribute does not take a string in React. It takes a JavaScript **object**, with camelCase property names:

```jsx
<h2 style={{ color: "teal", fontSize: "24px" }}>Styled</h2>
```

There are two pairs of braces for two reasons: the outer pair says "JavaScript starts here", and the inner pair is the object itself. Notice `fontSize`, not `font-size`, and that values are strings. For most styling you will put rules in a CSS file and use `className`, and keep inline styles for values that come from data.

## Fragments

If you do not want an extra wrapper element in the page, use a **fragment**, an empty tag:

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

> **Watch out:**
> - `Objects are not valid as a React child`: you tried to display an object, such as `{ color: "red" }` or `user`, directly. Show one of its properties instead, like `{user.name}`.
> - `The style prop expects a mapping from style properties to values, not a string`: use `style={{ color: "red" }}`, not `style="color: red"`.
> - `Invalid DOM property class`: use `className`.
> - Writing `${name}` instead of `{name}` inside JSX text. The dollar sign belongs to template strings, and would be shown literally.

> **Your turn:** fix the three gaps. Print `name` and `items * 2` with curly braces, give the wrapper the class `card`, and color the heading teal with an inline style.
