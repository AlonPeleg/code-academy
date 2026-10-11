---
title: "Step 5: A scrolling camera"
summary: "Make the map three times wider than the screen and follow the hero with a camera, with parallax hills and clouds and a HUD that stays put."
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 5: a scrolling camera.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;
      const GRAVITY = 900;
      const JUMP_SPEED = 320;
      const MAX_FALL = 500;

      let heroArt = game.art.warrior;

      // The map is now 60 columns wide (960 pixels) and 15 rows high, so only part of it fits on the screen.
      //   #  solid ground      S  solid stone      B  solid brick
      //   =  wooden platform (you can jump up through it and stand on it)
      //   .  empty air         P  where the player starts (removed when the map loads)
      const LEVEL = [
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '...........====................=====........................',
        '.......................................BBBB.................',
        '............................................................',
        '.....====................=====...............BBBB.===....###',
        '...................##.............S.....##.............#####',
        '..P..............######..........SS...######.........#######',
        '############################################################',
        '############################################################',
      ];

      let map = [];                    // the loaded map (without the P marker)
      let mapW = 0;                    // map size in pixels
      let mapH = 0;
      const camera = { x: 0, y: 0 };   // the world point shown in the top-left corner of the screen

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
        mapW = map[0].length * TILE;
        mapH = map.length * TILE;
        updateCamera();
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
        // 4. TODO: the map has 900 tiles but only about 300 are on the screen. Instead of looping over
        //    everything, start at the column under the left screen edge (camera.x divided by TILE, rounded
        //    down with Math.floor) and stop at the column under the right edge ((camera.x + game.WIDTH)
        //    divided by TILE). Do the same for rows with camera.y and game.HEIGHT. Keep the numbers inside
        //    the map with Math.max(0, ...) and Math.min(map.length - 1, ...).
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

      // ---------- the camera ----------

      function clamp(value, low, high) {
        return Math.max(low, Math.min(high, value));
      }

      // Center the camera on the hero, but never show anything outside the map.
      function updateCamera() {
        // 1. TODO: wantX = the hero's center x minus half the screen width (game.WIDTH / 2).
        //    wantY = the same for y with game.HEIGHT.
        //    Then set camera.x = Math.round(clamp(wantX, 0, Math.max(0, mapW - game.WIDTH)))
        //    and camera.y in the same way with wantY, mapH and game.HEIGHT.
      }

      // ---------- the background (parallax) ----------

      const SKY = [96, 168, 248];
      const CLOUDS = [{ x: 20, y: 30 }, { x: 150, y: 56 }, { x: 270, y: 24 }];
      const HILLS_FAR = [{ x: 40, r: 64 }, { x: 190, r: 80 }, { x: 330, r: 56 }];
      const HILLS_NEAR = [{ x: 90, r: 48 }, { x: 260, r: 56 }];

      // Where on the screen is a background object? 'factor' says how fast its layer scrolls:
      // 0 = glued to the sky, 1 = moves like the ground. The % makes the layer repeat every 'span' pixels.
      function layerX(worldX, factor, span) {
        // 2. TODO: let x = worldX - camera.x * factor. Return ((x % span) + span) % span - 60.
        //    (The "+ span) % span" part keeps the result positive; the - 60 lets things slide in from the left.)
        return worldX;
      }

      function drawCloud(x, y) {
        const white = [250, 250, 255];
        game.circle(x, y, 9, white);
        game.circle(x + 12, y - 5, 12, white);
        game.circle(x + 26, y, 9, white);
        game.rect(x, y, 26, 9, white);
      }

      function drawBackground() {
        game.clear(SKY);
        for (const c of CLOUDS) { drawCloud(layerX(c.x, 0.1, 380), c.y); }
        for (const h of HILLS_FAR) { game.circle(layerX(h.x, 0.25, 440), 216, h.r, [120, 170, 190]); }
        for (const h of HILLS_NEAR) { game.circle(layerX(h.x, 0.5, 400), 224, h.r, [70, 150, 110]); }
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
        updateCamera();
      }

      function drawPlayer() {
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0 });
      }

      // The HUD (heads-up display) stays fixed on the screen, so it is drawn with the camera at (0, 0).
      function drawHud() {
        game.text(8, 6, 'Whispering Meadow', game.WHITE, 12);
        const progress = (player.x + player.w / 2) / mapW;           // 0 at the left end, 1 at the right end
        game.rect(8, 22, 80, 4, [20, 30, 60]);
        game.rect(8, 22, 80 * progress, 4, game.YELLOW);
      }

      function draw() {
        drawBackground();                         // sky and hills, drawn in screen space
        // 3. TODO: call game.camera here with camera.x and camera.y, so the map and the hero scroll...
        drawMap();
        drawPlayer();
        // 3b. TODO: ...and call game.camera here again with 0 and 0, so the HUD stays fixed on the screen.
        drawHud();
      }

      loadMap();
      game.run(update, draw);
