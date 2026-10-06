---
title: Aggregate functions
summary: Turn many rows into one number with COUNT, SUM, AVG, MIN and MAX.
level: beginner
runner: sql
files:
  - name: query.sql
    code: |
      -- Summarise the whole enrollments table in ONE row with these columns:
      --   enrollments : how many rows the table has
      --   graded      : how many rows have a grade (rows with no grade do not count)
      --   average     : the average grade, rounded to 1 decimal place
      --   best        : the highest grade
      --   worst       : the lowest grade
check:
  output: |
    enrollments | graded | average | best | worst
    13 | 12 | 82.2 | 95 | 60
  code:
    - { pattern: 'COUNT\s*\(\s*\*\s*\)', message: "Count all rows with COUNT(*)." }
    - { pattern: 'COUNT\s*\(\s*grade\s*\)', message: "Count the graded rows with COUNT(grade)." }
    - { pattern: 'ROUND\s*\(\s*AVG\s*\(', message: "Round the AVG with ROUND(..., 1)." }
    - { pattern: 'MAX\s*\(', message: "Use MAX for the best grade." }
    - { pattern: 'MIN\s*\(', message: "Use MIN for the worst grade." }
hints:
  - "Aggregate functions look at many rows and return one value. Give each result a name with AS so the column headings match."
  - "COUNT(*) counts every row, COUNT(grade) counts only the rows where grade is not NULL, ROUND(AVG(grade), 1) rounds the average to one decimal, then MAX(grade) and MIN(grade)."
  - "SELECT COUNT(*) AS enrollments, COUNT(grade) AS graded, ROUND(AVG(grade), 1) AS average, MAX(grade) AS best, MIN(grade) AS worst FROM enrollments;"
solution:
  - name: query.sql
    code: |
      SELECT COUNT(*) AS enrollments,
             COUNT(grade) AS graded,
             ROUND(AVG(grade), 1) AS average,
             MAX(grade) AS best,
             MIN(grade) AS worst
      FROM enrollments;
quiz:
  - q: What does COUNT(*) return?
    options: ["The sum of a column", "The biggest value", "The number of rows"]
    answer: 2
  - q: How does COUNT(grade) differ from COUNT(*)?
    options: ["It skips rows where grade is NULL", "It adds up the grades", "There is no difference"]
    answer: 0
  - q: Which function gives the average of a column?
    options: ["MEAN(col)", "AVG(col)", "AVERAGE(col)"]
    answer: 1
  - q: What does  SELECT MAX(age) FROM students  return?
    options: ["The youngest student's age", "All ages sorted", "One row with the highest age"]
    answer: 2
---

So far each result row came from one row of a table. Often you want a summary instead: how many, how much, what is the average. **Aggregate functions** look at many rows and boil them down into a single value.

## The five main aggregates

| Function | Meaning | Example |
| --- | --- | --- |
| `COUNT(*)` | number of rows | `COUNT(*)` |
| `COUNT(col)` | number of rows where `col` is not `NULL` | `COUNT(city)` |
| `SUM(col)` | total | `SUM(credits)` |
| `AVG(col)` | average | `AVG(age)` |
| `MIN(col)` | smallest | `MIN(age)` |
| `MAX(col)` | largest | `MAX(age)` |

```sql
SELECT COUNT(*) AS total_students, AVG(age) AS average_age
FROM students;
```

```text
total_students | average_age
7 | 21.142857142857142
```

Notice that a query with aggregates and no grouping returns exactly **one row**.

## NULL is ignored

Aggregates (except `COUNT(*)`) skip `NULL` values. Yael's `city` is `NULL`, so:

```sql
SELECT COUNT(*) AS rows_total, COUNT(city) AS with_city
FROM students;
```

```text
rows_total | with_city
7 | 6
```

`COUNT(*)` counts rows, `COUNT(city)` counts rows that actually have a city. The same applies to `AVG`: a missing grade is not treated as zero, it is simply left out of the average, which is usually what you want.

## Rounding and arithmetic

`ROUND(value, digits)` tidies up long decimals. You can also calculate with aggregates:

```sql
SELECT ROUND(AVG(age), 1) AS average_age,
       MAX(age) - MIN(age) AS age_range
FROM students;
```

## Filter first, summarise second

`WHERE` runs before the aggregate, so the summary only covers the rows that passed the filter:

```sql
SELECT COUNT(*) AS in_haifa
FROM students
WHERE city = 'Haifa';
```

```text
in_haifa
2
```

## Counting unique values

`COUNT(DISTINCT col)` counts each different value once:

```sql
SELECT COUNT(DISTINCT language) AS languages
FROM courses;     -- 4
```

> **Watch out:**
> - Mixing a plain column with an aggregate and no `GROUP BY`, like `SELECT name, MAX(age) FROM students`, is risky: other databases refuse it with an error, and the value for `name` is not something you should rely on. The next lessons show the right way (`GROUP BY`).
> - Putting an aggregate in `WHERE`, like `WHERE AVG(age) > 20`, gives `misuse of aggregate function AVG()`. That job belongs to `HAVING`, coming soon.
> - `COUNT(*)` and `COUNT(col)` differ whenever the column has `NULL`s.
> - `AVG` of whole numbers can give decimals, so use `ROUND` when displaying.

> **Your turn:** write one query on `enrollments` that returns a single row with the columns `enrollments`, `graded`, `average` (rounded to 1 decimal), `best` and `worst`.
