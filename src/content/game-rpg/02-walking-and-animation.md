---
title: "Step 2: Walking and animation"
summary: "Make the hero walk with the arrow keys, look the way it walks, and swap between two walking pictures."
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 2: walking and animation.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;           // pixels per second
      const FLOOR_Y = 192;             // the top of the ground (12 tiles down)

      let heroArt = game.art.warrior;  // which character we play

      // (x, y) is the top-left corner of the hitbox. The sprite is drawn a little larger.
      const player = {
        x: 150, y: FLOOR_Y - 18, w: 10, h: 18,
        vx: 0,            // horizontal speed in pixels per second
        facing: 1,        // 1 = looking right, -1 = looking left
        animTime: 0,      // seconds spent walking (drives the animation)
      };

      // Pick the picture that matches what the hero is doing.
      function playerArt() {
        // 3. TODO: if the hero is standing still (player.vx is 0) return heroArt.idle.
        //    Otherwise alternate between heroArt.walk1 and heroArt.walk2 every 0.15 seconds
        //    using player.animTime. Start with walk1.
        return heroArt.idle;
      }

      // Read the keyboard: set the speed and the direction we look at.
      function handleInput() {
        player.vx = 0;
        // 1. TODO: if 'left' is held: player.vx = -WALK_SPEED and player.facing = -1.
        //    If 'right' is held: player.vx = WALK_SPEED and player.facing = 1.
      }

      function update(dt) {
        handleInput();
        // 2. TODO: move the hero: add player.vx * dt to player.x.
        player.x = Math.max(0, Math.min(game.WIDTH - player.w, player.x));   // stay on the screen

        // 2b. TODO: while the hero walks (vx is not 0) add dt to player.animTime, otherwise reset it to 0.
      }

      function drawFloor() {
        for (let x = 0; x < game.WIDTH; x += TILE) {
          game.sprite(x, FLOOR_Y, game.art.tiles.grass);
          game.sprite(x, FLOOR_Y + TILE, game.art.tiles.dirt);
          game.sprite(x, FLOOR_Y + 2 * TILE, game.art.tiles.dirt);
        }
      }

      function drawPlayer() {
        // the 16 x 20 sprite is a bit bigger than the 10 x 18 hitbox, so we shift it by (-3, -2)
        // 4. TODO: mirror the sprite when the hero looks left (the flip option).
        game.sprite(player.x - 3, player.y - 2, playerArt());
      }

      function draw() {
        game.clear([96, 168, 248]);
        drawFloor();
        drawPlayer();
        game.text(8, 8, 'Arrow keys: walk', game.WHITE, 12);
      }

      game.run(update, draw);
check:
  game:
    frames: 80
    keys:
      - { key: right, from: 0, to: 60 }
      - { key: left, from: 60, to: 80 }
    expect: |
      (() => {
        const log = [];
        const original = game.sprite;
        game.sprite = (...args) => { log.push(args); return original(...args); };
        try { draw(); } finally { game.sprite = original; }
        const savedVx = player.vx;
        const savedTime = player.animTime;
        player.vx = 90; player.animTime = 0.05;
        const first = playerArt() === heroArt.walk1;
        player.animTime = 0.2;
        const second = playerArt() === heroArt.walk2;
        player.animTime = 0.31;
        const third = playerArt() === heroArt.walk1;
        player.vx = 0;
        const idle = playerArt() === heroArt.idle;
        player.vx = savedVx; player.animTime = savedTime;
        return player.x > 200 && player.x < 220 && player.facing === -1 && player.animTime > 1 &&
          first && second && third && idle &&
          log.some(a => a[3] && a[3].flip === true);
      })()
    message: "Hold right for one second and then left for a third of a second: the hero should end up around x = 210 looking left (facing -1), the sprite must be flipped, playerArt() must give idle when vx is 0 and switch walk1 / walk2 every 0.15 seconds of animTime."
