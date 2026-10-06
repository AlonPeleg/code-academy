---
title: Generics and constraints
summary: Write one class or method that works for many types, and limit it with where.
level: advanced
runner: remote
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      // 1. Write a generic class MyStack<T> that stores items in a List<T>.
      //    - void Push(T item)       adds to the end
      //    - T Pop()                 removes and returns the last item
      //    - T Peek()                returns the last item without removing it
      //    - int Count (a property)  the number of items

      // 2. Write a static class Helper with a generic method
      //        static T Max<T>(List<T> items)
      //    that returns the biggest item. Items must be comparable, so add the
      //    constraint:  where T : IComparable<T>
      //    (compare with a.CompareTo(b) > 0, start with the first item).

      class Program
      {
          static void Main()
          {
              MyStack<int> s = new MyStack<int>();
              s.Push(10);
              s.Push(20);
              s.Push(30);
              Console.WriteLine("Top: " + s.Peek());
              Console.WriteLine("Popped: " + s.Pop());
              Console.WriteLine("Count: " + s.Count);

              Console.WriteLine("Max int: " + Helper.Max(new List<int> { 3, 9, 4 }));
              Console.WriteLine("Max string: " + Helper.Max(new List<string> { "apple", "pear", "fig" }));
          }
      }
check:
  output: |
    Top: 30
    Popped: 30
    Count: 2
    Max int: 9
    Max string: pear
  code:
    - { pattern: 'class\s+MyStack\s*<\s*T\s*>', message: "Declare class MyStack<T>." }
    - { pattern: 'where\s+T\s*:\s*IComparable\s*<\s*T\s*>', message: "Add the constraint where T : IComparable<T>." }
    - { pattern: 'static\s+T\s+Max\s*<\s*T\s*>', message: "Write a generic method static T Max<T>(...)." }
    - { pattern: 'List\s*<\s*T\s*>', message: "Store the items in a List<T>." }
hints:
  - "Generics use a placeholder type name, usually T, in angle brackets: class MyStack<T> and Max<T>(...). Inside, T can be used like any real type. A constraint after the parameter list limits which types are allowed."
  - "class MyStack<T> { private List<T> items = new List<T>(); public void Push(T item) { items.Add(item); } ... public int Count { get { return items.Count; } } }   For Max: static T Max<T>(List<T> items) where T : IComparable<T> { T best = items[0]; foreach (T x in items) { if (x.CompareTo(best) > 0) best = x; } return best; }"
  - "public T Pop() { T last = items[items.Count - 1]; items.RemoveAt(items.Count - 1); return last; }   public T Peek() { return items[items.Count - 1]; }   static class Helper { public static T Max<T>(List<T> items) where T : IComparable<T> { ... } }"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class MyStack<T>
      {
          private List<T> items = new List<T>();

          public void Push(T item)
          {
              items.Add(item);
          }

          public T Pop()
          {
              T last = items[items.Count - 1];
              items.RemoveAt(items.Count - 1);
              return last;
          }

          public T Peek()
          {
              return items[items.Count - 1];
          }

          public int Count
          {
              get { return items.Count; }
          }
      }

      static class Helper
      {
          public static T Max<T>(List<T> items) where T : IComparable<T>
          {
              T best = items[0];
              foreach (T x in items)
              {
                  if (x.CompareTo(best) > 0)
                  {
                      best = x;
                  }
              }
              return best;
          }
      }

      class Program
      {
          static void Main()
          {
              MyStack<int> s = new MyStack<int>();
              s.Push(10);
              s.Push(20);
              s.Push(30);
              Console.WriteLine("Top: " + s.Peek());
              Console.WriteLine("Popped: " + s.Pop());
              Console.WriteLine("Count: " + s.Count);

              Console.WriteLine("Max int: " + Helper.Max(new List<int> { 3, 9, 4 }));
              Console.WriteLine("Max string: " + Helper.Max(new List<string> { "apple", "pear", "fig" }));
          }
      }
