---
title: The Game Loop
summary: Every game is one loop that updates and draws 30 times a second, and here is the whole engine toolbox.
level: beginner
runner: remote
game: true
stdin: |
  # No key presses are needed in this lesson.
  # Lines look like:  <frame> <key> <down|up>   (for example:  10 right down)
files:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              int x = 0;            // the square's left edge, in pixels
              Engine.Frames(90);    // record 90 frames = 3 seconds

              while (Engine.Running())
              {
                  // 1. UPDATE: move the square 2 pixels to the right every frame.

                  // DRAW: wipe the screen, then draw the square and a label.
                  Engine.Clear(Color.Dark);
                  Engine.Rect(x, 110, 20, 20, Color.Yellow);
                  Engine.Text(8, 8, 14, Color.White, "Frame " + Engine.Frame);

                  // 2. Finish the frame: call the Present method of Engine here.
              }

              // 3. After the loop, print the final position like this:  final x: 180
          }
      }
check:
  output: "final x: 180"
  code:
    - { pattern: 'Engine\s*\.\s*Present\s*\(\s*\)', message: "Call Engine.Present() at the end of every frame." }
    - { pattern: 'x\s*\+=|x\s*=\s*x\s*\+', message: "Change x inside the loop so the square moves." }
hints:
  - "A game loop has three jobs each frame: update the numbers, draw the picture, then show it. You are missing the update (moving x) and the 'show it' step, and you must also print the result after the loop."
  - "Inside the while loop, add a line that makes x bigger by 2 (the += operator). At the bottom of the loop call the Present method on Engine. After the closing brace of the loop, use Console.WriteLine to print the text final x: followed by the value of x."
  - "Inside the loop: x += 2;  and, as the last line of the loop: Engine.Present();  After the loop: Console.WriteLine(\"final x: \" + x);"
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              int x = 0;            // the square's left edge, in pixels
              Engine.Frames(90);    // record 90 frames = 3 seconds

              while (Engine.Running())
              {
                  // UPDATE: move 2 pixels to the right every frame.
                  x += 2;

                  // DRAW
                  Engine.Clear(Color.Dark);
                  Engine.Rect(x, 110, 20, 20, Color.Yellow);
                  Engine.Text(8, 8, 14, Color.White, "Frame " + Engine.Frame);

                  Engine.Present();
              }

              Console.WriteLine("final x: " + x);
          }
      }
quiz:
  - q: "How many times per second does the game loop run in this engine?"
    options: ["30", "60", "1", "As fast as the computer can"]
    answer: 0
    explain: "The engine records 30 frames per second, so one frame is 1/30 of a second."
  - q: "What does Engine.Present() do?"
    options: ["Ends the program", "Marks the end of a frame so it can be shown", "Clears the screen", "Reads the keyboard"]
    answer: 1
  - q: "If you move a square by 2 pixels each frame for 90 frames, how far has it moved?"
    options: ["90 pixels", "2 pixels", "180 pixels", "30 pixels"]
    answer: 2
    explain: "2 pixels multiplied by 90 frames is 180 pixels."
  - q: "Where on the screen is the point (0, 0)?"
    options: ["The center", "The bottom-left corner", "The bottom-right corner", "The top-left corner"]
    answer: 3
    explain: "x grows to the right and y grows DOWNWARD, starting from the top-left corner."
---
Every video game, from Pong to the biggest Unity titles, is built around one idea: a **game loop**. In this lesson you will write your first loop, make a square slide across the screen, and meet the whole toolbox (the "engine") that this track gives you.

## What is a game loop?

A game looks like it moves, but really it shows a new still picture, called a **frame**, many times per second. Here we draw **30 frames per second**, so one frame lasts 1/30 of a second. In each frame the game does the same three jobs:

1. **Update**: change the numbers that describe the world (positions, score, ...).
2. **Draw**: paint the current state of the world.
3. **Present**: tell the engine "this frame is finished, show it".

In C# that is a `while` loop:

```csharp
while (Engine.Running())
{
    // update
    // draw
    Engine.Present();
}
```

`Engine.Running()` answers `true` as long as there are frames left to record, and `false` at the end, which leaves the loop. Each time it also moves the clock forward one frame.

## This is a replay, not live

Your C# program runs on a server, so it can not read your keyboard live. Instead the **Player input** tab holds a little script of key presses (`10 right down` means "at frame 10 the player presses the right arrow"). The program runs the whole game, the engine records every shape you draw, and your browser plays the recording back like a video. Because it is a replay, **everything must be predictable**: no random numbers, no clock. Edit the input script to "play" differently.

Anything you print with `Console.WriteLine` shows up as normal output. That is how **Check answer** knows what happened in your game, so every lesson ends by printing a result.

## The screen

The screen is **320 pixels wide and 240 tall**. The point `(0, 0)` is the **top-left** corner, `x` grows to the right and `y` grows **downward** (the opposite of a maths graph).

## Engine reference

Everything below is available automatically. You never need to write it yourself.

**`Engine`** (static members, so you write `Engine.Something`)

| Member | What it does |
|---|---|
| `Engine.Width`, `Engine.Height` | The screen size: 320 and 240. |
| `Engine.Frames(n)` | How many frames to record (default 180, which is 6 seconds; maximum 600). Call it once before the loop. |
| `Engine.Frame` | The number of the current frame, starting at 0. |
| `Engine.Running()` | The loop condition: `true` while frames remain. |
| `Engine.KeyDown(Key.Left)` | `true` on every frame the key is held. |
| `Engine.KeyPressed(Key.Space)` | `true` only on the single frame the key goes down. |
| `Engine.Clear(color)` | Fill the whole screen with one color. |
| `Engine.Rect(x, y, w, h, color)` | A filled rectangle, `(x, y)` is its top-left corner. |
| `Engine.Circle(x, y, radius, color)` | A filled circle, `(x, y)` is its center. |
| `Engine.Line(x1, y1, x2, y2, color)` | A line between two points. |
| `Engine.Text(x, y, size, color, "text")` | Text, `(x, y)` is its top-left corner. |
| `Engine.Present()` | End of the frame. |

Every drawing method also accepts three plain numbers instead of a color, for example `Engine.Clear(0, 0, 0)`.

**`Color`**: `Color.Black`, `White`, `Gray`, `Dark`, `Red`, `Orange`, `Yellow`, `Green`, `Cyan`, `Blue`, `Purple`, `Pink`. Make your own with `new Color(r, g, b)` where each value is 0 to 255.

**`Key`**: `Key.Left`, `Right`, `Up`, `Down`, `Space`, `A`, `D`, `W`, `S`, `Z`, `X`, `Enter`.

## Order matters when drawing

Shapes are painted in the order you call them, so later shapes cover earlier ones. Always `Clear` first, otherwise last frame's picture stays on the screen.

```csharp
Engine.Clear(Color.Dark);               // background first
Engine.Circle(160, 120, 30, Color.Red); // then things on top
Engine.Text(8, 8, 14, Color.White, "Hi");
```

> **Watch out:**
> - Forgetting `Engine.Present()` means the frame is never finished and nothing is shown.
> - Putting `Engine.Clear` at the end of the loop erases what you just drew.
> - Writing `engine.running()` in lowercase gives `error CS0103: The name 'engine' does not exist in the current context`. C# is case-sensitive.
> - Using `Engine.Frames(...)` inside the loop is too late; call it before the loop starts.
> - Do not declare your own types called `Engine`, `Key` or `Color`: they already exist.

## Going further

Change the speed from `2` to `3` (and the expected result), or draw a `Engine.Circle` instead of a rectangle. Try `Engine.Frames(300)` to record ten seconds.

> **Your turn:** inside the loop make `x` grow by 2 every frame, call `Engine.Present()` as the last line of the loop, and after the loop print `final x: ` followed by `x` (it should be 180).
