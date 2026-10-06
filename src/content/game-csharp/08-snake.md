---
title: "Snake on a Grid"
summary: "Move a List of segments one grid cell every few frames, steer it with the arrow keys and grow it when it eats."
level: intermediate
runner: remote
game: true
stdin: |
  # steps happen on frames 5, 11, 17, ... (every 6 frames)
  # the head reaches the first food (9,7) on step 4 (frame 23); turn up right after
  24 up down
  25 up up
  # up four cells to (9,3) -> second food at step 8 (frame 47); turn right
  48 right down
  49 right up
  # right five cells to (14,3) -> third food at step 13 (frame 77); turn down
  78 down down
  79 down up
  # down seven cells to (14,10) -> fourth food at step 20 (frame 119)
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Cell
      {
          public int X, Y;

          public Cell(int x, int y)
          {
              X = x;
              Y = y;
          }

          public bool Same(int x, int y)
          {
              return X == x && Y == y;
          }
      }

      class Snake
      {
          public const int Columns = 20;
          public const int Rows = 15;
          public List<Cell> Segments = new List<Cell>();
          public int DX = 1, DY = 0;
          public bool Alive = true;

          public Snake()
          {
              Segments.Add(new Cell(5, 7));     // head
              Segments.Add(new Cell(4, 7));
              Segments.Add(new Cell(3, 7));     // tail
          }

          public Cell Head { get { return Segments[0]; } }

          public void Turn(int dx, int dy)
          {
              if (dx == -DX && dy == -DY) return;     // no U-turns
              DX = dx;
              DY = dy;
          }

          // Moves one cell. Returns true if the snake ate the food.
          public bool Step(Cell food)
          {
              int nx = Head.X + DX;
              int ny = Head.Y + DY;
              if (nx < 0 || ny < 0 || nx >= Columns || ny >= Rows || Segments.Exists(s => s.Same(nx, ny)))
              {
                  Alive = false;
                  return false;
              }
              Segments.Insert(0, new Cell(nx, ny));
              // 2. Did the new head land on the food (food.Same(nx, ny); food can be null)?
              //    If so keep the tail, so the snake grows, and return true.
              //    Otherwise remove the tail as below and return false.
              Segments.RemoveAt(Segments.Count - 1);
              return false;
          }
      }

      class Program
      {
          const int CellPx = 16;

          static void Main()
          {
              Snake snake = new Snake();
              Cell[] foods = { new Cell(9, 7), new Cell(9, 3), new Cell(14, 3), new Cell(14, 10) };
              int foodIndex = 0;

              Engine.Frames(180);
              while (Engine.Running())
              {
                  // 1. When an arrow key is PRESSED, call snake.Turn(dx, dy):
                  //    Up is (0, -1), Down is (0, 1), Left is (-1, 0), Right is (1, 0).

                  if (snake.Alive && Engine.Frame % 6 == 5)
                  {
                      Cell food = foodIndex < foods.Length ? foods[foodIndex] : null;
                      if (snake.Step(food)) foodIndex++;
                  }

                  Engine.Clear(Color.Dark);
                  if (foodIndex < foods.Length)
                      Engine.Rect(foods[foodIndex].X * CellPx + 2, foods[foodIndex].Y * CellPx + 2, 12, 12, Color.Red);
                  foreach (Cell s in snake.Segments)
                      Engine.Rect(s.X * CellPx + 1, s.Y * CellPx + 1, 14, 14, s == snake.Head ? Color.Yellow : Color.Green);
                  Engine.Text(8, 4, 12, Color.White, "Length: " + snake.Segments.Count);
                  Engine.Present();
              }
              Console.WriteLine("length: " + snake.Segments.Count);
              Console.WriteLine("alive: " + snake.Alive);
          }
      }
check:
  output: |
    length: 7
    alive: False
  code:
    - { pattern: 'KeyPressed\s*\(\s*Key\s*\.\s*Left', message: "Turn left with Engine.KeyPressed(Key.Left)." }
    - { pattern: 'KeyPressed\s*\(\s*Key\s*\.\s*Down', message: "Turn down with Engine.KeyPressed(Key.Down)." }