quiz:
  - q: What does T stand for in class MyStack<T>?
    options: ["A type placeholder that is filled in when you use the class, such as MyStack<int>", "A built-in type named T", "The word 'Type' as a keyword"]
    answer: 0
  - q: "What does the constraint  where T : IComparable<T>  guarantee?"
    options: ["T must be a number", "T is a class", "Values of type T can be compared with CompareTo, so the method may use it"]
    answer: 2
  - q: Why are generics better than a stack of object?
    options: ["They are shorter to type", "They keep type safety: no casting, and mistakes are found at compile time", "object stacks do not exist"]
    answer: 1
  - q: Which line creates a stack of strings?
    options: ["MyStack<string> s = new MyStack<string>();", "MyStack s = new MyStack(string);", "MyStack<> s = new MyStack<T>();"]
    answer: 0
---

Imagine a stack (last in, first out) of integers. Later you need a stack of strings. Copying the class and changing `int` to `string` is wasteful. Using `object` for everything loses type safety: you would have to cast values back and need to hope nobody pushed the wrong thing. **Generics** solve this: you write the code once with a placeholder for the type, and the compiler checks every use.

You have already used generics: `List<int>` and `Dictionary<string, int>` are generic classes.

## A generic class

```csharp
class Box<T>
{
    private T value;

    public Box(T value)
    {
        this.value = value;
    }

    public T Get()
    {
        return value;
    }
}

Box<int> a = new Box<int>(5);
Box<string> b = new Box<string>("hi");
int x = a.Get();          // no cast needed, it is already an int
```

- `<T>` after the class name declares a **type parameter**. `T` is only a convention, `TItem` or `TKey` are common too.
- Inside the class `T` works like a real type for fields, parameters and return values.
- When you write `Box<int>`, the compiler treats every `T` as `int`. `Box<int>` and `Box<string>` are different types, and `a.Get()` returns an `int`, not an `object`.

## A generic method

Methods can have their own type parameters:

```csharp
static void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}

int p = 1, q = 2;
Swap(ref p, ref q);       // T is inferred as int
```

C# usually **infers** `T` from the arguments, so you rarely need to write `Swap<int>(...)`.

## Constraints with where

What if the method wants to compare two values? A plain `T` might be anything, even a type that cannot be compared, so this does not compile:

```csharp
static T Max<T>(T a, T b)
{
    return a > b ? a : b;     // error CS0019: Operator '>' cannot be applied to operands of type 'T' and 'T'
}
```

A **constraint** tells the compiler what `T` is guaranteed to support:

```csharp
static T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) > 0 ? a : b;
}
```

`IComparable<T>` is an interface with the method `CompareTo`, which returns a negative number, zero or a positive number. `int`, `double` and `string` all implement it. Other useful constraints:

| Constraint | Meaning |
|---|---|
| `where T : class` | T must be a reference type |
| `where T : struct` | T must be a value type such as int |
| `where T : new()` | T must have a public parameterless constructor, so you can write `new T()` |
| `where T : SomeInterface` | T must implement that interface |
| `where T : SomeBaseClass` | T must derive from that class |

You can combine several: `where T : class, IComparable<T>, new()`.

## Why it matters

Generic collections are fast and safe: `List<int>` stores plain ints without wrapping them in objects, and the compiler refuses `list.Add("text")`. When you write your own reusable code (a cache, a repository, a result wrapper) make it generic.

> **Watch out:**
> - Forgetting the constraint and using an operator or method: `error CS1061: 'T' does not contain a definition for 'CompareTo'` or `error CS0019: Operator '>' cannot be applied to operands of type 'T' and 'T'`.
> - Writing `new T()` without `where T : new()`: `error CS0304: Cannot create an instance of the variable type 'T' because it does not have the new() constraint`.
> - Using the generic class without its type: `MyStack s = new MyStack();` gives `error CS0305: Using the generic type 'MyStack<T>' requires 1 type arguments`.
> - Calling `Max` on an empty list: `items[0]` throws `ArgumentOutOfRangeException`. Real code checks `items.Count == 0` first.
> - Mixing types: `Max(3, "a")` cannot infer one `T` and does not compile.

## Going further

Add a `bool IsEmpty` property to `MyStack<T>`, or write `Min<T>` and a method `Swap<T>(List<T> list, int i, int j)`.

> **Your turn:** write the generic class `MyStack<T>` (`Push`, `Pop`, `Peek`, `Count`) backed by a `List<T>`, and the static generic method `Helper.Max<T>` with the constraint `where T : IComparable<T>`. Then `Main` prints the expected five lines.
