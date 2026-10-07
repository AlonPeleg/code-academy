---
title: "טבלאות, אילוצים, אינדקסים ו-views"
summary: "תכננו טבלה משלכם עם כללים שמסד הנתונים אוכף, האיצו אותה עם אינדקס ושמרו שאילתה כ-view."
hints:
  - "שלושה סוגי פקודות CREATE, כולן נכתבות לפני ה-INSERT או ה-SELECT האחרון לפי הסדר הנדרש: קודם הטבלה (ה-INSERT זקוק לה), אחר כך האינדקס, ואז ה-view. אילוצים נכתבים אחרי סוג העמודה, כמו NOT NULL או CHECK (...)."
  - "CREATE TABLE reviews (id INTEGER PRIMARY KEY, student_id INTEGER NOT NULL, course_id INTEGER NOT NULL, rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5), comment TEXT DEFAULT 'no comment', UNIQUE (student_id, course_id));   ואז CREATE INDEX idx_reviews_course ON reviews (course_id);"
  - "CREATE VIEW course_ratings AS SELECT c.title, COUNT(*) AS reviews, ROUND(AVG(r.rating), 1) AS avg_rating FROM reviews AS r JOIN courses AS c ON c.id = r.course_id GROUP BY c.id;"
quiz:
  - q: "מה אילוץ CHECK עושה?"
    options: ["קורא את הטבלה כדי למצוא טעויות מאוחר יותר", "ממיין את השורות", "גורם למסד הנתונים לדחות כל שורה שמפרה את הכלל, כמו דירוג 9"]
  - q: "מהו view?"
    options: ["עותק של הנתונים שנשמר בטבלה שנייה", "שאילתה שמורה בעלת שם שאפשר לבצע עליה SELECT כמו על טבלה", "תמונה של הטבלה"]
  - q: "מה המטרה העיקרית של אינדקס?"
    options: ["למצוא שורות מהר יותר, כמו האינדקס בסוף ספר, במחיר של מקום נוסף וכתיבה איטית יותר", "להפוך את הטבלה לקריאה בלבד", "להסיר שורות כפולות"]
  - q: "מה קורה כשמבצעים INSERT של ביקורת שנייה עם אותם student_id ו-course_id כמו ביקורת קיימת?"
    options: ["היא דורסת בשקט את השורה הישנה", "היא נדחית עם UNIQUE constraint failed", "נוספת שורה שנייה עם אותם ids"]
messages:
  - "צרו את הטבלה עם CREATE TABLE reviews (...)."
  - "סמנו את id כ-PRIMARY KEY."
  - "הגבילו את rating עם כלל CHECK (...)."
  - "הוסיפו כלל UNIQUE לזוג (student_id, course_id)."
  - "צרו אינדקס עם CREATE INDEX ... ON reviews (course_id)."
  - "צרו את ה-view עם CREATE VIEW course_ratings AS SELECT ..."
---

עד עכשיו **השתמשתם** בטבלאות שכבר היו קיימות. עכשיו **תתכננו** טבלה בעצמכם. יצירת טבלאות נקראת **DDL** (Data Definition Language, שפת הגדרת נתונים), והדבר החשוב ביותר שאפשר לעשות בה הוא להוסיף **כללים** כדי שנתונים רעים לא יוכלו להיכנס למסד הנתונים מלכתחילה.

## CREATE TABLE וסוגי עמודות

```sql
CREATE TABLE pets (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER DEFAULT 0
);
```

לכל עמודה יש שם וסוג. הסוגים העיקריים ב-SQLite הם `INTEGER` (מספרים שלמים), `REAL` (שברים עשרוניים), `TEXT` ו-`BLOB` (בתים גולמיים). המילים שאחרי הסוג הן **אילוצים** (constraints), כללים שמסד הנתונים בודק לכל שורה שאתם מוסיפים או משנים.

| אילוץ | משמעות |
| --- | --- |
| `PRIMARY KEY` | מזהה כל שורה, חייב להיות ייחודי. `INTEGER PRIMARY KEY` ממלא את עצמו ב-1, 2, 3, ... אם משמיטים אותו |
| `NOT NULL` | בעמודה חייב להיות ערך |
| `UNIQUE` | אין שתי שורות עם אותו ערך (`UNIQUE (a, b)` פירושו שהזוג חייב להיות ייחודי) |
| `DEFAULT x` | הערך שבו משתמשים כש-INSERT לא מזכיר את העמודה |
| `CHECK (condition)` | התנאי חייב להתקיים בכל שורה, למשל `CHECK (rating BETWEEN 1 AND 5)` |
| `REFERENCES other(id)` | מפתח זר: הערך חייב להתקיים בטבלה אחרת (SQLite אוכפת זאת רק אחרי `PRAGMA foreign_keys = ON`) |

