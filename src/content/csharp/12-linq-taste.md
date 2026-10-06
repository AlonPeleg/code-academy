---
title: A taste of LINQ
summary: Filter, transform and total collections with Where, Select and Sum.
level: intermediate
runner: remote
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;
      using System.Linq;

      class Program
      {
          static void Main()
          {
              List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

              // 1. Keep only the even numbers and print them joined by ", " :
              //      Evens: 2, 4, 6, 8, 10
              // 2. Take the even numbers and square each one. Print:
              //      Squares: 4, 16, 36, 64, 100
              // 3. Add up all the numbers. Print:
              //      Sum of all: 55
              // 4. Count how many numbers are bigger than 5. Print:
              //      Bigger than 5: 5
          }
      }
check:
  output: |
    Evens: 2, 4, 6, 8, 10
    Squares: 4, 16, 36, 64, 100
    Sum of all: 55
    Bigger than 5: 5
  code:
    - { pattern: '\.Where\s*\(', message: "Use Where to filter." }
    - { pattern: '\.Select\s*\(', message: "Use Select to transform each item." }
    - { pattern: '\.Sum\s*\(', message: "Use Sum to add up the numbers." }
hints:
  - "LINQ methods work on a whole collection at once. Where keeps the items that pass a test, Select changes every item, Sum adds them up. Each one takes a small lambda such as n => n % 2 == 0."
  - "numbers.Where(n => n % 2 == 0) gives the evens. Chain .Select(n => n * n) on the end to square them. string.Join(\", \", ...) turns a sequence into text. numbers.Sum() and numbers.Where(n => n > 5).Count() do the rest."
  - "var evens = numbers.Where(n => n % 2 == 0);  Console.WriteLine(\"Evens: \" + string.Join(\", \", evens));  var squares = evens.Select(n => n * n);  Console.WriteLine(\"Squares: \" + string.Join(\", \", squares));  Console.WriteLine($\"Sum of all: {numbers.Sum()}\");  Console.WriteLine($\"Bigger than 5: {numbers.Where(n => n > 5).Count()}\");"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;
      using System.Linq;

      class Program
      {
          static void Main()
          {
              List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

              var evens = numbers.Where(n => n % 2 == 0);
              Console.WriteLine("Evens: " + string.Join(", ", evens));

              var squares = evens.Select(n => n * n);
              Console.WriteLine("Squares: " + string.Join(", ", squares));

              Console.WriteLine($"Sum of all: {numbers.Sum()}");

              int bigger = numbers.Where(n => n > 5).Count();
              Console.WriteLine($"Bigger than 5: {bigger}");
          }
      }
quiz:
  - q: What does Where do?
    options: ["Changes every item", "Adds the items up", "Sorts the items", "Keeps only the items that pass a test"]
    answer: 3
  - q: What does  numbers.Select(n => n * 2)  return for { 1, 2, 3 }?
    options: ["The sequence 2, 4, 6", "The sequence 1, 2, 3", "The number 6", "Only the numbers bigger than 2"]
    answer: 0
  - q: What is  n => n > 5  called?
    options: ["A class", "A loop", "A lambda expression, a tiny inline method", "A namespace"]
    answer: 2
  - q: Which using line do you need to use Where, Select and Sum?
    options: ["using System.Text;", "using System.Linq;", "using System.IO;", "using System.Math;"]
    answer: 1
---

Very often you have a collection and want to ask a question about it: "which ones are even?", "what is the total?", "give me every name in capitals". You can write a `foreach` loop for each of these, or you can use **LINQ** (say "link"), a set of ready-made methods that say what you want in one short line.

## Setup

LINQ lives in a namespace you must import:

```csharp
using System.Linq;
```

After that, lists, arrays and other collections get extra methods such as `Where`, `Select`, `Sum`, `Count`, `Max`, `Min` and `OrderBy`.

## Lambdas: tiny methods

Most LINQ methods take a small test or calculation written as a **lambda expression**:

```csharp
n => n * n
```

Read the arrow `=>` as "goes to": "n goes to n times n". The name before the arrow is the parameter (any name you like), and what follows is the result. A lambda is a tiny method with no name.

## Where, Select, Sum

```csharp
List<int> nums = new List<int> { 1, 2, 3, 4, 5 };

var big = nums.Where(n => n > 2);      // 3, 4, 5      (filter: keep items that pass)
var doubled = nums.Select(n => n * 2); // 2, 4, 6, 8, 10 (transform: change every item)
int total = nums.Sum();                // 15           (add them up)
int biggest = nums.Max();              // 5
int howMany = nums.Where(n => n > 2).Count();   // 3
```

- **Where** answers "which?": the lambda returns `true` or `false` for each item.
- **Select** answers "what do I get from each?": the lambda returns the new value.
- **Sum, Max, Min, Count, Average** boil everything down to one number.

## Chaining

Each method returns a sequence, so you can chain them left to right like a pipeline:

```csharp
int result = nums.Where(n => n % 2 == 1)   // 1, 3, 5
                 .Select(n => n * 10)      // 10, 30, 50
                 .Sum();                   // 90
```

## Printing a sequence

`Console.WriteLine(big)` would not print the numbers. Turn the sequence into text first with `string.Join`:

```csharp
Console.WriteLine(string.Join(", ", big));   // 3, 4, 5
```

You can also loop over it: `foreach (int n in big) { ... }`. The original list is never changed; LINQ always gives you a new result.

## Strings work too

```csharp
List<string> names = new List<string> { "ava", "noam", "maya" };
var upper = names.Select(s => s.ToUpper());
Console.WriteLine(string.Join(" ", upper));   // AVA NOAM MAYA
```

> **Watch out:**
> - Forgetting `using System.Linq;` gives `error CS1061: 'List<int>' does not contain a definition for 'Where'`.
> - Printing a sequence directly shows a type name (something like System.Linq.Enumerable and the word Iterator) instead of the values. Use `string.Join`.
> - `Sum()` and `Max()` on an empty list: `Sum()` is 0, but `Max()` crashes with `InvalidOperationException: Sequence contains no elements`.
> - `Where` needs a lambda that returns `bool`. `nums.Where(n => n * 2)` gives a compile error.
> - Mixing up the two: `Where` never changes the items, only decides which stay. `Select` never removes items, only changes them.

## Going further

Try `OrderBy(n => n)`, `Average()` and `Any(n => n > 9)` (true if at least one item passes).

> **Your turn:** with the `numbers` list, print the even numbers, the squares of those even numbers, the sum of all numbers, and how many numbers are bigger than 5. Use `Where`, `Select` and `Sum`.
