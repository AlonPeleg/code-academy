---
title: Hello, C++
summary: Your first C++ program with cout.
level: beginner
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      using namespace std;

      int main() {
          // 1. Print the line: Hello, C++!
          //    (use cout, the << operator and endl)

          return 0;
      }
check:
  output: Hello, C++!
hints:
  - "In C++ you print with cout, which comes from the iostream header that is already included for you."
  - "Send the text to cout with the << operator, put the text in double quotes, and end the line with endl and a semicolon."
  - "Write exactly this inside main:  cout << \"Hello, C++!\" << endl;"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      using namespace std;

      int main() {
          cout << "Hello, C++!" << endl;
          return 0;
      }
quiz:
  - q: Which line prints to the screen in C++?
    options: ["print(\"Hi\")", "echo \"Hi\"", "cout << \"Hi\";"]
    answer: 2
  - q: What does endl do?
    options: ["Ends the program", "Ends the line and starts a new one", "Deletes the line"]
    answer: 1
  - q: 'What does  #include <iostream>  provide?'
    options: ["Graphics", "Input and output (cout, cin)", "Math functions only"]
    answer: 1
  - q: What does  using namespace std;  let you do?
    options: ["Write cout instead of std::cout", "Run the program faster", "Use Python code"]
    answer: 0
---

In this lesson you will write, compile and run your first C++ program. C++ builds on the C language and adds classes, strings, containers and many other tools. It powers browsers, game engines, databases and high-frequency trading systems, so it is a skill that pays off.

## Compiled, not interpreted

C++ is **compiled**: a program called a compiler translates your whole file into machine code before anything runs. When you press **Run**, your code is sent to a run server which compiles it with `g++` and sends back the output. If the compiler finds a mistake you will see its error message instead.

## The smallest useful program

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello!" << endl;
    return 0;
}
```

Let us look at each piece:

- `#include <iostream>` brings in the input/output tools (`cout` for output, `cin` for input).
- `using namespace std;` means the standard library names can be written short. Without it you would have to write `std::cout` and `std::endl` every time.
- `int main()` is the function where every C++ program starts. `int` means it returns a whole number when it finishes.
- `{ ... }` hold the body of the function.
- `cout << "Hello!"` sends text to the **c**onsole **out**put. The arrows `<<` point in the direction the data flows.
- `endl` ends the line (like pressing Enter). You can also write `"\n"` inside the text for a new line.
- `;` ends every statement.
- `return 0;` ends `main`; `0` means "success".
- `//` starts a **comment**, which the compiler ignores.

## Chaining and several lines

You can chain several `<<` in one statement, mixing text and numbers:

```cpp
cout << "Two plus two is " << 2 + 2 << endl;   // prints: Two plus two is 4
cout << "First" << endl;
cout << "Second" << endl;
```

> **Watch out:**
> - Writing `cout >> "Hi"` (wrong arrows) gives `error: no match for 'operator>>'`. Output uses `<<`.
> - Forgetting the semicolon gives `error: expected ';' before 'return'`.
> - Forgetting `#include <iostream>` gives `error: 'cout' was not declared in this scope`.
> - Single quotes are for one character (`'A'`), double quotes for text (`"Hello"`).
> - Without `endl` (or `\n`) the next output continues on the same line.

## Going further

Print your own name on a second line, then try `cout << "A" << "B" << endl;` and see that nothing is added between the pieces.

> **Your turn:** inside `main`, use `cout` to print `Hello, C++!` on its own line.
