---
title: Moving with the keyboard
summary: Read the arrow keys with key_down and move a player in four directions at a steady speed.
level: beginner
runner: pygame
files:
  - name: main.py
    code: |
      import game

      x = 160
      y = 120
      size = 24
      speed = 120      # pixels per second

      def update(dt):
          global x, y
          # The right arrow is done for you:
          if game.key_down("right"):
              x = x + speed * dt
          # 1. If the left key is held, make x smaller.

          # 2. If the up key is held, make y smaller.

          # 3. If the down key is held, make y bigger.


      def draw():
          game.clear(game.DARK)
          game.rect(x, y, size, size, game.ORANGE)
          game.text(10, 10, "Use the arrow keys", game.WHITE, 14)

      game.run(update, draw)
check:
  game:
    frames: 60
    keys:
      - { key: down, from: 0, to: 30 }
      - { key: left, from: 30, to: 60 }
      - { key: up, from: 40, to: 50 }
    expect: "abs(x - 100) < 3 and abs(y - 160) < 3"
    message: "The player should move left, up and down too. Remember: up means y gets smaller, down means y gets bigger."
  code:
    - { pattern: 'key_down\(\s*["'']left["'']\s*\)', message: "Use game.key_down(\"left\") for the left arrow." }
    - { pattern: 'key_down\(\s*["'']up["'']\s*\)', message: "Use game.key_down(\"up\") for the up arrow." }
    - { pattern: 'key_down\(\s*["'']down["'']\s*\)', message: "Use game.key_down(\"down\") for the down arrow." }
hints:
  - 'Copy the shape of the right-arrow code: an if with game.key_down(...) and one line that changes x or y. Each other direction is the same pattern with a different key name and a different variable.'
  - 'Left makes x smaller (subtract), right makes x bigger. On this screen y grows DOWNWARD, so up makes y smaller and down makes y bigger. Key names are "left", "up" and "down".'
  - 'Add three blocks. For example the first is: if game.key_down("left"):  then indented  x = x - speed * dt   (up uses y = y - speed * dt, down uses y = y + speed * dt).'
solution:
  - name: main.py
    code: |
      import game

      x = 160
      y = 120
      size = 24
      speed = 120      # pixels per second

      def update(dt):
          global x, y
          # The right arrow is done for you:
          if game.key_down("right"):
              x = x + speed * dt
          # 1. If the left key is held, make x smaller.
          if game.key_down("left"):
              x = x - speed * dt
          # 2. If the up key is held, make y smaller.
          if game.key_down("up"):
              y = y - speed * dt
          # 3. If the down key is held, make y bigger.
          if game.key_down("down"):
              y = y + speed * dt


      def draw():
          game.clear(game.DARK)
          game.rect(x, y, size, size, game.ORANGE)
          game.text(10, 10, "Use the arrow keys", game.WHITE, 14)

      game.run(update, draw)
quiz:
  - q: "What does game.key_down(\"left\") return?"
    options: ["True for every frame while the left key is held", "True only on the one frame when the key is first pressed", "The number of times left was pressed"]
    answer: 0
  - q: "To move the player UP the screen, what must happen to y?"
    options: ["y gets bigger", "y stays the same", "y gets smaller"]
    answer: 2
    explain: "y counts from the top, so smaller y means higher up."
  - q: "A game runs at 30 frames per second on one computer and 120 on another. Why does speed * dt keep the player's speed equal?"
    options: ["dt is bigger when there are more frames", "dt is smaller when there are more frames, so each step is smaller but there are more of them", "dt is always exactly 1"]
    answer: 1
  - q: "Which statement is true about two if blocks, one for left and one for right, both inside update?"
    options: ["Only one of them can ever run", "Both run, so holding both keys cancels the movement out", "Python raises an error"]
    answer: 1
    explain: "They are separate ifs, so each checks its own key every frame."
---

A game you cannot control is just a screensaver. In this lesson you will read the keyboard and make the player move in all four directions, at a speed that does not depend on how fast the computer is.

## Asking "is this key held?"

The engine gives you two questions you can ask about a key:

| Function | True when... | Use it for |
| --- | --- | --- |
| `game.key_down("left")` | the key is **held**, on every frame | walking, steering |
| `game.key_pressed("space")` | the key **went down this very frame** | jumping, shooting |

The key names you can use are `left right up down space a d w s z x enter`. Names are text, so they need quotes. You will use `key_pressed` in a later lesson; today it is all `key_down`.

Because `update` runs about 60 times a second, you ask the question again every frame:

```python
def update(dt):
    global x
    if game.key_down("right"):
        x = x + speed * dt
```

While you hold the right arrow, `key_down("right")` is `True` for each frame and `x` grows a little each time. Let go, and nothing happens.

## Why dt matters (again)

Imagine `speed = 120` pixels per second. At 60 frames per second `dt` is about `1/60`, so each frame moves `120 * (1/60) = 2` pixels. At 120 frames per second `dt` is `1/120`, each step is 1 pixel, but there are twice as many steps. After one second the player has moved 120 pixels either way. If you forgot `dt` and added `2` each frame, the player on the faster computer would move twice as fast, and the game would feel different for every player.

## Four directions, four ifs

Each direction is its own `if`. Remember the direction of the axes:

- right: `x` gets bigger, left: `x` gets smaller.
- down: `y` gets bigger, up: `y` gets smaller (y counts from the **top**).

Because they are separate `if`s, holding two keys works for free: hold right and down and the player moves diagonally.

```python
if game.key_down("a"):
    x = x - speed * dt    # the letter keys work too: a d w s
```

## Making the speed a variable

Putting the speed in a variable (`speed = 120`) means you can tune the feel of the game by changing one number. Try `60` for a sleepy player and `300` for a rocket. You can even make the player faster while a key like `x` is held, which is a nice experiment for later.

> **Watch out:** `game.key_down(left)` without quotes raises `NameError: name 'left' is not defined`. Key names are text.
>
> **Watch out:** writing `game.key_down("Left")` works (the engine lowercases names), but `"arrow_left"` or `"leftarrow"` is not a key and will simply never be pressed. Use exactly `left right up down`.
>
> **Watch out:** forgetting to add `y` to the `global` line gives `UnboundLocalError` when you try to change `y`.
>
> **Watch out:** the player moves the wrong way vertically? Remember that y grows downward, so "up" must **subtract**.

> **Your turn:** the right arrow is written for you. Add the left, up and down arrows with the same pattern. Press Run and test them with your keyboard before you click Check answer.
