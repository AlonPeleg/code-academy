---
title: "Capstone: a three-game arcade with menu, high scores and particles"
summary: Finish a small arcade cabinet - a menu state machine, a high score per game and a particle system - and test it through its state variables.
level: advanced
runner: pygame
files:
  - name: main.py
    code: |
      import game
      import math

      GAMES = ["Tap", "Catch", "Dodge"]
      XS = [40, 250, 150, 200, 70, 280, 160]       # where falling things appear, in order

      mode = "menu"                  # the state machine: "menu", "play" or "over"
      sel = 0                        # highlighted menu entry
      cur = ""                       # name of the game being played
      score = 0
      clock = 0.0                    # seconds since this round started
      px = 148.0                     # player x for Catch and Dodge
      items = []                     # falling things: [x, y]
      spawn_t = 0.0
      spawned = 0
      particles = []                 # sparks: [x, y, vx, vy, life]
      best = {"Tap": 0, "Catch": 0, "Dodge": 0}

      def burst(x, y, n):
          # 1. Particles, part 1: append n sparks [x, y, vx, vy, 0.6] to particles.
          # Spark number i flies at angle a = i * 6.2832 / n:
          # vx = math.cos(a) * 90 and vy = math.sin(a) * 90.
          pass

      def update_particles(dt):
          global particles
          # 2. Particles, part 2: move every spark by (vx * dt, vy * dt), take dt off
          # its life (index 4), then keep only the sparks with life above 0.
          pass

      def start(name):
          global mode, cur, score, clock, px, items, spawn_t, spawned
          mode, cur, score, clock, px, items, spawn_t, spawned = "play", name, 0, 0.0, 148.0, [], 0.0, 0

      def finish():
          global mode
          # 3. High score: best[cur] becomes the bigger of itself and score, the mode
          # becomes "over", and burst(160, 120, 24) celebrates.
          pass

      def play(dt):
          global clock, score, px, items, spawn_t, spawned
          clock = clock + dt
          if cur == "Tap":                           # mash space for 5 seconds
              if game.key_pressed("space"):
                  score = score + 1
                  burst(160, 120, 6)
              if clock >= 5:
                  finish()
              return
          if game.key_down("left"):
              px = max(0, px - 200 * dt)
          if game.key_down("right"):
              px = min(296, px + 200 * dt)
          if cur == "Dodge":
              score = int(clock)                     # points = seconds survived
          spawn_t = spawn_t + dt
          if spawn_t >= 0.6:
              spawn_t = 0
              items.append([XS[spawned % len(XS)], -16])
              spawned = spawned + 1
          alive = []
          for it in items:
              it[1] = it[1] + 150 * dt
              touch = px < it[0] + 16 and px + 24 > it[0] and it[1] + 16 > 200 and it[1] < 224
              if touch and cur == "Catch":
                  score = score + 1
                  burst(it[0] + 8, it[1], 8)
              elif touch:
                  finish()                           # Dodge: a hit ends the round
              elif it[1] > game.HEIGHT:
                  if cur == "Catch":
                      finish()                       # Catch: a miss ends the round
              else:
                  alive.append(it)
          items = alive

      def update(dt):
          global mode, sel
          update_particles(dt)
          if mode == "menu":
              # 4. Menu: up and down (key_pressed) change sel by -1 or +1 and wrap
              # around with % len(GAMES). Enter calls start(GAMES[sel]).
              pass
          elif mode == "play":
              play(dt)
          elif game.key_pressed("x"):
              mode = "menu"                          # mode "over": x goes back

      def draw():
          game.clear(game.DARK)
          if mode == "menu":
              game.text(100, 20, "ARCADE", game.YELLOW, 28)
              for i, name in enumerate(GAMES):
                  label = ("> " if i == sel else "  ") + name + "   best " + str(best[name])
                  game.text(80, 80 + i * 36, label, game.CYAN if i == sel else game.GRAY, 16)
          else:
              game.text(8, 6, cur + "   score " + str(score), game.WHITE, 14)
              if cur != "Tap":
                  game.rect(px, 200, 24, 24, game.GREEN)
              for it in items:
                  game.rect(it[0], it[1], 16, 16, game.RED if cur == "Dodge" else game.YELLOW)
              if mode == "over":
                  game.text(60, 100, "ROUND OVER - press x", game.WHITE, 16)
          for p in particles:
              game.circle(p[0], p[1], 2, game.ORANGE)

      game.run(update, draw)
