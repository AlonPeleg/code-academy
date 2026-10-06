---
title: "Step 7: A neat formatted report"
summary: "Align columns with f-string format specs and add a totals row."
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # Expense Tracker - step 7: a formatted report

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
          # TODO 1: return text unchanged when it fits in `width` characters,
          # otherwise cut it and end it with "..." so the result is exactly `width` long.
          return text


      def format_report(expenses):
          # TODO 2: build the report as a list of lines and return them as one text.
          #   header:  DATE (left aligned, 10 wide), CATEGORY (left, 10), NOTE (left, 20), AMOUNT (right aligned, 9)
          #            separated by two spaces. Use format specs inside the f-string braces.
          #   a line of 55 dashes
          #   one row per expense sorted by date, notes shortened to 20 characters, amount with 2 decimals
          #   a line of 55 dashes
          #   the total row: the word TOTAL padded to 46 characters, then the total right aligned in 9
          #   an empty line, the heading BY CATEGORY, then one line per category, biggest first:
          #   name (left, 10), amount (right, 9, two decimals), two spaces, share of the total as a
          #   percentage with one decimal (right, 6 wide)
          # Finally join the lines with newline characters and return the text.
          return ""


      # TODO 3: rebuild the demo so it prints, in this order:
      #   - one line "warning: <error>" for every parse error (instead of the Parsed N line)
      #   - the report: print(format_report(expenses))
      #   - an empty line, then the budget check exactly as before.
      # Delete the total, category, month and top-3 prints: the report replaces them.
      expenses, errors = parse_lines(RAW)
      print(f"Parsed {len(expenses)} expenses, {len(errors)} problems")
      for error in errors:
          print("  " + error)

      print(f"Total spent: {total_spent(expenses):.2f}")

      print("By category (biggest first):")
      for category, amount in sorted(totals_by_category(expenses).items(), key=lambda item: item[1], reverse=True):
          print(f"  {category}: {amount:.2f}")

      print("By month:")
      for month, amount in totals_by_month(expenses).items():
          print(f"  {month}: {amount:.2f}")

      print("Top 3 expenses:")
      for expense in top_expenses(expenses, 3):
          print(f"  {expense['amount']:>7.2f}  {expense['date']}  {expense['note']}")

      print("Budget check for 2025-03:")
      for line in check_budgets(expenses, BUDGETS, "2025-03"):
          print("  " + line)
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
  code:
    - { pattern: ":<\\s*(10|20|46)\\b", message: "Align text columns with format specs like {value:<10}." }
    - { pattern: ":>\\s*9\\.2f", message: "Right-align amounts with {amount:>9.2f}." }
    - { pattern: "\\.join\\s*\\(", message: "Join the lines into one text with \"\\n\".join(lines)." }
hints:
  - "Inside an f-string, {value:<10} pads the text to 10 characters aligned left, {value:>9.2f} aligns a number to the right in 9 characters with 2 decimals. Fixed widths make columns line up. Build a list of lines and join them at the end."
  - "Header: f\"{'DATE':<10}  {'CATEGORY':<10}  {'NOTE':<20}  {'AMOUNT':>9}\". Rows: sorted(expenses, key=lambda e: (e['date'], e['amount'])). shorten(text, width): return text if short enough, else text[:width - 3] + \"...\". Separator lines: \"-\" * 55."
  - "lines.append(f\"{'TOTAL':<46}{total:>9.2f}\") for the totals row, and for the category block f\"{category:<10}  {amount:>9.2f}  {amount / total:>6.1%}\" with the categories sorted biggest first. return \"\\n\".join(lines)"
solution:
  - name: main.py
    code: |
      # Expense Tracker - step 7: a formatted report

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


      expenses, errors = parse_lines(RAW)
      for error in errors:
          print("warning: " + error)

      print(format_report(expenses))

      print()
      print("Budget check for 2025-03:")
      for line in check_budgets(expenses, BUDGETS, "2025-03"):
          print("  " + line)
quiz:
  - q: "What does f\"{'ab':<5}|\" produce?"
    options: ["'ab   |'", "'   ab|'", "'ab|'"]
    answer: 0
  - q: "What does the 9 mean in {amount:>9.2f}?"
    options: ["Nine decimal places", "A field that is 9 characters wide, right aligned", "Only amounts below 9 are allowed"]
    answer: 1
  - q: "Why build the report as a list of lines and join them?"
    options: ["Printing many small lines is not allowed", "join is the only way to add newlines", "You get one string to print, save or test, instead of printing inside the function"]
    answer: 2
