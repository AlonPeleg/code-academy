---
title: Animations, keyframes and transitions in depth
summary: Move things with transitions, easing curves and multi-step @keyframes animations.
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
          <div class="tile">Hover me</div>
          <div class="dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: sans-serif;
        padding: 24px;
      }

      .tile {
        width: 140px;
        padding: 24px;
        background: #6d5efc;
        color: white;
        border-radius: 10px;
        /* 1. Add a transition for TWO properties: transform and box-shadow.
              Duration 0.25s, with the easing curve that starts fast and
              slows down at the end. */
      }

      .tile:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
      }

      .dots {
        display: flex;
        gap: 10px;
        margin-top: 40px;
      }

      .dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #f97316;
        /* 3. Make each dot run the animation named bounce:
              1s long, ease-in-out, repeating forever, alternating direction. */
      }

      /* 2. Write @keyframes bounce.
            At 0% the dot is not moved; at 100% it is moved UP by 30 pixels
            (use transform with translateY and a negative value). */

      /* 4. Give the SECOND dot an animation-delay of 0.2s
            and the THIRD dot a delay of 0.4s (use :nth-child). */
check:
  dom:
    styles:
      - { selector: ".tile", property: "transition-property", value: "transform, box-shadow" }
      - { selector: ".tile", property: "transition-duration", value: "0.25s, 0.25s" }
      - { selector: ".dot", property: "animation-name", value: "bounce" }
      - { selector: ".dot", property: "animation-duration", value: "1s" }
      - { selector: ".dot", property: "animation-iteration-count", value: "infinite" }
      - { selector: ".dot", property: "animation-direction", value: "alternate" }
      - { selector: ".dot:nth-child(2)", property: "animation-delay", value: "0.2s" }
      - { selector: ".dot:nth-child(3)", property: "animation-delay", value: "0.4s" }
  code:
    - pattern: '@keyframes\s+bounce\s*\{[\s\S]*translateY\(\s*-30px\s*\)'
      message: "Write @keyframes bounce { ... } that moves the dot to translateY(-30px)."
    - pattern: 'ease-out'
      message: "Use the ease-out timing function for the tile transition."
hints:
  - "A transition needs a list of the properties to animate, a duration and an easing curve. An animation has two parts: a @keyframes block that describes the steps, and the animation property that plays it."
  - "transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;   @keyframes bounce { 0% { ... } 100% { ... } }   animation: bounce 1s ease-in-out infinite alternate;"
  - ".tile { transition: transform 0.25s ease-out, box-shadow 0.25s ease-out; }   @keyframes bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-30px); } }   .dot { animation: bounce 1s ease-in-out infinite alternate; }   .dot:nth-child(2) { animation-delay: 0.2s; }   .dot:nth-child(3) { animation-delay: 0.4s; }"
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
          <div class="tile">Hover me</div>
          <div class="dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </body>
      </html>
  - name: style.css
    code: |
      body {
        font-family: sans-serif;
        padding: 24px;
      }

      .tile {
        width: 140px;
        padding: 24px;
        background: #6d5efc;
        color: white;
        border-radius: 10px;
        transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
      }

      .tile:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
      }

      .dots {
        display: flex;
        gap: 10px;
        margin-top: 40px;
      }

      .dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #f97316;
        animation: bounce 1s ease-in-out infinite alternate;
      }

      @keyframes bounce {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-30px);
        }
      }

      .dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
quiz:
  - q: What is the difference between a transition and an animation?
    options: ["A transition animates between two states when something changes, an animation can run by itself through many keyframe steps", "They are the same thing with different names", "Animations only work on text"]
    answer: 0
  - q: Which pair of properties is cheapest for the browser to animate smoothly?
    options: ["width and height", "transform and opacity", "margin and padding"]
    answer: 1
    explain: transform and opacity can be handled by the graphics card without re-doing the page layout.
  - q: What does animation-direction alternate do?
    options: ["Runs the animation twice as fast", "Plays forwards, then backwards, then forwards again", "Plays the animation only once"]
    answer: 1
  - q: Why put the transition on .tile instead of on .tile:hover?
    options: ["Because :hover cannot hold properties", "It makes no difference", "So that it animates both when the mouse enters and when it leaves"]
    answer: 2
