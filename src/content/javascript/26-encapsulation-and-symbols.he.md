---
title: "כימוס, סמלים ופרטיות עם WeakMap"
summary: "מגנים על הנתונים של אובייקט בעזרת שדות פרטיים, setters מאמתים, שדות סטטיים פרטיים ובדיקות מותג (brand checks), ומתאימים המרות בעזרת Symbol.toPrimitive."
hints:
  - "שדה פרטי מוכרז עם # בתוך גוף המחלקה ואפשר להשתמש בו רק שם. setter הוא המקום הנכון לאימות, וה-constructor יכול פשוט לכתוב this.celsius = value כך שאותה בדיקה תרוץ. ל-Symbol.toPrimitive מגיע רמז (hint): \"string\", \"number\" או \"default\"."
  - "Fields: #celsius = 0; static #created = 0;   constructor(c) { this.celsius = c; Temperature.#created++; }   get celsius() { return this.#celsius; }   set celsius(v) { if (v < -273.15) throw new RangeError(\"below absolute zero\"); this.#celsius = v; }   static isTemperature(o) { return #celsius in o; }"
  - "[Symbol.toPrimitive](hint) { return hint === \"string\" ? this.#celsius + \" C\" : this.#celsius; }   const tag = Symbol(\"tag\"); t[tag] = \"lab\"; console.log(Object.keys(t).length + \" \" + t[tag]);   const counts = new WeakMap(); constructor() { counts.set(this, 0); } inc() { counts.set(this, counts.get(this) + 1); } get value() { return counts.get(this); }"
messages:
  - "שמרו את הטמפרטורה בשדה פרטי #celsius."
  - "הגדירו שדה סטטי פרטי: static #created = 0;"
  - "הוסיפו getter ו-setter בשם celsius."
  - "השתמשו ב-  #celsius in obj  לבדיקת המותג."
  - "הגדירו את [Symbol.toPrimitive](hint)."
  - "צרו את הסמל עם Symbol(\"tag\")."
  - "צרו את counts עם new WeakMap()."
quiz:
  - q: "מה קורה אם קוד מחוץ למחלקה כותב  obj.#celsius ?"
    options: ["מוחזר undefined", "זו SyntaxError: השם הפרטי תקף רק בתוך גוף המחלקה", "זה עובד אבל מודפסת אזהרה"]
  - q: "למה ה-constructor בתרגיל מבצע  this.celsius = celsius  ולא  this.#celsius = celsius ?"
    options: ["כך ה-setter מאמת גם את הערך ההתחלתי", "אי אפשר לבצע השמה לשדות פרטיים ב-constructor", "זה מהיר יותר"]
  - q: "מה  Object.keys(obj)  מציג עבור מאפיין שהמפתח שלו הוא Symbol?"
    options: ["את התיאור של הסמל", "את המילה Symbol", "כלום: מפתחות של סמלים מדולגים"]
    explain: "מפתחות של סמלים מדולגים גם ב-for...in וב-JSON.stringify. השתמשו ב-Object.getOwnPropertySymbols(obj) או ב-Reflect.ownKeys(obj) כדי למנות אותם."
  - q: "מה היתרון של WeakMap לנתונים פרטיים לעומת Map רגיל?"
    options: ["הוא הרבה יותר מהיר", "כשאובייקט המפתח כבר לא בשימוש בשום מקום, אפשר לאסוף את הרשומה שלו בעזרת garbage collection", "הוא שומר את המפתחות ממוינים"]
---

**כימוס** (encapsulation) פירושו לשמור את הנתונים הפנימיים של אובייקט מוסתרים, ולאפשר שינויים רק דרך שיטות (methods) שדואגות שהנתונים יישארו תקינים. חשבו על חשבון בנק: אי אפשר להיכנס לכספת ולערוך את היתרה, אפשר רק לקרוא ל-`deposit` ול-`withdraw`. בשיעור הזה תתקדמו מעבר ליסודות מהשיעור "Classes and inheritance", ותכירו גם סמלים (symbols) ו-WeakMap.

## אימות עם getters ו-setters

**getter** (`get x()`) ו-**setter** (`set x(value)`) נראים מבחוץ כמו מאפיין רגיל, אבל מריצים קוד. ה-setter הוא המקום הטבעי לסרב לערכים לא תקינים:

```js
class Account {
  #balance = 0;
  get balance() { return this.#balance; }
  set balance(value) {
    if (value < 0) throw new RangeError("negative balance");
    this.#balance = value;
  }
}
const a = new Account();
a.balance = 50;       // runs the setter
console.log(a.balance); // prints: 50
a.balance = -5;       // RangeError: negative balance
```

