---
title: Lists of Game Objects
summary: Store many bullets in a List<T>, update them with foreach, and clean up the dead ones with RemoveAll.
level: intermediate
runner: remote
game: true
stdin: |
  # <frame> <key> <down|up>
  # The ship slides right for 10 frames
  5 right down
  15 right up
  # Single taps of space (each one fires one bullet)
  10 space down
  11 space up
  30 space down
  31 space up
  # Space is HELD for 15 frames, but KeyPressed only counts the first frame
  40 space down
  55 space up
  60 space down
  61 space up
  70 space down
  71 space up
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Bullet
      {
          public int X;
          public int Y;

          public Bullet(int x, int y)
          {
              X = x;
              Y = y;
          }

          public void Update()
          {
              Y -= 6;                     // flies up 6 pixels per frame
          }

          public void Draw()
          {
              Engine.Rect(X, Y, 4, 10, Color.Yellow);
          }

          public bool IsOffScreen()
          {
              return Y + 10 < 0;          // the whole bullet is above the top edge
          }
      }

      class Program
      {
          static void Main()
          {
              List<Bullet> bullets = new List<Bullet>();
              int shipX = 150;
              int fired = 0;

              Engine.Frames(80);
              while (Engine.Running())
              {
                  if (Engine.KeyDown(Key.Right)) shipX += 4;
                  if (Engine.KeyDown(Key.Left))  shipX -= 4;

                  // 1. When Space is PRESSED: add  new Bullet(shipX + 8, 200)  to the list
                  //    and add one to fired.

                  // 2. Update every bullet in the list (a foreach loop).

                  // 3. Remove every bullet that IsOffScreen() with one call on the list.

                  Engine.Clear(Color.Dark);
                  Engine.Rect(shipX, 210, 20, 20, Color.Cyan);
                  foreach (Bullet b in bullets)
                  {
                      b.Draw();
                  }
                  Engine.Text(8, 8, 14, Color.White, "Bullets: " + bullets.Count);
                  Engine.Present();
              }

              Console.WriteLine("fired: " + fired);
              Console.WriteLine("on screen: " + bullets.Count);
          }
      }
check:
  output: |
    fired: 5
    on screen: 2
  code:
    - { pattern: 'foreach\s*\(', message: "Use a foreach loop to update each bullet." }
    - { pattern: '\.RemoveAll\s*\(', message: "Use bullets.RemoveAll(...) to delete the bullets that left the screen." }
    - { pattern: 'KeyPressed\s*\(\s*Key\s*\.\s*Space', message: "Fire with Engine.KeyPressed(Key.Space) so a held key fires once." }
hints:
  - "A List<Bullet> grows with Add, can be walked through with foreach, and has a method that deletes every item matching a rule. Fire only when the key is PRESSED (not held)."
  - "Fire: if (Engine.KeyPressed(Key.Space)) { bullets.Add(new Bullet(shipX + 8, 200)); fired++; }. Update: foreach (Bullet b in bullets) b.Update();. Clean up: bullets.RemoveAll( ... ) with a lambda that calls IsOffScreen()."
  - "bullets.RemoveAll(bullet => bullet.IsOffScreen());   Place the foreach update BEFORE it, and never remove from the list inside the foreach itself."
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Bullet
      {
          public int X;
          public int Y;

          public Bullet(int x, int y)
          {
              X = x;
              Y = y;
          }

          public void Update()
          {
              Y -= 6;                     // flies up 6 pixels per frame
          }

          public void Draw()
          {
              Engine.Rect(X, Y, 4, 10, Color.Yellow);
          }

          public bool IsOffScreen()
          {
              return Y + 10 < 0;          // the whole bullet is above the top edge
          }
      }

      class Program
      {
          static void Main()
          {
              List<Bullet> bullets = new List<Bullet>();
              int shipX = 150;
              int fired = 0;

              Engine.Frames(80);
              while (Engine.Running())
              {
                  if (Engine.KeyDown(Key.Right)) shipX += 4;
                  if (Engine.KeyDown(Key.Left))  shipX -= 4;

                  if (Engine.KeyPressed(Key.Space))
                  {
                      bullets.Add(new Bullet(shipX + 8, 200));
                      fired++;
                  }

                  foreach (Bullet b in bullets)
                  {
                      b.Update();
                  }

                  bullets.RemoveAll(bullet => bullet.IsOffScreen());

                  Engine.Clear(Color.Dark);
                  Engine.Rect(shipX, 210, 20, 20, Color.Cyan);
                  foreach (Bullet b in bullets)
                  {
                      b.Draw();
                  }
                  Engine.Text(8, 8, 14, Color.White, "Bullets: " + bullets.Count);
                  Engine.Present();
              }

              Console.WriteLine("fired: " + fired);
              Console.WriteLine("on screen: " + bullets.Count);
          }
      }
