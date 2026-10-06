---
title: Collision and collecting coins
summary: Write a function that tests whether two rectangles overlap, then use it to collect coins and keep score.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      px = 20
      py = 100
      SIZE = 24
      coin_spots = [(150, 100), (150, 30), (40, 30)]   # a fixed list of places
      coin_number = 0                                  # which place the coin is at
      score = 0

      def touching(ax, ay, aw, ah, bx, by, bw, bh):
          # 1. Return True when rectangle A and rectangle B overlap.
          return False

      def update(dt):
          global px, py, coin_number, score
          if game.key_down("left"):
              px = px - 150 * dt
          if game.key_down("right"):
              px = px + 150 * dt
          if game.key_down("up"):
              py = py - 150 * dt
          if game.key_down("down"):
              py = py + 150 * dt

          cx, cy = coin_spots[coin_number]
          if touching(px, py, SIZE, SIZE, cx, cy, 16, 16):
              # 2. Add 1 to the score and move on to the next place in the list
              #    (after the last one, go back to the first).
              pass

      def draw():
          game.clear(game.DARK)
          cx, cy = coin_spots[coin_number]
          game.rect(cx, cy, 16, 16, game.YELLOW)
          game.rect(px, py, SIZE, SIZE, game.CYAN)
          game.text(10, 10, "Score: " + str(score), game.WHITE, 16)

      game.run(update, draw)
check:
  game:
    frames: 130
    keys:
      - { key: right, from: 0, to: 50 }
      - { key: up, from: 50, to: 80 }
      - { key: left, from: 80, to: 130 }
    expect: "score == 3 and touching(0, 0, 10, 10, 5, 5, 10, 10) and not touching(0, 0, 10, 10, 20, 20, 5, 5) and not touching(0, 0, 10, 10, 10, 0, 5, 5)"
    message: "Walk right, then up, then left to hit all three coins. The score should be 3, and touching() must say True only when the rectangles really overlap."
  code:
    - { pattern: 'score\s*(\+=|=\s*score\s*\+)\s*1', message: "Add 1 to score when the player touches the coin." }
    - { pattern: 'coin_number\s*(\+=|=\s*\(?\s*coin_number\s*\+)', message: "Move coin_number on to the next place." }
hints:
  - 'Two rectangles overlap only when they overlap on the x axis AND on the y axis. Check four conditions joined with "and".'
  - 'A is to the left of B''s right side: ax < bx + bw. A''s right side is past B''s left: ax + aw > bx. Same for y with ay, ah, by, bh.'
  - 'return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by     then inside the if: score = score + 1  and  coin_number = (coin_number + 1) % len(coin_spots)'
solution:
  - name: main.py
    code: |
      import game

      px = 20
      py = 100
      SIZE = 24
      coin_spots = [(150, 100), (150, 30), (40, 30)]   # a fixed list of places
      coin_number = 0                                  # which place the coin is at
      score = 0

      def touching(ax, ay, aw, ah, bx, by, bw, bh):
          # 1. Return True when rectangle A and rectangle B overlap.
          return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by

      def update(dt):
          global px, py, coin_number, score
          if game.key_down("left"):
              px = px - 150 * dt
          if game.key_down("right"):
              px = px + 150 * dt
          if game.key_down("up"):
              py = py - 150 * dt
          if game.key_down("down"):
              py = py + 150 * dt

          cx, cy = coin_spots[coin_number]
          if touching(px, py, SIZE, SIZE, cx, cy, 16, 16):
              # 2. Add 1 to the score and move on to the next place in the list
              #    (after the last one, go back to the first).
              score = score + 1
              coin_number = (coin_number + 1) % len(coin_spots)

      def draw():
          game.clear(game.DARK)
          cx, cy = coin_spots[coin_number]
          game.rect(cx, cy, 16, 16, game.YELLOW)
          game.rect(px, py, SIZE, SIZE, game.CYAN)
          game.text(10, 10, "Score: " + str(score), game.WHITE, 16)

      game.run(update, draw)
