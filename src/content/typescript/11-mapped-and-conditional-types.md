---
title: Mapped and conditional types
summary: Transform one type into another by looping over its keys and by choosing a type with if-then-else logic.
level: advanced
runner: ts
files:
  - name: main.ts
    code: |
      interface Settings {
        theme: string;
        fontSize: number;
        notifications: boolean;
      }

      // 1. Declare type Nullable<T>: a mapped type with the same keys as T,
      //    where every property may also be null.
      // 2. Declare type Getters<T>: for each key K of T, a property called "get" plus the
      //    capitalised key (theme becomes getTheme), holding a function that takes no arguments and returns the property's type.
      //    (use  as  to rename the keys, and the built-in Capitalize<...>)
      // 3. Declare type ElementType<T>: if T is an array, the type of its items, else T itself.
      //    (a conditional type with the infer keyword)
      // 4. Declare type IsString<T>: the literal type "yes" if T extends string, otherwise "no".

      const draft: Nullable<Settings> = { theme: null, fontSize: 14, notifications: null };
      console.log(JSON.stringify(draft));

      const getters: Getters<Settings> = {
        getTheme: () => "dark",
        getFontSize: () => 14,
        getNotifications: () => true,
      };
      console.log(getters.getTheme() + " " + getters.getFontSize() + " " + getters.getNotifications());

      const word: ElementType<string[]> = "typescript";
      const num: ElementType<number> = 7;
      console.log(word.length + num);

      const a: IsString<"hi"> = "yes";
      const b: IsString<42> = "no";
      console.log(a + " " + b);
check:
  output: |
    {"theme":null,"fontSize":14,"notifications":null}
    dark 14 true
    17
    yes no
  code:
    - pattern: 'type\s+Nullable\s*<\s*T\s*>\s*=\s*\{\s*\[\s*(\w+)\s+in\s+keyof\s+T\s*\]\s*:\s*(T\s*\[\s*\1\s*\]\s*\|\s*null|null\s*\|\s*T\s*\[\s*\1\s*\])'
      message: "Write  type Nullable<T> = { [K in keyof T]: T[K] | null };"
    - pattern: 'as\s+`get\$\{\s*Capitalize\s*<'
      message: "Rename the keys with  as `get${Capitalize<string & K>}`"
    - pattern: '\(\s*\)\s*=>\s*T\s*\[\s*\w+\s*\]'
      message: "Each getter has the type  () => T[K]"
    - pattern: 'type\s+ElementType\s*<\s*T\s*>\s*=\s*T\s+extends\s*\(\s*infer\s+U\s*\)\s*\[\s*\]\s*\?\s*U\s*:\s*T'
      message: "Write  type ElementType<T> = T extends (infer U)[] ? U : T;"
    - pattern: 'type\s+IsString\s*<\s*T\s*>\s*=\s*T\s+extends\s+string\s*\?\s*"yes"\s*:\s*"no"'
      message: 'Write  type IsString<T> = T extends string ? "yes" : "no";'
hints:
  - "A mapped type loops over keys: { [K in keyof T]: ... }. A conditional type is an if-then-else for types: T extends X ? A : B. infer lets you name a part of the type you are matching, such as the item type of an array."
  - "type Nullable<T> = { [K in keyof T]: T[K] | null };   type ElementType<T> = T extends (infer U)[] ? U : T;   type IsString<T> = T extends string ? \"yes\" : \"no\";"
  - "type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };"
