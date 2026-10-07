---
title: "כותרות: קריאה ושליחה"
summary: "קוראים כותרות (headers) של תשובה, שולחים כותרות בקשה משלכם, ורואים בדיוק מה השרת קיבל עם /headers ו-/echo."
hints:
  - "כותרות תשובה נקראות עם res.headers.get('name'). הפונקציה מתעלמת מאותיות גדולות וקטנות ומחזירה null עבור כותרת חסרה. כותרות בקשה נכנסות לארגומנט השני של fetch: fetch(url, { headers: { Name: 'value' } })."
  - "fetch(BASE + '/headers', { headers: { 'X-Student': 'Maya', Accept: 'application/json' } })  וב-POST: fetch(BASE + '/echo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hello: 'world' }) })"
  - "const echo = await (await fetch(BASE + '/echo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hello: 'world' }) })).json(); console.log('method: ' + echo.method); console.log('contentType: ' + echo.contentType); console.log('body: ' + JSON.stringify(echo.body));"
quiz:
  - q: "מה ההבדל בין Content-Type ל-Accept?"
    options: ["הן אותה כותרת", "Content-Type מתארת את הגוף שנשלח, ו-Accept אומרת באילו פורמטים אתם רוצים תשובה", "Accept מתארת את הגוף שנשלח, ו-Content-Type אומרת מה אתם רוצים בחזרה"]
  - q: "מה res.headers.get('x-missing') מחזירה עבור כותרת שלא קיימת?"
    options: ["מחרוזת ריקה", "undefined", "null"]
  - q: "אתם שולחים גוף עם JSON.stringify(...) אבל בלי כותרת Content-Type. מה התוצאה הסבירה?"
    options: ["השרת אולי לא יבין, ויענה בשגיאה כמו 415", "הכול עובד כרגיל", "fetch זורקת שגיאה לפני השליחה"]
    explain: "בלי הכותרת, fetch מתייגת גוף שהוא מחרוזת כ-text/plain, ולכן API של JSON לא יודע לפענח אותו."
  - q: "האם שמות כותרות רגישים לאותיות גדולות וקטנות ב-HTTP?"
    options: ["כן, תמיד באותיות קטנות", "לא, Content-Type ו-content-type הן אותה כותרת", "רק בשרת"]
messages:
  - "העבירו אובייקט headers ל-fetch."
  - "שלחו את בקשת ה-echo עם method: 'POST'."
  - "הפכו את אובייקט הגוף לטקסט JSON עם JSON.stringify."
  - "קראו כותרות תשובה עם res.headers.get(...)."
---

כותרות (headers) הן האותיות הקטנות של HTTP: הערות זעירות מהצורה `Name: value` שנוסעות עם כל בקשה וכל תשובה. הן נושאות את הפורמט של הנתונים, מי אתם, לכמה זמן מותר לשמור משהו במטמון ועוד. השיעור הזה מראה איך קוראים את הכותרות של השרת ואיך שולחים כותרות משלכם.

## איפה הכותרות נמצאות

הנה בקשה ותשובה עם הכותרות שלהן:

```
POST /echo HTTP/1.1
Host: api.academy.test
Content-Type: application/json
Accept: application/json

{"hello":"world"}
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"method":"POST","contentType":"application/json", ...}
```

הכותרות באות אחרי השורה הראשונה ולפני השורה הריקה שפותחת את הגוף. כמה מהן תפגשו כל הזמן:

| כותרת | כיוון | משמעות |
| --- | --- | --- |
| `Content-Type` | שניהם | הפורמט של **הגוף של ההודעה הזאת** (`application/json`) |
| `Accept` | בקשה | הפורמטים ש**אתם** מסוגלים להבין בתשובה |
| `Authorization` | בקשה | פרטי הזדהות (בשיעור הבא) |
| `Location` | תשובה | איפה נמצא פריט שנוצר זה עתה |
| `ETag`, `Cache-Control` | תשובה | מידע על מטמון (שיעור 12) |
| `Retry-After` | תשובה | כמה שניות לחכות (שיעור 11) |
| `X-...` | אחד מהם | כותרות מותאמות אישית כמו `X-Total-Count` |

