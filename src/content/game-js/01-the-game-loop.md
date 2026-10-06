---
title: The game loop
summary: Every game is a loop that updates the world and draws it again and again, 60 times a second.
level: beginner
runner: jsgame
files:
  - name: main.js
    code: |
      let x = 0;          // where the square is, in pixels from the left edge
      let speed = 100;    // how fast it moves, in pixels per second

      function update(dt) {
        // 1. Move the square: add speed * dt to x.
      }

      function draw() {
        game.clear(game.DARK);
        // 2. Draw a yellow 30 by 30 square with its left edge at x and its
        //    top edge at 105.
      }

      game.run(update, draw);
check:
  game:
    frames: 120
    keys: []
    expect: "x > 199 && x < 201"
    message: "After 2 seconds a square moving 100 pixels per second should be at x = 200. Add speed * dt to x inside update."
  code:
    - { pattern: 'x\s*(\+=|=\s*x\s*\+)\s*speed\s*\*\s*dt', message: "Inside update, increase x by speed * dt." }
    - { pattern: 'game\.rect\(\s*x\s*,', message: "Draw the square with game.rect(x, 105, 30, 30, game.YELLOW)." }
hints:
  - "A game has two jobs on every frame: update changes the numbers (positions), draw paints them. dt is the number of seconds since the last frame."
  - "Inside update add speed * dt to x, so the square moves speed pixels every second no matter how fast the computer is. In draw, game.rect takes x, y, width, height and a color."
  - "x += speed * dt;   and in draw:   game.rect(x, 105, 30, 30, game.YELLOW);"
solution:
  - name: main.js
    code: |
      let x = 0;          // where the square is, in pixels from the left edge
      let speed = 100;    // how fast it moves, in pixels per second

      function update(dt) {
        x += speed * dt;
      }

      function draw() {
        game.clear(game.DARK);
        game.rect(x, 105, 30, 30, game.YELLOW);
      }

      game.run(update, draw);
quiz:
  - q: "What does the game loop do over and over?"
    options: ["Draws only", "Updates the world, then draws it", "Waits for the player to quit"]
    answer: 1
  - q: "What is dt?"
    options: ["The size of the screen", "The number of seconds since the previous frame", "The speed of the player"]
    answer: 1
    explain: "At 60 frames per second dt is about 0.0167."
  - q: "Why do we move with  x += speed * dt  and not  x += 2 ?"
    options: ["The first is shorter", "The movement then takes the same real time on every computer", "The second is a syntax error"]
    answer: 1
  - q: "Where does the top-left corner of the screen sit?"
    options: ["At x = 0, y = 0, and y grows downwards", "At the center", "At the bottom left, and y grows upwards"]
    answer: 0
---

Every video game, from Pong to the biggest 3D blockbuster, is built around one simple idea: a **loop** that runs many times each second. On every turn of the loop the game does two things: it **updates** the world (moves things, checks keys, counts points) and it **draws** the world on the screen. If you do this 60 times a second, your eyes see smooth motion. In this track you will build games in JavaScript that run live in the browser.

## The shape of every game

```js
let x = 0;

function update(dt) {
  // change the numbers
}

function draw() {
  // paint the numbers
}

game.run(update, draw);
```

- `game` is a small toolbox we give you. It knows how to draw shapes, read the keyboard and run the loop. You never have to import it.
- `update` and `draw` are two **functions** that you write. A function is a named block of code that can be called many times.
- `game.run(update, draw)` is the last line of every program. It hands your two functions to the engine, which calls them about 60 times a second, first `update`, then `draw`.

Variables declared with `let` at the top of the file (outside any function) are the **state** of your game: they keep their values from one frame to the next. This is where you store positions, scores and lives.

## The screen

The screen is **320 pixels wide and 240 pixels high**. The point `(0, 0)` is the **top-left** corner. `x` grows to the right, and `y` grows **downwards** (the opposite of a maths graph). `game.WIDTH` and `game.HEIGHT` hold these sizes.

## Drawing

At the start of every `draw` you clear the screen, otherwise the old pictures would stay behind and smear:

```js
game.clear(game.DARK);
```

Colors are built in (`game.RED`, `game.YELLOW`, `game.CYAN`, and more). A rectangle is drawn with `game.rect(x, y, width, height, color)`:

```js
game.rect(100, 50, 40, 20, game.GREEN);   // a green box, 40 wide and 20 high
```

## Moving with dt

`update` receives a number called `dt` (*delta time*): the **seconds since the previous frame**. At 60 frames per second it is about `0.0167`. To move at a certain speed, multiply speed by dt:

```js
x += speed * dt;      // short for: x = x + speed * dt
```

If `speed` is 100 pixels per second, then each frame the square moves `100 * 0.0167`, about 1.7 pixels, and after one second it has travelled 100 pixels. This also means the game feels the same on a slow computer that only manages 30 frames per second, because dt is then bigger.

## Seeing what happens

Press **Run** to play the game live. Use `console.log(x)` inside `update` to print values in the Console tab (but not on every frame for long, it will fill up fast!). When you press **Check answer**, the game is run invisibly for a fixed number of frames and your variables are inspected.

> **Watch out:** forgetting `game.run(update, draw)` at the bottom gives "Your program never called game.run". Nothing starts without it.
>
> **Watch out:** if the shape smears across the screen, you forgot `game.clear(...)` at the start of `draw`.
>
> **Watch out:** `ReferenceError: x is not defined` means `x` is spelled differently in two places, or declared inside a function (so it vanishes at the end of that function).
>
> **Watch out:** changing state in `draw` instead of `update` works at first, but mixes up the two jobs. Keep `draw` for drawing only.

## Going further

Try a speed of `-100`, or `300`. Change the color, the size, or the `y` position. Add a second variable `y` and a second speed to make the square travel diagonally.

> **Your turn:** inside `update`, add `speed * dt` to `x`. Inside `draw`, paint a yellow 30 by 30 square at `x`, `105` with `game.rect`.
