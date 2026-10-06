---
title: "Step 4: Find the overdue loans (dates)"
summary: "Use IS NULL and julianday to list unreturned loans that are late and by how many days."
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

      -- TODO (step 4): add a query for overdue loans, today being '2025-03-15'.
      -- Show member, book, due_on and days_overdue (a whole number of days late).
      -- Only loans that have not come back yet, and whose due date is before today.
      -- Use the Julian day function for the day count and a cast to drop the decimals.
      -- Most overdue first. The new query must be the last statement.
check:
  output: |
    member | book | due_on | days_overdue
    Noa Katz | Half of a Yellow Sun | 2025-02-26 | 17
    Omar Haddad | Kindred | 2025-03-06 | 9
  code:
    - { pattern: "julianday\\s*\\(", message: "Use julianday() to compute the number of days." }
    - { pattern: "IS\\s+NULL", message: "Open loans have returned_on IS NULL." }
    - { pattern: "due_on\\s*<", message: "Compare due_on with today using <." }
hints:
  - "Open loans have no return date, which is NULL. NULL is tested with IS NULL, never with = NULL. Add the date condition with AND."
  - "WHERE l.returned_on IS NULL AND l.due_on < '2025-03-15'. For the days late: CAST(julianday('2025-03-15') - julianday(l.due_on) AS INTEGER) AS days_overdue."
  - "SELECT m.name AS member, b.title AS book, l.due_on, CAST(julianday('2025-03-15') - julianday(l.due_on) AS INTEGER) AS days_overdue FROM loans AS l JOIN members AS m ON m.id = l.member_id JOIN books AS b ON b.id = l.book_id WHERE l.returned_on IS NULL AND l.due_on < '2025-03-15' ORDER BY days_overdue DESC;"
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
quiz:
  - q: "How do you test that a column has no value?"
    options: ["column = NULL", "column IS NULL", "column == ''"]
    answer: 1
    explain: "Nothing is equal to NULL, not even NULL."
  - q: "Why does '2025-02-26' < '2025-03-15' give the right answer for dates?"
    options: ["Dates in ISO format (year-month-day) sort correctly as text", "SQLite always knows a string is a date", "It does not, you must always convert first"]
    answer: 0
  - q: "What does julianday('2025-03-15') - julianday('2025-03-01') return?"
    options: ["14", "'14 days'", "2025-03-14"]
    answer: 0
    explain: "It returns the number of days between the two dates (14)."
---
The most important daily question at a library desk is "who still has my book?". This step answers it with dates, which SQLite handles surprisingly well once you know the trick.

## Where we are

Your notebook contains the book list, the science-fiction search and the loan history report. Every loan has `loaned_on` and `due_on`, and `returned_on` which is `NULL` until the book comes back.

## What we will add

An **overdue report**: loans that are not returned and whose due date has passed, with how many days late they are. The library's loan period is 14 days.

## Date handling in SQLite

Dates are stored as ISO text, `'YYYY-MM-DD'`. Because the year comes first, **text comparison equals date comparison**: `'2025-02-26' < '2025-03-15'` is true. That means `WHERE due_on < '2025-03-15'` works as you would hope.

For arithmetic, SQLite offers date functions:

```sql
SELECT date('2025-03-01', '+14 days');           -- 2025-03-15
SELECT julianday('2025-03-15') - julianday('2025-03-01');  -- 14.0, shown as 14
SELECT date('now');                              -- today (changes every day)
```

`julianday(date)` converts a date to a number of days, so subtracting two of them gives the gap in days. `date(x, '+14 days')` adds days to a date.

> In a real library you would write `date('now')` for today. In this course we **pin today to `'2025-03-15'`** so the answer never changes while you learn. Swapping it later is a one-word edit.

## NULL is "no value", not zero

`returned_on` is empty (`NULL`) for books still out. You cannot test it with `= NULL` because nothing equals NULL, not even NULL. The correct test is `IS NULL` (and `IS NOT NULL` for the opposite).

## Walk-through

1. Reuse the join from step 3, but you only need `members` and `books` here (so `loans AS l JOIN members ... JOIN books ...`).
2. Keep only open loans: `WHERE l.returned_on IS NULL`.
3. Add the date test with `AND`: `l.due_on < '2025-03-15'`. A book due *today* is not yet late, so use `<`, not `<=`.
4. Compute the lateness. The difference of two julian days is a decimal number, so cast it to a whole number:

```sql
CAST(julianday('2025-03-15') - julianday(l.due_on) AS INTEGER) AS days_overdue
```

   `CAST(x AS INTEGER)` converts the value to a whole number.
5. Select `member`, `book`, `due_on` and `days_overdue`, and sort the worst offenders first with `ORDER BY days_overdue DESC`. SQLite lets you use a select-list alias in `ORDER BY`.

## A related question

Books that came back **late** are loans where `returned_on > due_on`. Try it as an experiment: it finds two loans in this data.

> **Watch out:**
> - `WHERE returned_on = NULL` returns nothing and no error. Use `IS NULL`.
> - Dates written as `'15/03/2025'` or `'3/15/25'` do not sort correctly. Always use year-month-day with zero padding.
> - `julianday(NULL)` is `NULL`, so arithmetic on missing dates silently gives `NULL`. That is why we filter open loans first.
> - Forgetting the quotes: `due_on < 2025-03-15` compares with the number 2007 (that is 2025 minus 3 minus 15). Dates are text and need quotes.
> - Off-by-one: use `<`, not `<=`, so a loan due today is not reported.

> **Your turn:** add a query that shows `member`, `book`, `due_on` and `days_overdue` for loans that are not returned and were due before `'2025-03-15'`, most overdue first. Calculate `days_overdue` with `julianday` and `CAST`. It must be the last statement in the file.
