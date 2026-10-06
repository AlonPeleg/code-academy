---
title: Inheritance and interfaces
summary: Reuse a class with inheritance, change behavior with virtual and override, and meet interfaces.
level: intermediate
runner: remote
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Animal
      {
          public virtual string Speak()
          {
              return "Some sound";
          }
      }

      // 1. Make Dog inherit from Animal and change Speak so it returns "Woof".
      class Dog : Animal
      {
      }

      // 2. Make Cat inherit from Animal and change Speak so it returns "Meow".
      class Cat : Animal
      {
      }

      class Program
      {
          static void Main()
          {
              List<Animal> animals = new List<Animal>();
              animals.Add(new Animal());
              animals.Add(new Dog());
              animals.Add(new Cat());

              foreach (Animal a in animals)
              {
                  Console.WriteLine(a.Speak());
              }
          }
      }
check:
  output: |
    Some sound
    Woof
    Meow
  code:
    - { pattern: 'override\s+string\s+Speak\s*\(\s*\)[\s\S]*override\s+string\s+Speak\s*\(\s*\)', message: "Both Dog and Cat need their own  public override string Speak()." }
hints:
  - "Dog and Cat already inherit from Animal (the colon in class Dog : Animal). To replace the behavior of a virtual method, the child class declares it again with the override keyword."
  - "Inside class Dog add a method with the same signature as Animal's:  public override string Speak() { ... }  and return the right text. Do the same inside Cat."
  - "In Dog:  public override string Speak() { return \"Woof\"; }   In Cat:  public override string Speak() { return \"Meow\"; }"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Animal
      {
          public virtual string Speak()
          {
              return "Some sound";
          }
      }

      class Dog : Animal
      {
          public override string Speak()
          {
              return "Woof";
          }
      }

      class Cat : Animal
      {
          public override string Speak()
          {
              return "Meow";
          }
      }

      class Program
      {
          static void Main()
          {
              List<Animal> animals = new List<Animal>();
              animals.Add(new Animal());
              animals.Add(new Dog());
              animals.Add(new Cat());

              foreach (Animal a in animals)
              {
                  Console.WriteLine(a.Speak());
              }
          }
      }
quiz:
  - q: How do you say that Dog inherits from Animal?
    options: ["class Dog extends Animal", "class Dog inherits Animal", "class Dog -> Animal", "class Dog : Animal"]
    answer: 3
  - q: Which keywords let a child class replace a parent method?
    options: ["virtual in the parent, override in the child", "new in the parent, replace in the child", "static in both", "abstract in the child only"]
    answer: 0
  - q: What does an interface contain?
    options: ["Ready-made code that every class must use", "Only the names and signatures of members a class promises to provide", "Private fields", "The Main method"]
    answer: 1
  - q: A variable of type Animal holds a Dog object, and you call Speak(). Which version runs?
    options: ["Animal's version always", "Neither, it is an error", "Both versions, one after the other", "Dog's version, because of override"]
    answer: 3
    explain: "This is polymorphism: the method that runs depends on the real type of the object, not the type of the variable."
---

Often several things share most of their behavior and differ in details: a dog and a cat are both animals, but they make different sounds. **Inheritance** lets one class build on another so you do not repeat yourself, and **polymorphism** lets you treat different kinds of objects in the same way.

## Inheriting from a class

Write a colon and the parent class name after the child class:

```csharp
class Animal
{
    public string Name { get; set; }

    public void Eat()
    {
        Console.WriteLine($"{Name} eats");
    }
}

class Dog : Animal
{
    public void Fetch()
    {
        Console.WriteLine($"{Name} fetches the ball");
    }
}
```

`Dog` automatically has `Name` and `Eat()` from `Animal`, plus its own `Fetch()`. `Animal` is the **base class** (parent), `Dog` the **derived class** (child). Every `Dog` **is an** `Animal`.

## virtual and override

A child can change what an inherited method does. The parent marks the method `virtual` ("may be replaced"), and the child uses `override`:

```csharp
class Animal
{
    public virtual string Speak() { return "Some sound"; }
}

class Dog : Animal
{
    public override string Speak() { return "Woof"; }
}
```

The signature must match exactly (same name, parameters and return type). A child can still reach the parent's version with `base.Speak()`, which is handy for adding to the old behavior instead of replacing it.

## Polymorphism

Because a `Dog` is an `Animal`, a variable of type `Animal` can hold a `Dog`. When you call a virtual method, C# runs the version that belongs to the **real object**:

```csharp
Animal a = new Dog();
Console.WriteLine(a.Speak());   // Woof, not "Some sound"
```

That is why one `foreach` over a `List<Animal>` can make every animal speak in its own way, without any `if` that asks "what kind are you?".

## Constructors and base

A child constructor can pass values up to the parent's constructor with `: base(...)`:

```csharp
class Dog : Animal
{
    public Dog(string name) : base(name) { }
}
```

## Interfaces

An **interface** is a promise: it lists members (without code) that any class using it must provide. By convention its name starts with `I`:

```csharp
interface IShape
{
    double Area();
}

class Square : IShape
{
    public double Side;
    public double Area() { return Side * Side; }
}
```

A class can inherit from only **one** base class but implement **many** interfaces. Use an interface when unrelated classes must share an ability ("can be drawn", "can be compared").

> **Watch out:**
> - Overriding a method that is not `virtual` gives `error CS0506: 'Dog.Speak()': cannot override inherited member 'Animal.Speak()' because it is not marked virtual, abstract, or override`.
> - Forgetting `override` in the child hides the parent method instead of replacing it, with `warning CS0114`. The parent version then runs through an `Animal` variable.
> - A class that implements an interface but misses a member gives `error CS0535: 'Square' does not implement interface member 'IShape.Area()'`.
> - A child constructor fails with `error CS1729: ... does not contain a constructor that takes 0 arguments` if the parent has no parameterless constructor and the child does not call `: base(...)`.

> **Your turn:** make `Dog.Speak()` return `Woof` and `Cat.Speak()` return `Meow` by overriding the parent's method in both classes. `Main` then prints `Some sound`, `Woof`, `Meow`.
