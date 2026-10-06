---
title: Mocks and spies
summary: Replace slow or unpredictable dependencies with jest.fn() and jest.spyOn() so you can test one piece in isolation.
level: intermediate
runner: js
files:
  - name: reminders.test.js
    code: |
      const { sendReminders } = require("./reminders");

      const DAY = 24 * 60 * 60 * 1000;
      const users = [
        { name: "Ada", email: "ada@example.com", dueTime: 7 * DAY },
        { name: "Grace", email: "grace@example.com", dueTime: 12 * DAY },
        { name: "Linus", email: "linus@example.com", dueTime: 9.5 * DAY },
      ];

      describe("sendReminders", () => {
        let nowSpy;
        let send;

        beforeEach(() => {
          // "Today" is always day 10, no matter when the test runs.
          nowSpy = jest.spyOn(Date, "now").mockReturnValue(10 * DAY);
          // A fake send function that remembers every call.
          send = jest.fn();
        });

        afterEach(() => {
          nowSpy.mockRestore();
        });

        it("sends a reminder only to users who are late", () => {
          sendReminders(users, send);
          expect(send).toHaveBeenCalledTimes(1);
        });

        it("sends the email address and a message with the number of days", () => {
          sendReminders(users, send);
          expect(send).toHaveBeenCalledWith("ada@example.com", "Hi Ada, your book is 3 days late");
        });

        it("returns how many reminders were sent", () => {
          expect(sendReminders(users, send)).toBe(1);
        });

        it("does not call send when nobody is late", () => {
          const count = sendReminders([users[1], users[2]], send);
          expect(send).not.toHaveBeenCalled();
          expect(count).toBe(0);
        });

        it("reminds late users in the order of the list", () => {
          const lateUsers = [
            { name: "Ada", email: "ada@example.com", dueTime: 7 * DAY },
            { name: "Alan", email: "alan@example.com", dueTime: 8 * DAY },
          ];
          sendReminders(lateUsers, send);
          const addresses = send.mock.calls.map((call) => call[0]);
          expect(addresses).toEqual(["ada@example.com", "alan@example.com"]);
        });
      });
  - name: reminders.js
    code: |
      // How many whole days ago was the due time? (already written)
      function daysLate(dueTime) {
        return Math.floor((Date.now() - dueTime) / (24 * 60 * 60 * 1000));
      }

      // 1. Go through the users. For every user that is late (daysLate(user.dueTime) is more than 0)
      //    call send(user.email, message) with the message:  Hi <name>, your book is <n> days late
      // 2. Return how many reminders you sent.
      // The send function is a PARAMETER: in real life it sends an e-mail, in the tests it is a mock.
      function sendReminders(users, send) {
        return 0;
      }

      module.exports = { sendReminders };
check:
  output: |
    sendReminders
      ✓ sends a reminder only to users who are late
      ✓ sends the email address and a message with the number of days
      ✓ returns how many reminders were sent
      ✓ does not call send when nobody is late
      ✓ reminds late users in the order of the list

    Tests: 5 passed, 5 total
  code:
    - file: reminders.js
      pattern: 'send\s*\(\s*\w+\.email'
      message: "Call send(user.email, message) for each late user."
    - file: reminders.js
      pattern: 'daysLate\s*\('
      message: "Use daysLate(...) to decide who is late."
hints:
  - "The mock records every call, so your job is just to CALL send in the right way: once for each late user, with two arguments (address, text). Count the calls in a variable."
  - "Loop with for (const user of users). Compute const days = daysLate(user.dueTime). If days > 0, call send(user.email, `Hi ${user.name}, your book is ${days} days late`) and add 1 to a counter. Return the counter after the loop."
  - "let count = 0; for (const user of users) { const days = daysLate(user.dueTime); if (days > 0) { send(user.email, `Hi ${user.name}, your book is ${days} days late`); count++; } } return count;"
solution:
  - name: reminders.test.js
    code: |
      const { sendReminders } = require("./reminders");

      const DAY = 24 * 60 * 60 * 1000;
      const users = [
        { name: "Ada", email: "ada@example.com", dueTime: 7 * DAY },
        { name: "Grace", email: "grace@example.com", dueTime: 12 * DAY },
        { name: "Linus", email: "linus@example.com", dueTime: 9.5 * DAY },
      ];

      describe("sendReminders", () => {
        let nowSpy;
        let send;

        beforeEach(() => {
          nowSpy = jest.spyOn(Date, "now").mockReturnValue(10 * DAY);
          send = jest.fn();
        });

        afterEach(() => {
          nowSpy.mockRestore();
        });

        it("sends a reminder only to users who are late", () => {
          sendReminders(users, send);
          expect(send).toHaveBeenCalledTimes(1);
        });

        it("sends the email address and a message with the number of days", () => {
          sendReminders(users, send);
          expect(send).toHaveBeenCalledWith("ada@example.com", "Hi Ada, your book is 3 days late");
        });

        it("returns how many reminders were sent", () => {
          expect(sendReminders(users, send)).toBe(1);
        });

        it("does not call send when nobody is late", () => {
          const count = sendReminders([users[1], users[2]], send);
          expect(send).not.toHaveBeenCalled();
          expect(count).toBe(0);
        });

        it("reminds late users in the order of the list", () => {
          const lateUsers = [
            { name: "Ada", email: "ada@example.com", dueTime: 7 * DAY },
            { name: "Alan", email: "alan@example.com", dueTime: 8 * DAY },
          ];
          sendReminders(lateUsers, send);
          const addresses = send.mock.calls.map((call) => call[0]);
          expect(addresses).toEqual(["ada@example.com", "alan@example.com"]);
        });
      });
  - name: reminders.js
    code: |
      function daysLate(dueTime) {
        return Math.floor((Date.now() - dueTime) / (24 * 60 * 60 * 1000));
      }

      function sendReminders(users, send) {
        let count = 0;
        for (const user of users) {
          const days = daysLate(user.dueTime);
          if (days > 0) {
            send(user.email, `Hi ${user.name}, your book is ${days} days late`);
            count++;
          }
        }
        return count;
      }

      module.exports = { sendReminders };
