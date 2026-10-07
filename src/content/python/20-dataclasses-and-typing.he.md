---
title: "דאטהקלאסים ורמזי טיפוסים"
summary: "מגדירים מחלקות שמחזיקות נתונים בכמה שורות, ומתעדים טיפוסים עם הערות טיפוס."
hints:
  - "דאטהקלאס (dataclass) היא מחלקה רגילה ש-Python כותבת בשבילה את __init__, __repr__ ו-__eq__ לפי השדות המוערים שרשומים בגוף המחלקה."
  - "כתבו @dataclass מעל class Product. בפנים רשמו את השדות, אחד בכל שורה: name: str, ואז price: float, ואז qty: int = 1. שדה עם ערך ברירת מחדל חייב לבוא אחרון. אחר כך def total(self) -> float: return self.price * self.qty."
  - "@dataclass   class Product:     name: str     price: float     qty: int = 1      def total(self) -> float:         return self.price * self.qty"
quiz:
  - q: "מה הדקורטור @dataclass מייצר בשבילכם?"
    options: ["רק מתודת __del__", "מתודות כמו __init__, __repr__ ו-__eq__ לפי השדות המוערים", "טבלה במסד נתונים"]
  - q: "ב-qty: int = 1, מהו int?"
    options: ["רמז טיפוס (type hint) שמתעד את הטיפוס המיועד", "פונקציה שממירה את הערך בזמן ריצה", "ערך ברירת המחדל"]
  - q: "האם Python מונעת מכם לכתוב Product(1, 2, 3) כש-name מוערך כ-str?"
    options: ["כן, היא זורקת TypeError מיד", "לא, רמזים לא נאכפים בזמן ריצה, וכלים כמו mypy בודקים אותם", "כן, אבל רק עבור מספרים"]
  - q: "למה שדות עם ערך ברירת מחדל חייבים לבוא אחרי שדות בלי ערך כזה?"
    options: ["זה רק כלל סגנון", "ערכי ברירת מחדל תמיד ממוינים ראשונים", "אחרת ב-__init__ שנוצר היה פרמטר בלי ברירת מחדל אחרי פרמטר עם ברירת מחדל, ו-Python אוסרת את זה"]
messages:
  - "כתבו @dataclass מעל המחלקה."
  - "הגדירו name: str."
  - "הגדירו qty: int = 1."
  - "הוסיפו את המתודה total."
---

הרבה מחלקות קיימות רק כדי להחזיק כמה ערכים: מוצר, נקודה, משתמש. לכתוב ביד `__init__`, `__repr__` ו-`__eq__` לכל אחת מהן זה משעמם וקל לטעות. **דאטהקלאס** (dataclass) מאפשר לרשום את השדות ולתת ל-Python לכתוב את המתודות המשעממות. בדרך תכירו **רמזי טיפוסים** (type hints), דרך לומר איזה סוג ערך כל משתנה אמור להחזיק.

## רמזי טיפוסים

רמז טיפוס הוא תווית אחרי נקודתיים:

```python
age: int = 30
name: str = "Ava"

def double(x: int) -> int:
    return x * 2
```

`x: int` אומר שהפרמטר אמור להיות מספר שלם, ו-`-> int` אומר שהפונקציה מחזירה מספר שלם. רמזים נפוצים: `int`, `float`, `str`, `bool`, `list[int]`, `dict[str, int]`, ו-`int | None` עבור "מספר שלם או כלום".

הדבר החשוב לדעת: **Python לא אוכפת רמזים כשהתוכנית רצה**. הקריאה `double("ab")` עדיין רצה ונותנת `'abab'`. רמזים הם תיעוד עבור בני אדם, עורכי קוד וכלי בדיקה כמו `mypy`, שמזהירים אתכם לפני שמריצים את הקוד.

## הבעיה שדאטהקלאסים פותרים

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

print(Point(1, 2))                 # prints something like: <__main__.Point object at 0x7f...>
print(Point(1, 2) == Point(1, 2))  # prints: False
```

ההדפסה ברירת המחדל חסרת תועלת, ושתי נקודות עם אותם מספרים לא שוות, כי כברירת מחדל `==` שואל "האם זה בדיוק אותו אובייקט?".

## גרסת הדאטהקלאס

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

print(Point(1, 2))                 # prints: Point(x=1, y=2)
print(Point(1, 2) == Point(1, 2))  # prints: True
```

הדקורטור קורא את השמות המוערים בגוף המחלקה ומייצר `__init__(self, x, y)`, `__repr__` קריא ו-`__eq__` שמשווה שדה אחר שדה. אפשר עדיין להוסיף מתודות משלכם כמו בכל מחלקה.

## ערכי ברירת מחדל ושדות ניתנים לשינוי

```python
from dataclasses import dataclass, field

@dataclass
class Order:
    customer: str
    items: list[str] = field(default_factory=list)
    paid: bool = False
```

שדות עם ערך ברירת מחדל פשוט (`paid: bool = False`) חייבים לבוא **אחרי** שדות בלי ערך כזה. עבור רשימות, מילונים וקבוצות חייבים להשתמש ב-`field(default_factory=list)`, כדי שכל אובייקט יקבל רשימה חדשה משלו. הכתיבה `items: list = []` נדחית עם `ValueError: mutable default <class 'list'> for field items is not allowed: use default_factory`.

## אפשרויות נוספות

- `@dataclass(frozen=True)` הופך אובייקטים לקריאים בלבד, וזה גם מאפשר להשתמש בהם כמפתחות במילון.
- `@dataclass(order=True)` מייצר `<`, `>` שמשווים שדות לפי הסדר, כך שאפשר למיין רשימה שלהם.
- `dataclasses.asdict(obj)` ממיר אובייקט למילון.

> **שימו לב:**
> - אם שוכחים את ההערה: `name = "x"` בלי `: str` הוא רק משתנה מחלקה, לא שדה.
> - שדה עם ברירת מחדל לפני שדה בלי ברירת מחדל: `TypeError: non-default argument 'price' follows default argument`.
> - ערכי ברירת מחדל ניתנים לשינוי כמו `[]`: השתמשו ב-`field(default_factory=list)`.
> - לצפות שרמזי טיפוסים יאמתו קלט: `Product(1, "cheap")` מתקבל בלי תלונה.
> - אם שוכחים `@dataclass`: למחלקה אין `__init__` שנוצר, והקריאה `Product("Pen", 1.5, 4)` נכשלת עם `TypeError: Product() takes no arguments`.

## להמשיך הלאה

הוסיפו `@dataclass(order=True)` ומיינו את המוצרים עם `sorted(items)`, או הפכו מוצר למילון עם `asdict`.

> **תורכם:** הפכו את `Product` לדאטהקלאס עם השדות `name: str`, `price: float` ו-`qty: int = 1`, והוסיפו מתודה `total()` שמחזירה `price * qty`. הקוד שבהמשך אמור להדפיס את ה-repr, בדיקת שוויון, את הכמות ברירת המחדל ואת הסכום של כל הפריטים.
