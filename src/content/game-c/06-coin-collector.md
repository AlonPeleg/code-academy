---
title: Collision and score - coin collector
summary: Detect when two rectangles overlap and put it all together in a complete tiny game.
level: intermediate
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Right along the top row (two coins)...
  0 right down
  45 right up
  # ...down (third coin)...
  50 down down
  72 down up
  # ...and left (fourth coin). The fifth coin is far away and stays uncollected.
  75 left down
  100 left up
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define NUM_COINS 5
      #define SPEED 4

      typedef struct { int x, y, w, h; } Rect;
      typedef struct { Rect box; int collected; } Coin;

      /* Return 1 if rectangles a and b overlap, otherwise 0. */
      int overlaps(Rect a, Rect b) {
          /* 1. They overlap when ALL four of these are true:
                a starts left of b's right edge       a.x < b.x + b.w
                a's right edge is right of b's left   a.x + a.w > b.x
                ...and the same two checks for y (top and bottom). */
          return 0;
      }

      int main(void) {
          Rect player = {20, 20, 20, 20};
          Coin coins[NUM_COINS] = {
              {{100, 30, 12, 12}, 0},
              {{200, 30, 12, 12}, 0},
              {{200, 120, 12, 12}, 0},
              {{100, 120, 12, 12}, 0},
              {{260, 200, 12, 12}, 0},
          };
          int score = 0;
          char label[40];

          engine_frames(120);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  player.x -= SPEED;
              if (key_down(KEY_RIGHT)) player.x += SPEED;
              if (key_down(KEY_UP))    player.y -= SPEED;
              if (key_down(KEY_DOWN))  player.y += SPEED;

              for (int i = 0; i < NUM_COINS; i++) {
                  /* 2. If this coin is NOT collected yet and it overlaps the player:
                        mark it collected and add 1 to score. */
              }

              engine_clear(RGB_DARK);
              for (int i = 0; i < NUM_COINS; i++) {
                  if (!coins[i].collected) {
                      engine_circle(coins[i].box.x + 6, coins[i].box.y + 6, 6, RGB_YELLOW);
                  }
              }
              engine_rect(player.x, player.y, player.w, player.h, RGB_CYAN);
              snprintf(label, sizeof label, "Score: %d", score);
              engine_text(8, 8, 14, RGB_WHITE, label);
              engine_present();
          }

          printf("score: %d\n", score);
          return 0;
      }
check:
  output: |
    score: 4
hints:
  - "Two rectangles overlap only when they overlap on the x axis AND on the y axis. Write the four comparisons joined with &&, then use the function inside the coin loop, together with the collected flag so a coin counts only once."
  - "return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;   In the loop: if (!coins[i].collected && overlaps(player, coins[i].box)) { ... }"
  - "Inside the for loop: if (!coins[i].collected && overlaps(player, coins[i].box)) { coins[i].collected = 1; score++; }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define NUM_COINS 5
      #define SPEED 4

      typedef struct { int x, y, w, h; } Rect;
      typedef struct { Rect box; int collected; } Coin;

      /* Return 1 if rectangles a and b overlap, otherwise 0. */
      int overlaps(Rect a, Rect b) {
          return a.x < b.x + b.w && a.x + a.w > b.x &&
                 a.y < b.y + b.h && a.y + a.h > b.y;
      }

      int main(void) {
          Rect player = {20, 20, 20, 20};
          Coin coins[NUM_COINS] = {
              {{100, 30, 12, 12}, 0},
              {{200, 30, 12, 12}, 0},
              {{200, 120, 12, 12}, 0},
              {{100, 120, 12, 12}, 0},
              {{260, 200, 12, 12}, 0},
          };
          int score = 0;
          char label[40];

          engine_frames(120);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  player.x -= SPEED;
              if (key_down(KEY_RIGHT)) player.x += SPEED;
              if (key_down(KEY_UP))    player.y -= SPEED;
              if (key_down(KEY_DOWN))  player.y += SPEED;

              for (int i = 0; i < NUM_COINS; i++) {
                  if (!coins[i].collected && overlaps(player, coins[i].box)) {
                      coins[i].collected = 1;
                      score++;
                  }
              }

              engine_clear(RGB_DARK);
              for (int i = 0; i < NUM_COINS; i++) {
                  if (!coins[i].collected) {
                      engine_circle(coins[i].box.x + 6, coins[i].box.y + 6, 6, RGB_YELLOW);
                  }
              }
              engine_rect(player.x, player.y, player.w, player.h, RGB_CYAN);
              snprintf(label, sizeof label, "Score: %d", score);
              engine_text(8, 8, 14, RGB_WHITE, label);
              engine_present();
          }

          printf("score: %d\n", score);
          return 0;
      }
