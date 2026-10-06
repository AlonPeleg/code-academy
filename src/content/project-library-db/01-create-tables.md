---
title: "Step 1: Design and create the tables"
summary: "Create the authors and books tables with keys and constraints, and insert the first rows."
level: beginner
runner: sql
seed: |
  -- The database starts completely empty.
  -- You will create the tables yourself in this step.
files:
  - name: query.sql
    code: |
      -- Library database, step 1: tables and data.
      -- SQLite only enforces links between tables when this is switched on:
      PRAGMA foreign_keys = ON;

      -- Authors are done for you. Read them as an example.
      CREATE TABLE authors (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT
      );
      INSERT INTO authors (id, name, country) VALUES
        (1, 'Ursula K. Le Guin', 'USA'),
        (2, 'Haruki Murakami', 'Japan'),
        (3, 'Chimamanda Ngozi Adichie', 'Nigeria'),
        (4, 'George Orwell', 'UK'),
        (5, 'Octavia E. Butler', 'USA');

      -- TODO 1: create the books table, placed ABOVE the insert below.
      --   id         whole number, the primary key
      --   title      text, must not be empty (required)
      --   author_id  whole number, required, a link to the id column of authors
      --   genre      text
      --   year       whole number, only allowed when greater than 1400
      --   pages      whole number, only allowed when greater than 0


      -- Books 1 to 9 are ready to insert (this fails until the table exists).
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

      -- TODO 2: insert book 10 yourself WITHOUT an id (the database picks it):
      --   title 'Parable of the Sower', author 5, genre 'Science Fiction', year 1993, 345 pages
      --   Use a column list after the table name.


      -- TODO 3: show id, title and year of all books, in id order.
check:
  output: |
    id | title | year
    1 | The Left Hand of Darkness | 1969
    2 | A Wizard of Earthsea | 1968
    3 | Norwegian Wood | 1987
    4 | Kafka on the Shore | 2002
    5 | Half of a Yellow Sun | 2006
    6 | Americanah | 2013
    7 | 1984 | 1949
    8 | Animal Farm | 1945
    9 | Kindred | 1979
    10 | Parable of the Sower | 1993
  code:
    - { pattern: "CREATE\\s+TABLE\\s+books", message: "Create the books table with CREATE TABLE books (...)." }
    - { pattern: "REFERENCES\\s+authors|FOREIGN\\s+KEY\\s*\\(", message: "Link author_id to authors with REFERENCES authors(id)." }
    - { pattern: "CHECK\\s*\\(", message: "Add CHECK (...) rules for year and pages." }
    - { pattern: "CREATE\\s+TABLE\\s+books\\s*\\(\\s*id\\s+INTEGER\\s+PRIMARY\\s+KEY", message: "Start the books table with id INTEGER PRIMARY KEY." }
hints:
  - "A table is created with CREATE TABLE name (column definitions). Each definition is: column_name TYPE rules, separated by commas. Look at the authors table as your model."
  - "For books: id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER NOT NULL REFERENCES authors(id), genre TEXT, year INTEGER CHECK (year > 1400), pages INTEGER CHECK (pages > 0). Book 10 needs INSERT INTO books (title, author_id, genre, year, pages) VALUES (...)."
  - "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER NOT NULL REFERENCES authors(id), genre TEXT, year INTEGER CHECK (year > 1400), pages INTEGER CHECK (pages > 0)); then INSERT INTO books (title, author_id, genre, year, pages) VALUES ('Parable of the Sower', 5, 'Science Fiction', 1993, 345); and finally SELECT id, title, year FROM books ORDER BY id;"
solution:
  - name: query.sql
    code: |
      -- Library database, step 1: tables and data.
      -- SQLite only enforces links between tables when this is switched on:
      PRAGMA foreign_keys = ON;

      CREATE TABLE authors (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT
      );
      INSERT INTO authors (id, name, country) VALUES
        (1, 'Ursula K. Le Guin', 'USA'),
        (2, 'Haruki Murakami', 'Japan'),
        (3, 'Chimamanda Ngozi Adichie', 'Nigeria'),
        (4, 'George Orwell', 'UK'),
        (5, 'Octavia E. Butler', 'USA');

      CREATE TABLE books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES authors(id),
        genre TEXT,
        year INTEGER CHECK (year > 1400),
        pages INTEGER CHECK (pages > 0)
      );

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

      -- Book 10: no id given, the database picks the next free number.
      INSERT INTO books (title, author_id, genre, year, pages)
      VALUES ('Parable of the Sower', 5, 'Science Fiction', 1993, 345);

      SELECT id, title, year FROM books ORDER BY id;
