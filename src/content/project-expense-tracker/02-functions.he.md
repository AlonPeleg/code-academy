---
title: "שלב 2: הוספה והצגה של הוצאות עם פונקציות"
summary: "עוטפים את הקוד משלב 1 בפונקציות add_expense, list_expenses ו-total_spent."
hints:
  - "פונקציה היא מתכון עם שם: def name(parameters): ... שימו את בניית המילון וה-append בתוך add_expense, את לולאת ההדפסה בתוך list_expenses, ואת החיבור בתוך total_spent (שמחזירה את הסכום ולא מדפיסה אותו)."
  - "add_expense בונה {\"date\": date, \"amount\": amount, \"category\": category, \"note\": note}, מוסיפה אותו עם append ומחזירה אותו. list_expenses משתמשת ב-for number, expense in enumerate(expenses, start=1) ומדפיסה f\"{number}. ...\"."
  - "def total_spent(expenses): total = 0; for expense in expenses: total += expense[\"amount\"]; return total   ובתוכנית הראשית: expenses = []; for row in SAMPLE: add_expense(expenses, *row); list_expenses(expenses); print(f\"Total spent: {total_spent(expenses):.2f}\")"
quiz:
  - q: "מה ההבדל בין print ל-return בתוך פונקציה?"
    options: ["אין הבדל", "print מציגה טקסט על המסך, ו-return מחזירה ערך למי שקרא לפונקציה", "return מציגה טקסט, ו-print שומרת אותו"]
  - q: "מה המשמעות של note=\"\" ב-def add_expense(expenses, date, amount, category, note=\"\")?"
    options: ["note הוא חובה וחייב להיות מחרוזת ריקה", "note הוא אופציונלי, והוא \"\" כשהקורא משמיט אותו", "note הוא תמיד מחרוזת ריקה"]
  - q: "מה enumerate(items, start=1) נותנת לכם?"
    options: ["זוגות של (מספר, פריט) עם ספירה שמתחילה ב-1", "את הפריטים בסדר הפוך", "רק את הפריט הראשון"]
messages:
  - "ממספרים את השורות עם enumerate(expenses, start=1)."
  - "add_expense צריכה להחזיר את המילון שהיא יצרה."
  - "מוסיפים את שורות הדוגמה עם add_expense(expenses, *row)."
---
תוכנית שחוזרת שוב ושוב על אותו קוד קשה לשינוי. בשלב הזה תהפכו את הקוד הפרוע משלב 1 ל**פונקציות** (functions), כלים קטנים עם שם שאפשר לקרוא להם שוב ושוב.

## איפה אנחנו עומדים

בשלב 1 שמרנו שלוש הוצאות ברשימה של מילונים והדפסנו אותן עם סכום כולל. הכול יושב בסקריפט ארוך אחד, והוספת הוצאה פירושה העתקה של שורת `append` שלמה עם ארבעה מפתחות. קוד ההתחלה עדיין מכיל את הקוד משלב 1 בתחתית.

## מה נוסיף

שלוש פונקציות שמהוות את הלב של המעקב:

* `add_expense(...)` יוצרת מילון הוצאה אחד, מוסיפה אותו לרשימה ומחזירה אותו.
* `list_expenses(...)` מדפיסה רשימה ממוספרת.
* `total_spent(...)` מחזירה את סכום כל הסכומים.

למה זה חשוב: באפליקציה אמיתית, התכונה "הוספת הוצאה" משמשת טופס, ייבוא מקובץ ובדיקה, וכולם קוראים לאותה פונקציה. מתקנים באג פעם אחת וכל מי שקורא לפונקציה נהנה. פונקציות גם נותנות שמות לרעיונות, כך שהתוכנית הראשית נקראת כמו סיפור.

## מדריך צעד אחר צעד

1. **פונקציה עם פרמטרים.** פונקציה מוגדרת עם `def`, שם ופרמטרים (parameters) בסוגריים:

```python
def add_expense(expenses, date, amount, category, note=""):
    expense = {"date": date, "amount": amount, "category": category, "note": note}
    ...
```

   `note=""` הוא **ערך ברירת מחדל**: הקוראים יכולים להשמיט את ההערה ולקבל מחרוזת ריקה. פרמטרים עם ערך ברירת מחדל חייבים לבוא אחרונים.
2. **משלימים את `add_expense`.** מוסיפים את המילון החדש ל-`expenses` עם append ועושים `return expense`. החזרה שלו מאפשרת לקורא להשתמש בהוצאה החדשה מיד. שימו לב שהפונקציה משנה את הרשימה שהועברה אליה (רשימות משותפות ולא מועתקות), ולכן אין צורך להחזיר את הרשימה.
3. **`list_expenses` עם `enumerate`.** כדי למספר שורות החל מ-1 משתמשים ב-`enumerate`:

```python
for number, expense in enumerate(expenses, start=1):
    print(f"{number}. {expense['date']} | ...")
```

   `enumerate` נותנת לכם זוגות של `(number, item)`. בלי `start=1` הספירה הייתה מתחילה ב-0. השורה הצפויה היא `1. 2025-02-03 | food | 12.50 | lunch`.
4. **`total_spent` מחזירה ולא מדפיסה.** אפשר להשתמש בפונקציה שמחזירה ערך בכל ביטוי, למשל בתוך f-string. פונקציה שמדפיסה אפשר רק לקרוא בעיניים. לכן:

```python
def total_spent(expenses):
    total = 0
    for expense in expenses:
        total += expense["amount"]
    return total
```

5. **משתמשים בהן.** קוד ההתחלה מספק את `SAMPLE`, רשימה של טפלים (tuples) עם עשר הוצאות. החליפו את הקוד הישן משלב 1 ברשימה ריקה ובלולאה. כוכבית לפני טאפל **מפרקת** אותו לארגומנטים נפרדים:

```python
for row in SAMPLE:
    add_expense(expenses, *row)    # same as add_expense(expenses, row[0], row[1], row[2], row[3])
```

   סיימו עם `list_expenses(expenses)` ועם `print(f"Total spent: {total_spent(expenses):.2f}")`.

## למה `expenses` הוא פרמטר

שימו לב שהפונקציות מקבלות את הרשימה במקום להשתמש במשתנה גלובלי. כך קל לבדוק אותן עם רשימה קטנה, ואפשר להשתמש בהן שוב עם כמה רשימות (נניח, אחת לכל בן משפחה).

> **שימו לב:**
> - `TypeError: add_expense() missing 1 required positional argument: 'category'` אומרת שהעברתם מעט מדי ערכים. ספרו את הארגומנטים.
> - פונקציה בלי `return` מחזירה `None`. אם `total_spent` מדפיסה `None` בפלט, שכחתם `return`.
> - `return` מסיימת את הפונקציה מיד. אם תשימו אותה בתוך הלולאה, רק הסכום הראשון יתווסף.
> - הגדרת פונקציה לא מריצה אותה. שום דבר לא קורה עד שקוראים לה עם סוגריים.
> - אם משאירים את הקוד הישן משלב 1 במקומו, גם השורות הישנות מודפסות, והפלט לא יתאים.

> **תורכם:** כתבו את `add_expense`, `list_expenses` ו-`total_spent`, ואז החליפו את הקוד משלב 1 ברשימה ריקה, בלולאה שקוראת ל-`add_expense(expenses, *row)` עבור כל שורה ב-`SAMPLE`, בקריאה ל-`list_expenses`, ובשורה `Total spent: 388.45`.
