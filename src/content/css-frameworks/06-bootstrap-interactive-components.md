---
title: Interactive components - modal, accordion, dropdown and tooltip
summary: Add popups and expanding panels with data-bs attributes, no JavaScript of your own (except one line for tooltips), and make them accessible.
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
          <title>Club help centre</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-5">
            <h1 class="h3 mb-4">Club help centre</h1>

            <!-- A. DROPDOWN. The wrapper gets the class dropdown. The button gets btn btn-outline-secondary dropdown-toggle,
                    data-bs-toggle set to dropdown and aria-expanded set to false. The ul gets dropdown-menu
                    and each link gets dropdown-item. -->
            <div>
              <button type="button">Account</button>
              <ul>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Sign out</a></li>
              </ul>
            </div>

            <!-- B. TOOLTIP. Add data-bs-toggle set to tooltip and data-bs-title set to Saves your work to this button,
                    then write the two lines of JavaScript in script.js. -->
            <button type="button" class="btn btn-success mt-3">Save draft</button>

            <!-- C. MODAL. The button opens it: data-bs-toggle modal and data-bs-target #termsModal.
                    The outer div: modal fade, tabindex -1, aria-labelledby termsTitle, aria-hidden true.
                    Then modal-dialog, modal-content, modal-header (title gets modal-title; the x button gets btn-close,
                    data-bs-dismiss modal and aria-label Close), modal-body and modal-footer. -->
            <button type="button" class="btn btn-primary mt-3">Read the terms</button>

            <div id="termsModal">
              <div>
                <div>
                  <div>
                    <h2 id="termsTitle">Club terms</h2>
                    <button type="button"></button>
                  </div>
                  <div>Be kind, carry water and leave no litter.</div>
                  <div>
                    <button type="button" class="btn btn-secondary">Close</button>
                    <button type="button" class="btn btn-primary">I agree</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- D. ACCORDION. The first item is finished. Copy it twice for the other questions: change the ids
                    (faq2, faq3) in data-bs-target, aria-controls and the id of the panel; remove the show class,
                    set aria-expanded to false and add the class collapsed to the buttons of items 2 and 3.
                    Question 2: Do I need equipment?   Answer: Just sturdy shoes and water.
                    Question 3: Can children join?     Answer: Yes, with an adult. -->
            <h2 class="h5 mt-5">Questions</h2>
            <div class="accordion" id="faq">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="true" aria-controls="faq1">Is the club free?</button>
                </h2>
                <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faq">
                  <div class="accordion-body">Yes, membership costs nothing.</div>
                </div>
              </div>
            </div>
          </div>

          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="script.js"></script>
        </body>
      </html>
  - name: script.js
    code: |
      // Tooltips are opt-in: Bootstrap does not switch them on by itself.
      // 1. Select every element with the attribute data-bs-toggle="tooltip" (use a method of document that finds all matches).
      // 2. For each element, create one Bootstrap tooltip object. The global name is bootstrap, the class is Tooltip.
check:
  dom:
    text:
      - "Do I need equipment?"
      - "Can children join?"
    selectors:
      - ".dropdown > .dropdown-toggle[data-bs-toggle=\"dropdown\"]"
      - ".dropdown > .dropdown-menu > li:nth-child(3) > .dropdown-item"
      - "button.btn-success[data-bs-toggle=\"tooltip\"][data-bs-title]"
      - "button.btn-primary[data-bs-toggle=\"modal\"][data-bs-target=\"#termsModal\"]"
      - "#termsModal.modal.fade[tabindex=\"-1\"][aria-labelledby=\"termsTitle\"] > .modal-dialog > .modal-content"
      - "#termsModal .modal-header .btn-close[data-bs-dismiss=\"modal\"][aria-label=\"Close\"]"
      - "#termsModal .modal-body"
      - "#termsModal .modal-footer .btn-primary"
      - "#faq > .accordion-item:nth-child(3) .accordion-button[data-bs-toggle=\"collapse\"]"
      - "#faq3.accordion-collapse.collapse[data-bs-parent=\"#faq\"]"
    styles:
      - { selector: ".modal", property: "display", value: "none" }
      - { selector: ".dropdown-menu", property: "display", value: "none" }
      - { selector: ".accordion-button", property: "display", value: "flex" }
  code:
    - { file: 'script.js', pattern: 'new\s+bootstrap\.Tooltip', message: "In script.js, create a tooltip for each element with new bootstrap.Tooltip(element)." }
    - { file: 'script.js', pattern: 'querySelectorAll', message: "In script.js, use document.querySelectorAll to find every tooltip trigger." }
    - { pattern: 'aria-controls=["'']faq3', message: 'The third accordion button needs aria-controls="faq3".' }
