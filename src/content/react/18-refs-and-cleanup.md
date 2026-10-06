---
title: Refs and effect cleanup
summary: Use useRef to reach DOM elements and to remember values without re-rendering, and clean up timers and subscriptions when an effect ends.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef } from 'react';

      // A tiny pretend message bus (like a chat connection). on() subscribes a function
      // and returns a function that unsubscribes it again.
      const bus = {
        listeners: new Set(),
        on(fn) {
          this.listeners.add(fn);
          return () => {
            this.listeners.delete(fn);
          };
        },
        emit(msg) {
          this.listeners.forEach((fn) => fn(msg));
        },
      };

      // ---- Part 1: a ref that points at a DOM element ----
      function FocusInput() {
        const inputRef = useRef(null);
        const [focused, setFocused] = useState(false);

        // 1. Hand inputRef to the <input> through its ref attribute.
        //    Then add an effect (empty dependency list) that calls the focus() method of the
        //    element stored in inputRef.current, and stores the proof with setFocused:
        //    the proof is whether document.activeElement is that same element.

        return (
          <div>
            <input placeholder="Type here" />
            <p>Input focused: {focused ? "yes" : "no"}</p>
          </div>
        );
      }

      // ---- Part 2: a ref that remembers a timer id ----
      function Ticker() {
        const [ticks, setTicks] = useState(0);
        const timerRef = useRef(null);
        const countRef = useRef(0);

        useEffect(() => {
          // 2. Start an interval that runs every 15 ms and keep its id in timerRef.current.
          //    Each time it runs: add 1 to countRef.current, show it with setTicks(countRef.current),
          //    and once countRef.current reaches 3 stop the interval using the id from timerRef.
          //    Finally return a cleanup function that stops the interval too.
        }, []);

        return <p>Ticks: {ticks}</p>;
      }

      // ---- Part 3: cleanup of a subscription ----
      function Room({ id }) {
        const [last, setLast] = useState("nothing yet");

        useEffect(() => {
          // 3. Subscribe to the bus and show each message with setLast(msg).
          //    Then RETURN the unsubscribe function that bus.on gives you, so React
          //    unsubscribes before the effect runs again (when id changes) and when Room disappears.
        }, [id]);

        return <p>Room {id} heard: {last}</p>;
      }

      function App() {
        const [room, setRoom] = useState("a");
        const [report, setReport] = useState("measuring...");

        // Pretend the user switches room after 20 ms, and a message arrives after 60 ms.
        useEffect(() => {
          const t1 = setTimeout(() => setRoom("b"), 20);
          const t2 = setTimeout(() => {
            bus.emit("hello");
            setReport("Active listeners: " + bus.listeners.size);
          }, 60);
          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
          };
        }, []);

        return (
          <div>
            <FocusInput />
            <Ticker />
            <Room id={room} />
            <p>{report}</p>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["input"]
    text: ["Input focused: yes", "Ticks: 3", "Room b heard: hello", "Active listeners: 1"]
  code:
    - pattern: "ref\\s*=\\s*\\{\\s*inputRef\\s*\\}"
      message: "Attach the ref to the input:  <input ref={inputRef} ... />"
    - pattern: "inputRef\\.current\\.focus\\s*\\("
      message: "Focus the element inside an effect:  inputRef.current.focus();"
    - pattern: "timerRef\\.current\\s*=\\s*setInterval\\s*\\("
      message: "Store the interval id in the ref:  timerRef.current = setInterval(...)"
    - pattern: "clearInterval\\s*\\(\\s*timerRef\\.current\\s*\\)"
      message: "Stop the timer with  clearInterval(timerRef.current)."
    - pattern: "bus\\.on\\s*\\("
      message: "Subscribe with bus.on(...) inside the effect of Room."
hints:
  - "A ref is a box: useRef gives you { current: ... } that React keeps between renders. Putting it in an element's ref attribute fills current with the DOM node after the first render, so you can use it inside an effect. Changing .current never causes a re-render."
  - "Part 1: <input ref={inputRef} /> and an effect that calls inputRef.current.focus(). Part 2: timerRef.current = setInterval(() => { ... }, 15). Part 3: const off = bus.on((msg) => setLast(msg)); and return off so React can unsubscribe. The last number on the page must be exactly 1 listener, so the old room's listener has to be removed."
  - "useEffect(() => { inputRef.current.focus(); setFocused(document.activeElement === inputRef.current); }, []);   useEffect(() => { timerRef.current = setInterval(() => { countRef.current += 1; setTicks(countRef.current); if (countRef.current >= 3) clearInterval(timerRef.current); }, 15); return () => clearInterval(timerRef.current); }, []);   useEffect(() => { const off = bus.on((msg) => setLast(msg)); return off; }, [id]);"
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect, useRef } from 'react';

      const bus = {
        listeners: new Set(),
        on(fn) {
          this.listeners.add(fn);
          return () => {
            this.listeners.delete(fn);
          };
        },
        emit(msg) {
          this.listeners.forEach((fn) => fn(msg));
        },
      };

      function FocusInput() {
        const inputRef = useRef(null);
        const [focused, setFocused] = useState(false);

        useEffect(() => {
          inputRef.current.focus();
          setFocused(document.activeElement === inputRef.current);
        }, []);

        return (
          <div>
            <input ref={inputRef} placeholder="Type here" />
            <p>Input focused: {focused ? "yes" : "no"}</p>
          </div>
        );
      }

      function Ticker() {
        const [ticks, setTicks] = useState(0);
        const timerRef = useRef(null);
        const countRef = useRef(0);

        useEffect(() => {
          timerRef.current = setInterval(() => {
            countRef.current += 1;
            setTicks(countRef.current);
            if (countRef.current >= 3) {
              clearInterval(timerRef.current);
            }
          }, 15);
          return () => clearInterval(timerRef.current);
        }, []);

        return <p>Ticks: {ticks}</p>;
      }

      function Room({ id }) {
        const [last, setLast] = useState("nothing yet");

        useEffect(() => {
          const off = bus.on((msg) => setLast(msg));
          return off;
        }, [id]);

        return <p>Room {id} heard: {last}</p>;
      }

      function App() {
        const [room, setRoom] = useState("a");
        const [report, setReport] = useState("measuring...");

        useEffect(() => {
          const t1 = setTimeout(() => setRoom("b"), 20);
          const t2 = setTimeout(() => {
            bus.emit("hello");
            setReport("Active listeners: " + bus.listeners.size);
          }, 60);
          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
          };
        }, []);

        return (
          <div>
            <FocusInput />
            <Ticker />
            <Room id={room} />
            <p>{report}</p>
          </div>
        );
      }

      export default App;