hints:
  - "Two separate jobs. Steering: when an arrow key is pressed call Turn with the right (dx, dy). Growing: when the new head is on the food, do not delete the tail."
  - "Turn values: Up (0, -1), Down (0, 1), Left (-1, 0), Right (1, 0). In Step: compute bool ate = food != null && food.Same(nx, ny); then only call Segments.RemoveAt(...) if the snake did not eat. Return ate."
  - "if (Engine.KeyPressed(Key.Up)) snake.Turn(0, -1); (same for the other three)   and in Step:  bool ate = food != null && food.Same(nx, ny);  if (!ate) Segments.RemoveAt(Segments.Count - 1);  return ate;"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Cell
      {
          public int X, Y;

          public Cell(int x, int y)
          {
              X = x;
              Y = y;
          }

          public bool Same(int x, int y)
          {
              return X == x && Y == y;
          }
      }

      class Snake
      {
          public const int Columns = 20;
          public const int Rows = 15;
          public List<Cell> Segments = new List<Cell>();
          public int DX = 1, DY = 0;
          public bool Alive = true;

          public Snake()
          {
              Segments.Add(new Cell(5, 7));     // head
              Segments.Add(new Cell(4, 7));
              Segments.Add(new Cell(3, 7));     // tail
          }

          public Cell Head { get { return Segments[0]; } }

          public void Turn(int dx, int dy)
          {
              if (dx == -DX && dy == -DY) return;     // no U-turns
              DX = dx;
              DY = dy;
          }

          // Moves one cell. Returns true if the snake ate the food.
          public bool Step(Cell food)
          {
              int nx = Head.X + DX;
              int ny = Head.Y + DY;
              if (nx < 0 || ny < 0 || nx >= Columns || ny >= Rows || Segments.Exists(s => s.Same(nx, ny)))
              {
                  Alive = false;
                  return false;
              }
              Segments.Insert(0, new Cell(nx, ny));
              bool ate = food != null && food.Same(nx, ny);
              if (!ate) Segments.RemoveAt(Segments.Count - 1);
              return ate;
          }
      }

      class Program
      {
          const int CellPx = 16;

          static void Main()
          {
              Snake snake = new Snake();
              Cell[] foods = { new Cell(9, 7), new Cell(9, 3), new Cell(14, 3), new Cell(14, 10) };
              int foodIndex = 0;

              Engine.Frames(180);
              while (Engine.Running())
              {
                  if (Engine.KeyPressed(Key.Up)) snake.Turn(0, -1);
                  if (Engine.KeyPressed(Key.Down)) snake.Turn(0, 1);
                  if (Engine.KeyPressed(Key.Left)) snake.Turn(-1, 0);
                  if (Engine.KeyPressed(Key.Right)) snake.Turn(1, 0);

                  if (snake.Alive && Engine.Frame % 6 == 5)
                  {
                      Cell food = foodIndex < foods.Length ? foods[foodIndex] : null;
                      if (snake.Step(food)) foodIndex++;
                  }

                  Engine.Clear(Color.Dark);
                  if (foodIndex < foods.Length)
                      Engine.Rect(foods[foodIndex].X * CellPx + 2, foods[foodIndex].Y * CellPx + 2, 12, 12, Color.Red);
                  foreach (Cell s in snake.Segments)
                      Engine.Rect(s.X * CellPx + 1, s.Y * CellPx + 1, 14, 14, s == snake.Head ? Color.Yellow : Color.Green);
                  Engine.Text(8, 4, 12, Color.White, "Length: " + snake.Segments.Count);
                  Engine.Present();
              }
              Console.WriteLine("length: " + snake.Segments.Count);
              Console.WriteLine("alive: " + snake.Alive);
          }
      }
quiz:
  - q: "Why does the snake only move when Engine.Frame % 6 == 5?"
    options: ["The screen can only draw every sixth frame", "It makes the snake step once every 6 frames, while the game still redraws 30 times a second", "% is the same as division", "It makes the snake six times longer"]
    answer: 1
  - q: "How does the snake grow when it eats?"
    options: ["A new segment is added to the tail every frame", "The whole list is rebuilt", "The new head is added but the tail is NOT removed this step", "The Count property is increased"]
    answer: 2
    explain: "Insert the new head at index 0; skipping RemoveAt leaves the list one longer."
  - q: "What does Segments.Exists(s => s.Same(nx, ny)) tell you?"
    options: ["Whether at least one segment is already on that cell", "How many segments are on that cell", "The index of the segment", "It removes the segment"]
    answer: 0
  - q: "Why use KeyPressed for steering instead of KeyDown?"
    options: ["KeyDown does not exist", "KeyPressed is true only on the frame the key goes down, so one tap is one turn", "KeyPressed is faster", "KeyDown only works for letters"]
    answer: 1
