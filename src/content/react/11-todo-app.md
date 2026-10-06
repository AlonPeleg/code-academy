---
title: "Mini project: a todo list"
summary: Combine state, lists, forms and conditional classes into a small app.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        const [todos, setTodos] = useState([
          { id: 1, text: "Learn JSX", done: true },
          { id: 2, text: "Learn state", done: false },
          { id: 3, text: "Build an app", done: false },
        ]);
        const [text, setText] = useState("");

        function addTodo(e) {
          e.preventDefault();
          if (text.trim() === "") return;
          setTodos([...todos, { id: Date.now(), text: text, done: false }]);
          setText("");
        }

        function toggleTodo(id) {
          setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
        }

        const remaining = todos.filter((t) => !t.done).length;

        // The logic above is finished. Build the screen:
        // 1. A heading (h1) that says: My todos
        // 2. A form with a controlled text input (state text) and a submit button, calling addTodo on submit.
        // 3. A ul with one li per todo, each with a key. Clicking an li calls toggleTodo with its id.
        //    A finished todo needs the CSS class done.
        // 4. A paragraph that says how many are left, like: 2 left
        return <div></div>;
      }

      export default App;
  - name: styles.css
    code: |
      ul {
        padding-left: 20px;
      }
      li {
        cursor: pointer;
        margin: 4px 0;
      }
      li.done {
        text-decoration: line-through;
        color: #888;
      }
check:
  dom:
    selectors: ["h1", "form input", "form button", "ul > li", "li.done"]
    text: ["My todos", "Learn JSX", "Learn state", "Build an app", "2 left"]
  code:
    - pattern: "\\.map\\s*\\(\\s*\\(?\\s*\\w+\\s*\\)?\\s*=>[\\s\\S]*key\\s*=\\s*\\{"
      message: "Render the list with todos.map(...) and give each li a key."
    - pattern: "onSubmit\\s*=\\s*\\{\\s*addTodo\\s*\\}"
      message: "Submit the form with  onSubmit={addTodo}"
    - pattern: "value\\s*=\\s*\\{\\s*text\\s*\\}"
      message: "Make the input controlled:  value={text}"
    - pattern: "onChange\\s*=\\s*\\{"
      message: "Update the text state with onChange."
    - pattern: "onClick\\s*=\\s*\\{[^}]*toggleTodo"
      message: "Clicking an li should call toggleTodo(todo.id)."
    - pattern: "className\\s*=\\s*\\{"
      message: "Choose the class with a ternary:  className={todo.done ? \"done\" : \"\"}"
hints:
  - "The state and the functions already exist. You only write the markup: a title, a form, a list made with map, and a count. Use todo.done to decide the class name."
  - "The form needs onSubmit={addTodo}, an input with value={text} and onChange={(e) => setText(e.target.value)}, and a button. For the list, map over todos and give each li a key, an onClick and a className."
  - "<li key={todo.id} onClick={() => toggleTodo(todo.id)} className={todo.done ? \"done\" : \"\"}>{todo.text}</li>   and   <p>{remaining} left</p>"
solution:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function App() {
        const [todos, setTodos] = useState([
          { id: 1, text: "Learn JSX", done: true },
          { id: 2, text: "Learn state", done: false },
          { id: 3, text: "Build an app", done: false },
        ]);
        const [text, setText] = useState("");

        function addTodo(e) {
          e.preventDefault();
          if (text.trim() === "") return;
          setTodos([...todos, { id: Date.now(), text: text, done: false }]);
          setText("");
        }

        function toggleTodo(id) {
          setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
        }

        const remaining = todos.filter((t) => !t.done).length;

        return (
          <div>
            <h1>My todos</h1>
            <form onSubmit={addTodo}>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What needs doing?"
              />
              <button type="submit">Add</button>
            </form>
            <ul>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={todo.done ? "done" : ""}
                >
                  {todo.text}
                </li>
              ))}
            </ul>
            <p>{remaining} left</p>
          </div>
        );
      }

      export default App;
  - name: styles.css
    code: |
      ul {
        padding-left: 20px;
      }
      li {
        cursor: pointer;
        margin: 4px 0;
      }
      li.done {
        text-decoration: line-through;
        color: #888;
      }
