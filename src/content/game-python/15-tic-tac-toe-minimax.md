---
title: "Tic-tac-toe with an unbeatable AI (minimax)"
summary: Write a computer player that looks at every possible future of the game with the minimax algorithm, and test its decisions as plain function calls.
level: advanced
runner: pygame
files:
  - name: main.py
    code: |
      import game

      LINES = [(0, 1, 2), (3, 4, 5), (6, 7, 8), (0, 3, 6), (1, 4, 7), (2, 5, 8), (0, 4, 8), (2, 4, 6)]
      board = [""] * 9                # "" = empty, otherwise "X" (you) or "O" (the computer)
      state = "playing"               # "playing", "X wins", "O wins" or "draw"
      SIZE, OX, OY = 70, 55, 15       # cell size and the top-left corner of the board

      def winner(b):
          # returns "X" or "O" if that player has three in a row, otherwise None
          for i, j, k in LINES:
              if b[i] != "" and b[i] == b[j] == b[k]:
                  return b[i]
          return None

      def other(player):
          return "O" if player == "X" else "X"

      def minimax(b, player, depth=0):
          # 1. The value of board b when `player` is about to move and both sides
          # play perfectly. depth counts the moves played since the search began.
          # Base cases first: O has won gives 10 - depth, X has won gives depth - 10
          # (so quick wins score more), a full board gives 0.
          # Otherwise try every empty cell: place player there, call
          # minimax(b, other(player), depth + 1), take the piece back, and collect the
          # scores. O picks the biggest score (max), X the smallest (min).
          return 0

      def best_move(b):
          # 2. The cell index where O should play: try every empty cell with O,
          # score it with minimax(b, "X", 1), undo it, and keep the cell with the highest
          # score (the first one wins a tie). Return -1 if there is no empty cell.
          return b.index("")   # placeholder: always the first free cell

      def update(dt):
          global state
          if state != "playing":
              if game.key_pressed("enter"):
                  board[:] = [""] * 9
                  state = "playing"
              return
          if game.mouse_pressed():
              mx, my = game.mouse_pos()
              col, row = (mx - OX) // SIZE, (my - OY) // SIZE
              if 0 <= col < 3 and 0 <= row < 3 and board[row * 3 + col] == "":
                  board[row * 3 + col] = "X"
                  if winner(board) == "X":
                      state = "X wins"
                  elif "" in board:
                      board[best_move(board)] = "O"        # the computer answers at once
                      if winner(board) == "O":
                          state = "O wins"
                  if state == "playing" and "" not in board:
                      state = "draw"

      def draw():
          game.clear(game.DARK)
          for n in (1, 2):
              game.line(OX + n * SIZE, OY, OX + n * SIZE, OY + 3 * SIZE, game.GRAY, 3)
              game.line(OX, OY + n * SIZE, OX + 3 * SIZE, OY + n * SIZE, game.GRAY, 3)
          for i in range(9):
              x, y = OX + (i % 3) * SIZE, OY + (i // 3) * SIZE
              if board[i] == "X":
                  game.line(x + 15, y + 15, x + SIZE - 15, y + SIZE - 15, game.CYAN, 5)
                  game.line(x + SIZE - 15, y + 15, x + 15, y + SIZE - 15, game.CYAN, 5)
              elif board[i] == "O":
                  game.circle(x + SIZE / 2, y + SIZE / 2, 22, game.PINK)
                  game.circle(x + SIZE / 2, y + SIZE / 2, 14, game.DARK)
          game.text(8, 226, state if state != "playing" else "Your move (X)", game.WHITE, 12)

      game.run(update, draw)
check:
  game:
    frames: 1
    expect: >-
      best_move(["X", "X", "", "O", "O", "", "", "", ""]) == 5
      and best_move(["X", "X", "", "O", "", "", "", "", ""]) == 2
      and best_move(["X", "", "", "", "", "", "", "", ""]) == 4
      and minimax(["X", "", "", "", "", "", "", "", ""], "O") == 0
      and minimax(["X", "X", "", "O", "O", "", "", "", ""], "X") == -9
      and best_move(["X"] * 9) == -1
    message: "The check calls your functions directly. With O to move on X X _ / O O _ the best move is the winning cell 5; on X X _ / O _ _ O must block at cell 2; against a corner opening O takes the center (4) and the game is a draw (minimax value 0); and a full board has no move (-1)."
  code:
    - { pattern: 'minimax\(\s*b\s*,\s*other\(player\)\s*,\s*depth\s*\+\s*1\s*\)', message: "Recurse with the other player and one more move of depth: minimax(b, other(player), depth + 1)." }
    - { pattern: 'max\(\s*scores\s*\)', message: "The computer (O) picks the largest score with max(scores)." }
    - { pattern: 'min\(\s*scores\s*\)', message: "The human (X) picks the smallest score with min(scores)." }
    - { pattern: 'b\[i\]\s*=\s*""', message: "Undo the trial move (b[i] = \"\") after the recursive call." }
hints:
  - "Minimax imagines the whole game. For every empty cell: try the move, ask minimax what the rest of the game is worth (the other player moves next), then UNDO the move. O wants the highest value, X the lowest."
  - "Stop the recursion when the game is over: if winner(b) is O, return 10 - depth; if X won, return depth - 10 (so quicker wins are better); if the board is full, return 0. In best_move, start with best = -100 so any real score beats it."
  - "minimax: w = winner(b); if w == 'O': return 10 - depth; if w == 'X': return depth - 10; if '' not in b: return 0; scores = []; for i in range(9): if b[i] == '': b[i] = player; scores.append(minimax(b, other(player), depth + 1)); b[i] = ''  /  return max(scores) if player == 'O' else min(scores)  /  best_move: for each empty i: b[i] = 'O'; score = minimax(b, 'X', 1); b[i] = ''; if score > best: best, move = score, i"
solution:
  - name: main.py
    code: |
      import game

      LINES = [(0, 1, 2), (3, 4, 5), (6, 7, 8), (0, 3, 6), (1, 4, 7), (2, 5, 8), (0, 4, 8), (2, 4, 6)]
      board = [""] * 9                # "" = empty, otherwise "X" (you) or "O" (the computer)
      state = "playing"               # "playing", "X wins", "O wins" or "draw"
      SIZE, OX, OY = 70, 55, 15       # cell size and the top-left corner of the board

      def winner(b):
          # returns "X" or "O" if that player has three in a row, otherwise None
          for i, j, k in LINES:
              if b[i] != "" and b[i] == b[j] == b[k]:
                  return b[i]
          return None

      def other(player):
          return "O" if player == "X" else "X"

      def minimax(b, player, depth=0):
          # 1. The value of board b when `player` is about to move and both sides
          # play perfectly. depth counts the moves played since the search began.
          # Base cases first: O has won gives 10 - depth, X has won gives depth - 10
          # (so quick wins score more), a full board gives 0.
          # Otherwise try every empty cell: place player there, call
          # minimax(b, other(player), depth + 1), take the piece back, and collect the
          # scores. O picks the biggest score (max), X the smallest (min).
          w = winner(b)
          if w == "O":
              return 10 - depth
          if w == "X":
              return depth - 10
          if "" not in b:
              return 0
          scores = []
          for i in range(9):
              if b[i] == "":
                  b[i] = player
                  scores.append(minimax(b, other(player), depth + 1))
                  b[i] = ""
          return max(scores) if player == "O" else min(scores)

      def best_move(b):
          # 2. The cell index where O should play: try every empty cell with O,
          # score it with minimax(b, "X", 1), undo it, and keep the cell with the highest
          # score (the first one wins a tie). Return -1 if there is no empty cell.
          best, move = -100, -1
          for i in range(9):
              if b[i] == "":
                  b[i] = "O"
                  score = minimax(b, "X", 1)
                  b[i] = ""
                  if score > best:
                      best, move = score, i
          return move

      def update(dt):
          global state
          if state != "playing":
              if game.key_pressed("enter"):
                  board[:] = [""] * 9
                  state = "playing"
              return
          if game.mouse_pressed():
              mx, my = game.mouse_pos()
              col, row = (mx - OX) // SIZE, (my - OY) // SIZE
              if 0 <= col < 3 and 0 <= row < 3 and board[row * 3 + col] == "":
                  board[row * 3 + col] = "X"
                  if winner(board) == "X":
                      state = "X wins"
                  elif "" in board:
                      board[best_move(board)] = "O"        # the computer answers at once
                      if winner(board) == "O":
                          state = "O wins"
                  if state == "playing" and "" not in board:
                      state = "draw"

      def draw():
          game.clear(game.DARK)
          for n in (1, 2):
              game.line(OX + n * SIZE, OY, OX + n * SIZE, OY + 3 * SIZE, game.GRAY, 3)
              game.line(OX, OY + n * SIZE, OX + 3 * SIZE, OY + n * SIZE, game.GRAY, 3)
          for i in range(9):
              x, y = OX + (i % 3) * SIZE, OY + (i // 3) * SIZE
              if board[i] == "X":
                  game.line(x + 15, y + 15, x + SIZE - 15, y + SIZE - 15, game.CYAN, 5)
                  game.line(x + SIZE - 15, y + 15, x + 15, y + SIZE - 15, game.CYAN, 5)
              elif board[i] == "O":
                  game.circle(x + SIZE / 2, y + SIZE / 2, 22, game.PINK)
                  game.circle(x + SIZE / 2, y + SIZE / 2, 14, game.DARK)
          game.text(8, 226, state if state != "playing" else "Your move (X)", game.WHITE, 12)

      game.run(update, draw)
quiz:
  - q: "What does minimax assume about the opponent?"
    options: ["That the opponent plays randomly", "That the opponent never moves", "That the opponent also plays the best move for themselves"]
    answer: 2
    explain: "That is why the AI can never be tricked: it prepares for the strongest reply to every move."
  - q: "Why do we undo each trial move (b[i] = \"\") after the recursive call?"
    options: ["So the same board list can be reused to try the next cell, and the real game board is not changed", "To save memory by deleting the list", "To make the score negative"]
    answer: 0
  - q: "Why does a win return 10 - depth instead of always 1?"
    options: ["So draws score higher", "Because Python needs bigger numbers", "So the AI prefers a win in 2 moves over a win in 6 moves, and a slow loss over a quick loss"]
    answer: 2
  - q: "In the minimax tree, who picks the maximum score and who the minimum?"
    options: ["X picks the maximum, O the minimum", "O (the AI) picks the maximum and X (the opponent) the minimum", "Both pick the maximum"]
    answer: 1
---
Until now the enemies in our games followed simple rules: chase the ball, move left and right. In this lesson we build a computer player that **thinks ahead**. It is the classic algorithm behind chess programs, scaled down to tic-tac-toe, and it makes an opponent that never loses. Along the way you will meet **recursion**, a function that calls itself.

## The board and the logic layer

The board is a list of 9 strings, `""` for empty, `"X"` for you and `"O"` for the computer, numbered row by row:

```
0 | 1 | 2
3 | 4 | 5
6 | 7 | 8
```

`winner(b)` (written for you) checks the eight winning lines and returns `"X"`, `"O"` or `None`. As in the Memory lesson, the AI is a pure function of the board: it knows nothing about the mouse or the screen, so the automatic check can call it directly with boards it makes up.

## The idea: imagine every future

How would you choose a move if you could see the whole future? For each of your possible moves, you imagine the opponent's best reply, then your best reply to that, and so on until the game ends. A move that leads to a win in every imagined future is great, a move that lets the opponent win is terrible. That is minimax:

* Give every finished game a **score** from the computer's point of view: positive if O won, negative if X won, 0 for a draw.
* On O's turn, O picks the move with the **maximum** score.
* On X's turn, X picks the move with the **minimum** score (X wants O to do badly).

## Recursion

The function `minimax(b, player, depth)` returns the score of the position `b` when `player` is about to move, assuming both sides play perfectly. It works by calling itself:

```python
scores = []
for i in range(9):
    if b[i] == "":
        b[i] = player                                    # try the move
        scores.append(minimax(b, other(player), depth + 1))   # what is the rest of the game worth?
        b[i] = ""                                        # take it back
return max(scores) if player == "O" else min(scores)
```

Every recursive function needs a **base case**, a situation where it answers directly and stops calling itself. Here the base cases come first: somebody has won, or the board is full (a draw, score 0). Without them the function would call itself forever and Python stops it with `RecursionError: maximum recursion depth exceeded`.

Notice "try the move, ask, **take it back**". The function works on the one board list that it was given, so after each experiment the board must be restored. Forgetting the undo corrupts the board and the AI plays nonsense.

## Preferring quick wins

If a win is just `+1`, the AI cannot tell a win in two moves from a win in six, and it might play around instead of finishing. So we use `10 - depth` for an O win and `depth - 10` for an X win, where `depth` counts the moves since the search began. A fast win scores 9, a slow win 7, and a fast loss is worse than a slow one. The AI now wins as soon as it can and delays defeat as long as possible.

## Choosing the move

`best_move(b)` is the loop around the search. For every empty cell it plays `"O"` there, asks `minimax(b, "X", 1)` what the rest is worth (X moves next), undoes the move, and remembers the cell with the highest score. Start with `best = -100`, lower than any real score. With a strict `>` the first of equally good cells wins ties, which keeps the AI deterministic.

How much work is this? From an empty board there are about 550,000 positions to examine, which Python handles in about half a second. After the human's first move it is only about 60,000, so the game answers instantly. Chess has far too many positions for this, and real engines add pruning tricks, but the idea is identical.

> **Watch out:** `RecursionError: maximum recursion depth exceeded` means the recursion never reaches a base case. Check that you return when `winner(b)` is not `None` and when the board is full.
>
> **Watch out:** `ValueError: max() arg is an empty sequence` appears when `scores` is empty, for example when `minimax` is called on a full board that is not detected as a draw. The `"" not in b` check must come before the loop.
>
> **Watch out:** if the AI sometimes plays on an occupied cell, you forgot to restore `b[i] = ""`, or you skipped the `if b[i] == ""` test.
>
> **Watch out:** `TypeError: minimax() missing 1 required positional argument`: the function takes the board and the player (depth defaults to 0).

## Going further

Let the AI go first, add a difficulty setting where it sometimes picks a random move, or count how many positions it examines with a global counter. Try removing the `depth` trick and watch how the AI behaves in winning positions.

> **Your turn:** write `minimax` and `best_move`. Then play: you can only draw, never win! The check tests the AI directly: it must take a win, block a threat, answer a corner with the center, and know that the game is a draw (value 0).
