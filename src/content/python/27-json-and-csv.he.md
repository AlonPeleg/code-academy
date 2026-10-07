---
title: "נתוני JSON ו-CSV"
summary: "מנתחים ובונים טקסט JSON ו-CSV עם המודולים json ו-csv, ומשתמשים ב-io.StringIO במקום בקבצים."
hints:
  - "csv.DictReader נותן כל שורה כמילון שהמפתחות שלו באים משורת הכותרת. json.dumps הופכת נתוני Python לטקסט, ו-json.loads הופכת טקסט חזרה לנתוני Python. שני כלי ה-csv קוראים וכותבים אובייקטים דמויי קובץ כמו io.StringIO."
  - "rows = [dict(r) for r in csv.DictReader(io.StringIO(raw))], ואז המירו את row['score'] עם int(). json.dumps(rows[0], indent=2, sort_keys=True). עבור ה-CSV: out = io.StringIO(); w = csv.writer(out, lineterminator='\\n'); w.writerow(['team', 'total']); ואז writerow אחד לכל קבוצה לפי הסדר האלפביתי."
  - "for row in rows: row['score'] = int(row['score'])   totals[row['team']] = totals.get(row['team'], 0) + row['score']   print(json.dumps(totals, sort_keys=True))   print(json.loads(json.dumps(rows)) == rows)   for team in sorted(totals): w.writerow([team, totals[team]])   print(out.getvalue(), end='')"
messages:
  - "קראו את הטקסט עם csv.DictReader."
  - "בנו את טקסט ה-JSON עם json.dumps."
  - "נתחו טקסט JSON עם json.loads."
  - "כתבו את ה-CSV עם csv.writer (או DictWriter)."
quiz:
  - q: "מה ההבדל בין json.dumps לבין json.loads?"
    options: ["dumps מנתחת טקסט לנתוני Python, ו-loads כותבת אותם", "dumps הופכת נתוני Python לטקסט JSON, ו-loads הופכת טקסט JSON לנתוני Python", "שתיהן עובדות רק על קבצים"]
    explain: "טריק זיכרון שימושי: האות s מייצגת string (מחרוזת). קיימות גם json.dump ו-json.load שעובדות עם אובייקטי קובץ."
  - q: "למה קיים המודול csv אם אפשר פשוט לקרוא ל-line.split(',')?"
    options: ["אסור להשתמש ב-split על טקסט", "הוא מטפל בשדות במרכאות כמו \"Lee, Jo\" שמכילים פסיקים", "הוא גורם למספרים להמיר את עצמם ל-int"]
  - q: "מה הטיפוס של row[\"score\"] מיד אחרי ש-csv.DictReader קרא את השורה  Ava,red,90 ?"
    options: ["int", "float", "str"]
    explain: "ל-CSV אין טיפוסים. הכול מגיע כטקסט ואתם ממירים בעצמכם."
  - q: "מה קורה לטאפל כמו  (1, 2)  אחרי מסע הלוך ושוב דרך JSON?"
    options: ["הוא חוזר כרשימה [1, 2]", "הוא חוזר כטאפל", "נזרקת שגיאה"]
---

שני פורמטים של טקסט נושאים את רוב הנתונים בעולם: **JSON** (נתונים מקוננים שמשמשים ממשקי API באינטרנט וקובצי הגדרות) ו-**CSV** (ערכים מופרדים בפסיקים, הפורמט של גיליונות אלקטרוניים). Python קוראת וכותבת את שניהם בעזרת הספרייה הסטנדרטית. בתוכניות אמיתיות הטקסט מגיע מקובץ או מבקשת רשת. בשיעור הזה נשמור אותו במחרוזת ונעטוף אותו ב-`io.StringIO`, שמתנהג כמו קובץ פתוח, כך שהכול עובד בדפדפן.

## JSON: הצורה של נתוני Python

JSON נראה כמעט כמו מילונים ורשימות של Python:

```python
import json

person = {"name": "Ava", "langs": ["python", "js"], "active": True, "boss": None}

text = json.dumps(person)
print(text)
# prints: {"name": "Ava", "langs": ["python", "js"], "active": true, "boss": null}

back = json.loads(text)
print(back["langs"][0])    # prints: python
```

- `json.dumps(data)` הופכת נתוני Python ל**מחרוזת** JSON (האות `s` פירושה string).
- `json.loads(text)` הופכת טקסט JSON לנתוני Python.
- `True`, `False` ו-`None` הופכים ל-`true`, `false` ו-`null`, ובחזרה.

