---
title: Generics in depth
summary: Constrain type parameters with extends, relate them with keyof, and give them default types.
level: advanced
runner: ts
files:
  - name: main.ts
    code: |
      // Everything below uses "any", which switches the type checker off.
      // Replace it with proper generics:
      //
      // 1. firstOf: make it generic over T, take T[] and return T | undefined.
      // 2. getProp: take an object of type T and a key whose type K is limited to the
      //    property names of T (use the extends and keyof keywords). Return the property's type.
      // 3. longest: accept any T that has a numeric length property (a constraint).
      // 4. Box: add a type parameter T with the default type string.
      // 5. Stack: make the class generic over T (private items: T[], push(item: T), pop(): T | undefined).

      function firstOf(items: any[]): any {
        return items[0];
      }

      function getProp(obj: any, key: any): any {
        return obj[key];
      }

      function longest(a: any, b: any): any {
        return a.length >= b.length ? a : b;
      }

      interface Box {
        value: any;
      }

      class Stack {
        private items: any[] = [];
        push(item: any): void {
          this.items.push(item);
        }
        pop(): any {
          return this.items.pop();
        }
        get size(): number {
          return this.items.length;
        }
      }

      console.log("first: " + firstOf([10, 20, 30]));
      console.log("empty: " + firstOf([]));
      const user = { name: "Ada", age: 36 };
      console.log("name: " + getProp(user, "name"));
      console.log("age: " + getProp(user, "age"));
      console.log("longest: " + longest("hello", "hi"));
      console.log("longest array length: " + longest([1, 2], [1, 2, 3]).length);

      const text: Box = { value: "hi" };
      const count: Box<number> = { value: 42 };
      console.log("box: " + text.value + " " + count.value);

      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      stack.push(3);
      console.log("pop: " + stack.pop() + ", size: " + stack.size);
check:
  output: |
    first: 10
    empty: undefined
    name: Ada
    age: 36
    longest: hello
    longest array length: 3
    box: hi 42
    pop: 3, size: 2
  code:
    - pattern: 'function\s+firstOf\s*<\s*T\s*>\s*\(\s*items\s*:\s*T\s*\[\s*\]\s*\)\s*:\s*T\s*\|\s*undefined'
      message: "Declare  function firstOf<T>(items: T[]): T | undefined"
    - pattern: 'K\s+extends\s+keyof\s+T'
      message: "Constrain the key with  K extends keyof T"
    - pattern: ':\s*T\s*\[\s*K\s*\]'
      message: "getProp should return the type T[K]."
    - pattern: 'T\s+extends\s*\{\s*length\s*:\s*number\s*\}'
      message: "Constrain longest with  T extends { length: number }"
    - pattern: 'interface\s+Box\s*<\s*T\s*=\s*string\s*>'
      message: "Give Box a default type parameter:  interface Box<T = string>"
    - pattern: 'class\s+Stack\s*<\s*T\s*>'
      message: "Make the class generic:  class Stack<T>"
hints:
  - "A type parameter is a placeholder written in angle brackets after the name. A constraint limits it with extends. A default is written with an equals sign. K extends keyof T means K can only be one of the property names of T."
  - "function firstOf<T>(items: T[]): T | undefined   function getProp<T, K extends keyof T>(obj: T, key: K): T[K]   function longest<T extends { length: number }>(a: T, b: T): T   interface Box<T = string> { value: T; }"
  - "class Stack<T> { private items: T[] = []; push(item: T): void { this.items.push(item); } pop(): T | undefined { return this.items.pop(); } get size(): number { return this.items.length; } }"
solution:
  - name: main.ts
    code: |
      function firstOf<T>(items: T[]): T | undefined {
        return items[0];
      }

      function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
        return obj[key];
      }

      function longest<T extends { length: number }>(a: T, b: T): T {
        return a.length >= b.length ? a : b;
      }

      interface Box<T = string> {
        value: T;
      }

      class Stack<T> {
        private items: T[] = [];
        push(item: T): void {
          this.items.push(item);
        }
        pop(): T | undefined {
          return this.items.pop();
        }
        get size(): number {
          return this.items.length;
        }
      }

      console.log("first: " + firstOf([10, 20, 30]));
      console.log("empty: " + firstOf([]));
      const user = { name: "Ada", age: 36 };
      console.log("name: " + getProp(user, "name"));
      console.log("age: " + getProp(user, "age"));
      console.log("longest: " + longest("hello", "hi"));
      console.log("longest array length: " + longest([1, 2], [1, 2, 3]).length);

      const text: Box = { value: "hi" };
      const count: Box<number> = { value: 42 };
      console.log("box: " + text.value + " " + count.value);

      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      stack.push(3);
      console.log("pop: " + stack.pop() + ", size: " + stack.size);
