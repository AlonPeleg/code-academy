---
title: Encapsulation, symbols and WeakMap privacy
summary: Protect an object's data with private fields, validating setters, private statics and brand checks, and customise conversions with Symbol.toPrimitive.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      // 1. Finish the Temperature class.
      class Temperature {
        // a private field (name starts with #) called celsius, starting at 0
        // a private static counter #created that starts at 0

        constructor(celsius) {
          // use the setter below so the value is validated, and count the new object
        }

        // a getter and a setter named celsius.
        // The setter must throw new RangeError("below absolute zero") when the value is below -273.15.

        // a getter fahrenheit (celsius * 9 / 5 + 32)

        // a static method fromFahrenheit(f) that returns a new Temperature: (f - 32) * 5 / 9

        // a static getter created that returns how many objects were made

        // a static method isTemperature(obj) that is true only for real Temperature objects
        // (hint: you can test for a private field with  #name in obj)

        // conversion method using the well-known symbol toPrimitive, receiving a hint: "string" gives the text  "<celsius> C", anything else gives the number
      }

      const t = new Temperature(25);
      console.log(t.celsius, t.fahrenheit);
      t.celsius = 30;
      console.log(t.celsius);
      try {
        t.celsius = -300;
      } catch (error) {
        console.log(error.name + ": " + error.message);
      }
      console.log(`${t}`);
      console.log(t + 5);
      console.log(t > 20);
      console.log(Temperature.fromFahrenheit(212).celsius);
      console.log(Temperature.created);
      console.log(Temperature.isTemperature(t), Temperature.isTemperature({}));

      // 2. Symbols make property keys that never clash and stay out of Object.keys.
      //    Create a symbol tag with the description "tag", store "lab" on t under that key,
      //    and print how many normal keys t has plus the tag value, like  0 lab
      console.log("?");

      // 3. Privacy without # : keep each counter's number in a WeakMap named counts
      //    (key = the Counter object, value = the number). Finish the class.
      class Counter {
        constructor() {}
        inc() {}
        get value() {
          return 0;
        }
      }
      const c = new Counter();
      c.inc();
      c.inc();
      console.log(c.value);
check:
  output: |
    25 77
    30
    RangeError: below absolute zero
    30 C
    35
    true
    100
    2
    true false
    0 lab
    2
  code:
    - pattern: '#celsius'
      message: "Keep the temperature in a private field #celsius."
    - pattern: 'static\s+#created'
      message: "Declare a private static field: static #created = 0;"
    - pattern: '(get|set)\s+celsius'
      message: "Add a getter and a setter named celsius."
    - pattern: '#celsius\s+in\s+'
      message: "Use  #celsius in obj  for the brand check."
    - pattern: '\[\s*Symbol\.toPrimitive\s*\]'
      message: "Define [Symbol.toPrimitive](hint)."
    - pattern: 'Symbol\s*\(\s*["'']tag["'']\s*\)'
      message: "Create the symbol with Symbol(\"tag\")."
    - pattern: 'new\s+WeakMap\s*\('
      message: "Create counts with new WeakMap()."
hints:
  - "A private field is declared with # inside the class body and can only be used inside it. A setter is the right place for validation, and the constructor can simply do this.celsius = value so the same check runs. Symbol.toPrimitive receives a hint: \"string\", \"number\" or \"default\"."
  - "Fields: #celsius = 0; static #created = 0;   constructor(c) { this.celsius = c; Temperature.#created++; }   get celsius() { return this.#celsius; }   set celsius(v) { if (v < -273.15) throw new RangeError(\"below absolute zero\"); this.#celsius = v; }   static isTemperature(o) { return #celsius in o; }"
  - "[Symbol.toPrimitive](hint) { return hint === \"string\" ? this.#celsius + \" C\" : this.#celsius; }   const tag = Symbol(\"tag\"); t[tag] = \"lab\"; console.log(Object.keys(t).length + \" \" + t[tag]);   const counts = new WeakMap(); constructor() { counts.set(this, 0); } inc() { counts.set(this, counts.get(this) + 1); } get value() { return counts.get(this); }"
