---
title: "טיפוסים ממופים ומותנים"
summary: "הפכו טיפוס אחד לאחר על ידי מעבר על המפתחות שלו ועל ידי בחירת טיפוס בלוגיקת if-then-else."
hints:
  - "טיפוס ממופה (mapped type) עובר על מפתחות: { [K in keyof T]: ... }. טיפוס מותנה (conditional type) הוא if-then-else לטיפוסים: T extends X ? A : B. המילה infer נותנת שם לחלק מהטיפוס שאתם מתאימים, כמו טיפוס הפריטים של מערך."
  - "type Nullable<T> = { [K in keyof T]: T[K] | null };   type ElementType<T> = T extends (infer U)[] ? U : T;   type IsString<T> = T extends string ? \"yes\" : \"no\";"
  - "type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };"
quiz:
  - q: "מה עושה { [K in keyof T]: T[K] | null } ?"
    options: ["מוחק כל מפתח של T", "יוצר טיפוס עם אותם מפתחות כמו של T שבו כל ערך יכול להיות גם null", "הופך את T למערך"]
  - q: "ב-  T extends string ? 'yes' : 'no' , מה משמעות extends?"
    options: ["T הוא מחלקה שיורשת מ-string", "T הוא בדיוק הטיפוס string ושום דבר אחר", "T ניתן להשמה ל-string, כלומר הוא string או תת-טיפוס כמו ליטרל של מחרוזת"]
    explain: "בטיפוסים מותנים extends שואל אם T ניתן להשמה לטיפוס השני. הטיפוס הליטרלי \"hi\" ניתן להשמה ל-string, ולכן התשובה היא yes."
  - q: "מה עושה infer U ב-  T extends (infer U)[] ? U : T ?"
    options: ["תופס את טיפוס הפריטים של המערך כדי שאפשר יהיה להשתמש בו בתוצאה", "מצהיר על משתנה בזמן ריצה", "ממיר את T למספר"]
  - q: "איזה מגביל מסיר את הסימון readonly מכל מאפיין בתוך טיפוס ממופה?"
    options: ["!readonly", "mutable", "-readonly"]
messages:
  - "כתבו  type Nullable<T> = { [K in keyof T]: T[K] | null };"
  - "שנו את שמות המפתחות עם  as `get${Capitalize<string & K>}`"
  - "לכל getter יש את הטיפוס  () => T[K]"
  - "כתבו  type ElementType<T> = T extends (infer U)[] ? U : T;"
  - "כתבו  type IsString<T> = T extends string ? \"yes\" : \"no\";"
---

טיפוסי עזר כמו `Partial` ו-`Pick` נראו כמו קסם. זה לא קסם: כל אחד מהם כתוב ב-TypeScript רגילה בעזרת שתי יכולות שתלמדו כאן. **טיפוס ממופה** (mapped type) בונה טיפוס אובייקט חדש על ידי מעבר על המפתחות של טיפוס אחר. **טיפוס מותנה** (conditional type) בוחר בין שני טיפוסים עם if-then-else. ביחד הם מאפשרים לכם לכתוב טיפוסי עזר משלכם.

## טיפוסים ממופים

התחביר דומה ללולאת `for...in` עבור טיפוסים:

```ts
type Nullable<T> = { [K in keyof T]: T[K] | null };
```

צעד אחר צעד:

- `keyof T` הוא האיחוד של כל שמות המאפיינים של `T`, למשל `"theme" | "fontSize"`.
- `[K in keyof T]` פירושו "לכל מפתח `K` באיחוד הזה".
- `T[K]` הוא הטיפוס של המאפיין `K` ב-`T`.
- אחרי הנקודתיים כותבים איך המאפיין החדש צריך להיראות. כאן: הטיפוס המקורי או `null`.

עבור הממשק `Settings { theme: string; fontSize: number; }` התוצאה היא `{ theme: string | null; fontSize: number | null }`. כך בדיוק מוגדר `Partial<T>` המובנה, עם סימן שאלה: `{ [K in keyof T]?: T[K] }`.

### מגבילים

