---
title: Testing with assert
summary: Write small test functions, run them with a tiny runner and catch bugs before your users do.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      def run_tests():
          passed = 0
          names = [n for n in list(globals()) if n.startswith("test_")]
          for name in names:
              try:
                  globals()[name]()
                  print(f"PASS {name}")
                  passed += 1
              except AssertionError as error:
                  print(f"FAIL {name}: {error}")
          print(f"{passed}/{len(names)} tests passed")


      # 1. Write is_palindrome(text): True when the text reads the same forwards
      #    and backwards, ignoring upper/lower case and everything that is not
      #    a letter or digit. ("A man, a plan, a canal: Panama" is a palindrome.)
      def is_palindrome(text):
          pass


      # 2. Write average(numbers): the sum divided by the count.
      #    For an empty list raise ValueError("no numbers").
      def average(numbers):
          pass


      def test_palindrome_simple():
          assert is_palindrome("level")
          assert not is_palindrome("python")


      def test_palindrome_sentence():
          assert is_palindrome("A man, a plan, a canal: Panama")


      def test_average():
          assert average([2, 4, 6]) == 4


      # 3. Write test_average_empty(): call average([]) inside try/except and
      #    make sure a ValueError happens. If no error happens the test must
      #    fail with assert False, "expected ValueError".


      run_tests()
check:
  output: |
    PASS test_palindrome_simple
    PASS test_palindrome_sentence
    PASS test_average
    PASS test_average_empty
    4/4 tests passed
  code:
    - { pattern: 'def\s+test_average_empty', message: "Write the test function test_average_empty." }
    - { pattern: 'raise\s+ValueError', message: "average must raise ValueError for an empty list." }
    - { pattern: 'except\s+ValueError', message: "Catch ValueError in the test." }
hints:
  - "A test is a small function that uses assert condition. If the condition is false Python raises AssertionError and the runner prints FAIL. Test names start with test_ so the runner finds them."
  - "is_palindrome: build cleaned = [c.lower() for c in text if c.isalnum()] and compare it with cleaned[::-1]. average: if not numbers: raise ValueError('no numbers'); return sum(numbers) / len(numbers). For the last test use try: average([]) except ValueError: pass else: assert False, 'expected ValueError'."
  - "def is_palindrome(text):     cleaned = [c.lower() for c in text if c.isalnum()]     return cleaned == cleaned[::-1]   def average(numbers):     if not numbers:         raise ValueError('no numbers')     return sum(numbers) / len(numbers)   def test_average_empty():     try:         average([])     except ValueError:         pass     else:         assert False, 'expected ValueError'"
solution:
  - name: main.py
    code: |
      def run_tests():
          passed = 0
          names = [n for n in list(globals()) if n.startswith("test_")]
          for name in names:
              try:
                  globals()[name]()
                  print(f"PASS {name}")
                  passed += 1
              except AssertionError as error:
                  print(f"FAIL {name}: {error}")
          print(f"{passed}/{len(names)} tests passed")


      def is_palindrome(text):
          cleaned = [c.lower() for c in text if c.isalnum()]
          return cleaned == cleaned[::-1]


      def average(numbers):
          if not numbers:
              raise ValueError("no numbers")
          return sum(numbers) / len(numbers)


      def test_palindrome_simple():
          assert is_palindrome("level")
          assert not is_palindrome("python")


      def test_palindrome_sentence():
          assert is_palindrome("A man, a plan, a canal: Panama")


      def test_average():
          assert average([2, 4, 6]) == 4


      def test_average_empty():
          try:
              average([])
          except ValueError:
              pass
          else:
              assert False, "expected ValueError"


      run_tests()
