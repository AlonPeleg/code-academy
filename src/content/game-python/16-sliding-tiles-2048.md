---
title: "Sliding tiles (2048): move and merge on a grid"
summary: Write the slide-and-merge logic for one row, reuse it for all four directions with transpose and reverse, and test it with plain function calls.
level: advanced
runner: pygame
files:
  - name: main.py
    code: |
      import game

      grid = [[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 4, 4], [0, 0, 0, 0]]   # 0 = empty cell
      score = 0
      state = "playing"
      DIRS = ["left", "right", "up", "down"]
      PALETTE = [game.GRAY, game.CYAN, game.GREEN, game.YELLOW, game.ORANGE, game.RED, game.PINK, game.PURPLE]

      def slide_left(row):
          # 1. Slide one row to the left and merge. Return (new_row, points).
          # Keep only the non-zero tiles. Walk through them: if a tile equals the next
          # one, add one tile of double the value (points grow by that value) and skip
          # both, otherwise copy the tile. Pad the result with zeros to length 4.
          return list(row), 0

      def transpose(g):
          return [list(r) for r in zip(*g)]       # swaps rows and columns

      def move(g, direction):
          # 2. Move the whole grid in a direction and return (new_grid, points).
          # Up and down: work on transpose(g) (the columns become rows).
          # Right and down: reverse every row ([::-1]) before sliding left, and
          # reverse the result back. Finally transpose back for up and down.
          return [list(r) for r in g], 0

      def spawn(g):
          for r in range(4):                      # put a new 2 in the first empty cell
              for c in range(4):
                  if g[r][c] == 0:
                      g[r][c] = 2
                      return

      def stuck(g):
          # 3. True when no direction changes the grid any more (game over).
          return False

      def update(dt):
          global grid, score, state
          if state != "playing":
              return
          # 4. For each direction d in DIRS, when game.key_pressed(d): call
          # move(grid, d). Only if the new grid is different from grid, make it the
          # grid, add the points to score and spawn() a new tile. Then if stuck(grid),
          # the state becomes "game over".

      def draw():
          game.clear(game.DARK)
          for r in range(4):
              for c in range(4):
                  v = grid[r][c]
                  x, y = 60 + c * 50, 20 + r * 50
                  game.rect(x, y, 46, 46, PALETTE[min(v.bit_length(), 8) - 1] if v else game.GRAY)
                  if v:
                      game.text(x + 8, y + 12, v, game.DARK, 20)
          game.text(6, 224, "Score " + str(score) + "  " + ("" if state == "playing" else state.upper()), game.WHITE, 12)

      game.run(update, draw)
