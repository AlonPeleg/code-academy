---
title: LEFT JOIN - keeping unmatched rows
summary: Keep every row from the left table, even when nothing matches.
level: intermediate
runner: sql
files:
  - name: query.sql
    code: |
      -- For every student show the name and how many top grades (90 or higher)
      -- they have. Call the count top_grades.
      -- Students with NO top grade must still appear, with 0.
      -- Sort by top_grades, highest first, then by name.
      -- (Joining every student to their top-grade enrollments is the key step.)
check:
  output: |
    name | top_grades
    Ava | 2
    Maya | 2
    Dana | 0
    Lior | 0
    Noam | 0
    Omer | 0
    Yael | 0
  code:
    - { pattern: '\bLEFT\s+(OUTER\s+)?JOIN\b', message: "Use LEFT JOIN so students without a top grade stay in the result." }
    - { pattern: '\bGROUP\s+BY\b', message: "Group by student." }
    - { pattern: 'COUNT\s*\(\s*e\.', message: "Count a column from the enrollments side, like COUNT(e.grade), so unmatched students count 0." }
hints:
  - "A normal JOIN would drop students that have no matching enrollment. The other join keeps all rows of the table written first (the left one)."
  - "Start with FROM students s LEFT JOIN enrollments e. Put the grade test inside the ON condition, not in WHERE: ON e.student_id = s.id AND e.grade >= 90. Then GROUP BY s.id and COUNT(e.grade)."
  - "SELECT s.name, COUNT(e.grade) AS top_grades FROM students s LEFT JOIN enrollments e ON e.student_id = s.id AND e.grade >= 90 GROUP BY s.id ORDER BY top_grades DESC, s.name;"
solution:
  - name: query.sql
    code: |
      SELECT s.name, COUNT(e.grade) AS top_grades
      FROM students s
      LEFT JOIN enrollments e
        ON e.student_id = s.id AND e.grade >= 90
      GROUP BY s.id
      ORDER BY top_grades DESC, s.name;
quiz:
  - q: What does LEFT JOIN keep that a plain JOIN drops?
    options: ["Duplicate rows", "Rows from the right table only", "Rows of the left table that have no match"]
    answer: 2
  - q: What do the columns of the right table contain for an unmatched left row?
    options: ["NULL", "0", "An empty string"]
    answer: 0
  - q: Why use COUNT(e.grade) instead of COUNT(*) here?
    options: ["COUNT(*) is not allowed with joins", "COUNT(e.grade) ignores the NULLs of unmatched rows, so they count 0", "It is faster"]
    answer: 1
  - q: What happens if you move  e.grade >= 90  from ON into WHERE?
    options: ["Nothing changes", "Unmatched students are removed again, so it acts like an inner join", "SQL reports an error"]
    answer: 1
---

A plain `JOIN` only keeps rows that have a partner in the other table. That is exactly what you want when you ask "which course did each student take?". But sometimes you want the opposite: "list **all** students, and show their enrolments *if they have any*". For that you need `LEFT JOIN`.

## Left and right

In `FROM a LEFT JOIN b`, the table written first (`a`) is the **left** table. A left join:

1. Keeps **every** row of the left table.
2. Attaches the matching rows of the right table.
3. If a left row has no match, still outputs it, and fills the right table's columns with `NULL`.

```sql
SELECT s.name, e.course_id, e.grade
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id;
```

If a student had no enrollments at all, they would appear once with `NULL` in `course_id` and `grade`. With a plain `JOIN` they would vanish from the result.

## The "who has nothing?" trick

Because unmatched rows contain `NULL`, you can find them with `IS NULL`. For example "students with no enrollments" is:

```sql
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
WHERE e.student_id IS NULL;
```

In our sample data everybody is enrolled somewhere, so this returns no rows, but on a real database it is a very common question ("customers who never ordered", "products never sold").

## Putting the condition in ON

Sometimes the matching rule itself includes an extra test. Compare:

```sql
-- keeps all students; those without a top grade show NULL
LEFT JOIN enrollments e ON e.student_id = s.id AND e.grade >= 90

-- removes students without a top grade again
LEFT JOIN enrollments e ON e.student_id = s.id
WHERE e.grade >= 90
```

In the second form, `WHERE` removes every row where `e.grade` is `NULL`, which brings back the effect of an inner join. **Conditions about the right table that should not delete left rows belong in `ON`.**

## Counting with a left join

To count matches per left row, group and count a column of the **right** table:

```sql
SELECT s.name, COUNT(e.grade) AS top_grades
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id AND e.grade >= 90
GROUP BY s.id;
```

`COUNT(e.grade)` skips `NULL`, so a student with no match gets `0`. `COUNT(*)` would count the single placeholder row and wrongly give `1`.

> **Watch out:**
> - Swapping the table order changes the result: `courses LEFT JOIN students` keeps all courses instead.
> - Filtering the right table in `WHERE` silently turns the join into an inner join.
> - `COUNT(*)` after a `LEFT JOIN` counts unmatched rows as 1. Count a right-table column instead.
> - Forgetting `ON` gives a syntax error `near ";"` or a huge unwanted result.

> **Your turn:** list every student with the number of grades of 90 or more they have (`top_grades`), including students with zero, sorted by `top_grades` highest first and then by name.
