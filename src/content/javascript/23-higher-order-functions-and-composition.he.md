---
title: "פונקציות מסדר גבוה, Currying והרכבה"
summary: "התייחסו לפונקציות כאל ערכים שאפשר להעביר, להחזיר ולשלב, ואז בנו כלים קטנים לשימוש חוזר כמו curry, compose, pipe ו-once."
hints:
  - "פונקציה מסדר גבוה מקבלת פונקציות או מחזירה פונקציות. curry מחזירה פונקציה שזוכרת (סוגרת על) את הארגומנטים שנאספו עד כה, וקוראת ל-fn ברגע שיש לה מספיק מהם."
  - "curry: החזירו פונקציה (...args) שבודקת אם args.length >= fn.length. אם כן, החזירו fn(...args). אם לא, החזירו פונקציה חדשה (...more) שקוראת שוב לעצמה עם [...args, ...more]. compose משתמשת ב-fns.reduceRight, pipe משתמשת ב-fns.reduce, ושתיהן מתחילות מערך הקלט."
  - "function curry(fn) { return function curried(...args) { if (args.length >= fn.length) return fn(...args); return (...more) => curried(...args, ...more); }; }   const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);   const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);   function once(fn) { let done = false, result; return (...args) => { if (!done) { done = true; result = fn(...args); } return result; }; }"
quiz:
  - q: "מה הופך פונקציה ל\"מסדר גבוה\"?"
    options: ["היא מקבלת פונקציות אחרות כארגומנטים או מחזירה פונקציה", "היא מוגדרת בראש הקובץ", "יש לה יותר משלושה פרמטרים"]
  - q: "במה currying הופך את  f(a, b, c)  ?"
    options: ["לפונקציה שרצה שלוש פעמים", "לפונקציה שאפשר לקרוא לה כ-f(a)(b)(c), ארגומנט אחד בכל פעם", "לפונקציה שמחזירה מערך"]
  - q: "מה התוצאה של  compose(dbl, inc)(5)  כאשר inc מוסיפה 1 ו-dbl מכפילה פי שניים?"
    options: ["11, כי dbl רצה ראשונה", "10, כי הפונקציות מתחברות", "12, כי inc רצה ראשונה ואז dbl"]
    explain: "compose רצה מימין לשמאל, כמו המתמטיקה f(g(x)). pipe רצה משמאל לימין, ולכן pipe(dbl, inc)(5) היא 11."
  - q: "למה once() יכולה לזכור אם fn כבר נקראה?"
    options: ["הפונקציה שמוחזרת היא closure ששומרת את done ואת result בחיים בין קריאות", "JavaScript שומרת אוטומטית כל תוצאה של פונקציה", "כי פונקציות חץ תמיד נשמרות במטמון"]
messages:
  - "השוו את מספר הארגומנטים שנאספו עם fn.length."
  - "אפשר לכתוב את compose ואת pipe עם reduce / reduceRight."
  - "אספו את הארגומנטים עם פרמטר rest: (...args)."
---

אתם כבר יודעים שפונקציה היא ערך, כמו מספר או מחרוזת. בשיעור הזה תשתמשו בעובדה הזו בכוונה: פונקציות שמקבלות פונקציות אחרות, פונקציות שמחזירות פונקציות חדשות, ואבני בניין קטנות שמחברים זו לזו כמו לגו. הסגנון הזה הוא הלב של כלים כמו `map`, `filter`, hooks של React ו-middleware.

## מה זה "מסדר גבוה"

**פונקציה מסדר גבוה** (higher-order function) היא פונקציה שעושה לפחות אחד משני הדברים האלה:

1. מקבלת פונקציה כארגומנט, או
2. מחזירה פונקציה.

השתמשתם בסוג הראשון הרבה פעמים: `[1, 2, 3].map(x => x * 2)` מעבירה פונקציה ל-`map`. עכשיו הסתכלו על הסוג השני:

```js
function multiplyBy(factor) {
  return (x) => x * factor;      // a new function, remembering factor
}
const triple = multiplyBy(3);
console.log(triple(7));          // prints: 21
```

`multiplyBy` היא **מפעל של פונקציות** (function factory). הפונקציה שהיא מחזירה היא closure: היא עדיין רואה את `factor` אחרי ש-`multiplyBy` סיימה. אם closures עדיין מעורפלים, חזרו קודם לשיעור "טווח משתנים (Scope) וסגורים (Closures)".

