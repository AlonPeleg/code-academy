---
title: "אובייקטים"
summary: "קבצו ערכים קשורים יחד כמאפיינים, ותנו להם התנהגות עם מתודות."
hints:
  - "אובייקט הוא צרור של ערכים עם שמות. קוראים וכותבים מאפיין עם נקודה, או עם סוגריים מרובעים כשהשם שמור במשתנה."
  - "book.pages = 412; ואז const field = \"author\"; book[field]. המתודה היא פונקציה ששמורה על האובייקט: describe() { return `...`; } ובתוכה מתייחסים לאובייקט עם this."
  - "book.pages = 412;  const field = \"author\";  book.describe = function () { return `${this.title} by ${this.author} (${this.year})`; };  ו-console.log(Object.keys(book).length);"
quiz:
  - q: "איך קוראים את המאפיין title של אובייקט בשם book?"
    options: ["book(title)", "book.title", "book->title"]
  - q: "מתי חייבים להשתמש בסוגריים מרובעים, כמו  book[field] ?"
    options: ["כששם המאפיין שמור במשתנה", "אף פעם, תמיד אפשר להשתמש בנקודה", "רק עבור מספרים"]
  - q: "בתוך מתודה, למה מתייחסת המילה  this  ?"
    options: ["לכל התוכנית", "לחלון הדפדפן", "לאובייקט שהמתודה שייכת לו"]
  - q: "מה מחזירה  Object.keys(obj)  ?"
    options: ["מערך של שמות המאפיינים", "את המאפיין הראשון", "עותק של האובייקט"]
messages:
  - "השתמשו ב-this.title, ב-this.author וב-this.year בתוך המתודה."
  - "השתמשו ב-Object.keys(book).length כדי לספור את המאפיינים."
  - "השתמשו בסוגריים מרובעים: book[field]."
---

מערך הוא רשימה, שבה המיקום חשוב. **אובייקט** (object) הוא אוסף של ערכים עם *שמות*, שבו השמות חשובים. אובייקטים הם הדרך של JavaScript לתאר דברים מהעולם האמיתי: משתמש, ספר, מוצר, דמות במשחק.

## יצירת אובייקט

```js
const user = {
  name: "Ava",
  age: 21,
  isStudent: true,
};
```

- סוגריים מסולסלים `{ }` עוטפים את האובייקט.
- כל רשומה היא **מאפיין** (property): `name`, נקודתיים, ו-`value`. את השם אנחנו קוראים *מפתח* (key).
- מאפיינים מופרדים בפסיקים. פסיק בסוף מותר.
- ערכים יכולים להיות כל דבר: טקסט, מספרים, ערכים בוליאניים, מערכים, ואפילו אובייקטים אחרים.

## קריאה ושינוי של מאפיינים

```js
console.log(user.name);   // prints: Ava
user.age = 22;            // change a property
user.city = "Haifa";      // add a new property
delete user.isStudent;    // remove a property
```

זכרו ש-`const` מגן רק על המשתנה, לא על הפנים של האובייקט, ולכן השינויים שלמעלה מותרים.

## סוגריים מרובעים

אפשר לכתוב גם `user["name"]`. היתרון הגדול הוא שהשם יכול להיות **משתנה**:

```js
const field = "age";
console.log(user[field]); // prints: 22
```

אם הייתם כותבים `user.field`, JavaScript הייתה מחפשת מאפיין שנקרא בדיוק "field". השתמשו בסוגריים מרובעים לשמות ששמורים במשתנים או שמכילים רווחים.

## מתודות ו-this

מאפיין יכול להחזיק פונקציה. פונקציה ששייכת לאובייקט נקראת **מתודה** (method):

```js
const dog = {
  name: "Rex",
  speak() {
    return `${this.name} says woof!`;
  },
};
console.log(dog.speak()); // prints: Rex says woof!
```

בתוך מתודה רגילה, `this` פירושו "האובייקט שהמתודה הזו נקראה עליו", ולכן `this.name` הוא `dog.name`. (בפונקציות חץ `this` עובד אחרת, ולכן השתמשו ב-`function` או בצורה הקצרה של מתודה.) כבר השתמשתם במתודות: `console.log` היא המתודה `log` של האובייקט `console`.

## מעבר על אובייקט בלולאה

```js
const keys = Object.keys(user);     // array of the keys
const values = Object.values(user); // array of the values

for (const key of Object.keys(user)) {
  console.log(key + ": " + user[key]);
}
```

`Object.keys(user).length` אומר לכם כמה מאפיינים יש.

## אובייקטים בתוך מערכים

צורת הנתונים הנפוצה ביותר היא רשימה של אובייקטים:

```js
const people = [
  { name: "Ava", age: 21 },
  { name: "Ben", age: 17 },
];
const adults = people.filter((p) => p.age >= 18);
console.log(adults.length); // prints: 1
```

> **שימו לב:**
> - קריאה של מאפיין שלא קיים נותנת `undefined`, לא שגיאה. שגיאת כתיב כמו `user.nmae` נותנת `undefined` בשקט.
> - קריאה של מאפיין של משהו שחסר: `user.address.street` כש-`address` הוא undefined נכשלת עם `TypeError: Cannot read properties of undefined (reading 'street')`.
> - שימוש ב-`=` במקום `:` בתוך הסוגריים, או שכחת הפסיקים בין המאפיינים: `SyntaxError: Unexpected identifier`.
> - שימוש בפונקציית חץ כמתודה ואז שימוש ב-`this`: `this.name` לא יהיה האובייקט.
> - השוואת אובייקטים: `{ a: 1 } === { a: 1 }` הוא `false`, כי אלה שני אובייקטים שונים.
> - הדפסת אובייקט עם טקסט, כמו `"User: " + user`, נותנת `User: [object Object]`. הדפיסו את המאפיינים שלו במקום.

## להמשיך הלאה

הוסיפו מתודה `birthday()` ל-`user` שמגדילה את `this.age` באחד. צרו מערך של שלושה ספרים והשתמשו ב-`map` כדי לקבל את כל הכותרות שלהם.

> **תורכם:** עקבו אחרי ההערות: הוסיפו `pages`, קראו מאפיין עם סוגריים מרובעים, הוסיפו מתודה `describe` שמשתמשת ב-`this`, והדפיסו כמה מאפיינים יש לספר.
