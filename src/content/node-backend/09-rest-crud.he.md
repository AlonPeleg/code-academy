---
title: "REST API: יצירה, קריאה, עדכון ומחיקה"
summary: "בונים API מלא של פתקים בזיכרון עם השיטות הנכונות, קודי סטטוס (200, 201, 204, 400, 404) ואימות קלט."
hints:
  - "כל נתיב עוקב אחרי אותו מתכון: קוראים את הקלט (req.body, req.params.id), בודקים אותו (400 אם לא תקין, 404 אם הפתק לא קיים), משנים את מערך ה-notes ועונים עם הסטטוס הנכון. זכרו ש-req.params.id הוא מחרוזת, ולכן ממירים אותו עם Number()."
  - "POST: const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''; if (!title) return res.status(400).json({ error: 'title is required' });   DELETE: const index = notes.findIndex((n) => n.id === Number(req.params.id)); if (index === -1) return res.status(404)...; notes.splice(index, 1); res.status(204).end();"
  - "app.post('/notes', (req, res) => { const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''; if (!title) return res.status(400).json({ error: 'title is required' }); const note = { id: nextId++, title, done: false }; notes.push(note); res.status(201).set('Location', '/notes/' + note.id).json(note); });"
messages:
  - "הוסיפו נתיב POST /notes עם app.post."
  - "הוסיפו נתיב PATCH /notes/:id עם app.patch."
  - "הוסיפו נתיב DELETE /notes/:id עם app.delete."
  - "POST מוצלח עונה 201 Created."
  - "DELETE מוצלח עונה 204 No Content."
quiz:
  - q: "איזה קוד סטטוס צריך להחזיר POST מוצלח שיוצר משהו?"
    options: ["200 OK", "201 Created", "204 No Content"]
    explain: "201 אומר שמשאב חדש קיים עכשיו; הכותרת Location אומרת ללקוח איפה."
  - q: "למה note.id === req.params.id כמעט תמיד שקר (false)?"
    options: ["ערכי req.params הם תמיד מחרוזות, ולכן צריך להמיר עם Number()", "Express מסתירה את ה-id", "צריך להשוות מזהים עם =="]
  - q: "לקוח שולח גוף בלי title. איזו תשובה היא הטובה ביותר?"
    options: ["500 Internal Server Error", "404 Not Found", "400 Bad Request עם הודעת שגיאה ברורה"]
    explain: "400 אומר שהלקוח טעה ויכול לתקן. 500 אומר שהשרת התקלקל, וזה היה שקר."
  - q: "מה ההבדל בין PUT ל-PATCH?"
    options: ["PUT מוחק, PATCH יוצר", "PUT מחליף את כל המשאב, PATCH משנה רק את השדות שנשלחו", "אין הבדל"]
---

בשיעור הזה תבנו את מה שרוב משרות ה-backend מורכבות ממנו: API שיכול ליצור (**C**reate), לקרוא (**R**ead), לעדכן (**U**pdate) ולמחוק (**D**elete) דברים. ארבעת הפעלים האלה נקראים CRUD. אם סיימתם את מסלול ה-APIs אתם כבר מכירים את צד הלקוח (קראתם ל-API של מישהו אחר); עכשיו אתם אלה שכותבים את השרת.

## משאבים, שיטות וקודי סטטוס

REST היא מוסכמה למתן שמות לדברים. **משאב** (resource) הוא שם עצם (`notes`), **URL** מצביע עליו, וה**שיטה** (method) של HTTP אומרת מה לעשות:

| שיטה ו-URL | משמעות | סטטוס הצלחה |
| --- | --- | --- |
| `GET /notes` | רשימת כל הפתקים | `200 OK` |
| `GET /notes/3` | קריאת פתק אחד | `200 OK` |
| `POST /notes` | יצירת פתק | `201 Created` |
| `PATCH /notes/3` | שינוי חלק מהשדות | `200 OK` |
| `PUT /notes/3` | החלפת הפתק כולו | `200 OK` |
| `DELETE /notes/3` | הסרת הפתק | `204 No Content` |

