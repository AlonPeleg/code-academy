---
title: "Pong against the computer"
summary: "Build Pong with a class-based paddle, a ball that bounces and a computer paddle that chases it, with a lambda for scoring."
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
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include <string>
      #include "engine.h"

      struct Ball {
          int x = 156, y = 116, vx = 4, vy = 3, size = 6;

          void serve(int dir) { x = 156; y = 116; vx = 4 * dir; vy = 3; }
          void step() {
              x += vx;
              y += vy;
              if (y < 0 || y + size > SCREEN_H) vy = -vy;   // bounce off top and bottom
          }
      };

      class Paddle {
      public:
          explicit Paddle(int x) : x_(x) {}

          void move(int dy) { y_ = std::clamp(y_ + dy, 0, SCREEN_H - H); }

          // The computer: chase the ball's height, but never faster than AI_SPEED.
          void follow(const Ball& b) {
              // 1. Find the middle of the ball (b.y + b.size / 2) and the middle of this paddle (y_ + H / 2).
              //    If the paddle's middle is more than 4 pixels ABOVE the ball's middle, move(AI_SPEED).
              //    If it is more than 4 pixels BELOW, move(-AI_SPEED). Otherwise stay.
          }

          bool hits(const Ball& b) const {
              return b.x < x_ + W && b.x + b.size > x_ && b.y < y_ + H && b.y + b.size > y_;
          }
          int x() const { return x_; }
          int right() const { return x_ + W; }
          void draw(int r, int g, int b) const { engine_rect(x_, y_, W, H, r, g, b); }

      private:
          static constexpr int W = 8, H = 40, AI_SPEED = 2;
          int x_;
          int y_ = 100;
      };

      int main() {
          Paddle player(8), cpu(SCREEN_W - 16);
          Ball ball;
          int player_score = 0, cpu_score = 0;

          // A point: add 1 to a score and serve the ball toward the player who lost it.
          auto point = [&](int& score, int dir) {
              score++;
              ball.serve(dir);
          };

          engine_frames(450);
          while (engine_running()) {
              if (key_down(KEY_UP))   player.move(-4);
              if (key_down(KEY_DOWN)) player.move(4);
              cpu.follow(ball);

              ball.step();
              if (player.hits(ball)) { ball.vx = 4;  ball.x = player.right(); }
              if (cpu.hits(ball))    { ball.vx = -4; ball.x = cpu.x() - ball.size; }

              // 2. SCORING with the lambda. Ball out on the left (ball.x + ball.size < 0): point(cpu_score, -1).
              //    Ball out on the right (ball.x > SCREEN_W): point(player_score, 1).

              engine_clear(RGB_DARK);
              player.draw(RGB_CYAN);
              cpu.draw(RGB_PINK);
              engine_rect(ball.x, ball.y, ball.size, ball.size, RGB_WHITE);
              engine_text(140, 8, 16, RGB_WHITE,
                          (std::to_string(player_score) + " : " + std::to_string(cpu_score)).c_str());
              engine_present();
          }
          std::cout << "player " << player_score << ", computer " << cpu_score << std::endl;
          return 0;
      }
check:
  output: |
    player 4, computer 3
hints:
  - "Two small jobs. The computer needs one comparison between the middle of its paddle and the middle of the ball, with a 4 pixel dead zone and a speed limit, using the move method. Scoring means calling the point lambda with the right score and direction when the ball is completely past an edge."
  - "Compute target and middle, then: if (middle < target - 4) move(AI_SPEED); else if (middle > target + 4) move(-AI_SPEED). Scoring: ball.x + ball.size < 0 is a point for the computer (serve toward -1), ball.x > SCREEN_W a point for the player (serve toward 1)."
  - "In follow: int target = b.y + b.size / 2; int middle = y_ + H / 2; if (middle < target - 4) move(AI_SPEED); else if (middle > target + 4) move(-AI_SPEED);   In main: if (ball.x + ball.size < 0) point(cpu_score, -1); if (ball.x > SCREEN_W) point(player_score, 1);"
