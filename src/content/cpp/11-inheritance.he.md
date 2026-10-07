---
title: "ירושה"
summary: "בונים מחלקות חדשות ממחלקות קיימות ודורסים התנהגות."
hints:
  - "ירושה (inheritance) נכתבת עם נקודתיים אחרי שם המחלקה: class Dog : public Animal. כדי ש-talk() תקרא לגרסה של Dog, מתודת הבסיס חייבת להיות virtual."
  - "הוסיפו את המילה virtual לפני string speak() const ב-Animal. ב-Dog, הבנאי מעביר את השם למעלה: Dog(string n) : Animal(n) {}  וה-speak החדשה היא באותה חתימה כמו של הבסיס, ואופציונלית אחריה override."
  - "virtual string speak() const { return \"...\"; }   class Dog : public Animal { public: Dog(string n) : Animal(n) {} string speak() const override { return \"Woof\"; } };   class Cat : public Animal { public: Cat(string n) : Animal(n) {} string speak() const override { return \"Meow\"; } };"
messages:
  - "סמנו את Animal::speak כ-virtual."
  - "כתבו class Dog : public Animal."
  - "כתבו class Cat : public Animal."
quiz:
  - q: "מה המשמעות של  class Dog : public Animal  ?"
    options: ["Dog מכיל Animal כמשתנה חבר", "Dog בנויה על Animal ומקבלת את החברים והמתודות שלה", "Animal בנויה על Dog"]
  - q: "בשביל מה המילה virtual?"
    options: ["היא גורמת למתודה לרוץ מהר יותר", "היא מסתירה מתודה ממחלקות אחרות", "היא מאפשרת לקרוא לגרסה של המחלקה הנגזרת דרך הפניה או מצביע למחלקת בסיס"]
  - q: "באילו חברים מחלקה נגזרת יכולה להשתמש ישירות מהבסיס שלה?"
    options: ["רק ציבוריים", "ציבוריים ומוגנים (protected), אבל לא פרטיים", "בכולם, כולל הפרטיים"]
  - q: "מה הבנאי  Dog(string n) : Animal(n) {}  עושה?"
    options: ["קורא לבנאי של Animal עם n לפני שגוף הבנאי של Dog עצמו רץ", "יוצר שני כלבים", "מוחק את ה-Animal"]
---

דמיינו שאתם כותבים משחק עם כלבים, חתולים וציפורים. לכולם יש שם והם יכולים להשמיע קול, אבל כל קול שונה. העתקה והדבקה של החלקים המשותפים לשלוש מחלקות תהיה בלגן. **ירושה** (inheritance) מאפשרת למחלקה חדשה (המחלקה ה**נגזרת**, derived, או ה**בן**, child) להשתמש מחדש בכל מה שיש במחלקה קיימת (מחלקת ה**בסיס**, base, או ה**הורה**, parent) ולהוסיף או לשנות רק את מה שונה.

## גזירת מחלקה

```cpp
class Animal {
public:
    string name;
    void eat() { cout << name << " eats" << endl; }
};

class Dog : public Animal {      // a Dog IS an Animal
public:
    void bark() { cout << name << " barks" << endl; }
};

Dog d;
d.name = "Rex";
d.eat();      // inherited from Animal: prints: Rex eats
d.bark();     // Dog's own method: prints: Rex barks
```

`: public Animal` פירושו "Dog יורשת מ-Animal". קראו זאת כיחס של **הוא-סוג-של** (is-a): כלב הוא חיה. לכלב יש כל מה שיש לחיה, ובנוסף תוספות משלו.

## protected

חוץ מ-`public` ו-`private` יש רמה שלישית, `protected`: חברים שגורמים חיצוניים לא יכולים לגעת בהם אבל **מחלקות נגזרות** כן. מחלקה נגזרת לעולם לא יכולה להשתמש ישירות בחברים ה-`private` של מחלקת הבסיס.

## בנאים של מחלקות נגזרות

כש-`Dog` נוצר, חלק ה-`Animal` חייב להיבנות קודם. אם ל-`Animal` יש בנאי עם פרמטרים, צריך להעביר אותם מהבנאי של `Dog`, בעזרת רשימת האתחול:

```cpp
class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}    // pass n up to the Animal constructor
};
```

## דריסה עם virtual

מחלקה נגזרת יכולה לספק גרסה משלה של מתודה. כדי שזה יעבוד כשמחזיקים רק **הפניה או מצביע לבסיס**, מתודת הבסיס חייבת להיות `virtual`:

```cpp
class Animal {
public:
    virtual string speak() const { return "..."; }
};
class Dog : public Animal {
public:
    string speak() const override { return "Woof"; }
};

void talk(const Animal& a) {
    cout << a.speak() << endl;   // picks the right version at run time
}
Dog d;
talk(d);     // prints: Woof
```

זה נקרא **פולימורפיזם** (polymorphism, "צורות רבות"): אותה קריאה `a.speak()` עושה דבר שונה בהתאם לאובייקט האמיתי. `override` היא אופציונלית אבל מבקשת מהקומפיילר לבדוק שאכן אתם מחליפים מתודת בסיס. בלי `virtual`, `talk(d)` הייתה מדפיסה `...`.

כשלמחלקה יש מתודות virtual, תנו לה גם destructor וירטואלי (`virtual ~Animal() {}`). זה חשוב ברגע שמוחקים אובייקטים דרך מצביעי בסיס.

> **שימו לב:**
> - שכחתם `virtual` במחלקת הבסיס: הקוד מתקמפל, אבל `talk` תמיד קוראת לגרסת הבסיס ומקבלים `...` במקום `Woof`.
> - שימוש בחברי `private` במחלקה נגזרת: `error: 'std::string Animal::name' is private within this context`. הפכו אותם ל-`protected` או השתמשו ב-getters.
> - לא העברתם ארגומנטים לבנאי הבסיס: `error: no matching function for call to 'Animal::Animal()'`.
> - חתימה שאינה תואמת בדריסה (למשל שכחתם `const`) יוצרת מתודה חדשה שאינה קשורה. עם `override` הקומפיילר אומר לכם: `error: 'speak' marked 'override', but does not override`.
> - העברת אובייקט נגזר **לפי ערך** לפונקציה שמקבלת `Animal` (ולא `Animal&`) חותכת את החלק הנגזר (slicing). העבירו בהפניה או במצביע.

## להמשיך הלאה

הוסיפו מחלקה `Bird` שמשמיעה `Tweet`, ושמרו כמה חיות ב-`vector<Animal*>` כדי לקרוא ל-`speak()` על כל אחת בלולאה.

> **תורכם:** הפכו את `Animal::speak` ל-virtual, כתבו את `Dog` ו-`Cat` כמחלקות הנגזרות מ-`Animal` (והעבירו את השם לבנאי הבסיס), ותנו להן את הקולות `Woof` ו-`Meow`. התוכנית צריכה להדפיס `Rex says Woof`, `Tom says Meow` ו-`Generic says ...`.
