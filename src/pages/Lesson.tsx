import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Workspace, { type WorkspaceHandle } from '../components/Workspace';
import LessonContent from '../components/LessonContent';
import Quiz from '../components/Quiz';
import SetupHelp from '../components/SetupHelp';
import { setupForLesson } from '../content/setup';
import { getLesson, getTrack, neighbours } from '../lib/lessons';
import { buildProbes, evaluateCheck, hasCheck, type CheckResult } from '../lib/check';
import { progressStore, updateLesson } from '../lib/progress';
import { useMedia } from '../lib/useMedia';
import type { Lesson } from '../lib/types';
import type { SourceFile } from '../runners/types';

export default function LessonPage() {
  const { track, slug } = useParams();
  const lesson = getLesson(track ?? '', slug ?? '');
  if (!lesson) {
    return (
      <div className="page">
        <h1>Lesson not found</h1>
        <Link to="/">Back home</Link>
      </div>
    );
  }
  return <LessonView key={lesson.id} lesson={lesson} />;
}

function LessonView({ lesson }: { lesson: Lesson }) {
  const t = getTrack(lesson.trackId);
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

  // keep the learner's code between visits
  useEffect(() => {
    const timer = setTimeout(() => updateLesson(lesson.id, { files: Object.fromEntries(files.map((f) => [f.name, f.code])) }), 600);
    return () => clearTimeout(timer);
  }, [files, lesson.id]);

  const onCheck = async () => {
    if (!ws.current) return;
    setChecking(true);
    const summary = await ws.current.run({ headless: lesson.runner === 'pygame' || lesson.runner === 'jsgame', page: lesson.runner === 'web' ? lesson.check?.page ?? 'index.html' : undefined });
    const res = evaluateCheck(lesson, files, summary);
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
              <strong>Correct, nice work! 🎉</strong>
              {lesson.export && <p className="muted small">That was the last step. Use <strong>Download project</strong> to get the whole thing as a folder with a README, ready for GitHub.</p>}
              <div className="banner-actions">
                {next ? <Link className="btn primary sm" to={`/learn/${next.trackId}/${next.slug}`}>Next lesson →</Link> : <Link className="btn primary sm" to="/">All done - pick another track</Link>}
                <button className="btn ghost sm" onClick={() => setTab('quiz')}>Take the quiz</button>
              </div>
            </>
          ) : (
            <>
              <strong>Not quite yet.</strong>
              <ul>{result.messages.map((m, i) => <li key={i}>{m}</li>)}</ul>
              {result.expected !== undefined && (
                <div className="diff">
                  <div><span className="muted small">Expected</span><pre>{result.expected}</pre></div>
                  <div><span className="muted small">Yours</span><pre>{result.actual || '(nothing printed)'}</pre></div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {hintLevel > 0 && lesson.hints.length > 0 && (
        <div className="banner hint">
          {lesson.hints.slice(0, hintLevel).map((h, i) => (
            <p key={i} className="hint-line"><strong>Hint {i + 1}{lesson.hints.length > 1 ? ` of ${lesson.hints.length}` : ''}:</strong> {h}</p>
          ))}
          {hintLevel >= lesson.hints.length && lesson.solution && (
            <p className="muted small">Still stuck? Press <strong>Solution</strong> to see the full answer, then try to understand each line.</p>
          )}
        </div>
      )}
      {showSolution && lesson.solution && (
        <div className="banner solution">
          <div className="banner-actions">
            <strong>Solution</strong>
            <button className="btn ghost sm" onClick={() => { setFiles(lesson.solution!.map((f) => ({ ...f }))); setShowSolution(false); }}>Load into editor</button>
            <button className="btn ghost sm" onClick={() => setShowSolution(false)}>Hide</button>
          </div>
          {lesson.solution.map((f) => (
            <div key={f.name}>
              {lesson.solution!.length > 1 && <div className="muted small">{f.name}</div>}
              <pre>{f.code}</pre>
            </div>
          ))}
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
          title="Reveal one hint at a time. Click again for a bigger hint."
        >
          💡 {hintLevel === 0 ? 'Hint' : hintLevel >= lesson.hints.length ? 'Hide hints' : `Next hint (${hintLevel}/${lesson.hints.length})`}
        </button>
      )}
      <SetupHelp guides={setupForLesson(lesson.trackId, lesson.slug)} />
      {lesson.solution && <button className="btn ghost sm" onClick={() => setShowSolution((v) => !v)}>Solution</button>}
      {lesson.export && <button className="btn primary sm" onClick={() => void download()} title="Download this project as a folder you can run, publish and show in a portfolio">⬇ Download project</button>}
      {checkable && <button className="btn accent sm" onClick={() => void onCheck()} disabled={checking}>✓ Check answer</button>}
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
        <span className="muted small">{t?.group === 'projects' ? 'Step' : 'Lesson'} {index + 1} of {total}</span>
      </div>
      <div className="tabs">
        <button className={tab === 'lesson' ? 'on' : ''} onClick={() => setTab('lesson')}>Lesson</button>
        <button className={tab === 'quiz' ? 'on' : ''} onClick={() => setTab('quiz')}>
          Quiz{lp?.quiz ? ` (${lp.quiz.best}/${lp.quiz.total})` : ''}
        </button>
      </div>
      <div className="lesson-scroll">
        {tab === 'lesson' ? (
          <>
            <h1>{lesson.title}{lesson.level && <span className={'level ' + lesson.level}>{lesson.level}</span>}</h1>
            <LessonContent body={lesson.body} />
            {!checkable && (
              <button className={'btn sm ' + (lp?.done ? 'ghost' : 'primary')} onClick={() => updateLesson(lesson.id, { done: !lp?.done })}>
                {lp?.done ? '✓ Completed (click to undo)' : 'Mark lesson as complete'}
              </button>
            )}
          </>
        ) : (
          <Quiz key={lesson.id} questions={lesson.quiz} best={lp?.quiz} onScore={(score, tot) => {
            if (!lp?.quiz || score > lp.quiz.best) updateLesson(lesson.id, { quiz: { best: score, total: tot } });
          }} />
        )}
      </div>
      <div className="lesson-nav">
        {prev ? <Link className="btn ghost sm" to={`/learn/${prev.trackId}/${prev.slug}`}>← Previous</Link> : <span />}
        {next ? <Link className="btn ghost sm" to={`/learn/${next.trackId}/${next.slug}`}>Next →</Link> : <span />}
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
