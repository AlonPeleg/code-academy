---
title: Structs for game objects
summary: Bundle a game object's data into a struct and write functions that take a pointer to it.
level: intermediate
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Run right (into the wall), down, a little left, a little up
  10 right down
  50 right up
  20 down down
  45 down up
  60 left down
  70 left up
  80 up down
  90 up up
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      typedef struct {
          int x, y;      /* position (top-left corner) */
          int size;      /* width and height */
          int speed;     /* pixels per frame */
      } Player;

      /* p is a POINTER to a Player, so we use p->x to reach inside it. */
      void player_update(Player *p) {
          /* 1. Move p->x and p->y by p->speed with the four arrow keys. */

          if (p->x < 0) p->x = 0;
          if (p->y < 0) p->y = 0;
          if (p->x > SCREEN_W - p->size) p->x = SCREEN_W - p->size;
          if (p->y > SCREEN_H - p->size) p->y = SCREEN_H - p->size;
      }

      void player_draw(const Player *p) {
          engine_rect(p->x, p->y, p->size, p->size, RGB_CYAN);
      }

      int main(void) {
          Player player = {150, 110, 20, 4};   /* x, y, size, speed */

          engine_frames(120);

          while (engine_running()) {
              /* 2. Call player_update. It needs the ADDRESS of player (use &). */

              engine_clear(RGB_DARK);
              player_draw(&player);
              engine_present();
          }

          printf("final: %d, %d\n", player.x, player.y);
          return 0;
      }
check:
  output: |
    final: 260, 170
  code:
    - { pattern: 'player_update\s*\(\s*&\s*player\s*\)', message: "Call player_update(&player) inside the loop." }
    - { pattern: 'p\s*->\s*x\s*[-+]=\s*p\s*->\s*speed', message: "Use p->x += p->speed (and -=) to move." }
hints:
  - "Inside player_update every field is reached through the pointer with an arrow: p->x, p->y, p->speed. In main you must hand the function the address of your player variable."
  - "Write four ifs such as  if (key_down(KEY_LEFT)) p->x -= p->speed;  and in main call the function with the & operator."
  - "Add: if (key_down(KEY_LEFT)) p->x -= p->speed;  if (key_down(KEY_RIGHT)) p->x += p->speed;  if (key_down(KEY_UP)) p->y -= p->speed;  if (key_down(KEY_DOWN)) p->y += p->speed;   and in the loop: player_update(&player);"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      typedef struct {
          int x, y;      /* position (top-left corner) */
          int size;      /* width and height */
          int speed;     /* pixels per frame */
      } Player;

      /* p is a POINTER to a Player, so we use p->x to reach inside it. */
      void player_update(Player *p) {
          if (key_down(KEY_LEFT))  p->x -= p->speed;
          if (key_down(KEY_RIGHT)) p->x += p->speed;
          if (key_down(KEY_UP))    p->y -= p->speed;
          if (key_down(KEY_DOWN))  p->y += p->speed;

          if (p->x < 0) p->x = 0;
          if (p->y < 0) p->y = 0;
          if (p->x > SCREEN_W - p->size) p->x = SCREEN_W - p->size;
          if (p->y > SCREEN_H - p->size) p->y = SCREEN_H - p->size;
      }

      void player_draw(const Player *p) {
          engine_rect(p->x, p->y, p->size, p->size, RGB_CYAN);
      }

      int main(void) {
          Player player = {150, 110, 20, 4};   /* x, y, size, speed */

          engine_frames(120);

          while (engine_running()) {
              player_update(&player);

              engine_clear(RGB_DARK);
              player_draw(&player);
              engine_present();
          }

          printf("final: %d, %d\n", player.x, player.y);
          return 0;
      }
