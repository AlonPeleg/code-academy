---
title: Variables
summary: Store values with const and let.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // 1. Create a constant called name with the value "Ava"
      // 2. Create a variable called age with the value 20
      // 3. Add one to age (her birthday!)
      // 4. Print: Ava is 21

check:
  output: Ava is 21
  code:
    - pattern: "const\\s+name"
      message: "Declare name with const."
    - pattern: "let\\s+age"
      message: "Declare age with let."
hints:
  - "You need two named boxes: one that never changes and one that does. JavaScript has a different keyword for each."
  - "Use const for name and let for age. To change age, assign to it again, using its old value, then print the pieces joined with +."
  - "const name = \"Ava\"; let age = 20; age = age + 1; console.log(name + \" is \" + age);"
solution:
  - code: |
      const name = "Ava";
      let age = 20;
      age = age + 1;
      console.log(name + " is " + age);
quiz:
  - q: Which keyword declares a value that cannot be reassigned?
    options: ["let", "var", "const"]
    answer: 2
  - q: What does  let x = 5; x = x + 2;  leave in x?
    options: ["5", "7", "2"]
    answer: 1
  - q: What is the type of  "42"  (with quotes)?
    options: ["number", "boolean", "string"]
    answer: 2
    explain: Anything in quotes is a string, even if it looks like a number.
  - q: Which is a good variable name?
    options: ["2fast", "my-score", "playerScore"]
    answer: 2
    explain: Names can not start with a digit or contain a dash. camelCase like playerScore is the usual style.
---

Programs need to remember things: a score, a name, a total. A **variable** is a named box that holds a value. In this lesson you will learn how to create variables, change them, and use them.

## Creating a variable

```js
const city = "Haifa";
let score = 0;
```

- `const` and `let` are keywords that say "I am creating a variable".
- `city` and `score` are the **names** you choose.
- `=` is the **assignment** operator. It does not mean "equals" like in maths; it means "put the value on the right into the box on the left".
- `"Haifa"` and `0` are the **values**.

## const or let?

- `const` creates a variable that **cannot be reassigned**. Use it by default: it protects you from accidental changes.
- `let` creates a variable you can change later. Use it when the value will change, like a counter or a score.

```js
let score = 0;
score = score + 10;   // now 10
score = score + 5;    // now 15
console.log(score);   // prints: 15
```

The line `score = score + 10` is read from right to left: take the current value of `score`, add 10, and store the result back in `score`. There is a shorthand: `score += 10;` does the same thing.

## Types of values

Every value has a **type**:

| Type | Example | What it is |
| --- | --- | --- |
| string | `"Ava"` | Text, in quotes |
| number | `42`, `3.14` | Any number |
| boolean | `true`, `false` | Yes or no |

You can ask for a type with `typeof`:

```js
console.log(typeof "hi");  // prints: string
console.log(typeof 7);     // prints: number
console.log(typeof true);  // prints: boolean
```

## Joining text with +

The `+` operator adds numbers, but with strings it **joins** them. This is called *concatenation*:

```js
const name = "Ava";
console.log("Hello, " + name + "!"); // prints: Hello, Ava!
```

If you mix a string and a number, the number is turned into text, so `"Age: " + 21` gives `"Age: 21"`.

## Naming rules

- Names can contain letters, digits, `_` and `$`, but can not start with a digit.
- No spaces or dashes. Use **camelCase**: `playerScore`, `firstName`.
- Names are case-sensitive: `score` and `Score` are two different variables.
- Pick clear names. `age` is better than `a`.

> **Watch out:**
> - Changing a `const`: `const age = 20; age = 21;` gives `TypeError: Assignment to constant variable.` Use `let` if it will change.
> - Using a variable before creating it: `console.log(x); let x = 1;` gives `ReferenceError: Cannot access 'x' before initialization`.
> - Creating the same name twice with `let` or `const`: `SyntaxError: Identifier 'age' has already been declared`. To change a value, assign without the keyword: `age = 21;`.
> - Putting quotes around a variable name. `"name"` is the text name, while `name` is the variable.
> - Forgetting spaces inside joined strings: `"Hello" + name` prints `HelloAva`. Put the space inside the quotes.

## Going further

Create a `const` called `price` and a `let` called `quantity`. Increase `quantity` and print a sentence using both. Try `typeof` on each variable.

> **Your turn:** follow the comments in the editor. The program should print `Ava is 21`.
