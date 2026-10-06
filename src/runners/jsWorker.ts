import { transform } from 'sucrase';
import { FORMAT_SOURCE } from './consoleShim';
import API_MOCK_SOURCE from './apiMock.js?raw';
import NODE_SHIMS_SOURCE from './nodeShims.js?raw';
import type { LogLine, RunOutput, SourceFile } from './types';

const WORKER_SOURCE = `
${FORMAT_SOURCE}
var __count = 0, __max = 2000;
function __send(level, text) {
  if (__count++ < __max) postMessage({ type: 'log', level: level, text: text });
  else if (__count === __max + 1) postMessage({ type: 'log', level: 'warn', text: 'Too much output - the rest is hidden.' });
}
['log', 'info', 'warn', 'error', 'debug'].forEach(function (k) {
  console[k] = function () { __send(k === 'debug' ? 'log' : k === 'error' ? 'stderr' : k, __fmtArgs(arguments)); };
});
var __indent = '';
function __lines(prefix, text) { return String(text).split('\\n').map(function (l) { return prefix + l; }).join('\\n'); }
['log', 'info', 'warn', 'error', 'debug'].forEach(function (k) {
  var level = k === 'debug' ? 'log' : k === 'error' ? 'stderr' : k;
  console[k] = function () { __send(level, __indent ? __lines(__indent, __fmtArgs(arguments)) : __fmtArgs(arguments)); };
});
console.dir = function (v) { __send('log', __indent ? __lines(__indent, __fmtArgs([v])) : __fmtArgs([v])); };
console.group = function () { if (arguments.length) console.log.apply(console, arguments); __indent += '  '; };
console.groupCollapsed = console.group;
console.groupEnd = function () { __indent = __indent.slice(2); };
console.assert = function (cond) { if (!cond) { var rest = Array.prototype.slice.call(arguments, 1); __send('stderr', 'Assertion failed' + (rest.length ? ': ' + __fmtArgs(rest) : '')); } };
var __counts = {};
console.count = function (label) { label = label === undefined ? 'default' : String(label); __counts[label] = (__counts[label] || 0) + 1; console.log(label + ': ' + __counts[label]); };
console.countReset = function (label) { delete __counts[label === undefined ? 'default' : String(label)]; };
console.table = function (data) {
  if (data === null || typeof data !== 'object') return console.log(data);
  var rows = Array.isArray(data) ? data.map(function (v, i) { return [String(i), v]; }) : Object.keys(data).map(function (k) { return [k, data[k]]; });
  var cols = [], hasValues = false;
  rows.forEach(function (r) {
    if (r[1] !== null && typeof r[1] === 'object') Object.keys(r[1]).forEach(function (c) { if (cols.indexOf(c) < 0) cols.push(c); });
    else hasValues = true;
  });
  var head = ['(index)'].concat(cols).concat(hasValues ? ['Values'] : []);
  var body = rows.map(function (r) {
    var row = [r[0]];
    cols.forEach(function (c) { var cv = r[1] !== null && typeof r[1] === 'object' && c in r[1] ? r[1][c] : undefined; row.push(c in (r[1] || {}) ? (typeof cv === 'string' ? "'" + cv + "'" : __fmtArgs([cv])) : ''); });
    if (hasValues) row.push(r[1] !== null && typeof r[1] === 'object' ? '' : __fmtArgs([r[1]]));
    return row;
  });
  var widths = head.map(function (h, i) { return Math.max(h.length, Math.max.apply(null, body.map(function (r) { return r[i].length; }).concat([0]))) + 2; });
  function pad(t, w) { var left = Math.floor((w - t.length) / 2); return ' '.repeat(left) + t + ' '.repeat(w - t.length - left); }
  function line(l, m, r) { return l + widths.map(function (w) { return '─'.repeat(w); }).join(m) + r; }
  var out = [line('┌', '┬', '┐'), '│' + head.map(function (h, i) { return pad(h, widths[i]); }).join('│') + '│', line('├', '┼', '┤')];
  body.forEach(function (r) { out.push('│' + r.map(function (c, i) { return pad(c, widths[i]); }).join('│') + '│'); });
  out.push(line('└', '┴', '┘'));
  console.log(out.join('\\n'));
};
self.addEventListener('unhandledrejection', function (ev) { ev.preventDefault(); __send('error', 'Unhandled promise rejection: ' + __errText(ev.reason)); });
self.alert = function (m) { __send('log', '[alert] ' + m); };
self.prompt = function () { return null; };

var __timers = new Set(), __mainDone = false, __busyN = 0;
function __busy(d) { if (d > 0) __busyN++; else __st(function () { __busyN--; __maybeDone(); }, 0); }
function __maybeDone() { if (__mainDone && __timers.size === 0 && __busyN === 0) postMessage({ type: 'done' }); }
function __errText(err) {
  var msg = (err && err.name ? err.name + ': ' : '') + (err && err.message ? err.message : String(err));
  var m = err && err.stack && /<anonymous>:(\\d+):(\\d+)/.exec(String(err.stack));
  if (m) msg += ' (line ' + (parseInt(m[1], 10) - 2) + ')';
  return msg;
}
var __st = self.setTimeout, __si = self.setInterval, __ct = self.clearTimeout, __ci = self.clearInterval;
self.setTimeout = function (fn, ms) {
  var args = Array.prototype.slice.call(arguments, 2);
  var id = __st(function () {
    __timers.delete(id);
    try { if (typeof fn === 'function') fn.apply(null, args); } catch (e) { __send('error', __errText(e)); }
    __maybeDone();
  }, ms);
  __timers.add(id);
  return id;
};
self.setInterval = function (fn, ms) {
  var args = Array.prototype.slice.call(arguments, 2);
  var id = __si(function () { try { if (typeof fn === 'function') fn.apply(null, args); } catch (e) { __send('error', __errText(e)); } }, ms);
  __timers.add(id);
  return id;
};
self.clearTimeout = function (id) { __timers.delete(id); __ct(id); __maybeDone(); };
self.clearInterval = function (id) { __timers.delete(id); __ci(id); __maybeDone(); };

${API_MOCK_SOURCE}

${NODE_SHIMS_SOURCE}

self.onmessage = async function (e) {
  try {
    await __runMain(e.data.files, e.data.main);
    await __runTests();
  } catch (err) {
    __send('error', __errText(err));
  }
  __mainDone = true;
  __maybeDone();
};
`;

