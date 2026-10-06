import { FORMAT_SOURCE } from './consoleShim';
import API_MOCK_SOURCE from './apiMock.js?raw';
import type { Probes, RunOutput, SourceFile } from './types';

/** Script injected into every preview iframe: forwards console output + reports the page state to the parent. */
export function bootstrapScript(runId: number, probes: Probes | undefined, settleMs: number, pages: string[] = []): string {
  return `${API_MOCK_SOURCE}
(function () {
  var RUN = ${runId};
  var PROBES = ${JSON.stringify(probes ?? {}).replace(/</g, '\\u003c')};
  var PAGES = ${JSON.stringify(pages).replace(/</g, '\\u003c')};
  function send(m) { m.__ca = 1; m.runId = RUN; try { parent.postMessage(m, '*'); } catch (e) {} }
  ${FORMAT_SOURCE}
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (k) {
    var orig = console[k];
    console[k] = function () {
      send({ type: 'log', level: k === 'debug' ? 'log' : k === 'error' ? 'stderr' : k, text: __fmtArgs(arguments) });
      if (orig) orig.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (e) {
    send({ type: 'log', level: 'error', text: e.error && e.error.message ? (e.error.name || 'Error') + ': ' + e.error.message : (e.message || 'Error') });
  });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    send({ type: 'log', level: 'error', text: 'Unhandled promise rejection: ' + (r && r.message ? r.message : String(r)) });
  });
  window.alert = function (m) { console.log('[alert] ' + m); };
  window.confirm = function (m) { console.log('[confirm] ' + m); return true; };
  window.prompt = function (m) { console.log('[prompt] ' + m); return null; };
  function report() {
    var dom = { text: '', selectors: {}, styles: {} };
    try { dom.text = (document.body ? document.body.innerText : '').trim(); } catch (e) {}
    (PROBES.selectors || []).forEach(function (s) {
      try { dom.selectors[s] = document.querySelectorAll(s).length; } catch (e) { dom.selectors[s] = 0; }
    });
    (PROBES.styles || []).forEach(function (p) {
      try {
        var el = document.querySelector(p.selector);
        dom.styles[p.selector + '|' + p.property] = el ? getComputedStyle(el).getPropertyValue(p.property).trim() : '';
      } catch (e) {}
    });
    send({ type: 'done', dom: dom });
  }
  // links between the project's own pages swap the preview; other links and forms must not replace the preview
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') {
      // in-page links and hash routes: handled here because a srcdoc page resolves '#..' against the academy's own address
      e.preventDefault();
      var id = decodeURIComponent(href.slice(1));
      var target = id && document.getElementById(id);
      if (target) target.scrollIntoView();
      else if (href.length > 1) { try { location.hash = href; } catch (err) {} }
      return;
    }
    var m = /^(?:\\.\\/)?([\\w.\\/-]+\\.html)(?:#.*)?$/i.exec(href);
    if (m && PAGES.indexOf(m[1]) !== -1) { e.preventDefault(); send({ type: 'navigate', page: m[1] }); return; }
    if (/^(https?:|mailto:|tel:)/i.test(href)) { e.preventDefault(); console.log('[link] ' + href + ' (links to other sites are switched off in the preview)'); }
  });
  document.addEventListener('submit', function (e) {
    if (!e.defaultPrevented) { e.preventDefault(); console.log('[form] submitted (the preview does not send forms anywhere)'); }
  });
  // count requests that are still running, so the page is only measured after the data has arrived
  var inflight = 0, lastNet = 0;
  if (typeof window.fetch === 'function') {
    var realFetch = window.fetch;
    window.fetch = function () {
      inflight++; lastNet = Date.now();
      var done = function () { inflight--; lastNet = Date.now(); };
      var p;
      try { p = realFetch.apply(this, arguments); } catch (err) { done(); throw err; }
      p.then(done, done);
      return p;
    };
  }
  function settle() {
    var started = Date.now();
    (function wait() {
      var quiet = Date.now() - lastNet > 200;
      if ((inflight === 0 && quiet) || Date.now() - started > 4000) report(); else setTimeout(wait, 50);
    })();
  }
  window.addEventListener('load', function () { setTimeout(settle, ${settleMs}); });
})();`;
}

