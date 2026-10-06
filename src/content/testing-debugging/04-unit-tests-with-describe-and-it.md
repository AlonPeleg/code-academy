---
title: Unit tests with describe, it and expect
summary: Write and read automatic tests, then fix the code until every test passes.
level: beginner
runner: js
files:
  - name: math.test.js
    code: |
      // This is the TEST file. It runs first and checks the functions in math.js.
      const { add, isEven, clamp } = require("./math");

      describe("add", () => {
        it("adds two positive numbers", () => {
          expect(add(2, 3)).toBe(5);
        });

        it("adds a negative number", () => {
          expect(add(10, -4)).toBe(6);
        });

        // 3. Add your own test here, right after the one above:
        //    name it  "adds zero"  and check that adding 0 to 5 gives 5.
      });

      describe("isEven", () => {
        it("is true for 4", () => {
          expect(isEven(4)).toBe(true);
        });

        it("is false for 7", () => {
          expect(isEven(7)).toBe(false);
        });
      });

      describe("clamp", () => {
        it("keeps a value that is already inside the range", () => {
          expect(clamp(5, 0, 10)).toBe(5);
        });

        it("raises a value that is too small to the minimum", () => {
          expect(clamp(-3, 0, 10)).toBe(0);
        });

        it("lowers a value that is too big to the maximum", () => {
          expect(clamp(42, 0, 10)).toBe(10);
        });
      });
  - name: math.js
    code: |
      // The code under test. Some of these functions have bugs.
      // 1. Read the failing tests in the output, then fix add and isEven.
      // 2. clamp is not finished: make it return min if value is below min,
      //    max if value is above max, and value otherwise.

      function add(a, b) {
        return a - b;
      }

      function isEven(n) {
        return n % 2 === 1;
      }

      function clamp(value, min, max) {
        return value;
      }

      module.exports = { add, isEven, clamp };
check:
  output: |
    add
      ✓ adds two positive numbers
      ✓ adds a negative number
      ✓ adds zero
    isEven
      ✓ is true for 4
      ✓ is false for 7
    clamp
      ✓ keeps a value that is already inside the range
      ✓ raises a value that is too small to the minimum
      ✓ lowers a value that is too big to the maximum

    Tests: 8 passed, 8 total
  code:
    - file: math.test.js
      pattern: 'it\(\s*"adds zero"'
      message: "Add a test named \"adds zero\" to the add suite."
    - file: math.test.js
      pattern: 'add\(\s*5\s*,\s*0\s*\)'
      message: "In your new test, call add(5, 0)."
hints:
  - "Run the tests and read the output: a line starting with a cross shows the failing test, and the lines under it show what was Expected and what was Received. Each failure points to a bug in math.js."
  - "add should use + (it subtracts now). isEven should compare the remainder with 0. clamp can use two if statements. For your test, copy an existing it(...) block, change the name and use expect(add(5, 0)).toBe(5)."
  - "return a + b;   return n % 2 === 0;   if (value < min) return min; if (value > max) return max; return value;   it(\"adds zero\", () => { expect(add(5, 0)).toBe(5); });"
solution:
  - name: math.test.js
    code: |
      const { add, isEven, clamp } = require("./math");

      describe("add", () => {
        it("adds two positive numbers", () => {
          expect(add(2, 3)).toBe(5);
        });

        it("adds a negative number", () => {
          expect(add(10, -4)).toBe(6);
        });

        it("adds zero", () => {
          expect(add(5, 0)).toBe(5);
        });
      });

      describe("isEven", () => {
        it("is true for 4", () => {
          expect(isEven(4)).toBe(true);
        });

        it("is false for 7", () => {
          expect(isEven(7)).toBe(false);
        });
      });

      describe("clamp", () => {
        it("keeps a value that is already inside the range", () => {
          expect(clamp(5, 0, 10)).toBe(5);
        });

        it("raises a value that is too small to the minimum", () => {
          expect(clamp(-3, 0, 10)).toBe(0);
        });

        it("lowers a value that is too big to the maximum", () => {
          expect(clamp(42, 0, 10)).toBe(10);
        });
      });
  - name: math.js
    code: |
      function add(a, b) {
        return a + b;
      }

      function isEven(n) {
        return n % 2 === 0;
      }

      function clamp(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
      }

      module.exports = { add, isEven, clamp };
