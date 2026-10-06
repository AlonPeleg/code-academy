---
title: Type guards and exhaustive checking with never
summary: Teach the compiler what a value is with custom guards, and make it force you to handle every case.
level: advanced
runner: ts
files:
  - name: main.ts
    code: |
      type Circle = { kind: "circle"; radius: number };
      type Square = { kind: "square"; side: number };
      type Rect = { kind: "rect"; width: number; height: number };
      type Shape = Circle | Square | Rect;

      // 1. Write assertNever: it takes a value of type never, returns never,
      //    and throws an Error with the message "Unexpected shape: " + JSON.stringify(value).

      function area(shape: Shape): number {
        switch (shape.kind) {
          case "circle":
            return Math.PI * shape.radius ** 2;
          case "square":
            return shape.side ** 2;
          // 2. Handle the third kind of shape here (width times height).
          // 3. Add a default branch that returns the result of calling assertNever with the shape.
        }
      }

      const shapes: Shape[] = [
        { kind: "circle", radius: 3 },
        { kind: "square", side: 4 },
        { kind: "rect", width: 6, height: 4 },
      ];
      for (const s of shapes) {
        console.log(s.kind + ": " + area(s).toFixed(2));
      }
      try {
        area({ kind: "triangle", sides: 3 } as unknown as Shape);
      } catch (error) {
        console.log((error as Error).message);
      }

      // 4. Turn isString into a type predicate (return type "value is string") so that
      //    filter(isString) produces a string[].
      function isString(value: unknown): boolean {
        return typeof value === "string";
      }

      interface Cat { meow(): string }
      interface Dog { bark(): string }

      // 5. Turn isCat into a type predicate for Cat. It uses the in operator.
      function isCat(pet: Cat | Dog): boolean {
        return "meow" in pet;
      }

      const mixed: unknown[] = ["a", 1, "b", null, "c"];
      console.log(mixed.filter(isString).map((s) => s.toUpperCase()).join(","));

      const pets: (Cat | Dog)[] = [{ meow: () => "Meow!" }, { bark: () => "Woof!" }];
      for (const pet of pets) {
        console.log(isCat(pet) ? pet.meow() : pet.bark());
      }
check:
  output: |
    circle: 28.27
    square: 16.00
    rect: 24.00
    Unexpected shape: {"kind":"triangle","sides":3}
    A,B,C
    Meow!
    Woof!
  code:
    - pattern: 'function\s+assertNever\s*\(\s*\w+\s*:\s*never\s*\)\s*:\s*never'
      message: "Declare  function assertNever(value: never): never"
    - pattern: 'case\s+["'']rect["'']'
      message: 'Add the case "rect" to the switch.'
    - pattern: 'default\s*:\s*return\s+assertNever\s*\(\s*shape\s*\)'
      message: "Add  default: return assertNever(shape);"
    - pattern: ':\s*value\s+is\s+string'
      message: "Make isString a type predicate:  value is string"
    - pattern: ':\s*pet\s+is\s+Cat'
      message: "Make isCat a type predicate:  pet is Cat"
hints:
  - "A type predicate is a special return type of the form parameterName is Type. The type never means no value can ever reach this place, so if the switch really covers every case, the variable in the default branch has the type never."
  - "function assertNever(value: never): never { throw new Error(...); }   case \"rect\": return shape.width * shape.height;   default: return assertNever(shape);"
  - "function isString(value: unknown): value is string { return typeof value === \"string\"; }   function isCat(pet: Cat | Dog): pet is Cat { return \"meow\" in pet; }"
solution:
  - name: main.ts
    code: |
      type Circle = { kind: "circle"; radius: number };
      type Square = { kind: "square"; side: number };
      type Rect = { kind: "rect"; width: number; height: number };
      type Shape = Circle | Square | Rect;

      function assertNever(value: never): never {
        throw new Error("Unexpected shape: " + JSON.stringify(value));
      }

      function area(shape: Shape): number {
        switch (shape.kind) {
          case "circle":
            return Math.PI * shape.radius ** 2;
          case "square":
            return shape.side ** 2;
          case "rect":
            return shape.width * shape.height;
          default:
            return assertNever(shape);
        }
      }

      const shapes: Shape[] = [
        { kind: "circle", radius: 3 },
        { kind: "square", side: 4 },
        { kind: "rect", width: 6, height: 4 },
      ];
      for (const s of shapes) {
        console.log(s.kind + ": " + area(s).toFixed(2));
      }
      try {
        area({ kind: "triangle", sides: 3 } as unknown as Shape);
      } catch (error) {
        console.log((error as Error).message);
      }

      function isString(value: unknown): value is string {
        return typeof value === "string";
      }

      interface Cat { meow(): string }
      interface Dog { bark(): string }

      function isCat(pet: Cat | Dog): pet is Cat {
        return "meow" in pet;
      }

      const mixed: unknown[] = ["a", 1, "b", null, "c"];
      console.log(mixed.filter(isString).map((s) => s.toUpperCase()).join(","));

      const pets: (Cat | Dog)[] = [{ meow: () => "Meow!" }, { bark: () => "Woof!" }];
      for (const pet of pets) {
        console.log(isCat(pet) ? pet.meow() : pet.bark());
      }
