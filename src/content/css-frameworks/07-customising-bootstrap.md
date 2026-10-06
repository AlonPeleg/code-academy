---
title: Customising Bootstrap - make it your own
summary: Change Bootstrap's colours and fonts with CSS variables, switch part of the page to dark mode, and add your own stylesheet safely.
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
          <title>Fernleaf plant shop</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <!-- 1. Link your own style.css here, AFTER the Bootstrap link, so your rules can override Bootstrap's. -->
        </head>
        <body>
          <nav class="navbar bg-body border-bottom">
            <div class="container">
              <a class="navbar-brand fw-bold" href="#">Fernleaf</a>
              <a href="#plans" class="btn btn-primary">Shop now</a>
            </div>
          </nav>

          <header class="py-5 text-center">
            <div class="container">
              <h1 class="display-4 fw-bold">Plants that make a home</h1>
              <p class="lead text-body-secondary col-lg-8 mx-auto">Easy to grow, delivered to your door and guaranteed to arrive happy.</p>
              <a href="#plans" class="btn btn-primary btn-lg">Browse plants</a>
            </div>
          </header>

          <section id="plans" class="pb-5">
            <div class="container">
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="card feature-card h-100 shadow-sm">
                    <div class="card-body">
                      <h2 class="h5 text-primary">Easy care</h2>
                      <p class="mb-0">Hardy plants that forgive a missed watering day.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card feature-card h-100 shadow-sm">
                    <div class="card-body">
                      <h2 class="h5 text-primary">Free delivery</h2>
                      <p class="mb-0">Packed carefully and sent in two working days.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card feature-card h-100 shadow-sm">
                    <div class="card-body">
                      <h2 class="h5 text-primary">30-day promise</h2>
                      <p class="mb-0">If it does not thrive, we send a new one.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="cta" class="bg-primary text-white text-center py-5">
            <div class="container">
              <h2>Ready to start your jungle?</h2>
              <a href="#" class="btn btn-light mt-2">Get 10% off</a>
            </div>
          </section>

          <!-- 4. Make the footer dark with the colour-mode attribute (see the lesson): add data-bs-theme set to dark. -->
          <footer class="bg-body text-body py-4 text-center">
            <div class="container small">Fernleaf plant shop. Grown with care.</div>
          </footer>
        </body>
      </html>
  - name: style.css
    code: |
      /* 2. Override Bootstrap's variables on the root element (the html tag):
            --bs-primary becomes #7c3aed and its twin --bs-primary-rgb becomes 124, 58, 237
            --bs-body-bg becomes #faf5ff and its twin --bs-body-bg-rgb becomes 250, 245, 255
            --bs-body-font-family becomes Georgia, "Times New Roman", serif */


      /* 3. Buttons keep their own variables. Write a rule for .btn-primary that sets
            --bs-btn-bg and --bs-btn-border-color to #7c3aed,
            and --bs-btn-hover-bg and --bs-btn-hover-border-color to #6d28d9. */


      /* 4. Your own component: .feature-card gets a 4px solid top border coloured with var(--bs-primary). */
check:
  dom:
    styles:
      - { selector: "body", property: "background-color", value: "rgb(250, 245, 255)" }
      - { selector: ".text-primary", property: "color", value: "rgb(124, 58, 237)" }
      - { selector: "#cta", property: "background-color", value: "rgb(124, 58, 237)" }
      - { selector: ".btn-primary", property: "background-color", value: "rgb(124, 58, 237)" }
      - { selector: ".feature-card", property: "border-top-width", value: "4px" }
      - { selector: ".feature-card", property: "border-top-color", value: "rgb(124, 58, 237)" }
      - { selector: "footer", property: "background-color", value: "rgb(33, 37, 41)" }
    selectors:
      - "footer[data-bs-theme=\"dark\"]"
  code:
    - { pattern: 'bootstrap[^>]*>[\s\S]*<link[^>]+href=["'']style\.css', message: "Link style.css after the Bootstrap link in the head." }
    - { pattern: ':root\s*\{[^}]*--bs-primary-rgb\s*:\s*124\s*,\s*58\s*,\s*237', message: "Set --bs-primary-rgb: 124, 58, 237 inside a :root rule." }
    - { file: 'style.css', pattern: '--bs-body-font-family\s*:\s*Georgia', message: "Set --bs-body-font-family to Georgia, followed by fallbacks." }
    - { file: 'style.css', pattern: '\.btn-primary\s*\{[^}]*--bs-btn-hover-bg\s*:', message: "Also set --bs-btn-hover-bg in the .btn-primary rule." }
