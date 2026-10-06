---
title: Shapes, colors and tuples
summary: Draw circles, lines and text, and mix your own colors with tuples to paint a little scene.
level: beginner
runner: pygame
files:
  - name: main.py
    code: |
      import game

      # 1. Make your own sky color: a tuple of three numbers (red, green, blue), each 0 to 255.
      SKY = None
      GRASS = (60, 170, 80)
      sun_x = 40

      def update(dt):
          global sun_x
          sun_x = sun_x + 40 * dt      # the sun drifts slowly to the right

      def draw():
          game.clear(SKY)
          game.rect(0, 180, game.WIDTH, 60, GRASS)
          # 2. The sun: a yellow circle at (sun_x, 50) with radius 20.

          # 3. A tree trunk: a thick brown line from (250, 180) up to (250, 130), width 8.
          #    Brown is (120, 80, 40).

          # 4. A tree top: a green circle at (250, 120) with radius 25.

          # 5. A title in the top-left corner: any message you like.


      game.run(update, draw)
check:
  game:
    frames: 60
    expect: "isinstance(SKY, tuple) and len(SKY) == 3 and all(0 <= c <= 255 for c in SKY) and 70 < sun_x < 90"
    message: "SKY must be a tuple like (120, 190, 255) and the sun should drift to the right."
  code:
    - { pattern: 'SKY\s*=\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)', message: "Make SKY a tuple of three numbers, for example SKY = (120, 190, 255)." }
    - { pattern: 'game\.circle\(', message: "Use game.circle(x, y, radius, color) for the sun and the tree top." }
    - { pattern: 'game\.line\(', message: "Use game.line(x1, y1, x2, y2, color, width) for the trunk." }
    - { pattern: 'game\.text\(', message: "Use game.text(x, y, message, color, size) for the title." }
hints:
  - 'A color is a tuple of three whole numbers from 0 to 255 in round brackets: (red, green, blue). Bigger numbers mean more of that light, so (0, 0, 0) is black and (255, 255, 255) is white.'
  - 'The shape calls are game.circle(x, y, radius, color), game.line(x1, y1, x2, y2, color, width) and game.text(x, y, message, color, size). A circle is placed by its CENTER. A sky blue is about (120, 190, 255).'
  - 'Set SKY = (120, 190, 255) at the top. Then in draw add: game.circle(sun_x, 50, 20, game.YELLOW)   game.line(250, 180, 250, 130, (120, 80, 40), 8)   game.circle(250, 120, 25, game.GREEN)   game.text(10, 10, "My scene", game.WHITE, 16)'
solution:
  - name: main.py
    code: |
      import game

      # 1. Make your own sky color: a tuple of three numbers (red, green, blue), each 0 to 255.
      SKY = (120, 190, 255)
      GRASS = (60, 170, 80)
      sun_x = 40

      def update(dt):
          global sun_x
          sun_x = sun_x + 40 * dt      # the sun drifts slowly to the right

      def draw():
          game.clear(SKY)
          game.rect(0, 180, game.WIDTH, 60, GRASS)
          # 2. The sun: a yellow circle at (sun_x, 50) with radius 20.
          game.circle(sun_x, 50, 20, game.YELLOW)
          # 3. A tree trunk: a thick brown line from (250, 180) up to (250, 130), width 8.
          game.line(250, 180, 250, 130, (120, 80, 40), 8)
          # 4. A tree top: a green circle at (250, 120) with radius 25.
          game.circle(250, 120, 25, game.GREEN)
          # 5. A title in the top-left corner: any message you like.
          game.text(10, 10, "My scene", game.WHITE, 16)


      game.run(update, draw)
