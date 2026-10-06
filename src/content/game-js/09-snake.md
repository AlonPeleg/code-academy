---
title: Snake
summary: Move a snake on a grid with a timer accumulator, grow it with unshift and pop, and end the game on walls and crashes.
level: advanced
runner: jsgame
files:
  - name: main.js
    code: |
      const CELL = 16;                // one grid square is 16 by 16 pixels
      const COLS = game.WIDTH / CELL; // 20 columns
      const ROWS = game.HEIGHT / CELL; // 15 rows
      const STEP = 0.185;             // seconds between two moves of the snake

      let snake = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];   // the head comes first
      let dir = { x: 1, y: 0 };       // the snake moves one cell to the right per step
      let timer = 0;
      let score = 0;
      let state = 'playing';
      const foodSpots = [[9, 7], [9, 3], [3, 3], [3, 10]];
      let foodIndex = 0;

      function update(dt) {
        if (state !== 'playing') { return; }

        // 1. Turning: when 'up' is pressed (keyPressed) and the snake is not
        //    moving vertically right now (dir.y === 0), set dir to { x: 0, y: -1 }.
        //    Do the same for down (y: 1), left (x: -1) and right (x: 1).
        //    The snake may never turn straight back into itself.

        // 2. The timer accumulator: add dt to timer. When timer is at least STEP,
        //    subtract STEP from timer and call step().
      }

      function step() {
        // 3. Make the new head: the old head (snake[0]) plus dir.

        // 4. If the new head is outside the grid (x or y below 0, or x >= COLS,
        //    or y >= ROWS) or on a cell where the snake already is, set state to
        //    'gameover' and return.

        // 5. Put the new head at the front of the array. If it is on the food
        //    cell, add 1 to score and move foodIndex on (wrapping around);
        //    otherwise remove the last piece of the tail so the length stays.
      }

      function draw() {
        game.clear(game.DARK);
        const food = foodSpots[foodIndex];
        game.rect(food[0] * CELL + 2, food[1] * CELL + 2, CELL - 4, CELL - 4, game.RED);
        for (let i = 0; i < snake.length; i++) {
          game.rect(snake[i].x * CELL + 1, snake[i].y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? game.YELLOW : game.GREEN);
        }
        game.text(8, 4, 'Score: ' + score, game.WHITE, 14);
        if (state === 'gameover') {
          game.text(90, 100, 'GAME OVER', game.RED, 24);
        }
      }

      game.run(update, draw);
check:
  game:
    frames: 96
    keys:
      - { key: up, from: 50, to: 96 }
    expect: "score === 2 && snake.length === 5 && snake[0].x === 9 && snake[0].y === 3 && state === 'playing' && (snake = [{ x: 0, y: 0 }], dir = { x: -1, y: 0 }, step(), state === 'gameover')"
    message: "The snake should eat the first food (9, 7), turn up at frame 50, eat the second food (9, 3): score 2, length 5. And moving out of the grid must end the game."
  code:
    - { pattern: 'snake\.unshift\(', message: "Add the new head at the front with snake.unshift(head)." }
    - { pattern: 'snake\.pop\(\)', message: "Remove the tail with snake.pop() when no food was eaten." }
    - { pattern: 'timer\s*-=\s*STEP', message: "Subtract STEP from timer each time the snake moves." }
    - { pattern: "keyPressed\\(\\s*['\"]up['\"]", message: "Read the turn with game.keyPressed('up')." }
hints:
  - "The snake does not move every frame. The timer accumulator collects dt each frame, and every time it reaches STEP the snake moves one grid cell and the timer is reduced by STEP (the leftover stays, so the speed stays exact)."
  - "A snake is an array of cells with the head first. To move: build a new head, add it to the front with unshift, and remove the tail with pop. If the snake ate food, skip the pop and it grows by one."
  - "timer += dt; if (timer >= STEP) { timer -= STEP; step(); }   const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };   snake.unshift(head); if (head.x === food[0] && head.y === food[1]) { score += 1; foodIndex = (foodIndex + 1) % foodSpots.length; } else { snake.pop(); }"
solution:
  - name: main.js
    code: |
      const CELL = 16;                // one grid square is 16 by 16 pixels
      const COLS = game.WIDTH / CELL; // 20 columns
      const ROWS = game.HEIGHT / CELL; // 15 rows
      const STEP = 0.185;             // seconds between two moves of the snake

      let snake = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];   // the head comes first
      let dir = { x: 1, y: 0 };       // the snake moves one cell to the right per step
      let timer = 0;
      let score = 0;
      let state = 'playing';
      const foodSpots = [[9, 7], [9, 3], [3, 3], [3, 10]];
      let foodIndex = 0;

      function update(dt) {
        if (state !== 'playing') { return; }

        if (game.keyPressed('up') && dir.y === 0)    { dir = { x: 0, y: -1 }; }
        if (game.keyPressed('down') && dir.y === 0)  { dir = { x: 0, y: 1 }; }
        if (game.keyPressed('left') && dir.x === 0)  { dir = { x: -1, y: 0 }; }
        if (game.keyPressed('right') && dir.x === 0) { dir = { x: 1, y: 0 }; }

        timer += dt;
        if (timer >= STEP) {
          timer -= STEP;
          step();
        }
      }

      function step() {
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

        const outside = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS;
        const crashed = snake.some(p => p.x === head.x && p.y === head.y);
        if (outside || crashed) {
          state = 'gameover';
          return;
        }

        snake.unshift(head);
        const food = foodSpots[foodIndex];
        if (head.x === food[0] && head.y === food[1]) {
          score += 1;
          foodIndex = (foodIndex + 1) % foodSpots.length;
        } else {
          snake.pop();
        }
      }

      function draw() {
        game.clear(game.DARK);
        const food = foodSpots[foodIndex];
        game.rect(food[0] * CELL + 2, food[1] * CELL + 2, CELL - 4, CELL - 4, game.RED);
        for (let i = 0; i < snake.length; i++) {
          game.rect(snake[i].x * CELL + 1, snake[i].y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? game.YELLOW : game.GREEN);
        }
        game.text(8, 4, 'Score: ' + score, game.WHITE, 14);
        if (state === 'gameover') {
          game.text(90, 100, 'GAME OVER', game.RED, 24);
        }
      }

      game.run(update, draw);
