---
title: Route parameters and query strings
summary: Read data from the URL with req.params (/books/2) and req.query (?sort=year), convert it to numbers, and answer 400 or 404 when it is wrong.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const express = require('express');
      const app = express();

      const books = [
        { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965 },
        { id: 2, title: 'Neuromancer', author: 'William Gibson', year: 1984 },
        { id: 3, title: 'Emma', author: 'Jane Austen', year: 1815 },
        { id: 4, title: 'Persuasion', author: 'Jane Austen', year: 1817 },
        { id: 5, title: 'Count Zero', author: 'William Gibson', year: 1986 },
      ];

      // 1. GET /books -> answer the JSON object { count, books } where books is the list after:
      //      - filtering by the author query value when it is given   (?author=Jane Austen)
      //      - sorting by year, oldest first, when the sort query value is the text year   (?sort=year)
      //      - keeping only the first N books when limit is given     (?limit=3)
      //    Do the steps in this order: filter, sort, limit. count is the length of the final list.
      //    Work on a copy of the array so the original is never changed.
      app.get('/books', (req, res) => {
        res.json({ count: 0, books: [] });
      });

      // 2. GET /books/:id -> the id is part of the path and arrives as TEXT.
      //      - not a whole number (like "abc")  -> status 400 and { error: 'id must be a number' }
      //      - no book with that id             -> status 404 and { error: 'Book not found' }
      //      - otherwise                        -> the book itself as JSON

      // 3. GET /authors/:name -> answer { author: <the name from the path>, count: <how many books that author has> }

      // ---- The code below starts the server and calls it. Do not change it. ----
      async function getBooks(query) {
        const response = await fetch('http://localhost:3000/books' + query);
        const body = await response.json();
        console.log('/books' + query + ' -> ' + body.count + ': ' + body.books.map((b) => b.title).join(', '));
      }

      async function getBook(id) {
        const response = await fetch('http://localhost:3000/books/' + id);
        const body = await response.json();
        console.log(response.status + ' ' + (body.title || body.error));
      }

      const server = app.listen(3000, async () => {
        try {
          await getBooks('');
          await getBooks('?author=William%20Gibson&limit=1');
          await getBooks('?sort=year&limit=3');
          await getBook(2);
          await getBook(99);
          await getBook('abc');

          const response = await fetch('http://localhost:3000/authors/Jane%20Austen');
          const body = await response.json();
          console.log(body.author + ' wrote ' + body.count + ' books');
        } catch (error) {
          console.log('Something went wrong: ' + error.message);
        } finally {
          server.close();
        }
      });
check:
  output: |
    /books -> 5: Dune, Neuromancer, Emma, Persuasion, Count Zero
    /books?author=William%20Gibson&limit=1 -> 1: Neuromancer
    /books?sort=year&limit=3 -> 3: Emma, Persuasion, Dune
    200 Neuromancer
    404 Book not found
    400 id must be a number
    Jane Austen wrote 2 books
  code:
    - { pattern: 'req\.query', message: "Read the query string values from req.query." }
    - { pattern: 'req\.params\.id|req\.params\s*\)|\{\s*id\s*\}\s*=\s*req\.params', message: "Read the id from req.params." }
    - { pattern: 'app\.get\(\s*[''"]/books/:id', message: "Declare the route as app.get('/books/:id', ...)." }
    - { pattern: 'app\.get\(\s*[''"]/authors/:name', message: "Declare the route as app.get('/authors/:name', ...)." }
    - { pattern: 'Number\s*\(|parseInt\s*\(', message: "The id is text. Convert it to a number first." }
    - { pattern: 'status\(\s*400\s*\)', message: "Answer a bad id with status 400." }
    - { pattern: 'status\(\s*404\s*\)', message: "Answer a missing book with status 404." }
