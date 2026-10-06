---
title: CASE WHEN - conditional values
summary: Create labels and categories with if-then logic inside a query.
level: intermediate
runner: sql
files:
  - name: query.sql
    code: |
      -- Show every course title and a size label in a column called size:
      --   4 credits or more      -> big
      --   exactly 3 credits      -> medium
      --   anything else          -> small
      -- Keep the courses in id order.
check:
  output: |
    title | size
    Intro to HTML | small
    JavaScript Basics | medium
    Python for Everyone | big
    SQL Fundamentals | medium
    React in Practice | big
  code:
    - { pattern: '\bCASE\b', message: "Use a CASE expression." }
    - { pattern: '\bWHEN\b', message: "Add WHEN ... THEN branches." }
    - { pattern: '\bELSE\b', message: "Add an ELSE branch for everything else." }
    - { pattern: '\bEND\b', message: "Finish the CASE with END." }
hints:
  - "SQL has its own if / else if / else that works inside the SELECT list and gives back a value for each row."
  - "The shape is CASE WHEN condition THEN value WHEN condition THEN value ELSE value END, followed by AS size. Conditions are checked from top to bottom and the first true one wins."
  - "SELECT title, CASE WHEN credits >= 4 THEN 'big' WHEN credits = 3 THEN 'medium' ELSE 'small' END AS size FROM courses ORDER BY id;"
solution:
  - name: query.sql
    code: |
      SELECT title,
             CASE
               WHEN credits >= 4 THEN 'big'
               WHEN credits = 3 THEN 'medium'
               ELSE 'small'
             END AS size
      FROM courses
      ORDER BY id;
quiz:
  - q: What does a CASE expression produce?
    options: ["A new table", "One value for each row", "A sorted list"]
    answer: 1
  - q: If several WHEN conditions are true, which one is used?
    options: ["The first one that is true", "The last one that is true", "All of them"]
    answer: 0
  - q: What happens when no WHEN matches and there is no ELSE?
    options: ["The row is removed", "SQL reports an error", "The result is NULL"]
    answer: 2
  - q: Which keyword ends a CASE expression?
    options: ["STOP", "END", "ENDCASE"]
    answer: 1
---

Programming languages have `if ... else`. In SQL, the same idea lives inside queries as the `CASE` expression. It lets you turn raw values into labels, groups or flags: "pass or fail", "small, medium or large", "adult or minor".

## The syntax

```sql
CASE
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE other_result
END
```

- Each `WHEN` has a condition, written exactly like in a `WHERE` clause.
- `THEN` says which value to use when that condition is true.
- `ELSE` is the fallback when no condition is true. It is optional, but without it unmatched rows get `NULL`.
- `END` closes the expression. Don't forget it!

The whole `CASE ... END` behaves like a single value, so you can give it a name with `AS`:

```sql
SELECT name,
       age,
       CASE
         WHEN age >= 23 THEN 'senior'
         WHEN age >= 20 THEN 'regular'
         ELSE 'junior'
       END AS level
FROM students;
```

```text
name | age | level
Ava | 21 | regular
Noam | 19 | junior
Maya | 23 | senior
...
```

## Order matters

The conditions are tested **from top to bottom** and the first true one wins. That is why the example above can say `age >= 20` for the second branch: anyone who is 23 or more has already been caught by the first. Put the most specific or strictest test first.

## Handling NULL

A missing value never satisfies a comparison, so it falls through to `ELSE`. If you want to treat missing values specially, test them first:

```sql
CASE
  WHEN city IS NULL THEN 'unknown'
  WHEN city = 'Haifa' THEN 'north'
  ELSE 'other'
END
```

For the simple case of replacing `NULL` with a default there is a shorter function: `COALESCE(city, 'unknown')`.

## CASE in other places

`CASE` can appear almost anywhere a value is allowed. It is common in `ORDER BY` (custom sort order) and together with aggregates, for example counting only some rows:

```sql
SELECT SUM(CASE WHEN age >= 21 THEN 1 ELSE 0 END) AS adults_21_plus
FROM students;
```

For each student the `CASE` gives 1 or 0, and `SUM` adds them up, which counts the students aged 21 or more.

> **Watch out:**
> - Forgetting `END` gives `near "FROM": syntax error`.
> - Missing `THEN` after a `WHEN` gives `near "WHEN": syntax error`.
> - Mixing types in the branches (some numbers, some text) works in SQLite but makes results hard to use. Keep them the same kind.
> - Text results need single quotes: `THEN 'big'`. Without quotes SQL looks for a column called `big`.

> **Your turn:** show each course `title` with a column `size`: `big` for 4 credits or more, `medium` for exactly 3, otherwise `small`, in `id` order.