quiz:
  - q: "Two rectangles overlap when..."
    options: ["Their x ranges overlap", "Their y ranges overlap", "Their x ranges overlap AND their y ranges overlap", "Either their x or their y ranges overlap"]
    answer: 2
    explain: "If they only line up on one axis they could still be far apart, like two houses on the same street."
  - q: "Why does each Coin have a collected flag?"
    options: ["So the coin changes color", "So the coin can move", "To make the array longer", "So a coin is counted once, not on every frame the player stands on it"]
    answer: 3
    explain: "The loop runs 30 times a second. Without the flag, one touch would add 30 points a second."
  - q: "The player is at x = 20 with width 20, and a coin is at x = 40 with width 12. Do they overlap on the x axis?"
    options: ["Yes, they share pixels", "No, they only touch edges (20 + 20 = 40), which the formula a.x + a.w > b.x does not count as overlap", "Yes, because 20 < 52", "It cannot be known"]
    answer: 1
    explain: "20 + 20 = 40 is not greater than 40, so touching edges do not count."
  - q: "What is the purpose of a function like overlaps(a, b) returning 1 or 0?"
    options: ["It lets us write  if (overlaps(player, coin))  and keep the collision rule in one place", "It draws the rectangles", "It moves the player", "It is faster than if"]
    answer: 0
---
You can now move a player, keep it on screen, store objects in structs and keep many of them in an array. Time to put it all together: in this lesson you will add **collision detection** and a **score** to build a complete, tiny coin-collecting game.

## When do two rectangles touch?

Almost everything in a simple game is a rectangle, called a **bounding box**. Two boxes `a` and `b` overlap when they overlap on *both* axes at once. On the x axis that means two things:

1. `a`'s left edge is to the **left of b's right edge**: `a.x < b.x + b.w`
2. `a`'s right edge is to the **right of b's left edge**: `a.x + a.w > b.x`

If both are true, they share some horizontal space. The same two checks with `y` and `h` handle the vertical axis. Join all four with `&&` ("and"):

```c
typedef struct { int x, y, w, h; } Rect;

int overlaps(Rect a, Rect b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}
```

A comparison like `a.x < b.x + b.w` produces `1` (true) or `0` (false), so the whole expression is already the answer we want to `return`. This function takes its rectangles **by value** (copies), which is fine because it only reads them.

> Tip: draw two squares on paper, slide one across the other, and watch which of the four conditions turns false first. That is the best way to understand it.

## Coins that can be collected once

Each coin is a struct with a box and a flag:

```c
typedef struct { Rect box; int collected; } Coin;
```

A struct can hold another struct, so `coins[i].box.x` means "the x of the box of the i-th coin". The collision check in the game loop:

```c
for (int i = 0; i < NUM_COINS; i++) {
    if (!coins[i].collected && overlaps(player, coins[i].box)) {
        coins[i].collected = 1;
        score++;
    }
}
```

- `!coins[i].collected` means "not collected yet" (`!` flips true and false).
- Because the loop runs 30 times per second, and the player overlaps a coin for several frames in a row, the flag is essential. Once it is set, that coin is ignored and drawn no more.
- `score++` adds 1.

## The finished game, step by step

Look at how the pieces from all earlier lessons come together in one frame:

1. **Input**: the arrow keys change `player.x` and `player.y` (lessons 2 and 3).
2. **Update**: check every coin for a collision and update the score (lesson 5 style loop).
3. **Draw**: clear, draw the uncollected coins, the player and the score text.
4. **Present**.

After the loop ends, the program prints `score: ...`, which is what **Check answer** reads.

> **Watch out:**
> - Writing `||` (or) instead of `&&` in `overlaps` makes almost everything count as touching.
> - Forgetting the `collected` flag gives one coin worth 10 or 20 points.
> - Mixing up `=` and `==`: `if (coins[i].collected = 0)` assigns, and gcc warns `suggest parentheses around assignment used as truth value`.
> - Forgetting that `x` and `y` are the top-left corner. For a circle drawn with `engine_circle`, the position is the *centre*, so we add half the size when drawing the coin.

## Going further

The fifth coin sits in the bottom-right corner, out of reach of the given script. Edit the Player input so the player collects all five and the program prints `score: 5`. Then try adding a "YOU WIN" text when `score == NUM_COINS`.

> **Your turn:** finish the `overlaps` function with the four comparisons, and in the coin loop mark an uncollected, touching coin as collected and add one to `score`. With the given key script the program should print `score: 4`.