solution:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include <string>
      #include "engine.h"

      struct Ball {
          int x = 156, y = 116, vx = 4, vy = 3, size = 6;

          void serve(int dir) { x = 156; y = 116; vx = 4 * dir; vy = 3; }
          void step() {
              x += vx;
              y += vy;
              if (y < 0 || y + size > SCREEN_H) vy = -vy;   // bounce off top and bottom
          }
      };

      class Paddle {
      public:
          explicit Paddle(int x) : x_(x) {}

          void move(int dy) { y_ = std::clamp(y_ + dy, 0, SCREEN_H - H); }

          // The computer: chase the ball's height, but never faster than AI_SPEED.
          void follow(const Ball& b) {
              int target = b.y + b.size / 2;
              int middle = y_ + H / 2;
              if (middle < target - 4) move(AI_SPEED);
              else if (middle > target + 4) move(-AI_SPEED);
          }

          bool hits(const Ball& b) const {
              return b.x < x_ + W && b.x + b.size > x_ && b.y < y_ + H && b.y + b.size > y_;
          }
          int x() const { return x_; }
          int right() const { return x_ + W; }
          void draw(int r, int g, int b) const { engine_rect(x_, y_, W, H, r, g, b); }

      private:
          static constexpr int W = 8, H = 40, AI_SPEED = 2;
          int x_;
          int y_ = 100;
      };

      int main() {
          Paddle player(8), cpu(SCREEN_W - 16);
          Ball ball;
          int player_score = 0, cpu_score = 0;

          // A point: add 1 to a score and serve the ball toward the player who lost it.
          auto point = [&](int& score, int dir) {
              score++;
              ball.serve(dir);
          };

          engine_frames(450);
          while (engine_running()) {
              if (key_down(KEY_UP))   player.move(-4);
              if (key_down(KEY_DOWN)) player.move(4);
              cpu.follow(ball);

              ball.step();
              if (player.hits(ball)) { ball.vx = 4;  ball.x = player.right(); }
              if (cpu.hits(ball))    { ball.vx = -4; ball.x = cpu.x() - ball.size; }

              if (ball.x + ball.size < 0) point(cpu_score, -1);
              if (ball.x > SCREEN_W)      point(player_score, 1);

              engine_clear(RGB_DARK);
              player.draw(RGB_CYAN);
              cpu.draw(RGB_PINK);
              engine_rect(ball.x, ball.y, ball.size, ball.size, RGB_WHITE);
              engine_text(140, 8, 16, RGB_WHITE,
                          (std::to_string(player_score) + " : " + std::to_string(cpu_score)).c_str());
              engine_present();
          }
          std::cout << "player " << player_score << ", computer " << cpu_score << std::endl;
          return 0;
      }
quiz:
  - q: "What does std::clamp(v, 0, 200) return?"
    options: ["v limited to the range 0 to 200","The larger of v and 200","v squared","Always 0"]
    answer: 0
  - q: "Why is Paddle::y_ private?"
    options: ["So the program runs faster","So nobody can change it without going through move(), which keeps the paddle on screen","Because private variables use less memory","Private is required for every member"]
    answer: 1
    explain: "All changes go through one method, so the clamping rule can not be bypassed."
  - q: "In the lambda [&](int& score, int dir) { score++; ball.serve(dir); }, what does the [&] mean?"
    options: ["The lambda returns a reference","The lambda can not change anything","The lambda uses the surrounding variables (like ball) by reference","The lambda takes its arguments by address"]
    answer: 2
  - q: "Why does the computer paddle use a dead zone (the 4 in target - 4)?"
    options: ["So it moves faster","So it does not jitter up and down when it is already close enough","To skip drawing it","So it can leave the screen"]
    answer: 1
---
Pong is the classic first real game: a ball, two paddles and a score. In this lesson you will give the right paddle a **brain**, a method that chases the ball, and you will see how a class keeps its own data safe with `private` while still offering a clean set of actions.

## The cast: Ball and Paddle

