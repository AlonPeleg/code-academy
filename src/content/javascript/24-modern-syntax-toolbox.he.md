---
title: "ארגז הכלים של התחביר המודרני"
summary: "משתמשים ב-optional chaining, באופרטורי nullish, ב-rest ו-spread, ב-structuredClone, ב-at(), ב-Object.entries וב-flatMap כדי לכתוב קוד קצר ובטוח יותר."
hints:
  - "?. עוצר ומחזיר undefined כשמשהו בדרך חסר. ?? בוחר בצד ימין רק כשהצד שמאל הוא null או undefined. ??= ו-||= מבצעים השמה רק כשהערך הוא null/undefined (??=) או falsy (||=)."
  - "const city = user.address?.city; const email = user.profile?.email ?? \"no email\"; config.retries ??= 3; config.timeout ??= 30; config.name ||= \"anonymous\"; const copy = structuredClone(user); copy.address.city = \"Paris\"; user.tags.at(-1)"
  - "function summarize(first, ...rest) { return first + \" and \" + rest.length + \" more\"; }   const { name, ...others } = user;   const doubled = Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2]));   const allWords = sentences.flatMap((s) => s.split(\" \"));   וקראו ל-summarize(...user.tags)"
messages:
  - "השתמשו ב-optional chaining (?.) לקריאות הבטוחות."
  - "השתמשו באופרטור ??=."
  - "השתמשו באופרטור ||=."
  - "השתמשו ב-structuredClone(user) להעתקה העמוקה."
  - "השתמשו ב-.at(-1) כדי לקרוא את הפריט האחרון."
  - "השתמשו ב-Object.fromEntries כדי לבנות מחדש את האובייקט."
  - "השתמשו ב-flatMap כדי למפות ולשטח בצעד אחד."
quiz:
  - q: "מה מחזיר  user.profile?.email  כאשר user.profile הוא undefined?"
    options: ["TypeError", "undefined, בלי שגיאה", "הטקסט \"email\""]
  - q: "מה ההבדל בין  a ?? b  לבין  a || b ?"
    options: ["אין הבדל", "?? מהיר יותר", "?? חוזר לערך החלופי רק כש-a הוא null או undefined, ואילו || חוזר אליו גם עבור 0, \"\" ו-false"]
    explain: "כש-count = 0, הביטוי count ?? 10 נשאר 0 אבל count || 10 הופך ל-10. השתמשו ב-?? כשערך 0 או מחרוזת ריקה הם ערכים תקינים."
  - q: "למה להשתמש ב-structuredClone(obj) במקום ב-{ ...obj } עבור נתונים מקוננים?"
    options: ["אסור להשתמש בתחביר spread על אובייקטים", "spread מעתיק רק את הרמה הראשונה, ולכן אובייקטים מקוננים עדיין משותפים", "structuredClone מעתיקה גם פונקציות"]
  - q: "מה מחזיר  [3, 4, 5].at(-1) ?"
    options: ["5", "undefined", "3"]
---

JavaScript השתנתה מאוד מאז ימיה הראשונים. התכונות החדשות בשיעור הזה קטנות, אבל תפגשו אותן כמעט בכל בסיס קוד מודרני. כל אחת מהן מסירה חתיכה של קוד הגנתי: אין יותר שרשראות ארוכות של `&&`, ואין יותר לולאות ידניות להעתקה ולעיצוב מחדש של נתונים.

## Optional chaining: `?.`

קריאה של מאפיין (property) מתוך `undefined` מפילה את התוכנית: `TypeError: Cannot read properties of undefined (reading 'email')`. **Optional chaining** עוצר את השרשרת ומחזיר `undefined` במקום זאת:

```js
const user = { name: "Ada" };
console.log(user.profile?.email);       // prints: undefined
console.log(user.profile?.email.length); // prints: undefined (the whole chain is skipped)
console.log(user.greet?.());            // calling a method that may not exist: undefined
console.log(user.tags?.[0]);            // safe index access: undefined
```

