---
title: The functools toolbox
summary: Pre-fill arguments with partial, fold lists with reduce, cache with a size limit and dispatch on types.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import functools


      def power(base, exponent):
          return base ** exponent


      # 1. Make square and cube from power by fixing the exponent in advance
      #    (functools.partial with a keyword argument).
      square = None
      cube = None
      print(square(7), cube(3))

      # 2. With functools.reduce:
      #    a) multiply all numbers of [1, 2, 3, 4, 5] together
      #    b) find the longest word (the first one wins a tie)
      numbers = [1, 2, 3, 4, 5]
      words = ["kiwi", "banana", "apple", "cherry"]
      product = 0
      longest = ""
      print(product, longest)

      # 3. Cache lookup with a LIMITED cache that remembers only the 2 most
      #    recently used results. The list "calls" records real executions.
      calls = []


      def lookup(n):
          calls.append(n)
          return n * 10


      for n in [1, 2, 1, 3, 1, 2]:
          lookup(n)
      info = lookup.cache_info()
      print("hits", info.hits, "misses", info.misses, "size", info.currsize)
      print("real calls:", len(calls))


      # 4. describe(value) chooses its behaviour by the TYPE of the argument.
      #    Default: "something: <value>". For int: "an integer: <value>".
      #    For list: "a list of <n> items".
      def describe(value):
          return f"something: {value}"


      print(describe(5))
      print(describe([1, 2]))
      print(describe("hi"))
check:
  output: |
    49 27
    120 banana
    hits 2 misses 4 size 2
    real calls: 4
    an integer: 5
    a list of 2 items
    something: hi
  code:
    - { pattern: 'partial\s*\(', message: "Use functools.partial(power, exponent=...)." }
    - { pattern: 'reduce\s*\(', message: "Use functools.reduce." }
    - { pattern: 'lru_cache\s*\(\s*maxsize\s*=\s*2', message: "Decorate lookup with @functools.lru_cache(maxsize=2)." }
    - { pattern: 'singledispatch', message: "Use @functools.singledispatch on describe." }
    - { pattern: '\.register', message: "Register the int and list versions with describe.register." }
hints:
  - "functools.partial(func, name=value) returns a new function with that argument already filled in. reduce(function, items, start) combines the items from left to right into a single value. lru_cache and singledispatch are decorators."
  - "square = functools.partial(power, exponent=2). product = functools.reduce(lambda a, b: a * b, numbers). longest = functools.reduce(lambda a, b: a if len(a) >= len(b) else b, words). Put @functools.lru_cache(maxsize=2) above lookup, @functools.singledispatch above describe, and @describe.register above one function for int and one for list."
  - "@functools.singledispatch def describe(value): return f'something: {value}'   @describe.register def _(value: int): return f'an integer: {value}'   @describe.register def _(value: list): return f'a list of {len(value)} items'"
solution:
  - name: main.py
    code: |
      import functools


      def power(base, exponent):
          return base ** exponent


      square = functools.partial(power, exponent=2)
      cube = functools.partial(power, exponent=3)
      print(square(7), cube(3))

      numbers = [1, 2, 3, 4, 5]
      words = ["kiwi", "banana", "apple", "cherry"]
      product = functools.reduce(lambda a, b: a * b, numbers)
      longest = functools.reduce(lambda a, b: a if len(a) >= len(b) else b, words)
      print(product, longest)

      calls = []


      @functools.lru_cache(maxsize=2)
      def lookup(n):
          calls.append(n)
          return n * 10


      for n in [1, 2, 1, 3, 1, 2]:
          lookup(n)
      info = lookup.cache_info()
      print("hits", info.hits, "misses", info.misses, "size", info.currsize)
      print("real calls:", len(calls))


      @functools.singledispatch
      def describe(value):
          return f"something: {value}"


      @describe.register
      def _(value: int):
          return f"an integer: {value}"


      @describe.register
      def _(value: list):
          return f"a list of {len(value)} items"


      print(describe(5))
      print(describe([1, 2]))
      print(describe("hi"))
