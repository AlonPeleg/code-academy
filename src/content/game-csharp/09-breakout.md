---
title: "Breakout: Bricks and a Bouncing Ball"
summary: "Build a wall of bricks with nested loops, bounce a ball, and remove the bricks it hits with RemoveAll."
level: intermediate
runner: remote
game: true
stdin: |
  # <frame> <key> <down|up>
  21 right down
  33 right up
  69 right down
  100 right up
  247 left down
  252 left up
  279 left down
  285 left up
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Brick
      {
          public const int Width = 36;
          public const int Height = 12;
          public int X, Y;
          public Color Tint;

          public Brick(int x, int y, Color tint)
          {
              X = x;
              Y = y;
              Tint = tint;
          }

          public bool Hits(Ball b)
          {
              // 1. The ball and this brick overlap when they overlap on BOTH axes: the ball's left edge is
              //    left of the brick's right edge, its right edge is right of the brick's left edge,
              //    and the same for top and bottom. Join four comparisons with &&.
              return false;
          }

          public void Draw()
          {
              Engine.Rect(X, Y, Width, Height, Tint);
          }
      }

      class Ball
      {
          public const int Size = 6;
          public int X = 157, Y = 200, VX = 2, VY = -5;

          public void Update()
          {
              X += VX;
              Y += VY;
              if (X < 0 || X + Size > Engine.Width) VX = -VX;
              if (Y < 0) VY = -VY;
          }
      }

      class Paddle
      {
          public const int Width = 64;
          public const int Height = 8;
          public int X = 128;
          public const int Y = 220;

          public void Update()
          {
              if (Engine.KeyDown(Key.Left)) X -= 6;
              if (Engine.KeyDown(Key.Right)) X += 6;
              X = Math.Max(0, Math.Min(X, Engine.Width - Width));
          }

          public bool Catches(Ball b)
          {
              return b.VY > 0 && b.X + Ball.Size > X && b.X < X + Width && b.Y + Ball.Size >= Y && b.Y + Ball.Size <= Y + Height + 5;
          }
      }

      class Program
      {
          static void Main()
          {
              Color[] rowColors = { Color.Red, Color.Orange, Color.Yellow, Color.Green };
              List<Brick> bricks = new List<Brick>();
              for (int row = 0; row < 4; row++)
              {
                  for (int col = 0; col < 8; col++)
                  {
                      bricks.Add(new Brick(8 + col * 38, 40 + row * 16, rowColors[row]));
                  }
              }
              Ball ball = new Ball();
              Paddle paddle = new Paddle();
              int lives = 3;

              Engine.Frames(300);
              while (Engine.Running() && lives > 0)
              {
                  paddle.Update();
                  ball.Update();

                  if (paddle.Catches(ball))
                  {
                      ball.VY = -Math.Abs(ball.VY);
                      ball.VX = (ball.X + Ball.Size / 2 - (paddle.X + Paddle.Width / 2)) / 10;
                      if (ball.VX == 0) ball.VX = 1;
                  }
                  // 2. Remove every brick the ball hits with the list's RemoveAll method. It returns how many
                  //    were removed: if that number is above 0, flip the ball's vertical speed (VY = -VY).

                  if (ball.Y > Engine.Height)
                  {
                      lives--;
                      ball = new Ball();
                  }

                  Engine.Clear(Color.Dark);
                  foreach (Brick b in bricks) b.Draw();
                  Engine.Rect(paddle.X, Paddle.Y, Paddle.Width, Paddle.Height, Color.Cyan);
                  Engine.Rect(ball.X, ball.Y, Ball.Size, Ball.Size, Color.White);
                  Engine.Text(8, 8, 12, Color.White, "Bricks: " + bricks.Count + "  Lives: " + lives);
                  Engine.Present();
              }
              Console.WriteLine("bricks left: " + bricks.Count);
              Console.WriteLine("lives: " + lives);
          }
      }
check:
  output: |
    bricks left: 21
    lives: 3
  code:
    - { pattern: '\.RemoveAll\s*\(', message: "Use bricks.RemoveAll(...) to take the hit bricks out of the list." }
