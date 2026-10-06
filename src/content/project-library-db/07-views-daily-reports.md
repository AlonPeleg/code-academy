---
title: "Step 7: Views for the librarian's daily reports"
summary: "Save the long joins as named views and build views on top of views."
level: advanced
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

      -- TODO (step 7): save the long join as views, then use them.
      --  1. A view called loan_details: loan_id, member, book, author, loaned_on, due_on, returned_on
      --     (the join of loans, members, books and authors, with those column names).
      --  2. A view called open_loans: all columns of loan_details for loans not yet returned.
      --  3. A view called overdue_loans: loan_id, member, book, due_on and days_overdue,
      --     built FROM open_loans and keeping the rows due before '2025-03-15'.
      --  4. Finally query overdue_loans: member, book, days_overdue, most overdue first, then by member.
      -- Create each view after the one it uses. The final query must be the last statement.
check:
  output: |
    member | book | days_overdue
    Noa Katz | Half of a Yellow Sun | 17
    Omar Haddad | Kindred | 9
  code:
    - { pattern: "CREATE\\s+VIEW\\s+loan_details", message: "Create the view loan_details." }
    - { pattern: "CREATE\\s+VIEW\\s+open_loans", message: "Create the view open_loans." }
    - { pattern: "CREATE\\s+VIEW\\s+overdue_loans", message: "Create the view overdue_loans." }
    - { pattern: "FROM\\s+overdue_loans", message: "Finish by querying the overdue_loans view." }
hints:
  - "A view is a saved SELECT with a name: CREATE VIEW name AS SELECT .... Afterwards you query it like a table. Views can read from other views, so create them in order."
  - "loan_details = the four-table join with columns renamed (loan_id, member, book, author, ...). open_loans = SELECT * FROM loan_details WHERE returned_on IS NULL. overdue_loans = SELECT loan_id, member, book, due_on, <days calculation> AS days_overdue FROM open_loans WHERE due_on < '2025-03-15'."
  - "CREATE VIEW overdue_loans AS SELECT loan_id, member, book, due_on, CAST(julianday('2025-03-15') - julianday(due_on) AS INTEGER) AS days_overdue FROM open_loans WHERE due_on < '2025-03-15'; then SELECT member, book, days_overdue FROM overdue_loans ORDER BY days_overdue DESC, member;"
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
quiz:
  - q: "Does a view store its own copy of the data?"
    options: ["Yes, it is a copy that must be refreshed", "No, it stores a query that runs on the current tables each time", "Only if it has an index"]
    answer: 1
  - q: "Why are views useful for daily reports?"
    options: ["They make the data smaller", "They write the data to a file", "A long join is written once and reused with a short, readable name"]
    answer: 2
  - q: "A view overdue_loans reads FROM open_loans. What must you do about the order?"
    options: ["Create open_loans first, because overdue_loans depends on it", "Nothing, SQLite sorts it out", "Create overdue_loans first"]
    answer: 0
---
The librarian runs the same handful of reports every morning. Instead of retyping long joins, a database lets you save a query under a name. That saved query is called a **view**.

## Where we are

Your notebook now holds a whole toolbox: searches, joins, overdue calculations, popularity rankings and dead stock. Each report repeats the same long join of loans, members, books and authors.

## What we will add

Three views that make daily reporting one-liners:

* `loan_details`: every loan with the member, book and author names already joined in.
* `open_loans`: only loans that have not been returned.
* `overdue_loans`: open loans that are past their due date, with `days_overdue`.

## What a view is

A view is a **stored SELECT with a name**. It stores no data of its own. Each time you query the view, the database runs the saved query against the current tables, so the answer is always up to date.

```sql
CREATE VIEW open_loans AS
SELECT * FROM loan_details
WHERE returned_on IS NULL;

SELECT * FROM open_loans;   -- use it like a table
```

Why it matters in a real application:

* **Reuse**: write the join once, use it everywhere.
* **Readability**: `SELECT member, book FROM overdue_loans` reads like English.
* **Safety**: you can give a colleague access to a view that hides columns you do not want them to see.
* **Layers**: views can be built on other views, like building blocks.

## Walk-through

1. **`loan_details`**: take the join from step 3 and give the columns friendly names. Keep the `loan_id`, the dates and the `returned_on` column so later views can filter on them:

```sql
CREATE VIEW loan_details AS
SELECT l.id AS loan_id, m.name AS member, b.title AS book, a.name AS author,
       l.loaned_on, l.due_on, l.returned_on
FROM loans AS l
JOIN members AS m ON m.id = l.member_id
JOIN books   AS b ON b.id = l.book_id
JOIN authors AS a ON a.id = b.author_id;
```

2. **`open_loans`**: select everything from `loan_details` where `returned_on IS NULL`.
3. **`overdue_loans`**: select from `open_loans` the `loan_id`, `member`, `book`, `due_on`, and the same `days_overdue` calculation as in step 4, keeping only rows with `due_on < '2025-03-15'`.
4. Finish by querying the view: `member`, `book` and `days_overdue` from `overdue_loans`, most overdue first, then by member name. Compare it with your step 4 result: the answer is the same, but the query is three lines.

Order matters: a view must be created after the views it uses. Views are created once; running `CREATE VIEW` for a name that already exists gives an error. Here every run starts from a fresh database, so that is not a problem. In a real database you would write `DROP VIEW IF EXISTS name;` first.

> **Watch out:**
> - `no such table: loan_details` means the view is missing, misspelled or created after it is used.
> - A view does not store the "today" date. Ours hard-codes `'2025-03-15'`; in production use `date('now')`.
> - `SELECT *` in a view freezes the column list at creation time in some databases. Prefer naming the columns for views you will keep.
> - Views are not faster than the query inside them (SQLite just runs the saved query). Indexes are what make queries fast (next step).
> - `table loan_details already exists` appears if you create the same view twice in a script.

> **Your turn:** keep the earlier queries. Create the views `loan_details`, `open_loans` and `overdue_loans` as described, then finish with `SELECT member, book, days_overdue FROM overdue_loans ORDER BY days_overdue DESC, member;` as the last statement.
