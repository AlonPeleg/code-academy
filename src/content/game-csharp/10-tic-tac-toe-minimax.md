---
title: "Tic-Tac-Toe with a Minimax AI"
summary: "Write the recursive minimax algorithm so the computer never loses, and play against it with the arrow keys."
level: advanced
runner: remote
game: true
stdin: |
  # The cursor starts in the top-left cell (cell 0).
  # Space puts an X on the cursor cell.
  5 space down
  6 space up
  # the computer answers; then move right and play the top middle cell
  30 right down
  31 right up
  34 space down
  35 space up
  # left, down: the cell on the left of the middle row
  60 left down
  61 left up
  62 down down
  63 down up
  66 space down
  67 space up
files:
  - name: Program.cs
    code: |
      using System;

      class Board
      {
          public char[] Cells = new char[9];
          static readonly int[][] Lines =
          {
              new[] { 0, 1, 2 }, new[] { 3, 4, 5 }, new[] { 6, 7, 8 },    // rows
              new[] { 0, 3, 6 }, new[] { 1, 4, 7 }, new[] { 2, 5, 8 },    // columns
              new[] { 0, 4, 8 }, new[] { 2, 4, 6 }                        // diagonals
          };

          public Board()
          {
              for (int i = 0; i < 9; i++) Cells[i] = ' ';
          }

          // 'X' or 'O' if someone has three in a row, otherwise ' '.
          public char Winner()
          {
              foreach (int[] line in Lines)
              {
                  char c = Cells[line[0]];
                  if (c != ' ' && c == Cells[line[1]] && c == Cells[line[2]]) return c;
              }
              return ' ';
          }

          public bool IsFull()
          {
              return Array.IndexOf(Cells, ' ') < 0;
          }
      }

      static class Ai
      {
          // Score of the position from the computer's (O) point of view:
          // +1 if O wins, -1 if X wins, 0 for a draw.
          static int Minimax(Board board, bool computersTurn)
          {
              // 1. Game over? If O has won return 1, if X has won return -1, if the board is full return 0.
              // 2. Otherwise try every empty cell: put a piece there (O when computersTurn is true, else X),
              //    call Minimax again with the turn flipped to score that future, then take the piece back off.
              // 3. The computer keeps the HIGHEST score it finds, the human the LOWEST. Return it.
              return 0;
          }

          public static int BestMove(Board board)
          {
              int bestCell = -1;
              int bestScore = -2;
              for (int i = 0; i < 9; i++)
              {
                  if (board.Cells[i] != ' ') continue;
                  board.Cells[i] = 'O';
                  int score = Minimax(board, false);
                  board.Cells[i] = ' ';
                  if (score > bestScore)
                  {
                      bestScore = score;
                      bestCell = i;
                  }
              }
              return bestCell;
          }
      }

      class Program
      {
          const int Left = 80, Top = 30, Size = 60;

          static void Main()
          {
              Board board = new Board();
              int cursor = 0;
              bool humansTurn = true;
              int aiWait = 0;

              Engine.Frames(150);
              while (Engine.Running())
              {
                  bool over = board.Winner() != ' ' || board.IsFull();
                  if (!over && humansTurn)
                  {
                      if (Engine.KeyPressed(Key.Left) && cursor % 3 > 0) cursor--;
                      if (Engine.KeyPressed(Key.Right) && cursor % 3 < 2) cursor++;
                      if (Engine.KeyPressed(Key.Up) && cursor >= 3) cursor -= 3;
                      if (Engine.KeyPressed(Key.Down) && cursor < 6) cursor += 3;
                      if (Engine.KeyPressed(Key.Space) && board.Cells[cursor] == ' ')
                      {
                          board.Cells[cursor] = 'X';
                          humansTurn = false;
                          aiWait = 10;                    // the computer "thinks" for 10 frames
                      }
                  }
                  else if (!over && --aiWait == 0)
                  {
                      board.Cells[Ai.BestMove(board)] = 'O';
                      humansTurn = true;
                  }

                  Engine.Clear(Color.Dark);
                  Engine.Rect(Left + (cursor % 3) * Size, Top + (cursor / 3) * Size, Size, Size, new Color(50, 54, 90));
                  for (int i = 1; i < 3; i++)
                  {
                      Engine.Line(Left + i * Size, Top, Left + i * Size, Top + 3 * Size, Color.Gray);
                      Engine.Line(Left, Top + i * Size, Left + 3 * Size, Top + i * Size, Color.Gray);
                  }
                  for (int i = 0; i < 9; i++)
                  {
                      int cx = Left + (i % 3) * Size + Size / 2;
                      int cy = Top + (i / 3) * Size + Size / 2;
                      if (board.Cells[i] == 'X')
                      {
                          Engine.Line(cx - 16, cy - 16, cx + 16, cy + 16, Color.Cyan);
                          Engine.Line(cx - 16, cy + 16, cx + 16, cy - 16, Color.Cyan);
                      }
                      if (board.Cells[i] == 'O')
                      {
                          Engine.Circle(cx, cy, 17, Color.Pink);
                          Engine.Circle(cx, cy, 12, Color.Dark);
                      }
                  }
                  Engine.Present();
              }
              char w = board.Winner();
              Console.WriteLine("winner: " + (w != ' ' ? w.ToString() : board.IsFull() ? "draw" : "none"));
          }
      }
