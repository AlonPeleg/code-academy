---
title: Loops
summary: Repeat actions with for and while loops.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // 1. With a for loop, add up the numbers 1 to 10 in `total`, then print "Total: 55"
      let total = 0;


      // 2. With a while loop, keep doubling `n` until it is 100 or more, then print n
      let n = 1;


      // 3. With a for loop that counts DOWN, print 3, 2, 1 (one per line), then print "Liftoff!"

check:
  output: |
    Total: 55
    128
    3
    2
    1
    Liftoff!
  code:
    - pattern: "for\\s*\\("
      message: "Use a for loop."
    - pattern: "while\\s*\\("
      message: "Use a while loop for the doubling."
hints:
  - "Both parts repeat something. Use a for loop when you know how many times, and a while loop when you repeat until something becomes true."
  - "A for loop has three parts in parentheses: start, condition, step, like for (let i = 1; i <= 10; i++). A while loop has only a condition, and the body must change n. The countdown uses i-- instead of i++."
  - "for (let i = 1; i <= 10; i++) { total += i; }  console.log(\"Total: \" + total);  while (n < 100) { n = n * 2; }  console.log(n);  for (let i = 3; i >= 1; i--) { console.log(i); }  console.log(\"Liftoff!\");"
solution:
  - code: |
      let total = 0;
      for (let i = 1; i <= 10; i++) {
        total += i;
      }
      console.log("Total: " + total);

      let n = 1;
      while (n < 100) {
        n = n * 2;
      }
      console.log(n);

      for (let i = 3; i >= 1; i--) {
        console.log(i);
      }
      console.log("Liftoff!");
quiz:
  - q: How many times does  for (let i = 0; i < 3; i++)  run its body?
    options: ["4", "2", "3"]
    answer: 2
    explain: i takes the values 0, 1 and 2. When i reaches 3 the condition i < 3 is false and the loop stops.
  - q: Which loop is the best fit when you repeat until something changes, and do not know how many times?
    options: ["while", "for", "if"]
    answer: 0
  - q: What does  break  do inside a loop?
    options: ["Skips to the next round", "Pauses the program", "Leaves the loop immediately"]
    answer: 2
  - q: What does  i++  do?
    options: ["Adds 1 to i", "Doubles i", "Prints i"]
    answer: 0
---

A computer is great at doing the same thing a thousand times without getting bored. A **loop** repeats a block of code. You will use loops to count, to add things up, and to go through lists.

## The for loop

When you know how many times to repeat, use `for`:

```js
for (let i = 1; i <= 3; i++) {
  console.log("Round " + i);
}
// prints:
// Round 1
// Round 2
// Round 3
```

The three parts inside the parentheses, separated by semicolons:

1. `let i = 1` runs **once at the start** and creates the counter.
2. `i <= 3` is the **condition**, checked before every round. When it becomes false, the loop ends.
3. `i++` runs **after every round**. `i++` means "add one to i" (`i--` subtracts one).

So `i` goes 1, 2, 3. At 4 the condition is false and JavaScript continues after the loop.

## Adding things up

A very common pattern is an **accumulator**: a variable outside the loop that collects a result.

```js
let sum = 0;
for (let i = 1; i <= 4; i++) {
  sum += i;       // same as sum = sum + i
}
console.log(sum); // prints: 10   (1+2+3+4)
```

## Counting down

Start high, test with `>=`, and use `i--`:

```js
for (let i = 3; i >= 1; i--) {
  console.log(i);
}
// prints: 3, 2, 1 (each on its own line)
```

## The while loop

A `while` loop has only a condition. It repeats as long as the condition is true:

```js
let n = 1;
while (n < 50) {
  n = n * 2;
}
console.log(n); // prints: 64   (1, 2, 4, 8, 16, 32, 64)
```

The loop body has to do something that eventually makes the condition false. Here, `n` keeps growing until it reaches 50 or more. Choose `while` when you do not know in advance how many rounds you will need.

## break and continue

- `break` leaves the loop immediately.
- `continue` skips the rest of this round and moves to the next.

```js
for (let i = 1; i <= 10; i++) {
  if (i === 3) continue;  // skip 3
  if (i === 6) break;     // stop at 6
  console.log(i);
}
// prints: 1, 2, 4, 5
```

## Loops with decisions

Loops and `if` statements combine nicely. To print only the even numbers up to 6:

```js
for (let i = 1; i <= 6; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}
```

> **Watch out:**
> - An **infinite loop**: a `while` whose condition never turns false, or a `for` with `i--` when the condition expects `i` to grow. The editor stops your program after 5 seconds with a message. Check that something in the body changes the condition.
> - Off-by-one mistakes: `i < 3` runs 3 times starting from 0, while `i <= 3` runs 4 times. Think about the first and the last value.
> - Declaring the counter with `const`: `for (const i = 0; i < 3; i++)` fails with `TypeError: Assignment to constant variable.` The counter must be `let`.
> - Putting the accumulator `let sum = 0;` inside the loop. It is reset every round.
> - Forgetting the semicolons in the `for` header: use `;` between the three parts, not commas.

## Going further

Print the multiplication table of 7 (`7 x 1 = 7` and so on) with a `for` loop. Then use a `while` loop to find the first power of 3 that is bigger than 1000.

> **Your turn:** follow the three comments: add up 1 to 10 with a `for` loop, double `n` with a `while` loop, and count down from 3 with a second `for` loop.
