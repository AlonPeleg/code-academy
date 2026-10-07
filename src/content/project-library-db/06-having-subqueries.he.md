---
title: "שלב 6: HAVING, שאילתות משנה ומה שחסר"
summary: "מסננים קבוצות עם HAVING, משתמשים בשאילתות משנה ומוצאים שורות בלי התאמה בעזרת LEFT JOIN."
hints:
  - "שלושה רעיונות: HAVING מסנן קבוצות אחרי GROUP BY; שאילתת משנה (subquery) היא SELECT בתוך סוגריים שמשמש כרשימה; LEFT JOIN שומר שורות שמאל בלי התאמה, והעמודות הימניות שלהן הן NULL."
  - "(a) ... GROUP BY m.id, m.name HAVING COUNT(*) > 2. (b) WHERE id NOT IN (SELECT member_id FROM loans). (c) FROM books AS b JOIN authors AS a ON a.id = b.author_id LEFT JOIN loans AS l ON l.book_id = b.id WHERE l.id IS NULL."
  - "(c) SELECT b.title, a.name AS author, b.year FROM books AS b JOIN authors AS a ON a.id = b.author_id LEFT JOIN loans AS l ON l.book_id = b.id WHERE l.id IS NULL ORDER BY b.title;"
messages:
  - "סננו את הקבוצות עם HAVING COUNT(*) > 2."
  - "השתמשו בשאילתת משנה: id NOT IN (SELECT ...)."
  - "השתמשו ב-LEFT JOIN loans בשאילתת המלאי המת."
  - "השאירו את השורות בלי התאמה עם l.id IS NULL."
quiz:
  - q: "למה אי אפשר לכתוב WHERE COUNT(*) > 2?"
    options: ["אי אפשר להשתמש ב-COUNT עם מספרים", "WHERE רץ לפני הקיבוץ, ולכן ספירות הקבוצות עדיין לא קיימות", "זה מותר, רק איטי יותר"]
    explain: "תנאים על קבוצות נכתבים ב-HAVING."
  - q: "ב-LEFT JOIN, מה מכילות עמודות הטבלה הימנית כשאין התאמה?"
    options: ["0", "מחרוזת ריקה", "NULL"]
  - q: "מה מחזיר WHERE id NOT IN (SELECT member_id FROM loans)?"
    options: ["חברים שאין להם אף השאלה", "השאלות שאין להן חבר", "כל החברים שיש להם השאלות"]
---
עד עכשיו ספרתם דברים שקיימים. חלק מהשאלות הטובות ביותר הן על דברים ש**לא** קיימים: ספרים שאף אחד לא שאל, חברים שלא מגיעים אף פעם. השלב הזה מוסיף שלושה כלים: `HAVING`, שאילתות משנה (subqueries) והדפוס `LEFT JOIN ... IS NULL`.

## איפה אנחנו

המחברת שלכם נגמרת בדירוג הפופולריות. הוא מציג רק ספרים שיש להם לפחות השאלה אחת, כי חיבור פנימי (inner join) משמיט שורות בלי התאמה.

## מה נוסיף

שלושה דוחות קטנים עבור הנהלת הספרייה:

1. **שואלים תכופים**: חברים עם יותר מ-2 השאלות.
2. **חברים שקטים**: חברים שמעולם לא שאלו כלום.
3. **מלאי מת**: ספרים שמעולם לא נשאלו (זו התוצאה שהבודק מסתכל עליה).

## 1. HAVING: סינון קבוצות

`WHERE` מסנן שורות *לפני* הקיבוץ. תנאי על סכום של קבוצה, כמו "יותר מ-2 השאלות", לא יכול להתקיים לפני שהקבוצות קיימות, ולכן הוא נכתב ב-`HAVING`, אחרי `GROUP BY`:

```sql
SELECT m.name, COUNT(*) AS loans
FROM members AS m
JOIN loans AS l ON l.member_id = m.id
GROUP BY m.id, m.name
HAVING COUNT(*) > 2;
```

