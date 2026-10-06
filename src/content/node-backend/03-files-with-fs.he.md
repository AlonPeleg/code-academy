---
title: "קריאה וכתיבה של קבצים עם fs"
summary: "השתמשו במודול fs כדי ליצור תיקיות, לכתוב, לקרוא ולהוסיף לקבצים, להציג תוכן של תיקייה ולשמור נתונים כ-JSON."
hints:
  - "לרוב הפונקציות של fs יש גרסת Sync שעושה את העבודה מיד ומחזירה את התוצאה: mkdirSync, writeFileSync, readFileSync, appendFileSync, readdirSync, unlinkSync. תוכן של קובץ הוא טקסט, ולכן נתוני JSON צריכים JSON.stringify לפני השמירה ו-JSON.parse אחרי הקריאה."
  - "צעדים 2 ו-3: fs.writeFileSync(notesFile, JSON.stringify(data, null, 2)); notes = JSON.parse(fs.readFileSync(notesFile, 'utf8')). צעד 6: שימו את ה-readFileSync שנכשל בתוך try { } catch (error) { console.log('error code: ' + error.code); }. צעד 7: const text = await fs.promises.readFile(notesFile, 'utf8');"
  - "fs.mkdirSync(dataDir, { recursive: true }); fs.writeFileSync(notesFile, JSON.stringify([{ id: 1, text: 'Buy milk' }], null, 2)); notes = JSON.parse(fs.readFileSync(notesFile, 'utf8')); notes.push({ id: 2, text: 'Learn Node' }); fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2)); fs.appendFileSync(logFile, 'started\\n'); fs.appendFileSync(logFile, 'saved\\n'); names = fs.readdirSync(dataDir); fs.unlinkSync(logFile);"
quiz:
  - q: "למה fs.readFileSync(file, 'utf8') צריכה את הארגומנט 'utf8' כדי להחזיר טקסט?"
    options: ["בלעדיו מקבלים בייטים גולמיים (Buffer) ולא מחרוזת", "בלעדיו הקובץ לא נפתח", "utf8 גורם לקריאה להיות מהירה יותר"]
    explain: "קובץ הוא פשוט בייטים. הקידוד 'utf8' אומר ל-Node להפוך את הבייטים האלה למחרוזת רגילה."
  - q: "מה ההבדל בין writeFileSync ל-appendFileSync?"
    options: ["הן אותה פונקציה", "appendFileSync מוסיפה לסוף, ו-writeFileSync מחליפה את כל התוכן", "writeFileSync עובדת רק עם JSON"]
  - q: "מה קורה כשקוראים ל-fs.readFileSync על קובץ שלא קיים?"
    options: ["מקבלים מחרוזת ריקה", "מקבלים undefined", "נזרקת שגיאה עם הקוד ENOENT"]
    explain: "ENOENT פירושו 'error, no entry': הנתיב לא קיים. עטפו את הקריאה ב-try/catch כשהקובץ עלול להיות חסר."
  - q: "למה גרסת ה-promise (fs.promises) בדרך כלל טובה יותר לשרת מגרסת ה-Sync?"
    options: ["פונקציות Sync לא יכולות לקרוא JSON", "בזמן שקריאת Sync מחכה לדיסק, כל השרת קפוא ולא יכול לענות לאף אחד", "גרסת ה-promise תמיד קצרה יותר"]
messages:
  - "צרו את התיקייה עם fs.mkdirSync."
  - "הפכו את המערך לטקסט JSON עם JSON.stringify."
  - "הפכו את הטקסט חזרה למערך עם JSON.parse."
  - "הוסיפו שורות ללוג עם fs.appendFileSync."
  - "השתמשו בגרסת ה-promise: fs.promises.readFile."
  - "מחקו את הקובץ עם fs.unlinkSync."
---

כמעט כל backend קורא או כותב קבצים: הגדרות, תמונות שהועלו, לוגים, "מסד נתונים" קטן של JSON. המודול המובנה `fs` של Node (מערכת הקבצים, file system) עושה את כל זה. בשיעור הזה תשמרו ותטענו נתונים, תיצרו תיקיות ותטפלו בשגיאות שקבצים אוהבים לייצר.

> **סביבת תרגול:** הקבצים שאתם יוצרים כאן נשמרים בזיכרון ונעלמים אחרי כל הרצה, והתוכנית מתחילה עם תיקיית `/app` ריקה. ב-Node אמיתית אותו קוד כותב לדיסק האמיתי שלכם. כל השאר זהה.

## טעינת המודול

`fs` מובנה, ולכן טוענים אותו עם require בלי `./`. בנו נתיבים עם `path.join(__dirname, ...)` כדי שיעבדו מכל תיקייה:

```js
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'hello.txt');
```

## הפונקציות העיקריות

