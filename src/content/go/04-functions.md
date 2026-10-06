---
title: Functions and multiple return values
summary: Write functions with parameters, return several values at once, use variadic parameters, closures and defer.
level: intermediate
runner: remote
files:
  - name: main.go
    code: |
      package main

      import "fmt"

      // 1. Write  func square(n int) int  that returns n * n.

      // 2. Write  func divmod(a, b int) (int, int)  that returns the quotient and the remainder.

      // 3. Write a variadic function  func minMax(nums ...int) (min, max int)
      //    that finds the smallest and the largest of any number of ints.
      //    (Use named results; start both from nums[0].)

      // 4. Write  func makeCounter() func() int  that returns a function.
      //    Each time you call that function it returns the next number: 1, 2, 3, ...
      //    (Keep a variable inside makeCounter and increase it in the closure.)

      func main() {
          defer fmt.Println("done")

          fmt.Println("square(5) =", square(5))

          q, r := divmod(17, 5)
          fmt.Printf("17 / 5 = %d remainder %d\n", q, r)

          lo, hi := minMax(4, 9, 1, 7)
          fmt.Printf("min %d max %d\n", lo, hi)

          next := makeCounter()
          fmt.Println("counter:", next(), next(), next())
      }
check:
  output: |
    square(5) = 25
    17 / 5 = 3 remainder 2
    min 1 max 9
    counter: 1 2 3
    done
  code:
    - { pattern: 'func\s+square\s*\(\s*n\s+int\s*\)\s*int', message: "Write func square(n int) int." }
    - { pattern: 'func\s+divmod\s*\(\s*a\s*,\s*b\s+int\s*\)\s*\(\s*int\s*,\s*int\s*\)', message: "Write func divmod(a, b int) (int, int)." }
    - { pattern: 'nums\s+\.\.\.int', message: "Make minMax variadic: nums ...int." }
    - { pattern: 'func\s+makeCounter\s*\(\s*\)\s*func\s*\(\s*\)\s*int', message: "Write func makeCounter() func() int." }
hints:
  - "A Go function header is: func name(parameters) resultType. A function may return several values by listing the types in parentheses, e.g. (int, int), and return a, b."
  - "divmod returns a / b, a % b. A variadic parameter nums ...int behaves like a slice, so you can loop with for _, n := range nums. A closure is a function value that remembers variables from where it was created: return func() int { count++; return count }."
  - "func square(n int) int { return n * n }  func divmod(a, b int) (int, int) { return a / b, a % b }  func minMax(nums ...int) (min, max int) { min, max = nums[0], nums[0]; for _, n := range nums { if n < min { min = n }; if n > max { max = n } }; return }  func makeCounter() func() int { count := 0; return func() int { count++; return count } }"
solution:
  - name: main.go
    code: |
      package main

      import "fmt"

      func square(n int) int {
          return n * n
      }

      func divmod(a, b int) (int, int) {
          return a / b, a % b
      }

      func minMax(nums ...int) (min, max int) {
          min, max = nums[0], nums[0]
          for _, n := range nums {
              if n < min {
                  min = n
              }
              if n > max {
                  max = n
              }
          }
          return
      }

      func makeCounter() func() int {
          count := 0
          return func() int {
              count++
              return count
          }
      }

      func main() {
          defer fmt.Println("done")

          fmt.Println("square(5) =", square(5))

          q, r := divmod(17, 5)
          fmt.Printf("17 / 5 = %d remainder %d\n", q, r)

          lo, hi := minMax(4, 9, 1, 7)
          fmt.Printf("min %d max %d\n", lo, hi)

          next := makeCounter()
          fmt.Println("counter:", next(), next(), next())
      }
quiz:
  - q: "In  func add(a int, b int) int  where does the return type go?"
    options: ["Before the name", "After the parameter list", "Inside the braces", "It is not allowed"]
    answer: 1
  - q: "What does  q, r := divmod(17, 5)  do?"
    options: ["Calls divmod twice", "Receives both returned values into q and r", "Only keeps the first value", "Is a syntax error"]
    answer: 1
  - q: "What does a defer statement do?"
    options: ["Skips a line", "Runs the call when the surrounding function is about to return", "Runs the call in the background", "Delays the program by one second"]
    answer: 1
  - q: "What is a closure?"
    options: ["A function that ends the program", "A function value that remembers the variables around it", "A closed file", "A private function"]
    answer: 1
