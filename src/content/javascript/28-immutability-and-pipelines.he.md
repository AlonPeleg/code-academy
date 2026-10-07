---
title: "אי-שינוי (immutability) ושרשראות עיבוד פונקציונליות"
summary: "מפסיקים לשנות נתונים במקום, מקפיאים אובייקטים, מעדכנים state על ידי העתקה, משתפים חלקים שלא השתנו, ובונים טרנספורמציות על נתונים בעזרת reduce."
hints:
  - "קוד שאינו משנה נתונים (immutable) אף פעם לא משנה את הנתונים שהוא מקבל; הוא בונה נתונים חדשים. spread ({ ...obj } ו-[...list]) מעתיק רמה אחת, ו-map בונה מערך חדש ומחזיר את אותו פריט ישן עבור רשומות שלא השתנו."
  - "deepFreeze: Object.freeze(value), ואז לולאה על Object.values(value) וקריאה ל-deepFreeze על כל אובייקט. toggle: return { ...state, todos: state.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }. addTodo: return { ...state, todos: [...state.todos, { id: state.todos.length + 1, text, done: false }] }."
  - "groupBy: return items.reduce((acc, item) => { const key = keyFn(item); return { ...acc, [key]: [...(acc[key] ?? []), item] }; }, {});   ובנוסף: console.log(nums.toSorted((a, b) => a - b).join(\",\") + \" | \" + nums.join(\",\"));"
messages:
  - "השתמשו ב-Object.freeze(value) בתוך deepFreeze."
  - "deepFreeze צריכה לקרוא לעצמה עבור ערכים מקוננים."
  - "העתיקו את ה-state הישן עם spread: { ...state, ... }."
  - "בנו את הקבוצות עם reduce."
  - "השתמשו ב-toSorted, שמחזירה עותק ממוין."
quiz:
  - q: "מה פירוש להתייחס לנתונים כאל נתונים שאינם משתנים (immutable)?"
    options: ["אף פעם לא ליצור משתנים חדשים", "להשתמש רק בקבועים עבור מספרים", "אף פעם לא לשנות נתונים קיימים במקום, ותמיד ליצור במקומם ערך חדש"]
  - q: "האם  Object.freeze(obj)  מקפיאה גם אובייקטים שמקוננים בתוך obj?"
    options: ["כן, תמיד", "לא, היא שטחית (shallow): רק הרמה הראשונה קופאת", "רק מערכים שבתוכו"]
    explain: "בגלל זה השיעור כותב deepFreeze, שקוראת לעצמה עבור כל אובייקט מקונן."
  - q: "למה toggle() בשיעור מחזירה את אותו אובייקט עבור משימות שלא השתנו?"
    options: ["אפשר לשתף בבטחה חלקים שלא השתנו כי אף אחד לא משנה אותם, וזה זול ומקל על זיהוי שינוי", "זו טעות שצריך להימנע ממנה", "כי map לא יכולה להעתיק אובייקטים"]
  - q: "איזו מהשיטות הבאות משנה את המערך המקורי?"
    options: ["arr.sort()", "arr.toSorted()", "arr.map(fn)"]
    explain: "sort, reverse, splice ו-push משנות את המערך. toSorted, toReversed, toSpliced, with, map, filter ו-slice מחזירות מערכים חדשים."
---

רוב הבאגים בתוכניות גדולות יותר מגיעים מנתונים ש**השתנו כשלא ציפיתם לזה**. פונקציה מקבלת מערך, ממיינת אותו, ופתאום הרשימה על המסך בסדר אחר. **אי-שינוי** (immutability) הוא ההרגל לא לשנות נתונים במקום. במקום לשנות ערך, יוצרים ערך חדש ומעודכן ומשאירים את הישן בשקט. זה הרעיון שמאחורי state ב-React, Redux וכלים רבים אחרים.

## שינוי (mutation): הבעיה

```js
const a = { count: 1 };
const b = a;      // not a copy: both names point to the same object
b.count = 2;
console.log(a.count); // prints: 2 (surprise!)
```

אובייקטים ומערכים משותפים לפי הפניה (reference), ולכן כל פונקציה ששינתה את הארגומנט שלה שינתה גם את הנתונים של הקורא. שיטות כמו `push`, `sort`, `reverse` ו-`splice` כולן **משנות** (mutate) את המערך שלהן.

## הקפאה

`Object.freeze(obj)` הופכת אובייקט לקריא בלבד: הוספה, שינוי או מחיקה של מאפיינים נדחים. בקוד strict (ובמודולים) הדחייה היא `TypeError: Cannot assign to read only property 'name' of object`; בקוד sloppy מתעלמים ממנה בשקט. בדקו עם `Object.isFrozen(obj)`.

```js
const settings = Object.freeze({ theme: "dark" });
settings.theme = "light"; // ignored or TypeError, depending on strictness
```

