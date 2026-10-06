---
title: Your first web server with http
summary: Build a server from scratch with the built-in http module - read req.method and req.url, send status codes, headers and JSON, and call it with fetch.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const http = require('http');

      // The request handler runs once for every request that arrives.
      //   req.method  -> 'GET', 'POST', ...
      //   req.url     -> '/', '/api/hello', ...
      //   res         -> the answer you send back
      const server = http.createServer((req, res) => {
        // 1. GET /           -> status 200, Content-Type text/plain, body: Welcome to my server
        // 2. GET /api/hello  -> status 200, Content-Type application/json, body: the JSON text of { message: 'Hello from Node' }
        // 3. POST /api/echo  -> collect the body (it arrives in pieces), parse it as JSON and answer
        //                       with status 201 and the JSON text of { received: <the parsed body> }
        // 4. anything else   -> status 404, Content-Type text/plain, body: Not found: <method> <url>

        // For now every request gets the same answer (delete this line when you are done).
        res.end('not implemented yet');
      });

      // Start the server and wait until it is listening on port 3000.
      await new Promise((resolve) => server.listen(3000, resolve));

      // ---- The code below is a "browser": it calls your server with fetch. Do not change it. ----
      let response = await fetch('http://localhost:3000/');
      console.log(response.status + ' ' + response.headers.get('content-type') + ' ' + (await response.text()));

      response = await fetch('http://localhost:3000/api/hello');
      console.log(response.status + ' ' + response.headers.get('content-type') + ' ' + (await response.text()));

      response = await fetch('http://localhost:3000/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ada' }),
      });
      console.log(response.status + ' ' + (await response.text()));

      response = await fetch('http://localhost:3000/nothing');
      console.log(response.status + ' ' + (await response.text()));

      server.close();
check:
  output: |
    200 text/plain Welcome to my server
    200 application/json {"message":"Hello from Node"}
    201 {"received":{"name":"Ada"}}
    404 Not found: GET /nothing
  code:
    - { pattern: 'res\.end\s*\(', message: "Finish every answer with res.end(...)." }
    - { pattern: 'writeHead|statusCode', message: "Set the status with res.writeHead(code, headers) or res.statusCode." }
    - { pattern: 'req\.on\(\s*[''"]data', message: "Collect the body with req.on('data', ...)." }
    - { pattern: 'req\.on\(\s*[''"]end', message: "Answer in req.on('end', ...) when the whole body has arrived." }
    - { pattern: 'JSON\.parse', message: "Turn the body text into an object with JSON.parse." }
hints:
  - "Branch on req.method and req.url with if / else if / else. In every branch you must send an answer: res.writeHead(status, { 'Content-Type': '...' }) sets the status code and headers, and res.end(text) sends the body and finishes the response."
  - "For the POST route the body arrives in chunks: let body = ''; req.on('data', (chunk) => { body += chunk; }); req.on('end', () => { ...parse body and reply here... }); The reply must be written inside the 'end' callback."
  - "if (req.method === 'POST' && req.url === '/api/echo') { let body = ''; req.on('data', (chunk) => { body += chunk; }); req.on('end', () => { res.writeHead(201, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ received: JSON.parse(body) })); }); }"
solution:
  - name: main.js
    code: |
      const http = require('http');

      const server = http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/') {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Welcome to my server');
        } else if (req.method === 'GET' && req.url === '/api/hello') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Hello from Node' }));
        } else if (req.method === 'POST' && req.url === '/api/echo') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            const received = JSON.parse(body);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ received }));
          });
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not found: ' + req.method + ' ' + req.url);
        }
      });

      await new Promise((resolve) => server.listen(3000, resolve));

      let response = await fetch('http://localhost:3000/');
      console.log(response.status + ' ' + response.headers.get('content-type') + ' ' + (await response.text()));

      response = await fetch('http://localhost:3000/api/hello');
      console.log(response.status + ' ' + response.headers.get('content-type') + ' ' + (await response.text()));

      response = await fetch('http://localhost:3000/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ada' }),
      });
      console.log(response.status + ' ' + (await response.text()));

      response = await fetch('http://localhost:3000/nothing');
      console.log(response.status + ' ' + (await response.text()));

      server.close();
