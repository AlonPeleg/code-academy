---
title: Window functions
summary: Rank rows and calculate running or per-group totals without collapsing the rows.
level: advanced
runner: sql
files:
  - name: query.sql
    code: |
      -- For every enrollment that has a grade, show:
      --   title       the course title
      --   name        the student's name
      --   grade       the grade
      --   place       the student's rank inside that course (best grade = 1), using a rank window function
      --   course_avg  the average grade of that course, rounded to 1 decimal,
      --               shown on EVERY row (an average used as a window function)
      -- Sort by course id, then by place.
      -- Hint for the tables: enrollments joined to students and to courses.

      SELECT c.title, s.name, e.grade
      FROM enrollments AS e
      JOIN students AS s ON s.id = e.student_id
      JOIN courses AS c ON c.id = e.course_id
      WHERE e.grade IS NOT NULL
      ORDER BY c.id;
check:
  output: |
    title | name | grade | place | course_avg
    Intro to HTML | Ava | 90 | 1 | 75
    Intro to HTML | Omer | 60 | 2 | 75
    JavaScript Basics | Ava | 85 | 1 | 78.3
    JavaScript Basics | Lior | 80 | 2 | 78.3
    JavaScript Basics | Noam | 70 | 3 | 78.3
    Python for Everyone | Maya | 95 | 1 | 88.3
    Python for Everyone | Noam | 88 | 2 | 88.3
    Python for Everyone | Dana | 82 | 3 | 88.3
    SQL Fundamentals | Maya | 92 | 1 | 83.5
    SQL Fundamentals | Omer | 75 | 2 | 83.5
    React in Practice | Ava | 91 | 1 | 84.5
    React in Practice | Lior | 78 | 2 | 84.5
  code:
    - { pattern: 'RANK\s*\(\s*\)\s*OVER\s*\(', message: "Add a rank column with RANK() OVER (...)." }
    - { pattern: 'PARTITION\s+BY', message: "Restart the ranking for each course with PARTITION BY." }
    - { pattern: 'AVG\s*\([^)]*\)\s*OVER\s*\(', message: "Add the course average with AVG(grade) OVER (PARTITION BY ...)." }
hints:
  - "A window function looks at a 'window' of related rows but keeps every row in the result. The window is described by OVER (...). PARTITION BY splits the rows into groups, ORDER BY inside OVER sets the order used by the ranking."
  - "Add two columns to the SELECT list: RANK() OVER (PARTITION BY c.id ORDER BY e.grade DESC) AS place, and ROUND(AVG(e.grade) OVER (PARTITION BY c.id), 1) AS course_avg. Then change the final ORDER BY to c.id, place."
  - "SELECT c.title, s.name, e.grade, RANK() OVER (PARTITION BY c.id ORDER BY e.grade DESC) AS place, ROUND(AVG(e.grade) OVER (PARTITION BY c.id), 1) AS course_avg FROM enrollments AS e JOIN students AS s ON s.id = e.student_id JOIN courses AS c ON c.id = e.course_id WHERE e.grade IS NOT NULL ORDER BY c.id, place;"
solution:
  - name: query.sql
    code: |
      SELECT c.title, s.name, e.grade,
             RANK() OVER (PARTITION BY c.id ORDER BY e.grade DESC) AS place,
             ROUND(AVG(e.grade) OVER (PARTITION BY c.id), 1) AS course_avg
      FROM enrollments AS e
      JOIN students AS s ON s.id = e.student_id
      JOIN courses AS c ON c.id = e.course_id
      WHERE e.grade IS NOT NULL
      ORDER BY c.id, place;
quiz:
  - q: What is the main difference between GROUP BY with AVG and AVG(...) OVER (...)?
    options: ["GROUP BY keeps every row, OVER collapses them", "OVER keeps every row and adds the calculated value to each of them, GROUP BY collapses rows into one per group", "There is no difference"]
    answer: 1
  - q: What does PARTITION BY do inside OVER?
    options: ["Splits the rows into separate groups, and the calculation restarts for each group", "Sorts the final result", "Deletes duplicate rows"]
    answer: 0
  - q: Three students tie for first place. What does RANK() give the next student?
    options: ["2", "1", "4"]
    answer: 2
    explain: "RANK leaves a gap after a tie (1, 1, 1, 4). DENSE_RANK would give 2, and ROW_NUMBER numbers every row 1, 2, 3, 4 even with ties."
  - q: Which clause adds a running total?
    options: ["SUM(x) OVER (ORDER BY y)", "SUM(x) GROUP BY y", "TOTAL(x) OVER y"]
    answer: 0
