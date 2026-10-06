---
title: The game loop
summary: Every game is a loop that updates and draws 30 times a second. Make a square glide across the screen.
level: beginner
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # This lesson needs no keys, the square moves by itself.
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      int main(void) {
          int x = 20;      /* where the square is, left to right */
          int y = 100;     /* where the square is, top to bottom */

          /* 1. Tell the engine to record 90 frames (3 seconds) instead of the default 180. */

          while (engine_running()) {
              /* 2. UPDATE: move the square 2 pixels to the right on every frame. */

              /* DRAW */
              engine_clear(RGB_DARK);
              engine_rect(x, y, 30, 30, RGB_ORANGE);
              engine_text(8, 8, 14, RGB_WHITE, "My first game loop");
              engine_present();
          }

          printf("final x: %d\n", x);
          return 0;
      }
check:
  output: |
    final x: 200
hints:
  - "The square only moves if its x variable changes. Change x inside the loop, before the drawing code, so it is different on every frame."
  - "Before the loop, call engine_frames with the number 90. Inside the loop, add 2 to x with the += operator."
  - "Before the while loop write  engine_frames(90);  and inside the loop, above the DRAW part, write  x += 2;"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      int main(void) {
          int x = 20;      /* where the square is, left to right */
          int y = 100;     /* where the square is, top to bottom */

          engine_frames(90);

          while (engine_running()) {
              x += 2;

              engine_clear(RGB_DARK);
              engine_rect(x, y, 30, 30, RGB_ORANGE);
              engine_text(8, 8, 14, RGB_WHITE, "My first game loop");
              engine_present();
          }

          printf("final x: %d\n", x);
          return 0;
      }
quiz:
  - q: "How many times per second does the loop run in this engine?"
    options: ["1", "30", "300", "As fast as the computer can"]
    answer: 1
    explain: "The screen is redrawn 30 times a second, so one frame lasts 1/30 of a second."
  - q: "What does engine_present() do?"
    options: ["Ends the program", "Clears the screen", "Waits for a key", "Tells the engine the frame is finished and ready to show"]
    answer: 3
    explain: "Call it once at the very end of every frame, after all the drawing."
  - q: "Where is the point (0, 0) on the 320 x 240 screen?"
    options: ["Bottom left", "Center", "Top left", "Top right"]
    answer: 2
    explain: "x grows to the right and y grows DOWNWARD, which surprises most beginners."
  - q: "Why do we call engine_clear() at the start of each frame's drawing?"
    options: ["To erase last frame's picture, otherwise the square leaves a smear", "To make the game faster", "To reset x to zero", "It is required to compile"]
    answer: 0
---
Welcome to game programming in C! In this lesson you will learn what a **game loop** is, the one idea behind every game ever made, and you will get a complete list of everything the mini engine can do.

## The big idea: a flip book

A movie is a pile of still pictures shown fast enough that your eyes see motion. A game works the same way. It runs a loop, and every trip around the loop is one **frame**:

1. **Update**: change the numbers that describe the world (move the player, count the score).
2. **Draw**: paint the world using those numbers.
3. **Present**: tell the engine this picture is finished.

This engine runs at **30 frames per second**, so one frame is 1/30 of a second. The loop looks like this:

```c
while (engine_running()) {
    /* update: change variables */
    /* draw: engine_clear(...), engine_rect(...), ... */
    engine_present();
}
```

`engine_running()` returns true until the recording is over (180 frames, which is 6 seconds, unless you ask for another amount). Each time it is called it also moves the engine on to the next frame.

## Coordinates

The screen is **320 pixels wide and 240 tall**. The point `(0, 0)` is the **top-left** corner. `x` grows to the right and `y` grows **down**. A rectangle is drawn from its top-left corner:

```c
engine_rect(50, 20, 30, 10, RGB_RED);   /* x, y, width, height, color */
```

## Engine reference

Everything you can use. Colors are written as one word, like `RGB_RED`, and expand to three numbers.

| Function | What it does |
|---|---|
| `engine_running()` | Loop condition. True while frames remain, and advances to the next frame. |
| `engine_present()` | Ends the frame. Call it once at the bottom of the loop. |
| `engine_clear(color)` | Fills the whole screen with one color. |
| `engine_rect(x, y, w, h, color)` | Filled rectangle, `(x, y)` is its top-left corner. |
| `engine_circle(x, y, radius, color)` | Filled circle, `(x, y)` is its center. |
| `engine_line(x1, y1, x2, y2, color)` | A line between two points. |
| `engine_text(x, y, size, color, "text")` | Draws text. Size 14 is a good start. |
| `key_down(KEY_...)` | True on every frame the key is held. |
| `key_pressed(KEY_...)` | True only on the single frame the key goes down. |
| `engine_frames(n)` | Record `n` frames (default 180, maximum 600). Call it before the loop. |
| `engine_frame()` | The number of the current frame, starting at 0. |
| `SCREEN_W`, `SCREEN_H` | The screen size: 320 and 240. |

**Colors:** `RGB_BLACK RGB_WHITE RGB_GRAY RGB_DARK RGB_RED RGB_ORANGE RGB_YELLOW RGB_GREEN RGB_CYAN RGB_BLUE RGB_PURPLE RGB_PINK`. You can also give three numbers from 0 to 255 instead: `engine_rect(10, 10, 20, 20, 255, 0, 0)`.

**Keys:** `KEY_LEFT KEY_RIGHT KEY_UP KEY_DOWN KEY_SPACE KEY_A KEY_D KEY_W KEY_S KEY_Z KEY_X KEY_ENTER`.

## This is a replay

Your C program cannot be played live in the browser. Instead it runs on a server with a **scripted player**: the *Player input* tab holds lines like `10 right down` (at frame 10, press right). The program draws all the frames, and the browser plays them back like a video. Edit the input lines to "play" your game differently, then press Run again.

Anything you `printf` is normal output. We use that to print a final result (like `final x: 200`) so **Check answer** can verify your logic.

> **Watch out:**
> - Forgetting `#include "engine.h"` gives errors like `implicit declaration of function 'engine_running'`. Keep that line right after the standard includes.
> - Drawing before `engine_clear()` makes old pictures stick around. Clear first, then draw, then present.
> - If you forget `engine_present()`, nothing is shown: the engine only counts a frame as finished when you present it.
> - Changing `x` after the drawing code is not wrong, but it makes the picture one frame late. Update first, then draw.

## Going further

Try `engine_circle(x, y, 15, RGB_CYAN)` instead of the square, or change `y` as well so the shape moves diagonally. Change the square's speed and see how the final printed `x` changes.

> **Your turn:** call `engine_frames(90)` before the loop, and add `x += 2;` inside the loop so the square moves 2 pixels right on every frame. The program should print `final x: 200`.
