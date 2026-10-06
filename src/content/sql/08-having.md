---
title: HAVING - filtering groups
summary: Keep only the groups whose summary passes a test.
level: intermediate
runner: sql
files:
  - name: query.sql
    code: |
      -- Look at the enrollments table.
      -- For each course_id show:
      --   course_id
      --   enrolled : how many rows (enrolments) the course has
      --   average  : the average grade, rounded to 1 decimal place
      -- Keep only the courses whose average grade is 80 or higher,
      -- best average first.
check:
  output: |
    course_id | enrolled | average
    3 | 3 | 88.3
    5 | 2 | 84.5
    4 | 3 | 83.5
  code:
    - { pattern: '\bGROUP\s+BY\s+course_id\b', message: "Group the rows by course_id." }
    - { pattern: '\bHAVING\b', message: "Filter the groups with HAVING." }
    - { pattern: 'AVG\s*\(', message: "Use AVG in the HAVING condition or the select list." }
hints:
  - "WHERE filters single rows before grouping, but here the condition is about each group's average, which exists only after grouping."
  - "Write GROUP BY course_id, then HAVING AVG(grade) >= 80 right after it, then ORDER BY the average in descending order. In the SELECT list use COUNT(*) AS enrolled and ROUND(AVG(grade), 1) AS average."
  - "SELECT course_id, COUNT(*) AS enrolled, ROUND(AVG(grade), 1) AS average FROM enrollments GROUP BY course_id HAVING AVG(grade) >= 80 ORDER BY average DESC;"
solution:
  - name: query.sql
    code: |
      SELECT course_id,
             COUNT(*) AS enrolled,
             ROUND(AVG(grade), 1) AS average
      FROM enrollments
      GROUP BY course_id
      HAVING AVG(grade) >= 80
      ORDER BY average DESC;
quiz:
  - q: When is HAVING applied?
    options: ["Before the rows are grouped", "After the groups and their aggregates have been computed", "Only when there is no GROUP BY"]
    answer: 1
  - q: Which query is correct?
    options: ["SELECT city FROM students WHERE COUNT(*) > 1 GROUP BY city", "SELECT city FROM students GROUP BY city HAVING COUNT(*) > 1", "SELECT city FROM students HAVING COUNT(*) > 1 GROUP BY city"]
    answer: 1
  - q: What is the difference between WHERE and HAVING?
    options: ["WHERE filters groups, HAVING filters rows", "They are identical", "WHERE filters rows before grouping, HAVING filters groups after"]
    answer: 2
  - q: Can WHERE and HAVING be used in the same query?
    options: ["Yes, WHERE first and HAVING after GROUP BY", "No, only one of them", "Only if the table has no NULLs"]
    answer: 0
---

You know that `WHERE` removes rows. But what if the thing you want to test is a **summary** such as "cities with at least two students" or "courses whose average grade is above 80"? That number does not exist until the groups are formed, so `WHERE` cannot see it. SQL has a second filter just for this, called `HAVING`.

## Two filters, two moments

Think of the query as a pipeline:

1. `FROM` picks the table.
2. `WHERE` throws away individual rows.
3. `GROUP BY` forms groups and computes the aggregates.
4. `HAVING` throws away whole groups.
5. `SELECT`, then `ORDER BY` and `LIMIT` show and sort what is left.

Because `WHERE` runs before grouping, `WHERE COUNT(*) > 1` is impossible and gives `misuse of aggregate function COUNT()`. The correct way is `HAVING`.

## Example

Cities with at least two students:

```sql
SELECT city, COUNT(*) AS students
FROM students
GROUP BY city
HAVING COUNT(*) >= 2;
```

```text
city | students
Haifa | 2
Tel Aviv | 2
```

`HAVING` sits after `GROUP BY`, and its condition is written with an aggregate function, exactly like in the select list. In SQLite you may also use the alias (`HAVING students >= 2`), but writing the full aggregate works everywhere.

## Using both WHERE and HAVING

They combine nicely. Here only students aged 20 or more are counted at all (`WHERE`), and then only cities with at least two of them survive (`HAVING`):

```sql
SELECT city, COUNT(*) AS students
FROM students
WHERE age >= 20
GROUP BY city
HAVING COUNT(*) >= 2;
```

Use `WHERE` whenever the condition is about a single row, since it is simpler and lets the database discard data early. Use `HAVING` only for conditions on aggregates.

## Other useful HAVING conditions

```sql
HAVING SUM(credits) > 6
HAVING MAX(grade) = 100
HAVING COUNT(*) BETWEEN 2 AND 5
```

> **Watch out:**
> - `HAVING` before `GROUP BY` gives `near "GROUP": syntax error`. The order is `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`.
> - Using an aggregate in `WHERE` gives `misuse of aggregate function`.
> - Using `HAVING` for a plain row condition such as `HAVING age > 20` is confusing and may fail. Use `WHERE`.
> - `AVG` ignores `NULL`s, so a missing grade does not drag an average down. `COUNT(*)` still counts that row, though.

> **Your turn:** from `enrollments`, group by `course_id` and show the number of enrolments and the average grade (one decimal), keep only courses with an average of 80 or more, best first.
