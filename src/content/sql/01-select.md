---
title: SELECT - reading data
summary: Ask a table for the columns you want.
level: beginner
runner: sql
files:
  - name: query.sql
    code: |
      -- Show the name and city of every student
      -- (replace this comment with a query)
check:
  output: |
    name | city
    Ava | Tel Aviv
    Noam | Haifa
    Maya | Tel Aviv
    Omer | Jerusalem
    Lior | Haifa
    Dana | Eilat
    Yael | NULL
  code:
    - { pattern: '\bSELECT\b', message: "Start with SELECT." }
    - { pattern: '\bFROM\s+students\b', message: "Read from the students table." }
hints:
  - "A query has two essential parts: which columns you want, and which table they come from."
  - "The pattern is SELECT <columns separated by commas> FROM <table>; and the table here is students."
  - "SELECT name, city FROM students;"
solution:
  - name: query.sql
    code: |
      SELECT name, city
      FROM students;
quiz:
  - q: Which keyword chooses the columns to show?
    options: ["FROM", "WHERE", "SELECT"]
    answer: 2
  - q: What does  SELECT *  mean?
    options: ["Only the first column", "All columns", "Count the rows"]
    answer: 1
  - q: What is a row in a table?
    options: ["A column name", "One record, like one student", "A database"]
    answer: 1
  - q: Which clause says WHICH table to read from?
    options: ["FROM", "SELECT", "TABLE"]
    answer: 0
---

A **database** stores data in **tables**, a lot like spreadsheets. Almost every app you use, from online shops to social networks, keeps its information in a database. **SQL** (usually said "sequel") is the language you use to ask a database questions. In this lesson you will write your very first query.

## Tables, columns and rows

A table has **columns** (the kinds of facts, such as `name` or `age`) and **rows** (the individual records, such as one student). Open the **Sample data** tab next to the Result tab to see the three tables we will practise on:

- `students` with `id`, `name`, `age` and `city`
- `courses` with `id`, `title`, `language` and `credits`
- `enrollments` which links students to courses and stores a `grade`

## Your first query

The most important command is `SELECT`:

```sql
SELECT name, age
FROM students;
```

Piece by piece:

- `SELECT` is followed by the columns you want, separated by commas.
- `FROM` names the table to read.
- The semicolon `;` ends the statement.

The result is a new little table with only those two columns, and one row per student. Rows come back in the order they were stored unless you ask for something else (a later lesson shows how).

## All columns with *

The star is a shortcut for "every column":

```sql
SELECT *
FROM courses;
```

It is perfect for exploring a table, but in real projects it is better to list the columns you really need.

## Good to know

- SQL keywords such as `SELECT` and `FROM` are not case-sensitive. Writing them in capitals is just a habit that makes queries easier to read.
- Layout is free: you can put the whole query on one line or split it over several. Splitting at each keyword is the common style.
- A line starting with `--` is a **comment** that SQL ignores.
- A value that is missing shows up as `NULL`. Yael has no city, so you will see `NULL` in her row.
- The editor autocompletes table and column names. Press Tab or Enter to accept a suggestion.

> **Watch out:**
> - A misspelt column gives `no such column: nam`.
> - A misspelt table gives `no such table: student`.
> - A comma after the last column, as in `SELECT name, FROM students`, gives `near "FROM": syntax error`.
> - Forgetting the comma between columns (`SELECT name city`) does not fail but gives one column called `name` where `city` is treated as its new label.

> **Your turn:** show the `name` and `city` of every student.
