---
title: "Proxy ו-Reflect"
summary: "עוטפים אובייקט ב-Proxy כדי ליירט קריאה וכתיבה, ומשתמשים ב-Reflect כדי להעביר את העבודה הלאה בבטחה, לצורך אימות, ערכי ברירת מחדל, רישום (logging) ואינדקסים שליליים."
hints:
  - "new Proxy(target, handler) מחזיר מחליף של target. הפונקציה get(target, prop, receiver) של ה-handler רצה בכל קריאה, ו-set(target, prop, value, receiver) בכל כתיבה. בתוך trap, Reflect.get(...) ו-Reflect.set(...) מבצעות את פעולת ברירת המחדל הרגילה."
  - "trap מסוג set חייב להחזיר true כשהצליח (return Reflect.set(target, prop, value, receiver)), אחרת קוד במצב strict זורק TypeError. ב-get, בדקו קודם prop in target: אם הוא קיים החזירו Reflect.get(target, prop, receiver), ואחרת החזירו את fallback."
  - "function validated(target) { return new Proxy(target, { set(t, prop, value, r) { if (prop === \"age\" && typeof value !== \"number\") throw new TypeError(prop + \" must be a number\"); return Reflect.set(t, prop, value, r); } }); }   For withDefault: get(t, prop, r) { return prop in t ? Reflect.get(t, prop, r) : fallback; }   For negativeIndex: get(t, prop, r) { if (typeof prop === \"string\" && /^-\\d+$/.test(prop)) return t[t.length + Number(prop)]; return Reflect.get(t, prop, r); }"
messages:
  - "צרו את העוטפים עם new Proxy(target, handler)."
  - "הוסיפו trap מסוג set: set(target, prop, value, receiver) { ... }."
  - "הוסיפו trap מסוג get: get(target, prop, receiver) { ... }."
  - "העבירו את העבודה האמיתית הלאה עם Reflect.get / Reflect.set."
quiz:
  - q: "מהו Proxy?"
    options: ["העתק של אובייקט שנשאר מסונכרן", "אובייקט עוטף שמריץ את פונקציות ה-trap שלכם כשהמקור נקרא, נכתב, נמחק וכן הלאה", "סוג מהיר יותר של אובייקט"]
  - q: "מה trap מסוג set חייב להחזיר, ולמה?"
    options: ["את הערך הישן, כדי שאפשר יהיה לשחזר אותו", "כלום, ערך ההחזרה מתעלמים ממנו", "true כשההשמה הצליחה; תוצאה falsy גורמת לקוד במצב strict לזרוק TypeError"]
    explain: "השגיאה נראית כך: TypeError: 'set' on proxy: trap returned falsish for property 'age'."
  - q: "למה להשתמש ב-Reflect.get(target, prop, receiver) בתוך trap?"
    options: ["היא מבצעת את התנהגות ברירת המחדל נכון, כולל getters וירושה", "היא גורמת ל-proxy לרוץ מהר יותר", "היא חובה, proxy לא עובד בלעדיה"]
  - q: "איזה מהשימושים הבאים הוא שימוש טוב ב-Proxy?"
    options: ["החלפה של כל לולאת for בתוכנית", "הוספת אימות או רישום סביב אובייקט בלי לשנות את האובייקט עצמו", "גרימה למספרים להתחשב מהר יותר"]
---

**Proxy** הוא מחליף של אובייקט אחר. כל מה שעושים ל-proxy (קריאת מאפיין, כתיבה של מאפיין, בדיקת `in`, מחיקה) עובר קודם דרך פונקציות שאתם כותבים, שנקראות **traps** (מלכודות). אפשר לאשר את הפעולה, לשנות אותה, לרשום אותה או לסרב לה. Vue 3 בונה את התגובתיות (reactivity) שלה על proxies, וספריות רבות משתמשות בהם לאימות, לרישום ולאובייקטים "קסומים".

## המבנה של Proxy

```js
const proxy = new Proxy(target, handler);
```

- `target` הוא האובייקט האמיתי שנעטף.
- `handler` הוא אובייקט שהשיטות שלו הן ה-traps. trap שלא הגדרתם פשוט מתנהג כרגיל.

שני ה-traps שתשתמשו בהם הכי הרבה:

| Trap | רץ כאשר | ארגומנטים |
| --- | --- | --- |
| `get` | מישהו קורא את `proxy.x` | `(target, prop, receiver)` |
| `set` | מישהו כותב `proxy.x = v` | `(target, prop, value, receiver)` |

יש גם `has` (האופרטור `in`), `deleteProperty`, `ownKeys` (בשימוש של `Object.keys`), `apply` (קריאה ל-proxy של פונקציה) ועוד.

