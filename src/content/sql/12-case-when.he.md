---
title: "CASE WHEN - ערכים מותנים"
summary: "צרו תוויות וקטגוריות עם לוגיקת אם-אז בתוך שאילתה."
hints:
  - "ל-SQL יש if / else if / else משלה, שעובד בתוך רשימת ה-SELECT ומחזיר ערך לכל שורה."
  - "הצורה היא CASE WHEN condition THEN value WHEN condition THEN value ELSE value END, ואחריה AS size. התנאים נבדקים מלמעלה למטה, והראשון שמתקיים מנצח."
  - "SELECT title, CASE WHEN credits >= 4 THEN 'big' WHEN credits = 3 THEN 'medium' ELSE 'small' END AS size FROM courses ORDER BY id;"
quiz:
  - q: "מה ביטוי CASE מייצר?"
    options: ["טבלה חדשה", "ערך אחד לכל שורה", "רשימה ממוינת"]
  - q: "אם כמה תנאי WHEN מתקיימים, באיזה משתמשים?"
    options: ["בראשון שמתקיים", "באחרון שמתקיים", "בכולם"]
  - q: "מה קורה כשאף WHEN לא מתאים ואין ELSE?"
    options: ["השורה מוסרת", "SQL מדווחת על שגיאה", "התוצאה היא NULL"]
  - q: "איזו מילת מפתח מסיימת ביטוי CASE?"
    options: ["STOP", "END", "ENDCASE"]
messages:
  - "השתמשו בביטוי CASE."
  - "הוסיפו ענפי WHEN ... THEN."
  - "הוסיפו ענף ELSE לכל השאר."
  - "סיימו את ה-CASE עם END."
---

בשפות תכנות יש `if ... else`. ב-SQL אותו רעיון חי בתוך שאילתות בתור הביטוי `CASE`. הוא מאפשר להפוך ערכים גולמיים לתוויות, לקבוצות או לדגלים: "עובר או נכשל", "קטן, בינוני או גדול", "בגיר או קטין".

## התחביר

```sql
CASE
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE other_result
END
```

- לכל `WHEN` יש תנאי, שנכתב בדיוק כמו בסעיף `WHERE`.
- `THEN` קובע באיזה ערך להשתמש כשהתנאי הזה מתקיים.
- `ELSE` הוא ברירת המחדל כשאף תנאי לא מתקיים. הוא אופציונלי, אבל בלעדיו שורות שלא התאימו מקבלות `NULL`.
- `END` סוגר את הביטוי. אל תשכחו אותו!

כל ה-`CASE ... END` מתנהג כערך בודד, ולכן אפשר לתת לו שם עם `AS`:

```sql
SELECT name,
       age,
       CASE
         WHEN age >= 23 THEN 'senior'
         WHEN age >= 20 THEN 'regular'
         ELSE 'junior'
       END AS level
FROM students;
```

```text
name | age | level
Ava | 21 | regular
Noam | 19 | junior
Maya | 23 | senior
...
```

## הסדר חשוב

התנאים נבדקים **מלמעלה למטה** והראשון שמתקיים מנצח. לכן הדוגמה למעלה יכולה לכתוב `age >= 20` בענף השני: מי שבן 23 ומעלה כבר נתפס בראשון. שימו קודם את הבדיקה הספציפית או המחמירה ביותר.

## טיפול ב-NULL

ערך חסר לעולם לא מקיים השוואה, ולכן הוא נופל אל `ELSE`. אם רוצים להתייחס לערכים חסרים באופן מיוחד, בדקו אותם קודם:

```sql
CASE
  WHEN city IS NULL THEN 'unknown'
  WHEN city = 'Haifa' THEN 'north'
  ELSE 'other'
END
```

למקרה הפשוט של החלפת `NULL` בערך ברירת מחדל יש פונקציה קצרה יותר: `COALESCE(city, 'unknown')`.

## CASE במקומות אחרים

`CASE` יכול להופיע כמעט בכל מקום שבו מותר ערך. הוא נפוץ ב-`ORDER BY` (סדר מיון מותאם אישית) וביחד עם פונקציות צבירה, למשל כדי לספור רק חלק מהשורות:

```sql
SELECT SUM(CASE WHEN age >= 21 THEN 1 ELSE 0 END) AS adults_21_plus
FROM students;
```

לכל סטודנט ה-`CASE` נותן 1 או 0, ו-`SUM` מחבר אותם, וכך סופר את הסטודנטים בני 21 ומעלה.

> **שימו לב:**
> - שכחת `END` גורמת ל-`near "FROM": syntax error`.
> - חסרון של `THEN` אחרי `WHEN` גורם ל-`near "WHEN": syntax error`.
> - ערבוב סוגים בענפים (חלק מספרים, חלק טקסט) עובד ב-SQLite אבל מקשה על השימוש בתוצאות. שמרו על אותו סוג.
> - תוצאות טקסט צריכות גרשיים בודדים: `THEN 'big'`. בלי גרשיים SQL מחפשת עמודה בשם `big`.

> **תורכם:** הציגו את `title` של כל קורס עם עמודה `size`: `big` ל-4 נקודות זכות ומעלה, `medium` ל-3 בדיוק, אחרת `small`, לפי סדר `id`.