quiz:
  - q: "What is a mock function (jest.fn()) good for?"
    options: ["Making the code run faster", "Standing in for a real function, and recording how it was called", "Fixing bugs automatically"]
    answer: 1
  - q: "Why do we replace Date.now() with a spy in the test?"
    options: ["So the test gives the same result every day, instead of depending on the real clock", "Because Date.now is broken", "To make the test slower"]
    answer: 0
    explain: "A test that depends on the current time or on random numbers can pass today and fail tomorrow. Control the unpredictable thing."
  - q: "What does expect(send).toHaveBeenCalledWith(\"a@b.c\", \"Hi\") check?"
    options: ["That send returned \"a@b.c\"", "That send was called at least once with exactly those arguments", "That send was called only once"]
    answer: 1
  - q: "Why do we call nowSpy.mockRestore() in afterEach?"
    options: ["To give the original Date.now back, so later tests and code are not affected", "To delete the test", "To print the spy"]
    answer: 0
---
Some code is hard to test because it depends on things you cannot control: the current time, random numbers, the network, a database, an e-mail server. You do not want a test that sends 500 real e-mails, or one that only passes on Tuesdays. The solution is to **replace** those things with fakes that you control and can inspect. In this lesson you will learn the two tools for that: **mocks** and **spies**.

## Mock functions: jest.fn()

`jest.fn()` creates a fake function. It does nothing by default, but it **remembers every call**:

```js
const greet = jest.fn();

greet("Ada");
greet("Grace", "hello");

console.log(greet.mock.calls);        // prints: [["Ada"], ["Grace", "hello"]]
console.log(greet.mock.calls.length); // prints: 2
```

`mock.calls` is a list with one entry per call, and each entry is the list of arguments. You can assert on it directly, or use the friendly matchers:

```js
expect(greet).toHaveBeenCalled();                  // at least once
expect(greet).toHaveBeenCalledTimes(2);            // exactly twice
expect(greet).toHaveBeenCalledWith("Ada");         // some call had exactly these arguments
expect(greet).not.toHaveBeenCalledWith("Linus");
```

You can also decide what the fake **returns**:

```js
const getPrice = jest.fn().mockReturnValue(10);
console.log(getPrice("apple") + getPrice("pear"));   // prints: 20

const pick = jest.fn()
  .mockReturnValueOnce("first")
  .mockReturnValue("later");
console.log(pick(), pick(), pick());   // prints: first later later

const double = jest.fn((n) => n * 2);   // give it a real behaviour
console.log(double(4));                 // prints: 8
```

(For async functions there are `mockResolvedValue(x)` and `mockRejectedValue(err)`, which you will use in the async lesson.)

## Passing the fake in (dependency injection)

The easiest way to use a mock is to design your function so that it **receives** what it depends on as a parameter, instead of reaching out for it:

```js
function sendReminders(users, send) {   // send is a parameter
  for (const user of users) send(user.email, "Please return the book");
}
```

In the real program you pass a function that sends e-mails. In the test you pass `jest.fn()`, and afterwards you ask the mock what happened. Nothing was sent, nothing is slow, and the test checks exactly the logic of `sendReminders`. This is called **isolating** the code under test.

## Spies: jest.spyOn(object, "method")

Sometimes you cannot pass the dependency in, because the code uses a global such as `Date.now()` or `Math.random()`. A **spy** wraps an existing method of an object so you can watch it, or replace its result:

```js
const spy = jest.spyOn(Date, "now").mockReturnValue(1000);
console.log(Date.now());   // prints: 1000
spy.mockRestore();         // put the real Date.now back
console.log(Date.now() > 1000);   // prints: true
```

Without `mockReturnValue` a spy still calls the original method, so you can watch calls without changing behaviour. **Always restore** spies when the test is done (`mockRestore()`, usually in `afterEach`), or they leak into other tests.

## beforeEach and afterEach

`beforeEach(() => {...})` runs before every test in the suite and `afterEach` runs after every test. Use them to create fresh mocks, so tests cannot affect each other (see the test file of this lesson).

> **Watch out:**
> * **Over-mocking.** If everything is a mock, the test only proves that your mocks work. Mock the edges of your system (clock, network, e-mail), not your own logic.
> * **Forgetting to restore.** A spy left on `Date.now` makes every later test live in the fake time zone. Restore it in `afterEach`.
> * **Wrong argument order.** `toHaveBeenCalledWith("ada@example.com", "Hi")` fails if the code calls `send("Hi", "ada@example.com")`. The failure shows the real list of calls: read it.
> * **Asserting on implementation, not behaviour.** Check what the user can observe (messages sent, values returned), not how many internal helper calls happened, or tests break whenever you refactor.

> **Your turn:** The tests in `reminders.test.js` are finished. Write `sendReminders(users, send)` in `reminders.js`: for every user who is more than 0 days late, call `send(user.email, "Hi <name>, your book is <n> days late")`, and return the number of reminders sent. All 5 tests must pass.