ההקפאה היא **שטחית** (shallow): אובייקטים מקוננים נשארים ניתנים לשינוי. כדי להגן על עץ שלם כותבים `deepFreeze`, פונקציה רקורסיבית קטנה (השתמשתם ברקורסיה בשיעור קודם): מקפיאים את האובייקט, ואז קוראים ל-`deepFreeze` על כל ערך מקונן. הקפאה היא בעיקר רשת ביטחון בזמן הפיתוח; הטכניקה האמיתית היא הבאה.

## עדכונים בהעתקה (copy-on-write)

כדי "לשנות" נתונים שאינם משתנים, בונים אובייקט חדש שהוא הישן ועוד השינוי שלכם. תחביר spread עושה את ההעתקה:

```js
const user = { name: "Ada", city: "London" };
const moved = { ...user, city: "Paris" };   // new object, user untouched

const list = [1, 2, 3];
const longer = [...list, 4];                // add
const without = list.filter((x) => x !== 2); // remove
const doubled = list.map((x) => x * 2);      // change all
```

עבור נתונים מקוננים מעתיקים כל רמה שבדרך לשינוי ו**משתמשים מחדש בכל השאר**. זה נקרא **שיתוף מבני** (structural sharing):

```js
const next = {
  ...state,
  todos: state.todos.map((t) => (t.id === 2 ? { ...t, done: true } : t)),
};
```

`next` הוא אובייקט חדש, `next.todos` הוא מערך חדש, והמשימה עם id 2 היא אובייקט חדש. אבל `next.user` הוא בדיוק אותו אובייקט כמו `state.user`, וכך גם המשימה עם id 1. שום דבר לא הועתק שלא לצורך, ובדיקה כמו `next.user === state.user` אומרת לכם בזול שלא השתנה שם כלום. כך בדיוק React יודעת מה צריך לרנדר מחדש.

## שיטות מערך שאינן משנות

JavaScript מודרנית הוסיפה תאומים מעתיקים לשיטות המשנות הישנות: `toSorted`, `toReversed`, `toSpliced` ו-`with(index, value)`. יחד עם `map`, `filter`, `slice` ו-`concat` אפשר לעשות כמעט הכול בלי שינוי.

## שרשראות עיבוד (pipelines) ו-reduce

`reduce` מקפלת רשימה לערך אחד. אם המצבור (accumulator) הוא תמיד אובייקט **חדש**, כל הטרנספורמציה נשארת טהורה (pure):

```js
const total = [2, 4, 6].reduce((sum, n) => sum + n, 0); // 12
```

אפשר לשרשר צעדים כאלה (`filter`, `map`, `reduce`) ל**שרשרת עיבוד** (pipeline): נתונים נכנסים בראש ותוצאה יוצאת, בלי שום משתנה ששונה בדרך. כל צעד קל לקריאה, לבדיקה ולשינוי סדר.

מילה על המחיר: העתקה של מערך גדול בכל שינוי איטית יותר משינוי שלו במקום. ברוב היישומים זה לא משנה, ושיתוף מבני שומר על זה זול. מדדו לפני שאתם דואגים, והשתמשו בשינוי בתוך פונקציה כשהנתונים מקומיים ולעולם לא בורחים החוצה.

> **שימו לב:**
> - להאמין ש-`const` הופך נתונים לבלתי משתנים. הוא רק מונע השמה מחדש של השם: `const list = []; list.push(1)` עובד.
> - `{ ...state }` הוא העתק שטחי. שינוי של `copy.user.name` עדיין משנה את `state.user.name` כי האובייקט המקונן משותף.
> - `const sorted = list.sort()` ממיינת את `list` עצמה ומחזירה את אותו מערך. השתמשו ב-`toSorted()` או ב-`[...list].sort()`.
> - לשכוח את צד ה-`else` ב-`map`: `t.id === id ? { ...t, done: true }` לבדו נותן `undefined` עבור כל השאר. החזירו `t` עבור פריטים שלא השתנו.
> - להתייחס ל-`TypeError: Cannot assign to read only property` כאל באג ב-`freeze`. זו ה-freeze שעושה את עבודתה: מצאו את השורה ששינתה והחליפו אותה בהעתקה.
> - `JSON.parse(JSON.stringify(x))` כהעתקה עמוקה מאבד `undefined`, תאריכים ו-Maps. העדיפו `structuredClone`.

## להמשיך הלאה

כתבו את `removeTodo(state, id)` ואת `rename(state, name)` באותו סגנון. אחר כך חשבו את המחיר הכולל של הזמנה עם `filter`, `map` ו-`reduce` בביטוי משורשר אחד, וודאו שהמערך המקורי לא השתנה.

> **תורכם:** ממשו את `deepFreeze`, `toggle`, `addTodo` ו-`groupBy`, והדפיסו את העותק הממוין עם `toSorted`. שבע שורות הפלט מופיעות בבדיקה.