quiz:
  - q: "What is a foreign key?"
    options: ["A column that must be unique in its own table", "A column whose values point to the primary key of another table", "A password stored in the database"]
    answer: 1
    explain: "author_id in books holds an id from authors. That link is the foreign key."
  - q: "Why do we store the author's id in books instead of copying the author's name into every book?"
    options: ["Numbers are always faster than text", "SQL cannot store names twice", "Each fact is stored once (normalisation), so a correction needs to be made in only one place"]
    answer: 2
  - q: "What does CHECK (pages > 0) do?"
    options: ["It makes the database reject any row where pages is not greater than 0", "It prints a warning but saves the row anyway", "It creates an index on pages"]
    answer: 0
---
Every real app starts with a question: where will the data live, and what shape will it have? In this project you will build the database of a small public library and then ask it the questions a librarian asks every day. Before any question, though, you need tables.

## Where we are

Nothing yet. The database below is completely empty. That is the best moment to think about **design**, because a good design makes every later query easy and a bad one makes them painful.

## What we will add

A library has four kinds of things: **authors**, **books**, **members** (people who borrow) and **loans** (one person borrowing one book on one day). We will give each kind its own table. In this first step you create the `authors` and `books` tables and fill them; from step 2 on, the members and loans tables (and all the data) are pre-loaded for you, so we can concentrate on questions.

## Design ideas in plain language

* **A table is a list of one kind of thing.** Each row is one thing (one book), each column is one fact about it (its title).
* **A primary key identifies a row.** `id INTEGER PRIMARY KEY` gives every book its own number. In SQLite, if you leave the id out when inserting, the database picks the next free number for you.
* **A foreign key is a link.** The books table stores `author_id`, a number that points at a row in `authors`. We do not copy the author's name into every book. This habit is called **normalisation**: store each fact exactly once. If an author changes how their name is spelled, you fix one row, not fifty.
* **Constraints are rules the database enforces for you.** `NOT NULL` means "must have a value", `UNIQUE` means "no duplicates", `CHECK (year > 1400)` rejects nonsense years, and `REFERENCES authors(id)` says the number must belong to a real author.
* **Dates are text.** SQLite has no special date type. We store dates as ISO text such as `'2025-03-15'` (year-month-day). That format sorts correctly and the date functions understand it.

## Walk-through

1. Read the finished `authors` table in the starter. Notice the column list after `INSERT INTO authors`: it names the columns, so the order of the values cannot be confused.
2. Write `CREATE TABLE books (...)`. The shape is:

```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id),
  genre TEXT,
  year INTEGER CHECK (year > 1400),
  pages INTEGER CHECK (pages > 0)
);
```

   Each line is `column_name TYPE rules`. The types are `INTEGER` (whole numbers) and `TEXT`. Commas separate the columns, and there is no comma after the last one.
3. The `INSERT` for books 1 to 9 is already in the starter. It only works once the table exists, so put your `CREATE TABLE` above it.
4. Add book number 10 yourself with a **column list** and no id:

```sql
INSERT INTO books (title, author_id, genre, year, pages)
VALUES ('...', 5, '...', 1993, 345);
```

5. Finish with a `SELECT` that lists `id`, `title` and `year` of every book in id order. That is the result the checker looks at.

## What the other two tables look like

You will meet these in the next steps, so here is their shape. `members` has `id`, `name`, a `UNIQUE` `email` and `joined`. `loans` has `id`, `book_id` and `member_id` (two foreign keys), `loaned_on`, `due_on` and `returned_on`. A loan that is still out has `NULL` in `returned_on`, which is exactly how the librarian will find unreturned books later.

> **Watch out:**
> - `no such table: books` means the `CREATE TABLE` is missing or comes after the `INSERT`. Order matters.
> - `near ")": syntax error` usually means a trailing comma after the last column.
> - `FOREIGN KEY constraint failed` means an `author_id` that does not exist in `authors`. We switched the check on with `PRAGMA foreign_keys = ON;` (SQLite is relaxed by default).
> - `CHECK constraint failed` means a value broke your rule, for example a negative page count.
> - Quotes: text values use single quotes (`'Kindred'`). Double quotes are for column names.

> **Your turn:** create the `books` table with a primary key, `NOT NULL` on the title and author, a link to `authors`, and `CHECK` rules for year and pages. Run the given insert for books 1 to 9, add book 10 (`Parable of the Sower`, author 5, `Science Fiction`, 1993, 345 pages) using a column list, and finish with `SELECT id, title, year FROM books ORDER BY id;`.
