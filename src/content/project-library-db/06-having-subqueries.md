---
title: "Step 6: Frequent readers and dead stock (HAVING, subqueries)"
summary: "Filter groups with HAVING, use a subquery, and find missing matches with LEFT JOIN ... IS NULL."
level: intermediate
runner: sql
seed: |
  -- The library database. Tables: authors, books, members, loans.
  -- Dates are ISO text (YYYY-MM-DD). returned_on is NULL while a book is still out.
  PRAGMA foreign_keys = ON;

  CREATE TABLE authors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT
  );

  CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES authors(id),
    genre TEXT,
    year INTEGER CHECK (year > 1400),
    pages INTEGER CHECK (pages > 0)
  );

  CREATE TABLE members (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    joined TEXT NOT NULL
  );

  CREATE TABLE loans (
    id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id),
    member_id INTEGER NOT NULL REFERENCES members(id),
    loaned_on TEXT NOT NULL,
    due_on TEXT NOT NULL,
    returned_on TEXT
  );

  INSERT INTO authors (id, name, country) VALUES
    (1, 'Ursula K. Le Guin', 'USA'),
    (2, 'Haruki Murakami', 'Japan'),
    (3, 'Chimamanda Ngozi Adichie', 'Nigeria'),
    (4, 'George Orwell', 'UK'),
    (5, 'Octavia E. Butler', 'USA');

  INSERT INTO books (id, title, author_id, genre, year, pages) VALUES
    (1, 'The Left Hand of Darkness', 1, 'Science Fiction', 1969, 304),
    (2, 'A Wizard of Earthsea', 1, 'Fantasy', 1968, 183),
    (3, 'Norwegian Wood', 2, 'Fiction', 1987, 296),
    (4, 'Kafka on the Shore', 2, 'Fantasy', 2002, 505),
    (5, 'Half of a Yellow Sun', 3, 'Historical', 2006, 433),
    (6, 'Americanah', 3, 'Fiction', 2013, 477),
    (7, '1984', 4, 'Dystopia', 1949, 328),
    (8, 'Animal Farm', 4, 'Satire', 1945, 112),
    (9, 'Kindred', 5, 'Science Fiction', 1979, 264);

  INSERT INTO books (title, author_id, genre, year, pages)
  VALUES ('Parable of the Sower', 5, 'Science Fiction', 1993, 345);

  INSERT INTO members (id, name, email, joined) VALUES
    (1, 'Dana Levi', 'dana@example.com', '2024-01-10'),
    (2, 'Eitan Cohen', 'eitan@example.com', '2024-02-03'),
    (3, 'Noa Katz', 'noa@example.com', '2024-03-18'),
    (4, 'Omar Haddad', 'omar@example.com', '2024-05-22'),
    (5, 'Lina Mizrahi', 'lina@example.com', '2024-09-01'),
    (6, 'Yossi Peretz', 'yossi@example.com', '2025-01-05');

  INSERT INTO loans (id, book_id, member_id, loaned_on, due_on, returned_on) VALUES
    (1, 1, 1, '2025-01-05', '2025-01-19', '2025-01-17'),
    (2, 7, 1, '2025-01-20', '2025-02-03', '2025-02-01'),
    (3, 3, 2, '2025-02-01', '2025-02-15', '2025-02-20'),
    (4, 7, 2, '2025-02-10', '2025-02-24', '2025-02-22'),
    (5, 5, 3, '2025-02-12', '2025-02-26', NULL),
    (6, 1, 3, '2025-03-01', '2025-03-15', NULL),
    (7, 9, 4, '2025-02-20', '2025-03-06', NULL),
    (8, 7, 4, '2025-03-03', '2025-03-17', NULL),
    (9, 2, 5, '2025-03-05', '2025-03-19', NULL),
    (10, 4, 1, '2025-03-08', '2025-03-22', NULL),
    (11, 1, 2, '2025-03-10', '2025-03-24', NULL),
    (12, 6, 5, '2025-01-15', '2025-01-29', '2025-01-30');
