---
title: "Step 4: Tiles and platforms"
summary: "Build the world from a map of text rows: draw the tiles, stop the hero at walls, land on floors and platforms, and jump up through wooden ledges."
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 4: tiles and platforms.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;
      const GRAVITY = 900;
      const JUMP_SPEED = 320;
      const MAX_FALL = 500;

      let heroArt = game.art.warrior;

      // The map: one character per tile, 20 columns x 15 rows = exactly one screen.
      //   #  solid ground      S  solid stone      B  solid brick
      //   =  wooden platform (you can jump up through it and stand on it)
      //   .  empty air         P  where the player starts (removed when the map loads)
      const LEVEL = [
        '....................',
        '....................',
        '....................',
        '....................',
        '..............====..',
        '....................',
        '....................',
        '........====........',
        '....................',
        '......S.............',
        '..====.........BBB..',
        '..........SS........',
        '.P........SS........',
        '####################',
        '####################',
      ];

      let map = [];                    // the loaded map (without the P marker)

      const player = {
        x: 0, y: 0, w: 10, h: 18,
        vx: 0, vy: 0,
        facing: 1,
        onGround: false,
        animTime: 0,
      };

      // ---------- the map ----------

      // The character of the tile in column col, row row. Outside the map: the sides are walls.
      function charAt(col, row) {
        if (col < 0 || col >= map[0].length) { return 'S'; }
        if (row < 0 || row >= map.length) { return '.'; }
        return map[row][col];
      }

      // The tile under a pixel position (px, py).
      function tileAt(px, py) {
        return charAt(Math.floor(px / TILE), Math.floor(py / TILE));
      }

      // Solid tiles stop you from every side.
      function solidAt(col, row) {
        return '#SB'.includes(charAt(col, row));
      }

      // One-way platforms only hold you up from above.
      function oneWayAt(col, row) {
        return charAt(col, row) === '=';
      }

      // Copy LEVEL into map, and use the P marker to place the player.
      function loadMap() {
        map = [];
        for (let row = 0; row < LEVEL.length; row++) {
          let line = '';
          for (let col = 0; col < LEVEL[row].length; col++) {
            let ch = LEVEL[row][col];
            if (ch === 'P') {
              player.x = col * TILE + (TILE - player.w) / 2;     // centered in the tile
              player.y = (row + 1) * TILE - player.h;            // feet on the bottom of the tile
              ch = '.';
            }
            line += ch;
          }
          map.push(line);
        }
      }

      // Which picture belongs to the tile at (col, row)? Ground gets grass only on top.
      function tileArt(col, row) {
        const ch = charAt(col, row);
        if (ch === '#') { return solidAt(col, row - 1) ? game.art.tiles.dirt : game.art.tiles.grass; }
        if (ch === 'S') { return game.art.tiles.stone; }
        if (ch === 'B') { return game.art.tiles.brick; }
        if (ch === '=') { return game.art.tiles.wood; }
        return null;                                              // empty air: nothing to draw
      }

      function drawMap() {
        // 1. TODO: go through every row and every column of map. For each tile get its picture
        //    with tileArt(col, row). When it is not null, draw it with game.sprite at
        //    x = col * TILE and y = row * TILE.
      }

      // ---------- moving and colliding ----------

      // Move sideways, then push the hero out of any solid tile we ran into.
      function moveX(dt) {
        player.x += player.vx * dt;
        // 2. TODO: collision on X. Work out the rows the body covers:
        //      top = Math.floor(player.y / TILE)   bottom = Math.floor((player.y + player.h - 0.01) / TILE)
        //    Moving right (vx > 0): col = Math.floor((player.x + player.w) / TILE). If solidAt(col, row)
        //      is true for any row from top to bottom, set player.x = col * TILE - player.w.
        //    Moving left (vx < 0): col = Math.floor(player.x / TILE). If solid for any of those rows,
        //      set player.x = (col + 1) * TILE.
      }

      // Move up or down, then land on a floor or bump into a ceiling.
      function moveY(dt) {
        const oldBottom = player.y + player.h;
        player.y += player.vy * dt;
        player.onGround = false;
        const left = Math.floor(player.x / TILE);
        const right = Math.floor((player.x + player.w - 0.01) / TILE);
        // 3. TODO: collision on Y.
        //    Falling (vy >= 0): row = Math.floor((player.y + player.h) / TILE), the row under the feet.
        //      For every col from left to right: if solidAt(col, row), or oneWayAt(col, row) while
        //      oldBottom <= row * TILE + 0.01 (we came from above), then land:
        //      player.y = row * TILE - player.h, player.vy = 0, player.onGround = true.
        //    Going up (vy < 0): row = Math.floor(player.y / TILE), the row at the head. If solidAt(col, row)
        //      for a col: player.y = (row + 1) * TILE and player.vy = 0. (Wooden platforms do not block.)
      }

      // ---------- the hero ----------

      function playerArt() {
        if (!player.onGround) { return heroArt.jump; }
        if (player.vx === 0) { return heroArt.idle; }
        const step = Math.floor(player.animTime / 0.15) % 2;
        return step === 0 ? heroArt.walk1 : heroArt.walk2;
      }

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
        if (game.keyPressed('space') && player.onGround) {
          player.vy = -JUMP_SPEED;
          player.onGround = false;
        }
      }

      function update(dt) {
        dt = Math.min(dt, 0.03);          // a slow frame must never move us a whole tile at once
        handleInput();
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        moveX(dt);
        moveY(dt);
        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
      }

      function drawPlayer() {
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0 });
      }

      function draw() {
        game.clear([96, 168, 248]);
        drawMap();
        drawPlayer();
        game.text(8, 8, 'Arrows: walk   Space: jump', game.WHITE, 12);
      }

      loadMap();
      game.run(update, draw);
