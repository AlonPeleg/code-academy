---
title: 'Step 6: The post page and route parameters'
summary: Teach the router about parameters like /posts/:id and build a post page that loads one post and its author.
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

      // Step 6 TODO 5: import PostPage and add a route for '/posts/:id' to the table. Its render function
      //   receives the params object: pass params.id on to PostPage as its id prop.

      // Demo only: when the preview starts without a route, open this one (a post page).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/posts/2';
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

      // Step 6 TODO 1: teach matchRoute about parameters. A pattern part that starts with ":" (like ":id")
      //   matches any non-empty part of the path. Collect those parts into an object (the part's name
      //   without the colon is the key) and return that object instead of {}. Return null as before when
      //   something does not match. Use decodeURIComponent on the value, so "%20" becomes a space.

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
  - name: pages/PostPage.jsx
    code: |
      // Step 6 TODO 4: write the post page here.
      //
      // - imports: React, Loading, ErrorMessage, Link (from the router), useFetch, getPost and getUser
      // - a module-level async function loadPost(id): await getPost(id), then await getUser(post.userId)
      //   (the author id is only known after the first request), and return { post, author }
      // - function PostPage({ id }) calls useFetch(() => loadPost(id), [id]) so a new id loads a new post
      // - it renders an article with class "post-detail" containing:
      //     a Link (class "back-link", to "/") that says Back to all posts
      //     Loading while loading, ErrorMessage (with onRetry={reload}) on error
      //     when data exists: an h1 with the post title, a paragraph (class "post-meta") "By <author name>",
      //     a ul.tags with an li.tag per tag, and a section (class "author-box") with an h2
      //     "About the author" and a paragraph like  Grace Hopper, editor, based in New York.
      // - default export
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

      // Step 6 TODO 3: make the title a link to the post. Import Link from the router (one folder up) and wrap the
      //   title text inside the h2 in a Link whose destination is '/posts/' followed by the post id.

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
      // Step 6 TODO 2: add two more functions at the bottom: getPost(id) asks for '/posts/' + id and
      //   getUser(id) asks for '/users/' + id. Wrap the id in encodeURIComponent(...), like a careful developer.

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
      - Back to all posts
      - Nanoseconds
      - By Grace Hopper
      - About the author
      - Grace Hopper, editor, based in New York
      - hardware
    selectors:
      - article.post-detail h1
      - a.back-link[href="#/"]
      - section.author-box h2
      - article.post-detail ul.tags li.tag
  code:
    - file: router.jsx
      pattern: startsWith\(\s*['"]:['"]\s*\)
      message: In matchRoute, a pattern part that starts with ":" is a parameter.
    - file: router.jsx
      pattern: decodeURIComponent\(
      message: Decode the value with decodeURIComponent(...).
    - file: lib/api.js
      pattern: export\s+(async\s+)?function\s+getPost\s*\(
      message: 'In lib/api.js write: export function getPost(id) { ... }'
    - file: lib/api.js
      pattern: export\s+(async\s+)?function\s+getUser\s*\(
      message: 'In lib/api.js write: export function getUser(id) { ... }'
    - file: pages/PostPage.jsx
      pattern: export\s+default\s+PostPage
      message: 'End pages/PostPage.jsx with: export default PostPage;'
    - file: pages/PostPage.jsx
      pattern: await\s+getPost\(
      message: 'Load the post first: const post = await getPost(id);'
    - file: pages/PostPage.jsx
      pattern: getUser\(\s*post\.userId
      message: Then load its author with getUser(post.userId).
    - file: pages/PostPage.jsx
      pattern: \[\s*id\s*\]
      message: Pass [id] as the dependencies of useFetch so a new id loads a new post.
    - file: components/PostCard.jsx
      pattern: /posts/
      message: Make the title in PostCard a Link to '/posts/' + post.id.
    - file: App.jsx
      pattern: /posts/:id
      message: Add a route for the path /posts/:id to the route table in App.jsx.
hints:
  - 'A route like /posts/:id has a part that changes. In matchRoute, when a pattern part starts with '':'' store the matching part of the path in an object under the name without the colon, and return that object. Then the route table passes it on: render: (params) => <PostPage id={params.id} />.'
  - 'PostPage({ id }) uses useFetch(() => loadPost(id), [id]). loadPost is async: const post = await getPost(id); const author = await getUser(post.userId); return { post, author }; The second request needs the first one''s answer, so they cannot be started together. Render Loading, ErrorMessage or the article.'
  - 'matchRoute: const params = {}; for each i: if (expected.startsWith('':'')) { if (actual === '''') return null; params[expected.slice(1)] = decodeURIComponent(actual); } else if (expected !== actual) return null; ... return params;  PostCard: <h2 className="post-title"><Link to={''/posts/'' + post.id}>{post.title}</Link></h2>'
solution:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import Layout from './components/Layout';
      import { useRoute, matchRoute } from './router';
      import Home from './pages/Home';
      import About from './pages/About';
      import PostPage from './pages/PostPage';

      // Demo only: when the preview starts without a route, open this one (a post page).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/posts/2';
      if (!window.location.hash) {
        window.location.hash = START_ROUTE;
      }

      // The route table: which page belongs to which path.
      const routes = [
        { path: '/', render: () => <Home /> },
        { path: '/about', render: () => <About /> },
        { path: '/posts/:id', render: (params) => <PostPage id={params.id} /> },
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

      // Does this path look like the pattern? Parts that start with ":" are parameters and match anything.
      //   matchRoute('/posts/:id', '/posts/2')  ->  { id: '2' }
      //   matchRoute('/posts/:id', '/about')    ->  null
      export function matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        if (patternParts.length !== pathParts.length) {
          return null;
        }
        const params = {};
        for (let i = 0; i < patternParts.length; i++) {
          const expected = patternParts[i];
          const actual = pathParts[i];
          if (expected.startsWith(':')) {
            if (actual === '') {
              return null;
            }
            params[expected.slice(1)] = decodeURIComponent(actual);
          } else if (expected !== actual) {
            return null;
          }
        }
        return params;
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
  - name: pages/PostPage.jsx
    code: |
      import React from 'react';
      import Loading from '../components/Loading';
      import ErrorMessage from '../components/ErrorMessage';
      import { Link } from '../router';
      import { useFetch } from '../hooks/useFetch';
      import { getPost, getUser } from '../lib/api';

      // The author is only known once the post has arrived (the post holds the author's id),
      // so these two requests must run one after the other.
      async function loadPost(id) {
        const post = await getPost(id);
        const author = await getUser(post.userId);
        return { post, author };
      }

      // `id` comes from the URL: the route "/posts/:id" hands it over as a prop.
      function PostPage({ id }) {
        const { data, loading, error, reload } = useFetch(() => loadPost(id), [id]);

        return (
          <article className="post-detail">
            <Link className="back-link" to="/">
              Back to all posts
            </Link>
            {loading && <Loading label="Loading post..." />}
            {error && <ErrorMessage message={error.message} onRetry={reload} />}
            {data && (
              <>
                <h1>{data.post.title}</h1>
                <p className="post-meta">By {data.author.name}</p>
                <ul className="tags">
                  {data.post.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>
                <section className="author-box">
                  <h2>About the author</h2>
                  <p>
                    {data.author.name}, {data.author.role}, based in {data.author.city}.
                  </p>
                </section>
              </>
            )}
          </article>
        );
      }

      export default PostPage;
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
      import { Link } from '../router';

      // One post, shown as a card. `author` is optional: when we have it, we show a byline.
      function PostCard({ post, author }) {
        return (
          <article className="post-card">
            <h2 className="post-title">
              <Link to={'/posts/' + post.id}>{post.title}</Link>
            </h2>
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

      export function getPost(id) {
        return request('/posts/' + encodeURIComponent(id));
      }

      export function getUser(id) {
        return request('/users/' + encodeURIComponent(id));
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
  - q: What does matchRoute('/posts/:id', '/posts/7') return after this step?
    options:
      - '{ id: ''7'' }'
      - '''7'''
      - 'true'
    answer: 0
  - q: Why does loadPost fetch the post first and the author second, instead of using Promise.all?
    options:
      - Promise.all cannot handle two requests
      - The author's id is stored in the post, so we only know which author to request after the post has arrived
      - The server only answers one request at a time
    answer: 1
  - q: Why is [id] passed as the dependency list of useFetch in PostPage?
    options:
      - To make the hook run only once ever
      - To give the page a unique key
      - So that going from /posts/1 to /posts/2 loads the new post
    answer: 2
---
Lists are only half of a blog: readers click a title and expect the whole post. In this step the router learns about **parameters**, and you build the first page that depends on the address.

## Where we are

The home page lists posts from the API, with a loading state and an error state, thanks to `useFetch`. Titles are plain text and the router only understands fixed paths like `/` and `/about`.

## What we will add, and why it matters

A blog cannot have one route per post, because new posts appear every day. Instead it has **one route with a hole in it**: `/posts/:id`. The part starting with a colon is a *parameter*: it matches anything and gives the page its value. React Router, Next.js and Express all use this same notation, so what you learn here transfers directly.

The page then needs two things from the API: the post (`/posts/2`) and its author (`/users/2`), because the post only stores the author's id.

## Guided walk-through

**1. Parameters in `matchRoute`.** Walk the two arrays of parts as before, but when the pattern part starts with `:` it matches anything (except an empty part) and is saved:

```js
if (expected.startsWith(':')) {
  params[expected.slice(1)] = decodeURIComponent(actual);
}
```

`slice(1)` removes the colon, so `':id'` becomes the key `id`. `decodeURIComponent` turns `%20` back into a space, in case a value contains special characters. At the end `return params`, which is `{ id: '2' }` for `/posts/2`. Note that the value is a string.

**2. Two more API helpers.** In `lib/api.js` add `getPost(id)` and `getUser(id)`. Wrap the id in `encodeURIComponent` so a strange value can never change the shape of the URL.

**3. The page.** `pages/PostPage.jsx` receives the id as a **prop**; it does not read the address itself. That keeps the page easy to test and reuse: routing is the router's concern. A module-level async function loads the two dependent requests in order:

```js
async function loadPost(id) {
  const post = await getPost(id);
  const author = await getUser(post.userId);
  return { post, author };
}
```

Then `useFetch(() => loadPost(id), [id])`. Because `id` is in the dependency list, moving from `/posts/1` to `/posts/2` loads the second post. Render a `Link` back to `/`, then `Loading`, `ErrorMessage`, or the article: title in an `h1`, byline, tags, and an `author-box` section with the author's name, role and city.

**4. The route and the links.** Add `{ path: '/posts/:id', render: (params) => <PostPage id={params.id} /> }` to the route table. In `PostCard`, make the title a `Link` to `'/posts/' + post.id`, so every card leads to its page.

The starter opens the preview on `#/posts/2` so you can see your page straight away. If you change the number to `99` you get the error component: the server answers 404 and `request` turns it into a readable message.

> **Watch out:**
> - `Cannot read properties of undefined (reading 'name')`: you rendered `data.author.name` before the data arrived. Guard with `data && ...`.
> - Route order matters when patterns overlap: `/posts/new` listed after `/posts/:id` would never be reached.
> - Parameters are strings. Comparing `post.id === params.id` fails because `2 !== '2'`.
> - Forgetting `[id]` in `useFetch` shows the old post after the address changes.

> **Your turn:** Make `matchRoute` support `:param` parts. Add `getPost` and `getUser` to `lib/api.js`, write `pages/PostPage.jsx` (title, `By <author>`, tags, and an author box that says for example `Grace Hopper, editor, based in New York`), add the `/posts/:id` route, and turn the titles in `PostCard` into links.
