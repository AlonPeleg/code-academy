---
title: "Breakout: bricks and an aimable paddle"
summary: "Build a wall of bricks with a loop, bounce a ball off the bricks and an angled paddle, and count the bricks left."
level: intermediate
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # The paddle slides left and right to catch the ball
  2 right down
  11 right up
  19 left down
  33 left up
  36 right down
  72 right up
  76 left down
  104 left up
  116 right down
  147 right up
  154 left down
  200 left up
  207 right down
  241 right up
  253 left down
  283 left up
  287 right down
  297 right up
  298 left down
  311 left up
  319 right down
  360 right up
  362 left down
  378 left up
  390 right down
  400 right up
  404 left down
  422 left up
  431 right down
  453 right up
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define COLS 8
      #define ROWS 3
      #define NUM_BRICKS (COLS * ROWS)

      typedef struct { int x, y, w, h; } Rect;
      typedef struct { Rect box; int alive; } Brick;
      typedef struct { int x, y, vx, vy, size; } Ball;

      static int overlaps(Rect a, Rect b) {
          return a.x < b.x + b.w && a.x + a.w > b.x &&
                 a.y < b.y + b.h && a.y + a.h > b.y;
      }

      /* RGB_RED and friends expand to three numbers, so they fit inside braces. */
      static const int palette[ROWS][3] = {{RGB_RED}, {RGB_ORANGE}, {RGB_YELLOW}};

      int main(void) {
          Brick bricks[NUM_BRICKS];
          Rect paddle = {135, 220, 50, 8};
          Ball ball = {150, 150, 2, -4, 6};
          int bricks_left = NUM_BRICKS;
          int playing = 1;

          for (int i = 0; i < NUM_BRICKS; i++) {            /* lay out 8 columns x 3 rows */
              bricks[i].box.x = 1 + (i % COLS) * 40;
              bricks[i].box.y = 30 + (i / COLS) * 16;
              bricks[i].box.w = 38;
              bricks[i].box.h = 12;
              bricks[i].alive = 1;
          }

          engine_frames(450);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  paddle.x -= 5;
              if (key_down(KEY_RIGHT)) paddle.x += 5;
              if (paddle.x < 0) paddle.x = 0;
              if (paddle.x > SCREEN_W - paddle.w) paddle.x = SCREEN_W - paddle.w;

              if (playing) {
                  Rect ball_box;
                  ball.x += ball.vx;
                  ball.y += ball.vy;
                  if (ball.x < 0 || ball.x + ball.size > SCREEN_W) ball.vx = -ball.vx;
                  if (ball.y < 0) ball.vy = -ball.vy;
                  if (ball.y > SCREEN_H) playing = 0;             /* the ball fell out */

                  ball_box = (Rect){ball.x, ball.y, ball.size, ball.size};

                  // 1. PADDLE: if ball.vy > 0 and ball_box overlaps paddle, bounce it upward:
                  //    set ball.vy = -ball.vy, put the ball on top (ball.y = paddle.y - ball.size) and
                  //    steer it with ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5.
                  // 2. BRICKS: loop over all bricks. For the first one that is alive and overlaps
                  //    ball_box: set alive = 0, subtract 1 from bricks_left, flip ball.vy and break.
              }

              engine_clear(RGB_DARK);
              for (int i = 0; i < NUM_BRICKS; i++) {
                  if (!bricks[i].alive) continue;
                  const int *c = palette[i / COLS];             /* one color per row */
                  engine_rect(bricks[i].box.x, bricks[i].box.y, bricks[i].box.w, bricks[i].box.h, c[0], c[1], c[2]);
              }
              engine_rect(paddle.x, paddle.y, paddle.w, paddle.h, RGB_CYAN);
              engine_rect(ball.x, ball.y, ball.size, ball.size, RGB_WHITE);
              engine_present();
          }
          printf("bricks left: %d\n", bricks_left);
          return 0;
      }
check:
  output: |
    bricks left: 5
