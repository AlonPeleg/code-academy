---
title: Making decisions
summary: Use if / else to run different code.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // Return "cold" below 10, "warm" below 25, otherwise "hot"
      function describeTemp(temp) {

      }

      console.log(describeTemp(5));
      console.log(describeTemp(18));
      console.log(describeTemp(31));
check:
  output: |
    cold
    warm
    hot
hints:
  - "The function must choose between three answers based on the number it receives. That is a job for an if statement with extra branches."
  - "Check the smallest case first with if (temp < 10), then chain else if (temp < 25), and finish with a plain else. Each branch should return a word."
  - "if (temp < 10) { return \"cold\"; } else if (temp < 25) { return \"warm\"; } else { return \"hot\"; }"
solution:
  - code: |
      function describeTemp(temp) {
        if (temp < 10) {
          return "cold";
        } else if (temp < 25) {
          return "warm";
        } else {
          return "hot";
        }
      }

      console.log(describeTemp(5));
      console.log(describeTemp(18));
      console.log(describeTemp(31));
quiz:
  - q: What does  3 === "3"  evaluate to?
    options: ["true", "an error", "false"]
    answer: 2
    explain: "=== compares value AND type. A number is not equal to a string."
  - q: Which operator means AND?
    options: ["||", "&&", "!"]
    answer: 1
  - q: When does the else block run?
    options: ["When the if condition is false", "Always", "Never"]
    answer: 0
  - q: 'Given  if (n > 5) {...} else if (n > 1) {...}  what runs when n is 8?'
    options: ["Only the else if block", "Both blocks", "Only the first block"]
    answer: 2
    explain: Once a branch is true, the rest of the chain is skipped.
---

Programs get interesting when they can **decide**. With an `if` statement, your code can take different paths depending on the situation: show a warning only if the battery is low, or print a different greeting at night.

## The if statement

```js
const age = 20;

if (age >= 18) {
  console.log("Adult");
}
```

- `if` starts the decision.
- The **condition** goes in parentheses. It must be something that is `true` or `false`.
- The code in `{ }` runs **only if** the condition is true.

## else

`else` gives a second path for when the condition is false:

```js
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
// prints: Adult
```

## else if

To check several things in order, chain with `else if`. JavaScript tests from the top and runs the **first** branch whose condition is true, then skips the rest:

```js
if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else {
  console.log("Try again");
}
```

Because the order matters, check the most specific case first.

## Comparison operators

| Operator | Meaning |
| --- | --- |
| `<` , `>` | less than, greater than |
| `<=` , `>=` | less or equal, greater or equal |
| `===` | equal (same value and same type) |
| `!==` | not equal |

Always use `===` (three equals signs), not `==`. The short version converts types in confusing ways, for example `0 == ""` is true.

## Combining conditions

- `&&` means **and**: both sides must be true. `age >= 13 && age <= 19` is true for teenagers.
- `||` means **or**: at least one side must be true. `day === "Sat" || day === "Sun"` is true on weekends.
- `!` means **not**: it flips true and false. `!isRaining` is true when it is not raining.

## Truthy and falsy

In a condition, some values count as "false": `0`, `""` (empty text), `null`, `undefined` and `NaN`. Everything else counts as "true". So `if (name)` checks that the name is not empty.

## A first look at functions

This lesson's starter uses a **function**, which you will meet properly in the lesson after the next one. For now: a function is a named block of code that you run by calling its name, like `describeTemp(5)`. The word `return` sends a value back to whoever called the function. As soon as a function hits `return`, it stops.

> **Watch out:**
> - Using one equals sign in a condition: `if (age = 18)` assigns a value instead of comparing it. Use `===`.
> - Comparing strings and numbers: `5 === "5"` is `false`.
> - Checking the larger case first: with `if (temp < 25) ... else if (temp < 10)` the second branch can never run, because every number under 10 is already under 25.
> - Forgetting the braces `{ }` or parentheses: `if age > 5 {` gives `SyntaxError: Unexpected identifier`.
> - A function that never returns: if no branch runs, `describeTemp` gives back `undefined`, and the console prints `undefined`.
> - Writing a semicolon right after the condition, `if (x > 1);`, which ends the statement with nothing inside it.

## Going further

Add a branch for `temp < 0` that returns `"freezing"`. Try `&&` to make `"nice"` for temperatures from 20 to 25.

> **Your turn:** finish `describeTemp` so it returns `"cold"` below 10, `"warm"` below 25, and `"hot"` otherwise.