check:
  game:
    frames: 100
    keys:
      - { key: right, from: 0, to: 100 }
      - { key: space, from: 25, to: 26 }
    expect: |
      (() => {
        const log = [];
        const original = game.sprite;
        game.sprite = (...args) => { log.push(args); return original(...args); };
        try { draw(); } finally { game.sprite = original; }
        const tiles = LEVEL.join('').replace(/[.P]/g, '').length;
        return player.onGround &&
          Math.abs(player.x - 86) < 2 &&
          Math.abs(player.y + player.h - 160) < 1 &&
          log.length >= tiles + 1;
      })()
    message: "Hold right and tap space once. The hero should run under the wooden platform, jump up THROUGH it, land on top of it (feet at y = 160), and then be stopped by the stone block at its right end (x = 86). Also drawMap must draw every tile of the map."
hints:
  - "Three jobs: drawMap loops over rows and columns and draws each tile; moveX stops the hero when the tile in front of it is solid; moveY lands on solid tiles (and on wooden ones, but only when coming from above)."
  - "drawMap: for (let row = 0; row < map.length; row++) { for (let col = 0; col < map[row].length; col++) { const art = tileArt(col, row); if (art) { game.sprite(col * TILE, row * TILE, art); } } }. moveX: find the column in front (right edge or left edge) and test solidAt(col, row) for each row the body covers. moveY: look at the row under the feet when falling, the row at the head when rising."
  - "moveX: if (player.vx > 0) { const col = Math.floor((player.x + player.w) / TILE); for (let row = top; row <= bottom; row++) { if (solidAt(col, row)) { player.x = col * TILE - player.w; break; } } } else if (player.vx < 0) { const col = Math.floor(player.x / TILE); ... player.x = (col + 1) * TILE; }   moveY: if (player.vy >= 0) { const row = Math.floor((player.y + player.h) / TILE); for (let col = left; col <= right; col++) { const wasAbove = oldBottom <= row * TILE + 0.01; if (solidAt(col, row) || (oneWayAt(col, row) && wasAbove)) { player.y = row * TILE - player.h; player.vy = 0; player.onGround = true; break; } } } else { const row = Math.floor(player.y / TILE); for (...) { if (solidAt(col, row)) { player.y = (row + 1) * TILE; player.vy = 0; break; } } }"
