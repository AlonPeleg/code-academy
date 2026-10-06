---
title: A Player class
summary: Wrap the player's data and behavior in a class with a constructor, update() and draw().
level: intermediate
runner: remote
game: true
stdin: |
  # The player's key presses: <frame> <key> <down|up>
  # Run right (into the wall), down, a little left, then up
  10 right down
  50 right up
  20 down down
  45 down up
  60 left down
  70 left up
  80 up down
  100 up up
files:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include "engine.h"

      class Player {
      public:
          // 1. The constructor: it runs when you write  Player player(150, 110);
          //    Store the two numbers in x_ and y_.
          Player(int start_x, int start_y) {
          }

          void update() {
              // 2. Move x_ and y_ by speed_ with the four arrow keys.

              x_ = std::max(0, std::min(x_, SCREEN_W - size_));
              y_ = std::max(0, std::min(y_, SCREEN_H - size_));
          }

          void draw() const {
              engine_rect(x_, y_, size_, size_, RGB_CYAN);
          }

          int x() const { return x_; }
          int y() const { return y_; }

      private:
          int x_ = 0;
          int y_ = 0;
          int size_ = 20;
          int speed_ = 4;
      };

      int main() {
          Player player(150, 110);

          engine_frames(120);

          while (engine_running()) {
              player.update();

              engine_clear(RGB_DARK);
              player.draw();
              engine_present();
          }

          std::cout << "final: " << player.x() << ", " << player.y() << std::endl;
          return 0;
      }
check:
  output: |
    final: 260, 130
hints:
  - "A constructor has the same name as the class and no return type. The easiest way to fill the members is an initializer list between the closing parenthesis and the curly brace: a colon, then each member with its value in parentheses."
  - "Constructor: Player(int start_x, int start_y) : x_(start_x), y_(start_y) {}   For update(), use key_down with  x_ -= speed_;  x_ += speed_;  y_ -= speed_;  y_ += speed_;"
  - "Player(int start_x, int start_y) : x_(start_x), y_(start_y) {}   and in update: if (key_down(KEY_LEFT)) x_ -= speed_;  if (key_down(KEY_RIGHT)) x_ += speed_;  if (key_down(KEY_UP)) y_ -= speed_;  if (key_down(KEY_DOWN)) y_ += speed_;"
solution:
  - name: main.cpp
    code: |
      #include <algorithm>
      #include <iostream>
      #include "engine.h"

      class Player {
      public:
          // The constructor: it runs when you write  Player player(150, 110);
          Player(int start_x, int start_y) : x_(start_x), y_(start_y) {}

          void update() {
              if (key_down(KEY_LEFT))  x_ -= speed_;
              if (key_down(KEY_RIGHT)) x_ += speed_;
              if (key_down(KEY_UP))    y_ -= speed_;
              if (key_down(KEY_DOWN))  y_ += speed_;

              x_ = std::max(0, std::min(x_, SCREEN_W - size_));
              y_ = std::max(0, std::min(y_, SCREEN_H - size_));
          }

          void draw() const {
              engine_rect(x_, y_, size_, size_, RGB_CYAN);
          }

          int x() const { return x_; }
          int y() const { return y_; }

      private:
          int x_ = 0;
          int y_ = 0;
          int size_ = 20;
          int speed_ = 4;
      };

      int main() {
          Player player(150, 110);

          engine_frames(120);

          while (engine_running()) {
              player.update();

              engine_clear(RGB_DARK);
              player.draw();
              engine_present();
          }

          std::cout << "final: " << player.x() << ", " << player.y() << std::endl;
          return 0;
      }
quiz:
  - q: "What is a constructor?"
    options: ["A function that deletes an object", "A special function with the class's name that runs when an object is created", "A loop that builds the game", "A private variable"]
    answer: 1
    explain: "Player player(150, 110); calls the constructor with 150 and 110."
  - q: "What does private mean for the members x_ and y_?"
    options: ["Only the class's own functions can read or change them directly", "They are hidden from the user's screen", "They cannot change", "They are stored in a file"]
    answer: 0
    explain: "Outside code must go through methods such as x() and y(). That protects the object from being put in a broken state."
  - q: "What does the const in  void draw() const  promise?"
    options: ["draw can only be called once", "The player is never drawn twice", "draw will not change any member of the object", "draw returns a constant"]
    answer: 2
  - q: "How do you call the update method on an object named player?"
    options: ["update(player)", "player->update", "player::update()", "player.update()"]
    answer: 3
    explain: "Use the dot on an object. (The arrow -> is for pointers to objects.)"
---
So far the player was just a few loose variables, `x` and `y`, next to the loop. C++ lets you do better: a **class** bundles the data *and* the functions that work on it into one unit. In this lesson you will build a `Player` class with a constructor, an `update()` method and a `draw()` method.

## Anatomy of a class

```cpp
class Player {
public:
    Player(int start_x, int start_y) : x_(start_x), y_(start_y) {}

    void update() { /* react to the keys */ }
    void draw() const { /* paint the player */ }

    int x() const { return x_; }

private:
    int x_ = 0;
    int y_ = 0;
};
```

Piece by piece:

- `class Player { ... };` defines a new type. **Don't forget the `;` after the closing brace.**
- `public:` members can be used from anywhere. `private:` members can only be touched by the class's own functions. Keeping the data private means other code cannot put the player in a broken state, for example by setting `x_` to a nonsense value. We end private names with an underscore (`x_`) as a common habit, so `x_` is the field and `x()` is the getter that lets you read it.
- Functions inside a class are called **methods**. Inside a method you can use the members directly, no `player.` needed.
- `const` after a method's `()` is a promise that the method will not change the object. `draw()` only reads, so it is `const`. The compiler complains if you break the promise.

## The constructor

A **constructor** is a special method with the **same name as the class** and **no return type**. It runs automatically when an object is created:

```cpp
Player player(150, 110);    // calls Player(150, 110)
```

The part after the colon, `: x_(start_x), y_(start_y)`, is the **initializer list**. It sets each member as the object is born. It is the idiomatic way to do it in C++ and runs before the `{ }` body. The body here is empty, `{}`, because there is nothing left to do.

You can also give members default values in the class, like `int size_ = 20;`. Members that the constructor does not mention use those defaults.

## Using the object

```cpp
Player player(150, 110);

while (engine_running()) {
    player.update();          // the dot calls a method on this object

    engine_clear(RGB_DARK);
    player.draw();
    engine_present();
}

std::cout << player.x() << std::endl;    // 150 at the start
```

Compare with the C version: `player_update(&player)` has become `player.update()`. No pointers, and the data lives with the code that understands it. You can create more objects of the same class: `Player other(10, 10);` and each has its own `x_` and `y_`.

> **Watch out:**
> - `error: 'int Player::x_' is private within this context`: you tried `player.x_` from outside. Use the getter `player.x()`.
> - Missing `;` after the class's closing brace gives `expected ';' after class definition`.
> - Writing `Player player();` declares a *function* called player, not an object (the "most vexing parse"). Write `Player player(150, 110);` or `Player player{150, 110};`.
> - If you forget to set a member in the constructor and give it no default, it holds a random leftover value. Always initialise your members.

## Going further

Create a second `Player` with another start position. Both are controlled by the same keys, so they move together. Then add a `color_` member that the constructor receives, so every player can look different. (Careful: colors like `RGB_RED` expand to three numbers, so store them as three `int`s.)

> **Your turn:** write the constructor so it stores `start_x` and `start_y` in `x_` and `y_`, then write the four arrow-key lines in `update()` using `speed_`. The program should print `final: 260, 130`.
