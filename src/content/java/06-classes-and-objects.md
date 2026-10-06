---
title: Classes, objects and constructors
summary: Build your own types with fields, constructors, methods, private data and a static counter.
level: intermediate
runner: remote
files:
  - name: Main.java
    code: |
      class BankAccount {
          private String owner;
          private int balance;
          private static int created = 0;

          // 1. Write a constructor BankAccount(String owner, int balance) that stores both
          //    values (use this.owner = owner;) and adds 1 to the static counter  created.

          // 2. Write  void deposit(int amount)  that adds amount to the balance.

          // 3. Write  boolean withdraw(int amount)  that does nothing and returns false when
          //    the balance is too small, otherwise subtracts it and returns true.

          // 4. Write  String getOwner()  and  int getBalance()  getters.

          // 5. Write  static int getCreated()  that returns the counter.
      }

      public class Main {
          public static void main(String[] args) {
              BankAccount a = new BankAccount("Ada", 100);
              BankAccount b = new BankAccount("Linus", 20);
              System.out.println(a.getOwner() + ": " + a.getBalance());

              a.deposit(50);
              System.out.println(a.getOwner() + ": " + a.getBalance());

              System.out.println("withdraw 500: " + a.withdraw(500));
              System.out.println("withdraw 50: " + a.withdraw(50));
              System.out.println(a.getOwner() + ": " + a.getBalance());
              System.out.println(b.getOwner() + ": " + b.getBalance());
              System.out.println("Accounts created: " + BankAccount.getCreated());
          }
      }
check:
  output: |
    Ada: 100
    Ada: 150
    withdraw 500: false
    withdraw 50: true
    Ada: 100
    Linus: 20
    Accounts created: 2
  code:
    - { pattern: 'BankAccount\s*\(\s*String\s+\w+\s*,\s*int\s+\w+\s*\)\s*\{', message: "Write a constructor: BankAccount(String owner, int balance) { ... }." }
    - { pattern: 'this\.\w+\s*=', message: "Use this.field = parameter; to store the constructor arguments." }
    - { pattern: 'static\s+int\s+getCreated\s*\(\s*\)', message: "Write static int getCreated()." }
hints:
  - "A constructor has the same name as the class and no return type. Inside it, this.owner means the field and plain owner means the parameter, so this.owner = owner; copies the argument into the field."
  - "In the constructor also write created++; (a static field is shared by all objects). withdraw is an if: if (amount > balance) { return false; } balance -= amount; return true;"
  - "BankAccount(String owner, int balance) { this.owner = owner; this.balance = balance; created++; }  void deposit(int amount) { balance += amount; }  boolean withdraw(int amount) { if (amount > balance) { return false; } balance -= amount; return true; }  String getOwner() { return owner; }  int getBalance() { return balance; }  static int getCreated() { return created; }"
solution:
  - name: Main.java
    code: |
      class BankAccount {
          private String owner;
          private int balance;
          private static int created = 0;

          BankAccount(String owner, int balance) {
              this.owner = owner;
              this.balance = balance;
              created++;
          }

          void deposit(int amount) {
              balance += amount;
          }

          boolean withdraw(int amount) {
              if (amount > balance) {
                  return false;
              }
              balance -= amount;
              return true;
          }

          String getOwner() {
              return owner;
          }

          int getBalance() {
              return balance;
          }

          static int getCreated() {
              return created;
          }
      }

      public class Main {
          public static void main(String[] args) {
              BankAccount a = new BankAccount("Ada", 100);
              BankAccount b = new BankAccount("Linus", 20);
              System.out.println(a.getOwner() + ": " + a.getBalance());

              a.deposit(50);
              System.out.println(a.getOwner() + ": " + a.getBalance());

              System.out.println("withdraw 500: " + a.withdraw(500));
              System.out.println("withdraw 50: " + a.withdraw(50));
              System.out.println(a.getOwner() + ": " + a.getBalance());
              System.out.println(b.getOwner() + ": " + b.getBalance());
              System.out.println("Accounts created: " + BankAccount.getCreated());
          }
      }
