---
title: Test-driven development
summary: "Follow the red, green, refactor cycle: write a failing test first, make it pass with the simplest code, then clean up."
level: intermediate
runner: js
files:
  - name: slugify.test.js
    code: |
      const { slugify } = require("./slugify");

      describe("slugify", () => {
        it("lowercases the text", () => {
          expect(slugify("Hello")).toBe("hello");
        });

        it("replaces spaces with dashes", () => {
          expect(slugify("hello big world")).toBe("hello-big-world");
        });

        it("removes punctuation", () => {
          expect(slugify("Hello, World!")).toBe("hello-world");
        });

        it("collapses repeated separators", () => {
          expect(slugify("a   b -- c")).toBe("a-b-c");
        });

        it("trims dashes from both ends", () => {
          expect(slugify("  --Hi--  ")).toBe("hi");
        });

        it("returns an empty string for an empty string", () => {
          expect(slugify("")).toBe("");
        });

        // RED step for the new feature: replace this todo with a real test.
        // slugify takes an optional second argument, the maximum length of the slug.
        // slugify("hello big world", 10) must give "hello-big" (the dash left at the end of the
        // first 10 characters is removed too).
        it.todo("cuts the slug to maxLength without a trailing dash");
      });
  - name: slugify.js
    code: |
      // Turns a title into a URL-friendly "slug":  "Hello, World!"  ->  "hello-world"
      //
      // The first six tests describe the behaviour. Make them pass one at a time (GREEN),
      // using the simplest code that works. Then write the new test (RED) and make it pass.
      function slugify(text) {
        return text;
      }

      module.exports = { slugify };
check:
  output: |
    slugify
      ✓ lowercases the text
      ✓ replaces spaces with dashes
      ✓ removes punctuation
      ✓ collapses repeated separators
      ✓ trims dashes from both ends
      ✓ returns an empty string for an empty string
      ✓ cuts the slug to maxLength without a trailing dash

    Tests: 7 passed, 7 total
  code:
    - file: slugify.test.js
      pattern: 'it\(\s*"cuts the slug to maxLength without a trailing dash"'
      message: "Replace it.todo with it(...) for the maxLength test."
    - file: slugify.test.js
      pattern: 'slugify\(\s*"hello big world"\s*,\s*10\s*\)'
      message: "The new test should call slugify(\"hello big world\", 10)."
    - file: slugify.js
      pattern: 'maxLength'
      message: "slugify needs a second parameter called maxLength."
hints:
  - "Work on one failing test at a time, with the simplest change. text.toLowerCase() fixes the first test, a regular expression with replace() fixes the next ones."
  - "Replace every run of characters that are not letters or digits with one dash: replace(/[^a-z0-9]+/g, \"-\"). Then remove dashes at the start and the end with another replace and the pattern /^-+|-+$/g. For maxLength, cut with slice(0, maxLength) BEFORE removing the end dashes."
  - "function slugify(text, maxLength) { let slug = text.toLowerCase().replace(/[^a-z0-9]+/g, \"-\"); if (maxLength !== undefined) slug = slug.slice(0, maxLength); return slug.replace(/^-+|-+$/g, \"\"); }   and the test: it(\"cuts the slug to maxLength without a trailing dash\", () => { expect(slugify(\"hello big world\", 10)).toBe(\"hello-big\"); });"
solution:
  - name: slugify.test.js
    code: |
      const { slugify } = require("./slugify");

      describe("slugify", () => {
        it("lowercases the text", () => {
          expect(slugify("Hello")).toBe("hello");
        });

        it("replaces spaces with dashes", () => {
          expect(slugify("hello big world")).toBe("hello-big-world");
        });

        it("removes punctuation", () => {
          expect(slugify("Hello, World!")).toBe("hello-world");
        });

        it("collapses repeated separators", () => {
          expect(slugify("a   b -- c")).toBe("a-b-c");
        });

        it("trims dashes from both ends", () => {
          expect(slugify("  --Hi--  ")).toBe("hi");
        });

        it("returns an empty string for an empty string", () => {
          expect(slugify("")).toBe("");
        });

        it("cuts the slug to maxLength without a trailing dash", () => {
          expect(slugify("hello big world", 10)).toBe("hello-big");
        });
      });
  - name: slugify.js
    code: |
      function slugify(text, maxLength) {
        let slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (maxLength !== undefined) {
          slug = slug.slice(0, maxLength);
        }
        return slug.replace(/^-+|-+$/g, "");
      }

      module.exports = { slugify };
