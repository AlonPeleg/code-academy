---
title: "CTEs: WITH and recursive queries"
summary: Name a sub-result with WITH to make queries readable, and generate or walk data with WITH RECURSIVE.
level: advanced
runner: sql
files:
  - name: query.sql
    code: |
      -- Show, for every credit value from 1 to 5, how many courses have that many credits.
      -- Credit values with no course must still appear, with 0.
      -- Final columns: credits | courses     (ordered by credits)
      --
      -- Build it in three parts, in ONE statement:
      -- 1. A recursive CTE called levels, with one column credits, that produces the numbers 1, 2, 3, 4, 5:
      --      start with SELECT 1, then repeat with  credits + 1  while credits < 5.
      -- 2. A second CTE called counts that groups the courses table by credits and counts them (column n).
      -- 3. A final SELECT: join levels to counts on credits, keeping ALL levels, and replace
      --    the missing counts (NULL) with 0 using the COALESCE function.

      SELECT 'replace me' AS credits;
check:
  output: |
    credits | courses
    1 | 0
    2 | 1
    3 | 2
    4 | 2
    5 | 0
  code:
    - { pattern: 'WITH\s+RECURSIVE', message: "Start with  WITH RECURSIVE levels(credits) AS (...)." }
    - { pattern: 'UNION\s+ALL', message: "Join the starting row and the repeating row with UNION ALL." }
    - { pattern: 'LEFT\s+JOIN', message: "Use a LEFT JOIN so credit values without courses are kept." }
    - { pattern: 'COALESCE\s*\(', message: "Turn NULL into 0 with COALESCE(n, 0)." }
hints:
  - "A CTE is a named temporary result: WITH name AS (query). A RECURSIVE one has a starting SELECT, UNION ALL, and a SELECT that reads from the CTE itself, with a WHERE that stops it. Several CTEs are separated by commas, with a single WITH."
  - "WITH RECURSIVE levels(credits) AS ( SELECT 1 UNION ALL SELECT credits + 1 FROM levels WHERE credits < 5 ), counts AS ( SELECT credits, COUNT(*) AS n FROM courses GROUP BY credits ) and then a normal SELECT that joins them."
  - "WITH RECURSIVE levels(credits) AS (SELECT 1 UNION ALL SELECT credits + 1 FROM levels WHERE credits < 5), counts AS (SELECT credits, COUNT(*) AS n FROM courses GROUP BY credits) SELECT l.credits, COALESCE(c.n, 0) AS courses FROM levels AS l LEFT JOIN counts AS c ON c.credits = l.credits ORDER BY l.credits;"
solution:
  - name: query.sql
    code: |
      WITH RECURSIVE levels(credits) AS (
        SELECT 1
        UNION ALL
        SELECT credits + 1 FROM levels WHERE credits < 5
      ),
      counts AS (
        SELECT credits, COUNT(*) AS n
        FROM courses
        GROUP BY credits
      )
      SELECT l.credits, COALESCE(c.n, 0) AS courses
      FROM levels AS l
      LEFT JOIN counts AS c ON c.credits = l.credits
      ORDER BY l.credits;
quiz:
  - q: What is a CTE (WITH ... AS)?
    options: ["A permanent table stored in the database", "A kind of index", "A named temporary result that exists only for the one statement it belongs to"]
    answer: 2
  - q: What stops a recursive CTE from running forever?
    options: ["A condition in its repeating SELECT, such as WHERE credits < 5, that eventually produces no new rows", "SQLite stops it after 10 rounds", "The UNION ALL keyword"]
    answer: 0
  - q: What does COALESCE(n, 0) return?
    options: ["Always 0", "n, or 0 when n is NULL", "The larger of n and 0"]
    answer: 1
  - q: Why use a CTE instead of a subquery in FROM?
    options: ["It is always faster", "Subqueries are not allowed in SQLite", "It gives the step a name, can be reused several times, and reads from top to bottom"]
    answer: 2
---

Queries tend to grow: a subquery inside a subquery inside a join, until nobody can read them. A **Common Table Expression** (CTE) lets you give a sub-result a **name**, define it first, and then use it like a table. It makes long queries read from top to bottom like a recipe.

## A basic CTE

```sql
WITH per_student AS (
  SELECT student_id,
         ROUND(AVG(grade), 1) AS avg_grade
  FROM enrollments
  GROUP BY student_id
)
SELECT s.name, p.avg_grade
FROM per_student AS p
JOIN students AS s ON s.id = p.student_id
ORDER BY p.avg_grade DESC;
```

1. `WITH per_student AS ( ... )` defines a temporary table called `per_student`. Its query is written inside the brackets.
2. The main `SELECT` after it uses `per_student` exactly like a real table.
3. It only exists for this one statement. Nothing is saved in the database.

You can define several CTEs with one `WITH`, separated by commas, and later ones may use earlier ones:

```sql
WITH
  per_student AS (SELECT student_id, AVG(grade) AS avg_grade FROM enrollments GROUP BY student_id),
  overall     AS (SELECT AVG(avg_grade) AS typical FROM per_student)
SELECT student_id FROM per_student, overall WHERE avg_grade > typical;
```

The big advantages over a nested subquery: the step has a **name**, you can use it **more than once**, and you read the logic in the order it happens.

## Recursive CTEs

A CTE may refer to **itself**. This is how SQL repeats something, walks through a tree (an organisation chart, folders inside folders) or generates a series of numbers:

```sql
WITH RECURSIVE countdown(n) AS (
  SELECT 3                                   -- 1. the starting row(s)
  UNION ALL
  SELECT n - 1 FROM countdown WHERE n > 1    -- 2. the repeating step
)
SELECT n FROM countdown;
```

```
n
3
2
1
```

How it works, in plain steps:

1. SQL runs the **starting** part first. That gives the row `3`.
2. It then runs the **repeating** part, using the rows produced in the previous round (`n = 3`), and gets `2`.
3. It repeats with the newest rows until the repeating part returns **no rows**. Here `WHERE n > 1` makes it stop after `1`.
4. All rows from all rounds are combined (that is what `UNION ALL` does) and become the result.

The `(n)` after the name lists the column names. A recursive CTE **must** have a stopping condition, otherwise it runs forever.

## Filling gaps with a generated series

Real tables often miss values. Counting courses per credit value returns only the credit values that exist (2, 3, 4). If you want 1 to 5 in your report, generate the numbers with a recursive CTE and `LEFT JOIN` your counts onto them. The result has `NULL` where nothing matched, and `COALESCE(value, 0)` swaps a `NULL` for a fallback: it returns its first argument that is not `NULL`.

That is exactly the exercise below.

> **Watch out:**
> - Forgetting the stop condition: the query never ends (or the editor stops it). Always include `WHERE` in the repeating part.
> - Writing `WITH RECURSIVE` once per CTE: you write `WITH RECURSIVE` only once at the very start, and then comma-separate the CTEs.
> - Putting a comma before the final `SELECT`: `near "SELECT": syntax error`.
> - A missing alias: a CTE referenced twice in the same query needs different aliases such as `FROM per_student AS a JOIN per_student AS b`.
> - Expecting a CTE to remain after the statement. It exists only for that one statement; use `CREATE VIEW` (next lessons) to keep a query.

> **Your turn:** write one statement with a recursive CTE `levels(credits)` for 1 to 5, a second CTE `counts` that counts courses per credit value, and a final `SELECT` that left-joins them and shows `credits` and `courses` (0 when there is no course).
