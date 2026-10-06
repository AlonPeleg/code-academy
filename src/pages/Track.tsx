import { GuideView } from '../components/SetupHelp';
import { setupForTrack } from '../content/setup';
import { Link, useParams } from 'react-router-dom';
import { getTrack, lessonsOf } from '../lib/lessons';
import { progressStore } from '../lib/progress';

export default function TrackPage() {
  const { track } = useParams();
  const t = getTrack(track ?? '');
  const progress = progressStore.use();
  if (!t) return <div className="page"><h1>Track not found</h1><Link to="/">Back home</Link></div>;
  const lessons = lessonsOf(t.id);
  const next = lessons.find((l) => !progress.lessons[l.id]?.done) ?? lessons[0];

  return (
    <div className="page narrow" style={{ ['--accent' as string]: t.color }}>
      <Link to="/" className="back">← All tracks</Link>
      <div className="track-head">
        <div className="track-icon big">{t.icon}</div>
        <div>
          <h1>{t.title}</h1>
          <p className="muted">{t.tagline}</p>
        </div>
      </div>
      {t.intro && <div className="track-intro">{t.intro.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}</div>}
      {setupForTrack(t.id).length > 0 && (
        <section className="track-setup" aria-label="Setup on your computer">
          <h2>Before you start: set up your computer</h2>
          <p className="muted small">Inside Code Academy you do not have to install anything, every lesson runs in the page. When you want to run the same code on your own machine, this is what you need. Open a card for the full steps.</p>
          {setupForTrack(t.id).map((g) => (
            <details key={g.id} className="setup-card" open={false}>
              <summary><strong>{g.title}</strong><span className="muted small">{g.summary}</span></summary>
              <GuideView guide={g} showTitle={false} />
            </details>
          ))}
        </section>
      )}
      <div className="hero-actions">
        {next && <Link className="btn primary" to={`/learn/${t.id}/${next.slug}`}>{lessons.some((l) => progress.lessons[l.id]?.done) ? 'Continue' : 'Start'}</Link>}
        <Link className="btn ghost" to={`/sandbox?lang=${t.sandbox}`}>Practice in the sandbox</Link>
      </div>
      <ol className="lesson-list">
        {lessons.map((l, i) => {
          const p = progress.lessons[l.id];
          return (
            <li key={l.id}>
              <Link to={`/learn/${t.id}/${l.slug}`} className="lesson-row">
                <span className={'check' + (p?.done ? ' done' : '')}>{p?.done ? '✓' : i + 1}</span>
                <span className="lesson-info">
                  <strong>{l.title}{l.level && <span className={'level ' + l.level}>{l.level}</span>}</strong>
                  <span className="muted">{l.summary}</span>
                </span>
                {p?.quiz && <span className="pill">Quiz {p.quiz.best}/{p.quiz.total}</span>}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
