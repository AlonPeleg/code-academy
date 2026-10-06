---
title: While loops, break and continue
summary: Repeat until a condition changes, skip rounds and stop early.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # Part 1: counting with a condition-controlled loop
      # Start a counter n at 1. As long as n is at most 10:
      #   - skip the numbers that are multiples of 3 (do not print them)
      #   - stop the whole loop completely when n reaches 8
      #   - otherwise print n
      # Careful: n must still grow on skipped rounds, or the loop never ends!
      n = 1


      # Part 2: compound growth
      # Start with savings of 100. Each year the savings double.
      # Keep going until savings is at least 1000, counting the years.
      savings = 100
      years = 0


      print("Years:", years)
      print("Savings:", savings)
check:
  output: |
    1
    2
    4
    5
    7
    Years: 4
    Savings: 1600
  code:
    - { pattern: '\bwhile\b', message: "Use a while loop." }
    - { pattern: '\bbreak\b', message: "Use break to stop the loop at 8." }
    - { pattern: '\bcontinue\b', message: "Use continue to skip multiples of 3." }
hints:
  - "A while loop keeps running as long as its condition is True. Both parts need one, and part 1 also needs break and continue."
  - "Part 1: while n <= 10: then if n == 8: break, then increase n and use continue for multiples of 3, otherwise print n and increase n. Part 2: while savings < 1000: double savings and add 1 to years."
  - "while n <= 10:   if n == 8: break   if n % 3 == 0: n += 1; continue   print(n); n += 1      and      while savings < 1000: savings = savings * 2; years += 1"
solution:
  - name: main.py
    code: |
      n = 1
      while n <= 10:
          if n == 8:
              break
          if n % 3 == 0:
              n += 1
              continue
          print(n)
          n += 1

      savings = 100
      years = 0
      while savings < 1000:
          savings = savings * 2
          years += 1

      print("Years:", years)
      print("Savings:", savings)
quiz:
  - q: When does a while loop stop?
    options: ["After 10 rounds", "When its condition becomes False", "When the file ends"]
    answer: 1
  - q: What does break do?
    options: ["Skips to the next round", "Pauses the program", "Leaves the loop immediately"]
    answer: 2
  - q: What does continue do?
    options: ["Skips the rest of this round and goes to the next one", "Ends the program", "Restarts the program"]
    answer: 0
  - q: What does  n += 1  mean?
    options: ["Add 1 to n and store it back in n", "Compare n with 1", "Set n to 1"]
    answer: 0
---

A `for` loop is perfect when you know how many times to repeat. A `while` loop is for when you do not know in advance: "keep going until something happens". Think of stirring a pot until the sauce thickens.

## The while loop

```python
n = 1
while n <= 3:
    print(n)
    n += 1
print("Done")
```

```text
1
2
3
Done
```

Step by step:

1. Python checks the condition `n <= 3`.
2. If it is `True`, it runs the indented body, then goes back to step 1.
3. If it is `False`, the loop is finished and Python continues below it.

The line `n += 1` is a shorthand for `n = n + 1`. There are matching versions for the other operators: `-=`, `*=`, `/=`.

The body must change something that affects the condition. Otherwise the condition stays true forever and you get an **infinite loop**.

## break: leave the loop now

`break` jumps out of the nearest loop right away, even if the condition is still true:

```python
n = 1
while True:          # on purpose: this would never stop on its own
    if n * n > 50:
        break
    n += 1
print(n)             # prints: 8
```

`while True:` with a `break` inside is a common pattern for "repeat until the user does X".

## continue: skip to the next round

`continue` abandons the rest of the current round and goes straight back to the condition:

```python
n = 0
while n < 5:
    n += 1
    if n == 3:
        continue     # skip printing 3
    print(n)
# prints: 1 2 4 5
```

Notice that `n += 1` comes **before** the `continue`. If it came after, round 3 would jump back without increasing `n` and the loop would be stuck on 3 forever.

## When to use which loop

| Situation | Loop |
| --- | --- |
| Go through a list, or count 1 to 10 | `for` |
| Repeat until something changes | `while` |
| Stop early or skip an item | add `break` / `continue` |

The same `break` and `continue` also work inside `for` loops.

> **Watch out:**
> - Forgetting to update the variable in the body creates an infinite loop. The page may freeze. If so, reload it.
> - Using `continue` before the counter is updated (see above) also loops forever.
> - Off-by-one errors: `while n < 10` stops at 9, while `while n <= 10` includes 10.
> - Forgetting the colon gives `SyntaxError: expected ':'`.

> **Your turn:** in part 1 count with a `while` loop, skip multiples of 3 with `continue` and stop at 8 with `break`. In part 2 double `savings` each year until it reaches 1000, counting `years`.
