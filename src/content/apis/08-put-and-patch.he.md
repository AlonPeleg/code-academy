---
title: "PUT ו-PATCH: עדכון"
summary: "מחליפים משאב שלם עם PUT, משנים רק כמה שדות עם PATCH, ורואים למה ההבדל חשוב."
hints:
  - "PUT שולח תחליף שלם: כל מה שהשארתם בחוץ נעלם. PATCH שולח רק את השדות שרוצים לשנות; כל השאר נשאר. הפונקציה send(method, path, body) כבר עושה בשבילכם את ה-fetch."
  - "const res = await send('PUT', '/users/3', { name: 'Alan M. Turing', email: 'alan@example.com' }); const user = await res.json(); console.log('PUT: ' + JSON.stringify(user));   לעדכון חלקי השתמשו ב-send('PATCH', '/users/5', { city: 'Helsinki' })."
  - "const bad = await send('PUT', '/users/2', { name: 'Only a name' }); const badBody = await bad.json(); console.log('incomplete PUT: ' + bad.status + ' email ' + badBody.fields.email);   const t = await (await send('PATCH', '/todos/2', { done: true })).json();"
quiz:
  - q: "אתם שולחים PUT של משתמש עם name ו-email בלבד. מה קורה ל-role ול-city ששמורים מקודם?"
    options: ["הם נשארים ללא שינוי", "הם נמחקים, כי PUT מחליף את המשאב כולו", "השרת מבקש אותם מכם"]
  - q: "אתם רוצים לסמן todo כבוצע ולא לשנות שום דבר אחר. איזו שיטה מתאימה ביותר?"
    options: ["PATCH עם { done: true }", "POST עם ה-todo כולו", "PUT עם { done: true }"]
  - q: "PUT /users/2 עם { name: 'X' } ובלי email מחזיר 422. למה?"
    options: ["PUT אסור על users", "החלפה מלאה חייבת להכיל את כל השדות הנדרשים, ו-email הוא שדה נדרש", "ה-id היה שגוי"]
  - q: "איזו טענה על PUT נכונה?"
    options: ["חזרה על אותו PUT נותנת אותו מצב סופי", "כל PUT יוצר פריט חדש", "PUT אף פעם לא צריך גוף"]
    explain: "החלפה של משהו באותם נתונים פעמיים משאירה אותו באותו מצב, ולכן PUT נקרא אידמפוטנטי."
messages:
  - "השתמשו ב-send('PUT', ...) כדי להחליף."
  - "השתמשו ב-send('PATCH', ...) לעדכונים חלקיים."
  - "הציגו את המפתחות של התשובה עם Object.keys."
---

אחרי שמשהו קיים, תרצו לשנות אותו: לתקן שגיאת כתיב, לסמן todo, לשנות שם למשתמש. HTTP נותן שני פעלים לזה, `PUT` ו-`PATCH`, ובלבול ביניהם הוא דרך קלאסית לאבד נתונים.

## PUT: מחליפים את כל הפריט

`PUT /users/3` פירושו "**כך** משתמש 3 צריך להיראות עכשיו". שולחים תיאור שלם, והשרת מחליף את הפריט הישן בו:

```
PUT /users/3 HTTP/1.1
Authorization: Bearer token-ada
Content-Type: application/json

{"name":"Alan M. Turing","email":"alan@example.com"}
```

לפני הקריאה, משתמש 3 היה `{ id: 3, name: "Alan Turing", email: "alan@example.com", role: "viewer", city: "London" }`. אחריה:

```
HTTP/1.1 200 OK

{"id":3,"name":"Alan M. Turing","email":"alan@example.com"}
```

`role` ו-`city` **נעלמו**, כי לא שלחתם אותם. זה לא באג; זה בדיוק מה ש"החלפה" אומרת. ה-`id` נשאר, כי הוא בא מה-URL.

## PATCH: משנים רק את מה שנשלח

`PATCH /users/5` פירושו "**החילו את השינויים האלה** על משתמש 5":

```
PATCH /users/5 HTTP/1.1
Authorization: Bearer token-ada
Content-Type: application/json

{"city":"Helsinki"}
```

