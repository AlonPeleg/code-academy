---
title: Structs, enums and typedef
summary: Group related data into your own types.
level: intermediate
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <string.h>

      // 1. Create a named set of constants for difficulty levels with the values
      //    EASY, NORMAL, HARD, and give it the short type name Level using typedef.
      // 2. Create a struct type called Player (also with typedef) holding:
      //    char name[20];   int score;   Level level;

      int main(void) {
          // 3. Make a Player p1 with name "Ava", score 40, level NORMAL.
          // 4. Add 10 to p1's score using the dot operator.
          // 5. Print:  Ava has 50 points on level 1
          //    (an enum value prints as a number with %d: EASY=0, NORMAL=1, HARD=2)

          // 6. Make a pointer to p1 and use the arrow operator to set the score to 60.
          //    Print:  Score now: 60

          // 7. Make an array of 2 Players: {"Ben", 30, EASY} and {"Cy", 45, HARD}.
          //    Loop over it and print each as   Ben: 30   then   Cy: 45

          return 0;
      }
check:
  output: |
    Ava has 50 points on level 1
    Score now: 60
    Ben: 30
    Cy: 45
  code:
    - { pattern: 'typedef\s+struct', message: "Define the Player type with typedef struct { ... } Player;" }
    - { pattern: 'enum\s*\w*\s*\{', message: "Define the levels with an enum { ... }." }
    - { pattern: '->', message: "Use the arrow operator (->) to reach a member through a pointer." }
    - { pattern: 'for\s*\(', message: "Use a for loop over the array." }
hints:
  - "Use typedef enum { ... } Level; for the levels and typedef struct { ... } Player; for the player. A member is reached with p1.score, and through a pointer with ptr->score."
  - "typedef enum { EASY, NORMAL, HARD } Level; then typedef struct { char name[20]; int score; Level level; } Player; In main: Player p1 = {\"Ava\", 40, NORMAL}; p1.score += 10; Player *ptr = &p1; ptr->score = 60;"
  - "Player team[2] = { {\"Ben\", 30, EASY}, {\"Cy\", 45, HARD} };   for (int i = 0; i < 2; i++) { printf(\"%s: %d\\n\", team[i].name, team[i].score); }   and printf(\"%s has %d points on level %d\\n\", p1.name, p1.score, p1.level);"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <string.h>

      typedef enum { EASY, NORMAL, HARD } Level;

      typedef struct {
          char name[20];
          int score;
          Level level;
      } Player;

      int main(void) {
          Player p1 = {"Ava", 40, NORMAL};
          p1.score += 10;
          printf("%s has %d points on level %d\n", p1.name, p1.score, p1.level);

          Player *ptr = &p1;
          ptr->score = 60;
          printf("Score now: %d\n", p1.score);

          Player team[2] = { {"Ben", 30, EASY}, {"Cy", 45, HARD} };
          for (int i = 0; i < 2; i++) {
              printf("%s: %d\n", team[i].name, team[i].score);
          }

          return 0;
      }
quiz:
  - q: What is a struct?
    options: ["A loop that repeats a block", "A function that returns several values", "A type that groups several named variables together"]
    answer: 2
  - q: How do you read the score member of a struct variable p1?
    options: ["p1.score", "p1->score", "p1::score"]
    answer: 0
  - q: When do you use the arrow operator ->  ?
    options: ["When the struct is inside an array", "When you have a pointer to a struct", "When printing a struct"]
    answer: 1
  - q: What number does NORMAL have in  enum { EASY, NORMAL, HARD } ?
    options: ["0", "2", "1"]
    answer: 2
    explain: "Enum constants count up from 0 unless you give them values: EASY is 0, NORMAL is 1, HARD is 2."
---

So far every variable held a single value. Real programs deal with things that have several parts: a player has a name, a score and a level; a point has an x and a y. In this lesson you will build your own types with `struct`, give names to a set of options with `enum`, and make types easier to write with `typedef`.

## struct: a bundle of variables

```c
struct Point {
    int x;
    int y;
};

struct Point p = {3, 4};
printf("%d %d\n", p.x, p.y);   // prints: 3 4
p.x = 10;                      // change one member
```

The variables inside are called **members** (or fields). You reach them with the **dot operator**: `p.x`. The braces `{3, 4}` fill the members in the order they were declared.

## typedef: a shorter name

Writing `struct Point` everywhere gets tiring. `typedef` gives a type a new name:

```c
typedef struct {
    int x;
    int y;
} Point;

Point p = {3, 4};     // no "struct" needed any more
```

The shape is `typedef <existing type> <new name>;`. Here the existing type is an unnamed struct and the new name `Point` comes after the closing brace.

## enum: named constants

When a variable can take one of a small set of choices, an `enum` gives each choice a readable name instead of a mystery number:

```c
typedef enum { EASY, NORMAL, HARD } Level;

Level lvl = HARD;
if (lvl == HARD) {
    printf("Good luck!\n");
}
printf("%d\n", lvl);   // prints: 2
```

Behind the scenes the names are just ints counting from 0 (`EASY` is 0, `NORMAL` is 1, `HARD` is 2), so print them with `%d`. A `switch` over an enum value reads nicely.

## Structs inside structs and arrays

A member can be any type, including another enum, a string or even another struct, and you can make arrays of structs. Strings are set up inside braces like normal: `Player p = {"Ava", 40, NORMAL};`. An array of structs is `Player team[2] = { {"Ben", 30, EASY}, {"Cy", 45, HARD} };` and you read one with `team[i].score`.

## Pointers to structs

When a function receives a pointer to a struct (so that it can change the original), you reach the members with the **arrow**:

```c
Point *pp = &p;
pp->x = 99;       // same as (*pp).x = 99;
```

> **Watch out:**
> - You cannot assign a string to a char-array member after creation: `p.name = "Bob";` gives `error: assignment to expression with array type`. Use `strcpy(p.name, "Bob");`.
> - Forgetting the semicolon after the closing brace of a struct gives `error: expected ';' ... at end of declaration`.
> - Mixing up `.` and `->`: using `.` on a pointer gives `error: 'ptr' is a pointer; did you mean to use '->'?`.
> - Structs are copied when you pass them to a function by value. To change the original, pass a pointer.

## Going further

Add a function `void print_player(const Player *p)` that prints a player, and use it in the loop. Then add a member `double speed` to the struct.

> **Your turn:** create the `Level` enum and the `Player` struct (both with `typedef`). Make `p1`, add 10 points with the dot operator, set the score to 60 through a pointer with `->`, and loop over an array of two more players. The expected output is shown in the comments.
