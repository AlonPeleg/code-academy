---
title: "Step 5: Monthly report and sorting"
summary: "Group by month, sort categories and find the biggest expenses."
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # Expense Tracker - step 5: monthly report

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


      def month_of(expense):
          # TODO 1: return the month part of the date as text, e.g. "2025-03" (the first 7 characters).
          return ""


      def expenses_in_month(expenses, month):
          # TODO 2: return a new list with only the expenses of that month (use month_of).
          return []


      def totals_by_month(expenses):
          # TODO 3: like totals_by_category, but grouped by month.
          # Return a dict whose keys are in calendar order (sort the pairs, then build a dict from them).
          return {}


      def top_expenses(expenses, count=3):
          # TODO 4: return the `count` biggest expenses, biggest first.
          # Sort by amount, biggest first (sorted with a key function and reverse), then slice the first `count`.
          return []


      expenses, errors = parse_lines(RAW)
      print(f"Parsed {len(expenses)} expenses, {len(errors)} problems")
      for error in errors:
          print("  " + error)

      # TODO 5: the demo is getting long. Delete the next line (the full list).
      list_expenses(expenses)
      print(f"Total spent: {total_spent(expenses):.2f}")

      # TODO 6: show the categories biggest total first. Change the heading to
      # "By category (biggest first):" and loop over the pairs of totals_by_category(expenses).items()
      # sorted by their second element (the amount), biggest first.
      print("By category:")
      for category, amount in totals_by_category(expenses).items():
          print(f"  {category}: {amount:.2f}")

      print("By month:")
      for month, amount in totals_by_month(expenses).items():
          print(f"  {month}: {amount:.2f}")

      print("Top 3 expenses:")
      for expense in top_expenses(expenses, 3):
          print(f"  {expense['amount']:>7.2f}  {expense['date']}  {expense['note']}")
check:
  output: |
    Parsed 11 expenses, 4 problems
      line 10: amount 'abc' is not a number
      line 15: bad date '2025-13-01' (use YYYY-MM-DD)
      line 17: amount must be positive, got -5
      line 18: expected at least date, amount and category
    Total spent: 428.45
    By category (biggest first):
      bills: 175.40
      fun: 90.00
      food: 63.05
      transport: 60.00
      health: 40.00
    By month:
      2025-02: 197.50
      2025-03: 230.95
    Top 3 expenses:
        95.40  2025-03-12  internet and phone
        80.00  2025-02-20  electricity
        60.00  2025-02-14  concert ticket
  code:
    - { pattern: "sorted\\s*\\(", message: "Use sorted(...) for ordering." }
    - { pattern: "key\\s*=\\s*lambda", message: "Sort with key=lambda ...." }
    - { pattern: "\\[\\s*:\\s*7\\s*\\]", message: "The month is the first 7 characters of the date: date[:7]." }
hints:
  - "Dates written as YYYY-MM-DD make this easy: the month is the first 7 characters, date[:7]. Grouping by month is the same accumulator pattern as grouping by category. sorted() with key= decides what to sort by."
  - "month_of: return expense[\"date\"][:7]. expenses_in_month: a list comprehension [e for e in expenses if month_of(e) == month]. top_expenses: sorted(expenses, key=lambda expense: expense[\"amount\"], reverse=True)[:count]."
  - "totals_by_month: totals[month] = totals.get(month, 0) + expense[\"amount\"] and return dict(sorted(totals.items())). In the demo delete the list_expenses call and loop over sorted(totals_by_category(expenses).items(), key=lambda item: item[1], reverse=True)."
