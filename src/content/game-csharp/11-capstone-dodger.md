---
title: "Capstone: Falling Blocks Dodger"
summary: "Combine classes, inheritance, polymorphism and a List of GameObjects into a dodging game with lives and a score."
level: advanced
runner: remote
game: true
stdin: |
  # Slide left, then right, then left again to dodge the red blocks and catch the stars
  10 left down
  110 left up
  195 right down
  240 right up
  320 left down
  360 left up
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class GameState
      {
          public int Score;
          public int Lives = 3;
      }

      abstract class GameObject
      {
          public int X, Y, Width, Height;
          public bool Dead;

          public abstract void Update(GameState state);
          public abstract void Draw();
          public virtual void OnTouch(GameState state) { }     // most objects ignore the player

          public bool Overlaps(GameObject o)
          {
              return X < o.X + o.Width && X + Width > o.X && Y < o.Y + o.Height && Y + Height > o.Y;
          }
      }

      class Player : GameObject
      {
          public Player()
          {
              Width = 24;
              Height = 16;
              X = 148;
              Y = 212;
          }

          public override void Update(GameState state)
          {
              if (Engine.KeyDown(Key.Left)) X -= 5;
              if (Engine.KeyDown(Key.Right)) X += 5;
              X = Math.Max(0, Math.Min(X, Engine.Width - Width));
          }

          public override void Draw() { Engine.Rect(X, Y, Width, Height, Color.Cyan); }
      }

      class Block : GameObject
      {
          int speed;

          public Block(int x, int speed)
          {
              X = x;
              Y = -20;
              Width = 20;
              Height = 20;
              this.speed = speed;
          }

          public override void Update(GameState state)
          {
              Y += speed;
              if (Y > Engine.Height)
              {
                  Dead = true;
                  state.Score += 1;                // dodged it
              }
          }

          public override void Draw() { Engine.Rect(X, Y, Width, Height, Color.Red); }

          public override void OnTouch(GameState state)
          {
              // 1. Touching a block costs one life (state.Lives--) and the block is Dead.
          }
      }

      class Star : GameObject
      {
          public Star(int x)
          {
              X = x;
              Y = -14;
              Width = 14;
              Height = 14;
          }

          public override void Update(GameState state)
          {
              Y += 3;
              if (Y > Engine.Height) Dead = true;
          }

          public override void Draw() { Engine.Circle(X + 7, Y + 7, 7, Color.Yellow); }

          public override void OnTouch(GameState state)
          {
              // 2. Catching a star is worth 5 points and the star is Dead.
          }
      }

      class Program
      {
          static void Main()
          {
              GameState state = new GameState();
              Player player = new Player();
              List<GameObject> objects = new List<GameObject>();
              int spawned = 0;

              Engine.Frames(400);
              while (Engine.Running() && state.Lives > 0)
              {
                  if (Engine.Frame % 20 == 0)
                  {
                      int x = (spawned * 97 + 30) % 290;
                      if (spawned % 4 == 3) objects.Add(new Star(x));
                      else objects.Add(new Block(x, 4 + spawned % 3));
                      spawned++;
                  }

                  player.Update(state);
                  foreach (GameObject o in objects)
                  {
                      o.Update(state);
                      // 3. If this object is alive and overlaps the player, let it react (its OnTouch method gets the state).
                  }
                  objects.RemoveAll(o => o.Dead);

                  Engine.Clear(Color.Dark);
                  player.Draw();
                  foreach (GameObject o in objects) o.Draw();
                  Engine.Text(8, 8, 14, Color.White, "Score " + state.Score + "   Lives " + state.Lives);
                  Engine.Present();
              }
              Console.WriteLine("score: " + state.Score);
              Console.WriteLine("lives: " + state.Lives);
          }
      }
check:
  output: |
    score: 28
    lives: 2
  code:
    - { pattern: 'class\s+Star\s*:\s*GameObject', message: "Star must inherit from GameObject." }
    - { pattern: '\.OnTouch\s*\(\s*state\s*\)', message: "Call o.OnTouch(state) when an object overlaps the player." }
