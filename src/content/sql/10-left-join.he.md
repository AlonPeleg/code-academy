---
title: "LEFT JOIN - שמירה על שורות ללא התאמה"
summary: "שמרו כל שורה מהטבלה השמאלית, גם כשאין התאמה."
hints:
  - "JOIN רגיל היה משמיט סטודנטים שאין להם הרשמה מתאימה. החיבור השני שומר את כל השורות של הטבלה שנכתבה ראשונה (השמאלית)."
  - "התחילו עם FROM students s LEFT JOIN enrollments e. שימו את בדיקת הציון בתוך תנאי ה-ON ולא ב-WHERE: ON e.student_id = s.id AND e.grade >= 90. אחר כך GROUP BY s.id ו-COUNT(e.grade)."
  - "SELECT s.name, COUNT(e.grade) AS top_grades FROM students s LEFT JOIN enrollments e ON e.student_id = s.id AND e.grade >= 90 GROUP BY s.id ORDER BY top_grades DESC, s.name;"
quiz:
  - q: "מה LEFT JOIN שומר ש-JOIN רגיל משמיט?"
    options: ["שורות כפולות", "שורות מהטבלה הימנית בלבד", "שורות של הטבלה השמאלית שאין להן התאמה"]
  - q: "מה מכילות העמודות של הטבלה הימנית עבור שורה שמאלית ללא התאמה?"
    options: ["NULL", "0", "מחרוזת ריקה"]
  - q: "למה משתמשים כאן ב-COUNT(e.grade) ולא ב-COUNT(*)?"
    options: ["COUNT(*) אסור יחד עם חיבורים", "COUNT(e.grade) מתעלם מערכי ה-NULL של שורות ללא התאמה, ולכן הן נספרות כ-0", "זה מהיר יותר"]
  - q: "מה קורה אם מעבירים את  e.grade >= 90  מ-ON אל WHERE?"
    options: ["שום דבר לא משתנה", "סטודנטים ללא התאמה מוסרים שוב, ולכן זה מתנהג כמו inner join", "SQL מדווחת על שגיאה"]
messages:
  - "השתמשו ב-LEFT JOIN כדי שסטודנטים ללא ציון גבוה יישארו בתוצאה."
  - "קבצו לפי סטודנט."
  - "ספרו עמודה מצד enrollments, כמו COUNT(e.grade), כדי שסטודנטים ללא התאמה ייספרו כ-0."
---

`JOIN` רגיל שומר רק שורות שיש להן בן זוג בטבלה השנייה. זה בדיוק מה שרוצים כששואלים "באיזה קורס למד כל סטודנט?". אבל לפעמים רוצים את ההפך: "הציגו **את כל** הסטודנטים, ואת ההרשמות שלהם *אם יש להם*". בשביל זה צריך `LEFT JOIN`.

## שמאל וימין

ב-`FROM a LEFT JOIN b`, הטבלה שנכתבה ראשונה (`a`) היא הטבלה **השמאלית**. חיבור שמאלי (left join):

1. שומר **כל** שורה של הטבלה השמאלית.
2. מצמיד את השורות המתאימות של הטבלה הימנית.
3. אם לשורה שמאלית אין התאמה, הוא עדיין מוציא אותה, וממלא את העמודות של הטבלה הימנית ב-`NULL`.

```sql
SELECT s.name, e.course_id, e.grade
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id;
```

אם לסטודנט לא הייתה אף הרשמה, הוא היה מופיע פעם אחת עם `NULL` ב-`course_id` וב-`grade`. עם `JOIN` רגיל הוא היה נעלם מהתוצאה.

## הטריק של "למי אין כלום?"

מכיוון ששורות ללא התאמה מכילות `NULL`, אפשר למצוא אותן עם `IS NULL`. למשל "סטודנטים ללא הרשמות" נכתב כך:

```sql
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
WHERE e.student_id IS NULL;
```

בנתוני הדוגמה שלנו כולם רשומים לאיזשהו קורס, ולכן זה מחזיר אפס שורות, אבל במסד נתונים אמיתי זו שאלה נפוצה מאוד ("לקוחות שמעולם לא הזמינו", "מוצרים שמעולם לא נמכרו").

## הצבת התנאי ב-ON

לפעמים כלל ההתאמה עצמו כולל בדיקה נוספת. השוו:

```sql
-- keeps all students; those without a top grade show NULL
LEFT JOIN enrollments e ON e.student_id = s.id AND e.grade >= 90

-- removes students without a top grade again
LEFT JOIN enrollments e ON e.student_id = s.id
WHERE e.grade >= 90
```

בצורה השנייה, `WHERE` מסיר כל שורה שבה `e.grade` הוא `NULL`, וזה מחזיר את האפקט של inner join. **תנאים על הטבלה הימנית שלא אמורים למחוק שורות שמאליות שייכים ל-`ON`.**

## ספירה עם חיבור שמאלי

כדי לספור התאמות לכל שורה שמאלית, קבצו וספרו עמודה של הטבלה **הימנית**:

```sql
SELECT s.name, COUNT(e.grade) AS top_grades
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id AND e.grade >= 90
GROUP BY s.id;
```

`COUNT(e.grade)` מדלג על `NULL`, ולכן סטודנט בלי התאמה מקבל `0`. `COUNT(*)` היה סופר את שורת המקום הבודדת ומחזיר בטעות `1`.

> **שימו לב:**
> - החלפת סדר הטבלאות משנה את התוצאה: `courses LEFT JOIN students` שומר במקום זה את כל הקורסים.
> - סינון הטבלה הימנית ב-`WHERE` הופך בשקט את החיבור ל-inner join.
> - `COUNT(*)` אחרי `LEFT JOIN` סופר שורות ללא התאמה כ-1. ספרו במקום זה עמודה של הטבלה הימנית.
> - שכחת `ON` גורמת לשגיאת תחביר `near ";"` או לתוצאה ענקית ולא רצויה.

> **תורכם:** הציגו כל סטודנט עם מספר הציונים של 90 ומעלה שיש לו (`top_grades`), כולל סטודנטים עם אפס, ממוינים לפי `top_grades` מהגבוה לנמוך ואחר כך לפי שם.
