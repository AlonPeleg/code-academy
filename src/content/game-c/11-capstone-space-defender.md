---
title: "Capstone: space defender"
summary: "Combine structs, arrays, collisions, scoring and lives into a complete shooter, organized around a Game struct."
level: advanced
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Slide under the falling enemies and tap space to fire
  1 left down
  28 left up
  28 space down
  29 space up
  40 space down
  41 space up
  43 right down
  81 right up
  81 space down
  82 space up
  92 left down
  110 left up
  110 space down
  111 space up
  121 right down
  154 right up
  154 space down
  155 space up
  162 left down
  205 left up
  205 space down
  206 space up
  209 right down
  232 right up
  232 space down
  233 space up
  237 right down
  252 right up
  252 space down
  253 space up
  264 space down
  265 space up
  265 left down
  313 left up
  313 space down
  314 space up
  319 right down
  357 right up
  357 space down
  358 space up
  361 left down
  379 left up
  379 space down
  380 space up
  384 right down
  417 right up
  417 space down
  418 space up
  421 left down
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define MAX_BULLETS 4
      #define MAX_ENEMIES 8
      #define NUM_LANES 8

      typedef struct { int x, y, w, h, active; } Thing;
      typedef struct {
          Thing player, bullets[MAX_BULLETS], enemies[MAX_ENEMIES];
          int score, lives, lane;
      } Game;

      static const int LANES[NUM_LANES] = {40, 200, 120, 260, 80, 180, 20, 240};

      static int overlaps(const Thing *a, const Thing *b) {
          return a->x < b->x + b->w && a->x + a->w > b->x &&
                 a->y < b->y + b->h && a->y + a->h > b->y;
      }

      /* Put a thing into the first free slot of an array (if there is one). */
      static void spawn(Thing *list, int n, int x, int y, int w, int h) {
          for (int i = 0; i < n; i++) {
              if (!list[i].active) { list[i] = (Thing){x, y, w, h, 1}; return; }
          }
      }

      static void step(Game *g) {
          if (key_down(KEY_LEFT)  && g->player.x > 0)                  g->player.x -= 4;
          if (key_down(KEY_RIGHT) && g->player.x < SCREEN_W - g->player.w) g->player.x += 4;
          if (key_pressed(KEY_SPACE)) spawn(g->bullets, MAX_BULLETS, g->player.x + 8, g->player.y - 10, 4, 10);
          if (engine_frame() % 30 == 0) spawn(g->enemies, MAX_ENEMIES, LANES[g->lane++ % NUM_LANES], -16, 16, 16);

          for (int i = 0; i < MAX_BULLETS; i++) {
              if (!g->bullets[i].active) continue;
              g->bullets[i].y -= 8;
              if (g->bullets[i].y < -10) g->bullets[i].active = 0;
          }
          for (int i = 0; i < MAX_ENEMIES; i++) {
              if (g->enemies[i].active) g->enemies[i].y += 2;
          }

          // 1. SHOOTING: for every active bullet and every active enemy that overlap, switch BOTH
          //    off (active = 0) and add 10 to g->score.
          // 2. DAMAGE: an active enemy that overlaps g->player OR has fallen past the bottom
          //    (y > SCREEN_H) costs one life: switch it off and subtract 1 from g->lives.
      }

      int main(void) {
          Game g = {{150, 215, 20, 12, 1}, {{0}}, {{0}}, 0, 3, 0};
          char label[48];

          engine_frames(450);

          while (engine_running()) {
              if (g.lives > 0) step(&g);

              engine_clear(RGB_DARK);
              for (int i = 0; i < MAX_BULLETS; i++)
                  if (g.bullets[i].active) engine_rect(g.bullets[i].x, g.bullets[i].y, 4, 10, RGB_YELLOW);
              for (int i = 0; i < MAX_ENEMIES; i++)
                  if (g.enemies[i].active) engine_rect(g.enemies[i].x, g.enemies[i].y, 16, 16, RGB_RED);
              engine_rect(g.player.x, g.player.y, g.player.w, g.player.h, RGB_CYAN);
              snprintf(label, sizeof label, "Score %d   Lives %d", g.score, g.lives);
              engine_text(8, 8, 14, RGB_WHITE, label);
              if (g.lives <= 0) engine_text(100, 110, 20, RGB_WHITE, "GAME OVER");
              engine_present();
          }
          printf("score: %d, lives: %d\n", g.score, g.lives);
          return 0;
      }
check:
  output: |
    score: 110, lives: 2
