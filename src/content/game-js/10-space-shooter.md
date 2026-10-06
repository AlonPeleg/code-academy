---
title: Final project, Space shooter
summary: Put everything together in a small shooter with a player, bullets, waves of enemies, score and lives.
level: advanced
runner: jsgame
files:
  - name: main.js
    code: |
      let player = { x: 150, y: 210 };
      let bullets = [];
      let enemies = [];
      let cooldown = 0;       // time until the next shot is allowed
      let spawnTimer = 0;     // time since the last enemy appeared
      let spawnCount = 0;
      let score = 0;
      let lives = 3;
      let state = 'playing';
      const columns = [150, 60, 240, 150, 100, 200];   // where the enemies appear, in turn

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function spawnEnemy() {
        enemies.push({ x: columns[spawnCount % columns.length], y: -20, alive: true });
        spawnCount += 1;
      }

      function update(dt) {
        if (state !== 'playing') { return; }

        if (game.keyDown('left'))  { player.x -= 200 * dt; }
        if (game.keyDown('right')) { player.x += 200 * dt; }
        player.x = Math.max(0, Math.min(game.WIDTH - 20, player.x));

        cooldown -= dt;
        spawnTimer += dt;
        if (spawnTimer >= 0.8) {
          spawnTimer -= 0.8;
          spawnEnemy();
        }

        // 1. Fire: when space is held and cooldown <= 0, add a bullet
        //    { x: player.x + 8, y: player.y, alive: true } and set cooldown to 0.26.

        // 2. Move every bullet up by 320 * dt and every enemy down by 70 * dt.

        // 3. For each bullet and enemy that touch (bullet 4 by 10, enemy 20 by 20)
        //    mark both as not alive and add 10 to score.

        // 4. For each enemy: if it touches the player (20 by 20) or has fallen
        //    below the screen (y > game.HEIGHT), subtract 1 from lives and mark
        //    it as not alive.

        // 5. Remove the dead and off-screen bullets and the dead enemies with
        //    filter. When lives is 0 or less, the state becomes 'gameover'.
      }

      function draw() {
        game.clear(game.DARK);
        for (const e of enemies) { game.rect(e.x, e.y, 20, 20, game.RED); }
        for (const b of bullets) { game.rect(b.x, b.y, 4, 10, game.YELLOW); }
        game.rect(player.x, player.y, 20, 20, game.CYAN);
        game.text(8, 6, 'Score: ' + score, game.WHITE, 14);
        game.text(240, 6, 'Lives: ' + lives, game.WHITE, 14);
        if (state === 'gameover') {
          game.text(90, 100, 'GAME OVER', game.RED, 24);
        }
      }

      game.run(update, draw);
check:
  game:
    frames: 400
    keys:
      - { key: space, from: 0, to: 400 }
    expect: "score >= 30 && lives >= 1 && lives < 3 && state === 'playing' && spawnCount >= 7"
    message: "Hold space without moving: the enemies in your column are shot (score 30 or more), the ones in other columns fall past you and cost lives, but you are still alive (at least one life left)."
  code:
    - { pattern: 'bullets\.push\(', message: "Fire with bullets.push({ ... })." }
    - { pattern: 'lives\s*(-=|=\s*lives\s*-)\s*1|lives--', message: "Subtract a life when an enemy gets through." }
    - { pattern: 'score\s*(\+=|=\s*score\s*\+)\s*10', message: "Add 10 to the score for every enemy you shoot." }
    - { pattern: 'enemies\s*=\s*enemies\.filter', message: "Clean up with enemies = enemies.filter(...)." }
    - { pattern: "state\\s*=\\s*['\"]gameover['\"]", message: "Set state to 'gameover' when lives run out." }
