---
title: "Persistence, config and going live"
summary: Save data to a JSON file, read PORT and secrets from environment variables, allow browsers with CORS, and learn the checklist for deploying.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const express = require('express');
      const cors = require('cors');
      const path = require('path');
      const fs = require('fs');
      const { createStore } = require('./store');

      // Pretend the hosting platform set these environment variables for us:
      process.env.PORT = '4000';
      process.env.DATA_FILE = 'data/notes.json';

      // 1. Read the settings from process.env, with a default for local development:
      //    PORT: a number, default 3000
      //    DATA_FILE: default path.join(__dirname, 'data', 'notes.json')
      const PORT = 0; // TODO
      const DATA_FILE = ''; // TODO

      function buildApp() {
        const store = createStore(DATA_FILE);
        const notes = store.load(); // read what an earlier run saved
        let nextId = notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;

        const app = express();
        // 2. Let browsers on other websites call this API: register the CORS middleware
        //    (before the routes).
        app.use(express.json());

        app.get('/notes', (req, res) => res.json(notes));
        app.post('/notes', (req, res) => {
          const note = { id: nextId++, text: req.body.text };
          notes.push(note);
          store.save(notes); // write to disk after every change
          res.status(201).json(note);
        });
        return app;
      }

      // ---- demo (already written): run the server, stop it, start a NEW one ----
      async function send(base, method, path, body) {
        const options = { method };
        if (body) {
          options.headers = { 'Content-Type': 'application/json' };
          options.body = JSON.stringify(body);
        }
        return fetch(base + path, options);
      }

      const server1 = buildApp().listen(PORT);
      const base1 = 'http://localhost:' + server1.address().port;
      console.log('server 1 listening on port ' + server1.address().port);
      console.log('POST /notes -> ' + (await send(base1, 'POST', '/notes', { text: 'first note' })).status);
      console.log('POST /notes -> ' + (await send(base1, 'POST', '/notes', { text: 'second note' })).status);
      const normal = await send(base1, 'GET', '/notes');
      console.log('cors header: ' + normal.headers.get('access-control-allow-origin'));
      console.log('preflight: ' + (await send(base1, 'OPTIONS', '/notes')).status);
      server1.close();

      console.log('--- restart ---');
      const server2 = buildApp().listen(PORT); // a brand new app with empty memory
      const base2 = 'http://localhost:' + server2.address().port;
      console.log('server 2 listening on port ' + server2.address().port);
      const again = await send(base2, 'GET', '/notes');
      console.log('GET /notes -> ' + again.status + ' ' + (await again.text()));
      console.log('saved file exists: ' + fs.existsSync(DATA_FILE));
      server2.close();
  - name: store.js
    code: |
      const fs = require('fs');
      const path = require('path');

      // A tiny "database": one JSON file that holds an array.
      function createStore(file) {
        // 1. load(): when the file does not exist yet, return an empty array [].
        //    Otherwise read it as text and turn the text back into an array.
        function load() {
          return []; // TODO
        }

        // 2. save(items): make sure the folder of the file exists (recursive), then write the array
        //    as nicely formatted JSON text (indent of 2 spaces).
        function save(items) {
          // TODO
        }

        return { load, save };
      }

      module.exports = { createStore };
check:
  output: |
    server 1 listening on port 4000
    POST /notes -> 201
    POST /notes -> 201
    cors header: *
    preflight: 204
    --- restart ---
    server 2 listening on port 4000
    GET /notes -> 200 [{"id":1,"text":"first note"},{"id":2,"text":"second note"}]
    saved file exists: true
  code:
    - { file: 'main.js', pattern: 'process\.env\.PORT\s*\)?\s*\|\|', message: "Read the port with process.env.PORT and a default after ||." }
    - { file: 'main.js', pattern: 'app\.use\(\s*cors\(', message: "Register the middleware with app.use(cors())." }
    - { file: 'store.js', pattern: 'JSON\.parse', message: "Turn the file text back into data with JSON.parse." }
    - { file: 'store.js', pattern: 'JSON\.stringify', message: "Save with JSON.stringify(items, null, 2)." }