check:
  game:
    frames: 140
    keys:
      - { key: right, from: 0, to: 140 }
    expect: |
      (() => {
        const sprites = [];
        const cameras = [];
        const originalSprite = game.sprite;
        const originalCamera = game.camera;
        game.sprite = (...args) => { sprites.push(args); return originalSprite(...args); };
        game.camera = (...args) => { cameras.push(args); return originalCamera(...args); };
        try { draw(); } finally { game.sprite = originalSprite; game.camera = originalCamera; }
        const last = cameras[cameras.length - 1];
        return camera.y === 0 && camera.x > 50 &&
          Math.abs(camera.x - Math.round(player.x + player.w / 2 - game.WIDTH / 2)) <= 2 &&
          Math.abs(layerX(100, 0.5, 400) - (100 - camera.x * 0.5 - 60)) < 0.5 &&
          cameras.length >= 2 && cameras[0][0] === camera.x && cameras[0][1] === camera.y &&
          last[0] === 0 && last[1] === 0 &&
          sprites.length < 120;
      })()
    message: "After walking right for a while the camera should be centered on the hero (camera.x = hero center minus 160), the parallax function layerX must follow its formula, draw() must call game.camera(camera.x, camera.y) first and game.camera(0, 0) at the end, and drawMap should draw only the tiles that are on the screen."
hints:
  - "The camera is the world point that appears in the top-left corner of the screen. To center the hero, that point is the hero's center minus half of the screen. Then clamp it so it never leaves the map."
  - "updateCamera: wantX = player.x + player.w / 2 - game.WIDTH / 2, then camera.x = Math.round(clamp(wantX, 0, Math.max(0, mapW - game.WIDTH))); the same for y with HEIGHT and mapH. In draw: game.camera(camera.x, camera.y) before the map and the hero, game.camera(0, 0) before the HUD. layerX: ((x % span) + span) % span - 60 where x = worldX - camera.x * factor."
  - "drawMap: const firstCol = Math.max(0, Math.floor(camera.x / TILE)); const lastCol = Math.min(map[0].length - 1, Math.floor((camera.x + game.WIDTH) / TILE)); the same for rows with camera.y and game.HEIGHT, then loop row from firstRow to lastRow and col from firstCol to lastCol."
