---
title: Structs and methods
summary: Group data into structs, attach methods to them, and learn when a method needs a pointer receiver.
level: intermediate
runner: remote
files:
  - name: main.go
    code: |
      package main

      import "fmt"

      // 1. Define a struct type Rect with two int fields: Width and Height.

      // 2. Write a method  func (r Rect) Area() int  that returns Width * Height.

      // 3. Write a method  func (r Rect) Perimeter() int  that returns 2 * (Width + Height).

      // 4. Write a method with a POINTER receiver:  func (r *Rect) Scale(factor int)
      //    that multiplies both Width and Height by factor (it must change the original).

      // 5. Write a constructor function  func NewSquare(side int) *Rect
      //    that returns a pointer to a Rect whose width and height are both side.

      func main() {
          r := Rect{Width: 3, Height: 4}
          fmt.Println(r)
          fmt.Printf("%+v\n", r)
          fmt.Println("Area:", r.Area())
          fmt.Println("Perimeter:", r.Perimeter())

          r.Scale(2)
          fmt.Println("After scale:", r.Width, "x", r.Height, "area", r.Area())

          sq := NewSquare(5)
          fmt.Println("Square area:", sq.Area())
      }
check:
  output: |
    {3 4}
    {Width:3 Height:4}
    Area: 12
    Perimeter: 14
    After scale: 6 x 8 area 48
    Square area: 25
  code:
    - { pattern: 'type\s+Rect\s+struct', message: "Define the type with: type Rect struct { ... }." }
    - { pattern: 'func\s*\(\s*\w+\s+Rect\s*\)\s*Area\s*\(\s*\)\s*int', message: "Write the method func (r Rect) Area() int." }
    - { pattern: 'func\s*\(\s*\w+\s+\*Rect\s*\)\s*Scale\s*\(', message: "Scale needs a pointer receiver: func (r *Rect) Scale(factor int)." }
    - { pattern: 'func\s+NewSquare\s*\(\s*side\s+int\s*\)\s*\*Rect', message: "Write func NewSquare(side int) *Rect." }
hints:
  - "A struct groups named fields: type Rect struct { Width int; Height int } (or one field per line). A method is a function with a receiver in parentheses before its name: func (r Rect) Area() int { ... }."
  - "Methods with a value receiver (r Rect) work on a copy, so they cannot change the original. To modify the original use a pointer receiver: func (r *Rect) Scale(factor int) { r.Width *= factor; r.Height *= factor }. A constructor can return &Rect{Width: side, Height: side}."
  - "type Rect struct { Width int; Height int }  func (r Rect) Area() int { return r.Width * r.Height }  func (r Rect) Perimeter() int { return 2 * (r.Width + r.Height) }  func (r *Rect) Scale(factor int) { r.Width *= factor; r.Height *= factor }  func NewSquare(side int) *Rect { return &Rect{Width: side, Height: side} }"
solution:
  - name: main.go
    code: |
      package main

      import "fmt"

      type Rect struct {
          Width  int
          Height int
      }

      func (r Rect) Area() int {
          return r.Width * r.Height
      }

      func (r Rect) Perimeter() int {
          return 2 * (r.Width + r.Height)
      }

      func (r *Rect) Scale(factor int) {
          r.Width *= factor
          r.Height *= factor
      }

      func NewSquare(side int) *Rect {
          return &Rect{Width: side, Height: side}
      }

      func main() {
          r := Rect{Width: 3, Height: 4}
          fmt.Println(r)
          fmt.Printf("%+v\n", r)
          fmt.Println("Area:", r.Area())
          fmt.Println("Perimeter:", r.Perimeter())

          r.Scale(2)
          fmt.Println("After scale:", r.Width, "x", r.Height, "area", r.Area())

          sq := NewSquare(5)
          fmt.Println("Square area:", sq.Area())
      }
quiz:
  - q: "Go has no classes. What do you use instead to group data?"
    options: ["Arrays", "Structs", "Packages only", "Interfaces only"]
    answer: 1
  - q: "In  func (r Rect) Area() int  what is (r Rect)?"
    options: ["A parameter you pass when calling", "The receiver: the value the method is called on", "The return type", "A comment"]
    answer: 1
  - q: "When do you need a pointer receiver such as (r *Rect)?"
    options: ["When the method must modify the original value (or the struct is large)", "Never, they are identical", "Only for strings", "Only for exported methods"]
    answer: 0
  - q: "What does the & operator do in  &Rect{Width: 5, Height: 5} ?"
    options: ["Joins two values", "Takes the address, giving a pointer to the new Rect", "Compares two Rects", "Declares a constant"]
    answer: 1
