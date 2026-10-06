---
title: Slices and maps
summary: Work with growable slices and key-value maps, including range, append, delete and the comma-ok idiom.
level: intermediate
runner: remote
files:
  - name: main.go
    code: |
      package main

      import (
          "fmt"
          "sort"
      )

      func main() {
          fruits := []string{"apple", "banana"}
          nums := []int{3, 1, 4, 1, 5, 9, 2, 6}

          // 1. Append "cherry" to fruits, then print:  Fruits: [apple banana cherry] 3
          //    (print the slice and its length len(fruits))

          // 2. Print the part of nums from index 1 up to (not including) 3:  Slice: [1 4]

          // 3. Use  for _, n := range nums  to add up the EVEN numbers.
          //    Print:  Sum of evens: 12

          ages := map[string]int{"Ada": 36, "Linus": 28}

          // 4. Add "Grace" with age 45, then delete "Linus".
          // 5. Print  Ada is 36   (look the value up in the map).
          // 6. Look up "Zed" with the comma-ok form (v, ok := ages["Zed"])
          //    and print:  Zed found: false
          // 7. Print the whole map with fmt.Println(ages)  -> map[Ada:36 Grace:45]
          // 8. Collect the keys into a []string, sort them with sort.Strings and print:
          //    Keys: [Ada Grace]

      }
check:
  output: |
    Fruits: [apple banana cherry] 3
    Slice: [1 4]
    Sum of evens: 12
    Ada is 36
    Zed found: false
    map[Ada:36 Grace:45]
    Keys: [Ada Grace]
  code:
    - { pattern: 'append\s*\(', message: "Use append(fruits, \"cherry\") to grow a slice." }
    - { pattern: 'range\s+nums', message: "Loop with range over nums." }
    - { pattern: 'delete\s*\(\s*ages', message: "Use delete(ages, \"Linus\") to remove a key." }
    - { pattern: ',\s*ok\s*:=\s*ages\[', message: "Use the comma-ok form: v, ok := ages[\"Zed\"]." }
    - { pattern: 'sort\.Strings\s*\(', message: "Sort the keys with sort.Strings." }
hints:
  - "A slice grows with append, and it returns the new slice, so you must assign it back: fruits = append(fruits, \"cherry\"). A sub-slice is written nums[1:3]. A map is set with m[key] = value and a key is removed with delete(m, key)."
  - "Looking up a missing key gives the zero value, so use  v, ok := ages[\"Zed\"]  where ok tells you whether the key existed. To collect keys: keys := []string{} then for k := range ages { keys = append(keys, k) }, then sort.Strings(keys)."
  - "fruits = append(fruits, \"cherry\")  fmt.Println(\"Fruits:\", fruits, len(fruits))  fmt.Println(\"Slice:\", nums[1:3])  sum := 0; for _, n := range nums { if n%2 == 0 { sum += n } }  ages[\"Grace\"] = 45; delete(ages, \"Linus\")  fmt.Println(\"Ada is\", ages[\"Ada\"])  _, ok := ages[\"Zed\"]  fmt.Println(\"Zed found:\", ok)"
solution:
  - name: main.go
    code: |
      package main

      import (
          "fmt"
          "sort"
      )

      func main() {
          fruits := []string{"apple", "banana"}
          nums := []int{3, 1, 4, 1, 5, 9, 2, 6}

          fruits = append(fruits, "cherry")
          fmt.Println("Fruits:", fruits, len(fruits))

          fmt.Println("Slice:", nums[1:3])

          sum := 0
          for _, n := range nums {
              if n%2 == 0 {
                  sum += n
              }
          }
          fmt.Println("Sum of evens:", sum)

          ages := map[string]int{"Ada": 36, "Linus": 28}

          ages["Grace"] = 45
          delete(ages, "Linus")
          fmt.Println("Ada is", ages["Ada"])

          _, ok := ages["Zed"]
          fmt.Println("Zed found:", ok)

          fmt.Println(ages)

          keys := []string{}
          for k := range ages {
              keys = append(keys, k)
          }
          sort.Strings(keys)
          fmt.Println("Keys:", keys)
      }
quiz:
  - q: "What does  fruits = append(fruits, \"x\")  need the assignment for?"
    options: ["It is optional decoration", "append returns the new slice, which may be a different underlying array", "To sort the slice", "To make the slice a map"]
    answer: 1
  - q: "What is the slice expression nums[1:3]?"
    options: ["Elements at index 1, 2 and 3", "Elements at index 1 and 2", "Elements at index 3 only", "The first three elements"]
    answer: 1
    explain: "The start is included and the end is excluded, so nums[1:3] has two elements."
  - q: "What does  v, ok := m[key]  give when the key is missing?"
    options: ["A runtime panic", "v is the zero value and ok is false", "v is nil and ok is true", "A compile error"]
    answer: 1
  - q: "Is the iteration order of  for k, v := range myMap  guaranteed?"
    options: ["Yes, insertion order", "Yes, sorted order", "No, it is deliberately unspecified and varies", "Yes, reverse order"]
    answer: 2
