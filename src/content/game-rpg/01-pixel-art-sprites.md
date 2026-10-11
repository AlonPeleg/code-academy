---
title: "Step 1: Pixel art sprites"
summary: "Start the side-scroller RPG by drawing the built-in hero and your own 8 by 8 pixel picture, mirrored and scaled."
level: intermediate
runner: jsgame
files:
  - name: main.js
    code: |
      // Step 1: pixel art sprites.
      // The screen is 320 x 240 pixels. A sprite is a small picture made of pixels.

      const heroArt = game.art.warrior;          // one of the built-in characters

      // 2. TODO: your own art goes here. 8 rows of exactly 8 letters each, for example:
      //      'rr..rr..'
      //    '.' is empty, the other letters are colors from game.PALETTE.
      const myArt = [
      ];

      function update(dt) {
        // nothing moves yet
      }

      function draw() {
        game.clear([96, 168, 248]);                    // sky blue
        game.rect(0, 200, game.WIDTH, 40, [88, 60, 40]); // the ground

        // 1. TODO: draw heroArt.idle at x = 60, y = 180 (its feet touch the ground at y = 200).

        // 3. TODO: draw heroArt.idle again at x = 100, y = 180 but mirrored (turn the flip option on).

        // 4. TODO: draw it a third time at x = 160, y = 140 with the scale option set to 3.

        // 5. TODO: draw myArt at x = 250, y = 100 with the scale option set to 4.

        game.text(8, 8, 'Step 1: pixel art', game.WHITE, 14);
      }

      game.run(update, draw);
check:
  game:
    frames: 3
    keys: []
    expect: |
      (() => {
        const log = [];
        const original = game.sprite;
        game.sprite = (...args) => { log.push(args); return original(...args); };
        try { draw(); } finally { game.sprite = original; }
        const validArt = Array.isArray(myArt) && myArt.length === 8 &&
          myArt.every(row => typeof row === 'string' && row.length === 8 && [...row].every(ch => ch === '.' || ch in game.PALETTE));
        const coloredPixels = Array.isArray(myArt) ? myArt.join('').replace(/\./g, '').length : 0;
        return validArt && coloredPixels >= 12 &&
          log.length >= 4 &&
          log.some(a => a[3] && a[3].flip === true) &&
          log.some(a => a[3] && a[3].scale >= 2) &&
          log.some(a => a[2] === myArt);
      })()
    message: "Draw at least four sprites: the hero, a mirrored hero (flip), a bigger hero (scale), and myArt. myArt must be 8 rows of exactly 8 characters, using '.' or letters from game.PALETTE, with at least 12 colored pixels."
hints:
  - "A sprite is drawn with game.sprite(x, y, art, options). The art is an array of strings; the options are optional and written in curly braces, for example { scale: 2 }."
  - "Four calls: game.sprite(60, 180, heroArt.idle); then the same art at x = 100 with { flip: true }; at x = 160, y = 140 with { scale: 3 }; and myArt at x = 250, y = 100 with { scale: 4 }. For myArt write eight strings of eight characters, for example '..KKKK..'."
  - "game.sprite(60, 180, heroArt.idle);  game.sprite(100, 180, heroArt.idle, { flip: true });  game.sprite(160, 140, heroArt.idle, { scale: 3 });  game.sprite(250, 100, myArt, { scale: 4 });  and myArt = ['..KKKK..', '.KCCWCK.', 'KCCWCCcK', 'KCCCCCcK', '.KCCCcK.', '..KCcK..', '...KK...', '........']"
solution:
  - name: main.js
    code: |
      // Step 1: pixel art sprites.
      // The screen is 320 x 240 pixels. A sprite is a small picture made of pixels.

      const heroArt = game.art.warrior;          // one of the built-in characters

      // Your own art: 8 rows of exactly 8 letters. '.' is empty, the other letters are colors.
      const myArt = [
        '..KKKK..',
        '.KCCWCK.',
        'KCCWCCcK',
        'KCCCCCcK',
        '.KCCCcK.',
        '..KCcK..',
        '...KK...',
        '........',
      ];

      function update(dt) {
        // nothing moves yet
      }

      function draw() {
        game.clear([96, 168, 248]);                    // sky blue
        game.rect(0, 200, game.WIDTH, 40, [88, 60, 40]); // the ground

        game.sprite(60, 180, heroArt.idle);                      // facing right
        game.sprite(100, 180, heroArt.idle, { flip: true });     // mirrored: facing left
        game.sprite(160, 140, heroArt.idle, { scale: 3 });       // three times bigger
        game.sprite(250, 100, myArt, { scale: 4 });              // our own gem, four times bigger

        game.text(8, 8, 'Step 1: pixel art', game.WHITE, 14);
      }

      game.run(update, draw);
