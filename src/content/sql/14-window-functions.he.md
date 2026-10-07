---
title: "פונקציות חלון"
summary: "דרגו שורות וחשבו סכומים מצטברים או לכל קבוצה בלי לכווץ את השורות."
hints:
  - "פונקציית חלון מסתכלת על 'חלון' של שורות קשורות אבל שומרת כל שורה בתוצאה. את החלון מתארים ב-OVER (...). PARTITION BY מפצל את השורות לקבוצות, ו-ORDER BY בתוך OVER קובע את הסדר שבו משתמש הדירוג."
  - "הוסיפו שתי עמודות לרשימת ה-SELECT: RANK() OVER (PARTITION BY c.id ORDER BY e.grade DESC) AS place, ו-ROUND(AVG(e.grade) OVER (PARTITION BY c.id), 1) AS course_avg. אחר כך שנו את ה-ORDER BY האחרון ל-c.id, place."
  - "SELECT c.title, s.name, e.grade, RANK() OVER (PARTITION BY c.id ORDER BY e.grade DESC) AS place, ROUND(AVG(e.grade) OVER (PARTITION BY c.id), 1) AS course_avg FROM enrollments AS e JOIN students AS s ON s.id = e.student_id JOIN courses AS c ON c.id = e.course_id WHERE e.grade IS NOT NULL ORDER BY c.id, place;"
quiz:
  - q: "מה ההבדל העיקרי בין GROUP BY עם AVG לבין AVG(...) OVER (...)?"
    options: ["GROUP BY שומר כל שורה, OVER מכווץ אותן", "OVER שומר כל שורה ומוסיף לכל אחת את הערך המחושב, ו-GROUP BY מכווץ שורות לשורה אחת לכל קבוצה", "אין הבדל"]
  - q: "מה PARTITION BY עושה בתוך OVER?"
    options: ["מפצל את השורות לקבוצות נפרדות, והחישוב מתחיל מחדש בכל קבוצה", "ממיין את התוצאה הסופית", "מוחק שורות כפולות"]
  - q: "שלושה סטודנטים מתקבלים באותו מקום ראשון. איזה מספר RANK() נותן לסטודנט הבא?"
    options: ["2", "1", "4"]
    explain: "RANK משאיר פער אחרי שוויון (1, 1, 1, 4). DENSE_RANK היה נותן 2, ו-ROW_NUMBER ממספר כל שורה 1, 2, 3, 4 גם כשיש שוויון."
  - q: "איזה ביטוי מוסיף סכום מצטבר?"
    options: ["SUM(x) OVER (ORDER BY y)", "SUM(x) GROUP BY y", "TOTAL(x) OVER y"]
messages:
  - "הוסיפו עמודת דירוג עם RANK() OVER (...)."
  - "התחילו את הדירוג מחדש לכל קורס עם PARTITION BY."
  - "הוסיפו את ממוצע הקורס עם AVG(grade) OVER (PARTITION BY ...)."
---

אתם כבר מכירים את `GROUP BY`: הוא מכווץ הרבה שורות לשורה אחת לכל קבוצה. זה נהדר לסכומים, אבל מה אם רוצים **לשמור כל שורה** וגם להראות איך היא משתווה לקבוצה שלה, למשל "הציון של הסטודנט, ולידו ממוצע הקורס", או "דירוג בתוך הקורס"? ערבוב של זה עם `GROUP BY` הופך מהר לתתי-שאילתות מסובכות. **פונקציות חלון** (window functions) פותרות את זה: הן מחשבות על קבוצת שורות, אבל שומרות את השורות.

## הצורה: function OVER (...)

```sql
SELECT name, age,
       AVG(age) OVER () AS average_age
FROM students;
```

החלק שאחרי `OVER` מתאר את ה**חלון**: על אילו שורות הפונקציה רשאית להסתכל. `OVER ()` ריק פירושו "כל השורות". לכל שורת סטודנט יש עכשיו עמודה נוספת שמחזיקה את הגיל הממוצע של כולם, ושום שורה לא נעלמה.

## PARTITION BY: חלון אחד לכל קבוצה

