---
title: "דקורטורים"
summary: "עוטפים פונקציה בהתנהגות נוספת עם התחביר @ ועם functools.wraps."
hints:
  - "דקורטור (decorator) הוא פונקציה שמקבלת פונקציה ומחזירה פונקציה חדשה. העטיפה (wrapper) שבתוכו מוסיפה התנהגות לפני או אחרי הקריאה למקורית."
  - "def logged(func): ובתוכה הגדירו def wrapper(*args, **kwargs): הדפיסו את השם עם func.__name__, ואז return func(*args, **kwargs). סיימו עם return wrapper. כתבו @logged בשורה שמעל כל def."
  - "def logged(func):     @functools.wraps(func)     def wrapper(*args, **kwargs):         print(f\"Calling {func.__name__}\")         return func(*args, **kwargs)     return wrapper   ואז כתבו @logged מעל def add ומעל def greet."
quiz:
  - q: "מהו דקורטור?"
    options: ["פונקציה שמקבלת פונקציה ומחזירה פונקציה חדשה, בדרך כלל עטופה", "הערה שנכתבת מעל פונקציה", "מחלקה שאסור שיהיו לה מתודות"]
  - q: "למה שקולה השורה @logged כשהיא כתובה מעל def add?"
    options: ["add = logged", "קוראים ל-logged(add) והתוצאה נזרקת", "add = logged(add)"]
  - q: "למה העטיפה מקבלת *args ו-**kwargs?"
    options: ["כדי שתוכל לקבל ולהעביר הלאה כל ארגומנט שהפונקציה המקורית מקבלת", "כדי שהפונקציה תרוץ מהר יותר", "כי לדקורטורים חייבים להיות תמיד שני פרמטרים"]
  - q: "מה functools.wraps עושה?"
    options: ["מריצה את הפונקציה פעמיים", "מעתיקה את השם ואת ה-docstring של הפונקציה המקורית אל העטיפה", "הופכת את העטיפה לפרטית"]
messages:
  - "קשטו את הפונקציות עם @logged."
  - "העטיפה חייבת לקבל *args ו-**kwargs."
  - "השתמשו ב-functools.wraps על העטיפה."
---

ב-Python פונקציות הן ערכים: אפשר לשמור אותן במשתנים, להעביר אותן לפונקציות אחרות ולהחזיר אותן. **דקורטור** (decorator) משתמש בזה כדי להוסיף התנהגות לפונקציה (רישום ביומן, מדידת זמן, בדיקת ארגומנטים, שמירה במטמון) בלי לגעת בקוד של הפונקציה עצמה. פריימוורקים כמו Flask וכלים כמו `functools.cache` נשענים עליהם מאוד.

## פונקציות שמחזירות פונקציות

```python
def make_greeter(greeting):
    def greeter(name):
        return f"{greeting}, {name}!"
    return greeter

hello = make_greeter("Hello")
print(hello("Ava"))     # prints: Hello, Ava!
```

`greeter` מוגדרת **בתוך** `make_greeter` וזוכרת את `greeting` גם אחרי ש-`make_greeter` סיימה. זה נקרא **closure** (סגור).

## הדקורטור הראשון שלכם

דקורטור מקבל פונקציה ומחזיר תחליף:

```python
def shout(func):
    def wrapper():
        print("before")
        func()
        print("after")
    return wrapper

def hi():
    print("hi")

hi = shout(hi)    # replace hi by the wrapped version
hi()              # prints: before, hi, after
```

Python נותנת קיצור לשורה `hi = shout(hi)`: כותבים `@shout` מעל ההגדרה.

```python
@shout
def hi():
    print("hi")
```

## עטיפות שמקבלות כל ארגומנט

העטיפה שלמעלה עובדת רק עבור פונקציות בלי פרמטרים. כדי לקשט כל פונקציה, מקבלים הכול ומעבירים הלאה:

- `*args` אוסף את כל הארגומנטים המיקומיים לטאפל (tuple).
- `**kwargs` אוסף את כל הארגומנטים עם שם למילון (dictionary).
- `func(*args, **kwargs)` מפרק אותם שוב בזמן הקריאה.

```python
def logged(func):
    def wrapper(*args, **kwargs):
        print("Calling", func.__name__)
        return func(*args, **kwargs)     # do not forget to return the result!
    return wrapper
```

## שמירה על הזהות: functools.wraps

אחרי הקישוט, `add` היא בעצם הפונקציה `wrapper`, ולכן `add.__name__` אומר `'wrapper'`, וטקסט העזרה והדיבאגרים מתבלבלים. מתקנים את זה עם `functools.wraps`, שהוא בעצמו דקורטור שמעתיק את השם ואת ה-docstring מהפונקציה המקורית:

```python
import functools

def logged(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("Calling", func.__name__)
        return func(*args, **kwargs)
    return wrapper
```

כדאי להתרגל להוסיף אותו לכל דקורטור שאתם כותבים.

## דקורטורים עם הגדרות משלהם

אם רוצים `@repeat(3)` צריך עוד רמה אחת: פונקציה שמקבלת את ההגדרה ומחזירה את הדקורטור עצמו.

```python
def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator
```

שלוש פונקציות מקוננות נראות מפחידות, אבל קראו אותן מבחוץ פנימה: הגדרות, אחר כך פונקציה, ואחר כך קריאה.

> **שימו לב:**
> - אם שוכחים `return wrapper` בסוף: השם המקושט הופך ל-`None`, וקריאה אליו נותנת `TypeError: 'NoneType' object is not callable`.
> - אם שוכחים `return func(...)` בתוך העטיפה: הפונקציה המקושטת תמיד מחזירה `None`.
> - כתיבת `@logged()` עם סוגריים כשהדקורטור שלכם מקבל את הפונקציה ישירות: `TypeError: logged() missing 1 required positional argument: 'func'`.
> - אם מדלגים על `functools.wraps`: הכול עדיין עובד, אבל `add.__name__` מדפיס `wrapper`.
> - הדקורטור רץ כשהפונקציה **מוגדרת**, והעטיפה רצה בכל פעם שהיא **נקראת**.

## להמשיך הלאה

כתבו דקורטור `timed` עם `time.perf_counter()` (אל תדפיסו את הזמן בשיעור שצריך להיות ניתן לשחזור), או דקורטור `check_positive` שזורק `ValueError` אם אחד הארגומנטים שלילי.

> **תורכם:** כתבו את הדקורטור `logged` עם עטיפה שמדפיסה `Calling <name>` ומחזירה את התוצאה המקורית, השתמשו ב-`functools.wraps`, והחילו את `@logged` על `add` ועל `greet`.