files:
  - name: query.sql
    code: |
      -- Step 1 recap: every book
      SELECT id, title, year FROM books ORDER BY id;

      -- Step 2: science fiction and fantasy with at least 250 pages, newest first
      SELECT title, genre, year
      FROM books
      WHERE genre IN ('Science Fiction', 'Fantasy')
        AND pages >= 250
      ORDER BY year DESC;

      -- Step 3: who borrowed what
      SELECT m.name AS member, b.title AS book, a.name AS author, l.loaned_on
      FROM loans AS l
      JOIN members AS m ON m.id = l.member_id
      JOIN books AS b ON b.id = l.book_id
      JOIN authors AS a ON a.id = b.author_id
      ORDER BY l.loaned_on, l.id;

      -- Step 4: overdue loans (today is pinned to 2025-03-15)
      SELECT m.name AS member, b.title AS book, l.due_on,
             CAST(julianday('2025-03-15') - julianday(l.due_on) AS INTEGER) AS days_overdue
      FROM loans AS l
      JOIN members AS m ON m.id = l.member_id
      JOIN books AS b ON b.id = l.book_id
      WHERE l.returned_on IS NULL
        AND l.due_on < '2025-03-15'
      ORDER BY days_overdue DESC;

      -- Step 5: popularity ranking
      SELECT b.title, a.name AS author,
             COUNT(*) AS times_borrowed,
             MAX(l.loaned_on) AS last_loaned
      FROM loans AS l
      JOIN books AS b ON b.id = l.book_id
      JOIN authors AS a ON a.id = b.author_id
      GROUP BY b.id, b.title, a.name
      ORDER BY times_borrowed DESC, b.title;

      -- TODO (step 6), three queries in this order:
      -- (a) members with more than 2 loans: columns name and loans. Group the joined loans
      --     by member, then filter the groups with a condition on the count.
      -- (b) members who never borrowed: only the name column. Use a subquery in parentheses
      --     that lists the member_id values found in loans, and keep members not among them.
      -- (c) books nobody borrowed: title, author, year, ordered by title.
      --     Start from books, join authors, then add loans with a join that keeps unmatched
      --     books, and keep only the rows where the loan side is empty (test l.id).
      --     Query (c) must be the last statement.
check:
  output: |
    title | author | year
    Animal Farm | George Orwell | 1945
    Parable of the Sower | Octavia E. Butler | 1993
  code:
    - { pattern: "HAVING\\s+COUNT\\s*\\(", message: "Filter the groups with HAVING COUNT(*) > 2." }
    - { pattern: "NOT\\s+IN\\s*\\(\\s*SELECT", message: "Use a subquery: id NOT IN (SELECT ...)." }
    - { pattern: "LEFT\\s+JOIN\\s+loans", message: "Use LEFT JOIN loans for the dead stock query." }
    - { pattern: "l\\.id\\s+IS\\s+NULL", message: "Keep the rows without a match with l.id IS NULL." }
hints:
  - "Three ideas: HAVING filters groups after GROUP BY; a subquery is a SELECT in parentheses used as a list; LEFT JOIN keeps left rows without a match, whose right columns are NULL."
  - "(a) ... GROUP BY m.id, m.name HAVING COUNT(*) > 2. (b) WHERE id NOT IN (SELECT member_id FROM loans). (c) FROM books AS b JOIN authors AS a ON a.id = b.author_id LEFT JOIN loans AS l ON l.book_id = b.id WHERE l.id IS NULL."
  - "(c) SELECT b.title, a.name AS author, b.year FROM books AS b JOIN authors AS a ON a.id = b.author_id LEFT JOIN loans AS l ON l.book_id = b.id WHERE l.id IS NULL ORDER BY b.title;"
solution:
  - name: query.sql
    code: |
      -- Step 1 recap: every book
      SELECT id, title, year FROM books ORDER BY id;

      -- Step 2: science fiction and fantasy with at least 250 pages, newest first
      SELECT title, genre, year
      FROM books
      WHERE genre IN ('Science Fiction', 'Fantasy')
        AND pages >= 250
      ORDER BY year DESC;

      -- Step 3: who borrowed what
      SELECT m.name AS member, b.title AS book, a.name AS author, l.loaned_on
      FROM loans AS l
      JOIN members AS m ON m.id = l.member_id
      JOIN books AS b ON b.id = l.book_id
      JOIN authors AS a ON a.id = b.author_id
      ORDER BY l.loaned_on, l.id;

      -- Step 4: overdue loans (today is pinned to 2025-03-15)
      SELECT m.name AS member, b.title AS book, l.due_on,
             CAST(julianday('2025-03-15') - julianday(l.due_on) AS INTEGER) AS days_overdue
      FROM loans AS l
      JOIN members AS m ON m.id = l.member_id
      JOIN books AS b ON b.id = l.book_id
      WHERE l.returned_on IS NULL
        AND l.due_on < '2025-03-15'
      ORDER BY days_overdue DESC;

      -- Step 5: popularity ranking
      SELECT b.title, a.name AS author,
             COUNT(*) AS times_borrowed,
             MAX(l.loaned_on) AS last_loaned
      FROM loans AS l
      JOIN books AS b ON b.id = l.book_id
      JOIN authors AS a ON a.id = b.author_id
      GROUP BY b.id, b.title, a.name
      ORDER BY times_borrowed DESC, b.title;

      -- Step 6a: frequent borrowers (more than 2 loans)
      SELECT m.name, COUNT(*) AS loans
      FROM members AS m
      JOIN loans AS l ON l.member_id = m.id
      GROUP BY m.id, m.name
      HAVING COUNT(*) > 2;

      -- Step 6b: members who never borrowed anything
      SELECT name
      FROM members
      WHERE id NOT IN (SELECT member_id FROM loans);

      -- Step 6c: books nobody has ever borrowed
      SELECT b.title, a.name AS author, b.year
      FROM books AS b
      JOIN authors AS a ON a.id = b.author_id
      LEFT JOIN loans AS l ON l.book_id = b.id
      WHERE l.id IS NULL
      ORDER BY b.title;