quiz:
  - q: "What does a function passed to http.createServer receive each time?"
    options: ["The port number", "A request object (req) and a response object (res)", "Only the URL as text"]
    answer: 1
  - q: "What happens if your handler never calls res.end()?"
    options: ["The browser shows an empty page at once", "Node ends the response for you", "The client keeps waiting for an answer that never finishes"]
    answer: 2
    explain: "Until res.end() is called the response is not complete. The caller (here fetch) just hangs."
  - q: "Why is the body of a POST request read with req.on('data') and req.on('end')?"
    options: ["It arrives in pieces (chunks) and you must wait for the last one", "Because POST bodies are always encrypted", "Because req.body is created by the browser"]
    answer: 0
  - q: "Which status code should a server send when the URL does not match any route?"
    options: ["200", "404", "201"]
    answer: 1
---

Every website and every API is, at its heart, a program that waits for requests and sends back responses. Node has this built in. In this lesson you write a complete web server with nothing but the `http` module, so you understand what frameworks like Express do for you in the next lessons.

## Request in, response out

HTTP is a conversation. The client (a browser, or `fetch`) sends a **request**: a method (`GET`, `POST`, ...), a path (`/api/hello`), headers, and sometimes a body. The server sends a **response**: a status code (`200`, `404`, ...), headers, and a body.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello!');
});

server.listen(3000, () => console.log('Listening on port 3000'));
```

Piece by piece:

- `http.createServer(handler)` makes a server. The `handler` function runs **once per request**.
- `req` describes the incoming request: `req.method` and `req.url` (the path plus the query string, such as `/search?q=node`).
- `res` is how you answer. `res.writeHead(status, headers)` sets the status code and headers, `res.end(body)` sends the body and **finishes** the response. You can also set `res.statusCode = 404` and `res.setHeader(name, value)` separately.
- `server.listen(3000, callback)` starts waiting for requests on **port 3000** and calls the callback when ready. A port is like a door number on your computer; one program per port.

## Routing by hand

A server usually does different things for different URLs. The simplest way is to look at the method and the path:

```js
if (req.method === 'GET' && req.url === '/') {
  // the home page
} else if (req.method === 'GET' && req.url === '/api/hello') {
  // the API
} else {
  // nothing matched: 404 Not Found
}
```

The query string is part of `req.url`. To split `/search?q=node` into a path and its parts, use the `URL` class: `const url = new URL(req.url, 'http://localhost'); url.pathname; url.searchParams.get('q');`. Express will do this for you.

## Sending JSON

An API sends data as JSON. Convert the object to text with `JSON.stringify`, and say what you are sending with the `Content-Type` header so clients know how to read it:

```js
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ message: 'Hello from Node' }));
```

## Reading a request body

A POST request carries data in its body, and Node gives it to you **in chunks** through events (you met events in the last lesson). Collect the chunks, and only when the `'end'` event fires do you have the whole text:

```js
let body = '';
req.on('data', (chunk) => { body += chunk; });
req.on('end', () => {
  const data = JSON.parse(body);
  // now answer using data
});
```

Writing this for every route is tedious, which is exactly why Express (next lesson) exists.

## Testing your own server

In real life you test a server from the browser address bar, from `curl`, or from code. Here the practice environment lets your program call itself: while the server is listening on port 3000, `fetch('http://localhost:3000/...')` reaches it. `localhost` always means "this computer". Always call `server.close()` when the demo is over; a real server keeps running until you stop it with Ctrl+C.

> **Watch out:**
> - **Never calling `res.end()`.** The client waits forever, because the response is never finished. Every branch of your handler must end the response, including the `404` branch.
> - **Answering twice.** Calling `res.end()` twice (or writing headers after the body was sent) fails with `ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client`. Use `else if` and `return` to make sure only one branch runs.
> - **Answering outside the `'end'` callback.** For a POST route, reply inside `req.on('end', ...)`. If you answer earlier the body is not complete yet.
> - **`JSON.parse` of bad input.** A client that sends broken JSON makes `JSON.parse` throw `SyntaxError: Unexpected token`. Real servers wrap it in `try/catch` and reply `400`. The error handling lesson covers this.
> - **`EADDRINUSE`.** Starting two servers on the same port fails with `Error: listen EADDRINUSE: address already in use :::3000`. Close the first server or pick another port.

## Going further

Add a route `GET /api/time` that answers with the length of `req.url` and the method, or return `405 Method Not Allowed` when the path is right but the method is wrong (for example `DELETE /`).

> **Your turn:** replace the placeholder answer in the handler. Serve `GET /` as plain text, `GET /api/hello` as JSON, `POST /api/echo` (read the body and answer with status `201`), and send a `404` text for everything else. The four lines below the server are a ready-made "browser" that prints what it receives.
