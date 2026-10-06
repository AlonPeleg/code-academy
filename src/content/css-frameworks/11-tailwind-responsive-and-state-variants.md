---
title: Tailwind - responsive design and state variants
summary: "Use the sm:, md: and lg: prefixes to adapt to screen size, and hover:, focus:, group-hover: and disabled: to react to the user."
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
          <title>Brightside</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-slate-50 text-slate-800">
          <header class="bg-white shadow-sm">
            <nav class="mx-auto flex max-w-5xl items-center justify-between p-4">
              <span class="text-lg font-bold">Brightside</span>
              <!-- 1. Sign-up link: add a smooth transition (300ms) and a lighter background when hovered,
                      a darker one while pressed, and an outline when it has keyboard focus -->
              <a href="#features" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Sign up</a>
            </nav>
          </header>

          <section class="mx-auto max-w-5xl px-4 py-12 text-center">
            <!-- 2. Hero heading: 1.875rem on phones, but 3rem from the md breakpoint upwards -->
            <h1 class="text-3xl font-bold tracking-tight">Habits that stick</h1>
            <p class="mx-auto mt-4 max-w-xl text-slate-600">Brightside turns small daily actions into streaks you are proud of.</p>
            <!-- 3. This button is disabled: make it half transparent with a not-allowed cursor using the disabled variant -->
            <button disabled class="mt-6 rounded-lg bg-slate-900 px-5 py-2 font-semibold text-white">Waitlist full</button>
          </section>

          <!-- 4. Feature grid: 1 column on phones, 2 columns from sm, 3 columns from lg -->
          <div id="features" class="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 pb-12">
            <!-- 5. Each card needs the group marker, a 300ms transition and a bigger shadow on hover;
                    each little square should turn solid indigo when its card is hovered -->
            <article class="rounded-xl bg-white p-6 shadow-sm">
              <div class="size-10 rounded-lg bg-indigo-100"></div>
              <h2 class="mt-4 font-semibold">Daily streaks</h2>
              <p class="mt-1 text-sm text-slate-600">See your chain grow one day at a time.</p>
            </article>
            <article class="rounded-xl bg-white p-6 shadow-sm">
              <div class="size-10 rounded-lg bg-indigo-100"></div>
              <h2 class="mt-4 font-semibold">Gentle reminders</h2>
              <p class="mt-1 text-sm text-slate-600">A nudge at the right moment, never nagging.</p>
            </article>
            <article class="rounded-xl bg-white p-6 shadow-sm">
              <div class="size-10 rounded-lg bg-indigo-100"></div>
              <h2 class="mt-4 font-semibold">Weekly review</h2>
              <p class="mt-1 text-sm text-slate-600">Look back and celebrate what worked.</p>
            </article>
            <article class="rounded-xl bg-white p-6 shadow-sm">
              <div class="size-10 rounded-lg bg-indigo-100"></div>
              <h2 class="mt-4 font-semibold">Shared goals</h2>
              <p class="mt-1 text-sm text-slate-600">Team up with a friend for extra motivation.</p>
            </article>
            <article class="rounded-xl bg-white p-6 shadow-sm">
              <div class="size-10 rounded-lg bg-indigo-100"></div>
              <h2 class="mt-4 font-semibold">Simple stats</h2>
              <p class="mt-1 text-sm text-slate-600">Clear charts, no clutter.</p>
            </article>
            <article class="rounded-xl bg-white p-6 shadow-sm">
              <div class="size-10 rounded-lg bg-indigo-100"></div>
              <h2 class="mt-4 font-semibold">Works offline</h2>
              <p class="mt-1 text-sm text-slate-600">Tick things off even without signal.</p>
            </article>
          </div>
        </body>
      </html>
