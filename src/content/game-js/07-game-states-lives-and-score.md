---
title: Game states, lives and score
summary: Use a state variable to switch between playing and game over, and track lives and score while dodging falling blocks.
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      let state = 'playing';        // 'playing' or 'gameover'
      let lives = 3;
      let score = 0;
      let px = 150;                 // the player sits at the bottom
      const lanes = [60, 150, 240]; // the blocks fall in these columns, in turn
      let laneIndex = 0;
      let block = { x: lanes[0], y: -20 };

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function nextBlock() {
        laneIndex = (laneIndex + 1) % lanes.length;
        block.x = lanes[laneIndex];
        block.y = -20;
      }

      function restart() {
        state = 'playing';
        lives = 3;
        score = 0;
        px = 150;
        laneIndex = 0;
        block.x = lanes[0];
        block.y = -20;
      }

      function update(dt) {
        if (state === 'playing') {
          if (game.keyDown('left'))  { px -= 200 * dt; }
          if (game.keyDown('right')) { px += 200 * dt; }
          px = Math.max(0, Math.min(game.WIDTH - 24, px));

          block.y += 300 * dt;

          // 1. If the block touches the player (the player is a 24 by 24 square
          //    at px, 200 and the block is 20 by 20): lose a life, call nextBlock(),
          //    and when no lives are left switch state to 'gameover'.
          // 2. Otherwise, if the block has fallen below the bottom of the screen
          //    (block.y > game.HEIGHT): score a point and call nextBlock().
        } else {
          // 3. In the game over state, call restart() when enter is pressed.
        }
      }

      function draw() {
        game.clear(game.DARK);
        if (state === 'playing') {
          game.rect(block.x, block.y, 20, 20, game.ORANGE);
          game.rect(px, 200, 24, 24, game.CYAN);
        } else {
          game.text(100, 100, 'GAME OVER', game.RED, 24);
          game.text(90, 140, 'Press enter to retry', game.WHITE, 14);
        }
        game.text(10, 10, 'Score: ' + score, game.WHITE, 16);
        game.text(230, 10, 'Lives: ' + lives, game.WHITE, 16);
      }

      game.run(update, draw);
check:
  game:
    frames: 420
    keys: []
    expect: "state === 'gameover' && lives === 0 && score === 5"
    message: "Stand still for a few seconds: the block hits you 3 times (lives 3 -> 0, state 'gameover') and 5 blocks fall past you (score 5)."
  code:
    - { pattern: "state\\s*=\\s*['\"]gameover['\"]", message: "Switch to the game over state with state = 'gameover'." }
    - { pattern: "keyPressed\\(\\s*['\"]enter['\"]", message: "Restart with game.keyPressed('enter')." }
    - { pattern: 'lives\s*(-=|=\s*lives\s*-)\s*1|lives--', message: "Subtract 1 from lives when the block hits." }
hints:
  - "A state is just a variable holding a word like 'playing' or 'gameover'. Your code asks which state you are in and does different things. The touching function tells you about a hit."
  - "if (touching(px, 200, 24, 24, block.x, block.y, 20, 20)) { lives -= 1; nextBlock(); if (lives <= 0) { state = 'gameover'; } } else if (block.y > game.HEIGHT) { score += 1; nextBlock(); }"
  - "In the else branch of update: if (game.keyPressed('enter')) { restart(); }"
solution:
  - name: main.js
    code: |
      let state = 'playing';        // 'playing' or 'gameover'
      let lives = 3;
      let score = 0;
      let px = 150;                 // the player sits at the bottom
      const lanes = [60, 150, 240]; // the blocks fall in these columns, in turn
      let laneIndex = 0;
      let block = { x: lanes[0], y: -20 };

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function nextBlock() {
        laneIndex = (laneIndex + 1) % lanes.length;
        block.x = lanes[laneIndex];
        block.y = -20;
      }

      function restart() {
        state = 'playing';
        lives = 3;
        score = 0;
        px = 150;
        laneIndex = 0;
        block.x = lanes[0];
        block.y = -20;
      }

      function update(dt) {
        if (state === 'playing') {
          if (game.keyDown('left'))  { px -= 200 * dt; }
          if (game.keyDown('right')) { px += 200 * dt; }
          px = Math.max(0, Math.min(game.WIDTH - 24, px));

          block.y += 300 * dt;

          if (touching(px, 200, 24, 24, block.x, block.y, 20, 20)) {
            lives -= 1;
            nextBlock();
            if (lives <= 0) {
              state = 'gameover';
            }
          } else if (block.y > game.HEIGHT) {
            score += 1;
            nextBlock();
          }
        } else {
          if (game.keyPressed('enter')) {
            restart();
          }
        }
      }

      function draw() {
        game.clear(game.DARK);
        if (state === 'playing') {
          game.rect(block.x, block.y, 20, 20, game.ORANGE);
          game.rect(px, 200, 24, 24, game.CYAN);
        } else {
          game.text(100, 100, 'GAME OVER', game.RED, 24);
          game.text(90, 140, 'Press enter to retry', game.WHITE, 14);
        }
        game.text(10, 10, 'Score: ' + score, game.WHITE, 16);
        game.text(230, 10, 'Lives: ' + lives, game.WHITE, 16);
      }

      game.run(update, draw);
