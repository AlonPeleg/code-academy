---
title: "Authentication: hashed passwords and signed tokens"
summary: Store passwords safely with a salted hash, log users in with an HMAC-signed token, and protect routes with auth middleware (401 versus 403).
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const express = require('express');
      const { hashPassword, verifyPassword, signToken, requireAuth, requireRole } = require('./auth');

      const app = express();
      app.use(express.json());

      // Registered users: we store only a salted hash, never the password itself.
      const users = [
        { id: 1, email: 'ada@example.com', role: 'admin', passwordHash: hashPassword('engine123') },
        { id: 2, email: 'grace@example.com', role: 'user', passwordHash: hashPassword('cobol456') },
      ];

      app.post('/login', (req, res) => {
        const { email, password } = req.body;
        const user = users.find((u) => u.email === email);
        if (!user || typeof password !== 'string' || !verifyPassword(password, user.passwordHash)) {
          return res.status(401).json({ error: 'Wrong email or password' });
        }
        const token = signToken({ sub: user.id, role: user.role, exp: Date.now() + 60 * 60 * 1000 });
        res.json({ token });
      });
      app.get('/me', requireAuth, (req, res) => res.json({ id: req.user.sub, role: req.user.role }));
      app.get('/admin', requireAuth, requireRole('admin'), (req, res) => res.json({ secret: 'admin panel' }));

      // ---- test client (already written) ----
      const server = app.listen(3000);
      const BASE = 'http://localhost:3000';

      async function login(email, password) {
        const res = await fetch(BASE + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log('login ' + email + ' -> ' + res.status + (data.token ? ' token received' : ' ' + JSON.stringify(data)));
        return data.token;
      }
      async function get(label, path, token) {
        const res = await fetch(BASE + path, { headers: token ? { Authorization: 'Bearer ' + token } : {} });
        console.log(label + ' -> ' + res.status + ' ' + (await res.text()));
      }

      console.log('same password, different hashes: ' + (hashPassword('pw') !== hashPassword('pw')));
      await login('ada@example.com', 'wrong');
      const adaToken = await login('ada@example.com', 'engine123');
      const graceToken = await login('grace@example.com', 'cobol456');

      await get('no token', '/me');
      await get('ada /me', '/me', adaToken);
      await get('grace /admin', '/admin', graceToken);
      await get('ada /admin', '/admin', adaToken);

      // An attacker edits Grace's payload to say role: admin, but cannot re-sign it.
      const forgedBody = Buffer.from(JSON.stringify({ sub: 2, role: 'admin', exp: Date.now() + 60000 })).toString('base64url');
      await get('forged', '/admin', forgedBody + '.' + graceToken.split('.')[1]);
      await get('expired', '/admin', signToken({ sub: 1, role: 'admin', exp: 1 }));
      server.close();
  - name: auth.js
    code: |
      const crypto = require('crypto');

      const SECRET = 'change-me-in-production'; // in a real app this comes from process.env
      const ITERATIONS = 2000; // real apps use hundreds of thousands (kept small so the practice runs fast)

      // Already written: a random salt plus the PBKDF2 hash, stored as "salt:hash" (hex text).
      function hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256').toString('hex');
        return salt + ':' + hash;
      }

      // 1. verifyPassword(password, stored): split stored at ':' into salt and hash, hash the
      //    attempt with the SAME salt, and compare the two buffers with the timing-safe function.
      //    Return true or false.
      function verifyPassword(password, stored) {
        return false; // TODO
      }

      // Already written: payload -> "base64url(payload).signature"
      function signToken(payload) {
        const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signature = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
        return body + '.' + signature;
      }

      // 2. verifyToken(token): return the payload object, or null when the token is not valid.
      //    - split at '.', recompute the signature of the first part with the same secret
      //    - compare it with the received signature (the lengths must match first, then the timing-safe compare)
      //    - decode the payload: JSON.parse(Buffer.from(body, 'base64url').toString())
      //    - give back null when payload.exp is smaller than Date.now() (expired)
      function verifyToken(token) {
        return null; // TODO
      }

      // 3. requireAuth middleware: read the Authorization header ("Bearer <token>") and verify the token.
      //    No valid token: answer 401 with { error: 'Login required' }.
      //    Otherwise store the payload in req.user and continue.
      function requireAuth(req, res, next) {
        next(); // TODO
      }

      // 4. requireRole(role) returns a middleware: when req.user.role is not the wanted role
      //    answer 403 with { error: 'Forbidden' }, otherwise continue.
      function requireRole(role) {
        return (req, res, next) => {
          next(); // TODO
        };
      }

      module.exports = { hashPassword, verifyPassword, signToken, verifyToken, requireAuth, requireRole };
