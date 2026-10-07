---
title: "ארגז הכלים functools"
summary: "ממלאים ארגומנטים מראש עם partial, מקפלים רשימות עם reduce, שומרים במטמון עם הגבלת גודל ומפנים לפי טיפוסים."
hints:
  - "functools.partial(func, name=value) מחזירה פונקציה חדשה שבה הארגומנט הזה כבר מולא. reduce(function, items, start) משלבת את הפריטים משמאל לימין לערך יחיד. lru_cache ו-singledispatch הם דקורטורים."
  - "square = functools.partial(power, exponent=2). product = functools.reduce(lambda a, b: a * b, numbers). longest = functools.reduce(lambda a, b: a if len(a) >= len(b) else b, words). שימו @functools.lru_cache(maxsize=2) מעל lookup, @functools.singledispatch מעל describe, ו-@describe.register מעל פונקציה אחת עבור int ופונקציה אחת עבור list."
  - "@functools.singledispatch def describe(value): return f'something: {value}'   @describe.register def _(value: int): return f'an integer: {value}'   @describe.register def _(value: list): return f'a list of {len(value)} items'"
messages:
  - "השתמשו ב-functools.partial(power, exponent=...)."
  - "השתמשו ב-functools.reduce."
  - "קשטו את lookup עם @functools.lru_cache(maxsize=2)."
  - "השתמשו ב-@functools.singledispatch על describe."
  - "רשמו את הגרסאות של int ושל list עם describe.register."
quiz:
  - q: "מה  functools.partial(power, exponent=2)  מחזירה?"
    options: ["את המספר power(None, 2)", "פונקציה חדשה שקוראת ל-power כשהארגומנט exponent כבר קבוע על 2", "עותק של power שאי אפשר לקרוא לו"]
  - q: "מה  functools.reduce(lambda a, b: a + b, [1, 2, 3])  מחשבת צעד אחר צעד?"
    options: ["קודם (1 + 2), ואז התוצאה הזו + 3", "1 + 2 + 3 בבת אחת במקביל", "רק את הפריט הראשון ואת האחרון"]
  - q: "עם lru_cache(maxsize=2), מה קורה כשנשמר במטמון ארגומנט שלישי ושונה?"
    options: ["Python זורקת שגיאה", "הערך שהשתמשו בו הכי פחות לאחרונה נשכח כדי לפנות מקום", "המטמון מכפיל את גודלו"]
    explain: "LRU פירושו least recently used (השימוש הכי רחוק בזמן). קריאה חוזרת לערך נחשבת שימוש, ולכן הוא נשמר יותר זמן."
  - q: "על מה singledispatch מסתכלת כדי לבחור מימוש?"
    options: ["הטיפוס של הארגומנט הראשון", "שם המשתנה", "מספר הארגומנטים"]
---

המודול הסטנדרטי `functools` הוא ארגז כלים לעבודה עם פונקציות כערכים. כבר פגשתם את `functools.wraps` בשיעור על דקורטורים ואת `functools.cache` בשיעור על memoization. הנה ארבעה כלים נוספים שמקצרים את הקוד ומראים איך נראה סגנון פונקציונלי ב-Python.

## partial: ממלאים ארגומנטים מראש

`functools.partial(func, *args, **kwargs)` מחזירה **פונקציה חדשה** שבה חלק מהארגומנטים כבר נקבעו.

```python
import functools

def greet(greeting, name):
    return f"{greeting}, {name}!"

hello = functools.partial(greet, "Hello")
print(hello("Ava"))                 # prints: Hello, Ava!

shout = functools.partial(greet, name="EVERYONE")
print(shout("Hi"))                  # prints: Hi, EVERYONE!
```

היא שימושית ל-callbacks ולהגדרות: `int` עם `base=2` הופכת למנתח בינארי (`functools.partial(int, base=2)("101")` היא `5`). היא מחליפה הרבה עטיפות `lambda` קטנות בנות שורה אחת, ושומרת את שם הפונקציה המקורית בתכונה `.func`, וזה עוזר ב-debug.

## reduce: מקפלים הרבה ערכים לערך אחד

`functools.reduce(function, items, start)` לוקחת את שני הפריטים הראשונים, משלבת אותם עם `function`, משלבת את התוצאה עם הפריט השלישי, וכך הלאה:

```python
numbers = [1, 2, 3, 4]
print(functools.reduce(lambda a, b: a + b, numbers))        # prints: 10
# steps: (1 + 2) = 3, then (3 + 3) = 6, then (6 + 4) = 10
print(functools.reduce(lambda a, b: a + b, [], 0))          # prints: 0
```

הארגומנט השלישי, האופציונלי, הוא **ערך ההתחלה**. משתמשים בו ראשון, והוא מוחזר עבור רשימה ריקה. בלעדיו רשימה ריקה זורקת `TypeError: reduce() of empty iterable with no initial value`. עבור סכומים וכפלים פשוטים Python מציעה את `sum` ואת `math.prod`, שברורות יותר, ולכן השתמשו ב-`reduce` כשיש לכם כלל שילוב מותאם, כמו "השאירו את המילה הארוכה יותר" או "מזגו שני מילונים".

## lru_cache: זוכרים תוצאות, עם הגבלה

`functools.cache` זוכרת כל תוצאה לנצח. `functools.lru_cache(maxsize=N)` שומרת רק את **N התוצאות שהשתמשו בהן לאחרונה** (LRU = least recently used) ושוכחת את הישנה ביותר, וזה מגן על הזיכרון בתוכניות שרצות זמן רב.

```python
@functools.lru_cache(maxsize=128)
def slow_square(n):
    return n * n
```

תוספות שימושיות: `slow_square.cache_info()` מחזירה `CacheInfo(hits=..., misses=..., maxsize=..., currsize=...)`, ו-`slow_square.cache_clear()` מרוקנת את המטמון. **פגיעה** (hit) היא קריאה שנענתה מהמטמון, ו**החמצה** (miss) היא קריאה שהייתה צריכה להריץ את הפונקציה. זכרו שהארגומנטים חייבים להיות hashable (מספרים, מחרוזות, טאפלים), ושמשמרים במטמון רק פונקציות **טהורות**, שהתוצאה שלהן תלויה בארגומנטים בלבד.

## singledispatch: שם אחד, התנהגות לפי טיפוס

במקום שרשרת ארוכה של `if isinstance(...) elif isinstance(...)`, אפשר לרשום מימוש אחד לכל טיפוס. הטיפוס של הארגומנט הראשון בוחר את הגרסה:

```python
@functools.singledispatch
def size(value):                  # the default
    return 1

@size.register
def _(value: str):                # chosen from the annotation
    return len(value)

@size.register(list)              # or pass the type explicitly
def _(value):
    return sum(size(item) for item in value)
```

אפשר להוסיף טיפוסים חדשים גם אחר כך, אפילו ממודול אחר, בלי לגעת בפונקציה המקורית. זו דרך נחמדה לשמור את הקוד פתוח להרחבה.

> **שימו לב:**
> - נתתם ל-`partial` ארגומנט בסדר הלא נכון: `partial(greet, "Ava")` קובעת את הפרמטר **הראשון** (הברכה), ולא את השם. השתמשו במילת מפתח כמו `name="Ava"` כדי להיות ברורים.
> - שימוש ב-`lru_cache` על פונקציה עם ארגומנט מסוג רשימה: `TypeError: unhashable type: 'list'`.
> - שכחתם `maxsize`: `@functools.lru_cache` חשופה שומרת עד 128 תוצאות, ולכן בדיקה שמצפה שערכים ישנים יישכחו אחרי 2 קריאות תראה פגיעות נוספות.
> - רישום עם הערת טיפוס שאינה מחלקה פשוטה, כמו `list[int]`, נכשל עם `TypeError`. השתמשו ב-`list`.
> - שמירה במטמון של פונקציה עם תופעות לוואי (הדפסה, הוספה לרשימה) אומרת שתופעת הלוואי קורית רק בהחמצות.

## להמשך

נסו את `functools.total_ordering` (כותבים `__eq__` ו-`__lt__` ומקבלים את כל ההשוואות) ואת `functools.cached_property` (מתודה שרצה פעם אחת לכל אובייקט ואז מתנהגת כמו תכונה שמורה).

> **תורכם:** בנו את `square` ו-`cube` עם `partial`, חשבו את המכפלה ואת המילה הארוכה ביותר עם `reduce`, שימו `lru_cache` בגודל 2 על `lookup` וקראו את הסטטיסטיקה שלו, והפכו את `describe` לפונקציית `singledispatch` עם גרסאות עבור `int` ו-`list`.
