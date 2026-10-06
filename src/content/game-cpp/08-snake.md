---
title: "Snake: a grid and a growing body"
summary: "Move a snake on a grid every few frames, keep its body in a std::vector and make it grow when it eats."
level: intermediate
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # The snake starts heading right. Steps happen on frames 0, 5, 10, ...
  # Turn down just before the first food is reached...
  17 down down
  18 down up
  # ...turn left along the bottom...
  32 left down
  33 left up
  # ...and turn up the column of the last two foods.
  47 up down
  48 up up
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <vector>
      #include "engine.h"

      constexpr int CELL = 20;          // one grid square is 20x20 pixels
      constexpr int COLS = 16;          // 320 / 20
      constexpr int ROWS = 12;          // 240 / 20
      constexpr int STEP_FRAMES = 5;    // the snake moves once every 5 frames

      struct Cell {
          int x, y;
          bool operator==(const Cell& o) const { return x == o.x && y == o.y; }
      };

      class Snake {
      public:
          // A turn is never allowed to reverse straight into the neck.
          void turn(int dx, int dy) {
              if (dx + dx_ != 0 || dy + dy_ != 0) { dx_ = dx; dy_ = dy; }
          }
          Cell next_head() const { return {body_[0].x + dx_, body_[0].y + dy_}; }

          // Move the snake onto `head`. If it just ate, it keeps its tail and so grows by one.
          void move_to(Cell head, bool ate) {
              // 1. SLITHER: put `head` at the FRONT of body_ with body_.insert(body_.begin(), head);
              //    then, unless `ate` is true, drop the tail with body_.pop_back().
          }
          const std::vector<Cell>& body() const { return body_; }

      private:
          std::vector<Cell> body_{{4, 6}, {3, 6}, {2, 6}};   // body_[0] is the head
          int dx_ = 1, dy_ = 0;
      };

      int main() {
          Snake snake;
          const std::vector<Cell> foods{{8, 6}, {8, 9}, {5, 9}, {5, 7}, {14, 1}};
          std::size_t next_food = 0;
          bool alive = true;

          auto draw_cell = [](const Cell& c, int r, int g, int b) {
              engine_rect(c.x * CELL + 1, c.y * CELL + 1, CELL - 2, CELL - 2, r, g, b);
          };

          engine_frames(120);
          while (engine_running()) {
              if (key_pressed(KEY_LEFT))  snake.turn(-1, 0);
              if (key_pressed(KEY_RIGHT)) snake.turn(1, 0);
              if (key_pressed(KEY_UP))    snake.turn(0, -1);
              if (key_pressed(KEY_DOWN))  snake.turn(0, 1);

              if (alive && engine_frame() % STEP_FRAMES == 0) {
                  Cell head = snake.next_head();
                  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
                      alive = false;                       // hit a wall
                  } else {
                      // 2. EAT: ate is true when next_food is still inside foods (next_food < foods.size())
                      //    and head == foods[next_food]. When it is true, move on: next_food++.
                      bool ate = false;   // replace this line with your own rule
                      snake.move_to(head, ate);
                  }
              }

              engine_clear(RGB_DARK);
              if (next_food < foods.size()) {
                  engine_rect(foods[next_food].x * CELL + 3, foods[next_food].y * CELL + 3, CELL - 6, CELL - 6, RGB_RED);
              }
              draw_cell(snake.body()[0], RGB_YELLOW);
              for (std::size_t i = 1; i < snake.body().size(); i++) draw_cell(snake.body()[i], RGB_GREEN);
              if (!alive) engine_text(100, 100, 20, RGB_WHITE, "GAME OVER");
              engine_present();
          }
          std::cout << "length: " << snake.body().size() << std::endl;
          return 0;
      }
check:
  output: |
    length: 7