hints:
  - "Two jobs. The paddle bounce needs the ball to be moving down, flips vy, and uses the distance between the two centres to set vx. The bricks need a loop over the array that finds the FIRST alive brick overlapping the ball, breaks it and stops."
  - "Paddle: if (ball.vy > 0 && overlaps(ball_box, paddle)) { ball.vy = -ball.vy; ball.y = paddle.y - ball.size; ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5; }   Bricks: for each i, if alive and overlaps: alive = 0, bricks_left--, flip vy, break."
  - "Paddle: if (ball.vy > 0 && overlaps(ball_box, paddle)) { ball.vy = -ball.vy; ball.y = paddle.y - ball.size; ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5; }   Bricks: for (int i = 0; i < NUM_BRICKS; i++) { if (bricks[i].alive && overlaps(ball_box, bricks[i].box)) { bricks[i].alive = 0; bricks_left--; ball.vy = -ball.vy; break; } }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define COLS 8
      #define ROWS 3
      #define NUM_BRICKS (COLS * ROWS)

      typedef struct { int x, y, w, h; } Rect;
      typedef struct { Rect box; int alive; } Brick;
      typedef struct { int x, y, vx, vy, size; } Ball;

      static int overlaps(Rect a, Rect b) {
          return a.x < b.x + b.w && a.x + a.w > b.x &&
                 a.y < b.y + b.h && a.y + a.h > b.y;
      }

      /* RGB_RED and friends expand to three numbers, so they fit inside braces. */
      static const int palette[ROWS][3] = {{RGB_RED}, {RGB_ORANGE}, {RGB_YELLOW}};

      int main(void) {
          Brick bricks[NUM_BRICKS];
          Rect paddle = {135, 220, 50, 8};
          Ball ball = {150, 150, 2, -4, 6};
          int bricks_left = NUM_BRICKS;
          int playing = 1;

          for (int i = 0; i < NUM_BRICKS; i++) {            /* lay out 8 columns x 3 rows */
              bricks[i].box.x = 1 + (i % COLS) * 40;
              bricks[i].box.y = 30 + (i / COLS) * 16;
              bricks[i].box.w = 38;
              bricks[i].box.h = 12;
              bricks[i].alive = 1;
          }

          engine_frames(450);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  paddle.x -= 5;
              if (key_down(KEY_RIGHT)) paddle.x += 5;
              if (paddle.x < 0) paddle.x = 0;
              if (paddle.x > SCREEN_W - paddle.w) paddle.x = SCREEN_W - paddle.w;

              if (playing) {
                  Rect ball_box;
                  ball.x += ball.vx;
                  ball.y += ball.vy;
                  if (ball.x < 0 || ball.x + ball.size > SCREEN_W) ball.vx = -ball.vx;
                  if (ball.y < 0) ball.vy = -ball.vy;
                  if (ball.y > SCREEN_H) playing = 0;             /* the ball fell out */

                  ball_box = (Rect){ball.x, ball.y, ball.size, ball.size};

                  if (ball.vy > 0 && overlaps(ball_box, paddle)) {
                      ball.vy = -ball.vy;
                      ball.y = paddle.y - ball.size;
                      ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5;
                  }
                  for (int i = 0; i < NUM_BRICKS; i++) {
                      if (bricks[i].alive && overlaps(ball_box, bricks[i].box)) {
                          bricks[i].alive = 0;
                          bricks_left--;
                          ball.vy = -ball.vy;
                          break;
                      }
                  }
              }

              engine_clear(RGB_DARK);
              for (int i = 0; i < NUM_BRICKS; i++) {
                  if (!bricks[i].alive) continue;
                  const int *c = palette[i / COLS];             /* one color per row */
                  engine_rect(bricks[i].box.x, bricks[i].box.y, bricks[i].box.w, bricks[i].box.h, c[0], c[1], c[2]);
              }
              engine_rect(paddle.x, paddle.y, paddle.w, paddle.h, RGB_CYAN);
              engine_rect(ball.x, ball.y, ball.size, ball.size, RGB_WHITE);
              engine_present();
          }
          printf("bricks left: %d\n", bricks_left);
          return 0;
      }
quiz:
  - q: "In a 1D array of 8 columns per row, which brick index i is in column i % 8 and row i / 8?"
    options: ["Only the first row","Every index, this is how a grid is stored in a 1D array","Only bricks that are alive","None of them"]
    answer: 1
  - q: "Why do we break out of the brick loop after the first hit?"
    options: ["To save memory","Hitting two bricks in one frame would flip vy twice and send the ball straight through","Because arrays can only be searched once","break makes the ball faster"]
    answer: 1
    explain: "Two flips cancel each other out."
  - q: "What decides the new vx when the ball bounces off the paddle?"
    options: ["The distance between the ball's centre and the paddle's centre","A random number","The number of bricks left","The frame number"]
    answer: 0
  - q: "How is a broken brick removed in the C version?"
    options: ["The array shrinks by one","free() is called on it","It is overwritten with the next brick","Its alive flag is set to 0, so it is skipped when drawing and in collisions"]
    answer: 3
