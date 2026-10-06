---
title: Children and composition
summary: Build bigger components by putting components inside each other.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      // 1. Card should show whatever is placed between <Card> and </Card>.
      // 2. Add a third Card in App with the title Hobbies that contains a paragraph: Chess
      function Card({ title, children }) {
        return (
          <div className="card">
            <h3>{title}</h3>
          </div>
        );
      }

      function App() {
        return (
          <div>
            <Card title="Profile">
              <p>Name: Ava</p>
            </Card>
            <Card title="Tips">
              <p>Drink water</p>
              <p>Sleep well</p>
            </Card>
          </div>
        );
      }

      export default App;
  - name: styles.css
    code: |
      .card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 10px;
        max-width: 260px;
      }
      .card h3 {
        margin: 0 0 6px;
      }
check:
  dom:
    selectors: [".card h3", ".card p"]
    text: ["Profile", "Name: Ava", "Drink water", "Sleep well", "Hobbies", "Chess"]
  code:
    - pattern: "\\{\\s*children\\s*\\}"
      message: "Show the children inside Card with  {children}"
    - pattern: "<Card\\s+title\\s*=\\s*[\"']Hobbies[\"']"
      message: "Add a third Card:  <Card title=\"Hobbies\"> ... </Card>"
hints:
  - "Whatever you write between a component's opening and closing tags arrives as a special prop called children. Card already receives it, but never uses it."
  - "Inside the card div, below the h3, print the children prop with curly braces. Then copy one Card in App, change the title, and put a paragraph inside it."
  - "Add {children} under the h3 in Card, and in App:  <Card title=\"Hobbies\"><p>Chess</p></Card>"
solution:
  - name: App.jsx
    code: |
      function Card({ title, children }) {
        return (
          <div className="card">
            <h3>{title}</h3>
            {children}
          </div>
        );
      }

      function App() {
        return (
          <div>
            <Card title="Profile">
              <p>Name: Ava</p>
            </Card>
            <Card title="Tips">
              <p>Drink water</p>
              <p>Sleep well</p>
            </Card>
            <Card title="Hobbies">
              <p>Chess</p>
            </Card>
          </div>
        );
      }

      export default App;
  - name: styles.css
    code: |
      .card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 10px;
        max-width: 260px;
      }
      .card h3 {
        margin: 0 0 6px;
      }
quiz:
  - q: What is the special prop called children?
    options: ["The components defined after this one", "Whatever is written between the opening and closing tags", "A list of child functions"]
    answer: 1
  - q: Why is composition useful?
    options: ["It makes the page load faster", "It is required by JSX", "One wrapper component can be reused around different content"]
    answer: 2
  - q: What happens if Card never prints {children}?
    options: ["React shows an error", "The content between the tags is silently not shown", "The content is shown below the card"]
    answer: 1
  - q: Which is the correct way to use a wrapper component?
    options: ["<Card title=\"A\"><p>Hi</p></Card>", "<Card title=\"A\" /><p>Hi</p>", "Card(\"A\", <p>Hi</p>)"]
    answer: 0
---

So far every component has been a leaf: it shows its own markup and nothing else. Real interfaces are built by **composition**, which means putting components inside other components, just as HTML puts elements inside elements.

## Components inside components

A component can use other components in its markup:

```jsx
function Avatar() {
  return <span>:-)</span>;
}

function Header() {
  return (
    <header>
      <Avatar />
      <h1>My site</h1>
    </header>
  );
}
```

Think of the component tree like a family: `App` contains `Header`, which contains `Avatar`. Data flows down the tree through props.

## The children prop

Sometimes a component is a **wrapper**: a frame, card or panel whose content is decided by whoever uses it. For this, React gives every component a special prop called **`children`**. It holds whatever you write between the opening and the closing tag:

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function App() {
  return (
    <Card title="Tips">
      <p>Drink water</p>
      <p>Sleep well</p>
    </Card>
  );
}
```

Follow the data:

1. `App` writes two paragraphs between `<Card>` and `</Card>`.
2. React hands them to `Card` as `children`.
3. `Card` decides **where** they go by printing `{children}`. Here that is under the title.

The children can be text, elements, other components, or a mix. If `Card` forgets to print `{children}`, the content simply never appears and there is no error, which makes this a classic head-scratcher.

## Why this matters

Composition keeps the frame and the content separate. You write the border, padding and title style of a card once, and then reuse it everywhere with different insides. You will see the same trick in layouts, modals, buttons with icons, and nearly every UI library.

> **Watch out:**
> - Content missing from a wrapper: the component receives `children` but never prints `{children}`.
> - Writing `<Card title="A" />` with a self-closing slash and then putting content after it. The content must be **between** the tags, so use `<Card title="A"> ... </Card>`.
> - Forgetting the curly braces and writing `children` in the markup: React would show the literal word.
> - Rendering several wrapper children without a parent is fine, because `children` can hold many elements at once.

> **Your turn:** make `Card` show its `{children}`, then add a third card titled `Hobbies` containing the paragraph `Chess`.
