import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SetupGuide } from '../content/setup';
import { localizeGuide } from '../content/setup.he';
import { useLang, useT } from '../lib/i18n';

/** One guide: what you need, how to, recommended VS Code extensions. Used by the popover and the track page. */
export function GuideView({ guide: g, showTitle = true }: { guide: SetupGuide; showTitle?: boolean }) {
  const tr = useT();
  return (
    <section className="setup-guide">
      {showTitle && <h4>{g.title}</h4>}
      <p className="small"><strong>{tr('You need:')}</strong></p>
      <ul>{g.needs.map((n, i) => <li key={i}>{n}</li>)}</ul>
      <p className="small"><strong>{tr('How to:')}</strong></p>
      <ol>
        {g.steps.map((s, i) => (
          <li key={i}>
            {s.text}
            {s.code && <pre><code>{s.code}</code></pre>}
          </li>
        ))}
      </ol>
      {g.extensions && g.extensions.length > 0 && (
        <>
          <p className="small"><strong>{tr('Recommended VS Code extensions:')}</strong></p>
          <ul>
            {g.extensions.map((x) => (
              <li key={x.id}><strong>{x.name}</strong> <code className="ext-id">{x.id}</code> - {x.why}</li>
            ))}
          </ul>
          <p className="muted small">{tr('Install them all at once from a terminal:')}</p>
          <pre><code>{g.extensions.map((x) => `code --install-extension ${x.id}`).join('\n')}</code></pre>
        </>
      )}
      {g.note && <p className="muted small">{g.note}</p>}
      {g.link && <p className="small"><a href={g.link.url} target="_blank" rel="noreferrer">{g.link.label} ↗</a></p>}
    </section>
  );
}

/** A "Setup" button. Hover shows a one-line tooltip, click opens the full "what you need and how" panel. */
export default function SetupHelp({ guides: rawGuides, label, align = 'right' }: { guides: SetupGuide[]; label?: string; align?: 'left' | 'right' }) {
  const tr = useT();
  const lang = useLang();
  const guides = rawGuides.map((g) => localizeGuide(g, lang));
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; maxH: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    const width = Math.min(460, window.innerWidth - 24);
    let left = align === 'right' ? r.right - width : r.left;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
    setPos({ top: r.bottom + 6, left, maxH: Math.max(200, window.innerHeight - r.bottom - 24) });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    const onResize = () => setOpen(false);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onDown); window.removeEventListener('resize', onResize); };
  }, [open]);

  if (!guides.length) return null;
  const tip = guides.map((g) => g.summary).join('  |  ');
  label = label ?? tr('Setup');

  return (
    <>
      <button ref={btn} className="btn ghost sm" title={tip + '  ' + tr('(click for how-to)')} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((v) => !v)}>
        🛠 {label}
      </button>
      {open && pos && (
        <div ref={panel} className="setup-pop" role="dialog" aria-label={tr('Requirements and how-to')} style={{ top: pos.top, left: pos.left, maxHeight: pos.maxH }}>
          <div className="setup-head">
            <strong>{tr('What you need on your own computer')}</strong>
            <button className="btn ghost sm" onClick={() => setOpen(false)} aria-label={tr('Close')}>✕</button>
          </div>
          <p className="muted small">{tr('Inside Code Academy you do not have to install anything. These notes are for running the same code on your machine.')}</p>
          {guides.map((g) => <GuideView key={g.id} guide={g} />)}
        </div>
      )}
    </>
  );
}
