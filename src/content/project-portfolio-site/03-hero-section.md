---
title: 'Step 3: The hero section'
summary: Build the first thing visitors see, a two-column hero with a headline, two buttons and an avatar drawn with pure CSS.
level: beginner
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Alex Rivers | Junior Web Developer</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="home" class="d-flex flex-column min-vh-100">
        <header class="sticky-top">
          <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom" aria-label="Main navigation">
            <div class="container">
              <a class="navbar-brand fw-bold" href="index.html">Alex Rivers</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="main-nav">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li class="nav-item"><a class="nav-link" data-page="home" href="index.html">Home</a></li>
                  <li class="nav-item"><a class="nav-link" data-page="projects" href="projects.html">Projects</a></li>
                  <li class="nav-item"><a class="nav-link" data-page="about" href="about.html">About</a></li>
                  <li class="nav-item"><a class="nav-link" data-page="contact" href="contact.html">Contact</a></li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <main class="flex-grow-1">
          <!-- TODO 3: replace the placeholder block below with the hero section: section.hero with a two-column row, the h1, a lead paragraph, two buttons and the AR avatar. -->
          <div class="container py-5">
            <h1>Alex Rivers</h1>
            <p class="lead">Junior web developer. This site grows one step at a time.</p>
          </div>
        </main>

        <footer class="site-footer border-top py-4">
          <div class="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <p class="mb-0 text-body-secondary">&copy; <span id="year">2026</span> Alex Rivers. Built with HTML, CSS and Bootstrap.</p>
            <ul class="list-inline mb-0">
              <li class="list-inline-item"><a href="https://github.com/alexrivers" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li class="list-inline-item"><a href="https://www.linkedin.com/in/alexrivers" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: css/style.css
    code: |
      /* css/style.css
         My own styles. This file is linked AFTER Bootstrap, so when both of them
         say something about the same element, my rule wins. */

      /* ---------- 1. Design tokens: colours and sizes I reuse everywhere ---------- */
      :root {
        --brand: #4f46e5;
        --brand-dark: #4338ca;
        --brand-text: #4338ca;
        --brand-soft: #eef2ff;
        --accent: #06b6d4;
        --accent-soft: #e0f7fa;
        --radius: 1rem;
      }

      /* ---------- 2. Navbar ---------- */
      .navbar-brand {
        color: var(--brand-text);
      }

      .navbar .nav-link.active {
        font-weight: 600;
        box-shadow: inset 0 -2px 0 var(--brand);
      }

      /* ---------- 3. Hero ---------- */
      /* TODO 3: .hero gets a background gradient:
           linear-gradient(135deg, var(--brand-soft) 0%, var(--bs-body-bg) 55%, var(--accent-soft) 100%).
           .hero .eyebrow: color var(--brand-text), font-weight 600, letter-spacing 0.04em.
           .avatar: a 180px circle (inline-flex, centred text, border-radius 50%), a gradient from
           var(--brand) to var(--accent), white bold text of 3.5rem, and a soft box-shadow. */






  - name: projects.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Projects | Alex Rivers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body>
        <main class="container py-5">
          <h1>Projects</h1>
          <p class="lead">This page is built in step 5. For now it is a placeholder so the links on the site never break.</p>
          <p><a href="index.html">Back to the home page</a></p>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: about.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>About | Alex Rivers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body>
        <main class="container py-5">
          <h1>About me</h1>
          <p class="lead">This page is built in step 6. For now it is a placeholder so the links on the site never break.</p>
          <p><a href="index.html">Back to the home page</a></p>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: contact.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Contact | Alex Rivers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body>
        <main class="container py-5">
          <h1>Contact</h1>
          <p class="lead">This page is built in step 7. For now it is a placeholder so the links on the site never break.</p>
          <p><a href="index.html">Back to the home page</a></p>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: 404.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Page not found | Alex Rivers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="d-flex flex-column min-vh-100 justify-content-center text-center">
        <main class="container py-5">
          <h1 class="h2">The 404 page is finished in step 10</h1>
          <p><a href="index.html">Back to the home page</a></p>
        </main>
      </body>
      </html>
  - name: js/main.js
    code: |
      // js/main.js
      // Small scripts shared by every page. Each feature first looks for its own
      // elements and quietly does nothing when they are not on the page, so one
      // file can serve all four pages.

      // 1. Mark the link of the page we are on.
      function highlightCurrentLink() {
        const currentPage = document.body.dataset.page;
        document.querySelectorAll('.navbar .nav-link').forEach((link) => {
          const isCurrent = link.dataset.page === currentPage;
          link.classList.toggle('active', isCurrent);
          if (isCurrent) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }

      // 2. Keep the copyright year in the footer up to date.
      function setFooterYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
          yearElement.textContent = new Date().getFullYear();
        }
      }

      highlightCurrentLink();
      setFooterYear();



