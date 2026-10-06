---
title: "שרת האינטרנט הראשון שלכם עם http"
summary: "בונים שרת מאפס עם המודול המובנה http: קוראים את req.method ואת req.url, שולחים קודי סטטוס, כותרות ו-JSON, וקוראים לשרת עם fetch."
hints:
  - "הסתעפו לפי req.method ו-req.url עם if / else if / else. בכל ענף חייבים לשלוח תשובה: res.writeHead(status, { 'Content-Type': '...' }) קובעת את קוד הסטטוס ואת הכותרות, ו-res.end(text) שולחת את גוף התשובה וסוגרת אותה."
  - "בנתיב ה-POST הגוף מגיע בחלקים: let body = ''; req.on('data', (chunk) => { body += chunk; }); req.on('end', () => { ...parse body and reply here... }); את התשובה חייבים לכתוב בתוך הפונקציה של 'end'."
  - "if (req.method === 'POST' && req.url === '/api/echo') { let body = ''; req.on('data', (chunk) => { body += chunk; }); req.on('end', () => { res.writeHead(201, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ received: JSON.parse(body) })); }); }"
messages:
  - "סיימו כל תשובה עם res.end(...)."
  - "קבעו את הסטטוס עם res.writeHead(code, headers) או עם res.statusCode."
  - "אספו את הגוף עם req.on('data', ...)."
  - "ענו בתוך req.on('end', ...) כשכל הגוף כבר הגיע."
  - "הפכו את טקסט הגוף לאובייקט עם JSON.parse."
quiz:
  - q: "מה מקבלת הפונקציה שמועברת ל-http.createServer בכל פעם שהיא רצה?"
    options: ["את מספר הפורט", "אובייקט בקשה (req) ואובייקט תשובה (res)", "רק את ה-URL כטקסט"]
  - q: "מה קורה אם ה-handler שלכם אף פעם לא קורא ל-res.end()?"
    options: ["הדפדפן מציג מיד דף ריק", "Node מסיים את התשובה בשבילכם", "הלקוח ממשיך לחכות לתשובה שאף פעם לא מסתיימת"]
    explain: "כל עוד לא נקראה res.end() התשובה לא הושלמה. הקורא (כאן fetch) פשוט נתקע."
  - q: "למה קוראים את הגוף של בקשת POST עם req.on('data') ועם req.on('end')?"
    options: ["הוא מגיע בחלקים (chunks) וצריך לחכות לאחרון שבהם", "כי גוף של POST תמיד מוצפן", "כי req.body נוצר על ידי הדפדפן"]
  - q: "איזה קוד סטטוס השרת צריך לשלוח כשה-URL לא תואם לאף נתיב?"
    options: ["200", "404", "201"]
---

כל אתר וכל API הם, בלב ליבם, תוכנית שמחכה לבקשות ושולחת בחזרה תשובות. ב-Node זה מובנה. בשיעור הזה תכתבו שרת אינטרנט שלם רק עם המודול `http`, כדי שתבינו מה framework-ים כמו Express עושים בשבילכם בשיעורים הבאים.

## בקשה נכנסת, תשובה יוצאת

HTTP היא שיחה. הלקוח (דפדפן, או `fetch`) שולח **בקשה** (request): שיטה (`GET`, `POST`, ...), נתיב (`/api/hello`), כותרות, ולפעמים גם גוף. השרת שולח **תשובה** (response): קוד סטטוס (`200`, `404`, ...), כותרות וגוף.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello!');
});

