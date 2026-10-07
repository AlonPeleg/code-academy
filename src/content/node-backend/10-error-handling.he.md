---
title: "טיפול בשגיאות: 404, error middleware ושגיאות אסינכרוניות"
summary: "הופכים שגיאות שנזרקו לתשובות JSON נקיות בעזרת מחלקת שגיאה מותאמת, handler של 404 ו-error middleware אחד."
hints:
  - "Express מזהה handler של שגיאות לפי ארבעת הפרמטרים שלו (err, req, res, next). כל דבר שנזרק בנתיב, או שמועבר ל-next(error), מדלג על ה-middleware הרגיל ונוחת בו. רשמו אותו אחרון, אחרי ה-catch-all של 404."
  - "class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }   function asyncHandler(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }   ה-handler של 404 הוא app.use((req, res) => { res.status(404).json({ error: 'Route ' + req.method + ' ' + req.url + ' not found' }); });"
  - "app.use((err, req, res, next) => { if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' }); const status = err.status || 500; if (status === 500) { console.log('server error: ' + err.message); return res.status(500).json({ error: 'Internal server error' }); } res.status(status).json({ error: err.message }); });"
messages:
  - "גרמו ל-HttpError להרחיב את Error."
  - "ל-error middleware חייבים להיות ארבעה פרמטרים: (err, req, res, next)."
quiz:
  - q: "איך Express יודעת שפונקציה היא error-handling middleware?"
    options: ["השם שלה מסתיים ב-Handler", "יש לה בדיוק ארבעה פרמטרים: (err, req, res, next)", "היא נרשמת עם app.error()"]
    explain: "Express בודקת את function.length. גם אם אתם לא משתמשים ב-next, עדיין צריך להצהיר עליו."
  - q: "איפה צריך לרשום את ה-catch-all של 404 ואת ה-error middleware?"
    options: ["בראש הקובץ, לפני הכול", "מיד אחרי express.json() ולפני הנתיבים", "אחרי כל הנתיבים, וה-error handler אחרון מכולם"]
  - q: "למה ה-handler של 500 עונה 'Internal server error' ולא err.message?"
    options: ["הודעות שגיאה יכולות לחשוף לתוקפים נתיבי קבצים, SQL או סודות, ולכן רושמים אותן ביומן בשרת בלבד", "כי err.message תמיד ריק", "כי דפדפנים לא יכולים להציג הודעות שגיאה"]
  - q: "handler של נתיב הוא async וזורק שגיאה. מהי הדרך הבטוחה שעובדת בכל גרסה של Express?"
    options: ["לא לעשות כלום, קוד אסינכרוני אף פעם לא נכשל", "לעטוף אותו כך שדחיות (rejections) יגיעו ל-next(error), למשל עם try/catch או עם פונקציית עזר asyncHandler", "להוסיף app.listen שני"]
    explain: "Express 5 מעבירה promises שנדחו בעצמה, אבל Express 4 לא, והבקשה תיתקע."
---

דברים משתבשים בכל אפליקציה אמיתית: משתמש מבקש משהו שלא קיים, שולח JSON שבור, או שבקוד שלכם יש באג. השיעור הזה מראה איך להפוך את כל אלה לתשובות ברורות ועקביות במקום קריסות ובקשות תקועות.

## מה Express עושה עם שגיאות

אם handler של נתיב זורק שגיאה, Express תופסת אותה ושולחת אותה למקום מיוחד במקום לנתיבים הרגילים שלכם. התשובה ברירת המחדל היא דף HTML, שחסר תועלת ל-API של JSON (ובפיתוח הוא מציג את ההודעה ואת ה-stack). אפשר להשתלט על זה בכתיבת **error-handling middleware** משלכם:

```js
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
});
```

ההבדל היחיד מ-middleware רגיל הוא ה**פרמטר הרביעי** `err` בהתחלה. Express סופרת את הפרמטרים: ארבעה אומר "אני מטפל בשגיאות". חייבים להשאיר את כל הארבעה גם אם לא משתמשים ב-`next`.

