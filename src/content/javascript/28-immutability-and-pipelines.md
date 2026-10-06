---
title: Immutability and functional pipelines
summary: Stop changing data in place, freeze objects, update state by copying, share unchanged parts, and build data transformations with reduce.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      // 1. deepFreeze(value): freeze the object AND everything nested inside it.
      //    Recursion hint: for each value of the object, call deepFreeze on it too.
      function deepFreeze(value) {
        return value;
      }

      const state = deepFreeze({
        user: { name: "Ada" },
        todos: [
          { id: 1, text: "write", done: false },
          { id: 2, text: "test", done: false },
        ],
      });
      console.log(Object.isFrozen(state.user));
      try {
        state.user.name = "Bob"; // must NOT change anything (in strict code it throws)
      } catch (error) {
        // ignore the TypeError
      }
      console.log(state.user.name);

      // 2. Write two "pure update" functions. They must NOT change the state they receive:
      //    they return a NEW state object.
      //    toggle(state, id): flips done for the todo with that id.
      //    addTodo(state, text): adds { id: <next number>, text, done: false } at the end.
      //    Share everything that did not change (do not copy the whole thing).
      function toggle(state, id) {
        return state;
      }
      function addTodo(state, text) {
        return state;
      }

      const s2 = toggle(state, 2);
      const s3 = addTodo(s2, "ship");
      const doneCount = (s) => s.todos.filter((t) => t.done).length;
      console.log(doneCount(state), doneCount(s2), s3.todos.length, state.todos.length);
      console.log(state === s2, state.user === s2.user);
      console.log(s2.todos[0] === state.todos[0], s2.todos[1] === state.todos[1]);

      // 3. groupBy(items, keyFn): use reduce to build an object whose keys come from keyFn(item)
      //    and whose values are arrays of the items. Do not push into an existing array:
      //    create a new object and a new array each step.
      function groupBy(items, keyFn) {
        return {};
      }
      const groups = groupBy(["fig", "kiwi", "pear", "plum", "egg"], (word) => word.length);
      console.log(JSON.stringify(groups));

      // 4. Print a SORTED COPY of nums (ascending, as text joined with commas),
      //    then " | ", then the original nums. The original must stay as it is.
      //    Use a method that returns a new array instead of changing the old one.
      const nums = [3, 1, 2];
      console.log("?");
check:
  output: |
    true
    Ada
    0 1 3 2
    false true
    true false
    {"3":["fig","egg"],"4":["kiwi","pear","plum"]}
    1,2,3 | 3,1,2
  code:
    - pattern: 'Object\.freeze\s*\('
      message: "Use Object.freeze(value) in deepFreeze."
    - pattern: 'deepFreeze\s*\(\s*\w+(\[\w+\]|\.\w+)'
      message: "deepFreeze should call itself for nested values."
    - pattern: '\.\.\.\s*(s|state)\b'
      message: "Copy the old state with spread: { ...state, ... }."
    - pattern: '\.reduce\s*\('
      message: "Build the groups with reduce."
    - pattern: '\.toSorted\s*\('
      message: "Use toSorted, which returns a sorted copy."
hints:
  - "Immutable code never changes the data it receives; it builds new data. Spread ({ ...obj } and [...list]) copies one level, map builds a new array and returns the same old item for entries that did not change."
  - "deepFreeze: Object.freeze(value), then loop over Object.values(value) and call deepFreeze on each object. toggle: return { ...state, todos: state.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }. addTodo: return { ...state, todos: [...state.todos, { id: state.todos.length + 1, text, done: false }] }."
  - "groupBy: return items.reduce((acc, item) => { const key = keyFn(item); return { ...acc, [key]: [...(acc[key] ?? []), item] }; }, {});   and: console.log(nums.toSorted((a, b) => a - b).join(\",\") + \" | \" + nums.join(\",\"));"
solution:
  - name: main.js
    code: |
      function deepFreeze(value) {
        if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
          Object.freeze(value);
          for (const key of Object.keys(value)) {
            deepFreeze(value[key]);
          }
        }
        return value;
      }

      const state = deepFreeze({
        user: { name: "Ada" },
        todos: [
          { id: 1, text: "write", done: false },
          { id: 2, text: "test", done: false },
        ],
      });
      console.log(Object.isFrozen(state.user));
      try {
        state.user.name = "Bob";
      } catch (error) {
        // ignore the TypeError
      }
      console.log(state.user.name);

      function toggle(state, id) {
        return {
          ...state,
          todos: state.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        };
      }
      function addTodo(state, text) {
        return {
          ...state,
          todos: [...state.todos, { id: state.todos.length + 1, text, done: false }],
        };
      }

      const s2 = toggle(state, 2);
      const s3 = addTodo(s2, "ship");
      const doneCount = (s) => s.todos.filter((t) => t.done).length;
      console.log(doneCount(state), doneCount(s2), s3.todos.length, state.todos.length);
      console.log(state === s2, state.user === s2.user);
      console.log(s2.todos[0] === state.todos[0], s2.todos[1] === state.todos[1]);

      function groupBy(items, keyFn) {
        return items.reduce((acc, item) => {
          const key = keyFn(item);
          return { ...acc, [key]: [...(acc[key] ?? []), item] };
        }, {});
      }
      const groups = groupBy(["fig", "kiwi", "pear", "plum", "egg"], (word) => word.length);
      console.log(JSON.stringify(groups));

      const nums = [3, 1, 2];
      console.log(nums.toSorted((a, b) => a - b).join(",") + " | " + nums.join(","));
