---
title: "Space invaders: a formation, bullets and a cooldown"
summary: Move a whole formation of aliens together, fire bullets with a cooldown, remove what gets hit and decide who wins.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      COLS, ROWS = 6, 2
      aliens = [[40 + c * 36, 30 + r * 24] for r in range(ROWS) for c in range(COLS)]   # each alien is [x, y]
      fdir = 1                       # formation direction: 1 = right, -1 = left
      px = 148.0                     # the player ship is 24 wide, at y = 210
      bullets = []                   # each bullet is [x, y]
      cooldown = 0.0                 # seconds until the next shot is allowed
      score = 0
      state = "playing"

      def update(dt):
          global px, fdir, cooldown, bullets, score, state
          if state != "playing":
              return
          if game.key_down("left"):
              px = max(0, px - 180 * dt)
          if game.key_down("right"):
              px = min(game.WIDTH - 24, px + 180 * dt)

          # 1. Fire: while space is held and cooldown is 0 or less, append a bullet
          # [px + 10, 205] and set cooldown to 0.35. Always count cooldown down by dt.

          # 2. Formation: move every alien sideways by fdir * 40 * dt. When the
          # formation reaches an edge (an alien x above 296 while fdir is 1, or below 4
          # while fdir is -1), flip fdir and drop every alien 12 pixels (y + 12).

          # 3. Bullets: move each bullet up by 260 * dt. If it is inside an alien
          # (aliens are 20 x 14), remove that alien, add 1 to score and drop the bullet
          # (break out of the alien loop right after the remove). Keep the bullets that
          # hit nothing and are still on screen (y > -10) in a new list.

          # 4. Win and lose: no aliens left means state "won". If any alien's bottom
          # (y + 14) reaches 205, the state is "lost".

      def draw():
          game.clear(game.DARK)
          for a in aliens:
              game.rect(a[0], a[1], 20, 14, game.GREEN)
              game.rect(a[0] + 4, a[1] + 4, 4, 4, game.DARK)
              game.rect(a[0] + 12, a[1] + 4, 4, 4, game.DARK)
          for b in bullets:
              game.rect(b[0], b[1], 4, 10, game.YELLOW)
          game.rect(px, 210, 24, 14, game.CYAN)
          game.text(8, 6, "Score " + str(score), game.WHITE, 14)
          if state != "playing":
              game.text(90, 110, state.upper(), game.YELLOW, 28)

      game.run(update, draw)
check:
  game:
    frames: 1500
    keys:
      - { key: space, from: 0, to: 1500 }
      - { key: left, from: 0, to: 30 }
      - { key: right, from: 150, to: 210 }
    expect: "state == 'won' and score == 12 and len(aliens) == 0"
    message: "The check holds space the whole time (so your cooldown must make it fire again and again), steers left, then right, and expects every one of the 12 aliens to be shot before they reach the ground: state 'won', score 12."
  code:
    - { pattern: 'cooldown\s*=\s*0\.35', message: "After a shot set cooldown = 0.35 so the ship can fire about three times a second." }
    - { pattern: 'aliens\.remove\(', message: "Remove a hit alien with aliens.remove(a)." }
    - { pattern: 'break', message: "Use break right after removing an alien, so the loop does not continue over a changed list." }
    - { pattern: 'fdir\s*=\s*-\s*fdir', message: "Reverse the formation with fdir = -fdir at the edge." }
hints:
  - "Four jobs: fire (key_down plus a cooldown number counting down), formation (every alien moves by the same amount, and at an edge they all drop and turn around), bullets (nested loops bullet vs alien) and the end states."
  - "Reverse only when the formation is moving toward the edge it has reached: (fdir == 1 and max(xs) > 296) or (fdir == -1 and min(xs) < 4). Without that, the formation would flip back and forth on the very next frame. For a hit: remove the alien, add a point, mark the bullet as used, and break out of the alien loop."
  - "cooldown = cooldown - dt  /  if game.key_down('space') and cooldown <= 0: bullets.append([px + 10, 205]); cooldown = 0.35  /  for a in aliens: a[0] = a[0] + fdir * 40 * dt  /  if a[0] < b[0] < a[0] + 20 and a[1] < b[1] < a[1] + 14: aliens.remove(a); score = score + 1; hit = True; break  /  if len(aliens) == 0: state = 'won'  /  if a[1] + 14 >= 205: state = 'lost'"