hints:
  - "There are two places to fill in. In move_to, a vector can add a new head at the front and drop the old tail at the back. In main, 'ate' is a bool built from the vector size check and the cell comparison, and advancing next_food when it is true."
  - "move_to: insert head at the front with insert(begin(), head), then pop_back() unless ate.   main: ate needs the size check first, then head == foods[next_food]; advance next_food when it is true."
  - "move_to: body_.insert(body_.begin(), head); if (!ate) body_.pop_back();   main: bool ate = next_food < foods.size() && head == foods[next_food]; if (ate) next_food++;   (the size check must stay first)"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <vector>
      #include "engine.h"

      constexpr int CELL = 20;          // one grid square is 20x20 pixels
      constexpr int COLS = 16;          // 320 / 20
      constexpr int ROWS = 12;          // 240 / 20
      constexpr int STEP_FRAMES = 5;    // the snake moves once every 5 frames

      struct Cell {
          int x, y;
          bool operator==(const Cell& o) const { return x == o.x && y == o.y; }
      };

      class Snake {
      public:
          // A turn is never allowed to reverse straight into the neck.
          void turn(int dx, int dy) {
              if (dx + dx_ != 0 || dy + dy_ != 0) { dx_ = dx; dy_ = dy; }
          }
          Cell next_head() const { return {body_[0].x + dx_, body_[0].y + dy_}; }

          // Move the snake onto `head`. If it just ate, it keeps its tail and so grows by one.
          void move_to(Cell head, bool ate) {
              body_.insert(body_.begin(), head);
              if (!ate) body_.pop_back();
          }
          const std::vector<Cell>& body() const { return body_; }

      private:
          std::vector<Cell> body_{{4, 6}, {3, 6}, {2, 6}};   // body_[0] is the head
          int dx_ = 1, dy_ = 0;
      };

      int main() {
          Snake snake;
          const std::vector<Cell> foods{{8, 6}, {8, 9}, {5, 9}, {5, 7}, {14, 1}};
          std::size_t next_food = 0;
          bool alive = true;

          auto draw_cell = [](const Cell& c, int r, int g, int b) {
              engine_rect(c.x * CELL + 1, c.y * CELL + 1, CELL - 2, CELL - 2, r, g, b);
          };

          engine_frames(120);
          while (engine_running()) {
              if (key_pressed(KEY_LEFT))  snake.turn(-1, 0);
              if (key_pressed(KEY_RIGHT)) snake.turn(1, 0);
              if (key_pressed(KEY_UP))    snake.turn(0, -1);
              if (key_pressed(KEY_DOWN))  snake.turn(0, 1);

              if (alive && engine_frame() % STEP_FRAMES == 0) {
                  Cell head = snake.next_head();
                  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
                      alive = false;                       // hit a wall
                  } else {
                      bool ate = next_food < foods.size() && head == foods[next_food];
                      if (ate) next_food++;
                      snake.move_to(head, ate);
                  }
              }

              engine_clear(RGB_DARK);
              if (next_food < foods.size()) {
                  engine_rect(foods[next_food].x * CELL + 3, foods[next_food].y * CELL + 3, CELL - 6, CELL - 6, RGB_RED);
              }
              draw_cell(snake.body()[0], RGB_YELLOW);
              for (std::size_t i = 1; i < snake.body().size(); i++) draw_cell(snake.body()[i], RGB_GREEN);
              if (!alive) engine_text(100, 100, 20, RGB_WHITE, "GAME OVER");
              engine_present();
          }
          std::cout << "length: " << snake.body().size() << std::endl;
          return 0;
      }
quiz:
  - q: "What is the effect of body_.insert(body_.begin(), head) followed by body_.pop_back()?"
    options: ["The snake grows by one","The snake is cleared","The snake moves one cell and keeps its length","Nothing changes"]
    answer: 2
  - q: "What does body_.insert(body_.begin(), head) do?"
    options: ["Puts head at the end of the vector","Puts head at the front, at index 0","Replaces the first element","Removes the first element"]
    answer: 1
  - q: "Why must next_food < foods.size() come before head == foods[next_food] in the condition?"
    options: ["It is just style","Because && evaluates both sides anyway","So the second part is never evaluated with an index past the end of the vector","So the check is faster by 1 percent only"]
    answer: 2
    explain: "&& stops at the first false part."
  - q: "What does operator== in the Cell struct allow?"
    options: ["Adding two cells","Writing head == foods[i] to compare two cells","Printing a cell with cout","Sorting the cells"]
    answer: 1
