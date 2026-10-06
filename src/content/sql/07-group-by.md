---
title: Counting with GROUP BY
summary: Summarise rows with COUNT, SUM, AVG and groups.
level: beginner
runner: sql
files:
  - name: query.sql
    code: |
      -- For each city, count the students (call the count "students").
      -- Show the cities with the most students first;
      -- if two cities tie, sort them alphabetically.
check:
  output: |
    city | students
    Haifa | 2
    Tel Aviv | 2
    NULL | 1
    Eilat | 1
    Jerusalem | 1
  code:
    - { pattern: '\bGROUP\s+BY\s+city\b', message: "Group the rows by city." }
    - { pattern: 'COUNT\s*\(', message: "Count the rows in each group." }
hints:
  - "You want one result row per city, so the rows must be split into groups before counting."
  - "Add GROUP BY city after FROM, and use COUNT(*) AS students in the SELECT list. For the order, sort by the count (largest first) and then by city."
  - "SELECT city, COUNT(*) AS students FROM students GROUP BY city ORDER BY students DESC, city;"
solution:
  - name: query.sql
    code: |
      SELECT city, COUNT(*) AS students
      FROM students
      GROUP BY city
      ORDER BY students DESC, city;
quiz:
  - q: What does GROUP BY city do?
    options: ["Sorts the cities", "Deletes duplicate cities", "Makes one result row per city"]
    answer: 2
  - q: In SELECT city, COUNT(*) ... GROUP BY city, what does COUNT(*) count?
    options: ["The rows inside each city's group", "All the rows of the table, in every row", "The number of columns"]
    answer: 0
  - q: What does  AS students  do?
    options: ["Selects the students table", "Gives the column a new name", "Filters students"]
    answer: 1
  - q: Which is correct for sorting by count descending, then city?
    options: ["ORDER BY city, students DESC", "ORDER BY DESC students city", "ORDER BY students DESC, city"]
    answer: 2
---

In the last lesson an aggregate summarised the whole table into one row. More often you want one summary **per category**: students per city, average grade per course, total credits per language. That is the job of `GROUP BY`.

## How GROUP BY works

`GROUP BY` first sorts the rows into piles (groups) that share the same value, and then the aggregate function runs once for each pile.

```sql
SELECT city, COUNT(*) AS students
FROM students
GROUP BY city;
```

Imagine the database putting all Haifa students in one pile, all Tel Aviv students in another, and so on. For every pile it outputs one row: the city, and the number of rows in the pile.

Another example, with the average grade for each course:

```sql
SELECT course_id, AVG(grade) AS average
FROM enrollments
GROUP BY course_id;
```

## The golden rule

Every column in the `SELECT` list must be either

1. listed in `GROUP BY`, or
2. wrapped in an aggregate function (`COUNT`, `AVG`, `SUM`, ...).

`city` is the grouping column and `COUNT(*)` is an aggregate, so `SELECT city, COUNT(*)` is fine.

## Groups can use WHERE too

`WHERE` filters rows **before** they are grouped:

```sql
SELECT course_id, COUNT(*) AS enrolled
FROM enrollments
WHERE grade >= 80
GROUP BY course_id;
```

This counts only the high grades per course.

## Sorting groups

After grouping, you can sort by the alias or by the column. Several sort keys are separated by commas:

```sql
ORDER BY students DESC, city
```

This puts the biggest groups first, and cities with the same count A to Z. The `ORDER BY` clause comes last, after `GROUP BY`.

## NULL gets its own group

Yael has no city. Rows with `NULL` form a group of their own, and in SQLite `NULL` sorts before text, which is why it is listed above Eilat in the alphabetical tie-break of our exercise.

## The clause order so far

`SELECT`, `FROM`, `WHERE`, `GROUP BY`, `ORDER BY`, `LIMIT`.

> **Watch out:**
> - Selecting a plain column that is not in `GROUP BY`, like `SELECT name, city, COUNT(*) ... GROUP BY city`, is accepted by SQLite but shows only one random name per group. Other databases refuse it with an error.
> - `GROUP BY` goes after `WHERE` and before `ORDER BY`; mixing the order gives `near "GROUP": syntax error`.
> - You cannot filter on an aggregate with `WHERE`. Use `HAVING`, which is the next lesson.
> - If you rename a column with `AS students`, remember that it is also the name of a table. SQL is fine with it here, but it can be confusing.

> **Your turn:** count the students in each city, biggest groups first, ties alphabetical.