hints:
  - "Two collision loops at the end of step(). Shooting: a loop inside a loop over bullets and enemies, only for active ones that overlap; both get switched off and the score goes up by 10. Damage: one loop over enemies; touching the player or falling past the bottom switches the enemy off and costs a life."
  - "Shooting: if (g->bullets[b].active && g->enemies[e].active && overlaps(&g->bullets[b], &g->enemies[e])) { both active = 0; g->score += 10; }   Damage: if (en->active && (overlaps(en, &g->player) || en->y > SCREEN_H)) { en->active = 0; g->lives--; }"
  - "for (int b = 0; b < MAX_BULLETS; b++) for (int e = 0; e < MAX_ENEMIES; e++) if (g->bullets[b].active && g->enemies[e].active && overlaps(&g->bullets[b], &g->enemies[e])) { g->bullets[b].active = 0; g->enemies[e].active = 0; g->score += 10; }   then: for each enemy en: if (en->active && (overlaps(en, &g->player) || en->y > SCREEN_H)) { en->active = 0; g->lives--; }"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define MAX_BULLETS 4
      #define MAX_ENEMIES 8
      #define NUM_LANES 8

      typedef struct { int x, y, w, h, active; } Thing;
      typedef struct {
          Thing player, bullets[MAX_BULLETS], enemies[MAX_ENEMIES];
          int score, lives, lane;
      } Game;

      static const int LANES[NUM_LANES] = {40, 200, 120, 260, 80, 180, 20, 240};

      static int overlaps(const Thing *a, const Thing *b) {
          return a->x < b->x + b->w && a->x + a->w > b->x &&
                 a->y < b->y + b->h && a->y + a->h > b->y;
      }

      /* Put a thing into the first free slot of an array (if there is one). */
      static void spawn(Thing *list, int n, int x, int y, int w, int h) {
          for (int i = 0; i < n; i++) {
              if (!list[i].active) { list[i] = (Thing){x, y, w, h, 1}; return; }
          }
      }

      static void step(Game *g) {
          if (key_down(KEY_LEFT)  && g->player.x > 0)                  g->player.x -= 4;
          if (key_down(KEY_RIGHT) && g->player.x < SCREEN_W - g->player.w) g->player.x += 4;
          if (key_pressed(KEY_SPACE)) spawn(g->bullets, MAX_BULLETS, g->player.x + 8, g->player.y - 10, 4, 10);
          if (engine_frame() % 30 == 0) spawn(g->enemies, MAX_ENEMIES, LANES[g->lane++ % NUM_LANES], -16, 16, 16);

          for (int i = 0; i < MAX_BULLETS; i++) {
              if (!g->bullets[i].active) continue;
              g->bullets[i].y -= 8;
              if (g->bullets[i].y < -10) g->bullets[i].active = 0;
          }
          for (int i = 0; i < MAX_ENEMIES; i++) {
              if (g->enemies[i].active) g->enemies[i].y += 2;
          }

          for (int b = 0; b < MAX_BULLETS; b++) {
              for (int e = 0; e < MAX_ENEMIES; e++) {
                  if (g->bullets[b].active && g->enemies[e].active &&
                      overlaps(&g->bullets[b], &g->enemies[e])) {
                      g->bullets[b].active = 0;
                      g->enemies[e].active = 0;
                      g->score += 10;
                  }
              }
          }
          for (int e = 0; e < MAX_ENEMIES; e++) {
              Thing *en = &g->enemies[e];
              if (en->active && (overlaps(en, &g->player) || en->y > SCREEN_H)) {
                  en->active = 0;
                  g->lives--;
              }
          }
      }

      int main(void) {
          Game g = {{150, 215, 20, 12, 1}, {{0}}, {{0}}, 0, 3, 0};
          char label[48];

          engine_frames(450);

          while (engine_running()) {
              if (g.lives > 0) step(&g);

              engine_clear(RGB_DARK);
              for (int i = 0; i < MAX_BULLETS; i++)
                  if (g.bullets[i].active) engine_rect(g.bullets[i].x, g.bullets[i].y, 4, 10, RGB_YELLOW);
              for (int i = 0; i < MAX_ENEMIES; i++)
                  if (g.enemies[i].active) engine_rect(g.enemies[i].x, g.enemies[i].y, 16, 16, RGB_RED);
              engine_rect(g.player.x, g.player.y, g.player.w, g.player.h, RGB_CYAN);
              snprintf(label, sizeof label, "Score %d   Lives %d", g.score, g.lives);
              engine_text(8, 8, 14, RGB_WHITE, label);
              if (g.lives <= 0) engine_text(100, 110, 20, RGB_WHITE, "GAME OVER");
              engine_present();
          }
          printf("score: %d, lives: %d\n", g.score, g.lives);
          return 0;
      }
