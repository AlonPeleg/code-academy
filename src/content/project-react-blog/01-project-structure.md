---
title: 'Step 1: Project structure, components in their own files'
summary: Split a tiny React app into files, using default and named exports and relative imports.
level: beginner
runner: react
files:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';

      // Step 1: split the app into files. Work through the TODOs in this order:
      //
      // TODO 1 (lib/format.js): write the helper function pluralize there.
      // TODO 2 (components/PostCard.jsx): write the PostCard component there.
      // TODO 3 (this file): import PostCard (a default import, no curly braces) and pluralize
      //         (a named import, in curly braces) from your own files, using relative paths.
      // TODO 4 (this file): inside <main>, under the h1, add
      //           <p className="count">  the number of posts, written with pluralize  </p>
      //           <div className="post-list">  one <PostCard post={...} /> for every post, made with map  </div>
      //         Every PostCard needs a key prop.

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
          </main>
        );
      }

      export default App;
  - name: components/PostCard.jsx
    code: |
      // TODO 2: write the PostCard component in this file.
      //
      // - Start with the React import (every .jsx file needs it).
      // - function PostCard({ post }) { ... } returns an article with class "post-card".
      // - Inside: an h2 with class "post-title" that shows the title, and a ul with class "tags" that has
      //   one li (class "tag", plus a key) for every tag of the post.
      // - Finish the file by exporting the component as the default export.
  - name: lib/format.js
    code: |
      // TODO 1: write and export the helper function pluralize(count, word).
      //
      // It returns the count, a space, the word, and an "s" at the end unless the count is exactly 1:
      //   pluralize(1, 'post') -> '1 post'
      //   pluralize(6, 'post') -> '6 posts'
      // Use a named export (put the word export in front of the function).
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
      - 6 posts
      - Notes on the Engine
      - Loops and subroutines
      - history
    selectors:
      - main.container h1
      - .post-list > article.post-card:nth-child(6)
      - article.post-card ul.tags li.tag
  code:
    - file: lib/format.js
      pattern: export\s+function\s+pluralize\s*\(
      message: 'In lib/format.js write: export function pluralize(count, word) { ... }'
    - file: components/PostCard.jsx
      pattern: export\s+default\s+PostCard
      message: 'End components/PostCard.jsx with: export default PostCard;'
    - file: App.jsx
      pattern: import\s+PostCard\s+from\s+['"]\./components/PostCard['"]
      message: 'In App.jsx add: import PostCard from ''./components/PostCard'';'
    - file: App.jsx
      pattern: import\s*\{\s*pluralize\s*\}\s*from\s*['"]\./lib/format['"]
      message: 'In App.jsx add: import { pluralize } from ''./lib/format'';'
    - file: App.jsx
      pattern: POSTS\.map\(
      message: Make one PostCard per post with POSTS.map(...).
    - file: App.jsx
      pattern: key=\{\s*post\.id\s*\}
      message: Every PostCard needs key={post.id}.
hints:
  - Three files, three jobs. lib/format.js exports a plain function, components/PostCard.jsx exports a component, and App.jsx imports both and uses them. Write the two small files first, then connect them in App.jsx.
  - 'A default export is imported without braces: import PostCard from ''./components/PostCard''. A named export is imported with braces: import { pluralize } from ''./lib/format''. The paths start with ./ because they are relative to App.jsx.'
  - 'In App, under the h1: <p className="count">{pluralize(POSTS.length, ''post'')}</p> and <div className="post-list">{POSTS.map((post) => (<PostCard key={post.id} post={post} />))}</div>. In PostCard.jsx return <article className="post-card"> with <h2 className="post-title">{post.title}</h2> and <ul className="tags"> that maps post.tags to <li key={tag} className="tag">{tag}</li>.'
solution:
  - name: App.jsx
    code: |
      import React from 'react';
      import './styles.css';
      import PostCard from './components/PostCard';
      import { pluralize } from './lib/format';

      // Step 1: sample posts. They have the same shape the API will send us later.
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
  - q: Why do we move PostCard into its own file instead of keeping everything in App.jsx?
    options:
      - React refuses to run files with more than one component
      - Small files with one job are easier to find, reuse and change without breaking other things
      - Imported files load faster than code in the same file
    answer: 1
  - q: How do you import something that was exported with a named export, like export function pluralize?
    options:
      - import pluralize from './lib/format'
      - require pluralize './lib/format'
      - import { pluralize } from './lib/format'
    answer: 2
    explain: Curly braces pick a named export by name. A default export is imported without braces, and you may give it any name.
  - q: What does the key prop on each PostCard do?
    options:
      - It lets React tell the cards apart when the list changes
      - It sets the CSS class of the card
      - It sorts the cards alphabetically
    answer: 0
---
Welcome to the biggest project of the academy. Over nine steps you will build **Dev Blog**: a multi-page React app with its own router, a data layer, reusable hooks and accessible pages, spread over a real folder structure. At the end you can download it as a Vite project and publish it.

## Where we are

We are at the very start. The preview shows a heading. Every step starts from the finished code of the previous step plus a few `TODO` comments, and `styles.css` is already complete, so you can focus on React. The sample posts live in `App.jsx` for now; the API arrives in step 4.

## What we will add, and why it matters

A tiny app can live in one file. A real app cannot: nobody can find anything in a 2,000-line file, and two people editing it at once means constant conflicts. So we split by **job**:

```
App.jsx                 the entry point: puts the pieces together
styles.css              the styles
components/PostCard.jsx one reusable piece of screen
lib/format.js           plain helper functions, no React
```

Later we add `pages/`, `hooks/` and a router, and you will see the same idea each time: one file, one job, and a clear name. The files you edit here are exactly the files of a real Vite project (the tool most React teams use). When you download the project in the last step, `App.jsx` becomes `src/App.jsx`, and Vite adds a small `main.jsx` that renders `<App />` into the page.

## Guided walk-through

**1. A helper with a named export.** A file only shares what it marks with `export`. In `lib/format.js` write a function that adds an "s" unless the count is 1:

```js
export function pluralize(count, word) {
  // return something like '6 posts'
}
```

A file can have many named exports. The importer must use the same name, in curly braces: `import { pluralize } from './lib/format';`. The `./` means "starting from this file's folder".

**2. A component with a default export.** `components/PostCard.jsx` describes one card. A component is a function that starts with a capital letter, receives **props** (the inputs, here `{ post }`) and returns JSX:

```jsx
import React from 'react';

function PostCard({ post }) {
  return <article className="post-card">...</article>;
}

export default PostCard;
```

Each file has at most one `export default`, and the importer picks any name: `import PostCard from './components/PostCard';`. Components conventionally use the default export, helpers use named exports. The `import React` line is needed in every file with JSX in this preview (it converts JSX with `React.createElement`). Modern Vite setups do not require it, but it does no harm.

**3. Use them in App.jsx.** Import both, show the count with `pluralize(POSTS.length, 'post')`, and turn the array into cards with `POSTS.map(...)`, one `<PostCard key={post.id} post={post} />` each. The `key` helps React tell the cards apart when a list changes.

> **Watch out:**
> - `Cannot find module './components/PostCard'`: check the path and the capital letters. Windows forgives `postcard`, but the server that hosts your site will not.
> - `Element type is invalid: expected a string... but got: undefined` usually means you imported with braces something that has a default export (or the other way around), or forgot `export default`.
> - Components must start with a capital letter. `<postCard />` is treated as an HTML tag.
> - Each file that contains JSX needs `import React from 'react';` at the top in this project.

> **Your turn:** Write `pluralize` in `lib/format.js` (named export) and `PostCard` in `components/PostCard.jsx` (default export: an `article.post-card` with an `h2.post-title` and a `ul.tags` with one `li.tag` per tag). In `App.jsx` import both, show `6 posts` in a `p.count`, and render all posts inside `div.post-list`, one `PostCard` each, with a `key`.
