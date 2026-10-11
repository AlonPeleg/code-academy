---
title: "Step 15: Maps and portals"
summary: "Turn the single level into a table of four monster maps. Every map has a monster limit and a respawn timer that tops it up, portals connect the maps, and spawn puffs, fades, a map name banner and glowing portals bring them to life."
level: advanced
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 15: maps and portals.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const GRAVITY = 900;
      const MAX_FALL = 500;
      // (WALK_SPEED and JUMP_SPEED are gone: every class has its own speed and jump now.)

      let heroArt = game.art.warrior;   // the picture set of the chosen class

      // ---------- the maps ----------

      // Every map is one entry of the table MAPS. The key is the id of the map ('meadow', 'forest', ...). One entry has:
      //   name          the name shown in the banner and on the HUD
      //   rows          the tiles: 15 strings, one character per tile (see the key below)
      //   sky, far, near   background colors: the sky, the far hills and the near hills      decor: the extra background picture
      //   ground        [top picture, inner picture] of the solid # tiles: grass on dirt, plain stone, brick, ...
      //   maxMonsters   how many monsters live on the map AT MOST. The map starts with this many.
      //   respawnEvery  seconds between two top-ups: when monsters are missing, this long later the map is filled up to maxMonsters again
      //   portals       what the portal markers do. { '>': { to: 'forest', at: '<' } } means: the > portal leads to the forest, where you arrive at its < portal
      // Tile characters:
      //   #  solid ground      S  solid stone      B  solid brick
      //   =  wooden platform (you can jump up through it and stand on it)      .  empty air
      // Markers (removed when the map loads):
      //   P  where the hero starts      < >  portals      s slime   m mushroom   k skeleton   b bat
      // Every monster marker is a SPAWN POINT: a place where a monster of that kind may be born.
      const MAPS = {
        meadow: {
          name: 'Whispering Meadow',
          sky: [96, 168, 248], far: [120, 170, 190], near: [70, 150, 110], decor: 'clouds', cloud: [250, 250, 255],
          ground: [game.art.tiles.grass, game.art.tiles.dirt],
          maxMonsters: 6, respawnEvery: 15,
          portals: { '>': { to: 'forest', at: '<' } },
          rows: [
            '............................................................',
            '............................................................',
            '............................................................',
            '............................................................',
            '............................................................',
            '....................................................s.......',
            '..................................s...............=====.....',
            '...........====.................=====.......................',
            '...............................................s............',
            '...........................s.................=====..........',
            '.....====................=====...........s..................',
            '...................##.............SS....###.................',
            '..P..........s...######.s......s.SSS.s#######.....s......>..',
            '############################################################',
            '############################################################',
          ],
        },
        forest: {
          name: 'Mushroom Forest',
          sky: [52, 110, 84], far: [44, 94, 74], near: [30, 74, 54], decor: 'clouds', cloud: [112, 160, 130],
          ground: [game.art.tiles.grass, game.art.tiles.dirt],
          maxMonsters: 7, respawnEvery: 18,
          portals: { '<': { to: 'meadow', at: '>' }, '>': { to: 'cave', at: '<' } },
          rows: [
            '........................................................',
            '........................................................',
            '........................................................',
            '................m..............m........................',
            '..............======.........=====......................',
            '........................................................',
            '.........................m...........s..................',
            '.........=====.........======......=====................',
            '........................................................',
            '................m............m................s.........',
            '.....=====....======.......=====............=====.......',
            '.....................SS...............SS................',
            '..<.....m....s.......SS.....m..s..m...SSS.....m......>..',
            '########################################################',
            '########################################################',
          ],
        },
        cave: {
          name: 'Echo Cave',
          sky: [26, 24, 44], far: [42, 42, 74], near: [54, 52, 90], decor: 'stalactites',
          ground: [game.art.tiles.stone, game.art.tiles.stone],
          maxMonsters: 8, respawnEvery: 20,
          portals: { '<': { to: 'forest', at: '>' }, '>': { to: 'ruins', at: '<' } },
          rows: [
            '..........................................................',
            '..........................................................',
            '..........................................................',
            '..........................................................',
            '..................................b.......................',
            '......................b.............................b.....',
            '............b.........................m...................',
            '............................b.......======....b...........',
            '..................m.......................................',
            '................SSSSSS..........m.........................',
            '..............................======......................',
            '..........SSS.............SS...............SS.............',
            '..<.....SSSSSSS...m.......SS.....m........SSSS.m.......>..',
            '##########################################################',
            '##########################################################',
          ],
        },
        ruins: {
          name: 'Haunted Ruins',
          sky: [88, 56, 118], far: [108, 70, 124], near: [68, 44, 88], decor: 'stars',
          ground: [game.art.tiles.brick, game.art.tiles.brick],
          maxMonsters: 8, respawnEvery: 25,
          portals: { '<': { to: 'cave', at: '>' }, '>': { blocked: 'The gate is sealed' } },   // step 17 opens the gate to the golem
          rows: [
            '............................................................',
            '............................................................',
            '............................................................',
            '............................................................',
            '..............................k..b..........................',
            '............................=====...................b.......',
            '.................b..........................................',
            '........................k......b..........b.................',
            '......................=====.................................',
            '..............BBBBB.............................k.......>...',
            '...........k..................................BBBBBBBBBBBBBB',
            '..........BB...............................BBBBBBBBBBBBBBBBB',
            '..<.....k.BB........k.......k.......B...BBBBBBBBBBBBBBBBBBBB',
            '############################################################',
            '############################################################',
          ],
        },
      };

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

      // Which marker letter on the map is a spawn point for which monster.
      const MARKERS = { s: 'slime', m: 'mushroom', k: 'skeleton', b: 'bat' };

      let mapId = 'meadow';            // the id of the map we are on: a key of MAPS
      let spawnPoints = [];            // where monsters may be born on this map: { type, col, row } (from the markers s m k b)
      let portals = [];                // the portals of this map: { ch, to, at, x, y }, 16 x 32 pixels with (x, y) at the top-left
      let respawnTimer = 0;            // seconds until the map is topped up with monsters again
      let bannerTime = 0;              // seconds left of the map name banner
      let fade = 0;                    // 1 = black screen. It fades back to 0 after a map has loaded.
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
        dashDamage: 0,    // damage to every monster the hero flies through (0 = a harmless dash)
        dashHit: [],      // the monsters already hurt by this dash (each one only once)
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
        startAdventure();                // heal the hero and load the first map
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

      const BANNER_TIME = 3;           // how long the map name stays on the screen

      // Heal and clean up the hero completely: for a new game and for a new try after dying.
      function resetHero() {
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        player.cooldowns = [0, 0, 0];
        player.buffs = {};
        player.invincible = 0;
        player.cooldown = 0;
        player.levelFx = 0;
      }

      // Start (or restart) the adventure: a healthy hero on the first map.
      function startAdventure() {
        resetHero();
        loadMap('meadow');
      }

      // Build the map with this id and put the hero at the marker 'at': 'P' is the start, '<' and '>' are portals.
      // The hero keeps everything else (hit points, level, buffs): only the world around changes.
      function loadMap(id, at = 'P') {
        mapId = id;
        const def = MAPS[id];
        map = [];
        monsters = [];
        spawnPoints = [];
        portals = [];
        const anchors = {};                        // where the markers P < > stood: anchors['<'] = { col, row }
        for (let row = 0; row < def.rows.length; row++) {
          let line = '';
          for (let col = 0; col < def.rows[row].length; col++) {
            let ch = def.rows[row][col];
            if ('P<>'.includes(ch)) {
              // 1. TODO: anchors[ch] = { col, row };   and then   ch = '.';
            } else if (MARKERS[ch]) {
              // 2. TODO: spawnPoints.push({ type: MARKERS[ch], col, row });   and then   ch = '.';
            }
            line += ch;
          }
          map.push(line);
        }
        // 3. TODO: for (const ch in def.portals) {
        //      const a = anchors[ch];          // the marker of this portal
        //      if (a) { portals.push({ ch, ...def.portals[ch], x: a.col * TILE, y: (a.row - 1) * TILE }); }
        //    }
        const start = anchors[at] || anchors.P || { col: 1, row: 12 };      // the wanted marker (a safety net if the map has none)
        player.x = start.col * TILE + (TILE - player.w) / 2;                 // centered in the tile
        player.y = (start.row + 1) * TILE - player.h;                        // feet on the bottom of the tile
        mapW = map[0].length * TILE;
        mapH = map.length * TILE;
        player.vx = 0;
        player.vy = 0;
        player.dash = 0;
        player.stun = 0;
        player.attackTimer = 0;
        timers.length = 0;                         // forget everything that was planned for later
        floaters.length = 0;
        drops.length = 0;
        projectiles.length = 0;
        effects.length = 0;
        state = 'playing';
        updateCamera();                            // the monsters are born out of sight, so the camera must be right first
        bannerTime = BANNER_TIME;                  // show the name of the map
        fade = 1;                                  // and fade in from black
        respawnTimer = def.respawnEvery;
        topUpMonsters(false);                      // the first population: as many monsters as the map allows
      }

      // Which picture belongs to the tile at (col, row)? Ground gets grass only on top.
      function tileArt(col, row) {
        const ch = charAt(col, row);
        const ground = MAPS[mapId].ground;                        // [top picture, inner picture] of THIS map
        if (ch === '#') { return solidAt(col, row - 1) ? ground[1] : ground[0]; }
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

      // ---------- portals ----------

      // The glow color of a portal, by its marker. A portal that is blocked glows red.
      const PORTAL_COLORS = { '>': [110, 190, 255], '<': [255, 180, 90] };

      // Three sparkles, 5 x 5 pixels, drawn with the palette letters. They are the frames of the animation that circles around a portal.
      const SPARKLE = [
        [
          '..f..',
          '.fWf.',
          'fWWWf',
          '.fWf.',
          '..f..',
        ],
        [
          '.....',
          '..W..',
          '.WWW.',
          '..W..',
          '.....',
        ],
        [
          '.....',
          '.....',
          '..f..',
          '.....',
          '.....',
        ],
      ];

      // The portal the hero stands in (or undefined). Portal and hero are rectangles, so we can use touching().
      function portalAtHero() {
        return portals.find(p => touching(player.x, player.y, player.w, player.h, p.x, p.y, TILE, TILE * 2));
      }

      // Up in front of a portal: go through it. Returns true if a new map was loaded.
      function tryPortal() {
        // 4. TODO: if (!game.keyPressed('up')) { return false; }
        //    const p = portalAtHero();   if there is none: return false.
        //    if (p.blocked) { addFloater(p.x + TILE / 2, p.y - 6, p.blocked, game.RED, 10, 1.4); return false; }
        //    loadMap(p.to, p.at);   return true;
        return false;
      }

      // An oval of light with sparkles circling around it. The glow breathes, and an UP hint bounces over it when the hero is close.
      function drawPortal(p) {
        const t = game.time();
        const color = p.blocked ? [210, 70, 70] : PORTAL_COLORS[p.ch];
        const cx = p.x + TILE / 2;
        const cy = p.y + TILE;                                     // the middle of the oval
        const glow = 0.3 + 0.15 * Math.sin(t * 4 + p.x);          // the glow breathes in and out
        for (let i = 0; i < TILE * 2; i += 2) {                    // the oval is 16 thin strips on top of each other
          const k = (i + 1 - TILE) / TILE;                         // -1 at the top, 0 in the middle, +1 at the bottom
          const half = Math.round(7 * Math.sqrt(1 - k * k));       // half the width of the strip
          game.alpha(glow);
          game.rect(cx - half - 1, p.y + i, half * 2 + 2, 2, color);
          game.alpha(glow + 0.25);
          game.rect(cx - half, p.y + i, half * 2, 2, color);
        }
        game.alpha(1);
        for (let i = 0; i < 3; i++) {                              // three sparkles on an orbit, each with its own animation time
          const angle = t * 2 + i * 2.1;
          const frame = frameLoop(SPARKLE, t + i * 0.2, 8);
          game.sprite(Math.round(cx + Math.cos(angle) * 9 - 2.5), Math.round(cy + Math.sin(angle) * 14 - 2.5), frame);
        }
        if (portalAtHero() === p) {
          hudText(cx - 8, p.y - 12 + Math.sin(t * 8) * 2, p.blocked ? 'LOCKED' : 'UP', game.YELLOW, 10);
        }
      }

      function drawPortals() {
        for (const p of portals) { drawPortal(p); }
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
          poison: null,                 // null = healthy, or { time, tick, dmg } while poisoned (see poisonMonster)
          homeX: x, homeY: y,           // where it was born (flying monsters circle around this)
          animTime: col * 0.1,          // a different start for every monster, so they do not move in sync
          age: 0,                       // seconds since it was born: a new monster fades in
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
          if (m.alive) {
            m.age += dt;
            updateMonster(m, dt);
            updatePoison(m, dt);                       // poison works even on a frozen or just-hit monster
          }
        }
      }

      // ---------- poison: damage over time ----------

      const POISON_TIME = 4;      // a poisoned monster stays poisoned for 4 seconds after the last poisoned hit
      const POISON_TICK = 0.5;    // and it loses hit points every half second

      // Poison a monster. m.poison = { time: seconds left, tick: seconds until the next damage, dmg: damage per tick }.
      // A second poisoned hit does not stack, it only starts the 4 seconds again.
      function poisonMonster(m, dmg) {
        const old = m.poison;
        m.poison = { time: POISON_TIME, tick: old ? old.tick : POISON_TICK, dmg };
      }

      // Count the poison down. Every POISON_TICK seconds the monster loses hit points, and a green number shows it.
      function updatePoison(m, dt) {
        if (!m.poison) { return; }
        m.poison.time -= dt;
        m.poison.tick -= dt;
        if (m.poison.tick <= 0) {
          m.poison.tick += POISON_TICK;
          m.hp -= m.poison.dmg;
          addFloater(m.x + m.w / 2, m.y - 8, m.poison.dmg, game.GREEN, 10, 0.6);
          spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.spark, { center: true, life: 0.2 });   // a spark for every tick
          if (m.hp <= 0) { killMonster(m); return; }
        }
        if (m.poison.time <= 0) { m.poison = null; }
      }

      // Green bubbles float around a poisoned monster: the animation game.art.fx.poison, looped with frameLoop.
      function drawPoisonBubbles(m) {
        const frame = frameLoop(game.art.fx.poison, game.time());
        const size = game.spriteSize(frame);
        game.sprite(m.x + m.w / 2 - size.w / 2, m.y + m.h / 2 - size.h / 2, frame);
      }

      // An icy copy of a picture: the outline becomes dark blue and everything else light blue. Frozen monsters are drawn with it.
      const iceCache = new Map();
      function iceArt(art) {
        if (!iceCache.has(art)) {
          iceCache.set(art, art.map(row => row.replace(/K/g, 'n').replace(/[^. n]/g, 'f')));
        }
        return iceCache.get(art);
      }

      // A dark purple copy of a picture: every colored pixel becomes dark. The Shadow Step leaves these behind.
      const shadowCache = new Map();
      function shadowArt(art) {
        if (!shadowCache.has(art)) {
          shadowCache.set(art, art.map(row => row.replace(/[^. ]/g, 'Z')));
        }
        return shadowCache.get(art);
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
          game.sprite(m.x + def.ox, m.y + def.oy, art, { flip: m.dir < 0, alpha: Math.min(1, m.age / 0.5) });     // a newborn fades in during half a second
          if (m.frozen > 0) {                                          // and a see-through crystal on top
            game.sprite(m.x + m.w / 2 - 8, m.y + m.h / 2 - 8, game.art.icons.ice, { scale: 2, alpha: 0.45 });
          }
          if (m.poison) { drawPoisonBubbles(m); }
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

      // ---------- the spawner: a limit and a respawn timer ----------

      // A tiny random number generator (always the same sequence), so the game does not depend on Math.random.
      // It returns a number from 0 up to (not including) 1.
      let seed = 12345;
      function rand() {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      }

      // How many monsters of this map are alive right now?
      function countAlive() {
        let n = 0;
        for (const m of monsters) {
          if (m.alive) { n++; }
        }
        return n;
      }

      // Is this world x position inside the picture (plus a small margin)?
      function onScreen(x) {
        return x > camera.x - 16 && x < camera.x + game.WIDTH + 16;
      }

      // Choose a spawn point: out of the hero's sight, and one that this round has not used yet if possible.
      function pickSpawnPoint(used) {
        let list = spawnPoints.filter(p => !onScreen(p.col * TILE + TILE / 2));
        if (list.length === 0) { list = spawnPoints; }             // every point is in view (a tiny map): take any
        const fresh = list.filter(p => !used.includes(p));
        if (fresh.length > 0) { list = fresh; }
        return list[Math.floor(rand() * list.length)];
      }

      // Fill the map up to its maximum, all at once. withPoof: true plays a puff of smoke where each monster appears.
      function topUpMonsters(withPoof) {
        if (spawnPoints.length === 0) { return; }                  // a map without spawn points stays empty
        const used = [];
        // 5. TODO: while (countAlive() < MAPS[mapId].maxMonsters) {
        //      const p = pickSpawnPoint(used);   used.push(p);   spawnMonster(p.type, p.col, p.row);
        //      if (withPoof) {  the monster that was just added is monsters[monsters.length - 1]:
        //        spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { scale: 2, center: true, life: 0.5 });  }
        //    }
      }

      // Called every frame. The timer only runs while monsters are missing. When it rings, ALL missing monsters appear at once.
      function updateSpawner(dt) {
        monsters = monsters.filter(m => m.alive);                  // forget the dead, so the list stays short
        const def = MAPS[mapId];
        // 6. TODO: if (countAlive() >= def.maxMonsters) { respawnTimer = def.respawnEvery; return; }   (full: the timer waits)
        //    respawnTimer -= dt;
        //    if (respawnTimer <= 0) { topUpMonsters(true); respawnTimer = def.respawnEvery; }
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
        if (m.hp <= 0) { killMonster(m); } else { runAttackHooks(m); }     // a buff can add an effect to the hit (poison!)
      }

      // A monster dies: it stops existing, and the hero gets the experience and the coins. (This used to be part of damageMonster.)
      function killMonster(m) {
        m.alive = false;                                           // dead monsters are skipped everywhere
        m.poison = null;
        spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { center: true, life: 0.4 });   // it vanishes in a puff of smoke
        gainXp(MONSTERS[m.type].xp);                               // the reward: experience ...
        dropCoins(m);                                              // ... and coins
      }

      // Buffs can add an effect to every hit of the hero: a buff with an onAttack function is asked about each monster that was hit.
      function runAttackHooks(m) {
        for (const name in player.buffs) {
          const buff = BUFFS[name];
          if (buff.onAttack) { buff.onAttack(m); }
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
        poisonBlade: {
          name: 'Poison Blade', icon: game.art.icons.dagger, color: [90, 210, 90],
          // onAttack(m) is called for every monster the hero hits while this buff runs
          onAttack(m) { poisonMonster(m, Math.max(1, Math.round(player.atk * 0.8))); },
        },
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
      // Every class has three skills in SKILLS[className], one per slot. Each class has its own function below that builds them.
      // (The placeholder skills of step 10 are gone: all four classes have real skills now.)

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

      // ---------- the thief's skills ----------

      // The icon of the Shadow Step: a dark purple orb.
      const STEP_ART = [
        '...pp...',
        '..pPPp..',
        '.ppPPpp.',
        'pPPppPPp',
        'pPPppPPp',
        '.ppPPpp.',
        '..pPPp..',
        '...pp...',
      ];

      // The three daggers of the fan: one flies up, one straight, one down (vy), and each starts a little lower (dy).
      // All of them use the spinning dagger animation game.art.fx.dagger (4 frames): drawProjectiles loops it while they fly.
      const FAN = [
        { vy: -70, dy: 2 },
        { vy: 0, dy: 4 },
        { vy: 70, dy: 2 },
      ];

      // The thief is fast, close to the enemy, and tricky. Cheap skills, short cooldowns, and a poison that keeps working after the fight moved on.
      function thiefSkills() {
        return [
          {
            name: 'Dagger Fan', key: 'x', cost: 6, cooldown: 2.5, icon: game.art.icons.dagger,
            cast(p) {
              for (const d of FAN) {
                spawnProjectile({
                  x: p.facing > 0 ? p.x + p.w : p.x - 8,
                  y: p.y + d.dy,
                  vx: p.facing * 280,
                  vy: d.vy,
                  dmg: attackPower() * 2,
                  art: game.art.fx.dagger, life: 0.5,
                });
              }
            },
          },
          {
            name: 'Shadow Step', key: 'a', cost: 10, cooldown: 6, icon: STEP_ART,
            cast(p) {
              dashPuff();                                              // a puff of smoke where the thief disappears
              startDash(p.facing, 340, 0.25, attackPower() * 4);     // FORWARD this time, fast, and every monster on the way is hurt once
              addFloater(p.x + p.w / 2, p.y - 14, 'SHADOW STEP', game.PURPLE, 11);
            },
          },
          {
            name: 'Poison Blade', key: 's', cost: 8, cooldown: 14, icon: game.art.icons.dagger,
            cast(p) {
              addBuff('poisonBlade', 8);                                 // for 8 seconds every hit poisons
              addFloater(p.x + p.w / 2, p.y - 14, 'POISON BLADE', game.GREEN, 12, 1.2);
              spawnEffect(p.x + p.w / 2, p.y + p.h / 2, game.art.fx.poison, { scale: 2, center: true, life: 0.5 });   // a cloud of poison bubbles
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
      // damage (optional): a dash with damage hurts every monster it flies through, once each. 0 = a harmless dash.
      function startDash(dir, speed, time, damage = 0) {
        player.dash = time;
        player.dashDir = dir;
        player.dashSpeed = speed;
        player.invincible = Math.max(player.invincible, time + 0.2);   // safe during the dash and a moment after it
        player.stun = 0;                                               // a dash also cancels a knockback
        player.dashDamage = damage;
        player.dashHit = [];                                           // nobody has been hit by this new dash yet
      }

      // While a damaging dash runs, hurt every monster the hero flies through, but each one only ONCE per dash.
      // player.dashHit remembers who was hit, the same trick as p.hit of a piercing projectile.
      function hitDashTargets() {
        if (player.dash <= 0 || player.dashDamage <= 0) { return; }
        for (const m of monsters) {
          if (m.alive && !player.dashHit.includes(m) && touching(player.x, player.y, player.w, player.h, m.x, m.y, m.w, m.h)) {
            damageMonster(m, player.dashDamage, player.x + player.w / 2);
            player.dashHit.push(m);
          }
        }
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
        thief: thiefSkills(),
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

      const CLOUDS = [{ x: 20, y: 30 }, { x: 150, y: 56 }, { x: 270, y: 24 }];
      const HILLS_FAR = [{ x: 40, r: 64 }, { x: 190, r: 80 }, { x: 330, r: 56 }];
      const HILLS_NEAR = [{ x: 90, r: 48 }, { x: 260, r: 56 }];

      // Where on the screen is a background object? 'factor' says how fast its layer scrolls:
      // 0 = glued to the sky, 1 = moves like the ground. The % makes the layer repeat every 'span' pixels.
      function layerX(worldX, factor, span) {
        const x = worldX - camera.x * factor;
        return ((x % span) + span) % span - 60;
      }

      function drawCloud(x, y, color) {
        game.circle(x, y, 9, color);
        game.circle(x + 12, y - 5, 12, color);
        game.circle(x + 26, y, 9, color);
        game.rect(x, y, 26, 9, color);
      }

      // Stars twinkle (the alpha changes with the time) and one moon hangs in the sky. Used by the ruins.
      const STARS = [];
      for (let i = 0; i < 26; i++) { STARS.push({ x: (i * 97) % 380, y: 6 + (i * 41) % 120 }); }

      function drawStars() {
        for (let i = 0; i < STARS.length; i++) {
          game.alpha(0.5 + 0.5 * Math.sin(game.time() * 3 + i * 1.7));
          game.rect(layerX(STARS[i].x, 0.05, 380), STARS[i].y, 2, 2, game.WHITE);
        }
        game.alpha(1);
        game.circle(250, 44, 16, [240, 232, 200]);
        game.circle(257, 40, 14, MAPS[mapId].sky);              // a second circle in the sky color bites the moon into a crescent
      }

      // Stalactites hang from the roof of the cave: a triangle made of thin strips that get narrower towards the tip.
      const STALACTITES = [{ x: 20, h: 44 }, { x: 90, h: 26 }, { x: 150, h: 54 }, { x: 230, h: 32 }, { x: 300, h: 46 }];

      function drawStalactites() {
        for (const s of STALACTITES) {
          const x = layerX(s.x, 0.3, 360);
          for (let y = 0; y < s.h; y += 2) {
            const half = Math.max(1, Math.round((s.h - y) / 6));
            game.rect(x - half, y, half * 2, 2, [70, 66, 104]);
          }
        }
      }

      // The extra background picture of the current map.
      function drawDecor(def) {
        if (def.decor === 'clouds') {
          for (const c of CLOUDS) { drawCloud(layerX(c.x, 0.1, 380), c.y, def.cloud); }
        } else if (def.decor === 'stars') {
          drawStars();
        } else if (def.decor === 'stalactites') {
          drawStalactites();
        }
      }

      // The background of the current map: its sky color, its decor and two layers of hills.
      function drawBackground() {
        const def = MAPS[mapId];
        game.clear(def.sky);
        drawDecor(def);
        for (const h of HILLS_FAR) { game.circle(layerX(h.x, 0.25, 440), 216, h.r, def.far); }
        for (const h of HILLS_NEAR) { game.circle(layerX(h.x, 0.5, 400), 224, h.r, def.near); }
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
          const image = player.dashDamage > 0 ? shadowArt(heroArt.walk1) : heroArt.walk1;     // a damaging dash leaves dark shadows
          spawnEffect(player.x - 3, player.y - 2, image, { flip: player.facing < 0, life: 0.2 });     // a fading afterimage
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
          if (game.keyPressed('enter')) { startAdventure(); }     // try again from the first map
          return;
        }
        handleInput();
        tryAttack();
        handleSkillKeys();
        // 7. TODO: if (tryPortal()) { return; }          a new map was loaded: continue in the next frame
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
        const wasDashing = player.dash > 0;
        player.dash = Math.max(0, player.dash - dt);                                         // the dash timer runs down
        if (wasDashing && player.dash === 0) { dashPuff(); }                                 // a puff of smoke where the dash ends
        updateEffects(dt);
        updateFloaters(dt);
        updateProjectiles(dt);
        updateMonsters(dt);
        // 8. TODO: updateSpawner(dt);
        bannerTime = Math.max(0, bannerTime - dt);
        fade = Math.max(0, fade - 2.5 * dt);
        hitDashTargets();
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
        hudText(138, 6, MAPS[mapId].name, game.WHITE, 12);
        drawSpawnerHud();
        drawSkillBar();
        drawBuffs();
        if (state === 'dead') {
          game.rect(0, 80, game.WIDTH, 80, game.BLACK);
          game.text(70, 90, 'You were defeated', game.RED, 20);
          game.text(70, 118, 'You lost ' + lostCoins + ' coins.', game.YELLOW, 12);
          game.text(88, 138, 'Press enter to try again', game.WHITE, 12);
        }
      }

      // How many monsters live here, and (while some are missing) a bar that fills up until they come back.
      function drawSpawnerHud() {
        const def = MAPS[mapId];
        const n = countAlive();
        hudText(138, 21, 'Monsters ' + n + '/' + def.maxMonsters, game.WHITE, 10);
        if (n < def.maxMonsters) {
          drawBar(138, 34, 60, 4, def.respawnEvery - respawnTimer, def.respawnEvery, game.ORANGE);
          hudText(204, 31, Math.ceil(respawnTimer) + 's', game.ORANGE, 9);
        }
      }

      // The name of the map slides down from the top, stays for a moment and fades away.
      function drawBanner() {
        if (bannerTime <= 0) { return; }
        const age = BANNER_TIME - bannerTime;                      // 0 right after the map loaded
        const y = -26 + Math.min(1, age / 0.4) * 78;               // slide down during the first 0.4 seconds
        const name = MAPS[mapId].name;
        game.alpha(Math.min(1, bannerTime / 0.6) * 0.7);           // fade out in the last 0.6 seconds
        game.rect(50, y, 220, 26, game.BLACK);
        game.alpha(Math.min(1, bannerTime / 0.6));
        hudText((game.WIDTH - name.length * 9.5) / 2, y + 5, name, game.YELLOW, 16);
        game.alpha(1);
      }

      // A black curtain over everything. It is see-through more and more while 'fade' goes down to 0.
      function drawFade() {
        if (fade <= 0) { return; }
        game.alpha(fade);
        game.rect(0, 0, game.WIDTH, game.HEIGHT, game.BLACK);
        game.alpha(1);
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
        drawPortals();
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
        drawBanner();
        drawFade();
      }

      state = 'select';                           // the game starts at the select screen
      game.run(update, draw);
check:
  game:
    frames: 30
    keys:
      - { key: enter, from: 1, to: 2 }
    expect: |
      (() => {
        const dt = 1 / 60;
        const calm = () => { player.hp = player.maxHp; player.invincible = 99; };   // nothing can hurt the hero while the test waits
        const press = (key) => {                                                    // press one key for exactly one update
          const old = game.keyPressed;
          game.keyPressed = k => k === key;
          try { update(dt); } finally { game.keyPressed = old; }
        };
        // 1. scripted: enter chose the warrior and started the first map
        if (state !== 'playing' || mapId !== 'meadow' || player.cls !== 'warrior') { return false; }
        // 2. the first population is the maximum, and it is born out of the hero's sight
        loadMap('meadow');
        const max = MAPS.meadow.maxMonsters;
        if (spawnPoints.length <= max || countAlive() !== max || monsters.length !== max) { return false; }
        if (!monsters.every(m => !onScreen(m.x + m.w / 2))) { return false; }
        if (!monsters.every(m => m.type === 'slime')) { return false; }
        // 3. kills do not respawn at once: the timer starts with the first kill and tops the map up ALL AT ONCE
        for (const m of monsters.slice(0, 3)) { killMonster(m); }
        let frames = 0;
        update(dt); frames++;
        if (countAlive() !== max - 3 || monsters.length !== max - 3) { return false; }       // dead monsters are forgotten
        while (countAlive() === max - 3 && frames < 3000) { calm(); update(dt); frames++; }
        const seconds = frames / 60;
        if (countAlive() !== max || monsters.length !== max) { return false; }                  // all three came back in the same frame
        if (Math.abs(seconds - MAPS.meadow.respawnEvery) > 1) { return false; }                 // after about respawnEvery seconds
        const newborn = monsters.filter(m => m.age < 0.1);
        if (newborn.length !== 3 || !newborn.every(m => !onScreen(m.x + m.w / 2))) { return false; }
        if (effects.length < 3) { return false; }                                              // a poof for each of them
        // 4. while the map is full, the timer waits at the full interval
        calm(); update(dt); calm(); update(dt);
        if (respawnTimer !== MAPS.meadow.respawnEvery) { return false; }
        // 5. the portals chain the four maps, up goes through, and the hero keeps hit points
        const route = [['meadow', '>', 'forest'], ['forest', '<', 'meadow'], ['forest', '>', 'cave'], ['cave', '<', 'forest'], ['cave', '>', 'ruins'], ['ruins', '<', 'cave']];
        for (const [id, ch, to] of route) {
          loadMap(id);
          const p = portals.find(q => q.ch === ch);
          if (!p) { return false; }
          player.hp = 17; player.invincible = 99;
          player.x = p.x + 3; player.y = p.y + TILE * 2 - player.h;
          press('up');
          if (mapId !== to || player.hp !== 17) { return false; }
          const arrival = portals.find(q => q.ch === p.at);
          if (!arrival || Math.abs(player.x + player.w / 2 - (arrival.x + TILE / 2)) > 4) { return false; }
          if (countAlive() !== MAPS[to].maxMonsters) { return false; }
        }
        // 6. the gate of the ruins is sealed for now
        loadMap('ruins');
        const gate = portals.find(q => q.ch === '>');
        player.x = gate.x + 3; player.y = gate.y + TILE * 2 - player.h; player.invincible = 99;
        press('up');
        if (mapId !== 'ruins' || !floaters.some(f => f.text.includes('sealed'))) { return false; }
        // 7. every map has its own monster mix and is full at the start
        const mixes = { meadow: ['slime'], forest: ['mushroom', 'slime'], cave: ['bat', 'mushroom'], ruins: ['bat', 'skeleton'] };
        for (const id in mixes) {
          loadMap(id);
          if (countAlive() !== MAPS[id].maxMonsters || !monsters.every(m => mixes[id].includes(m.type))) { return false; }
        }
        // 8. the banner and the HUD show the map and the monster count
        loadMap('cave');
        if (!(bannerTime > 2)) { return false; }
        const texts = [];
        const text0 = game.text;
        game.text = (...args) => { texts.push(String(args[2])); return text0(...args); };
        try { draw(); } finally { game.text = text0; }
        return texts.includes('Echo Cave') && texts.some(t => t.startsWith('Monsters '));
      })()
    message: "Choose the warrior with enter. Then: loadMap(id, at) must keep the monster markers as spawnPoints and the P < > markers as anchors, fill the map to maxMonsters with topUpMonsters (out of the hero's sight), updateSpawner must count respawnTimer down only while monsters are missing and then top up everything at once, and tryPortal must call loadMap(p.to, p.at) when up is pressed in a portal (a blocked portal only shows its text). update must call tryPortal and updateSpawner."
hints:
  - "Eight TODOs in four groups. loadMap: remember the anchors P < >, keep the monster markers as spawn points, and build the portals list. Portals: tryPortal and its call in update. Spawner: topUpMonsters and updateSpawner, and its call in update."
  - "anchors[ch] = { col, row }; ch = '.';   and   spawnPoints.push({ type: MARKERS[ch], col, row }); ch = '.';   Portals: for (const ch in def.portals) { const a = anchors[ch]; if (a) { portals.push({ ch, ...def.portals[ch], x: a.col * TILE, y: (a.row - 1) * TILE }); } }   tryPortal: check keyPressed('up'), find portalAtHero(), skip a blocked one, then loadMap(p.to, p.at)."
  - "topUpMonsters: while (countAlive() < MAPS[mapId].maxMonsters) { const p = pickSpawnPoint(used); used.push(p); spawnMonster(p.type, p.col, p.row); if (withPoof) { const m = monsters[monsters.length - 1]; spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { scale: 2, center: true, life: 0.5 }); } }   updateSpawner: if (countAlive() >= def.maxMonsters) { respawnTimer = def.respawnEvery; return; }  respawnTimer -= dt;  if (respawnTimer <= 0) { topUpMonsters(true); respawnTimer = def.respawnEvery; }   In update: if (tryPortal()) { return; } and updateSpawner(dt);"
solution:
  - name: main.js
    code: |
      // Step 15: maps and portals.
      const TILE = 16;                 // one map square is 16 x 16 pixels
      const GRAVITY = 900;
      const MAX_FALL = 500;
      // (WALK_SPEED and JUMP_SPEED are gone: every class has its own speed and jump now.)

      let heroArt = game.art.warrior;   // the picture set of the chosen class

      // ---------- the maps ----------

      // Every map is one entry of the table MAPS. The key is the id of the map ('meadow', 'forest', ...). One entry has:
      //   name          the name shown in the banner and on the HUD
      //   rows          the tiles: 15 strings, one character per tile (see the key below)
      //   sky, far, near   background colors: the sky, the far hills and the near hills      decor: the extra background picture
      //   ground        [top picture, inner picture] of the solid # tiles: grass on dirt, plain stone, brick, ...
      //   maxMonsters   how many monsters live on the map AT MOST. The map starts with this many.
      //   respawnEvery  seconds between two top-ups: when monsters are missing, this long later the map is filled up to maxMonsters again
      //   portals       what the portal markers do. { '>': { to: 'forest', at: '<' } } means: the > portal leads to the forest, where you arrive at its < portal
      // Tile characters:
      //   #  solid ground      S  solid stone      B  solid brick
      //   =  wooden platform (you can jump up through it and stand on it)      .  empty air
      // Markers (removed when the map loads):
      //   P  where the hero starts      < >  portals      s slime   m mushroom   k skeleton   b bat
      // Every monster marker is a SPAWN POINT: a place where a monster of that kind may be born.
      const MAPS = {
        meadow: {
          name: 'Whispering Meadow',
          sky: [96, 168, 248], far: [120, 170, 190], near: [70, 150, 110], decor: 'clouds', cloud: [250, 250, 255],
          ground: [game.art.tiles.grass, game.art.tiles.dirt],
          maxMonsters: 6, respawnEvery: 15,
          portals: { '>': { to: 'forest', at: '<' } },
          rows: [
            '............................................................',
            '............................................................',
            '............................................................',
            '............................................................',
            '............................................................',
            '....................................................s.......',
            '..................................s...............=====.....',
            '...........====.................=====.......................',
            '...............................................s............',
            '...........................s.................=====..........',
            '.....====................=====...........s..................',
            '...................##.............SS....###.................',
            '..P..........s...######.s......s.SSS.s#######.....s......>..',
            '############################################################',
            '############################################################',
          ],
        },
        forest: {
          name: 'Mushroom Forest',
          sky: [52, 110, 84], far: [44, 94, 74], near: [30, 74, 54], decor: 'clouds', cloud: [112, 160, 130],
          ground: [game.art.tiles.grass, game.art.tiles.dirt],
          maxMonsters: 7, respawnEvery: 18,
          portals: { '<': { to: 'meadow', at: '>' }, '>': { to: 'cave', at: '<' } },
          rows: [
            '........................................................',
            '........................................................',
            '........................................................',
            '................m..............m........................',
            '..............======.........=====......................',
            '........................................................',
            '.........................m...........s..................',
            '.........=====.........======......=====................',
            '........................................................',
            '................m............m................s.........',
            '.....=====....======.......=====............=====.......',
            '.....................SS...............SS................',
            '..<.....m....s.......SS.....m..s..m...SSS.....m......>..',
            '########################################################',
            '########################################################',
          ],
        },
        cave: {
          name: 'Echo Cave',
          sky: [26, 24, 44], far: [42, 42, 74], near: [54, 52, 90], decor: 'stalactites',
          ground: [game.art.tiles.stone, game.art.tiles.stone],
          maxMonsters: 8, respawnEvery: 20,
          portals: { '<': { to: 'forest', at: '>' }, '>': { to: 'ruins', at: '<' } },
          rows: [
            '..........................................................',
            '..........................................................',
            '..........................................................',
            '..........................................................',
            '..................................b.......................',
            '......................b.............................b.....',
            '............b.........................m...................',
            '............................b.......======....b...........',
            '..................m.......................................',
            '................SSSSSS..........m.........................',
            '..............................======......................',
            '..........SSS.............SS...............SS.............',
            '..<.....SSSSSSS...m.......SS.....m........SSSS.m.......>..',
            '##########################################################',
            '##########################################################',
          ],
        },
        ruins: {
          name: 'Haunted Ruins',
          sky: [88, 56, 118], far: [108, 70, 124], near: [68, 44, 88], decor: 'stars',
          ground: [game.art.tiles.brick, game.art.tiles.brick],
          maxMonsters: 8, respawnEvery: 25,
          portals: { '<': { to: 'cave', at: '>' }, '>': { blocked: 'The gate is sealed' } },   // step 17 opens the gate to the golem
          rows: [
            '............................................................',
            '............................................................',
            '............................................................',
            '............................................................',
            '..............................k..b..........................',
            '............................=====...................b.......',
            '.................b..........................................',
            '........................k......b..........b.................',
            '......................=====.................................',
            '..............BBBBB.............................k.......>...',
            '...........k..................................BBBBBBBBBBBBBB',
            '..........BB...............................BBBBBBBBBBBBBBBBB',
            '..<.....k.BB........k.......k.......B...BBBBBBBBBBBBBBBBBBBB',
            '############################################################',
            '############################################################',
          ],
        },
      };

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

      // Which marker letter on the map is a spawn point for which monster.
      const MARKERS = { s: 'slime', m: 'mushroom', k: 'skeleton', b: 'bat' };

      let mapId = 'meadow';            // the id of the map we are on: a key of MAPS
      let spawnPoints = [];            // where monsters may be born on this map: { type, col, row } (from the markers s m k b)
      let portals = [];                // the portals of this map: { ch, to, at, x, y }, 16 x 32 pixels with (x, y) at the top-left
      let respawnTimer = 0;            // seconds until the map is topped up with monsters again
      let bannerTime = 0;              // seconds left of the map name banner
      let fade = 0;                    // 1 = black screen. It fades back to 0 after a map has loaded.
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
        dashDamage: 0,    // damage to every monster the hero flies through (0 = a harmless dash)
        dashHit: [],      // the monsters already hurt by this dash (each one only once)
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
        startAdventure();                // heal the hero and load the first map
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

      const BANNER_TIME = 3;           // how long the map name stays on the screen

      // Heal and clean up the hero completely: for a new game and for a new try after dying.
      function resetHero() {
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        player.cooldowns = [0, 0, 0];
        player.buffs = {};
        player.invincible = 0;
        player.cooldown = 0;
        player.levelFx = 0;
      }

      // Start (or restart) the adventure: a healthy hero on the first map.
      function startAdventure() {
        resetHero();
        loadMap('meadow');
      }

      // Build the map with this id and put the hero at the marker 'at': 'P' is the start, '<' and '>' are portals.
      // The hero keeps everything else (hit points, level, buffs): only the world around changes.
      function loadMap(id, at = 'P') {
        mapId = id;
        const def = MAPS[id];
        map = [];
        monsters = [];
        spawnPoints = [];
        portals = [];
        const anchors = {};                        // where the markers P < > stood: anchors['<'] = { col, row }
        for (let row = 0; row < def.rows.length; row++) {
          let line = '';
          for (let col = 0; col < def.rows[row].length; col++) {
            let ch = def.rows[row][col];
            if ('P<>'.includes(ch)) {
              anchors[ch] = { col, row };            // remember the spot ...
              ch = '.';                              // ... and the tile itself becomes empty air
            } else if (MARKERS[ch]) {
              spawnPoints.push({ type: MARKERS[ch], col, row });     // a monster marker is kept as a spawn point
              ch = '.';
            }
            line += ch;
          }
          map.push(line);
        }
        for (const ch in def.portals) {              // one portal for every entry of def.portals
          const a = anchors[ch];                     // its marker tells where it stands
          if (a) { portals.push({ ch, ...def.portals[ch], x: a.col * TILE, y: (a.row - 1) * TILE }); }   // 16 wide, 32 tall: it ends at the marker's tile
        }
        const start = anchors[at] || anchors.P || { col: 1, row: 12 };      // the wanted marker (a safety net if the map has none)
        player.x = start.col * TILE + (TILE - player.w) / 2;                 // centered in the tile
        player.y = (start.row + 1) * TILE - player.h;                        // feet on the bottom of the tile
        mapW = map[0].length * TILE;
        mapH = map.length * TILE;
        player.vx = 0;
        player.vy = 0;
        player.dash = 0;
        player.stun = 0;
        player.attackTimer = 0;
        timers.length = 0;                         // forget everything that was planned for later
        floaters.length = 0;
        drops.length = 0;
        projectiles.length = 0;
        effects.length = 0;
        state = 'playing';
        updateCamera();                            // the monsters are born out of sight, so the camera must be right first
        bannerTime = BANNER_TIME;                  // show the name of the map
        fade = 1;                                  // and fade in from black
        respawnTimer = def.respawnEvery;
        topUpMonsters(false);                      // the first population: as many monsters as the map allows
      }

      // Which picture belongs to the tile at (col, row)? Ground gets grass only on top.
      function tileArt(col, row) {
        const ch = charAt(col, row);
        const ground = MAPS[mapId].ground;                        // [top picture, inner picture] of THIS map
        if (ch === '#') { return solidAt(col, row - 1) ? ground[1] : ground[0]; }
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

      // ---------- portals ----------

      // The glow color of a portal, by its marker. A portal that is blocked glows red.
      const PORTAL_COLORS = { '>': [110, 190, 255], '<': [255, 180, 90] };

      // Three sparkles, 5 x 5 pixels, drawn with the palette letters. They are the frames of the animation that circles around a portal.
      const SPARKLE = [
        [
          '..f..',
          '.fWf.',
          'fWWWf',
          '.fWf.',
          '..f..',
        ],
        [
          '.....',
          '..W..',
          '.WWW.',
          '..W..',
          '.....',
        ],
        [
          '.....',
          '.....',
          '..f..',
          '.....',
          '.....',
        ],
      ];

      // The portal the hero stands in (or undefined). Portal and hero are rectangles, so we can use touching().
      function portalAtHero() {
        return portals.find(p => touching(player.x, player.y, player.w, player.h, p.x, p.y, TILE, TILE * 2));
      }

      // Up in front of a portal: go through it. Returns true if a new map was loaded.
      function tryPortal() {
        if (!game.keyPressed('up')) { return false; }
        const p = portalAtHero();
        if (!p) { return false; }
        if (p.blocked) {                             // a portal with a 'blocked' text does not open
          addFloater(p.x + TILE / 2, p.y - 6, p.blocked, game.RED, 10, 1.4);
          return false;
        }
        loadMap(p.to, p.at);                         // go to the map p.to and arrive at its portal p.at
        return true;
      }

      // An oval of light with sparkles circling around it. The glow breathes, and an UP hint bounces over it when the hero is close.
      function drawPortal(p) {
        const t = game.time();
        const color = p.blocked ? [210, 70, 70] : PORTAL_COLORS[p.ch];
        const cx = p.x + TILE / 2;
        const cy = p.y + TILE;                                     // the middle of the oval
        const glow = 0.3 + 0.15 * Math.sin(t * 4 + p.x);          // the glow breathes in and out
        for (let i = 0; i < TILE * 2; i += 2) {                    // the oval is 16 thin strips on top of each other
          const k = (i + 1 - TILE) / TILE;                         // -1 at the top, 0 in the middle, +1 at the bottom
          const half = Math.round(7 * Math.sqrt(1 - k * k));       // half the width of the strip
          game.alpha(glow);
          game.rect(cx - half - 1, p.y + i, half * 2 + 2, 2, color);
          game.alpha(glow + 0.25);
          game.rect(cx - half, p.y + i, half * 2, 2, color);
        }
        game.alpha(1);
        for (let i = 0; i < 3; i++) {                              // three sparkles on an orbit, each with its own animation time
          const angle = t * 2 + i * 2.1;
          const frame = frameLoop(SPARKLE, t + i * 0.2, 8);
          game.sprite(Math.round(cx + Math.cos(angle) * 9 - 2.5), Math.round(cy + Math.sin(angle) * 14 - 2.5), frame);
        }
        if (portalAtHero() === p) {
          hudText(cx - 8, p.y - 12 + Math.sin(t * 8) * 2, p.blocked ? 'LOCKED' : 'UP', game.YELLOW, 10);
        }
      }

      function drawPortals() {
        for (const p of portals) { drawPortal(p); }
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
          poison: null,                 // null = healthy, or { time, tick, dmg } while poisoned (see poisonMonster)
          homeX: x, homeY: y,           // where it was born (flying monsters circle around this)
          animTime: col * 0.1,          // a different start for every monster, so they do not move in sync
          age: 0,                       // seconds since it was born: a new monster fades in
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
          if (m.alive) {
            m.age += dt;
            updateMonster(m, dt);
            updatePoison(m, dt);                       // poison works even on a frozen or just-hit monster
          }
        }
      }

      // ---------- poison: damage over time ----------

      const POISON_TIME = 4;      // a poisoned monster stays poisoned for 4 seconds after the last poisoned hit
      const POISON_TICK = 0.5;    // and it loses hit points every half second

      // Poison a monster. m.poison = { time: seconds left, tick: seconds until the next damage, dmg: damage per tick }.
      // A second poisoned hit does not stack, it only starts the 4 seconds again.
      function poisonMonster(m, dmg) {
        const old = m.poison;
        m.poison = { time: POISON_TIME, tick: old ? old.tick : POISON_TICK, dmg };
      }

      // Count the poison down. Every POISON_TICK seconds the monster loses hit points, and a green number shows it.
      function updatePoison(m, dt) {
        if (!m.poison) { return; }
        m.poison.time -= dt;
        m.poison.tick -= dt;
        if (m.poison.tick <= 0) {
          m.poison.tick += POISON_TICK;
          m.hp -= m.poison.dmg;
          addFloater(m.x + m.w / 2, m.y - 8, m.poison.dmg, game.GREEN, 10, 0.6);
          spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.spark, { center: true, life: 0.2 });   // a spark for every tick
          if (m.hp <= 0) { killMonster(m); return; }
        }
        if (m.poison.time <= 0) { m.poison = null; }
      }

      // Green bubbles float around a poisoned monster: the animation game.art.fx.poison, looped with frameLoop.
      function drawPoisonBubbles(m) {
        const frame = frameLoop(game.art.fx.poison, game.time());
        const size = game.spriteSize(frame);
        game.sprite(m.x + m.w / 2 - size.w / 2, m.y + m.h / 2 - size.h / 2, frame);
      }

      // An icy copy of a picture: the outline becomes dark blue and everything else light blue. Frozen monsters are drawn with it.
      const iceCache = new Map();
      function iceArt(art) {
        if (!iceCache.has(art)) {
          iceCache.set(art, art.map(row => row.replace(/K/g, 'n').replace(/[^. n]/g, 'f')));
        }
        return iceCache.get(art);
      }

      // A dark purple copy of a picture: every colored pixel becomes dark. The Shadow Step leaves these behind.
      const shadowCache = new Map();
      function shadowArt(art) {
        if (!shadowCache.has(art)) {
          shadowCache.set(art, art.map(row => row.replace(/[^. ]/g, 'Z')));
        }
        return shadowCache.get(art);
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
          game.sprite(m.x + def.ox, m.y + def.oy, art, { flip: m.dir < 0, alpha: Math.min(1, m.age / 0.5) });     // a newborn fades in during half a second
          if (m.frozen > 0) {                                          // and a see-through crystal on top
            game.sprite(m.x + m.w / 2 - 8, m.y + m.h / 2 - 8, game.art.icons.ice, { scale: 2, alpha: 0.45 });
          }
          if (m.poison) { drawPoisonBubbles(m); }
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

      // ---------- the spawner: a limit and a respawn timer ----------

      // A tiny random number generator (always the same sequence), so the game does not depend on Math.random.
      // It returns a number from 0 up to (not including) 1.
      let seed = 12345;
      function rand() {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      }

      // How many monsters of this map are alive right now?
      function countAlive() {
        let n = 0;
        for (const m of monsters) {
          if (m.alive) { n++; }
        }
        return n;
      }

      // Is this world x position inside the picture (plus a small margin)?
      function onScreen(x) {
        return x > camera.x - 16 && x < camera.x + game.WIDTH + 16;
      }

      // Choose a spawn point: out of the hero's sight, and one that this round has not used yet if possible.
      function pickSpawnPoint(used) {
        let list = spawnPoints.filter(p => !onScreen(p.col * TILE + TILE / 2));
        if (list.length === 0) { list = spawnPoints; }             // every point is in view (a tiny map): take any
        const fresh = list.filter(p => !used.includes(p));
        if (fresh.length > 0) { list = fresh; }
        return list[Math.floor(rand() * list.length)];
      }

      // Fill the map up to its maximum, all at once. withPoof: true plays a puff of smoke where each monster appears.
      function topUpMonsters(withPoof) {
        if (spawnPoints.length === 0) { return; }                  // a map without spawn points stays empty
        const used = [];
        while (countAlive() < MAPS[mapId].maxMonsters) {
          const p = pickSpawnPoint(used);
          used.push(p);
          spawnMonster(p.type, p.col, p.row);
          if (withPoof) {
            const m = monsters[monsters.length - 1];               // the monster that was just added
            spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { scale: 2, center: true, life: 0.5 });
          }
        }
      }

      // Called every frame. The timer only runs while monsters are missing. When it rings, ALL missing monsters appear at once.
      function updateSpawner(dt) {
        monsters = monsters.filter(m => m.alive);                  // forget the dead, so the list stays short
        const def = MAPS[mapId];
        if (countAlive() >= def.maxMonsters) {                     // the map is full: the timer waits at the full time
          respawnTimer = def.respawnEvery;
          return;
        }
        respawnTimer -= dt;                                        // a kill starts the countdown
        if (respawnTimer <= 0) {
          topUpMonsters(true);
          respawnTimer = def.respawnEvery;
        }
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
        if (m.hp <= 0) { killMonster(m); } else { runAttackHooks(m); }     // a buff can add an effect to the hit (poison!)
      }

      // A monster dies: it stops existing, and the hero gets the experience and the coins. (This used to be part of damageMonster.)
      function killMonster(m) {
        m.alive = false;                                           // dead monsters are skipped everywhere
        m.poison = null;
        spawnEffect(m.x + m.w / 2, m.y + m.h / 2, game.art.fx.poof, { center: true, life: 0.4 });   // it vanishes in a puff of smoke
        gainXp(MONSTERS[m.type].xp);                               // the reward: experience ...
        dropCoins(m);                                              // ... and coins
      }

      // Buffs can add an effect to every hit of the hero: a buff with an onAttack function is asked about each monster that was hit.
      function runAttackHooks(m) {
        for (const name in player.buffs) {
          const buff = BUFFS[name];
          if (buff.onAttack) { buff.onAttack(m); }
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
        poisonBlade: {
          name: 'Poison Blade', icon: game.art.icons.dagger, color: [90, 210, 90],
          // onAttack(m) is called for every monster the hero hits while this buff runs
          onAttack(m) { poisonMonster(m, Math.max(1, Math.round(player.atk * 0.8))); },
        },
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
      // Every class has three skills in SKILLS[className], one per slot. Each class has its own function below that builds them.
      // (The placeholder skills of step 10 are gone: all four classes have real skills now.)

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

      // ---------- the thief's skills ----------

      // The icon of the Shadow Step: a dark purple orb.
      const STEP_ART = [
        '...pp...',
        '..pPPp..',
        '.ppPPpp.',
        'pPPppPPp',
        'pPPppPPp',
        '.ppPPpp.',
        '..pPPp..',
        '...pp...',
      ];

      // The three daggers of the fan: one flies up, one straight, one down (vy), and each starts a little lower (dy).
      // All of them use the spinning dagger animation game.art.fx.dagger (4 frames): drawProjectiles loops it while they fly.
      const FAN = [
        { vy: -70, dy: 2 },
        { vy: 0, dy: 4 },
        { vy: 70, dy: 2 },
      ];

      // The thief is fast, close to the enemy, and tricky. Cheap skills, short cooldowns, and a poison that keeps working after the fight moved on.
      function thiefSkills() {
        return [
          {
            name: 'Dagger Fan', key: 'x', cost: 6, cooldown: 2.5, icon: game.art.icons.dagger,
            cast(p) {
              for (const d of FAN) {
                spawnProjectile({
                  x: p.facing > 0 ? p.x + p.w : p.x - 8,
                  y: p.y + d.dy,
                  vx: p.facing * 280,
                  vy: d.vy,
                  dmg: attackPower() * 2,
                  art: game.art.fx.dagger, life: 0.5,
                });
              }
            },
          },
          {
            name: 'Shadow Step', key: 'a', cost: 10, cooldown: 6, icon: STEP_ART,
            cast(p) {
              dashPuff();                                              // a puff of smoke where the thief disappears
              startDash(p.facing, 340, 0.25, attackPower() * 4);     // FORWARD this time, fast, and every monster on the way is hurt once
              addFloater(p.x + p.w / 2, p.y - 14, 'SHADOW STEP', game.PURPLE, 11);
            },
          },
          {
            name: 'Poison Blade', key: 's', cost: 8, cooldown: 14, icon: game.art.icons.dagger,
            cast(p) {
              addBuff('poisonBlade', 8);                                 // for 8 seconds every hit poisons
              addFloater(p.x + p.w / 2, p.y - 14, 'POISON BLADE', game.GREEN, 12, 1.2);
              spawnEffect(p.x + p.w / 2, p.y + p.h / 2, game.art.fx.poison, { scale: 2, center: true, life: 0.5 });   // a cloud of poison bubbles
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
      // damage (optional): a dash with damage hurts every monster it flies through, once each. 0 = a harmless dash.
      function startDash(dir, speed, time, damage = 0) {
        player.dash = time;
        player.dashDir = dir;
        player.dashSpeed = speed;
        player.invincible = Math.max(player.invincible, time + 0.2);   // safe during the dash and a moment after it
        player.stun = 0;                                               // a dash also cancels a knockback
        player.dashDamage = damage;
        player.dashHit = [];                                           // nobody has been hit by this new dash yet
      }

      // While a damaging dash runs, hurt every monster the hero flies through, but each one only ONCE per dash.
      // player.dashHit remembers who was hit, the same trick as p.hit of a piercing projectile.
      function hitDashTargets() {
        if (player.dash <= 0 || player.dashDamage <= 0) { return; }
        for (const m of monsters) {
          if (m.alive && !player.dashHit.includes(m) && touching(player.x, player.y, player.w, player.h, m.x, m.y, m.w, m.h)) {
            damageMonster(m, player.dashDamage, player.x + player.w / 2);
            player.dashHit.push(m);
          }
        }
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
        thief: thiefSkills(),
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

      const CLOUDS = [{ x: 20, y: 30 }, { x: 150, y: 56 }, { x: 270, y: 24 }];
      const HILLS_FAR = [{ x: 40, r: 64 }, { x: 190, r: 80 }, { x: 330, r: 56 }];
      const HILLS_NEAR = [{ x: 90, r: 48 }, { x: 260, r: 56 }];

      // Where on the screen is a background object? 'factor' says how fast its layer scrolls:
      // 0 = glued to the sky, 1 = moves like the ground. The % makes the layer repeat every 'span' pixels.
      function layerX(worldX, factor, span) {
        const x = worldX - camera.x * factor;
        return ((x % span) + span) % span - 60;
      }

      function drawCloud(x, y, color) {
        game.circle(x, y, 9, color);
        game.circle(x + 12, y - 5, 12, color);
        game.circle(x + 26, y, 9, color);
        game.rect(x, y, 26, 9, color);
      }

      // Stars twinkle (the alpha changes with the time) and one moon hangs in the sky. Used by the ruins.
      const STARS = [];
      for (let i = 0; i < 26; i++) { STARS.push({ x: (i * 97) % 380, y: 6 + (i * 41) % 120 }); }

      function drawStars() {
        for (let i = 0; i < STARS.length; i++) {
          game.alpha(0.5 + 0.5 * Math.sin(game.time() * 3 + i * 1.7));
          game.rect(layerX(STARS[i].x, 0.05, 380), STARS[i].y, 2, 2, game.WHITE);
        }
        game.alpha(1);
        game.circle(250, 44, 16, [240, 232, 200]);
        game.circle(257, 40, 14, MAPS[mapId].sky);              // a second circle in the sky color bites the moon into a crescent
      }

      // Stalactites hang from the roof of the cave: a triangle made of thin strips that get narrower towards the tip.
      const STALACTITES = [{ x: 20, h: 44 }, { x: 90, h: 26 }, { x: 150, h: 54 }, { x: 230, h: 32 }, { x: 300, h: 46 }];

      function drawStalactites() {
        for (const s of STALACTITES) {
          const x = layerX(s.x, 0.3, 360);
          for (let y = 0; y < s.h; y += 2) {
            const half = Math.max(1, Math.round((s.h - y) / 6));
            game.rect(x - half, y, half * 2, 2, [70, 66, 104]);
          }
        }
      }

      // The extra background picture of the current map.
      function drawDecor(def) {
        if (def.decor === 'clouds') {
          for (const c of CLOUDS) { drawCloud(layerX(c.x, 0.1, 380), c.y, def.cloud); }
        } else if (def.decor === 'stars') {
          drawStars();
        } else if (def.decor === 'stalactites') {
          drawStalactites();
        }
      }

      // The background of the current map: its sky color, its decor and two layers of hills.
      function drawBackground() {
        const def = MAPS[mapId];
        game.clear(def.sky);
        drawDecor(def);
        for (const h of HILLS_FAR) { game.circle(layerX(h.x, 0.25, 440), 216, h.r, def.far); }
        for (const h of HILLS_NEAR) { game.circle(layerX(h.x, 0.5, 400), 224, h.r, def.near); }
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
          const image = player.dashDamage > 0 ? shadowArt(heroArt.walk1) : heroArt.walk1;     // a damaging dash leaves dark shadows
          spawnEffect(player.x - 3, player.y - 2, image, { flip: player.facing < 0, life: 0.2 });     // a fading afterimage
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
          if (game.keyPressed('enter')) { startAdventure(); }     // try again from the first map
          return;
        }
        handleInput();
        tryAttack();
        handleSkillKeys();
        if (tryPortal()) { return; }                        // a new map was loaded: continue in the next frame
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
        const wasDashing = player.dash > 0;
        player.dash = Math.max(0, player.dash - dt);                                         // the dash timer runs down
        if (wasDashing && player.dash === 0) { dashPuff(); }                                 // a puff of smoke where the dash ends
        updateEffects(dt);
        updateFloaters(dt);
        updateProjectiles(dt);
        updateMonsters(dt);
        updateSpawner(dt);                                                                   // dead monsters leave, and the map is topped up when the timer rings
        bannerTime = Math.max(0, bannerTime - dt);
        fade = Math.max(0, fade - 2.5 * dt);
        hitDashTargets();
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
        hudText(138, 6, MAPS[mapId].name, game.WHITE, 12);
        drawSpawnerHud();
        drawSkillBar();
        drawBuffs();
        if (state === 'dead') {
          game.rect(0, 80, game.WIDTH, 80, game.BLACK);
          game.text(70, 90, 'You were defeated', game.RED, 20);
          game.text(70, 118, 'You lost ' + lostCoins + ' coins.', game.YELLOW, 12);
          game.text(88, 138, 'Press enter to try again', game.WHITE, 12);
        }
      }

      // How many monsters live here, and (while some are missing) a bar that fills up until they come back.
      function drawSpawnerHud() {
        const def = MAPS[mapId];
        const n = countAlive();
        hudText(138, 21, 'Monsters ' + n + '/' + def.maxMonsters, game.WHITE, 10);
        if (n < def.maxMonsters) {
          drawBar(138, 34, 60, 4, def.respawnEvery - respawnTimer, def.respawnEvery, game.ORANGE);
          hudText(204, 31, Math.ceil(respawnTimer) + 's', game.ORANGE, 9);
        }
      }

      // The name of the map slides down from the top, stays for a moment and fades away.
      function drawBanner() {
        if (bannerTime <= 0) { return; }
        const age = BANNER_TIME - bannerTime;                      // 0 right after the map loaded
        const y = -26 + Math.min(1, age / 0.4) * 78;               // slide down during the first 0.4 seconds
        const name = MAPS[mapId].name;
        game.alpha(Math.min(1, bannerTime / 0.6) * 0.7);           // fade out in the last 0.6 seconds
        game.rect(50, y, 220, 26, game.BLACK);
        game.alpha(Math.min(1, bannerTime / 0.6));
        hudText((game.WIDTH - name.length * 9.5) / 2, y + 5, name, game.YELLOW, 16);
        game.alpha(1);
      }

      // A black curtain over everything. It is see-through more and more while 'fade' goes down to 0.
      function drawFade() {
        if (fade <= 0) { return; }
        game.alpha(fade);
        game.rect(0, 0, game.WIDTH, game.HEIGHT, game.BLACK);
        game.alpha(1);
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
        drawPortals();
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
        drawBanner();
        drawFade();
      }

      state = 'select';                           // the game starts at the select screen
      game.run(update, draw);
quiz:
  - q: "Why does the map keep the s m k b markers as a list of spawn points instead of using them only once?"
    options: ["New monsters must be born again later, and the spawn points say where they may appear", "Markers cannot be deleted from the rows", "It makes the monsters walk faster"]
    answer: 0
    explain: "Before, a marker created one monster when the map loaded. Now the map remembers the places, so the spawner can use them whenever monsters are missing."
  - q: "What does updateSpawner do while the map is full?"
    options: ["Nothing at all, the timer keeps its old value", "It keeps respawnTimer at the full respawnEvery, so the countdown starts fresh with the next kill", "It deletes the oldest monster"]
    answer: 1
    explain: "The timer only runs while monsters are missing. Parking it at the full interval means the first kill always starts a complete countdown."
  - q: "A portal is { to: 'forest', at: '<' }. What does 'at' mean?"
    options: ["The marker in the TARGET map where the hero appears", "The marker in the current map where the hero stands", "The time in seconds until the portal opens"]
    answer: 0
    explain: "loadMap(p.to, p.at) builds the target map and places the hero at its marker with the letter 'at'."
  - q: "How do you add a fifth map to the game?"
    options: ["Rewrite loadMap for the new map", "Add one more entry to MAPS (rows, colors, maxMonsters, respawnEvery, portals) and let a portal lead to its id", "Copy the whole program and change the rows"]
    answer: 1
    explain: "Everything that is different between maps is data in MAPS. The code only reads MAPS[mapId]."
---
## Where we are

The hero has four classes with twelve skills, but the whole adventure still happens on one map and the monsters are placed once. Kill them all and the game is empty. In a real online RPG you travel between maps, and every map keeps its own population: monsters are born again after a while, but never more than the map can hold.

## What we add

1. A table of **maps**, `MAPS`, with four monster maps: Whispering Meadow, Mushroom Forest, Echo Cave and Haunted Ruins. Each has its own tiles, sky, decor and monster mix.
2. A **limit and a timer** per map: `maxMonsters` and `respawnEvery`.
3. **Portals** that you enter with the up key.
4. Animations for all of it: a spawn puff, a fade-in, a glowing portal, a map name banner.

| Map | Monsters | Max | Respawn |
| --- | --- | --- | --- |
| Whispering Meadow | slimes | 6 | 15 s |
| Mushroom Forest | mushrooms, slimes | 7 | 18 s |
| Echo Cave | bats, mushrooms | 8 | 20 s |
| Haunted Ruins | skeletons, bats | 8 | 25 s |

## 1. One entry per map

`LEVEL` is gone. `MAPS` is an object, and the key of each entry is the map id. Everything that was a global fact about "the" map is now a field: the rows, the colors, the `ground` tile pictures, the portals. `mapId` says which entry is active, so `MAPS[mapId]` is "the current map". To add a map, you add an entry and nothing else, which is exactly what the golem chamber will do in step 17.

A portal is described by `{ to, at }`: `'>': { to: 'forest', at: '<' }` means "this portal leads to the forest, and you arrive at the forest's `<` portal".

`loadMap(id, at)` now takes two parameters. The marker letters have two jobs:

- `P`, `<` and `>` are **anchors**. While scanning the rows we store them in `anchors['<'] = { col, row }` and the hero is placed at `anchors[at]`.
- `s m k b` are **spawn points**. Before, they created a monster once. Now they are copied to the list `spawnPoints` and the map keeps them forever, because new monsters will be born there later.

Both turn into empty air in `map`, like `P` did before.

## 2. A limit and a timer

`topUpMonsters(withPoof)` adds monsters until `countAlive()` reaches `maxMonsters`. It picks spawn points that are **out of sight** (`onScreen` checks the camera) and prefers ones not used yet in the same round. `rand()` is a tiny seeded random generator, so the game does not depend on `Math.random`.

`updateSpawner(dt)` runs every frame:

```js
if (countAlive() >= def.maxMonsters) { respawnTimer = def.respawnEvery; return; }   // full: the timer waits
respawnTimer -= dt;                                                                 // missing monsters: count down
if (respawnTimer <= 0) { /* top up, then start the interval again */ }
```

So a kill never respawns anything at once. The first kill starts the countdown, and when it rings **every** missing monster appears together, each with a puff of smoke (`fx.poof`). It also first runs `monsters = monsters.filter(m => m.alive)`, so dead monsters leave the list and it never grows. The HUD shows `Monsters 4/6` and an orange bar that fills while you wait.

## 3. Portals

A portal is a rectangle 16 wide and 32 tall that ends at its marker's tile, so the hero can use `touching()` on it. `tryPortal()` runs in `update`: if `up` was pressed and `portalAtHero()` finds a portal, call `loadMap(p.to, p.at)`. A portal with a `blocked` text (the sealed gate of the ruins) does not open and shows that text instead. Use `keyPressed`, not `keyDown`, or one long press would send you back and forth between two maps.

Because the hero keeps its hit points, `loadMap` no longer heals. That job moved to `resetHero()`, and `startAdventure()` (new game, or try again after dying) calls `resetHero()` and then `loadMap('meadow')`.

## 4. Animation everywhere

Already written for you: monsters fade in over half a second (`m.age`), `drawPortal` draws a breathing oval with three animated sparkles (`SPARKLE`, a 3-frame animation made of text rows) and a bouncing `UP` hint, `drawBanner` slides the map name in and fades it out, `drawFade` fades each new map in from black, and the stars twinkle and stalactites hang in the background of the ruins and the cave.

> **Watch out:**
> - `TypeError: Cannot read properties of undefined (reading 'col')` means a portal entry in `MAPS` has no matching marker in the rows, or `at` names a marker the target map does not have.
> - If you spawn monsters before `updateCamera()` runs, `onScreen` uses the old camera and monsters can appear in front of the hero. That is why `loadMap` calls `updateCamera()` first.
> - A `while` loop that never reaches `maxMonsters` runs forever and freezes the page. `topUpMonsters` returns early when there are no spawn points.
> - Do not reset `respawnTimer` on every kill, or a hero who keeps killing would never see a respawn.

> **Your turn:** complete the 8 TODOs. When you start a game, the Whispering Meadow shows its name and has exactly 6 slimes, none of them on the screen. Kill some: nothing comes back at once, the orange bar fills for 15 seconds, then all missing slimes appear together in puffs of smoke. Walk to the glowing portal at the right end, press up and arrive in the Mushroom Forest with the same hit points. Visit all four maps and try the sealed gate at the end of the ruins.