solution:
  - name: main.ts
    code: |
      interface Settings {
        theme: string;
        fontSize: number;
        notifications: boolean;
      }

      type Nullable<T> = { [K in keyof T]: T[K] | null };

      type Getters<T> = {
        [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
      };

      type ElementType<T> = T extends (infer U)[] ? U : T;

      type IsString<T> = T extends string ? "yes" : "no";

      const draft: Nullable<Settings> = { theme: null, fontSize: 14, notifications: null };
      console.log(JSON.stringify(draft));

      const getters: Getters<Settings> = {
        getTheme: () => "dark",
        getFontSize: () => 14,
        getNotifications: () => true,
      };
      console.log(getters.getTheme() + " " + getters.getFontSize() + " " + getters.getNotifications());

      const word: ElementType<string[]> = "typescript";
      const num: ElementType<number> = 7;
      console.log(word.length + num);

      const a: IsString<"hi"> = "yes";
      const b: IsString<42> = "no";
      console.log(a + " " + b);
quiz:
  - q: "What does { [K in keyof T]: T[K] | null } do?"
    options: ["Deletes every key of T", "Creates a type with the same keys as T where each value may also be null", "Turns T into an array"]
    answer: 1
  - q: "In  T extends string ? 'yes' : 'no' , what does extends mean?"
    options: ["T is a class that inherits from string", "T is exactly the type string and nothing else", "T is assignable to string, that is, a string or a subtype such as a string literal"]
    answer: 2
    explain: 'In conditional types extends asks whether T is assignable to the other type. The literal type "hi" is assignable to string, so the answer is yes.'
  - q: "What does infer U do in  T extends (infer U)[] ? U : T ?"
    options: ["Captures the item type of the array so you can use it in the result", "Declares a variable at run time", "Converts T to a number"]
    answer: 0
  - q: Which modifier removes the readonly flag from every property inside a mapped type?
    options: ["!readonly", "mutable", "-readonly"]
    answer: 2
---

Utility types such as `Partial` and `Pick` felt like magic. They are not: each is written in plain TypeScript using two features you will learn here. A **mapped type** builds a new object type by looping over the keys of another type. A **conditional type** chooses between two types with an if-then-else. Together they let you write your own utilities.

## Mapped types

The syntax resembles a `for...in` loop for types:

```ts
type Nullable<T> = { [K in keyof T]: T[K] | null };
```

Piece by piece:

- `keyof T` is the union of all property names of `T`, for example `"theme" | "fontSize"`.
- `[K in keyof T]` means "for each key `K` in that union".
- `T[K]` is the type of the property `K` in `T`.
- After the colon you write what the new property should look like. Here: the original type or `null`.

For the interface `Settings { theme: string; fontSize: number; }` the result is `{ theme: string | null; fontSize: number | null }`. This is exactly how the built-in `Partial<T>` is defined, with a question mark: `{ [K in keyof T]?: T[K] }`.

### Modifiers

You can add or remove `readonly` and `?` with `+` and `-`:

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // remove readonly
type Concrete<T> = { [K in keyof T]-?: T[K] };           // make every property required
```

### Renaming keys with as

A mapped type can change the key names using `as` and a template literal type. The built-in helper `Capitalize` makes the first letter upper case:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
// Getters<Settings> is { getTheme: () => string; getFontSize: () => number; ... }
```

`string & K` is a small trick that keeps only the string keys (property names can also be numbers or symbols, which `Capitalize` rejects).

## Conditional types

A conditional type looks like the ternary operator, but at the type level:

```ts
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<"hi">; // "yes"
type B = IsString<42>;   // "no"
```

`T extends string` asks: "is `T` assignable to `string`?". If yes, the type is the first branch, else the second. The check happens at compile time, so no code is produced.

### infer: capturing a part

Inside the `extends` part, `infer` names a type that TypeScript works out for you:

```ts
type ElementType<T> = T extends (infer U)[] ? U : T;

type X = ElementType<string[]>; // string
type Y = ElementType<number>;   // number (not an array, so T itself)
```

Read it as: "if `T` is an array of *something*, call that something `U` and give me `U`." The built-in `ReturnType<F>` works the same way, capturing the return type of a function.

### Distribution over unions

When `T` is a union and you apply a conditional type, TypeScript applies it to **each member** separately and joins the results:

```ts
type Strs = IsString<string | number>; // "yes" | "no"
```

This is called a *distributive* conditional type. It is what makes `Exclude<"a" | "b", "a">` produce `"b"`.

## When are they useful?

Mostly in libraries and shared helper code: typing a function that works on any record, transforming API response shapes, deriving form types from a model. In everyday application code you will use them sparingly, but reading them is an important skill because every popular library ships with such types.

> **Watch out:**
> - Types do not exist at run time. You cannot write `if (x extends string)`. For run-time decisions use `typeof` and type guards (next lesson).
> - Forgetting that a mapped type needs `keyof`: `{ [K in T]: ... }` fails with `Type 'T' is not assignable to type 'string | number | symbol'`.
> - `Capitalize<K>` without `string &` gives `Type 'K' does not satisfy the constraint 'string'`.
> - Surprise from distribution: `IsString<string | number>` is `"yes" | "no"`, not `"no"`. To switch it off, wrap both sides: `[T] extends [string] ? ...`.
> - Overly clever types. If a colleague cannot read it in half a minute, add a comment or write a simpler type.

## Going further

Write `type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>` to make only some keys optional, and `type Awaited2<T> = T extends Promise<infer R> ? R : T`.

> **Your turn:** declare `Nullable<T>`, `Getters<T>` (with the `as` key rename), `ElementType<T>` (with `infer`) and `IsString<T>` so the program compiles and prints four lines.
