---
title: Test design and edge cases
summary: Write tests with the arrange-act-assert pattern, cover edge cases and let your tests find real bugs.
level: intermediate
runner: js
files:
  - name: stats.test.js
    code: |
      const { median } = require("./stats");

      describe("median", () => {
        // A finished example, written with Arrange / Act / Assert:
        it("returns the middle value for an odd count", () => {
          // Arrange: the input
          const numbers = [3, 1, 2];
          // Act: call the code
          const result = median(numbers);
          // Assert: check the result
          expect(result).toBe(2);
        });

        // Your turn: replace each it.todo(...) with a real test of the same name.
        // 1. Four numbers: [4, 1, 3, 2] give 2.5 (the average of the two middle values)
        it.todo("averages the two middle values for an even count");

        // 2. [10, 9, 1] give 9 (sorted by number value 1, 9, 10, the middle is 9)
        it.todo("sorts by number value, not as text");

        // 3. After calling median on an array, the array must still be in its ORIGINAL order
        it.todo("does not change the original array");

        // 4. An empty array is a mistake: the function must throw
        it.todo("throws for an empty array");
      });
  - name: stats.js
    code: |
      // The code under test. When your new tests fail, find out why and fix median.
      function median(numbers) {
        if (numbers.length === 0) {
          throw new Error("median needs at least one number");
        }
        numbers.sort();
        const mid = Math.floor(numbers.length / 2);
        if (numbers.length % 2 === 1) {
          return numbers[mid];
        }
        return (numbers[mid - 1] + numbers[mid]) / 2;
      }

      module.exports = { median };
check:
  output: |
    median
      ✓ returns the middle value for an odd count
      ✓ averages the two middle values for an even count
      ✓ sorts by number value, not as text
      ✓ does not change the original array
      ✓ throws for an empty array

    Tests: 5 passed, 5 total
  code:
    - file: stats.test.js
      pattern: 'toThrow'
      message: "Test the empty array with expect(() => median([])).toThrow()."
    - file: stats.test.js
      pattern: 'toEqual\('
      message: "Use toEqual to compare the array with its original content."
    - file: stats.test.js
      pattern: 'it\(\s*"sorts by number value'
      message: "Replace it.todo with it(...) for the sorting test."
    - file: stats.js
      pattern: '\[\s*\.\.\.numbers\s*\]|numbers\.slice\(|Array\.from\(numbers'
      message: "median should work on a COPY of the array, so the original is not changed."
hints:
  - "Copy the finished example: arrange the input, act by calling median, assert with expect. For the empty array, wrap the call in a function: expect(() => median([])).toThrow()."
  - "Two of your tests will fail, and that is the point: they found real bugs. numbers.sort() with no argument compares items as TEXT (so 10 comes before 9) and it also changes the original array. Sort a copy with a compare function."
  - "const sorted = [...numbers].sort((a, b) => a - b);  then use sorted instead of numbers. Tests: expect(median([4, 1, 3, 2])).toBe(2.5);  expect(median([10, 9, 1])).toBe(9);  const original = [3, 1, 2]; median(original); expect(original).toEqual([3, 1, 2]);"
solution:
  - name: stats.test.js
    code: |
      const { median } = require("./stats");

      describe("median", () => {
        it("returns the middle value for an odd count", () => {
          const numbers = [3, 1, 2];
          const result = median(numbers);
          expect(result).toBe(2);
        });

        it("averages the two middle values for an even count", () => {
          const result = median([4, 1, 3, 2]);
          expect(result).toBe(2.5);
        });

        it("sorts by number value, not as text", () => {
          const result = median([10, 9, 1]);
          expect(result).toBe(9);
        });

        it("does not change the original array", () => {
          const original = [3, 1, 2];
          median(original);
          expect(original).toEqual([3, 1, 2]);
        });

        it("throws for an empty array", () => {
          expect(() => median([])).toThrow();
        });
      });
  - name: stats.js
    code: |
      function median(numbers) {
        if (numbers.length === 0) {
          throw new Error("median needs at least one number");
        }
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 1) {
          return sorted[mid];
        }
        return (sorted[mid - 1] + sorted[mid]) / 2;
      }

      module.exports = { median };
