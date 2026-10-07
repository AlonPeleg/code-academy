---
title: "עמידות: ניסיונות חוזרים, חריגות זמן ומגבלות קצב"
summary: "שורדים שרתים לא יציבים ואיטיים עם backoff מעריכי, חריגות זמן עם AbortController, וכיבוד של 429 Too Many Requests."
hints:
  - "נסו שוב רק כשזה יכול לעזור: תשובות 5xx ושגיאות רשת הן זמניות, תשובות 4xx לא. Backoff פירושו שכל המתנה ארוכה פי שניים מקודמתה (20, 40, 80 ...). לחריגת הזמן, AbortController נותן לכם signal ושיטה abort(); setTimeout קורא ל-abort() אחרי ms."
  - "async function fetchWithRetry(url, { retries = 3, baseDelay = 20 } = {}) { for (let attempt = 1; ; attempt++) { const res = await fetch(url); console.log('attempt ' + attempt + ': ' + res.status); if (res.status < 500 || attempt > retries) return res; await sleep(baseDelay * 2 ** (attempt - 1)); } }"
  - "function fetchWithTimeout(url, ms) { const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), ms); const timedOut = new Promise((_, reject) => { controller.signal.addEventListener('abort', () => reject(new Error('Timed out after ' + ms + ' ms'))); }); return Promise.race([fetch(url, { signal: controller.signal }), timedOut]).finally(() => clearTimeout(timer)); }"
quiz:
  - q: "אילו תשובות סביר לנסות שוב אוטומטית?"
    options: ["400 ו-404, כי הבקשה שגויה", "503 וכשלי רשת, כי הם לרוב זמניים", "כל תשובה, כמה שיותר פעמים"]
  - q: "מהו backoff מעריכי (exponential backoff)?"
    options: ["המתנה ארוכה יותר אחרי כל ניסיון שנכשל (למשל שנייה, שתי שניות, ארבע שניות) כדי שהשרת יוכל להתאושש", "ניסיון חוזר מהר ככל האפשר", "שליחת אותה בקשה לכמה שרתים"]
  - q: "שרת עונה 429 עם Retry-After: 30. מה לקוח מנומס צריך לעשות?"
    options: ["לנסות מיד, שלוש פעמים", "לחכות בערך 30 שניות לפני שקוראים שוב", "לעבור לבקשת POST"]
  - q: "למה מסוכן לנסות שוב POST שיצר משהו?"
    options: ["הדפדפן לא יכול לנסות POST שוב", "ייתכן שהניסיון הראשון הצליח, ולכן ניסיון חוזר יכול ליצור כפילות", "POST לא מורשה להיכשל"]
    explain: "בטוח לנסות שוב: GET, PUT, DELETE (אידמפוטנטיות). עבור POST צריך מפתח אידמפוטנטיות או בדיקה קודם."
messages:
  - "השתמשו ב-AbortController עבור חריגת הזמן."
  - "קראו ל-controller.abort() כשהזמן נגמר."
  - "העבירו את controller.signal ל-fetch."
  - "הכפילו את ההשהיה בכל ניסיון (backoff מעריכי), למשל baseDelay * 2 ** (attempt - 1)."
  - "קראו את הכותרת Retry-After בתשובת 429."
---

שרתים מתעמסים, רשתות מאבדות חבילות, ויש בקשות שפשוט לוקחות יותר מדי זמן. תוכנית שמוותרת בתקלה הראשונה שבירה; תוכנית שמנסה שוב לנצח היא מטרד. בשיעור הזה תבנו את שלושת הכלים שנמצאים בין הקצוות האלה: **ניסיונות חוזרים עם backoff**, **חריגות זמן** (timeouts), ו**כיבוד מגבלות קצב** (rate limits).

## ניסיונות חוזרים עם backoff מעריכי

נקודת הקצה לתרגול `/flaky` היא סימולטור אסונות קטן: שתי התשובות הראשונות שלה הן `503 Service Unavailable`, והשלישית עובדת.

```
GET /flaky  ->  503 {"error":"Temporarily unavailable, try again","attempt":1}   Retry-After: 1
GET /flaky  ->  503 {"error":"Temporarily unavailable, try again","attempt":2}
GET /flaky  ->  200 {"message":"Success on attempt 3"}
```

`503` היא בעיה *זמנית*, ולכן סביר לנסות שוב. אבל לא בצורה עיוורת:

