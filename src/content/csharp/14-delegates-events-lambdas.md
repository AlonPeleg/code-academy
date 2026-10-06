---
title: Delegates, events and lambdas
summary: Pass methods around as values and let objects announce that something happened.
level: advanced
runner: remote
files:
  - name: Program.cs
    code: |
      using System;

      // 1. Declare a delegate type  Operation  for methods that take two ints
      //    and return an int.
      //    delegate int Operation(int a, int b);

      // 2. Write a class Button with
      //      - a public event of type Action<string> called Clicked
      //      - a public method Click(string name) that raises the event if
      //        anybody subscribed:  Clicked?.Invoke(name);

      class Program
      {
          // 3. Write a static method Apply(Operation op, int a, int b) that
          //    calls op(a, b) and returns the result.

          static void Main()
          {
              // 4. Call Apply with a lambda for adding and one for multiplying:
              //      Console.WriteLine("add: " + Apply((a, b) => a + b, 6, 3));
              //    Print "add: 9" and "multiply: 18" (use 6 and 3 for both).

              // 5. Make a Func<int, int> called square (x => x * x), print "square: 25"
              //    by calling it with 5.

              // 6. Create a Button. Subscribe a handler that prints "Logger saw: <name>"
              //    and a second lambda handler that adds 1 to an int variable clicks.
              //    Click the button twice with the name "Save", then print
              //      Clicks counted: 2
          }
      }
check:
  output: |
    add: 9
    multiply: 18
    square: 25
    Logger saw: Save
    Logger saw: Save
    Clicks counted: 2
  code:
    - { pattern: 'delegate\s+int\s+Operation', message: "Declare the delegate: delegate int Operation(int a, int b);" }
    - { pattern: 'event\s+Action\s*<\s*string\s*>\s+Clicked', message: "Declare the event: public event Action<string> Clicked;" }
    - { pattern: '\+=', message: "Subscribe to the event with +=." }
    - { pattern: '=>', message: "Use lambda expressions (=>)." }
    - { pattern: 'Func\s*<\s*int\s*,\s*int\s*>', message: "Use Func<int, int> for square." }
hints:
  - "A delegate is a type that describes a method signature, so a variable of that type can hold any matching method or lambda. An event is a delegate field that outsiders can only subscribe to with += (not call directly)."
  - "delegate int Operation(int a, int b); static int Apply(Operation op, int a, int b) { return op(a, b); }  class Button { public event Action<string> Clicked; public void Click(string name) { Clicked?.Invoke(name); } }  Subscribe with btn.Clicked += name => Console.WriteLine(...);"
  - "Button btn = new Button(); int clicks = 0;   btn.Clicked += name => Console.WriteLine(\"Logger saw: \" + name);   btn.Clicked += name => clicks++;   btn.Click(\"Save\"); btn.Click(\"Save\");   Console.WriteLine(\"Clicks counted: \" + clicks);   Func<int, int> square = x => x * x;"
solution:
  - name: Program.cs
    code: |
      using System;

      delegate int Operation(int a, int b);

      class Button
      {
          public event Action<string> Clicked;

          public void Click(string name)
          {
              if (Clicked != null)
              {
                  Clicked.Invoke(name);
              }
          }
      }

      class Program
      {
          static int Apply(Operation op, int a, int b)
          {
              return op(a, b);
          }

          static void Main()
          {
              Console.WriteLine("add: " + Apply((a, b) => a + b, 6, 3));
              Console.WriteLine("multiply: " + Apply((a, b) => a * b, 6, 3));

              Func<int, int> square = x => x * x;
              Console.WriteLine("square: " + square(5));

              Button btn = new Button();
              int clicks = 0;
              btn.Clicked += name => Console.WriteLine("Logger saw: " + name);
              btn.Clicked += name => clicks++;
              btn.Click("Save");
              btn.Click("Save");
              Console.WriteLine("Clicks counted: " + clicks);
          }
      }
