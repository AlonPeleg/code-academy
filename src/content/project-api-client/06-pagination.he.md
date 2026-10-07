---
title: "שלב 6: עוזר עימוד (Pagination)"
summary: "עוקבים אחרי _page ו-X-Total-Pages בעזרת async generator, ואוספים הכול עם all()."
hints:
  - "מידע העימוד נמצא בכותרות (headers) של התשובה, ולכן השתמשו ב-requestFull (היא מחזירה { status, headers, data }). בקשו עמוד 1, 2, 3... עם _page ו-_limit עד שראיתם X-Total-Pages עמודים."
  - "מתודת async generator נכתבת כך:  async *pages(params, pageSize) { ... yield result.data; ... }  והיא נצרכת עם for await (const page of ...). כותרות הן טקסט, ולכן Number(result.headers.get(\"X-Total-Pages\"))."
  - "async *pages(params, pageSize) { const size = pageSize || 3; let page = 1; let totalPages = 1; while (page <= totalPages) { const query = Object.assign({}, params, { _page: page, _limit: size }); const result = await this.client.requestFull(\"GET\", this.path + toQuery(query)); totalPages = Number(result.headers.get(\"X-Total-Pages\") || 1); yield result.data; page++; } }  async all(params, pageSize) { const items = []; for await (const page of this.pages(params, pageSize)) { items.push(...page); } return items; }"
messages:
  - "כתבו את pages() כ-async generator (async *pages)."
  - "בצעו yield לכל עמוד כשאתם מביאים אותו."
  - "קראו את הכותרת X-Total-Pages כדי לדעת מתי לעצור."
  - "השתמשו ב-for await כדי לעבור על העמודים בתוך all()."
quiz:
  - q: "איפה השרת הזה מגלה לכם כמה עמודים קיימים?"
    options: ["בכתובת ה-URL", "הוא אף פעם לא מגלה", "בכותרת התשובה X-Total-Pages"]
  - q: "מה קורה כשהקוד שקורא עושה break מתוך לולאת for await על pages()?"
    options: ["כל שאר העמודים עדיין מובאים", "ה-generator נעצר, ולכן לא מובאים עוד עמודים", "התוכנית קורסת"]
    explain: "ה-generator ממשיך רק כשהקוד שקורא מבקש את הערך הבא."
  - q: "למה משתמשים ב-Object.assign({}, params, { _page: page }) במקום לשנות את params ישירות?"
    options: ["זה מעתיק את המסננים (filters), כך שהאובייקט של הקוד שקורא לא משתנה", "fetch דורשת את זה", "זה ממיין את המפתחות"]
---
כששרת מחזיק אלפי רשומות, הוא אף פעם לא שולח את כולן בבת אחת. הוא שולח אותן **עמוד אחרי עמוד**. בשלב הזה תלמדו את הלקוח לעבור על כל העמודים בשבילכם, בעזרת כלי מודרני שנקרא **async generator**.

## איפה אנחנו

הלקוח עמיד: יש בו ניסיונות חוזרים, timeouts, אימות (auth) ו-CRUD. הפונקציה `requestFull` כבר מחזירה `{ status, headers, data }`, וזה בדיוק מה שאנחנו צריכים עכשיו, כי מידע העימוד נמצא ב**כותרות התשובה**.

## מה נוסיף, ולמה

הסתכלו על `GET /todos?_page=1&_limit=4`. השרת עונה עם 4 משימות (todos) ועם הכותרות `X-Page: 1`, `X-Total-Count: 10` ו-`X-Total-Pages: 3`. לקוח שקורא רק ל-`list()` מפספס בשקט כל רשומה שאחרי העמוד הראשון, באג קלאסי באינטגרציות אמיתיות. נוסיף:

* `pages(params, pageSize)`: **async generator** שמחזיר (yield) עמוד אחד בכל פעם, ומביא את העמוד הבא רק כשהקוד שקורא מבקש אותו.
* `all(params, pageSize)`: פונקציית נוחות שאוספת הכול למערך (array) אחד.

## הדרכה צעד אחר צעד

**1. קודם, עוזר קטן.** אנחנו בונים עכשיו מחרוזות שאילתה (query string) בשני מקומות, ולכן נעביר את הקוד של `URLSearchParams` לפונקציה אחת `toQuery(params)` שמחזירה `"?a=1&b=2"` או `""`, ונשתמש בה ב-`list`.

**2. Async generators.** פונקציה רגילה חוזרת פעם אחת. **Generator** (`function*`) יכול לבצע `yield` של ערך, להשהות את עצמו ולהמשיך מאוחר יותר. **Async generator** (`async function*`, או `async *name()` למתודה) יכול גם לבצע `await`. צורכים אותו עם `for await`:

```js
async function* countdown() {
  yield 3;
  await somePromise;
  yield 2;
}
for await (const n of countdown()) console.log(n);   // 3 then 2
```

מכיוון שה-generator מושהה בכל `yield`, קוד שקורא ועושה `break` עוצר את ה-generator, ולא נשלחות עוד בקשות.

**3. המתודה `pages`.** כך נראית התשובה:

```js
async *pages(params, pageSize) {
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const query = Object.assign({}, params, { _page: page, _limit: size });
    const result = await this.client.requestFull("GET", this.path + toQuery(query));
    totalPages = Number(result.headers.get("X-Total-Pages") || 1);
    yield result.data;
    page++;
  }
}
```

`Object.assign({}, params, {...})` מעתיקה את המסננים של הקוד שקורא ומוסיפה את מפתחות העימוד בלי לשנות את האובייקט שלו. כותרות הן תמיד טקסט, ולכן `Number(...)` ממירה. את המספר הכולל של העמודים אנחנו לומדים מהתשובה **הראשונה**, ו-`|| 1` מכסה שרתים שלא שולחים את הכותרת. באוסף ריק יש `X-Total-Pages: 0`: העמוד הראשון מוחזר (מערך ריק) והלולאה מסתיימת.

**4. המתודה `all`.** פורשים כל עמוד לתוך מערך אחד:

```js
async all(params, pageSize) {
  const items = [];
  for await (const page of this.pages(params, pageSize)) {
    items.push(...page);
  }
  return items;
}
```

`items.push(...page)` דוחפת כל איבר של `page` (ה-`...` פורש מערך לארגומנטים נפרדים).

> **שימו לב:**
> - `for (const page of client.todos.pages())` בלי `await` נותנת `TypeError: client.todos.pages(...) is not iterable`. Async generators דורשים `for await`.
> - `for await` עובד רק בתוך פונקציית `async` או ברמה העליונה של מודול או של סביבת ההרצה הזו.
> - ספירת עמודים מ-0: השרת הזה מתחיל ב-`_page=1`; בקשה לעמוד 0 מתנהגת כמו עמוד 1.
> - שינוי המסנן בזמן שאתם עוברים על עמודים (הוספת רשומות) יכול לדלג על פריטים או לחזור עליהם. עבור נתונים חיים וגדולים, ממשקי API אמיתיים משתמשים ב-cursors.
> - אם שוכחים את `page++` נוצרת לולאה אינסופית שמפציצה את השרת.

> **תורכם:** הוסיפו את `toQuery`, אחר כך את `pages(params, pageSize)` כ-async generator שקורא את `X-Total-Pages`, ואת `all(params, pageSize)` שאוספת כל עמוד. ההדגמה מראה עמודים של 4, אוספת הכול, מסננת, מטפלת בתוצאה ריקה ומוכיחה ש-`break` עוצר את ההבאה.
