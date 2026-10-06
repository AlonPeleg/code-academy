---
title: Interfaces and dependency injection
summary: Program against contracts, swap implementations, and pass dependencies in through the constructor.
level: advanced
runner: remote
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      // 1. Write an interface ISender with one method:  void Send(string message);

      // 2. Write class ConsoleSender : ISender. Send prints "[console] " + message.

      // 3. Write class RecordingSender : ISender. It stores every message in a
      //    List<string> and has a property Count (the number of messages stored)
      //    and a method Last() that returns the most recent message.

      // 4. Write class Notifier. Its constructor takes an ISender and keeps it
      //    (this is "constructor injection"). Its method Welcome(string user)
      //    sends the message "Welcome, " + user.
      //    Notifier must NOT mention ConsoleSender or RecordingSender.

      class Program
      {
          static void Main()
          {
              Notifier loud = new Notifier(new ConsoleSender());
              loud.Welcome("Ava");
              loud.Welcome("Noam");

              RecordingSender recorder = new RecordingSender();
              Notifier quiet = new Notifier(recorder);
              quiet.Welcome("Maya");
              Console.WriteLine("recorded: " + recorder.Count);
              Console.WriteLine("last: " + recorder.Last());
          }
      }
check:
  output: |
    [console] Welcome, Ava
    [console] Welcome, Noam
    recorded: 1
    last: Welcome, Maya
  code:
    - { pattern: 'interface\s+ISender', message: "Declare interface ISender." }
    - { pattern: 'class\s+ConsoleSender\s*:\s*ISender', message: "ConsoleSender must implement ISender." }
    - { pattern: 'class\s+RecordingSender\s*:\s*ISender', message: "RecordingSender must implement ISender." }
    - { pattern: 'Notifier\s*\(\s*ISender\s+\w+\s*\)', message: "The Notifier constructor must take an ISender." }
hints:
  - "An interface lists method signatures with no bodies. A class that writes : ISender must provide every method. Notifier depends only on the interface, so any sender can be plugged in."
  - "interface ISender { void Send(string message); }   class ConsoleSender : ISender { public void Send(string message) { Console.WriteLine(\"[console] \" + message); } }   RecordingSender keeps a List<string> and adds to it in Send. Notifier has a private ISender field set in its constructor."
  - "class Notifier { private ISender sender; public Notifier(ISender sender) { this.sender = sender; } public void Welcome(string user) { sender.Send(\"Welcome, \" + user); } }   class RecordingSender : ISender { private List<string> messages = new List<string>(); public void Send(string message) { messages.Add(message); } public int Count { get { return messages.Count; } } public string Last() { return messages[messages.Count - 1]; } }"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      interface ISender
      {
          void Send(string message);
      }

      class ConsoleSender : ISender
      {
          public void Send(string message)
          {
              Console.WriteLine("[console] " + message);
          }
      }

      class RecordingSender : ISender
      {
          private List<string> messages = new List<string>();

          public void Send(string message)
          {
              messages.Add(message);
          }

          public int Count
          {
              get { return messages.Count; }
          }

          public string Last()
          {
              return messages[messages.Count - 1];
          }
      }

      class Notifier
      {
          private ISender sender;

          public Notifier(ISender sender)
          {
              this.sender = sender;
          }

          public void Welcome(string user)
          {
              sender.Send("Welcome, " + user);
          }
      }

      class Program
      {
          static void Main()
          {
              Notifier loud = new Notifier(new ConsoleSender());
              loud.Welcome("Ava");
              loud.Welcome("Noam");

              RecordingSender recorder = new RecordingSender();
              Notifier quiet = new Notifier(recorder);
              quiet.Welcome("Maya");
              Console.WriteLine("recorded: " + recorder.Count);
              Console.WriteLine("last: " + recorder.Last());
          }
      }
