---
title: "Pong: paddles, a bouncing ball and a computer opponent"
summary: Build the classic game in four steps - move your paddle, teach the computer to chase the ball, bounce off paddles and keep score.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      PADDLE_H = 44
      py = 98.0                      # top of the player paddle (left side)
      ay = 98.0                      # top of the computer paddle (right side)
      bx, by = 160.0, 120.0          # ball center
      vx, vy = 150.0, 95.0           # ball speed in pixels per second
      pscore = 0
      ascore = 0
      hits = 0

      def on_paddle(paddle_x, paddle_y):
          # is the ball (radius 4) touching the 8 pixel wide paddle at paddle_x?
          return (bx + 4 >= paddle_x and bx - 4 <= paddle_x + 8
                  and paddle_y <= by <= paddle_y + PADDLE_H)

      def serve(direction):
          global bx, by, vx, vy
          bx, by = 160.0, 120.0
          vx, vy = 150.0 * direction, 95.0

      def update(dt):
          global py, ay, bx, by, vx, vy, pscore, ascore, hits
          # 1. Player paddle: up and down arrows, clamped to the screen.
          # Speed 200 pixels per second. py must stay between 0 and HEIGHT - PADDLE_H.

          # 2. Computer paddle: chase the ball's y at 70 pixels per second.
          # Aim for target = by - PADDLE_H / 2 and ignore differences smaller than 4.

          bx = bx + vx * dt                    # move the ball (already done for you)
          by = by + vy * dt
          if by < 4:
              by, vy = 4, abs(vy)              # top wall
          if by > game.HEIGHT - 4:
              by, vy = game.HEIGHT - 4, -abs(vy)   # bottom wall

          # 3. Paddles: a ball moving left that touches the player paddle (x = 10)
          # flips vx and gets 5% faster; same for a ball moving right and the computer
          # paddle (x = 302). Count every bounce in hits.

          # 4. Points: past the left edge (bx < -10) the computer scores, past the
          # right edge (bx > 330) you score. Then serve again.

      def draw():
          game.clear(game.DARK)
          for y in range(0, game.HEIGHT, 20):
              game.rect(158, y, 4, 10, game.GRAY)
          game.rect(10, py, 8, PADDLE_H, game.CYAN)
          game.rect(302, ay, 8, PADDLE_H, game.PINK)
          game.circle(bx, by, 4, game.WHITE)
          game.text(120, 8, str(pscore), game.CYAN, 24)
          game.text(180, 8, str(ascore), game.PINK, 24)

      game.run(update, draw)
check:
  game:
    frames: 900
    keys:
      - { key: up, from: 0, to: 40 }
      - { key: down, from: 70, to: 130 }
    expect: "round(py) == 196 and hits >= 3 and pscore >= 2 and ascore >= 1"
    message: "The check holds up (the paddle must stop at the top, not leave the screen), then down (it must stop at the bottom, py = 196), and then lets the game run for 900 frames. The ball must be bounced by paddles at least 3 times, the slow computer must miss at least twice and you must miss at least once."
  code:
    - { pattern: 'key_down\(\s*["'']up["'']\s*\)', message: "Read the up arrow with game.key_down(\"up\")." }
    - { pattern: 'max\(|min\(', message: "Clamp the paddle with max() and min() so it cannot leave the screen." }
    - { pattern: 'vx\s*=\s*-\s*vx', message: "Bounce the ball by flipping its horizontal speed: vx = -vx * 1.05." }
    - { pattern: 'pscore\s*(\+=|=\s*pscore\s*\+)\s*1', message: "Add 1 to pscore when the ball gets past the computer." }
hints:
  - "Four small jobs inside update: (1) keys change py and are clamped, (2) an if/elif nudges ay toward the ball, (3) a bounce flips vx when the ball touches a paddle, (4) the ball leaving the screen adds a point and calls serve."
  - "Clamping is max(0, ...) for the top and min(game.HEIGHT - PADDLE_H, ...) for the bottom. The bounce needs a direction guard: only bounce the player paddle when vx < 0 (ball moving left), otherwise the ball can flip every frame while it overlaps the paddle."
  - "if game.key_down('up'): py = max(0, py - 200 * dt)  /  down: py = min(game.HEIGHT - PADDLE_H, py + 200 * dt)  /  if ay < target - 4: ay = ay + 70 * dt  elif ay > target + 4: ay = ay - 70 * dt  /  if vx < 0 and on_paddle(10, py): vx = -vx * 1.05; hits = hits + 1  /  if bx < -10: ascore = ascore + 1; serve(-1)"
