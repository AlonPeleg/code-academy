---
title: Custom hooks
summary: Package state and effects into your own reusable use... functions.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';

      // 1. Write the hook useToggle(initial). It keeps a true/false state starting at initial
      //    and returns an array [on, toggle], where toggle flips the value.
      function useToggle(initial) {
        // your code here
      }

      // 2. Write the hook useCounter(start, step). It keeps a number starting at start and
      //    returns an object { count, increment, reset }.
      //    increment adds step to the count, reset goes back to start.
      //    Use the "functional" form of the setter so two increments in a row both count.
      function useCounter(start, step) {
        // your code here
      }

      function LightSwitch() {
        const [on, toggle] = useToggle(true);
        return (
          <div>
            <p>Lights: {on ? "on" : "off"}</p>
            <button onClick={toggle}>Switch</button>
          </div>
        );
      }

      function Stepper() {
        const { count, increment, reset } = useCounter(10, 5);
        return (
          <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+5</button>
            <button onClick={reset}>Reset</button>
          </div>
        );
      }

      // Simulates two very quick clicks. Each component that calls a hook gets its own private state.
      function QuickStepper() {
        const { count, increment } = useCounter(10, 5);
        useEffect(() => {
          increment();
          increment();
        }, []);
        return <p>Quick count: {count}</p>;
      }

      function App() {
        return (
          <div>
            <LightSwitch />
            <Stepper />
            <QuickStepper />
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text: ["Lights: on", "Count: 10", "Quick count: 20"]
  code:
    - pattern: "function\\s+useToggle[\\s\\S]*useState\\s*\\("
      message: "useToggle should call useState inside."
    - pattern: "function\\s+useCounter[\\s\\S]*useState\\s*\\("
      message: "useCounter should call useState inside."
    - pattern: "return\\s*\\{\\s*count"
      message: "useCounter should return an object:  return { count, increment, reset };"
hints:
  - "A custom hook is a normal function whose name starts with use and that calls other hooks inside it. It returns whatever the component needs: an array for useToggle, an object for useCounter."
  - "useToggle: const [on, setOn] = useState(initial); function toggle() { setOn(!on); } and return [on, toggle]. useCounter: const [count, setCount] = useState(start); increment uses setCount(c => c + step); reset uses setCount(start)."
  - "function useToggle(initial) { const [on, setOn] = useState(initial); return [on, () => setOn(!on)]; }   function useCounter(start, step) { const [count, setCount] = useState(start); const increment = () => setCount((c) => c + step); const reset = () => setCount(start); return { count, increment, reset }; }"
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';

      function useToggle(initial) {
        const [on, setOn] = useState(initial);
        const toggle = () => setOn(!on);
        return [on, toggle];
      }

      function useCounter(start, step) {
        const [count, setCount] = useState(start);
        const increment = () => setCount((c) => c + step);
        const reset = () => setCount(start);
        return { count, increment, reset };
      }

      function LightSwitch() {
        const [on, toggle] = useToggle(true);
        return (
          <div>
            <p>Lights: {on ? "on" : "off"}</p>
            <button onClick={toggle}>Switch</button>
          </div>
        );
      }

      function Stepper() {
        const { count, increment, reset } = useCounter(10, 5);
        return (
          <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+5</button>
            <button onClick={reset}>Reset</button>
          </div>
        );
      }

      function QuickStepper() {
        const { count, increment } = useCounter(10, 5);
        useEffect(() => {
          increment();
          increment();
        }, []);
        return <p>Quick count: {count}</p>;
      }

      function App() {
        return (
          <div>
            <LightSwitch />
            <Stepper />
            <QuickStepper />
          </div>
        );
      }

      export default App;
quiz:
  - q: What makes a function a custom hook?
    options: ["Its name starts with use and it may call other hooks", "It is exported from its own file", "It returns JSX"]
    answer: 0
  - q: If two components both call useToggle(), do they share the same on/off value?
    options: ["Yes, hooks share state globally", "Only if they are siblings", "No, each call creates its own private state"]
    answer: 2
    explain: "A custom hook shares logic, not state. Each component that calls it gets a separate copy of the state inside."
  - q: Why does the lesson use setCount((c) => c + step) instead of setCount(count + step)?
    options: ["It is shorter", "Two increments in the same moment would both read the same old count, the functional form uses the latest value", "The first form is a syntax error"]
    answer: 1
  - q: Where may you call hooks such as useState?
    options: ["Anywhere, even inside if statements and loops", "Only inside event handlers", "Only at the top level of a component or another hook"]
    answer: 2
---

You already use hooks like `useState` and `useEffect`. The best part of hooks is that you can write **your own**. A custom hook is how you take logic you keep copy-pasting (a toggle, a counter, loading data) and give it a name, so any component can reuse it in one line.

## What a custom hook is

A custom hook is simply a function that:

1. has a name starting with `use` (that is how React and its linter recognise it), and
2. calls other hooks inside (`useState`, `useEffect`, ...).

That is all. There is no special API. Here is the classic example:

```jsx
function useToggle(initial) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(!on);
  return [on, toggle];
}

function LightSwitch() {
  const [on, toggle] = useToggle(true);
  return <button onClick={toggle}>{on ? "on" : "off"}</button>;
}
```

`useToggle` takes the starting value, owns a piece of state, and returns what the component needs. Returning an **array** (like `useState` does) lets the caller choose any names when destructuring. Returning an **object** (`{ count, increment, reset }`) is better when there are three or more things, because the caller can pick only the ones they need.

## Logic is shared, state is not

Calling `useToggle()` in two components does not make them share one value. Each call creates its **own private state**, just like calling `useState` twice. A custom hook shares the *recipe*, not the *result*. (To share a value between components, use lifting state up or context.)

## The functional form of the setter

In a counter you will want `setCount((c) => c + step)` instead of `setCount(count + step)`. The first gives React a function that receives the **latest** state. The second uses the `count` from the render you are in, so calling it twice in a row adds the step only once:

```jsx
increment(); increment();     // with setCount(count + step): 10 -> 15 (not 20)
                              // with setCount(c => c + step): 10 -> 20
```

The exercise runs exactly this test with `QuickStepper`.

## Two more hooks worth knowing

**useLocalStorage-like state** keeps a value in the browser's storage, and falls back to normal state if storage is blocked (private windows, previews):

```jsx
function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initial : JSON.parse(saved);
    } catch (e) {
      return initial;            // storage unavailable: plain in-memory state
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }, [key, value]);
  return [value, setValue];
}
```

`useState(() => ...)` with a function is **lazy initialisation**: the function runs only on the first render. The `try / catch` keeps the app working when storage throws.

**useFetch** wraps loading data (state for `data`, `loading`, `error` and an effect with `fetch`). You will build that pattern in the data fetching lesson, and once it is in a hook, each component needs just `const { data, loading, error } = useFetch(url)`.

## Rules of hooks

- Call hooks only at the **top level** of a component or another hook: never inside `if`, loops or nested functions.
- Call them only from components or custom hooks, never from normal functions or event handlers.
- Always start the name with `use`.

> **Watch out:**
> - A hook called conditionally: `React has detected a change in the order of Hooks called`.
> - Calling a hook in a normal function that is not named `use...`: `Invalid hook call`.
> - Forgetting to `return` the values from the hook, so the component shows `TypeError: useToggle is not a function or its return value is not iterable` (for an array) or `Cannot destructure property 'count' of undefined`.
> - Expecting two components to share one counter just because they use the same hook.

> **Your turn:** write `useToggle(initial)` returning `[on, toggle]` and `useCounter(start, step)` returning `{ count, increment, reset }` (use the functional setter). The page should show `Lights: on`, `Count: 10` and `Quick count: 20`.
