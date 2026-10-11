---
title: "Step 13: Archer skills"
summary: "Give the archer skills about timing: a Double Shot whose second arrow comes later, an Arrow Rain scheduled with later(delay, fn) and falling with gravity, and an Evasion Dash with invincibility frames."
level: advanced
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 13: archer skills.
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
        buffs: {},        // running power-ups: { buffName: seconds left }, for example { battleCry: 6.5 }
        dash: 0,          // seconds left of a dash (0 = not dashing)
        dashDir: 1,       // which way the dash goes: 1 right, -1 left
        dashSpeed: 0,     // how fast the dash is, in pixels per second
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
        player.buffs = {};
        player.dash = 0;
        timers.length = 0;                         // forget everything that was planned for later
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
          frozen: 0,                    // seconds left as a block of ice (status effect, see freezeMonster)
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
        m.hurt = Math.max(0, m.hurt - dt);
        if (m.frozen > 0) {                             // frozen solid: no animation, no walking, no sliding
          m.frozen = Math.max(0, m.frozen - dt);
          if (m.frozen === 0) { spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.spark, { scale: 2, center: true, life: 0.3 }); }   // the ice cracks
          return;
        }
        m.animTime += dt;
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

      // An icy copy of a picture: the outline becomes dark blue and everything else light blue. Frozen monsters are drawn with it.
      const iceCache = new Map();
      function iceArt(art) {
        if (!iceCache.has(art)) {
          iceCache.set(art, art.map(row => row.replace(/K/g, 'n').replace(/[^. n]/g, 'f')));
        }
        return iceCache.get(art);
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
          if (m.frozen > 0) { art = iceArt(art); }                     // frozen: icy colors
          else if (m.hurt > 0.15) { art = flashArt(art); }             // the first moments after a hit: white flash
          game.sprite(m.x + def.ox, m.y + def.oy, art, { flip: m.dir < 0 });
          if (m.frozen > 0) {                                          // and a see-through crystal on top
            game.sprite(m.x + m.w / 2 - 8, m.y + m.h / 2 - 8, game.art.icons.ice, { scale: 2, alpha: 0.45 });
          }
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
        let dmg = damageTaken(MONSTERS[m.type].dmg);               // buffs can make the blow smaller
        dmg = absorbWithShield(dmg);                               // Mana Shield: magic points soak up the blow first
        player.hp -= dmg;
        player.invincible = 1.2;                                 // no more damage for 1.2 seconds
        player.stun = 0.25;                                      // knockback: we cannot steer for a moment
        const monsterIsRight = m.x + m.w / 2 > player.x + player.w / 2;
        player.vx = monsterIsRight ? -110 : 110;                 // fly away from the monster
        player.vy = -170;
        player.onGround = false;
        if (dmg > 0) { addFloater(player.x + player.w / 2, player.y - 6, '-' + dmg, game.RED); }
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
          if (m.alive && m.frozen <= 0 && touching(player.x, player.y, player.w, player.h, m.x, m.y, m.w, m.h)) {     // a frozen monster is harmless
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
      // knock is how hard it is pushed (pixels per second). Normal hits push with 110, heavy hits can push harder.
      function damageMonster(m, dmg, fromX, knock = 110) {
        if (m.frozen > 0) {                                        // hitting ice shatters it: double damage, and the ice is gone
          dmg = dmg * 2;
          m.frozen = 0;
          addFloater(m.x + m.w / 2, m.y - 18, 'SHATTER!', game.CYAN, 10);
          spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.spark, { scale: 2, center: true, life: 0.3 });     // the ice shatters
        }
        m.hp -= dmg;
        m.hurt = 0.25;                                             // flash + freeze for a quarter of a second
        m.knock = m.x + m.w / 2 > fromX ? knock : -knock;          // slide away from the blow
        addFloater(m.x + m.w / 2, m.y - 8, dmg, game.WHITE);       // show the number
        spawnEffect(clamp(fromX, m.x, m.x + m.w), m.y + m.h / 2, game.art.fx.spark, { center: true, life: 0.2 });   // a spark where the blow landed
        if (m.hp <= 0) {
          m.alive = false;                                         // dead monsters are skipped everywhere
          spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { center: true, life: 0.4 });   // ... and it vanishes in a puff of smoke
          gainXp(MONSTERS[m.type].xp);                             // the reward: experience ...
          dropCoins(m);                                            // ... and coins
        }
      }

      // Hit every living monster that touches the box. Returns how many were hit. knock is optional, see damageMonster.
      function hitMonsters(box, dmg, knock) {
        let hits = 0;
        for (const m of monsters) {
          if (m.alive && touching(box.x, box.y, box.w, box.h, m.x, m.y, m.w, m.h)) {
            damageMonster(m, dmg, player.x + player.w / 2, knock);
            hits++;
          }
        }
        return hits;
      }

      // Hit every monster in the rectangle (x, y, w, h). The skills use this: "damage everything in this area".
      function damageArea(x, y, w, h, dmg, knock) {
        return hitMonsters({ x, y, w, h }, dmg, knock);
      }

      // All living monsters whose center is closer than 'radius' to the point (cx, cy): a circle instead of a box.
      function monstersNear(cx, cy, radius) {
        const found = [];
        for (const m of monsters) {
          if (!m.alive) { continue; }
          const dx = m.x + m.w / 2 - cx;
          const dy = m.y + m.h / 2 - cy;
          if (Math.hypot(dx, dy) <= radius) { found.push(m); }      // Math.hypot(dx, dy) is the length of the diagonal
        }
        return found;
      }

      // Freeze a monster for some seconds: a status effect. updateMonster skips its thinking while m.frozen is above 0.
      function freezeMonster(m, seconds) {
        m.frozen = seconds;
        m.knock = 0;                                                // it stops sliding at once
      }

      // Start an attack when z is held, the cooldown is over and we are not already swinging.
      function tryAttack() {
        if (!game.keyDown('z') || player.cooldown > 0) { return; }
        const atk = classData().attack;                              // how the attack of this class works
        player.attackTimer = atk.time;
        player.cooldown = atk.cooldown;
        if (atk.style === 'melee') {
          hitMonsters(attackBox(atk.reach), attackPower());        // attackPower() instead of player.atk: buffs count now
        } else {
          shootBasic(atk);
        }
      }

      // ---------- projectiles ----------

      // Create a projectile. opts: { x, y, vx, vy, gravity, dmg, art, life, pierce, onHit, onEnd }
      //   x, y: top-left corner     vx, vy: speed in pixels per second (vy is optional, 0 = flies straight)
      //   life: seconds in the air  pierce: true = it flies on through monsters instead of stopping at the first
      //   gravity: optional, how fast vy grows (pixels per second, every second). 0 = flies straight, 700 = falls like a stone.
      //   onHit: optional function (projectile, monster). If there is one, it is called INSTEAD of the normal damage, and decides what happens.
      //   onEnd: optional function (projectile). It is called once when the projectile is used up: it hit something, hit a wall or ran out of life.
      function spawnProjectile(opts) {
        const size = game.spriteSize(firstFrame(opts.art));   // an animated projectile has a list of pictures: measure the first one
        projectiles.push({
          x: opts.x, y: opts.y, vx: opts.vx, vy: opts.vy || 0,
          w: size.w, h: size.h,
          dmg: opts.dmg, art: opts.art, life: opts.life,
          age: 0,                          // seconds in the air: an animated projectile uses it to pick its frame
          pierce: !!opts.pierce,
          // 3. TODO: also store  gravity: opts.gravity || 0
          hit: [],                       // the monsters this projectile has already hurt
          onHit: opts.onHit,             // a function to call when it touches a monster (or undefined)
          onEnd: opts.onEnd,             // a function to call when the projectile is used up (or undefined)
        });
      }

      // The basic attack of the ranged classes: a projectile that leaves the hero's front.
      function shootBasic(atk) {
        const size = game.spriteSize(atk.art);
        spawnProjectile({
          x: player.facing > 0 ? player.x + player.w : player.x - size.w,
          y: player.y + 6,
          vx: player.facing * atk.speed,
          dmg: attackPower(),
          art: atk.art,
          life: atk.life,
        });
      }

      // Move every projectile, let it hit monsters and walls, and remove the used ones.
      function updateProjectiles(dt) {
        for (const p of projectiles) {
          p.x += p.vx * dt;
          p.age += dt;
          // 4. TODO: p.vy += p.gravity * dt;   (before the line that moves y)
          p.y += p.vy * dt;
          p.life -= dt;
          if (solidAt(Math.floor((p.x + p.w / 2) / TILE), Math.floor((p.y + p.h / 2) / TILE))) { p.life = 0; }   // it hit a wall
          for (const m of monsters) {
            if (p.life > 0 && m.alive && !p.hit.includes(m) && touching(p.x, p.y, p.w, p.h, m.x, m.y, m.w, m.h)) {
              if (p.onHit) { p.onHit(p, m); } else { damageMonster(m, p.dmg, p.x); }    // a special effect, or the normal damage
              p.hit.push(m);                                         // never hurt the same monster twice
              if (!p.pierce) { p.life = 0; }                         // a normal projectile is used up by its first hit
            }
          }
        }
        for (let i = projectiles.length - 1; i >= 0; i--) {
          if (projectiles[i].life <= 0) {
            const used = projectiles[i];
            projectiles.splice(i, 1);
            if (used.onEnd) { used.onEnd(used); }                        // for example a spark where an arrow came down
          }
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

      // ---------- things that happen later ----------

      // A list of jobs that wait for their time. later(0.3, fn) means "call fn in 0.3 seconds".
      // fn can be any function, even a tiny one written on the spot:  later(0.5, () => addFloater(...));
      const timers = [];

      function later(delay, fn) {
        // 1. TODO: timers.push({ left: delay, fn });
      }

      // Count all waiting jobs down and run the ones whose time has come.
      function updateTimers(dt) {
        // 2. TODO: three steps:
        //    a) subtract dt from every t.left      b) due = the jobs with t.left <= 0, and remove those from timers (count backwards, splice)
        //    c) run them:  for (const t of due) { t.fn(); }
      }

      // ---------- buffs ----------

      // A little blue shield, 8 x 8 pixels, for the skill bar and the buff badge.
      const SHIELD_ART = [
        '.nuuuun.',
        'nuCCCCun',
        'nuCffCun',
        'nuCffCun',
        '.nuCCun.',
        '.nuCCun.',
        '..nuun..',
        '...nn...',
      ];

      // A buff is a power-up that lasts a few seconds. The hero keeps the running ones in player.buffs:
      //   player.buffs = { battleCry: 6.5 }   means "Battle Cry has 6.5 seconds left". No entry means "not active".
      // This table only says how a buff LOOKS (name, icon, color, and optionally an aura animation). What a buff DOES is decided by the functions that read it.
      const BUFFS = {
        battleCry: { name: 'Battle Cry', icon: game.art.icons.star, color: [255, 170, 60], aura: game.art.fx.rage },
        manaShield: { name: 'Mana Shield', icon: SHIELD_ART, color: [90, 160, 255], aura: game.art.fx.shield },
      };

      // Start a buff, or refresh it to the full time if it is already running.
      function addBuff(name, seconds) {
        player.buffs[name] = seconds;
      }

      // Is this buff running right now?
      function hasBuff(name) {
        return (player.buffs[name] || 0) > 0;           // a missing entry is undefined, and || 0 turns that into 0
      }

      // Count every running buff down and remove the ones that ran out.
      function updateBuffs(dt) {
        for (const name in player.buffs) {
          player.buffs[name] -= dt;
          if (player.buffs[name] <= 0) { delete player.buffs[name]; }
        }
      }

      // How hard the hero hits right now. Every attack and skill asks this function instead of reading player.atk.
      function attackPower() {
        const bonus = hasBuff('battleCry') ? 1.5 : 1;     // Battle Cry: +50% damage
        return Math.round(player.atk * bonus);
      }

      // How much of a blow really arrives. Buffs can make it smaller. At least 1 point always gets through.
      function damageTaken(dmg) {
        if (hasBuff('battleCry')) { dmg = dmg * 0.6; }    // Battle Cry: 40% less damage
        return Math.max(1, Math.round(dmg));
      }

      // Mana Shield: a blow drains magic points instead of hit points, one MP for every point of damage.
      // If the magic points run out, the shield breaks and the rest of the blow hurts the hero as usual.
      // Returns the damage that is left for the hit points.
      function absorbWithShield(dmg) {
        if (!hasBuff('manaShield')) { return dmg; }
        const absorbed = Math.min(Math.floor(player.mp), dmg);      // whole magic points only
        player.mp -= absorbed;
        if (absorbed > 0) { addFloater(player.x + player.w / 2, player.y - 18, '-' + absorbed + ' MP', game.CYAN); }
        if (absorbed < dmg) {                                       // not enough magic points: the shield breaks
          delete player.buffs.manaShield;
          addFloater(player.x + player.w / 2, player.y - 30, 'Shield broke!', game.BLUE, 10);
        }
        return dmg - absorbed;
      }

      // An aura around the hero for every running buff. A buff with an aura animation (BUFFS[name].aura, a list of frames)
      // plays it in a loop for as long as the buff lasts. A buff without one gets a soft pulsing glow in its color.
      function drawBuffAuras() {
        const cx = player.x + player.w / 2;
        const cy = player.y + player.h / 2;
        for (const name in player.buffs) {
          const buff = BUFFS[name];
          if (buff.aura) {
            const frame = frameLoop(buff.aura, game.time());              // frameLoop: the animation repeats as long as the buff lasts
            const size = game.spriteSize(frame);
            game.sprite(cx - size.w / 2, cy - size.h / 2, frame);
          } else {
            game.alpha(0.2 + 0.1 * Math.sin(game.time() * 8));
            game.circle(cx, cy, 15, buff.color);
          }
        }
        game.alpha(1);
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

      // ---------- the warrior's skills ----------

      // The icon of the Shockwave on the skill bar: a crescent of light, 8 x 12 pixels. (The wave that flies over the ground is the
      // animation game.art.fx.shockwave, a list of 4 frames.)
      const WAVE_ART = [
        'OO......',
        'OFO.....',
        '.OFO....',
        '.OFFO...',
        '..OFYO..',
        '..OFWYO.',
        '..OFWYO.',
        '..OFYO..',
        '.OFFO...',
        '.OFO....',
        'OFO.....',
        'OO......',
      ];

      // The warrior fights up close, so all three skills are about being right in the enemy's face.
      // They take their numbers from attackPower(), so Battle Cry also makes the other two stronger.
      function warriorSkills() {
        return [
          {
            name: 'Power Strike', key: 'x', cost: 6, cooldown: 3, icon: game.art.icons.slash,
            cast(p) {
              const box = attackBox(34);
              damageArea(box.x, box.y, box.w, box.h, attackPower() * 3, 300);       // triple damage, big knockback
              spawnEffect(p.facing > 0 ? p.x + p.w + 17 : p.x - 17, p.y + p.h / 2, game.art.fx.slash, { scale: 2, center: true, flip: p.facing < 0, life: 0.3 });   // the slash animation (every hit adds a spark by itself)
              addFloater(p.x + p.w / 2, p.y - 12, 'POWER!', game.ORANGE, 12);
            },
          },
          {
            name: 'Shockwave', key: 'a', cost: 8, cooldown: 4, icon: WAVE_ART,
            cast(p) {
              const size = game.spriteSize(game.art.fx.shockwave[0]);       // the size of the first frame
              spawnProjectile({
                x: p.facing > 0 ? p.x + p.w : p.x - size.w,
                y: p.y + p.h - size.h,                 // along the ground: the bottom of the wave is at the hero's feet
                vx: p.facing * 170,
                dmg: attackPower() * 2,
                art: game.art.fx.shockwave, life: 0.9, pierce: true,      // a list of frames: drawProjectiles loops it with frameLoop
              });
            },
          },
          {
            name: 'Battle Cry', key: 's', cost: 10, cooldown: 20, icon: game.art.icons.star,
            cast(p) {
              addBuff('battleCry', 8);                                             // 8 seconds of +50% damage and -40% damage taken
              addFloater(p.x + p.w / 2, p.y - 14, 'BATTLE CRY!', game.ORANGE, 13, 1.3);
              spawnEffect(p.x + p.w / 2, p.y + p.h / 2, game.art.fx.explosion, { scale: 2, center: true, life: 0.4 });   // a burst of power (the aura is drawn by drawBuffAuras)
            },
          },
        ];
      }

      // ---------- the archer's skills ----------

      // An arrow that points DOWN, 3 x 9 pixels, for the Arrow Rain (the normal arrow picture points to the right).
      const RAIN_ART = [
        'r.r',
        '.r.',
        '.w.',
        '.w.',
        '.w.',
        '.w.',
        'NNN',
        '.N.',
        '.N.',
      ];

      // The icon of the Evasion Dash: two arrow heads that point to the right, like speed lines.
      const DASH_ART = [
        '........',
        'LL..LL..',
        '.LL..LL.',
        '..LL..LL',
        '.LL..LL.',
        'LL..LL..',
        '........',
        '........',
      ];

      // A puff of smoke at the hero's feet. The Evasion Dash leaves a trail of them.
      function dashPuff() {
        spawnEffect(player.x + player.w / 2, player.y + player.h - 6, game.art.fx.poof, { center: true, life: 0.35 });
      }

      // Start a dash: for 'time' seconds the hero flies sideways at 'speed', cannot be steered and cannot be hurt.
      function startDash(dir, speed, time) {
        // 7. TODO: player.dash = time;  player.dashDir = dir;  player.dashSpeed = speed;
        //    player.invincible = Math.max(player.invincible, time + 0.2);  player.stun = 0;
      }

      // One arrow from the bow. 'drift' is the vertical speed: negative drifts up, positive drifts down.
      function fireArrow(drift) {
        spawnEffect(player.facing > 0 ? player.x + player.w : player.x, player.y + 9, game.art.fx.spark, { center: true, life: 0.2 });   // a spark at the bow
        spawnProjectile({
          x: player.facing > 0 ? player.x + player.w : player.x - 10,
          y: player.y + 6,
          vx: player.facing * 300,
          vy: drift,
          dmg: attackPower() * 2,
          art: game.art.icons.arrow,
          life: 0.8,
        });
      }

      // One arrow of the rain: starts at (x, y) high up, falls straight down and gets faster.
      function dropArrow(x, y) {
        spawnProjectile({
          x, y, vx: 0, vy: 80, gravity: 700, dmg: Math.round(attackPower() * 1.5), art: RAIN_ART, life: 1,
          onEnd(p) { spawnEffect(p.x + p.w / 2, p.y + p.h - 2, game.art.fx.spark, { center: true, life: 0.25 }); },   // a spark where the arrow comes down
        });
      }

      // The archer is about timing and position: shots that come one after the other, a volley that lands later, and a dash to stay out of reach.
      function archerSkills() {
        return [
          {
            name: 'Double Shot', key: 'x', cost: 5, cooldown: 2, icon: game.art.icons.arrow,
            cast(p) {
              // 5. TODO: fireArrow(-14);   and the second one later:   later(0.12, () => fireArrow(14));
            },
          },
          {
            name: 'Arrow Rain', key: 'a', cost: 12, cooldown: 10, icon: RAIN_ART,
            cast(p) {
              // 6. TODO: const centerX = p.x + p.w / 2 + p.facing * 90;  const topY = p.y - 90;  and a floater 'ARROW RAIN' (green) at centerX
              //    then a loop, i from 0 to 11:  const offset = ((i * 37) % 90) - 45;  later(i * 0.08, () => dropArrow(centerX + offset, topY));
            },
          },
          {
            name: 'Evasion Dash', key: 's', cost: 8, cooldown: 5, icon: DASH_ART,
            cast(p) {
              // 10. TODO: dashPuff();  startDash(-p.facing, 260, 0.18);  and a floater 'DASH' (green, size 11) above the hero
            },
          },
        ];
      }

      // ---------- the mage's skills ----------

      // The mage is fragile, so the skills are about distance, crowds and staying alive. They cost more magic points than the warrior's.
      function mageSkills() {
        return [
          {
            name: 'Fireball', key: 'x', cost: 6, cooldown: 2, icon: game.art.icons.fireball,
            cast(p) {
              spawnProjectile({
                x: p.facing > 0 ? p.x + p.w : p.x - 16,
                y: p.y + 4,
                vx: p.facing * 190,
                dmg: attackPower() * 3,
                art: game.art.fx.fireball, life: 1.2,                  // a list of frames: it flickers while it flies
                onHit(shot, target) {
                  // BOOM: everything within 36 pixels of the impact is hurt, and pushed away from the explosion
                  const cx = shot.x + shot.w / 2;
                  const cy = shot.y + shot.h / 2;
                  for (const m of monstersNear(cx, cy, 36)) { damageMonster(m, shot.dmg, cx); }
                  spawnEffect(cx, cy, game.art.fx.explosion, { scale: 2, center: true, life: 0.4 });   // the explosion animation, centered on the impact
                },
              });
            },
          },
          {
            name: 'Ice Nova', key: 'a', cost: 12, cooldown: 8, icon: game.art.icons.ice,
            cast(p) {
              const cx = p.x + p.w / 2;
              const cy = p.y + p.h / 2;
              for (const m of monstersNear(cx, cy, 56)) {
                damageMonster(m, attackPower(), cx);               // first the damage ...
                if (m.alive) { freezeMonster(m, 2); }                  // ... then the ice: 2 seconds
              }
              spawnEffect(cx, cy, game.art.fx.iceNova, { scale: 3, center: true, life: 0.5 });   // a ring of ice grows around the hero
              addFloater(cx, p.y - 14, 'ICE NOVA', game.CYAN, 12);
            },
          },
          {
            name: 'Mana Shield', key: 's', cost: 14, cooldown: 25, icon: SHIELD_ART,
            cast(p) {
              addBuff('manaShield', 10);                               // 10 seconds in which magic points take the blows
              addFloater(p.x + p.w / 2, p.y - 14, 'MANA SHIELD', game.BLUE, 12, 1.2);
              spawnEffect(p.x + p.w / 2, p.y + p.h / 2, game.art.fx.shield, { scale: 2, center: true, life: 0.4 });   // a bubble pops out (the aura is drawn by drawBuffAuras)
            },
          },
        ];
      }

      // The skills of every class. Each class gets its own list, so later each can be changed on its own.
      const SKILLS = {
        warrior: warriorSkills(),
        mage: mageSkills(),
        archer: archerSkills(),
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
        // 8. TODO: if (player.dash > 0) {  player.vx = player.dashDir * player.dashSpeed;  and an afterimage:
        //          spawnEffect(player.x - 3, player.y - 2, heroArt.walk1, { flip: player.facing < 0, life: 0.2 });
        //          and a puff of smoke on every third frame:  if (Math.floor(player.dash * 60) % 3 === 0) { dashPuff(); }   then return; }
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
        updateBuffs(dt);                                                                     // and every buff timer
        // 2b. TODO: updateTimers(dt);
        // 9. TODO: player.dash = Math.max(0, player.dash - dt);
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
      const SLOT_W = 100;                // the skill slots are wider now, because names like 'Power Strike' are long

      function drawSkillBar() {
        const skills = SKILLS[player.cls];
        for (let i = 0; i < skills.length; i++) {
          const s = skills[i];
          const x = 6 + i * 104;
          const y = 212;
          game.alpha(0.6);
          game.rect(x, y, SLOT_W, 24, game.BLACK);
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
            game.rect(x, y, SLOT_W * fraction, 24, game.DARK);             // a dark curtain that shrinks while time passes
            game.alpha(1);
            hudText(x + 6, y + 6, left.toFixed(1), game.WHITE, 11);    // and the seconds that are left
          }
        }
      }

      // One little badge for every running buff, under the stats panel: its icon and the seconds that are left.
      function drawBuffs() {
        let x = 6;
        for (const name in player.buffs) {
          const buff = BUFFS[name];
          const left = player.buffs[name];
          game.alpha(0.6);
          game.rect(x, 66, 44, 18, game.BLACK);                                // the dark badge
          game.alpha(1);
          const blink = left < 2 && Math.floor(left * 6) % 2 === 0;            // in the last two seconds the icon blinks
          game.sprite(x + 1, 67, buff.icon, { scale: 2, alpha: blink ? 0.4 : 1 });
          hudText(x + 20, 71, Math.ceil(left) + 's', buff.color, 11);          // 6.5 seconds left shows as 7s
          x += 48;                                                             // the next badge goes to the right
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
        drawBuffs();
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
        drawBuffAuras();
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
    frames: 10
    keys:
      - { key: enter, from: 2, to: 3 }
    expect: |
      (() => {
        applyClass('archer');   // a fresh game as the archer (choosing a hero with the keys was tested in step 9)
        const reset = () => { player.mp = player.maxMp; player.cooldowns = [0, 0, 0]; player.buffs = {}; player.invincible = 0; player.stun = 0; player.dash = 0; player.facing = 1; player.hp = player.maxHp; projectiles.length = 0; timers.length = 0; };
        const place = (m, dx) => { m.alive = true; m.hp = m.maxHp = 100; m.hurt = 0; m.knock = 0; m.frozen = 0; m.x = player.x + player.w + dx; m.y = player.y + player.h - m.h; };
        const slime = monsters.find(x => x.type === 'slime');
        const skel = monsters.find(x => x.type === 'skeleton');
        // 1. later(): jobs run once, in the order of their time, and a job may plan another job
        timers.length = 0;
        const log = [];
        later(0.5, () => log.push('a')); later(0.2, () => log.push('b'));
        updateTimers(0.1);
        if (log.length !== 0) { return false; }
        updateTimers(0.15);
        if (log.join() !== 'b') { return false; }
        updateTimers(0.3);
        updateTimers(1);
        if (log.join() !== 'b,a' || timers.length !== 0) { return false; }
        later(0.1, () => later(0.1, () => log.push('c')));
        updateTimers(0.15); updateTimers(0.15);
        if (log[2] !== 'c') { return false; }
        // 2. Double Shot: one arrow now, the second one later and drifting the other way
        reset();
        if (useSkill(0) !== true || projectiles.length !== 1) { return false; }
        for (let i = 0; i < 12; i++) { update(1 / 60); }     // the real update must run the planned jobs
        if (projectiles.length !== 2 || projectiles[0].vy === projectiles[1].vy || projectiles[0].vx !== projectiles[1].vx) { return false; }
        // 3. Arrow Rain: the arrows are planned for later, then fall faster and faster and hurt monsters in the area
        reset(); player.atk = 4;
        place(slime, 85); place(skel, 260);
        if (useSkill(1) !== true || timers.length < 8 || projectiles.length > 3) { return false; }
        let fell = false;
        for (let i = 0; i < 100; i++) {
          updateTimers(1 / 60);
          const f = projectiles.find(p => p.gravity > 0 && p.vy > 80);
          if (f) { fell = true; }
          updateProjectiles(1 / 60);
        }
        const lost = 100 - slime.hp;
        if (!fell || lost < 6 || lost % 6 !== 0 || skel.hp !== 100 || timers.length !== 0 || projectiles.length !== 0) { return false; }
        // 4. Evasion Dash: flies backwards, cannot be hurt, ends by itself
        reset(); player.x = 200; player.vx = 0;
        const x0 = player.x;
        if (useSkill(2) !== true || !(player.dash > 0) || !(player.invincible > 0.18)) { return false; }
        place(slime, -10); slime.x = player.x;
        checkMonsterHits();
        if (player.hp !== player.maxHp) { return false; }
        slime.x = 900;
        for (let i = 0; i < 20; i++) { update(1 / 60); }
        const moved = x0 - player.x;
        if (!(moved > 30 && moved < 60) || player.dash !== 0 || player.facing !== 1 || player.hp !== player.maxHp) { return false; }
        // 5. the HUD names
        reset();
        const texts = [];
        const text0 = game.text;
        game.text = (...args) => { texts.push(String(args[2])); return text0(...args); };
        try { draw(); } finally { game.text = text0; }
        return ['Double Shot', 'Arrow Rain', 'Evasion Dash'].every(t => texts.includes(t));
      })()
    message: "Check the planner and the three skills of the archer. later(delay, fn) must store a job and updateTimers(dt) must run each job once when its time has come (and be called in update). Double Shot: one arrow at once, the second after about 0.12 seconds with a different drift. Arrow Rain: about 12 arrows planned with later(), projectiles need a gravity option so they speed up while falling (store opts.gravity and do p.vy += p.gravity * dt), and monsters in the area ahead must get hurt. Evasion Dash: startDash must set player.dash, dashDir, dashSpeed and invincible; handleInput must move the hero with the dash speed while player.dash > 0, and update must count the dash timer down."
  code:
    - { pattern: 'later\s*\(', message: "Use later(delay, fn) to schedule the second arrow and the rain." }
    - { pattern: 'gravity', message: "Falling arrows need a gravity option." }
    - { pattern: 'startDash\s*\(', message: "Evasion Dash must call startDash." }
hints:
  - "Ten TODOs. First the scheduler (later, updateTimers, and calling updateTimers in update), then gravity for projectiles (store it and apply it), then the dash (startDash, the dash branch in handleInput, the dash timer in update), then the three casts that use them."
  - "later: timers.push({ left: delay, fn });  updateTimers: subtract dt from every t.left, build const due = timers.filter(t => t.left <= 0), remove those from timers with a backwards loop and splice, then run each with t.fn().  Double Shot: fireArrow(-14); later(0.12, () => fireArrow(14));  Arrow Rain: a for loop with later(i * 0.08, () => dropArrow(centerX + offset, topY));  Dash: dashPuff(); startDash(-p.facing, 260, 0.18);"
  - "gravity: store gravity: opts.gravity || 0 in spawnProjectile and add p.vy += p.gravity * dt; before p.y += p.vy * dt; in updateProjectiles.  startDash: player.dash = time; player.dashDir = dir; player.dashSpeed = speed; player.invincible = Math.max(player.invincible, time + 0.2); player.stun = 0;  handleInput, first lines: if (player.dash > 0) { player.vx = player.dashDir * player.dashSpeed; spawnEffect(player.x - 3, player.y - 2, heroArt.walk1, { flip: player.facing < 0, life: 0.2 }); if (Math.floor(player.dash * 60) % 3 === 0) { dashPuff(); } return; }  update: updateTimers(dt); player.dash = Math.max(0, player.dash - dt);"
solution:
  - name: main.js
    code: |
      // Step 13: archer skills.
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
        buffs: {},        // running power-ups: { buffName: seconds left }, for example { battleCry: 6.5 }
        dash: 0,          // seconds left of a dash (0 = not dashing)
        dashDir: 1,       // which way the dash goes: 1 right, -1 left
        dashSpeed: 0,     // how fast the dash is, in pixels per second
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
        player.buffs = {};
        player.dash = 0;
        timers.length = 0;                         // forget everything that was planned for later
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
          frozen: 0,                    // seconds left as a block of ice (status effect, see freezeMonster)
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
        m.hurt = Math.max(0, m.hurt - dt);
        if (m.frozen > 0) {                             // frozen solid: no animation, no walking, no sliding
          m.frozen = Math.max(0, m.frozen - dt);
          if (m.frozen === 0) { spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.spark, { scale: 2, center: true, life: 0.3 }); }   // the ice cracks
          return;
        }
        m.animTime += dt;
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

      // An icy copy of a picture: the outline becomes dark blue and everything else light blue. Frozen monsters are drawn with it.
      const iceCache = new Map();
      function iceArt(art) {
        if (!iceCache.has(art)) {
          iceCache.set(art, art.map(row => row.replace(/K/g, 'n').replace(/[^. n]/g, 'f')));
        }
        return iceCache.get(art);
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
          if (m.frozen > 0) { art = iceArt(art); }                     // frozen: icy colors
          else if (m.hurt > 0.15) { art = flashArt(art); }             // the first moments after a hit: white flash
          game.sprite(m.x + def.ox, m.y + def.oy, art, { flip: m.dir < 0 });
          if (m.frozen > 0) {                                          // and a see-through crystal on top
            game.sprite(m.x + m.w / 2 - 8, m.y + m.h / 2 - 8, game.art.icons.ice, { scale: 2, alpha: 0.45 });
          }
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
        let dmg = damageTaken(MONSTERS[m.type].dmg);               // buffs can make the blow smaller
        dmg = absorbWithShield(dmg);                               // Mana Shield: magic points soak up the blow first
        player.hp -= dmg;
        player.invincible = 1.2;                                 // no more damage for 1.2 seconds
        player.stun = 0.25;                                      // knockback: we cannot steer for a moment
        const monsterIsRight = m.x + m.w / 2 > player.x + player.w / 2;
        player.vx = monsterIsRight ? -110 : 110;                 // fly away from the monster
        player.vy = -170;
        player.onGround = false;
        if (dmg > 0) { addFloater(player.x + player.w / 2, player.y - 6, '-' + dmg, game.RED); }
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
          if (m.alive && m.frozen <= 0 && touching(player.x, player.y, player.w, player.h, m.x, m.y, m.w, m.h)) {     // a frozen monster is harmless
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
      // knock is how hard it is pushed (pixels per second). Normal hits push with 110, heavy hits can push harder.
      function damageMonster(m, dmg, fromX, knock = 110) {
        if (m.frozen > 0) {                                        // hitting ice shatters it: double damage, and the ice is gone
          dmg = dmg * 2;
          m.frozen = 0;
          addFloater(m.x + m.w / 2, m.y - 18, 'SHATTER!', game.CYAN, 10);
          spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.spark, { scale: 2, center: true, life: 0.3 });     // the ice shatters
        }
        m.hp -= dmg;
        m.hurt = 0.25;                                             // flash + freeze for a quarter of a second
        m.knock = m.x + m.w / 2 > fromX ? knock : -knock;          // slide away from the blow
        addFloater(m.x + m.w / 2, m.y - 8, dmg, game.WHITE);       // show the number
        spawnEffect(clamp(fromX, m.x, m.x + m.w), m.y + m.h / 2, game.art.fx.spark, { center: true, life: 0.2 });   // a spark where the blow landed
        if (m.hp <= 0) {
          m.alive = false;                                         // dead monsters are skipped everywhere
          spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { center: true, life: 0.4 });   // ... and it vanishes in a puff of smoke
          gainXp(MONSTERS[m.type].xp);                             // the reward: experience ...
          dropCoins(m);                                            // ... and coins
        }
      }

      // Hit every living monster that touches the box. Returns how many were hit. knock is optional, see damageMonster.
      function hitMonsters(box, dmg, knock) {
        let hits = 0;
        for (const m of monsters) {
          if (m.alive && touching(box.x, box.y, box.w, box.h, m.x, m.y, m.w, m.h)) {
            damageMonster(m, dmg, player.x + player.w / 2, knock);
            hits++;
          }
        }
        return hits;
      }

      // Hit every monster in the rectangle (x, y, w, h). The skills use this: "damage everything in this area".
      function damageArea(x, y, w, h, dmg, knock) {
        return hitMonsters({ x, y, w, h }, dmg, knock);
      }

      // All living monsters whose center is closer than 'radius' to the point (cx, cy): a circle instead of a box.
      function monstersNear(cx, cy, radius) {
        const found = [];
        for (const m of monsters) {
          if (!m.alive) { continue; }
          const dx = m.x + m.w / 2 - cx;
          const dy = m.y + m.h / 2 - cy;
          if (Math.hypot(dx, dy) <= radius) { found.push(m); }      // Math.hypot(dx, dy) is the length of the diagonal
        }
        return found;
      }

      // Freeze a monster for some seconds: a status effect. updateMonster skips its thinking while m.frozen is above 0.
      function freezeMonster(m, seconds) {
        m.frozen = seconds;
        m.knock = 0;                                                // it stops sliding at once
      }

      // Start an attack when z is held, the cooldown is over and we are not already swinging.
      function tryAttack() {
        if (!game.keyDown('z') || player.cooldown > 0) { return; }
        const atk = classData().attack;                              // how the attack of this class works
        player.attackTimer = atk.time;
        player.cooldown = atk.cooldown;
        if (atk.style === 'melee') {
          hitMonsters(attackBox(atk.reach), attackPower());        // attackPower() instead of player.atk: buffs count now
        } else {
          shootBasic(atk);
        }
      }

      // ---------- projectiles ----------

      // Create a projectile. opts: { x, y, vx, vy, gravity, dmg, art, life, pierce, onHit, onEnd }
      //   x, y: top-left corner     vx, vy: speed in pixels per second (vy is optional, 0 = flies straight)
      //   life: seconds in the air  pierce: true = it flies on through monsters instead of stopping at the first
      //   gravity: optional, how fast vy grows (pixels per second, every second). 0 = flies straight, 700 = falls like a stone.
      //   onHit: optional function (projectile, monster). If there is one, it is called INSTEAD of the normal damage, and decides what happens.
      //   onEnd: optional function (projectile). It is called once when the projectile is used up: it hit something, hit a wall or ran out of life.
      function spawnProjectile(opts) {
        const size = game.spriteSize(firstFrame(opts.art));   // an animated projectile has a list of pictures: measure the first one
        projectiles.push({
          x: opts.x, y: opts.y, vx: opts.vx, vy: opts.vy || 0,
          w: size.w, h: size.h,
          dmg: opts.dmg, art: opts.art, life: opts.life,
          age: 0,                          // seconds in the air: an animated projectile uses it to pick its frame
          pierce: !!opts.pierce,
          gravity: opts.gravity || 0,    // gravity pulls the projectile down (0 for arrows and bolts that fly straight)
          hit: [],                       // the monsters this projectile has already hurt
          onHit: opts.onHit,             // a function to call when it touches a monster (or undefined)
          onEnd: opts.onEnd,             // a function to call when the projectile is used up (or undefined)
        });
      }

      // The basic attack of the ranged classes: a projectile that leaves the hero's front.
      function shootBasic(atk) {
        const size = game.spriteSize(atk.art);
        spawnProjectile({
          x: player.facing > 0 ? player.x + player.w : player.x - size.w,
          y: player.y + 6,
          vx: player.facing * atk.speed,
          dmg: attackPower(),
          art: atk.art,
          life: atk.life,
        });
      }

      // Move every projectile, let it hit monsters and walls, and remove the used ones.
      function updateProjectiles(dt) {
        for (const p of projectiles) {
          p.x += p.vx * dt;
          p.age += dt;
          p.vy += p.gravity * dt;                                    // gravity makes it faster and faster downwards
          p.y += p.vy * dt;
          p.life -= dt;
          if (solidAt(Math.floor((p.x + p.w / 2) / TILE), Math.floor((p.y + p.h / 2) / TILE))) { p.life = 0; }   // it hit a wall
          for (const m of monsters) {
            if (p.life > 0 && m.alive && !p.hit.includes(m) && touching(p.x, p.y, p.w, p.h, m.x, m.y, m.w, m.h)) {
              if (p.onHit) { p.onHit(p, m); } else { damageMonster(m, p.dmg, p.x); }    // a special effect, or the normal damage
              p.hit.push(m);                                         // never hurt the same monster twice
              if (!p.pierce) { p.life = 0; }                         // a normal projectile is used up by its first hit
            }
          }
        }
        for (let i = projectiles.length - 1; i >= 0; i--) {
          if (projectiles[i].life <= 0) {
            const used = projectiles[i];
            projectiles.splice(i, 1);
            if (used.onEnd) { used.onEnd(used); }                        // for example a spark where an arrow came down
          }
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

      // ---------- things that happen later ----------

      // A list of jobs that wait for their time. later(0.3, fn) means "call fn in 0.3 seconds".
      // fn can be any function, even a tiny one written on the spot:  later(0.5, () => addFloater(...));
      const timers = [];

      function later(delay, fn) {
        timers.push({ left: delay, fn });
      }

      // Count all waiting jobs down and run the ones whose time has come.
      function updateTimers(dt) {
        for (const t of timers) { t.left -= dt; }
        const due = timers.filter(t => t.left <= 0);                 // the jobs that are ready
        for (let i = timers.length - 1; i >= 0; i--) {
          if (timers[i].left <= 0) { timers.splice(i, 1); }          // take them out of the list first ...
        }
        for (const t of due) { t.fn(); }                             // ... and then run them (a job may call later() itself)
      }

      // ---------- buffs ----------

      // A little blue shield, 8 x 8 pixels, for the skill bar and the buff badge.
      const SHIELD_ART = [
        '.nuuuun.',
        'nuCCCCun',
        'nuCffCun',
        'nuCffCun',
        '.nuCCun.',
        '.nuCCun.',
        '..nuun..',
        '...nn...',
      ];

      // A buff is a power-up that lasts a few seconds. The hero keeps the running ones in player.buffs:
      //   player.buffs = { battleCry: 6.5 }   means "Battle Cry has 6.5 seconds left". No entry means "not active".
      // This table only says how a buff LOOKS (name, icon, color, and optionally an aura animation). What a buff DOES is decided by the functions that read it.
      const BUFFS = {
        battleCry: { name: 'Battle Cry', icon: game.art.icons.star, color: [255, 170, 60], aura: game.art.fx.rage },
        manaShield: { name: 'Mana Shield', icon: SHIELD_ART, color: [90, 160, 255], aura: game.art.fx.shield },
      };

      // Start a buff, or refresh it to the full time if it is already running.
      function addBuff(name, seconds) {
        player.buffs[name] = seconds;
      }

      // Is this buff running right now?
      function hasBuff(name) {
        return (player.buffs[name] || 0) > 0;           // a missing entry is undefined, and || 0 turns that into 0
      }

      // Count every running buff down and remove the ones that ran out.
      function updateBuffs(dt) {
        for (const name in player.buffs) {
          player.buffs[name] -= dt;
          if (player.buffs[name] <= 0) { delete player.buffs[name]; }
        }
      }

      // How hard the hero hits right now. Every attack and skill asks this function instead of reading player.atk.
      function attackPower() {
        const bonus = hasBuff('battleCry') ? 1.5 : 1;     // Battle Cry: +50% damage
        return Math.round(player.atk * bonus);
      }

      // How much of a blow really arrives. Buffs can make it smaller. At least 1 point always gets through.
      function damageTaken(dmg) {
        if (hasBuff('battleCry')) { dmg = dmg * 0.6; }    // Battle Cry: 40% less damage
        return Math.max(1, Math.round(dmg));
      }

      // Mana Shield: a blow drains magic points instead of hit points, one MP for every point of damage.
      // If the magic points run out, the shield breaks and the rest of the blow hurts the hero as usual.
      // Returns the damage that is left for the hit points.
      function absorbWithShield(dmg) {
        if (!hasBuff('manaShield')) { return dmg; }
        const absorbed = Math.min(Math.floor(player.mp), dmg);      // whole magic points only
        player.mp -= absorbed;
        if (absorbed > 0) { addFloater(player.x + player.w / 2, player.y - 18, '-' + absorbed + ' MP', game.CYAN); }
        if (absorbed < dmg) {                                       // not enough magic points: the shield breaks
          delete player.buffs.manaShield;
          addFloater(player.x + player.w / 2, player.y - 30, 'Shield broke!', game.BLUE, 10);
        }
        return dmg - absorbed;
      }

      // An aura around the hero for every running buff. A buff with an aura animation (BUFFS[name].aura, a list of frames)
      // plays it in a loop for as long as the buff lasts. A buff without one gets a soft pulsing glow in its color.
      function drawBuffAuras() {
        const cx = player.x + player.w / 2;
        const cy = player.y + player.h / 2;
        for (const name in player.buffs) {
          const buff = BUFFS[name];
          if (buff.aura) {
            const frame = frameLoop(buff.aura, game.time());              // frameLoop: the animation repeats as long as the buff lasts
            const size = game.spriteSize(frame);
            game.sprite(cx - size.w / 2, cy - size.h / 2, frame);
          } else {
            game.alpha(0.2 + 0.1 * Math.sin(game.time() * 8));
            game.circle(cx, cy, 15, buff.color);
          }
        }
        game.alpha(1);
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

      // ---------- the warrior's skills ----------

      // The icon of the Shockwave on the skill bar: a crescent of light, 8 x 12 pixels. (The wave that flies over the ground is the
      // animation game.art.fx.shockwave, a list of 4 frames.)
      const WAVE_ART = [
        'OO......',
        'OFO.....',
        '.OFO....',
        '.OFFO...',
        '..OFYO..',
        '..OFWYO.',
        '..OFWYO.',
        '..OFYO..',
        '.OFFO...',
        '.OFO....',
        'OFO.....',
        'OO......',
      ];

      // The warrior fights up close, so all three skills are about being right in the enemy's face.
      // They take their numbers from attackPower(), so Battle Cry also makes the other two stronger.
      function warriorSkills() {
        return [
          {
            name: 'Power Strike', key: 'x', cost: 6, cooldown: 3, icon: game.art.icons.slash,
            cast(p) {
              const box = attackBox(34);
              damageArea(box.x, box.y, box.w, box.h, attackPower() * 3, 300);       // triple damage, big knockback
              spawnEffect(p.facing > 0 ? p.x + p.w + 17 : p.x - 17, p.y + p.h / 2, game.art.fx.slash, { scale: 2, center: true, flip: p.facing < 0, life: 0.3 });   // the slash animation (every hit adds a spark by itself)
              addFloater(p.x + p.w / 2, p.y - 12, 'POWER!', game.ORANGE, 12);
            },
          },
          {
            name: 'Shockwave', key: 'a', cost: 8, cooldown: 4, icon: WAVE_ART,
            cast(p) {
              const size = game.spriteSize(game.art.fx.shockwave[0]);       // the size of the first frame
              spawnProjectile({
                x: p.facing > 0 ? p.x + p.w : p.x - size.w,
                y: p.y + p.h - size.h,                 // along the ground: the bottom of the wave is at the hero's feet
                vx: p.facing * 170,
                dmg: attackPower() * 2,
                art: game.art.fx.shockwave, life: 0.9, pierce: true,      // a list of frames: drawProjectiles loops it with frameLoop
              });
            },
          },
          {
            name: 'Battle Cry', key: 's', cost: 10, cooldown: 20, icon: game.art.icons.star,
            cast(p) {
              addBuff('battleCry', 8);                                             // 8 seconds of +50% damage and -40% damage taken
              addFloater(p.x + p.w / 2, p.y - 14, 'BATTLE CRY!', game.ORANGE, 13, 1.3);
              spawnEffect(p.x + p.w / 2, p.y + p.h / 2, game.art.fx.explosion, { scale: 2, center: true, life: 0.4 });   // a burst of power (the aura is drawn by drawBuffAuras)
            },
          },
        ];
      }

      // ---------- the archer's skills ----------

      // An arrow that points DOWN, 3 x 9 pixels, for the Arrow Rain (the normal arrow picture points to the right).
      const RAIN_ART = [
        'r.r',
        '.r.',
        '.w.',
        '.w.',
        '.w.',
        '.w.',
        'NNN',
        '.N.',
        '.N.',
      ];

      // The icon of the Evasion Dash: two arrow heads that point to the right, like speed lines.
      const DASH_ART = [
        '........',
        'LL..LL..',
        '.LL..LL.',
        '..LL..LL',
        '.LL..LL.',
        'LL..LL..',
        '........',
        '........',
      ];

      // A puff of smoke at the hero's feet. The Evasion Dash leaves a trail of them.
      function dashPuff() {
        spawnEffect(player.x + player.w / 2, player.y + player.h - 6, game.art.fx.poof, { center: true, life: 0.35 });
      }

      // Start a dash: for 'time' seconds the hero flies sideways at 'speed', cannot be steered and cannot be hurt.
      function startDash(dir, speed, time) {
        player.dash = time;
        player.dashDir = dir;
        player.dashSpeed = speed;
        player.invincible = Math.max(player.invincible, time + 0.2);   // safe during the dash and a moment after it
        player.stun = 0;                                               // a dash also cancels a knockback
      }

      // One arrow from the bow. 'drift' is the vertical speed: negative drifts up, positive drifts down.
      function fireArrow(drift) {
        spawnEffect(player.facing > 0 ? player.x + player.w : player.x, player.y + 9, game.art.fx.spark, { center: true, life: 0.2 });   // a spark at the bow
        spawnProjectile({
          x: player.facing > 0 ? player.x + player.w : player.x - 10,
          y: player.y + 6,
          vx: player.facing * 300,
          vy: drift,
          dmg: attackPower() * 2,
          art: game.art.icons.arrow,
          life: 0.8,
        });
      }

      // One arrow of the rain: starts at (x, y) high up, falls straight down and gets faster.
      function dropArrow(x, y) {
        spawnProjectile({
          x, y, vx: 0, vy: 80, gravity: 700, dmg: Math.round(attackPower() * 1.5), art: RAIN_ART, life: 1,
          onEnd(p) { spawnEffect(p.x + p.w / 2, p.y + p.h - 2, game.art.fx.spark, { center: true, life: 0.25 }); },   // a spark where the arrow comes down
        });
      }

      // The archer is about timing and position: shots that come one after the other, a volley that lands later, and a dash to stay out of reach.
      function archerSkills() {
        return [
          {
            name: 'Double Shot', key: 'x', cost: 5, cooldown: 2, icon: game.art.icons.arrow,
            cast(p) {
              fireArrow(-14);                               // the first arrow leaves now and drifts a little upwards ...
              later(0.12, () => fireArrow(14));             // ... the second follows after 0.12 seconds and drifts downwards
            },
          },
          {
            name: 'Arrow Rain', key: 'a', cost: 12, cooldown: 10, icon: RAIN_ART,
            cast(p) {
              const centerX = p.x + p.w / 2 + p.facing * 90;        // the middle of the target area: 90 pixels ahead
              const topY = p.y - 90;                                // the arrows start high above the hero
              addFloater(centerX, p.y - 20, 'ARROW RAIN', game.GREEN, 12, 1.2);
              for (let i = 0; i < 12; i++) {
                const offset = ((i * 37) % 90) - 45;                // a scattered spot between -45 and +44, the same every time
                later(i * 0.08, () => dropArrow(centerX + offset, topY));
              }
            },
          },
          {
            name: 'Evasion Dash', key: 's', cost: 8, cooldown: 5, icon: DASH_ART,
            cast(p) {
              dashPuff();                                           // a puff of smoke where the dash starts
              startDash(-p.facing, 260, 0.18);                      // backwards, away from where you look, so you can keep shooting
              addFloater(p.x + p.w / 2, p.y - 14, 'DASH', game.GREEN, 11);
            },
          },
        ];
      }

      // ---------- the mage's skills ----------

      // The mage is fragile, so the skills are about distance, crowds and staying alive. They cost more magic points than the warrior's.
      function mageSkills() {
        return [
          {
            name: 'Fireball', key: 'x', cost: 6, cooldown: 2, icon: game.art.icons.fireball,
            cast(p) {
              spawnProjectile({
                x: p.facing > 0 ? p.x + p.w : p.x - 16,
                y: p.y + 4,
                vx: p.facing * 190,
                dmg: attackPower() * 3,
                art: game.art.fx.fireball, life: 1.2,                  // a list of frames: it flickers while it flies
                onHit(shot, target) {
                  // BOOM: everything within 36 pixels of the impact is hurt, and pushed away from the explosion
                  const cx = shot.x + shot.w / 2;
                  const cy = shot.y + shot.h / 2;
                  for (const m of monstersNear(cx, cy, 36)) { damageMonster(m, shot.dmg, cx); }
                  spawnEffect(cx, cy, game.art.fx.explosion, { scale: 2, center: true, life: 0.4 });   // the explosion animation, centered on the impact
                },
              });
            },
          },
          {
            name: 'Ice Nova', key: 'a', cost: 12, cooldown: 8, icon: game.art.icons.ice,
            cast(p) {
              const cx = p.x + p.w / 2;
              const cy = p.y + p.h / 2;
              for (const m of monstersNear(cx, cy, 56)) {
                damageMonster(m, attackPower(), cx);               // first the damage ...
                if (m.alive) { freezeMonster(m, 2); }                  // ... then the ice: 2 seconds
              }
              spawnEffect(cx, cy, game.art.fx.iceNova, { scale: 3, center: true, life: 0.5 });   // a ring of ice grows around the hero
              addFloater(cx, p.y - 14, 'ICE NOVA', game.CYAN, 12);
            },
          },
          {
            name: 'Mana Shield', key: 's', cost: 14, cooldown: 25, icon: SHIELD_ART,
            cast(p) {
              addBuff('manaShield', 10);                               // 10 seconds in which magic points take the blows
              addFloater(p.x + p.w / 2, p.y - 14, 'MANA SHIELD', game.BLUE, 12, 1.2);
              spawnEffect(p.x + p.w / 2, p.y + p.h / 2, game.art.fx.shield, { scale: 2, center: true, life: 0.4 });   // a bubble pops out (the aura is drawn by drawBuffAuras)
            },
          },
        ];
      }

      // The skills of every class. Each class gets its own list, so later each can be changed on its own.
      const SKILLS = {
        warrior: warriorSkills(),
        mage: mageSkills(),
        archer: archerSkills(),
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
        if (player.dash > 0) {                    // dashing: no steering, we just fly
          player.vx = player.dashDir * player.dashSpeed;
          spawnEffect(player.x - 3, player.y - 2, heroArt.walk1, { flip: player.facing < 0, life: 0.2 });     // a fading afterimage
          if (Math.floor(player.dash * 60) % 3 === 0) { dashPuff(); }                                          // and every third frame a puff of smoke
          return;
        }
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
        updateBuffs(dt);                                                                     // and every buff timer
        updateTimers(dt);                                                                    // run the jobs that were planned with later()
        player.dash = Math.max(0, player.dash - dt);                                         // the dash timer runs down
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
      const SLOT_W = 100;                // the skill slots are wider now, because names like 'Power Strike' are long

      function drawSkillBar() {
        const skills = SKILLS[player.cls];
        for (let i = 0; i < skills.length; i++) {
          const s = skills[i];
          const x = 6 + i * 104;
          const y = 212;
          game.alpha(0.6);
          game.rect(x, y, SLOT_W, 24, game.BLACK);
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
            game.rect(x, y, SLOT_W * fraction, 24, game.DARK);             // a dark curtain that shrinks while time passes
            game.alpha(1);
            hudText(x + 6, y + 6, left.toFixed(1), game.WHITE, 11);    // and the seconds that are left
          }
        }
      }

      // One little badge for every running buff, under the stats panel: its icon and the seconds that are left.
      function drawBuffs() {
        let x = 6;
        for (const name in player.buffs) {
          const buff = BUFFS[name];
          const left = player.buffs[name];
          game.alpha(0.6);
          game.rect(x, 66, 44, 18, game.BLACK);                                // the dark badge
          game.alpha(1);
          const blink = left < 2 && Math.floor(left * 6) % 2 === 0;            // in the last two seconds the icon blinks
          game.sprite(x + 1, 67, buff.icon, { scale: 2, alpha: blink ? 0.4 : 1 });
          hudText(x + 20, 71, Math.ceil(left) + 's', buff.color, 11);          // 6.5 seconds left shows as 7s
          x += 48;                                                             // the next badge goes to the right
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
        drawBuffs();
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
        drawBuffAuras();
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
  - q: "What does later(0.12, () => fireArrow(14)) do?"
    options: ["Fires the arrow immediately and then waits 0.12 seconds", "Stores the little function in a list; update calls it once about 0.12 seconds later", "Pauses the whole game for 0.12 seconds"]
    answer: 1
    explain: "The game never waits. A timer list with a countdown is how a game loop does 'later'."
  - q: "Why does updateTimers remove the due jobs from the list before it runs them?"
    options: ["It is faster", "A job may call later() itself, and changing a list while looping over it causes bugs", "Because jobs can only run once per second"]
    answer: 1
    explain: "First take the due jobs out, then run them. New jobs go into the list for the next frame."
  - q: "Arrow Rain arrows have vy: 80 and gravity: 700. What does that mean?"
    options: ["They fall at a constant 780 pixels per second", "They start at 80 pixels per second downwards and get 700 faster every second", "They fly sideways at 80 pixels per second"]
    answer: 1
    explain: "gravity is added to vy every frame (times dt), so the arrows speed up like a falling stone."
  - q: "Why does startDash set player.invincible for time + 0.2 seconds?"
    options: ["So the hero cannot be hurt while dashing and for a moment after landing: these are the invincibility frames", "To make the hero blink for no reason", "Because dt is always 0.2"]
    answer: 0
    explain: "I-frames are what make a dash an escape and not just a move. The extra 0.2 s keeps a monster at the landing spot from hitting you at once."
---
## Where we are

Warrior and mage have real skills. The archer is the class of **timing and position**. Its three skills play with time and space in different ways:

| Skill | Key | Cost | Cooldown | What it is for |
| --- | --- | --- | --- | --- |
| Double Shot | x | 5 MP | 2 s | Two arrows, the second one 0.12 s **later**. Cheap, fast burst damage. |
| Arrow Rain | a | 12 MP | 10 s | You pick a spot **ahead**, the arrows arrive about a second later. Great against monsters that walk into it. |
| Evasion Dash | s | 8 MP | 5 s | A quick hop **backwards** with a moment of invincibility. Defense by not being there. |

The new tools: a tiny scheduler (`later`), projectiles that fall (`gravity`), and a dash state with invincibility frames.

## 1. Doing something later

A game loop never waits. `update` runs 60 times a second, so "fire the second arrow in 0.12 seconds" cannot use a pause. Instead we keep a list of **jobs** with a countdown:

```js
later(0.12, () => fireArrow(14));
```

The second argument is a small function written on the spot (an *arrow function*, `() => ...`). `later` pushes `{ left: 0.12, fn }` into the list `timers`. Every frame `updateTimers(dt)` subtracts `dt` from each job, and when a job reaches 0 it runs `fn()`. There is one subtle point: a job may call `later` itself, so first **remove** the due jobs from the list and only then run them. `loadMap` empties `timers`, so a plan never survives a death.

The function you pass keeps its view of the world. `fireArrow` reads `player.facing` and `player.x` when the job runs, so the second arrow leaves from where the hero is **then**. Arrow Rain does the opposite on purpose: it calculates `centerX` and `topY` once when you cast, so the rain stays on the spot you chose even if you run away. (`fireArrow` also pops an `fx.spark` at the bow every time it runs, so Double Shot gives two flashes.)

## 2. Gravity for projectiles

Projectiles got `vy` in step 10. For a falling arrow add one more number, `gravity`, and one more line in `updateProjectiles`: `p.vy += p.gravity * dt;` before `p.y += p.vy * dt;`. It is the same recipe as the hero's fall. A value of `0` (the default) keeps arrows and bolts flying straight. The rain uses `vy: 80, gravity: 700`.

## 3. Arrow Rain

Twelve arrows, one every 0.08 seconds, in a loop. The sideways spot of each is `((i * 37) % 90) - 45`: the `%` (remainder) makes the numbers jump around between -45 and +44 so it looks scattered, but it is the same every time, which keeps the game testable. Every arrow is `later(i * 0.08, () => dropArrow(...))`. To see where the arrows land, `spawnProjectile` now understands `onEnd`, the twin of `onHit`: a function that `updateProjectiles` calls once when a projectile is used up (it hit a monster, the ground, or ran out of life). `dropArrow` gives each arrow an `onEnd` that shows a small `fx.spark` where it comes down.

## 4. The dash

A dash is a **state**: `player.dash` holds the seconds left, and while it is above 0, `handleInput` ignores the keys and sets `player.vx = player.dashDir * player.dashSpeed`. `startDash(dir, speed, time)` starts it and sets `player.invincible` a bit longer than the dash itself, so the blinking you already know from step 6 tells the player they are safe. A fading copy of the hero (`spawnEffect` with `heroArt.walk1`) every frame makes the afterimage trail, and every third frame `dashPuff()` adds a puff of smoke (`fx.poof`) at the feet. Casting the skill adds one more puff where the dash starts. Evasion Dash goes **backwards** (`-p.facing`): the archer keeps looking at the enemy and can shoot right after.

> **Watch out:**
> - Forgetting `updateTimers(dt)` in `update` means the second arrow and the whole rain never come.
> - Writing `later(0.12, fireArrow(14))` (without `() =>`) fires the arrow **now** and schedules `undefined`. Later you will see `TypeError: t.fn is not a function`. You must pass a function, not call it.
> - If you read `p.x` inside the rain job, the arrows follow the hero. Calculate positions before the loop if they should stay put.
> - `p.vy += p.gravity * dt` must come before `p.y += p.vy * dt`; and old projectiles have `gravity` 0 only because of `opts.gravity || 0`. Without it `undefined * dt` makes the position `NaN` and the projectile disappears.
> - Do not run the jobs while you are still looping over `timers` and removing from it. Use the `due` list.

> **Your turn:** complete the TODOs. Choose the archer. **x** sends one arrow and, a moment later, another that drifts the other way. **a** makes a green label and a shower of arrows that fall faster and faster on the area in front of you, a second after you pressed the key, each with a spark where it lands. **s** jumps you backwards in a trail of afterimages and puffs of smoke, and monsters cannot touch you while you blink. Try to kite a skeleton: dash away, turn, Double Shot, repeat.