hints:
  - "Bootstrap widgets are driven by attributes: data-bs-toggle says what kind of widget, data-bs-target says which element it controls. The bundle script reads them for you."
  - "For the modal, the outer div needs modal fade and the dialog structure inside it. For the accordion, copy item 1 and change faq1 to faq3 everywhere (button target, aria-controls, panel id). For tooltips, loop over document.querySelectorAll with forEach."
  - 'script.js: document.querySelectorAll(''[data-bs-toggle="tooltip"]'').forEach(el => new bootstrap.Tooltip(el)); Dropdown: <div class="dropdown"> with a button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" and <ul class="dropdown-menu"> with <a class="dropdown-item">.'
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Club help centre</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container py-5">
            <h1 class="h3 mb-4">Club help centre</h1>

            <div class="dropdown">
              <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Account</button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><a class="dropdown-item" href="#">Sign out</a></li>
              </ul>
            </div>

            <button type="button" class="btn btn-success mt-3" data-bs-toggle="tooltip" data-bs-title="Saves your work">Save draft</button>

            <button type="button" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#termsModal">Read the terms</button>

            <div id="termsModal" class="modal fade" tabindex="-1" aria-labelledby="termsTitle" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h2 id="termsTitle" class="modal-title h5">Club terms</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">Be kind, carry water and leave no litter.</div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I agree</button>
                  </div>
                </div>
              </div>
            </div>

            <h2 class="h5 mt-5">Questions</h2>
            <div class="accordion" id="faq">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="true" aria-controls="faq1">Is the club free?</button>
                </h2>
                <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faq">
                  <div class="accordion-body">Yes, membership costs nothing.</div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" aria-expanded="false" aria-controls="faq2">Do I need equipment?</button>
                </h2>
                <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faq">
                  <div class="accordion-body">Just sturdy shoes and water.</div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" aria-expanded="false" aria-controls="faq3">Can children join?</button>
                </h2>
                <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faq">
                  <div class="accordion-body">Yes, with an adult.</div>
                </div>
              </div>
            </div>
          </div>

          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="script.js"></script>
        </body>
      </html>
  - name: script.js
    code: |
      // Tooltips are opt-in: Bootstrap does not switch them on by itself.
      const triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      triggers.forEach((el) => new bootstrap.Tooltip(el));
quiz:
  - q: How do you make a button open a modal?
    options: ["Add onclick=modal(termsModal)", 'Add data-bs-toggle="modal" together with data-bs-target="#termsModal"', "Give the button the class open-modal"]
    answer: 1
  - q: Which of these widgets must be switched on with a little JavaScript of your own?
    options: ["Modals", "Accordions", "Tooltips"]
    answer: 2
    explain: "Tooltips and popovers are opt-in because they depend on Popper positioning; the others read the data attributes automatically."
  - q: Why does a modal have aria-labelledby pointing at its title?
    options: ["So screen readers announce the dialog by its title", "To change the title colour", "To make the modal load faster"]
    answer: 0
  - q: What does data-bs-parent="#faq" do on an accordion panel?
    options: ["Closes the whole page", "Chooses the panel colour", "Makes sure only one panel in that accordion is open at a time"]
    answer: 2
---

