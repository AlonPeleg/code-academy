---
title: Arrays of bullets and blocks
summary: Keep many things in an array, add bullets with push, remove them with filter, and shoot blocks down.
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      let player = { x: 150, y: 200 };
      let bullets = [];
      let blocks = [];
      let cooldown = 0;     // seconds until the next shot is allowed
      let shots = 0;
      let score = 0;

      for (let i = 0; i < 5; i++) {
        blocks.push({ x: 20 + i * 60, y: 40, alive: true });
      }

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function update(dt) {
        if (game.keyDown('left'))  { player.x -= 200 * dt; }
        if (game.keyDown('right')) { player.x += 200 * dt; }
        cooldown -= dt;

        // 1. While space is held and cooldown is 0 or less: add the new object
        //    { x: player.x + 8, y: player.y, alive: true } to bullets, add 1 to
        //    shots and set cooldown to 0.26.

        // 2. Move every bullet up by 300 * dt (use a for...of loop).

        // 3. For every bullet and every block that touch (a bullet is 4 wide and
        //    10 high, a block is 40 wide and 20 high): set both alive properties
        //    to false and add 1 to score.

        // 4. Keep only the bullets that are alive and still on screen (y > -10)
        //    and only the blocks that are alive.
      }

      function draw() {
        game.clear(game.DARK);
        for (const k of blocks) { game.rect(k.x, k.y, 40, 20, game.ORANGE); }
        for (const b of bullets) { game.rect(b.x, b.y, 4, 10, game.YELLOW); }
        game.rect(player.x, player.y, 20, 20, game.CYAN);
        game.text(10, 10, 'Score: ' + score, game.WHITE, 16);
      }

      game.run(update, draw);
check:
  game:
    frames: 60
    keys:
      - { key: space, from: 0, to: 60 }
    expect: "shots === 4 && bullets.length === 2 && blocks.length === 4 && score === 1"
    message: "Hold space for one second: 4 bullets are fired (every 0.26 s), the first one destroys the block above the player (score 1, 4 blocks left), and the bullets that left the screen are removed (2 remain)."
  code:
    - { pattern: 'bullets\.push\(', message: "Add a bullet with bullets.push({ ... })." }
    - { pattern: '\.filter\(', message: "Remove dead bullets and blocks with filter." }
    - { pattern: 'for\s*\(\s*(const|let)\s+\w+\s+of\s+bullets', message: "Loop over the bullets with for (const b of bullets)." }
hints:
  - "An array is a list that can grow and shrink. push adds an item at the end, and filter makes a new array that keeps only the items that pass a test."
  - "Firing: if (game.keyDown('space') && cooldown <= 0) { bullets.push({ x: player.x + 8, y: player.y, alive: true }); shots += 1; cooldown = 0.26; }. Cleaning up: bullets = bullets.filter(b => b.alive && b.y > -10);"
  - "for (const b of bullets) { b.y -= 300 * dt; for (const k of blocks) { if (touching(b.x, b.y, 4, 10, k.x, k.y, 40, 20)) { b.alive = false; k.alive = false; score += 1; } } }   blocks = blocks.filter(k => k.alive);"
solution:
  - name: main.js
    code: |
      let player = { x: 150, y: 200 };
      let bullets = [];
      let blocks = [];
      let cooldown = 0;     // seconds until the next shot is allowed
      let shots = 0;
      let score = 0;

      for (let i = 0; i < 5; i++) {
        blocks.push({ x: 20 + i * 60, y: 40, alive: true });
      }

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function update(dt) {
        if (game.keyDown('left'))  { player.x -= 200 * dt; }
        if (game.keyDown('right')) { player.x += 200 * dt; }
        cooldown -= dt;

        if (game.keyDown('space') && cooldown <= 0) {
          bullets.push({ x: player.x + 8, y: player.y, alive: true });
          shots += 1;
          cooldown = 0.26;
        }

        for (const b of bullets) {
          b.y -= 300 * dt;
          for (const k of blocks) {
            if (touching(b.x, b.y, 4, 10, k.x, k.y, 40, 20)) {
              b.alive = false;
              k.alive = false;
              score += 1;
            }
          }
        }

        bullets = bullets.filter(b => b.alive && b.y > -10);
        blocks = blocks.filter(k => k.alive);
      }

      function draw() {
        game.clear(game.DARK);
        for (const k of blocks) { game.rect(k.x, k.y, 40, 20, game.ORANGE); }
        for (const b of bullets) { game.rect(b.x, b.y, 4, 10, game.YELLOW); }
        game.rect(player.x, player.y, 20, 20, game.CYAN);
        game.text(10, 10, 'Score: ' + score, game.WHITE, 16);
      }

      game.run(update, draw);
