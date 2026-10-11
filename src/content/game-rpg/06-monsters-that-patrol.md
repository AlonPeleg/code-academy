---
title: "Step 6: Monsters that patrol"
summary: "Fill the map with slimes, mushrooms, skeletons and bats that walk back and forth, and make them hurt the hero with knockback, blinking and hearts."
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 6: monsters that patrol.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;
      const GRAVITY = 900;
      const JUMP_SPEED = 320;
      const MAX_FALL = 500;

      let heroArt = game.art.warrior;

      // The map is 60 columns wide (960 pixels) and 15 rows high.
      //   #  solid ground      S  solid stone      B  solid brick
      //   =  wooden platform (you can jump up through it and stand on it)
      //   .  empty air
      // Markers (removed when the map loads):
      //   P  where the player starts      s slime   m mushroom   k skeleton   b bat
      const LEVEL = [
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '...........====................=====........................',
        '.......................................BBBB......b..........',
        '...........................m................................',
        '.....====................=====...............BBBB.===....###',
        '...................##.............S.....##.............#####',
        '..P..........s...######.......s..SS...######...k.....#######',
        '############################################################',
        '############################################################',
      ];

      // ---------- the monsters ----------

      // One row per kind of monster. To add a new monster you only add a row here (and a marker letter below).
      //   hp, dmg (damage to the hero), xp, coins: for later steps    speed: pixels per second
      //   w, h: size of the hitbox    ox, oy: where the sprite starts, relative to the hitbox corner
      //   art: [frame A, frame B]     anim: seconds per animation frame     fly: true for flying monsters
      const MONSTERS = {
        slime:    { hp: 3, dmg: 1, xp: 4,  coins: 2, speed: 22, w: 14, h: 10, ox: -1, oy: -2, anim: 0.40, art: [game.art.slime.idle, game.art.slime.squish] },
        mushroom: { hp: 5, dmg: 1, xp: 8,  coins: 3, speed: 28, w: 12, h: 15, ox: -2, oy: -1, anim: 0.25, art: [game.art.mushroom.idle, game.art.mushroom.walk] },
        skeleton: { hp: 8, dmg: 2, xp: 14, coins: 5, speed: 36, w: 9,  h: 19, ox: -3, oy: 0,  anim: 0.25, art: [game.art.skeleton.idle, game.art.skeleton.walk] },
        bat:      { hp: 2, dmg: 1, xp: 6,  coins: 2, speed: 40, w: 16, h: 8,  ox: -2, oy: -1, anim: 0.12, art: [game.art.bat.up, game.art.bat.down], fly: true, range: 40 },
      };

      // Which marker letter on the map spawns which monster.
      const MARKERS = { s: 'slime', m: 'mushroom', k: 'skeleton', b: 'bat' };

      let monsters = [];               // every monster of the current map
      let state = 'playing';           // 'playing' or 'dead'

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
        hp: 5, maxHp: 5,
        invincible: 0,    // seconds left of protection after being hit
        stun: 0,          // seconds left in which we cannot steer (knockback)
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

      // Copy LEVEL into map. Markers become monsters or the player start, and the tile becomes empty air.
      function loadMap() {
        map = [];
        monsters = [];
        for (let row = 0; row < LEVEL.length; row++) {
          let line = '';
          for (let col = 0; col < LEVEL[row].length; col++) {
            let ch = LEVEL[row][col];
            if (ch === 'P') {
              player.x = col * TILE + (TILE - player.w) / 2;     // centered in the tile
              player.y = (row + 1) * TILE - player.h;            // feet on the bottom of the tile
              ch = '.';
            }
            // 1. TODO: add  else if (MARKERS[ch]) { ... }  here. Inside: call
            //    spawnMonster(MARKERS[ch], col, row) and set ch = '.' (the marker becomes empty air).

            line += ch;
          }
          map.push(line);
        }
        mapW = map[0].length * TILE;
        mapH = map.length * TILE;
        player.hp = player.maxHp;
        player.vx = 0;
        player.vy = 0;
        player.invincible = 0;
        player.stun = 0;
        state = 'playing';
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

      // ---------- monsters ----------

      // Create one monster standing in the tile (col, row). Flying monsters hang in the air instead.
      function spawnMonster(type, col, row) {
        const def = MONSTERS[type];
        const x = col * TILE + (TILE - def.w) / 2;                          // centered in the tile
        const y = def.fly ? row * TILE : (row + 1) * TILE - def.h;          // walkers stand on the tile bottom
        // 2. TODO: monsters.push({ ... }) with these fields:
        //    type, x, y, w: def.w, h: def.h, vx: def.speed, dir: 1, hp: def.hp, maxHp: def.hp,
        //    alive: true, hurt: 0, homeX: x, homeY: y, animTime: col * 0.1
      }

      // Is there a solid tile right in front of the monster if it stood at x?
      function wallAhead(m, x) {
        const col = Math.floor((m.dir > 0 ? x + m.w : x) / TILE);
        const top = Math.floor(m.y / TILE);
        const bottom = Math.floor((m.y + m.h - 0.01) / TILE);
        for (let row = top; row <= bottom; row++) {
          if (solidAt(col, row)) { return true; }
        }
        return false;
      }

      // Is there floor under the tile in front of the monster (so it will not walk off a ledge)?
      function groundAhead(m, x) {
        const col = Math.floor((m.dir > 0 ? x + m.w : x) / TILE);
        const row = Math.floor((m.y + m.h + 1) / TILE);
        return solidAt(col, row) || oneWayAt(col, row);
      }

      function updateMonster(m, dt) {
        const def = MONSTERS[m.type];
        m.animTime += dt;

        if (def.fly) {
          // flying: go back and forth around home, bobbing up and down
          if (m.x > m.homeX + def.range) { m.dir = -1; }
          if (m.x < m.homeX - def.range) { m.dir = 1; }
          m.vx = m.dir * def.speed;
          m.x += m.vx * dt;
          m.y = m.homeY + Math.sin(m.animTime * 3) * 8;
          return;
        }

        // 3. TODO: walking. Let nextX = m.x + m.vx * dt.
        //    If wallAhead(m, nextX) is true OR groundAhead(m, nextX) is false: turn around
        //    (m.dir = -m.dir and m.vx = m.dir * def.speed). Otherwise move: m.x = nextX.
      }

      function updateMonsters(dt) {
        for (const m of monsters) {
          if (m.alive) { updateMonster(m, dt); }
        }
      }

      function drawMonsters() {
        for (const m of monsters) {
          if (!m.alive) { continue; }
          const def = MONSTERS[m.type];
          // 4. TODO: frame = Math.floor(m.animTime / def.anim) % 2.
          //    Draw def.art[frame] with game.sprite at (m.x + def.ox, m.y + def.oy),
          //    mirrored when the monster walks left (m.dir < 0).
        }
      }

      // ---------- getting hurt ----------

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function hurtPlayer(m) {
        // 5. TODO: subtract the monster's damage (MONSTERS[m.type].dmg) from player.hp,
        //    set player.invincible = 1.2 and player.stun = 0.25.
        const monsterIsRight = m.x + m.w / 2 > player.x + player.w / 2;
        player.vx = monsterIsRight ? -110 : 110;                 // fly away from the monster
        player.vy = -170;
        player.onGround = false;
        if (player.hp <= 0) {
          player.hp = 0;
          state = 'dead';
        }
      }

      function checkMonsterHits() {
        // 5b. TODO: if player.invincible > 0 do nothing. Otherwise loop over monsters: for an alive one
        //     that touches the player (touching(player.x, player.y, player.w, player.h, m.x, m.y, m.w, m.h)),
        //     call hurtPlayer(m) and return.
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
        if (player.stun > 0) { return; }          // knocked back: no steering for a moment
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
        if (state === 'dead') {
          if (game.keyPressed('enter')) { loadMap(); }     // try again
          return;
        }
        handleInput();
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        moveX(dt);
        moveY(dt);
        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
        player.invincible = Math.max(0, player.invincible - dt);
        player.stun = Math.max(0, player.stun - dt);
        updateMonsters(dt);
        checkMonsterHits();
        updateCamera();
      }

      function drawPlayer() {
        // while invincible the hero blinks: every other 1/12 second it is almost see-through
        const blink = player.invincible > 0 && Math.floor(player.invincible * 12) % 2 === 0;
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0, alpha: blink ? 0.3 : 1 });
      }

      // The HUD (heads-up display) stays fixed on the screen, so it is drawn with the camera at (0, 0).
      function drawHud() {
        game.text(8, 6, 'Whispering Meadow', game.WHITE, 12);
        // 6. TODO: draw one heart (game.art.icons.heart) for every hit point up to player.maxHp,
        //    at x = 8 + i * 10 and y = 21. Hearts you have lost (i >= player.hp) are drawn see-through: set the alpha option to 0.25.
        const progress = (player.x + player.w / 2) / mapW;           // 0 at the left end, 1 at the right end
        game.rect(8, 34, 80, 4, [20, 30, 60]);
        game.rect(8, 34, 80 * progress, 4, game.YELLOW);
        if (state === 'dead') {
          game.rect(0, 90, game.WIDTH, 60, [0, 0, 0]);
          game.text(70, 100, 'You were defeated', game.RED, 20);
          game.text(88, 128, 'Press enter to try again', game.WHITE, 12);
        }
      }

      function draw() {
        drawBackground();                         // sky and hills, drawn in screen space
        game.camera(camera.x, camera.y);          // from here on, everything is shifted by the camera
        drawMap();
        drawMonsters();
        drawPlayer();
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      loadMap();
      game.run(update, draw);
check:
  game:
    frames: 240
    keys:
      - { key: right, from: 0, to: 240 }
    expect: |
      (() => {
        const sprites = [];
        const original = game.sprite;
        game.sprite = (...args) => { sprites.push(args); return original(...args); };
        try { draw(); } finally { game.sprite = original; }
        const monsterArts = [].concat(...Object.values(MONSTERS).map(def => def.art));
        const monsterSprites = sprites.filter(a => monsterArts.includes(a[2]));
        const hearts = sprites.filter(a => a[2] === game.art.icons.heart);
        return monsters.length === 5 &&
          monsters.some(m => m.dir === -1) &&
          player.hp < player.maxHp && player.hp > 0 &&
          monsterSprites.length === monsters.length &&
          monsterSprites.some(a => a[3] && a[3].flip === true) &&
          hearts.length === player.maxHp &&
          hearts.filter(a => a[3] && a[3].alpha < 1).length === player.maxHp - player.hp;
      })()
    message: "Walk right for four seconds. The map has 5 monster markers, so monsters must have 5 entries; at least one must already have turned around (dir -1) and be drawn mirrored; the hero must have been hurt (hp below maxHp but still above 0); and the HUD must draw one heart per maxHp, with the lost hearts see-through (alpha below 1)."
hints:
  - "Four jobs: spawn a monster from every marker letter on the map (spawnMonster + a branch in loadMap), let walkers turn around at walls and ledges, draw them with two animation frames and flip, and hurt the hero when they touch it."
  - "Spawn: monsters.push({ type, x, y, w: def.w, h: def.h, vx: def.speed, dir: 1, hp: def.hp, maxHp: def.hp, alive: true, hurt: 0, homeX: x, homeY: y, animTime: col * 0.1 }). In loadMap: else if (MARKERS[ch]) { spawnMonster(MARKERS[ch], col, row); ch = '.'; }. Patrol: const nextX = m.x + m.vx * dt; if (wallAhead(m, nextX) || !groundAhead(m, nextX)) { turn: m.dir = -m.dir; m.vx = m.dir * def.speed; } else { m.x = nextX; }"
  - "Draw: const frame = Math.floor(m.animTime / def.anim) % 2; game.sprite(m.x + def.ox, m.y + def.oy, def.art[frame], { flip: m.dir < 0 }). Hurt: player.hp -= MONSTERS[m.type].dmg; player.invincible = 1.2; player.stun = 0.25;  checkMonsterHits: if (player.invincible > 0) { return; } for (const m of monsters) { if (m.alive && touching(player.x, player.y, player.w, player.h, m.x, m.y, m.w, m.h)) { hurtPlayer(m); return; } }  Hearts: for (let i = 0; i < player.maxHp; i++) { game.sprite(8 + i * 10, 21, game.art.icons.heart, { alpha: i < player.hp ? 1 : 0.25 }); }"
solution:
  - name: main.js
    code: |
      // Step 6: monsters that patrol.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const WALK_SPEED = 90;
      const GRAVITY = 900;
      const JUMP_SPEED = 320;
      const MAX_FALL = 500;

      let heroArt = game.art.warrior;

      // The map is 60 columns wide (960 pixels) and 15 rows high.
      //   #  solid ground      S  solid stone      B  solid brick
      //   =  wooden platform (you can jump up through it and stand on it)
      //   .  empty air
      // Markers (removed when the map loads):
      //   P  where the player starts      s slime   m mushroom   k skeleton   b bat
      const LEVEL = [
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '............................................................',
        '...........====................=====........................',
        '.......................................BBBB......b..........',
        '...........................m................................',
        '.....====................=====...............BBBB.===....###',
        '...................##.............S.....##.............#####',
        '..P..........s...######.......s..SS...######...k.....#######',
        '############################################################',
        '############################################################',
      ];

      // ---------- the monsters ----------

      // One row per kind of monster. To add a new monster you only add a row here (and a marker letter below).
      //   hp, dmg (damage to the hero), xp, coins: for later steps    speed: pixels per second
      //   w, h: size of the hitbox    ox, oy: where the sprite starts, relative to the hitbox corner
      //   art: [frame A, frame B]     anim: seconds per animation frame     fly: true for flying monsters
      const MONSTERS = {
        slime:    { hp: 3, dmg: 1, xp: 4,  coins: 2, speed: 22, w: 14, h: 10, ox: -1, oy: -2, anim: 0.40, art: [game.art.slime.idle, game.art.slime.squish] },
        mushroom: { hp: 5, dmg: 1, xp: 8,  coins: 3, speed: 28, w: 12, h: 15, ox: -2, oy: -1, anim: 0.25, art: [game.art.mushroom.idle, game.art.mushroom.walk] },
        skeleton: { hp: 8, dmg: 2, xp: 14, coins: 5, speed: 36, w: 9,  h: 19, ox: -3, oy: 0,  anim: 0.25, art: [game.art.skeleton.idle, game.art.skeleton.walk] },
        bat:      { hp: 2, dmg: 1, xp: 6,  coins: 2, speed: 40, w: 16, h: 8,  ox: -2, oy: -1, anim: 0.12, art: [game.art.bat.up, game.art.bat.down], fly: true, range: 40 },
      };

      // Which marker letter on the map spawns which monster.
      const MARKERS = { s: 'slime', m: 'mushroom', k: 'skeleton', b: 'bat' };

      let monsters = [];               // every monster of the current map
      let state = 'playing';           // 'playing' or 'dead'

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
        hp: 5, maxHp: 5,
        invincible: 0,    // seconds left of protection after being hit
        stun: 0,          // seconds left in which we cannot steer (knockback)
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

      // Copy LEVEL into map. Markers become monsters or the player start, and the tile becomes empty air.
      function loadMap() {
        map = [];
        monsters = [];
        for (let row = 0; row < LEVEL.length; row++) {
          let line = '';
          for (let col = 0; col < LEVEL[row].length; col++) {
            let ch = LEVEL[row][col];
            if (ch === 'P') {
              player.x = col * TILE + (TILE - player.w) / 2;     // centered in the tile
              player.y = (row + 1) * TILE - player.h;            // feet on the bottom of the tile
              ch = '.';
            } else if (MARKERS[ch]) {
              spawnMonster(MARKERS[ch], col, row);
              ch = '.';
            }
            line += ch;
          }
          map.push(line);
        }
        mapW = map[0].length * TILE;
        mapH = map.length * TILE;
        player.hp = player.maxHp;
        player.vx = 0;
        player.vy = 0;
        player.invincible = 0;
        player.stun = 0;
        state = 'playing';
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

      // ---------- monsters ----------

      // Create one monster standing in the tile (col, row). Flying monsters hang in the air instead.
      function spawnMonster(type, col, row) {
        const def = MONSTERS[type];
        const x = col * TILE + (TILE - def.w) / 2;
        const y = def.fly ? row * TILE : (row + 1) * TILE - def.h;
        monsters.push({
          type, x, y, w: def.w, h: def.h,
          vx: def.speed, dir: 1,
          hp: def.hp, maxHp: def.hp, alive: true, hurt: 0,
          homeX: x, homeY: y,           // where it was born (flying monsters circle around this)
          animTime: col * 0.1,          // a different start for every monster, so they do not move in sync
        });
      }

      // Is there a solid tile right in front of the monster if it stood at x?
      function wallAhead(m, x) {
        const col = Math.floor((m.dir > 0 ? x + m.w : x) / TILE);
        const top = Math.floor(m.y / TILE);
        const bottom = Math.floor((m.y + m.h - 0.01) / TILE);
        for (let row = top; row <= bottom; row++) {
          if (solidAt(col, row)) { return true; }
        }
        return false;
      }

      // Is there floor under the tile in front of the monster (so it will not walk off a ledge)?
      function groundAhead(m, x) {
        const col = Math.floor((m.dir > 0 ? x + m.w : x) / TILE);
        const row = Math.floor((m.y + m.h + 1) / TILE);
        return solidAt(col, row) || oneWayAt(col, row);
      }

      function updateMonster(m, dt) {
        const def = MONSTERS[m.type];
        m.animTime += dt;

        if (def.fly) {
          // flying: go back and forth around home, bobbing up and down
          if (m.x > m.homeX + def.range) { m.dir = -1; }
          if (m.x < m.homeX - def.range) { m.dir = 1; }
          m.vx = m.dir * def.speed;
          m.x += m.vx * dt;
          m.y = m.homeY + Math.sin(m.animTime * 3) * 8;
          return;
        }

        // walking: look where the next step goes. Wall or ledge ahead? Turn around instead of stepping.
        const nextX = m.x + m.vx * dt;
        if (wallAhead(m, nextX) || !groundAhead(m, nextX)) {
          m.dir = -m.dir;
          m.vx = m.dir * def.speed;
        } else {
          m.x = nextX;
        }
      }

      function updateMonsters(dt) {
        for (const m of monsters) {
          if (m.alive) { updateMonster(m, dt); }
        }
      }

      function drawMonsters() {
        for (const m of monsters) {
          if (!m.alive) { continue; }
          const def = MONSTERS[m.type];
          const frame = Math.floor(m.animTime / def.anim) % 2;         // 0, 1, 0, 1, ...
          game.sprite(m.x + def.ox, m.y + def.oy, def.art[frame], { flip: m.dir < 0 });
        }
      }

      // ---------- getting hurt ----------

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function hurtPlayer(m) {
        player.hp -= MONSTERS[m.type].dmg;
        player.invincible = 1.2;                                 // no more damage for 1.2 seconds
        player.stun = 0.25;                                      // knockback: we cannot steer for a moment
        const monsterIsRight = m.x + m.w / 2 > player.x + player.w / 2;
        player.vx = monsterIsRight ? -110 : 110;                 // fly away from the monster
        player.vy = -170;
        player.onGround = false;
        if (player.hp <= 0) {
          player.hp = 0;
          state = 'dead';
        }
      }

      function checkMonsterHits() {
        if (player.invincible > 0) { return; }
        for (const m of monsters) {
          if (m.alive && touching(player.x, player.y, player.w, player.h, m.x, m.y, m.w, m.h)) {
            hurtPlayer(m);
            return;                                              // one hit per frame is enough
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
        if (player.stun > 0) { return; }          // knocked back: no steering for a moment
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
        if (state === 'dead') {
          if (game.keyPressed('enter')) { loadMap(); }     // try again
          return;
        }
        handleInput();
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        moveX(dt);
        moveY(dt);
        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
        player.invincible = Math.max(0, player.invincible - dt);
        player.stun = Math.max(0, player.stun - dt);
        updateMonsters(dt);
        checkMonsterHits();
        updateCamera();
      }

      function drawPlayer() {
        // while invincible the hero blinks: every other 1/12 second it is almost see-through
        const blink = player.invincible > 0 && Math.floor(player.invincible * 12) % 2 === 0;
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0, alpha: blink ? 0.3 : 1 });
      }

      // The HUD (heads-up display) stays fixed on the screen, so it is drawn with the camera at (0, 0).
      function drawHud() {
        game.text(8, 6, 'Whispering Meadow', game.WHITE, 12);
        for (let i = 0; i < player.maxHp; i++) {                     // one heart per hit point
          game.sprite(8 + i * 10, 21, game.art.icons.heart, { alpha: i < player.hp ? 1 : 0.25 });
        }
        const progress = (player.x + player.w / 2) / mapW;           // 0 at the left end, 1 at the right end
        game.rect(8, 34, 80, 4, [20, 30, 60]);
        game.rect(8, 34, 80 * progress, 4, game.YELLOW);
        if (state === 'dead') {
          game.rect(0, 90, game.WIDTH, 60, [0, 0, 0]);
          game.text(70, 100, 'You were defeated', game.RED, 20);
          game.text(88, 128, 'Press enter to try again', game.WHITE, 12);
        }
      }

      function draw() {
        drawBackground();                         // sky and hills, drawn in screen space
        game.camera(camera.x, camera.y);          // from here on, everything is shifted by the camera
        drawMap();
        drawMonsters();
        drawPlayer();
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      loadMap();
      game.run(update, draw);
quiz:
  - q: "Why keep all monster stats in one MONSTERS table instead of writing code for each monster?"
    options: ["It makes the game run faster", "The same code works for every kind, and adding a new monster is just adding a row of data", "JavaScript does not allow several monsters"]
    answer: 1
  - q: "How does a walking monster decide to turn around?"
    options: ["It turns around at random times", "It turns when the hero is far away", "It checks the next position: if there is a wall in front of it or no floor under the tile in front of it, it reverses its direction"]
    answer: 2
  - q: "Why does the hero get an invincibility timer after being hit?"
    options: ["Otherwise the monster would hurt it again on every single frame it overlaps, so the hearts would vanish in a fraction of a second", "To make the hero faster", "To remove the monster"]
    answer: 0
    explain: "At 60 frames per second a touching monster would deal damage 60 times per second. The 1.2 second protection, shown by blinking, gives the player time to escape."
  - q: "The art faces right. Which option draws a monster that walks left?"
    options: ["{ scale: -1 }", "{ flip: m.dir < 0 }", "{ alpha: 0 }"]
    answer: 1
---
## Where we are

The hero can run through a wide scrolling world of hills and platforms, with a camera that follows it. The map in the starter now contains letters you have not seen: `s`, `m`, `k` and `b`. They are **markers**. They tell the game where to put monsters, just like `P` tells it where the hero starts. At the moment they are ignored, and the level feels empty. Time to bring it to life.

## What we add

1. A **data table** `MONSTERS` that describes every kind of monster.
2. **Spawning** a monster for each marker when the map loads.
3. **Patrol AI**: walk back and forth, turn at walls and ledges.
4. **Animation** and **flipping** by direction.
5. **Danger**: touching a monster costs hit points, with knockback, a blinking invincibility time and hearts on the HUD.

## The table and the markers

Look at `MONSTERS` in the starter. Each row says how many hit points (`hp`), how much `dmg` a touch does, how fast it moves, how big its **hitbox** is (`w`, `h`), where to draw its sprite relative to that hitbox (`ox`, `oy`, the same trick as the hero's `-3, -2`), and the two `art` frames. `hp`, `xp` and `coins` are for later steps. `MARKERS` maps a letter on the map to a row of the table. This is **data-driven** design: the code below works for every monster, and a new monster is just a new row.

## 1. Spawning

In `loadMap`, a marker letter must become a monster and then turn into air. Next to the `P` branch you write something like:

```js
else if (MARKERS[ch]) {
  spawnMonster(MARKERS[ch], col, row);
  ch = '.';
}
```

`spawnMonster` looks up `def = MONSTERS[type]` and pushes an object with the fields `type, x, y, w, h, vx, dir, hp, maxHp, alive, hurt` plus `homeX`, `homeY` (birth place, used by bats) and `animTime`. It starts walking right (`dir: 1`, `vx: def.speed`). The `x` and `y` are already worked out for you.

## 2. Patrolling

Each frame a walker peeks at where its next step would go. The helpers `wallAhead(m, x)` and `groundAhead(m, x)` are already written: the first looks for a solid tile in front of the monster, the second for a floor under the tile in front. When there is a wall **or no floor**, it turns around instead of stepping. That one rule keeps slimes in their valley, makes the mushroom pace along its wooden platform without falling off, and lets the skeleton guard the space between two hills. Turning means `m.dir = -m.dir` and `m.vx = m.dir * def.speed`.

## 3. Drawing

The animation is the trick from step 2: `Math.floor(m.animTime / def.anim) % 2` gives 0, 1, 0, 1. Pick `def.art[frame]`. Because all art faces right, mirror it with `{ flip: m.dir < 0 }`.

## 4. Getting hurt

When the hero's hitbox overlaps a living monster (`touching(...)` is ready for you), `hurtPlayer` subtracts the damage and starts two timers: `invincible` (1.2 seconds in which nothing hurts, shown by the blinking sprite) and `stun` (0.25 seconds of knockback in which the keys are ignored). The rest, pushing the hero away and the game over screen when hp reaches 0 (press `enter` to try again), is already in place. Finally the HUD draws one heart per hit point, and a lost heart is drawn with `alpha: 0.25`.

> **Watch out:**
> - Without invincibility one touch drains all your hearts in a split second.
> - A monster that falls through the floor or walks off a ledge usually means the ledge check uses the wrong tile: it must look at the tile **in front** and **below** the feet.
> - `TypeError: Cannot read properties of undefined (reading 'art')` means `MONSTERS[m.type]` has no such type, often a typo in `type`.
> - If monsters move in perfect sync, use a different `animTime` start for each (we use `col * 0.1`).

> **Your turn:** complete the TODOs. (1) Spawn a monster for each marker in `loadMap` and fill in `spawnMonster`. (2) Make walking monsters turn at walls and ledges. (3) Draw the monsters with their two frames, mirrored when walking left. (4) Hurt the hero in `checkMonsterHits` / `hurtPlayer`. (5) Draw one heart per hit point, with lost hearts see-through. Then play: dodge the slimes, jump over the skeleton, and reach the end of the map! In the next steps you will learn to fight back.
