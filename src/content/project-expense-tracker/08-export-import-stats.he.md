---
title: "שלב 8: ייצוא, ייבוא וסטטיסטיקה"
summary: "מעבירים את הנתונים הלוך וחזור דרך CSV עם המודול csv, ומסיימים בסטטיסטיקות סיכום ובהדגמה מלאה."
hints:
  - "המודול csv כותב וקורא טקסט CSV נכון, כולל מרכאות סביב ערכים שמכילים פסיקים. הוא עובד על אובייקטים דמויי קובץ, ו-io.StringIO הוא קובץ שחי בזיכרון. כתיבה: DictWriter + writeheader + writerow. קריאה: DictReader מחזיר מילונים, אבל עם ערכי טקסט."
  - "to_csv: out = io.StringIO(); writer = csv.DictWriter(out, fieldnames=[\"date\", \"amount\", \"category\", \"note\"], lineterminator=\"\\n\"); writer.writeheader(); בלולאה writer.writerow(expense); return out.getvalue(). from_csv: for row in csv.DictReader(io.StringIO(text)): row[\"amount\"] = float(row[\"amount\"])."
  - "summary_stats: amounts = [e[\"amount\"] for e in expenses]; return {\"count\": len(amounts), \"mean\": statistics.mean(amounts), \"median\": statistics.median(amounts), \"largest\": max(expenses, key=lambda e: e[\"amount\"])}. שימו את ההדגמה בתוך def main(): וקראו ל-main() בשורה האחרונה ממש."
quiz:
  - q: "למה להשתמש במודול csv ולא ב-line.split(',') לכתיבה ולקריאה של CSV?"
    options: ["אסור להשתמש ב-split על קבצים", "csv מטפל נכון בערכים שמכילים פסיקים או מרכאות", "קובצי csv חייבים להיות בינאריים"]
  - q: "למה io.StringIO שימושי כאן?"
    options: ["הוא נותן אובייקט דמוי קובץ בזיכרון, ולכן לא צריך קובץ אמיתי", "הוא מצפין את הטקסט", "הוא קורא מהמקלדת"]
  - q: "למה from_csv ממירה את row['amount'] עם float()?"
    options: ["csv תמיד מחזיר כבר מספרים עשרוניים", "כל מה שנקרא מטקסט הוא מחרוזת, ואנחנו צריכים מספרים בשביל חישובים", "float() מסירה את המרכאות מההערה"]
messages:
  - "ייבאו את המודול csv."
  - "השתמשו ב-io.StringIO כקובץ בזיכרון."
  - "כתבו עם csv.DictWriter (או csv.writer)."
  - "קראו עם csv.DictReader (או csv.reader)."
  - "שימו את ההדגמה ב-def main():"
  - "חשבו את הממוצע (statistics.mean או sum / len)."
---
מעקב שמשכיח הכול כשהוא נסגר הוא לא באמת מעקב. בשלב האחרון הזה מוסיפים **ייצוא וייבוא** (export ו-import) עם המודול `csv`, **סטטיסטיקות סיכום**, וקושרים הכול יחד בפונקציה `main()`.

## איפה אנחנו עומדים

המעקב מפענח טקסט מבולגן להוצאות נקיות, מקבץ וממיין אותן, בודק תקציבים ומדפיס דוח מעוצב. כל הנתונים חיים רק בזיכרון.

## מה נוסיף

* `to_csv(expenses)`: ההוצאות כטקסט CSV, הפורמט שכל גיליון אלקטרוני יכול לפתוח.
* `from_csv(text)`: קוראת טקסט כזה בחזרה לרשימת מילונים.
* `summary_stats(expenses)`: כמות, ממוצע, חציון וההוצאה הגדולה ביותר.
* `main()`: כל התוכנית כפונקציה אחת, המבנה שסקריפטים אמיתיים משתמשים בו.

לפייתון בדפדפן אין קבצים ואין רשת, ולכן אנחנו משתמשים ב-`io.StringIO`, מאגר טקסט שמתנהג כמו קובץ אבל חי בזיכרון. קוד שנכתב בשבילו עובד בלי שינוי גם עם קובץ אמיתי שנפתח ב-`open(...)`, וזו הנקודה: אתם מתרגלים את ה-API האמיתי.

## CSV בשתי דקות

CSV פירושו "ערכים מופרדים בפסיקים" (comma separated values): שורת כותרת ואחריה רשומה אחת בכל שורה. כתיבה ידנית עם `",".join(...)` משתבשת ברגע שערך מכיל פסיק, כמו ההערה `pharmacy, vitamins`. המודול `csv` דואג ל**הוספת מרכאות** (`"pharmacy, vitamins"`) בכתיבה ולהסרתן בקריאה.

```python
import csv
import io

out = io.StringIO()
writer = csv.DictWriter(out, fieldnames=["date", "amount", "category", "note"], lineterminator="\n")
writer.writeheader()                  # writes the column names
writer.writerow(expense)              # one dict becomes one line
text = out.getvalue()                 # everything written so far, as a string
```

