---
title: "מודולים: חלוקת קוד לקבצים"
summary: "שתפו קוד בין קבצים עם module.exports ו-require, טענו קובצי JSON, והכירו את החלופה import/export."
hints:
  - "קובץ משתף דברים על ידי השמה ל-module.exports. קובץ אחר מקבל בדיוק את הערך הזה מ-require('./name'). נתיבים לקבצים שלכם מתחילים ב-./ והסיומת .js היא רשות."
  - "calculator.js: module.exports = { add, multiply }; greeter.js: module.exports = greet; main.js: calculator = require('./calculator'), greet = require('./greeter'), settings = require('./settings.json')."
  - "ב-calculator.js הוסיפו: module.exports = { add, multiply }; ב-greeter.js הוסיפו: module.exports = greet; ב-main.js כתבו: const calculator = require('./calculator'); const greet = require('./greeter'); const settings = require('./settings.json');"
quiz:
  - q: "מה מחזיר require('./greeter')?"
    options: ["כל מה ש-greeter.js השים ל-module.exports", "את הטקסט של הקובץ greeter.js", "כל משתנה שהוגדר ב-greeter.js"]
    explain: "משתנים בתוך קובץ הם פרטיים. רק מה שהקובץ מניח על module.exports עובר לקובץ שקורא ל-require."
  - q: "קובץ נטען פעמיים באותה תוכנית עם require. כמה פעמים הקוד שלו רץ?"
    options: ["פעמיים, פעם אחת בכל require", "פעם אחת: Node זוכרת (שומרת במטמון) את התוצאה", "זה תלוי בגודל הקובץ"]
    explain: "Node מריצה מודול בפעם הראשונה שהוא נטען, ובפעמים הבאות מחזירה את אותו אובייקט exports. ולכן counter ו-counterAgain הם אותו אובייקט."
  - q: "איזו שורה היא הדרך של מודולי ES (import/export) לייצא פונקציה בשם add?"
    options: ["module.exports = add;", "require.export(add);", "export function add(a, b) { ... }"]
  - q: "למה require('./calculator') מתחיל ב-./ ואילו require('path') לא?"
    options: ["./ אומר 'קובץ לידי', ושם רגיל אומר מודול מובנה או חבילה מותקנת", "./ גורם לקובץ להיטען מהר יותר", "שמות רגילים מיועדים רק לקובצי JSON"]
messages:
  - "ייצאו מקובצי העזר עם module.exports."
  - "טענו את calculator.js עם require('./calculator')."
  - "טענו את greeter.js עם require('./greeter')."
  - "טענו את קובץ ה-JSON עם require('./settings.json')."
---

תוכנית קטנטנה נכנסת בקובץ אחד. לשרת אמיתי יש עשרות קבצים: נתיבים (routes), פונקציות עזר, הגדרות. **מערכת המודולים** של Node מאפשרת לכל קובץ לשמור משתנים (variables) פרטיים משלו ולשתף רק את מה שהוא בוחר. בסוף השיעור תוכלו לפצל תוכנית לקבצים ולטעון אותם שוב.

## קובץ אחד הוא מודול אחד

ב-Node כל קובץ הוא **מודול** (module). משתנים ופונקציות שאתם מגדירים בקובץ הם פרטיים לו, וקובץ אחר לא רואה אותם. כדי לשתף משהו, הקובץ מניח אותו על אובייקט (object) מיוחד בשם `module.exports`. קובץ אחר מקבל את הערך הזה מ-`require`:

```js
// math.js
function double(n) {
  return n * 2;
}
module.exports = double;
```

```js
// main.js
const double = require('./math');
console.log(double(21)); // prints: 42
```

צעד אחרי צעד:

- `module.exports = double` קובע **מה הקובץ מוסר החוצה**. זה יכול להיות פונקציה (function), אובייקט, מחלקה (class) או מספר.
- `require('./math')` מריץ את `math.js` (רק בפעם הראשונה) ומחזיר את מה שהוא ייצא.
- הנתיב `./math` פירושו "הקובץ `math.js` באותה תיקייה". `./` מתחיל מהתיקייה הנוכחית ו-`../` עולה תיקייה אחת למעלה. הסיומת `.js` היא רשות. שם בלי `./`, כמו `require('path')`, פירושו מודול מובנה או חבילה מותקנת.

## ייצוא של כמה דברים

לרוב קובץ מציע יותר מדבר אחד, ולכן מייצאים **אובייקט**. הקובץ המייבא יכול לקחת את האובייקט כולו או לבחור ממנו חלקים בעזרת פירוק (destructuring):

