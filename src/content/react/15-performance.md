---
title: "Performance: memo, useCallback, useMemo"
summary: Understand why components re-render and skip unnecessary work with memo, useCallback and useMemo.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef } from 'react';

      // Counts how many times the numbers are added up (see below).
      let sumRuns = 0;

      // Row shows how many times React has called its function.
      // 1. Import memo and wrap Row with it, so it re-renders only when its props change.
      function Row({ label, onSelect }) {
        const renders = useRef(0);
        renders.current += 1;
        return (
          <li>
            <button onClick={() => onSelect(label)}>
              {label} (rendered {renders.current}x)
            </button>
          </li>
        );
      }

      const numbers = [1, 2, 3, 4, 5];

      function App() {
        const [selected, setSelected] = useState("none");
        const [ticks, setTicks] = useState(0);

        // This effect simulates three quick clicks: every render sets the next tick,
        // so App re-renders 4 times in total.
        useEffect(() => {
          if (ticks < 3) setTicks(ticks + 1);
        }, [ticks]);

        // 2. Make handleSelect keep the SAME function between renders with useCallback.
        function handleSelect(label) {
          setSelected(label);
        }

        // 3. Wrap the calculation in useMemo, so it runs only when numbers changes.
        sumRuns += 1;
        const total = numbers.reduce((sum, n) => sum + n, 0);

        return (
          <div>
            <p>Ticks: {ticks}</p>
            <p>Selected: {selected}</p>
            <ul>
              <Row label="Ada" onSelect={handleSelect} />
              <Row label="Grace" onSelect={handleSelect} />
            </ul>
            <p>Total: {total}</p>
            <p>Sum computed: {sumRuns} time(s)</p>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text: ["Ticks: 3", "Ada (rendered 1x)", "Grace (rendered 1x)", "Total: 15", "Sum computed: 1 time(s)"]
  code:
    - pattern: "memo\\s*\\("
      message: "Wrap Row:  const Row = memo(function Row(...) { ... });"
    - pattern: "useCallback\\s*\\("
      message: "Wrap handleSelect in useCallback(..., [])."
    - pattern: "useMemo\\s*\\("
      message: "Wrap the sum in useMemo(() => ..., [numbers])."
hints:
  - "By default a child re-renders every time its parent does. memo makes React skip a child whose props are equal to last time, but a function created inside the parent is a NEW function each render, so it also needs useCallback."
  - "Import memo, useCallback and useMemo from react. Write const Row = memo(function Row({ label, onSelect }) { ... }); const handleSelect = useCallback((label) => setSelected(label), []); and const total = useMemo(() => { sumRuns += 1; return numbers.reduce(...); }, [numbers]);"
  - "const handleSelect = useCallback((label) => { setSelected(label); }, []);   const total = useMemo(() => { sumRuns += 1; return numbers.reduce((sum, n) => sum + n, 0); }, [numbers]);   and   const Row = memo(function Row({ label, onSelect }) { ... });"
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';

      let sumRuns = 0;

      const Row = memo(function Row({ label, onSelect }) {
        const renders = useRef(0);
        renders.current += 1;
        return (
          <li>
            <button onClick={() => onSelect(label)}>
              {label} (rendered {renders.current}x)
            </button>
          </li>
        );
      });

      const numbers = [1, 2, 3, 4, 5];

      function App() {
        const [selected, setSelected] = useState("none");
        const [ticks, setTicks] = useState(0);

        useEffect(() => {
          if (ticks < 3) setTicks(ticks + 1);
        }, [ticks]);

        const handleSelect = useCallback((label) => {
          setSelected(label);
        }, []);

        const total = useMemo(() => {
          sumRuns += 1;
          return numbers.reduce((sum, n) => sum + n, 0);
        }, [numbers]);

        return (
          <div>
            <p>Ticks: {ticks}</p>
            <p>Selected: {selected}</p>
            <ul>
              <Row label="Ada" onSelect={handleSelect} />
              <Row label="Grace" onSelect={handleSelect} />
            </ul>
            <p>Total: {total}</p>
            <p>Sum computed: {sumRuns} time(s)</p>
          </div>
        );
      }

      export default App;
quiz:
  - q: When does a React component re-render by default?
    options: ["Only when its own props change", "Only when the page is reloaded", "When its state changes, or when its parent re-renders"]
    answer: 2
  - q: What does memo(Component) do?
    options: ["Skips re-rendering the component if its props are the same as last time", "Saves the component's output in localStorage", "Makes the component run in a separate thread"]
    answer: 0
  - q: Why does memo not help when you pass an inline function like onSelect={() => ...} as a prop?
    options: ["Functions cannot be props", "A new function object is created on every render, so the prop always looks changed", "memo only works with numbers"]
    answer: 1
    explain: "Props are compared with Object.is. Two functions with the same code are still different objects, so useCallback keeps the same one."
  - q: What is the difference between useMemo and useCallback?
    options: ["useMemo remembers a calculated value, useCallback remembers a function", "useMemo is for state and useCallback is for props", "There is no difference"]
    answer: 0
---

React is fast by default, so most apps never need the tools in this lesson. But when a page feels sluggish (a long list, a heavy calculation), knowing **why** components re-render lets you fix it. We will also learn the golden rule: measure first, optimise second.

## Why does a component re-render?

React re-runs a component's function (a **render**) when:

1. its own **state** changed, or
2. its **parent** re-rendered, even if the props it gets are exactly the same as before.

The second reason surprises beginners. If `App` has a `count` state and renders ten `<Row />` children, every click on a counter button re-runs `App` **and** all ten rows. A render is only a function call that builds a description of the UI, so it is usually cheap, and React only touches the real page when something actually changed. It becomes a problem only if a render is slow or happens very often.

You can watch renders with a `useRef` counter. A ref survives between renders and changing it does not trigger another one:

```jsx
const renders = useRef(0);
renders.current += 1;   // how many times this component function ran
```

## memo: skip a child when props are equal

`memo` wraps a component so that React compares its new props with the previous ones and **skips the render** if nothing changed:

```jsx
const Row = memo(function Row({ label, onSelect }) {
  return <li onClick={() => onSelect(label)}>{label}</li>;
});
```

Props are compared with `Object.is`, so strings and numbers work perfectly. But objects, arrays and functions are compared **by identity**, not content. A function written inside `App` is a brand-new object on every render, so a memoized child still sees a "changed" prop.

## useCallback: keep the same function

`useCallback(fn, deps)` returns the **same function object** between renders, until a value in `deps` changes:

```jsx
const handleSelect = useCallback((label) => {
  setSelected(label);
}, []);
```

Here `[]` means "never recreate". That is safe because `setSelected` never changes, and the function does not read any other state. If your function does read state or props, list them in `deps`, otherwise it keeps using stale values.

## useMemo: remember a calculated value

`useMemo(() => value, deps)` runs the function, remembers the result, and only recalculates when something in `deps` changes:

```jsx
const total = useMemo(() => numbers.reduce((sum, n) => sum + n, 0), [numbers]);
```

Use it for genuinely expensive work (sorting or filtering thousands of items), or to keep an object or array identity stable for a `memo` child or an effect dependency.

## The exercise

The starter re-renders `App` four times (an effect simulates three quick clicks). Without help, each `Row` renders four times and the sum is computed four times. After you add `memo`, `useCallback` and `useMemo`, each row renders once and the sum is computed once, no matter how often `App` updates.

## When to optimise

- Do not wrap everything: these hooks cost memory and make code harder to read.
- Measure first with the browser's React DevTools "Profiler" tab.
- A cheaper fix is often structural: move state down into the small component that needs it, so fewer things re-render.

> **Watch out:**
> - `memo` plus an inline arrow function prop: the child still re-renders each time. Wrap the function in `useCallback`.
> - A missing dependency in `useCallback` or `useMemo` means stale data: the function keeps using old state. The linter warns `React Hook useCallback has a missing dependency`.
> - Calling `useMemo` for something cheap such as `a + b`: the bookkeeping costs more than it saves.
> - `useMemo is not defined`: import it with `import { useMemo } from 'react';`.
> - A side effect (a request, changing a variable) inside `useMemo`: it should only calculate. React may call it again whenever it likes.

> **Your turn:** wrap `Row` in `memo`, wrap `handleSelect` in `useCallback(..., [])`, and wrap the sum in `useMemo(..., [numbers])`. Each row should read `rendered 1x` and the page should say `Sum computed: 1 time(s)`.
