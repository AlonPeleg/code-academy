---
title: "Capstone: space defender"
summary: "Combine classes, vectors, lambdas, collisions, scoring and lives into a complete shooter, organized around a Game class."
level: advanced
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Slide under the falling enemies and tap space to fire
  1 left down
  28 left up
  28 space down
  29 space up
  40 space down
  41 space up
  43 right down
  81 right up
  81 space down
  82 space up
  92 left down
  110 left up
  110 space down
  111 space up
  121 right down
  154 right up
  154 space down
  155 space up
  162 left down
  205 left up
  205 space down
  206 space up
  209 right down
  232 right up
  232 space down
  233 space up
  237 right down
  252 right up
  252 space down
  253 space up
  264 space down
  265 space up
  265 left down
  313 left up
  313 space down
  314 space up
  319 right down
  357 right up
  357 space down
  358 space up
  361 left down
  379 left up
  379 space down
  380 space up
  384 right down
  417 right up
  417 space down
  418 space up
  421 left down
files:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include <string>
      #include <vector>
      #include "engine.h"

      struct Rect {
          int x, y, w, h;
          bool overlaps(const Rect& o) const {
              return x < o.x + o.w && x + w > o.x && y < o.y + o.h && y + h > o.y;
          }
      };

      struct Thing {
          Rect box;
          bool dead = false;
      };

      class Game {
      public:
          void step() {
              if (key_down(KEY_LEFT)  && player_.x > 0)                 player_.x -= 4;
              if (key_down(KEY_RIGHT) && player_.x < SCREEN_W - player_.w) player_.x += 4;
              if (key_pressed(KEY_SPACE) && bullets_.size() < MAX_BULLETS)
                  bullets_.push_back({{player_.x + 8, player_.y - 10, 4, 10}});
              if (engine_frame() % 30 == 0)
                  enemies_.push_back({{LANES[lane_++ % 8], -16, 16, 16}});

              for (auto& b : bullets_) {
                  b.box.y -= 8;
                  if (b.box.y < -10) b.dead = true;
              }
              for (auto& e : enemies_) e.box.y += 2;

              // 1. SHOOTING: for every bullet and every enemy (two range-for loops) that are both not dead
              //    and overlap, mark BOTH dead and add 10 to score_.
              // 2. DAMAGE: an enemy that is not dead and overlaps player_ OR has fallen past the bottom
              //    (box.y > SCREEN_H) costs one life: mark it dead and subtract 1 from lives_.

              // Sweep: erase everything marked dead (the erase-remove idiom with a lambda).
              auto sweep = [](std::vector<Thing>& v) {
                  v.erase(std::remove_if(v.begin(), v.end(), [](const Thing& t) { return t.dead; }), v.end());
              };
              sweep(bullets_);
              sweep(enemies_);
          }

          void draw() const {
              engine_clear(RGB_DARK);
              for (const auto& b : bullets_) engine_rect(b.box.x, b.box.y, 4, 10, RGB_YELLOW);
              for (const auto& e : enemies_) engine_rect(e.box.x, e.box.y, 16, 16, RGB_RED);
              engine_rect(player_.x, player_.y, player_.w, player_.h, RGB_CYAN);
              std::string label = "Score " + std::to_string(score_) + "   Lives " + std::to_string(lives_);
              engine_text(8, 8, 14, RGB_WHITE, label.c_str());
              if (game_over()) engine_text(100, 110, 20, RGB_WHITE, "GAME OVER");
          }

          bool game_over() const { return lives_ <= 0; }
          int score() const { return score_; }
          int lives() const { return lives_; }

      private:
          static constexpr std::size_t MAX_BULLETS = 4;
          static constexpr int LANES[8] = {40, 200, 120, 260, 80, 180, 20, 240};
          Rect player_{150, 215, 20, 12};
          std::vector<Thing> bullets_, enemies_;
          int score_ = 0, lives_ = 3, lane_ = 0;
      };

      int main() {
          Game game;
          engine_frames(450);
          while (engine_running()) {
              if (!game.game_over()) game.step();
              game.draw();
              engine_present();
          }
          std::cout << "score: " << game.score() << ", lives: " << game.lives() << std::endl;
          return 0;
      }
check:
  output: |
    score: 110, lives: 2
