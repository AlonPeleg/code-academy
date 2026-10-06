---
title: Hover effects and responsive design
summary: Add smooth transitions and make your page adapt to small screens.
level: intermediate
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="menu">
            <a class="btn" href="#">Home</a>
            <a class="btn" href="#">About</a>
            <a class="btn" href="#">Contact</a>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      .menu {
        display: flex;
        gap: 12px;
      }

      .btn {
        background: #6d5efc;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        text-decoration: none;
        /* 1. Add a transition: animate background-color over 0.3s */
      }

      /* 2. Add a rule for when the mouse is over .btn:
            change the background to #4c3fd1 */

      /* 3. Add a media query for screens up to 600px wide.
            Inside it, stack the .menu items in a column. */
check:
  dom:
    styles:
      - { selector: ".btn", property: "transition-property", value: "background-color" }
      - { selector: ".btn", property: "transition-duration", value: "0.3s" }
  code:
    - pattern: "\\.btn:hover\\s*\\{[^}]*background(-color)?\\s*:\\s*#4c3fd1"
      message: "Add a .btn:hover rule that sets the background to #4c3fd1."
    - pattern: "@media\\s*\\(\\s*max-width\\s*:\\s*600px\\s*\\)\\s*\\{[\\s\\S]*flex-direction\\s*:\\s*column"
      message: "Add a media query for max-width 600px that sets flex-direction: column on .menu."
hints:
  - "There are three separate ideas here: a transition on the normal state, a rule for the hover state, and a media query that only applies to narrow screens."
  - "Use the transition property on .btn, the :hover pseudo-class for the colour change, and @media (max-width: 600px) { ... } wrapping a .menu rule."
  - ".btn { transition: background-color 0.3s; }   .btn:hover { background: #4c3fd1; }   @media (max-width: 600px) { .menu { flex-direction: column; } }"
solution:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="menu">
            <a class="btn" href="#">Home</a>
            <a class="btn" href="#">About</a>
            <a class="btn" href="#">Contact</a>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      .menu {
        display: flex;
        gap: 12px;
      }

      .btn {
        background: #6d5efc;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        text-decoration: none;
        transition: background-color 0.3s;
      }

      .btn:hover {
        background: #4c3fd1;
      }

      @media (max-width: 600px) {
        .menu {
          flex-direction: column;
        }
      }
quiz:
  - q: What does the :hover part of  .btn:hover  mean?
    options: ["The rule applies only while the mouse pointer is over the element", "The element floats above the page", "The element is hidden"]
    answer: 0
  - q: 'What does  transition: background-color 0.3s;  do?'
    options: ["Waits 0.3 seconds before loading the page", "Changes the background to 0.3 percent", "Makes background colour changes fade smoothly over 0.3 seconds"]
    answer: 2
  - q: '@media (max-width: 600px) { ... }  applies its rules when...'
    options: ["The screen is wider than 600px", "The screen is 600px wide or narrower", "The page has 600 elements"]
    answer: 1
  - q: Why is the viewport meta tag important for mobile pages?
    options: ["It colours the address bar", "It makes images load faster", "It makes phones use the real screen width instead of pretending to be a big desktop screen"]
    answer: 2
---

A good page reacts. It gives feedback when you point at a button, and it rearranges itself when it is opened on a phone. This lesson shows you both with a few lines of CSS.

## Pseudo-classes: styling a state

A **pseudo-class** is a keyword added to a selector with a colon. It targets an element only in a certain *state*. The most popular is `:hover`, which is active while the mouse pointer is over the element:

```css
.btn:hover {
  background: #4c3fd1;
}
```

Others you will meet: `:focus` (a field you clicked into), `:active` (while pressed) and `:first-child`.

Notice there is no space in `.btn:hover`. It means "a `.btn` that is hovered".

## Transitions: smooth changes

By default a hover change happens instantly. A **transition** animates it. You put it on the *normal* state of the element:

```css
.btn {
  background: #6d5efc;
  transition: background-color 0.3s;
}
```

The shorthand has up to three parts:

- the property to animate (`background-color`, or `all` for everything),
- the duration (`0.3s`, which is 300 milliseconds),
- optionally a timing function such as `ease-in-out`.

Other good hover effects: `transform: translateY(-2px);` to lift a button, `transform: scale(1.05);` to grow it slightly, and `box-shadow` for depth.

## Responsive design

Your page is viewed on phones, tablets, laptops and big monitors. **Responsive design** means it adapts. Two tools do most of the work:

1. The viewport tag in the `<head>`. Without it, phones pretend to be wide and shrink everything:

   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

2. **Media queries**, which apply CSS only when a condition is true:

   ```css
   @media (max-width: 600px) {
     .menu {
       flex-direction: column;
     }
   }
   ```

   This reads: "on screens 600px wide or narrower, make the menu a column".

Notice that the media query wraps ordinary rules in extra braces. The rule inside only wins when the screen is small, because it comes later and replaces the earlier `flex-direction` (which is `row` by default).

A common approach is **mobile first**: write the phone layout as your base and use `@media (min-width: 600px) { ... }` to add the wider layout.

## Checking it

Drag the preview panel narrower (or use the browser's device toolbar) and see the menu stack. The lesson check can not resize the window, so it looks at your code for the hover rule and the media query.

> **Watch out:**
> - Putting `transition` only on `:hover`. The animation then works going in but snaps back when the mouse leaves. Put it on the normal state.
> - A space before the colon, like `.btn :hover`. That means "a hovered element inside .btn".
> - Forgetting the closing brace of the `@media` block. You need one for the rule and one for the media query.
> - Writing the `@media` rule *before* the normal rule. The later rule wins when both apply, so put media queries at the end of your stylesheet.
> - `max-width: 600` without `px`.
> - Using hover as the only way to reach something. Touch screens have no hover.

## Going further

Add `transform: translateY(-2px);` to `.btn:hover` and `transform` to the transition list: `transition: background-color 0.3s, transform 0.3s;`. Try a second media query at `max-width: 400px` that shrinks the padding.

> **Your turn:** add a `0.3s` background-color transition to `.btn`, a `.btn:hover` rule with background `#4c3fd1`, and a `max-width: 600px` media query that sets `flex-direction: column` on `.menu`.
