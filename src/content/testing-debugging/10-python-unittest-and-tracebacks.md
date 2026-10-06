---
title: Python - unittest and tracebacks
summary: Read a Python traceback, debug with print and the traceback module, and write tests with the built-in unittest module.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import io
      import traceback
      import unittest


      def parse_price(text):
          # Turns "$1,299.50" into the number 1299.5
          return float(text.replace("$", ""))


      def total(prices):
          result = 0
          for text in prices:
              result += parse_price(text)
          return result


      # 1. Finish where_it_failed(func, *args).
      #    Call func(*args) inside try. If it works, return "ok".
      #    If an error happens, return the error's class name, a colon and a space, then the names of
      #    the functions in the traceback joined with " > ".
      #    Example result:  "ValueError: where_it_failed > total > parse_price"
      #    Tools: type(error).__name__, error.__traceback__ and the traceback module.
      def where_it_failed(func, *args):
          return "ok"


      print(where_it_failed(total, ["$5", "free"]))

      # 2. This line crashes. Read the traceback, then fix parse_price so it can read "$1,299.50".
      print(total(["$5", "$1,299.50"]))


      class TestParsePrice(unittest.TestCase):
          def test_plain_dollars(self):
              self.assertEqual(parse_price("$5"), 5.0)

          def test_thousands_separator(self):
              self.assertEqual(parse_price("$1,299.50"), 1299.5)

          def test_text_is_an_error(self):
              with self.assertRaises(ValueError):
                  parse_price("free")

          # 3. Add one more test method here. Name it test_total_adds_prices.
          #    It checks that total(["$5", "$1,299.50"]) equals 1304.5.


      suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestParsePrice)
      result = unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)
      print("ran", result.testsRun, "failures", len(result.failures), "errors", len(result.errors))
      for test, _details in result.failures + result.errors:
          print("FAILED", test.id().split(".")[-1])
check:
  output: |
    ValueError: where_it_failed > total > parse_price
    1304.5
    ran 4 failures 0 errors 0
  code:
    - pattern: 'traceback\.extract_tb\s*\('
      message: "Use traceback.extract_tb(error.__traceback__) to get the list of frames."
    - pattern: 'except\s+\w+(\s+as\s+\w+)?\s*:'
      message: "Use try / except in where_it_failed."
    - pattern: 'def\s+test_total_adds_prices'
      message: "Add a test method named test_total_adds_prices."
    - pattern: 'replace\(\s*"[,]"'
      message: "Remove the thousands separator with replace(\",\", \"\")."
hints:
  - "A traceback is a list of frames, one per function that was running. traceback.extract_tb(error.__traceback__) gives you that list, and every frame has a .name attribute (the function name)."
  - "In where_it_failed: try: func(*args) / except Exception as error: build a list with a list comprehension over traceback.extract_tb(error.__traceback__). In parse_price, float() cannot read a comma, so remove it first with a second replace. The new test is another method of the class that starts with test_."
  - "except Exception as error:  names = [frame.name for frame in traceback.extract_tb(error.__traceback__)]  return type(error).__name__ + \": \" + \" > \".join(names)      return float(text.replace(\"$\", \"\").replace(\",\", \"\"))      def test_total_adds_prices(self): self.assertEqual(total([\"$5\", \"$1,299.50\"]), 1304.5)"
solution:
  - name: main.py
    code: |
      import io
      import traceback
      import unittest


      def parse_price(text):
          return float(text.replace("$", "").replace(",", ""))


      def total(prices):
          result = 0
          for text in prices:
              result += parse_price(text)
          return result


      def where_it_failed(func, *args):
          try:
              func(*args)
          except Exception as error:
              names = [frame.name for frame in traceback.extract_tb(error.__traceback__)]
              return type(error).__name__ + ": " + " > ".join(names)
          return "ok"


      print(where_it_failed(total, ["$5", "free"]))

      print(total(["$5", "$1,299.50"]))


      class TestParsePrice(unittest.TestCase):
          def test_plain_dollars(self):
              self.assertEqual(parse_price("$5"), 5.0)

          def test_thousands_separator(self):
              self.assertEqual(parse_price("$1,299.50"), 1299.5)

          def test_text_is_an_error(self):
              with self.assertRaises(ValueError):
                  parse_price("free")

          def test_total_adds_prices(self):
              self.assertEqual(total(["$5", "$1,299.50"]), 1304.5)


      suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestParsePrice)
      result = unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)
      print("ran", result.testsRun, "failures", len(result.failures), "errors", len(result.errors))
      for test, _details in result.failures + result.errors:
          print("FAILED", test.id().split(".")[-1])
quiz:
  - q: "In a Python traceback, where is the actual error message?"
    options: ["On the first line", "On the very last line", "In the middle"]
    answer: 1
    explain: "Python prints 'Traceback (most recent call last)' first, then the calls from the oldest to the newest, and the error type and message last."
  - q: "How does unittest find the tests inside a TestCase class?"
    options: ["It runs every method of the class", "It runs only the method called main", "It runs the methods whose names start with test"]
    answer: 2
  - q: "What is the difference between a failure and an error in unittest?"
    options: ["A failure is an assertion that was not true, an error is an unexpected exception in the code or test", "They mean the same thing", "An error is a warning and a failure is a crash"]
    answer: 0
  - q: "Which assertion checks that some code raises ValueError?"
    options: ["with self.assertRaises(ValueError): ...", "self.assertTrue(ValueError)", "self.assertEqual(ValueError, None)"]
    answer: 0
