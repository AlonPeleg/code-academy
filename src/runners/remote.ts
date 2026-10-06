import type { LogLine, RemoteSettings, RunOutput, SourceFile } from './types';
import { mergeEngine, parseReplay } from './engines';

export interface RemoteLang {
  label: string;
  fileName: string;
  /** Fallback Judge0 language id (used if the server's language list can't be read) */
  judge0Id: number;
  /** Regex used to find the newest matching language on the Judge0 server */
  judge0Match: RegExp;
  pistonName: string;
}

/** Languages that need a real compiler, so they run on a code-execution server (Judge0 or Piston). */
export const REMOTE_LANGS: Record<string, RemoteLang> = {
  c: { label: 'C', fileName: 'main.c', judge0Id: 50, judge0Match: /^C \(GCC/i, pistonName: 'c' },
  cpp: { label: 'C++', fileName: 'main.cpp', judge0Id: 54, judge0Match: /^C\+\+ \(GCC/i, pistonName: 'c++' },
  csharp: { label: 'C#', fileName: 'Program.cs', judge0Id: 51, judge0Match: /^C# /i, pistonName: 'csharp' },
  java: { label: 'Java', fileName: 'Main.java', judge0Id: 62, judge0Match: /^Java \(OpenJDK/i, pistonName: 'java' },
  go: { label: 'Go', fileName: 'main.go', judge0Id: 60, judge0Match: /^Go \(/i, pistonName: 'go' },
  rust: { label: 'Rust', fileName: 'main.rs', judge0Id: 73, judge0Match: /^Rust \(/i, pistonName: 'rust' },
};

const b64encode = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
};
const b64decode = (s: string | null | undefined) => {
  if (!s) return '';
  const bin = atob(s.replace(/\s/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const trimBase = (u: string) => u.replace(/\/+$/, '');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function headers(s: RemoteSettings): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (s.headerName.trim() && s.headerValue.trim()) h[s.headerName.trim()] = s.headerValue.trim();
  return h;
}

function pushText(logs: LogLine[], level: LogLine['level'], text: string) {
  if (!text) return;
  text.replace(/\n$/, '').split('\n').forEach((line) => logs.push({ level, text: line }));
}

const languageCache = new Map<string, { id: number; name: string }[]>();

async function pickJudge0Id(s: RemoteSettings, lang: RemoteLang): Promise<number> {
  const base = trimBase(s.baseUrl);
  try {
    let list = languageCache.get(base);
    if (!list) {
      const res = await fetch(`${base}/languages`, { headers: headers(s) });
      if (!res.ok) throw new Error(String(res.status));
      list = (await res.json()) as { id: number; name: string }[];
      languageCache.set(base, list);
    }
    const versionOf = (name: string) => (name.match(/\d+(\.\d+)*/g) ?? ['0'])[0].split('.').map(Number);
    const cmp = (a: number[], b: number[]) => {
      for (let i = 0; i < Math.max(a.length, b.length); i++) if ((a[i] ?? 0) !== (b[i] ?? 0)) return (b[i] ?? 0) - (a[i] ?? 0);
      return 0;
    };
    const matches = list.filter((l) => lang.judge0Match.test(l.name)).sort((x, y) => cmp(versionOf(x.name), versionOf(y.name)));
    if (matches.length) return matches[0].id;
  } catch {
    /* fall through to the default id */
  }
  return lang.judge0Id;
}

async function runJudge0(file: SourceFile, lang: RemoteLang, stdin: string, s: RemoteSettings, onStatus?: (t: string) => void): Promise<LogLine[]> {
  const base = trimBase(s.baseUrl);
  const languageId = await pickJudge0Id(s, lang);
  onStatus?.(`Compiling and running ${lang.label}...`);
  const create = await fetch(`${base}/submissions?base64_encoded=true&wait=false`, {
    method: 'POST',
    headers: headers(s),
    body: JSON.stringify({ language_id: languageId, source_code: b64encode(file.code), stdin: b64encode(stdin) }),
  });
  if (!create.ok) throw new Error(`Server answered ${create.status}: ${(await create.text()).slice(0, 200)}`);
  const { token } = (await create.json()) as { token: string };

  for (let i = 0; i < 40; i++) {
    await sleep(i < 3 ? 500 : 900);
    const res = await fetch(`${base}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,compile_output,message,status,time`, {
      headers: headers(s),
    });
    if (!res.ok) throw new Error(`Server answered ${res.status} while waiting for the result`);
    const r = (await res.json()) as {
      stdout?: string; stderr?: string; compile_output?: string; message?: string;
      status: { id: number; description: string };
    };
    if (r.status.id <= 2) continue;
    const logs: LogLine[] = [];
    pushText(logs, 'stderr', b64decode(r.compile_output));
    pushText(logs, 'stdout', b64decode(r.stdout));
    pushText(logs, 'stderr', b64decode(r.stderr));
    pushText(logs, 'error', b64decode(r.message));
    if (r.status.id !== 3) logs.push({ level: 'error', text: r.status.description });
    return logs;
  }
  throw new Error('Timed out waiting for the server to finish.');
}

async function runPiston(file: SourceFile, lang: RemoteLang, stdin: string, s: RemoteSettings, onStatus?: (t: string) => void): Promise<LogLine[]> {
  const base = trimBase(s.baseUrl);
  onStatus?.(`Compiling and running ${lang.label}...`);
  const res = await fetch(`${base}/execute`, {
    method: 'POST',
    headers: headers(s),
    body: JSON.stringify({ language: lang.pistonName, version: '*', files: [{ name: file.name, content: file.code }], stdin }),
  });
  if (!res.ok) throw new Error(`Server answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const r = (await res.json()) as {
    message?: string;
    compile?: { stdout: string; stderr: string; code: number };
    run?: { stdout: string; stderr: string; code: number };
  };
  const logs: LogLine[] = [];
  if (r.message) logs.push({ level: 'error', text: r.message });
  if (r.compile) {
    pushText(logs, 'stderr', r.compile.stderr || '');
    if (r.compile.code !== 0 && !r.compile.stderr) pushText(logs, 'stderr', r.compile.stdout || '');
    if (r.compile.code !== 0) logs.push({ level: 'error', text: 'Compilation error' });
  }
  if (r.run && !(r.compile && r.compile.code !== 0)) {
    pushText(logs, 'stdout', r.run.stdout || '');
    pushText(logs, 'stderr', r.run.stderr || '');
    if (r.run.code !== 0) logs.push({ level: 'error', text: `Program exited with code ${r.run.code}` });
  }
  return logs;
}

export async function runRemote(
  files: SourceFile[],
  ctx: { langKey: string; stdin: string; remote: RemoteSettings; game?: boolean; onStatus?: (s: string) => void },
): Promise<RunOutput> {
  const lang = REMOTE_LANGS[ctx.langKey];
  if (!lang) return { ok: false, logs: [{ level: 'error', text: `Unknown language: ${ctx.langKey}` }] };
  const start = performance.now();
  ctx.onStatus?.(`Sending your ${lang.label} code to the run server...`);
  try {
    let file = files[0];
    let missingInclude = false;
    if (ctx.game) {
      const merged = mergeEngine(ctx.langKey, file.name, file.code);
      file = { ...file, code: merged.code };
      missingInclude = merged.missingInclude;
    }
    const logs =
      ctx.remote.provider === 'piston'
        ? await runPiston(file, lang, ctx.stdin, ctx.remote, ctx.onStatus)
        : await runJudge0(file, lang, ctx.stdin, ctx.remote, ctx.onStatus);
    if (ctx.game) {
      const { frames, rest } = parseReplay(logs);
      if (missingInclude) rest.unshift({ level: 'system', text: 'Tip: add  #include "engine.h"  at the top of your file to use the game engine.' });
      if (!frames.length && !rest.some((l) => l.level === 'error')) {
        rest.push({ level: 'system', text: 'No frames were drawn. Call engine_running() in a loop and engine_present() at the end of each frame.' });
      }
      return { ok: !rest.some((l) => l.level === 'error'), logs: rest as LogLine[], replay: frames, durationMs: performance.now() - start };
    }
    return { ok: !logs.some((l) => l.level === 'error'), logs, durationMs: performance.now() - start };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      logs: [
        { level: 'error', text: `Could not reach the run server (${ctx.remote.baseUrl}).` },
        { level: 'stderr', text: msg },
        { level: 'system', text: 'Open Settings to check or change the run server. Public servers can be busy, rate-limited, or offline.' },
      ],
    };
  }
}
