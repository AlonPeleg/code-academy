---
title: Numbers and math
summary: Use operators, whole-number division, remainders, powers and round().
level: beginner
runner: python
files:
  - name: main.py
    code: |
      seconds = 3725

      # 1. Work out how many whole hours are in `seconds` (there are 3600 seconds in an hour)
      # 2. Work out how many seconds are left over after removing those hours
      # 3. From the leftover, work out whole minutes, and the seconds that remain
      # 4. Print the three parts like this: 1h 2m 5s   (use an f-string)
      # 5. Print 2 to the power of 10
      # 6. Print 10 divided by 3, rounded to 2 decimal places
check:
  output: |
    1h 2m 5s
    1024
    3.33
  code:
    - { pattern: '//', message: "Use // (whole-number division) to get hours and minutes." }
    - { pattern: '%', message: "Use % (remainder) to get what is left over." }
    - { pattern: '\*\*', message: "Use ** for the power." }
    - { pattern: 'round\s*\(', message: "Use round() for the last line." }
hints:
  - "Whole-number division throws away the decimals, and the remainder operator gives what is left over. Together they split a total into parts."
  - "hours = seconds // 3600 and then left = seconds % 3600. Repeat the same trick with 60 on the leftover. For the end use ** and round(number, digits)."
  - "hours = seconds // 3600   left = seconds % 3600   minutes = left // 60   secs = left % 60   then print(f\"{hours}h {minutes}m {secs}s\"), print(2 ** 10), print(round(10 / 3, 2))"
solution:
  - name: main.py
    code: |
      seconds = 3725

      hours = seconds // 3600
      left = seconds % 3600
      minutes = left // 60
      secs = left % 60

      print(f"{hours}h {minutes}m {secs}s")
      print(2 ** 10)
      print(round(10 / 3, 2))
quiz:
  - q: What does  17 // 5  equal?
    options: ["3.4", "3", "2"]
    answer: 1
    explain: // divides and throws the decimals away, so 17 // 5 is 3.
  - q: What does  17 % 5  equal?
    options: ["2", "3", "0"]
    answer: 0
    explain: 5 fits into 17 three times (15) and 2 is left over.
  - q: What is the result of  7 / 2  in Python?
    options: ["3", "3.5", "4"]
    answer: 1
  - q: Which operator raises a number to a power?
    options: ["^", "**", "pow"]
    answer: 1
---

Python is a very good calculator, and nearly every program does some math: totals, averages, timers, scores. In this lesson you will learn all the arithmetic operators and the two surprising ones, `//` and `%`.

## The operators

| Operator | Meaning | Example | Result |
| --- | --- | --- | --- |
| `+` | add | `7 + 2` | `9` |
| `-` | subtract | `7 - 2` | `5` |
| `*` | multiply | `7 * 2` | `14` |
| `/` | divide (always gives decimals) | `7 / 2` | `3.5` |
| `//` | whole-number division | `7 // 2` | `3` |
| `%` | remainder | `7 % 2` | `1` |
| `**` | power | `7 ** 2` | `49` |

Two kinds of numbers appear: **int** (whole numbers like `5`) and **float** (numbers with a decimal point like `5.0` or `3.14`). Note that `/` always produces a float, even when the answer is whole: `10 / 2` is `5.0`.

## Division, whole-number division and remainder

Imagine sharing 17 sweets between 5 children. Each child gets 3 sweets, and 2 sweets are left over. Python can tell you both parts:

```python
print(17 // 5)   # prints: 3   (how many whole times 5 fits into 17)
print(17 % 5)    # prints: 2   (what is left over)
print(17 / 5)    # prints: 3.4 (the exact answer)
```

These two operators are a perfect pair for splitting a total into units, like seconds into minutes and seconds, or cents into dollars and cents:

```python
total = 135
print(total // 60)   # prints: 2   minutes
print(total % 60)    # prints: 15  seconds
```

The remainder also answers "is it even?": `n % 2 == 0` is true for even numbers.

## Order of operations

Python follows the same rules as school math: power first, then `*` `/` `//` `%`, then `+` `-`. Use round brackets to be explicit:

```python
print(2 + 3 * 4)     # prints: 14
print((2 + 3) * 4)   # prints: 20
```

## Handy functions

```python
print(round(3.14159, 2))   # prints: 3.14
print(abs(-7))             # prints: 7
print(max(3, 9, 4))        # prints: 9
print(min(3, 9, 4))        # prints: 3
```

`round(number, digits)` rounds to that many decimals. Careful: `round(2.5)` gives `2` because Python rounds exact halves to the nearest even number.

> **Watch out:**
> - Dividing by zero crashes with `ZeroDivisionError: division by zero`.
> - `^` is not "power" in Python. It is a different operation, so use `**`.
> - Decimals are stored approximately: `0.1 + 0.2` prints `0.30000000000000004`. Use `round()` when showing results.
> - Mixing text and numbers, as in `"5" + 2`, gives `TypeError`. Convert with `int("5")` first.

> **Your turn:** split `3725` seconds into hours, minutes and seconds using `//` and `%`, print them as `1h 2m 5s`, then print `2 ** 10` and `10 / 3` rounded to two decimals.
