---
title: Typography, colours and utility classes
summary: Style text, colours, spacing, flex rows, borders and shadows with Bootstrap utility classes, and learn to read their names.
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
          <title>Event banner</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-5">
            <!-- Add utility classes to each element. Hints for each id are below.
                 #banner  : dark background, white text, padding 5, rounded-3 corners, a shadow
                 #kicker  : uppercase, bold, info colour (text-info), margin-bottom 2
                 #title   : a display-5 heading, bold, margin-bottom 3
                 #intro   : the lead style and the text-white-50 colour
                 #actions : a flex row, space between the items, centred vertically, margin-top 4
                 #date    : a pill outline (border, border-light, rounded-pill) with padding x 3 and y 2
                 #signup  : a large light button (btn, btn-light, btn-lg) -->
            <div id="banner">
              <p id="kicker">New event</p>
              <h1 id="title">Spring Hack Day</h1>
              <p id="intro">One day, one team, one idea turned into a working website. Beginners are very welcome.</p>
              <div id="actions">
                <span id="date">Saturday, 14 May</span>
                <a id="signup" href="#">Reserve a seat</a>
              </div>
            </div>
          </div>
        </body>
      </html>
check:
  dom:
    styles:
      - { selector: "#banner", property: "background-color", value: "rgb(33, 37, 41)" }
      - { selector: "#banner", property: "color", value: "rgb(255, 255, 255)" }
      - { selector: "#banner", property: "padding-top", value: "48px" }
      - { selector: "#banner", property: "border-top-left-radius", value: "8px" }
      - { selector: "#title", property: "font-weight", value: "700" }
      - { selector: "#kicker", property: "text-transform", value: "uppercase" }
      - { selector: "#actions", property: "display", value: "flex" }
      - { selector: "#actions", property: "justify-content", value: "space-between" }
      - { selector: "#actions", property: "align-items", value: "center" }
      - { selector: "#signup", property: "font-size", value: "20px" }
  code:
    - { pattern: 'class="[^"]*\bshadow\b', message: "Add the shadow class to the banner." }
    - { pattern: 'class="[^"]*\bdisplay-5\b', message: "Give the title the display-5 class." }
    - { pattern: 'class="[^"]*\blead\b', message: "Give the intro paragraph the lead class." }
    - { pattern: 'class="[^"]*\btext-white-50\b', message: "Give the intro the text-white-50 colour." }
    - { pattern: 'class="[^"]*\brounded-pill\b', message: "Give the date the rounded-pill class." }
    - { pattern: 'class="[^"]*\bbtn-lg\b', message: "Make the sign-up link a large button with btn-lg." }
hints:
  - "Read each id in the comment and translate it into class names: the bg- family is for backgrounds, text- for colours and alignment, p- for padding, d-flex and justify-content- for flex rows."
  - 'The banner needs bg-dark, text-white, p-5, rounded-3 and shadow. The actions row needs d-flex, justify-content-between and align-items-center. The link needs btn, btn-light and btn-lg.'
  - 'Banner: class="bg-dark text-white p-5 rounded-3 shadow". Kicker: class="text-uppercase fw-bold text-info mb-2". Title: class="display-5 fw-bold mb-3". Intro: class="lead text-white-50". Actions: class="d-flex justify-content-between align-items-center mt-4". Date: class="border border-light rounded-pill px-3 py-2". Link: class="btn btn-light btn-lg".'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Event banner</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-5">
            <div id="banner" class="bg-dark text-white p-5 rounded-3 shadow">
              <p id="kicker" class="text-uppercase fw-bold text-info mb-2">New event</p>
              <h1 id="title" class="display-5 fw-bold mb-3">Spring Hack Day</h1>
              <p id="intro" class="lead text-white-50">One day, one team, one idea turned into a working website. Beginners are very welcome.</p>
              <div id="actions" class="d-flex justify-content-between align-items-center mt-4">
                <span id="date" class="border border-light rounded-pill px-3 py-2">Saturday, 14 May</span>
                <a id="signup" href="#" class="btn btn-light btn-lg">Reserve a seat</a>
              </div>
            </div>
          </div>
        </body>
      </html>