quiz:
  - q: What does an interface contain?
    options: ["Only method signatures (a contract) that implementing classes must provide", "Complete working methods with fields", "Constructors"]
    answer: 0
  - q: What is "constructor injection"?
    options: ["The class creates its own helpers with new inside its methods", "A class receives the objects it depends on as constructor parameters instead of creating them", "Calling the constructor twice"]
    answer: 1
  - q: Why is it useful that Notifier only knows ISender?
    options: ["The program starts faster", "It must be a static class", "You can swap in a different sender (for example a fake one for testing) without changing Notifier"]
    answer: 2
  - q: Which of these can an abstract class do that an interface (in this older C# style) cannot?
    options: ["Contain fields and ready-made method bodies that subclasses inherit", "Be used as a parameter type", "Be implemented by several classes"]
    answer: 0
---

As programs grow, classes start to depend on each other: a `Notifier` needs something to send messages with, an `OrderService` needs a database. If `Notifier` creates its own `ConsoleSender` inside its code, it is **glued** to it. You can't test it without printing to the console, and switching to email means editing `Notifier`. The professional answer is to depend on a **contract** (an interface) and to have the needed object **handed in** from outside. This is called dependency injection, and you can do it by hand with nothing more than constructors.

## Interfaces

An **interface** is a list of members that a class promises to provide. By convention its name starts with `I`.

```csharp
interface IAnimal
{
    string Name { get; }
    string Speak();
}

class Dog : IAnimal
{
    public string Name { get { return "Rex"; } }
    public string Speak() { return "Woof"; }
}
```

`class Dog : IAnimal` says "Dog fulfils the contract". The compiler then requires **every** member of the interface, as `public`. A class may implement many interfaces (`class A : IFoo, IBar`), unlike inheritance from classes, where you get only one parent.

A variable can have the interface as its type and hold any implementing object:

```csharp
IAnimal a = new Dog();
Console.WriteLine(a.Speak());     // prints: Woof
```

## Abstract classes

An **abstract class** sits between an interface and a normal class. It cannot be created directly (`new Shape()` is an error), may contain fields and ready-made methods, and may declare `abstract` methods that subclasses must override:

```csharp
abstract class Shape
{
    public abstract double Area();                  // no body, must be overridden
    public string Describe() { return "area " + Area(); }  // shared code
}

class Square : Shape
{
    private double side;
    public Square(double side) { this.side = side; }
    public override double Area() { return side * side; }
}
```

Rule of thumb: use an **interface** for a capability that unrelated classes can have ("can send", "can be compared"). Use an **abstract class** when related classes share real code and state.

## Dependency injection by hand

Compare two designs:

```csharp
// Tightly coupled: Notifier decides which sender to use
class Notifier
{
    private ConsoleSender sender = new ConsoleSender();
    public void Welcome(string user) { sender.Send("Welcome, " + user); }
}

// Loosely coupled: the sender is injected through the constructor
class Notifier
{
    private ISender sender;
    public Notifier(ISender sender) { this.sender = sender; }
    public void Welcome(string user) { sender.Send("Welcome, " + user); }
}
```

In the second version `Notifier` only knows the interface `ISender`. The code that builds the program (here `Main`, often called the **composition root**) decides which implementation to use: `new Notifier(new ConsoleSender())` today, an email sender tomorrow. No change to `Notifier` is needed.

## Why testing loves this

A test can inject a **fake**, such as `RecordingSender`, which just stores messages in a list. The test then checks the list instead of looking at the console or sending a real email. Large frameworks such as ASP.NET Core have a built-in "container" that creates the objects and injects them automatically, but they do exactly what you do by hand here.

> **Watch out:**
> - Forgetting `public` on the implementing method: `error CS0535: 'ConsoleSender' does not implement interface member 'ISender.Send(string)'` (members implementing an interface must be public).
> - Creating an interface instance: `ISender s = new ISender();` gives `error CS0144: Cannot create an instance of the abstract class or interface 'ISender'`.
> - Passing `null` as the dependency: the first call to `sender.Send` throws `NullReferenceException`. Check in the constructor if needed.
> - Leaking the concrete type: if `Notifier` has a field of type `ConsoleSender`, the benefit is gone. The field and constructor parameter must be the interface.
> - Overriding without `override` in an abstract class: `error CS0534: 'Square' does not implement inherited abstract member 'Shape.Area()'`.

## Going further

Add a second dependency, such as a clock interface `IClock` with `string Now()`, so tests can use a fixed time instead of the real one.

> **Your turn:** declare `ISender`, the two implementations `ConsoleSender` and `RecordingSender`, and `Notifier` with constructor injection. `Notifier` may only know the `ISender` interface.
