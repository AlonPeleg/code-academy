---
title: The game loop
summary: Every game is a loop that updates and draws 30 times a second. Make a circle glide diagonally across the screen.
level: beginner
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # This lesson needs no keys, the circle moves by itself.
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include "engine.h"
      using namespace std;

      int main() {
          constexpr int SPEED_X = 2;    // pixels per frame to the right
          constexpr int SPEED_Y = 1;    // pixels per frame downward
          int x = 20, y = 20;

          // 1. Tell the engine to record 90 frames (3 seconds) instead of the default 180.

          while (engine_running()) {
              // 2. UPDATE: move x by SPEED_X and y by SPEED_Y on every frame.

              // DRAW
              engine_clear(RGB_DARK);
              engine_circle(x, y, 12, RGB_CYAN);
              string label = "frame " + to_string(engine_frame());
              engine_text(8, 8, 14, RGB_WHITE, label.c_str());
              engine_present();
          }

          cout << "final: " << x << ", " << y << endl;
          cout << "last frame: " << engine_frame() << endl;
          return 0;
      }
check:
  output: |
    final: 200, 110
    last frame: 89
hints:
  - "The circle only moves if x and y change. Change them inside the loop, above the drawing code. The number of frames is set once, before the loop."
  - "Before the loop call engine_frames with 90. Inside the loop use x += SPEED_X; and y += SPEED_Y;"
  - "Before the while loop write  engine_frames(90);  and inside the loop, above DRAW, write  x += SPEED_X;  y += SPEED_Y;"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include "engine.h"
      using namespace std;

      int main() {
          constexpr int SPEED_X = 2;    // pixels per frame to the right
          constexpr int SPEED_Y = 1;    // pixels per frame downward
          int x = 20, y = 20;

          engine_frames(90);

          while (engine_running()) {
              x += SPEED_X;
              y += SPEED_Y;

              engine_clear(RGB_DARK);
              engine_circle(x, y, 12, RGB_CYAN);
              string label = "frame " + to_string(engine_frame());
              engine_text(8, 8, 14, RGB_WHITE, label.c_str());
              engine_present();
          }

          cout << "final: " << x << ", " << y << endl;
          cout << "last frame: " << engine_frame() << endl;
          return 0;
      }
quiz:
  - q: "One frame of the game lasts how long in this engine?"
    options: ["1 second", "1/30 of a second", "1/60 of a second", "As long as the update takes"]
    answer: 1
    explain: "The engine runs at 30 frames per second."
  - q: "In what order do the three jobs of a frame happen?"
    options: ["Draw, update, present", "Present, update, draw", "Update, draw, present", "Update, present, draw"]
    answer: 2
    explain: "Change the numbers, paint them, then tell the engine the picture is ready."
  - q: "engine_text wants a const char*, but you have a std::string called label. What do you pass?"
    options: ["label", "&label", "label.length()", "label.c_str()"]
    answer: 3
    explain: "c_str() gives the plain C string that is inside a std::string."
  - q: "In which corner is (0, 0)?"
    options: ["Top left", "Bottom left", "Center", "Top right"]
    answer: 0
    explain: "x grows to the right and y grows downward."
---
Welcome to game programming in C++! In this lesson you will learn what a **game loop** is, the one idea behind every game, and you will get the full list of everything the mini engine can do.

## The big idea: a flip book

A film is a pile of still pictures shown quickly, and a game works the same way. The program runs a loop, and every trip around the loop is one **frame**. In each frame the game does three jobs:

1. **Update**: change the variables that describe the world (move the player, add to the score).
2. **Draw**: paint the world from those variables.
3. **Present**: tell the engine this picture is finished.

The engine runs at **30 frames per second**, so one frame lasts 1/30 of a second.

```cpp
while (engine_running()) {
    // update: change variables
    // draw: engine_clear(...), engine_circle(...), ...
    engine_present();
}
```