hints:
  - "Each object type decides for itself what touching the player means (that is what override is for). The main loop only has to ask: is it alive, does it overlap the player, then call OnTouch."
  - "Block.OnTouch: state.Lives--; Dead = true;   Star.OnTouch: state.Score += 5; Dead = true;   In the foreach loop in Main, right after o.Update(state): if the object is not Dead and o.Overlaps(player), call o.OnTouch(state)."
  - "if (!o.Dead && o.Overlaps(player)) o.OnTouch(state);   placed inside the foreach, after o.Update(state);"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class GameState
      {
          public int Score;
          public int Lives = 3;
      }

      abstract class GameObject
      {
          public int X, Y, Width, Height;
          public bool Dead;

          public abstract void Update(GameState state);
          public abstract void Draw();
          public virtual void OnTouch(GameState state) { }     // most objects ignore the player

          public bool Overlaps(GameObject o)
          {
              return X < o.X + o.Width && X + Width > o.X && Y < o.Y + o.Height && Y + Height > o.Y;
          }
      }

      class Player : GameObject
      {
          public Player()
          {
              Width = 24;
              Height = 16;
              X = 148;
              Y = 212;
          }

          public override void Update(GameState state)
          {
              if (Engine.KeyDown(Key.Left)) X -= 5;
              if (Engine.KeyDown(Key.Right)) X += 5;
              X = Math.Max(0, Math.Min(X, Engine.Width - Width));
          }

          public override void Draw() { Engine.Rect(X, Y, Width, Height, Color.Cyan); }
      }

      class Block : GameObject
      {
          int speed;

          public Block(int x, int speed)
          {
              X = x;
              Y = -20;
              Width = 20;
              Height = 20;
              this.speed = speed;
          }

          public override void Update(GameState state)
          {
              Y += speed;
              if (Y > Engine.Height)
              {
                  Dead = true;
                  state.Score += 1;                // dodged it
              }
          }

          public override void Draw() { Engine.Rect(X, Y, Width, Height, Color.Red); }

          public override void OnTouch(GameState state)
          {
              state.Lives--;
              Dead = true;
          }
      }

      class Star : GameObject
      {
          public Star(int x)
          {
              X = x;
              Y = -14;
              Width = 14;
              Height = 14;
          }

          public override void Update(GameState state)
          {
              Y += 3;
              if (Y > Engine.Height) Dead = true;
          }

          public override void Draw() { Engine.Circle(X + 7, Y + 7, 7, Color.Yellow); }

          public override void OnTouch(GameState state)
          {
              state.Score += 5;
              Dead = true;
          }
      }

      class Program
      {
          static void Main()
          {
              GameState state = new GameState();
              Player player = new Player();
              List<GameObject> objects = new List<GameObject>();
              int spawned = 0;

              Engine.Frames(400);
              while (Engine.Running() && state.Lives > 0)
              {
                  if (Engine.Frame % 20 == 0)
                  {
                      int x = (spawned * 97 + 30) % 290;
                      if (spawned % 4 == 3) objects.Add(new Star(x));
                      else objects.Add(new Block(x, 4 + spawned % 3));
                      spawned++;
                  }

                  player.Update(state);
                  foreach (GameObject o in objects)
                  {
                      o.Update(state);
                      if (!o.Dead && o.Overlaps(player)) o.OnTouch(state);
                  }
                  objects.RemoveAll(o => o.Dead);

                  Engine.Clear(Color.Dark);
                  player.Draw();
                  foreach (GameObject o in objects) o.Draw();
                  Engine.Text(8, 8, 14, Color.White, "Score " + state.Score + "   Lives " + state.Lives);
                  Engine.Present();
              }
              Console.WriteLine("score: " + state.Score);
              Console.WriteLine("lives: " + state.Lives);
          }
      }
quiz:
  - q: "What does the abstract keyword on a method mean?"
    options: ["The method is private", "The method has no body in the base class and every subclass must override it", "The method runs only once", "The method is faster"]
    answer: 1
  - q: "What is polymorphism, as used in the main loop?"
    options: ["Converting numbers to strings", "Using many files", "Drawing in many colours", "Storing blocks and stars in one List<GameObject>, and each o.OnTouch(state) call runs the right subclass version"]
    answer: 3
    explain: "The loop never asks what type the object is."
  - q: "Why do objects set Dead = true instead of removing themselves from the list?"
    options: ["A list can not be changed while a foreach is walking through it, so we flag them and call RemoveAll afterwards", "Dead objects are drawn in gray", "It uses less memory", "Objects have no access to the list"]
    answer: 0
  - q: "What is the difference between virtual and abstract?"
    options: ["There is none", "virtual has a default body that may be replaced, abstract has none and must be replaced", "abstract is for numbers, virtual for text", "virtual methods can not be overridden"]
    answer: 1
