---
title: Typed functions
summary: Type parameters and results, and make some arguments optional or give them defaults.
level: beginner
runner: ts
files:
  - name: main.ts
    code: |
      // 1. Type greet: name is a string, greeting is an OPTIONAL string, and it returns a string.
      // 2. Type repeat: text is a string, times is a number that DEFAULTS to 2, and it returns void.
      function greet(name, greeting) {
        return `${greeting ?? "Hello"}, ${name}!`;
      }

      function repeat(text, times) {
        for (let i = 0; i < times; i++) {
          console.log(text);
        }
      }

      console.log(greet("Ava"));
      console.log(greet("Noam", "Good morning"));
      repeat("Done");
check:
  output: |
    Hello, Ava!
    Good morning, Noam!
    Done
    Done
  code:
    - pattern: "\\bname\\s*:\\s*string"
      message: "Annotate name:  name: string"
    - pattern: "greeting\\s*\\?\\s*:\\s*string"
      message: "Make greeting optional with a question mark:  greeting?: string"
    - pattern: "times\\s*:\\s*number\\s*=\\s*2"
      message: "Give times a type and a default:  times: number = 2"
    - pattern: "\\)\\s*:\\s*void\\s*\\{"
      message: "repeat gives nothing back, so add the return type:  ): void {"
hints:
  - "A question mark after a parameter name makes it optional. A default value is written with an equals sign after the type."
  - "greet needs name: string and greeting?: string with a string return type. repeat needs text: string, times: number = 2, and the return type void."
  - "function greet(name: string, greeting?: string): string {   and   function repeat(text: string, times: number = 2): void {"
solution:
  - name: main.ts
    code: |
      function greet(name: string, greeting?: string): string {
        return `${greeting ?? "Hello"}, ${name}!`;
      }

      function repeat(text: string, times: number = 2): void {
        for (let i = 0; i < times; i++) {
          console.log(text);
        }
      }

      console.log(greet("Ava"));
      console.log(greet("Noam", "Good morning"));
      repeat("Done");
quiz:
  - q: 'What does the ? mean in  function f(x?: number) ?'
    options: ["x must be a number or a string", "x may be left out when calling f", "f returns a question"]
    answer: 1
  - q: What return type do you give a function that returns nothing?
    options: ["null", "never", "void"]
    answer: 2
  - q: "What is the type of the parameter  times  in  function repeat(times = 3) ?"
    options: ["number, inferred from the default value", "any", "It is an error without an annotation"]
    answer: 0
  - q: Where does a required parameter have to go compared with optional ones?
    options: ["Required parameters come first", "Optional parameters come first", "The order does not matter"]
    answer: 0
    explain: "Otherwise the caller could not skip the optional one. TypeScript reports 'A required parameter cannot follow an optional parameter'."
---

Functions are where types pay off the most. A typed function documents itself: anyone calling it knows what to pass in and what they will get back.

## Parameters and return type

```ts
function area(width: number, height: number): number {
  return width * height;
}

console.log(area(3, 4)); // prints: 12
```

- Each parameter gets its own `name: type`.
- The type after the parentheses is the **return type**.
- TypeScript can usually work out the return type from the `return` statement, but writing it is a good habit for exported or important functions, and it catches the case where you return the wrong thing by accident.

If a function does its work but gives nothing back (like printing), its return type is **`void`**:

```ts
function sayHi(name: string): void {
  console.log("Hi " + name);
}
```

## Optional parameters

Add a question mark after the name to let callers leave an argument out. Inside the function the value is then either the type you wrote or `undefined`, so you have to handle both:

```ts
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}!`;
}

greet("Ava");               // Hello, Ava!
greet("Noam", "Good day");  // Good day, Noam!
```

The `??` operator means "use the value on the left, unless it is `undefined` or `null`; then use the right side".

## Default values

A **default value** is a nicer way to say "if nothing is passed, use this":

```ts
function repeat(text: string, times: number = 2): void {
  for (let i = 0; i < times; i++) console.log(text);
}

repeat("Hi");      // prints Hi twice
repeat("Hi", 3);   // prints Hi three times
```

A parameter with a default is automatically optional, and TypeScript infers its type from the default, so `times = 2` alone would also be a `number`.

## Function types

Functions are values too, so they have types. An arrow function type lists the parameters and the result:

```ts
const double: (n: number) => number = (n) => n * 2;
```

You will use this a lot when a function takes another function as an argument.

> **Watch out:**
> - Calling with the wrong number of arguments: `Expected 2 arguments, but got 1.` If the second one should be optional, add the `?`.
> - `A required parameter cannot follow an optional parameter`: put the required ones first.
> - Forgetting `void` does not break anything, but if you annotate a function `: number` and forget to return, you get `A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value`.

> **Your turn:** type `greet` (optional `greeting`, returns a string) and `repeat` (`times` defaults to `2`, returns `void`).
