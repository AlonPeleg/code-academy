---
title: Numbers and maths
summary: Calculate with operators and the built-in Math tools.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const price = 19.99;
      const quantity = 3;

      // 1. Print the total price (price times quantity) with exactly 2 decimals (toFixed)
      // 2. Print the remainder when 17 is divided by 5
      // 3. Print 7.9 rounded DOWN (Math.floor)
      // 4. Print 2 to the power of 10
      // 5. Turn the text "5" into a number (Number) and add 3 to it; print the result

check:
  output: |
    59.97
    2
    7
    1024
    8
  code:
    - pattern: "toFixed\\("
      message: "Use toFixed(2) to show 2 decimals."
    - pattern: "17\\s*%\\s*5"
      message: "Use the remainder operator with 17 and 5."
    - pattern: "Math\\.floor\\("
      message: "Use Math.floor() to round down."
    - pattern: "2\\s*\\*\\*\\s*10|Math\\.pow\\(\\s*2\\s*,\\s*10"
      message: "Use the power operator for 2 to the power of 10."
    - pattern: "Number\\("
      message: "Use Number() to convert the text to a number."
hints:
  - "Five small tasks, each using a different tool: multiplication plus a number-formatting method, the remainder operator, a Math function, the power operator and a conversion function."
  - "total.toFixed(2) prints two decimals. The remainder operator is the percent sign. Math.floor(7.9) rounds down. The power operator is two stars. Number(\"5\") converts text to a number."
  - "console.log((price * quantity).toFixed(2));  console.log(17 % 5);  console.log(Math.floor(7.9));  console.log(2 ** 10);  console.log(Number(\"5\") + 3);"
solution:
  - code: |
      const price = 19.99;
      const quantity = 3;

      console.log((price * quantity).toFixed(2));
      console.log(17 % 5);
      console.log(Math.floor(7.9));
      console.log(2 ** 10);
      console.log(Number("5") + 3);
quiz:
  - q: What does  10 % 3  give?
    options: ["3", "0", "1"]
    answer: 2
    explain: "% is the remainder operator. 10 divided by 3 is 3 with 1 left over."
  - q: What does  Math.round(4.5)  give?
    options: ["5", "4", "4.5"]
    answer: 0
  - q: 'What is  "10" - 4  in JavaScript?'
    options: ["\"104\"", "6", "NaN"]
    answer: 1
    explain: The minus operator only works on numbers, so JavaScript turns "10" into the number 10 first. (The plus operator would join the text instead.)
  - q: What does NaN stand for?
    options: ["Not a Number", "No answer needed", "New array name"]
    answer: 0
---

Numbers are the heart of any program: scores, prices, positions, timers. JavaScript has just one number type, used for whole numbers (`7`) and decimals (`3.14`) alike. In this lesson you will meet the maths operators and the built-in `Math` tools.

## The operators

| Operator | Meaning | Example | Result |
| --- | --- | --- | --- |
| `+` | add | `5 + 2` | `7` |
| `-` | subtract | `5 - 2` | `3` |
| `*` | multiply | `5 * 2` | `10` |
| `/` | divide | `5 / 2` | `2.5` |
| `%` | remainder | `5 % 2` | `1` |
| `**` | power | `2 ** 3` | `8` |

The **remainder** operator `%` answers "what is left after dividing?" It is very useful. `n % 2 === 0` is true for even numbers, and `n % 10` gives the last digit of a number.

JavaScript follows the usual order of operations: multiply and divide before add and subtract. Use brackets to be clear: `(1 + 2) * 3` is `9`.

## Shortcuts

```js
let score = 10;
score += 5;  // same as score = score + 5  -> 15
score -= 3;  // 12
score *= 2;  // 24
score++;     // add one -> 25
```

## Decimals and toFixed

Computers store decimals in a way that is sometimes slightly off:

```js
console.log(0.1 + 0.2); // prints: 0.30000000000000004
```

That is normal for almost every language. For money and display, round the result with `toFixed`, which returns **text** with a fixed number of decimals:

```js
const total = 19.99 * 3;
console.log(total.toFixed(2)); // prints: 59.97
```

## The Math object

`Math` has handy tools:

```js
Math.round(2.6);     // 3   nearest whole number
Math.floor(2.9);     // 2   always down
Math.ceil(2.1);      // 3   always up
Math.max(3, 9, 4);   // 9
Math.min(3, 9, 4);   // 3
Math.abs(-5);        // 5   remove the minus sign
Math.sqrt(81);       // 9   square root
Math.random();       // a random number from 0 up to (not including) 1
```

A random whole number from 1 to 6, like a dice: `Math.floor(Math.random() * 6) + 1`.

## Numbers and text

Text that looks like a number is still text. Use `Number(...)` to convert:

```js
console.log("5" + 3);          // prints: 53   (joined as text)
console.log(Number("5") + 3);  // prints: 8
console.log(Number("hello"));  // prints: NaN  (not a number)
```

`NaN` means "Not a Number". It is the result of maths that makes no sense.

> **Watch out:**
> - `"5" + 3` is `"53"`, not `8`. If one side of `+` is text, JavaScript joins instead of adding.
> - Dividing by zero does not crash: `5 / 0` is `Infinity`.
> - Comparing decimals: `0.1 + 0.2 === 0.3` is `false`. Round before you compare.
> - `x ** y` is the power. Writing `x ^ y` is something different (a bitwise operator) and gives odd numbers.
> - `toFixed` returns a string, so `total.toFixed(2) + 1` joins text, giving `"59.971"`.
> - Writing `Math.floor 7.9` without brackets is a `SyntaxError`.

## Going further

Print the area of a circle with radius 5: `Math.PI * 5 ** 2`, rounded to 2 decimals. Make a variable that holds a random dice roll.

> **Your turn:** follow the numbered comments and print the five results, one per line.
