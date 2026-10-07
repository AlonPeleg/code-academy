---
title: "רקורסיה ו-memoization"
summary: "פותרים בעיות על ידי כך שפונקציה קוראת לעצמה, ומאיצים אותה עם functools.cache."
hints:
  - "לפונקציה רקורסיבית יש מקרה בסיס (base case) שעוצר את הקריאות (הבעיה הקטנה ביותר שאפשר לענות עליה ישירות), ומקרה רקורסיבי שקורא לעצמו על בעיה קטנה יותר."
  - "factorial: אם n == 0 החזירו 1, אחרת החזירו n * factorial(n - 1). fib: אם n < 2 החזירו n, אחרת החזירו fib(n - 1) + fib(n - 2), עם @functools.cache מעל ה-def. flatten: עברו על items בלולאה. אם isinstance(x, list) הרחיבו את התוצאה עם flatten(x), אחרת הוסיפו את x."
  - "def factorial(n):     return 1 if n == 0 else n * factorial(n - 1)   @functools.cache def fib(n):     return n if n < 2 else fib(n - 1) + fib(n - 2)   def flatten(items):     result = []     for x in items:         if isinstance(x, list):             result.extend(flatten(x))         else:             result.append(x)     return result"
quiz:
  - q: "מהו מקרה בסיס?"
    options: ["השורה הראשונה של כל פונקציה", "הקלט שעבורו הפונקציה עונה ישירות בלי לקרוא לעצמה", "מקרה שבו נזרקת שגיאה בכוונה"]
  - q: "מה קורה אם לפונקציה רקורסיבית אין מקרה בסיס?"
    options: ["היא מחזירה None", "היא רצה לנצח בשקט", "היא ממשיכה לקרוא לעצמה עד ש-Python זורקת RecursionError"]
  - q: "למה fib(80) הרקורסיבית הפשוטה כל כך איטית?"
    options: ["היא מחשבת מחדש את אותם ערכים קטנים יותר מספר עצום של פעמים", "Python לא יכולה לחבר מספרים גדולים", "רקורסיה תמיד איטית"]
  - q: "מה functools.cache עושה לפונקציה?"
    options: ["שומרת תוצאות לפי ארגומנטים, כך שקריאה חוזרת מחזירה את התשובה השמורה במקום לחשב מחדש", "מריצה את הפונקציה ברקע", "מגבילה אותה לקריאה אחת"]
    explain: "הטכניקה הזו נקראת memoization. הארגומנטים חייבים להיות hashable, למשל מספרים, מחרוזות או טאפלים, אבל לא רשימות."
messages:
  - "קשטו את fib עם functools.cache."
  - "השתמשו ב-isinstance(x, list) ב-flatten."
---

**רקורסיה** (recursion) פירושה שפונקציה פותרת בעיה בכך שהיא קוראת לעצמה על גרסה קטנה יותר של אותה בעיה. זו הדרך הטבעית לטפל בדברים שמכילים עותקים קטנים יותר של עצמם: תיקיות בתוך תיקיות, רשימות מקוננות, עצים והגדרות מתמטיות כמו עצרת.

## שני החלקים של כל פונקציה רקורסיבית

1. **מקרה בסיס** (base case): הקלט הפשוט ביותר, שעונים עליו ישירות. זה מה שעוצר את הרקורסיה.
2. **מקרה רקורסיבי** (recursive case): מקטינים את הבעיה וקוראים לעצמנו עם הבעיה הקטנה יותר, ואז משלבים את התוצאה.

```python
def factorial(n):
    if n == 0:                 # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(4))   # prints: 24
```

עקבו אחרי הקריאות: `factorial(4)` היא `4 * factorial(3)`, שהיא `4 * 3 * factorial(2)`, וכן הלאה עד ש-`factorial(0)` מחזירה 1. אז התשובות מוכפלות בדרך חזרה למעלה: 1, 1, 2, 6, 24. Python שומרת כל קריאה ממתינה ב**מחסנית הקריאות** (call stack).

## מגבלות רקורסיה

