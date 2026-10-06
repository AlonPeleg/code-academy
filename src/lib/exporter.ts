/**
 * "Download project": turns the learner's current files into a folder that works on its own
 * (with a README, run instructions and publishing steps), so a finished project can go to GitHub or a portfolio.
 */
import { strToU8, zipSync } from 'fflate';
import type { SourceFile } from '../runners/types';
import type { ProjectExport } from './types';

export interface ExportInput {
  files: SourceFile[];
  spec: ProjectExport;
  title: string;
  description: string;
  stdin?: string;
  seed?: string;
}

type Tree = Record<string, string>;

const usesPracticeApi = (files: SourceFile[]) => files.some((f) => f.code.includes('api.academy.test'));

const PY_PACKAGES: Record<string, string> = { numpy: 'numpy', pandas: 'pandas', matplotlib: 'matplotlib', sklearn: 'scikit-learn', scipy: 'scipy' };
function pythonRequirements(files: SourceFile[]): string[] {
  const found = new Set<string>();
  for (const f of files) {
    for (const m of f.code.matchAll(/^\s*(?:import|from)\s+([A-Za-z_][\w]*)/gm)) if (PY_PACKAGES[m[1]]) found.add(PY_PACKAGES[m[1]]);
  }
  return [...found].sort();
}

const GITIGNORE_COMMON = ['.DS_Store', 'Thumbs.db', '.vscode/', '.idea/'];

function readme(i: ExportInput, run: string[], publish: string[], extra: string[] = []): string {
  const { title, description, spec } = i;
  const lines = [
    `# ${title.replace(/^Project:\s*/i, '')}`,
    '',
    description,
    '',
    ...(spec.note ? [spec.note, ''] : []),
    '## How to run it',
    '',
    ...run,
    '',
    ...(extra.length ? [...extra, ''] : []),
    '## How to publish it',
    '',
    ...publish,
    '',
    '## What I learned',
    '',
    '- (write two or three things you learned while building this)',
    '- (what was the hardest part, and how did you solve it?)',
    '- (what would you add next?)',
    '',
    '## Credits',
    '',
    'Built step by step in Code Academy. The code is mine to change, break and make better.',
    '',
  ];
  return lines.join('\n');
}

const GITHUB_STEPS = [
  '1. Create a new empty repository on github.com (no README, no licence).',
  '2. In this folder run:',
  '',
  '   ```bash',
  '   git init',
  '   git add .',
  '   git commit -m "First version"',
  '   git branch -M main',
  '   git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git',
  '   git push -u origin main',
  '   ```',
];

const API_NOTE = [
  '## About the practice API',
  '',
  'This project talks to `https://api.academy.test`, a practice server that only exists inside Code Academy. To make it work on its own, the download includes a small fake server (`academy-mock.js`) that answers those requests inside your browser or Node. To use a real API instead, remove that file and change the address in the code (for example to `https://jsonplaceholder.typicode.com`) and adjust the field names to match.',
];

async function mockSource(): Promise<string> {
  return (await import('../runners/apiMock.js?raw')).default;
}

async function staticSite(i: ExportInput): Promise<Tree> {
  const tree: Tree = {};
  const api = usesPracticeApi(i.files);
  for (const f of i.files) {
    let code = f.code;
    if (api && f.language === 'html') code = /<head[^>]*>/i.test(code) ? code.replace(/<head[^>]*>/i, (m) => `${m}\n    <script src="academy-mock.js"></script>`) : code;
    tree[f.name] = code;
  }
  if (api) tree['academy-mock.js'] = await mockSource();
  tree['README.md'] = readme(
    i,
    [
      'Open `index.html` in your browser. Links between pages and `fetch` calls work best from a tiny local server:',
      '',
      '```bash',
      'npx serve .',
      '```',
      '',
      'Or use the "Live Server" extension in VS Code.',
    ],
    [
      '**GitHub Pages (free):**',
      '',
      ...GITHUB_STEPS,
      '3. On GitHub open Settings, then Pages, choose "Deploy from a branch", pick `main` and the `/ (root)` folder, and save.',
      '4. After a minute your site is live at `https://YOUR-NAME.github.io/YOUR-REPO/`.',
      '',
      '**Netlify Drop (no account for a test):** drag this folder onto https://app.netlify.com/drop.',
    ],
    api ? API_NOTE : [],
  );
  tree['.gitignore'] = GITIGNORE_COMMON.join('\n') + '\n';
  return tree;
}

