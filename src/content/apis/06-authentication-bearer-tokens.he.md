---
title: "אימות: התחברות ואסימוני Bearer"
summary: "מתחברים כדי לקבל אסימון (token), שולחים אותו בכותרת Authorization, ומבדילים בין 401 (מי אתם?) ל-403 (אסור לכם)."
hints:
  - "התחברות היא POST עם פרטי הזדהות ב-JSON, והתשובה מכילה token. אחר כך כל בקשה מוגנת נושאת את ה-token בכותרת Authorization, שנכתבת כמילה Bearer, רווח, ואז ה-token."
  - "async function login(email, password) { const res = await fetch(BASE + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const data = await res.json(); return data.token; }   קריאה מוגנת: fetch(BASE + '/me', { headers: { Authorization: 'Bearer ' + token } })"
  - "const res = await fetch(BASE + '/admin/stats', { headers: { Authorization: 'Bearer ' + graceToken } }); const body = await res.json(); console.log('grace: ' + res.status + ' ' + body.error);"
quiz:
  - q: "מה ההבדל בין 401 ל-403?"
    options: ["401 אומר שהשרת קרס, 403 אומר שלא נמצא", "401 אומר שהשרת לא יודע מי אתם; 403 אומר שהוא מכיר אתכם אבל אסור לכם לעשות את זה", "הם אותו דבר, רק מספרים שונים"]
  - q: "איזה ערך כותרת נכון עבור token בשם abc123?"
    options: ["Authorization: Token=abc123", "Authorization: abc123 Bearer", "Authorization: Bearer abc123"]
  - q: "למה זה רעיון גרוע לשלוח סיסמה בכל בקשה?"
    options: ["סיסמאות ארוכות מדי לכותרות", "ככל שסוד נוסע יותר פעמים, יש יותר הזדמנויות שיודלף; token יכול לפקוע או להישלל", "שרתים מסרבים לסיסמאות בכותרות"]
  - q: "איפה מעבירים את ה-token עם fetch?"
    options: ["באפשרות headers של הארגומנט השני", "בנתיב ה-URL", "בתשובה"]
messages:
  - "שלחו את ה-token בכותרת Authorization."
  - "ערך Authorization הוא 'Bearer ' ואחריו ה-token."
  - "התחברו עם method: 'POST'."
  - "הגדירו Content-Type: application/json עבור גוף ההתחברות."
---

הרבה API מדברים רק עם אנשים שהם מכירים. כדי להשתמש בהם צריך להוכיח מי אתם, והשרת מחליט מה מותר לכם לעשות. השיעור הזה מכסה את התבנית הנפוצה ביותר באינטרנט המודרני: מתחברים פעם אחת, מקבלים **אסימון** (token), ושולחים אותו עם כל בקשה אחר כך.

## תהליך ההתחברות

```
1. You   -> POST /login  {"email":"ada@example.com","password":"engine123"}
2. Server -> 200 OK      {"token":"token-ada","expiresIn":3600}

3. You   -> GET /me      Authorization: Bearer token-ada
4. Server -> 200 OK      {"id":1,"name":"Ada Lovelace","role":"admin", ...}
```

הסיסמה נוסעת פעם אחת. השרת עונה עם **token**, מחרוזת ארוכה שנראית אקראית שמייצגת "האדם הזה, לשעה הקרובה" (`expiresIn` הוא בשניות). מעכשיו שולחים את ה-token במקום הסיסמה. אם הוא דלף או פג תוקפו, צריך להחליף רק את ה-token.

## הכותרת Authorization

המקום הסטנדרטי לפרטי הזדהות הוא הכותרת `Authorization`. הסכמה הנפוצה ביותר היא **Bearer**, שפירושה "מי שנושא (מחזיק) את ה-token הזה":

```
GET /me HTTP/1.1
Host: api.academy.test
Authorization: Bearer token-ada
```

