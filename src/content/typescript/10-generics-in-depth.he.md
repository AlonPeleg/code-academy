---
title: "גנריקה לעומק"
summary: "הגבילו פרמטרי טיפוס עם extends, קשרו ביניהם עם keyof, ותנו להם טיפוסי ברירת מחדל."
hints:
  - "פרמטר טיפוס (type parameter) הוא מציין מקום שנכתב בסוגריים משולשים אחרי השם. אילוץ (constraint) מגביל אותו עם extends. ברירת מחדל נכתבת עם סימן שווה. K extends keyof T אומר ש-K יכול להיות רק אחד משמות המאפיינים של T."
  - "function firstOf<T>(items: T[]): T | undefined   function getProp<T, K extends keyof T>(obj: T, key: K): T[K]   function longest<T extends { length: number }>(a: T, b: T): T   interface Box<T = string> { value: T; }"
  - "class Stack<T> { private items: T[] = []; push(item: T): void { this.items.push(item); } pop(): T | undefined { return this.items.pop(); } get size(): number { return this.items.length; } }"
quiz:
  - q: "מה משמעות  <T extends { length: number }>  ?"
    options: ["T חייב להיות בדיוק הטיפוס { length: number }", "T יכול להיות כל טיפוס שיש לו לפחות מאפיין length מספרי", "T הוא מספר"]
  - q: "מה  K extends keyof T  מבטיח?"
    options: ["K הוא שם של מאפיין קיים של T", "K הוא מחרוזת", "K הוא מספר"]
  - q: "עם  interface Box<T = string> , מה משמעות הטיפוס  Box  (בלי סוגריים משולשים)?"
    options: ["זו שגיאה", "Box<any>", "Box<string>"]
  - q: "למה פונקציה גנרית טובה יותר מפונקציה שמקבלת any?"
    options: ["היא רצה מהר יותר", "טיפוס התוצאה קשור לטיפוס הקלט, ולכן המהדר (compiler) ממשיך לבדוק את הקוד שלכם", "היא משתמשת בפחות זיכרון"]
messages:
  - "הצהירו על  function firstOf<T>(items: T[]): T | undefined"
  - "הגבילו את המפתח עם  K extends keyof T"
  - "getProp צריכה להחזיר את הטיפוס T[K]."
  - "הגבילו את longest עם  T extends { length: number }"
  - "תנו ל-Box פרמטר טיפוס עם ברירת מחדל:  interface Box<T = string>"
  - "הפכו את המחלקה לגנרית:  class Stack<T>"
---

כבר פגשתם גנריקה: `Array<number>` ופונקציה `first<T>(items: T[])`. **גנרי** (generic) הוא פונקציה, מחלקה או טיפוס עם **פרמטר טיפוס** (type parameter), מציין מקום שממלא מי שמשתמש בו. השיעור הזה צולל עמוק יותר: איך להגביל מה מציין המקום יכול להיות, איך לקשור כמה מציני מקום זה לזה, ואיך לתת להם ערכי ברירת מחדל.

## למה לא להשתמש ב-any?

אפשר לכתוב `function firstOf(items: any[]): any`. זה רץ, אבל בודק הטיפוסים מוותר: התוצאה היא `any`, ולכן `firstOf([1, 2]).toUpperCase()` מתקמפל וקורס בזמן ריצה. גנרי שומר על הקשר בין הקלט לפלט:

```ts
function firstOf<T>(items: T[]): T | undefined {
  return items[0];
}

const n = firstOf([10, 20, 30]); // n is number | undefined
const s = firstOf(["a", "b"]);   // s is string | undefined
```

`<T>` אחרי שם הפונקציה מצהיר על מציין המקום. TypeScript **מסיקה** (infers) את `T` מהארגומנט, ולכן רק לעיתים רחוקות תכתבו בעצמכם `firstOf<number>(...)`. ה-`| undefined` הוא כנות: למערך ריק אין פריט ראשון.

## אילוצים עם extends

