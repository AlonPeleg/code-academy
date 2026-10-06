---
title: Input with cin and getline
summary: Read numbers and whole lines of text from the user.
level: beginner
runner: remote
stdin: |
  Ava
  20
  Ava Lovelace Smith
  3 4 5
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      using namespace std;

      int main() {
          string first;
          int age = 0;
          string fullName;
          int a = 0, b = 0, c = 0;

          // The input (see the Input tab) is:
          //   Ava
          //   20
          //   Ava Lovelace Smith
          //   3 4 5

          // 1. Read first (one word) and age (a number) from the input.
          //    Print:  Hello, Ava! Next year you will be 21.

          // 2. The next line has spaces in it. First skip the rest of the previous
          //    line, then read the whole line into fullName.
          //    Print:  Full name: Ava Lovelace Smith

          // 3. Read three numbers a, b, c in one statement and print their total:
          //    Total: 12

          return 0;
      }
check:
  output: |
    Hello, Ava! Next year you will be 21.
    Full name: Ava Lovelace Smith
    Total: 12
  code:
    - { pattern: 'cin\s*>>', message: "Use cin >> to read values." }
    - { pattern: 'getline\s*\(', message: "Use getline to read a whole line with spaces." }
hints:
  - "cin >> variable reads one value (a word or a number) and skips whitespace. getline reads everything up to the end of the line, spaces included."
  - "After cin >> age the newline is still waiting in the input. Use cin.ignore() once to throw it away, then getline(cin, fullName); For three numbers chain the arrows: cin >> a >> b >> c;"
  - "cin >> first >> age; cout << \"Hello, \" << first << \"! Next year you will be \" << age + 1 << \".\" << endl;   cin.ignore(); getline(cin, fullName); cout << \"Full name: \" << fullName << endl;   cin >> a >> b >> c; cout << \"Total: \" << a + b + c << endl;"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      using namespace std;

      int main() {
          string first;
          int age = 0;
          string fullName;
          int a = 0, b = 0, c = 0;

          cin >> first >> age;
          cout << "Hello, " << first << "! Next year you will be " << age + 1 << "." << endl;

          cin.ignore();
          getline(cin, fullName);
          cout << "Full name: " << fullName << endl;

          cin >> a >> b >> c;
          cout << "Total: " << a + b + c << endl;

          return 0;
      }
quiz:
  - q: Which line reads a whole number from the user into n?
    options: ["cout << n;", "cin >> n;", "getline(n);"]
    answer: 1
  - q: Why use getline instead of cin >> for a full name like "Ava Lovelace"?
    options: ["cin >> stops at the first space", "getline is shorter", "cin cannot read text"]
    answer: 0
  - q: What does cin.ignore() do in this lesson?
    options: ["Turns off the input", "Throws away the newline left behind by cin >>", "Ignores all later errors"]
    answer: 1
  - q: What happens to a cin >> int when the input contains letters instead?
    options: ["The letters become numbers", "The program prints an error and exits", "Reading fails and the variable is not filled in"]
    answer: 2
    explain: "cin goes into a 'fail' state. You can test it with if (cin >> n) or if (!cin)."
---

So far your programs only talked. Now they will listen. In this lesson you will use `cin` to read numbers and words, and `getline` to read a whole line of text, spaces and all.

## Reading with cin

`cin` (console input) is the mirror of `cout`. It uses the arrows the other way, `>>`, because data flows from the input *into* your variable:

```cpp
int age;
cin >> age;                 // reads a number
string word;
cin >> word;                // reads one word
cout << word << " " << age << endl;
```

You can chain reads, just like you chain `<<`:

```cpp
int x, y;
cin >> x >> y;              // input "3 4" gives x = 3, y = 4
```

`cin >>` skips spaces and new lines before the value, and reads until the next whitespace. It also converts the text into the type of the variable (`int`, `double`, `string`, `char`).

On this site the text typed in the **Input** tab of the editor is given to your program as if a person had typed it. Change it and run again to try other values.

## Reading a whole line with getline

A name like `Ava Lovelace Smith` has spaces, so `cin >>` would only get `Ava`. Use `getline`:

```cpp
string line;
getline(cin, line);         // reads everything up to the end of the line
```

## The leftover newline trap

After `cin >> age`, the Enter key that followed the number is still waiting in the input. If you call `getline` right away, it sees that empty rest-of-line and returns an empty string. Fix it by throwing the newline away first:

```cpp
cin >> age;
cin.ignore();               // skip the leftover newline
getline(cin, line);         // now reads the next real line
```

(`cin.ignore()` skips one character; the version `cin.ignore(1000, '\n')` skips up to the end of the line even when there are trailing spaces.)

## Did the read work?

If the input is missing or has the wrong type, the read fails and the variable keeps its old value (since C++11 it becomes `0` for numbers). Reading in a condition tells you whether it worked, which gives a neat loop:

```cpp
int n, total = 0;
while (cin >> n) {          // true as long as a number was read
    total += n;
}
```

> **Watch out:**
> - Mixing `cin >>` and `getline` without `cin.ignore()` gives an empty line from `getline`. Nothing crashes, so the bug is easy to miss.
> - Using `<<` with `cin` (or `>>` with `cout`) gives `error: no match for 'operator<<'`. Arrows point where the data goes.
> - Reading into a variable you did not declare gives `error: 'age' was not declared in this scope`.
> - Always initialize variables (`int age = 0;`) so a failed read still leaves a known value.

## Going further

Read a `double` and print half of it. Then try typing text instead of a number in the Input tab and print whether `cin >> n` succeeded.

> **Your turn:** read `first` and `age` with `cin >>` and print the greeting, use `cin.ignore()` and `getline` to read the full name, then read three numbers in one statement and print their total.
