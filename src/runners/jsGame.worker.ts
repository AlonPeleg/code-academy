/// <reference lib="webworker" />
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Runs a JavaScript game. The learner's program gets a `game` object (the same tiny engine as the Python one,
 * with JavaScript names) and draws on an OffscreenCanvas. Also runs headless for "Check answer".
 */
import { ART, PALETTE } from './jsGameArt';

const W = 320;
const H = 240;

type Color = [number, number, number];

const send = (m: Record<string, unknown>) => postMessage(m);

let ctx: OffscreenCanvasRenderingContext2D | null = null;
const down = new Set<string>();
const pressed = new Set<string>();
let mx = 0;
let my = 0;
let mdown = false;
let mpressed = false;
let updateFn: ((dt: number) => void) | null = null;
let drawFn: (() => void) | null = null;
let running = false;
let startedAt = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
let frameError: string | null = null;

const css = (c: Color) => {
  const [r, g, b] = c;
  return `rgb(${r | 0},${g | 0},${b | 0})`;
};
function color(c: any, fallback: Color = [255, 255, 255]): Color {
  if (c === undefined) return fallback;
  if (!Array.isArray(c) || c.length < 3 || c.some((n) => typeof n !== 'number' || Number.isNaN(n))) {
    throw new TypeError('A color must be three numbers like [255, 0, 0], but got ' + JSON.stringify(c));
  }
  return [c[0], c[1], c[2]];
}
function num(name: string, v: any): number {
  if (typeof v !== 'number' || Number.isNaN(v)) throw new TypeError(`${name} must be a number, but got ${JSON.stringify(v)}`);
  return v;
}


/* ---- pixel-art sprites: art is an array of equal-length strings, '.' or ' ' is transparent, other letters come from game.PALETTE ---- */
const spriteCache = new Map<string, OffscreenCanvas>();
function artRows(art: any): string[] {
  if (!Array.isArray(art) || !art.length || art.some((r) => typeof r !== 'string')) {
    throw new TypeError('game.sprite needs the art as a list of text rows, like game.art.slime.idle, but got ' + JSON.stringify(art)?.slice(0, 60));
  }
  const w = art[0].length;
  art.forEach((r: string, i: number) => {
    if (r.length !== w) throw new TypeError(`Every row of the art must have the same length. Row ${i + 1} has ${r.length} letters but row 1 has ${w}.`);
    for (const ch of r) if (ch !== '.' && ch !== ' ' && !PALETTE[ch]) throw new TypeError(`Unknown color letter "${ch}" in the art. Use '.' for empty or a letter from game.PALETTE.`);
  });
  return art;
}
function spriteCanvas(rows: string[], flip: boolean): OffscreenCanvas {
  const key = (flip ? 'f' : 'n') + rows.join('|');
  let c = spriteCache.get(key);
  if (c) return c;
  const w = rows[0].length;
  const h = rows.length;
  c = new OffscreenCanvas(w, h);
  const cx = c.getContext('2d')!;
  rows.forEach((row, y) => {
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const col = PALETTE[ch];
      cx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
      cx.fillRect(flip ? w - 1 - x : x, y, 1, 1);
    }
  });
  if (spriteCache.size > 400) spriteCache.clear();
  spriteCache.set(key, c);
  return c;
}
let camX = 0;
let camY = 0;
let alphaNow = 1;
function applyView() {
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, -Math.round(camX), -Math.round(camY));
  ctx.globalAlpha = alphaNow;
}

