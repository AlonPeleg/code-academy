---
title: "בנאים וחברים פרטיים"
summary: "מאתחלים אובייקטים נכון ומגנים על הנתונים שלהם."
hints:
  - "בנאי (constructor) נראה כמו מתודה עם שם המחלקה וללא טיפוס החזרה: BankAccount(string name, int start) { ... }. השתמשו בו כדי למלא את owner ואת balance."
  - "deposit מוסיפה ל-balance. withdraw צריכה if: if (amount > balance) return false; אחרת מחסרים ומחזירים true. getBalance ו-getOwner פשוט מחזירות את החברים הפרטיים."
  - "BankAccount(string name, int start) { owner = name; balance = start; }   void deposit(int amount) { balance += amount; }   bool withdraw(int amount) { if (amount > balance) { return false; } balance -= amount; return true; }   int getBalance() const { return balance; }   string getOwner() const { return owner; }"
messages:
  - "כתבו בנאי BankAccount(string name, int startBalance)."
  - "השאירו את החברים פרטיים."
quiz:
  - q: "מהו בנאי (constructor)?"
    options: ["פונקציה שרצה אוטומטית כשאובייקט נוצר", "פונקציה שמוחקת אובייקט", "לולאה מיוחדת"]
  - q: "איך מזהים בנאי?"
    options: ["הוא מחזיר void", "הוא מסומן במילה constructor", "יש לו אותו שם כמו למחלקה ואין לו טיפוס החזרה"]
  - q: "למה להפוך חברי נתונים לפרטיים?"
    options: ["כדי שקוד חיצוני יוכל לשנות אותם רק דרך מתודות ששומרות עליהם תקינים", "כדי שהתוכנית תהיה מהירה יותר", "כי חברים ציבוריים אינם מותרים"]
  - q: "מה  int getBalance() const  מבטיחה?"
    options: ["היתרה אף פעם לא משתנה", "המתודה לא משנה את האובייקט", "אפשר לקרוא למתודה רק פעם אחת"]
---

בשיעור הקודם יצרתם `Rectangle` ואז מילאתם את החברים שלו אחד אחד. אם שכחתם שורה, החברים החזיקו זבל אקראי. **בנאי** (constructor) פותר את זה: זו פונקציה מיוחדת שרצה אוטומטית כשאובייקט נוצר, כך שהאובייקט תמיד מתחיל במצב תקין. יחד עם חברים `private` הוא לב העיצוב הבטוח של מחלקות.

## בנאים

לבנאי יש **אותו שם כמו למחלקה** ו**אין לו טיפוס החזרה**, אפילו לא `void`:

```cpp
class Rectangle {
public:
    int width;
    int height;

    Rectangle(int w, int h) {   // the constructor
        width = w;
        height = h;
    }

    int area() { return width * height; }
};

Rectangle r(3, 4);              // runs the constructor with 3 and 4
cout << r.area() << endl;       // prints: 12
```

הארגומנטים ב-`Rectangle r(3, 4)` מועברים לבנאי. אפשר ליצור כמה בנאים עם פרמטרים שונים, וגם **בנאי ברירת מחדל** (default constructor) ללא פרמטרים: `Rectangle() { width = 1; height = 1; }`.

## רשימת האתחול של החברים

ל-C++ יש דרך מסודרת יותר לקבוע חברים, בין הסוגריים לגוף:

```cpp
Rectangle(int w, int h) : width(w), height(h) {}
```

קראו זאת כ"אתחלו את `width` עם `w` ואת `height` עם `h`". זה הסגנון המועדף, והוא הכרחי לחברי `const` ולהפניות. שתי הצורות עובדות בשיעור הזה.

## private ו-public

כברירת מחדל (ב-`class`) חברים הם **פרטיים**: רק המתודות של המחלקה עצמה רשאיות לגעת בהם. סמנו כ-`public` את החלקים שאחרים רשאים להשתמש בהם:

```cpp
class BankAccount {
private:
    int balance;        // hidden from the outside
public:
    void deposit(int amount) { balance += amount; }
    int getBalance() const { return balance; }
};
```

עכשיו `acc.balance = 1000000;` מתוך `main` היא שגיאת קומפילציה. הדרך היחידה לשנות את היתרה היא דרך `deposit` ו-`withdraw`, שיכולות לסרב לבקשות לא תקינות (כמו הוצאה של יותר ממה שיש). הסתרת הפרטים וחשיפה של קבוצה קטנה ובטוחה של מתודות נקראת **כימוס** (encapsulation).

מתודות שפשוט מחזירות חבר פרטי נקראות **getters**; מתודות שקובעות אחד כזה נקראות **setters**. סמנו getters כ-`const` כי הן לא משנות את האובייקט.

## struct לעומת class

`struct` זהה ל-`class`, חוץ מכך שהחברים שלו ציבוריים כברירת מחדל. מתכנתים משתמשים ב-`struct` לצרורות פשוטים של נתונים וב-`class` כשיש כללים להגן עליהם.

> **שימו לב:**
> - מתן טיפוס החזרה לבנאי (`void BankAccount(...)`) הופך אותו למתודה רגילה: `error: return type specification for constructor invalid`.
> - יצירת אובייקט בלי ארגומנטים מתאימים: `error: no matching function for call to 'BankAccount::BankAccount()'`. ברגע שכותבים בנאי עם פרמטרים, C++ מפסיקה לספק את הבנאי ללא ארגומנטים.
> - גישה לחבר פרטי מתוך `main`: `error: 'int BankAccount::balance' is private within this context`.
> - מתן שם לפרמטר זהה לחבר (`balance = balance;`) משים את הפרמטר לעצמו. השתמשו בשמות שונים, ברשימת אתחול, או ב-`this->balance = balance;`.
> - שכחתם את ה-`;` הסופי אחרי הסוגריים המסולסלים של המחלקה.

## להמשיך הלאה

הוסיפו בנאי ברירת מחדל שיוצר חשבון עבור `"nobody"` עם 0, ומתודה `transfer` שמעבירה כסף ל-`BankAccount&` אחר.

> **תורכם:** כתבו את הבנאי `BankAccount(string, int)`, ואז השלימו את `deposit`, את `withdraw` (סרבו והחזירו `false` כשהסכום גדול מהיתרה) ואת שני ה-getters. התוכנית צריכה להדפיס `Ava has 150`, `Withdraw 500: failed`, `Withdraw 70: ok` ו-`Ava has 80`.