בקוד:

```js
const res = await fetch(BASE + '/me', {
  headers: { Authorization: 'Bearer ' + token },
});
```

שימו לב לרווח אחרי `Bearer`. כל מה שהשרת צריך נמצא בכותרת האחת הזאת, ולכן קוראים ל-tokens **חסרי מצב** (stateless): השרת לא צריך שיהיה פתוח בשבילכם סשן.

## התחברות עם fetch

התחברות היא פשוט `POST` עם גוף JSON (תרגלתם את זה בשיעור 5):

```js
async function login(email, password) {
  const res = await fetch(BASE + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return data.token;
}
```

פרטי הזדהות שגויים נותנים `401` עם הגוף `{ "error": "Wrong email or password" }`. חשבונות תרגול: `ada@example.com` / `engine123` (מנהלת) ו-`grace@example.com` / `cobol456` (עורכת).

## 401 לעומת 403

קל לבלבל בין שניהם, וההבדל חשוב:

| סטטוס | בעברית פשוטה | תיקון אופייני |
| --- | --- | --- |
| **401 Unauthorized** | "אני לא יודע מי אתם." ה-token חסר, לא תקין או שפג תוקפו. | להתחבר (שוב) |
| **403 Forbidden** | "אני יודע מי אתם, והתשובה היא לא." | להשתמש בחשבון עם הרשאה, או לוותר |

השרת מוסיף לעיתים קרובות כותרת תשובה `WWW-Authenticate: Bearer` ל-`401`, רמז באיזו סכמה להשתמש. נסו את זה על `/me` בלי token: `res.headers.get('WWW-Authenticate')`.

נקודת הקצה `/admin/stats` מראה את שניהם: בלי token מקבלים `401`, ה-token של Grace נותן `403` (`Only admins can see this`), וה-token של Ada נותן את המספרים.

## שומרים על סודות

tokens אמיתיים הם סודות, ולכן התייחסו אליהם כמו לסיסמאות:

- תמיד השתמשו ב-`https://`, אף פעם לא ב-`http://`, כדי שאף אחד לא יוכל לקרוא את הכותרת בדרך.
- לעולם אל תדפיסו tokens ללוגים שמשותפים עם אחרים, ולעולם אל תעשו להם commit למאגר.
- העדיפו tokens קצרי חיים, ובקשו חדש כשאתם מקבלים `401`.
- לעולם אל תשימו token ב-URL: כתובות נשמרות בלוגים ובהיסטוריית הדפדפן.

> **שימו לב:**
> - **כתיבת הכותרת בלי `Bearer `.** `Authorization: token-ada` נותנת שגיאות בסגנון `401 Missing token`, כי השרת לא מוצא את הסכמה.
> - **שכחתם את הרווח** (`'Bearer' + token` נותן `Bearertoken-ada`) או הוספתם מרכאות מיותרות סביב ה-token.
> - **שכחתם `Content-Type` בבקשת ההתחברות.** השרת לא יכול לקרוא את פרטי ההזדהות שלכם ועונה `415`.
> - **בלבלתם בין `401` ל-`403`.** התחברות מחדש מתקנת `401`, אבל אף פעם לא `403`: לחשבון פשוט אין את הזכות.
> - **קבעתם token בקוד** שפג תוקפו מאוחר יותר. הביאו חדש עם `login()` כשצריך.

## להמשיך הלאה

נסו סיסמה שגויה והדפיסו את הסטטוס ואת השגיאה. אחר כך קראו ל-`/me` עם ה-token הבדוי `Bearer nonsense` והשוו את ההודעה שלו להודעה על token חסר.

> **תורכם:** קראו ל-`/me` בלי token, כתבו פונקציה (function) `login(email, password)`, השתמשו ב-token של Ada ב-`/me` וב-`/admin/stats`, ואז הראו שה-token של Grace מקבל `403` מ-`/admin/stats`.