const game = {
  WIDTH: W,
  HEIGHT: H,
  BLACK: [0, 0, 0], WHITE: [255, 255, 255], GRAY: [130, 130, 150], DARK: [22, 24, 44],
  RED: [239, 68, 68], ORANGE: [249, 115, 22], YELLOW: [250, 204, 21], GREEN: [34, 197, 94],
  CYAN: [34, 211, 238], BLUE: [59, 130, 246], PURPLE: [168, 85, 247], PINK: [244, 114, 182],
  PALETTE,
  art: ART,
  clear(c?: Color) {
    const col = color(c, [0, 0, 0]);
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = css(col);
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  },
  /** Draw pixel art. options: { flip: true to face left, scale: 2 to draw twice as big, alpha: 0..1 } */
  sprite(x: number, y: number, art: any, options?: { flip?: boolean; scale?: number; alpha?: number }) {
    num('x', x); num('y', y);
    const rows = artRows(art);
    const scale = options?.scale ?? 1;
    num('scale', scale);
    if (!ctx) return;
    const c = spriteCanvas(rows, !!options?.flip);
    ctx.imageSmoothingEnabled = false;
    const prev = ctx.globalAlpha;
    if (options?.alpha !== undefined) ctx.globalAlpha = prev * Math.max(0, Math.min(1, options.alpha));
    ctx.drawImage(c, Math.round(x), Math.round(y), c.width * scale, c.height * scale);
    ctx.globalAlpha = prev;
  },
  /** { w, h } of a piece of art in pixels (before scaling) */
  spriteSize(art: any) {
    const rows = artRows(art);
    return { w: rows[0].length, h: rows.length };
  },
  /** Scroll the world: everything drawn afterwards is shifted so (x, y) is at the top-left of the screen. game.camera(0, 0) for the HUD. */
  camera(x: number, y: number) {
    camX = num('x', x);
    camY = num('y', y);
    applyView();
  },
  /** See-through drawing: 1 is solid, 0 is invisible. Resets every frame. */
  alpha(a: number) {
    alphaNow = Math.max(0, Math.min(1, num('alpha', a)));
    applyView();
  },
  rect(x: number, y: number, w: number, h: number, c?: Color) {
    num('x', x); num('y', y); num('width', w); num('height', h);
    const col = color(c);
    if (!ctx) return;
    ctx.fillStyle = css(col);
    ctx.fillRect(x, y, w, h);
  },
  circle(x: number, y: number, radius: number, c?: Color) {
    num('x', x); num('y', y); num('radius', radius);
    const col = color(c);
    if (!ctx) return;
    ctx.fillStyle = css(col);
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);
    ctx.fill();
  },
  line(x1: number, y1: number, x2: number, y2: number, c?: Color, width = 1) {
    num('x1', x1); num('y1', y1); num('x2', x2); num('y2', y2);
    const col = color(c);
    if (!ctx) return;
    ctx.strokeStyle = css(col);
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  },
  text(x: number, y: number, message: unknown, c?: Color, size = 16) {
    num('x', x); num('y', y);
    const col = color(c);
    if (!ctx) return;
    ctx.fillStyle = css(col);
    ctx.font = `${size}px monospace`;
    ctx.textBaseline = 'top';
    ctx.fillText(String(message), x, y);
  },
  keyDown: (name: string) => down.has(String(name).toLowerCase()),
  keyPressed: (name: string) => pressed.has(String(name).toLowerCase()),
  mouse: () => ({ x: mx, y: my }),
  mouseDown: () => mdown,
  mousePressed: () => mpressed,
  time: () => (performance.now() - startedAt) / 1000,
  stop() {
    running = false;
    if (timer) clearTimeout(timer);
    timer = null;
  },
  run(update?: (dt: number) => void, draw?: () => void) {
    if (update !== undefined && typeof update !== 'function') throw new TypeError('game.run(update, draw): update must be a function');
    if (draw !== undefined && typeof draw !== 'function') throw new TypeError('game.run(update, draw): draw must be a function');
    updateFn = update ?? null;
    drawFn = draw ?? null;
  },
};

function fmt(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  try {
    return JSON.stringify(v) ?? String(v);
  } catch {
    return String(v);
  }
}
['log', 'info', 'warn', 'error', 'debug'].forEach((k) => {
  (console as any)[k] = (...a: unknown[]) => send({ type: 'log', level: k === 'debug' ? 'log' : k === 'error' ? 'stderr' : k, text: a.map(fmt).join(' ') });
});

