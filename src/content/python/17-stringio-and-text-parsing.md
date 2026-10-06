---
title: File-like I/O and text parsing
summary: Treat a string like a file with io.StringIO and parse lines of data into numbers.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import io

      data = """Ava,90
      Noam,72
      Maya,85
      """

      # 1. Make a text stream from data (a file-like object).
      # 2. Loop over the stream line by line. For each line, strip the newline,
      #    split it at the comma and turn the score into an int.
      # 3. Keep a running total, a count and the best (name, score) pair.
      # 4. Print three lines:
      #      Students: 3
      #      Average: 82.33
      #      Best: Ava (90)

      print("TODO")
check:
  output: |
    Students: 3
    Average: 82.33
    Best: Ava (90)
  code:
    - { pattern: 'StringIO\s*\(', message: "Create the stream with io.StringIO(data)." }
    - { pattern: '\.split\s*\(', message: "Split each line with .split(',')." }
    - { pattern: 'for\s+\w+\s+in\s+', message: "Loop over the stream with a for loop." }
hints:
  - "io.StringIO wraps a string so it behaves like an open file. A file can be looped over with for line in stream, and each line still ends with a newline character."
  - "stream = io.StringIO(data), then for line in stream: name, score = line.strip().split(','). Convert with int(score), add it to a total, add 1 to a count, and compare it with the best score so far."
  - "stream = io.StringIO(data); total = 0; count = 0; best = None   for line in stream: name, score = line.strip().split(','); score = int(score); total += score; count += 1; if best is None or score > best[1]: best = (name, score)   print(f\"Average: {total / count:.2f}\")"
solution:
  - name: main.py
    code: |
      import io

      data = """Ava,90
      Noam,72
      Maya,85
      """

      stream = io.StringIO(data)
      total = 0
      count = 0
      best = None

      for line in stream:
          name, score = line.strip().split(",")
          score = int(score)
          total += score
          count += 1
          if best is None or score > best[1]:
              best = (name, score)

      print(f"Students: {count}")
      print(f"Average: {total / count:.2f}")
      print(f"Best: {best[0]} ({best[1]})")
quiz:
  - q: What is io.StringIO useful for?
    options: ["It reads files from your hard disk", "It gives a string the same interface as an open file, so file-reading code works on text in memory", "It downloads text from the internet"]
    answer: 1
  - q: "What does a line read from a stream look like?"
    options: ["It never contains a newline", "It is a list of words", "It usually ends with a newline character, so you often call .strip()"]
    answer: 2
  - q: "Which call gives you everything written so far into a StringIO that you wrote to?"
    options: ["out.getvalue()", "out.read_all()", "out.text"]
    answer: 0
  - q: "What does 'Ava,90'.split(',') return?"
    options: ["'Ava90'", "['Ava', '90']", "('Ava', 90)"]
    answer: 1
    explain: "split returns a list of strings. The score is still text until you call int() on it."
---

Real programs read data from files, network sockets and pipes. In this browser Python there is no disk to read from, but Python has a neat trick: **file-like objects**. The module `io` provides `StringIO`, an object that holds text in memory but behaves exactly like a file you opened. Code written for files then works on any string, which is also how professionals test file-reading code without touching the disk.

## A string that acts like a file

```python
import io

text = "first\nsecond\nthird\n"
stream = io.StringIO(text)

print(stream.readline())   # prints: first   (plus the newline)
print(stream.read())       # the rest: second and third
```

A stream has a **position**, like a bookmark. `readline()` returns the next line and moves the bookmark; `read()` returns everything from the bookmark to the end. After that the bookmark is at the end, so a second `read()` returns an empty string `''`. Call `stream.seek(0)` to jump back to the beginning.

## Looping over lines

The most common way to use a stream is a `for` loop, which gives you one line at a time:

```python
for line in io.StringIO("a\nb\nc\n"):
    print(line.strip())    # strip() removes the trailing newline
```

Each line keeps its `\n` at the end, which is why `.strip()` is nearly always the first thing you do.

## Parsing a line

**Parsing** means turning raw text into structured values. For comma separated data the recipe is: strip, split, convert.

```python
line = "Ava,90\n"
name, score = line.strip().split(",")   # name = 'Ava', score = '90'
score = int(score)                       # now it is a number: 90
```

`split(",")` returns a list of strings, and writing `name, score = ...` unpacks the two items into two variables. Everything that comes out of text is a string, so convert numbers with `int()` or `float()` before doing maths.

## Writing to a stream

A StringIO can also collect output. `print` accepts a `file=` argument, so you can redirect it:

```python
out = io.StringIO()
print("hello", file=out)
out.write("world\n")
print(repr(out.getvalue()))   # prints: 'hello\nworld\n'
```

`getvalue()` returns everything written so far. This is handy for building a report as text before showing or saving it.

## Why this matters

A function that takes "anything file-like" is flexible: today you give it a StringIO in a test, tomorrow a real file opened with `open("data.csv")`, and the function does not change. Later you will meet the `csv` module, which also accepts file-like objects; `csv.reader(io.StringIO(data))` handles quotes and commas inside fields for you.

> **Watch out:**
> - Forgetting `.strip()`: the score is `'90\n'`. `int('90\n')` actually works, but comparing names or printing them shows stray blank lines.
> - Forgetting `int()`: `'90' > '100'` compares text and is `True`. Numbers read from text must be converted.
> - A blank line at the end of the data makes `split(",")` return one item and unpacking fails with `ValueError: not enough values to unpack (expected 2, got 1)`. Skip empty lines with `if not line.strip(): continue`.
> - Reading a stream twice: the second `read()` returns `''` because the bookmark is at the end. Use `seek(0)`.
> - `io.StringIO(data)` needs text. Passing bytes raises `TypeError: initial_value must be str or None, not bytes`.

## Going further

Try `csv.reader(io.StringIO(data))` and print each row, or add a header line `name,score` and skip it with `next(stream)` before the loop.

> **Your turn:** create a stream from `data` with `io.StringIO`, loop over its lines, split each one at the comma and convert the score to an int. Print the number of students, the average with two decimals and the best student as shown in the comments.
