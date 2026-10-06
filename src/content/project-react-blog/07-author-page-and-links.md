---
title: 'Step 7: Author pages, links between pages and a 404'
summary: Add an author page that loads in parallel, link posts and authors together, and show a NotFound page for unknown addresses.
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
      import PostPage from './pages/PostPage';

      // Step 7 TODO 6: import AuthorPage and NotFound. Add a route for the path /authors/:id that passes
      //   params.id to AuthorPage as its id prop, and make findPage return the NotFound page instead of null
      //   when no route matches.

      // Demo only: when the preview starts without a route, open this one (an author page).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/authors/1';
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
  - name: pages/AuthorPage.jsx
    code: |
      // Step 7 TODO 4: write the author page here. It is a cousin of PostPage.
      //
      // - imports: React, PostCard, Loading, ErrorMessage, Link, useFetch, getUser, getUserPosts, pluralize
      // - a module-level async function loadAuthor(id): get the user and the user's posts at the same time with
      //   Promise.all (they do not depend on each other) and return { author, posts }
      // - function AuthorPage({ id }) uses useFetch(() => loadAuthor(id), [id]) and renders a fragment with:
      //     a Link (class "back-link", to "/") that says Back to all posts, Loading, ErrorMessage
      //     when data exists: a header (class "author-header") with the author's name in an h1 and a paragraph
      //     (class "lede") like  admin, London ; then a paragraph (class "count") like  2 posts by Ada Lovelace ;
      //     then the posts in a div with class "post-list", one PostCard per post (no author prop needed here)
      // - default export
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
  - name: pages/NotFound.jsx
    code: |
      // Step 7 TODO 5: write the NotFound page here.
      //
      // - function NotFound() returns a div with class "not-found" containing an h1 "Page not found",
      //   a paragraph (class "lede") that explains there is nothing at this address, and a Link to "/"
      //   that says Back to the home page (import Link from the router)
      // - default export
  - name: pages/PostPage.jsx
    code: |
      import React from 'react';
      import Loading from '../components/Loading';
      import ErrorMessage from '../components/ErrorMessage';
      import { Link } from '../router';
      import { useFetch } from '../hooks/useFetch';
      import { getPost, getUser } from '../lib/api';

      // Step 7 TODO 3: link to the author's page twice. Make the name in the byline a Link to '/authors/' + the
      //   author's id, and add a second paragraph at the end of the author box with a Link that says
      //   More posts by <author name>.

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

      // Step 7 TODO 2: turn the author's name in the byline into a Link to '/authors/' followed by the author's id.

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
      // Step 7 TODO 1: add export function getUserPosts(id) at the bottom. It asks for
      //   '/users/' + id + '/posts' (all the posts of one author) and goes through request() like the others.

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
check:
  dom:
    text:
      - Back to all posts
      - Ada Lovelace
      - admin, London
      - 2 posts by Ada Lovelace
      - Notes on the Engine
      - Loops and subroutines
    selectors:
      - .author-header h1
      - a.back-link
      - .post-list > .post-card:nth-child(2)
  code:
    - file: lib/api.js
      pattern: export\s+(async\s+)?function\s+getUserPosts\s*\(
      message: 'In lib/api.js write: export function getUserPosts(id) { ... }'
    - file: lib/api.js
      pattern: /posts['"]
      message: getUserPosts asks for '/users/' + id + '/posts'.
    - file: pages/AuthorPage.jsx
      pattern: export\s+default\s+AuthorPage
      message: 'End pages/AuthorPage.jsx with: export default AuthorPage;'
    - file: pages/AuthorPage.jsx
      pattern: Promise\.all\(
      message: 'The author and the posts do not depend on each other: load them with Promise.all.'
    - file: pages/NotFound.jsx
      pattern: export\s+default\s+NotFound
      message: 'End pages/NotFound.jsx with: export default NotFound;'
    - file: pages/PostPage.jsx
      pattern: /authors/
      message: Link the author name in PostPage to '/authors/' + the author id.
    - file: components/PostCard.jsx
      pattern: /authors/
      message: Link the byline in PostCard to '/authors/' + the author id.
    - file: App.jsx
      pattern: /authors/:id
      message: Add a route for /authors/:id to the route table.
    - file: App.jsx
      pattern: return\s*<NotFound\s*/>
      message: findPage should return <NotFound /> when no route matches.
hints:
  - 'AuthorPage is a cousin of PostPage: it receives id as a prop and uses useFetch. The difference is the loader: the author (getUser) and the author''s posts (getUserPosts) can be requested at the same time with Promise.all, because both only need the id from the URL.'
  - 'api.js: export function getUserPosts(id) { return request(''/users/'' + encodeURIComponent(id) + ''/posts''); }  Loader: const [author, posts] = await Promise.all([getUser(id), getUserPosts(id)]); return { author, posts };  Route: { path: ''/authors/:id'', render: (params) => <AuthorPage id={params.id} /> }. At the end of findPage return <NotFound /> instead of null.'
  - 'Byline in PostCard and PostPage: By <Link to={''/authors/'' + author.id}>{author.name}</Link>. Header of the author page: <header className="author-header"><h1>{data.author.name}</h1><p className="lede">{data.author.role}, {data.author.city}</p></header> then <p className="count">{pluralize(data.posts.length, ''post'')} by {data.author.name}</p> and the post-list with one PostCard per post.'
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
      import AuthorPage from './pages/AuthorPage';
      import NotFound from './pages/NotFound';

      // Demo only: when the preview starts without a route, open this one (an author page).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/authors/1';
      if (!window.location.hash) {
        window.location.hash = START_ROUTE;
      }

      // The route table: which page belongs to which path.
      const routes = [
        { path: '/', render: () => <Home /> },
        { path: '/about', render: () => <About /> },
        { path: '/posts/:id', render: (params) => <PostPage id={params.id} /> },
        { path: '/authors/:id', render: (params) => <AuthorPage id={params.id} /> },
      ];

      // Walk the table and return the page of the first route that matches.
      // When nothing matches, show the NotFound page.
      function findPage(path) {
        for (const route of routes) {
          const params = matchRoute(route.path, path);
          if (params) {
            return route.render(params);
          }
        }
        return <NotFound />;
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
  - name: pages/AuthorPage.jsx
    code: |
      import React from 'react';
      import PostCard from '../components/PostCard';
      import Loading from '../components/Loading';
      import ErrorMessage from '../components/ErrorMessage';
      import { Link } from '../router';
      import { useFetch } from '../hooks/useFetch';
      import { getUser, getUserPosts } from '../lib/api';
      import { pluralize } from '../lib/format';

      // The author and their posts do not depend on each other (we know the id from the URL),
      // so ask for both at the same time.
      async function loadAuthor(id) {
        const [author, posts] = await Promise.all([getUser(id), getUserPosts(id)]);
        return { author, posts };
      }

      function AuthorPage({ id }) {
        const { data, loading, error, reload } = useFetch(() => loadAuthor(id), [id]);

        return (
          <>
            <Link className="back-link" to="/">
              Back to all posts
            </Link>
            {loading && <Loading label="Loading author..." />}
            {error && <ErrorMessage message={error.message} onRetry={reload} />}
            {data && (
              <>
                <header className="author-header">
                  <h1>{data.author.name}</h1>
                  <p className="lede">
                    {data.author.role}, {data.author.city}
                  </p>
                </header>
                <p className="count">
                  {pluralize(data.posts.length, 'post')} by {data.author.name}
                </p>
                <div className="post-list">
                  {data.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}
          </>
        );
      }

      export default AuthorPage;
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
  - name: pages/NotFound.jsx
    code: |
      import React from 'react';
      import { Link } from '../router';

      // Shown when no route in the table matches the address.
      function NotFound() {
        return (
          <div className="not-found">
            <h1>Page not found</h1>
            <p className="lede">There is nothing at this address.</p>
            <Link to="/">Back to the home page</Link>
          </div>
        );
      }

      export default NotFound;
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
                <p className="post-meta">
                  By <Link to={'/authors/' + data.author.id}>{data.author.name}</Link>
                </p>
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
                  <p>
                    <Link to={'/authors/' + data.author.id}>More posts by {data.author.name}</Link>
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
            {author && (
              <p className="post-meta">
                By <Link to={'/authors/' + author.id}>{author.name}</Link>
              </p>
            )}
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

      export function getUserPosts(id) {
        return request('/users/' + encodeURIComponent(id) + '/posts');
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
  - q: Why can the author page use Promise.all while the post page could not?
    options:
      - Promise.all only works on author pages
      - Both requests only need the id from the URL, so neither waits for the other
      - The author endpoint is faster
    answer: 1
  - q: What does the NotFound page replace?
    options:
      - The Layout
      - The loading state
      - A blank page when no route matches the address
    answer: 2
  - q: How does a user get from the author page back to a post?
    options:
      - Every PostCard title is a Link to /posts/:id, so the cards on the author page work too
      - Through a page reload
      - With the browser's Back button only
    answer: 0
---
Pages that cannot reach each other are not a website. In this step you add the author page, connect posts and authors with links, and make sure a wrong address ends on a friendly page instead of a blank screen.

## Where we are

The home page lists posts. Each title links to a post page that shows the post and its author. The author's name is plain text, and an unknown address such as `#/nothing` shows an empty main area.

## What we will add, and why it matters

Real sites are webs of links: from a post to its author, from the author to their other posts, and back. Linking also reuses your components: the author page shows the same `PostCard` as the home page, so it automatically gets the links to the posts. Finally, a **catch-all route** handles every address you did not plan for. Without it, a mistyped address looks like a broken site.

## Guided walk-through

**1. One more API helper.** The server has an endpoint for "all posts of one user": `/users/1/posts`. Add `getUserPosts(id)` to `lib/api.js`, with the same `encodeURIComponent` care as before.

**2. The page.** `pages/AuthorPage.jsx` takes an `id` prop, like `PostPage`. This time both requests can start at once:

```js
async function loadAuthor(id) {
  const [author, posts] = await Promise.all([getUser(id), getUserPosts(id)]);
  return { author, posts };
}
```

Compare with step 6: there the second request needed data from the first (the post holds the author id), so they ran one after the other. Here nothing depends on anything, so doing them in parallel makes the page about twice as fast. Choosing between sequential and parallel is one of the most useful habits in data-driven UIs.

Render a back link, `Loading`/`ErrorMessage`, a `header.author-header` with the name (`h1`) and a line such as `admin, London`, then `2 posts by Ada Lovelace` and the cards in a `div.post-list`. Do not pass an `author` prop to the cards here: every post has the same author, so a byline would repeat the page heading.

**3. Link everything.** In `PostCard` and `PostPage`, wrap the author's name in `<Link to={'/authors/' + author.id}>`. Add a second link at the end of the author box, *More posts by ...*. In `App.jsx` add the route `{ path: '/authors/:id', ... }`.

**4. The NotFound page.** A small page in `pages/NotFound.jsx`: a heading, one sentence and a link home. Then change the last line of `findPage` from `return null;` to `return <NotFound />;`. Because the routes table is checked in order, the fallback is only reached when nothing matched.

Try it: change the starting route in `App.jsx` to `#/authors/99`. The server answers 404, `request` makes an error message of it, and the `ErrorMessage` box shows it with a retry button. Put `#/authors/1` back afterwards.

> **Watch out:**
> - `Element type is invalid ... got: undefined`: the new page file is missing `export default`, or the import in `App.jsx` uses braces.
> - A link that adds `#` twice (`to="#/authors/1"`) breaks the route: `Link` adds the hash itself.
> - Infinite "Loading author...": the dependency list is missing `[id]`, or the loader function is called instead of passed.
> - Wrapping the whole card in a `Link` would nest a link inside a link (the author link). Keep links on small, separate pieces.

> **Your turn:** Add `getUserPosts` to `lib/api.js`, write `pages/AuthorPage.jsx` (load the author and their posts with `Promise.all`) and `pages/NotFound.jsx`, add the `/authors/:id` route, make `findPage` return `<NotFound />` for unknown paths, and link the author's name in `PostCard` and `PostPage`. The preview opens on `#/authors/1`.
