---
title: 'Step 1: Plan the site and build the skeleton'
summary: Plan the four pages, then link Bootstrap, your own stylesheet and your own script, and define the colours of your brand.
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
        <!-- TODO 1: add the Bootstrap stylesheet (rel="stylesheet") from the jsDelivr CDN, copied from the walk-through. -->
        <!-- TODO 2: AFTER it, link your own file css/style.css, so your rules can override Bootstrap. -->
      </head>
      <body>
        <main>
          <!-- TODO 3: inside main, add a div with the Bootstrap classes container py-5. Inside it put an h1 that says Alex Rivers and a paragraph with class lead that says what you do. -->
        </main>

        <!-- TODO 4: at the end of the body add two scripts: the Bootstrap bundle from the CDN, then your own file js/main.js. -->
      </body>
      </html>
  - name: css/style.css
    code: |
      /* css/style.css
         My own styles. This file is linked AFTER Bootstrap, so when both of them
         say something about the same element, my rule wins. */

      /* ---------- 1. Design tokens: colours and sizes I reuse everywhere ---------- */
      /* TODO 1: declare these custom properties on :root:
           --brand: #4f46e5;       --brand-dark: #4338ca;   --brand-text: #4338ca;
           --brand-soft: #eef2ff;  --accent: #06b6d4;       --accent-soft: #e0f7fa;
           --radius: 1rem; */








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




check:
  page: index.html
  dom:
    text:
      - Alex Rivers
    selectors:
      - style[data-lib="bootstrap"]
      - script[data-lib="bootstrap"]
      - main .container h1
      - main .container p.lead
    styles:
      - selector: :root
        property: --brand
        value: '#4f46e5'
      - selector: :root
        property: --brand-dark
        value: '#4338ca'
      - selector: :root
        property: --radius
        value: 1rem
  code:
    - file: index.html
      pattern: '<link[^>]+href="https://cdn\.jsdelivr\.net/npm/bootstrap@5[0-9.]*/dist/css/bootstrap\.min\.css"'
      message: 'Add the Bootstrap stylesheet link to the head, copied exactly from the walk-through.'
    - file: index.html
      pattern: 'bootstrap\.min\.css[\s\S]*href="css/style\.css"'
      message: 'Link css/style.css AFTER the Bootstrap link, so your rules can override Bootstrap.'
    - file: index.html
      pattern: '<script[^>]+src="https://cdn\.jsdelivr\.net/npm/bootstrap@5[0-9.]*/dist/js/bootstrap\.bundle\.min\.js"'
      message: 'Add the Bootstrap bundle script at the end of the body.'
    - file: index.html
      pattern: '<script[^>]+src="js/main\.js"'
      message: 'Add <script src="js/main.js"></script> at the end of the body.'
    - file: css/style.css
      pattern: ':root\s*\{[^}]*--accent-soft'
      message: 'Declare all the custom properties inside one :root rule in css/style.css.'
hints:
  - 'Think of the page in three layers. The head loads files (first the Bootstrap stylesheet, then your own stylesheet). The main part shows content. The end of the body loads scripts. Do the head first, then the content, then the scripts, then the CSS file.'
  - 'In the head you need two link tags, Bootstrap first and css/style.css second. In the body, main gets a div with the classes container and py-5, holding an h1 and a p with the class lead. At the end of the body come two script tags: the Bootstrap bundle, then js/main.js. In css/style.css write one :root rule with --brand, --brand-dark, --brand-text, --brand-soft, --accent, --accent-soft and --radius.'
  - '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"> then <link rel="stylesheet" href="css/style.css"> in the head. Before </body>: <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script> and <script src="js/main.js"></script>. In main: <div class="container py-5"><h1>Alex Rivers</h1><p class="lead">Junior web developer.</p></div>. In the CSS: :root { --brand: #4f46e5; --brand-dark: #4338ca; --brand-text: #4338ca; --brand-soft: #eef2ff; --accent: #06b6d4; --accent-soft: #e0f7fa; --radius: 1rem; }'
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
      <body>
        <main>
          <div class="container py-5">
            <h1>Alex Rivers</h1>
            <p class="lead">Junior web developer. This site grows one step at a time.</p>
          </div>
        </main>

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