quiz:
  - q: Why does addTodo create a new array with [...todos, newItem] instead of using todos.push(newItem)?
    options: ["push is not allowed in JavaScript", "React only notices changes when you give the setter a new array", "The spread syntax is faster"]
    answer: 1
  - q: 'What does  todos.map((t) => t.id === id ? { ...t, done: !t.done } : t)  produce?'
    options: ["A new array where only the matching todo is replaced by a copy with done flipped", "The same array, changed in place", "A single todo"]
    answer: 0
  - q: How does the app know "2 left"?
    options: ["It stores a separate count in state", "It counts the clicks", "It calculates it from the todos array while rendering"]
    answer: 2
    explain: "Values that can be worked out from existing state do not need their own state. Calculate them when rendering."
  - q: Which parts of the app are examples of state?
    options: ["The list of todos and the text in the input", "The heading", "The CSS file"]
    answer: 0
---

Time to put everything together. A todo list uses almost every skill from this track: components, JSX, state, lists, forms, events and conditional styling. Building small projects like this is how React really sticks.

## Plan the data first

Before writing markup, decide what the app must remember. That is its **state**:

- `todos`: an array of objects like `{ id: 1, text: "Learn JSX", done: true }`.
- `text`: what the user has typed so far in the input box.

Everything else on the screen is derived from these two. For example, the number of unfinished todos is not stored separately. It is calculated while rendering:

```jsx
const remaining = todos.filter((t) => !t.done).length;
```

`filter` keeps only the items for which the function returns true, and `.length` counts them.

## Never change state in place

React only re-renders when the setter receives a **new** value. So we never write `todos.push(...)`. Instead we build new arrays:

```jsx
// add: copy all old items (...todos) and append a new one
setTodos([...todos, { id: Date.now(), text: text, done: false }]);

// toggle: copy the array with map, replace only the matching todo by a changed copy
setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
```

`{ ...t, done: !t.done }` copies all properties of the todo and then overrides `done` with its opposite. These two functions are already written for you in the starter code.

## Building the screen

The markup is a combination of earlier lessons:

```jsx
<form onSubmit={addTodo}>
  <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
  <button type="submit">Add</button>
</form>

<ul>
  {todos.map((todo) => (
    <li
      key={todo.id}
      onClick={() => toggleTodo(todo.id)}
      className={todo.done ? "done" : ""}
    >
      {todo.text}
    </li>
  ))}
</ul>
```

- The form with a controlled input is the lesson on events and forms.
- `todos.map` with a `key` is the lessons list lesson. Each item has a stable `id`.
- `className={todo.done ? "done" : ""}` is conditional rendering applied to a class. The CSS file draws a line through `li.done`.
- Clicking an `li` calls `toggleTodo` with that todo's id.

Try it in the preview: type a task and press Enter, then click a task to cross it out and watch the counter change.

## Ideas to extend it

- Add a "Delete" button to each row using `todos.filter((t) => t.id !== id)`.
- Show a friendly message when the list is empty with `todos.length === 0 && <p>Nothing to do!</p>`.
- Move the list item into its own `TodoItem` component that receives `todo` and `onToggle` as props.

> **Watch out:**
> - Typing in the box does nothing: the input needs both `value={text}` and `onChange`.
> - The page reloads when you press Enter: the form handler must call `e.preventDefault()` (it does, in `addTodo`).
> - `Each child in a list should have a unique "key" prop`: put `key={todo.id}` on the `li`.
> - Strikethrough never appears: the class name must be exactly `done`, matching the CSS rule `li.done`.

> **Your turn:** build the screen: an `h1` saying `My todos`, the form with a controlled input, the `ul` with a `li` per todo (class `done` when finished, click to toggle), and the paragraph `{remaining} left`.
