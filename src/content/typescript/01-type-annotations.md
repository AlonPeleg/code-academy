---
title: Type annotations
summary: Tell TypeScript what kind of value each thing is.
level: beginner
runner: ts
files:
  - name: main.ts
    code: |
      // The editor underlines a and b: TypeScript does not know what kind of values they hold.
      // 1. Mark both parameters of add as numbers.
      // 2. Mark the value that add gives back as a number too.
      function add(a, b) {
        return a + b;
      }

      const total: number = add(3, 4);
      console.log(total);
check:
  output: "7"
  code:
    - pattern: "\\ba\\s*:\\s*number"
      message: "Annotate a as a number:  a: number"
    - pattern: "\\bb\\s*:\\s*number"
      message: "Annotate b as a number:  b: number"
    - pattern: "\\)\\s*:\\s*number\\s*\\{"
      message: "Add a return type after the closing parenthesis:  ): number {"
hints:
  - "A type annotation is a colon followed by a type name, written right after the thing it describes. Each parameter gets its own annotation."
  - "Write the colon and the word number after each parameter name, and once more after the parentheses for the return type."
  - "function add(a: number, b: number): number {"
solution:
  - name: main.ts
    code: |
      function add(a: number, b: number): number {
        return a + b;
      }

      const total: number = add(3, 4);
      console.log(total);
quiz:
  - q: What is TypeScript?
    options: ["A different language that replaces the browser", "JavaScript with static types added on top", "A CSS framework"]
    answer: 1
  - q: How do you say that x is a string?
    options: ["x as string", "string x", "x: string"]
    answer: 2
  - q: When does TypeScript check your types?
    options: ["While you write code, before it runs", "Only after the program crashes", "Never, types are only comments"]
    answer: 0
    explain: "The editor shows type errors as you type. The types are then erased when the code is turned into JavaScript."
  - q: 'In  function f(n: number): string  what does the final  string  describe?'
    options: ["The type of the parameter n", "The type of the value f returns", "The name of the function"]
    answer: 1
---

JavaScript lets a variable hold anything at any time, which is flexible but also a great way to hide bugs. **TypeScript** is JavaScript plus **types**: labels that say what kind of value something holds. TypeScript reads those labels and warns you about mistakes before the program even runs.

## The colon syntax

A **type annotation** is a colon followed by a type name. You put it right after the thing you are describing:

```ts
let age: number = 20;
let name: string = "Ava";
let ready: boolean = true;
```

- `age: number` means "age holds a number".
- `name: string` means "name holds text".
- `ready: boolean` means "ready is either `true` or `false`".

Now TypeScript will refuse nonsense such as `age = "twenty"`. In the editor you would see a red underline and the message `Type 'string' is not assignable to type 'number'`.

## Typing functions

Functions have two places for types: the **parameters** (the inputs) and the **return type** (the output).

```ts
function greet(name: string): string {
  return "Hi " + name;
}

console.log(greet("Ava")); // prints: Hi Ava
```

Reading it piece by piece:

1. `name: string` says the input must be text.
2. The `: string` after the closing parenthesis says the function gives back text.
3. If you call `greet(42)`, TypeScript complains: `Argument of type 'number' is not assignable to parameter of type 'string'`.

If a function does not give anything back, its return type is `void`.

## What happens at run time?

Nothing special. When your code runs, all the types are **erased** and what is left is plain JavaScript. Types are only a safety net for you while writing. That is also why this practice page cannot show a type error in the output: it checks that your annotations are written, and that the program still prints the right thing.

> **Watch out:**
> - Writing the type before the name, like `number a`. In TypeScript the name comes first: `a: number`.
> - Forgetting that parameters need annotations one by one. `function add(a, b: number)` only types `b`, and the editor will say `Parameter 'a' implicitly has an 'any' type`.
> - Using a capital letter, as in `Number` or `String`. Those are different, rarely wanted types. Use lowercase `number` and `string`.

## Going further

Change the call to `add(3, "4")` in your own copy and look at the red underline. Then undo it so the lesson still passes.

> **Your turn:** give `add` typed parameters (`a` and `b` are numbers) and a `number` return type.