אם כלל מופר, הפקודה נכשלת ושום דבר לא נשמר: `CHECK constraint failed: rating BETWEEN 1 AND 5` או `UNIQUE constraint failed: reviews.student_id, reviews.course_id`. זו בשורה טובה: הנתונים שלכם נשארים נקיים בלי קשר לאיזו תוכנה כותבת אליהם.

## אינדקסים

**אינדקס** (index) הוא קיצור דרך ממוין לעמודה אחת או יותר. בלעדיו, שאילתה כמו `WHERE course_id = 2` חייבת לקרוא **כל שורה**. עם אינדקס על `course_id` מסד הנתונים קופץ ישר לשורות המתאימות, כמו חיפוש מילה באינדקס שבסוף ספר.

```sql
CREATE INDEX idx_reviews_course ON reviews (course_id);
```

אינדקסים משנים את **המהירות**, אף פעם לא את התוצאה. המחיר: הם תופסים מקום והופכים את `INSERT`/`UPDATE` לאיטיים במעט, כי צריך לשמור על האינדקס מעודכן. הוסיפו אינדקס לעמודות שמסננים, מחברים או ממיינים לפיהן לעיתים קרובות, לא לכל עמודה. (מפתחות ראשיים ועמודות `UNIQUE` מקבלים אינדקס אוטומטית.) נתוני הדוגמה הקטנים כאן קטנים מדי כדי להרגיש הבדל, אבל טבלאות אמיתיות עם מיליוני שורות תלויות בהם.

## Views

**view** הוא שאילתה שמורה עם שם. בחירה ממנו מריצה את השאילתה שמאחוריו:

```sql
CREATE VIEW course_ratings AS
SELECT c.title, COUNT(*) AS reviews, ROUND(AVG(r.rating), 1) AS avg_rating
FROM reviews AS r
JOIN courses AS c ON c.id = r.course_id
GROUP BY c.id;

SELECT * FROM course_ratings;
```

view לא שומר נתונים משלו, ולכן הוא תמיד מעודכן, והוא מסתיר join מסובך מאחורי שם פשוט. מסירים דברים עם `DROP VIEW name`, ‏`DROP INDEX name` ו-`DROP TABLE name`. (הוסיפו `IF EXISTS` כדי למנוע שגיאה כשהם חסרים.)

## הסדר חשוב, ורק התוצאה האחרונה מוצגת

הריצו את הפקודות מלמעלה למטה: הטבלה חייבת להתקיים לפני ההוספה, וה-view לפני שבוחרים ממנו. כמו בשיעורים הקודמים, לוח התוצאות מציג את התוצאה **האחרונה**, ולכן סיימו עם `SELECT`. כל הרצה מתחילה מעותק חדש של נתוני הדוגמה, ולכן הטבלאות החדשות שלכם נעלמות אחר כך ואפשר להתנסות בחופשיות.

> **שימו לב:**
> - `table reviews already exists`: הרצתם `CREATE TABLE` פעמיים. השתמשו ב-`CREATE TABLE IF NOT EXISTS` בסקריפטים שרצים שוב ושוב.
> - `no such table: reviews`: ה-`INSERT` או ה-view נמצאים לפני ה-`CREATE TABLE`.
> - פסיק אחרי הגדרת העמודה האחרונה: `near ")": syntax error`.
> - `NOT NULL constraint failed: reviews.rating`: הוספתם שורה בלי ערך לעמודה חובה שאין לה ברירת מחדל.
> - הוספת אינדקס לכל דבר. כל אינדקס נוסף מאט כתיבה.

> **תורכם:** צרו את הטבלה `reviews` עם האילוצים מההערות, צרו את האינדקס `idx_reviews_course`, וצרו את ה-view בשם `course_ratings`. ה-`SELECT` הסופי יציג אז כל קורס שקיבל ביקורות עם מספר הביקורות והדירוג הממוצע שלו.
