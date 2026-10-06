# Code Academy

A "learn to code" website with lessons, quizzes and a multi-language sandbox. Everything runs in the browser except compiled languages (C, C++, C#, Java, Go, Rust), which are sent to a code-execution server.

## Run it

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

To make a production build (a static site you can host anywhere, e.g. GitHub Pages):

```bash
npm run build      # output goes to dist/
npm run preview    # try the build locally
```

`npm run dev` and `npm run build` first copy the Python runtime (Pyodide) from `node_modules` into `public/pyodide`. That is automatic.

## What is in it

| Area | How it runs |
| --- | --- |
| HTML / CSS / JS | Sandboxed iframe with live preview + console |
| JavaScript, TypeScript | Web Worker (infinite loops are stopped after 5 s). TypeScript is type-checked live by the editor |
| React (JSX / TSX) | Compiled in the browser with Sucrase, React bundled locally (no CDN) |
| Python | Pyodide (real CPython compiled to WebAssembly), runs in a worker. `input()` reads from the Input tab |
| SQL | SQLite in the browser (sql.js) with a sample database |
| C, C++, C#, Java, Go, Rust | Sent to a Judge0 or Piston server (see below) |
| Python with NumPy, pandas, matplotlib, scikit-learn | Pyodide. These libraries download from the Pyodide CDN (cdn.jsdelivr.net) the first time a program imports them, then your browser caches them. Plots from `plt.show()` appear in the output panel |
| CSS frameworks | Bootstrap and Tailwind CDN tags in your HTML are swapped for copies bundled with the academy, so they work offline in the preview (see `inlineLibraries` in `src/runners/webDoc.ts`) |
| Multi-page sites | A web lesson can have several `.html` pages and folders (`css/style.css`). Links between the pages work in the preview, and `check.page` says which page a check looks at |
| REST and SOAP lessons | A built-in practice server (`src/runners/apiMock.js`) answers `fetch('https://api.academy.test/...')` inside the JavaScript runner and the HTML/React previews. It works offline and resets on every run |
| JavaScript games | Live: the program draws on an OffscreenCanvas in a worker with the `game` object (same engine as Python) |
| Python games | Live: Pyodide in a worker draws to a canvas (`import game`), keyboard and mouse are forwarded |
| C, C++, C# games | Replay: the program runs on the server with a scripted player, then the browser plays the recorded frames back |

**Editor:** Monaco (the editor from VS Code). HTML, CSS, JavaScript and TypeScript get full IntelliSense from Monaco itself. `src/monaco/intellisense.ts` adds autocomplete (keywords, built-ins, snippets) for Python, C, C++, C#, Java, Go and Rust, plus table/column names for SQL. `src/monaco/reactTypes.ts` gives React hooks autocomplete and hover docs.

Progress and your code are saved in the browser (`localStorage`).

**Hints:** every lesson has a **Hint** button with three levels, from a gentle nudge to nearly the answer. The **Solution** button shows the full answer.

## What there is to learn

Beginner to advanced lessons (each has a level label) in: HTML & CSS, CSS Frameworks (Bootstrap and Tailwind), JavaScript, TypeScript, React, Python, SQL, C, C++, C#, Java, Go and Rust. In the **Data, AI and APIs** section: Machine Learning (24 lessons, from NumPy and pandas to training a neural network by hand), REST & SOAP APIs and Algorithms & Data Structures. In **Guided projects**: a to-do app, a React people directory, an API client library, an expense tracker, a chatbot, a library database, a house price predictor, a multi-page portfolio website (Bootstrap) and a multi-file React dev blog. And **Make games** in Python, JavaScript, C, C++ and C#.

## Game lessons

The home page has a **Make games** section (Python, C, C++, C# tracks) built on a tiny 320x240 engine.

- **Python and JavaScript** are live (`import game` in Python, the global `game` object in JavaScript, then `game.run(update, draw)`). Click the game and play it with the keyboard. **Check answer** runs it headless with scripted key presses and tests the result.
- **C / C++ / C#** cannot run live in a browser. Your program is compiled on the run server and driven by a scripted player (the **Player input** tab: one `<frame> <key> <down|up>` line per event). It prints draw commands, and the browser plays the frames back. Edit the input lines to "play" differently. **Check answer** compares the text the program prints (for example `score: 3`).
- The engine source lives in `src/runners/gameShim.ts` (Python) and `src/runners/engines.ts` (C/C++ header and C# class, merged into your single file automatically).

## Setup help (what do I need on my own computer?)

Every track page has a **Before you start: set up your computer** section (open a card for the full steps), and every lesson and sandbox language has a **Setup** button (hover for a one-line tooltip, click for the same guides). Each guide lists what you need, how to install and run it, and the recommended Visual Studio Code extensions with a ready-to-paste `code --install-extension` list. Covered: VS Code itself, Node and npm/npx, React with Vite, Tailwind, Bootstrap, TypeScript, Python and pip, the data-science libraries, pygame, SQLite, C, C++, C#, Java, Go, Rust, REST/SOAP tools, Git and GitHub Pages (Node and npm, React with Vite, Tailwind, Bootstrap, TypeScript, Python and pip, the data-science libraries, SQLite, C, C++, C#, Java, Go, Rust, Git and GitHub Pages). The guides are plain data in `src/content/setup.ts`: edit a guide there, or add one and reference its id from `setupForTrack`, `setupForLesson` or `setupForPreset`.

## Guided projects you can keep

The last step of every project has a **Download project** button. It builds a folder (as a zip) with the finished code, a `README.md` (how to run it, how to publish it, ideas for what to build next) and everything needed to run it on its own:

| Project type | What the zip contains |
| --- | --- |
| Static website (to-do app, portfolio) | Plain HTML, CSS and JS. Open `index.html`, or publish the folder on GitHub Pages / Netlify |
| React app (people directory, dev blog) | A Vite project (`package.json`, `vite.config.js` with `base: './'`, `src/`) plus a GitHub Pages workflow. `npm install`, `npm run dev`, `npm run build` |
| Node (API client) | `package.json` with `npm start` |
| Python (expense tracker, chatbot, house prices) | `main.py` (+ `requirements.txt` when it needs libraries) |
| SQL (library database) | `setup.sql` and `query.sql` for the `sqlite3` command-line tool |

Projects that use the practice server (`https://api.academy.test`) also get `academy-mock.js`, the same fake server, so they keep working after download. Remove it and change the address when you want to use a real API. The sandbox page has a plain **Download** button too.

To make a project downloadable, add this to the front matter of its last lesson:

```yaml
export:
  kind: static          # static | vite-react | python | node | sql | plain
  name: my-project      # folder / package name
  note: Optional sentence added to the README.
```

## Publish Code Academy itself on GitHub

Code Academy is a static website: `npm run build` produces a `dist/` folder, nothing runs on a server. It uses relative asset paths (`base: './'`) and a hash router (`#/learn/...`), so it works from any sub-path such as `https://<you>.github.io/code-academy/` with no extra settings.

1. Create an empty repository on github.com (for example `code-academy`).
2. In this folder run:

   ```bash
   git init
   git add .
   git commit -m "Code Academy"
   git branch -M main
   git remote add origin https://github.com/<your-user>/code-academy.git
   git push -u origin main
   ```

3. On GitHub open **Settings, Pages, Build and deployment** and set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` runs `npm ci` and `npm run build` on every push to `main` and publishes `dist/`. After a minute your site is live at `https://<your-user>.github.io/<repository>/`. The **Actions** tab shows progress.

Good to know:

- The Python runtime is copied from `node_modules` into `public/pyodide` during `npm run build` (it is not committed, see `.gitignore`), so the workflow needs no extra step.
- Data-science packages still download from the jsdelivr CDN in each visitor's browser.
- C, C++, C#, Java, Go and Rust use the public Judge0 server by default (rate-limited). For real users, host your own and change the default in `src/lib/settings.ts`, or let each person set it in Settings.
- Without GitHub Actions you can build locally and upload the contents of `dist/` to any static host (Netlify drop, Cloudflare Pages, S3...).
- A custom domain works the same as for any GitHub Pages site (Settings, Pages, Custom domain).

## Compiled languages need a run server

Browsers cannot compile C, C++ or C#, so **Run** sends the code to a server. By default the app uses the free public Judge0 server (`https://ce.judge0.com`). It is fine for trying things out but can be slow, rate-limited or offline, and you should not rely on it for real users.

Open **Settings** in the app to change the server, and use **Test connection** to check it. Options:

- **Judge0** - self-host with Docker (see https://github.com/judge0/judge0). Then set type `Judge0` and URL `http://localhost:2358`. For a browser app on another origin, make sure the server allows CORS.
- **Piston** - self-host with Docker (see https://github.com/engineer-man/piston). Set type `Piston` and URL `http://localhost:2000/api/v2`.
- A hosted Judge0 (e.g. RapidAPI): put the URL in, and use the "extra header" fields for the API key header.

HTML, CSS, JavaScript, TypeScript, React, Python and SQL never need a server.

## Project layout

```
src/
  content/            <- all lessons live here
    tracks.ts           the list of tracks (title, colour, icon)
    html-css/01-first-page.md
    python/03-conditions-and-loops.md
    ...
  runners/            code execution engines (web, js/ts worker, react, python, sql, remote)
  monaco/             editor setup + IntelliSense
  components/         Workspace (editor + output), Quiz, lesson renderer
  pages/              Home, Track, Lesson, Sandbox, Settings
  sandbox/presets.ts  the languages and starter code in the Sandbox
```

## Adding a lesson

Create `src/content/<track-id>/NN-some-name.md`. The number sets the order. A lesson is YAML front matter followed by markdown:

```md
---
title: Variables
summary: One line shown in the lesson list.
runner: python            # web | js | ts | react | python | pygame | jsgame | sql | remote
level: beginner           # beginner | intermediate | advanced (shown as a label)
files:                    # starter code (several files => tabs)
  - name: main.py
    code: |
      # write your code here
stdin: |                  # optional: prefilled program input (python / remote)
  Ava
check:                    # how "Check answer" decides (use any combination)
  output: Hello, Ava!     #   program output must equal this
  code:                   #   regexes the code must match
    - "def\\s+greet"
  game:                   #   python game lessons: run N frames headless, then test an expression
    frames: 60
    keys: [ { key: right, from: 0, to: 30 } ]
    expect: "x > 150"
  dom:                    #   for web / react lessons, tests the rendered page
    text: ["Hello"]
    selectors: ["h1"]
    styles:
      - { selector: "h1", property: "color", value: "rgb(255, 0, 0)" }
  page: about.html        #   multi-page web lessons: which page the dom checks look at (default index.html)
hints:                    # three, revealed one at a time by the Hint button
  - "Gentle nudge: which concept to use."
  - "More specific: which function or keyword."
  - "Nearly the answer: the key line of code."
game: true                # only for compiled game lessons (tracks game-c, game-cpp, game-csharp)
solution:
  - code: |
      print("Hello, Ava!")
quiz:
  - q: Question text?
    options: ["A", "B", "C"]
    answer: 0             # index of the right option
    explain: Shown after answering.
---

Lesson text in **markdown**. Fenced code blocks get syntax colours.
```

Tips: quote any YAML value that contains `: ` or ` #`. For compiled languages use `runner: remote`; the language comes from the track folder name (`c`, `cpp`, `csharp`) or set `remote: java` in the front matter.

To add a whole new track, add an entry in `src/content/tracks.ts` and a folder with the same id. The `group` field of a track chooses its section on the home page (`learn`, `data`, `projects`, `games`) and `intro` adds a description at the top of the track page.

**Guided projects** are tracks whose lessons are steps of one build: the starter code of each step is the finished code of the previous one.

## Adding a sandbox language

Add a preset to `src/sandbox/presets.ts`. For a new compiled language also add it to `REMOTE_LANGS` in `src/runners/remote.ts` (file name, Judge0 language id, Piston name) and, optionally, completions in `src/monaco/intellisense.ts`.

## Known limitations

- A `while(true)` inside the HTML/CSS/JS **preview** (not the JavaScript console runner) can freeze that tab; the console runners stop it after 5 s.
- The SQL sample database is fixed per lesson (`seed:` in the front matter can override it).
- `input()` and friends read from the Input tab rather than prompting interactively.
- The data-science packages need internet the first time (they come from the Pyodide CDN). Everything else works offline except the compiled languages.
- Tailwind in the browser is a learning build (it generates styles in the page). Computed Tailwind colours are `oklch(...)` values, so lessons check sizes and class names instead.
- The practice API server is a simulation inside the page, not the real internet. To practise against real services, use a real URL in the sandbox (the target must allow cross-origin requests).
