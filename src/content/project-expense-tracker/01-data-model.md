---
title: "Step 1: The data model"
summary: "Represent each expense as a dict with four keys and keep them in a list."
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # Expense Tracker - step 1: the data model
      # One expense is a dict with four keys: date, amount, category and note.
      expenses = []

      # This first expense is already done. Notice the four keys.
      first = {"date": "2025-02-03", "amount": 12.50, "category": "food", "note": "lunch"}
      expenses.append(first)

      # TODO 1: add two more expenses with the same four keys (use expenses.append):
      #   2025-02-05, 45.00, transport, "train pass"
      #   2025-02-14, 60.00, fun, "concert ticket"

      # TODO 2: print how many expenses are recorded, in this form:
      #   Expenses recorded: 3

      # TODO 3: go through the list one expense at a time and print one line each, like
      #   2025-02-03 | food | 12.50 | lunch
      # (amount with two decimals). While you are at it, add the amounts up in a variable.

      # TODO 4: after the loop print the total with two decimals:
      #   Total: 117.50
check:
  output: |
    Expenses recorded: 3
    2025-02-03 | food | 12.50 | lunch
    2025-02-05 | transport | 45.00 | train pass
    2025-02-14 | fun | 60.00 | concert ticket
    Total: 117.50
  code:
    - { pattern: "for\\s+\\w+\\s+in\\s+expenses", message: "Loop over the list with a for loop." }
    - { pattern: "len\\s*\\(\\s*expenses\\s*\\)", message: "Use len(expenses) to count them." }
    - { pattern: "\\+=", message: "Add the amounts up with +=." }
hints:
  - "An expense is a dict like {\"date\": ..., \"amount\": ..., \"category\": ..., \"note\": ...}. A list collects them: expenses.append(one_dict). To visit them all, use a for loop."
  - "Append two more dicts with the same four keys. Then print(\"Expenses recorded:\", len(expenses)). In the loop read values with expense[\"date\"], expense[\"category\"] and so on, and keep a total variable that starts at 0 and grows with total += expense[\"amount\"]."
  - "for expense in expenses: print(f\"{expense['date']} | {expense['category']} | {expense['amount']:.2f} | {expense['note']}\"); total += expense[\"amount\"]   and after the loop print(f\"Total: {total:.2f}\"). Note the different quote types inside the f-string."
solution:
  - name: main.py
    code: |
      # Expense Tracker - step 1: the data model
      # One expense is a dict with four keys: date, amount, category and note.
      expenses = []

      expenses.append({"date": "2025-02-03", "amount": 12.50, "category": "food", "note": "lunch"})
      expenses.append({"date": "2025-02-05", "amount": 45.00, "category": "transport", "note": "train pass"})
      expenses.append({"date": "2025-02-14", "amount": 60.00, "category": "fun", "note": "concert ticket"})

      print("Expenses recorded:", len(expenses))

      total = 0
      for expense in expenses:
          print(f"{expense['date']} | {expense['category']} | {expense['amount']:.2f} | {expense['note']}")
          total += expense["amount"]

      print(f"Total: {total:.2f}")
quiz:
  - q: "What does expense['amount'] do when expense is a dict?"
    options: ["It looks up the value stored under the key 'amount'", "It returns the position of 'amount' in the dict", "It creates a new key called 'amount'"]
    answer: 0
  - q: "Why keep the expenses in a list of dicts instead of four separate lists (dates, amounts, ...)?"
    options: ["A list of dicts is faster to print", "Python does not allow several lists", "All the facts about one expense stay together, so they cannot get out of step"]
    answer: 2
  - q: "What does f\"{12.5:.2f}\" produce?"
    options: ["12.5", "12.50", "12.500"]
    answer: 1
    explain: "The .2f means a float with exactly two decimals."
---
Every useful program starts by deciding how its data looks. In this project you will build an **expense tracker**: a program that records what you spend, adds it up, warns you about your budget and prints a neat report. This first step is the most important one, because everything else is built on the shape of the data.

## Where we are

Nothing exists yet, only an empty list. By the end of this step the program will hold three expenses and print them with a total.

## What we will add

A **data model**: the decision of how to represent one expense and a collection of expenses. A real finance app needs to remember four facts about every purchase: **when** it happened (date), **how much** it cost (amount), **what kind** of spending it was (category) and a free **note**.

## The idea: a dict for one thing, a list for many things

A dictionary stores facts under names (keys):

```python
expense = {"date": "2025-02-03", "amount": 12.50, "category": "food", "note": "lunch"}
print(expense["amount"])    # prints: 12.5
```

All four facts stay together, and you read each one by its name, which is far clearer than remembering that "position 2 is the category".

Many expenses go into a list:

```python
expenses = []
expenses.append(expense)    # add one dict to the end
print(len(expenses))        # prints: 1
```

A list of dicts is the most common data shape in real Python programs. It is exactly what you get from a JSON web response or a CSV file, so the skills carry over everywhere.

## Walk-through

1. **Add the other two expenses.** The starter already contains the first one. Copy its shape for these:
   * `2025-02-05`, `45.00`, `transport`, `train pass`
   * `2025-02-14`, `60.00`, `fun`, `concert ticket`

   You can build the dict directly inside the call: `expenses.append({"date": ..., ...})`.
2. **Count them.** `print("Expenses recorded:", len(expenses))` prints the label and the number with a space between them.
3. **Visit every expense with a loop.** A `for` loop gives you one dict at a time:

```python
for expense in expenses:
    print(expense["date"], expense["note"])
```

4. **Format each line.** An f-string lets you put values straight into text. Because the dict keys use double quotes, use single quotes inside the braces (or the other way around):

```python
print(f"{expense['date']} | {expense['category']} | {expense['amount']:.2f} | {expense['note']}")
```

   The part after the colon, `.2f`, means "a decimal number with exactly two digits after the point", so `12.5` prints as `12.50`. That is what you want for money.
5. **Keep a running total.** Before the loop write `total = 0`. Inside the loop, `total += expense["amount"]` adds the current amount to it. After the loop, print `Total: ` with the same two-decimal format.

## A note on money

Python's `float` numbers cannot store every decimal exactly (for example `0.1 + 0.2` is `0.30000000000000004`). For a small tool, rounding to two decimals when you print is fine. Banking software stores whole cents as integers or uses the `decimal` module. Remember this when your project grows.

> **Watch out:**
> - `KeyError: 'Amount'` means you mistyped a key. Keys are case-sensitive and must match exactly.
> - `TypeError: unsupported operand type(s) for +=: 'int' and 'str'` means you stored an amount as text (`"12.50"`) instead of a number (`12.50`). Do not put quotes around amounts.
> - Using the same quotes inside an f-string expression, like `f"{expense["date"]}"`, can be a syntax error in older Python. Use single quotes inside.
> - Forgetting `total = 0` before the loop gives `NameError: name 'total' is not defined`.
> - Putting the `print(f"Total...")` inside the loop prints a total for every line instead of once.

> **Your turn:** append the two remaining expenses, print `Expenses recorded: 3`, loop over the list printing one line per expense in the form `2025-02-03 | food | 12.50 | lunch`, add the amounts into a total with `+=`, and finish with `Total: 117.50`.
