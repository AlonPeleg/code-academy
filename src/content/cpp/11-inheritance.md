---
title: Inheritance
summary: Build new classes from existing ones and override behaviour.
level: intermediate
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      using namespace std;

      class Animal {
      protected:
          string name;

      public:
          Animal(string n) : name(n) {}

          // 1. Change speak so that derived classes can replace it
          //    (put the keyword that enables this in front of the return type).
          string speak() const {
              return "...";
          }

          string getName() const {
              return name;
          }
      };

      // 2. Write a class Dog that is built on Animal (public inheritance).
      //    Its constructor takes the name and passes it on to the Animal constructor.
      //    Its speak returns "Woof".

      // 3. Write a class Cat the same way. Its speak returns "Meow".

      void talk(const Animal& a) {
          cout << a.getName() << " says " << a.speak() << endl;
      }

      int main() {
          Animal generic("Generic");
          Dog rex("Rex");
          Cat tom("Tom");

          talk(rex);
          talk(tom);
          talk(generic);
          return 0;
      }
check:
  output: |
    Rex says Woof
    Tom says Meow
    Generic says ...
  code:
    - { pattern: 'virtual\s+string\s+speak', message: "Mark Animal::speak as virtual." }
    - { pattern: 'class\s+Dog\s*:\s*public\s+Animal', message: "Write class Dog : public Animal." }
    - { pattern: 'class\s+Cat\s*:\s*public\s+Animal', message: "Write class Cat : public Animal." }
hints:
  - "Inheritance is written with a colon after the class name: class Dog : public Animal. For talk() to call the Dog's version, the base method must be virtual."
  - "Add the word virtual before string speak() const in Animal. In Dog, the constructor passes the name up: Dog(string n) : Animal(n) {}  and the new speak has the same signature as the base one, optionally followed by override."
  - "virtual string speak() const { return \"...\"; }   class Dog : public Animal { public: Dog(string n) : Animal(n) {} string speak() const override { return \"Woof\"; } };   class Cat : public Animal { public: Cat(string n) : Animal(n) {} string speak() const override { return \"Meow\"; } };"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <string>
      using namespace std;

      class Animal {
      protected:
          string name;

      public:
          Animal(string n) : name(n) {}
          virtual ~Animal() {}

          virtual string speak() const {
              return "...";
          }

          string getName() const {
              return name;
          }
      };

      class Dog : public Animal {
      public:
          Dog(string n) : Animal(n) {}

          string speak() const override {
              return "Woof";
          }
      };

      class Cat : public Animal {
      public:
          Cat(string n) : Animal(n) {}

          string speak() const override {
              return "Meow";
          }
      };

      void talk(const Animal& a) {
          cout << a.getName() << " says " << a.speak() << endl;
      }

      int main() {
          Animal generic("Generic");
          Dog rex("Rex");
          Cat tom("Tom");

          talk(rex);
          talk(tom);
          talk(generic);
          return 0;
      }
quiz:
  - q: 'What does  class Dog : public Animal  mean?'
    options: ["Dog contains an Animal as a member variable", "Dog is built on Animal and gets its members and methods", "Animal is built on Dog"]
    answer: 1
  - q: What is the keyword virtual for?
    options: ["It makes a method run faster", "It hides a method from other classes", "It lets a derived class's version be called through a base-class reference or pointer"]
    answer: 2
  - q: Which members can a derived class use directly from its base?
    options: ["Only public ones", "Public and protected ones, but not private ones", "All of them, including private"]
    answer: 1
  - q: 'What does the constructor  Dog(string n) : Animal(n) {}  do?'
    options: ["Calls the Animal constructor with n before running Dog's own constructor body", "Creates two dogs", "Deletes the Animal"]
    answer: 0
---

Imagine you are writing a game with dogs, cats and birds. They all have a name and can make a sound, but each sound is different. Copy-pasting the shared parts into three classes would be a mess. **Inheritance** lets a new class (the **derived** or **child** class) reuse everything from an existing one (the **base** or **parent** class) and add or change only what is different.

## Deriving a class

```cpp
class Animal {
public:
    string name;
    void eat() { cout << name << " eats" << endl; }
};

class Dog : public Animal {      // a Dog IS an Animal
public:
    void bark() { cout << name << " barks" << endl; }
};

Dog d;
d.name = "Rex";
d.eat();      // inherited from Animal: prints: Rex eats
d.bark();     // Dog's own method: prints: Rex barks
```

`: public Animal` means "Dog inherits from Animal". Read it as an **is-a** relationship: a dog is an animal. A dog has everything an animal has, plus its own extras.

## protected

Besides `public` and `private` there is a third level, `protected`: members that outsiders cannot touch but **derived classes** can. A derived class can never use the base class's `private` members directly.

## Constructors of derived classes

When a `Dog` is created, the `Animal` part must be built first. If `Animal` has a constructor with parameters you must pass them from `Dog`'s constructor, using the initializer list:

```cpp
class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}    // pass n up to the Animal constructor
};
```

## Overriding with virtual

A derived class may provide its own version of a method. For that to work when you only hold a **base reference or pointer**, the base method must be `virtual`:

```cpp
class Animal {
public:
    virtual string speak() const { return "..."; }
};
class Dog : public Animal {
public:
    string speak() const override { return "Woof"; }
};

void talk(const Animal& a) {
    cout << a.speak() << endl;   // picks the right version at run time
}
Dog d;
talk(d);     // prints: Woof
```

This is called **polymorphism** ("many forms"): the same call `a.speak()` does something different depending on the real object. `override` is optional but asks the compiler to check that you really are replacing a base method. Without `virtual`, `talk(d)` would print `...`.

When a class has virtual methods, give it a virtual destructor too (`virtual ~Animal() {}`). This matters once you delete objects through base pointers.

> **Watch out:**
> - Forgetting `virtual` in the base class: the code compiles, but `talk` always calls the base version and you get `...` instead of `Woof`.
> - Using `private` members in a derived class: `error: 'std::string Animal::name' is private within this context`. Make them `protected` or use getters.
> - Not passing arguments to the base constructor: `error: no matching function for call to 'Animal::Animal()'`.
> - A mismatched signature when overriding (for example forgetting `const`) creates a new unrelated method. With `override` the compiler tells you: `error: 'speak' marked 'override', but does not override`.
> - Passing a derived object **by value** to a function taking `Animal` (not `Animal&`) slices off the derived part. Pass by reference or pointer.

## Going further

Add a `Bird` class that sounds `Tweet`, and store several animals in a `vector<Animal*>` to call `speak()` on each in a loop.

> **Your turn:** make `Animal::speak` virtual, write `Dog` and `Cat` as classes derived from `Animal` (forwarding the name to the base constructor), and give them the sounds `Woof` and `Meow`. The program should print `Rex says Woof`, `Tom says Meow` and `Generic says ...`.
