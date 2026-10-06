---
title: 'Step 4: A data layer and the posts from the API'
summary: Put every request in lib/api.js with error handling, and load the home page posts and authors from the API.
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
      import React from 'react';
      import PostCard from '../components/PostCard';
      import { pluralize } from '../lib/format';

      // Step 4: load the posts from the API instead of a hard-coded array.
      //
      // TODO 2 (lib/api.js): write request(), getPosts() and getUsers() first.
      // TODO 3 (this file): delete the POSTS array. Keep four pieces of state: posts, authors (an object that
      //         maps a user id to the user), status ('loading' | 'error' | 'ready') and error (a message).
      // TODO 4 (this file): in a useEffect with an empty dependency array, load getPosts() and getUsers()
      //         together with Promise.all, build the authors object, and set the state. Use a "cancelled" flag
      //         so a late answer is ignored. On failure store the error message and set the status to 'error'.
      // TODO 5 (this file): render the h1 always, "Loading posts..." (class "loading") while loading, an error box
      //         (class "error", role="alert") on failure, and the count plus post list when ready.
      //         Give every PostCard the author: author={authors[post.userId]}.
      // TODO 6 (components/PostCard.jsx): show a byline. See that file.

      // Sample posts. They have the same shape the API will send us later.
      const POSTS = [
        { id: 1, userId: 1, title: 'Notes on the Engine', tags: ['math', 'history'] },
        { id: 2, userId: 2, title: 'Nanoseconds', tags: ['hardware'] },
        { id: 3, userId: 3, title: 'Can machines think?', tags: ['ai', 'history'] },
        { id: 4, userId: 4, title: 'Orbits by hand', tags: ['math'] },
        { id: 5, userId: 5, title: 'Just a hobby', tags: ['os'] },
        { id: 6, userId: 1, title: 'Loops and subroutines', tags: ['code'] },
      ];

      function Home() {
        return (
          <>
            <h1>Latest posts</h1>
            <p className="count">{pluralize(POSTS.length, 'post')}</p>
            <div className="post-list">
              {POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        );
      }

      export default Home;
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
  - name: components/PostCard.jsx
    code: |
      import React from 'react';

      // TODO 6: PostCard gets a second prop, author (a user object that can be missing).
      //         When it is there, show a paragraph with class "post-meta" under the title that says
      //         By followed by the author's name. When it is missing, show nothing.

      // One post, shown as a card. It only knows how to draw the post it receives.
      function PostCard({ post }) {
        return (
          <article className="post-card">
            <h2 className="post-title">{post.title}</h2>
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
  - name: lib/api.js
    code: |
      // TODO 1: write the data layer in this file.
      //
      // - an exported constant API = 'https://api.academy.test'
      // - a private async function request(path): fetch(API + path) inside try/catch (a rejected fetch means
      //   the server could not be reached: throw new Error with a friendly message); when res.ok is false
      //   throw an Error (use the server's  error  field from the JSON body when there is one, otherwise
      //   mention the status code); otherwise return res.json()
      // - an exported function getPosts() that returns request('/posts')
      // - an exported function getUsers() that returns request('/users')
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
      - Notes on the Engine
      - By Ada Lovelace
      - By Linus Torvalds
    selectors:
      - .post-list > .post-card:nth-child(6)
      - .post-card p.post-meta
  code:
    - file: lib/api.js
      pattern: api\.academy\.test
      message: 'Define the API address in lib/api.js: https://api.academy.test'
    - file: lib/api.js
      pattern: export\s+(async\s+)?function\s+getPosts\s*\(
      message: 'In lib/api.js write: export function getPosts() { ... }'
    - file: lib/api.js
      pattern: export\s+(async\s+)?function\s+getUsers\s*\(
      message: 'In lib/api.js write: export function getUsers() { ... }'
    - file: lib/api.js
      pattern: res\.ok|response\.ok
      message: 'Check res.ok: fetch does not reject on a 404 or 500.'
    - file: lib/api.js
      pattern: catch\s*\(
      message: Wrap fetch in try/catch to handle a server that cannot be reached.
    - file: pages/Home.jsx
      pattern: useEffect\(
      message: Load the data inside useEffect(...).
    - file: pages/Home.jsx
      pattern: Promise\.all\(
      message: Start both requests together with Promise.all([...]).
    - file: pages/Home.jsx
      pattern: from\s+['"]\.\./lib/api['"]
      message: 'Import the helpers: import { getPosts, getUsers } from ''../lib/api'';'
    - file: pages/Home.jsx
      pattern: ^(?![\s\S]*const\s+POSTS)
      message: Delete the hard-coded POSTS array from Home.jsx.
    - file: components/PostCard.jsx
      pattern: author
      message: PostCard should accept an author prop and show a byline.
hints:
  - 'Two files change. lib/api.js knows the server: it has a private request(path) function plus exported getPosts() and getUsers(). Home.jsx never writes a URL: it calls those helpers inside useEffect and keeps posts, authors, status and error in state.'
  - 'request(path): let res; try { res = await fetch(API + path); } catch { throw new Error(''Could not reach the server.''); } if (!res.ok) { throw new Error(...) } return res.json();  In Home: Promise.all([getPosts(), getUsers()]).then(([postList, userList]) => ...). Turn the users array into an object keyed by id so each card can look up its author.'
  - 'useEffect(() => { let cancelled = false; Promise.all([getPosts(), getUsers()]).then(([postList, userList]) => { if (cancelled) return; const byId = {}; userList.forEach((u) => { byId[u.id] = u; }); setPosts(postList); setAuthors(byId); setStatus(''ready''); }).catch((err) => { if (!cancelled) { setError(err.message); setStatus(''error''); } }); return () => { cancelled = true; }; }, []);  Then render <PostCard key={post.id} post={post} author={authors[post.userId]} /> and in PostCard: {author && <p className="post-meta">By {author.name}</p>}'
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
      import React, { useState, useEffect } from 'react';
      import PostCard from '../components/PostCard';
      import { getPosts, getUsers } from '../lib/api';
      import { pluralize } from '../lib/format';

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
  - q: A request to /posts/99 answers with status 404. What does fetch do?
    options:
      - It rejects with an error
      - It resolves normally, so you must check res.ok yourself
      - It retries three times
    answer: 1
    explain: fetch only rejects when the request cannot be made at all (offline, server down). HTTP error statuses are normal responses.
  - q: Why is the API address and the error handling in lib/api.js and not inside the pages?
    options:
      - It makes the requests run in parallel
      - Pages cannot call fetch
      - One place to change if the server moves, and every page gets the same error handling
    answer: 2
  - q: What does Promise.all([getPosts(), getUsers()]) give you?
    options:
      - The two requests run at the same time, and you get both results when the slowest has finished
      - Only the first result that arrives
      - The two requests run one after the other
    answer: 0
---
Time to replace the hard-coded posts with real data. You will create a **data layer**: one file that knows how to talk to the server. Then the home page will use it to show posts together with their authors.

## Where we are

The app has a Layout, a hash router and two pages. The home page shows six posts from an array inside `pages/Home.jsx`. The cards do not know who wrote the posts.

## What we will add, and why it matters

In a real app, pages should not know URLs, headers or status codes. They ask for "the posts" and get posts or an error. Putting requests in `lib/api.js` gives you one place for the server address, the error handling and, later, authentication. If the server changes, only that file changes. The practice server at `https://api.academy.test` answers `/posts` (each post has `id`, `userId`, `title`, `tags`) and `/users` (with `id`, `name`, `role`, `city`). A post stores only the author's id, so to print a name we need both lists.

## Guided walk-through

**1. A private `request` helper.** `fetch` has a trap: it only **rejects** when no answer could be fetched at all. A 404 or 500 is a normal response, so you must test `res.ok`. Handle both cases once:

```js
async function request(path) {
  let res;
  try {
    res = await fetch(API + path);
  } catch (err) {
    throw new Error('Could not reach the server.');
  }
  if (!res.ok) {
    // build a readable message, then: throw new Error(message);
  }
  return res.json();
}
```

When the server sends an error, its JSON body has an `error` field with a good message. Try `await res.json()` inside its own `try/catch`, because an error page might not be JSON. Everything outside `lib/api.js` now only sees ordinary `Error` objects with readable messages.

**2. Exported helpers.** `export function getPosts() { return request('/posts'); }` and the same for `getUsers()`. Only these two names are visible to other files, `request` stays private.

**3. Load in Home.** Keep four pieces of state: `posts`, `authors`, `status` (`'loading'`, `'error'` or `'ready'`) and `error`. Load in a `useEffect` with an empty dependency array so it runs once. The two requests do not depend on each other, so start them together:

```jsx
Promise.all([getPosts(), getUsers()]).then(([postList, userList]) => {
  // build an object that maps each user id to the user, then set the state
});
```

The `cancelled` flag in the cleanup function makes sure a late answer is ignored if the page was left meanwhile.

**4. Show the author.** Pass `author={authors[post.userId]}` to each `PostCard`, and let `PostCard` print `By <name>` when it receives an author. Rendering by status (`Loading posts...`, an error box, or the list) keeps the page honest while the data is on its way.

> **Watch out:**
> - Forgetting `async`/`await` in `request`: you get `res.json is not a function` or a Promise printed as `[object Promise]`.
> - Putting `fetch` directly in the component body (not in `useEffect`) causes a request after every render: an endless loop of re-renders.
> - Setting state after the component has gone away shows a warning in the console: that is what `cancelled` prevents.
> - `authors[post.userId]` is `undefined` until the users arrive: the `author &&` check in PostCard protects you.

> **Your turn:** Write `lib/api.js` (the `API` address, a private `request` that handles network errors and `res.ok`, and exported `getPosts` and `getUsers`). Change `pages/Home.jsx` to load posts and users with `Promise.all`, remove the hard-coded array and show `6 posts`. Update `PostCard` so each card shows `By <author name>`.
