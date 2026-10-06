---
title: A Player Class
summary: Bundle a game object's data and behaviour into a class with fields, a constructor, Update() and Draw().
level: intermediate
runner: remote
game: true
stdin: |
  # <frame> <key> <down|up>
  # Player 1 uses the arrow keys
  10 right down
  50 right up
  60 left down
  70 left up
  # Player 2 uses A and D
  20 a down
  80 a up
  100 d down
  120 d up
files:
  - name: Program.cs
    code: |
      using System;

      class Player
      {
          public int x;
          public int y;
          public int speed;
          Color tint;
          Key leftKey;
          Key rightKey;
          const int Size = 20;

          // 1. Constructor: copy every parameter into the matching field.
          //    The names are the same, so write  this.name = name;
          public Player(int x, int y, int speed, Color tint, Key leftKey, Key rightKey)
          {
          }

          public void Update()
          {
              if (Engine.KeyDown(rightKey)) x += speed;
              // 2. Move left while leftKey is held.
              // 3. Keep x between 0 and Engine.Width - Size (Math.Min and Math.Max).
          }

          public void Draw()
          {
              Engine.Rect(x, y, Size, Size, tint);
          }
      }

      class Program
      {
          static void Main()
          {
              Player p1 = new Player(50, 60, 3, Color.Yellow, Key.Left, Key.Right);
              Player p2 = new Player(200, 150, 5, Color.Pink, Key.A, Key.D);

              Engine.Frames(150);
              while (Engine.Running())
              {
                  p1.Update();
                  p2.Update();

                  Engine.Clear(Color.Dark);
                  p1.Draw();
                  p2.Draw();
                  Engine.Present();
              }

              Console.WriteLine("p1 x: " + p1.x);
              Console.WriteLine("p2 x: " + p2.x);
          }
      }
check:
  output: |
    p1 x: 140
    p2 x: 100
  code:
    - { pattern: 'Math\s*\.\s*Min\s*\(', message: "Clamp the right edge with Math.Min." }
    - { pattern: 'Math\s*\.\s*Max\s*\(', message: "Clamp the left edge with Math.Max." }
hints:
  - "The constructor runs once when you write new Player(...). Its job is to store each parameter in the object's own field. Update() then needs a left-key check that mirrors the right-key line, followed by a clamp."
  - "Inside the constructor write this.x = x; and the same pattern for y, speed, tint, leftKey and rightKey. In Update, add  if (Engine.KeyDown(leftKey)) x -= speed;  and then clamp x with Math.Max and Math.Min."
  - "x = Math.Max(0, Math.Min(x, Engine.Width - Size));  after the two movement lines, and in the constructor: this.x = x; this.y = y; this.speed = speed; this.tint = tint; this.leftKey = leftKey; this.rightKey = rightKey;"
solution:
  - name: Program.cs
    code: |
      using System;

      class Player
      {
          public int x;
          public int y;
          public int speed;
          Color tint;
          Key leftKey;
          Key rightKey;
          const int Size = 20;

          public Player(int x, int y, int speed, Color tint, Key leftKey, Key rightKey)
          {
              this.x = x;
              this.y = y;
              this.speed = speed;
              this.tint = tint;
              this.leftKey = leftKey;
              this.rightKey = rightKey;
          }

          public void Update()
          {
              if (Engine.KeyDown(rightKey)) x += speed;
              if (Engine.KeyDown(leftKey))  x -= speed;
              x = Math.Max(0, Math.Min(x, Engine.Width - Size));
          }

          public void Draw()
          {
              Engine.Rect(x, y, Size, Size, tint);
          }
      }

      class Program
      {
          static void Main()
          {
              Player p1 = new Player(50, 60, 3, Color.Yellow, Key.Left, Key.Right);
              Player p2 = new Player(200, 150, 5, Color.Pink, Key.A, Key.D);

              Engine.Frames(150);
              while (Engine.Running())
              {
                  p1.Update();
                  p2.Update();

                  Engine.Clear(Color.Dark);
                  p1.Draw();
                  p2.Draw();
                  Engine.Present();
              }

              Console.WriteLine("p1 x: " + p1.x);
              Console.WriteLine("p2 x: " + p2.x);
          }
      }
