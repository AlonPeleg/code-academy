---
title: "Step 3: Totals by category"
summary: "Accumulate amounts per category in a dictionary."
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # Expense Tracker - step 3: totals by category


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
          # TODO 1: return a dict that maps each category to the sum of its amounts.
          # Start with an empty dict. For every expense add its amount to its category's total.
          # Tip: the dict method .get(key, default) gives the default when the key has not been seen yet.
          return {}


      expenses = []
      for row in SAMPLE:
          add_expense(expenses, *row)

      list_expenses(expenses)
      print(f"Total spent: {total_spent(expenses):.2f}")

      # TODO 2: print the heading "By category:" and then one line per category, like
      #   "  food: 63.05"   (two leading spaces, the amount with two decimals)
      # Loop over totals_by_category(expenses).items() and unpack each pair into two names.
check:
  output: |
    1. 2025-02-03 | food | 12.50 | lunch
    2. 2025-02-05 | transport | 45.00 | train pass
    3. 2025-02-14 | fun | 60.00 | concert ticket
    4. 2025-02-20 | bills | 80.00 | electricity
    5. 2025-03-01 | food | 8.20 | coffee and cake
    6. 2025-03-02 | food | 23.75 | groceries
    7. 2025-03-04 | transport | 15.00 | taxi
    8. 2025-03-09 | fun | 30.00 | cinema and popcorn
    9. 2025-03-12 | bills | 95.40 | internet and phone
    10. 2025-03-15 | food | 18.60 | dinner
    Total spent: 388.45
    By category:
      food: 63.05
      transport: 60.00
      fun: 90.00
      bills: 175.40
  code:
    - { pattern: "\\.get\\s*\\(\\s*\\w+\\s*,\\s*0\\s*\\)|\\bnot\\s+in\\s+totals\\b|\\bin\\s+totals\\b", message: "Handle a category you have not seen yet (totals.get(category, 0))." }
hints:
  - "This is the accumulator pattern with a dict: start with {}, and for each expense add its amount to the entry of its category. The tricky part is the first time a category appears: it has no entry yet."
  - "dict.get(key, default) returns the default when the key is missing, so totals[category] = totals.get(category, 0) + expense[\"amount\"] works for new and old categories alike. To print: for category, amount in totals_by_category(expenses).items()."
  - "def totals_by_category(expenses): totals = {}; for expense in expenses: category = expense[\"category\"]; totals[category] = totals.get(category, 0) + expense[\"amount\"]; return totals   and print(f\"  {category}: {amount:.2f}\") in the loop."
solution:
  - name: main.py
    code: |
      # Expense Tracker - step 3: totals by category


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


      expenses = []
      for row in SAMPLE:
          add_expense(expenses, *row)

      list_expenses(expenses)
      print(f"Total spent: {total_spent(expenses):.2f}")

      print("By category:")
      for category, amount in totals_by_category(expenses).items():
          print(f"  {category}: {amount:.2f}")
quiz:
  - q: "What does totals.get('food', 0) return when 'food' is not a key yet?"
    options: ["It raises KeyError", "None", "0"]
    answer: 2
  - q: "In which order does a dict list its keys when you loop over it?"
    options: ["Alphabetical", "The order in which the keys were first added", "Random every time"]
    answer: 1
  - q: "What does for category, amount in totals.items() do?"
    options: ["Loops over the keys only", "Loops over the values only", "Loops over (key, value) pairs and unpacks each into two names"]
    answer: 2
---
"How much did I spend on food?" is the first question everybody asks of an expense tracker. To answer it you need to **group** the expenses by category and add up each group. This is one of the most useful patterns in programming.

## Where we are

You can add expenses, list them with numbers and compute the total spent. The program knows the grand total, but nothing about where the money went.

## What we will add

A function `totals_by_category(expenses)` that returns a dictionary such as `{"food": 63.05, "transport": 60.0, ...}`, and a short section in the program that prints it. Real apps show this as a pie chart or a table; the logic underneath is exactly this function.

## The accumulator pattern with a dict

You already know the "running total" pattern: start at 0 and add in a loop. Here we need one running total **per category**. A dictionary is perfect: the keys are categories and the values are the running totals.

```python
totals = {}
for expense in expenses:
    category = expense["category"]
    totals[category] = totals.get(category, 0) + expense["amount"]
```

Read the last line slowly:

1. `totals.get(category, 0)` looks up the current total for the category. If the category has **not been seen yet**, `get` returns the second argument, `0`, instead of raising an error.
2. `+ expense["amount"]` adds this expense.
3. `totals[category] = ...` stores the new total back under the same key (creating the key if needed).

Trace the first two food expenses by hand: the first time, `get` gives 0, so food becomes `0 + 12.5 = 12.5`. The next food expense gives `12.5 + 8.2 = 20.7`. Each category grows independently.

## Walk-through

1. Replace the stub `totals_by_category` so that it builds and returns the dict as above. Return the dict, do not print inside the function.
2. In the program, after the "Total spent" line, print the heading `By category:`.
3. Loop over the pairs of the dict with `.items()` and unpack each pair into two names:

```python
for category, amount in totals_by_category(expenses).items():
    print(f"  {category}: {amount:.2f}")
```

   `.items()` yields `(key, value)` pairs. The two leading spaces in the f-string indent the lines under the heading.
4. Run it. Dicts remember the order in which keys were first added, so the categories appear as they first show up in the sample: food, transport, fun, bills.

## Another way to write the same thing

Some people prefer an explicit test:

```python
if category in totals:
    totals[category] += expense["amount"]
else:
    totals[category] = expense["amount"]
```

Both work. `get` is shorter once you are used to it. Python also has `collections.defaultdict(float)`, which does the "start at zero" for you; you can try it later.

## Cross-checking your work

A good habit: the sum of all category totals must equal the grand total. Here `63.05 + 60.00 + 90.00 + 175.40 = 388.45`, matching "Total spent". If they differ, a category is being lost.

> **Watch out:**
> - `KeyError: 'food'` appears if you write `totals[category] += amount` for a category that is not in the dict yet. Use `.get(category, 0)` or test first.
> - Writing `totals = {}` **inside** the loop resets the dict for every expense, so you only keep the last one.
> - `ValueError: too many values to unpack` happens if you loop over the dict itself (`for category, amount in totals`), which gives only the keys. Add `.items()`.
> - Typos in the category (`"Food"` versus `"food"`) create two separate groups. Step 4 will normalise the text.
> - Returning inside the loop (indented too far) ends the function after one expense.

> **Your turn:** write `totals_by_category(expenses)` and add the `By category:` section after the total line, with one line per category in the form `  food: 63.05`.
