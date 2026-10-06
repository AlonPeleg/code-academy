---
title: Keys and state identity
summary: Understand how React decides which component is "the same one" between renders, why index keys break lists, and how a key can reset state on purpose.
level: advanced
runner: react
files:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';

      // Counts how many Row components have ever been created. We use it to see
      // whether React kept a row alive (same number) or built a new one.
      let created = 0;

      // ---------- Part 1: a key can reset state on purpose ----------
      function Draft({ user }) {
        // The argument of useState is used only the FIRST time this Draft is created.
        const [text, setText] = useState("Hello " + user);
        return (
          <div>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <p>Draft: {text}</p>
          </div>
        );
      }

      function Part1() {
        const [user, setUser] = useState("Ada");

        // The user changes to Grace after 20 ms.
        useEffect(() => {
          const timer = setTimeout(() => setUser("Grace"), 20);
          return () => clearTimeout(timer);
        }, []);

        // 1. Right now the page still shows "Hello Ada" after the user changed: the same Draft is reused.
        //    Add a key attribute to <Draft> that is different for every user, so React builds a fresh Draft.
        return <Draft user={user} />;
      }

      // ---------- Part 2: stable keys in a list ----------
      function Row({ name }) {
        // Runs once per created Row: remember the creation number.
        const [serial] = useState(() => {
          created += 1;
          return created;
        });
        return <li>{name} #{serial}</li>;
      }

      function Part2() {
        const [people, setPeople] = useState([
          { id: 1, name: "Ada" },
          { id: 2, name: "Grace" },
          { id: 3, name: "Linus" },
        ]);

        // Ada is removed from the list after 20 ms.
        useEffect(() => {
          const timer = setTimeout(() => setPeople((list) => list.filter((p) => p.id !== 1)), 20);
          return () => clearTimeout(timer);
        }, []);

        // 2. The keys below are the positions in the list. After Ada leaves, Grace is "row 0" and
        //    inherits Ada's old Row (and its number). Use the unique id of each person as the key instead.
        return (
          <ul>
            {people.map((p, index) => (
              <Row key={index} name={p.name} />
            ))}
          </ul>
        );
      }

      function App() {
        return (
          <div>
            <h2>Part 1</h2>
            <Part1 />
            <h2>Part 2</h2>
            <Part2 />
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["input", "li"]
    text: ["Draft: Hello Grace", "Grace #2", "Linus #3"]
  code:
    - pattern: "<Draft[^>]*\\bkey\\s*=\\s*\\{\\s*user\\s*\\}"
      message: "Give Draft a key that changes with the user:  <Draft key={user} user={user} />"
    - pattern: "key\\s*=\\s*\\{\\s*\\w+\\.id\\s*\\}"
      message: "Use the id of each person as the key in the list:  key={p.id}"
hints:
  - "React matches components between two renders by their position and type. If the same component sits in the same spot, its state is kept. A key is a name tag: when the key changes React throws the old component away and builds a new one, and in a list the key says which item is which, even when items move or disappear."
  - "Part 1: put key={user} on <Draft>. Part 2: the list items are people with an id field; use that id (p.id) as the key on <Row> instead of the index."
  - "<Draft key={user} user={user} />   and   {people.map((p) => (<Row key={p.id} name={p.name} />))}"
solution:
  - name: App.jsx
    code: |
      import { useState, useEffect } from 'react';

      let created = 0;

      function Draft({ user }) {
        const [text, setText] = useState("Hello " + user);
        return (
          <div>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <p>Draft: {text}</p>
          </div>
        );
      }

      function Part1() {
        const [user, setUser] = useState("Ada");

        useEffect(() => {
          const timer = setTimeout(() => setUser("Grace"), 20);
          return () => clearTimeout(timer);
        }, []);

        return <Draft key={user} user={user} />;
      }

      function Row({ name }) {
        const [serial] = useState(() => {
          created += 1;
          return created;
        });
        return <li>{name} #{serial}</li>;
      }

      function Part2() {
        const [people, setPeople] = useState([
          { id: 1, name: "Ada" },
          { id: 2, name: "Grace" },
          { id: 3, name: "Linus" },
        ]);

        useEffect(() => {
          const timer = setTimeout(() => setPeople((list) => list.filter((p) => p.id !== 1)), 20);
          return () => clearTimeout(timer);
        }, []);

        return (
          <ul>
            {people.map((p) => (
              <Row key={p.id} name={p.name} />
            ))}
          </ul>
        );
      }

      function App() {
        return (
          <div>
            <h2>Part 1</h2>
            <Part1 />
            <h2>Part 2</h2>
            <Part2 />
          </div>
        );
      }

      export default App;
quiz:
  - q: How does React decide that a component on the new render is "the same one" as before?
    options: ["By comparing the props with ===", "By its position in the tree, its type and its key", "By the name of the function"]
    answer: 1
  - q: What happens to a component's state when its key changes?
    options: ["The state is kept, only the props update", "The state is copied to the new key", "React removes the old component and creates a new one, so the state starts fresh"]
    answer: 2
    explain: "That is why key={userId} is the clean way to reset a form when you switch to another user."
  - q: Why can key={index} cause bugs in a list where items can be removed or reordered?
    options: ["The index is a string, which React rejects", "After the change an item gets a different index, so React attaches the old item's state to the wrong item", "Index keys make the list render twice"]
    answer: 1
  - q: Which makes the worst key?
    options: ["A database id", "A unique username", "A random value created during render, such as Math.random()"]
    answer: 2
    explain: "A key that changes every render makes React destroy and rebuild every item every time: slow, and it loses focus and typed text."
---

Every React beginner learns "put a `key` on list items or React complains". Most people stop there. But `key` is really about **identity**: how React knows that the thing it draws now is the same thing it drew a moment ago. Once you understand that, a whole group of strange bugs (text in the wrong box, state that sticks around, inputs that lose focus) stops being mysterious, and you get a handy tool: resetting state on purpose.

## How React matches things up

After every state change React renders your component tree again and then compares the new result with the previous one. For each spot it asks: is it the **same type** of component, in the **same position**, with the **same key**? If yes, React keeps the existing component and its **state** and only updates the props. If not, it throws the old one away (state included) and creates a fresh one.

That has a surprising consequence for `Part1` in the exercise. `useState("Hello " + user)` only uses its argument the first time. When `user` changes from Ada to Grace, the `Draft` is the same type in the same place, so React **keeps** it, together with its old text. The page keeps showing "Hello Ada" next to a Grace.

## Keys as identity tags

A key is a name tag you put on an element:

```jsx
<Draft key={user} user={user} />
```

When the key changes from `"Ada"` to `"Grace"`, React decides "that is a different component", unmounts the old one and mounts a new one. Its state starts again from the initial value, which is what we wanted. This is the standard way to reset a component when something it depends on changes, such as `key={userId}` on an edit form. (`key` is special: it is used by React itself and is **not** passed down, so the component cannot read `props.key`.)

## Keys in lists

In a list the key says which item is which, even when items are added, removed or reordered:

```jsx
{people.map((p) => <Row key={p.id} name={p.name} />)}
```

The key must be **unique among siblings** and **stable**: the same item always gets the same key. A database id, a username or a counter you assigned when creating the item are good keys.

Why not the index? With `key={index}` the key describes the **position**, not the item. Remove the first person and the old second row now has index 0. React sees "key 0 is still here" and keeps that row's component and state, just giving it new props. In the exercise each `Row` remembers a creation number. With index keys, Grace inherits Ada's number `#1`. With real ids, Grace keeps her own `#2`, exactly as you would hope. In a real app the leftover state could be a half-typed note, a checked box or a scroll position that ends up attached to the wrong person.

Index keys are fine only when the list is **static**: it is never reordered, filtered or edited in the middle, and the items have no state of their own.

> **Watch out:**
> - `Warning: Each child in a list should have a unique "key" prop`: you forgot the key, or put it on an inner element instead of the element returned by `map`.
> - `Warning: Encountered two children with the same key`: your keys are not unique, for example the same name twice.
> - `key={Math.random()}` or `key={Date.now()}` in render: the key changes every render, so every item is destroyed and rebuilt each time. Inputs lose focus after each keystroke.
> - Trying to read `props.key` inside the component: it is always `undefined`. Pass the value again under another name if you need it.

## Going further

Add a Reverse button to `Part2` that calls `setPeople([...people].reverse())`. With `key={p.id}` each row keeps its number while it moves; with `key={index}` the numbers stay in place and the names move.

> **Your turn:** in `Part1` add a key to `Draft` so that it starts fresh for each user. In `Part2` use the id of each person as the key. The page should then show the draft for Grace, and the rows `Grace #2` and `Linus #3`.