quiz:
  - q: "Why does the snake not move on every frame?"
    options: ["Because update only runs once per second", "A timer accumulator makes it move one grid cell every STEP seconds, which feels like classic Snake", "Because arrays are slow"]
    answer: 1
  - q: "What does  snake.unshift(head)  do?"
    options: ["Adds head at the front of the array", "Removes the first item", "Adds head at the end of the array"]
    answer: 0
  - q: "How does the snake grow?"
    options: ["It doubles its speed", "A new array is created with two more items", "It adds a new head and skips removing the tail for that step"]
    answer: 2
  - q: "Why subtract STEP from timer (timer -= STEP) instead of setting timer = 0?"
    options: ["Setting it to 0 is a syntax error", "The leftover time is kept, so the movement stays at the exact speed even if a frame was a bit long", "timer would become negative"]
    answer: 1
---

Snake is the perfect next step: a game that is not smooth at all. The snake jumps from grid square to grid square, a few times a second, while the rest of the program (keyboard, drawing) still runs 60 times a second. To do that you need one new technique, the **timer accumulator**, and a good look at how an **array can model a body**.

## A grid on top of pixels

Instead of pixel positions, the snake lives on a **grid** of cells. Each cell is `CELL = 16` pixels, so the 320 by 240 screen has 20 columns and 15 rows. A position is a cell number like `{ x: 5, y: 7 }`. To draw it, convert to pixels by multiplying:

```js
game.rect(cell.x * CELL, cell.y * CELL, CELL, CELL, game.GREEN);
```

Working in cells makes collisions trivial: two things are in the same place exactly when both numbers are equal (`a.x === b.x && a.y === b.y`). No overlap maths needed.

## The timer accumulator

How do you do something every 0.185 seconds when `update` runs every 0.0167 seconds? Collect time in a variable:

```js
timer += dt;                 // add the time of this frame
if (timer >= STEP) {         // enough time has gathered for one move
  timer -= STEP;             // spend it
  step();                    // and move the snake once
}
```

Most frames nothing happens. Roughly every 11th frame the timer crosses `STEP`, and the snake moves. We subtract `STEP` rather than resetting to zero, so a small leftover remains and the long-term speed stays accurate even if a frame was a bit too long. This trick is used for anything that happens at fixed intervals: enemy spawns, animations, even physics simulations.

## The snake is an array

The snake is an array of cells, **head first**:

```js
let snake = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];
```

How do you move such a body? Do not move every piece. Instead:

1. Create a **new head** one cell ahead: `{ x: snake[0].x + dir.x, y: snake[0].y + dir.y }`.
2. Add it to the front: `snake.unshift(head)`. (`unshift` puts an item at the **start** of an array, `push` puts one at the end.)
3. Remove the last piece: `snake.pop()` (`pop` removes and returns the **last** item).

The body shuffles forward by one cell, and the length stays the same. To **grow**, skip step 3 once: the snake is now one longer. That's all there is to growing!

## Direction

`dir` holds the movement per step: `{ x: 1, y: 0 }` is right, `{ x: 0, y: -1 }` is up. Read the keys with `keyPressed`, because a quick tap between two steps must not be lost. And never allow a turn straight back: if the snake is moving horizontally (`dir.y === 0`), up and down are allowed; if it is moving vertically (`dir.x === 0`), only left and right are.

## Crashing

The game is over when the new head is outside the grid, or on a cell that belongs to the snake. `snake.some(p => p.x === head.x && p.y === head.y)` is `true` if any piece matches the head. (`some` is an array method that asks "does at least one item pass this test?".) Check this **before** you add the head, and use `return` to leave the function early.

> **Watch out:** if the snake zooms off immediately, you moved it in `update` on every frame instead of using the timer.
>
> **Watch out:** `snake.pop()` without a condition makes the snake never grow, and forgetting `pop` makes it grow forever. Exactly one of "eat" or "pop" happens per step.
>
> **Watch out:** mixing pixels and cells. Positions in `snake` are cells; only multiply by `CELL` when drawing.
>
> **Watch out:** using `keyDown` for turning can miss a quick tap that falls between two steps, or turn twice. `keyPressed` is correct.

## Going further

Make the snake speed up by a little every time it eats (`STEP -= 0.005`, but make it `let` first), draw the head in a different color, or place food at random empty cells.

> **Your turn:** implement the five steps: turning with `keyPressed` (without reversing), the timer accumulator in `update`, and in `step()` the new head, the crash check (walls and the snake itself), `unshift` for the head and `pop` for the tail unless the food was eaten.
