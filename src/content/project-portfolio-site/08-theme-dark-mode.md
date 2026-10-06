---
title: 'Step 8: Your own theme, dark mode and hover effects'
summary: Wire Bootstrap to your brand colours with CSS variables, add a dark mode toggle with data-bs-theme, and polish the cards with hover effects.
level: advanced
runner: web
files:
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

      /* ---------- 6. Timeline and skill bars ---------- */
      .timeline {
        list-style: none;
        margin: 0;
        padding: 0 0 0 1.5rem;
        border-left: 2px solid var(--bs-border-color);
      }

      .timeline-item {
        position: relative;
        padding-bottom: 1.75rem;
      }

      .timeline-item::before {
        content: "";
        position: absolute;
        left: calc(-1.5rem - 7px);
        top: 0.35rem;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--brand);
        box-shadow: 0 0 0 4px var(--bs-body-bg);
      }

      .timeline-date {
        color: var(--brand-text);
        font-size: 0.875rem;
        font-weight: 700;
      }

      .progress {
        --bs-progress-height: 0.75rem;
      }

      /* ---------- 7. Form polish ---------- */
      .form-control:focus {
        border-color: var(--brand);
        box-shadow: 0 0 0 0.25rem rgb(79 70 229 / 0.25);
      }

      textarea.form-control {
        min-height: 8rem;
        resize: vertical;
      }

      /* ---------- 8. Theme: connect Bootstrap to my tokens ---------- */
      /* TODO 1: light theme. On  :root, [data-bs-theme="light"]  set --bs-primary: #4f46e5; --bs-primary-rgb: 79, 70, 229;
           --bs-link-color: #4338ca; --bs-link-color-rgb: 67, 56, 202; --bs-link-hover-color: #3730a3; --bs-link-hover-color-rgb: 55, 48, 163;
           --bs-body-bg: #fbfbfe; --bs-body-bg-rgb: 251, 251, 254;
           --bs-tertiary-bg: #f3f4fb; --bs-tertiary-bg-rgb: 243, 244, 251.
           TODO 2: dark theme. On  [data-bs-theme="dark"]  override --brand-text: #a5b4fc; --brand-soft: #1e1b4b; --accent-soft: #083344;
           --bs-link-color: #a5b4fc; --bs-link-color-rgb: 165, 180, 252; --bs-link-hover-color: #c7d2fe; --bs-link-hover-color-rgb: 199, 210, 254;
           --bs-body-bg: #0f1020; --bs-body-bg-rgb: 15, 16, 32;
           --bs-tertiary-bg: #171933; --bs-tertiary-bg-rgb: 23, 25, 51.
           TODO 3: .btn-primary and .btn-outline-primary: re-point their --bs-btn-* variables at var(--brand) and friends.
           .btn-outline-secondary: --bs-btn-color: var(--bs-body-color) and --bs-btn-border-color: var(--bs-secondary-color), so the text keeps enough contrast in both themes.
           TODO 4: .card gets --bs-card-border-radius: var(--radius) and a matching inner radius; .progress gets --bs-progress-bar-bg: var(--brand).
           TODO 5: hover polish: .project-card transitions transform and box-shadow, and on :hover / :focus-within moves up 6px with a bigger shadow.
           Wrap the motion in prefers-reduced-motion so it can be switched off. */

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


      // 4. Contact form: show friendly validation messages.
      function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) {
          return;
        }
        const status = document.getElementById('form-status');

        form.addEventListener('submit', (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            status.textContent = 'Please fix the highlighted fields and try again.';
            status.classList.add('text-danger-emphasis');
            form.querySelector(':invalid').focus();
          } else {
            status.textContent = 'Sending your message...';
            status.classList.remove('text-danger-emphasis');
          }
          form.classList.add('was-validated');
        });
      }

      initContactForm();


      // TODO 1: initThemeToggle(). Build a button (id 'theme-toggle', classes 'btn btn-outline-secondary btn-sm ...') and append it to '.navbar-collapse'.
      // TODO 2: the theme is 'light' or 'dark'. Start with the saved choice (localStorage, inside try/catch), else the
      //   operating system preference: window.matchMedia('(prefers-color-scheme: dark)').matches.
      // TODO 3: applyTheme(theme) sets the data-bs-theme attribute on document.documentElement and aria-pressed on the button.
      //   Clicking the button flips the theme and saves it (again inside try/catch). Call initThemeToggle() at the end.
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
      <body data-page="about" class="d-flex flex-column min-vh-100">
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
              <h1 class="fw-bold">About me</h1>
              <p class="lead mb-0">Career changer, curious learner, and a developer who likes explaining things clearly.</p>
            </div>
          </section>

          <section class="py-5">
            <div class="container">
              <div class="row gy-5 gx-lg-5">
                <aside class="col-lg-4" aria-labelledby="facts-title">
                  <div class="text-center mb-4">
                    <div class="avatar" role="img" aria-label="Alex Rivers, shown as the initials AR on a gradient circle">AR</div>
                  </div>
                  <h2 id="facts-title" class="h4">Quick facts</h2>
                  <dl class="row mb-0">
                    <dt class="col-5">Based in</dt>
                    <dd class="col-7">Lisbon, Portugal</dd>
                    <dt class="col-5">Focus</dt>
                    <dd class="col-7">Front-end development</dd>
                    <dt class="col-5">Learning</dt>
                    <dd class="col-7">React and TypeScript</dd>
                    <dt class="col-5">Languages</dt>
                    <dd class="col-7">English, Portuguese</dd>
                    <dt class="col-5">Available</dt>
                    <dd class="col-7">From January</dd>
                  </dl>
                </aside>

                <div class="col-lg-8">
                  <h2 class="h3 fw-bold">My story</h2>
                  <p>I spent three years in customer support, listening to people struggle with websites that were confusing, slow or impossible to use with a keyboard. I wanted to be the person who fixes those problems at the source, so I taught myself to code in the evenings.</p>
                  <p>Today I build small, fast sites with HTML, CSS, JavaScript and Bootstrap. I care about readable code, clear words on the page and accessibility from the first line, not as an afterthought.</p>

                  <h2 class="h3 fw-bold mt-5">Experience and education</h2>
                  <ol class="timeline mt-4">
                    <li class="timeline-item">
                      <p class="timeline-date mb-1">2026 to now</p>
                      <h3 class="h5 mb-1">Junior Web Developer, Brightside Studio</h3>
                      <p class="text-body-secondary mb-0">Building and maintaining websites for small businesses, fixing accessibility issues found in audits and reviewing pull requests with the team.</p>
                    </li>
                    <li class="timeline-item">
                      <p class="timeline-date mb-1">2025</p>
                      <h3 class="h5 mb-1">Freelance web developer</h3>
                      <p class="text-body-secondary mb-0">Designed and launched three sites for local shops, including contact forms, basic SEO and a short guide so the owners could edit their own text.</p>
                    </li>
                    <li class="timeline-item">
                      <p class="timeline-date mb-1">2024 to 2025</p>
                      <h3 class="h5 mb-1">Front-end web development course</h3>
                      <p class="text-body-secondary mb-0">A year of part-time study covering HTML, CSS, JavaScript, Git and accessibility, finished with a capstone project called Pocket Budget.</p>
                    </li>
                    <li class="timeline-item">
                      <p class="timeline-date mb-1">2021 to 2024</p>
                      <h3 class="h5 mb-1">Customer support specialist</h3>
                      <p class="text-body-secondary mb-0">Answered hundreds of questions a week. I learned to explain things simply and to notice exactly where people get stuck.</p>
                    </li>
                  </ol>

                  <h2 class="h3 fw-bold mt-5">Skills</h2>
                  <div class="mt-4">
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-html">HTML</span><span aria-hidden="true">90%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-html" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 90%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-css">CSS</span><span aria-hidden="true">85%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-css" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 85%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-js">JavaScript</span><span aria-hidden="true">70%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-js" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 70%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-bootstrap">Bootstrap</span><span aria-hidden="true">85%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-bootstrap" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 85%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-git">Git and GitHub</span><span aria-hidden="true">65%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-git" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 65%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-a11y">Accessibility</span><span aria-hidden="true">75%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-a11y" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 75%"></div>
                      </div>
                    </div>
                  </div>
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
      <body data-page="contact" class="d-flex flex-column min-vh-100">
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
              <h1 class="fw-bold">Get in touch</h1>
              <p class="lead mb-0">Have a question, a role or a project? Send me a message and I will reply within two working days.</p>
            </div>
          </section>

          <section class="py-5">
            <div class="container">
              <div class="row gy-5 gx-lg-5">
                <div class="col-lg-7">
                  <h2 class="h4 mb-3">Send me a message</h2>
                  <form id="contact-form" action="https://formspree.io/f/your-form-id" method="post" novalidate>
                    <div class="mb-3">
                      <label for="name" class="form-label">Your name</label>
                      <input type="text" class="form-control" id="name" name="name" autocomplete="name" required aria-describedby="name-error">
                      <div class="invalid-feedback" id="name-error">Please tell me your name.</div>
                    </div>
                    <div class="mb-3">
                      <label for="email" class="form-label">Your email</label>
                      <input type="email" class="form-control" id="email" name="email" autocomplete="email" required aria-describedby="email-error">
                      <div class="invalid-feedback" id="email-error">Please enter a valid email address, like name@example.com.</div>
                    </div>
                    <div class="mb-3">
                      <label for="message" class="form-label">Message</label>
                      <textarea class="form-control" id="message" name="message" rows="5" minlength="10" required aria-describedby="message-error"></textarea>
                      <div class="invalid-feedback" id="message-error">Please write at least 10 characters.</div>
                    </div>
                    <div class="d-flex flex-wrap align-items-center gap-3">
                      <button type="submit" class="btn btn-primary btn-lg">Send message</button>
                      <p id="form-status" class="mb-0" role="status"></p>
                    </div>
                  </form>
                </div>

                <div class="col-lg-5">
                  <div class="card">
                    <div class="card-body">
                      <h2 class="h4 card-title">Other ways to reach me</h2>
                      <p class="card-text text-body-secondary">Prefer your own email app or a quick look at my code? These work too.</p>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item px-0">Email: <a href="mailto:hello@alexrivers.dev">hello@alexrivers.dev</a></li>
                        <li class="list-group-item px-0">GitHub: <a href="https://github.com/alexrivers" target="_blank" rel="noopener noreferrer">github.com/alexrivers</a></li>
                        <li class="list-group-item px-0">LinkedIn: <a href="https://www.linkedin.com/in/alexrivers" target="_blank" rel="noopener noreferrer">linkedin.com/in/alexrivers</a></li>
                        <li class="list-group-item px-0">Based in Lisbon, Portugal (open to remote work)</li>
                      </ul>
                    </div>
                  </div>
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
    selectors:
      - html[data-bs-theme]
      - '.navbar-collapse > button#theme-toggle.btn[type="button"][aria-pressed]'
    styles:
      - selector: :root
        property: --bs-primary
        value: '#4f46e5'
      - selector: :root
        property: --bs-primary-rgb
        value: 79, 70, 229
      - selector: .btn-primary
        property: background-color
        value: rgb(79, 70, 229)
      - selector: .btn-primary
        property: color
        value: rgb(255, 255, 255)
      - selector: '#skills .badge'
        property: background-color
        value: rgb(79, 70, 229)
      - selector: '#featured .card'
        property: border-radius
        value: 16px
  code:
    - file: css/style.css
      pattern: ':root\s*,\s*\[data-bs-theme=["'']light["'']\]\s*\{'
      message: 'Put your light theme variables on ":root, [data-bs-theme="light"]" so they do not beat the dark theme.'
    - file: css/style.css
      pattern: '\[data-bs-theme=["'']dark["'']\]\s*\{[^}]*--bs-body-bg'
      message: 'Add a [data-bs-theme="dark"] rule that overrides --bs-body-bg and friends.'
    - file: css/style.css
      pattern: '\.btn-primary\s*\{[^}]*--bs-btn-bg:\s*var\(--brand\)'
      message: 'Re-point the button variables: .btn-primary { --bs-btn-bg: var(--brand); ... }'
    - file: css/style.css
      pattern: '\.project-card:hover[^{]*\{[^}]*translateY'
      message: 'Lift the card on hover with transform: translateY(...).'
    - file: css/style.css
      pattern: 'prefers-reduced-motion:\s*reduce'
      message: 'Respect people who prefer less motion with @media (prefers-reduced-motion: reduce).'
    - file: js/main.js
      pattern: 'setAttribute\(\s*[''"]data-bs-theme[''"]'
      message: 'Switch themes by setting the data-bs-theme attribute on document.documentElement.'
    - file: js/main.js
      pattern: 'prefers-color-scheme:\s*dark'
      message: 'Start with the visitor''s system preference: matchMedia("(prefers-color-scheme: dark)").'
    - file: js/main.js
      pattern: 'try\s*\{[^}]*localStorage'
      message: 'Wrap localStorage in try/catch, because storage can be blocked.'
