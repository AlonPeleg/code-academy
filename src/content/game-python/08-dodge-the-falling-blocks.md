---
title: Putting it together - Dodge!
summary: Combine movement, clamping, a list of falling blocks, collisions, lives, score and game over into one finished game.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      PLAYER_Y = 210
      SPAWN_X = [40, 150, 260, 100, 220]   # where the blocks appear, one after another

      px = 148
      blocks = []        # each block is [x, y]
      timer = 0          # seconds since the last block appeared
      spawned = 0        # how many blocks have appeared
      score = 0
      best = 0
      lives = 3
      state = "playing"

      def touching(ax, ay, aw, ah, bx, by, bw, bh):
          return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by

      def restart():
          global px, blocks, timer, spawned, score, lives, state
          px, blocks, timer, spawned = 148, [], 0, 0
          score, lives, state = 0, 3, "playing"

      def update(dt):
          global px, blocks, timer, spawned, score, best, lives, state
          if state == "game over":
              if game.key_pressed("enter"):
                  restart()
              return
          if game.key_down("left"):
              px = max(0, px - 220 * dt)
          if game.key_down("right"):
              px = min(game.WIDTH - 24, px + 220 * dt)

          # TODO 1: add dt to timer. When timer reaches 0.5, set it back to 0 and
          #         append [SPAWN_X[spawned % len(SPAWN_X)], -20] to blocks, then add 1 to spawned.

          # TODO 2: make a new list "alive". For every block: move its y down by 150 * dt.
          #         If it touches the player (24 x 24 at px, PLAYER_Y; the block is 20 x 20):
          #             lose a life (and do not keep the block).
          #         Otherwise if its y is past game.HEIGHT: score a point (do not keep it).
          #         Otherwise keep it. At the end, blocks = alive.

          # TODO 3: if lives is 0 or less, the state becomes "game over"
          #         and best becomes the bigger of best and score.


      def draw():
          game.clear(game.DARK)
          game.rect(px, PLAYER_Y, 24, 24, game.GREEN)
          for b in blocks:
              game.rect(b[0], b[1], 20, 20, game.RED)
          game.text(10, 10, "Score " + str(score) + "   Lives " + str(lives), game.WHITE, 14)
          if state == "game over":
              game.text(70, 90, "GAME OVER", game.YELLOW, 28)
              game.text(60, 130, "Best " + str(best) + " - press enter", game.WHITE, 14)

      game.run(update, draw)
check:
  game:
    frames: 520
    keys:
      - { key: enter, from: 500, to: 502 }
    expect: "state == 'playing' and lives == 3 and score == 0 and best >= 8"
    message: "Standing still, the player should be hit three times and reach game over (with a best score of at least 8 dodged blocks), and enter should then start a fresh game."
  code:
    - { pattern: '\.append\(', message: "Use blocks.append(...) to spawn blocks and alive.append(...) to keep them." }
    - { pattern: 'lives\s*(-=|=\s*lives\s*-)\s*1', message: "Take a life when a block touches the player." }
    - { pattern: 'score\s*(\+=|=\s*score\s*\+)\s*1', message: "Add a point for every dodged block." }
    - { pattern: 'state\s*=\s*["'']game over["'']', message: "Set state = \"game over\" when the lives run out." }
    - { pattern: 'best\s*=\s*max\(', message: "Update best with max(best, score)." }
hints:
  - 'Three jobs: spawn (a timer that counts up and resets), handle the blocks (a loop that builds the alive list, just like the bullets), and game over (an if on lives). The rest of the game is already written.'
  - 'Spawn: timer += dt, then if timer >= 0.5 do the reset, append and counter steps. Blocks: for b in blocks: first b[1] += 150 * dt, then if touching(px, PLAYER_Y, 24, 24, b[0], b[1], 20, 20): lives -= 1, elif b[1] > game.HEIGHT: score += 1, else: alive.append(b).'
  - 'After the loop write blocks = alive. Last, if lives <= 0:  state = "game over"  and  best = max(best, score). The spawn block is: timer = timer + dt / if timer >= 0.5: / timer = 0 / blocks.append([SPAWN_X[spawned % len(SPAWN_X)], -20]) / spawned = spawned + 1'
solution:
  - name: main.py
    code: |
      import game

      PLAYER_Y = 210
      SPAWN_X = [40, 150, 260, 100, 220]   # where the blocks appear, one after another

      px = 148
      blocks = []        # each block is [x, y]
      timer = 0          # seconds since the last block appeared
      spawned = 0        # how many blocks have appeared
      score = 0
      best = 0
      lives = 3
      state = "playing"

      def touching(ax, ay, aw, ah, bx, by, bw, bh):
          return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by

      def restart():
          global px, blocks, timer, spawned, score, lives, state
          px, blocks, timer, spawned = 148, [], 0, 0
          score, lives, state = 0, 3, "playing"

      def update(dt):
          global px, blocks, timer, spawned, score, best, lives, state
          if state == "game over":
              if game.key_pressed("enter"):
                  restart()
              return
          if game.key_down("left"):
              px = max(0, px - 220 * dt)
          if game.key_down("right"):
              px = min(game.WIDTH - 24, px + 220 * dt)

          # TODO 1: spawn a block every half second.
          timer = timer + dt
          if timer >= 0.5:
              timer = 0
              blocks.append([SPAWN_X[spawned % len(SPAWN_X)], -20])
              spawned = spawned + 1

          # TODO 2: move the blocks, handle hits and dodges, keep the rest.
          alive = []
          for b in blocks:
              b[1] = b[1] + 150 * dt
              if touching(px, PLAYER_Y, 24, 24, b[0], b[1], 20, 20):
                  lives = lives - 1
              elif b[1] > game.HEIGHT:
                  score = score + 1
              else:
                  alive.append(b)
          blocks = alive

          # TODO 3: game over when the lives run out.
          if lives <= 0:
              state = "game over"
              best = max(best, score)


      def draw():
          game.clear(game.DARK)
          game.rect(px, PLAYER_Y, 24, 24, game.GREEN)
          for b in blocks:
              game.rect(b[0], b[1], 20, 20, game.RED)
          game.text(10, 10, "Score " + str(score) + "   Lives " + str(lives), game.WHITE, 14)
          if state == "game over":
              game.text(70, 90, "GAME OVER", game.YELLOW, 28)
              game.text(60, 130, "Best " + str(best) + " - press enter", game.WHITE, 14)

      game.run(update, draw)
