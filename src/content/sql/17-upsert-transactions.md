---
title: UPSERT, transactions and smarter aggregates
summary: Insert-or-update in one statement, group several changes into an all-or-nothing transaction, and aggregate with conditions.
level: advanced
runner: sql
files:
  - name: query.sql
    code: |
      -- Do these steps in order, then finish with the SELECT at the bottom.
      --
      -- 1. UPSERT Yael: INSERT the row (7, 'Yael', 24, 'Haifa') into students with the columns
      --    named (id, name, age, city). Yael already exists (id 7), so when the id collides the
      --    statement must instead update the city to the new value (the lesson shows the special
      --    name for the row you tried to insert).
      --
      -- 2. UPSERT Tal in the same way: (8, 'Tal', 22, 'Haifa'). He is new, so this one inserts.
      --
      -- 3. A transaction that is cancelled: start a transaction, DELETE every row of
      --    enrollments, and then undo it all (keywords: see the lesson).

      SELECT id, name, city, (SELECT COUNT(*) FROM enrollments) AS enrollments_left
      FROM students
      WHERE id >= 7
      ORDER BY id;
check:
  output: |
    id | name | city | enrollments_left
    7 | Yael | Haifa | 13
    8 | Tal | Haifa | 13
  code:
    - { pattern: 'ON\s+CONFLICT\s*\(\s*id\s*\)\s*DO\s+UPDATE', message: "Use  ON CONFLICT(id) DO UPDATE SET ... " }
    - { pattern: 'excluded\.city', message: "Inside DO UPDATE the new row is called excluded:  SET city = excluded.city" }
    - { pattern: '\bBEGIN\b', message: "Start the transaction with BEGIN;" }
    - { pattern: 'ROLLBACK', message: "Cancel it with ROLLBACK;" }
hints:
  - "UPSERT means INSERT with a fallback: if the primary key already exists, run an UPDATE instead of failing. A transaction is wrapped between BEGIN and either COMMIT (keep) or ROLLBACK (undo everything)."
  - "INSERT INTO students (id, name, age, city) VALUES (7, 'Yael', 24, 'Haifa') ON CONFLICT(id) DO UPDATE SET city = excluded.city;   Do the same for Tal. Then BEGIN; DELETE FROM enrollments; ROLLBACK;"
  - "INSERT INTO students (id, name, age, city) VALUES (7, 'Yael', 24, 'Haifa') ON CONFLICT(id) DO UPDATE SET city = excluded.city;   INSERT INTO students (id, name, age, city) VALUES (8, 'Tal', 22, 'Haifa') ON CONFLICT(id) DO UPDATE SET city = excluded.city;   BEGIN;   DELETE FROM enrollments;   ROLLBACK;"
solution:
  - name: query.sql
    code: |
      INSERT INTO students (id, name, age, city) VALUES (7, 'Yael', 24, 'Haifa')
        ON CONFLICT(id) DO UPDATE SET city = excluded.city;

      INSERT INTO students (id, name, age, city) VALUES (8, 'Tal', 22, 'Haifa')
        ON CONFLICT(id) DO UPDATE SET city = excluded.city;

      BEGIN;
      DELETE FROM enrollments;
      ROLLBACK;

      SELECT id, name, city, (SELECT COUNT(*) FROM enrollments) AS enrollments_left
      FROM students
      WHERE id >= 7
      ORDER BY id;
quiz:
  - q: What does an UPSERT do?
    options: ["Inserts a row, or updates the existing one if the key is already there", "Deletes a row and re-adds it", "Updates every row in the table"]
    answer: 0
  - q: What does ROLLBACK do?
    options: ["Saves all changes since BEGIN", "Restarts the database", "Undoes all changes since BEGIN"]
    answer: 2
  - q: Why are transactions useful when moving money from account A to account B (two UPDATEs)?
    options: ["They make the updates faster", "Either both updates happen or neither does, so money is never lost halfway", "They lock the table forever"]
    answer: 1
    explain: "This all-or-nothing property is called atomicity, the A in ACID."
  - q: What does SUM(CASE WHEN grade >= 85 THEN 1 ELSE 0 END) calculate?
    options: ["The sum of all grades", "The highest grade", "How many rows have a grade of 85 or more"]
    answer: 2
