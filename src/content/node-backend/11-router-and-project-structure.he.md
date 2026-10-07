---
title: "Router ומבנה פרויקט"
summary: "מפצלים API שגדל לקבצים בעזרת express.Router, שכבת services ומודול app שאפשר להפעיל או לבדוק בנפרד."
hints:
  - "Router הוא אפליקציה קטנה: יש לו get/post/use והוא מיוצא עם module.exports. האפליקציה הראשית מחברת אותו עם app.use('/prefix', router). בתוך ה-router הנתיבים יחסיים לתחילית (prefix), ולכן נתיב הרשימה הוא פשוט '/'."
  - "routes/todos.js: const express = require('express'); const router = express.Router(); router.get('/', (req, res) => res.json(todoService.list())); ... module.exports = router;   app.js: app.use('/api/todos', todosRouter);"
  - "router.get('/:id', (req, res) => { const todo = todoService.get(req.params.id); if (!todo) return res.status(404).json({ error: 'Todo not found' }); res.json(todo); });   router.post('/', (req, res) => { const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''; if (!title) return res.status(400).json({ error: 'title is required' }); res.status(201).json(todoService.create(title)); });"
messages:
  - "צרו את ה-router ב-routes/todos.js עם express.Router()."
  - "ייצאו את ה-router עם module.exports."
  - "ב-app.js חברו את ה-router עם app.use('/api/todos', todosRouter)."
quiz:
  - q: "ל-router יש router.get('/:id', ...) והוא מחובר עם app.use('/api/todos', router). איזו כתובת מגיעה לנתיב הזה?"
    options: ["GET /api/todos/:id/5", "GET /:id", "GET /api/todos/5"]
    explain: "תחילית החיבור ונתיב ה-route מחוברים: /api/todos ועוד /5."
  - q: "למה app.js מייצא את ה-app במקום לקרוא ל-app.listen בעצמו?"
    options: ["כי listen עובד רק בקובץ נפרד", "כדי ש-server.js יוכל להפעיל את האפליקציה, או שבדיקות יוכלו לייבא אותה, בלי לפתוח פורט מיד", "כדי שהקוד ירוץ מהר יותר"]
  - q: "מה שייך בקובץ service כמו todoService.js?"
    options: ["פונקציות רגילות עם הנתונים וכללי העסק, שלא יודעות כלום על HTTP", "קריאת req.body ושליחת res.json", "הקריאה ל-app.listen"]
    explain: "אם שומרים את פרטי ה-HTTP (קודי סטטוס, req, res) בנתיבים ואת הכללים ב-services, קל לשנות ולבדוק את שניהם."
  - q: "מה רואים אם שוכחים module.exports = router בקובץ routes/todos.js ומחברים אותו?"
    options: ["זה עובד בכל זאת", "שגיאה כמו: app.use() requires a middleware function", "הנתיבים עונים 200 עם גוף ריק"]
---

קובץ `main.js` יחיד עם ארבעים נתיבים הופך מהר לכאב ראש. פרויקטים אמיתיים מפצלים את הקוד לקבצים קטנים, לכל אחד תפקיד אחד. בשיעור הזה תלמדו את הכלי של Express לכך, ה-**Router**, ומבנה תיקיות פשוט שמתאים מצעצוע ועד אפליקציה אמיתית.

## ה-Router: אפליקציה קטנה

`express.Router()` יוצרת אובייקט שמתנהג כמו `app` (יש לו `get`, `post`, `use`...) אבל אינו שרת בפני עצמו. ממלאים אותו בנתיבים ואז מחברים אותו לאפליקציה האמיתית תחת **תחילית** (prefix):

```js
// routes/todos.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json([]));        // answers GET /api/todos
router.get('/:id', (req, res) => res.json({}));     // answers GET /api/todos/5

module.exports = router;
```

```js
// app.js
const todosRouter = require('./routes/todos');
app.use('/api/todos', todosRouter);
```

