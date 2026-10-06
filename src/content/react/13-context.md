---
title: Context for shared state
summary: Share a value with every component below a provider without passing props through each layer.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { createContext, useContext, useState } from 'react';

      // The two contexts are ready. 'light' and null are only the DEFAULT values,
      // used when no Provider is found above a component.
      const ThemeContext = createContext('light');
      const UserContext = createContext(null);

      function ThemeLabel() {
        // 1. Read the theme from ThemeContext with useContext (replace the "light" below).
        const theme = "light";
        return <p>Theme: {theme}</p>;
      }

      function Greeting() {
        // 2. Read the user object from UserContext. It looks like { name: "Ada" }.
        const user = null;
        return <p>Hello, {user ? user.name : "stranger"}!</p>;
      }

      // Notice: Toolbar and Page never receive theme or user as props.
      function Toolbar() {
        return (
          <div>
            <ThemeLabel />
            <Greeting />
          </div>
        );
      }

      function Page() {
        return <Toolbar />;
      }

      function App() {
        const [theme, setTheme] = useState("dark");
        const user = { name: "Ada" };

        // 3. Wrap <Page /> in a ThemeContext Provider whose value is theme,
        //    and inside it a UserContext Provider whose value is user.
        return (
          <div>
            <Page />
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              Switch theme
            </button>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text: ["Theme: dark", "Hello, Ada!"]
  code:
    - pattern: "useContext\\s*\\(\\s*ThemeContext\\s*\\)"
      message: "Read the theme with  useContext(ThemeContext)."
    - pattern: "useContext\\s*\\(\\s*UserContext\\s*\\)"
      message: "Read the user with  useContext(UserContext)."
    - pattern: "<ThemeContext\\.Provider\\s+value\\s*=\\s*\\{\\s*theme\\s*\\}"
      message: "Wrap the page:  <ThemeContext.Provider value={theme}> ... </ThemeContext.Provider>"
    - pattern: "<UserContext\\.Provider\\s+value\\s*=\\s*\\{\\s*user\\s*\\}"
      message: "Also wrap it in  <UserContext.Provider value={user}>."
hints:
  - "Context has two sides. A Provider high in the tree puts a value on the 'shelf', and any component below it can take the value with useContext, no matter how deep it is."
  - "In ThemeLabel use const theme = useContext(ThemeContext); and in Greeting use useContext(UserContext). In App wrap <Page /> with <ThemeContext.Provider value={theme}> and, inside it, <UserContext.Provider value={user}>."
  - "<ThemeContext.Provider value={theme}><UserContext.Provider value={user}><Page /></UserContext.Provider></ThemeContext.Provider>   and   const theme = useContext(ThemeContext);   const user = useContext(UserContext);"
solution:
  - name: App.jsx
    code: |
      import { createContext, useContext, useState } from 'react';

      const ThemeContext = createContext('light');
      const UserContext = createContext(null);

      function ThemeLabel() {
        const theme = useContext(ThemeContext);
        return <p>Theme: {theme}</p>;
      }

      function Greeting() {
        const user = useContext(UserContext);
        return <p>Hello, {user ? user.name : "stranger"}!</p>;
      }

      function Toolbar() {
        return (
          <div>
            <ThemeLabel />
            <Greeting />
          </div>
        );
      }

      function Page() {
        return <Toolbar />;
      }

      function App() {
        const [theme, setTheme] = useState("dark");
        const user = { name: "Ada" };

        return (
          <ThemeContext.Provider value={theme}>
            <UserContext.Provider value={user}>
              <div>
                <Page />
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  Switch theme
                </button>
              </div>
            </UserContext.Provider>
          </ThemeContext.Provider>
        );
      }

      export default App;
quiz:
  - q: What problem does context solve?
    options: ["It makes components render faster", "Passing a value through many layers of components that do not use it (prop drilling)", "Storing data on a server"]
    answer: 1
  - q: Which hook reads the nearest value of a context?
    options: ["useState", "useEffect", "useContext"]
    answer: 2
  - q: What does a component receive from useContext when there is no Provider above it?
    options: ["The default value passed to createContext", "An error is thrown", "undefined always"]
    answer: 0
  - q: What happens to components that read a context when the Provider's value changes?
    options: ["Nothing until the page reloads", "They re-render with the new value", "Only the Provider re-renders"]
    answer: 1
    explain: "That is what makes context good for things like a theme or the logged-in user that many components show."
---

In the lesson on lifting state up you passed values down as props. That is fine for one or two levels, but imagine a theme setting that a tiny button, seven components deep, needs to know about. Passing `theme` through every component in between, even those that do not care, is called **prop drilling**, and it gets tiring. **Context** lets a component put a value somewhere high in the tree and lets any component below read it directly.

## The three steps

**1. Create the context.** Do this once, outside any component:

```jsx
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

The argument is the **default value**, used only when a component reads the context but no provider is above it.

**2. Provide a value.** Wrap part of your tree in the context's `Provider` and give it a `value`:

```jsx
<ThemeContext.Provider value="dark">
  <Page />
</ThemeContext.Provider>
```

Everything inside `<Page />`, however deep, can now see `"dark"`.

**3. Consume it.** Any component below calls `useContext`:

```jsx
import { useContext } from 'react';

function ThemeLabel() {
  const theme = useContext(ThemeContext);
  return <p>Theme: {theme}</p>;
}
// prints: Theme: dark
```

Think of a shelf: the provider puts something on it, and any descendant can reach up and take it. The components in the middle (`Page`, `Toolbar`) never touch it.

## Context plus state

A provider's `value` is usually state, so it can change over time. When it changes, React re-renders every component that reads that context:

```jsx
function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Switch</button>
    </ThemeContext.Provider>
  );
}
```

Click the button and every `ThemeLabel` updates, with no props involved. You can also pass an object that includes the setter, for example `value={{ theme, setTheme }}`, so deep components can change the value too.

## Several contexts

Keep contexts small and separate by topic: one for the theme, one for the current user, one for the language. Nest the providers. A component can call `useContext` as many times as it needs.

## A custom hook for tidy code

Real projects often hide the context behind a small hook, so components call `useTheme()` instead of `useContext(ThemeContext)`. We will look at custom hooks in the next lesson.

## When not to use context

Context is not a replacement for props. If only a parent and its child share a value, props are clearer and easier to follow. Reach for context for data that is truly **global-ish**: theme, logged-in user, language, a shopping cart. Also remember that every consumer re-renders when the value changes, so do not put rapidly changing values (like mouse position) into one big context.

> **Watch out:**
> - Forgetting the provider: `useContext` quietly returns the default value, so you see `Theme: light` or `stranger` instead of your real data. If the value is `null` by default, `user.name` crashes with `Cannot read properties of null (reading 'name')`.
> - Passing a new object literal as `value={{ a, b }}` on every render makes all consumers re-render each time the parent renders. Create it with `useMemo` if it matters.
> - Writing `<ThemeContext value=...>` instead of `<ThemeContext.Provider value=...>`: this academy uses React 18, where only `.Provider` works and the context is not provided.
> - Calling `useContext` outside of a component or a hook: `Invalid hook call`.

> **Your turn:** in `ThemeLabel` read the theme with `useContext(ThemeContext)`, in `Greeting` read the user with `useContext(UserContext)`, and wrap `<Page />` in both providers in `App`. The page should show `Theme: dark` and `Hello, Ada!`.
