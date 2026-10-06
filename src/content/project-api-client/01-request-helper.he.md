---
title: "שלב 1: פונקציית עזר לבקשות"
summary: "כותבים את request(method, path, body): פונקציה אחת ששולחת JSON לשרת ומחזירה JSON."
messages:
  - "קראו לשרת עם fetch(...)."
  - "שלחו את הגוף כטקסט עם JSON.stringify."
  - "הפכו את טקסט התשובה לאובייקט עם JSON.parse."
  - "אמרו לשרת שאתם שולחים JSON עם הכותרת Content-Type."
hints:
  - "בנו קודם אובייקט אפשרויות (method ועוד headers), אחר כך קראו ל-fetch עם הכתובת המלאה, ואז קראו את התשובה עם response.text(). כל קריאה ל-fetch ול-text צריכה await."
  - "רק כש-body אינו undefined: הוסיפו headers[\"Content-Type\"] = \"application/json\" ו-options.body = JSON.stringify(body). בסוף החזירו text ? JSON.parse(text) : null."
  - "const options = { method: method, headers: { Accept: \"application/json\" } };  if (body !== undefined) { options.headers[\"Content-Type\"] = \"application/json\"; options.body = JSON.stringify(body); }  const response = await fetch(BASE_URL + path, options);  const text = await response.text();  return text ? JSON.parse(text) : null;"
quiz:
  - q: "למה פונקציית העזר קוראת את response.text() ואז JSON.parse במקום לקרוא ל-response.json()?"
    options: ["לחלק מהתשובות (כמו 204 No Content) אין גוף, ופענוח של מחרוזת ריקה היה קורס", "response.json() לא קיימת", "טקסט תמיד מהיר יותר"]
    explain: "אנחנו בודקים קודם אם הטקסט ריק, ובמקרה כזה מחזירים null."
  - q: "מה צריך לעשות לאובייקט לפני ששולחים אותו כגוף של קריאת fetch?"
    options: ["כלום, fetch ממירה אותו", "למיין את המפתחות שלו", "להפוך אותו לטקסט עם JSON.stringify"]
  - q: "איזו כותרת (header) אומרת לשרת שגוף הבקשה הוא JSON?"
    options: ["Accept", "Content-Type", "Authorization"]
    explain: "Accept אומרת מה אתם רוצים לקבל בחזרה; Content-Type אומרת מה אתם שולחים."
---
כמעט כל אפליקציה אמיתית מדברת עם שרת: היא מבקשת משתמשים, שומרת משימה, מחברת מישהו למערכת. בפרויקט הזה תבנו **ספריית לקוח ל-API** קטנה, ארגז כלים לשימוש חוזר שמסתיר את כל החלקים המשעממים של השיחות האלה. עד השלב האחרון היא תטפל בהתחברות, בשגיאות, בניסיונות חוזרים, בעימוד ואפילו ב-SOAP.

## איפה אנחנו

עדיין בשום מקום, וזה בסדר. אנחנו מתחילים בשלד קטנטן: פונקציה אחת, `request`, ששולחת קריאה לשרת התרגול ב-`https://api.academy.test` ומחזירה את התשובה כאובייקט JavaScript. שרת התרגול מובנה בדף, ולכן הכול עובד גם בלי חיבור לאינטרנט ונותן אותן תשובות בכל הרצה.

## מה נוסיף, ולמה

אם כל חלק באפליקציה שלכם קורא ל-`fetch` ידנית, אתם חוזרים על אותן שורות בכל מקום: הכתובת הבסיסית, כותרות ה-JSON, ה-`JSON.parse`. כשהשרת משתנה, מתקנים עשרים מקומות. פונקציית עזר אחת, `request(method, path, body)`, פירושה **מקום אחד** לתקן, ושלבים מאוחרים יותר יוכלו להוסיף טיפול בשגיאות, טוקנים וניסיונות חוזרים באותו מקום, וכל תכונה תקבל אותם בחינם.

## הדרכה צעד אחר צעד

**1. אובייקט האפשרויות.** `fetch(url, options)` מקבלת ארגומנט שני שמתאר את הקריאה. ה-method (`"GET"`, `"POST"`...) נכנס לשם, וגם כותרות (headers), שהן תוויות קטנות שנשלחות עם הבקשה:

```js
const options = { method: method, headers: { Accept: "application/json" } };
```

`Accept` אומרת לשרת בנימוס "הייתי רוצה לקבל JSON בחזרה".

**2. שליחת גוף.** ל-`GET` אין גוף, אבל `POST`, `PUT` ו-`PATCH` נושאות נתונים. רק כשהקורא העביר `body` צריך להוסיף אותו. גוף חייב להיות **טקסט**, ולכן אובייקטים עוברים דרך `JSON.stringify`, וכותרת שנייה אומרת לשרת שהטקסט הוא JSON:

```js
if (body !== undefined) {
  options.headers["Content-Type"] = "application/json";
  options.body = JSON.stringify(body);
}
```

**3. קריאה לשרת.** הכתובת היא הבסיס ועוד הנתיב. `fetch` מחזירה promise, ולכן אנחנו מבצעים לה `await`:

```js
const response = await fetch(BASE_URL + path, options);
```

**4. קריאת התשובה.** גם `response.text()` היא promise. אנחנו קוראים טקסט קודם (במקום `response.json()`) כי לחלק מהתשובות אין גוף בכלל, למשל `DELETE` מוצלחת עונה `204 No Content`, ו-`JSON.parse("")` היה קורס:

```js
const text = await response.text();
return text ? JSON.parse(text) : null;
```

`text ? a : b` נקרא כך: "אם יש טקסט כלשהו, פענח אותו, אחרת החזר `null`".

## ההדגמה

ההדגמה בתחתית כבר כתובה. היא קוראת את משתמש 1, סופרת את כל המשתמשים, פונה ל-endpoint בשם `/echo` (שמחזיר את מה שקיבל) ומבקשת משתמש שלא קיים. שימו לב מה הקריאה האחרונה מחזירה: **אובייקט שמתאר את השגיאה, ולא שגיאה**. כרגע `request` לא יכולה להבדיל בין הצלחה לכישלון. זה בדיוק מה ששלב 2 מתקן.

> **שימו לב:**
> - שכחתם `await` לפני `fetch(...)`: מקבלים אובייקט `Promise` והשורה הבאה נכשלת עם `TypeError: response.text is not a function`.
> - שכחתם `JSON.stringify` על הגוף: השרת מקבל `[object Object]` ועונה `400 The body is not valid JSON`.
> - שכחתם את הכותרת `Content-Type`: השרת עונה `415 Send JSON with the header Content-Type: application/json`.
> - כתיבת `headers.Content-Type = ...`: סימן המינוס הוא חיסור, ולכן השתמשו ב-`headers["Content-Type"]`.
> - חובה להשתמש ב-`async` בפונקציה: `await` בתוך פונקציה רגילה הוא `SyntaxError`.

> **תורכם:** השלימו את `request(method, path, body)` כך שתשלח את הקריאה אל `BASE_URL + path`, תשלח את `body` כ-JSON רק כשהוא ניתן, ותחזיר את ה-JSON המפוענח (או `null` לתשובה ריקה). הריצו את הקובץ: ההדגמה חייבת להדפיס את ארבע השורות שמופיעות בפלט הצפוי.