hints:
  - "Environment variables are always strings and may be missing, so read them with a default: Number(process.env.PORT) || 3000. The store keeps nothing in memory: load reads the file (when it exists) and parses it, save turns the array into text and writes it."
  - "load: if (!fs.existsSync(file)) return []; return JSON.parse(fs.readFileSync(file, 'utf8'));   save: fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(items, null, 2));"
  - "const PORT = Number(process.env.PORT) || 3000; const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'notes.json');   and inside buildApp, above express.json(): app.use(cors());"
solution:
  - name: main.js
    code: |
      const express = require('express');
      const cors = require('cors');
      const path = require('path');
      const fs = require('fs');
      const { createStore } = require('./store');

      // Pretend the hosting platform set these environment variables for us:
      process.env.PORT = '4000';
      process.env.DATA_FILE = 'data/notes.json';

      const PORT = Number(process.env.PORT) || 3000;
      const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'notes.json');

      function buildApp() {
        const store = createStore(DATA_FILE);
        const notes = store.load(); // read what an earlier run saved
        let nextId = notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;

        const app = express();
        app.use(cors());
        app.use(express.json());

        app.get('/notes', (req, res) => res.json(notes));
        app.post('/notes', (req, res) => {
          const note = { id: nextId++, text: req.body.text };
          notes.push(note);
          store.save(notes); // write to disk after every change
          res.status(201).json(note);
        });
        return app;
      }

      // ---- demo (already written): run the server, stop it, start a NEW one ----
      async function send(base, method, path, body) {
        const options = { method };
        if (body) {
          options.headers = { 'Content-Type': 'application/json' };
          options.body = JSON.stringify(body);
        }
        return fetch(base + path, options);
      }

      const server1 = buildApp().listen(PORT);
      const base1 = 'http://localhost:' + server1.address().port;
      console.log('server 1 listening on port ' + server1.address().port);
      console.log('POST /notes -> ' + (await send(base1, 'POST', '/notes', { text: 'first note' })).status);
      console.log('POST /notes -> ' + (await send(base1, 'POST', '/notes', { text: 'second note' })).status);
      const normal = await send(base1, 'GET', '/notes');
      console.log('cors header: ' + normal.headers.get('access-control-allow-origin'));
      console.log('preflight: ' + (await send(base1, 'OPTIONS', '/notes')).status);
      server1.close();

      console.log('--- restart ---');
      const server2 = buildApp().listen(PORT); // a brand new app with empty memory
      const base2 = 'http://localhost:' + server2.address().port;
      console.log('server 2 listening on port ' + server2.address().port);
      const again = await send(base2, 'GET', '/notes');
      console.log('GET /notes -> ' + again.status + ' ' + (await again.text()));
      console.log('saved file exists: ' + fs.existsSync(DATA_FILE));
      server2.close();
  - name: store.js
    code: |
      const fs = require('fs');
      const path = require('path');

      // A tiny "database": one JSON file that holds an array.
      function createStore(file) {
        function load() {
          if (!fs.existsSync(file)) return [];
          return JSON.parse(fs.readFileSync(file, 'utf8'));
        }

        function save(items) {
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, JSON.stringify(items, null, 2));
        }

        return { load, save };
      }

      module.exports = { createStore };
quiz:
  - q: "What type is process.env.PORT?"
    options: ["Always a string (or undefined when it is not set)", "A number", "A boolean"]
    answer: 0
    explain: "Environment variables are text. Convert with Number(...) and give a default for when it is missing."
  - q: "Why should secrets such as a token SECRET live in environment variables instead of the code?"
    options: ["Because variables run faster", "So they are not committed to Git, and each environment (laptop, server) can use its own value", "Because Node cannot read secrets from files"]
    answer: 1
  - q: "What does CORS protect, and who enforces it?"
    options: ["The server enforces it and blocks bad clients", "It encrypts the traffic", "The browser enforces it: it refuses to give a page the response of another origin unless the server allows it"]
    answer: 2
    explain: "CORS is not server security. Tools like curl or Postman ignore it, so you still need authentication."
  - q: "Why is a JSON file a poor choice once your app has many users?"
    options: ["Every write rewrites the whole file, and two requests writing at once can overwrite each other, so you move to a real database", "JSON cannot store numbers", "Node cannot read big files"]
    answer: 0
---
Your API works, but it forgets everything when it restarts, it has settings buried in the code, and browsers on other websites cannot talk to it. This final lesson fixes all three and gives you the checklist for putting a server on the internet.

## Persistence with a JSON file

