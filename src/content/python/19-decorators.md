---
title: Decorators
summary: Wrap a function with extra behaviour using the @ syntax and functools.wraps.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import functools

      # 1. Write a decorator called logged. It takes a function and returns a
      #    wrapper that accepts any arguments (*args, **kwargs), prints
      #    "Calling <function name>", calls the original function and returns its result.
      # 2. Put @functools.wraps(func) on the wrapper so the original name survives.


      # 3. Apply the decorator to both functions below with the @ syntax.

      def add(a, b):
          return a + b


      def greet(name, punctuation="!"):
          return "Hello, " + name + punctuation


      print(add(2, 3))
      print(greet("Ava"))
      print(add.__name__)
check:
  output: |
    Calling add
    5
    Calling greet
    Hello, Ava!
    add
  code:
    - { pattern: '@logged', message: "Decorate the functions with @logged." }
    - { pattern: '\*args', message: "The wrapper must accept *args and **kwargs." }
    - { pattern: 'functools\.wraps', message: "Use functools.wraps on the wrapper." }
hints:
  - "A decorator is a function that takes a function and returns a new function. The wrapper inside it adds behaviour before or after calling the original."
  - "def logged(func): then inside define def wrapper(*args, **kwargs): print the name with func.__name__, return func(*args, **kwargs). Finish with return wrapper. Put @logged on the line directly above each def."
  - "def logged(func):     @functools.wraps(func)     def wrapper(*args, **kwargs):         print(f\"Calling {func.__name__}\")         return func(*args, **kwargs)     return wrapper   then write @logged above def add and above def greet."
solution:
  - name: main.py
    code: |
      import functools


      def logged(func):
          @functools.wraps(func)
          def wrapper(*args, **kwargs):
              print(f"Calling {func.__name__}")
              return func(*args, **kwargs)
          return wrapper


      @logged
      def add(a, b):
          return a + b


      @logged
      def greet(name, punctuation="!"):
          return "Hello, " + name + punctuation


      print(add(2, 3))
      print(greet("Ava"))
      print(add.__name__)
quiz:
  - q: What is a decorator?
    options: ["A function that takes a function and returns a new, usually wrapped, function", "A comment placed above a function", "A class that cannot have methods"]
    answer: 0
  - q: "What is  @logged  placed above  def add  equivalent to?"
    options: ["add = logged", "logged(add) is called and the result is thrown away", "add = logged(add)"]
    answer: 2
  - q: Why does the wrapper take *args and **kwargs?
    options: ["So it can accept and pass on whatever arguments the original function takes", "To make the function run faster", "Because decorators must always have two parameters"]
    answer: 0
  - q: What does functools.wraps do?
    options: ["Runs the function twice", "Copies the original function's name and docstring onto the wrapper", "Makes the wrapper private"]
    answer: 1
---

In Python, functions are values: you can store them in variables, pass them to other functions and return them. A **decorator** uses this to add behaviour to a function (logging, timing, checking arguments, caching) without touching the function's own code. Frameworks such as Flask and tools such as `functools.cache` rely on them heavily.

## Functions that return functions

```python
def make_greeter(greeting):
    def greeter(name):
        return f"{greeting}, {name}!"
    return greeter

hello = make_greeter("Hello")
print(hello("Ava"))     # prints: Hello, Ava!
```

`greeter` is defined **inside** `make_greeter` and remembers `greeting` even after `make_greeter` has finished. This is called a **closure**.

## Your first decorator

A decorator takes a function and returns a replacement:

```python
def shout(func):
    def wrapper():
        print("before")
        func()
        print("after")
    return wrapper

def hi():
    print("hi")

hi = shout(hi)    # replace hi by the wrapped version
hi()              # prints: before, hi, after
```

Python gives you a shortcut for the line `hi = shout(hi)`: put `@shout` above the definition.

```python
@shout
def hi():
    print("hi")
```

## Wrappers that accept any arguments

The wrapper above only works for functions without parameters. To decorate any function, accept everything and pass it on:

- `*args` collects all positional arguments into a tuple.
- `**kwargs` collects all keyword arguments into a dictionary.
- `func(*args, **kwargs)` unpacks them again when calling.

```python
def logged(func):
    def wrapper(*args, **kwargs):
        print("Calling", func.__name__)
        return func(*args, **kwargs)     # do not forget to return the result!
    return wrapper
```

## Keeping the identity: functools.wraps

After decoration `add` is really the `wrapper` function, so `add.__name__` says `'wrapper'`, and help text and debuggers get confused. Fix this with `functools.wraps`, itself a decorator that copies the name and docstring from the original:

```python
import functools

def logged(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("Calling", func.__name__)
        return func(*args, **kwargs)
    return wrapper
```

Get into the habit of adding it to every decorator you write.

## Decorators with their own settings

If you want `@repeat(3)` you need one more level: a function that takes the setting and returns the actual decorator.

```python
def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator
```

Three nested functions look scary, but read them from the outside in: settings, then function, then call.

> **Watch out:**
> - Forgetting `return wrapper` at the end: the decorated name becomes `None`, and calling it gives `TypeError: 'NoneType' object is not callable`.
> - Forgetting to `return func(...)` inside the wrapper: the decorated function always returns `None`.
> - Writing `@logged()` with brackets when your decorator takes the function directly: `TypeError: logged() missing 1 required positional argument: 'func'`.
> - Skipping `functools.wraps`: everything still works but `add.__name__` prints `wrapper`.
> - The decorator runs when the function is **defined**; the wrapper runs each time it is **called**.

## Going further

Write a `timed` decorator using `time.perf_counter()` (do not print the time in a lesson that must be reproducible), or a `check_positive` decorator that raises `ValueError` if any argument is negative.

> **Your turn:** write the decorator `logged` with a wrapper that prints `Calling <name>` and returns the original result, use `functools.wraps`, and apply `@logged` to `add` and `greet`.
