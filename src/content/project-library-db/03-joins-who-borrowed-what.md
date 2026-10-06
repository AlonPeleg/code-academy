---
title: "Step 3: Who borrowed what (JOINs)"
summary: "Join loans, members, books and authors into a readable history."
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

      -- TODO (step 3): add a query that lists, for every loan, the member name (as member),
      -- the book title (as book), the author name (as author) and the loaned_on date.
      -- Join loans with members, books and authors, and sort by l.loaned_on, then l.id.
      -- Use the aliases l, m, b and a. The new query must be the last statement.
check:
  output: |
    member | book | author | loaned_on
    Dana Levi | The Left Hand of Darkness | Ursula K. Le Guin | 2025-01-05
    Lina Mizrahi | Americanah | Chimamanda Ngozi Adichie | 2025-01-15
    Dana Levi | 1984 | George Orwell | 2025-01-20
    Eitan Cohen | Norwegian Wood | Haruki Murakami | 2025-02-01
    Eitan Cohen | 1984 | George Orwell | 2025-02-10
    Noa Katz | Half of a Yellow Sun | Chimamanda Ngozi Adichie | 2025-02-12
    Omar Haddad | Kindred | Octavia E. Butler | 2025-02-20
    Noa Katz | The Left Hand of Darkness | Ursula K. Le Guin | 2025-03-01
    Omar Haddad | 1984 | George Orwell | 2025-03-03
    Lina Mizrahi | A Wizard of Earthsea | Ursula K. Le Guin | 2025-03-05
    Dana Levi | Kafka on the Shore | Haruki Murakami | 2025-03-08
    Eitan Cohen | The Left Hand of Darkness | Ursula K. Le Guin | 2025-03-10
  code:
    - { pattern: "JOIN\\s+members", message: "Join the members table." }
    - { pattern: "JOIN\\s+books", message: "Join the books table." }
    - { pattern: "JOIN\\s+authors\\s+AS\\s+a\\s+ON", message: "Join authors with an ON condition." }
hints:
  - "Start from loans AS l. Each JOIN adds one table and needs an ON condition that matches a foreign key with the primary key it points to."
  - "JOIN members AS m ON m.id = l.member_id, JOIN books AS b ON b.id = l.book_id, then JOIN authors AS a ON a.id = b.author_id. Select m.name AS member, b.title AS book, a.name AS author, l.loaned_on."
  - "SELECT m.name AS member, b.title AS book, a.name AS author, l.loaned_on FROM loans AS l JOIN members AS m ON m.id = l.member_id JOIN books AS b ON b.id = l.book_id JOIN authors AS a ON a.id = b.author_id ORDER BY l.loaned_on, l.id;"
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
quiz:
  - q: "What does the ON condition of a JOIN say?"
    options: ["Which rows of the two tables belong together", "Which column to sort by", "How many rows to return"]
    answer: 0
  - q: "Why do we write m.name and a.name instead of just name?"
    options: ["Aliases make queries run faster", "Both tables have a name column, so SQL needs to know which one", "Because name is a reserved word"]
    answer: 1
  - q: "What happens if you forget the ON condition?"
    options: ["SQL refuses to run", "Only the first row is joined", "Every row is paired with every row, giving a huge useless result"]
    answer: 2
    explain: "That is called a cross product."
---
Data split across tables is tidy, but a librarian wants to see "Dana borrowed The Left Hand of Darkness", with names and titles rather than numbers. A **JOIN** glues the tables back together on the fly.

## Where we are

Your notebook has the full book list and the science-fiction search. The `loans` table says which member borrowed which book, but only as numbers: `book_id` and `member_id`. Run `SELECT * FROM loans;` in your head and you would see lots of ids and no names.

## What we will add

A **loan history report**: member name, book title, author and the date it was borrowed. It needs four tables: `loans` for the event, `members` for the person, `books` for the title and `authors` for the writer.

## How a JOIN works

A join pairs up rows from two tables whenever a condition is true. The condition is almost always "the foreign key equals the primary key":

```sql
FROM loans AS l
JOIN members AS m ON m.id = l.member_id
```

For each loan row, the database finds the member row whose `id` equals the loan's `member_id` and puts them side by side as one wide row. `AS l` and `AS m` are **aliases**, short nicknames so you do not have to type the full table names.

## Walk-through

1. Start from the table that represents the event, `loans`. Give it the alias `l`.
2. Join `members AS m` with `ON m.id = l.member_id`.
3. Join `books AS b` with `ON b.id = l.book_id`.
4. The author is one more hop: `books` points at `authors`. Join `authors AS a` with `ON a.id = b.author_id`. A chain of joins follows the chain of foreign keys.
5. In the `SELECT` list, **prefix every column with its alias** (`m.name`, `b.title`). Both `members` and `authors` have a column called `name`, so a bare `name` would be ambiguous. You can rename columns in the output with `AS`:

```sql
SELECT m.name AS member, b.title AS book, a.name AS author, l.loaned_on
```

6. Sort the result by `l.loaned_on` and then `l.id`, so loans made on the same day always come out in the same order.

## Which kind of JOIN?

Plain `JOIN` (also written `INNER JOIN`) keeps only the rows that have a match on both sides. That is perfect here: every loan has a member and a book. A member who never borrowed anything would simply not show up. If you need to keep such rows, you use `LEFT JOIN`, which you will meet in step 6.

## Normalisation pays off

Because the author's name lives in exactly one row, this report always shows the current spelling. Nothing was copied into the loans table. The price is that you must join to read it, and databases are very good at that, especially when the key columns are indexed (step 8).

> **Watch out:**
> - `ambiguous column name: name` means two joined tables have that column and you did not say which. Add the alias prefix.
> - Forgetting the `ON` condition makes SQLite pair every row with every row (a "cross product"). You would get hundreds of nonsense rows.
> - Joining on the wrong columns, for example `ON m.id = l.book_id`, runs fine but returns wrong people. Say the sentence out loud: "the member whose id equals the loan's member_id".
> - If you reuse an alias twice (`AS m` for two tables), you will get `ambiguous column name` errors.
> - `ORDER BY` can use the alias prefix too: `ORDER BY l.loaned_on`.

> **Your turn:** add a query that lists `member`, `book`, `author` and `loaned_on` for every loan, joining `loans`, `members`, `books` and `authors`, ordered by `l.loaned_on` and then `l.id`. It must be the last statement in the file.
