---
title: Tables, constraints, indexes and views
summary: Design your own table with rules the database enforces, speed it up with an index and save a query as a view.
level: advanced
runner: sql
files:
  - name: query.sql
    code: |
      -- Build a small "reviews" feature, in this order:
      --
      -- 1. Make a new table called reviews with these columns:
      --      id          whole number, the key that identifies the row
      --      student_id  whole number, must not be empty (NOT NULL)
      --      course_id   whole number, must not be empty
      --      rating      whole number, not empty, and only 1 to 5 allowed (a rule on the column)
      --      comment     text, defaults to 'no comment' when not given
      --    and no two rows may share the same pair (student_id, course_id): one review per student per course.
      --
      -- 2. The INSERT below is ready for you (it needs the table to exist).
      --
      -- 3. Make an index named idx_reviews_course on the course_id column of reviews.
      --
      -- 4. Make a view named course_ratings, saving a query that shows, per course:
      --      title (from courses), reviews (how many reviews), avg_rating (average rating, rounded to 1 decimal)
      --
      -- 5. The last SELECT shows the view. Only this last result is displayed.

      INSERT INTO reviews (student_id, course_id, rating) VALUES
        (1, 2, 5), (2, 2, 4), (5, 2, 4),
        (3, 4, 5), (4, 4, 3), (1, 5, 5), (5, 5, 3);

      SELECT * FROM course_ratings ORDER BY avg_rating DESC, title;
check:
  output: |
    title | reviews | avg_rating
    JavaScript Basics | 3 | 4.3
    React in Practice | 2 | 4
    SQL Fundamentals | 2 | 4
  code:
    - { pattern: 'CREATE\s+TABLE\s+reviews', message: "Create the table with CREATE TABLE reviews (...)." }
    - { pattern: 'PRIMARY\s+KEY', message: "Mark id as the PRIMARY KEY." }
    - { pattern: 'CHECK\s*\(', message: "Limit the rating with a CHECK (...) rule." }
    - { pattern: 'UNIQUE', message: "Add a UNIQUE rule for the pair (student_id, course_id)." }
    - { pattern: 'CREATE\s+INDEX', message: "Create an index with CREATE INDEX ... ON reviews (course_id)." }
    - { pattern: 'CREATE\s+VIEW\s+course_ratings', message: "Create the view with CREATE VIEW course_ratings AS SELECT ..." }
hints:
  - "Three kinds of CREATE statements, all written before the INSERT or the final SELECT as the order requires: the table first (the INSERT needs it), then the index, then the view. Constraints are written after the column type, such as NOT NULL or CHECK (...)."
  - "CREATE TABLE reviews (id INTEGER PRIMARY KEY, student_id INTEGER NOT NULL, course_id INTEGER NOT NULL, rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5), comment TEXT DEFAULT 'no comment', UNIQUE (student_id, course_id));   then CREATE INDEX idx_reviews_course ON reviews (course_id);"
  - "CREATE VIEW course_ratings AS SELECT c.title, COUNT(*) AS reviews, ROUND(AVG(r.rating), 1) AS avg_rating FROM reviews AS r JOIN courses AS c ON c.id = r.course_id GROUP BY c.id;"
solution:
  - name: query.sql
    code: |
      CREATE TABLE reviews (
        id INTEGER PRIMARY KEY,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT DEFAULT 'no comment',
        UNIQUE (student_id, course_id)
      );

      INSERT INTO reviews (student_id, course_id, rating) VALUES
        (1, 2, 5), (2, 2, 4), (5, 2, 4),
        (3, 4, 5), (4, 4, 3), (1, 5, 5), (5, 5, 3);

      CREATE INDEX idx_reviews_course ON reviews (course_id);

      CREATE VIEW course_ratings AS
      SELECT c.title, COUNT(*) AS reviews, ROUND(AVG(r.rating), 1) AS avg_rating
      FROM reviews AS r
      JOIN courses AS c ON c.id = r.course_id
      GROUP BY c.id;

      SELECT * FROM course_ratings ORDER BY avg_rating DESC, title;
