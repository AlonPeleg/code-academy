---
title: "בדיקת API של Express"
summary: "כותבים בדיקות אינטגרציה שמפעילות שרת אמיתי, שולחות בקשות HTTP עם fetch ובודקות קודי סטטוס וגופי JSON."
hints:
  - "הבדיקות כבר כתובות: קראו את אלה שנכשלות כדי לראות איזה קוד סטטוס ואיזה גוף JSON כל נתיב (route) צריך לשלוח. res.status(404).json({ ... }) קובעת את הסטטוס ושולחת JSON בבת אחת."
  - "GET /todos/:id: const todo = todos.find((t) => t.id === Number(req.params.id)); if (!todo) return res.status(404).json({ error: \"Todo not found\" }); res.json(todo);   POST: קראו את req.body.title ובדקו אותו עם typeof ו-trim()."
  - "const title = req.body && req.body.title; if (typeof title !== \"string\" || title.trim() === \"\") return res.status(400).json({ error: \"title is required\" }); const todo = { id: nextId++, title: title.trim(), done: false }; todos.push(todo); res.status(201).json(todo);"
messages:
  - "ענו 404 עם res.status(404).json(...) כשה-todo לא קיים."
  - "ענו 201 עבור todo שנוצר."
  - "ענו 400 כשהכותרת חסרה."
quiz:
  - q: "מה ההבדל בין בדיקת יחידה לבדיקת אינטגרציה?"
    options: ["בדיקת יחידה בודקת חלק קטן אחד בבידוד, בדיקת אינטגרציה בודקת כמה חלקים שעובדים יחד (כאן: נתיבים, פענוח JSON ו-HTTP)", "בדיקות יחידה איטיות יותר", "אין הבדל"]
  - q: "למה createApp() בונה אפליקציה חדשה לכל בדיקה במקום לייצא אפליקציה משותפת אחת?"
    options: ["כדי שבאמת Express תהיה מהירה יותר", "כדי שנתונים שנוצרו בבדיקה אחת (כמו todo חדש) לא ידלפו לבדיקה הבאה", "כי Express אוסרת לשתף אפליקציה"]
  - q: "מה עושה app.listen(0)?"
    options: ["עוצרת את השרת", "מפעילה את השרת על כל פורט פנוי, שאפשר לקרוא מ-server.address().port", "מפעילה את השרת על פורט 0 רק אם הוא פנוי, ואחרת נכשלת"]
    explain: "פורט 0 אומר 'בחר פורט פנוי'. פורטים קבועים כמו 3000 גורמים לבדיקות להיכשל כשמשהו אחר כבר משתמש בפורט הזה."
  - q: "למה הבדיקה חייבת לסגור את השרת ב-afterEach?"
    options: ["זה גורם לבדיקות להדפיס יותר", "זה מאפס את ה-todos", "אחרת השרת ממשיך לרוץ, התוכנית אף פעם לא מסתיימת ופורטים מצטברים"]
---
בדיקות יחידה בודקות פונקציה אחת בכל פעם. אבל API לאינטרנט הוא יותר מפונקציות: הוא נתיבים (routes), פענוח JSON, קודי סטטוס וכותרות (headers) שעובדים יחד. כדי לבדוק את זה כותבים **בדיקות אינטגרציה** (integration tests): מפעילים את האפליקציה האמיתית, שולחים לה בקשות HTTP אמיתיות ובודקים את התשובות, בדיוק כמו לקוח (client). זו הבדיקה בעלת הערך הגבוה ביותר לצד השרת (backend), והיא קלה להפתיע.

## הרעיון

1. בונים את האפליקציה (`createApp()`).
2. מפעילים אותה עם `app.listen(...)`. הפונקציה מחזירה את אובייקט השרת.
3. שולחים בקשות עם `fetch("http://localhost:PORT/path")`.
4. בודקים את **קוד הסטטוס** ואת **גוף ה-JSON** עם `expect`.
5. סוגרים את השרת.

באזור התרגול הזה השרת וה-`fetch` רצים באותה תוכנית, ולכן אין צורך ברשת אמיתית. במחשב שלכם זה עובד באותה צורה עם sockets אמיתיים (ולעיתים קרובות משתמשים בספרייה שנקראת `supertest` כדי לקצר). פתחו את המדריך "Setup" (ההתקנה) כדי להריץ Node על המחשב שלכם.

## הופכים את האפליקציה לניתנת לבדיקה

