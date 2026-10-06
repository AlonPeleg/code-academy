---
title: "מערכים וצמדים (tuples)"
summary: "הגדירו טיפוסים לרשימות של ערכים, ולקבוצות בגודל קבוע של ערכים מעורבים."
hints:
  - "טיפוס של מערך הוא הטיפוס של הפריטים ואחריו סוגריים מרובעים. בטיפוס tuple רושמים טיפוס אחד לכל מיקום, לפי הסדר, בתוך סוגריים מרובעים."
  - "scores היא רשימה של מספרים. ל-entry יש בדיוק שני מיקומים: קודם מחרוזת, ואז מספר. average מקבלת אותו סוג של רשימה כמו scores ומחזירה מספר אחד."
  - "const scores: number[] = [...];  const entry: [string, number] = [...];  function average(numbers: number[]): number {"
quiz:
  - q: "איך כותבים את הטיפוס \"מערך של מחרוזות\"?"
    options: ["array<string>", "string[]", "[string]"]
    explain: "גם Array<string> עובד, אבל string[] היא הדרך הרגילה. [string] הוא tuple עם פריט אחד בדיוק."
  - q: "מה מיוחד ב-tuple כמו  [string, number] ?"
    options: ["הוא יכול להחזיק כל מספר של פריטים", "הוא יכול להחזיק רק מספרים", "יש לו אורך קבוע וטיפוס ידוע בכל מיקום"]
  - q: "מה TypeScript עושה עם  const nums: number[] = [1, 2, \"3\"] ?"
    options: ["מציגה שגיאה עבור המחרוזת", "ממירה את \"3\" למספר", "עובדת בשקט"]
  - q: "מהו הטיפוס של  names  אחרי  const names = [\"Ava\", \"Noam\"] ?"
    options: ["string[]", "[string, string]", "any"]
messages:
  - "הצהירו ש-scores הוא מערך של מספרים:  scores: number[]"
  - "הצהירו ש-entry הוא tuple:  entry: [string, number]"
  - "הצהירו על הפרמטר:  numbers: number[]"
  - "הוסיפו טיפוס החזרה ל-average:  ): number {"
---

תוכניות מלאות ברשימות. בשיעור הזה תלמדו איך לומר "זו רשימה של מספרים", ואיך לתאר קבוצה קטנה וקבועה של ערכים כמו שם וגיל.

## מערכים

טיפוס של מערך (array) הוא הטיפוס של הפריטים ואחריו `[]`:

```ts
const names: string[] = ["Ava", "Noam"];
const prices: number[] = [9.99, 4.5, 12];

names.push("Dana");     // fine
names.push(42);         // error: Argument of type 'number' is not assignable to parameter of type 'string'
```

אם יוצרים מערך עם ערכים, TypeScript מסיקה את הטיפוס בעצמה, ולכן `const names = ["Ava", "Noam"]` כבר הוא `string[]`. הצהרה נחוצה בעיקר עבור **מערכים ריקים** ועבור **פרמטרים של פונקציות**:

```ts
const todo: string[] = [];   // without the annotation this would be an "evolving any" array

function total(prices: number[]): number {
  let sum = 0;
  for (const p of prices) sum += p;
  return sum;
}

console.log(total([1, 2, 3])); // prints: 6
```

ייתכן שתראו גם `Array<number>`. זה אומר בדיוק אותו דבר כמו `number[]`.

## צמדים (Tuples)

לפעמים יש קבוצה קטנה של ערכים שבה לכל **מיקום** יש משמעות משלו, למשל שם ואחריו גיל. טיפוס **tuple** (צמד) רושם את הטיפוס של כל מיקום:

```ts
const person: [string, number] = ["Ava", 21];

console.log(person[0]); // prints: Ava  (TypeScript knows this is a string)
console.log(person[1]); // prints: 21   (and this is a number)
```

בהשוואה למערך רגיל, ל-tuple יש **אורך קבוע** ו**טיפוס ידוע בכל מקום**. לכן `["Ava"]`, `[21, "Ava"]` ו-`["Ava", 21, true]` הם כולם שגיאות עבור `[string, number]`.

Tuples מצוינים לזוגות קטנים כמו קואורדינטות `[number, number]`, או להחזרת שני ערכים מפונקציה.

```ts
function minMax(values: number[]): [number, number] {
  return [Math.min(...values), Math.max(...values)];
}

const [low, high] = minMax([4, 9, 2]);
console.log(low, high); // prints: 2 9
```

> **שימו לב:**
> - `[string]` הוא tuple עם פריט אחד, לא מערך של מחרוזות. לרשימה בכל אורך כתבו `string[]`.
> - `Property 'push' does not exist...` או שגיאות טיפוסים על מערכים ריקים: כתבו את טיפוס האיברים, למשל `const items: string[] = [];`.
> - `Type '[string, number, boolean]' is not assignable to type '[string, number]'`: ל-tuple חייב להיות בדיוק האורך שרשום.

> **תורכם:** הצהירו על `scores` כ-`number[]`, על `entry` כ-`[string, number]`, ותנו ל-`average` פרמטר מטיפוס `number[]` וטיפוס החזרה `number`.