check:
  game:
    frames: 10
    keys:
      - { key: left, from: 0, to: 2 }
    expect: >-
      slide_left([2, 2, 2, 2]) == ([4, 4, 0, 0], 8)
      and slide_left([2, 0, 2, 4]) == ([4, 4, 0, 0], 4)
      and slide_left([4, 4, 8, 0]) == ([8, 8, 0, 0], 8)
      and slide_left([0, 0, 0, 2]) == ([2, 0, 0, 0], 0)
      and move([[0, 0, 2, 2], [0, 0, 0, 0], [4, 0, 0, 0], [4, 0, 0, 0]], 'up') == ([[8, 0, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 8)
      and move([[0, 0, 2, 2], [0, 0, 0, 0], [4, 0, 0, 0], [4, 0, 0, 0]], 'down') == ([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [8, 0, 2, 2]], 8)
      and move([[2, 2, 0, 0]] + [[0] * 4] * 3, 'right')[0][0] == [0, 0, 0, 4]
      and stuck([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]]) is True
      and stuck(grid) is False
      and grid[0] == [4, 2, 0, 0] and grid[2] == [8, 0, 0, 0] and score == 12 and state == 'playing'
    message: "The check calls slide_left and move directly: [2,2,2,2] must become [4,4,0,0] with 8 points (each tile merges only once per move), moves up, down and right must work on whole grids, stuck() must recognise a full grid with no equal neighbours, and after pressing left once in the live game the grid must be [[4,2,0,0], ..., [8,0,0,0], ...] with score 12 (a new 2 appears in the first empty cell)."
  code:
    - { pattern: 'def\s+slide_left', message: "Keep the function slide_left(row)." }
    - { pattern: 'transpose\(', message: "Use transpose to turn columns into rows for up and down." }
    - { pattern: '\[\s*::\s*-1\s*\]', message: "Reverse a row with row[::-1] to reuse slide_left for right and down." }
    - { pattern: 'key_pressed\(\s*d\s*\)', message: "Read the keys with game.key_pressed(d) in a loop over DIRS." }
hints:
  - "Start with one row going left, in three stages: drop the zeros, merge equal neighbours (each tile at most once, left to right), pad with zeros to length 4. Return the new row and the points as a pair."
  - "The other directions are the same job in disguise. Right is left on a reversed row (reverse before and after). Up and down are left and right on the transposed grid (columns become rows). So move() just reverses and/or transposes around slide_left."
  - "tiles = [v for v in row if v != 0]; out, points, i = [], 0, 0; while i < len(tiles): if i + 1 < len(tiles) and tiles[i] == tiles[i + 1]: out.append(tiles[i] * 2); points = points + tiles[i] * 2; i = i + 2; else: out.append(tiles[i]); i = i + 1  /  return out + [0] * (4 - len(out)), points  /  in move: rows = transpose(g) if direction in ('up', 'down') else [list(r) for r in g]; if direction in ('right', 'down'): row = row[::-1] before sliding and new = new[::-1] after"
solution:
  - name: main.py
    code: |
      import game

      grid = [[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 4, 4], [0, 0, 0, 0]]   # 0 = empty cell
      score = 0
      state = "playing"
      DIRS = ["left", "right", "up", "down"]
      PALETTE = [game.GRAY, game.CYAN, game.GREEN, game.YELLOW, game.ORANGE, game.RED, game.PINK, game.PURPLE]

      def slide_left(row):
          # 1. Slide one row to the left and merge. Return (new_row, points).
          # Keep only the non-zero tiles. Walk through them: if a tile equals the next
          # one, add one tile of double the value (points grow by that value) and skip
          # both, otherwise copy the tile. Pad the result with zeros to length 4.
          tiles = [v for v in row if v != 0]
          out, points, i = [], 0, 0
          while i < len(tiles):
              if i + 1 < len(tiles) and tiles[i] == tiles[i + 1]:
                  out.append(tiles[i] * 2)
                  points = points + tiles[i] * 2
                  i = i + 2
              else:
                  out.append(tiles[i])
                  i = i + 1
          return out + [0] * (4 - len(out)), points

      def transpose(g):
          return [list(r) for r in zip(*g)]       # swaps rows and columns

      def move(g, direction):
          # 2. Move the whole grid in a direction and return (new_grid, points).
          # Up and down: work on transpose(g) (the columns become rows).
          # Right and down: reverse every row ([::-1]) before sliding left, and
          # reverse the result back. Finally transpose back for up and down.
          rows = transpose(g) if direction in ("up", "down") else [list(r) for r in g]
          out, total = [], 0
          for row in rows:
              if direction in ("right", "down"):
                  row = row[::-1]
              new, points = slide_left(row)
              if direction in ("right", "down"):
                  new = new[::-1]
              out.append(new)
              total = total + points
          if direction in ("up", "down"):
              out = transpose(out)
          return out, total

      def spawn(g):
          for r in range(4):                      # put a new 2 in the first empty cell
              for c in range(4):
                  if g[r][c] == 0:
                      g[r][c] = 2
                      return

      def stuck(g):
          # 3. True when no direction changes the grid any more (game over).
          return all(move(g, d)[0] == g for d in DIRS)

      def update(dt):
          global grid, score, state
          if state != "playing":
              return
          # 4. For each direction d in DIRS, when game.key_pressed(d): call
          # move(grid, d). Only if the new grid is different from grid, make it the
          # grid, add the points to score and spawn() a new tile. Then if stuck(grid),
          # the state becomes "game over".
          for d in DIRS:
              if game.key_pressed(d):
                  new, points = move(grid, d)
                  if new != grid:
                      grid = new
                      score = score + points
                      spawn(grid)
          if stuck(grid):
              state = "game over"

      def draw():
          game.clear(game.DARK)
          for r in range(4):
              for c in range(4):
                  v = grid[r][c]
                  x, y = 60 + c * 50, 20 + r * 50
                  game.rect(x, y, 46, 46, PALETTE[min(v.bit_length(), 8) - 1] if v else game.GRAY)
                  if v:
                      game.text(x + 8, y + 12, v, game.DARK, 20)
          game.text(6, 224, "Score " + str(score) + "  " + ("" if state == "playing" else state.upper()), game.WHITE, 12)

      game.run(update, draw)
quiz:
  - q: "What does slide_left([2, 2, 2, 2]) give?"
    options: ["[8, 0, 0, 0]", "[4, 4, 0, 0]", "[2, 2, 2, 2]"]
    answer: 1
    explain: "Merging goes from the left and each tile may merge only once per move: (2+2) and (2+2), not 2+2+2+2."
  - q: "How do you reuse slide_left to move a row to the RIGHT?"
    options: ["Write a second function from scratch", "Call slide_left twice", "Reverse the row, slide it left, and reverse the result back"]
    answer: 2
  - q: "What does transpose(grid) do?"
    options: ["It swaps rows and columns, so the columns of the grid become its rows", "It turns every tile into zero", "It sorts the grid"]
    answer: 0
  - q: "Why does update only call spawn() when the new grid is different from the old one?"
    options: ["spawn is slow", "A move that changes nothing should not give the player a free new tile", "Python cannot compare grids"]
    answer: 1
---
2048 looks like a graphics game, but it is really a **puzzle in data**. If you get the grid logic right, the rest is drawing colored squares. This lesson is about **reducing a problem**: we write the slide-and-merge rule for one row moving left, and then get the other three directions almost for free by *transforming* the grid. It is a way of thinking you will use all your programming life: solve one case well, then turn the other cases into that case.

## The rules

Tiles slide as far as they can in the chosen direction. Two equal tiles that collide merge into one tile of double the value, and the player earns that value as points. Two details matter:

* a tile merges **at most once** per move, so a row `[2, 2, 2, 2]` becomes `[4, 4, 0, 0]` (not `[8, 0, 0, 0]`),
* merging happens **toward the move direction**: `[2, 2, 2]` moving left gives `[4, 2, 0, 0]`.

We keep the grid as a list of four rows, each a list of four numbers, with 0 meaning an empty cell.

## Step 1: one row, to the left

The function `slide_left(row)` has three stages:

1. **Compress**: keep only the tiles that are not zero: `tiles = [v for v in row if v != 0]`.
2. **Merge**: walk through `tiles` with an index `i`. If the tile equals the next one, output one doubled tile, add its value to `points`, and jump ahead by 2 so neither tile is used again. Otherwise copy the tile and move ahead by 1. A `while` loop fits better than `for` here, because the step size changes.
3. **Pad**: add zeros until the row has 4 items: `out + [0] * (4 - len(out))`.

It returns **two values** as a tuple `(new_row, points)`. Python lets a function return several things; the caller receives them with `new, points = slide_left(row)`.

The function never changes its input row; it builds a new one. Functions that do not modify their inputs are much easier to test and to trust.

## Step 2: the other three directions

Instead of four separate algorithms we **transform** the grid so that every move becomes a move to the left:

| Direction | Trick |
|---|---|
| left | slide each row as it is |
| right | reverse each row (`row[::-1]`), slide left, reverse the result back |
| up | `transpose` the grid (columns become rows), slide left, transpose back |
| down | transpose, then do the "right" trick, then transpose back |

`transpose` is written for you: `zip(*g)` pairs up the first items of all rows, then the second items, and so on, which turns columns into rows. The slice `row[::-1]` is the whole list read backwards. `move(g, direction)` returns `(new_grid, total_points)` and, again, leaves `g` untouched.

## Step 3: the game around it

In `update`, for each direction `d` in `DIRS`, if `game.key_pressed(d)` we call `move`. The key is crucial: only when the new grid is **different** (`new != grid`; Python compares lists item by item) does the move count. Then the grid is replaced, the points are added and `spawn()` drops a new tile, so a useless key press never gives a free tile. The game is over when `stuck(grid)`: no direction changes the grid. That function is one line, `all(move(g, d)[0] == g for d in DIRS)`, because *trying* a move is a cheap way to ask whether it is possible. (The real game spawns a 2 or 4 at a random empty cell; we use the first empty cell so that the check can predict it.)

> **Watch out:** `TypeError: cannot unpack non-iterable NoneType object` on `new, points = move(...)` means `move` forgot its `return` statement.
>
> **Watch out:** if the grid seems to change by itself, you modified the input list. `[list(r) for r in g]` makes a real copy of every row, while `new_grid = g` only gives the same grid a second name.
>
> **Watch out:** `[2, 2, 2, 2]` turning into `[8, 0, 0, 0]` means the merged tile was merged again. Skip both tiles (`i = i + 2`) after a merge.
>
> **Watch out:** a grid made as `[[0] * 4] * 4` has four rows that are the very same list. Use a list comprehension, or copy rows with `list(r)`.

## Going further

Spawn a 2 or a 4 at a random empty cell (`random.choice`), add a "you reached 2048" win state, animate sliding tiles, or write `undo` by keeping a list of old grids (easy, because moves never modify the old one!).

> **Your turn:** write the four TODO parts (`slide_left`, `move`, `stuck` and the key handling). Then play with the arrow keys. The check calls your functions directly with example rows and grids, and also presses left once in the live game.