solution:
  - name: main.py
    code: |
      # Expense Tracker - step 5: monthly report

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
quiz:
  - q: "What does \"2025-03-15\"[:7] give?"
    options: ["'2025-03-15'", "'03-15'", "'2025-03'"]
    answer: 2
  - q: "What does key=lambda item: item[1] tell sorted()?"
    options: ["Compare the items by their second element", "Remove the second element", "Sort by the first element"]
    answer: 0
  - q: "Why does sorting date strings in the form YYYY-MM-DD give calendar order?"
    options: ["Python knows they are dates", "Because the biggest unit comes first, so alphabetical order equals date order", "It does not, you must convert them to numbers"]
    answer: 1
---
A list of totals is useful, but people think in **months**: "How much did I spend in March?" and "What was my biggest purchase?" This step adds grouping by month and, along the way, teaches **sorting**.

## Where we are

The tracker now reads messy text, rejects bad lines with clear messages and shows totals by category for the 11 good expenses. The output is getting long, because the demo prints the full list as well.

## What we will add

* `month_of(expense)`: the month of an expense as text, like `2025-03`.
* `expenses_in_month(expenses, month)`: only the expenses of that month (step 6 needs it for budgets).
* `totals_by_month(expenses)`: total per month in calendar order.
* `top_expenses(expenses, count)`: the biggest purchases.
* Categories shown with the biggest first.

## Why ISO dates are a gift

Because we store dates as `YYYY-MM-DD`, two things are easy:

* The **month** is simply the first 7 characters, `"2025-03-15"[:7]` is `"2025-03"`. The `[:7]` is a **slice**: from the start up to (not including) index 7.
* **Alphabetical order is calendar order**, because the biggest unit comes first. `"2025-02-20" < "2025-03-01"` is true.

## Walk-through

1. `month_of` returns `expense["date"][:7]`.
2. `expenses_in_month` filters with a **list comprehension**, a compact loop that builds a list:

```python
[expense for expense in expenses if month_of(expense) == month]
```

   Read it as: "each expense, taken from expenses, but only if its month matches".
3. `totals_by_month` is the same accumulator as `totals_by_category`, but with `month_of(expense)` as the key. At the end, return the dict in order: `dict(sorted(totals.items()))`. `sorted` on a list of pairs sorts by the first item of each pair, the month.
4. **Sorting by something else** needs a `key`. `sorted(items, key=function)` calls the function on every item and sorts by the result. A tiny throw-away function is written with `lambda`:

```python
sorted(expenses, key=lambda expense: expense["amount"], reverse=True)
```

   `lambda expense: expense["amount"]` means "given an expense, produce its amount". `reverse=True` puts the biggest first. Slice the first few with `[:count]` to get a top list.
5. **Update the demo.** The starter has three `TODO` notes: delete the `list_expenses` line, and change the category loop so the categories are sorted by total, biggest first. When you loop over `.items()` each item is a pair `(category, amount)`, so `lambda item: item[1]` sorts by the amount:

```python
sorted(totals_by_category(expenses).items(), key=lambda item: item[1], reverse=True)
```

6. The month and top-3 sections already exist in the demo; they will start working when your functions do.

## `sorted` versus `.sort()`

`sorted(x)` returns a **new** list and leaves `x` alone. `x.sort()` sorts `x` in place and returns `None`. Prefer `sorted` while you are learning; it never surprises you.

> **Watch out:**
> - `top = expenses.sort(key=...)` makes `top` equal to `None`, because `.sort()` returns nothing. Use `sorted(...)`.
> - `sorted(expenses)` without a key fails with `TypeError: '<' not supported between instances of 'dict' and 'dict'`. Dicts have no natural order, so say what to sort by.
> - `reverse=True` is easy to forget, and the smallest expenses come first.
> - Mixing years: `[:7]` keeps the year, so January 2024 and January 2025 stay separate months. Using only the month number would merge them.
> - In `sorted(totals.items())` the sort is by the month text; that works only because of the ISO format.

> **Your turn:** implement the four functions, remove the `list_expenses` line from the demo and show the categories biggest first. The demo should then print the parse summary, the total, `By category (biggest first):`, `By month:` and `Top 3 expenses:` sections.
