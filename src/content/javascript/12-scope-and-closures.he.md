---
title: "טווח משתנים (Scope) וסגורים (Closures)"
summary: "למדו איפה משתנים חיים, ואיך פונקציה יכולה לזכור את הסביבה שלה."
hints:
  - "הפונקציה הפנימית יכולה להשתמש במשתנים של הפונקציה שסביבה, גם אחרי שהפונקציה החיצונית סיימה. כל קריאה ל-makeCounter יוצרת משתנה פרטי משלה."
  - "בתוך makeCounter, הגדירו let count = 0; והחזירו פונקציה (פונקציה רגילה או פונקציית חץ) שמגדילה את count ומחזירה אותו."
  - "function makeCounter() { let count = 0; return () => { count = count + 1; return count; }; }"
quiz:
  - q: "איפה אפשר להשתמש במשתנה שהוגדר עם let בתוך סוגריים מסולסלים { } ?"
    options: ["בכל מקום בקובץ", "רק בתוך הסוגריים האלה", "רק בפונקציות אחרות"]
  - q: "מהו closure?"
    options: ["פונקציה שזוכרת את המשתנים מהמקום שבו נוצרה", "דרך לסגור את הדפדפן", "לולאה שאף פעם לא נגמרת"]
  - q: "בשיעור, למה המונים a ו-b לא משפיעים זה על זה?"
    options: ["כי הם const", "כי JavaScript מעתיקה את המספרים", "כי כל קריאה ל-makeCounter יוצרת משתנה count חדש"]
  - q: "מה נותן  typeof someUndeclaredName  ?"
    options: ["\"undefined\"", "שגיאה", "\"null\""]
    explain: "typeof הוא האופרטור היחיד שבטוח להשתמש בו על שמות שלא קיימים. הוא עונה \"undefined\" במקום לזרוק שגיאה."
messages:
  - "הגדירו את makeCounter כפונקציה."
  - "makeCounter צריכה להחזיר פונקציה."
---

איפה אפשר להשתמש במשתנה? התשובה היא ה-**scope** שלו (טווח הראות). הבנה של scope מסבירה הרבה שגיאות מבלבלות, ומובילה לאחד הרעיונות החזקים ביותר של JavaScript: ה-**closure** (סגור).

## Scope: איפה משתנה חי

משתנה שנוצר עם `let` או `const` שייך לזוג הסוגריים המסולסלים `{ }` הקרוב ביותר סביבו. האזור הזה הוא ה-**scope** שלו.

```js
const city = "Haifa";        // global scope: visible everywhere

function greet() {
  const message = "Hi!";     // function scope: visible inside greet only
  console.log(message, city);
}

greet();                     // prints: Hi! Haifa
console.log(message);        // ReferenceError: message is not defined
```

הכלל: **קוד פנימי רואה משתנים חיצוניים, אבל קוד חיצוני לא רואה פנימיים.**

בלוקים פועלים לפי אותו כלל. משתנה שהוגדר בגוף של `if` או של לולאה לא קיים אחרי שהוא נגמר:

```js
if (true) {
  const temp = 5;
}
console.log(typeof temp); // prints: undefined
```

(אנחנו משתמשים כאן ב-`typeof` כי הוא לא קורס על שמות לא מוכרים, בעוד ש-`console.log(temp)` הייתה זורקת `ReferenceError`.)

## הצללה (Shadowing)

אם scope פנימי מגדיר משתנה עם אותו שם כמו משתנה חיצוני, הפנימי מסתיר את החיצוני בתוך הסוגריים שלו:

```js
const x = "outer";
function show() {
  const x = "inner";
  console.log(x); // prints: inner
}
show();
console.log(x);   // prints: outer
```

## פונקציות יכולות לקרוא משתנים חיצוניים

```js
let visits = 0;
function visit() {
  visits = visits + 1;
}
visit();
visit();
console.log(visits); // prints: 2
```

זה עובד, אבל עכשיו כל אחד יכול לשנות את `visits`. closure מאפשר לנו לשמור אותו פרטי.

## Closures

פונקציה יכולה **לזכור** את המשתנים שהיו סביבה כשנוצרה, גם אחרי שהפונקציה החיצונית סיימה לרוץ. השילוב הזה (הפונקציה ועוד המשתנים שהיא זוכרת) הוא **closure**.

```js
function makeGreeter(greeting) {
  return (name) => `${greeting}, ${name}!`;
}

const hello = makeGreeter("Hello");
const hola = makeGreeter("Hola");
console.log(hello("Ava")); // prints: Hello, Ava!
console.log(hola("Ben"));  // prints: Hola, Ben!
```

`makeGreeter` מחזירה פונקציית חץ. לפונקציה הזו עדיין יש גישה ל-`greeting` למרות ש-`makeGreeter` סיימה מזמן. כל קריאה ל-`makeGreeter` יוצרת `greeting` **משלה**, ולכן `hello` ו-`hola` לא מפריעות זו לזו.

closures נותנים לכם **מצב פרטי**: משתנים שרק הפונקציות שלכם יכולות לגעת בהם, בלי סיכון שקוד אחר ישבש אותם.

## let ו-const במקום var

ייתכן שתראו קוד ישן שמשתמש ב-`var`. הוא מתעלם מ-scope של בלוק (רק scope של פונקציה חל), וזה גורם לבאגים מפתיעים. תמיד השתמשו ב-`let` וב-`const`.

> **שימו לב:**
> - `ReferenceError: x is not defined` פירושה לעיתים קרובות שאתם משתמשים במשתנה מחוץ ל-scope שבו הוא הוגדר. הזיזו את ההגדרה למעלה או החזירו את הערך.
> - הגדרת משתנה בתוך לולאה או `if` ואז שימוש בו אחרי כן.
> - יצירת משתנה המונה *מחוץ* ל-`makeCounter`. אז שני המונים חולקים מספר אחד, במקום שיהיה לכל אחד משלו.
> - שכחה של `return` לפונקציה הפנימית. אז `makeCounter()` מחזירה `undefined`, ו-`a()` נכשלת עם `TypeError: a is not a function`.
> - כתיבת `return count` במקום להחזיר פונקציה שמחזירה את `count`: מקבלים מספר רגיל, לא מונה.
> - הצללה בטעות: `let count` בתוך הפונקציה הפנימית יוצרת משתנה חדש, ולכן החיצוני לעולם לא משתנה.

## להמשיך הלאה

כתבו `makeAdder(n)` שמחזירה פונקציה שמוסיפה את `n` לארגומנט שלה. אז `const add5 = makeAdder(5); add5(10)` נותנת `15`. הוסיפו למונה שלכם יכולת `reset` על ידי החזרת אובייקט עם שתי מתודות.

> **תורכם:** קראו את חלק 1, ואז כתבו את `makeCounter` כך שארבע הקריאות ידפיסו `1`, `2`, `3` ו-`1`.
