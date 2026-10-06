import { runGitScript } from './gitSim';
import type { RunOutput, SourceFile } from './types';

/** The Git practice terminal: runs the script in the editor against a pretend repository (no real Git, nothing leaves the page). */
export async function runGit(files: SourceFile[]): Promise<RunOutput> {
  const script = files.find((f) => /\.(sh|txt)$/i.test(f.name))?.code ?? files[0]?.code ?? '';
  const { lines } = runGitScript(script);
  return { ok: true, logs: lines.map((text) => ({ level: 'log', text })) };
}
