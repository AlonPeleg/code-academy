---
title: "Flappy runner: gravity, flaps and scrolling pipes"
summary: Add gravity and a flap impulse, scroll pipes toward the player, count the ones you pass and die when you touch anything.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      BX, R = 60, 8                  # the bird: fixed x, radius 8
      PIPE_W, GAP = 40, 90           # pipe width and the height of the opening
      GAPS = [100, 140, 80, 120]     # y of the gap center for each new pipe, in order

      by = 110.0                     # bird height
      vy = 0.0                       # bird vertical speed (pixels per second, down is positive)
      pipes = [[110, 100, False], [200, 200, False]]   # each pipe is [x, gap_y, already_scored]
      spawned = 2
      timer = 0.0
      score = 0
      state = "playing"

      def hits_pipe(p):
          inside_x = BX + R > p[0] and BX - R < p[0] + PIPE_W
          outside_gap = by - R < p[1] - GAP / 2 or by + R > p[1] + GAP / 2
          return inside_x and outside_gap

      def update(dt):
          global by, vy, pipes, spawned, timer, score, state
          if state != "playing":
              return
          # 1. Gravity and flap: vy grows by 500 * dt every frame and the bird moves
          # by vy * dt. When space or up is pressed (key_pressed), set vy = -200 (a flap).

          # 2. New pipes: add dt to timer. Every 1.4 seconds reset the timer and
          # append [320, GAPS[spawned % len(GAPS)], False], then add 1 to spawned.

          # 3. Scrolling: move every pipe left by 110 * dt. When a pipe's right edge
          # (x + PIPE_W) is left of the bird (BX - R) and it is not scored yet, mark it
          # scored and add 1 to score. Keep only pipes whose right edge is still on screen.

          # 4. Death: the state becomes "dead" when the bird touches the ground
          # (by + R >= HEIGHT), leaves the top (by - R < 0) or hits_pipe(p) for any pipe.

      def draw():
          game.clear(game.CYAN)
          for p in pipes:
              top = p[1] - GAP / 2
              game.rect(p[0], 0, PIPE_W, top, game.GREEN)
              game.rect(p[0], p[1] + GAP / 2, PIPE_W, game.HEIGHT, game.GREEN)
          game.circle(BX, by, R, game.YELLOW)
          game.text(10, 8, str(score), game.WHITE, 28)
          if state == "dead":
              game.text(80, 100, "GAME OVER", game.RED, 28)

      game.run(update, draw)
check:
  game:
    frames: 120
    keys:
      - { key: space, from: 0, to: 2 }
      - { key: up, from: 50, to: 52 }
    expect: "state == 'dead' and score == 1 and by < 200"
    message: "The check flaps with space at the start, which carries the bird through the gap of the first pipe (score 1), and flaps again with up at frame 50, which sends it into the second pipe: the state must be 'dead' and the bird must NOT have reached the ground (by < 200)."
  code:
    - { pattern: 'key_pressed\(\s*["'']space["'']\s*\)', message: "Flap with game.key_pressed(\"space\") so one press is one flap." }
    - { pattern: 'vy\s*=\s*-\s*200', message: "A flap sets the vertical speed to -200 (up is negative)." }
    - { pattern: 'score\s*(\+=|=\s*score\s*\+)\s*1', message: "Add 1 to score for each pipe the bird passes." }
    - { pattern: 'state\s*=\s*["'']dead["'']', message: "Set state = \"dead\" when the bird crashes." }
hints:
  - "The bird has a vertical speed vy. Gravity adds a little to vy every frame (vy = vy + 500 * dt), then vy moves the bird (by = by + vy * dt). A flap does not move the bird, it just sets vy to a negative number."
  - "The pipes move, not the bird: subtract from every pipe's x. A pipe is passed when its right edge (x + PIPE_W) is left of the bird, and each pipe has a third item (True or False) so it scores only once. Collision uses the helper hits_pipe(p), plus the ground and the ceiling."
  - "vy = vy + 500 * dt / by = by + vy * dt / if game.key_pressed('space') or game.key_pressed('up'): vy = -200  /  timer = timer + dt; if timer >= 1.4: timer = 0; pipes.append([320, GAPS[spawned % len(GAPS)], False]); spawned = spawned + 1  /  p[0] = p[0] - 110 * dt; if not p[2] and p[0] + PIPE_W < BX - R: p[2] = True; score = score + 1  /  if by + R >= game.HEIGHT or by - R < 0: state = 'dead'"
