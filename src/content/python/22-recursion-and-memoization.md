---
title: Recursion and memoization
summary: Solve problems by having a function call itself, and speed it up with functools.cache.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import functools

      # 1. factorial(n): n! = n * (n-1) * ... * 1. The base case: factorial(0) is 1.
      def factorial(n):
          pass


      # 2. fib(n): fib(0) = 0, fib(1) = 1, otherwise fib(n-1) + fib(n-2).
      #    Add the decorator that remembers earlier results (functools.cache),
      #    otherwise fib(80) would take longer than your lifetime.
      def fib(n):
          pass


      # 3. flatten(items): turn a nested list such as [1, [2, [3, 4]], 5]
      #    into a flat list [1, 2, 3, 4, 5]. Use isinstance(x, list) and recursion.
      def flatten(items):
          pass


      print(factorial(10))
      print(fib(80))
      print(fib.cache_info().currsize)
      print(flatten([1, [2, [3, 4]], 5]))
check:
  output: |
    3628800
    23416728348467685
    81
    [1, 2, 3, 4, 5]
  code:
    - { pattern: '@functools\.cache|@cache|lru_cache', message: "Decorate fib with functools.cache." }
    - { pattern: 'isinstance\s*\(', message: "Use isinstance(x, list) in flatten." }
hints:
  - "A recursive function has a base case that stops the calls (the smallest problem you can answer directly) and a recursive case that calls itself on a smaller problem."
  - "factorial: if n == 0 return 1, else return n * factorial(n - 1). fib: if n < 2 return n, else return fib(n - 1) + fib(n - 2), with @functools.cache above the def. flatten: loop over items; if isinstance(x, list) extend the result with flatten(x), otherwise append x."
  - "def factorial(n):     return 1 if n == 0 else n * factorial(n - 1)   @functools.cache def fib(n):     return n if n < 2 else fib(n - 1) + fib(n - 2)   def flatten(items):     result = []     for x in items:         if isinstance(x, list):             result.extend(flatten(x))         else:             result.append(x)     return result"
solution:
  - name: main.py
    code: |
      import functools


      def factorial(n):
          if n == 0:
              return 1
          return n * factorial(n - 1)


      @functools.cache
      def fib(n):
          if n < 2:
              return n
          return fib(n - 1) + fib(n - 2)


      def flatten(items):
          result = []
          for x in items:
              if isinstance(x, list):
                  result.extend(flatten(x))
              else:
                  result.append(x)
          return result


      print(factorial(10))
      print(fib(80))
      print(fib.cache_info().currsize)
      print(flatten([1, [2, [3, 4]], 5]))
quiz:
  - q: What is a base case?
    options: ["The first line of every function", "The input for which the function answers directly without calling itself", "A case where an error is raised on purpose"]
    answer: 1
  - q: What happens if a recursive function has no base case?
    options: ["It returns None", "It runs forever silently", "It keeps calling itself until Python raises RecursionError"]
    answer: 2
  - q: Why is the plain recursive fib(80) so slow?
    options: ["It recomputes the same smaller values an enormous number of times", "Python cannot add big numbers", "Recursion is always slow"]
    answer: 0
  - q: What does functools.cache do to a function?
    options: ["Stores results by argument, so a repeated call returns the saved answer instead of recomputing", "Runs the function in the background", "Limits it to one call"]
    answer: 0
    explain: "This technique is called memoization. The arguments must be hashable, for example numbers, strings or tuples, but not lists."
---

**Recursion** means a function solves a problem by calling itself on a smaller version of the same problem. It is the natural way to handle things that contain smaller copies of themselves: folders inside folders, nested lists, trees, and mathematical definitions such as factorials.

## The two parts of every recursive function

1. **Base case**: the simplest input, answered directly. This is what stops the recursion.
2. **Recursive case**: reduce the problem and call yourself with the smaller one, then combine the result.

```python
def factorial(n):
    if n == 0:                 # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(4))   # prints: 24
```

Follow the calls: `factorial(4)` is `4 * factorial(3)`, which is `4 * 3 * factorial(2)`, and so on until `factorial(0)` returns 1. Then the answers multiply back up: 1, 1, 2, 6, 24. Python keeps each waiting call on the **call stack**.

## Recursion limits

Every call uses some memory on the stack, so Python stops you at about 1000 nested calls:

```python
def forever(n):
    return forever(n + 1)

forever(0)    # RecursionError: maximum recursion depth exceeded
```

Missing or wrong base cases cause this error. For very deep problems a loop is usually better.

## Recursion over nested data

Recursion shines when the shape of the data is nested:

```python
def depth(x):
    if not isinstance(x, list):
        return 0
    return 1 + max([depth(item) for item in x], default=0)

print(depth([1, [2, [3]]]))   # prints: 3
```

`isinstance(x, list)` asks "is this value a list?". If it is not, it is a plain item, which is the base case.

## The Fibonacci trap

The Fibonacci numbers are defined recursively: `fib(n) = fib(n-1) + fib(n-2)`, with `fib(0) = 0` and `fib(1) = 1`.

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

This is correct but terribly slow. `fib(5)` calls `fib(3)` twice, `fib(2)` three times and so on. The number of calls roughly **doubles** every time n grows, so `fib(40)` already takes many seconds and `fib(80)` would take longer than a human life.

## Memoization

The fix is to remember answers we already computed. This is called **memoization**, and Python does it with one line:

```python
import functools

@functools.cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(80))   # prints: 23416728348467685, instantly
```

`functools.cache` is a decorator: it keeps a dictionary from arguments to results. Each value from 0 to 80 is computed exactly once, so the work grows in a straight line instead of exploding. The decorated function also has `fib.cache_info()` showing hits, misses and the number of stored results, and `fib.cache_clear()` to empty it. (If you need to limit memory, use `functools.lru_cache(maxsize=100)`.)

Memoization only works if the function is **pure** (same arguments always give the same result) and the arguments are **hashable**: numbers, strings and tuples are fine, lists and dicts are not.

> **Watch out:**
> - No base case or one that is never reached: `RecursionError: maximum recursion depth exceeded`.
> - Not shrinking the problem: calling `factorial(n)` instead of `factorial(n - 1)` loops forever.
> - Forgetting to `return` the recursive call: the function returns `None` and you see `TypeError: unsupported operand type(s) for *: 'int' and 'NoneType'`.
> - Caching a function with a list argument: `TypeError: unhashable type: 'list'`. Convert to a tuple first.
> - Caching a function with side effects (printing, reading a clock): repeated calls skip the side effect.

## Going further

Write `power(base, exp)` recursively using the idea `base ** exp = base * base ** (exp - 1)`, or `sum_digits(n)`, which uses `n % 10` and `n // 10`.

> **Your turn:** implement `factorial` recursively, `fib` recursively with `functools.cache`, and `flatten` for nested lists using `isinstance`. The four printed lines should match the expected output.