---

You already know `GROUP BY`: it squashes many rows into one row per group. That is great for totals, but what if you want to **keep every row** and also show how it compares with its group, such as "this student's grade, and the course average next to it", or "rank inside the course"? Mixing that with `GROUP BY` quickly turns into messy subqueries. **Window functions** solve it: they calculate over a group of rows, but keep the rows.

## The shape: function OVER (...)

```sql
SELECT name, age,
       AVG(age) OVER () AS average_age
FROM students;
```

The part after `OVER` describes the **window**: which rows the function may look at. An empty `OVER ()` means "all rows". Every student row now has an extra column holding the average age of everybody, and no rows disappeared.

## PARTITION BY: one window per group

`PARTITION BY` splits the rows into groups (like `GROUP BY` would) but does not collapse them:

```sql
SELECT name, city, age,
       AVG(age) OVER (PARTITION BY city) AS city_average
FROM students;
```

Each student gets the average age of their own city.

## Ranking functions

Add an `ORDER BY` inside `OVER` and you can number the rows:

```sql
SELECT name, age,
       RANK()       OVER (ORDER BY age) AS rank_,
       DENSE_RANK() OVER (ORDER BY age) AS dense
FROM students
ORDER BY age;
```

| name | age | rank_ | dense |
| --- | --- | --- | --- |
| Noam | 19 | 1 | 1 |
| Dana | 19 | 1 | 1 |
| Omer | 20 | 3 | 2 |
| Ava | 21 | 4 | 3 |

- `ROW_NUMBER()` gives every row a unique number 1, 2, 3, ... Rows that tie are numbered in an arbitrary order, so add a tie-breaker such as `ORDER BY age, id` if the order matters.
- `RANK()` gives tied rows the same number and then **skips**: 1, 1, 3.
- `DENSE_RANK()` gives tied rows the same number and does **not** skip: 1, 1, 2.

Together with `PARTITION BY` this answers questions like "the top 3 grades per course": rank inside a subquery, then filter `WHERE place <= 3` outside (you cannot use a window function directly in `WHERE`).

## Running totals

With `SUM` and an `ORDER BY` inside the window, the value grows row by row:

```sql
SELECT course_id, grade,
       SUM(grade) OVER (ORDER BY course_id) AS running_total
FROM enrollments
WHERE student_id = 1;
```

For student 1 (grades 90, 85, 91) the running totals are 90, 175, 266. Another handy one is `LAG(column) OVER (ORDER BY ...)`, which looks at the previous row, useful for "difference from the last row".

## The order of things

A window function runs **after** `WHERE`, `GROUP BY` and `HAVING`, just before the final `ORDER BY`. That is why the exercise filters out the `NULL` grades with a normal `WHERE` first, and why you cannot write `WHERE place = 1`.

> **Watch out:**
> - Putting a window function in `WHERE`: `misuse of window function RANK()`. Put it in a subquery or CTE and filter outside.
> - Forgetting `OVER` after a ranking function: `RANK()` on its own gives the same `misuse of window function rank()` error.
> - Using `ORDER BY` inside `OVER` and expecting the final output to be sorted. Sorting the output still needs its own `ORDER BY` at the end.
> - `NULL` values sort first in ascending order. Rank a column that can be `NULL` and the empty ones may come first; filter them out, or sort descending.
> - `PARTITION BY` is not `GROUP BY`: the rows stay, so you may see the same number repeated on many rows.

> **Your turn:** extend the query so it also shows `place` (`RANK() OVER (PARTITION BY c.id ORDER BY e.grade DESC)`) and `course_avg` (the rounded average grade of the course on every row), and order the result by course id and place.
