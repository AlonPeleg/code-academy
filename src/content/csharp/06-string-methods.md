---
title: String methods and formatting
summary: Clean, search and format text with the built-in string methods.
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
              string text = "  hello, world  ";
              double price = 4.5;

              // 1. Make trimmed: text with the spaces at both ends removed.
              //    Print:  Trimmed: hello, world
              // 2. Print:  Upper: HELLO, WORLD   (trimmed in capitals)
              // 3. Print:  Length: 12            (the number of characters of trimmed)
              // 4. Print:  Replaced: hello, there   (swap "world" for "there")
              // 5. Print:  Price: $4.50   (show price with exactly 2 decimals)
          }
      }
check:
  output: |
    Trimmed: hello, world
    Upper: HELLO, WORLD
    Length: 12
    Replaced: hello, there
    Price: $4.50
  code:
    - { pattern: '\.Trim\s*\(\s*\)', message: "Use the Trim() method." }
    - { pattern: '\.ToUpper\s*\(\s*\)', message: "Use the ToUpper() method." }
    - { pattern: '\.Replace\s*\(', message: "Use the Replace method." }
    - { pattern: ':\s*[Ff]2\s*\}', message: "Format the price with :F2 inside the braces." }
hints:
  - "Strings have methods you call with a dot, like text.Trim(). Strings are never changed in place, so store the result in a new variable."
  - "string trimmed = text.Trim();   then use trimmed.ToUpper(), trimmed.Length (no parentheses) and trimmed.Replace(\"world\", \"there\"). For the price put :F2 after the variable name inside the braces."
  - "string trimmed = text.Trim();   then print {trimmed}, {trimmed.ToUpper()} and {trimmed.Length} inside interpolated strings;   string replaced = trimmed.Replace(\"world\", \"there\");   and for the price use $\"Price: ${price:F2}\""
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              string text = "  hello, world  ";
              double price = 4.5;

              string trimmed = text.Trim();
              Console.WriteLine($"Trimmed: {trimmed}");
              Console.WriteLine($"Upper: {trimmed.ToUpper()}");
              Console.WriteLine($"Length: {trimmed.Length}");
              string replaced = trimmed.Replace("world", "there");
              Console.WriteLine($"Replaced: {replaced}");
              Console.WriteLine($"Price: ${price:F2}");
          }
      }
quiz:
  - q: What does  "abc".ToUpper()  return?
    options: ["\"abc\" (the original string is changed)", "\"Abc\"", "An error", "\"ABC\""]
    answer: 3
  - q: How do you get the number of characters in a string s?
    options: ["s.Length", "s.Count()", "s.Size", "length(s)"]
    answer: 0
  - q: What does  "a-b-c".Split('-')  give you?
    options: ["The text \"abc\"", "The number 3", "An array with \"a\", \"b\" and \"c\"", "A single string with spaces"]
    answer: 2
  - q: What does  $"{3.14159:F2}"  produce?
    options: ["3", "3.14159", "3.1", "3.14"]
    answer: 3
    explain: "F2 means fixed-point with 2 digits after the decimal point, so the value is rounded to 3.14."
---

Text is everywhere in programs: names, messages, file contents. A C# `string` comes with many ready-made **methods** (actions you call with a dot) for cleaning, searching and formatting it. In this lesson you will learn the ones you will use most.

## Calling methods on a string

```csharp
string s = "  Code Academy  ";
Console.WriteLine(s.Trim());      // "Code Academy"  (spaces removed from both ends)
Console.WriteLine(s.ToUpper());   // "  CODE ACADEMY  "
Console.WriteLine(s.ToLower());   // "  code academy  "
Console.WriteLine(s.Length);      // 16  (property, no parentheses)
```

The most important fact: **strings are immutable**, which means a method never changes the original. It gives you a **new** string. If you want to keep the result, store it:

```csharp
s = s.Trim();            // now s itself holds the trimmed text
```

## Searching and slicing

```csharp
string word = "banana";
Console.WriteLine(word.Contains("nan"));       // True
Console.WriteLine(word.StartsWith("ba"));      // True
Console.WriteLine(word.IndexOf("n"));          // 2  (position of the first match, -1 if none)
Console.WriteLine(word.Substring(1, 3));       // "ana"  (start at 1, take 3 characters)
Console.WriteLine(word.Replace("a", "o"));     // "bonono"
Console.WriteLine(word[0]);                    // b  (a single char; first position is 0)
```

## Split and Join

`Split` cuts a string into an array of pieces, and `string.Join` glues pieces back together:

```csharp
string line = "red,green,blue";
string[] colors = line.Split(',');
Console.WriteLine(colors.Length);              // 3
Console.WriteLine(colors[1]);                  // green
Console.WriteLine(string.Join(" | ", colors)); // red | green | blue
```

## Formatting numbers inside strings

Inside an interpolated string you can add a **format** after a colon:

```csharp
double price = 4.5;
int n = 42;
Console.WriteLine($"{price:F2}");      // 4.50   (2 decimals)
Console.WriteLine($"{n,5}");           // "   42" (right-aligned in 5 characters)
Console.WriteLine($"{n,-5}|");         // "42   |" (left-aligned)
Console.WriteLine($"Cost: ${price:F2}"); // Cost: $4.50
```

`F2` means "fixed point, 2 decimals". A `$` that sits outside the braces is just an ordinary dollar sign. Calling methods inside the braces also works: `{name.ToUpper()}`.

If you need a double quote inside a string, escape it with a backslash: `"She said \"hi\""`. When a method call needs quotes of its own, such as `Replace("world", "there")`, it is clearer to store the result in a variable first and print the variable.

> **Watch out:**
> - Writing `s.Trim();` on its own does nothing useful, because the new string is thrown away. Write `s = s.Trim();` or store it in another variable.
> - `s.Length()` gives `error CS1955: Non-invocable member 'string.Length' cannot be used like a method`. Length has no parentheses.
> - `Substring` with a range that is too long crashes with `ArgumentOutOfRangeException`. For a 6-letter word, `Substring(4, 5)` is too long.
> - Comparing with `==` is case-sensitive: `"Hi" == "hi"` is `false`. Use `a.ToLower() == b.ToLower()` for a case-insensitive check.
> - Single quotes make a `char`, double quotes make a `string`. `'ab'` is an error.

> **Your turn:** following the comments, create `trimmed` with `Trim()`, then print its uppercase version, its length, a version where `world` is replaced by `there`, and the price formatted with `F2`.
