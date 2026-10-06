---
title: Basic types and inference
summary: Learn the everyday types, and when TypeScript can work the type out for you.
level: beginner
runner: ts
files:
  - name: main.ts
    code: |
      // TypeScript works out the type of greeting by itself. No annotation needed.
      const greeting = "Welcome";

      // 1. Declare username, a string, without giving it a value yet.
      // 2. Declare level, a number, without giving it a value yet.
      // Without a starting value TypeScript cannot guess, so you must write the type.

      username = "Ava";
      level = 3;

      console.log(`${greeting}, ${username}! Level ${level}`);
check:
  output: "Welcome, Ava! Level 3"
  code:
    - pattern: "let\\s+username\\s*:\\s*string"
      message: "Declare it with a type:  let username: string;"
    - pattern: "let\\s+level\\s*:\\s*number"
      message: "Declare it with a type:  let level: number;"
hints:
  - "Use let (not const) because you assign the value later. After the name, add a colon and the type, and end the line with a semicolon. No value is needed."
  - "You need two declarations, one for username with the type string and one for level with the type number."
  - "let username: string;  and on the next line  let level: number;"
solution:
  - name: main.ts
    code: |
      const greeting = "Welcome";

      let username: string;
      let level: number;

      username = "Ava";
      level = 3;

      console.log(`${greeting}, ${username}! Level ${level}`);
quiz:
  - q: What does TypeScript do with  const planet = "Earth"  (no annotation)?
    options: ["It gives an error because a type is missing", "It treats the type as any", "It infers that planet is a string"]
    answer: 2
  - q: When must you write the type yourself?
    options: ["When a variable is declared without a starting value", "Every single time", "Never, inference always works"]
    answer: 0
  - q: Which type is the safe choice for "I do not know yet what this value is"?
    options: ["any", "unknown", "void"]
    answer: 1
    explain: "unknown forces you to check the value before using it. any simply turns the type checks off."
---

TypeScript has a small set of everyday types, and the good news is that you rarely have to write them out. In this lesson you will meet the basic types and learn when TypeScript can **infer** (work out) a type for you.

## The basic types

| Type | What it holds | Example |
| --- | --- | --- |
| `string` | text | `"hello"` |
| `number` | any number, whole or decimal | `42`, `3.14` |
| `boolean` | `true` or `false` | `true` |
| `null` / `undefined` | "nothing" | `undefined` |

```ts
let city: string = "Haifa";
let temperature: number = 24;
let isSunny: boolean = true;
```

## Type inference

When you give a variable a value on the same line, TypeScript looks at the value and decides the type itself:

```ts
const planet = "Earth";   // TypeScript knows: string
let count = 0;            // TypeScript knows: number
count = count + 1;        // fine
count = "many";           // error: Type 'string' is not assignable to type 'number'
```

Hover over `count` in the editor and you will see `let count: number`. Inference means you get full protection without cluttering your code. A common style rule is: **let TypeScript infer when there is a starting value, and write the annotation when there is not**, or when you want to be explicit for a function's inputs and outputs.

## When inference cannot help

If you declare a variable and fill it in later, there is nothing to look at, so you write the type:

```ts
let message: string;

message = "Hello";
console.log(message); // prints: Hello
```

## any and unknown

Sometimes you really do not know what a value is, for example data read from outside your program.

- **`any`** turns the type checker off for that value. TypeScript will let you do anything with it, including mistakes. Avoid it when you can.
- **`unknown`** means "could be anything, but check before you use it". It is the safe alternative.

```ts
let data: unknown = "42";
// data.toUpperCase();       // error: 'data' is of type 'unknown'
if (typeof data === "string") {
  console.log(data.toUpperCase()); // prints: 42
}
```

> **Watch out:**
> - `Parameter 'x' implicitly has an 'any' type`: a function parameter has no annotation, and nothing to infer it from. Write the type.
> - Re-assigning a `const`: `Cannot assign to 'count' because it is a constant`. Use `let` for values that change.
> - Declaring `let total;` with no type and no value: TypeScript gives it the loose `any` type. Add `: number`.

> **Your turn:** declare `username` as a string and `level` as a number (with `let`, no values yet) so the program prints `Welcome, Ava! Level 3`.
