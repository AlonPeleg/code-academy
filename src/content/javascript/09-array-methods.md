---
title: Array methods - map, filter, reduce
summary: Transform, filter and combine lists without writing loops by hand.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const prices = [10, 25, 8, 40, 15];

      // 1. Double every price (map) and print them joined with ", "
      // 2. Keep only prices above 12 (filter) and print them joined with ", "
      // 3. Add all prices together (reduce) and print the total
      // 4. Find the first price above 30 (find) and print it
      // 5. Sort a COPY of the prices from small to large (sort) and print joined with ", "
      //    (the copy: [...prices])

check:
  output: |
    20, 50, 16, 80, 30
    25, 40, 15
    98
    40
    8, 10, 15, 25, 40
  code:
    - pattern: "\\.map\\("
      message: "Use map() to double every price."
    - pattern: "\\.filter\\("
      message: "Use filter() to keep prices above 12."
    - pattern: "\\.reduce\\("
      message: "Use reduce() to add the prices together."
    - pattern: "\\.find\\("
      message: "Use find() to get the first price above 30."
    - pattern: "\\.sort\\("
      message: "Use sort() to order the prices."
hints:
  - "Each task has its own array method: map transforms every item, filter keeps some, reduce combines into one value, find returns one item, and sort orders. Every one of them takes a small function."
  - "prices.map((p) => p * 2), prices.filter((p) => p > 12), prices.reduce((sum, p) => sum + p, 0), prices.find((p) => p > 30), and [...prices].sort((a, b) => a - b). Add .join(\", \") to print lists."
  - "console.log(prices.map((p) => p * 2).join(\", \"));  console.log(prices.filter((p) => p > 12).join(\", \"));  console.log(prices.reduce((sum, p) => sum + p, 0));  console.log(prices.find((p) => p > 30));  console.log([...prices].sort((a, b) => a - b).join(\", \"));"
solution:
  - code: |
      const prices = [10, 25, 8, 40, 15];

      console.log(prices.map((p) => p * 2).join(", "));
      console.log(prices.filter((p) => p > 12).join(", "));
      console.log(prices.reduce((sum, p) => sum + p, 0));
      console.log(prices.find((p) => p > 30));
      console.log([...prices].sort((a, b) => a - b).join(", "));
quiz:
  - q: What does  [1, 2, 3].map((n) => n * 10)  return?
    options: ["[10, 20, 30]", "60", "[1, 2, 3]"]
    answer: 0
  - q: Which method gives back ONE value built from all the items?
    options: ["map", "filter", "reduce"]
    answer: 2
  - q: What does filter return when no item passes the test?
    options: ["undefined", "An empty array", "An error"]
    answer: 1
  - q: Why do we write  (a, b) => a - b  when sorting numbers?
    options: ["Without it, sort() compares numbers as text and gives wrong order", "It makes the sort faster", "It sorts from large to small"]
    answer: 0
    explain: The default sort turns items into text, so 10 comes before 9. Subtracting tells sort to compare real numbers.
---

In the last lesson you used a loop and a `filter`. Modern JavaScript has a whole toolbox of **array methods** that do the common jobs in one readable line. The three most important are `map`, `filter` and `reduce`.

## The idea: pass a function

Each of these methods takes a **function** as its argument, and calls it for every item. You usually write that function as a short arrow function:

```js
const numbers = [1, 2, 3, 4];
numbers.map((n) => n * 10);
```

Here `(n) => n * 10` receives one item at a time as `n`.

## map: transform every item

`map` creates a new array of the **same length**, where each item is the result of your function.

```js
const doubled = [1, 2, 3].map((n) => n * 2);
console.log(doubled.join(", ")); // prints: 2, 4, 6

const names = ["ann", "bob"].map((s) => s.toUpperCase());
// ["ANN", "BOB"]
```

## filter: keep some items

`filter` creates a new array with only the items for which your function returns `true`.

```js
const big = [3, 8, 12, 5].filter((n) => n > 4);
console.log(big.join(", ")); // prints: 8, 12, 5
```

## reduce: boil down to one value

`reduce` walks through the array carrying a running **accumulator**. Your function receives the accumulator so far and the current item, and returns the new accumulator. The second argument of `reduce` is the starting value.

```js
const total = [5, 10, 15].reduce((sum, n) => sum + n, 0);
console.log(total); // prints: 30
```

Step by step: start `sum = 0`; then `0 + 5 = 5`; then `5 + 10 = 15`; then `15 + 15 = 30`.

## find, some, every

```js
const nums = [4, 9, 16];
nums.find((n) => n > 5);      // 9      the first match (or undefined)
nums.findIndex((n) => n > 5); // 1      its position (or -1)
nums.some((n) => n > 10);     // true   is at least one a match?
nums.every((n) => n > 10);    // false  do all match?
```

## sort

`sort` puts the items in order, and **changes the original array**. For numbers, give it a compare function:

```js
const sorted = [...prices].sort((a, b) => a - b); // small to large
```

If the function returns a negative number, `a` goes first. Without it, items are compared as text, so `[10, 9, 1].sort()` gives `[1, 10, 9]`. The three dots in `[...prices]` copy the array first (more on this later) so the original stays unchanged.

## Chaining

Because `map` and `filter` return arrays, you can chain them:

```js
const result = [1, 2, 3, 4, 5, 6]
  .filter((n) => n % 2 === 0)  // [2, 4, 6]
  .map((n) => n * n);          // [4, 16, 36]
console.log(result.join(", ")); // prints: 4, 16, 36
```

> **Watch out:**
> - Forgetting that `map` and `filter` return a **new** array. Writing `prices.map(...)` on its own line changes nothing; store or print the result.
> - Forgetting the starting value in `reduce`: without `0` the first item becomes the accumulator, which gives wrong answers for empty arrays (`TypeError: Reduce of empty array with no initial value`).
> - Using braces in an arrow function without `return`: `map((p) => { p * 2 })` returns `undefined` for each item. Either remove the braces or add `return`.
> - Sorting numbers without a compare function.
> - Calling `.sort()` directly on your data when you wanted to keep the original order. `sort` changes the array in place.
> - Calling `find` when nothing matches gives `undefined`, so check before using the result.

## Going further

Use `reduce` to find the largest number, or to count how many prices are above 12. Chain `filter`, `map` and `join` to print `"$25, $40, $15"`.

> **Your turn:** follow the numbered comments and use `map`, `filter`, `reduce`, `find` and `sort` to print the five lines.
