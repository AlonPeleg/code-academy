---
title: "Tic-tac-toe with a minimax AI"
summary: "Write a recursive minimax search so the computer plays perfect tic-tac-toe against the scripted player."
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
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define CELL 60
      #define BOARD_X 70
      #define BOARD_Y 30

      static const int LINES[8][3] = {
          {0, 1, 2}, {3, 4, 5}, {6, 7, 8},       /* rows */
          {0, 3, 6}, {1, 4, 7}, {2, 5, 8},       /* columns */
          {0, 4, 8}, {2, 4, 6}                   /* diagonals */
      };

      /* 'X' or 'O' if that player has three in a row, otherwise 0. */
      static char winner(const char b[9]) {
          // 1. For each of the 8 lines: if b[line[0]] is not ' ' and all three cells hold the same
          //    mark, return that mark. If no line matches, return 0.
          return 0;
      }

      static int is_full(const char b[9]) {
          for (int i = 0; i < 9; i++) if (b[i] == ' ') return 0;
          return 1;
      }

      /* How good is this board for the computer (O)?  +1 O wins, -1 X wins, 0 draw.
         o_to_move is 1 when it is O's turn and 0 when it is X's turn. */
      static int minimax(char b[9], int o_to_move) {
          // 2. Base cases first: winner is 'O' -> return 1, winner is 'X' -> return -1, board full -> return 0.
          //    Then try every empty cell: place the mover's mark, call minimax(b, !o_to_move), take the
          //    mark back off (b[i] = ' '). O keeps the HIGHEST score, X the LOWEST. Return that best score.
          return 0;   /* placeholder: every board looks equally good */
      }

      /* The computer's move: the empty cell whose minimax score is highest. */
      static int best_move(char b[9]) {
          int best = -2, move = -1;
          for (int i = 0; i < 9; i++) {
              if (b[i] != ' ') continue;
              b[i] = 'O';
              int score = minimax(b, 0);          /* then it is X's turn */
              b[i] = ' ';
              if (score > best) { best = score; move = i; }
          }
          return move;
      }

      int main(void) {
          char board[9] = {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '};
          int cx = 1, cy = 1;                     /* the cursor, in cells */
          char over = 0;                          /* 0 while playing, else 'X', 'O' or 'D' for a draw */

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
          if (over == 'D') printf("winner: draw\n");
          else if (over) printf("winner: %c\n", over);
          else printf("winner: none\n");
          return 0;
      }
check:
  output: |
    winner: O
hints:
  - "Two functions. winner() walks the 8 winning lines and checks that the three cells are equal and not a space. minimax() has base cases (somebody won, or the board is full) and then the try-recurse-undo loop, where O keeps the highest score and X the lowest."
  - "minimax: if winner is 'O' return 1, if 'X' return -1, if full return 0. Then best = o_to_move ? -2 : 2; for each empty cell: put the mark of the mover, score = minimax(b, !o_to_move), take the mark back off, and update best (higher for O, lower for X)."
  - "winner: for each line a = b[line[0]]; if (a != ' ' && a == b[line[1]] && a == b[line[2]]) return a;   minimax: char w = winner(b); if (w == 'O') return 1; if (w == 'X') return -1; if (is_full(b)) return 0; then the loop with the undo and  best = ...  update, and finally return best;"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include "engine.h"

      #define CELL 60
      #define BOARD_X 70
      #define BOARD_Y 30

      static const int LINES[8][3] = {
          {0, 1, 2}, {3, 4, 5}, {6, 7, 8},       /* rows */
          {0, 3, 6}, {1, 4, 7}, {2, 5, 8},       /* columns */
          {0, 4, 8}, {2, 4, 6}                   /* diagonals */
      };

      /* 'X' or 'O' if that player has three in a row, otherwise 0. */
      static char winner(const char b[9]) {
          for (int i = 0; i < 8; i++) {
              char a = b[LINES[i][0]];
              if (a != ' ' && a == b[LINES[i][1]] && a == b[LINES[i][2]]) return a;
          }
          return 0;
      }

      static int is_full(const char b[9]) {
          for (int i = 0; i < 9; i++) if (b[i] == ' ') return 0;
          return 1;
      }

      /* How good is this board for the computer (O)?  +1 O wins, -1 X wins, 0 draw.
         o_to_move is 1 when it is O's turn and 0 when it is X's turn. */
      static int minimax(char b[9], int o_to_move) {
          char w = winner(b);
          if (w == 'O') return 1;
          if (w == 'X') return -1;
          if (is_full(b)) return 0;

          int best = o_to_move ? -2 : 2;
          for (int i = 0; i < 9; i++) {
              if (b[i] != ' ') continue;
              b[i] = o_to_move ? 'O' : 'X';
              int score = minimax(b, !o_to_move);
              b[i] = ' ';
              if (o_to_move ? score > best : score < best) best = score;
          }
          return best;
      }

      /* The computer's move: the empty cell whose minimax score is highest. */
      static int best_move(char b[9]) {
          int best = -2, move = -1;
          for (int i = 0; i < 9; i++) {
              if (b[i] != ' ') continue;
              b[i] = 'O';
              int score = minimax(b, 0);          /* then it is X's turn */
              b[i] = ' ';
              if (score > best) { best = score; move = i; }
          }
          return move;
      }

      int main(void) {
          char board[9] = {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '};
          int cx = 1, cy = 1;                     /* the cursor, in cells */
          char over = 0;                          /* 0 while playing, else 'X', 'O' or 'D' for a draw */

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
          if (over == 'D') printf("winner: draw\n");
          else if (over) printf("winner: %c\n", over);
          else printf("winner: none\n");
          return 0;
      }
quiz:
  - q: "What is the job of the base cases in minimax?"
    options: ["They draw the board","They stop the recursion by returning a score for a finished game","They choose the best cell","They count the moves"]
    answer: 1
    explain: "Without them the function would call itself forever until the stack overflows."
  - q: "On X's turn, minimax keeps the..."
    options: ["Highest score","First score it finds","Average score","Lowest score, because a good result for X is a bad result for the computer"]
    answer: 3
  - q: "Why is the move taken back (b[i] = ' ') after the recursive call?"
    options: ["To draw the board again","So the next cell is tried on the original board","It is optional","To save memory"]
    answer: 1
  - q: "Why does best start at -2 for O (and 2 for X), not 0?"
    options: ["So that any real score (-1, 0 or 1) can replace it","Because C needs it","To make draws impossible","Zero is not allowed in arrays"]
    answer: 0
    explain: "Starting at 0 would make a real score of -1 unable to beat it."
---
Tic-tac-toe is small enough that a computer can play it **perfectly**. In this lesson you will write the famous **minimax** algorithm: a function that calls itself to look at every possible future of the game and pick the best move. It is the first time in this track that recursion does the real work.

## The board

The board is just an array of nine characters, one per cell, numbered row by row:

```c
char board[9] = {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '};
//  0 | 1 | 2
//  3 | 4 | 5
//  6 | 7 | 8
```

`' '` is an empty cell, `'X'` is the human and `'O'` the computer. The cursor is moved with the arrow keys, and SPACE puts an X in the chosen cell if it is empty.

## Who has won?

There are only eight winning lines, so we write them down as data and loop over them:

```c
static const int LINES[8][3] = {
    {0, 1, 2}, {3, 4, 5}, {6, 7, 8},      // rows
    {0, 3, 6}, {1, 4, 7}, {2, 5, 8},      // columns
    {0, 4, 8}, {2, 4, 6}                  // diagonals
};
```

A line is won when its first cell is not empty and all three cells hold the same character. Data-driven code like this is shorter and safer than eight hand-written `if` statements.

## The idea of minimax

Imagine you are the computer. For each empty cell you could take, ask: "if I play here, how will the game end if **both** of us play perfectly from then on?" To answer, you must imagine your opponent's reply, then your next move, and so on until someone wins or the board is full. Then you pick the cell with the best outcome.

We give every finished game a **score from the computer's point of view**: `+1` if O wins, `-1` if X wins, `0` for a draw. Now the rule is simple:

- On O's turn, take the move with the **highest** score (O maximizes).
- On X's turn, assume X takes the move with the **lowest** score (X minimizes, because a good result for X is bad for O).

That is why it is called **mini**max. In code, one function does both jobs:

```c
static int minimax(char b[9], int o_to_move) {
    char w = winner(b);
    if (w == 'O') return 1;           // base cases: the game is over
    if (w == 'X') return -1;
    if (is_full(b)) return 0;

    int best = o_to_move ? -2 : 2;    // worse than any real score
    for (int i = 0; i < 9; i++) {
        if (b[i] != ' ') continue;
        b[i] = o_to_move ? 'O' : 'X'; // try the move...
        int score = minimax(b, !o_to_move);   // ...see how it ends...
        b[i] = ' ';                   // ...and take it back
        if (o_to_move ? score > best : score < best) best = score;
    }
    return best;
}
```

Read it slowly. The **base cases** stop the recursion; without them the function would call itself forever until the program crashes with a stack overflow. The **try, recurse, undo** pattern is the heart of every search algorithm: change the board, explore, then restore it exactly, so the next cell is tried on the same board. Arrays are passed as pointers in C, so the board you change inside the function is the real one, and the undo line is not optional.

`best_move` then does the top level of the same loop for O's move and remembers the cell with the best score. On ties it keeps the **first** cell found, so the result is always the same, which matters for a replay.

## How much work is that?

From an empty board there are about 550,000 positions to visit. That sounds like a lot, but a computer does it in a few milliseconds. For a game like chess the same idea needs clever pruning (alpha-beta) because the numbers explode.

> **Watch out:**
> - Forgetting the undo line `b[i] = ' '`: the board fills up with phantom moves and the AI plays nonsense.
> - Missing base cases: `Segmentation fault` after thousands of nested calls (stack overflow).
> - Starting `best` at `0` instead of `-2` or `2`: a real score of `-1` can never beat it, and the AI refuses to see forced losses.
> - Mixing the signs: if both players maximize, the "opponent" helps the computer win and the AI makes silly moves.

## Going further

With the given keys the player makes a mistake and the perfect computer punishes it. Try other cell orders in the Player input (the cursor starts in the middle). Whatever you do, you can never beat this AI, the best you get is `winner: draw`. A nice extension is to prefer faster wins by returning `10 - depth`.

> **Your turn:** write the two missing pieces. (1) `winner` loops over the 8 `LINES` and returns the mark of a completed line, otherwise 0. (2) `minimax` returns 1 / -1 / 0 for finished games, and otherwise tries each empty cell, recurses with `!o_to_move`, undoes the move, and keeps the highest (O) or lowest (X) score. With the given keys the program should print `winner: O`.