quiz:
  - q: "Which is a valid color?"
    options: ["(255, 0)", "(0, 120, 255)", "[red, green, blue]"]
    answer: 1
    explain: "A color needs exactly three numbers: red, green, blue."
  - q: "Where is the point (x, y) of game.circle(x, y, radius, color)?"
    options: ["The top-left corner", "The bottom-right corner", "The center of the circle"]
    answer: 2
    explain: "Rectangles use their top-left corner, but circles are placed by their center."
  - q: "What is special about a tuple like (255, 0, 0) compared with a list?"
    options: ["It cannot be printed", "It cannot be changed after it is created", "It can hold only numbers"]
    answer: 1
  - q: "Things drawn later in draw()..."
    options: ["Appear behind earlier things", "Are hidden", "Appear on top of earlier things"]
    answer: 2
    explain: "Painting works in layers: the last thing you paint is the top layer."
---

So far we drew boxes. In this lesson you add circles, lines and text, learn how colors really work, and paint a small scene. Along the way you meet a new Python type: the **tuple**.

## Colors are tuples

Every color is three numbers: how much **red**, **green** and **blue** light, each from 0 (none) to 255 (full). Python groups several values in round brackets into a **tuple**:

```python
RED_LIKE = (255, 0, 0)       # all red, no green, no blue
SKY      = (120, 190, 255)   # a light blue
BLACK    = (0, 0, 0)
WHITE    = (255, 255, 255)
```

A tuple is like a list, but it **cannot be changed** after it is made, which is perfect for a color. The built-in names such as `game.RED` or `game.CYAN` are simply tuples somebody saved for you. You can use a name or write the numbers directly in a call:

```python
game.rect(10, 10, 50, 50, (255, 128, 0))   # an orange made on the spot
```

Giving your own colors a name in CAPITALS at the top (`SKY = (...)`) keeps drawing code easy to read, and you can change the look of the whole game in one place.

Tip: an equal mix gives gray (`(100, 100, 100)`), mixing red and green gives yellow (`(255, 255, 0)`), and bigger numbers are brighter. Try values in the lesson and see what happens.

## The drawing toolbox

| Call | Meaning |
| --- | --- |
| `game.clear(color)` | Fill the whole screen (do it first). |
| `game.rect(x, y, w, h, color)` | Rectangle. `(x, y)` is the **top-left** corner. |
| `game.circle(x, y, radius, color)` | Circle. `(x, y)` is the **center**. |
| `game.line(x1, y1, x2, y2, color, width)` | A line between two points; `width` is the thickness in pixels (default 1). |
| `game.text(x, y, message, color, size)` | Text. `(x, y)` is the top-left; `size` in pixels. |

Paint works in **layers**: whatever you draw last lands on top. So draw the sky first, the ground next, and things in front last.

```python
def draw():
    game.clear((120, 190, 255))             # sky
    game.circle(80, 50, 20, game.YELLOW)    # sun, on top of the sky
    game.line(0, 100, 320, 100, game.WHITE, 3)
    game.text(10, 10, "Score: " + str(5), game.WHITE, 16)
```

## Plan your picture with coordinates

Remember `(0, 0)` is the top-left and y grows downward. A trunk that goes from the ground `y = 180` **up** to `y = 130` has a smaller second y. When a scene looks wrong, sketch it on paper with the 320 by 240 grid.

## Mixing drawing and state

Drawing is just a picture of your variables. In this scene the sun's position `sun_x` changes in `update`, and `draw` reads it, so the sun drifts across the sky. That split (update changes numbers, draw shows them) is the same in every game.

> **Watch out:** `TypeError: a color must be three numbers like (255, 0, 0), but got None` means a color variable was never filled in (like the `SKY = None` in the starter), or you passed only two numbers.
>
> **Watch out:** colors outside 0 to 255 may look odd. Keep to that range.
>
> **Watch out:** `game.circle(100, 50, game.RED)` forgot the radius, so the engine reads the color as the radius. Check the order: x, y, radius, color.
>
> **Watch out:** a shape hidden behind another one? It was drawn too early. Move its line lower in `draw`.

> **Your turn:** make `SKY` your own color tuple, then draw the sun with a circle, the tree trunk with a thick line, the tree top with another circle, and a title with `game.text`. Press Run to see it, then check it.