לפעמים מציין מקום לא יכול להיות סתם כל דבר. בתוך `longest` אנחנו משתמשים ב-`.length`, אבל לא לכל טיפוס יש כזה. **אילוץ** (constraint) מגביל את `T`:

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "hi");     // works: strings have length
longest([1, 2], [1, 2, 3]); // works: arrays too
// longest(5, 7);           // error: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

קראו את `T extends { length: number }` כ-"T הוא כל טיפוס שיש לו לפחות `length` מספרי". הוא לא חייב להיות בדיוק במבנה הזה, ולכן גם מחרוזות וגם מערכים מתאימים. שימו לב שטיפוס ההחזרה הוא `T` ולא `{ length: number }`: כשמעבירים מחרוזות מקבלים בחזרה מחרוזת.

## keyof וקישור בין שני פרמטרי טיפוס

`keyof T` הוא האיחוד של שמות המאפיינים של `T`. בשילוב עם פרמטר טיפוס שני אפשר לכתוב קורא מאפיינים בטוח:

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Ada", age: 36 };
const name = getProp(user, "name"); // string
const age = getProp(user, "age");   // number
// getProp(user, "email");          // error: Argument of type '"email"' is not assignable to parameter of type '"name" | "age"'.
```

`T[K]` הוא **טיפוס גישה באינדקס** (indexed access type): "הטיפוס של המאפיין `K` של `T`". מכיוון ש-`K` הוא ליטרל כמו `"name"`, TypeScript יודעת את טיפוס התוצאה המדויק. שגיאות כתיב במפתח נתפסות על ידי המהדר.

## פרמטרי טיפוס עם ברירת מחדל

בדיוק כמו שלפרמטרים של פונקציות יכולים להיות ערכי ברירת מחדל, גם לפרמטרי טיפוס יכולות להיות **ברירות מחדל**:

```ts
interface Box<T = string> {
  value: T;
}

const a: Box = { value: "hi" };            // T defaults to string
const b: Box<number> = { value: 42 };      // explicit
```

ברירות מחדל הופכות גנרי לקל לשימוש במקרה הנפוץ וגמיש במקרה הנדיר. פרמטרים עם ברירת מחדל חייבים לבוא אחרי אלה שבלי.

## מחלקות גנריות

מחלקה יכולה להצהיר על פרמטר הטיפוס שלה פעם אחת ולהשתמש בו בכל החברים שלה:

```ts
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}

const numbers = new Stack<number>();
numbers.push(1);
// numbers.push("two"); // error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

## טיפים לעיצוב

- השתמשו בפרמטר טיפוס רק כשהוא מופיע לפחות פעמיים (למשל בפרמטר ובתוצאה). אם `T` מופיע פעם אחת, כנראה שטיפוס רגיל מספיק.
- תנו שמות בעלי משמעות כשיש הרבה: `TItem`, `TKey`. אותיות בודדות (`T`, `K`, `V`) מתאימות לעוזרים קטנים.
- הוסיפו אילוצים מאוחר ככל האפשר, רק כשגוף הפונקציה צריך אותם.

> **שימו לב:**
> - שימוש במאפיין שהאילוץ לא מבטיח: `Property 'length' does not exist on type 'T'`. הוסיפו `extends { length: number }`.
> - שכחה ש-`T` נמחק בזמן ריצה. אי אפשר לכתוב `new T()` או `typeof T`. טיפוסים קיימים רק בשביל המהדר.
> - כתיבת `K extends string` כשהתכוונתם ל-`K extends keyof T`. הראשון מקבל כל מחרוזת, ו-`obj[key]` הופך לשגיאה: `Type 'K' cannot be used to index type 'T'`.
> - שימוש יתר בגנריקה. `function log<T>(x: T): void` לא מרוויחה כלום לעומת `x: unknown`.
> - ברירת מחדל לפני פרמטר חובה: `Required type parameters may not follow optional type parameters`.

## להמשך הדרך

כתבו `function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`. נסו להוסיף ל-`Stack` מתודה `peek()` שמחזירה `T | undefined`.

> **תורכם:** החליפו כל `any` בגנרי מתאים: `firstOf<T>`, `getProp<T, K extends keyof T>` שמחזירה `T[K]`, `longest<T extends { length: number }>`, `Box<T = string>` ו-`Stack<T>`.
