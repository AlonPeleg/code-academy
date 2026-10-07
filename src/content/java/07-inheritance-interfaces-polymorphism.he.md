---
title: "ירושה, ממשקים ופולימורפיזם"
summary: "שתפו קוד עם extends, התחייבו להתנהגות עם ממשקים, ותנו לקריאה אחת לעשות דברים שונים."
hints:
  - "מחלקה מתחייבת לעמוד בממשק עם  class Rectangle implements Shape  וחייבת אז לכתוב כל מתודה שהממשק מפרט (area ו-name), וכל אחת מסומנת public. תת-מחלקה מוגדרת עם extends."
  - "Square(double side) { super(side, side); } מעבירה את הצלע פעמיים לבנאי של Rectangle. אחר כך הוסיפו  @Override public String name() { return \"Square\"; }  בתוך Square. ל-Circle יש שדה radius משלה."
  - "class Rectangle implements Shape { protected double width; protected double height; Rectangle(double w, double h) { width = w; height = h; } public double area() { return width * height; } public String name() { return \"Rectangle\"; } }  class Square extends Rectangle { Square(double side) { super(side, side); } @Override public String name() { return \"Square\"; } }  class Circle implements Shape { private double radius; Circle(double r) { radius = r; } public double area() { return 3.0 * radius * radius; } public String name() { return \"Circle\"; } }"
quiz:
  - q: "איזו מילת מפתח גורמת למחלקה לרשת ממחלקה אחרת?"
    options: ["implements", "extends", "inherits", "super"]
  - q: "מה ממשק מכיל (בצורתו הפשוטה ביותר)?"
    options: ["חתימות של מתודות שמחלקות שמממשות אותו חייבות לספק", "רק שדות פרטיים", "תוכניות שלמות", "כלום, הוא תמיד ריק"]
  - q: "מהו פולימורפיזם?"
    options: ["שימוש בהרבה מחלקות בקובץ אחד", "קריאה לאותה מתודה על אובייקטים שונים וקבלת התנהגות שמתאימה לכל אחד מהם", "הפיכת מחלקה ל-final", "הסתרת שדות"]
    explain: "כאן s.area() מריצה את הגרסה של Rectangle, של Square או של Circle, בהתאם לאובייקט האמיתי שמאחורי s."
  - q: "מכמה מחלקות מחלקה ב-Java יכולה לרשת, וכמה ממשקים היא יכולה לממש?"
    options: ["מחלקה אחת, וכל מספר של ממשקים", "כל מספר של מחלקות, וממשק אחד", "אחד מכל סוג", "כל מספר משניהם"]
messages:
  - "Rectangle חייבת לממש את הממשק Shape."
  - "Square חייבת לרשת מ-Rectangle."
  - "קראו לבנאי של ההורה עם super(...)."
  - "סמנו את המתודה שדורסת עם @Override."
---

תוכניות אמיתיות מלאות בדברים דומים אבל לא זהים: מלבן ועיגול הם שניהם צורות, מנהל ומהנדס הם שניהם עובדים. Java נותנת שלושה רעיונות קשורים כדי לתאר את זה: **ירושה** (inheritance), **ממשקים** (interfaces) ו-**פולימורפיזם** (polymorphism).

## ירושה עם extends

מחלקה יכולה **לרשת** ממחלקה אחרת, שנקראת **ההורה** (או מחלקת-על, superclass). הילד (תת-מחלקה, subclass) מקבל אוטומטית את השדות והמתודות של ההורה ויכול להוסיף משלו:

```java
class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void eat() { System.out.println(name + " eats"); }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);          // call the parent constructor first
    }
    void bark() { System.out.println(name + " barks"); }
}
```

ל-`Dog` אפשר לקרוא גם ל-`eat()` וגם ל-`bark()`. הביטוי `super(...)` בבנאי מריץ את הבנאי של ההורה, והוא חייב להיות הפקודה הראשונה. חשבו על הקשר כעל "**הוא מסוג**": כלב הוא סוג של חיה. אם "הוא מסוג" נשמע לא נכון (מכונית אינה מנוע), ירושה היא הכלי הלא נכון.

Java מאפשרת רק מחלקת הורה **אחת**. רמת הגישה `protected` מאפשרת להשתמש בשדה בתוך המחלקה ובתת-המחלקות שלה (אבל לא בקוד לא קשור).

## דריסה