Until now the data lived in a normal array, so it vanished whenever the program stopped. The simplest fix is a file: load it when the server starts, save it after every change. You already know the pieces from the `fs` lesson:

```js
function load() {
  if (!fs.existsSync(file)) return [];                 // first run: no file yet
  return JSON.parse(fs.readFileSync(file, 'utf8'));    // text -> array
}
function save(items) {
  fs.mkdirSync(path.dirname(file), { recursive: true }); // create the folder if needed
  fs.writeFileSync(file, JSON.stringify(items, null, 2)); // array -> text
}
```

`JSON.stringify(items, null, 2)` indents the file with two spaces so a human can read it. Keep this code in its own module (`store.js`) so the routes just call `store.load()` and `store.save(notes)`; later you can replace the file by a real database without touching the routes. In the demo below the program starts a second app after stopping the first: it finds the notes again because they were read from the file.

A JSON file is perfect for prototypes and small tools. It breaks down when many users write at once (each write replaces the whole file) or when the data is large. Then use a database such as SQLite, PostgreSQL or MongoDB. Also remember that many cloud hosts give your app a temporary disk that is wiped on every deploy, so a file store there needs a "persistent volume" or a database.

## Configuration with environment variables

Settings that change between your laptop and a server (the port, the data file, secrets) must not be hard-coded. The standard is **environment variables**, available in `process.env`:

```js
const PORT = Number(process.env.PORT) || 3000;
const SECRET = process.env.SECRET; // set on the server, never in Git
```

Three rules: values are always **strings** (convert with `Number`), a missing variable is `undefined` (give a default with `||` for harmless settings, but fail loudly for secrets), and secrets never go into your repository. On your own computer you can put them in a `.env` file (listed in `.gitignore`) and start Node with `node --env-file=.env server.js`, or use the `dotenv` package. Hosting platforms let you type the variables into a settings page, and they usually tell your app which port to use through `PORT`, which is why you must read it. `NODE_ENV=production` is another convention: libraries (and Express) switch to faster, quieter behaviour.

## CORS: letting browsers call your API

Browsers have a safety rule: JavaScript on `https://myapp.com` may not read answers from `https://api.other.com` unless that server explicitly agrees. This is the **same-origin policy**; the agreement is called **CORS** (Cross-Origin Resource Sharing). The server agrees by sending a header:

```
Access-Control-Allow-Origin: *
```

For requests that can change data, the browser first sends a **preflight** `OPTIONS` request asking "may I?", and expects a `204` with the allowed methods. The `cors` package does all of this as a middleware:

```js
app.use(cors());                                   // any website may call us
app.use(cors({ origin: 'https://myapp.com' }));   // only this one (better for production)
```

Register it before your routes. Remember: CORS is enforced by the browser only. `curl` and server programs ignore it, so it is not a replacement for authentication.

## The going-live checklist

- `package.json` has a start script: `"start": "node server.js"`, and the app listens on `process.env.PORT`.
- Secrets and `NODE_ENV=production` are set as environment variables on the host, never committed.
- The site is served over **HTTPS** (Render, Railway, Fly.io and similar platforms provide it for free).
- Your error handler hides internals; input is validated; passwords are hashed.
- Add `helmet` (safer default headers) and `express-rate-limit` (stops floods of requests), run `npm audit` now and then, and keep dependencies updated.
- Use real data storage that survives deploys, and keep backups.

The practice environment here is a safe imitation: its file system is in memory and its network is simulated. Real Node.js works the same way with a real disk and network; use the "Setup" button to see how to run these programs on your own computer.

> **Watch out:**
> - **`process.env.PORT` is a string.** `'4000' + 1` is `'40001'`. Use `Number(...)`.
> - **Writing the file before the folder exists.** `fs.writeFileSync` fails with `ENOENT: no such file or directory`. Create the folder with `mkdirSync(..., { recursive: true })`.
> - **`JSON.parse` on an empty or broken file** throws `SyntaxError: Unexpected end of JSON input`. Handle the first-run case with `existsSync`.
> - **Committing `.env`.** Once a secret is in Git history, treat it as leaked and replace it.
> - **Using `cors()` as security.** `*` means everybody; protect data with login, not with CORS.

> **Your turn:** write `load` and `save` in `store.js`, read `PORT` and `DATA_FILE` from `process.env` with defaults, and register `cors()` in `main.js`. The demo saves two notes, restarts the server and shows they are still there.