check:
  output: |
    winner: O
  code:
    - { pattern: 'Minimax\s*\(\s*board\s*,\s*!\s*computersTurn', message: "Call Minimax recursively with the turn flipped: Minimax(board, !computersTurn)." }
hints:
  - "Minimax is recursive: it returns a score at the end of a game (base case), otherwise it tries each empty cell, asks Minimax about the future, and undoes the try."
  - "Base case: Winner() == 'O' gives 1, 'X' gives -1, a full board gives 0. Loop over the 9 cells; skip non-empty ones; put 'O' (or 'X' when it is not the computer's turn) in the cell; score = Minimax(board, !computersTurn); put ' ' back. Keep Math.Max on the computer's turn and Math.Min otherwise."
  - "int best = computersTurn ? -2 : 2;  ... board.Cells[i] = computersTurn ? 'O' : 'X'; int score = Minimax(board, !computersTurn); board.Cells[i] = ' '; best = computersTurn ? Math.Max(best, score) : Math.Min(best, score); ...  return best;"
solution:
  - name: Program.cs
    code: |
      using System;

      class Board
      {
          public char[] Cells = new char[9];
          static readonly int[][] Lines =
          {
              new[] { 0, 1, 2 }, new[] { 3, 4, 5 }, new[] { 6, 7, 8 },    // rows
              new[] { 0, 3, 6 }, new[] { 1, 4, 7 }, new[] { 2, 5, 8 },    // columns
              new[] { 0, 4, 8 }, new[] { 2, 4, 6 }                        // diagonals
          };

          public Board()
          {
              for (int i = 0; i < 9; i++) Cells[i] = ' ';
          }

          // 'X' or 'O' if someone has three in a row, otherwise ' '.
          public char Winner()
          {
              foreach (int[] line in Lines)
              {
                  char c = Cells[line[0]];
                  if (c != ' ' && c == Cells[line[1]] && c == Cells[line[2]]) return c;
              }
              return ' ';
          }

          public bool IsFull()
          {
              return Array.IndexOf(Cells, ' ') < 0;
          }
      }

      static class Ai
      {
          // Score of the position from the computer's (O) point of view:
          // +1 if O wins, -1 if X wins, 0 for a draw.
          static int Minimax(Board board, bool computersTurn)
          {
              char w = board.Winner();
              if (w == 'O') return 1;
              if (w == 'X') return -1;
              if (board.IsFull()) return 0;

              int best = computersTurn ? -2 : 2;
              for (int i = 0; i < 9; i++)
              {
                  if (board.Cells[i] != ' ') continue;
                  board.Cells[i] = computersTurn ? 'O' : 'X';
                  int score = Minimax(board, !computersTurn);
                  board.Cells[i] = ' ';
                  best = computersTurn ? Math.Max(best, score) : Math.Min(best, score);
              }
              return best;
          }

          public static int BestMove(Board board)
          {
              int bestCell = -1;
              int bestScore = -2;
              for (int i = 0; i < 9; i++)
              {
                  if (board.Cells[i] != ' ') continue;
                  board.Cells[i] = 'O';
                  int score = Minimax(board, false);
                  board.Cells[i] = ' ';
                  if (score > bestScore)
                  {
                      bestScore = score;
                      bestCell = i;
                  }
              }
              return bestCell;
          }
      }

      class Program
      {
          const int Left = 80, Top = 30, Size = 60;

          static void Main()
          {
              Board board = new Board();
              int cursor = 0;
              bool humansTurn = true;
              int aiWait = 0;

              Engine.Frames(150);
              while (Engine.Running())
              {
                  bool over = board.Winner() != ' ' || board.IsFull();
                  if (!over && humansTurn)
                  {
                      if (Engine.KeyPressed(Key.Left) && cursor % 3 > 0) cursor--;
                      if (Engine.KeyPressed(Key.Right) && cursor % 3 < 2) cursor++;
                      if (Engine.KeyPressed(Key.Up) && cursor >= 3) cursor -= 3;
                      if (Engine.KeyPressed(Key.Down) && cursor < 6) cursor += 3;
                      if (Engine.KeyPressed(Key.Space) && board.Cells[cursor] == ' ')
                      {
                          board.Cells[cursor] = 'X';
                          humansTurn = false;
                          aiWait = 10;                    // the computer "thinks" for 10 frames
                      }
                  }
                  else if (!over && --aiWait == 0)
                  {
                      board.Cells[Ai.BestMove(board)] = 'O';
                      humansTurn = true;
                  }

                  Engine.Clear(Color.Dark);
                  Engine.Rect(Left + (cursor % 3) * Size, Top + (cursor / 3) * Size, Size, Size, new Color(50, 54, 90));
                  for (int i = 1; i < 3; i++)
                  {
                      Engine.Line(Left + i * Size, Top, Left + i * Size, Top + 3 * Size, Color.Gray);
                      Engine.Line(Left, Top + i * Size, Left + 3 * Size, Top + i * Size, Color.Gray);
                  }
                  for (int i = 0; i < 9; i++)
                  {
                      int cx = Left + (i % 3) * Size + Size / 2;
                      int cy = Top + (i / 3) * Size + Size / 2;
                      if (board.Cells[i] == 'X')
                      {
                          Engine.Line(cx - 16, cy - 16, cx + 16, cy + 16, Color.Cyan);
                          Engine.Line(cx - 16, cy + 16, cx + 16, cy - 16, Color.Cyan);
                      }
                      if (board.Cells[i] == 'O')
                      {
                          Engine.Circle(cx, cy, 17, Color.Pink);
                          Engine.Circle(cx, cy, 12, Color.Dark);
                      }
                  }
                  Engine.Present();
              }
              char w = board.Winner();
              Console.WriteLine("winner: " + (w != ' ' ? w.ToString() : board.IsFull() ? "draw" : "none"));
          }
      }
