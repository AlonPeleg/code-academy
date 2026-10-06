---
title: Lambdas and streams
summary: Pass behavior as a lambda and process collections with filter, map and collect pipelines.
level: advanced
runner: remote
files:
  - name: Main.java
    code: |
      import java.util.ArrayList;
      import java.util.Arrays;
      import java.util.Comparator;
      import java.util.List;
      import java.util.function.Function;
      import java.util.stream.Collectors;

      public class Main {
          public static void main(String[] args) {
              List<Integer> nums = Arrays.asList(5, 12, 8, 21, 3, 16, 10);

              // 1. With a stream: keep only the even numbers (filter), square each one (map),
              //    and collect them into a List. Print:  Even squares: [144, 64, 256, 100]

              // 2. Add up ALL the numbers with mapToInt(...).sum() and print:  Sum: 75

              List<String> names = new ArrayList<>(Arrays.asList("Grace", "Ada", "Linus", "Alan"));

              // 3. Sort names by length, shortest first, using a lambda or Comparator.comparing.
              //    names.sort(...)   then print:  Sorted: [Ada, Alan, Grace, Linus]

              // 4. Print the ORIGINAL order in capitals, joined by ", " using a stream:
              //    stream the list ... but remember step 3 sorted it, so write the original
              //    order directly with Arrays.asList("Grace", "Ada", "Linus", "Alan").
              //    Expected line:  GRACE, ADA, LINUS, ALAN
              //    (map to upper case, then Collectors.joining(", "))

              // 5. Create a Function<Integer, Integer> called doubler with a lambda that
              //    doubles its input, and print:  Doubled: 14   by applying it to 7.

          }
      }
check:
  output: |
    Even squares: [144, 64, 256, 100]
    Sum: 75
    Sorted: [Ada, Alan, Grace, Linus]
    GRACE, ADA, LINUS, ALAN
    Doubled: 14
  code:
    - { pattern: '\.stream\s*\(\s*\)', message: "Start a pipeline with .stream()." }
    - { pattern: '\.filter\s*\(', message: "Use .filter(...) to keep the even numbers." }
    - { pattern: '\.map\s*\(', message: "Use .map(...) to transform each element." }
    - { pattern: '->', message: "Write at least one lambda with the arrow ->." }
    - { pattern: 'Collectors\.', message: "Use Collectors to gather the results." }
    - { pattern: 'Function\s*<\s*Integer\s*,\s*Integer\s*>', message: "Declare doubler as Function<Integer, Integer>." }
hints:
  - "A lambda is a tiny nameless method: (x) -> x * 2. A stream pipeline reads left to right: nums.stream().filter(...).map(...).collect(...). Each step takes a lambda."
  - "filter(n -> n % 2 == 0).map(n -> n * n).collect(Collectors.toList()). For the sum: nums.stream().mapToInt(n -> n).sum(). Sorting: names.sort(Comparator.comparing(s -> s.length())) or (a, b) -> a.length() - b.length()."
  - "List<Integer> sq = nums.stream().filter(n -> n % 2 == 0).map(n -> n * n).collect(Collectors.toList());  int sum = nums.stream().mapToInt(n -> n).sum();  names.sort((a, b) -> a.length() - b.length());  Arrays.asList(\"Grace\", \"Ada\", \"Linus\", \"Alan\").stream().map(s -> s.toUpperCase()).collect(Collectors.joining(\", \"));  Function<Integer, Integer> doubler = x -> x * 2; doubler.apply(7)"
solution:
  - name: Main.java
    code: |
      import java.util.ArrayList;
      import java.util.Arrays;
      import java.util.Comparator;
      import java.util.List;
      import java.util.function.Function;
      import java.util.stream.Collectors;

      public class Main {
          public static void main(String[] args) {
              List<Integer> nums = Arrays.asList(5, 12, 8, 21, 3, 16, 10);

              List<Integer> squares = nums.stream()
                      .filter(n -> n % 2 == 0)
                      .map(n -> n * n)
                      .collect(Collectors.toList());
              System.out.println("Even squares: " + squares);

              int sum = nums.stream().mapToInt(n -> n).sum();
              System.out.println("Sum: " + sum);

              List<String> names = new ArrayList<>(Arrays.asList("Grace", "Ada", "Linus", "Alan"));
              names.sort(Comparator.comparing(s -> s.length()));
              System.out.println("Sorted: " + names);

              String shout = Arrays.asList("Grace", "Ada", "Linus", "Alan").stream()
                      .map(s -> s.toUpperCase())
                      .collect(Collectors.joining(", "));
              System.out.println(shout);

              Function<Integer, Integer> doubler = x -> x * 2;
              System.out.println("Doubled: " + doubler.apply(7));
          }
      }
quiz:
  - q: "What is a lambda expression?"
    options: ["A class with many fields", "A short nameless function you can pass around, such as x -> x * 2", "A type of loop", "A compiler error"]
    answer: 1
  - q: "What does a stream pipeline NOT do by default?"
    options: ["Return a new result", "Change the original list", "Allow filter and map steps", "End with a terminal operation like collect or sum"]
    answer: 1
    explain: "Streams do not modify their source. They produce new results, which is part of why they are safe to use."
  - q: "Which of these is a terminal operation that actually starts the pipeline?"
    options: ["filter", "map", "sorted", "collect"]
    answer: 3
    explain: "filter, map and sorted are intermediate (lazy). Nothing runs until a terminal operation like collect, sum, forEach or count."
  - q: "A lambda can be used where Java expects a..."
    options: ["Any class", "Functional interface (an interface with a single abstract method)", "Array", "Package"]
    answer: 1