check:
  output: |
    same password, different hashes: true
    login ada@example.com -> 401 {"error":"Wrong email or password"}
    login ada@example.com -> 200 token received
    login grace@example.com -> 200 token received
    no token -> 401 {"error":"Login required"}
    ada /me -> 200 {"id":1,"role":"admin"}
    grace /admin -> 403 {"error":"Forbidden"}
    ada /admin -> 200 {"secret":"admin panel"}
    forged -> 401 {"error":"Login required"}
    expired -> 401 {"error":"Login required"}
  code:
    - { file: 'auth.js', pattern: 'timingSafeEqual', message: "Compare secrets with crypto.timingSafeEqual, not ===." }
    - { file: 'auth.js', pattern: 'createHmac', message: "Recompute the signature with crypto.createHmac('sha256', SECRET)." }
    - { file: 'auth.js', pattern: 'status\(\s*403\s*\)', message: "requireRole answers 403 Forbidden." }
hints:
  - "A password check never decrypts anything: hash the attempt the same way (same salt, same iterations) and compare the two hashes. A token check works the same way: recompute the signature from the first part with your secret and compare it with the one that arrived."
  - "verifyPassword: const [salt, hash] = stored.split(':'); const attempt = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256'); return crypto.timingSafeEqual(attempt, Buffer.from(hash, 'hex'));   requireAuth: const token = (req.headers.authorization || '').slice(7); const payload = verifyToken(token); if (!payload) return res.status(401).json({ error: 'Login required' }); req.user = payload; next();"
  - "verifyToken: const [body, signature] = token.split('.'); const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url'); const a = Buffer.from(signature), b = Buffer.from(expected); if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null; const payload = JSON.parse(Buffer.from(body, 'base64url').toString()); if (payload.exp < Date.now()) return null; return payload;   requireRole: if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' }); next();"
