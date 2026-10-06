---
title: Arrays of objects
summary: Keep a fixed pool of bullets in an array and use an active flag to switch them on and off.
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
  # Shoot! Five quick shots, but the pool only has room for 4 bullets...
  5 space down
  6 space up
  10 space down
  11 space up
  15 space down
  16 space up
  20 space down
  21 space up
  25 space down
  26 space up
  # ...then three more shots later on
  45 space down
  46 space up
  70 space down
  71 space up
  100 space down
  101 space up
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define MAX_BULLETS 4
      #define BULLET_SPEED 6

      typedef struct {
          int x, y;
          int active;      /* 1 = flying, 0 = this slot is free */
      } Bullet;

      /* Put a new bullet in the first free slot. Return 1 if it worked, 0 if every slot is busy. */
      int fire_bullet(Bullet bullets[], int x, int y) {
          for (int i = 0; i < MAX_BULLETS; i++) {
              /* 1. If bullets[i] is not active: set its x, y, switch active on, and return 1. */
          }
          return 0;
      }

      void update_bullets(Bullet bullets[]) {
          for (int i = 0; i < MAX_BULLETS; i++) {
              /* 2. For each ACTIVE bullet: move it up by BULLET_SPEED,
                    and when y gets below 0 switch active off (the slot is free again). */
          }
      }

      int main(void) {
          Bullet bullets[MAX_BULLETS] = {0};
          int player_x = 150, fired = 0, in_flight = 0;

          engine_frames(110);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  player_x -= 4;
              if (key_down(KEY_RIGHT)) player_x += 4;
              if (key_pressed(KEY_SPACE) && fire_bullet(bullets, player_x + 8, 200)) fired++;
              update_bullets(bullets);

              engine_clear(RGB_DARK);
              engine_rect(player_x, 205, 20, 20, RGB_CYAN);
              in_flight = 0;
              for (int i = 0; i < MAX_BULLETS; i++) {
                  if (bullets[i].active) {
                      engine_rect(bullets[i].x, bullets[i].y, 4, 10, RGB_YELLOW);
                      in_flight++;
                  }
              }
              engine_present();
          }

          printf("fired: %d, in flight: %d\n", fired, in_flight);
          return 0;
      }
check:
  output: |
    fired: 7, in flight: 1
hints:
  - "An array slot is free when its active flag is 0. Fire = find the first free slot and fill it in. Update = for every active bullet, move it, and free the slot when it leaves the top of the screen."
  - "In fire_bullet: if (!bullets[i].active) { ... return 1; }. In update_bullets: if (bullets[i].active) { bullets[i].y -= BULLET_SPEED; if (bullets[i].y < 0) bullets[i].active = 0; }"
  - "fire_bullet body: if (!bullets[i].active) { bullets[i].x = x; bullets[i].y = y; bullets[i].active = 1; return 1; }   update_bullets body: if (bullets[i].active) { bullets[i].y -= BULLET_SPEED; if (bullets[i].y < 0) bullets[i].active = 0; }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define MAX_BULLETS 4
      #define BULLET_SPEED 6

      typedef struct {
          int x, y;
          int active;      /* 1 = flying, 0 = this slot is free */
      } Bullet;

      /* Put a new bullet in the first free slot. Return 1 if it worked, 0 if every slot is busy. */
      int fire_bullet(Bullet bullets[], int x, int y) {
          for (int i = 0; i < MAX_BULLETS; i++) {
              if (!bullets[i].active) {
                  bullets[i].x = x;
                  bullets[i].y = y;
                  bullets[i].active = 1;
                  return 1;
              }
          }
          return 0;
      }

      void update_bullets(Bullet bullets[]) {
          for (int i = 0; i < MAX_BULLETS; i++) {
              if (bullets[i].active) {
                  bullets[i].y -= BULLET_SPEED;
                  if (bullets[i].y < 0) bullets[i].active = 0;
              }
          }
      }

      int main(void) {
          Bullet bullets[MAX_BULLETS] = {0};
          int player_x = 150, fired = 0, in_flight = 0;

          engine_frames(110);

          while (engine_running()) {
              if (key_down(KEY_LEFT))  player_x -= 4;
              if (key_down(KEY_RIGHT)) player_x += 4;
              if (key_pressed(KEY_SPACE) && fire_bullet(bullets, player_x + 8, 200)) fired++;
              update_bullets(bullets);

              engine_clear(RGB_DARK);
              engine_rect(player_x, 205, 20, 20, RGB_CYAN);
              in_flight = 0;
              for (int i = 0; i < MAX_BULLETS; i++) {
                  if (bullets[i].active) {
                      engine_rect(bullets[i].x, bullets[i].y, 4, 10, RGB_YELLOW);
                      in_flight++;
                  }
              }
              engine_present();
          }

          printf("fired: %d, in flight: %d\n", fired, in_flight);
          return 0;
      }