quiz:
  - q: "What does  functools.partial(power, exponent=2)  return?"
    options: ["The number power(None, 2)", "A new function that calls power with exponent already set to 2", "A copy of power that cannot be called"]
    answer: 1
  - q: "What does  functools.reduce(lambda a, b: a + b, [1, 2, 3])  compute step by step?"
    options: ["(1 + 2) first, then that result + 3", "1 + 2 + 3 all at once in parallel", "Only the first and the last item"]
    answer: 0
  - q: With lru_cache(maxsize=2), what happens when a third different argument is cached?
    options: ["Python raises an error", "The least recently used entry is forgotten to make room", "The cache doubles in size"]
    answer: 1
    explain: "LRU means least recently used. Calling an entry again counts as using it, so it is kept longer."
  - q: What does singledispatch look at to choose an implementation?
    options: ["The type of the first argument", "The name of the variable", "The number of arguments"]
    answer: 0
---

The standard module `functools` is a toolbox for working with functions as values. You already met `functools.wraps` in the decorators lesson and `functools.cache` in the memoization lesson. Here are four more tools that make code shorter and show how functional style looks in Python.

## partial: fill in arguments early

`functools.partial(func, *args, **kwargs)` returns a **new function** where some arguments are already decided.

```python
import functools

def greet(greeting, name):
    return f"{greeting}, {name}!"

hello = functools.partial(greet, "Hello")
print(hello("Ava"))                 # prints: Hello, Ava!

shout = functools.partial(greet, name="EVERYONE")
print(shout("Hi"))                  # prints: Hi, EVERYONE!
```

It is handy for callbacks and for settings: `int` with `base=2` becomes a binary parser (`functools.partial(int, base=2)("101")` is `5`). It replaces many small one-line `lambda` wrappers and keeps the original function name in its `.func` attribute, which helps debugging.

## reduce: fold many values into one

`functools.reduce(function, items, start)` takes the first two items, combines them with `function`, combines that result with the third item, and so on:

```python
numbers = [1, 2, 3, 4]
print(functools.reduce(lambda a, b: a + b, numbers))        # prints: 10
# steps: (1 + 2) = 3, then (3 + 3) = 6, then (6 + 4) = 10
print(functools.reduce(lambda a, b: a + b, [], 0))          # prints: 0
```

The optional third argument is the **start value**. It is used first, and it is returned for an empty list. Without it, an empty list raises `TypeError: reduce() of empty iterable with no initial value`. For plain sums and products Python offers `sum` and `math.prod`, which are clearer, so use `reduce` when you have a custom combining rule, like "keep the longer word" or "merge two dictionaries".

## lru_cache: remember results, with a limit

`functools.cache` remembers every result forever. `functools.lru_cache(maxsize=N)` keeps only the **N most recently used** results (LRU = least recently used) and forgets the oldest, which protects memory in long-running programs.

```python
@functools.lru_cache(maxsize=128)
def slow_square(n):
    return n * n
```

Useful extras: `slow_square.cache_info()` returns `CacheInfo(hits=..., misses=..., maxsize=..., currsize=...)`, and `slow_square.cache_clear()` empties the cache. A **hit** is a call answered from the cache, a **miss** had to run the function. Remember that the arguments must be hashable (numbers, strings, tuples), and only cache **pure** functions, whose result depends on the arguments alone.

## singledispatch: one name, behaviour by type

Instead of a long `if isinstance(...) elif isinstance(...)` chain, you can register one implementation per type. The first argument's type picks the version:

```python
@functools.singledispatch
def size(value):                  # the default
    return 1

@size.register
def _(value: str):                # chosen from the annotation
    return len(value)

@size.register(list)              # or pass the type explicitly
def _(value):
    return sum(size(item) for item in value)
```

New types can be added later, even from another module, without touching the original function. This is a neat way to keep code open for extension.

> **Watch out:**
> - Giving `partial` an argument in the wrong order: `partial(greet, "Ava")` fixes the **first** parameter (the greeting), not the name. Use a keyword like `name="Ava"` to be clear.
> - Using `lru_cache` on a function with a list argument: `TypeError: unhashable type: 'list'`.
> - Forgetting `maxsize`: a bare `@functools.lru_cache` keeps up to 128 results, so a test that expects old entries to be forgotten after 2 calls will see extra hits.
> - Registering with an annotation that is not a plain class, such as `list[int]`, fails with `TypeError`. Use `list`.
> - Caching a function that has side effects (printing, appending to a list) means the side effect only happens on misses.

## Going further

Try `functools.total_ordering` (write `__eq__` and `__lt__` and get all comparisons) and `functools.cached_property` (a method that runs once per object and then behaves like a stored attribute).

> **Your turn:** build `square` and `cube` with `partial`, compute the product and the longest word with `reduce`, put a size-2 `lru_cache` on `lookup` and read its statistics, and turn `describe` into a `singledispatch` function with versions for `int` and `list`.
