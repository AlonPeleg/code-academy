---
title: "פונקציות צבירה"
summary: "הפכו הרבה שורות למספר אחד עם COUNT, SUM, AVG, MIN ו-MAX."
hints:
  - "פונקציות צבירה מסתכלות על הרבה שורות ומחזירות ערך אחד. תנו לכל תוצאה שם עם AS כדי שהכותרות יתאימו."
  - "COUNT(*) סופר כל שורה, COUNT(grade) סופר רק שורות ש-grade בהן אינו NULL, ROUND(AVG(grade), 1) מעגל את הממוצע לספרה עשרונית אחת, ואז MAX(grade) ו-MIN(grade)."
  - "SELECT COUNT(*) AS enrollments, COUNT(grade) AS graded, ROUND(AVG(grade), 1) AS average, MAX(grade) AS best, MIN(grade) AS worst FROM enrollments;"
quiz:
  - q: "מה מחזיר COUNT(*) ?"
    options: ["את סכום העמודה", "את הערך הגדול ביותר", "את מספר השורות"]
  - q: "במה COUNT(grade) שונה מ-COUNT(*) ?"
    options: ["הוא מדלג על שורות ש-grade בהן הוא NULL", "הוא מחבר את הציונים", "אין שום הבדל"]
  - q: "איזו פונקציה נותנת את הממוצע של עמודה?"
    options: ["MEAN(col)", "AVG(col)", "AVERAGE(col)"]
  - q: "מה מחזיר  SELECT MAX(age) FROM students  ?"
    options: ["את הגיל של הסטודנט הצעיר ביותר", "את כל הגילים ממוינים", "שורה אחת עם הגיל הגבוה ביותר"]
messages:
  - "ספרו את כל השורות עם COUNT(*)."
  - "ספרו את השורות שיש בהן ציון עם COUNT(grade)."
  - "עגלו את AVG עם ROUND(..., 1)."
  - "השתמשו ב-MAX עבור הציון הטוב ביותר."
  - "השתמשו ב-MIN עבור הציון הנמוך ביותר."
---

עד עכשיו כל שורה בתוצאה הגיעה משורה אחת של טבלה. לעיתים קרובות רוצים במקום זה סיכום: כמה, בסך הכול כמה, מה הממוצע. **פונקציות צבירה** (aggregate functions) מסתכלות על הרבה שורות ומצמצמות אותן לערך יחיד.

## חמש פונקציות הצבירה העיקריות

| פונקציה | משמעות | דוגמה |
| --- | --- | --- |
| `COUNT(*)` | מספר השורות | `COUNT(*)` |
| `COUNT(col)` | מספר השורות ש-`col` בהן אינו `NULL` | `COUNT(city)` |
| `SUM(col)` | סכום | `SUM(credits)` |
| `AVG(col)` | ממוצע | `AVG(age)` |
| `MIN(col)` | הקטן ביותר | `MIN(age)` |
| `MAX(col)` | הגדול ביותר | `MAX(age)` |

```sql
SELECT COUNT(*) AS total_students, AVG(age) AS average_age
FROM students;
```

```text
total_students | average_age
7 | 21.142857142857142
```

שימו לב ששאילתה עם פונקציות צבירה וללא קיבוץ מחזירה בדיוק **שורה אחת**.

## NULL מתעלמים ממנו

פונקציות צבירה (חוץ מ-`COUNT(*)`) מדלגות על ערכי `NULL`. ה-`city` של Yael הוא `NULL`, ולכן:

```sql
SELECT COUNT(*) AS rows_total, COUNT(city) AS with_city
FROM students;
```

```text
rows_total | with_city
7 | 6
```

`COUNT(*)` סופר שורות, ו-`COUNT(city)` סופר שורות שיש בהן באמת עיר. אותו כלל חל על `AVG`: ציון חסר לא נחשב לאפס, הוא פשוט נשאר מחוץ לממוצע, וזה בדרך כלל מה שרוצים.

## עיגול וחשבון

`ROUND(value, digits)` מסדר עשרוניים ארוכים. אפשר גם לחשב עם פונקציות צבירה:

```sql
SELECT ROUND(AVG(age), 1) AS average_age,
       MAX(age) - MIN(age) AS age_range
FROM students;
```

## קודם מסננים, אחר כך מסכמים

`WHERE` רץ לפני פונקציית הצבירה, ולכן הסיכום מכסה רק את השורות שעברו את הסינון:

```sql
SELECT COUNT(*) AS in_haifa
FROM students
WHERE city = 'Haifa';
```

```text
in_haifa
2
```

## ספירת ערכים ייחודיים

`COUNT(DISTINCT col)` סופר כל ערך שונה פעם אחת:

```sql
SELECT COUNT(DISTINCT language) AS languages
FROM courses;     -- 4
```

> **שימו לב:**
> - ערבוב של עמודה רגילה עם פונקציית צבירה ללא `GROUP BY`, כמו `SELECT name, MAX(age) FROM students`, מסוכן: מסדי נתונים אחרים דוחים זאת עם שגיאה, ועל הערך של `name` אסור לסמוך. השיעורים הבאים מראים את הדרך הנכונה (`GROUP BY`).
> - שימוש בפונקציית צבירה ב-`WHERE`, כמו `WHERE AVG(age) > 20`, גורם ל-`misuse of aggregate function AVG()`. המשימה הזו שייכת ל-`HAVING`, שיבוא בקרוב.
> - `COUNT(*)` ו-`COUNT(col)` שונים בכל פעם שבעמודה יש `NULL`.
> - `AVG` של מספרים שלמים יכול לתת עשרוניים, ולכן השתמשו ב-`ROUND` בעת ההצגה.

> **תורכם:** כתבו שאילתה אחת על `enrollments` שמחזירה שורה בודדת עם העמודות `enrollments`, `graded`, `average` (מעוגל לספרה עשרונית אחת), `best` ו-`worst`.
