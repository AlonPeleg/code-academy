---
title: "שלב 2: ApiError וטיפול בשגיאות"
summary: "זורקים שגיאה מותאמת אחת, ApiError, עם הסטטוס והודעת השרת, בכל פעם שקריאה נכשלת."
hints:
  - "fetch לא נדחה (reject) כשהשרת עונה 404 או 500. צריך לבדוק בעצמכם את response.ok ולזרוק שגיאה כשהוא false. שגיאה מותאמת היא מחלקה (class) שמרחיבה את Error."
  - "class ApiError extends Error { constructor(status, message, details) { super(message); this.name = \"ApiError\"; ... } }. בתוך request, עטפו את JSON.parse ב-try/catch, ואז if (!response.ok) throw new ApiError(...)."
  - "class ApiError extends Error { constructor(status, message, details) { super(message); this.name = \"ApiError\"; this.status = status; this.details = details; } }  let data = null; if (text) { try { data = JSON.parse(text); } catch (e) { data = { error: text }; } }  if (!response.ok) { const message = (data && data.error) || response.statusText || \"HTTP \" + response.status; throw new ApiError(response.status, message, data); }  return data;"
quiz:
  - q: "מה fetch עושה כשהשרת עונה 404 Not Found?"
    options: ["הוא נדחה (reject) עם שגיאה", "הוא מסתיים כרגיל, ואתם צריכים לבדוק את response.ok", "הוא מנסה שוב באופן אוטומטי"]
    explain: "fetch נדחה רק כשהרשת עצמה נכשלת."
  - q: "למה קוראים ל-super(message) בבנאי (constructor) של ApiError?"
    options: ["כדי שמחלקת האב Error תשמור את ההודעה ותכין את this", "כדי להפוך את השגיאה לאסינכרונית", "כדי להעתיק את קוד הסטטוס"]
  - q: "מה היתרון של זריקת שגיאה על פני החזרת אובייקט שגיאה?"
    options: ["זה מהיר יותר", "זה מודפס בצבע", "הקוראים לא יכולים להתעלם מהשגיאה בטעות, והתוכנית נעצרת עד שתופסים אותה"]
messages:
  - "כתבו class ApiError extends Error."
  - "בדקו את response.ok כדי לדעת אם הקריאה הצליחה."
  - "זרקו new ApiError(status, message, data) עבור קריאות שנכשלו."
---
שרתים נכשלים בהמון דרכים: המשתמש לא קיים, לא התחברתם, הנתונים לא תקינים, או שהשרת עצמו קורס. בשלב הזה תתנו לכל כשל את **אותה צורה**, כדי שהשאר של האפליקציה יוכל לטפל בבעיות בדרך אחידה אחת.

## איפה אנחנו עומדים

הפונקציה `request(method, path, body)` יודעת לפנות לשרת ולהחזיר JSON אחרי פענוח. אבל כשהשרת עונה `404 Not Found`, הפונקציה שלנו מחזירה בשמחה את `{ error: "No user with id 99" }` כאילו זו תוצאה רגילה. מי שקרא לפונקציה צריך לבדוק את הנתונים כדי להבין שמשהו השתבש, וקל מאוד לשכוח לעשות את זה.

## מה נוסיף, ולמה

נזרוק **שגיאה** בכל פעם שסטטוס ה-HTTP אומר שהקריאה נכשלה (כל דבר מחוץ לטווח 200 עד 299). שגיאה שנזרקה אי אפשר להתעלם ממנה בטעות: היא עוצרת את התוכנית עד שמישהו תופס אותה עם `try/catch`. בנוסף ניצור מחלקה (class) מותאמת לשגיאות, `ApiError`, שנושאת את הפרטים שהקורא צריך: ה-`status` המספרי, `message` קריאה שנלקחת מגוף התשובה של השרת עצמו, וה-`details` המלאים. ספריות לקוח אמיתיות (Stripe, GitHub, AWS) כולן עובדות כך.

## מדריך צעד אחר צעד

**1. מחלקת שגיאה מותאמת.** `class ... extends Error` יוצרת סוג שגיאה משלכם, שעדיין מתנהג כמו שגיאה רגילה (יש לה `message` ו-stack trace):

```js
class ApiError extends Error {
  constructor(status, message, details) {
    super(message);        // lets Error store the message
    this.name = "ApiError"; // shown in logs
    this.status = status;
    this.details = details;
  }
}
```

`super(message)` קוראת לבנאי (constructor) של מחלקת האב. בלעדיה תקבלו `ReferenceError: Must call super constructor in derived class before accessing 'this'`.

**2. פענוח בטוח של הגוף.** דף שגיאה לא תמיד יהיה JSON (פרוקסי יכול לענות בטקסט פשוט). עטפו את `JSON.parse` ב-`try/catch` וחזרו לטקסט הגולמי:

```js
let data = null;
if (text) {
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { error: text };
  }
}
```

**3. בדיקת `response.ok`.** הערך שלו הוא `true` עבור סטטוסים 200 עד 299. כשהוא `false`, בחרו את ההודעה הטובה ביותר שזמינה. האופרטור `||` מחזיר את הערך הראשון שאינו ריק:

```js
const message = (data && data.error) || response.statusText || "HTTP " + response.status;
throw new ApiError(response.status, message, data);
```

הביטוי `data && data.error` מגן מפני מצב שבו `data` הוא `null`.

**4. תפיסת השגיאה.** עכשיו הקוראים יכולים לדעת בדיוק מה קרה, ו-`instanceof` מפריד בין השגיאות שלכם לבין באגים:

```js
try {
  await request("GET", "/users/99");
} catch (error) {
  if (error instanceof ApiError && error.status === 404) {
    console.log("no such user");
  } else {
    throw error; // a different problem: do not hide it
  }
}
```

ההדגמה משתמשת בפונקציית עזר `attempt(...)` שמדפיסה אם השגיאה היא `ApiError`, מה הסטטוס שלה ומה ההודעה שלה, עבור 404, 401, 500 ו-400.

> **שימו לב:**
> - `fetch` נדחה רק כשיש כשל ברשת (אין חיבור). תשובת `404` או `500` עדיין נחשבת הבטחה (promise) שהסתיימה בהצלחה, ולכן צריך לבדוק את `response.ok` בעצמכם.
> - קריאת הגוף פעמיים: קריאה ל-`response.json()` אחרי `response.text()` נכשלת בשגיאה שאומרת שזרם הגוף כבר נקרא. קראו פעם אחת, ושמרו את הטקסט.
> - זריקת מחרוזת פשוטה (`throw "failed"`) מאבדת את ה-stack trace ואת הסטטוס. תמיד זרקו אובייקט Error.
> - אם שוכחים `await` לפני `request(...)` בתוך `try`, הדחייה קורית מאוחר יותר ובורחת מה-`catch` שלכם.

> **תורכם:** הוסיפו את המחלקה `ApiError` וגרמו ל-`request` לזרוק `new ApiError(status, message, data)` בכל פעם ש-`response.ok` הוא false, כשההודעה נלקחת משדה `error` של הגוף כשיש כזה. קריאות מוצלחות חייבות להמשיך להחזיר את הנתונים. ההדגמה מדפיסה שורה אחת לכל סוג של כשל.
