---
title: "אימות (Authentication): סיסמאות מגובבות וטוקנים חתומים"
summary: "שומרים סיסמאות בבטחה עם גיבוב (hash) ומלח (salt), מחברים משתמשים עם טוקן חתום ב-HMAC ומגנים על נתיבים עם middleware של אימות (401 לעומת 403)."
hints:
  - "בדיקת סיסמה אף פעם לא מפענחת שום דבר: מגבבים את הניסיון באותה דרך (אותו salt, אותו מספר איטרציות) ומשווים בין שני הגיבובים. בדיקת טוקן עובדת באותה צורה: מחשבים מחדש את החתימה מהחלק הראשון עם הסוד שלכם ומשווים אותה לזו שהגיעה."
  - "verifyPassword: const [salt, hash] = stored.split(':'); const attempt = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256'); return crypto.timingSafeEqual(attempt, Buffer.from(hash, 'hex'));   requireAuth: const token = (req.headers.authorization || '').slice(7); const payload = verifyToken(token); if (!payload) return res.status(401).json({ error: 'Login required' }); req.user = payload; next();"
  - "verifyToken: const [body, signature] = token.split('.'); const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url'); const a = Buffer.from(signature), b = Buffer.from(expected); if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null; const payload = JSON.parse(Buffer.from(body, 'base64url').toString()); if (payload.exp < Date.now()) return null; return payload;   requireRole: if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' }); next();"
messages:
  - "השוו סודות עם crypto.timingSafeEqual, לא עם ===."
  - "חשבו מחדש את החתימה עם crypto.createHmac('sha256', SECRET)."
  - "requireRole עונה 403 Forbidden."
quiz:
  - q: "למה מגבבים סיסמאות עם salt אקראי?"
    options: ["כדי שאותה סיסמה תיתן גיבוב שונה לכל משתמש, וזה מנטרל טבלאות חיפוש שחושבו מראש", "כדי שאפשר יהיה לפענח את הסיסמה מאוחר יותר", "כדי להקטין את הגיבוב"]
    explain: "ה-salt אינו סוד; הוא נשמר ליד הגיבוב. תפקידו להפוך כל גיבוב לייחודי."
  - q: "משתמש מחובר כמשתמש רגיל ופותח את /admin. איזה סטטוס נכון?"
    options: ["401 Unauthorized", "404 Not Found", "403 Forbidden"]
    explain: "401 אומר שאנחנו לא יודעים מי אתם (טוקן חסר או לא תקין). 403 אומר שאנחנו מכירים אתכם, אבל אסור לכם."
  - q: "תוקף משנה את התפקיד (role) בתוך ה-payload של טוקן. למה השרת מבחין בכך?"
    options: ["ה-payload מוצפן, ולכן אי אפשר לערוך אותו", "החתימה נוצרה עם הסוד על ה-payload המקורי, ולא מתאימה יותר", "אי אפשר לערוך טוקנים בדפדפן"]
    explain: "טוקן חתום קריא לכל אחד אבל אי אפשר לשנות אותו בלי הסוד. לכן אסור לשים בתוכו סודות."
  - q: "למה נתיב ה-login עונה 'Wrong email or password' גם עבור אימייל לא מוכר וגם עבור סיסמה שגויה?"
    options: ["כדי לחסוך בקוד", "כדי שתוקפים לא יוכלו לגלות אילו אימיילים רשומים", "כי Express לא יכולה להבדיל ביניהם"]
---
כמעט לכל אפליקציה אמיתית יש משתמשים, ומשתמשים פירושם סודות: סיסמאות והוכחה שמישהו מחובר. זה השיעור שבו טעויות נעשות יקרות, ולכן נעשה הכול בדרך הזהירה, רק עם המודול `crypto` שמגיע עם Node.

## לעולם אל תשמרו סיסמאות

אם מסד הנתונים שלכם דולף (זה קורה לחברות גדולות), כל הסיסמאות הרגילות דולפות איתו, ואנשים משתמשים שוב באותן סיסמאות. לכן שומרים **גיבוב** (hash) במקום: טביעת אצבע חד-כיוונית. אותו קלט תמיד נותן אותו פלט, אבל אי אפשר ללכת אחורה מהגיבוב לסיסמה. כדי לבדוק התחברות מגבבים את מה שהמשתמש הקליד ומשווים בין שני הגיבובים.

`sha256('engine123')` רגיל אינו מספיק: סיסמאות זהות נותנות גיבובים זהים, ולתוקפים יש טבלאות ענק של גיבובים של סיסמאות נפוצות. שני תיקונים:

- **מלח** (salt): בתים אקראיים שמעורבבים לתוך הגיבוב ונשמרים לידו. שני משתמשים עם אותה סיסמה מקבלים גיבובים שונים, ולכן טבלאות חיפוש חסרות תועלת.
- גיבוב **איטי**: `pbkdf2Sync(password, salt, iterations, keylength, 'sha256')` חוזר על העבודה `iterations` פעמים. זה עולה לכם כמה אלפיות שנייה לכל התחברות, אבל עולה לתוקף מיליוני ניחושים. כאן אנחנו משתמשים ב-2000 כדי שהתרגול יהיה מהיר; אפליקציות אמיתיות משתמשות במאות אלפים, או ב-`scrypt` / bcrypt / argon2 החדשים יותר.

