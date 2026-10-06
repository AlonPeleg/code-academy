---
title: Tailwind - building a component set
summary: Build a navbar, hero, card grid and footer, and learn how to handle repetition, @apply, @utility and arbitrary values.
level: advanced
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Learnly</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <style type="text/tailwindcss">
            @layer components {
              /* 1. Create a .btn class from existing utilities: rounded-lg, indigo-600 background,
                    px-4, py-2, font-semibold and white text. Use the apply rule instead of writing CSS. */
            }
          </style>
        </head>
        <body class="bg-slate-50 text-slate-800">
          <!-- Navbar: already built for you. Notice how it uses flex and justify-between -->
          <header class="bg-white shadow-sm">
            <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <a href="#" class="text-xl font-bold text-indigo-600">Learnly</a>
              <ul class="flex gap-6 text-sm font-medium text-slate-600">
                <li><a href="#courses" class="hover:text-indigo-600">Courses</a></li>
                <li><a href="#" class="hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" class="hover:text-indigo-600">Help</a></li>
              </ul>
            </nav>
          </header>

          <!-- 2. Hero: purple-to-indigo gradient, 5rem of padding top and bottom, centred, white text.
                  Heading: 4xl and bold. Paragraph: centred block, at most 36rem wide, a lighter indigo text. -->
          <section id="hero">
            <h1>Learn something new today</h1>
            <p>Short, friendly courses that take you from zero to confident, one lesson at a time.</p>
            <a href="#courses" class="btn mt-8 inline-block bg-white text-indigo-700">Browse courses</a>
          </section>

          <main id="courses" class="mx-auto max-w-5xl px-6 py-16">
            <h2 class="text-2xl font-bold">Popular courses</h2>
            <!-- 3. Card grid: a grid with a 1.5rem gap whose columns are at least 16rem wide and fill the row
                    (use an arbitrary value in square brackets for the columns) -->
            <div id="cards" class="mt-8"></div>
          </main>

          <!-- 4. Footer: a top border in slate-200, 2rem padding top and bottom, centred small grey text -->
          <footer>
            <p>Made with care. Copyright 2026 Learnly.</p>
          </footer>

          <script src="script.js"></script>
        </body>
      </html>
  - name: script.js
    code: |
      // The data for the cards. Real projects would load this from an API or a file.
      const courses = [
        { title: "HTML basics", lessons: 12, level: "Beginner" },
        { title: "CSS layouts", lessons: 10, level: "Intermediate" },
        { title: "JavaScript essentials", lessons: 18, level: "Beginner" },
        { title: "Responsive design", lessons: 8, level: "Intermediate" },
      ];

      const list = document.getElementById("cards");

      // 5. Go through the courses one by one and add an <article> card for each, using a template string.
      //    Write the full class names inside the template (never build a class name from pieces).
      //    Each card: a flex column with rounded-2xl, white background, p-6, shadow-md and an arbitrary min height of 200px.
      //    Inside: the level (small, uppercase, indigo), the title (lg, bold), "N lessons" (sm, grey) and a "btn" link.
check:
  dom:
    text:
      - "Popular courses"
      - "HTML basics"
      - "Responsive design"
    selectors:
      - "#cards > article"
    styles:
      - { selector: ".btn", property: "padding-left", value: "16px" }
      - { selector: ".btn", property: "border-radius", value: "8px" }
      - { selector: ".btn", property: "font-weight", value: "600" }
      - { selector: "#hero", property: "padding-top", value: "80px" }
      - { selector: "#hero", property: "text-align", value: "center" }
      - { selector: "#hero h1", property: "font-size", value: "36px" }
      - { selector: "#cards", property: "display", value: "grid" }
      - { selector: "#cards", property: "row-gap", value: "24px" }
      - { selector: "#cards > article", property: "display", value: "flex" }
      - { selector: "#cards > article", property: "min-height", value: "200px" }
      - { selector: "footer", property: "padding-top", value: "32px" }
      - { selector: "footer", property: "text-align", value: "center" }
  code:
    - { file: "index.html", pattern: '\.btn\s*\{[^}]*@apply\s+[^;}]*\brounded-lg\b', message: "Define .btn inside @layer components with @apply rounded-lg ... ;" }
    - { file: "index.html", pattern: 'id="cards"[^>]*\bgrid-cols-\[', message: "Use an arbitrary value for the columns on #cards, such as grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]." }
    - { file: "script.js", pattern: '\.forEach\s*\(|\.map\s*\(|for\s*\(', message: "Loop over the courses in script.js (forEach, map or a for loop)." }
    - { file: "script.js", pattern: 'min-h-\[200px\]', message: "Use the arbitrary value min-h-[200px] in the card's classes." }