quiz:
  - q: "What is the correct order of the TDD cycle?"
    options: ["Green, red, refactor", "Red (failing test), green (make it pass), refactor (clean up)", "Refactor, red, green"]
    answer: 1
  - q: "Why should you see a new test fail before you write the code?"
    options: ["To prove that the test can actually fail, so a pass later really means something", "Because the code is always wrong at first", "Because Jest requires it"]
    answer: 0
    explain: "A test that has never been red might be checking nothing. Watching it fail first proves it can detect the missing feature."
  - q: "What does the GREEN step ask you to write?"
    options: ["The most beautiful and flexible code you can", "The simplest code that makes the failing test pass", "More tests"]
    answer: 1
  - q: "What is refactoring?"
    options: ["Adding a new feature", "Changing the behaviour so that tests fail", "Improving the structure of the code without changing what it does (the tests prove it)"]
    answer: 2
---
Most people write the code first and the tests afterwards (if at all). **Test-driven development (TDD)** turns that around: you write the test first, watch it fail, and only then write the code that makes it pass. It sounds strange, but it gives you small steps, instant feedback and a safety net, and it forces you to think about *what* the code should do before *how*.

## The cycle: red, green, refactor

1. **Red.** Write one small test for a behaviour that does not exist yet. Run the tests: it must **fail**. (If it passes, the test is useless, or the feature already exists.)
2. **Green.** Write the **simplest** code that makes the test pass. Not the best, not the most general: the simplest. It is fine to be a bit silly, for example returning a fixed value.
3. **Refactor.** With all tests green, clean up: remove duplication, improve names, simplify. Run the tests after every change. If they stay green, you did not break anything.

Then start again with the next test. Each round takes a minute or two.

## A tiny example

We want `isAdult(age)`. Round 1, **red**:

```js
it("is false for a child", () => {
  expect(isAdult(10)).toBe(false);
});
```

It fails because `isAdult` does not exist. **Green**, the simplest code:

```js
function isAdult(age) {
  return false;
}
```

Silly, but green! Round 2, **red** again:

```js
it("is true for an adult", () => {
  expect(isAdult(30)).toBe(true);
});
```

Now the fixed answer is not enough, so we are forced to write the real logic (**green**):

```js
function isAdult(age) {
  return age >= 18;
}
```

A third test for the boundary (`isAdult(18)` is `true`, `isAdult(17)` is `false`) comes next. The tests describe the behaviour one case at a time, and the code grows only as far as the tests demand.

## Why it helps

* **Small steps.** When something breaks, you know it was the last tiny change.
* **Better design.** Code that is easy to test (small functions, clear inputs and outputs) is usually easier to understand too.
* **A safety net.** The finished test suite lets you refactor and add features without fear.
* **Bug fixing.** When you find a bug, first write a test that reproduces it (red), then fix it (green). The bug can never silently return.

TDD is a tool, not a religion. Many developers use it for logic-heavy code (parsers, calculations, validation) and write tests after the fact for glue code. The red-green habit is worth learning either way.

## The exercise: slugify

A **slug** is the URL-friendly form of a title: `"Hello, World!"` becomes `"hello-world"`. You are given six tests, which describe the behaviour, and a function that does nothing yet. Go through them in order like a TDD session: make the first failing test pass with the simplest change, run, then the next, and so on. Useful tools are `toLowerCase()` and `replace()` with a regular expression: `/[^a-z0-9]+/g` matches every run of characters that are not letters or digits.

When all six are green, add a new feature the TDD way. First write the test (red), then the code (green).

> **Watch out:**
> * **Writing a big test first.** A test that needs five features at once cannot go green quickly. Keep each test about one behaviour.
> * **Skipping the red step.** You will sometimes write a test that passes at once. Ask why: is the behaviour already there, or is the test wrong?
> * **Going green by editing the test.** Changing the expected value to match buggy output defeats the purpose.
> * **Forgetting to refactor.** Green code that is full of copy-paste is a debt. Use the safety net and tidy up.
> * **Regex `g` flag.** `replace(/x/, "-")` without `g` replaces only the first match. Use `/x/g` to replace all.

> **Your turn:** Make the six given tests pass in `slugify.js`. Then replace the `it.todo` in `slugify.test.js` with a real test named `cuts the slug to maxLength without a trailing dash` that expects `slugify("hello big world", 10)` to be `"hello-big"` (watch it fail first), and add the optional `maxLength` parameter to `slugify`. The report must end with `Tests: 7 passed, 7 total`.
