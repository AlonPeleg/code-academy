/// <reference lib="webworker" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GAME_SHIM } from './gameShim';

let pyodide: any = null;
let stdinLines: string[] = [];

/** Remove Pyodide-internal frames from a Python traceback so learners only see their own code. */
function cleanTraceback(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^\s+File "(.*?)", line (\d+)/.exec(lines[i]);
    if (m) {
      if (m[1] !== '<exec>') {
        // skip this frame and the indented source lines that follow it
        while (i + 1 < lines.length && /^\s{4,}/.test(lines[i + 1])) i++;
        continue;
      }
      out.push(`  Line ${m[2]}`);
      continue;
    }
    out.push(lines[i]);
  }
  return out.join('\n').trim();
}

const send = (m: Record<string, unknown>) => postMessage(m);

/* ------------------------------------------------------------------ game engine (JS side) */

interface GameState {
  ctx: OffscreenCanvasRenderingContext2D | null;
  down: Set<string>;
  pressed: Set<string>;
  mx: number;
  my: number;
  mdown: boolean;
  mpressed: boolean;
  frameFn: any;
  timer: ReturnType<typeof setTimeout> | null;
  running: boolean;
  startedAt: number;
  testError: string | null;
}

const G: GameState = {
  ctx: null, down: new Set(), pressed: new Set(), mx: 0, my: 0, mdown: false, mpressed: false,
  frameFn: null, timer: null, running: false, startedAt: 0, testError: null,
};

const css = (r: number, g: number, b: number) => `rgb(${r | 0},${g | 0},${b | 0})`;

const gameJs = {
  clear(r: number, g: number, b: number) {
    if (!G.ctx) return;
    G.ctx.fillStyle = css(r, g, b);
    G.ctx.fillRect(0, 0, 320, 240);
  },
  rect(x: number, y: number, w: number, h: number, r: number, g: number, b: number) {
    if (!G.ctx) return;
    G.ctx.fillStyle = css(r, g, b);
    G.ctx.fillRect(x, y, w, h);
  },
  circle(x: number, y: number, radius: number, r: number, g: number, b: number) {
    if (!G.ctx) return;
    G.ctx.fillStyle = css(r, g, b);
    G.ctx.beginPath();
    G.ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);
    G.ctx.fill();
  },
  line(x1: number, y1: number, x2: number, y2: number, width: number, r: number, g: number, b: number) {
    if (!G.ctx) return;
    G.ctx.strokeStyle = css(r, g, b);
    G.ctx.lineWidth = width;
    G.ctx.beginPath();
    G.ctx.moveTo(x1, y1);
    G.ctx.lineTo(x2, y2);
    G.ctx.stroke();
  },
  text(x: number, y: number, message: string, size: number, r: number, g: number, b: number) {
    if (!G.ctx) return;
    G.ctx.fillStyle = css(r, g, b);
    G.ctx.font = `${size}px ui-monospace, Menlo, Consolas, monospace`;
    G.ctx.textBaseline = 'top';
    G.ctx.fillText(message, x, y);
  },
  key_down: (k: string) => G.down.has(k),
  key_pressed: (k: string) => G.pressed.has(k),
  mouse_x: () => G.mx,
  mouse_y: () => G.my,
  mouse_down: () => G.mdown,
  mouse_pressed: () => G.mpressed,
  time: () => (performance.now() - G.startedAt) / 1000,
  stop: () => stopGame(),
  register(fn: any) {
    if (G.frameFn) G.frameFn.destroy?.();
    G.frameFn = fn.copy(); // keep the Python function alive after this call returns
  },
  error(text: string) {
    G.testError = cleanTraceback(text);
    send({ type: 'log', level: 'error', text: G.testError });
    stopGame();
  },
};

function stopGame() {
  G.running = false;
  if (G.timer) clearTimeout(G.timer);
  G.timer = null;
}

function resetGameState() {
  stopGame();
  if (G.frameFn) {
    G.frameFn.destroy?.();
    G.frameFn = null;
  }
  G.down.clear();
  G.pressed.clear();
  G.mdown = false;
  G.mpressed = false;
  G.testError = null;
  G.startedAt = performance.now();
}

