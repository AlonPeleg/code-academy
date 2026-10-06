---
title: Regular expressions
summary: Describe text patterns to find, validate, extract and rewrite parts of a string.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const log =
        "Order #123 shipped on 2024-03-15 to ada@example.com; " +
        "order #456 shipped on 2024-04-02 to grace@example.org";

      // 1. Find every order number (digits after a #) with matchAll and a capture group.
      //    Print them joined by ", ".

      // 2. Rewrite every date from YYYY-MM-DD to DD/MM/YYYY with replace.
      //    Use NAMED groups (year, month, day) and print the whole new text.

      // 3. Match all email addresses with match() and the g flag.
      //    Print: <count> emails: <emails joined by " | ">

      // 4. Write isHexColor(text): true for "#fff" or "#a1b2c3" style colours
      //    (3 or 6 hex digits after a #, upper or lower case), otherwise false.
      //    Use test() and anchors so the WHOLE text must match.
      for (const t of ["#fff", "#A1B2C3", "#ggg", "123456", "#12345"]) {
        console.log(t + " -> " + isHexColor(t));
      }
check:
  output: |
    123, 456
    Order #123 shipped on 15/03/2024 to ada@example.com; order #456 shipped on 02/04/2024 to grace@example.org
    2 emails: ada@example.com | grace@example.org
    #fff -> true
    #A1B2C3 -> true
    #ggg -> false
    123456 -> false
    #12345 -> false
  code:
    - pattern: 'matchAll\s*\('
      message: "Use log.matchAll(...) for the order numbers."
    - pattern: '\(\?<\w+>'
      message: "Use named groups such as (?<year>\\d{4})."
    - pattern: '\.replace\s*\('
      message: "Use .replace(...) to rewrite the dates."
    - pattern: '\.test\s*\('
      message: "Use regex.test(text) in isHexColor."
    - pattern: '\^[^/]*\$'
      message: "Anchor the colour pattern with ^ and $ so the whole text must match."
hints:
  - "A regular expression is written between slashes, with flags after the second slash (g = all matches, i = ignore case). Parentheses make a capture group. (?<name>...) makes a named group you can reuse in replace with $<name>."
  - "Orders: [...log.matchAll(/#(\\d+)/g)].map(m => m[1]). Dates: log.replace(/(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/g, \"$<day>/$<month>/$<year>\"). Emails: log.match(/[\\w.]+@[\\w.]+\\.[a-z]{2,}/gi)"
  - "function isHexColor(text) { return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(text); }"
