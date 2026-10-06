import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Workspace, { type WorkspaceHandle } from '../components/Workspace';
import LessonContent from '../components/LessonContent';
import Quiz from '../components/Quiz';
import SetupHelp from '../components/SetupHelp';
import { setupForLesson } from '../content/setup';
import { getLesson, getTrack, localizeLesson, localizeTrack, neighbours } from '../lib/lessons';
import { useLang, useT } from '../lib/i18n';
import { buildProbes, evaluateCheck, hasCheck, type CheckResult } from '../lib/check';
import { progressStore, updateLesson } from '../lib/progress';
import { useMedia } from '../lib/useMedia';
import type { Lesson } from '../lib/types';
import type { SourceFile } from '../runners/types';

export default function LessonPage() {
  const { track, slug } = useParams();
  const base = getLesson(track ?? '', slug ?? '');
  const lang = useLang();
  const tr = useT();
  if (!base) {
    return (
      <div className="page">
        <h1>{tr('Lesson not found')}</h1>
        <Link to="/">{tr('Back home')}</Link>
      </div>
    );
  }
  return <LessonView key={base.id} lesson={localizeLesson(base, lang)} lang={lang} />;
}

function LessonView({ lesson, lang }: { lesson: Lesson; lang: 'en' | 'he' }) {
  const tr = useT();
  const t = (() => { const x = getTrack(lesson.trackId); return x ? localizeTrack(x, lang) : x; })();
  const progress = progressStore.use();
  const lp = progress.lessons[lesson.id];
  const wide = useMedia('(min-width: 980px)');
  const { prev, next, index, total } = neighbours(lesson);

  const [files, setFiles] = useState<SourceFile[]>(() => lesson.files.map((f) => ({ ...f, code: lp?.files?.[f.name] ?? f.code })));
  const [stdin, setStdin] = useState(lesson.stdin ?? '');
  const [tab, setTab] = useState<'lesson' | 'quiz'>('lesson');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [checking, setChecking] = useState(false);
  const ws = useRef<WorkspaceHandle>(null);
  const checkable = hasCheck(lesson);
  const hasHe = !!getLesson(lesson.trackId, lesson.slug)?.he;

  // keep the learner's code between visits
  useEffect(() => {
    const timer = setTimeout(() => updateLesson(lesson.id, { files: Object.fromEntries(files.map((f) => [f.name, f.code])) }), 600);
    return () => clearTimeout(timer);
  }, [files, lesson.id]);

  const onCheck = async () => {
    if (!ws.current) return;
    setChecking(true);
    const summary = await ws.current.run({ headless: lesson.runner === 'pygame' || lesson.runner === 'jsgame', page: lesson.runner === 'web' ? lesson.check?.page ?? 'index.html' : undefined });
    const res = evaluateCheck(lesson, files, summary, tr);
    setResult(res);
    if (res.passed) updateLesson(lesson.id, { done: true });
    setChecking(false);
  };

  const reset = () => {
    setFiles(lesson.files.map((f) => ({ ...f })));
    setStdin(lesson.stdin ?? '');
    setResult(null);
    updateLesson(lesson.id, { files: undefined });
  };

  const download = async () => {
    if (!lesson.export) return;
    const { downloadProject } = await import('../lib/exporter');
    await downloadProject({ files, spec: lesson.export, title: t?.title ?? lesson.title, description: t?.tagline ?? lesson.summary, stdin: stdin || undefined, seed: lesson.seed });
  };

  const banner = (
    <>
      {result && (
        <div className={'banner ' + (result.passed ? 'ok' : 'bad')}>
          {result.passed ? (
            <>
              <strong>{tr('Correct, nice work! 🎉')}</strong>
              {lesson.export && <p className="muted small">{tr('That was the last step. Use "Download project" to get the whole thing as a folder with a README, ready for GitHub.')}</p>}
              <div className="banner-actions">
                {next ? <Link className="btn primary sm" to={`/learn/${next.trackId}/${next.slug}`}>{tr('Next lesson →')}</Link> : <Link className="btn primary sm" to="/">{tr('All done - pick another track')}</Link>}
                <button className="btn ghost sm" onClick={() => setTab('quiz')}>{tr('Take the quiz')}</button>
              </div>
            </>
          ) : (
            <>
              <strong>{tr('Not quite yet.')}</strong>
              <ul>{result.messages.map((m, i) => <li key={i}>{m}</li>)}</ul>
              {result.expected !== undefined && (
                <div className="diff">
                  <div><span className="muted small">{tr('Expected')}</span><pre>{result.expected}</pre></div>
                  <div><span className="muted small">{tr('Yours')}</span><pre>{result.actual || tr('(nothing printed)')}</pre></div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {hintLevel > 0 && lesson.hints.length > 0 && (
        <div className="banner hint">
          {lesson.hints.slice(0, hintLevel).map((h, i) => (
            <p key={i} className="hint-line"><strong>{lesson.hints.length > 1 ? tr('Hint {n} of {total}:', { n: i + 1, total: lesson.hints.length }) : tr('Hint {n}:', { n: i + 1 })}</strong> {h}</p>
          ))}
          {hintLevel >= lesson.hints.length && lesson.solution && (
            <p className="muted small">{tr('Still stuck? Press "Solution" to see the full answer, then try to understand each line.')}</p>
          )}
        </div>
      )}
    </>
  );

  const extra = (
    <>
      {lesson.hints.length > 0 && (
        <button
          className="btn hintbtn sm"
          onClick={() => setHintLevel((l) => (l >= lesson.hints.length ? 0 : l + 1))}
          title={tr('Reveal one hint at a time. Click again for a bigger hint.')}
        >
          💡 {hintLevel === 0 ? tr('Hint') : hintLevel >= lesson.hints.length ? tr('Hide hints') : tr('Next hint ({n}/{total})', { n: hintLevel, total: lesson.hints.length })}
        </button>
      )}
      <SetupHelp guides={setupForLesson(lesson.trackId, lesson.slug)} />
      {lesson.solution && <button className="btn ghost sm" onClick={() => setShowSolution((v) => !v)} aria-pressed={showSolution}>{tr('Solution')}</button>}
      {lesson.export && <button className="btn primary sm" onClick={() => void download()} title={tr('Download this project as a folder you can run, publish and show in a portfolio')}>⬇ {tr('Download project')}</button>}
      {checkable && <button className="btn accent sm" onClick={() => void onCheck()} disabled={checking}>✓ {tr('Check answer')}</button>}
    </>
  );

  const workspace = (
    <Workspace
      ref={ws}
      scope={lesson.id}
      config={{ runner: lesson.runner, remoteLang: lesson.remoteLang, game: lesson.game }}
      gameTest={lesson.check?.game}
      files={files}
      onFilesChange={(f) => { setFiles(f); setResult(null); }}
      stdin={stdin}
      onStdinChange={setStdin}
      seed={lesson.seed}
      probes={buildProbes(lesson)}
      layout="vertical"
      autoRun={lesson.runner === 'web' || lesson.runner === 'react'}
      toolbarExtra={extra}
      banner={banner}
      onReset={reset}
    />
  );

  const left = (
    <div className="lesson-pane" style={{ ['--accent' as string]: t?.color }}>
      <div className="lesson-top">
        <Link to={`/learn/${lesson.trackId}`} className="back">← {t?.title}</Link>
        <span className="muted small">{t?.group === 'projects' ? tr('Step {n} of {total}', { n: index + 1, total }) : tr('Lesson {n} of {total}', { n: index + 1, total })}</span>
      </div>
      <div className="tabs">
        <button className={tab === 'lesson' ? 'on' : ''} onClick={() => setTab('lesson')}>{tr('Lesson')}</button>
        <button className={tab === 'quiz' ? 'on' : ''} onClick={() => setTab('quiz')}>
          {tr('Quiz')}{lp?.quiz ? ` (${lp.quiz.best}/${lp.quiz.total})` : ''}
        </button>
      </div>
      {lang === 'he' && !hasHe && <p className="banner tr-note">{tr('This lesson is not translated to Hebrew yet, so it is shown in English.')}</p>}
      <div className="lesson-scroll">
        {tab === 'lesson' ? (
          <>
            <h1>{lesson.title}{lesson.level && <span className={'level ' + lesson.level}>{tr(lesson.level)}</span>}</h1>
            <LessonContent body={lesson.body} />
            {!checkable && (
              <button className={'btn sm ' + (lp?.done ? 'ghost' : 'primary')} onClick={() => updateLesson(lesson.id, { done: !lp?.done })}>
                {lp?.done ? tr('✓ Completed (click to undo)') : tr('Mark lesson as complete')}
              </button>
            )}
          </>
        ) : (
          <Quiz key={lesson.id} questions={lesson.quiz} best={lp?.quiz} onScore={(score, tot) => {
            if (!lp?.quiz || score > lp.quiz.best) updateLesson(lesson.id, { quiz: { best: score, total: tot } });
          }} />
        )}
      </div>
      {showSolution && lesson.solution && (
        <div className="solution-overlay" role="region" aria-label={tr('Solution')}>
          <div className="solution-head">
            <strong>{tr('Solution')}</strong>
            <span className="grow" />
            <button className="btn ghost sm" onClick={() => { setFiles(lesson.solution!.map((f) => ({ ...f }))); setShowSolution(false); setResult(null); }}>{tr('Load into editor')}</button>
            <button className="btn ghost sm" onClick={() => setShowSolution(false)}>{tr('Hide')}</button>
          </div>
          <div className="solution-body">
            <p className="muted small">{tr('Try to understand every line before you copy it.')}</p>
            {lesson.solution.map((f) => (
              <div key={f.name} className="solution-file">
                <div className="muted small solution-name">{f.name}</div>
                <LessonContent body={'```' + (f.language === 'plaintext' ? '' : f.language) + '\n' + f.code + '\n```'} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="lesson-nav">
        {prev ? <Link className="btn ghost sm" to={`/learn/${prev.trackId}/${prev.slug}`}>{tr('← Previous')}</Link> : <span />}
        {next ? <Link className="btn ghost sm" to={`/learn/${next.trackId}/${next.slug}`}>{tr('Next →')}</Link> : <span />}
      </div>
    </div>
  );

  if (!wide) {
    return (
      <div className="lesson-stacked">
        {left}
        <div className="workspace-stack">{workspace}</div>
      </div>
    );
  }
  return (
    <PanelGroup direction="horizontal" className="lesson-split" autoSaveId={null}>
      <Panel defaultSize={38} minSize={22}>{left}</Panel>
      <PanelResizeHandle className="resize horizontal" />
      <Panel defaultSize={62} minSize={30}>{workspace}</Panel>
    </PanelGroup>
  );
}
