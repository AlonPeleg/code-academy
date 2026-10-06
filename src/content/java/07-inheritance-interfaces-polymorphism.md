---
title: Inheritance, interfaces and polymorphism
summary: Share code with extends, promise behavior with interfaces, and let one call do different things.
level: intermediate
runner: remote
files:
  - name: Main.java
    code: |
      interface Shape {
          double area();
          String name();
      }

      // 1. Write a class Rectangle that implements Shape.
      //    It has fields width and height (double), a constructor Rectangle(double w, double h),
      //    area() returns width * height and name() returns "Rectangle".

      // 2. Write a class Square that EXTENDS Rectangle (inheritance).
      //    Its constructor Square(double side) calls super(side, side).
      //    Override name() so it returns "Square".

      // 3. Write a class Circle that implements Shape with a field radius, a constructor
      //    Circle(double r), area() returning 3.0 * radius * radius (we use 3 as pi to keep
      //    the numbers simple) and name() returning "Circle".

      public class Main {
          public static void main(String[] args) {
              Shape[] shapes = { new Rectangle(2, 5), new Square(3), new Circle(2) };
              double total = 0;
              for (Shape s : shapes) {
                  System.out.println(s.name() + " area " + s.area());
                  total += s.area();
              }
              System.out.println("Total area: " + total);
          }
      }
check:
  output: |
    Rectangle area 10.0
    Square area 9.0
    Circle area 12.0
    Total area: 31.0
  code:
    - { pattern: 'class\s+Rectangle\s+implements\s+Shape', message: "Rectangle must implement the Shape interface." }
    - { pattern: 'class\s+Square\s+extends\s+Rectangle', message: "Square must extend Rectangle." }
    - { pattern: 'super\s*\(', message: "Call the parent constructor with super(...)." }
    - { pattern: '@Override', message: "Mark the overriding method with @Override." }
hints:
  - "A class promises to follow an interface with  class Rectangle implements Shape  and must then write every method the interface lists (area and name), each marked public. A subclass is declared with extends."
  - "Square(double side) { super(side, side); } passes the side to Rectangle's constructor twice. Then add  @Override public String name() { return \"Square\"; }  inside Square. Circle has its own radius field."
  - "class Rectangle implements Shape { protected double width; protected double height; Rectangle(double w, double h) { width = w; height = h; } public double area() { return width * height; } public String name() { return \"Rectangle\"; } }  class Square extends Rectangle { Square(double side) { super(side, side); } @Override public String name() { return \"Square\"; } }  class Circle implements Shape { private double radius; Circle(double r) { radius = r; } public double area() { return 3.0 * radius * radius; } public String name() { return \"Circle\"; } }"
solution:
  - name: Main.java
    code: |
      interface Shape {
          double area();
          String name();
      }

      class Rectangle implements Shape {
          protected double width;
          protected double height;

          Rectangle(double w, double h) {
              width = w;
              height = h;
          }

          public double area() {
              return width * height;
          }

          public String name() {
              return "Rectangle";
          }
      }

      class Square extends Rectangle {
          Square(double side) {
              super(side, side);
          }

          @Override
          public String name() {
              return "Square";
          }
      }

      class Circle implements Shape {
          private double radius;

          Circle(double r) {
              radius = r;
          }

          public double area() {
              return 3.0 * radius * radius;
          }

          public String name() {
              return "Circle";
          }
      }

      public class Main {
          public static void main(String[] args) {
              Shape[] shapes = { new Rectangle(2, 5), new Square(3), new Circle(2) };
              double total = 0;
              for (Shape s : shapes) {
                  System.out.println(s.name() + " area " + s.area());
                  total += s.area();
              }
              System.out.println("Total area: " + total);
          }
      }
quiz:
  - q: "Which keyword makes a class inherit from another class?"
    options: ["implements", "extends", "inherits", "super"]
    answer: 1
  - q: "What does an interface contain (in its simplest form)?"
    options: ["Method signatures that implementing classes must provide", "Only private fields", "Complete programs", "Nothing, it is always empty"]
    answer: 0
  - q: "What is polymorphism?"
    options: ["Using many classes in one file", "Calling the same method on different objects and getting behavior that fits each one", "Making a class final", "Hiding fields"]
    answer: 1
    explain: "Here s.area() runs Rectangle's, Square's or Circle's version depending on the real object behind s."
  - q: "How many classes can a Java class extend, and how many interfaces can it implement?"
    options: ["One class, any number of interfaces", "Any number of classes, one interface", "One of each", "Any number of both"]
    answer: 0
