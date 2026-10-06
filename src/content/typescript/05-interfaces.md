---
title: Interfaces and objects
summary: Describe the shape of an object.
level: intermediate
runner: ts
files:
  - name: main.ts
    code: |
      // Declare an interface called Student with these properties:
      //   a name that is text, an age that is a number,
      //   and an OPTIONAL nickname that is text.

      function describe(student: Student): string {
        const nick = student.nickname ? ` (${student.nickname})` : "";
        return `${student.name}${nick} is ${student.age}`;
      }

      const ava: Student = { name: "Ava", age: 21 };
      const noam: Student = { name: "Noam", age: 22, nickname: "Nono" };

      console.log(describe(ava));
      console.log(describe(noam));
check:
  output: |
    Ava is 21
    Noam (Nono) is 22
  code:
    - pattern: "interface\\s+Student"
      message: "Declare  interface Student { ... }"
    - pattern: "\\bname\\s*:\\s*string"
      message: "Add the property  name: string;"
    - pattern: "\\bage\\s*:\\s*number"
      message: "Add the property  age: number;"
    - pattern: "nickname\\s*\\?\\s*:\\s*string"
      message: "Make nickname optional:  nickname?: string;"
hints:
  - "An interface looks like an object with types instead of values: the keyword interface, a name, then braces with one property per line."
  - "Inside the braces write three properties as name: type;. The optional one has a question mark right after its name."
  - "interface Student { name: string; age: number; nickname?: string; }"
solution:
  - name: main.ts
    code: |
      interface Student {
        name: string;
        age: number;
        nickname?: string;
      }

      function describe(student: Student): string {
        const nick = student.nickname ? ` (${student.nickname})` : "";
        return `${student.name}${nick} is ${student.age}`;
      }

      const ava: Student = { name: "Ava", age: 21 };
      const noam: Student = { name: "Noam", age: 22, nickname: "Nono" };

      console.log(describe(ava));
      console.log(describe(noam));
quiz:
  - q: What does an interface describe?
    options: ["A loop", "The shape of an object", "A CSS layout"]
    answer: 1
  - q: 'What does a ? mean in  nickname?: string  ?'
    options: ["The property is optional", "The property is a question", "The property is deleted"]
    answer: 0
  - q: 'Student needs a name. What happens if you write  const s: Student = { age: 21 } ?'
    options: ["It works silently", "TypeScript shows an error about the missing name", "The name becomes an empty string"]
    answer: 1
  - q: What does the readonly keyword do on a property?
    options: ["It hides the property", "It stops the property from being changed after creation", "It makes the property optional"]
    answer: 1
---

Objects group related values, like a student's name and age. An **interface** gives such a group a name and spells out exactly which properties it must have and what type each one has.

## Declaring an interface

```ts
interface Student {
  name: string;
  age: number;
  nickname?: string; // optional
}
```

- `interface Student { ... }` creates a new type called `Student`.
- Each line is `propertyName: type;`.
- A `?` after the name (as in `nickname?`) marks the property as **optional**. Objects may include it or leave it out.

You can now use `Student` anywhere you would use a type:

```ts
const ava: Student = { name: "Ava", age: 21 };

function birthday(student: Student): Student {
  return { ...student, age: student.age + 1 };
}
```

## What TypeScript checks for you

Once an object is declared as a `Student`, TypeScript checks every use:

```ts
const bad: Student = { name: "Dana" };
// error: Property 'age' is missing in type '{ name: string; }' but required in type 'Student'.

ava.agee = 5;
// error: Property 'agee' does not exist on type 'Student'. Did you mean 'age'?
```

Typos are caught instantly, and in the editor you can type `ava.` and see a list of the available properties (autocomplete).

## Optional and readonly properties

Optional properties may be `undefined`, so check before you use them:

```ts
if (ava.nickname) {
  console.log(ava.nickname.toUpperCase());
}
```

You can also mark a property **`readonly`** so that it can be set when the object is created but never changed afterwards:

```ts
interface Account {
  readonly id: number;
  owner: string;
}
```

## Nested shapes and methods

An interface can contain other interfaces, and describe functions:

```ts
interface Address { city: string; }

interface Person {
  name: string;
  address: Address;
  greet(): string;
}
```

> **Watch out:**
> - Separators: properties can end with `;` or `,`. Both work, just be consistent. Do not put an `=` in an interface, that is for the `type` alias.
> - `Property 'age' is missing in type ...`: you left out a required property. Make it optional with `?` only if that is truly allowed.
> - `Object literal may only specify known properties`: you added a property the interface does not list, often a typo.

> **Your turn:** declare the `Student` interface above the function, with `name: string`, `age: number`, and an optional `nickname`.
