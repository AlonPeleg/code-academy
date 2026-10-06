---
title: Errors
summary: Handle failures the Go way with error values, wrapping, errors.Is, errors.As and custom error types.
level: advanced
runner: remote
files:
  - name: main.go
    code: |
      package main

      import (
          "errors"
          "fmt"
      )

      // 1. Write  func safeDivide(a, b int) (int, error)
      //    When b is 0 return 0 and errors.New("division by zero"); otherwise a / b and nil.

      // 2. Declare a package-level sentinel error:  var ErrNotFound = errors.New("not found")
      //    Write  func find(m map[string]int, key string) (int, error)
      //    When the key is missing return 0 and an error that WRAPS ErrNotFound:
      //        fmt.Errorf("find %q: %w", key, ErrNotFound)

      // 3. Define a custom error type  ValidationError  (a struct with Field and Reason strings)
      //    with a method  func (e *ValidationError) Error() string
      //    returning  "field " + e.Field + ": " + e.Reason
      //    Write  func validateAge(age int) error  that returns
      //    &ValidationError{"age", "must not be negative"} for negative ages and nil otherwise.

      func main() {
          result, err := safeDivide(10, 2)
          if err != nil {
              fmt.Println("error:", err)
          } else {
              fmt.Println("10 / 2 =", result)
          }

          _, err = safeDivide(1, 0)
          fmt.Println("error:", err)

          ages := map[string]int{"Ada": 36}
          _, err = find(ages, "zed")
          fmt.Println("error:", err)
          fmt.Println("is not found:", errors.Is(err, ErrNotFound))

          err = validateAge(-5)
          var ve *ValidationError
          if errors.As(err, &ve) {
              fmt.Println("invalid age:", ve)
          }

          if err := validateAge(30); err == nil {
              fmt.Println("age 30 ok")
          }
      }
check:
  output: |
    10 / 2 = 5
    error: division by zero
    error: find "zed": not found
    is not found: true
    invalid age: field age: must not be negative
    age 30 ok
  code:
    - { pattern: 'func\s+safeDivide\s*\(\s*a\s*,\s*b\s+int\s*\)\s*\(\s*int\s*,\s*error\s*\)', message: "Write func safeDivide(a, b int) (int, error)." }
    - { pattern: '%w', message: "Wrap ErrNotFound with fmt.Errorf and the %w verb." }
    - { pattern: 'func\s*\(\s*\w+\s+\*ValidationError\s*\)\s*Error\s*\(\s*\)\s*string', message: "Give ValidationError an Error() string method (pointer receiver)." }
hints:
  - "In Go a function that can fail returns an extra error value as its last result: (int, error). On success return the value and nil, on failure return a zero value and a non-nil error such as errors.New(\"...\")."
  - "fmt.Errorf with the %w verb wraps another error so that errors.Is can still find it. A custom error is any type with the method Error() string: type ValidationError struct { Field, Reason string }, func (e *ValidationError) Error() string { return ... }."
  - "func safeDivide(a, b int) (int, error) { if b == 0 { return 0, errors.New(\"division by zero\") }; return a / b, nil }  var ErrNotFound = errors.New(\"not found\")  func find(m map[string]int, key string) (int, error) { v, ok := m[key]; if !ok { return 0, fmt.Errorf(\"find %q: %w\", key, ErrNotFound) }; return v, nil }  type ValidationError struct { Field, Reason string }  func (e *ValidationError) Error() string { return \"field \" + e.Field + \": \" + e.Reason }  func validateAge(age int) error { if age < 0 { return &ValidationError{\"age\", \"must not be negative\"} }; return nil }"
solution:
  - name: main.go
    code: |
      package main

      import (
          "errors"
          "fmt"
      )

      func safeDivide(a, b int) (int, error) {
          if b == 0 {
              return 0, errors.New("division by zero")
          }
          return a / b, nil
      }

      var ErrNotFound = errors.New("not found")

      func find(m map[string]int, key string) (int, error) {
          v, ok := m[key]
          if !ok {
              return 0, fmt.Errorf("find %q: %w", key, ErrNotFound)
          }
          return v, nil
      }

      type ValidationError struct {
          Field  string
          Reason string
      }

      func (e *ValidationError) Error() string {
          return "field " + e.Field + ": " + e.Reason
      }

      func validateAge(age int) error {
          if age < 0 {
              return &ValidationError{"age", "must not be negative"}
          }
          return nil
      }

      func main() {
          result, err := safeDivide(10, 2)
          if err != nil {
              fmt.Println("error:", err)
          } else {
              fmt.Println("10 / 2 =", result)
          }

          _, err = safeDivide(1, 0)
          fmt.Println("error:", err)

          ages := map[string]int{"Ada": 36}
          _, err = find(ages, "zed")
          fmt.Println("error:", err)
          fmt.Println("is not found:", errors.Is(err, ErrNotFound))

          err = validateAge(-5)
          var ve *ValidationError
          if errors.As(err, &ve) {
              fmt.Println("invalid age:", ve)
          }

          if err := validateAge(30); err == nil {
              fmt.Println("age 30 ok")
          }
      }
