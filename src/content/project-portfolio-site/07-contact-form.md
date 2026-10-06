---
title: 'Step 7: An accessible contact form with validation'
summary: Build the contact page with labelled fields, Bootstrap validation styles, a friendly JavaScript message and a form-service action.
level: intermediate
runner: web
files:
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
      <!-- TODO 1: this page is only a placeholder so far. Replace everything from the body tag below to its closing tag with the real page (see the walk-through): body attributes, the navbar and footer copied from index.html, a page header, the contact form and a card with other ways to reach you. -->
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


      // TODO 1: initContactForm(). Find #contact-form and #form-status (return early if the form is missing).
      //   On 'submit': if form.checkValidity() is false, call event.preventDefault(), write a helpful message into the status
      //   element, and move focus to the first invalid field (form.querySelector(':invalid').focus()).
      //   Otherwise write "Sending your message..." and let the browser send the form.
      //   Always add the class 'was-validated' to the form so Bootstrap shows the red and green states. Call it at the end.

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
      /* TODO 3: .form-control:focus gets border-color var(--brand) and a soft box-shadow ring (0 0 0 0.25rem rgb(79 70 229 / 0.25)).
           textarea.form-control gets min-height 8rem and resize: vertical. */


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
  page: contact.html
  dom:
    text:
      - Get in touch
      - Send me a message
      - Your name
      - Your email
      - Send message
      - Other ways to reach me
      - hello@alexrivers.dev
    selectors:
      - body[data-page="contact"]
      - .navbar-nav a.nav-link.active[data-page="contact"][aria-current="page"]
      - section.page-header h1
      - 'form#contact-form[novalidate][action][method="post"]'
      - 'label.form-label[for="name"]'
      - 'input#name.form-control[type="text"][required][autocomplete="name"][aria-describedby="name-error"]'
      - 'label.form-label[for="email"]'
      - 'input#email.form-control[type="email"][required][autocomplete="email"][aria-describedby="email-error"]'
      - 'label.form-label[for="message"]'
      - 'textarea#message.form-control[required][minlength="10"][aria-describedby="message-error"]'
      - '#name-error.invalid-feedback'
      - '#email-error.invalid-feedback'
      - '#message-error.invalid-feedback'
      - 'form button.btn.btn-primary[type="submit"]'
      - '#form-status[role="status"]'
      - 'a[href^="mailto:"]'
      - '.card .list-group a[href*="github.com"]'
      - footer.site-footer #year
    styles:
      - selector: .form-control
        property: display
        value: block
      - selector: .form-label
        property: margin-bottom
        value: 8px
      - selector: .invalid-feedback
        property: display
        value: none
      - selector: textarea.form-control
        property: min-height
        value: 128px
  code:
    - file: contact.html
      pattern: '<form[^>]*\baction="https?://'
      message: 'Give the form an action, the address of a form service such as Formspree.'
    - file: contact.html
      pattern: '<form[^>]*\bnovalidate'
      message: 'Add novalidate so the browser does not show its own bubbles; Bootstrap and your script show the messages.'
    - file: js/main.js
      pattern: 'checkValidity\s*\('
      message: 'Use form.checkValidity() to find out whether all fields are valid.'
    - file: js/main.js
      pattern: 'preventDefault\s*\('
      message: 'Stop an invalid form from being sent with event.preventDefault().'
    - file: js/main.js
      pattern: 'was-validated'
      message: 'Add the class was-validated to the form so Bootstrap shows the error messages.'
hints:
  - 'Same recipe as before: replace the placeholder body of contact.html with the full page. The form is the new part. Each field is a div.mb-3 holding a label, a control and a div.invalid-feedback; the control points to its message with aria-describedby.'
  - 'Form tag: <form id="contact-form" action="https://formspree.io/f/your-form-id" method="post" novalidate>. A field: <label for="name" class="form-label">Your name</label><input type="text" class="form-control" id="name" name="name" autocomplete="name" required aria-describedby="name-error"><div class="invalid-feedback" id="name-error">Please tell me your name.</div>. In JavaScript listen for "submit" on the form: if (!form.checkValidity()) { event.preventDefault(); ... } and always form.classList.add("was-validated").'
  - 'function initContactForm() { const form = document.getElementById("contact-form"); if (!form) return; const status = document.getElementById("form-status"); form.addEventListener("submit", (event) => { if (!form.checkValidity()) { event.preventDefault(); status.textContent = "Please fix the highlighted fields and try again."; status.classList.add("text-danger-emphasis"); form.querySelector(":invalid").focus(); } else { status.textContent = "Sending your message..."; status.classList.remove("text-danger-emphasis"); } form.classList.add("was-validated"); }); }   initContactForm();   Also add a textarea (rows="5" minlength="10" required), a submit button.btn.btn-primary, p#form-status[role=status] and the mailto link.'
