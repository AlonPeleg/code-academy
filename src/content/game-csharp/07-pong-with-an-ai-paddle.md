---
title: "Pong with an AI Paddle"
summary: "Build Pong with an interface for controllers, then write the computer opponent that follows the ball."
level: intermediate
runner: remote
game: true
stdin: |
  # <frame> <key> <down|up>
  28 down down
  44 down up
  140 up down
  170 up up
  252 down down
  290 down up
  369 up down
  381 up up
  458 up down
  468 up up
  547 up down
  557 up up
files:
  - name: Program.cs
    code: |
      using System;

      interface IController
      {
          int Direction(Paddle paddle, Ball ball);   // -1 = up, 0 = stay, +1 = down
      }

      class KeyboardController : IController
      {
          public int Direction(Paddle paddle, Ball ball)
          {
              int dir = 0;
              if (Engine.KeyDown(Key.Up)) dir -= 1;
              if (Engine.KeyDown(Key.Down)) dir += 1;
              return dir;
          }
      }

      class AiController : IController
      {
          public int Direction(Paddle paddle, Ball ball)
          {
              // 1. Work out the middle of the paddle (Y + Height / 2) and the middle of the ball.
              //    If the ball is more than 4 pixels above the paddle's middle return -1 (up),
              //    if it is more than 4 pixels below return 1 (down), otherwise return 0 (stay).
              return 0;
          }
      }

      class Paddle
      {
          public const int Width = 8;
          public const int Height = 44;
          public int X;
          public int Y = 98;
          public int Speed;
          public IController Controller;

          public Paddle(int x, int speed, IController controller)
          {
              X = x;
              Speed = speed;
              Controller = controller;
          }

          public void Update(Ball ball)
          {
              Y += Controller.Direction(this, ball) * Speed;
              Y = Math.Max(0, Math.Min(Y, Engine.Height - Height));
          }

          public void Draw()
          {
              Engine.Rect(X, Y, Width, Height, Color.White);
          }
      }

      class Ball
      {
          public const int Size = 8;
          public int X, Y, VX, VY;

          public void Serve(int direction)
          {
              X = 156;
              Y = 116;
              VX = 5 * direction;
              VY = 3;
          }

          public void Update()
          {
              X += VX;
              Y += VY;
              if (Y < 0 || Y + Size > Engine.Height) VY = -VY;
          }

          public bool Hits(Paddle p)
          {
              return X < p.X + Paddle.Width && X + Size > p.X && Y < p.Y + Paddle.Height && Y + Size > p.Y;
          }

          public void Bounce(Paddle p)
          {
              VX = -VX;
              VY = (Y + Size / 2 - (p.Y + Paddle.Height / 2)) / 5;
          }

          public void Draw()
          {
              Engine.Rect(X, Y, Size, Size, Color.Yellow);
          }
      }

      class Program
      {
          static void Main()
          {
              Paddle player = new Paddle(10, 5, new KeyboardController());
              Paddle computer = new Paddle(302, 3, new AiController());
              Ball ball = new Ball();
              ball.Serve(1);
              int playerScore = 0, computerScore = 0;

              Engine.Frames(600);
              while (Engine.Running())
              {
                  player.Update(ball);
                  computer.Update(ball);
                  ball.Update();

                  if (ball.VX < 0 && ball.Hits(player)) ball.Bounce(player);
                  if (ball.VX > 0 && ball.Hits(computer)) ball.Bounce(computer);

                  // 2. If the ball has left the screen on the right, the player scores: add 1 and Serve(-1).
                  //    If it has left on the left, the computer scores: add 1 and Serve(1).

                  Engine.Clear(Color.Dark);
                  player.Draw();
                  computer.Draw();
                  ball.Draw();
                  Engine.Text(130, 8, 16, Color.White, playerScore + " : " + computerScore);
                  Engine.Present();
              }
              Console.WriteLine("player " + playerScore + " - computer " + computerScore);
          }
      }
check:
  output: |
    player 1 - computer 4
  code:
    - { pattern: 'playerScore\s*(\+\+|\+=|=\s*playerScore\s*\+)', message: "Add a point to playerScore when the ball leaves on the right." }
    - { pattern: 'computerScore\s*(\+\+|\+=|=\s*computerScore\s*\+)', message: "Add a point to computerScore when the ball leaves on the left." }
