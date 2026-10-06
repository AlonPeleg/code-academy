import type { RunContext, RunnerConfig, RunOutput, SourceFile } from './types';

export * from './types';

/** Single entry point: pick the right engine for a workspace and run the files. Engines load lazily. */
export async function runCode(cfg: RunnerConfig, files: SourceFile[], ctx: RunContext & { seed?: string }): Promise<RunOutput> {
  switch (cfg.runner) {
    case 'web':
      return (await import('./webDoc')).runWeb(files, ctx);
    case 'react':
      return (await import('./reactDoc')).runReact(files, ctx);
    case 'js':
    case 'ts':
      return (await import('./jsWorker')).runScript(files, cfg.runner);
    case 'python':
      return (await import('./python')).runPython(files, ctx);
    case 'pygame': {
      // The live game runs inside the output panel; here we only handle the scripted (headless) check.
      if (!ctx.gameTest) return { ok: true, logs: [] };
      const r = await (await import('./python')).testPythonGame(files, ctx.gameTest, ctx.onStatus);
      return { ...r.output, ok: r.output.ok, gameResult: { passed: r.passed, detail: r.detail } };
    }
    case 'jsgame': {
      if (!ctx.gameTest) return { ok: true, logs: [] };
      const r = await (await import('./jsGame')).testJsGame(files, ctx.gameTest, ctx.onStatus);
      return { ...r.output, ok: r.output.ok, gameResult: { passed: r.passed, detail: r.detail } };
    }
    case 'sql':
      return (await import('./sql')).runSql(files, ctx);
    case 'remote':
      return (await import('./remote')).runRemote(files, { ...ctx, langKey: cfg.remoteLang ?? 'c', game: cfg.game });
  }
}

export async function preloadRunner(cfg: RunnerConfig) {
  if (cfg.runner === 'python' || cfg.runner === 'pygame') (await import('./python')).preloadPython();
}

export const isIframeRunner = (r: RunnerConfig['runner']) => r === 'web' || r === 'react';
export const supportsStdin = (r: RunnerConfig['runner']) => r === 'python' || r === 'remote';
/** Live, real-time game (Python) */
export const isLiveGame = (cfg: RunnerConfig) => cfg.runner === 'pygame' || cfg.runner === 'jsgame';
/** Compiled game whose frames are recorded then replayed */
export const isReplayGame = (cfg: RunnerConfig) => cfg.runner === 'remote' && !!cfg.game;