```js
const user = new Proxy({ name: "Ada" }, {
  get(target, prop, receiver) {
    console.log("reading " + String(prop));
    return Reflect.get(target, prop, receiver);
  },
});
console.log(user.name);
// prints: reading name
// prints: Ada
```

## Reflect: פעולת ברירת המחדל

בתוך trap בדרך כלל רוצים לעשות את הדבר הרגיל ולהוסיף משהו סביבו. לאובייקט המובנה **Reflect** יש פונקציה אחת לכל trap שמבצעת בדיוק את פעולת ברירת המחדל: `Reflect.get`, `Reflect.set`, `Reflect.has`, `Reflect.deleteProperty` וכן הלאה. עדיף להשתמש בהן מאשר ב-`target[prop]`, כי הן מטפלות נכון ב-getters, בירושה וב-`receiver` (האובייקט שממנו התחילה הגישה).

## שלושה שימושים קלאסיים

**1. אימות.** עוצרים נתונים רעים בכניסה. ה-trap מסוג `set` בודק את הערך וזורק שגיאה, או שומר אותו:

```js
set(target, prop, value, receiver) {
  if (prop === "age" && typeof value !== "number") throw new TypeError("age must be a number");
  return Reflect.set(target, prop, value, receiver);
}
```

**2. ערכי ברירת מחדל.** trap מסוג `get` שעונה גם על מאפיינים חסרים: `prop in target ? Reflect.get(...) : fallback`. כך `counts[word]++` יכול לעבוד בלי לכתוב קודם `counts[word] = 0`.

**3. רישום ודיבוג.** מתעדים כל קריאה וכתיבה כדי לראות איך חתיכת קוד משתמשת באובייקט. זכרו ששמות של מאפיינים יכולים להיות גם **סמלים** (symbols), למשל כש-JavaScript מדפיסה אובייקט, ולכן התרגיל משתמש ב-`String(prop)` לפני חיבור הטקסט.

טריק רביעי הוא שינוי המשמעות של מפתחות: בתרגיל `list[-1]` נהיה "הפריט האחרון" על ידי הפיכת מפתח שלילי לאינדקס רגיל. אינדקסים של מערך תמיד מגיעים ל-trap מסוג `get` כמחרוזות, ולכן בודקים אותם בעזרת תבנית (pattern).

## מתי לא להשתמש ב-Proxy

ל-Proxy יש כוח, אבל גם מחירים. כל גישה עוברת דרך פונקציה, ולכן הוא איטי יותר מאובייקט פשוט. הוא יכול להפוך את הדיבוג למבלבל, כי האובייקט שרואים אינו האובייקט שעושה את העבודה. ו-proxy הוא אובייקט שונה מה-target שלו: `proxy === target` היא `false`. בחרו בו עבור קוד תשתית (frameworks, שכבות אימות), ולא עבור לוגיקה יומיומית שבה מחלקה עם setter עושה את העבודה.

> **שימו לב:**
> - לשכוח להחזיר `true` (או את התוצאה של `Reflect.set`) מ-trap מסוג `set`. בקוד strict זה נותן `TypeError: 'set' on proxy: trap returned falsish for property 'age'`.
> - לכתוב `proxy[prop]` בתוך trap. זה מפעיל שוב את אותו trap ומסתיים ב-`RangeError: Maximum call stack size exceeded`. השתמשו ב-`target[prop]` או ב-`Reflect.get(target, ...)`.
> - לצפות ששינוי באובייקט המקורי יאומת. רק גישה דרך ה-proxy מיורטת; מי ששומר הפניה ל-target הפשוט עוקף את ה-traps.
> - להחזיר ערך מ-`get` עבור כל מאפיין, כולל `Symbol.toPrimitive` או `toJSON`. ערך ברירת מחדל לכול יכול לבלבל הדפסה ו-JSON. בדקו קודם `prop in target`, כמו בשיעור.
> - להשתמש ב-Proxy על ערך שאינו אובייקט: `TypeError: Cannot create proxy with a non-object as target or handler`.

## להמשיך הלאה

צרו proxy בשם `readOnly(target)` שה-traps `set` ו-`deleteProperty` שלו זורקים שגיאה. אחר כך נסו את `Proxy.revocable(target, handler)`, שנותנת לכם פונקציית `revoke()` שמכבה את ה-proxy.

> **תורכם:** הפכו את ארבע פונקציות העזר ל-proxies (`validated`, `withDefault`, `logged`, `negativeIndex`) כך שחמש השורות ידפיסו כמו שמוצג.