---

Functions let you name a piece of work and reuse it. Go functions have a few features that are unusual and very handy: **multiple return values**, **variadic parameters**, **functions as values** and **defer**.

## Declaring a function

```go
func square(n int) int {
    return n * n
}
```

* `func` starts the declaration.
* `square` is the name.
* `(n int)` lists the parameters. Remember: in Go the **name comes first, then the type**.
* The `int` after the parentheses is the **return type**. A function that returns nothing simply has no return type.
* `return n * n` sends the result back.

When neighbouring parameters share a type you can write the type once: `func add(a, b int) int`.

```go
fmt.Println(square(5))   // prints: 25
```

## Multiple return values

A function may return **several** values. List the types in parentheses:

```go
func divmod(a, b int) (int, int) {
    return a / b, a % b
}

q, r := divmod(17, 5)
fmt.Println(q, r)   // prints: 3 2
```

This is one of the most useful features in Go, and the reason is that the last value is very often an `error`. You will see the pattern `result, err := doSomething()` all the time (the errors lesson covers it). If you do not need one of the values, throw it away with the blank identifier `_`:

```go
q, _ := divmod(17, 5)
```

### Named results

You can name the results. They then act like variables that start at their zero value, and a bare `return` sends back their current values:

```go
func minMax(nums ...int) (min, max int) {
    min, max = nums[0], nums[0]
    for _, n := range nums {
        if n < min { min = n }
        if n > max { max = n }
    }
    return
}
```

Named results document what each value means. Use them for short functions, since a bare `return` in a long one gets hard to follow.

## Variadic functions

A final parameter written `name ...Type` accepts any number of arguments, which arrive inside the function as a **slice**:

```go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

sum()          // 0
sum(1, 2, 3)   // 6
```

You already used a variadic function: `fmt.Println` takes any number of values. To pass an existing slice, add `...` after it: `sum(mySlice...)`.

## Functions are values

Functions can be stored in variables, passed to other functions and returned from functions:

```go
double := func(x int) int { return x * 2 }
fmt.Println(double(4))   // 8
```

A function written inside another function that uses the outer function's variables is a **closure**. The variables stay alive as long as the closure does:

```go
func makeCounter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

next := makeCounter()
fmt.Println(next(), next(), next())  // 1 2 3
```

Each call to `makeCounter` creates its own private `count`, so two counters never interfere.

## defer

`defer` schedules a function call to run **when the surrounding function returns**, no matter how. It is perfect for cleanup such as closing a file, because the cleanup sits right next to the code that needs it:

```go
func main() {
    defer fmt.Println("goodbye")
    fmt.Println("hello")
}
// prints: hello
//         goodbye
```

With several defers, the **last** one deferred runs **first**.

## Arguments are copies

Go passes arguments **by value**: the function receives a copy, so changing a plain parameter does not change the caller's variable. (Pointers, covered with structs, let a function change the original.)

> **Watch out:**
> - Forgetting to return a value gives `missing return`. Every path through a function with a result must end in `return`.
> - Receiving the wrong number of results, `x := divmod(17, 5)`, gives `assignment mismatch: 1 variable but divmod returns 2 values`.
> - Declaring a variable from a result and never using it gives `declared and not used`. Use `_` for values you ignore.
> - Calling `square("5")` gives `cannot use "5" (untyped string constant) as int value in argument to square`.
> - Go has **no function overloading**: two functions with the same name in one package is an error (`square redeclared in this block`).
> - A function name that starts with a lowercase letter is private to its package, one starting with a capital is exported.

## Going further

Write `func apply(nums []int, f func(int) int) []int` that applies a function to every element, and call it with `square`. Make a second counter and check the two are independent. Defer two prints and confirm the reverse order.

> **Your turn:** write `square`, `divmod` (returning quotient and remainder), the variadic `minMax(nums ...int) (min, max int)` with named results, and `makeCounter() func() int` that returns a closure counting 1, 2, 3. The `main` function is already written. Note `defer` makes `done` print last.