---
Python gives you two great helpers for finding and preventing bugs: **tracebacks**, which explain exactly how a crash happened, and the built-in **`unittest`** module, which lets you write automatic tests without installing anything. This lesson shows both. The ideas are the same as in the JavaScript lessons: read the error, look inside with prints, and protect your code with tests.

## Reading a traceback

When a Python program crashes you see something like this:

```text
Traceback (most recent call last):
  File "main.py", line 12, in <module>
    print(total(["$5", "$1,299.50"]))
  File "main.py", line 9, in total
    result += parse_price(text)
  File "main.py", line 4, in parse_price
    return float(text.replace("$", ""))
ValueError: could not convert string to float: '1,299.50'
```

Read it **from the bottom up**:

1. **The last line** is the error: the type (`ValueError`) and the message (`could not convert string to float: '1,299.50'`).
2. **The line above it** (with the code) is where it happened: line 4, inside `parse_price`.
3. Going **up** shows who called whom: `parse_price` was called by `total`, which was called from the top level of the file (`<module>`).

The oldest call is at the top and the newest at the bottom, which is why it says "most recent call last". The message here tells the whole story: the text `1,299.50` contains a comma, and `float()` cannot read commas.

Common error types: `NameError` (unknown name), `TypeError` (wrong type, like `"a" + 1`), `ValueError` (right type, bad value), `IndexError` and `KeyError` (missing list index or dict key), `AttributeError` (the object has no such attribute) and `ZeroDivisionError`.

## Catching an error and inspecting it

```python
import traceback

try:
    int("abc")
except ValueError as error:
    print(type(error).__name__)     # prints: ValueError
    print(error)                    # prints: invalid literal for int() with base 10: 'abc'
    frames = traceback.extract_tb(error.__traceback__)
    print([frame.name for frame in frames])   # prints: ['<module>']
```

`error.__traceback__` holds the trail, and `traceback.extract_tb(...)` turns it into a list of frames. Each frame has `.name` (the function), `.lineno` (the line number) and `.line` (the code). In a real terminal `traceback.print_exc()` prints the usual full traceback to the screen.

## Debugging with print

As in JavaScript, label what you print, and print the **type** when you are not sure:

```python
price = "12"
print("price:", repr(price), type(price))   # prints: price: '12' <class 'str'>
```

`repr()` shows quotes around text, so you can see spaces and tell `"12"` from `12`. f-strings with `=` are a quick shortcut: `print(f"{price=}")` prints `price='12'`. On your own computer you can also type `breakpoint()` in the code to pause and inspect the program in the debugger.

## Tests with unittest

`unittest` is in the standard library. A test is a **method** inside a class that extends `unittest.TestCase`; method names must start with `test`:

```python
import unittest

def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):
    def test_adds_numbers(self):
        self.assertEqual(add(2, 3), 5)

    def test_adds_negative(self):
        self.assertEqual(add(-1, -1), -2)
```

The assertions you will use most:

| Assertion | Checks that |
| --- | --- |
| `assertEqual(a, b)` | `a == b` |
| `assertTrue(x)` / `assertFalse(x)` | `x` is truthy / falsy |
| `assertIn(item, container)` | `item` is in the list, string, dict... |
| `assertAlmostEqual(a, b)` | floats are equal up to 7 decimals |
| `with self.assertRaises(ValueError):` | the block raises that error |

On your computer you run tests from a terminal with `python -m unittest`. Here we run them from the program itself, so we can print our own short summary instead of the long report (which includes timings):

```python
suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestAdd)
result = unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)
print("ran", result.testsRun, "failures", len(result.failures), "errors", len(result.errors))
```

A **failure** means an assertion was not true. An **error** means an unexpected exception happened (a bug in the code or in the test). `result.failures` and `result.errors` are lists of `(test, details)` pairs.

> **Watch out:**
> * **Test names that do not start with `test`.** `def check_add(self)` is silently ignored, so `ran 0` could be a hint that your tests are not found.
> * **Forgetting `self`.** Methods need `self` as the first parameter and assertions are called as `self.assertEqual(...)`. Otherwise: `TypeError: test_x() takes 0 positional arguments but 1 was given`.
> * **Wrong order of the arguments.** `assertEqual(actual, expected)` works either way, but mixing them up makes the failure message confusing. Keep one order.
> * **Comparing floats with `assertEqual`.** `0.1 + 0.2` is not `0.3`. Use `assertAlmostEqual`.
> * **Reading the traceback from the top.** Start at the bottom: the last line says what went wrong.

> **Your turn:** (1) Finish `where_it_failed` using `try/except` and `traceback.extract_tb`, so that the first print shows `ValueError: where_it_failed > total > parse_price`. (2) The second print crashes: read the traceback and fix `parse_price` so it understands `$1,299.50`. (3) Add the test method `test_total_adds_prices` to the test class. The last output line must be `ran 4 failures 0 errors 0`.
