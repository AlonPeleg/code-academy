---
title: Collision and score - coin collector
summary: Detect overlapping rectangles with a method and put classes and a vector together into a complete tiny game.
level: intermediate
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Right along the top row (three coins)...
  0 right down
  45 right up
  # ...down (fourth coin)...
  50 down down
  70 down up
  # ...and back left (fifth coin). The sixth coin, bottom left, is never reached.
  75 left down
  95 left up
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

          // Do this rectangle and the other one overlap?
          bool overlaps(const Rect& o) const {
              // 1. True when ALL four of these hold (join them with &&):
              //    this one starts left of o's right edge, and ends right of o's left edge,
              //    and the same two checks for y (top and bottom).
              return false;
          }
      };

      class Coin {
      public:
          Coin(int x, int y) : box{x, y, 12, 12} {}

          void draw() const {
              if (!collected) engine_circle(box.x + 6, box.y + 6, 6, RGB_YELLOW);
          }

          Rect box;
          bool collected = false;
      };

      int main() {
          constexpr int SPEED = 5;
          Rect player{20, 20, 20, 20};
          std::vector<Coin> coins = {Coin(90, 25), Coin(170, 25), Coin(250, 25),
                                     Coin(250, 110), Coin(170, 110), Coin(90, 180)};
          int score = 0;

          engine_frames(120);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  player.x -= SPEED;
              if (key_down(KEY_RIGHT)) player.x += SPEED;
              if (key_down(KEY_UP))    player.y -= SPEED;
              if (key_down(KEY_DOWN))  player.y += SPEED;

              for (auto& coin : coins) {
                  // 2. If this coin is not collected yet and its box overlaps the player:
                  //    mark it collected and add 1 to score.
              }

              engine_clear(RGB_DARK);
              for (const auto& coin : coins) coin.draw();
              engine_rect(player.x, player.y, player.w, player.h, RGB_CYAN);
              std::string text = "Score: " + std::to_string(score);
              engine_text(8, 8, 14, RGB_WHITE, text.c_str());
              engine_present();
          }

          auto left = std::count_if(coins.begin(), coins.end(),
                                    [](const Coin& c) { return !c.collected; });
          std::cout << "score: " << score << std::endl;
          std::cout << "left: " << left << std::endl;
          return 0;
      }
check:
  output: |
    score: 5
    left: 1
hints:
  - "Two boxes overlap only when they overlap on the x axis AND on the y axis. Write the four comparisons with &&. In the loop, check the coin's collected flag together with the overlap, so each coin counts only once."
  - "return x < o.x + o.w && x + w > o.x && y < o.y + o.h && y + h > o.y;   In the loop: if (!coin.collected && player.overlaps(coin.box)) { ... }"
  - "Inside the for loop: if (!coin.collected && player.overlaps(coin.box)) { coin.collected = true; score++; }"
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

          // Do this rectangle and the other one overlap?
          bool overlaps(const Rect& o) const {
              return x < o.x + o.w && x + w > o.x &&
                     y < o.y + o.h && y + h > o.y;
          }
      };

      class Coin {
      public:
          Coin(int x, int y) : box{x, y, 12, 12} {}

          void draw() const {
              if (!collected) engine_circle(box.x + 6, box.y + 6, 6, RGB_YELLOW);
          }

          Rect box;
          bool collected = false;
      };

      int main() {
          constexpr int SPEED = 5;
          Rect player{20, 20, 20, 20};
          std::vector<Coin> coins = {Coin(90, 25), Coin(170, 25), Coin(250, 25),
                                     Coin(250, 110), Coin(170, 110), Coin(90, 180)};
          int score = 0;

          engine_frames(120);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  player.x -= SPEED;
              if (key_down(KEY_RIGHT)) player.x += SPEED;
              if (key_down(KEY_UP))    player.y -= SPEED;
              if (key_down(KEY_DOWN))  player.y += SPEED;

              for (auto& coin : coins) {
                  if (!coin.collected && player.overlaps(coin.box)) {
                      coin.collected = true;
                      score++;
                  }
              }

              engine_clear(RGB_DARK);
              for (const auto& coin : coins) coin.draw();
              engine_rect(player.x, player.y, player.w, player.h, RGB_CYAN);
              std::string text = "Score: " + std::to_string(score);
              engine_text(8, 8, 14, RGB_WHITE, text.c_str());
              engine_present();
          }

          auto left = std::count_if(coins.begin(), coins.end(),
                                    [](const Coin& c) { return !c.collected; });
          std::cout << "score: " << score << std::endl;
          std::cout << "left: " << left << std::endl;
          return 0;
      }
