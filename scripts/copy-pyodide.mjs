// Copies the Python runtime (Pyodide) from node_modules into public/pyodide
// so the Python sandbox works locally with no CDN. Runs automatically before dev/build.
import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'pyodide');
const dest = join(root, 'public', 'pyodide');
const files = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];

if (!existsSync(src)) {
  console.warn('[copy-pyodide] node_modules/pyodide not found - run "npm install" first.');
  process.exit(0);
}
mkdirSync(dest, { recursive: true });
for (const f of files) {
  if (existsSync(join(src, f))) cpSync(join(src, f), join(dest, f));
  else console.warn(`[copy-pyodide] missing ${f}`);
}
console.log('[copy-pyodide] Python runtime ready in public/pyodide');
