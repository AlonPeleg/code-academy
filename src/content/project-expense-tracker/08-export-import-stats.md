---
title: "Step 8: Export, import and statistics"
summary: "Round-trip the data through CSV with the csv module and finish with summary statistics and a full demo."
level: advanced
export:
  kind: python
  name: expense-tracker
runner: python
files:
  - name: main.py
    code: |
      # Expense Tracker - step 8: export, import and statistics
      # TODO 0: add the imports you need at the top: the modules for CSV files, for in-memory text
      # streams and for statistics.

      from datetime import datetime


      RAW = """
      # date, amount, category, note
      2025-02-03, 12.50, food, lunch
      2025-02-05,45,Transport,train pass
       2025-02-14 , 60.00 , fun , concert ticket
      2025-02-20, 80, bills, electricity
      2025-03-01, 8.20, FOOD, coffee and cake
      2025-03-02, 23.75, food, groceries

      2025-03-04, abc, fun, cinema
      2025-03-04, 15.00, transport, taxi
      2025-03-09, 30.00, fun, cinema and popcorn
      2025-03-10, 40, health, pharmacy, vitamins
      2025-03-12, 95.40, bills, internet and phone
      2025-13-01, 10, food, impossible month
      2025-03-15, 18.60, food, dinner
      2025-03-16, -5, food, refund
      lunch with Sam
      """

      BUDGETS = {"food": 50, "transport": 50, "fun": 35, "bills": 200}


      def add_expense(expenses, date, amount, category, note=""):
          expense = {"date": date, "amount": amount, "category": category, "note": note}
          expenses.append(expense)
          return expense


      def list_expenses(expenses):
          for number, expense in enumerate(expenses, start=1):
              print(f"{number}. {expense['date']} | {expense['category']} | {expense['amount']:.2f} | {expense['note']}")


      def total_spent(expenses):
          total = 0
          for expense in expenses:
              total += expense["amount"]
          return total


      def totals_by_category(expenses):
          totals = {}
          for expense in expenses:
              category = expense["category"]
              totals[category] = totals.get(category, 0) + expense["amount"]
          return totals


      def is_valid_date(text):
          if len(text) != 10:
              return False
          try:
              datetime.strptime(text, "%Y-%m-%d")
          except ValueError:
              return False
          return True


      def parse_line(line):
          parts = [part.strip() for part in line.split(",", 3)]
          if len(parts) < 3:
              raise ValueError("expected at least date, amount and category")
          date, amount_text, category = parts[0], parts[1], parts[2]
          note = parts[3] if len(parts) > 3 else ""
          if not is_valid_date(date):
              raise ValueError(f"bad date '{date}' (use YYYY-MM-DD)")
          try:
              amount = float(amount_text)
          except ValueError:
              raise ValueError(f"amount '{amount_text}' is not a number")
          if amount <= 0:
              raise ValueError(f"amount must be positive, got {amount_text}")
          if not category:
              raise ValueError("category is empty")
          return {"date": date, "amount": amount, "category": category.lower(), "note": note}


      def parse_lines(text):
          expenses = []
          errors = []
          for number, line in enumerate(text.splitlines(), start=1):
              line = line.strip()
              if not line or line.startswith("#"):
                  continue
              try:
                  expenses.append(parse_line(line))
              except ValueError as error:
                  errors.append(f"line {number}: {error}")
          return expenses, errors


      def month_of(expense):
          return expense["date"][:7]


      def expenses_in_month(expenses, month):
          return [expense for expense in expenses if month_of(expense) == month]


      def totals_by_month(expenses):
          totals = {}
          for expense in expenses:
              month = month_of(expense)
              totals[month] = totals.get(month, 0) + expense["amount"]
          return dict(sorted(totals.items()))


      def top_expenses(expenses, count=3):
          return sorted(expenses, key=lambda expense: expense["amount"], reverse=True)[:count]


      def check_budgets(expenses, budgets, month):
          totals = totals_by_category(expenses_in_month(expenses, month))
          lines = []
          for category in sorted(totals):
              spent = totals[category]
              limit = budgets.get(category)
              if limit is None:
                  lines.append(f"{category}: {spent:.2f} (no budget set)")
              elif spent > limit:
                  lines.append(f"{category}: {spent:.2f} of {limit:.2f} (OVER by {spent - limit:.2f})")
              elif spent >= 0.8 * limit:
                  lines.append(f"{category}: {spent:.2f} of {limit:.2f} (WARNING, {spent / limit:.0%} used)")
              else:
                  lines.append(f"{category}: {spent:.2f} of {limit:.2f} (OK)")
          return lines


      def shorten(text, width):
          if len(text) <= width:
              return text
          return text[: width - 3] + "..."


      def format_report(expenses):
          lines = []
          lines.append(f"{'DATE':<10}  {'CATEGORY':<10}  {'NOTE':<20}  {'AMOUNT':>9}")
          lines.append("-" * 55)
          total = 0
          for expense in sorted(expenses, key=lambda e: (e["date"], e["amount"])):
              note = shorten(expense["note"], 20)
              lines.append(f"{expense['date']:<10}  {expense['category']:<10}  {note:<20}  {expense['amount']:>9.2f}")
              total += expense["amount"]
          lines.append("-" * 55)
          lines.append(f"{'TOTAL':<46}{total:>9.2f}")
          lines.append("")
          lines.append("BY CATEGORY")
          for category, amount in sorted(totals_by_category(expenses).items(), key=lambda item: item[1], reverse=True):
              lines.append(f"{category:<10}  {amount:>9.2f}  {amount / total:>6.1%}")
          return "\n".join(lines)


      def to_csv(expenses):
          # TODO 1: write the expenses as CSV text and return it.
          # Make an in-memory text file, a dict-based CSV writer for it (fieldnames date, amount,
          # category, note; line ending "\n"), write the header row, then one row per expense.
          # Return everything that was written (the getvalue() method of the in-memory file).
          return ""


      def from_csv(text):
          # TODO 2: read CSV text back into a list of expense dicts.
          # A dict-based CSV reader over an in-memory file made from text gives one dict per row,
          # but every value is text: convert row["amount"] to a float before appending.
          return []


      def summary_stats(expenses):
          # TODO 3: return None for an empty list, otherwise a dict with
          #   "count" (how many), "mean" and "median" of the amounts (statistics module),
          #   and "largest" (the whole expense dict with the biggest amount: max with key=...).
          return None


      expenses, errors = parse_lines(RAW)
      for error in errors:
          print("warning: " + error)

      print(format_report(expenses))

      print()
      print("Budget check for 2025-03:")
      for line in check_budgets(expenses, BUDGETS, "2025-03"):
          print("  " + line)

      # TODO 4: wrap everything in the demo (all the lines above, from "expenses, errors = ..." on)
      # into a function called main (indent it) and call it on the last line.
      # Then add this to the END of main(), after the budget check:
      #   - an empty line, csv_text = to_csv(expenses), the heading "CSV export (first 3 lines):"
      #     and the first three lines of csv_text (csv_text.splitlines()[:3]), each indented 2 spaces
      #   - restored = from_csv(csv_text) and print("Round trip ok:", restored == expenses)
      #   - stats = summary_stats(restored) and print "Summary:" followed by the lines
      #       "  expenses: N", "  mean: X", "  median: X" (two decimals) and
      #       "  largest: 95.40 (internet and phone, 2025-03-12)"  (amount, note, date of stats["largest"])
