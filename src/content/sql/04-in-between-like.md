---
title: IN, BETWEEN, LIKE and NOT
summary: Write richer filters with lists, ranges and text patterns.
level: beginner
runner: sql
files:
  - name: query.sql
    code: |
      -- Show the name and city of students who:
      --   live in Haifa, Eilat or Jerusalem (test against a list of cities),
      --   are aged 19 to 21, ends included (use a range test),
      --   have a name that does not start with the letter N (pattern test).
      -- Sort the result by name.
check:
  output: |
    name | city
    Dana | Eilat
    Omer | Jerusalem
  code:
    - { pattern: '\bIN\s*\(', message: "Use IN ( ... ) with a list of cities." }
    - { pattern: '\bBETWEEN\b', message: "Use BETWEEN for the age range." }
    - { pattern: '\bLIKE\b', message: "Use LIKE for the name pattern." }
    - { pattern: '\bNOT\b', message: "Use NOT to exclude the names starting with N." }
hints:
  - "You need three conditions joined together, each using a different helper: a list test, a range test and a pattern test, plus a way to say not."
  - "city IN ('Haifa', 'Eilat', 'Jerusalem'), then age BETWEEN 19 AND 21, then name NOT LIKE 'N%' (the percent sign stands for any number of characters). Join them with AND."
  - "SELECT name, city FROM students WHERE city IN ('Haifa', 'Eilat', 'Jerusalem') AND age BETWEEN 19 AND 21 AND name NOT LIKE 'N%' ORDER BY name;"
solution:
  - name: query.sql
    code: |
      SELECT name, city
      FROM students
      WHERE city IN ('Haifa', 'Eilat', 'Jerusalem')
        AND age BETWEEN 19 AND 21
        AND name NOT LIKE 'N%'
      ORDER BY name;
quiz:
  - q: What does  city IN ('Haifa', 'Eilat')  check?
    options: ["city is both Haifa and Eilat", "city is one of the values in the list", "city contains the letters Haifa"]
    answer: 1
  - q: Is  age BETWEEN 19 AND 21  inclusive of 19 and 21?
    options: ["No, only 20", "Only 19", "Yes, both ends are included"]
    answer: 2
  - q: Which pattern matches names that START with A?
    options: ["LIKE '%A'", "LIKE 'A%'", "LIKE '%A%'"]
    answer: 1
  - q: What does the underscore do in  LIKE '_a%' ?
    options: ["Matches exactly one character", "Matches any number of characters", "Matches a literal underscore"]
    answer: 0
---

The basic `WHERE age > 20 AND city = 'Haifa'` is enough for simple questions. SQL also offers a few shortcuts that make bigger questions shorter and easier to read.

## IN: match any value in a list

Instead of chaining several `OR`s:

```sql
SELECT name FROM students
WHERE city = 'Haifa' OR city = 'Eilat' OR city = 'Jerusalem';
```

write a list:

```sql
SELECT name FROM students
WHERE city IN ('Haifa', 'Eilat', 'Jerusalem');
```

The value matches if it equals **any** item in the list. Numbers work too: `id IN (1, 3, 5)`.

## BETWEEN: a range

```sql
SELECT name, age FROM students
WHERE age BETWEEN 19 AND 21;
```

This is the same as `age >= 19 AND age <= 21`. **Both ends are included.** The first number must be the smaller one.

## LIKE: simple text patterns

`LIKE` compares text to a pattern, using two special symbols:

| Symbol | Meaning |
| --- | --- |
| `%` | any number of characters (including none) |
| `_` | exactly one character |

| Pattern | Matches |
| --- | --- |
| `'A%'` | starts with A: Ava |
| `'%a'` | ends with a: Ava, Maya, Dana |
| `'%ao%'` | contains "ao" anywhere |
| `'_a%'` | second letter is a: Maya, Dana, Yael |

In SQLite, `LIKE` ignores upper/lower case for ordinary English letters, so `'a%'` also matches Ava.

## NOT: flip a condition

`NOT` works in front of conditions and in front of the helpers above:

```sql
WHERE city NOT IN ('Haifa', 'Eilat')
WHERE age NOT BETWEEN 19 AND 21
WHERE name NOT LIKE 'A%'
WHERE NOT (age > 20 AND city = 'Haifa')
```

## Combining everything

Each helper is an ordinary condition, so they can be joined with `AND` / `OR` just like before. Put each condition on its own line for readability:

```sql
SELECT name, city
FROM students
WHERE city IN ('Haifa', 'Tel Aviv')
  AND age BETWEEN 20 AND 25
  AND name LIKE '%a'
ORDER BY name;
```

Remember the effect of the missing value: `city NOT IN ('Haifa')` skips Yael, because comparing `NULL` with anything is never true. If you want her included, add `OR city IS NULL`.

> **Watch out:**
> - Forgetting the brackets after `IN` gives `near "'Haifa'": syntax error`.
> - Writing `BETWEEN 21 AND 19` (large first) returns nothing without any error.
> - `LIKE 'Ava'` without a `%` is just an equality check.
> - Mixing `AND` and `OR` without brackets: `a OR b AND c` means `a OR (b AND c)`.
> - `NOT IN` with a `NULL` in the list returns nothing. Keep `NULL` out of lists.

> **Your turn:** show the name and city of students who live in Haifa, Eilat or Jerusalem, are aged 19 to 21, and whose name does not start with `N`. Sort by name.