async function viteReact(i: ExportInput): Promise<Tree> {
  const tree: Tree = {};
  const api = usesPracticeApi(i.files);
  const css = i.files.filter((f) => /\.css$/i.test(f.name)).map((f) => f.name);
  for (const f of i.files) tree[`src/${f.name}`] = f.code;
  if (api) tree['src/academy-mock.js'] = await mockSource();
  tree['src/main.jsx'] = [
    ...(api ? ["import './academy-mock.js';"] : []),
    "import React from 'react';",
    "import { createRoot } from 'react-dom/client';",
    "import App from './App.jsx';",
    ...css.map((c) => `import './${c}';`),
    '',
    "createRoot(document.getElementById('root')).render(",
    '  <React.StrictMode>',
    '    <App />',
    '  </React.StrictMode>',
    ');',
    '',
  ].join('\n');
  tree['index.html'] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${i.title.replace(/^Project:\s*/i, '').replace(/</g, '&lt;')}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
  tree['package.json'] =
    JSON.stringify(
      {
        name: i.spec.name,
        private: true,
        version: '0.1.0',
        type: 'module',
        scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
        devDependencies: { '@vitejs/plugin-react': '^4.3.4', vite: '^6.0.0' },
      },
      null,
      2,
    ) + '\n';
  tree['vite.config.js'] = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' lets the built site work from any folder (GitHub Pages, Netlify, ...)
export default defineConfig({
  plugins: [react()],
  base: './',
});
`;
  tree['.gitignore'] = ['node_modules/', 'dist/', ...GITIGNORE_COMMON].join('\n') + '\n';
  tree['.github/workflows/deploy.yml'] = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
`;
  tree['README.md'] = readme(
    i,
    ['You need [Node.js](https://nodejs.org) 18 or newer.', '', '```bash', 'npm install', 'npm run dev', '```', '', 'Open the address it prints (usually http://localhost:5173).', '', 'To make the production build: `npm run build` (the result is in `dist/`).'],
    [
      '**GitHub Pages (free), using the workflow already in this folder:**',
      '',
      ...GITHUB_STEPS,
      '3. On GitHub open Settings, then Pages, and set "Source" to **GitHub Actions**.',
      '4. Every push to `main` now builds and publishes the site. The address is shown on the Actions run.',
      '',
      '**Netlify or Vercel:** import the repository; build command `npm run build`, output folder `dist`.',
    ],
    api ? API_NOTE : [],
  );
  return tree;
}

async function pythonProject(i: ExportInput): Promise<Tree> {
  const tree: Tree = {};
  for (const f of i.files) tree[f.name] = f.code;
  const main = i.files.find((f) => f.name === 'main.py')?.name ?? i.files[0].name;
  const reqs = pythonRequirements(i.files);
  if (reqs.length) tree['requirements.txt'] = reqs.join('\n') + '\n';
  const input = i.stdin?.trim();
  if (input) tree['sample_input.txt'] = i.stdin!.replace(/\n?$/, '\n');
  tree['.gitignore'] = ['__pycache__/', '*.pyc', '.venv/', ...GITIGNORE_COMMON].join('\n') + '\n';
  const run = ['You need [Python](https://www.python.org/downloads/) 3.10 or newer.', ''];
  if (reqs.length) run.push('```bash', 'python -m venv .venv', 'source .venv/bin/activate      # on Windows: .venv\\Scripts\\activate', 'pip install -r requirements.txt', `python ${main}`, '```');
  else run.push('```bash', `python ${main}`, '```');
  if (input) run.push('', 'The program reads lines typed by a person. To replay the conversation from the lesson, run:', '', '```bash', `python ${main} < sample_input.txt`, '```');
  tree['README.md'] = readme(i, run, [
    'A command-line program is shared as source code:',
    '',
    ...GITHUB_STEPS,
    '3. Add a screenshot or a pasted example run to this README so visitors can see what it does without installing anything.',
  ]);
  return tree;
}

