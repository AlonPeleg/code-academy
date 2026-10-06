---
title: The event loop in depth
summary: Learn how the call stack, the microtask queue and the task queue decide the order of your code, and use it to keep a long job from freezing everything else.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const events = [];
      const note = (label) => events.push(label);

      // Part 1: a puzzle. Read it carefully, DO NOT run it yet.
      function puzzle() {
        note("A");
        setTimeout(() => note("B"), 0);
        Promise.resolve()
          .then(() => note("C"))
          .then(() => note("D"));
        queueMicrotask(() => note("E"));
        (async () => {
          note("F");
          await null;
          note("G");
        })();
        note("H");
      }

      // 1. Predict the order in which the labels are recorded, then fill in
      //    prediction below, for example ["A", "B", ...]. All eight labels appear once.
      const prediction = [];

      puzzle();
      await new Promise((resolve) => setTimeout(resolve, 20)); // wait until everything has run
      console.log("actual: " + events.join(" "));
      console.log("prediction correct: " + (prediction.join(" ") === events.join(" ")));

      // Part 2: a long job that must not freeze the page.
      // 2. Write tick(): it returns a promise that resolves after a trip through
      //    the TASK queue (a timer with 0 ms), so other waiting tasks get a turn.
      //    Careful: resolving straight away would only use the microtask queue.

      async function processInChunks(items, size) {
        for (let i = 0; i < items.length; i += size) {
          console.log("chunk " + (i / size + 1));
          await tick(); // give other tasks a chance between chunks
        }
        console.log("done");
      }

      setTimeout(() => console.log("timer"), 0); // another task, waiting for its turn
      await processInChunks([1, 2, 3, 4, 5, 6], 2);
check:
  output: |
    actual: A F H C E G D B
    prediction correct: true
    chunk 1
    timer
    chunk 2
    chunk 3
    done
  code:
    - pattern: 'function\s+tick|tick\s*=\s*(\(|async|function)'
      message: "Define tick as a function that returns a promise."
    - pattern: '(function\s+tick|tick\s*=)[\s\S]{0,80}setTimeout'
      message: "tick should resolve its promise from a setTimeout (a task), not a microtask."
hints:
  - "Order of play: first all the synchronous code runs to the end. Then the microtask queue (promise callbacks, queueMicrotask, code after await) is emptied completely. Only then does one timer callback from the task queue run. An async function runs synchronously until its first await."
  - "Synchronous: A, then F (the async function starts running), then H. Next the microtasks in the order they were queued: C, E, G, and D (queued by C finishing) comes last. The timer B is a task, so it is last. For tick: return a promise that you resolve from inside setTimeout."
  - "const prediction = [\"A\", \"F\", \"H\", \"C\", \"E\", \"G\", \"D\", \"B\"];   function tick() { return new Promise((resolve) => setTimeout(resolve, 0)); }"
solution:
  - name: main.js
    code: |
      const events = [];
      const note = (label) => events.push(label);

      function puzzle() {
        note("A");
        setTimeout(() => note("B"), 0);
        Promise.resolve()
          .then(() => note("C"))
          .then(() => note("D"));
        queueMicrotask(() => note("E"));
        (async () => {
          note("F");
          await null;
          note("G");
        })();
        note("H");
      }

      const prediction = ["A", "F", "H", "C", "E", "G", "D", "B"];

      puzzle();
      await new Promise((resolve) => setTimeout(resolve, 20));
      console.log("actual: " + events.join(" "));
      console.log("prediction correct: " + (prediction.join(" ") === events.join(" ")));

      function tick() {
        return new Promise((resolve) => setTimeout(resolve, 0));
      }

      async function processInChunks(items, size) {
        for (let i = 0; i < items.length; i += size) {
          console.log("chunk " + (i / size + 1));
          await tick();
        }
        console.log("done");
      }

      setTimeout(() => console.log("timer"), 0);
      await processInChunks([1, 2, 3, 4, 5, 6], 2);
