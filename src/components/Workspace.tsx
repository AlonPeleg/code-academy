import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CodeEditor from './CodeEditor';
import OutputPanel, { type OutputMode } from './OutputPanel';
import { isIframeRunner, isLiveGame, isReplayGame, preloadRunner, runCode, stdoutOf, supportsStdin } from '../runners';
import type { GameTest, LogLine, Probes, ReplayFrame, RunnerConfig, RunSummary, SourceFile, SqlTable } from '../runners/types';
import { settingsStore } from '../lib/settings';
import { useT } from '../lib/i18n';

export interface WorkspaceHandle {
  /** Run the current code and resolve with what it printed / rendered */
  run: (opts?: { headless?: boolean; page?: string }) => Promise<RunSummary>;
}

interface Props {
  /** Unique id for editor models (e.g. the lesson id) */
  scope: string;
  config: RunnerConfig;
  files: SourceFile[];
  onFilesChange: (files: SourceFile[]) => void;
  stdin: string;
  onStdinChange: (v: string) => void;
  seed?: string;
  probes?: Probes;
  /** Scripted check for Python game lessons (used when the lesson is checked) */
  gameTest?: GameTest;
  layout: 'vertical' | 'horizontal';
  /** Re-render the preview automatically while typing (HTML / React) */
  autoRun?: boolean;
  toolbarExtra?: ReactNode;
  banner?: ReactNode;
  onReset?: () => void;
}

const FILE_ICON: Record<string, string> = {
  html: '🟧', css: '🟦', javascript: '🟨', typescript: '🟦', python: '🟩', sql: '🟪', c: '⬜', cpp: '🟦', csharp: '🟪', java: '🟫', go: '🟦', rust: '🟧',
};

