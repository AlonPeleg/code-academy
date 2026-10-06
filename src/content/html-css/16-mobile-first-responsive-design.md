---
title: Mobile-first responsive design
summary: Design for the smallest screen first, then add layout for wider ones with fluid sizes, min-width media queries and self-adjusting grids.
level: intermediate
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Trail Notes</title>
          <!-- 1. Add the tag that tells phones to use their real screen width -->
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="page">
            <header class="top">
              <h1>Trail Notes</h1>
              <nav class="nav">
                <a href="#">Routes</a>
                <a href="#">Gear</a>
                <a href="#">About</a>
              </nav>
            </header>

            <img class="hero" width="1200" height="400" alt="A purple banner"
              src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1200'%20height='400'%3E%3Crect%20width='1200'%20height='400'%20fill='%236d5efc'/%3E%3C/svg%3E" />

            <div class="grid">
              <article class="card"><h2>Lake loop</h2><p>5 km, easy.</p></article>
              <article class="card"><h2>Ridge walk</h2><p>12 km, steady climb.</p></article>
              <article class="card"><h2>Forest trail</h2><p>8 km, shady.</p></article>
            </div>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: system-ui, sans-serif;
        margin: 0;
        color: #1f2937;
      }

      /* A fluid container: never wider than 960px, never wider than the screen */
      .page {
        max-width: 960px;
        margin: 0 auto;
        padding: 16px;
      }

      h1 {
        margin: 0 0 8px;
        /* 2. Make the font size fluid: never below 1.5rem, never above 2.5rem,
              and in between it follows the screen width (use 4vw) */
      }

      /* 3. Make images shrink to fit their parent and keep their proportions */

      .nav {
        display: flex;
        flex-direction: column; /* the phone layout comes first */
        gap: 8px;
      }

      /* 5. Add a media query for screens at least 600px wide.
            Inside it, put the .nav links in a row. */

      .grid {
        /* 4. Make this a grid with a 16px gap and columns that fit themselves:
              as many columns as fit, each at least 220px wide, sharing the space */
      }

      .card {
        background: #f3f4f6;
        padding: 16px;
        border-radius: 8px;
      }
check:
  dom:
    styles:
      - { selector: ".grid", property: "display", value: "grid" }
      - { selector: ".grid", property: "column-gap", value: "16px" }
  code:
    - file: index.html
      pattern: '<meta[^>]*name=["'']viewport["''][^>]*width=device-width'
      message: 'Add <meta name="viewport" content="width=device-width, initial-scale=1" /> inside the head of index.html.'
    - file: style.css
      pattern: 'font-size\s*:\s*clamp\('
      message: "Give the h1 a fluid font-size with clamp(min, preferred, max)."
    - file: style.css
      pattern: 'img\s*\{[^}]*max-width\s*:\s*100%'
      message: "Add an img rule with max-width: 100%."
    - file: style.css
      pattern: 'img\s*\{[^}]*height\s*:\s*auto'
      message: "Add height: auto to the img rule so the image keeps its proportions."
    - file: style.css
      pattern: 'repeat\(\s*auto-fit\s*,\s*minmax\('
      message: "Use grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))."
    - file: style.css
      pattern: '@media\s*\(\s*min-width\s*:\s*[\d.]+(px|em|rem)\s*\)\s*\{\s*\.nav\s*\{[^}]*flex-direction\s*:\s*row'
      message: "Add @media (min-width: 600px) { .nav { flex-direction: row; } } at the end of the stylesheet."
hints:
  - "You need five small pieces: the viewport meta tag in the HTML, a fluid font size, a rule for images, a self-adjusting grid, and one min-width media query that puts the nav in a row."
  - "Use clamp() for the h1, img with max-width: 100% and height: auto, display: grid with repeat(auto-fit, minmax(...)) for .grid, and @media (min-width: 600px) around a .nav rule. The meta tag goes in the head."
  - "h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }   img { max-width: 100%; height: auto; }   .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }   @media (min-width: 600px) { .nav { flex-direction: row; } }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Trail Notes</title>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="page">
            <header class="top">
              <h1>Trail Notes</h1>
              <nav class="nav">
                <a href="#">Routes</a>
                <a href="#">Gear</a>
                <a href="#">About</a>
              </nav>
            </header>

            <img class="hero" width="1200" height="400" alt="A purple banner"
              src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1200'%20height='400'%3E%3Crect%20width='1200'%20height='400'%20fill='%236d5efc'/%3E%3C/svg%3E" />

            <div class="grid">
              <article class="card"><h2>Lake loop</h2><p>5 km, easy.</p></article>
              <article class="card"><h2>Ridge walk</h2><p>12 km, steady climb.</p></article>
              <article class="card"><h2>Forest trail</h2><p>8 km, shady.</p></article>
            </div>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: system-ui, sans-serif;
        margin: 0;
        color: #1f2937;
      }

      /* A fluid container: never wider than 960px, never wider than the screen */
      .page {
        max-width: 960px;
        margin: 0 auto;
        padding: 16px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
      }

      img {
        max-width: 100%;
        height: auto;
      }

      .nav {
        display: flex;
        flex-direction: column; /* the phone layout comes first */
        gap: 8px;
      }

      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .card {
        background: #f3f4f6;
        padding: 16px;
        border-radius: 8px;
      }

      @media (min-width: 600px) {
        .nav {
          flex-direction: row;
        }
      }
