---
title: "JOIN - חיבור טבלאות"
summary: "חברו בין students, enrollments ו-courses."
hints:
  - "הטבלה enrollments שומרת רק מזהים (ids). צריך עוד JOIN אחד, באותו סגנון כמו הקיים, ואחר כך סינון לפי הציון."
  - "הוסיפו שורה JOIN courses c ON c.id = e.course_id אחרי החיבור של students. הוסיפו WHERE e.grade >= 90 לפני שורת ה-ORDER BY (ORDER BY תמיד בא אחרון)."
  - "JOIN courses c ON c.id = e.course_id    WHERE e.grade >= 90    (שורת ה-WHERE באה ממש מעל ORDER BY s.name, c.title;)"
quiz:
  - q: "למה אנחנו צריכים JOIN?"
    options: ["כדי שהשאילתות ירוצו לאחור", "הנתונים מפוצלים בין טבלאות, ו-JOIN מחבר ביניהן", "כדי למחוק שורות כפולות"]
  - q: "ב-  JOIN courses c ON c.id = e.course_id  מה עושה ON?"
    options: ["מגדיר איך שורות משתי הטבלאות מתאימות זו לזו", "מדליק את הטבלה", "ממיין את השורות"]
  - q: "מהו  e  ב-  FROM enrollments e ?"
    options: ["עמודה", "פונקציה", "כינוי קצר לשם הטבלה"]
  - q: "מה JOIN רגיל (INNER JOIN) עושה עם שורות שאין להן התאמה?"
    options: ["משאיר אותן עם NULL", "משמיט אותן", "מדווח על שגיאה"]
messages:
  - "חברו את הטבלה courses עם הכינוי c."
  - "השאירו רק ציונים של 90 ומעלה."
---

מסדי נתונים טובים מפצלים את הנתונים לטבלאות נפרדות כדי לא לחזור על עצמם. השם של סטודנט נשמר פעם אחת ב-`students`, ולא מועתק לכל הרשמה. המחיר של הסדר הזה הוא שכדי לענות על שאלה כמו "באיזה קורס Ava קיבלה 90?", צריך **לחבר** (join) את הטבלאות בחזרה.

## מפתחות: איך טבלאות מצביעות זו על זו

הטבלה `enrollments` שלנו שומרת רק מספרים:

| student_id | course_id | grade |
| --- | --- | --- |
| 1 | 1 | 90 |
| 1 | 2 | 85 |

`student_id` מתאים לעמודה `id` של `students`, ו-`course_id` מתאים ל-`id` של `courses`. עמודה שמצביעה על ה-`id` של טבלה אחרת נקראת **מפתח זר** (foreign key).

## ה-JOIN הראשון שלכם

```sql
SELECT s.name, e.grade
FROM enrollments e
JOIN students s ON s.id = e.student_id;
```

חלק אחר חלק:

- `enrollments e` נותן לטבלה **כינוי** (alias) קצר, `e`. כך גם `students s`.
- `JOIN students s` מביא את הטבלה השנייה.
- `ON s.id = e.student_id` הוא כלל ההתאמה: לכל הרשמה מצמידים את הסטודנט שה-`id` שלו שווה ל-`student_id` שלה.
- `s.name` פירושו "העמודה `name` של הטבלה שנקראת `s`". צריך להוסיף לעמודות את כינוי הטבלה כשלשתי טבלאות יש עמודה באותו שם (כאן לשתיהן יש `id`).

בתוצאה יש שורה אחת לכל הרשמה, ועכשיו היא מציגה שם אמיתי במקום מספר.

## חיבור שלוש טבלאות

הוסיפו עוד `JOIN` כדי להמשיך. לכל אחד דרוש `ON` משלו:

```sql
SELECT s.name, c.title, e.grade
FROM enrollments e
JOIN students s ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id;
```

תחשבו על זה כעל בניית טבלה רחבה וזמנית שבה סטודנט, קורס וציון מופיעים זה לצד זה. אחרי זה `WHERE`, `ORDER BY`, `GROUP BY` וכל מה שכבר אתם מכירים עובדים עליה כרגיל:

```sql
SELECT c.title, ROUND(AVG(e.grade), 1) AS average
FROM enrollments e
JOIN courses c ON c.id = e.course_id
GROUP BY c.title;
```

## INNER JOIN

`JOIN` הוא קיצור של `INNER JOIN`: שורה נשמרת רק אם יש לה בן זוג **בשני** הצדדים. בשיעורים הבאים נראה את `LEFT JOIN`, ששומר גם שורות ללא התאמה.

> **שימו לב:**
> - שכחת `ON` גורמת ל-`near ";": syntax error` או, גרוע מזה, בצורות מסוימות ל"מכפלה קרטזית" (cross join) שמצמידה כל שורה לכל שורה ומחזירה תוצאה ענקית.
> - עמודה דו-משמעית כמו `id` בלבד כששתי הטבלאות כוללות אותה גורמת ל-`ambiguous column name: id`. הוסיפו לה קידומת: `s.id`.
> - כינוי שגוי, כמו `x.name` כשלא הגדרתם את `x`, גורם ל-`no such column: x.name`.
> - התאמה של עמודות לא נכונות (`ON s.id = e.course_id`) רצה בלי שגיאה אבל מפיקה תוצאה חסרת משמעות. בדקו תמיד איזה id מצביע לאן.

> **תורכם:** סיימו את השאילתה על ידי חיבור `courses` וסינון לציונים של 90 ומעלה.
