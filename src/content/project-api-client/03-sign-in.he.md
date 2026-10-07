---
title: "שלב 3: התחברות וכותרות אימות אוטומטיות"
summary: "הופכים את פונקציית העזר למחלקה ApiClient ששומרת את הטוקן ושולחת אותו בכל קריאה."
hints:
  - "עטפו את הפונקציה הישנה במחלקה: ה-constructor שומר את baseUrl ואת token = null, request הופכת למתודה, ו-BASE_URL הופך ל-this.baseUrl. בתוך מתודות משתמשים ב-this. כדי להגיע למאפיינים."
  - "בנו קודם const headers = { Accept: \"application/json\" }; כשקיים this.token קבעו headers.Authorization = \"Bearer \" + this.token. login() קוראת ל-this.request(\"POST\", \"/login\", { email, password }) ושומרת את data.token."
  - "class ApiClient { constructor(baseUrl) { this.baseUrl = baseUrl; this.token = null; }  get isSignedIn() { return this.token !== null; }  async request(method, path, body) { const headers = { Accept: \"application/json\" }; const options = { method: method, headers: headers }; if (this.token) { headers.Authorization = \"Bearer \" + this.token; } ... }  async login(email, password) { const data = await this.request(\"POST\", \"/login\", { email: email, password: password }); this.token = data.token; return data; }  logout() { this.token = null; } }"
messages:
  - "כתבו class ApiClient."
  - "שלחו את הכותרת Authorization: \"Bearer \" + this.token."
  - "שמרו את הטוקן על האובייקט כ-this.token."
  - "צרו את הלקוח עם new ApiClient(BASE_URL)."
quiz:
  - q: "מה הכותרת Authorization: Bearer token-ada אומרת לשרת?"
    options: ["השרת צריך לנסות שוב", "הגוף הוא JSON", "מי שנושא את הטוקן הזה מורשה להיכנס בתור אותו משתמש"]
  - q: "למה הטוקן נשמר באובייקט הלקוח ולא במשתנה גלובלי?"
    options: ["אובייקטים מהירים יותר", "כל לקוח שומר את ההתחברות שלו, כך ששני לקוחות יכולים להיות שני אנשים שונים", "משתנים גלובליים לא יכולים להכיל מחרוזות"]
  - q: "איזו שגיאה מקבלים כשקוראים למחלקה בלי new, כמו ApiClient(\"x\")?"
    options: ["TypeError: Class constructor ApiClient cannot be invoked without new", "היא מחזירה undefined", "שום דבר, זה עובד"]
---
לרוב קריאות ה-API השימושיות צריך לדעת **מי אתם**. בשלב הזה הספרייה שלכם לומדת להתחבר פעם אחת ואז לצרף את הוכחת הזהות לכל קריאה מאוחרת אוטומטית, כך שבשאר הקוד אף פעם לא צריך לחשוב על זה.

## איפה אנחנו

יש לנו פונקציית `request` עם כתובת בסיס, טיפול ב-JSON ו-`ApiError`. אבל אין לה זיכרון: פונקציה רגילה לא יכולה לזכור התחברות בין קריאות, וכתובת הבסיס יושבת בקבוע גלובלי.

## מה נוסיף, ולמה

לקוח אמיתי הוא **אובייקט שמחזיק מצב**: איפה השרת נמצא, והטוקן שקיבלתם כשהתחברתם. נהפוך את הפונקציה למחלקה (class) `ApiClient`. **טוקן** (token) הוא מחרוזת סודית שהשרת מחלק אחרי סיסמה נכונה (כאן `token-ada`). שולחים אותו בחזרה בכל בקשה בכותרת `Authorization: Bearer <token>`, והשרת יודע מי קורא. בלי הטוקן השרת עונה `401 Unauthorized`.

## מעבר מודרך

**1. מפונקציה למחלקה.** מחלקה מאגדת נתונים (מאפיינים) עם הפונקציות שמשתמשות בהם (מתודות). ה-constructor רץ ב-`new ApiClient(...)`:

```js
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = null;      // null means "not signed in"
  }
  async request(method, path, body) { /* same body as before */ }
}
```

בתוך מתודות, `this` הוא אובייקט הלקוח. לכן `BASE_URL` הופך ל-`this.baseUrl`, וקוראים לו כ-`client.request(...)`.

**2. מוסיפים את הכותרת אוטומטית.** בנו קודם את אובייקט ה-`headers`, שימו בו את הטוקן כשיש, ואז צרפו אותו לאפשרויות:

```js
const headers = { Accept: "application/json" };
if (this.token) {
  headers.Authorization = "Bearer " + this.token;
}
```

המילה `Bearer` היא חלק מהתקן: היא אומרת "מי שנושא (bears) את הטוקן הזה מורשה להיכנס".

**3. התחברות.** ה-`POST /login` של השרת מקבל `{ email, password }` ועונה `{ token, expiresIn }`. שמרו את הטוקן על האובייקט:

```js
async login(email, password) {
  const data = await this.request("POST", "/login", { email: email, password: password });
  this.token = data.token;
  return data;
}
```

שימו לב ש-`login` משתמשת באותה מתודת `request`, ולכן סיסמה שגויה זורקת `ApiError` עם סטטוס 401 בחינם. מכיוון שהקריאה זורקת לפני ההשמה, `this.token` לא משתנה בכישלון.

**4. פונקציות עזר קטנות.** getter מאפשר לקוראים לכתוב `client.isSignedIn` בלי סוגריים, ו-`logout` פשוט שוכח את הטוקן:

```js
get isSignedIn() { return this.token !== null; }
logout() { this.token = null; }
```

שרת התרגול מקבל שני חשבונות: `ada@example.com` עם הסיסמה `engine123` (מנהלת) ו-`grace@example.com` עם `cobol456`.

## ההדגמה

היא בודקת שהלקוח לא מחובר, מראה ש-`/me` נכשל עם 401 בלי טוקן ושסיסמה שגויה נותנת הודעה קריאה, ואז מתחברת, שואלת את `/me`, יוצרת משתמש (זה דורש טוקן) ולבסוף מתנתקת כדי להוכיח שכתיבה אסורה שוב.

> **שימו לב:**
> - שכחת `this.` בתוך המחלקה: `ReferenceError: baseUrl is not defined`.
> - קריאה ל-`ApiClient(...)` בלי `new`: `TypeError: Class constructor ApiClient cannot be invoked without 'new'`.
> - שמירת הטוקן ב-URL או במשתנה גלובלי: טוקנים שייכים לכותרת, ובאובייקט כדי ששני לקוחות יוכלו להיות מחוברים כשני אנשים שונים.
> - רישום הטוקן ביומן (log) באפליקציות אמיתיות. זו סיסמה במסווה; כאן זה טוקן תרגול.
> - רווח חסר ב-`"Bearer" + this.token` הופך את הכותרת ל-`Bearertoken-ada` והשרת עונה `401`.

> **תורכם:** הפכו את הפונקציה ל-`class ApiClient` עם constructor `(baseUrl)`, `token = null`, מתודת `request` שמוסיפה `Authorization: Bearer <token>` כשקיים טוקן, `login(email, password)`, `logout()` ו-getter בשם `isSignedIn`. ההדגמה רצה אחר כך מול `new ApiClient(BASE_URL)`.