quiz:
  - q: What is the point of the never type in the default branch of a switch?
    options: ["It makes the code faster", "The compiler reports an error if you add a new case to the union and forget to handle it", "It catches run-time errors automatically"]
    answer: 1
  - q: "What does the return type  value is string  tell the compiler?"
    options: ["When the function returns true, value can be treated as a string afterwards", "The function always returns a string", "The function converts the value to a string"]
    answer: 0
  - q: Which of these is the safest way to narrow a value of type unknown?
    options: ["Use the as keyword to cast it", "Check it with typeof or a type guard first", "Declare it as any"]
    answer: 1
    explain: A cast just tells the compiler to trust you. A guard really checks the value at run time.
  - q: What does  "meow" in pet  do?
    options: ["Declares a property called meow", "Calls the meow method", "Checks at run time whether pet has a property called meow, which narrows the type"]
    answer: 2
---

Types disappear when the program runs, so TypeScript cannot know what a value really is by magic. Instead you prove it, with a run-time check that the compiler understands. This is called **narrowing**. In this lesson you will write your own checks (type guards) and use the special `never` type to make the compiler warn you when you forget a case.

## Built-in narrowing

You have already seen `typeof` narrowing. A few more checks the compiler understands:

```ts
function show(x: string | number | null) {
  if (x === null) return "nothing";        // x: null here
  if (typeof x === "string") return x;     // x: string here
  return x.toFixed(1);                     // x: number here
}
```

- `typeof x === "string"` for primitives,
- `x instanceof Date` for class instances,
- `"meow" in pet` to check whether an object has a property,
- `x === null` and truthiness checks for `null` and `undefined`.

Inside each branch the type is narrowed to what the check proved.

## Writing your own type guard

Sometimes the check is more complicated than one `typeof`. Move it into a function and tell the compiler what a `true` answer means, with a **type predicate**:

```ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}

const mixed: unknown[] = ["a", 1, "b"];
const words = mixed.filter(isString); // string[]
```

`value is string` is the return type. At run time the function simply returns a boolean, but the compiler learns: "when this returns true, `value` is a `string`". Without the predicate, `filter` would give back `unknown[]` and you would have to cast. Be honest: the compiler trusts your function, so a wrong check lies to everyone.

## Discriminated unions

When every member of a union has a shared literal property (a **discriminant**, here `kind`), checking it narrows the whole object:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") return Math.PI * shape.radius ** 2; // radius is available
  return shape.side ** 2;                                          // must be a square
}
```

## never and exhaustive checking

`never` is the type of values that **cannot exist**: the return type of a function that always throws, and the type of a variable after every possibility has been ruled out. We can use that to prove we handled all cases:

```ts
function assertNever(value: never): never {
  throw new Error("Unexpected: " + JSON.stringify(value));
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    default: return assertNever(shape); // shape is never here
  }
}
```

If every kind has a `case`, then in the `default` branch `shape` has the type `never`, and passing it to `assertNever` compiles. Now someone adds `{ kind: "rect" }` to `Shape` and forgets `area`. The `default` branch now receives a `Rect`, which is not assignable to `never`, and the compiler stops with an error like `Argument of type 'Rect' is not assignable to parameter of type 'never'`. A whole class of bugs is caught while you type, not when a customer meets them. The thrown error is a safety net for data that sneaks past the types, such as JSON from a server.

## Assertion functions

A sibling of the type predicate is the **assertion function**, which throws instead of returning false:

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new Error("Not a string");
}
```

After a call to it, TypeScript treats `value` as a `string` for the rest of the scope.

> **Watch out:**
> - A predicate that returns the wrong answer. `function isCat(p): p is Cat { return true; }` compiles and breaks at run time.
> - Using `as` instead of a guard. `value as string` silences the compiler without checking anything.
> - Forgetting the `default` branch: without it the function may end without returning, and TypeScript says `Function lacks ending return statement and return type does not include 'undefined'`.
> - `Argument of type 'X' is not assignable to parameter of type 'never'`: this is the exhaustiveness check working. Add the missing `case`.
> - Narrowing by a property that is not shared: `shape.radius` before checking `kind` gives `Property 'radius' does not exist on type 'Shape'`.

## Going further

Add a fourth shape and watch the compiler complain in `area` before you handle it. Then write `function isRect(shape: Shape): shape is Rect` and use it with `filter`.

> **Your turn:** write `assertNever`, complete the `switch` in `area` with the `"rect"` case and an exhaustive `default`, and turn `isString` and `isCat` into type predicates.
