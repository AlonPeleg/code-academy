---
title: "קודי סטטוס, res.ok וטיפול בשגיאות"
summary: "קראו קודי סטטוס, הבינו ש-404 לא גורם ל-fetch לזרוק שגיאה, וטפלו גם בשגיאות HTTP וגם בכשלים ברשת."
hints:
  - "404 או 500 עדיין נחשבים שיחה מוצלחת: fetch נותנת לכם תגובה רגילה ואתם צריכים לבדוק בעצמכם את res.ok (שהוא true עבור 200 עד 299). fetch זורקת שגיאה רק כשאף תגובה לא מגיעה."
  - "חלק א: const res = await fetch(BASE + path); console.log(path + ' -> ' + res.status + ' ' + res.statusText + ' ok=' + res.ok);   חלק ב: if (!res.ok) { const body = await res.json(); throw new Error(...); }"
  - "async function getJson(path) { const res = await fetch(BASE + path); if (!res.ok) { const body = await res.json(); throw new Error(res.status + ': ' + body.error); } return res.json(); }   try { await getJson('/users/99'); } catch (error) { console.log('failed: ' + error.message); }"
quiz:
  - q: "אתם שולפים את /users/99 והשרת עונה 404. מה await fetch(...) עושה?"
    options: ["היא זורקת שגיאה", "היא מסתיימת כרגיל עם תגובה ש-ok שלה הוא false", "היא מחזירה null"]
    explain: "fetch נדחית רק כשאי אפשר להשלים את הבקשה (אין רשת, כתובת שגויה). קודי שגיאה של HTTP הם תגובות רגילות."
  - q: "אילו קודי סטטוס הופכים את res.ok ל-true?"
    options: ["רק 200", "200 עד 299", "כל מה שמתחת ל-400, כולל 304 ו-301"]
  - q: "איזו משפחת סטטוס אומרת שלשרת עצמו הייתה בעיה?"
    options: ["4xx", "3xx", "5xx"]
  - q: "משתמש מקליד סיסמה שגויה והשרת עונה 401. מי אשם בזה?"
    options: ["הבקשה (צד הלקוח)", "השרת קרס", "הרשת"]
    explain: "קודי 4xx אומרים שהלקוח שלח משהו שהשרת לא יכול לקבל; מתקנים את הבקשה ומנסים שוב."
messages:
  - "בדקו את התכונה ok של התגובה."
  - "זרקו Error בתוך getJson כשהתגובה אינה ok."
  - "השתמשו ב-try/catch כדי לטפל בכשלים."
---

רשתות אמיתיות נכשלות, ושרתים אמיתיים אומרים לא. תוכנית שעובדת רק כשהכול מתנהל כשורה היא לא גמורה. השיעור הזה מלמד אתכם לקרוא קודי סטטוס ולהפריד בין שני סוגי כשל שונים מאוד.

## קודי סטטוס שתפגשו

כל תגובה מתחילה בשורת סטטוס, כמו `HTTP/1.1 404 Not Found`. המספר מיועד לתוכנות, והטקסט לבני אדם.

| קוד | שם | מתי רואים אותו |
| --- | --- | --- |
| 200 | OK | הבקשה הצליחה והנה הנתונים |
| 201 | Created | נוצר פריט חדש (אחרי `POST`) |
| 204 | No Content | זה הצליח ואין מה להחזיר |
| 304 | Not Modified | העותק השמור אצלכם עדיין טוב |
| 400 | Bad Request | הבקשה פגומה (למשל JSON שבור) |
| 401 | Unauthorized | אתם לא מחוברים, או שהטוקן לא תקין |
| 403 | Forbidden | אתם מחוברים אבל אין לכם הרשאה |
| 404 | Not Found | אין שום דבר בכתובת הזו |
| 422 | Unprocessable Entity | הנתונים מובנים אבל לא תקינים |
| 429 | Too Many Requests | האטו |
| 500 | Internal Server Error | השרת קרס |
| 503 | Service Unavailable | השרת עמוס או עולה מחדש |