solution:
  - name: main.py
    code: |
      import game

      COLS, ROWS = 6, 2
      aliens = [[40 + c * 36, 30 + r * 24] for r in range(ROWS) for c in range(COLS)]   # each alien is [x, y]
      fdir = 1                       # formation direction: 1 = right, -1 = left
      px = 148.0                     # the player ship is 24 wide, at y = 210
      bullets = []                   # each bullet is [x, y]
      cooldown = 0.0                 # seconds until the next shot is allowed
      score = 0
      state = "playing"

      def update(dt):
          global px, fdir, cooldown, bullets, score, state
          if state != "playing":
              return
          if game.key_down("left"):
              px = max(0, px - 180 * dt)
          if game.key_down("right"):
              px = min(game.WIDTH - 24, px + 180 * dt)

          # 1. Fire: while space is held and cooldown is 0 or less, append a bullet
          # [px + 10, 205] and set cooldown to 0.35. Always count cooldown down by dt.
          cooldown = cooldown - dt
          if game.key_down("space") and cooldown <= 0:
              bullets.append([px + 10, 205])
              cooldown = 0.35

          # 2. Formation: move every alien sideways by fdir * 40 * dt. When the
          # formation reaches an edge (an alien x above 296 while fdir is 1, or below 4
          # while fdir is -1), flip fdir and drop every alien 12 pixels (y + 12).
          for a in aliens:
              a[0] = a[0] + fdir * 40 * dt
          xs = [a[0] for a in aliens]
          if xs and ((fdir == 1 and max(xs) > 296) or (fdir == -1 and min(xs) < 4)):
              fdir = -fdir
              for a in aliens:
                  a[1] = a[1] + 12

          # 3. Bullets: move each bullet up by 260 * dt. If it is inside an alien
          # (aliens are 20 x 14), remove that alien, add 1 to score and drop the bullet
          # (break out of the alien loop right after the remove). Keep the bullets that
          # hit nothing and are still on screen (y > -10) in a new list.
          alive = []
          for b in bullets:
              b[1] = b[1] - 260 * dt
              hit = False
              for a in aliens:
                  if a[0] < b[0] < a[0] + 20 and a[1] < b[1] < a[1] + 14:
                      aliens.remove(a)
                      score = score + 1
                      hit = True
                      break
              if not hit and b[1] > -10:
                  alive.append(b)
          bullets = alive

          # 4. Win and lose: no aliens left means state "won". If any alien's bottom
          # (y + 14) reaches 205, the state is "lost".
          if len(aliens) == 0:
              state = "won"
          for a in aliens:
              if a[1] + 14 >= 205:
                  state = "lost"

      def draw():
          game.clear(game.DARK)
          for a in aliens:
              game.rect(a[0], a[1], 20, 14, game.GREEN)
              game.rect(a[0] + 4, a[1] + 4, 4, 4, game.DARK)
              game.rect(a[0] + 12, a[1] + 4, 4, 4, game.DARK)
          for b in bullets:
              game.rect(b[0], b[1], 4, 10, game.YELLOW)
          game.rect(px, 210, 24, 14, game.CYAN)
          game.text(8, 6, "Score " + str(score), game.WHITE, 14)
          if state != "playing":
              game.text(90, 110, state.upper(), game.YELLOW, 28)

      game.run(update, draw)
quiz:
  - q: "What is a cooldown for?"
    options: ["It stops the game from overheating", "It limits how often the player can fire, so holding space does not create 60 bullets a second", "It makes bullets faster"]
    answer: 1
  - q: "Why is break used right after aliens.remove(a) inside the loop over aliens?"
    options: ["Removing from a list that a for loop is walking over makes the loop skip items, and a bullet should only hit one alien", "break makes the alien explode", "It is required by Python"]
    answer: 0
  - q: "What would happen if the formation reversed whenever any alien was beyond an edge, without checking the direction?"
    options: ["Nothing, it works the same", "The aliens would get faster", "On the next frame the aliens are still beyond the edge, so it reverses again and the formation jitters stuck at the wall"]
    answer: 2
  - q: "How does the code move all 12 aliens as one formation?"
    options: ["Every alien has its own speed", "One shared direction number fdir is applied to every alien in a loop", "The screen scrolls"]
    answer: 1
