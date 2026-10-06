---
title: "טיפוסים בסיסיים והסקת טיפוסים"
summary: "למדו את הטיפוסים היומיומיים, ומתי TypeScript יכולה להבין את הטיפוס בעצמה."
hints:
  - "השתמשו ב-let (לא const) כי אתם מציבים את הערך מאוחר יותר. אחרי השם הוסיפו נקודתיים והטיפוס, וסיימו את השורה בנקודה-פסיק. אין צורך בערך."
  - "צריך שתי הצהרות, אחת עבור username עם הטיפוס string ואחת עבור level עם הטיפוס number."
  - "let username: string;  ובשורה הבאה  let level: number;"
quiz:
  - q: "מה TypeScript עושה עם  const planet = \"Earth\"  (בלי הצהרת טיפוס)?"
    options: ["נותנת שגיאה כי חסר טיפוס", "מתייחסת לטיפוס כאל any", "מסיקה ש-planet הוא מחרוזת"]
  - q: "מתי חייבים לכתוב את הטיפוס בעצמכם?"
    options: ["כשמשתנה מוצהר בלי ערך התחלתי", "בכל פעם", "אף פעם, ההסקה תמיד עובדת"]
  - q: "איזה טיפוס הוא הבחירה הבטוחה עבור \"אני עדיין לא יודע מהו הערך הזה\"?"
    options: ["any", "unknown", "void"]
    explain: "unknown מכריח לבדוק את הערך לפני שמשתמשים בו. any פשוט מכבה את בדיקות הטיפוסים."
messages:
  - "הצהירו עם טיפוס:  let username: string;"
  - "הצהירו עם טיפוס:  let level: number;"
---

ב-TypeScript יש קבוצה קטנה של טיפוסים יומיומיים, והחדשות הטובות הן שנדיר שצריך לכתוב אותם במפורש. בשיעור הזה תכירו את הטיפוסים הבסיסיים ותלמדו מתי TypeScript יכולה **להסיק** (infer, להבין בעצמה) טיפוס בשבילכם.

## הטיפוסים הבסיסיים

| טיפוס | מה הוא מחזיק | דוגמה |
| --- | --- | --- |
| `string` | טקסט | `"hello"` |
| `number` | כל מספר, שלם או עשרוני | `42`, `3.14` |
| `boolean` | `true` או `false` | `true` |
| `null` / `undefined` | "כלום" | `undefined` |

```ts
let city: string = "Haifa";
let temperature: number = 24;
let isSunny: boolean = true;
```

## הסקת טיפוסים

כשנותנים למשתנה ערך באותה שורה, TypeScript מסתכלת על הערך ומחליטה בעצמה מהו הטיפוס:

```ts
const planet = "Earth";   // TypeScript knows: string
let count = 0;            // TypeScript knows: number
count = count + 1;        // fine
count = "many";           // error: Type 'string' is not assignable to type 'number'
```

רחפו עם העכבר מעל `count` בעורך ותראו `let count: number`. הסקת טיפוסים אומרת שאתם מקבלים הגנה מלאה בלי להעמיס על הקוד. כלל סגנון נפוץ הוא: **תנו ל-TypeScript להסיק כשיש ערך התחלתי, וכתבו הצהרה כשאין**, או כשרוצים להיות מפורשים בקלט ובפלט של פונקציה.

## כשההסקה לא יכולה לעזור

אם מצהירים על משתנה וממלאים אותו מאוחר יותר, אין על מה להסתכל, ולכן כותבים את הטיפוס:

```ts
let message: string;

message = "Hello";
console.log(message); // prints: Hello
```

## any ו-unknown

לפעמים באמת לא יודעים מהו ערך, למשל נתונים שנקראים מחוץ לתוכנית שלכם.

- **`any`** מכבה את בודק הטיפוסים עבור הערך הזה. TypeScript תאפשר לעשות איתו כל דבר, כולל טעויות. הימנעו ממנו ככל האפשר.
- **`unknown`** פירושו "יכול להיות כל דבר, אבל בדקו לפני שמשתמשים". זו החלופה הבטוחה.

```ts
let data: unknown = "42";
// data.toUpperCase();       // error: 'data' is of type 'unknown'
if (typeof data === "string") {
  console.log(data.toUpperCase()); // prints: 42
}
```

> **שימו לב:**
> - `Parameter 'x' implicitly has an 'any' type`: לפרמטר של פונקציה אין הצהרת טיפוס, ואין ממה להסיק אותו. כתבו את הטיפוס.
> - הצבה מחדש ב-`const`: `Cannot assign to 'count' because it is a constant`. השתמשו ב-`let` עבור ערכים שמשתנים.
> - הצהרה על `let total;` בלי טיפוס ובלי ערך: TypeScript נותנת לו את הטיפוס הרופף `any`. הוסיפו `: number`.

> **תורכם:** הצהירו על `username` כמחרוזת ועל `level` כמספר (עם `let`, עדיין בלי ערכים) כדי שהתוכנית תדפיס `Welcome, Ava! Level 3`.