quiz:
  - q: "Which queue is emptied completely before the next timer callback is allowed to run?"
    options: ["The task (macrotask) queue", "The DOM event queue", "The microtask queue"]
    answer: 2
    explain: After each task, the engine runs every microtask, including new ones queued meanwhile. That is why an endless chain of promises can starve timers.
  - q: What does setTimeout(fn, 0) really mean?
    options: ["Run fn right now", "Run fn later, as a new task, after the current code and all microtasks have finished", "Run fn after exactly 0 milliseconds"]
    answer: 1
  - q: "In  async function f() { console.log(1); await x; console.log(2); }  when does console.log(2) run?"
    options: ["Immediately, in the same step as console.log(1)", "As a microtask, after the awaited promise settles and the current code has finished", "As a task, after all timers"]
    answer: 1
  - q: Why does a heavy for loop of 5 seconds freeze a web page?
    options: ["Loops are always slow in JavaScript", "The browser blocks all scripts for 5 seconds", "While the call stack is busy, the event loop cannot take the next task, such as a click or a repaint"]
    answer: 2
---

JavaScript does one thing at a time, yet it can wait for timers, network answers and clicks without freezing. The secret is the **event loop**. If you understand it, strange bugs like "why did my log appear before the data?" and "why is the page frozen?" stop being mysteries.

## The pieces

- **The call stack.** The pile of functions that are running right now. JavaScript can only run the function on top.
- **Web APIs / the host.** Timers, the network and clicks are handled outside of your code, by the browser (or Node). When they are ready they hand over a callback.
- **The task queue** (also called macrotask queue). Callbacks from `setTimeout`, `setInterval`, clicks and similar events wait here, one task per turn.
- **The microtask queue.** Callbacks of promises (`.then`, `.catch`, `.finally`), `queueMicrotask(fn)` and the code after an `await` wait here. It has **priority** over the task queue.

## The loop, in plain steps

1. Run the current script until the call stack is empty (this itself is one task).
2. Run **all** microtasks, until the microtask queue is completely empty. Microtasks that queue more microtasks are also run now.
3. (A browser may repaint the screen here.)
4. Take **one** task from the task queue and run it. Go back to step 2.

That is all. Everything else is a consequence.

```js
console.log("1 sync");
setTimeout(() => console.log("4 timer"), 0);
Promise.resolve().then(() => console.log("3 microtask"));
console.log("2 sync");
// prints: 1 sync, 2 sync, 3 microtask, 4 timer
```

`setTimeout(fn, 0)` does not mean "now". It means "as a new task, as soon as possible", which is always after the current code **and** all microtasks.

## What about async and await?

An `async` function runs **synchronously** until its first `await`. At the `await`, the rest of the function is scheduled as a microtask for when the awaited promise settles, and the caller continues.

```js
async function f() {
  console.log("a");   // runs immediately when f() is called
  await null;
  console.log("c");   // microtask, later
}
f();
console.log("b");
// prints: a, b, c
```

## Why it matters: blocking and yielding

While your function runs, **nothing else can**: no clicks, no timers, no repaint. A loop that works for five seconds freezes a page for five seconds. The fix is to cut the work into chunks and **yield** between them, which means letting the event loop go around once. Yielding must go through the **task** queue (a `setTimeout`), because microtasks are emptied before any task, so awaiting an already resolved promise gives nobody else a turn. In the exercise you will see this with your own eyes: the waiting "timer" gets its turn right after the first chunk.

> **Watch out:**
> - Assuming `setTimeout(fn, 0)` runs before a promise callback. Promise callbacks win.
> - Writing an endless chain of microtasks (a `then` that always queues another `then`). The task queue never gets a turn, so timers never fire and the page freezes.
> - Believing `await` pauses the whole program. It only pauses the current async function; the rest of the program keeps running.
> - Forgetting that the code before the first `await` of an async function runs synchronously.
> - Relying on exact timer precision. A timer is a minimum delay, not a promise: if the stack is busy, the callback just waits longer.
> - Putting heavy work in an event handler and wondering why the button "does not respond". Split the work or move it to a Web Worker.

## Going further

Predict the output of the puzzle after adding `await null;` one more time inside the async function, or after changing the `setTimeout` delay to `10`. Then run and compare. In Node.js there is also `process.nextTick`, which runs even before promise microtasks.

> **Your turn:** predict the order of the puzzle and fill in `prediction`, then write `tick()` so that the timer gets its turn after the first chunk. The expected output is shown above in the check.