השתמשו ב-`?.` כשהנתונים עשויים להיות חסרים באופן לגיטימי (מ-API, מטופס או מקובץ הגדרות). אל תפזרו אותו בכל מקום: אם משהו אמור להיות קיים תמיד, שגיאה רועשת עדיפה על `undefined` שקט.

## Nullish coalescing: `??`

`a ?? b` פירושו "השתמשו ב-`a`, אלא אם הוא `null` או `undefined`, ואז השתמשו ב-`b`". זה נראה כמו `||` הישן, אבל `||` חוזר לערך החלופי עבור **כל ערך falsy**: גם `0`, `""`, `false` ו-`NaN`.

```js
const volume = 0;
console.log(volume || 50);  // prints: 50   (wrong: 0 is a real volume!)
console.log(volume ?? 50);  // prints: 0    (correct)
```

צורות ההשמה חוסכות חזרות. `x ??= 5` פירושו `x = x ?? 5`, ו-`x ||= 5` פירושו `x = x || 5`. קיים גם `&&=`.

## Rest ו-spread, שוב

שניהם משתמשים ב-`...`. כשהוא **אוסף**, זה **rest**; כשהוא **מפרק**, זה **spread**.

```js
function summarize(first, ...rest) { /* rest is an array of the remaining arguments */ }
const { name, ...others } = user;       // others: a new object without name
const merged = { ...defaults, ...settings }; // later values win
Math.max(...[4, 9, 2]);                 // spread an array into arguments
```

## העתקה: `structuredClone`

`{ ...obj }` ו-`[...list]` יוצרים העתק **שטחי** (shallow): רק הרמה הראשונה חדשה, ואובייקטים מקוננים עדיין משותפים. `structuredClone(value)` יוצרת העתק **עמוק** (deep) של נתונים פשוטים (אובייקטים, מערכים, Map, Set ו-Date). היא לא יכולה להעתיק פונקציות, וזורקת `DataCloneError` אם מנסים.

## עוזרים נוחים למערכים ולאובייקטים

- `list.at(-1)` קוראת מהסוף (`-1` הוא הפריט האחרון); `list[-1]` **לא** עובדת.
- `Object.entries(obj)` מחזירה `[[key, value], ...]`; `Object.fromEntries(entries)` בונה אובייקט מחדש. יחד הן מאפשרות לשנות אובייקט כמו שמשנים מערך.
- `list.flatMap(fn)` היא `map` ואחריה שיטוח של רמה אחת, מצוינת כשכל פריט מפיק כמה תוצאות.

```js
const prices = { apple: 1, pear: 2 };
Object.entries(prices);                       // [["apple", 1], ["pear", 2]]
["a b", "c"].flatMap((s) => s.split(" "));    // ["a", "b", "c"]
```

> **שימו לב:**
> - `TypeError: Cannot read properties of undefined` פירושו ששכחתם `?.` מוקדם יותר בשרשרת, ולא רק בצעד האחרון.
> - שימוש ב-`||` לערכי ברירת מחדל כשהערכים `0`, `""` או `false` הם תקינים. העדיפו `??`.
> - כתיבה של `a ?? b || c` בלי סוגריים היא `SyntaxError`: אסור לערבב `??` עם `||` או עם `&&` בלי להוסיף סוגריים.
> - `const copy = user` לא מעתיקה כלום. שני השמות מצביעים על אותו אובייקט, ולכן שינוי של `copy` משנה את `user`.
> - `structuredClone` על אובייקט שמכיל פונקציה נכשלת עם `DataCloneError`.
> - אי אפשר להשתמש ב-`?.` בצד שמאל של השמה: `user?.name = "x"` היא `SyntaxError`.

## להמשיך הלאה

מזגו שני אובייקטי הגדרות בעזרת spread, ותנו לכל אפשרות חסרה ערך ברירת מחדל בעזרת `??=`. אחר כך השתמשו ב-`Object.entries` עם `sort` כדי להדפיס קודם את המחיר היקר ביותר.

> **תורכם:** החליפו כל מציין מקום (placeholder) בקוד ההתחלה בביטוי אמיתי, לפי שמונה ההערות הממוספרות, עד ששמונה השורות מדפיסות כמו שמוצג.