---

Real programs work with collections: lists of scores, tables of names and ages. Go has two built-in collection types you will use constantly: **slices** (ordered, growable lists) and **maps** (key to value lookups).

## Arrays vs slices

Go does have **arrays** with a fixed length, such as `[3]int`, but you will rarely use them directly. The workhorse is the **slice**, a flexible view onto an array whose length can change:

```go
nums := []int{3, 1, 4, 1, 5}   // a slice literal: note the empty []
fmt.Println(nums[0])           // 3 (indexes start at 0)
nums[1] = 10                   // change an element
fmt.Println(len(nums))         // 5
```

You can also make an empty slice with `var s []int` (its value is `nil`, which is still safe to use with `len` and `append`) or with `make([]int, 3)` which gives `[0 0 0]`.

### append

A slice grows with the built-in `append`. It **returns** the slice, so assign the result back:

```go
fruits := []string{"apple", "banana"}
fruits = append(fruits, "cherry")
fruits = append(fruits, "date", "elder")
fmt.Println(fruits, len(fruits))  // [apple banana cherry date elder] 5
```

Behind the scenes a slice has three parts: a pointer to an array, a **length** (`len`) and a **capacity** (`cap`, how much room there is before Go must allocate a bigger array). When `append` runs out of room it creates a bigger array and copies things over, which is why the result can be a different slice.

### Slicing a slice

`s[low:high]` gives the elements from `low` up to but **not including** `high`:

```go
nums := []int{3, 1, 4, 1, 5, 9}
fmt.Println(nums[1:3])  // [1 4]
fmt.Println(nums[:2])   // [3 1]
fmt.Println(nums[4:])   // [5 9]
```

A sub-slice **shares** the same memory as the original. Changing an element through one shows up in the other. Use `copy` or `append([]int{}, s...)` to make an independent copy.

## range

`for ... range` walks over a slice, giving you the **index** and a **copy of the value**:

```go
for i, n := range nums {
    fmt.Println(i, n)
}
for _, n := range nums {   // _ throws away the index
    fmt.Println(n)
}
```

## Maps

A map stores **key to value** pairs with fast lookup:

```go
ages := map[string]int{"Ada": 36, "Linus": 28}
ages["Grace"] = 45          // add or update
fmt.Println(ages["Ada"])    // 36
delete(ages, "Linus")       // remove
fmt.Println(len(ages))      // 2
```

The type `map[string]int` reads "map from string to int". Create an empty one with `make(map[string]int)`. Writing to a `nil` map crashes, so always create the map before you use it.

### The comma-ok idiom

Looking up a key that does not exist gives the **zero value** (0 for ints), so how do you tell "missing" apart from "really 0"? Ask for a second value:

```go
age, ok := ages["Zed"]
if !ok {
    fmt.Println("no such person")
}
```

`ok` is `true` when the key exists. You will see this idiom everywhere in Go.

### Order is not guaranteed

Ranging over a map visits keys in **random order**, on purpose, so that nobody depends on it. If you want sorted output, collect the keys into a slice and sort it with the `sort` package:

```go
keys := []string{}
for k := range ages {
    keys = append(keys, k)
}
sort.Strings(keys)
```

(Printing the whole map with `fmt.Println(ages)` is a special case: `fmt` sorts the keys for you.)

> **Watch out:**
> - Forgetting the assignment, `append(fruits, "x")` alone, gives `append(fruits, "x") (value of type []string) is not used`.
> - Going past the end crashes: `panic: runtime error: index out of range [5] with length 3`.
> - Writing to a map you only declared (`var m map[string]int; m["a"] = 1`) gives `panic: assignment to entry in nil map`. Use `make` or a literal.
> - Keys of a map must be comparable. A slice cannot be a key (`invalid map key type []int`).
> - Because sub-slices share memory, modifying one can change another. This surprises many beginners.
> - `for _, n := range nums { n = n * 2 }` does not change the slice, since `n` is a copy. Write `nums[i] = ...` using the index.

## Going further

Count word frequencies in a sentence with `strings.Fields` and a `map[string]int`. Build a 2D slice (`[][]int`). Print `len` and `cap` of a slice after each `append` to watch the capacity double.

> **Your turn:** append `"cherry"` to `fruits` and print `Fruits: [apple banana cherry] 3`; print `nums[1:3]`; sum the even numbers with `range`; add `Grace` (45) and delete `Linus` from the map, print Ada's age, test for `"Zed"` with comma-ok, print the whole map, and print the sorted keys with `sort.Strings`.
