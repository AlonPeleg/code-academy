---
title: Keeping the player on screen
summary: Trap the player inside the window with std::clamp, or with std::min and std::max.
level: beginner
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Run into the left wall and the top wall first...
  0 left down
  50 left up
  0 up down
  40 up up
  # ...then run all the way to the right...
  60 right down
  130 right up
  # ...and down to the floor.
  70 down down
  120 down up
files:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include "engine.h"

      int main() {
          constexpr int SPEED = 6;
          constexpr int SIZE = 24;
          constexpr int MAX_X = SCREEN_W - SIZE;   // the biggest x that still fits
          constexpr int MAX_Y = SCREEN_H - SIZE;   // the biggest y that still fits
          int x = 150, y = 110;

          engine_frames(150);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  x -= SPEED;
              if (key_down(KEY_RIGHT)) x += SPEED;
              if (key_down(KEY_UP))    y -= SPEED;
              if (key_down(KEY_DOWN))  y += SPEED;

              // 1. Keep x between 0 and MAX_X with the one-call helper from <algorithm> (it takes a value, a low and a high).
              // 2. Keep y between 0 and MAX_Y the long way: first cap it from above, then from below,
              //    using the two helpers that return the smaller / the larger of two numbers.

              engine_clear(RGB_DARK);
              engine_rect(x, y, SIZE, SIZE, RGB_GREEN);
              engine_present();
          }

          std::cout << "final: " << x << ", " << y << std::endl;
          return 0;
      }
check:
  output: |
    final: 296, 216
hints:
  - "std::clamp(value, low, high) gives back the value squeezed into the range. You must assign the answer back. For y, std::min(a, b) gives the smaller one and std::max(a, b) the larger one."
  - "x = std::clamp(x, 0, MAX_X);   For y, first make sure it is not above MAX_Y with std::min, then not below 0 with std::max. Nest them or do two lines."
  - "x = std::clamp(x, 0, MAX_X);   y = std::min(y, MAX_Y);   y = std::max(y, 0);"
solution:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include "engine.h"

      int main() {
          constexpr int SPEED = 6;
          constexpr int SIZE = 24;
          constexpr int MAX_X = SCREEN_W - SIZE;   // the biggest x that still fits
          constexpr int MAX_Y = SCREEN_H - SIZE;   // the biggest y that still fits
          int x = 150, y = 110;

          engine_frames(150);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  x -= SPEED;
              if (key_down(KEY_RIGHT)) x += SPEED;
              if (key_down(KEY_UP))    y -= SPEED;
              if (key_down(KEY_DOWN))  y += SPEED;

              x = std::clamp(x, 0, MAX_X);
              y = std::min(y, MAX_Y);
              y = std::max(y, 0);

              engine_clear(RGB_DARK);
              engine_rect(x, y, SIZE, SIZE, RGB_GREEN);
              engine_present();
          }

          std::cout << "final: " << x << ", " << y << std::endl;
          return 0;
      }
quiz:
  - q: "What does std::clamp(15, 0, 10) return?"
    options: ["0", "15", "10", "5"]
    answer: 2
    explain: "15 is above the high limit, so the result is the limit: 10."
  - q: "What does  y = std::min(y, MAX_Y);  do?"
    options: ["Makes y the smaller of the two, so y can never be larger than MAX_Y", "Makes y at least MAX_Y", "Sets y to zero", "Nothing, because it does not change y"]
    answer: 0
    explain: "min picks the smaller number. It is an upper cap, which is easy to mix up with its name."
  - q: "Why is the biggest allowed x equal to SCREEN_W - SIZE and not SCREEN_W?"
    options: ["It is a C++ rule", "x is the left edge of the player, and the right edge x + SIZE must still be on screen", "Because the screen starts at 1", "To leave room for text"]
    answer: 1
  - q: "Which header do std::clamp, std::min and std::max come from?"
    options: ["<iostream>", "<string>", "<cmath>", "<algorithm>"]
    answer: 3
---
Right now a square can wander off the edge and never come back. In this lesson you will keep the player inside the window with a single line, using helpers from the C++ standard library.

## How big is the playground?

The screen is `SCREEN_W` x `SCREEN_H` (320 x 240). Remember that a rectangle's `x` and `y` are its **top-left corner**. A player that is `SIZE` pixels wide has its right edge at `x + SIZE`, so the allowed positions are:

```
0  <=  x  <=  SCREEN_W - SIZE
0  <=  y  <=  SCREEN_H - SIZE
```

With C++ constants you can name those limits once:

```cpp
constexpr int SIZE = 24;
constexpr int MAX_X = SCREEN_W - SIZE;     // 296
```

`constexpr` means "computed while compiling", and it can use other constants such as `SCREEN_W` to work out the number for you.

## std::clamp

To **clamp** a number means squeezing it into a range: too small becomes the lowest allowed, too big becomes the highest allowed, anything else stays. C++17 has this built in:

```cpp
#include <algorithm>

std::clamp(15, 0, 10);    // 10  (too big)
std::clamp(-3, 0, 10);    // 0   (too small)
std::clamp(7, 0, 10);     // 7   (fine already)
```

The arguments are always **value, low, high**. In the game loop you move first, then clamp, then draw:

```cpp
x += SPEED;                          // may go past the edge for a moment
x = std::clamp(x, 0, MAX_X);         // ...but is fixed before we draw
```

`std::clamp` returns the new number. It does not change `x` by itself, so you must assign the result back with `x = ...`.

## std::min and std::max

`std::min(a, b)` returns the smaller of two numbers and `std::max(a, b)` the larger. Together they do the same job as clamp, "the long way":

```cpp
y = std::min(y, MAX_Y);     // never larger than MAX_Y  (an upper cap)
y = std::max(y, 0);         // never smaller than 0     (a lower cap)
```

(`std::clamp` needs C++17. If your run server says `'clamp' is not a member of 'std'`, use `std::min` and `std::max` for both axes.)

The names feel backwards at first: `min` is the one that keeps `y` from getting **big**, because it picks the smaller of `y` and the ceiling. Say it out loud: "y, but at most MAX_Y".

You can also nest them in one line: `y = std::max(0, std::min(y, MAX_Y));`. Both arguments to `min`/`max` must have the same type, so `std::min(y, 2.5)` does not compile, but two `int`s are fine.

## std:: or using namespace?

Everything in the standard library lives in the `std` namespace. You write the prefix `std::`, or put `using namespace std;` at the top and drop it. Writing the prefix is a good habit in bigger programs because it shows where a name comes from. In this lesson we use the prefix.

> **Watch out:**
> - `std::clamp(x, 0, MAX_X);` on a line by itself does nothing: the result is thrown away. Write `x = std::clamp(...)`.
> - Putting the arguments in the wrong order, such as `std::clamp(x, MAX_X, 0)`, is undefined behavior: the low must not be bigger than the high.
> - Forgetting `#include <algorithm>` gives `'clamp' is not a member of 'std'`.
> - If you get `error: no matching function for call to 'min(int&, double)'`, you mixed an `int` with a `double`. Use two numbers of the same type.

## Going further

Make the playground smaller: change `MAX_X` to `SCREEN_W / 2` and watch the player stop in the middle. Or bounce instead: when `x` hits the edge, flip the sign of a `dx` variable.

> **Your turn:** keep `x` in range with `std::clamp`, and keep `y` in range using `std::min` and `std::max`. The input script runs into all four walls and the program should print `final: 296, 216`.
