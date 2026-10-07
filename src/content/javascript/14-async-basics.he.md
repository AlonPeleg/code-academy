---
title: "המתנה: טיימרים, promises ו-async/await"
summary: "הריצו קוד מאוחר יותר, וכתבו קוד שממתין בלי להקפיא את הכול."
hints:
  - "Promise הוא ערך שמגיע מאוחר יותר. wait(ms) צריכה להחזיר כזה שמתמלא על ידי טיימר. בתוך פונקציית async, המילה await עוצרת עד שה-promise מסתיים."
  - "function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }  אחר כך הפכו את countdown ל-async, וכתבו await wait(100) בתוך הלולאה."
  - "async function countdown() { for (let i = 3; i >= 1; i--) { console.log(i); await wait(100); } console.log(\"Liftoff!\"); }"
quiz:
  - q: "מה עושה  setTimeout(fn, 1000)  ?"
    options: ["עוצרת את התוכנית לשנייה", "מריצה את fn פעם אחת, אחרי בערך 1000 אלפיות שנייה", "מריצה את fn כל שנייה"]
  - q: "מה עושה המילה await?"
    options: ["מוחקת promise", "גורמת לפונקציה לרוץ מהר יותר", "עוצרת פונקציית async עד שה-promise מסתיים"]
  - q: "איפה בדרך כלל אפשר להשתמש ב-await?"
    options: ["בתוך פונקציה שמסומנת async", "רק בתוך לולאות", "בכל מקום, בכל פונקציה"]
    explain: "בעורך הזה גם await ברמה העליונה עובד, כמו במודולים של JavaScript מודרנית."
  - q: "ב-  console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); console.log(\"C\");  באיזה סדר ההדפסה?"
    options: ["B, A, C", "A, C, B", "A, B, C"]
    explain: "גם עם 0 אלפיות שנייה, ה-callback של הטיימר ממתין עד שהקוד הנוכחי יסיים."
messages:
  - "צרו את ה-promise עם new Promise(...)."
  - "הגדירו את countdown כפונקציית async."
  - "השתמשו ב-await wait(100) בתוך countdown."
---

דברים מסוימים לוקחים זמן: טעינת נתונים מהאינטרנט, המתנה ללחיצה, או סתם הפסקה של שנייה. JavaScript לא עוצרת וממתינה. במקום זה היא אומרת "תעשה את זה אחר כך" וממשיכה לעבודות אחרות. השיעור הזה מציג **טיימרים**, **promises** ו-**async/await**.

## להריץ קוד מאוחר יותר: setTimeout

`setTimeout` מקבלת פונקציה והשהיה ב**אלפיות שנייה** (1000 ms הם שנייה אחת). היא מריצה את הפונקציה פעם אחת, אחרי ההשהיה:

```js
console.log("A");
setTimeout(() => console.log("B"), 1000);
console.log("C");
// prints: A, C, and a second later: B
```

JavaScript לא קופאת לשנייה. היא מתזמנת את הפונקציה, ממשיכה הלאה ומדפיסה `C` מיד. גם `setTimeout(fn, 0)` רצה אחרי שהקוד הנוכחי סיים. כלי דומה הוא `setInterval(fn, ms)`, שחוזר על עצמו עד שעוצרים אותו עם `clearInterval`.

## Promises

**Promise** הוא אובייקט שמייצג ערך שעדיין לא מוכן. הוא תמיד באחד משלושה מצבים: *pending* (ממתין), *fulfilled* (הצלחה) או *rejected* (כישלון). יוצרים אחד עם פונקציה שמקבלת `resolve`, שקוראים לה כשהעבודה הסתיימה:

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms); // call resolve after ms milliseconds
  });
}
```

אפשר להגיב עם `.then`:

```js
wait(500).then(() => console.log("half a second passed"));
```

## async ו-await

שרשראות של `.then` נהיות מבולגנות. **async/await** מאפשר לכתוב קוד המתנה שנקרא מלמעלה למטה כמו קוד רגיל.

```js
async function demo() {
  console.log("one");
  await wait(500);    // pause HERE, but do not block the rest of the program
  console.log("two");
}
```

- פונקציה שמסומנת `async` תמיד מחזירה promise.
- בתוכה, `await somePromise` עוצרת את הפונקציה הזו עד שה-promise מתמלא, ואז נותנת לכם את הערך שלו.
- קוד אחר ממשיך לרוץ בזמן שהפונקציה ממתינה.

כדי לקרוא לפונקציית async ולהמתין שתסיים, השתמשו ב-`await demo();` מתוך פונקציית async אחרת. בעורך הזה (ובמודולים של JavaScript מודרנית) אפשר גם להשתמש ב-`await` ישירות בראש הקובץ.

## טיפול בכישלונות

promise יכול להידחות (**rejected**). עם `await`, השתמשו ב-`try/catch` שלמדתם בשיעור הקודם:

```js
async function load() {
  try {
    await Promise.reject(new Error("no network"));
  } catch (error) {
    console.log("Failed: " + error.message);
  }
}
```

promises אמיתיים מגיעים מכלים כמו `fetch("https://...")`, שמורידה נתונים. התבנית זהה: `const response = await fetch(url);`.

## סדר האירועים

הסדר בתרגיל מעניין. ה-timeout של 50 ms מתוזמן ראשון, אחר כך הספירה לאחור מדפיסה `3` וממתינה 100 ms. טיימר ה-50 ms מופעל במהלך ההמתנה הזו, ולכן `timeout fired` מופיע בין `3` ל-`2`.

> **שימו לב:**
> - שכחת `await`: `wait(100);` לבדה לא עוצרת כלום, כי היא רק יוצרת promise. צריך לכתוב `await wait(100);`.
> - שימוש ב-`await` בפונקציה שאינה `async`: `SyntaxError: await is only valid in async functions and the top level bodies of modules`.
> - העברת תוצאה של קריאה במקום פונקציה: `setTimeout(console.log("hi"), 1000)` מדפיסה "hi" מיד. כתבו `setTimeout(() => console.log("hi"), 1000)`.
> - ציפייה שקוד אחרי `setTimeout` ימתין. רק הפונקציה שבתוכה רצה מאוחר יותר.
> - בלבול ביחידות: ההשהיה היא באלפיות שנייה, ולכן `5` הוא כמעט אפס זמן.
> - promise שנדחה ולא טופל מופיע באדום כ-`Unhandled promise rejection`. הוסיפו `try/catch` או `.catch`.

## להמשיך הלאה

גרמו לספירה לאחור להתחיל מ-5, עם `wait(500)` בין המספרים. הריצו שתי המתנות באותו זמן עם `await Promise.all([wait(100), wait(200)])`.

> **תורכם:** כתבו את `wait(ms)` ואת `countdown()` האסינכרונית כך שהתוכנית תדפיס את שבע השורות בסדר הנכון.
