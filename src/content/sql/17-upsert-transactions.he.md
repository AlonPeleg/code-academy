---
title: "UPSERT, טרנזקציות ופונקציות צבירה חכמות"
summary: "הוספה או עדכון בפקודה אחת, קיבוץ כמה שינויים לטרנזקציה של הכול או כלום, וצבירה עם תנאים."
hints:
  - "UPSERT פירושו INSERT עם גיבוי: אם המפתח הראשי כבר קיים, מריצים UPDATE במקום להיכשל. טרנזקציה עטופה בין BEGIN לבין COMMIT (לשמור) או ROLLBACK (לבטל הכול)."
  - "INSERT INTO students (id, name, age, city) VALUES (7, 'Yael', 24, 'Haifa') ON CONFLICT(id) DO UPDATE SET city = excluded.city;   עשו אותו דבר עבור Tal. ואז BEGIN; DELETE FROM enrollments; ROLLBACK;"
  - "INSERT INTO students (id, name, age, city) VALUES (7, 'Yael', 24, 'Haifa') ON CONFLICT(id) DO UPDATE SET city = excluded.city;   INSERT INTO students (id, name, age, city) VALUES (8, 'Tal', 22, 'Haifa') ON CONFLICT(id) DO UPDATE SET city = excluded.city;   BEGIN;   DELETE FROM enrollments;   ROLLBACK;"
quiz:
  - q: "מה UPSERT עושה?"
    options: ["מוסיף שורה, או מעדכן את הקיימת אם המפתח כבר שם", "מוחק שורה ומוסיף אותה מחדש", "מעדכן כל שורה בטבלה"]
  - q: "מה ROLLBACK עושה?"
    options: ["שומר את כל השינויים מאז BEGIN", "מפעיל מחדש את מסד הנתונים", "מבטל את כל השינויים מאז BEGIN"]
  - q: "למה טרנזקציות שימושיות כשמעבירים כסף מחשבון A לחשבון B (שני UPDATE)?"
    options: ["הן הופכות את העדכונים למהירים יותר", "או ששני העדכונים מתבצעים או שאף אחד מהם, ולכן כסף לעולם לא הולך לאיבוד באמצע", "הן נועלות את הטבלה לנצח"]
    explain: "תכונת הכול-או-כלום נקראת אטומיות (atomicity), האות A ב-ACID."
  - q: "מה SUM(CASE WHEN grade >= 85 THEN 1 ELSE 0 END) מחשב?"
    options: ["את סכום כל הציונים", "את הציון הגבוה ביותר", "כמה שורות יש בהן ציון של 85 ומעלה"]
messages:
  - "השתמשו ב-  ON CONFLICT(id) DO UPDATE SET ... "
  - "בתוך DO UPDATE השורה החדשה נקראת excluded:  SET city = excluded.city"
  - "התחילו את הטרנזקציה עם BEGIN;"
  - "בטלו אותה עם ROLLBACK;"
---

אפליקציות אמיתיות עושות יותר מלקרוא נתונים. הן חייבות לשנות אותם בבטחה, גם כששני דברים קורים בו זמנית או כששלב נכשל באמצע. השיעור הזה מוסיף שלושה כלים: **UPSERT**, **טרנזקציות** (transactions) ו**צבירה מותנית**.

## UPSERT: הוספה, או עדכון אם כבר קיים

נניח שאתם מקבלים רשימת סטודנטים ורוצים לשמור כל אחד: להוסיף את החדשים ולעדכן את אלה שאתם כבר מכירים. `INSERT` רגיל של id קיים נכשל עם `UNIQUE constraint failed: students.id`. **UPSERT** (עדכון + הוספה, update + insert) מטפל בשני המקרים:

```sql
INSERT INTO students (id, name, age, city)
VALUES (7, 'Yael', 24, 'Haifa')
ON CONFLICT(id) DO UPDATE SET city = excluded.city;
```

1. SQL מנסה את ה-`INSERT`.
2. אם קורה **התנגשות** (conflict) על העמודה שבסוגריים (`id`, שיש לה מפתח ראשי או כלל `UNIQUE`), הפקודה **לא** נכשלת. היא מריצה את החלק `DO UPDATE` על השורה הקיימת.
3. `excluded` הוא שם מיוחד ל"שורה שניסיתם להוסיף", ולכן `excluded.city` הוא `'Haifa'`.