quiz:
  - q: "Which line creates an empty list that can hold Bullet objects?"
    options: ["Bullet[] bullets = List();", "List<Bullet> bullets = new List<Bullet>();", "list bullets = [];", "new Bullet = List<bullets>;"]
    answer: 1
  - q: "What does bullets.Count give you?"
    options: ["The number of items currently in the list", "The total number of bullets ever fired", "The index of the last bullet", "The size of one bullet in pixels"]
    answer: 0
  - q: "What happens if you call bullets.Remove(...) inside a foreach over the same list?"
    options: ["It works perfectly", "The list is cleared", "The loop runs twice as fast", "An InvalidOperationException: Collection was modified"]
    answer: 3
    explain: "You must not change a list while foreach is walking through it. Use RemoveAll after the loop instead."
  - q: "In bullets.RemoveAll(bullet => bullet.IsOffScreen()), what is  bullet => ...  ?"
    options: ["A comparison that checks if two bullets are equal", "A new class called bullet", "A lambda: a tiny function run once for each item; items for which it returns true are removed", "An assignment"]
    answer: 2
---
One bullet is easy: three variables. But a spaceship can fire dozens, and you do not know in advance how many. You need a **collection** that grows and shrinks while the game runs. In C# the workhorse is `List<T>`, and it is how almost every Unity game keeps track of bullets, enemies, particles and pickups.

## List<T>

A `List<T>` is a resizable list of items that are all of type `T`. The `T` in angle brackets is the type of the items. A list of bullets is `List<Bullet>`. You need `using System.Collections.Generic;` at the top of the file.

```csharp
List<int> scores = new List<int>();   // an empty list
scores.Add(10);
scores.Add(25);
Console.WriteLine(scores.Count);      // prints: 2
Console.WriteLine(scores[1]);         // prints: 25  (the first item is index 0)
```

The commonly used members are `Add(item)`, `Remove(item)`, `Clear()`, `Count` (a property, no brackets) and the index `list[i]`.

## foreach: do something with every item

```csharp
foreach (Bullet b in bullets)
{
    b.Update();
}
```

Read it as "for each Bullet, which I will call `b`, in `bullets`: run the body". The variable `b` is a different bullet each time around. This is the clean way to update and to draw every object.

## Spawning on a key press

Create the bullet with `new` and put it in the list. Use `KeyPressed` so a held key fires only once instead of 30 times per second:

```csharp
if (Engine.KeyPressed(Key.Space))
{
    bullets.Add(new Bullet(shipX + 8, 200));
}
```

## Cleaning up with RemoveAll

If bullets were never removed the list would grow forever and the game would slow down. Once a bullet is above the top of the screen it can never matter again, so delete it. `RemoveAll` takes a **lambda**, a tiny anonymous function written `parameter => condition`. The list calls it once per item and removes every item for which it answers `true`:

```csharp
bullets.RemoveAll(bullet => bullet.IsOffScreen());
```

It also **returns** how many items it removed, which will be handy in the next lesson.

> **Watch out:**
> - Changing a list inside its own foreach (`bullets.Remove(b);`) crashes with `InvalidOperationException: Collection was modified; enumeration operation may not execute.` Collect first, then call `RemoveAll` after the loop.
> - Forgetting `using System.Collections.Generic;` gives `error CS0246: The type or namespace name 'List<>' could not be found`.
> - Asking for an index that does not exist (`bullets[5]` in a list of 2) throws `ArgumentOutOfRangeException`. Check `bullets.Count` first.
> - Using `Length` like on arrays: `bullets.Length` gives `error CS1061`. Lists use `Count`.
> - Using `KeyDown` to fire: a key held for half a second fires 15 bullets at once.

## How the numbers work out

A bullet starts at `Y = 200` and flies up 6 pixels per frame. It is 10 pixels tall, so it is completely gone when `Y + 10 < 0`, which takes 36 frames. So a bullet fired at frame 40 is removed at frame 75, and the final count of bullets on screen is the ones fired in the last 35 frames. The input script fires five bullets, one of which comes from a key held for 15 frames, but only the first frame of the hold counts as a press.

## Going further

Make the bullets faster or slower and watch `on screen` change. Then try a second list, such as `List<Bullet> enemyBullets`, that goes downward.

> **Your turn:** fire a `new Bullet(shipX + 8, 200)` into the list whenever Space is pressed, update all bullets with a `foreach`, and call `bullets.RemoveAll(...)` to drop the ones that are off screen. The result should be `fired: 5` and `on screen: 2`.
