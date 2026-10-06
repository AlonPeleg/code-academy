---
title: 'Step 4: Skills, featured projects and a call to action'
summary: Finish the home page with Bootstrap cards for your skills, three featured project cards with CSS thumbnails, and a closing call to action.
level: intermediate
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

          <!-- TODO 4: skills section: section#skills, a heading, and a row of three .col-md-4 columns, each holding a .card.h-100.skill-card with an h3.card-title, a short paragraph and a list of .badge items. -->
          <!-- TODO 5: featured projects: section#featured with a heading, a link to projects.html and a row.row-cols-1.row-cols-md-3 of three article.card.project-card (thumbnail, title, text, badges, footer button). -->
          <!-- TODO 6: call to action: section.cta with a heading, a lead paragraph and a light button that links to contact.html. -->
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
      /* TODO 7: .skill-card gets border-top: 4px solid var(--brand).
           .project-thumb: height 140px, flex-centred white bold text 2.5rem, and rounded top corners using
           var(--bs-card-inner-border-radius). Then six gradient classes .thumb-cafe, .thumb-budget,
           .thumb-weather, .thumb-board, .thumb-portfolio, .thumb-css (135deg gradients, dark enough for white text).
           .cta: a gradient from var(--brand) to var(--brand-dark) with white text. */





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
      - What I work with
      - Featured projects
      - Cafe Bloom
      - Pocket Budget
      - Weather Now
      - Have a project in mind?
      - Say hello
    selectors:
      - section#skills[aria-labelledby="skills-title"] h2#skills-title
      - '#skills .row > .col-md-4:nth-child(3) .card.h-100.skill-card h3.card-title'
      - '#skills .skill-card ul .badge'
      - '#featured.bg-body-tertiary .row.row-cols-1.row-cols-md-3 > .col:nth-child(3) article.card.project-card'
      - '#featured .project-card .project-thumb[aria-hidden="true"]'
      - '#featured .project-card h3.card-title'
      - '#featured .card-footer a.btn[href^="https://github.com/"]'
      - '#featured a[href="projects.html"]'
      - section.cta a.btn.btn-light[href="contact.html"]
    styles:
      - selector: '#skills'
        property: padding-top
        value: 48px
      - selector: '#skills .skill-card'
        property: border-top-width
        value: 4px
      - selector: '#featured .card'
        property: display
        value: flex
      - selector: '#featured .card-title'
        property: font-size
        value: 20px
      - selector: .badge
        property: font-weight
        value: '700'
      - selector: .project-thumb
        property: height
        value: 140px
      - selector: .cta
        property: color
        value: rgb(255, 255, 255)
  code:
    - file: index.html
      pattern: 'row-cols-1\s+row-cols-md-3'
      message: 'Use row-cols-1 row-cols-md-3 on the row that holds the project cards.'
    - file: css/style.css
      pattern: '\.thumb-cafe\s*\{[^}]*linear-gradient'
      message: 'Add the gradient classes for the thumbnails (.thumb-cafe and friends) to css/style.css.'
    - file: css/style.css
      pattern: '\.cta\s*\{[^}]*linear-gradient'
      message: 'Give .cta a gradient background.'
hints:
  - 'You are building three sections, one under the other, inside main: #skills, #featured and .cta. Each one is a section with a container. Skills and featured use a row of three columns; the cards inside are the same Bootstrap component, only the content differs.'
  - 'A skill card is div.col-md-4 > div.card.h-100.skill-card > div.card-body with an h3.h5.card-title, a p.card-text and a ul.list-unstyled.d-flex.flex-wrap.gap-2 full of li > span.badge.text-bg-primary. A project card is div.col > article.card.project-card.h-100 with a div.project-thumb.thumb-cafe (aria-hidden="true") on top, a card-body and a div.card-footer holding an a.btn.btn-sm.btn-outline-primary. The row for projects is row row-cols-1 row-cols-md-3 g-4.'
  - '<section id="featured" class="py-5 bg-body-tertiary" aria-labelledby="featured-title"><div class="container"><h2 id="featured-title" class="fw-bold mb-4">Featured projects</h2><div class="row row-cols-1 row-cols-md-3 g-4"><div class="col"><article class="card project-card h-100"><div class="project-thumb thumb-cafe" aria-hidden="true"><span>CB</span></div><div class="card-body"><h3 class="h5 card-title">Cafe Bloom</h3><p class="card-text text-body-secondary">...</p></div><div class="card-footer bg-transparent border-0 pb-3"><a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer">Source code</a></div></article></div> ...two more... </div></div></section>   Skills and call to action follow the same pattern. CSS: .skill-card { border-top: 4px solid var(--brand); }   .project-thumb { display: flex; align-items: center; justify-content: center; height: 140px; color: #ffffff; }   .thumb-cafe { background: linear-gradient(135deg, #b45309, #be123c); }   .cta { background: linear-gradient(135deg, var(--brand), var(--brand-dark)); color: #ffffff; }'
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
  - q: What does the class h-100 on every card do?
    options:
      - It makes the card exactly 100 pixels high
      - It makes every card as tall as its column, so cards in one row line up even when their text lengths differ
      - It hides the card on screens shorter than 100 pixels
    answer: 1
    explain: Columns in a row are equally tall. h-100 sets height to 100 percent, so the card fills its column.
  - q: What is the advantage of row-cols-1 row-cols-md-3 compared with giving every column col-md-4?
    options:
      - You declare the number of columns once on the row, so the cards need only a plain .col
      - It is the only way to get three columns
      - It loads fewer files
    answer: 0
    explain: Both work. row-cols is handy when you have many identical cards and may change the count later.
  - q: Why do the gradient thumbnails have aria-hidden="true"?
    options:
      - To make them load faster
      - They are decoration with initials only, and the card title already names the project
      - Screen readers cannot read CSS
    answer: 1