hints:
  - "Route parameters are written with a colon in the path ('/books/:id') and arrive in req.params as TEXT (req.params.id is the string '2'). Query string values arrive in req.query as text too (req.query.limit is '3'). Convert with Number(...) when you need a number."
  - "For /books: let result = [...books]; then if (req.query.author) filter, if (req.query.sort === 'year') sort((a, b) => a.year - b.year), if (req.query.limit) slice(0, Number(req.query.limit)). For /books/:id: const id = Number(req.params.id); use Number.isInteger(id) to detect a bad id, then books.find(...) for the 404."
  - "app.get('/books/:id', (req, res) => { const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be a number' }); const book = books.find((b) => b.id === id); if (!book) return res.status(404).json({ error: 'Book not found' }); res.json(book); });"
solution:
  - name: main.js
    code: |
      const express = require('express');
      const app = express();

      const books = [
        { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965 },
        { id: 2, title: 'Neuromancer', author: 'William Gibson', year: 1984 },
        { id: 3, title: 'Emma', author: 'Jane Austen', year: 1815 },
        { id: 4, title: 'Persuasion', author: 'Jane Austen', year: 1817 },
        { id: 5, title: 'Count Zero', author: 'William Gibson', year: 1986 },
      ];

      app.get('/books', (req, res) => {
        let result = [...books];
        if (req.query.author) {
          result = result.filter((b) => b.author === req.query.author);
        }
        if (req.query.sort === 'year') {
          result.sort((a, b) => a.year - b.year);
        }
        if (req.query.limit) {
          result = result.slice(0, Number(req.query.limit));
        }
        res.json({ count: result.length, books: result });
      });

      app.get('/books/:id', (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
          return res.status(400).json({ error: 'id must be a number' });
        }
        const book = books.find((b) => b.id === id);
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
      });

      app.get('/authors/:name', (req, res) => {
        const name = req.params.name;
        const count = books.filter((b) => b.author === name).length;
        res.json({ author: name, count });
      });

      async function getBooks(query) {
        const response = await fetch('http://localhost:3000/books' + query);
        const body = await response.json();
        console.log('/books' + query + ' -> ' + body.count + ': ' + body.books.map((b) => b.title).join(', '));
      }

      async function getBook(id) {
        const response = await fetch('http://localhost:3000/books/' + id);
        const body = await response.json();
        console.log(response.status + ' ' + (body.title || body.error));
      }

      const server = app.listen(3000, async () => {
        try {
          await getBooks('');
          await getBooks('?author=William%20Gibson&limit=1');
          await getBooks('?sort=year&limit=3');
          await getBook(2);
          await getBook(99);
          await getBook('abc');

          const response = await fetch('http://localhost:3000/authors/Jane%20Austen');
          const body = await response.json();
          console.log(body.author + ' wrote ' + body.count + ' books');
        } catch (error) {
          console.log('Something went wrong: ' + error.message);
        } finally {
          server.close();
        }
      });
quiz:
  - q: "A client requests GET /books/7. In app.get('/books/:id', ...), what is req.params.id?"
    options: ["The number 7", "The text '7'", "undefined"]
    answer: 1
    explain: "Everything that comes from a URL is text. Convert it with Number(req.params.id) before comparing it with numeric ids."
  - q: "Where do you find the values in the URL /books?author=Jane&limit=2?"
    options: ["req.params", "req.body", "req.query"]
    answer: 2
  - q: "When is a route parameter the right choice and when is a query string?"
    options: ["Parameters identify ONE thing (/books/2); query strings filter, sort or page a list (?sort=year)", "They are the same, use whichever you like", "Query strings are only for POST requests"]
    answer: 0
  - q: "Which status code fits a request for /books/99 when no such book exists?"
    options: ["400", "404", "200"]
    answer: 1
    explain: "404 means the thing you asked for was not found. 400 is for a request that is malformed, like /books/abc."
---

Real APIs are full of URLs like `/users/42`, `/books/7/reviews` or `/products?category=shoes&sort=price`. The server must read those pieces and use them. In this lesson you learn the two places where Express hands you data from the URL: **route parameters** and the **query string**.