solution:
  - name: main.js
    code: |
      // Step 4: tiles and platforms.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;
      const GRAVITY = 900;
      const JUMP_SPEED = 320;
      const MAX_FALL = 500;

      let heroArt = game.art.warrior;

      // The map: one character per tile, 20 columns x 15 rows = exactly one screen.
      //   #  solid ground      S  solid stone      B  solid brick
      //   =  wooden platform (you can jump up through it and stand on it)
      //   .  empty air         P  where the player starts (removed when the map loads)
      const LEVEL = [
        '....................',
        '....................',
        '....................',
        '....................',
        '..............====..',
        '....................',
        '....................',
        '........====........',
        '....................',
        '......S.............',
        '..====.........BBB..',
        '..........SS........',
        '.P........SS........',
        '####################',
        '####################',
      ];

      let map = [];                    // the loaded map (without the P marker)

      const player = {
        x: 0, y: 0, w: 10, h: 18,
        vx: 0, vy: 0,
        facing: 1,
        onGround: false,
        animTime: 0,
      };

      // ---------- the map ----------

      // The character of the tile in column col, row row. Outside the map: the sides are walls.
      function charAt(col, row) {
        if (col < 0 || col >= map[0].length) { return 'S'; }
        if (row < 0 || row >= map.length) { return '.'; }
        return map[row][col];
      }

      // The tile under a pixel position (px, py).
      function tileAt(px, py) {
        return charAt(Math.floor(px / TILE), Math.floor(py / TILE));
      }

      // Solid tiles stop you from every side.
      function solidAt(col, row) {
        return '#SB'.includes(charAt(col, row));
      }

      // One-way platforms only hold you up from above.
      function oneWayAt(col, row) {
        return charAt(col, row) === '=';
      }

      // Copy LEVEL into map, and use the P marker to place the player.
      function loadMap() {
        map = [];
        for (let row = 0; row < LEVEL.length; row++) {
          let line = '';
          for (let col = 0; col < LEVEL[row].length; col++) {
            let ch = LEVEL[row][col];
            if (ch === 'P') {
              player.x = col * TILE + (TILE - player.w) / 2;     // centered in the tile
              player.y = (row + 1) * TILE - player.h;            // feet on the bottom of the tile
              ch = '.';
            }
            line += ch;
          }
          map.push(line);
        }
      }

      // Which picture belongs to the tile at (col, row)? Ground gets grass only on top.
      function tileArt(col, row) {
        const ch = charAt(col, row);
        if (ch === '#') { return solidAt(col, row - 1) ? game.art.tiles.dirt : game.art.tiles.grass; }
        if (ch === 'S') { return game.art.tiles.stone; }
        if (ch === 'B') { return game.art.tiles.brick; }
        if (ch === '=') { return game.art.tiles.wood; }
        return null;                                              // empty air: nothing to draw
      }

      function drawMap() {
        for (let row = 0; row < map.length; row++) {
          for (let col = 0; col < map[row].length; col++) {
            const art = tileArt(col, row);
            if (art) { game.sprite(col * TILE, row * TILE, art); }
          }
        }
      }

      // ---------- moving and colliding ----------

      // Move sideways, then push the hero out of any solid tile we ran into.
      function moveX(dt) {
        player.x += player.vx * dt;
        const top = Math.floor(player.y / TILE);
        const bottom = Math.floor((player.y + player.h - 0.01) / TILE);
        if (player.vx > 0) {
          const col = Math.floor((player.x + player.w) / TILE);     // the column in front of the right edge
          for (let row = top; row <= bottom; row++) {
            if (solidAt(col, row)) { player.x = col * TILE - player.w; break; }
          }
        } else if (player.vx < 0) {
          const col = Math.floor(player.x / TILE);                  // the column in front of the left edge
          for (let row = top; row <= bottom; row++) {
            if (solidAt(col, row)) { player.x = (col + 1) * TILE; break; }
          }
        }
      }

      // Move up or down, then land on a floor or bump into a ceiling.
      function moveY(dt) {
        const oldBottom = player.y + player.h;
        player.y += player.vy * dt;
        player.onGround = false;
        const left = Math.floor(player.x / TILE);
        const right = Math.floor((player.x + player.w - 0.01) / TILE);

        if (player.vy >= 0) {
          // falling (or standing): look at the row just under the feet
          const row = Math.floor((player.y + player.h) / TILE);
          for (let col = left; col <= right; col++) {
            const wasAbove = oldBottom <= row * TILE + 0.01;         // were the feet above the top of the tile?
            if (solidAt(col, row) || (oneWayAt(col, row) && wasAbove)) {
              player.y = row * TILE - player.h;
              player.vy = 0;
              player.onGround = true;
              break;
            }
          }
        } else {
          // going up: look at the row just above the head. Only solid tiles block, wood does not.
          const row = Math.floor(player.y / TILE);
          for (let col = left; col <= right; col++) {
            if (solidAt(col, row)) {
              player.y = (row + 1) * TILE;
              player.vy = 0;
              break;
            }
          }
        }
      }

      // ---------- the hero ----------

      function playerArt() {
        if (!player.onGround) { return heroArt.jump; }
        if (player.vx === 0) { return heroArt.idle; }
        const step = Math.floor(player.animTime / 0.15) % 2;
        return step === 0 ? heroArt.walk1 : heroArt.walk2;
      }

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
        if (game.keyPressed('space') && player.onGround) {
          player.vy = -JUMP_SPEED;
          player.onGround = false;
        }
      }

      function update(dt) {
        dt = Math.min(dt, 0.03);          // a slow frame must never move us a whole tile at once
        handleInput();
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        moveX(dt);
        moveY(dt);
        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
      }

      function drawPlayer() {
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0 });
      }

      function draw() {
        game.clear([96, 168, 248]);
        drawMap();
        drawPlayer();
        game.text(8, 8, 'Arrows: walk   Space: jump', game.WHITE, 12);
      }

      loadMap();
      game.run(update, draw);
