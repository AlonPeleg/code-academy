---
title: "Snake: a grid, a timer and a growing list"
summary: Move on a grid with a timer accumulator, grow a list of segments when you eat, and detect when the snake bites itself.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      CELL = 20                      # the screen is a grid of 16 x 12 cells
      COLS, ROWS = 16, 12
      STEP = 0.15                    # the snake moves one cell every 0.15 seconds
      FOODS = [(8, 5), (8, 6), (12, 2), (2, 9), (13, 9)]   # where the food appears, in order

      snake = [(5, 5), (4, 5), (3, 5)]   # (column, row) cells, the head comes first
      dx, dy = 1, 0                      # direction: moving right
      timer = 0.0
      score = 0
      state = "playing"

      def food():
          return FOODS[score % len(FOODS)]

      def restart():
          global snake, dx, dy, timer, score, state
          snake, dx, dy, timer, score, state = [(5, 5), (4, 5), (3, 5)], 1, 0, 0.0, 0, "playing"

      def step():
          global snake, score, state
          head = (snake[0][0] + dx, snake[0][1] + dy)
          # 3. Crash: the game is over ("dead") if the new head is outside the grid
          # (column 0..COLS-1, row 0..ROWS-1) or already in the snake list.
          snake.insert(0, head)              # the head always moves forward
          # 4. Food: when the head is on the food, add 1 to score and keep the tail
          # (the snake grows). Otherwise remove the last segment with pop().

      def update(dt):
          global dx, dy, timer
          if state == "dead":
              if game.key_pressed("enter"):
                  restart()
              return
          # 1. Steering: the arrow keys set dx and dy, but never turn straight back
          # (for example "left" is only allowed when dx is not 1).
          # 2. Timer accumulator: add dt to timer. While timer is at least STEP,
          # subtract STEP and call step().

      def draw():
          game.clear(game.DARK)
          fx, fy = food()
          game.rect(fx * CELL + 2, fy * CELL + 2, CELL - 4, CELL - 4, game.RED)
          for i, (c, r) in enumerate(snake):
              game.rect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2, game.YELLOW if i == 0 else game.GREEN)
          game.text(6, 4, "Score " + str(score), game.WHITE, 14)
          if state == "dead":
              game.text(80, 100, "GAME OVER", game.RED, 28)

      game.run(update, draw)
check:
  game:
    frames: 90
    keys:
      - { key: down, from: 28, to: 30 }
      - { key: left, from: 38, to: 40 }
      - { key: up, from: 47, to: 49 }
    expect: "state == 'dead' and score == 2 and len(snake) == 5"
    message: "The snake starts moving right and eats the food ahead (score 1, length 4). Down then eats the next food (score 2, length 5). Then left and up make it turn back into its own body, so the state must become 'dead'."
  code:
    - { pattern: 'timer\s*(-=|=\s*timer\s*-)\s*STEP', message: "Take STEP off the timer each time you move: timer = timer - STEP." }
    - { pattern: 'head\s+in\s+snake', message: "Check for the crash with: head in snake." }
    - { pattern: '\.pop\(', message: "Remove the tail with snake.pop() when nothing was eaten." }
    - { pattern: 'key_down\(\s*["'']left["'']\s*\)', message: "Read the keys with game.key_down(\"left\") and friends." }
hints:
  - "Two ideas. The timer accumulator: add dt to timer, and while timer is at least STEP, subtract STEP and run one step(). Moving a snake is then: insert a new head, and remove the tail unless food was eaten."
  - "Eating means skipping the pop. Crashing means the new head is outside 0..COLS-1 / 0..ROWS-1 or is already one of the cells in the snake list (use the in operator). The arrow keys only change dx and dy, and never allow the opposite direction."
  - "if game.key_down('left') and dx != 1: dx, dy = -1, 0  (same for the other three)  /  timer = timer + dt  /  while timer >= STEP and state == 'playing': timer = timer - STEP; step()  /  if not (0 <= head[0] < COLS and 0 <= head[1] < ROWS) or head in snake: state = 'dead'; return  /  if head == food(): score = score + 1  else: snake.pop()"
solution:
  - name: main.py
    code: |
      import game

      CELL = 20                      # the screen is a grid of 16 x 12 cells
      COLS, ROWS = 16, 12
      STEP = 0.15                    # the snake moves one cell every 0.15 seconds
      FOODS = [(8, 5), (8, 6), (12, 2), (2, 9), (13, 9)]   # where the food appears, in order

      snake = [(5, 5), (4, 5), (3, 5)]   # (column, row) cells, the head comes first
      dx, dy = 1, 0                      # direction: moving right
      timer = 0.0
      score = 0
      state = "playing"

      def food():
          return FOODS[score % len(FOODS)]

      def restart():
          global snake, dx, dy, timer, score, state
          snake, dx, dy, timer, score, state = [(5, 5), (4, 5), (3, 5)], 1, 0, 0.0, 0, "playing"

      def step():
          global snake, score, state
          head = (snake[0][0] + dx, snake[0][1] + dy)
          # 3. Crash: the game is over ("dead") if the new head is outside the grid
          # (column 0..COLS-1, row 0..ROWS-1) or already in the snake list.
          if not (0 <= head[0] < COLS and 0 <= head[1] < ROWS) or head in snake:
              state = "dead"
              return
          snake.insert(0, head)              # the head always moves forward
          # 4. Food: when the head is on the food, add 1 to score and keep the tail
          # (the snake grows). Otherwise remove the last segment with pop().
          if head == food():
              score = score + 1
          else:
              snake.pop()

      def update(dt):
          global dx, dy, timer
          if state == "dead":
              if game.key_pressed("enter"):
                  restart()
              return
          # 1. Steering: the arrow keys set dx and dy, but never turn straight back
          # (for example "left" is only allowed when dx is not 1).
          if game.key_down("left") and dx != 1:
              dx, dy = -1, 0
          if game.key_down("right") and dx != -1:
              dx, dy = 1, 0
          if game.key_down("up") and dy != 1:
              dx, dy = 0, -1
          if game.key_down("down") and dy != -1:
              dx, dy = 0, 1
          # 2. Timer accumulator: add dt to timer. While timer is at least STEP,
          # subtract STEP and call step().
          timer = timer + dt
          while timer >= STEP and state == "playing":
              timer = timer - STEP
              step()

      def draw():
          game.clear(game.DARK)
          fx, fy = food()
          game.rect(fx * CELL + 2, fy * CELL + 2, CELL - 4, CELL - 4, game.RED)
          for i, (c, r) in enumerate(snake):
              game.rect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2, game.YELLOW if i == 0 else game.GREEN)
          game.text(6, 4, "Score " + str(score), game.WHITE, 14)
          if state == "dead":
              game.text(80, 100, "GAME OVER", game.RED, 28)

      game.run(update, draw)
