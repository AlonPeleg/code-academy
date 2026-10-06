---
title: Events and async code
summary: React to things that happen with EventEmitter, and move from callbacks to promises and async/await with util.promisify.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      const EventEmitter = require('events');
      const util = require('util');
      const { setTimeout: sleep } = require('timers/promises');

      // ---------- Part 1: events ----------
      const shop = new EventEmitter();

      // 1. When the 'open' event happens, print "shop is open" - but only the FIRST time.
      // 2. Every time an 'order' event happens, print "order: <qty> x <item>".
      //    The event hands over two values: first the item, then the quantity.

      shop.emit('open');
      shop.emit('open');
      shop.emit('order', 'coffee', 2);
      shop.emit('order', 'bagel', 1);
      console.log('open listeners: ' + shop.listenerCount('open'));
      console.log('order listeners: ' + shop.listenerCount('order'));

      // ---------- Part 2: callbacks, promises, async/await ----------
      // An old-style function: it answers LATER by calling the callback(error, result).
      function loadUser(id, callback) {
        setTimeout(() => {
          if (id === 1) callback(null, { id: 1, name: 'Ada' });
          else if (id === 3) callback(null, { id: 3, name: 'Grace' });
          else callback(new Error('No user ' + id));
        }, 10);
      }

      // Callback style (already written): the answer arrives later, inside the function.
      loadUser(1, (error, user) => {
        console.log('callback user: ' + user.name);
      });
      await sleep(30); // wait so the callback above is finished before we go on

      // 3. Make a promise-returning version of loadUser. Node has a helper in the util module for this.
      const loadUserAsync = null;

      // 4. Use await to get user 1 and print "promise user: " + the name.

      // 5. Loading user 2 fails. Catch the failure with try/catch and print "error: " + the message.

      // 6. Load users 1 and 3 AT THE SAME TIME (not one after the other) and wait for both.
      //    Print "both: Ada, Grace" using the names you receive.
check:
  output: |
    shop is open
    order: 2 x coffee
    order: 1 x bagel
    open listeners: 0
    order listeners: 1
    callback user: Ada
    promise user: Ada
    error: No user 2
    both: Ada, Grace
  code:
    - { pattern: '\.once\s*\(', message: "Use shop.once('open', ...) so the listener runs only the first time." }
    - { pattern: '\.on\s*\(\s*[''"]order', message: "Listen with shop.on('order', (item, qty) => ...)." }
    - { pattern: 'promisify\s*\(\s*loadUser', message: "Convert it with util.promisify(loadUser)." }
    - { pattern: 'Promise\.all', message: "Start both loads together with Promise.all([...])." }
hints:
  - "An EventEmitter has on(name, listener) for every time, once(name, listener) for the first time only, and emit(name, ...values) which calls the listeners with those values. For part 2, util.promisify turns a function that takes a (error, result) callback as its last argument into one that returns a promise."
  - "shop.once('open', () => console.log('shop is open')); shop.on('order', (item, qty) => console.log('order: ' + qty + ' x ' + item)); const loadUserAsync = util.promisify(loadUser); Promise.all([loadUserAsync(1), loadUserAsync(3)]) returns a promise for an array with both users."
  - "const user = await loadUserAsync(1); console.log('promise user: ' + user.name); try { await loadUserAsync(2); } catch (error) { console.log('error: ' + error.message); } const [a, b] = await Promise.all([loadUserAsync(1), loadUserAsync(3)]); console.log('both: ' + a.name + ', ' + b.name);"
solution:
  - name: main.js
    code: |
      const EventEmitter = require('events');
      const util = require('util');
      const { setTimeout: sleep } = require('timers/promises');

      const shop = new EventEmitter();

      shop.once('open', () => console.log('shop is open'));
      shop.on('order', (item, qty) => console.log('order: ' + qty + ' x ' + item));

      shop.emit('open');
      shop.emit('open');
      shop.emit('order', 'coffee', 2);
      shop.emit('order', 'bagel', 1);
      console.log('open listeners: ' + shop.listenerCount('open'));
      console.log('order listeners: ' + shop.listenerCount('order'));

      function loadUser(id, callback) {
        setTimeout(() => {
          if (id === 1) callback(null, { id: 1, name: 'Ada' });
          else if (id === 3) callback(null, { id: 3, name: 'Grace' });
          else callback(new Error('No user ' + id));
        }, 10);
      }

      loadUser(1, (error, user) => {
        console.log('callback user: ' + user.name);
      });
      await sleep(30);

      const loadUserAsync = util.promisify(loadUser);

      const user = await loadUserAsync(1);
      console.log('promise user: ' + user.name);

      try {
        await loadUserAsync(2);
      } catch (error) {
        console.log('error: ' + error.message);
      }

      const [a, b] = await Promise.all([loadUserAsync(1), loadUserAsync(3)]);
      console.log('both: ' + a.name + ', ' + b.name);
