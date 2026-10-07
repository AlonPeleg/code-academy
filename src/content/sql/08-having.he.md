---
title: "HAVING - סינון קבוצות"
summary: "השאירו רק את הקבוצות שהסיכום שלהן עובר בדיקה."
hints:
  - "WHERE מסנן שורות בודדות לפני הקיבוץ, אבל כאן התנאי הוא על הממוצע של כל קבוצה, והוא קיים רק אחרי הקיבוץ."
  - "כתבו GROUP BY course_id, ומיד אחריו HAVING AVG(grade) >= 80, ואז ORDER BY לפי הממוצע בסדר יורד. ברשימת ה-SELECT השתמשו ב-COUNT(*) AS enrolled וב-ROUND(AVG(grade), 1) AS average."
  - "SELECT course_id, COUNT(*) AS enrolled, ROUND(AVG(grade), 1) AS average FROM enrollments GROUP BY course_id HAVING AVG(grade) >= 80 ORDER BY average DESC;"
quiz:
  - q: "מתי HAVING מופעל?"
    options: ["לפני שהשורות מקובצות", "אחרי שהקבוצות ופונקציות הצבירה שלהן חושבו", "רק כשאין GROUP BY"]
  - q: "איזו שאילתה נכונה?"
    options: ["SELECT city FROM students WHERE COUNT(*) > 1 GROUP BY city", "SELECT city FROM students GROUP BY city HAVING COUNT(*) > 1", "SELECT city FROM students HAVING COUNT(*) > 1 GROUP BY city"]
  - q: "מה ההבדל בין WHERE ל-HAVING?"
    options: ["WHERE מסנן קבוצות, HAVING מסנן שורות", "הם זהים", "WHERE מסנן שורות לפני הקיבוץ, HAVING מסנן קבוצות אחריו"]
  - q: "האם אפשר להשתמש ב-WHERE וב-HAVING באותה שאילתה?"
    options: ["כן, WHERE קודם ו-HAVING אחרי GROUP BY", "לא, רק באחד מהם", "רק אם בטבלה אין NULL"]
messages:
  - "קבצו את השורות לפי course_id."
  - "סננו את הקבוצות עם HAVING."
  - "השתמשו ב-AVG בתנאי של HAVING או ברשימת ה-SELECT."
---

אתם כבר יודעים ש-`WHERE` מסיר שורות. אבל מה אם הדבר שרוצים לבדוק הוא **סיכום**, למשל "ערים עם לפחות שני סטודנטים" או "קורסים שהציון הממוצע שלהם גבוה מ-80"? המספר הזה לא קיים עד שהקבוצות נוצרות, ולכן `WHERE` לא יכול לראות אותו. ל-SQL יש מסנן שני בדיוק בשביל זה, והוא נקרא `HAVING`.

## שני מסננים, שני רגעים

תחשבו על השאילתה כעל צינור (pipeline):

1. `FROM` בוחר את הטבלה.
2. `WHERE` זורק שורות בודדות.
3. `GROUP BY` יוצר קבוצות ומחשב את פונקציות הצבירה.
4. `HAVING` זורק קבוצות שלמות.
5. `SELECT`, ואחריו `ORDER BY` ו-`LIMIT`, מציגים וממיינים את מה שנשאר.

מכיוון ש-`WHERE` רץ לפני הקיבוץ, `WHERE COUNT(*) > 1` בלתי אפשרי ומוביל לשגיאה `misuse of aggregate function COUNT()`. הדרך הנכונה היא `HAVING`.

## דוגמה

ערים עם לפחות שני סטודנטים:

```sql
SELECT city, COUNT(*) AS students
FROM students
GROUP BY city
HAVING COUNT(*) >= 2;
```

```text
city | students
Haifa | 2
Tel Aviv | 2
```

`HAVING` נמצא אחרי `GROUP BY`, והתנאי שלו נכתב עם פונקציית צבירה, בדיוק כמו ברשימת ה-SELECT. ב-SQLite אפשר גם להשתמש בכינוי (`HAVING students >= 2`), אבל כתיבת פונקציית הצבירה המלאה עובדת בכל מקום.

## שימוש ב-WHERE וגם ב-HAVING

הם משתלבים יפה. כאן נספרים מלכתחילה רק סטודנטים בני 20 ומעלה (`WHERE`), ואחר כך שורדות רק ערים שיש בהן לפחות שני כאלה (`HAVING`):

```sql
SELECT city, COUNT(*) AS students
FROM students
WHERE age >= 20
GROUP BY city
HAVING COUNT(*) >= 2;
```

השתמשו ב-`WHERE` בכל פעם שהתנאי נוגע לשורה אחת, כי זה פשוט יותר ומאפשר למסד הנתונים לזרוק נתונים מוקדם. השתמשו ב-`HAVING` רק לתנאים על פונקציות צבירה.

## עוד תנאים שימושיים ב-HAVING

```sql
HAVING SUM(credits) > 6
HAVING MAX(grade) = 100
HAVING COUNT(*) BETWEEN 2 AND 5
```

> **שימו לב:**
> - `HAVING` לפני `GROUP BY` גורם ל-`near "GROUP": syntax error`. הסדר הוא `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`.
> - שימוש בפונקציית צבירה ב-`WHERE` גורם ל-`misuse of aggregate function`.
> - שימוש ב-`HAVING` לתנאי רגיל על שורה, כמו `HAVING age > 20`, מבלבל ועלול להיכשל. השתמשו ב-`WHERE`.
> - `AVG` מתעלם מערכי `NULL`, ולכן ציון חסר לא מוריד את הממוצע. עם זאת, `COUNT(*)` עדיין סופר את השורה הזו.

> **תורכם:** מהטבלה `enrollments`, קבצו לפי `course_id` והציגו את מספר ההרשמות ואת הציון הממוצע (ספרה עשרונית אחת), השאירו רק קורסים עם ממוצע של 80 ומעלה, הטוב ביותר ראשון.
