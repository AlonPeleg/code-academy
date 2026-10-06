---
title: Hello, C#
summary: Write, compile and run your first C# program.
level: beginner
runner: remote
files:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              // 1. Print the text: Hello, C#!
              //    (put your line between the curly braces of Main)
          }
      }
check:
  output: Hello, C#!
  code:
    - { pattern: 'Console\s*\.\s*WriteLine\s*\(', message: "Use Console.WriteLine(...) to print." }
hints:
  - "Printing is done by something called Console. Look at the example in the lesson body and find the line that prints text."
  - "Use Console.WriteLine( ... ) and put your text between double quotes inside the parentheses. Do not forget the semicolon at the end."
  - "Write exactly this inside Main:  Console.WriteLine(\"Hello, C#!\");"
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              Console.WriteLine("Hello, C#!");
          }
      }
quiz:
  - q: Which line prints a line of text in C#?
    options: ["print(\"Hi\")", "cout << \"Hi\";", "Console.WriteLine(\"Hi\");", "echo \"Hi\""]
    answer: 2
    explain: "Console.WriteLine writes the text and then moves to a new line."
  - q: What is Main?
    options: ["A variable that stores text", "The method where the program starts running", "A comment", "A kind of loop"]
    answer: 1
  - q: What does  using System;  do?
    options: ["Shuts the computer down", "Imports a CSS file", "Runs the program twice", "Lets you write Console instead of System.Console"]
    answer: 3
  - q: What must almost every C# statement end with?
    options: ["A semicolon ;", "A period .", "A colon :", "Nothing, a new line is enough"]
    answer: 0
---

**C#** (say "C sharp") is a modern, typed language from Microsoft. It is used for web back-ends, desktop apps, and game development (Unity). In this first lesson you will write the smallest useful C# program and learn what every line of it means.

C# is a **compiled** language. When you press **Run**, your code is sent to a server that translates ("compiles") it into a program, runs it, and sends the printed text back to you. If you made a typo, you get a compiler error instead of output, and that is perfectly normal while learning.

## The shape of a C# program

```csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello!");
    }
}
```

Let us go through it piece by piece.

- `using System;` is an **import**. The `System` namespace contains useful built-in things such as `Console`. Without this line you would have to write `System.Console.WriteLine(...)` every time.
- `class Program { ... }` is a **class**, a container for code. In C# all code lives inside classes. The name `Program` is just a convention.
- `static void Main()` is a **method** (a named block of code). `Main` is special: it is where your program **starts**. `static` means it can run without creating an object first, and `void` means it does not give a value back. For now, treat this line as a fixed ritual.
- `{ }` curly braces mark where a block begins and ends. Every `{` needs a matching `}`.
- `Console.WriteLine("Hello!");` prints text and then moves to the next line. The text goes in **double quotes**. Each statement ends with a **semicolon** `;`.

## Write vs. WriteLine

`Console.WriteLine` prints and then adds a newline. `Console.Write` prints without the newline, so the next output continues on the same line:

```csharp
Console.Write("Hello, ");
Console.Write("world");
Console.WriteLine("!");
// prints: Hello, world!
```

## Comments

Anything after `//` on a line is a **comment**. The compiler ignores it. Use comments to leave notes for humans:

```csharp
// This line is ignored by the computer
Console.WriteLine("Hi"); // so is this part
```

## Case matters

C# is **case-sensitive**: `Console` and `console` are different names. Methods and classes in C# conventionally start with a capital letter (`WriteLine`, `Main`).

> **Watch out:**
> - Forgetting the semicolon gives `error CS1002: ; expected`. Look at the line just before the one the error points to.
> - Writing `console.writeline(...)` in lowercase gives `error CS0103: The name 'console' does not exist in the current context`.
> - Using single quotes `'Hello'` for text. In C# single quotes are for one character only (`'a'`); text needs double quotes `"Hello"`.
> - Forgetting `using System;` gives `error CS0103: The name 'Console' does not exist in the current context`.

## Going further

Try adding a second `Console.WriteLine` line with your own name. Lines run top to bottom, in the order you wrote them.

> **Your turn:** inside `Main`, print exactly `Hello, C#!` using `Console.WriteLine`.
