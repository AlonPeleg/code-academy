---
title: Meet the game loop
summary: Every game repeats two jobs 60 times a second, update and draw. Make a box move across the screen.
level: beginner
runner: pygame
files:
  - name: main.py
    code: |
      import game

      x = 20          # left edge of the box, in pixels
      y = 100         # top edge of the box
      size = 40
      speed = 200     # pixels per SECOND

      def update(dt):
          global x, speed
          # 1. Move the box: make x bigger by the speed multiplied by dt.


          # The bounce (already done for you): turn around at the walls.
          if x > game.WIDTH - size:
              speed = -abs(speed)
          if x < 0:
              speed = abs(speed)

      def draw():
          game.clear(game.DARK)
          game.rect(x, y, size, size, game.CYAN)
          game.text(10, 10, "x = " + str(int(x)), game.WHITE, 16)

      game.run(update, draw)
check:
  game:
    frames: 120
    expect: "100 < x < 190 and speed < 0"
    message: "After 2 seconds the box should have hit the right wall and be sliding back. Add speed * dt to x inside update."
  code:
    - { pattern: 'speed\s*\*\s*dt', message: "Multiply the speed by dt: speed * dt." }
hints:
  - 'A variable changes by adding to itself, like x = x + 1. Inside update you want to make x bigger a little bit every frame.'
  - 'Distance = speed multiplied by time. The time since the last frame is dt, so the amount to add each frame is speed * dt.'
  - 'Write this line where the comment says to move the box: x = x + speed * dt   (x += speed * dt means the same thing).'
solution:
  - name: main.py
    code: |
      import game

      x = 20          # left edge of the box, in pixels
      y = 100         # top edge of the box
      size = 40
      speed = 200     # pixels per SECOND

      def update(dt):
          global x, speed
          # 1. Move the box: make x bigger by the speed multiplied by dt.
          x = x + speed * dt

          # The bounce (already done for you): turn around at the walls.
          if x > game.WIDTH - size:
              speed = -abs(speed)
          if x < 0:
              speed = abs(speed)

      def draw():
          game.clear(game.DARK)
          game.rect(x, y, size, size, game.CYAN)
          game.text(10, 10, "x = " + str(int(x)), game.WHITE, 16)

      game.run(update, draw)
quiz:
  - q: "What is the job of the update(dt) function?"
    options: ["Change the game's numbers (positions, scores) a little each frame", "Paint the pixels on the screen", "Start the game window"]
    answer: 0
    explain: "update changes the state of the game. draw only paints that state."
  - q: "On this screen, what does the point (0, 0) mean?"
    options: ["The center of the screen", "The top-left corner", "The bottom-left corner"]
    answer: 1
    explain: "x grows to the right and y grows DOWNWARD, which surprises many beginners."
  - q: "What is dt?"
    options: ["The score of the player", "The number of boxes on the screen", "The number of seconds since the previous frame"]
    answer: 2
    explain: "It is a tiny number, about 0.017 when the game runs at 60 frames per second."
  - q: "Why do we write x = x + speed * dt instead of x = x + speed?"
    options: ["It makes the box bigger", "So the box moves at the same real speed on fast and slow computers", "Python requires the word dt"]
    answer: 1
---

Every game, from Pong to the biggest 3D adventures, is built around one idea: the **game loop**. A loop that runs about 60 times every second and does two jobs each time:

1. **update**: change the numbers that describe the game (where things are, the score, ...).
2. **draw**: paint the current picture on the screen.

In this lesson you will meet both, and make a box slide across the screen and bounce off the walls.

## The five lines every game needs

```python
import game

def update(dt):
    pass            # change numbers here

def draw():
    game.clear(game.DARK)   # paint here

game.run(update, draw)
```

- `import game` loads our tiny game engine. Everything it offers is written `game.something`.
- `def update(dt):` is a function the engine calls once per frame. The parameter `dt` ("delta time") is the number of **seconds** since the last frame, a small number such as `0.0167`.
- `def draw():` is called right after `update`. It only paints; it should not change the game.
- `game.run(update, draw)` starts the loop. Put it at the bottom, after the functions exist. Note that we pass the functions *without* brackets: we hand the engine the functions so it can call them itself.

## The screen and drawing

The screen is **320 pixels wide and 240 tall**. The point `(0, 0)` is the **top-left** corner. `x` grows to the right, and `y` grows **downward**. You can get the sizes as `game.WIDTH` and `game.HEIGHT`.

| Call | What it does |
| --- | --- |
| `game.clear(color)` | Fills the whole screen with one color. Do this first in `draw`. |
| `game.rect(x, y, w, h, color)` | A filled rectangle. `(x, y)` is its top-left corner. |
| `game.text(x, y, message, color, size)` | Writes text. Use `str(...)` to turn a number into text. |

Colors available: `game.BLACK WHITE GRAY DARK RED ORANGE YELLOW GREEN CYAN BLUE PURPLE PINK`.

## State and the `global` keyword

Things that change over time (the box position) are stored in **variables outside the functions**. This is the game's *state*. To change one from inside `update`, tell Python with `global`:

```python
x = 20

def update(dt):
    global x
    x = x + 10
```

## Why we multiply by dt

If you add a fixed `5` pixels every frame, a fast computer (more frames) moves the box faster than a slow one. Instead, think "the box moves 200 **pixels per second**". In one frame, which lasts `dt` seconds, it travels `200 * dt` pixels. Add that, and the speed is the same everywhere:

```python
x = x + speed * dt     # speed is in pixels per second
```

> **Watch out:** forgetting `global x` inside `update` gives `UnboundLocalError: cannot access local variable 'x'`. Python thinks you are making a new local variable.
>
> **Watch out:** if the box does not move, check that `game.run(update, draw)` is at the bottom and that you wrote `speed * dt`, not only `speed`.
>
> **Watch out:** `"x = " + x` fails with `TypeError` because you cannot add a number to text. Use `str(x)`.

The bounce at the walls is already written: when the box passes the right wall `speed` becomes negative, so `x` shrinks and the box comes back. You will write code like that yourself in later lessons.

## Going further

Change `speed`, `size`, `y` and the color. Add a second `game.rect` in `draw`. Press Run and watch it live!

> **Your turn:** inside `update`, add one line that makes `x` grow by `speed * dt` every frame.