quiz:
  - q: "What is the relationship between a class and an object?"
    options: ["A class is a blueprint, an object is one thing built from it", "An object is a blueprint, a class is a copy", "They are the same", "A class is a method"]
    answer: 0
  - q: "What does the keyword this refer to inside a method or constructor?"
    options: ["The class itself", "The current object", "The main method", "The previous object"]
    answer: 1
  - q: "Why are fields usually marked private?"
    options: ["It makes them faster", "So outside code cannot put the object into an invalid state", "Because Java requires it", "So they can be changed by anyone"]
    answer: 1
    explain: "This idea is called encapsulation: other code must go through methods that can check the rules."
  - q: "What is special about a static field like created?"
    options: ["Each object has its own copy", "There is exactly one copy shared by the whole class", "It can never be read", "It must be a String"]
    answer: 1
---

So far you have used types Java gives you: `int`, `String`, `ArrayList`. A **class** lets you invent your own type that bundles data with the actions that work on it. This is the core of **object-oriented programming**, and it is what Java was designed for.

## Class and object

A class is a **blueprint**. An **object** (or **instance**) is one real thing built from that blueprint. One class `Dog` can make many dog objects, each with its own name and age.

```java
class Dog {
    String name;       // fields: the data each dog has
    int age;

    void bark() {      // a method: something a dog can do
        System.out.println(name + " says Woof!");
    }
}
```

You make an object with `new`, and use its members with a dot:

```java
Dog d = new Dog();
d.name = "Rex";
d.age = 3;
d.bark();      // prints: Rex says Woof!
```

Each object has its own fields. Changing `d.age` does not change another dog's age. In Java a file can hold several classes, but only one may be `public`, and it must match the file name. That is why `BankAccount` here has no `public` and `Main` does.

## Constructors

A **constructor** runs when you write `new`. It has the **same name as the class** and **no return type**, and its job is to set the object up so it is never half-built:

```java
class Dog {
    String name;
    int age;

    Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

Dog d = new Dog("Rex", 3);
```

Inside the constructor the parameter `name` hides the field `name`. The keyword **`this`** means "the object being built", so `this.name` is the field and `name` is the parameter. Without `this`, `name = name;` just assigns the parameter to itself and the field stays empty.

If you write no constructor, Java provides an empty one for free. As soon as you write one with parameters, the free one disappears.

## Encapsulation: private fields and getters

Declare fields `private` so that only the class's own code can touch them. Then offer public methods that enforce the rules:

```java
private int balance;

boolean withdraw(int amount) {
    if (amount > balance) return false;   // refuse, keep the object valid
    balance -= amount;
    return true;
}

int getBalance() { return balance; }      // a "getter"
```

Outside code cannot write `account.balance = -1000;` because the field is hidden. It has to ask through `withdraw`, which checks first. Hiding details like this is called **encapsulation**, and it prevents a huge class of bugs.

## Static members

A normal field exists once **per object**. A `static` field exists once **per class**, shared by all objects. It is a good fit for a counter:

```java
private static int created = 0;
Dog(...) { created++; }
static int getCreated() { return created; }
```

You call a static method on the class, not on an object: `BankAccount.getCreated()`. This is exactly why `Math.max(...)` and `Integer.parseInt(...)` are written with a class name in front.

## toString

Printing an object shows something like `Dog@1b6d3586`. Define a method `public String toString()` and Java will use it whenever the object is turned into text:

```java
public String toString() { return name + " (" + age + ")"; }
```

> **Watch out:**
> - Using a constructor that does not exist, such as `new Dog("Rex")`, gives `error: constructor Dog in class Dog cannot be applied to given types`.
> - Calling a method on an object that was never created gives `Exception in thread "main" java.lang.NullPointerException`. `Dog d;` followed by `d.bark();` fails: you must write `d = new Dog(...)` first.
> - Reaching into a `private` field from another class gives `error: balance has private access in BankAccount`.
> - Giving a constructor a return type (`void Dog(...)`) turns it into an ordinary method and the real constructor is missing.
> - Using `==` on two objects checks whether they are the same object, not whether they hold the same data.

## Going further

Add a `toString()` to `BankAccount` and print `a` directly. Add a check so `deposit` ignores negative amounts. Create a constructor that takes only the owner and starts the balance at 0 by calling `this(owner, 0);`.

> **Your turn:** complete `BankAccount`: a constructor `(String owner, int balance)` using `this` that also increments the static counter `created`, `deposit`, a `withdraw` that returns `false` when funds are short, the getters `getOwner` and `getBalance`, and `static int getCreated()`.