---
Snake looks simple, but it hides a very useful idea: the game does not move every frame. It moves in **steps**, on a grid, while the screen keeps redrawing at 30 frames per second. You will also use a `List<T>` as the snake's body.

## A grid and a step timer

The screen is 320 by 240 pixels. We cut it into cells of 16 pixels, which gives a grid of 20 columns and 15 rows. Game logic uses **cell coordinates** (column 9, row 7) and only the drawing multiplies by 16:

```csharp
Engine.Rect(s.X * CellPx + 1, s.Y * CellPx + 1, 14, 14, Color.Green);
```

The snake should move once every 6 frames (5 steps a second). The remainder operator `%` gives "every N frames":

```csharp
if (Engine.Frame % 6 == 5)    // true on frames 5, 11, 17, 23 ...
{
    snake.Step(food);
}
```

Making the step slower or faster is the difficulty slider of Snake: change one number.

## The body is a List of cells

The head is `Segments[0]` and the tail is the last element. To move, you do not shift every segment. You add a new head in front and drop the tail:

```csharp
Segments.Insert(0, new Cell(nx, ny));            // new head
Segments.RemoveAt(Segments.Count - 1);           // forget the old tail
```

`Insert(index, item)` puts the item at that position and pushes the others back. `RemoveAt(index)` deletes by position (unlike `Remove`, which takes the item itself).

## Growing is "do not remove the tail"

This is the whole trick of growth. When the new head lands on the food, you simply skip the `RemoveAt`. The snake is now one cell longer, because it gained a head and lost nothing:

```csharp
bool ate = food != null && food.Same(nx, ny);
if (!ate) Segments.RemoveAt(Segments.Count - 1);
return ate;
```

The `Step` method returns whether food was eaten, so `Main` can move on to the next food position. We use a fixed array of food positions instead of random ones, because a replay must be deterministic: the same keys must always give the same game.

## Turning without U-turns

The direction is a pair `(DX, DY)`: right is `(1, 0)`, up is `(0, -1)`. A snake can not reverse into its own neck, so `Turn` refuses the opposite direction:

```csharp
if (dx == -DX && dy == -DY) return;
```

Use `KeyPressed`, not `KeyDown`. A turn should happen once per tap, and the snake only moves every sixth frame, so a short tap between two steps must still be remembered.

## Dying

Before moving, `Step` computes the new head position and checks two things: is it outside the grid, and does any segment already sit there? The second check uses a lambda with `Exists`:

```csharp
Segments.Exists(s => s.Same(nx, ny))
```

`Exists` is like `RemoveAll` but only asks "is there at least one match?". If either test is true, `Alive` becomes false and the stepping stops.

> **Watch out:**
> - Updating the snake in every frame instead of every sixth: the snake flies across the board 6 times faster. Use the step timer.
> - Using `Remove(Segments.Count - 1)` instead of `RemoveAt`: `Remove` wants an *item*, so you get `error CS1503: Argument 1: cannot convert from 'int' to 'Cell'`.
> - Pixel math in game logic: compare cells to cells, not pixels to cells, or nothing ever collides.
> - A reversed snake: pressing two arrows within one step (right, up, left) can still turn it around. Real games remember only one queued turn per step.

## What the replay does

The input tab turns the snake right after each meal: up at frame 24, right at frame 48, down at frame 78. It eats four pieces of food, and finally drives into the bottom wall and stops, so the program prints `alive: False`. Change a key press by a few frames and the snake will miss food or crash earlier.

## Going further

Add a speed-up: every time food is eaten, make the step interval smaller. Store it in a variable instead of the number 6.

> **Your turn:** (1) in `Main`, call `snake.Turn(...)` for each arrow key with `KeyPressed`; (2) in `Step`, keep the tail when the new head is on the food and return `true`. The snake should end with `length: 7` and `alive: False`.
