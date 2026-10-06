---
title: String methods
summary: Search, slice and change text with the methods of std::string.
level: beginner
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <cctype>
      using namespace std;

      int main() {
          string s = "Code Academy rocks";

          // 1. Print the length:                    Length: 18
          // 2. Find where "Academy" starts (find)  Found at: 5
          // 3. Cut out those 7 letters (substr)    Word: Academy
          // 4. Make a copy of s and replace its first 4 letters with "Learn"
          //    (use the replace method)             Replaced: Learn Academy rocks
          // 5. Count the vowels (a e i o u, any case) with a loop over the characters.
          //    tolower(c) gives the lower-case version of a char c.
          //                                          Vowels: 6

          return 0;
      }
check:
  output: |
    Length: 18
    Found at: 5
    Word: Academy
    Replaced: Learn Academy rocks
    Vowels: 6
  code:
    - { pattern: '\.\s*length\s*\(|\.\s*size\s*\(', message: "Use the length (or size) method." }
    - { pattern: '\.\s*find\s*\(', message: "Use s.find to locate the word." }
    - { pattern: '\.\s*substr\s*\(', message: "Use s.substr to cut out the word." }
    - { pattern: '\.\s*replace\s*\(', message: "Use the replace method." }
    - { pattern: 'for\s*\(', message: "Use a loop over the characters." }
hints:
  - "All of these are methods called with a dot on the string: s.length(), s.find(\"text\"), s.substr(start, count), copy.replace(start, count, \"new text\")."
  - "find returns the index where the text starts. substr(5, 7) means start at index 5 and take 7 letters. For the vowels use for (char c : s) and test tolower(c) against 'a', 'e', 'i', 'o' and 'u'."
  - "cout << \"Length: \" << s.length() << endl;   size_t pos = s.find(\"Academy\");   string word = s.substr(pos, 7);   string t = s; t.replace(0, 4, \"Learn\");   int vowels = 0; for (char c : s) { char l = tolower(c); if (l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u') { vowels++; } }"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      #include <cctype>
      using namespace std;

      int main() {
          string s = "Code Academy rocks";

          cout << "Length: " << s.length() << endl;

          size_t pos = s.find("Academy");
          cout << "Found at: " << pos << endl;

          string word = s.substr(pos, 7);
          cout << "Word: " << word << endl;

          string t = s;
          t.replace(0, 4, "Learn");
          cout << "Replaced: " << t << endl;

          int vowels = 0;
          for (char c : s) {
              char l = tolower(c);
              if (l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u') {
                  vowels++;
              }
          }
          cout << "Vowels: " << vowels << endl;

          return 0;
      }
quiz:
  - q: 'What does  s.find("ll")  return for s = "hello" ?'
    options: ["1", "2", "3"]
    answer: 1
    explain: "Counting from 0: h is 0, e is 1, l is 2. The match ll starts at index 2."
  - q: What does s.substr(1, 3) give for s = "abcdef" ?
    options: ["abc", "bcd", "bcde"]
    answer: 1
  - q: What does s.find("xyz") return when "xyz" is not in s?
    options: ["0", "-1", "The special value string::npos"]
    answer: 2
  - q: Which line joins two strings a and b?
    options: ["a + b", "a & b", "a . b"]
    answer: 0
---

Text handling is one of the most common jobs in programming: checking names, cutting up lines of input, cleaning up user data. C++'s `std::string` comes with a big toolbox of methods, so you rarely need to loop by hand. In this lesson you will learn the most useful ones.

## Basics: length, indexing, joining

```cpp
string s = "Hello";
cout << s.length() << endl;   // 5   (s.size() is the same)
cout << s[1] << endl;         // e   (index 0 is the first letter)
s[0] = 'J';                   // Jello  (you can change letters)
s += " world";                // Jello world  (append)
string t = s + "!";           // join into a new string
```

Strings can be compared directly with `==`, `<` and friends, which is much nicer than in C: `if (name == "Ava") { ... }`.

## Searching with find

`find` returns the index where the text first appears. If it is not there, it returns the special constant `string::npos` ("no position"):

```cpp
string s = "banana";
size_t pos = s.find("nan");           // 2
if (s.find("xyz") == string::npos) {
    cout << "not found" << endl;
}
```

`size_t` is the unsigned whole-number type that strings use for positions. You can also write `auto pos = s.find(...)`.

## Cutting with substr

`s.substr(start, count)` returns a new string with `count` letters starting at index `start`. Leave out `count` to take everything to the end:

```cpp
string s = "Code Academy";
cout << s.substr(5, 3) << endl;    // Aca
cout << s.substr(5) << endl;       // Academy
```

## Changing text

| Method | What it does | Example on `"Hello"` |
| --- | --- | --- |
| `s.replace(pos, n, text)` | replace `n` letters from `pos` with `text` | `replace(0, 1, "J")` gives `Jello` |
| `s.insert(pos, text)` | insert text at `pos` | `insert(5, "!")` gives `Hello!` |
| `s.erase(pos, n)` | remove `n` letters from `pos` | `erase(0, 1)` gives `ello` |
| `s.push_back(c)` | append one character | `push_back('!')` |
| `s.empty()` | true when the string has no letters | |

These methods **change the string itself**. If you want to keep the original, copy it first with `string t = s;`.

## Looping over characters and cctype

A string is a sequence of `char`s, so the range-based for loop works. The header `<cctype>` offers helpers for single characters: `toupper(c)`, `tolower(c)`, `isdigit(c)`, `isalpha(c)`, `isspace(c)`.

```cpp
string code = "a1b22";
int digits = 0;
for (char c : code) {
    if (isdigit(c)) digits++;
}
// digits is 3
```

> **Watch out:**
> - Not checking for `npos`: `s.find("x")` returns a huge number when missing, and using it in `substr` throws `terminate called after throwing an instance of 'std::out_of_range'`.
> - `"Hello" + " world"` (two quoted texts) does not compile; at least one side must be a `string`.
> - `substr(start, count)` takes a **count**, not an end position, so `substr(2, 4)` is not "from 2 to 4".
> - Indexing past the end (`s[20]`) is not checked; use `s.at(20)` to get an exception instead of garbage.
> - `tolower` and `toupper` work on one `char`, not on a whole string.

## Going further

Write a loop that turns the whole string into upper case, or counts how many words it has by counting spaces.

> **Your turn:** with `s = "Code Academy rocks"`, print the length, the position where `"Academy"` starts, the word cut out with `substr`, a copy with the first four letters replaced by `"Learn"`, and the number of vowels. The expected output is in the comments.
