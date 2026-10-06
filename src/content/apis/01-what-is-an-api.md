---
title: What is an API? HTTP in 5 minutes
summary: Learn how programs talk over the web with requests and responses, and make your first call to the practice server.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // The practice server lives at https://api.academy.test
      // Sending a request: this line is written for you.
      const res = await fetch('https://api.academy.test/');

      // 1. Turn the response body into a JavaScript object: await res.json()
      //    and keep it in a variable called info.

      // 2. Print four lines:
      //      the API's name            (info.name)
      //      "status: " + the status   (res.status)
      //      "REST endpoints: " + how many items are in info.rest
      //      "SOAP endpoints: " + how many items are in info.soap
check:
  output: |
    Academy API
    status: 200
    REST endpoints: 12
    SOAP endpoints: 2
  code:
    - { pattern: 'fetch\(', message: "Use fetch(...) to send the request." }
    - { pattern: '\.json\(\)', message: "Read the body with res.json()." }
    - { pattern: '\.length', message: "Count the endpoints with the .length of the arrays." }
hints:
  - "The response body arrives as text. res.json() reads it and turns it into a JavaScript object, but it takes time, so put await in front of it."
  - "const info = await res.json();   Then console.log(info.name) prints the name. info.rest and info.soap are arrays, and every array has a .length."
  - "const info = await res.json(); console.log(info.name); console.log('status: ' + res.status); console.log('REST endpoints: ' + info.rest.length); console.log('SOAP endpoints: ' + info.soap.length);"
solution:
  - name: main.js
    code: |
      const res = await fetch('https://api.academy.test/');
      const info = await res.json();
      console.log(info.name);
      console.log('status: ' + res.status);
      console.log('REST endpoints: ' + info.rest.length);
      console.log('SOAP endpoints: ' + info.soap.length);
quiz:
  - q: What does API stand for?
    options: ["Application Programming Interface", "Automatic Page Index", "Advanced Protocol Instruction"]
    answer: 0
    explain: "An API is a set of rules that lets one program ask another program for data or actions."
  - q: "In the request line GET /users/3 HTTP/1.1, which part is the method?"
    options: ["/users/3", "GET", "HTTP/1.1"]
    answer: 1
  - q: "A response comes back with status 404. Which family is that?"
    options: ["Success (2xx)", "Server error (5xx)", "Client error (4xx)"]
    answer: 2
    explain: "4xx means the request was wrong or the thing was not found. 5xx means the server itself failed."
  - q: "Which method is meant for reading data without changing anything?"
    options: ["DELETE", "POST", "GET"]
    answer: 2
---

You use APIs all day without noticing. When a weather app shows tomorrow's forecast, it did not invent the numbers: it asked a server somewhere, the server answered, and the app displayed the answer. In this course you will learn to be the app: send requests, read responses, and handle things going wrong.

## What is an API?

An **API** (Application Programming Interface) is a doorway that a program offers to other programs. A **web API** is a doorway you reach over the internet using **HTTP**, the same language your browser speaks when you open a web page. The difference is that a web API usually returns plain data (often **JSON**) instead of a pretty page.

Everything is a conversation of two messages:

1. The **client** (your code) sends a **request**.
2. The **server** sends back a **response**.

That is all. The server never talks first.

## Anatomy of a request

Here is a real HTTP request as text, exactly what travels over the wire:

```
GET /users/3 HTTP/1.1
Host: api.academy.test
Accept: application/json

```

- **Method** (`GET`): what you want to do. `GET` reads, `POST` creates, `PUT` and `PATCH` update, `DELETE` removes.
- **Path** (`/users/3`): which thing you mean. Here, the user with id 3.
- **Headers** (`Host`, `Accept`): extra information, one `Name: value` per line.
- **Body**: optional data you send along (not used by `GET`). Headers and body are separated by an empty line.

A full address like `https://api.academy.test/users/3` is a **URL**. It breaks into parts:

```
https://api.academy.test/users/3?role=admin
|       |                |       |
scheme  host             path    query string
```

## Anatomy of a response

```
HTTP/1.1 200 OK
Content-Type: application/json

{"id":3,"name":"Alan Turing","role":"viewer"}
```

The first line holds the **status code** (`200`) and a short text (`OK`). Then come headers, an empty line, and the **body**.

The status code is a three-digit number, and its first digit tells you the family:

| Code | Family | Meaning |
| --- | --- | --- |
| 2xx | Success | It worked (`200 OK`, `201 Created`, `204 No Content`) |
| 3xx | Redirect / not changed | Look elsewhere, or use your cached copy (`304`) |
| 4xx | Client error | Your request was wrong (`401`, `403`, `404`, `422`) |
| 5xx | Server error | The server failed, not your fault (`500`, `503`) |

## Your first call

JavaScript sends requests with `fetch`. You will study it properly in the next lesson; for now, read this:

```js
const res = await fetch('https://api.academy.test/');
const info = await res.json();
console.log(res.status); // prints: 200
```

- `fetch(url)` sends a `GET` request and gives back a **response** object, but only after the server answers. `await` pauses your code until it does.
- `res.status` is the number from the first line of the response.
- `res.json()` reads the body and parses the JSON text into a normal object. It also takes time, so it also needs `await`.

The practice server at `https://api.academy.test` lives inside this page, so it works offline, always answers the same way, and starts fresh every time you press Run. You cannot break anything.

> **Watch out:**
> - Forgetting `await`: `const res = fetch(...)` stores a *promise*, not a response. Printing `res.status` gives `undefined`, and `res.json()` fails with `TypeError: res.json is not a function`.
> - Using `http://` instead of `https://` for the practice server: the request fails with `TypeError: Failed to fetch: use https:// for api.academy.test`.
> - Calling `res.json()` twice: a body can only be read once. Store the result in a variable and reuse it.
> - Mixing up the status text and the number: compare `res.status === 200`, not the word `"OK"`.

## Going further

Open `https://api.academy.test/` as data: the answer lists every address you will use in this course. Try `await fetch('https://api.academy.test/users')` and print `(await res.json()).length`.

> **Your turn:** the `fetch` line is written for you. Read the body with `res.json()`, then print the API name, the status, and how many REST and SOAP endpoints the server lists, in the four-line format from the starter comments.