בתוך ה-router הנתיבים **יחסיים**: כותבים `'/'` ו-`'/:id'`, והתחילית `/api/todos` באה מ-`app.use`. משנים את התחילית במקום אחד וכל הנתיבים זזים איתה. Express מסירה את התחילית לפני שה-router רואה את ה-URL, כך שה-router אף פעם לא צריך לדעת איפה הוא מחובר.

ל-routers יכול להיות גם middleware משלהם (`router.use(requireLogin)` מגן רק על אותו router) ואפשר לקנן אותם. אם router מקונן צריך פרמטר של ההורה שלו, כמו `/users/:userId/todos`, צרו אותו עם `express.Router({ mergeParams: true })`.

## מבנה תיקיות שעובד

```
project/
  server.js            starts the server (listen)
  app.js               builds the app: middleware, routers, error handlers
  routes/              one router per resource: todos.js, users.js...
  services/            business logic and data access: todoService.js
  middleware/          your own middleware: auth.js, logger.js
```

הרעיון הוא **הפרדת תחומי אחריות** (separation of concerns):

- **נתיב** (route) מדבר HTTP: הוא קורא את `req`, בוחר את קוד הסטטוס וקורא ל-`res.json`.
- **שירות** (service) מדבר בשפת התחום שלכם: "צור משימה", "מצא משתמש". הוא בנוי מפונקציות רגילות שלא מכירות את `req` או את `res`.
- **app.js** מחבר הכול יחד; **server.js** רק פותח את הפורט.

צוותים רבים מוסיפים תיקיית **controllers** בין routes ל-services (קובץ ה-route רק מפרט כתובות, ופונקציות ה-controller מטפלות בהן). ב-API קטן קובץ ה-route יכול לעשות את שניהם; אפשר להכניס controllers כשהמקום נעשה צפוף.

## למה app.js ו-server.js נפרדים

`app.js` מסתיים ב-`module.exports = app` ולעולם לא קורא ל-`listen`. זה אומר שבדיקה יכולה לעשות `require('./app')` ולהפעיל אותו על כל פורט שהיא רוצה, בעוד ש-`server.js` מפעיל אותו באמת. תעריכו את זה בפעם הראשונה שתכתבו בדיקות ל-API.

## נתיבי require

`require('./routes/todos')` מתחיל ב-`./` (יחסית לקובץ הנוכחי). מתוך `routes/todos.js`, ה-service נמצא תיקייה אחת למעלה: `require('../services/todoService')`. מודולים מובנים ומודולי npm (`express`, `fs`) אין להם נקודה בהתחלה.

> **שימו לב:**
> - **חזרה על התחילית בתוך ה-router.** אם כותבים `router.get('/api/todos/:id')` וגם מחברים ב-`/api/todos`, ה-URL האמיתי הופך ל-`/api/todos/api/todos/5`. השאירו את נתיבי ה-router יחסיים.
> - **שכחת `module.exports = router`.** הקובץ מייצא אובייקט ריק ו-`app.use` נכשל עם `TypeError: app.use() requires a middleware function`.
> - **נתיב יחסי שגוי.** `require('./services/todoService')` מתוך `routes/` נותן `Cannot find module`. ספרו את התיקיות: צריך `../`.
> - **חיבור אחרי ה-handler של 404.** הסדר עדיין קובע: חברו routers לפני ה-catch-all וה-error handlers.

## להתקדם הלאה

הוסיפו router בקובץ `routes/users.js` עם `userService.js` משלו וחברו אותו ב-`/api/users`. אחר כך העבירו את ה-handler של 404 ל-`middleware/notFound.js` וטענו אותו עם `require` ב-`app.js`.

> **תורכם:** כתבו את `routes/todos.js` (router עם `GET /`, `GET /:id` ו-`POST /`, שמשתמש ב-service) וחברו אותו ב-`app.js` ב-`/api/todos`. כל השאר כבר כתוב; `server.js` קורא ל-API שלכם ומדפיס את התשובות.
