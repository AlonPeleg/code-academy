---
title: Game states, lives and score
summary: Give your game a playing state and a game over state, with lives, a score and a restart on enter.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      PLAYER_Y = 210
      player_x = 140
      block_y = -20          # a block falls from the top at x = 150
      lives = 3
      score = 0
      state = "playing"      # always "playing" or "game over"

      def reset():
          global player_x, block_y, lives, score, state
          player_x = 140
          block_y = -20
          lives = 3
          score = 0
          state = "playing"

      def hit():
          return block_y + 20 > PLAYER_Y and player_x < 170 and player_x + 40 > 150

      def update(dt):
          global player_x, block_y, lives, score, state
          if state == "playing":
              if game.key_down("left"):
                  player_x = max(0, player_x - 200 * dt)
              if game.key_down("right"):
                  player_x = min(game.WIDTH - 40, player_x + 200 * dt)
              block_y = block_y + 240 * dt
              if hit():
                  lives = lives - 1
                  block_y = -20
              elif block_y > game.HEIGHT:
                  score = score + 1        # dodged it!
                  block_y = -20
              # 1. If lives is 0 or less, switch the state to "game over".

          # 2. In the "game over" state, wait for the enter key
          #    and then call reset() to start again.


      def draw():
          game.clear(game.DARK)
          game.rect(player_x, PLAYER_Y, 40, 20, game.GREEN)
          game.rect(150, block_y, 20, 20, game.RED)
          game.text(10, 10, "Score " + str(score) + "   Lives " + str(lives), game.WHITE, 14)
          if state == "game over":
              game.text(80, 100, "GAME OVER", game.YELLOW, 28)
              game.text(90, 140, "press enter", game.WHITE, 14)

      game.run(update, draw)
check:
  game:
    frames: 200
    keys:
      - { key: enter, from: 170, to: 172 }
    expect: "state == 'playing' and lives == 3 and block_y < 150"
    message: "Standing still, the player is hit 3 times and the game must go to game over. Then enter must start a fresh game with 3 lives."
  code:
    - { pattern: 'state\s*=\s*["'']game over["'']', message: "Set state = \"game over\" when the lives run out." }
    - { pattern: 'key_pressed\(\s*["'']enter["'']\s*\)', message: "Use game.key_pressed(\"enter\") to restart." }
    - { pattern: 'reset\(\)', message: "Call reset() to restart the game." }
hints:
  - 'A game state is just a variable holding a name. The update function does different things depending on that name, so you need an if for each state: the "playing" part is done, you add the "game over" part.'
  - 'Inside the playing part, after the hit code, test if lives <= 0 and change state. Then write an else: next to if state == "playing": so it runs only in the game over state, and test game.key_pressed("enter") inside it.'
  - 'Add inside the playing branch:  if lives <= 0:  state = "game over"    and at the bottom of update (aligned with the first if):  else:  if game.key_pressed("enter"):  reset()'
solution:
  - name: main.py
    code: |
      import game

      PLAYER_Y = 210
      player_x = 140
      block_y = -20          # a block falls from the top at x = 150
      lives = 3
      score = 0
      state = "playing"      # always "playing" or "game over"

      def reset():
          global player_x, block_y, lives, score, state
          player_x = 140
          block_y = -20
          lives = 3
          score = 0
          state = "playing"

      def hit():
          return block_y + 20 > PLAYER_Y and player_x < 170 and player_x + 40 > 150

      def update(dt):
          global player_x, block_y, lives, score, state
          if state == "playing":
              if game.key_down("left"):
                  player_x = max(0, player_x - 200 * dt)
              if game.key_down("right"):
                  player_x = min(game.WIDTH - 40, player_x + 200 * dt)
              block_y = block_y + 240 * dt
              if hit():
                  lives = lives - 1
                  block_y = -20
              elif block_y > game.HEIGHT:
                  score = score + 1        # dodged it!
                  block_y = -20
              # 1. If lives is 0 or less, switch the state to "game over".
              if lives <= 0:
                  state = "game over"

          # 2. In the "game over" state, wait for the enter key
          #    and then call reset() to start again.
          else:
              if game.key_pressed("enter"):
                  reset()


      def draw():
          game.clear(game.DARK)
          game.rect(player_x, PLAYER_Y, 40, 20, game.GREEN)
          game.rect(150, block_y, 20, 20, game.RED)
          game.text(10, 10, "Score " + str(score) + "   Lives " + str(lives), game.WHITE, 14)
          if state == "game over":
              game.text(80, 100, "GAME OVER", game.YELLOW, 28)
              game.text(90, 140, "press enter", game.WHITE, 14)

      game.run(update, draw)