quiz:
  - q: "What is a struct?"
    options: ["A loop that never ends", "A way to bundle several related variables into one new type", "A kind of comment", "A function that returns two values"]
    answer: 1
    explain: "A Player struct can hold x, y, size and speed together, so one variable describes the whole object."
  - q: "player.x and p->x both reach the x field. When do you use the arrow?"
    options: ["When you have a pointer to the struct", "When x is negative", "Only inside main", "When the struct has more than three fields"]
    answer: 0
    explain: "Use the dot on a struct variable and the arrow on a pointer to a struct."
  - q: "Why does player_update take a POINTER (Player *p) instead of a plain Player?"
    options: ["Pointers are faster to type", "C does not allow plain structs as parameters", "So the function can return nothing", "A plain Player would be a copy, and changes to the copy would be lost"]
    answer: 3
    explain: "C passes arguments by copy. A pointer lets the function change the original."
  - q: "How do you pass the variable  Player player;  to a function that expects Player *p ?"
    options: ["player_update(player)", "player_update(*player)", "player_update(&player)", "player_update(player.p)"]
    answer: 2
    explain: "The & operator means 'the address of'."
---
As a game grows you need more and more variables for the player: `player_x`, `player_y`, `player_speed`, `player_size`, and soon the same for enemies. That gets messy fast. In this lesson you will learn **structs**, which bundle related values into one tidy thing, and **pointers**, which let a function change that thing.

## Your own type

A `struct` groups variables (called **fields**) under one name:

```c
typedef struct {
    int x, y;
    int size;
    int speed;
} Player;
```

`typedef` gives the new type a short name, `Player`, so you can write `Player` instead of `struct Player`. Now you can create variables of that type and fill in the fields in order:

```c
Player player = {150, 110, 20, 4};   /* x, y, size, speed */
printf("%d\n", player.x);            /* prints: 150 */
player.x = player.x + 10;            /* the dot reaches a field */
```

Everything about the player now travels together as one variable.

## Functions that change a struct

C passes arguments **by copy**. If you wrote `void player_update(Player p)`, the function would get its own private copy, change that, and throw it away when it returns. Your real player would never move.

To change the original, give the function its **address** instead, which is a **pointer**:

```c
void player_update(Player *p) {     /* p holds the address of a Player */
    if (key_down(KEY_RIGHT)) p->x += p->speed;
}

player_update(&player);             /* &player means "the address of player" */
```

- `Player *p` means "p is a pointer to a Player".
- `&player` produces that address when you call the function.
- `p->x` means "go to the Player that p points to and use its x". The arrow replaces the dot when you have a pointer.

For a function that only **reads** the struct, like drawing, write `const Player *p`. The `const` promises the function will not change it, and the compiler will warn you if it tries.

## Why this is nice

With the data and the functions that work on it grouped as `Player`, `player_update` and `player_draw`, the main loop reads like a sentence:

```c
while (engine_running()) {
    player_update(&player);
    engine_clear(RGB_DARK);
    player_draw(&player);
    engine_present();
}
```

If you want a second object, such as an enemy, you create another struct variable and reuse the same functions. C has no classes, but this pattern (a struct plus functions named `thing_action`) is how a lot of real C code is organised.

> **Watch out:**
> - Writing `p.x` when `p` is a pointer gives `error: 'p' is a pointer; did you mean to use '->'?`. Use `p->x`.
> - Writing `player_update(player)` without `&` gives `incompatible type for argument 1`. Pass the address with `&player`.
> - Forgetting the `;` after the closing `}` of a plain `struct` definition gives a confusing error on the next line. With `typedef struct { ... } Player;` the `;` comes after the name.
> - Passing the struct by copy compiles and runs, but the player never moves. If your update seems to do nothing, check for the `*`.

## Going further

Create a second object, `Player enemy = {10, 10, 20, 2};`, and draw it with the same `player_draw(&enemy)`. One function, two objects.

> **Your turn:** write the four movement lines inside `player_update` using `p->x`, `p->y` and `p->speed`, and call `player_update(&player);` in the game loop. The program should print `final: 260, 170`.