quiz:
  - q: "What does mobile-first mean?"
    options: ["Only supporting phones", "Writing the small-screen styles as the base, then adding wider layouts with min-width media queries", "Using max-width media queries for everything", "Hiding desktop content on phones"]
    answer: 1
  - q: "Which media query applies from 700px wide upwards?"
    options: ["@media (max-width: 700px)", "@media (width: 700)", "@media (min-width: 700px)"]
    answer: 2
    explain: "min-width means at least that wide. It is the building block of mobile-first CSS."
  - q: "What does font-size: clamp(1.5rem, 4vw, 2.5rem) do?"
    options: ["The text scales with the screen width but never goes below 1.5rem or above 2.5rem", "It animates the text between three sizes", "It picks the size by device type", "It makes the text exactly 4vw wide"]
    answer: 0
  - q: "Why do responsive pages need the viewport meta tag?"
    options: ["It makes images load faster", "It stops the page from being indexed twice", "It adds a media query to the page", "Without it phones pretend to be about 980px wide and shrink the page"]
    answer: 3
---

More than half of web visits happen on phones, and your page will also be opened on tablets, laptops and giant monitors. **Responsive design** means one page that adapts to all of them. In this lesson you learn the mobile-first way to do it, which is simpler than it sounds.

## Think small first

**Mobile-first** means you write the layout for the narrowest screen as your normal CSS, then add extras as the screen gets wider. A phone layout is usually the simplest one (everything in a single column), so your base CSS stays short, and phones do not have to download rules they will never use.

First, the HTML needs one line in the `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Without it, phones pretend to be a wide desktop screen (about 980px) and zoom everything out. With it, the page uses the real device width, so your media queries mean what you think they mean.

## Media queries with min-width

A **breakpoint** is a screen width where the layout changes. You set it with `min-width`, which means "this wide or wider":

```css
.nav {
  display: flex;
  flex-direction: column;   /* phone: stacked links */
}

@media (min-width: 600px) {
  .nav {
    flex-direction: row;    /* 600px and up: one row */
  }
}
```

Because the wide rule comes later and only applies on bigger screens, it overrides the base. Choose breakpoints where *your content* starts to look bad (try 600px and 900px), not at specific phone models. Always put media queries after the rules they change.

## Fluid sizes instead of fixed ones

Many problems vanish if sizes bend instead of break:

```css
.page {
  max-width: 960px;   /* a ceiling, not a fixed width */
  margin: 0 auto;     /* centre it when the screen is wider */
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}
```

- A fixed `width: 960px` forces sideways scrolling on a phone. `max-width` lets the box shrink.
- Percentages (`width: 50%`) are relative to the parent. `vw` is 1% of the screen width.
- `clamp(min, preferred, max)` picks the preferred value but never goes below the minimum or above the maximum. Here the heading grows with the screen between 1.5rem and 2.5rem.

## Images that shrink

An image keeps its own size, which can be wider than a phone. This pair of lines is standard in nearly every stylesheet:

```css
img {
  max-width: 100%;  /* never wider than the parent */
  height: auto;     /* keep the proportions */
}
```

## A grid that adjusts itself

You could write three media queries for one, two and three card columns. Grid can do it with none:

```css
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
```

Read it as: "make as many columns as fit, each at least 220px wide, and share the leftover space equally (`1fr`)". On a phone you get one column, on a tablet two, on a laptop three. Use **media queries** when the layout *structure* changes (a nav turns into a row, a sidebar appears) and **auto-fit** when you just have a pile of equal cards.

## Testing

Drag the edge of the preview panel narrower and wider and watch the page react. In a real browser, open DevTools and use the device toolbar. The lesson checker cannot resize the preview, so it reads your code for the viewport tag, `clamp()`, `auto-fit` and the `min-width` media query.

> **Watch out:**
> - Forgetting the viewport meta tag. Media queries then seem to "not work" on a real phone, because it reports a width of about 980px.
> - Mixing styles: a `max-width` media query on top of a `min-width` one makes it hard to see which rule wins. Pick one direction (min-width) and stick to it.
> - Writing `@media (min-width: 600)` without `px`, or forgetting the closing brace. The query is silently ignored.
> - Giving an image `max-width: 100%` but also a fixed `height`. It then squashes. Use `height: auto`.
> - Using `minmax(300px, 1fr)` in a container narrower than 300px, which causes sideways scrolling. Keep the minimum small or wrap it as `min(300px, 100%)`.

## Going further

Add a second breakpoint at `900px` that turns `.page` padding from `16px` to `32px`. Replace `220px` with `min(220px, 100%)` to see the safer version of the grid.

> **Your turn:** in `index.html` add the viewport meta tag. In `style.css` give the `h1` a `clamp()` font-size, add an `img` rule with `max-width: 100%` and `height: auto`, make `.grid` a grid with a `16px` gap and `repeat(auto-fit, minmax(220px, 1fr))` columns, and add an `@media (min-width: 600px)` query that sets `.nav` to `flex-direction: row`.