server.listen(3000, () => console.log('Listening on port 3000'));
```

צעד אחר צעד:

- `http.createServer(handler)` יוצרת שרת. הפונקציה `handler` רצה **פעם אחת בכל בקשה**.
- `req` מתארת את הבקשה שהגיעה: `req.method` ו-`req.url` (הנתיב יחד עם מחרוזת השאילתה, כמו `/search?q=node`).
- `res` היא הדרך שלכם לענות. `res.writeHead(status, headers)` קובעת את קוד הסטטוס ואת הכותרות, ו-`res.end(body)` שולחת את הגוף ו**מסיימת** את התשובה. אפשר גם לקבוע בנפרד `res.statusCode = 404` ו-`res.setHeader(name, value)`.
- `server.listen(3000, callback)` מתחילה להמתין לבקשות ב**פורט 3000** וקוראת לפונקציית ה-callback כשהשרת מוכן. פורט הוא כמו מספר דלת במחשב שלכם: תוכנית אחת לכל פורט.

## ניתוב ידני

שרת בדרך כלל עושה דברים שונים עבור כתובות שונות. הדרך הפשוטה ביותר היא לבדוק את השיטה ואת הנתיב:

```js
if (req.method === 'GET' && req.url === '/') {
  // the home page
} else if (req.method === 'GET' && req.url === '/api/hello') {
  // the API
} else {
  // nothing matched: 404 Not Found
}
```

מחרוזת השאילתה היא חלק מ-`req.url`. כדי לפצל את `/search?q=node` לנתיב ולחלקיו, השתמשו במחלקה (class) `URL`: `const url = new URL(req.url, 'http://localhost'); url.pathname; url.searchParams.get('q');`. Express תעשה את זה בשבילכם.

## שליחת JSON

API שולח נתונים כ-JSON. ממירים את האובייקט לטקסט עם `JSON.stringify`, ואומרים מה שולחים באמצעות הכותרת `Content-Type` כדי שהלקוחות ידעו איך לקרוא את זה:

```js
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ message: 'Hello from Node' }));
```

## קריאת גוף של בקשה

בקשת POST נושאת נתונים בגוף שלה, ו-Node מוסרת אותו לכם **בחלקים** (chunks) דרך אירועים (events) שהכרתם בשיעור הקודם. אוספים את החלקים, ורק כשהאירוע `'end'` מתרחש יש בידיכם את הטקסט המלא:

```js
let body = '';
req.on('data', (chunk) => { body += chunk; });
req.on('end', () => {
  const data = JSON.parse(body);
  // now answer using data
});
```

לכתוב את זה בכל נתיב זה מייגע, ובדיוק בגלל זה קיימת Express (בשיעור הבא).

## בדיקת השרת שלכם

בחיים האמיתיים בודקים שרת משורת הכתובת בדפדפן, עם `curl`, או מתוך קוד. כאן סביבת התרגול מאפשרת לתוכנית שלכם לקרוא לעצמה: כל עוד השרת מאזין בפורט 3000, הקריאה `fetch('http://localhost:3000/...')` מגיעה אליו. `localhost` תמיד אומר "המחשב הזה". תמיד קראו ל-`server.close()` כשההדגמה נגמרת. שרת אמיתי ממשיך לרוץ עד שעוצרים אותו עם Ctrl+C.

> **שימו לב:**
> - **לא קוראים אף פעם ל-`res.end()`.** הלקוח מחכה לנצח, כי התשובה לא מסתיימת. כל ענף ב-handler חייב לסיים את התשובה, כולל ענף ה-`404`.
> - **עונים פעמיים.** קריאה כפולה ל-`res.end()` (או כתיבת כותרות אחרי ששלחתם את הגוף) נכשלת עם `ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client`. השתמשו ב-`else if` וב-`return` כדי לוודא שרק ענף אחד רץ.
> - **עונים מחוץ לפונקציה של `'end'`.** בנתיב POST ענו בתוך `req.on('end', ...)`. אם תענו מוקדם יותר, הגוף עדיין לא שלם.
> - **`JSON.parse` על קלט פגום.** לקוח ששולח JSON שבור גורם ל-`JSON.parse` לזרוק `SyntaxError: Unexpected token`. שרתים אמיתיים עוטפים את זה ב-`try/catch` ועונים `400`. שיעור הטיפול בשגיאות עוסק בזה.
> - **`EADDRINUSE`.** הפעלת שני שרתים על אותו פורט נכשלת עם `Error: listen EADDRINUSE: address already in use :::3000`. סגרו את השרת הראשון או בחרו פורט אחר.

## להמשך

הוסיפו נתיב `GET /api/time` שעונה עם האורך של `req.url` ועם השיטה, או החזירו `405 Method Not Allowed` כשהנתיב נכון אבל השיטה שגויה (למשל `DELETE /`).

> **תורכם:** החליפו את התשובה הזמנית ב-handler. הגישו את `GET /` כטקסט רגיל, את `GET /api/hello` כ-JSON, את `POST /api/echo` (קראו את הגוף וענו עם סטטוס `201`), ושלחו טקסט `404` לכל השאר. הקוד שמתחת לשרת הוא "דפדפן" מוכן שקורא לשרת ומדפיס את מה שהוא מקבל.
