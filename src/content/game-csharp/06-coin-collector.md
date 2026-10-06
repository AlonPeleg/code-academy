---
title: Collisions and a Coin Collector
summary: Detect when two rectangles overlap, remove collected coins, and finish a complete little game with a score.
level: intermediate
runner: remote
game: true
stdin: |
  # <frame> <key> <down|up>
  # A tour of the board: right, up, right, down, left
  0 right down
  20 right up
  20 up down
  35 up up
  40 right down
  70 right up
  80 down down
  115 down up
  120 left down
  170 left up
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Coin
      {
          public const int Size = 12;
          public int X;
          public int Y;

          public Coin(int x, int y)
          {
              X = x;
              Y = y;
          }

          public void Draw()
          {
              Engine.Circle(X + Size / 2, Y + Size / 2, Size / 2, Color.Yellow);
          }
      }

      class Player
      {
          public const int Size = 20;
          public int X = 20;
          public int Y = 100;

          public void Update()
          {
              if (Engine.KeyDown(Key.Left))  X -= 4;
              if (Engine.KeyDown(Key.Right)) X += 4;
              if (Engine.KeyDown(Key.Up))    Y -= 4;
              if (Engine.KeyDown(Key.Down))  Y += 4;
              X = Math.Max(0, Math.Min(X, Engine.Width - Size));
              Y = Math.Max(0, Math.Min(Y, Engine.Height - Size));
          }

          public void Draw()
          {
              Engine.Rect(X, Y, Size, Size, Color.Cyan);
          }

          public bool Touches(Coin c)
          {
              // 1. Two rectangles overlap when ALL four of these are true:
              //    my left edge is left of the coin's right edge,
              //    my right edge is right of the coin's left edge,
              //    my top is above the coin's bottom, my bottom is below the coin's top.
              return false;
          }
      }

      class Program
      {
          static void Main()
          {
              Player player = new Player();
              List<Coin> coins = new List<Coin>();
              coins.Add(new Coin(100, 100));
              coins.Add(new Coin(100, 40));
              coins.Add(new Coin(220, 40));
              coins.Add(new Coin(220, 180));
              coins.Add(new Coin(40, 190));
              coins.Add(new Coin(280, 120));
              int score = 0;

              Engine.Frames(180);
              while (Engine.Running())
              {
                  player.Update();

                  // 2. Remove every coin the player touches (the list's RemoveAll method).
                  //    It returns how many it removed: add 10 points for each one to score.

                  Engine.Clear(Color.Dark);
                  foreach (Coin c in coins)
                  {
                      c.Draw();
                  }
                  player.Draw();
                  Engine.Text(8, 8, 14, Color.White, "Score: " + score);
                  Engine.Present();
              }

              Console.WriteLine("score: " + score);
              Console.WriteLine("coins left: " + coins.Count);
          }
      }
check:
  output: |
    score: 50
    coins left: 1
  code:
    - { pattern: '\.RemoveAll\s*\(', message: "Use coins.RemoveAll(...) to take the collected coins out of the list." }
hints:
  - "Two axis-aligned rectangles overlap only if they overlap on the x axis AND on the y axis. Write that as four comparisons joined with &&. Then ask the list to remove every coin for which Touches is true."
  - "Touches: return X < c.X + Coin.Size && X + Size > c.X && Y < c.Y + Coin.Size && Y + Size > c.Y;   In Main: RemoveAll gives back the number of removed items, so multiply it by 10 and add it to score."
  - "score += coins.RemoveAll(coin => player.Touches(coin)) * 10;   placed right after player.Update();"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Coin
      {
          public const int Size = 12;
          public int X;
          public int Y;

          public Coin(int x, int y)
          {
              X = x;
              Y = y;
          }

          public void Draw()
          {
              Engine.Circle(X + Size / 2, Y + Size / 2, Size / 2, Color.Yellow);
          }
      }

      class Player
      {
          public const int Size = 20;
          public int X = 20;
          public int Y = 100;

          public void Update()
          {
              if (Engine.KeyDown(Key.Left))  X -= 4;
              if (Engine.KeyDown(Key.Right)) X += 4;
              if (Engine.KeyDown(Key.Up))    Y -= 4;
              if (Engine.KeyDown(Key.Down))  Y += 4;
              X = Math.Max(0, Math.Min(X, Engine.Width - Size));
              Y = Math.Max(0, Math.Min(Y, Engine.Height - Size));
          }

          public void Draw()
          {
              Engine.Rect(X, Y, Size, Size, Color.Cyan);
          }

          public bool Touches(Coin c)
          {
              return X < c.X + Coin.Size && X + Size > c.X
                  && Y < c.Y + Coin.Size && Y + Size > c.Y;
          }
      }

      class Program
      {
          static void Main()
          {
              Player player = new Player();
              List<Coin> coins = new List<Coin>();
              coins.Add(new Coin(100, 100));
              coins.Add(new Coin(100, 40));
              coins.Add(new Coin(220, 40));
              coins.Add(new Coin(220, 180));
              coins.Add(new Coin(40, 190));
              coins.Add(new Coin(280, 120));
              int score = 0;

              Engine.Frames(180);
              while (Engine.Running())
              {
                  player.Update();

                  // RemoveAll returns how many coins it removed
                  score += coins.RemoveAll(coin => player.Touches(coin)) * 10;

                  Engine.Clear(Color.Dark);
                  foreach (Coin c in coins)
                  {
                      c.Draw();
                  }
                  player.Draw();
                  Engine.Text(8, 8, 14, Color.White, "Score: " + score);
                  Engine.Present();
              }

              Console.WriteLine("score: " + score);
              Console.WriteLine("coins left: " + coins.Count);
          }
      }
