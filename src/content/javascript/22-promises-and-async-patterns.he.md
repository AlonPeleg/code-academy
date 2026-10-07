---
title: "Promises ותבניות אסינכרוניות"
summary: "הריצו משימות במקביל עם Promise.all ו-race, טפלו בכישלונות, נסו שוב עבודה לא יציבה והוסיפו timeouts."
hints:
  - "ל-Promise.all, race ו-allSettled כל אחת מקבלת מערך של promises, וכל אחת מחזירה promise אחד שאפשר לעשות לו await. צרו את ה-promises קודם (כדי שיתחילו יחד), ואל תעשו להם await אחד אחד."
  - "const all = await Promise.all([delay(60, \"A\"), delay(20, \"B\"), delay(40, \"C\")]);   retry משתמשת בלולאת for עם try { return await fn(); } catch (error) { ...הדפסה... ; if (last attempt) throw error; }   withTimeout מחזירה Promise.race([promise, fail(ms, \"timeout\")])"
  - "async function retry(fn, attempts) { for (let i = 1; i <= attempts; i++) { try { return await fn(); } catch (error) { console.log(\"caught: \" + error.message); if (i === attempts) throw error; } } }   function withTimeout(promise, ms) { return Promise.race([promise, fail(ms, \"timeout\")]); }"
quiz:
  - q: "מה Promise.all([p1, p2]) עושה אם p2 נדחה (rejects)?"
    options: ["היא ממתינה ל-p1 ומחזירה את שתי התוצאות בכל זאת", "היא נדחית ברגע שאחד מה-promises נדחה", "היא מתעלמת מהדחייה"]
  - q: "איזה כלי אומר לכם מה התוצאה של כל promise, גם כשחלקם נכשלים?"
    options: ["Promise.race", "Promise.all", "Promise.allSettled"]
  - q: "שלוש משימות של 100 ms כל אחת. בערך כמה זמן הן לוקחות עם await task() שלוש פעמים ברצף, בהשוואה ל-Promise.all?"
    options: ["300 ms ברצף, בערך 100 ms עם Promise.all", "100 ms בשני המקרים", "300 ms בשני המקרים"]
  - q: "באיזו תוצאה Promise.race([work, timer]) מסתיימת, בהצלחה או בדחייה?"
    options: ["התוצאה של זה שמסתיים אחרון", "התוצאה של ה-promise שמסתיים ראשון", "תמיד התוצאה של work"]
messages:
  - "השתמשו ב-Promise.all([...])."
  - "השתמשו ב-Promise.race([...])."
  - "השתמשו ב-Promise.allSettled([...])."
  - "בניסיון האחרון שנכשל, זרקו מחדש את השגיאה עם throw error."
---

async/await בסיסי מאפשר להמתין לדבר אחד. תוכניות אמיתיות מלהטטות בהרבה דברים: לטעון משתמש, את הפוסטים שלו ואת ההגדרות שלו בבת אחת, לוותר אם שרת איטי מדי, לנסות שוב כשקריאת רשת נכשלת. כלי ה-Promise של JavaScript הופכים את התבניות האלה לקצרות וקריאות.

## ברצף או במקביל?

המתנה ברצף גורמת לכל משימה להתחיל רק אחרי שהקודמת הסתיימה:

```js
const a = await delay(100, "A");
const b = await delay(100, "B"); // starts after A: 200 ms total
```

אם המשימות לא תלויות זו בזו, התחילו את כולן קודם והמתינו לקבוצה. `Promise.all` מקבלת מערך של promises ומחזירה promise אחד שמסתיים עם מערך של תוצאות **באותו סדר**:

```js
const [a, b] = await Promise.all([delay(100, "A"), delay(100, "B")]); // about 100 ms
```

שימו לב שהתוצאות מגיעות בסדר שבו רשמתם אותן, לא בסדר שבו הסתיימו. אם **אחד** מה-promises נדחה, `Promise.all` נדחית מיד עם השגיאה הזו.

## שאר המשלבים

