---
title: "Middleware: צינור הבקשה"
summary: "מחברים בשרשרת פונקציות קטנות עם app.use ו-next() כדי לתעד בקשות ביומן, לנתח JSON, להוסיף כותרות ולשמור על נתיבים."
hints:
  - "Middleware היא פונקציה (req, res, next). היא או מסיימת את הבקשה (res.json, res.send, res.status(...).json) או קוראת ל-next() כדי להעביר את הבקשה הלאה. app.use(...) רושמת אותה, וסדר שורות ה-app.use הוא הסדר שבו הן רצות."
  - "logger: console.log(req.method + ' ' + req.url); next();   requireKey: if (req.headers['x-api-key'] !== 'secret') { return res.status(401).json({ error: 'API key required' }); } next();   ה-middleware של הכותרת הוא app.use((req, res, next) => { res.set('X-Served-By', 'academy'); next(); });"
  - "app.use(logger); app.use(express.json()); app.use((req, res, next) => { res.set('X-Served-By', 'academy'); next(); }); app.use('/admin', requireKey);   (כל ארבע השורות באות מעל app.get('/hello', ...))"
messages:
  - "קראו ל-next() כדי להעביר את הבקשה ל-middleware הבא."
  - "רשמו את express.json() כדי ש-req.body יתמלא."
  - "רשמו את ה-middleware שלכם עם app.use(...)."
quiz:
  - q: "מה קורה אם middleware לא שולח תשובה ולא קורא ל-next()?"
    options: ["Express מדלגת עליו וממשיכה", "הבקשה נתקעת: הלקוח ממשיך לחכות לתשובה", "Express שולחת 404 אוטומטית"]
    explain: "Express לא יכולה לנחש למה התכוונתם. תמיד או שלחו תשובה או קראו ל-next()."
  - q: "כתבתם קודם app.get('/hello', ...) ואחריו app.use(logger). האם ה-logger ירוץ עבור GET /hello?"
    options: ["כן, app.use תמיד רץ ראשון", "כן, אבל רק אחרי התשובה", "לא, הנתיב כבר ענה, ולכן ה-middleware המאוחר יותר אף פעם לא מגיע"]
    explain: "Express עוברת על הרשימה מלמעלה למטה ונעצרת ברגע שמשהו שולח תשובה."
  - q: "מה עושה app.use('/admin', requireKey)?"
    options: ["מריצה את requireKey רק עבור נתיבי בקשה שמתחילים ב-/admin", "יוצרת נתיב בשם /admin", "מריצה את requireKey עבור כל נתיב חוץ מ-/admin"]
  - q: "למה שמים את express.json() לפני הנתיבים?"
    options: ["כדי ש-res.json יעבוד", "כדי ש-req.body כבר יהיה מלא ב-JSON המנותח כשה-handler של הנתיב רץ", "כי Express מאפשרת רק middleware אחד לכל נתיב"]
---

עד עכשיו כל בקשה הלכה ישר ל-handler של נתיב. אפליקציות אמיתיות צריכות עבודה שקורית עבור הרבה נתיבים: תיעוד ביומן (logging), קריאת גופי JSON, בדיקת התחברות, הוספת כותרות. Express פותרת את זה עם **middleware**, וכשמבינים אותו, רוב Express מפסיקה להיות קסם.

## מהו middleware?

Middleware היא פונקציה רגילה עם שלושה פרמטרים:

```js
function logger(req, res, next) {
  console.log(req.method + ' ' + req.url);
  next();
}
```

- `req` היא הבקשה, `res` היא התשובה (אתם כבר מכירים אותם מה-handlers של הנתיבים).
- `next` היא פונקציה. קריאה ל-`next()` אומרת "סיימתי, תנו את הבקשה לפונקציה הבאה בתור".

חשבו על שדה תעופה: עוברים בדיקת כרטיס, אחר כך ביטחון, אחר כך השער. כל שלב או נותן לכם לעבור (`next()`) או עוצר אתכם עם תשובה (`res.status(401)...`). handler של נתיב הוא פשוט השלב האחרון בתור הזה.

