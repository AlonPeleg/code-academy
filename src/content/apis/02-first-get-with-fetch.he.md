---
title: "בקשת ה-GET הראשונה שלכם עם fetch"
summary: "שלפו רשימה ופריט בודד, קראו את res.status, פענחו JSON ועברו על התוצאות בלולאה בעזרת async/await."
hints:
  - "כל בקשה צריכה שני await: אחד עבור fetch (התגובה מגיעה) ואחד עבור res.json() (הגוף מפוענח). אחר כך התוצאה היא מערך רגיל של JavaScript שאפשר לעבור עליו בלולאה."
  - "const res = await fetch(BASE + '/users'); const users = await res.json(); console.log(users.length + ' users'); for (const user of users) { ... }  עבור המשתמש הבודד, שלפו את BASE + '/users/3' באותה דרך."
  - "for (const u of users) { console.log(u.id + ': ' + u.name + ' (' + u.role + ')'); }  const res3 = await fetch(BASE + '/users/3'); const alan = await res3.json(); console.log(alan.name + ' lives in ' + alan.city);"
quiz:
  - q: "מה עושה await לפני fetch(url)?"
    options: ["הוא משהה את הפונקציה הזו עד שהשרת עונה", "הוא גורם לבקשה להיות מהירה יותר", "הוא ממיר את התגובה ל-JSON"]
  - q: "כתבתם const data = res.json(); והדפסתם את data.length. מה תקבלו?"
    options: ["את מספר הפריטים", "undefined, כי data הוא promise", "שגיאה שאומרת ש-fetch לא מוגדרת"]
    explain: "res.json() מחזירה promise. בלי await אתם מחזיקים את ה-promise ולא את הנתונים המפוענחים."
  - q: "איזו כתובת שולפת רק את המשתמש עם המזהה 3?"
    options: ["https://api.academy.test/users?3", "https://api.academy.test/3/users", "https://api.academy.test/users/3"]
  - q: "איפה בתגובה קוראים את מספר הסטטוס?"
    options: ["res.status", "res.json().status", "res.body.code"]
messages:
  - "השתמשו ב-await fetch(...) כדי לשלוח את הבקשה."
  - "פענחו את הגוף בעזרת res.json()."
  - "השתמשו בלולאת for כדי להדפיס את המשתמשים."
  - "שלפו את המשתמש הבודד בכתובת /users/3."
---

בשיעור הזה תבקשו נתונים אמיתיים משרת ותשתמשו בהם. `fetch` היא הפונקציה המובנית של JavaScript לשליחת בקשות HTTP, ויחד עם `async`/`await` היא הופכת שיחה ברשת לקוד שנראה רגיל.

## fetch בשלושה צעדים

```js
const BASE = 'https://api.academy.test';

const res = await fetch(BASE + '/users');  // 1. send the request, wait for the response
console.log(res.status);                   // prints: 200
const users = await res.json();            // 2. read the body and parse the JSON
console.log(users.length);                 // 3. use the data, prints: 5
```

מה קורה מאחורי הקלעים:

```
Your code                               Server
   | GET /users HTTP/1.1                   |
   |-------------------------------------->|
   |                                       |   looks up the users
   |       HTTP/1.1 200 OK                 |
   |<--------------------------------------|
   |       [{"id":1,"name":"Ada ..."}, ...]|
```

### למה שני await?

`fetch` מסתיימת ברגע ש**כותרות** התגובה מגיעות. הגוף עדיין יכול להיות בדרך, ולכן קריאתו (`res.json()`) היא צעד אסינכרוני שני. שתיהן מחזירות **הבטחות** (promises), ו-`await` פותח הבטחה לערך שלה. `await` ברמה העליונה עובד בעורך של הקורס הזה, אבל בתוך פונקציה רגילה צריך להצהיר עליה כ-`async`:

```js
async function loadUsers() {
  const res = await fetch(BASE + '/users');
  return await res.json();
}
const users = await loadUsers();
```

### JSON הופך לאובייקטים ולמערכים

