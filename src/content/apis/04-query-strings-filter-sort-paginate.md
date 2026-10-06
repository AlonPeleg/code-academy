---
title: "Query strings: filtering, sorting and pagination"
summary: Ask for exactly the data you need with ?role=editor, _sort, _page and _limit, and read the X-Total-Count header.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // 1. Filter: GET /users?role=editor. Print "editors: " followed by the
      //    names joined with ", ".
      //
      // 2. Count: GET /todos?done=true. Print "done todos: " + the NUMBER of items
      //    (use the .length of the parsed array).
      //
      // 3. Sort: GET /users?_sort=name&_order=desc. Print "last by name: " + the
      //    name of the FIRST user in the answer.
      //
      // 4. Search with URLSearchParams: build the query with
      //    new URLSearchParams({ q: 'london' }) and fetch BASE + '/users?' + params
      //    Print "london: " + the names joined with ", ".
      //
      // 5. Pagination: GET /todos?_page=2&_limit=3. Print
      //    "page 2 of 4 (10 total): 4,5,6"
      //    The 4 and the 10 come from the response headers X-Total-Pages and
      //    X-Total-Count (res.headers.get(...)). The 4,5,6 are the ids of the items.
check:
  output: |
    editors: Grace Hopper, Katherine Johnson
    done todos: 5
    last by name: Linus Torvalds
    london: Ada Lovelace, Alan Turing
    page 2 of 4 (10 total): 4,5,6
  code:
    - { pattern: 'role=editor', message: "Filter with ?role=editor." }
    - { pattern: '_sort=name', message: "Sort with _sort=name." }
    - { pattern: 'URLSearchParams', message: "Build the search query with URLSearchParams." }
    - { pattern: 'headers\.get\(', message: "Read X-Total-Count and X-Total-Pages with res.headers.get(...)." }
hints:
  - "Everything after the ? in a URL is the query string: key=value pairs joined with &. The server uses them to filter (?role=editor), sort (_sort, _order) and slice (_page, _limit). Metadata about the whole result is in response headers."
  - "const res = await fetch(BASE + '/users?role=editor'); const editors = await res.json(); editors.map((u) => u.name).join(', ')   For headers: res.headers.get('X-Total-Count') gives a string."
  - "const res5 = await fetch(BASE + '/todos?_page=2&_limit=3'); const items = await res5.json(); console.log('page 2 of ' + res5.headers.get('X-Total-Pages') + ' (' + res5.headers.get('X-Total-Count') + ' total): ' + items.map((t) => t.id).join(','));"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      const res1 = await fetch(BASE + '/users?role=editor');
      const editors = await res1.json();
      console.log('editors: ' + editors.map((u) => u.name).join(', '));

      const res2 = await fetch(BASE + '/todos?done=true');
      const done = await res2.json();
      console.log('done todos: ' + done.length);

      const res3 = await fetch(BASE + '/users?_sort=name&_order=desc');
      const sorted = await res3.json();
      console.log('last by name: ' + sorted[0].name);

      const params = new URLSearchParams({ q: 'london' });
      const res4 = await fetch(BASE + '/users?' + params);
      const found = await res4.json();
      console.log('london: ' + found.map((u) => u.name).join(', '));

      const res5 = await fetch(BASE + '/todos?_page=2&_limit=3');
      const items = await res5.json();
      console.log(
        'page 2 of ' + res5.headers.get('X-Total-Pages') +
        ' (' + res5.headers.get('X-Total-Count') + ' total): ' +
        items.map((t) => t.id).join(',')
      );
quiz:
  - q: "In https://api.academy.test/users?role=editor&_sort=name, what is the query string?"
    options: ["/users", "role=editor&_sort=name", "https://api.academy.test"]
    answer: 1
  - q: "Why use pagination (_page and _limit) instead of fetching everything?"
    options: ["It makes JSON valid", "Servers refuse to send more than one item", "Big collections would be slow and wasteful to send in one piece"]
    answer: 2
  - q: "Where does this API put the total number of matching items when you ask for a single page?"
    options: ["In the X-Total-Count response header", "In the URL you sent", "In the first item of the array"]
    answer: 0
    explain: "The body holds only the page. Totals are metadata, so they travel in headers."
  - q: "Why build queries with new URLSearchParams({ q: 'new york' }) instead of pasting text into the URL?"
    options: ["It makes the request quicker", "It escapes special characters such as spaces and &", "It turns GET into POST"]
    answer: 1