quiz:
  - q: "How many pixels wide is a map with 60 columns of 16 pixel tiles?"
    options: ["60", "960", "76"]
    answer: 1
  - q: "How do we find the map column that contains the pixel position px?"
    options: ["Math.floor(px / TILE)", "px * TILE", "px % TILE"]
    answer: 0
    explain: "Dividing by the tile size gives a number like 5.7, and Math.floor turns it into column 5."
  - q: "Why do we move and test on X first, and then on Y, instead of both together?"
    options: ["It looks nicer", "JavaScript can only change one variable per line", "Then we always know which direction was blocked, so we can slide along a wall or land on a floor correctly"]
    answer: 2
  - q: "What makes a one-way wooden platform different from solid ground?"
    options: ["It is slippery", "You can jump up through it, and it only holds you up when you come from above", "It cannot be drawn with grass"]
    answer: 1
    explain: "In moveY, wood only counts as floor if the feet were above its top edge in the previous frame, and it never blocks the head."
---
## Where we are

The hero walks, animates and jumps, but the world is just a flat line, `FLOOR_Y`. Real adventures have hills, stone walls, bridges and ledges. The usual way to build such a world is a **tile map**: a grid of squares, where each square is one small picture, like a mosaic.

## What we add

1. A **map** written as text, one character per tile.
2. **Drawing** the map from tile pictures.
3. **Collision**: the hero cannot walk through solid tiles, lands on floors, bumps its head on ceilings, and can jump through wooden platforms.

This is the biggest step so far, so the starter already contains the map, the helper functions and `loadMap` (read their comments!). You write `drawMap`, `moveX` and `moveY`.

## The map

```js
const LEVEL = [
  '....................',
  '..====.........BBB..',
  '.P........SS........',
  '####################',
];
```

Each row is a string, each character is one 16 by 16 pixel tile: `#` ground, `S` stone, `B` brick, `=` a wooden platform you can stand on, `.` air, and `P` marks where the player starts. `loadMap` copies the map and removes the `P`. The helpers answer questions about it:

- `charAt(col, row)` is the tile character. Outside the map the sides count as walls.
- `solidAt(col, row)` is `true` for `#`, `S` and `B`.
- `oneWayAt(col, row)` is `true` for `=`.

To turn a pixel position into a tile column or row, divide by `TILE` and round down: `Math.floor(px / TILE)`.

## 1. Drawing

Loop over `map` with two nested loops (rows, then columns). `tileArt(col, row)` returns the picture for that tile, or `null` for air (it even picks grass for ground that has air above it and dirt below). Draw each picture at `x = col * TILE`, `y = row * TILE`.

## 2. Collision on X

Move first, then fix. After `player.x += player.vx * dt` the hero might be inside a wall. The hero covers a few rows, from `top` to `bottom`. When moving right, look at the column just past the **right edge**; when moving left, at the column of the **left edge**:

```js
const col = Math.floor((player.x + player.w) / TILE);
for (let row = top; row <= bottom; row++) {
  if (solidAt(col, row)) { player.x = col * TILE - player.w; break; }
}
```

The fix puts the hero exactly against the wall: its right edge touches the left side of that tile.

## 3. Collision on Y

The same idea, vertically. Falling (`vy >= 0`): look at the row **under the feet** for every column the hero covers (`left` to `right`). If it is solid, stand on it: `y = row * TILE - h`, `vy = 0`, `onGround = true`. Rising: look at the row **at the head**; a solid tile stops the jump (`y = (row + 1) * TILE`, `vy = 0`).

Wooden platforms are special. They never block you from below (we only test `solidAt` when rising), and from above they count as a floor, but only if the feet were **above its top edge before this move**. That is what `oldBottom <= row * TILE + 0.01` checks.

> **Watch out:**
> - Do X and Y **separately**, in that order. Mixing them makes the hero stick to walls or snag on floor corners.
> - `Math.floor` on negative numbers: `Math.floor(-0.5)` is `-1`. That is correct here, and `charAt` knows that the left side of the map is a wall.
> - If the hero falls through the floor, check that you reset `player.onGround = false` first and that you set `vy` to 0 when landing.
> - `TypeError: Cannot read properties of undefined (reading 'length')` means `map` is empty: `loadMap()` must run before `game.run`.

> **Your turn:** write the three TODOs. (1) `drawMap` draws every tile with `game.sprite`. (2) `moveX` stops the hero at solid tiles on both sides. (3) `moveY` lands the hero on solid tiles and on wooden platforms (only from above) and stops it at ceilings. Test: walk right, tap space under the wooden platform to jump up through it, and notice how the stone block next to it stops you.