## Route parameters: identify one thing

When part of a path changes from request to request, mark it with a colon. Express matches the route and stores that part in `req.params`:

```js
app.get('/books/:id', (req, res) => {
  res.send('You asked for book ' + req.params.id);
});
```

- `GET /books/2` -> `req.params.id` is `'2'`
- `GET /books/abc` -> `req.params.id` is `'abc'`

You can have several parameters, and they can sit in the middle of a path:

```js
app.get('/authors/:author/books/:id', (req, res) => {
  const { author, id } = req.params;   // destructuring keeps it tidy
  res.json({ author, id });
});
```

Parameters are **always text**, even when they look like numbers. Convert them before comparing:

```js
const id = Number(req.params.id);   // '2' becomes 2, 'abc' becomes NaN
if (!Number.isInteger(id)) { /* not a whole number */ }
```

Spaces and special characters arrive decoded: a request for `/authors/Jane%20Austen` gives `req.params.name === 'Jane Austen'`.

## Query strings: filter, sort and page a list

The part of a URL after `?` is the **query string**: a list of `key=value` pairs separated by `&`. Express parses it into the object `req.query`, so for `GET /books?author=Jane%20Austen&limit=2`:

```js
req.query.author  // 'Jane Austen'
req.query.limit   // '2'   (text again!)
req.query.sort    // undefined (not in the URL)
```

A missing key gives `undefined`, so optional filters are written as "if it is there, apply it":

```js
let result = [...books];                          // a copy, never change the original
if (req.query.author) {
  result = result.filter((b) => b.author === req.query.author);
}
if (req.query.limit) {
  result = result.slice(0, Number(req.query.limit));
}
```

The order matters. Filter first, sort next, and cut the list with `limit` last, otherwise you would limit the wrong books.

## Which one should I use?

| Use a route parameter when... | Use a query string when... |
| --- | --- |
| it identifies **one** resource: `/books/2` | it **narrows** a list: `/books?author=Jane` |
| it is required for the route to make sense | it is optional: `?sort=year`, `?limit=10`, `?page=2` |
| it is part of the resource's address | it changes how the list is shown |

## Telling the client what went wrong

A good API uses status codes to separate two failures:

- **400 Bad Request**: the request itself is malformed (`/books/abc`, the id is not a number).
- **404 Not Found**: the request is fine but the thing does not exist (`/books/99`).

Each needs a clear JSON message, such as `{ error: 'Book not found' }`. Notice the `return` in front of `res.status(...).json(...)`: it stops the handler so the code below does not run and try to answer a second time.

> **Watch out:**
> - **Comparing text with a number.** `books.find((b) => b.id === req.params.id)` never matches, because `2 === '2'` is `false`. Convert with `Number(...)` first. This is the number one bug in beginner APIs.
> - **Forgetting `return` after an early answer.** Without it the handler continues and Express reports `Cannot set headers after they are sent to the client`.
> - **Route order.** Express tries routes top to bottom. If `/books/:id` comes before `/books/latest`, then `latest` is treated as an id. Put the more specific route first.
> - **Same key twice.** `?tag=a&tag=b` makes `req.query.tag` an **array** (`['a', 'b']`), while `?tag=a` gives a string. Check with `Array.isArray` if you expect repeats.
> - **Untrusted input.** Query values come from users. Never assume `limit` is a sensible number: `Number('abc')` is `NaN`, so validate before using it.

## Going further

Add `?q=text` to `/books` to keep only the books whose title contains the text (use `includes` after `toLowerCase()`), and a `?page=2&pageSize=2` pair. The practice API from the API track (`https://api.academy.test/users?_page=2&_limit=2`) works exactly like that, and you are now able to build one.

> **Your turn:** write the three routes in `main.js`: `GET /books` with the optional `author`, `sort` and `limit` query values (filter, then sort, then limit), `GET /books/:id` with the `400` and `404` answers, and `GET /authors/:name`. The code at the bottom calls them and prints seven lines.