`DictWriter` מקבלת מילונים וכותבת את הערכים לפי הסדר של `fieldnames`. `lineterminator="\n"` שומר על סופי שורות פשוטים.

קריאה היא תמונת המראה:

```python
for row in csv.DictReader(io.StringIO(text)):
    print(row["category"])
```

`DictReader` משתמשת בשורת הכותרת כמפתחות ונותנת מילון אחד לכל שורה. **כל מה שהיא מחזירה הוא טקסט**, כולל הסכום, ולכן המירו אותו עם `float(row["amount"])` לפני שמשתמשים בו בחישובים.

## מדריך צעד אחר צעד

1. הוסיפו את הייבואים בראש הקובץ: `csv`, `io` ו-`statistics`.
2. כתבו את `to_csv` ואת `from_csv` כמו בסקיצה למעלה.
3. כתבו את `summary_stats`. החזירו `None` לרשימה ריקה. אחרת בנו רשימת סכומים עם comprehension, והחזירו מילון עם `count`, `mean` ו-`median` (`statistics.mean(amounts)`, `statistics.median(amounts)`) ו-`largest`. עבור הגדול ביותר השתמשו ב-`max` עם פונקציית מפתח: `max(expenses, key=lambda e: e["amount"])` מחזירה את כל מילון ההוצאה, לא רק את המספר.
4. עטפו את ההדגמה ב-`def main():` (הזיזו הכול פנימה) וקראו ל-`main()` בשורה האחרונה. למה? קוד ברמה העליונה של קובץ רץ ברגע שהקובץ מיובא; כשהוא בתוך פונקציה, קוד אחר יכול לייבא את הפונקציות שלכם בלי להריץ את ההדגמה, והמשתנים נשארים מקומיים.
5. הרחיבו את `main()` כמו שה-TODO מתאר: ייצוא, הדפסת שלוש שורות ה-CSV הראשונות, ייבוא חוזר, והדפסת `Round trip ok:` עם התוצאה של `restored == expenses`. מילונים ורשימות מושווים לפי ערך, ולכן זה `True` רק אם שום דבר לא אבד בדרך. אחר כך הדפיסו את שורות הסיכום.

**בדיקת הלוך וחזור** (round trip) כמו זו (ייצוא, ייבוא, השוואה) היא אחת הדרכים הפשוטות והיעילות ביותר להוכיח ששתי פונקציות מתאימות זו לזו.

## קריאת הסטטיסטיקות

ה**ממוצע** (mean) הוא הסכום חלקי הכמות. ה**חציון** (median) הוא הערך האמצעי אחרי מיון, ולכן קנייה ענקית אחת מזיזה את הממוצע הרבה אבל את החציון בקושי. כאן הממוצע (38.95) גבוה מהחציון (30.00) כי כמה חשבונות גדולים מושכים אותו למעלה. כשהשניים שונים מאוד, ההוצאות שלכם "גושיות".

> **שימו לב:**
> - `ValueError: could not convert string to float: 'amount'` אומרת שקראתם את שורת הכותרת כשורת נתונים (או שכתבתם את הקובץ בלי `writeheader`).
> - בלי `lineterminator="\n"` הכותב משתמש ב-`\r\n`, וההדפסה של ה-CSV מציגה שורות ריקות מיותרות או השוואות מוזרות.
> - אם שוכחים `float()` בדרך חזרה, `restored == expenses` הופך ל-`False`, כי `"12.5"` אינו `12.5`.
> - `NameError: name 'csv' is not defined`: חסר הייבוא.
> - `statistics.mean([])` זורקת `StatisticsError`, ובגלל זה `summary_stats` בודקת קודם אם הרשימה ריקה.

## מה לבנות הלאה

* קראו את טקסט היומן מ-`input()` (תיבת ה-stdin של השיעורים) כדי שתוכלו להקליד הוצאות חדשות.
* שמרו כסף כסנטים שלמים כדי להימנע מעיגול של מספרים עשרוניים.
* הפכו את `Expense` ל-`dataclass` במקום מילון והשוו בין שני הסגנונות.
* הוסיפו סיכומי קטגוריות לפי חודש כטבלה קטנה, או צרו עמודות עם `"#" * int(amount / 10)`.
* תנו ל-`BUDGETS` להגיע גם מטקסט CSV, עם פונקציה שמוודאת שהוא תקין.
* כתבו כמה בדיקות עם `assert parse_line("2025-03-04, 12.50, food, lunch")["amount"] == 12.5`.

> **תורכם:** הוסיפו `import csv`, `import io` ו-`import statistics`, כתבו את `to_csv`, `from_csv` ו-`summary_stats`, שימו את ההדגמה ב-`main()` וקראו לה. אחרי בדיקת התקציב הדפיסו את תצוגת ה-CSV המקדימה (`CSV export (first 3 lines):`), את `Round trip ok: True` ובלוק `Summary:` עם כמות ההוצאות, הממוצע, החציון וההוצאה הגדולה ביותר.