שימו את **יצירת** האפליקציה בתוך פונקציה, ואל תתחילו להאזין בתוכה:

```js
function createApp() {
  const app = express();
  app.use(express.json());
  // routes ...
  return app;
}
module.exports = { createApp };
```

קובץ ייצור (נניח `server.js`) קורא ל-`createApp().listen(3000)`. הבדיקות קוראות ל-`createApp()` בכל בדיקה ומפעילות את השרת על **פורט פנוי** עם `listen(0)`. מכיוון שהנתונים נמצאים *בתוך* `createApp`, כל בדיקה מקבלת אפליקציה חדשה וצפויה. זה אותו רעיון כמו הזרקת mock, רק על שרת שלם.

## מפעילים ועוצרים את השרת ב-hooks

```js
let server, baseUrl;

beforeEach(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);   // resolve is called when the server is ready
  });
  baseUrl = `http://localhost:${server.address().port}`;
});

afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
});
```

`listen` ו-`close` משתמשות ב**פונקציות callback**, ולכן עוטפים אותן ב-promise כדי שאפשר יהיה לעשות להן `await` (ראיתם את תבנית העטיפה הזאת בשיעורים על קוד אסינכרוני). `server.address().port` מגלה לנו איזה פורט פנוי המערכת בחרה.

## פונקציית עזר לבקשות

```js
async function request(path, options) {
  const response = await fetch(baseUrl + path, options);
  return { status: response.status, body: await response.json() };
}
```

אחר כך כל בדיקה נעשית קצרה וקריאה:

```js
it("answers 404 for a todo that does not exist", async () => {
  const { status, body } = await request("/todos/99");
  expect(status).toBe(404);
  expect(body).toEqual({ error: "Todo not found" });
});
```

עבור POST שולחים JSON כך:

```js
await request("/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Learn Express" }),
});
```

## מה בודקים ב-API

* **המסלול השמח:** קלט נכון נותן סטטוס `200` או `201` ואת ה-JSON הנכון.
* **לא נמצא:** מזהה (id) לא מוכר נותן `404`.
* **קלט שגוי:** שדה חסר או לא תקין נותן `400` (או `422`), עם הודעה מועילה.
* **תופעות לוואי:** אחרי POST, בקשת GET מציגה את הפריט החדש.
* בהמשך גם: אימות (`401`/`403`), וכותרות.

בדקו את קוד הסטטוס **וגם** את הגוף. נתיב שעונה `200` עם הודעת שגיאה בגוף הוא באג, ובדיקה שקוראת רק את הגוף תפספס אותו.

> **שימו לב:**
> * **handler שאף פעם לא עונה.** אם נתיב שוכח `res.json(...)`, הבקשה נתקעת והבדיקה מחכה עד מגבלת הזמן. תמיד סיימו כל מסלול בקוד בתשובה.
> * **שוכחים `express.json()`.** בלי השורה הזאת `req.body` הוא `undefined`, ו-`req.body.title` זורקת `TypeError`. הלקוח מקבל `500` במקום ה-`400` שלכם.
> * **`SyntaxError: Unexpected token ... is not valid JSON`.** הבדיקה קראה ל-`response.json()`, אבל השרת ענה בטקסט רגיל או ב-HTML (למשל הטקסט `Not Implemented` או דף `Cannot GET /x`). בדקו את נתיב ה-route ושהוא שולח JSON.
> * **מצב משותף בין בדיקות.** אם הנתונים נמצאים בראש הקובץ, הבדיקה "creates a todo" משנה את מה שהבדיקה "lists the todos" רואה. בנו נתונים חדשים לכל בדיקה.
> * **לא סוגרים את השרת.** שרתים פתוחים משאירים את התוכנית (או את הרצת הבדיקות הבאה) עסוקה. תמיד סגרו ב-`afterEach` או ב-`afterAll`.
> * **`return` אחרי השליחה.** כתיבת `res.status(404).json(...)` בלי `return` מאפשרת לקוד להמשיך ולנסות לשלוח תשובה שנייה. השתמשו ב-`return res.status(404).json(...)`.

> **תורכם:** הבדיקות ב-`todos.test.js` גמורות. ב-`app.js` שני הנתיבים `GET /todos/:id` ו-`POST /todos` עונים `501 Not Implemented`. מַמשו אותם כפי שההערות אומרות (404 עם `{ error: "Todo not found" }`, ‏400 עם `{ error: "title is required" }`, ‏201 עם ה-todo החדש) עד שכל 5 הבדיקות עוברות.
