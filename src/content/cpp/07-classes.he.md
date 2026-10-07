---
title: "מחלקות"
summary: "מאגדים נתונים והתנהגות במקום אחד."
hints:
  - "מתודה (method) היא פונקציה שנכתבת בתוך הסוגריים המסולסלים של המחלקה. היא יכולה להשתמש בחברים (width ו-height) ישירות לפי שמם."
  - "בתוך class Rectangle, אחרי שני החברים, הוסיפו שתי מתודות: int area() { ... } ו-int perimeter() { ... }. כל אחת צריכה משפט return."
  - "int area() { return width * height; }   int perimeter() { return 2 * (width + height); }"
messages:
  - "הגדירו את המתודה int area() בתוך המחלקה."
  - "הגדירו את המתודה int perimeter() בתוך המחלקה."
quiz:
  - q: "מהי מחלקה (class)?"
    options: ["סוג של לולאה", "קובץ header", "תבנית לאובייקטים עם נתונים ומתודות"]
  - q: "איך קוראים למתודה area על אובייקט r?"
    options: ["r.area()", "area(r)", "r->area בלבד"]
  - q: "מה המשמעות של public: ?"
    options: ["החברים נמחקים", "אפשר להשתמש בחברים מחוץ למחלקה", "המחלקה משותפת באינטרנט"]
  - q: "מה ההבדל בין מחלקה לאובייקט?"
    options: ["הם אותו דבר", "מחלקה היא תבנית, אובייקט הוא דבר אחד שנבנה ממנה", "אובייקט הוא סוג של חבר במחלקה"]
---

עד עכשיו הנתונים שלכם (שם, רוחב, ניקוד) חיו במשתנים נפרדים והפונקציות חיו במקום אחר. **מחלקה** (class) מאפשרת לאגד את הנתונים יחד עם הפונקציות שעובדות עליהם. זה הרעיון המרכזי של **תכנות מונחה עצמים** (object-oriented programming), וזה מה שהופך תוכניות C++ גדולות לניתנות לניהול.

## מחלקה, חברים, מתודות, אובייקטים

```cpp
class Dog {
public:
    string name;          // a member: data that belongs to the dog

    void bark() {         // a method: a function that belongs to the dog
        cout << name << " says woof!" << endl;
    }
};

int main() {
    Dog d;                // d is an object (one dog built from the blueprint)
    d.name = "Rex";
    d.bark();             // prints: Rex says woof!

    Dog e;                // a second, independent dog
    e.name = "Mia";
    e.bark();             // prints: Mia says woof!
}
```

אחד אחד:

- `class Dog { ... };` מגדירה טיפוס חדש. **הנקודה-פסיק אחרי הסוגר המסולסל הסוגר היא חובה.**
- המשתנים שבפנים (`name`) הם **חברים** (members), והפונקציות שבפנים (`bark`) הן **מתודות** (methods).
- משתנה מטיפוס המחלקה (`d`) הוא **אובייקט** (נקרא גם *מופע*, instance). לכל אובייקט יש עותק משלו של החברים.
- משתמשים ב**נקודה** כדי לגשת לחבר או לקרוא למתודה: `d.name`, `d.bark()`.
- בתוך מתודה אפשר להשתמש בחברים האחרים ישירות (`name`) בלי נקודה. זה אוטומטית אומר "החבר של האובייקט שעליו קראו למתודה הזאת".
- `public:` פירושו שקוד מחוץ למחלקה רשאי להשתמש במה שבא אחריו. (בשיעור הבא נראה את `private:`.)

## מתודות שמחזירות ערכים

מתודה יכולה לקבל פרמטרים ולהחזיר ערך כמו כל פונקציה:

```cpp
class Circle {
public:
    double radius;
    double diameter() { return 2 * radius; }
};

Circle c;
c.radius = 2.5;
cout << c.diameter() << endl;    // prints: 5
```

## מתודות const

מתודה שרק קוראת את האובייקט יכולה להיות מסומנת `const` אחרי הסוגריים: `int area() const { return width * height; }`. זו הבטחה לא לשנות את האובייקט, והיא מאפשרת לקרוא למתודה על אובייקטי `const`. כאן זה אופציונלי אבל זה הרגל טוב.

## למה להתאמץ?

השוו בין `area(width, height)` (מספרים מפוזרים שאתם צריכים לשמור יחד בעצמכם) לבין `r.area()` (המלבן יודע לענות). מחלקות שומרות דברים קשורים במקום אחד, ולכן הקוד קל יותר לקריאה ולשינוי בהמשך.

> **שימו לב:**
> - שכחתם את הנקודה-פסיק אחרי המחלקה: `error: expected ';' after class definition`.
> - שימוש בחבר מחוץ למחלקה בלי אובייקט: `error: 'width' was not declared in this scope`. צריך `r.width`.
> - בלי `public:`, חברים הם **פרטיים** (private) כברירת מחדל ב-`class`, ולכן `r.width = 3;` נכשלת עם `error: 'int Rectangle::width' is private within this context`.
> - חברים שלא אותחלו (`Rectangle r;` בלי לקבוע אותם) מחזיקים זבל אקראי. בנאים (constructors), בשיעור הבא, פותרים את זה.
> - קריאה למתודה בלי סוגריים (`r.area`) נותנת `error: invalid use of non-static member function`.

## להמשיך הלאה

הוסיפו מתודה `void print()` שמדפיסה `3 x 4`, וצרו שני מלבנים שונים כדי לראות שלכל אחד יש גודל משלו.

> **תורכם:** הוסיפו את המתודות `int area()` ו-`int perimeter()` ל-`Rectangle`. עבור המלבן 3 על 4 ב-`main` התוכנית צריכה להדפיס `Area: 12` ו-`Perimeter: 14`.
