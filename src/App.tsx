import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import TrackPage from './pages/Track';

// The editor is big, so it only loads when a lesson or the sandbox is opened.
const LessonPage = lazy(() => import('./pages/Lesson'));
const SandboxPage = lazy(() => import('./pages/Sandbox'));
const SettingsPage = lazy(() => import('./pages/Settings'));

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Suspense fallback={<div className="page-loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn/:track" element={<TrackPage />} />
            <Route path="/learn/:track/:slug" element={<LessonPage />} />
            <Route path="/sandbox" element={<SandboxPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<div className="page"><h1>Page not found</h1></div>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
