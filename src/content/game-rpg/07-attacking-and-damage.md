---
title: "Step 7: Attacking and damage"
summary: "Press z to swing at monsters: an attack hitbox, a cooldown, hit flashes, knockback, health bars and floating damage numbers."
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 7: attacking and damage.
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
      //   hp: hit points (now they matter: the hero can hurt them!)    dmg: damage to the hero
      //   xp, coins: for later steps    speed: pixels per second
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
      const floaters = [];             // little texts that float up and fade away (damage numbers)
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
        atk: 2,           // how much damage one hit does
        attackTimer: 0,   // seconds left of the attack animation
        cooldown: 0,      // seconds until we may attack again
      };

      // Attack numbers (in step 9 every class gets its own).
      const ATTACK_REACH = 22;         // how far in front of the hero a hit reaches (pixels)
      const ATTACK_TIME = 0.25;        // how long the attack animation lasts (seconds)
      const ATTACK_COOLDOWN = 0.4;     // how long we wait between two attacks (seconds)

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
        player.attackTimer = 0;
        player.cooldown = 0;
        floaters.length = 0;
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
          knock: 0,                     // sideways speed from being hit (it slides away and slows down)
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

      // A monster that was hit slides away from the blow. Walkers must not slide into walls or off ledges.
      function slideMonster(m, dt) {
        const def = MONSTERS[m.type];
        const nextX = m.x + m.knock * dt;
        const oldDir = m.dir;
        m.dir = m.knock > 0 ? 1 : -1;                   // wallAhead and groundAhead look in the direction m.dir
        const free = def.fly || (!wallAhead(m, nextX) && groundAhead(m, nextX));
        m.dir = oldDir;
        if (free) { m.x = nextX; }
        m.knock *= Math.max(0, 1 - 8 * dt);             // slow down
        if (m.hurt <= 0) { m.knock = 0; }
      }

      function updateMonster(m, dt) {
        const def = MONSTERS[m.type];
        m.animTime += dt;
        m.hurt = Math.max(0, m.hurt - dt);
        if (m.knock !== 0) { slideMonster(m, dt); }
        if (m.hurt > 0) { return; }                     // a monster that was just hit freezes for a moment

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

      // A white copy of a picture: every colored pixel becomes white. We use it for the "I was hit!" flash.
      const flashCache = new Map();
      function flashArt(art) {
        if (!flashCache.has(art)) {
          flashCache.set(art, art.map(row => row.replace(/[^. ]/g, 'W')));
        }
        return flashCache.get(art);
      }

      function drawMonsters() {
        for (const m of monsters) {
          if (!m.alive) { continue; }
          const def = MONSTERS[m.type];
          const frame = Math.floor(m.animTime / def.anim) % 2;         // 0, 1, 0, 1, ...
          // 1. TODO: the hit flash and the hp bar.
          //    let art = def.art[frame];  then  if (m.hurt > 0.15) { art = flashArt(art); }  (white for a moment after a hit)
          //    Draw art (instead of def.art[frame]) like before, and when m.hp < m.maxHp also call drawMonsterBar(m, def).
          game.sprite(m.x + def.ox, m.y + def.oy, def.art[frame], { flip: m.dir < 0 });
        }
      }

      // A small health bar over the monster's head: red background, green part = hp / maxHp.
      function drawMonsterBar(m, def) {
        // 1b. TODO: x = m.x + m.w / 2 - 8 (centered over the monster), y = m.y + def.oy - 5.
        //     Draw a black rect (x - 1, y - 1, 18, 4), a dark red rect (x, y, 16, 2), and on top a
        //     green rect (x, y, 16 * m.hp / m.maxHp, 2). Careful: m.hp can be below 0 for a moment, use Math.max(0, m.hp).
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

      // ---------- attacking ----------

      // The hero's attack hits this rectangle: right in front of the hero, a little taller than the hero.
      function attackBox() {
        const x = player.facing > 0 ? player.x + player.w : player.x - ATTACK_REACH;
        return { x, y: player.y - 2, w: ATTACK_REACH, h: player.h + 4 };
      }

      // Hurt one monster. fromX is where the blow came from, so the monster knows which way to slide.
      function damageMonster(m, dmg, fromX) {
        // 2. TODO: m.hp -= dmg;  m.hurt = 0.25;
        //    m.knock = 110 if the monster's middle (m.x + m.w / 2) is right of fromX, otherwise -110.
        //    addFloater(m.x + m.w / 2, m.y - 8, dmg, game.WHITE);
        //    and if m.hp <= 0 then m.alive = false.
      }

      // Hit every living monster that touches the box. Returns how many were hit.
      function hitMonsters(box, dmg) {
        let hits = 0;
        // 3. TODO: loop over monsters. For each alive one that touches(box.x, box.y, box.w, box.h, m.x, m.y, m.w, m.h):
        //    damageMonster(m, dmg, player.x + player.w / 2); hits++;
        return hits;
      }

      // Start an attack when z is held, the cooldown is over and we are not already swinging.
      function tryAttack() {
        if (!game.keyDown('z') || player.cooldown > 0) { return; }
        // 4. TODO: player.attackTimer = ATTACK_TIME;  player.cooldown = ATTACK_COOLDOWN;
        //    hitMonsters(attackBox(), player.atk);
      }

      // ---------- floating texts ----------

      // size and life are optional: if you leave them out, JavaScript uses these default values.
      function addFloater(x, y, text, color, size = 12, life = 0.9) {
        floaters.push({ x, y, text: String(text), color, size, age: 0, life });
      }

      function updateFloaters(dt) {
        // 5. TODO: for every floater: f.age += dt and f.y -= 30 * dt (it rises).
        //    Then remove the old ones: count i backwards from floaters.length - 1 down to 0 and
        //    floaters.splice(i, 1) when floaters[i].age >= floaters[i].life.
      }

      function drawFloaters() {
        // 5b. TODO: for every floater: game.alpha(1 - f.age / f.life), then game.text(...) at (x, f.y) in f.color with f.size,
        //     where x = f.x - f.text.length * f.size * 0.3 centers it roughly. Draw a black copy 1 pixel lower-right first (a shadow).
        //     After the loop call game.alpha(1) so the next things are solid again.
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
        // 6. TODO: while player.attackTimer > 0, return heroArt.attack (it comes before the jump check).
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
        tryAttack();
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        moveX(dt);
        moveY(dt);
        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
        player.invincible = Math.max(0, player.invincible - dt);
        player.stun = Math.max(0, player.stun - dt);
        // 7. TODO: count player.attackTimer and player.cooldown down by dt, but never below 0 (like invincible and stun).
        updateFloaters(dt);
        updateMonsters(dt);
        checkMonsterHits();
        updateCamera();
      }

      function drawPlayer() {
        // while invincible the hero blinks: every other 1/12 second it is almost see-through
        const blink = player.invincible > 0 && Math.floor(player.invincible * 12) % 2 === 0;
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0, alpha: blink ? 0.3 : 1 });
        if (player.attackTimer > 0) {
          // a slash picture in front of the hero that fades away during the attack
          const x = player.facing > 0 ? player.x + player.w + 1 : player.x - 17;
          game.sprite(x, player.y + 1, game.art.icons.slash, { flip: player.facing < 0, scale: 2, alpha: player.attackTimer / ATTACK_TIME });
        }
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
        drawFloaters();                           // damage numbers are in the world, so they scroll with it
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      loadMap();
      game.run(update, draw);
check:
  game:
    frames: 600
    keys:
      - { key: right, from: 0, to: 60 }
      - { key: z, from: 0, to: 600 }
    expect: |
      (() => {
        // 1. the scripted hero fought a slime and won
        if (!monsters.some(m => m.type === 'slime' && !m.alive)) { return false; }
        // 2. test hitMonsters directly on a fresh mushroom
        const target = monsters.find(m => m.type === 'mushroom' && m.alive);
        const hp0 = target.hp, floaters0 = floaters.length;
        const n = hitMonsters({ x: target.x - 2, y: target.y - 2, w: target.w + 4, h: target.h + 4 }, 1);
        if (n < 1 || target.hp !== hp0 - 1 || !(target.hurt > 0) || target.knock === 0 || floaters.length <= floaters0) { return false; }
        // 3. the picture: attack frame, white flash, hp bar
        const sprites = [], rects = [], alphas = [];
        const s0 = game.sprite, r0 = game.rect, a0 = game.alpha;
        game.sprite = (...a) => { sprites.push(a); return s0(...a); };
        game.rect = (...a) => { rects.push(a); return r0(...a); };
        game.alpha = (...a) => { alphas.push(a[0]); return a0(...a); };
        player.attackTimer = 0.2;
        const y0 = floaters[floaters.length - 1].y;
        updateFloaters(0.3);
        const risen = floaters[floaters.length - 1].y < y0;
        try { draw(); } finally { game.sprite = s0; game.rect = r0; game.alpha = a0; }
        const attackShown = sprites.some(a => a[2] === heroArt.attack);
        const flashShown = sprites.some(a => Array.isArray(a[2]) && a[2].some(r => r.includes('W')) && a[2].every(r => /^[W. ]*$/.test(r)));
        const barShown = rects.some(a => a[4] === game.GREEN && a[2] > 0 && a[2] < 16);
        const fades = alphas.some(a => a > 0 && a < 1);
        // 4. old floaters disappear
        updateFloaters(5);
        return attackShown && flashShown && barShown && fades && risen && floaters.length === 0;
      })()
    message: "Walk right for one second, then keep z held for ten seconds: a slime must walk into your attack and die. Also hitMonsters(box, dmg) must damage a monster (hp down, hurt and knock set, a floater created), the attack frame must be drawn while attackTimer is above 0, a hit monster must flash white and show a green hp bar, and floaters must rise, fade (game.alpha below 1) and be removed when old."
  code:
    - { pattern: 'splice\s*\(', message: "Remove old floaters with floaters.splice(i, 1) (count backwards)." }
    - { pattern: 'game\.alpha\s*\(', message: "Fade the floating numbers with game.alpha(...)." }
hints:
  - "Seven small jobs, all in the order the game needs them: damageMonster (subtract hp, set hurt and knock, add a floater, die at 0), hitMonsters (loop + touching), tryAttack (set the two timers and call hitMonsters), the timers in update, the attack picture, the floaters, and the hit flash plus hp bar."
  - "damageMonster: m.hp -= dmg; m.hurt = 0.25; m.knock = m.x + m.w / 2 > fromX ? 110 : -110; addFloater(m.x + m.w / 2, m.y - 8, dmg, game.WHITE); if (m.hp <= 0) { m.alive = false; }   hitMonsters: for (const m of monsters) { if (m.alive && touching(box.x, box.y, box.w, box.h, m.x, m.y, m.w, m.h)) { damageMonster(m, dmg, player.x + player.w / 2); hits++; } }"
  - "tryAttack: player.attackTimer = ATTACK_TIME; player.cooldown = ATTACK_COOLDOWN; hitMonsters(attackBox(), player.atk);  update: player.attackTimer = Math.max(0, player.attackTimer - dt); same for cooldown.  playerArt: if (player.attackTimer > 0) { return heroArt.attack; }  updateFloaters: for (const f of floaters) { f.age += dt; f.y -= 30 * dt; } then for (let i = floaters.length - 1; i >= 0; i--) { if (floaters[i].age >= floaters[i].life) { floaters.splice(i, 1); } }  drawFloaters: game.alpha(1 - f.age / f.life); game.text(x, f.y, f.text, f.color, f.size); ... game.alpha(1);  drawMonsters: let art = def.art[frame]; if (m.hurt > 0.15) { art = flashArt(art); } ... if (m.hp < m.maxHp) { drawMonsterBar(m, def); }  bar: game.rect(x, y, 16 * Math.max(0, m.hp) / m.maxHp, 2, game.GREEN);"
solution:
  - name: main.js
    code: |
      // Step 7: attacking and damage.
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
      //   hp: hit points (now they matter: the hero can hurt them!)    dmg: damage to the hero
      //   xp, coins: for later steps    speed: pixels per second
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
      const floaters = [];             // little texts that float up and fade away (damage numbers)
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
        atk: 2,           // how much damage one hit does
        attackTimer: 0,   // seconds left of the attack animation
        cooldown: 0,      // seconds until we may attack again
      };

      // Attack numbers (in step 9 every class gets its own).
      const ATTACK_REACH = 22;         // how far in front of the hero a hit reaches (pixels)
      const ATTACK_TIME = 0.25;        // how long the attack animation lasts (seconds)
      const ATTACK_COOLDOWN = 0.4;     // how long we wait between two attacks (seconds)

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
        player.attackTimer = 0;
        player.cooldown = 0;
        floaters.length = 0;
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
          knock: 0,                     // sideways speed from being hit (it slides away and slows down)
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

      // A monster that was hit slides away from the blow. Walkers must not slide into walls or off ledges.
      function slideMonster(m, dt) {
        const def = MONSTERS[m.type];
        const nextX = m.x + m.knock * dt;
        const oldDir = m.dir;
        m.dir = m.knock > 0 ? 1 : -1;                   // wallAhead and groundAhead look in the direction m.dir
        const free = def.fly || (!wallAhead(m, nextX) && groundAhead(m, nextX));
        m.dir = oldDir;
        if (free) { m.x = nextX; }
        m.knock *= Math.max(0, 1 - 8 * dt);             // slow down
        if (m.hurt <= 0) { m.knock = 0; }
      }

      function updateMonster(m, dt) {
        const def = MONSTERS[m.type];
        m.animTime += dt;
        m.hurt = Math.max(0, m.hurt - dt);
        if (m.knock !== 0) { slideMonster(m, dt); }
        if (m.hurt > 0) { return; }                     // a monster that was just hit freezes for a moment

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

      // A white copy of a picture: every colored pixel becomes white. We use it for the "I was hit!" flash.
      const flashCache = new Map();
      function flashArt(art) {
        if (!flashCache.has(art)) {
          flashCache.set(art, art.map(row => row.replace(/[^. ]/g, 'W')));
        }
        return flashCache.get(art);
      }

      function drawMonsters() {
        for (const m of monsters) {
          if (!m.alive) { continue; }
          const def = MONSTERS[m.type];
          const frame = Math.floor(m.animTime / def.anim) % 2;         // 0, 1, 0, 1, ...
          let art = def.art[frame];
          if (m.hurt > 0.15) { art = flashArt(art); }                  // the first moments after a hit: white flash
          game.sprite(m.x + def.ox, m.y + def.oy, art, { flip: m.dir < 0 });
          if (m.hp < m.maxHp) { drawMonsterBar(m, def); }              // the bar only shows once it is damaged
        }
      }

      // A small health bar over the monster's head: red background, green part = hp / maxHp.
      function drawMonsterBar(m, def) {
        const barW = 16;
        const x = m.x + m.w / 2 - barW / 2;
        const y = m.y + def.oy - 5;
        game.rect(x - 1, y - 1, barW + 2, 4, game.BLACK);
        game.rect(x, y, barW, 2, [150, 30, 30]);
        game.rect(x, y, barW * Math.max(0, m.hp) / m.maxHp, 2, game.GREEN);
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

      // ---------- attacking ----------

      // The hero's attack hits this rectangle: right in front of the hero, a little taller than the hero.
      function attackBox() {
        const x = player.facing > 0 ? player.x + player.w : player.x - ATTACK_REACH;
        return { x, y: player.y - 2, w: ATTACK_REACH, h: player.h + 4 };
      }

      // Hurt one monster. fromX is where the blow came from, so the monster knows which way to slide.
      function damageMonster(m, dmg, fromX) {
        m.hp -= dmg;
        m.hurt = 0.25;                                             // flash + freeze for a quarter of a second
        m.knock = m.x + m.w / 2 > fromX ? 110 : -110;              // slide away from the blow
        addFloater(m.x + m.w / 2, m.y - 8, dmg, game.WHITE);       // show the number
        if (m.hp <= 0) { m.alive = false; }                        // dead monsters are skipped everywhere
      }

      // Hit every living monster that touches the box. Returns how many were hit.
      function hitMonsters(box, dmg) {
        let hits = 0;
        for (const m of monsters) {
          if (m.alive && touching(box.x, box.y, box.w, box.h, m.x, m.y, m.w, m.h)) {
            damageMonster(m, dmg, player.x + player.w / 2);
            hits++;
          }
        }
        return hits;
      }

      // Start an attack when z is held, the cooldown is over and we are not already swinging.
      function tryAttack() {
        if (!game.keyDown('z') || player.cooldown > 0) { return; }
        player.attackTimer = ATTACK_TIME;
        player.cooldown = ATTACK_COOLDOWN;
        hitMonsters(attackBox(), player.atk);
      }

      // ---------- floating texts ----------

      // size and life are optional: if you leave them out, JavaScript uses these default values.
      function addFloater(x, y, text, color, size = 12, life = 0.9) {
        floaters.push({ x, y, text: String(text), color, size, age: 0, life });
      }

      function updateFloaters(dt) {
        for (const f of floaters) {
          f.age += dt;
          f.y -= 30 * dt;                                            // rise 30 pixels per second
        }
        for (let i = floaters.length - 1; i >= 0; i--) {             // count backwards, so removing is safe
          if (floaters[i].age >= floaters[i].life) { floaters.splice(i, 1); }
        }
      }

      function drawFloaters() {
        for (const f of floaters) {
          const x = f.x - f.text.length * f.size * 0.3;              // roughly centered
          game.alpha(1 - f.age / f.life);                            // fade out while it rises
          game.text(x + 1, f.y + 1, f.text, game.BLACK, f.size);     // a dark shadow makes it readable
          game.text(x, f.y, f.text, f.color, f.size);
        }
        game.alpha(1);                                               // back to solid for everything else
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
        if (player.attackTimer > 0) { return heroArt.attack; }
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
        tryAttack();
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        moveX(dt);
        moveY(dt);
        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
        player.invincible = Math.max(0, player.invincible - dt);
        player.stun = Math.max(0, player.stun - dt);
        player.attackTimer = Math.max(0, player.attackTimer - dt);
        player.cooldown = Math.max(0, player.cooldown - dt);
        updateFloaters(dt);
        updateMonsters(dt);
        checkMonsterHits();
        updateCamera();
      }

      function drawPlayer() {
        // while invincible the hero blinks: every other 1/12 second it is almost see-through
        const blink = player.invincible > 0 && Math.floor(player.invincible * 12) % 2 === 0;
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0, alpha: blink ? 0.3 : 1 });
        if (player.attackTimer > 0) {
          // a slash picture in front of the hero that fades away during the attack
          const x = player.facing > 0 ? player.x + player.w + 1 : player.x - 17;
          game.sprite(x, player.y + 1, game.art.icons.slash, { flip: player.facing < 0, scale: 2, alpha: player.attackTimer / ATTACK_TIME });
        }
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
        drawFloaters();                           // damage numbers are in the world, so they scroll with it
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      loadMap();
      game.run(update, draw);
quiz:
  - q: "The attack damages monsters once, at the moment the attack starts. Why not every frame while the attack animation plays?"
    options: ["Because JavaScript cannot loop that fast", "At 60 frames per second one swing would hit about 15 times during its 0.25 seconds, and a slime would die from a single poke", "Because the sword is only drawn on the first frame"]
    answer: 1
  - q: "What is the difference between player.attackTimer and player.cooldown?"
    options: ["attackTimer says how long the attack picture is shown, cooldown says how long we must wait before the next attack may start", "They are the same number with two names", "attackTimer is for monsters, cooldown is for the hero"]
    answer: 0
  - q: "Why does the loop that removes old floating numbers count backwards (from the last item down to 0)?"
    options: ["Because newer numbers must be removed first", "Because arrays can only be read from the end", "splice shifts the items after the removed one, so going backwards never skips an item"]
    answer: 2
    explain: "If you remove item 2 while counting upwards, the old item 3 slides into place 2, and the loop jumps right over it."
  - q: "How does flashArt make the white 'I was hit' picture?"
    options: ["It draws the same sprite with alpha 1", "It makes a copy of the art in which every colored letter is replaced by W, the white palette letter", "It changes the monster's hp"]
    answer: 1
---
## Where we are

The hero can run through the whole world, and the monsters patrol and hurt him. But so far the hero can only run away. A game where you cannot fight back is no fun, so in this step you press **z** to swing a weapon.

## What we add

1. An **attack hitbox**: an invisible rectangle in front of the hero. Anything inside it gets hurt.
2. A **cooldown**, so you cannot hit 60 times per second.
3. **Feedback** that makes hits feel good: a white flash, a knockback slide, a health bar and floating damage numbers.
4. The **attack animation** (every class has an `attack` picture).

## Three numbers on the hero

Look at `player`. `atk` is the damage of one hit. `attackTimer` counts down while the attack picture is shown (`ATTACK_TIME`, a quarter of a second). `cooldown` counts down until the next attack is allowed (`ATTACK_COOLDOWN`, 0.4 seconds). They are two timers because they do different jobs: the picture is short, the wait is longer. Both are decreased in `update` exactly like `invincible` and `stun`, and never below 0.

## 1. The hitbox and the hit

`attackBox()` returns `{ x, y, w, h }`: a rectangle starting at the hero's front edge and reaching `ATTACK_REACH` pixels forward, to the right or to the left depending on `facing`. You already own the tool that tests it against a monster: `touching(...)`.

`hitMonsters(box, dmg)` loops over `monsters`, skips the dead ones, and calls `damageMonster` for every one that touches the box. It counts the hits and returns the number, which later steps will use. The damage is applied **once**, in `tryAttack`, the moment an attack starts. If we hit during every frame of the animation, a single swing would hit about 15 times.

## 2. What a hit does

`damageMonster(m, dmg, fromX)` is the heart of the step:

```js
m.hp -= dmg;                       // less life
m.hurt = 0.25;                     // flash and freeze for a moment
m.knock = ... 110 or -110 ...;     // slide away from the blow
addFloater(...);                   // show the number
if (m.hp <= 0) { m.alive = false; }
```

For `knock`, compare the monster's middle with `fromX` (where the blow came from): if the monster is to the right, it slides right (`110`), otherwise left (`-110`). The sliding itself, the freeze and the safety against walls and ledges are already written in `slideMonster` and `updateMonster`. `alive = false` is enough to make a dead monster vanish, because every loop already skips monsters that are not alive.

## 3. Floating numbers

A floater is a small object `{ x, y, text, color, size, age, life }` in the list `floaters`. Each frame `age` grows and `y` shrinks (up is smaller y), so the text rises. When `age` reaches `life` we remove it. Drawing uses `game.alpha(1 - f.age / f.life)`, which goes from solid to invisible. Remember to call `game.alpha(1)` after the loop. Alpha stays set until you change it.

## 4. Showing it

In `playerArt` return `heroArt.attack` while `attackTimer > 0`. In `drawMonsters`, a monster hit less than a moment ago is drawn with `flashArt(art)`, a helper that copies the art and turns every colored pixel white. A damaged monster also gets a small health bar from `drawMonsterBar`.

> **Watch out:**
> - Removing from an array while counting upwards skips items. Count backwards when you `splice`.
> - Forgetting `game.alpha(1)` at the end makes the HUD and everything after the numbers semi-transparent.
> - Do the damage only inside `tryAttack`. If you put `hitMonsters` in `update` unconditionally, the game hits 60 times per second.
> - `TypeError: Cannot read properties of undefined (reading 'x')` often means a function was called without its box. Write `hitMonsters(attackBox(), player.atk)`.

> **Your turn:** complete the numbered TODOs: `damageMonster`, `hitMonsters`, `tryAttack`, the two timers in `update`, the attack frame in `playerArt`, `updateFloaters` and `drawFloaters`, and the flash and health bar in `drawMonsters`. Hold **z** next to a slime: it should flash, slide back, show a green bar, display damage numbers, and disappear after two hits. The hero should be able to hit again every 0.4 seconds.
