---
title: Controlled vs uncontrolled inputs, and a debounce hook
summary: Learn when an input should live in state and when the DOM can keep it, then write a reusable useDebounce hook that waits for the user to stop typing.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef } from 'react';

      // ---------- Part 1: an UNCONTROLLED input ----------
      function NameBox() {
        const nameRef = useRef(null);
        const [seen, setSeen] = useState("(nothing yet)");

        // 1. Make the input uncontrolled: use the defaultValue attribute (NOT value) with the text Ada,
        //    and give it the ref nameRef. Then add an effect that runs once and reads the text straight
        //    from the page element with setSeen(nameRef.current.value).
        useEffect(() => {}, []);

        function handleSubmit(e) {
          e.preventDefault();
          setSeen(nameRef.current.value);
        }

        return (
          <form onSubmit={handleSubmit}>
            <input />
            <button type="submit">Read</button>
            <p>Ref sees: {seen}</p>
          </form>
        );
      }

      // ---------- Part 2: a reusable hook ----------
      // 2. Finish useDebounce(value, delay). It returns a copy of value that only changes after
      //    value has stayed the same for delay milliseconds.
      //    Keep the delayed copy in state (it starts as value). In an effect that depends on
      //    [value, delay] start a timer with setTimeout that copies value into that state, and
      //    return a cleanup function that cancels the timer, so every new keystroke restarts the wait.
      function useDebounce(value, delay) {
        return value;
      }

      function Search() {
        const [query, setQuery] = useState("");
        const debounced = useDebounce(query, 150);
        const [requests, setRequests] = useState(0);
        const [results, setResults] = useState([]);

        // To make this lesson checkable, a "user" types l, li, lin, linu, linus (30 ms between keys).
        useEffect(() => {
          const timers = ["l", "li", "lin", "linu", "linus"].map((text, i) =>
            setTimeout(() => setQuery(text), i * 30)
          );
          return () => timers.forEach((t) => clearTimeout(t));
        }, []);

        // The expensive work: ask the practice API for users that match the debounced text.
        // (Already finished. Notice that it depends on debounced, not on query.)
        useEffect(() => {
          if (!debounced) return;
          let cancelled = false;
          setRequests((n) => n + 1);
          fetch("https://api.academy.test/users?q=" + encodeURIComponent(debounced))
            .then((res) => res.json())
            .then((users) => {
              if (!cancelled) setResults(users.map((u) => u.name));
            });
          return () => {
            cancelled = true;
          };
        }, [debounced]);

        return (
          <div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            <p>Typed: {query}</p>
            <p>Searching for: {debounced}</p>
            <p>Requests sent: {requests}</p>
            <p>Results: {results.length ? results.join(", ") : "none"}</p>
          </div>
        );
      }

      function App() {
        return (
          <div>
            <h2>Uncontrolled</h2>
            <NameBox />
            <h2>Debounced search</h2>
            <Search />
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["input", "button"]
    text: ["Ref sees: Ada", "Typed: linus", "Searching for: linus", "Requests sent: 1", "Results: Linus Torvalds"]
  code:
    - pattern: "defaultValue\\s*=\\s*[\"{]"
      message: "Give the uncontrolled input its starting text with  defaultValue=\"Ada\"."
    - pattern: "ref\\s*=\\s*\\{\\s*nameRef\\s*\\}"
      message: "Connect the ref to the input:  <input ref={nameRef} ... />"
hints:
  - "An uncontrolled input keeps its text inside the browser: you give it a starting text with defaultValue and ask the DOM for the current text through a ref when you need it. For the hook, a debounce is a timer that is cancelled and restarted whenever the value changes, so it only fires after a quiet period."
  - "Part 1: <input ref={nameRef} defaultValue=\"Ada\" /> and an effect with setSeen(nameRef.current.value). Part 2: const [debounced, setDebounced] = useState(value); then useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]); and return debounced."
  - "function useDebounce(value, delay) { const [debounced, setDebounced] = useState(value); useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]); return debounced; }"
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef } from 'react';

      function NameBox() {
        const nameRef = useRef(null);
        const [seen, setSeen] = useState("(nothing yet)");

        useEffect(() => {
          setSeen(nameRef.current.value);
        }, []);

        function handleSubmit(e) {
          e.preventDefault();
          setSeen(nameRef.current.value);
        }

        return (
          <form onSubmit={handleSubmit}>
            <input ref={nameRef} defaultValue="Ada" />
            <button type="submit">Read</button>
            <p>Ref sees: {seen}</p>
          </form>
        );
      }

      function useDebounce(value, delay) {
        const [debounced, setDebounced] = useState(value);

        useEffect(() => {
          const timer = setTimeout(() => setDebounced(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);

        return debounced;
      }

      function Search() {
        const [query, setQuery] = useState("");
        const debounced = useDebounce(query, 150);
        const [requests, setRequests] = useState(0);
        const [results, setResults] = useState([]);

        useEffect(() => {
          const timers = ["l", "li", "lin", "linu", "linus"].map((text, i) =>
            setTimeout(() => setQuery(text), i * 30)
          );
          return () => timers.forEach((t) => clearTimeout(t));
        }, []);

        // The expensive work: ask the practice API for users that match the debounced text.
        // (Already finished. Notice that it depends on debounced, not on query.)
        useEffect(() => {
          if (!debounced) return;
          let cancelled = false;
          setRequests((n) => n + 1);
          fetch("https://api.academy.test/users?q=" + encodeURIComponent(debounced))
            .then((res) => res.json())
            .then((users) => {
              if (!cancelled) setResults(users.map((u) => u.name));
            });
          return () => {
            cancelled = true;
          };
        }, [debounced]);

        return (
          <div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            <p>Typed: {query}</p>
            <p>Searching for: {debounced}</p>
            <p>Requests sent: {requests}</p>
            <p>Results: {results.length ? results.join(", ") : "none"}</p>
          </div>
        );
      }

      function App() {
        return (
          <div>
            <h2>Uncontrolled</h2>
            <NameBox />
            <h2>Debounced search</h2>
            <Search />
          </div>
        );
      }

      export default App;
quiz:
  - q: What is an uncontrolled input?
    options: ["An input that React is not allowed to render", "An input that the browser itself keeps the text of, which you read through a ref or a form when you need it", "An input that has been disabled"]
    answer: 1
  - q: Which attribute gives an uncontrolled input its starting text?
    options: ["value", "placeholder", "defaultValue"]
    answer: 2
    explain: "Using value without onChange makes a frozen controlled input; defaultValue sets only the starting text."
  - q: What does a debounced value do?
    options: ["It updates only after the original value has stopped changing for a set time", "It updates twice as fast as the original", "It updates only the first time the original changes"]
    answer: 0
  - q: Why does the effect inside useDebounce return clearTimeout(timer)?
    options: ["To free memory when the page closes", "So that a new keystroke cancels the waiting timer and the wait starts over", "Because setTimeout cannot run without a cleanup"]
    answer: 1
    explain: "Without the cleanup, every keystroke would still fire its own timer, and you would get one update per key, only later."
---

Forms give you a choice: let **React** hold what the user typed, or let the **browser** hold it. Each choice has a good use. Then you will write one of the most useful small hooks in everyday React, `useDebounce`, which stops your code from doing expensive work on every single keystroke.

## Controlled and uncontrolled

A **controlled** input gets its text from state and reports every change back, as you saw in the forms lessons:

```jsx
<input value={query} onChange={(e) => setQuery(e.target.value)} />
```

React is the single source of truth. Anything else on the page can react to each keystroke, you can validate live, or force the text to upper case.

An **uncontrolled** input lets the browser keep the text, like plain HTML. You give it only a starting text and read the current text when you need it:

```jsx
const nameRef = useRef(null);

<input ref={nameRef} defaultValue="Ada" />

// later, for example in a submit handler:
nameRef.current.value   // the text that is in the box right now
```

`defaultValue` sets the starting text once; after that the browser is in charge. (Using `value` without `onChange` would give you a frozen input and a console warning.) Because nothing is stored in state, typing does not re-render your component at all.

| | Controlled | Uncontrolled |
| --- | --- | --- |
| Where the text lives | React state | The DOM element |
| How you read it | the state variable | `ref.current.value` (or `FormData`) |
| Live validation, formatting | easy | awkward |
| Re-renders on every key | yes | no |
| Good for | most forms | simple forms, file inputs, integrating non-React code |

An `<input type="file">` is always uncontrolled, because JavaScript is not allowed to set which file the user picked. Choose controlled by default and uncontrolled when it makes the code simpler.

## The problem debounce solves

Imagine a search box that asks the server for results whenever the text changes. Typing "react" would send five requests: for `r`, `re`, `rea`, `reac` and `react`. Four of them are wasted and may even arrive out of order. What we want is: wait until the user **pauses**, then search once. That is called **debouncing**.

## Writing the hook

The idea: keep a delayed copy of the value. Whenever the value changes, start a timer. If the value changes again before the timer finishes, cancel it and start a new one. Only a timer that is left alone gets to update the copy.

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);   // cancel the old timer
  }, [value, delay]);

  return debounced;
}
```

This is exactly the **cleanup** from the refs lesson doing real work. Each time `value` changes, React first runs the previous cleanup (cancelling the old timer) and then the new effect (starting a new one). In your component you use it like any other value:

```jsx
const [query, setQuery] = useState("");
const debounced = useDebounce(query, 300);   // 300 ms is a common choice
// use query for the input, and debounced for the expensive work
```

The input stays snappy because it uses `query`; the search uses `debounced` and runs once per pause.

> **Watch out:**
> - Forgetting the cleanup: every keystroke still fires its own timer, so you get all five updates, only 300 ms later.
> - Leaving `delay` or `value` out of the dependency list, so the hook keeps using an old value.
> - Mixing both styles on one input: `value` together with `defaultValue` gives the warning `contains an input of type text with both value and defaultValue props`.
> - Reading `nameRef.current.value` while rendering: the element does not exist yet on the first render (`Cannot read properties of null`). Read it in an event handler or an effect.

## Going further

A close cousin is **throttling**: run at most once every N milliseconds even while the user keeps going, which is handy for scroll and resize events. You could also write `useDebouncedCallback(fn, delay)`, which debounces a function instead of a value.

> **Your turn:** make the name input uncontrolled with `defaultValue="Ada"` and a ref, and read it in an effect. Then finish `useDebounce`. The page should show that you typed `linus`, searched for `linus`, and sent only one request, which finds Linus Torvalds.
