---
title: Events and forms
summary: React to typing and clicks with controlled inputs.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        // 1. Create state called name that starts as the text Ava.
        // 2. Connect the input to it: show the state as its value and update the state when the user types.
        // 3. Show a paragraph that says: Hello, Ava! (it should follow whatever is typed).
        // 4. Make the Clear button empty the name.

        return (
          <div>
            <input type="text" />
            <p></p>
            <button>Clear</button>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ['input[value="Ava"]', "button"]
    text: ["Hello, Ava!", "Clear"]
  code:
    - pattern: "useState\\s*\\(\\s*[\"']Ava[\"']\\s*\\)"
      message: "Start the state with the text Ava:  useState(\"Ava\")"
    - pattern: "value\\s*=\\s*\\{\\s*name\\s*\\}"
      message: "Give the input a value from state:  value={name}"
    - pattern: "onChange\\s*=\\s*\\{"
      message: "Listen for typing with onChange."
    - pattern: "e(vent)?\\.target\\.value"
      message: "Read the typed text with  event.target.value"
    - pattern: "setName\\s*\\(\\s*[\"']{2}\\s*\\)"
      message: "Make Clear call  setName(\"\")  to empty the name."
hints:
  - "A controlled input has two halves: its value comes from state, and an onChange handler writes every keystroke back into state. The paragraph simply prints the state."
  - "Create const [name, setName] = useState(\"Ava\"). On the input add value={name} and onChange with a function that receives the event. The new text is in event.target.value."
  - "<input type=\"text\" value={name} onChange={(e) => setName(e.target.value)} />  <p>Hello, {name}!</p>  <button onClick={() => setName(\"\")}>Clear</button>"
solution:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        const [name, setName] = useState("Ava");

        return (
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p>Hello, {name}!</p>
            <button onClick={() => setName("")}>Clear</button>
          </div>
        );
      }

      export default App;
quiz:
  - q: What is a controlled input?
    options: ["An input whose value lives in React state", "An input that is disabled", "An input with a CSS class"]
    answer: 0
  - q: Where do you find the text the user typed inside an onChange handler?
    options: ["event.value", "event.target.value", "event.text"]
    answer: 1
  - q: Which handler runs when a form is submitted?
    options: ["onSend", "onEnter", "onSubmit"]
    answer: 2
  - q: Why call event.preventDefault() in a submit handler?
    options: ["It stops the browser from reloading the page", "It clears the form", "It validates the text"]
    answer: 0
    explain: "By default a form submit makes the browser reload the page, which would throw away all your state."
---

Pages come alive when they respond to the user: clicks, typing, submitting a form. React calls these **events**, and handling them is a small step on top of state.

## Event handlers

You attach a function to an element with a camelCase attribute: `onClick`, `onChange`, `onSubmit`, `onKeyDown`, and so on. React calls your function and passes it an **event object** that describes what happened:

```jsx
<button onClick={() => console.log("clicked")}>Click me</button>
```

Remember to pass a function, not to call one: `onClick={handle}` or `onClick={() => handle(5)}`, never `onClick={handle(5)}`.

## Controlled inputs

An `<input>` normally keeps its own text inside the browser. In React you usually make state the single source of truth. That is called a **controlled input**, and it has two halves:

```jsx
const [name, setName] = useState("Ava");

<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
<p>Hello, {name}!</p>
```

1. `value={name}` makes the box always display what is in state.
2. `onChange` runs on every keystroke. `e` is the event, `e.target` is the input element, and `e.target.value` is its current text.
3. `setName(...)` stores the text, React re-renders, and the box (and the paragraph) show the new value.

Because the text is in your state, other parts of the page can use it instantly, like the greeting above, or you can empty the box with `setName("")`.

## Forms

Wrap inputs in a `<form>` and handle `onSubmit` to react to Enter or to a submit button:

```jsx
function handleSubmit(e) {
  e.preventDefault();      // stop the browser from reloading the page
  console.log("Saving", name);
}

<form onSubmit={handleSubmit}>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <button type="submit">Save</button>
</form>
```

Other input types follow the same idea. A checkbox uses `checked={done}` and `e.target.checked`, and a `<select>` uses `value` and `e.target.value`.

> **Watch out:**
> - `You provided a value prop to a form field without an onChange handler`: a controlled input needs both halves. Without `onChange` the box becomes frozen and you cannot type.
> - Typing does nothing because you wrote `onChange={setName(e.target.value)}`, which calls the setter right away. Use an arrow function.
> - The page reloads when a form is submitted: you forgot `e.preventDefault()`.
> - `Cannot read properties of undefined (reading 'target')`: your handler function does not have a parameter for the event.

> **Your turn:** make the input controlled (starting with the name `Ava`), show `Hello, {name}!` in the paragraph, and let the `Clear` button empty the name.
