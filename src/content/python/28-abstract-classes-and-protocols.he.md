---
title: "מחלקות מופשטות ופרוטוקולים"
summary: "מגדירים חוזים בעזרת abc ו-typing.Protocol, ומבינים duck typing ב-Python."
hints:
  - "מחלקה מופשטת יורשת מ-ABC ומסמנת בדקורטור את המתודות שכל תת-מחלקה חייבת לספק. אז Python מסרבת ליצור אובייקטים ממחלקות שעדיין חסרות להן מתודות. Protocol מתאר צורה לפי שמות מתודות בלבד, ותת-מחלקות לא צריכות לרשת ממנו."
  - "class Shape(ABC): עם @abstractmethod מעל def area(self): ... ומתודה רגילה def describe(self) שמחזירה f\"{self.name} with area {self.area()}\". Rectangle ו-Square יורשות מ-Shape. עבור החוזה: @runtime_checkable מעל class Speaker(Protocol): עם def speak(self) -> str: ..."
  - "class Shape(ABC):     @abstractmethod     def area(self): ...     def describe(self): return f\"{self.name} with area {self.area()}\"   class Rectangle(Shape):     name = 'rectangle'     def area(self): return self.width * self.height   @runtime_checkable class Speaker(Protocol):     def speak(self) -> str: ..."
messages:
  - "גרמו ל-Shape לרשת מ-ABC."
  - "סמנו את area עם @abstractmethod."
  - "גרמו ל-Speaker לרשת מ-Protocol."
  - "הוסיפו @runtime_checkable מעל Speaker כדי ש-isinstance יעבוד."
quiz:
  - q: "מה קורה כשקוראים ל-Shape() וב-Shape יש מתודה מופשטת?"
    options: ["זה עובד, וקריאה למתודה המופשטת מחזירה None", "Python זורקת TypeError כי המחלקה מופשטת", "Python זורקת NameError"]
  - q: "מה ההבדל בין ABC לבין Protocol?"
    options: ["תת-מחלקה חייבת לרשת מ-ABC, ואילו ל-Protocol מספיק שיהיו מתודות תואמות (structural typing)", "Protocol יכול להחזיק נתונים אבל ABC לא", "אין הבדל"]
  - q: "מה פירוש duck typing?"
    options: ["כל מחלקה חייבת לרשת מ-Duck", "משתמשים באובייקט לפי מה שהוא יודע לעשות (המתודות שלו), ולא לפי השם שלו או ממי הוא יורש", "Python בודקת את כל הטיפוסים לפני שהתוכנית מתחילה"]
    explain: "אם זה הולך כמו ברווז ומקרקר כמו ברווז, התייחסו אליו כאל ברווז."
  - q: "למה isinstance(x, Speaker) צריכה את @runtime_checkable?"
    options: ["בלעדיה אפשר להשתמש במחלקות Protocol רק בבודקי טיפוסים, ו-isinstance זורקת TypeError", "זה מאיץ את הפרוטוקול", "זה הופך את הפרוטוקול ל-ABC"]
---

לפעמים רוצים לומר "כל צורה חייבת לדעת לחשב את השטח שלה" או "לכל דבר שאני מעביר פנימה חייבת להיות מתודה `speak()`". Python נותנת שני כלים ל**חוזים** כאלה: מחלקות בסיס מופשטות (`abc`) ופרוטוקולים (`typing.Protocol`). הם תופסים טעויות מוקדם והופכים תוכניות גדולות לקלות יותר להרחבה.

## קודם כול, duck typing

בדרך כלל Python לא אכפת לה לאיזו מחלקה שייך אובייקט, אלא רק מה הוא יודע לעשות:

```python
def announce(thing):
    print(thing.speak())      # works for ANY object that has speak()
```

זה נקרא **duck typing**: "אם זה מקרקר כמו ברווז, התייחסו לזה כאל ברווז". זו גמישות נהדרת, אבל שגיאת כתיב או מתודה ששכחתם מתגלות רק ברגע שהקוד רץ, עם `AttributeError: 'Rock' object has no attribute 'speak'`. חוזים מאפשרים לגלות את זה מוקדם יותר.

## מחלקות בסיס מופשטות עם abc

