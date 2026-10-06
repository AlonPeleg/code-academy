---
title: Components - cards, buttons, badges, alerts and list groups
summary: Assemble a row of product cards, an alert and a list group from Bootstrap's ready-made components.
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
          <title>Desk Gear shop</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-5">
            <!-- 1. Turn this div into a success alert: give it the base alert class plus the success variant,
                    and add the attribute role with the value alert so screen readers announce it. -->
            <div>Free shipping on orders over $50 this week.</div>

            <h1 class="h3 my-4">Desk Gear</h1>

            <div class="row row-cols-1 row-cols-md-3 g-4">
              <div class="col">
                <div class="card h-100">
                  <div class="card-body">
                    <span class="badge text-bg-success mb-2">In stock</span>
                    <h2 class="card-title h5">Headphones</h2>
                    <p class="card-text">Soft ear cushions and a clear sound.</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="fw-bold">$59</span>
                    <a href="#" class="btn btn-primary btn-sm">Add to cart</a>
                  </div>
                </div>
              </div>

              <!-- 2. Copy the whole column above twice and change the text:
                      Keyboard, $45, "Quiet keys with a satisfying click." (badge text-bg-warning, "Low stock")
                      Webcam, $39, "Sharp 1080p picture for calls." (badge text-bg-secondary, "Pre-order") -->
            </div>

            <h2 class="h5 mt-5">Shipping info</h2>
            <!-- 3. Turn this list into a list group: the ul gets the list-group class, each li gets list-group-item. -->
            <ul>
              <li>Free returns within 30 days</li>
              <li>Ships in 2 working days</li>
              <li>Two-year warranty</li>
            </ul>
          </div>
        </body>
      </html>
check:
  dom:
    text:
      - "Keyboard"
      - "Webcam"
      - "$45"
      - "$39"
    selectors:
      - "div.alert.alert-success"
      - ".row > .col:nth-child(3) .card .btn-primary"
      - ".row > .col:nth-child(3) .badge"
      - "ul.list-group > li.list-group-item:nth-child(3)"
    styles:
      - { selector: ".alert-success", property: "background-color", value: "rgb(209, 231, 221)" }
      - { selector: ".list-group", property: "display", value: "flex" }
      - { selector: ".card", property: "display", value: "flex" }
  code:
    - { pattern: 'role=["'']alert', message: 'Add role="alert" to the alert so assistive technology announces it.' }
    - { pattern: '(class="card h-100"[\s\S]*){3}', message: "You need three product cards, each with the classes card h-100." }
hints:
  - "Each component is a base class plus parts: alert + alert-success, list-group + list-group-item, and for cards the card, card-body and card-footer you already see in the first product."
  - "Change the first div to class alert alert-success with role alert, and the list to list-group / list-group-item. For the cards, copy the entire col div (not only the card) and edit the text."
  - 'Alert: <div class="alert alert-success" role="alert">. List: <ul class="list-group"> with <li class="list-group-item"> items. Inside the row, paste two more <div class="col"> ... </div> blocks for Keyboard ($45) and Webcam ($39).'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Desk Gear shop</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-5">
            <div class="alert alert-success" role="alert">Free shipping on orders over $50 this week.</div>

            <h1 class="h3 my-4">Desk Gear</h1>

            <div class="row row-cols-1 row-cols-md-3 g-4">
              <div class="col">
                <div class="card h-100">
                  <div class="card-body">
                    <span class="badge text-bg-success mb-2">In stock</span>
                    <h2 class="card-title h5">Headphones</h2>
                    <p class="card-text">Soft ear cushions and a clear sound.</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="fw-bold">$59</span>
                    <a href="#" class="btn btn-primary btn-sm">Add to cart</a>
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="card h-100">
                  <div class="card-body">
                    <span class="badge text-bg-warning mb-2">Low stock</span>
                    <h2 class="card-title h5">Keyboard</h2>
                    <p class="card-text">Quiet keys with a satisfying click.</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="fw-bold">$45</span>
                    <a href="#" class="btn btn-primary btn-sm">Add to cart</a>
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="card h-100">
                  <div class="card-body">
                    <span class="badge text-bg-secondary mb-2">Pre-order</span>
                    <h2 class="card-title h5">Webcam</h2>
                    <p class="card-text">Sharp 1080p picture for calls.</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="fw-bold">$39</span>
                    <a href="#" class="btn btn-primary btn-sm">Add to cart</a>
                  </div>
                </div>
              </div>
            </div>

            <h2 class="h5 mt-5">Shipping info</h2>
            <ul class="list-group">
              <li class="list-group-item">Free returns within 30 days</li>
              <li class="list-group-item">Ships in 2 working days</li>
              <li class="list-group-item">Two-year warranty</li>
            </ul>
          </div>
        </body>
      </html>
