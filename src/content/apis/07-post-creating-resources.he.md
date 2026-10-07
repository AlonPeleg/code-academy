---
title: "POST: יצירת משאבים עם גוף JSON"
summary: "שולחים JSON עם POST, קוראים את תשובת 201 Created ואת הכותרת Location שלה, ומטפלים בשגיאות אימות 422."
hints:
  - "ל-POST צריך שלושה דברים: method: 'POST', כותרת Content-Type: application/json, ו-body: JSON.stringify(object). נקודות קצה מוגנות צריכות גם את הכותרת Authorization עם ה-token מסוג Bearer."
  - "const res = await fetch(BASE + '/todos', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Learn fetch', userId: 1 }) });   Location: res.headers.get('Location')"
  - "const bad = await fetch(BASE + '/todos', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 123 }) }); const body = await bad.json(); for (const [field, message] of Object.entries(body.fields)) { console.log(field + ': ' + message); }"
quiz:
  - q: "POST שיוצר משהו הצליח. איזה סטטוס מתאים ביותר?"
    options: ["200 OK", "204 No Content", "201 Created"]
  - q: "בשביל מה הכותרת Location בתשובת 201?"
    options: ["כתובת ה-URL של הפריט החדש שנוצר", "המיקום הפיזי של השרת", "לאן לשלוח את ה-POST הבא"]
  - q: "השרת עונה 422 עם { fields: { title: 'must be a string' } }. מה זה אומר?"
    options: ["השרת למטה", "ה-JSON הובן, אבל ערך אחד או יותר אינם תקינים", "אתם לא מחוברים"]
    explain: "400 אומר שאפילו לא ניתן היה להבין את הבקשה (למשל JSON שבור); 422 אומר שהיא הובנה אבל נכשלה באימות."
  - q: "למה הגוף חייב להיות JSON.stringify(data) ולא האובייקט עצמו?"
    options: ["גוף בקשה חייב להיות טקסט (או בתים), ואובייקטים הופכים ל-'[object Object]'", "כי stringify מקטין אותו", "כי fetch לא יכולה לשלוח מספרים"]
messages:
  - "השתמשו ב-method: 'POST'."
  - "המירו את הגוף ל-JSON עם JSON.stringify."
  - "שלחו את הכותרת Authorization."
  - "עברו בלולאה על body.fields עם Object.entries."
  - "קראו את הכותרת Location עם res.headers.get('Location')."
---

`GET` רק קורא. כדי להוסיף משהו חדש לשרת, כמו משימה (todo), משתמש או פוסט, משתמשים ב-`POST`. זה קצת יותר עבודה מ-`GET`: שולחים **גוף** (body), חייבים לתייג אותו, וצריך להיות מוכנים לכך שהשרת יסרב לו.

## איך POST נראה

```
POST /todos HTTP/1.1
Host: api.academy.test
Authorization: Bearer token-ada
Content-Type: application/json

{"title":"Learn fetch","userId":1}
```

```
HTTP/1.1 201 Created
Location: https://api.academy.test/todos/11
Content-Type: application/json

{"id":11,"title":"Learn fetch","userId":1}
```

קראו את הבקשה מלמעלה למטה: השיטה והנתיב אומרים "צרו באוסף todos", `Authorization` מוכיחה שמותר לכם לכתוב, `Content-Type` מתייגת את הגוף כ-JSON, והגוף מחזיק את הנתונים של הפריט החדש. אף פעם לא שולחים `id`: ה**שרת** בוחר אותו.

התשובה משתמשת ב-`201 Created` (ולא ב-`200` רגיל), מחזירה את הפריט **כולל ה-id החדש שלו**, ואומרת לכם היכן הוא נמצא בכותרת `Location`.

## שלושת המרכיבים בקוד

```js
const res = await fetch(BASE + '/todos', {
  method: 'POST',                                          // 1. the method
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',                    // 2. label the body
  },
  body: JSON.stringify({ title: 'Learn fetch', userId: 1 }), // 3. the body, as text
});
const todo = await res.json();
console.log(todo.id); // prints: 11
```

ברירת המחדל של `fetch` היא `GET`, ולכן אם שוכחים `method: 'POST'` נשלח `GET` והגוף מתעלם בשקט (בדפדפנים זה אפילו זורק `TypeError: Request with GET/HEAD method cannot have body`).

## שגיאות אימות: 422

שרתים בודקים מה שולחים להם. אם משהו חסר או מהסוג הלא נכון, הם עונים `422 Unprocessable Entity` עם הסבר על כל בעיה:

```
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{"error":"Validation failed","fields":{"title":"must be a string","userId":"is required"}}
```

האובייקט (object) `fields` ממפה כל שדה פגום להודעה, כך שטופס יכול להציג את ההודעה ליד השדה הנכון. עברו עליו בלולאה (loop) עם `Object.entries`:

```js
for (const [field, message] of Object.entries(body.fields)) {
  console.log(field + ': ' + message);
}
```

השוו לשגיאות לקוח אחרות שאפשר לעורר:

| טעות | סטטוס |
| --- | --- |
| אין כותרת `Authorization` | `401` |
| `Content-Type` חסרה או שגויה | `415 Unsupported Media Type` |
| הגוף אינו JSON תקין (`{title:`) | `400 Bad Request` |
| JSON תקין אבל שדות חסרים או לא תקינים | `422` |

## בודקים, ואז סומכים על Location

לקוח טוב לא מניח שהצליח. אחרי `POST`:

1. בדקו את `res.ok` (או בדיוק `201`).
2. קראו את הפריט שנוצר מהגוף (עכשיו יש לו `id`).
3. השתמשו בכותרת `Location` או ב-`id` החדש כדי להביא אותו שוב אם צריך להוכיח שהוא נשמר: `await fetch(res.headers.get('Location'))`.

> **שימו לב:**
> - **שכחתם `Content-Type: application/json`.** השרת לא יכול לקרוא את הגוף ועונה `415` עם `Send JSON with the header Content-Type: application/json`.
> - **העברתם אובייקט כ-`body`.** `body: { title: 'x' }` שולח את הטקסט `[object Object]`, שהשרת דוחה כ-JSON לא תקין (`400`). תמיד עטפו אותו ב-`JSON.stringify`.
> - **שלחתם POST שוב בטעות.** `POST` אינו אידמפוטנטי: שליחה פעמיים יוצרת שני פריטים (שיעור 9 מסביר למה זה חשוב).
> - **התייחסתם ל-`422` כאל קריסה.** זו תשובה צפויה. קראו את `body.fields` והראו למשתמש מה לתקן.
> - **שלחתם את ה-`id` בעצמכם.** השרת בוחר אותו; כל `id` ששולחים כאן מתעלמים ממנו.

## להמשיך הלאה

צרו משתמש עם `POST /users` והגוף `{ name: 'Test', email: 'not-an-email' }`. אילו `fields` חוזרים? אחר כך תקנו את האימייל וקראו את הכותרת `Location`.

> **תורכם:** ההתחברות כתובה בשבילכם. צרו todo והדפיסו את הסטטוס, את `Location` ואת הגוף. אחר כך שלחו todo לא תקין והדפיסו כל שגיאת שדה, שלחו todo תקין בלי `Content-Type` כדי לראות את `415`, ולבסוף הביאו את ה-todo החדש דרך הכתובת `Location` שלו והדפיסו את המספר הכולל של ה-todos.
