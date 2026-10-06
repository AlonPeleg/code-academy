---
title: "Breakout: bricks and an aimable paddle"
summary: "Build a wall of bricks with nested loops, find the hit brick with std::find_if and a lambda, and count the survivors."
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
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include <vector>
      #include "engine.h"

      constexpr int COLS = 8, ROWS = 3;

      struct Rect {
          int x, y, w, h;
          bool overlaps(const Rect& o) const {
              return x < o.x + o.w && x + w > o.x && y < o.y + o.h && y + h > o.y;
          }
      };

      struct Brick {
          Rect box;
          int row;
          bool alive = true;
      };

      struct Ball {
          int x = 150, y = 150, vx = 2, vy = -4, size = 6;
          Rect box() const { return {x, y, size, size}; }
      };

      // RGB_RED and friends expand to three numbers, so they fit inside braces.
      const int palette[ROWS][3] = {{RGB_RED}, {RGB_ORANGE}, {RGB_YELLOW}};

      int main() {
          std::vector<Brick> bricks;
          for (int r = 0; r < ROWS; r++)
              for (int c = 0; c < COLS; c++)
                  bricks.push_back({{1 + c * 40, 30 + r * 16, 38, 12}, r});

          Rect paddle{135, 220, 50, 8};
          Ball ball;
          bool playing = true;

          engine_frames(450);
          while (engine_running()) {
              if (key_down(KEY_LEFT))  paddle.x = std::max(0, paddle.x - 5);
              if (key_down(KEY_RIGHT)) paddle.x = std::min(SCREEN_W - paddle.w, paddle.x + 5);

              if (playing) {
                  ball.x += ball.vx;
                  ball.y += ball.vy;
                  if (ball.x < 0 || ball.x + ball.size > SCREEN_W) ball.vx = -ball.vx;
                  if (ball.y < 0) ball.vy = -ball.vy;
                  if (ball.y > SCREEN_H) playing = false;          // the ball fell out

                  // 1. PADDLE: if ball.vy > 0 and ball.box() overlaps paddle, bounce it upward:
                  //    ball.vy = -ball.vy, put the ball on top (ball.y = paddle.y - ball.size) and
                  //    steer it with ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5.
                  // 2. BRICKS: use std::find_if with a lambda to find the first brick that is alive
                  //    and whose box overlaps ball.box(). If one is found (the result is not
                  //    bricks.end()): set its alive to false and flip ball.vy.
              }

              engine_clear(RGB_DARK);
              for (const auto& b : bricks) {
                  if (!b.alive) continue;
                  const int* c = palette[b.row];
                  engine_rect(b.box.x, b.box.y, b.box.w, b.box.h, c[0], c[1], c[2]);
              }
              engine_rect(paddle.x, paddle.y, paddle.w, paddle.h, RGB_CYAN);
              engine_rect(ball.x, ball.y, ball.size, ball.size, RGB_WHITE);
              engine_present();
          }
          long left = std::count_if(bricks.begin(), bricks.end(), [](const Brick& b) { return b.alive; });
          std::cout << "bricks left: " << left << std::endl;
          return 0;
      }
check:
  output: |
    bricks left: 5
hints:
  - "Two jobs. The paddle bounce needs the ball to be moving down, flips vy, and uses the distance between the two centres to set vx. For the bricks, std::find_if with a lambda finds the first alive brick that overlaps the ball, and returns bricks.end() when there is none."
  - "Paddle: if (ball.vy > 0 && ball.box().overlaps(paddle)) { ball.vy = -ball.vy; ball.y = paddle.y - ball.size; ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5; }   Bricks: auto hit = std::find_if(bricks.begin(), bricks.end(), [&](const Brick& b) { return b.alive && b.box.overlaps(ball.box()); });"
  - "Paddle: if (ball.vy > 0 && ball.box().overlaps(paddle)) { ball.vy = -ball.vy; ball.y = paddle.y - ball.size; ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5; }   Bricks: auto hit = std::find_if(bricks.begin(), bricks.end(), [&](const Brick& b) { return b.alive && b.box.overlaps(ball.box()); }); if (hit != bricks.end()) { hit->alive = false; ball.vy = -ball.vy; }"
