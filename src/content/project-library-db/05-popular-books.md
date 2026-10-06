---
title: "Step 5: Most popular books (aggregates)"
summary: "Group loans with COUNT and MAX to rank books by popularity."
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

      -- TODO (step 5): add a query that ranks the borrowed books.
      -- Columns: title, author, times_borrowed (how many loans), last_loaned (latest loaned_on).
      -- Group the loans by book (b.id, b.title, a.name).
      -- Order by times_borrowed, biggest first, and by title when counts are equal.
      -- The new query must be the last statement.
check:
  output: |
    title | author | times_borrowed | last_loaned
    1984 | George Orwell | 3 | 2025-03-03
    The Left Hand of Darkness | Ursula K. Le Guin | 3 | 2025-03-10
    A Wizard of Earthsea | Ursula K. Le Guin | 1 | 2025-03-05
    Americanah | Chimamanda Ngozi Adichie | 1 | 2025-01-15
    Half of a Yellow Sun | Chimamanda Ngozi Adichie | 1 | 2025-02-12
    Kafka on the Shore | Haruki Murakami | 1 | 2025-03-08
    Kindred | Octavia E. Butler | 1 | 2025-02-20
    Norwegian Wood | Haruki Murakami | 1 | 2025-02-01
  code:
    - { pattern: "GROUP\\s+BY\\s+b\\.id", message: "Group the loans by book (GROUP BY b.id, ...)." }
    - { pattern: "COUNT\\s*\\(", message: "Count the loans with COUNT(*)." }
    - { pattern: "MAX\\s*\\(", message: "Use MAX(l.loaned_on) for the latest loan date." }
hints:
  - "One row per book means GROUP BY the book. Then aggregate functions summarise each group: COUNT(*) counts the loan rows, MAX(...) finds the latest date."
  - "Join loans to books and authors, then GROUP BY b.id, b.title, a.name so every displayed column is grouped. Sort with ORDER BY times_borrowed DESC, b.title."
  - "SELECT b.title, a.name AS author, COUNT(*) AS times_borrowed, MAX(l.loaned_on) AS last_loaned FROM loans AS l JOIN books AS b ON b.id = l.book_id JOIN authors AS a ON a.id = b.author_id GROUP BY b.id, b.title, a.name ORDER BY times_borrowed DESC, b.title;"
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
quiz:
  - q: "Which rule applies to the SELECT list of a grouped query?"
    options: ["Every column must be in GROUP BY or inside an aggregate function", "Only numbers may be selected", "It must contain exactly one column"]
    answer: 0
  - q: "What is the difference between COUNT(*) and COUNT(returned_on)?"
    options: ["There is none", "COUNT(returned_on) skips rows where returned_on is NULL", "COUNT(*) skips NULLs, the other counts them"]
    answer: 1
  - q: "Why add b.title as a second ORDER BY key?"
    options: ["It makes counting faster", "It is required by SQL", "It gives books with equal counts a stable alphabetical order"]
    answer: 2
---
Until now every query returned individual rows. A library manager also wants **summaries**: which books are loved, which members read the most. That is the job of aggregate functions and `GROUP BY`.

## Where we are

Your notebook can list books, search them, show the loan history and report overdue loans. Each of those returns one row per thing. Now we want one row per *group* of things.

## What we will add

A **popularity ranking**: for every book that has been borrowed, show its title, author, how many times it was borrowed and the date of the most recent loan, most popular first. The librarian uses it to decide which titles to buy more copies of.

## Aggregates and groups

An **aggregate function** collapses many rows into one value:

| Function | Meaning |
|---|---|
| `COUNT(*)` | how many rows |
| `SUM(x)` | total of a number column |
| `AVG(x)` | average |
| `MIN(x)`, `MAX(x)` | smallest and largest (works on dates too) |

`GROUP BY` tells SQL to make one bucket per distinct value and apply the aggregate inside each bucket:

```sql
SELECT member_id, COUNT(*) AS loans
FROM loans
GROUP BY member_id;
```

```text
member_id | loans
1 | 3
2 | 3
3 | 2
...
```

The rule to remember: **every column in the SELECT list must either be in the GROUP BY or be inside an aggregate function.** Otherwise SQL cannot know which of the bucket's values to show.

## Walk-through

1. Start with `FROM loans AS l`: each loan row is one "borrow event", so counting loans per book counts borrows.
2. Join `books AS b` and then `authors AS a`, exactly as in step 3.
3. Group by the book. Include everything you display that is not an aggregate: `GROUP BY b.id, b.title, a.name`.
4. Select `b.title`, `a.name AS author`, `COUNT(*) AS times_borrowed` and `MAX(l.loaned_on) AS last_loaned`. `MAX` of ISO dates is the latest date.
5. Order by `times_borrowed DESC, b.title`. The second sort key breaks ties alphabetically so the order is stable.

## Counting people instead

The same pattern gives loans per member:

```sql
SELECT m.name, COUNT(*) AS loans
FROM loans AS l
JOIN members AS m ON m.id = l.member_id
GROUP BY m.id, m.name
ORDER BY loans DESC;
```

Notice that Yossi (a member with no loans) is missing, because an inner join only keeps matches. Step 6 fixes that.

## COUNT(*) versus COUNT(column)

`COUNT(*)` counts rows. `COUNT(column)` counts only rows where that column is not `NULL`. For example `COUNT(returned_on)` is the number of returned loans, while `COUNT(*) - COUNT(returned_on)` is the number still out.

> **Watch out:**
> - `misuse of aggregate function` appears if you use an aggregate in `WHERE`. Filters on aggregates need `HAVING` (next step).
> - Selecting a column that is neither grouped nor aggregated is an error in most databases. SQLite quietly picks an arbitrary row, which hides bugs. Group by everything you display.
> - Group by the **id**, not just the title: two different books could share a title.
> - Do not forget tie-breakers in `ORDER BY`; otherwise equal counts may come out in a different order on another run.
> - `AVG` ignores `NULL`s, `COUNT(*)` does not.

> **Your turn:** add a query that shows `title`, `author`, `times_borrowed` and `last_loaned` for each borrowed book, grouped by book, most borrowed first and alphabetical on ties. It must be the last statement in the file.