hints:
  - "Speed is pixels per second, so every frame the hero moves speed * dt pixels. Direction is stored in player.facing (1 or -1) and the walking animation is driven by player.animTime."
  - "handleInput: when 'left' is held set player.vx = -WALK_SPEED and player.facing = -1 (right is the mirror image). update: player.x += player.vx * dt, and animTime grows by dt only while vx is not 0. playerArt: Math.floor(player.animTime / 0.15) % 2 is 0, 1, 0, 1... pick walk1 or walk2 from it. Mirror the sprite with { flip: player.facing < 0 }."
  - "if (game.keyDown('left')) { player.vx = -WALK_SPEED; player.facing = -1; }   player.x += player.vx * dt;   if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }   const step = Math.floor(player.animTime / 0.15) % 2;   return step === 0 ? heroArt.walk1 : heroArt.walk2;   game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0 });"
solution:
  - name: main.js
    code: |
      // Step 2: walking and animation.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;           // pixels per second
      const FLOOR_Y = 192;             // the top of the ground (12 tiles down)

      let heroArt = game.art.warrior;  // which character we play

      // (x, y) is the top-left corner of the hitbox. The sprite is drawn a little larger.
      const player = {
        x: 150, y: FLOOR_Y - 18, w: 10, h: 18,
        vx: 0,            // horizontal speed in pixels per second
        facing: 1,        // 1 = looking right, -1 = looking left
        animTime: 0,      // seconds spent walking (drives the animation)
      };

      // Pick the picture that matches what the hero is doing.
      function playerArt() {
        if (player.vx === 0) { return heroArt.idle; }
        const step = Math.floor(player.animTime / 0.15) % 2;   // 0, 1, 0, 1, ...
        return step === 0 ? heroArt.walk1 : heroArt.walk2;
      }

      // Read the keyboard: set the speed and the direction we look at.
      function handleInput() {
        player.vx = 0;
        if (game.keyDown('left')) {
          player.vx = -WALK_SPEED;
          player.facing = -1;
        }
        if (game.keyDown('right')) {
          player.vx = WALK_SPEED;
          player.facing = 1;
        }
      }

      function update(dt) {
        handleInput();
        player.x += player.vx * dt;
        player.x = Math.max(0, Math.min(game.WIDTH - player.w, player.x));   // stay on the screen

        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
      }

      function drawFloor() {
        for (let x = 0; x < game.WIDTH; x += TILE) {
          game.sprite(x, FLOOR_Y, game.art.tiles.grass);
          game.sprite(x, FLOOR_Y + TILE, game.art.tiles.dirt);
          game.sprite(x, FLOOR_Y + 2 * TILE, game.art.tiles.dirt);
        }
      }

      function drawPlayer() {
        // the 16 x 20 sprite is a bit bigger than the 10 x 18 hitbox, so we shift it by (-3, -2)
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0 });
      }

      function draw() {
        game.clear([96, 168, 248]);
        drawFloor();
        drawPlayer();
        game.text(8, 8, 'Arrow keys: walk', game.WHITE, 12);
      }

      game.run(update, draw);
quiz:
  - q: "Why do we move the hero with player.vx * dt instead of a fixed number of pixels per frame?"
    options: ["Because dt is always 1", "So the speed in pixels per second is the same on fast and slow computers", "Because JavaScript cannot add small numbers"]
    answer: 1
    explain: "dt is the time since the last frame. 90 pixels per second times 1/60 second is 1.5 pixels per frame, and it stays 90 pixels per second if the frame rate changes."
  - q: "What does Math.floor(player.animTime / 0.15) % 2 produce while animTime grows?"
    options: ["0, 1, 0, 1, ... switching every 0.15 seconds", "Always 0", "A random number"]
    answer: 0
  - q: "Why do we store player.facing instead of using the sign of player.vx to flip the sprite?"
    options: ["facing is faster to read", "vx can never be negative", "When the hero stands still vx is 0, but it should keep looking the way it last walked"]
    answer: 2
  - q: "The hitbox is 10 x 18 but the sprite is 16 x 20. How do we line them up?"
    options: ["We draw the sprite at (player.x - 3, player.y - 2)", "We make the hitbox bigger", "We scale the sprite"]
    answer: 0
    explain: "The sprite has some empty margin around the character, so it is drawn a few pixels up and to the left of the hitbox."