quiz:
  - q: "What is the job of a constructor?"
    options: ["To delete an object", "To print text", "To set up a new object when you write new Player(...)", "To draw the object"]
    answer: 2
  - q: "In a constructor, what does this.x = x; do?"
    options: ["Copies the parameter x into the object's own field x", "Compares the two x values", "Creates a second field", "Copies the field into the parameter"]
    answer: 0
    explain: "this.x is the object's field; the plain x is the constructor parameter."
  - q: "You write Player a = new Player(...); and Player b = new Player(...);. What happens when a moves?"
    options: ["b moves too", "Only a's own fields change; b keeps its own copy", "The program crashes", "Both are deleted"]
    answer: 1
    explain: "Every object has its own copy of the fields, so each player keeps its own position."
  - q: "Why is it handy to give a class both Update() and Draw() methods?"
    options: ["C# forces you to", "It makes the game run faster", "Each object knows how to move and how to paint itself, so Main stays short", "Draw() is required to compile"]
    answer: 2
---
So far all the state of your game lived in loose variables inside `Main`. That works for one square, but a real game has a player, enemies, bullets and coins. In this lesson you will meet the tool every Unity developer uses all day: the **class**.

## What is a class?

A **class** is a blueprint for a kind of thing. It describes what data the thing has (**fields**) and what it can do (**methods**). An **object** is one actual thing made from that blueprint. One `Player` class can make as many players as you like, each with its own position.

```csharp
class Player
{
    public int x;          // field: data stored inside the object
    public int speed;

    public void Update()   // method: something the object can do
    {
        x += speed;
    }
}
```

You create an object with `new`, and reach inside it with a dot:

```csharp
Player p = new Player();
p.speed = 3;
p.Update();
Console.WriteLine(p.x);   // prints: 3
```

## Fields and access

- `public` means code outside the class (like `Main`) may use it. Without a modifier a member is `private`, so only the class itself can touch it. In the exercise, `x` is public (so `Main` can print it) while `tint` is private.
- `const int Size = 20;` is a constant shared by all players.
- Fields hold the **state** of the object. Methods use the fields directly, as in `x += speed;`.

## The constructor

When you write `new Player(50, 60, 3, ...)` the class needs to know the starting values. A **constructor** is a special method with the **same name as the class** and no return type. It runs once, right when the object is created:

```csharp
public Player(int x, int y, int speed)
{
    this.x = x;
    this.y = y;
    this.speed = speed;
}
```

Here the parameters and the fields have the same name. Inside the constructor a plain `x` means the parameter (the nearest one), so `this.x` is how you say "the field `x` of this very object". `this` means "the object I am running on".

## Update and Draw

In Unity every game object has an `Update()` method that the engine calls once per frame; we copy that idea and add a `Draw()` method. The game loop then becomes beautifully short, because each object looks after itself:

```csharp
while (Engine.Running())
{
    p1.Update();
    p2.Update();

    Engine.Clear(Color.Dark);
    p1.Draw();
    p2.Draw();
    Engine.Present();
}
```

Two players with different `speed` and different keys, built from one class. Press the keys in the input tab: each square listens to its own keys and moves at its own speed.

## Values you can pass around

Fields do not have to be numbers. In the exercise `Color tint` and `Key leftKey` are fields too, so each player remembers which colour it is and which key moves it.

> **Watch out:**
> - Forgetting `new`: `Player p; p.Update();` gives `error CS0165: Use of unassigned local variable 'p'`.
> - Forgetting `this.` in the constructor, when parameter and field have the same name: `x = x;` just assigns the parameter to itself (the compiler warns CS1717) and the field stays 0.
> - Calling a private field from outside: `p1.tint` gives `error CS0122: 'Player.tint' is inaccessible due to its protection level`.
> - Giving the constructor a return type (`public void Player(...)`) turns it into an ordinary method and `new Player(...)` fails with `error CS1729: 'Player' does not contain a constructor that takes 6 arguments`.

## Going further

Add a third player that uses `Key.Z` and `Key.X`. You only need one new line in `Main` for it, plus calls to its `Update()` and `Draw()`.

> **Your turn:** finish the constructor (copy every parameter into its field with `this.`), make `Update()` move left when `leftKey` is held, and clamp `x` between 0 and `Engine.Width - Size`. The two players should end at `p1 x: 140` and `p2 x: 100`.
