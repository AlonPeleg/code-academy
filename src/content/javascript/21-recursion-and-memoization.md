---
title: Recursion and memoization
summary: Solve problems by having a function call itself, then make slow recursive code fast by remembering results.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      // 1. Write factorial(n) recursively: factorial(0) is 1, otherwise n times factorial of the number below.
      console.log(factorial(5));
      console.log(factorial(0));

      // The slow version: it recomputes the same values again and again.
      let naiveCalls = 0;
      function fibNaive(n) {
        naiveCalls++;
        return n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2);
      }
      console.log(fibNaive(20) + " " + naiveCalls);

      // 2. Write memoize(fn): it returns a new function that remembers results
      //    in a Map, so fn only runs the first time for each argument.
      let memoCalls = 0;
      const fib = memoize((n) => {
        memoCalls++;
        return n < 2 ? n : fib(n - 1) + fib(n - 2);
      });
      console.log(fib(20) + " " + memoCalls);
      console.log(fib(50));

      // 3. Write flatten(list): turn a nested array of any depth into a flat one.
      //    Use Array.isArray to detect nested arrays and call flatten again for them.
      console.log(flatten([1, [2, [3, [4]], 5]]).join(","));
check:
  output: |
    120
    1
    6765 21891
    6765 21
    12586269025
    1,2,3,4,5
  code:
    - pattern: 'factorial\s*\(\s*n\s*-\s*1\s*\)'
      message: "factorial must call itself with a smaller number: factorial(n - 1)."
    - pattern: 'new\s+Map\s*\('
      message: "Remember the results in a Map."
    - pattern: 'Array\.isArray\s*\('
      message: "Use Array.isArray(item) to detect nested lists."
    - pattern: 'flatten\s*\(\s*(item|x|el|element|value|v|child)\b'
      message: "flatten must call itself for nested arrays."
hints:
  - "Every recursive function needs a base case (where it stops) and a recursive case (where it calls itself on a smaller problem). Memoizing means: look in a cache first, only compute when the value is missing, then store the result."
  - "factorial: if (n <= 1) return 1; return n * factorial(n - 1);   memoize: const cache = new Map(); return (n) => { if (cache.has(n)) return cache.get(n); const result = fn(n); cache.set(n, result); return result; }"
  - "function flatten(list) { const out = []; for (const item of list) { if (Array.isArray(item)) out.push(...flatten(item)); else out.push(item); } return out; }"
solution:
  - name: main.js
    code: |
      function factorial(n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
      }
      console.log(factorial(5));
      console.log(factorial(0));

      let naiveCalls = 0;
      function fibNaive(n) {
        naiveCalls++;
        return n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2);
      }
      console.log(fibNaive(20) + " " + naiveCalls);

      function memoize(fn) {
        const cache = new Map();
        return (n) => {
          if (cache.has(n)) return cache.get(n);
          const result = fn(n);
          cache.set(n, result);
          return result;
        };
      }
      let memoCalls = 0;
      const fib = memoize((n) => {
        memoCalls++;
        return n < 2 ? n : fib(n - 1) + fib(n - 2);
      });
      console.log(fib(20) + " " + memoCalls);
      console.log(fib(50));

      function flatten(list) {
        const out = [];
        for (const item of list) {
          if (Array.isArray(item)) {
            out.push(...flatten(item));
          } else {
            out.push(item);
          }
        }
        return out;
      }
      console.log(flatten([1, [2, [3, [4]], 5]]).join(","));
quiz:
  - q: What is a base case?
    options: ["The input that makes the function call itself", "The first line of any function", "The input for which the function returns an answer directly, without calling itself"]
    answer: 2
  - q: "What happens if a recursive function has no base case?"
    options: ["It calls itself until the stack overflows with a RangeError", "It returns undefined", "JavaScript silently stops after 100 calls"]
    answer: 0
  - q: Why is fibNaive(20) so slow compared to the memoized version?
    options: ["Recursion is always slow", "It recomputes the same sub-problems thousands of times", "Because it uses numbers"]
    answer: 1
    explain: fibNaive(20) makes 21891 calls. With a cache each value is computed once, so only 21 calls are needed.
  - q: What kinds of functions are safe to memoize?
    options: ["Any function at all", "Functions that read the current time", "Pure functions, which always return the same result for the same input"]
    answer: 2
