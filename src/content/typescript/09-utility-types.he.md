---
title: "טיפוסי עזר"
summary: "בנו טיפוסים חדשים מטיפוסים קיימים עם Partial, Pick, Record וחבריהם."
hints:
  - "טיפוסי עזר (utility types) נכתבים כמו פונקציות גנריות: שם ואחריו סוגריים משולשים שמכילים את הטיפוסים לעבוד איתם. Pick מקבל טיפוס ואת המפתחות שרוצים, Partial מקבל טיפוס, ו-Record מקבל טיפוס מפתח וטיפוס ערך."
  - "type Preview = Pick<...>; המפתחות ניתנים כליטרלים של טקסט המחוברים בקו אנכי. השתמשו ב-Partial<User> עבור changes, וב-Record<string, number> כטיפוס אחרי stock."
  - "type Preview = Pick<User, \"id\" | \"name\">;   changes: Partial<User>   const stock: Record<string, number> = {};"
quiz:
  - q: "מה נותן לכם  Partial<User>  ?"
    options: ["User שבו כל מאפיין הוא אופציונלי", "User שהוסרו ממנו רק כמה מאפיינים", "User שבו כל מאפיין הוא חובה"]
  - q: "מה נותן לכם  Pick<User, \"id\" | \"name\">  ?"
    options: ["User בלי id ובלי name", "מאפיין אקראי של User", "טיפוס עם המאפיינים id ו-name בלבד של User"]
  - q: "מה  Record<string, number>  מתאר?"
    options: ["אובייקט עם מפתחות מחרוזת כלשהם וערכים מספריים", "מערך של מספרים", "פונקציה שמחזירה מספר"]
  - q: "למה להשתמש בטיפוסי עזר במקום לכתוב ממשק חדש?"
    options: ["הם רצים מהר יותר", "הם נשארים מסונכרנים כשהטיפוס המקורי משתנה", "TypeScript דורשת אותם"]
    explain: "אם תוסיפו מאפיין ל-User, גם Partial<User> וגם Pick<User, ...> יתעדכנו אוטומטית."
messages:
  - "הצהירו על  type Preview = Pick<User, \"id\" | \"name\">;"
  - "הגדירו טיפוס לפרמטר:  changes: Partial<User>"
  - "הגדירו טיפוס ל-stock:  const stock: Record<string, number> = {};"
---

בתוכניות אמיתיות יש הרבה טיפוסים שהם וריאציות קטנות זה של זה: המשתמש המלא, המשתמש עם כמה שדות חסרים, המשתמש עם שם ו-id בלבד. העתקה והדבקה של ממשקים הייתה מייגעת ומועדת לטעויות. TypeScript מגיעה עם **טיפוסי עזר** (utility types) שבונים טיפוס חדש מטיפוס קיים.

כולם נראים כמו טיפוסים גנריים: שם, והטיפוסים לעבוד איתם בתוך `< >`. בדוגמאות נשתמש בממשק הזה:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

## Partial: הכול אופציונלי

`Partial<User>` הוא `User` שבו כל מאפיין הפך לאופציונלי. זה מושלם לפונקציות "עדכון", שבהן הקורא שולח רק את השדות שהשתנו:

```ts
function updateUser(user: User, changes: Partial<User>): User {
  return { ...user, ...changes };
}

const ava: User = { id: 1, name: "Ava", email: "ava@old.com" };
const updated = updateUser(ava, { email: "ava@new.com" });
console.log(updated.email); // prints: ava@new.com
```

ה-`...` (spread, פריסה) מעתיק את המאפיינים של `user` ואז דורס אותם במאפיינים שב-`changes`.

## Pick ו-Omit: בחירת מאפיינים

`Pick<Type, Keys>` משאיר רק את המאפיינים שברשימה. `Omit<Type, Keys>` עושה את ההפך ומסיר אותם:

```ts
type Preview = Pick<User, "id" | "name">;   // { id: number; name: string }
type NoId = Omit<User, "id">;               // { name: string; email: string }
```

המפתחות הם טיפוסי ליטרל (זכרו את `"id" | "name"` מהשיעור הקודם), ולכן שגיאת כתיב כמו `"nmae"` היא שגיאה.

## Record: מילון

`Record<Keys, Value>` מתאר אובייקט שמשמש כמילון (dictionary), שבו לכל מפתח יש אותו סוג של ערך:

```ts
const stock: Record<string, number> = {};
stock["apples"] = 5;
stock["pears"] = 2;
// stock["kiwis"] = "many";   // error: Type 'string' is not assignable to type 'number'
```

אפשר גם להשתמש באיחוד של ליטרלים כמפתחות, מה שמחייב לספק את כולם:

```ts
type Role = "admin" | "guest";
const power: Record<Role, number> = { admin: 10, guest: 1 };
```

## Readonly

`Readonly<User>` הופך כל מאפיין לקריאה בלבד, דרך מהירה לומר "אל תשנו את האובייקט הזה".

> **שימו לב:**
> - `Type 'User' is not generic` או `Generic type 'Pick' requires 2 type argument(s)`: חייבים להעביר את כל הטיפוסים בתוך `< >`.
> - `Type '"mail"' does not satisfy the constraint 'keyof User'`: המפתח שביקשתם לא קיים בטיפוס.
> - באובייקטים מסוג `Partial<User>` יכולים להיות שדות חסרים, ולכן קריאת `changes.name` נותנת `string | undefined`. בדקו לפני השימוש.

> **תורכם:** הצהירו על `Preview` עם `Pick`, הגדירו טיפוס ל-`changes` עם `Partial<User>`, והגדירו את `stock` כ-`Record<string, number>`.
