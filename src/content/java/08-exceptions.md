---
title: Exceptions
summary: Handle runtime errors with try/catch/finally, and throw your own checked exceptions.
level: intermediate
runner: remote
files:
  - name: Main.java
    code: |
      // 1. Write a class AgeException that extends Exception.
      //    Give it a constructor that takes a String message and passes it to super(message).

      public class Main {
          // 2. Write  static int safeParse(String text, int fallback)
          //    It tries Integer.parseInt(text) and returns the result.
          //    If the text is not a number it catches NumberFormatException and returns fallback.

          // 3. Write  static void checkAge(int age) throws AgeException
          //    If age is below 0, throw new AgeException("Age cannot be negative: " + age).
          //    Otherwise print  Age ok: <age>

          public static void main(String[] args) {
              System.out.println("Parsed: " + safeParse("42", -1));
              System.out.println("Parsed: " + safeParse("abc", -1));

              // 4. Divide 10 by the variable zero inside a try block. Catch the ArithmeticException
              //    and print  Caught: <the exception's message>
              int zero = 0;

              // 5. Call checkAge(30) and then checkAge(-5) inside ONE try block.
              //    Catch AgeException and print  Invalid age: <message>
              //    Add a finally block that prints  Done
          }
      }
check:
  output: |
    Parsed: 42
    Parsed: -1
    Caught: / by zero
    Age ok: 30
    Invalid age: Age cannot be negative: -5
    Done
  code:
    - { pattern: 'class\s+AgeException\s+extends\s+Exception', message: "AgeException must extend Exception." }
    - { pattern: 'catch\s*\(\s*NumberFormatException', message: "Catch NumberFormatException in safeParse." }
    - { pattern: 'catch\s*\(\s*ArithmeticException', message: "Catch ArithmeticException around the division." }
    - { pattern: 'finally\s*\{', message: "Add a finally block." }
    - { pattern: 'throw\s+new\s+AgeException', message: "Use throw new AgeException(...) in checkAge." }
hints:
  - "Risky code goes in a try { } block; right after it come catch (SomeException e) { } blocks that run only if that kind of exception was thrown. A finally { } block always runs afterwards."
  - "class AgeException extends Exception { AgeException(String message) { super(message); } }. In safeParse: try { return Integer.parseInt(text); } catch (NumberFormatException e) { return fallback; }. The method that throws needs  throws AgeException  in its header."
  - "try { int r = 10 / zero; } catch (ArithmeticException e) { System.out.println(\"Caught: \" + e.getMessage()); }  try { checkAge(30); checkAge(-5); } catch (AgeException e) { System.out.println(\"Invalid age: \" + e.getMessage()); } finally { System.out.println(\"Done\"); }"
solution:
  - name: Main.java
    code: |
      class AgeException extends Exception {
          AgeException(String message) {
              super(message);
          }
      }

      public class Main {
          static int safeParse(String text, int fallback) {
              try {
                  return Integer.parseInt(text);
              } catch (NumberFormatException e) {
                  return fallback;
              }
          }

          static void checkAge(int age) throws AgeException {
              if (age < 0) {
                  throw new AgeException("Age cannot be negative: " + age);
              }
              System.out.println("Age ok: " + age);
          }

          public static void main(String[] args) {
              System.out.println("Parsed: " + safeParse("42", -1));
              System.out.println("Parsed: " + safeParse("abc", -1));

              int zero = 0;
              try {
                  int r = 10 / zero;
                  System.out.println(r);
              } catch (ArithmeticException e) {
                  System.out.println("Caught: " + e.getMessage());
              }

              try {
                  checkAge(30);
                  checkAge(-5);
              } catch (AgeException e) {
                  System.out.println("Invalid age: " + e.getMessage());
              } finally {
                  System.out.println("Done");
              }
          }
      }
quiz:
  - q: "When does the code in a finally block run?"
    options: ["Only when an exception happened", "Only when no exception happened", "Always, whether or not an exception happened", "Never, it is optional decoration"]
    answer: 2
  - q: "What is a checked exception?"
    options: ["One the compiler forces you to catch or declare with throws", "One that happens only at night", "One that cannot be thrown", "Any exception from the Math class"]
    answer: 0
    explain: "Exception subclasses (other than RuntimeException) are checked. RuntimeException and its children, like NullPointerException, are not."
  - q: "What is the difference between throw and throws?"
    options: ["They are the same", "throw creates and launches an exception, throws in a method header declares that it might", "throws launches, throw declares", "throw is for Strings only"]
    answer: 1
  - q: "In what order must multiple catch blocks be written?"
    options: ["Most general type first", "Most specific type first", "Alphabetical order", "Order does not matter"]
    answer: 1
    explain: "A general catch placed first would swallow everything and the compiler reports the later ones as unreachable."
