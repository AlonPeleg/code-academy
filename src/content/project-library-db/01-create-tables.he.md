---
title: "שלב 1: תכנון ויצירה של הטבלאות"
summary: "יוצרים את הטבלאות authors ו-books עם מפתחות ואילוצים, ומכניסים את השורות הראשונות."
hints:
  - "טבלה נוצרת עם CREATE TABLE name (column definitions). כל הגדרה היא: column_name TYPE rules, מופרדות בפסיקים. הסתכלו על הטבלה authors כעל דוגמה."
  - "עבור books: id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER NOT NULL REFERENCES authors(id), genre TEXT, year INTEGER CHECK (year > 1400), pages INTEGER CHECK (pages > 0). ספר 10 צריך INSERT INTO books (title, author_id, genre, year, pages) VALUES (...)."
  - "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER NOT NULL REFERENCES authors(id), genre TEXT, year INTEGER CHECK (year > 1400), pages INTEGER CHECK (pages > 0)); ואז INSERT INTO books (title, author_id, genre, year, pages) VALUES ('Parable of the Sower', 5, 'Science Fiction', 1993, 345); ולבסוף SELECT id, title, year FROM books ORDER BY id;"
quiz:
  - q: "מהו מפתח זר (foreign key)?"
    options: ["עמודה שחייבת להיות ייחודית בטבלה שלה", "עמודה שהערכים שלה מצביעים על המפתח הראשי של טבלה אחרת", "סיסמה ששמורה במסד הנתונים"]
    explain: "author_id בטבלה books מחזיק id מהטבלה authors. הקישור הזה הוא המפתח הזר."
  - q: "למה שומרים את ה-id של הסופר בטבלה books ולא מעתיקים את שם הסופר לכל ספר?"
    options: ["מספרים תמיד מהירים יותר מטקסט", "SQL לא יכולה לשמור שמות פעמיים", "כל עובדה נשמרת פעם אחת (נרמול), ולכן תיקון צריך להיעשות במקום אחד בלבד"]
  - q: "מה CHECK (pages > 0) עושה?"
    options: ["היא גורמת למסד הנתונים לדחות כל שורה שבה pages לא גדול מ-0", "היא מדפיסה אזהרה אבל שומרת את השורה בכל זאת", "היא יוצרת אינדקס על pages"]
messages:
  - "צרו את הטבלה books עם CREATE TABLE books (...)."
  - "קשרו את author_id אל authors עם REFERENCES authors(id)."
  - "הוסיפו כללי CHECK (...) עבור year ו-pages."
  - "התחילו את הטבלה books עם id INTEGER PRIMARY KEY."
---
כל אפליקציה אמיתית מתחילה בשאלה: איפה הנתונים ישבו, ואיזו צורה תהיה להם? בפרויקט הזה תבנו את מסד הנתונים של ספרייה ציבורית קטנה, ואחר כך תשאלו אותו את השאלות שספרנית שואלת כל יום. אבל לפני כל שאלה צריך טבלאות.

## איפה אנחנו עומדים

עדיין בשום מקום. מסד הנתונים שלמטה ריק לגמרי. זה הרגע הטוב ביותר לחשוב על **תכנון**, כי תכנון טוב הופך כל שאילתה עתידית לקלה, ותכנון גרוע הופך אותן לכואבות.

## מה נוסיף

בספרייה יש ארבעה סוגי דברים: **סופרים** (authors), **ספרים** (books), **חברים** (members, אנשים שמשאילים) ו**השאלות** (loans, אדם אחד שמשאיל ספר אחד ביום אחד). ניתן לכל סוג טבלה משלו. בשלב הראשון הזה תיצרו את הטבלאות `authors` ו-`books` ותמלאו אותן; מהשלב השני ואילך הטבלאות members ו-loans (וכל הנתונים) כבר טעונות בשבילכם, כדי שנוכל להתרכז בשאלות.

## רעיונות תכנון במילים פשוטות