quiz:
  - q: What does it mean to treat data as immutable?
    options: ["Never create new variables", "Use only constants for numbers", "Never change existing data in place, always produce a new value instead"]
    answer: 2
  - q: "Does  Object.freeze(obj)  also freeze objects nested inside obj?"
    options: ["Yes, always", "No, it is shallow: only the first level is frozen", "Only arrays inside it"]
    answer: 1
    explain: That is why the lesson writes deepFreeze, which calls itself for every nested object.
  - q: Why does the lesson's toggle() return the same object for todos that did not change?
    options: ["Unchanged parts can be shared safely because nobody mutates them, which is cheap and makes change detection easy", "It is a mistake that should be avoided", "Because map cannot copy objects"]
    answer: 0
  - q: "Which of these changes the original array?"
    options: ["arr.sort()", "arr.toSorted()", "arr.map(fn)"]
    answer: 0
    explain: sort, reverse, splice and push mutate. toSorted, toReversed, toSpliced, with, map, filter and slice return new arrays.
---

Most bugs in bigger programs come from data that **changed when you did not expect it**. A function receives an array, sorts it, and suddenly the list on the screen is in a different order. **Immutability** is the habit of never changing data in place. Instead of modifying a value, you create a new, updated one and leave the old one alone. It is the idea behind React state, Redux and many other tools.

## Mutation: the problem

```js
const a = { count: 1 };
const b = a;      // not a copy: both names point to the same object
b.count = 2;
console.log(a.count); // prints: 2 (surprise!)
```

Objects and arrays are shared by reference, so any function that changes its argument also changes the caller's data. Methods like `push`, `sort`, `reverse` and `splice` all **mutate** their array.

## Freezing

`Object.freeze(obj)` makes an object read-only: adding, changing or deleting properties is refused. In strict code (and in modules) the refusal is a `TypeError: Cannot assign to read only property 'name' of object`; in sloppy code it is silently ignored. Check with `Object.isFrozen(obj)`.

```js
const settings = Object.freeze({ theme: "dark" });
settings.theme = "light"; // ignored or TypeError, depending on strictness
```

Freeze is **shallow**: nested objects stay changeable. To protect a whole tree you write `deepFreeze`, a small recursive function (you used recursion in an earlier lesson): freeze the object, then call `deepFreeze` on each nested value. Freezing is mostly a safety net while developing; the real technique is the next one.

## Copy-on-write updates

To "change" immutable data you build a new object that is the old one plus your change. Spread syntax does the copying:

```js
const user = { name: "Ada", city: "London" };
const moved = { ...user, city: "Paris" };   // new object, user untouched

const list = [1, 2, 3];
const longer = [...list, 4];                // add
const without = list.filter((x) => x !== 2); // remove
const doubled = list.map((x) => x * 2);      // change all
```

For nested data you copy every level on the path to the change and **reuse everything else**. This is called **structural sharing**:

```js
const next = {
  ...state,
  todos: state.todos.map((t) => (t.id === 2 ? { ...t, done: true } : t)),
};
```

`next` is a new object and `next.todos` a new array, and the todo with id 2 is a new object. But `next.user` is the very same object as `state.user`, and so is the todo with id 1. Nothing was copied needlessly, and a check like `next.user === state.user` tells you cheaply that nothing changed there. That is exactly how React knows what needs re-rendering.

## Non-mutating array methods

Modern JavaScript added copying twins of the old mutating methods: `toSorted`, `toReversed`, `toSpliced` and `with(index, value)`. Together with `map`, `filter`, `slice` and `concat` you can do almost everything without mutation.

## Pipelines and reduce

`reduce` folds a list into one value. If the accumulator is always a **new** object, the whole transformation stays pure:

```js
const total = [2, 4, 6].reduce((sum, n) => sum + n, 0); // 12
```

You can chain such steps (`filter`, `map`, `reduce`) into a **pipeline**: data flows in at the top and a result flows out, with no variable changed on the way. Each step is easy to read, test and reorder.

A word on cost: copying a big array on every change is slower than mutating it. For most apps this does not matter, and structural sharing keeps it cheap. Measure before you worry, and use mutation inside a function when the data is local and never escapes.

> **Watch out:**
> - Believing `const` makes data immutable. It only stops you from reassigning the name: `const list = []; list.push(1)` works.
> - `{ ...state }` is a shallow copy. Changing `copy.user.name` still changes `state.user.name` because the nested object is shared.
> - `const sorted = list.sort()` sorts `list` itself and returns the same array. Use `toSorted()` or `[...list].sort()`.
> - Forgetting the `else` side in `map`: `t.id === id ? { ...t, done: true }` alone gives `undefined` for the others. Return `t` for unchanged items.
> - Treating `TypeError: Cannot assign to read only property` as a bug in `freeze`. It is the freeze doing its job: find the line that mutates and replace it with a copy.
> - `JSON.parse(JSON.stringify(x))` as a deep copy loses `undefined`, dates and Maps. Prefer `structuredClone`.

## Going further

Write `removeTodo(state, id)` and `rename(state, name)` in the same style. Then compute the total price of an order with `filter`, `map` and `reduce` in one chained expression and make sure the original array is unchanged.

> **Your turn:** implement `deepFreeze`, `toggle`, `addTodo` and `groupBy`, and print the sorted copy with `toSorted`. The seven output lines are listed in the check.
