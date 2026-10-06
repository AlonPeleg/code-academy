---
title: 'Step 2: A shared Layout with header, nav and footer'
summary: Build a Layout component that wraps every page, using the children prop.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import PostCard from './components/PostCard';
      import { pluralize } from './lib/format';

      // Step 2: put a shared Layout around the page.
      //
      // TODO 2 (components/Layout.jsx): write the Layout component first.
      // TODO 3 (this file): import it, then change App so that everything it returns is wrapped in your Layout component.
      //         The old <main> goes away (Layout draws its own main). Inside Layout keep the posts, but
      //         change the h1 to say  Latest posts  (the brand "Dev Blog" now lives in the header).

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
          <main className="container content">
            <h1>Dev Blog</h1>
            <p className="count">{pluralize(POSTS.length, 'post')}</p>
            <div className="post-list">
              {POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </main>
        );
      }

      export default App;
  - name: components/Layout.jsx
    code: |
      // TODO 1: write the Layout component in this file.
      //
      // - function Layout({ children }) { ... }  (do not forget the React import at the top)
      // - It returns three siblings. Wrap them in a fragment: <> ... </>
      //     1. <header className="site-header"> with <div className="container"> inside. In the div:
      //          a link with class "brand" (href="#/") that says Dev Blog, and
      //          <nav className="site-nav" aria-label="Main"> with two links: Home (href="#/") and About (href="#/about")
      //     2. <main className="container content" id="main"> that shows {children}
      //     3. <footer className="site-footer"> with <div className="container"> and a paragraph, for example
      //          Dev Blog, built with React. The posts come from the practice API.
      // - Finish with the default export.
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
      - Dev Blog
      - Latest posts
      - Home
      - About
      - built with React
      - Notes on the Engine
    selectors:
      - header.site-header nav.site-nav a
      - main#main.content
      - footer.site-footer
      - .post-list > .post-card:nth-child(6)
  code:
    - file: components/Layout.jsx
      pattern: children
      message: Layout should receive the children prop and show it inside the main element.
    - file: components/Layout.jsx
      pattern: export\s+default\s+Layout
      message: 'End components/Layout.jsx with: export default Layout;'
    - file: App.jsx
      pattern: import\s+Layout\s+from\s+['"]\./components/Layout['"]
      message: 'In App.jsx add: import Layout from ''./components/Layout'';'
    - file: App.jsx
      pattern: <Layout>[\s\S]*</Layout>
      message: Wrap the content that App returns in the Layout element.
hints:
  - 'Layout is a component that draws the same frame around every page. The page itself arrives as the children prop: function Layout({ children }) and {children} where the page should appear.'
  - 'Layout returns three siblings, so wrap them in a fragment (<> ... </>): a header with nav, a main (id="main", classes "container content") that shows {children}, and a footer. In App, remove the old main and wrap the page content in <Layout> ... </Layout>.'
  - 'In Layout.jsx: <header className="site-header"><div className="container"><a className="brand" href="#/">Dev Blog</a><nav className="site-nav" aria-label="Main"><a href="#/">Home</a><a href="#/about">About</a></nav></div></header><main className="container content" id="main">{children}</main><footer className="site-footer"><div className="container"><p>Dev Blog, built with React. The posts come from the practice API.</p></div></footer>'
solution:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import Layout from './components/Layout';
      import PostCard from './components/PostCard';
      import { pluralize } from './lib/format';

      // Step 2: the same posts, now inside the shared Layout.
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
  - name: components/Layout.jsx
    code: |
      import React from 'react';

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
quiz:
  - q: What is the special children prop?
    options:
      - A list of all components inside the project
      - The child components of a class in object-oriented programming
      - Whatever you write between the opening and closing tag of a component
    answer: 2
  - q: Why does Layout wrap its output in <> ... </>?
    options:
      - A component must return one root element, and a fragment groups siblings without adding an extra HTML tag
      - It turns the JSX into plain HTML
      - It makes the page load faster
    answer: 0
  - q: What is the main benefit of a shared Layout component?
    options:
      - Each page has to repeat the header and footer, but it is faster
      - The header, navigation and footer are written once and every page gets them
      - It is required by the browser for the router to work
    answer: 1
    explain: Change the navigation in one file and every page changes. That is the point of composition.
---
Almost every website has a header, a navigation and a footer that look the same on every page. In this step you write them once, in a `Layout` component, and wrap every page in it.

## Where we are

The app shows the six sample posts, built from `PostCard` and `pluralize`. Everything lives inside a single `<main>` in `App.jsx`. There is no header, no navigation and no footer yet.

## What we will add, and why it matters

If you copy a header into every page file, then renaming a menu item means editing ten files and forgetting one. React solves this with **composition**: components that contain other components. `Layout` draws the frame, and the page is passed in as the special **`children` prop**. This is how almost every React app (including those using react-router, Next.js or Remix) is organised.

```jsx
<Layout>
  <h1>Latest posts</h1>
</Layout>
```

Everything written between `<Layout>` and `</Layout>` reaches the component as `children`.

## Guided walk-through

**1. Create the component.** In `components/Layout.jsx` write `function Layout({ children })`. It needs three parts that sit next to each other, so return them inside a fragment, the empty tag `<> ... </>`. A fragment groups elements without adding an extra `div` to the page.

**2. The header.** Use `<header className="site-header">` with a `div.container` inside (the container keeps the content centred and at most 880px wide). Put the brand (a link with class `brand`) and a `<nav className="site-nav" aria-label="Main">` with two links. The `aria-label` tells screen reader users what this navigation is for, which matters because a page can have several.

```jsx
<nav className="site-nav" aria-label="Main">
  <a href="#/">Home</a>
  <a href="#/about">About</a>
</nav>
```

The `href="#/about"` addresses start with `#`. That is the **hash**: the part of the URL after `#` never makes the browser load a new page, which is what our router will use in the next step. Right now the links change the address but nothing listens yet, so the page stays the same. That is expected.

**3. The main area and the footer.** The page goes in `<main className="container content" id="main">{children}</main>`. There must be exactly one `main` per page, and it holds the unique content: this is a landmark, which lets keyboard users jump straight to it. The footer is a `footer.site-footer` with a `div.container` and a short sentence such as *Dev Blog, built with React.*

**4. Use it in App.** Import `Layout`, remove the old `<main>` (Layout draws its own) and return `<Layout> ... </Layout>` around the heading, the count and the post list. Change the `h1` to `Latest posts`, because the brand "Dev Blog" now lives in the header.

> **Watch out:**
> - Nothing appears between the header and footer: you forgot `{children}` in Layout. Without it the page content is silently dropped.
> - `Adjacent JSX elements must be wrapped in an enclosing tag`: you return several siblings without a fragment or a parent element.
> - Two `main` elements on one page: remove the one that is left in `App.jsx`.
> - Using `class` instead of `className` in JSX: React warns about it, and the styles may not apply.

> **Your turn:** Create `components/Layout.jsx` with a header (`header.site-header` with the brand link and `nav.site-nav` containing the links Home and About), `main#main.container.content` showing `children`, and a footer (`footer.site-footer`) whose text contains `built with React`. In `App.jsx` wrap the page in `<Layout>` and use the heading `Latest posts`.