`engine_running()` is true until all frames have been recorded (180 frames, which is 6 seconds, unless you ask for another number). Every time you call it, the engine also moves on to the next frame.

## Coordinates

The screen is **320 pixels wide and 240 tall**. The point `(0, 0)` is the **top-left** corner, `x` grows to the right and `y` grows **downward**. A rectangle is drawn from its top-left corner, a circle from its center.

## Engine reference

The engine header works in both C and C++, so these are plain functions (no classes). Colors are written as one word, such as `RGB_RED`.

| Function | What it does |
|---|---|
| `engine_running()` | Loop condition. True while frames remain; advances to the next frame. |
| `engine_present()` | Ends the frame. Call it once at the bottom of the loop. |
| `engine_clear(color)` | Fills the whole screen with one color. |
| `engine_rect(x, y, w, h, color)` | Filled rectangle, `(x, y)` is its top-left corner. |
| `engine_circle(x, y, radius, color)` | Filled circle, `(x, y)` is its center. |
| `engine_line(x1, y1, x2, y2, color)` | A line between two points. |
| `engine_text(x, y, size, color, text)` | Draws text. `text` must be a `const char*`. |
| `key_down(KEY_...)` | True on every frame the key is held. |
| `key_pressed(KEY_...)` | True only on the single frame the key goes down. |
| `engine_frames(n)` | Record `n` frames (default 180, maximum 600). Call it before the loop. |
| `engine_frame()` | The number of the current frame, starting at 0. |
| `SCREEN_W`, `SCREEN_H` | The screen size: 320 and 240. |

**Colors:** `RGB_BLACK RGB_WHITE RGB_GRAY RGB_DARK RGB_RED RGB_ORANGE RGB_YELLOW RGB_GREEN RGB_CYAN RGB_BLUE RGB_PURPLE RGB_PINK`, or three numbers from 0 to 255: `engine_rect(10, 10, 20, 20, 255, 0, 0)`.

**Keys:** `KEY_LEFT KEY_RIGHT KEY_UP KEY_DOWN KEY_SPACE KEY_A KEY_D KEY_W KEY_S KEY_Z KEY_X KEY_ENTER`.

## Text from a std::string

`engine_text` expects a plain C string. A `std::string` knows how to hand one over with `.c_str()`, and `std::to_string` turns a number into a string:

```cpp
string label = "frame " + to_string(engine_frame());
engine_text(8, 8, 14, RGB_WHITE, label.c_str());   // shows: frame 0, frame 1, ...
```

## Named constants

Instead of scattering the number `2` through your code, name it. In C++ the modern way is `constexpr`:

```cpp
constexpr int SPEED_X = 2;    // a constant the compiler knows at compile time
```

Now `x += SPEED_X;` explains itself, and changing the speed means editing one line.

## This is a replay

Your program cannot be played live in the browser. It runs on a server with a **scripted player**: the *Player input* tab holds lines like `10 right down` (press right at frame 10). The program draws all frames, and the browser plays them back like a video. Edit those lines and press Run to "play" differently. Anything printed with `cout` is normal output, and we use it to print a final result so **Check answer** can verify your logic.

> **Watch out:**
> - Forgetting `#include "engine.h"` gives `'engine_running' was not declared in this scope`.
> - Passing a `std::string` straight to `engine_text` gives `cannot convert 'std::string' to 'const char*'`. Add `.c_str()`.
> - If you forget `engine_present()` the frame is never finished, so nothing shows.
> - Drawing before `engine_clear()` leaves the old picture behind as a smear.

## Going further

Make the circle bounce diagonally the other way by starting at `y = 200` and subtracting from it. Add a rectangle with `engine_rect` that sits still in the middle.

> **Your turn:** call `engine_frames(90)` before the loop, and inside the loop add `SPEED_X` to `x` and `SPEED_Y` to `y`. The program should print `final: 200, 110` and `last frame: 89`.