---

Real programs are full of things that are similar but not identical: a rectangle and a circle are both shapes, a manager and an engineer are both employees. Java gives you three linked ideas to model that: **inheritance**, **interfaces** and **polymorphism**.

## Inheritance with extends

A class can **extend** another class, called its **parent** (or superclass). The child (subclass) automatically gets the parent's fields and methods and can add its own:

```java
class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void eat() { System.out.println(name + " eats"); }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);          // call the parent constructor first
    }
    void bark() { System.out.println(name + " barks"); }
}
```

A `Dog` can call both `eat()` and `bark()`. The word `super(...)` in a constructor runs the parent constructor, and it must be the first statement. Think of the relationship as "**is a**": a Dog is an Animal. If "is a" sounds wrong (a Car is not an Engine), inheritance is the wrong tool.

Java allows only **one** parent class. The access level `protected` lets a field be used by the class and its subclasses (but not by unrelated code).

## Overriding

A subclass can replace a method it inherited by writing a new one with the same name and parameters. Put `@Override` above it. This annotation is optional but excellent: it asks the compiler to check that you really are overriding something, so a typo becomes an error:

```java
class Cat extends Animal {
    Cat(String name) { super(name); }

    @Override
    void eat() { System.out.println(name + " nibbles"); }
}
```

Inside an overriding method, `super.eat()` calls the parent's version if you want to extend it rather than replace it.

## Interfaces

An **interface** is a pure promise: a list of method signatures with no bodies. A class that **implements** the interface must provide all of them:

```java
interface Shape {
    double area();
}

class Circle implements Shape {
    public double area() { return 3.14 * 2 * 2; }
}
```

Interface methods are automatically `public`, so the implementing methods must be written `public` too (forgetting it is a common compile error). A class may implement **many** interfaces, which is Java's answer to not allowing many parents. Use an interface to describe *what* something can do (`Comparable`, `Runnable`, `Shape`) and a parent class to share *how* it is done.

## Polymorphism

The word means "many forms". A variable of the interface (or parent) type can hold any object that fits, and calling a method runs the version belonging to the **real** object:

```java
Shape[] shapes = { new Rectangle(2, 5), new Circle(2) };
for (Shape s : shapes) {
    System.out.println(s.area());   // each object computes its own area
}
```

The loop code does not know or care which kind of shape it has. If you later add a `Triangle`, this loop works without a single change. That is the big payoff: you write code against the general type and new kinds plug in later.

You can also write `Animal a = new Dog("Rex");` (a Dog is an Animal). The reverse needs a cast and a check: `if (a instanceof Dog) { Dog d = (Dog) a; }`.

## abstract classes (a taste)

Sometimes a parent should never be created on its own. Mark it `abstract` and it may contain abstract methods without bodies that every subclass must write. It sits between a class and an interface: it can hold fields and shared code too.

> **Watch out:**
> - Forgetting to implement an interface method gives `error: Rectangle is not abstract and does not override abstract method name() in Shape`.
> - Implementing an interface method without `public` gives `error: attempting to assign weaker access privileges; was public`.
> - A parent with only a parameterized constructor forces `super(...)` in the child, otherwise you get `error: constructor Rectangle in class Rectangle cannot be applied to given types`.
> - A misspelled overriding method with `@Override` gives `error: method does not override or implement a method from a supertype`. That is the annotation doing its job.
> - Fields are not polymorphic, only methods are. Prefer calling methods rather than reading parent fields through a parent-typed variable.

## Going further

Add a `Triangle` that implements `Shape` and add it to the array without touching the loop. Make `Shape` provide a `default` method `describe()` that returns `name() + " area " + area()`. Try making `Rectangle` abstract.

> **Your turn:** write `Rectangle implements Shape`, `Square extends Rectangle` (calling `super(side, side)` and overriding `name()` with `@Override`) and `Circle implements Shape` (area is `3.0 * radius * radius`) so that `main` prints the four expected lines.