quiz:
  - q: "Which method adds an item to the end of an array?"
    options: ["push", "add", "append"]
    answer: 0
  - q: "What does  bullets = bullets.filter(b => b.y > -10)  do?"
    options: ["Changes every bullet", "Builds a new array with only the bullets that pass the test", "Deletes the array"]
    answer: 1
    explain: "filter does not change the old array; you assign its result back to the variable, which is why bullets is declared with let."
  - q: "Why do we use a cooldown for shooting?"
    options: ["Without it a held key would spawn a new bullet on all 60 frames each second", "To make bullets move slower", "Because arrays have a limit"]
    answer: 0
  - q: "How is the first item of an array read?"
    options: ["array[1]", "array[0]", "array.first"]
    answer: 1
---

One bullet is easy: a couple of variables. But a shooter fires dozens of bullets, and you cannot create a variable `bullet37` by hand while the game is running. The answer is an **array**: a list that can hold any number of things, and grow and shrink while the game runs. Arrays are the data structure behind bullets, enemies, particles, coins and almost everything else that comes in numbers.

## Objects and arrays

First, a thing to describe a bullet. In JavaScript you can group values into an **object**, written with curly braces:

```js
let player = { x: 150, y: 200 };
player.x += 5;          // read and change a property with a dot
```

A bullet is also an object: `{ x: 158, y: 200, alive: true }`. The word before the colon is the **property name**.

An array holds many of them between square brackets:

```js
let bullets = [];                         // empty list
bullets.push({ x: 10, y: 20, alive: true });   // add one at the end
bullets.length;                           // how many are in the list: 1
bullets[0].y;                             // the first one's y (counting starts at 0): 20
```

## Looping over an array

To do something for every item, use `for ... of`:

```js
for (const b of bullets) {
  b.y -= 300 * dt;      // move every bullet up
}
```

On each turn, `b` is the next bullet. Because `b` is the very same object that lives in the array, changing `b.y` changes the bullet in the list. (The `const` only means that `b` itself is not given a different bullet; the properties can still change.)

## Removing things with filter

Things must disappear: a bullet that left the screen, a block that was hit. Otherwise your array grows forever and the game slows down. The trick is `filter`, which builds a **new** array with only the items that pass a test:

```js
bullets = bullets.filter(b => b.alive && b.y > -10);
```

The part `b => b.alive && b.y > -10` is an **arrow function**: a tiny unnamed function that takes `b` and returns `true` (keep) or `false` (drop). Assign the result back to the variable; this is why `bullets` is declared with `let` and not `const`.

Do not remove items from an array while looping over it with `for...of`: that skips items. Instead mark them (`alive = false`) during the loop and filter afterwards, which is the pattern in this lesson.

## Firing with a cooldown

If you fire when `space` is down, then 60 frames a second means 60 bullets a second. A **cooldown timer** fixes it. It is a number of seconds that counts down; you only fire when it has reached zero, and then you set it back up:

```js
cooldown -= dt;
if (game.keyDown('space') && cooldown <= 0) {
  bullets.push({ x: player.x + 8, y: player.y, alive: true });
  cooldown = 0.26;     // wait about a quarter of a second
}
```

Timers like this are everywhere in games: reload times, invincibility after a hit, spawn timers. `player.x + 8` puts the bullet in the middle of a 20-pixel-wide ship.

## Bullets meet blocks

For each bullet, test each block with the `touching` function from the last lesson, a loop inside a loop. When they meet, mark both as not alive and give a point. A cleanup with `filter` after the loop removes them.

> **Watch out:** `TypeError: Cannot read properties of undefined (reading 'y')` often comes from reading `bullets[5]` when the array has fewer items. Loop with `for...of` instead of fixed numbers.
>
> **Watch out:** `TypeError: Assignment to constant variable` appears if you declare `const bullets = []` and then write `bullets = bullets.filter(...)`. Use `let`.
>
> **Watch out:** `bullets.filter(...)` on its own line does nothing, because filter returns a new array. You must assign it.
>
> **Watch out:** forgetting to remove off-screen bullets will not crash anything, but the array grows and every frame gets slower and slower.

> **Your turn:** complete the four numbered steps in `update`: fire with a cooldown using `bullets.push`, move the bullets, mark touching bullets and blocks as not alive (and add to `score`), and clean both arrays with `filter`.