**מחלקה מופשטת** (abstract class) היא מחלקה חצי גמורה שקיימת רק כדי לרשת ממנה. היא מצהירה על מתודות שתת-מחלקות **חייבות** לממש:

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def sound(self):
        ...

    def intro(self):                 # a normal method, inherited as is
        return "I say " + self.sound()

class Cat(Animal):
    def sound(self):
        return "meow"

print(Cat().intro())    # prints: I say meow
Animal()                # TypeError: Can't instantiate abstract class Animal ...
```

צעד אחר צעד:

- יורשים מ-`ABC` כדי להפעיל את המנגנון.
- `@abstractmethod` מסמן מתודה שאין לה כאן גוף אמיתי. הגוף הוא לרוב `...` (ליטרל שאומר "עוד לא כלום") או docstring.
- Python מסרבת ליצור אובייקט כל עוד חסרה **אפילו מתודה מופשטת אחת**, גם בתת-מחלקה. מחלקה שמממשת את כולן נקראת **קונקרטית** (concrete).
- מחלקות מופשטות יכולות להחזיק גם מתודות ותכונות רגילות, כך שקוד משותף נמצא במקום אחד (הרעיון של *template method*: `intro` משתמשת ב-`sound` המופשטת).

השגיאה מופיעה כשיוצרים את האובייקט, לא כשמגדירים את המחלקה, ולכן טעויות מתגלות מיד כשהקוד רץ פעם אחת.

## פרוטוקולים: חוזים לפי צורה

ב-ABC תת-מחלקה חייבת לרשת. **Protocol** (Python 3.8 ומעלה) מתאר את המתודות שאובייקט צריך, וכל מחלקה שיש לה אותן כשירה, **בלי לרשת**. זה נקרא structural typing, כלומר duck typing עם חוזה כתוב.

```python
from typing import Protocol

class Speaker(Protocol):
    def speak(self) -> str:
        ...

def announce(thing: Speaker) -> None:
    print(thing.speak())
```

Python עצמה לא בודקת את ההערה (annotation) כשקוראים ל-`announce`. הבדיקה נעשית על ידי כלים כמו `mypy` או העורך שלכם. אם רוצים גם `isinstance(x, Speaker)` בזמן ריצה, מוסיפים את הדקורטור `@runtime_checkable` מעל המחלקה. שימו לב שבדיקה כזו בודקת רק ש**שמות המתודות קיימים**, ולא את החתימות או את טיפוסי ההחזרה.

## במה לבחור?

- השתמשו ב-**ABC** כשהמשפחה של המחלקות בבעלותכם ואתם רוצים קוד משותף ושגיאה חדה אם חסרה מתודה.
- השתמשו ב-**Protocol** כשאתם מתארים מה פונקציה מקבלת והאובייקטים באים ממקומות שונים (כולל ספריות שאי אפשר לשנות).

> **שימו לב:**
> - שכחתם `ABC` בשורת המחלקה: אז `@abstractmethod` לא עושה כלום ו-`Shape()` עובדת בשמחה.
> - שכחתם לממש מתודה מופשטת אחת בתת-מחלקה: `TypeError: Can't instantiate abstract class Incomplete without an implementation for abstract method 'area'`.
> - שימוש ב-`isinstance` עם Protocol שחסר לו `@runtime_checkable` נותן `TypeError: Instance and class checks can only be used with @runtime_checkable protocols`.
> - אל תיצרו אובייקט ממחלקת Protocol עצמה: `TypeError: Protocols cannot be instantiated`.
> - פרוטוקולים לא נאכפים בזמן הקריאה: העברת אובייקט שגוי נכשלת רק בתוך הפונקציה, אלא אם בודק טיפוסים בוחן את הקוד.

## להמשך

הוסיפו תכונה מופשטת (`@property` מעל `@abstractmethod`) או כתבו צורה `Circle` בעזרת `math.pi` וצמצמו את התוצאה בעיגול. שימו לב שהוספת `Circle` לא מחייבת לערוך אף קוד קיים, וזו כל המטרה של תכנות מול חוזה.

> **תורכם:** הפכו את `Shape` למחלקה מופשטת עם `area` מופשטת ו-`describe` רגילה, ממשו את `Rectangle` ו-`Square`, והפכו את `Speaker` ל-`Protocol` שאפשר לבדוק בזמן ריצה, כך ש-`Dog` ו-`Robot` נחשבים ל-speakers בלי לרשת ממנו.