## קריאת כותרות תשובה

`res.headers` הוא אובייקט (object) קטן עם שיטה `get`:

```js
const res = await fetch(BASE + '/users');
console.log(res.headers.get('content-type')); // prints: application/json; charset=utf-8
console.log(res.headers.get('X-Total-Count')); // prints: 5
console.log(res.headers.get('X-Nope'));        // prints: null
```

שמות כותרות **אינם רגישים לאותיות גדולות וקטנות**: `Content-Type`, `content-type` ו-`CONTENT-TYPE` הן אותה כותרת. כותרת חסרה נותנת `null`, וכל ערך הוא מחרוזת (string). אפשר גם לעבור בלולאה (loop) על כולן:

```js
for (const [name, value] of res.headers) console.log(name + ': ' + value);
```

## שליחת כותרות בקשה

הארגומנט השני של `fetch` הוא **אובייקט אפשרויות**. התכונה `headers` שלו היא אובייקט פשוט:

```js
const res = await fetch(BASE + '/headers', {
  headers: { 'X-Student': 'Maya', Accept: 'application/json' },
});
```

שימו מרכאות סביב שמות שמכילים מקף (`'X-Student'`), ומילה פשוטה כמו `Accept` לא צריכה מרכאות.

איך אפשר להיות בטוחים מה השרת באמת קיבל? בשרת התרגול יש שתי מראות:

- `GET /headers` עונה עם כותרות הבקשה כ-JSON (השמות באותיות קטנות).
- `/echo` עונה עם השיטה, מחרוזת השאילתה, סוג התוכן והגוף של כל מה ששלחתם.

מראות כאלה (בן דוד מהעולם האמיתי: httpbin) הן כלי ה-debug הטוב ביותר למתחילים: אם התשובה לא כפי שציפיתם, בדקו מה בפועל יצא מהקוד שלכם.

## Content-Type חשוב כששולחים נתונים

כששולחים גוף, השרת חייב לדעת איך לקרוא אותו. API של JSON מצפה לזה:

```js
await fetch(BASE + '/echo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ hello: 'world' }),
});
```

שלושה חלקים עובדים יחד: ה**שיטה** (`POST`), ה**כותרת** (`Content-Type: application/json`) שמתייגת את הגוף, והגוף עצמו, שחייב להיות מחרוזת, ולכן ממירים את האובייקט עם `JSON.stringify`.

> **שימו לב:**
> - **שכחתם את `Content-Type`.** אז `fetch` מתייגת את הגוף שהוא מחרוזת כ-`text/plain`. נקודות קצה לכתיבה עונות `415` עם ההודעה `Send JSON with the header Content-Type: application/json`.
> - **העברתם אובייקט כגוף.** `body: { hello: 'world' }` שולח את הטקסט `[object Object]`. תמיד הפעילו עליו `JSON.stringify`.
> - **שמתם את הכותרות במקום הלא נכון.** `fetch(url, { 'Content-Type': 'application/json' })` מתעלמת מהן בשקט. מקומן בתוך `headers: { ... }`.
> - **ציפיתם ש-`res.headers.get('x')` יהיה מספר.** ערכי כותרות הם מחרוזות, וכותרת חסרה היא `null`, לא `undefined`.
> - **אותיות לא נכונות באובייקט המשוקף.** `/headers` מחזיר מפתחות באותיות קטנות, ולכן `seen['X-Student']` הוא `undefined` אבל `seen['x-student']` עובד.

## להמשיך הלאה

שלחו את הבקשה אל `/echo?lang=en&page=2` והסתכלו בשדה `query` של התשובה: השרת פענח בשבילכם את מחרוזת השאילתה. אחר כך נסו לשלוח POST בלי כותרת `Content-Type` וראו איזה `contentType` השרת מדווח.

> **תורכם:** קראו את `Content-Type` וכותרת חסרה מ-`/users`, שלחו `X-Student` ו-`Accept` אל `/headers` והדפיסו מה השרת ראה, ואז שלחו JSON ב-POST אל `/echo` והדפיסו את השיטה, סוג התוכן והגוף שהתקבלו.