---

Real applications do more than read data. They must change it safely, even when two things happen at once or a step fails halfway. This lesson adds three tools: **UPSERT**, **transactions** and **conditional aggregation**.

## UPSERT: insert, or update if it exists

Suppose you receive a list of students and want to save each: add the new ones, update the ones you already know. A plain `INSERT` of an existing id fails with `UNIQUE constraint failed: students.id`. An **UPSERT** (update + insert) handles both:

```sql
INSERT INTO students (id, name, age, city)
VALUES (7, 'Yael', 24, 'Haifa')
ON CONFLICT(id) DO UPDATE SET city = excluded.city;
```

1. SQL tries the `INSERT`.
2. If a **conflict** happens on the column in brackets (`id`, which has a primary key or `UNIQUE` rule), it does **not** fail. It runs the `DO UPDATE` part on the existing row.
3. `excluded` is a special name for "the row you tried to insert", so `excluded.city` is `'Haifa'`.

Use `ON CONFLICT(id) DO NOTHING` when you simply want to skip rows that already exist.

## Transactions: all or nothing

Some jobs need several statements that must succeed **together**. A bank transfer subtracts from one account and adds to another. If the program crashes between the two, money vanishes. A **transaction** groups statements into one unit:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 1;
UPDATE accounts SET balance = balance + 50 WHERE id = 2;
COMMIT;
```

- `BEGIN` opens the transaction. The changes are provisional.
- `COMMIT` makes them permanent, all at once.
- `ROLLBACK` throws all of them away, as if they never happened.

This property is called **atomicity**. It is the A in **ACID**, the four promises of a reliable database (Atomicity, Consistency, Isolation, Durability). Transactions also keep other users from seeing half-finished work.

In the exercise you `BEGIN`, delete every enrollment, and then `ROLLBACK`. The table is untouched: the final query still counts 13 enrollments. Try replacing `ROLLBACK` with `COMMIT` and see them vanish (this is exactly why you should be careful with `DELETE`).

## Smarter aggregates

Two tools help when `COUNT` and `AVG` are not enough.

**GROUP_CONCAT** glues the values of a group into one text:

```sql
SELECT course_id, GROUP_CONCAT(student_id, ', ') AS student_ids
FROM enrollments
GROUP BY course_id;
```

**Conditional aggregation** puts a `CASE` inside an aggregate to count or add only some rows, giving several numbers in one pass:

```sql
SELECT c.title,
       COUNT(*) AS enrolled,
       SUM(CASE WHEN e.grade >= 85 THEN 1 ELSE 0 END) AS high_grades
FROM courses AS c
JOIN enrollments AS e ON e.course_id = c.id
GROUP BY c.id;
```

For each row the `CASE` gives 1 when the grade is high and 0 otherwise, and `SUM` adds those up. It replaces several separate queries and is a favourite for reports.

> **Watch out:**
> - `ON CONFLICT clause does not match any PRIMARY KEY or UNIQUE constraint`: the column in `ON CONFLICT(...)` must have a primary key or unique rule.
> - Forgetting `COMMIT` or `ROLLBACK`: the transaction stays open. In this editor each run starts fresh, but in real programs an open transaction can block other users.
> - `cannot start a transaction within a transaction`: you ran `BEGIN` twice.
> - `GROUP_CONCAT` does not guarantee the order of the joined values. Do not rely on it.
> - A semicolon is needed between all statements: `near "ON": syntax error` often means the INSERT before it was not finished correctly.

> **Your turn:** upsert Yael (id 7, now in Haifa) and Tal (id 8) with `ON CONFLICT(id) DO UPDATE SET city = excluded.city`, then run a transaction that deletes all enrollments and ends with `ROLLBACK`. The final `SELECT` should show both students in Haifa and 13 enrollments left.
