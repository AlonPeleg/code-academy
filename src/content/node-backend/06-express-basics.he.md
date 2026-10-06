---
title: "יסודות Express"
summary: "בונים שרת מאותו סוג עם הרבה פחות קוד בעזרת Express: נתיבים (routes), res.send, res.json, קודי סטטוס ו-express.json."
hints:
  - "לנתיב ב-Express יש הצורה app.METHOD(path, handler) כאשר ה-handler הוא (req, res) => { ... }. בתוכו, res.send(text) שולחת טקסט או HTML ו-res.json(object) שולחת JSON. שרשרו את res.status(code) לפניהן כדי לשנות את קוד הסטטוס."
  - "const app = express(); app.use(express.json()); app.get('/', (req, res) => { res.send('Welcome to Express'); }); בנתיב ה-POST הגוף שנותח נמצא ב-req.body."
  - "app.get('/api/hello', (req, res) => { res.json({ message: 'Hello from Express' }); }); app.get('/about', (req, res) => { res.send('<h1>About us</h1>'); }); app.post('/api/echo', (req, res) => { res.status(201).json({ received: req.body }); });"
messages:
  - "צרו את האפליקציה עם const app = express();"
  - "הוסיפו app.use(express.json()) כדי ש-req.body יעבוד."
  - "הוסיפו נתיב GET עבור /api/hello עם app.get."
  - "שלחו JSON עם res.json(...)."
  - "השתמשו ב-res.status(201) עבור תשובת היצירה."
  - "הוסיפו את נתיב ה-echo עם app.post(...)."
quiz:
  - q: "ב-app.get('/hello', (req, res) => { ... }), מה עושה הארגומנט הראשון '/hello'?"
    options: ["זה שם הפונקציה", "זה הנתיב שהנתיב (route) הזה עונה לו", "זה מספר הפורט"]
  - q: "מה ההבדל בין res.send('text') לבין res.json(object)?"
    options: ["res.json ממירה את האובייקט ל-JSON וקובעת Content-Type: application/json; res.send עם מחרוזת שולחת טקסט/HTML", "אין הבדל", "res.json יכולה לשלוח רק מערכים"]
  - q: "למה צריך את app.use(express.json()) בשביל נתיב POST?"
    options: ["בלעדיה השרת לא יכול להתחיל לרוץ", "היא מאיצה בקשות GET", "בלעדיה req.body הוא undefined, כי אף אחד לא קרא ולא ניתח את טקסט ה-JSON"]
    explain: "Express לא קוראת גופי בקשות אלא אם מוסיפים את ה-middleware שמנתח אותם."
  - q: "מגיעה בקשה לכתובת שאין לה נתיב. מה Express עושה?"
    options: ["היא עונה 404 עם 'Cannot GET /path' באופן אוטומטי", "היא מפילה את השרת", "היא עונה 200 עם דף ריק"]
---

בשיעור הקודם בניתם שרת עם המודול `http`. זה עבד, אבל כתבתם את הניתוב עם משפטי `if`, אספתם את גופי הבקשות חלק אחרי חלק וקבעתם כל כותרת ידנית. **Express** היא ספרייה קטנה שעושה את כל זה בשבילכם, והיא הדרך הנפוצה ביותר בהרבה לבנות שרתי אינטרנט ב-Node. עד סוף השיעור תוכלו ליצור נתיבים ששולחים טקסט, HTML ו-JSON.

## התקנה וטעינה של Express

Express אינה מובנית ב-Node; היא **חבילה** (package). במחשב שלכם מוסיפים אותה לפרויקט פעם אחת בעזרת מנהל החבילות:

```
npm init -y
npm install express
```

אחרי זה `require('express')` עובדת. בסביבת התרגול Express כבר זמינה, ולכן פשוט טוענים אותה עם require.