quiz:
  - q: What does mt-3 mean?
    options: ["margin on all four sides, size 3", "margin-top, size 3 (1rem)", "a table with 3 rows"]
    answer: 1
    explain: "m = margin, t = top, 3 = the third step of the spacing scale, which is 1rem."
  - q: What does px-4 add?
    options: ["Padding on the left and right", "Padding on the top and bottom", "Padding on the top only"]
    answer: 0
  - q: Which classes make a row whose items sit at the far left and far right?
    options: ["text-flex between", "display-flex space", "d-flex justify-content-between"]
    answer: 2
  - q: 'What does  d-none d-md-block  do?'
    options: ["Shows the element only on phones", "Hides it on small screens and shows it from the md breakpoint up", "Hides it everywhere"]
    answer: 1
    explain: "d-none hides it by default; d-md-block turns it back on from 768px."
---

Components such as cards are handy, but most of the time you fine-tune a page with **utility classes**: tiny classes that each do exactly one job. Once you can read their names you can style almost anything without opening a CSS file.

## Reading the names

Most utilities follow a pattern: **property, side, size**. The spacing ones are the best example.

- `m` is margin, `p` is padding.
- The side comes next: `t` top, `b` bottom, `s` start (left in left-to-right languages), `e` end (right), `x` left and right, `y` top and bottom. No letter means all sides.
- The size is a number from `0` to `5` (or `auto` for margins).

So `mt-3` is "margin top, step 3", `px-4` is "padding left and right, step 4" and `p-5` is "padding on every side, step 5". The scale is built on `1rem` (usually 16px):

| Number | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Size | 0 | 0.25rem | 0.5rem | 1rem | 1.5rem | 3rem |

Add a breakpoint to change the value on bigger screens: `p-2 p-md-5` means small padding on phones and large padding from `md` up. `gap-3` spaces the children of a flex or grid container.

## Text and colour

- Size and weight: `fs-1` (biggest) to `fs-6`, `fw-bold`, `fw-light`, `fst-italic`, `small`.
- Big headings: `display-1` to `display-6` make light, oversized titles for hero sections. `lead` makes an intro paragraph larger.
- Alignment and case: `text-start`, `text-center`, `text-end`, `text-uppercase`.
- Text colours: `text-primary`, `text-success`, `text-danger`, `text-white`, `text-white-50`, `text-body-secondary` (muted grey).
- Backgrounds: `bg-primary`, `bg-dark`, `bg-light`, `bg-success-subtle`.
- A shortcut that sets a background and a readable text colour together: `text-bg-primary`, `text-bg-warning`.

The colour names are the same everywhere: primary (blue), secondary (grey), success (green), danger (red), warning (yellow), info (cyan), light and dark.

## Display and flex helpers

`d-block`, `d-inline`, `d-none` and `d-flex` set the display value, and `d-md-none` style variants work at breakpoints. Once an element is `d-flex`, add:

- `flex-row` or `flex-column` for the direction,
- `justify-content-start | center | end | between | around` for the main axis,
- `align-items-start | center | end` for the cross axis,
- `flex-wrap` and `gap-*` for wrapping and spacing.

## Borders, corners and shadows

`border` adds a border, `border-0` removes it, `border-primary` or `border-2` change colour and width. `rounded` rounds corners; `rounded-3` rounds more and `rounded-pill` and `rounded-circle` make capsules and circles. `shadow-sm`, `shadow` and `shadow-lg` give a small, medium or large shadow.

## Why utilities are useful (and their limit)

Utilities are quick, consistent and need no new CSS. The limit is readability: a long class list gets noisy. When you repeat the same ten classes many times, make a small component of your own (a class in `style.css`) or a reusable template.

> **Watch out:**
> - Combining a utility with your own CSS and wondering why yours loses. Many utilities use `!important`, so they beat normal rules. Remove the utility or raise your own specificity.
> - Writing `d-flex` and then forgetting that `justify-content-*` and `align-items-*` only affect the direct children.
> - Using `text-white` on a light background. Check contrast: pale text on a pale background is unreadable.
> - Inventing sizes such as `mt-6`. The scale stops at 5.
> - Using `ms-` and `me-` and expecting left and right in all languages. They mean start and end, which flip in right-to-left languages.

> **Your turn:** style the banner. Give each element the classes listed in the comment: dark background, white text, padding `p-5`, `rounded-3` and a `shadow` on `#banner`; bold uppercase `text-info` on `#kicker`; `display-5 fw-bold` on `#title`; `lead text-white-50` on `#intro`; a `d-flex` row with `justify-content-between align-items-center` on `#actions`; a `rounded-pill` outline on `#date`; and `btn btn-light btn-lg` on `#signup`.
