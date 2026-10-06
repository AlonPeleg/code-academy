---
title: "פונקציות"
summary: "עוטפים קוד לשימוש חוזר בתוך פונקציה."
hints:
  - "פונקציה מקבלת קלטים (פרמטרים) ומחזירה ערך באמצעות return. אתם צריכים שלוש פונקציות, בדיוק עם השמות שבהם משתמשים בתחתית הקוד."
  - "double היא פונקציה רגילה, square היא פונקציית חץ (arrow function) ששמורה ב-const, ו-greet בונה את התשובה שלה עם template literal באמצעות גרשיים הפוכים (backticks)."
  - "function double(n) { return n * 2; }   const square = (n) => n * n;   function greet(name) { return `Hello, ${name}!`; }"
quiz:
  - q: "מה עושה  return  בתוך פונקציה?"
    options: ["מדפיס ערך", "עוצר את כל התוכנית לתמיד", "שולח ערך בחזרה למי שקרא לפונקציה"]
  - q: "איזו מהאפשרויות היא פונקציית חץ?"
    options: ["const f = (x) => x + 1;", "function => f(x) {}", "def f(x): x + 1"]
  - q: "בתוך template string, איך מכניסים משתנה?"
    options: ["{name}", "${name}", "%name%"]
    explain: "ב-template strings משתמשים בגרשיים הפוכים (backticks) ובחריצים מהצורה ${...}."
  - q: "מה פונקציה מחזירה אם אין בה משפט return?"
    options: ["0", "מחרוזת ריקה", "undefined"]
---

**פונקציה** (function) היא בלוק קוד עם שם שאפשר להריץ מתי שרוצים, כמה פעמים שרוצים. בעזרת פונקציות מתכנתים נמנעים מלחזור על עצמם, ובעזרתן מחלקים תוכניות גדולות לחלקים קטנים וברורים.

## הגדרה וקריאה

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // prints: 5
console.log(add(10, 5)); // prints: 15
```

- `function` היא מילת המפתח שפותחת הגדרה.
- `add` הוא ה**שם** של הפונקציה.
- `a` ו-`b` הם **פרמטרים** (parameters): שמות לקלטים שהפונקציה מקבלת.
- הקוד שבתוך `{ }` הוא ה**גוף** (body).
- `return` שולח תוצאה בחזרה ועוצר את הפונקציה.
- כדי להריץ את הפונקציה **קוראים** לה: כותבים את שמה ואחריו סוגריים עם ה**ארגומנטים** (arguments), הערכים עצמם: `add(2, 3)`.

הגדרת פונקציה לא עושה שום דבר בפני עצמה. זה כמו לכתוב מתכון. הקוד רץ רק כשקוראים לה.

## return לעומת console.log

בלבול נפוץ:

```js
function showDouble(n) {
  console.log(n * 2);    // prints, but gives back nothing
}

function double(n) {
  return n * 2;          // gives the value back
}

const x = double(4) + 1; // 9: we can keep working with the result
```

`console.log` נועד לבני אדם שקוראים את הפלט. `return` נועד לשאר התוכנית. העדיפו פונקציות שמחזירות ערכים, והדפיסו מחוץ להן.

## פונקציות חץ

ל-JavaScript יש דרך קצרה יותר לכתוב פונקציות, עם `=>`:

```js
const add = (a, b) => a + b;
```

כשהגוף הוא ביטוי (expression) אחד, התוצאה מוחזרת אוטומטית. אם יש כמה שורות, משתמשים בסוגריים מסולסלים וב-`return` מפורש:

```js
const area = (w, h) => {
  const result = w * h;
  return result;
};
```

כשיש בדיוק פרמטר אחד אפשר להשמיט את הסוגריים: `n => n * n`.

## ערכי ברירת מחדל

לפרמטר אפשר לתת ערך חלופי למקרה שהקורא לא מעביר כלום:

```js
function greet(name = "friend") {
  return `Hello, ${name}!`;
}
console.log(greet());      // prints: Hello, friend!
console.log(greet("Ava")); // prints: Hello, Ava!
```

## Template strings

גרשיים הפוכים (backticks) ו-`${...}` מאפשרים לערבב טקסט עם ערכים: `` `Hello, ${name}!` ``. כבר הכרתם את זה בשיעור על מחרוזות. זו הדרך הקלה ביותר לבנות משפט בתוך פונקציה.

## בשביל מה כל זה?

כותבים את הלוגיקה פעם אחת ואז משתמשים בה שוב: `double(7)`, `double(100)`, `double(0.5)`. אם מוצאים באג (bug), מתקנים אותו במקום אחד.

> **שימו לב:**
> - שכחתם `return`: פונקציה בלעדיו מחזירה `undefined`, ולכן `console.log(double(7))` מדפיס `undefined`.
> - שכחתם לקרוא לפונקציה. כתיבת `greet` בלבד לא מריצה אותה. צריך לכתוב `greet("Ava")`.
> - קריאה לפונקציית חץ לפני שהוגדרה: `square(3); const square = ...` גורמת ל-`ReferenceError: Cannot access 'square' before initialization`. אפשר לקרוא להצהרות `function` רגילות לפני ההגדרה, אבל לפונקציות חץ ששמורות ב-`const` אי אפשר.
> - קוד שנמצא אחרי `return` אף פעם לא רץ.
> - אי התאמה בין שמות: אם הפרמטר הוא `n` אבל הגוף משתמש ב-`x`, תקבלו `ReferenceError: x is not defined`.
> - קריאה לפונקציה עם מספר שגוי של ארגומנטים: ארגומנטים חסרים הופכים ל-`undefined`, וזה נותן `NaN` בחישובים.

## להמשיך הלאה

כתבו את `isEven(n)` שמחזירה `true` או `false`, ואת `max(a, b)` שמחזירה את המספר הגדול יותר באמצעות `if`. כתבו מחדש את `double` כפונקציית חץ.

> **תורכם:** כתבו את `double`, `square` ו-`greet` כך ששלוש שורות ה-`console.log` שבתחתית ידפיסו נכון.
