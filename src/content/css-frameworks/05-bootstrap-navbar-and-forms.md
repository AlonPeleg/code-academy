---
title: A responsive navbar and Bootstrap forms
summary: Build a navbar that collapses into a menu button on phones, and style a full sign-up form with validation messages.
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
          <title>Trailhead hiking club</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <!-- 1. NAVBAR. Give nav the classes navbar, navbar-expand-lg and bg-dark, plus data-bs-theme set to dark.
                  The first inner div is a container; the link is the navbar-brand.
                  The button becomes a navbar-toggler that toggles a collapse targeting #mainNav
                  (data-bs-toggle, data-bs-target, aria-controls, aria-expanded false, aria-label Toggle navigation)
                  and holds an empty span with the class navbar-toggler-icon instead of the word Menu.
                  The #mainNav div needs collapse and navbar-collapse. The ul is a navbar-nav (add ms-auto);
                  each li is a nav-item and each link a nav-link. -->
          <nav>
            <div>
              <a href="#">Trailhead</a>
              <button type="button">Menu</button>
              <div id="mainNav">
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">Routes</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
            </div>
          </nav>

          <main class="container py-5">
            <h1 class="h3 mb-4">Join the hiking club</h1>

            <!-- 2. FORM. Each field wrapper gets mb-3. Labels get form-label. Text and email inputs get form-control.
                    The select gets form-select. The @ box is an input-group with an input-group-text span.
                    The checkbox wrapper is form-check, its input form-check-input, its label form-check-label.
                    The password input is marked invalid with the class is-invalid and followed by a div
                    of class invalid-feedback saying: Password must be at least 8 characters.
                    The button is btn btn-primary. -->
            <form>
              <div>
                <label for="email">Email address</label>
                <input type="email" id="email" placeholder="you@example.com">
              </div>
              <div>
                <label for="level">Experience</label>
                <select id="level">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
              <div>
                <label for="user">Username</label>
                <div>
                  <span>@</span>
                  <input type="text" id="user">
                </div>
              </div>
              <div>
                <label for="pw">Password</label>
                <input type="password" id="pw" value="abc">
              </div>
              <div>
                <input type="checkbox" id="terms">
                <label for="terms">I agree to the club rules</label>
              </div>
              <button type="submit">Sign up</button>
            </form>
          </main>

          <!-- 3. Add the Bootstrap JavaScript bundle just before the end of the body, or the toggler will do nothing. -->
        </body>
      </html>
check:
  dom:
    text:
      - "Password must be at least 8 characters."
    selectors:
      - "nav.navbar.navbar-expand-lg"
      - "button.navbar-toggler[data-bs-toggle=\"collapse\"][data-bs-target=\"#mainNav\"]"
      - "#mainNav.collapse.navbar-collapse .navbar-nav .nav-item:nth-child(3) .nav-link"
      - "label.form-label[for=\"email\"]"
      - "input.form-control#email"
      - "select.form-select"
      - ".input-group > .input-group-text"
      - ".input-group > input.form-control"
      - ".form-check > input.form-check-input[type=\"checkbox\"]"
      - ".form-control.is-invalid + .invalid-feedback"
      - "button.btn.btn-primary[type=\"submit\"]"
    styles:
      - { selector: ".navbar", property: "display", value: "flex" }
      - { selector: "#email", property: "display", value: "block" }
      - { selector: "#level", property: "display", value: "block" }
      - { selector: ".input-group", property: "display", value: "flex" }
      - { selector: "#pw", property: "border-top-color", value: "rgb(220, 53, 69)" }
  code:
    - { pattern: '<script[^>]+src=["''][^"'']*bootstrap\.bundle(\.min)?\.js', message: "Add the Bootstrap JavaScript bundle before the closing body tag, otherwise the toggler button cannot work." }
    - { pattern: 'aria-controls=["'']mainNav', message: "Give the toggler aria-controls=mainNav." }
    - { pattern: 'aria-label=["'']Toggle navigation', message: "Give the toggler aria-label=Toggle navigation so screen readers know what it does." }
    - { pattern: 'data-bs-theme=["'']dark', message: "Add data-bs-theme=dark to the nav so the links are light on the dark bar." }
hints:
  - "Two jobs: the navbar (a pattern of nav, brand, toggler, collapse div, nav-links) and the form (form-label, form-control, form-select, form-check, input-group). Start with the navbar."
  - "The toggler button needs data-bs-toggle collapse and data-bs-target pointing at the id of the div that collapses (#mainNav). Do not forget the JavaScript bundle script at the end of the body."
  - 'Nav: <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark"> ... <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>. Password: <input class="form-control is-invalid"> then <div class="invalid-feedback">.'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Trailhead hiking club</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div class="container">
              <a class="navbar-brand" href="#">Trailhead</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ms-auto">
                  <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Home</a></li>
                  <li class="nav-item"><a class="nav-link" href="#">Routes</a></li>
                  <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
                </ul>
              </div>
            </div>
          </nav>

          <main class="container py-5">
            <h1 class="h3 mb-4">Join the hiking club</h1>

            <form>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" placeholder="you@example.com">
              </div>
              <div class="mb-3">
                <label for="level" class="form-label">Experience</label>
                <select class="form-select" id="level">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="user" class="form-label">Username</label>
                <div class="input-group">
                  <span class="input-group-text">@</span>
                  <input type="text" class="form-control" id="user">
                </div>
              </div>
              <div class="mb-3">
                <label for="pw" class="form-label">Password</label>
                <input type="password" class="form-control is-invalid" id="pw" value="abc">
                <div class="invalid-feedback">Password must be at least 8 characters.</div>
              </div>
              <div class="form-check mb-3">
                <input type="checkbox" class="form-check-input" id="terms">
                <label for="terms" class="form-check-label">I agree to the club rules</label>
              </div>
              <button type="submit" class="btn btn-primary">Sign up</button>
            </form>
          </main>

          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
      </html>
