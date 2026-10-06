---
title: Generators and iterators
summary: Produce values one at a time with yield instead of building whole lists.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      # 1. Write a generator function fib(limit) that yields the Fibonacci
      #    numbers (0, 1, 1, 2, 3, 5, ...) that are smaller than limit.
      #    Use two variables a and b and hand out one value at a time.


      g = fib(50)

      # 2. Print the first three values by calling next(g) three times,
      #    on one line: print(next(g), next(g), next(g))

      # 3. Print the rest of the values as a list: list(g)

      # 4. Print the sum of the squares of 0..9 using a generator expression
      #    (round brackets, no list built):
      #      Sum of squares: 285
check:
  output: |
    0 1 1
    [2, 3, 5, 8, 13, 21, 34]
    Sum of squares: 285
  code:
    - { pattern: 'yield\s', message: "Use the yield keyword inside fib." }
    - { pattern: 'next\s*\(\s*g\s*\)', message: "Use next(g) to pull values one at a time." }
    - { pattern: 'sum\s*\(\s*\w+\s*\*\s*\w+\s+for', message: "Use a generator expression: sum(n * n for n in range(10))." }
hints:
  - "A function that contains the keyword yield becomes a generator: calling it does not run the body, it gives you an object that produces one value each time you ask with next()."
  - "Inside fib: a, b = 0, 1, then while a < limit: yield a, then a, b = b, a + b. For the last part use sum(n * n for n in range(10)) with no square brackets."
  - "def fib(limit):     a, b = 0, 1     while a < limit:         yield a         a, b = b, a + b   ...   print(list(g))   print(f\"Sum of squares: {sum(n * n for n in range(10))}\")"
solution:
  - name: main.py
    code: |
      def fib(limit):
          a, b = 0, 1
          while a < limit:
              yield a
              a, b = b, a + b


      g = fib(50)
      print(next(g), next(g), next(g))
      print(list(g))
      print(f"Sum of squares: {sum(n * n for n in range(10))}")
quiz:
  - q: What happens when you call a generator function such as fib(50)?
    options: ["It runs the whole body and returns a list", "It returns a generator object without running the body yet", "It raises an error until you call next"]
    answer: 1
  - q: What does yield do, compared with return?
    options: ["It ends the function forever", "It prints the value", "It hands out a value and pauses the function so it can continue from the same place later"]
    answer: 2
  - q: Why use a generator instead of a list for a million numbers?
    options: ["It never holds all the values in memory at once", "It is always faster to loop over", "Lists cannot hold a million numbers"]
    answer: 0
  - q: What does next(g) raise once the generator has no more values?
    options: ["ValueError", "StopIteration", "IndexError"]
    answer: 1
    explain: "A for loop catches StopIteration for you and simply ends the loop."
---

A list holds all its values at once. Sometimes that is wasteful (a million numbers) or impossible (an endless stream of data). A **generator** produces its values **lazily**: one at a time, only when asked. You will learn what iterators are, how `yield` creates them, and why this matters for big or endless data.

## Iterables and iterators

When you write `for x in something`, Python does two things behind the scenes:

1. It asks `something` for an **iterator** with `iter(something)`.
2. It calls `next(iterator)` again and again until a `StopIteration` signal says there is nothing left.

```python
it = iter([10, 20, 30])
print(next(it))   # prints: 10
print(next(it))   # prints: 20
print(next(it))   # prints: 30
# next(it) now raises StopIteration
```

A list is an **iterable** (can give you an iterator); the iterator is the thing that remembers where you are.

## Writing a generator with yield

Writing an iterator by hand is tedious. A **generator function** is the shortcut: use `yield` instead of `return`.

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for i in countdown(3):
    print(i)      # prints: 3, then 2, then 1
```

How it works piece by piece:

- Calling `countdown(3)` does **not** run the body. It returns a generator object.
- Each `next()` runs the body until it reaches `yield`, hands out that value and **pauses**, keeping all local variables.
- The next `next()` resumes right after the `yield`.
- When the function ends, `StopIteration` is raised and a `for` loop stops quietly.

## One pass only

A generator is used up after you have gone through it once:

```python
g = countdown(3)
print(list(g))   # prints: [3, 2, 1]
print(list(g))   # prints: []   (already exhausted)
```

If you need the values again, call the generator function again to get a fresh one.

## Generator expressions

A list comprehension in square brackets builds the whole list. Use round brackets and you get a lazy generator instead:

```python
squares_list = [n * n for n in range(1000000)]   # a million numbers stored
squares_gen = (n * n for n in range(1000000))    # nothing computed yet
print(sum(n * n for n in range(10)))             # prints: 285
```

When a generator expression is the only argument of a function you can drop the extra brackets, as in `sum(...)` above.

## Endless generators

Because values are made on demand, a generator can be infinite as long as you stop asking:

```python
def naturals():
    n = 1
    while True:
        yield n
        n += 1
```

Never call `list(naturals())`, it would never finish. Take only what you need, for example with `itertools.islice(naturals(), 5)`.

> **Watch out:**
> - Printing a generator shows `<generator object fib at 0x...>`, not the values. Loop over it or wrap it in `list(...)`.
> - Using it twice: the second pass is empty, with no error. This is a very common source of confusing bugs.
> - Calling `next(g)` after the end gives `StopIteration`. Use `next(g, None)` to get a default instead.
> - Forgetting that `return value` inside a generator ends it (the value is not yielded).
> - `len(g)` does not work: `TypeError: object of type 'generator' has no len()`.

## Going further

Write a generator `read_chunks(items, size)` that yields lists of `size` items at a time, or chain generators together, each one filtering the output of the previous one, to build a lazy pipeline.

> **Your turn:** write the generator `fib(limit)`, then print its first three values with `next`, the remaining values with `list(g)` and the sum of squares of 0..9 with a generator expression, as described in the comments.
