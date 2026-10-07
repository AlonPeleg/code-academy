---
title: "שלב 5: ניסיונות חוזרים עם backoff ו-timeout"
summary: "מנסים שוב כשלונות זמניים עם השהיות הולכות וגדלות, ומבטלים קריאות איטיות עם AbortController."
hints:
  - "פצלו את request לשלוש: send (ניסיון אחד, עם timeout של AbortController), requestFull (לולאה סביב send שמנסה שוב) ו-request (מחזירה את requestFull(...).data). נסו שוב רק כשלונות זמניים: סטטוס 0, 429, 502, 503, 504."
  - "ב-requestFull: for (let attempt = 0; ; attempt++) { try { return await this.send(...); } catch (error) { if (cannot retry or attempt >= retries) throw error; await sleep(this.baseDelay * 2 ** attempt); } }"
  - "const controller = new AbortController(); options.signal = controller.signal; const timer = setTimeout(() => controller.abort(), timeout); try { const done = await abortable(exchange, controller.signal); ... } catch (error) { if (error.name === \"AbortError\") throw new ApiError(0, \"Request timed out after \" + timeout + \" ms\"); throw new ApiError(0, \"Network error: \" + error.message); } finally { clearTimeout(timer); }"
messages:
  - "צרו AbortController עבור ה-timeout."
  - "קראו ל-controller.abort() כשהזמן נגמר."
  - "הכפילו את ההמתנה בכל פעם: this.baseDelay * 2 ** attempt."
  - "עצרו את הטיימר עם clearTimeout בבלוק finally."
quiz:
  - q: "למה מחכים יותר אחרי כל ניסיון שנכשל (5, 10, 20 אלפיות שנייה...)?"
    options: ["זה מקצר את הקוד", "זה נותן לשרת מתקשה מקום להתאושש ומפזר את הלקוחות", "fetch דורשת את זה"]
    explain: "זה נקרא exponential backoff."
  - q: "למה הלקוח לא מנסה שוב בקשות POST אוטומטית?"
    options: ["הרצת POST פעמיים עלולה ליצור שתי רשומות", "POST לא יכול להיכשל", "POST תמיד מהיר יותר"]
  - q: "מה AbortController עושה?"
    options: ["הוא בודק את הכותרת Authorization", "הוא מנסה בקשה שוב", "הוא מאפשר לבטל בקשה על ידי הפעלת ה-signal שלו"]
---
רשתות נכשלות כל הזמן: שרת מופעל מחדש, אות Wi-Fi נופל, שירות עמוס אומר "נסו שוב מאוחר יותר". בשלב הזה הלקוח שלכם הופך ל**עמיד** (resilient): הוא מנסה שוב כשלונות זמניים עם השהיות הולכות וגדלות, ומוותר על קריאות שלוקחות יותר מדי זמן.

## איפה אנחנו

ל-`ApiClient` יש התחברות, משאבי CRUD ושגיאות עקביות. אבל שיהוק אחד (`503 Service Unavailable`) מכשיל את כל הקריאה, ושרת שאף פעם לא עונה יגרום לתוכנית לחכות לנצח.

## מה נוסיף, ולמה

שתי טכניקות קלאסיות:

* **ניסיון חוזר עם exponential backoff.** אחרי כישלון זמני, מחכים קצת ומנסים שוב. מחכים *יותר* בכל פעם (5 אלפיות שנייה, 10, 20...). ההכפלה נותנת לשרת מקום להתאושש ומונעת מאלפי לקוחות להכות בו בצעד אחיד. ההשהיות בתרגול זעירות; אפליקציות אמיתיות משתמשות במשהו כמו 200 אלפיות שנייה, 400, 800.
* **Timeout.** מחליטים כמה זמן מוכנים לחכות ומבטלים אחרי זה, בעזרת `AbortController`.

ניסיונות חוזרים בטוחים רק לקריאות שאפשר להריץ פעמיים בלי נזק: `GET`, `PUT` ו-`DELETE` הן **אידמפוטנטיות** (idempotent), כלומר ביצוע פעמיים שווה לביצוע פעם אחת. `POST` עלול ליצור שתי רשומות, ולכן אף פעם לא ננסה אותו שוב אוטומטית.

