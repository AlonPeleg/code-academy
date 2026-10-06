---
title: Aliases and DISTINCT
summary: Rename columns with AS and remove duplicate rows.
level: beginner
runner: sql
files:
  - name: query.sql
    code: |
      -- Show the list of programming languages used by the courses.
      -- Each language should appear only once, with no repeats.
      -- Name the column programming_language, and sort the list A to Z.
check:
  output: |
    programming_language
    HTML
    JavaScript
    Python
    SQL
  code:
    - { pattern: '\bDISTINCT\b', message: "Use DISTINCT to remove duplicates." }
    - { pattern: '\bAS\s+programming_language\b', message: "Rename the column with AS programming_language." }
hints:
  - "Two small tools: one removes repeated rows from the result, the other gives a column a new name."
  - "Put the word DISTINCT right after SELECT. Rename with the pattern  column AS new_name. The column to read is language, from courses. Finish with an ORDER BY."
  - "SELECT DISTINCT language AS programming_language FROM courses ORDER BY language;"
solution:
  - name: query.sql
    code: |
      SELECT DISTINCT language AS programming_language
      FROM courses
      ORDER BY language;
quiz:
  - q: What does DISTINCT do?
    options: ["Sorts the rows", "Removes duplicate rows from the result", "Counts the rows"]
    answer: 1
  - q: In  SELECT name AS student FROM students , what is  student ?
    options: ["A new table", "A filter", "A new label for the name column in the result"]
    answer: 2
  - q: Does AS rename the column inside the database?
    options: ["No, only in the result of this query", "Yes, permanently", "Only if you use DISTINCT"]
    answer: 0
  - q: Where does DISTINCT go?
    options: ["At the end of the query", "Right after SELECT", "After FROM"]
    answer: 1
---

Often the raw column names are not exactly what you want to show, and often a column contains the same value many times. In this lesson you will learn two small but very useful tools: **aliases** (`AS`) to rename columns and `DISTINCT` to remove repeats.

## Aliases with AS

An **alias** is a temporary name for a column in the result. It does not change the database at all, it only changes the heading you see:

```sql
SELECT name AS student, city AS hometown
FROM students;
```

The result has the headings `student` and `hometown` instead of `name` and `city`.

Aliases become really handy when the column is a **calculation**. Without a name, the heading would be the whole expression:

```sql
SELECT title, credits * 10 AS study_hours
FROM courses;
```

Here `credits * 10` is computed for each row, and `AS study_hours` gives the new column a readable name. SQL supports the usual operators `+ - * /` as well as functions such as `UPPER(title)` and `LENGTH(title)`.

If you want an alias with spaces, wrap it in double quotes: `AS "study hours"`. Beginners usually stick to underscores.

You can also use the alias later in the same query, for example in `ORDER BY study_hours`.

## Removing duplicates with DISTINCT

Look at the `courses` table: both *JavaScript Basics* and *React in Practice* use JavaScript. This query lists the language once per course:

```sql
SELECT language
FROM courses;
```

```text
language
HTML
JavaScript
Python
SQL
JavaScript
```

`JavaScript` appears twice. Put `DISTINCT` straight after `SELECT` and each value shows up only once:

```sql
SELECT DISTINCT language
FROM courses;
```

```text
language
HTML
JavaScript
Python
SQL
```

With several columns, `DISTINCT` looks at the whole combination: `SELECT DISTINCT city, age` would only drop rows where **both** values repeat.

## Putting it together

```sql
SELECT DISTINCT city AS place
FROM students
ORDER BY place;
```

Keep in mind that `NULL` (a missing value) is treated as its own value by `DISTINCT`, so a missing city will appear once as `NULL`.

> **Watch out:**
> - `DISTINCT` goes right after `SELECT`, not after the column name. `SELECT language DISTINCT` is a syntax error.
> - `AS` renames only for this result. In `WHERE` you should still use the real column name, because many databases do not allow an alias there and report `no such column`.
> - An alias with a space and no double quotes, as in `AS study hours`, gives `near "hours": syntax error`.
> - `DISTINCT` applies to the whole row of selected columns, not to just the first column.

> **Your turn:** show each programming language used by a course only once, call the column `programming_language`, and sort the list alphabetically.
