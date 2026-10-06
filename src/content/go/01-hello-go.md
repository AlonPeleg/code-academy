---
title: Hello, Go
summary: Write your first Go program and learn about packages, imports and the main function.
level: beginner
runner: remote
files:
  - name: main.go
    code: |
      package main

      import (
          "fmt"
          "math"
          "strings"
      )

      func main() {
          // 1. Print the line:  Hello, Go!
          // 2. Print the text "go is simple" in capital letters (GO IS SIMPLE).
          //    Use a function from the strings package.
          // 3. Print the line:  Pi is about 3.14
          //    Use the constant from the math package and a format with two decimals.

      }
check:
  output: |
    Hello, Go!
    GO IS SIMPLE
    Pi is about 3.14
  code:
    - { pattern: 'fmt\.Print(ln|f)\s*\(', message: "Use fmt.Println(...) or fmt.Printf(...) to print." }
    - { pattern: 'strings\.ToUpper\s*\(', message: "Use strings.ToUpper(...) for the capital letters." }
    - { pattern: 'math\.Pi', message: "Use the constant math.Pi." }
    - { pattern: 'fmt\.Printf\s*\(\s*"[^"]*%\.2f', message: "Use fmt.Printf with the %.2f format to show two decimals." }
hints:
  - "Everything you print comes from the fmt package: fmt.Println(\"text\") prints a line. A function from another package is always written package.Function."
  - "strings.ToUpper(\"go is simple\") returns the capital version, so you can pass it straight to fmt.Println. For the last line use fmt.Printf, whose first argument is a format string with a placeholder %.2f for a decimal with 2 digits."
  - "fmt.Println(\"Hello, Go!\")  fmt.Println(strings.ToUpper(\"go is simple\"))  fmt.Printf(\"Pi is about %.2f\\n\", math.Pi)"
solution:
  - name: main.go
    code: |
      package main

      import (
          "fmt"
          "math"
          "strings"
      )

      func main() {
          fmt.Println("Hello, Go!")
          fmt.Println(strings.ToUpper("go is simple"))
          fmt.Printf("Pi is about %.2f\n", math.Pi)
      }
quiz:
  - q: "What does package main tell Go?"
    options: ["This file is a library for others", "This file builds a program you can run", "This file is a comment", "This file is written in C"]
    answer: 1
    explain: "A package named main with a func main() is the entry point of an executable program."
  - q: "What happens if you import a package but never use it?"
    options: ["Nothing, it is ignored", "A warning appears", "The program does not compile", "It is used automatically"]
    answer: 2
  - q: "Why is Println written with a capital P?"
    options: ["Just a style choice", "In Go, names starting with a capital letter are exported (visible to other packages)", "Because it is a constant", "Because it is old"]
    answer: 1
  - q: "What does the \\n in a Printf format string do?"
    options: ["Prints the letter n", "Starts a new line", "Deletes the line", "Ends the program"]
    answer: 1
---

In this lesson you will write your first Go program and meet the building blocks every Go file has: a **package**, some **imports** and a **main function**. Go (sometimes called Golang) was created at Google to be simple, fast to compile and good at doing many things at once. It powers tools like Docker and Kubernetes.

## The smallest Go program

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}
```

Running it prints:

```
Hello, world!
```

Line by line:

* `package main` says which **package** this file belongs to. Go code is organised into packages, folders of related code. A package named `main` is special: it produces a program you can run, instead of a library.
* `import "fmt"` brings in another package. `fmt` ("format") is part of Go's standard library and handles printing and formatting text.
* `func main() { ... }` declares a **function** named `main`. When you run the program, Go starts here. The `func` keyword starts every function, the parentheses hold the parameters (none here), and the braces hold the body.
* `fmt.Println("...")` calls the function `Println` from the package `fmt`. It prints its arguments and ends with a new line.

Notice what is **missing** compared to many languages: there are no semicolons at the end of lines (Go adds them for you), and there is no class around the code.

## Importing several packages

Group several imports in parentheses:

```go
import (
    "fmt"
    "math"
    "strings"
)
```

You use a package's contents by writing `packagename.Thing`:

```go
fmt.Println(strings.ToUpper("hello")) // prints: HELLO
fmt.Println(math.Sqrt(16))            // prints: 4
fmt.Println(math.Pi)                  // prints: 3.141592653589793
```

Why do the names start with a capital letter? In Go, a name that starts with a **capital letter** is **exported**, meaning other packages may use it. A lowercase name is private to its package. That is why you write `Println` and `ToUpper`, never `println` from `fmt`. This simple rule replaces keywords like `public` and `private`.

## Println and Printf

`Println` prints each argument, separated by spaces, followed by a newline:

```go
fmt.Println("Total:", 42, true)   // prints: Total: 42 true
```

`Printf` lets you shape the output with a **format string** containing **verbs** that start with `%`:

| Verb | Prints |
|---|---|
| `%d` | an integer |
| `%s` | a string |
| `%f` | a decimal (use `%.2f` for two digits after the point) |
| `%v` | any value in a default format |
| `%t` | true or false |
| `%q` | a string in quotes |

```go
fmt.Printf("%s is %d years old\n", "Ada", 36)  // prints: Ada is 36 years old
fmt.Printf("%.1f\n", 2.25)                      // prints: 2.2  (rounded to one decimal)
```

`Printf` does **not** add a new line on its own, so you write `\n` at the end of the format string yourself.

## Comments

```go
// a single-line comment
/* a comment that
   spans lines */
```

## Formatting is built in

Go comes with a tool, `gofmt`, that lays out every program in one standard style (tabs for indentation, spacing around operators). Go programmers do not argue about style: they run the tool. The opening brace `{` must stay on the same line as `func`, otherwise it is a syntax error.

> **Watch out:**
> - Importing a package you do not use is an **error** in Go, not a warning: `"strings" imported and not used`. Remove the import or use it.
> - The reverse also fails: using `strings.ToUpper` without importing `strings` gives `undefined: strings`.
> - `fmt.println("hi")` with a lowercase p gives `undefined` or `cannot refer to unexported name fmt.println`. Exported names need a capital letter.
> - Strings need **double quotes**. Single quotes are for single characters (called runes), so `fmt.Println('hi')` gives `more than one character in rune literal`.
> - Putting the opening brace on its own line gives `syntax error: unexpected semicolon or newline before {`.
> - Forgetting `\n` in `Printf` makes the next output stick to the same line.

## Going further

Try `fmt.Printf("%5d|%-5d|\n", 42, 42)` to see padding. Print a value with `%v` and with `%T` (its type). Try `math.Max(3, 9)` and `strings.Repeat("ab", 3)`.

> **Your turn:** in `main`, print `Hello, Go!`, then print `go is simple` in capital letters using `strings.ToUpper`, and finally use `fmt.Printf` with `%.2f` and `math.Pi` to print `Pi is about 3.14`.
