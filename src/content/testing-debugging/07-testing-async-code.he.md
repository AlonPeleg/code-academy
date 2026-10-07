---
title: "בדיקת קוד אסינכרוני"
summary: "בודקים promises ופונקציות async/await עם await, ‏.resolves ו-.rejects, ונמנעים מבדיקות שעוברות במקרה."
hints:
  - "פונקציית async תמיד מחזירה promise, וכך גם fetch ו-response.json(). אם שוכחים await, מקבלים את ה-promise עצמו במקום את הערך, ו-response.ok הוא undefined. הוסיפו await בשני מקומות ב-profile.js."
  - "const response = await fetchFn(...);   const user = await response.json();   בבדיקה החדשה: הפכו את פונקציית החץ ל-async והוסיפו await לפני expect(...)."
  - "it(\"rejects with a clear message for an unknown user\", async () => { await expect(getUserName(99)).rejects.toThrow(\"User 99 not found\"); });"
messages:
  - "fetchFn(...) מחזירה promise: הוסיפו await לפניה."
  - "גם response.json() מחזירה promise: הוסיפו לה await."
  - "החליפו את it.todo ב-it(...) עבור בדיקת המשתמש שלא קיים."
  - "השתמשו ב-await expect(...).rejects.toThrow(\"User 99 not found\")."
quiz:
  - q: "מה קורה אם בדיקה אסינכרונית שוכחת לעשות await (או return) ל-promise?"
    options: ["Jest מחכה אוטומטית בכל זאת", "הבדיקה תמיד נכשלת", "הבדיקה יכולה להסתיים לפני שהטענה רצה, ולכן היא עלולה לעבור גם כשהקוד שגוי"]
    explain: "פונקציית הבדיקה מסתיימת מיד. ציפייה שנכשלת מאוחר יותר הולכת לאיבוד, ולכן הבדיקה היא חיובי שגוי (false positive)."
  - q: "איזו שורה בודקת נכון ש-promise נדחה (rejects) עם ההודעה \"nope\"?"
    options: ["expect(load()).toThrow(\"nope\")", "await expect(load()).rejects.toThrow(\"nope\")", "expect(await load()).toBe(\"nope\")"]
  - q: "מה יוצרת jest.fn().mockResolvedValue(5)?"
    options: ["פונקציה מזויפת שמחזירה promise שמסתיים בהצלחה עם הערך 5", "פונקציה מזויפת שמחזירה 5 ישירות", "פונקציה מזויפת שנדחית עם 5"]
  - q: "למה בדיקות נמנעות לעיתים קרובות מהרשת האמיתית ומשתמשות ב-fetch מזויפת?"
    options: ["תחליפים מהירים, צפויים ולא תלויים בכך ששרת פועל", "ה-fetch האמיתית לא קיימת", "תשובות מזויפות תמיד נכונות יותר"]
---
רוב התוכניות האמיתיות מחכות למשהו: תשובה מהרשת, קובץ, טיימר. זה הופך את הפונקציות שלהן ל**אסינכרוניות** (asynchronous), וקוד אסינכרוני דורש קצת תשומת לב נוספת בבדיקות. אם עושים את זה לא נכון, מקבלים את הסוג הגרוע ביותר של בדיקה: כזו ש**עוברת גם כשהקוד שבור**. בשיעור הזה תלמדו את התבניות הבטוחות.

## בדיקה אסינכרונית היא פונקציית async

בדיקה יכולה להיות פונקציית `async`. Jest מחכה עד שה-promise שהפונקציה של הבדיקה מחזירה מסתיים לפני שהוא ממשיך, ולכן בתוכה אפשר פשוט להשתמש ב-`await`:

```js
async function addLater(a, b) {
  return a + b;           // an async function always returns a promise
}

it("adds later", async () => {
  const result = await addLater(2, 3);
  expect(result).toBe(5);
});
```

בלי ה-`await`, `result` היה אובייקט promise ו-`toBe(5)` הייתה נכשלת. בדיקה כושלת כזו מעצבנת, אבל היא כנה.

## ‏.resolves ו-.rejects

`expect` יכולה להסתכל בתוך promise בשבילכם:

```js
it("resolves with 5", async () => {
  await expect(addLater(2, 3)).resolves.toBe(5);
});

it("rejects with an error", async () => {
  await expect(failLater()).rejects.toThrow("boom");
});
```