אפשר גם לשלוח שגיאה בכוונה עם `next(error)`: כל ארגומנט ל-`next` (חוץ מהמילה `'route'`) אומר "דלגו על כל מה שרגיל ועברו ל-error handler".

## מחלקת שגיאה מותאמת

לשגיאות צריך קוד סטטוס. במקום לחזור על `res.status(404).json(...)` בכל מקום, אפשר לזרוק שגיאה שנושאת את הסטטוס שלה, ולתת למקום אחד להפוך אותה לתשובה:

```js
class HttpError extends Error {
  constructor(status, message) {
    super(message);   // sets err.message
    this.status = status;
  }
}
throw new HttpError(404, 'User not found');
```

`extends Error` נותן לכם stack trace בחינם. עכשיו ה-handlers של הנתיבים נשארים קצרים: הם זורקים כשמשהו לא בסדר, ואחרת מטפלים רק במסלול התקין.

## ה-handler של 404

Express עונה לכתובת לא מוכרת עם דף HTML משלה. כדי לשלוט בזה, הוסיפו middleware רגיל **אחרי כל הנתיבים**. אם בקשה מגיעה אליו, אף נתיב לא התאים:

```js
app.use((req, res) => {
  res.status(404).json({ error: 'Route ' + req.method + ' ' + req.url + ' not found' });
});
```

## שגיאות אסינכרוניות

handler שנכתב עם `async` מחזיר promise, ו-`throw` בתוכו הופך ל-promise שנדחה. **Express 5** (הגרסה הנוכחית) מעבירה דחיות ל-error handler בעצמה. **Express 4** לא: הבקשה פשוט נתקעת. התיקון הנייד הוא עטיפה זעירה שעובדת בשתיהן:

```js
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
app.get('/users/:id', asyncHandler(async (req, res) => { /* may throw */ }));
```

`Promise.resolve(...)` מוודא שיש לנו promise, ו-`.catch(next)` מעביר כל כשל ל-`next`, כלומר ל-error handler. `try { ... } catch (e) { next(e); }` רגיל בתוך ה-handler עושה את אותו דבר.

## handler אחד שמושל בכולם

שימו את ההחלטות ב-error middleware, שנרשם **אחרון**:

```js
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.log('server error: ' + err.message);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
});
```

שגיאות שציפיתם להן (`404`, `400`) בטוח להסביר ללקוח. שגיאות לא צפויות (`500`) הן באגים: רשמו את הפרטים ביומן לעצמכם והראו ללקוח רק הודעה כללית, כי הודעות אמיתיות יכולות לדלוף נתיבי קבצים, שמות מסדי נתונים או סודות אחרים. גם JSON שבור מטופל: `express.json()` מעבירה שגיאה עם `err.type === 'entity.parse.failed'`, שהיא טעות של הלקוח ומגיע לה `400`.

> **שימו לב:**
> - **רישום ה-error handler לפני הנתיבים.** Express שולחת שגיאות רק ל-handlers שבאים מאוחר יותר ברשימה, ולכן שלכם אף פעם לא רץ.
> - **כתיבת שלושה פרמטרים בלבד.** `(err, req, res)` נחשב ל-middleware רגיל ומדולג עבור שגיאות. אז אתם רואים את דף השגיאה HTML ברירת המחדל.
> - **זריקה בתוך callback או טיימר.** `setTimeout(() => { throw ... })` נמצא מחוץ ל-Express, ולכן אי אפשר לתפוס אותו; הוא מפיל את התהליך. השתמשו שם ב-`next(err)`.
> - **שליחת שתי תשובות.** אחרי `res.json(...)` ב-handler, שגיאה מאוחרת יותר מובילה ל-`Cannot set headers after they are sent to the client`. תמיד עשו `return` אחרי שענו.

> **תורכם:** כתבו את `HttpError` ואת `asyncHandler`, ואז הוסיפו את ה-catch-all של 404 ואת ה-error middleware בעל ארבעת הפרמטרים אחרי הנתיבים. הלקוח בתחתית מפעיל משתמש חסר, שגיאת אימות, JSON שבור, קריסה וכתובת לא מוכרת.