---

A **recursive** function is a function that calls itself. It sounds like a trick, but it is the natural way to handle anything that has a nested or repeating shape: folders inside folders, comments with replies, a tree of menus, a list inside a list. In this lesson you will learn how to write recursion safely, and then how **memoization** turns an unusably slow recursive function into a fast one.

## The two parts of recursion

Every correct recursive function has:

1. A **base case**: an input simple enough to answer directly. This is where the calls stop.
2. A **recursive case**: the function calls itself with a *smaller* version of the problem and combines the result.

```js
function factorial(n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // recursive case
}
console.log(factorial(5)); // prints: 120
```

The call `factorial(3)` waits for `factorial(2)`, which waits for `factorial(1)`, which returns `1` straight away. Then the answers flow back: `2 * 1`, then `3 * 2`. Each waiting call is kept on the **call stack**, JavaScript's pile of unfinished work.

If you forget the base case, or the input never gets smaller, the stack fills up and JavaScript stops you: `RangeError: Maximum call stack size exceeded`. Typical limits are around ten thousand calls, so do not use recursion to repeat something a million times (use a loop for that).

## Recursion on nested data

Recursion shines when the data is nested to an unknown depth. To flatten `[1, [2, [3]]]` you cannot know how many levels to unwrap, but a function can handle one level and trust itself with the rest:

```js
function flatten(list) {
  const out = [];
  for (const item of list) {
    if (Array.isArray(item)) out.push(...flatten(item)); // go deeper
    else out.push(item);                                 // a plain value
  }
  return out;
}
```

`Array.isArray(item)` tells nested lists from plain values, and `...` (spread) pours the flattened inner result into `out`. (The built-in `list.flat(Infinity)` does this too.)

## When recursion repeats itself: Fibonacci

The Fibonacci numbers are defined recursively: each is the sum of the two before it.

```js
function fibNaive(n) {
  return n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2);
}
```

It is correct but terribly slow. `fibNaive(5)` calls `fibNaive(3)` twice and `fibNaive(2)` three times, and the waste snowballs: `fibNaive(20)` makes 21,891 calls and `fibNaive(40)` more than 300 million.

## Memoization

**Memoization** means remembering the answer for each input, so each distinct problem is solved only once. We can write it once, as a **higher-order function** that wraps any function:

```js
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (cache.has(n)) return cache.get(n);  // seen before: reuse
    const result = fn(n);                   // new: compute
    cache.set(n, result);                   // and remember
    return result;
  };
}
```

The returned arrow function **closes over** `cache` (remember closures from earlier), so the cache survives between calls. Wrap the Fibonacci logic and make sure the recursive calls go through the memoized version:

```js
const fib = memoize((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
```

Now `fib(20)` needs only 21 calls and `fib(50)` is instant: `12586269025`. This idea, solving each sub-problem once and storing it, is the heart of an important technique called **dynamic programming**.

Memoization only works for **pure** functions, those whose result depends only on their inputs. Caching a function that reads the clock or random numbers would return stale answers. Also remember that a cache grows forever unless you limit it.

> **Watch out:**
> - No base case or a base case that is never reached: `RangeError: Maximum call stack size exceeded`.
> - Calling the recursion with the same input, like `factorial(n)` instead of `factorial(n - 1)`. The problem must shrink.
> - Memoizing but calling the *original* function recursively. In the exercise the inner calls must use `fib`, the wrapped version; otherwise nothing is cached.
> - Using `n * factorial(n - 1)` with a negative number. With `if (n === 0)` as the base case it would never stop. `n <= 1` is safer.
> - Using a Map keyed by an array or object argument: `cache.get([1, 2])` never finds an earlier entry, because each array is a different object. Turn the arguments into a string key, for example `JSON.stringify(args)`.
> - Using recursion for a plain counting job. A `for` loop is simpler and cannot overflow the stack.

## Going further

Make `memoize` accept functions with any number of arguments using `(...args)` and `JSON.stringify(args)` as the key. Then write a recursive `sumDigits(n)` and a recursive `countDown(n)` that prints from `n` to 1.

> **Your turn:** write `factorial` (with a base case), `memoize` (with a Map cache), and a recursive `flatten`, so the six lines print as shown.
