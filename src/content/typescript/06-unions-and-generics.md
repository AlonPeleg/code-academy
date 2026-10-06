---
title: Unions and generics
summary: Allow more than one type, and write reusable typed functions.
level: intermediate
runner: ts
files:
  - name: main.ts
    code: |
      // 1. Declare a type alias called Id that can be a string OR a number.
      // 2. Write a generic function called first that takes an array of T and returns its first item.

      function show(id: Id): string {
        return `ID: ${id}`;
      }

      console.log(show(42));
      console.log(show("abc"));
      console.log(first([10, 20, 30]));
      console.log(first(["x", "y"]));
check:
  output: |
    ID: 42
    ID: abc
    10
    x
  code:
    - pattern: "type\\s+Id\\s*=\\s*(string\\s*\\|\\s*number|number\\s*\\|\\s*string)"
      message: "Declare  type Id = string | number"
    - pattern: "first\\s*<\\s*T\\s*>"
      message: "Make first generic:  function first<T>(...)"
    - pattern: "\\(\\s*\\w+\\s*:\\s*(T\\s*\\[\\s*\\]|Array\\s*<\\s*T\\s*>)\\s*\\)\\s*:\\s*T"
      message: "first should take T[] and return T:  first<T>(items: T[]): T"
hints:
  - "A union joins types with a vertical bar. A generic function declares its placeholder type in angle brackets right after the function name."
  - "type Id = ... joins string and number with the bar symbol. For first, declare <T> after its name, take an array of T, and return a single T."
  - "type Id = string | number;   function first<T>(items: T[]): T { return items[0]; }"
solution:
  - name: main.ts
    code: |
      type Id = string | number;

      function first<T>(items: T[]): T {
        return items[0];
      }

      function show(id: Id): string {
        return `ID: ${id}`;
      }

      console.log(show(42));
      console.log(show("abc"));
      console.log(first([10, 20, 30]));
      console.log(first(["x", "y"]));
quiz:
  - q: What does  string | number  mean?
    options: ["A string and a number at the same time", "A string divided by a number", "A string or a number"]
    answer: 2
  - q: 'In  function first<T>(items: T[]): T , what is T?'
    options: ["A real type called T", "A placeholder that TypeScript fills in with a real type", "A variable name"]
    answer: 1
  - q: Why use generics?
    options: ["One function works with many types and stays type-safe", "They make code run faster", "They are required in every function"]
    answer: 0
  - q: What is the type of  first(["x", "y"])  ?
    options: ["number", "string", "T"]
    answer: 1
    explain: "T is replaced by string because the array holds strings. TypeScript works this out for you."
---

Sometimes a value can be one of a few types, and sometimes a function should work for any type while still being safe. **Unions** and **generics** solve those two problems.

## Union types

A **union** uses the `|` symbol and means "one of these types":

```ts
let userId: string | number;

userId = 42;      // fine
userId = "abc";   // also fine
userId = true;    // error: Type 'boolean' is not assignable to type 'string | number'
```

You can read `|` as "or". Unions are useful for IDs that can be numbers or text, for values that might be missing (`string | null`), and for function inputs that accept more than one form.

## Type aliases

Writing `string | number` everywhere gets tiring. A **type alias** gives any type a name with the keyword `type`:

```ts
type Id = string | number;

function show(id: Id): string {
  return `ID: ${id}`;
}
```

An alias does not create anything new at run time. It is just a nickname that TypeScript understands.

## Using a union value

TypeScript only lets you do things that are safe for **every** member of the union:

```ts
function shout(id: Id) {
  return id.toUpperCase(); // error: Property 'toUpperCase' does not exist on type 'number'
}
```

You first check which type you have (this is called narrowing, and the next lessons cover it in more detail).

## Generics

Imagine a function that returns the first item of an array. For numbers it should return a number, and for strings a string. A **generic** function uses a placeholder type, traditionally named `T`:

```ts
function first<T>(items: T[]): T {
  return items[0];
}

const a = first([1, 2, 3]);     // T is number, so a is a number
const b = first(["a", "b"]);    // T is string, so b is a string
```

Piece by piece:

1. `<T>` right after the function name declares "I need a type placeholder called T".
2. `items: T[]` says "an array whose items are of type T".
3. `: T` says "and I give back one T".

When you call the function, TypeScript fills in `T` from the arguments. The input and output types stay connected, which `any` could never do. Hover over `a` and `b` in your editor to see what TypeScript worked out.

Generic types exist too: `Array<number>` is the generic way to write `number[]`, and you can build your own, such as `interface Box<T> { value: T }`.

> **Watch out:**
> - Using `|` where you meant `&`: `string & number` (an "intersection") is impossible to satisfy.
> - `Property '...' does not exist on type 'string | number'`: you used something only one member has. Narrow the type first.
> - Forgetting `<T>` after the name gives `Cannot find name 'T'`.

> **Your turn:** create the `Id` type alias and the generic `first` function.
