---
title: Literal types and narrowing
summary: Restrict values to exact options and let TypeScript follow your if-checks.
level: intermediate
runner: ts
files:
  - name: main.ts
    code: |
      // 1. Declare type Shape as a union of two object types:
      //    a circle has kind "circle" and a numeric radius,
      //    a square has kind "square" and a numeric size.
      // 2. In format, use typeof to handle strings and numbers differently.

      function area(shape: Shape): number {
        if (shape.kind === "circle") {
          return Math.round(Math.PI * shape.radius ** 2);
        }
        return shape.size * shape.size;
      }

      function format(value: string | number): string {
        // A string must be returned in capital letters.
        // A number must be returned with exactly 2 decimals (use toFixed).
        return String(value);
      }

      console.log(area({ kind: "circle", radius: 2 }));
      console.log(area({ kind: "square", size: 3 }));
      console.log(format("hello"));
      console.log(format(3.14159));
check:
  output: |
    13
    9
    HELLO
    3.14
  code:
    - pattern: "kind\\s*:\\s*[\"']circle[\"']"
      message: 'Describe the circle with a literal kind:  kind: "circle"'
    - pattern: "kind\\s*:\\s*[\"']square[\"']"
      message: 'Describe the square with a literal kind:  kind: "square"'
    - pattern: "radius\\s*:\\s*number"
      message: "The circle needs  radius: number"
    - pattern: "size\\s*:\\s*number"
      message: "The square needs  size: number"
    - pattern: "typeof\\s+value\\s*===?\\s*[\"'](string|number)[\"']"
      message: 'Narrow with typeof:  if (typeof value === "string") { ... }'
hints:
  - "Each member of the union is an object type with a fixed text value in kind (a literal type), separated from the next by a vertical bar. In format, ask typeof value whether it is a string."
  - "type Shape has two object types joined by |. Their kind properties are exactly the words circle and square in quotes. In format, one branch uses toUpperCase and the other toFixed(2)."
  - "type Shape = { kind: \"circle\"; radius: number } | { kind: \"square\"; size: number };   and in format:   if (typeof value === \"string\") { return value.toUpperCase(); }  return value.toFixed(2);"
solution:
  - name: main.ts
    code: |
      type Shape =
        | { kind: "circle"; radius: number }
        | { kind: "square"; size: number };

      function area(shape: Shape): number {
        if (shape.kind === "circle") {
          return Math.round(Math.PI * shape.radius ** 2);
        }
        return shape.size * shape.size;
      }

      function format(value: string | number): string {
        if (typeof value === "string") {
          return value.toUpperCase();
        }
        return value.toFixed(2);
      }

      console.log(area({ kind: "circle", radius: 2 }));
      console.log(area({ kind: "square", size: 3 }));
      console.log(format("hello"));
      console.log(format(3.14159));
quiz:
  - q: What is a literal type such as  "up" | "down" ?
    options: ["Any string", "A type that only allows those exact values", "A function type"]
    answer: 1
  - q: What is "narrowing"?
    options: ["Making a file smaller", "Removing unused imports", "TypeScript working out a more specific type inside an if check"]
    answer: 2
  - q: Inside  if (typeof value === "string") { ... }  what type does value have?
    options: ["string", "string | number", "unknown"]
    answer: 0
  - q: What makes a union a "discriminated union"?
    options: ["Every member has a shared property with a different literal value", "It has more than two members", "It contains null"]
    answer: 0
    explain: "That shared property (like kind) is the tag you check to know which member you hold."
---

A union such as `string | number` is flexible, but eventually you have to look at the value and decide what to do. This lesson shows how to restrict values to exact options, and how TypeScript follows your checks to understand your code.

## Literal types

Besides `string`, the type system lets you use an exact value as a type. This is called a **literal type**:

```ts
type Direction = "up" | "down" | "left" | "right";

let move: Direction = "up";   // fine
move = "sideways";            // error: Type '"sideways"' is not assignable to type 'Direction'
```

This is perfect for a fixed set of options, and the editor will even autocomplete the four allowed words. It also catches typos like `"rigth"`. Numbers and booleans can be literals too: `type Dice = 1 | 2 | 3 | 4 | 5 | 6`.

## Narrowing with typeof

If a value is `string | number`, you can only use what both types share. After a `typeof` check, TypeScript **narrows** the type inside the branch:

```ts
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();  // here value is a string
  }
  return value.toFixed(2);       // here TypeScript knows it must be a number
}

console.log(format("hi"));     // prints: HI
console.log(format(2.5));      // prints: 2.50
```

TypeScript reads your `if` statements and `return`s like a person would. Other checks narrow too: `value === null`, `Array.isArray(value)`, `"radius" in shape` (does the object have this property), and `instanceof`.

## Discriminated unions

When several object shapes can occur, give them a shared property with a different literal value, often called `kind` or `type`. That property is a **tag**:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.round(Math.PI * shape.radius ** 2);
  }
  return shape.size * shape.size;
}
```

Checking `shape.kind` tells TypeScript exactly which member you have. Inside the `if`, `shape.radius` is allowed. After it, `shape.size` is allowed, and if you wrote `shape.radius` there you would get `Property 'radius' does not exist on type ...`. A `switch (shape.kind)` works just as well.

This pattern is common for things like loading states (`{ status: "loading" }` or `{ status: "done"; data: string }`) and is one of the most useful ideas in TypeScript.

> **Watch out:**
> - Forgetting the quotes: `kind: circle` refers to a type named `circle`. Literal text needs quotes.
> - `const x = "up"` has literal type `"up"`, but `let x = "up"` is widened to `string`. Annotate it: `let x: Direction = "up"`.
> - `This comparison appears to be unintentional because the types ... have no overlap`: you compared against a value the union does not contain.

> **Your turn:** declare the `Shape` union with a circle (`radius`) and a square (`size`), then use `typeof` inside `format` so strings become upper case and numbers get two decimals.
