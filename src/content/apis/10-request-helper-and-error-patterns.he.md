---
title: "תכנון בקשות טובות: פונקציית עזר request() לשימוש חוזר"
summary: "מפסיקים לחזור על קוד fetch שגרתי וכותבים פונקציית request() אחת עם תמיכה בשאילתות, גופי JSON, אימות ו-ApiError מותאם אישית."
hints:
  - "אספו את החלקים צעד אחר צעד: מחרוזת url, אובייקט headers (התחילו עם Accept) ואובייקט אפשרויות של fetch. הוסיפו Content-Type ו-body רק אם options.body מוגדר, ו-Authorization רק אם options.token מוגדר."
  - "let url = BASE + path; if (options.query) url += '?' + new URLSearchParams(options.query); const headers = { Accept: 'application/json' }; if (options.token) headers.Authorization = 'Bearer ' + options.token; const init = { method, headers }; if (options.body !== undefined) { headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(options.body); }"
  - "const res = await fetch(url, init); if (res.status === 204) return null; if (!res.ok) { const err = await res.json().catch(() => ({})); throw new ApiError(res.status, err.error, err.fields); } return res.json();"
quiz:
  - q: "מה היתרון המרכזי של עטיפת fetch בפונקציית עזר request()?"
    options: ["בקשות נעשות מהירות יותר", "כותרות, המרת JSON, אימות וטיפול בשגיאות נכתבים פעם אחת במקום בכל קריאה", "היא מסתירה את הרשת מהדפדפן"]
  - q: "למה לזרוק ApiError מותאם אישית (עם status ו-fields) במקום Error רגיל?"
    options: ["מי שקורא יכול לבדוק את error.status ואת error.fields כדי להחליט מה לעשות", "אי אפשר לתפוס שגיאות רגילות", "זה מונע את שליחת הבקשה"]
  - q: "למה אנחנו משתמשים ב-.catch(() => ({})) כשקוראים גוף של שגיאה?"
    options: ["כדי לנסות את הבקשה שוב", "כי לחלק מתשובות השגיאה אין גוף JSON, ופענוח היה זורק אחרת SyntaxError מבלבל", "כדי להסתיר את קוד הסטטוס"]
  - q: "איפה צריך להוסיף את הכותרת Content-Type: application/json?"
    options: ["בכל בקשה, כולל GET", "רק בתשובות", "רק כשלבקשה יש גוף שהוא JSON"]
messages:
  - "בנו את מחרוזת השאילתה עם URLSearchParams."
  - "המירו את הגוף עם JSON.stringify."
  - "הוסיפו את הכותרת Authorization כשניתן token."
  - "בדקו את res.ok כדי לזהות תשובות שגיאה."
  - "זרקו ApiError חדש עבור תשובות לא תקינות."
---

עד עכשיו כתבתם את אותן אפשרויות `fetch` חמש פעמים: השיטה, הכותרת `Authorization`, הכותרת `Content-Type`, `JSON.stringify`, ובדיקה של `res.ok`. קוד שחוזר על עצמו הוא קוד שנשבר: שוכחים שורה אחת במקום אחד ומקבלים `415` או `401` מסתוריים. פרויקטים מקצועיים פותרים את זה עם פונקציית עטיפה קטנה. בשיעור הזה תכתבו אותה.

## הצורה של פונקציית עזר טובה

ל-`request()` מתוכננת היטב יש משימה אחת: להפוך "אני רוצה לשלוח POST של האובייקט (object) הזה לנתיב ההוא" לבקשת HTTP נכונה, ולהפוך את התשובה ל**נתונים** או ל**שגיאה** ברורה.

```js
const todo = await request('POST', '/todos', { token, body: { title: 'Helper', userId: 1 } });
const users = await request('GET', '/users', { query: { role: 'editor' } });
await request('DELETE', '/todos/11', { token });
```

הקריאות נקראות כמו משפט, ושום דבר על כותרות לא מופיע במקום הקריאה. הנה התרגום שפונקציית העזר מבצעת:

```
request('POST', '/todos', { token, body })
        |
        v
POST /todos HTTP/1.1
Accept: application/json
Authorization: Bearer <token>
Content-Type: application/json

{"title":"Helper","userId":1}
```