סדר הסעיפים קבוע: `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`.

## 2. שאילתות משנה: שאילתה בתוך שאילתה

**שאילתת משנה** (subquery) היא `SELECT` בתוך סוגריים שמשמש כערך או כרשימה. השאילתה הפנימית רצה קודם:

```sql
SELECT name FROM members
WHERE id NOT IN (SELECT member_id FROM loans);
```

קראו את זה בקול: "חברים שה-id שלהם אינו בין מזהי החברים שמופיעים ב-loans". השאילתה הפנימית מייצרת את רשימת השואלים; החיצונית משאירה את כל האחרים. זה עובד כי `loans.member_id` לא יכול להיות `NULL` לעולם (הגדרנו אותו כ-`NOT NULL`). אם הרשימה הייתה מכילה `NULL`, הביטוי `NOT IN` לא היה מחזיר שום דבר, וזו מלכודת מפורסמת.

## 3. LEFT JOIN ו-IS NULL: ה"anti-join"

`LEFT JOIN` שומר **כל שורה מהטבלה השמאלית**, גם כשלטבלה הימנית אין התאמה; העמודות הימניות הן אז `NULL`. סינון של ה-`NULL`ים האלה מוצא בדיוק את השורות בלי התאמה:

```sql
FROM books AS b
LEFT JOIN loans AS l ON l.book_id = b.id
WHERE l.id IS NULL
```

מעבר שלב אחר שלב עבור דוח המלאי המת:

1. מתחילים מ-`books AS b` (הצד שרוצים לשמור במלואו).
2. `JOIN authors AS a ON a.id = b.author_id` כדי להציג את הכותב. זה חיבור רגיל כי לכל ספר יש מחבר.
3. `LEFT JOIN loans AS l ON l.book_id = b.id`.
4. `WHERE l.id IS NULL`: משאירים רק ספרים שלא נמצאה עבורם שורת השאלה. בדקו עמודה שבהשאלה אמיתית אינה יכולה להיות `NULL`, כמו ה-`id` של ההשאלה.
5. בוחרים את `b.title`, את `a.name AS author` ואת `b.year`, ממוינים לפי כותרת.

`NOT IN (subquery)` ו-`LEFT JOIN ... IS NULL` נותנים אותה תשובה. חיבורים הם בדרך כלל ההרגל המהיר יותר בטבלאות גדולות, והם מתמודדים טוב יותר עם `NULL`ים.

> **שימו לב:**
> - `HAVING` לפני `GROUP BY` נותן `near "GROUP": syntax error`.
> - תנאי על `COUNT(*)` בתוך `WHERE` נותן `misuse of aggregate function COUNT()`.
> - אם שמים את הסינון של הטבלה הימנית בסעיף `WHERE` (למשל `WHERE l.loaned_on > '2025-01-01'`), `LEFT JOIN` הופך חזרה לחיבור פנימי, כי `NULL > ...` אף פעם לא נכון. שימו תנאים כאלה בחלק ה-`ON`.
> - בדיקה של `l.book_id IS NULL` עובדת, אבל רק בגלל שחיברתם לפיה. שימוש ב-id ברור יותר.
> - שאילתת משנה שמחזירה כמה עמודות בתוך `IN (...)` נכשלת עם `sub-select returns 2 columns - expected 1`.

> **תורכם:** השאירו את השאילתות הקודמות, ואז הוסיפו שלוש שאילתות בסדר הזה: (1) חברים עם יותר מ-2 השאלות בעזרת `HAVING COUNT(*) > 2`; (2) חברים שמעולם לא שאלו, בעזרת `NOT IN (SELECT ...)`; (3) הספרים שמעולם לא נשאלו, עם `title`, `author` ו-`year` ממוינים לפי כותרת, בעזרת `LEFT JOIN` ו-`IS NULL`. שאילתה (3) חייבת להיות המשפט האחרון.
