---
title: Interfaces
summary: Describe behavior with interfaces that types satisfy implicitly, and use them to write flexible code.
level: intermediate
runner: remote
files:
  - name: main.go
    code: |
      package main

      import "fmt"

      // 1. Define an interface Shape with two methods:
      //        Area() float64
      //        Name() string

      type Rect struct {
          W, H float64
      }

      type Circle struct {
          R float64
      }

      // 2. Give Rect the methods Area (W * H) and Name (returns "Rect").
      // 3. Give Circle the methods Area (3 * R * R, we use 3 as pi to keep numbers simple)
      //    and Name (returns "Circle").
      //    Notice you never write "implements": having the methods is enough.

      // 4. Write  func describe(s Shape)  that prints:  <name> with area <area>
      //    for example:  Rect with area 12

      // 5. Write  func totalArea(shapes []Shape) float64  that adds up all the areas.

      func main() {
          shapes := []Shape{Rect{3, 4}, Circle{2}, Rect{1, 1}}
          for _, s := range shapes {
              describe(s)
          }
          fmt.Println("Total:", totalArea(shapes))

          var thing interface{} = Circle{1}
          if c, ok := thing.(Circle); ok {
              fmt.Println("It is a circle with radius", c.R)
          }
      }
check:
  output: |
    Rect with area 12
    Circle with area 12
    Rect with area 1
    Total: 25
    It is a circle with radius 1
  code:
    - { pattern: 'type\s+Shape\s+interface', message: "Define the interface: type Shape interface { ... }." }
    - { pattern: 'func\s*\(\s*\w+\s+Circle\s*\)\s*Area\s*\(\s*\)\s*float64', message: "Give Circle an Area() float64 method." }
    - { pattern: 'func\s+totalArea\s*\(\s*shapes\s+\[\]Shape\s*\)\s*float64', message: "Write func totalArea(shapes []Shape) float64." }
hints:
  - "An interface lists method signatures: type Shape interface { Area() float64; Name() string } (or one per line). Any type that has all those methods automatically satisfies it, with no implements keyword."
  - "Write the methods with receivers: func (r Rect) Area() float64 { return r.W * r.H } and func (c Circle) Area() float64 { return 3 * c.R * c.R }. describe uses the interface: fmt.Println(s.Name(), \"with area\", s.Area())."
  - "type Shape interface { Area() float64; Name() string }  func (r Rect) Area() float64 { return r.W * r.H }  func (r Rect) Name() string { return \"Rect\" }  func (c Circle) Area() float64 { return 3 * c.R * c.R }  func (c Circle) Name() string { return \"Circle\" }  func describe(s Shape) { fmt.Println(s.Name(), \"with area\", s.Area()) }  func totalArea(shapes []Shape) float64 { total := 0.0; for _, s := range shapes { total += s.Area() }; return total }"
solution:
  - name: main.go
    code: |
      package main

      import "fmt"

      type Shape interface {
          Area() float64
          Name() string
      }

      type Rect struct {
          W, H float64
      }

      type Circle struct {
          R float64
      }

      func (r Rect) Area() float64 {
          return r.W * r.H
      }

      func (r Rect) Name() string {
          return "Rect"
      }

      func (c Circle) Area() float64 {
          return 3 * c.R * c.R
      }

      func (c Circle) Name() string {
          return "Circle"
      }

      func describe(s Shape) {
          fmt.Println(s.Name(), "with area", s.Area())
      }

      func totalArea(shapes []Shape) float64 {
          total := 0.0
          for _, s := range shapes {
              total += s.Area()
          }
          return total
      }

      func main() {
          shapes := []Shape{Rect{3, 4}, Circle{2}, Rect{1, 1}}
          for _, s := range shapes {
              describe(s)
          }
          fmt.Println("Total:", totalArea(shapes))

          var thing interface{} = Circle{1}
          if c, ok := thing.(Circle); ok {
              fmt.Println("It is a circle with radius", c.R)
          }
      }
quiz:
  - q: "How does a Go type say that it implements an interface?"
    options: ["With the implements keyword", "By extending it", "It just has the required methods (implicit satisfaction)", "By registering it in a file"]
    answer: 2
  - q: "What can a variable of type Shape (an interface) hold?"
    options: ["Only Rect values", "Any value whose type has all the methods of Shape", "Only pointers", "Nothing"]
    answer: 1
  - q: "What does the empty interface  interface{}  (or any) accept?"
    options: ["Nothing", "Only strings", "A value of any type", "Only structs"]
    answer: 2
  - q: "What does  c, ok := thing.(Circle)  do?"
    options: ["Converts the number to a Circle", "Safely checks whether the interface holds a Circle and returns it", "Declares a new Circle type", "Always panics"]
    answer: 1
