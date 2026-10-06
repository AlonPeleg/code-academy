import { transform } from 'sucrase';
import { FORMAT_SOURCE } from './consoleShim';
import API_MOCK_SOURCE from './apiMock.js?raw';
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
self.alert = function (m) { __send('log', '[alert] ' + m); };
self.prompt = function () { return null; };

var __timers = new Set(), __mainDone = false;
function __maybeDone() { if (__mainDone && __timers.size === 0) postMessage({ type: 'done' }); }
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

self.onmessage = async function (e) {
  var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  try {
    var fn = new AsyncFunction('exports', 'module', 'require', e.data.code);
    await fn({}, { exports: {} }, function (name) {
      throw new Error("import/require is not available in this sandbox (" + name + ")");
    });
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
  const file = files[0];
  const start = performance.now();
  let code: string;
  try {
    code = transform(file.code, {
      transforms: kind === 'ts' ? ['typescript', 'imports'] : ['imports'],
      disableESTransforms: true,
    }).code;
  } catch (e) {
    return { ok: false, logs: [{ level: 'error', text: 'Syntax error: ' + cleanSucraseError(e) }] };
  }

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
    worker.postMessage({ code });
  });
}
