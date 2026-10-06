export type RunnerId = 'web' | 'js' | 'ts' | 'react' | 'python' | 'pygame' | 'jsgame' | 'sql' | 'git' | 'remote';

export interface SourceFile {
  name: string;
  /** Monaco language id (html, css, javascript, typescript, python, sql, c, cpp, csharp ...) */
  language: string;
  code: string;
}

export type LogLevel = 'stdout' | 'stderr' | 'log' | 'info' | 'warn' | 'error' | 'system' | 'image';

export interface LogLine {
  level: LogLevel;
  text: string;
}

export interface SqlTable {
  columns: string[];
  rows: (string | number | null)[][];
}

/** What the page being previewed reported back (used by lesson checks). */
export interface DomReport {
  text: string;
  selectors: Record<string, number>;
  styles: Record<string, string>;
}

export interface Probes {
  selectors?: string[];
  styles?: { selector: string; property: string }[];
}

/** One drawing command of a recorded frame: [command, ...numbers] or ['T', x, y, size, r, g, b, text] */
export type ReplayCmd = (string | number)[];
export interface ReplayFrame {
  cmds: ReplayCmd[];
}

/** A scripted check for game lessons: run N frames with simulated keys, then evaluate a Python expression. */
export interface GameTest {
  frames: number;
  /** Keys held during a frame range (inclusive start, exclusive end) */
  keys?: { key: string; from: number; to: number }[];
  /** Python expression evaluated in the learner's program namespace after the frames ran */
  expect: string;
}

export interface RunOutput {
  logs: LogLine[];
  /** Recorded frames from a compiled game program (C / C++ / C#) */
  replay?: ReplayFrame[];
  tables?: SqlTable[];
  /** HTML document for the preview iframe (web + react runners) */
  previewDoc?: string;
  /** Text used for output checks when it differs from the logs (SQL) */
  checkText?: string;
  ok: boolean;
  durationMs?: number;
  /** Set when a scripted game test ran (python game lessons) */
  gameResult?: { passed: boolean; detail: string };
}

export interface RemoteSettings {
  provider: 'judge0' | 'piston';
  baseUrl: string;
  headerName: string;
  headerValue: string;
}

export interface RunContext {
  stdin: string;
  remote: RemoteSettings;
  runId: number;
  probes?: Probes;
  gameTest?: GameTest;
  /** web runner: which html page of the project to show (default index.html) */
  page?: string;
  onStatus?: (status: string) => void;
}

/** The result handed back to lessons after a run. */
export interface RunSummary {
  ok: boolean;
  stdout: string;
  dom?: DomReport;
  /** Result of a scripted game test (python game lessons) */
  game?: { passed: boolean; detail?: string };
}

export interface RunnerConfig {
  runner: RunnerId;
  /** Compiled game program: stdout carries drawing commands that the browser replays */
  game?: boolean;
  /** For the remote runner: which language (c, cpp, csharp, java, go, rust ...) */
  remoteLang?: string;
}

export function stdoutOf(logs: LogLine[]): string {
  return logs
    .filter((l) => l.level === 'stdout' || l.level === 'log' || l.level === 'info')
    .map((l) => l.text)
    .join('\n');
}
