---
title: Lifting state up
summary: Share state between components by keeping it in their common parent.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function Display({ count }) {
        return <p>Total: {count}</p>;
      }

      function Double({ count }) {
        return <p>Double: {count * 2}</p>;
      }

      function Controls({ onAdd, onReset }) {
        return (
          <div>
            <button onClick={onAdd}>Add</button>
            <button onClick={onReset}>Reset</button>
          </div>
        );
      }

      function App() {
        // 1. Keep one piece of state in App called count, starting at 5.
        // 2. Give Display and Double the current count.
        // 3. Give Controls an onAdd function that adds one, and an onReset function that sets 5 again.
        return (
          <div>
            <Display />
            <Double />
            <Controls />
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text: ["Total: 5", "Double: 10", "Add", "Reset"]
  code:
    - pattern: "useState\\s*\\(\\s*5\\s*\\)"
      message: "Create the state in App:  useState(5)"
    - pattern: "<Display\\s+count\\s*=\\s*\\{\\s*count\\s*\\}"
      message: "Pass the count down:  <Display count={count} />"
    - pattern: "<Double\\s+count\\s*=\\s*\\{\\s*count\\s*\\}"
      message: "Pass the count down:  <Double count={count} />"
    - pattern: "onAdd\\s*=\\s*\\{"
      message: "Pass a function to Controls:  onAdd={() => ...}"
hints:
  - "When two components need the same data, the state belongs in their closest common parent, here App. The parent hands the value down as a prop, and hands down functions that the children can call to change it."
  - "In App create const [count, setCount] = useState(5). Pass count={count} to Display and Double, and pass onAdd and onReset to Controls as arrow functions that call setCount."
  - "<Display count={count} />  <Double count={count} />  <Controls onAdd={() => setCount(count + 1)} onReset={() => setCount(5)} />"
solution:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function Display({ count }) {
        return <p>Total: {count}</p>;
      }

      function Double({ count }) {
        return <p>Double: {count * 2}</p>;
      }

      function Controls({ onAdd, onReset }) {
        return (
          <div>
            <button onClick={onAdd}>Add</button>
            <button onClick={onReset}>Reset</button>
          </div>
        );
      }

      function App() {
        const [count, setCount] = useState(5);

        return (
          <div>
            <Display count={count} />
            <Double count={count} />
            <Controls
              onAdd={() => setCount(count + 1)}
              onReset={() => setCount(5)}
            />
          </div>
        );
      }

      export default App;
quiz:
  - q: Two sibling components need the same changing value. Where should the state live?
    options: ["In both of them, copied", "In their closest common parent", "In a global variable"]
    answer: 1
  - q: How does a child component ask its parent to change the state?
    options: ["It calls a function the parent passed down as a prop", "It assigns to the prop directly", "It cannot"]
    answer: 0
  - q: In which direction does data flow in React?
    options: ["From child to parent only", "In both directions automatically", "Down from parent to child, through props"]
    answer: 2
    explain: "This is called one-way data flow. Children send changes upward by calling functions the parent gave them."
  - q: Why is keeping two copies of the same state in two components a bad idea?
    options: ["It uses too much memory", "They can get out of sync", "React forbids it"]
    answer: 1
---

State is private to the component that owns it. So what do you do when two different components need to show or change the same value? You **lift the state up**: move it into their closest common parent and pass it down.

## The problem

Imagine a counter with three parts: one component shows the total, another shows the double, and a third has the buttons. If each kept its own `useState`, pressing a button would update only the component that owns that button. The others would have no idea. Two copies of the same data will always drift apart.

## The solution: one owner

Give the data to **one** component, the parent of all the others, and let it hand out what each child needs:

```jsx
function App() {
  const [count, setCount] = useState(5);

  return (
    <div>
      <Display count={count} />
      <Double count={count} />
      <Controls onAdd={() => setCount(count + 1)} />
    </div>
  );
}
```

There are two kinds of props here:

- **Data going down.** `count={count}` gives children the current value. `Display` and `Double` just show it. They do not own it and cannot change it.
- **Functions going down.** `onAdd={() => setCount(count + 1)}` gives `Controls` a way to ask for a change. The function lives in `App` where `setCount` is available, and `Controls` simply calls it.

Inside `Controls`, the prop is used like any other function:

```jsx
function Controls({ onAdd }) {
  return <button onClick={onAdd}>Add</button>;
}
```

## What happens on a click

1. The user clicks `Add`.
2. `Controls` calls `onAdd()`, which is the arrow function created in `App`.
3. That calls `setCount(count + 1)`, so the state in `App` changes.
4. React re-renders `App`, which passes the new `count` to `Display` and `Double`. All of them show consistent numbers.

This is **one-way data flow**: values travel down through props, requests for change travel up through function calls. It keeps larger apps predictable, because for every piece of state there is exactly one place to look.

## A good rule of thumb

Start with state in the component that uses it. When a second component needs it, move it up to the closest parent that contains both. Do not lift it further than necessary.

> **Watch out:**
> - Passing `onAdd={setCount(count + 1)}` instead of an arrow function: this calls the setter during rendering and leads to `Too many re-renders`.
> - Forgetting to pass a prop: `Display` then shows `Total: ` with nothing after it, since `count` is `undefined`.
> - Trying to change a prop inside the child (`count = count + 1`). Props are read-only. Call the function from the parent.
> - Giving a child its own `useState(count)` copy. That copy ignores later changes from the parent. Use the prop directly.

> **Your turn:** create the state in `App` (start at `5`), pass `count` to `Display` and `Double`, and give `Controls` the `onAdd` and `onReset` functions.
