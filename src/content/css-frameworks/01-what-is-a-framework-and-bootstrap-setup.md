---
title: What is a CSS framework? Setting up Bootstrap
summary: Add Bootstrap to a page with one link tag and style your first heading and buttons with class names only.
level: beginner
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>My first Bootstrap page</title>
          <!-- 1. Add the viewport meta tag here. -->
          <!-- 2. Add the Bootstrap CSS link here (copy it from the lesson). -->
        </head>
        <body>
          <!-- 3. Wrap the content below in a div with the class container and the spacing class py-5. -->
          <h1>Welcome to Bootstrap</h1>
          <p>Bootstrap turns plain HTML into a tidy, modern page with nothing but class names.</p>
          <!-- 4. Give the first button the classes btn and btn-primary,
                  and the second one btn and btn-outline-secondary. -->
          <button type="button">Get started</button>
          <button type="button">Learn more</button>

          <!-- 5. Just before the end of the body, add the Bootstrap JavaScript bundle script tag. -->
        </body>
      </html>
check:
  dom:
    selectors:
      - "div.container h1"
      - "div.container button.btn.btn-primary"
      - "div.container button.btn.btn-outline-secondary"
    styles:
      - { selector: ".btn-primary", property: "background-color", value: "rgb(13, 110, 253)" }
      - { selector: ".btn-outline-secondary", property: "border-top-color", value: "rgb(108, 117, 125)" }
  code:
    - { pattern: '<link[^>]+bootstrap[^>]+\.css', message: "Add the Bootstrap stylesheet with a link tag in the head." }
    - { pattern: '<meta[^>]+name=["'']viewport', message: "Add the viewport meta tag in the head." }
    - { pattern: '<script[^>]+src=["''][^"'']*bootstrap\.bundle(\.min)?\.js', message: "Add the Bootstrap JavaScript bundle script tag just before the closing body tag." }
hints:
  - "Bootstrap only needs two things: a link tag in the head so its CSS loads, and class names on your elements. Do the head first, then the classes."
  - "Use a link tag with rel stylesheet and the jsDelivr address ending in bootstrap.min.css. Then wrap the h1, the paragraph and the buttons in one div whose class list starts with container."
  - 'Head: <meta name="viewport" content="width=device-width, initial-scale=1"> and <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">. Buttons: class="btn btn-primary" and class="btn btn-outline-secondary". End of body: <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>My first Bootstrap page</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-5">
            <h1>Welcome to Bootstrap</h1>
            <p>Bootstrap turns plain HTML into a tidy, modern page with nothing but class names.</p>
            <button type="button" class="btn btn-primary">Get started</button>
            <button type="button" class="btn btn-outline-secondary">Learn more</button>
          </div>

          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
      </html>
quiz:
  - q: Where does the Bootstrap stylesheet link belong in your page?
    options: ["At the very end of the body, after the last paragraph", "In a JavaScript file", "In the head, so the page is styled as soon as it loads"]
    answer: 2
    explain: "The CSS should be known before the browser draws the page, so the link goes in the head."
  - q: 'What is the difference between the classes in  class="btn btn-primary"?'
    options: ["They do the same thing; the second is a backup", "btn gives the shape and spacing, btn-primary adds the blue colour", "btn-primary is a JavaScript function"]
    answer: 1
  - q: What does the viewport meta tag do?
    options: ["It makes phones use their real screen width so the layout can adapt", "It adds a border around the window", "It loads Bootstrap faster"]
    answer: 0
  - q: Which of these is a utility class (one tiny job, reusable anywhere)?
    options: ["card", "mb-3", "navbar"]
    answer: 1
    explain: "mb-3 only adds a bottom margin. card and navbar are components made of many rules."
---

Writing every CSS rule yourself is a great way to learn, but real teams often start from a **CSS framework**: a big, tested stylesheet full of ready-made classes. You add a class name to your HTML and the style appears. In this lesson you will add **Bootstrap**, the most widely used framework, and style your first page without writing a single line of CSS.

## Why use a framework?

- **Speed.** A decent button, card or navigation bar takes one line instead of thirty.
- **Consistency.** Spacing, colours and font sizes follow one system, so pages look like they belong together.
- **Responsive by default.** The grid and the components adapt to phones and big screens.
- **Tested.** Bootstrap has been checked in all major browsers, so you skip many odd bugs.

The trade-off: your pages can look like "every other Bootstrap site" unless you customise them. You will learn that in the last lesson of this half of the track.

## Adding Bootstrap with a CDN link

A **CDN** (content delivery network) is a fast public server that hosts popular libraries. You do not download anything, you just point to the file. Put this in the `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

- The `viewport` meta tag tells phones to use their real width. Without it, mobile browsers pretend to be a wide desktop screen and Bootstrap's responsive features look broken.
- `rel="stylesheet"` says "this file is CSS". The `.min.css` ending means the file is minified (spaces removed) so it downloads faster.
- `@5.3.3` pins the version, so an update on the CDN can never change your page by surprise.

Some components (the mobile menu, modals, dropdowns) also need Bootstrap's JavaScript. Add this just before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

"Bundle" means it includes Popper, a helper that positions dropdowns and tooltips. You can also install Bootstrap with npm (`npm install bootstrap`) in a project with a build tool; the CDN is the simplest way to start. In this course the preview has Bootstrap built in, so the same tags work even without internet.

## Two kinds of classes

Bootstrap gives you two families of classes, and you will mix them constantly:

1. **Component classes** style a whole piece of the interface: `btn`, `card`, `navbar`, `alert`. They are usually a base class plus a variant, such as `btn` + `btn-primary`.
2. **Utility classes** do one small job: `py-5` (padding top and bottom), `mb-3` (margin bottom), `text-center`, `fw-bold`. You stack as many as you need.

## Your first layout: the container

`container` is a class for a `<div>` that centres your content and gives it a maximum width that grows with the screen. Almost every Bootstrap page starts with one:

```html
<div class="container py-5">
  <h1>Welcome</h1>
  <button type="button" class="btn btn-primary">Get started</button>
</div>
```

`py-5` means "padding on the y axis (top and bottom), size 5" (3rem). The headline is already nicely styled because Bootstrap's base styles reset the browser defaults for `h1`, `p` and friends.

## Buttons

A button needs the base class `btn` plus one colour class. `btn-primary` is solid blue, `btn-outline-secondary` is a grey outline. Others include `btn-success`, `btn-danger`, `btn-warning` and `btn-dark`.

> **Watch out:**
> - Forgetting the link tag (or mistyping the address). The page then looks like plain HTML again; open the browser's network tab and look for a red failed request.
> - Using only `btn-primary` without `btn`. The colour classes need the base `btn` class to work.
> - Leaving out the viewport meta tag. On a phone everything looks tiny.
> - Skipping the `container`. Text then touches the edges of the window.
> - Putting the JavaScript bundle in the head. It can go there too, but at the end of the body is the usual safe place.

> **Your turn:** add the viewport meta tag and the Bootstrap CSS link to the head, wrap the content in a `div` with the classes `container py-5`, make the first button `btn btn-primary` and the second `btn btn-outline-secondary`, and add the JavaScript bundle script just before the closing `</body>`.
