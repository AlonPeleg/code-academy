---
title: 'Step 9: Accessibility, an error boundary and shipping it'
summary: Make navigation accessible, set page titles, catch crashes with an error boundary, and prepare the blog for publishing.
level: advanced
export:
  kind: vite-react
  name: dev-blog
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

      // Step 9 TODO 5: (a) delete the demo lines below: the START_ROUTE constant and the if statement.
      //   (b) import ErrorBoundary and wrap the page: put the findPage(path) call inside an ErrorBoundary element
      //       inside the Layout. Give the ErrorBoundary the prop key={path}, so every page starts fresh.

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

      // Step 9 TODO 4: call the page title hook at the top of the component (import it from the hooks folder): 'About'. Do the same in NotFound ('Page not found'), so every page has its own title.

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

      // Step 9 TODO 4: call the page title hook at the top of the component (import it from the hooks folder): the title is the author's name once data has arrived, otherwise 'Author'.
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

      // Step 9 TODO 4: call the page title hook at the top of the component (import it from the hooks folder): the title is 'Latest posts'.

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

      // Step 9 TODO 4: call the page title hook at the top of the component (import it from the hooks folder): the title is the post title once data has arrived, otherwise 'Loading post...'.
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
  - name: components/ErrorBoundary.jsx
    code: |
      // TODO 2: write the ErrorBoundary here. Error boundaries must be classes.
      //
      // - a class named ErrorBoundary that extends React.Component, with a constructor that sets this.state = { error: null }
      // - a static method getDerivedStateFromError(error) that returns { error: error }
      // - a method componentDidCatch(error, info) that logs the problem with console.error
      // - render(): when this.state.error is set, return a div (class "error", role="alert") with an h2
      //   "Something broke on this page" and the error message; otherwise return this.props.children
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

      // Step 9 TODO 3: make the layout accessible.
      //  a) Write a small NavLink component in this file: it takes to and children, reads the current path with
      //     useRoute() (import it from the router) and renders a Link whose aria-current prop is 'page' when the
      //     path equals to, and undefined otherwise. Use NavLink for Home and About.
      //  b) Add a ref to the main element (useRef(null), plus tabIndex={-1} and ref={mainRef} on the main)
      //     and, in a useEffect that depends on the path, call mainRef.current.focus() after every page change
      //     (not on the very first render: remember that with a second ref).
      //  c) First thing inside the fragment add a skip link: an anchor with class "skip-link", href="#main",
      //     that says Skip to content. Its onClick calls event.preventDefault() and focuses the main element.

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
  - name: hooks/usePageTitle.js
    code: |
      // TODO 1: write the usePageTitle hook in this file.
      //
      // - import { useEffect } from 'react';
      // - export function usePageTitle(title) { ... } runs a useEffect that sets document.title to
      //   the title followed by " | Dev Blog" (or just "Dev Blog" when there is no title).
      //   The dependency array is [title].
  - name: lib/api.js
    code: |
      // Step 9 TODO 6: show the newest posts first. Ask the server to sort: getPosts should request
      //   '/posts?_sort=id&_order=desc'.

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
      - Skip to content
      - Latest posts
      - Showing 6 of 6 posts
      - Loops and subroutines
    selectors:
      - a.skip-link
      - nav.site-nav a[aria-current="page"]
      - main#main[tabindex="-1"]
      - .post-list > .post-card:nth-child(6)
  code:
    - file: hooks/usePageTitle.js
      pattern: export\s+function\s+usePageTitle\s*\(
      message: 'In hooks/usePageTitle.js write: export function usePageTitle(title) { ... }'
    - file: hooks/usePageTitle.js
      pattern: document\.title\s*=
      message: The hook sets document.title inside useEffect.
    - file: pages/Home.jsx
      pattern: usePageTitle\(
      message: Call usePageTitle('Latest posts') in Home.
    - file: pages/PostPage.jsx
      pattern: usePageTitle\(
      message: Call usePageTitle(...) in PostPage with the post title.
    - file: components/Layout.jsx
      pattern: aria-current
      message: Mark the link of the current page with aria-current="page".
    - file: components/Layout.jsx
      pattern: \.focus\(\)
      message: Move the focus to the main element with mainRef.current.focus().
    - file: components/ErrorBoundary.jsx
      pattern: getDerivedStateFromError
      message: An error boundary needs static getDerivedStateFromError(error).
    - file: components/ErrorBoundary.jsx
      pattern: componentDidCatch
      message: Log the crash in componentDidCatch(error, info).
    - file: components/ErrorBoundary.jsx
      pattern: export\s+default\s+ErrorBoundary
      message: 'End components/ErrorBoundary.jsx with: export default ErrorBoundary;'
    - file: App.jsx
      pattern: <ErrorBoundary[\s\S]*findPage\(
      message: Wrap findPage(path) in an ErrorBoundary element inside the Layout.
    - file: App.jsx
      pattern: ^(?![\s\S]*START_ROUTE)
      message: 'Delete the demo START_ROUTE lines: a real site starts on its home page.'
    - file: lib/api.js
      pattern: _order=desc
      message: 'Ask the server for the newest posts first: ''/posts?_sort=id&_order=desc''.'
hints:
  - Four small jobs. A hook usePageTitle that sets document.title; NavLink + aria-current in Layout; a ref on main with a focus() call after every page change plus a skip link; and an ErrorBoundary class around the page. Finally delete the demo START_ROUTE lines in App.jsx.
  - 'Layout: function NavLink({ to, children }) { const path = useRoute(); return <Link to={to} aria-current={path === to ? ''page'' : undefined}>{children}</Link>; }  const mainRef = useRef(null); <main id="main" tabIndex={-1} ref={mainRef}>  and useEffect(() => { ... mainRef.current.focus(); }, [path]) (skip the first run with a second ref). Skip link: <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current.focus(); }}>Skip to content</a>'
  - 'class ErrorBoundary extends React.Component { constructor(props) { super(props); this.state = { error: null }; } static getDerivedStateFromError(error) { return { error }; } componentDidCatch(error, info) { console.error(error, info.componentStack); } render() { if (this.state.error) { return <div className="error" role="alert">...</div>; } return this.props.children; } }   App: <Layout><ErrorBoundary key={path}>{findPage(path)}</ErrorBoundary></Layout>'
solution:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import Layout from './components/Layout';
      import ErrorBoundary from './components/ErrorBoundary';
      import { useRoute, matchRoute } from './router';
      import Home from './pages/Home';
      import About from './pages/About';
      import PostPage from './pages/PostPage';
      import AuthorPage from './pages/AuthorPage';
      import NotFound from './pages/NotFound';

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
        return (
          <Layout>
            {/* key={path}: moving to another page gives the boundary a fresh start after a crash */}
            <ErrorBoundary key={path}>{findPage(path)}</ErrorBoundary>
          </Layout>
        );
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
      import { usePageTitle } from '../hooks/usePageTitle';

      function About() {
        usePageTitle('About');
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
      import { usePageTitle } from '../hooks/usePageTitle';
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
        usePageTitle(data ? data.author.name : 'Author');

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
      import { usePageTitle } from '../hooks/usePageTitle';
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
        usePageTitle('Latest posts');
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
      import { usePageTitle } from '../hooks/usePageTitle';

      // Shown when no route in the table matches the address.
      function NotFound() {
        usePageTitle('Page not found');
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
      import { usePageTitle } from '../hooks/usePageTitle';
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
        usePageTitle(data ? data.post.title : 'Loading post...');

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
  - name: components/ErrorBoundary.jsx
    code: |
      import React from 'react';

      // An error boundary catches crashes while rendering its children and shows a fallback instead of a blank page.
      // It must be a class: there is no hook for this yet.
      class ErrorBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { error: null };
        }

        // React calls this when a child throws while rendering. The returned object becomes the new state.
        static getDerivedStateFromError(error) {
          return { error: error };
        }

        // A good place to log the crash (a real app would send it to an error-tracking service).
        componentDidCatch(error, info) {
          console.error('Dev Blog crashed while rendering:', error, info.componentStack);
        }

        render() {
          if (this.state.error) {
            return (
              <div className="error" role="alert">
                <h2>Something broke on this page</h2>
                <p>{this.state.error.message}</p>
                <p>Try another page from the menu, or reload.</p>
              </div>
            );
          }
          return this.props.children;
        }
      }

      export default ErrorBoundary;
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
      import React, { useEffect, useRef } from 'react';
      import { Link, useRoute } from '../router';

      // A navigation link that knows whether it points at the page we are on.
      // aria-current="page" tells screen readers (and our CSS) which link is the current one.
      function NavLink({ to, children }) {
        const path = useRoute();
        return (
          <Link to={to} aria-current={path === to ? 'page' : undefined}>
            {children}
          </Link>
        );
      }

      function Layout({ children }) {
        const path = useRoute();
        const mainRef = useRef(null);
        const firstRender = useRef(true);

        // After the reader moves to another page, move the keyboard focus to the new content.
        // (Skip the very first render: the page has just loaded, focus is already where it should be.)
        useEffect(() => {
          if (firstRender.current) {
            firstRender.current = false;
            return;
          }
          mainRef.current.focus();
        }, [path]);

        // The skip link must not change the hash (the router would see a route "#main"), so we focus by hand.
        function skipToContent(event) {
          event.preventDefault();
          mainRef.current.focus();
        }

        return (
          <>
            <a className="skip-link" href="#main" onClick={skipToContent}>
              Skip to content
            </a>

            <header className="site-header">
              <div className="container">
                <Link className="brand" to="/">
                  Dev Blog
                </Link>
                <nav className="site-nav" aria-label="Main">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/about">About</NavLink>
                </nav>
              </div>
            </header>

            <main className="container content" id="main" tabIndex={-1} ref={mainRef}>
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
  - name: hooks/usePageTitle.js
    code: |
      import { useEffect } from 'react';

      // Sets the browser tab title (and the title that screen readers announce) for the current page.
      //   usePageTitle('Notes on the Engine') -> "Notes on the Engine | Dev Blog"
      export function usePageTitle(title) {
        useEffect(() => {
          document.title = title ? title + ' | Dev Blog' : 'Dev Blog';
        }, [title]);
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
        // Newest first: the server sorts for us.
        return request('/posts?_sort=id&_order=desc');
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
  - q: What does aria-current="page" on a navigation link do?
    options:
      - It tells assistive technology which link points at the current page (our CSS also uses it to highlight it)
      - It stops the router from handling the link
      - It makes the link open in a new tab
    answer: 0
  - q: Why must an error boundary be a class component?
    options:
      - Classes are faster
      - React only offers the error hooks getDerivedStateFromError and componentDidCatch on classes
      - Function components cannot return JSX
    answer: 1
    explain: Everything else in your app can be function components and hooks. The boundary is the one place where a class is still required.
  - q: Why does the skip link call event.preventDefault() and focus the main element by hand?
    options:
      - Because anchors cannot receive focus
      - To make the page scroll to the top
      - A normal click on href="#main" would change the hash, and our router would treat "main" as a route
    answer: 2
---
The blog works. Now make it good enough to put in front of other people: usable with a keyboard and a screen reader, resilient when something crashes, and ready to publish.

## Where we are

Home, post, author, About and NotFound pages, a router, a data layer and filters: the whole app is there. What is still missing is the layer of care that separates a tutorial from something you could show an employer.

## What we will add, and why it matters

Four finishing touches, each small and each very visible to real users:

1. **Page titles.** The browser tab, history and screen readers all use `document.title`. Right now every page is called the same.
2. **Navigation that knows where you are.** `aria-current="page"` marks the current link for assistive technology, and our CSS highlights it.
3. **Focus and a skip link.** In a normal website a page load resets keyboard focus. A single-page app never reloads, so *you* must move focus after navigating, otherwise a keyboard user stays on the link they pressed. A skip link lets them jump over the header.
4. **An error boundary.** If a component throws while rendering, React unmounts the whole tree and leaves a blank page. A boundary catches the crash and shows a message instead.

## Guided walk-through

**1. `hooks/usePageTitle.js`.** A hook with one effect: `document.title = title + ' | Dev Blog'`, with `[title]` as dependency. Call it at the top of each page, for example `usePageTitle(data ? data.post.title : 'Loading post...')`, and in the others with a fixed title. A hook call must happen on every render, so it comes *before* any early return.

**2. NavLink and focus in `Layout`.** `NavLink` reads the path and passes `aria-current={path === to ? 'page' : undefined}` to `Link` (that is why Link forwards `...rest`). For focus, give `<main>` `tabIndex={-1}` (focusable from code, but not a tab stop) and a ref. Focus it in an effect that depends on the path, but skip the first render, because the page has just loaded:

```jsx
useEffect(() => {
  if (firstRender.current) { firstRender.current = false; return; }
  mainRef.current.focus();
}, [path]);
```

The skip link is `<a className="skip-link" href="#main">` shown only while focused (the CSS handles it). Its `onClick` calls `event.preventDefault()` and focuses `main`, because letting the hash change would make the router look for a route called `main`.

**3. `components/ErrorBoundary.jsx`.** The one class in the project. `static getDerivedStateFromError(error)` stores the error in state, `componentDidCatch` logs it, and `render` shows a fallback when there is an error and `this.props.children` otherwise. Wrap `findPage(path)` with `<ErrorBoundary key={path}>`: the `key` gives every page a fresh boundary, so after a crash the next click recovers. To test it, temporarily write `throw new Error('boom')` in a page.

**4. Last cleanups.** Delete the demo lines in `App.jsx` (the preview helper, not needed in a real site) and ask the server for `/posts?_sort=id&_order=desc` so the newest post comes first.

## Make it yours and publish

- [ ] Replace the placeholders: blog name, About text, footer. Tell your own story.
- [ ] Press Tab through every page. Can you see where the focus is? Does the skip link work?
- [ ] Test on a phone, or in Chrome DevTools device mode.
- [ ] Run **Lighthouse** in Chrome DevTools and look at Accessibility and SEO.
- [ ] Use **Download project**. It is a Vite project: run `npm install`, then `npm run dev`, and `npm run build` for the files to upload. Follow its README to publish on GitHub Pages, Netlify or Vercel.
- [ ] Hash routing needs no special server settings, which makes it ideal for GitHub Pages.

## What to build next

Replace the practice API with your own (change `API` in one file). Let signed-in users write posts with `POST /posts`. Add pagination with `_page` and `_limit`, a dark mode toggle, or switch the router for react-router: you now know exactly what it does for you.

> **Watch out:**
> - `Rendered fewer hooks than expected`: you called a hook after an early `return`.
> - Error boundaries do not catch errors in event handlers or in `fetch` calls. Those still need `try/catch` (our `request` and `useFetch` handle them).
> - `document.title` stays on "Loading post..." if you forget the dependency array.

> **Your turn:** Write `usePageTitle` and use it in your pages. In `Layout` add `NavLink` with `aria-current`, the focus handling and a skip link. Write `ErrorBoundary` and wrap the page in `App.jsx`. Delete the demo `START_ROUTE` lines and sort the posts newest first. The preview then opens on the home page showing a highlighted Home link and `Showing 6 of 6 posts`.
