import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Workspace from '../components/Workspace';
import SetupHelp from '../components/SetupHelp';
import { setupForPreset } from '../content/setup';
import { PRESETS, getPreset, type Preset } from '../sandbox/presets';
import { progressStore, updateSandbox } from '../lib/progress';
import { useMedia } from '../lib/useMedia';
import type { SourceFile } from '../runners/types';

const GROUPS: Preset['group'][] = ['Web', 'Scripting', 'Data', 'Compiled', 'Games'];

export default function SandboxPage() {
  const [params, setParams] = useSearchParams();
  const preset = getPreset(params.get('lang') ?? 'web') ?? PRESETS[0];

  return (
    <div className="sandbox">
      <div className="sandbox-bar">
        <strong>Sandbox</strong>
        <div className="preset-groups">
          {GROUPS.map((g) => (
            <div key={g} className="preset-group">
              <span className="muted small">{g}</span>
              <div className="chips">
                {PRESETS.filter((p) => p.group === g).map((p) => (
                  <button key={p.id} className={'chip' + (p.id === preset.id ? ' on' : '')} onClick={() => setParams({ lang: p.id })}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sandbox-body">
        <SandboxView key={preset.id} preset={preset} />
      </div>
    </div>
  );
}

function SandboxView({ preset }: { preset: Preset }) {
  const saved = progressStore.get().sandbox[preset.id];
  const wide = useMedia('(min-width: 980px)');
  const [files, setFiles] = useState<SourceFile[]>(() => preset.files.map((f) => ({ ...f, code: saved?.[f.name] ?? f.code })));
  const [stdin, setStdin] = useState(preset.stdin ?? '');

  useEffect(() => {
    const t = setTimeout(() => updateSandbox(preset.id, Object.fromEntries(files.map((f) => [f.name, f.code]))), 600);
    return () => clearTimeout(t);
  }, [files, preset.id]);

  return (
    <Workspace
      scope={'sandbox/' + preset.id}
      config={preset.config}
      files={files}
      onFilesChange={setFiles}
      stdin={stdin}
      onStdinChange={setStdin}
      layout={wide ? 'horizontal' : 'vertical'}
      toolbarExtra={
        <>
        <SetupHelp guides={setupForPreset(preset.id)} />
        <button
          className="btn ghost sm"
          title="Download these files as a zip"
          onClick={async () => {
            const { downloadProject } = await import('../lib/exporter');
            await downloadProject({ files, spec: { kind: 'plain', name: 'my-' + preset.id + '-code' }, title: preset.label, description: '', stdin: stdin || undefined });
          }}
        >
          ⬇ Download
        </button>
        </>
      }
      autoRun={preset.config.runner === 'web' || preset.config.runner === 'react'}
      onReset={() => { setFiles(preset.files.map((f) => ({ ...f }))); setStdin(preset.stdin ?? ''); updateSandbox(preset.id, {}); }}
    />
  );
}
