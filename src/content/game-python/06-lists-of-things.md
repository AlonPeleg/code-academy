---
title: Lists of things
summary: Keep many bullets in a list, spawn them with the space bar, move them in a loop and remove the ones that leave the screen.
level: intermediate
runner: pygame
files:
  - name: main.py
    code: |
      import game

      player_x = 148
      bullets = []          # each bullet is a small list: [x, y]
      shots = 0             # how many bullets have been fired in total

      def update(dt):
          global player_x, bullets, shots
          if game.key_down("left"):
              player_x = player_x - 180 * dt
          if game.key_down("right"):
              player_x = player_x + 180 * dt

          # 1. Spawn: when the space bar is pressed, put a new bullet in the list.
          #    Its x is the player's x plus 10, its y is 200.
          #    Also add 1 to shots.

          # 2. Move: go through every bullet and make its y smaller by 240 * dt.

          # 3. Remove: make a new list that keeps only the bullets whose y is
          #    bigger than -10 (still on screen), and put it back in bullets.


      def draw():
          game.clear(game.DARK)
          game.rect(player_x, 200, 24, 24, game.GREEN)
          for bullet in bullets:
              game.rect(bullet[0], bullet[1], 4, 10, game.YELLOW)
          game.text(10, 10, "bullets: " + str(len(bullets)) + "  shots: " + str(shots), game.WHITE, 14)

      game.run(update, draw)
check:
  game:
    frames: 90
    keys:
      - { key: space, from: 0, to: 3 }
    expect: "shots == 1 and len(bullets) == 0"
    message: "Space is tapped once: shots must be 1, and after 1.5 seconds that bullet has flown off the top, so the list must be empty again. Check spawn, move and remove."
  code:
    - { pattern: 'key_pressed\(\s*["'']space["'']\s*\)', message: "Use game.key_pressed(\"space\") so one press fires one bullet." }
    - { pattern: 'shots\s*(\+=|=\s*shots\s*\+)\s*1', message: "Add 1 to shots when you fire." }
    - { pattern: '\.append\(', message: "Use bullets.append(...) to add a bullet to the list." }
hints:
  - 'Three jobs, three pieces: (1) append a new [x, y] list when space is pressed, (2) a for loop that changes b[1] of every bullet, (3) a new list that only keeps the bullets still on screen.'
  - 'key_pressed is true on the single frame the key goes down, so one press means one bullet. To remove safely, do not delete from the list you are looping over: build a second list, e.g. alive = [] and alive.append(b) for each bullet you want to keep.'
  - 'if game.key_pressed("space"):  bullets.append([player_x + 10, 200])  and  shots = shots + 1   then   for b in bullets:  b[1] = b[1] - 240 * dt   then   alive = []   for b in bullets:  if b[1] > -10:  alive.append(b)   and finally   bullets = alive'
solution:
  - name: main.py
    code: |
      import game

      player_x = 148
      bullets = []          # each bullet is a small list: [x, y]
      shots = 0             # how many bullets have been fired in total

      def update(dt):
          global player_x, bullets, shots
          if game.key_down("left"):
              player_x = player_x - 180 * dt
          if game.key_down("right"):
              player_x = player_x + 180 * dt

          # 1. Spawn: when the space bar is pressed, put a new bullet in the list.
          if game.key_pressed("space"):
              bullets.append([player_x + 10, 200])
              shots = shots + 1

          # 2. Move: go through every bullet and make its y smaller by 240 * dt.
          for b in bullets:
              b[1] = b[1] - 240 * dt

          # 3. Remove: keep only the bullets that are still on screen.
          alive = []
          for b in bullets:
              if b[1] > -10:
                  alive.append(b)
          bullets = alive


      def draw():
          game.clear(game.DARK)
          game.rect(player_x, 200, 24, 24, game.GREEN)
          for bullet in bullets:
              game.rect(bullet[0], bullet[1], 4, 10, game.YELLOW)
          game.text(10, 10, "bullets: " + str(len(bullets)) + "  shots: " + str(shots), game.WHITE, 14)

      game.run(update, draw)
