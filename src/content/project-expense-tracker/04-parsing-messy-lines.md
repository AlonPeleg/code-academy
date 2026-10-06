---
title: "Step 4: Parse messy lines with clear errors"
summary: "Turn text lines into expense dicts, rejecting bad input with helpful messages."
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # Expense Tracker - step 4: parsing messy lines

      from datetime import datetime


      SAMPLE = [
          ("2025-02-03", 12.50, "food", "lunch"),
          ("2025-02-05", 45.00, "transport", "train pass"),
          ("2025-02-14", 60.00, "fun", "concert ticket"),
          ("2025-02-20", 80.00, "bills", "electricity"),
          ("2025-03-01", 8.20, "food", "coffee and cake"),
          ("2025-03-02", 23.75, "food", "groceries"),
          ("2025-03-04", 15.00, "transport", "taxi"),
          ("2025-03-09", 30.00, "fun", "cinema and popcorn"),
          ("2025-03-12", 95.40, "bills", "internet and phone"),
          ("2025-03-15", 18.60, "food", "dinner"),
      ]


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
          # TODO 1: return True only for real dates written as YYYY-MM-DD.
          # Hint: datetime.strptime(text, "%Y-%m-%d") raises ValueError for impossible dates
          # such as 2025-13-01. Also require len(text) == 10 so that 2025-3-4 is rejected.
          return True


      def parse_line(line):
          # TODO 2: turn one line "date, amount, category, note" into an expense dict.
          #   - split at most 3 times, so that commas inside the note survive, and strip each part
          #   - fewer than 3 parts: raise ValueError("expected at least date, amount and category")
          #   - bad date: raise ValueError(f"bad date '{date}' (use YYYY-MM-DD)")
          #   - amount not a number: raise ValueError(f"amount '{amount_text}' is not a number")
          #   - amount zero or negative: raise ValueError(f"amount must be positive, got {amount_text}")
          #   - empty category: raise ValueError("category is empty")
          #   - the category is stored in lower case, the note is optional ("" when missing)
          return {}


      def parse_lines(text):
          # TODO 3: go through the text line by line (number the lines from 1).
          # Skip blank lines and lines starting with #. Call parse_line inside try/except ValueError.
          # Collect good expenses in one list and messages like "line 12: <error text>" in another.
          # Return both lists: return expenses, errors
          return [], []


      # TODO 4: the data now comes from the RAW text. Replace the three lines that build
      # expenses from SAMPLE with:
      #   expenses, errors = parse_lines(RAW)
      #   a line  Parsed N expenses, M problems   (use len of both lists)
      #   one line per error, indented with two spaces
      expenses = []
      for row in SAMPLE:
          add_expense(expenses, *row)

      list_expenses(expenses)
      print(f"Total spent: {total_spent(expenses):.2f}")

      print("By category:")
      for category, amount in totals_by_category(expenses).items():
          print(f"  {category}: {amount:.2f}")
check:
  output: |
    Parsed 11 expenses, 4 problems
      line 10: amount 'abc' is not a number
      line 15: bad date '2025-13-01' (use YYYY-MM-DD)
      line 17: amount must be positive, got -5
      line 18: expected at least date, amount and category
    1. 2025-02-03 | food | 12.50 | lunch
    2. 2025-02-05 | transport | 45.00 | train pass
    3. 2025-02-14 | fun | 60.00 | concert ticket
    4. 2025-02-20 | bills | 80.00 | electricity
    5. 2025-03-01 | food | 8.20 | coffee and cake
    6. 2025-03-02 | food | 23.75 | groceries
    7. 2025-03-04 | transport | 15.00 | taxi
    8. 2025-03-09 | fun | 30.00 | cinema and popcorn
    9. 2025-03-10 | health | 40.00 | pharmacy, vitamins
    10. 2025-03-12 | bills | 95.40 | internet and phone
    11. 2025-03-15 | food | 18.60 | dinner
    Total spent: 428.45
    By category:
      food: 63.05
      transport: 60.00
      fun: 90.00
      bills: 175.40
      health: 40.00
  code:
    - { pattern: "def\\s+parse_line", message: "Define parse_line(line)." }
    - { pattern: "raise\\s+ValueError", message: "Report problems with raise ValueError(\"...\")." }
    - { pattern: "except\\s+ValueError", message: "Catch ValueError so one bad line does not stop the program." }
    - { pattern: "strptime\\s*\\(", message: "Check the date with datetime.strptime(text, \"%Y-%m-%d\")." }
hints:
  - "Real input is messy: extra spaces, upper case, bad numbers, impossible dates. Each check that fails should raise ValueError with a message that says what is wrong. The loop that reads many lines catches the error, stores the message and goes on."
  - "line.split(\",\", 3) splits at most three times, then strip each part. float(amount_text) raises ValueError by itself for 'abc' (catch it and raise your own clearer message). datetime.strptime(text, \"%Y-%m-%d\") rejects 2025-13-01. In parse_lines use enumerate(text.splitlines(), start=1) for the line numbers."
  - "try: expenses.append(parse_line(line))  except ValueError as error: errors.append(f\"line {number}: {error}\")   and skip lines where not line or line.startswith(\"#\"). Finally return expenses, errors."
