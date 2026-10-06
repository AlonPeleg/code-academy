---
title: Context managers and the with statement
summary: Guarantee that setup and cleanup always happen by writing your own with-blocks.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import contextlib

      # 1. Class Resource: a context manager built from the two special methods.
      #    - the "enter" method prints "open <name>" and returns self
      #    - the "exit" method prints "close <name>". If the block raised a
      #      ValueError, also print "handled: <the error message>" and make
      #      Python swallow the error. For any other error let it continue.
      class Resource:
          def __init__(self, name):
              self.name = name


      # 2. tag(name): a generator-based context manager.
      #    Print "<name>" before the block and "</name>" after it, even when
      #    the block fails. Turn the generator into a context manager with the
      #    decorator from contextlib.
      def tag(name):
          pass


      with Resource("db") as r:
          print("using", r.name)

      with Resource("cache"):
          raise ValueError("bad data")
      print("after cache")

      try:
          with tag("div"):
              print("inside")
              raise RuntimeError("boom")
      except RuntimeError as error:
          print("caught", error)

      # 3. Ignore a ZeroDivisionError for one line with a ready-made helper from
      #    contextlib, then the program must still reach the last print.
      print(1 / 0)
      print("done")
check:
  output: |
    open db
    using db
    close db
    open cache
    close cache
    handled: bad data
    after cache
    <div>
    inside
    </div>
    caught boom
    done
  code:
    - { pattern: '__enter__', message: "Define an __enter__ method." }
    - { pattern: '__exit__', message: "Define an __exit__ method." }
    - { pattern: '@(contextlib\.)?contextmanager', message: "Decorate tag with @contextlib.contextmanager." }
    - { pattern: 'yield', message: "tag needs a yield where the with-block runs." }
    - { pattern: 'finally', message: "Use try/finally around the yield so the closing tag always prints." }
    - { pattern: 'suppress\s*\(', message: "Use contextlib.suppress(ZeroDivisionError) around the division." }
hints:
  - "A with-block calls two special methods for you: one when it starts and one when it ends, even if an error happened inside. A generator with a single yield can play both roles."
  - "In the class write __enter__(self) and __exit__(self, exc_type, exc, tb). Returning True from __exit__ swallows the error. For tag, print the opening tag, then try: yield, finally: print the closing tag. For step 3 use with contextlib.suppress(ZeroDivisionError): above the division."
  - "def __enter__(self): print('open', self.name); return self   def __exit__(self, exc_type, exc, tb): print('close', self.name); if exc_type is ValueError: print('handled:', exc); return True; return False   @contextlib.contextmanager def tag(name): print('<' + name + '>'); try: yield; finally: print('</' + name + '>')"
solution:
  - name: main.py
    code: |
      import contextlib


      class Resource:
          def __init__(self, name):
              self.name = name

          def __enter__(self):
              print(f"open {self.name}")
              return self

          def __exit__(self, exc_type, exc, tb):
              print(f"close {self.name}")
              if exc_type is ValueError:
                  print(f"handled: {exc}")
                  return True
              return False


      @contextlib.contextmanager
      def tag(name):
          print(f"<{name}>")
          try:
              yield
          finally:
              print(f"</{name}>")


      with Resource("db") as r:
          print("using", r.name)

      with Resource("cache"):
          raise ValueError("bad data")
      print("after cache")

      try:
          with tag("div"):
              print("inside")
              raise RuntimeError("boom")
      except RuntimeError as error:
          print("caught", error)

      with contextlib.suppress(ZeroDivisionError):
          print(1 / 0)
      print("done")
quiz:
  - q: What is the main promise of a with-statement?
    options: ["The cleanup code runs when the block ends, even if an error happened inside", "The block runs faster than normal code", "Errors inside the block are always hidden"]
    answer: 0
  - q: "What does the value after  as  in  with Resource('db') as r  come from?"
    options: ["The return value of __exit__", "The return value of __enter__", "The argument given to Resource"]
    answer: 1
  - q: What happens when __exit__ returns True?
    options: ["The with-block runs a second time", "The program stops", "The exception raised inside the block is swallowed"]
    answer: 2
    explain: "Returning False or None lets the exception continue upward, which is what you want in most cases."
  - q: Why does a generator-based context manager put the yield inside try/finally?
    options: ["So the code after the yield also runs when the block raises an error", "Because yield only works inside try", "To make the generator faster"]
    answer: 0