---
Space Invaders-style games look complicated (rows of enemies, bullets everywhere) but they are built from three simple patterns you already know: a **list** of things, a **loop** that updates each of them, and **rules** for removing them. The new ideas here are moving a group together as one **formation**, and the **cooldown**, a small timer that limits how fast you can fire.

## A formation is a list with a shared direction

Each alien is a small `[x, y]` list and all of them live in one list `aliens`, created with a **list comprehension** (a loop written inside the brackets):

```python
aliens = [[40 + c * 36, 30 + r * 24] for r in range(ROWS) for c in range(COLS)]
```

Read it from the right: for every row `r` and every column `c`, make an alien at 36 pixels apart horizontally and 24 pixels apart vertically. That is 12 aliens for 2 rows and 6 columns.

The whole formation shares one direction, `fdir` (1 for right, -1 for left). Moving is a loop: `a[0] = a[0] + fdir * 40 * dt` for each alien, so they slide together at 40 pixels per second.

The trick is the edge. When the furthest alien reaches a wall, we flip `fdir` and drop all aliens down by 12 pixels. To find the furthest alien, collect the x values with a comprehension (`xs = [a[0] for a in aliens]`) and use `max(xs)` or `min(xs)`. Notice the **direction check**: we only reverse at the right edge when moving right (`fdir == 1 and max(xs) > 296`). If you ignore the direction, then right after turning around, the aliens are still beyond the edge for a frame, so the code would reverse again, and again: the formation would jitter in the wall forever. Whenever you flip something on a condition, ask yourself "will the condition still be true on the next frame?".

## Firing with a cooldown

If you fired a bullet on every frame while the space bar is held, you would shoot 60 bullets a second. A cooldown fixes that. It is a number of seconds that counts down; you may only fire when it has reached zero, and each shot sets it back up:

```python
cooldown = cooldown - dt
if game.key_down("space") and cooldown <= 0:
    bullets.append([px + 10, 205])
    cooldown = 0.35
```

Compared with `key_pressed` (one bullet per tap), this gives the "hold to keep shooting" feel and still controls the rate. The same pattern limits any ability in a game: dash, shield, spawn.

## Bullets against aliens

Every bullet has to be tested against every alien, which means a loop inside a loop. When a bullet is inside an alien's rectangle, a chained comparison reads naturally: `a[0] < b[0] < a[0] + 20`. On a hit, the alien is removed, the score goes up, and the bullet must disappear too, which we do by simply not copying it into the `alive` list.

The important line is `break`. After `aliens.remove(a)` the list has changed while the `for a in aliens` loop is still walking over it, and Python would skip an alien. A bullet can only kill one alien anyway, so we leave the loop immediately.

## Winning and losing

When the list is empty the player wins: `len(aliens) == 0`. If an alien's bottom edge reaches the player's row, it has landed and the player loses. Both end states freeze the game with `if state != "playing": return`, as in the previous lessons.

> **Watch out:** `ValueError: list.remove(x): x not in list` appears when the same alien is removed twice, for example when two bullets hit it in one frame. The `break` and the `hit` flag prevent most of those cases.
>
> **Watch out:** `TypeError: 'int' object is not subscriptable`: `a[0]` needs `a` to be an `[x, y]` list. Check that the loop variable is the alien and not a number.
>
> **Watch out:** `UnboundLocalError ... 'bullets'`: the line `bullets = alive` assigns a new list, so `bullets` must be on the `global` line.
>
> **Watch out:** if bullets seem to pass through the aliens, the check uses the bullet's top-left point, which moves 4 pixels a frame. Aliens that are 14 pixels tall are fine, a 2 pixel tall enemy would not be.

## Going further

Give the aliens bombs that fall at random, add three lives, make the formation speed up as it shrinks (`40 + (12 - len(aliens)) * 4`), or add a barrier made of small blocks that bullets erase.

> **Your turn:** complete the four TODO blocks. You can play it yourself with the arrow keys and space. The check holds space for 25 seconds, steers left and right, and expects all 12 aliens to be destroyed (state `"won"`, score 12).
