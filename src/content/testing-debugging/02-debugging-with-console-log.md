---
title: Debugging with console.log
summary: Find bugs by looking inside your program with labelled logs, then narrow the search down step by step.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // Three small functions, and each one has a bug.
      // Use console.log inside the functions to look at the values, find each bug and fix it.
      // When everything works, REMOVE your debugging logs so only the 3 final lines are printed.

      // Bug 1: the average should be 6 (not NaN)
      function sum(numbers) {
        let total = 0;
        for (let i = 0; i <= numbers.length; i++) {
          total += numbers[i];
        }
        return total;
      }
      function average(numbers) {
        return sum(numbers) / numbers.length;
      }

      // Bug 2: the biggest of -5, -2 and -9 should be -2 (not 0)
      function maxOf(numbers) {
        let max = 0;
        for (const n of numbers) {
          if (n > max) max = n;
        }
        return max;
      }

      // Bug 3: 500 cents should print as $5.00 (not $5)
      function formatPrice(cents) {
        return "$" + cents / 100;
      }

      console.log(average([4, 8, 6]));
      console.log(maxOf([-5, -2, -9]));
      console.log(formatPrice(500));
check:
  output: |
    6
    -2
    $5.00
  code:
    - pattern: 'toFixed\s*\('
      message: "Use toFixed(2) so the price always has two decimals."
hints:
  - "Print the values the code is working with. In the first function, log i and numbers[i] inside the loop and look at the LAST value of i. What does numbers[i] give when i is too big?"
  - "Bug 1: the loop runs one time too many (numbers[3] is undefined, and adding undefined gives NaN), so change <= to <. Bug 2: starting max at 0 is wrong when every number is negative, so start from the first element. Bug 3: a number has a method that fixes the number of decimals."
  - "for (let i = 0; i < numbers.length; i++)    let max = numbers[0];    return \"$\" + (cents / 100).toFixed(2);"
solution:
  - name: main.js
    code: |
      function sum(numbers) {
        let total = 0;
        for (let i = 0; i < numbers.length; i++) {
          total += numbers[i];
        }
        return total;
      }
      function average(numbers) {
        return sum(numbers) / numbers.length;
      }

      function maxOf(numbers) {
        let max = numbers[0];
        for (const n of numbers) {
          if (n > max) max = n;
        }
        return max;
      }

      function formatPrice(cents) {
        return "$" + (cents / 100).toFixed(2);
      }

      console.log(average([4, 8, 6]));
      console.log(maxOf([-5, -2, -9]));
      console.log(formatPrice(500));
quiz:
  - q: "Why is console.log(\"total:\", total) usually better than console.log(total)?"
    options: ["The label tells you which log line you are reading when there are many", "It runs faster", "It fixes the bug automatically"]
    answer: 0
  - q: "What is the idea of bisecting when you hunt for a bug?"
    options: ["Delete half of the program and hope", "Check the value in the middle of the code to learn which half contains the bug, then repeat", "Rewrite the whole program"]
    answer: 1
    explain: "Each check cuts the search area in half, so even a long program needs only a few checks."
  - q: "You add a console.log and it never prints. What is the most useful conclusion?"
    options: ["console.log is broken", "The bug is fixed", "That line of code never ran, so find out why execution did not get there"]
    answer: 2
  - q: "Which statement about console.error is true?"
    options: ["It stops the program", "It prints to the error stream, which is shown as an error and is not normal output", "It is the same as throw"]
    answer: 1
    explain: "console.error does not stop anything. It just marks the message as an error, which is handy to separate debug noise from real output."
---
When code does not do what you expected, guessing is slow. **Debugging** means finding out what is *really* happening inside your program, then fixing the difference between what you expected and what you got. The simplest and most universal tool is `console.log`: it lets you look at a value at any moment. In this lesson you will learn how to use it well.

## Make your logs readable

A log with only a value is hard to read once there are several of them:

```js
const total = 12;
console.log(total);              // prints: 12      (which total? where?)
console.log("total:", total);    // prints: total: 12
console.log(`i=${3} total=${total}`);   // prints: i=3 total=12
```

Always add a **label**. If you want to see a whole object or array, print it directly (`console.log("user:", user)`) or, for an exact view of strings, use `JSON.stringify(value)`. That helps to spot invisible things such as extra spaces: `"abc "` and `"abc"` look the same without quotes.

You can also print the **type** of a value, which is a very common source of surprises:

```js
const input = "5";
console.log(typeof input, input + 1);   // prints: string 51   (text, not a number!)
```

## A debugging routine that works

1. **Reproduce** the bug with the smallest input that shows it (`average([4, 8, 6])`).
2. **Say what you expect**, out loud or in a comment: "I expect 6, I get NaN".
3. **Look inside** with logs at the start of the function, inside loops and just before `return`.
4. **Bisect**: if the program is long, log a value in the *middle*. If it is already wrong there, the bug is in the first half; if it is still right, it is in the second half. Repeat until you have found one line.
5. **Fix one thing**, run again, and compare with what you expected.
6. **Remove** the debugging logs (or turn them into proper tests, which you will learn soon).

Example. Why does this print `NaN`?

```js
function sum(numbers) {
  let total = 0;
  for (let i = 0; i <= numbers.length; i++) {
    console.log("i:", i, "value:", numbers[i], "total:", total);
    total += numbers[i];
  }
  return total;
}
sum([4, 8, 6]);
// prints: i: 0 value: 4 total: 0
// prints: i: 1 value: 8 total: 4
// prints: i: 2 value: 6 total: 12
// prints: i: 3 value: undefined total: 18
```

The last line reveals it: `numbers[3]` is `undefined`, because the list has only indexes 0, 1 and 2. Adding `undefined` to a number gives `NaN`. The loop ran one time too many, and the fix is `i < numbers.length`. We found a bug with four lines of output and no guessing.

## Other helpful tools

* `console.error("message")` and `console.warn("message")` mark a message as an error or warning. The practice area shows them separately from normal output, and the checker only compares **normal** output. That makes them handy for debug messages you do not want in the result.
* `console.table(arrayOfObjects)` draws a table in the browser's DevTools console and in real Node. It is great for lists of records. The practice console here only shows plain text, so use it on your own computer.
* **Rubber duck debugging:** explain your code line by line to a rubber duck (or a friend, or a notes file). Very often you spot the mistake yourself while explaining, because you are forced to say what each line *really* does instead of what you *meant*.
* The `debugger;` statement pauses the program when the browser DevTools are open, so you can step through the code line by line.

> **Watch out:**
> * **Logging the wrong thing.** If a log prints `[object Object]`, you joined an object into a string. Use a comma: `console.log("user:", user)`, not `"user: " + user`.
> * **Forgetting to remove logs.** Debug logs left in the code make the output wrong, and in a real app they leak information. Search for `console.log` before you finish.
> * **Changing five things at once.** Then you do not know which change fixed (or broke) the program. Change one thing per run.
> * **Trusting your memory.** "That variable is surely 5." Print it. The bug is usually exactly where you were sure it could not be.

> **Your turn:** Three functions have one bug each. Use labelled `console.log` calls to see the values, fix `sum`, `maxOf` and `formatPrice`, and then remove your debugging logs so that only the three final lines are printed: `6`, `-2` and `$5.00`.
