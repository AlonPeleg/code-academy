---
title: Loops and lists
summary: Repeat work with for and foreach, and store many values in a List.
level: beginner
runner: remote
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Program
      {
          static void Main()
          {
              List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };
              int sum = 0;

              // 1. Use foreach to add every number to sum
              // 2. Print: Sum: 15
              // 3. Add 6 to the list with Add, then print: Count: 6
          }
      }
check:
  output: |
    Sum: 15
    Count: 6
  code:
    - { pattern: 'foreach\s*\(', message: "Use a foreach loop to add up the numbers." }
    - { pattern: '\.\s*Add\s*\(', message: "Use numbers.Add(6) to add an item to the list." }
hints:
  - "A foreach loop visits every item of a list one at a time. Inside the loop you can add each item to sum."
  - "foreach (int n in numbers) { sum += n; }  gives you the total. A List grows with numbers.Add(...), and numbers.Count tells you how many items it holds."
  - "foreach (int n in numbers) { sum += n; }  Console.WriteLine($\"Sum: {sum}\");  numbers.Add(6);  Console.WriteLine($\"Count: {numbers.Count}\");"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Program
      {
          static void Main()
          {
              List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };
              int sum = 0;

              foreach (int n in numbers)
              {
                  sum += n;
              }
              Console.WriteLine($"Sum: {sum}");

              numbers.Add(6);
              Console.WriteLine($"Count: {numbers.Count}");
          }
      }
quiz:
  - q: How do you add an item to a List?
    options: ["list.push(item)", "list.append(item)", "list.Insert(item)", "list.Add(item)"]
    answer: 3
  - q: How do you get the number of items in a List?
    options: ["list.Count", "list.length()", "list.Size", "len(list)"]
    answer: 0
  - q: What does foreach do?
    options: ["Sorts the list", "Runs the body once for every item", "Deletes the list", "Counts the list"]
    answer: 1
  - q: How many times does  for (int i = 0; i < 3; i++)  run its body?
    options: ["2 times", "4 times", "It never stops", "3 times"]
    answer: 3
    explain: "i takes the values 0, 1 and 2. When i becomes 3 the condition i < 3 is false."
---

Computers are great at doing the same thing many times. A **loop** repeats code, and a **list** holds many values in one variable. Together they are the workhorses of almost every program.

## The for loop

Use `for` when you know how many times to repeat:

```csharp
for (int i = 0; i < 3; i++)
{
    Console.WriteLine($"Round {i}");
}
// prints: Round 0, Round 1, Round 2
```

The three parts inside the parentheses are separated by semicolons:

1. `int i = 0` runs once at the start and creates the counter.
2. `i < 3` is checked before every round. When it is false the loop ends.
3. `i++` runs after every round and adds 1 to `i`.

Programmers count from **0**, so `i < 3` gives three rounds: 0, 1, 2.

## while

`while` repeats as long as a condition is true:

```csharp
int n = 1;
while (n < 100)
{
    n = n * 2;
}
Console.WriteLine(n);   // 128
```

## List<T>

A `List<T>` is a growable list. `T` is the type of the items, so `List<int>` holds numbers and `List<string>` holds text. You need `using System.Collections.Generic;` at the top.

```csharp
List<string> names = new List<string> { "Ava", "Noam" };
names.Add("Maya");
Console.WriteLine(names.Count);   // 3
Console.WriteLine(names[0]);      // Ava  (first item is index 0)
names.Remove("Noam");
Console.WriteLine(names.Count);   // 2
```

Useful members: `Add(item)`, `Remove(item)`, `Contains(item)`, `Count` (a property, no parentheses!), and `list[index]` to read or change one item.

## foreach

`foreach` visits every item in order, without a counter:

```csharp
foreach (string name in names)
{
    Console.WriteLine(name);
}
```

Read it as "for each `string` called `name` in `names`". Inside the braces, `name` is the current item. It is the simplest way to go through a list.

A running total uses the same pattern every time: start a variable at 0, then add to it inside the loop:

```csharp
int total = 0;
foreach (int price in prices)
{
    total += price;
}
```

> **Watch out:**
> - Writing `list.Count()` or `list.Length` instead of `list.Count` gives errors like `error CS1955: Non-invocable member 'List<int>.Count' cannot be used like a method` or `error CS1061: ... does not contain a definition for 'Length'`.
> - Reading `list[5]` when there are only 5 items (the last index is 4) crashes with `ArgumentOutOfRangeException`.
> - Changing a list inside a `foreach` over that same list (adding or removing) crashes with `InvalidOperationException: Collection was modified`.
> - Forgetting `using System.Collections.Generic;` gives `error CS0246: The type or namespace name 'List<>' could not be found`.
> - An infinite loop, such as a `while` whose condition never becomes false, will hang the program.

## Arrays in one minute

C# also has fixed-size **arrays**: `int[] scores = new int[] { 5, 8, 2 };`. You read them with `scores[0]` and get the size with `scores.Length`. Arrays cannot grow; a `List` can, so lists are used more often.

> **Your turn:** use `foreach` to add every number to `sum` and print `Sum: 15`. Then `Add` the number `6` to the list and print `Count: 6`.