check:
  page: index.html
  dom:
    text:
      - Hi, I'm Alex Rivers
      - Junior web developer
      - See my projects
      - Get in touch
    selectors:
      - section.hero[aria-labelledby="hero-title"] .container .row.align-items-center
      - .hero .col-lg-7 h1#hero-title.display-4.fw-bold
      - .hero .col-lg-7 p.eyebrow
      - .hero .col-lg-7 p.lead
      - .hero a.btn.btn-primary.btn-lg[href="projects.html"]
      - .hero a.btn.btn-lg[href="contact.html"]
      - .hero .col-lg-5 .avatar[role="img"][aria-label]
    styles:
      - selector: .hero
        property: padding-top
        value: 48px
      - selector: .hero h1
        property: font-weight
        value: '700'
      - selector: .hero .lead
        property: font-size
        value: 20px
      - selector: .hero .eyebrow
        property: font-weight
        value: '600'
      - selector: .hero .eyebrow
        property: color
        value: rgb(67, 56, 202)
      - selector: .avatar
        property: width
        value: 180px
      - selector: .avatar
        property: height
        value: 180px
      - selector: .avatar
        property: border-radius
        value: 50%
  code:
    - file: css/style.css
      pattern: '\.hero\s*\{[^}]*linear-gradient'
      message: 'Give .hero a background with linear-gradient(...).'
    - file: css/style.css
      pattern: '\.avatar\s*\{[^}]*linear-gradient'
      message: 'Give .avatar a gradient background too.'
