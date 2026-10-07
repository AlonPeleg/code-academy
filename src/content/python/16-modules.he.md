---
title: "מודולים וספרייה הסטנדרטית"
summary: "מייבאים כלים מוכנים כמו math, random ו-datetime."
hints:
  - "מודול (module) הוא קובץ של כלים מוכנים. מביאים אותו עם import, ואז משתמשים בכלים שלו עם נקודה: math.sqrt(...)."
  - "צריך שלושה מודולים: math (sqrt, pi), random (seed, randint) ו-datetime (date, timedelta). אתחול (seed) עם אותו מספר לפני השימוש הופך את התוצאה האקראית לחוזרת. אפשר לעצב תאריך עם .strftime(\"%A\") כדי לקבל את שם היום בשבוע."
  - "import math, random   from datetime import date, timedelta   print(math.sqrt(144))   print(round(math.pi, 3))   d = date(2024, 3, 15)   print(d + timedelta(days=30))   random.seed(42)   print(random.randint(1, 100))   print(d.strftime(\"%A\"))"
quiz:
  - q: "מה עושה import math?"
    options: ["הופך את Python למהיר יותר", "עושה את שיעורי הבית במתמטיקה", "מאפשר להשתמש בכלים של המודול math, כמו math.sqrt"]
  - q: "למה קוראים ל-random.seed(42) לפני יצירת מספרים אקראיים?"
    options: ["זה גורם לתוצאות לחזור על עצמן בכל הרצה", "זה הופך את המספרים לגדולים יותר", "Python דורשת את זה"]
  - q: "מה ההבדל בין import math לבין from math import sqrt?"
    options: ["אין הבדל", "השני מאפשר לכתוב sqrt(...) בלי הקידומת math.", "הראשון עובד רק עם מספרים"]
  - q: "מה מחזירה random.randint(1, 6)?"
    options: ["מספר שלם מ-1 עד 6, כולל שני הקצוות", "מספר שלם מ-1 עד 5", "מספר עשרוני בין 1 ל-6"]
messages:
  - "השתמשו ב-import כדי לטעון את המודולים."
  - "השתמשו ב-math.sqrt עבור השורש הריבועי."
  - "אתחלו את המחולל עם 42 לפני השימוש בו."
  - "השתמשו ב-timedelta כדי להוסיף ימים."
---

ל-Python מצורפת ארגז כלים ענק שנקרא **הספרייה הסטנדרטית** (standard library): מאות מודולים מוכנים למתמטיקה, תאריכים, מספרים אקראיים, קבצים, אינטרנט ועוד. אין צורך לכתוב הכול מאפס. צריך רק לדעת לייבא את מה שצריך.

## מהו מודול?

**מודול** (module) הוא פשוט קובץ Python מלא בפונקציות וערכים שאפשר להשתמש בהם שוב. הפקודה `import` טוענת אותו:

```python
import math

print(math.sqrt(16))    # prints: 4.0
print(math.pi)          # prints: 3.141592653589793
print(math.floor(2.7))  # prints: 2
print(math.ceil(2.1))   # prints: 3
```

אחרי `import math` ניגשים לכלים עם נקודה: `math.sqrt`. שם המודול משמש כקידומת, וזה שומר על סדר ומונע התנגשויות בין שמות.

אפשר גם לייבא שמות מסוימים ישירות:

```python
from math import sqrt, pi
print(sqrt(25))         # prints: 5.0
```

עכשיו לא צריך קידומת. השתמשו באפשרות שברורה יותר בקוד שלכם.

## random

המודול `random` מייצר מספרים פסאודו-אקראיים:

```python
import random

print(random.randint(1, 6))          # a whole number 1 to 6 (both included)
print(random.choice(["a", "b", "c"]))  # one item from a list
items = [1, 2, 3]
random.shuffle(items)                # shuffles the list in place
```

מחשבים לא יכולים להיות אקראיים באמת. הם עובדים לפי נוסחה שמתחילה מ**זרע** (seed). אם קובעים את הזרע בעצמנו, המספרים ה"אקראיים" יוצאים באותו סדר בכל פעם, וזה מושלם לבדיקות ולתרגילים כמו זה:

```python
random.seed(42)
print(random.randint(1, 100))   # always the same number for seed 42
```

בלי זרע, Python בוחרת נקודת התחלה אחרת בכל הרצה.

## datetime

תאריכים הם עניין מסובך באופן מפתיע, אז כדאי להשתמש במודול שנבנה בשבילם:

```python
from datetime import date, timedelta

d = date(2024, 3, 15)
print(d)                                  # prints: 2024-03-15
print(d.year)                             # prints: 2024
print(d + timedelta(days=30))             # prints: 2024-04-14
print(d.strftime("%A"))                   # prints: Friday
print(d.strftime("%d/%m/%Y"))             # prints: 15/03/2024
```

`timedelta` הוא פרק זמן שאפשר להוסיף או לחסר. `strftime` ("string format time") הופכת תאריך לטקסט בעזרת קודים כמו `%A` (שם היום בשבוע), `%d` (יום), `%m` (חודש) ו-`%Y` (שנה). `date.today()` נותנת את התאריך הנוכחי, אבל התוצאה שלה משתנה בכל יום, ולכן כדאי להימנע ממנה בתרגילים עם תשובה קבועה.

## למצוא עוד

עוד מודולים שימושיים: `statistics` (ממוצע, חציון), `string` (אותיות וספרות), `collections` (Counter), `json` (קריאה וכתיבה של JSON) ו-`time`. כתבו `import this` להפתעה קטנה. ל-Python יש גם ספרייה עצומה של חבילות צד שלישי, אבל הספרייה הסטנדרטית כבר מספיקה להרבה דברים.

> **שימו לב:**
> - שימוש במודול בלי לייבא אותו גורם ל-`NameError: name 'math' is not defined`.
> - שגיאת כתיב בשם של כלי, כמו `math.squareroot(9)`, גורמת ל-`AttributeError: module 'math' has no attribute 'squareroot'`.
> - לעולם אל תקראו לקובץ שלכם `random.py` או `math.py`: הוא יסתיר את המודול האמיתי.
> - `math.sqrt(-1)` זורקת `ValueError: math domain error`.
> - `randint(1, 6)` כולל את שני הקצוות, אבל `range(1, 6)` לא כולל את 6.

> **תורכם:** הדפיסו את חמש התוצאות שמופיעות בהערות, בעזרת `math`, `random` (עם זרע 42) ו-`datetime`.
