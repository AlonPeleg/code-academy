---
title: Arrays and tuples
summary: Type lists of values, and fixed-size groups of mixed values.
level: beginner
runner: ts
files:
  - name: main.ts
    code: |
      // 1. Give scores the type: an array of numbers.
      // 2. Give entry the type: a tuple of a string followed by a number.
      // 3. Type the parameter of average as an array of numbers, and the result as a number.
      const scores = [80, 90, 100];
      const entry = ["Ava", 21];

      function average(numbers) {
        let sum = 0;
        for (const n of numbers) {
          sum += n;
        }
        return sum / numbers.length;
      }

      console.log(average(scores));
      console.log(`${entry[0]} is ${entry[1]}`);
check:
  output: |
    90
    Ava is 21
  code:
    - pattern: "scores\\s*:\\s*(number\\s*\\[\\s*\\]|Array\\s*<\\s*number\\s*>)"
      message: "Annotate scores as an array of numbers:  scores: number[]"
    - pattern: "entry\\s*:\\s*\\[\\s*string\\s*,\\s*number\\s*\\]"
      message: "Annotate entry as a tuple:  entry: [string, number]"
    - pattern: "numbers\\s*:\\s*(number\\s*\\[\\s*\\]|Array\\s*<\\s*number\\s*>)"
      message: "Annotate the parameter:  numbers: number[]"
    - pattern: "\\)\\s*:\\s*number\\s*\\{"
      message: "Add a return type to average:  ): number {"
hints:
  - "An array type is the type of the items followed by square brackets. A tuple lists one type per position, in order, inside square brackets."
  - "scores is a list of numbers. entry has exactly two positions: first a string, then a number. average takes the same kind of list as scores and returns a single number."
  - "const scores: number[] = [...];  const entry: [string, number] = [...];  function average(numbers: number[]): number {"
solution:
  - name: main.ts
    code: |
      const scores: number[] = [80, 90, 100];
      const entry: [string, number] = ["Ava", 21];

      function average(numbers: number[]): number {
        let sum = 0;
        for (const n of numbers) {
          sum += n;
        }
        return sum / numbers.length;
      }

      console.log(average(scores));
      console.log(`${entry[0]} is ${entry[1]}`);
quiz:
  - q: How do you write the type "an array of strings"?
    options: ["array<string>", "string[]", "[string]"]
    answer: 1
    explain: "Array<string> works too, but string[] is the usual way. [string] is a tuple with exactly one item."
  - q: What is special about a tuple like  [string, number] ?
    options: ["It can hold any number of items", "It can only hold numbers", "It has a fixed length and a known type at each position"]
    answer: 2
  - q: "What does TypeScript do with  const nums: number[] = [1, 2, \"3\"] ?"
    options: ["Shows an error for the string", "Converts \"3\" to a number", "Works silently"]
    answer: 0
  - q: What is the type of  names  after  const names = ["Ava", "Noam"] ?
    options: ["string[]", "[string, string]", "any"]
    answer: 0
---

Programs are full of lists. In this lesson you will learn how to say "this is a list of numbers", and how to describe a small fixed group of values like a name and an age.

## Arrays

An array type is the type of the items followed by `[]`:

```ts
const names: string[] = ["Ava", "Noam"];
const prices: number[] = [9.99, 4.5, 12];

names.push("Dana");     // fine
names.push(42);         // error: Argument of type 'number' is not assignable to parameter of type 'string'
```

If you create an array with values, TypeScript infers the type for you, so `const names = ["Ava", "Noam"]` is already a `string[]`. You need the annotation mostly for **empty arrays** and for **function parameters**:

```ts
const todo: string[] = [];   // without the annotation this would be an "evolving any" array

function total(prices: number[]): number {
  let sum = 0;
  for (const p of prices) sum += p;
  return sum;
}

console.log(total([1, 2, 3])); // prints: 6
```

You may also see `Array<number>`. It means exactly the same as `number[]`.

## Tuples

Sometimes you have a small group of values where each **position** has its own meaning, for example a name followed by an age. A **tuple** type lists the type for every position:

```ts
const person: [string, number] = ["Ava", 21];

console.log(person[0]); // prints: Ava  (TypeScript knows this is a string)
console.log(person[1]); // prints: 21   (and this is a number)
```

Compared with a plain array, a tuple has a **fixed length** and a **known type at each place**. So `["Ava"]`, `[21, "Ava"]` and `["Ava", 21, true]` are all errors for `[string, number]`.

Tuples are great for small pairs such as coordinates `[number, number]`, or for returning two values from a function.

```ts
function minMax(values: number[]): [number, number] {
  return [Math.min(...values), Math.max(...values)];
}

const [low, high] = minMax([4, 9, 2]);
console.log(low, high); // prints: 2 9
```

> **Watch out:**
> - `[string]` is a tuple with one item, not an array of strings. For a list of any length write `string[]`.
> - `Property 'push' does not exist...` or type errors on empty arrays: write the element type, for example `const items: string[] = [];`.
> - `Type '[string, number, boolean]' is not assignable to type '[string, number]'`: a tuple must have exactly the listed length.

> **Your turn:** annotate `scores` as `number[]`, `entry` as `[string, number]`, and give `average` a `number[]` parameter and a `number` return type.
