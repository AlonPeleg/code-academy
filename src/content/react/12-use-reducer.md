---
title: useReducer for complex state
summary: Move tangled state updates into one pure function that describes every way the state can change.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useReducer } from 'react';

      const initialState = { items: [] };

      // 1. Finish the reducer. It receives the current state and an action and returns the NEW state.
      //    Handle three kinds of action (use a switch on action.type):
      //      "add":    add action.item to the end of items (make a new array, do not push)
      //      "remove": keep every item whose id is NOT action.id
      //      "clear":  go back to an empty list
      //    For any other action, return the state unchanged.
      function cartReducer(state, action) {
        return state;
      }

      function total(items) {
        return items.reduce((sum, item) => sum + item.price, 0);
      }

      function App() {
        // 2. Use the reducer for the live cart: you get the state and a dispatch function.
        const state = initialState;

        // A reducer is just a function, so we can replay a list of actions with no React at all:
        const replay = [
          { type: "add", item: { id: 1, name: "Pen", price: 2 } },
          { type: "add", item: { id: 2, name: "Book", price: 12 } },
          { type: "add", item: { id: 3, name: "Tea", price: 4 } },
          { type: "remove", id: 1 },
        ].reduce(cartReducer, initialState);

        return (
          <div>
            <h2>Cart: {state.items.length} items</h2>
            <p>Total: {total(state.items)}</p>
            {/* 3. Make the buttons send actions with dispatch. */}
            <button>Add a book</button>
            <button>Clear</button>
            <p>Replay: {replay.items.length} items, total {total(replay.items)}</p>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text: ["Cart: 0 items", "Total: 0", "Replay: 2 items, total 16"]
  code:
    - pattern: "useReducer\\s*\\(\\s*cartReducer"
      message: "Create the state with  useReducer(cartReducer, initialState)."
    - pattern: "dispatch\\s*\\(\\s*\\{"
      message: "Send actions with  dispatch({ type: ... })."
    - pattern: "case\\s+[\"']add[\"']"
      message: "Handle the action with a  case \"add\":  branch."
    - pattern: "\\.filter\\s*\\("
      message: "Use filter to build the list without the removed item."
hints:
  - "A reducer is a pure function (state, action) => newState. Use switch (action.type) with one case per action, and never change the old state: build a new object."
  - "For add return { items: [...state.items, action.item] }. For remove return { items: state.items.filter(i => i.id !== action.id) }. For clear return { items: [] }. In App call useReducer(cartReducer, initialState) and use dispatch in onClick."
  - "const [state, dispatch] = useReducer(cartReducer, initialState);   <button onClick={() => dispatch({ type: \"add\", item: { id: 4, name: \"Book\", price: 12 } })}>Add a book</button>   <button onClick={() => dispatch({ type: \"clear\" })}>Clear</button>"
solution:
  - name: App.jsx
    code: |
      import { useReducer } from 'react';

      const initialState = { items: [] };

      function cartReducer(state, action) {
        switch (action.type) {
          case "add":
            return { items: [...state.items, action.item] };
          case "remove":
            return { items: state.items.filter((i) => i.id !== action.id) };
          case "clear":
            return { items: [] };
          default:
            return state;
        }
      }

      function total(items) {
        return items.reduce((sum, item) => sum + item.price, 0);
      }

      function App() {
        const [state, dispatch] = useReducer(cartReducer, initialState);

        const replay = [
          { type: "add", item: { id: 1, name: "Pen", price: 2 } },
          { type: "add", item: { id: 2, name: "Book", price: 12 } },
          { type: "add", item: { id: 3, name: "Tea", price: 4 } },
          { type: "remove", id: 1 },
        ].reduce(cartReducer, initialState);

        return (
          <div>
            <h2>Cart: {state.items.length} items</h2>
            <p>Total: {total(state.items)}</p>
            <button onClick={() => dispatch({ type: "add", item: { id: Date.now(), name: "Book", price: 12 } })}>Add a book</button>
            <button onClick={() => dispatch({ type: "clear" })}>Clear</button>
            <p>Replay: {replay.items.length} items, total {total(replay.items)}</p>
          </div>
        );
      }

      export default App;
quiz:
  - q: What does a reducer function receive and return?
    options: ["A component, and it returns JSX", "A dispatch function, and it returns nothing", "The current state and an action, and it returns the new state"]
    answer: 2
  - q: 'What does dispatch({ type: "clear" }) do?'
    options: ["Sends an action to React, which runs the reducer and re-renders with the new state", "Calls the reducer directly and returns its result to you", "Deletes the component from the page"]
    answer: 0
  - q: Why must a reducer be a pure function that does not change the old state?
    options: ["JavaScript forbids changing objects", "React compares old and new state to detect a change, and the same input must always give the same output", "Because switch statements cannot mutate"]
    answer: 1
    explain: "Pure reducers are easy to test, can be replayed (as the Replay line shows) and let React detect changes by reference."
  - q: When is useReducer a better fit than useState?
    options: ["When the state is a single number", "Whenever you want faster code", "When several values change together or the next state depends on a set of named actions"]
    answer: 2
---

Plain `useState` is perfect for a counter or a text box. But when one piece of state has many fields, and many different events change it in different ways, the `setState` calls scatter all over your component and become hard to follow. `useReducer` fixes this by putting **all the ways the state can change in one place**. Big apps lean on this pattern (Redux is built on the same idea).

## Three ingredients

1. **State**: an object describing everything, e.g. `{ items: [] }`.
2. **Action**: a small object that says *what happened*, e.g. `{ type: "add", item: {...} }`. It describes the event, not how to handle it.
3. **Reducer**: a function `(state, action) => newState` that decides the new state for each kind of action.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { items: [...state.items, action.item] };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}
```

`switch` compares `action.type` with each `case` and runs the matching branch. The `default` branch returns the state unchanged, so unknown actions do no harm. (An `if / else if` chain works too; `switch` is the convention.)

## Using it in a component

```jsx
const [state, dispatch] = useReducer(reducer, { items: [] });
```

`useReducer` takes the reducer and the starting state, and gives back the **current state** and a function called `dispatch`. To change the state you do not call a setter; you **dispatch an action**:

```jsx
<button onClick={() => dispatch({ type: "clear" })}>Clear</button>
```

React then calls `reducer(currentState, action)`, stores what it returns and re-renders. Every state change in your app now goes through one function, so you can read it from top to bottom and see every possibility.

## Reducers must be pure

A reducer must follow two rules:

- **Do not change the old state.** Build and return a new object or array, using spread (`[...items, x]`) or `filter` / `map`. React decides to re-render by checking whether the returned value is a *new* object.
- **No surprises**: no `fetch`, no `Date.now()`, no random numbers, no changing outside variables. The same state plus the same action must always give the same result.

A bonus of purity: a reducer is just a function, so you can run it **without React**. The exercise does this: `[...actions].reduce(cartReducer, initialState)` replays a whole history of actions and gives the final state. That makes reducers wonderful to test, and it is how "undo" features and time-travel debuggers work.

## useState or useReducer?

| Situation | Choose |
| --- | --- |
| A counter, a toggle, one input | `useState` |
| Several fields that change together | `useReducer` |
| The next state depends on the previous in complicated ways | `useReducer` |
| Many event handlers all touching the same state | `useReducer` |

> **Watch out:**
> - Mutating state with `state.items.push(action.item)` and returning `state`. React sees the same object and does not re-render, so the screen does not update.
> - Forgetting `return` in a `case`. Execution falls through into the next case or ends with `undefined`, and the next render crashes with `Cannot read properties of undefined (reading 'items')`.
> - Calling the reducer yourself instead of `dispatch(...)`. Only `dispatch` tells React to re-render.
> - Using `Date.now()` inside the reducer for new ids: do it where you create the action, so the reducer stays pure.

## Going further

Try adding a `"rename"` action, or an `"increase"` action that raises the price of one item with `map`.

> **Your turn:** finish `cartReducer` for the actions `add`, `remove` and `clear`, create the live cart with `useReducer(cartReducer, initialState)`, and make the two buttons dispatch actions. The replay line should then read `Replay: 2 items, total 16`.