---

Modern Java lets you pass **behavior** around as easily as data. **Lambdas** are short anonymous functions, and **streams** use them to process collections in a clear, step-by-step pipeline. They are the style you will meet in almost every modern Java codebase.

## Functional interfaces

Many Java APIs expect "a bit of code to run". Before Java 8 you had to write a whole class for that. Now you write a **lambda**:

```java
(parameters) -> expression
```

Examples:

```java
x -> x * 2                      // one parameter, returns x * 2
(a, b) -> a + b                 // two parameters
(String s) -> s.length()        // explicit parameter type
s -> { System.out.println(s); } // a block body with statements
```

A lambda can be used wherever Java expects a **functional interface**, an interface with exactly one abstract method. The standard library provides many in `java.util.function`:

| Interface | Method | Meaning |
|---|---|---|
| `Function<T, R>` | `R apply(T t)` | turn a T into an R |
| `Predicate<T>` | `boolean test(T t)` | yes/no question |
| `Consumer<T>` | `void accept(T t)` | do something with a T |
| `Supplier<T>` | `T get()` | produce a T |

```java
Function<Integer, Integer> doubler = x -> x * 2;
System.out.println(doubler.apply(7));   // 14
Predicate<String> empty = s -> s.isEmpty();
System.out.println(empty.test(""));     // true
```

Lambdas can use local variables from outside, but only if those variables never change afterwards (they must be **effectively final**).

## Method references

When a lambda only calls one existing method, you can write it shorter with `::`:

```java
names.forEach(s -> System.out.println(s));
names.forEach(System.out::println);        // same thing
```

`String::toUpperCase`, `String::length` and `Integer::sum` are common examples.

## Streams

A **stream** is a sequence of elements that you process with a pipeline. A pipeline has three parts:

1. a **source**: `list.stream()` or `Arrays.stream(array)`;
2. zero or more **intermediate operations** that return another stream: `filter`, `map`, `sorted`, `distinct`, `limit`;
3. one **terminal operation** that produces the result: `collect`, `sum`, `count`, `forEach`, `anyMatch`, `max`.

```java
List<Integer> nums = Arrays.asList(5, 12, 8, 21);

List<Integer> squares = nums.stream()
        .filter(n -> n % 2 == 0)       // keep 12, 8
        .map(n -> n * n)               // 144, 64
        .collect(Collectors.toList()); // gather into a list
System.out.println(squares);           // prints: [144, 64]
```

Read it like a sentence: "take the numbers, keep the even ones, square each, collect into a list". `filter` takes a Predicate and keeps the elements for which it is true. `map` takes a Function and replaces each element by its result. The type may change: `names.stream().map(s -> s.length())` turns Strings into Integers.

### Numbers and joining

For primitive numbers, `mapToInt(...)` gives an `IntStream` with handy methods:

```java
int sum = nums.stream().mapToInt(n -> n).sum();
double avg = nums.stream().mapToInt(n -> n).average().orElse(0);
```

To build text, `Collectors.joining`:

```java
String s = names.stream().map(String::toUpperCase).collect(Collectors.joining(", "));
```

### Laziness

Intermediate operations are **lazy**: nothing happens until the terminal operation runs, and elements flow through the whole pipeline one at a time. That is how `limit(3)` can stop early, even on a huge or endless source. A stream can only be used **once**. Streams never change the original collection; they produce new results.

## Sorting with a lambda

`List.sort` takes a **Comparator**, itself a functional interface:

```java
names.sort((a, b) -> a.length() - b.length());
names.sort(Comparator.comparing(s -> s.length()));   // same idea
```

The sort is **stable**: elements that compare equal keep their original relative order, which makes the result predictable.

## Loop or stream?

Streams shine for "filter, transform, collect" jobs. A plain loop can still be clearer for complex logic with early exits or changing several variables. Neither is always better; choose the one a teammate could read fastest.

> **Watch out:**
> - Using a variable from outside that you later change gives `error: local variables referenced from a lambda expression must be final or effectively final`.
> - Reusing a consumed stream throws `IllegalStateException: stream has already been operated upon or closed`.
> - Forgetting the terminal operation means nothing happens at all. A pipeline ending in `.map(...)` does no work.
> - `Arrays.asList(...)` returns a fixed-size list: `add` or `remove` throws `UnsupportedOperationException`. Wrap it in `new ArrayList<>(...)` if you need to change it. `List.of(...)` is even stricter (it cannot be changed at all).
> - Lambdas with a block body need `return` for functions that give a value: `x -> { return x * 2; }`.

## Going further

Try `sorted()`, `distinct()`, `limit(2)`, `count()` and `anyMatch(...)` on the list of numbers. Use `Collectors.groupingBy(String::length)` to group the names by length. Compare an `IntStream.rangeClosed(1, 5).sum()` with the same loop.

> **Your turn:** with `nums`, use a stream to print `Even squares: [144, 64, 256, 100]`, then use `mapToInt` to print `Sum: 75`. Sort `names` by length with a lambda or `Comparator.comparing` (`Sorted: [Ada, Alan, Grace, Linus]`), upper-case the original order and join it with `Collectors.joining(", ")`, and finally create a `Function<Integer, Integer>` called `doubler` and print `Doubled: 14`.