hints:
  - "Everything here you have done before: the cooldown shooting from the bullets lesson, the touching loop between two arrays, lives and states from the states lesson. Do the numbered steps one at a time and test with Run after each."
  - "Fire: if (game.keyDown('space') && cooldown <= 0) { bullets.push({ x: player.x + 8, y: player.y, alive: true }); cooldown = 0.26; }. Collisions: loop for (const b of bullets) { for (const e of enemies) { if (touching(b.x, b.y, 4, 10, e.x, e.y, 20, 20)) { ... } } }"
  - "for (const e of enemies) { if (touching(player.x, player.y, 20, 20, e.x, e.y, 20, 20) || e.y > game.HEIGHT) { lives -= 1; e.alive = false; } }   bullets = bullets.filter(b => b.alive && b.y > -10);   enemies = enemies.filter(e => e.alive);   if (lives <= 0) { state = 'gameover'; }"
solution:
  - name: main.js
    code: |
      let player = { x: 150, y: 210 };
      let bullets = [];
      let enemies = [];
      let cooldown = 0;       // time until the next shot is allowed
      let spawnTimer = 0;     // time since the last enemy appeared
      let spawnCount = 0;
      let score = 0;
      let lives = 3;
      let state = 'playing';
      const columns = [150, 60, 240, 150, 100, 200];   // where the enemies appear, in turn

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function spawnEnemy() {
        enemies.push({ x: columns[spawnCount % columns.length], y: -20, alive: true });
        spawnCount += 1;
      }

      function update(dt) {
        if (state !== 'playing') { return; }

        if (game.keyDown('left'))  { player.x -= 200 * dt; }
        if (game.keyDown('right')) { player.x += 200 * dt; }
        player.x = Math.max(0, Math.min(game.WIDTH - 20, player.x));

        cooldown -= dt;
        spawnTimer += dt;
        if (spawnTimer >= 0.8) {
          spawnTimer -= 0.8;
          spawnEnemy();
        }

        if (game.keyDown('space') && cooldown <= 0) {
          bullets.push({ x: player.x + 8, y: player.y, alive: true });
          cooldown = 0.26;
        }

        for (const b of bullets) { b.y -= 320 * dt; }
        for (const e of enemies) { e.y += 70 * dt; }

        for (const b of bullets) {
          for (const e of enemies) {
            if (touching(b.x, b.y, 4, 10, e.x, e.y, 20, 20)) {
              b.alive = false;
              e.alive = false;
              score += 10;
            }
          }
        }

        for (const e of enemies) {
          if (touching(player.x, player.y, 20, 20, e.x, e.y, 20, 20) || e.y > game.HEIGHT) {
            lives -= 1;
            e.alive = false;
          }
        }

        bullets = bullets.filter(b => b.alive && b.y > -10);
        enemies = enemies.filter(e => e.alive);
        if (lives <= 0) {
          state = 'gameover';
        }
      }

      function draw() {
        game.clear(game.DARK);
        for (const e of enemies) { game.rect(e.x, e.y, 20, 20, game.RED); }
        for (const b of bullets) { game.rect(b.x, b.y, 4, 10, game.YELLOW); }
        game.rect(player.x, player.y, 20, 20, game.CYAN);
        game.text(8, 6, 'Score: ' + score, game.WHITE, 14);
        game.text(240, 6, 'Lives: ' + lives, game.WHITE, 14);
        if (state === 'gameover') {
          game.text(90, 100, 'GAME OVER', game.RED, 24);
        }
      }

      game.run(update, draw);
quiz:
  - q: "Which earlier ideas does this game combine?"
    options: ["Only the game loop", "Keyboard input, clamping, cooldown timers, arrays, collision, states and lives", "Only collision"]
    answer: 1
  - q: "Why do we mark things with alive = false and filter afterwards instead of deleting inside the loop?"
    options: ["Deleting from an array while looping over it can skip items", "filter is faster than anything else", "alive is required by the engine"]
    answer: 0
  - q: "What is the spawn timer for?"
    options: ["It makes a new enemy appear at regular intervals, using the same accumulator trick as Snake", "It measures the score", "It slows the bullets"]
    answer: 0
  - q: "How could you make the game harder over time?"
    options: ["Lower the spawn interval or raise the enemy speed as the score grows", "Remove the lives", "Make the player bigger"]
    answer: 0
