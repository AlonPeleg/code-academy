---
title: "Breakout: a grid of bricks, ball reflection and lives"
summary: Store the bricks in a list of lists, turn the ball position into a row and column, reflect the ball and manage lives and winning.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      ROWS, COLS = 4, 8
      BW, BH, TOP = 40, 14, 30            # brick width, height and the y of the top row
      PW, PY = 50, 220                    # paddle width and y

      bricks = [[1] * COLS for r in range(ROWS)]   # 1 = brick is there, 0 = broken
      px = 135.0
      bx, by = 160.0, 200.0
      vx, vy = 100.0, -160.0
      score = 0
      bounces = 0                         # how many times the paddle has hit the ball
      lives = 3
      state = "playing"

      def reset_ball():
          global bx, by, vx, vy
          bx, by, vx, vy = px + PW / 2, 200.0, 100.0, -160.0

      def update(dt):
          global px, bx, by, vx, vy, score, bounces, lives, state
          if state != "playing":
              return
          # 1. Paddle: left and right arrows at 260 pixels per second,
          # clamped so px stays between 0 and WIDTH - PW.

          bx = bx + vx * dt                   # move the ball and bounce on the three walls
          by = by + vy * dt
          if bx < 4 or bx > game.WIDTH - 4:
              vx = -vx
          if by < 4:
              vy = abs(vy)

          # 2. Bricks: which cell is the ball in? col = int(bx // BW) and
          # row = int((by - TOP) // BH). If the row and col are inside the grid and
          # that brick is 1, set it to 0, flip vy and add 1 to score.

          # 3. Paddle: if the ball is moving down (vy > 0), reaches the paddle's top
          # (by + 4 >= PY) and is above its bottom (by < PY + 8), and bx is between px
          # and px + PW: send it up with vy = -abs(vy) and aim it with
          # vx = (bx - (px + PW / 2)) * 5 (hit the edge for a steeper angle).
          # Add 1 to bounces.

          # 4. Lives and winning: if by > HEIGHT, lose a life and reset_ball(). When
          # lives reaches 0 the state is "game over". When score equals ROWS * COLS
          # the state is "won".

      def draw():
          game.clear(game.DARK)
          colors = [game.RED, game.ORANGE, game.YELLOW, game.GREEN]
          for r in range(ROWS):
              for c in range(COLS):
                  if bricks[r][c] == 1:
                      game.rect(c * BW + 1, TOP + r * BH + 1, BW - 2, BH - 2, colors[r])
          game.rect(px, PY, PW, 8, game.CYAN)
          game.circle(bx, by, 4, game.WHITE)
          game.text(8, 6, "Score " + str(score) + "  Lives " + str(lives), game.WHITE, 12)
          if state != "playing":
              game.text(80, 130, state.upper(), game.YELLOW, 28)

      game.run(update, draw)
check:
  game:
    frames: 700
    keys:
      - { key: right, from: 0, to: 60 }
    expect: "state == 'game over' and lives == 0 and bounces >= 1 and score >= 3 and round(px) == 270 and score + sum(sum(r) for r in bricks) == 32"
    message: "Hold right: the paddle must stop at the right edge (px 270) and catch the first falling ball (bounces must count it). After that, with the paddle parked there, the ball is eventually missed three times (lives 0, state 'game over'). Every broken brick must add one point: score + remaining bricks = 32."
  code:
    - { pattern: 'bricks\s*\[\s*row\s*\]\s*\[\s*col\s*\]\s*=\s*0', message: "Break a brick by setting bricks[row][col] = 0." }
    - { pattern: 'lives\s*(-=|=\s*lives\s*-)\s*1', message: "Lose a life when the ball falls out of the bottom." }
    - { pattern: 'vy\s*=\s*-\s*vy', message: "Reflect the ball off a brick by flipping vy." }
    - { pattern: 'state\s*=\s*["'']game over["'']', message: "Set state = \"game over\" when the lives run out." }
hints:
  - "A brick grid is a list of lists: bricks[row][col]. To find the brick under the ball, divide by the brick size with //: col = int(bx // BW) and row = int((by - TOP) // BH). Check that row and col are inside the grid before indexing."
  - "A hit means three things: bricks[row][col] = 0, vy = -vy, score = score + 1. For the paddle, remember the ball must be moving down (vy > 0) or it could bounce twice. Aim it with the distance from the paddle's center."
  - "col = int(bx // BW) / row = int((by - TOP) // BH) / if 0 <= row < ROWS and 0 <= col < COLS and bricks[row][col] == 1: bricks[row][col] = 0; vy = -vy; score = score + 1  /  if vy > 0 and by + 4 >= PY and by < PY + 8 and px <= bx <= px + PW: vy = -abs(vy); vx = (bx - (px + PW / 2)) * 5  /  if by > game.HEIGHT: lives = lives - 1; reset_ball(); if lives == 0: state = 'game over'"
