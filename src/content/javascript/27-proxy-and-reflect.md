---
title: Proxy and Reflect
summary: Wrap an object in a Proxy to intercept reading and writing, and use Reflect to forward the work safely, for validation, default values, logging and negative indexes.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      // A Proxy wraps a target object. A "handler" object holds traps (get, set, ...)
      // that run when someone reads or writes through the proxy.
      // At the moment every helper below just returns the plain object, which does nothing.

      // 1. validated(target): a proxy whose set trap throws
      //    new TypeError(prop + " must be a number") when prop is "age" and the value is not a number.
      //    Otherwise store the value with Reflect.set and return its result.
      function validated(target) {
        return target;
      }
      const person = validated({ name: "Ada", age: 36 });
      person.age = 37;
      console.log(person.age);
      try {
        person.age = "old";
      } catch (error) {
        console.log(error.name + ": " + error.message);
      }

      // 2. withDefault(target, fallback): a proxy whose get trap returns fallback
      //    for properties that do not exist (use  prop in target  to test).
      function withDefault(target, fallback) {
        return target;
      }
      const counts = withDefault({}, 0);
      for (const word of "the cat the dog the".split(" ")) {
        counts[word]++;
      }
      console.log(counts.the, counts.cat, counts.zzz);

      // 3. logged(target, calls): a proxy that pushes "get <prop>" into calls on every read
      //    and "set <prop>" on every write, and then does the real read or write with Reflect.
      function logged(target, calls) {
        return target;
      }
      const calls = [];
      const spy = logged({ name: "Ada" }, calls);
      spy.name;
      spy.age = 5;
      console.log(calls.join(", "));

      // 4. negativeIndex(list): a proxy so that list[-1] is the last item, list[-2] the one before, ...
      //    Props arrive as strings, so test them with a regular expression like /^-\d+$/.
      function negativeIndex(list) {
        return list;
      }
      const letters = negativeIndex(["a", "b", "c"]);
      console.log(letters[-1], letters[-3], letters[0]);
check:
  output: |
    37
    TypeError: age must be a number
    3 1 0
    get name, set age
    c a a
  code:
    - pattern: 'new\s+Proxy\s*\('
      message: "Create the wrappers with new Proxy(target, handler)."
    - pattern: 'set\s*\(\s*\w+\s*,\s*\w+\s*,\s*\w+|set\s*:\s*(function|\()'
      message: "Add a set trap: set(target, prop, value, receiver) { ... }."
    - pattern: 'get\s*\(\s*\w+\s*,\s*\w+|get\s*:\s*(function|\()'
      message: "Add a get trap: get(target, prop, receiver) { ... }."
    - pattern: 'Reflect\.(get|set)\s*\('
      message: "Forward the real work with Reflect.get / Reflect.set."
hints:
  - "new Proxy(target, handler) returns a stand-in for target. The handler's get(target, prop, receiver) runs on every read and set(target, prop, value, receiver) on every write. Inside a trap, Reflect.get(...) and Reflect.set(...) do the normal default action."
  - "A set trap must return true when it succeeded (return Reflect.set(target, prop, value, receiver)), otherwise strict code throws a TypeError. In get, check prop in target first: if it exists return Reflect.get(target, prop, receiver), else return fallback."
  - "function validated(target) { return new Proxy(target, { set(t, prop, value, r) { if (prop === \"age\" && typeof value !== \"number\") throw new TypeError(prop + \" must be a number\"); return Reflect.set(t, prop, value, r); } }); }   For withDefault: get(t, prop, r) { return prop in t ? Reflect.get(t, prop, r) : fallback; }   For negativeIndex: get(t, prop, r) { if (typeof prop === \"string\" && /^-\\d+$/.test(prop)) return t[t.length + Number(prop)]; return Reflect.get(t, prop, r); }"
solution:
  - name: main.js
    code: |
      function validated(target) {
        return new Proxy(target, {
          set(t, prop, value, receiver) {
            if (prop === "age" && typeof value !== "number") {
              throw new TypeError(prop + " must be a number");
            }
            return Reflect.set(t, prop, value, receiver);
          },
        });
      }
      const person = validated({ name: "Ada", age: 36 });
      person.age = 37;
      console.log(person.age);
      try {
        person.age = "old";
      } catch (error) {
        console.log(error.name + ": " + error.message);
      }

      function withDefault(target, fallback) {
        return new Proxy(target, {
          get(t, prop, receiver) {
            return prop in t ? Reflect.get(t, prop, receiver) : fallback;
          },
        });
      }
      const counts = withDefault({}, 0);
      for (const word of "the cat the dog the".split(" ")) {
        counts[word]++;
      }
      console.log(counts.the, counts.cat, counts.zzz);

      function logged(target, calls) {
        return new Proxy(target, {
          get(t, prop, receiver) {
            calls.push("get " + String(prop));
            return Reflect.get(t, prop, receiver);
          },
          set(t, prop, value, receiver) {
            calls.push("set " + String(prop));
            return Reflect.set(t, prop, value, receiver);
          },
        });
      }
      const calls = [];
      const spy = logged({ name: "Ada" }, calls);
      spy.name;
      spy.age = 5;
      console.log(calls.join(", "));

      function negativeIndex(list) {
        return new Proxy(list, {
          get(t, prop, receiver) {
            if (typeof prop === "string" && /^-\d+$/.test(prop)) {
              return t[t.length + Number(prop)];
            }
            return Reflect.get(t, prop, receiver);
          },
        });
      }
      const letters = negativeIndex(["a", "b", "c"]);
      console.log(letters[-1], letters[-3], letters[0]);