quiz:
  - q: "Two rectangles overlap when..."
    options: ["Their x ranges overlap AND their y ranges overlap", "Their x ranges overlap", "Their y ranges overlap", "Either their x or their y ranges overlap"]
    answer: 0
    explain: "Lining up on one axis is not enough: two houses on the same street are not touching."
  - q: "Why does each Coin have a collected flag?"
    options: ["So the coin changes color", "So a coin is counted once, not on every frame the player is touching it", "So the vector can grow", "To make the coin heavier"]
    answer: 1
    explain: "The loop runs 30 times a second. Without the flag one touch would add many points."
  - q: "In for (auto& coin : coins) why is the & needed when we write coin.collected = true;?"
    options: ["It is not needed", "It makes the loop faster but changes nothing else", "Without it, coin is a copy and the vector's real coin would not be marked", "It declares a pointer"]
    answer: 2
  - q: "In a method declared  bool overlaps(const Rect& o) const , what does  x  alone refer to?"
    options: ["The x of the other rectangle o", "A global variable", "An error, you must write this.x", "The x of the rectangle the method was called on"]
    answer: 3
    explain: "In player.overlaps(coin.box), x means player.x and o.x means coin.box.x."
---
Time to put everything together. You can move a player, keep it on screen, use classes and keep a vector of objects. In this lesson you will add **collision detection** and a **score** to make a complete, tiny coin-collecting game, using idiomatic C++ pieces: a method, a class and a vector.

## When do two rectangles touch?

Most simple games treat things as rectangles, called **bounding boxes**. Two boxes overlap when they overlap on *both* axes at once. On the x axis that is two checks:

1. This box's left edge is to the **left of the other's right edge**: `x < o.x + o.w`
2. This box's right edge is to the **right of the other's left edge**: `x + w > o.x`

The same two checks with `y` and `h` handle the vertical axis. Join all four with `&&` ("and"). Put the idea inside the type it belongs to, as a method:

```cpp
struct Rect {
    int x, y, w, h;

    bool overlaps(const Rect& o) const {
        return x < o.x + o.w && x + w > o.x &&
               y < o.y + o.h && y + h > o.y;
    }
};
```

- A `struct` is a class whose members are public by default, which is handy for plain data like a rectangle. It can still have methods.
- `const Rect& o` takes the other rectangle **by reference** (no copy) and promises not to change it.
- The trailing `const` promises the method does not change the rectangle it was called on.
- Inside the method, a bare `x` means "my own x" and `o.x` means the other one's. A comparison gives `true` or `false`, so the whole expression is already the answer to `return`.

Using it reads like English: `player.overlaps(coin.box)`.

> Tip: draw two squares on paper and slide one across the other. Watch which of the four conditions turns false first. That is the best way to see why all four are needed.

## Coins you can collect once

```cpp
class Coin {
public:
    Coin(int x, int y) : box{x, y, 12, 12} {}
    void draw() const {
        if (!collected) engine_circle(box.x + 6, box.y + 6, 6, RGB_YELLOW);
    }
    Rect box;
    bool collected = false;
};
```

A coin owns its `Rect` and knows how to draw itself (a circle is drawn from its *center*, so we add half the size). The list of coins is a vector built with a list of constructor calls: `std::vector<Coin> coins = {Coin(90, 25), Coin(170, 25)};`.

The collision step visits every coin:

```cpp
for (auto& coin : coins) {
    if (!coin.collected && player.overlaps(coin.box)) {
        coin.collected = true;
        score++;
    }
}
```

`auto&` gives you the real coin so the flag sticks. `!coin.collected` means "not collected yet". Because a frame lasts only 1/30 s, the player overlaps a coin for several frames in a row. The flag makes sure that a coin is worth points exactly once.

## Counting what is left

At the end the starter uses `std::count_if` with a lambda to count the uncollected coins. It is like `remove_if` from last lesson, but it just counts the matches:

```cpp
auto left = std::count_if(coins.begin(), coins.end(),
                          [](const Coin& c) { return !c.collected; });
```

## The finished frame

1. **Input** changes `player.x` and `player.y`.
2. **Update** checks every coin and updates the score.
3. **Draw** clears, draws the coins, the player and the score text (`std::to_string(score)` turns the number into text).
4. **Present**.

> **Watch out:**
> - `||` instead of `&&` makes almost everything count as touching.
> - `for (auto coin : coins)` (no `&`) marks a copy, so the real coin stays collectable and the score keeps rising.
> - `coin.collected == true` is wordier than `coin.collected` and easy to mistype as `=`. Prefer `!coin.collected`.
> - Forgetting the `const` on `overlaps` gives `passing 'const Rect' as 'this' argument discards qualifiers` when you call it on a const object.

## Going further

The sixth coin is in the bottom-left corner, out of reach of the given script. Edit the Player input so the player collects all six and the program prints `score: 6` and `left: 0`. Then add a "YOU WIN" text when `left` reaches 0.

> **Your turn:** finish `Rect::overlaps` with the four comparisons, and in the coin loop mark an uncollected, touching coin as collected and add one to `score`. With the given key script the program should print `score: 5` and `left: 1`.