function startLoop() {
  if (!G.frameFn) return;
  G.running = true;
  let last = performance.now();
  let n = 0;
  const tick = () => {
    if (!G.running) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    try {
      G.frameFn(dt);
    } catch (e: any) {
      send({ type: 'log', level: 'error', text: cleanTraceback(String(e?.message ?? e)) });
      stopGame();
      return;
    }
    G.pressed.clear();
    G.mpressed = false;
    if (++n % 10 === 0) send({ type: 'hb' });
    if (G.running) G.timer = setTimeout(tick, 1000 / 60);
  };
  tick();
}

/* ------------------------------------------------------------------ Pyodide */

async function init(base: string) {
  const mod = await import(/* @vite-ignore */ base + 'pyodide/pyodide.mjs');
  // The Python core is served locally. Big packages (numpy, pandas, matplotlib, scikit-learn ...) are fetched
  // from the official Pyodide CDN, only when a program imports them.
  pyodide = await mod.loadPyodide({
    indexURL: base + 'pyodide/',
    packageBaseUrl: `https://cdn.jsdelivr.net/pyodide/v${mod.version}/full/`,
  });
  pyodide.runPython(`import os; os.environ['MPLBACKEND'] = 'agg'`);
  pyodide.registerJsModule('_plot_js', { emit: (b64: string) => send({ type: 'log', level: 'image', text: b64 }) });
  pyodide.setStdin({ stdin: () => (stdinLines.length ? stdinLines.shift() : undefined) });
  // install the `game` module
  pyodide.registerJsModule('_game_js', gameJs);
  pyodide.globals.set('_SHIM', GAME_SHIM);
  pyodide.runPython(`
import sys, types
_m = types.ModuleType('game')
sys.modules['game'] = _m
exec(_SHIM, _m.__dict__)
del _SHIM, _m
`);
}

function setupIo(stdin: string) {
  const log = (level: string) => ({ batched: (text: string) => send({ type: 'log', level, text }) });
  pyodide.setStdout(log('stdout'));
  pyodide.setStderr(log('stderr'));
  stdinLines = stdin ? String(stdin).replace(/\n$/, '').split('\n') : [];
}

const HEAVY = /\b(numpy|pandas|matplotlib|sklearn|scipy|statsmodels|PIL|networkx|sympy)\b/;

const PLOT_SETUP = `
import sys as _sys
def _setup_plots():
    import io, base64
    import matplotlib
    matplotlib.use('agg')
    import matplotlib.pyplot as plt
    import _plot_js

    def _emit():
        for n in plt.get_fignums():
            fig = plt.figure(n)
            buf = io.BytesIO()
            fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
            _plot_js.emit(base64.b64encode(buf.getvalue()).decode())
        plt.close('all')

    plt.show = lambda *a, **k: _emit()
    _sys.modules['_academy_emit'] = _emit
`;

/** Download the packages a program imports (numpy, pandas, ...) and prepare plotting. Returns true if heavy packages were used. */
async function prepareDeps(code: string): Promise<boolean> {
  const heavy = HEAVY.test(code);
  if (!heavy) return false;
  try {
    await pyodide.loadPackagesFromImports(code, {
      messageCallback: (t: string) => send({ type: 'status', text: t }),
      errorCallback: (t: string) => send({ type: 'status', text: t }),
    });
    if (/\bmatplotlib\b/.test(code)) {
      send({ type: 'status', text: 'Preparing matplotlib...' });
      pyodide.runPython(PLOT_SETUP + '\n_setup_plots()');
    }
  } catch (err: any) {
    send({
      type: 'log',
      level: 'error',
      text:
        'Could not download the data-science packages. They load from the internet (cdn.jsdelivr.net) the first time you use them, ' +
        'so check your connection and try again.\n' + String(err?.message ?? err).split('\n')[0],
    });
    throw err;
  }
  return true;
}

