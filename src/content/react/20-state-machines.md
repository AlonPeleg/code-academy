---
title: State machines with useReducer
summary: Model a screen as a status (idle, loading, success, error) plus the few events that may move it between statuses, so impossible states cannot happen.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useReducer, useEffect } from 'react';

      const initial = { status: "idle", data: null, error: null };

      // 1. Finish the machine. Look at the CURRENT status first, then at the action type.
      //      idle:             "fetch"   -> { status: "loading", data: null, error: null }
      //      loading:          "resolve" -> { status: "success", data: action.data, error: null }
      //                        "reject"  -> { status: "error", data: null, error: action.error }
      //                        "cancel"  -> back to initial
      //      success or error: "fetch"   -> loading again (a retry)
      //                        "reset"   -> back to initial
      //    Every other combination is IGNORED: return the state unchanged.
      function machine(state, action) {
        return state;
      }

      // Feed a list of events to the machine and describe the statuses it went through.
      function trace(events) {
        const states = events.reduce(
          (all, event) => [...all, machine(all[all.length - 1], event)],
          [initial]
        );
        return states.map((s) => s.status).join(" -> ");
      }

      const scenarios = [
        { label: "happy path", events: [{ type: "fetch" }, { type: "resolve", data: "x" }] },
        { label: "ignored events", events: [{ type: "resolve", data: "x" }, { type: "fetch" }, { type: "fetch" }, { type: "reject", error: "e" }] },
        { label: "retry", events: [{ type: "fetch" }, { type: "reject", error: "e" }, { type: "fetch" }, { type: "resolve", data: "x" }] },
        { label: "cancel", events: [{ type: "fetch" }, { type: "cancel" }, { type: "resolve", data: "x" }] },
      ];

      function View({ state, dispatch }) {
        // 2. Show ONE thing per status, below the status line:
        //      loading -> a paragraph  Loading...
        //      success -> a paragraph  Loaded: <the data>
        //      error   -> a paragraph  Error: <the error message>
        // 3. Turn the button off while the status is loading (two clicks must not start two requests).
        return (
          <div>
            <p>Status: {state.status}</p>
            <button onClick={() => dispatch({ type: "fetch" })}>Load</button>
          </div>
        );
      }

      // A fake request: it starts right away and answers after 20 ms.
      function Loader({ outcome }) {
        const [state, dispatch] = useReducer(machine, initial);

        useEffect(() => {
          dispatch({ type: "fetch" });
          const timer = setTimeout(() => {
            if (outcome === "ok") dispatch({ type: "resolve", data: "Ada Lovelace" });
            else dispatch({ type: "reject", error: "Network down" });
          }, 20);
          return () => clearTimeout(timer);
        }, []);

        return <View state={state} dispatch={dispatch} />;
      }

      function App() {
        return (
          <div>
            <h2>Live machines</h2>
            <Loader outcome="ok" />
            <Loader outcome="fail" />
            <h2>Traces</h2>
            <ul>
              {scenarios.map((s) => (
                <li key={s.label}>{s.label}: {trace(s.events)}</li>
              ))}
            </ul>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text:
      - "Status: success"
      - "Loaded: Ada Lovelace"
      - "Status: error"
      - "Error: Network down"
      - "happy path: idle -> loading -> success"
      - "ignored events: idle -> idle -> loading -> loading -> error"
      - "retry: idle -> loading -> error -> loading -> success"
      - "cancel: idle -> loading -> idle -> idle"
  code:
    - pattern: "disabled\\s*=\\s*\\{"
      message: "Disable the button while loading:  disabled={state.status === \"loading\"}"
hints:
  - "A state machine has a fixed list of statuses and a table of allowed moves. In machine, switch on state.status first; inside each case look at action.type, return the new state for the moves in the table and return state (unchanged) for everything else, including a default branch."
  - "case \"idle\": if (action.type === \"fetch\") return { status: \"loading\", data: null, error: null }; return state;   For \"loading\" handle resolve, reject and cancel; for \"success\" and \"error\" handle fetch and reset. Then in View add one line per status: {state.status === \"loading\" && <p>Loading...</p>} and so on."
  - "switch (state.status) { case \"idle\": return action.type === \"fetch\" ? { status: \"loading\", data: null, error: null } : state; case \"loading\": if (action.type === \"resolve\") return { status: \"success\", data: action.data, error: null }; if (action.type === \"reject\") return { status: \"error\", data: null, error: action.error }; if (action.type === \"cancel\") return initial; return state; ... }"
solution:
  - name: App.jsx
    code: |
      import { useReducer, useEffect } from 'react';

      const initial = { status: "idle", data: null, error: null };

      function machine(state, action) {
        switch (state.status) {
          case "idle":
            if (action.type === "fetch") return { status: "loading", data: null, error: null };
            return state;
          case "loading":
            if (action.type === "resolve") return { status: "success", data: action.data, error: null };
            if (action.type === "reject") return { status: "error", data: null, error: action.error };
            if (action.type === "cancel") return initial;
            return state;
          case "success":
          case "error":
            if (action.type === "fetch") return { status: "loading", data: null, error: null };
            if (action.type === "reset") return initial;
            return state;
          default:
            return state;
        }
      }

      function trace(events) {
        const states = events.reduce(
          (all, event) => [...all, machine(all[all.length - 1], event)],
          [initial]
        );
        return states.map((s) => s.status).join(" -> ");
      }

      const scenarios = [
        { label: "happy path", events: [{ type: "fetch" }, { type: "resolve", data: "x" }] },
        { label: "ignored events", events: [{ type: "resolve", data: "x" }, { type: "fetch" }, { type: "fetch" }, { type: "reject", error: "e" }] },
        { label: "retry", events: [{ type: "fetch" }, { type: "reject", error: "e" }, { type: "fetch" }, { type: "resolve", data: "x" }] },
        { label: "cancel", events: [{ type: "fetch" }, { type: "cancel" }, { type: "resolve", data: "x" }] },
      ];

      function View({ state, dispatch }) {
        return (
          <div>
            <p>Status: {state.status}</p>
            {state.status === "loading" && <p>Loading...</p>}
            {state.status === "success" && <p>Loaded: {state.data}</p>}
            {state.status === "error" && <p>Error: {state.error}</p>}
            <button onClick={() => dispatch({ type: "fetch" })} disabled={state.status === "loading"}>
              Load
            </button>
          </div>
        );
      }

      function Loader({ outcome }) {
        const [state, dispatch] = useReducer(machine, initial);

        useEffect(() => {
          dispatch({ type: "fetch" });
          const timer = setTimeout(() => {
            if (outcome === "ok") dispatch({ type: "resolve", data: "Ada Lovelace" });
            else dispatch({ type: "reject", error: "Network down" });
          }, 20);
          return () => clearTimeout(timer);
        }, []);

        return <View state={state} dispatch={dispatch} />;
      }

      function App() {
        return (
          <div>
            <h2>Live machines</h2>
            <Loader outcome="ok" />
            <Loader outcome="fail" />
            <h2>Traces</h2>
            <ul>
              {scenarios.map((s) => (
                <li key={s.label}>{s.label}: {trace(s.events)}</li>
              ))}
            </ul>
          </div>
        );
      }

      export default App;
quiz:
  - q: What is wrong with keeping separate booleans isLoading, isError and isSuccess?
    options: ["Booleans cannot be used in state", "They can be combined into impossible situations, such as loading and error both true", "They make the component render twice"]
    answer: 1
    explain: "Three booleans allow eight combinations but only four make sense. One status value allows exactly the situations you listed."
  - q: In the machine, what should happen if a resolve action arrives while the status is idle?
    options: ["The machine should throw an error", "The state should become success", "It is ignored: the reducer returns the state unchanged"]
    answer: 2
  - q: Why does machine look at state.status first and the action type second?
    options: ["The same event can mean different things in different statuses, so the current status decides which events are allowed", "Because switch cannot read action.type", "It makes the reducer impure"]
    answer: 0
  - q: Why disable the Load button while the status is loading?
    options: ["Because buttons cannot be clicked during an effect", "To stop the user from starting a second request while the first one is still running", "Because React forbids dispatching in loading"]
    answer: 1
---

Almost every screen that talks to a server goes through the same story: nothing has happened yet, a request is running, it worked, or it failed. If you track that story with separate `useState` flags (`isLoading`, `isError`, `data`) it is surprisingly easy to end up in a situation that should be impossible, like "loading and failed at the same time". A **state machine** removes that whole family of bugs. It is an old and very practical idea, and `useReducer` is a perfect place to build one.

## Statuses, not flags

Replace the flags with one value that can be exactly one of a fixed list:

```jsx
const initial = { status: "idle", data: null, error: null };
// status is one of: "idle" | "loading" | "success" | "error"
```

The `data` and `error` fields just carry the details. Now the screen is a plain decision: look at `status`, draw the matching thing. There is no way to be "idle and loading" because `status` holds only one word.

## Events and allowed moves

A machine is the status list plus a **table of allowed moves**. Each move is "in status X, event Y takes you to status Z":

| From | Event | To |
| --- | --- | --- |
| idle | fetch | loading |
| loading | resolve | success |
| loading | reject | error |
| loading | cancel | idle |
| success, error | fetch | loading (retry) |
| success, error | reset | idle |

Everything not in the table is **ignored**. If a late `resolve` arrives after the user cancelled, nothing breaks, because `resolve` is simply not a legal move out of `idle`.

## The reducer is the table

You already know reducers from the `useReducer` lesson. A machine reducer branches on the **current status first**:

```jsx
function machine(state, action) {
  switch (state.status) {
    case "idle":
      if (action.type === "fetch") return { status: "loading", data: null, error: null };
      return state;            // anything else: ignore
    case "loading":
      if (action.type === "resolve") return { status: "success", data: action.data, error: null };
      return state;
    default:
      return state;
  }
}
```

Why status first? Because the same event means different things in different places. `fetch` while `idle` starts a request, but `fetch` while `loading` must **not** start a second one.

Notice that a machine reducer is still **pure**: it does no fetching itself. The component starts the request (inside an effect) and then dispatches `resolve` or `reject` when it finishes. That separation also makes the machine easy to test, as the **Traces** list in the exercise shows. `trace` replays a list of events with no React at all and prints the statuses visited, so you can check the table by reading.

## Drawing it

```jsx
{state.status === "loading" && <p>Loading...</p>}
{state.status === "success" && <p>Loaded: {state.data}</p>}
{state.status === "error" && <p>Error: {state.error}</p>}
<button disabled={state.status === "loading"}>Load</button>
```

`a && b` draws `b` only when `a` is true. Disabling the button while loading is the user-facing twin of the "ignore" rule in the reducer. You protect in both places: the interface does not offer the move, and the machine refuses it anyway.

> **Watch out:**
> - Returning `undefined` from a `case` because you forgot `return state;`. The next render crashes with `Cannot read properties of undefined (reading 'status')`.
> - Changing the state with `state.status = "loading"` instead of returning a new object. React sees the same object and does not re-render.
> - Putting the request inside the reducer. Reducers must be pure; do the `fetch` in an effect or an event handler and dispatch the result.
> - Forgetting to clear the old `data` or `error` when a new request starts, so a stale error flashes up next to "Loading...".

## Going further

Add a `"timeout"` event that moves `loading` to `error`, and a "Cancel" button that is only drawn while loading. Real libraries such as XState take this idea much further, but the core is what you just wrote.

> **Your turn:** finish `machine` following the table, draw one paragraph per status in `View`, and disable the button while loading. The two live machines should end in `success` and `error`, and the four traces should match the table.
