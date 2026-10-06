---
title: 'Step 2: A responsive navbar and a footer'
summary: Add a sticky Bootstrap navbar that collapses on phones, a footer, and a little JavaScript that highlights the current page and writes the year.
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
      <!-- TODO 1: replace the plain body tag below with one that has data-page="home" and the three Bootstrap classes d-flex flex-column min-vh-100 (this keeps the footer at the bottom of short pages). -->
      <body>
        <!-- TODO 2: paste the navbar (a header with class sticky-top that contains a Bootstrap navbar) here. The walk-through has the whole block. -->
        <!-- TODO 3: give the main element below the class flex-grow-1, so it stretches and pushes the footer down. -->
        <main>
          <div class="container py-5">
            <h1>Alex Rivers</h1>
            <p class="lead">Junior web developer. This site grows one step at a time.</p>
          </div>
        </main>

        <!-- TODO 4: paste the footer here, after the closing main tag. It has the copyright line with a span#year and two social links. -->

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>
      </body>
      </html>
  - name: js/main.js
    code: |
      // js/main.js
      // Small scripts shared by every page. Each feature first looks for its own
      // elements and quietly does nothing when they are not on the page, so one
      // file can serve all four pages.

      // TODO 1: highlightCurrentLink(). Read document.body.dataset.page, then loop over every '.navbar .nav-link'.
      //   The link whose data-page matches gets the class 'active' and aria-current="page"; the others lose aria-current.
      // TODO 2: setFooterYear(). Find the element with id 'year' and put new Date().getFullYear() into it.
      // Call both functions at the end.



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
      /* TODO 2: .navbar-brand gets color var(--brand-text).
           .navbar .nav-link.active gets font-weight 600 and an underline drawn with
           box-shadow: inset 0 -2px 0 var(--brand). */







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
check:
  page: index.html
  dom:
    text:
      - Alex Rivers
      - Built with HTML, CSS and Bootstrap
    selectors:
      - body[data-page="home"]
      - header.sticky-top nav.navbar.navbar-expand-lg
      - nav.navbar[aria-label="Main navigation"]
      - button.navbar-toggler[data-bs-toggle="collapse"][data-bs-target="#main-nav"][aria-controls="main-nav"]
      - '#main-nav.navbar-collapse.collapse'
      - .navbar-nav a.nav-link[data-page="projects"][href="projects.html"]
      - .navbar-nav a.nav-link[data-page="about"][href="about.html"]
      - .navbar-nav .nav-item:nth-child(4) a.nav-link[data-page="contact"][href="contact.html"]
      - .navbar-nav a.nav-link.active[data-page="home"][aria-current="page"]
      - footer.site-footer #year
    styles:
      - selector: header
        property: position
        value: sticky
      - selector: body
        property: display
        value: flex
      - selector: footer
        property: border-top-width
        value: 1px
      - selector: footer
        property: padding-top
        value: 24px
      - selector: .navbar-brand
        property: color
        value: rgb(67, 56, 202)
      - selector: .navbar .nav-link.active
        property: font-weight
        value: '600'
  code:
    - file: js/main.js
      pattern: 'document\.body\.dataset\.page'
      message: 'Read the current page name from document.body.dataset.page.'
    - file: js/main.js
      pattern: 'classList\.(toggle|add)\(\s*[''"]active[''"]'
      message: 'Give the matching link the class "active" with classList.'
    - file: js/main.js
      pattern: 'getFullYear\s*\('
      message: 'Use new Date().getFullYear() to get the current year.'
