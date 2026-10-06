---
title: Methods
summary: Package code into reusable methods with parameters and return values.
level: beginner
runner: remote
files:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          // 1. Square: return n multiplied by itself
          static int Square(int n)
          {
              return 0;
          }

          // 2. Greet: return the text  Hello, NAME!  (use interpolation)
          static string Greet(string name)
          {
              return "";
          }

          // 3. IsEven: return true when number divides by 2 with no remainder
          static bool IsEven(int number)
          {
              return false;
          }

          static void Main()
          {
              Console.WriteLine($"Square: {Square(5)}");
              Console.WriteLine(Greet("Maya"));
              Console.WriteLine(IsEven(10));
              Console.WriteLine(IsEven(7));
          }
      }
check:
  output: |
    Square: 25
    Hello, Maya!
    True
    False
  code:
    - { pattern: 'n\s*\*\s*n', message: "Square should return n * n." }
    - { pattern: '%\s*2', message: "IsEven should use the remainder operator, number % 2." }
    - { pattern: '\{\s*name\s*\}', message: "Greet should use the name parameter inside the text." }
hints:
  - "Each method has a return type before its name (int, string, bool). The return statement hands a value back to whoever called the method."
  - "Square: return n * n;   Greet: return $\"Hello, {name}!\";   IsEven: a number is even when number % 2 is 0, so compare with ==."
  - "return n * n;   return $\"Hello, {name}!\";   return number % 2 == 0;"
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static int Square(int n)
          {
              return n * n;
          }

          static string Greet(string name)
          {
              return $"Hello, {name}!";
          }

          static bool IsEven(int number)
          {
              return number % 2 == 0;
          }

          static void Main()
          {
              Console.WriteLine($"Square: {Square(5)}");
              Console.WriteLine(Greet("Maya"));
              Console.WriteLine(IsEven(10));
              Console.WriteLine(IsEven(7));
          }
      }
quiz:
  - q: What does the word void mean in front of a method name?
    options: ["The method is empty", "The method returns nothing", "The method is private", "The method returns zero"]
    answer: 1
  - q: Which statement sends a value back from a method?
    options: ["send", "give", "yield break", "return"]
    answer: 3
  - q: In  static int Add(int a, int b)  what are a and b?
    options: ["Parameters, the inputs of the method", "Return values", "Classes", "Comments"]
    answer: 0
  - q: What does  Console.WriteLine(7 % 3);  print?
    options: ["2", "1", "2.33", "0"]
    answer: 1
    explain: "% gives the remainder of the division. 7 divided by 3 is 2 with 1 left over."
---

A **method** is a named block of code you can run whenever you like. So far all your code sat inside `Main`. Real programs split work into small methods so each piece has one job, a clear name, and can be reused.

## Anatomy of a method

```csharp
static int Add(int a, int b)
{
    return a + b;
}
```

- `static` for now just means "belongs to the program, no object needed". Keep it for methods you call from `Main`.
- `int` is the **return type**: the kind of value the method hands back.
- `Add` is the **name**. Use a verb and start with a capital letter.
- `(int a, int b)` are the **parameters**: the inputs, each with a type and a name.
- `return a + b;` sends the answer back and ends the method.

You **call** a method by writing its name with the values (called **arguments**) in parentheses:

```csharp
int total = Add(3, 4);
Console.WriteLine(total);      // 7
Console.WriteLine(Add(10, 5)); // 15
```

The value of `Add(3, 4)` is whatever it returns, so you can store it, print it, or even pass it into another method.

## void methods

If a method does something but has nothing to give back, its return type is `void` and it needs no `return`:

```csharp
static void SayHi(string name)
{
    Console.WriteLine($"Hi, {name}!");
}

SayHi("Noam");   // prints: Hi, Noam!
```

## Returning different types

A method can return any type:

```csharp
static string Shout(string text)
{
    return text.ToUpper() + "!";
}

static bool IsAdult(int age)
{
    return age >= 18;
}
```

`bool` values print as `True` or `False` (with a capital letter) in C#.

## Why bother?

Compare writing `n * n` ten times with writing `Square(n)`. If you find a bug, you fix it in one place. The name `IsAdult(age)` also reads better than `age >= 18` scattered through your code.

> **Watch out:**
> - Forgetting `return` in a method with a non-void type gives `error CS0161: 'Program.Add(int, int)': not all code paths return a value`.
> - Returning the wrong type, such as `return "5";` from an `int` method, gives `error CS0029: Cannot implicitly convert type 'string' to 'int'`.
> - Calling with the wrong number of arguments: `Add(1)` gives `error CS1501: No overload for method 'Add' takes 1 arguments`.
> - Calling a non-static method from the static `Main` gives `error CS0120: An object reference is required to access non-static member`. Add `static` to the method.
> - Writing `Add(3, 4);` on its own and expecting to see 7. The result is thrown away unless you store it or print it.

## Going further

Write a method `Max(int a, int b)` that returns the larger of the two using `if`. Then call it with three numbers: `Max(Max(a, b), c)`.

> **Your turn:** finish the three methods in the starter. `Square` returns `n * n`, `Greet` returns `Hello, NAME!`, and `IsEven` returns whether the number divides by 2 with no remainder. `Main` is already written; just fix the methods.
