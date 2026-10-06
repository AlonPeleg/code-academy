---
title: "try, catch, finally ו-throw"
summary: "מטפלים בכשלים בצורה נעימה, זורקים שגיאות משלכם ויוצרים סוגי שגיאה מותאמים."
hints:
  - "parseAge צריכה לזרוק שגיאה (ולא להדפיס) כשהקלט פגום. tryParse עוטפת את הקריאה ב-try, מטפלת ב-ValidationError ב-catch ותמיד מדפיסה את שורת ה-checked ב-finally."
  - "ב-catch (error): if (error instanceof ValidationError) { console.log(...) } else { throw error; }.  ב-parseAge: const age = Number(text); ואז שני משפטי if שזורקים."
  - "function parseAge(text) { const age = Number(text); if (text.trim() === \"\" || Number.isNaN(age)) throw new ValidationError(\"Age must be a number\", \"age\"); if (age < 0 || age > 120) throw new ValidationError(\"Age must be between 0 and 120\", \"age\"); return age; }   function tryParse(text) { try { console.log(\"OK: \" + parseAge(text)); } catch (error) { if (error instanceof ValidationError) { console.log(\"Invalid (\" + error.field + \"): \" + error.message); } else { throw error; } } finally { console.log(\"checked: \" + text); } }"
messages:
  - "השתמשו ב-throw new ValidationError(message, \"age\") בתוך parseAge."
  - "ל-tryParse צריך בלוק catch."
  - "השתמשו בבלוק finally בשביל שורת ה-checked."
  - "השתמשו ב-error instanceof ValidationError כדי לזהות את השגיאות שלכם."
quiz:
  - q: "מתי בלוק finally רץ?"
    options: ["רק אם הייתה שגיאה", "רק אם לא הייתה שגיאה", "תמיד, בין אם קרתה שגיאה ובין אם לא"]
  - q: "מה ההבדל בין console.log(error) לבין throw error בתוך בלוק catch?"
    options: ["אין הבדל", "log רק מדפיס, ואילו throw מעביר את השגיאה הלאה כך שמשהו אחר (או התוכנית) עדיין יכול להגיב אליה", "throw מדפיס באדום"]
  - q: "למה כותבים throw new Error(\"message\") ולא throw \"message\"?"
    options: ["אובייקט Error נושא שם, הודעה ו-stack trace שעוזרים לדבג", "אי אפשר לזרוק מחרוזות בכלל", "זה מהר יותר לתוכנית"]
    explain: "אפשר לזרוק כל ערך, אבל רק אובייקטי Error (ומחלקות שמרחיבות את Error) נותנים לכם את ה-stack trace."
  - q: "מה error instanceof ValidationError בודק?"
    options: ["אם הודעת השגיאה מכילה את המילה ValidationError", "אם השגיאה נוצרה מהמחלקה ValidationError (או ממחלקה שמרחיבה אותה)", "אם התוכנית תקינה"]
---
דברים משתבשים בתוכניות אמיתיות: משתמש מקליד אותיות איפה שמצופה מספר, קובץ חסר, קריאת רשת נכשלת. בשיעור הזה תלמדו **לטפל** בכשלים עם `try`, `catch` ו-`finally`, ו**להעלות** שגיאות משלכם עם `throw` כדי שטעויות יתגלו מוקדם וברור.

## try / catch / finally

```js
function risky(shouldFail) {
  try {
    console.log("start");
    if (shouldFail) throw new Error("boom");
    console.log("no problem");
  } catch (error) {
    console.log("caught: " + error.message);
  } finally {
    console.log("always runs");
  }
}
risky(false);   // prints: start, no problem, always runs
risky(true);    // prints: start, caught: boom, always runs
```

