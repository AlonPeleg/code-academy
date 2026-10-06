---
title: "Step 8: Return a book, add indexes, build the dashboard"
summary: "Change data with UPDATE, speed up joins with indexes and summarise everything in one dashboard row."
level: advanced
export:
  kind: sql
  name: library-database
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

      -- Step 7: views for the librarian's daily reports
      CREATE VIEW loan_details AS
      SELECT l.id AS loan_id, m.name AS member, b.title AS book, a.name AS author,
             l.loaned_on, l.due_on, l.returned_on
      FROM loans AS l
      JOIN members AS m ON m.id = l.member_id
      JOIN books AS b ON b.id = l.book_id
      JOIN authors AS a ON a.id = b.author_id;

      CREATE VIEW open_loans AS
      SELECT * FROM loan_details
      WHERE returned_on IS NULL;

      CREATE VIEW overdue_loans AS
      SELECT loan_id, member, book, due_on,
             CAST(julianday('2025-03-15') - julianday(due_on) AS INTEGER) AS days_overdue
      FROM open_loans
      WHERE due_on < '2025-03-15';

      SELECT member, book, days_overdue
      FROM overdue_loans
      ORDER BY days_overdue DESC, member;

      -- TODO (step 8):
      --  1. Record that loan 5 was returned on '2025-03-15' (change one row, and use a condition on the id).
      --  2. Create an index on loans(member_id) named idx_loans_member
      --     and one on loans(book_id) named idx_loans_book.
      --  3. Last statement: a dashboard with ONE row and these columns, each a number in parentheses
      --     (a subquery that counts):
      --       total_loans     all loans
      --       out_now         rows in the open_loans view
      --       overdue         rows in the overdue_loans view
      --       never_borrowed  books whose id is not in the loans table
      --       members         all members
check:
  output: |
    total_loans | out_now | overdue | never_borrowed | members
    12 | 6 | 1 | 2 | 6
  code:
    - { pattern: "UPDATE\\s+loans\\s+SET\\s+returned_on", message: "Use UPDATE loans SET returned_on = ... WHERE id = 5." }
    - { pattern: "WHERE\\s+id\\s*=\\s*5", message: "Limit the UPDATE with WHERE id = 5." }
    - { pattern: "CREATE\\s+INDEX[\\s\\S]*CREATE\\s+INDEX", message: "Create two indexes with CREATE INDEX." }
hints:
  - "UPDATE table SET column = value WHERE condition changes rows; without WHERE it changes all of them. CREATE INDEX name ON table (column) makes lookups on that column fast."
  - "UPDATE loans SET returned_on = '2025-03-15' WHERE id = 5; CREATE INDEX idx_loans_member ON loans (member_id); CREATE INDEX idx_loans_book ON loans (book_id). The dashboard is a SELECT with several (SELECT COUNT(*) FROM ...) AS name columns."
  - "SELECT (SELECT COUNT(*) FROM loans) AS total_loans, (SELECT COUNT(*) FROM open_loans) AS out_now, (SELECT COUNT(*) FROM overdue_loans) AS overdue, (SELECT COUNT(*) FROM books WHERE id NOT IN (SELECT book_id FROM loans)) AS never_borrowed, (SELECT COUNT(*) FROM members) AS members;"
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

      -- Step 7: views for the librarian's daily reports
      CREATE VIEW loan_details AS
      SELECT l.id AS loan_id, m.name AS member, b.title AS book, a.name AS author,
             l.loaned_on, l.due_on, l.returned_on
      FROM loans AS l
      JOIN members AS m ON m.id = l.member_id
      JOIN books AS b ON b.id = l.book_id
      JOIN authors AS a ON a.id = b.author_id;

      CREATE VIEW open_loans AS
      SELECT * FROM loan_details
      WHERE returned_on IS NULL;

      CREATE VIEW overdue_loans AS
      SELECT loan_id, member, book, due_on,
             CAST(julianday('2025-03-15') - julianday(due_on) AS INTEGER) AS days_overdue
      FROM open_loans
      WHERE due_on < '2025-03-15';

      SELECT member, book, days_overdue
      FROM overdue_loans
      ORDER BY days_overdue DESC, member;

      -- Step 8a: Noa returns loan 5 today
      UPDATE loans
      SET returned_on = '2025-03-15'
      WHERE id = 5;

      -- Step 8b: indexes on the columns we join on
      CREATE INDEX idx_loans_member ON loans (member_id);
      CREATE INDEX idx_loans_book ON loans (book_id);

      -- Step 8c: the librarian's dashboard
      SELECT
        (SELECT COUNT(*) FROM loans) AS total_loans,
        (SELECT COUNT(*) FROM open_loans) AS out_now,
        (SELECT COUNT(*) FROM overdue_loans) AS overdue,
        (SELECT COUNT(*) FROM books WHERE id NOT IN (SELECT book_id FROM loans)) AS never_borrowed,
        (SELECT COUNT(*) FROM members) AS members;