check:
  dom:
    text:
      - "Habits that stick"
      - "Waitlist full"
    selectors:
      - "button[disabled]"
      - "#features > article.group"
    styles:
      - { selector: "#features > article", property: "transition-duration", value: "0.3s" }
      - { selector: "nav a", property: "transition-duration", value: "0.3s" }
      - { selector: "button[disabled]", property: "opacity", value: "0.5" }
      - { selector: "button[disabled]", property: "cursor", value: "not-allowed" }
  code:
    - { pattern: '\bsm:grid-cols-2\b', message: "Add sm:grid-cols-2 to the #features grid." }
    - { pattern: '\blg:grid-cols-3\b', message: "Add lg:grid-cols-3 to the #features grid." }
    - { pattern: '<h1[^>]*\bmd:text-5xl\b', message: "Add md:text-5xl to the h1." }
    - { pattern: '\bhover:bg-\S+', message: "Use a hover:bg-... class on the Sign up link." }
    - { pattern: '\bactive:bg-\S+', message: "Use an active:bg-... class on the Sign up link." }
    - { pattern: '\bfocus:outline-\S+', message: "Use a focus:outline-... class on the Sign up link." }
    - { pattern: '\bhover:shadow-lg\b', message: "Use hover:shadow-lg on the cards." }
    - { pattern: '\bgroup-hover:bg-indigo-\d+', message: "Use group-hover:bg-indigo-600 (or another shade) on the little squares." }
hints:
  - "Three ideas: a prefix before a class means 'only when this is true'. Breakpoint prefixes (sm: md: lg:) mean 'at this width and wider'. State prefixes (hover: focus: active: disabled:) mean 'while the user does this'. group-hover: needs the class group on a parent."
  - "Link: transition duration-300 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-2 focus:outline-indigo-600. Card: group transition duration-300 hover:shadow-lg. Square: transition duration-300 group-hover:bg-indigo-600. Grid: sm:grid-cols-2 lg:grid-cols-3. Heading: md:text-5xl. Button: disabled:opacity-50 disabled:cursor-not-allowed."
  - "<div id=\"features\" class=\"... grid-cols-1 gap-4 ... sm:grid-cols-2 lg:grid-cols-3\">   <article class=\"group rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg\">   <div class=\"size-10 rounded-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600\">   <button disabled class=\"... disabled:cursor-not-allowed disabled:opacity-50\">"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Brightside</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-slate-50 text-slate-800">
          <header class="bg-white shadow-sm">
            <nav class="mx-auto flex max-w-5xl items-center justify-between p-4">
              <span class="text-lg font-bold">Brightside</span>
              <a href="#features" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600">Sign up</a>
            </nav>
          </header>

          <section class="mx-auto max-w-5xl px-4 py-12 text-center">
            <h1 class="text-3xl font-bold tracking-tight md:text-5xl">Habits that stick</h1>
            <p class="mx-auto mt-4 max-w-xl text-slate-600">Brightside turns small daily actions into streaks you are proud of.</p>
            <button disabled class="mt-6 rounded-lg bg-slate-900 px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Waitlist full</button>
          </section>

          <div id="features" class="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
            <article class="group rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg">
              <div class="size-10 rounded-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600"></div>
              <h2 class="mt-4 font-semibold">Daily streaks</h2>
              <p class="mt-1 text-sm text-slate-600">See your chain grow one day at a time.</p>
            </article>
            <article class="group rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg">
              <div class="size-10 rounded-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600"></div>
              <h2 class="mt-4 font-semibold">Gentle reminders</h2>
              <p class="mt-1 text-sm text-slate-600">A nudge at the right moment, never nagging.</p>
            </article>
            <article class="group rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg">
              <div class="size-10 rounded-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600"></div>
              <h2 class="mt-4 font-semibold">Weekly review</h2>
              <p class="mt-1 text-sm text-slate-600">Look back and celebrate what worked.</p>
            </article>
            <article class="group rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg">
              <div class="size-10 rounded-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600"></div>
              <h2 class="mt-4 font-semibold">Shared goals</h2>
              <p class="mt-1 text-sm text-slate-600">Team up with a friend for extra motivation.</p>
            </article>
            <article class="group rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg">
              <div class="size-10 rounded-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600"></div>
              <h2 class="mt-4 font-semibold">Simple stats</h2>
              <p class="mt-1 text-sm text-slate-600">Clear charts, no clutter.</p>
            </article>
            <article class="group rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg">
              <div class="size-10 rounded-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600"></div>
              <h2 class="mt-4 font-semibold">Works offline</h2>
              <p class="mt-1 text-sm text-slate-600">Tick things off even without signal.</p>
            </article>
          </div>
        </body>
      </html>