* `.resolves` מחכה שה-promise **יסתיים בהצלחה** (fulfil) ואז מפעילה את ה-matcher על הערך.
* `.rejects` מחכה שהוא **ייכשל** ומפעילה את ה-matcher על השגיאה. `toThrow("boom")` בודקת שההודעה מכילה `boom`.

ה-`await` לפני `expect` **הכרחי**. ה-matcher עצמו מחזיר promise. אם לא מחכים לו, הבדיקה מסתיימת קודם.

## מלכודת החיובי השגוי

הסתכלו על הבדיקה השבורה הזאת:

```js
it("rejects for a missing user", () => {
  expect(getUserName(99)).rejects.toThrow("anything");   // no await, no return
});
```

פונקציית הבדיקה חוזרת מיד, ולכן הכלי מסמן את הבדיקה כעוברת. הטענה עשויה לרוץ מאוחר יותר, להיכשל בשקט, ואף אחד לא ישים לב. **כלל:** בבדיקה אסינכרונית, כל שורת `expect(...).resolves/rejects` מתחילה ב-`await` (או מוחזרת עם `return`).

ב-Jest אמיתי אפשר להגן על עצמכם עוד יותר עם `expect.assertions(n)`, שמכשילה את הבדיקה אם רצו פחות מ-`n` טענות.

## מזייפים את הרשת

קריאות רשת אמיתיות איטיות ויכולות להיכשל מסיבות שאין להן קשר לקוד שלכם. בבדיקות יחידה בדרך כלל מחליפים אותן. שתי פונקציות עזר של פונקציית mock עושות את זה:

```js
const ok = jest.fn().mockResolvedValue({ name: "Ada" });          // returns Promise.resolve(...)
const bad = jest.fn().mockRejectedValue(new Error("offline"));    // returns Promise.reject(...)
```

מכיוון ש-`getUserName` מקבלת את פונקציית ה-fetch כפרמטר (עם `fetch` האמיתית כברירת מחדל), בדיקה יכולה להעביר לה תחליף. סוויטת בדיקות טובה מכסה שלושה מקרים לכל פונקציה אסינכרונית: **הצלחה**, **השרת אומר לא** (למשל 404) ו**כשל ברשת עצמה**.

באזור התרגול הזה הכתובת `https://api.academy.test` היא שרת תרגול מובנה, ולכן בדיקות ה-fetch האמיתית מהירות ותמיד נותנות את אותה תשובה. בפרויקט אמיתי הייתם בודקים מול שרת בדיקות מקומי או משתמשים רק בתחליפים.

## טיימרים

טיימרים מאטים בדיקות אם באמת מחכים להם. המתנות קטנטנות (`setTimeout(r, 10)`) בסדר בשיעור. ב-Jest אמיתי הייתם משתמשים ב-`jest.useFakeTimers()` כדי להריץ את השעון קדימה מיד; החלק הזה לא זמין באזור התרגול הזה.

> **שימו לב:**
> * **חסר `await` בקוד הנבדק.** `const response = fetch(url)` נותן לכם promise, ו-`response.ok` הוא `undefined` (זה לא זורק שגיאה). הבאג נמצא ב-`profile.js` של השיעור הזה: הבדיקות תופסות אותו.
> * **חסר `async` בבדיקה.** `await` בתוך פונקציה רגילה גורם ל-`SyntaxError: await is only valid in async functions and the top level bodies of modules`.
> * **מערבבים `.rejects` עם `try/catch`.** בחרו סגנון אחד לכל בדיקה. אם משתמשים ב-`try/catch` והקוד לא זורק שגיאה, ה-`catch` אף פעם לא רץ והבדיקה עוברת בלי שמישהו שם לב.
> * **בדיקות שתלויות בשעון האמיתי או בשרת חי.** הן נכשלות באופן אקראי. זייפו או שלטו בחלקים האלה.

> **תורכם:** מצאו את שתי מילות ה-`await` החסרות ב-`profile.js`. אחר כך החליפו את `it.todo(...)` ב-`profile.test.js` בבדיקה אסינכרונית אמיתית, עם אותו שם, שבודקת ש-`getUserName(99)` נדחית עם ההודעה `User 99 not found`. כל 4 הבדיקות חייבות לעבור.