solution:
  - name: main.js
    code: |
      const express = require('express');
      const { hashPassword, verifyPassword, signToken, requireAuth, requireRole } = require('./auth');

      const app = express();
      app.use(express.json());

      // Registered users: we store only a salted hash, never the password itself.
      const users = [
        { id: 1, email: 'ada@example.com', role: 'admin', passwordHash: hashPassword('engine123') },
        { id: 2, email: 'grace@example.com', role: 'user', passwordHash: hashPassword('cobol456') },
      ];

      app.post('/login', (req, res) => {
        const { email, password } = req.body;
        const user = users.find((u) => u.email === email);
        if (!user || typeof password !== 'string' || !verifyPassword(password, user.passwordHash)) {
          return res.status(401).json({ error: 'Wrong email or password' });
        }
        const token = signToken({ sub: user.id, role: user.role, exp: Date.now() + 60 * 60 * 1000 });
        res.json({ token });
      });
      app.get('/me', requireAuth, (req, res) => res.json({ id: req.user.sub, role: req.user.role }));
      app.get('/admin', requireAuth, requireRole('admin'), (req, res) => res.json({ secret: 'admin panel' }));

      // ---- test client (already written) ----
      const server = app.listen(3000);
      const BASE = 'http://localhost:3000';

      async function login(email, password) {
        const res = await fetch(BASE + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log('login ' + email + ' -> ' + res.status + (data.token ? ' token received' : ' ' + JSON.stringify(data)));
        return data.token;
      }
      async function get(label, path, token) {
        const res = await fetch(BASE + path, { headers: token ? { Authorization: 'Bearer ' + token } : {} });
        console.log(label + ' -> ' + res.status + ' ' + (await res.text()));
      }

      console.log('same password, different hashes: ' + (hashPassword('pw') !== hashPassword('pw')));
      await login('ada@example.com', 'wrong');
      const adaToken = await login('ada@example.com', 'engine123');
      const graceToken = await login('grace@example.com', 'cobol456');

      await get('no token', '/me');
      await get('ada /me', '/me', adaToken);
      await get('grace /admin', '/admin', graceToken);
      await get('ada /admin', '/admin', adaToken);

      // An attacker edits Grace's payload to say role: admin, but cannot re-sign it.
      const forgedBody = Buffer.from(JSON.stringify({ sub: 2, role: 'admin', exp: Date.now() + 60000 })).toString('base64url');
      await get('forged', '/admin', forgedBody + '.' + graceToken.split('.')[1]);
      await get('expired', '/admin', signToken({ sub: 1, role: 'admin', exp: 1 }));
      server.close();
  - name: auth.js
    code: |
      const crypto = require('crypto');

      const SECRET = 'change-me-in-production'; // in a real app this comes from process.env
      const ITERATIONS = 2000; // real apps use hundreds of thousands (kept small so the practice runs fast)

      // Already written: a random salt plus the PBKDF2 hash, stored as "salt:hash" (hex text).
      function hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256').toString('hex');
        return salt + ':' + hash;
      }

      // Hash the attempt with the stored salt and compare in constant time.
      function verifyPassword(password, stored) {
        const [salt, hash] = stored.split(':');
        const attempt = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
        return crypto.timingSafeEqual(attempt, Buffer.from(hash, 'hex'));
      }

      // Already written: payload -> "base64url(payload).signature"
      function signToken(payload) {
        const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signature = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
        return body + '.' + signature;
      }

      // Check the signature, then the expiry. Returns the payload or null.
      function verifyToken(token) {
        if (typeof token !== 'string') return null;
        const [body, signature] = token.split('.');
        if (!body || !signature) return null;
        const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
        if (payload.exp < Date.now()) return null;
        return payload;
      }

      // 401: we do not know who you are.
      function requireAuth(req, res, next) {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : '';
        const payload = verifyToken(token);
        if (!payload) return res.status(401).json({ error: 'Login required' });
        req.user = payload;
        next();
      }

      // 403: we know you, but you may not do this.
      function requireRole(role) {
        return (req, res, next) => {
          if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
          next();
        };
      }

      module.exports = { hashPassword, verifyPassword, signToken, verifyToken, requireAuth, requireRole };
quiz:
  - q: "Why do we hash passwords with a random salt?"
    options: ["So the same password gives a different hash for each user, which defeats precomputed lookup tables", "So the password can be decrypted later", "To make the hash shorter"]
    answer: 0
    explain: "The salt is not secret; it is stored next to the hash. Its job is to make every hash unique."
  - q: "A user is logged in as a normal user and opens /admin. Which status is correct?"
    options: ["401 Unauthorized", "404 Not Found", "403 Forbidden"]
    answer: 2
    explain: "401 means we do not know who you are (missing or invalid token). 403 means we know you, but you are not allowed."
  - q: "An attacker changes the role inside a token payload. Why does the server notice?"
    options: ["The payload is encrypted, so it cannot be edited", "The signature was made with the secret over the original payload, and no longer matches", "Tokens cannot be edited in a browser"]
    answer: 1
    explain: "A signed token is readable by anyone but cannot be changed without the secret. That is why you must never put secrets inside it."
  - q: "Why does the login route answer 'Wrong email or password' for both an unknown email and a wrong password?"
    options: ["To save code", "So attackers cannot find out which emails are registered", "Because Express cannot tell them apart"]
    answer: 1
---
Almost every real app has users, and users mean secrets: passwords and proof that someone is logged in. This is the lesson where mistakes become expensive, so we will do it the careful way using only the `crypto` module that comes with Node.

## Never store passwords

