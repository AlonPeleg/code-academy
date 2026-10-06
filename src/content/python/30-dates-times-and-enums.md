---
title: Dates, times and enums
summary: Work with date, datetime and timedelta using fixed dates, and name fixed choices with Enum and IntEnum.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      from datetime import date, datetime, timedelta
      from enum import Enum, IntEnum

      # We pretend that "today" is a fixed day, so the output never changes.
      TODAY = date(2024, 5, 10)

      # 1. Make an IntEnum called Priority with LOW = 1, MEDIUM = 2, HIGH = 3
      #    and an Enum called Status with TODO = "todo" and DONE = "done".
      #    Print:  Priorities: LOW MEDIUM HIGH   (loop over the class)
      #    Print:  Status from value: DONE       (look up Status by its value)

      text = """write report;2024-05-14;HIGH
      buy milk;2024-05-11;LOW
      book flight;2024-05-10;MEDIUM
      old invoice;2024-05-02;HIGH
      """

      # 2. Parse every line into (title, due date, priority). Convert the date
      #    text with the parse method of datetime plus .date(), and the priority name with
      #    Priority[name]. Then print the tasks sorted by due date like
      #       Thu 02 May old invoice [HIGH] 8 days overdue
      #    The ending is "N days overdue", "due today", "tomorrow" or "in N days".
      #    The start of the line is the due date formatted with "%a %d %b".

      # 3. Print how many tasks have a priority of HIGH or more, as  urgent: 2

      # 4. Print a review date two weeks after TODAY as  review: 2024-05-24
      #    Print  leap day: 2024-03-01  (28 February 2024 plus 2 days)
      #    Print  days to 2025: 236     (difference between two dates in days)

      # 5. A meeting starts at 2024-05-10 09:30 and lasts 2 hours 45 minutes.
      #    Print  meeting ends: 2024-05-10T12:15:00 12:15
      #    (the iso format, then the time formatted with "%H:%M")

      print("TODO")
check:
  output: |
    Priorities: LOW MEDIUM HIGH
    Status from value: DONE
    Thu 02 May old invoice [HIGH] 8 days overdue
    Fri 10 May book flight [MEDIUM] due today
    Sat 11 May buy milk [LOW] tomorrow
    Tue 14 May write report [HIGH] in 4 days
    urgent: 2
    review: 2024-05-24
    leap day: 2024-03-01
    days to 2025: 236
    meeting ends: 2024-05-10T12:15:00 12:15
  code:
    - { pattern: 'class\s+Priority\s*\(\s*IntEnum\s*\)', message: "Define class Priority(IntEnum)." }
    - { pattern: 'class\s+Status\s*\(\s*Enum\s*\)', message: "Define class Status(Enum)." }
    - { pattern: 'strptime\s*\(', message: "Parse the due dates with datetime.strptime." }
    - { pattern: 'timedelta\s*\(', message: "Use timedelta for the date arithmetic." }
hints:
  - "An Enum is a class whose attributes are a fixed set of named values. Loop over the class to get the members, use Status('done') to look up by value and Priority['HIGH'] to look up by name. Subtracting two dates gives a timedelta with a .days number."
  - "class Priority(IntEnum): with LOW = 1 and so on. due = datetime.strptime(due_text, '%Y-%m-%d').date(). days = (due - TODAY).days decides the ending. TODAY + timedelta(weeks=2) is the review date. datetime(2024, 5, 10, 9, 30) + timedelta(hours=2, minutes=45) is the meeting end."
  - "tasks.append((title, due, Priority[level]))   for title, due, priority in sorted(tasks, key=lambda t: t[1]):     days = (due - TODAY).days     print(f\"{due.strftime('%a %d %b')} {title} [{priority.name}] {when}\")   print('urgent:', sum(1 for t in tasks if t[2] >= Priority.HIGH))"
solution:
  - name: main.py
    code: |
      from datetime import date, datetime, timedelta
      from enum import Enum, IntEnum

      TODAY = date(2024, 5, 10)


      class Priority(IntEnum):
          LOW = 1
          MEDIUM = 2
          HIGH = 3


      class Status(Enum):
          TODO = "todo"
          DONE = "done"


      print("Priorities:", " ".join(p.name for p in Priority))
      print("Status from value:", Status("done").name)

      text = """write report;2024-05-14;HIGH
      buy milk;2024-05-11;LOW
      book flight;2024-05-10;MEDIUM
      old invoice;2024-05-02;HIGH
      """

      tasks = []
      for line in text.splitlines():
          title, due_text, level = line.split(";")
          due = datetime.strptime(due_text, "%Y-%m-%d").date()
          tasks.append((title, due, Priority[level]))

      for title, due, priority in sorted(tasks, key=lambda t: t[1]):
          days = (due - TODAY).days
          if days < 0:
              when = f"{-days} days overdue"
          elif days == 0:
              when = "due today"
          elif days == 1:
              when = "tomorrow"
          else:
              when = f"in {days} days"
          print(f"{due.strftime('%a %d %b')} {title} [{priority.name}] {when}")

      print("urgent:", sum(1 for t in tasks if t[2] >= Priority.HIGH))

      review = TODAY + timedelta(weeks=2)
      print("review:", review.isoformat())
      print("leap day:", date(2024, 2, 28) + timedelta(days=2))
      print("days to 2025:", (date(2025, 1, 1) - TODAY).days)

      meeting = datetime(2024, 5, 10, 9, 30) + timedelta(hours=2, minutes=45)
      print("meeting ends:", meeting.isoformat(), meeting.strftime("%H:%M"))