quiz:
  - q: "What does the active flag in each Bullet mean?"
    options: ["The bullet is red", "Whether this slot currently holds a bullet that is flying", "How fast the bullet moves", "The bullet's index in the array"]
    answer: 1
    explain: "Instead of deleting bullets we switch the flag off and reuse the slot later."
  - q: "What are the valid indexes of  Bullet bullets[4] ?"
    options: ["1 to 4", "0 to 4", "0 to 3", "1 to 3"]
    answer: 2
    explain: "Arrays start at 0, so an array of 4 has indexes 0, 1, 2 and 3. Index 4 is out of bounds."
  - q: "What should fire_bullet do when all 4 slots are busy?"
    options: ["Crash the game", "Delete the oldest bullet", "Make the array bigger", "Do nothing and return 0, so the shot is ignored"]
    answer: 3
    explain: "A C array cannot grow, so a full pool just refuses new bullets."
  - q: "What does  Bullet bullets[MAX_BULLETS] = {0};  do?"
    options: ["Creates the array with every field set to 0, so all bullets start inactive", "Creates only one bullet", "Fills the array with the number 1", "Nothing, arrays start empty anyway"]
    answer: 0
    explain: "Without an initialiser, the values of a local array are garbage, which would give you random active bullets."
---
One bullet is easy: three variables. But a shooter needs many bullets at once, and you do not know how many beforehand. In this lesson you will keep a fixed-size **array** of bullet structs and use a flag to say which slots are in use.

## An array of structs

An array is a numbered row of boxes of the same type. We combine the `Bullet` struct from last lesson with an array:

```c
#define MAX_BULLETS 4

typedef struct {
    int x, y;
    int active;
} Bullet;

Bullet bullets[MAX_BULLETS] = {0};     /* four bullets, all zero */

bullets[2].x = 100;                    /* index 2 = the THIRD bullet */
```

Indexes start at **0**, so the valid ones are `0` to `MAX_BULLETS - 1`. Writing `bullets[4]` is out of bounds: C does not stop you, but you will corrupt other memory.

`= {0}` fills everything with zeros. That matters: without it a local array starts with random leftovers, and some bullets would seem to be flying at the start.

## The pool pattern

C arrays cannot grow, so game programmers often use a **pool**: a fixed number of slots, each with an `active` flag.

- **Fire** a bullet: find the first slot where `active` is 0, fill it in and set `active = 1`.
- **Update**: for each slot that is active, move the bullet. When it leaves the screen, set `active = 0`. The slot is now free to reuse.
- **Draw**: draw only the active slots.

Nothing is allocated or deleted. A bullet "dies" simply by having its flag switched off.

## Looping over the pool

```c
for (int i = 0; i < MAX_BULLETS; i++) {
    if (bullets[i].active) {
        bullets[i].y -= BULLET_SPEED;
    }
}
```

A `for` loop has three parts: start (`int i = 0`), the condition to keep going (`i < MAX_BULLETS`), and the step after each trip (`i++`). Inside, `bullets[i]` is the current bullet, and `bullets[i].y` its field.

Notice the array parameter in the functions: `void update_bullets(Bullet bullets[])`. Arrays are passed by their address automatically, so the function changes the *real* bullets, not copies.

## Firing only when the key is tapped

```c
if (key_pressed(KEY_SPACE) && fire_bullet(bullets, player_x + 8, 200)) fired++;
```

`&&` is "and" and it stops as soon as the left side is false. `key_pressed` is true for one frame per press, and only then `fire_bullet` is called. It returns 1 if a free slot was found, so `fired` counts only the shots that really happened. If all four bullets are busy, the shot is ignored.

> **Watch out:**
> - Forgetting to set `active = 1` when firing: the bullet is "created" but never moves or draws.
> - Forgetting `active = 0` when the bullet leaves: the slots fill up and you can never fire again.
> - Looping with `i <= MAX_BULLETS` reads one element past the end (out of bounds). Use `<`.
> - Using `=` instead of `==` in a condition, like `if (bullets[i].active = 0)`, assigns instead of comparing. gcc warns: `suggest parentheses around assignment used as truth value`.

## Going further

Make the pool bigger (change `MAX_BULLETS` to 10) and watch more bullets fly. Or make bullets move twice as fast with `BULLET_SPEED 12` and see how many shots are accepted.

> **Your turn:** finish `fire_bullet` (find a free slot, fill it in, return 1) and `update_bullets` (move active bullets up by `BULLET_SPEED` and switch them off when `y < 0`). With the given key script the program should print `fired: 7, in flight: 1`.
