import { useEffect, useState } from 'react';
import type { LogLine, ReplayFrame, SourceFile, SqlTable } from '../runners/types';
import { DEFAULT_SQL_SEED } from '../runners/sql';
import { LiveGame, ReplayPlayer } from './GamePanel';
import { useT } from '../lib/i18n';

export type OutputMode = 'web' | 'text' | 'sql' | 'live' | 'replay';

interface Props {
  mode: OutputMode;
  hasStdin: boolean;
  previewDoc: { id: number; doc: string } | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  logs: LogLine[];
  tables: SqlTable[];
  status: string;
  running: boolean;
  stdin: string;
  onStdinChange: (v: string) => void;
  seed?: string;
  /** Live Python game to run (a new id restarts it) */
  liveGame: { id: number; file: SourceFile } | null;
  onGameLog: (level: LogLine['level'], text: string) => void;
  onGameStatus: (s: string) => void;
  /** Frames recorded by a compiled game */
  replay: { id: number; frames: ReplayFrame[] } | null;
}

type Tab = 'main' | 'console' | 'input' | 'data';

export default function OutputPanel(p: Props) {
  const tr = useT();
  const [tab, setTab] = useState<Tab>('main');
  const errCount = p.logs.filter((l) => l.level === 'error' || l.level === 'stderr').length;
  const hasConsoleTab = p.mode === 'web' || p.mode === 'live' || p.mode === 'replay';

  // jump to the game when a recording arrives, or to the console when something went wrong
  useEffect(() => {
    if (p.mode === 'replay' && p.replay) setTab(p.replay.frames.length ? 'main' : 'console');
  }, [p.replay, p.mode]);

  const mainLabel = tr(p.mode === 'web' ? 'Preview' : p.mode === 'sql' ? 'Result' : p.mode === 'live' || p.mode === 'replay' ? 'Game' : 'Output');
  const active: Tab = !hasConsoleTab && tab === 'console' ? 'main' : tab;

  return (
    <div className="output">
      <div className="output-tabs">
        <button className={active === 'main' ? 'on' : ''} onClick={() => setTab('main')}>{mainLabel}</button>
        {hasConsoleTab && (
          <button className={active === 'console' ? 'on' : ''} onClick={() => setTab('console')}>
            {tr('Console')}{p.logs.length > 0 && <span className={'badge' + (errCount ? ' bad' : '')}>{p.logs.length}</span>}
          </button>
        )}
        {(p.hasStdin || p.mode === 'replay') && (
          <button className={active === 'input' ? 'on' : ''} onClick={() => setTab('input')}>
            {p.mode === 'replay' ? tr('Player input') : tr('Input')}
          </button>
        )}
        {p.mode === 'sql' && <button className={active === 'data' ? 'on' : ''} onClick={() => setTab('data')}>{tr('Sample data')}</button>}
        <span className="output-status">{p.running ? <><span className="spinner" /> {p.status || tr('Running...')}</> : p.status}</span>
      </div>

      <div className="output-body">
        {p.mode === 'web' && (
          <iframe
            ref={p.iframeRef}
            key={p.previewDoc?.id ?? 0}
            title={tr('Preview')}
            className="preview"
            style={{ display: active === 'main' ? 'block' : 'none' }}
            sandbox="allow-scripts allow-modals allow-forms allow-popups"
            srcDoc={p.previewDoc?.doc ?? ''}
          />
        )}

        {p.mode === 'live' && (
          <div style={{ display: active === 'main' ? 'block' : 'none', height: '100%' }}>
            {p.liveGame ? (
              <LiveGame key={p.liveGame.id} file={p.liveGame.file} onLog={p.onGameLog} onStatus={p.onGameStatus} />
            ) : (
              <div className="empty">{tr('Press Run to start your game. Then click it and use the keyboard.')}</div>
            )}
          </div>
        )}

        {p.mode === 'replay' && active === 'main' && (
          p.replay ? <ReplayPlayer frames={p.replay.frames} /> : <div className="empty">{tr('Press Run. Your program draws every frame, then the browser plays it back here.')}</div>
        )}

        {hasConsoleTab && active === 'console' && <Console logs={p.logs} empty={tr('Nothing printed yet.')} />}

        {!hasConsoleTab && active === 'main' && (
          <>
            {p.tables.map((t, i) => <ResultTable key={i} table={t} />)}
            <Console logs={p.logs} empty={p.tables.length ? '' : tr('Press Run (or Ctrl/Cmd + Enter) to see your output here.')} />
          </>
        )}

        {active === 'input' && (
          <div className="stdin">
            <label htmlFor="stdin">
              {p.mode === 'replay'
                ? tr("The player's key presses. One line per event: <frame> <key> <down|up>. Keys: left right up down space a d w s z x enter. Lines starting with # are notes.")
                : tr('Program input (one line per input() / scanf / cin / ReadLine call)')}
            </label>
            <textarea id="stdin" value={p.stdin} onChange={(e) => p.onStdinChange(e.target.value)} spellCheck={false} placeholder={tr('Type the input your program should read...')} />
          </div>
        )}
        {active === 'data' && <pre className="seed">{p.seed ?? DEFAULT_SQL_SEED}</pre>}
      </div>
    </div>
  );
}

function Console({ logs, empty }: { logs: LogLine[]; empty: string }) {
  if (!logs.length) return empty ? <div className="empty">{empty}</div> : null;
  return (
    <div className="console">
      {logs.map((l, i) => (
        <div key={i} className={'line ' + l.level}>
          {l.level === 'image' && <img className="plot" alt={`Plot ${i + 1}`} src={'data:image/png;base64,' + l.text} />}
          {l.level === 'error' && <span className="tag">error</span>}
          {l.level === 'warn' && <span className="tag">warn</span>}
          <span className="txt">{l.text || ' '}</span>
        </div>
      ))}
    </div>
  );
}

function ResultTable({ table }: { table: SqlTable }) {
  return (
    <div className="table-wrap">
      <table className="result">
        <thead>
          <tr>{table.columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => <td key={j} className={v === null ? 'null' : ''}>{v === null ? 'NULL' : String(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rowcount">{table.rows.length} row{table.rows.length === 1 ? '' : 's'}</div>
    </div>
  );
}
