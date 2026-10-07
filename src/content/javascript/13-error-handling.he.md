---
title: "טיפול בשגיאות עם try ו-catch"
summary: "זרקו שגיאות משלכם והמשיכו להריץ את התוכנית כשמשהו משתבש."
hints:
  - "שימו את הקריאה המסוכנת בבלוק try, טפלו בבעיה בבלוק catch שמקבל את השגיאה, ושימו את הקוד שתמיד רץ בבלוק שלישי."
  - "try { ... } catch (error) { ... } finally { ... }. לאובייקט השגיאה יש מאפיין .message עם הטקסט שהועבר ל-new Error(...)."
  - "try { const age = parseAge(text); console.log(\"Age: \" + age); } catch (error) { console.log(\"Error: \" + error.message); } finally { console.log(\"checked\"); }"
quiz:
  - q: "מה קורה לשאר בלוק try אחרי ששורה זורקת שגיאה?"
    options: ["הוא ממשיך לרוץ", "מדלגים עליו ובלוק catch רץ", "התוכנית מתחילה מחדש"]
  - q: "איך יוצרים שגיאה משלכם?"
    options: ["error('message')", "return Error('message')", "throw new Error('message')"]
  - q: "מתי בלוק finally רץ?"
    options: ["רק אם הייתה שגיאה", "תמיד, עם שגיאה או בלעדיה", "רק אם לא הייתה שגיאה"]
  - q: "מה מכיל  error.message  ?"
    options: ["את הטקסט שהועבר ל-new Error()", "את מספר השורה", "את שם הקובץ"]
messages:
  - "השתמשו בבלוק try { ... }."
  - "הוסיפו בלוק catch (error) { ... }."
  - "הוסיפו בלוק finally { ... }."
---

דברים משתבשים בתוכניות אמיתיות: משתמש מקליד אותיות איפה שצריך להיות מספר, קובץ חסר, הרשת נפלה. בלי טיפול, שגיאה אחת עוצרת את כל התוכנית. עם **try ו-catch** אפשר להגיב לבעיות בשלווה ולהמשיך.

## מהי שגיאה?

כש-JavaScript לא יכולה לעשות את מה שביקשתם, היא **זורקת** (throws) שגיאה ומפסיקה להריץ את הקוד הנוכחי:

```js
const user = undefined;
console.log(user.name); // TypeError: Cannot read properties of undefined (reading 'name')
console.log("never reached");
```

ראיתם הודעות כאלה באדום בחלונית הפלט. סוגי שגיאות נפוצים:

| סוג | סיבה אופיינית |
| --- | --- |
| `ReferenceError` | שימוש בשם שלא קיים |
| `TypeError` | שימוש בערך בצורה שגויה, כמו קריאה למשהו שאינו פונקציה |
| `SyntaxError` | הקוד כתוב בצורה לא נכונה |
| `Error` | שגיאה כללית, שלרוב נזרקת מהקוד שלכם |

## try ו-catch

עטפו קוד מסוכן ב-`try`. אם משהו בפנים זורק שגיאה, JavaScript קופצת ישר ל-`catch`, והתוכנית **ממשיכה** אחר כך:

```js
try {
  const data = JSON.parse("not json");
  console.log("parsed!");          // skipped
} catch (error) {
  console.log("Could not parse: " + error.name);
}
console.log("still running");
// prints:
// Could not parse: SyntaxError
// still running
```

- `catch (error)` נותן שם לשגיאה שנזרקה (כל שם שתרצו) בתוך בלוק ה-catch.
- `error.message` הוא הטקסט שמתאר את הבעיה, ו-`error.name` הוא הסוג.
- שורות בתוך `try` אחרי השורה שנכשלה מדולגות.

## לזרוק שגיאות משלכם

אפשר להעלות שגיאה בעצמכם כשערך אינו קביל, בעזרת `throw new Error("message")`:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  divide(1, 0);
} catch (e) {
  console.log(e.message); // prints: Cannot divide by zero
}
```

זה טוב יותר מאשר להחזיר בשקט תשובה שגויה. הפונקציה אומרת "אני לא יכולה לעשות את זה", והקורא מחליט מה לעשות.

## finally

בלוק `finally` רץ **תמיד**: אחרי ה-try אם הכול עבר בשלום, ואחרי ה-catch אם הייתה שגיאה. זה המקום הנכון לניקיון, כמו הסתרת הודעת טעינה:

```js
try {
  console.log("working");
} finally {
  console.log("done");
}
```

## מתי להשתמש בזה?

השתמשו ב-`try/catch` סביב דברים שיכולים להיכשל מסיבות שאינן בשליטתכם: ניתוח קלט של משתמש, קריאת נתונים, בקשות רשת. אל תעטפו הכול רק כדי להסתיר באגים. אם בקוד שלכם יש שגיאת כתיב, תקנו אותה.

> **שימו לב:**
> - כתיבת `catch` בלי שם כשאתם צריכים את השגיאה, ואז שימוש ב-`error`: `ReferenceError: error is not defined`.
> - בליעת שגיאות עם בלוק `catch {}` ריק. הבעיה נעלמת בשקט ולא תדעו מה השתבש. לפחות הדפיסו אותה.
> - זריקת טקסט רגיל: `throw "oops"` עובדת אבל לא נותנת `.message` או stack. זרקו `new Error("oops")`.
> - ציפייה ש-`try/catch` יתפוס שגיאות תחביר או שגיאות כתיב בקוד שלא רץ. `SyntaxError` עוצרת את כל הקובץ לפני שהוא מתחיל.
> - לשכוח שמשתנים שהוגדרו עם `const` בתוך `try { }` לא קיימים ב-`catch` או אחריו, בגלל scope של בלוק. הגדירו אותם לפני ה-`try`.
> - שימוש ב-`return` בתוך `try` והפתעה מכך ש-`finally` עדיין רץ. הוא רץ, לפני שהפונקציה חוזרת.

## להמשיך הלאה

גרמו ל-`parseAge` לדחות גם גילאים מעל 150 עם הודעה משלה. נסו `JSON.parse` בתוך פונקציה `safeParse` שמחזירה `null` כשהטקסט לא תקין.

> **תורכם:** כתבו את `safeAge(text)` עם `try`, `catch` ו-`finally` כפי שההערות מתארות.