quiz:
  - q: "Two rectangles overlap only if they overlap on..."
    options: ["the x axis only", "the y axis only", "both the x axis and the y axis"]
    answer: 2
  - q: "What does the % operator do in (n + 1) % 3?"
    options: ["Divides and keeps the decimals", "Gives the remainder after dividing, so the number wraps back to 0 after 2", "Calculates a percentage"]
    answer: 1
    explain: "(2 + 1) % 3 is 0, so the coin goes back to the first spot."
  - q: "Why do we use a fixed list of coin positions here instead of random ones?"
    options: ["Random numbers do not exist in Python", "So the game plays out the same every time and can be tested", "Because lists are faster than random"]
    answer: 1
  - q: "What does a function that ends with  return ax < bx + bw and ...  give back?"
    options: ["True or False", "A list of rectangles", "The score"]
    answer: 0
---

Games come alive when things **touch**: the player grabs a coin, a bullet hits an enemy, a character lands on the floor. The test for "do these two rectangles touch?" is called **collision detection**. In this lesson you will write it once as a function, and use it to collect coins and count a score.

## Overlap, one axis at a time

Imagine two bars on a number line. Bar A goes from `ax` to `ax + aw`. Bar B goes from `bx` to `bx + bw`. They overlap when A starts before B ends **and** A ends after B starts:

```python
ax < bx + bw  and  ax + aw > bx
```

Two rectangles overlap only if this is true for the x axis **and** for the y axis. Joining the four conditions with `and` gives the complete test:

```python
def touching(ax, ay, aw, ah, bx, by, bw, bh):
    return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by
```

A function that `return`s a comparison hands back `True` or `False`, so you can write `if touching(...):` directly. Notice how we use `<` and `>` and not `<=`: rectangles that only share an edge do not count as touching.

Test it in your head with `touching(0, 0, 10, 10, 5, 5, 10, 10)`: the squares share a corner area from 5 to 10, so it is `True`. With `touching(0, 0, 10, 10, 20, 20, 5, 5)` the second square is far away, so it is `False`.

## A coin that jumps

Instead of making a new coin each time, keep **one** coin and move it to the next place when it is collected. The places live in a list of tuples:

```python
coin_spots = [(150, 100), (150, 30), (40, 30)]
coin_number = 0
cx, cy = coin_spots[coin_number]     # unpack a tuple into two variables
```

`coin_spots[0]` is the first tuple, `(150, 100)`. Writing `cx, cy = ...` splits it into two variables (this is called *unpacking*).

When the player touches the coin:

```python
score = score + 1
coin_number = (coin_number + 1) % len(coin_spots)
```

`len(coin_spots)` is `3`. The `%` operator gives the **remainder** of a division. `0, 1, 2, 3, 4...` become `1, 2, 0, 1, 2...` when you do `(n + 1) % 3`, so the coin walks through the list and starts over after the last spot, and you never go past the end of the list.

> **Why a fixed list and not `random`?** A fixed list makes the game predictable. Our check can walk the player along a known path and know exactly how many coins are collected. Once your game works, replacing the list by random positions (`import random` and `random.randint(0, 300)`) is a nice upgrade.

> **Watch out:** `IndexError: list index out of range` means `coin_number` went past the end. The `% len(coin_spots)` fixes that.
>
> **Watch out:** forgetting to put `score` and `coin_number` on the `global` line gives `UnboundLocalError`.
>
> **Watch out:** mixing up a rectangle's width and its x position (`ax + aw` means the **right edge**). Draw two squares on paper if you get lost.
>
> **Watch out:** if the score shoots up by dozens in a second, the coin did not move away after being touched, so it counts on every frame.

## Going further

Draw the coin as a circle, add a timer, or make the player grow every time a coin is collected.

> **Your turn:** finish `touching` so it returns `True` only when the two rectangles overlap, then, when the player touches the coin, add 1 to `score` and move `coin_number` on to the next place (wrapping around with `%`).
