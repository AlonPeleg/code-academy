---
title: Waiting - timers, promises and async/await
summary: Run code later, and write code that waits without freezing everything.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      // 1. Write wait(ms): it returns a Promise that resolves after ms milliseconds
      //    (create it with the Promise constructor and use a timer inside)

      // 2. Write async function countdown().
      //    A loop counts i from 3 down to 1: print i, then wait 100 ms.
      //    After the loop print "Liftoff!"


      console.log("start");
      setTimeout(() => console.log("timeout fired"), 50);
      await countdown();
      console.log("end");

check:
  output: |
    start
    3
    timeout fired
    2
    1
    Liftoff!
    end
  code:
    - pattern: "new\\s+Promise\\("
      message: "Create the promise with new Promise(...)."
    - pattern: "async\\s+function\\s+countdown"
      message: "Declare countdown as an async function."
    - pattern: "await\\s+wait\\("
      message: "Use await wait(100) inside countdown."
hints:
  - "A Promise is a value that arrives later. wait(ms) should return one that is fulfilled by a timer. Inside an async function, the keyword await pauses until a promise is done."
  - "function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }  Then make countdown async, and write await wait(100) inside the loop."
  - "async function countdown() { for (let i = 3; i >= 1; i--) { console.log(i); await wait(100); } console.log(\"Liftoff!\"); }"
solution:
  - code: |
      function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      async function countdown() {
        for (let i = 3; i >= 1; i--) {
          console.log(i);
          await wait(100);
        }
        console.log("Liftoff!");
      }

      console.log("start");
      setTimeout(() => console.log("timeout fired"), 50);
      await countdown();
      console.log("end");
quiz:
  - q: What does  setTimeout(fn, 1000)  do?
    options: ["Stops the program for one second", "Runs fn once, after about 1000 milliseconds", "Runs fn every second"]
    answer: 1
  - q: What does the await keyword do?
    options: ["Deletes a promise", "Makes a function run faster", "Pauses an async function until the promise is done"]
    answer: 2
  - q: Where can you normally use await?
    options: ["Inside a function marked async", "Only inside loops", "Anywhere, in any function"]
    answer: 0
    explain: In this editor top-level await also works, as it does in modern JavaScript modules.
  - q: In  console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");  what order is printed?
    options: ["B, A, C", "A, C, B", "A, B, C"]
    answer: 1
    explain: Even with 0 milliseconds, the timer callback waits until the current code has finished.
---

Some things take time: loading data from the internet, waiting for a click, or simply pausing for a second. JavaScript does not stop and wait. Instead it says "do this later" and carries on with other work. This lesson introduces **timers**, **promises** and **async/await**.

## Running code later: setTimeout

`setTimeout` takes a function and a delay in **milliseconds** (1000 ms is one second). It runs the function once, after the delay:

```js
console.log("A");
setTimeout(() => console.log("B"), 1000);
console.log("C");
// prints: A, C, and a second later: B
```

JavaScript does not freeze for a second. It schedules the function, moves on and prints `C` straight away. Even `setTimeout(fn, 0)` runs after the current code has finished. A similar tool is `setInterval(fn, ms)`, which repeats until you stop it with `clearInterval`.

## Promises

A **Promise** is an object that stands for a value that is not ready yet. It is always in one of three states: *pending*, *fulfilled* (success) or *rejected* (failure). You make one with a function that receives `resolve`, which you call when the work is done:

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms); // call resolve after ms milliseconds
  });
}
```

You can react with `.then`:

```js
wait(500).then(() => console.log("half a second passed"));
```

## async and await

Chains of `.then` get messy. **async/await** lets you write waiting code that reads from top to bottom like normal code.

```js
async function demo() {
  console.log("one");
  await wait(500);    // pause HERE, but do not block the rest of the program
  console.log("two");
}
```

- A function marked `async` always returns a promise.
- Inside it, `await somePromise` pauses that function until the promise is fulfilled, then gives you its value.
- Other code keeps running while the function waits.

To call an async function and wait for it to finish, use `await demo();` from another async function. In this editor (and in modern JavaScript modules) you may also use `await` directly at the top of your file.

## Handling failures

A promise can be **rejected**. With `await`, use the `try/catch` you learned in the last lesson:

```js
async function load() {
  try {
    await Promise.reject(new Error("no network"));
  } catch (error) {
    console.log("Failed: " + error.message);
  }
}
```

Real-life promises come from tools like `fetch("https://...")`, which downloads data. The pattern is the same: `const response = await fetch(url);`.

## Order of events

The order in the exercise is interesting. The timeout of 50 ms is scheduled first, then the countdown prints `3` and waits 100 ms. The 50 ms timer fires during that wait, so `timeout fired` appears between `3` and `2`.

> **Watch out:**
> - Forgetting `await`: `wait(100);` alone does not pause anything, because it just creates a promise. You must write `await wait(100);`.
> - Using `await` in a function that is not `async`: `SyntaxError: await is only valid in async functions and the top level bodies of modules`.
> - Passing the result of a call instead of a function: `setTimeout(console.log("hi"), 1000)` prints "hi" right away. Write `setTimeout(() => console.log("hi"), 1000)`.
> - Expecting code after `setTimeout` to wait. Only the function inside it runs later.
> - Mixing up units: the delay is in milliseconds, so `5` is almost no time at all.
> - An unhandled rejected promise shows in red as `Unhandled promise rejection`. Add `try/catch` or `.catch`.

## Going further

Make the countdown start at 5, with `wait(500)` between numbers. Run two waits at the same time with `await Promise.all([wait(100), wait(200)])`.

> **Your turn:** write `wait(ms)` and the async `countdown()` so the program prints the seven lines in the right order.
