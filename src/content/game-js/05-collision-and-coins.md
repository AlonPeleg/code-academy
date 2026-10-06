---
title: Collision and coins
summary: Test whether two rectangles overlap and use it to collect coins and score points.
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      let px = 20;
      let py = 100;
      const SIZE = 24;
      const SPEED = 150;
      const coinSpots = [[150, 100], [150, 30], [40, 30]];   // fixed places for the coin
      let coinIndex = 0;                                    // which place it is at now
      let score = 0;

      // 1. Return true when rectangle A and rectangle B overlap.
      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return false;
      }

      function update(dt) {
        if (game.keyDown('left'))  { px -= SPEED * dt; }
        if (game.keyDown('right')) { px += SPEED * dt; }
        if (game.keyDown('up'))    { py -= SPEED * dt; }
        if (game.keyDown('down'))  { py += SPEED * dt; }

        const coin = coinSpots[coinIndex];
        if (touching(px, py, SIZE, SIZE, coin[0], coin[1], 16, 16)) {
          // 2. Add 1 to score, then move the coin to the next spot in the list.
          //    After the last spot it should start again at the first one.
        }
      }

      function draw() {
        game.clear(game.DARK);
        const coin = coinSpots[coinIndex];
        game.rect(coin[0], coin[1], 16, 16, game.YELLOW);
        game.rect(px, py, SIZE, SIZE, game.CYAN);
        game.text(10, 10, 'Score: ' + score, game.WHITE, 16);
      }

      game.run(update, draw);
check:
  game:
    frames: 128
    keys:
      - { key: right, from: 0, to: 52 }
      - { key: up, from: 52, to: 88 }
      - { key: left, from: 88, to: 128 }
    expect: "score === 3 && touching(0, 0, 10, 10, 5, 5, 10, 10) && !touching(0, 0, 10, 10, 20, 20, 5, 5) && !touching(0, 0, 10, 10, 10, 0, 5, 5)"
    message: "Walk right, then up, then left to collect all three coins: score should be 3. touching() must be true only when the rectangles really overlap."
  code:
    - { pattern: 'score\s*(\+=|=\s*score\s*\+)\s*1|score\+\+', message: "Add 1 to score when the player touches the coin." }
    - { pattern: '%\s*coinSpots\.length', message: "Wrap around with (coinIndex + 1) % coinSpots.length." }
hints:
  - "Two rectangles overlap only if they overlap on the x axis AND on the y axis. Test four conditions joined with &&."
  - "A overlaps B on x when ax < bx + bw and ax + aw > bx. The same idea on y uses ay, ah, by and bh. Inside the if: score += 1; and then move coinIndex on by one."
  - "return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;   and in update:   score += 1;   coinIndex = (coinIndex + 1) % coinSpots.length;"
solution:
  - name: main.js
    code: |
      let px = 20;
      let py = 100;
      const SIZE = 24;
      const SPEED = 150;
      const coinSpots = [[150, 100], [150, 30], [40, 30]];   // fixed places for the coin
      let coinIndex = 0;                                    // which place it is at now
      let score = 0;

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function update(dt) {
        if (game.keyDown('left'))  { px -= SPEED * dt; }
        if (game.keyDown('right')) { px += SPEED * dt; }
        if (game.keyDown('up'))    { py -= SPEED * dt; }
        if (game.keyDown('down'))  { py += SPEED * dt; }

        const coin = coinSpots[coinIndex];
        if (touching(px, py, SIZE, SIZE, coin[0], coin[1], 16, 16)) {
          score += 1;
          coinIndex = (coinIndex + 1) % coinSpots.length;
        }
      }

      function draw() {
        game.clear(game.DARK);
        const coin = coinSpots[coinIndex];
        game.rect(coin[0], coin[1], 16, 16, game.YELLOW);
        game.rect(px, py, SIZE, SIZE, game.CYAN);
        game.text(10, 10, 'Score: ' + score, game.WHITE, 16);
      }

      game.run(update, draw);
