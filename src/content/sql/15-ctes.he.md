---
title: "CTEs: ‏WITH ושאילתות רקורסיביות"
summary: "תנו שם לתוצאת ביניים עם WITH כדי שהשאילתות יהיו קריאות, וצרו או סרקו נתונים עם WITH RECURSIVE."
hints:
  - "CTE הוא תוצאה זמנית בעלת שם: WITH name AS (query). CTE רקורסיבי כולל SELECT התחלתי, UNION ALL, ו-SELECT שקורא מה-CTE עצמו, עם WHERE שעוצר אותו. כמה CTEs מופרדים בפסיקים, עם WITH אחד בלבד."
  - "WITH RECURSIVE levels(credits) AS ( SELECT 1 UNION ALL SELECT credits + 1 FROM levels WHERE credits < 5 ), counts AS ( SELECT credits, COUNT(*) AS n FROM courses GROUP BY credits ) ואז SELECT רגיל שמחבר ביניהם."
  - "WITH RECURSIVE levels(credits) AS (SELECT 1 UNION ALL SELECT credits + 1 FROM levels WHERE credits < 5), counts AS (SELECT credits, COUNT(*) AS n FROM courses GROUP BY credits) SELECT l.credits, COALESCE(c.n, 0) AS courses FROM levels AS l LEFT JOIN counts AS c ON c.credits = l.credits ORDER BY l.credits;"
quiz:
  - q: "מהו CTE (‏WITH ... AS)?"
    options: ["טבלה קבועה שנשמרת במסד הנתונים", "סוג של אינדקס", "תוצאה זמנית בעלת שם שקיימת רק עבור הפקודה האחת שהיא שייכת אליה"]
  - q: "מה עוצר CTE רקורסיבי מלרוץ לנצח?"
    options: ["תנאי ב-SELECT החוזר שלו, כמו WHERE credits < 5, שבסופו של דבר לא מפיק שורות חדשות", "SQLite עוצרת אותו אחרי 10 סבבים", "מילת המפתח UNION ALL"]
  - q: "מה COALESCE(n, 0) מחזיר?"
    options: ["תמיד 0", "את n, או 0 כש-n הוא NULL", "את הגדול מבין n ו-0"]
  - q: "למה להשתמש ב-CTE ולא בתת-שאילתה ב-FROM?"
    options: ["זה תמיד מהיר יותר", "תתי-שאילתות אסורות ב-SQLite", "זה נותן לשלב שם, אפשר להשתמש בו כמה פעמים, וקוראים אותו מלמעלה למטה"]
messages:
  - "התחילו עם  WITH RECURSIVE levels(credits) AS (...)."
  - "חברו את שורת ההתחלה ואת השורה החוזרת עם UNION ALL."
  - "השתמשו ב-LEFT JOIN כדי שערכי נקודות זכות ללא קורסים יישמרו."
  - "הפכו NULL ל-0 עם COALESCE(n, 0)."
---

שאילתות נוטות לגדול: תת-שאילתה בתוך תת-שאילתה בתוך join, עד שאף אחד לא מצליח לקרוא אותן. **ביטוי טבלה משותף** (Common Table Expression, או בקיצור CTE) מאפשר לתת לתוצאת ביניים **שם**, להגדיר אותה קודם, ואז להשתמש בה כמו בטבלה. כך שאילתות ארוכות נקראות מלמעלה למטה כמו מתכון.

## CTE בסיסי

```sql
WITH per_student AS (
  SELECT student_id,
         ROUND(AVG(grade), 1) AS avg_grade
  FROM enrollments
  GROUP BY student_id
)
SELECT s.name, p.avg_grade
FROM per_student AS p
JOIN students AS s ON s.id = p.student_id
ORDER BY p.avg_grade DESC;
```

1. `WITH per_student AS ( ... )` מגדיר טבלה זמנית בשם `per_student`. השאילתה שלה כתובה בתוך הסוגריים.
2. ה-`SELECT` הראשי שאחריו משתמש ב-`per_student` בדיוק כמו בטבלה אמיתית.
3. היא קיימת רק עבור הפקודה האחת הזו. שום דבר לא נשמר במסד הנתונים.

