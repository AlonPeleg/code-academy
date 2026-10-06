---
title: Shapes, colors and text
summary: Paint a small scene with rectangles, circles, lines and text, build your own colors, and reuse drawing code in a function.
level: beginner
runner: jsgame
files:
  - name: main.js
    code: |
      let sunX = 60;
      const SKY = game.DARK;      // 1. Replace this with a color of your own: [red, green, blue]

      // 2. Draw a tree with its trunk at (x, y): a brown rectangle for the
      //    trunk (use [120, 72, 36]) and a green circle on top for the leaves.
      function drawTree(x, y) {
      }

      function update(dt) {
        // 3. Move the sun to the right by 40 pixels per second.
      }

      function draw() {
        game.clear(game.BLACK);
        game.rect(0, 0, game.WIDTH, 170, SKY);        // the sky
        game.circle(sunX, 40, 18, game.YELLOW);       // the sun
        game.rect(0, 170, game.WIDTH, 70, game.GREEN);  // the grass

        drawTree(60, 150);
        drawTree(250, 160);

        // 4. Draw a white line for the horizon from (0, 170) to (game.WIDTH, 170)
        //    and write the words "My scene" in the top left corner.
      }

      game.run(update, draw);
check:
  game:
    frames: 60
    keys: []
    expect: "sunX > 99 && sunX < 101 && typeof drawTree === 'function' && Array.isArray(SKY) && SKY.length === 3 && SKY.every(n => n >= 0 && n <= 255) && SKY.join() !== game.DARK.join()"
    message: "The sun should move 40 pixels per second (x = 100 after one second), drawTree must exist, and SKY must be your own [r, g, b] color."
  code:
    - { pattern: 'game\.line\(', message: "Draw the horizon with game.line(x1, y1, x2, y2, color)." }
    - { pattern: 'game\.text\(', message: "Write the title with game.text(x, y, message, color, size)." }
    - { pattern: 'function\s+drawTree[\s\S]*game\.circle\(', message: "Draw the leaves inside drawTree with game.circle." }
    - { pattern: 'sunX\s*(\+=|=\s*sunX\s*\+)\s*40\s*\*\s*dt', message: "Move the sun with sunX += 40 * dt;" }
hints:
  - "A color is just an array of three numbers from 0 to 255: [red, green, blue]. For example [100, 180, 255] is a light blue. A function is a recipe: write the drawing code once inside drawTree and call it with different positions."
  - "Inside drawTree: game.rect(x, y, 10, 30, [120, 72, 36]) for the trunk, then game.circle(x + 5, y - 5, 20, game.GREEN) for the leaves. For the line use game.line(0, 170, game.WIDTH, 170, game.WHITE, 2) and for the text game.text(10, 10, 'My scene', game.WHITE, 16)."
  - "const SKY = [100, 180, 255];   function drawTree(x, y) { game.rect(x, y, 10, 30, [120, 72, 36]); game.circle(x + 5, y - 5, 20, game.GREEN); }   sunX += 40 * dt;"
solution:
  - name: main.js
    code: |
      let sunX = 60;
      const SKY = [100, 180, 255];

      function drawTree(x, y) {
        game.rect(x, y, 10, 30, [120, 72, 36]);
        game.circle(x + 5, y - 5, 20, game.GREEN);
      }

      function update(dt) {
        sunX += 40 * dt;
      }

      function draw() {
        game.clear(game.BLACK);
        game.rect(0, 0, game.WIDTH, 170, SKY);
        game.circle(sunX, 40, 18, game.YELLOW);
        game.rect(0, 170, game.WIDTH, 70, game.GREEN);

        drawTree(60, 150);
        drawTree(250, 160);

        game.line(0, 170, game.WIDTH, 170, game.WHITE, 2);
        game.text(10, 10, 'My scene', game.WHITE, 16);
      }

      game.run(update, draw);
