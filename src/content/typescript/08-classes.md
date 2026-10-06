---
title: Classes and access modifiers
summary: Build objects with typed properties, and hide details with private and readonly.
level: intermediate
runner: ts
files:
  - name: main.ts
    code: |
      // 1. Make owner readonly, so it can be set but never changed.
      // 2. Make balance hidden from outside code (the keyword you need starts with p).
      // 3. Add a method withdraw(amount: number): boolean. It returns false when there is
      //    not enough money. Otherwise it subtracts the amount and returns true.
      class Account {
        owner: string;
        balance: number = 0;

        constructor(owner: string) {
          this.owner = owner;
        }

        deposit(amount: number): void {
          this.balance += amount;
        }

        getBalance(): number {
          return this.balance;
        }
      }

      const account = new Account("Ava");
      account.deposit(100);
      console.log(account.withdraw(30));
      console.log(account.withdraw(100));
      console.log(`${account.owner}: ${account.getBalance()}`);
check:
  output: |
    true
    false
    Ava: 70
  code:
    - pattern: "readonly\\s+owner"
      message: "Mark the owner as readonly:  readonly owner: string;"
    - pattern: "private\\s+balance"
      message: "Hide the balance:  private balance: number = 0;"
    - pattern: "withdraw\\s*\\(\\s*amount\\s*:\\s*number\\s*\\)\\s*:\\s*boolean"
      message: "Declare the method:  withdraw(amount: number): boolean { ... }"
hints:
  - "Access modifiers are keywords written in front of a property: one forbids changing after construction, the other forbids use from outside the class. A method starts with its name, like deposit does."
  - "Write readonly before owner and private before balance. withdraw checks whether this.balance is smaller than amount, and returns false right away if so."
  - "withdraw(amount: number): boolean { if (amount > this.balance) { return false; } this.balance -= amount; return true; }"
solution:
  - name: main.ts
    code: |
      class Account {
        readonly owner: string;
        private balance: number = 0;

        constructor(owner: string) {
          this.owner = owner;
        }

        deposit(amount: number): void {
          this.balance += amount;
        }

        withdraw(amount: number): boolean {
          if (amount > this.balance) {
            return false;
          }
          this.balance -= amount;
          return true;
        }

        getBalance(): number {
          return this.balance;
        }
      }

      const account = new Account("Ava");
      account.deposit(100);
      console.log(account.withdraw(30));
      console.log(account.withdraw(100));
      console.log(`${account.owner}: ${account.getBalance()}`);
quiz:
  - q: What does the private keyword do to a property?
    options: ["It deletes the property", "It makes the property read-only", "It only allows code inside the class to use it"]
    answer: 2
  - q: What does readonly mean?
    options: ["The value can be set once but not changed afterwards", "The value is hidden", "The value must be a string"]
    answer: 0
  - q: 'What does  constructor(public name: string) {}  do?'
    options: ["Declares a method called name", "Creates a public property name and assigns the argument to it", "Nothing, public is not allowed there"]
    answer: 1
    explain: "This shortcut is called a parameter property. It saves you from declaring and assigning the property by hand."
  - q: How do you create an object from a class?
    options: ["Account.create()", "make Account()", "new Account(...)"]
    answer: 2
---

A **class** is a blueprint for objects that have both data (properties) and behaviour (methods). TypeScript adds types to classes, plus keywords that control who may touch what.

## A typed class

```ts
class Dog {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  bark(): string {
    return `${this.name} says woof`;
  }
}

const rex = new Dog("Rex");
console.log(rex.bark()); // prints: Rex says woof
```

- `name: string;` declares a property and its type.
- `constructor` runs once when you write `new Dog("Rex")`. Its parameters get types like any function.
- Inside the class, `this` means "the object being worked on".
- `bark(): string` is a method. It is a function that lives inside the class.

## Access modifiers

Not everything should be reachable from the outside. TypeScript gives you three keywords:

| Keyword | Who can use the property |
| --- | --- |
| `public` | everyone (this is the default) |
| `private` | only code inside the class |
| `protected` | the class and classes that extend it |

```ts
class Counter {
  private count = 0;

  increment(): void {
    this.count++;
  }

  get value(): number {
    return this.count;
  }
}

const c = new Counter();
c.increment();
console.log(c.value); // prints: 1
c.count = 100;        // error: Property 'count' is private and only accessible within class 'Counter'.
```

Making data private means other code can only change it through your methods, so you can keep rules in one place, for example "you cannot withdraw more than the balance".

## readonly

`readonly` allows a property to be set in the constructor but never changed afterwards:

```ts
class User {
  readonly id: number;
  constructor(id: number) { this.id = id; }
}

const u = new User(7);
u.id = 8; // error: Cannot assign to 'id' because it is a read-only property.
```

## Parameter properties (a shortcut)

Putting a modifier in front of a constructor parameter declares and assigns the property in one go:

```ts
class Point {
  constructor(public x: number, public y: number) {}
}

const p = new Point(3, 4);
console.log(p.x + p.y); // prints: 7
```

> **Watch out:**
> - Forgetting `new`: `Class constructor Dog cannot be invoked without 'new'`.
> - Forgetting `this.` inside a method. `name` alone is a different (usually undefined) variable. You will see `Cannot find name 'name'`.
> - `private` is checked by TypeScript only. At run time the property is still a normal one. For true run-time privacy JavaScript has `#name`.

> **Your turn:** make `owner` `readonly` and `balance` `private`, and add a `withdraw(amount: number): boolean` method that refuses to overdraw.