---

You already know one context manager: the `with open(...) as file:` pattern from file handling. In this lesson you will learn what really happens behind that `with`, and how to write your own. This matters whenever something must be undone after you use it: files, database connections, locks, temporary settings, timers.

## The problem with manual cleanup

Imagine a resource that must be closed after use:

```python
resource = open_something()
use(resource)          # what if this line raises an error?
resource.close()       # never reached!
```

You could wrap everything in `try/finally`, but you would repeat that pattern again and again. The `with` statement packages it:

```python
with open_something() as resource:
    use(resource)
# resource is closed here, no matter what happened above
```

## The protocol: __enter__ and __exit__

An object works in a `with` statement when it has two special methods:

- `__enter__(self)` runs when the block starts. Whatever it returns is what `as name` receives (often `self`).
- `__exit__(self, exc_type, exc, tb)` runs when the block ends, normally or because of an error. If there was no error, all three extra arguments are `None`. Otherwise they hold the exception class, the exception object and a traceback.

```python
class Timer:
    def __enter__(self):
        print("start")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("stop")
        return False        # do not swallow errors

with Timer():
    print("working")
# prints: start, working, stop
```

The return value of `__exit__` decides about the error: `True` means "I handled it, carry on after the block", `False` or `None` means "let it continue". Swallowing errors silently is dangerous, so only do it for a specific exception type, as in the exercise.

## The shortcut: contextlib.contextmanager

Writing a class is verbose when you only need "do this before, do that after". The decorator `@contextlib.contextmanager` turns a generator with **one** `yield` into a context manager. Code before the `yield` is the setup, code after it is the cleanup:

```python
import contextlib

@contextlib.contextmanager
def announce(title):
    print("begin", title)
    try:
        yield               # the with-block runs here
    finally:
        print("end", title)

with announce("demo"):
    print("body")
# prints: begin demo, body, end demo
```

If the block raises, the exception is re-raised **at the yield line**. That is why the cleanup belongs in `finally`: without it the code after `yield` would be skipped on errors. You can also write `yield value` so the block receives something with `as`.

## Ready-made helpers

`contextlib` has useful tools: `contextlib.suppress(SomeError)` ignores that error inside the block, and `contextlib.redirect_stdout(stream)` temporarily sends `print` output into a stream such as `io.StringIO`.

```python
with contextlib.suppress(KeyError):
    del settings["theme"]      # no crash if the key is missing
```

You can also open several in one statement: `with A() as a, B() as b:`. They exit in reverse order, like stacked boxes.

> **Watch out:**
> - Forgetting `return self` in `__enter__` means `as r` gives `None`, and then `r.name` fails with `AttributeError: 'NoneType' object has no attribute 'name'`.
> - A class missing one of the two methods fails with `AttributeError: __enter__` (or `__exit__`).
> - A `@contextmanager` generator with two `yield` statements fails with `RuntimeError: generator didn't stop`.
> - Putting the cleanup after `yield` without `try/finally`: it silently does not run when the block raises.
> - `__exit__` must accept three extra arguments, otherwise you get a `TypeError` about missing arguments.

## Going further

Write a `timer` context manager that measures a block with `time.perf_counter()` and stores the result on the object (do not print raw times in a lesson, they change on every run). Or write `cd(path)`-style helpers that change a setting and always restore the old value in `finally`.

> **Your turn:** complete `Resource` with `__enter__` and `__exit__` (swallowing only `ValueError`), write `tag` with `@contextlib.contextmanager` and `try/finally`, and wrap the division in `contextlib.suppress(ZeroDivisionError)` so the program prints `done`.