check:
  output: |
    warning: line 10: amount 'abc' is not a number
    warning: line 15: bad date '2025-13-01' (use YYYY-MM-DD)
    warning: line 17: amount must be positive, got -5
    warning: line 18: expected at least date, amount and category
    DATE        CATEGORY    NOTE                     AMOUNT
    -------------------------------------------------------
    2025-02-03  food        lunch                     12.50
    2025-02-05  transport   train pass                45.00
    2025-02-14  fun         concert ticket            60.00
    2025-02-20  bills       electricity               80.00
    2025-03-01  food        coffee and cake            8.20
    2025-03-02  food        groceries                 23.75
    2025-03-04  transport   taxi                      15.00
    2025-03-09  fun         cinema and popcorn        30.00
    2025-03-10  health      pharmacy, vitamins        40.00
    2025-03-12  bills       internet and phone        95.40
    2025-03-15  food        dinner                    18.60
    -------------------------------------------------------
    TOTAL                                            428.45

    BY CATEGORY
    bills          175.40   40.9%
    fun             90.00   21.0%
    food            63.05   14.7%
    transport       60.00   14.0%
    health          40.00    9.3%

    Budget check for 2025-03:
      bills: 95.40 of 200.00 (OK)
      food: 50.55 of 50.00 (OVER by 0.55)
      fun: 30.00 of 35.00 (WARNING, 86% used)
      health: 40.00 (no budget set)
      transport: 15.00 of 50.00 (OK)

    CSV export (first 3 lines):
      date,amount,category,note
      2025-02-03,12.5,food,lunch
      2025-02-05,45.0,transport,train pass
    Round trip ok: True
    Summary:
      expenses: 11
      mean: 38.95
      median: 30.00
      largest: 95.40 (internet and phone, 2025-03-12)
  code:
    - { pattern: "import\\s+csv", message: "Import the csv module." }
    - { pattern: "StringIO\\s*\\(", message: "Use io.StringIO as the in-memory file." }
    - { pattern: "csv\\.(DictWriter|writer)\\s*\\(", message: "Write with csv.DictWriter (or csv.writer)." }
    - { pattern: "csv\\.(DictReader|reader)\\s*\\(", message: "Read with csv.DictReader (or csv.reader)." }
    - { pattern: "def\\s+main\\s*\\(", message: "Put the demo in def main():" }
    - { pattern: "statistics\\.(mean|median)|sum\\s*\\(", message: "Compute the mean (statistics.mean or sum / len)." }
