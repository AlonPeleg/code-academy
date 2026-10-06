---
title: Staying on screen
summary: Use min and max to stop the player at the edges of the screen.
level: beginner
runner: pygame
files:
  - name: main.py
    code: |
      import game

      x = 145
      y = 105
      size = 30
      speed = 200      # pixels per second

      def update(dt):
          global x, y
          if game.key_down("left"):
              x = x - speed * dt
          if game.key_down("right"):
              x = x + speed * dt
          if game.key_down("up"):
              y = y - speed * dt
          if game.key_down("down"):
              y = y + speed * dt

          # 1. Keep x between 0 and the right limit (the screen width minus the size).
          # 2. Keep y between 0 and the bottom limit (the screen height minus the size).


      def draw():
          game.clear(game.DARK)
          game.rect(x, y, size, size, game.GREEN)
          game.text(10, 10, "x=" + str(int(x)) + " y=" + str(int(y)), game.WHITE, 14)

      game.run(update, draw)
check:
  game:
    frames: 240
    keys:
      - { key: right, from: 0, to: 120 }
      - { key: down, from: 0, to: 120 }
      - { key: left, from: 120, to: 240 }
      - { key: up, from: 120, to: 240 }
    expect: "x == 0 and y == 0"
    message: "The player should stop at every edge. If it goes past the right or bottom edge, coming back takes too long and it does not reach 0."
  code:
    - { pattern: 'max\(\s*0', message: "Use max(0, ...) so the value can never go below 0." }
    - { pattern: 'min\(', message: "Use min(...) so the value can never go above the limit." }
    - { pattern: 'WIDTH\s*-\s*(size|30)', message: "The right limit is the screen width minus the player's size." }
    - { pattern: 'HEIGHT\s*-\s*(size|30)', message: "The bottom limit is the screen height minus the player's size." }
hints:
  - 'min(a, b) gives the smaller of two numbers and max(a, b) the bigger. A value that must not go below 0 can use max(0, value). One that must not go above a limit can use min(value, limit).'
  - 'Clamping both ends in one line: x = max(0, min(x, limit)). The limit for x is game.WIDTH - size, because x is the LEFT edge of the square and the square needs size pixels of room.'
  - 'Add these two lines at the end of update: x = max(0, min(x, game.WIDTH - size))   and   y = max(0, min(y, game.HEIGHT - size))'
solution:
  - name: main.py
    code: |
      import game

      x = 145
      y = 105
      size = 30
      speed = 200      # pixels per second

      def update(dt):
          global x, y
          if game.key_down("left"):
              x = x - speed * dt
          if game.key_down("right"):
              x = x + speed * dt
          if game.key_down("up"):
              y = y - speed * dt
          if game.key_down("down"):
              y = y + speed * dt

          # 1. Keep x between 0 and the right limit (the screen width minus the size).
          x = max(0, min(x, game.WIDTH - size))
          # 2. Keep y between 0 and the bottom limit (the screen height minus the size).
          y = max(0, min(y, game.HEIGHT - size))


      def draw():
          game.clear(game.DARK)
          game.rect(x, y, size, size, game.GREEN)
          game.text(10, 10, "x=" + str(int(x)) + " y=" + str(int(y)), game.WHITE, 14)

      game.run(update, draw)
quiz:
  - q: "What does max(0, -35) give?"
    options: ["-35", "0", "35"]
    answer: 1
    explain: "max picks the bigger of the two numbers, and 0 is bigger than -35."
  - q: "Why is the right limit game.WIDTH - size and not game.WIDTH?"
    options: ["Because x is the square's LEFT edge, so the square would stick out past the right side", "Because the screen is 20 pixels narrower", "Because Python counts from 1"]
    answer: 0
  - q: "What does min(x, 290) do to an x of 400?"
    options: ["Returns 400", "Returns 690", "Returns 290"]
    answer: 2
  - q: "What is the usual pattern to keep a value between a low and a high limit?"
    options: ["value = low + high", "value = max(low, min(value, high))", "value = value * dt"]
    answer: 1
---

Right now your player can walk straight off the screen and never come back. Games need **boundaries**: walls, floors, the edge of the world. In this lesson you will learn to **clamp** a number, which means to force it to stay inside a range.

## The edges of the screen

The screen is `game.WIDTH` (320) pixels wide and `game.HEIGHT` (240) tall. A position of `x = 0` is the left edge and `y = 0` the top edge. Using the names instead of the numbers 320 and 240 is a good habit: your code explains itself, and it still works if the screen size changes.

There is one catch. A rectangle's position `(x, y)` is its **top-left corner**. A square 30 pixels wide at `x = 300` starts on the screen but sticks 10 pixels off the right edge! The furthest right the corner can go is:

```python
game.WIDTH - size     # 320 - 30 = 290
```

The same goes for the bottom: `game.HEIGHT - size`.

## min and max

Python has two tiny built-in functions that do all the work:

```python
print(min(3, 8))     # prints: 3   (the smaller one)
print(max(3, 8))     # prints: 8   (the bigger one)
```

- `max(0, x)` is "x, but never less than 0". If `x` is `-12`, you get `0`.
- `min(x, 290)` is "x, but never more than 290". If `x` is `400`, you get `290`.

Put them together and you can squeeze a number into a range, from the inside out:

```python
x = max(0, min(x, game.WIDTH - size))
```

Read it like this: first `min(x, 290)` limits it from above, then `max(0, ...)` limits that result from below. So `x` always ends up between `0` and `290`. Put the line **after** the movement code so it can fix any overshoot straight away, before the frame is drawn.

## The same thing with if

You can do the same job with `if`, which some people find easier to read:

```python
if x < 0:
    x = 0
if x > game.WIDTH - size:
    x = game.WIDTH - size
```

Both ways are fine. `min`/`max` is shorter, and you will see it in many real games.

## Why not just stop the movement?

You could write `if x < 290: x = x + ...` and refuse to move at the edge, but then a big step could jump you past the edge on one frame, and you might end up stuck outside. Clamping after the move is simpler and always correct.

> **Watch out:** mixing up the order, like `max(game.WIDTH - size, min(x, 0))`, creates a range that makes no sense and the player gets glued to one edge. Remember: `max` guards the low end, `min` guards the high end.
>
> **Watch out:** forgetting the `- size` lets the square slide half off the right and bottom edges. It does not crash; it just looks wrong, so test it with your eyes by pushing into each wall.
>
> **Watch out:** `NameError: name 'WIDTH' is not defined` means you wrote `WIDTH` alone. It lives inside the engine, so write `game.WIDTH`.

## Try it yourself

After it works, make the player bounce off the walls instead of just stopping, or make it wrap around so leaving the right edge brings it back on the left.

> **Your turn:** at the end of `update`, clamp `x` between `0` and `game.WIDTH - size`, and `y` between `0` and `game.HEIGHT - size`. The check holds the arrow keys long enough to hit every wall.