quiz:
  - q: "What is the difference between emitter.on('x', fn) and emitter.once('x', fn)?"
    options: ["once runs fn only the first time x is emitted; on runs it every time", "on runs fn only once; once runs it forever", "There is no difference"]
    answer: 0
  - q: "In Node's callback convention, what is the FIRST argument of a callback?"
    options: ["The result", "The error (or null when everything went fine)", "The name of the function"]
    answer: 1
    explain: "Node callbacks are 'error-first': callback(error, result). That is why util.promisify can turn them into promises automatically."
  - q: "What do you get when you write const data = await somePromise inside an async function?"
    options: ["The promise itself", "Nothing, await only pauses", "The value the promise resolves with, after waiting for it"]
    answer: 2
  - q: "Three requests each take 100 ms and do not depend on each other. Which version finishes in about 100 ms?"
    options: ["await Promise.all([a(), b(), c()]);", "await a(); await b(); await c();", "for (const f of [a, b, c]) { await f(); }"]
    answer: 0
    explain: "Promise.all starts all three before waiting. The other two run them one after another, about 300 ms."
---

A web server spends most of its life **waiting**: for a file to be read, for a database to answer, for a request to arrive. Node is built around this. Instead of freezing while it waits, it keeps working on other things and comes back when the answer is ready. In this lesson you learn the two tools Node uses for this: **events** and **asynchronous code**.

## Events: "tell me when it happens"

Many things in Node announce what happens through an **EventEmitter**. You attach a **listener** (a function) to an event name, and later somebody **emits** that event and all listeners run:

```js
const EventEmitter = require('events');

const door = new EventEmitter();

door.on('knock', (who) => console.log(who + ' is at the door'));

door.emit('knock', 'Ada');   // prints: Ada is at the door
door.emit('knock', 'Grace'); // prints: Grace is at the door
```

- `on(name, listener)` runs the listener **every time** the event is emitted.
- `once(name, listener)` runs it only the **first** time and then removes it.
- `emit(name, ...values)` calls the listeners, passing the values as arguments. It returns `true` if there was at least one listener.
- `off(name, listener)` removes a listener, and `listenerCount(name)` tells you how many there are.

Event names are just strings you choose. You will use this idea all the time: an HTTP server emits `'request'`, a stream emits `'data'`, and your own classes can announce their own events by extending `EventEmitter`:

```js
class Timer extends EventEmitter {
  finish() { this.emit('done'); }
}
```

## Async code: three generations

Reading a file or asking a server takes time, so Node functions give you the answer **later**. There are three styles, in the order they were invented.

**1. Callbacks.** You pass a function that Node calls when the work is done. By convention it is **error-first**: `callback(error, result)`.

```js
loadUser(1, (error, user) => {
  if (error) return console.log('failed: ' + error.message);
  console.log(user.name);
});
```

Callbacks work, but when step 2 depends on step 1 and step 3 on step 2, the code drifts to the right in a "pyramid" and error handling is repeated everywhere.

**2. Promises.** A promise is an object that stands for a value that will exist later. You chain `.then(...)` and `.catch(...)`.

**3. async/await.** The same promises, but you write them like normal top-to-bottom code. `await` pauses *this function* until the promise is done and gives you the value. A failure becomes a normal exception that `try/catch` can catch:

```js
try {
  const user = await loadUserAsync(1);
  console.log(user.name);
} catch (error) {
  console.log('failed: ' + error.message);
}
```

In these lessons top-level `await` works in your main file. In your own project it works at the top of an ES module file, and inside any `async function`.

## Turning callbacks into promises

Old Node functions only speak callbacks. `util.promisify` wraps an error-first function so that it returns a promise instead:

```js
const util = require('util');
const loadUserAsync = util.promisify(loadUser);
const user = await loadUserAsync(1);
```

Node already ships promise versions of many modules: `fs.promises.readFile`, and `require('timers/promises')` gives you a `setTimeout` that returns a promise, which makes a handy `sleep`:

```js
const { setTimeout: sleep } = require('timers/promises');
await sleep(100); // wait 100 ms
```

## Doing things at the same time

`await` one thing after another runs them in sequence. When the tasks do not depend on each other, start them together with `Promise.all`, which waits for all of them and gives an array of the results in the same order. It is how a server loads a user and their orders at the same time.

> **Watch out:**
> - **Forgetting `await`.** `const user = loadUserAsync(1)` gives you a Promise object, so `user.name` is `undefined`. Add `await`.
> - **`await` outside an async function.** In a normal function you get `SyntaxError: await is only valid in async functions`. Mark the function `async`.
> - **Passing `promisify` the wrong shape.** It only works for functions whose **last** argument is an error-first callback. `array.map(loadUserAsync)` also breaks: `map` passes the index as a second argument, so write `ids.map((id) => loadUserAsync(id))`.
> - **Emitting `'error'` with no listener.** An `EventEmitter` that emits the special event `'error'` and has no `'error'` listener throws the error and can crash your program. Always add `emitter.on('error', ...)` for emitters that can fail.
> - **Removing a listener that is not the same function.** `off` needs the very same function you gave to `on`, so keep it in a variable instead of writing an inline arrow function.

## Going further

Make `shop` a class that extends `EventEmitter` with a method `order(item, qty)` that emits `'order'`. Then add a second listener that counts the total number of items ordered.

> **Your turn:** in `main.js` attach a `once` listener for `'open'` and an `on` listener for `'order'`, create `loadUserAsync` with `util.promisify(loadUser)`, `await` user 1, catch the failure for user 2, and load users 1 and 3 together with `Promise.all`. Nine lines should print.
