---
title: "מחלקות וירושה"
summary: "אגדו נתונים והתנהגות במחלקות, הסתירו פרטים עם שדות פרטיים, ושימו קוד בשימוש חוזר עם extends ו-super."
hints:
  - "שדות פרטיים מוצהרים בגוף המחלקה עם # בהתחלה. חברים סטטיים שייכים למחלקה עצמה ומשתמשים בהם כ-Animal.count. תת-מחלקה חייבת לקרוא לבנאי של ההורה לפני שהיא נוגעת ב-this."
  - "ב-Animal: #energy = 10;  static count = 0;  ו-Animal.count++ בתוך הבנאי. עבור eat(): this.#energy += 5; return this;  עבור Dog: class Dog extends Animal { constructor(name, trick) { super(name); ... } }"
  - "class Dog extends Animal { constructor(name, trick) { super(name); this.trick = trick; }  speak() { return super.speak() + \" - woof!\"; }  perform() { return `${this.name} does ${this.trick}`; } }   וב-Animal:  get energy() { return this.#energy; }"
quiz:
  - q: "מה בנאי של תת-מחלקה חייב לעשות לפני שהוא יכול להשתמש ב-this?"
    options: ["לקרוא ל-super(...) כדי להריץ את הבנאי של ההורה", "להצהיר שוב על כל שדה", "להחזיר אובייקט"]
  - q: "מה משמעות ה-# ב-  #energy  ?"
    options: ["השדה הוא הערה", "השדה הוא סטטי", "השדה פרטי ואפשר להשתמש בו רק בתוך גוף המחלקה"]
  - q: "איך קוראים שדה סטטי count של מחלקה Animal?"
    options: ["this.count על מופע", "Animal.count", "count"]
    explain: "חברים סטטיים חיים על המחלקה עצמה, לא על האובייקטים שהיא יוצרת."
  - q: "מה ההבדל בין מחלקה לאובייקט שנוצר ממנה?"
    options: ["אין הבדל", "אובייקט הוא התבנית, מחלקה היא תוצר אחד", "המחלקה היא התבנית, וכל אובייקט שנוצר עם new הוא מופע אחד שלה"]
messages:
  - "הצהירו על תת-המחלקה עם class Dog extends Animal."
  - "קראו ל-super(name) ראשון בבנאי של Dog."
  - "השתמשו שוב במתודה של ההורה עם super.speak()."
  - "שמרו את האנרגיה בשדה פרטי בשם #energy."
  - "הצהירו על שדה סטטי: static count = 0;"
  - "הוסיפו getter: get energy() { ... }"
---

כשתוכנית גדלה, יהיו לכם הרבה אובייקטים שחולקים אותה צורה ואותה התנהגות: עשרות משתמשים, מאות אויבים, אלפי מוצרים. **מחלקה** (class) היא תבנית לאובייקטים כאלה, ו**ירושה** (inheritance) מאפשרת לתבנית אחת להתבסס על אחרת במקום להעתיק קוד. השיעור הזה מכסה את תחביר המחלקות המודרני מראשיתו ועד סופו.

## מחלקה בתמונה אחת

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

const cat = new Animal("Tom");
console.log(cat.speak()); // prints: Tom makes a sound
```

- `class Animal { ... }` מגדירה את התבנית. לפי המוסכמה השם מתחיל באות גדולה.
- `constructor` (בנאי) רץ פעם אחת בכל פעם שכותבים `new Animal(...)`. בתוכו, `this` הוא האובייקט החדש לגמרי, ולכן `this.name = name` שומר עליו נתונים.
- `speak()` היא **מתודה**. היא חיה על המחלקה, משותפת לכל המופעים, ויכולה לקרוא את הנתונים של האובייקט דרך `this`.
- `new` יוצרת את האובייקט. לשכוח אותה זו שגיאה.

## ירושה עם extends ו-super

כשסוג חדש של דבר הוא גרסה ספציפית יותר של דבר קיים, משתמשים ב-`extends`:

```js
class Dog extends Animal {
  constructor(name, trick) {
    super(name);        // run the Animal constructor first
    this.trick = trick;
  }

