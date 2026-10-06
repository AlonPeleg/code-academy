---
title: "Pong against the computer"
summary: "Build Pong with a ball that bounces and a computer paddle that chases it, using pointers to change structs inside functions."
level: intermediate
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # The player slides the left paddle up and down; the computer plays the right paddle
  5 up down
  35 up up
  51 down down
  96 down up
  126 up down
  152 up up
  160 down down
  199 down up
  226 up down
  243 up up
  271 down down
  314 down up
  344 up down
  378 up up
  404 down down
  420 down up
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define PADDLE_W 8
      #define PADDLE_H 40
      #define AI_SPEED 2
      #define SERVE_X 156
      #define SERVE_Y 116

      typedef struct { int x, y, w, h; } Paddle;
      typedef struct { int x, y, vx, vy, size; } Ball;

      static int clamp(int v, int lo, int hi) {
          return v < lo ? lo : (v > hi ? hi : v);
      }

      /* Is the ball touching the paddle? (two rectangles overlap) */
      static int hits(const Ball *b, const Paddle *p) {
          return b->x < p->x + p->w && b->x + b->size > p->x &&
                 b->y < p->y + p->h && b->y + b->size > p->y;
      }

      /* Put the ball in the middle and send it toward `dir` (-1 left, +1 right). */
      static void serve(Ball *b, int dir) {
          b->x = SERVE_X; b->y = SERVE_Y;
          b->vx = 4 * dir; b->vy = 3;
      }

      /* The computer: chase the ball's height, but never faster than AI_SPEED. */
      static void ai_move(Paddle *p, const Ball *b) {
          // 1. Find the middle of the ball (b->y + b->size / 2) and the middle of the paddle.
          //    If the paddle's middle is more than 4 pixels ABOVE the ball's middle, move down by AI_SPEED.
          //    If it is more than 4 pixels BELOW, move up by AI_SPEED. Otherwise stay.
          p->y = clamp(p->y, 0, SCREEN_H - p->h);
      }

      int main(void) {
          Paddle player = {8, 100, PADDLE_W, PADDLE_H};
          Paddle cpu = {SCREEN_W - 16, 100, PADDLE_W, PADDLE_H};
          Ball ball = {0, 0, 0, 0, 6};
          int player_score = 0, cpu_score = 0;
          char label[40];

          serve(&ball, 1);
          engine_frames(450);

          while (engine_running()) {
              if (key_down(KEY_UP))   player.y -= 4;
              if (key_down(KEY_DOWN)) player.y += 4;
              player.y = clamp(player.y, 0, SCREEN_H - player.h);
              ai_move(&cpu, &ball);

              ball.x += ball.vx;
              ball.y += ball.vy;
              if (ball.y < 0 || ball.y + ball.size > SCREEN_H) ball.vy = -ball.vy;
              if (hits(&ball, &player)) { ball.vx = 4; ball.x = player.x + player.w; }
              if (hits(&ball, &cpu))    { ball.vx = -4; ball.x = cpu.x - ball.size; }

              // 2. SCORING. If the ball left through the left edge (ball.x + ball.size < 0) the computer
              //    scores: add 1 and serve(&ball, -1). If it left through the right edge (ball.x > SCREEN_W)
              //    the player scores: add 1 and serve(&ball, 1).

              engine_clear(RGB_DARK);
              engine_rect(player.x, player.y, player.w, player.h, RGB_CYAN);
              engine_rect(cpu.x, cpu.y, cpu.w, cpu.h, RGB_PINK);
              engine_rect(ball.x, ball.y, ball.size, ball.size, RGB_WHITE);
              snprintf(label, sizeof label, "%d : %d", player_score, cpu_score);
              engine_text(140, 8, 16, RGB_WHITE, label);
              engine_present();
          }
          printf("player %d, computer %d\n", player_score, cpu_score);
          return 0;
      }
check:
  output: |
    player 4, computer 3
