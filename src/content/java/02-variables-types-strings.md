---
title: Variables, types and Strings
summary: Store numbers, text and true/false values in typed variables and work with String methods.
level: beginner
runner: remote
files:
  - name: Main.java
    code: |
      public class Main {
          public static void main(String[] args) {
              // 1. Make a text variable called name that holds "Ada".
              // 2. Make a whole-number variable called age that holds 36.
              // 3. Make a decimal variable called price (4.5) and a whole number called count (3).
              // 4. Make a decimal variable called total that is price times count.

              // 5. Print:  Ada is 36 years old      (join the pieces with +)
              // 6. Print:  Total: 13.5
              // 7. Print the name in capital letters and its number of letters:
              //    ADA has 3 letters

          }
      }
check:
  output: |
    Ada is 36 years old
    Total: 13.5
    ADA has 3 letters
  code:
    - { pattern: 'String\s+name\s*=', message: "Declare the text variable with: String name = ...;" }
    - { pattern: 'int\s+age\s*=', message: "Declare a whole-number variable: int age = ...;" }
    - { pattern: 'double\s+total\s*=', message: "Declare total as a double (a decimal type)." }
    - { pattern: '\.toUpperCase\s*\(\s*\)', message: "Use the String method toUpperCase()." }
    - { pattern: '\.length\s*\(\s*\)', message: "Use the String method length() (with parentheses)." }
hints:
  - "Java needs you to name the type of every variable: String for text, int for whole numbers, double for decimals. The shape is  type name = value;"
  - "String name = \"Ada\"; int age = 36; double price = 4.5; int count = 3; double total = price * count;  Then print with System.out.println(name + \" is \" + age + \" years old\");"
  - "System.out.println(name + \" is \" + age + \" years old\");  System.out.println(\"Total: \" + total);  System.out.println(name.toUpperCase() + \" has \" + name.length() + \" letters\");"
solution:
  - name: Main.java
    code: |
      public class Main {
          public static void main(String[] args) {
              String name = "Ada";
              int age = 36;
              double price = 4.5;
              int count = 3;
              double total = price * count;

              System.out.println(name + " is " + age + " years old");
              System.out.println("Total: " + total);
              System.out.println(name.toUpperCase() + " has " + name.length() + " letters");
          }
      }
quiz:
  - q: "Which type would you choose to store the number 42?"
    options: ["String", "int", "boolean", "char"]
    answer: 1
  - q: "What does 7 / 2 give when both numbers are ints?"
    options: ["3.5", "4", "3", "An error"]
    answer: 2
    explain: "Integer division throws away the remainder, so 7 / 2 is 3. Use 7 / 2.0 to get 3.5."
  - q: "Which of these is a valid way to declare a text variable?"
    options: ["string s = \"hi\";", "String s = 'hi';", "String s = \"hi\";", "text s = \"hi\";"]
    answer: 2
    explain: "The type is spelled String with a capital S, and text uses double quotes."
  - q: "How do you find how many characters a String named s has?"
    options: ["s.length", "s.size", "length(s)", "s.length()"]
    answer: 3
---

Programs remember things in **variables**. In this lesson you will learn how Java stores numbers, text and true/false values, why Java makes you name the type of each one, and how to do useful things with text.

## Variables have types

Java is a **statically typed** language. That means every variable has a type that you write down when you create it, and the type can never change. The shape is:

```java
type name = value;
```

The most common types:

| Type | Holds | Example |
|---|---|---|
| `int` | whole numbers | `int age = 36;` |
| `double` | decimal numbers | `double price = 4.5;` |
| `boolean` | `true` or `false` | `boolean done = false;` |
| `char` | one single character, in single quotes | `char grade = 'A';` |
| `String` | text, in double quotes | `String name = "Ada";` |

Notice that `String` starts with a capital letter. It is not one of the basic types but a class, which is why it has methods you can call.

Why do types help? Because the compiler can catch silly mistakes before your program even runs. If you write `int age = "thirty";` Java stops you right away.

## Doing maths

You can use `+ - * /` and `%` (the remainder). Be careful: when both sides are `int`, the answer is an `int` and any decimal part is cut off.

```java
int a = 7 / 2;        // 3, not 3.5
double b = 7 / 2.0;   // 3.5, because one side is a double
int c = 7 % 2;        // 1, the remainder
```

To change a variable, assign again without repeating the type: `age = age + 1;` or the short forms `age += 1;` and `age++;`.

## Joining text

The `+` operator joins a String with anything else:

```java
String name = "Ada";
int age = 36;
System.out.println(name + " is " + age + " years old");
// prints: Ada is 36 years old
```

Java quietly turns the number into text. Be careful with order though: `1 + 2 + "x"` is `"3x"` because the numbers are added first, but `"x" + 1 + 2` is `"x12"`.

## String methods

A String is an object, and objects have **methods**, actions you call with a dot and parentheses:

```java
String s = "Hello";
s.length()          // 5
s.toUpperCase()     // "HELLO"
s.toLowerCase()     // "hello"
s.charAt(1)         // 'e'  (counting starts at 0)
s.substring(1, 3)   // "el" (from index 1 up to, not including, 3)
s.contains("ell")   // true
s.equals("Hello")   // true
```

Strings are **immutable**: a method like `toUpperCase()` does not change `s`, it returns a new String. If you want to keep the result, store it: `s = s.toUpperCase();`.

## Constants and var

Put `final` in front of a variable to make it a constant that cannot change: `final int MAX = 10;`. Since Java 10 you may also write `var x = 5;` and let the compiler work out the type, but the type is still fixed once chosen. In this course we mostly write the type out, because it makes the code easier to read when you are learning.

> **Watch out:**
> - Comparing Strings with `==` is a classic bug. Use `s.equals("Hello")` instead. `==` checks whether two variables point at the very same object, not whether the text matches.
> - Assigning a decimal to an int, `int x = 4.5;`, gives `error: incompatible types: possible lossy conversion from double to int`.
> - `length` without parentheses on a String gives `error: cannot find symbol`. It is `length()` for Strings (but `length` without parentheses for arrays, which come later).
> - Using a variable before giving it a value gives `error: variable x might not have been initialized`.
> - Declaring the same name twice in one scope gives `error: variable x is already defined in method main(String[])`.

## Going further

Change `age` to a `double` and print it. Try `name.charAt(0)` and `name.substring(1)`, and build the string `"da"` out of `"Ada"`. Try dividing two ints, and then convert one to a double with a cast: `(double) a / b`.

> **Your turn:** declare `String name = "Ada"`, `int age = 36`, `double price = 4.5`, `int count = 3` and `double total = price * count`. Print `Ada is 36 years old`, then `Total: 13.5`, then the name in capitals and its length like `ADA has 3 letters` using `toUpperCase()` and `length()`.