hints:
  - "The csv module writes and reads CSV text correctly, including quotes around values that contain commas. It works on file-like objects, and io.StringIO is a file that lives in memory. Writing: DictWriter + writeheader + writerow. Reading: DictReader gives dicts, but with text values."
  - "to_csv: out = io.StringIO(); writer = csv.DictWriter(out, fieldnames=[\"date\", \"amount\", \"category\", \"note\"], lineterminator=\"\\n\"); writer.writeheader(); loop writer.writerow(expense); return out.getvalue(). from_csv: for row in csv.DictReader(io.StringIO(text)): row[\"amount\"] = float(row[\"amount\"])."
  - "summary_stats: amounts = [e[\"amount\"] for e in expenses]; return {\"count\": len(amounts), \"mean\": statistics.mean(amounts), \"median\": statistics.median(amounts), \"largest\": max(expenses, key=lambda e: e[\"amount\"])}. Put the demo into def main(): and call main() at the very end."
solution:
  - name: main.py
    code: |
      # Expense Tracker - step 8: export, import and statistics

      import csv
      import io
      import statistics
      from datetime import datetime


      RAW = """
      # date, amount, category, note
      2025-02-03, 12.50, food, lunch
      2025-02-05,45,Transport,train pass
       2025-02-14 , 60.00 , fun , concert ticket
      2025-02-20, 80, bills, electricity
      2025-03-01, 8.20, FOOD, coffee and cake
      2025-03-02, 23.75, food, groceries

      2025-03-04, abc, fun, cinema
      2025-03-04, 15.00, transport, taxi
      2025-03-09, 30.00, fun, cinema and popcorn
      2025-03-10, 40, health, pharmacy, vitamins
      2025-03-12, 95.40, bills, internet and phone
      2025-13-01, 10, food, impossible month
      2025-03-15, 18.60, food, dinner
      2025-03-16, -5, food, refund
      lunch with Sam
      """

      BUDGETS = {"food": 50, "transport": 50, "fun": 35, "bills": 200}


      def add_expense(expenses, date, amount, category, note=""):
          expense = {"date": date, "amount": amount, "category": category, "note": note}
          expenses.append(expense)
          return expense


      def list_expenses(expenses):
          for number, expense in enumerate(expenses, start=1):
              print(f"{number}. {expense['date']} | {expense['category']} | {expense['amount']:.2f} | {expense['note']}")


      def total_spent(expenses):
          total = 0
          for expense in expenses:
              total += expense["amount"]
          return total


      def totals_by_category(expenses):
          totals = {}
          for expense in expenses:
              category = expense["category"]
              totals[category] = totals.get(category, 0) + expense["amount"]
          return totals


      def is_valid_date(text):
          if len(text) != 10:
              return False
          try:
              datetime.strptime(text, "%Y-%m-%d")
          except ValueError:
              return False
          return True


      def parse_line(line):
          parts = [part.strip() for part in line.split(",", 3)]
          if len(parts) < 3:
              raise ValueError("expected at least date, amount and category")
          date, amount_text, category = parts[0], parts[1], parts[2]
          note = parts[3] if len(parts) > 3 else ""
          if not is_valid_date(date):
              raise ValueError(f"bad date '{date}' (use YYYY-MM-DD)")
          try:
              amount = float(amount_text)
          except ValueError:
              raise ValueError(f"amount '{amount_text}' is not a number")
          if amount <= 0:
              raise ValueError(f"amount must be positive, got {amount_text}")
          if not category:
              raise ValueError("category is empty")
          return {"date": date, "amount": amount, "category": category.lower(), "note": note}


      def parse_lines(text):
          expenses = []
          errors = []
          for number, line in enumerate(text.splitlines(), start=1):
              line = line.strip()
              if not line or line.startswith("#"):
                  continue
              try:
                  expenses.append(parse_line(line))
              except ValueError as error:
                  errors.append(f"line {number}: {error}")
          return expenses, errors


      def month_of(expense):
          return expense["date"][:7]


      def expenses_in_month(expenses, month):
          return [expense for expense in expenses if month_of(expense) == month]


      def totals_by_month(expenses):
          totals = {}
          for expense in expenses:
              month = month_of(expense)
              totals[month] = totals.get(month, 0) + expense["amount"]
          return dict(sorted(totals.items()))


      def top_expenses(expenses, count=3):
          return sorted(expenses, key=lambda expense: expense["amount"], reverse=True)[:count]


      def check_budgets(expenses, budgets, month):
          totals = totals_by_category(expenses_in_month(expenses, month))
          lines = []
          for category in sorted(totals):
              spent = totals[category]
              limit = budgets.get(category)
              if limit is None:
                  lines.append(f"{category}: {spent:.2f} (no budget set)")
              elif spent > limit:
                  lines.append(f"{category}: {spent:.2f} of {limit:.2f} (OVER by {spent - limit:.2f})")
              elif spent >= 0.8 * limit:
                  lines.append(f"{category}: {spent:.2f} of {limit:.2f} (WARNING, {spent / limit:.0%} used)")
              else:
                  lines.append(f"{category}: {spent:.2f} of {limit:.2f} (OK)")
          return lines


      def shorten(text, width):
          if len(text) <= width:
              return text
          return text[: width - 3] + "..."


      def format_report(expenses):
          lines = []
          lines.append(f"{'DATE':<10}  {'CATEGORY':<10}  {'NOTE':<20}  {'AMOUNT':>9}")
          lines.append("-" * 55)
          total = 0
          for expense in sorted(expenses, key=lambda e: (e["date"], e["amount"])):
              note = shorten(expense["note"], 20)
              lines.append(f"{expense['date']:<10}  {expense['category']:<10}  {note:<20}  {expense['amount']:>9.2f}")
              total += expense["amount"]
          lines.append("-" * 55)
          lines.append(f"{'TOTAL':<46}{total:>9.2f}")
          lines.append("")
          lines.append("BY CATEGORY")
          for category, amount in sorted(totals_by_category(expenses).items(), key=lambda item: item[1], reverse=True):
              lines.append(f"{category:<10}  {amount:>9.2f}  {amount / total:>6.1%}")
          return "\n".join(lines)


      def to_csv(expenses):
          out = io.StringIO()
          writer = csv.DictWriter(out, fieldnames=["date", "amount", "category", "note"], lineterminator="\n")
          writer.writeheader()
          for expense in expenses:
              writer.writerow(expense)
          return out.getvalue()


      def from_csv(text):
          expenses = []
          for row in csv.DictReader(io.StringIO(text)):
              row["amount"] = float(row["amount"])
              expenses.append(row)
          return expenses


      def summary_stats(expenses):
          if not expenses:
              return None
          amounts = [expense["amount"] for expense in expenses]
          return {
              "count": len(amounts),
              "mean": statistics.mean(amounts),
              "median": statistics.median(amounts),
              "largest": max(expenses, key=lambda expense: expense["amount"]),
          }


      def main():
          expenses, errors = parse_lines(RAW)
          for error in errors:
              print("warning: " + error)

          print(format_report(expenses))

          print()
          print("Budget check for 2025-03:")
          for line in check_budgets(expenses, BUDGETS, "2025-03"):
              print("  " + line)

          print()
          csv_text = to_csv(expenses)
          print("CSV export (first 3 lines):")
          for line in csv_text.splitlines()[:3]:
              print("  " + line)
          restored = from_csv(csv_text)
          print("Round trip ok:", restored == expenses)

          stats = summary_stats(restored)
          print("Summary:")
          print(f"  expenses: {stats['count']}")
          print(f"  mean: {stats['mean']:.2f}")
          print(f"  median: {stats['median']:.2f}")
          largest = stats["largest"]
          print(f"  largest: {largest['amount']:.2f} ({largest['note']}, {largest['date']})")


      main()