export const escapeScript = (s: string) => s.replace(/<\/script/gi, '<\\/script');
export const escapeStyle = (s: string) => s.replace(/<\/style/gi, '<\\/style');
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const LIB_CSS = /<link\b[^>]*\bbootstrap[^>]*\.css[^>]*>/gi;
const LIB_BOOTSTRAP_JS = /<script\b[^>]*\bsrc=["'][^"']*bootstrap[^"']*\.js[^"']*["'][^>]*>\s*<\/script>/gi;
const LIB_TAILWIND = /<script\b[^>]*\bsrc=["'][^"']*(?:cdn\.tailwindcss\.com|@tailwindcss\/browser|tailwindcss)[^"']*["'][^>]*>\s*<\/script>/gi;

/** Swap well-known CDN tags (Bootstrap, Tailwind) for copies bundled with the academy, so they work offline. */
async function inlineLibraries(doc: string): Promise<{ doc: string; tailwind: boolean }> {
  let tailwind = false;
  if (LIB_CSS.test(doc)) {
    const css = (await import('bootstrap/dist/css/bootstrap.min.css?raw')).default;
    doc = doc.replace(LIB_CSS, () => `<style data-lib="bootstrap">${escapeStyle(css)}</style>`);
  }
  LIB_CSS.lastIndex = 0;
  if (LIB_BOOTSTRAP_JS.test(doc)) {
    const js = (await import('bootstrap/dist/js/bootstrap.bundle.min.js?raw')).default;
    doc = doc.replace(LIB_BOOTSTRAP_JS, () => `<script data-lib="bootstrap">${escapeScript(js)}</script>`);
  }
  LIB_BOOTSTRAP_JS.lastIndex = 0;
  if (LIB_TAILWIND.test(doc)) {
    tailwind = true;
    const js = (await import('@tailwindcss/browser?raw')).default;
    doc = doc.replace(LIB_TAILWIND, () => `<script data-lib="tailwind">${escapeScript(js)}</script>`);
  }
  LIB_TAILWIND.lastIndex = 0;
  return { doc, tailwind };
}

/** Combine an html page + the css / js files into one document the iframe can render. */
export async function buildWebDoc(files: SourceFile[], runId: number, probes?: Probes, page?: string): Promise<string> {
  const htmlFiles = files.filter((f) => f.language === 'html');
  const htmlFile = (page && htmlFiles.find((f) => f.name === page)) || htmlFiles.find((f) => f.name === 'index.html') || htmlFiles[0];
  let doc = htmlFile?.code ?? '';
  const appendCss: string[] = [];
  const appendJs: string[] = [];
  // with several html pages, each page only gets the files it links to; with one page, loose css / js files are added automatically
  const multi = htmlFiles.length > 1;

  for (const f of files) {
    if (f.language === 'html') continue;
    const name = escapeRegExp(f.name);
    if (f.language === 'css') {
      const re = new RegExp(`<link[^>]*href=["']\\.?/?${name}["'][^>]*>`, 'i');
      const tag = `<style>\n${escapeStyle(f.code)}\n</style>`;
      if (re.test(doc)) doc = doc.replace(re, () => tag);
      else if (!multi) appendCss.push(tag);
    } else if (f.language === 'javascript') {
      const re = new RegExp(`<script[^>]*src=["']\\.?/?${name}["'][^>]*>\\s*</script>`, 'i');
      const tag = `<script>\n${escapeScript(f.code)}\n</script>`;
      if (re.test(doc)) doc = doc.replace(re, () => tag);
      else if (!multi) appendJs.push(tag);
    }
  }

  if (appendCss.length) {
    const css = appendCss.join('\n');
    doc = /<\/head>/i.test(doc) ? doc.replace(/<\/head>/i, () => css + '\n</head>') : css + '\n' + doc;
  }
  if (appendJs.length) {
    const js = appendJs.join('\n');
    doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, () => js + '\n</body>') : doc + '\n' + js;
  }

  const lib = await inlineLibraries(doc);
  doc = lib.doc;
  const usesFetch = files.some((f) => /\bfetch\s*\(/.test(f.code));
  const settle = lib.tailwind ? 900 : usesFetch ? 700 : 60;
  const pages = htmlFiles.map((f) => f.name);
  const boot = `<script>${escapeScript(bootstrapScript(runId, probes, settle, pages))}</script>`;
  if (/<head[^>]*>/i.test(doc)) doc = doc.replace(/<head[^>]*>/i, (m) => m + boot);
  else if (/<html[^>]*>/i.test(doc)) doc = doc.replace(/<html[^>]*>/i, (m) => m + boot);
  else doc = boot + doc;

  if (!/^\s*<!doctype/i.test(doc)) doc = '<!doctype html>\n' + doc;
  return doc;
}

export async function runWeb(files: SourceFile[], ctx: { runId: number; probes?: Probes; page?: string }): Promise<RunOutput> {
  return { ok: true, logs: [], previewDoc: await buildWebDoc(files, ctx.runId, ctx.probes, ctx.page) };
}
