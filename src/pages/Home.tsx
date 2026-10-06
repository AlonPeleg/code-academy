import { Link } from 'react-router-dom';
import { lessonsOf, localizeTrack, tracks } from '../lib/lessons';
import { useLang, useT } from '../lib/i18n';
import { progressStore } from '../lib/progress';

const TITLES = {
  learn: 'Choose a track',
  data: 'Data, AI and APIs',
  projects: 'Guided projects',
  games: 'Make games',
} as const;

const NOTES: Record<string, string> = {
  data: 'Machine learning with NumPy, pandas and scikit-learn, web APIs (REST and SOAP) against a practice server, and algorithms.',
  projects: 'Build something real, one small step at a time. Every step has hints, and each one builds on the last.',
  games: 'A tiny built-in engine draws the screen for you. Python and JavaScript games run live with your keyboard; C, C++ and C# games are compiled on a server, so the browser plays back the frames your program draws.',
};

export default function Home() {
  const progress = progressStore.use();
  const tr = useT();
  const lang = useLang();
  return (
    <div className="page">
      <section className="hero">
        <h1>{tr('Learn to code by')} <span className="grad">{tr('actually coding')}</span>.</h1>
        <p>{tr('Short lessons, quick quizzes and a sandbox for every language. Nothing to install. Your progress stays in your browser.')}</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/learn/html-css">{tr('Start with HTML & CSS')}</Link>
          <Link className="btn ghost" to="/sandbox">{tr('Open the sandbox')}</Link>
        </div>
      </section>

      {(['learn', 'data', 'projects', 'games'] as const).map((group) => (
        <section key={group}>
          <h2 className="section-title">{tr(TITLES[group])}</h2>
          {NOTES[group] && <p className="muted games-note">{tr(NOTES[group])}</p>}
          <div className="grid">
            {tracks.filter((t) => (t.group ?? 'learn') === group).map((track) => {
              const t = localizeTrack(track, lang);
              const lessons = lessonsOf(t.id);
              const done = lessons.filter((l) => progress.lessons[l.id]?.done).length;
              const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
              return (
                <Link key={t.id} to={`/learn/${t.id}`} className="card track-card" style={{ ['--accent' as string]: t.color }}>
                  <div className="track-icon">{t.icon}</div>
                  <h3>{t.title}</h3>
                  <p>{t.tagline}</p>
                  <div className="progress"><div style={{ width: pct + '%' }} /></div>
                  <div className="meta">{done}/{lessons.length} {group === 'projects' ? tr('steps') : tr('lessons')}</div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
