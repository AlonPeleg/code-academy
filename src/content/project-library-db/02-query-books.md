---
title: "Step 2: Search the catalogue"
summary: "Find books with SELECT, WHERE, IN and ORDER BY."
level: beginner
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

      -- TODO (step 2): add a query below that shows title, genre and year of the books
      -- whose genre is Science Fiction or Fantasy and that have at least 250 pages.
      -- Show the newest year first. The new query must be the last statement.
check:
  output: |
    title | genre | year
    Kafka on the Shore | Fantasy | 2002
    Parable of the Sower | Science Fiction | 1993
    Kindred | Science Fiction | 1979
    The Left Hand of Darkness | Science Fiction | 1969
  code:
    - { pattern: "\\bWHERE\\b", message: "Filter the rows with WHERE." }
    - { pattern: "\\bORDER\\s+BY\\s+year\\s+DESC", message: "Sort the newest year first with ORDER BY year DESC." }
hints:
  - "You need SELECT for the three columns, FROM books, a WHERE clause for the filter and ORDER BY at the end. Two conditions must both be true, so join them with AND."
  - "The genre test can be written genre IN ('Science Fiction', 'Fantasy'). The length test is pages >= 250. Newest first means ORDER BY year DESC."
  - "SELECT title, genre, year FROM books WHERE genre IN ('Science Fiction', 'Fantasy') AND pages >= 250 ORDER BY year DESC;"
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
quiz:
  - q: "Which clause comes first in a query?"
    options: ["ORDER BY", "WHERE", "SELECT"]
    answer: 2
    explain: "The order is SELECT, FROM, WHERE, ORDER BY."
  - q: "What does genre IN ('Fantasy', 'Satire') mean?"
    options: ["genre equals one of the two values", "genre equals both values at once", "genre contains the letters of those words"]
    answer: 0
  - q: "How do you sort so the largest year comes first?"
    options: ["ORDER BY year", "ORDER BY year DESC", "SORT year DOWN"]
    answer: 1
---
A database is only useful when you can ask it things. In this step you will answer the questions a reader asks: "what should I read next?" You will combine filters, lists and sorting in a single query.

## Where we are

The library database now exists with four tables: `authors`, `books`, `members` and `loans`. From this step the data is pre-loaded (look at the "Sample data" panel to read the setup). Your notebook so far contains one query, the book list from step 1.

## What we will add

A **search for books**. A reader at the desk says: "I like science fiction and fantasy, and I want something substantial, at least 250 pages, newest first." Turning a sentence like that into SQL is the core skill of this whole project.

## Walk-through

Think of a query as a sentence with a fixed word order: **SELECT** what to show, **FROM** where it lives, **WHERE** which rows qualify, **ORDER BY** how to sort.

1. **Pick the columns.** Only ask for what you need: `SELECT title, genre, year`. Selecting fewer columns makes results easier to read and queries faster.
2. **Filter rows with WHERE.** A condition compares a column with a value: `pages >= 250`. Text values go in single quotes: `genre = 'Fantasy'`.
3. **Combine conditions.** `AND` needs both to be true, `OR` needs at least one. When you mix them, add parentheses so the meaning is clear. A shortcut for "one of several values" is `IN`:

```sql
WHERE genre IN ('Science Fiction', 'Fantasy')
  AND pages >= 250
```

   This is the same as `(genre = 'Science Fiction' OR genre = 'Fantasy') AND pages >= 250`, just shorter.
4. **Sort with ORDER BY.** `ORDER BY year DESC` puts the newest first. Without `DESC` the order is ascending (oldest first). You can sort by several columns: `ORDER BY year DESC, title`.
5. Without `ORDER BY` the database may return rows in any order. If order matters, always say so.

## More tools for searching

```sql
SELECT title FROM books WHERE title LIKE '%of%';      -- text pattern, % means "anything"
SELECT title FROM books WHERE year BETWEEN 1960 AND 1999;
SELECT title FROM books ORDER BY pages DESC LIMIT 3;  -- the three longest books
```

`LIKE` is case-insensitive for plain letters in SQLite. `BETWEEN` includes both ends. `LIMIT` keeps only the first N rows after sorting.

## Why the notebook keeps old queries

The runner shows only the **last** result table, so the new query goes at the bottom. The older queries stay above as a record of your work, and they will keep running without harm.

> **Watch out:**
> - `WHERE genre = Fantasy` (no quotes) gives `no such column: Fantasy`. Text needs single quotes.
> - Double quotes sometimes seem to work, but they mean "column name" in standard SQL. Use single quotes for text.
> - Writing `genre = 'Science Fiction' OR 'Fantasy'` is a classic mistake. Each side of `OR` must be a full comparison, so use `IN`.
> - Case and spelling: `'science fiction'` is not equal to `'Science Fiction'` with `=`. Look at the data first.
> - `ORDER BY` goes after `WHERE`. Reversing them gives `near "WHERE": syntax error`.

> **Your turn:** add a query that shows `title`, `genre` and `year` of the books whose genre is `Science Fiction` or `Fantasy` and that have at least 250 pages, newest year first. It must be the last statement in the file.