hints:
  - 'A hero is one section with a container, a row and two columns. The left column (col-lg-7) holds the text, the right column (col-lg-5) holds the avatar. Replace the plain container block from step 1 with it.'
  - 'Left column: p.eyebrow, h1#hero-title with the classes display-4 and fw-bold, p.lead, then a div.d-flex.flex-wrap.gap-2 with two links styled btn btn-lg (one btn-primary to projects.html, one btn-outline-secondary to contact.html). Right column: div.avatar with role="img", an aria-label and the text AR. Then style .hero, .hero .eyebrow and .avatar in css/style.css.'
  - '<section class="hero py-5" aria-labelledby="hero-title"><div class="container"><div class="row align-items-center gy-5 gx-lg-5"><div class="col-lg-7"><p class="eyebrow mb-2">Junior web developer</p><h1 id="hero-title" class="display-4 fw-bold mb-3">Hi, I''m Alex Rivers. I build friendly, fast websites.</h1><p class="lead mb-4">...</p><div class="d-flex flex-wrap gap-2"><a class="btn btn-primary btn-lg" href="projects.html">See my projects</a><a class="btn btn-outline-secondary btn-lg" href="contact.html">Get in touch</a></div></div><div class="col-lg-5 text-center"><div class="avatar" role="img" aria-label="Alex Rivers, shown as the initials AR on a gradient circle">AR</div></div></div></div></section>   CSS: .hero { background: linear-gradient(135deg, var(--brand-soft) 0%, var(--bs-body-bg) 55%, var(--accent-soft) 100%); }   .avatar { display: inline-flex; align-items: center; justify-content: center; width: 180px; height: 180px; border-radius: 50%; background: linear-gradient(135deg, var(--brand), var(--accent)); color: #ffffff; font-size: 3.5rem; font-weight: 700; }'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Alex Rivers | Junior Web Developer</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="home" class="d-flex flex-column min-vh-100">
        <header class="sticky-top">
          <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom" aria-label="Main navigation">
            <div class="container">
              <a class="navbar-brand fw-bold" href="index.html">Alex Rivers</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="main-nav">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li class="nav-item"><a class="nav-link" data-page="home" href="index.html">Home</a></li>
                  <li class="nav-item"><a class="nav-link" data-page="projects" href="projects.html">Projects</a></li>
                  <li class="nav-item"><a class="nav-link" data-page="about" href="about.html">About</a></li>
                  <li class="nav-item"><a class="nav-link" data-page="contact" href="contact.html">Contact</a></li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <main class="flex-grow-1">
          <section class="hero py-5" aria-labelledby="hero-title">
            <div class="container">
              <div class="row align-items-center gy-5 gx-lg-5">
                <div class="col-lg-7">
                  <p class="eyebrow mb-2">Junior web developer</p>
                  <h1 id="hero-title" class="display-4 fw-bold mb-3">Hi, I'm Alex Rivers. I build friendly, fast websites.</h1>
                  <p class="lead mb-4">I turn ideas into clean, accessible pages with HTML, CSS and JavaScript. Right now I am looking for my first full-time role on a team that cares about the people who use its products.</p>
                  <div class="d-flex flex-wrap gap-2">
                    <a class="btn btn-primary btn-lg" href="projects.html">See my projects</a>
                    <a class="btn btn-outline-secondary btn-lg" href="contact.html">Get in touch</a>
                  </div>
                </div>
                <div class="col-lg-5 text-center">
                  <div class="avatar" role="img" aria-label="Alex Rivers, shown as the initials AR on a gradient circle">AR</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer class="site-footer border-top py-4">
          <div class="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <p class="mb-0 text-body-secondary">&copy; <span id="year">2026</span> Alex Rivers. Built with HTML, CSS and Bootstrap.</p>
            <ul class="list-inline mb-0">
              <li class="list-inline-item"><a href="https://github.com/alexrivers" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li class="list-inline-item"><a href="https://www.linkedin.com/in/alexrivers" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: css/style.css
    code: |
      /* css/style.css
         My own styles. This file is linked AFTER Bootstrap, so when both of them
         say something about the same element, my rule wins. */

      /* ---------- 1. Design tokens: colours and sizes I reuse everywhere ---------- */
      :root {
        --brand: #4f46e5;
        --brand-dark: #4338ca;
        --brand-text: #4338ca;
        --brand-soft: #eef2ff;
        --accent: #06b6d4;
        --accent-soft: #e0f7fa;
        --radius: 1rem;
      }

      /* ---------- 2. Navbar ---------- */
      .navbar-brand {
        color: var(--brand-text);
      }

      .navbar .nav-link.active {
        font-weight: 600;
        box-shadow: inset 0 -2px 0 var(--brand);
      }

      /* ---------- 3. Hero ---------- */
      .hero {
        background: linear-gradient(135deg, var(--brand-soft) 0%, var(--bs-body-bg) 55%, var(--accent-soft) 100%);
      }

      .hero .eyebrow {
        color: var(--brand-text);
        font-weight: 600;
        letter-spacing: 0.04em;
      }

      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--brand), var(--accent));
        color: #ffffff;
        font-size: 3.5rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        box-shadow: 0 1rem 2rem rgb(79 70 229 / 0.25);
      }






  - name: projects.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Projects | Alex Rivers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body>
        <main class="container py-5">
          <h1>Projects</h1>
          <p class="lead">This page is built in step 5. For now it is a placeholder so the links on the site never break.</p>
          <p><a href="index.html">Back to the home page</a></p>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: about.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>About | Alex Rivers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body>
        <main class="container py-5">
          <h1>About me</h1>
          <p class="lead">This page is built in step 6. For now it is a placeholder so the links on the site never break.</p>
          <p><a href="index.html">Back to the home page</a></p>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: contact.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Contact | Alex Rivers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body>
        <main class="container py-5">
          <h1>Contact</h1>
          <p class="lead">This page is built in step 7. For now it is a placeholder so the links on the site never break.</p>
          <p><a href="index.html">Back to the home page</a></p>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: 404.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Page not found | Alex Rivers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="d-flex flex-column min-vh-100 justify-content-center text-center">
        <main class="container py-5">
          <h1 class="h2">The 404 page is finished in step 10</h1>
          <p><a href="index.html">Back to the home page</a></p>
        </main>
      </body>
      </html>
  - name: js/main.js
    code: |
      // js/main.js
      // Small scripts shared by every page. Each feature first looks for its own
      // elements and quietly does nothing when they are not on the page, so one
      // file can serve all four pages.

      // 1. Mark the link of the page we are on.
      function highlightCurrentLink() {
        const currentPage = document.body.dataset.page;
        document.querySelectorAll('.navbar .nav-link').forEach((link) => {
          const isCurrent = link.dataset.page === currentPage;
          link.classList.toggle('active', isCurrent);
          if (isCurrent) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }

      // 2. Keep the copyright year in the footer up to date.
      function setFooterYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
          yearElement.textContent = new Date().getFullYear();
        }
      }

      highlightCurrentLink();
      setFooterYear();



