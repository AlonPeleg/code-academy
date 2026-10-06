---
title: "מחרוזות ו-template literals"
summary: "עובדים עם טקסט: מחברים אותו, מודדים אותו, חותכים אותו ומשנים אותו."
messages:
  - "השתמשו ב-template literal: גרשיים הפוכים (backticks) עם ${...} בתוכם."
  - "השתמשו ב-toUpperCase() כדי ליצור אותיות גדולות."
  - "השתמשו ב-.length כדי לספור את התווים."
  - "השתמשו ב-slice() כדי לקחת את האותיות הראשונות."
  - "השתמשו ב-includes() כדי לחפש בתוך מחרוזת."
hints:
  - "גרשיים הפוכים (backticks, המקש משמאל ל-1 ברוב המקלדות) יוצרים template literals שיכולים להכיל משתנים בתוך חריצים מיוחדים."
  - "חריץ נראה כך: ${variableName}. והמתודות: fullName.toUpperCase(), fullName.length (בלי סוגריים), fullName.slice(0, 3) ו-fullName.includes(\"Love\")."
  - "const fullName = `${first} ${last}`;  console.log(`Hello, ${fullName}!`);  console.log(fullName.toUpperCase());  console.log(fullName.length);  console.log(fullName.slice(0, 3));  console.log(fullName.includes(\"Love\"));"
quiz:
  - q: "אילו מרכאות יוצרות template literal?"
    options: ["מרכאות כפולות \"\"", "מרכאות בודדות ''", "גרשיים הפוכים (backticks)"]
  - q: "מה התוצאה של  \"hello\".length  ?"
    options: ["4", "5", "6"]
  - q: "מה התוצאה של  \"JavaScript\".slice(0, 4)  ?"
    options: ["Java", "JavaS", "avaS"]
    explain: "slice(start, end) לוקח את התווים מ-start ועד end, בלי end עצמו. הספירה מתחילה ב-0."
  - q: "מה התוצאה של \"5\" + 3 ב-JavaScript?"
    options: ["8", "53", "שגיאה"]
    explain: "כשיש מחרוזת בצד אחד, + מצמיד טקסט, ולכן המספר 3 הופך ל-\"3\" והתוצאה היא המחרוזת \"53\"."
---

כמעט כל תוכנית עובדת עם טקסט: שמות, הודעות, מילות חיפוש. ב-JavaScript טקסט נקרא **מחרוזת** (string). בשיעור הזה תלמדו לבנות מחרוזות, למדוד אותן ולשנות אותן.

## שלושה סוגי מרכאות

```js
const a = "double quotes";
const b = 'single quotes';
const c = `backticks`;
```

מרכאות כפולות ובודדות מתנהגות אותו דבר. גרשיים הפוכים (backticks) יוצרים **template literal**, שהוא חזק יותר.

## Template literals

template literal מאפשר לשים ערכים ישירות בתוך טקסט באמצעות `${ ... }`:

```js
const name = "Ava";
const age = 21;
console.log(`${name} is ${age} years old.`); // prints: Ava is 21 years old.
```

בתוך `${ }` אפשר לשים כל ביטוי (expression), אפילו חישוב: `` `Next year: ${age + 1}` `` נותן <code>Next year: 22</code>. השוו את זה לדרך הישנה, שדורשת הרבה <code>+</code> ומרכאות: <code>name + " is " + age + " years old."</code>. template literals גם מאפשרים טקסט שמשתרע על כמה שורות.

<!-- ` gives `Next year: 22`. Compare that with the older way, which needs lots of `+` and quote marks: ` -->

## ספירת תווים

לכל מחרוזת יש תכונה (property) בשם `.length` (בלי סוגריים) שאומרת כמה תווים יש בה, כולל רווחים:

```js
console.log("Hello there".length); // prints: 11
```

## בחירת תווים

המיקומים במחרוזת מתחילים מ-**0**:

```js
const word = "JavaScript";
console.log(word[0]);          // prints: J
console.log(word.slice(0, 4)); // prints: Java  (from 0 up to, not including, 4)
console.log(word.slice(4));    // prints: Script  (from 4 to the end)
```

## מתודות שימושיות למחרוזות

למחרוזת יש כלים מובנים שנקראים **מתודות** (methods). קוראים להם עם נקודה וסוגריים:

| Method | What it does | Example result |
| --- | --- | --- |
| `toUpperCase()` | אותיות גדולות | `"hi".toUpperCase()` gives `"HI"` |
| `toLowerCase()` | אותיות קטנות | `"HI".toLowerCase()` gives `"hi"` |
| `includes(text)` | האם הטקסט נמצא בפנים? | `"hello".includes("ell")` gives `true` |
| `trim()` | מסיר רווחים משני הקצוות | `"  hi ".trim()` gives `"hi"` |
| `replace(a, b)` | מחליף את ההתאמה הראשונה | `"cat".replace("c", "b")` gives `"bat"` |
| `split(sep)` | חותך למערך (array) | `"a,b".split(",")` gives `["a", "b"]` |

מתודות **לא** משנות את המחרוזת המקורית. הן מחזירות מחרוזת חדשה:

```js
const shout = "hello".toUpperCase();
```

> **שימו לב:**
> - כתיבת `.length()` עם סוגריים גורמת ל-`TypeError: word.length is not a function`. `length` היא תכונה, ולכן בלי סוגריים.
> - כתיבת `toUpperCase` בלי סוגריים מדפיסה את הפונקציה (function) עצמה ולא את הטקסט החדש. תמיד קראו לה עם `()`.
> - שימוש במרכאות בודדות או כפולות בשביל `${...}`. רק גרשיים הפוכים מבצעים את ההצבה; `"${name}"` מדפיס את התווים כפי שהם.
> - שכחתם שהספירה מתחילה מ-0, ולכן `word[1]` היא האות השנייה.
> - ציפייה שהמקור ישתנה: `name.toUpperCase();` לבדו לא עושה שום דבר גלוי. שמרו את התוצאה או הדפיסו אותה.
> - ערבוב של `+` עם מספרים ומחרוזות: `"5" + 3` הוא `"53"`, לא `8`.

## להמשיך הלאה

נסו את `fullName.toLowerCase()`, את `fullName.replace("Ada", "Augusta")` ואת `fullName.split(" ")`. הדפיסו את האות האחרונה עם `fullName[fullName.length - 1]`.

> **תורכם:** עקבו אחרי ההערות הממוספרות: בנו את `fullName` עם template literal, ואז הדפיסו את הברכה, את האותיות הגדולות, את האורך, את שלוש האותיות הראשונות ואם המחרוזת כוללת את `"Love"`.
