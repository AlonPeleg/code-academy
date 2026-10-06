---
title: Keeping the player on screen
summary: Write a clamp function with if statements so the player can never walk off the edge.
level: beginner
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Run into the bottom right corner...
  0 right down
  60 right up
  0 down down
  60 down up
  # ...then run all the way to the left side...
  70 left down
  140 left up
  # ...and finish with a little hop up.
  144 up down
  148 up up
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define SPEED 5
      #define PLAYER_SIZE 20
      #define MAX_X (SCREEN_W - PLAYER_SIZE)   /* the biggest x that still fits */
      #define MAX_Y (SCREEN_H - PLAYER_SIZE)   /* the biggest y that still fits */

      /* Keep value between low and high (both included) and return it. */
      int clamp(int value, int low, int high) {
          /* 1. If value is below low, return low.
             2. If value is above high, return high.
             3. Otherwise return value unchanged. */
          return value;
      }

      int main(void) {
          int x = 150, y = 110;

          engine_frames(150);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  x -= SPEED;
              if (key_down(KEY_RIGHT)) x += SPEED;
              if (key_down(KEY_UP))    y -= SPEED;
              if (key_down(KEY_DOWN))  y += SPEED;

              /* 4. Use your function to keep x between 0 and MAX_X, and y between 0 and MAX_Y. */

              engine_clear(RGB_DARK);
              engine_rect(x, y, PLAYER_SIZE, PLAYER_SIZE, RGB_GREEN);
              engine_present();
          }

          printf("final: %d, %d\n", x, y);
          return 0;
      }
check:
  output: |
    final: 0, 200
hints:
  - "A clamp is just two checks: too small and too big. Write them with if. After your function works, call it for x and for y inside the loop, right after the key code."
  - "Inside clamp: if (value < low) return low;  then  if (value > high) return high;  then  return value;   In main, assign the result back to x and to y."
  - "In main, after the four key lines, write:  x = clamp(x, 0, MAX_X);  y = clamp(y, 0, MAX_Y);   and in clamp the two if-returns before the final return value;"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define SPEED 5
      #define PLAYER_SIZE 20
      #define MAX_X (SCREEN_W - PLAYER_SIZE)   /* the biggest x that still fits */
      #define MAX_Y (SCREEN_H - PLAYER_SIZE)   /* the biggest y that still fits */

      /* Keep value between low and high (both included) and return it. */
      int clamp(int value, int low, int high) {
          if (value < low) return low;
          if (value > high) return high;
          return value;
      }

      int main(void) {
          int x = 150, y = 110;

          engine_frames(150);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  x -= SPEED;
              if (key_down(KEY_RIGHT)) x += SPEED;
              if (key_down(KEY_UP))    y -= SPEED;
              if (key_down(KEY_DOWN))  y += SPEED;

              x = clamp(x, 0, MAX_X);
              y = clamp(y, 0, MAX_Y);

              engine_clear(RGB_DARK);
              engine_rect(x, y, PLAYER_SIZE, PLAYER_SIZE, RGB_GREEN);
              engine_present();
          }

          printf("final: %d, %d\n", x, y);
          return 0;
      }
quiz:
  - q: "The player is 20 pixels wide and the screen is 320 wide. What is the biggest x that keeps the whole player visible?"
    options: ["320", "340", "300", "20"]
    answer: 2
    explain: "x is the LEFT edge of the player, so the right edge is x + 20. That must stay at or below 320, so x is at most 300."
  - q: "What does clamp(150, 0, 100) return?"
    options: ["0", "150", "50", "100"]
    answer: 3
  - q: "Why do we write  #define MAX_X (SCREEN_W - PLAYER_SIZE)  with parentheses?"
    options: ["C requires them", "So the subtraction happens as one unit wherever the macro is used", "To make the number bigger", "They are optional and do nothing"]
    answer: 1
    explain: "A macro is plain text replacement. Without parentheses, 2 * MAX_X would become 2 * 320 - 20, which is wrong."
  - q: "Where in the loop should the clamping code go?"
    options: ["Before drawing but after the movement changes x and y", "After the loop ends", "Before engine_running()", "Inside engine_present()"]
    answer: 0
    explain: "Move first, then fix the position, then draw."
---
Right now your square can wander off the screen and never come back. In this lesson you will build a tiny helper function, **clamp**, and use it to trap the player inside the window. You will also meet macros for the screen size.

## Screen size constants

The engine gives you two names, `SCREEN_W` (320) and `SCREEN_H` (240). Always use them instead of typing 320 and 240: your code then says what the numbers mean, and still works if the screen size ever changes.

Remember that a rectangle's `x` and `y` are its **top-left corner**. For a player that is 20 pixels wide, the right edge is at `x + 20`. For the whole player to stay visible:

```
0  <=  x  <=  SCREEN_W - 20      (that is 300)
0  <=  y  <=  SCREEN_H - 20      (that is 220)
```

To avoid repeating the sum, define macros:

```c
#define PLAYER_SIZE 20
#define MAX_X (SCREEN_W - PLAYER_SIZE)
```

A **macro** is text replacement done before compiling: wherever you write `MAX_X`, the compiler sees `(320 - 20)`. The parentheses protect you when the macro is used inside a bigger expression.

## What is clamping?

To **clamp** a number means to squeeze it into a range. If it is too small, use the smallest allowed value. If it is too big, use the biggest allowed. Otherwise leave it alone.

```c
int clamp(int value, int low, int high) {
    if (value < low) return low;
    if (value > high) return high;
    return value;
}
```

Piece by piece:

- `int clamp(...)` declares a function that **returns an int**.
- `int value, int low, int high` are the three **parameters**: the function's inputs.
- `return low;` immediately leaves the function and hands `low` back to the caller. The next lines never run.
- The last `return value;` happens only if both `if` checks were false, which means the value was already fine.

Using it:

```c
printf("%d\n", clamp(-5, 0, 100));   /* prints 0   */
printf("%d\n", clamp(250, 0, 100));  /* prints 100 */
printf("%d\n", clamp(42, 0, 100));   /* prints 42  */
```

In the game loop, first move, then clamp, then draw:

```c
x += SPEED;                  /* may go past the edge for a moment */
x = clamp(x, 0, MAX_X);      /* ...but is fixed before we draw */
```

Calling `clamp(x, 0, MAX_X);` alone does nothing useful: the function returns a new number and does not change `x`. You must assign the result back with `x = ...`.

> **Watch out:**
> - Writing `clamp(x, 0, MAX_X);` without `x =` keeps the bug: nothing changes. No error is shown, which makes this one tricky.
> - Putting the arguments in the wrong order, like `clamp(x, MAX_X, 0)`, makes the range empty and gives odd results.
> - Using `SCREEN_W` as the limit instead of `SCREEN_W - PLAYER_SIZE` lets the player slide half off the right side.
> - A missing `return` at the end gives the warning `control reaches end of non-void function`.

## Going further

Instead of stopping at the wall you could make the player appear on the opposite side (wrap around). Try replacing the clamp with `if (x > MAX_X) x = 0;`.

> **Your turn:** finish the `clamp` function (the two `if` checks and the final `return`), then use it in the loop to keep `x` between `0` and `MAX_X` and `y` between `0` and `MAX_Y`. The given input runs into the corner, back to the left, and hops up, so the program should print `final: 0, 200`.
