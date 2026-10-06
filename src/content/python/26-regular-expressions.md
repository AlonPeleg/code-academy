---
title: Regular expressions with re
summary: Find, extract and replace patterns in text with the re module, groups and sub.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import re

      log = """2024-03-01 ERROR disk full on /dev/sda1 (95%)
      2024-03-01 INFO backup done for ada@example.com
      2024-03-02 ERROR timeout after 30s
      2024-03-03 WARN low memory (12%) reported by grace@example.org
      2024-03-03 INFO login ok
      """

      # 1. Use a pattern with re.findall to collect every date (like 2024-03-01)
      #    from the whole text and print how many different dates there are.
      dates = []
      print("dates:", len(set(dates)))

      # 2. Parse each line with ONE pattern that has three named groups:
      #    date, level (capital letters) and message (the rest of the line).
      #    Count how many lines each level has and print the counts sorted
      #    by level, like  ERROR=2
      counts = {}
      for line in log.splitlines():
          pass
      for level in sorted(counts):
          print(f"{level}={counts[level]}")

      # 3. Find all email addresses and print them, joined by a comma and space.
      emails = []
      print(", ".join(emails))

      # 4. Replace every email by "<hidden>" and every number followed by a
      #    percent sign by "N%". Print the cleaned first two lines only.
      cleaned = log
      print("\n".join(cleaned.splitlines()[:2]))
check:
  output: |
    dates: 3
    ERROR=2
    INFO=2
    WARN=1
    ada@example.com, grace@example.org
    2024-03-01 ERROR disk full on /dev/sda1 (N%)
    2024-03-01 INFO backup done for <hidden>
  code:
    - { pattern: 're\.findall\s*\(', message: "Use re.findall for the dates and the emails." }
    - { pattern: '\(\?P<\w+>', message: "Use named groups like (?P<date>...)." }
    - { pattern: 're\.sub\s*\(', message: "Use re.sub to clean the text." }
    - { pattern: '\\d', message: "Use \\d (a digit) in your patterns." }
hints:
  - "A raw string r'...' keeps backslashes as they are, which is what patterns need. \\d means a digit, + means one or more, and (?P<name>...) captures a part under a name that you can read with match.group('name')."
  - "dates: re.findall(r'\\d{4}-\\d{2}-\\d{2}', log). Lines: re.match(r'(?P<date>\\S+) (?P<level>[A-Z]+) (?P<message>.*)', line), then counts[m.group('level')] = counts.get(m.group('level'), 0) + 1. Emails: [\\w.]+@[\\w.]+\\w. Clean with two re.sub calls."
  - "m = re.match(r'(?P<date>\\S+) (?P<level>[A-Z]+) (?P<message>.*)', line)   emails = re.findall(r'[\\w.]+@[\\w.]+\\w', log)   cleaned = re.sub(r'[\\w.]+@[\\w.]+\\w', '<hidden>', log)   cleaned = re.sub(r'\\d+%', 'N%', cleaned)"
solution:
  - name: main.py
    code: |
      import re

      log = """2024-03-01 ERROR disk full on /dev/sda1 (95%)
      2024-03-01 INFO backup done for ada@example.com
      2024-03-02 ERROR timeout after 30s
      2024-03-03 WARN low memory (12%) reported by grace@example.org
      2024-03-03 INFO login ok
      """

      dates = re.findall(r"\d{4}-\d{2}-\d{2}", log)
      print("dates:", len(set(dates)))

      line_pattern = re.compile(r"(?P<date>\S+) (?P<level>[A-Z]+) (?P<message>.*)")
      counts = {}
      for line in log.splitlines():
          m = line_pattern.match(line)
          if m:
              level = m.group("level")
              counts[level] = counts.get(level, 0) + 1
      for level in sorted(counts):
          print(f"{level}={counts[level]}")

      email_pattern = r"[\w.]+@[\w.]+\w"
      emails = re.findall(email_pattern, log)
      print(", ".join(emails))

      cleaned = re.sub(email_pattern, "<hidden>", log)
      cleaned = re.sub(r"\d+%", "N%", cleaned)
      print("\n".join(cleaned.splitlines()[:2]))