---

Fetching `/todos` returns all ten todos. A real service might hold ten million, and you rarely want them all. Query strings let you describe *which* items you want, in what order, and how many at a time.

## What is a query string?

It is the part of a URL after the `?`. It holds `key=value` pairs separated by `&`:

```
GET /users?role=editor&_sort=name HTTP/1.1
Host: api.academy.test
```

```
https://api.academy.test/users?role=editor&_sort=name
                              |     |
                              path  query string: role=editor and _sort=name
```

The path says **what** (the users collection). The query string refines **how**: filter, sort, search, slice. It never changes what the URL fundamentally points to, which is why it is used with `GET`.

## The options of this API

| Query | Effect |
| --- | --- |
| `?role=editor` | keep only items whose `role` equals `editor` (any field works: `?done=true`, `?userId=1`) |
| `?q=london` | free-text search over all fields |
| `?_sort=name` | sort by a field (add `&_order=desc` to reverse it) |
| `?_page=2&_limit=3` | take page 2 when pages hold 3 items |

You can combine them: `/todos?done=false&_sort=title&_limit=2`.

## Pagination and headers

Pagination returns a slice. The body contains only that slice, so how do you know how many pages exist? The server tells you in **response headers**:

```
HTTP/1.1 200 OK
Content-Type: application/json
X-Total-Count: 10
X-Page: 2
X-Total-Pages: 4

[{"id":4, ...},{"id":5, ...},{"id":6, ...}]
```

With `fetch`, read headers from `res.headers`:

```js
const res = await fetch(BASE + '/todos?_page=2&_limit=3');
const items = await res.json();
console.log(items.length);                   // prints: 3
console.log(res.headers.get('X-Total-Count')); // prints: 10
```

Header names are case-insensitive, so `x-total-count` works too. Header values are always **strings**: use `Number(res.headers.get('X-Total-Count'))` if you need arithmetic. A header that is missing returns `null`.

## Building queries safely

Gluing strings by hand works for simple values, but breaks when a value contains a space, `&` or `#`. `URLSearchParams` builds a correct query string and escapes everything:

```js
const params = new URLSearchParams({ q: 'new york', _limit: 2 });
console.log(params.toString()); // prints: q=new+york&_limit=2
const res = await fetch(BASE + '/users?' + params);
```

Concatenating an object into a string (`'?' + params`) calls `toString()` automatically.

## Two pagination styles

This API uses **page numbers** (`_page`, `_limit`). Other APIs use an **offset** (`?offset=20&limit=10`) or a **cursor** (`?after=abc123`), which stays correct even when items are added while you page. The idea is the same: ask for a bounded slice, read the totals, ask for the next slice.

> **Watch out:**
> - **Typos in the filter name.** `/users?rol=editor` returns an empty list `[]` rather than an error, because "no user has `rol` equal to editor". Empty results can mean a misspelled key.
> - **Forgetting that header values are strings.** `X-Total-Count + 1` gives `"101"` instead of `11`.
> - **Putting `?` twice.** `/users?role=editor?_sort=name` is one badly formed value. The second separator must be `&`.
> - **Not encoding user input.** A search like `Tom & Jerry` pasted into the URL cuts the query at `&`. Use `URLSearchParams`.
> - **Filtering on the client when the server can do it.** Downloading 10,000 items to find 3 wastes bandwidth.

## Going further

Loop over every page: fetch `/todos?_page=1&_limit=4`, read `X-Total-Pages`, then keep fetching until you have collected all ten todos.

> **Your turn:** do five requests. Filter editors, count the done todos, take the first user of a descending name sort, search for `london` with `URLSearchParams`, and print page 2 of the todos (limit 3) with the totals read from the response headers.
