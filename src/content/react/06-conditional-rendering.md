---
title: Conditional rendering
summary: Show different things depending on a value, using ternaries and &&.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        const [loggedIn, setLoggedIn] = useState(false);
        const unread = 3;

        // 1. Show Welcome back! when loggedIn is true, otherwise show Please log in (use a ternary).
        // 2. The button label must be Log out when logged in, otherwise Log in (ternary again).
        // 3. Show a paragraph "You have 3 unread messages" only when unread is above zero.

        return (
          <div>
            <p></p>
            <button onClick={() => setLoggedIn(!loggedIn)}></button>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["button"]
    text: ["Please log in", "Log in", "You have 3 unread messages"]
  code:
    - pattern: "loggedIn\\s*\\?"
      message: "Use a ternary on loggedIn:  loggedIn ? ... : ..."
    - pattern: "unread\\s*>\\s*0\\s*&&"
      message: "Show the messages line with &&:  unread > 0 && ..."
hints:
  - "A ternary has three parts: a condition, a question mark with the result for true, a colon, and the result for false. It can be used inside curly braces in JSX. For the third task a different operator shows something only when a condition is true."
  - "Inside the paragraph and the button, use curly braces with loggedIn ? (text for true) : (text for false). Below, write {unread > 0 && <p>...</p>} so the paragraph only exists when there are messages."
  - "<p>{loggedIn ? \"Welcome back!\" : \"Please log in\"}</p>  <button ...>{loggedIn ? \"Log out\" : \"Log in\"}</button>  {unread > 0 && <p>You have {unread} unread messages</p>}"
solution:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        const [loggedIn, setLoggedIn] = useState(false);
        const unread = 3;

        return (
          <div>
            <p>{loggedIn ? "Welcome back!" : "Please log in"}</p>
            <button onClick={() => setLoggedIn(!loggedIn)}>
              {loggedIn ? "Log out" : "Log in"}
            </button>
            {unread > 0 && <p>You have {unread} unread messages</p>}
          </div>
        );
      }

      export default App;
quiz:
  - q: How do you choose between two things inside JSX?
    options: ["An if statement inside the braces", "A ternary:  condition ? a : b", "A for loop"]
    answer: 1
  - q: What does  {isAdmin && <AdminPanel />}  do?
    options: ["Shows AdminPanel only when isAdmin is true", "Always shows AdminPanel", "Shows AdminPanel when isAdmin is false"]
    answer: 0
  - q: What is shown by  {0 && <p>Hi</p>}  ?
    options: ["Nothing", "The paragraph", "The number 0"]
    answer: 2
    explain: "&& returns the left side when it is falsy, and React prints the number 0. Compare with a boolean, like count > 0 &&."
  - q: What does a component show if it returns null?
    options: ["The word null", "Nothing at all", "An error"]
    answer: 1
---

Interfaces change: a menu is open or closed, a user is signed in or out, a list is empty or has items. **Conditional rendering** means choosing what to show based on a value. React has no special syntax for it. You simply use normal JavaScript.

## Why not an if inside JSX?

Curly braces in JSX accept **expressions** (things that produce a value). An `if` statement does not produce a value, so you cannot write it inside the markup. There are two ways around it.

### 1. Decide before the return

```jsx
function Status({ online }) {
  if (online) {
    return <p>Online</p>;
  }
  return <p>Offline</p>;
}
```

Perfect when whole chunks differ. A component may even `return null;` to show nothing at all.

### 2. The ternary operator

For a small choice in the middle of the markup, use the ternary `condition ? ifTrue : ifFalse`, which **is** an expression:

```jsx
<p>{loggedIn ? "Welcome back!" : "Please log in"}</p>
```

Read it aloud: "is loggedIn true? then show Welcome back!, otherwise show Please log in". Each side can also be an element: `{loggedIn ? <Dashboard /> : <LoginForm />}`.

### 3. The && operator for "show or nothing"

When there is no "else" part, use `&&`. If the left side is true, JavaScript gives you the right side. If it is false, you get the false and React renders nothing:

```jsx
{unread > 0 && <p>You have {unread} unread messages</p>}
```

## Changing the condition with state

Combined with state from the last lesson, the view updates on its own:

```jsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(!open)}>
  {open ? "Hide" : "Show"} details
</button>
{open && <p>Here are the details.</p>}
```

`!open` means "not open": it flips `true` to `false` and back. Click the button in the preview to see the logic work.

> **Watch out:**
> - The number zero: `{items.length && <List />}` shows a literal `0` when the list is empty, because `0 && x` is `0`. Compare explicitly: `items.length > 0 && <List />`.
> - `Unexpected token` when you write `{if (x) ...}` in JSX. Use a ternary or `&&` there, or decide above the `return`.
> - Forgetting the colon part of a ternary: `{x ? "a"}` is a syntax error. If you only have a true branch, use `&&`.
> - Text inside the branches needs quotes: `loggedIn ? Welcome : Bye` refers to variables called `Welcome` and `Bye`.

> **Your turn:** fill the paragraph and button with ternaries on `loggedIn`, and show the unread-messages line with `&&`. The starting page should say `Please log in`, have a `Log in` button, and show `You have 3 unread messages`.
