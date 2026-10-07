---
title: "איטרטורים וגנרטורים"
summary: "צרו רצפים משלכם שעובדים עם for...of ו-spread, כולל רצפים אינסופיים שמפיקים ערכים בעצלנות."
hints:
  - "גנרטור הוא פונקציה שמוצהרת עם function* ויכולה לעצור בכל yield ולהמשיך מאוחר יותר. Spread ‏([...x]) ו-for...of שואלים שוב ושוב iterable מהו הערך הבא שלו. גנרטור שלא מסתיים אף פעם הוא בסדר כל עוד הצרכן מפסיק לבקש."
  - "range: for (let i = start; i < end; i += step) { yield i; }   fibonacci: let a = 0, b = 1; while (true) { yield a; [a, b] = [b, a + b]; }   take: ספרו עם מספר וחזרו כשמגיעים ל-n. ב-Playlist: *[Symbol.iterator]() { ... }"
  - "function* range(start, end, step = 1) { for (let i = start; i < end; i += step) yield i; }   function* fibonacci() { let [a, b] = [0, 1]; while (true) { yield a; [a, b] = [b, a + b]; } }   function* take(n, iterable) { let i = 0; for (const x of iterable) { if (i++ >= n) return; yield x; } }   *[Symbol.iterator]() { yield* this.songs; }"
quiz:
  - q: "מה עושה המילה yield בתוך גנרטור?"
    options: ["מסיימת את התוכנית", "מוסרת ערך אחד לקורא ועוצרת עד שמבקשים את הערך הבא", "יוצרת מערך חדש"]
  - q: "למה  fibonacci()  יכולה להיות לולאה אינסופית בלי להקפיא את התוכנית?"
    options: ["גנרטורים רצים ב-thread נפרד", "JavaScript מזהה ועוצרת לולאות אינסופיות", "היא רצה רק כשמבקשים את הערך הבא, ולכן הצרכן מחליט מתי להפסיק"]
    explain: "זה נקרא הערכה עצלנית (lazy evaluation). הקוד בין שני yield רץ רק כשמבקשים את הערך הבא."
  - q: "מה מחזירה  steps.next()  ?"
    options: ["אובייקט כמו { value, done }", "תמיד את המספר הבא", "promise"]
  - q: "מה חייב להיות לאובייקט כדי שיעבוד עם for...of?"
    options: ["מאפיין length", "מתודה בשם Symbol.iterator שמחזירה איטרטור", "להיות מערך"]
messages:
  - "הצהירו על range עם function* range(...)."
  - "הצהירו על function* fibonacci()."
  - "הצהירו על function* take(n, iterable)."
  - "הוסיפו *[Symbol.iterator]() { ... } למחלקה Playlist."
  - "השתמשו במילת המפתח yield."
---

מערך מחזיק את כל הערכים שלו בבת אחת. אבל רצפים מסוימים הם ענקיים, או אינסופיים, או יקרים לחישוב: כל מספר ראשוני, שורות של קובץ ענק, כל עמוד של תוצאות חיפוש. **גנרטורים** (generators) מאפשרים לתאר רצף שמפיק ערכים **אחד בכל פעם, לפי דרישה**. בדרך תלמדו את הפרוטוקול שמאחורי `for...of`, spread ופירוק (destructuring).

## פרוטוקול האיטרטור

כשכותבים `for (const x of something)`, JavaScript מבקשת מ-`something` **איטרטור** (iterator). איטרטור הוא כל אובייקט עם מתודה `next()` שמחזירה `{ value, done }`: הערך הבא, והאם הרצף הסתיים. כתוב ביד זה קצת מסורבל:

```js
function countTo(max) {
  let n = 0;
  return {
    next() {
      n++;
      return n <= max ? { value: n, done: false } : { value: undefined, done: true };
    },
  };
}
```

**Iterable** הוא אובייקט שיכול למסור איטרטור, בכך שיש לו מתודה בשם `Symbol.iterator`. מערכים, מחרוזות, Map ו-Set הם כולם iterable, ולכן הם עובדים עם `for...of`, עם spread ‏(`[...x]`) ועם פירוק.

## גנרטורים: איטרטורים בקלות