solution:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include <vector>
      #include "engine.h"

      constexpr int COLS = 8, ROWS = 3;

      struct Rect {
          int x, y, w, h;
          bool overlaps(const Rect& o) const {
              return x < o.x + o.w && x + w > o.x && y < o.y + o.h && y + h > o.y;
          }
      };

      struct Brick {
          Rect box;
          int row;
          bool alive = true;
      };

      struct Ball {
          int x = 150, y = 150, vx = 2, vy = -4, size = 6;
          Rect box() const { return {x, y, size, size}; }
      };

      // RGB_RED and friends expand to three numbers, so they fit inside braces.
      const int palette[ROWS][3] = {{RGB_RED}, {RGB_ORANGE}, {RGB_YELLOW}};

      int main() {
          std::vector<Brick> bricks;
          for (int r = 0; r < ROWS; r++)
              for (int c = 0; c < COLS; c++)
                  bricks.push_back({{1 + c * 40, 30 + r * 16, 38, 12}, r});

          Rect paddle{135, 220, 50, 8};
          Ball ball;
          bool playing = true;

          engine_frames(450);
          while (engine_running()) {
              if (key_down(KEY_LEFT))  paddle.x = std::max(0, paddle.x - 5);
              if (key_down(KEY_RIGHT)) paddle.x = std::min(SCREEN_W - paddle.w, paddle.x + 5);

              if (playing) {
                  ball.x += ball.vx;
                  ball.y += ball.vy;
                  if (ball.x < 0 || ball.x + ball.size > SCREEN_W) ball.vx = -ball.vx;
                  if (ball.y < 0) ball.vy = -ball.vy;
                  if (ball.y > SCREEN_H) playing = false;          // the ball fell out

                  if (ball.vy > 0 && ball.box().overlaps(paddle)) {
                      ball.vy = -ball.vy;
                      ball.y = paddle.y - ball.size;
                      ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5;
                  }
                  auto hit = std::find_if(bricks.begin(), bricks.end(), [&](const Brick& b) {
                      return b.alive && b.box.overlaps(ball.box());
                  });
                  if (hit != bricks.end()) {
                      hit->alive = false;
                      ball.vy = -ball.vy;
                  }
              }

              engine_clear(RGB_DARK);
              for (const auto& b : bricks) {
                  if (!b.alive) continue;
                  const int* c = palette[b.row];
                  engine_rect(b.box.x, b.box.y, b.box.w, b.box.h, c[0], c[1], c[2]);
              }
              engine_rect(paddle.x, paddle.y, paddle.w, paddle.h, RGB_CYAN);
              engine_rect(ball.x, ball.y, ball.size, ball.size, RGB_WHITE);
              engine_present();
          }
          long left = std::count_if(bricks.begin(), bricks.end(), [](const Brick& b) { return b.alive; });
          std::cout << "bricks left: " << left << std::endl;
          return 0;
      }
quiz:
  - q: "What does std::find_if return when no element passes the test?"
    options: ["nullptr","The first element","The end() iterator of the range","-1"]
    answer: 2
    explain: "That is why you compare with bricks.end() before using the result."
  - q: "In [&](const Brick& b) { return b.alive && b.box.overlaps(ball.box()); } what does [&] allow?"
    options: ["The lambda can use ball from the surrounding code","The lambda can run faster","The lambda returns a reference","Nothing, it is decoration"]
    answer: 0
  - q: "Why does the paddle bounce only when ball.vy > 0?"
    options: ["Because paddles are invisible otherwise","So a ball moving up away from the paddle is not bounced again and does not get stuck","To count the bounces","Because vy is never negative"]
    answer: 1
  - q: "What does std::count_if(bricks.begin(), bricks.end(), pred) return?"
    options: ["The index of the first match","The size of the vector","True or false","How many elements satisfy pred"]
    answer: 3
---
Breakout is a game of many small targets and one clever bounce. In C++ you can describe the target wall with a `vector` of `Brick` objects, find the brick the ball hit with a **standard algorithm**, and count the survivors with another one. You will also give the paddle an **angled bounce** so the player can aim.