`PARTITION BY` מפצל את השורות לקבוצות (כמו ש-`GROUP BY` היה עושה) אבל לא מכווץ אותן:

```sql
SELECT name, city, age,
       AVG(age) OVER (PARTITION BY city) AS city_average
FROM students;
```

כל סטודנט מקבל את הגיל הממוצע של העיר שלו.

## פונקציות דירוג

הוסיפו `ORDER BY` בתוך `OVER` ואפשר למספר את השורות:

```sql
SELECT name, age,
       RANK()       OVER (ORDER BY age) AS rank_,
       DENSE_RANK() OVER (ORDER BY age) AS dense
FROM students
ORDER BY age;
```

| name | age | rank_ | dense |
| --- | --- | --- | --- |
| Noam | 19 | 1 | 1 |
| Dana | 19 | 1 | 1 |
| Omer | 20 | 3 | 2 |
| Ava | 21 | 4 | 3 |

- `ROW_NUMBER()` נותן לכל שורה מספר ייחודי 1, 2, 3, ... שורות בשוויון ממוספרות בסדר שרירותי, ולכן הוסיפו שובר שוויון כמו `ORDER BY age, id` אם הסדר חשוב.
- `RANK()` נותן לשורות בשוויון אותו מספר ואז **מדלג**: 1, 1, 3.
- `DENSE_RANK()` נותן לשורות בשוויון אותו מספר ו**לא** מדלג: 1, 1, 2.

יחד עם `PARTITION BY` זה עונה על שאלות כמו "שלושת הציונים הגבוהים בכל קורס": מדרגים בתוך תת-שאילתה, ואז מסננים `WHERE place <= 3` בחוץ (אי אפשר להשתמש בפונקציית חלון ישירות ב-`WHERE`).

## סכומים מצטברים

עם `SUM` ו-`ORDER BY` בתוך החלון, הערך גדל משורה לשורה:

```sql
SELECT course_id, grade,
       SUM(grade) OVER (ORDER BY course_id) AS running_total
FROM enrollments
WHERE student_id = 1;
```

עבור סטודנט 1 (ציונים 90, 85, 91) הסכומים המצטברים הם 90, 175, 266. פונקציה שימושית נוספת היא `LAG(column) OVER (ORDER BY ...)`, שמסתכלת על השורה הקודמת, ושימושית ל"ההפרש מהשורה הקודמת".

## סדר הפעולות

פונקציית חלון רצה **אחרי** `WHERE`, `GROUP BY` ו-`HAVING`, רגע לפני ה-`ORDER BY` הסופי. לכן התרגיל מסנן קודם את ציוני ה-`NULL` עם `WHERE` רגיל, ולכן אי אפשר לכתוב `WHERE place = 1`.

> **שימו לב:**
> - הצבת פונקציית חלון ב-`WHERE`: `misuse of window function RANK()`. שימו אותה בתת-שאילתה או ב-CTE וסננו בחוץ.
> - שכחת `OVER` אחרי פונקציית דירוג: `RANK()` לבדה גורמת לאותה שגיאה, `misuse of window function rank()`.
> - שימוש ב-`ORDER BY` בתוך `OVER` וציפייה שהפלט הסופי יהיה ממוין. מיון הפלט עדיין דורש `ORDER BY` משלו בסוף.
> - ערכי `NULL` ממוינים ראשונים בסדר עולה. אם מדרגים עמודה שיכולה להיות `NULL`, הריקים עלולים לבוא ראשונים; סננו אותם החוצה, או מיינו בסדר יורד.
> - `PARTITION BY` אינו `GROUP BY`: השורות נשארות, ולכן ייתכן שתראו את אותו מספר חוזר בהרבה שורות.

> **תורכם:** הרחיבו את השאילתה כך שתציג גם `place` (`RANK() OVER (PARTITION BY c.id ORDER BY e.grade DESC)`) וגם `course_avg` (ממוצע הציונים המעוגל של הקורס בכל שורה), ומיינו את התוצאה לפי מזהה הקורס ואחר כך לפי place.