השרת ממזג את השדות שלכם לתוך הפריט הקיים, ולכן כל השאר שורד:

```
{"id":5,"name":"Linus Torvalds","email":"linus@example.com","role":"viewer","city":"Helsinki"}
```

| | PUT | PATCH |
| --- | --- | --- |
| משמעות | מחליף את הפריט כולו | משנה כמה שדות |
| גוף | כל השדות הנדרשים | רק השדות לשינוי |
| שדות שהושמטו | מוסרים | נשמרים |
| שימוש אופייני | שמירת טופס עריכה מלא | סימון תיבת סימון, שינוי שם |
| שדה נדרש חסר | `422` | בסדר |

## בקוד

עם אותן אפשרויות כמו ב-`POST`, רק השיטה משתנה:

```js
const res = await fetch(BASE + '/users/5', {
  method: 'PATCH',
  headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({ city: 'Helsinki' }),
});
const user = await res.json();
console.log(user.city); // prints: Helsinki
```

מכיוון שכל בקשות הכתיבה שלכם ייראו דומה, הקוד ההתחלתי מגדיר פונקציית עזר קטנה `send(method, path, body)` שבונה את האפשרויות. כתיבת פונקציית עזר כזו היא הצעד הראשון ללקוח לשימוש חוזר שתבנו בשיעור 10.

## האימות עדיין חל

שתי השיטות מאמתות את הערכים שהן מקבלות:

- `PUT` חייב לספק כל שדה נדרש. `PUT /users/2` עם שם בלבד מחזיר `422` ו-`{ "fields": { "email": "is required" } }`.
- `PATCH` יכול להשמיט שדות, אבל כל שדה ש**כן** שולחים חייב להיות תקין. `PATCH /users/2` עם `{ "role": "boss" }` מחזיר `422` ו-`must be admin, editor or viewer`.
- עדכון של משהו שלא קיים נותן `404` (למשל `PUT /users/99`).

## באיזו שיטה להשתמש?

אם המשתמש ערך טופס שלם, בצעו `PUT` של הפריט כולו. אם הוא הפך מתג אחד, בצעו `PATCH` של השדה האחד הזה: זה שולח פחות נתונים ולא יכול למחוק בטעות שדות שלא ידעתם שקיימים. שליחת אובייקט (object) מלא עם `PATCH` גם עובדת; היא פשוט ממזגת כל שדה.

שימו לב שעדכון מוצלח כאן מחזיר `200` עם המצב **החדש** של הפריט, ולכן לעיתים קרובות אין צורך ב-`GET` נוסף.

> **שימו לב:**
> - **שימוש ב-`PUT` לשינוי של שדה אחד.** כל מה שהשארתם בחוץ נעלם: באג "המשתמש שלי איבד את העיר שלו" הקלאסי. השתמשו ב-`PATCH` במקום.
> - **שכחתם `Content-Type: application/json`.** אז השרת עונה `415 Send JSON with the header Content-Type: application/json`.
> - **שכחתם את ה-id ב-URL.** `PUT /users` (בלי id) נדחה עם `405 Method PUT is not allowed here`, כי אי אפשר להחליף אוסף שלם.
> - **הנחתם ש-`PATCH` של שדה רשימה ממזג אותו.** שדה כמו `tags` מוחלף כערך; סמנטיקה של "הוספה" דורשת תכנון ייעודי.
> - **לא בדקתם `res.ok`.** תשובת `422` או `404` נראית כמו JSON רגיל, אבל היא מתארת את השגיאה, לא את הפריט המעודכן.

## להמשיך הלאה

נסו `PATCH /todos/2` עם `{ "done": "yes" }` וקראו את הודעת ה-`422`. אחר כך `PUT /todos/2` עם `{ "title": "Rewritten", "userId": 1 }` ובדקו ש-`done` חסר בתשובה.

> **תורכם:** השתמשו בפונקציית העזר `send` כדי להחליף את משתמש 3 עם `PUT` ולהציג את המפתחות שנשארו, שנו רק את העיר של משתמש 5 עם `PATCH`, עוררו את ה-`422` של `PUT` לא שלם, וסמנו את todo 2 כבוצע עם `PATCH` תוך שמירה על הכותרת שלו.
