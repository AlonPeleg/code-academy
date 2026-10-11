---
title: "Step 9: Character classes"
summary: "Add a hero select screen and four classes (warrior, mage, archer, thief) in one data table, with their own stats, speed, jump height and attack style, including flying projectiles."
level: advanced
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 9: character classes.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const GRAVITY = 900;
      const MAX_FALL = 500;
      // (WALK_SPEED and JUMP_SPEED are gone: every class has its own speed and jump now.)

      let heroArt = game.art.warrior;   // the picture set of the chosen class

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
      //   hp: hit points    dmg: damage to the hero    xp: experience the hero gets for the kill
      //   coins: how many coins it drops    speed: pixels per second
      // Step 8: the hero now has 30 hit points instead of 5 hearts, so all numbers are bigger.
      //   w, h: size of the hitbox    ox, oy: where the sprite starts, relative to the hitbox corner
      //   art: [frame A, frame B]     anim: seconds per animation frame     fly: true for flying monsters
      const MONSTERS = {
        slime:    { hp: 6,  dmg: 4,  xp: 6,  coins: 2, speed: 22, w: 14, h: 10, ox: -1, oy: -2, anim: 0.40, art: [game.art.slime.idle, game.art.slime.squish] },
        mushroom: { hp: 10, dmg: 6,  xp: 10, coins: 3, speed: 28, w: 12, h: 15, ox: -2, oy: -1, anim: 0.25, art: [game.art.mushroom.idle, game.art.mushroom.walk] },
        skeleton: { hp: 18, dmg: 10, xp: 18, coins: 5, speed: 36, w: 9,  h: 19, ox: -3, oy: 0,  anim: 0.25, art: [game.art.skeleton.idle, game.art.skeleton.walk] },
        bat:      { hp: 5,  dmg: 5,  xp: 8,  coins: 2, speed: 40, w: 16, h: 8,  ox: -2, oy: -1, anim: 0.12, art: [game.art.bat.up, game.art.bat.down], fly: true, range: 40 },
      };

      // Which marker letter on the map spawns which monster.
      const MARKERS = { s: 'slime', m: 'mushroom', k: 'skeleton', b: 'bat' };

      let monsters = [];               // every monster of the current map
      const floaters = [];             // little texts that float up and fade away (damage numbers)
      const drops = [];                // coins lying around or flying through the air
      const projectiles = [];          // magic bolts and arrows that are flying right now
      let lostCoins = 0;               // how many coins the last death cost (shown on the game over screen)
      let state = 'playing';           // 'select' (choosing a hero), 'playing' or 'dead'

      let map = [];                    // the loaded map (without the P marker)
      let mapW = 0;                    // map size in pixels
      let mapH = 0;
      const camera = { x: 0, y: 0 };   // the world point shown in the top-left corner of the screen

      // ---------- the classes ----------

      // One row per hero class, just like MONSTERS has one row per monster.
      //   hp, mp, atk: the values at level 1     hpGrow, mpGrow, atkGrow: how much more you get with every level
      //   speed: walking speed in pixels per second     jump: jump speed
      //   attack: how the z attack works.  style 'melee': hits a box of 'reach' pixels in front of the hero.
      //           style 'ranged': shoots a projectile: art, speed (pixels per second), life (seconds in the air).
      //           time: how long the attack picture shows     cooldown: seconds until the next attack
      const CLASSES = {
        warrior: {
          name: 'Warrior', art: game.art.warrior, color: [220, 80, 70],
          desc: ['Tough front-line hero.', 'Big sword, close range.', 'Hard to knock down.'],
          hp: 45, hpGrow: 12, mp: 20, mpGrow: 4, atk: 4, atkGrow: 1,
          speed: 85, jump: 310,
          attack: { style: 'melee', reach: 28, time: 0.25, cooldown: 0.45, fx: 2 },
        },
        mage: {
          name: 'Mage', art: game.art.mage, color: [90, 140, 255],
          desc: ['Fragile but powerful.', 'Throws magic bolts', 'from a distance.'],
          hp: 28, hpGrow: 7, mp: 40, mpGrow: 10, atk: 5, atkGrow: 2,
          speed: 80, jump: 320,
          attack: { style: 'ranged', art: game.art.icons.fireball, speed: 200, life: 0.9, time: 0.25, cooldown: 0.6 },
        },
        archer: {
          name: 'Archer', art: game.art.archer, color: [90, 190, 100],
          desc: ['Quick and accurate.', 'Shoots arrows that', 'fly far and fast.'],
          hp: 34, hpGrow: 8, mp: 25, mpGrow: 5, atk: 4, atkGrow: 2,
          speed: 95, jump: 330,
          attack: { style: 'ranged', art: game.art.icons.arrow, speed: 280, life: 0.8, time: 0.25, cooldown: 0.5 },
        },
        // 1. TODO: add a thief row here (copy the shape of the others):
        //    name 'Thief', art game.art.thief, color [170, 110, 220], desc: ['The fastest hero.', 'Very quick stabs,', 'but you must stay close.']
        //    hp 30 (+7 per level), mp 25 (+5), atk 2 (+1), speed 110, jump 345,
        //    attack: { style: 'melee', reach: 16, time: 0.12, cooldown: 0.22, fx: 1 }
        //    Then add 'thief' to CLASS_ORDER further down.
      };

      // The order of the cards on the select screen, and which one is highlighted.
      const CLASS_ORDER = ['warrior', 'mage', 'archer'];            // 1b. TODO: add 'thief'
      let selected = 0;

      const player = {
        x: 0, y: 0, w: 10, h: 18,
        vx: 0, vy: 0,
        facing: 1,
        onGround: false,
        animTime: 0,
        cls: 'warrior',   // the chosen class: a key of CLASSES
        speed: 85,        // walking speed of the class
        jump: 310,        // jump speed of the class
        hp: 45, maxHp: 45,
        mp: 20, maxMp: 20,   // magic points (we use them in step 10)
        level: 1,
        xp: 0,            // experience points collected towards the next level
        coins: 0,
        levelFx: 0,       // seconds left of the "level up" sparkle
        invincible: 0,    // seconds left of protection after being hit
        stun: 0,          // seconds left in which we cannot steer (knockback)
        atk: 4,           // how much damage one hit does
        attackTimer: 0,   // seconds left of the attack animation
        cooldown: 0,      // seconds until we may attack again
      };

      // ---------- levels ----------

      // How much XP do you need to go from this level to the next one? Level 1 needs 12, level 2 needs 16, level 3 needs 20, ...
      function xpForLevel(level) {
        return 8 + level * 4;
      }

      // The row of CLASSES that belongs to the hero.
      function classData() {
        return CLASSES[player.cls];
      }

      // The hero's stats depend on the class and the level. Call this after the level changed.
      function applyLevel() {
        const c = classData();
        const grown = player.level - 1;             // how many levels above level 1
        // 2. TODO: player.maxHp = c.hp + grown * c.hpGrow;  and the same for maxMp (c.mp, c.mpGrow) and atk (c.atk, c.atkGrow).
        player.maxHp = 20 + player.level * 10;
        player.atk = 2 + player.level;
      }

      // Start a new game as the given class (a key of CLASSES): set up the hero and load the map.
      function applyClass(name) {
        // 3. TODO: const c = CLASSES[name];  player.cls = name;  heroArt = c.art;  player.speed = c.speed;  player.jump = c.jump;
        //    player.level = 1;  player.xp = 0;  player.coins = 0;  applyLevel();  loadMap();
      }

      // Give the hero some experience. While there is enough XP for the next level, level up (this can happen twice in a row).
      function gainXp(amount) {
        player.xp += amount;
        addFloater(player.x + player.w / 2, player.y - 6, '+' + amount + ' XP', game.CYAN);
        while (player.xp >= xpForLevel(player.level)) {
          player.xp -= xpForLevel(player.level);       // the leftover XP counts for the next level
          levelUp();
        }
      }

      function levelUp() {
        player.level++;
        applyLevel();
        player.hp = player.maxHp;                      // a level up heals completely
        player.levelFx = 1.2;                          // start the sparkles
        addFloater(player.x + player.w / 2, player.y - 16, 'LEVEL UP!', game.YELLOW, 14, 1.6);
      }


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
        player.mp = player.maxMp;
        player.vx = 0;
        player.vy = 0;
        player.invincible = 0;
        player.stun = 0;
        player.attackTimer = 0;
        player.cooldown = 0;
        player.levelFx = 0;
        floaters.length = 0;
        drops.length = 0;
        projectiles.length = 0;
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
        addFloater(player.x + player.w / 2, player.y - 6, '-' + MONSTERS[m.type].dmg, game.RED);
        if (player.hp <= 0) {
          player.hp = 0;
          state = 'dead';
          lostCoins = Math.floor(player.coins / 2);                // the penalty: half of the coins are gone
          player.coins -= lostCoins;
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
      function attackBox(reach) {
        const x = player.facing > 0 ? player.x + player.w : player.x - reach;
        return { x, y: player.y - 2, w: reach, h: player.h + 4 };
      }

      // Hurt one monster. fromX is where the blow came from, so the monster knows which way to slide.
      function damageMonster(m, dmg, fromX) {
        m.hp -= dmg;
        m.hurt = 0.25;                                             // flash + freeze for a quarter of a second
        m.knock = m.x + m.w / 2 > fromX ? 110 : -110;              // slide away from the blow
        addFloater(m.x + m.w / 2, m.y - 8, dmg, game.WHITE);       // show the number
        if (m.hp <= 0) {
          m.alive = false;                                         // dead monsters are skipped everywhere
          gainXp(MONSTERS[m.type].xp);                             // the reward: experience ...
          dropCoins(m);                                            // ... and coins
        }
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
        const atk = classData().attack;                              // how the attack of this class works
        // 4. TODO: player.attackTimer = atk.time;  player.cooldown = atk.cooldown;
        //    if (atk.style === 'melee') { hitMonsters(attackBox(atk.reach), player.atk); } else { shootBasic(atk); }
      }

      // ---------- projectiles ----------

      // Create a projectile. opts: { x, y, vx, dmg, art, life }  (x, y: top-left corner, vx: pixels per second, life: seconds in the air)
      function spawnProjectile(opts) {
        const size = game.spriteSize(opts.art);
        projectiles.push({ x: opts.x, y: opts.y, vx: opts.vx, w: size.w, h: size.h, dmg: opts.dmg, art: opts.art, life: opts.life });
      }

      // The basic attack of the ranged classes: a projectile that leaves the hero's front.
      function shootBasic(atk) {
        const size = game.spriteSize(atk.art);
        spawnProjectile({
          x: player.facing > 0 ? player.x + player.w : player.x - size.w,
          y: player.y + 6,
          vx: player.facing * atk.speed,
          dmg: player.atk,
          art: atk.art,
          life: atk.life,
        });
      }

      // Move every projectile, let it hit the first monster or wall in its way, and remove the used ones.
      function updateProjectiles(dt) {
        // 5. TODO: for every projectile p: p.x += p.vx * dt;  p.life -= dt;
        //    if the tile at its middle is solid (solidAt(Math.floor((p.x + p.w / 2) / TILE), Math.floor((p.y + p.h / 2) / TILE))) set p.life = 0.
        //    For every alive monster m that touches it (touching(p.x, p.y, p.w, p.h, m.x, m.y, m.w, m.h)) while p.life > 0:
        //    damageMonster(m, p.dmg, p.x); p.life = 0;
        //    Afterwards remove all projectiles with life <= 0 (count backwards and splice).
      }

      function drawProjectiles() {
        // 6. TODO: draw every projectile: game.sprite(p.x, p.y, p.art, { flip: p.vx < 0 });
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

      // ---------- coins ----------

      // A dead monster pops out one coin for every coin in its table row. They fan out sideways.
      function dropCoins(m) {
        const n = MONSTERS[m.type].coins;
        for (let i = 0; i < n; i++) {
          drops.push({
            x: m.x + m.w / 2 - 4,                    // the coin is 8 x 8 pixels
            y: m.y,
            vx: (i - (n - 1) / 2) * 30,              // the middle coin goes straight up, the others to the sides
            vy: -170 - (i % 2) * 40,
            age: 0,
            landed: false,
          });
        }
      }

      // A coin flies, falls and lands on solid ground or on a wooden platform. After landing it just bobs.
      function updateDrop(c, dt) {
        c.age += dt;
        if (c.landed) { return; }
        c.vy = Math.min(c.vy + GRAVITY * dt, MAX_FALL);
        const nextX = c.x + c.vx * dt;
        if (solidAt(Math.floor((nextX + 4) / TILE), Math.floor((c.y + 4) / TILE))) { c.vx = 0; } else { c.x = nextX; }
        c.y += c.vy * dt;
        const col = Math.floor((c.x + 4) / TILE);
        const row = Math.floor((c.y + 8) / TILE);                // the row under the coin's bottom edge
        if (c.vy > 0 && (solidAt(col, row) || oneWayAt(col, row))) {
          c.y = row * TILE - 8;
          c.landed = true;
        }
      }

      // Pick up every coin the hero touches. (A coin needs a moment in the air first, so it is not eaten at once.)
      function collectDrops() {
        for (let i = drops.length - 1; i >= 0; i--) {
          const c = drops[i];
          if (c.age > 0.35 && touching(player.x, player.y, player.w, player.h, c.x, c.y, 8, 8)) {
            player.coins++;
            addFloater(c.x + 4, c.y - 4, '+1', game.YELLOW, 10, 0.6);
            drops.splice(i, 1);
          }
        }
      }

      function drawDrops() {
        for (const c of drops) {
          const bob = c.landed ? Math.sin(c.age * 6) * 2 : 0;    // a landed coin bobs up and down
          game.sprite(c.x, c.y + bob, game.art.icons.coin);
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
        if (player.attackTimer > 0) { return heroArt.attack; }
        if (!player.onGround) { return heroArt.jump; }
        if (player.vx === 0) { return heroArt.idle; }
        const step = Math.floor(player.animTime / 0.15) % 2;
        return step === 0 ? heroArt.walk1 : heroArt.walk2;
      }

      function handleInput() {
        if (player.stun > 0) { return; }          // knocked back: no steering for a moment
        player.vx = 0;
        // 7. TODO: the numbers 85 and 310 are the warrior's. Use the class values player.speed and player.jump instead.
        if (game.keyDown('left')) {
          player.vx = -85;
          player.facing = -1;
        }
        if (game.keyDown('right')) {
          player.vx = 85;
          player.facing = 1;
        }
        if (game.keyPressed('space') && player.onGround) {
          player.vy = -310;
          player.onGround = false;
        }
      }

      function update(dt) {
        dt = Math.min(dt, 0.03);          // a slow frame must never move us a whole tile at once
        // 8. TODO: if (state === 'select') { updateSelect(); return; }
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
        player.levelFx = Math.max(0, player.levelFx - dt);
        updateFloaters(dt);
        updateProjectiles(dt);
        updateMonsters(dt);
        checkMonsterHits();
        for (const c of drops) { updateDrop(c, dt); }
        collectDrops();
        updateCamera();
      }

      function drawPlayer() {
        // while invincible the hero blinks: every other 1/12 second it is almost see-through
        const blink = player.invincible > 0 && Math.floor(player.invincible * 12) % 2 === 0;
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0, alpha: blink ? 0.3 : 1 });
        const atk = classData().attack;
        if (player.attackTimer > 0 && atk.style === 'melee') {
          // a slash picture in front of the hero that fades away during the attack (bigger for a longer reach)
          const size = 8 * atk.fx;
          const x = player.facing > 0 ? player.x + player.w + 1 : player.x - 1 - size;
          game.sprite(x, player.y + 1, game.art.icons.slash, { flip: player.facing < 0, scale: atk.fx, alpha: player.attackTimer / atk.time });
        }
      }

      // Six stars spiral up around the hero after a level up and fade away.
      function drawLevelEffect() {
        if (player.levelFx <= 0) { return; }
        const t = 1 - player.levelFx / 1.2;                          // 0 right after the level up, 1 when it is over
        const cx = player.x + player.w / 2;
        const cy = player.y + player.h / 2;
        game.alpha(1 - t);
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3 + t * 5;
          const radius = 8 + t * 20;
          game.sprite(cx + Math.cos(angle) * radius - 4, cy + Math.sin(angle) * radius * 0.6 - t * 14 - 4, game.art.icons.star);
        }
        game.alpha(1);
      }

      // A horizontal bar: dark background, colored part = value / max of the width.
      function drawBar(x, y, w, h, value, max, color) {
        const fraction = clamp(value / max, 0, 1);
        game.rect(x - 1, y - 1, w + 2, h + 2, game.BLACK);
        game.rect(x, y, w, h, [60, 60, 70]);
        game.rect(x, y, w * fraction, h, color);
      }

      // Text with a dark shadow, readable on any background.
      function hudText(x, y, message, color, size) {
        game.text(x + 1, y + 1, message, game.BLACK, size);
        game.text(x, y, message, color, size);
      }

      // The HUD (heads-up display) stays fixed on the screen, so it is drawn with the camera at (0, 0).
      function drawHud() {
        game.alpha(0.5);
        game.rect(4, 3, 122, 52, game.BLACK);                        // a see-through panel behind the numbers
        game.alpha(1);
        hudText(10, 6, 'Lv. ' + player.level + ' ' + classData().name, game.YELLOW, 12);
        drawBar(10, 21, 108, 9, player.hp, player.maxHp, game.RED);
        hudText(14, 21, player.hp + '/' + player.maxHp, game.WHITE, 9);
        drawBar(10, 34, 108, 5, player.xp, xpForLevel(player.level), game.CYAN);
        hudText(10, 42, 'XP ' + player.xp + '/' + xpForLevel(player.level), game.WHITE, 9);
        game.sprite(272, 6, game.art.icons.coin);
        hudText(283, 5, player.coins, game.YELLOW, 12);
        hudText(138, 6, 'Whispering Meadow', game.WHITE, 12);
        if (state === 'dead') {
          game.rect(0, 80, game.WIDTH, 80, game.BLACK);
          game.text(70, 90, 'You were defeated', game.RED, 20);
          game.text(70, 118, 'You lost ' + lostCoins + ' coins.', game.YELLOW, 12);
          game.text(88, 138, 'Press enter to try again', game.WHITE, 12);
        }
      }

      // ---------- the select screen ----------

      // Left and right move the highlight, enter starts the game. The % wraps around: after the last card comes the first.
      function updateSelect() {
        // 9. TODO: keyPressed('left'):  selected = (selected + CLASS_ORDER.length - 1) % CLASS_ORDER.length;
        //          keyPressed('right'): selected = (selected + 1) % CLASS_ORDER.length;
        //          keyPressed('enter'): applyClass(CLASS_ORDER[selected]);
      }

      // One card: the class color on top, the hero (twice as big), the name. The chosen card has a yellow frame and walks on the spot.
      function drawClassCard(i) {
        const c = CLASSES[CLASS_ORDER[i]];
        const on = i === selected;
        const w = 70;
        const x = 8 + i * (w + 8);
        const y = 34;
        game.alpha(on ? 0.9 : 0.5);
        game.rect(x, y, w, 92, game.DARK);
        game.alpha(1);
        game.rect(x, y, w, 4, c.color);
        if (on) {
          game.rect(x - 2, y - 2, w + 4, 2, game.YELLOW);            // the four sides of the frame
          game.rect(x - 2, y + 92, w + 4, 2, game.YELLOW);
          game.rect(x - 2, y - 2, 2, 96, game.YELLOW);
          game.rect(x + w, y - 2, 2, 96, game.YELLOW);
        }
        const art = on && Math.floor(game.time() / 0.3) % 2 === 1 ? c.art.walk1 : c.art.idle;
        game.sprite(x + (w - 32) / 2, y + 16, art, { scale: 2, alpha: on ? 1 : 0.6 });
        hudText(x + (w - c.name.length * 6) / 2, y + 66, c.name, on ? game.WHITE : game.GRAY, 10);
        hudText(x + 14, y + 79, c.attack.style === 'melee' ? 'close combat' : 'ranged', game.GRAY, 8);
      }

      // The stats of the chosen class: a bar for each number. The bar is compared with the best value among all classes.
      function drawClassInfo(c) {
        game.alpha(0.6);
        game.rect(8, 134, 304, 74, game.DARK);
        game.alpha(1);
        const rows = [['HP', c.hp, 50, game.RED], ['MP', c.mp, 40, game.BLUE], ['ATK', c.atk, 6, game.ORANGE], ['SPD', c.speed, 110, game.GREEN]];
        rows.forEach((row, i) => {
          const y = 142 + i * 15;
          hudText(14, y, row[0] + ' ' + row[1], game.WHITE, 10);
          drawBar(70, y + 2, 80, 7, row[1], row[2], row[3]);
        });
        c.desc.forEach((line, i) => hudText(168, 142 + i * 14, line, game.WHITE, 10));
      }

      function drawSelect() {
        drawBackground();
        hudText(83, 10, 'Choose your hero', game.WHITE, 16);
        for (let i = 0; i < CLASS_ORDER.length; i++) { drawClassCard(i); }
        drawClassInfo(CLASSES[CLASS_ORDER[selected]]);
        hudText(70, 218, 'left / right: choose   enter: play', game.YELLOW, 10);
      }

      function draw() {
        // 10. TODO: if (state === 'select') { drawSelect(); return; }
        drawBackground();                         // sky and hills, drawn in screen space
        game.camera(camera.x, camera.y);          // from here on, everything is shifted by the camera
        drawMap();
        drawMonsters();
        drawDrops();
        drawProjectiles();
        drawPlayer();
        drawLevelEffect();
        drawFloaters();                           // damage numbers are in the world, so they scroll with it
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      loadMap();                                  // 11. TODO: replace this line by  state = 'select';  when everything else works
      game.run(update, draw);
check:
  game:
    frames: 400
    keys:
      - { key: right, from: 2, to: 400 }
      - { key: enter, from: 4, to: 5 }
      - { key: z, from: 6, to: 400 }
    expect: |
      (() => {
        // 1. scripted: right chose the mage, enter started the game, z shot bolts at a monster
        if (state !== 'playing' || player.cls !== 'mage' || heroArt !== game.art.mage) { return false; }
        const mage = CLASSES.mage;
        if (player.speed !== mage.speed || player.jump !== mage.jump || player.maxHp !== mage.hp || player.maxMp !== mage.mp || player.atk !== mage.atk) { return false; }
        if (!monsters.some(m => m.hp < m.maxHp)) { return false; }
        // 2. the thief row exists and every class can be started
        if (!CLASS_ORDER.includes('thief') || !CLASSES.thief || CLASSES.thief.attack.style !== 'melee') { return false; }
        for (const name of CLASS_ORDER) {
          applyClass(name);
          const c = CLASSES[name];
          if (state !== 'playing' || player.cls !== name || heroArt !== c.art || player.maxHp !== c.hp || player.hp !== c.hp || player.speed !== c.speed) { return false; }
        }
        player.level = 3; applyLevel();
        const t = CLASSES.thief;
        if (player.maxHp !== t.hp + 2 * t.hpGrow || player.atk !== t.atk + 2 * t.atkGrow || player.maxMp !== t.mp + 2 * t.mpGrow) { return false; }
        // 3. projectiles: they fly, hit the first monster, and vanish when their life is over
        const target = monsters.find(m => m.type === 'mushroom');
        const hp0 = target.hp;
        spawnProjectile({ x: target.x - 14, y: target.y + 4, vx: 200, dmg: 2, art: game.art.icons.arrow, life: 1 });
        if (projectiles.length !== 1) { return false; }
        const sprites = [];
        const s0 = game.sprite;
        game.sprite = (...a) => { sprites.push(a); return s0(...a); };
        try { draw(); } finally { game.sprite = s0; }
        if (!sprites.some(a => a[2] === game.art.icons.arrow)) { return false; }
        for (let i = 0; i < 30; i++) { updateProjectiles(1 / 60); }
        if (target.hp !== hp0 - 2 || projectiles.length !== 0) { return false; }
        spawnProjectile({ x: 0, y: 0, vx: 10, dmg: 1, art: game.art.icons.fireball, life: 0.05 });
        updateProjectiles(0.1);
        if (projectiles.length !== 0) { return false; }
        // 4. the select screen draws all four heroes, and the keys move the choice (with wrap around) and start the game
        state = 'select'; selected = 3;
        sprites.length = 0;
        game.sprite = (...a) => { sprites.push(a); return s0(...a); };
        try { draw(); } finally { game.sprite = s0; }
        const allShown = ['warrior', 'mage', 'archer', 'thief'].every(k => sprites.some(a => a[2] === game.art[k].idle || a[2] === game.art[k].walk1));
        if (!allShown) { return false; }
        const kp0 = game.keyPressed;
        game.keyPressed = k => k === 'right';
        update(1 / 60);
        const afterRight = selected;
        game.keyPressed = k => k === 'left';
        update(1 / 60);
        update(1 / 60);
        const afterLeft = selected;
        game.keyPressed = k => k === 'enter';
        update(1 / 60);
        game.keyPressed = kp0;
        return afterRight === 0 && afterLeft === 2 && state === 'playing' && player.cls === CLASS_ORDER[2];
      })()
    message: "Hold right from the start (it chooses the second card, the mage), press enter to start, hold z: the mage must be playing with the stats of CLASSES.mage and a magic bolt must have hurt a monster. Also: the thief row exists and every class can be started with applyClass; levels grow stats with hpGrow, mpGrow and atkGrow; spawnProjectile/updateProjectiles/drawProjectiles work (hit, remove, draw); and the select screen draws all four heroes, wraps around with left and right, and enter starts the chosen class."
  code:
    - { pattern: '%\s*CLASS_ORDER\.length', message: "Use % CLASS_ORDER.length so that the choice wraps around from the last card to the first." }
    - { pattern: 'state\s*=\s*[''"]select[''"]', message: "The game must start in the 'select' state." }
hints:
  - "There are eleven numbered TODOs, in the order of the file: the thief row (and adding thief to CLASS_ORDER), applyLevel from the class, applyClass, the style branch in tryAttack, updateProjectiles, drawProjectiles, using player.speed and player.jump, the select state in update, updateSelect, the select state in draw, and finally starting in the select state."
  - "applyLevel: player.maxHp = c.hp + grown * c.hpGrow; (the same for maxMp and atk).  applyClass: const c = CLASSES[name]; player.cls = name; heroArt = c.art; player.speed = c.speed; player.jump = c.jump; player.level = 1; player.xp = 0; player.coins = 0; applyLevel(); loadMap();  tryAttack: if (atk.style === 'melee') { hitMonsters(attackBox(atk.reach), player.atk); } else { shootBasic(atk); }"
  - "updateProjectiles: for (const p of projectiles) { p.x += p.vx * dt; p.life -= dt; if (solidAt(Math.floor((p.x + p.w / 2) / TILE), Math.floor((p.y + p.h / 2) / TILE))) { p.life = 0; } for (const m of monsters) { if (p.life > 0 && m.alive && touching(p.x, p.y, p.w, p.h, m.x, m.y, m.w, m.h)) { damageMonster(m, p.dmg, p.x); p.life = 0; } } } then count backwards and splice the ones with life <= 0.  drawProjectiles: game.sprite(p.x, p.y, p.art, { flip: p.vx < 0 });  updateSelect: selected = (selected + 1) % CLASS_ORDER.length; ... applyClass(CLASS_ORDER[selected]);  update: if (state === 'select') { updateSelect(); return; }  draw: if (state === 'select') { drawSelect(); return; }  bottom: state = 'select';"
solution:
  - name: main.js
    code: |
      // Step 9: character classes.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const GRAVITY = 900;
      const MAX_FALL = 500;
      // (WALK_SPEED and JUMP_SPEED are gone: every class has its own speed and jump now.)

      let heroArt = game.art.warrior;   // the picture set of the chosen class

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
      //   hp: hit points    dmg: damage to the hero    xp: experience the hero gets for the kill
      //   coins: how many coins it drops    speed: pixels per second
      // Step 8: the hero now has 30 hit points instead of 5 hearts, so all numbers are bigger.
      //   w, h: size of the hitbox    ox, oy: where the sprite starts, relative to the hitbox corner
      //   art: [frame A, frame B]     anim: seconds per animation frame     fly: true for flying monsters
      const MONSTERS = {
        slime:    { hp: 6,  dmg: 4,  xp: 6,  coins: 2, speed: 22, w: 14, h: 10, ox: -1, oy: -2, anim: 0.40, art: [game.art.slime.idle, game.art.slime.squish] },
        mushroom: { hp: 10, dmg: 6,  xp: 10, coins: 3, speed: 28, w: 12, h: 15, ox: -2, oy: -1, anim: 0.25, art: [game.art.mushroom.idle, game.art.mushroom.walk] },
        skeleton: { hp: 18, dmg: 10, xp: 18, coins: 5, speed: 36, w: 9,  h: 19, ox: -3, oy: 0,  anim: 0.25, art: [game.art.skeleton.idle, game.art.skeleton.walk] },
        bat:      { hp: 5,  dmg: 5,  xp: 8,  coins: 2, speed: 40, w: 16, h: 8,  ox: -2, oy: -1, anim: 0.12, art: [game.art.bat.up, game.art.bat.down], fly: true, range: 40 },
      };

      // Which marker letter on the map spawns which monster.
      const MARKERS = { s: 'slime', m: 'mushroom', k: 'skeleton', b: 'bat' };

      let monsters = [];               // every monster of the current map
      const floaters = [];             // little texts that float up and fade away (damage numbers)
      const drops = [];                // coins lying around or flying through the air
      const projectiles = [];          // magic bolts and arrows that are flying right now
      let lostCoins = 0;               // how many coins the last death cost (shown on the game over screen)
      let state = 'playing';           // 'select' (choosing a hero), 'playing' or 'dead'

      let map = [];                    // the loaded map (without the P marker)
      let mapW = 0;                    // map size in pixels
      let mapH = 0;
      const camera = { x: 0, y: 0 };   // the world point shown in the top-left corner of the screen

      // ---------- the classes ----------

      // One row per hero class, just like MONSTERS has one row per monster.
      //   hp, mp, atk: the values at level 1     hpGrow, mpGrow, atkGrow: how much more you get with every level
      //   speed: walking speed in pixels per second     jump: jump speed
      //   attack: how the z attack works.  style 'melee': hits a box of 'reach' pixels in front of the hero.
      //           style 'ranged': shoots a projectile: art, speed (pixels per second), life (seconds in the air).
      //           time: how long the attack picture shows     cooldown: seconds until the next attack
      const CLASSES = {
        warrior: {
          name: 'Warrior', art: game.art.warrior, color: [220, 80, 70],
          desc: ['Tough front-line hero.', 'Big sword, close range.', 'Hard to knock down.'],
          hp: 45, hpGrow: 12, mp: 20, mpGrow: 4, atk: 4, atkGrow: 1,
          speed: 85, jump: 310,
          attack: { style: 'melee', reach: 28, time: 0.25, cooldown: 0.45, fx: 2 },
        },
        mage: {
          name: 'Mage', art: game.art.mage, color: [90, 140, 255],
          desc: ['Fragile but powerful.', 'Throws magic bolts', 'from a distance.'],
          hp: 28, hpGrow: 7, mp: 40, mpGrow: 10, atk: 5, atkGrow: 2,
          speed: 80, jump: 320,
          attack: { style: 'ranged', art: game.art.icons.fireball, speed: 200, life: 0.9, time: 0.25, cooldown: 0.6 },
        },
        archer: {
          name: 'Archer', art: game.art.archer, color: [90, 190, 100],
          desc: ['Quick and accurate.', 'Shoots arrows that', 'fly far and fast.'],
          hp: 34, hpGrow: 8, mp: 25, mpGrow: 5, atk: 4, atkGrow: 2,
          speed: 95, jump: 330,
          attack: { style: 'ranged', art: game.art.icons.arrow, speed: 280, life: 0.8, time: 0.25, cooldown: 0.5 },
        },
        thief: {
          name: 'Thief', art: game.art.thief, color: [170, 110, 220],
          desc: ['The fastest hero.', 'Very quick stabs,', 'but you must stay close.'],
          hp: 30, hpGrow: 7, mp: 25, mpGrow: 5, atk: 2, atkGrow: 1,
          speed: 110, jump: 345,
          attack: { style: 'melee', reach: 16, time: 0.12, cooldown: 0.22, fx: 1 },
        },
      };

      // The order of the cards on the select screen, and which one is highlighted.
      const CLASS_ORDER = ['warrior', 'mage', 'archer', 'thief'];
      let selected = 0;

      const player = {
        x: 0, y: 0, w: 10, h: 18,
        vx: 0, vy: 0,
        facing: 1,
        onGround: false,
        animTime: 0,
        cls: 'warrior',   // the chosen class: a key of CLASSES
        speed: 85,        // walking speed of the class
        jump: 310,        // jump speed of the class
        hp: 45, maxHp: 45,
        mp: 20, maxMp: 20,   // magic points (we use them in step 10)
        level: 1,
        xp: 0,            // experience points collected towards the next level
        coins: 0,
        levelFx: 0,       // seconds left of the "level up" sparkle
        invincible: 0,    // seconds left of protection after being hit
        stun: 0,          // seconds left in which we cannot steer (knockback)
        atk: 4,           // how much damage one hit does
        attackTimer: 0,   // seconds left of the attack animation
        cooldown: 0,      // seconds until we may attack again
      };

      // ---------- levels ----------

      // How much XP do you need to go from this level to the next one? Level 1 needs 12, level 2 needs 16, level 3 needs 20, ...
      function xpForLevel(level) {
        return 8 + level * 4;
      }

      // The row of CLASSES that belongs to the hero.
      function classData() {
        return CLASSES[player.cls];
      }

      // The hero's stats depend on the class and the level. Call this after the level changed.
      function applyLevel() {
        const c = classData();
        const grown = player.level - 1;             // how many levels above level 1
        player.maxHp = c.hp + grown * c.hpGrow;
        player.maxMp = c.mp + grown * c.mpGrow;
        player.atk = c.atk + grown * c.atkGrow;
      }

      // Start a new game as the given class (a key of CLASSES): set up the hero and load the map.
      function applyClass(name) {
        const c = CLASSES[name];
        player.cls = name;
        heroArt = c.art;
        player.speed = c.speed;
        player.jump = c.jump;
        player.level = 1;
        player.xp = 0;
        player.coins = 0;
        applyLevel();
        loadMap();                       // loadMap fills hp and mp, puts the hero at the start and sets state = 'playing'
      }

      // Give the hero some experience. While there is enough XP for the next level, level up (this can happen twice in a row).
      function gainXp(amount) {
        player.xp += amount;
        addFloater(player.x + player.w / 2, player.y - 6, '+' + amount + ' XP', game.CYAN);
        while (player.xp >= xpForLevel(player.level)) {
          player.xp -= xpForLevel(player.level);       // the leftover XP counts for the next level
          levelUp();
        }
      }

      function levelUp() {
        player.level++;
        applyLevel();
        player.hp = player.maxHp;                      // a level up heals completely
        player.levelFx = 1.2;                          // start the sparkles
        addFloater(player.x + player.w / 2, player.y - 16, 'LEVEL UP!', game.YELLOW, 14, 1.6);
      }


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
        player.mp = player.maxMp;
        player.vx = 0;
        player.vy = 0;
        player.invincible = 0;
        player.stun = 0;
        player.attackTimer = 0;
        player.cooldown = 0;
        player.levelFx = 0;
        floaters.length = 0;
        drops.length = 0;
        projectiles.length = 0;
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
        addFloater(player.x + player.w / 2, player.y - 6, '-' + MONSTERS[m.type].dmg, game.RED);
        if (player.hp <= 0) {
          player.hp = 0;
          state = 'dead';
          lostCoins = Math.floor(player.coins / 2);                // the penalty: half of the coins are gone
          player.coins -= lostCoins;
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
      function attackBox(reach) {
        const x = player.facing > 0 ? player.x + player.w : player.x - reach;
        return { x, y: player.y - 2, w: reach, h: player.h + 4 };
      }

      // Hurt one monster. fromX is where the blow came from, so the monster knows which way to slide.
      function damageMonster(m, dmg, fromX) {
        m.hp -= dmg;
        m.hurt = 0.25;                                             // flash + freeze for a quarter of a second
        m.knock = m.x + m.w / 2 > fromX ? 110 : -110;              // slide away from the blow
        addFloater(m.x + m.w / 2, m.y - 8, dmg, game.WHITE);       // show the number
        if (m.hp <= 0) {
          m.alive = false;                                         // dead monsters are skipped everywhere
          gainXp(MONSTERS[m.type].xp);                             // the reward: experience ...
          dropCoins(m);                                            // ... and coins
        }
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
        const atk = classData().attack;                              // how the attack of this class works
        player.attackTimer = atk.time;
        player.cooldown = atk.cooldown;
        if (atk.style === 'melee') {
          hitMonsters(attackBox(atk.reach), player.atk);
        } else {
          shootBasic(atk);
        }
      }

      // ---------- projectiles ----------

      // Create a projectile. opts: { x, y, vx, dmg, art, life }  (x, y: top-left corner, vx: pixels per second, life: seconds in the air)
      function spawnProjectile(opts) {
        const size = game.spriteSize(opts.art);
        projectiles.push({ x: opts.x, y: opts.y, vx: opts.vx, w: size.w, h: size.h, dmg: opts.dmg, art: opts.art, life: opts.life });
      }

      // The basic attack of the ranged classes: a projectile that leaves the hero's front.
      function shootBasic(atk) {
        const size = game.spriteSize(atk.art);
        spawnProjectile({
          x: player.facing > 0 ? player.x + player.w : player.x - size.w,
          y: player.y + 6,
          vx: player.facing * atk.speed,
          dmg: player.atk,
          art: atk.art,
          life: atk.life,
        });
      }

      // Move every projectile, let it hit the first monster or wall in its way, and remove the used ones.
      function updateProjectiles(dt) {
        for (const p of projectiles) {
          p.x += p.vx * dt;
          p.life -= dt;
          if (solidAt(Math.floor((p.x + p.w / 2) / TILE), Math.floor((p.y + p.h / 2) / TILE))) { p.life = 0; }   // it hit a wall
          for (const m of monsters) {
            if (p.life > 0 && m.alive && touching(p.x, p.y, p.w, p.h, m.x, m.y, m.w, m.h)) {
              damageMonster(m, p.dmg, p.x);
              p.life = 0;                                            // a projectile is used up by its first hit
            }
          }
        }
        for (let i = projectiles.length - 1; i >= 0; i--) {
          if (projectiles[i].life <= 0) { projectiles.splice(i, 1); }
        }
      }

      function drawProjectiles() {
        for (const p of projectiles) {
          game.sprite(p.x, p.y, p.art, { flip: p.vx < 0 });          // the art faces right, so mirror it when it flies left
        }
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

      // ---------- coins ----------

      // A dead monster pops out one coin for every coin in its table row. They fan out sideways.
      function dropCoins(m) {
        const n = MONSTERS[m.type].coins;
        for (let i = 0; i < n; i++) {
          drops.push({
            x: m.x + m.w / 2 - 4,                    // the coin is 8 x 8 pixels
            y: m.y,
            vx: (i - (n - 1) / 2) * 30,              // the middle coin goes straight up, the others to the sides
            vy: -170 - (i % 2) * 40,
            age: 0,
            landed: false,
          });
        }
      }

      // A coin flies, falls and lands on solid ground or on a wooden platform. After landing it just bobs.
      function updateDrop(c, dt) {
        c.age += dt;
        if (c.landed) { return; }
        c.vy = Math.min(c.vy + GRAVITY * dt, MAX_FALL);
        const nextX = c.x + c.vx * dt;
        if (solidAt(Math.floor((nextX + 4) / TILE), Math.floor((c.y + 4) / TILE))) { c.vx = 0; } else { c.x = nextX; }
        c.y += c.vy * dt;
        const col = Math.floor((c.x + 4) / TILE);
        const row = Math.floor((c.y + 8) / TILE);                // the row under the coin's bottom edge
        if (c.vy > 0 && (solidAt(col, row) || oneWayAt(col, row))) {
          c.y = row * TILE - 8;
          c.landed = true;
        }
      }

      // Pick up every coin the hero touches. (A coin needs a moment in the air first, so it is not eaten at once.)
      function collectDrops() {
        for (let i = drops.length - 1; i >= 0; i--) {
          const c = drops[i];
          if (c.age > 0.35 && touching(player.x, player.y, player.w, player.h, c.x, c.y, 8, 8)) {
            player.coins++;
            addFloater(c.x + 4, c.y - 4, '+1', game.YELLOW, 10, 0.6);
            drops.splice(i, 1);
          }
        }
      }

      function drawDrops() {
        for (const c of drops) {
          const bob = c.landed ? Math.sin(c.age * 6) * 2 : 0;    // a landed coin bobs up and down
          game.sprite(c.x, c.y + bob, game.art.icons.coin);
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
          player.vx = -player.speed;
          player.facing = -1;
        }
        if (game.keyDown('right')) {
          player.vx = player.speed;
          player.facing = 1;
        }
        if (game.keyPressed('space') && player.onGround) {
          player.vy = -player.jump;
          player.onGround = false;
        }
      }

      function update(dt) {
        dt = Math.min(dt, 0.03);          // a slow frame must never move us a whole tile at once
        if (state === 'select') {
          updateSelect();
          return;                          // nothing else happens while we choose a hero
        }
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
        player.levelFx = Math.max(0, player.levelFx - dt);
        updateFloaters(dt);
        updateProjectiles(dt);
        updateMonsters(dt);
        checkMonsterHits();
        for (const c of drops) { updateDrop(c, dt); }
        collectDrops();
        updateCamera();
      }

      function drawPlayer() {
        // while invincible the hero blinks: every other 1/12 second it is almost see-through
        const blink = player.invincible > 0 && Math.floor(player.invincible * 12) % 2 === 0;
        game.sprite(player.x - 3, player.y - 2, playerArt(), { flip: player.facing < 0, alpha: blink ? 0.3 : 1 });
        const atk = classData().attack;
        if (player.attackTimer > 0 && atk.style === 'melee') {
          // a slash picture in front of the hero that fades away during the attack (bigger for a longer reach)
          const size = 8 * atk.fx;
          const x = player.facing > 0 ? player.x + player.w + 1 : player.x - 1 - size;
          game.sprite(x, player.y + 1, game.art.icons.slash, { flip: player.facing < 0, scale: atk.fx, alpha: player.attackTimer / atk.time });
        }
      }

      // Six stars spiral up around the hero after a level up and fade away.
      function drawLevelEffect() {
        if (player.levelFx <= 0) { return; }
        const t = 1 - player.levelFx / 1.2;                          // 0 right after the level up, 1 when it is over
        const cx = player.x + player.w / 2;
        const cy = player.y + player.h / 2;
        game.alpha(1 - t);
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3 + t * 5;
          const radius = 8 + t * 20;
          game.sprite(cx + Math.cos(angle) * radius - 4, cy + Math.sin(angle) * radius * 0.6 - t * 14 - 4, game.art.icons.star);
        }
        game.alpha(1);
      }

      // A horizontal bar: dark background, colored part = value / max of the width.
      function drawBar(x, y, w, h, value, max, color) {
        const fraction = clamp(value / max, 0, 1);
        game.rect(x - 1, y - 1, w + 2, h + 2, game.BLACK);
        game.rect(x, y, w, h, [60, 60, 70]);
        game.rect(x, y, w * fraction, h, color);
      }

      // Text with a dark shadow, readable on any background.
      function hudText(x, y, message, color, size) {
        game.text(x + 1, y + 1, message, game.BLACK, size);
        game.text(x, y, message, color, size);
      }

      // The HUD (heads-up display) stays fixed on the screen, so it is drawn with the camera at (0, 0).
      function drawHud() {
        game.alpha(0.5);
        game.rect(4, 3, 122, 52, game.BLACK);                        // a see-through panel behind the numbers
        game.alpha(1);
        hudText(10, 6, 'Lv. ' + player.level + ' ' + classData().name, game.YELLOW, 12);
        drawBar(10, 21, 108, 9, player.hp, player.maxHp, game.RED);
        hudText(14, 21, player.hp + '/' + player.maxHp, game.WHITE, 9);
        drawBar(10, 34, 108, 5, player.xp, xpForLevel(player.level), game.CYAN);
        hudText(10, 42, 'XP ' + player.xp + '/' + xpForLevel(player.level), game.WHITE, 9);
        game.sprite(272, 6, game.art.icons.coin);
        hudText(283, 5, player.coins, game.YELLOW, 12);
        hudText(138, 6, 'Whispering Meadow', game.WHITE, 12);
        if (state === 'dead') {
          game.rect(0, 80, game.WIDTH, 80, game.BLACK);
          game.text(70, 90, 'You were defeated', game.RED, 20);
          game.text(70, 118, 'You lost ' + lostCoins + ' coins.', game.YELLOW, 12);
          game.text(88, 138, 'Press enter to try again', game.WHITE, 12);
        }
      }

      // ---------- the select screen ----------

      // Left and right move the highlight, enter starts the game. The % wraps around: after the last card comes the first.
      function updateSelect() {
        if (game.keyPressed('left')) { selected = (selected + CLASS_ORDER.length - 1) % CLASS_ORDER.length; }
        if (game.keyPressed('right')) { selected = (selected + 1) % CLASS_ORDER.length; }
        if (game.keyPressed('enter')) { applyClass(CLASS_ORDER[selected]); }
      }

      // One card: the class color on top, the hero (twice as big), the name. The chosen card has a yellow frame and walks on the spot.
      function drawClassCard(i) {
        const c = CLASSES[CLASS_ORDER[i]];
        const on = i === selected;
        const w = 70;
        const x = 8 + i * (w + 8);
        const y = 34;
        game.alpha(on ? 0.9 : 0.5);
        game.rect(x, y, w, 92, game.DARK);
        game.alpha(1);
        game.rect(x, y, w, 4, c.color);
        if (on) {
          game.rect(x - 2, y - 2, w + 4, 2, game.YELLOW);            // the four sides of the frame
          game.rect(x - 2, y + 92, w + 4, 2, game.YELLOW);
          game.rect(x - 2, y - 2, 2, 96, game.YELLOW);
          game.rect(x + w, y - 2, 2, 96, game.YELLOW);
        }
        const art = on && Math.floor(game.time() / 0.3) % 2 === 1 ? c.art.walk1 : c.art.idle;
        game.sprite(x + (w - 32) / 2, y + 16, art, { scale: 2, alpha: on ? 1 : 0.6 });
        hudText(x + (w - c.name.length * 6) / 2, y + 66, c.name, on ? game.WHITE : game.GRAY, 10);
        hudText(x + 14, y + 79, c.attack.style === 'melee' ? 'close combat' : 'ranged', game.GRAY, 8);
      }

      // The stats of the chosen class: a bar for each number. The bar is compared with the best value among all classes.
      function drawClassInfo(c) {
        game.alpha(0.6);
        game.rect(8, 134, 304, 74, game.DARK);
        game.alpha(1);
        const rows = [['HP', c.hp, 50, game.RED], ['MP', c.mp, 40, game.BLUE], ['ATK', c.atk, 6, game.ORANGE], ['SPD', c.speed, 110, game.GREEN]];
        rows.forEach((row, i) => {
          const y = 142 + i * 15;
          hudText(14, y, row[0] + ' ' + row[1], game.WHITE, 10);
          drawBar(70, y + 2, 80, 7, row[1], row[2], row[3]);
        });
        c.desc.forEach((line, i) => hudText(168, 142 + i * 14, line, game.WHITE, 10));
      }

      function drawSelect() {
        drawBackground();
        hudText(83, 10, 'Choose your hero', game.WHITE, 16);
        for (let i = 0; i < CLASS_ORDER.length; i++) { drawClassCard(i); }
        drawClassInfo(CLASSES[CLASS_ORDER[selected]]);
        hudText(70, 218, 'left / right: choose   enter: play', game.YELLOW, 10);
      }

      function draw() {
        if (state === 'select') {
          drawSelect();
          return;
        }
        drawBackground();                         // sky and hills, drawn in screen space
        game.camera(camera.x, camera.y);          // from here on, everything is shifted by the camera
        drawMap();
        drawMonsters();
        drawDrops();
        drawProjectiles();
        drawPlayer();
        drawLevelEffect();
        drawFloaters();                           // damage numbers are in the world, so they scroll with it
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      state = 'select';                           // the game starts at the select screen
      game.run(update, draw);
quiz:
  - q: "Why are the differences between classes stored in a CLASSES table instead of writing if (cls === 'mage') in many places?"
    options: ["Tables run faster than if statements", "JavaScript only allows four if statements", "The code stays the same for every class, and a new class is just a new row of data"]
    answer: 2
  - q: "selected is 3 and there are 4 cards. What does (selected + 1) % CLASS_ORDER.length give?"
    options: ["0, so the choice wraps around to the first card", "4, which is an empty card", "An error"]
    answer: 0
  - q: "A projectile has speed 200 and life 0.9. How far can it fly at most?"
    options: ["About 18 pixels", "About 180 pixels, because distance = speed * time", "200 pixels exactly, always"]
    answer: 1
    explain: "Every frame it moves vx * dt and its life shrinks by dt, so after 0.9 seconds it has covered 200 * 0.9 = 180 pixels (if it hits nothing)."
  - q: "Why does applyClass call loadMap() as its last line?"
    options: ["loadMap fills hp and mp from the new maxHp and maxMp, places the hero and starts the game, so the stats must be ready first", "loadMap draws the select screen", "It does not matter, the order is random"]
    answer: 0
---
## Where we are

You can fight, level up and collect coins, but there is only one hero: the warrior. Every MapleStory-style game starts with a choice: who do you want to be? In this step the game gets a **select screen** and four **classes** that really play differently.

## What we add

1. A `CLASSES` data table: art, stats, speed, jump and attack style of the warrior, mage, archer and thief.
2. `applyClass(name)`: build the hero from one row of the table. Stats grow per level from the class.
3. **Projectiles**: magic bolts and arrows that fly through the world and hit monsters.
4. A **select screen**: a third game state besides `'playing'` and `'dead'`.

## 1. One table, four heroes

Open `CLASSES`. A row says everything the code needs to know about a class: its `art` set, the stats at level 1 (`hp`, `mp`, `atk`), how much each stat grows per level (`hpGrow`, ...), `speed` and `jump`, and an `attack` object. The two attack styles are:

```js
attack: { style: 'melee',  reach: 28, time: 0.25, cooldown: 0.45, fx: 2 }                   // a box in front of the hero
attack: { style: 'ranged', art: game.art.icons.fireball, speed: 200, life: 0.9, time: 0.25, cooldown: 0.6 }
```

The thief is missing, you write its row (the numbers are in the TODO). It is a melee fighter with a tiny reach but a very short cooldown, so it stabs very fast.

## 2. Stats from the class

`applyLevel` now reads the class: `maxHp = c.hp + grown * c.hpGrow`, where `grown` is `level - 1`. `applyClass(name)` copies the speed, jump and art, resets level, XP and coins, calls `applyLevel()` and finally `loadMap()`, which fills hp and mp, puts the hero at the start and sets `state = 'playing'`. The old `WALK_SPEED` and `JUMP_SPEED` constants are gone, so `handleInput` must use `player.speed` and `player.jump`.

## 3. Projectiles

A projectile is a tiny object `{ x, y, vx, w, h, dmg, art, life }` in the list `projectiles`. `tryAttack` now reads the numbers from the class (`const atk = classData().attack`, then `atk.time` and `atk.cooldown` instead of the old constants) and branches on the style:

```js
if (atk.style === 'melee') {
  // like before, but the box is as long as this class reaches: attackBox(atk.reach)
} else {
  // ranged: shootBasic(atk) creates a projectile with spawnProjectile
}
```

(`attackBox` now takes the `reach` as a parameter.) Each frame `updateProjectiles(dt)` does four things: move it by `vx * dt`, reduce its `life`, kill it if the tile in its middle is solid (a wall), and check every monster with `touching`. The first monster it touches takes `p.dmg` and the projectile is used up (`life = 0`). At the end, all projectiles with `life <= 0` are removed, counting backwards like with floaters. The art faces right, so a projectile flying left is drawn with `flip: p.vx < 0`.

## 4. The select screen

`state` is now a small **state machine**: `'select'` shows the cards, `'playing'` is the game and `'dead'` the game over screen. `update` and `draw` each begin with a branch for `'select'` that returns early. `updateSelect` moves `selected` with left and right. Wrapping around uses the remainder operator, `(selected + 1) % CLASS_ORDER.length`, and for going left you add the length first, so the number never gets negative. Enter calls `applyClass`. Last, the file ends with `state = 'select'` instead of `loadMap()`. Do that last, when everything else works. `drawSelect` is written for you: look at how `drawClassCard` draws the hero twice as big with `{ scale: 2 }`.

> **Watch out:**
> - `TypeError: Cannot read properties of undefined (reading 'art')` means `CLASSES[name]` does not exist: a typo in the class name, or `selected` is outside `CLASS_ORDER`.
> - A negative remainder: `(0 - 1) % 4` is `-1` in JavaScript, not 3. That is why the left key adds the length first.
> - Remove a projectile from the list inside a normal `for...of` loop and you skip items. Remove after the loop, counting backwards.
> - If `applyClass` calls `loadMap()` before `applyLevel()`, the hero starts with the old hit points.

> **Your turn:** complete the numbered TODOs and finish with `state = 'select'`. Start the game as each class. The warrior should swing a big sword, the mage and archer should shoot, the thief should stab quickly, and every class should move and jump differently. Level up and check that the stats grow.
