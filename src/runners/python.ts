import type { GameTest, LogLine, RunOutput, SourceFile } from './types';

const RUN_TIMEOUT_MS = 10000;

let worker: Worker | null = null;
let ready: Promise<Worker> | null = null;
let gameGen = 0;

function baseUrl(): string {
  return new URL(import.meta.env.BASE_URL, location.href).href;
}

function getWorker(): Promise<Worker> {
  if (ready) return ready;
  ready = new Promise<Worker>((resolve, reject) => {
    const w = new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
    w.onmessage = (e) => {
      if (e.data.type === 'ready') {
        worker = w;
        resolve(w);
      } else if (e.data.type === 'init-error') {
        ready = null;
        w.terminate();
        reject(new Error(e.data.message));
      }
    };
    w.onerror = (e) => {
      ready = null;
      w.terminate();
      reject(new Error(e.message || 'Could not start the Python worker'));
    };
    w.postMessage({ type: 'init', base: baseUrl() });
  });
  return ready;
}

/** Start downloading the Python runtime early so the first Run feels instant. */
export function preloadPython() {
  getWorker().catch(() => undefined);
}

export async function runPython(files: SourceFile[], ctx: { stdin: string; onStatus?: (s: string) => void }): Promise<RunOutput> {
  const start = performance.now();
  if (!worker) ctx.onStatus?.('Loading Python (first time takes a few seconds)...');
  let w: Worker;
  try {
    w = await getWorker();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, logs: [{ level: 'error', text: 'Could not load the Python runtime: ' + msg }] };
  }
  ctx.onStatus?.('Running...');

  return new Promise<RunOutput>((resolve) => {
    const logs: LogLine[] = [];
    let finished = false;
    const finish = (extra?: LogLine) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (extra) logs.push(extra);
      resolve({ ok: !logs.some((l) => l.level === 'error'), logs, durationMs: performance.now() - start });
    };
    const kill = (text: string) => () => {
      w.terminate();
      worker = null;
      ready = null;
      finish({ level: 'error', text });
    };
    // while packages download there is a generous limit; the run limit starts when the program itself starts
    let timer = setTimeout(kill('Stopped: downloading the Python packages took more than 2 minutes. Check your connection.'), 120000);
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'log') logs.push({ level: m.level, text: m.text });
      else if (m.type === 'status') ctx.onStatus?.(String(m.text));
      else if (m.type === 'phase') {
        clearTimeout(timer);
        ctx.onStatus?.('Running...');
        timer = setTimeout(
          kill(`Stopped: your program ran for more than ${m.heavy ? 60 : 10} seconds. Is there an infinite loop?`),
          m.heavy ? 60000 : RUN_TIMEOUT_MS,
        );
      } else if (m.type === 'done') finish();
    };
    w.postMessage({ type: 'run', code: files[0].code, stdin: ctx.stdin });
  });
}

/* ------------------------------------------------------------------ games */

export interface GameCallbacks {
  onLog: (level: LogLine['level'], text: string) => void;
  onStarted: (hasLoop: boolean) => void;
  onFrozen: () => void;
}

export interface GameHandle {
  stop: () => void;
  key: (kind: 'keydown' | 'keyup', key: string) => void;
  mouse: (x: number, y: number, down: boolean) => void;
  blur: () => void;
}

/** Starts a live game: the Python program draws onto the transferred canvas, 60 times a second. */
export async function startPythonGame(
  file: SourceFile,
  canvas: OffscreenCanvas,
  cb: GameCallbacks,
  onStatus?: (s: string) => void,
  shouldAbort?: () => boolean,
): Promise<GameHandle | null> {
  if (!worker) onStatus?.('Loading Python (first time takes a few seconds)...');
  let w: Worker;
  try {
    w = await getWorker();
  } catch (e) {
    cb.onLog('error', 'Could not load the Python runtime: ' + (e instanceof Error ? e.message : String(e)));
    return null;
  }
  onStatus?.('');
  if (shouldAbort?.()) return null; // the panel was closed while Python was loading
  const gen = ++gameGen;
  let lastBeat = performance.now();
  let startedAt = 0;
  let stopped = false;

  const watchdog = setInterval(() => {
    if (stopped) return;
    const now = performance.now();
    const loading = startedAt === 0 && now - lastBeat > 10000; // script itself never finished
    const frozen = startedAt !== 0 && now - lastBeat > 3000; // game loop stopped answering
    if (loading || frozen) {
      stopped = true;
      clearInterval(watchdog);
      w.terminate();
      worker = null;
      ready = null;
      cb.onFrozen();
    }
  }, 1000);

  w.onmessage = (e) => {
    const m = e.data;
    if (m.type === 'log') cb.onLog(m.level, m.text);
    else if (m.type === 'hb') lastBeat = performance.now();
    else if (m.type === 'game-started') {
      startedAt = performance.now();
      lastBeat = startedAt;
      cb.onStarted(!!m.hasLoop);
    }
  };
  lastBeat = performance.now();
  w.postMessage({ type: 'run-game', code: file.code, canvas }, [canvas]);

  return {
    stop() {
      if (stopped) return;
      stopped = true;
      clearInterval(watchdog);
      if (gameGen === gen) w.postMessage({ type: 'stop-game' });
    },
    key: (kind, key) => w.postMessage({ type: 'input', kind, key }),
    mouse: (x, y, down) => w.postMessage({ type: 'input', kind: 'mouse', x, y, down }),
    blur: () => w.postMessage({ type: 'input', kind: 'blur' }),
  };
}

/** Runs the program without a screen for N frames with simulated keys, then evaluates a Python expression. */
export async function testPythonGame(
  files: SourceFile[],
  test: GameTest,
  onStatus?: (s: string) => void,
): Promise<{ output: RunOutput; passed: boolean; detail: string }> {
  const start = performance.now();
  if (!worker) onStatus?.('Loading Python (first time takes a few seconds)...');
  let w: Worker;
  try {
    w = await getWorker();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { output: { ok: false, logs: [{ level: 'error', text: 'Could not load the Python runtime: ' + msg }] }, passed: false, detail: msg };
  }
  onStatus?.('Testing your game...');
  return new Promise((resolve) => {
    const logs: LogLine[] = [];
    let passed = false;
    let detail = '';
    let finished = false;
    const finish = (extra?: LogLine) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (extra) logs.push(extra);
      resolve({
        output: { ok: !logs.some((l) => l.level === 'error'), logs, durationMs: performance.now() - start },
        passed,
        detail,
      });
    };
    const timer = setTimeout(() => {
      w.terminate();
      worker = null;
      ready = null;
      detail = 'Your program ran for too long. Is there an infinite loop?';
      finish({ level: 'error', text: 'Stopped: your program ran for more than 10 seconds. Is there an infinite loop?' });
    }, RUN_TIMEOUT_MS);
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'log') logs.push({ level: m.level, text: m.text });
      else if (m.type === 'test-result') {
        passed = m.passed;
        detail = m.detail;
      } else if (m.type === 'done') finish();
    };
    w.postMessage({ type: 'test-game', code: files[0].code, test });
  });
}