quiz:
  - q: What is a Proxy?
    options: ["A copy of an object that stays in sync", "A wrapper object that runs your trap functions when the original is read, written, deleted and so on", "A faster kind of object"]
    answer: 1
  - q: What must a set trap return, and why?
    options: ["The old value, so it can be restored", "Nothing, the return value is ignored", "true when the assignment succeeded; a falsy result makes strict code throw a TypeError"]
    answer: 2
    explain: "The error looks like: TypeError: 'set' on proxy: trap returned falsish for property 'age'."
  - q: Why use Reflect.get(target, prop, receiver) inside a trap?
    options: ["It performs the default behaviour correctly, including getters and inheritance", "It makes the proxy run faster", "It is required, a proxy does not work without it"]
    answer: 0
  - q: Which of these is a good use of a Proxy?
    options: ["Replacing every for loop in your program", "Adding validation or logging around an object without changing the object itself", "Making numbers calculate faster"]
    answer: 1
---

A **Proxy** is a stand-in for another object. Everything you do to the proxy (reading a property, writing one, checking `in`, deleting) first passes through functions that you write, called **traps**. You can allow the action, change it, log it or refuse it. Vue 3 builds its reactivity on proxies, and many libraries use them for validation, logging and "magic" objects.

## The shape of a Proxy

```js
const proxy = new Proxy(target, handler);
```

- `target` is the real object being wrapped.
- `handler` is an object whose methods are the traps. A trap you do not define simply behaves as normal.

The two traps you will use most:

| Trap | Runs when | Arguments |
| --- | --- | --- |
| `get` | someone reads `proxy.x` | `(target, prop, receiver)` |
| `set` | someone writes `proxy.x = v` | `(target, prop, value, receiver)` |

There are also `has` (the `in` operator), `deleteProperty`, `ownKeys` (used by `Object.keys`), `apply` (calling a function proxy) and more.

```js
const user = new Proxy({ name: "Ada" }, {
  get(target, prop, receiver) {
    console.log("reading " + String(prop));
    return Reflect.get(target, prop, receiver);
  },
});
console.log(user.name);
// prints: reading name
// prints: Ada
```

## Reflect: the default action

Inside a trap you usually want to do the normal thing and add something around it. The built-in **Reflect** object has one function per trap that does exactly the default action: `Reflect.get`, `Reflect.set`, `Reflect.has`, `Reflect.deleteProperty` and so on. Using them is better than `target[prop]` because they handle getters, inheritance and the `receiver` (the object the access started from) correctly.

## Three classic uses

**1. Validation.** Stop bad data at the door. The `set` trap checks the value and throws, or stores it:

```js
set(target, prop, value, receiver) {
  if (prop === "age" && typeof value !== "number") throw new TypeError("age must be a number");
  return Reflect.set(target, prop, value, receiver);
}
```

**2. Default values.** A `get` trap that answers for missing properties: `prop in target ? Reflect.get(...) : fallback`. This is how `counts[word]++` can work without first writing `counts[word] = 0`.

**3. Logging and debugging.** Record every read and write to see how a piece of code uses an object. Remember that property names can also be **symbols** (for instance when JavaScript prints an object), which is why the exercise uses `String(prop)` before joining text.

A fourth trick is changing the meaning of keys: the exercise makes `list[-1]` mean "last item" by turning a negative key into a normal index. Array indexes always reach a `get` trap as strings, so you test them with a pattern.

## When not to use a Proxy

Proxies are powerful but have costs. Every access goes through a function, so they are slower than plain objects. They can make debugging confusing because the object you see is not the object that does the work. And a proxy is a different object from its target: `proxy === target` is `false`. Choose them for infrastructure code (frameworks, validation layers), not for everyday logic where a class with a setter does the job.

> **Watch out:**
> - Forgetting to return `true` (or the result of `Reflect.set`) from a `set` trap. In strict code that gives `TypeError: 'set' on proxy: trap returned falsish for property 'age'`.
> - Writing `proxy[prop]` inside a trap. That triggers the same trap again and ends in `RangeError: Maximum call stack size exceeded`. Use `target[prop]` or `Reflect.get(target, ...)`.
> - Expecting a change in the original to be validated. Only access through the proxy is intercepted; if someone keeps a reference to the plain target, they bypass the traps.
> - Returning a value from `get` for every property, including `Symbol.toPrimitive` or `toJSON`. A default value for everything can confuse printing and JSON. Check `prop in target` first, as in the lesson.
> - Using a Proxy on a value that is not an object: `TypeError: Cannot create proxy with a non-object as target or handler`.

## Going further

Make a `readOnly(target)` proxy whose `set` and `deleteProperty` traps throw an error. Then try `Proxy.revocable(target, handler)`, which gives you a `revoke()` function that switches the proxy off.

> **Your turn:** turn the four helper functions into proxies (`validated`, `withDefault`, `logged`, `negativeIndex`) so the five lines print as shown.