quiz:
  - q: In Bootstrap's grid, what does col-lg-7 mean?
    options:
      - The column is 7 pixels wide
      - The column spans 7 of 12 grid columns from the lg breakpoint upwards, and stacks full width below it
      - The column appears only on large screens and is hidden on small ones
    answer: 1
    explain: The grid has 12 columns. Below the lg breakpoint (992px) every column takes the full width, so the avatar drops under the text on phones.
  - q: Why does the avatar have role="img" and an aria-label?
    options:
      - It is purely decorative, so screen readers must skip it
      - Browsers refuse to show a div without a role
      - A screen reader should announce the CSS circle as a picture with a useful description
    answer: 2
    explain: Without a role and a label, a screen reader would just read the letters "AR", which tells the listener nothing.
  - q: Which pair of classes puts the two hero columns side by side and centres them vertically?
    options:
      - row and align-items-center
      - container and text-center
      - d-block and mx-auto
    answer: 0
---
The hero is the top of your home page, and the part a recruiter reads in the first five seconds. It should say who you are and what you do, and offer the obvious next click.

## Where we are

The site has a navbar, a footer, and a plain heading in the middle. The Home link is highlighted and the year is filled in by JavaScript.

## What we will add, and why it matters

A hero has four ingredients: a short label ("Junior web developer"), a big headline, a sentence that backs it up, and one or two buttons. The best portfolio heroes are clear, not clever. We will also add a picture-like element without using any image file: an avatar made of CSS, a gradient circle with your initials. It loads instantly, scales without blurring, and needs no copyright worries.

## Guided walk-through

**1. A semantic section.** Wrap the hero in a `section` and connect it to its heading with `aria-labelledby`. Screen reader users can then jump between named regions:

```html
<section class="hero py-5" aria-labelledby="hero-title">
  <div class="container">
    ...
  </div>
</section>
```

**2. Two columns with the grid.** Bootstrap's grid has 12 columns per row. A `row` must sit inside a `container`, and columns must sit inside a row. `align-items-center` centres the columns vertically. `gy-5` adds vertical space between the stacked columns, and `gx-lg-5` adds a wide horizontal gap only from the `lg` breakpoint:

```html
<div class="row align-items-center gy-5 gx-lg-5">
  <div class="col-lg-7"> text </div>
  <div class="col-lg-5 text-center"> avatar </div>
</div>
```

`col-lg-7` plus `col-lg-5` make 12. Below the `lg` breakpoint (992px) both columns simply stack, so the layout is responsive without a single media query.

**3. The text column.** Bootstrap has typography helpers for exactly this job. `display-4` is a large, light heading style, `fw-bold` sets `font-weight: 700`, and `lead` makes a paragraph slightly larger:

```html
<p class="eyebrow mb-2">Junior web developer</p>
<h1 id="hero-title" class="display-4 fw-bold mb-3">Hi, I'm Alex Rivers. I build friendly, fast websites.</h1>
<p class="lead mb-4">One or two honest sentences about you.</p>
```

Use only one `h1` per page. `mb-2` and `mb-4` are margin-bottom helpers (0.5rem and 1.5rem).

**4. Two buttons.** The primary action is solid, the secondary one is an outline. They are `a` elements because they go to another page. `d-flex flex-wrap gap-2` lines them up and lets them wrap on a narrow phone:

```html
<div class="d-flex flex-wrap gap-2">
  <a class="btn btn-primary btn-lg" href="projects.html">See my projects</a>
  <a class="btn btn-outline-secondary btn-lg" href="contact.html">Get in touch</a>
</div>
```

**5. The avatar and background in CSS.** A circle is a square with `border-radius: 50%`. A gradient is a background image generated by the browser, so it counts as `background`, not `background-color`:

```css
.avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--accent));
}
```

`135deg` means the colour changes diagonally. The variables come from step 1, which is why we defined them early.

> **Watch out:**
> - A `col-*` outside a `.row` loses its width and gutters. The order is always container, then row, then col.
> - A wide horizontal gutter such as `g-5` on a phone makes the row stick out of the container and causes a sideways scrollbar. That is why we use `gx-lg-5` for the horizontal part.
> - Columns in one row should add up to 12. If you use 7 and 7, the second wraps onto a new line.
> - `role="img"` without an `aria-label` is worse than nothing: screen readers announce "image" and nothing else.
> - Text on a gradient must stay readable. Check that the contrast stays high at every point of the background.

> **Your turn:** in `index.html`, replace the placeholder container with the hero section described above: `section.hero` with `row.align-items-center`, a `col-lg-7` holding `p.eyebrow`, `h1#hero-title.display-4.fw-bold` ("Hi, I'm Alex Rivers. I build friendly, fast websites."), a `p.lead` and the two buttons (`See my projects`, `Get in touch`), and a `col-lg-5` with the `.avatar` (`role="img"`, `aria-label`). Then style `.hero`, `.hero .eyebrow` and `.avatar` in `css/style.css`.
