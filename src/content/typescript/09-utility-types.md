---
title: Utility types
summary: Build new types from old ones with Partial, Pick, Record and friends.
level: intermediate
runner: ts
files:
  - name: main.ts
    code: |
      interface User {
        id: number;
        name: string;
        email: string;
      }

      // 1. Declare type Preview: a User with only id and name (use Pick).
      // 2. Let changes be any part of a User (use Partial).
      // 3. Give stock the type: an object with string keys and number values (use Record).

      function updateUser(user: User, changes): User {
        return { ...user, ...changes };
      }

      function preview(user: User): Preview {
        return { id: user.id, name: user.name };
      }

      const stock = {};
      stock["apples"] = 5;
      stock["pears"] = 2;

      const ava: User = { id: 1, name: "Ava", email: "ava@old.com" };
      const updated = updateUser(ava, { email: "ava@new.com" });
      const p = preview(updated);

      console.log(`${updated.name} ${updated.email}`);
      console.log(`${p.id} ${p.name}`);
      console.log(Object.values(stock).reduce((a, b) => a + b, 0));
check:
  output: |
    Ava ava@new.com
    1 Ava
    7
  code:
    - pattern: "type\\s+Preview\\s*=\\s*Pick\\s*<\\s*User\\s*,\\s*([\"']id[\"']\\s*\\|\\s*[\"']name[\"']|[\"']name[\"']\\s*\\|\\s*[\"']id[\"'])\\s*>"
      message: 'Declare  type Preview = Pick<User, "id" | "name">;'
    - pattern: "changes\\s*:\\s*Partial\\s*<\\s*User\\s*>"
      message: "Type the parameter:  changes: Partial<User>"
    - pattern: "stock\\s*:\\s*Record\\s*<\\s*string\\s*,\\s*number\\s*>"
      message: "Type stock:  const stock: Record<string, number> = {};"
hints:
  - "Utility types are written like generic functions: a name followed by angle brackets that contain the types to work with. Pick takes a type and the keys you want, Partial takes a type, Record takes a key type and a value type."
  - "type Preview = Pick<...>; the keys are given as text literals joined by a bar. Use Partial<User> for changes, and Record<string, number> as the type after stock."
  - "type Preview = Pick<User, \"id\" | \"name\">;   changes: Partial<User>   const stock: Record<string, number> = {};"
solution:
  - name: main.ts
    code: |
      interface User {
        id: number;
        name: string;
        email: string;
      }

      type Preview = Pick<User, "id" | "name">;

      function updateUser(user: User, changes: Partial<User>): User {
        return { ...user, ...changes };
      }

      function preview(user: User): Preview {
        return { id: user.id, name: user.name };
      }

      const stock: Record<string, number> = {};
      stock["apples"] = 5;
      stock["pears"] = 2;

      const ava: User = { id: 1, name: "Ava", email: "ava@old.com" };
      const updated = updateUser(ava, { email: "ava@new.com" });
      const p = preview(updated);

      console.log(`${updated.name} ${updated.email}`);
      console.log(`${p.id} ${p.name}`);
      console.log(Object.values(stock).reduce((a, b) => a + b, 0));
quiz:
  - q: What does  Partial<User>  give you?
    options: ["A User where every property is optional", "A User with only some properties removed", "A User where every property is required"]
    answer: 0
  - q: What does  Pick<User, "id" | "name">  give you?
    options: ["A User without id and name", "A random property of User", "A type with only the id and name properties of User"]
    answer: 2
  - q: What does  Record<string, number>  describe?
    options: ["An object with any string keys and number values", "An array of numbers", "A function that returns a number"]
    answer: 0
  - q: Why use utility types instead of writing a new interface?
    options: ["They run faster", "They stay in sync when the original type changes", "They are required by TypeScript"]
    answer: 1
    explain: "If you add a property to User, Partial<User> and Pick<User, ...> follow along automatically."
---

Real programs have many types that are slight variations of one another: the full user, the user with some fields missing, the user with only a name and id. Copying and pasting interfaces would be tedious and error-prone. TypeScript ships with **utility types** that build a new type from an existing one.

All of them look like generic types: a name, and the types to work with inside `< >`. We will use this interface in the examples:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

## Partial: everything optional

`Partial<User>` is a `User` where every property has become optional. It is perfect for "update" functions where the caller sends only the fields that changed:

```ts
function updateUser(user: User, changes: Partial<User>): User {
  return { ...user, ...changes };
}

const ava: User = { id: 1, name: "Ava", email: "ava@old.com" };
const updated = updateUser(ava, { email: "ava@new.com" });
console.log(updated.email); // prints: ava@new.com
```

The `...` (spread) copies the properties of `user` and then overwrites them with the ones in `changes`.

## Pick and Omit: choose the properties

`Pick<Type, Keys>` keeps only the listed properties. `Omit<Type, Keys>` does the opposite and removes them:

```ts
type Preview = Pick<User, "id" | "name">;   // { id: number; name: string }
type NoId = Omit<User, "id">;               // { name: string; email: string }
```

The keys are literal types (remember `"id" | "name"` from the previous lesson), so a typo such as `"nmae"` is an error.

## Record: a dictionary

`Record<Keys, Value>` describes an object used like a dictionary, where every key has the same kind of value:

```ts
const stock: Record<string, number> = {};
stock["apples"] = 5;
stock["pears"] = 2;
// stock["kiwis"] = "many";   // error: Type 'string' is not assignable to type 'number'
```

You can also use a union of literals as keys, which forces you to provide every one:

```ts
type Role = "admin" | "guest";
const power: Record<Role, number> = { admin: 10, guest: 1 };
```

## Readonly

`Readonly<User>` makes every property read-only, a quick way to say "do not modify this object".

> **Watch out:**
> - `Type 'User' is not generic` or `Generic type 'Pick' requires 2 type argument(s)`: you must pass all of the types in `< >`.
> - `Type '"mail"' does not satisfy the constraint 'keyof User'`: the key you asked for does not exist on the type.
> - `Partial<User>` objects may lack fields, so reading `changes.name` gives `string | undefined`. Check before using.

> **Your turn:** declare `Preview` with `Pick`, type `changes` with `Partial<User>`, and type `stock` as a `Record<string, number>`.