const TIMEOUT_MS = 5000;

function cleanSucraseError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  return msg.replace(/^Error transforming .*?:\s*/, '');
}

/** Runs plain JavaScript or TypeScript in a throwaway Web Worker (so infinite loops can be stopped). */
export async function runScript(files: SourceFile[], kind: 'js' | 'ts'): Promise<RunOutput> {
  const start = performance.now();
  const compiled: Record<string, string> = {};
  for (const file of files) {
    if (!/\.(m?[jt]sx?|json)$/i.test(file.name) && files.length > 1) continue;
    if (/\.json$/i.test(file.name)) {
      compiled[file.name] = file.code;
      continue;
    }
    try {
      compiled[file.name] = transform(file.code, {
        transforms: kind === 'ts' || /\.tsx?$/i.test(file.name) ? ['typescript', 'imports'] : ['imports'],
        disableESTransforms: true,
      }).code;
    } catch (e) {
      return { ok: false, logs: [{ level: 'error', text: (files.length > 1 ? file.name + ': ' : '') + 'Syntax error: ' + cleanSucraseError(e) }] };
    }
  }
  const main = files[0].name;

  const blob = new Blob([WORKER_SOURCE], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  const logs: LogLine[] = [];

  return new Promise<RunOutput>((resolve) => {
    let finished = false;
    const finish = (extra?: LogLine) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      if (extra) logs.push(extra);
      resolve({ ok: !logs.some((l) => l.level === 'error'), logs, durationMs: performance.now() - start });
    };
    const timer = setTimeout(
      () => finish({ level: 'error', text: 'Stopped: your code was still running after 5 seconds. Is there an infinite loop?' }),
      TIMEOUT_MS,
    );
    worker.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'log') logs.push({ level: m.level, text: m.text });
      else if (m.type === 'done') finish();
    };
    worker.onerror = (e) => finish({ level: 'error', text: e.message || 'Worker error' });
    worker.postMessage({ files: compiled, main });
  });
}
