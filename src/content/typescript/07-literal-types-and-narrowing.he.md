---
title: "טיפוסי ליטרל וצמצום"
summary: "הגבילו ערכים לאפשרויות מדויקות ותנו ל-TypeScript לעקוב אחרי בדיקות ה-if שלכם."
hints:
  - "כל חבר באיחוד הוא טיפוס אובייקט עם טקסט קבוע ב-kind (טיפוס ליטרל), מופרד מהבא אחריו בקו אנכי. ב-format שאלו את typeof value אם זו מחרוזת."
  - "ל-type Shape יש שני טיפוסי אובייקט המחוברים עם |. המאפיינים kind שלהם הם בדיוק המילים circle ו-square בתוך מרכאות. ב-format ענף אחד משתמש ב-toUpperCase והשני ב-toFixed(2)."
  - "type Shape = { kind: \"circle\"; radius: number } | { kind: \"square\"; size: number };   וב-format:   if (typeof value === \"string\") { return value.toUpperCase(); }  return value.toFixed(2);"
quiz:
  - q: "מהו טיפוס ליטרל (literal type) כמו  \"up\" | \"down\" ?"
    options: ["כל מחרוזת", "טיפוס שמרשה רק את הערכים המדויקים האלה", "טיפוס של פונקציה"]
  - q: "מהו \"צמצום\" (narrowing)?"
    options: ["הקטנה של קובץ", "הסרה של ייבואים שלא בשימוש", "TypeScript מסיקה טיפוס ספציפי יותר בתוך בדיקת if"]
  - q: "בתוך  if (typeof value === \"string\") { ... }  מה הטיפוס של value?"
    options: ["string", "string | number", "unknown"]
  - q: "מה הופך איחוד ל\"איחוד מבחין\" (discriminated union)?"
    options: ["לכל חבר יש מאפיין משותף עם ערך ליטרל שונה", "יש בו יותר משני חברים", "הוא מכיל null"]
    explain: "המאפיין המשותף הזה (כמו kind) הוא התגית שבודקים כדי לדעת איזה חבר מחזיקים."
messages:
  - "תארו את העיגול עם kind ליטרל:  kind: \"circle\""
  - "תארו את הריבוע עם kind ליטרל:  kind: \"square\""
  - "לעיגול צריך  radius: number"
  - "לריבוע צריך  size: number"
  - "צמצמו עם typeof:  if (typeof value === \"string\") { ... }"
---

איחוד כמו `string | number` גמיש, אבל בסופו של דבר צריך להסתכל על הערך ולהחליט מה לעשות. השיעור הזה מראה איך להגביל ערכים לאפשרויות מדויקות, ואיך TypeScript עוקבת אחרי הבדיקות שלכם כדי להבין את הקוד.

## טיפוסי ליטרל

מלבד `string`, מערכת הטיפוסים מאפשרת להשתמש בערך מדויק כטיפוס. זה נקרא **טיפוס ליטרל** (literal type):

```ts
type Direction = "up" | "down" | "left" | "right";

let move: Direction = "up";   // fine
move = "sideways";            // error: Type '"sideways"' is not assignable to type 'Direction'
```

זה מושלם לקבוצה קבועה של אפשרויות, והעורך אפילו משלים אוטומטית את ארבע המילים המותרות. זה גם תופס שגיאות כתיב כמו `"rigth"`. גם מספרים וערכים בוליאניים יכולים להיות ליטרלים: `type Dice = 1 | 2 | 3 | 4 | 5 | 6`.

## צמצום עם typeof

אם ערך הוא `string | number`, אפשר להשתמש רק במה ששני הטיפוסים חולקים. אחרי בדיקת `typeof`, TypeScript **מצמצמת** (narrows) את הטיפוס בתוך הענף:

```ts
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();  // here value is a string
  }
  return value.toFixed(2);       // here TypeScript knows it must be a number
}

console.log(format("hi"));     // prints: HI
console.log(format(2.5));      // prints: 2.50
```

TypeScript קוראת את הפקודות `if` ו-`return` שלכם כמו שאדם היה קורא אותן. גם בדיקות אחרות מצמצמות: `value === null`, `Array.isArray(value)`, `"radius" in shape` (האם יש לאובייקט את המאפיין הזה), ו-`instanceof`.

## איחודים מבחינים

כשכמה מבנים של אובייקטים יכולים להופיע, תנו להם מאפיין משותף עם ערך ליטרל שונה, שנקרא לרוב `kind` או `type`. המאפיין הזה הוא **תגית** (tag):

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.round(Math.PI * shape.radius ** 2);
  }
  return shape.size * shape.size;
}
```

בדיקת `shape.kind` אומרת ל-TypeScript בדיוק איזה חבר יש לכם. בתוך ה-`if` מותר להשתמש ב-`shape.radius`. אחריו מותר להשתמש ב-`shape.size`, ואם הייתם כותבים שם `shape.radius` הייתם מקבלים `Property 'radius' does not exist on type ...`. גם `switch (shape.kind)` עובד באותה מידה.

התבנית הזו נפוצה במצבי טעינה (`{ status: "loading" }` או `{ status: "done"; data: string }`) והיא אחד הרעיונות השימושיים ביותר ב-TypeScript.

> **שימו לב:**
> - שכחת המרכאות: `kind: circle` מתייחס לטיפוס בשם `circle`. טקסט ליטרלי צריך מרכאות.
> - ל-`const x = "up"` יש טיפוס ליטרל `"up"`, אבל `let x = "up"` מורחב (widened) ל-`string`. הגדירו טיפוס במפורש: `let x: Direction = "up"`.
> - `This comparison appears to be unintentional because the types ... have no overlap`: השוויתם לערך שהאיחוד לא מכיל.

> **תורכם:** הצהירו על האיחוד `Shape` עם עיגול (`radius`) וריבוע (`size`), ואז השתמשו ב-`typeof` בתוך `format` כדי שמחרוזות יהפכו לאותיות גדולות ומספרים יקבלו שתי ספרות אחרי הנקודה.
