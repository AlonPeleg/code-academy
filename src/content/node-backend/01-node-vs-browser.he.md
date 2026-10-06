---
title: "Node.js לעומת הדפדפן"
summary: "למדו מה משתנה כש-JavaScript רצה מחוץ לדפדפן: process, __dirname, ערכים גלובליים ומשתני סביבה."
hints:
  - "הפונקציה typeof מחזירה את הסוג של ערך כטקסט, והיא אף פעם לא קורסת על שם שלא קיים (היא עונה 'undefined'). השוו את התוצאה לטקסט 'undefined' בעזרת === או !==."
  - "isNode: typeof process !== 'undefined'. hasWindow: typeof window !== 'undefined'. appName: process.env.APP_NAME || 'stranger'. extraCount: process.argv.slice(2).length. האובייקט הגלובלי נקרא globalThis."
  - "const isNode = typeof process !== 'undefined'; const hasWindow = typeof window !== 'undefined'; const appName = process.env.APP_NAME || 'stranger'; const extraCount = process.argv.slice(2).length; const file = path.join(__dirname, 'data', 'notes.txt'); globalThis.answer = 42;"
quiz:
  - q: "מה מבין הדברים הבאים קיים ב-Node.js אבל לא בדף אינטרנט?"
    options: ["process", "console.log", "setTimeout"]
    explain: "process מתאר את התוכנית שרצה (ארגומנטים, משתני סביבה, קודי יציאה). בדפדפנים אין אובייקט כזה. console ו-setTimeout קיימים בשני המקומות."
  - q: "מה קורה אם קוד של Node.js קורא ל-document.getElementById('x')?"
    options: ["הוא מחזיר null", "הוא קורס עם ReferenceError: document is not defined", "הוא יוצר דף חדש"]
    explain: "ב-Node אין דף, ולכן אין document ואין window. השם בכלל לא קיים."
  - q: "איפה קוראים את ההגדרות שנמסרו לתוכנית מבחוץ, כמו סיסמה או מספר פורט?"
    options: ["window.location", "__dirname", "process.env"]
  - q: "מה מכיל __dirname?"
    options: ["את שם המחשב", "את התיקייה של הקובץ שרץ", "את התיקייה שבה הקלדתם את הפקודה"]
    explain: "__dirname היא התיקייה שמכילה את הקובץ הנוכחי. התיקייה שבה הקלדתם את הפקודה היא process.cwd(), ושתיהן יכולות להיות שונות."
messages:
  - "השתמשו ב-typeof window כדי לגלות אם קיים window."
  - "קראו את מילות שורת הפקודה מ-process.argv."
  - "בנו את הנתיב עם path.join(...)."
  - "שמרו את הערך עם globalThis.answer = 42."
---

אתם כבר מכירים JavaScript מדפי אינטרנט. Node.js היא אותה שפה, רק שהיא רצה **מחוץ לדפדפן**, על המחשב שלכם או על שרת (server). השפה עצמה (משתנים, פונקציות, `async`, מחלקות) זהה, אבל הסביבה שונה, ועל זה השיעור הזה. אחרי שתכירו את ההבדלים תוכלו לקרוא כל תוכנית Node.

## אותה שפה, ארגז כלים אחר

הדפדפן נותן ל-JavaScript **דף** לעבוד איתו: `window`, `document`, `localStorage`, ה-DOM. ל-Node אין דף. במקום זה היא נותנת לקוד שלכם כלים לעבודה עם **המחשב**: קבצים, שרתי רשת, ארגומנטים משורת הפקודה ומשתני סביבה.

| רעיון | בדפדפן | ב-Node.js |
| --- | --- | --- |
| אובייקט ברמה העליונה | `window` | `globalThis` (נקרא גם `global`) |
| גישה לדף | `document`, `localStorage` | לא קיים |
| קבצים ושרתים | אסור | המודולים `fs`, `http` |
| מידע על התוכנית | לא זמין | `process` |
| התיקייה של הקובץ | לא זמין | `__dirname`, `__filename` |
| איך מריצים | פותחים קובץ HTML | `node main.js` בטרמינל |

`console.log`, `setTimeout`, `fetch`, `JSON` ו-`Promise` עובדים בשני המקומות.