## Rect: a struct that knows how to overlap

```cpp
struct Rect {
    int x, y, w, h;
    bool overlaps(const Rect& o) const {
        return x < o.x + o.w && x + w > o.x && y < o.y + o.h && y + h > o.y;
    }
};
```

A struct may hold **functions** too. `a.overlaps(b)` reads better than `overlaps(a, b)`, and the trailing `const` says the method does not change the rectangle. The `Ball` has a `box()` method that returns its rectangle, so `ball.box().overlaps(paddle)` is a complete collision test in one readable line.

## A wall from two loops

```cpp
std::vector<Brick> bricks;
for (int r = 0; r < ROWS; r++)
    for (int c = 0; c < COLS; c++)
        bricks.push_back({{1 + c * 40, 30 + r * 16, 38, 12}, r});
```

The outer loop is the row, the inner loop is the column. Each brick is a `Rect` box, the row number (used for the colour) and an `alive = true` flag with a default value. A broken brick is not erased: it just gets `alive = false`. Keeping it in the vector keeps every index stable, and the final tally is easy.

> The colours work through a table. `RGB_RED` expands to three numbers, so it fits inside braces: `const int palette[3][3] = {{RGB_RED}, {RGB_ORANGE}, {RGB_YELLOW}};`. Then `palette[row]` is one colour.

## Finding the brick that was hit

You could write a `for` loop with a `break`. The standard library has an expressive alternative:

```cpp
auto hit = std::find_if(bricks.begin(), bricks.end(), [&](const Brick& b) {
    return b.alive && b.box.overlaps(ball.box());
});
if (hit != bricks.end()) {
    hit->alive = false;
    ball.vy = -ball.vy;
}
```

- `std::find_if(first, last, test)` walks the range and returns an **iterator** (a kind of pointer) to the first element for which `test` is true.
- The test is a **lambda**. `[&]` lets it see `ball` from the surrounding code, `(const Brick& b)` is its parameter.
- If nothing matched, it returns `bricks.end()`, the "one past the last" marker. That is why we compare to `end()` before using the result.
- `hit->alive` uses the arrow because `hit` behaves like a pointer.

Because `find_if` stops at the **first** match, the ball can break only one brick per frame. That matters: flipping `vy` twice would send the ball straight through the wall.

## An aimable paddle

If the paddle returned the ball at the same angle every time, the game would be dull and some bricks unreachable. The trick is to use **where the ball touches the paddle**:

```cpp
ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5;
```

That is the distance from the paddle's centre to the ball's centre, negative on the left half and positive on the right. A hit in the middle sends the ball straight up, a hit near the right edge sends it sharply right. Dividing by 5 turns pixels into a sensible speed. We also bounce only when `ball.vy > 0` (moving down) and put the ball on top of the paddle, otherwise it can get stuck inside and jitter.

## Counting the survivors

```cpp
long left = std::count_if(bricks.begin(), bricks.end(), [](const Brick& b) { return b.alive; });
```

`count_if` returns how many elements pass the test. No counter variable to keep in sync.

> **Watch out:**
> - Using `*hit` or `hit->` when `hit == bricks.end()` is undefined behavior (usually a crash). Always test first.
> - A lambda with `[]` instead of `[&]` that mentions `ball` fails to compile: `error: 'ball' is not captured`.
> - Forgetting `const` on `overlaps` gives `passing 'const Rect' as 'this' argument discards qualifiers` when you call it on a const object.
> - `find_if`, `count_if` and `std::max` need `#include <algorithm>`.

## Going further

Add a `std::vector<int>` of scores per row, or print how many times the paddle hit the ball. Edit the Player input tab and watch the number of bricks left change.

> **Your turn:** (1) Paddle: when `ball.vy > 0` and `ball.box()` overlaps `paddle`, set `ball.vy = -ball.vy`, `ball.y = paddle.y - ball.size` and `ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5`. (2) Bricks: use `std::find_if` with a lambda to find the first alive brick that overlaps `ball.box()`; if found, set its `alive` to `false` and flip `ball.vy`. With the given keys the program prints `bricks left: 5`.
