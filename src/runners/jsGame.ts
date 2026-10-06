import type { GameTest, LogLine, RunOutput, SourceFile } from './types';
import type { GameCallbacks, GameHandle } from './python';

const TEST_TIMEOUT_MS = 10000;

function newWorker() {
  return new Worker(new URL('./jsGame.worker.ts', import.meta.url), { type: 'module' });
}

/** Starts a live JavaScript game: the program draws onto the transferred canvas, 60 times a second. */
export async function startJsGame(
  file: SourceFile,
  canvas: OffscreenCanvas,
  cb: GameCallbacks,
  onStatus?: (s: string) => void,
  shouldAbort?: () => boolean,
): Promise<GameHandle | null> {
  onStatus?.('');
  if (shouldAbort?.()) return null;
  const w = newWorker();
  let stopped = false;
  let lastBeat = performance.now();
  let startedAt = 0;

  const watchdog = setInterval(() => {
    if (stopped) return;
    const now = performance.now();
    const loading = startedAt === 0 && now - lastBeat > 5000;
    const frozen = startedAt !== 0 && now - lastBeat > 3000;
    if (loading || frozen) {
      stopped = true;
      clearInterval(watchdog);
      w.terminate();
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
  w.onerror = (e) => cb.onLog('error', e.message || 'The game crashed');
  w.postMessage({ type: 'run-game', code: file.code, canvas }, [canvas]);

  return {
    stop() {
      if (stopped) return;
      stopped = true;
      clearInterval(watchdog);
      w.terminate();
    },
    key: (kind, key) => w.postMessage({ type: 'input', kind, key }),
    mouse: (x, y, down) => w.postMessage({ type: 'input', kind: 'mouse', x, y, down }),
    blur: () => w.postMessage({ type: 'input', kind: 'blur' }),
  };
}

/** Runs the program without a screen for N frames with simulated keys, then evaluates a JavaScript expression. */
export async function testJsGame(
  files: SourceFile[],
  test: GameTest,
  onStatus?: (s: string) => void,
): Promise<{ output: RunOutput; passed: boolean; detail: string }> {
  const start = performance.now();
  onStatus?.('Testing your game...');
  const w = newWorker();
  return new Promise((resolve) => {
    const logs: LogLine[] = [];
    let passed = false;
    let detail = '';
    let finished = false;
    const finish = (extra?: LogLine) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      w.terminate();
      if (extra) logs.push(extra);
      resolve({ output: { ok: !logs.some((l) => l.level === 'error'), logs, durationMs: performance.now() - start }, passed, detail });
    };
    const timer = setTimeout(() => {
      detail = 'Your program ran for too long. Is there an infinite loop?';
      finish({ level: 'error', text: 'Stopped: your program ran for more than 10 seconds. Is there an infinite loop?' });
    }, TEST_TIMEOUT_MS);
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'log') logs.push({ level: m.level, text: m.text });
      else if (m.type === 'test-result') {
        passed = m.passed;
        detail = m.detail;
      } else if (m.type === 'done') finish();
    };
    w.onerror = (e) => finish({ level: 'error', text: e.message || 'The game crashed' });
    w.postMessage({ type: 'test-game', code: files[0].code, test });
  });
}
