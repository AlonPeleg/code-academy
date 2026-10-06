---
title: 'Step 3: A hash router with useRoute and Link'
summary: Write your own tiny router, with a useRoute hook and a Link component, and show two pages.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import Layout from './components/Layout';
      import PostCard from './components/PostCard';
      import { pluralize } from './lib/format';

      // Step 3: a hash router and two pages. Work through the TODOs in this order:
      //
      // TODO 1 (router.jsx): write the router: useRoute, matchRoute and Link.
      // TODO 2 (pages/Home.jsx): move the posts list from this file into the Home page.
      // TODO 3 (pages/About.jsx): write a small About page.
      // TODO 4 (this file): import useRoute, matchRoute, Home and About. Remove what Home took over
      //         (the POSTS array, the PostCard and pluralize imports). Then build a routes table with two
      //         entries and let App show the page that matches the current route inside the Layout.
      // TODO 5 (components/Layout.jsx): switch the navigation to Link.

      // Demo only: when the preview starts without a route, open this one (the About page).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/about';
      if (!window.location.hash) {
        window.location.hash = START_ROUTE;
      }

      // Sample posts. They have the same shape the API will send us later.
      const POSTS = [
        { id: 1, userId: 1, title: 'Notes on the Engine', tags: ['math', 'history'] },
        { id: 2, userId: 2, title: 'Nanoseconds', tags: ['hardware'] },
        { id: 3, userId: 3, title: 'Can machines think?', tags: ['ai', 'history'] },
        { id: 4, userId: 4, title: 'Orbits by hand', tags: ['math'] },
        { id: 5, userId: 5, title: 'Just a hobby', tags: ['os'] },
        { id: 6, userId: 1, title: 'Loops and subroutines', tags: ['code'] },
      ];

      function App() {
        return (
          <Layout>
            <h1>Latest posts</h1>
            <p className="count">{pluralize(POSTS.length, 'post')}</p>
            <div className="post-list">
              {POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </Layout>
        );
      }

      export default App;
  - name: router.jsx
    code: |
      // TODO 1: write the router in this file. You need three exports (and one private helper):
      //
      // import React with useState and useEffect from 'react'.
      //
      // useHash: a private helper function (not exported)
      //   - state initialised with window.location.hash
      //   - a useEffect (empty dependency array) that adds a 'hashchange' listener on window and
      //     removes it again in the cleanup function; the listener stores window.location.hash in state
      //   - returns the hash
      //
      // useRoute: an exported function
      //   - takes the hash from useHash(), cuts off the leading "#" (replace(/^#/, '')), and returns
      //     '/' when nothing is left
      //
      // matchRoute(pattern, path): an exported function
      //   - split both on '/', return null when the number of parts differs or when a part is different,
      //     otherwise return an empty object {}
      //
      // Link({ to, children, ...rest }): an exported function component
      //   - renders an anchor whose href is '#' + to, passes {...rest} on, and shows the children
  - name: pages/About.jsx
    code: |
      // TODO 3: write a small About page here.
      //
      // - function About() returns a fragment with an h1 that says  About Dev Blog  and one or two paragraphs
      //   (the first one with class "lede") that describe the blog
      // - export it as the default export
  - name: pages/Home.jsx
    code: |
      // TODO 2: write the Home page here. It is the posts list that App shows today:
      //
      // - copy the POSTS array into this file (the paths to the other files are now one folder up: '../')
      // - function Home() returns a fragment with the h1 "Latest posts", the count paragraph and the post list
      // - export it as the default export
  - name: components/Layout.jsx
    code: |
      import React from 'react';

      // TODO 5: import the Link component from your router file (one folder up), then replace the three
      //         plain anchors below (the brand and the two nav links) with Link elements.
      //         An anchor has href="#/about", a Link has to="/about" (no hash sign).

      // The frame around every page: header with navigation, the page itself, and a footer.
      // `children` is whatever the parent puts between <Layout> and </Layout>.
      function Layout({ children }) {
        return (
          <>
            <header className="site-header">
              <div className="container">
                <a className="brand" href="#/">
                  Dev Blog
                </a>
                <nav className="site-nav" aria-label="Main">
                  <a href="#/">Home</a>
                  <a href="#/about">About</a>
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
      - About Dev Blog
      - Dev Blog
    selectors:
      - main#main h1
      - nav.site-nav a[href="#/about"]
      - nav.site-nav a[href="#/"]
  code:
    - file: router.jsx
      pattern: export\s+function\s+useRoute\s*\(
      message: 'In router.jsx write: export function useRoute() { ... }'
    - file: router.jsx
      pattern: addEventListener\(\s*['"]hashchange['"]
      message: 'useRoute must listen to the hashchange event: window.addEventListener(''hashchange'', ...).'
    - file: router.jsx
      pattern: removeEventListener\(\s*['"]hashchange['"]
      message: Remove the listener in the cleanup function of useEffect.
    - file: router.jsx
      pattern: export\s+function\s+matchRoute\s*\(
      message: 'In router.jsx write: export function matchRoute(pattern, path) { ... }'
    - file: router.jsx
      pattern: export\s+function\s+Link\s*\(
      message: 'In router.jsx write: export function Link({ to, children, ...rest }) { ... }'
    - file: router.jsx
      pattern: href=\{\s*['"]#['"]\s*\+\s*to\s*\}
      message: A Link renders an anchor with href={'#' + to}.
    - file: pages/Home.jsx
      pattern: export\s+default\s+Home
      message: 'End pages/Home.jsx with: export default Home;'
    - file: pages/Home.jsx
      pattern: PostCard
      message: The posts list now lives in pages/Home.jsx.
    - file: pages/About.jsx
      pattern: export\s+default\s+About
      message: 'End pages/About.jsx with: export default About;'
    - file: App.jsx
      pattern: useRoute\(\)
      message: In App call const path = useRoute();
    - file: App.jsx
      pattern: matchRoute\(
      message: Use matchRoute(route.path, path) to find the page for the current path.
    - file: components/Layout.jsx
      pattern: <Link\b
      message: Use the Link component in the navigation instead of plain anchors.
hints:
  - 'A router is three small things: a hook that returns the current path and re-renders when it changes (useRoute), a function that compares a pattern with a path (matchRoute), and a link component (Link). The address bar part after # is the path: #/about means the route /about.'
  - 'useRoute: keep window.location.hash in state; in a useEffect add a ''hashchange'' listener that updates the state, and remove it in the cleanup function. Link: return <a href={''#'' + to} {...rest}>{children}</a>. In App: const path = useRoute(); and loop over the routes table with matchRoute until one matches.'
  - 'App: const routes = [{ path: ''/'', render: () => <Home /> }, { path: ''/about'', render: () => <About /> }]; function findPage(path) { for (const route of routes) { const params = matchRoute(route.path, path); if (params) return route.render(params); } return null; }  function App() { const path = useRoute(); return <Layout>{findPage(path)}</Layout>; }'
solution:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import Layout from './components/Layout';
      import { useRoute, matchRoute } from './router';
      import Home from './pages/Home';
      import About from './pages/About';

      // Demo only: when the preview starts without a route, open this one.
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/about';
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
  - q: Why does a hash change (#/about) not reload the page?
    options:
      - 'Browsers never reload a page when the part after # changes, they only fire a hashchange event'
      - React cancels the reload for us
      - Because the link has the class router-link
    answer: 0
  - q: Why does useEffect return a function that calls removeEventListener?
    options:
      - To make the listener run twice
      - So the listener is removed when the component goes away and does not pile up or update a dead component
      - Because addEventListener does not work without it
    answer: 1
  - q: What is the difference between a hook like useRoute and a component like Link?
    options:
      - Hooks only work in class components
      - They are the same, the name just starts differently
      - A component returns JSX to draw something, a hook returns data or behaviour and draws nothing
    answer: 2
---
You will now build the part that most tutorials hide behind a library: the **router**. It decides which page to show for the address in the browser. Writing a small one yourself is the best way to understand what react-router does for you.

## Where we are

`Layout` wraps the page. The navigation links exist, but nothing reacts when you click them, and the home page content is still written inside `App.jsx`.

## What we will add, and why it matters

A multi-page React app is still **one** HTML page. When the address changes, JavaScript swaps the content. The simplest address that never triggers a page load is the **hash**: in `index.html#/about`, everything after `#` is free for us to use. Two browser features make a router possible:

- `window.location.hash` holds that text (`'#/about'`), and assigning to it changes the address.
- The `hashchange` event fires on `window` every time it changes (also when the user clicks Back).

Our router has three exports in `router.jsx`: `useRoute()`, `matchRoute()` and `Link`.

## Guided walk-through

**1. useRoute.** A **hook** is a function whose name starts with `use` and that may call other hooks. This one stores the hash in state, so React re-renders when it changes:

```jsx
function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    function handleChange() { setHash(window.location.hash); }
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);
  return hash;
}
```

The function returned from the effect is the **cleanup**: React runs it when the component disappears. `useRoute()` then turns `'#/about'` into `'/about'` and an empty hash into `'/'`.

**2. matchRoute(pattern, path).** Split both strings on `/` and compare the parts one by one. Return `null` when they differ and `{}` when they match (in step 6 the object will carry parameters like an id).

**3. Link.** It renders a normal `<a>` with `href={'#' + to}`. `{...rest}` passes along any other props (`className`, later `aria-current`) so Link behaves like an anchor.

**4. Two pages.** Move the posts list from `App.jsx` into `pages/Home.jsx` (imports now go up one folder: `'../components/PostCard'`) and write a short `pages/About.jsx`. A **page** is just a component that fills the main area. Folders tell the reader what a file is for.

**5. The route table.** Put the pages in an array of `{ path, render }` objects. `findPage(path)` loops over it with `matchRoute` and returns the first match. `App` calls `useRoute()` and renders `<Layout>{findPage(path)}</Layout>`. A table is data, so adding a page later is one new line.

**6. Link in the Layout.** Replace the plain anchors in `Layout.jsx` (brand and both nav links) with `Link`, using `to="/about"` instead of `href="#/about"`.

The starter contains a "demo only" line that sets `#/about` as the starting address, so that the preview opens on that page. Real sites do not need it.

> **Watch out:**
> - Forgetting the `[]` in `useEffect(..., [])` adds a new listener after every render.
> - A hook must be called at the top level of a component or another hook, never inside an `if` or a loop.
> - `Link` receives `to="/about"`, not `to="#/about"`: Link adds the `#` itself.
> - If the page stays blank, check that `findPage` returns the element and that both pages have `export default`.

> **Your turn:** Write `router.jsx` (`useRoute`, `matchRoute`, `Link`), the pages `pages/Home.jsx` (the post list) and `pages/About.jsx` (an `h1` that says `About Dev Blog`), build the route table in `App.jsx`, and switch the Layout navigation to `Link`. The preview should open on the About page.
