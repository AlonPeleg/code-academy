---
title: "שומרי טיפוס ובדיקת שלמות עם never"
summary: "למדו את המהדר מה הערך, עם שומרים מותאמים אישית, והכריחו אותו לדרוש מכם לטפל בכל מקרה."
hints:
  - "פרדיקט טיפוס (type predicate) הוא טיפוס החזרה מיוחד בצורה parameterName is Type. הטיפוס never אומר שאף ערך לא יכול להגיע למקום הזה, ולכן אם ה-switch באמת מכסה כל מקרה, למשתנה בענף default יש הטיפוס never."
  - "function assertNever(value: never): never { throw new Error(...); }   case \"rect\": return shape.width * shape.height;   default: return assertNever(shape);"
  - "function isString(value: unknown): value is string { return typeof value === \"string\"; }   function isCat(pet: Cat | Dog): pet is Cat { return \"meow\" in pet; }"
quiz:
  - q: "מה התכלית של הטיפוס never בענף default של switch?"
    options: ["הוא גורם לקוד לרוץ מהר יותר", "המהדר מדווח על שגיאה אם מוסיפים מקרה חדש לאיחוד ושוכחים לטפל בו", "הוא תופס שגיאות זמן ריצה אוטומטית"]
  - q: "מה טיפוס ההחזרה  value is string  אומר למהדר?"
    options: ["כשהפונקציה מחזירה true, אפשר להתייחס ל-value כאל מחרוזת אחר כך", "הפונקציה תמיד מחזירה מחרוזת", "הפונקציה ממירה את הערך למחרוזת"]
  - q: "איזו מהדרכים האלה היא הבטוחה ביותר לצמצם ערך מטיפוס unknown?"
    options: ["להשתמש במילה as כדי להמיר אותו", "לבדוק אותו קודם עם typeof או עם שומר טיפוס", "להגדיר אותו כ-any"]
    explain: "המרה (cast) רק אומרת למהדר לסמוך עליכם. שומר באמת בודק את הערך בזמן ריצה."
  - q: "מה עושה  \"meow\" in pet  ?"
    options: ["מצהיר על מאפיין בשם meow", "קורא למתודה meow", "בודק בזמן ריצה אם ל-pet יש מאפיין בשם meow, ומצמצם את הטיפוס"]
messages:
  - "הצהירו על  function assertNever(value: never): never"
  - "הוסיפו את המקרה \"rect\" ל-switch."
  - "הוסיפו  default: return assertNever(shape);"
  - "הפכו את isString לפרדיקט טיפוס:  value is string"
  - "הפכו את isCat לפרדיקט טיפוס:  pet is Cat"
---

טיפוסים נעלמים כשהתוכנית רצה, ולכן TypeScript לא יכולה לדעת בקסם מה הערך באמת. במקום זה אתם מוכיחים את זה, בעזרת בדיקה בזמן ריצה שהמהדר מבין. זה נקרא **צמצום** (narrowing). בשיעור הזה תכתבו בדיקות משלכם (שומרי טיפוס, type guards) ותשתמשו בטיפוס המיוחד `never` כדי שהמהדר יזהיר אתכם כששכחתם מקרה.

## צמצום מובנה

כבר ראיתם צמצום עם `typeof`. עוד כמה בדיקות שהמהדר מבין:

```ts
function show(x: string | number | null) {
  if (x === null) return "nothing";        // x: null here
  if (typeof x === "string") return x;     // x: string here
  return x.toFixed(1);                     // x: number here
}
```

- `typeof x === "string"` עבור טיפוסים פרימיטיביים,
- `x instanceof Date` עבור מופעים של מחלקות,
- `"meow" in pet` כדי לבדוק אם לאובייקט יש מאפיין,
- `x === null` ובדיקות אמת (truthiness) עבור `null` ו-`undefined`.

בתוך כל ענף הטיפוס מצטמצם למה שהבדיקה הוכיחה.

## כתיבת שומר טיפוס משלכם

