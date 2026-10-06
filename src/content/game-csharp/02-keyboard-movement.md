---
title: Keyboard Input and Movement
summary: Read the arrow keys with Engine.KeyDown and move a square a fixed speed each frame.
level: beginner
runner: remote
game: true
stdin: |
  # <frame> <key> <down|up>
  # Move right for 30 frames (10 to 39)
  10 right down
  40 right up
  # Space is held for 10 frames, twice
  20 space down
  30 space up
  70 space down
  80 space up
  # Move left for 20 frames (60 to 79)
  60 left down
  80 left up
  # Move up for 10 frames (90 to 99)
  90 up down
  100 up up
files:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              const int Speed = 4;   // pixels per frame
              int x = 100;
              int y = 100;
              int shots = 0;

              Engine.Frames(120);
              while (Engine.Running())
              {
                  // UPDATE
                  if (Engine.KeyDown(Key.Right)) x += Speed;
                  // 1. Do the same for Key.Left (move x the other way).
                  // 2. Do the same for Key.Up and Key.Down (these change y).
                  //    Remember: y grows downward, so Up must make y smaller.
                  // 3. Count a shot every time Space is PRESSED
                  //    (use KeyPressed, so holding the key counts only once).

                  // DRAW
                  Engine.Clear(Color.Dark);
                  Engine.Rect(x, y, 20, 20, Color.Yellow);
                  Engine.Text(8, 8, 14, Color.White, "Shots: " + shots);
                  Engine.Present();
              }

              Console.WriteLine("final x: " + x);
              Console.WriteLine("final y: " + y);
              Console.WriteLine("shots: " + shots);
          }
      }
check:
  output: |
    final x: 140
    final y: 60
    shots: 2
  code:
    - { pattern: 'Key\s*\.\s*Left', message: "Handle Key.Left." }
    - { pattern: 'KeyPressed\s*\(\s*Key\s*\.\s*Space', message: "Count shots with Engine.KeyPressed(Key.Space)." }
hints:
  - "Each key needs its own if statement, just like the Right one that is already there. Moving left means subtracting Speed. Counting a shot only once per press needs a different engine call than the one that tells you a key is held."
  - "Add: if (Engine.KeyDown(Key.Left)) x -= Speed; and similar lines for Key.Up (y -= Speed) and Key.Down (y += Speed). For the shots use if (Engine.KeyPressed(Key.Space)) with shots++ inside."
  - "if (Engine.KeyDown(Key.Left)) x -= Speed;  if (Engine.KeyDown(Key.Up)) y -= Speed;  if (Engine.KeyDown(Key.Down)) y += Speed;  if (Engine.KeyPressed(Key.Space)) shots++;"
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              const int Speed = 4;   // pixels per frame
              int x = 100;
              int y = 100;
              int shots = 0;

              Engine.Frames(120);
              while (Engine.Running())
              {
                  // UPDATE
                  if (Engine.KeyDown(Key.Right)) x += Speed;
                  if (Engine.KeyDown(Key.Left))  x -= Speed;
                  if (Engine.KeyDown(Key.Up))    y -= Speed;
                  if (Engine.KeyDown(Key.Down))  y += Speed;
                  if (Engine.KeyPressed(Key.Space)) shots++;

                  // DRAW
                  Engine.Clear(Color.Dark);
                  Engine.Rect(x, y, 20, 20, Color.Yellow);
                  Engine.Text(8, 8, 14, Color.White, "Shots: " + shots);
                  Engine.Present();
              }

              Console.WriteLine("final x: " + x);
              Console.WriteLine("final y: " + y);
              Console.WriteLine("shots: " + shots);
          }
      }
