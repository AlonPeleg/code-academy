---
title: Branded types and the builder pattern
summary: Stop mixing up look-alike values with branded types, and build objects step by step with a fluent builder.
level: advanced
runner: ts
files:
  - name: main.ts
    code: |
      // --- Part 1: branded types ---------------------------------------------
      // 1. Declare a generic type Brand<T, B extends string>: the type T intersected with
      //    an object type that has a readonly property __brand of type B.
      // 2. Declare type UserId = a Brand of number called "UserId",
      //    type OrderId = a Brand of number called "OrderId",
      //    and type Email = a Brand of string called "Email".
      // 3. Write userId(n: number): UserId and orderId(n: number): OrderId (use "as" once in each).
      // 4. Change getUser and getOrder so they only accept a UserId / an OrderId.
      // 5. Write parseEmail(input: string): Email | null. It returns the input as an Email
      //    when it looks like name@host.tld (use a regular expression), otherwise null.

      function getUser(id: number): string {
        return "user #" + id;
      }

      function getOrder(id: number): string {
        return "order #" + id;
      }

      const u = userId(1);
      const o = orderId(1);
      console.log(getUser(u));
      console.log(getOrder(o));
      // getUser(o);  <- once the brands exist, this line is a compile error
      console.log("valid: " + parseEmail("ada@example.com"));
      console.log("invalid: " + parseEmail("nope"));

      // --- Part 2: the builder pattern ---------------------------------------
      interface HttpRequest {
        method: string;
        url: string;
        headers: string[];
      }

      class RequestBuilder {
        private httpMethod = "GET";
        private params: string[] = [];
        private headerList: string[] = [];

        constructor(private baseUrl: string) {}

        // 6. method(m: string): set httpMethod and return this
        // 7. query(key: string, value: string): add key=value to params and return this
        // 8. header(name: string, value: string): add "name: value" to headerList and return this
        // 9. build() returns the finished HttpRequest: the url is baseUrl, plus "?" and the params joined by "&" when
        //    there are params.
      }

      const req = new RequestBuilder("https://api.test/users")
        .method("GET")
        .query("limit", "5")
        .header("Accept", "json")
        .header("X-Id", "7")
        .build();
      console.log(req.method + " " + req.url + " [" + req.headers.join(", ") + "]");
check:
  output: |
    user #1
    order #1
    valid: ada@example.com
    invalid: null
    GET https://api.test/users?limit=5 [Accept: json, X-Id: 7]
  code:
    - pattern: 'type\s+Brand\s*<\s*T\s*,\s*B\s+extends\s+string\s*>\s*=\s*T\s*&\s*\{\s*readonly\s+__brand\s*:\s*B'
      message: "Write  type Brand<T, B extends string> = T & { readonly __brand: B };"
    - pattern: 'type\s+UserId\s*=\s*Brand\s*<\s*number\s*,\s*["'']UserId["'']\s*>'
      message: 'Declare  type UserId = Brand<number, "UserId">;'
    - pattern: 'type\s+Email\s*=\s*Brand\s*<\s*string\s*,\s*["'']Email["'']\s*>'
      message: 'Declare  type Email = Brand<string, "Email">;'
    - pattern: 'function\s+getUser\s*\(\s*id\s*:\s*UserId\s*\)'
      message: "getUser should accept a UserId."
    - pattern: 'function\s+parseEmail\s*\(\s*input\s*:\s*string\s*\)\s*:\s*Email\s*\|\s*null'
      message: "Declare  function parseEmail(input: string): Email | null"
    - pattern: 'return\s+this\s*;[\s\S]*return\s+this\s*;[\s\S]*return\s+this\s*;'
      message: "method, query and header should each return this so calls can be chained."
    - pattern: 'build\s*\(\s*\)\s*:\s*HttpRequest'
      message: "Declare  build(): HttpRequest"