## Currying

**Currying** פירושו להפוך פונקציה שמקבלת כמה ארגומנטים לשרשרת של פונקציות שמקבלות אותם אחד (או כמה) בכל פעם.

```js
const add = (a) => (b) => a + b;
console.log(add(2)(3));   // prints: 5
const add10 = add(10);    // a reusable "add 10" function
console.log(add10(1));    // prints: 11
```

לכתוב פונקציות curried ביד זה מייגע, ולכן כותבים פעם אחת פונקציית עזר `curry(fn)`. היא עובדת כי כל פונקציה יודעת כמה פרמטרים היא מצהירה עליהם, ב-`fn.length`:

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);   // enough: run it
    return (...more) => curried(...args, ...more);      // not yet: wait for more
  };
}
```

חלק אחרי חלק: `...args` (**פרמטר rest**) אוסף את כל הארגומנטים למערך; `args.length >= fn.length` שואל "האם קיבלנו כל מה ש-fn צריכה?"; `curried(...args, ...more)` קוראת לעצמה שוב עם הארגומנטים הישנים והחדשים מחוברים באמצעות **spread**. התוצאה: `curry(add3)(1)(2)(3)`, `curry(add3)(1, 2)(3)` ו-`curry(add3)(1, 2, 3)` נותנות כולן אותה תשובה.

Currying זורח כשהנתונים באים **אחרונים**: `const filter = curry((test, list) => list.filter(test))` מאפשרת לכתוב קודם `filter(isEven)` ולתת את הרשימה מאוחר יותר.

## הרכבה

**הרכבה** (composition) פירושה לבנות פונקציה גדולה יותר מפונקציות קטנות, כשהפלט של אחת הוא הקלט של הבאה. במתמטיקה, `f(g(x))`. בקוד:

```js
const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);
const pipe    = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);
```

`reduce` עוברת על רשימת הפונקציות משמאל לימין ונושאת איתה את הערך; `reduceRight` עוברת מימין לשמאל. `pipe` נקראת כמו מתכון ("קודם זה, אחר כך זה") ולכן הרבה אנשים מעדיפים אותה; `compose` משקפת את הסימון המתמטי.

שלבו currying ו-pipe ותקבלו זרימות נתונים קריאות:

```js
const shout = pipe(
  filter((w) => w.length > 4),
  map((w) => w.toUpperCase())
);
```

כל שלב קטן, קל לבדיקה לבדו, ואפשר להשתמש בו שוב במקום אחר.

## עטיפת פונקציות: once

פונקציה מסדר גבוה יכולה גם **לעטוף** פונקציה אחרת ולהוסיף סביבה התנהגות. `once(fn)` שומרת שני משתנים פרטיים (`done` ו-`result`) ב-closure ומוודאת ש-`fn` רצה פעם אחת בלבד. אותו טריק בונה את `debounce`, את `memoize` ועטיפות של רישום (logging).

> **שימו לב:**
> - `curry` מסתמכת על `fn.length`. פונקציה עם ערכי ברירת מחדל או פרמטר rest (`(a, b = 2) => ...`, `(...xs) => ...`) מדווחת על אורך קטן יותר, ולכן היא עלולה לרוץ מוקדם מדי.
> - שכחת `return` של הפונקציה הפנימית נותנת `TypeError: curriedAdd(...) is not a function`.
> - בלבול בכיוון: `compose(a, b)` מריצה את `b` קודם, `pipe(a, b)` מריצה את `a` קודם.
> - קריאה לפונקציה במקום העברתה: `map(double())` מעבירה את התוצאה של הקריאה ל-`double`, לא את הפונקציה עצמה. העבירו את `double` בלי סוגריים.
> - ב-`once`, שמירת התוצאה במשתנה שהוגדר בתוך הפונקציה המוחזרת. הוא היה נוצר מחדש בכל קריאה, ולכן שום דבר לא היה נזכר.

## להמשיך הלאה

כתבו `partial(fn, ...preset)` שקובעת את הארגומנטים הראשונים של כל פונקציה, ו-`tap(fn)` שמריצה את `fn(x)` בשביל תופעת הלוואי שלה (כמו רישום) אבל מעבירה הלאה את `x`, כך שאפשר להכניס אותה לאמצע `pipe`.

> **תורכם:** כתבו את `curry`, `compose`, `pipe` ו-`once` כך שכל תשע השורות יודפסו כמו שמוצג.
