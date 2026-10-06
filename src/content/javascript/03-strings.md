---
title: Strings and template literals
summary: Work with text - join it, measure it, slice it and transform it.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const first = "Ada";
      const last = "Lovelace";

      // 1. Make fullName with a template literal: first, a space, then last
      // 2. Print: Hello, Ada Lovelace!  (use a template literal again)
      // 3. Print fullName in capital letters (toUpperCase)
      // 4. Print how many characters fullName has (length)
      // 5. Print only the first 3 letters of fullName (slice)
      // 6. Print true or false: does fullName include "Love"? (includes)

check:
  output: |
    Hello, Ada Lovelace!
    ADA LOVELACE
    12
    Ada
    true
  code:
    - pattern: "`[^`]*\\$\\{[^}]+\\}[^`]*`"
      message: "Use a template literal: backticks with ${...} inside."
    - pattern: "toUpperCase\\("
      message: "Use toUpperCase() to make capitals."
    - pattern: "\\.length"
      message: "Use .length to count the characters."
    - pattern: "\\.slice\\(|\\.substring\\("
      message: "Use slice() to take the first letters."
    - pattern: "\\.includes\\("
      message: "Use includes() to search inside a string."
hints:
  - "Backticks (the key left of 1 on most keyboards) create template literals that can hold variables inside special slots."
  - "A slot looks like ${variableName}. For the methods: fullName.toUpperCase(), fullName.length (no parentheses), fullName.slice(0, 3) and fullName.includes(\"Love\")."
  - "const fullName = `${first} ${last}`;  console.log(`Hello, ${fullName}!`);  console.log(fullName.toUpperCase());  console.log(fullName.length);  console.log(fullName.slice(0, 3));  console.log(fullName.includes(\"Love\"));"
solution:
  - code: |
      const first = "Ada";
      const last = "Lovelace";

      const fullName = `${first} ${last}`;
      console.log(`Hello, ${fullName}!`);
      console.log(fullName.toUpperCase());
      console.log(fullName.length);
      console.log(fullName.slice(0, 3));
      console.log(fullName.includes("Love"));
quiz:
  - q: Which quotes create a template literal?
    options: ["Double quotes \"\"", "Single quotes ''", "Backticks"]
    answer: 2
  - q: 'What does  "hello".length  give?'
    options: ["4", "5", "6"]
    answer: 1
  - q: 'What does  "JavaScript".slice(0, 4)  give?'
    options: ["Java", "JavaS", "avaS"]
    answer: 0
    explain: slice(start, end) takes the characters from start up to, but not including, end. Counting starts at 0.
  - q: 'What is "5" + 3 in JavaScript?'
    options: ["8", "53", "An error"]
    answer: 1
    explain: With a string on one side, + joins text, so the number 3 becomes "3" and the result is the string "53".
---

Almost every program works with text: names, messages, search words. In JavaScript, text is a **string**. In this lesson you will learn to build strings, measure them and transform them.

## Three kinds of quotes

```js
const a = "double quotes";
const b = 'single quotes';
const c = `backticks`;
```

Double and single quotes behave the same. Backticks create a **template literal**, which is more powerful.

## Template literals

A template literal lets you drop values straight into text using `${ ... }`:

```js
const name = "Ava";
const age = 21;
console.log(`${name} is ${age} years old.`); // prints: Ava is 21 years old.
```

Inside `${ }` you can put any expression, even maths: `` `Next year: ${age + 1}` `` gives `Next year: 22`. Compare that with the older way, which needs lots of `+` and quote marks: `name + " is " + age + " years old."`. Template literals also allow text over multiple lines.

## Counting characters

Every string has a `.length` property (no parentheses) that tells you how many characters it holds, including spaces:

```js
console.log("Hello there".length); // prints: 11
```

## Picking characters out

Positions in a string start at **0**:

```js
const word = "JavaScript";
console.log(word[0]);          // prints: J
console.log(word.slice(0, 4)); // prints: Java  (from 0 up to, not including, 4)
console.log(word.slice(4));    // prints: Script  (from 4 to the end)
```

## Useful string methods

A string comes with built-in tools called **methods**. You call them with a dot and parentheses:

| Method | What it does | Example result |
| --- | --- | --- |
| `toUpperCase()` | Capital letters | `"hi".toUpperCase()` gives `"HI"` |
| `toLowerCase()` | Small letters | `"HI".toLowerCase()` gives `"hi"` |
| `includes(text)` | Is the text inside? | `"hello".includes("ell")` gives `true` |
| `trim()` | Removes spaces from both ends | `"  hi ".trim()` gives `"hi"` |
| `replace(a, b)` | Replaces the first match | `"cat".replace("c", "b")` gives `"bat"` |
| `split(sep)` | Cuts into an array | `"a,b".split(",")` gives `["a", "b"]` |

Methods do **not** change the original string. They give you a new one:

```js
const shout = "hello".toUpperCase();
```

> **Watch out:**
> - Writing `.length()` with parentheses gives `TypeError: word.length is not a function`. `length` is a property, so no parentheses.
> - Writing `toUpperCase` without the parentheses prints the function itself, not the new text. Always call it with `()`.
> - Using single quotes or double quotes for `${...}`. Only backticks do the substitution; `"${name}"` prints the characters literally.
> - Forgetting that counting starts at 0, so `word[1]` is the second letter.
> - Expecting the original to change: `name.toUpperCase();` alone does nothing visible. Store the result or print it.
> - Mixing `+` with numbers and strings: `"5" + 3` is `"53"`, not `8`.

## Going further

Try `fullName.toLowerCase()`, `fullName.replace("Ada", "Augusta")` and `fullName.split(" ")`. Print the last letter with `fullName[fullName.length - 1]`.

> **Your turn:** follow the numbered comments: build `fullName` with a template literal, then print the greeting, the capitals, the length, the first three letters and whether it includes `"Love"`.
