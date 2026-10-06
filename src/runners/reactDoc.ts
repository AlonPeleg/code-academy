import { transform } from 'sucrase';
import reactUmd from '../../node_modules/react/umd/react.development.js?raw';
import reactDomUmd from '../../node_modules/react-dom/umd/react-dom.development.js?raw';
import { bootstrapScript, escapeScript, escapeStyle } from './webDoc';
import type { Probes, RunOutput, SourceFile } from './types';

const baseName = (n: string) => n.replace(/^\.\//, '').replace(/\.(jsx?|tsx?|css)$/i, '');

function compile(file: SourceFile): string {
  const isTs = /\.tsx?$/i.test(file.name);
  const isTsx = /\.tsx$/i.test(file.name);
  const transforms: ('jsx' | 'typescript' | 'imports')[] = isTs && !isTsx ? ['typescript', 'imports'] : isTsx ? ['jsx', 'typescript', 'imports'] : ['jsx', 'imports'];
  return transform(file.code, { transforms, jsxRuntime: 'classic', production: false, disableESTransforms: true }).code;
}

const RUNTIME = `
var __modules = {};
function __define(name, factory) { __modules[name] = { factory: factory, loaded: false, exports: {} }; }
function __resolve(from, spec) {
  var clean = String(spec).replace(/\\.(jsx?|tsx?|css)$/i, '');
  if (clean.charAt(0) !== '.') return clean;
  var parts = from ? from.split('/').slice(0, -1) : [];
  clean.split('/').forEach(function (seg) {
    if (seg === '' || seg === '.') return;
    if (seg === '..') parts.pop(); else parts.push(seg);
  });
  return parts.join('/');
}
function __makeRequire(from) {
  return function (spec) {
    if (spec === 'react') return React;
    if (spec === 'react-dom' || spec === 'react-dom/client') return ReactDOM;
    var key = __resolve(from, spec);
    var m = __modules[key] || __modules[key + '/index'];
    if (!m) throw new Error("Cannot find module '" + spec + "'. You can import from 'react', 'react-dom' and your own files.");
    if (!m.loaded) { m.loaded = true; m.factory(m.exports, __makeRequire(__modules[key] ? key : key + '/index')); }
    return m.exports;
  };
}
`;

/** Builds an iframe document that runs React (JSX/TSX) with no network access needed. */
export async function runReact(files: SourceFile[], ctx: { runId: number; probes?: Probes }): Promise<RunOutput> {
  const code = files.filter((f) => /\.(jsx?|tsx?)$/i.test(f.name));
  const css = files.filter((f) => f.language === 'css');
  const entry = code.find((f) => /^app\.(jsx?|tsx?)$/i.test(f.name)) ?? code[0];
  if (!entry) return { ok: false, logs: [{ level: 'error', text: 'Add an App.jsx file with a component to render.' }] };

  const defs: string[] = [];
  try {
    for (const f of code) {
      defs.push(`__define(${JSON.stringify(baseName(f.name))}, function (exports, require) {\n${escapeScript(compile(f))}\n});`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, logs: [{ level: 'error', text: 'Syntax error: ' + msg.replace(/^Error transforming .*?:\s*/, '') }] };
  }
  for (const f of css) defs.push(`__define(${JSON.stringify(baseName(f.name))}, function () {});`);

  const mount = `
(function () {
  try {
    var mod = __makeRequire('')(${JSON.stringify('./' + baseName(entry.name))});
    var Comp = mod.default || mod.App;
    if (typeof Comp !== 'function') throw new Error('${entry.name} must export a component. Add: export default App;');
    class Boundary extends React.Component {
      constructor(p) { super(p); this.state = { err: null }; }
      static getDerivedStateFromError(err) { return { err: err }; }
      componentDidCatch(err) { setTimeout(function () { throw err; }); }
      render() {
        return this.state.err
          ? React.createElement('pre', { style: { color: '#b91c1c', whiteSpace: 'pre-wrap' } }, String(this.state.err))
          : this.props.children;
      }
    }
    var root = ReactDOM.createRoot(document.getElementById('root'));
    ReactDOM.flushSync(function () { root.render(React.createElement(Boundary, null, React.createElement(Comp))); });
  } catch (e) { setTimeout(function () { throw e; }); }
})();`;

  const doc = `<!doctype html>
<html><head><meta charset="utf-8">
<style>body{font-family:system-ui,sans-serif;margin:16px;color:#111}</style>
${css.map((f) => `<style>\n${escapeStyle(f.code)}\n</style>`).join('\n')}
<script>${escapeScript(bootstrapScript(ctx.runId, ctx.probes, files.some((f) => /\bfetch\s*\(/.test(f.code)) ? 800 : 120))}</script>
</head><body><div id="root"></div>
<script>${escapeScript(reactUmd)}</script>
<script>${escapeScript(reactDomUmd)}</script>
<script>${RUNTIME}</script>
<script>
${defs.join('\n')}
${mount}
</script>
</body></html>`;

  return { ok: true, logs: [], previewDoc: doc };
}