The ball is a plain struct with default values. It has a position (`x`, `y`) and a **velocity** (`vx`, `vy`): how many pixels it moves per frame. One frame is 1/30 of a second, so `vx = 4` means 120 pixels per second.

```cpp
struct Ball {
    int x = 156, y = 116, vx = 4, vy = 3, size = 6;
    void step() {
        x += vx;
        y += vy;
        if (y < 0 || y + size > SCREEN_H) vy = -vy;    // bounce: flip the sign
    }
};
```

The paddle is a **class**. Its position is `private`: outside code can not poke `y_` directly, it has to ask for a move through a method:

```cpp
class Paddle {
public:
    void move(int dy) { y_ = std::clamp(y_ + dy, 0, SCREEN_H - H); }
private:
    int y_ = 100;
};
```

`std::clamp(v, lo, hi)` (from `<algorithm>`, C++17) returns `v` limited to the range from `lo` to `hi`. Because **every** move goes through `move`, the paddle can never leave the screen, no matter who calls it: the player's keys or the computer. That is the big benefit of putting rules inside a class.

## A beatable computer player

A computer that always sits exactly at the ball's height never misses, which is no fun. The trick is to **follow the ball, but slowly**. Each frame the paddle compares its own middle with the ball's middle and nudges itself toward it by at most `AI_SPEED` pixels:

```cpp
void follow(const Ball& b) {
    int target = b.y + b.size / 2;     // the ball's middle
    int middle = y_ + H / 2;           // this paddle's middle
    if (middle < target - 4)      move(AI_SPEED);    // ball is lower: go down
    else if (middle > target + 4) move(-AI_SPEED);   // ball is higher: go up
}
```

- `const Ball& b` is a **reference**: no copy is made, and `const` promises the method only looks at the ball.
- The `4` is a **dead zone**. If the paddle is already close enough, it stays still instead of jittering.
- `follow` reuses `move`, so the clamping rule is applied for free.

Because `AI_SPEED` (2) is smaller than the ball's vertical speed (3), the computer can be out-run when the ball bounces steeply. That makes the match winnable. Notice that this is the whole "artificial intelligence": one comparison. Game AI is usually this simple. It only has to feel believable.

## Scoring with a lambda

Every point does the same two things: add 1 to a score and serve the ball again. We write that once as a **lambda**, a small function defined right where it is needed:

```cpp
auto point = [&](int& score, int dir) {
    score++;
    ball.serve(dir);
};
```

- `[&]` means "the lambda may use the variables around it (like `ball`) by reference".
- `int& score` is a reference parameter, so `point(cpu_score, -1)` really increases `cpu_score`.
- `dir` is -1 to serve to the left and +1 to serve to the right: the ball goes toward the player who lost the point.

The ball is out on the left when `ball.x + ball.size < 0` and out on the right when `ball.x > SCREEN_W`.

## How this replay works

The left paddle is controlled by the **scripted player**: the `stdin` text lists when the up and down keys go down and up. The program runs on a server and the browser plays the recording back. Open the **Player input** tab, change a few frame numbers, and you "play" a different match with a different score line. The check only passes for the exact script that comes with the lesson, so restore it before pressing Check.

> **Watch out:**
> - Writing `point(cpu_score, -1)` with a lambda that takes `int score` (no `&`) changes a copy, and the score never goes up.
> - `std::clamp` needs `#include <algorithm>`; without it: `error: 'clamp' is not a member of 'std'`.
> - Calling `y_` from `main` gives `error: 'int Paddle::y_' is private within this context`. That error is the class protecting itself, so add a method instead.
> - Making the computer as fast as the ball: it never misses, and the score stays 0 : N.

## Going further

Try `AI_SPEED = 3` and watch the computer win every point. Then speed the ball up after each point, or change `vy` depending on where it hits the paddle.

> **Your turn:** fill in `Paddle::follow` using the target, middle and the dead zone of 4 pixels with `AI_SPEED`, and add the scoring with the lambda: ball out on the left gives `point(cpu_score, -1)`, ball out on the right gives `point(player_score, 1)`. With the given keys the program should print `player 4, computer 3`.
