---
title: Exceptions with try and catch
summary: Handle errors gracefully instead of letting your program crash.
level: intermediate
runner: remote
files:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              string[] inputs = { "10", "abc", "25" };
              int total = 0;

              foreach (string text in inputs)
              {
                  // 1. Wrap the next two lines in a try block, because int.Parse
                  //    throws a FormatException when the text is not a number.
                  int value = int.Parse(text);
                  total += value;

                  // 2. Add a catch block for FormatException that prints:  Bad number: abc
                  //    (use the text variable so it works for any bad input)
              }

              Console.WriteLine($"Total: {total}");
          }
      }
check:
  output: |
    Bad number: abc
    Total: 35
  code:
    - { pattern: '\btry\s*\{', message: "Wrap the parsing in a try { ... } block." }
    - { pattern: 'catch\s*\(\s*FormatException', message: "Add catch (FormatException ...) { ... }." }
hints:
  - "An exception is an error the program can recover from. Code that might fail goes in a try block, and the recovery code goes in a catch block right after it."
  - "try { int value = int.Parse(text); total += value; } catch (FormatException) { ... }. Remember that the text variable is still available inside the catch block."
  - "try { int value = int.Parse(text); total += value; } catch (FormatException) { Console.WriteLine($\"Bad number: {text}\"); }"
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              string[] inputs = { "10", "abc", "25" };
              int total = 0;

              foreach (string text in inputs)
              {
                  try
                  {
                      int value = int.Parse(text);
                      total += value;
                  }
                  catch (FormatException)
                  {
                      Console.WriteLine($"Bad number: {text}");
                  }
              }

              Console.WriteLine($"Total: {total}");
          }
      }
quiz:
  - q: Which block contains the code that might fail?
    options: ["catch", "finally", "throw", "try"]
    answer: 3
  - q: When does a finally block run?
    options: ["Only when an exception happened", "Only when nothing went wrong", "Always, whether or not there was an exception", "Never, it is only a comment"]
    answer: 2
  - q: Which line makes your own exception?
    options: ["throw new Exception(\"Something is wrong\");", "raise Exception(\"...\")", "error(\"...\");", "catch Exception(\"...\");"]
    answer: 0
  - q: What happens to an exception that no catch block handles?
    options: ["It is silently ignored", "The program crashes with an error message", "The program restarts", "The exception becomes a warning"]
    answer: 1
---

Things go wrong while programs run: a user types letters where a number is expected, a file is missing, you divide by zero. When that happens C# creates an **exception**, which is an object describing the problem. If nothing deals with it, the program **crashes**. With `try` and `catch` you can deal with it and keep going.

## Seeing a crash

```csharp
int n = int.Parse("hello");
Console.WriteLine("This line never runs");
```

This stops with `System.FormatException: Input string was not in a correct format.` The second line is never reached.

## try and catch

Put the risky code in a `try` block. If an exception happens inside it, C# jumps straight to the matching `catch` block:

```csharp
try
{
    int n = int.Parse("hello");
    Console.WriteLine("Parsed " + n);   // skipped, the line above threw
}
catch (FormatException)
{
    Console.WriteLine("That was not a number");
}
Console.WriteLine("Program continues");
// prints: That was not a number
//         Program continues
```

After the `catch` block ends, the program carries on normally. Lines inside `try` after the failing one are skipped.

## Catching the details

You can name the exception to read its message:

```csharp
try
{
    int zero = 0;
    Console.WriteLine(10 / zero);
}
catch (DivideByZeroException ex)
{
    Console.WriteLine("Problem: " + ex.Message);
}
```

Use several `catch` blocks to react differently to different problems. Put specific types first. The general type `Exception` catches everything, so keep it last, if you use it at all.

## finally

A `finally` block runs **no matter what**, even after an exception. It is the place for clean-up:

```csharp
try
{
    Console.WriteLine("working");
}
catch (Exception)
{
    Console.WriteLine("failed");
}
finally
{
    Console.WriteLine("always runs");
}
```

## Throwing your own

You can raise an exception yourself when a method gets something it cannot accept:

```csharp
static int Half(int n)
{
    if (n % 2 != 0)
    {
        throw new ArgumentException("n must be even");
    }
    return n / 2;
}
```

## Exceptions vs. checks

Do not use exceptions for things you can simply check. `int.TryParse` or an `if` is better than `try`/`catch` when bad input is expected. Exceptions are for truly unexpected problems.

> **Watch out:**
> - An empty catch block (`catch { }`) hides every problem and makes bugs very hard to find. At least print a message.
> - Putting `catch (Exception)` before a more specific catch gives `error CS0160: A previous catch clause already catches all exceptions of this or a super type`.
> - A variable declared inside `try { }` is not visible in `catch` or after the block (`error CS0103: The name 'value' does not exist in the current context`). Declare it before the `try` if you need it later.
> - Writing `try` without a `catch` or `finally` gives `error CS1524: Unexpected symbol '}', expecting 'catch' or 'finally'`.

> **Your turn:** wrap the parsing in `try`, and add `catch (FormatException)` that prints `Bad number: abc` (using the `text` variable). The final total should be `35`.