quiz:
  - q: "What is a game state in this lesson?"
    options: ["The screen size", "A variable that says which mode the game is in, like \"playing\" or \"game over\"", "The number of frames per second"]
    answer: 1
  - q: "In the game over state, what should update NOT do?"
    options: ["Check whether enter was pressed", "Keep moving the falling block and losing lives", "Do nothing"]
    answer: 1
  - q: "Why put the starting values in a reset() function?"
    options: ["So the same code starts the game and restarts it, without repeating it", "Because Python needs a function called reset", "To make the game faster"]
    answer: 0
  - q: "When the player loses the last life, which line belongs in the code?"
    options: ["lives = 3", "state = \"playing\"", "state = \"game over\""]
    answer: 2
---

Real games are not one long loop of action. There is a title screen, the game itself, a game over screen, maybe a pause. Each of these is a **state** (or "mode"), and switching between them is a **state machine**. In this lesson you add lives, a score, a game over screen and a restart to a small dodging game.

## A state is just a variable

The simplest state machine is a text variable:

```python
state = "playing"
```

The game is always in exactly one state. In `update` you do different things for each one:

```python
def update(dt):
    if state == "playing":
        ...move things, check for hits...
    else:
        ...wait for enter...
```

And `draw` can show different pictures for each state (a "GAME OVER" message, for example). Moving between states is only a matter of assigning a new value: `state = "game over"`. Notice the double equals: `==` **asks** a question, `=` **sets** a value.

## Lives and score

Both are plain numbers:

- `lives = lives - 1` when the player is hit,
- `score = score + 1` when they dodge a block.

The game over rule is a comparison: when `lives <= 0`, change the state. Use `<=` rather than `== 0` so it still works if a bug ever takes a life twice in one frame.

```python
if lives <= 0:
    state = "game over"
```

## Pausing the action

Because everything that moves lives inside `if state == "playing":`, the world freezes the instant the state changes: the block stops falling and no more lives can be lost. Draw keeps running, so the player still sees the last picture plus the game over text.

## Restarting with a reset function

When the player presses **enter**, you need every number back to its start value. Put those lines in one function and call it whenever you need a fresh game:

```python
def reset():
    global lives, score, state
    lives = 3
    score = 0
    state = "playing"
```

Use `game.key_pressed("enter")` (not `key_down`), so one tap restarts exactly once. A `reset()` function is nice because the starting values of your game are written in one place.

## A look at the example

The starter drops a red block from the top, always at `x = 150`. The player (40 wide) slides left and right to dodge it. A function `hit()` returns `True` when the block overlaps the player. A hit costs a life and sends the block back to the top, and a clean dodge scores a point.

> **Watch out:** `UnboundLocalError` when you assign `state` or `lives` in `update` means they are missing from the `global` line.
>
> **Watch out:** a stray `=` in `if state = "playing":` is a `SyntaxError`. Use `==` to compare.
>
> **Watch out:** the `else:` has to line up (same indentation) with `if state == "playing":`. If you indent it more, it becomes the else of a different `if`, and the restart never happens, with no error message at all.
>
> **Watch out:** typing `"Game Over"` in one place and `"game over"` in another: the strings are different, so the state check silently fails. Copy the exact same text.

> **Your turn:** after the hit code, switch the state to `"game over"` when `lives <= 0`. Then add an `else:` that waits for `game.key_pressed("enter")` and calls `reset()`. Run it, stand still, lose three lives, then press enter.
