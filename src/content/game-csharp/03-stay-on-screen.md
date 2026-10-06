---
title: Keeping the Player on Screen
summary: Use Math.Min, Math.Max and the screen size to clamp a position so the player can never leave the window.
level: beginner
runner: remote
game: true
stdin: |
  # <frame> <key> <down|up>
  # Run right for 55 frames: far past the right edge
  5 right down
  60 right up
  # Run down for 50 frames: past the bottom edge
  70 down down
  120 down up
  # Run left for 70 frames: past the left edge
  130 left down
  200 left up
  # Go up for 20 frames
  210 up down
  230 up up
files:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              const int Speed = 5;
              const int Size = 20;     // the square is 20 x 20
              int x = 150;
              int y = 110;
              int furthestRight = x;

              Engine.Frames(260);
              while (Engine.Running())
              {
                  // UPDATE: move
                  if (Engine.KeyDown(Key.Left))  x -= Speed;
                  if (Engine.KeyDown(Key.Right)) x += Speed;
                  if (Engine.KeyDown(Key.Up))    y -= Speed;
                  if (Engine.KeyDown(Key.Down))  y += Speed;

                  // 1. Clamp x between 0 and (screen width - Size).
                  //    Use Min and Max from Math, and the Width constant of Engine.
                  // 2. Clamp y between 0 and (screen height - Size) the same way.
                  // 3. Remember the biggest x ever reached in furthestRight
                  //    (set it to the larger of furthestRight and x).

                  // DRAW
                  Engine.Clear(Color.Dark);
                  Engine.Rect(x, y, Size, Size, Color.Cyan);
                  Engine.Present();
              }

              Console.WriteLine("final x: " + x);
              Console.WriteLine("final y: " + y);
              Console.WriteLine("furthest right: " + furthestRight);
          }
      }
check:
  output: |
    final x: 0
    final y: 120
    furthest right: 300
  code:
    - { pattern: 'Math\s*\.\s*Min\s*\(', message: "Use Math.Min to stop the player at the right and bottom edges." }
    - { pattern: 'Math\s*\.\s*Max\s*\(', message: "Use Math.Max to stop the player at the left and top edges." }
    - { pattern: 'Engine\s*\.\s*Height', message: "Use Engine.Height for the bottom edge instead of typing 240." }
hints:
  - "After moving, 'fix' the position so it stays inside the screen. Math.Min(a, b) gives the smaller number (a ceiling) and Math.Max(a, b) gives the larger (a floor). Combine them to make a clamp: first the ceiling, then the floor."
  - "The player's x position is its LEFT edge, so the largest allowed x is Engine.Width - Size. For x: x = Math.Max(0, Math.Min(x, Engine.Width - Size)). Do the same for y with Engine.Height. furthestRight needs only Math.Max."
  - "x = Math.Max(0, Math.Min(x, Engine.Width - Size));  y = Math.Max(0, Math.Min(y, Engine.Height - Size));  furthestRight = Math.Max(furthestRight, x);"
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              const int Speed = 5;
              const int Size = 20;     // the square is 20 x 20
              int x = 150;
              int y = 110;
              int furthestRight = x;

              Engine.Frames(260);
              while (Engine.Running())
              {
                  // UPDATE: move
                  if (Engine.KeyDown(Key.Left))  x -= Speed;
                  if (Engine.KeyDown(Key.Right)) x += Speed;
                  if (Engine.KeyDown(Key.Up))    y -= Speed;
                  if (Engine.KeyDown(Key.Down))  y += Speed;

                  // Stay on screen (the position is the square's top-left corner)
                  x = Math.Max(0, Math.Min(x, Engine.Width - Size));
                  y = Math.Max(0, Math.Min(y, Engine.Height - Size));

                  furthestRight = Math.Max(furthestRight, x);

                  // DRAW
                  Engine.Clear(Color.Dark);
                  Engine.Rect(x, y, Size, Size, Color.Cyan);
                  Engine.Present();
              }

              Console.WriteLine("final x: " + x);
              Console.WriteLine("final y: " + y);
              Console.WriteLine("furthest right: " + furthestRight);
          }
      }
