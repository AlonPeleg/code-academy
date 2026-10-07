---
title: "שלב 8: עדכונים, אינדקסים ולוח מחוונים"
summary: "מעדכנים נתונים עם UPDATE, מאיצים חיפושים עם אינדקסים ובונים לוח מחוונים בשורה אחת."
hints:
  - "UPDATE table SET column = value WHERE condition משנה שורות; בלי WHERE הוא משנה את כולן. CREATE INDEX name ON table (column) מאיץ חיפושים לפי העמודה הזאת."
  - "UPDATE loans SET returned_on = '2025-03-15' WHERE id = 5; CREATE INDEX idx_loans_member ON loans (member_id); CREATE INDEX idx_loans_book ON loans (book_id). לוח המחוונים הוא SELECT עם כמה עמודות מהצורה (SELECT COUNT(*) FROM ...) AS name."
  - "SELECT (SELECT COUNT(*) FROM loans) AS total_loans, (SELECT COUNT(*) FROM open_loans) AS out_now, (SELECT COUNT(*) FROM overdue_loans) AS overdue, (SELECT COUNT(*) FROM books WHERE id NOT IN (SELECT book_id FROM loans)) AS never_borrowed, (SELECT COUNT(*) FROM members) AS members;"
messages:
  - "השתמשו ב-UPDATE loans SET returned_on = ... WHERE id = 5."
  - "הגבילו את ה-UPDATE עם WHERE id = 5."
  - "צרו שני אינדקסים עם CREATE INDEX."
quiz:
  - q: "מה קורה אם מריצים UPDATE loans SET returned_on = '2025-03-15'; בלי WHERE?"
    options: ["SQLite מבקשת אישור", "כל שורה בטבלה loans משתנה", "כלום, WHERE הוא חובה"]
    explain: "תמיד כתבו ובדקו קודם את ה-WHERE."
  - q: "מה היתרון העיקרי של אינדקס?"
    options: ["הוא מאיץ מאוד את מציאת השורות לפי העמודה הזאת", "הוא מסיר שורות כפולות", "הוא שומר גיבוי של הטבלה"]
  - q: "למה המספר out_now יורד אחרי ה-UPDATE בלי לשנות את ה-view?"
    options: ["views מתרעננים פעם ביום", "ה-view נמחק ונוצר מחדש", "view מריץ את השאילתה שלו על נתוני הטבלה הנוכחיים בכל פעם"]
---
מסד נתונים אינו מוזיאון: נתונים משתנים כל יום. בשלב האחרון תרשמו ספר שהוחזר עם `UPDATE`, תאיצו חיפושים עם אינדקס (index) ותבנו לוח מחוונים של שורה אחת עבור הספרנית.

## איפה אנחנו

במחברת שלכם יש את הדוחות של הטבלאות ושלושה views. הספרנית יודעת למי יש ספרים באיחור. עכשיו נועה כץ נכנסת ומחזירה את העותק המאחר של *Half of a Yellow Sun* (השאלה מספר 5). הספרייה צריכה לרשום את זה.

## מה נוסיף

* **UPDATE**: לסמן שהשאלה 5 הוחזרה היום.
* **אינדקסים**: להאיץ את החיבורים על `loans`.
* **שאילתת לוח מחוונים**: שורה אחת של מספרים מרכזיים שקוראת מה-views, כך שה-UPDATE משנה אותם אוטומטית.

## עדכון נתונים

```sql
UPDATE loans
SET returned_on = '2025-03-15'
WHERE id = 5;
```

`UPDATE table SET column = value WHERE condition` משנה את השורות שמתאימות. סעיף ה-`WHERE` חיוני: **בלעדיו כל שורה משתנה**. הרגל טוב: כתבו קודם את ה-`WHERE`, בדקו אותו עם `SELECT`, ורק אז הפכו את המשפט ל-`UPDATE`. `INSERT` מוסיף שורות ו-`DELETE FROM table WHERE ...` מסיר אותן, עם אותה אזהרה לגבי `WHERE`.

מכיוון ש-`open_loans` ו-`overdue_loans` קוראים מ-`loans`, השינוי היחיד הזה גורם להשאלה להיעלם משניהם. views תמיד חיים.

## אינדקסים

דמיינו שאתם מחפשים כל אזכור של מילה בספר בן 500 עמודים. בלי האינדקס שבסוף הספר קוראים כל עמוד. מסד נתונים עושה אותו דבר: כדי למצוא את ההשאלות של חבר אחד הוא סורק את כל הטבלה `loans`, אלא אם קיים **אינדקס**.