quiz:
  - q: What type do you get when you subtract one date from another?
    options: ["A timedelta object with a .days attribute", "An int with the number of days", "A new date"]
    answer: 0
  - q: "What does  datetime.strptime('2024-05-14', '%Y-%m-%d')  do?"
    options: ["Turns a datetime into text", "Turns text into a datetime using the given format", "Returns the current time"]
    answer: 1
    explain: "Memory trick: strptime is string parse time, strftime is string format time."
  - q: Why is it a bad idea to call date.today() in a program whose output must be repeatable?
    options: ["It is not available in Python", "It returns a different value every day, so the output changes", "It always returns the same day"]
    answer: 1
  - q: What is the advantage of an Enum over plain strings such as "HIGH"?
    options: ["The set of valid values is fixed, so typos like Priority.HIHG fail loudly", "Enums are always faster than strings", "Enums can hold unlimited values"]
    answer: 0
---

Almost every real program touches dates: due dates, ages, log times, expiry. It also has fixed choices such as order status or priority. In this lesson you learn the standard tools for both: `datetime` for time and `enum` for named choices. Date code is easy to get subtly wrong, so we will practise with **fixed dates**. If you used `date.today()` or `datetime.now()` the result would change every day, which also makes the code hard to test.

## date, datetime and timedelta

```python
from datetime import date, datetime, timedelta

d = date(2024, 5, 10)              # year, month, day
print(d)                           # prints: 2024-05-10
print(d.year, d.month, d.day)      # prints: 2024 5 10
print(d.weekday())                 # prints: 4  (Monday is 0, so 4 is Friday)

moment = datetime(2024, 5, 10, 9, 30)    # adds hour and minute (second is optional)
print(moment)                      # prints: 2024-05-10 09:30:00
```

- `date` has only a calendar day, `datetime` adds the time of day.
- A **timedelta** is a length of time: `timedelta(days=3)`, `timedelta(weeks=2)`, `timedelta(hours=1, minutes=30)`.
- You can add a timedelta to a date or datetime, and subtract two dates to get a timedelta:

```python
print(d + timedelta(days=30))                 # prints: 2024-06-09
print((date(2024, 12, 25) - d).days)          # prints: 229
print(moment + timedelta(hours=2, minutes=45))   # prints: 2024-05-10 12:15:00
```

Python knows the calendar: month lengths and leap years are handled for you, so `date(2024, 2, 28) + timedelta(days=2)` is 1 March (2024 has a 29 February).

## Text in, text out

- `strftime(format)` turns a date into text (**f** for format): `d.strftime("%d/%m/%Y")` gives `10/05/2024`.
- `datetime.strptime(text, format)` turns text into a datetime (**p** for parse). Use `.date()` afterwards if you only want the day.
- `isoformat()` gives the international standard `2024-05-10`, which sorts correctly as text.

Common format codes: `%Y` four digit year, `%m` month number, `%d` day, `%H` hour (24h), `%M` minute, `%S` second, `%a` short weekday, `%A` full weekday, `%b` short month name, `%B` full month name.

## Enum: names for fixed choices

An **enum** is a class whose members are a closed set of named constants:

```python
from enum import Enum, IntEnum

class Status(Enum):
    TODO = "todo"
    DONE = "done"

print(Status.DONE)            # prints: Status.DONE
print(Status.DONE.name)       # prints: DONE
print(Status.DONE.value)      # prints: done
print(Status("todo"))         # look up by value: Status.TODO
print(Status["DONE"])         # look up by name:  Status.DONE
print(list(Status))           # all members, in definition order
```

Compared with plain strings, a typo such as `Status.DNOE` raises an `AttributeError` immediately instead of silently being a different string. `IntEnum` members are also real integers, so they compare and sort by number: `Priority.HIGH > Priority.LOW` is `True`. Use plain `Enum` when order has no meaning, and compare members with `==` or `is`.

> **Watch out:**
> - Mixing `date` and `datetime`: `date(2024, 5, 10) - datetime(2024, 5, 1)` raises `TypeError: unsupported operand type(s) for -: 'datetime.date' and 'datetime.datetime'`. Convert with `.date()`.
> - A mismatching format in `strptime` raises `ValueError: time data '10/05/2024' does not match format '%Y-%m-%d'`.
> - `timedelta(months=1)` does not exist (`TypeError: ... unexpected keyword argument 'months'`) because months have different lengths. Compute month arithmetic yourself or use a library.
> - Looking up a missing enum value: `Status("finished")` raises `ValueError: 'finished' is not a valid Status`.
> - `datetime.now()` has no time zone. For real applications that serve several countries store times in UTC (`datetime.timezone.utc`).

## Going further

Add a `Status` to each task and print only the open ones, or use `date.fromisoformat("2024-05-10")` as a shorter way to parse the ISO format. You can also use `enum.auto()` to number members automatically.

> **Your turn:** define `Priority` and `Status`, parse the task lines with `strptime`, print them sorted by due date with the overdue/today/tomorrow wording, count the HIGH tasks, and finish with the `timedelta` calculations for the review date, the leap day and the meeting end.
