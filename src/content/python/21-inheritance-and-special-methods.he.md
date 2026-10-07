---
title: "ירושה, מתודות מיוחדות ו-properties"
summary: "מרחיבים מחלקות עם super(), הופכים אובייקטים לניתנים להדפסה ולהשוואה, ושומרים על תכונות עם properties."
hints:
  - "למתודות מיוחדות יש קווים תחתונים כפולים, והן מאפשרות לאובייקטים שלכם לעבוד עם תחביר מובנה: __lt__ מפעילה את < ואת sorted(), ו-__eq__ מפעילה את ==. property גורמת למתודה להיראות כמו תכונה: כותבים shape.perimeter בלי סוגריים."
  - "ב-Shape: def __eq__(self, other): return self.area() == other.area() ו-def __lt__(self, other): return self.area() < other.area(). ב-Rectangle כתבו @property מעל def perimeter(self). Square: class Square(Rectangle): def __init__(self, side): super().__init__(side, side)."
  - "class Rectangle(Shape):     def __init__(self, width, height): ...     def area(self): return self.width * self.height     @property     def perimeter(self): return 2 * (self.width + self.height)   class Square(Rectangle):     def __init__(self, side):         super().__init__(side, side)"
quiz:
  - q: "מה super().__init__(side, side) עושה בתוך Square?"
    options: ["מוחק את מחלקת האב", "יוצר Square שני", "מריץ את __init__ של מחלקת האב כדי שההגדרה המורשת תתבצע"]
  - q: "באיזו מתודה מיוחדת print(obj) משתמש כדי לקבל את הטקסט?"
    options: ["__str__", "__print__", "__text__"]
  - q: "מה @property מאפשר לכם לעשות?"
    options: ["להפוך מתודה לפרטית", "לקרוא למתודה בלי סוגריים, כאילו היא תכונה", "להריץ מתודה פעם אחת בזמן הייבוא"]
  - q: "איזו מתודה מיוחדת מחלקה חייבת להגדיר כדי ש-sorted(list_of_objects) יוכל לסדר את האובייקטים (כשלא ניתן key)?"
    options: ["__len__", "__add__", "__repr__", "__lt__"]
messages:
  - "Square צריכה לקרוא ל-super().__init__(...)."
  - "השתמשו ב-@property עבור perimeter."
  - "הגדירו __lt__ כדי ש-sorted() יוכל להשוות צורות."
  - "הגדירו __eq__."
---

ירושה (inheritance) מאפשרת למחלקה אחת להשתמש שוב במחלקה אחרת ולהרחיב אותה. מתודות מיוחדות (אלה עם קווים תחתונים כפולים, שמכונות מתודות "dunder") מאפשרות למחלקות שלכם להתחבר לתחביר המובנה של Python: `print`, `==`, `<`, `len`, `+` ועוד. properties מאפשרות לחשב תכונות או להגן עליהן, תוך שמירה על תחביר נקי של `obj.name`.

## ירושה ו-super()

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):             # Dog is built on Animal
    def __init__(self, name, tricks):
        super().__init__(name)  # let Animal do its part of the setup
        self.tricks = tricks

    def speak(self):            # override: replace the parent's version
        return "Woof"
```

- `class Dog(Animal)` אומר ש-Dog יורשת הכול מ-Animal.
- מתודה עם אותו שם במחלקת הבן **דורסת** (override) את זו של האב.
- `super()` היא דרך להגיע למחלקת האב. `super().__init__(name)` מוודאת שההגדרה של האב רצה. אם שוכחים אותה, `self.name` לעולם לא נקבע.

אפשר לבדוק קשרים עם `isinstance(rex, Animal)` (נותן True עבור Dog).

## מחלקת בסיס כמעט מופשטת

אב יכול להצהיר שהבנים חייבים לספק מתודה על ידי זריקת `NotImplementedError`:

```python
class Shape:
    def area(self):
        raise NotImplementedError("subclasses must implement area")
```

אם בן שוכח את `area`, הקריאה אליה נכשלת בצורה ברורה במקום להחזיר שטויות.

## מתודות מיוחדות

Python הופכת תחביר לקריאות למתודות. כשכותבים `print(x)`, Python קוראת ל-`x.__str__()`. כשכותבים `a == b`, היא קוראת ל-`a.__eq__(b)`.

| מה כותבים | מה Python קוראת | שימוש אופייני |
|---|---|---|
| `print(x)`, `str(x)` | `__str__` | טקסט ידידותי |
| `repr(x)` | `__repr__` | טקסט למפתחים, מוצג ברשימות |
| `a == b` | `__eq__` | שוויון |
| `a < b` | `__lt__` | סידור, `sorted()` |
| `len(x)` | `__len__` | גודל |
| `a + b` | `__add__` | חיבור |

```python
class Money:
    def __init__(self, cents):
        self.cents = cents
    def __eq__(self, other):
        return self.cents == other.cents
    def __lt__(self, other):
        return self.cents < other.cents
    def __str__(self):
        return f"${self.cents / 100:.2f}"

print(sorted([Money(500), Money(150)])[0])    # prints: $1.50
```

`sorted()` צריכה רק את `__lt__`, ולכן הגדרה שלה מספיקה כדי למיין את האובייקטים שלכם.

## Properties

**property** היא מתודה שקוראים כמו תכונה:

```python
class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def diameter(self):
        return self.radius * 2

c = Circle(5)
print(c.diameter)    # prints: 10   (no brackets)
```

properties יכולות גם להגן על ערכים בעזרת setter:

```python
    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("radius cannot be negative")
        self._radius = value
```

קו תחתון ב-`_radius` הוא מוסכמה שאומרת "פנימי, השתמשו ב-property במקום".

> **שימו לב:**
> - אם שוכחים `super().__init__(...)`: מאוחר יותר מקבלים `AttributeError: 'Square' object has no attribute 'width'`.
> - קריאה ל-property עם סוגריים: `shape.perimeter()` זורקת `TypeError: 'int' object is not callable`.
> - הגדרת `__eq__` בלי זהירות: Python קובעת אז את `__hash__` ל-`None`, ולכן אובייקטים כאלה לא יכולים להיות מפתחות במילון או חברים בקבוצה, אלא אם מגדירים גם `__hash__`.
> - השוואה לאובייקט מטיפוס אחר ב-`__eq__` או ב-`__lt__` זורקת `AttributeError`. קוד אמיתי בודק קודם `isinstance(other, Shape)`.
> - ה-setter של property חייב להשתמש בשם אחר (`_radius`). הכתיבה `self.radius = value` בתוך ה-setter קוראת לעצמה בלי סוף (`RecursionError`).

> **תורכם:** השלימו את מחלקות הצורות. ל-`Rectangle` צריך `area` ו-property בשם `perimeter`, `Square` קוראת ל-`super().__init__`, וב-`Shape` צריך `__eq__` ו-`__lt__` שמשוות שטחים. אחר כך הצורות הממוינות אמורות להיות מודפסות מהשטח הקטן ביותר לגדול ביותר.
