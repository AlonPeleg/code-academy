---
title: Goroutines and channels
summary: Run work concurrently with goroutines, wait with sync.WaitGroup, communicate over channels and protect shared data with a mutex.
level: advanced
runner: remote
files:
  - name: main.go
    code: |
      package main

      import (
          "fmt"
          "sort"
          "sync"
      )

      func main() {
          // PART 1: WaitGroup.
          // Create  results := make([]int, 5)  and a  var wg sync.WaitGroup.
          // Start 5 goroutines, one per index i from 0 to 4. Each one stores i*i in results[i]
          // and calls wg.Done() when finished. Call wg.Add(1) BEFORE starting each goroutine
          // and wg.Wait() after the loop. Then print:  Squares: [0 1 4 9 16]

          // PART 2: a channel.
          // Create  ch := make(chan int).  Start ONE goroutine that sends the numbers 1 to 5
          // into ch and then closes it (close(ch)).
          // In main, use  for n := range ch  to add the numbers up. Print:  Sum: 15

          // PART 3: a mutex.
          // Start 100 goroutines that each add 1 to a shared counter. Protect the counter
          // with a sync.Mutex (Lock before the increment, Unlock after). Print:  Counter: 100

          // PART 4: collecting results.
          // Start 4 goroutines (i from 1 to 4), each sends  i * 2  on a channel.
          // In main receive exactly 4 values into a slice, sort it with sort.Ints and print:
          // Doubled: [2 4 6 8]    (goroutines finish in any order, sorting makes it stable)

      }
check:
  output: |
    Squares: [0 1 4 9 16]
    Sum: 15
    Counter: 100
    Doubled: [2 4 6 8]
  code:
    - { pattern: 'go\s+func', message: "Start goroutines with the go keyword: go func() { ... }()." }
    - { pattern: 'sync\.WaitGroup', message: "Use a sync.WaitGroup to wait for the goroutines." }
    - { pattern: '\.Wait\s*\(\s*\)', message: "Call wg.Wait() so main does not finish early." }
    - { pattern: 'make\s*\(\s*chan\s+int', message: "Create a channel with make(chan int)." }
    - { pattern: 'close\s*\(', message: "Close the channel when the sender is done." }
    - { pattern: 'sync\.Mutex', message: "Protect the shared counter with a sync.Mutex." }
hints:
  - "Start a goroutine by putting go in front of a function call: go func() { ... }(). A WaitGroup counts running goroutines: wg.Add(1) before starting, defer wg.Done() inside, wg.Wait() in main to block until the count is zero."
  - "Pass the loop variable into the goroutine as an argument so each one has its own copy: go func(i int) { ... }(i). A channel carries values between goroutines: ch <- v sends, v := <-ch receives, close(ch) ends a for range loop. A mutex: mu.Lock(); counter++; mu.Unlock()."
  - "var wg sync.WaitGroup; for i := 0; i < 5; i++ { wg.Add(1); go func(i int) { defer wg.Done(); results[i] = i * i }(i) }; wg.Wait()  ...  ch := make(chan int); go func() { for i := 1; i <= 5; i++ { ch <- i }; close(ch) }(); sum := 0; for n := range ch { sum += n }  ...  for i := 1; i <= 4; i++ { go func(i int) { out <- i * 2 }(i) }; for k := 0; k < 4; k++ { got = append(got, <-out) }; sort.Ints(got)"
solution:
  - name: main.go
    code: |
      package main

      import (
          "fmt"
          "sort"
          "sync"
      )

      func main() {
          results := make([]int, 5)
          var wg sync.WaitGroup
          for i := 0; i < 5; i++ {
              wg.Add(1)
              go func(i int) {
                  defer wg.Done()
                  results[i] = i * i
              }(i)
          }
          wg.Wait()
          fmt.Println("Squares:", results)

          ch := make(chan int)
          go func() {
              for i := 1; i <= 5; i++ {
                  ch <- i
              }
              close(ch)
          }()
          sum := 0
          for n := range ch {
              sum += n
          }
          fmt.Println("Sum:", sum)

          var mu sync.Mutex
          counter := 0
          var wg2 sync.WaitGroup
          for i := 0; i < 100; i++ {
              wg2.Add(1)
              go func() {
                  defer wg2.Done()
                  mu.Lock()
                  counter++
                  mu.Unlock()
              }()
          }
          wg2.Wait()
          fmt.Println("Counter:", counter)

          out := make(chan int)
          for i := 1; i <= 4; i++ {
              go func(i int) {
                  out <- i * 2
              }(i)
          }
          got := []int{}
          for k := 0; k < 4; k++ {
              got = append(got, <-out)
          }
          sort.Ints(got)
          fmt.Println("Doubled:", got)
      }
quiz:
  - q: "How do you start a function running concurrently as a goroutine?"
    options: ["Put the go keyword in front of the call", "Call it with async", "Use the thread package", "Name it goroutine"]
    answer: 0
  - q: "What happens if main returns while goroutines are still running?"
    options: ["Go waits for them automatically", "The program exits and the goroutines are killed", "They keep running forever", "A compile error"]
    answer: 1
    explain: "That is why you need a WaitGroup, a channel receive or another way of waiting."
  - q: "What does receiving from an unbuffered channel do when no value has been sent yet?"
    options: ["Returns zero immediately", "Blocks (waits) until a sender sends a value", "Panics", "Skips the line"]
    answer: 1
  - q: "Why do you need a sync.Mutex for a shared counter incremented by 100 goroutines?"
    options: ["It makes the program faster", "Without it the goroutines race and updates can be lost", "Goroutines cannot read variables otherwise", "It is only decoration"]
    answer: 1
