---
title: Rendering lists
summary: Turn an array into elements with map.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      function App() {
        const languages = ["HTML", "CSS", "JavaScript"];
        const courses = [
          { id: 1, title: "Intro to Python", hours: 10 },
          { id: 2, title: "Web Basics", hours: 6 },
        ];

        // 1. Render a ul with one li for each language.
        // 2. Render an ol with one li for each course, written like: Web Basics (6h)
        // Every li needs its own key. Use map to build the items.
        return (
          <div>
            <ul></ul>
            <ol></ol>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["ul > li", "ol > li"]
    text: ["HTML", "CSS", "JavaScript", "Intro to Python (10h)", "Web Basics (6h)"]
  code:
    - pattern: "\\.map\\s*\\("
      message: "Use  languages.map(...)  to create the items."
    - pattern: "key\\s*=\\s*\\{"
      message: "Give each li a key prop:  key={...}"
    - pattern: "key\\s*=\\s*\\{\\s*\\w+\\.id\\s*\\}"
      message: "For the courses, use the id as the key:  key={course.id}"
hints:
  - "To show an array, map over it. Map turns each item into an element, and you place the result inside curly braces between the list's tags. Each element needs a key."
  - "For the languages the text itself is unique, so it can be the key. For the courses, each object has an id, which is the best key. Write the title and hours inside the li with curly braces."
  - "{languages.map((lang) => <li key={lang}>{lang}</li>)}   and   {courses.map((course) => <li key={course.id}>{course.title} ({course.hours}h)</li>)}"
solution:
  - name: App.jsx
    code: |
      function App() {
        const languages = ["HTML", "CSS", "JavaScript"];
        const courses = [
          { id: 1, title: "Intro to Python", hours: 10 },
          { id: 2, title: "Web Basics", hours: 6 },
        ];

        return (
          <div>
            <ul>
              {languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
            <ol>
              {courses.map((course) => (
                <li key={course.id}>
                  {course.title} ({course.hours}h)
                </li>
              ))}
            </ol>
          </div>
        );
      }

      export default App;
quiz:
  - q: Which array method turns each item into an element?
    options: ["push", "length", "map"]
    answer: 2
  - q: What is the key prop for?
    options: ["It helps React track which item is which", "It sets the keyboard shortcut", "It encrypts the data"]
    answer: 0
  - q: A good key is...
    options: ["A random number created on every render", "A stable, unique value like an id", "The same for every item"]
    answer: 1
  - q: Where does the key go?
    options: ["On the list container, for example the ul", "On the outermost element returned inside map", "In the CSS file"]
    answer: 1
    explain: "The key belongs on the element that map returns for each item, not on the container."
---

Almost every app shows lists: messages, products, search results. In React you do not write the items by hand. You keep the data in an **array** and let JavaScript turn each item into an element.

## map: from data to elements

The array method `map` runs a function on every item and collects the results into a new array. React knows how to display an array of elements:

```jsx
const names = ["Ava", "Noam"];

<ul>
  {names.map((name) => (
    <li key={name}>{name}</li>
  ))}
</ul>
```

Reading it step by step:

1. `names.map(...)` goes through the array. For `"Ava"` the arrow function receives `name = "Ava"`.
2. The arrow function returns `<li key={name}>{name}</li>`, one element per item.
3. The whole thing sits inside curly braces, because it is JavaScript inside JSX.
4. If the array has 100 items you get 100 list items, and if the data changes the list updates.

## Lists of objects

Real data is usually objects, so you read their properties inside the function:

```jsx
const courses = [
  { id: 1, title: "Intro to Python", hours: 10 },
  { id: 2, title: "Web Basics", hours: 6 },
];

<ol>
  {courses.map((course) => (
    <li key={course.id}>
      {course.title} ({course.hours}h)
    </li>
  ))}
</ol>
```

This displays `Intro to Python (10h)` and `Web Basics (6h)`.

## Why keys?

Every item in a list needs a **`key`** prop: a value that is unique among its siblings and does not change. When the list changes (an item is added, removed or moved) React compares the old and new keys to work out what happened, so it can update only what is needed and keep things like typed text attached to the right row.

- Best: an `id` that comes with your data.
- Acceptable for fixed lists of unique text: the text itself.
- Avoid: the array index (`key={index}`) when items can be reordered or removed, and never use `Math.random()`, since it produces a new key every render.

The key goes on the outermost element inside `map`, and it is not passed to your component as a prop.

> **Watch out:**
> - `Warning: Each child in a list should have a unique "key" prop`: add `key={...}` to the element that `map` returns.
> - Using `{ }` braces for the arrow function body without a `return`: `(x) => { <li>{x}</li> }` returns nothing. Use parentheses `(x) => ( <li>...</li> )` or add `return`.
> - Putting the key on the container `ul` instead of on each `li`.
> - `Objects are not valid as a React child`: you printed a whole object like `{course}`. Print its properties.

> **Your turn:** render the three languages in the `<ul>` and the two courses in the `<ol>` (as `Title (Nh)`), each with a proper `key`.