hints:
  - "The AI is a method that compares two numbers: where the middle of the ball is and where the middle of the paddle is. It answers -1, 0 or 1. The scoring part is two if statements about ball.X leaving the screen."
  - "In AiController.Direction: paddleMid = paddle.Y + Paddle.Height / 2 and ballMid = ball.Y + Ball.Size / 2. Return -1 if the ball is more than 4 pixels above, 1 if more than 4 below, else 0. In Main: ball.X > Engine.Width means the player scored, ball.X + Ball.Size < 0 means the computer scored; then call ball.Serve(...)."
  - "if (ballMid < paddleMid - 4) return -1; if (ballMid > paddleMid + 4) return 1; return 0;   and in Main: if (ball.X > Engine.Width) { playerScore++; ball.Serve(-1); } if (ball.X + Ball.Size < 0) { computerScore++; ball.Serve(1); }"
solution:
  - name: Program.cs
    code: |
      using System;

      interface IController
      {
          int Direction(Paddle paddle, Ball ball);   // -1 = up, 0 = stay, +1 = down
      }

      class KeyboardController : IController
      {
          public int Direction(Paddle paddle, Ball ball)
          {
              int dir = 0;
              if (Engine.KeyDown(Key.Up)) dir -= 1;
              if (Engine.KeyDown(Key.Down)) dir += 1;
              return dir;
          }
      }

      class AiController : IController
      {
          public int Direction(Paddle paddle, Ball ball)
          {
              int paddleMid = paddle.Y + Paddle.Height / 2;
              int ballMid = ball.Y + Ball.Size / 2;
              if (ballMid < paddleMid - 4) return -1;
              if (ballMid > paddleMid + 4) return 1;
              return 0;
          }
      }

      class Paddle
      {
          public const int Width = 8;
          public const int Height = 44;
          public int X;
          public int Y = 98;
          public int Speed;
          public IController Controller;

          public Paddle(int x, int speed, IController controller)
          {
              X = x;
              Speed = speed;
              Controller = controller;
          }

          public void Update(Ball ball)
          {
              Y += Controller.Direction(this, ball) * Speed;
              Y = Math.Max(0, Math.Min(Y, Engine.Height - Height));
          }

          public void Draw()
          {
              Engine.Rect(X, Y, Width, Height, Color.White);
          }
      }

      class Ball
      {
          public const int Size = 8;
          public int X, Y, VX, VY;

          public void Serve(int direction)
          {
              X = 156;
              Y = 116;
              VX = 5 * direction;
              VY = 3;
          }

          public void Update()
          {
              X += VX;
              Y += VY;
              if (Y < 0 || Y + Size > Engine.Height) VY = -VY;
          }

          public bool Hits(Paddle p)
          {
              return X < p.X + Paddle.Width && X + Size > p.X && Y < p.Y + Paddle.Height && Y + Size > p.Y;
          }

          public void Bounce(Paddle p)
          {
              VX = -VX;
              VY = (Y + Size / 2 - (p.Y + Paddle.Height / 2)) / 5;
          }

          public void Draw()
          {
              Engine.Rect(X, Y, Size, Size, Color.Yellow);
          }
      }

      class Program
      {
          static void Main()
          {
              Paddle player = new Paddle(10, 5, new KeyboardController());
              Paddle computer = new Paddle(302, 3, new AiController());
              Ball ball = new Ball();
              ball.Serve(1);
              int playerScore = 0, computerScore = 0;

              Engine.Frames(600);
              while (Engine.Running())
              {
                  player.Update(ball);
                  computer.Update(ball);
                  ball.Update();

                  if (ball.VX < 0 && ball.Hits(player)) ball.Bounce(player);
                  if (ball.VX > 0 && ball.Hits(computer)) ball.Bounce(computer);

                  if (ball.X > Engine.Width) { playerScore++; ball.Serve(-1); }
                  if (ball.X + Ball.Size < 0) { computerScore++; ball.Serve(1); }

                  Engine.Clear(Color.Dark);
                  player.Draw();
                  computer.Draw();
                  ball.Draw();
                  Engine.Text(130, 8, 16, Color.White, playerScore + " : " + computerScore);
                  Engine.Present();
              }
              Console.WriteLine("player " + playerScore + " - computer " + computerScore);
          }
      }
quiz:
  - q: "What is an interface such as IController?"
    options: ["A window on the screen", "A list of methods a class promises to provide, without saying how they work", "A class that can be created with new", "A faster kind of variable"]
    answer: 1
    explain: "Any class that says : IController must supply Direction."
  - q: "Why can Paddle use either a KeyboardController or an AiController?"
    options: ["Because both are the same class", "Because Paddle only talks to the IController interface, and both classes implement it", "Because C# guesses the type at random", "Because the paddle copies the controller code"]
    answer: 1
    explain: "This is polymorphism: one call, different behaviour depending on the object."
  - q: "Why does the AI use a 4 pixel dead zone (it stays still when close enough)?"
    options: ["To make the ball faster", "Because ints can not be compared", "To stop the paddle from jittering up and down every frame", "To save memory"]
    answer: 2
  - q: "The computer paddle is slower (Speed 3) than the player's (Speed 5). What does that do?"
    options: ["It makes the AI beatable: steep shots near the paddle edge can get past it", "It causes a compile error", "Nothing, speed is ignored", "It makes the ball bounce twice"]
    answer: 0