Menus that open, dialogs that pop up and panels that expand used to need custom JavaScript. In Bootstrap you describe the behaviour with **data attributes** in your HTML, and the JavaScript bundle (the script tag at the end of the body) does the rest. This lesson shows the four most common widgets and the accessibility attributes they need.

## How data attributes work

Bootstrap's script scans the page for attributes that start with `data-bs-`:

- `data-bs-toggle` says *what kind* of widget: `modal`, `collapse`, `dropdown`, `tooltip`.
- `data-bs-target` says *which element* it controls, using a CSS selector such as `#termsModal`.
- `data-bs-dismiss` on a button inside a widget says "close this".

All this works because the bundle is loaded. If a widget does nothing, check that script first.

## Dropdown

```html
<div class="dropdown">
  <button class="btn btn-outline-secondary dropdown-toggle" type="button"
          data-bs-toggle="dropdown" aria-expanded="false">Account</button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Profile</a></li>
  </ul>
</div>
```

The `dropdown` wrapper positions the menu. The menu (`dropdown-menu`) is hidden by default; the toggler button shows it. `aria-expanded` tells screen readers whether it is open, and Bootstrap updates it for you.

## Modal

A **modal** is a dialog on top of the page. Its structure is a nest of four layers: `modal` (the dark overlay), `modal-dialog` (positions the box), `modal-content` (the white box) and then `modal-header`, `modal-body` and `modal-footer`. Add `fade` for a fade-in effect.

Accessibility matters most here:

- `tabindex="-1"` lets the script focus the dialog.
- `aria-labelledby="termsTitle"` points at the `id` of the title so screen readers announce "Club terms, dialog".
- The close button `btn-close` is just an icon, so it needs `aria-label="Close"` to have a name.

## Accordion

An accordion is a stack of panels where one opens at a time. Each `accordion-item` has a header button and a collapsible panel. The button's `data-bs-target` and `aria-controls` must name the panel's `id`. `data-bs-parent="#faq"` on the panel says "close the siblings when this opens". The open item has `show` on the panel and no `collapsed` class on its button; closed items are the opposite, and `aria-expanded` matches.

The single-panel version without the parent is just **collapse**: any element with the `collapse` class can be shown and hidden by a button with `data-bs-toggle="collapse"`. The navbar menu you built earlier is a collapse.

## Tooltip

A tooltip is a small label that appears on hover or focus. Add `data-bs-toggle="tooltip"` and `data-bs-title="..."` to the element. Tooltips are the exception to "no JavaScript": for speed, Bootstrap makes you opt in with a short script:

```js
const triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
triggers.forEach((el) => new bootstrap.Tooltip(el));
```

`bootstrap` is a global object that the bundle creates; `bootstrap.Tooltip` is the class, and `new` makes one for each element. Do not rely on a tooltip for essential information, because touch screens have no hover.

## Testing it yourself

The lesson check cannot click, so it checks your markup. You can click everything in the preview, so try it: the modal fades in, the accordion closes the other panel, the dropdown closes when you click outside.

> **Watch out:**
> - Forgetting the bundle script, or loading only `bootstrap.min.js` (without Popper, dropdowns and tooltips fail). The bundle file includes Popper.
> - A `data-bs-target` that does not match the id (`#termsModal` against `termsmodal`). The click then does nothing and the console may show an error.
> - Putting the modal markup inside a container with `overflow: hidden` or transforms. Place modals as direct children of the body or a plain wrapper.
> - Copying an accordion item and keeping the old ids. Two panels with the same id make the wrong one open.
> - Tooltips that never appear because the JavaScript that creates them runs before the bundle is loaded. Load `script.js` after the bundle.

> **Your turn:** build all four widgets. Make the dropdown (`dropdown`, `dropdown-toggle`, `dropdown-menu`, `dropdown-item`), add `data-bs-toggle="tooltip"` and `data-bs-title` to the Save draft button, wire up the modal with the full structure and its `aria-` attributes, and add accordion items two and three (ids `faq2` and `faq3`). In `script.js`, create the tooltips with `new bootstrap.Tooltip`.
