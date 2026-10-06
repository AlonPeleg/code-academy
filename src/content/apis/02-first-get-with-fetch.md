---
title: Your first GET with fetch
summary: Fetch a list and a single item, read res.status, parse JSON and loop over the results with async/await.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // 1. GET the list of users: fetch(BASE + '/users')  (remember await)
      // 2. Parse it with res.json() and print how many users there are, like "5 users".
      // 3. Loop over the users and print one line each: "1: Ada Lovelace (admin)"
      //    which is id, colon, name, then the role in brackets.
      // 4. GET a single user: BASE + '/users/3'. Print "Alan Turing lives in London"
      //    using the name and city fields of that user.
check:
  output: |
    5 users
    1: Ada Lovelace (admin)
    2: Grace Hopper (editor)
    3: Alan Turing (viewer)
    4: Katherine Johnson (editor)
    5: Linus Torvalds (viewer)
    Alan Turing lives in London
  code:
    - { pattern: 'await\s+fetch\(', message: "Use await fetch(...) to send the request." }
    - { pattern: '\.json\(\)', message: "Parse the body with res.json()." }
    - { pattern: 'for\s*\(', message: "Use a for loop to print the users." }
    - { pattern: 'users/3', message: "Fetch the single user at /users/3." }
hints:
  - "Each request needs two awaits: one for fetch (the response arrives) and one for res.json() (the body is parsed). Then the result is a normal JavaScript array you can loop over."
  - "const res = await fetch(BASE + '/users'); const users = await res.json(); console.log(users.length + ' users'); for (const user of users) { ... }  For the single user, fetch BASE + '/users/3' the same way."
  - "for (const u of users) { console.log(u.id + ': ' + u.name + ' (' + u.role + ')'); }  const res3 = await fetch(BASE + '/users/3'); const alan = await res3.json(); console.log(alan.name + ' lives in ' + alan.city);"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      const res = await fetch(BASE + '/users');
      const users = await res.json();
      console.log(users.length + ' users');
      for (const user of users) {
        console.log(user.id + ': ' + user.name + ' (' + user.role + ')');
      }

      const res3 = await fetch(BASE + '/users/3');
      const alan = await res3.json();
      console.log(alan.name + ' lives in ' + alan.city);
quiz:
  - q: "What does await do in front of fetch(url)?"
    options: ["It pauses this function until the server answers", "It makes the request faster", "It converts the response to JSON"]
    answer: 0
  - q: "You write const data = res.json(); and print data.length. What do you get?"
    options: ["The number of items", "undefined, because data is a promise", "An error saying fetch is not defined"]
    answer: 1
    explain: "res.json() returns a promise. Without await you hold the promise, not the parsed data."
  - q: "Which URL fetches only the user with id 3?"
    options: ["https://api.academy.test/users?3", "https://api.academy.test/3/users", "https://api.academy.test/users/3"]
    answer: 2
  - q: "Where in a response do you read the status number?"
    options: ["res.status", "res.json().status", "res.body.code"]
    answer: 0
---

In this lesson you will request real data from a server and use it. `fetch` is the built-in JavaScript function for sending HTTP requests, and together with `async`/`await` it turns a network conversation into ordinary-looking code.

## fetch in three steps

```js
const BASE = 'https://api.academy.test';

const res = await fetch(BASE + '/users');  // 1. send the request, wait for the response
console.log(res.status);                   // prints: 200
const users = await res.json();            // 2. read the body and parse the JSON
console.log(users.length);                 // 3. use the data, prints: 5
```

What happens behind the scenes:

```
Your code                               Server
   | GET /users HTTP/1.1                   |
   |-------------------------------------->|
   |                                       |   looks up the users
   |       HTTP/1.1 200 OK                 |
   |<--------------------------------------|
   |       [{"id":1,"name":"Ada ..."}, ...]|
```

### Why two awaits?

`fetch` resolves as soon as the response **headers** arrive. The body may still be streaming, so reading it (`res.json()`) is a second asynchronous step. Both return **promises**, and `await` unwraps a promise into its value. Top-level `await` works in this course's editor, but inside a normal function you must declare it `async`:

```js
async function loadUsers() {
  const res = await fetch(BASE + '/users');
  return await res.json();
}
const users = await loadUsers();
```

### JSON becomes objects and arrays

The server sends text such as `[{"id":1,"name":"Ada Lovelace"}]`. `res.json()` turns that into a real JavaScript array of objects, so you can loop, filter and read fields with dots:

```js
for (const user of users) {
  console.log(user.name);   // Ada Lovelace, Grace Hopper, ...
}
```

### One item or a list?

REST APIs follow a pattern you will see again and again:

| URL | Returns |
| --- | --- |
| `/users` | the whole **collection** (an array) |
| `/users/3` | **one item** (an object) |
| `/users/3/todos` | the todos that belong to user 3 (an array) |

So `await (await fetch(BASE + '/users/3')).json()` gives one object like `{ id: 3, name: "Alan Turing", email: "alan@example.com", role: "viewer", city: "London" }`.

### Reading what came back

A response carries more than the body. Two properties you will use constantly:

```js
console.log(res.status);                          // 200
console.log(res.headers.get('content-type'));     // application/json; charset=utf-8
```

The status says whether the request worked (the next lesson is all about this), and the `Content-Type` header says what format the body is in. When it says `application/json`, `res.json()` is the right way to read it.

### Combining requests

Because each request is just an `await`, you can use the answer of one request to build the next:

```js
const users = await (await fetch(BASE + '/users')).json();
const first = users[0];
const todosRes = await fetch(BASE + '/users/' + first.id + '/todos');
const todos = await todosRes.json();
console.log(first.name + ' has ' + todos.length + ' todos'); // Ada Lovelace has 3 todos
```

Notice how the id from the first answer goes straight into the second URL. This "follow the links" style is how most apps work.

You may also see the older style with `.then`:

```js
fetch(BASE + '/users/3').then((res) => res.json()).then((user) => console.log(user.name));
```

It does the same thing. `await` is just easier to read, and it is what we use here.

> **Watch out:**
> - **Forgetting `await`.** `const res = fetch(...)` holds a promise. `res.status` is `undefined` and `res.json()` throws `TypeError: res.json is not a function`.
> - **Skipping the second `await`.** `const users = res.json()` gives a promise, so `users.length` is `undefined` and `for (const u of users)` fails with `TypeError: users is not iterable`.
> - **Using `fetch` with a relative path** such as `fetch('/users')`. Always give the full address `https://api.academy.test/users`.
> - **Misspelled fields.** `user.Name` is `undefined` because JSON keys are case-sensitive. Print the whole object with `console.log(user)` to see the real keys.

## Going further

Print `res.headers.get('content-type')` to see how the server labels its answer. Then fetch `/users/3/todos` and print the titles of Alan's todos.

> **Your turn:** fetch `/users`, print the count, then one line per user in the form `1: Ada Lovelace (admin)`. Finally fetch `/users/3` and print `Alan Turing lives in London` using the fields of the returned object.