hints:
  - "Four jobs: @apply inside @layer components for .btn, classes on the hero and footer, an arbitrary-value grid for #cards, and a loop in script.js that writes the cards."
  - "Inside the layer write .btn { @apply rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white; }. The grid is grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]. In JavaScript, courses.forEach((course) => { list.innerHTML += `...${course.title}...`; });"
  - "#cards: class=\"mt-8 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6\"   #hero: class=\"bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-20 text-center text-white\"   h1: text-4xl font-bold   footer: class=\"border-t border-slate-200 py-8 text-center text-sm text-slate-500\"   card: class=\"flex min-h-[200px] flex-col justify-between rounded-2xl bg-white p-6 shadow-md\""
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Learnly</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <style type="text/tailwindcss">
            @layer components {
              .btn {
                @apply rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500;
              }
            }
          </style>
        </head>
        <body class="bg-slate-50 text-slate-800">
          <header class="bg-white shadow-sm">
            <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <a href="#" class="text-xl font-bold text-indigo-600">Learnly</a>
              <ul class="flex gap-6 text-sm font-medium text-slate-600">
                <li><a href="#courses" class="hover:text-indigo-600">Courses</a></li>
                <li><a href="#" class="hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" class="hover:text-indigo-600">Help</a></li>
              </ul>
            </nav>
          </header>

          <section id="hero" class="bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-20 text-center text-white">
            <h1 class="text-4xl font-bold tracking-tight">Learn something new today</h1>
            <p class="mx-auto mt-4 max-w-xl text-lg text-indigo-100">Short, friendly courses that take you from zero to confident, one lesson at a time.</p>
            <a href="#courses" class="btn mt-8 inline-block bg-white text-indigo-700">Browse courses</a>
          </section>

          <main id="courses" class="mx-auto max-w-5xl px-6 py-16">
            <h2 class="text-2xl font-bold">Popular courses</h2>
            <div id="cards" class="mt-8 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6"></div>
          </main>

          <footer class="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
            <p>Made with care. Copyright 2026 Learnly.</p>
          </footer>

          <script src="script.js"></script>
        </body>
      </html>
  - name: script.js
    code: |
      // The data for the cards. Real projects would load this from an API or a file.
      const courses = [
        { title: "HTML basics", lessons: 12, level: "Beginner" },
        { title: "CSS layouts", lessons: 10, level: "Intermediate" },
        { title: "JavaScript essentials", lessons: 18, level: "Beginner" },
        { title: "Responsive design", lessons: 8, level: "Intermediate" },
      ];

      const list = document.getElementById("cards");

      courses.forEach((course) => {
        list.innerHTML += `
          <article class="flex min-h-[200px] flex-col justify-between rounded-2xl bg-white p-6 shadow-md">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wide text-indigo-600">${course.level}</span>
              <h3 class="mt-2 text-lg font-bold">${course.title}</h3>
              <p class="mt-1 text-sm text-slate-500">${course.lessons} lessons</p>
            </div>
            <a href="#" class="btn mt-6 text-center">Start</a>
          </article>`;
      });
quiz:
  - q: Why is class="bg-${color}-500" in a template string a bad idea?
    options: ["It is too long", "Tailwind looks for complete class names in your source, so a half-built name may never get its CSS generated", "Template strings cannot contain quotes"]
    answer: 1
  - q: When is @apply a good choice?
    options: ["For every element, to keep the HTML short", "Never - it is deprecated", "For a small, repeated piece you cannot easily turn into a component or template, like a button class"]
    answer: 2
  - q: What does w-[320px] do?
    options: ["Sets the width to exactly 320 pixels using an arbitrary value", "Sets the width to the 320th step of the scale", "Nothing - square brackets are comments"]
    answer: 0
  - q: In a real project, what is usually the BEST way to avoid repeating a long card class string?
    options: ["Copy and paste it, then fix mistakes later", "Make a reusable component, template or partial and reuse it", "Move all the classes into one huge stylesheet"]
    answer: 1
