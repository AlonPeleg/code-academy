---
title: Node.js vs the browser
summary: Learn what changes when JavaScript runs outside the browser - process, __dirname, global values and environment variables.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const path = require('path');

      // 1. Node has a global object called process; a browser does not.
      //    Make isNode true when the type of process is not "undefined".
      const isNode = null;
      console.log('Running in Node: ' + isNode);

      // 2. A browser has an object called window; Node does not.
      //    Make hasWindow true or false in the same way (check the type of window).
      const hasWindow = null;
      console.log('Has window: ' + hasWindow);

      // 3. Environment variables live in process.env. APP_NAME is set for you.
      //    Read it, and fall back to the text 'stranger' when it is missing.
      process.env.APP_NAME = 'Academy';
      const appName = null;
      console.log('Hello, ' + appName);

      // 4. The extra command line words (after "node main.js") are in the list
      //    process.argv, starting at position 2. Count them.
      const extraCount = null;
      console.log('Extra arguments: ' + extraCount);

      // 5. Build a safe file path inside this script's folder:
      //    the folder (__dirname), then 'data', then 'notes.txt', joined by the path module.
      const file = '';
      console.log('File name: ' + path.basename(file));
      console.log('Extension: ' + path.extname(file));
      console.log('Folder name: ' + path.basename(path.dirname(file)));

      // 6. Put the number 42 on the global object under the name answer,
      //    so the line below can read it as a plain variable.
      console.log('Global value: ' + (typeof answer === 'undefined' ? 'missing' : answer));
check:
  output: |
    Running in Node: true
    Has window: false
    Hello, Academy
    Extra arguments: 0
    File name: notes.txt
    Extension: .txt
    Folder name: data
    Global value: 42
  code:
    - { pattern: 'typeof\s+window', message: "Use typeof window to find out whether a window exists." }
    - { pattern: 'process\.argv', message: "Read the command line words from process.argv." }
    - { pattern: 'path\.join\s*\(', message: "Build the path with path.join(...)." }
    - { pattern: 'globalThis\.|global\.', message: "Store the value with globalThis.answer = 42." }
hints:
  - "typeof gives the type of a value as text, and it never crashes on a name that does not exist (it answers 'undefined'). Compare its result with the text 'undefined' using === or !==."
  - "isNode: typeof process !== 'undefined'. hasWindow: typeof window !== 'undefined'. appName: process.env.APP_NAME || 'stranger'. extraCount: process.argv.slice(2).length. The global object is called globalThis."
  - "const isNode = typeof process !== 'undefined'; const hasWindow = typeof window !== 'undefined'; const appName = process.env.APP_NAME || 'stranger'; const extraCount = process.argv.slice(2).length; const file = path.join(__dirname, 'data', 'notes.txt'); globalThis.answer = 42;"
solution:
  - name: main.js
    code: |
      const path = require('path');

      const isNode = typeof process !== 'undefined';
      console.log('Running in Node: ' + isNode);

      const hasWindow = typeof window !== 'undefined';
      console.log('Has window: ' + hasWindow);

      process.env.APP_NAME = 'Academy';
      const appName = process.env.APP_NAME || 'stranger';
      console.log('Hello, ' + appName);

      const extraCount = process.argv.slice(2).length;
      console.log('Extra arguments: ' + extraCount);

      const file = path.join(__dirname, 'data', 'notes.txt');
      console.log('File name: ' + path.basename(file));
      console.log('Extension: ' + path.extname(file));
      console.log('Folder name: ' + path.basename(path.dirname(file)));

      globalThis.answer = 42;
      console.log('Global value: ' + (typeof answer === 'undefined' ? 'missing' : answer));
quiz:
  - q: "Which of these exists in Node.js but NOT in a web page?"
    options: ["process", "console.log", "setTimeout"]
    answer: 0
    explain: "process describes the running program (arguments, environment variables, exit codes). Browsers have no such object. console and setTimeout exist in both."
  - q: "What happens if Node.js code calls document.getElementById('x')?"
    options: ["It returns null", "It crashes with ReferenceError: document is not defined", "It creates a new page"]
    answer: 1
    explain: "There is no page in Node, so there is no document or window. The name does not exist at all."
  - q: "Where do you read the settings that were given to the program from outside, like a password or a port number?"
    options: ["window.location", "__dirname", "process.env"]
    answer: 2
  - q: "What does __dirname contain?"
    options: ["The name of the computer", "The folder of the file that is running", "The folder you typed the command in"]
    answer: 1
    explain: "__dirname is the folder that holds the current file. The folder you typed the command in is process.cwd(), and the two can differ."
