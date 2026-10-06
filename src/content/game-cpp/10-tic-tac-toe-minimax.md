---
title: "Tic-tac-toe with a minimax AI"
summary: "Write a recursive minimax search with std::array so the computer plays perfect tic-tac-toe against the scripted player."
level: advanced
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # The cursor starts in the middle. Each placement: move the cursor, then press space.
  4 space down
  5 space up
  14 right down
  15 right up
  18 up down
  19 up up
  22 space down
  23 space up
  32 down down
  33 down up
  36 space down
  37 space up
  46 left down
  47 left up
  50 left down
  51 left up
  54 down down
  55 down up
  58 space down
  59 space up
files:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <array>
      #include <iostream>
      #include "engine.h"

      constexpr int CELL = 60, BOARD_X = 70, BOARD_Y = 30;

      using Cells = std::array<char, 9>;      // ' ' empty, 'X' the player, 'O' the computer

      // 'X' or 'O' if that player has three in a row, otherwise 0.
      char winner(const Cells& b) {
          static const int LINES[8][3] = {
              {0, 1, 2}, {3, 4, 5}, {6, 7, 8},       // rows
              {0, 3, 6}, {1, 4, 7}, {2, 5, 8},       // columns
              {0, 4, 8}, {2, 4, 6}                   // diagonals
          };
          // 1. For each line in LINES: if b[line[0]] is not ' ' and all three cells hold the same
          //    mark, return that mark. If no line matches, return 0.
          return 0;
      }

      bool is_full(const Cells& b) {
          return std::none_of(b.begin(), b.end(), [](char c) { return c == ' '; });
      }

      // How good is this board for the computer (O)?  +1 O wins, -1 X wins, 0 draw.
      int minimax(Cells& b, bool o_to_move) {
          // 2. Base cases first: winner is 'O' -> return 1, winner is 'X' -> return -1, board full -> return 0.
          //    Then try every empty cell: place the mover's mark, call minimax(b, !o_to_move), take the
          //    mark back off (cell = ' '). O keeps the HIGHEST score, X the LOWEST. Return that best score.
          return 0;   // placeholder: every board looks equally good
      }

      // The computer's move: the empty cell whose minimax score is highest.
      int best_move(Cells& b) {
          int best = -2, move = -1;
          for (int i = 0; i < 9; i++) {
              if (b[i] != ' ') continue;
              b[i] = 'O';
              int score = minimax(b, false);       // then it is X's turn
              b[i] = ' ';
              if (score > best) { best = score; move = i; }
          }
          return move;
      }

      int main() {
          Cells board;
          board.fill(' ');
          int cx = 1, cy = 1;                      // the cursor, in cells
          char over = 0;                           // 0 while playing, else 'X', 'O' or 'D' for a draw

          engine_frames(150);
          while (engine_running()) {
              if (key_pressed(KEY_LEFT)  && cx > 0) cx--;
              if (key_pressed(KEY_RIGHT) && cx < 2) cx++;
              if (key_pressed(KEY_UP)    && cy > 0) cy--;
              if (key_pressed(KEY_DOWN)  && cy < 2) cy++;

              if (!over && key_pressed(KEY_SPACE) && board[cy * 3 + cx] == ' ') {
                  board[cy * 3 + cx] = 'X';
                  if (!winner(board) && !is_full(board)) board[best_move(board)] = 'O';
                  if (winner(board)) over = winner(board);
                  else if (is_full(board)) over = 'D';
              }

              engine_clear(RGB_DARK);
              engine_rect(BOARD_X + CELL - 1, BOARD_Y, 2, 3 * CELL, RGB_GRAY);
              engine_rect(BOARD_X + 2 * CELL - 1, BOARD_Y, 2, 3 * CELL, RGB_GRAY);
              engine_rect(BOARD_X, BOARD_Y + CELL - 1, 3 * CELL, 2, RGB_GRAY);
              engine_rect(BOARD_X, BOARD_Y + 2 * CELL - 1, 3 * CELL, 2, RGB_GRAY);
              if (!over) engine_rect(BOARD_X + cx * CELL + 4, BOARD_Y + cy * CELL + 4, CELL - 8, CELL - 8, RGB_BLUE);
              for (int i = 0; i < 9; i++) {
                  int x = BOARD_X + (i % 3) * CELL, y = BOARD_Y + (i / 3) * CELL;
                  if (board[i] == 'X') {
                      engine_line(x + 12, y + 12, x + CELL - 12, y + CELL - 12, RGB_CYAN);
                      engine_line(x + CELL - 12, y + 12, x + 12, y + CELL - 12, RGB_CYAN);
                  } else if (board[i] == 'O') {
                      engine_circle(x + CELL / 2, y + CELL / 2, 20, RGB_PINK);
                      engine_circle(x + CELL / 2, y + CELL / 2, 14, RGB_DARK);
                  }
              }
              if (over) engine_text(110, 8, 16, RGB_WHITE, over == 'D' ? "DRAW" : (over == 'X' ? "X WINS" : "O WINS"));
              engine_present();
          }
          if (over == 'D') std::cout << "winner: draw" << std::endl;
          else if (over) std::cout << "winner: " << over << std::endl;
          else std::cout << "winner: none" << std::endl;
          return 0;
      }
