---
title: Pong
summary: Build the classic two-paddle game with bouncing physics, a simple computer opponent and a score.
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      const PW = 8;                     // paddle width
      const PH = 50;                    // paddle height
      let leftY = 95;                   // top of the left paddle (you)
      let rightY = 95;                  // top of the right paddle (the computer)
      let ball = { x: 160, y: 120, vx: 200, vy: 140 };   // vx, vy in pixels per second
      let scoreL = 0;
      let scoreR = 0;
      let hits = 0;                     // how often a paddle has hit the ball

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function resetBall(direction) {
        ball.x = 160;
        ball.y = 120;
        ball.vx = 200 * direction;
        ball.vy = 140;
      }

      function update(dt) {
        // your paddle: W and S
        if (game.keyDown('w')) { leftY -= 200 * dt; }
        if (game.keyDown('s')) { leftY += 200 * dt; }
        leftY = Math.max(0, Math.min(game.HEIGHT - PH, leftY));

        // 1. The computer paddle: when the middle of the paddle (rightY + PH / 2)
        //    is more than 5 pixels above the ball, move down by 120 * dt; when it
        //    is more than 5 pixels below the ball, move up. Keep it on screen.

        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        // 2. Bounce off the top and bottom of the screen: the ball has a radius
        //    of 4, so when y goes outside 4..game.HEIGHT - 4, put it back on the
        //    edge and flip vy.

        // 3. Bounce off the paddles: the left paddle is at x = 10, the right one
        //    at x = 302. The ball is a square from (ball.x - 4, ball.y - 4) of
        //    size 8. When it touches a paddle while moving towards it, flip vx
        //    and add 1 to hits.

        // 4. When the ball leaves the left side (x < 0) the computer scores
        //    and the ball restarts towards the player, resetBall(-1);
        //    when it leaves the right side (x > game.WIDTH) you score and the
        //    ball restarts with resetBall(1).
      }

      function draw() {
        game.clear(game.DARK);
        for (let y = 0; y < game.HEIGHT; y += 20) {
          game.rect(159, y, 2, 10, game.GRAY);
        }
        game.rect(10, leftY, PW, PH, game.CYAN);
        game.rect(302, rightY, PW, PH, game.PINK);
        game.circle(ball.x, ball.y, 4, game.WHITE);
        game.text(130, 10, scoreL, game.WHITE, 24);
        game.text(175, 10, scoreR, game.WHITE, 24);
      }

      game.run(update, draw);
check:
  game:
    frames: 330
    keys:
      - { key: s, from: 0, to: 330 }
    expect: "hits >= 2 && scoreR >= 1 && ball.y >= 0 && ball.y <= game.HEIGHT && ball.x >= 0 && ball.x <= game.WIDTH && rightY !== 95"
    message: "Hold S so the left paddle hides at the bottom: the computer paddle must follow the ball and return it (hits), the ball must stay inside the walls, and the computer scores when you miss."
  code:
    - { pattern: 'vy\s*=\s*-\s*ball\.vy|ball\.vy\s*\*=\s*-1|vy\s*=\s*-vy', message: "Flip the vertical speed with ball.vy = -ball.vy." }
    - { pattern: 'ball\.vx\s*=\s*-\s*ball\.vx|ball\.vx\s*\*=\s*-1', message: "Flip the horizontal speed with ball.vx = -ball.vx." }
    - { pattern: 'resetBall\(\s*-?1\s*\)\s*;', message: "Call resetBall(...) when somebody scores." }
hints:
  - "Bouncing means flipping the sign of a speed. A ball that hits the top or bottom keeps its horizontal speed but reverses vy. A ball that hits a paddle reverses vx. Check vx's sign so a ball that is already leaving is not flipped again."
  - "Computer: if (rightY + PH / 2 < ball.y - 5) { rightY += 120 * dt; } else if (rightY + PH / 2 > ball.y + 5) { rightY -= 120 * dt; }. Walls: if (ball.y < 4) { ball.y = 4; ball.vy = -ball.vy; }, and the same at game.HEIGHT - 4."
  - "if (ball.vx < 0 && touching(ball.x - 4, ball.y - 4, 8, 8, 10, leftY, PW, PH)) { ball.vx = -ball.vx; hits += 1; }   if (ball.vx > 0 && touching(ball.x - 4, ball.y - 4, 8, 8, 302, rightY, PW, PH)) { ball.vx = -ball.vx; hits += 1; }   if (ball.x < 0) { scoreR += 1; resetBall(-1); }"
