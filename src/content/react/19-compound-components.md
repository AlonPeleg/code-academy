---
title: Compound components and render props
summary: Build flexible components that work together through context, and components that let the caller decide what to draw by passing a function as children.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { createContext, useContext, useState } from 'react';

      // ---------- Part 1: compound components (Tabs, Tab, Panel) ----------
      const TabsContext = createContext(null);

      // Small helper: read the shared tabs state, and complain clearly if a Tab or Panel
      // is used outside of <Tabs>. (Already finished.)
      function useTabsContext() {
        const context = useContext(TabsContext);
        if (!context) throw new Error("Tab and Panel must be used inside <Tabs>");
        return context;
      }

      // The parent owns the state and shares it with its children through context. (Already finished.)
      function Tabs({ defaultValue, children }) {
        const [active, setActive] = useState(defaultValue);
        return (
          <TabsContext.Provider value={{ active, setActive }}>
            <div className="tabs">{children}</div>
          </TabsContext.Provider>
        );
      }

      // 1. Tab: read { active, setActive } from the helper above and render a <button role="tab">.
      //    It shows its children, has aria-selected equal to (active === value),
      //    and clicking it calls setActive(value).
      function Tab({ value, children }) {
        return null;
      }

      // 2. Panel: read { active } from the helper. If this panel's value is not the active one render nothing (null),
      //    otherwise render <div role="tabpanel"> around the children.
      function Panel({ value, children }) {
        return null;
      }

      // The pieces hang off the parent, so the caller writes <Tabs.Tab> and <Tabs.Panel>.
      Tabs.Tab = Tab;
      Tabs.Panel = Panel;

      // ---------- Part 2: a render prop (children as a function) ----------
      // 3. Toggle keeps an on/off state that starts as the prop "initial" (false when missing).
      //    It draws NOTHING itself. It calls the function it received as children and passes it an
      //    object { on, toggle }, and returns whatever that function returns.
      //    toggle is a function that flips on.
      function Toggle({ initial = false, children }) {
        return null;
      }

      function App() {
        return (
          <div>
            <Tabs defaultValue="billing">
              <Tabs.Tab value="profile">Profile</Tabs.Tab>
              <Tabs.Tab value="billing">Billing</Tabs.Tab>
              <Tabs.Panel value="profile"><p>Profile settings</p></Tabs.Panel>
              <Tabs.Panel value="billing"><p>Billing settings</p></Tabs.Panel>
            </Tabs>

            <Toggle initial={true}>
              {({ on, toggle }) => (
                <div>
                  <p>Light is {on ? "on" : "off"}</p>
                  <button onClick={toggle}>Flip</button>
                </div>
              )}
            </Toggle>

            <Toggle>
              {({ on }) => <p>Door is {on ? "open" : "closed"}</p>}
            </Toggle>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ['button[role="tab"][aria-selected="true"]', '[role="tabpanel"]']
    text: ["Billing settings", "Light is on", "Door is closed"]
  code:
    - pattern: "=\\s*useTabsContext\\s*\\("
      message: "Read the shared state in Tab and Panel with  const { active } = useTabsContext();"
    - pattern: "aria-selected\\s*=\\s*\\{"
      message: "Mark the active tab for screen readers:  aria-selected={active === value}"
    - pattern: "children\\s*\\(\\s*\\{"
      message: "Call the children function and give it an object:  children({ on, toggle })"
hints:
  - "In a compound component the parent keeps the state and shares it through context; each child reads what it needs with useContext (here the helper useTabsContext). A render prop is simply a prop (here children) whose value is a function that you CALL."
  - "Tab: const { active, setActive } = useTabsContext(); return a button with role=\"tab\", aria-selected={active === value} and onClick={() => setActive(value)}. Panel: if (active !== value) return null; otherwise a div with role=\"tabpanel\". Toggle: useState(initial), then return children({ on, toggle })."
  - "function Tab({ value, children }) { const { active, setActive } = useTabsContext(); return <button role=\"tab\" aria-selected={active === value} onClick={() => setActive(value)}>{children}</button>; }   function Toggle({ initial = false, children }) { const [on, setOn] = useState(initial); return children({ on, toggle: () => setOn(!on) }); }"
solution:
  - name: App.jsx
    code: |
      import { createContext, useContext, useState } from 'react';

      const TabsContext = createContext(null);

      function useTabsContext() {
        const context = useContext(TabsContext);
        if (!context) throw new Error("Tab and Panel must be used inside <Tabs>");
        return context;
      }

      function Tabs({ defaultValue, children }) {
        const [active, setActive] = useState(defaultValue);
        return (
          <TabsContext.Provider value={{ active, setActive }}>
            <div className="tabs">{children}</div>
          </TabsContext.Provider>
        );
      }

      function Tab({ value, children }) {
        const { active, setActive } = useTabsContext();
        return (
          <button role="tab" aria-selected={active === value} onClick={() => setActive(value)}>
            {children}
          </button>
        );
      }

      function Panel({ value, children }) {
        const { active } = useTabsContext();
        if (active !== value) return null;
        return <div role="tabpanel">{children}</div>;
      }

      Tabs.Tab = Tab;
      Tabs.Panel = Panel;

      function Toggle({ initial = false, children }) {
        const [on, setOn] = useState(initial);
        return children({ on, toggle: () => setOn(!on) });
      }

      function App() {
        return (
          <div>
            <Tabs defaultValue="billing">
              <Tabs.Tab value="profile">Profile</Tabs.Tab>
              <Tabs.Tab value="billing">Billing</Tabs.Tab>
              <Tabs.Panel value="profile"><p>Profile settings</p></Tabs.Panel>
              <Tabs.Panel value="billing"><p>Billing settings</p></Tabs.Panel>
            </Tabs>

            <Toggle initial={true}>
              {({ on, toggle }) => (
                <div>
                  <p>Light is {on ? "on" : "off"}</p>
                  <button onClick={toggle}>Flip</button>
                </div>
              )}
            </Toggle>

            <Toggle>
              {({ on }) => <p>Door is {on ? "open" : "closed"}</p>}
            </Toggle>
          </div>
        );
      }

      export default App;
quiz:
  - q: In a compound component such as Tabs, how do Tab and Panel know which tab is active?
    options: ["The parent passes props to each one by hand", "They read the shared state from a context that the parent Tabs provides", "They search the DOM for the selected button"]
    answer: 1
  - q: What is a render prop?
    options: ["A prop that holds a function the component calls to find out what to draw", "A CSS property that React renders", "A prop that is only available during the first render"]
    answer: 0
    explain: "The component owns the logic (state, timers, data) and the caller owns the looks."
  - q: Why does the Toggle component return children({ on, toggle }) instead of JSX of its own?
    options: ["Because components must always return functions", "To make the toggle run faster", "So each caller can draw the on/off state in its own way, while Toggle only supplies the logic"]
    answer: 2
  - q: What is the main advantage of Tabs.Tab and Tabs.Panel over a single Tabs component with a big tabs prop?
    options: ["The caller controls the order and content of the pieces with plain JSX, and can add anything between them", "It uses less memory", "Compound components are the only way to use context"]
    answer: 0
---

Some components only make sense as a team. A `<select>` needs `<option>` elements, a table needs rows. In React you can design your own components the same way: a **parent** that holds the state and **children** that cooperate with it. And you can go one step further and let the caller decide what is drawn. Both patterns appear in real libraries (menus, accordions, form libraries), so recognising them makes other people's code much easier to read.

## Compound components

Imagine a tabs widget. The first design that comes to mind is one component with a configuration prop:

```jsx
<Tabs tabs={[{ id: "a", title: "A", content: "..." }, { id: "b", title: "B", content: "..." }]} />
```

It works until you want an icon in one title, or a link between two panels. You keep adding props. The **compound components** pattern turns the big prop into small pieces the caller arranges in normal JSX:

```jsx
<Tabs defaultValue="billing">
  <Tabs.Tab value="profile">Profile</Tabs.Tab>
  <Tabs.Tab value="billing">Billing</Tabs.Tab>
  <Tabs.Panel value="profile">...</Tabs.Panel>
  <Tabs.Panel value="billing">...</Tabs.Panel>
</Tabs>
```

How do the pieces talk to each other? Through **context** (see the context lesson). `Tabs` creates the state and publishes it with a Provider. `Tab` and `Panel` call `useContext` to read it. Neither of them is passed anything by hand, which is why the caller can put them anywhere inside `Tabs`.

The funny dots (`Tabs.Tab`) are only a naming trick. A function is an object in JavaScript, so you can attach properties to it: `Tabs.Tab = Tab;`. It tells the reader "these belong together".

A friendly touch is a helper hook that throws a clear error when a piece is used outside its parent:

```jsx
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab and Panel must be used inside <Tabs>");
  return context;
}
```

Another detail: `aria-selected` and `role="tab"` tell screen readers which tab is selected, so building the pattern properly also makes your component accessible.

## Render props

Sometimes a component has useful **logic** but should not decide how things look. A toggle remembers on/off. One page wants a lamp, another wants a door. The solution is to receive a **function** from the caller and call it:

```jsx
function Toggle({ initial = false, children }) {
  const [on, setOn] = useState(initial);
  return children({ on, toggle: () => setOn(!on) });
}

<Toggle>
  {({ on, toggle }) => <button onClick={toggle}>{on ? "ON" : "OFF"}</button>}
</Toggle>
```

Read it slowly. Whatever you put between `<Toggle>` and `</Toggle>` becomes the `children` prop. Here it is not JSX but an **arrow function**. `Toggle` calls it with an object and returns the result as its own output. The arrow function uses **destructuring** (`({ on, toggle })`) to pick the two values out. Any prop could hold the function (`render={...}` is also common), but `children` is the popular choice.

Today most people reach for a **custom hook** (`useToggle`) for this job, and hooks are usually simpler. Render props still shine when the function must be placed inside the JSX, and you will meet them in older code and in libraries.

> **Watch out:**
> - `Element type is invalid: expected a string ... but got: undefined`: you wrote `<Tabs.Tab>` but forgot to attach `Tabs.Tab = Tab`, or you misspelled the name.
> - `children is not a function`: you used `<Toggle>` with normal JSX inside, but `Toggle` calls its children as a function.
> - `Cannot destructure property 'active' of ... as it is null`: a `Tab` is outside `<Tabs>` so there is no Provider. The helper hook with a clear error message prevents this puzzle.
> - A panel that stays empty or a button that does nothing: check that `Panel` compares the same `value` strings that the `Tab` buttons use (`"billing"` is not `"Billing"`). To draw nothing, write `return null;`.

> **Your turn:** write `Tab` (a button with `role="tab"`, `aria-selected` and a click handler that selects it), `Panel` (renders only when it is the active one) and `Toggle` (keeps state and calls `children({ on, toggle })`). The page should show the billing panel, a light that is on and a closed door.
