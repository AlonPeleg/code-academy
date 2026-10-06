import { useT } from '../lib/i18n';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LogLine, ReplayFrame, SourceFile } from '../runners/types';
import type { GameHandle } from '../runners/python';

const W = 320;
const H = 240;

const css = (r: unknown, g: unknown, b: unknown) => `rgb(${Number(r) | 0},${Number(g) | 0},${Number(b) | 0})`;

/* ------------------------------------------------------------------ replay (C / C++ / C#) */

function drawCommands(ctx: CanvasRenderingContext2D, frame: ReplayFrame) {
  for (const c of frame.cmds) {
    switch (c[0]) {
      case 'C':
        ctx.fillStyle = css(c[1], c[2], c[3]);
        ctx.fillRect(0, 0, W, H);
        break;
      case 'R':
        ctx.fillStyle = css(c[5], c[6], c[7]);
        ctx.fillRect(Number(c[1]), Number(c[2]), Number(c[3]), Number(c[4]));
        break;
      case 'O':
        ctx.fillStyle = css(c[4], c[5], c[6]);
        ctx.beginPath();
        ctx.arc(Number(c[1]), Number(c[2]), Math.max(0, Number(c[3])), 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'L':
        ctx.strokeStyle = css(c[5], c[6], c[7]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Number(c[1]), Number(c[2]));
        ctx.lineTo(Number(c[3]), Number(c[4]));
        ctx.stroke();
        break;
      case 'T':
        ctx.fillStyle = css(c[4], c[5], c[6]);
        ctx.font = `${Number(c[3]) || 12}px ui-monospace, Menlo, Consolas, monospace`;
        ctx.textBaseline = 'top';
        ctx.fillText(String(c[7] ?? ''), Number(c[1]), Number(c[2]));
        break;
    }
  }
}

/** Plays back the frames a compiled program drew. Frames can be scrubbed like a video. */
export function ReplayPlayer({ frames }: { frames: ReplayFrame[] }) {
  const tr = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setFrame(0);
    setPlaying(true);
  }, [frames]);

  useEffect(() => {
    if (!playing || frames.length < 2) return;
    const timer = setInterval(() => {
      setFrame((f) => {
        if (f + 1 >= frames.length) {
          setPlaying(false);
          return f;
        }
        return f + 1;
      });
    }, 1000 / (30 * speed));
    return () => clearInterval(timer);
  }, [playing, speed, frames]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !frames.length) return;
    // Frames build on each other unless the program clears the screen, so start from the latest clear.
    let start = Math.min(frame, frames.length - 1);
    while (start > 0 && !frames[start].cmds.some((c) => c[0] === 'C')) start--;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    for (let i = start; i <= frame && i < frames.length; i++) drawCommands(ctx, frames[i]);
  }, [frame, frames]);

  if (!frames.length) return <div className="empty">{tr('Run your program to record and play the game.')}</div>;

  return (
    <div className="game-wrap">
      <canvas ref={canvasRef} width={W} height={H} className="game-canvas" />
      <div className="game-controls">
        <button className="btn ghost sm" onClick={() => { setFrame(0); setPlaying(true); }} title={tr('Replay from the start')}>⟲</button>
        <button className="btn ghost sm" onClick={() => setPlaying((p) => (frame + 1 >= frames.length ? (setFrame(0), true) : !p))}>
          {playing ? '⏸ ' + tr('Pause') : '▶ ' + tr('Play')}
        </button>
        <input
          type="range" min={0} max={frames.length - 1} value={frame}
          onChange={(e) => { setPlaying(false); setFrame(Number(e.target.value)); }}
          aria-label={tr('Frame')}
        />
        <span className="muted small frame-count">{tr('frame')} {frame}/{frames.length - 1}</span>
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label={tr('Speed')}>
          <option value={0.25}>0.25x</option>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ live game (Python) */

function normalizeKey(e: KeyboardEvent | React.KeyboardEvent): string | null {
  const k = e.key;
  if (k.startsWith('Arrow')) return k.slice(5).toLowerCase();
  if (k === ' ') return 'space';
  if (k === 'Enter') return 'enter';
  if (k === 'Escape') return 'escape';
  if (k.length === 1) return k.toLowerCase();
  return null;
}

interface LiveProps {
  file: SourceFile;
  onLog: (level: LogLine['level'], text: string) => void;
  onStatus: (s: string) => void;
}

/** Runs a Python game on a canvas and forwards the keyboard and mouse to it. Remount (new key) to restart. */
export function LiveGame({ file, onLog, onStatus }: LiveProps) {
  const tr = useT();
  const wrapRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GameHandle | null>(null);
  const [state, setState] = useState<'starting' | 'running' | 'stopped' | 'frozen'>('starting');
  const [focused, setFocused] = useState(false);
  const logRef = useRef(onLog);
  logRef.current = onLog;
  const statusRef = useRef(onStatus);
  statusRef.current = onStatus;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // a fresh canvas for every start: a canvas can only be handed to the worker once
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.className = 'game-canvas';
    wrap.prepend(canvas);
    let cancelled = false;

    let offscreen: OffscreenCanvas;
    try {
      offscreen = canvas.transferControlToOffscreen();
    } catch {
      logRef.current('error', 'This browser cannot run Python games (OffscreenCanvas is missing). Try a recent Chrome, Edge, Firefox or Safari.');
      setState('stopped');
      return () => canvas.remove();
    }

    const toGame = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: Math.round(((e.clientX - r.left) * W) / r.width), y: Math.round(((e.clientY - r.top) * H) / r.height) };
    };
    const onMove = (e: MouseEvent) => handleRef.current?.mouse(toGame(e).x, toGame(e).y, e.buttons > 0);
    const onDown = (e: MouseEvent) => { wrap.focus(); handleRef.current?.mouse(toGame(e).x, toGame(e).y, true); };
    const onUp = (e: MouseEvent) => handleRef.current?.mouse(toGame(e).x, toGame(e).y, false);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const isJs = file.language === 'javascript';
    const loader: Promise<{ start: typeof import('../runners/python').startPythonGame }> = isJs
      ? import('../runners/jsGame').then((m) => ({ start: m.startJsGame }))
      : import('../runners/python').then((m) => ({ start: m.startPythonGame }));
    void loader.then(async (py) => {
      const handle = await py.start(
        file,
        offscreen,
        {
          onLog: (level, text) => logRef.current(level, text),
          onStarted: (hasLoop) => {
            if (cancelled) return;
            setState(hasLoop ? 'running' : 'stopped');
            if (!hasLoop) logRef.current('system', 'Your program finished. To animate, call game.run(update, draw) at the end.');
          },
          onFrozen: () => {
            if (cancelled) return;
            setState('frozen');
            logRef.current('error', 'Your game stopped responding for 3 seconds. Is there an infinite loop (a while loop that never ends) in update or draw?');
          },
        },
        (s) => statusRef.current(s),
        () => cancelled,
      );
      if (cancelled) {
        handle?.stop();
        return;
      }
      handleRef.current = handle;
      wrap.focus();
    });

    return () => {
      cancelled = true;
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      handleRef.current?.stop();
      handleRef.current = null;
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyHandler = useCallback((kind: 'keydown' | 'keyup') => (e: React.KeyboardEvent) => {
    const k = normalizeKey(e);
    if (!k) return;
    if (['left', 'right', 'up', 'down', 'space'].includes(k)) e.preventDefault(); // don't scroll the page
    if (kind === 'keydown' && e.repeat) return;
    handleRef.current?.key(kind, k);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={'game-wrap live' + (focused ? ' focused' : '')}
      tabIndex={0}
      onKeyDown={keyHandler('keydown')}
      onKeyUp={keyHandler('keyup')}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); handleRef.current?.blur(); }}
    >
      <div className="game-controls">
        <span className="muted small">
          {state === 'starting' && tr('Starting...')}
          {state === 'running' && (focused ? tr('Playing - keyboard is captured') : tr('Click the game to use the keyboard'))}
          {state === 'stopped' && tr('Stopped')}
          {state === 'frozen' && tr('Frozen - press Run to restart')}
        </span>
        {state === 'running' && (
          <button
            className="btn ghost sm"
            onClick={() => { handleRef.current?.stop(); setState('stopped'); }}
          >
            ■ {tr('Stop')}
          </button>
        )}
      </div>
    </div>
  );
}