quiz:
  - q: "In a test, what does expect(add(2, 3)).toBe(5) do?"
    options: ["Prints 5", "Compares the real result of add(2, 3) with the expected value 5 and fails the test if they differ", "Changes add so that it returns 5"]
    answer: 1
  - q: "What is the job of describe(...)?"
    options: ["It groups related tests under a common name", "It runs the code", "It fixes failing tests"]
    answer: 0
  - q: "A test fails and shows Expected: 6 and Received: 14. What do these two values mean?"
    options: ["Expected is what the code returned, Received is what the test wanted", "Expected is what the test wanted, Received is what your code actually returned", "They are both what the code returned, at different times"]
    answer: 1
  - q: "Why are automatic tests useful?"
    options: ["They make the code run faster", "They remove the need to write code", "You can re-check everything in seconds after each change, so you notice when something breaks"]
    answer: 2
---
How do you know your code works? You could run it, look at the output and decide "looks right". That works for one function once, but not for a project with 200 functions that you change every day. **Automatic tests** are small programs that call your code with known inputs and check the results. You run them in a second and instantly learn what broke. In this lesson you will meet the standard way to write them in JavaScript.

## The three words you need

The tests in this course use the same words as **Jest**, the most popular JavaScript test tool:

* `describe("name", () => { ... })` groups related tests (a **suite**).
* `it("does something", () => { ... })` is one **test**: a name in plain English and a function. (`test` is the same as `it`.)
* `expect(actual).toBe(expected)` is an **assertion**: it compares what the code really returned (`actual`) with what you want (`expected`). If they differ, the test fails.

A complete example:

```js
function double(n) {
  return n * 2;
}

describe("double", () => {
  it("doubles a positive number", () => {
    expect(double(4)).toBe(8);
  });
  it("doubles zero", () => {
    expect(double(0)).toBe(0);
  });
});
```

A test **passes** when its function finishes without an assertion failing, and **fails** when an `expect` does not match (or the code throws an error).

## Reading the report

When you press Run, the practice area prints a report in the same style as real test tools:

```text
double
  ✓ doubles a positive number
  ✗ doubles zero
      toBe (Object.is equality)
        Expected: 0
        Received: 1

Tests: 1 failed, 1 passed, 2 total
```

A tick means passed and a cross means failed. Under a failed test you see **Expected** (what the test wanted) and **Received** (what your code actually produced). The last line is the summary. Your goal in this track is nearly always the same: make it say `N passed, N total`.

## Matchers: more than toBe

The part after `expect(...)` is called a **matcher**. A few you will use all the time:

| Matcher | Passes when |
| --- | --- |
| `toBe(5)` | the value is exactly `5` (same as `===`, for numbers, strings, booleans) |
| `toEqual([1, 2])` | objects and arrays have the same content (deep comparison) |
| `toBeTruthy()` / `toBeFalsy()` | the value is truthy or falsy |
| `toContain("cat")` | a string or array includes the item |
| `toBeGreaterThan(3)` | a number is bigger |
| `toThrow()` | a function throws an error |
| `.not.toBe(5)` | the opposite: it must **not** be 5 |

Use `toEqual` for arrays and objects, because `toBe` compares **identity**: `expect([1]).toBe([1])` fails since they are two different arrays.

## Where do tests live?

Real projects keep the code in `math.js` and the tests in `math.test.js`; the test file loads the code with `require("./math")` (or `import`). In this practice area both files are open as tabs: the first tab (the test file) runs, and the report appears in the output. On your own computer you would install Jest (`npm install --save-dev jest`) and run `npx jest`. The rest of the lesson works the same way.

> **Watch out:**
> * **Fixing the test instead of the code.** If a test fails, first ask: is the *code* wrong or is the *test* wrong? A test that matches what you want is the specification; do not change it just to make it green.
> * **Comparing arrays with `toBe`.** Use `toEqual`. The message looks like `Expected: [1, 2] Received: [1, 2]` and is confusing.
> * **Forgetting `module.exports`.** If `math.js` does not export a function, the test fails with `TypeError: add is not a function`.
> * **Tests that always pass.** A test with no `expect` passes even if the code is broken. Every test needs at least one assertion.

> **Your turn:** Run the tests and read the failures. Fix `add` and `isEven` in `math.js`, finish `clamp`, and write one new test named `adds zero` in the `add` suite (right after the existing tests) that checks `add(5, 0)` is `5`. The report must end with `Tests: 8 passed, 8 total`.
