---
title: "תאריכים, שעות ו-enum"
summary: "עובדים עם date, datetime ו-timedelta בעזרת תאריכים קבועים, ומתנים בחירות קבועות בשמות עם Enum ו-IntEnum."
hints:
  - "Enum היא מחלקה שהתכונות שלה הן קבוצה קבועה של ערכים בעלי שם. עברו על המחלקה בלולאה כדי לקבל את החברים, השתמשו ב-Status('done') כדי לחפש לפי ערך וב-Priority['HIGH'] כדי לחפש לפי שם. חיסור של שני תאריכים נותן timedelta עם מספר .days."
  - "class Priority(IntEnum): עם LOW = 1 וכן הלאה. due = datetime.strptime(due_text, '%Y-%m-%d').date(). days = (due - TODAY).days קובע את הסיומת. TODAY + timedelta(weeks=2) הוא תאריך הסקירה. datetime(2024, 5, 10, 9, 30) + timedelta(hours=2, minutes=45) הוא סוף הפגישה."
  - "tasks.append((title, due, Priority[level]))   for title, due, priority in sorted(tasks, key=lambda t: t[1]):     days = (due - TODAY).days     print(f\"{due.strftime('%a %d %b')} {title} [{priority.name}] {when}\")   print('urgent:', sum(1 for t in tasks if t[2] >= Priority.HIGH))"
messages:
  - "הגדירו class Priority(IntEnum)."
  - "הגדירו class Status(Enum)."
  - "נתחו את תאריכי היעד עם datetime.strptime."
  - "השתמשו ב-timedelta לחשבון התאריכים."
quiz:
  - q: "איזה טיפוס מקבלים כשמחסרים תאריך אחד מתאריך אחר?"
    options: ["אובייקט timedelta עם תכונה .days", "מספר שלם (int) עם מספר הימים", "תאריך חדש"]
  - q: "מה  datetime.strptime('2024-05-14', '%Y-%m-%d')  עושה?"
    options: ["הופכת datetime לטקסט", "הופכת טקסט ל-datetime לפי הפורמט שניתן", "מחזירה את השעה הנוכחית"]
    explain: "טריק זיכרון: strptime היא string parse time, ו-strftime היא string format time."
  - q: "למה זה רעיון גרוע לקרוא ל-date.today() בתוכנית שהפלט שלה חייב להיות חוזר?"
    options: ["היא לא זמינה ב-Python", "היא מחזירה ערך שונה בכל יום, ולכן הפלט משתנה", "היא תמיד מחזירה את אותו יום"]
  - q: "מה היתרון של Enum על פני מחרוזות פשוטות כמו \"HIGH\"?"
    options: ["קבוצת הערכים התקינים קבועה, ולכן שגיאות כתיב כמו Priority.HIHG נכשלות בקול", "Enum תמיד מהיר יותר ממחרוזות", "ב-Enum אפשר להחזיק מספר בלתי מוגבל של ערכים"]
---

כמעט כל תוכנית אמיתית נוגעת בתאריכים: מועדי יעד, גילאים, שעות ביומן (log), תפוגה. יש בה גם בחירות קבועות כמו סטטוס הזמנה או עדיפות. בשיעור הזה תלמדו את הכלים הסטנדרטיים לשניהם: `datetime` לזמן ו-`enum` לבחירות בעלות שם. קל לטעות בקוד של תאריכים בדרכים עדינות, ולכן נתאמן עם **תאריכים קבועים**. אם הייתם משתמשים ב-`date.today()` או ב-`datetime.now()` התוצאה הייתה משתנה בכל יום, וזה גם מקשה לבדוק את הקוד.

## date, datetime ו-timedelta

```python
from datetime import date, datetime, timedelta

d = date(2024, 5, 10)              # year, month, day
print(d)                           # prints: 2024-05-10
print(d.year, d.month, d.day)      # prints: 2024 5 10
print(d.weekday())                 # prints: 4  (Monday is 0, so 4 is Friday)

moment = datetime(2024, 5, 10, 9, 30)    # adds hour and minute (second is optional)
print(moment)                      # prints: 2024-05-10 09:30:00
```

- ל-`date` יש רק יום בלוח השנה, ו-`datetime` מוסיף את השעה ביום.
- **timedelta** הוא משך זמן: `timedelta(days=3)`, `timedelta(weeks=2)`, `timedelta(hours=1, minutes=30)`.
- אפשר להוסיף timedelta ל-date או ל-datetime, ולחסר שני תאריכים כדי לקבל timedelta:

```python
print(d + timedelta(days=30))                 # prints: 2024-06-09
print((date(2024, 12, 25) - d).days)          # prints: 229
print(moment + timedelta(hours=2, minutes=45))   # prints: 2024-05-10 12:15:00
```

Python מכירה את לוח השנה: אורכי החודשים ושנים מעוברות מטופלים בשבילכם, ולכן `date(2024, 2, 28) + timedelta(days=2)` הוא 1 במרץ (ב-2024 יש 29 בפברואר).

## טקסט פנימה, טקסט החוצה

- `strftime(format)` הופכת תאריך לטקסט (האות **f** מציינת format): `d.strftime("%d/%m/%Y")` נותנת `10/05/2024`.
- `datetime.strptime(text, format)` הופכת טקסט ל-datetime (האות **p** מציינת parse). השתמשו אחר כך ב-`.date()` אם אתם רוצים רק את היום.
- `isoformat()` נותנת את התקן הבין-לאומי `2024-05-10`, שממוין נכון גם כטקסט.

קודי פורמט נפוצים: `%Y` שנה בארבע ספרות, `%m` מספר החודש, `%d` יום, `%H` שעה (24 שעות), `%M` דקה, `%S` שנייה, `%a` שם יום מקוצר, `%A` שם יום מלא, `%b` שם חודש מקוצר, `%B` שם חודש מלא.

## Enum: שמות לבחירות קבועות

**Enum** (מנייה) היא מחלקה שהחברים שלה הם קבוצה סגורה של קבועים בעלי שם:

```python
from enum import Enum, IntEnum

class Status(Enum):
    TODO = "todo"
    DONE = "done"

print(Status.DONE)            # prints: Status.DONE
print(Status.DONE.name)       # prints: DONE
print(Status.DONE.value)      # prints: done
print(Status("todo"))         # look up by value: Status.TODO
print(Status["DONE"])         # look up by name:  Status.DONE
print(list(Status))           # all members, in definition order
```

בהשוואה למחרוזות פשוטות, שגיאת כתיב כמו `Status.DNOE` זורקת `AttributeError` מיד, במקום להיות בשקט מחרוזת אחרת. חברי `IntEnum` הם גם מספרים שלמים אמיתיים, ולכן משווים וממיינים אותם לפי מספר: `Priority.HIGH > Priority.LOW` הוא `True`. השתמשו ב-`Enum` רגיל כשלסדר אין משמעות, והשוו חברים עם `==` או `is`.

> **שימו לב:**
> - ערבוב בין `date` ל-`datetime`: `date(2024, 5, 10) - datetime(2024, 5, 1)` זורק `TypeError: unsupported operand type(s) for -: 'datetime.date' and 'datetime.datetime'`. המירו עם `.date()`.
> - פורמט לא תואם ב-`strptime` זורק `ValueError: time data '10/05/2024' does not match format '%Y-%m-%d'`.
> - `timedelta(months=1)` לא קיים (`TypeError: ... unexpected keyword argument 'months'`) כי לחודשים יש אורכים שונים. חשבו חשבון חודשים בעצמכם או השתמשו בספרייה.
> - חיפוש ערך enum שלא קיים: `Status("finished")` זורק `ValueError: 'finished' is not a valid Status`.
> - ל-`datetime.now()` אין אזור זמן. באפליקציות אמיתיות שמשרתות כמה מדינות שומרים זמנים ב-UTC (`datetime.timezone.utc`).

## להמשך

הוסיפו `Status` לכל משימה והדפיסו רק את הפתוחות, או השתמשו ב-`date.fromisoformat("2024-05-10")` כדרך קצרה יותר לנתח את פורמט ISO. אפשר גם להשתמש ב-`enum.auto()` כדי למספר חברים אוטומטית.

> **תורכם:** הגדירו את `Priority` ואת `Status`, נתחו את שורות המשימות עם `strptime`, הדפיסו אותן ממוינות לפי תאריך יעד עם הניסוח של איחור, היום ומחר, ספרו את משימות ה-HIGH, וסיימו בחישובי ה-`timedelta` עבור תאריך הסקירה, יום ההשלמה (leap day) וסוף הפגישה.
