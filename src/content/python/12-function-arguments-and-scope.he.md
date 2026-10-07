---
title: "ארגומנטים ברירת מחדל, מילות מפתח וטווח"
summary: "הופכים פונקציות לגמישות עם ערכי ברירת מחדל וארגומנטים עם שם, ולומדים איפה משתנים חיים."
messages:
  - "הגדירו את הפונקציה greet עם def."
  - "תנו ל-greeting את ערך ברירת המחדל \"Hello\" בשורת ה-def."
  - "תנו ל-punctuation את ערך ברירת המחדל \"!\" בשורת ה-def."
hints:
  - "ערך ברירת מחדל נכתב בשורת ה-def עם סימן שווה: פרמטר עם ערך ברירת מחדל הופך לאופציונלי בקריאות. פרמטרים בלי ערך ברירת מחדל חייבים לבוא קודם."
  - "שורת ה-def נראית כך: def greet(name, greeting=\"Hello\", punctuation=\"!\"): והגוף מחזיר f-string שמשלב את שלושת הפרמטרים."
  - "def greet(name, greeting=\"Hello\", punctuation=\"!\"):   return f\"{greeting}, {name}{punctuation}\""
quiz:
  - q: "מהו ארגומנט ברירת מחדל?"
    options: ["ערך שנעשה בו שימוש כשהקורא לא נותן ערך", "ארגומנט חובה", "הארגומנט הראשון"]
  - q: "בהינתן def f(a, b=2): איזו קריאה תקינה?"
    options: ["f(b=5)", "f()", "f(1)"]
  - q: "משתנה שנוצר בתוך פונקציה הוא..."
    options: ["נראה בכל מקום בתוכנית", "נראה רק בתוך הפונקציה הזו", "נמחק כשהתוכנית מתחילה"]
  - q: "למה def f(a=1, b): היא שגיאה?"
    options: ["ערכי ברירת מחדל אסורים", "פרמטרים עם ערך ברירת מחדל חייבים לבוא אחרי אלה שבלעדיו", "השמות קצרים מדי"]
---

פונקציות נעימות הרבה יותר כשהקוראים להן לא צריכים לפרט כל פרט בכל פעם. בשיעור הזה תלמדו על ערכי ברירת מחדל, ארגומנטים עם שם (keyword arguments), ו**טווח** (scope), הכלל שקובע איפה אפשר לראות משתנה.

## ארגומנטי ברירת מחדל

תנו לפרמטר ערך ברירת מחדל עם `=` בשורת ה-`def`. אז מי שקורא לפונקציה יכול להשמיט אותו:

```python
def power(base, exponent=2):
    return base ** exponent

print(power(5))       # prints: 25   (exponent is 2)
print(power(2, 10))   # prints: 1024
```

כלל: פרמטרים **עם** ערך ברירת מחדל חייבים לבוא **אחרי** אלה שבלעדיו. `def f(a=1, b):` היא `SyntaxError`.

## ארגומנטים עם שם

בזמן הקריאה אפשר לציין בשם את הפרמטר שממלאים. אלה **ארגומנטים עם שם** (keyword arguments):

```python
def describe(name, age=0, city="unknown"):
    return f"{name}, {age}, {city}"

print(describe("Ava", 21))                 # prints: Ava, 21, unknown
print(describe("Noam", city="Haifa"))      # prints: Noam, 0, Haifa
print(describe(city="Eilat", name="Dana")) # prints: Dana, 0, Eilat
```

למילות המפתח יש שני יתרונות גדולים. אפשר לדלג על פרמטרים אופציונליים באמצע (למעלה קפצנו ישר ל-`city`), והקריאה מסבירה את עצמה: `describe("Noam", city="Haifa")` קל יותר לקריאה מ-`describe("Noam", 0, "Haifa")`. ברגע שהתחלתם להשתמש במילות מפתח בקריאה, גם כל השאר חייבים להיות עם שם.

## טווח

**טווח** (scope) הוא האזור בתוכנית שבו אפשר להשתמש בשם.

```python
rate = 0.5                  # global: created outside any function

def price_after_discount(price):
    discount = price * rate # reads the global rate: fine
    return price - discount # discount only exists inside this function

print(price_after_discount(10))   # prints: 5.0
print(discount)                   # NameError: name 'discount' is not defined
```

- משתנים ופרמטרים שנוצרים **בתוך** פונקציה הם **מקומיים** (local). הם נוצרים כשהפונקציה רצה ונעלמים כשהיא מסתיימת.
- משתנים שנוצרים **מחוץ** לפונקציה הם **גלובליים** (global). פונקציה יכולה לקרוא אותם.
- השמה לשם בתוך פונקציה יוצרת משתנה **מקומי חדש**, גם אם קיים משתנה גלובלי באותו שם:

```python
count = 0

def add_one():
    count = 1        # a new local variable, the global stays 0

add_one()
print(count)         # prints: 0
```

מילת המפתח `global` יכולה לעקוף את זה, אבל היא מקשה על המעקב אחרי הקוד. ההרגל הנקי יותר: **מעבירים ערכים פנימה כארגומנטים ומוציאים תוצאות עם `return`.**

## סכנה: ערכי ברירת מחדל שניתנים לשינוי

לעולם אל תשתמשו ברשימה ריקה כערך ברירת מחדל, כמו ב-`def add(item, bag=[])`. הרשימה נוצרת פעם אחת ומשותפת לכל הקריאות. השתמשו ב-`bag=None` וצרו רשימה חדשה בפנים בעת הצורך.

> **שימו לב:**
> - פרמטר בלי ערך ברירת מחדל אחרי פרמטר עם ערך: `SyntaxError: non-default argument follows default argument`.
> - נותנים את אותו ערך פעמיים: `greet("Ava", name="Ava")` נותנת `TypeError: greet() got multiple values for argument 'name'`.
> - מילת מפתח עם שגיאת כתיב נותנת `TypeError: greet() got an unexpected keyword argument 'greting'`.
> - קריאה של משתנה מקומי מחוץ לפונקציה שלו נותנת `NameError`.
> - שינוי משתנה גלובלי בתוך פונקציה בלי `global` נותן `UnboundLocalError` כשגם קוראים אותו קודם.

> **תורכם:** כתבו את `greet(name, greeting="Hello", punctuation="!")` שמחזירה f-string, כך שכל ארבע הקריאות בעורך ידפיסו את השורות הצפויות.