quiz:
  - q: "What is a game state?"
    options: ["The score of the player", "A variable saying which mode the game is in, such as 'playing' or 'gameover'", "The size of the screen"]
    answer: 1
  - q: "What is the difference between === and = ?"
    options: ["=== compares two values, = stores a value in a variable", "They are the same", "= compares, === stores"]
    answer: 0
    explain: "Writing if (state = 'gameover') by mistake would assign instead of compare, and is always true."
  - q: "Why do we do the player movement only when state is 'playing'?"
    options: ["So the player cannot move after game over", "To make the game faster", "Because keyDown does not work otherwise"]
    answer: 0
  - q: "Why put the restart code into a function?"
    options: ["Functions cannot be skipped", "The same reset can be reused, and the update stays short and readable", "It makes lives bigger"]
    answer: 1
---

So far your games go on forever. Real games have a beginning, a middle and an end: a title screen, the play, a "Game Over" screen. They give the player three lives and count points. In this lesson you will add the structure that does all of that, starting with the most important idea: the **state**.

## States

A **state** is a variable that names what the game is currently doing:

```js
let state = 'playing';     // or 'gameover'
```

Then `update` and `draw` ask where we are and behave accordingly:

```js
function update(dt) {
  if (state === 'playing') {
    // move things, check hits, ...
  } else {
    // wait for the player to press a key
  }
}
```

Use `===` to **compare** (three equals signs). A single `=` **stores** a value, so `if (state = 'gameover')` would overwrite the state and always be true, a famous beginner bug. The values in quotes are called **strings**.

A bigger game may have `'menu'`, `'playing'`, `'paused'`, `'gameover'` and `'won'`. The pattern stays the same: one variable, one `if` per state.

## Lives and score

Both are simple numbers declared at the top of the file:

```js
let lives = 3;
let score = 0;
```

When something good happens, `score += 1`. When something bad happens, `lives -= 1`, and then you must check whether it was the last life:

```js
lives -= 1;
if (lives <= 0) {
  state = 'gameover';
}
```

Use `<= 0` instead of `=== 0` as a safety net: if something ever subtracts 2 lives at once you do not skip over zero.

## The falling block

The game in this lesson has one block that falls from the top. The blocks come in three columns, one after another (the list `lanes`), and the player must stand in the right place. There are two ways a block can end:

1. It **touches the player**: lose a life. You detect it with the `touching` function from the collision lesson.
2. It **falls off the bottom** (`block.y > game.HEIGHT`) without touching: the player dodged it, so score a point.

In both cases `nextBlock()` sends the block back to the top in the next column. Using `else if` for the second case makes sure that a block can only count once per frame.

## Restarting

To play again, every variable must go back to its starting value. Writing that inside a function (`restart()`) keeps it in one place, and you can call it from anywhere:

```js
} else {
  if (game.keyPressed('enter')) {
    restart();
  }
}
```

Use `keyPressed` (true on the one frame where the key goes down) and not `keyDown`, otherwise a player who is still holding enter would restart over and over.

## Drawing the right thing

`draw` looks at the state too. In the `'playing'` state it paints the world, and in the `'gameover'` state it paints the message. The score and lives are drawn in both states so the player can see the final result.

> **Watch out:** `if (state = 'gameover')` (one equals sign) is not a comparison. It assigns, and the condition is always true.
>
> **Watch out:** typos in state names (`'gameOver'` in one place and `'gameover'` in another) silently break the game, because JavaScript does not complain. Copy and paste the words, or store them in constants.
>
> **Watch out:** forgetting to reset **every** variable in `restart()` gives a second round that starts with old values, like a score that is still 5.
>
> **Watch out:** if the lives display shows `-1`, you checked `=== 0` after subtracting twice or forgot to check at all.

## Going further

Try a `'menu'` state that waits for space before the game starts, or save the best score in a variable that `restart()` does not reset.

> **Your turn:** in the `'playing'` branch, when the block touches the player, subtract a life, call `nextBlock()` and switch to the `'gameover'` state when no lives remain. Otherwise, when the block passes the bottom, add a point and call `nextBlock()`. In the game over branch, call `restart()` when enter is pressed.