ה-`#` הופך את `#balance` לפרטי באמת: רק קוד **בתוך גוף המחלקה** יכול לגעת בו. קוד מבחוץ מקבל `SyntaxError`, ובניגוד לקונבנציית שמות כמו `_balance`, אף אחד לא יכול לעקוף את זה.

## עוד דברים פרטיים וחברים סטטיים

שמות פרטיים יכולים להיות גם **שיטות** (`#recalculate() { ... }`) וגם שדות **סטטיים** (`static #created = 0`). חבר סטטי שייך למחלקה עצמה: `Temperature.created`, לא `t.created`. בתוך המחלקה ניגשים לשדה סטטי פרטי דרך שם המחלקה: `Temperature.#created++`.

טריק נחמד הוא **בדיקת מותג** (brand check). `#celsius in obj` היא `true` רק עבור אובייקטים שנבנו באמת על ידי המחלקה הזאת (הם מחזיקים את השדה הפרטי). היא אף פעם לא זורקת שגיאה, ולכן היא מושלמת עבור `isTemperature(obj)` בטוחה.

## שליטה בהמרה עם Symbol.toPrimitive

כש-JavaScript צריכה להפוך אובייקט לערך פשוט (`${obj}`, `obj + 5`, `obj > 20`) היא שואלת את האובייקט **רמז** (hint): `"string"`, `"number"` או `"default"`. עונים על השאלה בהגדרת שיטה תחת המפתח המיוחד `Symbol.toPrimitive`:

```js
const price = {
  amount: 9,
  [Symbol.toPrimitive](hint) {
    return hint === "string" ? "$" + this.amount : this.amount;
  },
};
console.log(`${price}`);  // prints: $9
console.log(price * 2);   // prints: 18
```

## מהו Symbol?

**סמל** (symbol) הוא ערך ייחודי שנוצר עם `Symbol("description")`. שני סמלים אף פעם לא שווים, גם אם יש להם אותו תיאור. כשמשתמשים בסמל כמפתח של מאפיין, הוא לא יכול להתנגש עם אף מפתח אחר, והוא מדולג על ידי `Object.keys`, `for...in` ו-`JSON.stringify`. לכן סמלים מתאימים למטא-נתונים שלא אמורים להופיע בלולאות רגילות. (כבר פגשתם את `Symbol.iterator`, סמל מובנה "מוכר" (well-known).)

```js
const id = Symbol("id");
const user = { name: "Ada", [id]: 7 };
console.log(Object.keys(user)); // prints: [ "name" ]
console.log(user[id]);          // prints: 7
```

שימו לב לסוגריים המרובעים: `[id]: 7` פירושו "השתמשו בערך של `id` כמפתח".

## פרטיות לפני `#`: WeakMap

קוד ישן הסתיר נתונים ב-**WeakMap** שהוכרז מחוץ למחלקה: המפתח הוא האובייקט, והערך הוא הנתונים הסודיים שלו. רק קוד שרואה את ה-WeakMap יכול לקרוא אותם. מכיוון שהמפתחות מוחזקים באופן חלש, הנתונים נעלמים כשהאובייקט נעלם, ולכן אין דליפת זיכרון. עדיין תפגשו את התבנית הזאת בספריות שחייבות לתמוך בדפדפנים ישנים.

> **שימו לב:**
> - `SyntaxError: Private field '#balance' must be declared in an enclosing class` כשמשתמשים ב-`#balance` מחוץ למחלקה או שוכחים להצהיר עליו בראש גוף המחלקה.
> - קריאה ל-getter כמו לפונקציה: `a.balance()` נותנת `TypeError: a.balance is not a function`.
> - setter בלי getter תואם גורם למאפיין להיקרא כ-`undefined`.
> - השמה בתוך setter לשם באותו שם (`this.balance = value`) במקום לשדה הפרטי: זה קורא ל-setter שוב ומסתיים ב-`RangeError: Maximum call stack size exceeded`.
> - שדות פרטיים לא מועתקים על ידי spread או `structuredClone`, ולא מופיעים ב-`console.log` כמו שדות רגילים.
> - שימוש ב-`Symbol` עם `new`: `new Symbol()` זורקת `TypeError: Symbol is not a constructor`.

## להמשיך הלאה

הוסיפו ל-`Temperature` שיטה פרטית `#log(message)`, קראו לה מתוך ה-setter, והוכיחו ש-`t.#log` נכשלת מבחוץ. נסו את `Object.getOwnPropertySymbols(t)` כדי לראות את מפתח הסמל מהתרגיל.

> **תורכם:** סיימו את המחלקה `Temperature` (שדה פרטי, setter מאמת, מונה סטטי פרטי, בדיקת מותג, `Symbol.toPrimitive`), ואז הוסיפו את מאפיין הסמל ואת `Counter` המבוסס על WeakMap.