solution:
  - name: main.py
    code: |
      import game

      BX, R = 60, 8                  # the bird: fixed x, radius 8
      PIPE_W, GAP = 40, 90           # pipe width and the height of the opening
      GAPS = [100, 140, 80, 120]     # y of the gap center for each new pipe, in order

      by = 110.0                     # bird height
      vy = 0.0                       # bird vertical speed (pixels per second, down is positive)
      pipes = [[110, 100, False], [200, 200, False]]   # each pipe is [x, gap_y, already_scored]
      spawned = 2
      timer = 0.0
      score = 0
      state = "playing"

      def hits_pipe(p):
          inside_x = BX + R > p[0] and BX - R < p[0] + PIPE_W
          outside_gap = by - R < p[1] - GAP / 2 or by + R > p[1] + GAP / 2
          return inside_x and outside_gap

      def update(dt):
          global by, vy, pipes, spawned, timer, score, state
          if state != "playing":
              return
          # 1. Gravity and flap: vy grows by 500 * dt every frame and the bird moves
          # by vy * dt. When space or up is pressed (key_pressed), set vy = -200 (a flap).
          vy = vy + 500 * dt
          by = by + vy * dt
          if game.key_pressed("space") or game.key_pressed("up"):
              vy = -200

          # 2. New pipes: add dt to timer. Every 1.4 seconds reset the timer and
          # append [320, GAPS[spawned % len(GAPS)], False], then add 1 to spawned.
          timer = timer + dt
          if timer >= 1.4:
              timer = 0
              pipes.append([320, GAPS[spawned % len(GAPS)], False])
              spawned = spawned + 1

          # 3. Scrolling: move every pipe left by 110 * dt. When a pipe's right edge
          # (x + PIPE_W) is left of the bird (BX - R) and it is not scored yet, mark it
          # scored and add 1 to score. Keep only pipes whose right edge is still on screen.
          for p in pipes:
              p[0] = p[0] - 110 * dt
              if not p[2] and p[0] + PIPE_W < BX - R:
                  p[2] = True
                  score = score + 1
          pipes = [p for p in pipes if p[0] + PIPE_W > 0]

          # 4. Death: the state becomes "dead" when the bird touches the ground
          # (by + R >= HEIGHT), leaves the top (by - R < 0) or hits_pipe(p) for any pipe.
          if by + R >= game.HEIGHT or by - R < 0:
              state = "dead"
          for p in pipes:
              if hits_pipe(p):
                  state = "dead"

      def draw():
          game.clear(game.CYAN)
          for p in pipes:
              top = p[1] - GAP / 2
              game.rect(p[0], 0, PIPE_W, top, game.GREEN)
              game.rect(p[0], p[1] + GAP / 2, PIPE_W, game.HEIGHT, game.GREEN)
          game.circle(BX, by, R, game.YELLOW)
          game.text(10, 8, str(score), game.WHITE, 28)
          if state == "dead":
              game.text(80, 100, "GAME OVER", game.RED, 28)

      game.run(update, draw)
quiz:
  - q: "In this game, which direction is positive y?"
    options: ["Up", "Down, because y counts from the top of the screen", "Left"]
    answer: 1
    explain: "That is why gravity adds to vy, and a flap uses a negative number."
  - q: "What is the difference between gravity and a flap?"
    options: ["Gravity changes the speed a little every frame (acceleration); a flap sets the speed in one go (an impulse)", "They are the same thing", "Gravity moves pipes, a flap moves the bird"]
    answer: 0
  - q: "Why does each pipe carry a True/False item (already scored)?"
    options: ["To make the pipe green", "To remember the gap height", "So the pipe is only counted once, instead of on every frame after the bird has passed it"]
    answer: 2
  - q: "Which line removes pipes that have left the screen?"
    options: ["pipes.clear()", "pipes = [p for p in pipes if p[0] + PIPE_W > 0]", "pipes.append(0)"]
    answer: 1