---
Time to put everything together. In this capstone you build a small **falling-blocks dodger**: red blocks fall, you slide left and right to avoid them, yellow stars give bonus points, and you have three lives. The new ideas are **inheritance** and **polymorphism**, the backbone of Unity's `GameObject` and `MonoBehaviour`.

## One base class, many kinds of object

Player, blocks and stars all have a position, a size, a way to update and a way to draw. Writing that three times is how bugs breed. So we write it once in a base class and let the others **inherit** it:

```csharp
abstract class GameObject
{
    public int X, Y, Width, Height;
    public bool Dead;

    public abstract void Update(GameState state);
    public abstract void Draw();
    public virtual void OnTouch(GameState state) { }

    public bool Overlaps(GameObject o) { /* rectangle test */ }
}
```

Three keywords matter:

* `abstract class` means "you can not create a plain GameObject, it is only a template for subclasses".
* `abstract` methods have no body: every subclass **must** supply one (`override`). Forget one and you get `error CS0534: 'Star' does not implement inherited abstract member 'GameObject.Update(GameState)'`.
* `virtual` methods have a default body that subclasses **may** replace. `OnTouch` does nothing by default, so `Player` does not need to mention it.

A subclass is written `class Block : GameObject` and every method it replaces says `override`:

```csharp
class Star : GameObject
{
    public override void Update(GameState state) { Y += 3; }
    public override void OnTouch(GameState state) { state.Score += 5; Dead = true; }
}
```

`Star` gets `X`, `Y`, `Dead` and `Overlaps` for free.

## Polymorphism: one list, one loop

Because a `Block` *is a* `GameObject`, you can keep every kind in a single `List<GameObject>` and treat them all alike:

```csharp
foreach (GameObject o in objects)
{
    o.Update(state);
    if (!o.Dead && o.Overlaps(player)) o.OnTouch(state);
}
```

The loop does not know whether `o` is a block or a star. At run time C# calls the right `Update` and the right `OnTouch`: a block costs a life, a star adds five points. This is polymorphism, and it means that adding a new object type (a shield power-up, say) needs a new class and one `Add` line, but **no change to the loop**.

## Shared state, dead flags and cleanup

Lives and score live in a small `GameState` object that is passed to `Update` and `OnTouch`, so objects can change the score without global variables. Objects never remove themselves from the list. They set `Dead = true`, and after the loop one call does the cleanup:

```csharp
objects.RemoveAll(o => o.Dead);
```

That is the same "flag first, remove later" rule as in the bullets lesson: changing a list inside its own `foreach` throws an exception.

## Deterministic "randomness"

A replay has to be repeatable, so nothing is truly random. Every 20 frames a new object appears at `x = (spawned * 97 + 30) % 290`. The numbers jump around the screen in an irregular way, yet the same game always produces the same pattern. Every fourth object is a star, the rest are blocks that fall at speeds 4, 5 or 6 pixels per frame. A block that falls off the bottom is "dodged" and is worth one point.

> **Watch out:**
> - Forgetting `override` on `OnTouch`: you only get `warning CS0114: ... hides inherited member`, and the empty base version runs, so touching a star does nothing. Always write `public override`.
> - Calling `new GameObject()` on an abstract class: `error CS0144: Cannot create an instance of the abstract class`.
> - Checking collisions with dead objects: a block that already hit you would cost a second life in the same frame. That is why the loop tests `!o.Dead`.
> - Removing from `objects` inside the `foreach`: `InvalidOperationException: Collection was modified`.

## What the replay does

The input tab slides the ship left, then right, then left again. Run the starter first: the ship just floats through everything, so it keeps 3 lives and only scores for dodged blocks. In the finished game it should lose two lives and score 28 points. If `Lives` reaches 0, the loop ends early thanks to `while (Engine.Running() && state.Lives > 0)`.

## Going further

Add a third subclass, `Shield : GameObject`, that gives back a life. Increase the block speed with the score. Or add a `Bullet` class and make this a space shooter: the same list and the same loop will do.

> **Your turn:** make the objects react to the player. Fill in `Block.OnTouch` (one life lost, the block is dead), `Star.OnTouch` (five points, the star is dead), and the collision test in the main loop (`o.OnTouch(state)` for a living object that overlaps the player). The program should print `score: 28` and `lives: 2`.