---
Snake teaches one of the most useful ideas in games: a **grid** and a **list that grows**. In C++ the natural tool for a growing list is `std::vector`, and the natural tool for the snake's rules is a **class**. You will write both.

## Grid coordinates

The screen is 320 by 240 pixels. We cut it into squares of 20 pixels: 16 columns and 12 rows. The snake lives in **cell** coordinates, like `(4, 6)`, and we only turn cells into pixels when drawing:

```cpp
struct Cell {
    int x, y;
    bool operator==(const Cell& o) const { return x == o.x && y == o.y; }
};
```

The `operator==` line teaches C++ how to compare two cells. After that, `head == food` just works and reads like English.

## The snake is a vector of cells

```cpp
std::vector<Cell> body_{{4, 6}, {3, 6}, {2, 6}};   // body_[0] is the head
```

A vector grows by itself, so there is no `MAX_LEN` and no separate counter: `body_.size()` is the length. The head is `body_[0]` and the tail is `body_.back()`.

## Moving every N frames

The loop runs 30 times per second, but a snake moving 30 cells per second would be impossible to steer. So the world only **steps** every 5 frames:

```cpp
if (engine_frame() % STEP_FRAMES == 0) { /* one step */ }
```

`%` is the remainder of a division, so `engine_frame() % 5` is 0 on frames 0, 5, 10, 15... The keys are still read every frame.

## Slithering in two lines

Here is the neat C++ way to move a snake: **add a new head at the front, remove the old tail from the back.**

```cpp
body_.insert(body_.begin(), head);   // new head at index 0, everything shifts along
body_.pop_back();                    // forget the tail
```

`insert(position, value)` puts a value before `position`; `body_.begin()` is the front. `pop_back()` deletes the last element. The length did not change and the whole snake moved one cell.

## Eating means skipping one pop_back

Growing is just "do not forget the tail this time":

```cpp
void move_to(Cell head, bool ate) {
    body_.insert(body_.begin(), head);
    if (!ate) body_.pop_back();
}
```

When `ate` is true the vector keeps its tail, so it is one longer. And how do we know that the snake ate? The foods are fixed in a vector, and `next_food` says which one is on the board:

```cpp
bool ate = next_food < foods.size() && head == foods[next_food];
if (ate) next_food++;
```

The `next_food < foods.size()` part must come **first**: `&&` stops as soon as it sees `false`, so we never read `foods[next_food]` past the end of the vector.

## A class that guards its rules

`Snake::turn` refuses to reverse into the neck. The directions `dx_` and `dy_` are `private`, so the only way to steer is the method, and the rule can not be bypassed:

```cpp
void turn(int dx, int dy) {
    if (dx + dx_ != 0 || dy + dy_ != 0) { dx_ = dx; dy_ = dy; }
}
```

Going right is `(1, 0)`. The left key asks for `(-1, 0)`: the sum is `(0, 0)`, so it is refused. Up asks for `(0, -1)`: the sum is `(1, -1)`, accepted.

> **Watch out:**
> - Using `foods[next_food]` when `next_food == foods.size()` reads past the end. It is undefined behavior and the compiler will not warn you. Always check the size first.
> - `body_.insert(body_.end(), head)` adds the head at the **back**, so the snake would grow at the wrong end.
> - Calling `pop_back()` on an empty vector is undefined behavior, so make sure the snake always has a segment.
> - Forgetting `operator==` gives `error: no match for 'operator==' (operand types are 'Cell' and 'const Cell')`.

## Going further

The wall check already ends the game. Add a bite check with `std::find(body.begin(), body.end(), head)`, which works because of your `operator==`.

> **Your turn:** (1) in `Snake::move_to`, insert `head` at the front and pop the tail unless `ate`; (2) in `main`, compute `ate` as "next_food is inside foods and head equals foods[next_food]" and advance `next_food` when it is true. With the given keys the program should print `length: 7`.