quiz:
  - q: "Why use the csv module instead of line.split(',') for writing and reading CSV?"
    options: ["split is not allowed on files", "csv handles values that contain commas or quotes correctly", "csv files must be binary"]
    answer: 1
  - q: "What is io.StringIO useful for here?"
    options: ["It gives you a file-like object in memory, so no real file is needed", "It encrypts the text", "It reads from the keyboard"]
    answer: 0
  - q: "Why does from_csv convert row['amount'] with float()?"
    options: ["csv always returns floats already", "Everything read from text is a string, and we need numbers for maths", "float() removes the quotes from the note"]
    answer: 1
---
A tracker that forgets everything when it closes is not much of a tracker. In this last step you add **export and import** with the `csv` module, **summary statistics**, and tie everything together in a `main()` function.

## Where we are

The tracker parses messy text into clean expenses, groups and sorts them, checks budgets and prints a formatted report. All data lives in memory only.

## What we will add

* `to_csv(expenses)`: the expenses as CSV text, the format every spreadsheet can open.
* `from_csv(text)`: reads such text back into a list of dicts.
* `summary_stats(expenses)`: count, mean, median and the largest expense.
* `main()`: the whole program as one function, the structure real scripts use.

Browser Python has no files or network, so we use `io.StringIO`, a text buffer that acts like a file but lives in memory. Code written for it works unchanged with a real file opened with `open(...)`, which is the point: you practise the real API.