check:
  output: |
    winner: O
hints:
  - "Two functions. winner() walks the 8 winning lines and checks that the three cells are equal and not a space. minimax() has base cases (somebody won, or the board is full) and then the try-recurse-undo loop, where O keeps the highest score and X the lowest."
  - "minimax: if winner is 'O' return 1, if 'X' return -1, if full return 0. Then best = o_to_move ? -2 : 2; for (auto& cell : b): skip non-empty cells, set the mover's mark, score = minimax(b, !o_to_move), reset cell to ' ', and update best with std::max for O or std::min for X."
  - "winner: for (const auto& line : LINES) { char a = b[line[0]]; if (a != ' ' && a == b[line[1]] && a == b[line[2]]) return a; }   minimax: base cases, then for (auto& cell : b) { if (cell != ' ') continue; cell = o_to_move ? 'O' : 'X'; int score = minimax(b, !o_to_move); cell = ' '; best = o_to_move ? std::max(best, score) : std::min(best, score); } return best;"
solution:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <array>
      #include <iostream>
      #include "engine.h"

      constexpr int CELL = 60, BOARD_X = 70, BOARD_Y = 30;

      using Cells = std::array<char, 9>;      // ' ' empty, 'X' the player, 'O' the computer

      // 'X' or 'O' if that player has three in a row, otherwise 0.
      char winner(const Cells& b) {
          static const int LINES[8][3] = {
              {0, 1, 2}, {3, 4, 5}, {6, 7, 8},       // rows
              {0, 3, 6}, {1, 4, 7}, {2, 5, 8},       // columns
              {0, 4, 8}, {2, 4, 6}                   // diagonals
          };
          for (const auto& line : LINES) {
              char a = b[line[0]];
              if (a != ' ' && a == b[line[1]] && a == b[line[2]]) return a;
          }
          return 0;
      }

      bool is_full(const Cells& b) {
          return std::none_of(b.begin(), b.end(), [](char c) { return c == ' '; });
      }

      // How good is this board for the computer (O)?  +1 O wins, -1 X wins, 0 draw.
      int minimax(Cells& b, bool o_to_move) {
          char w = winner(b);
          if (w == 'O') return 1;
          if (w == 'X') return -1;
          if (is_full(b)) return 0;

          int best = o_to_move ? -2 : 2;
          for (auto& cell : b) {
              if (cell != ' ') continue;
              cell = o_to_move ? 'O' : 'X';
              int score = minimax(b, !o_to_move);
              cell = ' ';
              best = o_to_move ? std::max(best, score) : std::min(best, score);
          }
          return best;
      }

      // The computer's move: the empty cell whose minimax score is highest.
      int best_move(Cells& b) {
          int best = -2, move = -1;
          for (int i = 0; i < 9; i++) {
              if (b[i] != ' ') continue;
              b[i] = 'O';
              int score = minimax(b, false);       // then it is X's turn
              b[i] = ' ';
              if (score > best) { best = score; move = i; }
          }
          return move;
      }

      int main() {
          Cells board;
          board.fill(' ');
          int cx = 1, cy = 1;                      // the cursor, in cells
          char over = 0;                           // 0 while playing, else 'X', 'O' or 'D' for a draw

          engine_frames(150);
          while (engine_running()) {
              if (key_pressed(KEY_LEFT)  && cx > 0) cx--;
              if (key_pressed(KEY_RIGHT) && cx < 2) cx++;
              if (key_pressed(KEY_UP)    && cy > 0) cy--;
              if (key_pressed(KEY_DOWN)  && cy < 2) cy++;

              if (!over && key_pressed(KEY_SPACE) && board[cy * 3 + cx] == ' ') {
                  board[cy * 3 + cx] = 'X';
                  if (!winner(board) && !is_full(board)) board[best_move(board)] = 'O';
                  if (winner(board)) over = winner(board);
                  else if (is_full(board)) over = 'D';
              }

              engine_clear(RGB_DARK);
              engine_rect(BOARD_X + CELL - 1, BOARD_Y, 2, 3 * CELL, RGB_GRAY);
              engine_rect(BOARD_X + 2 * CELL - 1, BOARD_Y, 2, 3 * CELL, RGB_GRAY);
              engine_rect(BOARD_X, BOARD_Y + CELL - 1, 3 * CELL, 2, RGB_GRAY);
              engine_rect(BOARD_X, BOARD_Y + 2 * CELL - 1, 3 * CELL, 2, RGB_GRAY);
              if (!over) engine_rect(BOARD_X + cx * CELL + 4, BOARD_Y + cy * CELL + 4, CELL - 8, CELL - 8, RGB_BLUE);
              for (int i = 0; i < 9; i++) {
                  int x = BOARD_X + (i % 3) * CELL, y = BOARD_Y + (i / 3) * CELL;
                  if (board[i] == 'X') {
                      engine_line(x + 12, y + 12, x + CELL - 12, y + CELL - 12, RGB_CYAN);
                      engine_line(x + CELL - 12, y + 12, x + 12, y + CELL - 12, RGB_CYAN);
                  } else if (board[i] == 'O') {
                      engine_circle(x + CELL / 2, y + CELL / 2, 20, RGB_PINK);
                      engine_circle(x + CELL / 2, y + CELL / 2, 14, RGB_DARK);
                  }
              }
              if (over) engine_text(110, 8, 16, RGB_WHITE, over == 'D' ? "DRAW" : (over == 'X' ? "X WINS" : "O WINS"));
              engine_present();
          }
          if (over == 'D') std::cout << "winner: draw" << std::endl;
          else if (over) std::cout << "winner: " << over << std::endl;
          else std::cout << "winner: none" << std::endl;
          return 0;
      }
