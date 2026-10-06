---
title: Control flow with for, if and switch
summary: Make decisions with if and switch, and repeat with Go's single loop keyword, for.
level: beginner
runner: remote
files:
  - name: main.go
    code: |
      package main

      import "fmt"

      func main() {
          // 1. FizzBuzz for 1 to 15 with a for loop, one result per line:
          //    divisible by 15 -> FizzBuzz, by 3 -> Fizz, by 5 -> Buzz, otherwise the number.
          //    Use a switch with no expression (switch { case ...: }) for the choices.

          // 2. Count down with a loop that has only a condition (Go's "while"):
          //    start n at 3 and print 3, 2, 1 each on its own line, then print  Liftoff!

          // 3. Print the name of day number 3 using a switch on the value, where
          //    1 is Monday, 2 is Tuesday, 3 is Wednesday and anything else is "Unknown":
          //    Day 3 is Wednesday

          // 4. Use an if with an init statement:  if sq := 6 * 6; sq > 30 { ... }
          //    and print:  36 is big

      }
check:
  output: |
    1
    2
    Fizz
    4
    Buzz
    Fizz
    7
    8
    Fizz
    Buzz
    11
    Fizz
    13
    14
    FizzBuzz
    3
    2
    1
    Liftoff!
    Day 3 is Wednesday
    36 is big
  code:
    - { pattern: 'for\s+\w+\s*:=\s*1\s*;', message: "Use the three-part for loop: for i := 1; i <= 15; i++." }
    - { pattern: 'switch\s*\{', message: "Use a switch with no expression: switch { case i%15 == 0: ... }." }
    - { pattern: 'for\s+n\s*>\s*0', message: "Use a condition-only loop: for n > 0 { ... }." }
    - { pattern: 'if\s+\w+\s*:=\s*[^;]+;', message: "Use an if with an init statement: if sq := 6 * 6; sq > 30 { ... }." }
hints:
  - "Go has only one loop keyword: for. The classic form is  for i := 1; i <= 15; i++ { ... }  (no parentheses around the parts). A switch with no value after the word switch lets each case be a true/false condition."
  - "Inside the loop:  switch { case i%15 == 0: fmt.Println(\"FizzBuzz\") case i%3 == 0: ... default: fmt.Println(i) }  No break needed, Go stops after the matching case. The countdown is  n := 3; for n > 0 { fmt.Println(n); n-- }."
  - "for i := 1; i <= 15; i++ { switch { case i%15 == 0: fmt.Println(\"FizzBuzz\") case i%3 == 0: fmt.Println(\"Fizz\") case i%5 == 0: fmt.Println(\"Buzz\") default: fmt.Println(i) } }  n := 3; for n > 0 { fmt.Println(n); n-- }; fmt.Println(\"Liftoff!\")  day := 3; switch day { case 1: ... case 3: fmt.Println(\"Day 3 is Wednesday\") }  if sq := 6 * 6; sq > 30 { fmt.Println(sq, \"is big\") }"
solution:
  - name: main.go
    code: |
      package main

      import "fmt"

      func main() {
          for i := 1; i <= 15; i++ {
              switch {
              case i%15 == 0:
                  fmt.Println("FizzBuzz")
              case i%3 == 0:
                  fmt.Println("Fizz")
              case i%5 == 0:
                  fmt.Println("Buzz")
              default:
                  fmt.Println(i)
              }
          }

          n := 3
          for n > 0 {
              fmt.Println(n)
              n--
          }
          fmt.Println("Liftoff!")

          day := 3
          switch day {
          case 1:
              fmt.Println("Day 1 is Monday")
          case 2:
              fmt.Println("Day 2 is Tuesday")
          case 3:
              fmt.Println("Day 3 is Wednesday")
          default:
              fmt.Println("Unknown")
          }

          if sq := 6 * 6; sq > 30 {
              fmt.Println(sq, "is big")
          }
      }
quiz:
  - q: "How many loop keywords does Go have?"
    options: ["Three: for, while and do", "Two: for and while", "One: for", "None, it uses recursion"]
    answer: 2
  - q: "Do you need to write break at the end of each switch case in Go?"
    options: ["Yes, always", "No, Go stops after the matching case automatically", "Only for strings", "Only in the default case"]
    answer: 1
  - q: "What does for { ... } with nothing after for do?"
    options: ["A compile error", "Runs once", "Loops forever until you break or return", "Runs zero times"]
    answer: 2
  - q: "Are parentheses needed around an if condition in Go?"
    options: ["Yes, always", "No, but the braces are always required", "No, and braces are optional too", "Only for strings"]
    answer: 1