check:
  game:
    frames: 420
    keys:
      - { key: up, from: 0, to: 2 }
      - { key: enter, from: 5, to: 7 }
      - { key: x, from: 400, to: 402 }
    expect: >-
      mode == 'menu' and sel == 2 and cur == 'Dodge'
      and best['Dodge'] >= 3 and best['Tap'] == 0 and best['Catch'] == 0
      and (particles.clear(), burst(100, 100, 8), len(particles) == 8 and particles[0][0] == 100)[2]
      and (update_particles(0.3), len(particles) == 8 and particles[0][0] > 100)[1]
      and (update_particles(1.0), len(particles) == 0)[1]
    message: "The check presses up in the menu (the highlight must wrap around from Tap to the last entry, Dodge), starts it with enter, stands still until a block hits the player (the round ends and best['Dodge'] must be at least 3), and presses x to return to the menu. It also calls burst and update_particles directly: 8 sparks that move with time and disappear when their life runs out."
  code:
    - { pattern: '%\s*len\(\s*GAMES\s*\)', message: "Wrap the menu selection around with % len(GAMES)." }
    - { pattern: 'best\[cur\]\s*=\s*max\(', message: "Update the high score with best[cur] = max(best[cur], score)." }
    - { pattern: 'math\.cos\(', message: "Spread the sparks in a circle with math.cos(a) and math.sin(a)." }
    - { pattern: 'start\(\s*GAMES\[sel\]\s*\)', message: "Enter starts the highlighted game: start(GAMES[sel])." }
hints:
  - "Four small pieces fill a finished machine. Menu: sel moves by one and wraps with the % operator. High score: remember the best with max(). Particles: a list of sparks that each have a position, a velocity and a life that runs down; remove the dead ones."
  - "Spark number i of n flies at angle a = i * 6.2832 / n (a full circle is about 6.2832 radians), with vx = math.cos(a) * 90 and vy = math.sin(a) * 90. Each frame: add velocity times dt to the position, subtract dt from life (index 4), then rebuild the list keeping life above 0."
  - "burst: for i in range(n): a = i * 6.2832 / n; particles.append([x, y, math.cos(a) * 90, math.sin(a) * 90, 0.6])  /  update_particles: for p in particles: p[0] = p[0] + p[2] * dt; p[1] = p[1] + p[3] * dt; p[4] = p[4] - dt  then  particles = [p for p in particles if p[4] > 0]  /  finish: best[cur] = max(best[cur], score); mode = 'over'; burst(160, 120, 24)  /  menu: sel = (sel - 1) % len(GAMES) ... start(GAMES[sel])"