quiz:
  - q: "In minimax, what does the line cell = ' ' after the recursive call do?"
    options: ["Prints the cell","Starts a new game","Undoes the trial move so the board is as before","Makes the cell the best move"]
    answer: 2
  - q: "Which scores does this lesson's minimax give a finished game?"
    options: ["+1 if O wins, -1 if X wins, 0 for a draw","The number of moves","+1 for X, -1 for O","Only 0 or 1"]
    answer: 0
  - q: "What does for (auto& cell : b) give you, compared with for (auto cell : b)?"
    options: ["Nothing, they are identical","A faster loop in every case","A reference to each element, so assigning to cell changes the real board","A loop that skips empty cells"]
    answer: 2
  - q: "Why does best_move keep the FIRST best cell on ties?"
    options: ["Because later cells are not allowed","Because it only checks the first cell","To make the program shorter","So the computer always plays the same way, which a replayed recording needs"]
    answer: 3
---
Tic-tac-toe is small enough that a computer can play it **perfectly**. In this lesson you will write the famous **minimax** algorithm: a function that calls itself to look at every possible future of the game and pick the best move. Along the way you will meet `std::array` and a few standard algorithms.

## The board

```cpp
using Cells = std::array<char, 9>;
Cells board;
board.fill(' ');
//  0 | 1 | 2
//  3 | 4 | 5
//  6 | 7 | 8
```