quiz:
  - q: "What does Math.Min(7, 3) return?"
    options: ["7", "10", "3", "4"]
    answer: 2
  - q: "A square is 20 pixels wide and the screen is 320 wide. What is the largest x that keeps it fully on screen?"
    options: ["320", "300", "340", "20"]
    answer: 1
    explain: "x is the left edge, so the right edge is x + 20. That must not pass 320, so x can be at most 300."
  - q: "Which line stops x from going below 0?"
    options: ["x = Math.Min(0, x);", "x = Math.Max(x, 320);", "x = 0 - x;", "x = Math.Max(0, x);"]
    answer: 3
    explain: "Max picks the larger value, so x can never be smaller than 0."
  - q: "Why use Engine.Width instead of typing 320?"
    options: ["It is faster to run", "Your code keeps working if the screen size ever changes, and the meaning is clearer", "C# does not allow numbers in code", "It makes the square bigger"]
    answer: 1
---
If you hold the arrow key for too long, your square walks right out of the window and is lost forever. In this lesson you will **clamp** the position: force a number to stay between a minimum and a maximum. Clamping is everywhere in games: health that can not go below 0, a camera that stops at the edge of the map, a paddle that stays inside the court.

## The Math class

C# ships with a class called `Math` (it lives in `using System;`) full of helpers. Two of them are all you need:

```csharp
Math.Min(7, 3)   // 3  : the smaller of the two
Math.Max(7, 3)   // 7  : the larger of the two
```

They look like they do the opposite of what you want, so think of them this way:

- `Math.Min(x, 300)` is a **ceiling**: the result can never be bigger than 300.
- `Math.Max(0, x)` is a **floor**: the result can never be smaller than 0.

Combine them and you have a clamp:

```csharp
x = Math.Max(0, Math.Min(x, 300));
// x = 450  ->  Min gives 300  ->  Max gives 300
// x = -30  ->  Min gives -30  ->  Max gives 0
// x = 120  ->  Min gives 120  ->  Max gives 120
```

Read it from the inside out: first apply the ceiling, then the floor.

## Where is the right edge?

A rectangle is drawn from its **top-left corner**. If the square is 20 pixels wide and its left edge `x` is 310, its right edge is at 330, which is already off the 320-pixel screen. So the largest allowed `x` is not the screen width, it is:

```csharp
Engine.Width - Size    // 320 - 20 = 300
```

For the vertical direction use `Engine.Height - Size` (240 - 20 = 220). `Engine.Width` and `Engine.Height` are built-in constants, so you never need to type 320 or 240 yourself.

## Order of update steps

Inside the loop the order is: **move first, then clamp**, then draw. If you clamp before moving, the player can still be drawn outside the screen for one frame.

```csharp
x += Speed;                                        // 1. move
x = Math.Max(0, Math.Min(x, Engine.Width - Size)); // 2. clamp
Engine.Rect(x, y, Size, Size, Color.Cyan);         // 3. draw
```

## Tracking a record

`Math.Max` is also how you remember the biggest value you have ever seen. If `best` holds the record so far, then `best = Math.Max(best, x);` raises it whenever `x` beats it, and leaves it alone otherwise.

> **Watch out:**
> - Swapping the two: `Math.Max(x, 300)` does **not** limit x to 300, it forces x to be at least 300.
> - Forgetting to subtract the size: the clamp `Math.Min(x, Engine.Width)` lets the square slide half out of the window.
> - Writing `Math.min(...)` in lowercase gives `error CS0117: 'Math' does not contain a definition for 'min'`.
> - Forgetting `using System;` gives `error CS0103: The name 'Math' does not exist in the current context`.
> - Calling `Math.Min(x)` with a single argument gives `error CS1501: No overload for method 'Min' takes 1 arguments`.

## Going further

Make the square wrap around instead: if `x` goes past the right edge, set it back to 0. Which feels better for a spaceship? Which for a platformer?

> **Your turn:** after the movement `if`s, clamp `x` between 0 and `Engine.Width - Size` and `y` between 0 and `Engine.Height - Size`, and keep `furthestRight` equal to the largest `x` reached. You should finish at `x = 0`, `y = 120`, with a furthest right of 300.
