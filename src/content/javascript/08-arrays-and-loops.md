---
title: Arrays and loops
summary: Work with lists of values.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const numbers = [1, 2, 3, 4, 5, 6];

      // 1. Use a loop to add up all the numbers into `sum`
      let sum = 0;

      // 2. Use filter to build an array `evens` with only the even numbers
      const evens = [];

      console.log(sum);
      console.log(evens);
check:
  output: |
    21
    [2, 4, 6]
hints:
  - "The first part is a loop over the array with an accumulator (a variable you add to). The second part needs an array method that keeps only some items."
  - "for (const n of numbers) goes through every item. For the evens, numbers.filter(...) takes a small function that returns true for the items to keep. Even means the remainder after dividing by 2 is 0."
  - "for (const n of numbers) { sum += n; }   and   const evens = numbers.filter((n) => n % 2 === 0);"
solution:
  - code: |
      const numbers = [1, 2, 3, 4, 5, 6];

      let sum = 0;
      for (const n of numbers) {
        sum += n;
      }

      const evens = numbers.filter((n) => n % 2 === 0);

      console.log(sum);
      console.log(evens);
quiz:
  - q: What is the index of the first item in an array?
    options: ["1", "-1", "0"]
    answer: 2
  - q: What does  [10, 20, 30].length  give?
    options: ["3", "2", "30"]
    answer: 0
  - q: What does  n % 2 === 0  test?
    options: ["n is odd", "n is even", "n equals 2"]
    answer: 1
    explain: "% is the remainder operator. An even number leaves remainder 0 when divided by 2."
  - q: Which method adds an item to the END of an array?
    options: ["push", "pop", "shift"]
    answer: 0
---

Real programs rarely deal with a single value. They deal with collections: a list of names, scores, products. In JavaScript, an **array** is an ordered list of values. Combine it with a loop and you can process any amount of data with a few lines.

## Creating and reading an array

```js
const fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]);     // prints: apple
console.log(fruits[2]);     // prints: cherry
console.log(fruits.length); // prints: 3
```

- Items are separated by commas inside square brackets `[ ]`.
- Each item has an **index**, its position, and **counting starts at 0**. The last item is at `length - 1`.
- `array.length` tells you how many items there are.
- An array can hold any type of value, and mixed types too.

## Changing an array

```js
fruits.push("date");        // add to the end
fruits.pop();               // remove the last item
fruits[0] = "avocado";      // replace the first item
console.log(fruits);        // prints: ["avocado", "banana", "cherry"]
```

Even though `fruits` is a `const`, you may change what is *inside*. What `const` prevents is pointing the name at a different array.

## Looping through an array

`for...of` visits each item in turn:

```js
for (const fruit of fruits) {
  console.log(fruit);
}
```

On each round, `fruit` holds the next item. If you also need the position, use a regular `for` loop with `i`:

```js
for (let i = 0; i < fruits.length; i++) {
  console.log(i + ": " + fruits[i]);
}
```

## Accumulating

To sum numbers, start with a variable at `0` and add each item to it:

```js
let sum = 0;
for (const n of [5, 10, 15]) {
  sum += n;
}
console.log(sum); // prints: 30
```

## Filtering

Arrays have built-in methods for common jobs. `filter` creates a **new array** with only the items that pass a test. The test is a small function that returns `true` (keep) or `false` (drop):

```js
const big = [3, 8, 12, 5].filter((n) => n > 4);
console.log(big); // prints: [8, 12, 5]
```

The original array is left alone. You will meet more of these methods in the next lessons.

## Useful extras

| Code | Result |
| --- | --- |
| `fruits.includes("banana")` | `true` if it is in the array |
| `fruits.indexOf("cherry")` | its position, or `-1` if missing |
| `fruits.join(", ")` | `"apple, banana, cherry"` as one string |
| `fruits.slice(0, 2)` | a copy of the first two items |

> **Watch out:**
> - Off-by-one errors: `fruits[3]` on a 3-item array gives `undefined`, because the last index is 2.
> - Reading a property of `undefined`: `fruits[10].length` fails with `TypeError: Cannot read properties of undefined (reading 'length')`.
> - Using `for...in` instead of `for...of`: `for (const x in arr)` gives the indexes as text, not the values.
> - Writing `sum` inside the loop, so it restarts from 0 every round.
> - Expecting `filter` to change the original array. It returns a new one, so store it in a variable.
> - Forgetting `return` in a `filter` function that uses braces: `filter((n) => { n > 2 })` keeps nothing, because the function returns `undefined`.

## Going further

Print the biggest number in the array using a loop and a variable that remembers the largest so far. Use `filter` to keep only numbers greater than 3.

> **Your turn:** compute `sum` with a loop and build `evens` with `filter`.
