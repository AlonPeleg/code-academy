---
title: Keyboard input and movement
summary: Read the arrow keys with key_down, count taps with key_pressed, and move at a steady speed per frame.
level: beginner
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Hold right for 30 frames
  5 right down
  35 right up
  # Hold space for a long time (this counts as ONE tap)
  10 space down
  40 space up
  # Two quick taps
  50 space down
  52 space up
  60 space down
  62 space up
  # Up for 20 frames, then down for 5
  40 up down
  60 up up
  70 down down
  75 down up
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define SPEED 4   /* pixels per frame */

      int main(void) {
          int x = 150, y = 110;
          int taps = 0;
          char label[40];

          engine_frames(120);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  x -= SPEED;
              if (key_down(KEY_RIGHT)) x += SPEED;
              /* 1. Add the UP and DOWN keys. Up makes y smaller, down makes it bigger. */

              /* 2. Count a tap each time SPACE goes down (use the "pressed" function). */

              snprintf(label, sizeof label, "taps: %d", taps);
              engine_clear(RGB_DARK);
              engine_rect(x, y, 20, 20, RGB_YELLOW);
              engine_text(8, 8, 14, RGB_WHITE, label);
              engine_present();
          }

          printf("final: %d, %d, taps: %d\n", x, y, taps);
          return 0;
      }
check:
  output: |
    final: 270, 50, taps: 3
hints:
  - "Moving up and down works exactly like left and right, but changes y instead of x. For taps you need the key function that is true for ONE frame only, not for every frame the key is held."
  - "Use key_down(KEY_UP) with y -= SPEED and key_down(KEY_DOWN) with y += SPEED. For the taps use key_pressed(KEY_SPACE) and add 1 to taps."
  - "Add these lines: if (key_down(KEY_UP)) y -= SPEED;  if (key_down(KEY_DOWN)) y += SPEED;  if (key_pressed(KEY_SPACE)) taps++;"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define SPEED 4   /* pixels per frame */

      int main(void) {
          int x = 150, y = 110;
          int taps = 0;
          char label[40];

          engine_frames(120);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  x -= SPEED;
              if (key_down(KEY_RIGHT)) x += SPEED;
              if (key_down(KEY_UP))    y -= SPEED;
              if (key_down(KEY_DOWN))  y += SPEED;

              if (key_pressed(KEY_SPACE)) taps++;

              snprintf(label, sizeof label, "taps: %d", taps);
              engine_clear(RGB_DARK);
              engine_rect(x, y, 20, 20, RGB_YELLOW);
              engine_text(8, 8, 14, RGB_WHITE, label);
              engine_present();
          }

          printf("final: %d, %d, taps: %d\n", x, y, taps);
          return 0;
      }
quiz:
  - q: "What is the difference between key_down and key_pressed?"
    options: ["There is none", "key_down is true every frame the key is held, key_pressed only on the frame it goes down", "key_pressed is true while held, key_down only once", "key_down works only for the arrow keys"]
    answer: 1
    explain: "Use key_down for walking and key_pressed for one-off actions like jumping or shooting."
  - q: "The player holds RIGHT for 30 frames and SPEED is 4. How far does the player move?"
    options: ["4 pixels", "34 pixels", "120 pixels", "30 pixels"]
    answer: 2
    explain: "4 pixels per frame times 30 frames is 120 pixels."
  - q: "To move the player UP the screen, what do you do to y?"
    options: ["Add to it", "Set it to SCREEN_H", "Multiply it by 2", "Subtract from it"]
    answer: 3
    explain: "y = 0 is the top, so a smaller y means higher on the screen."
  - q: "This engine has no dt (time since the last frame). Why is that fine?"
    options: ["Every frame lasts exactly the same time (1/30 s), so 'pixels per frame' is a steady speed", "Because games do not need speed", "Because the keyboard sets the speed", "It is not fine, movement is random"]
    answer: 0
---
Games are only fun when you can play them. In this lesson you will read the keyboard and move a square around, and you will learn the difference between *holding* a key and *tapping* it.

## Asking about keys

The engine gives you two questions you can ask, each with a key name such as `KEY_LEFT`:

```c
if (key_down(KEY_RIGHT)) {
    x += 4;            /* true on EVERY frame the key is held */
}

if (key_pressed(KEY_SPACE)) {
    jumps++;           /* true on ONE frame: the moment the key goes down */
}
```

- `key_down(key)` is **true for as long as the key is held**. Use it for walking.
- `key_pressed(key)` is **true only on the first frame** of a press. Use it for actions that should happen once per press, like shooting or counting a tap. Holding the key for a second does not repeat it.

Both return a number: 1 for true and 0 for false, which is how `if` works in C.

## Speed per frame

If the player holds right for 30 frames and each frame adds 4 to `x`, the square travels `4 x 30 = 120` pixels. We call the 4 a **speed in pixels per frame**. Many game engines give you a `dt` (the time passed since the previous frame) so they can multiply speed by it. This engine always runs at the same steady 30 frames per second, so we can skip `dt` and just move a fixed amount each frame. That is simple, and it is perfectly repeatable, which matters because your program is replayed from a script.

Instead of writing `4` in many places, give the speed a name:

```c
#define SPEED 4   /* pixels per frame */
```

`#define` makes the compiler replace the word `SPEED` with `4` everywhere. If you later want a faster player, you change one line. There is **no semicolon** after a `#define`.

## Screen coordinates and direction

Because `y` grows downward, the four directions look like this:

| Key | Change |
|---|---|
| left | `x -= SPEED` |
| right | `x += SPEED` |
| up | `y -= SPEED` |
| down | `y += SPEED` |

Notice that `if` statements are independent. If left and right are both held, the two effects cancel out. Holding right and down together moves diagonally, a little faster than a single direction, which is a famous quirk of simple games.

## Showing a number on screen

`engine_text` takes a plain string, so to show a number we first build the string with `snprintf`. It works like `printf` but writes into a char array:

```c
char label[40];
snprintf(label, sizeof label, "taps: %d", taps);
engine_text(8, 8, 14, RGB_WHITE, label);
```

> **Watch out:**
> - Using `key_down` to count taps counts every frame: holding space for 30 frames gives 30 "taps". Use `key_pressed`.
> - `if (key_down(KEY_UP)) y += SPEED;` is a classic slip: up must make `y` smaller.
> - Writing `#define SPEED = 4` or `#define SPEED 4;` makes strange errors like `expected expression before '=' token`. A `#define` has no `=` and no `;`.
> - Typing a key name in lowercase (`key_left`) gives `'key_left' undeclared`. The names are capitals: `KEY_LEFT`.

## Going further

The player input tab lists the key presses of this recording, one per line: `<frame> <key> <down|up>`. Change the numbers, add a `left down` line, press Run, and watch the square follow your new script. Then see how the printed line changes.

> **Your turn:** add the UP and DOWN keys (they change `y` by `SPEED`), and add `1` to `taps` whenever SPACE is pressed using `key_pressed`. With the given input, the program should print `final: 270, 50, taps: 3`.
