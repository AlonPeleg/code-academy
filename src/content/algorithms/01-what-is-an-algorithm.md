---
title: What is an algorithm?
summary: Steps, input, output, and how to measure a solution by counting its operations.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # Write find_largest(numbers).
      # It must return TWO things as a tuple: (largest, comparisons)
      #
      # 1. Assume the first number is the largest so far.
      # 2. Walk through the remaining numbers with a loop.
      # 3. For each one, count one comparison, then update the largest if needed.
      # 4. Return the pair at the end.
      # (Do not use the built-in shortcut functions: the point is to write the steps yourself.)
      def find_largest(numbers):
          pass


      print(find_largest([3, 9, 2, 7]))
      print(find_largest([5]))
      print(find_largest([-4, -1, -8, -2, -9]))
check:
  output: |
    (9, 3)
    (5, 0)
    (-1, 4)
  code:
    - { pattern: '\b(for|while)\b', message: "Use a loop to visit the numbers." }
    - { pattern: '^(?![\s\S]*\b(max|sorted|min)\s*\()', message: "Do not use max(), min() or sorted(). Write the steps yourself." }
hints:
  - "You need two variables: one remembers the largest number seen so far, one counts comparisons. Both are updated inside a loop over the numbers after the first one."
  - "Start with largest = numbers[0] and comparisons = 0. Then for n in numbers[1:]: add 1 to comparisons, and if n > largest, set largest = n."
  - "def find_largest(numbers):   largest = numbers[0]   comparisons = 0   for n in numbers[1:]:       comparisons += 1       if n > largest:           largest = n   return largest, comparisons"
solution:
  - name: main.py
    code: |
      def find_largest(numbers):
          largest = numbers[0]
          comparisons = 0
          for n in numbers[1:]:
              comparisons += 1
              if n > largest:
                  largest = n
          return largest, comparisons


      print(find_largest([3, 9, 2, 7]))
      print(find_largest([5]))
      print(find_largest([-4, -1, -8, -2, -9]))
quiz:
  - q: "Which description fits an algorithm best?"
    options: ["A finite list of clear steps that turns an input into an output", "A program written in Python", "A very fast computer"]
    answer: 0
    explain: "An algorithm is the idea, the recipe. Python is just one way to write it down."
  - q: "To find the largest of 1000 numbers in an unsorted list, how many comparisons does the loop need?"
    options: ["1000", "999", "About 10"]
    answer: 1
    explain: "The first number is the starting champion, so the other 999 each need one comparison."
  - q: "Why do we count operations instead of timing the program with a stopwatch?"
    options: ["Stopwatches do not work on computers", "Counting is always faster", "Counts are the same on every machine, timings are not"]
    answer: 2
  - q: "What happens to the number of comparisons if the list doubles in length?"
    options: ["It roughly doubles", "It stays the same", "It is multiplied by four"]
    answer: 0
    explain: "One comparison per item means the work grows in step with the input."
---

You use algorithms every day without calling them that. In this track you will learn the classic ways to search, sort and organise data, and, even more important, how to **think** about which solution is better. Let us start with the foundation: what an algorithm is and how to measure one.

## An algorithm is a recipe

An **algorithm** is a finite list of clear steps that turns an **input** into an **output**. A recipe is a good picture: ingredients (input), instructions (steps), a meal (output). A good algorithm must be:

- **Precise**: every step is unambiguous. "Add a bit of salt" is not a computer instruction.
- **Finite**: it must end. A loop that never stops is a bug, not an algorithm.
- **Correct**: it gives the right output for every valid input, including odd ones such as an empty list.

```text
   input                steps                 output
 [3, 9, 2, 7]  --->  look at each number  --->   9
                     remember the biggest
```

## Writing the steps first

Say you want the largest number in a list. In plain words:

1. Take the first number and call it the champion.
2. Look at the next number. If it beats the champion, it becomes the new champion.
3. Repeat until no numbers are left.
4. The champion is the answer.

Now the same thing in Python:

```python
numbers = [3, 9, 2, 7]
largest = numbers[0]
for n in numbers[1:]:
    if n > largest:
        largest = n
print(largest)   # prints: 9
```

Notice how little of that code is "Python magic". The thinking happened in the steps. Learning algorithms means learning to think in steps first, then translate.

## Counting operations

Which solution is "faster"? You could time it with a stopwatch, but timings depend on your computer, on what else is running, and on the day. A better approach is to **count how many basic steps** the algorithm performs. That count is the same on every machine.

Let us add a counter to the largest-number search:

```python
numbers = [3, 9, 2, 7]
largest = numbers[0]
comparisons = 0
for n in numbers[1:]:
    comparisons += 1          # one comparison per item
    if n > largest:
        largest = n
print(largest, comparisons)   # prints: 9 3
```

With 4 numbers we need 3 comparisons. With 1000 numbers we would need 999. The work grows in step with the input size. We will call the input size `n`. Here the cost is about `n` steps. Double the list and the work doubles. This habit of asking "how does the work grow when the input grows?" is the heart of the next lesson.

## Always check the edge cases

An algorithm is only correct if it works for the strange inputs too. What if the list has one item? Then `numbers[1:]` is empty, the loop never runs, and the answer is the only number, with 0 comparisons. That works. What if all numbers are negative? Because we start from the first number (not from 0), negatives work as well. Starting with `largest = 0` would be a classic bug: for `[-4, -1, -8]` it would wrongly return 0.

What about an empty list? There is no largest number at all, so `numbers[0]` raises an error. Real programs must decide what to do: raise a clear error, or return `None`. For now our function assumes at least one number.

> **Watch out:**
> - Starting with `largest = 0` fails for lists of negative numbers. Start with the first element instead.
> - `numbers[0]` on an empty list gives `IndexError: list index out of range`.
> - Forgetting to `return` means the function gives back `None`, and your print shows `None`.
> - Returning two values (`return largest, comparisons`) really returns one tuple, so it prints as `(9, 3)` with brackets.

## Going further

Try the same idea for the smallest number, or for the position (index) of the largest number. Then predict how many comparisons you need for a list of 10,000 items before running anything. Being able to predict this is the skill this whole track trains.

> **Your turn:** write `find_largest(numbers)` so that it returns a tuple `(largest, comparisons)`. Use a loop and count one comparison for every number after the first. Do not use `max()`.
