---
title: "קלט/פלט דמוי קובץ וניתוח טקסט"
summary: "מתייחסים למחרוזת כמו לקובץ עם io.StringIO, ומנתחים שורות נתונים למספרים."
hints:
  - "io.StringIO עוטפת מחרוזת כך שהיא מתנהגת כמו קובץ פתוח. אפשר לעבור על קובץ עם for line in stream, וכל שורה עדיין מסתיימת בתו ירידת שורה."
  - "stream = io.StringIO(data), ואז for line in stream: name, score = line.strip().split(','). המירו עם int(score), הוסיפו אותו לסכום, הוסיפו 1 למונה, והשוו אותו לציון הטוב ביותר עד כה."
  - "stream = io.StringIO(data); total = 0; count = 0; best = None   for line in stream: name, score = line.strip().split(','); score = int(score); total += score; count += 1; if best is None or score > best[1]: best = (name, score)   print(f\"Average: {total / count:.2f}\")"
quiz:
  - q: "למה io.StringIO שימושית?"
    options: ["היא קוראת קבצים מהדיסק הקשיח", "היא נותנת למחרוזת את אותו ממשק של קובץ פתוח, כך שקוד שקורא קבצים עובד על טקסט שנמצא בזיכרון", "היא מורידה טקסט מהאינטרנט"]
  - q: "איך נראית שורה שנקראה מ-stream?"
    options: ["היא אף פעם לא מכילה תו ירידת שורה", "היא רשימה של מילים", "היא בדרך כלל מסתיימת בתו ירידת שורה, ולכן קוראים הרבה פעמים ל-.strip()"]
  - q: "איזו קריאה מחזירה את כל מה שנכתב עד עכשיו ל-StringIO שכתבתם אליו?"
    options: ["out.getvalue()", "out.read_all()", "out.text"]
  - q: "מה מחזירה 'Ava,90'.split(',')?"
    options: ["'Ava90'", "['Ava', '90']", "('Ava', 90)"]
    explain: "split מחזירה רשימה של מחרוזות. הציון נשאר טקסט עד שקוראים עליו ל-int()."
messages:
  - "צרו את הזרם עם io.StringIO(data)."
  - "פצלו כל שורה עם .split(',')."
  - "עברו על הזרם עם לולאת for."
---

תוכניות אמיתיות קוראות נתונים מקבצים, מחיבורי רשת וצינורות (pipes). ב-Python שרצה בדפדפן הזה אין דיסק לקרוא ממנו, אבל ל-Python יש טריק נחמד: **אובייקטים דמויי קובץ** (file-like objects). המודול `io` מספק את `StringIO`, אובייקט ששומר טקסט בזיכרון אבל מתנהג בדיוק כמו קובץ שפתחתם. קוד שנכתב בשביל קבצים עובד אז על כל מחרוזת, וכך גם אנשי מקצוע בודקים קוד שקורא קבצים בלי לגעת בדיסק.

## מחרוזת שמתנהגת כמו קובץ

```python
import io

text = "first\nsecond\nthird\n"
stream = io.StringIO(text)

print(stream.readline())   # prints: first   (plus the newline)
print(stream.read())       # the rest: second and third
```

לזרם (stream) יש **מיקום** (position), כמו סימנייה. `readline()` מחזירה את השורה הבאה ומזיזה את הסימנייה, ו-`read()` מחזירה הכול מהסימנייה ועד הסוף. אחר כך הסימנייה נמצאת בסוף, ולכן `read()` שנייה מחזירה מחרוזת ריקה `''`. קראו ל-`stream.seek(0)` כדי לקפוץ חזרה להתחלה.

## מעבר על שורות

הדרך הנפוצה ביותר להשתמש בזרם היא לולאת `for`, שנותנת שורה אחת בכל פעם:

```python
for line in io.StringIO("a\nb\nc\n"):
    print(line.strip())    # strip() removes the trailing newline
```

כל שורה שומרת את ה-`\n` שבסופה, ולכן `.strip()` הוא כמעט תמיד הדבר הראשון שעושים.

## ניתוח שורה

**ניתוח** (parsing) הוא הפיכת טקסט גולמי לערכים מובנים. עבור נתונים מופרדים בפסיקים המתכון הוא: strip, split, המרה.

```python
line = "Ava,90\n"
name, score = line.strip().split(",")   # name = 'Ava', score = '90'
score = int(score)                       # now it is a number: 90
```

`split(",")` מחזירה רשימה של מחרוזות, והכתיבה `name, score = ...` מפרקת את שני הפריטים לשני משתנים. כל מה שמגיע מטקסט הוא מחרוזת, ולכן יש להמיר מספרים עם `int()` או `float()` לפני שעושים חישובים.

## כתיבה לזרם

StringIO יכול גם לאסוף פלט. ל-`print` יש ארגומנט `file=`, כך שאפשר להפנות אליו את ההדפסה:

```python
out = io.StringIO()
print("hello", file=out)
out.write("world\n")
print(repr(out.getvalue()))   # prints: 'hello\nworld\n'
```

`getvalue()` מחזירה את כל מה שנכתב עד עכשיו. זה שימושי כדי לבנות דוח כטקסט לפני שמציגים או שומרים אותו.

## למה זה חשוב

פונקציה שמקבלת "כל דבר דמוי קובץ" היא גמישה: היום נותנים לה StringIO בבדיקה, מחר קובץ אמיתי שנפתח עם `open("data.csv")`, והפונקציה לא משתנה. בהמשך תכירו את המודול `csv`, שגם הוא מקבל אובייקטים דמויי קובץ. `csv.reader(io.StringIO(data))` מטפל בשבילכם במרכאות ובפסיקים שבתוך שדות.

> **שימו לב:**
> - אם שוכחים `.strip()`: הציון הוא `'90\n'`. הפקודה `int('90\n')` אמנם עובדת, אבל השוואה או הדפסה של שמות יראו שורות ריקות מיותרות.
> - אם שוכחים `int()`: הביטוי `'90' > '100'` משווה טקסט והוא `True`. מספרים שנקראו מטקסט חייבים לעבור המרה.
> - שורה ריקה בסוף הנתונים גורמת ל-`split(",")` להחזיר פריט אחד, והפירוק נכשל עם `ValueError: not enough values to unpack (expected 2, got 1)`. דלגו על שורות ריקות עם `if not line.strip(): continue`.
> - קריאה של זרם פעמיים: `read()` השנייה מחזירה `''` כי הסימנייה בסוף. השתמשו ב-`seek(0)`.
> - `io.StringIO(data)` צריכה טקסט. העברת בתים (bytes) זורקת `TypeError: initial_value must be str or None, not bytes`.

## להמשיך הלאה

נסו `csv.reader(io.StringIO(data))` והדפיסו כל שורה, או הוסיפו שורת כותרת `name,score` ודלגו עליה עם `next(stream)` לפני הלולאה.

> **תורכם:** צרו זרם מתוך `data` עם `io.StringIO`, עברו על השורות שלו בלולאה, פצלו כל אחת בפסיק והמירו את הציון ל-int. הדפיסו את מספר התלמידים, את הממוצע עם שתי ספרות אחרי הנקודה ואת התלמיד הטוב ביותר, כפי שמופיע בהערות.