solution:
  - name: main.py
    code: |
      import game

      PADDLE_H = 44
      py = 98.0                      # top of the player paddle (left side)
      ay = 98.0                      # top of the computer paddle (right side)
      bx, by = 160.0, 120.0          # ball center
      vx, vy = 150.0, 95.0           # ball speed in pixels per second
      pscore = 0
      ascore = 0
      hits = 0

      def on_paddle(paddle_x, paddle_y):
          # is the ball (radius 4) touching the 8 pixel wide paddle at paddle_x?
          return (bx + 4 >= paddle_x and bx - 4 <= paddle_x + 8
                  and paddle_y <= by <= paddle_y + PADDLE_H)

      def serve(direction):
          global bx, by, vx, vy
          bx, by = 160.0, 120.0
          vx, vy = 150.0 * direction, 95.0

      def update(dt):
          global py, ay, bx, by, vx, vy, pscore, ascore, hits
          # 1. Player paddle: up and down arrows, clamped to the screen.
          # Speed 200 pixels per second. py must stay between 0 and HEIGHT - PADDLE_H.
          if game.key_down("up"):
              py = max(0, py - 200 * dt)
          if game.key_down("down"):
              py = min(game.HEIGHT - PADDLE_H, py + 200 * dt)

          # 2. Computer paddle: chase the ball's y at 70 pixels per second.
          # Aim for target = by - PADDLE_H / 2 and ignore differences smaller than 4.
          target = by - PADDLE_H / 2
          if ay < target - 4:
              ay = ay + 70 * dt
          elif ay > target + 4:
              ay = ay - 70 * dt

          bx = bx + vx * dt                    # move the ball (already done for you)
          by = by + vy * dt
          if by < 4:
              by, vy = 4, abs(vy)              # top wall
          if by > game.HEIGHT - 4:
              by, vy = game.HEIGHT - 4, -abs(vy)   # bottom wall

          # 3. Paddles: a ball moving left that touches the player paddle (x = 10)
          # flips vx and gets 5% faster; same for a ball moving right and the computer
          # paddle (x = 302). Count every bounce in hits.
          if vx < 0 and on_paddle(10, py):
              vx = -vx * 1.05
              hits = hits + 1
          if vx > 0 and on_paddle(302, ay):
              vx = -vx * 1.05
              hits = hits + 1

          # 4. Points: past the left edge (bx < -10) the computer scores, past the
          # right edge (bx > 330) you score. Then serve again.
          if bx < -10:
              ascore = ascore + 1
              serve(-1)
          if bx > 330:
              pscore = pscore + 1
              serve(1)

      def draw():
          game.clear(game.DARK)
          for y in range(0, game.HEIGHT, 20):
              game.rect(158, y, 4, 10, game.GRAY)
          game.rect(10, py, 8, PADDLE_H, game.CYAN)
          game.rect(302, ay, 8, PADDLE_H, game.PINK)
          game.circle(bx, by, 4, game.WHITE)
          game.text(120, 8, str(pscore), game.CYAN, 24)
          game.text(180, 8, str(ascore), game.PINK, 24)

      game.run(update, draw)
quiz:
  - q: "How do you make the ball bounce off a vertical paddle?"
    options: ["Flip the sign of its horizontal speed: vx = -vx", "Flip the sign of its vertical speed: vy = -vy", "Set both speeds to 0"]
    answer: 0
    explain: "A paddle on the left or right is a vertical wall, so it reverses the sideways motion. Top and bottom walls reverse vy."
  - q: "Why is the computer paddle given a speed limit of 70 pixels per second?"
    options: ["So it can never touch the ball", "So that it can miss sometimes; a paddle that always matches the ball is unbeatable and no fun", "Because Python cannot move faster"]
    answer: 1
  - q: "Why does the paddle bounce check include vx < 0 for the player paddle?"
    options: ["It makes the ball faster", "It counts the score", "It stops the ball from flipping again and again while it still overlaps the paddle"]
    answer: 2
    explain: "After one bounce the ball moves away (vx > 0), so the same paddle can no longer trigger a second bounce."
  - q: "What does min(game.HEIGHT - PADDLE_H, py + 200 * dt) do?"
    options: ["Moves the paddle up", "Never lets the paddle's top go lower than the point where its bottom touches the floor", "Makes the paddle shorter"]
    answer: 1