quiz:
  - q: What is a delegate?
    options: ["A kind of loop", "A type-safe reference to a method: a variable that holds a method", "A class that cannot be inherited"]
    answer: 1
  - q: What is  Func<int, int>  ?
    options: ["A delegate type for any method taking an int and returning an int", "A method that returns two ints", "A generic list of ints"]
    answer: 0
  - q: What is the difference between an event and a plain public delegate field?
    options: ["Events run faster", "Outside code can only subscribe (+=) and unsubscribe (-=) to an event, but cannot invoke it or replace all subscribers", "There is no difference"]
    answer: 1
  - q: Why write Clicked?.Invoke(name) instead of Clicked(name)?
    options: ["It makes the handler run twice", "Clicked is a method, not an event", "An event with no subscribers is null, and calling null would throw NullReferenceException"]
    answer: 2
---

So far you passed numbers and strings to methods. In C# you can also pass **behaviour**: "do this with each item", "call me back when something happens". The tools are **delegates** (a variable that holds a method), **lambdas** (a short way to write a method inline) and **events** (a safe way for an object to announce that something happened).

## Delegates

A delegate type describes a method shape: its parameters and return type.

```csharp
delegate int Operation(int a, int b);

static int Add(int a, int b) { return a + b; }

Operation op = Add;           // store the method in a variable
Console.WriteLine(op(2, 3));  // prints: 5
```

Any method with two ints in and an int out fits. You can pass such a variable to another method, which is how a method like `Apply(op, a, b)` can behave differently each time you call it.

## Func and Action: the ready-made delegates

You rarely declare your own delegate types. The framework provides generic ones:

- `Func<T1, T2, TResult>` returns a value; the **last** type is the return type. `Func<int, int>` takes an int and returns an int.
- `Action<T1, T2>` returns nothing (void). `Action<string>` takes a string.

```csharp
Func<int, int, int> add = (a, b) => a + b;
Action<string> greet = name => Console.WriteLine("Hi " + name);
greet("Ava");                  // prints: Hi Ava
```

## Lambdas

`(a, b) => a + b` is a **lambda expression**: parameters on the left, the arrow `=>` ("goes to"), the result on the right. With one parameter the brackets are optional (`x => x * x`). For several statements use braces and `return`:

```csharp
Func<int, string> describe = n =>
{
    if (n % 2 == 0) return "even";
    return "odd";
};
```

Lambdas can use local variables of the enclosing method; this is called **capturing**, and the lambda sees the current value of the variable, not a copy:

```csharp
int total = 0;
Action<int> addToTotal = n => total += n;
addToTotal(5);
addToTotal(7);
Console.WriteLine(total);     // prints: 12
```

## Events

Imagine a `Button` that should tell the rest of the program when it is clicked, without knowing who is listening. An **event** does that (the publish/subscribe or observer pattern):

```csharp
class Button
{
    public event Action<string> Clicked;

    public void Click(string name)
    {
        Clicked?.Invoke(name);    // notify every subscriber
    }
}

Button b = new Button();
b.Clicked += name => Console.WriteLine("Clicked " + name);   // subscribe
b.Click("OK");                                               // prints: Clicked OK
```

- `+=` adds a subscriber; `-=` removes one (use a named method if you plan to unsubscribe).
- Subscribers run in the order they subscribed.
- Only the class that owns the event can raise it. Outsiders cannot call `b.Clicked(...)` or erase other people's subscriptions. That is the difference to a plain public delegate field.
- When nobody subscribed the event is `null`, so use `?.Invoke(...)` (the **null-conditional** operator: do the call only if it is not null).

In real UI libraries and web frameworks nearly everything (clicks, timers, incoming messages) is an event.

> **Watch out:**
> - Calling an event with nobody subscribed using plain `Clicked(name)`: `NullReferenceException`. Use `Clicked?.Invoke(name)`.
> - Wrong lambda shape: assigning `(a, b) => a + b` to an `Action<string>` gives `error CS1593: Delegate 'Action<string>' does not take 2 arguments`.
> - Forgetting that `Func` lists the return type last: `Func<int, string>` takes an int and returns a string.
> - Raising the event from outside the class: `error CS0070: The event 'Button.Clicked' can only appear on the left hand side of += or -=`.
> - Captured variables change: a lambda created in a loop may all see the final value of a variable that is shared. Copy it into a local variable inside the loop first.

## Going further

Use lambdas with the LINQ methods you know (`numbers.Where(n => n > 3)`), or give `Button` a second event `DoubleClicked`.

> **Your turn:** complete the program as described by the numbered comments: declare the `Operation` delegate, the `Button` class with the `Clicked` event, the `Apply` method, two lambdas for `Apply`, a `square` lambda, and two handlers subscribed to the button.
