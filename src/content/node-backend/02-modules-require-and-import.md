---
title: Modules - splitting code into files
summary: Share code between files with module.exports and require, load JSON files, and learn the import/export alternative.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // main.js is the entry point: Node starts here and loads the other files.

      // 1. Load the three helper files and keep what they export.
      //    - the file calculator.js    (an object with functions)
      //    - the file greeter.js       (a single function)
      //    - the file settings.json    (Node turns JSON into an object for you)
      //    Remember: paths to your own files start with ./
      const calculator = null;
      const greet = null;
      const settings = null;

      // This one is already done. Look at counter.js to see what it prints when it loads.
      const counter = require('./counter');
      const counterAgain = require('./counter');

      console.log(calculator.add(0.1, 0.2));
      console.log(calculator.multiply(4, 6));
      console.log(typeof calculator.round2);
      console.log(greet('Ada'));
      console.log(settings.currency + ' ' + settings.price);
      console.log(counter.next());
      console.log(counterAgain.next());
      console.log(counter === counterAgain);
  - name: calculator.js
    code: |
      // A helper that only this file needs. It should stay PRIVATE.
      function round2(n) {
        return Math.round(n * 100) / 100;
      }

      function add(a, b) {
        return round2(a + b);
      }

      function multiply(a, b) {
        return round2(a * b);
      }

      // 2. Export an object with add and multiply (but NOT round2),
      //    so other files can use them.
  - name: greeter.js
    code: |
      function greet(name) {
        return 'Hello, ' + name + '!';
      }

      // 3. This file exports ONE thing: the greet function itself (not an object around it).
  - name: counter.js
    code: |
      console.log('counter.js is loading');

      let count = 0;

      module.exports = {
        next() {
          count += 1;
          return count;
        },
      };
  - name: settings.json
    code: |
      {
        "currency": "EUR",
        "price": 20
      }
check:
  output: |
    counter.js is loading
    0.3
    24
    undefined
    Hello, Ada!
    EUR 20
    1
    2
    true
  code:
    - { pattern: 'module\.exports', message: "Export from the helper files with module.exports." }
    - { pattern: 'require\(\s*[''"]\./calculator', message: "Load calculator.js with require('./calculator')." }
    - { pattern: 'require\(\s*[''"]\./greeter', message: "Load greeter.js with require('./greeter')." }
    - { pattern: 'require\(\s*[''"]\./settings', message: "Load the JSON file with require('./settings.json')." }
hints:
  - "A file shares things by assigning to module.exports. Another file receives exactly that value from require('./name'). Paths to your own files start with ./ and the .js ending is optional."
  - "calculator.js: module.exports = { add, multiply }; greeter.js: module.exports = greet; main.js: calculator = require('./calculator'), greet = require('./greeter'), settings = require('./settings.json')."
  - "In calculator.js add: module.exports = { add, multiply }; in greeter.js add: module.exports = greet; in main.js write: const calculator = require('./calculator'); const greet = require('./greeter'); const settings = require('./settings.json');"
solution:
  - name: main.js
    code: |
      const calculator = require('./calculator');
      const greet = require('./greeter');
      const settings = require('./settings.json');

      const counter = require('./counter');
      const counterAgain = require('./counter');

      console.log(calculator.add(0.1, 0.2));
      console.log(calculator.multiply(4, 6));
      console.log(typeof calculator.round2);
      console.log(greet('Ada'));
      console.log(settings.currency + ' ' + settings.price);
      console.log(counter.next());
      console.log(counterAgain.next());
      console.log(counter === counterAgain);
  - name: calculator.js
    code: |
      function round2(n) {
        return Math.round(n * 100) / 100;
      }

      function add(a, b) {
        return round2(a + b);
      }

      function multiply(a, b) {
        return round2(a * b);
      }

      module.exports = { add, multiply };
  - name: greeter.js
    code: |
      function greet(name) {
        return 'Hello, ' + name + '!';
      }

      module.exports = greet;
  - name: counter.js
    code: |
      console.log('counter.js is loading');

      let count = 0;

      module.exports = {
        next() {
          count += 1;
          return count;
        },
      };
  - name: settings.json
    code: |
      {
        "currency": "EUR",
        "price": 20
      }