---
Numbers are only useful when people can read them. Right now the output is a pile of loose prints. In this step you build a proper **report**: a table with aligned columns, a header, separators and a totals row, like the ones a bank prints.

## Where we are

The tracker parses messy text, summarises by category and month, and checks budgets. All that information is printed with ad-hoc `print` calls whose lines do not line up.

## What we will add

A function `format_report(expenses)` that **returns** the whole report as one string, plus a helper `shorten(text, width)` for long notes. The demo then just prints it. Returning a string (instead of printing) means the same report can later go to a file, an e-mail or a test.

## Format specs: alignment in f-strings

Inside the braces of an f-string, after a colon, you can describe how to lay out the value:

| Spec | Meaning | Example | Result |
|---|---|---|---|
| `{x:<10}` | left aligned in 10 characters | `f"{'food':<10}\|"` | `food      \|` |
| `{x:>9.2f}` | right aligned, width 9, 2 decimals | `f"{12.5:>9.2f}"` | `    12.50` |
| `{x:>6.1%}` | right aligned percentage, 1 decimal | `f"{0.409:>6.1%}"` | ` 40.9%` |
| `{x:^8}` | centred in 8 characters | `f"{'hi':^8}"` | `   hi   ` |

Text is left aligned by default and numbers right aligned, but stating it explicitly makes the intention clear. Text columns are padded with spaces, so every row has the same width and the columns line up in a monospaced font. The output panel uses one.

## Walk-through

1. **`shorten(text, width)`**: if `len(text) <= width` return the text as it is; otherwise return `text[:width - 3] + "..."`. The result is then never longer than `width`.
2. **Collect lines in a list.** Start with `lines = []`, append to it, and at the end `return "\n".join(lines)`. `"\n".join(lines)` glues the items together with a newline between them.
3. **Header**: the four column titles with the same specs as the rows, separated by two spaces: date `<10`, category `<10`, note `<20`, amount `>9`. To use a literal text inside an f-string spec, write it as a string in the braces: `{'DATE':<10}`.
4. **A rule line**: text can be multiplied. `"-" * 55` is 55 dashes (10 + 2 + 10 + 2 + 20 + 2 + 9 = 55).
5. **Rows**: loop over `sorted(expenses, key=lambda e: (e["date"], e["amount"]))`. Sorting by a **tuple** sorts by the date first and uses the amount only to break ties, so the report is always in a stable order. Use `shorten` on the note.
6. **Totals row**: keep `total` as you loop, and add `f"{'TOTAL':<46}{total:>9.2f}"`. The 46 is the width of the first three columns plus their separators, so the number lands under the amount column.
7. **Category summary**: an empty line `""`, the heading `BY CATEGORY`, and one line per category (biggest first) with its total and its **share** of the whole: `amount / total` formatted with `:>6.1%`.
8. **Rebuild the demo**: print `warning: ...` for every parse error, then `print(format_report(expenses))`, then an empty `print()` and the budget check as before. The report replaces the older total, category, month and top 3 prints, so delete those.

## Designing for the reader

A good report answers three questions at a glance: what happened (rows), how much in total (the totals row) and where did it go (the share per category). The separators and the header guide the eye. Aim for a layout that a person can scan in five seconds.

> **Watch out:**
> - Numbers that are strings do not accept `.2f`: `ValueError: Unknown format code 'f' for object of type 'str'`. Format the amount, not the text.
> - If the columns drift, check that every row uses exactly the same widths and separators as the header. A single extra space shifts the rest.
> - A note longer than the field width is not cut by `:<20`; it pushes the columns to the right. That is why `shorten` exists.
> - Dividing by `total` when the list is empty gives `ZeroDivisionError`. A real report would handle the empty case first.
> - `"\n".join(lines)` needs a list of **strings**; adding a number to `lines` raises `TypeError: sequence item 3: expected str instance, int found`.

> **Your turn:** write `shorten` and `format_report`, then change the demo to print the parse warnings, the report, an empty line and the budget check. The report's first line must be `DATE        CATEGORY    NOTE                     AMOUNT`, the totals row ends in `428.45`, and the category block starts with `bills          175.40   40.9%`.
