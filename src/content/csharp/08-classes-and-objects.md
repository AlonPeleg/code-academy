---
title: Classes and objects
summary: Bundle data and behavior together with fields, properties, constructors and methods.
level: intermediate
runner: remote
files:
  - name: Program.cs
    code: |
      using System;

      class Player
      {
          public string Name { get; set; }
          public int Health { get; set; }

          // 1. Write a constructor that takes a name and a starting health
          //    and stores them in Name and Health.

          // 2. Write a method TakeDamage that takes an int amount and lowers Health by it.
          //    Health must never go below 0.

          // 3. Write a method IsAlive that returns true when Health is above 0.
      }

      class Program
      {
          static void Main()
          {
              Player p = new Player("Hero", 100);
              Console.WriteLine($"{p.Name} has {p.Health} health");

              p.TakeDamage(30);
              Console.WriteLine($"{p.Name} has {p.Health} health");

              p.TakeDamage(500);
              Console.WriteLine($"{p.Name} has {p.Health} health");
              Console.WriteLine($"Alive: {p.IsAlive()}");
          }
      }
check:
  output: |
    Hero has 100 health
    Hero has 70 health
    Hero has 0 health
    Alive: False
  code:
    - { pattern: 'public\s+Player\s*\(\s*string\s+\w+\s*,\s*int\s+\w+\s*\)', message: "Write a public constructor: public Player(string name, int health)." }
    - { pattern: 'void\s+TakeDamage\s*\(\s*int\s+\w+\s*\)', message: "Write a method void TakeDamage(int amount)." }
    - { pattern: 'bool\s+IsAlive\s*\(\s*\)', message: "Write a method bool IsAlive()." }
hints:
  - "A constructor looks like a method with no return type and the same name as the class. Inside it, copy the parameters into the properties (Name = name;)."
  - "public Player(string name, int health) { Name = name; Health = health; }   TakeDamage subtracts from Health and, if it went below 0, sets it back to 0. IsAlive returns Health > 0."
  - "public Player(string name, int health) { Name = name; Health = health; }  public void TakeDamage(int amount) { Health -= amount; if (Health < 0) { Health = 0; } }  public bool IsAlive() { return Health > 0; }"
solution:
  - name: Program.cs
    code: |
      using System;

      class Player
      {
          public string Name { get; set; }
          public int Health { get; set; }

          public Player(string name, int health)
          {
              Name = name;
              Health = health;
          }

          public void TakeDamage(int amount)
          {
              Health -= amount;
              if (Health < 0)
              {
                  Health = 0;
              }
          }

          public bool IsAlive()
          {
              return Health > 0;
          }
      }

      class Program
      {
          static void Main()
          {
              Player p = new Player("Hero", 100);
              Console.WriteLine($"{p.Name} has {p.Health} health");

              p.TakeDamage(30);
              Console.WriteLine($"{p.Name} has {p.Health} health");

              p.TakeDamage(500);
              Console.WriteLine($"{p.Name} has {p.Health} health");
              Console.WriteLine($"Alive: {p.IsAlive()}");
          }
      }
quiz:
  - q: What is the relationship between a class and an object?
    options: ["They are the same thing", "An object is a blueprint, a class is a copy", "A class is a blueprint, an object is one thing built from it", "A class is a variable, an object is a method"]
    answer: 2
  - q: What does the keyword new do in  new Player("Hero", 100)?
    options: ["Deletes the old player", "Creates a new object and runs the constructor", "Declares a new variable type", "Prints the player"]
    answer: 1
  - q: What is special about a constructor?
    options: ["It has the same name as the class and no return type", "It always returns an int", "It must be static", "It can only be called once per program"]
    answer: 0
  - q: What does  public  mean on a member?
    options: ["Only the class itself can use it", "It is hidden from everyone", "It can be used from other classes too", "It is a constant"]
    answer: 2
---

So far you have used types that C# gives you: `int`, `string`, `List<int>`. A **class** lets you create your own type that groups related data and the actions that work on it. This is the heart of **object-oriented programming**.

## Class and object

A class is a **blueprint**. An **object** (also called an **instance**) is one real thing built from that blueprint. One class `Dog` can make many dog objects, each with its own name and age.

```csharp
class Dog
{
    public string Name;    // a field: data stored in each object
    public int Age;

    public void Bark()     // a method: something a dog can do
    {
        Console.WriteLine($"{Name} says Woof!");
    }
}
```

You create an object with `new` and use its members with a dot:

```csharp
Dog d = new Dog();
d.Name = "Rex";
d.Age = 3;
d.Bark();     // prints: Rex says Woof!
```

## Properties

Instead of bare fields, C# programmers usually use **properties**. The short form is called an auto-property:

```csharp
public string Name { get; set; }
```

It looks like a field but can later get extra rules. `get` reads the value, `set` changes it. Make the setter private (`{ get; private set; }`) when only the class itself should change the value.

## Constructors

A **constructor** is a special method that runs when an object is created. It has the **same name as the class** and **no return type**. Use it to set up the object so it is never half-built:

```csharp
class Dog
{
    public string Name { get; set; }
    public int Age { get; set; }

    public Dog(string name, int age)
    {
        Name = name;
        Age = age;
    }
}

Dog d = new Dog("Rex", 3);   // Name and Age are set right away
```

## Methods that change the object

Methods inside a class can read and change that object's own properties. Each object has its own values, so `a.Age++` does not affect `b`.

Think of a class as answering two questions: "what does it know?" (properties) and "what can it do?" (methods).

## Access: public and private

`public` members can be used from outside the class. `private` ones (the default) are for the class's own use. Hiding details keeps the rest of the program from putting an object into an invalid state.

> **Watch out:**
> - Forgetting `new`: `Dog d; d.Bark();` gives `error CS0165: Use of unassigned local variable 'd'`.
> - Forgetting `public` on a member you use from another class gives `error CS0122: 'Player.TakeDamage(int)' is inaccessible due to its protection level`.
> - Calling a constructor with the wrong arguments, such as `new Player("Hero")`, gives `error CS1729: 'Player' does not contain a constructor that takes 1 arguments`.
> - Giving a constructor a return type (`public void Player(...)`) turns it into an ordinary method, and the real constructor is missing.
> - Inside a constructor, `name = name;` just assigns the parameter to itself. The property is `Name` with a capital N, the parameter is `name`.

## Going further

Add a `Heal(int amount)` method that raises `Health`, but not above 100. Create two players and check that damaging one does not change the other.

> **Your turn:** complete the `Player` class. Add a constructor `Player(string name, int health)`, a method `TakeDamage(int amount)` that lowers health but never below 0, and a method `IsAlive()` that returns `true` while health is above 0.
