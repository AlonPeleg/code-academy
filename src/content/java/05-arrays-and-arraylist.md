---
title: Arrays and ArrayList
summary: Store many values in a fixed-size array or a growable ArrayList and loop over them.
level: beginner
runner: remote
files:
  - name: Main.java
    code: |
      import java.util.ArrayList;

      public class Main {
          public static void main(String[] args) {
              int[] scores = {72, 95, 88, 61, 79};

              // 1. Use a for loop over the array to find the total and the highest score.
              //    Print:  Total: 395
              //    Print:  Highest: 95

              // 2. Print the average as a decimal (divide as doubles):
              //    Average: 79.0

              // 3. Create an ArrayList<String> called names, add "Ada", "Linus" and "Grace",
              //    then remove "Linus".
              // 4. Use a for-each loop to print each name that is left, one per line, like:
              //    Name: Ada
              //    Name: Grace
              //    and finally print  Count: 2   using the list's size.

          }
      }
check:
  output: |
    Total: 395
    Highest: 95
    Average: 79.0
    Name: Ada
    Name: Grace
    Count: 2
  code:
    - { pattern: 'for\s*\(', message: "Use a for loop to go through the array." }
    - { pattern: 'ArrayList\s*<\s*String\s*>', message: "Create an ArrayList<String>." }
    - { pattern: '\.add\s*\(', message: "Use names.add(...) to add items." }
    - { pattern: '\.remove\s*\(', message: "Use names.remove(...) to remove an item." }
    - { pattern: '\.size\s*\(\s*\)', message: "Use names.size() for the count." }
hints:
  - "An array has a fixed length that you read with scores.length (no parentheses). Loop with  for (int i = 0; i < scores.length; i++)  and keep a running total and a highest variable."
  - "Average: (double) total / scores.length. For the list: ArrayList<String> names = new ArrayList<>(); then names.add(\"Ada\"); and names.remove(\"Linus\"); and a for-each loop looks like  for (String n : names) { ... }."
  - "int total = 0; int highest = scores[0]; for (int i = 0; i < scores.length; i++) { total += scores[i]; if (scores[i] > highest) { highest = scores[i]; } }  ... System.out.println(\"Average: \" + (double) total / scores.length);  ArrayList<String> names = new ArrayList<>(); names.add(\"Ada\"); names.add(\"Linus\"); names.add(\"Grace\"); names.remove(\"Linus\"); for (String n : names) { System.out.println(\"Name: \" + n); } System.out.println(\"Count: \" + names.size());"
solution:
  - name: Main.java
    code: |
      import java.util.ArrayList;

      public class Main {
          public static void main(String[] args) {
              int[] scores = {72, 95, 88, 61, 79};

              int total = 0;
              int highest = scores[0];
              for (int i = 0; i < scores.length; i++) {
                  total += scores[i];
                  if (scores[i] > highest) {
                      highest = scores[i];
                  }
              }
              System.out.println("Total: " + total);
              System.out.println("Highest: " + highest);
              System.out.println("Average: " + (double) total / scores.length);

              ArrayList<String> names = new ArrayList<>();
              names.add("Ada");
              names.add("Linus");
              names.add("Grace");
              names.remove("Linus");

              for (String n : names) {
                  System.out.println("Name: " + n);
              }
              System.out.println("Count: " + names.size());
          }
      }
quiz:
  - q: "Which index is the FIRST element of an array?"
    options: ["1", "0", "-1", "It depends on the type"]
    answer: 1
  - q: "How do you get the number of elements in an int array named a?"
    options: ["a.length()", "a.size()", "a.length", "length(a)"]
    answer: 2
    explain: "Arrays have a length field (no parentheses). Strings use length() and lists use size()."
  - q: "What happens if you read a[5] when a has only 5 elements?"
    options: ["It returns 0", "It returns null", "Java throws ArrayIndexOutOfBoundsException", "It grows the array"]
    answer: 2
  - q: "What is the main advantage of ArrayList over a plain array?"
    options: ["It is always faster", "It can grow and shrink while the program runs", "It can hold several types at once", "It does not need an import"]
    answer: 1