async function nodeProject(i: ExportInput): Promise<Tree> {
  const tree: Tree = {};
  const api = usesPracticeApi(i.files);
  for (const f of i.files) tree[f.name] = f.code;
  const main = i.files.find((f) => f.name === 'main.js')?.name ?? i.files[0].name;
  tree['package.json'] = JSON.stringify({ name: i.spec.name, version: '0.1.0', private: true, type: 'module', scripts: { start: api ? `node --import ./academy-mock.js ${main}` : `node ${main}` } }, null, 2) + '\n';
  if (api) tree['academy-mock.js'] = 'globalThis.self = globalThis;\n' + (await mockSource());
  tree['.gitignore'] = ['node_modules/', ...GITIGNORE_COMMON].join('\n') + '\n';
  tree['README.md'] = readme(
    i,
    ['You need [Node.js](https://nodejs.org) 20.6 or newer.', '', '```bash', 'npm start', '```'],
    ['A library is shared as source code:', '', ...GITHUB_STEPS, '3. Describe each function in this README with a short example, then consider publishing it to npm (`npm publish`) once the name is yours.'],
    api ? API_NOTE : [],
  );
  return tree;
}

async function sqlProject(i: ExportInput): Promise<Tree> {
  const tree: Tree = {};
  const query = i.files[0];
  if (i.seed) tree['setup.sql'] = i.seed.replace(/\n?$/, '\n');
  tree[query.name] = query.code;
  tree['.gitignore'] = ['*.db', ...GITIGNORE_COMMON].join('\n') + '\n';
  tree['README.md'] = readme(
    i,
    [
      'You need SQLite ([sqlite.org/download](https://www.sqlite.org/download.html), or `sudo apt install sqlite3`, or `brew install sqlite`).',
      '',
      '```bash',
      ...(i.seed ? ['sqlite3 library.db < setup.sql         # create the tables and data'] : []),
      `sqlite3 -header -column library.db < ${query.name}`,
      '```',
      '',
      'Prefer a visual tool? Open `library.db` in [DB Browser for SQLite](https://sqlitebrowser.org).',
    ],
    ['Share the SQL files on GitHub:', '', ...GITHUB_STEPS, '3. In the README paste the output of your most interesting query so visitors see the result.'],
  );
  return tree;
}

async function plain(i: ExportInput): Promise<Tree> {
  const tree: Tree = {};
  for (const f of i.files) tree[f.name] = f.code;
  tree['README.md'] = `# ${i.title}\n\nFiles exported from Code Academy.\n`;
  return tree;
}

export async function buildProjectZip(i: ExportInput): Promise<{ bytes: Uint8Array; tree: Tree }> {
  const builders = { static: staticSite, 'vite-react': viteReact, python: pythonProject, node: nodeProject, sql: sqlProject, plain } as const;
  const tree = await builders[i.spec.kind](i);
  const root = i.spec.name;
  const data: Record<string, Uint8Array> = {};
  for (const [path, text] of Object.entries(tree)) data[`${root}/${path}`] = strToU8(text);
  return { bytes: zipSync(data, { level: 6 }), tree };
}

export async function downloadProject(i: ExportInput) {
  const { bytes } = await buildProjectZip(i);
  const blob = new Blob([bytes as BlobPart], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${i.spec.name}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
