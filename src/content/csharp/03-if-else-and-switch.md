---
title: If, else and switch
summary: Make decisions in code with if, else if, else and switch.
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
              int score = 72;

              // 1. Print the grade for score with a chain of conditions:
              //      90 or more -> A
              //      75 or more -> B
              //      50 or more -> C
              //      anything lower -> F
              //    Print just the letter (with Console.WriteLine).

              int day = 3;
              // 2. Use a switch on day to print a day name:
              //      1 -> Monday, 2 -> Tuesday, 3 -> Wednesday
              //      any other number -> Other
          }
      }
check:
  output: |
    C
    Wednesday
  code:
    - { pattern: '\bif\s*\(', message: "Use an if statement for the grade." }
    - { pattern: '\belse\b', message: "Use else / else if for the other grades." }
    - { pattern: '\bswitch\s*\(', message: "Use a switch statement for the day." }
hints:
  - "Conditions are checked from top to bottom, and only the first branch whose condition is true runs. Start with the highest grade."
  - "Write if (score >= 90) { ... } else if (score >= 75) { ... } else if (score >= 50) { ... } else { ... }. For the day, use switch (day) with case 1: ... break;"
  - "if (score >= 90) Console.WriteLine(\"A\"); else if (score >= 75) Console.WriteLine(\"B\"); else if (score >= 50) Console.WriteLine(\"C\"); else Console.WriteLine(\"F\");   then   switch (day) { case 1: Console.WriteLine(\"Monday\"); break; case 2: Console.WriteLine(\"Tuesday\"); break; case 3: Console.WriteLine(\"Wednesday\"); break; default: Console.WriteLine(\"Other\"); break; }"
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              int score = 72;

              if (score >= 90)
              {
                  Console.WriteLine("A");
              }
              else if (score >= 75)
              {
                  Console.WriteLine("B");
              }
              else if (score >= 50)
              {
                  Console.WriteLine("C");
              }
              else
              {
                  Console.WriteLine("F");
              }

              int day = 3;
              switch (day)
              {
                  case 1:
                      Console.WriteLine("Monday");
                      break;
                  case 2:
                      Console.WriteLine("Tuesday");
                      break;
                  case 3:
                      Console.WriteLine("Wednesday");
                      break;
                  default:
                      Console.WriteLine("Other");
                      break;
              }
          }
      }
quiz:
  - q: What is the difference between = and == ?
    options: ["= compares two values, == assigns", "= assigns a value, == compares two values", "They mean the same thing", "== is only used for text"]
    answer: 1
  - q: What does  a && b  mean?
    options: ["a or b", "not a", "a and b are both true", "a is bigger than b"]
    answer: 2
  - q: 'In a switch, what does "default:" do?'
    options: ["It runs when no case matched", "It runs first, before every case", "It runs every time", "It stops the program"]
    answer: 0
  - q: With  int x = 5;  what does  if (x > 3 || x < 0)  evaluate to?
    options: ["false", "It is an error", "Depends on the computer", "true"]
    answer: 3
    explain: "|| means 'or'. Only one side has to be true, and x > 3 is true."
---

Programs become interesting when they can choose what to do. In this lesson you will use `if`, `else if` and `else` to pick one path, and `switch` to choose between many fixed values.

## Conditions and bool

A **condition** is something that is either `true` or `false` (a `bool`). You make one with a comparison:

| Operator | Meaning |
| --- | --- |
| `==` | equal to |
| `!=` | not equal to |
| `<` `>` | less than, greater than |
| `<=` `>=` | less than or equal, greater than or equal |

You can combine conditions: `&&` means **and**, `||` means **or**, and `!` means **not**.

```csharp
int age = 17;
bool canVote = age >= 18;              // false
bool isTeen = age >= 13 && age <= 19;  // true
```

## if, else if, else

```csharp
int temperature = 25;

if (temperature > 30)
{
    Console.WriteLine("Hot");
}
else if (temperature > 20)
{
    Console.WriteLine("Nice");
}
else
{
    Console.WriteLine("Cold");
}
// prints: Nice
```

C# checks the conditions **from top to bottom** and runs only the first block whose condition is true. Everything after that is skipped. That is why order matters: if you tested `temperature > 20` first, a temperature of 35 would print "Nice" instead of "Hot".

The `else` block has no condition. It is the fallback when nothing above matched. You can have an `if` on its own, or an `if` with just an `else`.

## switch

When you compare one variable against several exact values, `switch` is tidier:

```csharp
string color = "red";

switch (color)
{
    case "red":
        Console.WriteLine("Stop");
        break;
    case "green":
        Console.WriteLine("Go");
        break;
    default:
        Console.WriteLine("Unknown");
        break;
}
// prints: Stop
```

- `switch (color)` says which value to look at.
- Each `case` is one possible value, followed by a colon.
- `break;` ends the case. In C# every case must end with `break` (or `return`); you cannot "fall through" into the next one by accident.
- `default:` runs when no case matched.

Two cases can share code by stacking them: `case 6: case 7: Console.WriteLine("Weekend"); break;`.

> **Watch out:**
> - Using `=` instead of `==` in a condition: `if (x = 5)` gives `error CS0029: Cannot implicitly convert type 'int' to 'bool'`.
> - Forgetting `break;` at the end of a case gives `error CS0163: Control cannot fall through from one case label` (or `CS8070` for the last case).
> - Putting a semicolon right after the condition, `if (x > 3);`, which makes the `if` do nothing. The block after it then always runs.
> - Checking the conditions in the wrong order, so a broad test (`score >= 50`) hides a narrower one (`score >= 90`).

## Going further

Change `score` to `95`, `80` and `20` and check that you get `A`, `B` and `F`. Then add `case 4:` for Thursday.

> **Your turn:** print the grade letter for `score` using `if` / `else if` / `else`, then print the name of `day` using a `switch`. With the starting values the output is `C` and then `Wednesday`.
