---
title: Moving with the keyboard
summary: Read the arrow keys with game.keyDown and move the player in four directions.
level: beginner
runner: jsgame
files:
  - name: main.js
    code: |
      let x = 150;
      let y = 100;
      const SIZE = 20;
      const SPEED = 120;      // pixels per second

      function update(dt) {
        if (game.keyDown('right')) {
          x += SPEED * dt;
        }
        // 1. Move left when the left key is down.
        // 2. Move down when the down key is down.
        // 3. Move up when the up key is down.
      }

      function draw() {
        game.clear(game.DARK);
        game.rect(x, y, SIZE, SIZE, game.CYAN);
      }

      game.run(update, draw);
check:
  game:
    frames: 90
    keys:
      - { key: right, from: 0, to: 30 }
      - { key: down, from: 30, to: 60 }
      - { key: left, from: 60, to: 75 }
      - { key: up, from: 75, to: 90 }
    expect: "Math.abs(x - 180) < 1 && Math.abs(y - 130) < 1"
    message: "Right for 30 frames (+60), down for 30 frames (+60), left for 15 frames (-30) and up for 15 frames (-30) should end at x = 180, y = 130."
  code:
    - { pattern: "keyDown\\(\\s*['\"]left['\"]", message: "Check the left key with game.keyDown('left')." }
    - { pattern: "keyDown\\(\\s*['\"]down['\"]", message: "Check the down key with game.keyDown('down')." }
    - { pattern: "keyDown\\(\\s*['\"]up['\"]", message: "Check the up key with game.keyDown('up')." }
hints:
  - "game.keyDown('left') is true on every frame while the left arrow is held. Use an if with it, just like the existing right-key code."
  - "Going left makes x smaller (x -= SPEED * dt). Going down makes y bigger, because y grows downwards, and going up makes y smaller."
  - "if (game.keyDown('left')) { x -= SPEED * dt; }   if (game.keyDown('down')) { y += SPEED * dt; }   if (game.keyDown('up')) { y -= SPEED * dt; }"
solution:
  - name: main.js
    code: |
      let x = 150;
      let y = 100;
      const SIZE = 20;
      const SPEED = 120;      // pixels per second

      function update(dt) {
        if (game.keyDown('right')) {
          x += SPEED * dt;
        }
        if (game.keyDown('left')) {
          x -= SPEED * dt;
        }
        if (game.keyDown('down')) {
          y += SPEED * dt;
        }
        if (game.keyDown('up')) {
          y -= SPEED * dt;
        }
      }

      function draw() {
        game.clear(game.DARK);
        game.rect(x, y, SIZE, SIZE, game.CYAN);
      }

      game.run(update, draw);
quiz:
  - q: "What is the difference between keyDown and keyPressed?"
    options: ["keyDown is true only on the first frame, keyPressed while held", "keyDown is true on every frame the key is held, keyPressed only on the frame it was first pushed", "They are the same"]
    answer: 1
    explain: "Use keyDown for smooth movement and keyPressed for one-shot actions such as jumping or shooting."
  - q: "Which change moves the player UP the screen?"
    options: ["y += SPEED * dt", "y -= SPEED * dt", "x -= SPEED * dt"]
    answer: 1
  - q: "Why is SIZE declared with const?"
    options: ["It makes the game faster", "Its value never changes, and const protects it from accidental changes", "const variables are drawn in color"]
    answer: 1
  - q: "Which keys can you read besides the arrows?"
    options: ["Only the arrows", "'space', 'a', 'd', 'w', 's', 'z', 'x' and 'enter'", "Every key on the keyboard"]
    answer: 1
---

A game is not much fun if you can only watch it. In this lesson you give the player control: the arrow keys will move a square around the screen. You will learn how to ask the keyboard what is going on, and how `if` lets your code react.

## Asking the keyboard

The engine remembers which keys are currently held. You ask with `game.keyDown('name')`, which gives back `true` or `false`:

```js
if (game.keyDown('right')) {
  x += SPEED * dt;
}
```

Read it as plain English: *if the right key is down, add SPEED times dt to x*. The `if` statement runs the code in the curly braces only when the condition in the parentheses is `true`. Because `update` runs every frame, the square keeps moving for as long as you hold the key, and stops when you let go.

The key names are lowercase text in quotes: `'left'`, `'right'`, `'up'`, `'down'`, `'space'`, `'enter'`, and the letters `'a'`, `'d'`, `'w'`, `'s'`, `'z'`, `'x'`. So you can offer WASD controls as well as the arrows.

## Direction and signs

On this screen `x` grows to the right and `y` grows **downwards**. So:

| Key | What changes |
| --- | --- |
| right | `x` gets bigger: `x += SPEED * dt` |
| left | `x` gets smaller: `x -= SPEED * dt` |
| down | `y` gets bigger: `y += SPEED * dt` |
| up | `y` gets smaller: `y -= SPEED * dt` |

`+=` adds to a variable, `-=` subtracts from it. Each key gets its own `if`, so holding two keys at once (right and down) moves diagonally. That is often exactly what players expect.

## const versus let

In the starter `SIZE` and `SPEED` are declared with `const`. A `const` is a variable that can never be given a new value, which is perfect for settings such as sizes, speeds and colors. Use `let` for values that change over time, like `x` and `y`. Writing settings in capital letters is a common habit that tells the reader "this is a setting".

Why bother with named settings? `120` appearing in four places is a "magic number": if you want the player faster you have to find and change all four. With `SPEED` you change one line.

## Keys that happen once

Some actions should happen **once** per key push: jumping, shooting a single bullet, pausing. For those, use `game.keyPressed('space')`. It is `true` only for the single frame when the key was first pushed down, and `false` while it stays held. You will use it later in the track.

```js
if (game.keyPressed('space')) {
  console.log('bang!');   // prints once per push, not 60 times a second
}
```

## Testing with scripted keys

When you press **Check answer**, no human is typing. The checker "holds" keys for you according to a script (for example, right for 30 frames, then down for 30 frames) and then looks at your variables. That is why your game logic should live in variables like `x` and `y`: the checker can read them.

> **Watch out:** `game.keyDown(left)` without quotes means "the variable called left", and gives `ReferenceError: left is not defined`. The key name must be text in quotes: `'left'`.
>
> **Watch out:** using `else if` for all four directions means that only one direction works at a time (no diagonal movement). Four separate `if` statements are better here.
>
> **Watch out:** a capital letter in a key name (`'Left'`) is accepted, but `'ArrowLeft'` is not a name this engine knows. Use the simple names.
>
> **Watch out:** if the square moves the wrong way when you press up, you probably wrote `y +=` instead of `y -=`. Remember that y grows downward.

## Going further

Add WASD controls too (`game.keyDown('a') || game.keyDown('left')`), or make the player faster while the `'z'` key is held.

> **Your turn:** finish `update` so the left, down and up keys move the square, just like the right key does. Check that holding left makes `x` smaller and that up makes `y` smaller.