quiz:
  - q: "Two rectangles overlap only if they overlap on..."
    options: ["the x axis only", "both the x axis and the y axis", "the y axis only"]
    answer: 1
  - q: "What does % do in (n + 1) % 3 ?"
    options: ["Calculates a percentage", "Gives the remainder of a division, so the count wraps back to 0", "Divides and rounds up"]
    answer: 1
    explain: "(2 + 1) % 3 is 0, so the coin goes back to the first spot."
  - q: "What does a function that ends with  return a < b && c > d  give back?"
    options: ["true or false", "A rectangle", "The score"]
    answer: 0
  - q: "Why does the coin jump to a new spot right after it was touched?"
    options: ["Otherwise it would count again on every frame while overlapping", "To save memory", "Because coins are random"]
    answer: 0
---

Games come alive when things **touch**: the hero grabs a coin, a bullet hits an enemy, a ball hits a wall. The test "do these two things overlap?" is called **collision detection**. You will write it once as a function and use it to collect coins and keep score.

## Overlap, one axis at a time

Picture two bars on a number line. Bar A spans from `ax` to `ax + aw`, bar B from `bx` to `bx + bw`. They overlap when A starts **before B ends** and A ends **after B starts**:

```js
ax < bx + bw && ax + aw > bx
```

`&&` means "and": both sides must be true. Two rectangles overlap when that is true for the x axis **and** for the y axis. Joining all four conditions gives the complete collision test, which you wrap in a function so you can use it everywhere:

```js
function touching(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
```

A function can `return` a result. Here the result is `true` or `false`, so you can write `if (touching(...)) { ... }` directly. Check it by hand with `touching(0, 0, 10, 10, 5, 5, 10, 10)`: the squares share the area from 5 to 10, so the answer is `true`. For `touching(0, 0, 10, 10, 20, 20, 5, 5)` the second square is far away: `false`. We use `<` and `>` and not `<=`, so squares that only share an edge are not touching.

## One coin that jumps

Instead of creating a new coin each time, we keep **one** coin and move it to the next place when collected. The places are in an **array of arrays**:

```js
const coinSpots = [[150, 100], [150, 30], [40, 30]];
let coinIndex = 0;
const coin = coinSpots[coinIndex];   // [150, 100]
coin[0];                              // 150 (the x)
coin[1];                              // 100 (the y)
```

`coinSpots[0]` is the first inner array. Position `0` of that array is `x`, position `1` is `y`. Array positions start at zero.

When the player touches the coin:

```js
score += 1;
coinIndex = (coinIndex + 1) % coinSpots.length;
```

`coinSpots.length` is `3`. The **remainder operator** `%` gives what is left over after a division: `(0 + 1) % 3` is `1`, `(1 + 1) % 3` is `2`, and `(2 + 1) % 3` is `0`. The index walks along the list and starts again at the beginning, and you never fall off the end of the array.

## Why a fixed list?

A list of fixed spots makes the game predictable, so our checker can walk the player along a known path and know exactly how many coins he must collect. When your game works, replace it with random positions: `Math.random()` gives a number from 0 to just below 1, so `Math.random() * 300` is a random x.

## Reading the game state in the test

The checker reads your variable `score` after the scripted walk, and also calls `touching` with a few rectangles of its own to be sure that the function is right and not just lucky for this walk.

> **Watch out:** if the score shoots up by dozens within a second, the coin did not move away after being touched, so it is counted on every frame.
>
> **Watch out:** `TypeError: Cannot read properties of undefined (reading '0')` means `coinIndex` went past the end of the array. Use `% coinSpots.length`.
>
> **Watch out:** `ax + aw` is the **right edge**, not a width. If collisions feel wrong, draw both rectangles on paper with their edges.
>
> **Watch out:** a single `&` or `|` is a different operator. Use `&&` and `||` for conditions.

## Going further

Draw the coin as a circle, add a timer, or make the player grow every time a coin is collected.

> **Your turn:** finish `touching` so it returns `true` only when the two rectangles overlap. Then, when the player touches the coin, add 1 to `score` and move `coinIndex` to the next spot, wrapping around with `%`.
