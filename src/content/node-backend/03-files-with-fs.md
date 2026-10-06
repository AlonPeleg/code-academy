---
title: Reading and writing files with fs
summary: Use the fs module to create folders, write, read and append files, list a folder, and store data as JSON.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const fs = require('fs');
      const path = require('path');

      const dataDir = path.join(__dirname, 'data');
      const notesFile = path.join(dataDir, 'notes.json');
      const logFile = path.join(dataDir, 'log.txt');

      // 1. Create the data folder (the program starts with no files at all).
      console.log('folder exists: ' + fs.existsSync(dataDir));

      // 2. Save the array [{ id: 1, text: 'Buy milk' }] to notesFile as JSON text
      //    (turn the array into text first; use 2 spaces of indentation).

      // 3. Read notesFile back as text, turn it into an array again and keep it in notes.
      //    Add { id: 2, text: 'Learn Node' } to it and save the file again.
      let notes = [];
      console.log('notes saved: ' + notes.length);

      // 4. Add two lines to logFile, one after the other: "started" and "saved".
      //    Each line must end with a newline character. The file does not exist yet.
      console.log('log: ' + fs.readFileSync(logFile, 'utf8').trim().split('\n').join(' | '));

      // 5. List the names of the files inside dataDir.
      let names = [];
      console.log('files: ' + names.join(', '));

      // 6. Reading a file that does not exist throws an error. Catch it and print
      //    'error code: ' followed by the error's code property.

      // 7. Now the modern way. Read notesFile with the promise version of the
      //    file functions (use await) and print 'async notes: ' followed by the
      //    text of every note joined with ', '.

      // 8. Delete logFile, then print 'after delete: ' followed by the file names, joined with ', '.
check:
  output: |
    folder exists: true
    notes saved: 2
    log: started | saved
    files: log.txt, notes.json
    error code: ENOENT
    async notes: Buy milk, Learn Node
    after delete: notes.json
  code:
    - { pattern: 'mkdirSync|mkdir\s*\(', message: "Create the folder with fs.mkdirSync." }
    - { pattern: 'JSON\.stringify', message: "Turn the array into JSON text with JSON.stringify." }
    - { pattern: 'JSON\.parse', message: "Turn the text back into an array with JSON.parse." }
    - { pattern: 'appendFile', message: "Add lines to the log with fs.appendFileSync." }
    - { pattern: 'fs\.promises|require\(.fs/promises.\)', message: "Use the promise version: fs.promises.readFile." }
    - { pattern: 'unlinkSync|unlink\s*\(|rmSync', message: "Delete the file with fs.unlinkSync." }
hints:
  - "Most fs functions come in a Sync flavour that does the work immediately and gives you the result: mkdirSync, writeFileSync, readFileSync, appendFileSync, readdirSync, unlinkSync. File contents are text, so JSON data needs JSON.stringify before saving and JSON.parse after reading."
  - "Steps 2 and 3: fs.writeFileSync(notesFile, JSON.stringify(data, null, 2)); notes = JSON.parse(fs.readFileSync(notesFile, 'utf8')). Step 6: put the failing readFileSync inside try { } catch (error) { console.log('error code: ' + error.code); }. Step 7: const text = await fs.promises.readFile(notesFile, 'utf8');"
  - "fs.mkdirSync(dataDir, { recursive: true }); fs.writeFileSync(notesFile, JSON.stringify([{ id: 1, text: 'Buy milk' }], null, 2)); notes = JSON.parse(fs.readFileSync(notesFile, 'utf8')); notes.push({ id: 2, text: 'Learn Node' }); fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2)); fs.appendFileSync(logFile, 'started\\n'); fs.appendFileSync(logFile, 'saved\\n'); names = fs.readdirSync(dataDir); fs.unlinkSync(logFile);"
solution:
  - name: main.js
    code: |
      const fs = require('fs');
      const path = require('path');

      const dataDir = path.join(__dirname, 'data');
      const notesFile = path.join(dataDir, 'notes.json');
      const logFile = path.join(dataDir, 'log.txt');

      fs.mkdirSync(dataDir, { recursive: true });
      console.log('folder exists: ' + fs.existsSync(dataDir));

      fs.writeFileSync(notesFile, JSON.stringify([{ id: 1, text: 'Buy milk' }], null, 2));

      let notes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
      notes.push({ id: 2, text: 'Learn Node' });
      fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
      console.log('notes saved: ' + notes.length);

      fs.appendFileSync(logFile, 'started\n');
      fs.appendFileSync(logFile, 'saved\n');
      console.log('log: ' + fs.readFileSync(logFile, 'utf8').trim().split('\n').join(' | '));

      let names = fs.readdirSync(dataDir);
      console.log('files: ' + names.join(', '));

      try {
        fs.readFileSync(path.join(dataDir, 'missing.txt'), 'utf8');
      } catch (error) {
        console.log('error code: ' + error.code);
      }

      const text = await fs.promises.readFile(notesFile, 'utf8');
      const saved = JSON.parse(text);
      console.log('async notes: ' + saved.map((n) => n.text).join(', '));

      fs.unlinkSync(logFile);
      console.log('after delete: ' + fs.readdirSync(dataDir).join(', '));