solution:
  - name: main.py
    code: |
      import game
      import math

      GAMES = ["Tap", "Catch", "Dodge"]
      XS = [40, 250, 150, 200, 70, 280, 160]       # where falling things appear, in order

      mode = "menu"                  # the state machine: "menu", "play" or "over"
      sel = 0                        # highlighted menu entry
      cur = ""                       # name of the game being played
      score = 0
      clock = 0.0                    # seconds since this round started
      px = 148.0                     # player x for Catch and Dodge
      items = []                     # falling things: [x, y]
      spawn_t = 0.0
      spawned = 0
      particles = []                 # sparks: [x, y, vx, vy, life]
      best = {"Tap": 0, "Catch": 0, "Dodge": 0}

      def burst(x, y, n):
          # 1. Particles, part 1: append n sparks [x, y, vx, vy, 0.6] to particles.
          # Spark number i flies at angle a = i * 6.2832 / n:
          # vx = math.cos(a) * 90 and vy = math.sin(a) * 90.
          for i in range(n):
              a = i * 6.2832 / n
              particles.append([x, y, math.cos(a) * 90, math.sin(a) * 90, 0.6])

      def update_particles(dt):
          global particles
          # 2. Particles, part 2: move every spark by (vx * dt, vy * dt), take dt off
          # its life (index 4), then keep only the sparks with life above 0.
          for p in particles:
              p[0] = p[0] + p[2] * dt
              p[1] = p[1] + p[3] * dt
              p[4] = p[4] - dt
          particles = [p for p in particles if p[4] > 0]

      def start(name):
          global mode, cur, score, clock, px, items, spawn_t, spawned
          mode, cur, score, clock, px, items, spawn_t, spawned = "play", name, 0, 0.0, 148.0, [], 0.0, 0

      def finish():
          global mode
          # 3. High score: best[cur] becomes the bigger of itself and score, the mode
          # becomes "over", and burst(160, 120, 24) celebrates.
          best[cur] = max(best[cur], score)
          mode = "over"
          burst(160, 120, 24)

      def play(dt):
          global clock, score, px, items, spawn_t, spawned
          clock = clock + dt
          if cur == "Tap":                           # mash space for 5 seconds
              if game.key_pressed("space"):
                  score = score + 1
                  burst(160, 120, 6)
              if clock >= 5:
                  finish()
              return
          if game.key_down("left"):
              px = max(0, px - 200 * dt)
          if game.key_down("right"):
              px = min(296, px + 200 * dt)
          if cur == "Dodge":
              score = int(clock)                     # points = seconds survived
          spawn_t = spawn_t + dt
          if spawn_t >= 0.6:
              spawn_t = 0
              items.append([XS[spawned % len(XS)], -16])
              spawned = spawned + 1
          alive = []
          for it in items:
              it[1] = it[1] + 150 * dt
              touch = px < it[0] + 16 and px + 24 > it[0] and it[1] + 16 > 200 and it[1] < 224
              if touch and cur == "Catch":
                  score = score + 1
                  burst(it[0] + 8, it[1], 8)
              elif touch:
                  finish()                           # Dodge: a hit ends the round
              elif it[1] > game.HEIGHT:
                  if cur == "Catch":
                      finish()                       # Catch: a miss ends the round
              else:
                  alive.append(it)
          items = alive

      def update(dt):
          global mode, sel
          update_particles(dt)
          if mode == "menu":
              # 4. Menu: up and down (key_pressed) change sel by -1 or +1 and wrap
              # around with % len(GAMES). Enter calls start(GAMES[sel]).
              if game.key_pressed("up"):
                  sel = (sel - 1) % len(GAMES)
              if game.key_pressed("down"):
                  sel = (sel + 1) % len(GAMES)
              if game.key_pressed("enter"):
                  start(GAMES[sel])
          elif mode == "play":
              play(dt)
          elif game.key_pressed("x"):
              mode = "menu"                          # mode "over": x goes back

      def draw():
          game.clear(game.DARK)
          if mode == "menu":
              game.text(100, 20, "ARCADE", game.YELLOW, 28)
              for i, name in enumerate(GAMES):
                  label = ("> " if i == sel else "  ") + name + "   best " + str(best[name])
                  game.text(80, 80 + i * 36, label, game.CYAN if i == sel else game.GRAY, 16)
          else:
              game.text(8, 6, cur + "   score " + str(score), game.WHITE, 14)
              if cur != "Tap":
                  game.rect(px, 200, 24, 24, game.GREEN)
              for it in items:
                  game.rect(it[0], it[1], 16, 16, game.RED if cur == "Dodge" else game.YELLOW)
              if mode == "over":
                  game.text(60, 100, "ROUND OVER - press x", game.WHITE, 16)
          for p in particles:
              game.circle(p[0], p[1], 2, game.ORANGE)

      game.run(update, draw)
quiz:
  - q: "What does the variable mode do in this program?"
    options: ["It stores the volume", "It says which screen the game is on (menu, play or over), so update and draw can behave differently for each", "It counts frames"]
    answer: 1
  - q: "Why is the menu selection computed with (sel - 1) % len(GAMES)?"
    options: ["So the highlight wraps from the first entry to the last one instead of becoming -1", "To make the menu longer", "To slow down the cursor"]
    answer: 0
  - q: "How does a particle disappear?"
    options: ["Python deletes it automatically", "It is drawn in the background color", "Its life runs down by dt every frame, and the list is rebuilt without the sparks whose life is 0 or less"]
    answer: 2
  - q: "Why is best a dictionary like {\"Tap\": 0, \"Catch\": 0, \"Dodge\": 0} and not three separate variables?"
    options: ["Dictionaries run faster", "One piece of code, best[cur], works for every game, and adding a fourth game needs no new variable", "Python allows only dictionaries for scores"]
    answer: 1