---

A little motion tells people what is happening: a button lifts when you point at it, a loading indicator shows the page is busy. In this lesson you will go beyond the basic fade and learn the two CSS tools for movement: **transitions** and **keyframe animations**.

## Transitions, properly

A transition animates the change between two states, for example normal and hovered. It is written on the **normal** state, and its parts are:

```css
.tile {
  transition: transform 0.25s ease-out;
  /*          property  duration timing */
}
```

You may add a fourth value, a delay (`0.1s`). To animate several properties, separate the groups with commas:

```css
.tile {
  transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
}
```

Avoid `transition: all`. It animates every property that changes, including ones you did not think of, and it is harder to keep smooth.

## Timing functions (easing)

Real objects do not move at constant speed. The timing function describes how speed changes:

| Value | Feel |
| --- | --- |
| `linear` | Constant speed, robotic |
| `ease` | The default: starts slowly, speeds up, slows down |
| `ease-in` | Starts slowly |
| `ease-out` | Starts quickly and slows down at the end, good for things arriving |
| `ease-in-out` | Slow at both ends |
| `cubic-bezier(0.2, 0.8, 0.2, 1)` | Your own curve |

## Keyframe animations

A transition needs a trigger and has only a start and an end. An **animation** can start on its own, run through many steps and repeat. You describe the steps in an `@keyframes` block, then attach it to an element:

```css
@keyframes bounce {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-30px); }
}

.dot {
  animation: bounce 1s ease-in-out infinite alternate;
}
```

The `@keyframes` name (`bounce`) is your choice. Percentages mark moments in the animation: `0%` is the start, `100%` the end, and you can add more such as `50%`. `from` and `to` are aliases for `0%` and `100%`.

The `animation` shorthand holds: the name, the duration, the timing function, the iteration count (`infinite` or a number), and the direction. `alternate` plays forwards then backwards, which is a smooth way to get a bounce without writing the return trip yourself. Other useful longhands:

- `animation-delay` waits before starting. Giving each item a bigger delay creates a wave.
- `animation-fill-mode: forwards` keeps the final keyframe after the animation ends.
- `animation-play-state: paused` freezes it, handy with `:hover`.

## What is cheap to animate

Browsers can animate `transform` (move, scale, rotate) and `opacity` on the graphics card without recalculating the layout of the page. Animating `width`, `height`, `top` or `margin` forces the browser to re-layout on every frame, which can stutter on phones. Prefer `transform: translateX(...)` over `left`.

> **Watch out:**
> - Putting `transition` on `:hover` only. The animation then happens when the mouse enters but the element snaps back when it leaves.
> - Misspelling the animation name. If `animation: bounce` and `@keyframes bouncee` differ, nothing moves and nobody tells you.
> - Trying to transition `display` or `height: auto`. They cannot be animated; use `opacity` or a fixed `max-height` instead.
> - Forgetting that `transform` on an element replaces earlier `transform` values. `transform: scale(2)` in a hover rule removes a `translate` set in the normal rule unless you repeat it.
> - Animations that never stop and cannot be turned off. Some people feel unwell from motion; the next lesson shows how to respect their settings.

## Going further

Add a `50%` keyframe with `transform: translateY(-30px) scale(1.3)` for a squash-and-stretch feel, and try `cubic-bezier(0.3, 1.8, 0.5, 1)` for an overshoot.

> **Your turn:** add a `0.25s ease-out` transition for `transform` and `box-shadow` to `.tile`, write `@keyframes bounce` (from `translateY(0)` to `translateY(-30px)`), play it on every `.dot` for `1s ease-in-out infinite alternate`, and delay the second and third dots by `0.2s` and `0.4s`.