quiz:
  - q: What does a CHECK constraint do?
    options: ["Reads the table to find mistakes later", "Sorts the rows", "Makes the database reject any row that breaks the rule, such as a rating of 9"]
    answer: 2
  - q: What is a view?
    options: ["A copy of the data stored in a second table", "A saved, named query that you can SELECT from like a table", "A picture of the table"]
    answer: 1
  - q: What is the main purpose of an index?
    options: ["To find rows faster, like the index at the back of a book, at the cost of extra space and slower writes", "To make the table read-only", "To remove duplicate rows"]
    answer: 0
  - q: What happens when you INSERT a second review with the same student_id and course_id as an existing one?
    options: ["It silently overwrites the old row", "It is rejected with UNIQUE constraint failed", "A second row is added with the same ids"]
    answer: 1
---

Until now you have **used** tables that were already there. Now you will **design** one. Creating tables is called **DDL** (Data Definition Language), and the most valuable thing you can do in it is add **rules** so that bad data can never enter the database in the first place.

## CREATE TABLE and column types

```sql
CREATE TABLE pets (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER DEFAULT 0
);
```

Each column has a name and a type. SQLite's main types are `INTEGER` (whole numbers), `REAL` (decimals), `TEXT` and `BLOB` (raw bytes). The words after the type are **constraints**, rules that the database checks for every row you add or change.

| Constraint | Meaning |
| --- | --- |
| `PRIMARY KEY` | identifies each row, must be unique. An `INTEGER PRIMARY KEY` fills itself in with 1, 2, 3, ... if you leave it out |
| `NOT NULL` | the column must have a value |
| `UNIQUE` | no two rows may have the same value (`UNIQUE (a, b)` means the pair must be unique) |
| `DEFAULT x` | the value used when the INSERT does not mention the column |
| `CHECK (condition)` | the condition must be true for every row, e.g. `CHECK (rating BETWEEN 1 AND 5)` |
| `REFERENCES other(id)` | a foreign key: the value must exist in another table (SQLite enforces it only after `PRAGMA foreign_keys = ON`) |

If a rule is broken, the statement fails and nothing is saved: `CHECK constraint failed: rating BETWEEN 1 AND 5` or `UNIQUE constraint failed: reviews.student_id, reviews.course_id`. That is good news: your data stays clean no matter which program writes to it.

## Indexes

An **index** is a sorted shortcut for one or more columns. Without it, a query like `WHERE course_id = 2` must read **every row**. With an index on `course_id` the database jumps straight to the matching rows, like looking up a word in the back of a book.

```sql
CREATE INDEX idx_reviews_course ON reviews (course_id);
```

Indexes change **speed**, never the result. The price: they use space and make `INSERT`/`UPDATE` slightly slower, because the index must be kept up to date. Index columns that you often filter, join or sort by, not every column. (Primary keys and `UNIQUE` columns get an index automatically.) The tiny sample data here is too small to feel any difference, but real tables with millions of rows depend on them.

## Views

A **view** is a saved query with a name. Selecting from it runs the query behind it:

```sql
CREATE VIEW course_ratings AS
SELECT c.title, COUNT(*) AS reviews, ROUND(AVG(r.rating), 1) AS avg_rating
FROM reviews AS r
JOIN courses AS c ON c.id = r.course_id
GROUP BY c.id;

SELECT * FROM course_ratings;
```

A view stores no data of its own, so it is always up to date, and it hides a complicated join behind a simple name. Remove things with `DROP VIEW name`, `DROP INDEX name` and `DROP TABLE name`. (Add `IF EXISTS` to avoid an error when it is missing.)

## Order matters, and only the last result is shown

Run the statements top to bottom: the table must exist before you insert, and the view before you select from it. As in the earlier lessons the result panel shows the **last** result, so finish with a `SELECT`. Each run starts from a fresh copy of the sample data, so your new tables disappear afterwards and you can experiment freely.

> **Watch out:**
> - `table reviews already exists`: you ran `CREATE TABLE` twice. Use `CREATE TABLE IF NOT EXISTS` in scripts you run repeatedly.
> - `no such table: reviews`: the `INSERT` or view comes before the `CREATE TABLE`.
> - A comma after the last column definition: `near ")": syntax error`.
> - `NOT NULL constraint failed: reviews.rating`: you inserted a row without a value for a required column that has no default.
> - Indexing everything. Each extra index slows down writes.

> **Your turn:** create the `reviews` table with the constraints from the comments, create the index `idx_reviews_course`, and create the view `course_ratings`. The final `SELECT` should then list each reviewed course with its number of reviews and average rating.