---
Pong has two paddles, but only one human. In this lesson you give the second paddle a brain, and you do it the way Unity developers do: with an **interface**, so the paddle does not care whether its orders come from a keyboard or from an algorithm.

## One paddle class, two kinds of driver

The game needs two paddles that move the same way (up, down, stay inside the screen) but decide *when* to move differently. Instead of copying the whole `Paddle` class, we pull out the one thing that differs. An interface is a contract: it lists methods a class promises to have, and says nothing about how they work.

```csharp
interface IController
{
    int Direction(Paddle paddle, Ball ball);   // -1 = up, 0 = stay, +1 = down
}
```

Any class that writes `: IController` after its name must provide `Direction`. Two classes do:

```csharp
class KeyboardController : IController
{
    public int Direction(Paddle paddle, Ball ball)
    {
        int dir = 0;
        if (Engine.KeyDown(Key.Up)) dir -= 1;
        if (Engine.KeyDown(Key.Down)) dir += 1;
        return dir;
    }
}
```

`Paddle` stores an `IController` in a field and asks it every frame: `Y += Controller.Direction(this, ball) * Speed;`. The paddle has no idea which kind of controller it holds. That is called **polymorphism**: "many shapes", one call. It is also how Unity components such as input handlers and AI brains are swapped in and out. Later you could add a `NetworkController` without touching `Paddle`.

## Thinking like a simple AI

A good game AI is not perfect, it is *beatable*. The computer's rule is tiny: compare the middle of the ball with the middle of the paddle, and move toward the ball.

```csharp
int paddleMid = paddle.Y + Paddle.Height / 2;
int ballMid = ball.Y + Ball.Size / 2;
if (ballMid < paddleMid - 4) return -1;   // ball is above: go up
if (ballMid > paddleMid + 4) return 1;    // ball is below: go down
return 0;                                 // close enough: stay
```

The 4-pixel dead zone stops the paddle from trembling back and forth every frame. The computer's paddle is also *slower* than yours (3 pixels per frame against 5). When you hit the ball near the edge of your paddle it leaves at a steep angle, and the slow AI cannot always keep up. That speed difference is the difficulty setting.

## The ball and the bounce

`Ball.Hits(paddle)` is the same rectangle-overlap test you met in the coin lesson. `Bounce` reverses the horizontal speed and sets the vertical speed from *where* the paddle was hit:

```csharp
VX = -VX;
VY = (Y + Size / 2 - (p.Y + Paddle.Height / 2)) / 5;
```

Integer division is fine here. Hit the middle and the ball goes straight, hit the edge and it flies off steeply. The checks `ball.VX < 0 && ...` in `Main` only test the paddle the ball is *moving toward*; without that, the ball could bounce twice inside the paddle and get stuck.

## Scoring

When the ball is completely past a side of the screen, somebody scored and the ball is served again. `Serve(direction)` puts the ball back in the middle and sends it off to the left (`-1`) or to the right (`1`).

> **Watch out:**
> - Forgetting `: IController` on a class that has a `Direction` method: you get `error CS1503: Argument 3: cannot convert from 'AiController' to 'IController'` when you pass it to `Paddle`.
> - An interface method must be `public` in the class, otherwise: `error CS0737: 'AiController' does not implement interface member 'IController.Direction(Paddle, Ball)' ... is not public`.
> - Comparing the ball's **top** (`ball.Y`) to the paddle's **top** makes the AI aim the wrong spot. Compare the middles.
> - Integer division: `Height / 2` is fine, but `3 / 2` is 1, not 1.5, so small speeds can round to zero.

## How this replay works

The input tab holds the "human" player: it presses Down at frame 28, lets go at frame 44, and so on. Your program records 600 frames (20 seconds). Change those keys and the paddle will block different shots, so the final score changes too.

## Going further

Make the AI worse by only updating its decision every third frame, or by giving it a `Speed` of 2. Or add a third controller, `TwoPlayerController`, that uses the `W` and `S` keys.

> **Your turn:** finish `AiController.Direction` so the computer follows the ball (middle to middle, 4 pixel dead zone), then award points in `Main`: when the ball leaves on the right the player scores and `Serve(-1)`, when it leaves on the left the computer scores and `Serve(1)`. The program should print `player 1 - computer 4`.
