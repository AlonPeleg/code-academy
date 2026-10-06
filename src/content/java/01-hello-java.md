---
title: Hello, Java
summary: Write your first Java program and learn what every line of its structure means.
level: beginner
runner: remote
files:
  - name: Main.java
    code: |
      public class Main {
          public static void main(String[] args) {
              // 1. Print the line:  Hello, Java!
              // 2. Print a second line:  Java runs on a virtual machine.
              // 3. Print a third line:  Compile once, run anywhere.

          }
      }
check:
  output: |
    Hello, Java!
    Java runs on a virtual machine.
    Compile once, run anywhere.
  code:
    - { pattern: 'System\.out\.println\s*\(', message: "Use System.out.println(...) to print each line." }
hints:
  - "Printing in Java is done by a method you call with a dot: System.out.println. Each call prints one line of text."
  - "Text goes inside double quotes, the call is wrapped in parentheses, and every statement ends with a semicolon. You need three such statements."
  - "System.out.println(\"Hello, Java!\"); then System.out.println(\"Java runs on a virtual machine.\"); then System.out.println(\"Compile once, run anywhere.\");"
solution:
  - name: Main.java
    code: |
      public class Main {
          public static void main(String[] args) {
              System.out.println("Hello, Java!");
              System.out.println("Java runs on a virtual machine.");
              System.out.println("Compile once, run anywhere.");
          }
      }
quiz:
  - q: "What is the name of the method where every Java program starts running?"
    options: ["start", "main", "run", "begin"]
    answer: 1
    explain: "The Java Virtual Machine looks for public static void main(String[] args) and starts there."
  - q: "What does System.out.println(\"Hi\") do compared to System.out.print(\"Hi\")?"
    options: ["println adds a new line after the text, print does not", "print adds a new line, println does not", "They are exactly the same", "println prints in red"]
    answer: 0
  - q: "What must end almost every Java statement?"
    options: ["A colon", "A period", "A semicolon", "Nothing, Java uses line breaks"]
    answer: 2
  - q: "Java source code is first turned into what before it runs?"
    options: ["Machine code for one specific computer only", "Bytecode that the Java Virtual Machine runs", "A web page", "Plain English"]
    answer: 1
    explain: "The compiler (javac) produces bytecode, and the JVM runs that bytecode on any operating system."
---

In this lesson you will write and run your first Java program, and you will learn what each of the strange-looking words around it means. Java is used for Android apps, huge company systems, games like Minecraft and much more, so these first lines are the start of a long road.

## Your first program

Every Java program in this course has the same shape:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

When you run it, it prints:

```
Hello, world!
```

It looks like a lot of ceremony for one line of output. Let us take it apart piece by piece.

## What every part means

* `public class Main { ... }` declares a **class** named `Main`. In Java all code lives inside classes. Think of a class as a labelled box that holds your code. The file is called `Main.java`, and Java insists that a public class has the same name as its file.
* `public static void main(String[] args) { ... }` is the **main method**. A method is a named block of instructions. When you run a Java program, the Java Virtual Machine (JVM) looks for exactly this method and starts there.
  * `public` means "anyone may call this".
  * `static` means "this belongs to the class itself, you do not need to create an object first". You will understand this fully in the classes lesson.
  * `void` means "this method gives nothing back".
  * `String[] args` is a list of text values the user could pass on the command line. We will ignore it for now but it must be there.
* `System.out.println("...");` prints text and then moves to a new line. `System` is a built-in class, `out` is its output stream, and `println` ("print line") is a method of that stream.
* The **curly braces** `{ }` mark where a block begins and ends. Every `{` needs a matching `}`.
* The **semicolon** `;` ends a statement, like a full stop ends a sentence.

## Compiling and running

Java is a **compiled** language. A program called the compiler (`javac`) reads your `.java` file and checks it for mistakes. If it is fine, it creates a `.class` file full of **bytecode**. Then the `java` command starts the JVM, which runs the bytecode. Because the JVM exists for Windows, macOS and Linux, the same bytecode runs everywhere. That is the famous idea "compile once, run anywhere". On this site the compile and run steps happen for you when you press Run.

## print versus println

`println` ends the line, `print` does not:

```java
System.out.print("Hello, ");
System.out.print("Java");
System.out.println("!");
```

That prints `Hello, Java!` on a single line, because only the last call moves to the next line.

## Comments

Text after `//` is a **comment**. Java ignores it, it is only a note for humans:

```java
// this line is ignored by the compiler
System.out.println("This line runs"); // so is this part
```

> **Watch out:**
> - A missing semicolon gives `error: ';' expected`. The compiler points at the end of the line that needs it.
> - Java is **case sensitive**. Writing `system.out.println` or `System.out.Println` gives `error: package system does not exist` or `cannot find symbol`.
> - Single quotes are for single characters. `System.out.println('Hello')` gives `error: unclosed character literal`. Text needs double quotes.
> - If the file is named `Main.java` but the class is `Program`, you get `error: class Program is public, should be declared in a file named Program.java`. On this site always keep the class named `Main`.
> - A missing closing brace gives `error: reached end of file while parsing`.

## Going further

Try printing an empty line with `System.out.println();`, or use `\n` inside a string (`"one\ntwo"`) to see how the text breaks. Try deleting one semicolon on purpose to see the compiler message, then put it back. Reading error messages is a skill you will use every day.

> **Your turn:** inside `main`, use `System.out.println` three times to print exactly these three lines: `Hello, Java!`, `Java runs on a virtual machine.` and `Compile once, run anywhere.`
