---
title: JSON and CSV data
summary: Parse and build JSON and CSV text with the json and csv modules, using io.StringIO instead of files.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import csv
      import io
      import json

      raw = """name,team,score
      Ava,red,90
      Noam,blue,72
      Maya,red,85
      "Lee, Jo",blue,60
      """

      # 1. Wrap raw in io.StringIO and read it with csv.DictReader.
      #    Build a list called rows with one dictionary per line, and turn
      #    the score of each row into an int. Print: rows: 4
      rows = []
      print("rows:", len(rows))

      # 2. Print the first row as JSON text, indented by 2 spaces and with the
      #    keys sorted alphabetically.

      # 3. Add up the scores per team in a dict called totals, then print it as
      #    compact JSON with sorted keys.
      totals = {}

      # 4. Round trip: convert rows to JSON text, parse that text back with
      #    json.loads and print whether the result equals rows (True or False).

      # 5. Write the totals as CSV into a new io.StringIO: a header line
      #    team,total and then one line per team in alphabetical order.
      #    Use lineterminator="\n" and print the text that was written.
check:
  output: |
    rows: 4
    {
      "name": "Ava",
      "score": 90,
      "team": "red"
    }
    {"blue": 132, "red": 175}
    True
    team,total
    blue,132
    red,175
  code:
    - { pattern: 'csv\.DictReader\s*\(', message: "Read the text with csv.DictReader." }
    - { pattern: 'json\.dumps\s*\(', message: "Build JSON text with json.dumps." }
    - { pattern: 'json\.loads\s*\(', message: "Parse JSON text with json.loads." }
    - { pattern: 'csv\.writer\s*\(|csv\.DictWriter\s*\(', message: "Write the CSV with csv.writer (or DictWriter)." }
hints:
  - "csv.DictReader gives each line as a dictionary whose keys come from the header line. json.dumps turns Python data into text, json.loads turns text back into Python data. Both csv tools read and write file-like objects such as io.StringIO."
  - "rows = [dict(r) for r in csv.DictReader(io.StringIO(raw))], then convert row['score'] with int(). json.dumps(rows[0], indent=2, sort_keys=True). For the CSV: out = io.StringIO(); w = csv.writer(out, lineterminator='\\n'); w.writerow(['team', 'total']); then one writerow per sorted team."
  - "for row in rows: row['score'] = int(row['score'])   totals[row['team']] = totals.get(row['team'], 0) + row['score']   print(json.dumps(totals, sort_keys=True))   print(json.loads(json.dumps(rows)) == rows)   for team in sorted(totals): w.writerow([team, totals[team]])   print(out.getvalue(), end='')"
solution:
  - name: main.py
    code: |
      import csv
      import io
      import json

      raw = """name,team,score
      Ava,red,90
      Noam,blue,72
      Maya,red,85
      "Lee, Jo",blue,60
      """

      rows = []
      for row in csv.DictReader(io.StringIO(raw)):
          row["score"] = int(row["score"])
          rows.append(row)
      print("rows:", len(rows))

      print(json.dumps(rows[0], indent=2, sort_keys=True))

      totals = {}
      for row in rows:
          totals[row["team"]] = totals.get(row["team"], 0) + row["score"]
      print(json.dumps(totals, sort_keys=True))

      text = json.dumps(rows)
      print(json.loads(text) == rows)

      out = io.StringIO()
      writer = csv.writer(out, lineterminator="\n")
      writer.writerow(["team", "total"])
      for team in sorted(totals):
          writer.writerow([team, totals[team]])
      print(out.getvalue(), end="")
quiz:
  - q: What is the difference between json.dumps and json.loads?
    options: ["dumps parses text into Python data, loads writes it", "dumps turns Python data into JSON text, loads turns JSON text into Python data", "They both only work on files"]
    answer: 1
    explain: "A handy memory trick: the s stands for string. There are also json.dump and json.load that work with file objects."
  - q: Why does the CSV module exist when you could just call line.split(',')?
    options: ["split is not allowed on text", "It handles quoted fields such as \"Lee, Jo\" that contain commas", "It makes the numbers convert themselves to int"]
    answer: 1
  - q: What type is row["score"] right after csv.DictReader read the line  Ava,red,90 ?
    options: ["int", "float", "str"]
    answer: 2
    explain: "CSV has no types. Everything arrives as text and you convert it yourself."
  - q: "What happens to a tuple such as  (1, 2)  after a JSON round trip?"
    options: ["It comes back as a list [1, 2]", "It comes back as a tuple", "It raises an error"]
    answer: 0
