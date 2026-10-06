---
title: 'Step 5: The projects page with filter buttons'
summary: Turn the placeholder into a real page with a grid of six project cards and filter buttons powered by data attributes and JavaScript.
level: intermediate
runner: web
files:
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
      <!-- TODO 1: this page is only a placeholder so far. Replace everything from the body tag below to its closing tag with the real page (see the walk-through): body attributes, the navbar and footer copied from index.html, a page header, filter buttons and a grid of six project cards. -->
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


      // TODO 1: initProjectFilter(). Find #project-filters and #project-grid (return early if either is missing).
      //   applyFilter(filter) loops over every [data-category] card: show = filter is 'all' or card.dataset.category equals filter;
      //   set card.hidden = !show and count the visible ones. Also update the buttons (class 'active' and aria-pressed)
      //   and write "Showing X of Y projects" into #filter-status.
      //   Listen for 'click' on the filter bar, find the clicked button with event.target.closest('[data-filter]'), call applyFilter.
      //   Finish by calling applyFilter('all') and call initProjectFilter() at the end.


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

      /* ---------- 4. Cards and the call to action ---------- */
      .skill-card {
        border-top: 4px solid var(--brand);
      }

      .project-thumb {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 140px;
        color: #ffffff;
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        border-radius: var(--bs-card-inner-border-radius) var(--bs-card-inner-border-radius) 0 0;
      }

      .thumb-cafe      { background: linear-gradient(135deg, #b45309, #be123c); }
      .thumb-budget    { background: linear-gradient(135deg, #047857, #0e7490); }
      .thumb-weather   { background: linear-gradient(135deg, #1d4ed8, #6d28d9); }
      .thumb-board     { background: linear-gradient(135deg, #be185d, #7e22ce); }
      .thumb-portfolio { background: linear-gradient(135deg, #4338ca, #0e7490); }
      .thumb-css       { background: linear-gradient(135deg, #0f766e, #1d4ed8); }

      .cta {
        background: linear-gradient(135deg, var(--brand), var(--brand-dark));
        color: #ffffff;
      }

      /* ---------- 5. Page header and filter buttons ---------- */
      /* TODO 5: .page-header gets a gradient from var(--brand-soft) to var(--bs-body-bg) (135deg).
           .filter-btn gets border-radius 50rem (a pill). */




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

          <section id="skills" class="py-5" aria-labelledby="skills-title">
            <div class="container">
              <h2 id="skills-title" class="fw-bold mb-1">What I work with</h2>
              <p class="text-body-secondary mb-4">The tools I use every week, and the habits I care about.</p>
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="card h-100 skill-card">
                    <div class="card-body">
                      <h3 class="h5 card-title">Front end</h3>
                      <p class="card-text text-body-secondary">Semantic HTML, modern CSS and JavaScript for fast pages that work on every screen.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-primary">HTML</span></li>
                        <li><span class="badge text-bg-primary">CSS</span></li>
                        <li><span class="badge text-bg-primary">JavaScript</span></li>
                        <li><span class="badge text-bg-primary">Bootstrap</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card h-100 skill-card">
                    <div class="card-body">
                      <h3 class="h5 card-title">Tools</h3>
                      <p class="card-text text-body-secondary">Version control, debugging and design hand-off, so that work stays organised and shareable.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-primary">Git</span></li>
                        <li><span class="badge text-bg-primary">GitHub</span></li>
                        <li><span class="badge text-bg-primary">VS Code</span></li>
                        <li><span class="badge text-bg-primary">DevTools</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card h-100 skill-card">
                    <div class="card-body">
                      <h3 class="h5 card-title">Good habits</h3>
                      <p class="card-text text-body-secondary">The details that make a site pleasant for everybody, not only for people with fast laptops.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-primary">Accessibility</span></li>
                        <li><span class="badge text-bg-primary">Responsive design</span></li>
                        <li><span class="badge text-bg-primary">SEO basics</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="featured" class="py-5 bg-body-tertiary" aria-labelledby="featured-title">
            <div class="container">
              <div class="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
                <h2 id="featured-title" class="fw-bold mb-0">Featured projects</h2>
                <a href="projects.html">See all projects</a>
              </div>
              <div class="row row-cols-1 row-cols-md-3 g-4">
                <div class="col">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-cafe" aria-hidden="true"><span>CB</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Cafe Bloom</h3>
                      <p class="card-text text-body-secondary">A responsive landing page for a neighbourhood cafe, built with Bootstrap and a custom colour theme.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">HTML</span></li>
                        <li><span class="badge text-bg-secondary">CSS</span></li>
                        <li><span class="badge text-bg-secondary">Bootstrap</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-budget" aria-hidden="true"><span>PB</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Pocket Budget</h3>
                      <p class="card-text text-body-secondary">A mobile-first expense tracker that remembers your spending in the browser and shows a monthly summary.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">JavaScript</span></li>
                        <li><span class="badge text-bg-secondary">HTML</span></li>
                        <li><span class="badge text-bg-secondary">CSS</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/pocket-budget" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-weather" aria-hidden="true"><span>WN</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Weather Now</h3>
                      <p class="card-text text-body-secondary">Type a city and see the current weather, loaded from a public API with fetch and async/await.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">JavaScript</span></li>
                        <li><span class="badge text-bg-secondary">Fetch API</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/weather-now" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section class="cta py-5 text-center" aria-labelledby="cta-title">
            <div class="container">
              <h2 id="cta-title" class="fw-bold">Have a project in mind?</h2>
              <p class="lead mb-4">I am open to junior roles and small freelance jobs. Tell me what you are building.</p>
              <a class="btn btn-light btn-lg" href="contact.html">Say hello</a>
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
  page: projects.html
  dom:
    text:
      - Projects
      - Showing 6 of 6 projects
      - Cafe Bloom
      - CSS Animation Lab
      - Websites
      - Apps
      - Practice
    selectors:
      - body[data-page="projects"]
      - header.sticky-top nav.navbar
      - .navbar-nav a.nav-link.active[data-page="projects"][aria-current="page"]
      - section.page-header h1
      - '#project-filters[role="group"][aria-label]'
      - '#project-filters button.filter-btn.active[data-filter="all"][aria-pressed="true"]'
      - '#project-filters button.filter-btn[data-filter="site"]'
      - '#project-filters button.filter-btn[data-filter="app"]'
      - '#project-filters button.filter-btn[data-filter="practice"]'
      - '#filter-status[role="status"]'
      - '#project-grid.row-cols-md-2.row-cols-xl-3 > .col[data-category="practice"]'
      - '#project-grid > .col:nth-child(6) article.card.project-card'
      - footer.site-footer #year
    styles:
      - selector: '#project-grid'
        property: display
        value: flex
      - selector: '#project-grid .card'
        property: display
        value: flex
      - selector: .page-header
        property: padding-top
        value: 48px
      - selector: .filter-btn
        property: border-radius
        value: 800px
  code:
    - file: js/main.js
      pattern: 'addEventListener\(\s*[''"]click[''"]'
      message: 'Listen for click events on the filter buttons.'
    - file: js/main.js
      pattern: 'dataset\.(filter|category)'
      message: 'Read the data-filter and data-category values through dataset.'
    - file: js/main.js
      pattern: '\.hidden\s*='
      message: 'Show or hide each card by setting its hidden property.'
    - file: js/main.js
      pattern: 'aria-pressed'
      message: 'Keep aria-pressed up to date on the buttons so screen readers know which filter is on.'
    - file: projects.html
      pattern: 'data-category="app"'
      message: 'Each project column needs a data-category value (site, app or practice).'
hints:
  - 'There are two jobs. HTML job: replace the placeholder body of projects.html with a full page (same navbar and footer as index.html, with data-page="projects"), plus filter buttons and six cards. JavaScript job: a function that shows or hides the cards according to the clicked button.'
  - 'Each card sits in a div.col with data-category="site", "app" or "practice". Each button has data-filter with the same words plus "all". In JavaScript, applyFilter(filter) loops over the cards: card.hidden = !(filter === "all" || card.dataset.category === filter). Count the visible cards and write "Showing X of Y projects" into #filter-status. One click listener on #project-filters finds the button with event.target.closest("[data-filter]").'
  - 'function initProjectFilter() { const filterBar = document.getElementById("project-filters"); const grid = document.getElementById("project-grid"); if (!filterBar || !grid) return; const buttons = filterBar.querySelectorAll("[data-filter]"); const cards = grid.querySelectorAll("[data-category]"); const status = document.getElementById("filter-status"); function applyFilter(filter) { let visible = 0; cards.forEach((card) => { const show = filter === "all" || card.dataset.category === filter; card.hidden = !show; if (show) visible += 1; }); buttons.forEach((b) => { const on = b.dataset.filter === filter; b.classList.toggle("active", on); b.setAttribute("aria-pressed", String(on)); }); status.textContent = `Showing ${visible} of ${cards.length} projects`; } filterBar.addEventListener("click", (event) => { const button = event.target.closest("[data-filter]"); if (button) applyFilter(button.dataset.filter); }); applyFilter("all"); }   initProjectFilter();'
solution:
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
      <body data-page="projects" class="d-flex flex-column min-vh-100">
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
          <section class="page-header py-5">
            <div class="container">
              <h1 class="fw-bold">Projects</h1>
              <p class="lead mb-0">A selection of things I have built while learning. Filter them by type.</p>
            </div>
          </section>

          <section class="py-5" aria-labelledby="all-projects-title">
            <div class="container">
              <h2 id="all-projects-title" class="visually-hidden">All projects</h2>

              <div id="project-filters" class="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter projects by type">
                <button type="button" class="btn btn-outline-primary filter-btn active" data-filter="all" aria-pressed="true">All</button>
                <button type="button" class="btn btn-outline-primary filter-btn" data-filter="site" aria-pressed="false">Websites</button>
                <button type="button" class="btn btn-outline-primary filter-btn" data-filter="app" aria-pressed="false">Apps</button>
                <button type="button" class="btn btn-outline-primary filter-btn" data-filter="practice" aria-pressed="false">Practice</button>
              </div>
              <p id="filter-status" class="text-body-secondary" role="status"></p>

              <div id="project-grid" class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                <div class="col" data-category="site">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-cafe" aria-hidden="true"><span>CB</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Cafe Bloom</h3>
                      <p class="card-text text-body-secondary">A responsive landing page for a neighbourhood cafe, built with Bootstrap and a custom colour theme.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">HTML</span></li>
                        <li><span class="badge text-bg-secondary">CSS</span></li>
                        <li><span class="badge text-bg-secondary">Bootstrap</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3 d-flex flex-wrap gap-2">
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/cafe-bloom/" target="_blank" rel="noopener noreferrer">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col" data-category="app">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-budget" aria-hidden="true"><span>PB</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Pocket Budget</h3>
                      <p class="card-text text-body-secondary">A mobile-first expense tracker that remembers your spending in the browser and shows a monthly summary.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">JavaScript</span></li>
                        <li><span class="badge text-bg-secondary">HTML</span></li>
                        <li><span class="badge text-bg-secondary">CSS</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3 d-flex flex-wrap gap-2">
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/pocket-budget/" target="_blank" rel="noopener noreferrer">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/pocket-budget" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col" data-category="app">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-weather" aria-hidden="true"><span>WN</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Weather Now</h3>
                      <p class="card-text text-body-secondary">Type a city and see the current weather, loaded from a public API with fetch and async/await.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">JavaScript</span></li>
                        <li><span class="badge text-bg-secondary">Fetch API</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3 d-flex flex-wrap gap-2">
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/weather-now/" target="_blank" rel="noopener noreferrer">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/weather-now" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col" data-category="app">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-board" aria-hidden="true"><span>TB</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Todo Board</h3>
                      <p class="card-text text-body-secondary">A small kanban board with drag and drop, built to practise DOM events and keeping state in sync.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">JavaScript</span></li>
                        <li><span class="badge text-bg-secondary">DOM events</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3 d-flex flex-wrap gap-2">
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/todo-board/" target="_blank" rel="noopener noreferrer">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/todo-board" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col" data-category="site">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-portfolio" aria-hidden="true"><span>PS</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Portfolio Site</h3>
                      <p class="card-text text-body-secondary">The site you are looking at: four pages, Bootstrap, dark mode and a focus on accessibility.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">HTML</span></li>
                        <li><span class="badge text-bg-secondary">Bootstrap</span></li>
                        <li><span class="badge text-bg-secondary">Accessibility</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3 d-flex flex-wrap gap-2">
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/portfolio/" target="_blank" rel="noopener noreferrer">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/portfolio" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col" data-category="practice">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-css" aria-hidden="true"><span>CA</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">CSS Animation Lab</h3>
                      <p class="card-text text-body-secondary">A dozen small experiments with transitions, keyframes and custom properties, each on its own page.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">CSS</span></li>
                        <li><span class="badge text-bg-secondary">Animations</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3 d-flex flex-wrap gap-2">
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/css-animation-lab/" target="_blank" rel="noopener noreferrer">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/css-animation-lab" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
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


      // 3. Filter buttons on the projects page.
      function initProjectFilter() {
        const filterBar = document.getElementById('project-filters');
        const grid = document.getElementById('project-grid');
        if (!filterBar || !grid) {
          return;
        }

        const buttons = filterBar.querySelectorAll('[data-filter]');
        const cards = grid.querySelectorAll('[data-category]');
        const status = document.getElementById('filter-status');

        function applyFilter(filter) {
          let visible = 0;
          cards.forEach((card) => {
            const show = filter === 'all' || card.dataset.category === filter;
            card.hidden = !show;
            if (show) {
              visible += 1;
            }
          });

          buttons.forEach((button) => {
            const isActive = button.dataset.filter === filter;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
          });

          status.textContent = `Showing ${visible} of ${cards.length} projects`;
        }

        filterBar.addEventListener('click', (event) => {
          const button = event.target.closest('[data-filter]');
          if (button) {
            applyFilter(button.dataset.filter);
          }
        });

        applyFilter('all');
      }

      initProjectFilter();


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

      /* ---------- 4. Cards and the call to action ---------- */
      .skill-card {
        border-top: 4px solid var(--brand);
      }

      .project-thumb {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 140px;
        color: #ffffff;
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        border-radius: var(--bs-card-inner-border-radius) var(--bs-card-inner-border-radius) 0 0;
      }

      .thumb-cafe      { background: linear-gradient(135deg, #b45309, #be123c); }
      .thumb-budget    { background: linear-gradient(135deg, #047857, #0e7490); }
      .thumb-weather   { background: linear-gradient(135deg, #1d4ed8, #6d28d9); }
      .thumb-board     { background: linear-gradient(135deg, #be185d, #7e22ce); }
      .thumb-portfolio { background: linear-gradient(135deg, #4338ca, #0e7490); }
      .thumb-css       { background: linear-gradient(135deg, #0f766e, #1d4ed8); }

      .cta {
        background: linear-gradient(135deg, var(--brand), var(--brand-dark));
        color: #ffffff;
      }

      /* ---------- 5. Page header and filter buttons ---------- */
      .page-header {
        background: linear-gradient(135deg, var(--brand-soft), var(--bs-body-bg));
      }

      .filter-btn {
        border-radius: 50rem;
      }




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

          <section id="skills" class="py-5" aria-labelledby="skills-title">
            <div class="container">
              <h2 id="skills-title" class="fw-bold mb-1">What I work with</h2>
              <p class="text-body-secondary mb-4">The tools I use every week, and the habits I care about.</p>
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="card h-100 skill-card">
                    <div class="card-body">
                      <h3 class="h5 card-title">Front end</h3>
                      <p class="card-text text-body-secondary">Semantic HTML, modern CSS and JavaScript for fast pages that work on every screen.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-primary">HTML</span></li>
                        <li><span class="badge text-bg-primary">CSS</span></li>
                        <li><span class="badge text-bg-primary">JavaScript</span></li>
                        <li><span class="badge text-bg-primary">Bootstrap</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card h-100 skill-card">
                    <div class="card-body">
                      <h3 class="h5 card-title">Tools</h3>
                      <p class="card-text text-body-secondary">Version control, debugging and design hand-off, so that work stays organised and shareable.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-primary">Git</span></li>
                        <li><span class="badge text-bg-primary">GitHub</span></li>
                        <li><span class="badge text-bg-primary">VS Code</span></li>
                        <li><span class="badge text-bg-primary">DevTools</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card h-100 skill-card">
                    <div class="card-body">
                      <h3 class="h5 card-title">Good habits</h3>
                      <p class="card-text text-body-secondary">The details that make a site pleasant for everybody, not only for people with fast laptops.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-primary">Accessibility</span></li>
                        <li><span class="badge text-bg-primary">Responsive design</span></li>
                        <li><span class="badge text-bg-primary">SEO basics</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="featured" class="py-5 bg-body-tertiary" aria-labelledby="featured-title">
            <div class="container">
              <div class="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
                <h2 id="featured-title" class="fw-bold mb-0">Featured projects</h2>
                <a href="projects.html">See all projects</a>
              </div>
              <div class="row row-cols-1 row-cols-md-3 g-4">
                <div class="col">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-cafe" aria-hidden="true"><span>CB</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Cafe Bloom</h3>
                      <p class="card-text text-body-secondary">A responsive landing page for a neighbourhood cafe, built with Bootstrap and a custom colour theme.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">HTML</span></li>
                        <li><span class="badge text-bg-secondary">CSS</span></li>
                        <li><span class="badge text-bg-secondary">Bootstrap</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-budget" aria-hidden="true"><span>PB</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Pocket Budget</h3>
                      <p class="card-text text-body-secondary">A mobile-first expense tracker that remembers your spending in the browser and shows a monthly summary.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">JavaScript</span></li>
                        <li><span class="badge text-bg-secondary">HTML</span></li>
                        <li><span class="badge text-bg-secondary">CSS</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/pocket-budget" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
                <div class="col">
                  <article class="card project-card h-100">
                    <div class="project-thumb thumb-weather" aria-hidden="true"><span>WN</span></div>
                    <div class="card-body">
                      <h3 class="h5 card-title">Weather Now</h3>
                      <p class="card-text text-body-secondary">Type a city and see the current weather, loaded from a public API with fetch and async/await.</p>
                      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
                        <li><span class="badge text-bg-secondary">JavaScript</span></li>
                        <li><span class="badge text-bg-secondary">Fetch API</span></li>
                      </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/weather-now" target="_blank" rel="noopener noreferrer">Source code</a>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section class="cta py-5 text-center" aria-labelledby="cta-title">
            <div class="container">
              <h2 id="cta-title" class="fw-bold">Have a project in mind?</h2>
              <p class="lead mb-4">I am open to junior roles and small freelance jobs. Tell me what you are building.</p>
              <a class="btn btn-light btn-lg" href="contact.html">Say hello</a>
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
  - q: What is a data attribute such as data-category="app" used for?
    options:
      - It styles the element with the colour "app"
      - It stores your own information on an element, which JavaScript reads with element.dataset.category
      - It tells search engines what the page is about
    answer: 1
    explain: Any attribute that starts with data- is yours to use. JavaScript turns data-category into dataset.category.
  - q: Why is one click listener on the filter bar better than one listener on every button?
    options:
      - It is the only way JavaScript can detect clicks
      - Buttons cannot have their own listeners
      - It needs less code and still works when you add another button later (event delegation)
    answer: 2
    explain: Clicks bubble up from the button to its parent, and event.target.closest(...) finds which button was clicked.
  - q: Why do the buttons have aria-pressed, and why does the page have a role="status" paragraph?
    options:
      - They tell assistive technology which filter is on and announce the new result count politely
      - They change the colours of the buttons
      - They are required for the hidden attribute to work
    answer: 0
---
A portfolio with only three projects is a fine start, but a growing collection needs a place of its own and a way to browse it. In this step the placeholder `projects.html` becomes a real page with filter buttons.

## Where we are

The home page is complete. The other pages are placeholders. The navbar and footer exist only on `index.html`, and `js/main.js` can highlight links and write the year.

## What we will add, and why it matters

A page that lists six projects in a grid, and four buttons (All, Websites, Apps, Practice) that show only the matching projects. Filtering is a classic small piece of JavaScript: it uses data attributes, event handling and the DOM, which is exactly what employers want to see in a junior portfolio. It must also stay accessible, so the buttons report their state to screen readers.

## Guided walk-through

**1. Copy the shared parts.** Every page of a static site repeats the navbar and the footer. Copy both from `index.html` into the new page, and set `data-page="projects"` on the body so our step 2 script highlights the Projects link. The head already links Bootstrap and your CSS.

**2. A page header.** A simple band with an `h1` and a lead paragraph introduces the page. Its style (`.page-header`) is a soft gradient.

**3. Mark every card with its type.** The grid is a Bootstrap row; each column carries a `data-category`:

```html
<div id="project-grid" class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
  <div class="col" data-category="site"> <article class="card project-card h-100"> ... </article> </div>
  <div class="col" data-category="app"> ... </div>
</div>
```

`row-cols-md-2 row-cols-xl-3` means one column on phones, two on tablets, three on large desktops. Placing the data attribute on the column (not the card) matters later: when we hide a card, its empty column must disappear too, or a gap remains.

**4. Buttons that carry their filter.** Put the buttons in a labelled group. `data-filter` holds the category they show, `aria-pressed` tells assistive technology whether the button is on:

```html
<div id="project-filters" role="group" aria-label="Filter projects by type">
  <button type="button" class="btn btn-outline-primary filter-btn active" data-filter="all" aria-pressed="true">All</button>
</div>
<p id="filter-status" role="status"></p>
```

A `role="status"` element is a polite live region: when its text changes, screen readers read the new text without stealing focus.

**5. The filter function.** Inside `initProjectFilter()` one function decides what is visible. The `hidden` property is perfect here, because Bootstrap's reboot makes `[hidden]` mean `display: none`:

```js
function applyFilter(filter) {
  let visible = 0;
  cards.forEach((card) => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.hidden = !show;
    if (show) visible += 1;
  });
  status.textContent = `Showing ${visible} of ${cards.length} projects`;
}
```

Also update the buttons in the same function (toggle `active`, set `aria-pressed`) so there is one source of truth. Then use **event delegation**: one listener on the bar instead of four on the buttons.

```js
filterBar.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (button) applyFilter(button.dataset.filter);
});
```

> **Watch out:**
> - If you hide the card but leave its column visible, the grid keeps an empty hole. Hide the element that holds `data-category`.
> - Template strings need backticks: `` `Showing ${visible}` ``. With normal quotes you would print `${visible}` literally.
> - `dataset.filter` reads `data-filter`. A name with two words, like `data-project-type`, becomes `dataset.projectType`.
> - Forgetting `type="button"` is harmless here, but inside a form a button would submit it.

> **Your turn:** replace the placeholder body in `projects.html` with the full page: body `data-page="projects"` and flex classes, the navbar, `section.page-header` with an `h1` "Projects", `#project-filters` with four `.filter-btn` buttons (`all`, `site`, `app`, `practice`), `p#filter-status`, `#project-grid` with six `div.col[data-category]` cards (Cafe Bloom, Pocket Budget, Weather Now, Todo Board, Portfolio Site, CSS Animation Lab), and the footer. Then write `initProjectFilter()` in `js/main.js` and the small `.page-header` and `.filter-btn` rules in the CSS. When the page loads it must say "Showing 6 of 6 projects".