```js
// shapes.js
const PI = 3.14159;
function circleArea(r) { return PI * r * r; }
module.exports = { PI, circleArea };   // shorthand for { PI: PI, circleArea: circleArea }

// main.js
const { circleArea } = require('./shapes');
```

כל דבר ש**לא** רשמתם נשאר פרטי. זה שימושי: כך לקובץ יכולות להיות פונקציות עזר שאף אחד אחר לא יכול להישען עליהן.

## מודולים רצים פעם אחת

Node שומרת במטמון (cache) כל מודול. ה-`require` הראשון מריץ את הקובץ ושומר את מה שהוא ייצא, וקריאות מאוחרות יותר מחזירות את **אותו אובייקט**. בגלל זה מודול יכול להחזיק מצב, כמו מונה או רשימת משתמשים, שכל שאר הקבצים חולקים. ובגלל זה גם `console.log` בראש מודול מדפיס רק פעם אחת, וזה מה שתראו בתרגיל.

## קובצי JSON

`require` יכול לטעון גם קובץ `.json`. Node מפענחת אותו בשבילכם ומחזירה אובייקט רגיל, ולכן `require('./settings.json')` היא דרך מהירה לקרוא הגדרות. (שיעור 3 מראה איך לקרוא ולכתוב JSON עם מערכת הקבצים.)

## הסגנון השני: import ו-export

ל-JavaScript יש גם תחביר מודולים חדש ורשמי יותר, שנקרא **מודולי ES** (ES modules). הוא עושה את אותה עבודה:

```js
// math.js
export function double(n) { return n * 2; }
export default function triple(n) { return n * 3; }

// main.js
import triple, { double } from './math.js';
import { readFileSync } from 'node:fs';
```

| | CommonJS (המסלול הזה) | מודולי ES |
| --- | --- | --- |
| שיתוף | `module.exports = ...` | `export` / `export default` |
| טעינה | `const x = require('./x')` | `import x from './x.js'` |
| מודולים מובנים | `require('fs')` | `import fs from 'node:fs'` |

CommonJS היא מה שרוב המדריכים והפרויקטים הישנים של Node משתמשים בו, ולכן המסלול הזה משתמש בו. ב-Node אמיתית פרויקט בדרך כלל בוחר סגנון אחד: מודולי ES דורשים `"type": "module"` בקובץ `package.json` (או את הסיומת `.mjs`). סביבת התרגול מקבלת את שניהם, כך שאפשר לנסות כל אחד. כל מה שלמדתם על מודולים (פרטיים כברירת מחדל, משותפים בעזרת ייצוא, רצים פעם אחת) נכון בשני הסגנונות.

> **שימו לב:**
> - **שכחת `./`.** `require('calculator')` נכשל עם `Cannot find module 'calculator'`, כי Node מחפשת מודול מובנה או חבילה מותקנת. השתמשו ב-`require('./calculator')`.
> - **שכחת הייצוא.** אם `calculator.js` אף פעם לא מגדיר את `module.exports`, תקבלו אובייקט ריק ואת השגיאה `calculator.add is not a function` (שגיאת `TypeError`).
> - **ייצוא בצורה לא נכונה.** `module.exports = { greet }` ואחריו `const greet = require('./greeter')` נותן אובייקט, ולכן `greet('Ada')` נכשל עם `greet is not a function`. או שמייצאים את הפונקציה ישירות, או שמפרקים: `const { greet } = require(...)`.
> - **טעינות מעגליות.** אם `a.js` טוען את `b.js` ו-`b.js` טוען את `a.js`, אחד מהם רואה ייצוא חצי גמור. העבירו את הקוד המשותף לקובץ שלישי.

## להמשך

שנו את שלושת הקבצים כך שישתמשו ב-`export` וב-`import` במקום זה (הוסיפו `.js` לנתיבי ה-import) והריצו שוב. ב-`greeter.js` תכתבו `export default function greet...`, וב-`main.js` תכתבו `import greet from './greeter.js'`.

> **תורכם:** גרמו ל-`main.js` לעבוד. ב-`calculator.js` ייצאו אובייקט עם `add` ו-`multiply` (בלי `round2`), ב-`greeter.js` ייצאו את הפונקציה `greet` עצמה, וב-`main.js` טענו את שלושת הקבצים עם `require`: `./calculator`, `./greeter` ו-`./settings.json`. תשע שורות אמורות להיות מודפסות.