לפעמים הבדיקה מורכבת יותר מ-`typeof` אחד. העבירו אותה לפונקציה ואמרו למהדר מה משמעות תשובה `true`, בעזרת **פרדיקט טיפוס** (type predicate):

```ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}

const mixed: unknown[] = ["a", 1, "b"];
const words = mixed.filter(isString); // string[]
```

`value is string` הוא טיפוס ההחזרה. בזמן ריצה הפונקציה פשוט מחזירה ערך בוליאני, אבל המהדר לומד: "כשהפונקציה מחזירה true, `value` הוא `string`". בלי הפרדיקט, `filter` היה מחזיר `unknown[]` והייתם צריכים להמיר. היו כנים: המהדר סומך על הפונקציה שלכם, ולכן בדיקה שגויה משקרת לכולם.

## איחודים מבחינים

כשלכל חבר באיחוד יש מאפיין ליטרל משותף (**מבחין**, discriminant, כאן `kind`), בדיקה שלו מצמצמת את כל האובייקט:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") return Math.PI * shape.radius ** 2; // radius is available
  return shape.side ** 2;                                          // must be a square
}
```

## never ובדיקת שלמות

`never` הוא הטיפוס של ערכים **שלא יכולים להתקיים**: טיפוס ההחזרה של פונקציה שתמיד זורקת שגיאה, והטיפוס של משתנה אחרי שכל האפשרויות נשללו. אפשר להשתמש בזה כדי להוכיח שטיפלנו בכל המקרים:

```ts
function assertNever(value: never): never {
  throw new Error("Unexpected: " + JSON.stringify(value));
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    default: return assertNever(shape); // shape is never here
  }
}
```

אם לכל סוג יש `case`, אז בענף `default` הטיפוס של `shape` הוא `never`, והעברתו ל-`assertNever` מתקמפלת. עכשיו מישהו מוסיף `{ kind: "rect" }` ל-`Shape` ושוכח את `area`. ענף ה-`default` מקבל עכשיו `Rect`, שלא ניתן להשמה ל-`never`, והמהדר נעצר עם שגיאה כמו `Argument of type 'Rect' is not assignable to parameter of type 'never'`. קבוצה שלמה של באגים נתפסת בזמן ההקלדה, ולא כשלקוח נתקל בהם. השגיאה שנזרקת היא רשת ביטחון לנתונים שחומקים מהטיפוסים, כמו JSON משרת.

## פונקציות הצהרה

קרובה של פרדיקט הטיפוס היא **פונקציית הצהרה** (assertion function), שזורקת שגיאה במקום להחזיר false:

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new Error("Not a string");
}
```

אחרי קריאה אליה, TypeScript מתייחסת ל-`value` כאל `string` בשאר התחום (scope).

> **שימו לב:**
> - פרדיקט שמחזיר תשובה שגויה. `function isCat(p): p is Cat { return true; }` מתקמפל ונשבר בזמן ריצה.
> - שימוש ב-`as` במקום בשומר. `value as string` משתיק את המהדר בלי לבדוק כלום.
> - שכחת ענף `default`: בלעדיו הפונקציה עלולה להסתיים בלי להחזיר, ו-TypeScript אומרת `Function lacks ending return statement and return type does not include 'undefined'`.
> - `Argument of type 'X' is not assignable to parameter of type 'never'`: זו בדיקת השלמות שעובדת. הוסיפו את ה-`case` החסר.
> - צמצום לפי מאפיין שאינו משותף: `shape.radius` לפני בדיקת `kind` נותן `Property 'radius' does not exist on type 'Shape'`.

## להמשך הדרך

הוסיפו צורה רביעית וראו את המהדר מתלונן ב-`area` לפני שטיפלתם בה. אחר כך כתבו `function isRect(shape: Shape): shape is Rect` והשתמשו בה עם `filter`.

> **תורכם:** כתבו את `assertNever`, השלימו את ה-`switch` ב-`area` עם המקרה `"rect"` ועם `default` ממצה, והפכו את `isString` ו-`isCat` לפרדיקטי טיפוס.
