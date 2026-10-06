---
title: "Memory match: game logic you can test without a mouse"
summary: Design a card game as small logic functions (flip, check_pair) separate from the drawing and the mouse, so the whole game can be tested by calling them.
level: advanced
runner: pygame
files:
  - name: main.py
    code: |
      import game

      # 16 cards = 8 pairs. A fixed layout keeps the game predictable (see "Going further").
      LAYOUT = [3, 0, 5, 1, 7, 2, 4, 6, 1, 5, 0, 7, 2, 6, 3, 4]
      cards = LAYOUT[:]
      GX, GY, CW, CH, GAP = 28, 36, 60, 44, 8     # grid origin, card size, space between cards
      COLORS = [game.RED, game.ORANGE, game.YELLOW, game.GREEN, game.CYAN, game.BLUE, game.PURPLE, game.PINK]

      matched = [False] * 16          # matched[i] is True once card i has found its partner
      picked = []                     # indexes of the face-up cards of the current turn (0, 1 or 2)
      moves = 0                       # how many pairs the player has tried
      timer = 0.0                     # how long a pair has been showing
      state = "playing"

      def card_at(mx, my):
          # turn a mouse position into a card index, or None if it is in a gap or outside
          col, rx = divmod(mx - GX, CW + GAP)
          row, ry = divmod(my - GY, CH + GAP)
          if 0 <= col < 4 and 0 <= row < 4 and rx < CW and ry < CH:
              return row * 4 + col
          return None

      def flip(i):
          # 1. Turn card i face up: add i to picked and return True.
          # Return False (and change nothing) if card i is already matched, is already
          # in picked, or two cards are already picked.
          pass

      def check_pair():
          global moves
          # 2. Judge the two picked cards. With fewer than two picked return None.
          # Otherwise add 1 to moves, remember whether cards[a] == cards[b], mark both
          # matched if so, empty picked (picked.clear()) and return True or False.
          pass

      def update(dt):
          global timer, state
          if state != "playing":
              return
          if game.mouse_pressed():
              i = card_at(*game.mouse_pos())
              if i is not None:
                  flip(i)
          # 3. When two cards are picked, count timer up by dt. After 0.7 seconds
          # reset timer to 0 and call check_pair(). When every card is matched (the
          # built-in function all() on the list is handy) the state becomes "won".

      def draw():
          game.clear(game.DARK)
          for i in range(16):
              x = GX + (i % 4) * (CW + GAP)
              y = GY + (i // 4) * (CH + GAP)
              if matched[i] or i in picked:
                  game.rect(x, y, CW, CH, COLORS[cards[i]])
                  game.text(x + 22, y + 8, "ABCDEFGH"[cards[i]], game.DARK, 28)
              else:
                  game.rect(x, y, CW, CH, game.GRAY)
          game.text(8, 8, "Moves " + str(moves), game.WHITE, 16)
          if state == "won":
              game.text(150, 8, "You win!", game.YELLOW, 16)

      game.run(update, draw)
check:
  game:
    frames: 1
    expect: >-
      card_at(GX + 1, GY + 1) == 0
      and card_at(GX + CW + 3, GY + 1) is None
      and card_at(GX + 3 * (CW + GAP) + 5, GY + 3 * (CH + GAP) + 5) == 15
      and flip(0) is True and flip(0) is False
      and flip(1) is True and flip(2) is False
      and (update(1.0), picked == [] and moves == 1 and not matched[0])[1]
      and flip(0) and flip(cards.index(cards[0], 1))
      and (update(1.0), matched[0] and moves == 2)[1]
      and flip(0) is False
      and all((flip(i), flip(cards.index(cards[i], i + 1)), check_pair())[2] for i in range(16) if not matched[i])
      and moves == 9 and (update(0.1), state == 'won')[1]
    message: "The check cannot use a mouse, so it calls your functions directly: flip(0) must turn a card (True) but refuse the same card again or a third card (False); update(1.0) must resolve a mismatching pair (picked empty, moves 1) and a matching pair (both matched); matched cards cannot be flipped; and when every pair is found, update() must set state to 'won'."
  code:
    - { pattern: 'picked\.append\(', message: "flip should add the card to picked with picked.append(i)." }
    - { pattern: 'picked\.clear\(\)', message: "check_pair should empty the pair with picked.clear()." }
    - { pattern: 'all\(\s*matched\s*\)', message: "The game is won when all(matched) is True." }
    - { pattern: 'moves\s*(\+=|=\s*moves\s*\+)\s*1', message: "check_pair must add 1 to moves." }
hints:
  - "Think of the game as three pieces of state: matched (a list of True/False per card), picked (the indexes face up in this turn) and moves. flip(i) only changes picked, check_pair() reads picked and changes matched. No drawing, no mouse in those two functions."
  - "flip(i) refuses (returns False) in three cases: the card is matched, it is already in picked, or two cards are already picked. Otherwise append and return True. check_pair needs exactly two picked cards; compare cards[a] == cards[b], and always clear picked at the end."
  - "if matched[i] or i in picked or len(picked) >= 2: return False  /  picked.append(i); return True  /  check_pair: if len(picked) < 2: return None; a, b = picked; moves = moves + 1; same = cards[a] == cards[b]; if same: matched[a] = True; matched[b] = True; picked.clear(); return same  /  update: if len(picked) == 2: timer = timer + dt; if timer >= 0.7: timer = 0; check_pair()  and  if all(matched): state = 'won'"
solution:
  - name: main.py
    code: |
      import game

      # 16 cards = 8 pairs. A fixed layout keeps the game predictable (see "Going further").
      LAYOUT = [3, 0, 5, 1, 7, 2, 4, 6, 1, 5, 0, 7, 2, 6, 3, 4]
      cards = LAYOUT[:]
      GX, GY, CW, CH, GAP = 28, 36, 60, 44, 8     # grid origin, card size, space between cards
      COLORS = [game.RED, game.ORANGE, game.YELLOW, game.GREEN, game.CYAN, game.BLUE, game.PURPLE, game.PINK]

      matched = [False] * 16          # matched[i] is True once card i has found its partner
      picked = []                     # indexes of the face-up cards of the current turn (0, 1 or 2)
      moves = 0                       # how many pairs the player has tried
      timer = 0.0                     # how long a pair has been showing
      state = "playing"

      def card_at(mx, my):
          # turn a mouse position into a card index, or None if it is in a gap or outside
          col, rx = divmod(mx - GX, CW + GAP)
          row, ry = divmod(my - GY, CH + GAP)
          if 0 <= col < 4 and 0 <= row < 4 and rx < CW and ry < CH:
              return row * 4 + col
          return None

      def flip(i):
          # 1. Turn card i face up: add i to picked and return True.
          # Return False (and change nothing) if card i is already matched, is already
          # in picked, or two cards are already picked.
          if matched[i] or i in picked or len(picked) >= 2:
              return False
          picked.append(i)
          return True

      def check_pair():
          global moves
          # 2. Judge the two picked cards. With fewer than two picked return None.
          # Otherwise add 1 to moves, remember whether cards[a] == cards[b], mark both
          # matched if so, empty picked (picked.clear()) and return True or False.
          if len(picked) < 2:
              return None
          a, b = picked
          moves = moves + 1
          same = cards[a] == cards[b]
          if same:
              matched[a] = True
              matched[b] = True
          picked.clear()
          return same

      def update(dt):
          global timer, state
          if state != "playing":
              return
          if game.mouse_pressed():
              i = card_at(*game.mouse_pos())
              if i is not None:
                  flip(i)
          # 3. When two cards are picked, count timer up by dt. After 0.7 seconds
          # reset timer to 0 and call check_pair(). When every card is matched (the
          # built-in function all() on the list is handy) the state becomes "won".
          if len(picked) == 2:
              timer = timer + dt
              if timer >= 0.7:
                  timer = 0
                  check_pair()
          if all(matched):
              state = "won"

      def draw():
          game.clear(game.DARK)
          for i in range(16):
              x = GX + (i % 4) * (CW + GAP)
              y = GY + (i // 4) * (CH + GAP)
              if matched[i] or i in picked:
                  game.rect(x, y, CW, CH, COLORS[cards[i]])
                  game.text(x + 22, y + 8, "ABCDEFGH"[cards[i]], game.DARK, 28)
              else:
                  game.rect(x, y, CW, CH, game.GRAY)
          game.text(8, 8, "Moves " + str(moves), game.WHITE, 16)
          if state == "won":
              game.text(150, 8, "You win!", game.YELLOW, 16)

      game.run(update, draw)
quiz:
  - q: "Why are flip(i) and check_pair() written without any drawing or mouse code?"
    options: ["Python forbids mixing them", "They run faster that way", "Separating logic from input and drawing lets you test the rules by simply calling the functions"]
    answer: 2
    explain: "Automatic checks (and your own tests) cannot move a mouse, but they can call flip(3) and look at the lists."
  - q: "What does divmod(mx - GX, CW + GAP) return?"
    options: ["The column number and how many pixels into that column the mouse is", "The mouse x twice", "Only the remainder"]
    answer: 0
  - q: "Why does the game wait 0.7 seconds (timer) before calling check_pair()?"
    options: ["To give the computer time to think", "So the player can see the second card, even if the pair does not match", "Because lists are slow"]
    answer: 1
  - q: "What does all(matched) return when matched is [True, True, False]?"
    options: ["True", "False", "2"]
    answer: 1
    explain: "all() is True only if every item is True. any() would be True here."
---
So far our games were tested by watching them move. Memory match is the first game where we care about something different: **design**. A card game is mostly rules (what happens when you flip a card?), and rules are best written as small **functions** that do not know anything about the mouse or the screen. That makes them easy to understand, easy to change, and easy to test. This is how professional programmers structure code, and it is a skill worth practising.

## Three layers

We split the program in three layers:

1. **Logic**: the functions `flip(i)` and `check_pair()` and the lists `matched` and `picked`. They only change data.
2. **Input**: `update` reads the mouse and turns a click into a card number with `card_at(x, y)`, then calls `flip`.
3. **Drawing**: `draw` paints the data. It never changes anything.

The rule "layers only talk downward" means you can replace one without touching the others. Want touch controls or the keyboard? Only change input. Want fancy card art? Only change drawing. Want to know if the rules work? Call the logic directly, without a mouse. That is exactly what **Check answer** does in this lesson.

## The data

```python
cards = [3, 0, 5, 1, ...]        # cards[i] is the picture on card i (two cards share each picture)
matched = [False] * 16           # matched[i]: has card i found its partner?
picked = []                      # the cards that are face up right now (0, 1 or 2 indexes)
```

A card is shown face up if `matched[i]` or `i in picked`; that is a rule `draw` uses. Cards are numbered 0 to 15 from the top left, row by row. The starter uses a fixed layout so the result is predictable. To shuffle for real, write `import random` and `random.shuffle(cards)` once at the start.

## flip: one click, one rule

`flip(i)` is called when the player clicks card `i`. It must **refuse** clicks that make no sense, and say so by returning `False`: a matched card, a card that is already face up, or a third card while a pair is still showing. Otherwise it adds `i` to `picked` and returns `True`. Returning a result is what makes a function testable: the caller can look at it.

## check_pair: judge the pair

When two cards are up, `check_pair()` compares their pictures. Count the attempt in `moves`, and if the pictures are equal, mark both cards in `matched`. Whether it matched or not, finish with `picked.clear()` so the next turn starts clean. It returns `True` or `False`, or `None` if there are fewer than two cards to judge. Notice the `global moves` line: we assign to `moves`, so Python needs to know it is the global one (`picked.clear()` and `matched[a] = True` only change an existing list, so they need no `global`).

## The delay and the win

After the second flip the player should see both cards for a moment. In `update`, once `len(picked) == 2`, a timer counts up `dt` and after 0.7 seconds calls `check_pair()`. (Clicks are ignored during that time, because `flip` refuses a third card.) Finally `all(matched)` is `True` only when every card has its partner: the player won.

## Mouse input

`card_at` is written for you. `divmod(a, b)` gives the whole number of times `b` fits into `a` *and* the remainder in one go, so we learn the column and also whether the mouse is inside the card or in the gap between cards. `card_at(*game.mouse_pos())` uses `*` to unpack the pair `(x, y)` into two arguments.

> **Watch out:** `UnboundLocalError: cannot access local variable 'moves' where it is not associated with a value`: you assign `moves = moves + 1` in `check_pair`, so add `global moves` (it is there in the starter).
>
> **Watch out:** `ValueError: too many values to unpack (expected 2)` on `a, b = picked` means `picked` had more than two items. `flip` must refuse the third card.
>
> **Watch out:** forgetting `picked.clear()` leaves two cards "picked" forever and the game freezes; forgetting `return` in `flip` makes it return `None`, which counts as "refused".
>
> **Watch out:** `matched = [False] * 16` is fine, but `matched = [[False]] * 16` shares one inner list between all items.

## Going further

Show the number of moves as a score at the end, shuffle with `random.shuffle`, flip cards with a short animation, or make a 6 by 6 grid. Because the logic is separate, none of those changes touch `flip` or `check_pair`.

> **Your turn:** write the three TODO parts: `flip`, `check_pair` and the pair handling in `update`. The check clicks nothing: it calls `flip` and `update` itself, mismatches one pair, matches another, and finally solves the whole board, expecting 9 moves and the state `"won"`.