quiz:
  - q: "What does require('./greeter') return?"
    options: ["Whatever greeter.js assigned to module.exports", "The text of the file greeter.js", "Every variable that is declared in greeter.js"]
    answer: 0
    explain: "Variables inside a file are private. Only what the file puts on module.exports travels to the file that calls require."
  - q: "A file is required twice in the same program. How many times does its code run?"
    options: ["Twice, once per require", "Once - Node remembers (caches) the result", "It depends on the file size"]
    answer: 1
    explain: "Node runs a module the first time it is required and hands back the same exports object afterwards. That is why counter and counterAgain are the same object."
  - q: "Which line is the ES module (import/export) way of exporting a function called add?"
    options: ["module.exports = add;", "require.export(add);", "export function add(a, b) { ... }"]
    answer: 2
  - q: "Why does require('./calculator') start with ./ while require('path') does not?"
    options: ["./ means 'a file next to me', a plain name means a built-in module or an installed package", "./ makes the file load faster", "Plain names are only for JSON files"]
    answer: 0
---

A tiny program fits in one file. A real server has dozens of files: routes, helpers, settings. Node's **module system** lets each file keep its own private variables and share only what it chooses to. By the end of this lesson you can split a program into files and load them again.

## One file is one module

In Node every file is a **module**. Variables and functions you declare in a file are private to it; another file cannot see them. To share something, a file puts it on a special object called `module.exports`. Another file receives that value from `require`:

```js
// math.js
function double(n) {
  return n * 2;
}
module.exports = double;
```

```js
// main.js
const double = require('./math');
console.log(double(21)); // prints: 42
```

Piece by piece:

- `module.exports = double` decides **what the file hands out**. It can be a function, an object, a class or a number.
- `require('./math')` runs `math.js` (the first time only) and gives back whatever it exported.
- The path `./math` means "the file `math.js` in the same folder". `./` starts in the current folder and `../` goes one folder up. The `.js` ending is optional. A name without `./`, such as `require('path')`, means a built-in module or an installed package.

## Exporting several things

Most of the time a file offers more than one thing, so you export an **object**. The importing file can take the object whole or pick the parts with destructuring:

```js
// shapes.js
const PI = 3.14159;
function circleArea(r) { return PI * r * r; }
module.exports = { PI, circleArea };   // shorthand for { PI: PI, circleArea: circleArea }

// main.js
const { circleArea } = require('./shapes');
```

Anything you do **not** list stays private. That is useful: it lets a file have helper functions that nobody else can depend on.

## Modules run once

Node caches every module. The first `require` runs the file and stores its exports; later calls return the **same object**. This is why a module can hold state, such as a counter or a list of users, that all other files share. It is also why a `console.log` at the top of a module prints only once, which you will see in the exercise.

## JSON files

`require` can also load a `.json` file. Node parses it for you and returns a plain object, so `require('./settings.json')` is a quick way to read configuration. (Lesson 3 shows how to read and write JSON with the file system.)

## The other style: import and export

JavaScript also has a newer, official module syntax called **ES modules**. It does the same job:

```js
// math.js
export function double(n) { return n * 2; }
export default function triple(n) { return n * 3; }

// main.js
import triple, { double } from './math.js';
import { readFileSync } from 'node:fs';
```

| | CommonJS (this track) | ES modules |
| --- | --- | --- |
| Share | `module.exports = ...` | `export` / `export default` |
| Load | `const x = require('./x')` | `import x from './x.js'` |
| Built-ins | `require('fs')` | `import fs from 'node:fs'` |

CommonJS is what most Node tutorials and older projects use, so this track uses it. In real Node a project normally picks one style: ES modules need `"type": "module"` in `package.json` (or the `.mjs` ending). The practice environment accepts both, so you can try each. Everything you learn about modules (private by default, shared by exporting, run once) is the same in both styles.

> **Watch out:**
> - **Forgetting `./`.** `require('calculator')` fails with `Cannot find module 'calculator'`, because Node looks for a built-in or an installed package. Use `require('./calculator')`.
> - **Forgetting to export.** If `calculator.js` never sets `module.exports`, you receive an empty object and `calculator.add is not a function` (a `TypeError`).
> - **Exporting the wrong shape.** `module.exports = { greet }` followed by `const greet = require('./greeter')` gives an object, so `greet('Ada')` fails with `greet is not a function`. Either export the function directly or destructure: `const { greet } = require(...)`.
> - **Circular requires.** If `a.js` requires `b.js` and `b.js` requires `a.js`, one of them sees a half-finished export. Move shared code to a third file.

## Going further

Rename the three files to use `export` and `import` instead (add `.js` to the import paths) and run again. In `greeter.js` you would write `export default function greet...`, and in `main.js` `import greet from './greeter.js'`.

> **Your turn:** make `main.js` work. In `calculator.js` export an object with `add` and `multiply` (not `round2`), in `greeter.js` export the `greet` function itself, and in `main.js` load the three files with `require`: `./calculator`, `./greeter` and `./settings.json`. Nine lines should print.