solution:
  - name: main.js
    code: |
      class Temperature {
        #celsius = 0;
        static #created = 0;

        constructor(celsius) {
          this.celsius = celsius;
          Temperature.#created++;
        }

        get celsius() {
          return this.#celsius;
        }

        set celsius(value) {
          if (value < -273.15) throw new RangeError("below absolute zero");
          this.#celsius = value;
        }

        get fahrenheit() {
          return (this.#celsius * 9) / 5 + 32;
        }

        static fromFahrenheit(f) {
          return new Temperature(((f - 32) * 5) / 9);
        }

        static get created() {
          return Temperature.#created;
        }

        static isTemperature(obj) {
          return #celsius in obj;
        }

        [Symbol.toPrimitive](hint) {
          return hint === "string" ? this.#celsius + " C" : this.#celsius;
        }
      }

      const t = new Temperature(25);
      console.log(t.celsius, t.fahrenheit);
      t.celsius = 30;
      console.log(t.celsius);
      try {
        t.celsius = -300;
      } catch (error) {
        console.log(error.name + ": " + error.message);
      }
      console.log(`${t}`);
      console.log(t + 5);
      console.log(t > 20);
      console.log(Temperature.fromFahrenheit(212).celsius);
      console.log(Temperature.created);
      console.log(Temperature.isTemperature(t), Temperature.isTemperature({}));

      const tag = Symbol("tag");
      t[tag] = "lab";
      console.log(Object.keys(t).length + " " + t[tag]);

      const counts = new WeakMap();
      class Counter {
        constructor() {
          counts.set(this, 0);
        }
        inc() {
          counts.set(this, counts.get(this) + 1);
        }
        get value() {
          return counts.get(this);
        }
      }
      const c = new Counter();
      c.inc();
      c.inc();
      console.log(c.value);
quiz:
  - q: What happens if code outside the class writes  obj.#celsius ?
    options: ["It returns undefined", "It is a SyntaxError: the private name is only valid inside the class body", "It works but prints a warning"]
    answer: 1
  - q: "Why does the constructor in the exercise assign  this.celsius = celsius  instead of  this.#celsius = celsius ?"
    options: ["The setter then validates the starting value as well", "Private fields cannot be assigned in a constructor", "It is faster"]
    answer: 0
  - q: What does  Object.keys(obj)  show for a property whose key is a Symbol?
    options: ["The description of the symbol", "The word Symbol", "Nothing: symbol keys are skipped"]
    answer: 2
    explain: Symbol keys are also skipped by for...in and JSON.stringify. Use Object.getOwnPropertySymbols(obj) or Reflect.ownKeys(obj) to list them.
  - q: What is the advantage of a WeakMap for private data compared with a normal Map?
    options: ["It is much faster", "When the key object is no longer used anywhere, its entry can be garbage-collected", "It keeps the keys sorted"]
    answer: 1
---

**Encapsulation** means keeping an object's inner data hidden and only allowing changes through methods that make sure the data stays valid. Think of a bank account: you cannot reach into the vault and edit the balance, you can only call `deposit` and `withdraw`. In this lesson you go beyond the basics from the "Classes and inheritance" lesson and also meet symbols and WeakMaps.

## Validation with getters and setters

A **getter** (`get x()`) and a **setter** (`set x(value)`) look like a normal property from outside, but run code. The setter is the natural place to refuse bad values:

```js
class Account {
  #balance = 0;
  get balance() { return this.#balance; }
  set balance(value) {
    if (value < 0) throw new RangeError("negative balance");
    this.#balance = value;
  }
}
const a = new Account();
a.balance = 50;       // runs the setter
console.log(a.balance); // prints: 50
a.balance = -5;       // RangeError: negative balance
```

The `#` makes `#balance` truly private: only code **inside the class body** can touch it. Code outside gets a `SyntaxError`, and unlike a naming convention such as `_balance`, nobody can bypass it.

## More private things and static members

Private names can also be **methods** (`#recalculate() { ... }`) and **static** fields (`static #created = 0`). A static member belongs to the class itself: `Temperature.created`, not `t.created`. Inside the class you reach a private static with the class name: `Temperature.#created++`.

A neat trick is the **brand check**. `#celsius in obj` is `true` only for objects that were really built by this class (they own that private field). It never throws, which makes it perfect for a safe `isTemperature(obj)`.

## Controlling conversion with Symbol.toPrimitive

When JavaScript needs to turn an object into a plain value (`${obj}`, `obj + 5`, `obj > 20`) it asks the object for a **hint**: `"string"`, `"number"` or `"default"`. You answer the question by defining a method under the special key `Symbol.toPrimitive`:

```js
const price = {
  amount: 9,
  [Symbol.toPrimitive](hint) {
    return hint === "string" ? "$" + this.amount : this.amount;
  },
};
console.log(`${price}`);  // prints: $9
console.log(price * 2);   // prints: 18
```

## What is a Symbol?

A **symbol** is a unique value created with `Symbol("description")`. Two symbols are never equal, even with the same description. Used as a property key, a symbol cannot collide with any other key, and it is skipped by `Object.keys`, `for...in` and `JSON.stringify`. That makes symbols good for metadata that should not show up in normal loops. (You have met `Symbol.iterator`, a built-in "well-known" symbol.)

```js
const id = Symbol("id");
const user = { name: "Ada", [id]: 7 };
console.log(Object.keys(user)); // prints: [ "name" ]
console.log(user[id]);          // prints: 7
```

Note the brackets: `[id]: 7` means "use the value of `id` as the key".

## Privacy before `#`: WeakMap

Older code hid data in a **WeakMap** declared outside the class: the key is the object, the value is its secret data. Only code that can see the WeakMap can read it. Because keys are held weakly, the data disappears when the object does, so there is no memory leak. You still meet this pattern in libraries that must support old browsers.

> **Watch out:**
> - `SyntaxError: Private field '#balance' must be declared in an enclosing class` when you use `#balance` outside the class or forget to declare it at the top of the class body.
> - Calling a getter like a function: `a.balance()` gives `TypeError: a.balance is not a function`.
> - A setter without a matching getter makes the property read as `undefined`.
> - Setting a value inside a setter with the same name (`this.balance = value`) instead of the private field: it calls the setter again and ends in `RangeError: Maximum call stack size exceeded`.
> - Private fields are not copied by spread or `structuredClone`, and do not show in `console.log` the way normal fields do.
> - Using `Symbol` with `new`: `new Symbol()` throws `TypeError: Symbol is not a constructor`.

## Going further

Add a private method `#log(message)` to `Temperature`, call it from the setter, and prove that `t.#log` fails from outside. Try `Object.getOwnPropertySymbols(t)` to see the symbol key from the exercise.

> **Your turn:** finish the `Temperature` class (private field, validating setter, static private counter, brand check, `Symbol.toPrimitive`), then add the symbol property and the WeakMap based `Counter`.
