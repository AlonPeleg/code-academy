---
title: Constructors and private members
summary: Set up objects correctly and protect their data.
level: intermediate
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      using namespace std;

      class BankAccount {
      private:
          string owner;
          int balance;

      public:
          // 1. Write a constructor that takes the owner's name and the starting
          //    balance and stores both. (A constructor has the same name as the
          //    class and no return type.)

          // 2. deposit(int amount): add amount to the balance.
          void deposit(int amount) {
          }

          // 3. withdraw(int amount): if amount is more than the balance, change
          //    nothing and return false. Otherwise subtract it and return true.
          bool withdraw(int amount) {
              return false;
          }

          int getBalance() const {
              return 0;
          }

          string getOwner() const {
              return "";
          }
      };

      int main() {
          BankAccount acc("Ava", 100);
          acc.deposit(50);
          cout << acc.getOwner() << " has " << acc.getBalance() << endl;

          if (acc.withdraw(500)) {
              cout << "Withdraw 500: ok" << endl;
          } else {
              cout << "Withdraw 500: failed" << endl;
          }

          if (acc.withdraw(70)) {
              cout << "Withdraw 70: ok" << endl;
          } else {
              cout << "Withdraw 70: failed" << endl;
          }
          cout << acc.getOwner() << " has " << acc.getBalance() << endl;
          return 0;
      }
check:
  output: |
    Ava has 150
    Withdraw 500: failed
    Withdraw 70: ok
    Ava has 80
  code:
    - { pattern: 'BankAccount\s*\(\s*(const\s+)?string', message: "Write a constructor BankAccount(string name, int startBalance)." }
    - { pattern: 'private\s*:', message: "Keep the members private." }
hints:
  - "A constructor looks like a method with the class name and no return type: BankAccount(string name, int start) { ... }. Use it to fill owner and balance."
  - "deposit adds to balance. withdraw needs an if: if (amount > balance) return false; otherwise subtract and return true. getBalance and getOwner just return the private members."
  - "BankAccount(string name, int start) { owner = name; balance = start; }   void deposit(int amount) { balance += amount; }   bool withdraw(int amount) { if (amount > balance) { return false; } balance -= amount; return true; }   int getBalance() const { return balance; }   string getOwner() const { return owner; }"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      using namespace std;

      class BankAccount {
      private:
          string owner;
          int balance;

      public:
          BankAccount(string name, int start) {
              owner = name;
              balance = start;
          }

          void deposit(int amount) {
              balance += amount;
          }

          bool withdraw(int amount) {
              if (amount > balance) {
                  return false;
              }
              balance -= amount;
              return true;
          }

          int getBalance() const {
              return balance;
          }

          string getOwner() const {
              return owner;
          }
      };

      int main() {
          BankAccount acc("Ava", 100);
          acc.deposit(50);
          cout << acc.getOwner() << " has " << acc.getBalance() << endl;

          if (acc.withdraw(500)) {
              cout << "Withdraw 500: ok" << endl;
          } else {
              cout << "Withdraw 500: failed" << endl;
          }

          if (acc.withdraw(70)) {
              cout << "Withdraw 70: ok" << endl;
          } else {
              cout << "Withdraw 70: failed" << endl;
          }
          cout << acc.getOwner() << " has " << acc.getBalance() << endl;
          return 0;
      }
quiz:
  - q: What is a constructor?
    options: ["A function that runs automatically when an object is created", "A function that deletes an object", "A special loop"]
    answer: 0
  - q: How do you recognise a constructor?
    options: ["It returns void", "It is marked with the word constructor", "It has the same name as the class and no return type"]
    answer: 2
  - q: Why make data members private?
    options: ["So outside code can only change them through methods that keep them valid", "To make the program faster", "Because public members are not allowed"]
    answer: 0
  - q: What does  int getBalance() const  promise?
    options: ["The balance never changes", "The method does not modify the object", "The method can only be called once"]
    answer: 1
---

In the last lesson you created a `Rectangle` and then filled in its members one by one. If you forgot a line, the members held random junk. A **constructor** fixes that: it is a special function that runs automatically when an object is created, so the object always starts in a valid state. Together with `private` members it is the heart of safe class design.

## Constructors

A constructor has the **same name as the class** and **no return type**, not even `void`:

```cpp
class Rectangle {
public:
    int width;
    int height;

    Rectangle(int w, int h) {   // the constructor
        width = w;
        height = h;
    }

    int area() { return width * height; }
};

Rectangle r(3, 4);              // runs the constructor with 3 and 4
cout << r.area() << endl;       // prints: 12
```

The arguments in `Rectangle r(3, 4)` are passed to the constructor. You can have several constructors with different parameters, and a **default constructor** with no parameters: `Rectangle() { width = 1; height = 1; }`.

## The member initializer list

C++ has a neater way to set members, between the parentheses and the body:

```cpp
Rectangle(int w, int h) : width(w), height(h) {}
```

Read it as "initialize `width` with `w` and `height` with `h`". It is the preferred style, and necessary for `const` members and references. Both forms work for this lesson.

## private and public

By default (in a `class`) members are **private**: only the class's own methods may touch them. Mark the parts that outsiders may use as `public`:

```cpp
class BankAccount {
private:
    int balance;        // hidden from the outside
public:
    void deposit(int amount) { balance += amount; }
    int getBalance() const { return balance; }
};
```

Now `acc.balance = 1000000;` from `main` is a compile error. The only way to change the balance is through `deposit` and `withdraw`, which can refuse bad requests (such as spending more than you have). Hiding the details and exposing a small, safe set of methods is called **encapsulation**.

Methods that simply return a private member are called **getters**; methods that set one are **setters**. Mark getters `const` since they do not change the object.

## struct versus class

A `struct` is the same as a `class`, except its members are public by default. Programmers use `struct` for simple bundles of data and `class` when there are rules to protect.

> **Watch out:**
> - Giving the constructor a return type (`void BankAccount(...)`) turns it into an ordinary method: `error: return type specification for constructor invalid`.
> - Creating an object without matching arguments: `error: no matching function for call to 'BankAccount::BankAccount()'`. Once you write a constructor with parameters, C++ stops providing the no-argument one.
> - Accessing a private member from `main`: `error: 'int BankAccount::balance' is private within this context`.
> - Naming a parameter the same as a member (`balance = balance;`) assigns the parameter to itself. Use different names, an initializer list, or `this->balance = balance;`.
> - Forgetting the final `;` after the class braces.

## Going further

Add a default constructor that creates an account for `"nobody"` with 0, and a `transfer` method that moves money to another `BankAccount&`.

> **Your turn:** write the constructor `BankAccount(string, int)`, then fill in `deposit`, `withdraw` (refuse and return `false` when the amount is more than the balance) and the two getters. The program should print `Ava has 150`, `Withdraw 500: failed`, `Withdraw 70: ok` and `Ava has 80`.