**פונקציית גנרטור** מוצהרת עם `function*`. בתוכה, המילה `yield` מוסרת ערך ו**עוצרת** את הפונקציה. הבקשה הבאה ממשיכה אותה מיד אחרי ה-`yield`:

```js
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

console.log([...range(0, 10, 3)]); // prints: [0, 3, 6, 9]
```

קריאה לפונקציית גנרטור לא מריצה את הגוף שלה. היא מחזירה **אובייקט גנרטור**, שהוא גם איטרטור וגם iterable:

```js
const g = range(1, 3);
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.next(); // { value: undefined, done: true }
```

שימו לב שהמשתנים המקומיים (`i`) נזכרים בין הקריאות. זה כוח העל: הפונקציה שומרת על המקום שלה.

## רצפים אינסופיים

מכיוון שערכים מופקים רק לפי בקשה, גנרטור יכול לרוץ בלולאה לנצח:

```js
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
```

זה בטוח כל עוד הצרכן מפסיק. כתבו פונקציית עזר שלוקחת את `n` הפריטים הראשונים ויוצאת (עם `return`), ותוכלו לשלב אותה עם כל רצף:

```js
function* take(n, iterable) {
  let count = 0;
  for (const item of iterable) {
    if (count >= n) return;
    yield item;
    count++;
  }
}
```

לעולם אל תכתבו `[...fibonacci()]`. Spread מנסה לאסוף רצף אינסופי והתוכנית נתקעת. כשהלולאה ב-`take` חוזרת, JavaScript סוגרת בשבילכם את הגנרטור שמתחת.

## להפוך מחלקה משלכם ל-iterable

תנו למחלקה מתודת גנרטור עם המפתח המיוחד `Symbol.iterator`, שנכתב `*[Symbol.iterator]()`:

```js
class Playlist {
  constructor(songs) { this.songs = songs; }
  *[Symbol.iterator]() {
    yield* this.songs;   // delegate: yield every item of another iterable
  }
}
```

`yield*` מעבירה את השליטה ל-iterable אחר ומוסרת כל אחד מהפריטים שלו בתורו. עכשיו `for (const song of new Playlist([...]))` פשוט עובד, וכך גם `[...playlist]`.

## למה להתאמץ?

- **זיכרון**: עבדו על מיליון פריטים אחד אחד בלי לבנות מערך של מיליון פריטים.
- **יציאה מוקדמת**: עצרו אחרי ההתאמה הראשונה בלי לחשב את השאר.
- **קוד נקי**: הפכו לולאה מסובכת לצינור לשימוש חוזר (`take(5, filter(isEven, naturals()))`).

> **שימו לב:**
> - ביצוע spread או לולאה על גנרטור אינסופי בלי תנאי עצירה. הלשונית קופאת וההרצה נעצרת אחרי כמה שניות.
> - שכחת הכוכבית: `function range()` עם `yield` בתוכה היא `SyntaxError: Unexpected identifier` (או ש-yield נחשב כמשתנה).
> - שימוש חוזר בגנרטור שהסתיים. ברגע ש-`done` הוא `true` הוא נשאר ריק. `const g = range(0, 3); [...g]; [...g]` נותן מערך ריק בפעם השנייה. קראו שוב ל-`range(...)` כדי לקבל גנרטור חדש.
> - כתיבת `yield` בתוך callback רגיל, כמו `items.forEach(x => { yield x; })`. `yield` עובד רק ישירות בגוף של פונקציית הגנרטור, ולכן השתמשו בלולאת `for...of` במקום.
> - כתיבת `[Symbol.iterator]() {` בלי הכוכבית ועם `yield` בפנים. צריך גם את הכוכבית וגם את השם המחושב.

## להמשיך הלאה

כתבו `function* filter(predicate, iterable)` ו-`function* map(fn, iterable)`, ואז הדפיסו `[...take(5, map(x => x * x, filter(x => x % 2 === 1, range(0, Infinity))))]`.

> **תורכם:** כתבו את הגנרטורים `range`, `fibonacci` ו-`take`, ואז תנו ל-`Playlist` מתודה `*[Symbol.iterator]()` כך שהלולאה האחרונה תדפיס את שלושת השירים.