solution:
  - name: main.py
    code: |
      import game

      ROWS, COLS = 4, 8
      BW, BH, TOP = 40, 14, 30            # brick width, height and the y of the top row
      PW, PY = 50, 220                    # paddle width and y

      bricks = [[1] * COLS for r in range(ROWS)]   # 1 = brick is there, 0 = broken
      px = 135.0
      bx, by = 160.0, 200.0
      vx, vy = 100.0, -160.0
      score = 0
      bounces = 0                         # how many times the paddle has hit the ball
      lives = 3
      state = "playing"

      def reset_ball():
          global bx, by, vx, vy
          bx, by, vx, vy = px + PW / 2, 200.0, 100.0, -160.0

      def update(dt):
          global px, bx, by, vx, vy, score, bounces, lives, state
          if state != "playing":
              return
          # 1. Paddle: left and right arrows at 260 pixels per second,
          # clamped so px stays between 0 and WIDTH - PW.
          if game.key_down("left"):
              px = max(0, px - 260 * dt)
          if game.key_down("right"):
              px = min(game.WIDTH - PW, px + 260 * dt)

          bx = bx + vx * dt                   # move the ball and bounce on the three walls
          by = by + vy * dt
          if bx < 4 or bx > game.WIDTH - 4:
              vx = -vx
          if by < 4:
              vy = abs(vy)

          # 2. Bricks: which cell is the ball in? col = int(bx // BW) and
          # row = int((by - TOP) // BH). If the row and col are inside the grid and
          # that brick is 1, set it to 0, flip vy and add 1 to score.
          col = int(bx // BW)
          row = int((by - TOP) // BH)
          if 0 <= row < ROWS and 0 <= col < COLS and bricks[row][col] == 1:
              bricks[row][col] = 0
              vy = -vy
              score = score + 1

          # 3. Paddle: if the ball is moving down (vy > 0), reaches the paddle's top
          # (by + 4 >= PY) and is above its bottom (by < PY + 8), and bx is between px
          # and px + PW: send it up with vy = -abs(vy) and aim it with
          # vx = (bx - (px + PW / 2)) * 5 (hit the edge for a steeper angle).
          # Add 1 to bounces.
          if vy > 0 and by + 4 >= PY and by < PY + 8 and px <= bx <= px + PW:
              vy = -abs(vy)
              vx = (bx - (px + PW / 2)) * 5
              bounces = bounces + 1

          # 4. Lives and winning: if by > HEIGHT, lose a life and reset_ball(). When
          # lives reaches 0 the state is "game over". When score equals ROWS * COLS
          # the state is "won".
          if by > game.HEIGHT:
              lives = lives - 1
              reset_ball()
              if lives == 0:
                  state = "game over"
          if score == ROWS * COLS:
              state = "won"

      def draw():
          game.clear(game.DARK)
          colors = [game.RED, game.ORANGE, game.YELLOW, game.GREEN]
          for r in range(ROWS):
              for c in range(COLS):
                  if bricks[r][c] == 1:
                      game.rect(c * BW + 1, TOP + r * BH + 1, BW - 2, BH - 2, colors[r])
          game.rect(px, PY, PW, 8, game.CYAN)
          game.circle(bx, by, 4, game.WHITE)
          game.text(8, 6, "Score " + str(score) + "  Lives " + str(lives), game.WHITE, 12)
          if state != "playing":
              game.text(80, 130, state.upper(), game.YELLOW, 28)

      game.run(update, draw)
quiz:
  - q: "What does bricks[2][5] mean?"
    options: ["The brick in column 2, row 5", "The brick in row 2, column 5 (the row list comes first)", "The 25th brick"]
    answer: 1
  - q: "What does bx // BW do with bx = 95 and BW = 40?"
    options: ["It gives 2, the number of whole 40 pixel columns that fit before x = 95", "It gives 2.375", "It gives 15"]
    answer: 0
    explain: "// is floor division: it divides and throws away the fraction, which turns a pixel position into a column number."
  - q: "Why is bricks = [[1] * 8] * 4 a bug?"
    options: ["It makes a grid of 8 rows", "It is fine, it is the shortest way", "All four rows are the same list object, so changing one brick changes the whole column"]
    answer: 2
  - q: "How do you reflect the ball when it hits the top or bottom of a brick?"
    options: ["vx = -vx", "vy = -vy", "bx = by"]
    answer: 1
---
Breakout adds a very useful data structure to your toolbox: the **grid**, written in Python as a **list of lists**. It also adds smarter ball physics: the angle of the rebound depends on where the ball hits the paddle. By the end you will have a game with bricks, three lives and a win condition.

## A list of lists

The bricks are stored row by row: each row is a list of 8 numbers, and the whole grid is a list of 4 rows.

```python
bricks = [[1] * COLS for r in range(ROWS)]
print(bricks[0])        # prints: [1, 1, 1, 1, 1, 1, 1, 1]
bricks[2][5] = 0        # row 2, column 5 is broken
print(bricks[2][5])     # prints: 0
```

`bricks[row][col]` first picks the row, then the item in that row. A `1` means "the brick is there", a `0` means "it is gone". To draw the grid, `draw` uses two loops, one inside the other: the outer loop visits each `r`, the inner loop each `c`, and a brick at `(r, c)` is painted at pixel `x = c * BW`, `y = TOP + r * BH`.

## From a pixel to a brick

Collision with 32 bricks could mean 32 comparisons per frame. A grid lets us skip all that: we ask "which cell is the ball in?" with one division. Floor division `//` divides and drops the fraction:

```python
col = int(bx // BW)             # 95 // 40 is 2
row = int((by - TOP) // BH)     # subtract TOP first: the grid starts 30 pixels down
```

Now `bricks[row][col]` is exactly the brick under the ball, found in one step. This "convert a position into a grid index" trick is how almost every grid game works. Before reading the list we must check the numbers are inside the grid (`0 <= row < ROWS`), because the ball spends most of its time outside the brick area.

## Reflection

When the ball breaks a brick we flip its vertical speed, `vy = -vy`, so it bounces back the way it came. The ball also bounces off the left, right and top walls (already written for you, with `abs` so it cannot get stuck).

The **paddle** is where it gets fun. If the ball always came off at the same angle the game would be boring and the player would have no control. Instead we use how far from the paddle's center the ball landed:

```python
vx = (bx - (px + PW / 2)) * 5
```

Hit the left edge and `vx` becomes about -125 (steeply to the left), hit the middle and it is 0 (straight up). The player aims by positioning the paddle. We also write `vy = -abs(vy)`, "go up whatever happens", and only do it when `vy > 0`, so the ball cannot bounce twice on the same paddle. The counter `bounces` simply counts the catches.

## Lives and states

When the ball falls past the bottom (`by > game.HEIGHT`) you lose a life and the ball goes back to the paddle with `reset_ball()`. When lives reach 0 the state becomes `"game over"`, and when the score equals the number of bricks (`ROWS * COLS`) it becomes `"won"`. At the top of `update`, `if state != "playing": return` freezes the game in both end states. This is the same state machine idea as in the Dodge lesson.

> **Watch out:** `IndexError: list index out of range` happens when you use `bricks[row][col]` with a row or column that is outside the grid, for example when the ball is at the bottom of the screen. Check the ranges first.
>
> **Watch out:** a negative index does not crash, it silently wraps around! `bricks[-1]` is the **last** row, so a ball above the grid (`row = -1`) would break bricks at the bottom. That is why we test `0 <= row`.
>
> **Watch out:** `bricks = [[1] * 8] * 4` creates four references to the same row, so breaking one brick breaks that column in every row. Use `[[1] * 8 for r in range(4)]` to make four separate lists.
>
> **Watch out:** the ball flies straight through bricks at high speed? It moves several pixels per frame, so the center can skip over a thin row. Keep the speed below the brick height per frame (here 2.7 pixels against 14).

## Going further

Give the bricks different values per row, make some bricks need two hits (use 2 instead of 1 in the list), speed up the ball as bricks disappear, or let `space` launch the ball from the paddle. A level is just a different grid, so you can design levels as lists of strings.

> **Your turn:** write the four TODO blocks: paddle movement, brick hits, the paddle bounce and lives plus winning. The check moves the paddle to the right edge to catch the first ball, then leaves it parked there until all three lives are gone. It also verifies that your score and the bricks left in the grid add up to 32.