quiz:
  - q: Which class makes a navbar collapse into a menu button on small screens and spread out from the lg breakpoint up?
    options: ["navbar-small", "navbar-collapse-lg", "navbar-expand-lg"]
    answer: 2
  - q: Why does the toggler button do nothing without the bundle script?
    options: ["The opening and closing is done by Bootstrap's JavaScript; the CSS only styles it", "The CSS file is too small", "Browsers block all buttons"]
    answer: 0
  - q: Which class styles a text input?
    options: ["form-input", "form-control", "input-text"]
    answer: 1
  - q: How do you show a red error message under a field?
    options: ["alert-danger on the label", "invalid-feedback with no other class", "is-invalid on the input and an invalid-feedback element right after it"]
    answer: 2
    explain: "The message is hidden until its previous sibling has is-invalid (or the form has was-validated)."
---

Almost every site needs two things: a menu that works on phones and a form people can fill in. Bootstrap gives you both as patterns. They look long at first, but each class has one clear job.

## The navbar pattern

A responsive navbar is a recipe. Learn the order once and you can reuse it forever:

```html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand" href="#">Trailhead</a>
    <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#mainNav"
            aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
      </ul>
    </div>
  </div>
</nav>
```

- `navbar` is the bar; `navbar-expand-lg` means "show the links in a row from the lg breakpoint (992px) up, and hide them behind a button below that".
- `bg-dark` sets the colour, and `data-bs-theme="dark"` tells Bootstrap to use light text and a light hamburger icon on it.
- The inner `container` keeps the content aligned with the rest of your page.
- `navbar-brand` is your logo or site name.
- `navbar-toggler` is the hamburger button. Its `data-bs-toggle="collapse"` and `data-bs-target="#mainNav"` attributes say "when clicked, open or close the element with id `mainNav`". The `aria-*` attributes help screen readers.
- `collapse navbar-collapse` is the part that hides on small screens. `navbar-nav` is the list, `nav-item` each entry, `nav-link` each link. `active` highlights the current page and `ms-auto` pushes the links to the right.

The toggler needs **Bootstrap's JavaScript**. That is the `bootstrap.bundle.min.js` script at the end of the body. Without it the menu button is a dead button.

## Forms

Bootstrap forms are plain HTML forms with classes added:

- `form-label` on every `<label>`, with `for` matching the input's `id`.
- `form-control` on text-like inputs (`text`, `email`, `password`) and `<textarea>`. It makes them full width with a clear focus ring.
- `form-select` on `<select>`.
- `form-check`, `form-check-input` and `form-check-label` for checkboxes and radios. The input comes first, then the label.
- `mb-3` on each wrapper gives consistent spacing.

**Input groups** glue a text or button to an input: wrap them in `input-group` and use `input-group-text` for the addon:

```html
<div class="input-group">
  <span class="input-group-text">@</span>
  <input type="text" class="form-control">
</div>
```

## Validation styles

Bootstrap does not decide if a value is valid, it only paints the result. Add `is-valid` (green) or `is-invalid` (red) to an input, and put a `valid-feedback` or `invalid-feedback` element right after it. The message stays hidden until the previous sibling carries the matching class. Browsers' own checks (`required`, `minlength`) work too: add `was-validated` to the form with a little JavaScript and Bootstrap shows the state.

The preview never really submits a form (it prints a console note), and real submission needs a server or a form service.

> **Watch out:**
> - Leaving out the JavaScript bundle script. The hamburger button then opens nothing and there is no error message.
> - A `data-bs-target` that does not match the `id` (`#mainNav` against `mainnav`). IDs are case sensitive.
> - A `label` without `for`, so clicking the label does not focus the input and screen readers cannot connect them.
> - Placing `invalid-feedback` somewhere other than right after the invalid field. It will stay hidden.
> - Forgetting the viewport meta tag, so the navbar never collapses on a phone.

> **Your turn:** build the navbar with the pattern above (`navbar navbar-expand-lg bg-dark` with `data-bs-theme="dark"`, a toggler targeting `#mainNav`, and `collapse navbar-collapse` around the links). Then add the form classes, mark the password `is-invalid` with an `invalid-feedback` saying `Password must be at least 8 characters.`, and add the JavaScript bundle before the closing body tag.