---
A visitor who scrolls the home page should learn three things quickly: what you can do, what you have built, and what to do next. That is exactly what you add now.

## Where we are

The home page has a navbar, a hero and a footer. Below the hero there is empty space waiting for content.

## What we will add, and why it matters

Three sections between the hero and the footer:

1. **Skills** (`#skills`): three cards that group your abilities. Recruiters scan for keywords, so badges make them easy to find.
2. **Featured projects** (`#featured`): your best three projects as cards. Show finished work, not promises. The "see all projects" link leads to the full page you build in step 5.
3. **Call to action** (`.cta`): one clear next step at the end of the page. A page that ends without a suggestion loses visitors.

You will reuse the card component for both skills and projects. Learning one Bootstrap component deeply beats memorising ten.

## Guided walk-through

**1. A card is three nested boxes.** A `card` contains a `card-body`, which contains a title, text and anything else. Make the cards in one row equally tall with `h-100`:

```html
<div class="card h-100 skill-card">
  <div class="card-body">
    <h3 class="h5 card-title">Front end</h3>
    <p class="card-text text-body-secondary">One sentence.</p>
  </div>
</div>
```

Why `h3` with the class `h5`? The page outline needs `h1` (hero), `h2` (section) and `h3` (card), so the headings keep their logical order. `.h5` only changes how big the heading looks.

**2. Badges as a real list.** A set of tags is a list, so use `ul` and `li`. Bootstrap's `list-unstyled` removes the bullets, `d-flex flex-wrap gap-2` lines the badges up:

```html
<ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
  <li><span class="badge text-bg-primary">HTML</span></li>
</ul>
```

**3. Three columns the easy way.** For the three skill cards give each column `col-md-4`. For the project cards declare the layout once on the row with `row-cols-1 row-cols-md-3`: one card per line on phones, three from the `md` breakpoint (768px), and every column inside needs only the class `col`:

```html
<div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col"> <article class="card project-card h-100"> ... </article> </div>
</div>
```

A project card is a self-contained thing, so `article` fits better than `div`.

**4. Thumbnails without images.** A `div` with a gradient background and the project initials is enough. It is decoration, so hide it from screen readers with `aria-hidden="true"`; the title carries the meaning. The CSS gives it a height and rounded top corners that match the card:

```css
.project-thumb {
  height: 140px;
  border-radius: var(--bs-card-inner-border-radius) var(--bs-card-inner-border-radius) 0 0;
}
.thumb-cafe { background: linear-gradient(135deg, #b45309, #be123c); }
```

**5. Footer link and call to action.** Links that open another site use `target="_blank"` together with `rel="noopener noreferrer"`, which stops the new page from controlling yours. The call to action is a full-width `section.cta` with a heading, a lead and one `btn-light` button, styled with the brand gradient.

> **Watch out:**
> - Do not skip heading levels. Going from `h2` straight to `h4` confuses people who navigate by headings.
> - `target="_blank"` without `rel="noopener noreferrer"` is a security risk on older browsers and a warning in Lighthouse.
> - Card text on a coloured background needs enough contrast. Use dark text on light backgrounds and white text on dark ones.
> - Too many badges look like noise. Pick four per card at most.

> **Your turn:** in `index.html` add `section#skills` (an `h2` and a row of three `.col-md-4` columns, each a `.card.h-100.skill-card` with an `h3.card-title`, text and badges), `section#featured.bg-body-tertiary` (an `h2`, a link to `projects.html`, and a `row-cols-1 row-cols-md-3` row of three `article.card.project-card`: Cafe Bloom, Pocket Budget and Weather Now, each with a thumbnail, title, text, badges and a GitHub link), and `section.cta` with a `btn-light` button to `contact.html`. Add the matching rules to `css/style.css`.
