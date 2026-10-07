---
title: "שלב 4: מתודות CRUD עבור משתמשים, משימות ופוסטים"
summary: "מוסיפים מחלקת Resource לשימוש חוזר, כדי שאפשר יהיה לכתוב client.users.get(1) ו-client.todos.list({ done: true })."
hints:
  - "למשתמשים, למשימות ולפוסטים יש אותה התנהגות, ולכן כתבו את חמש המתודות פעם אחת במחלקה Resource שמכירה את הלקוח שלה ואת הנתיב שלה (למשל \"/users\"). כל מתודה היא קריאה אחת ל-this.client.request(...)."
  - "get(id): GET path + \"/\" + id. create(data): POST path. update(id, changes): PATCH path + \"/\" + id. remove(id): DELETE path + \"/\" + id. ב-constructor של ApiClient כתבו this.users = new Resource(this, \"users\"), וכך גם עבור todos ו-posts."
  - "class Resource { constructor(client, name) { this.client = client; this.path = \"/\" + name; }  list(params) { const query = new URLSearchParams(params || {}).toString(); return this.client.request(\"GET\", this.path + (query ? \"?\" + query : \"\")); }  get(id) { return this.client.request(\"GET\", this.path + \"/\" + id); }  create(data) { return this.client.request(\"POST\", this.path, data); }  update(id, changes) { return this.client.request(\"PATCH\", this.path + \"/\" + id, changes); }  remove(id) { return this.client.request(\"DELETE\", this.path + \"/\" + id); } }"
messages:
  - "כתבו class Resource."
  - "בנו את מחרוזת השאילתה (query string) עם URLSearchParams."
  - "update() צריכה להשתמש בשיטת PATCH."
  - "remove() צריכה להשתמש בשיטת DELETE."
quiz:
  - q: "איזו שיטת HTTP מתאימה ל\"שינוי רק חלק מהשדות של משתמש 6\"?"
    options: ["PATCH", "POST", "GET"]
    explain: "PUT מחליפה את הרשומה כולה, PATCH משנה רק את מה שנשלח."
  - q: "מה ראשי התיבות CRUD מייצגים?"
    options: ["Connect, Request, Use, Disconnect", "Copy, Retry, Upload, Download", "Create, Read, Update, Delete"]
  - q: "עם מה client.users.remove(6) מתממש (resolve) כשהשרת עונה 204 No Content?"
    options: ["המשתמש שנמחק", "null, כי לתשובה אין גוף", "ApiError"]
---
הלקוח שלכם כבר יכול לשלוח כל בקשה. אבל אף אחד לא רוצה לכתוב `client.request("PATCH", "/users/6", {...})` כל היום. בשלב הזה תוסיפו שכבה ידידותית וקריאה: `client.users.get(1)`, `client.todos.list({ done: true })`.

## איפה אנחנו

`ApiClient` מתחבר, שולח את הטוקן אוטומטית וזורק `ApiError`. כל קריאה דורשת לכתוב ידנית את השיטה ואת הנתיב, וטעות הקלדה אחת בנתיב היא באג שקט.

## מה נוסיף, ולמה

שרת התרגול עוקב אחרי תבנית **REST** הנפוצה: כל סוג של דבר (משתמשים, משימות, פוסטים) חי בנתיב, ושיטת ה-HTTP אומרת מה לעשות איתו. זה נקרא **CRUD** (Create, Read, Update, Delete, כלומר יצירה, קריאה, עדכון ומחיקה):

| פעולה | שיטה ונתיב | שם המתודה שנוסיף |
| --- | --- | --- |
| רשימת הכול | `GET /users` | `list(params)` |
| קריאת אחד | `GET /users/3` | `get(id)` |
| יצירה | `POST /users` | `create(data)` |
| שינוי | `PATCH /users/3` | `update(id, changes)` |
| מחיקה | `DELETE /users/3` | `remove(id)` |

מכיוון שמשתמשים, משימות ופוסטים עובדים כולם באותה דרך, נכתוב את מתודות ה-CRUD **פעם אחת** במחלקה קטנה `Resource` ונייצר אחת לכל אוסף. זה הרעיון של DRY: Do not Repeat Yourself, כלומר אל תחזרו על עצמכם.

## מעבר מודרך

**1. משאב מכיר את הלקוח שלו ואת הנתיב שלו.**

```js
class Resource {
  constructor(client, name) {
    this.client = client;
    this.path = "/" + name;     // "/users"
  }
}
```

**2. המתודות מעבירות את העבודה ל-`request`.** כל אחת היא שורה אחת:

```js
get(id) {
  return this.client.request("GET", this.path + "/" + id);
}
create(data) {
  return this.client.request("POST", this.path, data);
}
```

הן מחזירות את ה-promise מ-`request`, ולכן הקוראים עדיין עושים להן `await`. עשו אותו דבר עבור `update` (השתמשו ב-`PATCH`: הוא משנה רק את השדות שנשלחו) ועבור `remove` (`DELETE`; השרת עונה `204 No Content`, ולכן מקבלים `null` בחזרה).

**3. רשימה עם מסננים.** השרת מסנן עם מחרוזות שאילתה (query strings): `/users?role=editor`. `URLSearchParams` בונה אחת מאובייקט ודואג לתווים מיוחדים:

```js
list(params) {
  const query = new URLSearchParams(params || {}).toString();
  return this.client.request("GET", this.path + (query ? "?" + query : ""));
}
```

`new URLSearchParams({ userId: 1, done: true }).toString()` נותן `"userId=1&done=true"`.

**4. תולים את המשאבים על הלקוח.** ב-constructor של `ApiClient`:

```js
this.users = new Resource(this, "users");
```

`this` כאן הוא הלקוח עצמו, ולכן כל משאב יכול לקרוא בחזרה אליו. עשו אותו דבר עבור `todos` ו-`posts`. שתי המחלקות חייבות להיכתב מעל קוד ההדגמה: אפשר להשתמש במחלקה רק אחרי שהשורה שמגדירה אותה רצה.

## ההדגמה

היא מציגה את העורכים, קוראת משתמש אחד, מסננת משימות לפי משתמש ומצב, מתחברת, ואז יוצרת, מעדכנת ומסירה משתמש, ומראה את שני הכשלים שקורא יכול לצפות להם אחר כך: `404` עבור משתמש שהוסר ו-`422 Validation failed` עבור נתונים שגויים, כאשר `error.details.fields` אומר איזה שדה שגוי.

> **שימו לב:**
> - כתיבה בלי להתחבר: `ApiError 401 Sign in first`.
> - `this.client.request` שגוי בתוך פונקציית callback (`function` רגילה מאבדת את `this`). השתמשו בפונקציות חץ או קראו ישר מהמתודה.
> - `PUT` מחליפה את הרשומה כולה ודורשת כל שדה; `PATCH` משנה רק את מה שנשלח. שימוש ב-`PUT` עם נתונים חלקיים נותן `422 name is required`.
> - שכחת `return`: אז `await client.users.get(1)` נותן `undefined`.
> - `ReferenceError: Cannot access 'Resource' before initialization` כשהמחלקה נכתבת מתחת לקוד שכבר משתמש בה.

> **תורכם:** הוסיפו את המחלקה `Resource` עם `list`, `get`, `create`, `update` (PATCH) ו-`remove`, וצרו משאבי `users`, `todos` ו-`posts` ב-constructor של `ApiClient`. ההדגמה המוגמרת חייבת להדפיס את שמונה השורות שמוצגות.