quiz:
  - q: "Why can't you write WHERE COUNT(*) > 2?"
    options: ["COUNT cannot be used with numbers", "WHERE runs before grouping, so the group counts do not exist yet", "It is allowed, just slower"]
    answer: 1
    explain: "Conditions on groups go in HAVING."
  - q: "In a LEFT JOIN, what do the right-table columns contain when there is no match?"
    options: ["0", "An empty string", "NULL"]
    answer: 2
  - q: "What does WHERE id NOT IN (SELECT member_id FROM loans) return?"
    options: ["Members that have no loan", "Loans that have no member", "All members that have loans"]
    answer: 0
---
So far you counted things that exist. Some of the best questions are about things that **do not** exist: books nobody has borrowed, members who never visit. This step adds three tools: `HAVING`, subqueries and the `LEFT JOIN ... IS NULL` pattern.

## Where we are

Your notebook ends with the popularity ranking. It only shows books that have at least one loan, because an inner join drops rows without a match.

## What we will add

Three small reports for the library board:

1. **Frequent borrowers**: members with more than 2 loans.
2. **Silent members**: members who have never borrowed anything.
3. **Dead stock**: books that have never been borrowed (this one is the result the checker looks at).

## 1. HAVING: filtering groups

`WHERE` filters rows *before* grouping. A condition about a group's total, such as "more than 2 loans", cannot exist before the groups do, so it goes in `HAVING`, after `GROUP BY`:

```sql
SELECT m.name, COUNT(*) AS loans
FROM members AS m
JOIN loans AS l ON l.member_id = m.id
GROUP BY m.id, m.name
HAVING COUNT(*) > 2;
```

The order of the clauses is fixed: `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`.

## 2. Subqueries: a query inside a query

A **subquery** is a `SELECT` in parentheses used as a value or a list. The inner query runs first:

```sql
SELECT name FROM members
WHERE id NOT IN (SELECT member_id FROM loans);
```

Read it aloud: "members whose id is not among the member ids that appear in loans". The inner query produces the list of borrowers; the outer one keeps everybody else. This works because `loans.member_id` can never be `NULL` (we declared it `NOT NULL`). If the list contained a `NULL`, `NOT IN` would return nothing at all, which is a famous trap.

## 3. LEFT JOIN and IS NULL: the "anti-join"

A `LEFT JOIN` keeps **every row from the left table**, even when the right table has no match; the right-hand columns are then `NULL`. Filtering for those `NULL`s finds exactly the rows without a match:

```sql
FROM books AS b
LEFT JOIN loans AS l ON l.book_id = b.id
WHERE l.id IS NULL
```

Walk-through for the dead stock report:

1. Start from `books AS b` (the side we want to keep in full).
2. `JOIN authors AS a ON a.id = b.author_id` to show the writer. This is an ordinary join because every book has an author.
3. `LEFT JOIN loans AS l ON l.book_id = b.id`.
4. `WHERE l.id IS NULL`: keep only books where no loan row was found. Test a column that can never be `NULL` in a real loan, such as the loan's `id`.
5. Select `b.title`, `a.name AS author` and `b.year`, ordered by title.

`NOT IN (subquery)` and `LEFT JOIN ... IS NULL` give the same answer. Joins are usually the faster habit on big tables and they cope with `NULL`s better.

> **Watch out:**
> - `HAVING` before `GROUP BY` gives `near "GROUP": syntax error`.
> - A condition on `COUNT(*)` in `WHERE` gives `misuse of aggregate function COUNT()`.
> - Putting the filter on the right table in the `WHERE` clause (for example `WHERE l.loaned_on > '2025-01-01'`) turns a `LEFT JOIN` back into an inner join, because `NULL > ...` is never true. Put such conditions in the `ON` part.
> - Testing `l.book_id IS NULL` works, but only because you joined on it. Using the id is clearer.
> - A subquery returning several columns inside `IN (...)` fails with `sub-select returns 2 columns - expected 1`.

> **Your turn:** keep the previous queries, then add three queries in this order: (1) members with more than 2 loans using `HAVING COUNT(*) > 2`; (2) members who never borrowed, using `NOT IN (SELECT ...)`; (3) the books that were never borrowed, showing `title`, `author` and `year` ordered by title, using `LEFT JOIN` and `IS NULL`. Query (3) must be the last statement.