solution:
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
  - q: What does the novalidate attribute on the form do?
    options:
      - It turns off all validation, including the required attributes
      - It lets your own code and Bootstrap show the messages instead of the browser's default bubbles; checkValidity() still works
      - It makes the form submit twice
    answer: 1
    explain: The validation rules (required, type="email", minlength) still apply. Only the browser's own pop-up is switched off.
  - q: Why is a placeholder not a replacement for a label?
    options:
      - Placeholders are not allowed in forms
      - Labels load faster
      - Placeholders disappear when you type, and many screen readers do not announce them reliably
    answer: 2
  - q: What does aria-describedby="email-error" do?
    options:
      - It links the input to the element with that id, so a screen reader reads the error text after the field name
      - It colours the input red
      - It copies the text into the input
    answer: 0
    explain: aria-describedby points to extra description by id. Here the description is the validation message.
---
A contact page is where visitors turn into conversations. It must be easy to use, easy to understand when something goes wrong, and it must reach you.

## Where we are

Home, Projects and About are finished and share the same navbar and footer. The Contact link still leads to a placeholder.

## What we will add, and why it matters

A form with three fields (name, email, message), validation that explains problems in plain English, and a second route to you: a `mailto:` link and your social profiles. The form must work with a keyboard, with a screen reader and on a phone. Many portfolios fail here, so this is a good place to stand out.

A static site has no server, so the form needs somewhere to go. Two common options: a **form service** (Formspree, Netlify Forms and similar) gives you a web address to put in the form's `action`; or a **`mailto:` link** that opens the visitor's email app. We use the first for the form and the second as a backup. In the academy preview, forms are never really sent; the console shows a short note instead.

## Guided walk-through

**1. The form tag.**

```html
<form id="contact-form" action="https://formspree.io/f/your-form-id" method="post" novalidate>
```

`action` is where the data goes (replace `your-form-id` when you create your free Formspree form), `method="post"` sends it in the request body. `novalidate` switches off the browser's default error bubbles so we can show friendlier messages, but the rules themselves still apply.

**2. One field = label + control + message.**

```html
<div class="mb-3">
  <label for="email" class="form-label">Your email</label>
  <input type="email" class="form-control" id="email" name="email"
         autocomplete="email" required aria-describedby="email-error">
  <div class="invalid-feedback" id="email-error">Please enter a valid email address.</div>
</div>
```

- `for` and `id` connect the label to the input. Clicking the label focuses the field.
- `type="email"` makes the browser check the format and show the right keyboard on phones.
- `required` and `minlength="10"` (on the textarea) are the validation rules.
- `autocomplete` lets the browser fill known values, which is both faster and an accessibility win.
- `name` is the key under which the value is sent. Without it the field is not submitted at all.
- `aria-describedby` links the input to its error text by id.

Bootstrap hides `.invalid-feedback` until the form (or field) is marked as validated, and shows it next to a field that is invalid.

**3. The status line.** A `p` with `role="status"` is a live region. When JavaScript changes its text, screen readers announce the message politely. Put it beside the submit button.

**4. Validate on submit.** Browsers already know whether a field is valid; `checkValidity()` asks them. If the form is not valid, stop the sending with `preventDefault()`, show a message and move the focus to the first problem so keyboard users land in the right place:

```js
form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    form.querySelector(':invalid').focus();
  }
  form.classList.add('was-validated');
});
```

Adding `was-validated` turns on Bootstrap's red and green states and reveals the messages. If the form *is* valid, we do not call `preventDefault()`, so the browser sends it normally.

**5. Other ways to reach you.** A card with a `mailto:` link, your GitHub and LinkedIn. Real links give visitors a choice.

> **Watch out:**
> - A field without `name` is silently left out of the submission.
> - Using `placeholder` text instead of a `label` fails accessibility checks and confuses screen reader users.
> - `invalid-feedback` must come *after* its input as a sibling, because Bootstrap's CSS uses `:invalid ~ .invalid-feedback`.
> - Do not hide errors in red text only. The message text and the focus movement are what make the form usable for everyone.

> **Your turn:** replace the placeholder body in `contact.html` with the full page: body attributes, navbar, `section.page-header` with the `h1` "Get in touch", `form#contact-form` (with `action`, `method="post"` and `novalidate`) with the fields name, email and message, each with a `label.form-label`, a `.form-control` and a `.invalid-feedback`, a primary submit button "Send message" and `p#form-status[role="status"]`. Add a card "Other ways to reach me" with a `mailto:` link to hello@alexrivers.dev and your GitHub link, then the footer. Write `initContactForm()` in `js/main.js` and the small form rules in `css/style.css`.