hints:
  - "Two collision loops in Game::step. Shooting: range-for over bullets_ and enemies_; for pairs that are both not dead and overlap, mark both dead and add 10 to the score. Damage: range-for over enemies_; touching player_ or falling past the bottom marks it dead and costs a life. The sweep at the end removes the dead ones."
  - "Shooting: if (!b.dead && !e.dead && b.box.overlaps(e.box)) { b.dead = e.dead = true; score_ += 10; }   Damage: if (!e.dead && (e.box.overlaps(player_) || e.box.y > SCREEN_H)) { e.dead = true; lives_--; }"
  - "for (auto& b : bullets_) for (auto& e : enemies_) if (!b.dead && !e.dead && b.box.overlaps(e.box)) { b.dead = e.dead = true; score_ += 10; }   for (auto& e : enemies_) if (!e.dead && (e.box.overlaps(player_) || e.box.y > SCREEN_H)) { e.dead = true; lives_--; }"
solution:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include <string>
      #include <vector>
      #include "engine.h"

      struct Rect {
          int x, y, w, h;
          bool overlaps(const Rect& o) const {
              return x < o.x + o.w && x + w > o.x && y < o.y + o.h && y + h > o.y;
          }
      };

      struct Thing {
          Rect box;
          bool dead = false;
      };

      class Game {
      public:
          void step() {
              if (key_down(KEY_LEFT)  && player_.x > 0)                 player_.x -= 4;
              if (key_down(KEY_RIGHT) && player_.x < SCREEN_W - player_.w) player_.x += 4;
              if (key_pressed(KEY_SPACE) && bullets_.size() < MAX_BULLETS)
                  bullets_.push_back({{player_.x + 8, player_.y - 10, 4, 10}});
              if (engine_frame() % 30 == 0)
                  enemies_.push_back({{LANES[lane_++ % 8], -16, 16, 16}});

              for (auto& b : bullets_) {
                  b.box.y -= 8;
                  if (b.box.y < -10) b.dead = true;
              }
              for (auto& e : enemies_) e.box.y += 2;

              for (auto& b : bullets_) {
                  for (auto& e : enemies_) {
                      if (!b.dead && !e.dead && b.box.overlaps(e.box)) {
                          b.dead = e.dead = true;
                          score_ += 10;
                      }
                  }
              }
              for (auto& e : enemies_) {
                  if (!e.dead && (e.box.overlaps(player_) || e.box.y > SCREEN_H)) {
                      e.dead = true;
                      lives_--;
                  }
              }

              // Sweep: erase everything marked dead (the erase-remove idiom with a lambda).
              auto sweep = [](std::vector<Thing>& v) {
                  v.erase(std::remove_if(v.begin(), v.end(), [](const Thing& t) { return t.dead; }), v.end());
              };
              sweep(bullets_);
              sweep(enemies_);
          }

          void draw() const {
              engine_clear(RGB_DARK);
              for (const auto& b : bullets_) engine_rect(b.box.x, b.box.y, 4, 10, RGB_YELLOW);
              for (const auto& e : enemies_) engine_rect(e.box.x, e.box.y, 16, 16, RGB_RED);
              engine_rect(player_.x, player_.y, player_.w, player_.h, RGB_CYAN);
              std::string label = "Score " + std::to_string(score_) + "   Lives " + std::to_string(lives_);
              engine_text(8, 8, 14, RGB_WHITE, label.c_str());
              if (game_over()) engine_text(100, 110, 20, RGB_WHITE, "GAME OVER");
          }

          bool game_over() const { return lives_ <= 0; }
          int score() const { return score_; }
          int lives() const { return lives_; }

      private:
          static constexpr std::size_t MAX_BULLETS = 4;
          static constexpr int LANES[8] = {40, 200, 120, 260, 80, 180, 20, 240};
          Rect player_{150, 215, 20, 12};
          std::vector<Thing> bullets_, enemies_;
          int score_ = 0, lives_ = 3, lane_ = 0;
      };

      int main() {
          Game game;
          engine_frames(450);
          while (engine_running()) {
              if (!game.game_over()) game.step();
              game.draw();
              engine_present();
          }
          std::cout << "score: " << game.score() << ", lives: " << game.lives() << std::endl;
          return 0;
      }
quiz:
  - q: "Why are things first marked dead and swept at the end of the frame?"
    options: ["Erasing from a vector while looping over it is dangerous","The sweep is faster than anything else","The compiler requires it","Because vectors can not be erased"]
    answer: 0
    explain: "Changing the size of a vector invalidates the running loops."
  - q: "What does b.dead = e.dead = true; do?"
    options: ["Compares b.dead and e.dead","Sets e.dead to true, then b.dead to true","Does not compile","Sets only b.dead"]
    answer: 1
  - q: "What happens in for (auto b : bullets_) { b.dead = true; } (no &)?"
    options: ["All bullets are removed","The compiler reports an error","It marks copies, the real bullets stay alive","The vector is cleared"]
    answer: 2
  - q: "Why does draw() have const after its parameter list?"
    options: ["It makes the function run faster","It promises that drawing will not change the game","It makes the function private","It is required for every method"]
    answer: 1