## מעבר מודרך

**1. מפצלים את העבודה.** יוצרים שלוש שכבות, כל אחת קטנה:

* `send(method, path, body, timeout)`: ניסיון בודד אחד. מחזירה `{ status, headers, data }` או זורקת `ApiError`. (העבירו לכאן את קוד ה-fetch הישן.)
* `requestFull(method, path, body, options)`: לולאת הניסיונות החוזרים סביב `send`.
* `request(...)`: קוראת ל-`requestFull` ומחזירה רק את `.data`, כך שכל הקוראים הישנים שלכם ממשיכים לעבוד.

**2. ה-timeout.** ל-`AbortController` יש `signal` שמעבירים ל-`fetch`; קריאה ל-`controller.abort()` מבטלת את הבקשה:

```js
const controller = new AbortController();
options.signal = controller.signal;
const timer = setTimeout(() => controller.abort(), timeout);
try {
  // ... await the fetch ...
} finally {
  clearTimeout(timer);   // always stop the timer, success or not
}
```

דפדפן אמיתי דוחה את `fetch` עם `AbortError` כשה-signal מופעל. שרת התרגול מדומה ומתעלם מה-signal, ולכן הקובץ כולל פונקציית עזר `abortable(promise, signal)` שדוחה כשה-signal מופעל, לא משנה מה. תפסו את השגיאה והמירו אותה: `error.name === "AbortError"` הופך ל-`new ApiError(0, "Request timed out after 100 ms")`. סטטוס `0` אומר "בכלל אין תשובת HTTP", וגם שגיאת רשת מקבלת סטטוס `0`.

**3. לולאת הניסיונות החוזרים.** לולאת `for` בלי תנאי סיום ועם `return` בהצלחה:

```js
for (let attempt = 0; ; attempt++) {
  try {
    return await this.send(method, path, body, timeout);
  } catch (error) {
    const temporary = error.status === 0 || RETRYABLE_STATUS.includes(error.status);
    if (!canRetry || !temporary || attempt >= retries) throw error;
    await sleep(this.baseDelay * 2 ** attempt);
  }
}
```

`2 ** attempt` הוא "2 בחזקת attempt": 1, 2, 4... ולכן ההמתנות הן 5, 10, 20 אלפיות שנייה. `throw error` בתוך `catch` זורק מחדש את אותה שגיאה כשאנחנו מוותרים. `404` אינו זמני, ולכן הוא נכשל מיד: ניסיון חוזר לעולם לא יגרום למשתמש חסר להופיע.

**4. צופים בזה.** הוסיפו callback אופציונלי `this.onRetry` ש-`requestFull` קוראת לו לפני כל השהיה עם `{ attempt, wait, error }`, ו-`this.requestCount` ש-`send` מגדילה. ההדגמה משתמשת בשניהם כדי להדפיס מה קרה. `/flaky` נכשל פעמיים עם 503 ואז מצליח, `/limited` תמיד עונה `429 Too many requests` אחרי שלוש קריאות, `/slow` לוקח 300 אלפיות שנייה.

> **שימו לב:**
> - ניסיונות חוזרים לנצח: תמיד הגבילו את מספר הניסיונות, אחרת שרת מת יתקע את האפליקציה שלכם.
> - ניסיון חוזר של `POST`: חיוב כפול ורשומות כפולות. בגלל זה קיים `SAFE_METHODS`.
> - שכחת `clearTimeout`: הטיימר שומר על התוכנית חיה ומאוחר יותר מבטל בקשה שכבר הסתיימה.
> - ניסיון חוזר על שגיאות כמו `401` או `422`: הן לעולם לא יצליחו, נסו שוב רק `429`, `502`, `503`, `504` ושגיאות רשת.
> - חסר `await` לפני `sleep(...)`: הלולאה מסתובבת בלי הפסקה.

> **תורכם:** פצלו את `request` ל-`send`, `requestFull` ו-`request`, הוסיפו את ה-timeout עם `AbortController`, והוסיפו exponential backoff לשיטות בטוחות. אפשרויות ה-constructor הן `retries` (3), `baseDelay` (5) ו-`timeout` (5000); ארגומנט `options` לכל קריאה יכול לדרוס את `retries` ואת `timeout`.
