---
title: 'Step 5: A useFetch hook with loading and error states'
summary: Extract the loading logic into a reusable custom hook and add Loading and ErrorMessage components with a retry button.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import Layout from './components/Layout';
      import { useRoute, matchRoute } from './router';
      import Home from './pages/Home';
      import About from './pages/About';

      // Demo only: when the preview starts without a route, open this one (the home page).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/';
      if (!window.location.hash) {
        window.location.hash = START_ROUTE;
      }

      // The route table: which page belongs to which path.
      const routes = [
        { path: '/', render: () => <Home /> },
        { path: '/about', render: () => <About /> },
      ];

      // Walk the table and return the page of the first route that matches.
      function findPage(path) {
        for (const route of routes) {
          const params = matchRoute(route.path, path);
          if (params) {
            return route.render(params);
          }
        }
        return null;
      }

      function App() {
        const path = useRoute();
        return <Layout>{findPage(path)}</Layout>;
      }

      export default App;
  - name: router.jsx
    code: |
      import React, { useState, useEffect } from 'react';

      // A tiny hash router. The address bar holds the page: "index.html#/posts/2" means the route "/posts/2".
      // A hash change never reloads the page, so we can swap the content with React.

      // Returns the current hash and re-renders the component whenever it changes.
      function useHash() {
        const [hash, setHash] = useState(window.location.hash);

        useEffect(() => {
          function handleChange() {
            setHash(window.location.hash);
          }
          window.addEventListener('hashchange', handleChange);
          return () => window.removeEventListener('hashchange', handleChange);
        }, []);

        return hash;
      }

      // "#/about" -> "/about". An empty hash means the home page "/".
      export function useRoute() {
        const path = useHash().replace(/^#/, '');
        return path === '' ? '/' : path;
      }

      // Does this path look like the pattern? Returns an object (empty for now) when yes, null when no.
      export function matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        if (patternParts.length !== pathParts.length) {
          return null;
        }
        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i] !== pathParts[i]) {
            return null;
          }
        }
        return {};
      }

      // A link that changes the hash. Extra props (className, aria-current...) are passed on to the <a>.
      export function Link({ to, children, ...rest }) {
        return (
          <a href={'#' + to} {...rest}>
            {children}
          </a>
        );
      }
  - name: pages/About.jsx
    code: |
      import React from 'react';

      function About() {
        return (
          <>
            <h1>About Dev Blog</h1>
            <p className="lede">
              Dev Blog is a small blog about computing history and ideas. It is built as a multi-file React
              project: pages, components, hooks and a router, each in its own file.
            </p>
            <p>
              The posts are loaded from a practice API, so you can swap in your own server later without
              touching the pages.
            </p>
          </>
        );
      }

      export default About;
  - name: pages/Home.jsx
    code: |
      import React, { useState, useEffect } from 'react';
      import PostCard from '../components/PostCard';
      import { getPosts, getUsers } from '../lib/api';
      import { pluralize } from '../lib/format';

      // Step 5: move the loading logic into a reusable hook and two small components.
      //
      // TODO 4 (this file): delete useState, useEffect and the four pieces of state. Write a module-level
      //         async function loadHome() that awaits Promise.all of the two requests and returns
      //         { posts, authors }. In Home call  const { data, loading, error, reload } = useFetch(loadHome, []);
      //         and render <Loading label="Loading posts..." />, <ErrorMessage message={error.message} onRetry={reload} />
      //         and the list (only when data exists). Import everything you use.

      function Home() {
        const [posts, setPosts] = useState([]);
        const [authors, setAuthors] = useState({}); // user id -> user
        const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
        const [error, setError] = useState('');

        useEffect(() => {
          let cancelled = false;

          // Two independent requests: start both at once and wait for both.
          Promise.all([getPosts(), getUsers()])
            .then(([postList, userList]) => {
              if (cancelled) {
                return;
              }
              const byId = {};
              userList.forEach((user) => {
                byId[user.id] = user;
              });
              setPosts(postList);
              setAuthors(byId);
              setStatus('ready');
            })
            .catch((err) => {
              if (!cancelled) {
                setError(err.message);
                setStatus('error');
              }
            });

          // If the page is closed before the answer arrives, ignore the answer.
          return () => {
            cancelled = true;
          };
        }, []);

        return (
          <>
            <h1>Latest posts</h1>
            {status === 'loading' && <p className="loading">Loading posts...</p>}
            {status === 'error' && (
              <div className="error" role="alert">
                <p>Could not load the posts: {error}</p>
              </div>
            )}
            {status === 'ready' && (
              <>
                <p className="count">{pluralize(posts.length, 'post')}</p>
                <div className="post-list">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} author={authors[post.userId]} />
                  ))}
                </div>
              </>
            )}
          </>
        );
      }

      export default Home;
  - name: components/ErrorMessage.jsx
    code: |
      // TODO 3: write the ErrorMessage component here.
      //
      // - function ErrorMessage({ message, onRetry }) returns a div with class "error" and role="alert".
      // - Inside: a paragraph "Something went wrong: " followed by the message.
      // - When onRetry was passed, also show a button (type="button", class "retry") that says Try again
      //   and calls onRetry when clicked.
      // - default export.
  - name: components/Layout.jsx
    code: |
      import React from 'react';
      import { Link } from '../router';

      // The frame around every page: header with navigation, the page itself, and a footer.
      // `children` is whatever the parent puts between <Layout> and </Layout>.
      function Layout({ children }) {
        return (
          <>
            <header className="site-header">
              <div className="container">
                <Link className="brand" to="/">
                  Dev Blog
                </Link>
                <nav className="site-nav" aria-label="Main">
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                </nav>
              </div>
            </header>

            <main className="container content" id="main">
              {children}
            </main>

            <footer className="site-footer">
              <div className="container">
                <p>Dev Blog, built with React. The posts come from the practice API.</p>
              </div>
            </footer>
          </>
        );
      }

      export default Layout;
  - name: components/Loading.jsx
    code: |
      // TODO 2: write the Loading component here.
      //
      // - function Loading({ label = 'Loading...' }) returns a paragraph with class "loading" and
      //   role="status" that shows the label.
      // - default export.
  - name: components/PostCard.jsx
    code: |
      import React from 'react';

      // One post, shown as a card. `author` is optional: when we have it, we show a byline.
      function PostCard({ post, author }) {
        return (
          <article className="post-card">
            <h2 className="post-title">{post.title}</h2>
            {author && <p className="post-meta">By {author.name}</p>}
            <ul className="tags">
              {post.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        );
      }

      export default PostCard;
  - name: hooks/useFetch.js
    code: |
      // TODO 1: write the hook in this file.
      //
      // - import { useState, useEffect } from 'react';
      // - export function useFetch(load, deps = []) where load is an async function that returns the data.
      // - One state object { data, error, loading } (start with loading: true) and one number state "attempt".
      // - A useEffect that: sets the state to loading, calls load(), stores the data (or the error) when it
      //   arrives unless a "cancelled" flag is set, and returns a cleanup function that sets the flag.
      //   Its dependency array is [...deps, attempt].
      // - A reload() function that adds one to attempt (this re-runs the effect).
      // - Return { data, error, loading, reload }.
  - name: lib/api.js
    code: |
      // lib/api.js: every request to the server lives in this one file.
      // Pages and hooks call getPosts() and friends. They never write a URL or look at a status code.

      export const API = 'https://api.academy.test';

      // Fetch JSON from the API. Throws an Error with a readable message when anything goes wrong.
      async function request(path) {
        let res;
        try {
          res = await fetch(API + path);
        } catch (err) {
          // fetch only rejects when the request could not be made at all (offline, server down).
          throw new Error('Could not reach the server. Check your connection.');
        }

        if (!res.ok) {
          // The server answered, but with an error status such as 404 or 500.
          let message = 'The server answered with status ' + res.status + '.';
          try {
            const body = await res.json();
            if (body && body.error) {
              message = body.error;
            }
          } catch (err) {
            // the error body was not JSON: keep the default message
          }
          throw new Error(message);
        }

        return res.json();
      }

      export function getPosts() {
        return request('/posts');
      }

      export function getUsers() {
        return request('/users');
      }
  - name: lib/format.js
    code: |
      // Small helpers for turning data into text. Plain JavaScript, no React in here.

      // pluralize(1, 'post') -> "1 post"      pluralize(6, 'post') -> "6 posts"
      export function pluralize(count, word) {
        return count + ' ' + word + (count === 1 ? '' : 's');
      }
  - name: styles.css
    code: |
      /* Dev Blog: all the styles for the whole project.
         You do not need to write any CSS here, the focus of this project is React. */

      :root {
        --bg: #f6f7f9;
        --card: #ffffff;
        --text: #1f2937;
        --muted: #5b6573;
        --primary: #0e7490;
        --primary-dark: #155e75;
        --border: #d9dde3;
        --danger: #b91c1c;
        --focus: #d97706;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        line-height: 1.55;
      }

      a {
        color: var(--primary);
      }

      a:hover {
        color: var(--primary-dark);
      }

      a:focus-visible,
      button:focus-visible,
      input:focus-visible {
        outline: 3px solid var(--focus);
        outline-offset: 2px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 1.8rem;
        line-height: 1.2;
      }

      h2 {
        margin: 0 0 8px;
        font-size: 1.25rem;
        line-height: 1.3;
      }

      .container {
        max-width: 880px;
        margin: 0 auto;
        padding: 0 16px;
      }

      /* layout: header, main, footer */
      .skip-link {
        position: absolute;
        left: 8px;
        top: -60px;
        z-index: 10;
        padding: 8px 14px;
        border-radius: 6px;
        background: #111827;
        color: #ffffff;
      }

      .skip-link:focus {
        top: 8px;
        color: #ffffff;
      }

      .site-header {
        border-bottom: 1px solid var(--border);
        background: var(--card);
      }

      .site-header .container {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 16px;
        padding-top: 12px;
        padding-bottom: 12px;
      }

      .brand {
        color: var(--text);
        font-size: 1.25rem;
        font-weight: 800;
        text-decoration: none;
      }

      .brand:hover {
        color: var(--primary);
      }

      .site-nav {
        display: flex;
        gap: 4px;
      }

      .site-nav a {
        padding: 6px 12px;
        border-radius: 999px;
        color: var(--text);
        font-weight: 600;
        text-decoration: none;
      }

      .site-nav a:hover {
        background: #e5e7eb;
      }

      .site-nav a[aria-current="page"] {
        background: var(--primary);
        color: #ffffff;
      }

      .content {
        padding-top: 24px;
        padding-bottom: 40px;
        outline: none;
      }

      .site-footer {
        border-top: 1px solid var(--border);
        color: var(--muted);
        font-size: 0.9rem;
      }

      .site-footer .container {
        padding-top: 16px;
        padding-bottom: 24px;
      }

      /* text helpers */
      .count,
      .hint,
      .loading,
      .lede,
      .post-meta,
      .result-count {
        color: var(--muted);
      }

      .lede {
        font-size: 1.05rem;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }

      /* post cards */
      .post-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        margin-top: 12px;
      }

      @media (min-width: 640px) {
        .post-list {
          grid-template-columns: 1fr 1fr;
        }
      }

      .post-card {
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--card);
      }

      .post-title {
        margin: 0 0 4px;
        font-size: 1.15rem;
      }

      .post-title a {
        color: var(--text);
        text-decoration: none;
      }

      .post-title a:hover {
        color: var(--primary);
        text-decoration: underline;
      }

      .post-meta {
        margin: 0 0 8px;
        font-size: 0.9rem;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .tag {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 999px;
        background: #e0f2fe;
        color: #075985;
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;
      }

      a.tag:hover {
        background: #bae6fd;
        color: #075985;
      }

      .tag.active {
        background: var(--primary);
        color: #ffffff;
      }

      /* search and filters */
      .filters {
        margin: 12px 0 4px;
      }

      .search {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font: inherit;
      }

      .filter-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
      }

      /* loading, errors */
      .error {
        padding: 12px 14px;
        border: 1px solid #fecaca;
        border-radius: 10px;
        background: #fef2f2;
        color: var(--danger);
      }

      .error p {
        margin: 0 0 8px;
      }

      .retry {
        padding: 8px 14px;
        border: 0;
        border-radius: 8px;
        background: var(--primary);
        color: #ffffff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      /* detail pages */
      .back-link {
        display: inline-block;
        margin-bottom: 12px;
      }

      .post-detail .post-meta {
        margin-bottom: 12px;
        font-size: 1rem;
      }

      .author-box {
        margin-top: 20px;
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--card);
      }

      .author-box h2 {
        font-size: 1.05rem;
      }

      .author-box p {
        margin: 0;
      }

      .author-header {
        margin-bottom: 8px;
      }

      .not-found {
        padding: 24px 0;
        text-align: center;
      }