## CSV in two minutes

CSV means "comma separated values": a header line followed by one record per line. Writing it by hand with `",".join(...)` goes wrong the moment a value contains a comma, like the note `pharmacy, vitamins`. The `csv` module takes care of **quoting** (`"pharmacy, vitamins"`) when writing and unquoting when reading.

```python
import csv
import io

out = io.StringIO()
writer = csv.DictWriter(out, fieldnames=["date", "amount", "category", "note"], lineterminator="\n")
writer.writeheader()                  # writes the column names
writer.writerow(expense)              # one dict becomes one line
text = out.getvalue()                 # everything written so far, as a string
```

`DictWriter` takes dicts and writes the values in the order of `fieldnames`. `lineterminator="\n"` keeps the line endings simple.

Reading is the mirror image:

```python
for row in csv.DictReader(io.StringIO(text)):
    print(row["category"])
```

`DictReader` uses the header line as keys and gives you one dict per row. **Everything it returns is text**, including the amount, so convert it with `float(row["amount"])` before using it in calculations.

## Walk-through

1. Add the imports at the top of the file: `csv`, `io` and `statistics`.
2. Write `to_csv` and `from_csv` as sketched above.
3. Write `summary_stats`. Return `None` for an empty list. Otherwise make a list of amounts with a comprehension, and return a dict with `count`, `mean` and `median` (`statistics.mean(amounts)`, `statistics.median(amounts)`) and `largest`. For the largest, use `max` with a key function: `max(expenses, key=lambda e: e["amount"])` returns the whole expense dict, not just the number.
4. Wrap the demo into `def main():` (indent everything) and call `main()` on the last line. Why? Code at the top level of a file runs as soon as the file is imported; putting it into a function lets other code import your functions without running the demo, and it keeps variables local.
5. Extend `main()` as the TODO describes: export, print the first three CSV lines, import again, and print `Round trip ok:` with the result of `restored == expenses`. Dicts and lists compare by value, so this is `True` only if nothing was lost on the way. Then print the summary lines.

A **round trip test** like this one (export, import, compare) is one of the simplest and most effective ways to prove that two functions fit together.

## Reading the statistics

The **mean** is the sum divided by the count. The **median** is the middle value after sorting, so one huge purchase moves the mean a lot but the median hardly at all. Here the mean (38.95) is higher than the median (30.00) because a few big bills pull it up. When the two differ a lot, your spending is "lumpy".

> **Watch out:**
> - `ValueError: could not convert string to float: 'amount'` means you read the header as a data row (or wrote the file without `writeheader`).
> - Without `lineterminator="\n"` the writer uses `\r\n`, and printing the CSV shows extra blank lines or odd comparisons.
> - Forgetting `float()` on the way back makes `restored == expenses` `False`, because `"12.5"` is not `12.5`.
> - `NameError: name 'csv' is not defined`: the import is missing.
> - `statistics.mean([])` raises `StatisticsError`, which is why `summary_stats` checks for an empty list first.

## What to build next

* Read the diary text from `input()` (the lessons' stdin box) so you can type new expenses.
* Store money as integer cents to avoid float rounding.
* Make `Expense` a `dataclass` instead of a dict and compare the two styles.
* Add category totals per month as a small table, or draw bars with `"#" * int(amount / 10)`.
* Let `BUDGETS` come from a CSV text too, with a function that validates it.
* Write a few tests with `assert parse_line("2025-03-04, 12.50, food, lunch")["amount"] == 12.5`.

> **Your turn:** add `import csv`, `import io` and `import statistics`, write `to_csv`, `from_csv` and `summary_stats`, put the demo in `main()` and call it. After the budget check print the CSV preview (`CSV export (first 3 lines):`), `Round trip ok: True` and a `Summary:` block with expenses, mean, median and the largest expense.
