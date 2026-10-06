---
title: "Step 2: Add and list expenses with functions"
summary: "Wrap the code from step 1 into add_expense, list_expenses and total_spent."
level: beginner
runner: python
files:
  - name: main.py
    code: |
      # Expense Tracker - step 2: functions
      # Sample data: (date, amount, category, note). The note may be left out.
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
          # TODO 1: build a dict with the four keys, append it to expenses and return it.
          pass


      def list_expenses(expenses):
          # TODO 2: print one numbered line per expense, numbering from 1, like
          #   "1. 2025-02-03 | food | 12.50 | lunch"
          pass


      def total_spent(expenses):
          # TODO 3: add up the amounts and return the sum.
          return 0


      # TODO 4: below is the step 1 code. Replace ALL of it with:
      #   - a new empty list called expenses,
      #   - a loop over SAMPLE that calls add_expense once per row, passing the tuple's values as
      #     separate arguments (put a star in front of the loop variable to unpack it),
      #   - list_expenses(expenses),
      #   - print(f"Total spent: {total_spent(expenses):.2f}")
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
  code:
    - { pattern: "enumerate\\s*\\(", message: "Number the lines with enumerate(expenses, start=1)." }
    - { pattern: "return\\s+expense\\b", message: "add_expense should return the dict it created." }
    - { pattern: "\\*row", message: "Add the sample rows with add_expense(expenses, *row)." }
hints:
  - "A function is a named recipe: def name(parameters): ... Put the dict-building and the append into add_expense, the printing loop into list_expenses, and the adding up into total_spent (which returns the sum, it does not print)."
  - "add_expense builds {\"date\": date, \"amount\": amount, \"category\": category, \"note\": note}, appends it and returns it. list_expenses uses for number, expense in enumerate(expenses, start=1) and prints f\"{number}. ...\"."
  - "def total_spent(expenses): total = 0; for expense in expenses: total += expense[\"amount\"]; return total   and in the program: expenses = []; for row in SAMPLE: add_expense(expenses, *row); list_expenses(expenses); print(f\"Total spent: {total_spent(expenses):.2f}\")"
solution:
  - name: main.py
    code: |
      # Expense Tracker - step 2: functions
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


      expenses = []
      for row in SAMPLE:
          add_expense(expenses, *row)

      list_expenses(expenses)
      print(f"Total spent: {total_spent(expenses):.2f}")
quiz:
  - q: "What is the difference between print and return in a function?"
    options: ["There is none", "print shows text on screen, return hands a value back to the caller", "return shows text, print stores it"]
    answer: 1
  - q: "What does note=\"\" in def add_expense(expenses, date, amount, category, note=\"\") mean?"
    options: ["note is required and must be an empty string", "note is optional and is \"\" when the caller leaves it out", "note is always an empty string"]
    answer: 1
  - q: "What does enumerate(items, start=1) give you?"
    options: ["Pairs of (number, item) with numbering that begins at 1", "The items in reverse order", "Only the first item"]
    answer: 0
---
A program that repeats the same code over and over is hard to change. In this step you turn the loose code from step 1 into **functions**, small named tools you can call again and again.

## Where we are

Step 1 stored three expenses in a list of dicts and printed them with a total. All of it sits in one long script, and adding an expense means copy-pasting a whole `append` line with four keys. The starter still contains that step 1 code at the bottom.

## What we will add

Three functions that form the heart of the tracker:

* `add_expense(...)` creates one expense dict, adds it to the list and returns it.
* `list_expenses(...)` prints a numbered list.
* `total_spent(...)` returns the sum of all amounts.

Why it matters: in a real app, the "add expense" feature is used by a form, by an import from a file and by a test, all calling the same function. Fix a bug once and every caller benefits. Functions also give names to ideas, so the main program reads like a story.

## Walk-through

1. **Function with parameters.** A function is introduced by `def`, a name and parameters in parentheses:

```python
def add_expense(expenses, date, amount, category, note=""):
    expense = {"date": date, "amount": amount, "category": category, "note": note}
    ...
```

   `note=""` is a **default value**: callers may leave the note out and get an empty string. Parameters with defaults must come last.
2. **Finish `add_expense`.** Append the new dict to `expenses` and `return expense`. Returning it lets callers use the new expense immediately. Notice that the function changes the list that was passed in (lists are shared, not copied), so it does not need to return the list.
3. **`list_expenses` with `enumerate`.** To number lines starting from 1, use `enumerate`:

```python
for number, expense in enumerate(expenses, start=1):
    print(f"{number}. {expense['date']} | ...")
```

   `enumerate` hands you pairs of `(number, item)`. Without `start=1` the numbering would begin at 0. The expected line is `1. 2025-02-03 | food | 12.50 | lunch`.
4. **`total_spent` returns, it does not print.** A function that returns a value can be used in any expression, for example inside an f-string. A function that prints can only be read by humans. So:

```python
def total_spent(expenses):
    total = 0
    for expense in expenses:
        total += expense["amount"]
    return total
```

5. **Use them.** The starter provides `SAMPLE`, a list of tuples with ten expenses. Replace the old step 1 code by an empty list and a loop. A star in front of a tuple **unpacks** it into separate arguments:

```python
for row in SAMPLE:
    add_expense(expenses, *row)    # same as add_expense(expenses, row[0], row[1], row[2], row[3])
```

   Finish with `list_expenses(expenses)` and `print(f"Total spent: {total_spent(expenses):.2f}")`.

## Why `expenses` is a parameter

Notice that the functions receive the list instead of using a global variable. That makes them easy to test with a small list and reusable with several lists (say, one per family member).

> **Watch out:**
> - `TypeError: add_expense() missing 1 required positional argument: 'category'` means you passed too few values. Count the arguments.
> - A function without `return` gives back `None`. If `total_spent` prints `None` in your output, you forgot `return`.
> - `return` ends the function immediately. If you put it inside the loop, only the first amount is added.
> - Defining a function does not run it. Nothing happens until you call it with parentheses.
> - Leaving the old step 1 code in place prints the old lines too, and the output will not match.

> **Your turn:** write `add_expense`, `list_expenses` and `total_spent`, then replace the step 1 code with an empty list, a loop calling `add_expense(expenses, *row)` for each row of `SAMPLE`, a call to `list_expenses`, and the line `Total spent: 388.45`.