> **סביבת תרגול:** השיעורים במסלול הזה רצים ב-Node קטן לתרגול שנמצא בתוך הדף. הקבצים נשמרים בזיכרון והרשת מדומה, אבל הקוד שאתם כותבים הוא אותו קוד שהייתם מריצים ב-Node אמיתית. לחצו על הכפתור "הגדרה" (Setup) כדי לראות איך מתקינים Node על המחשב שלכם.

## האובייקט process

`process` הוא אובייקט (object) גלובלי שמתאר את התוכנית הרצה שלכם. אין צורך לייבא אותו אף פעם.

```js
console.log(process.argv);          // the command line words: [node path, script path, ...extras]
console.log(process.argv.slice(2)); // only the extras you typed after "node main.js"
console.log(process.env.HOME);      // an environment variable (undefined if missing)
console.log(process.cwd());         // the folder you started the program from
```

אם הרצתם `node main.js hello world`, אז `process.argv.slice(2)` יהיה `["hello", "world"]`. שני הערכים הראשונים (תוכנית Node והסקריפט שלכם) תמיד קיימים, ולכן אנחנו מדלגים עליהם עם `slice(2)`.

**משתני סביבה** (environment variables) הם הגדרות שנמצאות מחוץ לקוד שלכם, כמו מספר פורט או מפתח סודי. קוראים אותם מ-`process.env`. מכיוון שהערך עלול להיות חסר, תנו לו ערך ברירת מחדל עם `||`:

```js
const port = process.env.PORT || 3000;
```

## המיקום של הקובץ שלכם

ל-Node יש מידע על המקום של כל קובץ. `__dirname` היא התיקייה שמכילה את הקובץ הנוכחי, ו-`__filename` הוא הנתיב המלא של הקובץ. תמיד בנו נתיבים עם המודול `path` ולא בהדבקת מחרוזות (strings), כי ב-Windows משתמשים ב-`\` וב-Linux וב-macOS משתמשים ב-`/`:

```js
const path = require('path');
const file = path.join(__dirname, 'data', 'notes.txt');
path.basename(file); // "notes.txt"
path.extname(file);  // ".txt"
path.dirname(file);  // the folder that holds notes.txt
```

## האובייקט הגלובלי

בדפדפן, `var x = 1` ברמה העליונה הופך ל-`window.x`. ב-Node כל קובץ הוא **מודול** (module) נפרד, ולכן משתנים (variables) ברמה העליונה נשארים פרטיים לאותו קובץ. כדי לשתף משהו באופן גלובלי צריך להניח אותו ב-`globalThis` בכוונה, וזה רעיון שלא מומלץ לרוב:

```js
var local = 1;
globalThis.shared = 2;
console.log(globalThis.local); // undefined
console.log(shared);           // 2
```

> **שימו לב:**
> - **שמות שקיימים רק בדפדפן.** שימוש ב-`window`, ב-`document` או ב-`alert` ב-Node גורם ל-`ReferenceError: window is not defined`. בדקו עם `typeof window !== 'undefined'` אם אותו קוד צריך לרוץ בשני המקומות. `typeof` אף פעם לא קורס, גם על שמות שלא קיימים.
> - **קריאת `process.env.PORT` כמספר.** משתני סביבה הם תמיד טקסט, ולכן `process.env.PORT` הוא `"8080"` ולא `8080`. המירו אותו עם `Number(...)` כשצריך מספר.
> - **שכחת `slice(2)` על `process.argv`.** בלעדיו התוכנית שלכם סופרת גם את קובץ ההפעלה של Node ואת הנתיב של הסקריפט כארגומנטים.
> - **בניית נתיבים עם `+ '/'`.** זה נשבר ב-Windows. השתמשו ב-`path.join`.

## להמשך

נסו את `console.log(process.platform)` ואת `console.log(typeof require)`. התשובה לשנייה מראה ש-`require` היא פונקציה (function) ש-Node נותנת לכל קובץ, והשיעורים הבאים בנויים עליה.

> **תורכם:** השלימו את ששת הצעדים המממוספרים ב-`main.js`. זהו את Node עם `typeof process`, זהו שאין `window`, קראו את `process.env.APP_NAME` עם ערך ברירת מחדל, ספרו את מילות שורת הפקודה הנוספות, בנו את `data/notes.txt` עם `path.join(__dirname, ...)` והניחו את 42 ב-`globalThis` בשם `answer`. אמורות להופיע שמונה שורות פלט.
