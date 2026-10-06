---
title: The modern syntax toolbox
summary: Use optional chaining, nullish operators, rest and spread, structuredClone, at(), Object.entries and flatMap to write shorter and safer code.
level: intermediate
runner: js
files:
  - name: main.js
    code: |
      const user = {
        name: "Ada",
        address: { city: "London" },
        tags: ["x", "y", "z"],
        settings: null,
      };

      // 1. Replace the three undefined values with real expressions.
      //    city: the user's city, read safely.
      //    email: user.profile does not exist, so use a safe read and fall back to "no email".
      //    theme: user.settings is null, so fall back to "light".
      const city = undefined;
      const email = undefined;
      const theme = undefined;
      console.log(city, email, theme);

      // 2. Fill in missing settings WITHOUT overwriting real values (0 and "" are real values
      //    for retries, but a name that is empty should become "anonymous").
      const config = { retries: 0, name: "", timeout: undefined };
      // retries should become 3 only if it is null or undefined (it is not, so it stays 0)
      // timeout should become 30 only if it is null or undefined
      // name should become "anonymous" if it is falsy
      console.log(JSON.stringify(config));

      // 3. Make a deep, independent copy of user in a const called copy.
      //    Then change the city of the copy to "Paris".
      const copy = user;
      console.log(user.address.city + " " + copy.address.city);

      // 4. Print the LAST tag without using length.
      console.log(undefined);

      // 5. Finish summarize(first, ...rest): it returns "<first> and <n> more",
      //    where n is how many extra arguments there were. Call it by spreading user.tags.
      function summarize() {
        return "";
      }
      console.log(summarize());

      // 6. Use object rest: take name out of user, and keep everything else in others.
      const others = {};
      console.log(Object.keys(others).join(","));

      // 7. Double every price: turn the object into entries, change each value,
      //    and turn the entries back into an object.
      const prices = { apple: 1, pear: 2 };
      const doubled = prices;
      console.log(JSON.stringify(doubled));

      // 8. Split every sentence into words and get one flat list of words.
      const sentences = ["a b", "c d e"];
      const allWords = sentences;
      console.log(allWords.join("-"));
check:
  output: |
    London n/a no email light
    {"retries":0,"name":"anonymous","timeout":30}
    London Paris
    z
    x and 2 more
    address,tags,settings
    {"apple":2,"pear":4}
    a-b-c-d-e
  code:
    - pattern: '\?\.'
      message: "Use optional chaining (?.) for the safe reads."
    - pattern: '\?\?='
      message: "Use the ??= operator."
    - pattern: '\|\|='
      message: "Use the ||= operator."
    - pattern: 'structuredClone\s*\('
      message: "Use structuredClone(user) for the deep copy."
    - pattern: '\.at\s*\(\s*-1\s*\)'
      message: "Use .at(-1) to read the last item."
    - pattern: 'Object\.fromEntries\s*\('
      message: "Use Object.fromEntries to build the object back."
    - pattern: '\.flatMap\s*\('
      message: "Use flatMap to map and flatten in one step."
hints:
  - "?. stops and gives undefined when something on the way is missing. ?? picks the right side only when the left side is null or undefined. ??= and ||= assign only when the value is null/undefined (??=) or falsy (||=)."
  - "const city = user.address?.city; const email = user.profile?.email ?? \"no email\"; config.retries ??= 3; config.timeout ??= 30; config.name ||= \"anonymous\"; const copy = structuredClone(user); copy.address.city = \"Paris\"; user.tags.at(-1)"
  - "function summarize(first, ...rest) { return first + \" and \" + rest.length + \" more\"; }   const { name, ...others } = user;   const doubled = Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2]));   const allWords = sentences.flatMap((s) => s.split(\" \"));   and call summarize(...user.tags)"
solution:
  - name: main.js
    code: |
      const user = {
        name: "Ada",
        address: { city: "London" },
        tags: ["x", "y", "z"],
        settings: null,
      };

      const city = user.address?.city;
      const zip = user.address?.zip ?? "n/a";
      const email = user.profile?.email ?? "no email";
      const theme = user.settings?.theme ?? "light";
      console.log(city, zip, email, theme);

      const config = { retries: 0, name: "", timeout: undefined };
      config.retries ??= 3;
      config.timeout ??= 30;
      config.name ||= "anonymous";
      console.log(JSON.stringify(config));

      const copy = structuredClone(user);
      copy.address.city = "Paris";
      console.log(user.address.city + " " + copy.address.city);

      console.log(user.tags.at(-1));

      function summarize(first, ...rest) {
        return first + " and " + rest.length + " more";
      }
      console.log(summarize(...user.tags));

      const { name, ...others } = user;
      console.log(Object.keys(others).join(","));

      const prices = { apple: 1, pear: 2 };
      const doubled = Object.fromEntries(
        Object.entries(prices).map(([key, value]) => [key, value * 2])
      );
      console.log(JSON.stringify(doubled));

      const sentences = ["a b", "c d e"];
      const allWords = sentences.flatMap((s) => s.split(" "));
      console.log(allWords.join("-"));
