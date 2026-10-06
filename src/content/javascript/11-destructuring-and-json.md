---
title: Destructuring, spread and JSON
summary: Unpack values quickly, copy objects, and convert data to and from text.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const user = {
        name: "Ava",
        age: 20,
        city: "Haifa",
        skills: ["html", "css", "js"],
      };

      // 1. Unpack name and city from user (object destructuring)
      //    and print: Ava lives in Haifa

      // 2. Unpack the first two items of user.skills into first and second
      //    (array destructuring) and print them with a space: html css

      // 3. Make `older`, a copy of user with age changed to 21 (spread).
      //    Print older.age, then user.age

      // 4. Print the JSON text of an object with just the name and city

      // 5. Parse this JSON text and print the score plus 1
      const text = '{"score": 42}';

check:
  output: |
    Ava lives in Haifa
    html css
    21
    20
    {"name":"Ava","city":"Haifa"}
    43
  code:
    - pattern: "const\\s*\\{[^}]*\\bname\\b[^}]*\\}\\s*=\\s*user"
      message: "Use object destructuring: const { name, city } = user;"
    - pattern: "const\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*=\\s*user\\.skills"
      message: "Use array destructuring: const [first, second] = user.skills;"
    - pattern: "\\.\\.\\.user"
      message: "Use the spread syntax to copy user."
    - pattern: "JSON\\.stringify\\("
      message: "Use JSON.stringify()."
    - pattern: "JSON\\.parse\\("
      message: "Use JSON.parse()."
hints:
  - "Destructuring copies values out of objects (by name, in curly braces) and arrays (by position, in square brackets) into variables. Spread copies, and JSON converts to and from text."
  - "const { name, city } = user;  const [first, second] = user.skills;  const older = { ...user, age: 21 };  then JSON.stringify(...) for the text and JSON.parse(text) to get the object back."
  - "console.log(`${name} lives in ${city}`);  console.log(first, second);  console.log(JSON.stringify({ name, city }));  const data = JSON.parse(text);  console.log(data.score + 1);"
solution:
  - code: |
      const user = {
        name: "Ava",
        age: 20,
        city: "Haifa",
        skills: ["html", "css", "js"],
      };

      const { name, city } = user;
      console.log(`${name} lives in ${city}`);

      const [first, second] = user.skills;
      console.log(first, second);

      const older = { ...user, age: 21 };
      console.log(older.age);
      console.log(user.age);

      console.log(JSON.stringify({ name, city }));

      const text = '{"score": 42}';
      const data = JSON.parse(text);
      console.log(data.score + 1);
quiz:
  - q: What does  const { name } = user;  do?
    options: ["Creates a variable name holding user.name", "Creates an object called name", "Deletes name from user"]
    answer: 0
  - q: What does  JSON.stringify(obj)  return?
    options: ["A new object", "A string of text describing the object", "A number"]
    answer: 1
  - q: 'What does  const copy = { ...original, x: 5 };  do?'
    options: ["Changes original.x to 5", "Throws an error", "Copies the properties of original into a new object, and sets x to 5"]
    answer: 2
  - q: Why is JSON useful?
    options: ["It is a text format to store and send data between programs", "It makes pages load faster", "It is a type of loop"]
    answer: 0
---

By now you know arrays and objects. This lesson shows three small but powerful pieces of modern JavaScript that you will see in nearly every real project: **destructuring**, the **spread** syntax, and **JSON**.

## Object destructuring

Instead of writing

```js
const name = user.name;
const city = user.city;
```

you can pull out several properties at once:

```js
const { name, city } = user;
```

The curly braces on the **left** of `=` do not make an object. They say "take the properties called `name` and `city` from `user` and create variables with those names". The names must match the property names. To use a different variable name, write `const { name: userName } = user;`.

## Array destructuring

For arrays you use square brackets and pick by **position**:

```js
const colors = ["red", "green", "blue"];
const [first, second] = colors;
console.log(first, second); // prints: red green
```

You can also skip items with an empty slot: `const [, , third] = colors;`.

## Spread: copying and combining

Three dots `...` "spread" the contents of an array or object into a new one:

```js
const a = [1, 2];
const b = [...a, 3];     // [1, 2, 3]  a new array

const user = { name: "Ava", age: 20 };
const older = { ...user, age: 21 };  // copy, then override age
console.log(user.age);   // prints: 20  (the original is untouched)
console.log(older.age);  // prints: 21
```

Properties written later win. This is the standard way to "change" an object without modifying the original.

## JSON: data as text

**JSON** (JavaScript Object Notation) is a text format that looks like a JavaScript object. It is how programs send data to each other over the internet and save it in files.

- `JSON.stringify(value)` turns a value into JSON text.
- `JSON.parse(text)` turns JSON text back into a real value.

```js
const text = JSON.stringify({ name: "Ava", age: 21 });
console.log(text);        // prints: {"name":"Ava","age":21}
console.log(typeof text); // prints: string

const back = JSON.parse(text);
console.log(back.name);   // prints: Ava
```

JSON has stricter rules than JavaScript objects: keys must be in **double quotes**, text values must use double quotes (never single quotes), and there are no trailing commas, no functions and no comments.

You can also pass extra arguments to make the text pretty: `JSON.stringify(obj, null, 2)`.

## Shorthand properties

When a variable has the same name as the key you want, you can write it once: `{ name, city }` is short for `{ name: name, city: city }`. This is used in the stringify step of the exercise.

> **Watch out:**
> - Writing the destructuring names wrong: `const { nmae } = user;` gives `undefined`, because there is no such property.
> - Using the wrong brackets: `{ }` for objects (by name) and `[ ]` for arrays (by position).
> - Spread makes a **shallow** copy. Nested objects and arrays inside are still shared with the original.
> - Invalid JSON: `JSON.parse("{'a': 1}")` fails with `SyntaxError: Unexpected token ' in JSON at position 1`, because JSON requires double quotes.
> - Forgetting that `JSON.stringify` drops functions and `undefined` values.
> - Redeclaring a variable: `const name = ...` twice in the same scope gives `SyntaxError: Identifier 'name' has already been declared`.

## Going further

Destructure in function parameters: `function show({ name, city }) { return name + ", " + city; }`. Use `JSON.stringify(user, null, 2)` to print a nicely indented object.

> **Your turn:** follow the numbered comments and print the six lines.
