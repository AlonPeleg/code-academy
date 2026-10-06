---
title: Vectors of objects
summary: Keep a growing list of bullets in a std::vector, add with push_back and clean up with erase and remove_if.
level: intermediate
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Walk right for a while, then back left a little
  0 right down
  30 right up
  60 left down
  80 left up
  # Four quick shots, but only 3 bullets may fly at once
  5 space down
  6 space up
  10 space down
  11 space up
  15 space down
  16 space up
  20 space down
  21 space up
  # Later shots, when the old bullets have left the screen
  40 space down
  41 space up
  70 space down
  71 space up
  100 space down
  101 space up
  105 space down
  106 space up
files:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include <vector>
      #include "engine.h"

      struct Bullet {
          int x, y;
      };

      int main() {
          constexpr std::size_t MAX_BULLETS = 3;    // at most this many on screen
          constexpr int BULLET_SPEED = 7;
          std::vector<Bullet> bullets;              // starts empty
          int player_x = 150;
          int fired = 0;

          engine_frames(110);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  player_x -= 4;
              if (key_down(KEY_RIGHT)) player_x += 4;

              // 1. SHOOT: when SPACE is pressed and there is room (fewer than MAX_BULLETS),
              //    add a bullet at (player_x + 8, 200) to the vector and add 1 to fired.

              for (auto& b : bullets) {
                  b.y -= BULLET_SPEED;       // move every bullet up
              }

              // 2. CLEAN UP: remove every bullet whose y is below 0.
              //    Use bullets.erase(std::remove_if(first, last, test), bullets.end());

              engine_clear(RGB_DARK);
              engine_rect(player_x, 205, 20, 20, RGB_CYAN);
              for (const auto& b : bullets) {
                  engine_rect(b.x, b.y, 4, 10, RGB_YELLOW);
              }
              engine_present();
          }

          std::cout << "fired: " << fired << ", in flight: " << bullets.size() << std::endl;
          return 0;
      }
check:
  output: |
    fired: 7, in flight: 2
hints:
  - "Shooting is a size check plus push_back. Cleaning up uses the erase-remove idiom: remove_if moves the bad bullets to the end, and erase chops them off. The test is a small lambda that takes a bullet and says if it is off screen."
  - "if (key_pressed(KEY_SPACE) && bullets.size() < MAX_BULLETS) { bullets.push_back({player_x + 8, 200}); fired++; }   Clean up: bullets.erase(std::remove_if(bullets.begin(), bullets.end(), [](const Bullet& b) { return b.y < 0; }), bullets.end());"
  - "Step 1:  if (key_pressed(KEY_SPACE) && bullets.size() < MAX_BULLETS) { bullets.push_back({player_x + 8, 200}); fired++; }   Step 2:  bullets.erase(std::remove_if(bullets.begin(), bullets.end(), [](const Bullet& b) { return b.y < 0; }), bullets.end());"
solution:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include <vector>
      #include "engine.h"

      struct Bullet {
          int x, y;
      };

      int main() {
          constexpr std::size_t MAX_BULLETS = 3;    // at most this many on screen
          constexpr int BULLET_SPEED = 7;
          std::vector<Bullet> bullets;              // starts empty
          int player_x = 150;
          int fired = 0;

          engine_frames(110);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  player_x -= 4;
              if (key_down(KEY_RIGHT)) player_x += 4;

              if (key_pressed(KEY_SPACE) && bullets.size() < MAX_BULLETS) {
                  bullets.push_back({player_x + 8, 200});
                  fired++;
              }

              for (auto& b : bullets) {
                  b.y -= BULLET_SPEED;       // move every bullet up
              }

              bullets.erase(
                  std::remove_if(bullets.begin(), bullets.end(),
                                 [](const Bullet& b) { return b.y < 0; }),
                  bullets.end());

              engine_clear(RGB_DARK);
              engine_rect(player_x, 205, 20, 20, RGB_CYAN);
              for (const auto& b : bullets) {
                  engine_rect(b.x, b.y, 4, 10, RGB_YELLOW);
              }
              engine_present();
          }

          std::cout << "fired: " << fired << ", in flight: " << bullets.size() << std::endl;
          return 0;
      }