solution:
  - name: main.js
    code: |
      // Step 5: a scrolling camera.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;
      const GRAVITY = 900;
      const JUMP_SPEED = 320;
      const MAX_FALL = 500;

      let heroArt = game.art.warrior;

      // The map is now 60 columns wide (960 pixels) and 15 rows high, so only part of it fits on the screen.
      //   #  solid ground      S  solid stone      B  solid brick
      //   =  wooden platform (you can jump up through it and stand on it)
      //   .  empty air         P  where the player starts (removed when the map loads)
      const LEVEL = [
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '...........====................=====........................',
        '.......................................BBBB.................',
        '............................................................',
        '.....====................=====...............BBBB.===....###',
        '...................##.............S.....##.............#####',
        '..P..............######..........SS...######.........#######',
        '############################################################',
        '############################################################',
      ];

      let map = [];                    // the loaded map (without the P marker)
      let mapW = 0;                    // map size in pixels
      let mapH = 0;
      const camera = { x: 0, y: 0 };   // the world point shown in the top-left corner of the screen

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
        mapW = map[0].length * TILE;
        mapH = map.length * TILE;
        updateCamera();
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

      // Draw only the tiles that are on the screen (there are 900 tiles in the map, but only about 300 in view).
      function drawMap() {
        const firstCol = Math.max(0, Math.floor(camera.x / TILE));
        const lastCol = Math.min(map[0].length - 1, Math.floor((camera.x + game.WIDTH) / TILE));
        const firstRow = Math.max(0, Math.floor(camera.y / TILE));
        const lastRow = Math.min(map.length - 1, Math.floor((camera.y + game.HEIGHT) / TILE));
        for (let row = firstRow; row <= lastRow; row++) {
          for (let col = firstCol; col <= lastCol; col++) {
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

      // ---------- the camera ----------

      function clamp(value, low, high) {
        return Math.max(low, Math.min(high, value));
      }

      // Center the camera on the hero, but never show anything outside the map.
      function updateCamera() {
        const wantX = player.x + player.w / 2 - game.WIDTH / 2;
        const wantY = player.y + player.h / 2 - game.HEIGHT / 2;
        camera.x = Math.round(clamp(wantX, 0, Math.max(0, mapW - game.WIDTH)));
        camera.y = Math.round(clamp(wantY, 0, Math.max(0, mapH - game.HEIGHT)));
      }

      // ---------- the background (parallax) ----------

      const SKY = [96, 168, 248];
      const CLOUDS = [{ x: 20, y: 30 }, { x: 150, y: 56 }, { x: 270, y: 24 }];
      const HILLS_FAR = [{ x: 40, r: 64 }, { x: 190, r: 80 }, { x: 330, r: 56 }];
      const HILLS_NEAR = [{ x: 90, r: 48 }, { x: 260, r: 56 }];

      // Where on the screen is a background object? 'factor' says how fast its layer scrolls:
      // 0 = glued to the sky, 1 = moves like the ground. The % makes the layer repeat every 'span' pixels.
      function layerX(worldX, factor, span) {
        const x = worldX - camera.x * factor;
        return ((x % span) + span) % span - 60;
      }

      function drawCloud(x, y) {
        const white = [250, 250, 255];
        game.circle(x, y, 9, white);
        game.circle(x + 12, y - 5, 12, white);
        game.circle(x + 26, y, 9, white);
        game.rect(x, y, 26, 9, white);
      }

      function drawBackground() {
        game.clear(SKY);
        for (const c of CLOUDS) { drawCloud(layerX(c.x, 0.1, 380), c.y); }
        for (const h of HILLS_FAR) { game.circle(layerX(h.x, 0.25, 440), 216, h.r, [120, 170, 190]); }
        for (const h of HILLS_NEAR) { game.circle(layerX(h.x, 0.5, 400), 224, h.r, [70, 150, 110]); }
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
        updateCamera();
      }

      function drawPlayer() {
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0 });
      }

      // The HUD (heads-up display) stays fixed on the screen, so it is drawn with the camera at (0, 0).
      function drawHud() {
        game.text(8, 6, 'Whispering Meadow', game.WHITE, 12);
        const progress = (player.x + player.w / 2) / mapW;           // 0 at the left end, 1 at the right end
        game.rect(8, 22, 80, 4, [20, 30, 60]);
        game.rect(8, 22, 80 * progress, 4, game.YELLOW);
      }

      function draw() {
        drawBackground();                         // sky and hills, drawn in screen space
        game.camera(camera.x, camera.y);          // from here on, everything is shifted by the camera
        drawMap();
        drawPlayer();
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      loadMap();
      game.run(update, draw);
quiz:
  - q: "What does game.camera(100, 0) do to everything drawn afterwards?"
    options: ["Moves it 100 pixels to the right", "Shifts it so the world point (100, 0) is at the top-left of the screen", "Zooms in by 100 percent"]
    answer: 1
    explain: "A world object at x = 100 is drawn at screen x = 0, an object at x = 150 at screen x = 50, and so on."
  - q: "Why do we clamp the camera to the map?"
    options: ["So it never shows the empty space outside the map", "To make the hero run faster", "Because negative numbers are not allowed in JavaScript"]
    answer: 0
  - q: "In a parallax background, which layer should scroll more slowly with the camera?"
    options: ["The layer closest to the player", "All layers scroll at exactly the same speed", "The layer that is far away, like distant hills"]
    answer: 2
    explain: "Far things appear to move slowly, like mountains from a car window. A factor of 0.25 means it moves a quarter as fast as the ground."
  - q: "Why do we call game.camera(0, 0) before drawing the HUD?"
    options: ["So the hearts and text stay fixed on the screen instead of scrolling away with the world", "Otherwise the engine crashes", "It resets the score"]
    answer: 0
---
## Where we are

The hero can run and jump through a tile world with walls, floors and wooden platforms. But the world was exactly one screen big (20 tiles wide). Real side-scrollers have long levels, so now we make the map **60 tiles wide, 960 pixels**, three screens wide. If you run the starter you will see the problem at once: the hero walks off the right side and disappears, and the rest of the map is never shown.

## What we add

A **camera** that follows the hero, in three parts:

1. The camera position, kept inside the map.
2. `game.camera(x, y)`, which does the scrolling.
3. A **parallax** background and a **HUD** that stay sensible while the world scrolls.

(The starter's `loadMap` already stores the map size in pixels in `mapW` and `mapH`, and the `camera` object exists.)

## World and screen coordinates

Everything in the game has a **world position**, such as "the hero is at x = 500". The screen only shows 320 pixels of it. The **camera** is the world point shown in the top-left corner of the screen. If `camera.x` is 400, a thing at world x = 500 appears at screen x = 100.

You do not need to subtract anything yourself. Call `game.camera(camera.x, camera.y)` and the engine shifts everything you draw afterwards. The camera resets to (0, 0) at the start of every `draw`, which is why we call it ourselves each frame:

```js
drawBackground();                       // sky and hills: drawn in screen space
game.camera(camera.x, camera.y);        // from now on we draw in world space
drawMap();
drawPlayer();
game.camera(0, 0);                      // back to screen space
drawHud();                              // the HUD never scrolls
```

## 1. Following the hero

To center the hero, the camera must be half a screen to the left of the hero's center:

```js
const wantX = player.x + player.w / 2 - game.WIDTH / 2;
```

At the very start (hero near the left edge) that number is negative, and at the far right it would show space beyond the map. So we **clamp** it between 0 and `mapW - game.WIDTH`. The `clamp(value, low, high)` helper is in the starter. Do the same for y with `mapH` and `game.HEIGHT` (our map is exactly one screen high, so `camera.y` stays 0, but later maps can be taller). Rounding with `Math.round` avoids a one pixel shimmer.

## 2. Parallax

Far-away things move slowly when you travel. We fake that with layers that scroll **slower than the ground**. Each layer has a `factor`: 1 would move with the ground and 0 would not move at all. Hills use 0.25 and 0.5, clouds 0.1. `layerX(worldX, factor, span)` returns where an object is on the screen, using `camera.x * factor`. The `%` (remainder) makes the layer repeat every `span` pixels, so the hills never run out. The extra `+ span) % span` keeps the result positive.

## 3. Draw only what you can see

The map has 900 tiles, but only a third of them are on the screen. Loop from the column under the left edge of the screen (`Math.floor(camera.x / TILE)`) to the column under the right edge. This keeps big maps fast.

> **Watch out:**
> - If you forget `game.camera(0, 0)` before the HUD, the hearts and text drift away as the hero walks.
> - If the camera is not clamped, the left edge of the level shows an empty blue stripe at the start.
> - Call `updateCamera()` **after** moving the hero, otherwise the camera lags one frame behind and the hero jitters.
> - `ReferenceError: mapW is not defined` means a typo, or that `loadMap` did not set it.

## Going further

Make the camera glide: instead of jumping to the target, move 10 percent of the distance each frame (`camera.x += (wantX - camera.x) * 0.1`). Or add a taller map and watch `camera.y` work.

> **Your turn:** complete the TODOs. (1) `updateCamera` centers the camera on the hero and clamps it to the map (x and y). (2) `layerX` returns `((x % span) + span) % span - 60` with `x = worldX - camera.x * factor`. (3) In `draw`, call `game.camera(camera.x, camera.y)` before the map and the hero, and `game.camera(0, 0)` before the HUD. (4) Make `drawMap` loop only over the visible columns and rows. Walk to the right and watch the hills slide slowly behind you.
