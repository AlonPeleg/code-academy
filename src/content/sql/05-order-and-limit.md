---
title: ORDER BY and LIMIT
summary: Sort results and keep only the top few.
level: beginner
runner: sql
files:
  - name: query.sql
    code: |
      -- Show the name and age of the 3 oldest students, oldest first
check:
  output: |
    name | age
    Yael | 24
    Maya | 23
    Lior | 22
  code:
    - { pattern: '\bORDER\s+BY\b', message: "Sort with ORDER BY." }
    - { pattern: '\bLIMIT\s+3\b', message: "Keep three rows with LIMIT 3." }
hints:
  - "Two clauses are needed at the end of the query: one that sorts and one that cuts the list short."
  - "ORDER BY age sorts from smallest to largest by default. Add the word DESC after the column for largest first. Then LIMIT with a number keeps only that many rows."
  - "SELECT name, age FROM students ORDER BY age DESC LIMIT 3;"
solution:
  - name: query.sql
    code: |
      SELECT name, age
      FROM students
      ORDER BY age DESC
      LIMIT 3;
quiz:
  - q: What does  ORDER BY age DESC  do?
    options: ["Sorts from smallest to largest", "Removes the age column", "Sorts from the largest age to the smallest"]
    answer: 2
  - q: Which sort direction is the default?
    options: ["ASC (smallest first)", "DESC (largest first)", "Random"]
    answer: 0
  - q: What does LIMIT 3 do?
    options: ["Skips 3 rows", "Returns at most 3 rows", "Adds 3 to every value"]
    answer: 1
  - q: What does  ORDER BY city, name  do?
    options: ["Sorts by name, then by city", "Sorts by city, and sorts rows with the same city by name", "Shows only two columns"]
    answer: 1
---

The rows of a query come back in no promised order. When the order matters, for example for a leaderboard or "latest first" list, you must ask for it. This lesson covers sorting with `ORDER BY` and keeping only the first few rows with `LIMIT`.

## ORDER BY

```sql
SELECT name, age
FROM students
ORDER BY age;
```

The default direction is `ASC` (ascending): smallest to largest for numbers, A to Z for text. Add `DESC` (descending) for the opposite:

```sql
SELECT name, age
FROM students
ORDER BY age DESC;
```

## Sorting by several columns

When two rows have the same value, the next column breaks the tie. List the columns separated by commas, each with its own direction:

```sql
SELECT name, city, age
FROM students
ORDER BY city ASC, age DESC;
```

Rows are sorted by city first; students in the same city are then sorted from oldest to youngest.

## LIMIT

`LIMIT n` keeps only the first *n* rows of the result. Combined with `ORDER BY` it answers "top N" questions:

```sql
SELECT title, credits
FROM courses
ORDER BY credits DESC
LIMIT 2;
```

Without `ORDER BY`, "first" has no real meaning, so always sort before you limit.

`OFFSET` skips rows first. `LIMIT 3 OFFSET 3` gives rows four to six, which is how pages 2, 3 and so on of a website list are built.

## Clause order

The clauses must appear in this order, even though they are processed differently inside the database:

1. `SELECT`
2. `FROM`
3. `WHERE`
4. `ORDER BY`
5. `LIMIT`

A handy way to remember it: *Some Friendly Wizards Order Lemonade*.

## Where do NULLs go?

In SQLite a `NULL` counts as the smallest value, so it sorts first in `ASC` order and last in `DESC` order. Remember that when sorting by a column that has gaps, such as `city`.

> **Watch out:**
> - Putting `LIMIT` before `ORDER BY` gives `near "ORDER": syntax error`.
> - `ORDER BY` after `DESC` with a comma by mistake (`ORDER BY age DESC,`) gives a syntax error.
> - `LIMIT 3` on its own returns whatever three rows come first, which is not a reliable "top 3".
> - `DESC` only applies to the column right before it: `ORDER BY city, age DESC` sorts city ascending.

> **Your turn:** show the `name` and `age` of the three oldest students, oldest first.
