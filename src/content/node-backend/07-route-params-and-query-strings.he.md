---
title: "פרמטרים בנתיב ומחרוזות שאילתה"
summary: "קוראים נתונים מה-URL עם req.params (‏/books/2) ועם req.query (‏?sort=year), ממירים למספרים, ועונים 400 או 404 כשמשהו לא תקין."
hints:
  - "פרמטרים בנתיב נכתבים עם נקודתיים בנתיב ('/books/:id') ומגיעים ב-req.params כטקסט (req.params.id הוא המחרוזת '2'). גם ערכי מחרוזת השאילתה מגיעים ב-req.query כטקסט (req.query.limit הוא '3'). המירו עם Number(...) כשצריך מספר."
  - "עבור /books: let result = [...books]; ואז if (req.query.author) סננו, if (req.query.sort === 'year') sort((a, b) => a.year - b.year), if (req.query.limit) slice(0, Number(req.query.limit)). עבור /books/:id: const id = Number(req.params.id); השתמשו ב-Number.isInteger(id) כדי לזהות מזהה פגום, ואז ב-books.find(...) בשביל ה-404."
  - "app.get('/books/:id', (req, res) => { const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be a number' }); const book = books.find((b) => b.id === id); if (!book) return res.status(404).json({ error: 'Book not found' }); res.json(book); });"
messages:
  - "קראו את ערכי מחרוזת השאילתה מ-req.query."
  - "קראו את ה-id מ-req.params."
  - "הגדירו את הנתיב כ-app.get('/books/:id', ...)."
  - "הגדירו את הנתיב כ-app.get('/authors/:name', ...)."
  - "ה-id הוא טקסט. המירו אותו קודם למספר."
  - "ענו על id פגום עם סטטוס 400."
  - "ענו על ספר שלא קיים עם סטטוס 404."
quiz:
  - q: "לקוח מבקש GET /books/7. ב-app.get('/books/:id', ...), מהו req.params.id?"
    options: ["המספר 7", "הטקסט '7'", "undefined"]
    explain: "כל מה שמגיע מ-URL הוא טקסט. המירו אותו עם Number(req.params.id) לפני שמשווים אותו למזהים מספריים."
  - q: "איפה מוצאים את הערכים ב-URL‏ /books?author=Jane&limit=2?"
    options: ["req.params", "req.body", "req.query"]
  - q: "מתי פרמטר בנתיב הוא הבחירה הנכונה ומתי מחרוזת שאילתה?"
    options: ["פרמטרים מזהים דבר אחד (/books/2); מחרוזות שאילתה מסננות, ממיינות או מחלקות לעמודים רשימה (?sort=year)", "הם אותו דבר, השתמשו במה שנוח לכם", "מחרוזות שאילתה מיועדות רק לבקשות POST"]
  - q: "איזה קוד סטטוס מתאים לבקשה ל-/books/99 כשאין ספר כזה?"
    options: ["400", "404", "200"]
    explain: "404 אומר שהדבר שביקשתם לא נמצא. 400 מיועד לבקשה פגומה, כמו /books/abc."
---

ב-API אמיתיים יש הרבה כתובות כמו `/users/42`, `/books/7/reviews` או `/products?category=shoes&sort=price`. השרת צריך לקרוא את החלקים האלה ולהשתמש בהם. בשיעור הזה תלמדו על שני המקומות שבהם Express מוסרת לכם נתונים מה-URL: **פרמטרים בנתיב** (route parameters) ו**מחרוזת השאילתה** (query string).

## פרמטרים בנתיב: מזהים דבר אחד

כשחלק מהנתיב משתנה מבקשה לבקשה, מסמנים אותו עם נקודתיים. Express מתאימה את הנתיב ושומרת את החלק הזה ב-`req.params`:

```js
app.get('/books/:id', (req, res) => {
  res.send('You asked for book ' + req.params.id);
});
```

- `GET /books/2` -> `req.params.id` הוא `'2'`
- `GET /books/abc` -> `req.params.id` הוא `'abc'`

אפשר להגדיר כמה פרמטרים, והם יכולים להופיע גם באמצע נתיב:

```js
app.get('/authors/:author/books/:id', (req, res) => {
  const { author, id } = req.params;   // destructuring keeps it tidy
  res.json({ author, id });
});
```

פרמטרים הם **תמיד טקסט**, גם כשהם נראים כמו מספרים. המירו אותם לפני ההשוואה:

```js
const id = Number(req.params.id);   // '2' becomes 2, 'abc' becomes NaN
if (!Number.isInteger(id)) { /* not a whole number */ }
```