## צעד אחר צעד

1. **בונים את ה-URL.** מתחילים מ-`BASE + path`. אם `options.query` קיים, מוסיפים `'?' + new URLSearchParams(options.query)`, שגם מבצע escape לתווים מיוחדים.
2. **בונים את הכותרות.** תמיד שולחים `Accept: application/json`. מוסיפים `Authorization` רק אם ניתן token.
3. **מוסיפים גוף רק כשצריך.** אם `options.body !== undefined`, מגדירים `Content-Type` ומפעילים עליו `JSON.stringify`. ל-`GET` אסור שיהיה גוף.
4. **שולחים את הבקשה** עם `await fetch(url, init)`.
5. **מטפלים בתוצאה.**
   - `204`: אין גוף, מחזירים `null`.
   - לא `res.ok`: קוראים את גוף השגיאה ו**זורקים**.
   - אחרת: מחזירים את ה-JSON המפוענח.

## מחלקת שגיאה מותאמת אישית

כש-`request` זורקת, מי שקורא צריך יותר מהודעה. תת-מחלקה (class) קטנה של `Error` יכולה לשאת את הפרטים:

```js
class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.name = 'ApiError';
    this.status = status;   // 404, 422, ...
    this.fields = fields;   // validation details, if any
  }
}
```

עכשיו מי שקורא יכול להגיב למצבים שונים:

```js
try {
  await request('POST', '/todos', { token, body: {} });
} catch (error) {
  if (error instanceof ApiError && error.status === 422) {
    console.log(error.fields); // { title: "is required", userId: "is required" }
  } else {
    throw error;               // not ours (for example a network failure): pass it on
  }
}
```

זה כלל תכנון כללי: **תופסים רק מה שיודעים לטפל בו**, וזורקים הלאה את השאר.

## תבניות לטיפול בשגיאות

| מצב | מה לעשות |
| --- | --- |
| `4xx` בגלל טעות שלכם (`400`, `422`) | להציג את ההודעה; לתקן את הקלט |
| `401` | להתחבר שוב ולנסות פעם אחת |
| `403`, `404` | להודיע למשתמש; ניסיון חוזר לא יעזור |
| `5xx` או כשל רשת | ייתכן שזמני: לנסות שוב עם backoff (שיעור 11) |
| אין גוף בתשובת השגיאה | לחזור להודעה כללית |

השורה `await res.json().catch(() => ({}))` מגינה עליכם משרתים שעונים בשגיאה בלי JSON (פרוקסי שקורס עלול לשלוח דף HTML). בלעדיה, שגיאת ה*פענוח* הייתה מסתירה את הבעיה ה*אמיתית*.

> **שימו לב:**
> - **שכחתם `return` או `await`.** `request` חייבת `return res.json()`; אם שוכחים `return`, מי שקורא מקבל `undefined`.
> - **הגדרת `Content-Type` ב-`GET`.** זה מיותר ושרתים מסוימים לא אוהבים את זה. הגדירו אותה רק כששולחים גוף.
> - **בדיקה של `if (options.body)`.** זה מדלג על גופים לגיטימיים כמו `0` או `false`. השוו עם `!== undefined`.
> - **בליעת שגיאות.** `catch (e) { }` בלי שום דבר בפנים מסתיר באגים. רשמו ללוג, טפלו, או זרקו הלאה.
> - **שינוי האפשרויות של מי שקורא.** בנו אובייקט `headers` חדש בכל פעם; אל תשתמשו שוב באחד משותף.

## להמשיך הלאה

הוסיפו אפשרות `{ signal }` לביטול, או גרמו לפונקציית העזר לרשום ללוג כל קריאה בצורה `GET /users -> 200`. צעד הבא טוב: גרמו ל-`request` להוסיף אוטומטית את ה-token ממשתנה ברמת המודול אחרי התחברות.

> **תורכם:** השלימו את `request(method, path, options)` כפי שמתואר בהערות בקוד ההתחלתי. כל מה שמתחתיה כבר כתוב ומשתמש בפונקציית העזר שלכם, ולכן כשהיא נכונה מופיעות שש שורות הפלט.