quiz:
  - q: What does  user.profile?.email  give when user.profile is undefined?
    options: ["A TypeError", "undefined, with no error", "The text \"email\""]
    answer: 1
  - q: "What is the difference between  a ?? b  and  a || b ?"
    options: ["There is none", "?? is faster", "?? only falls back when a is null or undefined, while || also falls back for 0, \"\" and false"]
    answer: 2
    explain: "With count = 0, count ?? 10 stays 0 but count || 10 becomes 10. Use ?? when 0 or an empty string is a valid value."
  - q: Why use structuredClone(obj) instead of { ...obj } for nested data?
    options: ["The spread syntax is not allowed on objects", "Spread only copies the first level, so nested objects are still shared", "structuredClone copies functions too"]
    answer: 1
  - q: What does  [3, 4, 5].at(-1)  return?
    options: ["5", "undefined", "3"]
    answer: 0
---

JavaScript has grown a lot since the early days. The newer features in this lesson are small, but you will see them in almost every modern codebase. Each one removes a chunk of defensive code: no more long chains of `&&`, no more manual loops for copying and reshaping data.

## Optional chaining: `?.`

Reading a property of `undefined` crashes your program: `TypeError: Cannot read properties of undefined (reading 'email')`. **Optional chaining** stops the chain and gives `undefined` instead:

```js
const user = { name: "Ada" };
console.log(user.profile?.email);       // prints: undefined
console.log(user.profile?.email.length); // prints: undefined (the whole chain is skipped)
console.log(user.greet?.());            // calling a method that may not exist: undefined
console.log(user.tags?.[0]);            // safe index access: undefined
```

Use `?.` when the data may legitimately be missing (from an API, a form, a config file). Do not sprinkle it everywhere: if something should always exist, a loud error is better than a silent `undefined`.

## Nullish coalescing: `??`

`a ?? b` means "use `a`, unless it is `null` or `undefined`, then use `b`". It looks like the older `||`, but `||` falls back for **every falsy value**: `0`, `""`, `false` and `NaN` too.

```js
const volume = 0;
console.log(volume || 50);  // prints: 50   (wrong: 0 is a real volume!)
console.log(volume ?? 50);  // prints: 0    (correct)
```

The assignment forms save repetition. `x ??= 5` means `x = x ?? 5`, and `x ||= 5` means `x = x || 5`. There is also `&&=`.

## Rest and spread, again

Both use `...`. When it **collects**, it is **rest**; when it **expands**, it is **spread**.

```js
function summarize(first, ...rest) { /* rest is an array of the remaining arguments */ }
const { name, ...others } = user;       // others: a new object without name
const merged = { ...defaults, ...settings }; // later values win
Math.max(...[4, 9, 2]);                 // spread an array into arguments
```

## Copying: `structuredClone`

`{ ...obj }` and `[...list]` make a **shallow** copy: only the first level is new, and nested objects are still shared. `structuredClone(value)` makes a **deep** copy of plain data (objects, arrays, Maps, Sets, Dates). It cannot copy functions and throws `DataCloneError` if you try.

## Handy array and object helpers

- `list.at(-1)` reads from the end (`-1` is the last item); `list[-1]` does **not** work.
- `Object.entries(obj)` gives `[[key, value], ...]`; `Object.fromEntries(entries)` builds an object back. Together they let you transform an object like an array.
- `list.flatMap(fn)` is `map` followed by flattening one level, perfect when each item produces several results.

```js
const prices = { apple: 1, pear: 2 };
Object.entries(prices);                       // [["apple", 1], ["pear", 2]]
["a b", "c"].flatMap((s) => s.split(" "));    // ["a", "b", "c"]
```

> **Watch out:**
> - `TypeError: Cannot read properties of undefined` means you forgot a `?.` earlier in the chain, not only at the last step.
> - Using `||` for defaults when `0`, `""` or `false` are valid values. Prefer `??`.
> - Writing `a ?? b || c` without parentheses is a `SyntaxError`: you must not mix `??` with `||` or `&&` unless you add parentheses.
> - `const copy = user` does not copy anything. Both names point to the same object, so changing `copy` changes `user`.
> - `structuredClone` on an object containing a function fails with `DataCloneError`.
> - `?.` cannot be used on the left side of an assignment: `user?.name = "x"` is a `SyntaxError`.

## Going further

Merge two config objects with spread and give every missing option a default with `??=`. Then use `Object.entries` with `sort` to print the most expensive price first.

> **Your turn:** replace each placeholder in the starter with a real expression, following the eight numbered comments, until the eight lines print as shown.