quiz:
  - q: What does md:text-5xl mean?
    options: ["Use text-5xl only on medium-sized screens", "Use text-5xl at the md breakpoint and wider", "Use text-5xl on screens up to md"]
    answer: 1
    explain: Breakpoint prefixes are min-width rules, so they apply from that width upwards.
  - q: "Tailwind is mobile-first. What does that mean for a class with no prefix, like grid-cols-1?"
    options: ["It applies to every screen size until a larger prefix overrides it", "It applies only to phones", "It is ignored"]
    answer: 0
  - q: What must be true for group-hover:bg-indigo-600 to work?
    options: ["The element itself must be hovered", "The page must use dark mode", "An ancestor of the element must have the class group"]
    answer: 2
  - q: Which class styles a button that has the disabled attribute?
    options: ["disabled:opacity-50", "off:opacity-50", "button-disabled:opacity-50"]
    answer: 0
---

A page that looks good in only one place is not finished. People open yours on phones, laptops and TVs, and they expect buttons to react when they point at them. In Tailwind both needs are met with the same trick: a **prefix** in front of a class. `md:text-5xl` means "use `text-5xl`, but only from the medium breakpoint upwards". `hover:bg-indigo-500` means "use this background, but only while the mouse is over it".

## Mobile first and breakpoints

Tailwind is **mobile first**. A class with no prefix applies at every screen size. A prefixed class applies from its breakpoint **and up**. So you design the phone layout first, then add changes for larger screens.

| Prefix | Applies from | Typical device |
| --- | --- | --- |
| (none) | 0 | phones |
| `sm:` | 40rem (640px) | large phones |
| `md:` | 48rem (768px) | tablets |
| `lg:` | 64rem (1024px) | laptops |
| `xl:` | 80rem (1280px) | desktops |

For example, this grid is one column on phones, two from `sm`, three from `lg`:

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"> ... </div>
```

Never think of `sm:` as "small screens only". It is a minimum width. To style small screens, use the plain class. Make sure your `<head>` has the viewport meta tag, or phones pretend to be wide and ignore all of this.

## State variants

Variants for user interaction work the same way:

- `hover:` while the pointer is over the element.
- `focus:` while it has keyboard focus (links, buttons, inputs). Always give focusable things a visible focus style.
- `active:` while it is being pressed.
- `disabled:` when it has the `disabled` attribute.
- `group-hover:` explained below.

Variants can be stacked: `md:hover:bg-indigo-700` applies only on tablets and wider while hovered.

## Smooth changes with transition utilities

Without a transition, hover changes snap. Add `transition` to animate colour, shadow and transform changes, and `duration-300` to make it take 300 milliseconds. `ease-in-out` changes the speed curve and `delay-100` waits first. Put these on the **normal** state, not behind `hover:`.

## Group hover

Sometimes hovering over a parent should change a child. Mark the parent with `group` and prefix the child's class with `group-hover:`:

```html
<article class="group ...">
  <div class="bg-indigo-100 group-hover:bg-indigo-600"></div>
</article>
```

Now hovering anywhere on the card turns the square solid.

## Testing it

Drag the preview panel narrower and wider and watch the grid change columns. The lesson check cannot resize the window or move a mouse, so it reads your class names for the prefixes and measures what it can, like the transition duration and the disabled button's opacity.

> **Watch out:**
> - The prefix is separated by a colon with no spaces: `md:flex`. `md :flex` or `md-flex` do nothing.
> - Using `sm:` for phone styling. Unprefixed classes are for phones; `sm:` starts at 640px.
> - `group-hover:` without a `group` class on a parent. Nothing happens, and there is no error.
> - Relying on hover for something important. Touch screens have no hover, so never hide essential information behind it.
> - Putting `transition` only on the hover state. Add it to the normal state so the animation also plays when the mouse leaves.

## Going further

Add `hover:-translate-y-1` to the cards so they lift. Add `xl:grid-cols-4`. Try `focus-visible:outline-2` and press Tab to move through the page.

> **Your turn:** upgrade the starter. Sign-up link: `transition duration-300 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-2 focus:outline-indigo-600`. Heading: `md:text-5xl`. Button: `disabled:opacity-50 disabled:cursor-not-allowed`. Grid: `sm:grid-cols-2 lg:grid-cols-3`. Each card: `group transition duration-300 hover:shadow-lg`, and each square `group-hover:bg-indigo-600`.