hints:
  - 'Three jobs, three places. CSS variables: make Bootstrap use your colours. JavaScript: build the toggle button and flip data-bs-theme on the html element. CSS again: hover and focus-within effects for .project-card. Start with the variables.'
  - 'Light theme on ":root, [data-bs-theme="light"]" (set --bs-primary, --bs-primary-rgb, the link colours, --bs-body-bg and the tertiary background). Dark theme on [data-bs-theme="dark"] only. Buttons do not read --bs-primary, so override .btn-primary { --bs-btn-bg: var(--brand); --bs-btn-border-color: var(--brand); --bs-btn-hover-bg: var(--brand-dark); ... } and .card { --bs-card-border-radius: var(--radius); }.'
  - ':root, [data-bs-theme="light"] { --bs-primary: #4f46e5; --bs-primary-rgb: 79, 70, 229; --bs-body-bg: #fbfbfe; --bs-body-bg-rgb: 251, 251, 254; }   [data-bs-theme="dark"] { --brand-text: #a5b4fc; --bs-body-bg: #0f1020; --bs-body-bg-rgb: 15, 16, 32; }   .btn-primary { --bs-btn-bg: var(--brand); --bs-btn-border-color: var(--brand); --bs-btn-hover-bg: var(--brand-dark); --bs-btn-hover-border-color: var(--brand-dark); }   .card { --bs-card-border-radius: var(--radius); --bs-card-inner-border-radius: calc(var(--radius) - 1px); }   .project-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }   .project-card:hover, .project-card:focus-within { transform: translateY(-6px); box-shadow: var(--bs-box-shadow-lg); }   @media (prefers-reduced-motion: reduce) { .project-card { transition: none; } }   JS: document.documentElement.setAttribute("data-bs-theme", theme);'
