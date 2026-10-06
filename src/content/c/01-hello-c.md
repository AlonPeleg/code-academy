---
title: Hello, C
summary: Compile and run your first C program.
level: beginner
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          // 1. Print the line: Hello, C!
          //    (use printf, and end the text with \n for a new line)

          return 0;
      }
check:
  output: Hello, C!
hints:
  - "Printing in C is done with a function from stdio.h. Its name starts with 'print'."
  - "Call printf with the text in double quotes, put a \\n at the end of the text, and finish the statement with a semicolon."
  - "Write exactly this line inside main:  printf(\"Hello, C!\\n\");"
solution:
  - name: main.c
    code: |
      #include <stdio.h>

      int main(void) {
          printf("Hello, C!\n");
          return 0;
      }
quiz:
  - q: Where does a C program start running?
    options: ["The first #include line", "The main function", "The last line of the file"]
    answer: 1
    explain: "Whatever else is in the file, the computer begins at main."
  - q: 'What does #include <stdio.h> do?'
    options: ["Creates a new file called stdio", "Deletes unused code", "Brings in the input/output functions such as printf"]
    answer: 2
  - q: What does \n mean inside a string?
    options: ["Start a new line", "The letter n", "Nothing, it is ignored"]
    answer: 0
  - q: What must almost every C statement end with?
    options: ["A colon", "A semicolon", "A full stop"]
    answer: 1
---

In this lesson you will write, compile and run your very first C program. C is one of the oldest and most influential languages: operating systems, game engines and the tiny chips inside washing machines are written in it. Learning C shows you what the computer is really doing underneath friendlier languages.

## Compiled, not interpreted

JavaScript and Python are run line by line by an interpreter. C is **compiled**: a program called a *compiler* first translates your whole file into machine code, and only then does the result run. When you press **Run**, your code is sent to a run server which compiles it with `gcc` and sends back what the program printed. If the compiler finds a mistake, you see its error message instead of any output.

## The smallest useful program

```c
#include <stdio.h>

int main(void) {
    printf("Hello!\n");
    return 0;
}
```

Let us take it apart piece by piece:

- `#include <stdio.h>` copies in the description of the standard input/output library. Without it the compiler would not know what `printf` is. The name means "standard input output, header".
- `int main(void)` defines the function called `main`. Every C program starts running at `main`. `int` says it hands back a whole number when it ends, and `void` says it takes no inputs.
- The curly braces `{ ... }` hold the body of the function.
- `printf("Hello!\n");` calls the function `printf` (print formatted) and gives it some text in double quotes.
- `\n` is an **escape sequence** meaning "new line". Without it, the next thing printed would continue on the same line.
- `;` ends a statement, like a full stop ends a sentence.
- `return 0;` ends `main`. By tradition `0` means "everything went fine".
- A line starting with `//` is a **comment**. The compiler ignores it, so use comments to explain your code to humans.

## More than one line

Every `printf` prints exactly what you give it, nothing more. These two statements print on two lines:

```c
printf("First\n");
printf("Second\n");
// prints:
// First
// Second
```

> **Watch out:**
> - Forgetting the semicolon gives `error: expected ';' before 'return'`. The line number in the message is often the line *after* the real mistake.
> - Forgetting the `#include` gives `warning: implicit declaration of function 'printf'` or an outright error.
> - Using single quotes `'Hello'` instead of double quotes `"Hello"` gives errors. In C, double quotes are for text, single quotes are for one character.
> - C is case-sensitive: `Printf` and `printf` are different names.

## Going further

Add a second `printf` that prints your own name, and try removing the `\n` to see what happens to the output.

> **Your turn:** inside `main`, use `printf` to print `Hello, C!` on its own line.