function errText(err: any): string {
  const msg = (err?.name ? err.name + ': ' : '') + (err?.message ?? String(err));
  const m = err?.stack && /<anonymous>:(\d+):(\d+)/.exec(String(err.stack));
  return m ? `${msg} (line ${parseInt(m[1], 10) - 2})` : msg;
}

function runFrame(dt: number) {
  try {
    updateFn?.(dt);
    camX = 0; camY = 0; alphaNow = 1;
    applyView();
    drawFn?.();
  } catch (e) {
    frameError = errText(e);
    send({ type: 'log', level: 'error', text: frameError });
    game.stop();
  }
  pressed.clear();
  mpressed = false;
}

function startLoop() {
  running = true;
  startedAt = performance.now();
  let last = startedAt;
  let n = 0;
  const tick = () => {
    if (!running) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    runFrame(dt);
    if (++n % 10 === 0) send({ type: 'hb' });
    if (running) timer = setTimeout(tick, 1000 / 60);
  };
  tick();
}

const AsyncFunction = Object.getPrototypeOf(async function () { /* */ }).constructor;

function reset() {
  game.stop();
  camX = 0; camY = 0; alphaNow = 1;
  down.clear();
  pressed.clear();
  mdown = false;
  mpressed = false;
  updateFn = null;
  drawFn = null;
  frameError = null;
}

self.onmessage = async (e: MessageEvent) => {
  const m = e.data;

  if (m.type === 'input') {
    if (m.kind === 'keydown') {
      if (!down.has(m.key)) pressed.add(m.key);
      down.add(m.key);
    } else if (m.kind === 'keyup') down.delete(m.key);
    else if (m.kind === 'mouse') {
      mx = m.x;
      my = m.y;
      if (m.down && !mdown) mpressed = true;
      mdown = !!m.down;
    } else if (m.kind === 'blur') {
      down.clear();
      mdown = false;
    }
    return;
  }

  if (m.type === 'stop-game') {
    reset();
    return;
  }

  if (m.type === 'run-game') {
    reset();
    ctx = (m.canvas as OffscreenCanvas).getContext('2d') as OffscreenCanvasRenderingContext2D;
    startedAt = performance.now();
    let ok = true;
    try {
      await new AsyncFunction('game', m.code)(game);
    } catch (err) {
      ok = false;
      send({ type: 'log', level: 'error', text: errText(err) });
    }
    send({ type: 'game-started', hasLoop: !!(updateFn || drawFn) });
    if (ok && (updateFn || drawFn)) startLoop();
    return;
  }

  if (m.type === 'test-game') {
    reset();
    ctx = null;
    startedAt = performance.now();
    let passed = false;
    let detail = '';
    const keys: { key: string; from: number; to: number }[] = m.test.keys ?? [];
    const advance = () => {
      if (!updateFn && !drawFn) throw new Error('Your program never called game.run(update, draw), so the game never started.');
      for (let f = 0; f < m.test.frames && !frameError; f++) {
        for (const k of keys) {
          if (f >= k.from && f < k.to) {
            if (!down.has(k.key)) pressed.add(k.key);
            down.add(k.key);
          } else down.delete(k.key);
        }
        runFrame(1 / 60);
      }
    };
    try {
      // The expression is evaluated INSIDE the learner's program scope, so it can read their variables.
      const result = await new AsyncFunction('game', '__advance', '__expect', m.code + '\n;__advance();\nreturn eval(__expect);')(game, advance, m.test.expect);
      if (frameError) detail = 'Your game crashed while it was running (see the error in the console).';
      else {
        passed = !!result;
        if (!passed) detail = 'The game did not behave as expected yet.';
      }
    } catch (err: any) {
      if (/never called game\.run/.test(String(err?.message))) detail = String(err.message);
      else {
        detail = 'Your program raised an error before the check finished.';
        send({ type: 'log', level: 'error', text: errText(err) });
      }
    }
    reset();
    send({ type: 'test-result', passed, detail });
    send({ type: 'done' });
  }
};
