---
title: Classes and inheritance
summary: Bundle data and behaviour into classes, hide details with private fields, and reuse code with extends and super.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      class Animal {
        // 1. Add a private field for energy that starts at 10 (a name starting with #).
        // 2. Add a static field called count that starts at 0.
        //    The constructor must add 1 to it every time an animal is created.

        constructor(name) {
          this.name = name;
        }

        speak() {
          return `${this.name} makes a sound`;
        }

        // 3. Add a method eat() that adds 5 to the private energy and returns this
        //    (so calls can be chained).

        // 4. Add a getter called energy that returns the private energy value.
      }

      // 5. Write class Dog that extends Animal.
      //    - constructor(name, trick): pass the name up to the parent, then store trick.
      //    - speak() returns the parent's speak() text followed by " - woof!"
      //    - perform() returns `${name} does ${trick}`

      const generic = new Animal("Generic");
      const rex = new Dog("Rex", "roll over");
      console.log(generic.speak());
      console.log(rex.speak());
      console.log(rex.perform());
      rex.eat().eat();
      console.log(rex.energy);
      console.log(Animal.count);
      console.log(rex instanceof Animal);
check:
  output: |
    Generic makes a sound
    Rex makes a sound - woof!
    Rex does roll over
    20
    2
    true
  code:
    - pattern: 'class\s+Dog\s+extends\s+Animal'
      message: "Declare the subclass with class Dog extends Animal."
    - pattern: 'super\s*\(\s*name\s*\)'
      message: "Call super(name) first in the Dog constructor."
    - pattern: 'super\.speak\s*\('
      message: "Reuse the parent's method with super.speak()."
    - pattern: '#energy'
      message: "Keep the energy in a private field named #energy."
    - pattern: 'static\s+count'
      message: "Declare a static field: static count = 0;"
    - pattern: 'get\s+energy\s*\('
      message: "Add a getter: get energy() { ... }"
hints:
  - "Private fields are declared in the class body with a leading #. Static members belong to the class itself and are used as Animal.count. A subclass must call the parent constructor before it touches this."
  - "In Animal: #energy = 10;  static count = 0;  and Animal.count++ inside the constructor. For eat(): this.#energy += 5; return this;  For Dog: class Dog extends Animal { constructor(name, trick) { super(name); ... } }"
  - "class Dog extends Animal { constructor(name, trick) { super(name); this.trick = trick; }  speak() { return super.speak() + \" - woof!\"; }  perform() { return `${this.name} does ${this.trick}`; } }   and in Animal:  get energy() { return this.#energy; }"
solution:
  - name: main.js
    code: |
      class Animal {
        #energy = 10;
        static count = 0;

        constructor(name) {
          this.name = name;
          Animal.count++;
        }

        speak() {
          return `${this.name} makes a sound`;
        }

        eat() {
          this.#energy += 5;
          return this;
        }

        get energy() {
          return this.#energy;
        }
      }

      class Dog extends Animal {
        constructor(name, trick) {
          super(name);
          this.trick = trick;
        }

        speak() {
          return `${super.speak()} - woof!`;
        }

        perform() {
          return `${this.name} does ${this.trick}`;
        }
      }

      const generic = new Animal("Generic");
      const rex = new Dog("Rex", "roll over");
      console.log(generic.speak());
      console.log(rex.speak());
      console.log(rex.perform());
      rex.eat().eat();
      console.log(rex.energy);
      console.log(Animal.count);
      console.log(rex instanceof Animal);
quiz:
  - q: What must a subclass constructor do before it can use this?
    options: ["Call super(...) to run the parent constructor", "Declare every field again", "Return an object"]
    answer: 0
  - q: What does the # in  #energy  mean?
    options: ["The field is a comment", "The field is static", "The field is private and can only be used inside the class body"]
    answer: 2
  - q: "How do you read a static field count of a class Animal?"
    options: ["this.count on an instance", "Animal.count", "count"]
    answer: 1
    explain: Static members live on the class itself, not on the objects it creates.
  - q: What is the difference between a class and an object created from it?
    options: ["There is none", "An object is the blueprint, a class is one product", "The class is the blueprint, each object made with new is one instance of it"]
    answer: 2