const Workspace = forwardRef<WorkspaceHandle, Props>(function Workspace(props, ref) {
  const { scope, config, files, onFilesChange, stdin, onStdinChange, seed, probes, gameTest, layout, autoRun, toolbarExtra, banner, onReset } = props;
  const remote = settingsStore.use().remote;
  const tr = useT();
  const isWeb = isIframeRunner(config.runner);

  const [active, setActive] = useState(files[0]?.name ?? '');
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [tables, setTables] = useState<SqlTable[]>([]);
  const [preview, setPreview] = useState<{ id: number; doc: string } | null>(null);
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);
  const [liveGame, setLiveGame] = useState<{ id: number; file: SourceFile } | null>(null);
  const [replay, setReplay] = useState<{ id: number; frames: ReplayFrame[] } | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runIdRef = useRef(0);
  const logsRef = useRef<LogLine[]>([]);
  const pageRef = useRef<string | undefined>(undefined);
  const runRef = useRef<(opts?: { headless?: boolean; page?: string }) => Promise<RunSummary>>();
  const waiter = useRef<{ id: number; resolve: (s: RunSummary) => void } | null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef({ files, stdin, remote, config, probes, seed, gameTest, active });
  latest.current = { files, stdin, remote, config, probes, seed, gameTest, active };

  useEffect(() => {
    if (!files.some((f) => f.name === active)) setActive(files[0]?.name ?? '');
  }, [files, active]);

  useEffect(() => {
    void preloadRunner(config);
  }, [config]);

  // messages coming back from the preview iframe (console output + "page finished loading")
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const m = e.data;
      if (!m || !m.__ca || m.runId !== runIdRef.current) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (m.type === 'navigate') {
        // a link between the project's own html pages: show that page
        void runRef.current?.({ page: String(m.page) });
      } else if (m.type === 'log') {
        logsRef.current = [...logsRef.current, { level: m.level, text: m.text }];
        setLogs(logsRef.current);
      } else if (m.type === 'done') {
        setRunning(false);
        setStatus('');
        const w = waiter.current;
        if (w && w.id === m.runId) {
          waiter.current = null;
          w.resolve({ ok: !logsRef.current.some((l) => l.level === 'error'), stdout: stdoutOf(logsRef.current), dom: m.dom });
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const onGameLog = useCallback((level: LogLine['level'], text: string) => {
    logsRef.current = [...logsRef.current.slice(-299), { level, text }];
    setLogs(logsRef.current);
  }, []);

  const run = useCallback(async (opts?: { headless?: boolean; page?: string }): Promise<RunSummary> => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    // a newer run replaces any run still waiting for its preview: release the old one
    if (waiter.current) {
      waiter.current.resolve({ ok: false, stdout: '' });
      waiter.current = null;
    }
    const id = ++runIdRef.current;
    const cur = latest.current;
    // web projects with several pages: show the page being edited, or the one that was navigated to
    if (opts?.page) pageRef.current = opts.page;
    else if (!opts?.headless) {
      const activeFile = cur.files.find((f) => f.name === latest.current.active);
      if (activeFile?.language === 'html') pageRef.current = activeFile.name;
    }
    const page = opts?.page ?? pageRef.current;
    const live = isLiveGame(cur.config);

    // Live Python game: it runs inside the output panel (a new id restarts it)
    if (live && !opts?.headless) {
      logsRef.current = [];
      setLogs([]);
      setStatus('');
      setLiveGame({ id, file: cur.files[0] });
      setRunning(false);
      return { ok: true, stdout: '' };
    }

    setRunning(true);
    setStatus('');
    logsRef.current = [];
    setLogs([]);
    setTables([]);
    const out = await runCode(cur.config, cur.files, {
      stdin: cur.stdin, remote: cur.remote, runId: id, probes: cur.probes, seed: cur.seed,
      gameTest: opts?.headless ? cur.gameTest : undefined, page, onStatus: setStatus,
    });
    if (id !== runIdRef.current) return { ok: false, stdout: '' };

    if (out.previewDoc) {
      logsRef.current = out.logs;
      setLogs(out.logs);
      setPreview({ id, doc: out.previewDoc });
      return new Promise<RunSummary>((resolve) => {
        waiter.current = { id, resolve };
        setTimeout(() => {
          if (waiter.current?.id === id) {
            waiter.current = null;
            setRunning(false);
            resolve({ ok: false, stdout: stdoutOf(logsRef.current) });
          }
        }, 6000);
      });
    }
    if (!out.ok && out.logs.length === 0 && !out.gameResult) out.logs.push({ level: 'error', text: 'Something went wrong while running your code.' });
    logsRef.current = out.logs;
    setLogs(out.logs);
    setTables(out.tables ?? []);
    if (out.replay) setReplay({ id, frames: out.replay });
    setRunning(false);
    setStatus('');
    return { ok: out.ok, stdout: out.checkText ?? stdoutOf(out.logs), game: out.gameResult };
  }, []);

  runRef.current = run;
  useImperativeHandle(ref, () => ({ run }), [run]);

  // live preview for HTML / React: run once on mount and again shortly after typing stops
  const firstRun = useRef(true);
  useEffect(() => {
    if (!autoRun) return;
    const t = setTimeout(() => void run(), firstRun.current ? 50 : 700);
    autoTimer.current = t;
    firstRun.current = false;
    return () => clearTimeout(t);
  }, [autoRun, files, run]);

  const current = files.find((f) => f.name === active) ?? files[0];
  const reactMode = config.runner === 'react';

  const editor = (
    <div className="editor-pane">
      <div className="toolbar">
        <div className="filetabs">
          {files.map((f) => (
            <button key={f.name} className={'filetab' + (f.name === current?.name ? ' on' : '')} onClick={() => setActive(f.name)}>
              <span aria-hidden>{FILE_ICON[f.language] ?? '📄'}</span> {f.name}
            </button>
          ))}
        </div>
        <div className="actions">
          {toolbarExtra}
          {onReset && <button className="btn ghost sm" onClick={onReset} title={tr('Reset to the starting code')}>{tr('Reset')}</button>}
          <button className="btn primary sm" onClick={() => void run()} disabled={running} title="Ctrl/Cmd + Enter">
            ▶ {tr('Run')}
          </button>
        </div>
      </div>
      {banner}
      <div className="editor-host">
        {current && (
          <CodeEditor
            path={`${scope}/${current.name}`}
            language={current.language}
            value={current.code}
            reactMode={reactMode}
            onRun={() => void run()}
            onChange={(code) => onFilesChange(files.map((f) => (f.name === current.name ? { ...f, code } : f)))}
          />
        )}
      </div>
    </div>
  );

  const mode: OutputMode = isWeb
    ? 'web'
    : isLiveGame(config)
      ? 'live'
      : isReplayGame(config)
        ? 'replay'
        : config.runner === 'sql'
          ? 'sql'
          : 'text';

  const output = (
    <OutputPanel
      mode={mode}
      hasStdin={supportsStdin(config.runner) && mode !== 'replay'}
      previewDoc={preview}
      iframeRef={iframeRef}
      logs={logs}
      tables={tables}
      status={status}
      running={running}
      stdin={stdin}
      onStdinChange={onStdinChange}
      seed={seed}
      liveGame={liveGame}
      onGameLog={onGameLog}
      onGameStatus={setStatus}
      replay={replay}
    />
  );

  return (
    <PanelGroup direction={layout} className="workspace" autoSaveId={null}>
      <Panel defaultSize={58} minSize={25}>{editor}</Panel>
      <PanelResizeHandle className={'resize ' + layout} />
      <Panel defaultSize={42} minSize={15}>{output}</Panel>
    </PanelGroup>
  );
});

export default Workspace;
