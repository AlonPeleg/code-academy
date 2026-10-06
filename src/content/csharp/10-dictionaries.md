---
title: Dictionaries
summary: Look up values by key with Dictionary<K,V>, and count things.
level: intermediate
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
              string[] words = { "apple", "banana", "apple", "cherry", "banana", "apple" };
              Dictionary<string, int> counts = new Dictionary<string, int>();

              // 1. Go through every word. If it is already a key, add 1 to its count,
              //    otherwise give it the count 1.

              // 2. Make a List<string> of the keys, sort it, and print each word like:
              //      apple: 3
              //    (in alphabetical order)

              // 3. Print how many different words there are:  Different words: 3
          }
      }
check:
  output: |
    apple: 3
    banana: 2
    cherry: 1
    Different words: 3
  code:
    - { pattern: 'ContainsKey\s*\(|TryGetValue\s*\(', message: "Check whether the word is already a key (ContainsKey or TryGetValue)." }
    - { pattern: 'foreach\s*\(', message: "Use foreach to go through the words." }
    - { pattern: '\.Sort\s*\(', message: "Sort the list of keys with Sort()." }
hints:
  - "A dictionary stores pairs: key -> value. Here the key is the word and the value is how often you have seen it. Ask counts whether it already contains a key before you add 1 to it."
  - "foreach (string w in words) { if (counts.ContainsKey(w)) { counts[w] += 1; } else { counts[w] = 1; } }   For the sorted output, create  new List<string>(counts.Keys)  and call Sort() on it. counts.Count gives the number of keys."
  - "List<string> keys = new List<string>(counts.Keys);  keys.Sort();  foreach (string k in keys) { Console.WriteLine($\"{k}: {counts[k]}\"); }  Console.WriteLine($\"Different words: {counts.Count}\");"
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;

      class Program
      {
          static void Main()
          {
              string[] words = { "apple", "banana", "apple", "cherry", "banana", "apple" };
              Dictionary<string, int> counts = new Dictionary<string, int>();

              foreach (string w in words)
              {
                  if (counts.ContainsKey(w))
                  {
                      counts[w] += 1;
                  }
                  else
                  {
                      counts[w] = 1;
                  }
              }

              List<string> keys = new List<string>(counts.Keys);
              keys.Sort();
              foreach (string k in keys)
              {
                  Console.WriteLine($"{k}: {counts[k]}");
              }

              Console.WriteLine($"Different words: {counts.Count}");
          }
      }
quiz:
  - q: In Dictionary<string, int>, what are the two types?
    options: ["The key type and the value type", "The value type and the key type", "Both are keys", "The length and the capacity"]
    answer: 0
  - q: How do you check whether a key exists?
    options: ["dict.Has(key)", "dict.Exists(key)", "dict.ContainsKey(key)", "dict.Find(key)"]
    answer: 2
  - q: What happens when you read a key that does not exist with dict[key]?
    options: ["You get 0", "You get null", "The program waits", "It throws a KeyNotFoundException"]
    answer: 3
  - q: Why do we sort the keys before printing in this lesson?
    options: ["A dictionary does not promise any particular order of its items", "Dictionaries can not be printed otherwise", "Sorting makes the counts bigger", "Sort is required by foreach"]
    answer: 0
---

A **list** finds things by position: "item number 3". A **dictionary** finds things by a **key** you choose: "the phone number for Maya". It stores **pairs** of key and value, and looking up a key is very fast even when there are thousands of entries.

## Creating and filling

A `Dictionary<TKey, TValue>` lives in `System.Collections.Generic`. The first type is the key, the second is the value:

```csharp
Dictionary<string, int> ages = new Dictionary<string, int>();
ages["Ava"] = 20;        // add (or replace) a pair
ages["Noam"] = 25;
ages.Add("Maya", 31);    // Add only works for a NEW key

Console.WriteLine(ages["Noam"]);   // 25
Console.WriteLine(ages.Count);     // 3
```

You can also fill one right away with an **initializer**:

```csharp
var prices = new Dictionary<string, double>
{
    { "tea", 2.5 },
    { "coffee", 3.0 }
};
```

## Looking things up safely

Reading a key that is not there crashes, so check first:

```csharp
if (ages.ContainsKey("Ava"))
{
    Console.WriteLine(ages["Ava"]);
}

int age;
if (ages.TryGetValue("Dana", out age))
{
    Console.WriteLine(age);
}
else
{
    Console.WriteLine("Dana is not in the dictionary");
}
```

`TryGetValue` does the check and the read in one step. Other useful members: `Remove(key)`, `Count`, `Keys` and `Values`.

## Going through all pairs

Each item is a `KeyValuePair` with `.Key` and `.Value`:

```csharp
foreach (KeyValuePair<string, int> pair in ages)
{
    Console.WriteLine($"{pair.Key} is {pair.Value}");
}
```

**Order is not promised.** A dictionary is built for fast lookup, not for keeping order, so you should never rely on the order in which `foreach` gives the pairs. If your output must be in a certain order, copy the keys into a list and sort it, as in this lesson:

```csharp
List<string> keys = new List<string>(ages.Keys);
keys.Sort();
```

## The counting pattern

Counting how often things appear is the classic dictionary job. For every item: if the key exists, add one; otherwise start at one:

```csharp
foreach (string w in words)
{
    if (counts.ContainsKey(w)) { counts[w] += 1; }
    else { counts[w] = 1; }
}
```

> **Watch out:**
> - Reading a missing key with `counts["pear"]` crashes with `System.Collections.Generic.KeyNotFoundException: The given key 'pear' was not present in the dictionary.`
> - `Add` with a key that already exists crashes with `ArgumentException: An item with the same key has already been added`. Use `dict[key] = value` when you want to add or replace.
> - Keys must be unique. Setting the same key twice replaces the first value.
> - Changing the dictionary (adding or removing keys) while looping over it with `foreach` throws `InvalidOperationException`.

> **Your turn:** count how often each word appears in `words`. Print the words in alphabetical order as `word: count`, then print `Different words: 3` using the dictionary's `Count`.