solution:
  - name: main.js
    code: |
      const log =
        "Order #123 shipped on 2024-03-15 to ada@example.com; " +
        "order #456 shipped on 2024-04-02 to grace@example.org";

      const ids = [...log.matchAll(/#(\d+)/g)].map((m) => m[1]);
      console.log(ids.join(", "));

      const dateRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g;
      console.log(log.replace(dateRe, "$<day>/$<month>/$<year>"));

      const emails = log.match(/[\w.]+@[\w.]+\.[a-z]{2,}/gi);
      console.log(emails.length + " emails: " + emails.join(" | "));

      function isHexColor(text) {
        return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(text);
      }
      for (const t of ["#fff", "#A1B2C3", "#ggg", "123456", "#12345"]) {
        console.log(t + " -> " + isHexColor(t));
      }
quiz:
  - q: What does the g flag do in  /cat/g ?
    options: ["Makes the match case-insensitive", "Finds all matches instead of stopping at the first", "Groups the characters"]
    answer: 1
  - q: What does  \d+  match?
    options: ["One or more digits", "The letter d, one or more times", "Exactly one digit"]
    answer: 0
  - q: Why do validation patterns usually start with ^ and end with $?
    options: ["They make the pattern faster", "They are required by the syntax", "Without them the pattern also matches when the text merely contains a match somewhere inside"]
    answer: 2
  - q: What is the difference between (?<year>\d{4}) and (\d{4})?
    options: ["The first one also gives the captured text a name you can use later", "The first one matches only years", "There is no difference"]
    answer: 0
---

Strings often hide structure: dates, phone numbers, order numbers, colours, email addresses. A **regular expression** (regex) is a compact way to describe a pattern, so you can find it, check it, pull pieces out or rewrite it. Regexes look scary at first, but the building blocks are few and you can learn them one by one.

## Creating and testing

A regex literal sits between two slashes. Optional **flags** follow the closing slash:

```js
const re = /cat/i;
console.log(re.test("Concatenate")); // prints: true  (i = ignore case)
```

`re.test(text)` answers true or false. Common flags: `g` (global, find all matches), `i` (ignore upper/lower case), `m` (`^` and `$` match at each line), `u` (full Unicode).

## The building blocks

| Piece | Meaning |
| --- | --- |
| `abc` | the literal text abc |
| `.` | any one character (except a newline) |
| `\d` `\w` `\s` | a digit, a word character (letter, digit, underscore), a whitespace |
| `[abc]` `[a-f0-9]` | one character from the set or range |
| `[^abc]` | one character NOT in the set |
| `*` `+` `?` | 0 or more, 1 or more, 0 or 1 of the previous item |
| `{3}` `{2,4}` | exactly 3, or between 2 and 4 of the previous item |
| `^` `$` | start and end of the text |
| `a\|b` | a or b |
| `( )` | a group, which also captures the text it matches |

To match a character that has special meaning, escape it with a backslash: `\.` is a real dot, `\$` a real dollar sign.

## Finding things

- `text.match(/re/g)` returns an array of all matches (or `null` if there are none).
- `text.matchAll(/re/g)` returns every match **with its groups**. It needs the `g` flag, and you spread it into an array:

```js
const log = "Order #123, order #456";
const ids = [...log.matchAll(/#(\d+)/g)].map((m) => m[1]);
console.log(ids.join(", ")); // prints: 123, 456
```

Each match `m` is an array: `m[0]` is the full text (`#123`) and `m[1]` is the first group (`123`).

## Named groups and replace

Number-indexed groups get confusing. Name them with `(?<name>...)`, and refer to them in `replace` as `$<name>`:

```js
const date = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
"2024-03-15".replace(date, "$<day>/$<month>/$<year>"); // "15/03/2024"
```

`replace` with a regex lacking the `g` flag changes only the first match. With `g` it changes all of them. You can also pass a function to compute each replacement.

## Validating: anchor the pattern

`/\d{3}/.test("a1234b")` is true because the text *contains* three digits. To require that the **whole** string looks a certain way, anchor it:

```js
const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
```

Read it aloud: start, a `#`, then either three or six hex digits, then end, ignoring case. The group with `|` offers the two alternatives.

## Greedy versus lazy

Quantifiers are **greedy**: they take as much as they can. On `"<b>x</b>"`, the pattern `/<.+>/` matches the whole string, not just `<b>`. Adding `?` makes it lazy: `/<.+?>/` stops at the first `>`.

> **Watch out:**
> - Using `matchAll` without the `g` flag: `TypeError: String.prototype.matchAll called with a non-global RegExp argument`.
> - Forgetting that `match` with `g` returns `null` when nothing matches, so `.length` on the result crashes. Use `(text.match(re) ?? []).length`.
> - Reusing a regex with the `g` flag and `test()` repeatedly. The regex remembers its position (`lastIndex`), so alternate calls can give different answers. Create a fresh regex or avoid `g` for `test`.
> - Forgetting to escape a dot: `/a.com/` also matches `abcom`. Write `/a\.com/`.
> - Trying to validate real emails or HTML with a regex. Keep email patterns simple and confirm with a real message, and use a proper parser for HTML.
> - Writing a regex that takes exponential time on unlucky input (nested quantifiers like `(a+)+`). Keep patterns simple on untrusted text.

## Going further

Use `/\b\w/g` with `replace` and a function to capitalise every word. Try the site regex101.com to see each part of a pattern explained.

> **Your turn:** print the order numbers with `matchAll`, reformat the dates with named groups and `replace`, list the emails with `match`, and write `isHexColor` with an anchored pattern and `test()`.