solution:
  - name: main.js
    code: |
      const PW = 8;                     // paddle width
      const PH = 50;                    // paddle height
      let leftY = 95;                   // top of the left paddle (you)
      let rightY = 95;                  // top of the right paddle (the computer)
      let ball = { x: 160, y: 120, vx: 200, vy: 140 };   // vx, vy in pixels per second
      let scoreL = 0;
      let scoreR = 0;
      let hits = 0;                     // how often a paddle has hit the ball

      function touching(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      }

      function resetBall(direction) {
        ball.x = 160;
        ball.y = 120;
        ball.vx = 200 * direction;
        ball.vy = 140;
      }

      function update(dt) {
        // your paddle: W and S
        if (game.keyDown('w')) { leftY -= 200 * dt; }
        if (game.keyDown('s')) { leftY += 200 * dt; }
        leftY = Math.max(0, Math.min(game.HEIGHT - PH, leftY));

        // the computer follows the ball, but a bit slower than the ball can move
        if (rightY + PH / 2 < ball.y - 5) {
          rightY += 120 * dt;
        } else if (rightY + PH / 2 > ball.y + 5) {
          rightY -= 120 * dt;
        }
        rightY = Math.max(0, Math.min(game.HEIGHT - PH, rightY));

        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        if (ball.y < 4) {
          ball.y = 4;
          ball.vy = -ball.vy;
        }
        if (ball.y > game.HEIGHT - 4) {
          ball.y = game.HEIGHT - 4;
          ball.vy = -ball.vy;
        }

        if (ball.vx < 0 && touching(ball.x - 4, ball.y - 4, 8, 8, 10, leftY, PW, PH)) {
          ball.vx = -ball.vx;
          hits += 1;
        }
        if (ball.vx > 0 && touching(ball.x - 4, ball.y - 4, 8, 8, 302, rightY, PW, PH)) {
          ball.vx = -ball.vx;
          hits += 1;
        }

        if (ball.x < 0) {
          scoreR += 1;
          resetBall(-1);
        }
        if (ball.x > game.WIDTH) {
          scoreL += 1;
          resetBall(1);
        }
      }

      function draw() {
        game.clear(game.DARK);
        for (let y = 0; y < game.HEIGHT; y += 20) {
          game.rect(159, y, 2, 10, game.GRAY);
        }
        game.rect(10, leftY, PW, PH, game.CYAN);
        game.rect(302, rightY, PW, PH, game.PINK);
        game.circle(ball.x, ball.y, 4, game.WHITE);
        game.text(130, 10, scoreL, game.WHITE, 24);
        game.text(175, 10, scoreR, game.WHITE, 24);
      }

      game.run(update, draw);
quiz:
  - q: "How do you make a ball bounce off a wall?"
    options: ["Set its speed to zero", "Flip the sign of the speed component that points at the wall", "Move it back to the center"]
    answer: 1
  - q: "Why do we check ball.vx < 0 before testing the left paddle?"
    options: ["So a ball that already moves away is not flipped again while it still overlaps the paddle", "Because vx is always negative", "To make the ball faster"]
    answer: 0
    explain: "Without the check the ball could flip every frame while inside the paddle and get stuck."
  - q: "Why is the computer paddle slower (120) than the ball's vertical speed would allow it to be?"
    options: ["A perfect opponent never misses and the game would be no fun", "A slower speed uses less memory", "It has to be exactly half"]
    answer: 0
  - q: "What does the computer paddle compare to decide where to go?"
    options: ["The middle of its paddle and the ball's y", "The score", "The key presses"]
    answer: 0
---