## אפליקציה והנתיבים שלה

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(3000, () => console.log('Listening on port 3000'));
```

- `express()` יוצרת **אפליקציה** (app): השרת שלכם, מוכן לנתיבים.
- `app.get(path, handler)` מוסיפה **נתיב** (route): "כשמגיעה בקשת GET לנתיב הזה, הריצו את הפונקציה הזאת". אותו דבר קיים לשיטות האחרות: `app.post`, `app.put`, `app.patch`, `app.delete`.
- ה-handler מקבל את `req` (הבקשה) ואת `res` (התשובה), כמו קודם, אבל עם הרבה תוספות.
- `app.listen(port, callback)` מפעילה את השרת, ופונקציית ה-callback רצה כשהוא מוכן. היא מחזירה את האובייקט `server`, ש-`close()` שלו עוצרת אותו.

השוו לשיעור 5: אין `req.method === 'GET' && req.url === '/'` ואין `res.writeHead`. Express מתאימה את הנתיב בשבילכם.

## שליחת תשובה

| שיטה | מה היא עושה |
| --- | --- |
| `res.send('text')` | שולחת טקסט או HTML (`Content-Type: text/html`) |
| `res.json(object)` | ממירה ל-JSON וקובעת `Content-Type: application/json` |
| `res.status(code)` | קובעת את קוד הסטטוס; משרשרים אותה: `res.status(201).json(...)` |
| `res.sendStatus(204)` | שולחת רק קוד סטטוס עם הטקסט הסטנדרטי שלו |
| `res.redirect('/other')` | אומרת ללקוח ללכת לכתובת אחרת |

```js
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express' });
});

app.post('/api/things', (req, res) => {
  res.status(201).json({ created: true });
});
```

כל נתיב חייב לשלוח בדיוק תשובה **אחת**. `res.send`, `res.json` ודומותיהן מסיימות את התשובה בשבילכם, כך שאין `res.end()` שאפשר לשכוח.

## קריאת גופי JSON

בבקשת POST הלקוח שולח נתונים בגוף. Express יכולה לנתח גופי JSON, אבל צריך להפעיל את זה בשורה אחת, **לפני** הנתיבים שלכם:

```js
app.use(express.json());
```

`app.use` רושמת **middleware**: פונקציה שרצה בכל בקשה לפני הנתיבים שלכם. `express.json()` מסתכלת על בקשות שנושאות JSON, מנתחת את הטקסט ומניחה את האובייקט ב-`req.body`. ל-middleware יהיה בקרוב שיעור משלו.

## נתיבים לא מוכרים

אם אף נתיב לא מתאים, Express שולחת בעצמה תשובת `404` (`Cannot GET /nothing`). אין צורך לכתוב אותה, אם כי בהמשך תחליפו אותה בשגיאת JSON משלכם.

> **שימו לב:**
> - **`req.body` הוא `undefined`.** שכחתם `app.use(express.json())`, או שמיקמתם אותה **אחרי** הנתיבים שצריכים אותה. Express מריצה דברים לפי הסדר שבו כתבתם אותם.
> - **`Cannot GET /path` בדפדפן.** אין נתיב לשיטה ולנתיב האלה. בדקו את האיות, את ה-`/` בהתחלה, ושהשיטה מתאימה (`app.post` עונה רק ל-POST).
> - **שליחת שתי תשובות.** קריאה כפולה ל-`res.send()` (למשל בתוך `if` ושוב מתחתיו) נכשלת עם `Error: Cannot set headers after they are sent to the client`. שימו `return` לפני `res.send` שאמורה לעצור את ה-handler.
> - **`res.send(404)`.** מספר אינו גוף. השתמשו ב-`res.sendStatus(404)` או ב-`res.status(404).send('Not found')`.
> - **הפורט כבר תפוס.** שני שרתים על אותו פורט נותנים `EADDRINUSE`. בסביבת התרגול סגרו כל שרת בסוף עם `server.close()`.

## להמשך

הוסיפו `app.get('/status', ...)` שעונה עם `res.status(200).json({ ok: true })` ואז קראו לו עם `fetch`. נסו את `res.sendStatus(204)` והסתכלו על `response.status`.

> **תורכם:** ב-`main.js` צרו את האפליקציה, הפעילו את `express.json()` והוסיפו את ארבעת הנתיבים (`/`, `/api/hello`, `/about` ו-`POST /api/echo`). הקוד שמתחת לנתיבים מפעיל את השרת וקורא לו, ולכן כשהכול נכון אמורות להופיע חמש שורות פלט.