hints:
  - "Two small jobs. The computer needs one comparison between the middle of its paddle and the middle of the ball, with a 4 pixel dead zone and a speed limit. Scoring means: when the ball is completely past an edge, add a point to the right side and call serve with the right direction."
  - "Compute target and middle, then: if (middle < target - 4) go down by AI_SPEED, else if (middle > target + 4) go up by AI_SPEED. Scoring: ball.x + ball.size < 0 is a point for the computer, ball.x > SCREEN_W is a point for the player."
  - "In ai_move: int target = b->y + b->size / 2; int middle = p->y + p->h / 2; if (middle < target - 4) p->y += AI_SPEED; else if (middle > target + 4) p->y -= AI_SPEED;   In main: if (ball.x + ball.size < 0) { cpu_score++; serve(&ball, -1); } and if (ball.x > SCREEN_W) { player_score++; serve(&ball, 1); }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define PADDLE_W 8
      #define PADDLE_H 40
      #define AI_SPEED 2
      #define SERVE_X 156
      #define SERVE_Y 116

      typedef struct { int x, y, w, h; } Paddle;
      typedef struct { int x, y, vx, vy, size; } Ball;

      static int clamp(int v, int lo, int hi) {
          return v < lo ? lo : (v > hi ? hi : v);
      }

      /* Is the ball touching the paddle? (two rectangles overlap) */
      static int hits(const Ball *b, const Paddle *p) {
          return b->x < p->x + p->w && b->x + b->size > p->x &&
                 b->y < p->y + p->h && b->y + b->size > p->y;
      }

      /* Put the ball in the middle and send it toward `dir` (-1 left, +1 right). */
      static void serve(Ball *b, int dir) {
          b->x = SERVE_X; b->y = SERVE_Y;
          b->vx = 4 * dir; b->vy = 3;
      }

      /* The computer: chase the ball's height, but never faster than AI_SPEED. */
      static void ai_move(Paddle *p, const Ball *b) {
          int target = b->y + b->size / 2;
          int middle = p->y + p->h / 2;
          if (middle < target - 4) p->y += AI_SPEED;
          else if (middle > target + 4) p->y -= AI_SPEED;
          p->y = clamp(p->y, 0, SCREEN_H - p->h);
      }

      int main(void) {
          Paddle player = {8, 100, PADDLE_W, PADDLE_H};
          Paddle cpu = {SCREEN_W - 16, 100, PADDLE_W, PADDLE_H};
          Ball ball = {0, 0, 0, 0, 6};
          int player_score = 0, cpu_score = 0;
          char label[40];

          serve(&ball, 1);
          engine_frames(450);

          while (engine_running()) {
              if (key_down(KEY_UP))   player.y -= 4;
              if (key_down(KEY_DOWN)) player.y += 4;
              player.y = clamp(player.y, 0, SCREEN_H - player.h);
              ai_move(&cpu, &ball);

              ball.x += ball.vx;
              ball.y += ball.vy;
              if (ball.y < 0 || ball.y + ball.size > SCREEN_H) ball.vy = -ball.vy;
              if (hits(&ball, &player)) { ball.vx = 4; ball.x = player.x + player.w; }
              if (hits(&ball, &cpu))    { ball.vx = -4; ball.x = cpu.x - ball.size; }

              if (ball.x + ball.size < 0) { cpu_score++; serve(&ball, -1); }
              if (ball.x > SCREEN_W)      { player_score++; serve(&ball, 1); }

              engine_clear(RGB_DARK);
              engine_rect(player.x, player.y, player.w, player.h, RGB_CYAN);
              engine_rect(cpu.x, cpu.y, cpu.w, cpu.h, RGB_PINK);
              engine_rect(ball.x, ball.y, ball.size, ball.size, RGB_WHITE);
              snprintf(label, sizeof label, "%d : %d", player_score, cpu_score);
              engine_text(140, 8, 16, RGB_WHITE, label);
              engine_present();
          }
          printf("player %d, computer %d\n", player_score, cpu_score);
          return 0;
      }
quiz:
  - q: "In C, what does p->y mean when p is a pointer to a Paddle?"
    options: ["The y field of the Paddle that p points to","The address of y","p multiplied by y","A copy of the whole Paddle"]
    answer: 0
    explain: "p->y is shorthand for (*p).y: follow the pointer, then take the field."
  - q: "Why is the computer's paddle given a speed limit (AI_SPEED) smaller than the ball's speed?"
    options: ["To save memory","So it can be out-run and the player can win points","Because paddles can not move fast","So the ball bounces higher"]
    answer: 1
    explain: "A perfect opponent is no fun. The limit makes it beatable."
  - q: "How does the ball bounce off the top and bottom walls?"
    options: ["Its position is reset to the middle","Its vx is set to 0","Its vy changes sign: vy = -vy","It is deleted and recreated"]
    answer: 2
  - q: "Why pass &cpu (an address) to ai_move instead of cpu itself?"
    options: ["Because structs can not be passed","To make the call run faster than any other call","Because the function name starts with ai","A plain struct argument is a copy, so the function could not move the real paddle"]
    answer: 3
    explain: "Passing the address lets the function change the original variable."