solution:
  - name: main.py
    code: |
      # Expense Tracker - step 4: parsing messy lines

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


      expenses, errors = parse_lines(RAW)
      print(f"Parsed {len(expenses)} expenses, {len(errors)} problems")
      for error in errors:
          print("  " + error)

      list_expenses(expenses)
      print(f"Total spent: {total_spent(expenses):.2f}")

      print("By category:")
      for category, amount in totals_by_category(expenses).items():
          print(f"  {category}: {amount:.2f}")
quiz:
  - q: "What does raise ValueError(\"bad date\") do?"
    options: ["Stops the function and signals a problem that a caller can catch with except ValueError", "Prints the text bad date and continues", "Returns the text bad date"]
    answer: 0
  - q: "Why does parse_lines catch the error instead of letting it crash?"
    options: ["Errors cannot be avoided in Python", "One bad line should not stop the good lines from being processed", "try/except makes the code faster"]
    answer: 1
  - q: "What does \"a, b, c, d, e\".split(\",\", 3) return?"
    options: ["['a', ' b', ' c', ' d, e']", "['a', 'b', 'c']", "['a', ' b', ' c', ' d', ' e']"]
    answer: 0
    explain: "The 3 limits the number of splits, so the last part keeps its commas."
---
So far the data was typed into the program by us. Real data arrives as **text**: lines pasted from a bank statement, typed by a person or exported from another tool. Text is messy, and a program that trusts it will crash or, worse, silently store nonsense. This step teaches **parsing** and **validation**.

## Where we are

The tracker can add expenses, list them, total them and group them by category, all from the built-in `SAMPLE` list. The starter now also contains `RAW`, a block of text in the style of a diary: one expense per line, with extra spaces, upper-case letters, a comment line, blank lines, and several lines with real mistakes.

## What we will add

* `parse_line(line)`: turns one line such as `2025-03-04, 12.50, food, lunch` into an expense dict, or raises `ValueError` with a clear message.
* `parse_lines(text)`: processes the whole text, keeps the good expenses and collects readable error messages with line numbers, instead of stopping at the first mistake.
* `is_valid_date(text)`: a helper to check a date.

Why it matters: good programs treat input as **untrusted**. The most common cause of bugs in real apps is data that was not what the author expected. Clear error messages ("line 15: bad date '2025-13-01'") let a user fix the problem in seconds.

## Walk-through

1. **Split and clean.** `line.split(",", 3)` cuts the line at the commas, but at most three times, so the note (the fourth part) may contain commas. Then remove spaces around each part:

```python
parts = [part.strip() for part in line.split(",", 3)]
```

   A list comprehension builds a new list by applying `strip()` to each part. If `len(parts) < 3`, raise an error; the note is optional.
2. **Raise errors.** `raise ValueError("message")` stops the function immediately and reports a problem. Use clear wording that says what was wrong and what was expected:

```python
if len(parts) < 3:
    raise ValueError("expected at least date, amount and category")
```

3. **Check the date.** The `datetime` module can test a date: `datetime.strptime(text, "%Y-%m-%d")` raises `ValueError` if the text is not a real date (month 13 is rejected). `strptime` also accepts `2025-3-4` without zero padding, so the helper additionally requires `len(text) == 10`. Wrap the call in `try`/`except ValueError` and return `False` or `True`.
4. **Check the amount.** `float("abc")` raises `ValueError` by itself, but its message (`could not convert string to float: 'abc'`) means little to a user. Catch it and raise your own:

```python
try:
    amount = float(amount_text)
except ValueError:
    raise ValueError(f"amount '{amount_text}' is not a number")
```

   Then reject zero and negative amounts, and an empty category. Store the category in lower case so `Food`, `FOOD` and `food` become one group.
5. **Parse many lines.** `parse_lines` loops with `enumerate(text.splitlines(), start=1)` to get line numbers. Skip lines that are blank or start with `#`. Call `parse_line` inside `try`, and in `except ValueError as error` add `f"line {number}: {error}"` to an `errors` list. Return both lists: `return expenses, errors`.
6. **Wire it in.** Replace the `SAMPLE` loop in the program with `expenses, errors = parse_lines(RAW)`, print `Parsed N expenses, M problems` and one indented line per error.

Notice the line numbers in the messages: the triple-quoted `RAW` string begins with a newline, so line 1 is empty, the comment is line 2 and the first expense is line 3. The numbers refer to lines within that text.

## The shape of good error handling

One bad line should never throw away the good ones. That is why `parse_line` **raises** and `parse_lines` **catches**: the low-level function reports, the high-level function decides what to do.

> **Watch out:**
> - `ValueError: not enough values to unpack` comes from writing `a, b, c, d = line.split(",")` when a line has fewer parts. Check `len(parts)` first.
> - Catching everything with a bare `except:` hides real bugs, such as a typo that raises `NameError`. Catch `ValueError` only.
> - `line.split(",")` without the limit breaks notes containing commas (`pharmacy, vitamins` would become two parts).
> - Forgetting `.strip()` makes `" food"` and `"food"` different categories and breaks the date test.
> - Do not `print` errors inside `parse_line`. Return or raise them so the caller decides.

> **Your turn:** write `is_valid_date`, `parse_line` and `parse_lines` as described in the starter, then parse `RAW` in the program. Expected: `Parsed 11 expenses, 4 problems`, the four error lines, and the list, total and category sections for the 11 good expenses.