/** Runs the learner's script. Returns the globals dict (caller must destroy) or null on error. */
async function runScript(code: string): Promise<any | null> {
  const globals = pyodide.toPy({});
  globals.set('__name__', '__main__');
  let heavy = false;
  try {
    heavy = await prepareDeps(code);
  } catch {
    globals.destroy();
    return null;
  }
  send({ type: 'phase', name: 'running', heavy });
  try {
    await pyodide.runPythonAsync(code, { globals });
    return globals;
  } catch (err: any) {
    send({ type: 'log', level: 'error', text: cleanTraceback(String(err?.message ?? err)) });
    globals.destroy();
    return null;
  } finally {
    try {
      pyodide.runPython(
        `import sys; sys.stdout.flush(); sys.stderr.flush()\nif '_academy_emit' in sys.modules: sys.modules['_academy_emit']()`,
      );
    } catch {
      /* ignore */
    }
  }
}

let gameGlobals: any = null;

self.onmessage = async (e: MessageEvent) => {
  const m = e.data;

  if (m.type === 'init') {
    try {
      await init(m.base);
      send({ type: 'ready' });
    } catch (err: any) {
      send({ type: 'init-error', message: String(err?.message ?? err) });
    }
    return;
  }

  /* ---- keyboard / mouse from the page ---- */
  if (m.type === 'input') {
    if (m.kind === 'keydown') {
      if (!G.down.has(m.key)) G.pressed.add(m.key);
      G.down.add(m.key);
    } else if (m.kind === 'keyup') {
      G.down.delete(m.key);
    } else if (m.kind === 'mouse') {
      G.mx = m.x;
      G.my = m.y;
      if (m.down && !G.mdown) G.mpressed = true;
      G.mdown = !!m.down;
    } else if (m.kind === 'blur') {
      G.down.clear();
      G.mdown = false;
    }
    return;
  }

  if (m.type === 'stop-game') {
    resetGameState();
    if (gameGlobals) {
      gameGlobals.destroy();
      gameGlobals = null;
    }
    return;
  }

  /* ---- normal console run ---- */
  if (m.type === 'run') {
    resetGameState();
    G.ctx = null;
    setupIo(m.stdin);
    const globals = await runScript(m.code);
    globals?.destroy();
    resetGameState();
    send({ type: 'done' });
    return;
  }

  /* ---- live game on a canvas ---- */
  if (m.type === 'run-game') {
    resetGameState();
    if (gameGlobals) {
      gameGlobals.destroy();
      gameGlobals = null;
    }
    G.ctx = (m.canvas as OffscreenCanvas).getContext('2d') as OffscreenCanvasRenderingContext2D;
    setupIo('');
    gameGlobals = await runScript(m.code);
    send({ type: 'game-started', hasLoop: !!G.frameFn });
    if (gameGlobals && G.frameFn) startLoop();
    return;
  }

  /* ---- headless scripted test (used by "Check answer") ---- */
  if (m.type === 'test-game') {
    resetGameState();
    G.ctx = null;
    setupIo('');
    const globals = await runScript(m.code);
    let passed = false;
    let detail = '';
    if (!globals) {
      detail = 'Your program raised an error before the game could start.';
    } else if (!G.frameFn) {
      detail = 'Your program never called game.run(update, draw), so the game never started.';
    } else {
      const keys: { key: string; from: number; to: number }[] = m.test.keys ?? [];
      for (let f = 0; f < m.test.frames && !G.testError; f++) {
        for (const k of keys) {
          if (f >= k.from && f < k.to) {
            if (!G.down.has(k.key)) G.pressed.add(k.key);
            G.down.add(k.key);
          } else {
            G.down.delete(k.key);
          }
        }
        try {
          G.frameFn(1 / 60);
        } catch (err: any) {
          G.testError = cleanTraceback(String(err?.message ?? err));
          send({ type: 'log', level: 'error', text: G.testError });
        }
        G.pressed.clear();
      }
      if (G.testError) {
        detail = 'Your game crashed while it was running (see the error in the console).';
      } else {
        try {
          globals.set('__expect__', m.test.expect);
          passed = !!pyodide.runPython('bool(eval(__expect__, globals()))', { globals });
          if (!passed) detail = 'The game did not behave as expected yet.';
        } catch (err: any) {
          detail = 'Could not check your game: ' + cleanTraceback(String(err?.message ?? err));
        }
      }
    }
    globals?.destroy();
    resetGameState();
    send({ type: 'test-result', passed, detail });
    send({ type: 'done' });
  }
};