quiz:
  - q: "What is the base case of Minimax?"
    options: ["When the loop variable i reaches 9", "When somebody has won or the board is full, so the method returns a score without recursing", "When the computer's turn starts", "There is none"]
    answer: 1
    explain: "Without a base case the recursion would never stop (stack overflow)."
  - q: "Why is the trial move undone (board.Cells[i] = ' ') after the recursive call?"
    options: ["To make the board draw faster", "Because chars can not be changed twice", "The same board is reused to imagine every future, so each try must be taken back", "It is only a style choice"]
    answer: 2
  - q: "On the human's turn Minimax keeps the LOWEST score. Why?"
    options: ["Scores are from the computer's point of view, so the human's best move is the one that is worst for the computer", "The human always loses", "Lower numbers are faster", "It is a bug"]
    answer: 0
  - q: "Why can a perfect tic-tac-toe AI still use a plain full search?"
    options: ["The board is stored as chars", "Recursion is free", "The game tree is tiny, fewer than 550,000 positions", "Because C# has a built-in minimax"]
    answer: 2
---
Tic-tac-toe is a solved game: with perfect play nobody wins unless the other side makes a mistake. In this lesson the computer plays perfectly, and the way it does it, an algorithm called **minimax**, is the ancestor of every chess and board-game engine. It is also a very good exercise in **recursion**: a method that calls itself.