hints:
  - "Bootstrap is built on CSS variables, so most colour changes are a few lines in your own stylesheet. Remember the order: your stylesheet comes after Bootstrap's."
  - "Put --bs-primary, --bs-primary-rgb, --bs-body-bg, --bs-body-bg-rgb and --bs-body-font-family inside a :root rule. Buttons need their own .btn-primary rule with the --bs-btn-* variables. The footer needs one attribute."
  - ':root { --bs-primary: #7c3aed; --bs-primary-rgb: 124, 58, 237; --bs-body-bg: #faf5ff; --bs-body-bg-rgb: 250, 245, 255; }  .btn-primary { --bs-btn-bg: #7c3aed; --bs-btn-border-color: #7c3aed; --bs-btn-hover-bg: #6d28d9; --bs-btn-hover-border-color: #6d28d9; }  .feature-card { border-top: 4px solid var(--bs-primary); }  and <footer data-bs-theme="dark" ...>'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Fernleaf plant shop</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <nav class="navbar bg-body border-bottom">
            <div class="container">
              <a class="navbar-brand fw-bold" href="#">Fernleaf</a>
              <a href="#plans" class="btn btn-primary">Shop now</a>
            </div>
          </nav>

          <header class="py-5 text-center">
            <div class="container">
              <h1 class="display-4 fw-bold">Plants that make a home</h1>
              <p class="lead text-body-secondary col-lg-8 mx-auto">Easy to grow, delivered to your door and guaranteed to arrive happy.</p>
              <a href="#plans" class="btn btn-primary btn-lg">Browse plants</a>
            </div>
          </header>

          <section id="plans" class="pb-5">
            <div class="container">
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="card feature-card h-100 shadow-sm">
                    <div class="card-body">
                      <h2 class="h5 text-primary">Easy care</h2>
                      <p class="mb-0">Hardy plants that forgive a missed watering day.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card feature-card h-100 shadow-sm">
                    <div class="card-body">
                      <h2 class="h5 text-primary">Free delivery</h2>
                      <p class="mb-0">Packed carefully and sent in two working days.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card feature-card h-100 shadow-sm">
                    <div class="card-body">
                      <h2 class="h5 text-primary">30-day promise</h2>
                      <p class="mb-0">If it does not thrive, we send a new one.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="cta" class="bg-primary text-white text-center py-5">
            <div class="container">
              <h2>Ready to start your jungle?</h2>
              <a href="#" class="btn btn-light mt-2">Get 10% off</a>
            </div>
          </section>

          <footer data-bs-theme="dark" class="bg-body text-body py-4 text-center">
            <div class="container small">Fernleaf plant shop. Grown with care.</div>
          </footer>
        </body>
      </html>
  - name: style.css
    code: |
      :root {
        --bs-primary: #7c3aed;
        --bs-primary-rgb: 124, 58, 237;
        --bs-body-bg: #faf5ff;
        --bs-body-bg-rgb: 250, 245, 255;
        --bs-body-font-family: Georgia, "Times New Roman", serif;
      }

      .btn-primary {
        --bs-btn-bg: #7c3aed;
        --bs-btn-border-color: #7c3aed;
        --bs-btn-hover-bg: #6d28d9;
        --bs-btn-hover-border-color: #6d28d9;
        --bs-btn-active-bg: #5b21b6;
        --bs-btn-active-border-color: #5b21b6;
      }

      .feature-card {
        border-top: 4px solid var(--bs-primary);
      }
quiz:
  - q: Where should your own stylesheet go in the head?
    options: ["Before the Bootstrap link", "After the Bootstrap link, so that your equal-strength rules win", "Only in the body"]
    answer: 1
  - q: Why does changing --bs-primary not recolour every .btn-primary on its own?
    options: ["Buttons define their own --bs-btn-* variables", "Variables only work in dark mode", "Bootstrap ignores custom CSS"]
    answer: 0
  - q: What does data-bs-theme="dark" do on an element?
    options: ["Hides the element", "Downloads another stylesheet", "Switches that element and everything inside it to the dark colour variables"]
    answer: 2
  - q: When would you reach for Sass customisation?
    options: ["Whenever you want to change a button colour", "To change deeper settings such as breakpoints or the spacing scale, or to leave out unused parts, using a build step", "Never; Bootstrap forbids it"]
    answer: 1