| פונקציה | מסתיימת כאשר | תוצאה |
| --- | --- | --- |
| `Promise.all(list)` | כולם מצליחים (נדחית אם אחד נדחה) | מערך של ערכים |
| `Promise.allSettled(list)` | כולם סיימו, בהצלחה או לא | מערך של `{ status, value / reason }` |
| `Promise.race(list)` | הראשון מסתיים | הערך או השגיאה שלו |
| `Promise.any(list)` | הראשון מצליח | הערך הזה (נדחית רק אם כולם נכשלים) |

`allSettled` אף פעם לא נדחית. כל רשומה נראית כמו `{ status: "fulfilled", value }` או `{ status: "rejected", reason }`, ולכן אפשר לדווח על הצלחה חלקית:

```js
const results = await Promise.allSettled([loadA(), loadB()]);
for (const r of results) {
  console.log(r.status === "fulfilled" ? r.value : r.reason.message);
}
```

## טיפול בשגיאות עם try, catch, finally

עם `await`, promise שנדחה הופך לשגיאה רגילה שנזרקת, ולכן משתמשים ב-`try/catch` שכבר מכירים. `finally` רץ בשני המקרים, וזה אידיאלי לניקיון כמו הסתרת אנימציית טעינה:

```js
try {
  const data = await load();
} catch (error) {
  console.log("failed: " + error.message);
} finally {
  console.log("done");
}
```

## ניסיון חוזר

רשתות לא יציבות. פונקציית עזר לניסיון חוזר רצה בלולאה ותופסת כישלונות עד שקריאה אחת מצליחה או שהניסיונות נגמרים:

```js
async function retry(fn, attempts) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts) throw error; // out of attempts: give up
    }
  }
}
```

ה-`await` בתוך `return await fn()` חשוב: בלעדיו דחייה הייתה בורחת מבלוק ה-`try` לפני שה-`catch` יכול היה לראות אותה. בקוד אמיתי ממתינים לעיתים קרובות קצת יותר אחרי כל כישלון (backoff).

## Timeouts עם race

ל-promise אין מגבלת זמן מובנית. מוסיפים אחת על ידי מרוץ מול טיימר שנדחה:

```js
function withTimeout(promise, ms) {
  return Promise.race([promise, fail(ms, "timeout")]);
}
```

מי שמסתיים ראשון מנצח. שימו לב שהעבודה שהפסידה לא מתבטלת, היא פשוט כבר לא משנה לכם.

## טיימרים דטרמיניסטיים

קוד שתלוי בזמן קשה לבדיקה, ולכן בשיעור הזה ההשהיות נבחרו עם פערים גדולים (20, 40, 60 ms). ה*סדר* אז אף פעם לא תלוי בכמה המחשב עסוק, והפלט תמיד זהה. בבדיקות שלכם, העדיפו השהיות מזויפות כאלה על פני הרשת האמיתית.

> **שימו לב:**
> - `await` בתוך callback של `forEach` או `map` לא ממתין לכל הלולאה. השתמשו ב-`for...of` לעבודה ברצף, או ב-`await Promise.all(items.map(async (x) => ...))` לעבודה במקביל.
> - העברת ערכים שכבר נעשה להם await במקום promises: `Promise.all([await a(), await b()])` מריצה אותם ברצף, וזה מאבד את המטרה.
> - דחייה שלא טופלה: promise שנכשל ואף אחד לא עושה לו await או תופס אותו מציג `Unhandled promise rejection`. תמיד עשו לו `await` או הוסיפו `.catch(...)`.
> - שכחת `await` לפני פונקציה שמחזירה promise בתוך `try`. השגיאה בורחת מה-`catch` כי הכישלון קורה מאוחר יותר.
> - `Promise.all` עם אובייקט במקום מערך: `TypeError: object is not iterable`.

## להמשיך הלאה

גרמו ל-`retry` להמתין `delay(10 * i)` בין ניסיונות. נסו `Promise.any` עם רשימה שבה שני ה-promises הראשונים נכשלים והשלישי מצליח.

> **תורכם:** השתמשו ב-`Promise.all`, ב-`Promise.race` וב-`Promise.allSettled` על פונקציות העזר של ההשהיה, כתבו את `retry(fn, attempts)` עם try/catch, וכתבו את `withTimeout(promise, ms)` בעזרת `Promise.race`.