## The board

The board is nine cells, numbered 0 to 8, stored in an array of `char`: `' '` for empty, `'X'` for the human and `'O'` for the computer.

```
0 | 1 | 2
3 | 4 | 5
6 | 7 | 8
```

There are exactly eight ways to win: three rows, three columns and two diagonals. The `Board` class keeps them in a table of cell numbers (`new[] { 0, 4, 8 }` is the main diagonal) and `Winner()` checks each line: three equal, non-empty cells mean that player has won. A table of data instead of eight `if` statements is a pattern you will use constantly in games.

## The idea behind minimax

How does a program decide on a move? It imagines the future. For every empty cell it asks: "if I play here, and then the opponent replies as well as possible, and I reply as well as possible, and so on until the game ends, how does it end?" Each finished game gets a score from the computer's point of view:

| End of the game | Score |
|---|---|
| computer (O) wins | +1 |
| human (X) wins | -1 |
| draw | 0 |

The computer, when it is its turn, picks the move with the **highest** score. The human, when it is the human's turn, is assumed to pick the move with the **lowest** score, because that is best for them. That alternating "max, min, max, min" is where the name comes from.

## Recursion

```csharp
static int Minimax(Board board, bool computersTurn)
{
    char w = board.Winner();
    if (w == 'O') return 1;
    if (w == 'X') return -1;
    if (board.IsFull()) return 0;

    int best = computersTurn ? -2 : 2;
    for (int i = 0; i < 9; i++)
    {
        if (board.Cells[i] != ' ') continue;
        board.Cells[i] = computersTurn ? 'O' : 'X';      // try the move
        int score = Minimax(board, !computersTurn);      // ask: how does that end?
        board.Cells[i] = ' ';                            // undo the move
        best = computersTurn ? Math.Max(best, score) : Math.Min(best, score);
    }
    return best;
}
```

Three things to notice. First, the **base case** at the top: the method stops calling itself when the game is over. Without a base case recursion never ends and the program dies with a stack overflow. Second, `-2` and `2` are just "worse than any real score" starting values, so the first real score always replaces them. Third, **try then undo**: the same board object is reused for every imagined future, so every try is followed by putting the cell back to `' '`. Forgetting the undo corrupts the real board.

`BestMove` is the same loop at the top level: it tries each cell for O, asks `Minimax(board, false)` (next comes the human), and remembers the cell with the highest score. Ties keep the first cell found, which makes the computer deterministic. The whole game tree of tic-tac-toe has fewer than 550,000 positions, so the search finishes in a split second and needs no tricks. Chess has more positions than atoms in the universe, which is why chess engines need much cleverer pruning.

## Keys choose the cell

The human moves a **cursor** with the arrow keys and presses Space. The cursor is one number, 0 to 8, and moving is arithmetic: left and right change it by 1, up and down by 3. The guards `cursor % 3 > 0` and `cursor >= 3` stop it from wrapping around a row or leaving the board. After the human moves, the computer waits ten frames (so you can see it "think"), then plays `board.Cells[Ai.BestMove(board)] = 'O'`.

> **Watch out:**
> - A missing base case: `System.StackOverflowException` or a timeout.
> - Not undoing the trial move: the board fills up with phantom pieces and the real game goes wrong.
> - Scoring from the wrong side. If you return +1 for X wins, the computer plays to lose. Always score from the computer's point of view and use max on its turn, min on the human's.
> - Choosing the *score* instead of the *cell*: `BestMove` must remember `i`, not `score`.

## What the replay does

The player starts in cell 0, plays X there, then plays the top middle cell and finally the middle left cell. The computer answers in the centre, blocks the top row, and then sees that cell 6 both blocks the human and completes its own diagonal. With the stub `return 0` from the starter the computer just plays the first empty cell and the game never finishes.

## Going further

Let the human start with different corners in the input script and watch the result change to a draw. Add a `depth` argument and prefer faster wins (`return 10 - depth`).

> **Your turn:** write `Minimax`: return 1, -1 or 0 when the game is over, otherwise try every empty cell, recurse with the turn flipped, undo the move, and keep the highest score on the computer's turn or the lowest on the human's. The program should print `winner: O`.
