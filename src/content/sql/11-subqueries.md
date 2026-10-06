---
title: Subqueries
summary: Use the result of one query inside another.
level: intermediate
runner: sql
files:
  - name: query.sql
    code: |
      -- Show the name and age of the students who are older than the
      -- average age of ALL students, youngest of them first.
      -- Do it in one statement: the average must be computed by a query
      -- written inside the main query, not typed in by hand.
check:
  output: |
    name | age
    Lior | 22
    Maya | 23
    Yael | 24
  code:
    - { pattern: '\(\s*SELECT\b', message: "Write a SELECT inside round brackets (a subquery)." }
    - { pattern: 'AVG\s*\(\s*age\s*\)', message: "Compute the average with AVG(age) inside the subquery." }
hints:
  - "You need two questions answered in order: first the average age, then who is above it. SQL lets you nest the first question inside the second."
  - "The main query is SELECT name, age FROM students WHERE age > ( ... ). In the brackets put a complete query that returns one number."
  - "SELECT name, age FROM students WHERE age > (SELECT AVG(age) FROM students) ORDER BY age;"
solution:
  - name: query.sql
    code: |
      SELECT name, age
      FROM students
      WHERE age > (SELECT AVG(age) FROM students)
      ORDER BY age;
quiz:
  - q: What is a subquery?
    options: ["A query nested inside another query, in round brackets", "A query with the wrong syntax", "A second database"]
    answer: 0
  - q: Which subquery returns a single value that can be compared with  >  ?
    options: ["SELECT name FROM students", "SELECT * FROM students", "SELECT AVG(age) FROM students"]
    answer: 2
  - q: What does  id IN (SELECT student_id FROM enrollments)  check?
    options: ["That the id is a number", "That the id appears in the list of student_id values", "That the tables are identical"]
    answer: 1
  - q: Which runs first?
    options: ["The inner query", "The outer query", "Neither, they run at the same time"]
    answer: 0
---

Sometimes one question depends on the answer to another: "Who is older than the average student?" To answer it you first need the average, and then you compare each student to it. You could run two queries and copy the number by hand, but then your query would break as soon as the data changes. SQL has a better way: put the first query **inside** the second. That is a **subquery**.

## A subquery that returns one value

```sql
SELECT AVG(age) FROM students;
```

returns one number (about 21.14). You can use that query wherever a single value is expected, if you wrap it in round brackets:

```sql
SELECT name, age
FROM students
WHERE age > (SELECT AVG(age) FROM students);
```

The database runs the inner query first, gets one number, and then uses it as if you had typed it there. If the data changes tomorrow, the average updates itself.

You can also use such a subquery in the `SELECT` list:

```sql
SELECT name, age,
       age - (SELECT AVG(age) FROM students) AS difference
FROM students;
```

## A subquery that returns a list

With `IN`, the inner query may return a whole column of values:

```sql
SELECT name
FROM students
WHERE id IN (SELECT student_id
             FROM enrollments
             WHERE course_id = 3);
```

The inner query gives the ids of everyone enrolled in course 3 (Python), and the outer query turns those ids into names. `NOT IN` finds the opposite: students who are **not** in that list.

This could also be written as a `JOIN`. Both are valid; subqueries are often easier to read for "is in that group" questions, joins are better when you need columns from both tables.

## A subquery as a table

A subquery in `FROM` acts like a temporary table. It must have an alias:

```sql
SELECT AVG(per_course.n) AS average_enrolments
FROM (SELECT course_id, COUNT(*) AS n
      FROM enrollments
      GROUP BY course_id) AS per_course;
```

First the inner query counts enrolments per course, then the outer one averages those counts.

## Rules of thumb

- Always wrap a subquery in round brackets.
- A subquery used with `=`, `>`, `<` must return **exactly one value** (one row, one column).
- A subquery used with `IN` must return **one column**.
- Indent subqueries so the structure is visible.

> **Watch out:**
> - Forgetting the brackets gives `near "SELECT": syntax error`.
> - Comparing with a subquery that returns several columns gives `sub-select returns 2 columns - expected 1`.
> - A subquery in `FROM` without an alias is an error in many databases. Always add `AS name`.
> - `NOT IN` with a list that contains `NULL` returns no rows at all. Filter the `NULL`s inside the subquery with `WHERE col IS NOT NULL`.

> **Your turn:** show the `name` and `age` of the students older than the average age, youngest first, using a subquery to compute the average.
