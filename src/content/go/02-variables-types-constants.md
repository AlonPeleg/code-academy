---
title: Variables, types and constants
summary: Declare variables with var and :=, meet Go's basic types, zero values, constants and conversions.
level: beginner
runner: remote
files:
  - name: main.go
    code: |
      package main

      import "fmt"

      func main() {
          // 1. Declare a string variable with var:  var name string = "Ada"
          //    and an int with the short form:       age := 36
          //    Print:  Ada is 36 years old

          // 2. Declare a constant taxRate with the value 0.2 (use the const keyword).
          //    Declare price := 50.0 and compute total := price * (1 + taxRate).
          //    Print with Printf:  Total with tax: 60.00

          // 3. Declare three variables WITHOUT giving values:
          //    an int called count, a bool called ok and a string called label.
          //    Print them with Printf using %d %t %q:  Zero values: 0 false ""

          // 4. Declare  a := 7  and  b := 2.
          //    Print  7 / 2 = 3     (integer division)
          //    Print  7 / 2.0 = 3.5 (convert both to float64 first, use %.1f)

      }
check:
  output: |
    Ada is 36 years old
    Total with tax: 60.00
    Zero values: 0 false ""
    7 / 2 = 3
    7 / 2.0 = 3.5
  code:
    - { pattern: 'var\s+name\s+string', message: "Declare the name with var and the string type." }
    - { pattern: 'age\s*:=\s*36', message: "Use the short declaration age := 36." }
    - { pattern: 'const\s+taxRate', message: "Declare the constant with const taxRate = 0.2." }
    - { pattern: 'float64\s*\(', message: "Convert with float64(...) before dividing to get a decimal result." }
    - { pattern: '%q', message: "Print the empty string with the %q verb so its quotes show." }
hints:
  - "var gives a variable a name, a type and optionally a value (var count int). The short form name := value works only inside functions and the compiler works out the type. const makes a value that can never change."
  - "Variables declared without a value get a zero value: 0 for numbers, false for bool, \"\" for strings. Printf: fmt.Printf(\"Zero values: %d %t %q\\n\", count, ok, label). For the decimal division use float64(a) / float64(b)."
  - "var name string = \"Ada\"; age := 36; fmt.Println(name, \"is\", age, \"years old\")  const taxRate = 0.2; price := 50.0; total := price * (1 + taxRate); fmt.Printf(\"Total with tax: %.2f\\n\", total)  var count int; var ok bool; var label string  fmt.Println(\"7 / 2 =\", a/b); fmt.Printf(\"7 / 2.0 = %.1f\\n\", float64(a)/float64(b))"
solution:
  - name: main.go
    code: |
      package main

      import "fmt"

      func main() {
          var name string = "Ada"
          age := 36
          fmt.Println(name, "is", age, "years old")

          const taxRate = 0.2
          price := 50.0
          total := price * (1 + taxRate)
          fmt.Printf("Total with tax: %.2f\n", total)

          var count int
          var ok bool
          var label string
          fmt.Printf("Zero values: %d %t %q\n", count, ok, label)

          a := 7
          b := 2
          fmt.Println("7 / 2 =", a/b)
          fmt.Printf("7 / 2.0 = %.1f\n", float64(a)/float64(b))
      }
quiz:
  - q: "Where can you use the short declaration :=?"
    options: ["Anywhere in the file", "Only inside functions", "Only for strings", "Only for constants"]
    answer: 1
  - q: "What is the zero value of a string variable that you declared but did not assign?"
    options: ["nil", "0", "The empty string", "An error"]
    answer: 2
  - q: "What does 7 / 2 give when both are ints in Go?"
    options: ["3.5", "3", "4", "A compile error"]
    answer: 1
  - q: "Why does Go refuse to compile  var x float64 = 1.5; var n int = x ?"
    options: ["Go has no float type", "Go never converts between numeric types implicitly, you must write int(x)", "x is a constant", "n is a reserved word"]
    answer: 1
