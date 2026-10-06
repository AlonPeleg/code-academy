---
title: "Snake: a grid and a growing body"
summary: "Move a snake on a grid every few frames, store its body in an array and make it grow when it eats."
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
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define CELL 20          /* one grid square is 20x20 pixels */
      #define COLS 16          /* 320 / 20 */
      #define ROWS 12          /* 240 / 20 */
      #define MAX_LEN 64
      #define STEP_FRAMES 5    /* the snake moves once every 5 frames */
      #define NUM_FOODS 5

      typedef struct { int x, y; } Cell;

      int main(void) {
          Cell body[MAX_LEN] = {{4, 6}, {3, 6}, {2, 6}};   /* body[0] is the head */
          int len = 3;
          Cell foods[NUM_FOODS] = {{8, 6}, {8, 9}, {5, 9}, {5, 7}, {14, 1}};
          int next_food = 0;
          int dx = 1, dy = 0;
          int alive = 1;

          engine_frames(120);

          while (engine_running()) {
              /* steer: a turn is never allowed to reverse straight into the neck */
              if (key_pressed(KEY_LEFT)  && dx == 0) { dx = -1; dy = 0; }
              if (key_pressed(KEY_RIGHT) && dx == 0) { dx = 1;  dy = 0; }
              if (key_pressed(KEY_UP)    && dy == 0) { dx = 0;  dy = -1; }
              if (key_pressed(KEY_DOWN)  && dy == 0) { dx = 0;  dy = 1; }

              if (alive && engine_frame() % STEP_FRAMES == 0) {
                  Cell head = {body[0].x + dx, body[0].y + dy};

                  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
                      alive = 0;                         /* hit a wall */
                  } else {
                      // 1. EAT: if next_food < NUM_FOODS and head is on the cell foods[next_food]
                      //    (same x and same y), grow: add 1 to len and move on to the next food.
                      // 2. SLITHER: every segment takes the place of the one in front of it. Loop i from
                      //    len - 1 down to 1 and copy body[i - 1] into body[i]. Then put head in body[0].
                  }
              }

              engine_clear(RGB_DARK);
              if (next_food < NUM_FOODS) {
                  engine_rect(foods[next_food].x * CELL + 3, foods[next_food].y * CELL + 3,
                              CELL - 6, CELL - 6, RGB_RED);
              }
              for (int i = 0; i < len; i++) {
                  if (i == 0) engine_rect(body[i].x * CELL + 1, body[i].y * CELL + 1, CELL - 2, CELL - 2, RGB_YELLOW);
                  else        engine_rect(body[i].x * CELL + 1, body[i].y * CELL + 1, CELL - 2, CELL - 2, RGB_GREEN);
              }
              if (!alive) engine_text(100, 100, 20, RGB_WHITE, "GAME OVER");
              engine_present();
          }
          printf("length: %d\n", len);
          return 0;
      }
check:
  output: |
    length: 7
hints:
  - "Eating means the new head is on the same cell as the current food: compare x and y, then add one to len and move on to the next food. Moving means every segment copies the one in front of it, starting from the tail so nothing is overwritten too early."
  - "Eat: once next_food < NUM_FOODS is checked, compare head.x and head.y with foods[next_food], then len++ and next_food++.   Slither: loop i from len - 1 down to 1 copying body[i - 1] into body[i], then store head in body[0]."
  - "Eat: if (next_food < NUM_FOODS && head.x == foods[next_food].x && head.y == foods[next_food].y) { len++; next_food++; }   Then: for (int i = len - 1; i > 0; i--) body[i] = body[i - 1];   body[0] = head;"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define CELL 20          /* one grid square is 20x20 pixels */
      #define COLS 16          /* 320 / 20 */
      #define ROWS 12          /* 240 / 20 */
      #define MAX_LEN 64
      #define STEP_FRAMES 5    /* the snake moves once every 5 frames */
      #define NUM_FOODS 5

      typedef struct { int x, y; } Cell;

      int main(void) {
          Cell body[MAX_LEN] = {{4, 6}, {3, 6}, {2, 6}};   /* body[0] is the head */
          int len = 3;
          Cell foods[NUM_FOODS] = {{8, 6}, {8, 9}, {5, 9}, {5, 7}, {14, 1}};
          int next_food = 0;
          int dx = 1, dy = 0;
          int alive = 1;

          engine_frames(120);

          while (engine_running()) {
              /* steer: a turn is never allowed to reverse straight into the neck */
              if (key_pressed(KEY_LEFT)  && dx == 0) { dx = -1; dy = 0; }
              if (key_pressed(KEY_RIGHT) && dx == 0) { dx = 1;  dy = 0; }
              if (key_pressed(KEY_UP)    && dy == 0) { dx = 0;  dy = -1; }
              if (key_pressed(KEY_DOWN)  && dy == 0) { dx = 0;  dy = 1; }

              if (alive && engine_frame() % STEP_FRAMES == 0) {
                  Cell head = {body[0].x + dx, body[0].y + dy};

                  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
                      alive = 0;                         /* hit a wall */
                  } else {
                      if (next_food < NUM_FOODS &&
                          head.x == foods[next_food].x && head.y == foods[next_food].y) {
                          len++;
                          next_food++;
                      }
                      for (int i = len - 1; i > 0; i--) body[i] = body[i - 1];
                      body[0] = head;
                  }
              }

              engine_clear(RGB_DARK);
              if (next_food < NUM_FOODS) {
                  engine_rect(foods[next_food].x * CELL + 3, foods[next_food].y * CELL + 3,
                              CELL - 6, CELL - 6, RGB_RED);
              }
              for (int i = 0; i < len; i++) {
                  if (i == 0) engine_rect(body[i].x * CELL + 1, body[i].y * CELL + 1, CELL - 2, CELL - 2, RGB_YELLOW);
                  else        engine_rect(body[i].x * CELL + 1, body[i].y * CELL + 1, CELL - 2, CELL - 2, RGB_GREEN);
              }
              if (!alive) engine_text(100, 100, 20, RGB_WHITE, "GAME OVER");
              engine_present();
          }
          printf("length: %d\n", len);
          return 0;
      }
