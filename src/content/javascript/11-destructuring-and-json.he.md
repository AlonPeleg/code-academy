---
title: "פירוק (Destructuring), spread ו-JSON"
summary: "פרקו ערכים במהירות, העתיקו אובייקטים, והמירו נתונים לטקסט ובחזרה."
hints:
  - "Destructuring מעתיק ערכים מתוך אובייקטים (לפי שם, בסוגריים מסולסלים) ומערכים (לפי מיקום, בסוגריים מרובעים) למשתנים. Spread מעתיק, ו-JSON ממיר לטקסט ובחזרה."
  - "const { name, city } = user;  const [first, second] = user.skills;  const older = { ...user, age: 21 };  ואז JSON.stringify(...) לקבלת הטקסט ו-JSON.parse(text) כדי לקבל בחזרה את האובייקט."
  - "console.log(`${name} lives in ${city}`);  console.log(first, second);  console.log(JSON.stringify({ name, city }));  const data = JSON.parse(text);  console.log(data.score + 1);"
quiz:
  - q: "מה עושה  const { name } = user;  ?"
    options: ["יוצרת משתנה name שמחזיק את user.name", "יוצרת אובייקט בשם name", "מוחקת את name מ-user"]
  - q: "מה מחזירה  JSON.stringify(obj)  ?"
    options: ["אובייקט חדש", "מחרוזת טקסט שמתארת את האובייקט", "מספר"]
  - q: "מה עושה  const copy = { ...original, x: 5 };  ?"
    options: ["משנה את original.x ל-5", "זורקת שגיאה", "מעתיקה את המאפיינים של original לאובייקט חדש, וקובעת את x ל-5"]
  - q: "למה JSON שימושי?"
    options: ["זה פורמט טקסט לשמירה ולשליחה של נתונים בין תוכניות", "זה גורם לדפים להיטען מהר יותר", "זה סוג של לולאה"]
messages:
  - "השתמשו בפירוק אובייקט: const { name, city } = user;"
  - "השתמשו בפירוק מערך: const [first, second] = user.skills;"
  - "השתמשו בתחביר spread כדי להעתיק את user."
  - "השתמשו ב-JSON.stringify()."
  - "השתמשו ב-JSON.parse()."
---

עד עכשיו אתם מכירים מערכים ואובייקטים. השיעור הזה מראה שלושה חלקים קטנים אבל עוצמתיים של JavaScript מודרנית שתראו כמעט בכל פרויקט אמיתי: **פירוק** (destructuring), תחביר **spread**, ו-**JSON**.

## פירוק אובייקט

במקום לכתוב

```js
const name = user.name;
const city = user.city;
```

אפשר לשלוף כמה מאפיינים בבת אחת:

```js
const { name, city } = user;
```

הסוגריים המסולסלים **משמאל** ל-`=` לא יוצרים אובייקט. הם אומרים "קחו את המאפיינים שנקראים `name` ו-`city` מתוך `user` וצרו משתנים עם השמות האלה". השמות חייבים להתאים לשמות המאפיינים. כדי להשתמש בשם משתנה אחר, כתבו `const { name: userName } = user;`.

## פירוק מערך

במערכים משתמשים בסוגריים מרובעים ובוחרים לפי **מיקום**:

```js
const colors = ["red", "green", "blue"];
const [first, second] = colors;
console.log(first, second); // prints: red green
```

אפשר גם לדלג על פריטים עם מקום ריק: `const [, , third] = colors;`.

## Spread: העתקה ושילוב

שלוש נקודות `...` "פורשות" את התוכן של מערך או אובייקט לתוך חדש:

```js
const a = [1, 2];
const b = [...a, 3];     // [1, 2, 3]  a new array

const user = { name: "Ava", age: 20 };
const older = { ...user, age: 21 };  // copy, then override age
console.log(user.age);   // prints: 20  (the original is untouched)
console.log(older.age);  // prints: 21
```

מאפיינים שנכתבים מאוחר יותר מנצחים. זו הדרך הסטנדרטית "לשנות" אובייקט בלי לשנות את המקורי.

## JSON: נתונים כטקסט

**JSON** (JavaScript Object Notation) הוא פורמט טקסט שנראה כמו אובייקט של JavaScript. כך תוכניות שולחות נתונים זו לזו דרך האינטרנט ושומרות אותם בקבצים.

- `JSON.stringify(value)` הופכת ערך לטקסט JSON.
- `JSON.parse(text)` הופכת טקסט JSON בחזרה לערך אמיתי.

```js
const text = JSON.stringify({ name: "Ava", age: 21 });
console.log(text);        // prints: {"name":"Ava","age":21}
console.log(typeof text); // prints: string

const back = JSON.parse(text);
console.log(back.name);   // prints: Ava
```

ל-JSON יש חוקים מחמירים יותר מאשר לאובייקטים של JavaScript: מפתחות חייבים להיות ב**מרכאות כפולות**, ערכי טקסט חייבים להשתמש במרכאות כפולות (לעולם לא בודדות), ואין פסיקים בסוף, אין פונקציות ואין הערות.

אפשר גם להעביר ארגומנטים נוספים כדי שהטקסט ייראה יפה: `JSON.stringify(obj, null, 2)`.

## מאפיינים בקיצור

כשלמשתנה יש אותו שם כמו המפתח שרוצים, אפשר לכתוב אותו פעם אחת: `{ name, city }` הוא קיצור של `{ name: name, city: city }`. משתמשים בזה בשלב ה-stringify של התרגיל.

> **שימו לב:**
> - כתיבת שמות שגויה בפירוק: `const { nmae } = user;` נותנת `undefined`, כי אין מאפיין כזה.
> - שימוש בסוגריים הלא נכונים: `{ }` לאובייקטים (לפי שם) ו-`[ ]` למערכים (לפי מיקום).
> - Spread יוצר העתק **רדוד** (shallow). אובייקטים ומערכים מקוננים בפנים עדיין משותפים עם המקור.
> - JSON לא תקין: `JSON.parse("{'a': 1}")` נכשלת עם `SyntaxError: Unexpected token ' in JSON at position 1`, כי JSON דורש מרכאות כפולות.
> - לשכוח ש-`JSON.stringify` מוחקת פונקציות וערכי `undefined`.
> - הצהרה מחדש על משתנה: `const name = ...` פעמיים באותו scope נותנת `SyntaxError: Identifier 'name' has already been declared`.

## להמשיך הלאה

פרקו בפרמטרים של פונקציה: `function show({ name, city }) { return name + ", " + city; }`. השתמשו ב-`JSON.stringify(user, null, 2)` כדי להדפיס אובייקט עם הזחה יפה.

> **תורכם:** עקבו אחרי ההערות הממוספרות והדפיסו את שש השורות.
