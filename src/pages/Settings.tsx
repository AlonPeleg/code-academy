import { useState } from 'react';
import { DEFAULT_REMOTE, settingsStore } from '../lib/settings';
import { resetAllProgress } from '../lib/progress';
import { runRemote } from '../runners/remote';
import type { LogLine, RemoteSettings } from '../runners/types';

const HELLO_C = '#include <stdio.h>\nint main(void){ printf("Hello from the run server!\\n"); return 0; }';

export default function SettingsPage() {
  const remote = settingsStore.use().remote;
  const [testing, setTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<LogLine[] | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<RemoteSettings>) => settingsStore.set((s) => ({ ...s, remote: { ...s.remote, ...patch } }));

  const test = async () => {
    setTesting(true);
    setTestLogs(null);
    const out = await runRemote([{ name: 'main.c', language: 'c', code: HELLO_C }], { langKey: 'c', stdin: '', remote });
    setTestLogs(out.logs);
    setTesting(false);
  };

  return (
    <div className="page narrow">
      <h1>Settings</h1>

      <section className="panel">
        <h2>Run server for C, C++, C#, Java, Go and Rust</h2>
        <p className="muted">
          HTML, CSS, JavaScript, TypeScript, React, Python and SQL run entirely inside your browser. Compiled languages need a real compiler, so their code is sent to a
          code-execution server. By default this uses the free public Judge0 server, which can be slow or rate-limited. For reliable use, run your own (see the README).
        </p>
        <div className="presets-row">
          <button className="btn ghost sm" onClick={() => update(DEFAULT_REMOTE)}>Public Judge0 (default)</button>
          <button className="btn ghost sm" onClick={() => update({ provider: 'judge0', baseUrl: 'http://localhost:2358' })}>My Judge0 (localhost:2358)</button>
          <button className="btn ghost sm" onClick={() => update({ provider: 'piston', baseUrl: 'http://localhost:2000/api/v2' })}>My Piston (localhost:2000)</button>
        </div>
        <div className="form">
          <label>Server type
            <select value={remote.provider} onChange={(e) => update({ provider: e.target.value as RemoteSettings['provider'] })}>
              <option value="judge0">Judge0</option>
              <option value="piston">Piston</option>
            </select>
          </label>
          <label>Server URL
            <input value={remote.baseUrl} onChange={(e) => update({ baseUrl: e.target.value })} spellCheck={false} />
          </label>
          <label>Extra header name (optional)
            <input value={remote.headerName} placeholder="X-Auth-Token" onChange={(e) => update({ headerName: e.target.value })} spellCheck={false} />
          </label>
          <label>Extra header value (optional)
            <input value={remote.headerValue} type="password" onChange={(e) => update({ headerValue: e.target.value })} spellCheck={false} />
          </label>
        </div>
        <button className="btn primary sm" onClick={() => void test()} disabled={testing}>{testing ? 'Testing...' : 'Test connection'}</button>
        {testLogs && (
          <div className="console" style={{ marginTop: 12 }}>
            {testLogs.map((l, i) => <div key={i} className={'line ' + l.level}><span className="txt">{l.text}</span></div>)}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Your progress</h2>
        <p className="muted">Progress and your code are saved in this browser only.</p>
        {!confirmReset ? (
          <button className="btn ghost sm" onClick={() => setConfirmReset(true)}>Reset all progress...</button>
        ) : (
          <div className="presets-row">
            <span>Delete all progress and saved code?</span>
            <button className="btn danger sm" onClick={() => { resetAllProgress(); setConfirmReset(false); }}>Yes, delete</button>
            <button className="btn ghost sm" onClick={() => setConfirmReset(false)}>Cancel</button>
          </div>
        )}
      </section>
    </div>
  );
}