quiz:
  - q: "Which call adds a new element at the end of a std::vector?"
    options: ["bullets.add(b)", "bullets.push_back(b)", "bullets.insert(b)", "bullets[size] = b"]
    answer: 1
  - q: "What does for (auto& b : bullets) { b.y -= 7; } do?"
    options: ["Moves every bullet in the vector (the & makes b a reference to the real element)", "Moves a copy of each bullet, the real bullets stay put", "Removes every bullet", "Does not compile"]
    answer: 0
    explain: "Without the &, b would be a copy and your change would be lost."
  - q: "What does bullets.size() return?"
    options: ["The memory used in bytes", "The index of the last element", "The capacity of the vector", "The number of elements currently in the vector"]
    answer: 3
  - q: "Why must you not call erase on a vector while looping over it with range-for?"
    options: ["It is slower", "erase only works on the last element", "Erasing changes the vector under the loop and breaks it, so do the removal with remove_if after the loop", "Range-for is not allowed on a vector"]
    answer: 2
    explain: "Changing the size of a vector invalidates the loop's iterators. Move first, then erase-remove afterwards."
---
A game needs lists: many bullets, many enemies, many coins, and you rarely know how many beforehand. In C++ the tool for that is `std::vector`. It is a list that **grows and shrinks** as you go. In this lesson you will keep a vector of bullets and learn the three moves every game list needs: add, loop, and remove.

## std::vector in a minute

```cpp
#include <vector>

std::vector<Bullet> bullets;          // an empty list of Bullet objects
bullets.push_back({100, 200});        // add one at the end
bullets.push_back({140, 200});        // now there are two
std::cout << bullets.size();          // prints: 2
bullets[0].y = 150;                   // access by index, starting at 0
```

- `std::vector<Bullet>` means "a vector that holds Bullets" (the type in angle brackets).
- `push_back(x)` appends a new element, and the vector makes room by itself.
- `size()` is how many elements it has right now. Its type is unsigned (`std::size_t`), which is why the limit constant above uses the same type.
- With `struct Bullet { int x, y; };` you can write the new bullet with braces: `{x, y}`.

## Looping with range-for

You do not need an index to visit everything:

```cpp
for (auto& b : bullets) {
    b.y -= BULLET_SPEED;          // changes the real bullet
}

for (const auto& b : bullets) {
    engine_rect(b.x, b.y, 4, 10, RGB_YELLOW);     // only looks, never changes
}
```

- `for (X : list)` means "for each element in the list".
- `auto` lets the compiler work out the type (`Bullet`) for you.
- The `&` makes `b` a **reference** (another name for the real element). Without it you would get a copy, and your change would vanish.
- `const` says "I only read".

## Removing: the erase-remove idiom

When a bullet leaves the top of the screen we want it gone. Removing items from the middle of a vector takes two steps, which C++ programmers write as a single phrase:

```cpp
bullets.erase(
    std::remove_if(bullets.begin(), bullets.end(),
                   [](const Bullet& b) { return b.y < 0; }),
    bullets.end());
```

1. `std::remove_if(first, last, test)` moves the elements you want to keep to the front, and returns where that "good" part ends. The ones the test picked are left behind after it.
2. `erase(from, to)` chops off everything from that point to the end.

The test `[](const Bullet& b) { return b.y < 0; }` is a **lambda**: a tiny unnamed function. The `[]` starts it, `(const Bullet& b)` is its parameter, and the body returns true for bullets that are off screen. You will see this pattern all over C++ code.

An alternative is an index loop. It works, but removal inside it is easy to get wrong, so erase-remove is the safer habit:

```cpp
for (std::size_t i = 0; i < bullets.size(); i++) {
    bullets[i].y -= BULLET_SPEED;
}
```

## Limiting how many

`bullets.size() < MAX_BULLETS` is the check that stops the fourth bullet. Because `&&` stops at the first false part, `push_back` is never reached when there is no room. A shot that is refused does not count as fired.

> **Watch out:**
> - `for (auto b : bullets) b.y -= 7;` does nothing: without `&` the loop works on copies.
> - Calling `bullets.erase(...)` inside a range-for crashes or skips elements. Do the cleanup after the loop.
> - Forgetting the second argument `bullets.end()` of `erase` removes only ONE element. The error is silent, bullets just pile up.
> - Reading `bullets[5]` when the vector is smaller is undefined behavior; it will not warn you. Check `size()` first.

## Going further

Print `bullets.size()` each frame, or draw it as text with `std::to_string`. Try `MAX_BULLETS = 10` and mash space to see them all fly.

> **Your turn:** add the shooting rule (SPACE pressed and room for another bullet: `push_back` a bullet at `{player_x + 8, 200}` and count it in `fired`), then erase the bullets whose `y` is below 0 with `erase` and `remove_if`. With the given keys the program should print `fired: 7, in flight: 2`.