quiz:
  - q: "Why is the body shifted from the tail toward the head (i from len - 1 down to 1)?"
    options: ["It is faster","Each copy then reads a cell that has not been overwritten yet","C requires loops to count down","So the head is drawn last"]
    answer: 1
    explain: "Going forwards would copy the head cell over every segment."
  - q: "What does engine_frame() % 5 == 0 do in the game loop?"
    options: ["It is true on every fifth frame, so the snake steps 6 times per second","It is true only once","It picks a random frame","It slows the whole program down"]
    answer: 0
  - q: "How does the snake grow when it eats?"
    options: ["body is cleared","The array is made bigger with malloc each time","len is raised by one before the shift, so the old tail is kept","The head is drawn twice"]
    answer: 2
  - q: "Why can the program not write  if (a == b)  for two Cell structs in C?"
    options: ["Structs have no == operator in C, you compare the fields","Because x and y are ints","Because Cell is too big","It works fine, there is no problem"]
    answer: 0
    explain: "Compare a.x == b.x && a.y == b.y."
---
Snake teaches one of the most useful ideas in games: a **grid** and a **list that grows**. You will store the snake as an array of cells, move it by shifting the array, and make it longer when it eats.

## Grid coordinates

The screen is 320 by 240 pixels. We cut it into squares of 20 pixels, which gives a grid of 16 columns and 12 rows. The snake lives in **cell** coordinates, like `(4, 6)`, and we only turn cells into pixels when we draw:

```c
#define CELL 20
engine_rect(cell.x * CELL, cell.y * CELL, CELL, CELL, RGB_GREEN);
```

Working in cells makes the rules easy: "the snake moves one cell", "the food is in cell (8, 6)", "the wall is at column 16".

## The snake is an array of cells

```c
typedef struct { int x, y; } Cell;

Cell body[MAX_LEN] = {{4, 6}, {3, 6}, {2, 6}};   // body[0] is the head
int len = 3;
```

We reserve room for `MAX_LEN` cells but only `len` of them are used. That is the standard way to build a list that grows in C: a big enough array plus a counter. `body[0]` is the head and `body[len - 1]` is the tail.

## Moving every N frames

The game loop runs 30 times per second, but a snake that moved 30 cells per second would be impossible to steer. So the world only **steps** every 5 frames:

```c
if (engine_frame() % STEP_FRAMES == 0) {
    // one step of the snake
}
```

`%` is the remainder of a division. `engine_frame() % 5` is 0 on frames 0, 5, 10, 15... so the snake moves 6 times per second, while the keys are still read every frame.

## Slithering

To move one cell, the head goes to a new cell and every other segment moves into the place of the segment in front of it. The tail's old cell is simply forgotten:

```c
for (int i = len - 1; i > 0; i--) {
    body[i] = body[i - 1];     // copy the segment in front of me
}
body[0] = head;                 // the new head position
```

Why loop **backwards**? Going from the tail toward the head means each copy reads a cell that has not been overwritten yet. Going forwards, `body[1] = body[0]` and then `body[2] = body[1]` would paint the head cell over the whole snake.

## Eating makes it grow

Growing is just "do not forget the tail this time". Raise `len` by one **before** the shift:

```c
if (head.x == food.x && head.y == food.y) len++;
```

Then the loop starts at the new last index, and copies the old tail into the new slot. The snake is one cell longer. The food positions are fixed in an array (`foods[]`) and `next_food` says which one is on the board, so the game is fully predictable: the same keys always give the same result.

## Steering

The direction is stored as `dx`, `dy` (one of them is zero). A key press changes it, but a snake can not turn around inside itself, so we ignore the reverse direction:

```c
if (key_pressed(KEY_LEFT) && dx == 0) { dx = -1; dy = 0; }
```

A snake moving right has `dx == 1`, so the left key is ignored. Moving up or down (`dx == 0`) it is allowed.

> **Watch out:**
> - Shifting the array **forwards** gives a snake made of one repeated cell. Always copy from the tail up.
> - Forgetting `len++` makes the snake slide but never grow. Increasing `len` past `MAX_LEN` writes outside the array: undefined behavior, often a crash (`Segmentation fault`).
> - Comparing two cells with `==` does not compile for structs (`invalid operands to binary ==`). Compare the fields: `a.x == b.x && a.y == b.y`.
> - The color macros like `RGB_RED` expand to three numbers, so you can not write `cond ? RGB_RED : RGB_GREEN`. Use an `if` and `else` instead (gcc warns `left-hand operand of comma expression has no effect`).

## Going further

The program already ends the game on a wall. Add a loop that checks whether the new head lands on any cell of the body, and end the game on a bite too. Then edit the Player input to take a longer route that eats the last food at (14, 1).

> **Your turn:** in the step, (1) when the new head is on `foods[next_food]` (and `next_food < NUM_FOODS`) add 1 to `len` and 1 to `next_food`, then (2) shift the body from the tail forward and store the head in `body[0]`. With the given keys the program should print `length: 7`.