quiz:
  - q: Which class makes all the cards in a row the same height?
    options: ["card-equal", "h-100 on each card", "card-body"]
    answer: 1
    explain: "h-100 sets height 100% and the column is as tall as the tallest one in the row."
  - q: How do you make a green alert?
    options: ["alert together with alert-success", "success on its own", "btn-success"]
    answer: 0
  - q: What is a badge for?
    options: ["A large banner image", "A form field", "A small label such as a status or a count"]
    answer: 2
  - q: What must a list-group-item be placed inside?
    options: ["A div with the class list-group-wrapper", "An element with the class list-group (a ul or a div)", "A card-body only"]
    answer: 1
---

Bootstrap's **components** are finished interface pieces. You do not design a card from scratch: you write the right HTML structure with the right class names and it appears, already padded, rounded and responsive. This lesson covers the five you will use most.

## Buttons

You met `btn` plus a colour. More options:

- Colours: `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`, `btn-warning`, `btn-info`, `btn-light`, `btn-dark`.
- Outline versions: `btn-outline-primary` and so on.
- Sizes: `btn-sm` and `btn-lg`.
- Works on `<button>` and on `<a>`. Use a real `<a href>` for links to another page and `<button>` for actions.

## Cards

A card is a flexible box for a bit of content. The structure matters:

```html
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Title</h5>
    <p class="card-text">Some text.</p>
  </div>
  <div class="card-footer">Footer</div>
</div>
```

- `card` draws the border and rounded corners.
- `card-body` adds padding around the content. `card-header` and `card-footer` are optional strips at the top and bottom.
- `card-title` and `card-text` tidy the margins of headings and paragraphs.
- There is also `card-img-top` for an image at the top. In this course we avoid external images, so a coloured `div` can stand in.

**A row of cards.** Put each card in a grid column. `row row-cols-1 row-cols-md-3 g-4` says "one card per line on phones, three per line from md up, with a gutter of 4". Each child of the row becomes a column automatically, so they only need `col`. Add `h-100` to every card so they stretch to the same height even when their text lengths differ.

## Badges

A badge is a small pill-like label, great for statuses and counts: `<span class="badge text-bg-success">In stock</span>`. `text-bg-*` sets both the background colour and a readable text colour. Add `rounded-pill` for fully round ends.

## Alerts

An alert is a coloured message bar:

```html
<div class="alert alert-success" role="alert">Saved!</div>
```

`alert` is the base and `alert-success`, `alert-info`, `alert-warning`, `alert-danger` choose the colour family. `role="alert"` tells screen readers to announce it. Inside an alert, links can use `alert-link`. With the JavaScript bundle you can also add `alert-dismissible fade show` and a close button (`btn-close` with `data-bs-dismiss="alert"`) to make it closable.

## List groups

A list group is a styled list, for menus, settings or shipping details:

```html
<ul class="list-group">
  <li class="list-group-item">First</li>
  <li class="list-group-item active">Second (highlighted)</li>
</ul>
```

Add `list-group-flush` to remove outer borders, or `list-group-numbered` for numbers.

## Reading a component

Look at the first product card in the exercise: a `card h-100` in a `col`, a `card-body` with a badge, a heading and text, and a `card-footer` using the flex utilities from the last lesson to put the price and button at opposite ends. Components and utilities work together like this all the time.

> **Watch out:**
> - Putting the `card-title` or text outside `card-body`. They then touch the card's border because the padding comes from the body.
> - Copying only the inner card and not the `col` wrapper. The row then gets a card that is not a column, and the three-per-line layout breaks.
> - Using `alert-success` without `alert`. Nothing is styled.
> - Using `<div class="btn">` for something that navigates. Use `<a>` or `<button>` for correct keyboard and screen reader behaviour.
> - Forgetting `h-100`, which gives cards of different heights in a row.

> **Your turn:** make the first div a `div` with classes `alert alert-success` and `role="alert"`, copy the product column twice to add a Keyboard ($45) and a Webcam ($39) card with the texts from the comment, and turn the shipping list into a `list-group` with `list-group-item` entries.