---

Imagine a function that should print the area of "any shape". A rectangle and a circle store different data, yet both can compute an area. Go captures that idea with **interfaces**: a description of behavior that many different types can share.

## What an interface is

An **interface** is a set of method signatures:

```go
type Shape interface {
    Area() float64
    Name() string
}
```

It says: "anything that has an `Area() float64` method **and** a `Name() string` method is a `Shape`". It holds no data and no code, only the promise.

## Implicit satisfaction

In Java or C# you must declare "this class implements that interface". In Go you do not. If a type simply has the methods, it **automatically** satisfies the interface:

```go
type Rect struct{ W, H float64 }

func (r Rect) Area() float64 { return r.W * r.H }
func (r Rect) Name() string  { return "Rect" }
```

`Rect` never mentions `Shape`, but it fits. This is sometimes called "duck typing, checked at compile time": if it walks like a duck and quacks like a duck, it is a duck. It means you can define an interface **after** the types exist, even for types from other packages, and nobody has to be modified.

## Using interfaces

Write functions against the interface and they will work with every present and future type that fits:

```go
func describe(s Shape) {
    fmt.Println(s.Name(), "with area", s.Area())
}

describe(Rect{3, 4})    // prints: Rect with area 12
describe(Circle{2})     // prints: Circle with area 12
```

You can also store different types in one slice, as long as the slice's element type is the interface:

```go
shapes := []Shape{Rect{3, 4}, Circle{2}}
for _, s := range shapes {
    fmt.Println(s.Area())
}
```

When you call `s.Area()` Go runs the method of the **actual** value inside, a feature called **polymorphism**. Adding a `Triangle` type later needs no change to `describe` or to the loop.

## Famous small interfaces

The standard library is full of tiny interfaces, often with a single method:

```go
type Stringer interface { String() string }  // package fmt
type error interface   { Error() string }    // built in
type Reader interface  { Read(p []byte) (n int, err error) } // package io
```

If your type has a `String() string` method, `fmt.Println` uses it to print your values. The `error` interface is why you can create your own error types, which the next lesson uses. A guideline in the Go community: **keep interfaces small**, and accept interfaces but return concrete types.

## The empty interface and type assertions

`interface{}` (written `any` in newer Go) has no methods, so **every** type satisfies it. It can hold anything, but then you know nothing about the value. To get a concrete value back, use a **type assertion**:

```go
var thing interface{} = Circle{1}

c, ok := thing.(Circle)       // safe form: ok says whether it worked
if ok {
    fmt.Println(c.R)
}
```

Without the `ok`, a wrong guess panics. A **type switch** checks several types at once:

```go
switch v := thing.(type) {
case Circle:
    fmt.Println("circle", v.R)
case Rect:
    fmt.Println("rect", v.W)
default:
    fmt.Println("something else")
}
```

Use these sparingly. If you find yourself switching on types a lot, a better interface usually exists.

## Pointer receivers and interfaces

If a method has a **pointer receiver** (`func (r *Rect) Area()`), only `*Rect` satisfies the interface, not `Rect`. You would then write `Shape(&Rect{3, 4})`. This detail causes a famous compile error (see below).

> **Watch out:**
> - Missing a method gives `cannot use Rect{...} (value of type Rect) as Shape value in array or slice literal: Rect does not implement Shape (missing method Name)`.
> - Pointer receiver mismatch: `Rect does not implement Shape (method Area has pointer receiver)`. Pass `&Rect{...}`.
> - Method names and signatures must match exactly, including return types: `Area() int` does not satisfy `Area() float64`.
> - A failed assertion without `ok` panics: `interface conversion: interface {} is Circle, not Rect`.
> - An interface variable that is `nil` calls no method: calling one panics with `nil pointer dereference`.
> - Do not make huge interfaces with ten methods. Small ones are easier to satisfy, test and reuse.

## Going further

Add a `String() string` method to `Rect` and print a `Rect` with `fmt.Println`. Add a `Triangle` and include it in the slice without changing `describe`. Write a type switch that treats `Circle` specially.

> **Your turn:** define `type Shape interface` with `Area() float64` and `Name() string`; give `Rect` and `Circle` both methods (circle area is `3 * R * R`); write `describe(s Shape)` printing `<name> with area <area>` and `totalArea(shapes []Shape) float64`. No `implements` keyword needed.