  speak() {
    return super.speak() + " - woof!";   // reuse, then add
  }
}
```

ל-`Dog` יש אוטומטית כל מה שיש ל-`Animal`, ו-`rex instanceof Animal` הוא `true`. שתי מילות מפתח עושות את העבודה:

- `super(...)` בתוך בנאי קוראת לבנאי של ההורה. בתת-מחלקה אתם **חייבים** לקרוא לה לפני השימוש ב-`this`.
- `super.speak()` קוראת לגרסה של ההורה של מתודה. כתיבת `speak()` משלכם בתת-מחלקה נקראת **דריסה** (overriding).

מאחורי הקלעים JavaScript מקשרת בין האובייקטים דרך **שרשרת אב-טיפוס** (prototype chain): כשקוראים ל-`rex.speak()`, היא מחפשת על `rex`, אחר כך על האב-טיפוס של `Dog`, אחר כך על זה של `Animal`, ונעצרת בהתאמה הראשונה.

## שדות פרטיים

כברירת מחדל, כל מאפיין אפשר לקרוא ולשנות מכל מקום. שם שמתחיל ב-`#` הוא **פרטי**: רק קוד שכתוב בתוך גוף המחלקה יכול לגעת בו.

```js
class Counter {
  #value = 0;
  increment() { this.#value++; return this; }
  get value() { return this.#value; }
}
```

**Getter** (`get value()`) נראה מבחוץ כמו מאפיין רגיל (`counter.value`, בלי סוגריים) אבל מריץ קוד. כך חושפים תצוגה לקריאה בלבד של נתונים פרטיים. החזרת `this` ממתודה מאפשרת **שרשור**: `counter.increment().increment()`.

## חברים סטטיים

שדה או מתודה `static` שייכים למחלקה, לא למופעים שלה. זה שימושי למונים, לקבועים ולפונקציות עזר כמו `Animal.count` או `Math.max`:

```js
class Animal {
  static count = 0;
  constructor() { Animal.count++; }
}
```

## מתי להשתמש בירושה

ירושה מדגמנת יחס של "הוא מסוג": כלב הוא סוג של חיה. אם היחס הוא "יש לו" (למכונית יש מנוע), שמרו את האובייקט השני בשדה במקום, וזה נקרא **הרכבה** (composition). עצי ירושה עמוקים נעשים קשים לשינוי, ולכן שמרו אותם רדודים והעדיפו הרכבה כשאתם לא בטוחים.

> **שימו לב:**
> - שימוש ב-`this` לפני `super(...)`: `ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor`.
> - שכחת `new`: `TypeError: Class constructor Animal cannot be invoked without 'new'`.
> - גישה לשדה פרטי מבחוץ: `SyntaxError: Private field '#energy' must be declared in an enclosing class`.
> - העברת מתודה כ-callback, כמו `setTimeout(rex.speak, 100)`. המתודה מאבדת את ה-`this` שלה ונכשלת עם `Cannot read properties of undefined`. השתמשו ב-`() => rex.speak()` במקום.
> - כתיבת פסיקים בין מתודות בגוף מחלקה. בניגוד לליטרלים של אובייקטים, מחלקות לא משתמשות בהם.

## להמשיך הלאה

הוסיפו תת-מחלקה `Cat` ש-`speak()` שלה אומרת "meow". אחר כך עברו בלולאה על `[rex, cat, generic]` וקראו ל-`speak()` על כל אחד. אותה קריאה נותנת תוצאות שונות בהתאם לאובייקט, וזה נקרא **פולימורפיזם** (polymorphism).

> **תורכם:** השלימו את `Animal` עם `#energy` פרטי (שמתחיל ב-10), `count` סטטי, מתודה `eat()` שמחזירה `this`, ו-getter בשם `energy`. אחר כך כתבו `Dog extends Animal` עם בנאי שקורא ל-`super(name)`, מתודה `speak()` שמשתמשת שוב ב-`super.speak()`, ומתודה `perform()`.
