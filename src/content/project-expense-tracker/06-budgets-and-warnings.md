---
title: "Step 6: Budgets and warnings"
summary: "Compare monthly spending with limits and report OK, WARNING or OVER."
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # Expense Tracker - step 6: budgets and warnings

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
          # TODO 1: compare the spending of one month with the limits in `budgets`.
          # Steps: totals = totals_by_category(expenses_in_month(expenses, month))
          # For every category in alphabetical order, build ONE text line and collect the lines in a list:
          #   the budgets dict has no entry for the category:  "health: 40.00 (no budget set)"
          #   spent more than the limit:   "food: 50.55 of 50.00 (OVER by 0.55)"
          #   spent four fifths or more:   "fun: 30.00 of 35.00 (WARNING, 86% used)"   (percent format, no decimals)
          #   otherwise:                  "bills: 95.40 of 200.00 (OK)"
          # Return the list of lines.
          return []


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
    Budget check for 2025-03:
      bills: 95.40 of 200.00 (OK)
      food: 50.55 of 50.00 (OVER by 0.55)
      fun: 30.00 of 35.00 (WARNING, 86% used)
      health: 40.00 (no budget set)
      transport: 15.00 of 50.00 (OK)
  code:
    - { pattern: "budgets\\.get\\s*\\(", message: "Look up the limit with budgets.get(category) so a missing budget gives None." }
    - { pattern: "\\bis\\s+None\\b", message: "Test for a missing limit with is None." }
    - { pattern: "0\\.8|80\\s*%|\\*\\s*0\\.8", message: "Warn at 80% of the limit." }
hints:
  - "For each category of the month you have a total spent and maybe a limit. Check the cases in order: no limit, over the limit, at least 80% of the limit, otherwise fine. if / elif / else is the tool for that."
  - "limit = budgets.get(category) gives None when there is no budget. Test it with if limit is None. Then elif spent > limit, then elif spent >= 0.8 * limit. Build each line with an f-string and append it to a list; iterate over sorted(totals) for alphabetical order."
  - "lines.append(f\"{category}: {spent:.2f} of {limit:.2f} (OVER by {spent - limit:.2f})\") and for the warning f\"... (WARNING, {spent / limit:.0%} used)\". Finally return lines."
solution:
  - name: main.py
    code: |
      # Expense Tracker - step 6: budgets and warnings

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
quiz:
  - q: "Why test limit is None before comparing spent > limit?"
    options: ["Comparing a number with None raises a TypeError", "None is the same as zero", "It makes the program faster"]
    answer: 0
  - q: "What does f\"{0.857:.0%}\" give?"
    options: ["0.86", "86%", "85.7"]
    answer: 1
  - q: "Why is budget checking better done per month than over all time?"
    options: ["Python can only add up one month at a time", "Months are shorter, so loops run faster", "A monthly allowance only makes sense when you compare it with one month of spending"]
    answer: 2
---
Tracking spending is nice; being **warned** is better. In this step you add budgets: a monthly limit per category, and a check that says OK, WARNING or OVER.

## Where we are

The tracker parses text, groups expenses by category and by month, and shows the top three purchases. It reports what happened, but it does not judge it yet.

## What we will add

A `BUDGETS` dictionary (already in the starter) with a monthly limit for four categories:

```python
BUDGETS = {"food": 50, "transport": 50, "fun": 35, "bills": 200}
```

and a function `check_budgets(expenses, budgets, month)` that returns one text line per category spent in that month. Notice that `health` has no budget at all, so the function must cope with a missing limit. Handling "the data does not have this" is a big part of real-world programming.

## The rules

For each category in the month, compare `spent` with `limit`:

| Situation | Line |
|---|---|
| no limit set | `health: 40.00 (no budget set)` |
| spent is above the limit | `food: 50.55 of 50.00 (OVER by 0.55)` |
| spent is at least 80% of the limit | `fun: 30.00 of 35.00 (WARNING, 86% used)` |
| otherwise | `bills: 95.40 of 200.00 (OK)` |

## Walk-through

1. **Reuse what you built.** The spending of one month by category is just two earlier functions combined:

```python
totals = totals_by_category(expenses_in_month(expenses, month))
```

   This is the payoff of small functions: new features are mostly compositions of old ones.
2. **Look up the limit safely.** `budgets["health"]` would raise `KeyError`. `budgets.get(category)` returns `None` when the key is missing. Test it with `is None` (not `== None`):

```python
limit = budgets.get(category)
if limit is None:
    ...
```

3. **Chain the cases with `if` / `elif` / `else`.** Python checks them from top to bottom and runs only the first that is true, so the order matters: check "no limit" first (you cannot compare with `None`), then "over", then "warning", and let `else` handle "OK".
4. **Compute the warning threshold** as `0.8 * limit`: `spent >= 0.8 * limit`. The percentage in the message uses the **percent format**: `{spent / limit:.0%}` multiplies by 100 and adds the `%` sign, so `0.857` becomes `86%`.
5. **Collect lines in a list and return it.** Looping over `sorted(totals)` gives alphabetical order, which makes the output predictable (dict order would depend on the data).
6. The demo already calls `check_budgets(expenses, BUDGETS, "2025-03")` and prints the lines. When your function works, the new section appears below the top 3.

## Why return lines and not print them?

If `check_budgets` printed directly, you could not reuse it for an email, a web page or a test. Returning data and letting the caller print is a design habit worth keeping.

## A note on float rounding

`50.55 - 50` is `0.5499999999999972` in floating point. Formatting with `:.2f` rounds it to `0.55`. Always format money for display, and never compare floats for exact equality; use `>` and `>=` as we do.

> **Watch out:**
> - `TypeError: '>' not supported between instances of 'float' and 'NoneType'` means you compared with the limit before checking for `None`.
> - Putting the `elif spent >= 0.8 * limit` check before `elif spent > limit` labels over-budget categories as warnings.
> - `ZeroDivisionError` if a budget is 0. A real app would guard against that.
> - Forgetting `month` in `expenses_in_month` mixes February and March spending in the check.
> - Using `==` for `None` works but is considered poor style; use `is None`.

> **Your turn:** implement `check_budgets` so the demo prints `Budget check for 2025-03:` followed by five lines, from `bills` to `transport`, in alphabetical order, with the statuses from the table above.