רושמים middleware עם `app.use`:

```js
app.use(logger);          // runs for EVERY request
app.use('/admin', check); // runs only when the path starts with /admin
```

## הסדר חשוב

Express שומרת רשימה אחת ועוברת עליה מלמעלה למטה עבור כל בקשה. היא נעצרת ברגע שמישהו שולח תשובה.

```js
app.get('/hello', (req, res) => res.send('Hello')); // answers here...
app.use(logger);                                    // ...so this never runs for /hello
```

הכלל: רשמו את ה-middleware שלכם **לפני** הנתיבים שצריכים אותו. תיעוד, ניתוח גוף ואבטחה באים קודם, הנתיבים אחריהם, וטיפול בשגיאות אחרון (בשיעור הבא בסדרה).

## עצירת התור מוקדם

Middleware לא חייב לקרוא ל-`next()`. שומר עונה בעצמו כשמשהו לא בסדר:

```js
function requireKey(req, res, next) {
  if (req.headers['x-api-key'] !== 'secret') {
    return res.status(401).json({ error: 'API key required' });
  }
  next();
}
```

שימו לב ל-`return`: הוא עוצר את הפונקציה אחרי שליחת השגיאה, כך ש-`next()` לא נקראת גם. Node הופכת שמות כותרות לאותיות קטנות, ולכן תמיד קראו `req.headers['x-api-key']` באותיות קטנות.

## העברת נתונים הלאה

מכיוון שכל פונקציה בתור מקבלת את אותו אובייקט `req`, middleware יכול לצרף מידע בשביל המאוחרים יותר:

```js
app.use((req, res, next) => {
  req.requestId = 'r1';   // any later handler can read req.requestId
  next();
});
```

תשתמשו בדיוק בתכסיס הזה בשיעור על אימות (authentication) כדי לשמור את המשתמש המחובר ב-`req.user`.

## Middleware מובנה ומצד שלישי

גם `express.json()` הוא middleware. הוא קורא את הגוף הגולמי, מנתח את ה-JSON ומניח את התוצאה ב-`req.body`. בלעדיו `req.body` הוא `undefined`. אחרים פופולריים מ-npm: `cors` (מאפשר לדפדפנים מאתרים אחרים), `morgan` (מתעד בקשות ביומן, מוכן לשימוש) ו-`helmet` (כותרות HTTP בטוחות יותר). אפשר גם להשתמש ב-middleware עבור נתיב אחד בלבד: `app.get('/x', requireKey, handler)`.

> **שימו לב:**
> - **שכחת `next()`.** הבקשה אף פעם לא מסתיימת; `fetch` מחכה לנצח. אם נתיב "נתקע", בדקו כל middleware שקודם לו.
> - **קריאה ל-`next()` אחרי שענו.** בלי `return` אפשר לשלוח תשובה ואז גם להמשיך, וזה עלול להסתיים ב-`Cannot set headers after they are sent to the client`.
> - **רישום `app.use(express.json())` אחרי הנתיבים.** אז `req.body` הוא `undefined` בתוכם ומקבלים `TypeError: Cannot read properties of undefined`.
> - **קריאת `req.headers['X-Api-Key']`.** Node שומרת שמות כותרות באותיות קטנות, ולכן החיפוש הזה תמיד נותן `undefined`.

## להתקדם הלאה

הפכו את `requireKey` לפונקציה שמחזירה middleware, `requireKey('secret')`, כך שחלקים שונים באפליקציה יוכלו להשתמש במפתחות שונים. פונקציה שבונה middleware נקראת מפעל (factory), ותפגשו אותה שוב עבור תפקידים (roles).

> **תורכם:** מלאו את `logger` ואת `requireKey`, ואז רשמו ארבעה דברים מעל הנתיבים: ה-logger שלכם, `express.json()`, middleware בתוך השורה שקובע את הכותרת `X-Served-By` ל-`academy`, ואת `requireKey` עבור הנתיב `/admin`. לקוח הבדיקה בתחתית מדפיס את התוצאה.