quiz:
  - q: "How do you write a bright red color yourself?"
    options: ["[255, 0, 0]", "'red'", "#FF0000"]
    answer: 0
  - q: "game.circle(x, y, r, color): what do x and y mean?"
    options: ["The top-left corner of the box around the circle", "The center of the circle", "The width and height"]
    answer: 1
    explain: "Unlike rect, which uses the top-left corner, a circle is positioned by its center."
  - q: "In what order are things painted?"
    options: ["Biggest first", "In the order of your code, so later shapes cover earlier ones", "Randomly"]
    answer: 1
  - q: "Why put the tree drawing into a function?"
    options: ["So it can be reused at different places without copying the code", "Functions run faster than loose code", "Because rect cannot be used in draw"]
    answer: 0
---

Time to make things look good. The engine can paint four kinds of things: rectangles, circles, lines and text. With only those, plus colors and a little imagination, you can draw almost any game: a spaceship is a few rectangles, a coin is a circle, a laser is a line, and the score is text.

## The drawing toolbox

```js
game.rect(x, y, width, height, color);     // x, y = top-left corner
game.circle(x, y, radius, color);          // x, y = CENTER
game.line(x1, y1, x2, y2, color, width);   // from point 1 to point 2
game.text(x, y, message, color, size);     // x, y = top-left of the text
```

Examples:

```js
game.rect(10, 10, 100, 20, game.RED);              // a red bar
game.circle(160, 120, 30, game.CYAN);              // a ball in the middle
game.line(0, 0, 320, 240, game.WHITE, 3);          // a thick diagonal
game.text(10, 10, 'Score: ' + 5, game.WHITE, 16);  // text with a number inside
```

The last argument of `line` (thickness) and `text` (size) may be left out. Text can be built from pieces with `+`: `'Score: ' + score` turns the number into text and glues the pieces together.

## Painting order

The screen is painted in the **order of your code**, like paint on a wall. A shape drawn later covers a shape drawn earlier. That is why the sky comes before the sun, and the sun before the grass that might hide its lower half. If something is invisible, check whether another shape is drawn on top of it.

## Colors are arrays

A color in this engine is an **array** of three numbers, `[red, green, blue]`, each from 0 (none) to 255 (full). Some are built in: `game.RED`, `game.ORANGE`, `game.YELLOW`, `game.GREEN`, `game.CYAN`, `game.BLUE`, `game.PURPLE`, `game.PINK`, `game.WHITE`, `game.GRAY`, `game.DARK` and `game.BLACK`. You can mix your own:

```js
const BROWN = [120, 72, 36];
const SKY = [100, 180, 255];    // a pale blue
```

Mixing works like light: `[255, 255, 0]` (red + green) is yellow, `[0, 0, 0]` is black and `[255, 255, 255]` is white. Colors with the same number three times are grays.

An array is a list written between square brackets with commas, and you read one item with its position, starting from zero: `BROWN[0]` is `120`.

## Your own drawing function

When you want a tree twice, you could copy and paste the drawing code. A better idea is to put it in a **function with parameters**:

```js
function drawTree(x, y) {
  game.rect(x, y, 10, 30, BROWN);
  game.circle(x + 5, y - 5, 20, game.GREEN);
}

drawTree(60, 150);     // a tree here
drawTree(250, 160);    // and another one there
```

`x` and `y` are placeholders that get filled in each time you call the function. Notice how the leaves are placed *relative* to the trunk (`x + 5`, `y - 5`), so the whole tree moves as a unit. Drawing functions are the secret of tidy games: `drawPlayer`, `drawEnemy`, `drawHud`...

## Motion in the scene

Anything that has a variable for its position can move: `game.circle(sunX, 40, 18, game.YELLOW)` draws the sun at `sunX`, and `sunX += 40 * dt` in `update` makes it glide to the right.

> **Watch out:** `TypeError: A color must be three numbers like [255, 0, 0]` means you passed something else, such as the word `'red'` or an array with only two numbers.
>
> **Watch out:** `TypeError: width must be a number, but got undefined` means one of your values was never set. Check the spelling of the variable.
>
> **Watch out:** drawing the background after the other shapes covers them. Background first, foreground last.
>
> **Watch out:** a circle is placed by its **center**, a rectangle by its **corner**. If a circle and a square do not line up, that is why.

> **Your turn:** choose your own `SKY` color, write `drawTree(x, y)` (a brown trunk with `game.rect` and green leaves with `game.circle`), move the sun with `sunX += 40 * dt`, and finish `draw` with a white horizon `game.line` and a `game.text` title.