quiz:
  - q: "How does Go usually report that a function failed?"
    options: ["By throwing an exception", "By returning an error value as the last result", "By printing to the screen", "By stopping the program"]
    answer: 1
  - q: "What does the %w verb in fmt.Errorf do?"
    options: ["Prints the word w", "Wraps an error so errors.Is and errors.As can still find it", "Writes to a file", "Formats a width"]
    answer: 1
  - q: "What is the difference between errors.Is and errors.As?"
    options: ["Is checks whether the chain contains a specific error value, As finds an error of a given type", "They are identical", "As compares strings, Is compares numbers", "Is only works on panics"]
    answer: 0
  - q: "When is panic appropriate in Go?"
    options: ["For every ordinary failure such as a missing file", "For truly unrecoverable programmer mistakes, not normal errors", "Instead of return", "Whenever a loop ends"]
    answer: 1
---

Every real program has to deal with things going wrong: a file is missing, the user typed something odd, a network call fails. Many languages use **exceptions** that fly up the call stack. Go takes a different, deliberately plain approach: failures are just **values** that functions return, and you handle them with ordinary `if` statements.

## The error type

`error` is a small built-in interface:

```go
type error interface {
    Error() string
}
```

Anything with an `Error() string` method is an error. By convention a function that can fail returns its `error` as the **last** result. `nil` means "no error":

```go
func safeDivide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}
```

The caller checks the error immediately:

```go
result, err := safeDivide(10, 0)
if err != nil {
    fmt.Println("error:", err)   // prints: error: division by zero
    return
}
fmt.Println(result)
```

This `if err != nil` pattern appears everywhere in Go. It may feel repetitive, but it keeps the error path visible in the code, so you cannot forget that a call can fail. Never ignore an error with `_` unless you are sure it does not matter.

`errors.New("text")` creates a simple error. `fmt.Errorf("could not open %s: %d", name, code)` builds one with formatting. Convention: error messages start with a lowercase letter and have no final full stop, because they are often joined into longer messages.

## Sentinel errors and wrapping

Callers often need to know **which** error happened. A **sentinel error** is a package-level variable that everyone can compare against:

```go
var ErrNotFound = errors.New("not found")
```

When you add context on the way up, **wrap** the original with `%w`:

```go
return 0, fmt.Errorf("find %q: %w", key, ErrNotFound)
// message: find "zed": not found
```

The wrapped error keeps the chain intact. Test for it with `errors.Is`, which looks through all the layers:

```go
if errors.Is(err, ErrNotFound) {
    // handle the missing case
}
```

Do **not** compare with `err == ErrNotFound` once wrapping is involved, because the wrapped error is a different value.

## Custom error types

When an error needs to carry data, define a type with an `Error()` method:

```go
type ValidationError struct {
    Field  string
    Reason string
}

func (e *ValidationError) Error() string {
    return "field " + e.Field + ": " + e.Reason
}
```

Then extract it from an error chain with `errors.As`, passing a pointer to a variable of the type you are looking for:

```go
var ve *ValidationError
if errors.As(err, &ve) {
    fmt.Println("bad field:", ve.Field)
}
```

`errors.Is` asks "is it **this** error?", `errors.As` asks "is it **this kind** of error, and give it to me".

## The nil interface trap

A famous gotcha: if a function returns the `error` interface, return a plain `nil` for success, **not** a nil pointer of your custom type:

```go
func validate() error {
    var e *ValidationError = nil
    return e          // WRONG: this is a non-nil error holding a nil pointer
}
```

The returned interface has a type inside it, so `err != nil` is `true`. Always write `return nil` explicitly.

## panic and recover

Go does have `panic`, which stops normal execution and unwinds the stack. It is for **unrecoverable programmer errors** (an impossible state, index out of range), not for expected failures like a missing file. A `deferred` function can catch a panic with `recover()`:

```go
func safe() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("recovered:", r)
        }
    }()
    panic("something terrible")
}
```

Libraries use this internally, but ordinary application code should return errors instead.

> **Watch out:**
> - Ignoring the error, `result, _ := safeDivide(1, 0)`, hides failures. You will get `0` and carry on with wrong data.
> - Using the result before checking the error. On failure the other return values are usually just zero values.
> - Wrapping with `%v` instead of `%w` keeps the text but loses the chain, so `errors.Is` returns `false`.
> - `errors.As(err, ve)` with a non-pointer gives a `go vet` complaint and a panic: the second argument must be a pointer to your variable, `&ve`.
> - Comparing errors with `==` after wrapping fails. Use `errors.Is`.
> - Forgetting that `Error()` is on the pointer type: `func (e *ValidationError) Error()` means only `*ValidationError` is an error, so return `&ValidationError{...}`.

## Going further

Add a `Unwrap() error` method to a custom error and see how `errors.Is` follows it. Use `errors.Join` to combine two errors. Write a function that opens a file with `os.Open` and wraps the failure with context.

> **Your turn:** write `safeDivide` returning `errors.New("division by zero")` for a zero divisor, the sentinel `ErrNotFound` with a `find` function that wraps it using `%w`, and a custom `ValidationError` type (pointer receiver `Error()` method) returned by `validateAge` for negative ages. `main` is given.
