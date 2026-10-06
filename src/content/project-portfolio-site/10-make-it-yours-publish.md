---
title: 'Step 10: Make it yours and publish'
summary: Add publishing details (canonical link, structured data, a 404 page), replace every placeholder with your own details, test, and put the site online for free.
level: advanced
export:
  kind: static
  name: portfolio-site
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
        <meta name="description" content="Portfolio of Alex Rivers, a junior web developer in Lisbon who builds fast, accessible, responsive websites with HTML, CSS, JavaScript and Bootstrap.">
        <meta name="author" content="Alex Rivers">
        <meta name="theme-color" content="#4f46e5">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Alex Rivers | Junior Web Developer">
        <meta property="og:description" content="Fast, accessible, responsive websites built with HTML, CSS, JavaScript and Bootstrap. See my projects and get in touch.">
        <meta property="og:url" content="https://alexrivers.github.io/">
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Ctext x='32' y='43' font-size='28' font-weight='700' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3EAR%3C/text%3E%3C/svg%3E">
        <!-- TODO 1: publishing details. In this head add a canonical link that points to your final web address, and a script of type application/ld+json that describes you as a schema.org Person (name, jobTitle, url, sameAs). -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="home" class="d-flex flex-column min-vh-100">
        <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
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

        <main id="main" tabindex="-1" class="flex-grow-1">
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
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer" aria-label="Cafe Bloom source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/pocket-budget" target="_blank" rel="noopener noreferrer" aria-label="Pocket Budget source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/weather-now" target="_blank" rel="noopener noreferrer" aria-label="Weather Now source code (opens in a new tab)">Source code</a>
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
  - name: 404.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Page not found | Alex Rivers</title>
        <!-- TODO 1: tell search engines not to index this page: a meta tag named robots with the content noindex. -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="d-flex flex-column min-vh-100 justify-content-center text-center">
        <!-- TODO 2: replace the placeholder main below. Inside main add a big 404 (hide it from screen readers with aria-hidden), an h1 that says Page not found, a short lead paragraph and a button-styled link back to index.html. -->
        <main class="container py-5">
          <h1 class="h2">The 404 page is finished in step 10</h1>
          <p><a href="index.html">Back to the home page</a></p>
        </main>
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
        <meta name="description" content="Selected web projects by Alex Rivers: responsive Bootstrap sites, JavaScript apps and CSS experiments. Filter them by type and open the source code.">
        <meta name="author" content="Alex Rivers">
        <meta name="theme-color" content="#4f46e5">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Projects | Alex Rivers">
        <meta property="og:description" content="Responsive sites, JavaScript apps and CSS experiments by Alex Rivers.">
        <meta property="og:url" content="https://alexrivers.github.io/projects.html">
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Ctext x='32' y='43' font-size='28' font-weight='700' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3EAR%3C/text%3E%3C/svg%3E">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="projects" class="d-flex flex-column min-vh-100">
        <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
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

        <main id="main" tabindex="-1" class="flex-grow-1">
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/cafe-bloom/" target="_blank" rel="noopener noreferrer" aria-label="Cafe Bloom live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer" aria-label="Cafe Bloom source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/pocket-budget/" target="_blank" rel="noopener noreferrer" aria-label="Pocket Budget live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/pocket-budget" target="_blank" rel="noopener noreferrer" aria-label="Pocket Budget source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/weather-now/" target="_blank" rel="noopener noreferrer" aria-label="Weather Now live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/weather-now" target="_blank" rel="noopener noreferrer" aria-label="Weather Now source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/todo-board/" target="_blank" rel="noopener noreferrer" aria-label="Todo Board live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/todo-board" target="_blank" rel="noopener noreferrer" aria-label="Todo Board source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/portfolio/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio Site live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/portfolio" target="_blank" rel="noopener noreferrer" aria-label="Portfolio Site source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/css-animation-lab/" target="_blank" rel="noopener noreferrer" aria-label="CSS Animation Lab live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/css-animation-lab" target="_blank" rel="noopener noreferrer" aria-label="CSS Animation Lab source code (opens in a new tab)">Source code</a>
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
        <meta name="description" content="About Alex Rivers: a career changer from customer support who became a junior web developer. Read the story, the timeline and the skills.">
        <meta name="author" content="Alex Rivers">
        <meta name="theme-color" content="#4f46e5">
        <meta property="og:type" content="profile">
        <meta property="og:title" content="About | Alex Rivers">
        <meta property="og:description" content="From customer support to web development: the story, timeline and skills of Alex Rivers.">
        <meta property="og:url" content="https://alexrivers.github.io/about.html">
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Ctext x='32' y='43' font-size='28' font-weight='700' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3EAR%3C/text%3E%3C/svg%3E">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="about" class="d-flex flex-column min-vh-100">
        <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
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

        <main id="main" tabindex="-1" class="flex-grow-1">
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
        <meta name="description" content="Contact Alex Rivers about junior web developer roles or freelance projects. Send a message with the form or write to hello@alexrivers.dev.">
        <meta name="author" content="Alex Rivers">
        <meta name="theme-color" content="#4f46e5">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Contact | Alex Rivers">
        <meta property="og:description" content="Say hello: send a message or find Alex Rivers on GitHub and LinkedIn.">
        <meta property="og:url" content="https://alexrivers.github.io/contact.html">
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Ctext x='32' y='43' font-size='28' font-weight='700' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3EAR%3C/text%3E%3C/svg%3E">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="contact" class="d-flex flex-column min-vh-100">
        <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
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

        <main id="main" tabindex="-1" class="flex-grow-1">
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

      /* ---------- 9. Accessibility helpers ---------- */
      :focus-visible {
        outline: 3px solid var(--brand-text);
        outline-offset: 3px;
      }

      .skip-link:focus {
        position: fixed;
        top: 0.75rem;
        left: 0.75rem;
        z-index: 2000;
        padding: 0.5rem 1rem;
        color: var(--bs-body-color);
        background: var(--bs-body-bg);
        border-radius: 0.5rem;
        box-shadow: var(--bs-box-shadow);
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
check:
  page: index.html
  dom:
    selectors:
      - html[lang="en"]
      - link[rel="canonical"]
      - script[type="application/ld+json"]
      - meta[name="description"]
      - main#main
      - header.sticky-top nav.navbar
      - section.hero h1
      - '#skills .skill-card'
      - '#featured .project-card'
      - section.cta
      - footer.site-footer
  code:
    - file: index.html
      pattern: '<link[^>]+rel="canonical"[^>]+href="https://'
      message: 'Add <link rel="canonical" href="https://..."> to the head with your final web address.'
    - file: index.html
      pattern: '"@context"\s*:\s*"https://schema\.org"'
      message: 'The structured data needs "@context": "https://schema.org".'
    - file: index.html
      pattern: '"@type"\s*:\s*"Person"'
      message: 'Describe yourself as a Person in the structured data: "@type": "Person".'
    - file: index.html
      pattern: '"sameAs"\s*:\s*\['
      message: 'Add "sameAs": [ ... ] with the addresses of your GitHub and LinkedIn profiles.'
    - file: 404.html
      pattern: '<meta[^>]+name="robots"[^>]+content="noindex"'
      message: '404.html should have <meta name="robots" content="noindex"> so search engines skip it.'
    - file: 404.html
      pattern: '<h1[^>]*>\s*Page not found'
      message: 'The 404 page needs an h1 that says Page not found.'
    - file: 404.html
      pattern: '<a[^>]+class="[^"]*btn[^"]*"[^>]+href="index\.html"'
      message: 'Add a button-styled link back to index.html.'
hints:
  - 'Two small additions plus the personal work. In index.html add two things to the head: a canonical link and a script of type application/ld+json. In 404.html add the noindex meta tag in the head and the page content inside main. Replacing the placeholder details with your own is up to you, the checker accepts any text.'
  - 'Canonical: <link rel="canonical" href="https://yourname.github.io/">. Structured data: <script type="application/ld+json"> containing one JSON object with "@context": "https://schema.org", "@type": "Person", "name", "jobTitle", "url" and "sameAs": [two profile URLs]. 404.html: <meta name="robots" content="noindex"> in the head; in main an h1 "Page not found", a p.lead and an a.btn.btn-primary with href="index.html".'
  - '<link rel="canonical" href="https://alexrivers.github.io/">   <script type="application/ld+json">{ "@context": "https://schema.org", "@type": "Person", "name": "Alex Rivers", "jobTitle": "Junior Web Developer", "url": "https://alexrivers.github.io/", "sameAs": ["https://github.com/alexrivers", "https://www.linkedin.com/in/alexrivers"] }</script>   404.html: <meta name="robots" content="noindex">   <main class="container py-5"><p class="display-1 fw-bold text-primary mb-0" aria-hidden="true">404</p><h1 class="h2 mb-3">Page not found</h1><p class="lead mb-4">Sorry, that page does not exist.</p><a class="btn btn-primary btn-lg" href="index.html">Back to the home page</a></main>'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Alex Rivers | Junior Web Developer</title>
        <meta name="description" content="Portfolio of Alex Rivers, a junior web developer in Lisbon who builds fast, accessible, responsive websites with HTML, CSS, JavaScript and Bootstrap.">
        <meta name="author" content="Alex Rivers">
        <meta name="theme-color" content="#4f46e5">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Alex Rivers | Junior Web Developer">
        <meta property="og:description" content="Fast, accessible, responsive websites built with HTML, CSS, JavaScript and Bootstrap. See my projects and get in touch.">
        <meta property="og:url" content="https://alexrivers.github.io/">
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Ctext x='32' y='43' font-size='28' font-weight='700' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3EAR%3C/text%3E%3C/svg%3E">
        <link rel="canonical" href="https://alexrivers.github.io/">
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Alex Rivers",
          "jobTitle": "Junior Web Developer",
          "url": "https://alexrivers.github.io/",
          "sameAs": [
            "https://github.com/alexrivers",
            "https://www.linkedin.com/in/alexrivers"
          ]
        }
        </script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="home" class="d-flex flex-column min-vh-100">
        <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
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

        <main id="main" tabindex="-1" class="flex-grow-1">
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
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer" aria-label="Cafe Bloom source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/pocket-budget" target="_blank" rel="noopener noreferrer" aria-label="Pocket Budget source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/weather-now" target="_blank" rel="noopener noreferrer" aria-label="Weather Now source code (opens in a new tab)">Source code</a>
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
  - name: 404.html
    code: |
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Page not found | Alex Rivers</title>
        <meta name="robots" content="noindex">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="d-flex flex-column min-vh-100 justify-content-center text-center">
        <main class="container py-5">
          <p class="display-1 fw-bold text-primary mb-0" aria-hidden="true">404</p>
          <h1 class="h2 mb-3">Page not found</h1>
          <p class="lead mb-4">Sorry, that page does not exist or has moved. Let's get you back on track.</p>
          <a class="btn btn-primary btn-lg" href="index.html">Back to the home page</a>
        </main>
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
        <meta name="description" content="Selected web projects by Alex Rivers: responsive Bootstrap sites, JavaScript apps and CSS experiments. Filter them by type and open the source code.">
        <meta name="author" content="Alex Rivers">
        <meta name="theme-color" content="#4f46e5">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Projects | Alex Rivers">
        <meta property="og:description" content="Responsive sites, JavaScript apps and CSS experiments by Alex Rivers.">
        <meta property="og:url" content="https://alexrivers.github.io/projects.html">
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Ctext x='32' y='43' font-size='28' font-weight='700' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3EAR%3C/text%3E%3C/svg%3E">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="projects" class="d-flex flex-column min-vh-100">
        <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
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

        <main id="main" tabindex="-1" class="flex-grow-1">
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/cafe-bloom/" target="_blank" rel="noopener noreferrer" aria-label="Cafe Bloom live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer" aria-label="Cafe Bloom source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/pocket-budget/" target="_blank" rel="noopener noreferrer" aria-label="Pocket Budget live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/pocket-budget" target="_blank" rel="noopener noreferrer" aria-label="Pocket Budget source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/weather-now/" target="_blank" rel="noopener noreferrer" aria-label="Weather Now live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/weather-now" target="_blank" rel="noopener noreferrer" aria-label="Weather Now source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/todo-board/" target="_blank" rel="noopener noreferrer" aria-label="Todo Board live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/todo-board" target="_blank" rel="noopener noreferrer" aria-label="Todo Board source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/portfolio/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio Site live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/portfolio" target="_blank" rel="noopener noreferrer" aria-label="Portfolio Site source code (opens in a new tab)">Source code</a>
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
                      <a class="btn btn-sm btn-primary" href="https://alexrivers.github.io/css-animation-lab/" target="_blank" rel="noopener noreferrer" aria-label="CSS Animation Lab live demo (opens in a new tab)">Live demo</a>
                      <a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/css-animation-lab" target="_blank" rel="noopener noreferrer" aria-label="CSS Animation Lab source code (opens in a new tab)">Source code</a>
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
        <meta name="description" content="About Alex Rivers: a career changer from customer support who became a junior web developer. Read the story, the timeline and the skills.">
        <meta name="author" content="Alex Rivers">
        <meta name="theme-color" content="#4f46e5">
        <meta property="og:type" content="profile">
        <meta property="og:title" content="About | Alex Rivers">
        <meta property="og:description" content="From customer support to web development: the story, timeline and skills of Alex Rivers.">
        <meta property="og:url" content="https://alexrivers.github.io/about.html">
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Ctext x='32' y='43' font-size='28' font-weight='700' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3EAR%3C/text%3E%3C/svg%3E">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="about" class="d-flex flex-column min-vh-100">
        <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
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

        <main id="main" tabindex="-1" class="flex-grow-1">
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
        <meta name="description" content="Contact Alex Rivers about junior web developer roles or freelance projects. Send a message with the form or write to hello@alexrivers.dev.">
        <meta name="author" content="Alex Rivers">
        <meta name="theme-color" content="#4f46e5">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Contact | Alex Rivers">
        <meta property="og:description" content="Say hello: send a message or find Alex Rivers on GitHub and LinkedIn.">
        <meta property="og:url" content="https://alexrivers.github.io/contact.html">
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3Ctext x='32' y='43' font-size='28' font-weight='700' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3EAR%3C/text%3E%3C/svg%3E">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css">
      </head>
      <body data-page="contact" class="d-flex flex-column min-vh-100">
        <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
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

        <main id="main" tabindex="-1" class="flex-grow-1">
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

      /* ---------- 9. Accessibility helpers ---------- */
      :focus-visible {
        outline: 3px solid var(--brand-text);
        outline-offset: 3px;
      }

      .skip-link:focus {
        position: fixed;
        top: 0.75rem;
        left: 0.75rem;
        z-index: 2000;
        padding: 0.5rem 1rem;
        color: var(--bs-body-color);
        background: var(--bs-body-bg);
        border-radius: 0.5rem;
        box-shadow: var(--bs-box-shadow);
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
quiz:
  - q: What is the job of the canonical link?
    options:
      - It tells search engines which web address is the official one for this page, so copies do not compete with each other
      - It redirects visitors to another website
      - It loads the page faster
    answer: 0
  - q: Why does the 404.html page contain a noindex robots meta tag?
    options:
      - So that the page loads faster
      - So that visitors cannot see the page
      - So that search engines do not list your "not found" page as if it were real content
    answer: 2
  - q: Which is the best way to find out how fast and accessible your finished site really is?
    options:
      - Ask a friend whether it looks nice
      - Run a Lighthouse audit in Chrome DevTools, fix what it reports, and test on a real phone
      - Count the lines of code
    answer: 1
---
This is the last step. The code is nearly done; what is left is turning "Alex Rivers" into *you*, checking the quality, and putting the site where the world can see it.

## Where we are

Four polished pages with a Bootstrap base, your own theme, dark mode, filters, a validated form, and an accessibility pass. Everything is still filled with the placeholder persona Alex Rivers.

## What we will add, and why it matters

Two professional finishing touches, then the personal work:

- **Publishing details in the head.** A *canonical link* names the official address of the page. *Structured data* (JSON-LD, using the schema.org vocabulary) describes you to search engines in a format machines read directly.
- **A 404 page.** GitHub Pages and Netlify show a file called `404.html` when a visitor types a wrong address. A friendly page with a way back keeps people on your site.

## Guided walk-through

**1. Canonical and structured data** go into the head of `index.html`:

```html
<link rel="canonical" href="https://alexrivers.github.io/">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alex Rivers",
  "jobTitle": "Junior Web Developer",
  "url": "https://alexrivers.github.io/",
  "sameAs": ["https://github.com/alexrivers"]
}
</script>
```

The JSON must be valid: double quotes only and no comma after the last item.

**2. The 404 page.** Open `404.html`. In the head add `<meta name="robots" content="noindex">`. In `main` write a big "404" (hidden from screen readers with `aria-hidden`), an `h1` that says "Page not found", a short `lead` paragraph, and a button-styled link to `index.html`. This page loads only Bootstrap from the CDN and has no own CSS, because on a wrongly typed deep address a relative path such as `css/style.css` would point at the wrong place.

**3. Make it yours.** Use search and replace in your editor for each item:

- [ ] Name, initials (avatar, favicon, `AR` labels), job title and hero text
- [ ] Email address, GitHub and LinkedIn addresses (footer, contact page, JSON-LD)
- [ ] Your real projects: titles, descriptions, badges, links, categories
- [ ] Timeline and skills: only what is true, in your own words
- [ ] The form action (create a free Formspree form and paste its address)
- [ ] `og:url`, `canonical` and the `sameAs` list with your final web address
- [ ] The accent colours in the `:root` block if you want a different look

**4. Test.** Open every page and click every link. Resize the window down to phone width. Press Tab through each page and watch the focus. Try dark mode. Then open Chrome DevTools, choose **Lighthouse**, tick Performance, Accessibility, Best Practices and SEO, and run it. Scores above 90 are a realistic goal for this site. Read the report: each failing item explains the fix.

**5. Publish for free.** Use **Download project** in the academy; the folder contains a README with the exact steps. In short:

- **GitHub Pages:** create a repository named `yourname.github.io`, upload the files, then Settings, Pages, deploy from the main branch.
- **Netlify:** drag the project folder onto the Netlify "Deploys" page. It gives you an address immediately and has built-in form handling.
- **Vercel:** import the GitHub repository; plain HTML needs no settings.

Afterwards update the canonical, `og:url` and form address to the real domain.

> **Watch out:**
> - Leave placeholders in and an employer will see "Alex Rivers" on your site. Search for `alexrivers` and `Alex` before you publish.
> - File names on web servers are case-sensitive. `Index.html` and `index.html` are different files online, even if your computer treats them as equal.
> - Links to your own pages must be relative (`about.html`, not `C:\Users\...`).
> - Never publish secrets (API keys, passwords) in a static site. Everything in your files is public.

## What to build next

- Add real screenshots to project cards (with `alt` text, `loading="lazy"` and width and height attributes).
- Write a small blog section, or move the repeated navbar into a template using a static site generator such as Eleventy or Astro.
- Learn Sass to customise Bootstrap at the source, or try Tailwind CSS for a utility-first approach.
- Add an `og:image`, a sitemap and a custom domain.
- Rebuild the projects page with React, using the Dev Blog project as a guide.

> **Your turn:** in `index.html` add the canonical link and the JSON-LD script (`@context`, `@type` Person, name, jobTitle, url and `sameAs`) to the head. In `404.html` add the `noindex` meta tag and the page content inside `main`: a `404`, an `h1` that says "Page not found", a short paragraph and a `btn` link to `index.html`. Then work through the checklist and publish. Congratulations, you built a real website.