אפשרויות שימושיות של `dumps`: `indent=2` לפלט קריא, `sort_keys=True` לסדר מפתחות יציב (מצוין להשוואת תוצאות ולבדיקות), ו-`ensure_ascii=False` כדי להשאיר אותיות שאינן באנגלית קריאות.

JSON מכיר רק מחרוזות, מספרים, ערכים בוליאניים, null, רשימות ואובייקטים עם **מפתחות מחרוזת**. לכן מסע הלוך ושוב לא תמיד משמר הכול: טאפל חוזר כרשימה, ו-`{1: "a"}` חוזר כ-`{"1": "a"}`. טיפוסים כמו `set` או `datetime` אי אפשר להמיר בכלל, והם זורקים `TypeError: Object of type set is not JSON serializable`.

## CSV: שורות ועמודות

```python
import csv, io

text = "name,score\nAva,90\nNoam,72\n"

for row in csv.reader(io.StringIO(text)):
    print(row)               # prints: ['name', 'score'] then ['Ava', '90'] ...

for row in csv.DictReader(io.StringIO(text)):
    print(row["name"], row["score"])      # uses the header line as keys
```

- `csv.reader` מחזירה כל שורה כרשימה של מחרוזות.
- `csv.DictReader` משתמשת בשורה הראשונה כמפתחות, כך שכותבים `row["name"]` במקום `row[0]`.
- **כל ערך הוא מחרוזת.** `"90"` אינו `90`, ולכן ממירים עם `int()` או `float()`.
- המודול מבין מרכאות: בשורה `"Lee, Jo",blue,60` יש שלושה שדות, כי הפסיק שבתוך המרכאות שייך לשם. בגלל זה לא כדאי להשתמש ב-`line.split(",")` עבור CSV אמיתי.

## כתיבת CSV

```python
out = io.StringIO()
writer = csv.writer(out, lineterminator="\n")
writer.writerow(["team", "total"])
writer.writerow(["red", 175])
print(out.getvalue())
```

`csv.writer(stream)` מוסיפה מרכאות רק איפה שצריך. כברירת מחדל היא מסיימת שורות ב-`\r\n` (הסגנון של Windows, כפי שתקן ה-CSV קובע). העברת `lineterminator="\n"` נותנת שורות חדשות פשוטות, שקל יותר להשוות בבדיקות. `out.getvalue()` מחזירה את כל מה שנכתב עד כה. עבור מילונים יש את `csv.DictWriter(stream, fieldnames=[...])` עם `writeheader()` ו-`writerow(dict)`.

> **שימו לב:**
> - חישוב על ערכי CSV בלי להמיר: `"90" + "85"` נותן `"9085"`, ו-`"90" + 1` זורק `TypeError: can only concatenate str (not "int") to str`.
> - העברת **מחרוזת** ל-`csv.reader` במקום זרם (stream): אז הוא עובר על תווים בודדים. עטפו את הטקסט ב-`io.StringIO(text)` או השתמשו ב-`text.splitlines()`.
> - בלבול בין `dumps` ל-`dump`: הקריאה `json.dump(data)` בלי אובייקט קובץ נכשלת עם `TypeError: dump() missing 1 required positional argument: 'fp'`.
> - JSON לא תקין, למשל גרשיים בודדים סביב מפתח, זורק `json.JSONDecodeError: Expecting property name enclosed in double quotes`. תפסו אותו עם `try/except ValueError`, כי השגיאה היא תת-מחלקה של `ValueError`.
> - אחרי `getvalue()` ה-`print` הנוסף מוסיף עוד שורה ריקה. השתמשו ב-`print(text, end="")` כשהטקסט כבר נגמר בשורה חדשה.

## להמשך

הדפיסו את כל הרשימה `rows` בעיצוב יפה עם `indent=2`, או כתבו את השורות חזרה ל-CSV עם `csv.DictWriter` והשוו את הטקסט ל-`raw`. שימו לב שהשם `"Lee, Jo"` מקבל את המרכאות שלו בחזרה אוטומטית.

> **תורכם:** קראו את `raw` עם `csv.DictReader`, המירו את הציונים, הדפיסו את השורה הראשונה כ-JSON מוזח וממוין, חברו את הציונים לפי קבוצה, בדקו את המסע הלוך ושוב דרך JSON, וכתבו את הסכומים כ-CSV לתוך `StringIO`.