quiz:
  - q: What is the difference between re.match and re.search?
    options: ["They are the same function", "match only succeeds at the very start of the text, search looks anywhere", "search only works on numbers"]
    answer: 1
  - q: "What does the pattern  \\d+  match?"
    options: ["One or more digits in a row", "Exactly one letter d", "A backslash followed by d"]
    answer: 0
  - q: "Why are patterns usually written as raw strings like  r'\\d+'  ?"
    options: ["Raw strings run faster", "So Python does not treat the backslash as an escape before re sees it", "Raw strings allow lowercase only"]
    answer: 1
  - q: What does re.findall return when the pattern has no capture groups?
    options: ["The first match only", "A list of all the matched strings", "A match object"]
    answer: 1
    explain: "With groups, findall returns the group contents (tuples when there are several groups) instead of the whole match."
---

A **regular expression** (regex) is a tiny language for describing the shape of text: "four digits, a dash, two digits" or "letters, an at sign, more letters". Instead of looping over characters with `if` statements you describe the pattern once and let the `re` module do the searching. Validating input, scanning logs and cleaning data all become short.

## Building a pattern

Always write patterns as **raw strings** (`r"..."`): a leading `r` tells Python to keep backslashes untouched, because regex uses them a lot.

| Pattern | Meaning |
| --- | --- |
| `\d` | one digit (`\D` is anything but a digit) |
| `\w` | a letter, digit or underscore |
| `\s` | a space, tab or newline (`\S` is anything else) |
| `.` | any single character except a newline |
| `[abc]`, `[A-Z]` | one character from a set or range |
| `+`, `*`, `?` | one or more, zero or more, zero or one |
| `{4}`, `{2,3}` | exactly 4, between 2 and 3 |
| `^`, `$` | start and end of the text |
| `( )` | a group: part of the match you can pull out |

## The four main functions

```python
import re

text = "Order 66 shipped on 2024-03-01"

print(re.search(r"\d+", text).group())      # prints: 66  (first match anywhere)
print(re.match(r"\d+", text))               # prints: None (must match at the START)
print(re.findall(r"\d+", text))             # prints: ['66', '2024', '03', '01']
print(re.sub(r"\d", "#", text))             # prints: Order ## shipped on ####-##-##
```

- `re.search` finds the first match anywhere and returns a **match object**, or `None`.
- `re.match` is like `search` but only succeeds at the start.
- `re.findall` returns a list with every match.
- `re.sub(pattern, replacement, text)` returns new text with all matches replaced. The replacement can also be a function that receives each match.

If you reuse a pattern, compile it once: `pattern = re.compile(r"\d+")`, then call `pattern.search(text)`.

## Groups

Round brackets capture parts of the match. Give them names with `(?P<name>...)` so the code explains itself:

```python
m = re.match(r"(?P<year>\d{4})-(?P<month>\d{2})", "2024-03-01")
print(m.group("year"), m.group("month"))   # prints: 2024 03
print(m.groupdict())                       # prints: {'year': '2024', 'month': '03'}
```

Always check for `None` before calling `.group()`: a failed match returns `None`, and `None.group()` crashes.

## Greedy versus lazy

By default `+` and `*` are **greedy**: they take as much as possible. Adding `?` makes them lazy.

```python
html = "<b>one</b> and <b>two</b>"
print(re.findall(r"<b>.*</b>", html))    # one big match (greedy)
print(re.findall(r"<b>.*?</b>", html))   # ['<b>one</b>', '<b>two</b>'] (lazy)
```

> **Watch out:**
> - Forgetting the raw string: `"\d"` triggers a `SyntaxWarning` about an invalid escape sequence, and `"\b"` silently means a backspace character.
> - Calling `re.match(...).group()` on a failed match gives `AttributeError: 'NoneType' object has no attribute 'group'`.
> - `.` does not match a literal dot. To match a real dot write `\.`.
> - A broken pattern such as `r"(abc"` raises `re.error: missing ), unterminated subpattern`.
> - Regex is not a tool for everything: do not parse full HTML or validate every possible real email address with it. Keep patterns simple.

## Going further

Try the flag `re.IGNORECASE`, for example `re.findall(r"error", log, re.IGNORECASE)`, and `re.split(r"[,;]\s*", "a, b;c")` to split on several separators at once.

> **Your turn:** fill in the four parts: collect dates with `re.findall`, parse the lines with named groups and count levels, find the emails, and use `re.sub` to hide the emails and turn `95%` into `N%`.