לשרת התרגול יש כתובת שימושית, `/error/NNN`, שעונה עם כל סטטוס שתבקשו. הכתובת `/error/500` נותנת `500`, וכך אפשר להתאמן על טיפול בשגיאות לפי דרישה.

## שני סוגי כשל

זה הרעיון החשוב ביותר בשיעור.

1. **השרת ענה, אבל עם שגיאה.** דוגמה: `404 Not Found`. השיחה עבדה; קיבלתם תגובה. `await fetch(...)` **לא** זורקת שגיאה. אתם צריכים לבדוק את זה בעצמכם.
2. **לא הגיעה תשובה.** דוגמה: אין אינטרנט, שרת שגוי, או כתובת חסומה. כאן `fetch` עצמה **זורקת** (נדחית עם `TypeError`), ורק `try/catch` יכול לתפוס את זה.

```js
const res = await fetch(BASE + '/users/99');
console.log(res.status); // prints: 404   (no exception!)
console.log(res.ok);     // prints: false
```

`res.ok` הוא ערך בוליאני נוח: `true` כשהסטטוס הוא `200` עד `299`, ו-`false` אחרת. הגרסה הטקסטואלית היא `res.statusText` (`"Not Found"`).

## התבנית הסטנדרטית

רוב התוכניות רוצות מקום אחד שהופך "סטטוס רע" לשגיאה שנזרקת, כדי שהשאר של הקוד יוכל להשתמש ב-`try/catch` פשוט:

```js
async function getJson(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) {
    const body = await res.json();               // the server explains what went wrong
    throw new Error(res.status + ': ' + body.error);
  }
  return res.json();
}

try {
  const user = await getJson('/users/99');
} catch (error) {
  console.log('failed: ' + error.message);      // prints: failed: 404: No user with id 99
}
```

גם תגובות השגיאה של השרת הזה הן JSON, בצורה `{ "error": "No user with id 99" }`. קריאת ההודעה הזו הופכת את השגיאות שלכם למועילות במקום לתעלומה.

## שגיאות רשת

נסו לשלוף את שרת התרגול דרך `http://` פשוט. אף תשובה לא יכולה להגיע, ולכן `fetch` זורקת שגיאה:

```js
try {
  await fetch('http://api.academy.test/users');
} catch (error) {
  console.log(error.name); // prints: TypeError
}
```

דפדפן אמיתי זורק את אותה `TypeError` (לעיתים עם ההודעה `Failed to fetch`) כשהרשת מושבתת. שני סוגי הכשל ראויים להודעה ידידותית, אבל הם דורשים קוד שונה: `res.ok` לראשון, `catch` לשני.

> **שימו לב:**
> - **להניח ש-`try/catch` תופס 404.** הוא לא. בלי בדיקת `if (!res.ok)`, הקוד ממשיך ומתייחס לגוף השגיאה (`{ error: ... }`) כאילו הוא נתונים אמיתיים.
> - **לקרוא את הגוף פעמיים.** `await res.json()` ואחריה `await res.text()` נכשלות עם `TypeError: body stream already read`. קראו פעם אחת ושמרו את התוצאה.
> - **לבדוק רק `res.status === 200`.** זה דוחה את `201` ו-`204`, שגם הם הצלחות. העדיפו `res.ok`.
> - **לשכוח `await` לפני `getJson(...)` בתוך `try`.** ה-promise נדחה מאוחר יותר, אחרי שה-`catch` כבר לא שם, ואתם רואים `Uncaught (in promise)`.

## להמשיך הלאה

שנו את הלולאה כך שתבקש גם את `/error/404` ואת `/error/503`. אילו מהן כדאי לנסות שוב, ואילו לא? (שיעור 11 עונה על זה.)

> **תורכם:** השלימו שלושה חלקים. א: הדפיסו `path -> status statusText ok=...` עבור שלוש כתובות. ב: כתבו את `getJson` שזורקת `status: message` כשהתגובה אינה ok, ותפסו אותה. ג: תפסו את שגיאת הרשת של בקשת `http://` והדפיסו את ה-`name` שלה.