---
Flappy-style games are a gift for learning, because the whole game is a single idea: **physics**. A character with a position and a speed, a force pulling it down, and an impulse pushing it up. Add scrolling obstacles, a score and a game over and you have a classic. In this lesson you will meet gravity, learn why *the world moves and the hero stays still*, and use a "scored" flag so that every pipe counts once.

## Speed and gravity

Remember that on the screen **y grows downward**. The bird has a position `by` and a vertical speed `vy` in pixels per second. Positive `vy` means falling, negative means rising.

Gravity is not a movement, it is a change of *speed*. Every frame we add a little to `vy` (this is called **acceleration**) and then move the bird by the speed:

```python
vy = vy + 500 * dt      # gravity: speed grows 500 pixels per second, every second
by = by + vy * dt       # the speed moves the bird
```

Both lines use `dt`, so the physics are the same on a slow or a fast computer. The 500 is how strong gravity is. Bigger numbers make a heavier, snappier bird.

A **flap** is an **impulse**: we do not add to the bird's position, we simply overwrite the speed with a strong upward value, `vy = -200`. From then on, gravity slowly eats that speed until the bird stops rising and starts to fall: a nice curved arc for free. Use `key_pressed` (one flap per tap) rather than `key_down`, otherwise holding the key would keep the bird glued to the ceiling.

## The world moves, the bird stays

The bird never moves left or right. Instead, the pipes slide toward it: `p[0] = p[0] - 110 * dt`. This is how most side scrollers work: the camera follows the hero, which is the same as keeping the hero still and moving the world. It keeps the code tiny, and the bird's x is a constant `BX`.

Each pipe is a list `[x, gap_y, scored]`. `gap_y` is the height of the middle of the opening, and the opening is `GAP` pixels tall. A timer (same pattern as the Dodge lesson) adds a new pipe on the right edge every 1.4 seconds, with gap heights taken from the list `GAPS` so the game is predictable.

## Counting and cleaning up

When the pipe's right edge `p[0] + PIPE_W` is to the left of the bird, the bird has passed it. We need to count it **once**, and that is the job of the third item: `if not p[2] and ...` then set `p[2] = True`. Without that flag the condition stays true on every following frame and the score shoots up by 60 per second.

Pipes that have fully left the screen are removed with a **list comprehension** that keeps the interesting ones:

```python
pipes = [p for p in pipes if p[0] + PIPE_W > 0]
```

It reads "make a new list of every p in pipes, but only if the pipe's right edge is still on the screen". It is the same idea as the `alive` lists in earlier lessons, written in one line.

## Crashing

The bird dies when it touches the ground (`by + R >= game.HEIGHT`), leaves through the top (`by - R < 0`), or hits a pipe. The pipe test `hits_pipe(p)` is written for you: the bird overlaps the pipe horizontally *and* is outside the gap vertically (above the top of the gap or below its bottom). When you get this kind of "inside the x range and outside the y range" test, drawing it on paper helps.

> **Watch out:** a bird that flies off the top and never comes back: the flap probably *adds* to `vy` on every frame, or you used `key_down`. A flap should set `vy = -200` once.
>
> **Watch out:** a bird that falls upward means gravity has the wrong sign. In Python game coordinates down is positive.
>
> **Watch out:** `UnboundLocalError: cannot access local variable 'pipes' where it is not associated with a value`: you assign `pipes = [...]`, so `pipes` must be on the `global` line (you can still call `pipes.append(...)` without it).
>
> **Watch out:** the score jumps by many points at once: you forgot the scored flag (`not p[2]`), so the same pipe is counted again every frame.

## Going further

Use `random.randint(70, 170)` for the gap height, make the gap smaller as the score grows, add a best score that survives restarts, or animate the bird by tilting it according to `vy`.

> **Your turn:** write the four TODO blocks and then play: flap with space or up. The check flaps once at the start so that the bird passes the first pipe (score 1) and flaps again to fly into the second pipe, which must end the game with the bird still in the air.
