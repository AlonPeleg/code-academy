---
title: "Step 3: Gravity and jumping"
summary: "Give the hero a vertical speed, pull it down with gravity, and let it jump only when it stands on the floor."
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 3: gravity and jumping.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;           // pixels per second
      const GRAVITY = 900;             // how fast falling gets faster (pixels per second, every second)
      const JUMP_SPEED = 320;          // how fast we leave the ground when jumping
      const MAX_FALL = 500;            // we never fall faster than this (terminal velocity)
      const FLOOR_Y = 192;             // the top of the ground (12 tiles down)

      let heroArt = game.art.warrior;  // which character we play

      // (x, y) is the top-left corner of the hitbox. The sprite is drawn a little larger.
      const player = {
        x: 150, y: 40, w: 10, h: 18,       // we start in the air and fall down onto the floor
        vx: 0,            // horizontal speed in pixels per second
        vy: 0,            // vertical speed: positive = falling, negative = going up
        onGround: false,  // true while the feet stand on something
        facing: 1,        // 1 = looking right, -1 = looking left
        animTime: 0,      // seconds spent walking (drives the animation)
      };

      // Pick the picture that matches what the hero is doing.
      function playerArt() {
        // 4. TODO: if the hero is in the air (not player.onGround) return heroArt.jump.
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
        // 1. TODO: jump. If 'space' was just pressed (keyPressed) and the hero is on the ground:
        //    set player.vy to -JUMP_SPEED and player.onGround to false.
      }

      function update(dt) {
        handleInput();
        player.x += player.vx * dt;
        player.x = Math.max(0, Math.min(game.WIDTH - player.w, player.x));   // stay on the screen

        // 2. TODO: gravity. Add GRAVITY * dt to player.vy (but never above MAX_FALL),
        //    then add player.vy * dt to player.y.

        // 3. TODO: the floor. Set player.onGround to false. Then, if the feet (player.y + player.h)
        //    are at or below FLOOR_Y: put the hero on the floor (player.y = FLOOR_Y - player.h),
        //    set player.vy to 0 and player.onGround to true.

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
check:
  game:
    frames: 75
    keys:
      - { key: space, from: 60, to: 61 }
    expect: '!player.onGround && player.vy < 0 && player.y > 90 && player.y < 160 && playerArt() === heroArt.jump'
    message: "The hero starts in the air and must fall to the floor. Then one tap of space at frame 60 must launch it upwards: a moment later it is in the air (onGround false), moving up (vy below 0), and playerArt() gives heroArt.jump."
  code:
    - { pattern: 'keyPressed\(\s*[''"]space[''"]\s*\)', message: "Use game.keyPressed('space') for the jump, so holding the key does not jump again and again." }
hints:
  - "Think in two numbers: player.vy is the vertical speed, and gravity changes vy a little every frame. Remember that y grows DOWNWARD on the screen, so a jump is a negative vy."
  - "Gravity: player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL); player.y += player.vy * dt;  Floor: set onGround to false, then if (player.y + player.h >= FLOOR_Y) put the hero on the floor, vy = 0, onGround = true. Jump: only if keyPressed('space') and player.onGround."
  - "In handleInput: if (game.keyPressed('space') && player.onGround) { player.vy = -JUMP_SPEED; player.onGround = false; }   In update: player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL); player.y += player.vy * dt; player.onGround = false; if (player.y + player.h >= FLOOR_Y) { player.y = FLOOR_Y - player.h; player.vy = 0; player.onGround = true; }   In playerArt: if (!player.onGround) { return heroArt.jump; }"
solution:
  - name: main.js
    code: |
      // Step 3: gravity and jumping.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;           // pixels per second
      const GRAVITY = 900;             // how fast falling gets faster (pixels per second, every second)
      const JUMP_SPEED = 320;          // how fast we leave the ground when jumping
      const MAX_FALL = 500;            // we never fall faster than this (terminal velocity)
      const FLOOR_Y = 192;             // the top of the ground (12 tiles down)

      let heroArt = game.art.warrior;  // which character we play

      // (x, y) is the top-left corner of the hitbox. The sprite is drawn a little larger.
      const player = {
        x: 150, y: 40, w: 10, h: 18,       // we start in the air and fall down onto the floor
        vx: 0,            // horizontal speed in pixels per second
        vy: 0,            // vertical speed: positive = falling, negative = going up
        onGround: false,  // true while the feet stand on something
        facing: 1,        // 1 = looking right, -1 = looking left
        animTime: 0,      // seconds spent walking (drives the animation)
      };

      // Pick the picture that matches what the hero is doing.
      function playerArt() {
        if (!player.onGround) { return heroArt.jump; }
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
        // jump only when the key was just pressed AND we stand on the ground
        if (game.keyPressed('space') && player.onGround) {
          player.vy = -JUMP_SPEED;
          player.onGround = false;
        }
      }

      function update(dt) {
        handleInput();
        player.x += player.vx * dt;
        player.x = Math.max(0, Math.min(game.WIDTH - player.w, player.x));   // stay on the screen

        // gravity: every second the downward speed grows by GRAVITY, but never beyond MAX_FALL
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        player.y += player.vy * dt;

        // the floor: if the feet went below FLOOR_Y, put the hero back on top and stop falling
        player.onGround = false;
        if (player.y + player.h >= FLOOR_Y) {
          player.y = FLOOR_Y - player.h;
          player.vy = 0;
          player.onGround = true;
        }

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
  - q: "On the screen, which direction does y grow?"
    options: ["Upwards", "Downwards", "To the right"]
    answer: 1
    explain: "y = 0 is the top edge. That is why a jump uses a negative vy and gravity adds a positive number."
  - q: "Why do we only start a jump when player.onGround is true?"
    options: ["Otherwise the hero could jump again in mid-air, and fly away", "Because gravity stops working in the air", "Because keyPressed only works on the floor"]
    answer: 0
  - q: "What is the difference between keyDown and keyPressed?"
    options: ["They are the same", "keyDown only works for letters", "keyPressed is true only on the first frame of a press; keyDown is true for as long as the key is held"]
    answer: 2
  - q: "What does MAX_FALL (the terminal speed) protect us from?"
    options: ["Falling so fast that in one frame we skip right through a thin floor", "The hero becoming too heavy", "Jumping too high"]
    answer: 0
    explain: "Without a limit vy keeps growing while we fall. At a high speed one frame could move us further than the floor is thick."
---
## Where we are

Last step the hero learned to walk and animate along a floor. The code you start with still does that, and it has some new ingredients waiting: the constants `GRAVITY`, `JUMP_SPEED` and `MAX_FALL`, and two new fields in the `player` object: `vy` and `onGround`. The hero now starts **in the air** (at `y = 40`), but nothing pulls it down yet, so it floats there.

## What we add

Platformers feel good because the hero has **weight**: it speeds up while falling, it launches upwards when you jump, and it can only jump from solid ground. We add that in three small pieces: gravity, the floor, and the jump.

## 1. Velocity and gravity

You already know `x += vx * dt`. Vertical movement works the same way with `vy`. The new thing is that **gravity changes `vy` itself**, a little every frame:

```js
player.vy += GRAVITY * dt;   // faster and faster downwards
player.y  += player.vy * dt; // then move
```

That is the physics idea of **acceleration**: with `GRAVITY = 900` the speed grows by 900 pixels per second, every second. After half a second the hero falls at 450 pixels per second. Because y grows **downward** on the screen, a positive `vy` means falling and a **negative** `vy` means rising.

We also cap the speed, the **terminal velocity** of a real falling object: `player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL)`. `Math.min` picks the smaller of the two numbers, so `vy` never exceeds `MAX_FALL`. In the next step this matters: a hero that falls too fast could skip through a thin floor in a single frame.

## 2. The floor

For now the floor is a flat line at `FLOOR_Y`. The hero's feet are at `player.y + player.h`. If the feet are at or below the floor, we fix the position and stop falling:

```js
player.onGround = false;
if (player.y + player.h >= FLOOR_Y) {
  player.y = FLOOR_Y - player.h;  // stand exactly on top
  player.vy = 0;                  // no more falling
  player.onGround = true;
}
```

Setting `onGround = false` first and then `true` only when we touch the floor means the flag is always up to date.

## 3. Jumping

A jump is just a quick upward speed: `player.vy = -JUMP_SPEED`. Then gravity slowly takes it away, the hero slows down at the top, and falls back. With our numbers the hero rises about 57 pixels (3.5 tiles) and stays in the air for 0.7 seconds. Two rules make it feel right:

- Use `game.keyPressed('space')`, which is true only on the frame the key goes down. With `keyDown` the hero would bounce like a rabbit while you hold the key.
- Jump only `&& player.onGround`. Without that check you could press space in mid-air again and again and fly.

Finally `playerArt()` shows `heroArt.jump` whenever the hero is not on the ground.

> **Watch out:**
> - Forgetting `player.vy = 0` when landing makes the hero sink: the speed keeps building up while it stands on the floor, and the next jump is weird.
> - If you write `player.vy = JUMP_SPEED` (without the minus) the hero is pushed **down**, into the floor.
> - Put the floor check **after** moving, so it sees the new position.
> - `NaN` values in the hero's position usually come from a misspelled constant, such as `GRAVTIY * dt`.

## Going further

Make the jump height depend on how long space is held: when the key is released while `vy < -120`, set `vy = -120`. Games like Super Mario do this, so a tap hops and a hold leaps.

> **Your turn:** complete the four TODOs. (1) In `handleInput`, jump with `game.keyPressed('space')`, but only while `player.onGround`. (2) In `update`, apply gravity with the `MAX_FALL` limit and move `player.y`. (3) Add the floor: stand on `FLOOR_Y`, set `vy` to 0 and `onGround` to true. (4) In `playerArt`, return `heroArt.jump` while the hero is in the air. The hero should fall down at the start and jump when you press space.