אפשר להוסיף או להסיר `readonly` ו-`?` בעזרת `+` ו-`-`:

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // remove readonly
type Concrete<T> = { [K in keyof T]-?: T[K] };           // make every property required
```

### שינוי שמות מפתחות עם as

טיפוס ממופה יכול לשנות את שמות המפתחות בעזרת `as` וטיפוס תבנית מחרוזת (template literal type). העוזר המובנה `Capitalize` הופך את האות הראשונה לגדולה:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
// Getters<Settings> is { getTheme: () => string; getFontSize: () => number; ... }
```

`string & K` הוא תעלול קטן ששומר רק את מפתחות המחרוזת (שמות מאפיינים יכולים להיות גם מספרים או סמלים, ש-`Capitalize` דוחה).

## טיפוסים מותנים

טיפוס מותנה נראה כמו האופרטור המותנה (ternary), אבל ברמת הטיפוסים:

```ts
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<"hi">; // "yes"
type B = IsString<42>;   // "no"
```

`T extends string` שואל: "האם `T` ניתן להשמה ל-`string`?". אם כן, הטיפוס הוא הענף הראשון, ואחרת השני. הבדיקה מתבצעת בזמן קומפילציה, ולכן לא נוצר שום קוד.

### infer: תפיסת חלק

בתוך החלק של `extends`, המילה `infer` נותנת שם לטיפוס ש-TypeScript מבינה בשבילכם:

```ts
type ElementType<T> = T extends (infer U)[] ? U : T;

type X = ElementType<string[]>; // string
type Y = ElementType<number>;   // number (not an array, so T itself)
```

קראו את זה כך: "אם `T` הוא מערך של *משהו*, קראו למשהו הזה `U` ותנו לי `U`." ה-`ReturnType<F>` המובנה עובד באותו אופן, ותופס את טיפוס ההחזרה של פונקציה.

### פיזור על איחודים

כש-`T` הוא איחוד ומפעילים עליו טיפוס מותנה, TypeScript מפעילה אותו על **כל חבר** בנפרד ומאחדת את התוצאות:

```ts
type Strs = IsString<string | number>; // "yes" | "no"
```

זה נקרא טיפוס מותנה *מתפזר* (distributive). בגללו `Exclude<"a" | "b", "a">` מפיק `"b"`.

## מתי זה שימושי?

בעיקר בספריות ובקוד עזר משותף: הגדרת טיפוס לפונקציה שעובדת על כל רשומה, שינוי מבנים של תגובות API, והפקת טיפוסי טפסים ממודל. בקוד אפליקציה יומיומי תשתמשו בהם במשורה, אבל קריאה שלהם היא מיומנות חשובה, כי כל ספרייה פופולרית מגיעה עם טיפוסים כאלה.

> **שימו לב:**
> - טיפוסים לא קיימים בזמן ריצה. אי אפשר לכתוב `if (x extends string)`. להחלטות בזמן ריצה השתמשו ב-`typeof` ובשומרי טיפוס (type guards) בשיעור הבא.
> - שכחה שטיפוס ממופה צריך `keyof`: הצורה `{ [K in T]: ... }` נכשלת עם `Type 'T' is not assignable to type 'string | number | symbol'`.
> - `Capitalize<K>` בלי `string &` נותן `Type 'K' does not satisfy the constraint 'string'`.
> - הפתעה מהפיזור: `IsString<string | number>` הוא `"yes" | "no"` ולא `"no"`. כדי לכבות את זה, עטפו את שני הצדדים: `[T] extends [string] ? ...`.
> - טיפוסים חכמים מדי. אם עמית לא יכול לקרוא אותו בחצי דקה, הוסיפו הערה או כתבו טיפוס פשוט יותר.

## להמשך הדרך

כתבו `type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>` כדי להפוך לאופציונליים רק חלק מהמפתחות, ואת `type Awaited2<T> = T extends Promise<infer R> ? R : T`.

> **תורכם:** הצהירו על `Nullable<T>`, על `Getters<T>` (עם שינוי שמות המפתחות באמצעות `as`), על `ElementType<T>` (עם `infer`) ועל `IsString<T>` כדי שהתוכנית תתקמפל ותדפיס ארבע שורות.
