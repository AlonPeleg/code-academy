---
title: "מחלקות, אובייקטים ובנאים"
summary: "בנו טיפוסים משלכם עם שדות, בנאים, מתודות, מידע פרטי ומונה סטטי."
hints:
  - "לבנאי (constructor) יש אותו שם כמו למחלקה ואין לו טיפוס החזרה. בתוכו, this.owner פירושו השדה ו-owner לבדו פירושו הפרמטר, ולכן this.owner = owner; מעתיקה את הארגומנט לשדה."
  - "בבנאי כתבו גם created++; (שדה סטטי משותף לכל האובייקטים). withdraw היא if: if (amount > balance) { return false; } balance -= amount; return true;"
  - "BankAccount(String owner, int balance) { this.owner = owner; this.balance = balance; created++; }  void deposit(int amount) { balance += amount; }  boolean withdraw(int amount) { if (amount > balance) { return false; } balance -= amount; return true; }  String getOwner() { return owner; }  int getBalance() { return balance; }  static int getCreated() { return created; }"
quiz:
  - q: "מה הקשר בין מחלקה לאובייקט?"
    options: ["מחלקה היא תבנית, אובייקט הוא דבר אחד שנבנה ממנה", "אובייקט הוא תבנית, מחלקה היא העתק שלו", "הם אותו דבר", "מחלקה היא מתודה"]
  - q: "למה מתייחסת המילה this בתוך מתודה או בנאי?"
    options: ["למחלקה עצמה", "לאובייקט הנוכחי", "למתודה main", "לאובייקט הקודם"]
  - q: "למה בדרך כלל מסמנים שדות כ-private?"
    options: ["זה גורם להם לרוץ מהר יותר", "כדי שקוד חיצוני לא יוכל להכניס את האובייקט למצב לא תקין", "כי Java מחייבת את זה", "כדי שכל אחד יוכל לשנות אותם"]
    explain: "הרעיון הזה נקרא כימוס (encapsulation): קוד אחר חייב לעבור דרך מתודות שיכולות לבדוק את הכללים."
  - q: "מה מיוחד בשדה סטטי כמו created?"
    options: ["לכל אובייקט יש עותק משלו", "יש בדיוק עותק אחד שמשותף לכל המחלקה", "אי אפשר לקרוא אותו לעולם", "הוא חייב להיות String"]
messages:
  - "כתבו בנאי: BankAccount(String owner, int balance) { ... }."
  - "השתמשו ב-this.field = parameter; כדי לשמור את ארגומנטי הבנאי."
  - "כתבו static int getCreated()."
---

עד עכשיו השתמשתם בטיפוסים ש-Java נותנת לכם: `int`, `String`, `ArrayList`. **מחלקה** (class) מאפשרת להמציא טיפוס משלכם שמאגד נתונים יחד עם הפעולות שעובדות עליהם. זה הלב של **תכנות מונחה עצמים** (object-oriented programming), ובשביל זה Java תוכננה.

## מחלקה ואובייקט

מחלקה היא **תבנית**. **אובייקט** (או **מופע**, instance) הוא דבר אמיתי אחד שנבנה מהתבנית הזו. מחלקה אחת `Dog` יכולה ליצור הרבה אובייקטים של כלבים, לכל אחד שם וגיל משלו.

```java
class Dog {
    String name;       // fields: the data each dog has
    int age;

    void bark() {      // a method: something a dog can do
        System.out.println(name + " says Woof!");
    }
}
```

יוצרים אובייקט עם `new`, ומשתמשים בחברים שלו עם נקודה:

```java
Dog d = new Dog();
d.name = "Rex";
d.age = 3;
d.bark();      // prints: Rex says Woof!
```

לכל אובייקט יש שדות משלו. שינוי של `d.age` לא משנה את הגיל של כלב אחר. ב-Java קובץ אחד יכול להכיל כמה מחלקות, אבל רק אחת מהן יכולה להיות `public`, והיא חייבת להתאים לשם הקובץ. לכן ל-`BankAccount` כאן אין `public` ול-`Main` יש.

## בנאים