quiz:
  - q: "A player rectangle is at x = 100, width 20. A coin is at x = 125, width 12. Do they overlap on the x axis?"
    options: ["Yes, they overlap", "Only if their y values match", "No, the player ends at 120 and the coin starts at 125", "It depends on the colors"]
    answer: 2
    explain: "The player covers 100 to 120 and the coin covers 125 to 137, so there is a gap of 5 pixels."
  - q: "Why must the four overlap comparisons be joined with && (and) rather than || (or)?"
    options: ["|| is not allowed in C#", "Overlap needs ALL four conditions to be true at once", "&& is faster", "It makes the score bigger"]
    answer: 1
  - q: "What does List<T>.RemoveAll(...) return?"
    options: ["Nothing (void)", "true or false", "The list itself", "The number of items it removed"]
    answer: 3
  - q: "Where should the score live so that it survives from one frame to the next?"
    options: ["In a variable declared before the while loop", "In a variable declared inside the loop body", "In the Draw() method only", "Nowhere, the engine remembers it"]
    answer: 0
    explain: "Variables declared inside the loop body are created fresh every frame and forgotten at the end of it."
---
You now have every ingredient for a real game: a loop, keyboard input, a player class and a list of objects. The last missing piece is **collision detection**: finding out when two things touch. With it you can collect coins, hit enemies, bump into walls, and keep **score**. In this lesson you will finish a complete little game.

## The shape of the game

- A `Player` class that moves with the arrow keys and stays on screen.
- A `Coin` class: just a position and a `Draw()` method.
- A `List<Coin>` in `Main` holding all the coins on the board.
- An `int score` that grows by 10 for every coin collected.

Notice how short `Main` is: each class knows its own data and drawing, so `Main` only tells them *when* to act.

## Rectangle collision (AABB)

Most 2D games use rectangles as invisible "hit boxes". Two rectangles that are not rotated (we say **axis-aligned**) overlap only when they overlap **both** horizontally and vertically. The test is four comparisons:

```csharp
bool overlap =
    aLeft  < bRight  &&   // A starts before B ends
    aRight > bLeft   &&   // A ends after B starts
    aTop   < bBottom &&
    aBottom > bTop;
```

With a position `(X, Y)` and a size, "left" is `X`, "right" is `X + Size`, "top" is `Y` and "bottom" is `Y + Size`. Put the test in a method of `Player`, so reading the game loop feels natural:

```csharp
public bool Touches(Coin c)
{
    return X < c.X + Coin.Size && X + Size > c.X
        && Y < c.Y + Coin.Size && Y + Size > c.Y;
}
```

The method returns a `bool`. `&&` means "and": all four parts must be true. The coin's `Size` is a `const`, so it is reached through the class name: `Coin.Size`.

Try it on numbers. A player at x = 100 (so it covers 100 to 120) and a coin at x = 125 (covers 125 to 137): is `100 < 137` true? Yes. Is `120 > 125` true? No. So the whole test is false: there is a gap.

## Collecting with RemoveAll

In the last lesson `RemoveAll` took a lambda and deleted the matching items. Now the lambda asks the player:

```csharp
int collected = coins.RemoveAll(coin => player.Touches(coin));
score += collected * 10;
```

`RemoveAll` returns the **number of items it removed**, so one line can both delete the coins and give the points. The variable `score` is declared **before** the loop, so it keeps its value from frame to frame.

## Scoring and showing it

Show the score with `Engine.Text(8, 8, 14, Color.White, "Score: " + score);`. Gluing a string and a number with `+` turns the number into text automatically. At the end of the game, print the result with `Console.WriteLine`: that is the line **Check answer** reads.

> **Watch out:**
> - Using `||` instead of `&&` in the collision test makes the player "touch" coins from across the screen.
> - Mixing up the edges, such as `X + Size < c.X`: that checks whether they are *apart*, which is the opposite of overlap.
> - Declaring `int score = 0;` inside the loop resets it to 0 every frame, so it always ends as 0.
> - `Touches(Coin c)` forgetting `return`: `error CS0161: 'Player.Touches(Coin)': not all code paths return a value`.
> - A rectangle's `(X, Y)` is its top-left corner. For circles, `Engine.Circle` takes the center, which is why `Coin.Draw` adds `Size / 2`.

## Going further

Move the script around in the Player input tab so the player misses or collects different coins and watch the score change. Then add a countdown: end the game after fewer frames with `Engine.Frames(...)`, or give each coin a `Value` field so rare coins are worth more.

> **Your turn:** finish `Touches` with the four-part overlap test, then right after `player.Update();` use `coins.RemoveAll(...)` to remove touched coins and add 10 points for each. The tour collects 5 of the 6 coins: `score: 50` and `coins left: 1`.
