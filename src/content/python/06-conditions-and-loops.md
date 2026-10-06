---
title: Conditions and loops
summary: Decide with if, repeat with for - and solve FizzBuzz.
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # For each number from 1 to 15:
      #   - print FizzBuzz if it is divisible by both 3 and 5
      #   - print Fizz if divisible by 3
      #   - print Buzz if divisible by 5
      #   - otherwise print the number itself
      # Tip: start with a for loop over a range, then add the chain of conditions inside it.
      # Replace the line below.
      pass
check:
  output: |
    1
    2
    Fizz
    4
    Buzz
    Fizz
    7
    8
    Fizz
    Buzz
    11
    Fizz
    13
    14
    FizzBuzz
  code:
    - { pattern: 'for\s+\w+\s+in\s+range\s*\(', message: "Use a for loop with range()." }
    - { pattern: '\belif\b', message: "Use elif for the extra cases." }
    - { pattern: '%', message: "Use the % (remainder) operator to test divisibility." }
hints:
  - "You need a for loop that visits 1 to 15, and inside it an if / elif / else chain. The order of the checks matters."
  - "Loop with for i in range(1, 16): (range stops BEFORE the last number). Test the combined case first, otherwise a number like 15 is caught by the Fizz test. A number is divisible by 3 when i % 3 == 0."
  - "for i in range(1, 16):   then indented:  if i % 15 == 0: print(\"FizzBuzz\")   elif i % 3 == 0: print(\"Fizz\")   elif i % 5 == 0: print(\"Buzz\")   else: print(i)"
solution:
  - name: main.py
    code: |
      for i in range(1, 16):
          if i % 15 == 0:
              print("FizzBuzz")
          elif i % 3 == 0:
              print("Fizz")
          elif i % 5 == 0:
              print("Buzz")
          else:
              print(i)
quiz:
  - q: What does range(1, 4) give?
    options: ["1, 2, 3, 4", "0, 1, 2, 3", "1, 2, 3"]
    answer: 2
    explain: range(start, stop) stops BEFORE the stop number.
  - q: Why is indentation important in Python?
    options: ["It only makes code pretty", "It shows which lines belong inside the if or loop", "It is ignored"]
    answer: 1
  - q: What does  10 % 3  equal?
    options: ["3", "0", "1"]
    answer: 2
  - q: In an if / elif / else chain, how many branches run?
    options: ["All of them", "Only the first one whose condition is true", "Exactly two"]
    answer: 1
---

So far every line of your program has run, one after another. Real programs need to make choices and repeat work. In this lesson you will use `if` to choose and `for` to repeat, and then solve a famous beginner puzzle called FizzBuzz.

## if, elif, else

A **condition** is a question that is `True` or `False`. The code indented below an `if` only runs when the condition is true:

```python
age = 15
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teen")
else:
    print("Child")
# prints: Teen
```

- `if` is checked first.
- `elif` (short for "else if") is only checked when everything above it was false. You can have as many as you like.
- `else` catches whatever is left. It has no condition.
- **Only one branch runs**, the first one that is true.

## Indentation and colons

Each `if`, `elif`, `else` and loop line ends with a colon `:`. The lines that belong to it are **indented** by 4 spaces. That indentation is not decoration, it is how Python knows where the block starts and ends:

```python
if age >= 18:
    print("Adult")      # inside the if
print("Done")           # always runs (not indented)
```

## for loops and range

A **loop** repeats code. `for` goes through a series of values, one at a time:

```python
for i in range(1, 4):
    print(i)
# prints: 1  2  3  (one per line)
```

`range(1, 4)` produces 1, 2, 3. It starts at the first number and stops **before** the second one. `range(5)` is shorthand for `0, 1, 2, 3, 4`. You can also loop over text or lists: `for letter in "abc":`.

## The remainder trick

`i % 3 == 0` means "dividing by 3 leaves nothing over", in other words "i is divisible by 3". You will use this check a lot.

## FizzBuzz

FizzBuzz is a classic exercise. Count from 1 to 15, but print `Fizz` for multiples of 3, `Buzz` for multiples of 5, and `FizzBuzz` for numbers that are multiples of both (15 is divisible by 3 and by 5). The trap: if you test "divisible by 3" first, the number 15 never reaches the combined case. **Put the most specific case first.**

> **Watch out:**
> - A missing colon gives `SyntaxError: expected ':'`.
> - Forgetting to indent the body gives `IndentationError: expected an indented block`.
> - Mixing tabs and spaces causes `TabError`. Stick to 4 spaces.
> - Using `=` in a condition (`if i % 3 = 0:`) is a `SyntaxError`. Compare with `==`.
> - Off-by-one: `range(1, 15)` stops at 14. To include 15 you need `range(1, 16)`.

> **Your turn:** replace `pass` with a `for` loop over the numbers 1 to 15 that prints `FizzBuzz`, `Fizz`, `Buzz` or the number itself, checking the combined case first.
