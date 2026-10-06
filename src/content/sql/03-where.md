---
title: WHERE - filtering rows
summary: Keep only the rows that match a condition.
level: beginner
runner: sql
files:
  - name: query.sql
    code: |
      -- Show the name and age of the students older than 20
      -- who also live in 'Tel Aviv'
check:
  output: |
    name | age
    Ava | 21
    Maya | 23
  code:
    - { pattern: '\bWHERE\b', message: "Filter with WHERE." }
    - { pattern: '\bAND\b', message: "Combine the two conditions with AND." }
hints:
  - "A filter clause goes after FROM. Each condition compares a column with a value, and the word that requires both to be true joins them."
  - "Use WHERE with two conditions: age greater than 20, and city equal to the text 'Tel Aviv' (text goes in single quotes). Join them with AND."
  - "SELECT name, age FROM students WHERE age > 20 AND city = 'Tel Aviv';"
solution:
  - name: query.sql
    code: |
      SELECT name, age
      FROM students
      WHERE age > 20 AND city = 'Tel Aviv';
quiz:
  - q: Which clause filters rows?
    options: ["ORDER BY", "LIMIT", "WHERE"]
    answer: 2
  - q: How do you write text in SQL?
    options: ["Without quotes: Haifa", "In single quotes: 'Haifa'", "In backticks: `Haifa`"]
    answer: 1
  - q: How do you find rows where city has no value?
    options: ["city IS NULL", "city = NULL", "city = ''"]
    answer: 0
    explain: NULL means unknown or missing, so you must test it with IS NULL.
  - q: What does WHERE age > 20 AND city = 'Haifa' return?
    options: ["Rows where age is over 20 or the city is Haifa", "Rows where both conditions are true", "Only rows from Haifa"]
    answer: 1
---

A table can hold thousands or millions of rows, but you usually care about only a few of them. `WHERE` is the filter: it keeps the rows for which a condition is true and drops all the others.

## The basic shape

```sql
SELECT name, age
FROM students
WHERE age >= 21;
```

Read it as: "show name and age of students, but only where age is at least 21". The `WHERE` clause always comes right after `FROM`. Each row is tested one by one, and only rows passing the test appear in the result.

## Comparison operators

| Operator | Meaning | Example |
| --- | --- | --- |
| `=` | equal (one equals sign, not two) | `city = 'Haifa'` |
| `<>` or `!=` | not equal | `city <> 'Haifa'` |
| `<` `>` | smaller, bigger | `age > 20` |
| `<=` `>=` | smaller or equal, bigger or equal | `age <= 21` |

Notice that SQL uses a single `=` to compare, unlike many programming languages.

## Text needs single quotes

Numbers are written as they are, but **text values go in single quotes**: `city = 'Haifa'`. Text comparison in SQLite is case-sensitive for `=`, so `'haifa'` would not match `'Haifa'`. Double quotes are meant for column and table names, so do not use them for text.

## Combining conditions

Use `AND`, `OR` and `NOT` to build bigger questions:

```sql
SELECT name
FROM students
WHERE age > 20 AND city = 'Haifa';     -- both must be true

SELECT name
FROM students
WHERE city = 'Haifa' OR city = 'Eilat'; -- at least one must be true
```

When you mix `AND` and `OR`, `AND` is evaluated first. Add round brackets to be clear: `WHERE (a OR b) AND c`.

## NULL: the missing value

Yael's city is missing, which the database stores as `NULL`. `NULL` means "unknown", and nothing is ever equal to something unknown, not even another `NULL`. So these both return no rows:

```sql
SELECT name FROM students WHERE city = NULL;   -- never matches
SELECT name FROM students WHERE city <> 'Haifa'; -- also skips Yael!
```

Test for missing values with `IS NULL` or `IS NOT NULL`:

```sql
SELECT name FROM students WHERE city IS NULL;  -- Yael
```

> **Watch out:**
> - Writing `city = Haifa` without quotes gives `no such column: Haifa` because SQL thinks Haifa is a column.
> - `WHERE age = 20 OR 21` does not mean "20 or 21". Write `age = 20 OR age = 21`.
> - `= NULL` silently returns nothing. Use `IS NULL`.
> - `WHERE` must come before `ORDER BY` and `LIMIT`; putting it after gives `near "WHERE": syntax error`.

> **Your turn:** find the name and age of students older than 20 who live in `'Tel Aviv'`.
