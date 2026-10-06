---
title: "פונקציות עם טיפוסים"
summary: "הגדירו טיפוסים לפרמטרים ולתוצאות, והפכו חלק מהארגומנטים לאופציונליים או תנו להם ערכי ברירת מחדל."
hints:
  - "סימן שאלה אחרי שם של פרמטר הופך אותו לאופציונלי. ערך ברירת מחדל נכתב עם סימן שווה אחרי הטיפוס."
  - "greet צריכה name: string ו-greeting?: string עם טיפוס החזרה string. repeat צריכה text: string, times: number = 2, וטיפוס ההחזרה void."
  - "function greet(name: string, greeting?: string): string {   ו-   function repeat(text: string, times: number = 2): void {"
quiz:
  - q: "מה משמעות ה-? ב-  function f(x?: number) ?"
    options: ["x חייב להיות מספר או מחרוזת", "אפשר להשמיט את x בקריאה ל-f", "f מחזירה שאלה"]
  - q: "איזה טיפוס החזרה נותנים לפונקציה שלא מחזירה כלום?"
    options: ["null", "never", "void"]
  - q: "מהו הטיפוס של הפרמטר  times  ב-  function repeat(times = 3) ?"
    options: ["number, מוסק מערך ברירת המחדל", "any", "זו שגיאה בלי הצהרת טיפוס"]
  - q: "איפה חייב להיות פרמטר חובה ביחס לפרמטרים אופציונליים?"
    options: ["פרמטרים חובה באים קודם", "פרמטרים אופציונליים באים קודם", "הסדר לא משנה"]
    explain: "אחרת הקורא לא היה יכול לדלג על האופציונלי. TypeScript מדווחת 'A required parameter cannot follow an optional parameter'."
messages:
  - "הצהירו על name:  name: string"
  - "הפכו את greeting לאופציונלי עם סימן שאלה:  greeting?: string"
  - "תנו ל-times טיפוס וברירת מחדל:  times: number = 2"
  - "repeat לא מחזירה כלום, ולכן הוסיפו טיפוס החזרה:  ): void {"
---

בפונקציות הטיפוסים משתלמים יותר מכול. פונקציה עם טיפוסים מתעדת את עצמה: כל מי שקורא לה יודע מה להעביר ומה יקבל בחזרה.

## פרמטרים וטיפוס החזרה

```ts
function area(width: number, height: number): number {
  return width * height;
}

console.log(area(3, 4)); // prints: 12
```

- כל פרמטר מקבל `name: type` משלו.
- הטיפוס שאחרי הסוגריים הוא **טיפוס ההחזרה** (return type).
- TypeScript יכולה בדרך כלל להבין את טיפוס ההחזרה מהפקודה `return`, אבל כתיבתו היא הרגל טוב לפונקציות מיוצאות או חשובות, והיא תופסת את המקרה שבו מחזירים בטעות את הדבר הלא נכון.

אם פונקציה עושה את עבודתה אבל לא מחזירה כלום (כמו הדפסה), טיפוס ההחזרה שלה הוא **`void`**:

```ts
function sayHi(name: string): void {
  console.log("Hi " + name);
}
```

## פרמטרים אופציונליים

הוסיפו סימן שאלה אחרי השם כדי לאפשר לקוראים להשמיט ארגומנט. בתוך הפונקציה הערך הוא אז או הטיפוס שכתבתם או `undefined`, ולכן צריך לטפל בשניהם:

```ts
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}!`;
}

greet("Ava");               // Hello, Ava!
greet("Noam", "Good day");  // Good day, Noam!
```

האופרטור `??` פירושו "השתמשו בערך שמשמאל, אלא אם הוא `undefined` או `null`; אז השתמשו בצד ימין".

## ערכי ברירת מחדל

**ערך ברירת מחדל** (default value) הוא דרך נוחה יותר לומר "אם לא הועבר כלום, השתמשו בזה":

```ts
function repeat(text: string, times: number = 2): void {
  for (let i = 0; i < times; i++) console.log(text);
}

repeat("Hi");      // prints Hi twice
repeat("Hi", 3);   // prints Hi three times
```

פרמטר עם ברירת מחדל הוא אוטומטית אופציונלי, ו-TypeScript מסיקה את הטיפוס שלו מברירת המחדל, ולכן גם `times = 2` לבדו היה `number`.

## טיפוסים של פונקציות

גם פונקציות הן ערכים, ולכן יש להן טיפוסים. טיפוס של פונקציית חץ (arrow function) רושם את הפרמטרים ואת התוצאה:

```ts
const double: (n: number) => number = (n) => n * 2;
```

תשתמשו בזה הרבה כשפונקציה מקבלת פונקציה אחרת כארגומנט.

> **שימו לב:**
> - קריאה עם מספר שגוי של ארגומנטים: `Expected 2 arguments, but got 1.` אם השני אמור להיות אופציונלי, הוסיפו את ה-`?`.
> - `A required parameter cannot follow an optional parameter`: הניחו את פרמטרי החובה קודם.
> - שכחה של `void` לא שוברת שום דבר, אבל אם מגדירים פונקציה `: number` ושוכחים להחזיר, מקבלים `A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value`.

> **תורכם:** הגדירו טיפוסים ל-`greet` (`greeting` אופציונלי, מחזירה מחרוזת) ול-`repeat` (`times` עם ברירת מחדל `2`, מחזירה `void`).