---

You already know JavaScript from web pages. Node.js is the same language running **outside the browser**, on your computer or on a server. The language (variables, functions, `async`, classes) is identical, but the surroundings are different, and that is what this lesson is about. Once you know the differences you can read any Node program.

## Same language, different toolbox

A browser gives JavaScript a **page** to play with: `window`, `document`, `localStorage`, the DOM. Node has no page. Instead it gives your code tools for the **computer**: files, network servers, command line arguments, environment variables.

| Idea | In the browser | In Node.js |
| --- | --- | --- |
| Top-level object | `window` | `globalThis` (also called `global`) |
| Page access | `document`, `localStorage` | does not exist |
| Files and servers | not allowed | `fs`, `http` modules |
| Program info | not available | `process` |
| Folder of the file | not available | `__dirname`, `__filename` |
| Run it with | open an HTML file | `node main.js` in a terminal |

`console.log`, `setTimeout`, `fetch`, `JSON` and `Promise` work in both places.

> **Practice environment:** the lessons in this track run in a small practice Node inside the page. Files live in memory and the network is simulated, but the code you write is the same code you would run in real Node. Use the "Setup" button to see how to install Node on your own computer.

## The process object

`process` is a global object that describes your running program. You never need to import it.

```js
console.log(process.argv);          // the command line words: [node path, script path, ...extras]
console.log(process.argv.slice(2)); // only the extras you typed after "node main.js"
console.log(process.env.HOME);      // an environment variable (undefined if missing)
console.log(process.cwd());         // the folder you started the program from
```

If you ran `node main.js hello world`, then `process.argv.slice(2)` would be `["hello", "world"]`. The first two entries (the Node program and your script) are always there, which is why we skip them with `slice(2)`.

**Environment variables** are settings that live outside your code, such as a port number or a secret key. You read them from `process.env`. Because the value may be missing, give it a default with `||`:

```js
const port = process.env.PORT || 3000;
```

## Your file's location

Node knows where each file lives. `__dirname` is the folder that contains the current file and `__filename` is the full path of the file. Always build paths with the `path` module instead of gluing strings together, because Windows uses `\` and Linux and macOS use `/`:

```js
const path = require('path');
const file = path.join(__dirname, 'data', 'notes.txt');
path.basename(file); // "notes.txt"
path.extname(file);  // ".txt"
path.dirname(file);  // the folder that holds notes.txt
```

## The global object

In a browser a top-level `var x = 1` becomes `window.x`. In Node every file is its own **module**, so top-level variables stay private to that file. To share something globally you must put it on `globalThis` on purpose, and it is rarely a good idea:

```js
var local = 1;
globalThis.shared = 2;
console.log(globalThis.local); // undefined
console.log(shared);           // 2
```

> **Watch out:**
> - **Browser-only names.** Using `window`, `document` or `alert` in Node gives `ReferenceError: window is not defined`. Check with `typeof window !== 'undefined'` if the same code must run in both places. `typeof` never crashes, even for names that do not exist.
> - **Reading `process.env.PORT` as a number.** Environment variables are always text, so `process.env.PORT` is `"8080"`, not `8080`. Convert it with `Number(...)` when you need a number.
> - **Forgetting `slice(2)` on `process.argv`.** Without it your program also counts the Node executable and the script path as arguments.
> - **Building paths with `+ '/'`.** It breaks on Windows. Use `path.join`.

## Going further

Try `console.log(process.platform)` and `console.log(typeof require)`. The answer to the second one shows that `require` is a function Node hands to every file, and the next lessons are built on it.

> **Your turn:** complete the six numbered steps in `main.js`. Detect Node with `typeof process`, detect the missing `window`, read `process.env.APP_NAME` with a default, count the extra command line words, build `data/notes.txt` with `path.join(__dirname, ...)` and put 42 on `globalThis` as `answer`. Eight lines of output should appear.