quiz:
  - q: What happens when you change the value of ref.current?
    options: ["The component re-renders with the new value", "Nothing is re-rendered; the value is simply remembered for next time", "React throws an error because refs are read-only"]
    answer: 1
    explain: "Refs are for values that React does not need to draw. If the screen should change, use state instead."
  - q: When is inputRef.current filled with the DOM element?
    options: ["After React has put the element on the page, so inside effects and event handlers, not during rendering", "Before the very first render, so you can read it at the top of the component", "Only after the user clicks the input"]
    answer: 0
  - q: What is the job of the function an effect returns?
    options: ["It runs the effect a second time to double-check", "It runs before the effect runs again and when the component disappears, so you can undo what the effect set up", "It decides what the component renders"]
    answer: 1
  - q: Why does the lesson store the interval id in a ref instead of a normal variable inside the component?
    options: ["A ref survives re-renders, so a later render or the cleanup can still find the same id", "Because setInterval only accepts refs", "Because variables inside components are not allowed"]
    answer: 0
    explain: "A normal variable is created again on every render, so it would not remember the id."
---

Most of React is "describe what the screen should look like". Sometimes you need to step outside that: focus a text box, measure an element, start a timer, listen to something. This lesson gives you two tools for that. **Refs** let you hold on to things React does not manage, and **effect cleanup** makes sure you tidy up after yourself.

## useRef: a box that survives renders

```jsx
const countRef = useRef(0);
countRef.current += 1;     // change it any time
console.log(countRef.current);
```

`useRef(initial)` returns an object `{ current: initial }`. React hands you the **same object on every render**, and there is one big rule: changing `.current` does **not** cause a re-render. That makes a ref the right place for values that matter to your code but not to the screen: a timer id, the previous value of something, a flag.

Compare:

| | `useState` | `useRef` |
| --- | --- | --- |
| Survives re-renders | yes | yes |
| Changing it re-renders | yes | no |
| Use it for | what is shown on screen | things behind the scenes |

## Refs and the DOM

The second job of a ref is to point at a real element on the page:

```jsx
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus();
}, []);

return <input ref={inputRef} />;
```

When React puts the `<input>` on the page it stores the real DOM element in `inputRef.current`. Before that moment `current` is `null`, which is why you touch it inside an **effect** (it runs after the page is drawn) or an event handler, never while rendering. Useful methods: `.focus()`, `.scrollIntoView()`, `.select()`, `.value`.

## Effect cleanup

Effects can start things that keep running: a timer, an event listener, a chat connection. If you never stop them they pile up (a **leak**) and keep updating components that are gone. The fix is to **return a function** from the effect:

```jsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);   // the cleanup
}, []);
```

React runs the cleanup in two situations: **before the effect runs again** (because a dependency changed) and **when the component is removed**. In the exercise, `Room` subscribes to a message bus for room `id`. When the room changes from `a` to `b`, React first runs the old cleanup (unsubscribe room a) and then the new effect (subscribe room b). Without the cleanup the bus would end up with two listeners, and the page reports how many there are.

A good habit: whenever an effect *starts* something, ask "who stops it?"

## Putting a timer id in a ref

If the timer is started in an effect and stopped in the same effect, a local `const id` is enough. A ref helps when something else must stop it, for example a Stop button or the interval callback itself. The `Ticker` keeps its id in `timerRef.current` and also counts in `countRef`. Why not use the `ticks` state for counting? The interval callback was created during the first render and **remembers** `ticks === 0` forever (a "stale closure"). A ref always has the current value.

> **Watch out:**
> - `Cannot read properties of null (reading 'focus')`: you used `inputRef.current` while rendering, or you forgot `ref={inputRef}` on the element.
> - The counter keeps running after the component disappears and the console shows `Can't perform a React state update on an unmounted component`: you did not return a cleanup.
> - Writing `useEffect(async () => ...)`: an effect function must not be async, because it would return a promise instead of a cleanup function.
> - Using a ref for something that should be on screen: the screen will not update because changing `.current` does not re-render.

> **Your turn:** in `FocusInput` attach the ref and focus the input in an effect. In `Ticker` start an interval that stores its id in `timerRef`, counts to 3 using `countRef`, then stops. In `Room` subscribe to the bus and return the unsubscribe function. The page should report exactly one active listener.