כל קריאה משתמשת מעט זיכרון במחסנית, ולכן Python עוצרת אתכם בערך אחרי 1000 קריאות מקוננות:

```python
def forever(n):
    return forever(n + 1)

forever(0)    # RecursionError: maximum recursion depth exceeded
```

מקרה בסיס חסר או שגוי גורם לשגיאה הזו. בבעיות עמוקות מאוד בדרך כלל עדיף להשתמש בלולאה.

## רקורסיה על נתונים מקוננים

רקורסיה זורחת כשצורת הנתונים מקוננת:

```python
def depth(x):
    if not isinstance(x, list):
        return 0
    return 1 + max([depth(item) for item in x], default=0)

print(depth([1, [2, [3]]]))   # prints: 3
```

`isinstance(x, list)` שואלת "האם הערך הזה הוא רשימה?". אם לא, זה פריט פשוט, וזה מקרה הבסיס.

## המלכודת של פיבונאצ'י

מספרי פיבונאצ'י מוגדרים באופן רקורסיבי: `fib(n) = fib(n-1) + fib(n-2)`, עם `fib(0) = 0` ו-`fib(1) = 1`.

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

זה נכון אבל איטי להחריד. `fib(5)` קוראת ל-`fib(3)` פעמיים, ל-`fib(2)` שלוש פעמים וכן הלאה. מספר הקריאות בערך **מוכפל** בכל פעם ש-n גדל, ולכן `fib(40)` כבר לוקחת הרבה שניות ו-`fib(80)` הייתה לוקחת יותר מחיי אדם.

## Memoization

התיקון הוא לזכור תשובות שכבר חישבנו. זה נקרא **memoization**, ו-Python עושה את זה בשורה אחת:

```python
import functools

@functools.cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(80))   # prints: 23416728348467685, instantly
```

`functools.cache` הוא דקורטור: הוא שומר מילון מארגומנטים לתוצאות. כל ערך מ-0 עד 80 מחושב בדיוק פעם אחת, ולכן העבודה גדלה בקו ישר ולא מתפוצצת. לפונקציה המקושטת יש גם `fib.cache_info()` שמציגה פגיעות, החטאות ומספר התוצאות השמורות, ו-`fib.cache_clear()` כדי לרוקן את המטמון. (אם צריך להגביל זיכרון, השתמשו ב-`functools.lru_cache(maxsize=100)`.)

Memoization עובד רק אם הפונקציה **טהורה** (pure) (אותם ארגומנטים תמיד נותנים אותה תוצאה) והארגומנטים **hashable**: מספרים, מחרוזות וטאפלים מתאימים, רשימות ומילונים לא.

> **שימו לב:**
> - אין מקרה בסיס או שלעולם לא מגיעים אליו: `RecursionError: maximum recursion depth exceeded`.
> - לא מקטינים את הבעיה: קריאה ל-`factorial(n)` במקום ל-`factorial(n - 1)` רצה לנצח.
> - אם שוכחים לעשות `return` לקריאה הרקורסיבית: הפונקציה מחזירה `None` ורואים `TypeError: unsupported operand type(s) for *: 'int' and 'NoneType'`.
> - שמירה במטמון של פונקציה עם ארגומנט רשימה: `TypeError: unhashable type: 'list'`. המירו קודם לטאפל.
> - שמירה במטמון של פונקציה עם תופעות לוואי (הדפסה, קריאת שעון): קריאות חוזרות מדלגות על תופעת הלוואי.

## להמשיך הלאה

כתבו את `power(base, exp)` באופן רקורסיבי לפי הרעיון `base ** exp = base * base ** (exp - 1)`, או את `sum_digits(n)`, שמשתמשת ב-`n % 10` וב-`n // 10`.

> **תורכם:** ממשו את `factorial` באופן רקורסיבי, את `fib` באופן רקורסיבי עם `functools.cache`, ואת `flatten` עבור רשימות מקוננות עם `isinstance`. ארבע השורות המודפסות אמורות להתאים לפלט הצפוי.