quiz:
  - q: "In pixel art written as text, what does the character '.' mean?"
    options: ["Black", "Transparent: nothing is drawn there", "White"]
    answer: 1
    explain: "Dots are empty pixels, so the background shows through. Every other letter is looked up in game.PALETTE."
  - q: "The built-in art faces right. How do you draw the hero looking left?"
    options: ["game.sprite(x, y, heroArt.idle, { left: true })", "game.sprite(x, y, heroArt.idle, { scale: -1 })", "game.sprite(x, y, heroArt.idle, { flip: true })"]
    answer: 2
  - q: "Why must every row of an art array have the same length?"
    options: ["Because the picture is a rectangle: each row is one line of pixels of equal width", "Because JavaScript only allows equal strings in an array", "It does not matter, short rows are padded automatically"]
    answer: 0
    explain: "If a row is shorter or longer the engine reports 'Every row of the art must have the same length'."
  - q: "How big on the screen is a 16 x 20 sprite drawn with { scale: 3 }?"
    options: ["19 x 23 pixels", "48 x 60 pixels", "16 x 60 pixels"]
    answer: 1
---
Welcome to the **Side-Scroller RPG** project! Over the coming steps we build a small adventure in the style of MapleStory: a hero who walks, jumps, fights monsters and explores a big scrolling map. We build it **one step at a time**, and every step starts with the finished code of the step before. Today is the fun part: pictures.

## Where we are

Nothing yet. The game has an `update` function that does nothing and a `draw` function that paints the sky. In this step we only **draw**, but we learn how every picture in the game works.

## What is a sprite?

A **sprite** is a small picture made of pixels, like a character or a tile of the ground. In this engine a sprite is just an **array of text rows**. Each letter is one pixel and each letter stands for a color:

```js
const dot = [
  '.rr.',
  'rrrr',
  '.rr.',
];
```

A `.` is a see-through pixel and `r` is red. The letters come from `game.PALETTE`. These are the ones we will use most:

| Letter | Color | Letter | Color |
| --- | --- | --- | --- |
| `K` | near black (outlines) | `r` / `R` | red / dark red |
| `W` | white | `u` / `n` | blue / dark blue |
| `G` / `g` | yellow / dark yellow | `a` / `q` | green / dark green |
| `C` / `c` | cyan / dark cyan | `o` / `w` | dark brown / light brown |

## Drawing a sprite

The engine has a whole library of ready-made art in `game.art`: the four classes (`warrior`, `mage`, `archer`, `thief`) with frames `idle`, `walk1`, `walk2`, `jump` and `attack`, monsters like `slime` and `bat`, ground `tiles`, and little `icons` such as a heart. To put one on the screen:

```js
game.sprite(60, 180, game.art.warrior.idle);
```

`x` and `y` are the **top-left corner** of the picture. The hero is 20 pixels tall, so placing it at `y = 180` makes its feet touch a ground that starts at `y = 200`.

The fourth argument is an optional **options object** in curly braces:

- `flip: true` mirrors the picture. All built-in art faces **right**, so this makes the hero look left.
- `scale: 3` draws the picture three times as big. Pixels stay sharp and square, which is the classic retro look.
- `alpha: 0.5` makes it half see-through (we will use this later for blinking).

```js
game.sprite(100, 180, game.art.warrior.idle, { flip: true });
game.sprite(160, 140, game.art.warrior.idle, { scale: 3, flip: true });
```

## Your own art

Writing your own art means filling in an 8 by 8 grid. Every row is a string of exactly 8 characters, and there are 8 rows. Start with an outline in `K`, fill it with a color, and add a `W` highlight so it sparkles. Then draw it large with `scale: 4`, otherwise 8 pixels are tiny on a 320 pixel screen.

> **Watch out:**
> - `Every row of the art must have the same length. Row 3 has 7 letters but row 1 has 8.` means you lost or added a character. Count them.
> - `Unknown color letter "x" in the art` means that letter is not in `game.PALETTE`. Use `.` or a letter from the table.
> - Rows are **strings**, so each needs quotes and a comma after it.
> - `options` go in the fourth place: `game.sprite(x, y, art, { flip: true })`, not `game.sprite(x, y, { flip: true })`.

## Going further

Try `game.art.slime.idle`, `game.art.mage.jump` or `game.art.tiles.brick`, and change `heroArt` to another class. Everything we build later will work with any hero.

> **Your turn:** in `main.js` do the numbered steps. (1) Draw `heroArt.idle` at `x = 60`, `y = 180`. (2) Fill `myArt` with 8 strings of 8 characters (at least 12 colored pixels, only `.` and palette letters). (3) Draw the hero again at `x = 100`, `y = 180` with `flip` turned on. (4) Draw it a third time at `x = 160`, `y = 140` with `scale` 3. (5) Draw `myArt` at `x = 250`, `y = 100` with `scale` 4.