---

Often you need to keep many values together: ten scores, a list of names, the pixels of an image. Java gives you two main tools for this: the **array**, which is simple and fixed in size, and the **ArrayList**, which can grow and shrink.

## Arrays

An array holds a fixed number of values of the **same type**:

```java
int[] scores = {72, 95, 88};          // create with values
int[] zeros = new int[5];             // five ints, all start as 0
String[] days = new String[7];        // seven Strings, all start as null
```

The `[]` after the type means "array of". You read and write elements with an **index** in square brackets, and counting starts at **0**:

```java
System.out.println(scores[0]);   // prints: 72
scores[1] = 100;                 // change the second element
System.out.println(scores.length); // prints: 3
```

`scores.length` is the number of elements. Note: no parentheses for arrays. The last valid index is `length - 1`.

## Looping over an array

The classic loop uses the index:

```java
for (int i = 0; i < scores.length; i++) {
    System.out.println(i + ": " + scores[i]);
}
```

When you do not need the index, the **for-each** loop is shorter and harder to get wrong:

```java
for (int s : scores) {
    System.out.println(s);
}
```

Read it as "for each int `s` in `scores`".

## Common patterns

To add things up, start with a total of 0 and add each element. To find the largest, start with the first element and replace it whenever you see a bigger one:

```java
int highest = scores[0];
for (int s : scores) {
    if (s > highest) highest = s;
}
```

To compute an average, remember integer division! `total / scores.length` throws away the decimals. Convert one side to a `double` first: `(double) total / scores.length`.

## ArrayList

An array can never change its size. When you do not know in advance how many items you will have, use an `ArrayList`. It lives in `java.util`, so you must import it at the top of the file:

```java
import java.util.ArrayList;

ArrayList<String> names = new ArrayList<>();
names.add("Ada");              // add to the end
names.add("Linus");
System.out.println(names.get(0));    // Ada
System.out.println(names.size());    // 2
names.remove("Ada");           // remove by value
names.remove(0);               // remove by index
names.set(0, "Grace");         // replace an element (list must have one)
System.out.println(names.contains("Grace"));  // true
```

The `<String>` part says what kind of thing the list holds. It is called a **generic type**, and the compiler then refuses to let you add the wrong kind of thing. Lists cannot hold primitives like `int` directly, so you write `ArrayList<Integer>` instead and Java converts automatically (this is called **boxing**).

You can use for-each on lists too: `for (String n : names) { ... }`.

## Array or ArrayList?

Use an array when the size is known and fixed, or when speed and memory matter. Use an `ArrayList` for almost everything else. It has helpful methods (`add`, `remove`, `contains`, `isEmpty`, `clear`) that arrays lack.

> **Watch out:**
> - Going outside the array crashes the program: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5`. Loop with `i < length`, not `i <= length`.
> - For an `ArrayList` the equivalent error is `IndexOutOfBoundsException: Index 3 out of bounds for length 3`.
> - `names.length` or `scores.size()` gives `error: cannot find symbol`. Arrays use `length`, lists use `size()`.
> - Forgetting the import gives `error: cannot find symbol  class ArrayList`.
> - Removing items while looping over a list with for-each throws `ConcurrentModificationException`. Collect first, remove afterwards.
> - On an `ArrayList<Integer>`, `list.remove(1)` removes the element at **index** 1, not the value 1.

## Going further

Sort an array with `java.util.Arrays.sort(scores)` and print it with `Arrays.toString(scores)`. Reverse the list by looping from the end. Try a two-dimensional array: `int[][] grid = new int[3][3];`.

> **Your turn:** for the `scores` array print the total, the highest score and the average (`Total: 395`, `Highest: 95`, `Average: 79.0`). Then build an `ArrayList<String>` with Ada, Linus and Grace, remove Linus, print each remaining name as `Name: ...` using a for-each loop, and finish with `Count: 2` using `size()`.