---

Variables are named boxes for values. Go is **statically typed**: every variable has a fixed type, which helps the compiler catch mistakes early. But Go also tries hard to save you typing, as you will see in this lesson.

## Declaring with var

```go
var name string = "Ada"
var age int = 36
var height float64 = 1.68
```

The shape is `var name type = value`. Unlike Java or C, the **type comes after the name**. You can leave out the type if there is a value (Go works it out): `var age = 36`. You can also leave out the value, and the variable gets its **zero value**:

```go
var count int      // 0
var price float64  // 0
var ok bool        // false
var label string   // "" (empty string)
```

Go has no "uninitialized" garbage like C: a variable always holds something sensible. That is a nice safety feature.

## The short declaration :=

Inside functions you can write the shortest form:

```go
age := 36
name := "Ada"
ratio := 0.75
```

The `:=` both creates the variable and picks its type from the value (`int`, `string`, `float64` here). It is the form you will use most. Later you assign a new value with plain `=`: `age = 37`. You cannot use `:=` outside a function, and you cannot redeclare the same name in the same scope.

You can declare several at once: `x, y := 1, 2`, and swap two values neatly: `x, y = y, x`.

## Basic types

| Type | Meaning | Example |
|---|---|---|
| `int` | whole number (size of your computer's word, usually 64-bit) | `42` |
| `float64` | decimal number | `3.14` |
| `string` | text, immutable | `"hello"` |
| `bool` | `true` or `false` | `true` |
| `byte`, `rune` | a byte; a Unicode character | `'A'` |

There are also sized integers like `int8`, `int32`, `int64`, `uint` (unsigned) and `float32`. Use plain `int` and `float64` unless you have a reason.

## Constants

A value that never changes is a **constant**:

```go
const taxRate = 0.2
const (
    Small  = 1
    Medium = 2
)
```

Trying to assign to a constant is a compile error. Constants are checked at compile time and can be "untyped": `const big = 1000000` fits into whatever number type you use it with.

## Conversions are explicit

Go never converts between number types behind your back. You must write the conversion as `Type(value)`:

```go
a := 7
b := 2
fmt.Println(a / b)                    // 3   (integer division drops the .5)
fmt.Println(float64(a) / float64(b))  // 3.5
```

Mixing types without conversion, such as `a + 1.5` where `a` is an `int` variable, is an error. It feels strict at first, but it removes a whole category of surprising bugs.

## Printing types and values

`%v` prints a value, `%T` prints its type, which is a great way to check what `:=` decided:

```go
x := 42
fmt.Printf("%v is a %T\n", x, x)   // prints: 42 is a int
```

> **Watch out:**
> - Go complains about **unused variables**: `declared and not used: count`. Delete it or use it (even `_ = count` works while you are experimenting).
> - Using `:=` on a name that already exists in the same scope gives `no new variables on left side of :=`. Use `=` instead.
> - Using `:=` at the top level of the file gives `syntax error: non-declaration statement outside function body`.
> - Mixed types give `invalid operation: a + b (mismatched types int and float64)`. Convert one side.
> - Assigning the wrong type gives `cannot use "five" (untyped string constant) as int value in assignment`.
> - Integer division silently drops the fraction, so `1 / 2` is `0`. Convert to `float64` first when you need decimals.

## Going further

Print `%T` for several values: `3`, `3.0`, `"x"`, `'x'`, `true`. Try `int(3.99)` with a variable and see that it truncates. Use `math.MaxInt64` and think about what happens on overflow.

> **Your turn:** follow the numbered steps: `var name string = "Ada"` and `age := 36`; a `const taxRate = 0.2` and the total `Total with tax: 60.00`; three variables with no value printed with `%d %t %q` as `Zero values: 0 false ""`; and finally integer division `7 / 2 = 3` versus `float64` division `7 / 2.0 = 3.5`.