hints:
  - "Two jobs: the Hits method (a rectangle overlap test: four comparisons joined with &&) and one RemoveAll call that returns how many bricks were removed."
  - "Hits: the ball's left edge is left of the brick's right edge, its right edge is right of the brick's left edge, and the same for top and bottom. In Main: int broken = bricks.RemoveAll(...); if (broken > 0) flip the ball's VY."
  - "return b.X < X + Width && b.X + Ball.Size > X && b.Y < Y + Height && b.Y + Ball.Size > Y;   and   int broken = bricks.RemoveAll(b => b.Hits(ball)); if (broken > 0) ball.VY = -ball.VY;"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Brick
      {
          public const int Width = 36;
          public const int Height = 12;
          public int X, Y;
          public Color Tint;

          public Brick(int x, int y, Color tint)
          {
              X = x;
              Y = y;
              Tint = tint;
          }

          public bool Hits(Ball b)
          {
              return b.X < X + Width && b.X + Ball.Size > X && b.Y < Y + Height && b.Y + Ball.Size > Y;
          }

          public void Draw()
          {
              Engine.Rect(X, Y, Width, Height, Tint);
          }
      }

      class Ball
      {
          public const int Size = 6;
          public int X = 157, Y = 200, VX = 2, VY = -5;

          public void Update()
          {
              X += VX;
              Y += VY;
              if (X < 0 || X + Size > Engine.Width) VX = -VX;
              if (Y < 0) VY = -VY;
          }
      }

      class Paddle
      {
          public const int Width = 64;
          public const int Height = 8;
          public int X = 128;
          public const int Y = 220;

          public void Update()
          {
              if (Engine.KeyDown(Key.Left)) X -= 6;
              if (Engine.KeyDown(Key.Right)) X += 6;
              X = Math.Max(0, Math.Min(X, Engine.Width - Width));
          }

          public bool Catches(Ball b)
          {
              return b.VY > 0 && b.X + Ball.Size > X && b.X < X + Width && b.Y + Ball.Size >= Y && b.Y + Ball.Size <= Y + Height + 5;
          }
      }

      class Program
      {
          static void Main()
          {
              Color[] rowColors = { Color.Red, Color.Orange, Color.Yellow, Color.Green };
              List<Brick> bricks = new List<Brick>();
              for (int row = 0; row < 4; row++)
              {
                  for (int col = 0; col < 8; col++)
                  {
                      bricks.Add(new Brick(8 + col * 38, 40 + row * 16, rowColors[row]));
                  }
              }
              Ball ball = new Ball();
              Paddle paddle = new Paddle();
              int lives = 3;

              Engine.Frames(300);
              while (Engine.Running() && lives > 0)
              {
                  paddle.Update();
                  ball.Update();

                  if (paddle.Catches(ball))
                  {
                      ball.VY = -Math.Abs(ball.VY);
                      ball.VX = (ball.X + Ball.Size / 2 - (paddle.X + Paddle.Width / 2)) / 10;
                      if (ball.VX == 0) ball.VX = 1;
                  }
                  int broken = bricks.RemoveAll(b => b.Hits(ball));
                  if (broken > 0) ball.VY = -ball.VY;

                  if (ball.Y > Engine.Height)
                  {
                      lives--;
                      ball = new Ball();
                  }

                  Engine.Clear(Color.Dark);
                  foreach (Brick b in bricks) b.Draw();
                  Engine.Rect(paddle.X, Paddle.Y, Paddle.Width, Paddle.Height, Color.Cyan);
                  Engine.Rect(ball.X, ball.Y, Ball.Size, Ball.Size, Color.White);
                  Engine.Text(8, 8, 12, Color.White, "Bricks: " + bricks.Count + "  Lives: " + lives);
                  Engine.Present();
              }
              Console.WriteLine("bricks left: " + bricks.Count);
              Console.WriteLine("lives: " + lives);
          }
      }
quiz:
  - q: "What does the inner loop of the two nested for loops create?"
    options: ["The rows of bricks", "One brick for every column in a row", "The ball", "The paddle"]
    answer: 1
    explain: "The outer loop picks the row, the inner loop picks the column, and each pass adds one Brick."
  - q: "How does the ball bounce off a wall?"
    options: ["Its speed is set to 0", "It is deleted and created again", "The screen is rotated", "The sign of one velocity component is flipped, for example VX = -VX"]
    answer: 3
  - q: "Two rectangles overlap when..."
    options: ["their top-left corners are equal", "they overlap on the x axis OR on the y axis", "they overlap on both the x axis AND the y axis", "one has a bigger width"]
    answer: 2
  - q: "Why flip VY only once, after RemoveAll, instead of inside a loop for every brick?"
    options: ["A loop can not contain an if", "Flipping twice would cancel the bounce out", "Because VY is a constant", "It makes the ball faster"]
    answer: 1