---

Go has no classes, but it has something simpler that does the same job: **structs** for data and **methods** you attach to your own types. In this lesson you build your own types and learn the important difference between a value and a pointer.

## Defining a struct

A **struct** is a collection of named **fields**:

```go
type Rect struct {
    Width  int
    Height int
}
```

`type Rect struct { ... }` creates a new type called `Rect`. Create values with a **struct literal**:

```go
r := Rect{Width: 3, Height: 4}
fmt.Println(r.Width)     // 3
r.Height = 10            // fields are read and changed with a dot
```

Fields you leave out get their zero value (`Rect{}` is `{0 0}`). Printing a struct with `Println` gives `{3 4}`, with `%+v` you also get the field names: `{Width:3 Height:4}`. Capitalised field names (`Width`) are exported; lowercase ones are private to the package, the same rule as everywhere in Go.

## Methods

A **method** is a function attached to a type through a **receiver**, written in parentheses between `func` and the name:

```go
func (r Rect) Area() int {
    return r.Width * r.Height
}

fmt.Println(r.Area())    // 12
```

`r` is the receiver: inside the method it is the value the method was called on (like `this` in other languages, but you choose the name, and by convention it is a short one or two letters). You can attach methods to any type you define, not only structs.

## Value or pointer receiver?

This is the key idea of the lesson. With a **value receiver** `(r Rect)` the method gets a **copy** of the struct. Changing the copy does not touch the original:

```go
func (r Rect) BrokenScale(f int) {
    r.Width *= f      // changes only the copy
}
```

To change the original, use a **pointer receiver**, written `(r *Rect)`. A pointer holds the **address** of a value instead of the value itself:

```go
func (r *Rect) Scale(factor int) {
    r.Width *= factor
    r.Height *= factor
}

r := Rect{Width: 3, Height: 4}
r.Scale(2)
fmt.Println(r)   // {6 8}
```

Go is helpful: you can write `r.Scale(2)` and it automatically takes `&r` for you. Also, `r.Width` works on a pointer without any special dereferencing syntax.

A good rule of thumb: use a pointer receiver if the method **modifies** the struct or if the struct is **large** (copying is wasteful). For consistency, if one method of a type needs a pointer receiver, make them all use pointers.

## Pointers in two sentences

`&x` gives the address of `x`, and `*p` gives the value that pointer `p` points at. Unlike C there is **no pointer arithmetic**, and Go collects unused memory for you (garbage collection), so you do not free anything.

## Constructor functions

Go has no special constructors. By convention you write a normal function called `NewSomething` that returns a ready-to-use value, often a pointer:

```go
func NewSquare(side int) *Rect {
    return &Rect{Width: side, Height: side}
}
```

`&Rect{...}` creates the struct and returns its address. It is safe to return a pointer to a local value in Go, because the compiler keeps it alive for as long as it is needed. A constructor is the right place to check inputs or set defaults.

## Embedding: composition instead of inheritance

Go prefers **composition**. You can embed one struct in another, and its fields and methods are promoted:

```go
type Named struct{ Name string }
func (n Named) Hello() string { return "Hi " + n.Name }

type Employee struct {
    Named
    Salary int
}

e := Employee{Named{"Ada"}, 5000}
fmt.Println(e.Hello(), e.Name)   // Hi Ada Ada
```

> **Watch out:**
> - Expecting a value receiver to change the struct: `r.BrokenScale(2)` runs without error but nothing changes, because the method worked on a copy.
> - Mixing up types gives errors like `cannot use r (variable of type Rect) as *Rect value`. Use `&r` to pass the address.
> - Using a lowercase method name or field from another package gives `r.area undefined (cannot refer to unexported method area)`.
> - A nil pointer receiver that you then dereference crashes with `panic: runtime error: invalid memory address or nil pointer dereference`.
> - Unkeyed literals like `Rect{3, 4}` work but break when you add or reorder fields. Prefer `Rect{Width: 3, Height: 4}`.
> - Each method needs the receiver type's name exactly: `func (r Rectangle) Area()` for a type called `Rect` gives `undefined: Rectangle`.

## Going further

Add a `String() string` method to `Rect` and print `r` with `Println`: `fmt` calls it automatically. Make a `Circle` struct with its own `Area` method (the interfaces lesson will let both types share a use). Compare two structs with `==`.

> **Your turn:** define `type Rect struct` with `Width` and `Height` ints, the methods `Area` and `Perimeter` (value receivers), `Scale(factor int)` with a **pointer** receiver that changes the original, and `NewSquare(side int) *Rect`. The `main` function is given.