```js
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync('engine123', salt, 2000, 32, 'sha256').toString('hex');
const stored = salt + ':' + hash;   // this is what goes in the database
```

כדי לאמת, מפצלים את `stored`, מגבבים את הניסיון עם אותו salt ומשווים עם `crypto.timingSafeEqual(a, b)`. `===` רגיל נעצר בתו הראשון שונה, וההבדל הזעיר בזמן יכול לדלוף מידע; `timingSafeEqual` תמיד לוקח אותו זמן (הוא צריך שני buffers באורך שווה, ולכן ממירים עם `Buffer.from(hash, 'hex')`).

## הוכחה שאתם מחוברים: טוקנים חתומים

אחרי התחברות מוצלחת השרת מחלק **טוקן** (token) שהלקוח שולח עם כל בקשה (`Authorization: Bearer <token>`, כמו במסלול ה-APIs). לטוקן שלנו שני חלקים:

```
base64url(payload) . signature
{"sub":1,"role":"admin","exp":1767225600000}
```

ה-**payload** אומר מי אתם (`sub` = subject, מזהה המשתמש), את התפקיד שלכם ומתי הטוקן פג (`exp`). ה-**signature** הוא `HMAC-SHA256(payload, SECRET)`: טביעת אצבע שרק מי שמכיר את הסוד יכול ליצור. כשטוקן חוזר, השרת מחשב מחדש את החתימה. אם תו אחד ב-payload שונה, החתימות נבדלות והטוקן נדחה. זה בדיוק הרעיון שמאחורי JWT (JSON Web Tokens); בפרויקט אמיתי תשתמשו בספרייה כמו `jsonwebtoken`, אבל עכשיו אתם יודעים מה היא עושה.

חשוב: טוקן חתום **אינו מוצפן**. כל אחד יכול לפענח את ה-payload עם base64, ולכן לעולם אל תשימו בו סיסמאות או מידע פרטי. החתימה רק מבטיחה שלא שונה. שמרו את `SECRET` מחוץ לקוד באפליקציה אמיתית (בשיעור הבא: משתני סביבה), ותנו לטוקנים תפוגה כדי שטוקן גנוב יפסיק לעבוד.

## Middleware ששומר על נתיבים

עכשיו ה-middleware משיעור 8 מראה את כוחו. `requireAuth` רץ לפני ה-handler, מאמת את הטוקן ושומר את התוצאה עבור הנתיבים שמאחוריו:

```js
app.get('/me', requireAuth, (req, res) => res.json({ id: req.user.sub }));
```

`requireRole('admin')` הוא **מפעל** (factory): פונקציה שמחזירה middleware. שרשרו אותם: `app.get('/admin', requireAuth, requireRole('admin'), handler)`. הסדר קובע איזו שגיאה תקבלו:

| מצב | סטטוס |
| --- | --- |
| אין טוקן, טוקן שבור, חתימה שגויה, פג תוקף | `401` (התחברו שוב) |
| טוקן תקין אבל התפקיד אינו מורשה | `403` (התחברות מחדש לא תעזור) |

> **שימו לב:**
> - **השוואת גיבובים עם `===`.** זה עובד, אבל מדליף תזמון. השתמשו ב-`crypto.timingSafeEqual`, ובדקו קודם `a.length === b.length`, אחרת הוא זורק `RangeError: Input buffers must have the same byte length`.
> - **לספר לתוקף יותר מדי.** `"No user with that email"` לעומת `"Wrong password"` חושף אילו אימיילים קיימים. ענו אותה הודעה כללית לשניהם.
> - **קריאת ה-payload לפני בדיקת החתימה.** תמיד אמתו קודם; ה-payload של טוקן שלא אומת הוא רק טקסט שהתוקף שולט בו.
> - **שכחת בדיקת התפוגה.** בלי `exp` טוקן שדלף עובד לנצח.
> - **שליחת משהו על `http://` רגיל.** טוקנים וסיסמאות חייבים לעבור ב-HTTPS בפרודקשן.

## להתקדם הלאה

הוסיפו `POST /register` שמאמת את האימייל ואת אורך הסיסמה, שומר את `hashPassword(password)` ועונה `201`. אחר כך תנו ל-`signToken` תוחלת חיים קצרה יותר והוסיפו נתיב `/refresh` שמנפיק טוקן חדש עבור תקין.

> **תורכם:** ב-`auth.js` כתבו את `verifyPassword`, `verifyToken`, `requireAuth` ו-`requireRole`. `main.js` רושם שני משתמשים, מחבר אותם, ואז מנסה טוקן חסר, משתמש רגיל ב-`/admin`, טוקן מזויף וטוקן שפג תוקפו.