quiz:
  - q: "What do the three parts of Arrange, Act, Assert stand for?"
    options: ["Set up the input, run the code, check the result", "Write the code, fix the code, delete the code", "Read, write, execute"]
    answer: 0
  - q: "Which of these is an edge case for a function that finds the largest number in an array?"
    options: ["An array like [3, 7, 5]", "An empty array, or an array where every number is negative", "A very long variable name"]
    answer: 1
    explain: "Edge cases are inputs at the borders of what the function accepts: empty, one item, zero, negative, very large, wrong type."
  - q: "Why is it better to have several small tests than one big test with many expect lines?"
    options: ["It is shorter to write", "Jest requires it", "When one fails, its name tells you exactly which behaviour is broken"]
    answer: 2
  - q: "How do you test that a function throws an error?"
    options: ["expect(() => median([])).toThrow()", "expect(median([])).toThrow()", "try { median([]) } and hope"]
    answer: 0
    explain: "toThrow needs a FUNCTION to call itself, inside its own try/catch. If you call median([]) directly, the error happens before expect even starts."
---
A test that only checks the "happy path" (the normal, friendly input) is like testing a car only on a straight, empty road. Most bugs hide at the **edges**: empty lists, zero, negative numbers, repeated values. In this lesson you will learn how to design good tests, not just write them, and you will see tests catch two real bugs.

## One idea per test

Give every test **one reason to fail**, and a name that says what the behaviour is. Compare:

```js
it("works", () => { ... 12 expect lines ... });                 // which part broke?
it("averages the two middle values for an even count", ...);    // clear!
```

When a test fails, its name should tell you what is broken before you even read the code. A good name is a sentence: "does X when Y".

## Arrange, Act, Assert

Most tests have three parts, in this order:

```js
it("adds an item to the cart", () => {
  // Arrange: create what you need
  const cart = [];
  // Act: do the one thing you are testing
  cart.push("apple");
  // Assert: check the outcome
  expect(cart).toEqual(["apple"]);
});
```

Keeping these parts separate (even with blank lines) makes tests easy to read. If the *Act* part has three different calls, you are probably testing three things.

## Think of edge cases

For every function, run through this checklist and write a test for each one that makes sense:

* **Empty:** `""`, `[]`, `{}`, `0`.
* **One item**, and **two items** (loops often break on the first or last round).
* **Boundaries:** if the limit is 10, test 9, 10 and 11.
* **Negative or huge numbers**, decimals.
* **Wrong input:** `null`, `undefined`, the wrong type. Decide what should happen (an error, a default) and test that.
* **Side effects:** does the function change the data you gave it? A function that sorts "its input" in place can surprise the caller.

The median function in this lesson looks fine for `[3, 1, 2]`, but the edge cases reveal two bugs. Can you spot them before you run the tests? `[10, 9, 1].sort()` gives `[1, 10, 9]`, because without a compare function `sort` turns items into **text** (and `"10"` comes before `"9"`). And `sort` changes the array that was passed in, which is nasty for the caller.

## Testing for errors

If the right behaviour is to throw, test it. You must give `expect` a **function** so that the matcher can call it safely:

```js
expect(() => median([])).toThrow();                  // any error
expect(() => median([])).toThrow("at least one");    // message contains this text
```

## Many cases, one test body

When you have a list of inputs and results, `it.each` avoids repeating yourself:

```js
it.each([
  [[1], 1],
  [[1, 3], 2],
  [[5, 1, 3], 3],
])("median of %s", (numbers, expected) => {
  expect(median(numbers)).toBe(expected);
});
```

Each row becomes its own test. Use it when the cases are "same shape, different data".

> **Watch out:**
> * **Calling the function inside `expect` for errors.** `expect(median([])).toThrow()` fails with the original error, because `median([])` already ran and threw before `expect` could do anything.
> * **Floating-point numbers.** `0.1 + 0.2` is `0.30000000000000004`. Use `toBeCloseTo(0.3)` instead of `toBe(0.3)`.
> * **Tests that depend on each other.** Each test must create its own data. If a test only passes after another test ran first, a change in the order breaks everything.
> * **Copying the implementation into the test.** If the test computes the expected value with the same logic as the code, it cannot catch a mistake in that logic. Write the expected value by hand.

> **Your turn:** Replace the four `it.todo(...)` lines in `stats.test.js` with real tests (same names). Some of them will fail: they found bugs in `stats.js`. Fix `median` (sort a copy with a compare function) until the report says `Tests: 5 passed, 5 total`.