quiz:
  - q: "What happens if you run UPDATE loans SET returned_on = '2025-03-15'; without a WHERE?"
    options: ["SQLite asks for confirmation", "Every row in loans is changed", "Nothing, WHERE is required"]
    answer: 1
    explain: "Always write and test the WHERE first."
  - q: "What is the main benefit of an index?"
    options: ["It makes finding rows by that column much faster", "It removes duplicate rows", "It stores a backup of the table"]
    answer: 0
  - q: "Why does the out_now number go down after the UPDATE without changing the view?"
    options: ["Views are refreshed once per day", "The view is deleted and recreated", "A view runs its query against the current table data every time"]
    answer: 2
---
A database is not a museum: data changes every day. In the last step you will record a returned book with `UPDATE`, speed up lookups with an index and build a one-row dashboard for the librarian.

## Where we are

Your notebook has the tables' reports and three views. The librarian knows who has overdue books. Now Noa Katz walks in and returns the overdue copy of *Half of a Yellow Sun* (loan number 5). The library has to record that.

## What we will add

* **UPDATE**: mark loan 5 as returned today.
* **Indexes**: make the joins on `loans` fast.
* **A dashboard query**: one row of key numbers that reads from the views, so the UPDATE automatically changes them.

## Updating data

```sql
UPDATE loans
SET returned_on = '2025-03-15'
WHERE id = 5;
```

`UPDATE table SET column = value WHERE condition` changes the matching rows. The `WHERE` clause is vital: **without it every row is changed**. Habit: write the `WHERE` first, test it with a `SELECT`, then turn the statement into an `UPDATE`. `INSERT` adds rows and `DELETE FROM table WHERE ...` removes them, with the same warning about `WHERE`.

Because `open_loans` and `overdue_loans` read from `loans`, this single change makes the loan disappear from both. Views are always live.

## Indexes

Imagine finding every mention of a word in a 500 page book. Without the index at the back you read every page. A database does the same: to find the loans of one member it scans the whole `loans` table, unless an **index** exists.

```sql
CREATE INDEX idx_loans_member ON loans (member_id);
CREATE INDEX idx_loans_book   ON loans (book_id);
```

An index is a sorted side structure that SQLite keeps up to date. It makes lookups and joins on that column fast, at the cost of a little disk space and slightly slower writes. Index the foreign key columns you join on and the columns you filter by often. Primary keys are indexed automatically, so `id` needs nothing. With 12 loans you will not notice any difference, but with a million loans it is the difference between instant and minutes.

## The dashboard

A single row of **scalar subqueries** (subqueries that return exactly one value) is a neat way to build a summary:

```sql
SELECT
  (SELECT COUNT(*) FROM loans)         AS total_loans,
  (SELECT COUNT(*) FROM open_loans)    AS out_now,
  (SELECT COUNT(*) FROM overdue_loans) AS overdue,
  ...
```

Each parenthesised query is computed on its own and becomes one column. Add `never_borrowed` (books whose id is `NOT IN (SELECT book_id FROM loans)`) and `members` (the number of rows in `members`).

## Walk-through

1. Run the `UPDATE` for loan 5 with `returned_on = '2025-03-15'`.
2. Create the two indexes above.
3. Write the dashboard as the last statement, with the columns `total_loans`, `out_now`, `overdue`, `never_borrowed` and `members` in that order.
4. Check the numbers make sense: before the update 7 loans were out, now it should be 6. Two of the original overdue loans existed; one is now returned, so one remains overdue.

> **Watch out:**
> - An `UPDATE` without `WHERE` rewrites the whole table. Always double check the condition.
> - Updating the wrong column type: dates must stay in `'YYYY-MM-DD'` form or every date comparison breaks.
> - Too many indexes slow down inserts and updates, because each one must be maintained. Index what you query, not everything.
> - `index idx_loans_member already exists` means you ran `CREATE INDEX` twice; add `IF NOT EXISTS` in real scripts.
> - A scalar subquery that returns several rows or columns is an error or silently uses the first row. Use `COUNT`, `SUM` or `MAX` to make it a single value.

## What to build next

* Add a `copies` column to `books` and prevent lending more copies than exist.
* Add a `fines` table and a view that totals fines per member.
* Replace `'2025-03-15'` with `date('now')` everywhere and watch the reports change with the calendar.
* Use `EXPLAIN QUERY PLAN SELECT ...` to see whether SQLite uses your indexes.
* Wrap the return in a transaction (`BEGIN; ... COMMIT;`) so that a half-finished change can never be saved.

> **Your turn:** keep the earlier statements, then add (1) the `UPDATE` that sets `returned_on` to `'2025-03-15'` for loan 5, (2) the two `CREATE INDEX` statements, and (3) the dashboard `SELECT` with `total_loans`, `out_now`, `overdue`, `never_borrowed` and `members`, as the last statement.