check:
  dom:
    text:
      - Latest posts
      - 6 posts
      - By Ada Lovelace
      - Loops and subroutines
    selectors:
      - .post-list > .post-card:nth-child(6)
  code:
    - file: hooks/useFetch.js
      pattern: export\s+function\s+useFetch\s*\(
      message: 'In hooks/useFetch.js write: export function useFetch(load, deps = []) { ... }'
    - file: hooks/useFetch.js
      pattern: useEffect\(
      message: The hook runs the request inside useEffect.
    - file: hooks/useFetch.js
      pattern: cancelled|ignore
      message: Keep a flag in the effect so a late answer is ignored after cleanup.
    - file: hooks/useFetch.js
      pattern: return\s*\{[^}]*loading
      message: Return an object with data, loading, error and reload.
    - file: hooks/useFetch.js
      pattern: reload
      message: The hook should also return a reload function.
    - file: components/Loading.jsx
      pattern: export\s+default\s+Loading
      message: 'End components/Loading.jsx with: export default Loading;'
    - file: components/ErrorMessage.jsx
      pattern: export\s+default\s+ErrorMessage
      message: 'End components/ErrorMessage.jsx with: export default ErrorMessage;'
    - file: components/ErrorMessage.jsx
      pattern: role=["']alert["']
      message: Give the error box role="alert" so screen readers announce it.
    - file: components/ErrorMessage.jsx
      pattern: onRetry
      message: ErrorMessage takes an onRetry prop and shows a Try again button.
    - file: pages/Home.jsx
      pattern: useFetch\(
      message: Home should call useFetch(...) instead of managing the request itself.
    - file: pages/Home.jsx
      pattern: from\s+['"]\.\./hooks/useFetch['"]
      message: 'Import the hook: import { useFetch } from ''../hooks/useFetch'';'
    - file: pages/Home.jsx
      pattern: ^(?![\s\S]*useState)
      message: 'Home no longer needs useState: the hook owns the state.'
hints:
  - 'Move code, do not rewrite it. useFetch(load, deps) gets the state, the effect and the cancelled flag from Home. It returns { data, loading, error, reload }. Home keeps only the part that is special: what to load (loadHome) and how to draw it.'
  - 'In the hook: one state object { data, error, loading } starting with loading: true, a number state attempt, and useEffect(() => { let cancelled = false; setState(loading); load().then(...).catch(...); return () => { cancelled = true; }; }, [...deps, attempt]). reload = () => setAttempt((n) => n + 1). In Home: const { data, loading, error, reload } = useFetch(loadHome, []);'
  - 'Home render: {loading && <Loading label="Loading posts..." />} {error && <ErrorMessage message={error.message} onRetry={reload} />} {data && (<> ... data.posts.map(...) ... data.authors[post.userId] ... </>)}.  loadHome is a module-level async function: const [posts, users] = await Promise.all([getPosts(), getUsers()]); build authors; return { posts, authors };'
solution:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import Layout from './components/Layout';
      import { useRoute, matchRoute } from './router';
      import Home from './pages/Home';
      import About from './pages/About';

      // Demo only: when the preview starts without a route, open this one (the home page).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/';
      if (!window.location.hash) {
        window.location.hash = START_ROUTE;
      }

      // The route table: which page belongs to which path.
      const routes = [
        { path: '/', render: () => <Home /> },
        { path: '/about', render: () => <About /> },
      ];

      // Walk the table and return the page of the first route that matches.
      function findPage(path) {
        for (const route of routes) {
          const params = matchRoute(route.path, path);
          if (params) {
            return route.render(params);
          }
        }
        return null;
      }

      function App() {
        const path = useRoute();
        return <Layout>{findPage(path)}</Layout>;
      }

      export default App;
  - name: router.jsx
    code: |
      import React, { useState, useEffect } from 'react';

      // A tiny hash router. The address bar holds the page: "index.html#/posts/2" means the route "/posts/2".
      // A hash change never reloads the page, so we can swap the content with React.

      // Returns the current hash and re-renders the component whenever it changes.
      function useHash() {
        const [hash, setHash] = useState(window.location.hash);

        useEffect(() => {
          function handleChange() {
            setHash(window.location.hash);
          }
          window.addEventListener('hashchange', handleChange);
          return () => window.removeEventListener('hashchange', handleChange);
        }, []);

        return hash;
      }

      // "#/about" -> "/about". An empty hash means the home page "/".
      export function useRoute() {
        const path = useHash().replace(/^#/, '');
        return path === '' ? '/' : path;
      }

      // Does this path look like the pattern? Returns an object (empty for now) when yes, null when no.
      export function matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        if (patternParts.length !== pathParts.length) {
          return null;
        }
        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i] !== pathParts[i]) {
            return null;
          }
        }
        return {};
      }

      // A link that changes the hash. Extra props (className, aria-current...) are passed on to the <a>.
      export function Link({ to, children, ...rest }) {
        return (
          <a href={'#' + to} {...rest}>
            {children}
          </a>
        );
      }
  - name: pages/About.jsx
    code: |
      import React from 'react';

      function About() {
        return (
          <>
            <h1>About Dev Blog</h1>
            <p className="lede">
              Dev Blog is a small blog about computing history and ideas. It is built as a multi-file React
              project: pages, components, hooks and a router, each in its own file.
            </p>
            <p>
              The posts are loaded from a practice API, so you can swap in your own server later without
              touching the pages.
            </p>
          </>
        );
      }

      export default About;
  - name: pages/Home.jsx
    code: |
      import React from 'react';
      import PostCard from '../components/PostCard';
      import Loading from '../components/Loading';
      import ErrorMessage from '../components/ErrorMessage';
      import { useFetch } from '../hooks/useFetch';
      import { getPosts, getUsers } from '../lib/api';
      import { pluralize } from '../lib/format';

      // Everything this page needs, loaded together. Returns { posts, authors }.
      async function loadHome() {
        const [posts, users] = await Promise.all([getPosts(), getUsers()]);
        const authors = {};
        users.forEach((user) => {
          authors[user.id] = user;
        });
        return { posts, authors };
      }

      function Home() {
        const { data, loading, error, reload } = useFetch(loadHome, []);

        return (
          <>
            <h1>Latest posts</h1>
            {loading && <Loading label="Loading posts..." />}
            {error && <ErrorMessage message={error.message} onRetry={reload} />}
            {data && (
              <>
                <p className="count">{pluralize(data.posts.length, 'post')}</p>
                <div className="post-list">
                  {data.posts.map((post) => (
                    <PostCard key={post.id} post={post} author={data.authors[post.userId]} />
                  ))}
                </div>
              </>
            )}
          </>
        );
      }

      export default Home;
  - name: components/ErrorMessage.jsx
    code: |
      import React from 'react';

      // Shown when a request failed. role="alert" makes screen readers announce it right away.
      // The Try again button only appears when the parent passes an onRetry function.
      function ErrorMessage({ message, onRetry }) {
        return (
          <div className="error" role="alert">
            <p>Something went wrong: {message}</p>
            {onRetry && (
              <button type="button" className="retry" onClick={onRetry}>
                Try again
              </button>
            )}
          </div>
        );
      }

      export default ErrorMessage;
  - name: components/Layout.jsx
    code: |
      import React from 'react';
      import { Link } from '../router';

      // The frame around every page: header with navigation, the page itself, and a footer.
      // `children` is whatever the parent puts between <Layout> and </Layout>.
      function Layout({ children }) {
        return (
          <>
            <header className="site-header">
              <div className="container">
                <Link className="brand" to="/">
                  Dev Blog
                </Link>
                <nav className="site-nav" aria-label="Main">
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                </nav>
              </div>
            </header>

            <main className="container content" id="main">
              {children}
            </main>

            <footer className="site-footer">
              <div className="container">
                <p>Dev Blog, built with React. The posts come from the practice API.</p>
              </div>
            </footer>
          </>
        );
      }

      export default Layout;
  - name: components/Loading.jsx
    code: |
      import React from 'react';

      // A friendly "please wait" line. role="status" lets screen readers announce it politely.
      function Loading({ label = 'Loading...' }) {
        return (
          <p className="loading" role="status">
            {label}
          </p>
        );
      }

      export default Loading;
  - name: components/PostCard.jsx
    code: |
      import React from 'react';

      // One post, shown as a card. `author` is optional: when we have it, we show a byline.
      function PostCard({ post, author }) {
        return (
          <article className="post-card">
            <h2 className="post-title">{post.title}</h2>
            {author && <p className="post-meta">By {author.name}</p>}
            <ul className="tags">
              {post.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        );
      }

      export default PostCard;
  - name: hooks/useFetch.js
    code: |
      import { useState, useEffect } from 'react';

      // useFetch(load, deps): runs the async function `load` and tracks the three states of any request.
      //   const { data, loading, error, reload } = useFetch(() => getPosts(), []);
      // `deps` works like the array of useEffect: when a value in it changes, the data is loaded again.
      export function useFetch(load, deps = []) {
        const [state, setState] = useState({ data: null, error: null, loading: true });
        const [attempt, setAttempt] = useState(0);

        useEffect(() => {
          let cancelled = false;
          setState({ data: null, error: null, loading: true });

          load()
            .then((data) => {
              if (!cancelled) {
                setState({ data: data, error: null, loading: false });
              }
            })
            .catch((error) => {
              if (!cancelled) {
                setState({ data: null, error: error, loading: false });
              }
            });

          // Cleanup: if the component goes away (or deps change) before the answer, ignore the answer.
          return () => {
            cancelled = true;
          };
        }, [...deps, attempt]);

        // Calling reload() changes `attempt`, which runs the effect again.
        function reload() {
          setAttempt((n) => n + 1);
        }

        return { data: state.data, error: state.error, loading: state.loading, reload: reload };
      }
  - name: lib/api.js
    code: |
      // lib/api.js: every request to the server lives in this one file.
      // Pages and hooks call getPosts() and friends. They never write a URL or look at a status code.

      export const API = 'https://api.academy.test';

      // Fetch JSON from the API. Throws an Error with a readable message when anything goes wrong.
      async function request(path) {
        let res;
        try {
          res = await fetch(API + path);
        } catch (err) {
          // fetch only rejects when the request could not be made at all (offline, server down).
          throw new Error('Could not reach the server. Check your connection.');
        }

        if (!res.ok) {
          // The server answered, but with an error status such as 404 or 500.
          let message = 'The server answered with status ' + res.status + '.';
          try {
            const body = await res.json();
            if (body && body.error) {
              message = body.error;
            }
          } catch (err) {
            // the error body was not JSON: keep the default message
          }
          throw new Error(message);
        }

        return res.json();
      }

      export function getPosts() {
        return request('/posts');
      }

      export function getUsers() {
        return request('/users');
      }
  - name: lib/format.js
    code: |
      // Small helpers for turning data into text. Plain JavaScript, no React in here.

      // pluralize(1, 'post') -> "1 post"      pluralize(6, 'post') -> "6 posts"
      export function pluralize(count, word) {
        return count + ' ' + word + (count === 1 ? '' : 's');
      }
  - name: styles.css
    code: |
      /* Dev Blog: all the styles for the whole project.
         You do not need to write any CSS here, the focus of this project is React. */

      :root {
        --bg: #f6f7f9;
        --card: #ffffff;
        --text: #1f2937;
        --muted: #5b6573;
        --primary: #0e7490;
        --primary-dark: #155e75;
        --border: #d9dde3;
        --danger: #b91c1c;
        --focus: #d97706;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        line-height: 1.55;
      }

      a {
        color: var(--primary);
      }

      a:hover {
        color: var(--primary-dark);
      }

      a:focus-visible,
      button:focus-visible,
      input:focus-visible {
        outline: 3px solid var(--focus);
        outline-offset: 2px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 1.8rem;
        line-height: 1.2;
      }

      h2 {
        margin: 0 0 8px;
        font-size: 1.25rem;
        line-height: 1.3;
      }

      .container {
        max-width: 880px;
        margin: 0 auto;
        padding: 0 16px;
      }

      /* layout: header, main, footer */
      .skip-link {
        position: absolute;
        left: 8px;
        top: -60px;
        z-index: 10;
        padding: 8px 14px;
        border-radius: 6px;
        background: #111827;
        color: #ffffff;
      }

      .skip-link:focus {
        top: 8px;
        color: #ffffff;
      }

      .site-header {
        border-bottom: 1px solid var(--border);
        background: var(--card);
      }

      .site-header .container {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 16px;
        padding-top: 12px;
        padding-bottom: 12px;
      }

      .brand {
        color: var(--text);
        font-size: 1.25rem;
        font-weight: 800;
        text-decoration: none;
      }

      .brand:hover {
        color: var(--primary);
      }

      .site-nav {
        display: flex;
        gap: 4px;
      }

      .site-nav a {
        padding: 6px 12px;
        border-radius: 999px;
        color: var(--text);
        font-weight: 600;
        text-decoration: none;
      }

      .site-nav a:hover {
        background: #e5e7eb;
      }

      .site-nav a[aria-current="page"] {
        background: var(--primary);
        color: #ffffff;
      }

      .content {
        padding-top: 24px;
        padding-bottom: 40px;
        outline: none;
      }

      .site-footer {
        border-top: 1px solid var(--border);
        color: var(--muted);
        font-size: 0.9rem;
      }

      .site-footer .container {
        padding-top: 16px;
        padding-bottom: 24px;
      }

      /* text helpers */
      .count,
      .hint,
      .loading,
      .lede,
      .post-meta,
      .result-count {
        color: var(--muted);
      }

      .lede {
        font-size: 1.05rem;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }

      /* post cards */
      .post-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        margin-top: 12px;
      }

      @media (min-width: 640px) {
        .post-list {
          grid-template-columns: 1fr 1fr;
        }
      }

      .post-card {
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--card);
      }

      .post-title {
        margin: 0 0 4px;
        font-size: 1.15rem;
      }

      .post-title a {
        color: var(--text);
        text-decoration: none;
      }

      .post-title a:hover {
        color: var(--primary);
        text-decoration: underline;
      }

      .post-meta {
        margin: 0 0 8px;
        font-size: 0.9rem;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .tag {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 999px;
        background: #e0f2fe;
        color: #075985;
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;
      }

      a.tag:hover {
        background: #bae6fd;
        color: #075985;
      }

      .tag.active {
        background: var(--primary);
        color: #ffffff;
      }

      /* search and filters */
      .filters {
        margin: 12px 0 4px;
      }

      .search {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font: inherit;
      }

      .filter-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
      }

      /* loading, errors */
      .error {
        padding: 12px 14px;
        border: 1px solid #fecaca;
        border-radius: 10px;
        background: #fef2f2;
        color: var(--danger);
      }

      .error p {
        margin: 0 0 8px;
      }

      .retry {
        padding: 8px 14px;
        border: 0;
        border-radius: 8px;
        background: var(--primary);
        color: #ffffff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      /* detail pages */
      .back-link {
        display: inline-block;
        margin-bottom: 12px;
      }

      .post-detail .post-meta {
        margin-bottom: 12px;
        font-size: 1rem;
      }

      .author-box {
        margin-top: 20px;
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--card);
      }

      .author-box h2 {
        font-size: 1.05rem;
      }

      .author-box p {
        margin: 0;
      }

      .author-header {
        margin-bottom: 8px;
      }

      .not-found {
        padding: 24px 0;
        text-align: center;
      }
quiz:
  - q: What makes a function a custom hook?
    options:
      - It is exported with export default
      - It returns JSX
      - Its name starts with use and it calls other hooks such as useState or useEffect
    answer: 2
  - q: Why does useFetch take a second argument, deps?
    options:
      - So the request runs again when a value it depends on changes, such as a post id
      - It is only there for documentation
      - So the data is cached forever
    answer: 0
  - q: What does reload() do in our hook?
    options:
      - It reloads the whole browser page
      - It changes the attempt number, which makes the effect run again and fetch fresh data
      - It clears the error and does nothing else
    answer: 1
    explain: Changing a value that is in the dependency array of the effect is the standard way to ask a hook to run again.
---
Every page that loads data needs the same three states: *loading*, *error* and *data*. Copy-pasting the code onto each page would be a mistake. In this step you move it into one reusable hook and two small components.

## Where we are

The home page loads posts and authors through `lib/api.js`. But `Home.jsx` contains a lot of machinery: four pieces of state, an effect, a `cancelled` flag. The post and author pages in the next steps would need all of it again.

## What we will add, and why it matters

React lets you share *logic* (not just markup) with a **custom hook**: a function that starts with `use` and that may call other hooks. `useFetch` will hold the state and the effect for any request. Pages then say *what* to load and *how* to draw it, and nothing else. We also add two tiny components so that every page shows loading and errors in the same, accessible way. This is the difference between a demo and an app that feels consistent.

## Guided walk-through

**1. The hook's shape.** Its contract is the most important design decision. Callers pass an async function and a list of dependencies and get an object back:

```js
const { data, loading, error, reload } = useFetch(() => getPosts(), []);
```

The hook receives *a function* (`load`), not a URL, so it works with every helper in `lib/api.js` and with combinations like `Promise.all`.

**2. Inside `hooks/useFetch.js`.** Keep one state object `{ data, error, loading }` (initially `loading: true`), so the three values always change together and the page can never show data and an error at once. The effect resets the state to loading, calls `load()`, and stores the result unless it was cancelled:

```js
useEffect(() => {
  let cancelled = false;
  setState({ data: null, error: null, loading: true });
  load().then(/* store data */).catch(/* store error */);
  return () => { cancelled = true; };
}, [...deps, attempt]);
```

`attempt` is a counter. `reload()` adds one, the effect sees a changed dependency and runs again, which is exactly how a "Try again" button should work. Spreading `...deps` into the array lets the caller decide what makes the request run again. (Linters complain about this pattern; for a small hook like this it is a known trade-off.)

**3. Two components.** `Loading` draws a paragraph with `role="status"`. `ErrorMessage` draws a box with `role="alert"` and, when it is given an `onRetry` function, a *Try again* button. The roles make screen readers announce what happens, so nobody listens to silence while a page loads.

**4. Slim down Home.** Move the combined request into a module-level `async function loadHome()` that returns `{ posts, authors }`. The component is now short: call `useFetch(loadHome, [])` and render `Loading`, `ErrorMessage` or the list depending on `loading`, `error` and `data`.

To see the error state, temporarily make `loadHome` request a path that does not exist (add a typo in `getPosts`) and watch the box with its button appear.

> **Watch out:**
> - `useFetch(loadHome(), [])`: with the parentheses you pass the *result* (a promise) instead of the function. Pass `loadHome` or `() => loadHome()`.
> - Rendering `data.posts` while `data` is still `null` crashes with `Cannot read properties of null`. Guard with `data && ...`.
> - Hooks only run inside components and other hooks. Calling `useFetch` in a plain helper gives `Invalid hook call`.
> - If the request restarts forever, a dependency changes on every render (an object created inline, for example). Keep `deps` to simple values like ids.

> **Your turn:** Write `hooks/useFetch.js` (`export function useFetch(load, deps = [])` returning `{ data, loading, error, reload }`), `components/Loading.jsx` and `components/ErrorMessage.jsx` (with `role="alert"` and an optional *Try again* button), and rewrite `pages/Home.jsx` to use them. The page must look exactly like before.