---
Breakout is a wall of bricks, a bouncing ball and a paddle. It combines everything so far: a `List<T>` of objects, rectangle collisions and removing things from the list while the game runs. The new idea is **reacting to a collision** by changing the ball's velocity.

## Building a wall with nested loops

There are 32 bricks, in 4 rows of 8. Typing 32 `new Brick(...)` lines would be silly, so a loop inside a loop makes them. The outer loop counts rows, the inner loop counts columns, and the position is just arithmetic:

```csharp
for (int row = 0; row < 4; row++)
{
    for (int col = 0; col < 8; col++)
    {
        bricks.Add(new Brick(8 + col * 38, 40 + row * 16, rowColors[row]));
    }
}
```

Each brick is 36 pixels wide, so stepping 38 pixels leaves a 2 pixel gap. `rowColors` is an array of four `Color` values and `rowColors[row]` picks one per row. This pattern, "loop over a grid, spawn an object per cell", is how most tile and level generators start.

## Velocity and bouncing

The ball has a velocity, `(VX, VY)` pixels per frame, and every frame it adds that to its position. A bounce is nothing more than flipping the sign of one component:

```csharp
if (X < 0 || X + Size > Engine.Width) VX = -VX;   // left and right walls
if (Y < 0) VY = -VY;                              // the ceiling
```

The floor is different: there is no wall at the bottom. If the ball goes below the screen, the player loses a life and a fresh ball starts.

The paddle sends the ball back up (`VY = -Math.Abs(VY)` makes sure it goes up even if it was already negative) and steers it with the spot you hit: `VX = (ballCenter - paddleCenter) / 10`. Hit the left edge of the paddle and the ball flies left.

## Hitting a brick

Two rectangles overlap when they overlap on both axes. In the previous games you wrote that as a long expression. Now it lives in a method of the object that knows its own size, `Brick.Hits(Ball b)`:

```csharp
return b.X < X + Width && b.X + Ball.Size > X
    && b.Y < Y + Height && b.Y + Ball.Size > Y;
```

Read it as four true/false questions: is the ball's left edge left of my right edge, its right edge right of my left edge, and the same for top and bottom. All four must be true.

Then one line does the damage:

```csharp
int broken = bricks.RemoveAll(b => b.Hits(ball));
if (broken > 0) ball.VY = -ball.VY;
```

`RemoveAll` deletes every brick for which the lambda says `true` and returns how many that was. If at least one brick broke, the ball bounces. This is deliberately simple: a real game would check whether the hit came from the side or from below and flip `VX` or `VY` accordingly, but flipping `VY` already feels right for a first version.

## Static and instance members

Notice `Brick.Width`, `Ball.Size` and `Paddle.Y` written with the **class name**. They are `const` values: they belong to the class, not to one object, so you reach them through the class. `Y` and `X`, on the other hand, are different for every brick, so you use them through an instance (`b.X`). Inside the class itself you can write just `Width`.

> **Watch out:**
> - Modifying the list while looping over it with `foreach` throws `InvalidOperationException: Collection was modified`. Use `RemoveAll` after the loop, as here.
> - Joining the four comparisons with `||` instead of `&&`: nearly every brick then reports a hit, and the whole wall disappears in one frame.
> - Flipping `VY` for every brick that overlaps would bounce the ball twice and cancel out. Flip **once** (`if (broken > 0)`), not inside a loop.
> - A fast ball can jump over a thin object between two frames. That is called **tunnelling**. With a speed of 5 pixels and 12-pixel bricks it can not happen here.

## The replay

The "player" in the input tab only moves the paddle four times: right twice, then left twice, just enough to meet the ball each time it comes down. The ball breaks eleven bricks in 300 frames (10 seconds) and never falls. Try deleting a key line: the paddle misses, you lose a life, and a new ball starts from the middle. When `lives` reaches 0 the loop stops.

## Going further

Give the bottom row of bricks a higher score, or make the brick colour tell how many hits it needs (a `Hits` counter in `Brick` that goes down). Speed up the ball after every ten bricks.

> **Your turn:** write `Brick.Hits(Ball b)` with the four comparisons, then in `Main` remove every hit brick with `bricks.RemoveAll(...)` and flip `ball.VY` when at least one brick was removed. The program should print `bricks left: 21` and `lives: 3`.
