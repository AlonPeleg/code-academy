---
title: Bootstrap or Tailwind - which should you use?
summary: Build the same product card with both frameworks, then compare them and learn how to choose.
level: intermediate
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Bootstrap or Tailwind</title>
          <!-- Both libraries are loaded here ONLY so you can compare them side by side. Real projects pick one. -->
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-body-tertiary">
          <div class="container py-5">
            <h1 class="h3 mb-4">The same card, two ways</h1>
            <div class="row g-4">
              <div class="col-md-6">
                <!-- 1. BOOTSTRAP card: use its component classes. The outer box is a card (also give it
                        h-100 and shadow-sm), the inner box is the card body, the heading is a card title
                        (add h4 so it is a sensible size), the text is card text in a secondary colour,
                        and the link is a primary button. -->
                <div id="bs-card">
                  <div>
                    <h2>Trail Backpack</h2>
                    <p>Light, tough and ready for anything. 28 litres with a rain cover.</p>
                    <a href="#">Add to cart</a>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <!-- 2. TAILWIND card: build the same thing from utilities. The outer box is a flex column
                        (full height, small gap) with a rounded-xl white surface, 1.5rem padding and a small shadow.
                        Title: text-xl, bold, dark slate. Text: slate-600. Button: aligned to the start,
                        rounded-lg, indigo background, px-6 py-2, semibold, white text.
                        Tip: the trailing exclamation mark (rounded-lg!) is needed on the button here, see the lesson. -->
                <div id="tw-card">
                  <div>Trail Backpack</div>
                  <div>Light, tough and ready for anything. 28 litres with a rain cover.</div>
                  <button>Add to cart</button>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
check:
  dom:
    text:
      - "Trail Backpack"
      - "Add to cart"
    selectors:
      - "#bs-card.card"
      - "#bs-card .card-body"
      - "#bs-card .card-title"
      - "#bs-card .btn.btn-primary"
    styles:
      - { selector: "#bs-card", property: "border-radius", value: "6px" }
      - { selector: "#bs-card .card-body", property: "padding-top", value: "16px" }
      - { selector: "#bs-card .btn-primary", property: "background-color", value: "rgb(13, 110, 253)" }
      - { selector: "#tw-card", property: "display", value: "flex" }
      - { selector: "#tw-card", property: "flex-direction", value: "column" }
      - { selector: "#tw-card", property: "padding-top", value: "24px" }
      - { selector: "#tw-card", property: "border-radius", value: "12px" }
      - { selector: "#tw-card button", property: "border-radius", value: "8px" }
      - { selector: "#tw-card button", property: "padding-left", value: "24px" }
      - { selector: "#tw-card button", property: "font-weight", value: "600" }
hints:
  - "Bootstrap side: it is all ready-made components. You need card, card-body, card-title, card-text, btn and btn-primary. Tailwind side: you describe the look with small classes on each element."
  - "Bootstrap: card h-100 shadow-sm on the outer div, card-body on the inner div, card-title h4 on the h2, card-text text-secondary on the p, btn btn-primary on the link. Tailwind: flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm on #tw-card."
  - "<div id=\"bs-card\" class=\"card h-100 shadow-sm\"> ... <h2 class=\"card-title h4\"> <p class=\"card-text text-secondary\"> <a href=\"#\" class=\"btn btn-primary\">   <div id=\"tw-card\" class=\"flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm\">   title: text-xl font-bold text-slate-900   text: text-slate-600   <button class=\"mt-2 self-start rounded-lg! bg-indigo-600 px-6 py-2 font-semibold text-white\">"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Bootstrap or Tailwind</title>
          <!-- Both libraries are loaded here ONLY so you can compare them side by side. Real projects pick one. -->
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-body-tertiary">
          <div class="container py-5">
            <h1 class="h3 mb-4">The same card, two ways</h1>
            <div class="row g-4">
              <div class="col-md-6">
                <div id="bs-card" class="card h-100 shadow-sm">
                  <div class="card-body">
                    <h2 class="card-title h4">Trail Backpack</h2>
                    <p class="card-text text-secondary">Light, tough and ready for anything. 28 litres with a rain cover.</p>
                    <a href="#" class="btn btn-primary">Add to cart</a>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div id="tw-card" class="flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm">
                  <div class="text-xl font-bold text-slate-900">Trail Backpack</div>
                  <div class="text-slate-600">Light, tough and ready for anything. 28 litres with a rain cover.</div>
                  <button class="mt-2 self-start rounded-lg! bg-indigo-600 px-6 py-2 font-semibold text-white">Add to cart</button>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
