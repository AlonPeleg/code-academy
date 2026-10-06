---
title: Hello, console
summary: Run your first JavaScript and print to the console.
level: beginner
runner: js
files:
  - name: main.js
    code: |
      // Print two lines:
      //   Hello, world!
      //   I am learning JavaScript

check:
  output: |
    Hello, world!
    I am learning JavaScript
hints:
  - "You need a command that prints a message to the output panel. It is used once per line you want to print."
  - "The command is console.log(...). The text you want to print goes between the parentheses, wrapped in quotes."
  - "console.log(\"Hello, world!\"); on the first line and console.log(\"I am learning JavaScript\"); on the second."
solution:
  - code: |
      console.log("Hello, world!");
      console.log("I am learning JavaScript");
quiz:
  - q: Which line prints text to the console?
    options: ["print('Hi')", "echo 'Hi'", "console.log('Hi')"]
    answer: 2
  - q: What starts a single-line comment in JavaScript?
    options: ["#", "//", "<!--"]
    answer: 1
  - q: What are the quotes around Hello for?
    options: ["They make it louder", "They mark it as text (a string)", "They are optional"]
    answer: 1
  - q: What happens if you call console.log twice?
    options: ["Each call prints on its own line", "Only the last one prints", "The two messages are joined on one line"]
    answer: 0
---

**JavaScript** is the programming language of the web, but it also runs on servers, phones and even robots. In this lesson you will run your very first program and learn how to see what it does.

## What is a program?

A program is a list of instructions that the computer follows one after another, from top to bottom. Each instruction is called a **statement**. Our first statement will print a message so that we can see that the program is alive.

## console.log

The tool for printing is `console.log`:

```js
console.log("Hello!");
```

Let us take it apart:

- `console` is an object built into JavaScript that represents the output area (the "console").
- `.log` is a command that belongs to the console. A command attached to an object like this is called a **method**.
- The parentheses `( )` hold the **argument**: the thing you want to print.
- `"Hello!"` is the argument. Text in quotes is called a **string**.
- The semicolon `;` marks the end of a statement. It is optional in many cases, but it is a good habit.

When you press **Run** (or `Ctrl/Cmd + Enter`), the message appears in the **Output** panel.

## More than one line

Every `console.log` prints on its own line:

```js
console.log("First");
console.log("Second");
// prints:
// First
// Second
```

The computer runs the lines in order. If you swapped them, the output would swap too.

## Printing other things

You can print numbers without quotes, and even do maths inside:

```js
console.log(42);      // prints: 42
console.log(10 + 5);  // prints: 15
console.log("10 + 5"); // prints: 10 + 5   (it is text, so no maths happens)
```

You can print several things in one call by separating them with commas. They come out with a space between them:

```js
console.log("I am", 20, "years old"); // prints: I am 20 years old
```

## Comments

A line starting with `//` is a **comment**. The computer ignores it, so you can leave notes for yourself and other people. The starter code for each lesson uses comments to tell you what to do.

```js
// This line does nothing, it is just a note.
console.log("This line prints."); // you can also comment at the end of a line
```

> **Watch out:**
> - Forgetting the quotes: `console.log(Hello)` gives `ReferenceError: Hello is not defined`, because JavaScript thinks `Hello` is the name of a variable.
> - Mismatched quotes or brackets: `console.log("Hi);` gives `SyntaxError: Invalid or unexpected token`. Every opening quote or bracket needs its partner.
> - Wrong capital letters: `Console.log("Hi")` or `console.Log("Hi")` fail with a `ReferenceError` or `TypeError`. JavaScript is case-sensitive.
> - Misspelled words: `consol.log("Hi")` gives `ReferenceError: consol is not defined`.
> - Reading the error: the red text in the output panel tells you what went wrong, and often the line number. Do not panic, it is just a hint.

## Going further

Print your name, your favourite food and a number, each on its own line. Try writing a comment above each line. Then try something that fails on purpose (remove a quote) to see what an error message looks like.

> **Your turn:** print `Hello, world!` and then `I am learning JavaScript`, each on its own line. Then press **Check answer**.