---

Programs need to make decisions and repeat things. Go's control flow is small and tidy: `if`, `switch` and just **one** loop keyword, `for`.

## if and else

```go
temperature := 28
if temperature > 25 {
    fmt.Println("hot")
} else if temperature > 15 {
    fmt.Println("nice")
} else {
    fmt.Println("cold")
}
```

Differences from many other languages: the condition has **no parentheses**, the braces are **always required**, and the `else` must sit on the same line as the closing brace `}`.

Comparison operators are `== != < <= > >=`, and you combine conditions with `&&` (and), `||` (or) and `!` (not).

### if with an init statement

An `if` may start with a short statement, then a semicolon, then the condition. The variable lives only inside the `if/else` chain, keeping your code tidy:

```go
if sq := 6 * 6; sq > 30 {
    fmt.Println(sq, "is big")
}
// sq does not exist here
```

You will see this constantly in Go code for error handling, as in `if err := doThing(); err != nil { ... }`.

## The for loop

Go has no `while` or `do-while`. The single keyword `for` covers all of them.

**Three-part loop** (like C, without parentheses):

```go
for i := 0; i < 3; i++ {
    fmt.Println(i)      // prints 0, 1, 2
}
```

The parts are: init (`i := 0`, once), condition (`i < 3`, before each round), post (`i++`, after each round).

**Condition-only loop** (Go's `while`):

```go
n := 3
for n > 0 {
    fmt.Println(n)
    n--
}
```

**Infinite loop**, ended with `break` or `return`:

```go
for {
    // runs forever unless something breaks out
    break
}
```

`break` leaves the loop, `continue` jumps to the next round. The `range` form for looping over collections comes in the slices lesson.

## switch

A `switch` compares one value against several cases:

```go
day := 3
switch day {
case 1:
    fmt.Println("Monday")
case 2, 3:
    fmt.Println("Tuesday or Wednesday")
default:
    fmt.Println("Other")
}
```

Go's switch is friendlier than C's: only the **matching** case runs (no accidental fall-through, no `break` needed), a case may list several values, and the cases can be strings, not only numbers. If you really want to continue into the next case, write `fallthrough`.

### switch without a value

Leave out the value after `switch` and each case becomes a **condition**. It is a clean replacement for long `if / else if` chains:

```go
switch {
case score >= 90:
    fmt.Println("A")
case score >= 80:
    fmt.Println("B")
default:
    fmt.Println("keep trying")
}
```

The cases are tried from top to bottom and the first true one wins, so put the most specific test first. For FizzBuzz that means checking "divisible by 15" before "divisible by 3".

## The remainder operator

`i % 3 == 0` is true when `i` divides evenly by 3. In Go, `%` works on integers only.

> **Watch out:**
> - Writing parentheses is allowed but unusual, and putting the `{` on the next line is a syntax error: `unexpected newline, expected { after if clause`.
> - Writing `else` on its own line after the closing `}` gives `syntax error: unexpected else, expected }`. Keep `} else {` together on one line.
> - Using `=` instead of `==` in a condition gives a syntax error such as `cannot use x = 5 as value`. 
> - Looking for `while` gives `undefined: while`. Use `for condition { }`.
> - An infinite loop (condition never false) freezes the program. Make sure something changes inside, like `n--`.
> - `i++` is a statement, not an expression, so `x := i++` or `fmt.Println(i++)` is a syntax error.

## Going further

Use `continue` to skip even numbers in a loop. Write a nested loop that prints a small multiplication table. Try a `switch` on a string such as `"go"` or `"rust"`, and use `fallthrough` once to see what it does.

> **Your turn:** print FizzBuzz for 1 to 15 using a three-part `for` loop with a value-less `switch`; count down 3, 2, 1 with a `for n > 0` loop and print `Liftoff!`; use a `switch day` to print `Day 3 is Wednesday`; and use an `if sq := 6 * 6; sq > 30` to print `36 is big`.
