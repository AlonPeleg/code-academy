---
title: Keyboard input and movement
summary: Turn key presses into a direction, move at a speed per frame, and toggle a boost with key_pressed.
level: beginner
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Hold right for 30 frames
  5 right down
  35 right up
  # Space is held for 6 frames, but toggles the boost only ONCE (at frame 20)
  20 space down
  26 space up
  # Boost off again
  40 space down
  41 space up
  # Down for 20 frames
  50 down down
  70 down up
  # Boost on, then up for 5 frames
  75 space down
  76 space up
  80 up down
  85 up up
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include "engine.h"
      using namespace std;

      int main() {
          constexpr int NORMAL = 3;    // pixels per frame
          constexpr int BOOST = 6;     // pixels per frame while boosted
          int x = 150, y = 110;
          bool boosted = false;

          engine_frames(120);

          while (engine_running()) {
              // 1. Each time SPACE is pressed (one frame only!), flip boosted: true <-> false.

              int speed = boosted ? BOOST : NORMAL;

              // The direction is -1, 0 or +1 on each axis.
              int dx = 0, dy = 0;
              if (key_down(KEY_LEFT))  dx -= 1;
              if (key_down(KEY_RIGHT)) dx += 1;
              // 2. Do the same for dy with the UP and DOWN keys.

              x += dx * speed;
              y += dy * speed;

              engine_clear(RGB_DARK);
              if (boosted) engine_rect(x, y, 20, 20, RGB_ORANGE);
              else         engine_rect(x, y, 20, 20, RGB_YELLOW);
              string label = boosted ? "BOOST" : "normal";
              engine_text(8, 8, 14, RGB_WHITE, label.c_str());
              engine_present();
          }

          cout << "final: " << x << ", " << y << ", boosted: " << boolalpha << boosted << endl;
          return 0;
      }
check:
  output: |
    final: 285, 140, boosted: true
hints:
  - "Both parts follow the pattern already used for dx. For the toggle you need the key function that is true for a single frame, and then set the bool to the opposite of itself."
  - "dy: if (key_down(KEY_UP)) dy -= 1; and if (key_down(KEY_DOWN)) dy += 1;   Toggle: if (key_pressed(KEY_SPACE)) boosted = !boosted;"
  - "Add  if (key_pressed(KEY_SPACE)) boosted = !boosted;  at step 1, and  if (key_down(KEY_UP)) dy -= 1;  if (key_down(KEY_DOWN)) dy += 1;  at step 2."
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include "engine.h"
      using namespace std;

      int main() {
          constexpr int NORMAL = 3;    // pixels per frame
          constexpr int BOOST = 6;     // pixels per frame while boosted
          int x = 150, y = 110;
          bool boosted = false;

          engine_frames(120);

          while (engine_running()) {
              if (key_pressed(KEY_SPACE)) boosted = !boosted;

              int speed = boosted ? BOOST : NORMAL;

              // The direction is -1, 0 or +1 on each axis.
              int dx = 0, dy = 0;
              if (key_down(KEY_LEFT))  dx -= 1;
              if (key_down(KEY_RIGHT)) dx += 1;
              if (key_down(KEY_UP))    dy -= 1;
              if (key_down(KEY_DOWN))  dy += 1;

              x += dx * speed;
              y += dy * speed;

              engine_clear(RGB_DARK);
              if (boosted) engine_rect(x, y, 20, 20, RGB_ORANGE);
              else         engine_rect(x, y, 20, 20, RGB_YELLOW);
              string label = boosted ? "BOOST" : "normal";
              engine_text(8, 8, 14, RGB_WHITE, label.c_str());
              engine_present();
          }

          cout << "final: " << x << ", " << y << ", boosted: " << boolalpha << boosted << endl;
          return 0;
      }