---
Pong is the grandparent of all video games, and it is a perfect first "real" game: two paddles, one ball, a score. In this lesson you will build all of it, and every piece is something you already know: variables for positions, `if` statements for rules, and the `dt` trick for smooth movement. The new idea is **velocity**: a ball does not just have a position, it also has a speed and a direction, and a bounce simply flips that direction.

## The state of the game

Everything that can change lives in a global variable:

| Variable | Meaning |
|---|---|
| `py`, `ay` | the top edge of your paddle and of the computer's paddle |
| `bx`, `by` | the center of the ball |
| `vx`, `vy` | the ball's speed in pixels per second (negative `vx` means "going left") |
| `pscore`, `ascore` | the points of you and of the computer |
| `hits` | how many times a paddle has hit the ball (handy for testing) |

Each frame, `update(dt)` changes those numbers and `draw()` paints them. The ball moves with the same recipe as the player in the first lessons: `bx = bx + vx * dt`. Because we multiply by `dt` (the seconds since the last frame) the ball covers 150 pixels per second no matter how fast the computer is.

## Step 1: your paddle

The arrow keys change `py`. The only new idea is **clamping**: `max` picks the bigger of two numbers and `min` the smaller, so `max(0, py - 200 * dt)` can never go above the top, and `min(game.HEIGHT - PADDLE_H, ...)` can never sink below the bottom edge.

```python
if game.key_down("up"):
    py = max(0, py - 200 * dt)
```

## Step 2: a computer opponent

The AI is a few lines of "chase the ball". Compare the paddle's top with where it would like to be (`target`, the ball's height minus half the paddle) and nudge it that way. The 4 pixel dead zone stops the paddle from trembling when it is already lined up:

```python
target = by - PADDLE_H / 2
if ay < target - 4:
    ay = ay + 70 * dt
```

Notice the speed: 70 pixels per second, slower than the ball's vertical speed of 95. That is a design decision. An opponent that matches the ball perfectly never loses and nobody enjoys that. Change the 70 to 200 later and feel the difference.

## Step 3: bouncing

A bounce is a sign flip. A paddle is a vertical wall, so it reverses `vx`. We also multiply by 1.05 so every hit makes the ball 5% faster, which makes rallies tense. The function `on_paddle` (already written) answers "is the ball touching this paddle?", so the code reads like a sentence:

```python
if vx < 0 and on_paddle(10, py):
    vx = -vx * 1.05
```

The `vx < 0` part is a **direction guard**. Right after a bounce the ball may still overlap the paddle for a frame or two; without the guard it would flip again and get stuck jittering inside the paddle.

## Step 4: points and serving

When the ball leaves the screen someone scored. Add a point and call `serve(direction)`, which puts the ball back in the middle and sends it toward one side. The walls at the top and bottom are written for you, and they use `abs()` so the ball can never get stuck in the wall: `vy = abs(vy)` means "go down", whatever the sign was.

> **Watch out:** `UnboundLocalError: cannot access local variable 'hits' where it is not associated with a value` means a variable you change in `update` is missing from the `global` line at the top of the function.
>
> **Watch out:** a ball that vibrates inside a paddle bounces every frame. Add the direction guard (`vx < 0` or `vx > 0`).
>
> **Watch out:** `TypeError: unsupported operand type(s)` on a line like `py - 200 * dt` usually means a typo turned a number into a string or a function name. Print the values with `print(py)` to see them in the Console.
>
> **Watch out:** if the paddle seems to jump off the screen, check which of `max` and `min` you used. The top edge uses `max(0, ...)`, the bottom uses `min(..., ...)`.

## Going further

Make the ball speed up only until a maximum, add a pause after each point with a timer, let `w` and `s` also move your paddle, or change the angle of the bounce depending on where the ball hits the paddle (you will do that in the Breakout lesson).

> **Your turn:** fill in the four TODO blocks. Play a rally yourself first. The check holds `up` (your paddle must stop at the top, not leave the screen), then `down` (it must stop at the bottom), and then lets the game run for 900 frames: the ball must be bounced several times, and both you and the computer must miss.