---

Small pages are easy. A real site has a navbar, a hero, lists of cards and a footer, and you will repeat patterns dozens of times. In this lesson you assemble a full page from four components and learn the habits that keep a Tailwind project tidy: handling repetition, using `@apply` carefully, adding your own utilities, using arbitrary values and keeping class strings readable.

## The four components

- **Navbar** - `flex items-center justify-between` inside a centred `max-w-5xl` container. The starter gives it to you; study how few classes it needs.
- **Hero** - a big coloured band: gradient background, generous vertical padding (`py-20`), centred text, a narrow paragraph (`mx-auto max-w-xl`).
- **Card grid** - one `grid` with a `gap`, and identical cards inside.
- **Footer** - a border on top, padding, small grey text.

The hero's gradient is `bg-linear-to-r from-violet-600 to-indigo-600`: direction first, then the start and end colours. (In v3 this was `bg-gradient-to-r`.)

## Handling repetition

Utility classes make long strings, and a card with 12 classes repeated six times is painful. The answer is **not** a big CSS file. It is to repeat the *markup* from one place:

- In plain HTML with JavaScript, loop over your data and write each card from a **template string**, as you do in `script.js`. One class string, written once.
- In a framework (React, Vue, Svelte, Astro), make a `<Card />` **component**.
- In a server-rendered site (Django, Rails, Laravel, Eleventy), use a **partial** or **include** or a template loop.

Copy-pasting a few times in a small static page is fine. When you paste a third time, extract it.

## @apply for tiny patterns

`@apply` pulls utilities into your own CSS class. It goes in the `text/tailwindcss` style tag:

```css
@layer components {
  .btn {
    @apply rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white;
  }
}
```

Now `class="btn"` gives all five utilities. Because `components` is a lower layer than `utilities`, a utility on the element still wins: `btn bg-white text-indigo-700` is a white button. That is why the hero button looks different from the card buttons.

**When NOT to use it:** do not `@apply` your whole design into classes like `.card-title-large`. You lose the benefits of utilities (no naming, no switching files) and rebuild the problem Tailwind solves. Reach for it only for small, genuinely repeated things such as a button, and prefer a component or template first.

## @utility for your own utilities

When Tailwind does not have a utility you need, define a real one with `@utility`. It works with variants like `hover:` and `md:` automatically:

```css
@utility scrollbar-none {
  scrollbar-width: none;
}
```

## Arbitrary values

Need a value that is not on the scale? Put it in square brackets: `w-[320px]`, `min-h-[200px]`, `bg-[#4f46e5]`, `top-[3px]`. They also handle complex values; underscores stand for spaces. `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]` makes a grid that fits as many 16rem columns as will fit, with no breakpoints at all. Use arbitrary values sparingly: if you write `p-[17px]` often, your design is missing a scale step.

## Readable class strings

A consistent order helps you scan: layout (`flex`, `grid`), box (`p-6`, `max-w-5xl`), typography (`text-lg font-bold`), colours (`bg-white text-slate-600`), then states and breakpoints (`hover:`, `md:`). Many teams install the official Prettier plugin, which sorts classes for you automatically. For long elements, break the class attribute over several lines.

> **Watch out:**
> - Building class names from pieces, for example `"bg-" + color + "-500"` or `` `text-${size}` ``. Tailwind finds classes by scanning your source for complete names. A production build will not generate CSS for names it never sees written out. Write the whole name (`bg-red-500`) and choose between full names in your code.
> - Related to this: in a production build only the classes found in your files exist. If a class works in the preview but vanishes after build, the build is not scanning that file.
> - Over-using `@apply` and recreating a normal stylesheet. Use components first.
> - Putting a space inside an arbitrary value: `grid-cols-[repeat(3, 1fr)]` breaks the class. Use `_` for spaces, or leave them out.
> - Adding to `innerHTML` with `+=` inside a big loop is fine for tiny lists, but for large ones build the full string first and assign it once.

> **Your turn:** finish the page. Create `.btn` with `@apply` inside `@layer components`; style the hero (gradient, `py-20`, centred, white text, `text-4xl` heading); make `#cards` a `gap-6` grid with an arbitrary `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]`; style the footer; and in `script.js` loop over `courses` to write one card each, using `min-h-[200px]` and full class names.