quiz:
  - q: Which statement about bundle size is closest to the truth?
    options: ["Bootstrap ships its whole stylesheet; a built Tailwind project ships only the utilities you used", "Tailwind always ships a bigger file than Bootstrap", "Neither framework affects page size"]
    answer: 0
  - q: "You need a polished admin dashboard with modals, dropdowns and a form layout this week, and have no design. Which is the easier start?"
    options: ["Tailwind, because it has no components and you can design everything", "Bootstrap, because it ships ready-made, accessible components", "Plain HTML only"]
    answer: 1
  - q: Why does the Tailwind button in this lesson use px-6 instead of px-4?
    options: ["px-4 is not a Tailwind class", "px-6 is required by the Tailwind grid", "Both frameworks define px-4 with different values, and Bootstrap's wins"]
    answer: 2
    explain: Bootstrap's px-4 is 1.5rem and uses !important, Tailwind's is 1rem. This is one more reason not to load both in a real project.
  - q: Which description fits Tailwind best?
    options: ["Low-level utility classes you combine to build your own design", "Ready-made components you only have to tweak", "A JavaScript framework for building apps"]
    answer: 0
---

You have now learned two ways to style a page quickly, and a very common question is "which one should I use?". The honest answer is: both are good, and they are good at different things. In this lesson you build the same product card with each, then compare them and get a short decision guide.

## The same card, two ways

**Bootstrap** gives you a finished component. You name it and its parts:

```html
<div class="card h-100 shadow-sm">
  <div class="card-body">
    <h2 class="card-title h4">Trail Backpack</h2>
    <p class="card-text text-secondary">...</p>
    <a href="#" class="btn btn-primary">Add to cart</a>
  </div>
</div>
```

You write about five class names and get padding, a border, rounded corners and a blue button. If you want something Bootstrap did not plan for, you override it with CSS.

**Tailwind** gives you no component. You build the look from tiny utilities:

```html
<div class="flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm">
  <div class="text-xl font-bold text-slate-900">Trail Backpack</div>
  <button class="rounded-lg! bg-indigo-600 px-6 py-2 font-semibold text-white">Add to cart</button>
</div>
```

More classes, but every one is visible in the HTML, and nothing is hidden behind a name. Changing the radius of one button is a one-word edit.

## Comparison

| | Bootstrap | Tailwind |
| --- | --- | --- |
| Idea | Ready-made components plus a 12-column grid | Low-level utilities you combine |
| First result | Very fast, the page looks decent immediately | Fast once you know the class names |
| Learning curve | Gentle: learn component names | Medium: learn the scale and naming pattern |
| Look | Recognisable "Bootstrap look" unless you customise | Looks like whatever you design |
| JavaScript parts | Included: modal, dropdown, carousel, tooltip | None. You bring your own or use a library |
| Customising | CSS variables, a Sass build, or overrides | Edit the theme (`@theme`), compose utilities |
| Size | Whole stylesheet: about 230 KB, around 30 KB compressed | A build outputs only used classes, often 10 to 30 KB |
| Best for | Dashboards, admin tools, prototypes, teams who want consistency | Custom designs, component-based apps (React, Vue, and so on) |

## How to choose

Ask yourself these questions in order:

1. **Do I have a custom design to match?** Pick Tailwind. Bootstrap's components fight you when you have to look unique.
2. **Do I need a working interface by tomorrow with no designer?** Pick Bootstrap. Navbar, modal, forms and alerts work out of the box.
3. **Is the project built from components (React, Vue, Svelte)?** Tailwind fits very well, since repetition lives in components.
4. **Is the team mostly backend developers who dislike writing CSS?** Bootstrap is easier to keep consistent.
5. **Do I already know one of them well?** Use it. Skill beats theory.

Many developers learn Bootstrap first, then move to Tailwind for later projects. Neither choice is permanent; the underlying CSS you learned is the same.

## Why the Tailwind button has an exclamation mark

Loading both libraries is **only for this lesson**. Doing it for real causes clashes. Two examples that you can see in this exercise:

- Bootstrap's reset says `button { border-radius: 0 }`, and Tailwind v4 puts its classes in a lower CSS "layer", so Bootstrap wins. Adding `!` at the end (`rounded-lg!`) is Tailwind's **important modifier** and makes the class win.
- Both frameworks have classes with the same name but different values. Bootstrap's `px-4` is 1.5rem and is marked important; Tailwind's `px-4` is 1rem. That is why the Tailwind button uses `px-6`, which Bootstrap does not define.

Because Bootstrap styles bare elements such as `p`, `h2` and `a`, the Tailwind card uses `div` elements for its text. In a project that uses only Tailwind you would use `p` and `h2` normally.

> **Watch out:**
> - Do not ship a page with both frameworks loaded. You pay for two stylesheets and fight their clashes.
> - Typos still do nothing. A missing `btn-primary` gives you an unstyled link, and `bg-indgo-600` gives a transparent button.
> - Do not decide from popularity alone. Both are widely used and well maintained, so pick by project need.
> - Remember that Bootstrap's interactive parts (navbar toggler, modal) need its JavaScript file as well as the CSS.

## Going further

Re-style the Bootstrap card by overriding its variables (add `style="--bs-card-border-radius: 1rem"`), and swap `bg-indigo-600` for `bg-emerald-600` in the Tailwind one. Which change felt more natural to you?

> **Your turn:** complete both cards. Bootstrap: `card h-100 shadow-sm`, `card-body`, `card-title h4`, `card-text text-secondary`, `btn btn-primary`. Tailwind: `flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm` on the card, `text-xl font-bold` on the title, and `rounded-lg! bg-indigo-600 px-6 py-2 font-semibold text-white` on the button.