---
This is the capstone: a small space shooter that uses almost everything from the track. You have a ship, bullets, falling enemies, a score and three lives. The work is about **organizing** a bigger program with a class so it stays readable.

## Pieces you already know

| Idea | From | Used here for |
|---|---|---|
| classes | lesson 4 | `Game`, which owns all the state |
| vectors of objects | lesson 5 | bullets and enemies that come and go |
| overlap test | lesson 6 | `Rect::overlaps` |
| key_down / key_pressed | lessons 2 and 3 | steering and firing |
| velocity and bouncing | Pong | bullets up by 8, enemies down by 2 |
| lambdas and algorithms | Breakout | the sweep that removes dead things |

## Small types, one big class

A `Rect` knows how to overlap another one, and a `Thing` is a `Rect` plus a `dead` flag:

```cpp
struct Thing {
    Rect box;
    bool dead = false;
};
```

The `Game` class owns everything and offers three clear actions: `step()` updates the world, `draw()` shows it, and small getters give the result:

```cpp
class Game {
public:
    void step();
    void draw() const;
    bool game_over() const { return lives_ <= 0; }
private:
    Rect player_{150, 215, 20, 12};
    std::vector<Thing> bullets_, enemies_;
    int score_ = 0, lives_ = 3, lane_ = 0;
};
```

`main` stays tiny: `if (!game.game_over()) game.step(); game.draw();`. Splitting **update** from **draw** is the habit that keeps real games manageable. `draw()` is `const`, a promise that drawing never changes the game.

## Marking dead, then sweeping

Erasing from a vector while you loop over it is dangerous, so we use a two-phase rule: during the frame, things are only **marked** `dead = true`. At the end of the frame one lambda removes all of them:

```cpp
auto sweep = [](std::vector<Thing>& v) {
    v.erase(std::remove_if(v.begin(), v.end(), [](const Thing& t) { return t.dead; }), v.end());
};
sweep(bullets_);
sweep(enemies_);
```

A lambda that takes a vector by reference works for both lists: the same code, written once. Marking first has a bonus: a bullet that has just hit an enemy is `dead`, so a second check in the same frame ignores it.

## Limits and scripted enemies

`bullets_.size() < MAX_BULLETS` keeps at most 4 bullets in the air, a classic arcade rule that stops you from just holding fire. There is no `rand()`: a recording must replay identically. Enemies spawn at `LANES[lane_++ % 8]`, a fixed list of x positions, and `%` wraps the index back to 0 after the last one. A repeating table is a good way to test a game.

## Two loops of collision

- **Shooting:** a double range-for over bullets and enemies. If neither is dead and their boxes overlap, mark both dead and add 10 points.
- **Damage:** every enemy that is not dead and either overlaps `player_` or has fallen below the screen (`box.y > SCREEN_H`) is marked dead and costs a life. Letting an enemy escape hurts as much as being hit.

```cpp
for (auto& b : bullets_)
    for (auto& e : enemies_)
        if (!b.dead && !e.dead && b.box.overlaps(e.box)) { b.dead = e.dead = true; score_ += 10; }
```

`b.dead = e.dead = true;` assigns right to left: first `e.dead`, then `b.dead`.

> **Watch out:**
> - Dropping the reference: `for (auto b : bullets_)` marks a **copy** as dead, and nothing is ever removed.
> - Calling `erase` inside the range-for loops invalidates the iterators; keep the two-phase mark and sweep.
> - Forgetting `!e.dead` in the damage loop: an enemy that was just shot still costs a life.
> - `static constexpr int LANES[8]` inside a class is fine in C++17. In C++11 or 14 you can get `undefined reference to Game::LANES` at link time.

## Going further

Make enemies faster after every 5 kills, add a second enemy type worth 30 points, or show the lives as small ships. Try changing `MAX_BULLETS` and edit the Player input to see how your score changes.

> **Your turn:** in `Game::step`, add (1) the shooting loops: every bullet that overlaps an enemy (both not dead) marks both dead and adds 10 to `score_`; (2) the damage loop: an enemy that is not dead and overlaps `player_` or has `box.y > SCREEN_H` is marked dead and costs one life (`lives_--`). With the given keys the program should print `score: 110, lives: 2`.