---
Breakout is a game of many small targets and one clever bounce. Here you will build a **wall of bricks** from an array and a loop, and give the paddle an **angled bounce** that lets the player aim.

## A wall from one loop

24 bricks in 8 columns and 3 rows. We do not type 24 positions by hand. One loop and some arithmetic place them:

```c
for (int i = 0; i < NUM_BRICKS; i++) {
    bricks[i].box.x = 1 + (i % COLS) * 40;     // column = i % 8
    bricks[i].box.y = 30 + (i / COLS) * 16;    // row    = i / 8
    bricks[i].box.w = 38;
    bricks[i].box.h = 12;
    bricks[i].alive = 1;
}
```

This is the **grid trick**: a 2D layout stored in a 1D array. For index `i`, the column is the remainder `i % COLS` and the row is the division `i / COLS` (integer division drops the fraction). Index 0 is the top-left brick, index 7 the top-right, index 8 starts the second row.

Each brick is a struct with a rectangle and a flag, like the coins in the Coin Collector lesson:

```c
typedef struct { Rect box; int alive; } Brick;
```

Breaking a brick never shrinks the array. We just set `alive = 0`, skip it when drawing and ignore it for collisions. The number of bricks left is a counter we lower by one each time.

> The colors work through a table. `RGB_RED` expands to three numbers, so it can sit inside braces: `static const int palette[3][3] = {{RGB_RED}, {RGB_ORANGE}, {RGB_YELLOW}};`. Then `palette[row]` is one color.

## The ball and its bounces

The ball moves by `vx` and `vy` each frame, and each wall flips one of them:

```c
if (ball.x < 0 || ball.x + ball.size > SCREEN_W) ball.vx = -ball.vx;
if (ball.y < 0) ball.vy = -ball.vy;
```

There is no bottom wall: if the ball falls below the screen, the round is over (`playing = 0`) and everything freezes.

## Hitting a brick

For the bricks we loop through the array and test the ball's box against each one that is still alive:

```c
for (int i = 0; i < NUM_BRICKS; i++) {
    if (bricks[i].alive && overlaps(ball_box, bricks[i].box)) {
        bricks[i].alive = 0;
        bricks_left--;
        ball.vy = -ball.vy;
        break;
    }
}
```

Two details matter. `alive &&` comes first so dead bricks are skipped. And `break` stops the loop after the **first** hit: if the ball touched two bricks in one frame and we flipped `vy` twice, it would go straight through both. Flipping `vy` is a simplification (a real game checks whether the ball hit the side or the bottom of the brick), but it is good enough and keeps the code short.

## An aimable paddle

If the paddle always returned the ball at the same angle, the game would be dull, and some bricks would be unreachable. The trick is to use **where the ball touches the paddle**:

```c
int offset = (ball.x + ball.size / 2) - (paddle.x + paddle.w / 2);
ball.vx = offset / 5;
```

`offset` is the distance from the paddle's centre to the ball's centre: negative on the left half, positive on the right. A hit in the middle sends the ball straight up, a hit at the far right sends it sharply to the right. Dividing by 5 turns pixels into a sensible speed, between about -5 and +5.

Also, when the ball bounces we place it on top of the paddle (`ball.y = paddle.y - ball.size`) and only bounce when `ball.vy > 0` (the ball is moving down). Without those two rules the ball can get stuck inside the paddle and flip direction every frame, which looks like jittering.

> **Watch out:**
> - Forgetting `break` after a brick hit: several bricks vanish in one frame and the ball tunnels through the wall.
> - `i / COLS` and `i % COLS` swapped: the wall comes out as 3 columns by 8 rows, which does not fit the screen.
> - Writing `if (bricks[i].alive = 0)` (one `=`) assigns instead of comparing; gcc warns `suggest parentheses around assignment used as truth value`.
> - Dividing the offset by `5.0` makes it a float, and assigning that to an int silently cuts off the decimals.

## Going further

Count how many times the ball touched the paddle and print it too. Make the ball 1 pixel faster every 3 bricks. The Player input tab holds the paddle's key presses; edit them and watch the bricks left change.

> **Your turn:** (1) Paddle: when `ball.vy > 0` and `ball_box` overlaps `paddle`, set `ball.vy = -ball.vy`, `ball.y = paddle.y - ball.size` and `ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5`. (2) Bricks: loop over all bricks; for the first alive one overlapping `ball_box` set `alive = 0`, subtract 1 from `bricks_left`, flip `ball.vy` and `break`. With the given keys the program prints `bricks left: 5`.