---

Out of the box every Bootstrap site shares the same blue. The good news: Bootstrap 5.3 is built on **CSS variables**, so making it yours takes a few lines. You will recolour a landing page, change its font, make the footer dark and add a component of your own, all without touching Bootstrap's files.

## Bootstrap's variables

Open the browser's developer tools on any Bootstrap page and look at the `:root` (the `html` element). You will find dozens of custom properties that start with `--bs-`:

```css
:root {
  --bs-primary: #0d6efd;
  --bs-primary-rgb: 13, 110, 253;
  --bs-body-bg: #fff;
  --bs-body-font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

Bootstrap's classes read these with `var(...)`. For instance `.text-primary` uses the `rgb` twin, and `body` uses `var(--bs-body-bg)`. If you change the variable, everything that reads it changes. A custom property can be redefined on `:root` (the whole page) or on any element or class (just that part).

Notice the **twins**: `--bs-primary` is a normal colour and `--bs-primary-rgb` is the same colour as three bare numbers. The utilities `text-primary` and `bg-primary` need the numbers so they can add transparency. Change both when you change a colour, or half the classes will keep the old colour.

## Your own stylesheet, loaded last

Put your variables in `style.css` and link it **after** Bootstrap:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="style.css">
```

When two rules have the same specificity (same number of classes and ids), the later one wins. That is why the order matters and why you should almost never need `!important`. Do not edit Bootstrap's own file or paste its code into yours; the CDN file should stay untouched so you can upgrade it later.

## Components have their own variables

`.btn-primary` does not read `--bs-primary`. Each component declares private variables, such as `--bs-btn-bg`, `--bs-btn-hover-bg` and `--bs-btn-border-color`, and then uses them. So to recolour buttons you override those on the class:

```css
.btn-primary {
  --bs-btn-bg: #7c3aed;
  --bs-btn-border-color: #7c3aed;
  --bs-btn-hover-bg: #6d28d9;
  --bs-btn-hover-border-color: #6d28d9;
}
```

The same idea works for `--bs-card-*`, `--bs-navbar-*`, `--bs-alert-*` and more. Inspecting an element in the dev tools shows you which variables it uses.

## Dark mode and colour modes

Add `data-bs-theme="dark"` to the `<html>` tag and the whole page switches to Bootstrap's dark variables: dark background, light text, adjusted components. You can also put it on a single element, such as a footer, a card or a navbar, and only that element and its children turn dark. Setting it with a small script from a toggle button gives you a light and dark switch.

## Your own components

Not everything needs a utility. When you repeat the same design, give it a name and write a rule that uses Bootstrap's variables, like `.feature-card { border-top: 4px solid var(--bs-primary); }`. Your component then follows the theme automatically.

## When Sass comes in

Variables cover colours, fonts and many sizes. Bootstrap's source is written in **Sass**, a CSS preprocessor, and a build step lets you change things variables cannot reach: the breakpoint widths, the spacing scale, the list of theme colours, and which parts of Bootstrap to include (so your final CSS is smaller). You install Bootstrap with npm, set Sass variables like `$primary: #7c3aed;` before importing Bootstrap's Sass, and compile. We do not run Sass in this course; the CSS variable approach is enough for most sites.

> **Watch out:**
> - Linking your stylesheet before Bootstrap. Your rules then lose every tie.
> - Changing `--bs-primary` but not `--bs-primary-rgb`. Buttons or backgrounds keep the old colour in some places.
> - Overriding `--bs-primary` and expecting `.btn-primary` to follow. Set the `--bs-btn-*` variables on `.btn-primary`.
> - Fighting a utility class with a normal rule. Utilities use `!important`, so remove the utility or edit the variable instead.
> - Writing colours on `:root` that fail contrast. Pale text on a coloured background must still be readable.

> **Your turn:** link `style.css` after Bootstrap. In it, set `--bs-primary`, `--bs-primary-rgb`, `--bs-body-bg`, `--bs-body-bg-rgb` and `--bs-body-font-family` on `:root`, override the button variables on `.btn-primary`, and add a `.feature-card` rule with a 4px solid top border in `var(--bs-primary)`. Finally add `data-bs-theme="dark"` to the footer.