תת-מחלקה יכולה להחליף מתודה שירשה על ידי כתיבת מתודה חדשה עם אותו שם ואותם פרמטרים. שימו `@Override` מעליה. ההערה הזו (annotation) אופציונלית אבל מצוינת: היא מבקשת מהקומפיילר לבדוק שאתם באמת דורסים משהו, כך שטעות כתיב הופכת לשגיאה:

```java
class Cat extends Animal {
    Cat(String name) { super(name); }

    @Override
    void eat() { System.out.println(name + " nibbles"); }
}
```

בתוך מתודה שדורסת, `super.eat()` קוראת לגרסה של ההורה, אם רוצים להרחיב אותה ולא להחליף אותה.

## ממשקים

**ממשק** הוא הבטחה טהורה: רשימה של חתימות מתודות בלי גוף. מחלקה ש**מממשת** (implements) את הממשק חייבת לספק את כולן:

```java
interface Shape {
    double area();
}

class Circle implements Shape {
    public double area() { return 3.14 * 2 * 2; }
}
```

מתודות בממשק הן אוטומטית `public`, ולכן גם המתודות שמממשות אותן חייבות להיכתב `public` (שכחה של זה היא שגיאת קומפילציה נפוצה). מחלקה יכולה לממש **הרבה** ממשקים, וזו התשובה של Java לכך שאי אפשר לרשת מכמה הורים. השתמשו בממשק כדי לתאר *מה* דבר יכול לעשות (`Comparable`, `Runnable`, `Shape`) ובמחלקת הורה כדי לשתף *איך* זה נעשה.

## פולימורפיזם

המילה פירושה "צורות רבות". משתנה מטיפוס הממשק (או ההורה) יכול להחזיק כל אובייקט שמתאים, וקריאה למתודה מריצה את הגרסה ששייכת לאובייקט **האמיתי**:

```java
Shape[] shapes = { new Rectangle(2, 5), new Circle(2) };
for (Shape s : shapes) {
    System.out.println(s.area());   // each object computes its own area
}
```

קוד הלולאה לא יודע ולא אכפת לו איזה סוג צורה יש לו. אם תוסיפו אחר כך `Triangle`, הלולאה הזו תעבוד בלי שינוי אחד. זה היתרון הגדול: כותבים קוד מול הטיפוס הכללי, וסוגים חדשים מתחברים אחר כך.

אפשר גם לכתוב `Animal a = new Dog("Rex");` (כלב הוא חיה). הכיוון ההפוך דורש המרה (cast) ובדיקה: `if (a instanceof Dog) { Dog d = (Dog) a; }`.

## מחלקות abstract (טעימה)

לפעמים אסור שהורה ייווצר לבדו. סמנו אותו `abstract` והוא יוכל להכיל מתודות מופשטות בלי גוף שכל תת-מחלקה חייבת לכתוב. הוא נמצא בין מחלקה לממשק: הוא יכול להחזיק גם שדות וקוד משותף.

> **שימו לב:**
> - שכחה לממש מתודה של ממשק גורמת ל-`error: Rectangle is not abstract and does not override abstract method name() in Shape`.
> - מימוש מתודה של ממשק בלי `public` גורם ל-`error: attempting to assign weaker access privileges; was public`.
> - להורה שיש לו רק בנאי עם פרמטרים מחייב לקרוא ל-`super(...)` בילד, אחרת מקבלים `error: constructor Rectangle in class Rectangle cannot be applied to given types`.
> - מתודה דורסת עם שגיאת כתיב ו-`@Override` גורמת ל-`error: method does not override or implement a method from a supertype`. זו ההערה שעושה את עבודתה.
> - שדות אינם פולימורפיים, רק מתודות. עדיף לקרוא למתודות ולא לקרוא שדות של ההורה דרך משתנה מטיפוס ההורה.

## להמשיך הלאה

הוסיפו `Triangle` שמממשת את `Shape` והוסיפו אותה למערך בלי לגעת בלולאה. גרמו ל-`Shape` לספק מתודת `default` בשם `describe()` שמחזירה `name() + " area " + area()`. נסו להפוך את `Rectangle` ל-abstract.

> **תורכם:** כתבו `Rectangle implements Shape`, `Square extends Rectangle` (שקוראת ל-`super(side, side)` ודורסת את `name()` עם `@Override`) ו-`Circle implements Shape` (השטח הוא `3.0 * radius * radius`) כך ש-`main` תדפיס את ארבע השורות הצפויות.