---
## Where we are

In step 1 we learned to draw sprites. The code you start with already has a hero standing on a floor made of tiles, with a `player` object, a `playerArt()` function that picks the picture and a `drawPlayer()` function. But nothing reacts to the keyboard yet: the hero just stands there looking at you.

## What we add

A game character needs to **move**, to **look where it goes** and to **look alive while moving**. We add three ideas that every platformer uses:

1. **Speed times time.** Movement is `x += speed * dt`.
2. **Facing.** Remember which way the hero looked last.
3. **Animation.** Two walking pictures that swap every fraction of a second.

## 1. Moving with speed and dt

`dt` is the time in seconds since the last frame (about 0.0167 at 60 frames per second). The player has `vx`, the horizontal **v**elocity in pixels per second. In `handleInput` we set it from the keys, and in `update` we apply it:

```js
player.x += player.vx * dt;
```

With `WALK_SPEED = 90` the hero crosses 90 pixels every second, whatever the frame rate. If you forget `* dt` the hero moves 90 pixels every frame and shoots off the screen.

`handleInput` starts with `player.vx = 0`, so when no key is held the hero stops. Then each held key sets the speed and the facing:

```js
if (game.keyDown('left')) {
  player.vx = -WALK_SPEED;   // negative = to the left
  player.facing = -1;
}
```

## 2. Facing and flipping

The art looks right. When `facing` is `-1` we draw it mirrored with `{ flip: player.facing < 0 }`. That comparison is `true` for -1 and `false` for 1, exactly what the option needs. We keep a separate `facing` because when the hero stops, `vx` becomes 0, yet it should keep looking the same way.

## 3. Animation: swapping frames on a timer

`playerArt()` decides **which picture** to show. While walking we count time in `player.animTime`, and turn it into a frame number:

```js
const step = Math.floor(player.animTime / 0.15) % 2;
```

Walk through it: at 0.0 seconds `0 / 0.15` is 0, so `step` is 0. At 0.2 seconds `0.2 / 0.15` is 1.33, `Math.floor` makes it 1. At 0.31 it is 2, and `2 % 2` is 0 again. So `step` goes 0, 1, 0, 1 and changes every 0.15 seconds. Use `walk1` for 0 and `walk2` for 1. When the hero is still we return `heroArt.idle` and reset `animTime` to 0, so the next walk always starts with `walk1`.

> **Watch out:**
> - Forgetting `* dt` makes the game run at a different speed on every computer.
> - If you flip with `player.vx < 0`, the hero turns right again the moment you let go of the key. Use `facing`.
> - `Math.floor(player.animTime / 0.15) % 2`: without `Math.floor` you get fractions like 0.4 and the comparison `=== 0` is never true.
> - `ReferenceError: heroArt is not defined` usually means a typo, for example `heroart`. JavaScript cares about capital letters.

## Going further

Make the hero run when `z` is held (a bigger speed and a smaller number than 0.15), or try `game.art.mage` by changing the first line to `let heroArt = game.art.mage;`.

> **Your turn:** complete the four TODOs. (1) In `handleInput`, set `player.vx` and `player.facing` for the left and right keys. (2) In `update`, move with `player.vx * dt` and count `player.animTime` only while walking. (3) In `playerArt`, return `idle` when standing and alternate `walk1` / `walk2` every 0.15 seconds. (4) Flip the sprite in `drawPlayer` when the hero faces left. Then walk around and watch the legs move.
