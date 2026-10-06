---
title: INSERT, UPDATE and DELETE
summary: Change the data in a table, then check the result with a SELECT.
level: intermediate
runner: sql
files:
  - name: query.sql
    code: |
      -- Make these three changes to the students table, in order:
      --   1. Add a new student: id 8, Tal, age 22, living in Haifa
      --   2. Move Dana (id 6) to the city Haifa
      --   3. Remove Omer (id 4) from the table
      -- Finish with a query that shows id, name and city of all students
      -- ordered by id. (Only the result of the LAST statement is shown.)

      SELECT id, name, city
      FROM students
      ORDER BY id;
check:
  output: |
    id | name | city
    1 | Ava | Tel Aviv
    2 | Noam | Haifa
    3 | Maya | Tel Aviv
    5 | Lior | Haifa
    6 | Dana | Haifa
    7 | Yael | NULL
    8 | Tal | Haifa
  code:
    - { pattern: 'INSERT\s+INTO\s+students', message: "Add Tal with INSERT INTO students." }
    - { pattern: 'UPDATE\s+students\s+SET', message: "Change Dana's city with UPDATE students SET." }
    - { pattern: 'DELETE\s+FROM\s+students', message: "Remove Omer with DELETE FROM students." }
    - { pattern: 'WHERE', message: "UPDATE and DELETE need a WHERE, or they change every row!" }
hints:
  - "Three different statements, each ending with a semicolon, written above the final SELECT. UPDATE and DELETE must say which row they affect."
  - "INSERT INTO students VALUES (...) with the values in column order (id, name, age, city). UPDATE students SET city = ... WHERE id = 6. DELETE FROM students WHERE id = 4."
  - "INSERT INTO students VALUES (8, 'Tal', 22, 'Haifa');   UPDATE students SET city = 'Haifa' WHERE id = 6;   DELETE FROM students WHERE id = 4;"
solution:
  - name: query.sql
    code: |
      INSERT INTO students VALUES (8, 'Tal', 22, 'Haifa');
      UPDATE students SET city = 'Haifa' WHERE id = 6;
      DELETE FROM students WHERE id = 4;

      SELECT id, name, city
      FROM students
      ORDER BY id;
quiz:
  - q: Which statement adds a new row?
    options: ["ADD ROW", "INSERT INTO", "UPDATE"]
    answer: 1
  - q: What happens if you run  DELETE FROM students;  with no WHERE?
    options: ["Nothing", "It deletes only the first row", "It deletes every row in the table"]
    answer: 2
  - q: Which clause says WHAT value to change in an UPDATE?
    options: ["SET", "CHANGE", "VALUES"]
    answer: 0
  - q: Why do we finish with a SELECT in this lesson?
    options: ["Because INSERT needs it", "To see the result, since only the last statement's result table is shown", "SELECT is required after every change"]
    answer: 1
---

So far you have only **read** data. Real applications also add new records, correct mistakes and remove old ones. These three jobs are done by `INSERT`, `UPDATE` and `DELETE`. Together with `SELECT` they are known as **CRUD**: Create, Read, Update, Delete.

## INSERT: add a row

```sql
INSERT INTO students VALUES (8, 'Tal', 22, 'Haifa');
```

The values must be in the same order as the table's columns: `id`, `name`, `age`, `city`. A safer and clearer form names the columns, so you can skip some (they become `NULL`):

```sql
INSERT INTO students (id, name, age)
VALUES (9, 'Eli', 25);
```

You can insert several rows at once by separating the groups with commas, like the sample data does.

## UPDATE: change existing rows

```sql
UPDATE students
SET city = 'Haifa'
WHERE id = 6;
```

- `UPDATE students` says which table.
- `SET city = 'Haifa'` says the new value. Several columns can be set at once: `SET city = 'Haifa', age = 20`.
- `WHERE id = 6` picks the rows to change.

You can calculate from the old value too: `SET age = age + 1` makes everyone one year older (when there is no `WHERE`).

## DELETE: remove rows

```sql
DELETE FROM students
WHERE id = 4;
```

## The most important rule: always use WHERE

Without a `WHERE`, `UPDATE` and `DELETE` apply to **every row**:

```sql
DELETE FROM students;   -- empties the whole table!
```

Good habit: first write a `SELECT` with the same `WHERE` to check which rows it finds, and only then change `SELECT` into `UPDATE` or `DELETE`. Use the primary key (`id`) to target exactly one row.

## Seeing the result

`INSERT`, `UPDATE` and `DELETE` do not return a table; they only change data. In this editor the result panel shows only the **last** statement that returns rows, so end your script with a `SELECT` to see the new state. Each run starts again from the original sample data, so your experiments can never break anything.

```sql
UPDATE courses SET credits = credits + 1 WHERE language = 'SQL';
SELECT title, credits FROM courses;
```

> **Watch out:**
> - A duplicate primary key, such as inserting `id` 1 again, fails with `UNIQUE constraint failed: students.id`.
> - Wrong number of values: `table students has 4 columns but 3 values were supplied`.
> - Forgetting the quotes around text in `VALUES` gives `no such column: Tal`.
> - Forgetting a semicolon between statements gives `near "UPDATE": syntax error`.
> - `UPDATE` or `DELETE` without `WHERE` silently changes all rows.

> **Your turn:** insert Tal (id 8, age 22, Haifa), move Dana (id 6) to Haifa and delete Omer (id 4). The final `SELECT` in the editor then shows the result.