---
This is your capstone: a small **arcade cabinet** with a title menu and three tiny games, **Tap** (mash the space bar for 5 seconds), **Catch** (catch the yellow blocks, miss one and the round ends) and **Dodge** (survive as long as you can). Most of the machine is finished and you complete the four most interesting parts: the menu, the high-score table and a particle effect. It is a chance to see how everything you learned fits into one program.

## The state machine

A **state machine** means the program is always in exactly one *state*, stored in a variable, and each state decides what the program does. Here the variable is `mode`:

```
        enter                  round ends
menu ----------> play ----------------------> over
  ^                                              |
  +------------------- press x ------------------+
```

`update` is a small decision tree: `if mode == "menu": ... elif mode == "play": ... elif game.key_pressed("x"): mode = "menu"`. `draw` has the same shape. Whenever you add a screen (a pause, a settings page) you add a new mode, rather than a tangle of `True/False` flags.

## One cabinet, three games

Look at the function `play(dt)`. It is shared by all three games, and the variable `cur` (the name of the current game) selects the rules: Tap counts key presses, Dodge turns time into score, Catch scores on a catch and ends on a miss. The falling-things code is shared by Catch and Dodge and only the outcome of a `touch` differs. This is **reuse**: one loop instead of two copies. Reading a program you did not write is a skill too, so spend a minute with `play` before you start: what do `alive`, `touch` and `spawned % len(XS)` do? (You have met all of them in the Dodge lesson.)

## Part 1 and 2: particles

A **particle system** is one of the cheapest ways to make a game feel alive. Each spark is just a small list `[x, y, vx, vy, life]`, and all sparks live in one list `particles`. Two functions manage them:

* `burst(x, y, n)` creates `n` sparks at one point, flying outward in a circle. Spark `i` gets the angle `a = i * 6.2832 / n` (6.2832 is a full turn in radians), and `math.cos(a)` and `math.sin(a)` turn an angle into a direction, `vx` and `vy`. Multiplying by 90 sets the speed.
* `update_particles(dt)` moves each spark by its velocity times `dt`, lowers its life by `dt`, and then rebuilds the list keeping only the sparks with life left. It is the `alive` pattern again, this time in one list comprehension.

Particles are *data*, so you can test them without watching: the check calls `burst(100, 100, 8)` and expects eight sparks, then `update_particles(0.3)` and expects them to have moved, then `update_particles(1.0)` and expects an empty list because every spark lived only 0.6 seconds.

## Part 3: the high score

`best` is a **dictionary**: a table that maps a key (the game's name) to a value (its best score). `best["Dodge"]` reads one entry, `best[cur] = ...` writes it. Using the key `cur` lets one line serve every game. `finish()` ends a round: it keeps the larger of the old record and this round's score with `max`, switches the mode to `"over"` and fires a big `burst`.

## Part 4: the menu

Up and down change `sel`. The `%` (remainder) operator makes the selection **wrap around**: `(0 - 1) % 3` is 2, so pressing up on the first entry jumps to the last, and `(2 + 1) % 3` is 0. Enter calls `start(GAMES[sel])`, which resets every round variable at once and switches to `"play"`.

> **Watch out:** `KeyError: 'dodge'` means the key you asked for is not in the dictionary: names are case sensitive and must match `GAMES` exactly.
>
> **Watch out:** `UnboundLocalError: cannot access local variable 'particles' where it is not associated with a value`: in `update_particles` you assign a new list, so keep the `global particles` line. (`burst` only appends, so it does not need it.)
>
> **Watch out:** if the sparks never disappear, you forgot to subtract `dt` from the life (item `p[4]`), or you do not rebuild the list. If they fly off in one direction, the angle must change with `i`.
>
> **Watch out:** `NameError: name 'math' is not defined` means a missing `import math` at the top (it is there already).

## Going further

Add a fourth game by adding its name to `GAMES` and a few lines to `play`. Save the high scores for the session in a pause screen, make particles fall with gravity (`p[3] = p[3] + 200 * dt`), shake the screen on a hit, or add a title animation. The fixed list `XS` can become `random.choice`.

> **Your turn:** fill in the four TODO blocks (`burst`, `update_particles`, `finish`, and the menu), then play all three games. The check chooses Dodge with the up key (wrapping around), stands still until a block ends the round, returns to the menu with x, and tests your particle functions directly.