quiz:
  - q: "Why does the game keep bullets and enemies in fixed-size arrays with an active flag?"
    options: ["Arrays are the only thing C has","Slots can be reused without allocating memory, and a limit like 'at most 4 bullets' comes for free","To make the game slower","So they can be sorted"]
    answer: 1
  - q: "What is the benefit of packing all variables into a Game struct?"
    options: ["The program uses less memory","Colors work","One pointer passes the entire game state to a function like step()","It is required by the engine"]
    answer: 2
  - q: "How do the enemies get different x positions without rand()?"
    options: ["From the clock","A fixed table LANES that repeats thanks to the % operator, so the replay is deterministic","From the keyboard","Each enemy is typed in by hand"]
    answer: 1
  - q: "Why check the active flags BEFORE overlaps() in the shooting loop?"
    options: ["It is just style","Overlaps would crash on inactive things","A dead bullet or enemy would otherwise still score points","Inactive things are not rectangles"]
    answer: 2
    explain: "Skipping inactive things also means a bullet that hit once can not hit a second enemy."
---
This is the capstone: a small space shooter that uses almost everything from the track. You have a ship, bullets, falling enemies, a score and three lives. The work is about **organizing** a bigger program so it stays readable.

## Pieces you already know

| Idea | From | Used here for |
|---|---|---|
| structs | lesson 4 | the `Thing` that is a ship, bullet or enemy |
| arrays of objects | lesson 5 | pools of bullets and enemies |
| overlap test | lesson 6 | bullet hits enemy, enemy hits ship |
| key_down / key_pressed | lessons 2 and 3 | steering and firing |
| step every N frames | Snake | a new enemy every 30 frames |
| velocity | Pong | bullets up by 8, enemies down by 2 |

## One struct for everything

Ships, bullets and enemies are all rectangles that might be on screen or not. One struct covers them:

```c
typedef struct { int x, y, w, h, active; } Thing;
```

`active` is the **alive** flag from the Breakout lesson. Setting it to 0 removes the thing from the game without moving anything in memory.

## A pool of slots

Bullets come and go. Instead of allocating memory, we keep a fixed **pool**: an array of `MAX_BULLETS` things, mostly inactive. To fire, we claim the first free slot:

```c
static void spawn(Thing *list, int n, int x, int y, int w, int h) {
    for (int i = 0; i < n; i++) {
        if (!list[i].active) { list[i] = (Thing){x, y, w, h, 1}; return; }
    }
}
```

If every slot is busy the call does nothing. That gives a free game rule: at most 4 bullets in the air, so you can not just hold fire. `(Thing){x, y, w, h, 1}` is a **compound literal**: a temporary struct built on the spot and copied into the slot.

## Bundling the state in a Game struct

A bigger game has many variables that belong together. Packing them into one struct lets us pass a single pointer to a function:

```c
typedef struct {
    Thing player, bullets[MAX_BULLETS], enemies[MAX_ENEMIES];
    int score, lives, lane;
} Game;

static void step(Game *g) { ... g->score += 10; ... }
```

`main` stays tiny: `if (g.lives > 0) step(&g);` then draw. Splitting the **update** from the **draw** is the habit that keeps real games manageable. When the lives are gone, the world just stops updating, and the screen shows GAME OVER.

## Deterministic "random" enemies

No `rand()` here, because a recording must replay identically. Enemies appear at `LANES[lane++ % NUM_LANES]`, a fixed list of x positions that repeats. The `%` makes the index wrap back to 0 after the last lane. A game that looks random but is a repeating table is called **scripted** or **pseudo-random**, and it is also how you test a game.

## Two loops of collision

The core rules are two short loops:

- **Shooting:** for every active bullet and every active enemy, if they overlap, switch both off and add 10 points. Two nested loops compare every pair. With 4 bullets and 8 enemies that is only 32 comparisons per frame.
- **Damage:** every active enemy that overlaps the ship, or has fallen below the screen (`y > SCREEN_H`), is switched off and costs one life. Letting an enemy escape hurts as much as being hit.

Notice the check order inside the double loop: `bullets[b].active && enemies[e].active && overlaps(...)`. After a bullet hits, it is inactive, so it can not also destroy a second enemy in the same frame.

> **Watch out:**
> - Using a pointer into an array (`Thing *en = &g->enemies[e]`) and then forgetting `->`: `request for member 'active' in something not a structure or union`.
> - Forgetting `active` in the damage test: dead enemies keep taking lives while they sit at the bottom.
> - Scoring on the `!active` side by mistake: points grow by 10 every frame for every dead enemy.
> - Spawning enemies at `y = 0` makes them pop into view. Start them just above the screen (`y = -16`) so they slide in.

## Going further

Make enemies faster after every 5 kills, add a second enemy type worth 30 points, or draw the lives as small ships.

> **Your turn:** in `step`, add (1) the shooting loops: every active bullet that overlaps an active enemy switches both off and adds 10 to `g->score`; (2) the damage loop: an active enemy that overlaps `g->player` or has `y > SCREEN_H` becomes inactive and costs one life (`g->lives--`). With the given keys the program should print `score: 110, lives: 2`.