```sql
CREATE INDEX idx_loans_member ON loans (member_id);
CREATE INDEX idx_loans_book   ON loans (book_id);
```

אינדקס הוא מבנה צדדי ממוין ש-SQLite שומרת מעודכן. הוא מאיץ חיפושים וחיבורים לפי העמודה הזאת, במחיר של מעט מקום בדיסק וכתיבות איטיות מעט יותר. שימו אינדקס על עמודות מפתח זר שמחברים לפיהן ועל עמודות שמסננים לפיהן לעיתים קרובות. מפתחות ראשיים מקבלים אינדקס אוטומטית, ולכן `id` לא צריך כלום. עם 12 השאלות לא תרגישו הבדל, אבל עם מיליון השאלות זה ההבדל בין מיידי לבין דקות.

## לוח המחוונים

שורה אחת של **שאילתות משנה סקלריות** (scalar subqueries, שאילתות משנה שמחזירות ערך אחד בדיוק) היא דרך נאה לבנות סיכום:

```sql
SELECT
  (SELECT COUNT(*) FROM loans)         AS total_loans,
  (SELECT COUNT(*) FROM open_loans)    AS out_now,
  (SELECT COUNT(*) FROM overdue_loans) AS overdue,
  ...
```

כל שאילתה בסוגריים מחושבת בנפרד והופכת לעמודה אחת. הוסיפו את `never_borrowed` (ספרים שה-id שלהם `NOT IN (SELECT book_id FROM loans)`) ואת `members` (מספר השורות ב-`members`).

## מעבר שלב אחר שלב

1. הריצו את ה-`UPDATE` עבור השאלה 5 עם `returned_on = '2025-03-15'`.
2. צרו את שני האינדקסים שלמעלה.
3. כתבו את לוח המחוונים כמשפט האחרון, עם העמודות `total_loans`, `out_now`, `overdue`, `never_borrowed` ו-`members` בסדר הזה.
4. בדקו שהמספרים הגיוניים: לפני העדכון 7 השאלות היו בחוץ, עכשיו אמור להיות 6. היו שתי השאלות מאחרות במקור; אחת הוחזרה עכשיו, ולכן אחת נשארת באיחור.

> **שימו לב:**
> - `UPDATE` בלי `WHERE` כותב מחדש את הטבלה כולה. תמיד בדקו שוב את התנאי.
> - עדכון עם סוג ערך שגוי: תאריכים חייבים להישאר בצורה `'YYYY-MM-DD'`, אחרת כל השוואת תאריכים נשברת.
> - יותר מדי אינדקסים מאטים הוספות ועדכונים, כי כל אחד צריך להישמר מעודכן. שימו אינדקס על מה ששואלים, לא על הכול.
> - `index idx_loans_member already exists` אומר שהרצתם `CREATE INDEX` פעמיים; בסקריפטים אמיתיים הוסיפו `IF NOT EXISTS`.
> - שאילתת משנה סקלרית שמחזירה כמה שורות או עמודות היא שגיאה, או שהיא משתמשת בשקט בשורה הראשונה. השתמשו ב-`COUNT`, ב-`SUM` או ב-`MAX` כדי להפוך אותה לערך יחיד.

## מה לבנות הלאה

* הוסיפו עמודה `copies` ל-`books` ומנעו השאלת יותר עותקים ממה שקיים.
* הוסיפו טבלה `fines` ו-view שמסכם קנסות לכל חבר.
* החליפו את `'2025-03-15'` ב-`date('now')` בכל מקום וצפו איך הדוחות משתנים עם הלוח.
* השתמשו ב-`EXPLAIN QUERY PLAN SELECT ...` כדי לראות אם SQLite משתמשת באינדקסים שלכם.
* עטפו את ההחזרה בטרנזקציה (`BEGIN; ... COMMIT;`) כדי ששינוי חצי גמור לא יישמר לעולם.

> **תורכם:** השאירו את המשפטים הקודמים, ואז הוסיפו (1) את ה-`UPDATE` שקובע `returned_on` ל-`'2025-03-15'` עבור השאלה 5, (2) את שני משפטי ה-`CREATE INDEX`, ו-(3) את `SELECT` לוח המחוונים עם `total_loans`, `out_now`, `overdue`, `never_borrowed` ו-`members`, כמשפט האחרון.