hints:
  - "A brand is a fake property that exists only in the type: T & { readonly __brand: B }. You never really add it, you just promise the compiler with 'as'. For the builder, every setter ends with return this; so you can chain calls, and build() creates the final object."
  - "type UserId = Brand<number, \"UserId\">;   function userId(n: number): UserId { return n as UserId; }   function getUser(id: UserId): string {...}   method(m: string): this { this.httpMethod = m; return this; }"
  - "function parseEmail(input: string): Email | null { return /^[^@\\s]+@[^@\\s]+\\.[a-z]+$/i.test(input) ? (input as Email) : null; }   build(): HttpRequest { const url = this.params.length ? this.baseUrl + \"?\" + this.params.join(\"&\") : this.baseUrl; return { method: this.httpMethod, url, headers: this.headerList }; }"
solution:
  - name: main.ts
    code: |
      type Brand<T, B extends string> = T & { readonly __brand: B };

      type UserId = Brand<number, "UserId">;
      type OrderId = Brand<number, "OrderId">;
      type Email = Brand<string, "Email">;

      function userId(n: number): UserId {
        return n as UserId;
      }

      function orderId(n: number): OrderId {
        return n as OrderId;
      }

      function getUser(id: UserId): string {
        return "user #" + id;
      }

      function getOrder(id: OrderId): string {
        return "order #" + id;
      }

      function parseEmail(input: string): Email | null {
        return /^[^@\s]+@[^@\s]+\.[a-z]+$/i.test(input) ? (input as Email) : null;
      }

      const u = userId(1);
      const o = orderId(1);
      console.log(getUser(u));
      console.log(getOrder(o));
      // getUser(o);  <- compile error: OrderId is not assignable to UserId
      console.log("valid: " + parseEmail("ada@example.com"));
      console.log("invalid: " + parseEmail("nope"));

      interface HttpRequest {
        method: string;
        url: string;
        headers: string[];
      }

      class RequestBuilder {
        private httpMethod = "GET";
        private params: string[] = [];
        private headerList: string[] = [];

        constructor(private baseUrl: string) {}

        method(m: string): this {
          this.httpMethod = m;
          return this;
        }

        query(key: string, value: string): this {
          this.params.push(key + "=" + value);
          return this;
        }

        header(name: string, value: string): this {
          this.headerList.push(name + ": " + value);
          return this;
        }

        build(): HttpRequest {
          const url = this.params.length > 0 ? this.baseUrl + "?" + this.params.join("&") : this.baseUrl;
          return { method: this.httpMethod, url, headers: this.headerList };
        }
      }

      const req = new RequestBuilder("https://api.test/users")
        .method("GET")
        .query("limit", "5")
        .header("Accept", "json")
        .header("X-Id", "7")
        .build();
      console.log(req.method + " " + req.url + " [" + req.headers.join(", ") + "]");
quiz:
  - q: What problem do branded types solve?
    options: ["They make numbers faster", "They stop values with the same base type (such as two kinds of id, both numbers) from being mixed up", "They hide properties from other classes"]
    answer: 1
  - q: Where does the __brand property of a branded type exist?
    options: ["On every object at run time", "In a hidden database", "Only in the type system, so there is no run-time cost"]
    answer: 2
    explain: The brand is a promise to the compiler. At run time a UserId is still just a plain number.
  - q: Why does each builder method end with  return this ?
    options: ["So the calls can be chained one after another", "To stop the program", "Because methods must always return something"]
    answer: 0
  - q: Why use a function like parseEmail that returns Email | null instead of casting with as Email everywhere?
    options: ["Casting is not allowed in TypeScript", "The check happens in one place, so every Email value in the program has been validated", "It runs faster"]
    answer: 1
---

Two ideas for writing safer, more readable TypeScript, both built entirely from features you know. **Branded types** make the compiler tell apart values that look the same, such as the id of a user and the id of an order. The **builder pattern** lets you create a complicated object step by step with calls that read like a sentence. Neither needs modules or extra libraries.

## The problem: everything is a number

Imagine this function:

```ts
function transfer(fromId: number, toId: number, cents: number) { /* ... */ }
transfer(500, 7, 42); // which is which?
```

All three arguments are `number`, so swapping two of them compiles happily and moves money from the wrong account. TypeScript is **structural**: two types are the same if they have the same shape, and a number is a number.

## Branded types

A **brand** adds a made-up property that makes a type incompatible with others, even though it is the same underneath:

```ts
type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = Brand<number, "UserId">;
type OrderId = Brand<number, "OrderId">;
```

Read `T & {...}` (an **intersection**) as "a `T` that also has this property". A `UserId` is a number carrying the label `"UserId"`, and an `OrderId` carries a different label, so one is not assignable to the other:

```ts
function getUser(id: UserId): string { return "user #" + id; }

const o = 5 as OrderId;
getUser(o);
// error: Argument of type 'OrderId' is not assignable to parameter of type 'UserId'.
```

The `__brand` property never exists at run time. It is only a promise to the compiler, so there is **zero cost**: a `UserId` is still a plain number. To create one you need a single `as` cast, which you hide inside a small function:

```ts
function userId(n: number): UserId {
  return n as UserId;
}
```

### Validation brands

The best use of brands is to prove something has been checked. A function that validates and then returns the branded type is the only way to obtain it:

```ts
type Email = Brand<string, "Email">;

function parseEmail(input: string): Email | null {
  return /^[^@\s]+@[^@\s]+\.[a-z]+$/i.test(input) ? (input as Email) : null;
}
```

Any function that takes an `Email` can now rely on it being valid, without checking again. The check lives in exactly one place.

## The builder pattern

Some objects have many optional parts: an HTTP request has a method, a URL, query parameters and headers. A constructor with eight arguments is hard to read. A **builder** collects the parts through small methods and creates the final object at the end:

```ts
class RequestBuilder {
  private httpMethod = "GET";
  private params: string[] = [];

  constructor(private baseUrl: string) {}

  method(m: string): this {
    this.httpMethod = m;
    return this;
  }

  query(key: string, value: string): this {
    this.params.push(key + "=" + value);
    return this;
  }

  build(): HttpRequest { /* assemble and return */ }
}
```

Each setter returns `this`, which is the object itself, so the calls chain into a **fluent interface**:

```ts
const req = new RequestBuilder("https://api.test/users")
  .method("GET")
  .query("limit", "5")
  .build();
```

The return type `this` (rather than `RequestBuilder`) also keeps working if you later write a subclass of the builder. `constructor(private baseUrl: string)` is the parameter-property shortcut from the classes lesson. Because the fields are `private`, nobody can create a half-finished request by touching them directly. Only `build()` yields the finished value.

## Which to use when

- Use brands for identifiers, units (meters vs feet) and validated strings.
- Use a builder when an object has many optional settings or a multi-step setup. For two or three options, a plain object parameter is simpler.

> **Watch out:**
> - Casting everywhere. If you write `x as UserId` all over the code, the brand protects nothing. Keep the cast inside one constructor function.
> - Forgetting that brands vanish at run time. `JSON.parse` returns plain numbers, so run them through `userId(...)` before use.
> - Writing a method that returns `void` in a builder: `Property 'query' does not exist on type 'void'` when you try to chain.
> - Returning a new builder from each call by accident and losing the state, or returning `this.params` instead of `this`.
> - Expecting `typeof id` to say `"UserId"`. At run time it is `"number"`.
> - Letting `build()` return the builder's own internal array (`this.headerList`). Later calls could change a request you already created. Copy it with `[...this.headerList]` when it matters.

## Going further

Add a brand `Meters` and `Feet` and write `function toFeet(m: Meters): Feet`. Try making `build()` throw if the base URL is empty.

> **Your turn:** declare `Brand`, `UserId`, `OrderId` and `Email`, write the constructor functions and `parseEmail`, make `getUser` and `getOrder` accept only their own id type, and finish `RequestBuilder` with chainable `method`, `query` and `header` methods and a `build()` method.