quiz:
  - q: "Which function is true on every frame a key is held?"
    options: ["key_pressed", "key_hold", "key_down", "key_held_once"]
    answer: 2
    explain: "key_down is for continuous things like walking. key_pressed is true on a single frame."
  - q: "Why is  if (key_down(KEY_SPACE)) boosted = !boosted;  a bug?"
    options: ["It is not a bug", "While the key is held, the flag flips on every frame (30 times a second) so the result looks random", "key_down cannot be used with bool", "The ! operator is not allowed"]
    answer: 1
    explain: "Use key_pressed for toggles so the flip happens once per press."
  - q: "What does  int speed = boosted ? BOOST : NORMAL;  do?"
    options: ["Always sets speed to BOOST", "Sets speed to NORMAL when boosted is true", "Compares boosted with BOOST", "Sets speed to BOOST when boosted is true, otherwise NORMAL"]
    answer: 3
    explain: "condition ? value_if_true : value_if_false is the ternary operator, a one-line if/else."
  - q: "The player holds RIGHT and DOWN together with speed 3. What happens?"
    options: ["The player moves diagonally, 3 pixels right and 3 down per frame", "Nothing, the keys cancel each other", "The player moves only right", "The program crashes"]
    answer: 0
---
Games are only fun when you can play them. In this lesson you will read the keyboard, turn it into a direction, and move a square at a steady speed. You will also learn the difference between *holding* a key and *tapping* it.

## Two questions about a key

```cpp
if (key_down(KEY_RIGHT)) {
    x += 3;                // true on EVERY frame the key is held
}

if (key_pressed(KEY_SPACE)) {
    shots++;               // true on ONE frame: the moment the key goes down
}
```

- `key_down(key)` is **true for as long as the key is held**. Use it for walking, steering, anything continuous.
- `key_pressed(key)` is **true only on the first frame of a press**. Use it for one-off actions: shoot, jump, flip a switch. Holding the key does not repeat it.

## Speed per frame, and why there is no dt

When the player holds right for 30 frames at 3 pixels per frame, the square travels `3 x 30 = 90` pixels. A speed in **pixels per frame** is the simplest kind of speed. Many engines give you a `dt` (the time since the last frame) so that movement stays the same when the frame rate changes. This engine always runs at exactly 30 frames per second, so we can skip `dt`. It also keeps your replay perfectly repeatable.

## Direction times speed

A neat habit is to split movement into two ideas: **which way** and **how fast**. The direction on each axis is `-1` (negative), `0` (still) or `+1` (positive):

```cpp
int dx = 0, dy = 0;
if (key_down(KEY_LEFT))  dx -= 1;
if (key_down(KEY_RIGHT)) dx += 1;

x += dx * speed;    // dx is -1, 0 or +1, so we move left, not at all, or right
```

Because each key adds or subtracts 1, holding left and right together gives `dx = 0` and the keys cancel out nicely. The speed can now change without touching the direction code, which is exactly what a boost needs.

## The ternary operator

```cpp
int speed = boosted ? BOOST : NORMAL;
```

`condition ? a : b` is a one-line if/else that produces a value: `a` if the condition is true, otherwise `b`. Here `speed` is `BOOST` while `boosted` is true.

## Toggling a bool

`!` means "not", so `boosted = !boosted;` flips between `true` and `false`. Put it behind `key_pressed` and the boost switches on at the first tap and off at the next:

```cpp
if (key_pressed(KEY_SPACE)) boosted = !boosted;
```

With `key_down` it would flip 30 times a second while the key is held, and you would never know what state you end up in.

To print a `bool` as the word `true` or `false` instead of `1` or `0`, send `boolalpha` to `cout`:

```cpp
cout << boolalpha << boosted;    // true
```

> **Watch out:**
> - Using `key_down` for a toggle: the flag flips every frame. Use `key_pressed`.
> - Writing `boosted == !boosted;` (two equals) compares instead of assigning, so nothing changes. gcc warns: `statement has no effect`.
> - `if (key_down(KEY_UP)) dy += 1;` moves DOWN, because `y` grows downward. Up must subtract.
> - Colors like `RGB_ORANGE` are macros that expand to THREE numbers, so `boosted ? RGB_ORANGE : RGB_YELLOW` breaks (gcc warns `right operand of comma operator has no effect`). Pick a color with a normal `if`/`else` instead, as the starter does.

## Going further

Edit the input script: change `85 up up` to `100 up up` and see how the final position changes. Or add `a` and `d` as extra keys for left and right.

> **Your turn:** add the UP/DOWN direction lines for `dy`, and make SPACE flip `boosted` once per press with `key_pressed`. With the given input the program should print `final: 285, 140, boosted: true`.