**בנאי** (constructor) רץ כשכותבים `new`. יש לו **אותו שם כמו המחלקה** ו**אין לו טיפוס החזרה**, והתפקיד שלו הוא להכין את האובייקט כך שלעולם לא יישאר בנוי למחצה:

```java
class Dog {
    String name;
    int age;

    Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

Dog d = new Dog("Rex", 3);
```

בתוך הבנאי הפרמטר `name` מסתיר את השדה `name`. המילה **`this`** פירושה "האובייקט שנבנה כרגע", ולכן `this.name` הוא השדה ו-`name` הוא הפרמטר. בלי `this`, השורה `name = name;` פשוט משימה את הפרמטר לעצמו והשדה נשאר ריק.

אם לא כותבים בנאי, Java מספקת בחינם בנאי ריק. ברגע שכותבים בנאי עם פרמטרים, הבנאי החינמי נעלם.

## כימוס: שדות פרטיים ו-getters

הגדירו שדות כ-`private` כדי שרק הקוד של המחלקה עצמה יוכל לגעת בהם. אחר כך הציעו מתודות ציבוריות שמאכפות את הכללים:

```java
private int balance;

boolean withdraw(int amount) {
    if (amount > balance) return false;   // refuse, keep the object valid
    balance -= amount;
    return true;
}

int getBalance() { return balance; }      // a "getter"
```

קוד חיצוני לא יכול לכתוב `account.balance = -1000;` כי השדה מוסתר. הוא חייב לבקש דרך `withdraw`, שבודקת קודם. הסתרת פרטים כזו נקראת **כימוס** (encapsulation), והיא מונעת סוג שלם של באגים.

## חברים סטטיים

שדה רגיל קיים פעם אחת **לכל אובייקט**. שדה `static` קיים פעם אחת **לכל מחלקה**, והוא משותף לכל האובייקטים. הוא מתאים מאוד למונה:

```java
private static int created = 0;
Dog(...) { created++; }
static int getCreated() { return created; }
```

קוראים למתודה סטטית על המחלקה ולא על אובייקט: `BankAccount.getCreated()`. בדיוק בגלל זה כותבים `Math.max(...)` ו-`Integer.parseInt(...)` עם שם מחלקה לפניהם.

## toString

הדפסת אובייקט מציגה משהו כמו `Dog@1b6d3586`. הגדירו מתודה `public String toString()` ו-Java תשתמש בה בכל פעם שהאובייקט הופך לטקסט:

```java
public String toString() { return name + " (" + age + ")"; }
```

> **שימו לב:**
> - שימוש בבנאי שלא קיים, כמו `new Dog("Rex")`, גורם ל-`error: constructor Dog in class Dog cannot be applied to given types`.
> - קריאה למתודה על אובייקט שלא נוצר מעולם גורמת ל-`Exception in thread "main" java.lang.NullPointerException`. הקוד `Dog d;` ואחריו `d.bark();` נכשל: קודם צריך לכתוב `d = new Dog(...)`.
> - ניסיון לגשת לשדה `private` ממחלקה אחרת גורם ל-`error: balance has private access in BankAccount`.
> - מתן טיפוס החזרה לבנאי (`void Dog(...)`) הופך אותו למתודה רגילה, והבנאי האמיתי חסר.
> - שימוש ב-`==` על שני אובייקטים בודק אם הם אותו אובייקט, לא אם הם מכילים אותם נתונים.

## להמשיך הלאה

הוסיפו `toString()` ל-`BankAccount` והדפיסו את `a` ישירות. הוסיפו בדיקה כך ש-`deposit` תתעלם מסכומים שליליים. צרו בנאי שמקבל רק את הבעלים ומתחיל עם יתרה 0 על ידי קריאה ל-`this(owner, 0);`.

> **תורכם:** השלימו את `BankAccount`: בנאי `(String owner, int balance)` שמשתמש ב-`this` וגם מגדיל את המונה הסטטי `created`, המתודה `deposit`, המתודה `withdraw` שמחזירה `false` כשאין מספיק כסף, ה-getters `getOwner` ו-`getBalance`, והמתודה `static int getCreated()`.
