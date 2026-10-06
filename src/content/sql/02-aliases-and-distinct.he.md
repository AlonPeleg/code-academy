---
title: "כינויים ו-DISTINCT"
summary: "שנו שמות של עמודות עם AS והסירו שורות כפולות."
hints:
  - "שני כלים קטנים: אחד מסיר שורות חוזרות מהתוצאה, והשני נותן לעמודה שם חדש."
  - "הניחו את המילה DISTINCT מיד אחרי SELECT. שנו שם בתבנית  column AS new_name. העמודה לקריאה היא language, מהטבלה courses. סיימו עם ORDER BY."
  - "SELECT DISTINCT language AS programming_language FROM courses ORDER BY language;"
quiz:
  - q: "מה עושה DISTINCT?"
    options: ["ממיין את השורות", "מסיר שורות כפולות מהתוצאה", "סופר את השורות"]
  - q: "ב-  SELECT name AS student FROM students  מהו  student ?"
    options: ["טבלה חדשה", "מסנן", "תווית חדשה לעמודה name בתוצאה"]
  - q: "האם AS משנה את שם העמודה בתוך מסד הנתונים?"
    options: ["לא, רק בתוצאה של השאילתה הזו", "כן, באופן קבוע", "רק אם משתמשים ב-DISTINCT"]
  - q: "איפה מניחים את DISTINCT?"
    options: ["בסוף השאילתה", "מיד אחרי SELECT", "אחרי FROM"]
messages:
  - "השתמשו ב-DISTINCT כדי להסיר כפילויות."
  - "שנו את שם העמודה עם AS programming_language."
---

לעיתים קרובות שמות העמודות המקוריים אינם בדיוק מה שרוצים להציג, ולעיתים קרובות עמודה מכילה את אותו ערך פעמים רבות. בשיעור הזה תלמדו שני כלים קטנים אך שימושיים מאוד: **כינויים** (aliases, עם `AS`) לשינוי שמות של עמודות, ו-`DISTINCT` להסרת חזרות.

## כינויים עם AS

**כינוי** (alias) הוא שם זמני לעמודה בתוצאה. הוא לא משנה את מסד הנתונים בכלל, רק את הכותרת שאתם רואים:

```sql
SELECT name AS student, city AS hometown
FROM students;
```

בתוצאה יש את הכותרות `student` ו-`hometown` במקום `name` ו-`city`.

כינויים הופכים לשימושיים באמת כשהעמודה היא **חישוב**. בלי שם, הכותרת הייתה כל הביטוי:

```sql
SELECT title, credits * 10 AS study_hours
FROM courses;
```

כאן `credits * 10` מחושב עבור כל שורה, ו-`AS study_hours` נותן לעמודה החדשה שם קריא. SQL תומכת באופרטורים הרגילים `+ - * /` וגם בפונקציות כמו `UPPER(title)` ו-`LENGTH(title)`.

אם אתם רוצים כינוי עם רווחים, עטפו אותו בגרשיים כפולים: `AS "study hours"`. מתחילים בדרך כלל מסתפקים בקווים תחתונים.

אפשר גם להשתמש בכינוי בהמשך אותה שאילתה, למשל ב-`ORDER BY study_hours`.

## הסרת כפילויות עם DISTINCT

הסתכלו על הטבלה `courses`: גם *JavaScript Basics* וגם *React in Practice* משתמשים ב-JavaScript. השאילתה הזו מציגה את השפה פעם אחת לכל קורס:

```sql
SELECT language
FROM courses;
```

```text
language
HTML
JavaScript
Python
SQL
JavaScript
```

`JavaScript` מופיע פעמיים. אם מניחים `DISTINCT` ישר אחרי `SELECT`, כל ערך מופיע פעם אחת בלבד:

```sql
SELECT DISTINCT language
FROM courses;
```

```text
language
HTML
JavaScript
Python
SQL
```

כשיש כמה עמודות, `DISTINCT` בודק את כל הצירוף: `SELECT DISTINCT city, age` יסיר רק שורות ש**שני** הערכים בהן חוזרים.

## מחברים הכול יחד

```sql
SELECT DISTINCT city AS place
FROM students
ORDER BY place;
```

זכרו ש-`NULL` (ערך חסר) נחשב ב-`DISTINCT` לערך בפני עצמו, ולכן עיר חסרה תופיע פעם אחת כ-`NULL`.

> **שימו לב:**
> - `DISTINCT` בא מיד אחרי `SELECT`, לא אחרי שם העמודה. `SELECT language DISTINCT` היא שגיאת תחביר.
> - `AS` משנה שם רק עבור התוצאה הזו. ב-`WHERE` עדיין צריך להשתמש בשם האמיתי של העמודה, כי מסדי נתונים רבים לא מרשים שם כינוי ומדווחים `no such column`.
> - כינוי עם רווח וללא גרשיים כפולים, כמו `AS study hours`, גורם ל-`near "hours": syntax error`.
> - `DISTINCT` חל על כל השורה של העמודות שנבחרו, לא רק על העמודה הראשונה.

> **תורכם:** הציגו כל שפת תכנות שבה משתמש קורס פעם אחת בלבד, קראו לעמודה `programming_language`, ומיינו את הרשימה לפי סדר האלף-בית.
