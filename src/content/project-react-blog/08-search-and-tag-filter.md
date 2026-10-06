---
title: 'Step 8: Search and a tag filter that lives in the URL'
summary: Teach the router about query strings, add a title search and clickable tags, and extract a reusable TagList.
level: advanced
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
      import AuthorPage from './pages/AuthorPage';
      import NotFound from './pages/NotFound';

      // Demo only: when the preview starts without a route, open this one (the home page filtered by a tag).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/?tag=math';
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

      // Step 8 TODO 1: the router does not know about the query part of the hash yet. A route like "#/?tag=math"
      //   is treated as the path "/?tag=math", which matches nothing. Fix useRoute so that it only returns the
      //   part before the "?", and add a second exported function useQuery() that returns
      //   new URLSearchParams(...) of the part after the "?" (an empty string when there is none).
      //   Both can start from useHash(). A small private helper that splits the hash in two keeps it tidy.

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

      // Step 8: search box and tag filter.
      //
      // TODO 5 (this file): read the chosen tag from the URL:  const tag = useQuery().get('tag');
      //         (import useQuery from the router) and keep the search text in useState('').
      // TODO 6 (this file): when data exists, compute `visible`: the posts whose title includes the search text
      //         (compare lower-case versions, trim the text) and, if a tag is chosen, whose tags include it.
      //         Also compute the sorted list of all tags (a Set removes duplicates, flatMap collects the tags).
      // TODO 7 (this file): above the list render a controlled search input (class "search", with a label that has
      //         class "sr-only"), a row (class "filter-tags") with a Link per tag plus an "all" Link, and a status
      //         paragraph (class "result-count") that reads, for example,  Showing 2 of 6 posts tagged math
      //         Show the hint "No posts match your search." when nothing is visible.
      //         Tag links go to '/?tag=' + the tag. The chosen tag gets the class "tag active", the others "tag".

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

      // Step 8 TODO 4: replace the ul.tags list with TagList here as well (import it from the components folder).

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

      // Step 8 TODO 3: replace the ul.tags list with your new TagList component (import it from the same folder).

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
  - name: components/TagList.jsx
    code: |
      // Step 8 TODO 2: write the TagList component here.
      //
      // - imports: React and Link (from the router, one folder up)
      // - function TagList({ tags, activeTag }) returns a ul with class "tags" and one li per tag (with a key).
      //   Inside each li goes a Link whose class is "tag active" when the tag equals activeTag and "tag" otherwise,
      //   and whose destination is '/?tag=' followed by encodeURIComponent(tag). It shows the tag text.
      // - default export
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
check:
  dom:
    text:
      - 'Filter by tag:'
      - Showing 2 of 6 posts tagged math
      - Notes on the Engine
      - Orbits by hand
    selectors:
      - label[for="search"]
      - input#search.search[type="search"]
      - .filter-tags a.tag.active
      - .post-list > .post-card:nth-child(2)
      - .post-card ul.tags li a.tag
  code:
    - file: router.jsx
      pattern: export\s+function\s+useQuery\s*\(
      message: 'In router.jsx write: export function useQuery() { ... }'
    - file: router.jsx
      pattern: URLSearchParams
      message: useQuery returns new URLSearchParams(...) of the part after the question mark.
    - file: components/TagList.jsx
      pattern: export\s+default\s+TagList
      message: 'End components/TagList.jsx with: export default TagList;'
    - file: components/TagList.jsx
      pattern: \?tag=
      message: Every tag links to '/?tag=' + the tag.
    - file: components/PostCard.jsx
      pattern: <TagList
      message: Use <TagList tags={post.tags} /> in PostCard.
    - file: pages/PostPage.jsx
      pattern: <TagList
      message: Use <TagList ... /> in PostPage as well.
    - file: pages/Home.jsx
      pattern: useQuery\(\)
      message: Read the chosen tag with useQuery().get('tag').
    - file: pages/Home.jsx
      pattern: toLowerCase\(
      message: Compare lower-case versions so the search ignores capitals.
    - file: pages/Home.jsx
      pattern: \.filter\(
      message: Compute the visible posts with posts.filter(...).
    - file: pages/Home.jsx
      pattern: className=["']search["']
      message: The search input needs the class "search".
hints:
  - 'Two kinds of state, two homes. What the reader types in the search box is temporary: keep it in useState inside Home. The chosen tag should be shareable and survive a reload, so it lives in the URL: #/?tag=math. First fix the router: useRoute must ignore everything after the ? and a new useQuery() reads it.'
  - 'Router: split the hash text at the first ''?''. The part before it is the path (empty means ''/''), the part after it goes to new URLSearchParams(...). Home: const tag = useQuery().get(''tag''); const visible = data.posts.filter((post) => (!tag || post.tags.includes(tag)) && post.title.toLowerCase().includes(needle)); where needle = search.trim().toLowerCase().'
  - 'TagList.jsx: <ul className="tags">{tags.map((tag) => (<li key={tag}><Link className={tag === activeTag ? ''tag active'' : ''tag''} to={''/?tag='' + encodeURIComponent(tag)}>{tag}</Link></li>))}</ul>  In Home add the label (className="sr-only"), the controlled input, a div.filter-tags with Links, and <p className="result-count" role="status">Showing {visible.length} of {pluralize(data.posts.length, ''post'')}{tag ? '' tagged '' + tag : ''''}</p>'
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

      // Demo only: when the preview starts without a route, open this one (the home page filtered by a tag).
      // A real site does not need these lines (you will delete them in the last step).
      const START_ROUTE = '#/?tag=math';
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

      // Splits "#/?tag=math" into the path "/" and the search part "tag=math".
      function splitHash(hash) {
        const text = hash.replace(/^#/, '');
        const index = text.indexOf('?');
        const path = index === -1 ? text : text.slice(0, index);
        const search = index === -1 ? '' : text.slice(index + 1);
        return { path: path === '' ? '/' : path, search };
      }

      // The current path, without the query: "#/?tag=math" -> "/". An empty hash means "/".
      export function useRoute() {
        return splitHash(useHash()).path;
      }

      // The query as a URLSearchParams object: useQuery().get('tag') -> 'math' (or null).
      export function useQuery() {
        return new URLSearchParams(splitHash(useHash()).search);
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
      import React, { useState } from 'react';
      import PostCard from '../components/PostCard';
      import Loading from '../components/Loading';
      import ErrorMessage from '../components/ErrorMessage';
      import { Link, useQuery } from '../router';
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
        const [search, setSearch] = useState(''); // what the reader typed: lives in this component
        const tag = useQuery().get('tag'); // the chosen tag: lives in the URL, so it can be shared

        let content = null;
        if (data) {
          const needle = search.trim().toLowerCase();
          const visible = data.posts.filter(
            (post) => (!tag || post.tags.includes(tag)) && post.title.toLowerCase().includes(needle)
          );
          const allTags = [...new Set(data.posts.flatMap((post) => post.tags))].sort();

          content = (
            <>
              <div className="filters">
                <label htmlFor="search" className="sr-only">
                  Search posts by title
                </label>
                <input
                  id="search"
                  className="search"
                  type="search"
                  placeholder="Search by title"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="filter-tags">
                  <span>Filter by tag:</span>
                  <Link className={tag ? 'tag' : 'tag active'} to="/">
                    all
                  </Link>
                  {allTags.map((name) => (
                    <Link key={name} className={name === tag ? 'tag active' : 'tag'} to={'/?tag=' + encodeURIComponent(name)}>
                      {name}
                    </Link>
                  ))}
                </div>
              </div>

              <p className="result-count" role="status">
                Showing {visible.length} of {pluralize(data.posts.length, 'post')}
                {tag ? ' tagged ' + tag : ''}
              </p>

              {visible.length === 0 ? (
                <p className="hint">No posts match your search.</p>
              ) : (
                <div className="post-list">
                  {visible.map((post) => (
                    <PostCard key={post.id} post={post} author={data.authors[post.userId]} />
                  ))}
                </div>
              )}
            </>
          );
        }

        return (
          <>
            <h1>Latest posts</h1>
            {loading && <Loading label="Loading posts..." />}
            {error && <ErrorMessage message={error.message} onRetry={reload} />}
            {content}
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
      import TagList from '../components/TagList';
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
                <TagList tags={data.post.tags} />
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
      import TagList from './TagList';

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
            <TagList tags={post.tags} />
          </article>
        );
      }

      export default PostCard;
  - name: components/TagList.jsx
    code: |
      import React from 'react';
      import { Link } from '../router';

      // A list of tag chips. Every tag links to the home page filtered by that tag.
      // `activeTag` (optional) is highlighted.
      function TagList({ tags, activeTag }) {
        return (
          <ul className="tags">
            {tags.map((tag) => (
              <li key={tag}>
                <Link className={tag === activeTag ? 'tag active' : 'tag'} to={'/?tag=' + encodeURIComponent(tag)}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        );
      }

      export default TagList;
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
  - q: Why is the chosen tag stored in the URL while the search text is stored in useState?
    options:
      - URLs update faster than state
      - useState cannot store strings
      - A URL can be shared, bookmarked and reloaded; a half-typed search is temporary and private to this screen
    answer: 2
  - q: 'What does useQuery().get(''tag'') return for the address #/?tag=math, and for #/ ?'
    options:
      - '''math'' and null'
      - '''tag=math'' and '''''
      - true and false
    answer: 0
  - q: What is the benefit of extracting TagList from PostCard and PostPage?
    options:
      - The code gets longer
      - The same markup and behaviour (links to the tag filter) exist in one place and are reused by both
      - It makes the tags load from the API
    answer: 1
---
A blog with a handful of posts is easy to browse. With a hundred, readers need to find things. You will add a search box and a tag filter, and learn an important design rule: *where does each piece of state belong?*

## Where we are

The home page lists all posts. The post page and the cards show tags as plain pills. The router understands paths like `/posts/2`, but a query part such as `?tag=math` is not part of its vocabulary yet.

## What we will add, and why it matters

Some state should live in a component: the text typed in a search box matters only while you type. Other state should live in the **URL**: the chosen tag changes *which page you are looking at*. A URL can be copied into a chat, bookmarked, reloaded, and the Back button works. That is why filters, sorting and page numbers belong in the address in real apps. So we will have:

- `#/?tag=math`: the home page, filtered to the tag `math` (shareable)
- a search box that narrows the visible posts as you type (local state)
- clickable tags everywhere, from one reusable `TagList` component

The starter opens on `#/?tag=math` and you will see the "Page not found" page. That is the bug we will fix first.

## Guided walk-through

**1. Teach the router about `?`.** Right now the path is `/?tag=math`, which matches no route. Write a small helper in `router.jsx` that splits the hash at the first question mark:

```js
function splitHash(hash) {
  const text = hash.replace(/^#/, '');
  const index = text.indexOf('?');
  // path = before the "?" (or all of it), search = after it (or '')
  return { path: /* ... */, search: /* ... */ };
}
```

`useRoute()` returns only `path` (and `'/'` for an empty one). Add `export function useQuery()` returning `new URLSearchParams(search)`. `URLSearchParams` is built into the browser: `.get('tag')` returns the value, or `null` when the key is missing. Both hooks use `useHash()`, so both update on every `hashchange`.

**2. TagList.** Create `components/TagList.jsx` with props `tags` and an optional `activeTag`. It renders the `ul.tags`, and each tag is a `Link` to `'/?tag=' + encodeURIComponent(tag)`. Use it in `PostCard` and in `PostPage`: you wrote the same list twice, and now a third use (and every future improvement) costs nothing.

**3. Filter in Home.** Read `const tag = useQuery().get('tag')` and keep `const [search, setSearch] = useState('')`. When data exists, compute the posts to show:

```js
const needle = search.trim().toLowerCase();
const visible = data.posts.filter(
  (post) => (!tag || post.tags.includes(tag)) && post.title.toLowerCase().includes(needle)
);
```

Never modify `data.posts` itself: `filter` returns a new array and the original stays complete, so clearing the filter brings every post back. All tags: `[...new Set(data.posts.flatMap((post) => post.tags))].sort()`. A `Set` removes duplicates.

**4. The controls.** A *controlled* input (`value` plus `onChange`) with a hidden but real `<label htmlFor="search" className="sr-only">`: screen readers need a label, a placeholder is not one. Then a row of tag `Link`s (plus *all*, to `/`), and a status line `Showing 2 of 6 posts tagged math` with `role="status"`. When nothing matches, show a hint instead of an empty page.

> **Watch out:**
> - Calling `useQuery()` inside the `if (data)` block breaks the rules of hooks (`Rendered more hooks than during the previous render`). Call all hooks first, then branch.
> - `post.tags.include(tag)`: the method is `includes`, with an s.
> - A tag with a space or `&` breaks the URL unless you wrap it in `encodeURIComponent`. `URLSearchParams` decodes it again for you.
> - Comparing `post.title.includes(search)` without `toLowerCase()` makes "loops" miss "Loops".

> **Your turn:** Make `useRoute` ignore the query and add `useQuery`. Write `TagList` and use it in `PostCard` and `PostPage`. In `Home` add the search input (`input#search.search`, with its label), the tag links (`div.filter-tags`) and the `Showing X of Y posts` line, and filter the posts by title and tag. At `#/?tag=math` the preview must show `Showing 2 of 6 posts tagged math`.