solution:
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

      /* ---------- 6. Timeline and skill bars ---------- */
      .timeline {
        list-style: none;
        margin: 0;
        padding: 0 0 0 1.5rem;
        border-left: 2px solid var(--bs-border-color);
      }

      .timeline-item {
        position: relative;
        padding-bottom: 1.75rem;
      }

      .timeline-item::before {
        content: "";
        position: absolute;
        left: calc(-1.5rem - 7px);
        top: 0.35rem;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--brand);
        box-shadow: 0 0 0 4px var(--bs-body-bg);
      }

      .timeline-date {
        color: var(--brand-text);
        font-size: 0.875rem;
        font-weight: 700;
      }

      .progress {
        --bs-progress-height: 0.75rem;
      }

      /* ---------- 7. Form polish ---------- */
      .form-control:focus {
        border-color: var(--brand);
        box-shadow: 0 0 0 0.25rem rgb(79 70 229 / 0.25);
      }

      textarea.form-control {
        min-height: 8rem;
        resize: vertical;
      }

      /* ---------- 8. Theme: connect Bootstrap to my tokens ---------- */
      :root,
      [data-bs-theme="light"] {
        --bs-primary: #4f46e5;
        --bs-primary-rgb: 79, 70, 229;
        --bs-link-color: #4338ca;
        --bs-link-color-rgb: 67, 56, 202;
        --bs-link-hover-color: #3730a3;
        --bs-link-hover-color-rgb: 55, 48, 163;
        --bs-body-bg: #fbfbfe;
        --bs-body-bg-rgb: 251, 251, 254;
        --bs-tertiary-bg: #f3f4fb;
        --bs-tertiary-bg-rgb: 243, 244, 251;
      }

      [data-bs-theme="dark"] {
        --brand-text: #a5b4fc;
        --brand-soft: #1e1b4b;
        --accent-soft: #083344;
        --bs-link-color: #a5b4fc;
        --bs-link-color-rgb: 165, 180, 252;
        --bs-link-hover-color: #c7d2fe;
        --bs-link-hover-color-rgb: 199, 210, 254;
        --bs-body-bg: #0f1020;
        --bs-body-bg-rgb: 15, 16, 32;
        --bs-tertiary-bg: #171933;
        --bs-tertiary-bg-rgb: 23, 25, 51;
      }

      .btn-primary {
        --bs-btn-bg: var(--brand);
        --bs-btn-border-color: var(--brand);
        --bs-btn-hover-bg: var(--brand-dark);
        --bs-btn-hover-border-color: var(--brand-dark);
        --bs-btn-active-bg: #3730a3;
        --bs-btn-active-border-color: #3730a3;
        --bs-btn-disabled-bg: var(--brand);
        --bs-btn-disabled-border-color: var(--brand);
        --bs-btn-focus-shadow-rgb: 79, 70, 229;
      }

      .btn-outline-primary {
        --bs-btn-color: var(--brand-text);
        --bs-btn-border-color: var(--brand);
        --bs-btn-hover-bg: var(--brand);
        --bs-btn-hover-border-color: var(--brand);
        --bs-btn-active-bg: var(--brand-dark);
        --bs-btn-active-border-color: var(--brand-dark);
        --bs-btn-focus-shadow-rgb: 79, 70, 229;
      }

      .btn-outline-secondary {
        --bs-btn-color: var(--bs-body-color);
        --bs-btn-border-color: var(--bs-secondary-color);
      }

      .card {
        --bs-card-border-radius: var(--radius);
        --bs-card-inner-border-radius: calc(var(--radius) - 1px);
      }

      .progress {
        --bs-progress-bar-bg: var(--brand);
      }

      .project-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .project-card:hover,
      .project-card:focus-within {
        transform: translateY(-6px);
        box-shadow: var(--bs-box-shadow-lg);
      }

      @media (prefers-reduced-motion: reduce) {
        .project-card {
          transition: none;
        }

        .project-card:hover,
        .project-card:focus-within {
          transform: none;
        }
      }

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


      // 4. Contact form: show friendly validation messages.
      function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) {
          return;
        }
        const status = document.getElementById('form-status');

        form.addEventListener('submit', (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            status.textContent = 'Please fix the highlighted fields and try again.';
            status.classList.add('text-danger-emphasis');
            form.querySelector(':invalid').focus();
          } else {
            status.textContent = 'Sending your message...';
            status.classList.remove('text-danger-emphasis');
          }
          form.classList.add('was-validated');
        });
      }

      initContactForm();


      // 5. Dark mode toggle: Bootstrap 5.3 switches colours when <html> has data-bs-theme="dark".
      function initThemeToggle() {
        const navCollapse = document.querySelector('.navbar-collapse');
        if (!navCollapse) {
          return;
        }

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.id = 'theme-toggle';
        toggle.className = 'btn btn-outline-secondary btn-sm ms-lg-3 mb-3 mb-lg-0 align-self-start';
        toggle.textContent = 'Dark mode';
        navCollapse.appendChild(toggle);

        function readSavedTheme() {
          try {
            return localStorage.getItem('theme');
          } catch (error) {
            return null; // storage can be blocked (private windows, sandboxed previews)
          }
        }

        function saveTheme(theme) {
          try {
            localStorage.setItem('theme', theme);
          } catch (error) {
            // not saving is fine, the page still works
          }
        }

        function applyTheme(theme) {
          document.documentElement.setAttribute('data-bs-theme', theme);
          toggle.setAttribute('aria-pressed', String(theme === 'dark'));
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let theme = readSavedTheme() || (prefersDark ? 'dark' : 'light');
        applyTheme(theme);

        toggle.addEventListener('click', () => {
          theme = theme === 'dark' ? 'light' : 'dark';
          applyTheme(theme);
          saveTheme(theme);
        });
      }

      initThemeToggle();
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
      <body data-page="about" class="d-flex flex-column min-vh-100">
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
              <h1 class="fw-bold">About me</h1>
              <p class="lead mb-0">Career changer, curious learner, and a developer who likes explaining things clearly.</p>
            </div>
          </section>

          <section class="py-5">
            <div class="container">
              <div class="row gy-5 gx-lg-5">
                <aside class="col-lg-4" aria-labelledby="facts-title">
                  <div class="text-center mb-4">
                    <div class="avatar" role="img" aria-label="Alex Rivers, shown as the initials AR on a gradient circle">AR</div>
                  </div>
                  <h2 id="facts-title" class="h4">Quick facts</h2>
                  <dl class="row mb-0">
                    <dt class="col-5">Based in</dt>
                    <dd class="col-7">Lisbon, Portugal</dd>
                    <dt class="col-5">Focus</dt>
                    <dd class="col-7">Front-end development</dd>
                    <dt class="col-5">Learning</dt>
                    <dd class="col-7">React and TypeScript</dd>
                    <dt class="col-5">Languages</dt>
                    <dd class="col-7">English, Portuguese</dd>
                    <dt class="col-5">Available</dt>
                    <dd class="col-7">From January</dd>
                  </dl>
                </aside>

                <div class="col-lg-8">
                  <h2 class="h3 fw-bold">My story</h2>
                  <p>I spent three years in customer support, listening to people struggle with websites that were confusing, slow or impossible to use with a keyboard. I wanted to be the person who fixes those problems at the source, so I taught myself to code in the evenings.</p>
                  <p>Today I build small, fast sites with HTML, CSS, JavaScript and Bootstrap. I care about readable code, clear words on the page and accessibility from the first line, not as an afterthought.</p>

                  <h2 class="h3 fw-bold mt-5">Experience and education</h2>
                  <ol class="timeline mt-4">
                    <li class="timeline-item">
                      <p class="timeline-date mb-1">2026 to now</p>
                      <h3 class="h5 mb-1">Junior Web Developer, Brightside Studio</h3>
                      <p class="text-body-secondary mb-0">Building and maintaining websites for small businesses, fixing accessibility issues found in audits and reviewing pull requests with the team.</p>
                    </li>
                    <li class="timeline-item">
                      <p class="timeline-date mb-1">2025</p>
                      <h3 class="h5 mb-1">Freelance web developer</h3>
                      <p class="text-body-secondary mb-0">Designed and launched three sites for local shops, including contact forms, basic SEO and a short guide so the owners could edit their own text.</p>
                    </li>
                    <li class="timeline-item">
                      <p class="timeline-date mb-1">2024 to 2025</p>
                      <h3 class="h5 mb-1">Front-end web development course</h3>
                      <p class="text-body-secondary mb-0">A year of part-time study covering HTML, CSS, JavaScript, Git and accessibility, finished with a capstone project called Pocket Budget.</p>
                    </li>
                    <li class="timeline-item">
                      <p class="timeline-date mb-1">2021 to 2024</p>
                      <h3 class="h5 mb-1">Customer support specialist</h3>
                      <p class="text-body-secondary mb-0">Answered hundreds of questions a week. I learned to explain things simply and to notice exactly where people get stuck.</p>
                    </li>
                  </ol>

                  <h2 class="h3 fw-bold mt-5">Skills</h2>
                  <div class="mt-4">
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-html">HTML</span><span aria-hidden="true">90%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-html" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 90%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-css">CSS</span><span aria-hidden="true">85%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-css" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 85%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-js">JavaScript</span><span aria-hidden="true">70%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-js" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 70%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-bootstrap">Bootstrap</span><span aria-hidden="true">85%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-bootstrap" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 85%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-git">Git and GitHub</span><span aria-hidden="true">65%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-git" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 65%"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between"><span id="skill-a11y">Accessibility</span><span aria-hidden="true">75%</span></div>
                      <div class="progress" role="progressbar" aria-labelledby="skill-a11y" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: 75%"></div>
                      </div>
                    </div>
                  </div>
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
      <body data-page="contact" class="d-flex flex-column min-vh-100">
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
              <h1 class="fw-bold">Get in touch</h1>
              <p class="lead mb-0">Have a question, a role or a project? Send me a message and I will reply within two working days.</p>
            </div>
          </section>

          <section class="py-5">
            <div class="container">
              <div class="row gy-5 gx-lg-5">
                <div class="col-lg-7">
                  <h2 class="h4 mb-3">Send me a message</h2>
                  <form id="contact-form" action="https://formspree.io/f/your-form-id" method="post" novalidate>
                    <div class="mb-3">
                      <label for="name" class="form-label">Your name</label>
                      <input type="text" class="form-control" id="name" name="name" autocomplete="name" required aria-describedby="name-error">
                      <div class="invalid-feedback" id="name-error">Please tell me your name.</div>
                    </div>
                    <div class="mb-3">
                      <label for="email" class="form-label">Your email</label>
                      <input type="email" class="form-control" id="email" name="email" autocomplete="email" required aria-describedby="email-error">
                      <div class="invalid-feedback" id="email-error">Please enter a valid email address, like name@example.com.</div>
                    </div>
                    <div class="mb-3">
                      <label for="message" class="form-label">Message</label>
                      <textarea class="form-control" id="message" name="message" rows="5" minlength="10" required aria-describedby="message-error"></textarea>
                      <div class="invalid-feedback" id="message-error">Please write at least 10 characters.</div>
                    </div>
                    <div class="d-flex flex-wrap align-items-center gap-3">
                      <button type="submit" class="btn btn-primary btn-lg">Send message</button>
                      <p id="form-status" class="mb-0" role="status"></p>
                    </div>
                  </form>
                </div>

                <div class="col-lg-5">
                  <div class="card">
                    <div class="card-body">
                      <h2 class="h4 card-title">Other ways to reach me</h2>
                      <p class="card-text text-body-secondary">Prefer your own email app or a quick look at my code? These work too.</p>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item px-0">Email: <a href="mailto:hello@alexrivers.dev">hello@alexrivers.dev</a></li>
                        <li class="list-group-item px-0">GitHub: <a href="https://github.com/alexrivers" target="_blank" rel="noopener noreferrer">github.com/alexrivers</a></li>
                        <li class="list-group-item px-0">LinkedIn: <a href="https://www.linkedin.com/in/alexrivers" target="_blank" rel="noopener noreferrer">linkedin.com/in/alexrivers</a></li>
                        <li class="list-group-item px-0">Based in Lisbon, Portugal (open to remote work)</li>
                      </ul>
                    </div>
                  </div>
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
  - q: Why do light theme overrides go on ":root, [data-bs-theme="light"]" and not just on :root?
    options:
      - Because :root does not work in Bootstrap
      - Because a plain :root rule from your file would also win over Bootstrap's dark theme and keep the page light
      - Because browsers ignore variables on :root
    answer: 1
    explain: Bootstrap defines the light values on ":root, [data-bs-theme=light]" and the dark ones on [data-bs-theme=dark]. Matching the same selectors keeps the specificity equal, so the dark rules can still apply.
  - q: You set --bs-primary to your brand colour, but the .btn-primary buttons stay blue. Why?
    options:
      - The page needs to be reloaded
      - Bootstrap 5.3 buttons read their own variables such as --bs-btn-bg, which you must override on .btn-primary
      - Buttons can only be recoloured with Sass
    answer: 1
  - q: What does the prefers-reduced-motion media query protect?
    options:
      - People on slow internet connections
      - Phones with a small battery
      - People who get dizzy or distracted from animation and asked their system for less motion
    answer: 2
---
A site that looks like everybody else's Bootstrap site is forgettable. Now you give yours a personality, a dark mode, and a few subtle movements.

## Where we are

All four pages work. Colours come partly from Bootstrap (buttons, links, badges) and partly from your own variables (hero, avatar, thumbnails). The two are not yet connected: a blue Bootstrap button sits next to indigo gradients.

## What we will add, and why it matters

1. A **theme layer** in `css/style.css` that makes Bootstrap use your brand colours.
2. A **dark mode** switch. Since version 5.3 Bootstrap supports colour modes: set `data-bs-theme="dark"` on the `html` element and every component changes its colours. Many visitors prefer dark mode, and offering it signals care.
3. **Hover polish** on the project cards, with respect for visitors who prefer less motion.

All three use CSS variables, which is how modern Bootstrap is meant to be customised without Sass (a build tool for CSS that you may learn later).

## Guided walk-through

**1. Override Bootstrap's variables.** Bootstrap declares its colours as `--bs-*` custom properties. Your stylesheet comes later, so equal rules from you win. Keep the same selector Bootstrap uses for the light theme:

```css
:root,
[data-bs-theme="light"] {
  --bs-primary: #4f46e5;
  --bs-primary-rgb: 79, 70, 229;
  --bs-link-color-rgb: 67, 56, 202;
  --bs-body-bg: #fbfbfe;
}
```

Why the second selector? A plain `:root` rule from you would have the same weight as Bootstrap's `[data-bs-theme=dark]` rule, and since yours comes later it would win and break dark mode. Matching Bootstrap's selectors avoids that. Notice the `-rgb` twins: parts of Bootstrap build colours as `rgba(var(--bs-primary-rgb), ...)`, so you must update both values. Links read `--bs-link-color-rgb`, not `--bs-link-color`.

**2. The dark theme** only needs to change what differs: the page background, the link colour and your own tokens:

```css
[data-bs-theme="dark"] {
  --brand-text: #a5b4fc;
  --bs-body-bg: #0f1020;
}
```

Because the hero gradient is built from `var(--brand-soft)`, `var(--bs-body-bg)` and `var(--accent-soft)`, it changes with the theme automatically. That is the reward for using variables from the start.

**3. Components keep their own variables.** In Bootstrap 5.3 `.btn-primary` does not read `--bs-primary`. It declares `--bs-btn-bg` and friends. Override those on the class:

```css
.btn-primary {
  --bs-btn-bg: var(--brand);
  --bs-btn-border-color: var(--brand);
  --bs-btn-hover-bg: var(--brand-dark);
}
```

Cards work the same way: `.card { --bs-card-border-radius: var(--radius); }` rounds every card. Bootstrap's grey outline buttons are a little too pale on a tinted or dark background, so give `.btn-outline-secondary` the body text colour (`--bs-btn-color: var(--bs-body-color)`), which adapts to both themes.

**4. The toggle in JavaScript.** Create the button in `main.js` (so you do not paste it into four pages), start from the saved choice or the system preference, and flip the attribute on click:

```js
document.documentElement.setAttribute('data-bs-theme', theme);
toggle.setAttribute('aria-pressed', String(theme === 'dark'));
```

Use the button label "Dark mode" and let `aria-pressed` say whether it is on. Saving the choice with `localStorage` is a nice touch, but storage can be blocked (private windows, this preview), so always wrap it in `try { ... } catch { ... }`.

**5. Hover effects.** A transition animates the change between two states. Also trigger it with `:focus-within`, so keyboard users get the same feedback, and switch the motion off for people who asked for less:

```css
.project-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.project-card:hover, .project-card:focus-within { transform: translateY(-6px); }
@media (prefers-reduced-motion: reduce) { .project-card { transition: none; } }
```

> **Watch out:**
> - Changing `--bs-primary` alone does not recolour buttons. Override the button's own variables.
> - Hard-coded colours (`#fff`, `black`) in your own CSS do not follow the theme. Use variables such as `var(--bs-body-bg)`.
> - Do not rely on hover alone. Touch screens have no hover, and keyboards need `:focus-within` or `:focus-visible`.
> - Reading `localStorage` without `try/catch` can throw an error `SecurityError` in sandboxed or private contexts and stop your whole script.

> **Your turn:** in `css/style.css` add the light and dark variable blocks, the `.btn-primary` and `.btn-outline-primary` overrides, the `.card` radius, the `.progress` bar colour and the hover rules with the reduced-motion query. In `js/main.js` write `initThemeToggle()` that adds `button#theme-toggle` to `.navbar-collapse`, sets `data-bs-theme` on `<html>` from the saved or system preference and flips it on click.
