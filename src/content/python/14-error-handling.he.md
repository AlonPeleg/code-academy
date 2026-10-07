---
title: "טיפול בשגיאות עם try ו-except"
summary: "שומרים על התוכנית רצה גם כשמשהו משתבש."
messages:
  - "השתמשו בבלוק try."
  - "תפסו ValueError עבור מספרים שגויים."
  - "תפסו ZeroDivisionError עבור חלוקה באפס."
hints:
  - "שימו את השורה המסוכנת בתוך בלוק try:. פייתון קופצת לבלוק except מתאים ברגע שקורית שגיאה בתוך ה-try."
  - "שני דברים שונים יכולים להשתבש: int(text) יכולה לזרוק ValueError, והחלוקה יכולה לזרוק ZeroDivisionError. כתבו סעיף except אחד לכל שגיאה, וציינו את שמה."
  - "try:   return int(text) / divisor   except ValueError:   return \"not a number\"   except ZeroDivisionError:   return \"cannot divide by zero\"   (כל אחד בשורה מוזחת משלו)"
quiz:
  - q: "מה קורה כששגיאה מתרחשת בתוך בלוק try?"
    options: ["התוכנית תמיד קורסת", "פייתון קופצת לבלוק ה-except המתאים", "השגיאה מתעלמים ממנה ובלוק ה-try ממשיך"]
  - q: "איזו שגיאה int(\"abc\") זורקת?"
    options: ["TypeError", "NameError", "ValueError"]
  - q: "איזה בלוק רץ רק כשלא קרתה שום שגיאה?"
    options: ["else", "finally", "except"]
  - q: "למה except: חשוף (בלי סוג שגיאה) הוא הרגל רע?"
    options: ["הוא איטי יותר", "הוא מסתיר כל סוג של שגיאה, כולל באגים", "הוא אסור בפייתון"]
---

במוקדם או במאוחר התוכנית שלכם תפגוש משהו לא צפוי: משתמש מקליד אותיות במקום מספר, קובץ חסר, חלוקה באפס מתגנבת פנימה. בלי הגנה פייתון עוצרת עם הודעת שגיאה אדומה (**traceback**). עם `try` ו-`except` אפשר לתפוס את הבעיה ולהחליט מה לעשות.

## try ו-except

```python
try:
    n = int(input())
    print(100 / n)
except ValueError:
    print("That was not a number")
except ZeroDivisionError:
    print("Cannot divide by zero")
```

איך זה עובד:

1. פייתון מריצה את השורות שבתוך `try`.
2. אם הכול עובד, בלוקי ה-`except` מדולגים.
3. אם קורית שגיאה, פייתון עוצרת **מיד** את בלוק ה-`try` (השורות שנותרו בו לא רצות) ומחפשת `except` שמציין את סוג השגיאה הזה.
4. אם אף אחד לא מתאים, השגיאה לא נתפסת והתוכנית קורסת כרגיל.

## סוגי שגיאות נפוצים

| שגיאה | מתי היא קורית |
| --- | --- |
| `ValueError` | הסוג נכון, הערך שגוי: `int("abc")` |
| `TypeError` | סוג שגוי: `"5" + 2` |
| `ZeroDivisionError` | חלוקה ב-0 |
| `IndexError` | אינדקס גדול מדי ברשימה: `[1, 2][5]` |
| `KeyError` | מפתח חסר במילון: `{}["x"]` |
| `NameError` | שימוש בשם שלא קיים |
| `FileNotFoundError` | פתיחת קובץ שלא קיים |

הודעת השגיאה אומרת לכם בדיוק איזה סוג קיבלתם, למשל `ValueError: invalid literal for int() with base 10: 'abc'`. קראו קודם את השורה האחרונה של ה-traceback.

## else ו-finally

```python
try:
    n = int("42")
except ValueError:
    print("bad")
else:
    print("worked:", n)       # runs only when there was NO error
finally:
    print("always runs")      # runs in every case
```

## קבלת אובייקט השגיאה

```python
try:
    int("abc")
except ValueError as err:
    print("Problem:", err)
```

## זריקת שגיאות משלכם

אפשר להפעיל שגיאה בעצמכם עם `raise` כשהפונקציה מקבלת משהו שאי אפשר לעבוד איתו:

```python
def set_age(age):
    if age < 0:
        raise ValueError("age cannot be negative")
    return age
```

## היו ספציפיים

תפסו את השגיאות **הספציפיות** שאתם מצפים להן. `except:` חשוף מסתיר הכול, כולל שגיאות הקלדה אמיתיות בקוד שלכם, וזה מקשה מאוד למצוא באגים. שמרו גם על בלוק `try` קטן: רק על השורות שעלולות להיכשל.

> **שימו לב:**
> - שוכחים את סוג השגיאה (`except:`) ותופסים דברים שלא התכוונתם לתפוס.
> - שמים יותר מדי בתוך `try` ואז לא ברור איזו שורה נכשלה.
> - `except` חייב להיות מיושר עם `try`, אחרת מתקבלת `SyntaxError: invalid syntax`.
> - הסדר חשוב: שימו שגיאה ספציפית לפני שגיאה כללית יותר כמו `Exception`, כי ה-`except` המתאים הראשון מנצח.

> **תורכם:** גרמו ל-`safe_divide` להחזיר `"not a number"` עבור טקסט כמו `abc` ו-`"cannot divide by zero"` כשהמחלק הוא `0`, בעזרת `try` עם שני בלוקי `except`.
