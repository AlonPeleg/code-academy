---
title: Staying on screen
summary: Stop the player from walking off the edges with Math.min and Math.max.
level: beginner
runner: jsgame
files:
  - name: main.js
    code: |
      let x = 150;
      let y = 100;
      const SIZE = 20;
      const SPEED = 200;

      function update(dt) {
        if (game.keyDown('left'))  { x -= SPEED * dt; }
        if (game.keyDown('right')) { x += SPEED * dt; }
        if (game.keyDown('up'))    { y -= SPEED * dt; }
        if (game.keyDown('down'))  { y += SPEED * dt; }

        // 1. Keep x between 0 and game.WIDTH - SIZE.
        // 2. Keep y between 0 and game.HEIGHT - SIZE.
        //    (Math.max(a, b) gives the bigger one, Math.min(a, b) the smaller one.)
      }

      function draw() {
        game.clear(game.DARK);
        game.rect(x, y, SIZE, SIZE, game.GREEN);
      }

      game.run(update, draw);
check:
  game:
    frames: 100
    keys:
      - { key: right, from: 0, to: 100 }
      - { key: up, from: 0, to: 100 }
    expect: "x === game.WIDTH - SIZE && y === 0 && (x = -50, y = 500, update(0), x === 0 && y === game.HEIGHT - SIZE)"
    message: "The square must stop at the right edge (x = 300) and the top edge (y = 0), and also never go below x = 0 or y = 220."
  code:
    - { pattern: 'Math\.min|Math\.max|if\s*\(\s*[xy]\s*[<>]', message: "Limit x and y, for example with Math.min and Math.max." }
hints:
  - "After the movement, correct the position if it went too far. The right edge for the square's left side is game.WIDTH - SIZE, because the square is SIZE wide."
  - "Math.max(0, x) never lets x go below 0, and Math.min(game.WIDTH - SIZE, x) never lets it go above the right limit. You can also use ifs. Do the same for y with game.HEIGHT."
  - "x = Math.max(0, Math.min(game.WIDTH - SIZE, x));   y = Math.max(0, Math.min(game.HEIGHT - SIZE, y));"
solution:
  - name: main.js
    code: |
      let x = 150;
      let y = 100;
      const SIZE = 20;
      const SPEED = 200;

      function update(dt) {
        if (game.keyDown('left'))  { x -= SPEED * dt; }
        if (game.keyDown('right')) { x += SPEED * dt; }
        if (game.keyDown('up'))    { y -= SPEED * dt; }
        if (game.keyDown('down'))  { y += SPEED * dt; }

        x = Math.max(0, Math.min(game.WIDTH - SIZE, x));
        y = Math.max(0, Math.min(game.HEIGHT - SIZE, y));
      }

      function draw() {
        game.clear(game.DARK);
        game.rect(x, y, SIZE, SIZE, game.GREEN);
      }

      game.run(update, draw);
quiz:
  - q: "What does Math.max(0, -5) return?"
    options: ["-5", "0", "5"]
    answer: 1
    explain: "Math.max picks the bigger of its arguments. That is why it works as a floor (a lowest allowed value)."
  - q: "Why is the right limit game.WIDTH - SIZE and not game.WIDTH?"
    options: ["x marks the left edge of the square, so the right edge is x + SIZE", "SIZE is always 20", "game.WIDTH is not a number"]
    answer: 0
  - q: "Where should the limiting code go in update?"
    options: ["Before the movement", "After the movement, so the new position is corrected", "In draw"]
    answer: 1
  - q: "What does Math.min(300, 450) return?"
    options: ["450", "300", "150"]
    answer: 1
---

Right now your square can run off the screen and disappear forever. Real games keep their heroes inside the world, or at least decide what happens at the edge. This lesson teaches the standard trick for it, called **clamping**: forcing a number to stay between a lowest and a highest value.

## Where are the edges?

The screen is `game.WIDTH` (320) pixels wide and `game.HEIGHT` (240) pixels high. A rectangle is positioned by its **top-left corner** `(x, y)`, and has a width and a height. So:

- The left edge is reached when `x` is `0`.
- The right edge of a square is `x + SIZE`. It touches the right side of the screen when `x + SIZE` equals `game.WIDTH`, so the largest allowed `x` is `game.WIDTH - SIZE`.
- The top edge is `y = 0`, and the largest allowed `y` is `game.HEIGHT - SIZE`.

A common bug is to forget the size and use `game.WIDTH` as the limit: the square then slides half-way out of sight.

## Clamping with if

You can fix the position with plain `if` statements, after the movement code:

```js
if (x < 0) {
  x = 0;
}
if (x > game.WIDTH - SIZE) {
  x = game.WIDTH - SIZE;
}
```

The first `if` says: if we have gone left of the screen, put us back at the left edge. The second does the same on the right side. It works, but it takes four `if` statements to do both axes.

## Clamping with Math.min and Math.max

JavaScript has a built-in object called `Math` with useful functions:

- `Math.max(a, b)` returns the **bigger** of two numbers.
- `Math.min(a, b)` returns the **smaller** of two numbers.

That sounds backwards at first, but think about it: `Math.max(0, x)` is never less than 0, so it acts as a **floor**. And `Math.min(300, x)` is never more than 300, so it is a **ceiling**. Combine both:

```js
x = Math.max(0, Math.min(game.WIDTH - SIZE, x));
```

Read from the inside out: first cap `x` at the right limit, then make sure it is not below 0. Examples:

```js
Math.max(0, Math.min(300, 450))   // 450 capped to 300, so 300
Math.max(0, Math.min(300, -20))   // -20 is below the floor, so 0
Math.max(0, Math.min(300, 120))   // already inside, stays 120
```

This one line replaces four. You can wrap it in a function of your own if you do it often:

```js
function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}
```

## When to do it

Always clamp **after** you move. The order in `update` is: read the keys and move, then fix the position, then (later in the track) check for collisions. If you clamp first and move afterwards, the player can still be a few pixels outside for one frame.

## Other edge rules

Walls that stop you are only one choice. Games also use:

- **Wrapping**: leave on the right, enter on the left (`if (x > game.WIDTH) x = 0;`), as in Asteroids.
- **Bouncing**: reverse the speed when you hit the edge (you will do this for Pong).
- **Dying**: leaving the screen costs a life.

> **Watch out:** mixing up `Math.min` and `Math.max` is the number one mistake: `Math.min(0, x)` makes `x` never **bigger** than 0, which pins the square to the top-left corner. If your square will not move, swap them.
>
> **Watch out:** `Math` starts with a capital letter. `math.max(...)` gives `ReferenceError: math is not defined`.
>
> **Watch out:** forgetting to assign the result: `Math.max(0, x);` on its own line calculates a number and throws it away. You need `x = Math.max(0, x);`.
>
> **Watch out:** clamping inside `draw` instead of `update` hides the problem in the picture but the real position is still off screen.

> **Your turn:** after the movement code in `update`, keep `x` between `0` and `game.WIDTH - SIZE` and `y` between `0` and `game.HEIGHT - SIZE`. Try it live: hold an arrow key and make sure the square stops at the edge.