quiz:
  - q: "What does  <T extends { length: number }>  mean?"
    options: ["T must be exactly the type { length: number }", "T can be any type that has at least a numeric length property", "T is a number"]
    answer: 1
  - q: What does  K extends keyof T  guarantee?
    options: ["K is the name of an existing property of T", "K is a string", "K is a number"]
    answer: 0
  - q: "With  interface Box<T = string> , what does the type  Box  (no angle brackets) mean?"
    options: ["It is an error", "Box<any>", "Box<string>"]
    answer: 2
  - q: Why is a generic function better than a function taking any?
    options: ["It runs faster", "The result type is connected to the input type, so the compiler keeps checking your code", "It uses less memory"]
    answer: 1
---

You already met generics: `Array<number>` and a function `first<T>(items: T[])`. A generic is a function, class or type with a **type parameter**, a placeholder that is filled in by whoever uses it. This lesson goes deeper: how to limit what the placeholder may be, how to connect several placeholders, and how to give them default values.

## Why not use any?

You could write `function firstOf(items: any[]): any`. It runs, but the type checker gives up: the result is `any`, so `firstOf([1, 2]).toUpperCase()` compiles and crashes at run time. A generic keeps the link between input and output:

```ts
function firstOf<T>(items: T[]): T | undefined {
  return items[0];
}

const n = firstOf([10, 20, 30]); // n is number | undefined
const s = firstOf(["a", "b"]);   // s is string | undefined
```

`<T>` after the function name declares the placeholder. TypeScript **infers** `T` from the argument, so you rarely write `firstOf<number>(...)` yourself. The `| undefined` is honest: an empty array has no first item.

## Constraints with extends

Sometimes a placeholder may not be just anything. Inside `longest` we use `.length`, but not every type has one. A **constraint** restricts `T`:

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "hi");     // works: strings have length
longest([1, 2], [1, 2, 3]); // works: arrays too
// longest(5, 7);           // error: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

Read `T extends { length: number }` as "T is any type that has at least a numeric `length`". It does not have to be exactly that shape, which is why strings and arrays both fit. Notice the return type is `T`, not `{ length: number }`: you get back a string when you pass strings.

## keyof and relating two type parameters

`keyof T` is the union of the property names of `T`. Combined with a second type parameter you can write a safe property reader:

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Ada", age: 36 };
const name = getProp(user, "name"); // string
const age = getProp(user, "age");   // number
// getProp(user, "email");          // error: Argument of type '"email"' is not assignable to parameter of type '"name" | "age"'.
```

`T[K]` is an **indexed access type**: "the type of property `K` of `T`". Because `K` is a literal such as `"name"`, TypeScript knows the exact result type. Typos in the key are caught by the compiler.

## Default type parameters

Just as function parameters can have default values, type parameters can have **defaults**:

```ts
interface Box<T = string> {
  value: T;
}

const a: Box = { value: "hi" };            // T defaults to string
const b: Box<number> = { value: 42 };      // explicit
```

Defaults make a generic easy to use in the common case and flexible in the rare one. Parameters with defaults must come after those without.

## Generic classes

A class can declare its type parameter once and use it in all its members:

```ts
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}

const numbers = new Stack<number>();
numbers.push(1);
// numbers.push("two"); // error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

## Design tips

- Use a type parameter only when it appears at least twice (for example in a parameter and the result). If `T` appears once, a plain type probably suffices.
- Name them meaningfully when there are many: `TItem`, `TKey`. Single letters (`T`, `K`, `V`) are fine for small helpers.
- Add constraints as late as possible, only when the body needs them.

> **Watch out:**
> - Using a property that the constraint does not promise: `Property 'length' does not exist on type 'T'`. Add `extends { length: number }`.
> - Forgetting that `T` is erased at run time. You cannot write `new T()` or `typeof T`. Types exist only for the compiler.
> - Writing `K extends string` when you meant `K extends keyof T`. The first accepts any string and `obj[key]` becomes an error: `Type 'K' cannot be used to index type 'T'`.
> - Over-using generics. `function log<T>(x: T): void` gains nothing over `x: unknown`.
> - Having a default before a required parameter: `Required type parameters may not follow optional type parameters`.

## Going further

Write `function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`. Try giving `Stack` a `peek()` method that returns `T | undefined`.

> **Your turn:** replace each `any` with a proper generic: `firstOf<T>`, `getProp<T, K extends keyof T>` returning `T[K]`, `longest<T extends { length: number }>`, `Box<T = string>`, and `Stack<T>`.
