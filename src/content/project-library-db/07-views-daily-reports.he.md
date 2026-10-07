---
title: "שלב 7: Views ודוחות יומיים"
summary: "שומרים שאילתות ארוכות בשם בעזרת CREATE VIEW, ובונים דוח איחורים מ-views שנשענים זה על זה."
hints:
  - "view הוא SELECT שמור עם שם: CREATE VIEW name AS SELECT .... אחר כך שואלים אותו כמו טבלה. views יכולים לקרוא מ-views אחרים, ולכן יוצרים אותם לפי הסדר."
  - "loan_details = החיבור של ארבע הטבלאות עם שמות עמודות חדשים (loan_id, member, book, author, ...). open_loans = SELECT * FROM loan_details WHERE returned_on IS NULL. overdue_loans = SELECT loan_id, member, book, due_on, <חישוב הימים> AS days_overdue FROM open_loans WHERE due_on < '2025-03-15'."
  - "CREATE VIEW overdue_loans AS SELECT loan_id, member, book, due_on, CAST(julianday('2025-03-15') - julianday(due_on) AS INTEGER) AS days_overdue FROM open_loans WHERE due_on < '2025-03-15'; ואז SELECT member, book, days_overdue FROM overdue_loans ORDER BY days_overdue DESC, member;"
messages:
  - "צרו את ה-view בשם loan_details."
  - "צרו את ה-view בשם open_loans."
  - "צרו את ה-view בשם overdue_loans."
  - "סיימו בשאילתה על ה-view בשם overdue_loans."
quiz:
  - q: "האם ל-view יש עותק משלו של הנתונים?"
    options: ["כן, זה עותק שצריך לרענן", "לא, הוא שומר שאילתה שרצה על הטבלאות הנוכחיות בכל פעם", "רק אם יש לו אינדקס"]
  - q: "למה views שימושיים לדוחות יומיים?"
    options: ["הם מקטינים את הנתונים", "הם כותבים את הנתונים לקובץ", "חיבור ארוך נכתב פעם אחת ונעשה בו שימוש חוזר בשם קצר וקריא"]
  - q: "ה-view בשם overdue_loans קורא FROM open_loans. מה צריך לעשות לגבי הסדר?"
    options: ["ליצור קודם את open_loans, כי overdue_loans תלוי בו", "כלום, SQLite מסדרת את זה לבד", "ליצור קודם את overdue_loans"]
---
הספרנית מריצה כל בוקר את אותם דוחות. במקום להקליד מחדש חיבורים ארוכים, מסד נתונים מאפשר לשמור שאילתה בשם. השאילתה השמורה נקראת **view** (תצוגה).

## איפה אנחנו

במחברת שלכם יש עכשיו ארגז כלים שלם: חיפושים, חיבורים, חישובי איחור, דירוגי פופולריות ומלאי מת. כל דוח חוזר על אותו חיבור ארוך של loans, members, books ו-authors.

## מה נוסיף

שלושה views שהופכים דוחות יומיים לשורה אחת:

* `loan_details`: כל השאלה עם שמות החבר, הספר והמחבר שכבר חוברו אליה.
* `open_loans`: רק השאלות שלא הוחזרו.
* `overdue_loans`: השאלות פתוחות שעבר מועד ההחזרה שלהן, עם `days_overdue`.

## מהו view

view הוא **SELECT שמור עם שם**. הוא לא שומר נתונים משלו. בכל פעם ששואלים את ה-view, מסד הנתונים מריץ את השאילתה השמורה על הטבלאות הנוכחיות, ולכן התשובה תמיד מעודכנת.

```sql
CREATE VIEW open_loans AS
SELECT * FROM loan_details
WHERE returned_on IS NULL;

SELECT * FROM open_loans;   -- use it like a table
```

למה זה חשוב באפליקציה אמיתית:

* **שימוש חוזר**: כותבים את החיבור פעם אחת ומשתמשים בו בכל מקום.
* **קריאות**: `SELECT member, book FROM overdue_loans` נקרא כמו אנגלית.
* **בטיחות**: אפשר לתת לעמית גישה ל-view שמסתיר עמודות שלא רוצים שיראה.
* **שכבות**: אפשר לבנות views על גבי views אחרים, כמו אבני בניין.

## מעבר שלב אחר שלב

1. **`loan_details`**: קחו את החיבור משלב 3 ותנו לעמודות שמות ידידותיים. השאירו את `loan_id`, את התאריכים ואת העמודה `returned_on` כדי שה-views הבאים יוכלו לסנן לפיהם:

```sql
CREATE VIEW loan_details AS
SELECT l.id AS loan_id, m.name AS member, b.title AS book, a.name AS author,
       l.loaned_on, l.due_on, l.returned_on
FROM loans AS l
JOIN members AS m ON m.id = l.member_id
JOIN books   AS b ON b.id = l.book_id
JOIN authors AS a ON a.id = b.author_id;
```

2. **`open_loans`**: בחרו הכול מ-`loan_details` כאשר `returned_on IS NULL`.
3. **`overdue_loans`**: בחרו מ-`open_loans` את `loan_id`, `member`, `book`, `due_on`, ואת אותו חישוב `days_overdue` כמו בשלב 4, והשאירו רק שורות עם `due_on < '2025-03-15'`.
4. סיימו בשאילתה על ה-view: `member`, `book` ו-`days_overdue` מתוך `overdue_loans`, מהמאחר ביותר ואילך, ואז לפי שם החבר. השוו לתוצאה משלב 4: התשובה זהה, אבל השאילתה היא שלוש שורות.

הסדר חשוב: view חייב להיווצר אחרי ה-views שהוא משתמש בהם. views נוצרים פעם אחת; הרצת `CREATE VIEW` על שם שכבר קיים נותנת שגיאה. כאן כל הרצה מתחילה ממסד נתונים חדש, ולכן זו לא בעיה. במסד נתונים אמיתי הייתם כותבים קודם `DROP VIEW IF EXISTS name;`.

> **שימו לב:**
> - `no such table: loan_details` אומר שה-view חסר, כתוב עם שגיאת איות או נוצר אחרי שהשתמשו בו.
> - view לא שומר את תאריך "היום". אצלנו הוא כתוב קבוע כ-`'2025-03-15'`; בפרודקשן משתמשים ב-`date('now')`.
> - `SELECT *` בתוך view מקפיא את רשימת העמודות ברגע היצירה בחלק ממסדי הנתונים. עדיף לציין שמות עמודות ב-views שתשמרו.
> - views אינם מהירים יותר מהשאילתה שבתוכם (SQLite פשוט מריצה את השאילתה השמורה). אינדקסים הם מה שמאיץ שאילתות (בשלב הבא).
> - `table loan_details already exists` מופיעה אם יוצרים את אותו view פעמיים בסקריפט.

> **תורכם:** השאירו את השאילתות הקודמות. צרו את ה-views בשם `loan_details`, `open_loans` ו-`overdue_loans` כפי שמתואר, ואז סיימו עם `SELECT member, book, days_overdue FROM overdue_loans ORDER BY days_overdue DESC, member;` כמשפט האחרון.
