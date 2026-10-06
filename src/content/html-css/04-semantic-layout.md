---
title: Page structure with semantic tags
summary: Use header, nav, main and footer to give your page meaningful structure.
level: beginner
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <body>
          <div>
            <h1>Maya's Bakery</h1>
            <div>
              <a href="#bread">Bread</a>
              <a href="#cakes">Cakes</a>
            </div>
          </div>

          <div>
            <h2>Fresh every morning</h2>
            <p>We bake bread and cakes before sunrise.</p>
          </div>

          <div>
            <p>Open daily from 7am to 5pm.</p>
          </div>

          <!-- Replace the three outer <div> tags (and the inner link
               <div>) with header, nav, main and footer. -->
        </body>
      </html>
check:
  dom:
    selectors: ["header h1", "header nav a", "main h2", "main p", "footer p"]
hints:
  - "The page already has the right content. You only need to change the container tags so they say what each part is."
  - "Swap the top div for header, the div around the links for nav, the middle div for main and the last div for footer. Opening and closing tags must match."
  - "<header> <h1>...</h1> <nav> links </nav> </header>  then <main> h2 and p </main>  then <footer> <p>...</p> </footer>"
solution:
  - code: |
      <!doctype html>
      <html>
        <body>
          <header>
            <h1>Maya's Bakery</h1>
            <nav>
              <a href="#bread">Bread</a>
              <a href="#cakes">Cakes</a>
            </nav>
          </header>

          <main>
            <h2>Fresh every morning</h2>
            <p>We bake bread and cakes before sunrise.</p>
          </main>

          <footer>
            <p>Open daily from 7am to 5pm.</p>
          </footer>
        </body>
      </html>
quiz:
  - q: What is the main benefit of semantic tags like header and footer?
    options: ["They make the page look different automatically", "They describe the purpose of each part to browsers, search engines and screen readers", "They load faster than div"]
    answer: 1
  - q: Which tag is for the page's main navigation links?
    options: ["<menu>", "<links>", "<nav>"]
    answer: 2
  - q: How many <main> elements should a page normally have?
    options: ["One", "As many as you like", "None, it is deprecated"]
    answer: 0
    explain: <main> marks the unique central content of the page, so you should only have one.
  - q: Where do the title and logo of a page usually go?
    options: ["<footer>", "<header>", "<aside>"]
    answer: 1
---

So far everything we wrote has been a heading, a paragraph or a list. Real pages have *parts*: a top banner, a menu, the main content and a bottom strip. In this lesson you will learn the HTML tags that name those parts.

## The problem with div

The `<div>` tag is a generic box. It does not mean anything. A page made only of divs is like a house where every room is just labelled "room". It works, but nobody (including a search engine or a person using a screen reader) can tell what each part is for.

**Semantic** tags are tags with a meaning. They look the same as a `<div>` by default, but they say what the content *is*.

## The most useful semantic tags

| Tag | What it is for |
| --- | --- |
| `<header>` | The introduction at the top: the site name, logo, maybe the menu |
| `<nav>` | A group of navigation links |
| `<main>` | The central, unique content of the page (use only one) |
| `<section>` | A themed part of the content, usually with its own heading |
| `<article>` | A self-contained piece, like a blog post |
| `<aside>` | Side content, such as a tip box |
| `<footer>` | The bottom: copyright, contact details, small links |

Here is a typical layout:

```html
<body>
  <header>
    <h1>My Blog</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>My first post</h2>
      <p>Hello, world!</p>
    </article>
  </main>

  <footer>
    <p>Copyright 2025</p>
  </footer>
</body>
```

Notice that `<nav>` lives inside `<header>`. Semantic tags can be nested, just like any other tags.

## Why it matters

- **Accessibility:** screen readers let users jump straight to the `<main>` or `<nav>`.
- **Search engines:** they understand your page better.
- **Readability:** when you read `<footer>` you know what you are looking at, whereas ten nested `<div>` tags tell you nothing.
- **Styling:** later you can write CSS such as `header { ... }` without inventing class names.

## When div is still fine

Use `<div>` when you only need a box to group things for layout or styling, and no semantic tag fits. Both have their place.

> **Watch out:**
> - Mismatched tags: opening with `<header>` and closing with `</div>`. The browser silently guesses and your layout may break. Always change the opening and the closing tag together.
> - Using several `<main>` elements. A page should have only one.
> - Using `<h1>` more than once. A page normally has one `<h1>`, then `<h2>` for sections.
> - Choosing a tag because of how it looks. `<header>` is not "the big text": choose by meaning and use CSS for looks.

## Going further

Add a second paragraph inside `<main>` and wrap the two paragraphs in a `<section>`. Try putting an `<aside>` with a small tip after the `<section>`.

> **Your turn:** change the plain `<div>` tags to `<header>`, `<nav>`, `<main>` and `<footer>`, keeping the content inside each one.