quiz:
  - q: "Which part of this game is the 'state machine'?"
    options: ["The SPAWN_X list", "The variable state, which switches between \"playing\" and \"game over\"", "The function touching"]
    answer: 1
  - q: "Why does the code build a new list called alive instead of deleting blocks inside the for loop?"
    options: ["Deleting items from a list while looping over it can skip items", "Python does not have a delete command", "A new list makes the blocks fall faster"]
    answer: 0
  - q: "What does spawned % len(SPAWN_X) do?"
    options: ["Counts the blocks on screen", "Picks the next position from the list and starts over at the beginning after the last one", "Makes the position random"]
    answer: 1
  - q: "Where would you change the difficulty so that blocks fall faster?"
    options: ["The 150 in b[1] + 150 * dt", "The 24 in the player size", "The word \"playing\""]
    answer: 0
    explain: "150 is the falling speed in pixels per second. Make it bigger for a harder game."
---

This is the finale: you will finish a complete little game called **Dodge!**. Red blocks fall from the sky, you slide left and right to avoid them, each dodge scores a point, every hit costs a life, and at zero lives the game is over until you press enter. Every piece is something you already learned, so this lesson is about **putting them together**.

## The plan

Before writing code, sketch the game as a list of jobs that happen every frame:

1. **Input**: read the left and right arrows and move the player (with `max`/`min` clamping so you stay on screen). Done for you.
2. **Spawn**: every half second a new block appears at the top.
3. **Move and collide**: every block falls. If it touches the player you lose a life, if it falls off the bottom you score.
4. **Check the state**: no lives left means game over.
5. **Draw**: paint everything from the current numbers.

The big structure in `update` is the state machine from the last lesson: when the state is `"game over"` the function only waits for `enter` and then `return`s early, so nothing else runs. `return` inside a function ends it immediately, which is a neat way to skip the rest.

## TODO 1: a timer for spawning

`dt` is the time of one frame, so adding it up gives time passing. The pattern for "do something every half second" is:

```python
timer = timer + dt
if timer >= 0.5:
    timer = 0          # start counting again
    # ...do the thing...
```

The thing is `blocks.append([x, -20])`, where `x` comes from the `SPAWN_X` list. The `%` operator wraps the index back to 0 after the last position:

```python
x = SPAWN_X[spawned % len(SPAWN_X)]
```

(To make it unpredictable, replace that with `random.randint(0, 296)` after `import random`. We use a fixed list so that our automatic check can predict the game.)

## TODO 2: the loop that does everything

This is the "build a new list" pattern from the bullets lesson, with three possible outcomes per block:

```python
alive = []
for b in blocks:
    b[1] = b[1] + 150 * dt        # fall
    if touching(...):             # hit: it vanishes and costs a life
        lives = lives - 1
    elif b[1] > game.HEIGHT:      # dodged: it vanishes and scores
        score = score + 1
    else:                         # still falling: keep it
        alive.append(b)
blocks = alive
```

Use the `touching` function for the collision, with the player as rectangle A (`px, PLAYER_Y, 24, 24`) and the block as rectangle B (`b[0], b[1], 20, 20`).

## TODO 3: game over and the best score

When the lives run out, switch the state, and remember the best score of the session with `max`:

```python
if lives <= 0:
    state = "game over"
    best = max(best, score)
```

`restart()` puts every number back to its start (except `best`, which survives on purpose!).

> **Watch out:** `UnboundLocalError` for `timer`, `spawned`, `best` and friends: each variable that you assign in `update` must be listed in the `global` line (already done in the starter).
>
> **Watch out:** if you forget `alive.append(b)` in the else branch, blocks disappear the moment they spawn. If you forget `blocks = alive` at the end, nothing is ever removed and you lose a life on every frame.
>
> **Watch out:** `IndexError: list index out of range` when using `SPAWN_X[spawned]` without `% len(SPAWN_X)`.
>
> **Watch out:** the check stands still and expects three hits. If the game never ends, check that the touching call really uses the player's position.

## Ideas to make it yours

- Speed up the blocks as the score grows: `150 + score * 5`.
- Add a second kind of falling object (a yellow coin from the collision lesson) that gives +5 points.
- Let the player move up and down a little with the other arrows.
- Show a title screen state: `"title"`, then `"playing"`, then `"game over"`.
- Replace the fixed `SPAWN_X` by `random` positions, and draw the blocks as circles.
- Add `game.line` stars in the background, or change the colors with your own tuples.

> **Your turn:** fill in the three TODO parts so the game works. Play it yourself first, then click Check answer: the check stands still, loses three lives, reaches game over, and presses enter to restart.
