---
title: "Authentication: logging in and Bearer tokens"
summary: Log in to get a token, send it in the Authorization header, and tell 401 (who are you?) from 403 (not allowed).
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // 1. GET /me WITHOUT a token. Print "without token: " + the status (401).

      // 2. Write async function login(email, password):
      //      POST /login with a JSON body { email, password } (method, Content-Type, JSON.stringify)
      //      and return the token string from the reply ({ token, expiresIn }).
      //    Log in as ada@example.com / engine123 and print "token: " + the token.

      // 3. GET /me with that token in a header named Authorization whose value is
      //    "Bearer " followed by the token. Print "me: Ada Lovelace (admin)"
      //    using the name and role of the returned user.

      // 4. GET /admin/stats with the same token. Print "stats: " + JSON.stringify(of the reply).

      // 5. Log in as grace@example.com / cobol456 and call /admin/stats with HER token.
      //    Print "grace: " + status + " " + the error message from the body.
check:
  output: |
    without token: 401
    token: token-ada
    me: Ada Lovelace (admin)
    stats: {"users":5,"todos":10,"posts":6}
    grace: 403 Only admins can see this
  code:
    - { pattern: 'Authorization', message: "Send the token in an Authorization header." }
    - { pattern: 'Bearer', message: "The Authorization value is 'Bearer ' followed by the token." }
    - { pattern: 'method\s*:\s*[''"]POST[''"]', message: "Log in with method: 'POST'." }
    - { pattern: 'application/json', message: "Set Content-Type: application/json for the login body." }
hints:
  - "Logging in is a POST with JSON credentials; the answer contains a token. Afterwards, every protected request carries that token in the Authorization header, written as the word Bearer, a space, then the token."
  - "async function login(email, password) { const res = await fetch(BASE + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const data = await res.json(); return data.token; }   Protected call: fetch(BASE + '/me', { headers: { Authorization: 'Bearer ' + token } })"
  - "const res = await fetch(BASE + '/admin/stats', { headers: { Authorization: 'Bearer ' + graceToken } }); const body = await res.json(); console.log('grace: ' + res.status + ' ' + body.error);"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      const anonymous = await fetch(BASE + '/me');
      console.log('without token: ' + anonymous.status);

      async function login(email, password) {
        const res = await fetch(BASE + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        return data.token;
      }

      const token = await login('ada@example.com', 'engine123');
      console.log('token: ' + token);

      const meRes = await fetch(BASE + '/me', {
        headers: { Authorization: 'Bearer ' + token },
      });
      const me = await meRes.json();
      console.log('me: ' + me.name + ' (' + me.role + ')');

      const statsRes = await fetch(BASE + '/admin/stats', {
        headers: { Authorization: 'Bearer ' + token },
      });
      console.log('stats: ' + JSON.stringify(await statsRes.json()));

      const graceToken = await login('grace@example.com', 'cobol456');
      const denied = await fetch(BASE + '/admin/stats', {
        headers: { Authorization: 'Bearer ' + graceToken },
      });
      const deniedBody = await denied.json();
      console.log('grace: ' + denied.status + ' ' + deniedBody.error);
quiz:
  - q: "What is the difference between 401 and 403?"
    options: ["401 means the server crashed, 403 means not found", "401 means the server does not know who you are; 403 means it knows you but you may not do this", "They are the same, just different numbers"]
    answer: 1
  - q: "Which header value is correct for a token abc123?"
    options: ["Authorization: Token=abc123", "Authorization: abc123 Bearer", "Authorization: Bearer abc123"]
    answer: 2
  - q: "Why is it a bad idea to send a password with every request?"
    options: ["Passwords are too long for headers", "The more often a secret travels, the more chances to leak it; a token can expire or be revoked", "Servers refuse passwords in headers"]
    answer: 1
  - q: "Where do you pass the token with fetch?"
    options: ["In the headers option of the second argument", "In the URL path", "In the response"]
    answer: 0
---

Many APIs only talk to people they know. To use them you must prove who you are, and the server then decides what you may do. This lesson covers the most common pattern on the modern web: log in once, receive a **token**, and send it with every later request.

## The login flow

```
1. You   -> POST /login  {"email":"ada@example.com","password":"engine123"}
2. Server -> 200 OK      {"token":"token-ada","expiresIn":3600}

3. You   -> GET /me      Authorization: Bearer token-ada
4. Server -> 200 OK      {"id":1,"name":"Ada Lovelace","role":"admin", ...}
```

The password travels once. The server answers with a **token**, a long random-looking string that stands for "this person, for the next hour" (`expiresIn` is in seconds). From now on you send the token instead of the password. If it leaks or expires, only the token has to be replaced.

## The Authorization header

The standard place for credentials is the `Authorization` header. The most common scheme is **Bearer**, which means "whoever bears (holds) this token":

```
GET /me HTTP/1.1
Host: api.academy.test
Authorization: Bearer token-ada
```

In code:

```js
const res = await fetch(BASE + '/me', {
  headers: { Authorization: 'Bearer ' + token },
});
```

Note the space after `Bearer`. Everything the server needs is in that one header, which is why tokens are called **stateless**: the server does not need a session open for you.

## Logging in with fetch

A login is just a `POST` with a JSON body (you practised this in lesson 5):

```js
async function login(email, password) {
  const res = await fetch(BASE + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return data.token;
}
```

Wrong credentials give `401` with the body `{ "error": "Wrong email or password" }`. Practice accounts: `ada@example.com` / `engine123` (an admin) and `grace@example.com` / `cobol456` (an editor).

## 401 versus 403

These two are easily mixed up, and the difference matters:

| Status | Plain English | Typical fix |
| --- | --- | --- |
| **401 Unauthorized** | "I do not know who you are." Token missing, invalid or expired. | Log in (again) |
| **403 Forbidden** | "I know who you are, and the answer is no." | Use an account with permission, or give up |

The server often adds a `WWW-Authenticate: Bearer` response header on a `401`, a hint about which scheme to use. Try it on `/me` without a token: `res.headers.get('WWW-Authenticate')`.

The endpoint `/admin/stats` shows both: no token gives `401`, Grace's token gives `403` (`Only admins can see this`), and Ada's token gives the numbers.

## Keeping secrets safe

Real tokens are secrets, so treat them like passwords:

- Always use `https://`, never `http://`, so nobody can read the header on the way.
- Never print tokens in logs shared with others, never commit them to a repository.
- Prefer short-lived tokens, and ask for a new one when you get a `401`.
- Never put a token in the URL: URLs are stored in logs and browser history.

> **Watch out:**
> - **Writing the header without `Bearer `.** `Authorization: token-ada` yields `401 Missing token` style errors, because the server cannot find the scheme.
> - **Forgetting the space** (`'Bearer' + token` gives `Bearertoken-ada`) or adding extra quotes around the token.
> - **Forgetting `Content-Type` on the login request.** The server cannot read your credentials and answers `415`.
> - **Confusing `401` and `403`.** Re-logging in fixes a `401`, but never a `403`: the account simply lacks the right.
> - **Hard-coding a token** that later expires. Fetch a fresh one with `login()` when needed.

## Going further

Try a wrong password and print the status and error. Then call `/me` with the made-up token `Bearer nonsense` and compare its message with the one for a missing token.

> **Your turn:** call `/me` without a token, write a `login(email, password)` function, use Ada's token on `/me` and `/admin/stats`, and then show that Grace's token gets a `403` from `/admin/stats`.