רווחים ותווים מיוחדים מגיעים מפוענחים: בקשה ל-`/authors/Jane%20Austen` נותנת `req.params.name === 'Jane Austen'`.

## מחרוזות שאילתה: סינון, מיון וחלוקה לעמודים

החלק ב-URL שאחרי `?` הוא **מחרוזת השאילתה**: רשימה של זוגות `key=value` מופרדים ב-`&`. Express מנתחת אותה לאובייקט `req.query`, כך שעבור `GET /books?author=Jane%20Austen&limit=2`:

```js
req.query.author  // 'Jane Austen'
req.query.limit   // '2'   (text again!)
req.query.sort    // undefined (not in the URL)
```

מפתח חסר נותן `undefined`, ולכן מסננים אופציונליים נכתבים בצורה "אם הוא קיים, החילו אותו":

```js
let result = [...books];                          // a copy, never change the original
if (req.query.author) {
  result = result.filter((b) => b.author === req.query.author);
}
if (req.query.limit) {
  result = result.slice(0, Number(req.query.limit));
}
```

הסדר חשוב. קודם מסננים, אחר כך ממיינים, ואת הרשימה חותכים עם `limit` בסוף, אחרת תגבילו את הספרים הלא נכונים.

## במה להשתמש?

| השתמשו בפרמטר בנתיב כש... | השתמשו במחרוזת שאילתה כש... |
| --- | --- |
| הוא מזהה משאב **אחד**: `/books/2` | הוא **מצמצם** רשימה: `/books?author=Jane` |
| הוא נדרש כדי שהנתיב יהיה הגיוני | הוא אופציונלי: `?sort=year`, `?limit=10`, `?page=2` |
| הוא חלק מהכתובת של המשאב | הוא משנה את האופן שבו הרשימה מוצגת |

## אומרים ללקוח מה השתבש

API טוב משתמש בקודי סטטוס כדי להבדיל בין שני כשלים:

- **400 Bad Request**: הבקשה עצמה פגומה (`/books/abc`, ה-id אינו מספר).
- **404 Not Found**: הבקשה תקינה אבל הדבר המבוקש לא קיים (`/books/99`).

לכל אחד צריכה להיות הודעת JSON ברורה, כמו `{ error: 'Book not found' }`. שימו לב ל-`return` שלפני `res.status(...).json(...)`: הוא עוצר את ה-handler כדי שהקוד שמתחתיו לא ירוץ ולא ינסה לענות פעם שנייה.

> **שימו לב:**
> - **משווים טקסט עם מספר.** `books.find((b) => b.id === req.params.id)` אף פעם לא מתאים, כי `2 === '2'` הוא `false`. המירו קודם עם `Number(...)`. זה הבאג מספר אחת ב-API של מתחילים.
> - **שוכחים `return` אחרי תשובה מוקדמת.** בלעדיו ה-handler ממשיך ו-Express מדווחת `Cannot set headers after they are sent to the client`.
> - **סדר הנתיבים.** Express מנסה נתיבים מלמעלה למטה. אם `/books/:id` מופיע לפני `/books/latest`, אז `latest` נחשב ל-id. שימו את הנתיב הספציפי יותר קודם.
> - **אותו מפתח פעמיים.** `?tag=a&tag=b` הופך את `req.query.tag` ל**מערך** (array) (`['a', 'b']`), בעוד `?tag=a` נותן מחרוזת. בדקו עם `Array.isArray` אם אתם מצפים לחזרות.
> - **קלט לא מהימן.** ערכי שאילתה מגיעים ממשתמשים. לעולם אל תניחו ש-`limit` הוא מספר הגיוני: `Number('abc')` הוא `NaN`, ולכן בדקו את הערך לפני השימוש בו.

## להמשך

הוסיפו `?q=text` ל-`/books` כדי להשאיר רק ספרים שהכותרת שלהם מכילה את הטקסט (השתמשו ב-`includes` אחרי `toLowerCase()`), וכן זוג `?page=2&pageSize=2`. ה-API לתרגול ממסלול ה-API‏ (`https://api.academy.test/users?_page=2&_limit=2`) עובד בדיוק כך, ועכשיו אתם יכולים לבנות כזה.

> **תורכם:** כתבו את שלושת הנתיבים ב-`main.js`: `GET /books` עם ערכי השאילתה האופציונליים `author`, `sort` ו-`limit` (סינון, אחר כך מיון, אחר כך הגבלה), `GET /books/:id` עם תשובות `400` ו-`404`, ו-`GET /authors/:name`. הקוד בתחתית קורא להם ומדפיס שבע שורות.