אפשר להגדיר כמה CTEs עם `WITH` אחד, מופרדים בפסיקים, וההגדרות המאוחרות יותר יכולות להשתמש במוקדמות:

```sql
WITH
  per_student AS (SELECT student_id, AVG(grade) AS avg_grade FROM enrollments GROUP BY student_id),
  overall     AS (SELECT AVG(avg_grade) AS typical FROM per_student)
SELECT student_id FROM per_student, overall WHERE avg_grade > typical;
```

היתרונות הגדולים על פני תת-שאילתה מקוננת: לשלב יש **שם**, אפשר להשתמש בו **יותר מפעם אחת**, וקוראים את ההיגיון בסדר שבו הוא קורה.

## CTEs רקורסיביים

CTE יכול להתייחס ל**עצמו**. כך SQL חוזרת על פעולה, עוברת על עץ (תרשים ארגוני, תיקיות בתוך תיקיות) או יוצרת סדרת מספרים:

```sql
WITH RECURSIVE countdown(n) AS (
  SELECT 3                                   -- 1. the starting row(s)
  UNION ALL
  SELECT n - 1 FROM countdown WHERE n > 1    -- 2. the repeating step
)
SELECT n FROM countdown;
```

```
n
3
2
1
```

איך זה עובד, בשלבים פשוטים:

1. SQL מריצה קודם את החלק **ההתחלתי**. זה נותן את השורה `3`.
2. אחר כך היא מריצה את החלק **החוזר**, עם השורות שנוצרו בסבב הקודם (`n = 3`), ומקבלת `2`.
3. היא חוזרת על כך עם השורות החדשות ביותר עד שהחלק החוזר מחזיר **אפס שורות**. כאן `WHERE n > 1` גורם לה לעצור אחרי `1`.
4. כל השורות מכל הסבבים מאוחדות (זה מה ש-`UNION ALL` עושה) והופכות לתוצאה.

ה-`(n)` אחרי השם מפרט את שמות העמודות. ל-CTE רקורסיבי **חייב** להיות תנאי עצירה, אחרת הוא רץ לנצח.

## מילוי פערים עם סדרה שנוצרת

בטבלאות אמיתיות לעיתים חסרים ערכים. ספירת קורסים לפי נקודות זכות מחזירה רק את הערכים שקיימים (2, 3, 4). אם רוצים 1 עד 5 בדוח, צרו את המספרים עם CTE רקורסיבי וחברו אליהם את הספירות עם `LEFT JOIN`. בתוצאה יהיה `NULL` איפה שלא הייתה התאמה, ו-`COALESCE(value, 0)` מחליף `NULL` בערך חלופי: הוא מחזיר את הארגומנט הראשון שאינו `NULL`.

זה בדיוק התרגיל שלמטה.

> **שימו לב:**
> - שכחת תנאי העצירה: השאילתה לא נגמרת (או שהעורך עוצר אותה). תמיד כללו `WHERE` בחלק החוזר.
> - כתיבת `WITH RECURSIVE` פעם לכל CTE: כותבים `WITH RECURSIVE` רק פעם אחת, בהתחלה ממש, ואז מפרידים את ה-CTEs בפסיקים.
> - פסיק לפני ה-`SELECT` הסופי: `near "SELECT": syntax error`.
> - כינוי חסר: CTE שמופיע פעמיים באותה שאילתה צריך כינויים שונים, כמו `FROM per_student AS a JOIN per_student AS b`.
> - ציפייה ש-CTE יישאר אחרי הפקודה. הוא קיים רק עבור הפקודה הזו; השתמשו ב-`CREATE VIEW` (בשיעורים הבאים) כדי לשמור שאילתה.

> **תורכם:** כתבו פקודה אחת עם CTE רקורסיבי `levels(credits)` עבור 1 עד 5, CTE שני `counts` שסופר קורסים לפי נקודות זכות, ו-`SELECT` סופי שמחבר אותם ב-left join ומציג `credits` ו-`courses` (0 כשאין קורס).