---

Things go wrong while programs run: a file is missing, a user types `abc` where a number was expected, you divide by zero. Java reports such problems with **exceptions**. This lesson shows how to handle them gracefully instead of crashing, and how to raise your own.

## What happens without handling

```java
int zero = 0;
System.out.println(10 / zero);
```

The program stops and prints:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Main.main(Main.java:4)
```

That is an exception being **thrown**. If nothing **catches** it, it travels up out of `main` and ends the program. The text underneath is the **stack trace**: it lists the chain of method calls, with the file and line, that led to the problem. Reading it from the top tells you what went wrong and where.

## try and catch

Wrap risky code in `try` and say what to do in `catch`:

```java
try {
    int n = Integer.parseInt("abc");
    System.out.println("never printed");
} catch (NumberFormatException e) {
    System.out.println("That was not a number");
}
```

As soon as the line inside `try` throws, Java jumps straight to the matching `catch`, skipping the rest of the `try` block. After the catch, the program carries on normally. The variable `e` is the exception object. Useful pieces are `e.getMessage()` (a short description) and `e.printStackTrace()`.

You can have several catch blocks for different types, and the first matching one runs. Put **specific** types before general ones. You can also list alternatives in one block: `catch (IOException | NumberFormatException e)`.

## finally

A `finally` block runs **no matter what**: after normal completion, after a catch, even if `return` was used. It is the place for cleanup such as closing a file:

```java
try {
    // use a resource
} catch (Exception e) {
    // handle
} finally {
    System.out.println("cleanup");
}
```

Later you will meet **try-with-resources**, `try (Scanner in = new Scanner(...)) { ... }`, which closes the resource for you automatically.

## Checked and unchecked exceptions

Java splits exceptions in two families:

* **Unchecked** (subclasses of `RuntimeException`): bugs like `NullPointerException`, `ArithmeticException`, `ArrayIndexOutOfBoundsException`. You are not forced to catch them. The best fix is usually to correct the code.
* **Checked** (other subclasses of `Exception`, like `IOException`): problems that can happen even in correct programs, such as a missing file. The compiler **forces** you either to catch them or to declare that your method passes them on with `throws`.

## Throwing your own

Use `throw` with a new exception object. If the exception is checked, add `throws` to the method header so callers know:

```java
static void checkAge(int age) throws AgeException {
    if (age < 0) {
        throw new AgeException("Age cannot be negative: " + age);
    }
}
```

To make your own type, extend `Exception` (checked) or `RuntimeException` (unchecked) and pass a message to the parent:

```java
class AgeException extends Exception {
    AgeException(String message) {
        super(message);
    }
}
```

Callers of `checkAge` must now wrap the call in `try/catch (AgeException e)` or declare `throws AgeException` themselves. This design makes errors part of the method's contract.

## Good habits

* Catch the most specific exception you can, and only where you can actually do something useful.
* Never leave a `catch` block empty. Silent failures are very hard to debug.
* Use exceptions for exceptional situations, not for ordinary control flow like ending a loop.
* Validate inputs early and throw `IllegalArgumentException` for bad arguments.

> **Watch out:**
> - Calling a method that throws a checked exception without handling it gives `error: unreported exception AgeException; must be caught or declared to be thrown`.
> - Catching a checked exception that the `try` block can never throw gives `error: exception AgeException is never thrown in body of corresponding try statement`.
> - Putting `catch (Exception e)` before a more specific catch gives `error: exception NumberFormatException has already been caught`.
> - A variable declared inside `try { }` is not visible after the block. Declare it before the `try` if you need it later.
> - Writing `catch (Exception e) { }` and doing nothing hides real bugs. At least print the message.

## Going further

Read the stack trace of an uncaught exception from a nested method call. Try `Integer.parseInt(null)` and `"abc".charAt(10)`, and look at which exception types you get. Wrap one exception in another using `new RuntimeException("context", e)`.

> **Your turn:** write `AgeException extends Exception`, a `safeParse` method that falls back on `NumberFormatException`, and a `checkAge` method that throws `AgeException` for negative ages. In `main`, catch the `ArithmeticException` from dividing by zero and print `Caught: / by zero`, and use `try / catch / finally` around `checkAge(30)` and `checkAge(-5)`, ending with `Done`.
