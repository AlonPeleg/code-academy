---
title: "ממשקים ואובייקטים"
summary: "תארו את המבנה (shape) של אובייקט."
hints:
  - "ממשק נראה כמו אובייקט שבו במקום ערכים כתובים טיפוסים: המילה interface, שם, ואז סוגריים מסולסלים עם מאפיין אחד בכל שורה."
  - "בתוך הסוגריים כתבו שלושה מאפיינים בצורה name: type;. במאפיין האופציונלי יש סימן שאלה מיד אחרי השם."
  - "interface Student { name: string; age: number; nickname?: string; }"
quiz:
  - q: "מה ממשק (interface) מתאר?"
    options: ["לולאה", "את המבנה של אובייקט", "פריסה (layout) ב-CSS"]
  - q: "מה משמעות ה-? ב-  nickname?: string  ?"
    options: ["המאפיין הוא אופציונלי", "המאפיין הוא שאלה", "המאפיין נמחק"]
  - q: "ל-Student חייב להיות name. מה קורה אם כותבים  const s: Student = { age: 21 } ?"
    options: ["זה עובד בלי תלונות", "TypeScript מציגה שגיאה על ה-name החסר", "ה-name הופך למחרוזת ריקה"]
  - q: "מה עושה המילה readonly על מאפיין?"
    options: ["היא מסתירה את המאפיין", "היא מונעת שינוי של המאפיין אחרי היצירה", "היא הופכת את המאפיין לאופציונלי"]
messages:
  - "הצהירו על ממשק:  interface Student { ... }"
  - "הוסיפו את המאפיין  name: string;"
  - "הוסיפו את המאפיין  age: number;"
  - "הפכו את nickname לאופציונלי:  nickname?: string;"
---

אובייקטים (objects) מקבצים ערכים קשורים, כמו השם והגיל של סטודנט. **ממשק** (interface) נותן לקבוצה כזו שם, ומפרט בדיוק אילו מאפיינים (properties) חייבים להיות בה ומה הטיפוס של כל אחד מהם.

## הצהרה על ממשק

```ts
interface Student {
  name: string;
  age: number;
  nickname?: string; // optional
}
```

- הצהרת `interface Student { ... }` יוצרת טיפוס חדש בשם `Student`.
- כל שורה היא `propertyName: type;`.
- סימן `?` אחרי השם (כמו ב-`nickname?`) הופך את המאפיין ל**אופציונלי**. אובייקטים רשאים לכלול אותו או להשמיט אותו.

עכשיו אפשר להשתמש ב-`Student` בכל מקום שבו משתמשים בטיפוס:

```ts
const ava: Student = { name: "Ava", age: 21 };

function birthday(student: Student): Student {
  return { ...student, age: student.age + 1 };
}
```

## מה TypeScript בודקת בשבילכם

ברגע שאובייקט מוגדר כ-`Student`, TypeScript בודקת כל שימוש בו:

```ts
const bad: Student = { name: "Dana" };
// error: Property 'age' is missing in type '{ name: string; }' but required in type 'Student'.

ava.agee = 5;
// error: Property 'agee' does not exist on type 'Student'. Did you mean 'age'?
```

שגיאות כתיב נתפסות מיד, ובעורך אפשר להקליד `ava.` ולראות רשימה של המאפיינים הזמינים (השלמה אוטומטית, autocomplete).

## מאפיינים אופציונליים ו-readonly

מאפיינים אופציונליים יכולים להיות `undefined`, ולכן בדקו אותם לפני השימוש:

```ts
if (ava.nickname) {
  console.log(ava.nickname.toUpperCase());
}
```

אפשר גם לסמן מאפיין כ-**`readonly`**, כך שאפשר לקבוע אותו בזמן יצירת האובייקט אבל אי אפשר לשנות אותו אחר כך:

```ts
interface Account {
  readonly id: number;
  owner: string;
}
```

## מבנים מקוננים ומתודות

ממשק יכול להכיל ממשקים אחרים, ויכול גם לתאר פונקציות:

```ts
interface Address { city: string; }

interface Person {
  name: string;
  address: Address;
  greet(): string;
}
```

> **שימו לב:**
> - מפרידים: מאפיינים יכולים להסתיים ב-`;` או ב-`,`. שניהם עובדים, רק היו עקביים. אל תכתבו `=` בתוך ממשק, זה שייך לכינוי הטיפוס (alias) `type`.
> - `Property 'age' is missing in type ...`: השמטתם מאפיין חובה. הפכו אותו לאופציונלי עם `?` רק אם זה באמת מותר.
> - `Object literal may only specify known properties`: הוספתם מאפיין שהממשק לא מציין, לרוב בגלל שגיאת כתיב.

> **תורכם:** הצהירו על הממשק `Student` מעל הפונקציה, עם `name: string`, `age: number` ועם `nickname` אופציונלי.