---

Modern computers can do many things at once, and Go was designed for that. Its tool is the **goroutine**, a very cheap lightweight thread. In this lesson you will start goroutines, wait for them, send data between them with **channels**, and protect shared data with a **mutex**. We will keep every example deterministic, so the output is the same on every run.

## Concurrency in one sentence

**Concurrency** means structuring a program as independent tasks that can make progress at overlapping times. Goroutines are those tasks, and starting one is cheap (you can have hundreds of thousands).

## Starting a goroutine

Put the keyword `go` in front of any function call:

```go
go doWork()
go func() {
    fmt.Println("hello from a goroutine")
}()
```

The second form is an anonymous function that is defined and called straight away (note the final `()`). The call returns **immediately**; the new goroutine runs on its own. Here is the catch: when `main` returns, the whole program ends, even if goroutines are mid-work. You must **wait** for them.

## sync.WaitGroup

A `WaitGroup` is a counter of unfinished work:

```go
var wg sync.WaitGroup
for i := 0; i < 3; i++ {
    wg.Add(1)               // one more task to wait for
    go func(i int) {
        defer wg.Done()     // this task is finished
        fmt.Println("worker", i)
    }(i)
}
wg.Wait()                   // block until the counter is 0
```

Call `Add(1)` **before** starting the goroutine, `Done()` when it finishes (`defer` is perfect for that), and `Wait()` once at the end. The order in which the workers print is **not** fixed, because the scheduler decides. To keep output deterministic, have each goroutine write to **its own slot** (for example `results[i] = ...`) and print after `Wait()`.

Note how `i` is passed as an argument `(i)`. This gives each goroutine its own copy of the loop variable, a habit that avoids classic bugs (Go 1.22 and newer give each loop round its own variable, but the explicit argument works everywhere).

## Channels

A **channel** is a typed pipe that goroutines use to send values to each other:

```go
ch := make(chan int)        // an unbuffered channel of ints

go func() {
    ch <- 42                // send
}()

v := <-ch                   // receive (waits until something arrives)
fmt.Println(v)              // 42
```

On an **unbuffered** channel a send waits until another goroutine receives, and the reverse, so the two goroutines **synchronise** at that moment. That makes the channel both a data pipe and a way of coordinating. A **buffered** channel, `make(chan int, 10)`, lets senders continue until the buffer is full.

### close and range

The sender can say "no more values" with `close(ch)`. The receiver can then loop with `range`, which ends by itself when the channel is closed and empty:

```go
go func() {
    for i := 1; i <= 5; i++ {
        ch <- i
    }
    close(ch)
}()
for n := range ch {
    fmt.Println(n)
}
```

Only the **sender** should close a channel, and never close it twice. Forgetting to close it while the receiver uses `range` makes the program wait forever.

## Mutex: protecting shared data

If many goroutines change the same variable, updates can interleave and be lost. That bug is a **data race**. A `sync.Mutex` allows one goroutine at a time into a critical section:

```go
var mu sync.Mutex
counter := 0

mu.Lock()
counter++
mu.Unlock()
```

Go's saying is "do not communicate by sharing memory; share memory by communicating". Prefer channels where they fit naturally, and use a mutex for simple shared state like a counter or cache.

## Making output deterministic

Goroutine scheduling is unpredictable, so never print from several goroutines and expect a particular order. Instead: write results into separate slots, or send them on a channel and **collect and sort** them in `main`, or wait with a `WaitGroup` and then print. The exercise uses all of these tricks.

> **Watch out:**
> - Forgetting to wait: if `main` finishes first, you see nothing from the goroutines and no error.
> - Deadlock: when every goroutine is waiting, Go stops with `fatal error: all goroutines are asleep - deadlock!`. A send on an unbuffered channel with nobody receiving causes this.
> - Receiving with `range` from a channel nobody closes also deadlocks.
> - Sending on a closed channel panics: `panic: send on closed channel`.
> - Data races on shared variables give random wrong results. Run real programs with `go run -race` to detect them.
> - Calling `wg.Add(1)` **inside** the goroutine is racy, since `Wait` might run before it. Add before `go`.
> - Copying a `WaitGroup` or `Mutex` by value (passing it to a function without a pointer) breaks it. Pass `&wg`.

## Going further

Build a worker pool: three goroutines reading jobs from one channel and writing results to another. Use `select` with `time.After` to give a receive a timeout. Try the counter without the mutex and run it with `-race` on your own computer.

> **Your turn:** Part 1, fill `results` with squares using a `sync.WaitGroup` (`Squares: [0 1 4 9 16]`). Part 2, send 1 to 5 over a channel from a goroutine that then closes it, and sum them with `range` (`Sum: 15`). Part 3, increment a shared counter 100 times from goroutines protected by a `sync.Mutex` (`Counter: 100`). Part 4, collect four doubled numbers from goroutines, sort them and print `Doubled: [2 4 6 8]`.