---

Once a program grows, you will have many objects that share the same shape and the same behaviour: dozens of users, hundreds of enemies, thousands of products. A **class** is a blueprint for such objects, and **inheritance** lets one blueprint build on another instead of copying code. This lesson covers the modern class syntax from top to bottom.

## A class in one picture

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

const cat = new Animal("Tom");
console.log(cat.speak()); // prints: Tom makes a sound
```

- `class Animal { ... }` defines the blueprint. By convention the name starts with a capital letter.
- `constructor` runs once each time you write `new Animal(...)`. Inside it, `this` is the brand-new object, so `this.name = name` stores data on it.
- `speak()` is a **method**. It lives on the class, is shared by every instance, and can read the object's data through `this`.
- `new` creates the object. Forgetting it is an error.

## Inheritance with extends and super

When a new kind of thing is a more specific version of an existing one, use `extends`:

```js
class Dog extends Animal {
  constructor(name, trick) {
    super(name);        // run the Animal constructor first
    this.trick = trick;
  }

  speak() {
    return super.speak() + " - woof!";   // reuse, then add
  }
}
```

A `Dog` automatically gets everything `Animal` has, and `rex instanceof Animal` is `true`. Two keywords do the work:

- `super(...)` inside a constructor calls the parent constructor. In a subclass you **must** call it before using `this`.
- `super.speak()` calls the parent's version of a method. Writing your own `speak()` in the subclass is called **overriding**.

Behind the scenes JavaScript links the objects through a **prototype chain**: when you call `rex.speak()`, it looks on `rex`, then on `Dog`'s prototype, then on `Animal`'s, and stops at the first match.

## Private fields

By default, every property can be read and changed from anywhere. A name starting with `#` is **private**: only code written inside the class body can touch it.

```js
class Counter {
  #value = 0;
  increment() { this.#value++; return this; }
  get value() { return this.#value; }
}
```

A **getter** (`get value()`) looks like a plain property from the outside (`counter.value`, no parentheses) but runs code. This is how you expose a read-only view of private data. Returning `this` from a method allows **chaining**: `counter.increment().increment()`.

## Static members

A `static` field or method belongs to the class, not to its instances. It is useful for counters, constants and helper functions such as `Animal.count` or `Math.max`:

```js
class Animal {
  static count = 0;
  constructor() { Animal.count++; }
}
```

## When to use inheritance

Inheritance models an "is a" relationship: a Dog is an Animal. If the relationship is "has a" (a Car has an Engine), store the other object in a field instead, which is called **composition**. Deep inheritance trees become hard to change, so keep them shallow and prefer composition when you are unsure.

> **Watch out:**
> - Using `this` before `super(...)`: `ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor`.
> - Forgetting `new`: `TypeError: Class constructor Animal cannot be invoked without 'new'`.
> - Reaching into a private field from outside: `SyntaxError: Private field '#energy' must be declared in an enclosing class`.
> - Passing a method as a callback, such as `setTimeout(rex.speak, 100)`. The method loses its `this` and fails with `Cannot read properties of undefined`. Use `() => rex.speak()` instead.
> - Writing commas between methods in a class body. Unlike object literals, classes do not use them.

## Going further

Add a `Cat` subclass whose `speak()` says "meow". Then loop over `[rex, cat, generic]` and call `speak()` on each. The same call gives different results depending on the object, which is called **polymorphism**.

> **Your turn:** finish `Animal` with a private `#energy` (starting at 10), a static `count`, an `eat()` method that returns `this`, and a getter `energy`. Then write `Dog extends Animal` with a constructor that calls `super(name)`, a `speak()` that reuses `super.speak()`, and a `perform()` method.
