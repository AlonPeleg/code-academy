---
title: Reading input
summary: Read lines of text from the user with Console.ReadLine and turn them into numbers.
level: beginner
runner: remote
stdin: |
  Maya
  7
  5
files:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              // The "Input" box feeds this program three lines:  Maya, 7 and 5.
              // 1. Read the first line into a string called name.
              // 2. Read the next two lines and convert each to an int (call them a and b).
              // 3. Print:  Hello, Maya!
              // 4. Print:  7 + 5 = 12
              // 5. Print:  Product: 35
          }
      }
check:
  output: |
    Hello, Maya!
    7 + 5 = 12
    Product: 35
  code:
    - { pattern: 'Console\s*\.\s*ReadLine\s*\(', message: "Read the input with Console.ReadLine()." }
    - { pattern: 'int\s*\.\s*Parse\s*\(|Convert\s*\.\s*ToInt32\s*\(', message: "Convert the text to a number with int.Parse." }
hints:
  - "Console.ReadLine() waits for one line of input and gives it back as a string. Call it three times, once per line."
  - "Text is not a number yet. Wrap the line with int.Parse(...) to turn \"7\" into 7:  int a = int.Parse(Console.ReadLine());"
  - "string name = Console.ReadLine();  int a = int.Parse(Console.ReadLine());  int b = int.Parse(Console.ReadLine());  then print $\"Hello, {name}!\", $\"{a} + {b} = {a + b}\" and $\"Product: {a * b}\"."
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              string name = Console.ReadLine();
              int a = int.Parse(Console.ReadLine());
              int b = int.Parse(Console.ReadLine());

              Console.WriteLine($"Hello, {name}!");
              Console.WriteLine($"{a} + {b} = {a + b}");
              Console.WriteLine($"Product: {a * b}");
          }
      }
quiz:
  - q: What type does Console.ReadLine() give back?
    options: ["int", "char", "string", "double"]
    answer: 2
  - q: 'How do you turn the text "42" into the number 42?'
    options: ["int.Parse(\"42\")", "string(42)", "\"42\".ToNumber", "(int) \"42\""]
    answer: 0
  - q: "What does Console.ReadLine() return when there is no more input?"
    options: ["An empty string", "The number 0", "null", "It prints an error and continues"]
    answer: 2
    explain: "At the end of the input ReadLine returns null, which is how you can detect that nothing is left."
  - q: 'What happens with int.Parse("abc")?'
    options: ["It returns 0", "It throws a FormatException", "It returns -1", "It returns the text unchanged"]
    answer: 1
---

So far every value in your programs was written into the code. Real programs ask questions and react to the answers. This lesson shows how to read what the user types, and how to turn text into numbers you can calculate with.

## Console.ReadLine

`Console.ReadLine()` pauses the program, waits for one line of input, and gives that line back as a **string**:

```csharp
Console.WriteLine("What is your name?");
string name = Console.ReadLine();
Console.WriteLine($"Nice to meet you, {name}!");
```

Here on the website there is no keyboard to type on while the program runs. Instead, the **Input** box under the editor holds the lines the program will read. Each call to `ReadLine()` takes the next line from that box. In this lesson it contains:

```text
Maya
7
5
```

So the first `ReadLine()` returns `"Maya"`, the second `"7"` and the third `"5"`. Change the Input box and run again to try other values.

## Text is not a number

Everything from `ReadLine` is text. The string `"7"` and the number `7` are different things, and `"7" + "5"` is `"75"`, not 12. To calculate, convert first:

```csharp
int a = int.Parse("7");           // the number 7
double d = double.Parse("2.5");   // the number 2.5
```

Usually you combine both steps on one line:

```csharp
int age = int.Parse(Console.ReadLine());
Console.WriteLine($"Next year you will be {age + 1}");
```

Work from the inside out: `Console.ReadLine()` runs first and returns text, then `int.Parse(...)` turns that text into an `int`.

## When there is no input

If the input has run out, `ReadLine()` returns `null` (meaning "nothing"). You can use that to read a whole list of lines:

```csharp
string line = Console.ReadLine();
while (line != null)
{
    Console.WriteLine("Got: " + line);
    line = Console.ReadLine();
}
```

## Safer parsing

`int.TryParse` does not crash on bad input. It returns `true` or `false` and hands the number back through `out`:

```csharp
int number;
if (int.TryParse("abc", out number))
{
    Console.WriteLine(number);
}
else
{
    Console.WriteLine("Not a number");
}
```

> **Watch out:**
> - `int.Parse("abc")` crashes with `System.FormatException: Input string was not in a correct format.` The same happens for an empty line or text like `3.5` parsed as an `int`.
> - If the Input box has fewer lines than your program reads, `ReadLine()` returns `null`, and `int.Parse(null)` crashes with `ArgumentNullException`.
> - Trying `int a = Console.ReadLine();` gives `error CS0029: Cannot implicitly convert type 'string' to 'int'`.
> - Reading lines in a different order than they appear in the Input box mixes up the values (a name ends up where a number was expected).

> **Your turn:** read the name and the two numbers from the input, then print `Hello, Maya!`, `7 + 5 = 12`, and `Product: 35`, calculating the values from the variables.
