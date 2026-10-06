---
title: State with useState
summary: Make components remember things and react to clicks.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        // 1. Create state called count that starts at zero.
        // 2. Show it in a paragraph as: Count: 0
        // 3. Add a button that adds one to the count when clicked.
        // 4. Add a second button that sets the count back to zero.

        return <div></div>;
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text: ["Count: 0", "Add one", "Reset"]
  code:
    - pattern: "useState\\s*\\(\\s*0\\s*\\)"
      message: "Start the state at 0:  useState(0)"
    - pattern: "onClick"
      message: "Give the buttons an onClick handler."
    - pattern: "setCount\\s*\\(\\s*count\\s*\\+\\s*1\\s*\\)|setCount\\s*\\(\\s*\\w+\\s*=>\\s*\\w+\\s*\\+\\s*1\\s*\\)"
      message: "Add one with the setter:  setCount(count + 1)"
hints:
  - "State is created with the useState function from React. It gives back two things in an array: the current value and a function to change it. Both buttons need an onClick."
  - "const [count, setCount] = useState(0); show {count} in the paragraph. The Add one button calls setCount with the old value plus one, Reset calls it with 0."
  - "<p>Count: {count}</p>  <button onClick={() => setCount(count + 1)}>Add one</button>  <button onClick={() => setCount(0)}>Reset</button>"
solution:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        const [count, setCount] = useState(0);

        return (
          <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Add one</button>
            <button onClick={() => setCount(0)}>Reset</button>
          </div>
        );
      }

      export default App;
quiz:
  - q: What does useState return?
    options: ["Only the value", "The current value and a function to update it", "A new component"]
    answer: 1
  - q: What happens when you call setCount?
    options: ["The page reloads", "Nothing", "React re-renders the component with the new value"]
    answer: 2
  - q: Why not change count directly with  count = count + 1 ?
    options: ["React would not know it changed, so nothing updates", "It is slower", "It causes a syntax error"]
    answer: 0
  - q: What is the difference between props and state?
    options: ["Props are the component's own memory, state comes from the parent", "There is no difference", "Props come from the parent, state is the component's own memory"]
    answer: 2
---

Props come from outside. **State** is a component's own memory: values that can change while the page is open, like a counter, the text in a box, or whether a menu is open. When state changes, React automatically updates the screen.

## useState

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

Piece by piece:

1. `import { useState } from 'react';` brings the tool in. Functions starting with `use` are called **hooks**.
2. `useState(0)` creates a piece of state whose **starting value** is `0`.
3. It returns an array with two items. The square brackets on the left (`[count, setCount]`) unpack them into two names: the **current value** and a **setter function**. You can choose any names, the usual pattern is `thing` and `setThing`.
4. `onClick={() => ...}` runs the arrow function when the button is clicked. Note that you pass a function, you do not call it.
5. `setCount(count + 1)` stores a new value. React then **re-renders** (calls your component function again) and `count` is now one higher.

## Why not just use a normal variable?

If you wrote `let count = 0;` and did `count = count + 1;` in the click handler, the variable would change but nothing would tell React to redraw. State is the signal: calling the setter means "this changed, please update the screen". Also, each time React re-renders, a normal variable would be reset to `0` again, while state is remembered between renders.

## Updating from the previous value

When the new value depends on the old one, you can pass a function to the setter. React calls it with the latest value:

```jsx
setCount((c) => c + 1);
```

This is the safest form if you update several times in a row. For simple clicks `setCount(count + 1)` is fine.

## Each component has its own state

If you place `<Counter />` three times, each copy has its own independent `count`. State belongs to one component instance.

> **Watch out:**
> - `onClick={setCount(count + 1)}` calls the setter immediately while rendering and causes `Too many re-renders`. Wrap it: `onClick={() => setCount(count + 1)}`.
> - Changing state directly (`count = 5` or `list.push(x)`) does nothing visible. Always use the setter, and give it a new value.
> - `useState is not defined`: you forgot the `import { useState } from 'react';` line.
> - Calling hooks inside `if` statements or loops. Hooks must be called at the top of the component, every time.

> **Your turn:** build a counter. It should show `Count: 0`, have an `Add one` button that adds one, and a `Reset` button that sets the count back to zero.