השרת שולח טקסט כמו `[{"id":1,"name":"Ada Lovelace"}]`. הפונקציה `res.json()` הופכת אותו למערך (array) אמיתי של אובייקטים ב-JavaScript, כך שאפשר לעבור עליו בלולאה, לסנן אותו ולקרוא שדות בעזרת נקודה:

```js
for (const user of users) {
  console.log(user.name);   // Ada Lovelace, Grace Hopper, ...
}
```

### פריט אחד או רשימה?

ממשקי REST עוקבים אחרי תבנית שתראו שוב ושוב:

| כתובת | מה היא מחזירה |
| --- | --- |
| `/users` | את **האוסף** כולו (מערך) |
| `/users/3` | **פריט אחד** (אובייקט) |
| `/users/3/todos` | את המשימות ששייכות למשתמש 3 (מערך) |

לכן `await (await fetch(BASE + '/users/3')).json()` נותן אובייקט אחד כמו `{ id: 3, name: "Alan Turing", email: "alan@example.com", role: "viewer", city: "London" }`.

### קוראים מה חזר

תגובה נושאת יותר מאשר רק גוף. שתי תכונות שתשתמשו בהן כל הזמן:

```js
console.log(res.status);                          // 200
console.log(res.headers.get('content-type'));     // application/json; charset=utf-8
```

הסטטוס אומר אם הבקשה הצליחה (השיעור הבא עוסק בזה כולו), והכותרת `Content-Type` אומרת באיזה פורמט הגוף כתוב. כשכתוב בה `application/json`, `res.json()` היא הדרך הנכונה לקרוא אותו.

### משלבים בקשות

מכיוון שכל בקשה היא רק `await`, אפשר להשתמש בתשובה של בקשה אחת כדי לבנות את הבאה:

```js
const users = await (await fetch(BASE + '/users')).json();
const first = users[0];
const todosRes = await fetch(BASE + '/users/' + first.id + '/todos');
const todos = await todosRes.json();
console.log(first.name + ' has ' + todos.length + ' todos'); // Ada Lovelace has 3 todos
```

שימו לב איך המזהה מהתשובה הראשונה נכנס ישר לכתובת השנייה. סגנון "עוקבים אחרי הקישורים" הוא הדרך שבה רוב האפליקציות עובדות.

אפשר גם לראות את הסגנון הישן יותר עם `.then`:

```js
fetch(BASE + '/users/3').then((res) => res.json()).then((user) => console.log(user.name));
```

זה עושה אותו דבר. `await` פשוט קל יותר לקריאה, ולכן אנחנו משתמשים בו כאן.

> **שימו לב:**
> - **שכחתם `await`.** `const res = fetch(...)` מחזיק promise. `res.status` הוא `undefined` ו-`res.json()` זורקת `TypeError: res.json is not a function`.
> - **דילגתם על ה-`await` השני.** `const users = res.json()` נותן promise, ולכן `users.length` הוא `undefined` ו-`for (const u of users)` נכשל עם `TypeError: users is not iterable`.
> - **שימוש ב-`fetch` עם נתיב יחסי** כמו `fetch('/users')`. תמיד תנו את הכתובת המלאה `https://api.academy.test/users`.
> - **שדות עם שגיאות כתיב.** `user.Name` הוא `undefined` כי מפתחות ב-JSON רגישים לאותיות גדולות וקטנות. הדפיסו את כל האובייקט עם `console.log(user)` כדי לראות את המפתחות האמיתיים.

## להמשיך הלאה

הדפיסו את `res.headers.get('content-type')` כדי לראות איך השרת מתייג את התשובה שלו. אחר כך שלפו את `/users/3/todos` והדפיסו את הכותרות של המשימות של אלן.

> **תורכם:** שלפו את `/users`, הדפיסו את הכמות, ואחר כך שורה אחת לכל משתמש בצורה `1: Ada Lovelace (admin)`. לבסוף שלפו את `/users/3` והדפיסו `Alan Turing lives in London` בעזרת השדות של האובייקט שהוחזר.