---

This is the finish line of the track: a complete little arcade game. A ship at the bottom slides left and right, holds fire to shoot bullets, and enemies keep arriving from the top. Shoot them to score, and let too many through and the game is over. There is nothing in it that you have not already met: this lesson is about **putting the pieces together**, which is what game programming mostly is.

## The ingredients

| Part | Where you learned it |
| --- | --- |
| The `update` / `draw` loop and `dt` | The game loop |
| Moving the ship with the keys | Moving with the keyboard |
| Keeping the ship on screen | Staying on screen |
| `touching` and score | Collision and coins |
| Arrays of bullets, a shooting cooldown, `filter` | Arrays of bullets and blocks |
| `state` and `lives` | Game states, lives and score |
| A timer that triggers things regularly | Snake |

## The shape of update

A big `update` is easier to write if you give it a fixed order. This one always does:

1. **Input**: read the keys, move the player.
2. **Spawn**: timers create new things (a bullet, an enemy).
3. **Move**: every bullet and enemy changes position by `speed * dt`.
4. **Collide**: look for things touching each other and mark them as `alive = false`.
5. **Clean up**: `filter` out everything that is not alive or has left the screen, then check the state (for example `lives <= 0`).

Doing it in the same order every frame prevents strange bugs, like a bullet that hits an enemy which was already removed.

## Enemies on a timer

The enemies appear every 0.8 seconds using the timer accumulator you know from Snake:

```js
spawnTimer += dt;
if (spawnTimer >= 0.8) {
  spawnTimer -= 0.8;
  spawnEnemy();
}
```

Where do they appear? To keep the game predictable (and testable), the column comes from a fixed list: `columns[spawnCount % columns.length]`. The `%` operator makes the index wrap around, so the sequence 150, 60, 240, 150, 100, 200 repeats forever. When you are happy with your game, replace it with `Math.random() * (game.WIDTH - 20)` for random columns.

## Two arrays meeting

To find out which bullets hit which enemies, you test **every** bullet against **every** enemy with two nested loops:

```js
for (const b of bullets) {
  for (const e of enemies) {
    if (touching(b.x, b.y, 4, 10, e.x, e.y, 20, 20)) {
      b.alive = false;
      e.alive = false;
      score += 10;
    }
  }
}
```

With a few dozen things on the screen this is plenty fast. (A game with thousands of objects would need smarter methods, like splitting the screen into regions.)

Notice that we never remove anything inside the loop: we only mark it. The `filter` calls at the end of `update` do all the removing in one place.

## Making it yours

When your shooter works, play it, then change its personality. Easy ideas:

- Draw ships with several rectangles, or a circle for the enemies. Use your own colors.
- Make the score count up faster for enemies in the far columns.
- Increase difficulty: every 100 points make the spawn interval a little shorter.
- Add a `'menu'` state with a title and a restart with `enter` like in the states lesson.
- Make enemies shoot back, or zigzag with `Math.sin(game.time() * 3)`.

> **Watch out:** if you remove items with `splice` inside a `for...of` loop, the next item is skipped. Mark and `filter` instead.
>
> **Watch out:** when two bullets hit the same enemy in one frame, both count. It is fine for this game, but if it matters, check `e.alive` before scoring.
>
> **Watch out:** `TypeError: Cannot read properties of undefined (reading 'x')` often means you filtered an array and then used an old index, or you spelled a property differently (`e.X`).
>
> **Watch out:** a game that gets slower and slower is nearly always an array that never shrinks. Make sure bullets that left the screen are filtered out.

> **Your turn:** complete the five numbered steps in `update`: fire with `bullets.push` and the cooldown, move bullets and enemies, score 10 points for every bullet and enemy that touch, subtract a life for every enemy that reaches the bottom or the player, and clean up with `filter` before switching to `'gameover'` when the lives are gone.