---

Two text formats carry most of the data in the world: **JSON** (nested data used by web APIs and settings files) and **CSV** (comma separated values, the format of spreadsheets). Python reads and writes both with the standard library. In real programs the text comes from a file or a web request. In this lesson we keep it in a string and wrap it in `io.StringIO`, which behaves like an open file, so everything works in the browser.

## JSON: the shape of Python data

JSON looks almost like Python dictionaries and lists:

```python
import json

person = {"name": "Ava", "langs": ["python", "js"], "active": True, "boss": None}

text = json.dumps(person)
print(text)
# prints: {"name": "Ava", "langs": ["python", "js"], "active": true, "boss": null}

back = json.loads(text)
print(back["langs"][0])    # prints: python
```

- `json.dumps(data)` turns Python data into a JSON **string** (the `s` means string).
- `json.loads(text)` turns JSON text into Python data.
- `True`, `False` and `None` become `true`, `false` and `null`, and back again.

Useful options of `dumps`: `indent=2` for readable output, `sort_keys=True` for a stable key order (great for comparing results and for tests), and `ensure_ascii=False` to keep non-English letters readable.

JSON only knows strings, numbers, booleans, null, lists and objects with **string keys**. So a round trip is not always lossless: a tuple comes back as a list, and `{1: "a"}` comes back as `{"1": "a"}`. Types like `set` or `datetime` cannot be dumped at all and raise `TypeError: Object of type set is not JSON serializable`.

## CSV: rows and columns

```python
import csv, io

text = "name,score\nAva,90\nNoam,72\n"

for row in csv.reader(io.StringIO(text)):
    print(row)               # prints: ['name', 'score'] then ['Ava', '90'] ...

for row in csv.DictReader(io.StringIO(text)):
    print(row["name"], row["score"])      # uses the header line as keys
```

- `csv.reader` yields each line as a list of strings.
- `csv.DictReader` uses the first line as keys, so you write `row["name"]` instead of `row[0]`.
- **Every value is a string.** `"90"` is not `90`, so convert with `int()` or `float()`.
- The module understands quotes: the line `"Lee, Jo",blue,60` has three fields, because the comma inside the quotes belongs to the name. This is why you should not use `line.split(",")` for real CSV.

## Writing CSV

```python
out = io.StringIO()
writer = csv.writer(out, lineterminator="\n")
writer.writerow(["team", "total"])
writer.writerow(["red", 175])
print(out.getvalue())
```

`csv.writer(stream)` adds quotes only where needed. By default it ends lines with `\r\n` (the Windows style, as the CSV standard says). Passing `lineterminator="\n"` gives plain newlines, which is easier to compare in tests. `out.getvalue()` returns everything written so far. For dictionaries there is `csv.DictWriter(stream, fieldnames=[...])` with `writeheader()` and `writerow(dict)`.

> **Watch out:**
> - Doing math on CSV values without converting: `"90" + "85"` gives `"9085"`, and `"90" + 1` raises `TypeError: can only concatenate str (not "int") to str`.
> - Passing a **string** to `csv.reader` instead of a stream: it then loops over single characters. Wrap the text in `io.StringIO(text)` or use `text.splitlines()`.
> - Mixing up `dumps` and `dump`: `json.dump(data)` without a file object fails with `TypeError: dump() missing 1 required positional argument: 'fp'`.
> - Invalid JSON, for example single quotes around a key, raises `json.JSONDecodeError: Expecting property name enclosed in double quotes`. Catch it with `try/except ValueError` since the error is a subclass of `ValueError`.
> - After `getvalue()` the extra `print` adds one more blank line. Use `print(text, end="")` when the text already ends with a newline.

## Going further

Pretty-print the whole `rows` list with `indent=2`, or write the rows back to CSV with `csv.DictWriter` and compare the text with `raw`. Notice that the name `"Lee, Jo"` gets its quotes back automatically.

> **Your turn:** read `raw` with `csv.DictReader`, convert the scores, print the first row as indented sorted JSON, add up the scores per team, check the JSON round trip, and write the totals as CSV into a `StringIO`.