quiz:
  - q: "What is the difference between Engine.KeyDown and Engine.KeyPressed?"
    options: ["There is none", "KeyDown is true while the key is held; KeyPressed is true only on the frame it goes down", "KeyPressed is true while the key is held; KeyDown only for one frame", "KeyDown works for letters, KeyPressed for arrows"]
    answer: 1
  - q: "A square has speed 4 per frame. The right key is held for 30 frames. How far does it move?"
    options: ["4 pixels", "30 pixels", "34 pixels", "120 pixels"]
    answer: 3
    explain: "Speed per frame times number of frames: 4 x 30 = 120."
  - q: "To move UP the screen, what must you do to y?"
    options: ["Subtract from it", "Add to it", "Set it to 0", "Multiply it by 2"]
    answer: 0
    explain: "y grows downward, so moving up means making y smaller."
  - q: "What does x -= 4; do?"
    options: ["Sets x to -4", "Compares x with 4", "Subtracts 4 from x and stores the result back in x", "Adds 4 to x"]
    answer: 2
---
Games are interactive because they **listen to the player**. In this lesson you will read the keyboard every frame and turn key presses into movement, which is the heart of almost every action game.

## Asking the engine about keys

The engine has two questions you can ask about a key, both inside the loop:

```csharp
if (Engine.KeyDown(Key.Right))
{
    x += 4;   // runs on EVERY frame while Right is held
}

if (Engine.KeyPressed(Key.Space))
{
    shots++;  // runs on ONE frame: the frame the key goes down
}
```

- `Engine.KeyDown(Key.Right)` returns a `bool` (`true` or `false`). It is `true` for as long as the key is held. Use it for **movement**.
- `Engine.KeyPressed(Key.Space)` is `true` only on the very first frame of a press. Use it for **one-off actions** such as shooting, jumping or opening a menu.
- `Key.Right` is a member of an **enum**: a fixed list of names. You get the names `Left`, `Right`, `Up`, `Down`, `Space`, `A`, `D`, `W`, `S`, `Z`, `X` and `Enter`.

## Speed per frame

Because the loop runs 30 times per second, "moving" just means changing the position a little each frame. If `Speed` is 4, holding a key for 30 frames (one second) moves the square 4 x 30 = 120 pixels. At 30 frames per second, `Speed = 4` is 120 pixels per second.

It is good style to give the number a name instead of repeating `4` everywhere:

```csharp
const int Speed = 4;   // a constant: can never change
```

Now to make the square faster you edit one line. The word `const` makes the compiler stop you from changing it by accident.

## Reading the script

The Player input tab is the "keyboard" of this replay:

```
10 right down    // at frame 10 the player starts holding right
40 right up      // at frame 40 they let go
```

So the right key is down for frames 10, 11, ..., 39, which is **30 frames**. Edit those numbers and press Run to see the square travel a different distance.

## Several keys at once

Use a separate `if` (not `else if`) for each key. Then the player can hold Right and Up together and move diagonally, because both `if`s run in the same frame:

```csharp
if (Engine.KeyDown(Key.Right)) x += Speed;
if (Engine.KeyDown(Key.Up))    y -= Speed;
```

> **Watch out:**
> - Moving up is `y -= Speed`, not `y += Speed`: y counts downward from the top of the screen.
> - Using `KeyDown` for a shot fires on every frame the key is held. For a one-off event use `KeyPressed`.
> - Writing `Engine.KeyDown(Left)` gives `error CS0103: The name 'Left' does not exist in the current context`. You must write `Key.Left`.
> - Writing `if (Engine.KeyDown(Key.Left)) x =- Speed;` sets x to minus Speed. The operator is `-=` (minus first, then equals).
> - Assigning a constant: `Speed = 5;` gives `error CS0131: The left-hand side of an assignment must be a variable`.

## Going further

Make the player hold `Key.Right` and `Key.Down` at the same time in the input tab and watch the diagonal. Then try a speed boost: turn `Speed` into a normal `int` variable that is 8 while `Key.Z` is held and 4 otherwise.

> **Your turn:** add `if` statements for Left, Up and Down (Left subtracts from `x`, Up subtracts from `y`, Down adds to `y`), and count shots with `Engine.KeyPressed(Key.Space)`. The player ends at `x = 140, y = 60` with `2` shots.