quiz:
  - q: What does assert x == 3 do when x is 5?
    options: ["Prints False and continues", "Raises AssertionError", "Changes x to 3"]
    answer: 1
  - q: Why do test functions have names starting with test_ ?
    options: ["Python requires it for every function", "It makes them run faster", "Test runners such as pytest and our little runner look for that prefix to find tests"]
    answer: 2
  - q: What is a good test?
    options: ["One that prints a lot", "One with a clear expected result that gives the same answer every time", "One that depends on the current time"]
    answer: 1
  - q: Why also test the odd cases such as an empty list or an empty string?
    options: ["Bugs tend to hide at the edges, where code makes hidden assumptions", "Because the normal cases never fail", "Because Python requires it"]
    answer: 0
---

Every program has bugs. The question is whether you find them or your users do. **Automated tests** are small pieces of code that call your functions with known inputs and check the answers. Once written they cost nothing to re-run, so you can change your code later and know immediately if something broke. Real projects use tools such as `pytest` or `unittest`; here you will build the idea from scratch with nothing but `assert`.

## The assert statement

`assert condition` does nothing when the condition is true, and raises `AssertionError` when it is false. You can add a message after a comma:

```python
assert 1 + 1 == 2                    # fine, silent
assert len("abc") == 4, "length is wrong"
# AssertionError: length is wrong
```

An assertion states "this must be true, or something is wrong". A failing one stops the program at the exact point with a clear message.

## Your first test function

A **test** is a normal function that calls the code under test and asserts the result:

```python
def double(x):
    return x * 2

def test_double():
    assert double(3) == 6
    assert double(0) == 0
    assert double(-2) == -4
```

Good habits for choosing checks:

- **Typical case**: a normal input.
- **Edge cases**: empty list, zero, one item, a very long text, negative numbers.
- **Error cases**: input that should raise an error.

## A tiny test runner

A runner finds the tests, runs each one, catches failures and reports. That is all pytest does at its core:

```python
def run_tests():
    for name in [n for n in list(globals()) if n.startswith("test_")]:
        try:
            globals()[name]()
            print("PASS", name)
        except AssertionError as error:
            print("FAIL", name, error)
```

`globals()` is a dictionary of every name defined in your file, so we can find every function whose name starts with `test_`. A failing assert raises `AssertionError`, which we catch so the other tests still run. Because dictionaries keep insertion order, tests run in the order you wrote them, which keeps the output deterministic.

## Testing that an error happens

Sometimes the correct behaviour is to raise an exception. Test it with `try`, `except` and `else`:

```python
def test_divide_by_zero():
    try:
        1 / 0
    except ZeroDivisionError:
        pass                          # good, this is what we wanted
    else:
        assert False, "expected ZeroDivisionError"
```

The `else` part only runs when no exception happened, which means the test must fail. (In pytest you would write `with pytest.raises(ZeroDivisionError):`.)

## Test first, then fix

A powerful workflow: write the failing test first, see it fail, then write the code until it passes. Run the starter code of this lesson and you will see failures. Making them all green is the exercise. When you find a bug later, first write a test that reproduces it; then it can never come back unnoticed.

## Floating point numbers

Do not compare floats with `==`: `0.1 + 0.2 == 0.3` is `False`. Use `abs(a - b) < 1e-9` or `math.isclose(a, b)`.

> **Watch out:**
> - A test that never runs: if the name does not start with `test_` the runner silently skips it. Check the count in the summary line.
> - `assert (x == 1, "message")` with brackets around both parts is always true because a non-empty tuple is truthy. Write `assert x == 1, "message"`.
> - Running Python with the `-O` option removes assert statements, so never use assert to validate user input; use `if` and `raise ValueError(...)` instead. That is also why `average` raises an exception rather than asserting.
> - Tests that depend on randomness, the clock or the network fail unpredictably. Keep tests deterministic.
> - Putting many unrelated checks in one test: the first failure hides the rest. Prefer small focused tests with clear names.

> **Your turn:** implement `is_palindrome` and `average` (raising `ValueError("no numbers")` for an empty list), then write the missing test `test_average_empty`. All four tests should print PASS.
