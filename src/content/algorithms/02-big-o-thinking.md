---
title: Big-O thinking
summary: Compare O(n), O(n squared) and O(log n) by counting the steps your loops really take.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # Each function returns how many STEPS its loop performs for input size n.
      # A "step" is one trip around the loop.

      # 1. count_linear: one loop that visits every number from 0 to n-1.
      def count_linear(n):
          pass


      # 2. count_quadratic: a loop inside a loop, each running n times.
      def count_quadratic(n):
          pass


      # 3. count_halving: start with n and keep cutting it in half
      #    (use whole-number division) until it reaches 1. Count the halvings.
      def count_halving(n):
          pass


      print("n  linear  quadratic  halving")
      for n in (10, 100, 1000):
          print(n, count_linear(n), count_quadratic(n), count_halving(n))
check:
  output: |
    n  linear  quadratic  halving
    10 10 100 3
    100 100 10000 6
    1000 1000 1000000 9
  code:
    - { pattern: 'for\s+\w+\s+in\s+range\([^\n]*\n(\s*(#[^\n]*)?\n)*\s+for\s+\w+\s+in\s+range', message: "count_quadratic needs a for loop nested inside another for loop." }
    - { pattern: '\bwhile\b', message: "count_halving needs a while loop." }
    - { pattern: '//', message: "Use whole-number division (//) to halve." }
hints:
  - "Each function keeps a counter variable, adds 1 for every trip around its loop, and returns the counter. The quadratic one has a loop inside a loop, and the halving one uses while."
  - "count_linear: for i in range(n): steps += 1. count_quadratic: for i in range(n): then for j in range(n): steps += 1. count_halving: while n > 1: n = n // 2 and steps += 1."
  - "def count_linear(n):   steps = 0   for i in range(n):       steps += 1   return steps      and for halving:   steps = 0   while n > 1:       n = n // 2       steps += 1   return steps"
solution:
  - name: main.py
    code: |
      def count_linear(n):
          steps = 0
          for i in range(n):
              steps += 1
          return steps


      def count_quadratic(n):
          steps = 0
          for i in range(n):
              for j in range(n):
                  steps += 1
          return steps


      def count_halving(n):
          steps = 0
          while n > 1:
              n = n // 2
              steps += 1
          return steps


      print("n  linear  quadratic  halving")
      for n in (10, 100, 1000):
          print(n, count_linear(n), count_quadratic(n), count_halving(n))
quiz:
  - q: "A loop runs once for each of n items. What is its Big-O?"
    options: ["O(log n)", "O(n squared)", "O(n)"]
    answer: 2
  - q: "Two nested loops, each running n times, perform about how many steps?"
    options: ["n times n", "n plus n", "2 times n"]
    answer: 0
    explain: "The inner loop runs n times for each of the n trips of the outer loop."
  - q: "About how many times can you halve 1,000,000 before reaching 1?"
    options: ["500,000", "About 20", "1,000"]
    answer: 1
    explain: "2 to the power 20 is about a million, so log base 2 of a million is about 20."
  - q: "Big-O mostly ignores constant factors. Which two have the same Big-O?"
    options: ["n and n squared", "n and log n", "n and 5 times n"]
    answer: 2
---

Two programs can both give the right answer and still behave very differently once the input gets big. **Big-O notation** is the language programmers use to describe how the work of an algorithm **grows** as the input grows. In this lesson you will not do any scary math. You will simply count steps and watch the numbers.

## Input size and growth

We call the size of the input `n`: the number of items in a list, the number of characters in a string. The question is always: if `n` becomes 10 times bigger, what happens to the number of steps?

Big-O keeps only the **shape** of the growth. It ignores small details like "plus 3 extra steps" or "5 times as many", because for large `n` the shape dominates. So `5n + 3` steps is simply **O(n)**, read "order n" or "linear".

## The common shapes

**O(1), constant.** The work does not depend on `n`. Reading `items[0]` takes one step whether the list has 10 or 10 million items.

**O(n), linear.** One loop over the data.

```python
steps = 0
for item in range(1000):
    steps += 1
print(steps)   # prints: 1000
```

**O(n squared), quadratic.** A loop inside a loop.

```python
steps = 0
for i in range(100):
    for j in range(100):
        steps += 1
print(steps)   # prints: 10000
```

Going from 100 to 1000 items multiplies the work by 100, not by 10. Quadratic algorithms are fine for small inputs and painful for big ones.

**O(log n), logarithmic.** The work shrinks the problem by a fixed fraction every step, usually by half.

```python
n = 1000
steps = 0
while n > 1:
    n = n // 2     # // is whole-number division
    steps += 1
print(steps)       # prints: 9
```

A thousand items need only 9 halvings, and a million need about 20. This is why logarithmic algorithms feel almost magical, and you will meet one in the next lesson (binary search).

## Seeing it side by side

Here is how the step counts grow. Read the table from left to right and notice what happens to each column.

| n | O(log n) | O(n) | O(n squared) |
| --- | --- | --- | --- |
| 10 | 3 | 10 | 100 |
| 100 | 6 | 100 | 10,000 |
| 1,000 | 9 | 1,000 | 1,000,000 |
| 1,000,000 | 19 | 1,000,000 | 1,000,000,000,000 |

At a million items, the quadratic algorithm does a trillion steps, while the logarithmic one does nineteen. No faster computer closes that gap. That is why we care.

```text
work
 ^
 |                                   n squared
 |                              .  '
 |                         .  '       n
 |                    .  '      . . '
 |              .  '    . . '
 |        . '  . . ' ---------------- log n
 +---------------------------------------> n
```

## Worst case, best case

The same algorithm can behave differently on different inputs. Looking for a name in an unsorted list, you might find it at the first position (best case) or at the very end or not at all (worst case). Big-O usually describes the **worst case**, because it is a promise: "no matter what you give me, I will never be slower than this."

## How to read code and guess its Big-O

- One loop over the input: probably O(n).
- A loop nested in a loop, both over the input: probably O(n squared).
- Something that is cut in half each round: probably O(log n).
- Two loops one after the other (not nested): O(n + n) which is still O(n).

> **Watch out:**
> - Big-O is not a stopwatch. An O(n) algorithm with a huge constant can lose to an O(n squared) one on tiny inputs. Big-O tells you what happens as `n` grows.
> - `n / 2` gives a float such as `62.5`, so the loop keeps halving fractions and your count comes out wrong (10 instead of 9 for n = 1000). Use `n // 2` for whole-number halving.
> - A `while` loop that forgets to change its variable never ends. The page may freeze. If it does, reload.
> - Two separate loops are added, not multiplied. Only a loop inside a loop multiplies.

## Going further

Change the table values in the starter to 10,000 and see which function becomes slow. Then think about this: the built-in `x in some_list` is O(n), because Python may have to look at every item. Which of your earlier programs hides a loop like that?

> **Your turn:** implement the three counting functions so that the printed table matches. Use two nested `for` loops for the quadratic one and a `while` loop with `//` for the halving one.