Pong, from 1972, is the grandfather of video games: two paddles, a ball and a score. It looks too simple to be interesting, but it contains nearly everything you have learned so far: movement with `dt`, clamping, collision and score. And it adds three new ideas: **velocity**, **bouncing** and a very small **artificial intelligence**.

## Velocity

So far we moved things with a single `speed`. A ball moves in two directions at once, so it has a speed for each axis, called its **velocity**:

```js
let ball = { x: 160, y: 120, vx: 200, vy: 140 };
// each frame:
ball.x += ball.vx * dt;
ball.y += ball.vy * dt;
```

`vx` (pixels per second to the right) and `vy` (pixels per second downwards) together decide the angle. With `vx = 200` and `vy = 140` the ball flies right and down. A **negative** number means the other direction.

## Bouncing is a sign flip

When the ball hits a horizontal wall (top or bottom), it keeps going sideways but turns around vertically. In numbers: `vy` becomes `-vy`.

```js
if (ball.y < 4) {          // the ball has a radius of 4
  ball.y = 4;              // put it back on the edge
  ball.vy = -ball.vy;      // and turn around
}
```

The line `ball.y = 4` matters: it moves the ball back inside, so it does not stay in the wall for another frame and bounce twice. Bottom wall: the same with `game.HEIGHT - 4`.

Hitting a paddle is the same idea for the other axis: `vx = -vx`. Because the paddles are rectangles, we use the `touching` function from the collision lesson, treating the ball as an 8 by 8 square that begins at `(ball.x - 4, ball.y - 4)`.

```js
if (ball.vx < 0 && touching(ball.x - 4, ball.y - 4, 8, 8, 10, leftY, PW, PH)) {
  ball.vx = -ball.vx;
}
```

`ball.vx < 0` means "the ball is travelling left". Without that check, the ball can still overlap the paddle one frame later, flip **again**, and get stuck inside the paddle, shaking back and forth. Checking the direction first ensures that it flips once.

## A tiny artificial intelligence

The right paddle plays itself. You do not need anything fancy: the computer just looks at where the ball is and moves towards it.

```js
if (rightY + PH / 2 < ball.y - 5) {
  rightY += 120 * dt;          // the paddle's middle is above the ball: go down
} else if (rightY + PH / 2 > ball.y + 5) {
  rightY -= 120 * dt;          // the paddle's middle is below the ball: go up
}
```

`rightY + PH / 2` is the middle of the paddle. The margin of 5 pixels prevents the paddle from jittering when it is already lined up. And the computer moves at a limited speed (120), so it can be beaten with a steep shot. Game designers call this **tuning**: change the number and the opponent gets easier or harder. An AI that never loses is not fun to play against.

## Scoring

If the ball leaves the left side of the screen, the computer scores. If it leaves the right, you do. In both cases the ball restarts from the middle, towards the player who just lost the point, using the helper `resetBall(direction)` (`-1` means left, `1` means right).

## Playing and testing

Try it live: W and S move your paddle (the paddles are clamped inside the screen). To check your code, the test holds S so the left paddle sits at the bottom, lets the game run for a few seconds and then expects that the computer returned the ball at least twice, scored when the ball got past you, and that the ball is still inside the screen.

> **Watch out:** if the ball vanishes through the top, you forgot the wall bounce or compare with the wrong value. Print `ball.y` with `console.log`.
>
> **Watch out:** a ball that shakes inside the paddle did not check the direction (`ball.vx > 0` or `< 0`) before flipping.
>
> **Watch out:** `rightY` is the **top** of the paddle. To aim the middle at the ball you need `rightY + PH / 2`.
>
> **Watch out:** `ball.vx = -ball.vx` is a flip. Writing `ball.vx = -200` instead always sends the ball to the left, even if it already goes left.

## Going further

Make the ball a little faster at every paddle hit, give the player a second paddle on the keyboard (up and down arrows), or let the bounce angle depend on where the ball hits the paddle.

> **Your turn:** complete the four numbered steps: move the computer paddle towards the ball, bounce off the top and bottom, bounce off both paddles (counting `hits`), and handle scoring with `resetBall`.