| משימה | פונקציה |
| --- | --- |
| האם הנתיב קיים? | `fs.existsSync(path)` מחזירה `true` או `false` |
| יצירת תיקייה | `fs.mkdirSync(path, { recursive: true })` |
| כתיבה (מחליפה הכול) | `fs.writeFileSync(path, text)` |
| הוספה לסוף | `fs.appendFileSync(path, text)` |
| קריאה | `fs.readFileSync(path, 'utf8')` |
| רשימת תוכן של תיקייה | `fs.readdirSync(path)` מחזירה מערך (array) של שמות |
| מחיקת קובץ | `fs.unlinkSync(path)` |

```js
fs.writeFileSync(file, 'line 1\n');
fs.appendFileSync(file, 'line 2\n');
const text = fs.readFileSync(file, 'utf8');
console.log(text);
// prints:
// line 1
// line 2
```

שלושה פרטים: `'\n'` הוא תו השורה החדשה שמסיים שורה; `'utf8'` אומר ל-Node להחזיר מחרוזת (string) ולא בייטים גולמיים; ו-`{ recursive: true }` גורם ל-`mkdirSync` ליצור כל תיקייה חסרה בדרך, ולא להתלונן אם התיקייה כבר קיימת.

## קובצי JSON

קובץ מחזיק רק טקסט, אבל התוכנית שלכם עובדת עם מערכים ואובייקטים (objects). **JSON** הוא הגשר:

```js
const users = [{ id: 1, name: 'Ada' }];
fs.writeFileSync('users.json', JSON.stringify(users, null, 2)); // object -> text
const back = JSON.parse(fs.readFileSync('users.json', 'utf8')); // text -> object
```

`JSON.stringify(value, null, 2)` יוצרת טקסט יפה, עם הזחה של 2 רווחים. התבנית "לקרוא, לשנות, לכתוב" היא הדרך שבה פרויקט קטן שומר נתונים בלי מסד נתונים.

## שלוש גרסאות של אותה פונקציה

כל פונקציה קיימת בשלושה סגנונות:

```js
// 1. Sync: waits and returns the result (simple, but blocks everything else)
const a = fs.readFileSync(file, 'utf8');

// 2. Callback: the result arrives later in a function you give
fs.readFile(file, 'utf8', (error, data) => { /* ... */ });

// 3. Promise: use with await (best for servers)
const b = await fs.promises.readFile(file, 'utf8');
```

בזמן שקריאת Sync מחכה לדיסק, שום דבר אחר בתוכנית שלכם לא יכול לרוץ. זה בסדר לסקריפט פתיחה שטוען הגדרות פעם אחת, אבל שרת אינטרנט שעונה להרבה אנשים צריך להשתמש בגרסת ה-promise. את ה-callbacks וה-promises תכירו כמו שצריך בשיעור הבא.

## טיפול בשגיאות

קבצים לא אמינים: ייתכן שהם לא קיימים, או שהתיקייה חסרה. Node מדווחת על כך בשגיאה שהמאפיין `code` שלה אומר לכם למה:

```js
try {
  fs.readFileSync('missing.txt', 'utf8');
} catch (error) {
  console.log(error.code);    // ENOENT
  console.log(error.message); // ENOENT: no such file or directory, open 'missing.txt'
}
```

> **שימו לב:**
> - **`ENOENT: no such file or directory`.** הנתיב שגוי או שהתיקייה עדיין לא קיימת. צרו קודם את התיקייה עם `mkdirSync(..., { recursive: true })`, והשתמשו ב-`path.join(__dirname, ...)` כדי שהנתיב לא יהיה תלוי במקום שבו הפעלתם את התוכנית.
> - **שכחת הקידוד.** בלי `'utf8'`, הפונקציה `readFileSync` מחזירה Buffer (בייטים), ו-`JSON.parse(buffer)` או `text.split` יפתיעו אתכם. השתמשו ב-`.toString()` או העבירו `'utf8'`.
> - **שמירת אובייקט ישירות.** `fs.writeFileSync('a.json', obj)` כותבת `[object Object]`. השתמשו ב-`JSON.stringify(obj)`.
> - **`SyntaxError: Unexpected end of JSON input`.** פענחתם קובץ ריק או כזה שנכתב חלקית. ודאו שיש בקובץ תוכן לפני שאתם קוראים ל-`JSON.parse`.
> - **שימוש ב-`writeFileSync` כדי להוסיף שורה.** היא מחליפה את כל הקובץ. השתמשו ב-`appendFileSync`.

## להמשך

עטפו את "לקרוא את קובץ ה-JSON, או להחזיר מערך ריק אם הוא לא קיים" בפונקציה (function) בשם `loadNotes()` והשתמשו קודם ב-`fs.existsSync`. בדיוק ברעיון הזה תשתמשו בשיעור מאוחר יותר כדי לתת ל-API מסד נתונים מבוסס קבצים.

> **תורכם:** בצעו את שמונת הצעדים המממוספרים ב-`main.js`: צרו את התיקייה `data`, שמרו וטענו מחדש את `notes.json`, הוסיפו שתי שורות ל-`log.txt`, הציגו את רשימת התיקייה, תפסו את שגיאת `ENOENT`, קראו את ההערות עם `fs.promises.readFile` ולבסוף מחקו את קובץ הלוג.