---
Pong is the classic first real game: a ball, two paddles and a score. In this lesson you will give the right paddle a **brain**: a tiny piece of code that chases the ball, and you will learn to change a struct from inside a function by passing a **pointer**.

## The cast: ball and paddles

Everything in Pong is described by two small structs:

```c
typedef struct { int x, y, w, h; } Paddle;
typedef struct { int x, y, vx, vy, size; } Ball;
```

The ball has a position (`x`, `y`) and a **velocity** (`vx`, `vy`): how many pixels it moves per frame. One frame is 1/30 of a second, so `vx = 4` means 120 pixels per second. Each frame the game does just this:

```c
ball.x += ball.vx;
ball.y += ball.vy;
```

To bounce, flip the sign of one velocity. Hitting the top or bottom flips `vy`; hitting a paddle flips `vx`:

```c
if (ball.y < 0 || ball.y + ball.size > SCREEN_H) ball.vy = -ball.vy;
```

## Pointers: letting a function change your struct

If you pass a struct to a function the normal way, C hands over a **copy**, and changes are lost. To move the computer's paddle from inside a function we pass its **address** instead:

```c
static void ai_move(Paddle *p, const Ball *b) {
    p->y += 2;            // p->y means (*p).y : the y of the paddle p points to
}

ai_move(&cpu, &ball);     // &cpu = "the address of cpu"
```

- `Paddle *p` reads "p is a pointer to a Paddle".
- `&cpu` produces the address of the variable `cpu`.
- `p->y` follows the pointer and reaches the field. Use `->` for pointers and `.` for normal structs.
- `const Ball *b` promises the function will only look at the ball, never change it. The compiler enforces that promise.

## A beatable computer player

A computer player that always sits exactly at the ball's height can never miss, and the game would be no fun. The trick is to make it **follow the ball, but slowly**. Each frame it compares the middle of its paddle with the middle of the ball and nudges itself toward it by at most `AI_SPEED` pixels:

```c
int target = b->y + b->size / 2;      // the ball's middle
int middle = p->y + p->h / 2;         // the paddle's middle
if (middle < target - 4)      p->y += AI_SPEED;   // ball is lower: go down
else if (middle > target + 4) p->y -= AI_SPEED;   // ball is higher: go up
```

The `4` creates a **dead zone**: if the paddle is already close enough it stays still instead of jittering. Because `AI_SPEED` (2) is smaller than the ball's vertical speed (3), the computer can be out-run when the ball bounces around steeply. That is exactly what makes the match winnable.

Notice that this is the whole "artificial intelligence": one comparison. Game AI is usually this simple. It only has to feel believable.

## Scoring and serving

When the ball leaves the screen, someone scored. The ball is at x below zero when it passed the left paddle, and above `SCREEN_W` when it passed the right one. After a point we call `serve`, which puts the ball back in the middle and sends it toward the player who lost the point (`dir` is -1 for left, +1 for right).

## How this replay works

The left paddle is controlled by the **scripted player**: the `stdin` text lists the moments when the up and down keys go down and up. The program is run on a server and the browser plays the recording back. Open the **Player input** tab and change a few frame numbers: you will "play" a different match and get a different score line. The check only passes for the exact script that comes with the lesson, so restore it before pressing Check.

> **Watch out:**
> - `p.y` on a pointer will not compile: `error: 'p' is a pointer; did you mean to use '->'?`. Use `p->y`.
> - Forgetting the `&` when calling: `ai_move(cpu, &ball)` gives `incompatible type for argument 1`.
> - Using `/` on two ints throws away the fraction: `size / 2` with `size = 5` is 2, not 2.5. That is fine here but surprises beginners.
> - Making the computer as fast as the ball: it never misses, and the score stays 0 : N.

## Going further

Try `AI_SPEED 3` and watch the computer win every point. Then make the ball a bit faster after each point, or let the angle depend on where it hits the paddle, as you will do in the Breakout lesson.

> **Your turn:** fill in `ai_move` using the target, middle and the dead zone of 4 pixels with `AI_SPEED`, and add the scoring: when the ball leaves on the left, the computer scores and `serve(&ball, -1)`; when it leaves on the right, the player scores and `serve(&ball, 1)`. With the given keys the program should print `player 4, computer 3`.