- **נסו שוב רק את מה שיכול להשתפר.** `5xx` וכשלי רשת: כן. `400`, `401`, `403`, `404`, `422`: לא, אותה בקשה תיכשל באותה צורה.
- **הגבילו את מספר הניסיונות.** שלושה או ארבעה ניסיונות חוזרים, ואז דווחו על הכישלון.
- **המתינו בין ניסיונות, והמתינו יותר בכל פעם.** זה **backoff מעריכי**: 20 ms, 40 ms, 80 ms... (בחיים האמיתיים שנייה, שתיים, ארבע...). אם אלף לקוחות מנסים שוב באותו רגע, הם יפילו שוב את השרת שמתאושש; פיזור הניסיונות החוזרים נותן לו מרווח.

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let attempt = 1; ; attempt++) {
  const res = await fetch(url);
  if (res.status < 500 || attempt > retries) return res;
  await sleep(baseDelay * 2 ** (attempt - 1)); // 2 ** n means 2 to the power n
}
```

כותרת התשובה `Retry-After` (כאן `1`, כלומר שנייה אחת) היא השרת שאומר לכם כמה זמן לחכות. לקוח זהיר מעדיף אותה על פני ניחוש משלו. מערכות אמיתיות מוסיפות גם קצת "רעש" אקראי (jitter) להשהיה, כדי שלקוחות לא ינסו שוב בסנכרון מושלם.

## חריגות זמן עם AbortController

ל-`fetch` אין מגבלת זמן מובנית: שרת תקוע יכול לגרום לתוכנית שלכם לחכות דקות. `AbortController` נותן לכם למשוך את התקע:

```js
const controller = new AbortController();
setTimeout(() => controller.abort(), 100);          // after 100 ms: cancel
const res = await fetch(url, { signal: controller.signal });
```

`controller.signal` מועבר ל-`fetch`; קריאה ל-`controller.abort()` אומרת לו לעצור. בדפדפן אמיתי ה-`fetch` הממתין נדחה אז עם שגיאה בשם `AbortError`, ותופסים אותה עם `try/catch`.

> **הערה על שרת התרגול.** זו סימולציה שחיה בתוך הדף הזה ולא עוקבת אחרי ה-signal, ולכן בקורס הזה `fetch` לבדה הייתה ממשיכה לחכות את כל 300 ה-ms. כדי שחריגת הזמן תעבוד בכל מקום, התרגיל גם מאזין לאירוע `abort` ודוחה promise משלו, ואז משתמש ב-`Promise.race` (מי שמסתיים ראשון מנצח). התבנית נכונה גם לשרתים אמיתיים.

זכרו לקרוא ל-`clearTimeout` כשהבקשה מסתיימת בזמן, אחרת הטיימר יופעל מאוחר יותר סתם.

## מגבלות קצב

API מגנים על עצמם בכך שהם מגבילים כמה פעמים מותר לקרוא להם. `/limited` מאפשר שלוש קריאות ואז מסרב:

```
HTTP/1.1 200 OK
X-RateLimit-Remaining: 0          <- the fourth call is not allowed

HTTP/1.1 429 Too Many Requests
Retry-After: 30                   <- try again in 30 seconds
```

`429` הוא הסטטוס הסטנדרטי ל"האטו". לקוחות טובים קוראים את `X-RateLimit-Remaining` כדי להאט *לפני* המגבלה, וממלאים אחרי `Retry-After` אחרי שפגעו בה. הפצצה של API עם מגבלת קצב בלולאה (loop) מובילה בדרך כלל לחסימות ארוכות יותר.

## מחברים את הכול

לקוח חסין משלב את שלושת הרעיונות: חריגת זמן לכל ניסיון, ניסיונות חוזרים עם backoff עבור `5xx` וחריגות זמן, ועצירה (או המתנה ארוכה) ב-`429`. בשיעור 10 כתבתם את `request()`; הוספת אפשרויות `retries` ו-`timeout` אליה היא הצעד הטבעי הבא.

> **שימו לב:**
> - **ניסיונות חוזרים לנצח.** תמיד הגדירו מספר ניסיונות מקסימלי; `while (true)` בלי יציאה תקע את התוכנית.
> - **ניסיון חוזר של קריאות שאינן אידמפוטנטיות.** `POST` שחרג מהזמן אולי הצליח. ניסיון חוזר יכול ליצור כפילויות (שיעור 9).
> - **ניסיון חוזר של שגיאות לקוח.** `404` או `422` לעולם לא יצליחו מעצמן, ולכן ניסיון חוזר רק מבזבז זמן.
> - **שכחתם `clearTimeout`.** טיימר הביטול אז מופעל אחרי בקשה מוצלחת ויכול לבטל כלום, או להשאיר את הסקריפט חי.
> - **יצירת promise שנדחה בלי טיפול.** אם `timedOut` נדחה אחרי שהמרוץ הסתיים, אפשר לראות `Uncaught (in promise)`; בשיעור הזה המרוץ מסתיים קודם, ולכן הדחייה מטופלת.
> - **התעלמות מ-`Retry-After`.** הרמז של השרת אמין יותר מהשהיה קבועה.

## להמשיך הלאה

גרמו ל-`fetchWithRetry` לעצור מיד ב-`429`, והוסיפו jitter אקראי: `delay + Math.random() * 10`. חשבו איך הייתם הופכים `POST` לבטוח לניסיון חוזר.

> **תורכם:** כתבו את `fetchWithRetry` (backoff מעריכי עבור `5xx`), כתבו את `fetchWithTimeout` עם `AbortController`, והדפיסו את הסטטוס ואת כותרות מגבלת הקצב של ארבע קריאות אל `/limited`.
