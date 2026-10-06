---
title: Objects
summary: Group related values together as properties, and give them behaviour with methods.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const book = {
        title: "Dune",
        author: "Frank Herbert",
        year: 1965,
      };

      // 1. Add a property pages with the value 412, then print book.pages
      // 2. Make a variable field set to "author" and print book[field]
      //    (use bracket notation)
      // 3. Give the book a method describe() that returns
      //    "Dune by Frank Herbert (1965)" built from its own properties
      //    (use `this` inside the method). Print the result of calling it.
      // 4. Print how many properties the book has now (Object.keys)

check:
  output: |
    412
    Frank Herbert
    Dune by Frank Herbert (1965)
    5
  code:
    - pattern: "this\\."
      message: "Use this.title, this.author and this.year inside the method."
    - pattern: "Object\\.keys\\("
      message: "Use Object.keys(book).length to count the properties."
    - pattern: "book\\[\\s*field\\s*\\]"
      message: "Use bracket notation: book[field]."
hints:
  - "An object is a bundle of named values. You read and write a property with a dot, or with square brackets when the name is stored in a variable."
  - "book.pages = 412; then const field = \"author\"; book[field]. The method is a function stored on the object: describe() { return `...`; } and inside it you refer to the object with this."
  - "book.pages = 412;  const field = \"author\";  book.describe = function () { return `${this.title} by ${this.author} (${this.year})`; };  and console.log(Object.keys(book).length);"
solution:
  - code: |
      const book = {
        title: "Dune",
        author: "Frank Herbert",
        year: 1965,
      };

      book.pages = 412;
      console.log(book.pages);

      const field = "author";
      console.log(book[field]);

      book.describe = function () {
        return `${this.title} by ${this.author} (${this.year})`;
      };
      console.log(book.describe());

      console.log(Object.keys(book).length);
quiz:
  - q: How do you read the title property of an object called book?
    options: ["book(title)", "book.title", "book->title"]
    answer: 1
  - q: When must you use bracket notation, like  book[field] ?
    options: ["When the property name is stored in a variable", "Never, dot notation always works", "Only for numbers"]
    answer: 0
  - q: 'Inside a method, what does  this  refer to?'
    options: ["The whole program", "The browser window", "The object the method belongs to"]
    answer: 2
  - q: What does  Object.keys(obj)  return?
    options: ["An array of the property names", "The first property", "A copy of the object"]
    answer: 0
---

An array is a list, where position matters. An **object** is a collection of *named* values, where names matter. Objects are how JavaScript describes things in the real world: a user, a book, a product, a game character.

## Creating an object

```js
const user = {
  name: "Ava",
  age: 21,
  isStudent: true,
};
```

- Curly braces `{ }` wrap the object.
- Each entry is a **property**: a `name`, a colon, a `value`. We call the name the *key*.
- Properties are separated by commas. A trailing comma at the end is fine.
- Values can be anything: text, numbers, booleans, arrays, even other objects.

## Reading and changing properties

```js
console.log(user.name);   // prints: Ava
user.age = 22;            // change a property
user.city = "Haifa";      // add a new property
delete user.isStudent;    // remove a property
```

Remember that `const` only protects the variable, not the insides of the object, so the changes above are allowed.

## Bracket notation

You can also write `user["name"]`. The big advantage is that the name can be a **variable**:

```js
const field = "age";
console.log(user[field]); // prints: 22
```

If you wrote `user.field`, JavaScript would look for a property literally called "field". Use brackets for names that are stored in variables or that contain spaces.

## Methods and this

A property can hold a function. A function that belongs to an object is called a **method**:

```js
const dog = {
  name: "Rex",
  speak() {
    return `${this.name} says woof!`;
  },
};
console.log(dog.speak()); // prints: Rex says woof!
```

Inside a regular method, `this` means "the object this method was called on", so `this.name` is `dog.name`. (In arrow functions `this` works differently, so use `function` or the short method form for methods.) You have been using methods already: `console.log` is the method `log` of the object `console`.

## Looping over an object

```js
const keys = Object.keys(user);     // array of the keys
const values = Object.values(user); // array of the values

for (const key of Object.keys(user)) {
  console.log(key + ": " + user[key]);
}
```

`Object.keys(user).length` tells you how many properties there are.

## Objects inside arrays

The most common data shape is a list of objects:

```js
const people = [
  { name: "Ava", age: 21 },
  { name: "Ben", age: 17 },
];
const adults = people.filter((p) => p.age >= 18);
console.log(adults.length); // prints: 1
```

> **Watch out:**
> - Reading a property that does not exist gives `undefined`, not an error. A typo like `user.nmae` quietly gives `undefined`.
> - Reading a property of something missing: `user.address.street` when `address` is undefined fails with `TypeError: Cannot read properties of undefined (reading 'street')`.
> - Using `=` instead of `:` inside the braces, or forgetting the commas between properties: `SyntaxError: Unexpected identifier`.
> - Using an arrow function for a method and then using `this`: `this.name` will not be the object.
> - Comparing objects: `{ a: 1 } === { a: 1 }` is `false`, because they are two different objects.
> - Printing an object with text, as in `"User: " + user`, gives `User: [object Object]`. Print its properties instead.

## Going further

Add a `birthday()` method to `user` that increases `this.age` by one. Make an array of three books and use `map` to get all their titles.

> **Your turn:** follow the comments: add `pages`, read a property with brackets, add a `describe` method that uses `this`, and print how many properties the book has.
