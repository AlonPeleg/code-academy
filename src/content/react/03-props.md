---
title: Props
summary: Pass data into a component.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      // 1. Make Greeting show its greeting and its name, like: Hello, Ava!
      // 2. If no greeting is passed, it should fall back to the word Hello.
      function Greeting({ name }) {
        return <p>Hello, !</p>;
      }

      function App() {
        return (
          <div>
            <Greeting name="Ava" />
            <Greeting name="Noam" greeting="Hi" />
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ["p"]
    text: ["Hello, Ava!", "Hi, Noam!"]
hints:
  - "Props are the inputs of a component. Inside the function you can unpack the ones you need in the parentheses, and a default value can be given with an equals sign."
  - "Change the parameter to { name, greeting = \"Hello\" } so greeting has a fallback, then print both values inside the paragraph using curly braces."
  - "function Greeting({ name, greeting = \"Hello\" }) { return <p>{greeting}, {name}!</p>; }"
solution:
  - name: App.jsx
    code: |
      function Greeting({ name, greeting = "Hello" }) {
        return <p>{greeting}, {name}!</p>;
      }

      function App() {
        return (
          <div>
            <Greeting name="Ava" />
            <Greeting name="Noam" greeting="Hi" />
          </div>
        );
      }

      export default App;
quiz:
  - q: How do you pass a value to a component?
    options: ["With a global variable only", "By editing the function name", "As an attribute: <Greeting name=\"Ava\" />"]
    answer: 2
  - q: Inside  function Greeting(props) , how do you read the name prop?
    options: ["props.name", "this.name()", "name.props"]
    answer: 0
  - q: How do you pass a number (not text) as a prop?
    options: ["<Box size=\"5\" />", "<Box size={5} />", "<Box size=5 />"]
    answer: 1
    explain: "Quotes always make a string. Curly braces pass a JavaScript value: a number, a boolean, an array, a variable."
  - q: Can a component change the props it receives?
    options: ["Yes, with props.name = \"x\"", "Yes, but only numbers", "No, props are read-only inputs"]
    answer: 2
---

A component that always shows the same thing is not very useful. **Props** (short for "properties") are the inputs of a component, in the same way arguments are the inputs of a function. They let one component be used in many places with different data.

## Passing and reading props

You pass props as attributes in the tag, and the component receives them as an object:

```jsx
function Greeting(props) {
  return <p>Hello, {props.name}!</p>;
}

<Greeting name="Ava" />
<Greeting name="Noam" />
```

This shows `Hello, Ava!` and `Hello, Noam!` using the same component twice. Each attribute becomes a property on `props`.

## Destructuring

Writing `props.` all the time is noisy. **Destructuring** unpacks the properties you want right in the parameter list:

```jsx
function Greeting({ name }) {
  return <p>Hello, {name}!</p>;
}
```

The curly braces in the parameter are JavaScript destructuring, and the ones in the JSX are the "window into JavaScript" you saw in the previous lesson. Same symbol, two different places.

## Passing things that are not text

A value in quotes is always a string. To pass anything else, use curly braces:

```jsx
<Product name="Mug" price={12} inStock={true} tags={["new", "sale"]} />
```

A prop written without a value, like `<Product inStock />`, means `true`.

## Default values

If a caller may leave a prop out, give it a default in the destructuring:

```jsx
function Greeting({ name, greeting = "Hello" }) {
  return <p>{greeting}, {name}!</p>;
}

<Greeting name="Ava" />                    // Hello, Ava!
<Greeting name="Noam" greeting="Hi" />     // Hi, Noam!
```

## Props are read-only

A component must never change its own props. If you need something that changes, that is the job of **state**, which is two lessons away. Think of props as "what my parent tells me" and state as "what I remember myself".

> **Watch out:**
> - `Cannot read properties of undefined (reading 'name')`: you wrote `props.name` but the parent did not pass `name`, or you forgot the `props` parameter.
> - Seeing `Hello, !` with an empty name: the prop is named differently in the parent (`<Greeting nme="Ava" />`) or you did not print it with curly braces.
> - Passing `age="21"` and then doing maths: it is the text `"21"`. Write `age={21}`.
> - Putting the prop names in the wrong brackets: `function Greeting(name)` receives the whole props object. Use `{ name }`.

> **Your turn:** make `Greeting` print `{greeting}, {name}!` and give `greeting` the default value `"Hello"`, so the page shows `Hello, Ava!` and `Hi, Noam!`.