quiz:
  - q: "Why does fs.readFileSync(file, 'utf8') need the 'utf8' argument to give you text?"
    options: ["Without it you get raw bytes (a Buffer), not a string", "Without it the file is not opened", "utf8 makes the read faster"]
    answer: 0
    explain: "A file is just bytes. The encoding 'utf8' tells Node to turn those bytes into a normal string."
  - q: "What is the difference between writeFileSync and appendFileSync?"
    options: ["They are the same function", "appendFileSync adds to the end, writeFileSync replaces the whole content", "writeFileSync only works for JSON"]
    answer: 1
  - q: "What do you get when you call fs.readFileSync on a file that does not exist?"
    options: ["An empty string", "undefined", "An error with code ENOENT is thrown"]
    answer: 2
    explain: "ENOENT means 'error, no entry': the path does not exist. Wrap the call in try/catch when the file may be missing."
  - q: "Why is the promise version (fs.promises) usually better for a server than the Sync version?"
    options: ["Sync functions cannot read JSON", "While a Sync call waits for the disk, the whole server is frozen and cannot answer anyone", "The promise version is always shorter"]
    answer: 1
---

Almost every backend reads or writes files: settings, uploaded pictures, logs, a little JSON "database". Node's built-in `fs` module (file system) does all of it. In this lesson you save and load data, create folders and handle the errors that files love to produce.

> **Practice environment:** the files you create here live in memory and disappear after each run, and the program starts with an empty `/app` folder. In real Node the same code writes to your real disk. Everything else is identical.

## Loading the module

`fs` is built in, so you require it without `./`. Build paths with `path.join(__dirname, ...)` so they work from any folder:

```js
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'hello.txt');
```

## The main functions

| Task | Function |
| --- | --- |
| Does it exist? | `fs.existsSync(path)` returns `true` or `false` |
| Make a folder | `fs.mkdirSync(path, { recursive: true })` |
| Write (replaces everything) | `fs.writeFileSync(path, text)` |
| Add to the end | `fs.appendFileSync(path, text)` |
| Read | `fs.readFileSync(path, 'utf8')` |
| List a folder | `fs.readdirSync(path)` returns an array of names |
| Delete a file | `fs.unlinkSync(path)` |

```js
fs.writeFileSync(file, 'line 1\n');
fs.appendFileSync(file, 'line 2\n');
const text = fs.readFileSync(file, 'utf8');
console.log(text);
// prints:
// line 1
// line 2
```

Three details: `'\n'` is the newline character that ends a line; `'utf8'` tells Node to give you a string and not raw bytes; and `{ recursive: true }` makes `mkdirSync` create every missing folder on the way and not complain if the folder is already there.

## JSON files

A file only holds text, but your program works with arrays and objects. **JSON** is the bridge:

```js
const users = [{ id: 1, name: 'Ada' }];
fs.writeFileSync('users.json', JSON.stringify(users, null, 2)); // object -> text
const back = JSON.parse(fs.readFileSync('users.json', 'utf8')); // text -> object
```

`JSON.stringify(value, null, 2)` makes the text pretty, with 2 spaces of indentation. The pattern "read, change, write" is how a small project stores data without a database.

## Three flavours of the same function

Every function exists in three styles:

```js
// 1. Sync: waits and returns the result (simple, but blocks everything else)
const a = fs.readFileSync(file, 'utf8');

// 2. Callback: the result arrives later in a function you give
fs.readFile(file, 'utf8', (error, data) => { /* ... */ });

// 3. Promise: use with await (best for servers)
const b = await fs.promises.readFile(file, 'utf8');
```

While a Sync call waits for the disk, nothing else in your program can run. That is fine for a start-up script that loads settings once, but a web server answering many people should use the promise version. You will meet callbacks and promises properly in the next lesson.

## Handling errors

Files are unreliable: they may not exist, or the folder is missing. Node reports this with an error whose `code` property tells you why:

```js
try {
  fs.readFileSync('missing.txt', 'utf8');
} catch (error) {
  console.log(error.code);    // ENOENT
  console.log(error.message); // ENOENT: no such file or directory, open 'missing.txt'
}
```

> **Watch out:**
> - **`ENOENT: no such file or directory`.** The path is wrong or the folder does not exist yet. Create the folder first with `mkdirSync(..., { recursive: true })`, and use `path.join(__dirname, ...)` so the path does not depend on where you started the program.
> - **Forgetting the encoding.** Without `'utf8'`, `readFileSync` returns a Buffer (bytes), and `JSON.parse(buffer)` or `text.split` surprises you. Use `.toString()` or pass `'utf8'`.
> - **Saving an object directly.** `fs.writeFileSync('a.json', obj)` writes `[object Object]`. Use `JSON.stringify(obj)`.
> - **`SyntaxError: Unexpected end of JSON input`.** You parsed an empty or half-written file. Check that the file has content before calling `JSON.parse`.
> - **Using `writeFileSync` to add a line.** It replaces the whole file. Use `appendFileSync`.

## Going further

Wrap "read the JSON file, or return an empty array if it does not exist" in a function called `loadNotes()` and use `fs.existsSync` first. You will use exactly this idea to give an API a file-based database in a later lesson.

> **Your turn:** follow the eight numbered steps in `main.js`: create the `data` folder, save and re-load `notes.json`, append two lines to `log.txt`, list the folder, catch the `ENOENT` error, read the notes with `fs.promises.readFile` and finally delete the log file.
