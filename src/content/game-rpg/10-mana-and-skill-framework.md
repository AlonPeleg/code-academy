---
title: "Step 10: Mana and the skill framework"
summary: "Add magic points that regenerate, a SKILLS table with three skills per class on the keys x, a and s, cooldowns, and a skill bar on the HUD, built from reusable helpers."
level: advanced
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 10: mana and the skill framework.
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
      const effects = [];              // short pictures and animations (slashes, explosions, puffs) that play once and vanish
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
        cooldowns: [0, 0, 0],   // seconds until each of the three skills (slots 0, 1, 2) can be used again
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
        spawnEffect(player.x + player.w / 2, player.y - 6, game.art.fx.levelUp, { center: true, life: 0.8 });   // and the level-up animation above the head
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
        player.cooldowns = [0, 0, 0];
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
        effects.length = 0;
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
        spawnEffect(clamp(fromX, m.x, m.x + m.w), m.y + m.h / 2, game.art.fx.spark, { center: true, life: 0.2 });   // a spark where the blow landed
        if (m.hp <= 0) {
          m.alive = false;                                         // dead monsters are skipped everywhere
          spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { center: true, life: 0.4 });   // ... and it vanishes in a puff of smoke
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

      // Hit every monster in the rectangle (x, y, w, h). The skills use this: "damage everything in this area".
      function damageArea(x, y, w, h, dmg) {
        // 1. TODO: return hitMonsters({ x, y, w, h }, dmg);  (the same as before, but the box is built from four numbers)
        return 0;
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

      // Create a projectile. opts: { x, y, vx, vy, dmg, art, life, pierce }
      //   x, y: top-left corner     vx, vy: speed in pixels per second (vy is optional, 0 = flies straight)
      //   life: seconds in the air  pierce: true = it flies on through monsters instead of stopping at the first
      function spawnProjectile(opts) {
        const size = game.spriteSize(firstFrame(opts.art));   // an animated projectile has a list of pictures: measure the first one
        // 2. TODO: also store  vy: opts.vy || 0,  pierce: !!opts.pierce  and  hit: []  (the monsters it has already hurt)
        projectiles.push({ x: opts.x, y: opts.y, vx: opts.vx, w: size.w, h: size.h, dmg: opts.dmg, art: opts.art, life: opts.life, age: 0 });
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

      // Move every projectile, let it hit monsters and walls, and remove the used ones.
      function updateProjectiles(dt) {
        for (const p of projectiles) {
          p.x += p.vx * dt;
          p.age += dt;
          p.life -= dt;
          if (solidAt(Math.floor((p.x + p.w / 2) / TILE), Math.floor((p.y + p.h / 2) / TILE))) { p.life = 0; }   // it hit a wall
          // 3. TODO: also move up/down:  p.y += p.vy * dt;
          // 3b. TODO: in the monster loop below skip monsters that are in p.hit (!p.hit.includes(m)), and after damageMonster
          //     do  p.hit.push(m);  and only when !p.pierce set p.life = 0.
          for (const m of monsters) {
            if (p.life > 0 && m.alive && touching(p.x, p.y, p.w, p.h, m.x, m.y, m.w, m.h)) {
              damageMonster(m, p.dmg, p.x);
              p.life = 0;
            }
          }
        }
        for (let i = projectiles.length - 1; i >= 0; i--) {
          if (projectiles[i].life <= 0) { projectiles.splice(i, 1); }
        }
      }

      function drawProjectiles() {
        for (const p of projectiles) {
          const art = isFrames(p.art) ? frameLoop(p.art, p.age) : p.art;   // an animation loops while it flies, a single picture stays
          game.sprite(p.x, p.y, art, { flip: p.vx < 0 });          // the art faces right, so mirror it when it flies left
        }
      }

      // ---------- effects ----------

      // A single picture is a list of text rows. An ANIMATION is a list of such pictures, called frames:
      // game.art.fx.explosion has 5 of them. game.sprite draws ONE picture, so we always pick a frame first.
      function isFrames(art) {
        return Array.isArray(art[0]);                    // a frame list starts with a whole picture (a list), a single picture with a text row
      }

      // The first picture of an art, whether it is one picture or a frame list. Handy for measuring the size.
      function firstFrame(art) {
        return isFrames(art) ? art[0] : art;
      }

      // An animation that plays ONCE. progress goes from 0 (first frame) to 1 (last frame), for example age / life.
      function frameAt(frames, progress) {
        return frames[Math.max(0, Math.min(frames.length - 1, Math.floor(progress * frames.length)))];
      }

      // An animation that repeats forever. time is in seconds, fps is how many frames are shown per second.
      function frameLoop(frames, time, fps = 12) {
        return frames[Math.floor(time * fps) % frames.length];
      }

      // Show a picture or an animation for a short time. art is ONE picture (it fades away) or a LIST of pictures such as
      // game.art.fx.explosion (it plays once during 'life' seconds, see drawEffects).
      // opts (all optional): scale, flip, life (seconds), center: true means x, y is the CENTER of the effect, not its top-left corner
      function spawnEffect(x, y, art, opts = {}) {
        const scale = opts.scale || 1;
        if (opts.center) {
          const size = game.spriteSize(firstFrame(art));
          x -= size.w * scale / 2;
          y -= size.h * scale / 2;
        }
        effects.push({ x, y, art, scale, flip: !!opts.flip, age: 0, life: opts.life || 0.3 });
      }

      function updateEffects(dt) {
        for (const f of effects) { f.age += dt; }
        for (let i = effects.length - 1; i >= 0; i--) {
          if (effects[i].age >= effects[i].life) { effects.splice(i, 1); }
        }
      }

      function drawEffects() {
        for (const f of effects) {
          // 4. TODO: play the animations. When isFrames(f.art) is true, draw the frame  frameAt(f.art, f.age / f.life)  and do NOT fade it (no alpha).
          //    For now every effect only shows its first frame, so animations stand still.
          game.sprite(f.x, f.y, firstFrame(f.art), { scale: f.scale, flip: f.flip, alpha: 1 - f.age / f.life });
        }
      }

      // ---------- skills ----------

      const MP_REGEN = 2;                // magic points that come back every second

      // A skill is an object:
      //   name      shown on the skill bar            key       the key that casts it ('x', 'a' or 's')
      //   cost      magic points it uses              cooldown  seconds before it can be cast again
      //   icon      a small picture for the bar       cast(p)   the function that does the work; p is the hero (player)
      // Every class has three skills in SKILLS[className], one per slot. For now they are placeholders:
      // all classes get the same three, built from the helpers damageArea, spawnProjectile and spawnEffect.
      // The next steps replace the cast functions with skills that make each class special.
      function placeholderSkills() {
        return [
          {
            name: 'Strike', key: 'x', cost: 4, cooldown: 1.5, icon: game.art.icons.slash,
            cast(p) {
              // double damage to everything in a box in front of the hero
              const reach = 36;
              damageArea(p.facing > 0 ? p.x + p.w : p.x - reach, p.y - 4, reach, p.h + 8, p.atk * 2);
              spawnEffect(p.facing > 0 ? p.x + p.w + 18 : p.x - 18, p.y + p.h / 2, game.art.fx.slash, { scale: 1.5, center: true, flip: p.facing < 0, life: 0.25 });
            },
          },
          {
            name: 'Shot', key: 'a', cost: 6, cooldown: 3, icon: game.art.icons.arrow,
            cast(p) {
              // 5. TODO: spawnProjectile({ x: p.facing > 0 ? p.x + p.w : p.x - 10, y: p.y + 6, vx: p.facing * 260,
              //                            dmg: p.atk * 2, art: game.art.icons.arrow, life: 1 });
            },
          },
          {
            name: 'Burst', key: 's', cost: 8, cooldown: 6, icon: game.art.icons.star,
            cast(p) {
              // 6. TODO: damageArea(p.x - 40, p.y - 20, p.w + 80, p.h + 30, Math.round(p.atk * 1.5));
              //    and for the picture a big explosion animation in the middle of the hero:
              //    spawnEffect(p.x + p.w / 2, p.y + p.h / 2, game.art.fx.explosion, { scale: 3, center: true, life: 0.45 });
            },
          },
        ];
      }

      // The skills of every class. Each class gets its own list, so later each can be changed on its own.
      const SKILLS = {
        warrior: placeholderSkills(),
        mage: placeholderSkills(),
        archer: placeholderSkills(),
        thief: placeholderSkills(),
      };

      // Try to cast the skill in slot 0, 1 or 2. Returns true if it was cast.
      function useSkill(slot) {
        const skill = SKILLS[player.cls][slot];
        // 7. TODO, in this order:
        //    if (player.cooldowns[slot] > 0) { return false; }
        //    if (player.mp < skill.cost) { addFloater(player.x + player.w / 2, player.y - 6, 'Not enough MP', game.BLUE, 10); return false; }
        //    player.mp -= skill.cost;  player.cooldowns[slot] = skill.cooldown;  player.attackTimer = 0.25;
        //    skill.cast(player);  return true;
        return false;
      }

      // Look at the three skill keys of this class.
      function handleSkillKeys() {
        const skills = SKILLS[player.cls];
        // 8. TODO: for every slot: if (game.keyPressed(skills[slot].key)) { useSkill(slot); }
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
        handleSkillKeys();
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        moveX(dt);
        moveY(dt);
        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
        player.invincible = Math.max(0, player.invincible - dt);
        player.stun = Math.max(0, player.stun - dt);
        player.attackTimer = Math.max(0, player.attackTimer - dt);
        player.cooldown = Math.max(0, player.cooldown - dt);
        player.levelFx = Math.max(0, player.levelFx - dt);
        // 9. TODO: regenerate magic points: player.mp = Math.min(player.maxMp, player.mp + MP_REGEN * dt);
        //    and count every player.cooldowns[i] down by dt (never below 0), like the other timers.
        updateEffects(dt);
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

      // The three skill slots at the bottom: icon, name, key and cost. Dimmed while not castable.
      function drawSkillBar() {
        const skills = SKILLS[player.cls];
        for (let i = 0; i < skills.length; i++) {
          const s = skills[i];
          const x = 58 + i * 69;
          const y = 212;
          game.alpha(0.6);
          game.rect(x, y, 66, 24, game.BLACK);
          game.alpha(1);
          const enough = player.mp >= s.cost;
          const size = game.spriteSize(s.icon);
          const left = player.cooldowns[i];
          game.sprite(x + 2 + (22 - size.w * 2) / 2, y + (24 - size.h * 2) / 2, s.icon, { scale: 2, alpha: left <= 0 && enough ? 1 : 0.4 });
          hudText(x + 27, y + 3, s.name, game.WHITE, 9);
          hudText(x + 27, y + 14, s.key.toUpperCase(), game.YELLOW, 9);
          hudText(x + 38, y + 14, s.cost + ' MP', enough ? game.CYAN : game.RED, 9);
          // 10. TODO: the cooldown overlay. When left > 0:  const fraction = left / s.cooldown;
          //     game.alpha(0.7); game.rect(x, y, 66 * fraction, 24, game.DARK); game.alpha(1);
          //     and the seconds that are left:  hudText(x + 6, y + 6, left.toFixed(1), game.WHITE, 11);
        }
      }

      // The HUD (heads-up display) stays fixed on the screen, so it is drawn with the camera at (0, 0).
      function drawHud() {
        game.alpha(0.5);
        game.rect(4, 3, 122, 60, game.BLACK);                        // a see-through panel behind the numbers
        game.alpha(1);
        hudText(10, 6, 'Lv. ' + player.level + ' ' + classData().name, game.YELLOW, 12);
        drawBar(10, 19, 108, 9, player.hp, player.maxHp, game.RED);
        hudText(14, 19, player.hp + '/' + player.maxHp, game.WHITE, 9);
        // 11. TODO: the magic bar, like the hp bar but lower and blue:
        //    drawBar(10, 31, 108, 9, player.mp, player.maxMp, game.BLUE);
        //    hudText(14, 31, Math.floor(player.mp) + '/' + player.maxMp, game.WHITE, 9);
        drawBar(10, 43, 108, 5, player.xp, xpForLevel(player.level), game.CYAN);
        hudText(10, 50, 'XP ' + player.xp + '/' + xpForLevel(player.level), game.WHITE, 9);
        game.sprite(272, 6, game.art.icons.coin);
        hudText(283, 5, player.coins, game.YELLOW, 12);
        hudText(138, 6, 'Whispering Meadow', game.WHITE, 12);
        drawSkillBar();
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
        drawEffects();
        drawLevelEffect();
        drawFloaters();                           // damage numbers are in the world, so they scroll with it
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      state = 'select';                           // the game starts at the select screen
      game.run(update, draw);
check:
  game:
    frames: 70
    keys:
      - { key: enter, from: 2, to: 3 }
      - { key: x, from: 10, to: 11 }
    expect: |
      (() => {
        // 1. scripted: the warrior pressed x once, one second ago
        const strike = SKILLS.warrior[0];
        if (player.cls !== 'warrior' || state !== 'playing') { return false; }
        if (!(player.cooldowns[0] > 0 && player.cooldowns[0] < strike.cooldown)) { return false; }
        if (!(player.mp > player.maxMp - strike.cost && player.mp < player.maxMp)) { return false; }
        // 2. useSkill: spends mp, starts the cooldown, cannot be cast twice, cannot be cast without mp
        player.mp = player.maxMp; player.cooldowns = [0, 0, 0]; projectiles.length = 0; player.facing = 1;
        const shot = SKILLS.warrior[1];
        if (useSkill(1) !== true) { return false; }
        if (Math.abs(player.mp - (player.maxMp - shot.cost)) > 0.001 || player.cooldowns[1] !== shot.cooldown || projectiles.length !== 1) { return false; }
        const mpAfter = player.mp;
        if (useSkill(1) !== false || player.mp !== mpAfter || projectiles.length !== 1) { return false; }
        player.mp = 0;
        if (useSkill(2) !== false || player.cooldowns[2] !== 0) { return false; }
        // 3. mp regenerates (and never goes above the maximum), cooldowns run down
        player.mp = 3;
        for (let i = 0; i < 30; i++) { update(1 / 60); }
        if (!(player.mp > 3) || player.mp > player.maxMp || !(player.cooldowns[1] < shot.cooldown && player.cooldowns[1] >= 0)) { return false; }
        player.mp = player.maxMp - 0.01;
        update(1 / 60);
        if (player.mp > player.maxMp) { return false; }
        // 4. the skills damage monsters: Strike in front, Burst all around
        const m = monsters.find(x => x.type === 'mushroom');
        player.cooldowns = [0, 0, 0]; player.mp = player.maxMp; player.facing = 1;
        m.alive = true; m.hp = m.maxHp; m.x = player.x + player.w + 6; m.y = player.y + player.h - m.h;
        useSkill(0);
        if (!(m.hp < m.maxHp)) { return false; }
        player.cooldowns = [0, 0, 0]; player.mp = player.maxMp;
        m.alive = true; m.hp = m.maxHp; m.x = player.x - m.w - 10;
        useSkill(2);
        if (!(m.hp < m.maxHp)) { return false; }
        // 5. projectiles: vy, and pierce with a hit list (every monster is hurt only once)
        const a = monsters.find(x => x.type === 'slime');
        const b = monsters.find(x => x.type === 'mushroom');
        const shoot = (pierce) => {
          projectiles.length = 0;
          a.alive = b.alive = true; a.hp = b.hp = 50; a.hurt = b.hurt = 0;
          a.x = 100; b.x = 130; a.y = b.y = 150;
          spawnProjectile({ x: 80, y: 152, vx: 200, vy: 0, dmg: 1, art: game.art.icons.arrow, life: 1, pierce });
          for (let i = 0; i < 45; i++) { updateProjectiles(1 / 60); }
        };
        shoot(true);
        if (a.hp !== 49 || b.hp !== 49 || projectiles.length !== 1) { return false; }
        shoot(false);
        if (a.hp !== 49 || b.hp !== 50 || projectiles.length !== 0) { return false; }
        projectiles.length = 0;
        spawnProjectile({ x: 50, y: 50, vx: 0, vy: 100, dmg: 1, art: game.art.icons.fireball, life: 1 });
        updateProjectiles(0.5);
        if (!(projectiles[0].y > 90)) { return false; }
        // 5b. animations: frameAt / frameLoop pick a frame, spawnEffect can center, and an animated effect plays through its frames
        const boom = game.art.fx.explosion;
        if (frameAt(boom, 0) !== boom[0] || frameAt(boom, 0.5) !== boom[2] || frameAt(boom, 1) !== boom[4] || frameAt(boom, 7) !== boom[4]) { return false; }
        if (frameLoop(boom, 0) !== boom[0] || frameLoop(boom, 0.5) !== boom[1] || frameLoop(boom, 0.5, 2) !== boom[1]) { return false; }
        effects.length = 0;
        spawnEffect(100, 80, game.art.fx.poof, { center: true });
        spawnEffect(100, 80, boom, { center: true, scale: 2, life: 1 });
        if (effects[0].x !== 91 || effects[0].y !== 71 || effects[1].x !== 76 || effects[1].y !== 56) { return false; }
        effects[1].age = 0.9;
        const shown = [];
        const sprite0 = game.sprite;
        game.sprite = (x, y, art, ...rest) => { shown.push(art); return sprite0(x, y, art, ...rest); };
        try { draw(); } finally { game.sprite = sprite0; }
        if (!shown.includes(boom[4]) || shown.includes(boom[0])) { return false; }
        effects.length = 0;
        // 6. the HUD shows mp, skill names, keys and the cooldown
        projectiles.length = 0;
        player.mp = 7; player.cooldowns = [1.5, 0, 0];
        const bars = [], texts = [];
        const bar0 = drawBar, text0 = game.text;
        drawBar = (...args) => { bars.push(args); return bar0(...args); };
        game.text = (...args) => { texts.push(String(args[2])); return text0(...args); };
        try { draw(); } finally { drawBar = bar0; game.text = text0; }
        return bars.some(b2 => b2[4] === 7 && b2[5] === player.maxMp) &&
          ['Strike', 'Shot', 'Burst', 'X', 'A', 'S', '1.5'].every(t => texts.some(s => s === t || s.includes(t) && t.length > 1));
      })()
    message: "Select the warrior with enter and press x once. After one second the mp must be a bit below the maximum (spent, then regenerating) and cooldowns[0] must be running. Also: useSkill(slot) returns true and spends mp and starts the cooldown, refuses a second cast, refuses without enough mp (and then starts no cooldown); mp regenerates up to maxMp; Strike and Burst damage monsters (damageArea); spawnProjectile supports vy and pierce with a hit list (a piercing arrow hurts each monster exactly once, a normal one stops at the first); an animation effect (a list of frames) is drawn with the frame frameAt(frames, age / life) and not faded, spawnEffect understands center: true; and the HUD draws an mp bar, the skill names, the keys X A S and the remaining cooldown time."
  code:
    - { pattern: '\.cast\s*\(', message: "useSkill must call skill.cast(player)." }
    - { pattern: 'player\.cooldowns\s*\[', message: "Use player.cooldowns[slot] for the skill timers." }
hints:
  - "Eleven TODOs again, mostly small: damageArea, the extra projectile fields and the hit list, the animation branch in drawEffects, the Shot and Burst casts, useSkill (the rules, in the right order), handleSkillKeys, the timers in update, and the mp bar and cooldown overlay on the HUD."
  - "useSkill: if (player.cooldowns[slot] > 0) { return false; }  if (player.mp < skill.cost) { addFloater(...); return false; }  player.mp -= skill.cost; player.cooldowns[slot] = skill.cooldown; player.attackTimer = 0.25; skill.cast(player); return true;  handleSkillKeys: for (let slot = 0; slot < skills.length; slot++) { if (game.keyPressed(skills[slot].key)) { useSkill(slot); } }  update: player.mp = Math.min(player.maxMp, player.mp + MP_REGEN * dt); for (let i = 0; i < player.cooldowns.length; i++) { player.cooldowns[i] = Math.max(0, player.cooldowns[i] - dt); }"
  - "damageArea: return hitMonsters({ x, y, w, h }, dmg);  spawnProjectile: vy: opts.vy || 0, pierce: !!opts.pierce, hit: []  updateProjectiles: p.y += p.vy * dt; and in the monster loop: if (p.life > 0 && m.alive && !p.hit.includes(m) && touching(...)) { damageMonster(m, p.dmg, p.x); p.hit.push(m); if (!p.pierce) { p.life = 0; } }  drawEffects: if (isFrames(f.art)) { game.sprite(f.x, f.y, frameAt(f.art, f.age / f.life), { scale: f.scale, flip: f.flip }); } else { the old fading line }  HUD: drawBar(10, 31, 108, 9, player.mp, player.maxMp, game.BLUE); hudText(14, 31, Math.floor(player.mp) + '/' + player.maxMp, game.WHITE, 9);  cooldown overlay: if (left > 0) { const fraction = left / s.cooldown; game.alpha(0.7); game.rect(x, y, 66 * fraction, 24, game.DARK); game.alpha(1); hudText(x + 6, y + 6, left.toFixed(1), game.WHITE, 11); }"
solution:
  - name: main.js
    code: |
      // Step 10: mana and the skill framework.
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
      const effects = [];              // short pictures and animations (slashes, explosions, puffs) that play once and vanish
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
        cooldowns: [0, 0, 0],   // seconds until each of the three skills (slots 0, 1, 2) can be used again
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
        spawnEffect(player.x + player.w / 2, player.y - 6, game.art.fx.levelUp, { center: true, life: 0.8 });   // and the level-up animation above the head
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
        player.cooldowns = [0, 0, 0];
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
        effects.length = 0;
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
        spawnEffect(clamp(fromX, m.x, m.x + m.w), m.y + m.h / 2, game.art.fx.spark, { center: true, life: 0.2 });   // a spark where the blow landed
        if (m.hp <= 0) {
          m.alive = false;                                         // dead monsters are skipped everywhere
          spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { center: true, life: 0.4 });   // ... and it vanishes in a puff of smoke
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

      // Hit every monster in the rectangle (x, y, w, h). The skills use this: "damage everything in this area".
      function damageArea(x, y, w, h, dmg) {
        return hitMonsters({ x, y, w, h }, dmg);
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

      // Create a projectile. opts: { x, y, vx, vy, dmg, art, life, pierce }
      //   x, y: top-left corner     vx, vy: speed in pixels per second (vy is optional, 0 = flies straight)
      //   life: seconds in the air  pierce: true = it flies on through monsters instead of stopping at the first
      function spawnProjectile(opts) {
        const size = game.spriteSize(firstFrame(opts.art));   // an animated projectile has a list of pictures: measure the first one
        projectiles.push({
          x: opts.x, y: opts.y, vx: opts.vx, vy: opts.vy || 0,
          w: size.w, h: size.h,
          dmg: opts.dmg, art: opts.art, life: opts.life,
          age: 0,                          // seconds in the air: an animated projectile uses it to pick its frame
          pierce: !!opts.pierce,
          hit: [],                       // the monsters this projectile has already hurt
        });
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

      // Move every projectile, let it hit monsters and walls, and remove the used ones.
      function updateProjectiles(dt) {
        for (const p of projectiles) {
          p.x += p.vx * dt;
          p.age += dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (solidAt(Math.floor((p.x + p.w / 2) / TILE), Math.floor((p.y + p.h / 2) / TILE))) { p.life = 0; }   // it hit a wall
          for (const m of monsters) {
            if (p.life > 0 && m.alive && !p.hit.includes(m) && touching(p.x, p.y, p.w, p.h, m.x, m.y, m.w, m.h)) {
              damageMonster(m, p.dmg, p.x);
              p.hit.push(m);                                         // never hurt the same monster twice
              if (!p.pierce) { p.life = 0; }                         // a normal projectile is used up by its first hit
            }
          }
        }
        for (let i = projectiles.length - 1; i >= 0; i--) {
          if (projectiles[i].life <= 0) { projectiles.splice(i, 1); }
        }
      }

      function drawProjectiles() {
        for (const p of projectiles) {
          const art = isFrames(p.art) ? frameLoop(p.art, p.age) : p.art;   // an animation loops while it flies, a single picture stays
          game.sprite(p.x, p.y, art, { flip: p.vx < 0 });          // the art faces right, so mirror it when it flies left
        }
      }

      // ---------- effects ----------

      // A single picture is a list of text rows. An ANIMATION is a list of such pictures, called frames:
      // game.art.fx.explosion has 5 of them. game.sprite draws ONE picture, so we always pick a frame first.
      function isFrames(art) {
        return Array.isArray(art[0]);                    // a frame list starts with a whole picture (a list), a single picture with a text row
      }

      // The first picture of an art, whether it is one picture or a frame list. Handy for measuring the size.
      function firstFrame(art) {
        return isFrames(art) ? art[0] : art;
      }

      // An animation that plays ONCE. progress goes from 0 (first frame) to 1 (last frame), for example age / life.
      function frameAt(frames, progress) {
        return frames[Math.max(0, Math.min(frames.length - 1, Math.floor(progress * frames.length)))];
      }

      // An animation that repeats forever. time is in seconds, fps is how many frames are shown per second.
      function frameLoop(frames, time, fps = 12) {
        return frames[Math.floor(time * fps) % frames.length];
      }

      // Show a picture or an animation for a short time. art is ONE picture (it fades away) or a LIST of pictures such as
      // game.art.fx.explosion (it plays once during 'life' seconds, see drawEffects).
      // opts (all optional): scale, flip, life (seconds), center: true means x, y is the CENTER of the effect, not its top-left corner
      function spawnEffect(x, y, art, opts = {}) {
        const scale = opts.scale || 1;
        if (opts.center) {
          const size = game.spriteSize(firstFrame(art));
          x -= size.w * scale / 2;
          y -= size.h * scale / 2;
        }
        effects.push({ x, y, art, scale, flip: !!opts.flip, age: 0, life: opts.life || 0.3 });
      }

      function updateEffects(dt) {
        for (const f of effects) { f.age += dt; }
        for (let i = effects.length - 1; i >= 0; i--) {
          if (effects[i].age >= effects[i].life) { effects.splice(i, 1); }
        }
      }

      function drawEffects() {
        for (const f of effects) {
          if (isFrames(f.art)) {
            const frame = frameAt(f.art, f.age / f.life);              // an animation: the frame depends on how old the effect is
            game.sprite(f.x, f.y, frame, { scale: f.scale, flip: f.flip });
          } else {
            game.sprite(f.x, f.y, f.art, { scale: f.scale, flip: f.flip, alpha: 1 - f.age / f.life });   // a single picture fades away
          }
        }
      }

      // ---------- skills ----------

      const MP_REGEN = 2;                // magic points that come back every second

      // A skill is an object:
      //   name      shown on the skill bar            key       the key that casts it ('x', 'a' or 's')
      //   cost      magic points it uses              cooldown  seconds before it can be cast again
      //   icon      a small picture for the bar       cast(p)   the function that does the work; p is the hero (player)
      // Every class has three skills in SKILLS[className], one per slot. For now they are placeholders:
      // all classes get the same three, built from the helpers damageArea, spawnProjectile and spawnEffect.
      // The next steps replace the cast functions with skills that make each class special.
      function placeholderSkills() {
        return [
          {
            name: 'Strike', key: 'x', cost: 4, cooldown: 1.5, icon: game.art.icons.slash,
            cast(p) {
              // double damage to everything in a box in front of the hero
              const reach = 36;
              damageArea(p.facing > 0 ? p.x + p.w : p.x - reach, p.y - 4, reach, p.h + 8, p.atk * 2);
              spawnEffect(p.facing > 0 ? p.x + p.w + 18 : p.x - 18, p.y + p.h / 2, game.art.fx.slash, { scale: 1.5, center: true, flip: p.facing < 0, life: 0.25 });
            },
          },
          {
            name: 'Shot', key: 'a', cost: 6, cooldown: 3, icon: game.art.icons.arrow,
            cast(p) {
              // a fast arrow in the direction the hero faces
              spawnProjectile({
                x: p.facing > 0 ? p.x + p.w : p.x - 10,
                y: p.y + 6,
                vx: p.facing * 260,
                dmg: p.atk * 2,
                art: game.art.icons.arrow,
                life: 1,
              });
            },
          },
          {
            name: 'Burst', key: 's', cost: 8, cooldown: 6, icon: game.art.icons.star,
            cast(p) {
              // damage around the hero in every direction
              damageArea(p.x - 40, p.y - 20, p.w + 80, p.h + 30, Math.round(p.atk * 1.5));
              spawnEffect(p.x + p.w / 2, p.y + p.h / 2, game.art.fx.explosion, { scale: 3, center: true, life: 0.45 });   // a big explosion animation
            },
          },
        ];
      }

      // The skills of every class. Each class gets its own list, so later each can be changed on its own.
      const SKILLS = {
        warrior: placeholderSkills(),
        mage: placeholderSkills(),
        archer: placeholderSkills(),
        thief: placeholderSkills(),
      };

      // Try to cast the skill in slot 0, 1 or 2. Returns true if it was cast.
      function useSkill(slot) {
        const skill = SKILLS[player.cls][slot];
        if (player.cooldowns[slot] > 0) { return false; }              // still cooling down
        if (player.mp < skill.cost) {                                  // not enough magic points
          addFloater(player.x + player.w / 2, player.y - 6, 'Not enough MP', game.BLUE, 10);
          return false;
        }
        player.mp -= skill.cost;
        player.cooldowns[slot] = skill.cooldown;
        player.attackTimer = 0.25;                                     // show the attack picture
        skill.cast(player);
        return true;
      }

      // Look at the three skill keys of this class.
      function handleSkillKeys() {
        const skills = SKILLS[player.cls];
        for (let slot = 0; slot < skills.length; slot++) {
          if (game.keyPressed(skills[slot].key)) { useSkill(slot); }
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
        handleSkillKeys();
        player.vy = Math.min(player.vy + GRAVITY * dt, MAX_FALL);
        moveX(dt);
        moveY(dt);
        if (player.vx !== 0) { player.animTime += dt; } else { player.animTime = 0; }
        player.invincible = Math.max(0, player.invincible - dt);
        player.stun = Math.max(0, player.stun - dt);
        player.attackTimer = Math.max(0, player.attackTimer - dt);
        player.cooldown = Math.max(0, player.cooldown - dt);
        player.levelFx = Math.max(0, player.levelFx - dt);
        player.mp = Math.min(player.maxMp, player.mp + MP_REGEN * dt);                       // magic points come back slowly
        for (let i = 0; i < player.cooldowns.length; i++) {
          player.cooldowns[i] = Math.max(0, player.cooldowns[i] - dt);                       // every skill timer runs down
        }
        updateEffects(dt);
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

      // The three skill slots at the bottom: icon, name, key and cost. Dimmed while not castable.
      function drawSkillBar() {
        const skills = SKILLS[player.cls];
        for (let i = 0; i < skills.length; i++) {
          const s = skills[i];
          const x = 58 + i * 69;
          const y = 212;
          game.alpha(0.6);
          game.rect(x, y, 66, 24, game.BLACK);
          game.alpha(1);
          const enough = player.mp >= s.cost;
          const size = game.spriteSize(s.icon);
          const left = player.cooldowns[i];
          game.sprite(x + 2 + (22 - size.w * 2) / 2, y + (24 - size.h * 2) / 2, s.icon, { scale: 2, alpha: left <= 0 && enough ? 1 : 0.4 });
          hudText(x + 27, y + 3, s.name, game.WHITE, 9);
          hudText(x + 27, y + 14, s.key.toUpperCase(), game.YELLOW, 9);
          hudText(x + 38, y + 14, s.cost + ' MP', enough ? game.CYAN : game.RED, 9);
          if (left > 0) {
            const fraction = left / s.cooldown;                        // 1 right after casting, 0 when it is ready again
            game.alpha(0.7);
            game.rect(x, y, 66 * fraction, 24, game.DARK);             // a dark curtain that shrinks while time passes
            game.alpha(1);
            hudText(x + 6, y + 6, left.toFixed(1), game.WHITE, 11);    // and the seconds that are left
          }
        }
      }

      // The HUD (heads-up display) stays fixed on the screen, so it is drawn with the camera at (0, 0).
      function drawHud() {
        game.alpha(0.5);
        game.rect(4, 3, 122, 60, game.BLACK);                        // a see-through panel behind the numbers
        game.alpha(1);
        hudText(10, 6, 'Lv. ' + player.level + ' ' + classData().name, game.YELLOW, 12);
        drawBar(10, 19, 108, 9, player.hp, player.maxHp, game.RED);
        hudText(14, 19, player.hp + '/' + player.maxHp, game.WHITE, 9);
        drawBar(10, 31, 108, 9, player.mp, player.maxMp, game.BLUE);
        hudText(14, 31, Math.floor(player.mp) + '/' + player.maxMp, game.WHITE, 9);
        drawBar(10, 43, 108, 5, player.xp, xpForLevel(player.level), game.CYAN);
        hudText(10, 50, 'XP ' + player.xp + '/' + xpForLevel(player.level), game.WHITE, 9);
        game.sprite(272, 6, game.art.icons.coin);
        hudText(283, 5, player.coins, game.YELLOW, 12);
        hudText(138, 6, 'Whispering Meadow', game.WHITE, 12);
        drawSkillBar();
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
        drawEffects();
        drawLevelEffect();
        drawFloaters();                           // damage numbers are in the world, so they scroll with it
        game.camera(0, 0);                        // back to screen space for the HUD
        drawHud();
      }

      state = 'select';                           // the game starts at the select screen
      game.run(update, draw);
quiz:
  - q: "What must useSkill do when the hero does not have enough MP?"
    options: ["Spend the MP anyway and cast", "Start the cooldown but not cast", "Return false and change nothing: no MP spent, no cooldown started"]
    answer: 2
  - q: "What is the cast field of a skill object?"
    options: ["A function stored in the object, so every skill can do something different when it is cast", "A number that says how far the skill reaches", "The picture of the skill"]
    answer: 0
  - q: "Why does a piercing projectile keep a list of the monsters it already hit?"
    options: ["To draw them with a different color", "Otherwise it would hurt the same monster again on every frame while it flies through it", "To count the experience points"]
    answer: 1
    explain: "At 60 frames per second an arrow overlaps a monster for several frames. The hit list makes sure the damage is dealt once."
  - q: "A skill has cooldown 6 and 1.5 seconds are left. How wide should the dark cooldown curtain be, compared with the full slot?"
    options: ["1.5 times the width", "6 times the width", "left / cooldown = 0.25 of the width"]
    answer: 2
---
## Where we are

You can pick a class, fight with the basic attack on **z**, level up and collect coins. A real RPG hero also has **skills**: stronger moves that cost magic points (MP) and need time to recharge. This step builds the **framework** for skills. In later steps every class gets skills that make it special, and they will all plug into the machinery you write now.

## What we add

1. **Magic points**: `player.mp`, which is spent by skills and slowly regenerates.
2. **A skill object** and a `SKILLS` table with three skills per class on the keys **x**, **a** and **s**.
3. **`useSkill(slot)`** with the rules: cooldown, enough MP, spend, cast.
4. **Helpers** that skills are built from: `damageArea`, `spawnProjectile` (now with `pierce`) and `spawnEffect`.
5. **Animated effects**: `frameAt`, `frameLoop`, and a `spawnEffect` that can play an animation.
6. A **skill bar** on the HUD with the name, key, MP cost and a cooldown overlay.

## 1. Magic points

The class table already gives each class `maxMp`, and `loadMap` fills `mp`. Add the regeneration to `update`: `player.mp = Math.min(player.maxMp, player.mp + MP_REGEN * dt)`. Multiplying by `dt` makes it "2 points per second" at any frame rate, and `Math.min` makes sure it never goes above the maximum. The HUD gets a blue bar below the HP bar.

## 2. A skill is an object

```js
{ name: 'Strike', key: 'x', cost: 4, cooldown: 1.5, icon: game.art.icons.slash,
  cast(p) { /* does the work, p is the hero */ } }
```

`cast` is a **method**: a function stored inside the object. That is the trick that makes the framework flexible: `useSkill` does not know what a skill does, it just calls `skill.cast(player)`. `placeholderSkills()` creates three plain skills, and every class gets its own copy in `SKILLS`. Later steps replace the `cast` functions with real class skills. Strike is finished, you write the casts of Shot and Burst with the helpers.

## 3. useSkill: the rules in order

```js
function useSkill(slot) {
  const skill = SKILLS[player.cls][slot];
  // 1. still cooling down? return false
  // 2. not enough MP? show a floater and return false
  // 3. otherwise: spend the MP, start the cooldown, call skill.cast(player), return true
}
```

The order matters: a failed cast must change **nothing**. If you spent MP before checking the cooldown, a double press would drain your mana for no effect. `handleSkillKeys` loops over the three slots and calls `useSkill` when the slot's key is pressed. Use `keyPressed`, not `keyDown`, so holding the key does not cast again and again. Cooldowns are timers in `player.cooldowns[0..2]` that count down in `update`.

## 4. Helpers to build skills from

- `damageArea(x, y, w, h, dmg)` hurts every monster in a rectangle. Your `hitMonsters` from step 7 does the work.
- `spawnProjectile(opts)` gets two new options: `vy` (fly up or down) and `pierce`. A piercing projectile does not stop at the first monster, so it remembers who it already hit in `p.hit`, otherwise it would hurt the same monster on each of the frames it overlaps. In `updateProjectiles` the hit test becomes:

```js
if (p.life > 0 && m.alive && !p.hit.includes(m) && touching(...)) {
  // hurt it, remember it in p.hit, and only a normal (not piercing) projectile is used up
}
```
- `spawnEffect(x, y, art, opts)` shows a picture that fades, or plays an animation (next section). It is only for looks.

## 5. Animated effects

A single picture, like `game.art.icons.slash`, is a list of text rows. An **animation** is a list of such pictures, called **frames**. `game.art.fx` holds ready-made animations: `game.art.fx.explosion` is a list of 5 frames, and there are also `slash`, `spark`, `poof`, `shockwave`, `fireball` and more. `game.sprite` draws **one** picture, so to draw an animation you first pick a frame. Two small helpers (already written, next to `spawnEffect`) do the picking:

```js
frameAt(frames, progress)       // plays ONCE: progress 0 = first frame, 1 = last frame
frameLoop(frames, time, fps)    // repeats FOREVER: Math.floor(time * fps) % frames.length
```

An effect that plays once knows how old it is, so its frame is `frameAt(f.art, f.age / f.life)`. A flying fireball or a spinning dagger repeats: `frameLoop(p.art, p.age)`. That is why every projectile now has an `age` field that `updateProjectiles` counts up, like the `age` of an effect.

`spawnEffect` accepts both kinds of `art`. A single picture fades away like before. A frame list (`isFrames(art)` tells them apart) plays through its frames during `life` seconds and does not fade. A new option, `center: true`, says that x and y are the **middle** of the effect instead of its top-left corner, which is what you want for an explosion on a spot. Your part is the branch in `drawEffects`.

The game already uses the animations: `damageMonster` spawns a small `fx.spark` where a blow lands and a `fx.poof` when a monster dies, `levelUp` spawns `fx.levelUp` above the hero, Strike swings an `fx.slash`, and Burst is an `fx.explosion`.

## 6. The skill bar

`drawSkillBar` draws three slots. While a skill is cooling down, a dark curtain covers `left / s.cooldown` of the slot (1 right after the cast, 0 when ready), plus the seconds that are left as text.

> **Watch out:**
> - `TypeError: skill.cast is not a function` means a skill object has no `cast` method, or a typo like `cast: ` followed by nothing.
> - Using `keyDown` instead of `keyPressed` makes one press cast a skill every frame the cooldown allows.
> - Without the `hit` list a piercing arrow deals its damage on every frame it overlaps a monster.
> - MP is a decimal number, so display `Math.floor(player.mp)` in the HUD, or you will see `17.600000000000001`.
> - Giving a whole frame list to `game.sprite` throws `TypeError: game.sprite needs the art as a list of text rows`. Pick one frame first with `frameAt` or `frameLoop`.

> **Your turn:** complete the numbered TODOs (the animation branch of `drawEffects` is one of them). Then play with all four classes: **x**, **a** and **s** cast Strike, Shot and Burst, MP drains and slowly refills, the slots show a dark curtain and a countdown, and the bar for a skill you cannot afford is dim. Hits show a spark, a dead monster ends in a puff of smoke, Strike swings a slash and Burst explodes. Try casting twice quickly: the second press must do nothing. In the next steps every class gets skills that really make it different.
