---
title: Effects with useEffect
summary: Run code after rendering to sync with things outside React, like the page title.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        const [count, setCount] = useState(0);
        const [title, setTitle] = useState("");

        // 1. Import useEffect from react (add it to the import line above).
        // 2. After rendering, set the browser tab title to: Clicked 0 times (use the current count).
        // 3. In the same effect, copy the new title into the title state, so it shows on the page.
        // 4. The effect must run again only when count changes.

        return (
          <div>
            <p>Tab title: {title}</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text: ["Tab title: Clicked 0 times"]
  code:
    - pattern: "import\\s*\\{[^}]*useEffect[^}]*\\}\\s*from"
      message: "Import it:  import { useState, useEffect } from 'react';"
    - pattern: "useEffect\\s*\\("
      message: "Call useEffect(() => { ... }, [count]);"
    - pattern: "document\\.title\\s*="
      message: "Set the browser title:  document.title = ..."
    - pattern: "\\}\\s*,\\s*\\[\\s*count\\s*\\]\\s*\\)"
      message: "Add the dependency list after the function:  }, [count]);"
hints:
  - "useEffect takes a function that React runs after it has drawn the page, and an array of dependencies that says when to run it again. Remember to import it from react."
  - "Inside the effect assign a template string with the count to document.title, then pass document.title to setTitle. The dependency array contains count."
  - "useEffect(() => { document.title = `Clicked ${count} times`; setTitle(document.title); }, [count]);"
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';

      function App() {
        const [count, setCount] = useState(0);
        const [title, setTitle] = useState("");

        useEffect(() => {
          document.title = `Clicked ${count} times`;
          setTitle(document.title);
        }, [count]);

        return (
          <div>
            <p>Tab title: {title}</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
          </div>
        );
      }

      export default App;
quiz:
  - q: When does the function inside useEffect run?
    options: ["Before the component renders", "After the component has rendered", "Only when the page is closed"]
    answer: 1
  - q: What does an empty dependency array, as in  useEffect(fn, []) , mean?
    options: ["The effect never runs", "The effect runs after every render", "The effect runs once, after the first render"]
    answer: 2
  - q: What does  [count]  as the dependency array mean?
    options: ["Run the effect again whenever count changes", "Run the effect count times", "Pass count into the effect as an argument"]
    answer: 0
  - q: Which job is a good fit for useEffect?
    options: ["Calculating a value to show in the JSX", "Synchronising with the outside world, such as the document title", "Adding two numbers"]
    answer: 1
    explain: "If you can work something out during rendering, just do it there. Effects are for talking to things outside React."
---

A React component's main job is to **calculate what the screen should look like** from its props and state. But sometimes you need to do something to the world outside: change the browser tab's title, start a timer, load data from a server, subscribe to something. Those things are called **side effects**, and React gives you the `useEffect` hook for them.

## The shape of useEffect

```jsx
import { useState, useEffect } from 'react';

function Page() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Clicked ${count} times`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Click me</button>;
}
```

Taking it apart:

1. `useEffect(fn, deps)` takes two arguments: a function and a list.
2. React first renders the component and updates the page. **After that**, it calls your function. That is why it is safe to touch things outside React in there.
3. `document.title = ...` changes the text of the browser tab, which is not part of your component's JSX at all. That is what makes it an effect.
4. `[count]` is the **dependency array**. React remembers it, and next time only runs the effect again if one of the listed values has changed.

## The dependency array

| You write | The effect runs |
| --- | --- |
| `useEffect(fn, [])` | once, after the first render |
| `useEffect(fn, [count])` | after the first render, and again whenever `count` changes |
| `useEffect(fn)` | after every single render |

A good rule: list every prop or state variable that the effect function uses. If the effect uses `count`, put `count` in the array.

## Effects can set state too

An effect can read from the outside world and store it in state, which makes it appear on screen:

```jsx
const [title, setTitle] = useState("");

useEffect(() => {
  document.title = `Clicked ${count} times`;
  setTitle(document.title);
}, [count]);

return <p>Tab title: {title}</p>;
```

The first render shows an empty title, then the effect runs, sets the state, and React renders again with the title filled in. This happens so fast you never see the empty state.

## Cleaning up

An effect can return a function that React calls before the next run, or when the component disappears. It is used to undo things like timers or subscriptions:

```jsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);   // cleanup
}, []);
```

## Going further

Hooks are just functions that start with `use`. You can bundle your own logic, like `useDocumentTitle(count)`, into a **custom hook**, and reuse it in many components.

> **Watch out:**
> - Forgetting the dependency array. Without it the effect runs after every render, and an effect that sets state would loop forever.
> - Leaving out a value the effect uses, so it keeps showing stale data. The linter message says `React Hook useEffect has a missing dependency`.
> - Using an effect for something you can calculate while rendering. Compute it in the component body instead.
> - `useEffect is not defined`: import it with `import { useState, useEffect } from 'react';`.

> **Your turn:** import `useEffect`, set `document.title` to `Clicked {count} times` when `count` changes, and copy it into the `title` state so the page shows `Tab title: Clicked 0 times`.