השתמשו ב-`ON CONFLICT(id) DO NOTHING` כשאתם פשוט רוצים לדלג על שורות שכבר קיימות.

## טרנזקציות: הכול או כלום

חלק מהמשימות דורשות כמה פקודות שחייבות להצליח **יחד**. העברה בנקאית מורידה מחשבון אחד ומוסיפה לאחר. אם התוכנה קורסת בין השתיים, כסף נעלם. **טרנזקציה** מקבצת פקודות ליחידה אחת:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 1;
UPDATE accounts SET balance = balance + 50 WHERE id = 2;
COMMIT;
```

- `BEGIN` פותח את הטרנזקציה. השינויים זמניים.
- `COMMIT` הופך אותם לקבועים, כולם בבת אחת.
- `ROLLBACK` זורק את כולם, כאילו לא קרו מעולם.

התכונה הזו נקראת **אטומיות** (atomicity). זו האות A ב-**ACID**, ארבע ההבטחות של מסד נתונים אמין (Atomicity, Consistency, Isolation, Durability). טרנזקציות גם מונעות ממשתמשים אחרים לראות עבודה לא גמורה.

בתרגיל אתם מבצעים `BEGIN`, מוחקים כל הרשמה, ואז `ROLLBACK`. הטבלה נשארת שלמה: השאילתה הסופית עדיין סופרת 13 הרשמות. נסו להחליף את `ROLLBACK` ב-`COMMIT` ותראו אותן נעלמות (בדיוק בגלל זה צריך להיזהר עם `DELETE`).

## פונקציות צבירה חכמות

שני כלים עוזרים כש-`COUNT` ו-`AVG` לא מספיקים.

**GROUP_CONCAT** מדביק את הערכים של קבוצה לטקסט אחד:

```sql
SELECT course_id, GROUP_CONCAT(student_id, ', ') AS student_ids
FROM enrollments
GROUP BY course_id;
```

**צבירה מותנית** (conditional aggregation) שמה `CASE` בתוך פונקציית צבירה כדי לספור או לחבר רק חלק מהשורות, ונותנת כמה מספרים במעבר אחד:

```sql
SELECT c.title,
       COUNT(*) AS enrolled,
       SUM(CASE WHEN e.grade >= 85 THEN 1 ELSE 0 END) AS high_grades
FROM courses AS c
JOIN enrollments AS e ON e.course_id = c.id
GROUP BY c.id;
```

לכל שורה ה-`CASE` נותן 1 כשהציון גבוה ו-0 אחרת, ו-`SUM` מחבר אותם. זה מחליף כמה שאילתות נפרדות והוא אהוב מאוד בדוחות.

> **שימו לב:**
> - `ON CONFLICT clause does not match any PRIMARY KEY or UNIQUE constraint`: לעמודה ב-`ON CONFLICT(...)` חייב להיות מפתח ראשי או כלל ייחודיות.
> - שכחת `COMMIT` או `ROLLBACK`: הטרנזקציה נשארת פתוחה. בעורך הזה כל הרצה מתחילה מחדש, אבל בתוכניות אמיתיות טרנזקציה פתוחה יכולה לחסום משתמשים אחרים.
> - `cannot start a transaction within a transaction`: הרצתם `BEGIN` פעמיים.
> - `GROUP_CONCAT` לא מבטיח את סדר הערכים המחוברים. אל תסתמכו עליו.
> - נדרש נקודה-פסיק בין כל הפקודות: `near "ON": syntax error` פירושו לעיתים קרובות שה-INSERT שלפניו לא הסתיים כראוי.

> **תורכם:** בצעו upsert ל-Yael (id 7, עכשיו ב-Haifa) ול-Tal (id 8) עם `ON CONFLICT(id) DO UPDATE SET city = excluded.city`, ואז הריצו טרנזקציה שמוחקת את כל ההרשמות ומסתיימת ב-`ROLLBACK`. ה-`SELECT` הסופי אמור להציג את שני הסטודנטים ב-Haifa ו-13 הרשמות שנותרו.