* `try { }` הוא הקוד שעלול להיכשל.
* `catch (error) { }` רץ **רק אם** משהו בתוך `try` זרק שגיאה. אובייקט השגיאה מגיע ב-`error`.
* `finally { }` רץ **תמיד**: אחרי הצלחה, אחרי שגיאה שנתפסה, ואפילו אם ב-`try` יש `return`. זה המקום לניקוי: סגירת חיבור, הסתרת אנימציית טעינה, הדפסת שורת "סיימנו".

אפשר לכתוב `try/finally` בלי `catch`; אז השגיאה ממשיכה כלפי מעלה אחרי שהניקוי רץ.

## זריקת שגיאות משלכם

`throw` עוצרת מיד את הפונקציה הנוכחית ושולחת שגיאה כלפי מעלה עד שמישהו תופס אותה:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
```

למה לזרוק במקום להחזיר משהו כמו `-1` או `null`? כי ערך החזרה מיוחד אפשר להתעלם ממנו בטעות, ושגיאה אי אפשר להתעלם ממנה: התוכנית נעצרת, או שהקורא מטפל בה. פונקציה שבודקת את הקלט שלה ונכשלת בקול רם קלה הרבה יותר לדיבאג מפונקציה שמפיקה שטויות בשקט. (זה נקרא **כישלון מהיר**, failing fast.)

תמיד זרקו אובייקט `Error`, לא מחרוזת. ל-`Error` יש `name`, `message` ו-`stack`:

```js
throw new Error("Out of stock");          // good
throw "Out of stock";                     // legal, but no stack trace
```

תת-הסוגים המובנים `TypeError` ו-`RangeError` הם בחירות טובות: `throw new RangeError("age must be 0 or more")`.

## סוגי שגיאה מותאמים

אם רוצים שהקוראים יגיבו אחרת לבעיות שונות, צרו מחלקה (class) משלכם שמרחיבה את `Error`:

```js
class NotFoundError extends Error {
  constructor(what) {
    super(what + " was not found");   // sets the message
    this.name = "NotFoundError";       // sets the name shown in logs
  }
}

try {
  throw new NotFoundError("user 7");
} catch (error) {
  console.log(error.name);                          // prints: NotFoundError
  console.log(error instanceof NotFoundError);      // prints: true
  console.log(error instanceof Error);              // prints: true
}
```

`instanceof` שואלת "האם זה נוצר מהמחלקה הזאת?". זה מאפשר לטפל בשגיאות שאתם מצפים להן ו**לזרוק מחדש** (re-throw) את כל השאר:

```js
catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Please check the id.");
  } else {
    throw error;   // not ours: let it continue
  }
}
```

בליעה שקטה של כל שגיאה מסוכנת, כי היא מסתירה גם באגים אמיתיים כמו שגיאות כתיב.

> **שימו לב:**
> * **תופסים יותר מדי.** `try` גדול סביב כל התוכנית מסתיר איפה הכישלון היה. שמרו על בלוקי `try` קטנים, סביב השורות שבאמת יכולות להיכשל.
> * **שוכחים `new`.** `throw Error("x")` עובד, אבל `throw ValidationError("x")` על מחלקה נכשל עם `TypeError: Class constructor ValidationError cannot be invoked without 'new'`.
> * **שוכחים `super(...)`.** במחלקה שמרחיבה את `Error`, הבנאי חייב לקרוא קודם ל-`super(message)`, אחרת מקבלים `ReferenceError: Must call super constructor in derived class before accessing 'this'`.
> * **מחרוזות ריקות.** `Number("")` הוא `0`, לא `NaN`! בדקו בעצמכם קלט ריק, כמו בתרגיל של השיעור הזה.

> **תורכם:** כתבו את `parseAge(text)` כך שתזרוק `ValidationError` עבור ערכים שאינם מספרים ועבור גילאים מחוץ לטווח 0 עד 120, ואת `tryParse(text)` כך שתדפיס `OK: <age>` או `Invalid (<field>): <message>`, תזרוק מחדש כל סוג שגיאה אחר, ותמיד תדפיס `checked: <text>` בבלוק `finally`.
