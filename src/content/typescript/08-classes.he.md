---
title: "מחלקות ומגבילי גישה"
summary: "בנו אובייקטים עם מאפיינים מוטפסים, והסתירו פרטים עם private ו-readonly."
hints:
  - "מגבילי גישה (access modifiers) הם מילות מפתח שנכתבות לפני מאפיין: אחת אוסרת שינוי אחרי הבנייה, והשנייה אוסרת שימוש מחוץ למחלקה. מתודה מתחילה בשמה, כמו deposit."
  - "כתבו readonly לפני owner ו-private לפני balance. withdraw בודקת אם this.balance קטן מ-amount, ואם כן מחזירה false מיד."
  - "withdraw(amount: number): boolean { if (amount > this.balance) { return false; } this.balance -= amount; return true; }"
quiz:
  - q: "מה עושה המילה private למאפיין?"
    options: ["היא מוחקת את המאפיין", "היא הופכת את המאפיין לקריאה בלבד", "היא מאפשרת רק לקוד שבתוך המחלקה להשתמש בו"]
  - q: "מה משמעות readonly?"
    options: ["אפשר לקבוע את הערך פעם אחת אבל לא לשנות אותו אחר כך", "הערך מוסתר", "הערך חייב להיות מחרוזת"]
  - q: "מה עושה  constructor(public name: string) {}  ?"
    options: ["מצהירה על מתודה בשם name", "יוצרת מאפיין ציבורי name ומשמה בו את הארגומנט", "כלום, אסור להשתמש ב-public שם"]
    explain: "הקיצור הזה נקרא parameter property (מאפיין פרמטר). הוא חוסך מכם להצהיר על המאפיין ולהשים בו ערך ידנית."
  - q: "איך יוצרים אובייקט ממחלקה?"
    options: ["Account.create()", "make Account()", "new Account(...)"]
messages:
  - "סמנו את owner כ-readonly:  readonly owner: string;"
  - "הסתירו את balance:  private balance: number = 0;"
  - "הצהירו על המתודה:  withdraw(amount: number): boolean { ... }"
---

**מחלקה** (class) היא תבנית לאובייקטים שיש להם גם נתונים (מאפיינים, properties) וגם התנהגות (מתודות, methods). TypeScript מוסיפה טיפוסים למחלקות, וגם מילות מפתח שקובעות מי רשאי לגעת במה.

## מחלקה מוטפסת

```ts
class Dog {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  bark(): string {
    return `${this.name} says woof`;
  }
}

const rex = new Dog("Rex");
console.log(rex.bark()); // prints: Rex says woof
```

- `name: string;` מצהיר על מאפיין ועל הטיפוס שלו.
- `constructor` (בנאי) רץ פעם אחת כשכותבים `new Dog("Rex")`. לפרמטרים שלו יש טיפוסים כמו בכל פונקציה.
- בתוך המחלקה, `this` פירושו "האובייקט שעובדים עליו".
- `bark(): string` היא מתודה. זו פונקציה שחיה בתוך המחלקה.

## מגבילי גישה

לא הכול צריך להיות נגיש מבחוץ. TypeScript נותנת שלוש מילות מפתח:

| מילת מפתח | מי יכול להשתמש במאפיין |
| --- | --- |
| `public` | כולם (זו ברירת המחדל) |
| `private` | רק קוד בתוך המחלקה |
| `protected` | המחלקה ומחלקות שיורשות ממנה |

```ts
class Counter {
  private count = 0;

  increment(): void {
    this.count++;
  }

  get value(): number {
    return this.count;
  }
}

const c = new Counter();
c.increment();
console.log(c.value); // prints: 1
c.count = 100;        // error: Property 'count' is private and only accessible within class 'Counter'.
```

כשנתונים הם פרטיים, קוד אחר יכול לשנות אותם רק דרך המתודות שלכם, ולכן אפשר לשמור כללים במקום אחד, למשל "אי אפשר למשוך יותר מהיתרה".

## readonly

`readonly` מאפשר לקבוע מאפיין בבנאי, אבל לעולם לא לשנות אותו אחר כך:

```ts
class User {
  readonly id: number;
  constructor(id: number) { this.id = id; }
}

const u = new User(7);
u.id = 8; // error: Cannot assign to 'id' because it is a read-only property.
```

## מאפייני פרמטר (קיצור דרך)

כתיבת מגביל לפני פרמטר של בנאי מצהירה על המאפיין ומשימה בו ערך בבת אחת:

```ts
class Point {
  constructor(public x: number, public y: number) {}
}

const p = new Point(3, 4);
console.log(p.x + p.y); // prints: 7
```

> **שימו לב:**
> - שכחת `new`: `Class constructor Dog cannot be invoked without 'new'`.
> - שכחת `this.` בתוך מתודה. `name` לבדו הוא משתנה אחר (בדרך כלל לא מוגדר). תראו `Cannot find name 'name'`.
> - את `private` בודקת רק TypeScript. בזמן ריצה המאפיין עדיין רגיל. לפרטיות אמיתית בזמן ריצה יש ב-JavaScript את `#name`.

> **תורכם:** הפכו את `owner` ל-`readonly` ואת `balance` ל-`private`, והוסיפו מתודה `withdraw(amount: number): boolean` שמסרבת למשוך יותר ממה שיש.
