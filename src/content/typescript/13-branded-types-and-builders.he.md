---
title: "טיפוסים ממותגים ותבנית ה-Builder"
summary: "הפסיקו לבלבל בין ערכים דומים עם טיפוסים ממותגים, ובנו אובייקטים צעד אחר צעד עם builder שוטף."
hints:
  - "מותג (brand) הוא מאפיין מדומה שקיים רק בטיפוס: T & { readonly __brand: B }. אף פעם לא מוסיפים אותו באמת, רק מבטיחים למהדר בעזרת 'as'. ב-builder כל setter מסתיים ב-return this; כדי שאפשר יהיה לשרשר קריאות, ו-build() יוצר את האובייקט הסופי."
  - "type UserId = Brand<number, \"UserId\">;   function userId(n: number): UserId { return n as UserId; }   function getUser(id: UserId): string {...}   method(m: string): this { this.httpMethod = m; return this; }"
  - "function parseEmail(input: string): Email | null { return /^[^@\\s]+@[^@\\s]+\\.[a-z]+$/i.test(input) ? (input as Email) : null; }   build(): HttpRequest { const url = this.params.length ? this.baseUrl + \"?\" + this.params.join(\"&\") : this.baseUrl; return { method: this.httpMethod, url, headers: this.headerList }; }"
quiz:
  - q: "איזו בעיה טיפוסים ממותגים פותרים?"
    options: ["הם מאיצים מספרים", "הם מונעים בלבול בין ערכים עם אותו טיפוס בסיס (כמו שני סוגי מזהים, שניהם מספרים)", "הם מסתירים מאפיינים ממחלקות אחרות"]
  - q: "איפה קיים המאפיין __brand של טיפוס ממותג?"
    options: ["בכל אובייקט בזמן ריצה", "במסד נתונים נסתר", "רק במערכת הטיפוסים, ולכן אין עלות בזמן ריצה"]
    explain: "המותג הוא הבטחה למהדר. בזמן ריצה UserId הוא עדיין סתם מספר."
  - q: "למה כל מתודה ב-builder מסתיימת ב-  return this  ?"
    options: ["כדי שאפשר יהיה לשרשר את הקריאות זו אחר זו", "כדי לעצור את התוכנית", "כי מתודות חייבות תמיד להחזיר משהו"]
  - q: "למה להשתמש בפונקציה כמו parseEmail שמחזירה Email | null במקום להמיר עם as Email בכל מקום?"
    options: ["אסור להמיר ב-TypeScript", "הבדיקה מתבצעת במקום אחד, ולכן כל ערך Email בתוכנית עבר אימות", "זה רץ מהר יותר"]
messages:
  - "כתבו  type Brand<T, B extends string> = T & { readonly __brand: B };"
  - "הצהירו על  type UserId = Brand<number, \"UserId\">;"
  - "הצהירו על  type Email = Brand<string, \"Email\">;"
  - "getUser צריכה לקבל UserId."
  - "הצהירו על  function parseEmail(input: string): Email | null"
  - "method, query ו-header צריכות להחזיר כל אחת this כדי שאפשר יהיה לשרשר קריאות."
  - "הצהירו על  build(): HttpRequest"
---

שני רעיונות לכתיבת TypeScript בטוחה וקריאה יותר, ושניהם בנויים כולם מיכולות שאתם כבר מכירים. **טיפוסים ממותגים** (branded types) גורמים למהדר להבדיל בין ערכים שנראים אותו דבר, כמו המזהה של משתמש והמזהה של הזמנה. **תבנית ה-builder** מאפשרת ליצור אובייקט מסובך צעד אחר צעד, עם קריאות שנקראות כמו משפט. אף אחד מהם לא צריך מודולים או ספריות נוספות.

## הבעיה: הכול מספר

דמיינו את הפונקציה הזו:

```ts
function transfer(fromId: number, toId: number, cents: number) { /* ... */ }
transfer(500, 7, 42); // which is which?
```

שלושת הארגומנטים הם `number`, ולכן החלפה בין שניים מהם מתקמפלת בשמחה ומעבירה כסף מהחשבון הלא נכון. TypeScript היא **מבנית** (structural): שני טיפוסים זהים אם יש להם אותו מבנה, ומספר הוא מספר.

## טיפוסים ממותגים

**מותג** (brand) מוסיף מאפיין בדוי שהופך טיפוס לבלתי תואם לאחרים, אף שהוא זהה מתחת לפני השטח:

```ts
type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = Brand<number, "UserId">;
type OrderId = Brand<number, "OrderId">;
```

קראו את `T & {...}` (**חיתוך**, intersection) כ-"`T` שיש לו גם את המאפיין הזה". `UserId` הוא מספר שנושא את התווית `"UserId"`, ול-`OrderId` יש תווית אחרת, ולכן אחד לא ניתן להשמה לשני:

```ts
function getUser(id: UserId): string { return "user #" + id; }

const o = 5 as OrderId;
getUser(o);
// error: Argument of type 'OrderId' is not assignable to parameter of type 'UserId'.
```

המאפיין `__brand` אף פעם לא קיים בזמן ריצה. זו רק הבטחה למהדר, ולכן **אין עלות**: `UserId` הוא עדיין סתם מספר. כדי ליצור אחד צריך המרת `as` אחת, שאותה מסתירים בתוך פונקציה קטנה:

```ts
function userId(n: number): UserId {
  return n as UserId;
}
```

### מותגי אימות

השימוש הטוב ביותר במותגים הוא להוכיח שמשהו נבדק. פונקציה שמאמתת ואז מחזירה את הטיפוס הממותג היא הדרך היחידה להשיג אותו:

```ts
type Email = Brand<string, "Email">;

function parseEmail(input: string): Email | null {
  return /^[^@\s]+@[^@\s]+\.[a-z]+$/i.test(input) ? (input as Email) : null;
}
```

כל פונקציה שמקבלת `Email` יכולה עכשיו לסמוך על כך שהוא תקין, בלי לבדוק שוב. הבדיקה נמצאת בדיוק במקום אחד.

## תבנית ה-builder

לחלק מהאובייקטים יש הרבה חלקים אופציונליים: בקשת HTTP כוללת שיטה, כתובת, פרמטרים של שאילתה וכותרות. בנאי עם שמונה ארגומנטים קשה לקריאה. **builder** אוסף את החלקים דרך מתודות קטנות ויוצר את האובייקט הסופי בסוף:

```ts
class RequestBuilder {
  private httpMethod = "GET";
  private params: string[] = [];

  constructor(private baseUrl: string) {}

  method(m: string): this {
    this.httpMethod = m;
    return this;
  }

  query(key: string, value: string): this {
    this.params.push(key + "=" + value);
    return this;
  }

  build(): HttpRequest { /* assemble and return */ }
}
```

כל setter מחזיר `this`, שהוא האובייקט עצמו, ולכן הקריאות משתרשרות ל**ממשק שוטף** (fluent interface):

```ts
const req = new RequestBuilder("https://api.test/users")
  .method("GET")
  .query("limit", "5")
  .build();
```

טיפוס ההחזרה `this` (ולא `RequestBuilder`) ימשיך לעבוד גם אם תכתבו אחר כך תת-מחלקה של ה-builder. `constructor(private baseUrl: string)` הוא קיצור מאפיין הפרמטר משיעור המחלקות. מכיוון שהשדות הם `private`, אף אחד לא יכול ליצור בקשה חצי-גמורה על ידי נגיעה ישירה בהם. רק `build()` מפיק את הערך המוגמר.

## מה להשתמש ומתי

- השתמשו במותגים למזהים, ליחידות (מטרים מול רגליים) ולמחרוזות מאומתות.
- השתמשו ב-builder כשלאובייקט יש הרבה הגדרות אופציונליות או הקמה בכמה שלבים. עבור שתיים או שלוש אפשרויות, פרמטר של אובייקט רגיל פשוט יותר.

> **שימו לב:**
> - המרות בכל מקום. אם כותבים `x as UserId` בכל הקוד, המותג לא מגן על כלום. שמרו את ההמרה בתוך פונקציית יצירה אחת.
> - שכחה שמותגים נעלמים בזמן ריצה. `JSON.parse` מחזיר מספרים רגילים, ולכן העבירו אותם דרך `userId(...)` לפני השימוש.
> - כתיבת מתודה שמחזירה `void` ב-builder: `Property 'query' does not exist on type 'void'` כשמנסים לשרשר.
> - החזרת builder חדש מכל קריאה בטעות ואובדן המצב, או החזרת `this.params` במקום `this`.
> - ציפייה ש-`typeof id` יגיד `"UserId"`. בזמן ריצה זה `"number"`.
> - החזרה של המערך הפנימי של ה-builder (`this.headerList`) מתוך `build()`. קריאות מאוחרות יותר עלולות לשנות בקשה שכבר יצרתם. העתיקו אותו עם `[...this.headerList]` כשזה חשוב.

## להמשך הדרך

הוסיפו מותג `Meters` ו-`Feet` וכתבו `function toFeet(m: Meters): Feet`. נסו לגרום ל-`build()` לזרוק שגיאה אם כתובת הבסיס ריקה.

> **תורכם:** הצהירו על `Brand`, `UserId`, `OrderId` ו-`Email`, כתבו את פונקציות היצירה ואת `parseEmail`, גרמו ל-`getUser` ול-`getOrder` לקבל רק את סוג המזהה שלהן, והשלימו את `RequestBuilder` עם המתודות `method`, `query` ו-`header` שניתנות לשרשור ועם המתודה `build()`.