* **טבלה היא רשימה של סוג אחד של דבר.** כל שורה היא דבר אחד (ספר אחד), וכל עמודה היא עובדה אחת עליו (הכותרת שלו).
* **מפתח ראשי (primary key) מזהה שורה.** `id INTEGER PRIMARY KEY` נותן לכל ספר מספר משלו. ב-SQLite, אם משמיטים את ה-id בהכנסה, מסד הנתונים בוחר בשבילכם את המספר הפנוי הבא.
* **מפתח זר (foreign key) הוא קישור.** הטבלה books שומרת `author_id`, מספר שמצביע על שורה בטבלה `authors`. אנחנו לא מעתיקים את שם הסופר לכל ספר. ההרגל הזה נקרא **נרמול** (normalisation): שומרים כל עובדה בדיוק פעם אחת. אם סופר משנה את האיות של שמו, מתקנים שורה אחת ולא חמישים.
* **אילוצים (constraints) הם כללים שמסד הנתונים אוכף בשבילכם.** `NOT NULL` פירושו "חייב להיות ערך", `UNIQUE` פירושו "בלי כפילויות", `CHECK (year > 1400)` דוחה שנים לא הגיוניות, ו-`REFERENCES authors(id)` אומר שהמספר חייב להשתייך לסופר אמיתי.
* **תאריכים הם טקסט.** ל-SQLite אין סוג מיוחד לתאריכים. אנחנו שומרים תאריכים כטקסט בפורמט ISO, כמו `'2025-03-15'` (שנה-חודש-יום). הפורמט הזה ממוין נכון ופונקציות התאריך מבינות אותו.

## מדריך צעד אחר צעד

1. קראו את הטבלה המוכנה `authors` בקוד ההתחלה. שימו לב לרשימת העמודות אחרי `INSERT INTO authors`: היא מציינת את שמות העמודות, ולכן אי אפשר לבלבל בין סדר הערכים.
2. כתבו `CREATE TABLE books (...)`. הצורה היא:

```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id),
  genre TEXT,
  year INTEGER CHECK (year > 1400),
  pages INTEGER CHECK (pages > 0)
);
```

   כל שורה היא `column_name TYPE rules`. הסוגים הם `INTEGER` (מספרים שלמים) ו-`TEXT`. פסיקים מפרידים בין העמודות, ואין פסיק אחרי האחרונה.
3. ה-`INSERT` של ספרים 1 עד 9 כבר נמצא בקוד ההתחלה. הוא עובד רק אחרי שהטבלה קיימת, לכן שימו את ה-`CREATE TABLE` שלכם מעליו.
4. הוסיפו בעצמכם את ספר מספר 10 עם **רשימת עמודות** ובלי id:

```sql
INSERT INTO books (title, author_id, genre, year, pages)
VALUES ('...', 5, '...', 1993, 345);
```

5. סיימו עם `SELECT` שמציג את `id`, `title` ו-`year` של כל ספר לפי סדר ה-id. זו התוצאה שהבודק מסתכל עליה.

## איך נראות שתי הטבלאות האחרות

תפגשו אותן בשלבים הבאים, אז הנה הצורה שלהן. ל-`members` יש `id`, `name`, עמודת `email` עם `UNIQUE`, ו-`joined`. ל-`loans` יש `id`, `book_id` ו-`member_id` (שני מפתחות זרים), `loaned_on`, `due_on` ו-`returned_on`. השאלה שעדיין בחוץ מסומנת ב-`NULL` בעמודה `returned_on`, וכך בדיוק הספרנית תמצא בהמשך ספרים שלא הוחזרו.

> **שימו לב:**
> - `no such table: books` אומרת שה-`CREATE TABLE` חסר או שהוא בא אחרי ה-`INSERT`. הסדר חשוב.
> - `near ")": syntax error` בדרך כלל אומרת שיש פסיק מיותר אחרי העמודה האחרונה.
> - `FOREIGN KEY constraint failed` אומרת שיש `author_id` שלא קיים ב-`authors`. הפעלנו את הבדיקה עם `PRAGMA foreign_keys = ON;` (SQLite מקלה כברירת מחדל).
> - `CHECK constraint failed` אומרת שערך הפר את הכלל שלכם, למשל מספר עמודים שלילי.
> - מרכאות: ערכי טקסט כתובים במרכאות בודדות (`'Kindred'`). מרכאות כפולות מיועדות לשמות עמודות.

> **תורכם:** צרו את הטבלה `books` עם מפתח ראשי, `NOT NULL` על הכותרת והסופר, קישור ל-`authors`, וכללי `CHECK` עבור שנה ומספר עמודים. הריצו את ה-insert הנתון של ספרים 1 עד 9, הוסיפו את ספר 10 (`Parable of the Sower`, סופר 5, `Science Fiction`, 1993, 345 עמודים) בעזרת רשימת עמודות, וסיימו עם `SELECT id, title, year FROM books ORDER BY id;`.
