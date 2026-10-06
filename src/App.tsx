import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import TrackPage from './pages/Track';
import { isRtl, useLang, useT } from './lib/i18n';

// The editor is big, so it only loads when a lesson or the sandbox is opened.
const LessonPage = lazy(() => import('./pages/Lesson'));
const SandboxPage = lazy(() => import('./pages/Sandbox'));
const SettingsPage = lazy(() => import('./pages/Settings'));

export default function App() {
  const lang = useLang();
  const tr = useT();
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr';
  }, [lang]);
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Suspense fallback={<div className="page-loading">{tr('Loading...')}</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn/:track" element={<TrackPage />} />
            <Route path="/learn/:track/:slug" element={<LessonPage />} />
            <Route path="/sandbox" element={<SandboxPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<div className="page"><h1>{tr('Page not found')}</h1></div>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