quiz:
  - q: Why do we link css/style.css AFTER the Bootstrap stylesheet?
    options:
      - So the page loads faster
      - When two rules are equally specific, the later one wins, so your rules can override Bootstrap
      - Because Bootstrap stops working if it is not first in the file list
    answer: 1
    explain: The cascade looks at specificity first and source order second. Loading your file last means your rule wins ties.
  - q: What does a CSS custom property such as --brand give you?
    options:
      - One place to change a colour that is used in many rules
      - Faster rendering of gradients
      - A way to run JavaScript from CSS
    answer: 0
    explain: You write var(--brand) wherever you need the colour. To rebrand the whole site you edit one line.
  - q: Where do the script tags go, and why?
    options:
      - In the head, because scripts must run before the page is drawn
      - Anywhere, the order never matters
      - At the end of the body, so the HTML already exists when the scripts look for it
    answer: 2
---
Welcome to the last big project in the academy: a real personal website that you can put online for free and send to employers. Over ten steps you will build four pages (home, projects, about and contact), style them with Bootstrap 5.3 plus your own stylesheet, add a little JavaScript, make the site accessible and finish with a publish checklist. Every step gives you the finished code of the previous step, plus a few `TODO` comments. Nothing is hidden.

## Where we are

We are at the very start. The home page is nearly empty. By the end of this step it will load Bootstrap from the internet, load your own stylesheet and script, and show a heading. That sounds small, but every later step stands on it.

## What we will add, and why it matters

A portfolio has one job: show who you are, what you built and how to reach you. Four pages are enough, and each one gets its own file:

| File | What it is for |
|---|---|
| `index.html` | Home: hero, skills, featured projects, call to action |
| `projects.html` | All projects, with filter buttons |
| `about.html` | Your story, a timeline and your skills |
| `contact.html` | A contact form and other ways to reach you |
| `404.html` | The page for a wrong address (finished in step 10) |
| `css/style.css` | Your own styles, loaded after Bootstrap |
| `js/main.js` | Small scripts shared by every page |

The folders `css/` and `js/` keep the site tidy. The pages after the home page already exist as tiny placeholders, so links never lead nowhere. You will replace them one by one.

**Why Bootstrap and your own CSS?** Bootstrap gives you a tested grid, navbar, cards and form styles that already work on phones. Your own file gives the site a personality. In real jobs you will often see exactly this mix, so it is good practice to show it.

## Guided walk-through

**1. Load Bootstrap's CSS.** A CDN (content delivery network) is a fast public server that hosts popular libraries. One line in the head is all you need:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

**2. Load your own CSS second.** When two rules are equally specific, the one that comes later wins. Your file therefore goes after Bootstrap:

```html
<link rel="stylesheet" href="css/style.css">
```

The path is *relative*: it starts from the folder of the page. That is what keeps the site working when you move it to a web host.

**3. Add the scripts at the end of the body.** Bootstrap's bundle powers things like the mobile menu (it also contains Popper, which positions pop-ups). Your `main.js` comes after it:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/main.js"></script>
```

**4. Put real content in `main`.** `container` centres your content and gives it a sensible maximum width. `py-5` means padding on top and bottom, step 5 on Bootstrap's spacing scale (3rem, so 48px):

```html
<div class="container py-5">
  <h1>Alex Rivers</h1>
  <p class="lead">Junior web developer.</p>
</div>
```

**5. Define your design tokens.** Open `css/style.css`. A rule on `:root` (the whole page) can hold *custom properties*: names that start with `--` and hold a value you reuse. Later steps write `var(--brand)` instead of repeating a hex code.

```css
:root {
  --brand: #4f46e5;
  --radius: 1rem;
}
```

> **Watch out:**
> - If your stylesheet comes **before** Bootstrap, Bootstrap overrides your rules and nothing seems to work.
> - The preview recognises the Bootstrap tags only in the exact form shown above. A typo in the address leaves the page unstyled, and the browser console shows `Failed to load resource`.
> - A path such as `/css/style.css` (with a leading slash) points at the root of the whole web server and breaks on GitHub Pages project sites. Use `css/style.css`.
> - Custom property names are case-sensitive: `--Brand` and `--brand` are different.

> **Your turn:** follow the four `TODO` comments in `index.html`, then the `TODO` in `css/style.css`. The home page needs the Bootstrap stylesheet, then `css/style.css`, a `main` with `div.container` holding an `h1` that says "Alex Rivers" and a `p.lead`, and the two scripts at the end of the body. In the CSS, declare `--brand`, `--brand-dark`, `--brand-text`, `--brand-soft`, `--accent`, `--accent-soft` and `--radius` on `:root`.
