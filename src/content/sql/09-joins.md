---
title: JOIN - combining tables
summary: Connect students, enrollments and courses.
level: intermediate
runner: sql
files:
  - name: query.sql
    code: |
      -- Show each student's name and the title of every course where
      -- they scored 90 or more.
      SELECT s.name, c.title
      FROM enrollments e
      JOIN students s ON s.id = e.student_id
      -- 1. JOIN the courses table (as c) on c.id = e.course_id
      -- 2. Keep only the rows whose grade (e.grade) is 90 or more
      ORDER BY s.name, c.title;
check:
  output: |
    name | title
    Ava | Intro to HTML
    Ava | React in Practice
    Maya | Python for Everyone
    Maya | SQL Fundamentals
  code:
    - { pattern: 'JOIN\s+courses\s+(AS\s+)?c\s+ON', message: "JOIN the courses table with the alias c." }
    - { pattern: 'WHERE\s+e\.grade\s*>=\s*90', message: "Keep only grades of 90 or more." }
hints:
  - "The enrollments table only stores ids. You need one more JOIN, in the same style as the existing one, and then a filter on the grade."
  - "Add a line JOIN courses c ON c.id = e.course_id after the students join. Add WHERE e.grade >= 90 before the ORDER BY line (ORDER BY always comes last)."
  - "JOIN courses c ON c.id = e.course_id    WHERE e.grade >= 90    (the WHERE line goes just above ORDER BY s.name, c.title;)"
solution:
  - name: query.sql
    code: |
      SELECT s.name, c.title
      FROM enrollments e
      JOIN students s ON s.id = e.student_id
      JOIN courses c ON c.id = e.course_id
      WHERE e.grade >= 90
      ORDER BY s.name, c.title;
quiz:
  - q: Why do we need JOIN?
    options: ["To make queries run backwards", "Data is split across tables, and JOIN connects them", "To delete duplicate rows"]
    answer: 1
  - q: In  JOIN courses c ON c.id = e.course_id , what does ON do?
    options: ["Says how rows in the two tables match", "Turns the table on", "Sorts the rows"]
    answer: 0
  - q: What is  e  in  FROM enrollments e ?
    options: ["A column", "A function", "A short alias for the table name"]
    answer: 2
  - q: What does a plain JOIN (INNER JOIN) do with rows that have no match?
    options: ["Keeps them with NULLs", "Drops them", "Reports an error"]
    answer: 1
---

Good databases split data into separate tables to avoid repeating themselves. A student's name is stored once in `students`, not copied into every enrollment. The price of this tidiness is that to answer a question like "which course did Ava score 90 in?", you have to **join** tables back together.

## Keys: how tables point at each other

Our `enrollments` table stores only numbers:

| student_id | course_id | grade |
| --- | --- | --- |
| 1 | 1 | 90 |
| 1 | 2 | 85 |

`student_id` matches the `id` column of `students`, and `course_id` matches the `id` of `courses`. A column that points to another table's `id` is called a **foreign key**.

## Your first JOIN

```sql
SELECT s.name, e.grade
FROM enrollments e
JOIN students s ON s.id = e.student_id;
```

Piece by piece:

- `enrollments e` gives the table a short **alias** `e`. Likewise `students s`.
- `JOIN students s` brings in the second table.
- `ON s.id = e.student_id` is the matching rule: pair each enrollment with the student whose `id` equals its `student_id`.
- `s.name` means "the `name` column of the table called `s`". Prefixing columns with the table alias is needed whenever two tables have a column of the same name (here both have `id`).

The result has one row per enrollment, now showing a real name instead of a number.

## Joining three tables

Chain more `JOIN`s to keep going. Each one needs its own `ON`:

```sql
SELECT s.name, c.title, e.grade
FROM enrollments e
JOIN students s ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id;
```

Think of it as building a wide, temporary table that has student, course and grade side by side. After that, `WHERE`, `ORDER BY`, `GROUP BY` and everything you already know work normally on it:

```sql
SELECT c.title, ROUND(AVG(e.grade), 1) AS average
FROM enrollments e
JOIN courses c ON c.id = e.course_id
GROUP BY c.title;
```

## INNER JOIN

`JOIN` is short for `INNER JOIN`: a row is kept only if it has a partner on **both** sides. The next lessons show `LEFT JOIN`, which keeps unmatched rows as well.

> **Watch out:**
> - Forgetting `ON` gives `near ";": syntax error` or, worse, in some forms a "cross join" that pairs every row with every row and returns a huge result.
> - An ambiguous column such as plain `id` when both tables have it gives `ambiguous column name: id`. Prefix it: `s.id`.
> - A wrong alias, like `x.name` when you never defined `x`, gives `no such column: x.name`.
> - Matching the wrong columns (`ON s.id = e.course_id`) runs fine but produces nonsense. Always double check which id points where.

> **Your turn:** finish the query by joining `courses` and filtering for grades of 90 or higher.