If your database leaks (it happens to big companies), every plain password leaks with it, and people reuse passwords. So you store a **hash** instead: a one-way fingerprint. The same input always gives the same output, but you cannot go backwards from the hash to the password. To check a login you hash what the user typed and compare the two hashes.

A plain `sha256('engine123')` is not enough: identical passwords give identical hashes, and attackers have giant tables of hashes of common passwords. Two fixes:

- A **salt**: random bytes mixed into the hash, stored next to it. Two users with the same password get different hashes, so lookup tables are useless.
- A **slow** hash: `pbkdf2Sync(password, salt, iterations, keylength, 'sha256')` repeats the work `iterations` times. That costs you a few milliseconds per login but costs an attacker millions of guesses. Here we use 2000 so the practice is quick; real apps use hundreds of thousands, or the newer `scrypt` / bcrypt / argon2.

```js
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync('engine123', salt, 2000, 32, 'sha256').toString('hex');
const stored = salt + ':' + hash;   // this is what goes in the database
```

To verify, split `stored`, hash the attempt with the same salt and compare with `crypto.timingSafeEqual(a, b)`. A normal `===` stops at the first different character, and the tiny timing difference can leak information; `timingSafeEqual` always takes the same time (it needs two buffers of equal length, so convert with `Buffer.from(hash, 'hex')`).

## Proving you are logged in: signed tokens

After a successful login the server hands out a **token** that the client sends with every request (`Authorization: Bearer <token>`, as in the APIs track). Our token has two parts:

```
base64url(payload) . signature
{"sub":1,"role":"admin","exp":1767225600000}
```

The **payload** says who you are (`sub` = subject, the user id), your role and when the token expires (`exp`). The **signature** is `HMAC-SHA256(payload, SECRET)`: a fingerprint that only someone who knows the secret can produce. When a token comes back, the server recomputes the signature. If a single character of the payload was changed, the signatures differ and the token is rejected. This is exactly the idea behind JWT (JSON Web Tokens); in a real project you would use a library such as `jsonwebtoken`, but now you know what it does.

Important: a signed token is **not encrypted**. Anyone can decode the payload with base64, so never put passwords or private data into it. The signature only guarantees that it was not modified. Keep `SECRET` out of your code in a real app (next lesson: environment variables), and give tokens an expiry so a stolen one stops working.

## Middleware that guards routes

Now the middleware from lesson 8 shines. `requireAuth` runs before the handler, verifies the token and stores the result for the routes behind it:

```js
app.get('/me', requireAuth, (req, res) => res.json({ id: req.user.sub }));
```

`requireRole('admin')` is a **factory**: a function that returns a middleware. Chain them: `app.get('/admin', requireAuth, requireRole('admin'), handler)`. The order decides which error you get:

| Situation | Status |
| --- | --- |
| No token, broken token, wrong signature, expired | `401` (log in again) |
| Valid token but the role is not allowed | `403` (logging in again will not help) |

> **Watch out:**
> - **Comparing hashes with `===`.** It works, but leaks timing. Use `crypto.timingSafeEqual`, and check `a.length === b.length` first, otherwise it throws `RangeError: Input buffers must have the same byte length`.
> - **Telling the attacker too much.** `"No user with that email"` versus `"Wrong password"` reveals which emails exist. Answer the same generic message for both.
> - **Reading the payload before checking the signature.** Always verify first; the payload of an unverified token is just attacker-controlled text.
> - **Forgetting the expiry check.** Without `exp` a leaked token works forever.
> - **Sending anything over plain `http://`.** Tokens and passwords must travel over HTTPS in production.

## Going further

Add `POST /register` that validates the email and password length, stores `hashPassword(password)` and answers `201`. Then give `signToken` a shorter lifetime and add a `/refresh` route that issues a new token for a valid one.

> **Your turn:** in `auth.js` write `verifyPassword`, `verifyToken`, `requireAuth` and `requireRole`. `main.js` registers two users, logs them in, and then tries a missing token, a normal user on `/admin`, a forged token and an expired token.