`std::array<char, 9>` is a fixed-size array that knows its own size, can be passed by reference, and works with range-for loops and standard algorithms. `using Cells = ...` gives it a short name. `' '` is an empty cell, `'X'` is the human and `'O'` the computer.

The cursor moves with the arrow keys, and SPACE puts an X in the chosen cell if it is empty. Then the computer answers immediately.

## Who has won?

There are only eight winning lines. We write them down as data and loop over them:

```cpp
static const int LINES[8][3] = {
    {0, 1, 2}, {3, 4, 5}, {6, 7, 8},      // rows
    {0, 3, 6}, {1, 4, 7}, {2, 5, 8},      // columns
    {0, 4, 8}, {2, 4, 6}                  // diagonals
};
for (const auto& line : LINES) { /* line[0], line[1], line[2] are cell numbers */ }
```

A line is won when its first cell is not empty and all three cells hold the same character. For "is the board full?" a standard algorithm says it in one line: `std::none_of(b.begin(), b.end(), [](char c) { return c == ' '; })` ("no cell is empty").

## The idea of minimax

Imagine you are the computer. For each empty cell you could take, ask: "if I play here, how does the game end if **both** of us play perfectly from then on?" To answer you must imagine the opponent's reply, then your next move, and so on until someone wins or the board is full. Then you pick the cell with the best outcome.

Every finished game gets a **score from the computer's point of view**: `+1` if O wins, `-1` if X wins, `0` for a draw. The rule is then:

- On O's turn take the move with the **highest** score (O maximizes).
- On X's turn assume X takes the move with the **lowest** score (X minimizes: what is good for X is bad for O).

Hence **mini**max. One function does both jobs:

```cpp
int minimax(Cells& b, bool o_to_move) {
    char w = winner(b);
    if (w == 'O') return 1;           // base cases: the game is over
    if (w == 'X') return -1;
    if (is_full(b)) return 0;

    int best = o_to_move ? -2 : 2;    // worse than any real score
    for (auto& cell : b) {
        if (cell != ' ') continue;
        cell = o_to_move ? 'O' : 'X';             // try the move...
        int score = minimax(b, !o_to_move);       // ...see how it ends...
        cell = ' ';                               // ...and take it back
        best = o_to_move ? std::max(best, score) : std::min(best, score);
    }
    return best;
}
```

Read it slowly. The **base cases** stop the recursion; without them the function would call itself forever until the program crashes (a stack overflow). The **try, recurse, undo** pattern is the heart of every search algorithm: change the board, explore, then restore it exactly so the next cell is tried on the same board. `for (auto& cell : b)` gives a **reference** to each cell, so assigning to `cell` changes the real board, and `Cells& b` (a reference parameter) makes sure there is only one board.

`best_move` then does the top level of the same loop for O's move and remembers the cell with the best score. On ties it keeps the **first** one found, so the result is always the same. That determinism is required in a replay.

## How much work is that?

From an empty board there are about 550,000 positions. A computer visits them in a few milliseconds. For chess the same idea needs clever pruning (alpha-beta) because the numbers explode.

> **Watch out:**
> - Forgetting `cell = ' '` (the undo): the board fills with phantom moves and the AI plays nonsense.
> - Missing base cases: `Segmentation fault` after a flood of nested calls.
> - Starting `best` at `0` instead of `-2` / `2`: a real score of `-1` can never beat it, so the AI cannot see forced losses.
> - Passing the board **by value** (`Cells b`) copies it. The program still works but it is slower, and your undo line has no visible effect on the caller. Use a reference when you want to change the original.

## Going further

With the given keys the player makes a mistake and the perfect computer punishes it. Edit the Player input to try other cell orders; whatever you do, the best you can get is `winner: draw`. A nice extension is to prefer faster wins by returning `10 - depth`.

> **Your turn:** write the two missing pieces. (1) `winner` loops over the 8 `LINES` and returns the mark of a completed line, otherwise 0. (2) `minimax` returns 1 / -1 / 0 for finished games, otherwise tries each empty cell, recurses with `!o_to_move`, undoes the move, and keeps the highest (O) or lowest (X) score. With the given keys the program should print `winner: O`.