ה-URL נותן שם לדבר, והשיטה היא הפועל. לכן `POST /createNote` ו-`GET /deleteNote?id=3` אינם RESTful. טעויות משתמשות במשפחת `4xx`: `400` קלט לא תקין, `404` אין דבר כזה. באג בקוד שלכם הוא `500`.

## קריאת קלט ב-Express

שלושה מקומות מעבירים נתונים ל-handler:

```js
app.patch('/notes/:id', (req, res) => {
  req.params.id;   // "3"  (from the URL, always a string)
  req.query.sort;  // from ?sort=title
  req.body;        // the parsed JSON (needs app.use(express.json()))
});
```

המירו את ה-id בעצמכם: `Number(req.params.id)`. אחר כך חפשו את הפתק בנתונים שלכם. הנתונים כאן הם מערך רגיל שחי בזיכרון, ולכן הוא מתאפס בכל פעם שהתוכנית מתחילה מחדש; שיעור 13 מתקן את זה על ידי שמירה לקובץ.

## לעולם אל תסמכו על הלקוח

כל מה שב-`req.body` מגיע מהעולם החיצון ויכול להיות חסר, ריק או מהסוג הלא נכון. אמתו אותו (validate) לפני שאתם משתמשים בו, ועננו `400` עם הודעה שהלקוח יכול לפעול לפיה:

```js
const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
if (!title) return res.status(400).json({ error: 'title is required' });
```

`typeof` נחוץ כי `req.body.title.trim()` היה קורס עבור מספר. חיתוך הרווחים (trim) מסיר אותם, כך ש-`"   "` נחשב ריק.

## יצירה, עדכון, מחיקה

יצירה: בונים את האובייקט בשרת (השרת בוחר את ה-`id`, אף פעם לא הלקוח), שומרים אותו ועונים `201` עם האובייקט החדש. כותרת `Location` עם ה-URL שלו היא נימוס טוב:

```js
res.status(201).set('Location', '/notes/' + note.id).json(note);
```

עדכון: מוצאים את האובייקט (`404` אם הוא לא קיים), מעתיקים את השדות שנשלחו, ועונים עם האובייקט המעודכן.

מחיקה: מסירים אותו ועונים `204`. `204` אומר "בוצע, ואין מה להחזיר", ולכן משתמשים ב-`res.status(204).end()` בלי גוף. מחיקה של משהו שכבר איננו היא `404` ב-API הזה (יש APIs שעונים שוב `204`, וגם זה תקין; רק היו עקביים).

> **שימו לב:**
> - **השוואת מספר למחרוזת.** `notes.find(n => n.id === req.params.id)` לא מוצא כלום כי `3 !== "3"`. תחזירו בטעות `404` לכול.
> - **שכחת `express.json()`.** אז `req.body` הוא `undefined` ואתם רואים `TypeError: Cannot read properties of undefined (reading 'title')`.
> - **שליחת גוף עם `204`.** לקוחות מתעלמים ממנו. השתמשו ב-`.end()`.
> - **שכחת `return` אחרי תשובת שגיאה.** בלי `return res.status(404)...` ה-handler ממשיך וקורס עם `Cannot set headers after they are sent to the client`.

## להתקדם הלאה

הוסיפו `PUT /notes/:id` שמחליף את הפתק ודורש גם `title` וגם `done`. הוסיפו מסנן `?done=true` ל-`GET /notes` בעזרת `req.query`. שימו לב כמה מעט שורות כל נתיב צריך ברגע שהתבנית ברורה.

> **תורכם:** ממשו את `POST /notes` (אימות ה-title, `201` עם כותרת `Location`), את `PATCH /notes/:id` ואת `DELETE /notes/:id` (`404` כשחסר, `204` בהצלחה). לקוח הבדיקה מדפיס שורה אחת לכל בקשה.