quiz:
  - q: "How do you add a new item to the end of a list called bullets?"
    options: ["bullets.add(item)", "bullets.append(item)", "bullets[item] = new"]
    answer: 1
  - q: "What is the difference between key_down(\"space\") and key_pressed(\"space\")?"
    options: ["They are exactly the same", "key_down is true only on the first frame, key_pressed while held", "key_pressed is true only on the frame the key goes down, key_down while it is held"]
    answer: 2
    explain: "With key_down you would fire a new bullet on every frame while holding the key."
  - q: "Why is it risky to remove items from a list while a for loop is going through that same list?"
    options: ["The loop can skip items, because the list shifts under it", "Python forbids it with an error every time", "It makes the list longer"]
    answer: 0
  - q: "If b = [100, 200], what is b[1]?"
    options: ["100", "200", "1"]
    answer: 1
    explain: "Counting starts at 0, so b[0] is 100 and b[1] is 200."
---

One bullet is easy: a variable `x` and a variable `y`. But a shooter has **many** bullets at once, and you never know how many. The tool for "a group of things" is a **list**. In this lesson you will keep bullets in a list, move them with a loop, and remove them when they leave the screen.

## Lists and loops, quickly

A list holds many values in order, written with square brackets:

```python
bullets = []                 # an empty list
bullets.append([100, 200])   # add one bullet: x = 100, y = 200
bullets.append([150, 200])
print(len(bullets))          # prints: 2
print(bullets[0])            # prints: [100, 200]
print(bullets[0][1])         # prints: 200   (the y of the first bullet)
```

Each bullet is itself a tiny list `[x, y]`. `b[0]` is its x and `b[1]` is its y (lists count from 0). You can change an item inside: `b[1] = b[1] - 5`.

A `for` loop visits every item:

```python
for b in bullets:
    b[1] = b[1] - 240 * dt     # every bullet moves up
```

Here `b` is each bullet in turn. Because `b` is the same list object that lives inside `bullets`, changing it changes the bullet for real. In `draw` you use the same loop to paint them all.

## Spawning with key_pressed

Remember `key_down` is true on **every** frame while a key is held, which would make a bullet 60 times a second. For a single shot per tap use **`key_pressed`**, which is true only on the frame the key goes down:

```python
if game.key_pressed("space"):
    bullets.append([player_x + 10, 200])
```

## Removing the dead bullets

Bullets that fly off the top must be removed, or the list grows forever and the game slows down. A bullet at `y = -10` is fully above the screen (it is 10 tall).

The tempting way is `bullets.remove(b)` inside the loop, but removing from a list **while you loop over it** makes the loop skip items. The safe pattern is to build a **new list** with the survivors, then replace the old list:

```python
alive = []
for b in bullets:
    if b[1] > -10:        # still on screen
        alive.append(b)
bullets = alive           # (needs bullets on the global line)
```

Every frame the old bullets are carried over, the dead ones are dropped. It is simple and it always works.

## The order matters a little

Spawn first, then move, then remove: a fresh bullet moves a little the same frame it is born, and a bullet that just left the screen is cleaned up right away. If you remove before moving you simply remove one frame later, which is fine too.

> **Watch out:** `UnboundLocalError` on `bullets = alive` means `bullets` is missing from the `global` line at the top of `update`. (Calling `bullets.append(...)` works without `global`, but assigning a new list does not.)
>
> **Watch out:** `IndexError: list index out of range` happens when you ask for `bullets[0]` while the list is empty. Check `len(bullets)` first.
>
> **Watch out:** `TypeError: 'int' object is not subscriptable` means you used `b[1]` on a plain number. Is `b` really a `[x, y]` list?
>
> **Watch out:** a machine-gun of bullets while holding the space bar means you used `key_down` instead of `key_pressed`.

## Going further

Make the bullets faster, make the player fire two bullets at once, or limit the player to 5 bullets at a time with `if len(bullets) < 5:`.

The starter also has a counter `shots` that counts every bullet ever fired. A list only shows what is alive *now*, so a counter is handy for a score or an ammo display, and it lets the check see that a bullet was really fired and later cleaned up.

> **Your turn:** write the three jobs in `update`. When space is pressed, append a bullet `[player_x + 10, 200]` and add 1 to `shots`. Move every bullet up by `240 * dt`, and keep only the bullets with `y > -10`. Test it live by tapping space and watching the bullets counter go up and back down.