hints:
  - 'Work from the outside in. Change the body tag first, then paste a header with a nav inside it, then add the class to main, then the footer after main. After that, do the JavaScript: one function for the active link, one for the year.'
  - 'The navbar needs three parts: a brand link, a toggler button (data-bs-toggle="collapse" and data-bs-target="#main-nav") and a div.collapse.navbar-collapse with id="main-nav" holding ul.navbar-nav with four li.nav-item links. Each link carries data-page="home|projects|about|contact". The JavaScript compares link.dataset.page with document.body.dataset.page.'
  - 'In main.js: function highlightCurrentLink() { const currentPage = document.body.dataset.page; document.querySelectorAll(".navbar .nav-link").forEach((link) => { const isCurrent = link.dataset.page === currentPage; link.classList.toggle("active", isCurrent); if (isCurrent) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current"); }); }   function setFooterYear() { const el = document.getElementById("year"); if (el) el.textContent = new Date().getFullYear(); }   Call both functions. In the CSS: .navbar-brand { color: var(--brand-text); }   .navbar .nav-link.active { font-weight: 600; box-shadow: inset 0 -2px 0 var(--brand); }'
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
quiz:
  - q: What makes the navbar collapse into a menu button on phones?
    options:
      - A JavaScript function that you write yourself
      - The class navbar-expand-lg together with a toggler and a collapse container (Bootstrap's script does the opening)
      - The viewport meta tag
    answer: 1
    explain: navbar-expand-lg shows the full menu from the lg breakpoint (992px). Below it the toggler opens and closes the .collapse container.
  - q: Why does the active-link code read document.body.dataset.page instead of looking at the address bar?
    options:
      - It also works in the preview, and the page name stays easy to read and change
      - The address bar is not available to JavaScript
      - dataset is faster than location
    answer: 0
    explain: A data-page attribute is explicit. Parsing the URL is fragile when a page is served from different folders.
  - q: What does the combination d-flex flex-column min-vh-100 on the body plus flex-grow-1 on main achieve?
    options:
      - It makes the text bigger
      - It centres the page horizontally
      - The footer sits at the bottom of the window even when the page has very little content
    answer: 2
---
The site needs a way to move around. In this step you add a navbar that works on desktops and phones, a footer, and your first bit of JavaScript.

## Where we are

The home page loads Bootstrap, your stylesheet and your script, and shows a heading. There is no navigation yet, so a visitor cannot reach the other pages.

## What we will add, and why it matters

Navigation is the first thing people look for. It must work with a mouse, a finger and a keyboard, and it must fit on a narrow phone screen. Bootstrap's navbar already solves most of that, so you will learn its structure rather than reinvent it. The footer repeats the essentials (copyright and social links), and a small script keeps two details correct automatically: which link is highlighted and which year is shown.

## Guided walk-through

**1. Prepare the body.** A short page should still push the footer to the bottom of the window. Make the body a column flexbox that is at least as tall as the window (`min-vh-100`) and let `main` grow into the free space:

```html
<body data-page="home" class="d-flex flex-column min-vh-100">
...
<main class="flex-grow-1">
```

`data-page="home"` is a custom data attribute. Our script reads it to know which page it is on.

**2. Build the navbar.** Put it in a `header` with the class `sticky-top`, so the bar stays visible while scrolling. Why on the header and not on the nav? A sticky element only sticks inside its parent, and the header is the tall parent we want:

```html
<header class="sticky-top">
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom" aria-label="Main navigation">
    <div class="container">
      <a class="navbar-brand fw-bold" href="index.html">Alex Rivers</a>
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#main-nav"
              aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="main-nav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" data-page="home" href="index.html">Home</a></li>
          <!-- Projects, About, Contact: the same shape -->
        </ul>
      </div>
    </div>
  </nav>
</header>
```

Piece by piece: `navbar-expand-lg` shows the links in a row from 992px upwards and hides them behind the button below that. The button's `data-bs-target` must match the `id` of the collapse container. `ms-auto` pushes the links to the right. `aria-label` values give screen readers names for the nav and the icon-only button.

**3. Add the footer** after `main`. It uses a flex row on wide screens and a column on narrow ones (`flex-column flex-sm-row`). The year sits in a `span` with an id, because JavaScript will fill it:

```html
<p>&copy; <span id="year">2026</span> Alex Rivers.</p>
```

**4. Write the script.** In `js/main.js` write two small functions. They check that their elements exist, because the same file runs on every page:

```js
function highlightCurrentLink() {
  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.navbar .nav-link').forEach((link) => {
    const isCurrent = link.dataset.page === currentPage;
    link.classList.toggle('active', isCurrent);
    // aria-current tells screen readers which link is the current page
  });
}
```

`classList.toggle(name, true/false)` adds or removes a class depending on the second argument. The footer function is the same idea: find `#year` and set `textContent` to `new Date().getFullYear()`.

**5. Style the details** in `css/style.css`: brand colour for the logo link and a bold, underlined active link.

> **Watch out:**
> - If the toggler's `data-bs-target="#main-nav"` and the container's `id` differ, the button does nothing and the menu never opens on a phone.
> - Forgetting the Bootstrap bundle script (step 1) also breaks the toggler. Bootstrap's CSS alone cannot open a menu.
> - Every page needs its own copy of the navbar. That repetition is normal for plain HTML sites. Static site generators and frameworks exist to remove it, but copy and paste is fine for four pages.
> - `getFullYear` is a method, so it needs parentheses: `getFullYear()`.

> **Your turn:** follow the `TODO` comments in `index.html`, `js/main.js` and `css/style.css`. The body gets `data-page="home"` and the flex classes. Add the sticky header with the navbar (four links with `data-page` values `home`, `projects`, `about` and `contact`), then the footer with `span#year`. The script must mark the current link with `active` and `aria-current="page"` and write the year. The Home link should look active in the preview.
