/**
 * "What do I need on my own computer?" guides, shown by the Setup button on lessons, tracks and the sandbox.
 * Inside Code Academy nothing has to be installed: everything runs in the browser (or on the run server).
 * These notes are for the day you want to run the same code on your own machine.
 * Add a guide here, then reference its id from setupIdsFor() below.
 */
export interface SetupStep {
  text: string;
  /** a command or code to type (shown in a code block) */
  code?: string;
}
export interface SetupGuide {
  id: string;
  title: string;
  /** one line, used as the button tooltip */
  summary: string;
  /** the list of things you need */
  needs: string[];
  steps: SetupStep[];
  note?: string;
  link?: { label: string; url: string };
  /** Recommended Visual Studio Code extensions for this language / tool */
  extensions?: SetupExtension[];
}
export interface SetupExtension {
  /** name as shown in the VS Code Extensions panel */
  name: string;
  /** marketplace id, used by: code --install-extension <id> */
  id: string;
  why: string;
}

export const SETUP: Record<string, SetupGuide> = {
  vscode: {
    id: 'vscode',
    title: 'Visual Studio Code (recommended editor)',
    summary: 'Free editor used by most developers. Install it, then add the extensions for your language.',
    needs: ['Visual Studio Code, free from code.visualstudio.com (Windows, Mac, Linux)'],
    steps: [
      { text: 'Download and install VS Code. Then open your project folder with File, Open Folder (or from a terminal inside the folder: code .).' },
      { text: 'Open the built-in terminal with Ctrl + backtick (Cmd + backtick on Mac). Commands such as npm, python or dotnet run there, already inside your project folder.' },
      { text: 'Install an extension: press Ctrl+Shift+X (Cmd+Shift+X on Mac), search for its name and click Install. Or use the terminal with the id shown under each guide:', code: 'code --install-extension ms-python.python' },
      { text: 'Turn on "Format on Save" (Settings, search "format on save") so your code is tidied automatically, and "Auto Save" so you never lose changes.' },
    ],
    note: 'Extensions are optional. Each guide below lists the ones worth having for that language.',
    extensions: [
      { name: 'Error Lens', id: 'usernamehw.errorlens', why: 'shows error messages right next to the line, for any language' },
    ],
    link: { label: 'code.visualstudio.com', url: 'https://code.visualstudio.com' },
  },
  html: {
    id: 'html',
    title: 'HTML, CSS and JavaScript on your computer',
    summary: 'Needs: a code editor and a web browser. No install, no build step.',
    needs: ['A web browser (Chrome, Firefox, Edge, Safari)', 'A code editor, for example Visual Studio Code (free)'],
    steps: [
      { text: 'Create a folder for your site and put the files in it, for example:', code: 'my-site/\n  index.html\n  css/style.css\n  js/main.js' },
      { text: 'Open index.html by double-clicking it. The browser shows your page. Refresh after each change.' },
      { text: 'Optional but nice: in VS Code install the "Live Server" extension, right-click index.html and choose "Open with Live Server". The page then reloads by itself when you save.' },
      { text: 'Use the browser DevTools (F12) to see errors in the Console tab and to inspect and tweak CSS live.' },
    ],
    note: 'Links between your pages work with plain file names, such as <a href="about.html">. A few features (fetch to your own files, ES modules) need a local server: Live Server provides one.',
    link: { label: 'Download VS Code', url: 'https://code.visualstudio.com' },
    extensions: [
      { name: "Live Server", id: "ritwickdey.LiveServer", why: "reloads the page in the browser every time you save" },
      { name: "Prettier - Code formatter", id: "esbenp.prettier-vscode", why: "formats HTML, CSS and JS neatly when you save" },
      { name: "Auto Rename Tag", id: "formulahendry.auto-rename-tag", why: "renames the closing tag when you rename the opening one" },
      { name: "HTML CSS Support", id: "ecmel.vscode-html-css", why: "suggests your own CSS class names inside HTML" },
    ],
  },
  node: {
    id: 'node',
    title: 'Node.js and npm',
    summary: 'Needs: Node.js (it includes npm). Runs JavaScript outside the browser and installs packages.',
    needs: ['Node.js, the current LTS version (includes npm, the package manager)', 'A terminal (Terminal on Mac/Linux, PowerShell on Windows) and a code editor'],
    steps: [
      { text: 'Install Node.js from nodejs.org (choose the LTS download), then check it worked:', code: 'node --version\nnpm --version' },
      { text: 'Run a JavaScript file:', code: 'node main.js' },
      { text: 'Start a project that uses packages (this creates package.json), then install a package:', code: 'npm init -y\nnpm install some-package' },
      { text: 'Three commands you will see all the time: node runs a JavaScript file; npm installs packages and runs the scripts listed in package.json (npm run dev, npm run build, npm start); npx runs a tool from a package without installing it for good (npx vite, npx tsc).', code: 'node main.js\nnpm run dev\nnpx tsc --version' },
      { text: 'Packages land in the node_modules folder. Never commit node_modules to Git; list it in .gitignore. Anyone can rebuild it with:', code: 'npm install' },
    ],
    note: 'Node 18 and newer has fetch built in, so the API lessons run as they are. To use import/export in .js files, add "type": "module" to package.json.',
    link: { label: 'nodejs.org', url: 'https://nodejs.org' },
    extensions: [
      { name: "ESLint", id: "dbaeumer.vscode-eslint", why: "points out likely mistakes in JavaScript as you type" },
      { name: "Prettier - Code formatter", id: "esbenp.prettier-vscode", why: "consistent formatting on save" },
    ],
  },
  react: {
    id: 'react',
    title: 'React with Vite',
    summary: 'Needs: Node.js and npm. Create a project with Vite, then npm run dev.',
    needs: ['Node.js LTS and npm (see the Node.js guide)', 'A code editor (VS Code)', 'Packages: react, react-dom (dependencies) and vite, @vitejs/plugin-react (dev tools). The command below installs them for you'],
    steps: [
      { text: 'Create the project (choose the React template; JavaScript or TypeScript as you like):', code: 'npm create vite@latest my-app -- --template react\ncd my-app\nnpm install' },
      { text: 'Start the development server and open the address it prints (usually http://localhost:5173):', code: 'npm run dev' },
      { text: 'Your code lives in src/. App.jsx is the main component, main.jsx mounts it on the page. Put each component in its own file and import it, like the multi-file projects here.' },
      { text: 'Build the files you publish. They end up in the dist folder:', code: 'npm run build' },
    ],
    note: 'In the academy, files are imported without the extension (import Nav from "./components/Nav"). That works in Vite too. Download project on a React project gives you exactly this setup.',
    link: { label: 'vite.dev', url: 'https://vite.dev/guide/' },
    extensions: [
      { name: "ES7+ React/Redux/React-Native snippets", id: "dsznajder.es7-react-js-snippets", why: "type rfce and press Tab to get a component skeleton" },
      { name: "ESLint", id: "dbaeumer.vscode-eslint", why: "catches hook and JSX mistakes" },
      { name: "Prettier - Code formatter", id: "esbenp.prettier-vscode", why: "formats JSX on save" },
      { name: "Auto Rename Tag", id: "formulahendry.auto-rename-tag", why: "keeps JSX tags in sync" },
    ],
  },
  tailwind: {
    id: 'tailwind',
    title: 'Tailwind CSS',
    summary: 'Needs: nothing for a quick try (one script tag). For real projects: Node.js, then npm install tailwindcss.',
    needs: ['Quick try: only a browser and the script tag', 'Real projects: Node.js + npm, and the packages tailwindcss and @tailwindcss/cli (or @tailwindcss/vite when you use Vite)'],
    steps: [
      { text: 'Quick try, the way the lessons do it. Put this in the <head> of your HTML:', code: '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>' },
      { text: 'Real project with the Tailwind command-line tool. Install:', code: 'npm install tailwindcss @tailwindcss/cli' },
      { text: 'Create src/input.css with one line:', code: '@import "tailwindcss";' },
      { text: 'Build the CSS file (keep this running while you work). It scans your HTML for class names and writes only the CSS you use:', code: 'npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --watch' },
      { text: 'Link the result in your HTML instead of the script tag:', code: '<link href="dist/output.css" rel="stylesheet">' },
      { text: 'Using Vite (for example in a React app)? Install the plugin and add it to vite.config.js:', code: 'npm install tailwindcss @tailwindcss/vite\n\n// vite.config.js\nimport tailwindcss from "@tailwindcss/vite";\nexport default { plugins: [tailwindcss()] };\n\n/* src/index.css */\n@import "tailwindcss";' },
    ],
    note: 'The CDN script is for learning and prototypes. A published site should use the build step so visitors download a small CSS file instead of the whole generator.',
    link: { label: 'tailwindcss.com/docs', url: 'https://tailwindcss.com/docs/installation' },
    extensions: [
      { name: "Tailwind CSS IntelliSense", id: "bradlc.vscode-tailwindcss", why: "autocomplete for class names, colour previews and hover docs" },
    ],
  },
  bootstrap: {
    id: 'bootstrap',
    title: 'Bootstrap',
    summary: 'Needs: nothing but two CDN tags. Or npm install bootstrap in a project.',
    needs: ['Quick use: a browser and the two tags below', 'In a project with a build tool: Node.js + npm, and the package bootstrap'],
    steps: [
      { text: 'CDN, the way the lessons do it. The stylesheet goes in <head>:', code: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">' },
      { text: 'The script goes just before </body>. It powers the navbar toggle, modals, dropdowns and so on:', code: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>' },
      { text: 'Always add the viewport tag in <head> so the grid works on phones:', code: '<meta name="viewport" content="width=device-width, initial-scale=1">' },
      { text: 'With npm and Vite or another bundler:', code: 'npm install bootstrap\n\n// in your main JavaScript file\nimport "bootstrap/dist/css/bootstrap.min.css";\nimport "bootstrap";' },
    ],
    note: 'Your own CSS file must be linked AFTER the Bootstrap stylesheet, or Bootstrap wins ties. Customising with Sass needs the sass package; the lessons use CSS variables, which need nothing.',
    link: { label: 'getbootstrap.com', url: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/' },
    extensions: [
      { name: "HTML CSS Support", id: "ecmel.vscode-html-css", why: "autocomplete for classes, including Bootstrap when linked" },
      { name: "Live Server", id: "ritwickdey.LiveServer", why: "reloads the browser on save" },
    ],
  },
  typescript: {
    id: 'typescript',
    title: 'TypeScript',
    summary: 'Needs: Node.js, then npm install -D typescript. Compile with tsc or run with tsx.',
    needs: ['Node.js LTS and npm', 'Packages: typescript (the compiler). Optional: tsx to run .ts files directly'],
    steps: [
      { text: 'In your project folder:', code: 'npm init -y\nnpm install -D typescript\nnpx tsc --init' },
      { text: 'Compile your files to JavaScript, then run the result:', code: 'npx tsc\nnode main.js' },
      { text: 'Or run a .ts file in one step while learning:', code: 'npx tsx main.ts' },
      { text: 'Your editor (VS Code) shows type errors as you type. The academy only transpiles when you press Run, so use the editor squiggles and tsc to see all type errors.' },
    ],
    link: { label: 'typescriptlang.org', url: 'https://www.typescriptlang.org/download' },
    extensions: [
      { name: "ESLint", id: "dbaeumer.vscode-eslint", why: "lint rules for TypeScript too" },
      { name: "Prettier - Code formatter", id: "esbenp.prettier-vscode", why: "formatting on save" },
    ],
  },
  python: {
    id: 'python',
    title: 'Python',
    summary: 'Needs: Python 3.10 or newer. Libraries are added with pip.',
    needs: ['Python 3.10+ from python.org (Windows/Mac) or your package manager (Linux)', 'A terminal and a code editor (VS Code with the Python extension is a good start)'],
    steps: [
      { text: 'Check the install:', code: 'python3 --version     # on Windows: python --version' },
      { text: 'Run a program:', code: 'python3 main.py' },
      { text: 'Give each project its own tool box (a virtual environment) so libraries do not clash:', code: 'python3 -m venv .venv\nsource .venv/bin/activate        # Windows: .venv\\Scripts\\activate' },
      { text: 'Install libraries with pip, and record them so others can install the same:', code: 'pip install requests\npip freeze > requirements.txt\npip install -r requirements.txt' },
    ],
    note: 'input() works in the terminal the normal way. The lessons that use the Input tab are just feeding those lines to your program.',
    link: { label: 'python.org/downloads', url: 'https://www.python.org/downloads/' },
    extensions: [
      { name: "Python", id: "ms-python.python", why: "run, debug and lint Python, pick your virtual environment" },
      { name: "Pylance", id: "ms-python.vscode-pylance", why: "fast autocomplete and type hints" },
    ],
  },
  'python-data': {
    id: 'python-data',
    title: 'Data science libraries (NumPy, pandas, matplotlib, scikit-learn)',
    summary: 'Needs: pip install numpy pandas matplotlib scikit-learn (inside a virtual environment).',
    needs: ['Python 3.10+ and pip', 'Packages: numpy, pandas, matplotlib, scikit-learn (scipy comes with scikit-learn)', 'About 500 MB of disk space and an internet connection for the install'],
    steps: [
      { text: 'Create and activate a virtual environment (see the Python guide), then install:', code: 'pip install numpy pandas matplotlib scikit-learn' },
      { text: 'Run your script. plt.show() opens a window on your computer instead of showing the picture in the output panel:', code: 'python3 main.py' },
      { text: 'Prefer a notebook? Jupyter lets you run code in cells and see charts inline:', code: 'pip install jupyterlab\njupyter lab' },
      { text: 'Save a chart as an image file in your own scripts:', code: 'plt.savefig("chart.png")' },
    ],
    note: 'In the academy the libraries download into your browser the first time (needs internet) and are cached. Results use fixed random seeds, so your own run prints the same numbers.',
    link: { label: 'scikit-learn.org', url: 'https://scikit-learn.org/stable/install.html' },
    extensions: [
      { name: "Jupyter", id: "ms-toolsai.jupyter", why: "run code in notebook cells and see charts inline" },
      { name: "Python", id: "ms-python.python", why: "the base Python support" },
    ],
  },
  pygame: {
    id: 'pygame',
    title: 'Python games: the academy engine and real pygame',
    summary: 'In the academy: nothing. On your computer: pip install pygame (the game module is academy-only).',
    needs: ['Python 3.10+ and pip', 'Package: pygame (the popular game library)'],
    steps: [
      { text: 'The "import game" mini engine only exists inside Code Academy. It teaches the same ideas as real game libraries: a loop, update, draw, input.' },
      { text: 'To make games on your computer, install pygame:', code: 'pip install pygame' },
      { text: 'A minimal real pygame program has the same shape as the lessons:', code: 'import pygame\npygame.init()\nscreen = pygame.display.set_mode((320, 240))\nclock = pygame.time.Clock()\nx = 150\nrunning = True\nwhile running:\n    for e in pygame.event.get():\n        if e.type == pygame.QUIT:\n            running = False\n    keys = pygame.key.get_pressed()\n    if keys[pygame.K_RIGHT]:\n        x += 3\n    screen.fill((20, 20, 30))\n    pygame.draw.rect(screen, (250, 204, 21), (x, 100, 20, 20))\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()' },
    ],
    link: { label: 'pygame.org', url: 'https://www.pygame.org' },
    extensions: [
      { name: "Python", id: "ms-python.python", why: "run and debug your game" },
    ],
  },
  'games-js': {
    id: 'games-js',
    title: 'JavaScript games outside the academy',
    summary: 'Needs: only a browser. The game object is academy-only; real games use <canvas>.',
    needs: ['A web browser and a code editor'],
    steps: [
      { text: 'The "game" object is a small helper that exists only here. In a normal web page you draw with a canvas element:', code: '<canvas id="c" width="320" height="240"></canvas>\n<script>\n  const ctx = document.getElementById("c").getContext("2d");\n  let x = 150;\n  function frame() {\n    ctx.fillStyle = "#14141e";\n    ctx.fillRect(0, 0, 320, 240);\n    ctx.fillStyle = "#facc15";\n    ctx.fillRect(x, 100, 20, 20);\n    x += 1;\n    requestAnimationFrame(frame);\n  }\n  frame();\n<\/script>' },
      { text: 'update(dt) and draw() in the lessons map onto the body of the frame() function. Keyboard input uses window.addEventListener("keydown", ...).' },
    ],
    extensions: [
      { name: "Live Server", id: "ritwickdey.LiveServer", why: "reloads your game page on save" },
    ],
  },
  'games-native': {
    id: 'games-native',
    title: 'C, C++ and C# games on your computer',
    summary: 'In the academy: nothing. Real games use a library such as SDL2, raylib or Unity/MonoGame.',
    needs: ['A compiler for your language (see its guide)', 'A game library: raylib or SDL2 for C/C++; MonoGame or Unity for C#'],
    steps: [
      { text: 'The academy engine (engine.h / Engine class) is a teaching tool: your program is compiled on the run server and its frames are replayed in the browser.' },
      { text: 'For a real window and real-time input in C or C++, the easiest start is raylib (see raylib.com for installers and examples), or SDL2:', code: '# Debian/Ubuntu\nsudo apt install libsdl2-dev\n# macOS\nbrew install sdl2' },
      { text: 'For C#, install the .NET SDK and try MonoGame (dotnet new install MonoGame.Templates.CSharp) or the Unity editor.' },
    ],
    extensions: [
      { name: "C/C++", id: "ms-vscode.cpptools", why: "IntelliSense and debugging for C and C++ games" },
    ],
  },
  sql: {
    id: 'sql',
    title: 'SQL (SQLite)',
    summary: 'Needs: the sqlite3 tool, or DB Browser for SQLite. The lessons use SQLite.',
    needs: ['SQLite command-line tool (sqlite3) or the free app "DB Browser for SQLite"'],
    steps: [
      { text: 'Install sqlite3: it is often already on Mac and Linux.', code: 'sudo apt install sqlite3      # Debian/Ubuntu\nbrew install sqlite           # macOS\n# Windows: download "sqlite-tools" from sqlite.org/download.html' },
      { text: 'Create a database from a script and run queries:', code: 'sqlite3 library.db < setup.sql\nsqlite3 -header -column library.db < query.sql' },
      { text: 'Or work interactively:', code: 'sqlite3 library.db\nsqlite> .tables\nsqlite> SELECT * FROM books;\nsqlite> .quit' },
    ],
    note: 'Bigger systems (PostgreSQL, MySQL) use almost the same SELECT / INSERT / JOIN. The differences are mostly setup and a few functions.',
    link: { label: 'sqlite.org', url: 'https://www.sqlite.org/download.html' },
    extensions: [
      { name: "SQLite Viewer", id: "qwtel.sqlite-viewer", why: "open a .db file and browse the tables" },
      { name: "SQLite", id: "alexcvzz.vscode-sqlite", why: "run queries against a database from the editor" },
    ],
  },
  c: {
    id: 'c',
    title: 'C compiler (gcc)',
    summary: 'Needs: a C compiler such as gcc or clang. Compile, then run.',
    needs: ['A C compiler: gcc or clang', 'A terminal'],
    steps: [
      { text: 'Install a compiler:', code: 'sudo apt install build-essential     # Debian/Ubuntu\nxcode-select --install               # macOS\n# Windows: install MSYS2 (msys2.org) and then: pacman -S mingw-w64-ucrt-x86_64-gcc, or use WSL' },
      { text: 'Compile and run (-lm links the math library, -Wall shows warnings):', code: 'gcc -Wall main.c -o main -lm\n./main                    # Windows: main.exe' },
    ],
    note: 'The academy compiles on a run server. Compiler errors there look the same as on your own machine.',
    extensions: [
      { name: "C/C++", id: "ms-vscode.cpptools", why: "IntelliSense, formatting and a debugger" },
      { name: "CMake Tools", id: "ms-vscode.cmake-tools", why: "only when your project grows to use CMake" },
    ],
  },
  cpp: {
    id: 'cpp',
    title: 'C++ compiler (g++)',
    summary: 'Needs: g++ or clang++. Compile with -std=c++17, then run.',
    needs: ['A C++ compiler: g++ or clang++', 'A terminal'],
    steps: [
      { text: 'Install it the same way as the C compiler (build-essential, Xcode command line tools, or MSYS2 on Windows).' },
      { text: 'Compile and run:', code: 'g++ -std=c++17 -Wall main.cpp -o main\n./main' },
      { text: 'Bigger projects use CMake to build many files:', code: 'sudo apt install cmake        # or: brew install cmake' },
    ],
    extensions: [
      { name: "C/C++", id: "ms-vscode.cpptools", why: "IntelliSense, formatting and a debugger" },
      { name: "CMake Tools", id: "ms-vscode.cmake-tools", why: "build projects with CMake" },
    ],
  },
  csharp: {
    id: 'csharp',
    title: 'C# and .NET',
    summary: 'Needs: the .NET SDK (free). dotnet new console, then dotnet run.',
    needs: ['The .NET SDK (current LTS) from dotnet.microsoft.com', 'A terminal and an editor (VS Code with the C# Dev Kit, or Visual Studio)'],
    steps: [
      { text: 'Check the install:', code: 'dotnet --version' },
      { text: 'Create and run a console project:', code: 'dotnet new console -o MyApp\ncd MyApp\ndotnet run' },
      { text: 'Replace Program.cs with your code. New templates use "top-level statements" (no class Program); the classic class Program { static void Main() } form from the lessons works too.' },
      { text: 'Add a library from NuGet:', code: 'dotnet add package Newtonsoft.Json' },
    ],
    link: { label: 'dotnet.microsoft.com', url: 'https://dotnet.microsoft.com/download' },
    extensions: [
      { name: "C# Dev Kit", id: "ms-dotnettools.csdevkit", why: "project explorer, IntelliSense, debugging and test runner (installs the C# extension too)" },
    ],
  },
  java: {
    id: 'java',
    title: 'Java',
    summary: 'Needs: a JDK (version 17 or newer). javac to compile, java to run.',
    needs: ['A JDK 17+ (for example Eclipse Temurin from adoptium.net)', 'A terminal and an editor (VS Code with Java extensions, or IntelliJ IDEA Community)'],
    steps: [
      { text: 'Check the install:', code: 'javac --version\njava --version' },
      { text: 'The file must be named after the public class (Main.java). Compile and run:', code: 'javac Main.java\njava Main' },
      { text: 'Since Java 11 you can run a single file in one step:', code: 'java Main.java' },
      { text: 'Bigger projects use Maven or Gradle to manage libraries and builds.' },
    ],
    link: { label: 'adoptium.net', url: 'https://adoptium.net' },
    extensions: [
      { name: "Extension Pack for Java", id: "vscjava.vscode-java-pack", why: "language support, debugger, Maven and test runner in one pack" },
    ],
  },
  go: {
    id: 'go',
    title: 'Go',
    summary: 'Needs: the Go toolchain. go run main.go.',
    needs: ['Go from go.dev/dl (installer for Windows/Mac, tarball for Linux)', 'A terminal'],
    steps: [
      { text: 'Check the install:', code: 'go version' },
      { text: 'Run a single file:', code: 'go run main.go' },
      { text: 'For a project with several files or libraries, create a module:', code: 'go mod init example.com/myapp\ngo run .\ngo build        # makes one executable file' },
      { text: 'Add a library:', code: 'go get github.com/some/library' },
    ],
    link: { label: 'go.dev/doc/install', url: 'https://go.dev/doc/install' },
    extensions: [
      { name: "Go", id: "golang.go", why: "official Go support: autocomplete, formatting, tests and debugging" },
    ],
  },
  rust: {
    id: 'rust',
    title: 'Rust',
    summary: 'Needs: rustup (installs rustc and cargo). cargo run.',
    needs: ['Rust via rustup (rustup.rs): installs the compiler rustc and the build tool cargo', 'On Linux/macOS a C linker (build-essential / Xcode tools)'],
    steps: [
      { text: 'Install and check:', code: 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh\nrustc --version\ncargo --version' },
      { text: 'A single file:', code: 'rustc main.rs\n./main' },
      { text: 'A real project with libraries (crates):', code: 'cargo new myapp\ncd myapp\ncargo run\ncargo add some_crate' },
    ],
    link: { label: 'rustup.rs', url: 'https://rustup.rs' },
    extensions: [
      { name: "rust-analyzer", id: "rust-lang.rust-analyzer", why: "the Rust language server: autocomplete and inline errors" },
      { name: "CodeLLDB", id: "vadimcn.vscode-lldb", why: "debug Rust programs" },
      { name: "Even Better TOML", id: "tamasfe.even-better-toml", why: "Cargo.toml support" },
    ],
  },
  api: {
    id: 'api',
    title: 'Working with real APIs',
    summary: 'Needs: Node.js 18+ (fetch built in) or any browser. The practice server only exists in the academy.',
    needs: ['Node.js 18+ or a browser', 'Optional: curl, and Postman or Insomnia to try requests by hand; SoapUI for SOAP'],
    steps: [
      { text: 'https://api.academy.test is a practice server inside the academy. To use a real API, change the address, for example to a free test API:', code: 'const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");\nconsole.log(await res.json());' },
      { text: 'Try requests from the terminal:', code: 'curl -i https://jsonplaceholder.typicode.com/posts/1\ncurl -X POST -H "Content-Type: application/json" -d \'{"title":"Hi"}\' https://jsonplaceholder.typicode.com/posts' },
      { text: 'Real APIs usually need a key. Never put secret keys in code that runs in a browser or in a public repository; keep them in environment variables on a server.' },
      { text: 'Browsers block requests to other websites unless the server allows it (CORS). From Node.js there is no such rule.' },
    ],
    note: 'Downloaded projects that use the practice server include academy-mock.js, a fake copy of it, so they keep running.',
    extensions: [
      { name: "REST Client", id: "humao.rest-client", why: "write requests in a .http file and send them from the editor" },
      { name: "Thunder Client", id: "rangav.vscode-thunder-client", why: "a Postman-style request tester inside VS Code" },
    ],
  },
  git: {
    id: 'git',
    title: 'Git and GitHub: keep it and publish it',
    summary: 'Needs: Git and a free GitHub account. Then publish a site with GitHub Pages.',
    needs: ['Git (git-scm.com)', 'A free account on github.com'],
    steps: [
      { text: 'Put your project folder under version control and make the first commit:', code: 'git init\ngit add .\ngit commit -m "First version"\ngit branch -M main' },
      { text: 'Create an empty repository on github.com, then connect and upload:', code: 'git remote add origin https://github.com/YOUR-NAME/my-project.git\ngit push -u origin main' },
      { text: 'Publish a static site (plain HTML/CSS/JS): on GitHub open Settings, Pages, choose "Deploy from a branch", branch main, folder / (root). Your site appears at https://YOUR-NAME.github.io/my-project/' },
      { text: 'A Vite/React project: the downloaded folder already has a GitHub Actions workflow. In Settings, Pages, choose "GitHub Actions" as the source, then push.' },
      { text: 'Alternatives that are just as easy: drag the folder (or the dist folder) onto netlify.com/drop, or connect the repository to Netlify, Vercel or Cloudflare Pages.' },
    ],
    note: 'Add a .gitignore that lists node_modules and dist so you do not upload them.',
    link: { label: 'docs.github.com/pages', url: 'https://docs.github.com/pages' },
    extensions: [
      { name: "GitLens", id: "eamodio.gitlens", why: "see who changed each line and browse history" },
      { name: "GitHub Pull Requests", id: "github.vscode-pull-request-github", why: "review pull requests without leaving the editor" },
    ],
  },
};

const BY_TRACK: Record<string, string[]> = {
  'html-css': ['html'],
  javascript: ['html', 'node'],
  typescript: ['node', 'typescript'],
  react: ['node', 'react'],
  python: ['python'],
  sql: ['sql'],
  c: ['c'],
  cpp: ['cpp'],
  csharp: ['csharp'],
  java: ['java'],
  go: ['go'],
  rust: ['rust'],
  'machine-learning': ['python', 'python-data'],
  apis: ['node', 'api'],
  algorithms: ['python'],
  'project-todo-web': ['html', 'git'],
  'project-react-directory': ['node', 'react', 'git'],
  'project-api-client': ['node', 'api'],
  'project-expense-tracker': ['python'],
  'project-chatbot': ['python'],
  'project-library-db': ['sql'],
  'project-house-prices': ['python', 'python-data'],
  'project-portfolio-site': ['html', 'bootstrap', 'git'],
  'project-react-blog': ['node', 'react', 'git'],
  'game-python': ['python', 'pygame'],
  'game-js': ['html', 'games-js'],
  'game-c': ['c', 'games-native'],
  'game-cpp': ['cpp', 'games-native'],
  'game-csharp': ['csharp', 'games-native'],
};

const BY_PRESET: Record<string, string[]> = {
  web: ['html'], react: ['node', 'react'], 'react-tsx': ['node', 'react', 'typescript'], js: ['node'], api: ['node', 'api'], ts: ['node', 'typescript'],
  python: ['python'], ml: ['python', 'python-data'], sql: ['sql'], c: ['c'], cpp: ['cpp'], csharp: ['csharp'], java: ['java'], go: ['go'], rust: ['rust'],
  pygame: ['python', 'pygame'], jsgame: ['html', 'games-js'], cgame: ['c', 'games-native'], cppgame: ['cpp', 'games-native'], csgame: ['csharp', 'games-native'],
};

/** Every list starts with the editor guide, then the language / tool guides. */
const resolve = (ids: string[]) => ['vscode', ...ids].map((i) => SETUP[i]).filter(Boolean);

/** Guides for a whole track. */
export const setupForTrack = (trackId: string): SetupGuide[] => {
  if (trackId === 'css-frameworks') return resolve(['html', 'bootstrap', 'tailwind']);
  return resolve(BY_TRACK[trackId] ?? []);
};

/** Guides for one lesson (the CSS frameworks track picks Bootstrap or Tailwind by lesson). */
export const setupForLesson = (trackId: string, slug: string): SetupGuide[] => {
  if (trackId === 'css-frameworks') {
    if (/^bootstrap-or-tailwind/.test(slug)) return resolve(['bootstrap', 'tailwind']);
    if (/^tailwind/.test(slug)) return resolve(['tailwind', 'node']);
    return resolve(['bootstrap', 'html']);
  }
  return setupForTrack(trackId);
};

export const setupForPreset = (presetId: string): SetupGuide[] => resolve(BY_PRESET[presetId] ?? []);
