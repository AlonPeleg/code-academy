---
title: Variables and strings
summary: Store values in typed variables and build text with string interpolation.
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
              string name = "Ava";
              int age = 20;

              // 1. Print: Hello, Ava!   (use the name variable, not typed-out text)
              // 2. Make age one bigger
              // 3. Print: Ava is now 21   (use both variables)
          }
      }
check:
  output: |
    Hello, Ava!
    Ava is now 21
  code:
    - { pattern: '\$\s*"[^"]*\{\s*name\s*\}', message: "Use string interpolation with the name variable, like $\"Hello, {name}!\"." }
    - { pattern: '\{\s*age\s*\}', message: "Print the age variable inside curly braces." }
hints:
  - "A variable is a named box for a value. You already have name and age. Put a $ before a string so you can drop variables into it."
  - "Interpolation looks like $\"Hello, {name}!\". To make age bigger by one you can write age = age + 1; (or age++;)."
  - "Console.WriteLine($\"Hello, {name}!\");  then  age = age + 1;  then  Console.WriteLine($\"{name} is now {age}\");"
solution:
  - name: Program.cs
    code: |
      using System;

      class Program
      {
          static void Main()
          {
              string name = "Ava";
              int age = 20;

              Console.WriteLine($"Hello, {name}!");
              age = age + 1;
              Console.WriteLine($"{name} is now {age}");
          }
      }
quiz:
  - q: Which type holds text?
    options: ["text", "str", "char[]", "string"]
    answer: 3
  - q: What does a $ in front of a string do?
    options: ["Makes it a price", "Lets you put {variables} inside the text", "Makes it private", "Makes it run faster"]
    answer: 1
  - q: Which type is the best fit for the number 9.99?
    options: ["int", "bool", "double", "string"]
    answer: 2
    explain: "int only holds whole numbers. double holds numbers with a decimal point."
  - q: What is the value of  10 / 4  when both numbers are int?
    options: ["2.5", "2", "3", "It is an error"]
    answer: 1
    explain: "Dividing two ints throws away the remainder, so the answer is the whole number 2."
---

Programs need to remember things: a name, a score, a price. A **variable** is a named box that holds a value. In this lesson you will create variables, change them, and weave them into sentences.

## Typed variables

C# is **statically typed**. That means every variable has a **type** that says what kind of value it can hold, and you write the type when you create the variable.

```csharp
string city = "Haifa";      // text
int population = 280000;    // whole number
double price = 9.99;        // number with a decimal point
bool isOpen = true;         // true or false
char grade = 'A';           // a single character, in single quotes
```

Read `int population = 280000;` as: "make a variable of type `int`, call it `population`, and put `280000` in it". The single `=` means **assign**, not "equals".

Once a variable exists you can change its value, but not its type:

```csharp
population = 281000;     // fine
population = "lots";     // error: a string does not fit in an int
```

## var

If the value makes the type obvious, you can let the compiler figure it out with `var`:

```csharp
var score = 10;       // still an int
var title = "Hi";     // still a string
```

`var` is not "any type". After the first assignment the type is fixed forever.

## Changing values

```csharp
int lives = 3;
lives = lives - 1;   // 2
lives -= 1;          // 1  (shortcut for lives = lives - 1)
lives++;             // 2  (add one)
```

The arithmetic operators are `+ - * /` and `%` (remainder). Careful: when **both** sides are `int`, `/` drops the decimals, so `7 / 2` is `3`. Use a `double` (`7.0 / 2` is `3.5`) if you need decimals.

## String interpolation

You can glue text together with `+`, but there is a cleaner way. Put a `$` before the opening quote and write variables in `{curly braces}`:

```csharp
string city = "Haifa";
int population = 280000;
Console.WriteLine($"{city} has {population} people");
// prints: Haifa has 280000 people
```

Anything inside the braces is evaluated, so `$"Next year: {population + 1000}"` works too.

> **Watch out:**
> - Forgetting the `$`: `"Hello, {name}!"` prints the braces literally, `Hello, {name}!`.
> - Putting a decimal in an int: `int x = 3.5;` gives `error CS0266: Cannot implicitly convert type 'double' to 'int'`.
> - Using a variable before giving it a value gives `error CS0165: Use of unassigned local variable`.
> - Text must be in double quotes. `string s = 'hi';` is an error because single quotes are only for one `char`.
> - You cannot declare the same variable name twice in the same block: `error CS0128: A local variable named 'age' is already defined`.

## Going further

Add a `double height = 1.68;` variable and print it in a sentence. Then try `Console.WriteLine(7 / 2);` and `Console.WriteLine(7.0 / 2);` and compare.

> **Your turn:** print `Hello, Ava!` using the `name` variable, add 1 to `age`, then print `Ava is now 21` using both variables. Use interpolation, not typed-out names or numbers.