quiz:
  - q: "Why does Snake move on a timer instead of on every frame?"
    options: ["Python is too slow to move every frame", "Moving one whole cell 60 times a second would be far too fast to play; the timer makes it step a few times per second", "Timers make the snake grow"]
    answer: 1
  - q: "How does the snake grow when it eats?"
    options: ["The new head is inserted, but the tail is not removed", "A random segment is duplicated", "The grid gets bigger"]
    answer: 0
    explain: "Normally every step inserts a head and pops the tail so the length stays equal. Skip the pop and the snake is one longer."
  - q: "What does head in snake check?"
    options: ["Whether the head is the first item", "Whether the list is empty", "Whether the head cell is already one of the cells of the body"]
    answer: 2
  - q: "Why is a left key ignored while the snake is moving right (dx is 1)?"
    options: ["A snake that turns 180 degrees would run into its own neck and die instantly", "The left key is broken", "It would make the snake faster"]
    answer: 0
---
Snake is the game that is secretly about lists. The snake is a list of grid cells, moving means adding one cell at the front and removing one at the back, and growing means skipping the removal. This lesson teaches three important game-programming ideas: a **grid** instead of free pixels, a **timer accumulator** for steady steps, and a **list used like a queue**.

## Thinking in cells

The screen is 320 by 240 pixels, but Snake does not move pixel by pixel. We divide it into 16 columns and 12 rows of 20 pixel cells and store positions as `(column, row)` **tuples**, for example `(5, 5)`. A tuple is a pair that cannot be changed, which is exactly what we want for a position. Only `draw` turns cells into pixels: `x = column * CELL`.

The snake is a list of those cells with the head first:

```python
snake = [(5, 5), (4, 5), (3, 5)]    # head at column 5, tail at column 3
```

## The timer accumulator

If the snake moved on every frame it would zip across the screen in a quarter of a second. We want one cell every `STEP = 0.15` seconds, but `update` runs 60 times per second. The standard solution is an **accumulator**: collect the elapsed time, and spend it in fixed portions.

```python
timer = timer + dt
while timer >= STEP:
    timer = timer - STEP
    step()
```

Each frame adds a little time. Once there is at least `STEP` saved up, we spend it by calling `step()`. We use `while` rather than `if` so that after a slow frame (say 0.4 seconds) the game catches up by stepping several times. We subtract `STEP` instead of resetting the timer to 0, so no fractions of a second are lost. This pattern shows up everywhere: physics engines, spawners, animations.

## One step of the snake

Inside `step()` we first compute the new head from the direction `(dx, dy)`: `head = (snake[0][0] + dx, snake[0][1] + dy)`. Then:

1. **Crash?** If the head is outside the grid, or `head in snake` (the `in` operator asks "is this cell already one of the body cells?"), the state becomes `"dead"`.
2. `snake.insert(0, head)` puts the new head at the front.
3. **Food?** If the head is on the food, add a point and keep the tail. Otherwise `snake.pop()` removes the last cell. The length stays the same, the snake just slid forward by one.

That is the whole trick: a snake that eats is one cell longer because we skipped the `pop`.

## Steering

The arrow keys only change `dx` and `dy` (for example `dx, dy = -1, 0` means "left"). The step function then uses them. Notice the guard `and dx != 1`: a snake that moves right must not be allowed to turn straight to the left, or its head would hit its own neck. That is a classic rule of the genre.

> **Watch out:** `IndexError: pop from empty list` or a snake that vanishes: you popped on a step where the snake had just eaten, or the starting list is empty. Pop only in the `else` branch.
>
> **Watch out:** `UnboundLocalError: cannot access local variable 'score' where it is not associated with a value`: add `score` (and `state`) to the `global` line of the function that assigns them.
>
> **Watch out:** pressing two keys quickly can still kill you. Press down then left within one 0.15 s step and the snake reverses, because the guard only sees the direction from the last key. Real games keep a small queue of turns. A nice challenge for later!
>
> **Watch out:** a `while` loop without `timer = timer - STEP` never ends and freezes the page. Always make sure the condition can become false.

## Going further

Make the snake faster as the score grows (`STEP = 0.15 - score * 0.005`), wrap around the edges instead of dying (`% COLS`), or use `random.randint` for the food. We use a fixed list of food positions so that the automatic check can predict the game.

> **Your turn:** write the four TODO blocks: steering, the timer accumulator in `update`, the crash test and the food test in `step`. Then play a round. The check steers the snake to the first two foods and then makes it bite its own body: it expects a score of 2, a length of 5 and the state `"dead"`.
